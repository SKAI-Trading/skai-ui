#!/usr/bin/env node
/**
 * sync.mjs — the only part of figma/ that reads Figma, and it never calls
 * Figma itself: it prints use_figma scripts, and ingests what they return.
 *
 *   status                                 tracked / stored / stale / missing, today's calls
 *   hash-script --file <key>               scripts returning {node: hash} for the file's tracked
 *        [--nodes a,b | --rest <result>]   frames (or just these, or a result's unreached ids)
 *   hash-ingest <result.json> [...]        record live hashes; a stored frame whose hash moved is stale
 *   extract-script [--limit N]             the next batch of stale or missing frames, one file per
 *        [--file <key>] [--nodes a,b]      script, worklist packets first
 *   extract-ingest <result.json> [...]     write store/<fileKey>/<node>.json and store/index.json
 *   record-call --kind <k> --file <key>    count a call that returned nothing ingestable
 *   --self-test                            runs without Figma; exits non-zero on any failure
 *
 * Scripts go to --out <dir> (default: the OS temp dir) and the path is printed;
 * --print writes a single script to stdout instead. Paste one into use_figma
 * for that file, save the returned JSON exactly as given, and ingest it.
 *
 * Budget: every *-script refuses when the ledger's calls for the UTC day plus
 * the calls it would plan pass FIGMA_DAILY_BUDGET (default 120). Every
 * *-ingest appends its ledger line BEFORE it writes, so a crash mid-ingest
 * still counts the call. A result carries the nonce its script was given and a
 * checksum over its own content: a result copied wrongly is refused (the call
 * is still counted), and the same result is never ingested twice.
 *
 * Extract results carry each frame packed (lib/transport.mjs, format z1; see
 * lib/TRANSPORT.md): base64 lines, each with a check, so a copying mistake is
 * named by line. A frame too big for one result arrives over several calls as
 * byte ranges of one stream and is decoded, checked and stored when the last
 * range is in.
 *
 * Tracked frames are figma-catalog/registry.json's frames that are not `gone`,
 * have a page, and whose page is not out of scope in figma-catalog/pages.json.
 * Nothing here writes to figma-catalog/.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalJson, fnv1a64, treeHash } from "./lib/canonical.mjs";
import * as pack from "./lib/pack.mjs";
import * as ledger from "./lib/ledger.mjs";
import * as transport from "./lib/transport.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** A transfer that would need more calls than this is parked, not continued. */
export const MAX_CALLS_PER_FRAME = 12;

/**
 * Paths and knobs for one run. The self-test builds one per scenario over a
 * temp directory; `hooks.beforeWrite` runs after an ingest's ledger line and
 * before its first store write.
 * @param {{figmaDir?: string, catalogDir?: string, env?: object, now?: () => Date, hooks?: {beforeWrite?: (kind: string) => void}}} [opts]
 */
export function context({ figmaDir = HERE, catalogDir = path.join(HERE, "..", "figma-catalog"), env = process.env, now = () => new Date(), hooks = {} } = {}) {
  return {
    figmaDir,
    catalogDir,
    env,
    now,
    hooks,
    storeDir: path.join(figmaDir, "store"),
    indexFile: path.join(figmaDir, "store", "index.json"),
    stateFile: path.join(figmaDir, "store", "sync-state.json"),
    ledgerFile: path.join(figmaDir, "ledger", "calls.jsonl"),
  };
}

// ── files ────────────────────────────────────────────────────────────────────

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback);
const rel = (ctx, p) => path.relative(ctx.figmaDir, p).split(path.sep).join("/");

export const loadIndex = (ctx) => readJson(ctx.indexFile, { v: 1, syncedAt: null, frames: {} });
export const loadState = (ctx) => {
  const s = readJson(ctx.stateFile, { v: 1, live: {}, partial: {} });
  s.live ||= {};
  s.partial ||= {};
  return s;
};

