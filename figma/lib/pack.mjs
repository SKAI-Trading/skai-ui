/**
 * pack.mjs — which frames sync tracks, in what order, and the exact use_figma
 * scripts that read them.
 *
 * A script is plain text: canonicalJson + fnv1a64 (canonical.mjs) and the
 * builder and drivers (plugin-builder.js), pasted in by Function.toString,
 * then one line that runs a driver on a JSON job. The job carries the ids, the
 * pages to load, a nonce the result must echo, and the result budget.
 *
 * Sizes: use_figma keeps the first 20,480 UTF-8 bytes of a result and cuts
 * the rest. A hash result is plain JSON planned under RESULT_BUDGET. An
 * extract result carries its frames packed (transport.mjs, TRANSPORT.md) and
 * the driver holds the returned JSON under ZRESULT_BUDGET bytes, measured.
 * The script itself goes in use_figma's `code` field, which takes 50,000
 * characters; SCRIPT_BUDGET keeps a margin under that.
 */
import crypto from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { canonicalJson, fnv1a64 } from "./canonical.mjs";
import { specBuilder, loadPages, hashDriver, extractDriver } from "./plugin-builder.js";
import { zcodec, ZDICT, DICT_ID, ENC, LINE } from "./transport.mjs";

export const RESULT_BUDGET = 16000;
/** Bytes an extract result may take: 2,480 under the cut, for a margin. */
export const ZRESULT_BUDGET = 18000;
export const SCRIPT_BUDGET = 45000;
export const HASH_MS = 25000;
export const EXTRACT_MS = 25000;
/** Bytes a frame is assumed to need when it has never been stored. */
export const DEFAULT_FRAME_EST = 5000;
/** Packed bytes per stored byte, for planning only (measured 0.07 to 0.12 on real specs). */
export const PACKED_EST = 0.12;
export const MAX_EXTRACT_FRAMES = 40;

/** Drop indentation, blank lines and whole-line comments. */
export function compact(src) {
  return src
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"))
    .join("\n");
}

const CORE = compact(
  [
    `const canonicalJson = ${canonicalJson.toString()};`,
    `const fnv1a64 = ${fnv1a64.toString()};`,
    `const specBuilder = ${specBuilder.toString()};`,
    `const loadPages = ${loadPages.toString()};`,
  ].join("\n"),
);
const HASH_LIB = `${CORE}\nconst lib = { canonicalJson, fnv1a64 };`;
// The dictionary goes in as one JSON string literal, after compact(), so no
// line of it can be taken for a comment.
const EXTRACT_LIB = `${CORE}\n${compact(`const zcodec = ${zcodec.toString()};`)}\nconst lib = { canonicalJson, fnv1a64, zc: zcodec(${JSON.stringify(ZDICT)}) };`;
const HASH_DRIVER = compact(`const hashDriver = ${hashDriver.toString()};`);
const EXTRACT_DRIVER = compact(`const extractDriver = ${extractDriver.toString()};`);

export const newNonce = () => crypto.randomBytes(6).toString("hex");

const builderOpt = (job) => JSON.stringify(job.split ? { split: job.split, minCut: job.minCut || 1 } : null);

export function hashScript(job) {
  const j = { file: job.file, nonce: job.nonce, pages: job.pages || [], ids: job.ids, budget: job.budget || RESULT_BUDGET, ms: job.ms || HASH_MS };
  return `${HASH_LIB}\n${HASH_DRIVER}\nreturn await hashDriver(figma, lib, specBuilder(figma, lib, ${builderOpt(job)}), ${JSON.stringify(j)});`;
}

/** An extract script. job.budget is the returned JSON's byte limit (default ZRESULT_BUDGET). */
export function extractScript(job) {
  const j = {
    file: job.file,
    nonce: job.nonce,
    pages: job.pages || [],
    ids: job.ids,
    budget: job.budget || ZRESULT_BUDGET,
    ms: job.ms || EXTRACT_MS,
    enc: ENC,
    dz: DICT_ID,
    line: job.line || LINE,
  };
  return `${EXTRACT_LIB}\n${EXTRACT_DRIVER}\nreturn await extractDriver(figma, lib, specBuilder(figma, lib, ${builderOpt(job)}), ${JSON.stringify(j)});`;
}

/** Size of a hash script with no ids, so a group can be sized before it is built. */
export const hashScriptBase = () => hashScript({ file: "x".repeat(22), nonce: "0".repeat(12), pages: [], ids: [] }).length;

// ── the tracked set ──────────────────────────────────────────────────────────

export const colonId = (id) => String(id).replace(/-/g, ":");
export const frameKey = (fileKey, node) => `${fileKey}:${colonId(node)}`;
/** A node id as a file name: ":" becomes "-", and an instance path's ";" becomes "_". */
export const nodeFile = (node) => colonId(node).replace(/:/g, "-").replace(/;/g, "_");

/**
 * Every frame the store tracks: a registry frame that is not `gone`, has a
 * page, and whose page is not ruled out of scope in pages.json. Returned in
 * registry order with the page id each one sits on (null when pages.json does
 * not know the page; the driver then loads the node's own page).
 */