/** One entry per line, keys sorted, so a sync's diff reads frame by frame. */
function writeKeyed(file, head, key, map) {
  const keys = Object.keys(map).sort();
  const body = keys.map((k) => `${JSON.stringify(k)}:${JSON.stringify(map[k])}`).join(",\n");
  const top = Object.entries(head)
    .map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)},`)
    .join("");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `{${top}${JSON.stringify(key)}:{${keys.length ? "\n" + body + "\n" : ""}}}\n`);
}
export const writeIndex = (ctx, idx) => writeKeyed(ctx.indexFile, { v: 1, syncedAt: idx.syncedAt }, "frames", idx.frames);
export const writeState = (ctx, st) => {
  writeKeyed(ctx.stateFile, { v: 1, partial: st.partial }, "live", st.live);
};

const NODE_KEYS = ["id", "t", "n", "b", "vis", "op", "l", "r", "f", "s", "sw", "sa", "fx", "clip", "tx", "ci", "ref", "h"];
function nodeHead(n) {
  const o = {};
  for (const k of NODE_KEYS) if (n[k] !== undefined) o[k] = n[k];
  for (const k of Object.keys(n).sort()) if (k !== "c" && o[k] === undefined && n[k] !== undefined) o[k] = n[k];
  return JSON.stringify(o);
}
function nodeLines(n, ind) {
  const head = nodeHead(n);
  if (!n.c || !n.c.length) return ind + head;
  return `${ind}${head.slice(0, -1)},"c":[\n${n.c.map((k) => nodeLines(k, ind + " ")).join(",\n")}\n${ind}]}`;
}
/** A spec file: header fields one per line, then the tree one node per line. */
export function renderSpec(spec) {
  const head = ["v", "fileKey", "node", "page", "name", "hash", "syncedAt", "partOf"]
    .filter((k) => spec[k] !== undefined)
    .map((k) => ` ${JSON.stringify(k)}: ${JSON.stringify(spec[k])}`);
  return `{\n${head.join(",\n")},\n "tree":\n${nodeLines(spec.tree, "  ")}\n}\n`;
}

export function loadResult(file) {
  const raw = fs.readFileSync(file, "utf8");
  if (/\/\/\s*truncated to 20kb/i.test(raw)) throw new IngestError(`${file}: use_figma cut this result at 20 KB; plan a smaller batch`);
  let doc;
  try {
    doc = JSON.parse(raw);
    if (typeof doc === "string") doc = JSON.parse(doc);
  } catch (e) {
    throw new IngestError(`${file}: not JSON (${e.message})`);
  }
  return doc;
}

export class IngestError extends Error {}

export function sumOk(result) {
  if (!result || typeof result.sum !== "string") return false;
  const { sum, ...rest } = result;
  return fnv1a64(canonicalJson(rest)) === sum;
}

// ── catalog ──────────────────────────────────────────────────────────────────

export function loadCatalog(ctx) {
  if (ctx._catalog) return ctx._catalog;
  const registry = readJson(path.join(ctx.catalogDir, "registry.json"), { frames: {} });
  const pagesJson = readJson(path.join(ctx.catalogDir, "pages.json"), { pages: [] });
  const coverage = readJson(path.join(ctx.catalogDir, "coverage.json"), null);
  ctx._catalog = { registry, pagesJson, coverage, frames: pack.trackedFrames(registry, pagesJson) };
  return ctx._catalog;
}

async function packetRank(ctx) {
  if (ctx.packets) return { rank: pack.rankOf(ctx.packets), why: null };
  const { registry, coverage } = loadCatalog(ctx);
  if (!coverage) return { rank: pack.rankOf([]), why: "figma-catalog/coverage.json is missing, so no worklist order" };
  const { packets, why } = await pack.worklistPackets(ctx.catalogDir, registry, coverage);
  return { rank: pack.rankOf(packets), why };
}

// ── status ───────────────────────────────────────────────────────────────────

export function status(ctx) {
  const { frames } = loadCatalog(ctx);
  const idx = loadIndex(ctx).frames;
  const st = loadState(ctx);
  const byFile = {};
  const out = { tracked: frames.length, stored: 0, stale: 0, missing: 0, byFile };
  for (const f of frames) {
    const b = (byFile[f.fileKey] ||= { tracked: 0, stored: 0, stale: 0, missing: 0 });
    b.tracked++;
    const e = idx[f.key];
    if (!e) {
      b.missing++;
      out.missing++;
      continue;
    }
    b.stored++;
    out.stored++;
    if (e.stale) {
      b.stale++;
      out.stale++;
    }
  }
  const tracked = new Set(frames.map((f) => f.key));
  out.parts = Object.values(idx).filter((e) => e.partOf).length;
  out.untracked = Object.keys(idx).filter((k) => !idx[k].partOf && !tracked.has(k)).length;
  out.inTransfer = Object.keys(st.partial).length;
  out.oversize = Object.keys(st.partial).filter((k) => st.partial[k].oversize);
  out.liveHashed = Object.values(st.live).filter((l) => l.h).length;
  out.notFoundLive = Object.keys(st.live).filter((k) => st.live[k].gone);
  const day = ledger.utcDay(ctx.now());
  const budget = ledger.budgetFrom(ctx.env);
  const used = ledger.callsOn(ledger.readLedger(ctx.ledgerFile), day);
  out.calls = { day, used, budget, left: Math.max(0, budget - used) };
  return out;
}

function printStatus(s) {
  const fk = (k) => k.slice(0, 4);
  console.log(`tracked   ${s.tracked}  (${Object.entries(s.byFile).map(([k, b]) => `${fk(k)} ${b.tracked}`).join(" · ")})`);
  console.log(`stored    ${s.stored}  stale ${s.stale}  missing ${s.missing}  (+${s.parts} split part files, ${s.untracked} stored frames no longer tracked)`);
  for (const [k, b] of Object.entries(s.byFile)) console.log(`  ${k}  stored ${b.stored}/${b.tracked}  stale ${b.stale}  missing ${b.missing}`);
  console.log(`transfer  ${s.inTransfer} frame(s) part-way${s.oversize.length ? `, parked as oversize: ${s.oversize.join(", ")}` : ""}`);
  console.log(`live      ${s.liveHashed} frame(s) with a live hash on record${s.notFoundLive.length ? `; not found in Figma: ${s.notFoundLive.join(", ")}` : ""}`);
  console.log(`calls     ${s.calls.used} of ${s.calls.budget} spent on ${s.calls.day} (UTC), ${s.calls.left} left`);
}

// ── scripts ──────────────────────────────────────────────────────────────────

export function planHashScripts(ctx, { file, nodes = null }) {
  if (!file) throw new Error("hash-script needs --file <fileKey>");
  const { frames } = loadCatalog(ctx);
  let list = frames.filter((f) => f.fileKey === file);
  if (nodes && nodes.length) {
    const want = new Set(nodes.map(pack.colonId));
    const known = new Map(list.map((f) => [f.node, f]));
    list = [...want].map((n) => known.get(n) || { node: n, pageId: null });
  }
  if (!list.length) throw new Error(`no tracked frames for file ${file}`);
  const groups = pack.planHashGroups(list);
  const day = ledger.utcDay(ctx.now());
  const budget = ledger.budgetFrom(ctx.env);
  const lines = ledger.readLedger(ctx.ledgerFile);
  ledger.assertBudget(lines, { day, budget, need: 1 });
  const left = budget - ledger.callsOn(lines, day);
  const take = groups.slice(0, left);
  return {
    total: groups.length,
    frames: list.length,
    left,
    scripts: take.map((g) => {
      const nonce = pack.newNonce();
      return { nonce, ids: g.ids.length, text: pack.hashScript({ file, nonce, pages: g.pages, ids: g.ids, ms: ctx.ms }) };
    }),
  };
}

/** @param {{file?: string|null, nodes?: string[]|null, limit?: number, budget?: number}} [opts] */
export async function planExtractScript(ctx, opts = {}) {
  const { file = null, nodes = null, limit = undefined, budget = undefined } = opts;
  const { frames } = loadCatalog(ctx);
  const { rank, why } = await packetRank(ctx);
  const day = ledger.utcDay(ctx.now());
  const cap = ledger.budgetFrom(ctx.env);
  const left = ledger.assertBudget(ledger.readLedger(ctx.ledgerFile), { day, budget: cap, need: 1 });
  const plan = pack.planExtract({ frames, index: loadIndex(ctx), state: loadState(ctx), rank, file, nodes, limit, budget });
  if (!plan) return { plan: null, why, left };
  const nonce = pack.newNonce();
  const text = pack.extractScript({ file: plan.file, nonce, pages: plan.pages, ids: plan.ids, budget, ms: ctx.ms, split: ctx.split, minCut: ctx.minCut });
  return { plan, nonce, text, why, left };
}

// ── ingest ───────────────────────────────────────────────────────────────────

function openIngest(ctx, result, kind) {
  if (!result || result.v !== 1 || result.kind !== kind) throw new IngestError(`not a ${kind} result (want v:1, kind:"${kind}")`);
  if (typeof result.file !== "string" || !/^[0-9A-Za-z]{22,128}$/.test(result.file)) throw new IngestError("result names no file key");
  if (typeof result.nonce !== "string" || !result.nonce) throw new IngestError("result carries no nonce; use record-call to count the call");
  const lines = ledger.readLedger(ctx.ledgerFile);
  const seen = ledger.nonceSeen(lines, result.nonce);
  if (seen === "ok") throw new IngestError(`result ${result.nonce} was already ingested`);
  const sum = sumOk(result);
  const format = kind !== "extract" || (result.enc === transport.ENC && (result.dz === transport.DICT_ID || result.dz === transport.DICT_NONE) && (result.segs || []).every((s) => !transport.badLines(s).length));
  const ok = sum && format;
  const frames = kind === "hash" ? Object.keys(result.frames || {}).length : (result.segs || []).length;
  const at = ctx.now().toISOString();
  ledger.appendLine(ctx.ledgerFile, { at, day: at.slice(0, 10), kind, file: result.file, calls: seen ? 0 : 1, frames, nonce: result.nonce, ok });
  if (!sum) {
    const where = (result.segs || [])
      .map((s, i) => [i, s, transport.badLines(s)])
      .filter(([, , bad]) => bad.length)
      .map(([i, s, bad]) => `segment ${i} (${s && s.f}) line${bad.length > 1 ? "s" : ""} ${bad.join(", ")} of ${(s.z || []).length}`);
    const hint = where.length ? ` The lines that no longer match their checks: ${where.join("; ")}.` : "";
    throw new IngestError(`result ${result.nonce}: checksum does not match its content, so it was changed after Figma returned it.${hint} Copy it again exactly and re-ingest (the call is already counted).`);
  }
  if (!format) throw new IngestError(`result ${result.nonce} was packed as ${result.enc || "plain JSON"} with dictionary ${result.dz || "none"}; this checkout reads ${transport.ENC} with dictionary ${transport.DICT_ID} (or ${transport.DICT_NONE}, none). Make the script again from this checkout (the call is already counted).`);
  if (ctx.hooks.beforeWrite) ctx.hooks.beforeWrite(kind);
  return at;
}

export function hashIngest(ctx, result) {
  const at = openIngest(ctx, result, "hash");
  const idx = loadIndex(ctx);
  const st = loadState(ctx);
  const out = { hashed: 0, stale: [], fresh: 0, unstored: 0, missing: result.missing || [], errors: result.errors || {}, rest: result.rest || [] };
  for (const [node, h] of Object.entries(result.frames || {})) {
    const key = pack.frameKey(result.file, node);
    st.live[key] = { h, at };
    out.hashed++;
    const e = idx.frames[key];
    if (!e) out.unstored++;
    else if (e.hash !== h) {
      e.stale = true;
      out.stale.push(key);
    } else {
      delete e.stale;
      out.fresh++;
    }
  }
  for (const node of out.missing) {
    const key = pack.frameKey(result.file, node);
    st.live[key] = { gone: true, at };
    if (idx.frames[key]) idx.frames[key].stale = true;
  }
  writeIndex(ctx, idx);
  writeState(ctx, st);
  return out;
}

/** Rebuild parts from a flat pre-order stream: {_p,_h} opens a part, `_d` is depth. */
export function assemble(x) {
  const parts = [];
  let cur = null;
  const stack = [];
  for (const it of x) {
    if (it._p !== undefined) {
      cur = { node: it._p, hash: it._h, tree: null };
      parts.push(cur);
      stack.length = 0;
      continue;
    }
    if (!cur) throw new Error("stream starts with a node, not a part marker");
    const { _d, ...node } = it;
    if (_d === 0) {
      if (cur.tree) throw new Error(`part ${cur.node} has two roots`);
      cur.tree = node;
      stack.length = 0;
      stack.push(node);
      continue;
    }
    const parent = stack[_d - 1];
    if (!Number.isInteger(_d) || _d < 1 || !parent) throw new Error(`node ${node.id || node.ref} at depth ${_d} has no parent`);
    (parent.c ||= []).push(node);
    stack.length = _d;
    stack.push(node);
  }
  for (const p of parts) if (!p.tree) throw new Error(`part ${p.node} is empty`);
  return parts;
}

function storeFrame(ctx, idx, fileKey, key, p, at) {
  const parts = assemble(p.x);
  const bad = parts.filter((q) => treeHash(q.tree) !== q.hash).map((q) => q.node);
  if (bad.length) return { key, error: `hash does not match content for ${bad.join(", ")}` };
  if (parts[0].node !== key.slice(fileKey.length + 1) || parts[0].hash !== p.H) return { key, error: "first part is not the frame, or its hash is not the frame hash" };
  const frameFile = pack.nodeFile(parts[0].node);
  const keep = new Set();
  parts.forEach((q, i) => {
    const partKey = i ? `${key}/${q.node}` : key;
    const file = i
      ? path.join(ctx.storeDir, fileKey, frameFile, `${pack.nodeFile(q.node)}.json`)
      : path.join(ctx.storeDir, fileKey, `${frameFile}.json`);
    const spec = { v: 1, fileKey, node: q.node, page: p.pg, name: i ? q.tree.n : p.n, hash: q.hash, syncedAt: at, partOf: i ? key : undefined, tree: q.tree };
    const text = renderSpec(spec);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    const b = q.tree.b || [];
    idx.frames[partKey] = {
      page: p.pg,
      name: spec.name,
      w: i ? b[2] : p.w,
      h: i ? b[3] : p.h,
      hash: q.hash,
      syncedAt: at,
      bytes: Buffer.byteLength(text),
      path: rel(ctx, file),
      ...(i ? { partOf: key } : {}),
    };
    keep.add(partKey);
  });
  for (const k of Object.keys(idx.frames)) {
    if (idx.frames[k].partOf === key && !keep.has(k)) {
      const f = path.join(ctx.figmaDir, idx.frames[k].path);
      if (fs.existsSync(f)) fs.unlinkSync(f);
      delete idx.frames[k];
    }
  }
  return { key, parts: parts.length, hash: p.H };
}

/**
 * One z1 segment into the transfer on record. Returns the finished transfer
 * (every byte in) or null, and says why a slice was refused.
 */
function takeSlice(ctx, st, key, seg, dz, out) {
  const refuse = (error) => {
    delete st.partial[key];
    out.refused.push({ key, error });
    return null;
  };
  let bytes;
  try {
    if (!Array.isArray(seg.z)) throw new Error("the segment carries no packed stream");
    bytes = transport.fromBase64(seg.z.join(""));
  } catch (e) {
    return refuse(e.message);
  }
  let p = st.partial[key];
  if (seg.o === 0) p = { enc: transport.ENC, dz, H: seg.H, T: seg.T, R: seg.R, Z: seg.Z, zh: seg.zh, pg: seg.pg, n: seg.n, w: seg.w, h: seg.h, z: "", got: 0, calls: 0 };
  else if (!pack.continuable(p) || p.dz !== dz || p.H !== seg.H || p.got !== seg.o || p.Z !== seg.Z || p.zh !== seg.zh || p.T !== seg.T) {
    return refuse(`slice at byte ${seg.o} does not continue the transfer on record; it restarts from 0`);
  }
  const end = seg.o + bytes.length;
  if (end > p.Z) return refuse(`slice ends at byte ${end}, past the stream's ${p.Z}`);
  if (end < p.Z && bytes.length % 3) return refuse("a slice that is not the last must be a whole number of base64 groups");
  p.z += seg.z.join("");
  p.got = end;
  p.calls += 1;
  if (p.got < p.Z) {
    if (Math.ceil(p.Z / (p.got / p.calls)) > (ctx.maxCalls || MAX_CALLS_PER_FRAME)) p.oversize = true;
    st.partial[key] = p;
    out.partial.push({ key, have: p.got, of: p.Z, oversize: !!p.oversize });
    return null;
  }
  delete st.partial[key];
  return p;
}

export function extractIngest(ctx, result) {
  const at = openIngest(ctx, result, "extract");
  const idx = loadIndex(ctx);
  const st = loadState(ctx);
  const out = { stored: [], partial: [], refused: [], missing: result.missing || [], errors: result.errors || {}, rest: result.rest || [] };
  for (const seg of result.segs || []) {
    const key = pack.frameKey(result.file, seg.f);
    const p = takeSlice(ctx, st, key, seg, result.dz, out);
    if (!p) continue;
    let r;
    try {
      const { value } = transport.decode(p.z, p.zh, p.dz);
      if (!Array.isArray(value) || value.length !== p.T) throw new Error(`the stream holds ${Array.isArray(value) ? value.length : "no"} items, the frame declared ${p.T}`);
      r = storeFrame(ctx, idx, result.file, key, { ...p, x: value }, at);
    } catch (e) {
      r = { key, error: e.message };
    }
    if (r.error) out.refused.push(r);
    else {
      st.live[key] = { h: p.H, at };
      out.stored.push({ ...r, raw: p.R, packed: p.Z, calls: p.calls });
    }
  }
  if (out.stored.length) idx.syncedAt = at;
  writeIndex(ctx, idx);
  writeState(ctx, st);
  return out;
}

export function recordCall(ctx, { kind, file, note = "" }) {
  if (!kind || !file) throw new Error("record-call needs --kind and --file");
  const at = ctx.now().toISOString();
  ledger.appendLine(ctx.ledgerFile, { at, day: at.slice(0, 10), kind, file, calls: 1, frames: 0, ok: false, note: String(note).slice(0, 200) });
}

/** A stored spec re-hashed from its file: the check that the stored bytes are the live design. */
export function verifyStored(ctx, key) {
  const e = loadIndex(ctx).frames[key];
  if (!e || !fs.existsSync(path.join(ctx.figmaDir, e.path))) return null;
  const spec = JSON.parse(fs.readFileSync(path.join(ctx.figmaDir, e.path), "utf8"));
  return { key, index: e.hash, spec: spec.hash, recomputed: treeHash(spec.tree) };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const argOf = (args, flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const listOf = (s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : null);

function writeScript(dir, name, text) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, name);
  fs.writeFileSync(p, text);
  return p;
}

async function main(argv) {
  const [cmd, ...args] = argv;
  const ctx = context();
  if (argOf(args, "--ms")) ctx.ms = Number(argOf(args, "--ms"));
  const outDir = argOf(args, "--out") || path.join(os.tmpdir(), "skai-figma-sync");
  const print = args.includes("--print");
  const files = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
  try {
    if (cmd === "status") return printStatus(status(ctx));
    if (cmd === "hash-script") {
      const file = argOf(args, "--file");
      let nodes = listOf(argOf(args, "--nodes"));
      if (argOf(args, "--rest")) nodes = loadResult(argOf(args, "--rest")).rest || [];
      const r = planHashScripts(ctx, { file, nodes });
      if (print) {
        if (r.scripts.length !== 1) throw new Error(`--print needs exactly one script; this plan has ${r.total}`);
        return process.stdout.write(r.scripts[0].text + "\n");
      }
      console.log(`hash pass for ${file}: ${r.frames} frame(s) in ${r.total} script(s); the budget leaves ${r.left} call(s)`);
      if (r.scripts.length < r.total) console.log(`  only ${r.scripts.length} of ${r.total} written: the rest would pass today's budget`);
      for (const s of r.scripts) {
        const p = writeScript(outDir, `hash-${file}-${s.nonce}.js`, s.text);
        console.log(`  ${p}  (${s.ids} ids, script ${s.text.length} chars)`);
      }
      return;
    }
    if (cmd === "extract-script") {
      const limit = argOf(args, "--limit") ? Number(argOf(args, "--limit")) : undefined;
      const budget = argOf(args, "--budget") ? Number(argOf(args, "--budget")) : undefined;
      const r = await planExtractScript(ctx, { file: argOf(args, "--file") || null, nodes: listOf(argOf(args, "--nodes")), limit, budget });
      if (r.why) console.error(`note: ${r.why}`);
      if (!r.plan) return console.log("nothing to extract: every tracked frame is stored and none is stale");
      if (print) return process.stdout.write(r.text + "\n");
      const p = writeScript(outDir, `extract-${r.plan.file}-${r.nonce}.js`, r.text);
      console.log(`extract batch for ${r.plan.file}: ${r.plan.ids.length} frame(s), first ${r.plan.keys[0]}${r.plan.ids[0][1] ? ` (continuing at byte ${r.plan.ids[0][1]} of its packed stream)` : ""}`);
      console.log(`  ${p}  (script ${r.text.length} chars; ${r.left} call(s) left today after this one)`);
      return;
    }
    if (cmd === "hash-ingest" || cmd === "extract-ingest") {
      if (!files.length) throw new Error(`${cmd} needs a result file`);
      let failed = 0;
      for (const f of files) {
        try {
          const res = loadResult(f);
          const r = cmd === "hash-ingest" ? hashIngest(ctx, res) : extractIngest(ctx, res);
          const brief = { ...r, rest: `${r.rest.length} id(s) not reached` };
          console.log(`${f}: ${JSON.stringify(brief)}`);
          if (r.refused && r.refused.length) failed++;
        } catch (e) {
          failed++;
          console.error(`${f}: ${e.message}`);
        }
      }
      process.exitCode = failed ? 1 : 0;
      return;
    }
    if (cmd === "record-call") return recordCall(ctx, { kind: argOf(args, "--kind"), file: argOf(args, "--file"), note: argOf(args, "--note") });
    if (cmd === "verify") {
      for (const k of files) console.log(JSON.stringify(verifyStored(ctx, k)));
      return;
    }
    console.error("usage: node figma/sync.mjs status | hash-script --file <key> | hash-ingest <result> | extract-script | extract-ingest <result> | record-call | verify <key> | --self-test");
    process.exitCode = 2;
  } catch (e) {
    console.error(e.message);
    process.exitCode = e instanceof ledger.BudgetError ? 3 : 1;
  }
}