export function trackedFrames(registry, pagesJson) {
  const out = [];
  const oos = new Set(Object.keys(pagesJson?.outOfScope || {}));
  const pageId = new Map();
  for (const p of pagesJson?.pages || []) pageId.set(`${p.fileKey}|${p.pageName}`, p.pageId);
  let order = 0;
  for (const f of Object.values(registry?.frames || {})) {
    if (!f || f.gone || !f.page || oos.has(f.page) || !f.fileKey || !f.node) continue;
    const m = /^(\d+)x(\d+)$/.exec(f.measuredViewport || "");
    out.push({
      key: frameKey(f.fileKey, f.node),
      fileKey: f.fileKey,
      node: colonId(f.node),
      page: f.page,
      pageId: pageId.get(`${f.fileKey}|${f.page}`) || null,
      title: f.title || "",
      w: m ? Number(m[1]) : null,
      h: m ? Number(m[2]) : null,
      order: order++,
    });
  }
  return out;
}

/**
 * Rank every frame key: worklist packets first, in packet order, then the rest
 * (Infinity). `packets` is [[frameKey, ...], ...] in packet order.
 */
export function rankOf(packets) {
  const rank = new Map();
  let r = 0;
  for (const p of packets || []) for (const k of p) if (!rank.has(k)) rank.set(k, r++);
  return (key) => (rank.has(key) ? rank.get(key) : Infinity);
}

/** The catalog worklist's packets as frame keys, or [] with the reason when it cannot be built. */
export async function worklistPackets(catalogDir, registry, coverage) {
  try {
    const { buildWorklist } = await import(pathToFileURL(path.join(catalogDir, "worklist.mjs")).href);
    const w = buildWorklist({ registry, coverage });
    if (w.problems) return { packets: [], why: `worklist refused: ${w.problems[0]}` };
    return { packets: w.packets.map((p) => p.frames.map((r) => frameKey(r.fileKey, r.node))), why: null };
  } catch (e) {
    return { packets: [], why: `worklist unavailable: ${e.message}` };
  }
}

// ── planning ─────────────────────────────────────────────────────────────────

/**
 * Cut a file's frames into hash scripts. A frame costs `"<id>":"<16 hex>",`
 * in the result (id + 22) and `"<id>",` in the script (id + 3); the envelope
 * is under 200. Each group stays under both budgets.
 */
export function planHashGroups(frames, { resultBudget = RESULT_BUDGET, scriptBudget = SCRIPT_BUDGET } = {}) {
  const base = hashScriptBase();
  const groups = [];
  const fresh = () => ({ ids: [], pages: [], res: 200, scr: base + 40 });
  let cur = fresh();
  for (const f of frames) {
    const res = f.node.length + 22;
    const scr = f.node.length + 3 + (f.pageId && !cur.pages.includes(f.pageId) ? f.pageId.length + 3 : 0);
    if (cur.ids.length && (cur.res + res > resultBudget || cur.scr + scr > scriptBudget)) {
      groups.push(cur);
      cur = fresh();
    }
    cur.ids.push(f.node);
    if (f.pageId && !cur.pages.includes(f.pageId)) cur.pages.push(f.pageId);
    cur.res += res;
    cur.scr += scr;
  }
  if (cur.ids.length) groups.push(cur);
  return groups;
}

/** Bytes a frame's transfer is expected to take packed: its last stored size, else the default, times PACKED_EST. */
export const estimateBytes = (entry) => Math.ceil((entry && entry.bytes ? entry.bytes : DEFAULT_FRAME_EST) * PACKED_EST);

/**
 * A transfer this checkout can continue: one made in the current transport.
 * A partial from an older format (the plain item slices before z1) cannot be
 * joined to a packed stream, so its frame is planned again from 0.
 */
export const continuable = (p) => !!p && p.enc === ENC;

/**
 * Choose the next extract batch for ONE file (a use_figma call reads one file).
 * Order: a transfer already in progress, then stale or missing frames by rank
 * (worklist packets first), then registry order. The batch is overfilled to
 * about twice the result budget, because the driver packs exactly and returns
 * whatever does not fit in `rest`.
 */
export function planExtract({ frames, index, state, rank, file = null, nodes = null, limit = MAX_EXTRACT_FRAMES, budget = ZRESULT_BUDGET }) {
  const idx = index?.frames || {};
  const partial = state?.partial || {};
  const byKey = new Map(frames.map((f) => [f.key, f]));
  let pool;
  if (nodes && nodes.length) {
    if (!file) throw new Error("--nodes needs --file");
    pool = nodes.map((n) => byKey.get(frameKey(file, n)) || { key: frameKey(file, n), fileKey: file, node: colonId(n), pageId: null, order: Infinity });
  } else {
    const need = frames.filter((f) => !idx[f.key] || idx[f.key].stale);
    const inTransfer = Object.keys(partial)
      .filter((k) => continuable(partial[k]) && !partial[k].oversize)
      .map((k) => byKey.get(k))
      .filter(Boolean);
    const rest = need
      .filter((f) => !continuable(partial[f.key]))
      .sort((a, b) => rank(a.key) - rank(b.key) || a.order - b.order);
    pool = inTransfer.concat(rest);
  }
  if (!pool.length) return null;
  const fileKey = file || pool[0].fileKey;
  const pick = [];
  let est = 0;
  for (const f of pool) {
    if (f.fileKey !== fileKey) continue;
    if (pick.length >= limit || (pick.length && est >= budget * 2)) break;
    const p = continuable(partial[f.key]) ? partial[f.key] : null;
    pick.push({ f, off: p ? p.got : 0, want: p ? p.H : null });
    est += p ? Math.min(budget, p.Z - p.got + 400) : estimateBytes(idx[f.key]);
  }
  const pages = [...new Set(pick.map((p) => p.f.pageId).filter(Boolean))];
  return { file: fileKey, pages, ids: pick.map((p) => [p.f.node, p.off, p.want]), keys: pick.map((p) => p.f.key) };
}