// ── self-test ────────────────────────────────────────────────────────────────

const FIXTURES = path.join(HERE, "lib", "fixtures");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/**
 * A read-only stand-in for the Plugin API, built from a fixture document.
 * Any write to a node, and any figma member the builder has no business
 * touching (createX, importXByKeyAsync, setCurrentPageAsync, currentPage...),
 * throws. Reading a property the fixture node does not define throws, as it
 * does in use_figma for a property the node's type lacks. A node's children
 * throw until its page has been loaded.
 */
export function mockFigma(doc) {
  const MIXED = Symbol("figma.mixed");
  const nodes = new Map();
  const loaded = new Set();
  const conv = (v) => (v === "__MIXED__" ? MIXED : v);
  const guard = (o, what) =>
    new Proxy(o, {
      get(t, k) {
        if (typeof k === "symbol" || k === "then" || k in t) return t[k];
        throw new Error(`in get_${String(k)}: no such property '${String(k)}' on ${what}`);
      },
      set() {
        throw new Error(`write to ${what}`);
      },
      defineProperty() {
        throw new Error(`write to ${what}`);
      },
      deleteProperty() {
        throw new Error(`write to ${what}`);
      },
    });
  const comps = {};
  for (const [id, c] of Object.entries(doc.components || {})) comps[id] = guard({ ...c, parent: c.parent ? guard({ ...c.parent }, id) : null }, id);
  const make = (raw, parent, pageId) => {
    const o = {};
    for (const [k, v] of Object.entries(raw)) if (!["children", "segments", "main"].includes(k)) o[k] = conv(v);
    o.parent = parent;
    const proxy = guard(o, raw.id);
    if (raw.type === "INSTANCE") o.getMainComponentAsync = async () => (raw.main ? comps[raw.main] || null : null);
    if (raw.segments) o.getStyledTextSegments = (fields) => raw.segments.map((s) => Object.fromEntries(Object.entries(s).filter(([k]) => k === "characters" || fields.includes(k))));
    if (raw.children) {
      const kids = raw.children.map((c) => make(c, proxy, pageId));
      Object.defineProperty(o, "children", {
        enumerable: true,
        get() {
          if (!loaded.has(pageId)) throw new Error(`children of ${raw.id} read before page ${pageId} was loaded`);
          return kids;
        },
      });
    }
    nodes.set(raw.id, proxy);
    return proxy;
  };
  for (const p of doc.pages) {
    const po = { id: p.id, type: "PAGE", name: p.name, parent: null };
    po.loadAsync = async () => {
      loaded.add(p.id);
    };
    const pp = guard(po, p.id);
    nodes.set(p.id, pp);
    for (const c of p.children) make(c, pp, p.id);
  }
  const api = {
    mixed: MIXED,
    root: guard({ name: doc.name || "Fixture" }, "root"),
    getNodeByIdAsync: async (id) => nodes.get(id) || null,
    getStyleByIdAsync: async (id) => (doc.styles && doc.styles[id] ? guard({ ...doc.styles[id] }, id) : null),
    variables: guard({ getVariableByIdAsync: async (id) => (doc.variables && doc.variables[id] ? { name: doc.variables[id] } : null) }, "variables"),
  };
  const figma = new Proxy(api, {
    get(t, k) {
      if (k in t) return t[k];
      throw new Error(`the builder touched figma.${String(k)}`);
    },
    set() {
      throw new Error("write to figma");
    },
  });
  return { figma, nodes, raw: doc };
}

/** Run a generated script exactly as use_figma would, and return what Figma would send back. */
export async function runScript(text, figma) {
  const out = await new AsyncFunction("figma", text)(figma);
  return JSON.parse(JSON.stringify(out));
}

/** The item list a segment holding a whole stream carries. */
const segItems = (seg) => transport.decode(seg.z.join(""), seg.zh).value;

/** A segment re-packed around other items, with every transport check made to agree. */
function repack(seg, items) {
  const e = transport.encode(items);
  const { z, zc } = transport.toLines(e.b64);
  return { ...seg, T: items.length, R: Buffer.byteLength(e.text), Z: e.bytes.length, zh: e.zh, o: 0, z, zc };
}
const resum = (r) => {
  delete r.sum;
  r.sum = fnv1a64(canonicalJson(r));
  return r;
};
const resultBytes = (r) => Buffer.byteLength(JSON.stringify(r));

function bigFrame(id, groups, perGroup) {
  const kids = [];
  for (let g = 0; g < groups; g++) {
    const inner = [];
    for (let i = 0; i < perGroup; i++) {
      inner.push({ id: `${id.split(":")[0]}:${1000 + g * 100 + i}`, type: "TEXT", name: `Row ${g}.${i} with a name long enough to weigh something`, x: 0, y: i * 20, width: 300, height: 20, characters: `Value ${g}.${i}`, fontName: { family: "Inter", style: "Regular" }, fontSize: 12, fontWeight: 400, lineHeight: { unit: "AUTO" }, letterSpacing: { unit: "PIXELS", value: 0 }, textStyleId: "", fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 1 }] });
    }
    kids.push({ id: `${id.split(":")[0]}:${900 + g}`, type: "FRAME", name: `Group ${g}`, x: 0, y: g * 1000, width: 300, height: 1000, layoutMode: "VERTICAL", itemSpacing: 0, children: inner });
  }
  return { id, type: "FRAME", name: "Big board", x: 0, y: 0, width: 400, height: 3000, children: kids };
}

/**
 * A board of about `count` nodes built to be awkward to carry: names drawn
 * from hard text (every escape, CJK, emoji, lone surrogates), text longer than
 * the 500-character cut, a chain nested 70 deep, and a frame name that is
 * mostly 3- and 4-byte characters, so a character count would under-measure
 * every result.
 */
function stressFrame(id, count, seed) {
  const r = transport.rng(seed);
  const pre = id.split(":")[0];
  let next = 1;
  const nid = () => `${pre}:${10000 + next++}`;
  const hard = (n) => Array.from({ length: n }, () => r.pick(transport.HARD_TEXT)).join("");
  const names = Array.from({ length: 60 }, () => hard(4 + r.int(14)));
  const solid = () => ({ type: "SOLID", color: { r: r.int(256) / 255, g: r.int(256) / 255, b: r.int(256) / 255 }, opacity: r.pick([1, 1, 0.5, 0.64]) });
  const leaf = () => {
    const k = r.int(3);
    const base = { id: nid(), name: r.pick(names), x: r.int(2880) / 2, y: r.int(1800) / 2, width: 1 + r.int(600), height: 1 + r.int(80) };
    if (k === 0) return { ...base, type: "TEXT", characters: hard(r.pick([3, 12, 40, 700])), fontName: { family: "Inter", style: "Regular" }, fontSize: r.pick([12, 14, 16]), fontWeight: 400, lineHeight: { unit: "AUTO" }, letterSpacing: { unit: "PIXELS", value: 0 }, textStyleId: "", fills: [solid()] };
    return { ...base, type: k === 1 ? "RECTANGLE" : "ELLIPSE", fills: [solid()], cornerRadius: r.int(3) * 4 };
  };
  const frame = (depth) => ({ id: nid(), type: "FRAME", name: r.pick(names), x: r.int(1440), y: r.int(900), width: 1 + r.int(1440), height: 1 + r.int(900), layoutMode: r.pick(["NONE", "HORIZONTAL", "VERTICAL"]), itemSpacing: r.int(5) * 4, children: [] });
  const root = { id, type: "FRAME", name: "交易 🎰 盘口 ".repeat(30) + "Spot", x: 0, y: 0, width: 1440, height: 900, children: [] };
  let chain = root;
  for (let d = 0; d < 70; d++) {
    const f = frame(d);
    chain.children.push(f);
    chain = f;
  }
  chain.children.push(leaf());
  const groups = [];
  while (next < count) {
    const g = frame(1);
    for (let i = 0, n = 5 + r.int(30); i < n && next < count; i++) g.children.push(r.next() < 0.15 ? { ...frame(2), children: [leaf(), leaf()] } : leaf());
    groups.push(g);
  }
  root.children.push(...groups);
  return root;
}

async function selfTest() {
  let pass = 0;
  let fail = 0;
  const check = (name, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `\n        ${typeof detail === "string" ? detail : JSON.stringify(detail).slice(0, 600)}`}`);
    ok ? pass++ : fail++;
  };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "figma-sync-selftest-"));
  const FILE = "FIXTUREFILEKEY00000000A";
  let clock = Date.parse("2026-09-24T08:00:00Z");
  const mkctx = (name, extra = {}) => {
    const dir = path.join(tmp, name);
    fs.mkdirSync(dir, { recursive: true });
    const c = context({ figmaDir: dir, catalogDir: path.join(dir, "catalog"), env: { FIGMA_DAILY_BUDGET: "120" }, now: () => new Date((clock += 1000)), ...extra });
    c._catalog = { frames: extra.frames || [] };
    c.packets = extra.packets || [];
    return c;
  };
  const docRaw = () => JSON.parse(fs.readFileSync(path.join(FIXTURES, "mock-file.json"), "utf8"));
  const expected = JSON.parse(fs.readFileSync(path.join(FIXTURES, "expected-10-1.json"), "utf8"));

  console.log("canonical form and hash");
  check("keys sort, whitespace goes, syncedAt drops at any depth", canonicalJson({ b: 1, a: { syncedAt: "x", z: [1, { y: 2, syncedAt: 3 }] }, syncedAt: "t" }) === '{"a":{"z":[1,{"y":2}]},"b":1}');
  check("undefined values drop, undefined slots and NaN become null, -0 is 0", canonicalJson({ u: undefined, a: [undefined, NaN, -0] }) === '{"a":[null,null,0]}');
  check("quote, backslash and control characters escape; other text is kept", canonicalJson(['q"\\', "a\nb\u0001", "✅ é 🎰"]) === '["q\\"\\\\","a\\u000ab\\u0001","✅ é 🎰"]');
  const refFnv = (s) => {
    let h = 0xcbf29ce484222325n;
    for (const b of Buffer.from(s, "utf8")) h = ((h ^ BigInt(b)) * 0x100000001b3n) & 0xffffffffffffffffn;
    return h.toString(16).padStart(16, "0");
  };
  check("FNV-1a 64 published vectors", fnv1a64("") === "cbf29ce484222325" && fnv1a64("a") === "af63dc4c8601ec8c" && fnv1a64("foobar") === "85944171f73967e8");
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const alphabet = ["a", "Z", "0", " ", "{", '"', "é", "✅", "🎰", "中", "\n"];
  let fnvBad = null;
  for (let i = 0; i < 300 && !fnvBad; i++) {
    let s = "";
    const n = Math.floor(rnd() * 60);
    for (let j = 0; j < n; j++) s += alphabet[Math.floor(rnd() * alphabet.length)];
    if (fnv1a64(s) !== refFnv(s)) fnvBad = s;
  }
  check("FNV-1a 64 equals a BigInt reference on 300 mixed-script strings", fnvBad === null, fnvBad);

  console.log("the builder, run as the generated script against a mocked Figma");
  const m1 = mockFigma(docRaw());
  const hs = pack.hashScript({ file: FILE, nonce: "n-hash-1", pages: ["1:1"], ids: ["10:1", "20:1", "99:99"] });
  check("a hash script stays under the script budget", hs.length < pack.SCRIPT_BUDGET, hs.length);
  let hr;
  try {
    hr = await runScript(hs, m1.figma);
  } catch (e) {
    hr = { error: e.message };
  }
  check("the hash script runs read-only and returns a hash per frame", hr.frames && /^[0-9a-f]{16}$/.test(hr.frames["10:1"]) && /^[0-9a-f]{16}$/.test(hr.frames["20:1"]), hr);
  check("an id Figma does not have is reported missing, not hashed", hr.missing && hr.missing.includes("99:99") && !("99:99" in (hr.frames || {})), hr.missing);
  check("the frame on a page the job did not list was loaded through its own page", hr.errors && Object.keys(hr.errors).length === 0, hr.errors);
  check("the result's checksum verifies", sumOk(hr));
  check("the result reports how long page loading and the rest took", Array.isArray(hr.ms) && hr.ms.length === 2 && hr.ms.every((x) => Number.isFinite(x) && x >= 0), hr.ms);
  const es = pack.extractScript({ file: FILE, nonce: "n-ext-1", pages: ["1:1", "2:1"], ids: [["10:1", 0, null]] });
  const er = await runScript(es, mockFigma(docRaw()).figma);
  const seg = er.segs && er.segs[0];
  const parts = seg ? assemble(segItems(seg)) : [];
  const tree = parts[0] && parts[0].tree;
  const diff = tree ? firstDiff(expected, tree) : "no tree";
  check("the spec tree equals the hand-checked fixture spec", diff === null, diff);
  check("the extract script's frame hash equals the hash script's for the same frame", seg && seg.H === hr.frames["10:1"], [seg && seg.H, hr.frames && hr.frames["10:1"]]);
  check("the frame hash is the FNV-1a of the canonical tree", tree && treeHash(tree) === seg.H);
  const again = seg ? transport.encode(segItems(seg)) : null;
  check("the script packs a frame to exactly the bytes the module does, dictionary and all", again && again.b64 === seg.z.join("") && again.bytes.length === seg.Z && again.zh === seg.zh && Buffer.byteLength(again.text) === seg.R, seg && [seg.Z, again && again.bytes.length]);

  console.log("ingest writes the spec, and the stored bytes hash to the live hash");
  const c1 = mkctx("ingest", { frames: [{ key: `${FILE}:10:1`, fileKey: FILE, node: "10:1", pageId: "1:1", order: 0 }] });
  const ir = extractIngest(c1, er);
  const v = verifyStored(c1, `${FILE}:10:1`);
  check("extract-ingest stores the frame", ir.stored.length === 1 && v !== null, ir);
  check("stored spec: index hash = file hash = hash recomputed from the file = live hash", v && v.index === v.spec && v.spec === v.recomputed && v.recomputed === hr.frames["10:1"], v);
  const specPath = path.join(c1.figmaDir, "store", FILE, "10-1.json");
  const specText = fs.existsSync(specPath) ? fs.readFileSync(specPath, "utf8") : "";
  check("the spec file is written with LF line endings and one node per line", !specText.includes("\r") && specText.split("\n").length > 10);
  const idx1 = loadIndex(c1).frames[`${FILE}:10:1`];
  check("the index entry holds page, name, size, hash, syncedAt, bytes, path", idx1 && idx1.page === "✅ Test" && idx1.w === 1440 && idx1.h === 900 && idx1.bytes === Buffer.byteLength(specText) && idx1.path === `store/${FILE}/10-1.json`, idx1);
  const lines1 = ledger.readLedger(c1.ledgerFile);
  check("the ingest counted one call in the ledger", lines1.length === 1 && lines1[0].calls === 1 && lines1[0].kind === "extract" && lines1[0].ok === true, lines1);
  let dup = null;
  try {
    extractIngest(c1, er);
  } catch (e) {
    dup = e.message;
  }
  check("the same result is refused the second time", /already ingested/.test(dup || ""), dup);

  console.log("hash-ingest marks change");
  const hrSame = { ...hr, nonce: "n-hash-2" };
  delete hrSame.sum;
  hrSame.sum = fnv1a64(canonicalJson(hrSame));
  const h1 = hashIngest(c1, hrSame);
  check("an unchanged live hash leaves the frame fresh", h1.fresh === 1 && h1.stale.length === 0 && !loadIndex(c1).frames[`${FILE}:10:1`].stale, h1);
  const m2 = mockFigma(docRaw());
  const title = m2.raw.pages[0].children[0].children[0];
  title.characters = "Buy No";
  const m2b = mockFigma(m2.raw);
  const hr2 = await runScript(pack.hashScript({ file: FILE, nonce: "n-hash-3", pages: ["1:1"], ids: ["10:1"] }), m2b.figma);
  check("changing one text node changes the frame hash", hr2.frames["10:1"] !== hr.frames["10:1"]);
  const h2 = hashIngest(c1, hr2);
  check("a moved live hash marks the stored frame stale", h2.stale.includes(`${FILE}:10:1`) && loadIndex(c1).frames[`${FILE}:10:1`].stale === true, h2);
  check("status counts it stale", status(c1).stale === 1);
  const moved = mockFigma(docRaw());
  moved.raw.pages[0].children[0].x = 99999;
  const hr3 = await runScript(pack.hashScript({ file: FILE, nonce: "n-hash-4", pages: ["1:1"], ids: ["10:1"] }), mockFigma(moved.raw).figma);
  check("moving the frame on the canvas does not change its hash", hr3.frames["10:1"] === hr.frames["10:1"]);

  console.log("the ledger and the budget");
  const c2 = mkctx("budget", { frames: [{ key: `${FILE}:10:1`, fileKey: FILE, node: "10:1", pageId: "1:1", order: 0 }] });
  const fill = (n, day) => {
    for (let i = 0; i < n; i++) ledger.appendLine(c2.ledgerFile, { at: `${day}T01:00:00Z`, day, kind: "hash", file: FILE, calls: 1, frames: 1, nonce: `f${i}`, ok: true });
  };
  fill(119, "2026-09-24");
  fill(30, "2026-09-23");
  let r119 = null;
  try {
    r119 = planHashScripts(c2, { file: FILE });
  } catch (e) {
    r119 = e;
  }
  check("119 calls today plus 1 fits a budget of 120 (yesterday's calls do not count)", r119 && r119.scripts && r119.scripts.length === 1, r119 && r119.message);
  fill(1, "2026-09-24");
  let r120 = null;
  try {
    planHashScripts(c2, { file: FILE });
  } catch (e) {
    r120 = e;
  }
  check("120 calls today plus 1 is refused, and the refusal says how many are left", r120 instanceof ledger.BudgetError && /0 left/.test(r120.message), r120 && r120.message);
  let r120e = null;
  try {
    await planExtractScript(c2, {});
  } catch (e) {
    r120e = e;
  }
  check("extract-script is refused the same way", r120e instanceof ledger.BudgetError, r120e && r120e.message);
  c2.env = { FIGMA_DAILY_BUDGET: "200" };
  let r200 = null;
  try {
    r200 = planHashScripts(c2, { file: FILE });
  } catch (e) {
    r200 = e;
  }
  check("FIGMA_DAILY_BUDGET raises the cap", r200 && r200.scripts && r200.scripts.length === 1, r200 && r200.message);
  fs.appendFileSync(c2.ledgerFile, "{not json\n");
  check("a damaged ledger line counts as a call", ledger.callsOn(ledger.readLedger(c2.ledgerFile), "2026-09-24") === 121);

  const c3 = mkctx("crash");
  c3.hooks.beforeWrite = () => {
    throw new Error("crash after the ledger line");
  };
  const er3 = await runScript(pack.extractScript({ file: FILE, nonce: "n-ext-crash", pages: ["1:1"], ids: [["10:1", 0, null]] }), mockFigma(docRaw()).figma);
  let crashed = null;
  try {
    extractIngest(c3, er3);
  } catch (e) {
    crashed = e.message;
  }
  const l3 = ledger.readLedger(c3.ledgerFile);
  check("a crash mid-ingest still leaves the call in the ledger", crashed && l3.length === 1 && l3[0].calls === 1, l3);
  check("and nothing was written to the store", !fs.existsSync(c3.indexFile) && !fs.existsSync(path.join(c3.storeDir, FILE)));

  const c4 = mkctx("damaged");
  const er4 = await runScript(pack.extractScript({ file: FILE, nonce: "n-ext-dmg", pages: ["1:1"], ids: [["10:1", 0, null]] }), mockFigma(docRaw()).figma);
  const damaged = JSON.parse(JSON.stringify(er4));
  const z0 = damaged.segs[0].z[0];
  damaged.segs[0].z[0] = z0.slice(0, 9) + (z0[9] === "A" ? "B" : "A") + z0.slice(10);
  let dmg = null;
  try {
    extractIngest(c4, damaged);
  } catch (e) {
    dmg = e.message;
  }
  const l4 = ledger.readLedger(c4.ledgerFile);
  check("a result changed after Figma returned it is refused, and the call is counted", /checksum/.test(dmg || "") && l4.length === 1 && l4[0].ok === false && l4[0].calls === 1 && !fs.existsSync(c4.indexFile), [dmg, l4]);
  check("the refusal names the line that was mis-copied", /segment 0 \(10:1\) line 0 of 1/.test(dmg || ""), dmg);
  const fixed = extractIngest(c4, er4);
  const l4b = ledger.readLedger(c4.ledgerFile);
  check("the exact copy then ingests without counting the call twice", fixed.stored.length === 1 && l4b.length === 2 && l4b[1].calls === 0 && l4b[1].ok === true, l4b);

  console.log("splitting a large frame, and carrying a frame across calls");
  const big = docRaw();
  big.pages[0].children.push(bigFrame("30:1", 3, 25));
  const mb = mockFigma(big);
  const split = { split: 4000, minCut: 500 };
  const hb = await runScript(pack.hashScript({ file: FILE, nonce: "n-hb", pages: ["1:1"], ids: ["30:1"], ...split }), mb.figma);
  const eb = await runScript(pack.extractScript({ file: FILE, nonce: "n-eb", pages: ["1:1"], ids: [["30:1", 0, null]], budget: 60000, ...split }), mb.figma);
  const bparts = assemble(segItems(eb.segs[0]));
  const refs = bparts[0].tree.c.filter((k) => k.ref);
  check("a frame over the split size is cut into ref parts", bparts.length === 4 && refs.length === 3, bparts.map((p) => p.node));
  check("each ref carries its part's hash", refs.every((r) => bparts.some((p) => p.node === r.ref && p.hash === r.h)));
  check("the split frame's hash agrees between the hash and extract scripts", hb.frames["30:1"] === eb.segs[0].H);
  const c5 = mkctx("split", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  extractIngest(c5, eb);
  const idx5 = loadIndex(c5).frames;
  check("parts are stored beside the frame, indexed under frame/part, and name their frame", idx5[`${FILE}:30:1/30:900`] && idx5[`${FILE}:30:1/30:900`].partOf === `${FILE}:30:1` && idx5[`${FILE}:30:1/30:900`].path === `store/${FILE}/30-1/30-900.json`, Object.keys(idx5));
  big.pages[0].children[big.pages[0].children.length - 1].children[2].children[7].characters = "changed deep inside a part";
  const hb2 = await runScript(pack.hashScript({ file: FILE, nonce: "n-hb2", pages: ["1:1"], ids: ["30:1"], ...split }), mockFigma(big).figma);
  check("a change inside a cut part changes the frame hash", hb2.frames["30:1"] !== hb.frames["30:1"]);

  const c6 = mkctx("transfer", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  c6.maxCalls = 40;
  // Packed, this frame is about a kilobyte, so a result this small needs several calls for it.
  const tiny = 760;
  let calls = 0;
  let last = null;
  let biggest = 0;
  const mt = mockFigma(big);
  while (calls < 30) {
    const plan = await planExtractScript(Object.assign(c6, { split: split.split, minCut: split.minCut }), { budget: tiny });
    if (!plan.plan) break;
    const res = await runScript(plan.text, mt.figma);
    biggest = Math.max(biggest, resultBytes(res));
    last = extractIngest(c6, res);
    calls++;
  }
  const v6 = verifyStored(c6, `${FILE}:30:1`);
  check("a frame bigger than one result arrives over several calls and is stored whole", calls > 3 && v6 && v6.recomputed === hb2.frames["30:1"] && v6.index === v6.recomputed, { calls, v6, last });
  check("no result in that transfer passed its budget, in UTF-8 bytes", biggest <= tiny, biggest);
  const c7 = mkctx("restart", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  Object.assign(c7, { split: split.split, minCut: split.minCut, maxCalls: 40 });
  const p1 = await planExtractScript(c7, { budget: tiny });
  extractIngest(c7, await runScript(p1.text, mockFigma(big).figma));
  const changed = JSON.parse(JSON.stringify(big));
  changed.pages[0].children[changed.pages[0].children.length - 1].children[0].children[0].characters = "edited mid-transfer";
  const mc = mockFigma(changed);
  let n7 = 0;
  let refused7 = 0;
  while (n7 < 30) {
    const plan = await planExtractScript(c7, { budget: tiny });
    if (!plan.plan) break;
    refused7 += extractIngest(c7, await runScript(plan.text, mc.figma)).refused.length;
    n7++;
  }
  const hc = await runScript(pack.hashScript({ file: FILE, nonce: "n-hc", pages: ["1:1"], ids: ["30:1"], ...split }), mockFigma(changed).figma);
  const v7 = verifyStored(c7, `${FILE}:30:1`);
  check("a design edited mid-transfer restarts the transfer and stores the new design", v7 && v7.recomputed === hc.frames["30:1"], v7);
  check("the restart happens inside Figma, in the same call, so no slice is wasted", refused7 === 0, refused7);
  const c8 = mkctx("oversize", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  Object.assign(c8, { split: split.split, minCut: split.minCut, maxCalls: 3 });
  const p8 = await planExtractScript(c8, { budget: tiny });
  const r8 = extractIngest(c8, await runScript(p8.text, mockFigma(big).figma));
  const next8 = await planExtractScript(c8, { budget: tiny });
  const forced8 = await planExtractScript(c8, { budget: tiny, file: FILE, nodes: ["30:1"] });
  check("a transfer that would need more than the per-frame cap is parked, not planned again", r8.partial[0] && r8.partial[0].oversize === true && next8.plan === null && status(c8).oversize.length === 1, [r8.partial, next8.plan]);
  check("a parked frame named with --nodes continues where it stopped", forced8.plan && forced8.plan.ids[0][1] === r8.partial[0].have, forced8.plan);

  // Budgets from measured packed sizes: `alone` is a result holding only the
  // first frame, `whole` the second frame's segment when it is sent whole.
  const sliceBytes = (s) => Buffer.from(s.z.join(""), "base64").length;
  const one = async (ids, budget, m) => runScript(pack.extractScript({ file: FILE, nonce: "n-size", pages: ["1:1"], ids, budget, ...split }), m.figma);
  const mb10 = mockFigma(big);
  const alone20 = resultBytes(await one([["20:1", 0, null]], 60000, mb10));
  const whole30 = resultBytes((await one([["30:1", 0, null]], 60000, mb10)).segs[0]);
  const room10 = Math.floor(whole30 * 0.6);
  const b10a = alone20 + room10;
  const r10 = await runScript(pack.extractScript({ file: FILE, nonce: "n-late", pages: ["1:1"], ids: [["20:1", 0, null], ["30:1", 0, null]], budget: b10a, ...split }), mockFigma(big).figma);
  const s10 = r10.segs || [];
  check(
    "a frame too big for the room left still starts, as the last segment, when a quarter of the budget is free",
    room10 >= b10a / 4 && room10 < whole30 && s10.length === 2 && s10[0].f === "20:1" && sliceBytes(s10[0]) === s10[0].Z && s10[1].f === "30:1" && s10[1].o === 0 && sliceBytes(s10[1]) < s10[1].Z && r10.rest.length === 0 && resultBytes(r10) <= b10a,
    [room10, b10a, whole30, s10.map((s) => [s.f, sliceBytes(s), s.Z]), resultBytes(r10)],
  );
  const mid = JSON.parse(JSON.stringify(big));
  mid.pages[0].children.push(bigFrame("40:1", 6, 24));
  const m10 = mockFigma(mid);
  const alone40 = resultBytes(await one([["40:1", 0, null]], 60000, m10));
  const room10b = Math.floor(alone40 / 3) - 20;
  const b10 = alone40 + room10b;
  const r10b = await runScript(pack.extractScript({ file: FILE, nonce: "n-late-b", pages: ["1:1"], ids: [["40:1", 0, null], ["30:1", 0, null]], budget: b10, ...split }), m10.figma);
  check(
    "with less than a quarter of the budget free it waits in rest instead (and not for want of the minimum room)",
    room10b < b10 / 4 && room10b >= 450 && room10b < whole30 && (r10b.segs || []).length === 1 && r10b.segs[0].f === "40:1" && r10b.rest[0] === "30:1" && resultBytes(r10b) <= b10,
    [alone40, room10b, b10, (r10b.segs || []).map((s) => s.f), r10b.rest],
  );

  const waiting = Array.from({ length: 20 }, (_, k) => [`${7000 + k}:${80000 + k}`, 0, null]);
  const r10c = await runScript(pack.extractScript({ file: FILE, nonce: "n-rest", pages: ["1:1"], ids: [["30:1", 0, null], ...waiting], budget: 1400, ...split }), mockFigma(big).figma);
  check(
    "a slice that fills the result still leaves room for every id sent back in rest",
    (r10c.segs || []).length === 1 && r10c.segs[0].f === "30:1" && sliceBytes(r10c.segs[0]) < r10c.segs[0].Z && r10c.rest.length === 20 && resultBytes(r10c) <= 1400 && resultBytes(r10c) > 1300,
    [(r10c.segs || []).map((s) => [s.f, sliceBytes(s)]), r10c.rest.length, resultBytes(r10c)],
  );

  const c9 = mkctx("forged");
  const er9 = await runScript(pack.extractScript({ file: FILE, nonce: "n-ext-forged", pages: ["1:1"], ids: [["20:1", 0, null]] }), mockFigma(docRaw()).figma);
  const forged = segItems(er9.segs[0]);
  forged[2].n = "not what Figma drew";
  er9.segs[0] = repack(er9.segs[0], forged);
  resum(er9);
  const r9 = extractIngest(c9, er9);
  check("a stream whose content does not hash to its part hash is refused, not stored", r9.stored.length === 0 && r9.refused.length === 1 && /hash does not match/.test(r9.refused[0].error) && !fs.existsSync(path.join(c9.storeDir, FILE, "20-1.json")), r9);
  const c9b = mkctx("miscounted");
  const er9b = await runScript(pack.extractScript({ file: FILE, nonce: "n-ext-count", pages: ["1:1"], ids: [["20:1", 0, null]] }), mockFigma(docRaw()).figma);
  er9b.segs[0].T -= 1;
  const r9b = extractIngest(c9b, resum(er9b));
  check("a stream holding a different number of items than the frame declared is refused", r9b.stored.length === 0 && r9b.refused.length === 1 && /declared/.test(r9b.refused[0].error), r9b);

  console.log("planning");
  const frames8 = [
    { key: `${FILE}:20:1`, fileKey: FILE, node: "20:1", pageId: "2:1", order: 0 },
    { key: `${FILE}:10:1`, fileKey: FILE, node: "10:1", pageId: "1:1", order: 1 },
    { key: `OTHERFILEKEY00000000000B:5:5`, fileKey: "OTHERFILEKEY00000000000B", node: "5:5", pageId: "9:9", order: 2 },
  ];
  const plan8 = pack.planExtract({ frames: frames8, index: { frames: {} }, state: {}, rank: pack.rankOf([[`${FILE}:10:1`]]) });
  check("a worklist packet frame goes first, and a batch holds one file only", plan8.keys[0] === `${FILE}:10:1` && plan8.keys.length === 2 && plan8.file === FILE, plan8);
  const plan8b = pack.planExtract({ frames: frames8, index: { frames: { [`${FILE}:10:1`]: { hash: "x", bytes: 10 }, [`${FILE}:20:1`]: { hash: "y", bytes: 10, stale: true } } }, state: {}, rank: pack.rankOf([]) });
  check("stored fresh frames are skipped, stale ones are planned", plan8b.keys.includes(`${FILE}:20:1`) && !plan8b.keys.includes(`${FILE}:10:1`), plan8b);
  const manyIds = [];
  for (let i = 0; i < 1200; i++) manyIds.push({ key: `${FILE}:${9000 + i}:${100000 + i}`, fileKey: FILE, node: `${9000 + i}:${100000 + i}`, pageId: `${i % 7}:1`, order: i });
  const groups = pack.planHashGroups(manyIds);
  const worst = Math.max(...groups.map((g) => pack.hashScript({ file: FILE, nonce: "000000000000", pages: g.pages, ids: g.ids }).length));
  const worstResult = Math.max(...groups.map((g) => JSON.stringify({ v: 1, kind: "hash", file: FILE, nonce: "000000000000", frames: Object.fromEntries(g.ids.map((id) => [id, "0123456789abcdef"])), missing: [], errors: {}, rest: [], sum: "0123456789abcdef" }).length));
  check("1200 frames cut into hash scripts that each stay under both budgets", groups.reduce((a, g) => a + g.ids.length, 0) === 1200 && worst < pack.SCRIPT_BUDGET && worstResult < pack.RESULT_BUDGET, { groups: groups.length, worst, worstResult });
  const reg = { frames: { a: { fileKey: FILE, node: "1-2", page: "✅ Test" }, b: { fileKey: FILE, node: "1-3", page: null, gone: true }, c: { fileKey: FILE, node: "1-4", page: "Towars Draft (Disregard)" }, d: { fileKey: FILE, node: "1-5", page: "✅ Test", gone: true } } };
  const tf = pack.trackedFrames(reg, { pages: [{ fileKey: FILE, pageName: "✅ Test", pageId: "1:1" }], outOfScope: { "Towars Draft (Disregard)": "x" } });
  check("tracked = not gone, has a page, page in scope; node ids in colon form", tf.length === 1 && tf[0].node === "1:2" && tf[0].pageId === "1:1" && tf[0].key === `${FILE}:1:2`, tf);

  console.log("the packed transport (lib/transport.mjs)");
  transport.selfTest(check, transport.jsonFilesUnder([FIXTURES, path.join(HERE, "store")]));
  const pasted = new Function(`${pack.compact(`const zcodec = ${transport.zcodec.toString()};`)}\nreturn zcodec;`)()(transport.ZDICT);
  const probe = [docRaw(), expected, bigFrame("50:1", 2, 30), transport.HARD_TEXT].map((v) => canonicalJson(v));
  check("the codec as pasted into a script packs the same bytes as the module's", probe.every((t) => Buffer.compare(Buffer.from(pasted.pack(t)), Buffer.from(transport.codec.pack(t))) === 0));
  const batchIds = Array.from({ length: pack.MAX_EXTRACT_FRAMES }, (_, i) => [`I${12000 + i}:${340000 + i};${5000 + i}:${60000 + i}`, 123456, "0123456789abcdef"]);
  const bigScript = pack.extractScript({ file: FILE, nonce: "000000000000", pages: ["9990:1", "9991:1", "9992:1"], ids: batchIds });
  check("an extract script for the largest batch stays under the script budget (and use_figma's 50,000)", bigScript.length < pack.SCRIPT_BUDGET, bigScript.length);

  const goodScript = pack.extractScript({ file: FILE, nonce: "n-dict-ok", pages: ["1:1", "2:1"], ids: [["10:1", 0, null]] });
  const at300 = goodScript.indexOf("Coal 300");
  const slipScript = goodScript.slice(0, at300) + "Coal 3O0" + goodScript.slice(at300 + 8).replace('"nonce":"n-dict-ok"', '"nonce":"n-dict-slip"');
  const okRes = await runScript(goodScript, mockFigma(docRaw()).figma);
  const slipRes = await runScript(slipScript, mockFigma(docRaw()).figma);
  const c16 = mkctx("dict-slip", { frames: [{ key: `${FILE}:10:1`, fileKey: FILE, node: "10:1", pageId: "1:1", order: 0 }] });
  const r16 = extractIngest(c16, slipRes);
  const v16 = verifyStored(c16, `${FILE}:10:1`);
  check(
    "a script whose dictionary was not copied exactly packs without it, says so, and still stores the frame at its live hash",
    at300 > goodScript.indexOf("zdict:") && okRes.dz === transport.DICT_ID && slipRes.dz === transport.DICT_NONE && slipRes.segs[0].Z > okRes.segs[0].Z && r16.stored.length === 1 && v16 && v16.recomputed === okRes.segs[0].H,
    [okRes.dz, slipRes.dz, okRes.segs[0].Z, slipRes.segs[0] && slipRes.segs[0].Z, r16],
  );

  const stressDoc = docRaw();
  stressDoc.pages[0].children.push(stressFrame("60:1", 1600, 5));
  const ms = mockFigma(stressDoc);
  const hs60 = await runScript(pack.hashScript({ file: FILE, nonce: "n-h60", pages: ["1:1"], ids: ["60:1"] }), ms.figma);
  const c11 = mkctx("stress", { frames: [{ key: `${FILE}:60:1`, fileKey: FILE, node: "60:1", pageId: "1:1", order: 0 }] });
  c11.maxCalls = 40;
  let n11 = 0;
  let worst11 = 0;
  let packed11 = null;
  while (n11 < 40) {
    const plan = await planExtractScript(c11, {});
    if (!plan.plan) break;
    const res = await runScript(plan.text, ms.figma);
    worst11 = Math.max(worst11, resultBytes(res));
    const got = extractIngest(c11, res);
    if (got.stored.length) packed11 = got.stored[0];
    n11++;
  }
  const v11 = verifyStored(c11, `${FILE}:60:1`);
  check(
    "a 1,600-node board with CJK and emoji names, long text and 70-deep nesting arrives over several calls and is stored whole",
    n11 > 1 && v11 && v11.index === v11.spec && v11.spec === v11.recomputed && v11.recomputed === hs60.frames["60:1"],
    { n11, v11, live: hs60.frames["60:1"], packed11 },
  );
  check(`every result of that transfer is at most ${pack.ZRESULT_BUDGET} UTF-8 bytes`, worst11 > pack.ZRESULT_BUDGET * 0.9 && worst11 <= pack.ZRESULT_BUDGET, worst11);

  const c12 = mkctx("old-partial", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  writeState(c12, { live: {}, partial: { [`${FILE}:30:1`]: { H: "7e29b21f4eee250f", T: 99, pg: "✅ Test", n: "Big board", w: 400, h: 3000, x: [{ _p: "30:1", _h: "7e29b21f4eee250f" }], calls: 1, oversize: true } } });
  const p12 = await planExtractScript(Object.assign(c12, { split: split.split, minCut: split.minCut }), {});
  const r12 = p12.plan ? extractIngest(c12, await runScript(p12.text, mockFigma(big).figma)) : null;
  check(
    "a transfer parked in the plain format before z1 is planned again from 0, and the frame is stored",
    p12.plan && p12.plan.ids[0][1] === 0 && p12.plan.ids[0][2] === null && r12 && r12.stored.length === 1 && !loadState(c12).partial[`${FILE}:30:1`],
    [p12.plan && p12.plan.ids, r12],
  );

  const c13 = mkctx("foreign");
  const er13 = await runScript(pack.extractScript({ file: FILE, nonce: "n-foreign", pages: ["1:1"], ids: [["10:1", 0, null]] }), mockFigma(docRaw()).figma);
  let f13 = null;
  try {
    extractIngest(c13, resum({ ...er13, dz: "00000000" }));
  } catch (e) {
    f13 = e.message;
  }
  let g13 = null;
  try {
    extractIngest(c13, resum({ ...er13, nonce: "n-plain", enc: undefined }));
  } catch (e) {
    g13 = e.message;
  }
  const l13 = ledger.readLedger(c13.ledgerFile);
  check("a result packed with another dictionary, or not packed, is refused, still counted, and writes nothing", /dictionary 00000000/.test(f13 || "") && /plain JSON/.test(g13 || "") && l13.length === 2 && l13.every((l) => l.ok === false && l.calls === 1) && !fs.existsSync(c13.indexFile), [f13, g13, l13]);

  const c14 = mkctx("wrong-continuation", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  Object.assign(c14, { split: split.split, minCut: split.minCut, maxCalls: 40 });
  const p14 = await planExtractScript(c14, { budget: tiny });
  const first14 = extractIngest(c14, await runScript(p14.text, mockFigma(big).figma));
  const next14 = await planExtractScript(c14, { budget: tiny });
  const res14 = await runScript(next14.text, mockFigma(big).figma);
  const other = resum(JSON.parse(JSON.stringify({ ...res14, nonce: "n-other" })));
  other.segs[0].H = "ffffffffffffffff";
  resum(other);
  const r14 = extractIngest(c14, other);
  check("a slice that does not continue the transfer on record is refused and the transfer starts over", first14.partial.length === 1 && next14.plan.ids[0][1] === first14.partial[0].have && r14.refused.length === 1 && /does not continue/.test(r14.refused[0].error) && !loadState(c14).partial[`${FILE}:30:1`], [first14.partial, r14]);
  const c15 = mkctx("ragged", { frames: [{ key: `${FILE}:30:1`, fileKey: FILE, node: "30:1", pageId: "1:1", order: 0 }] });
  Object.assign(c15, { split: split.split, minCut: split.minCut, maxCalls: 40 });
  const res15 = await runScript((await planExtractScript(c15, { budget: tiny })).text, mockFigma(big).figma);
  const s15 = res15.segs[0];
  const cut15 = Buffer.from(s15.z.join(""), "base64").subarray(0, 100);
  Object.assign(s15, transport.toLines(cut15.toString("base64")));
  const r15 = extractIngest(c15, resum(res15));
  check("a first slice that is not a whole number of base64 groups is refused", cut15.length % 3 !== 0 && r15.refused.length === 1 && /whole number of base64 groups/.test(r15.refused[0].error), r15);

  console.log("the mock refuses writes");
  const guardCheck = await runScript("try { figma.createRectangle(); return 'wrote'; } catch (e) { return String(e.message); }", mockFigma(docRaw()).figma);
  const guardCheck2 = await runScript("const n = await figma.getNodeByIdAsync('10:2'); try { n.name = 'x'; return 'wrote'; } catch (e) { return String(e.message); }", mockFigma(docRaw()).figma);
  check("the mock throws on a figma write API and on a node property write, so a passing run proves read-only", /touched figma\.createRectangle/.test(guardCheck) && /write to 10:2/.test(guardCheck2), [guardCheck, guardCheck2]);

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
}

/** Path to the first difference between two JSON values, or null when they are equal. */
function firstDiff(a, b, at = "$") {
  if (canonicalJson(a) === canonicalJson(b)) return null;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null || Array.isArray(a) !== Array.isArray(b)) return `${at}: expected ${JSON.stringify(a)}, got ${JSON.stringify(b)}`;
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  for (const k of keys) {
    const d = firstDiff(a[k], b[k], `${at}.${k}`);
    if (d) return d;
  }
  return `${at}: differs`;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  if (process.argv.includes("--self-test")) selfTest();
  else main(process.argv.slice(2));
}
