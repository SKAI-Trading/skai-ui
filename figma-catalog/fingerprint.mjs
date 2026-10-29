/**
 * fingerprint.mjs — one structural hash per top-level board, so an edit made
 * INSIDE a board shows up. The page hash in harvest.mjs covers each page's
 * top-level rows only (id, name, type, size, visibility); a designer who
 * rebuilds a row inside a board changes none of those. That is how the 375
 * Play mode cards were redrawn under new ids on 2026-10-27 with nothing in the
 * page hash to say so.
 *
 * Each board gets two numbers, computed by one walk over its whole subtree:
 *
 *   s  FNV-1a 32 over one line per node, in document order:
 *      id | type | x,y,w,h | visible | text
 *      Bounds follow the design store's spec builder exactly (relative to the
 *      parent, rounded to 0.5, a GROUP child placed relative to the group, the
 *      board's own root [0, 0, w, h], so moving a board on the canvas changes
 *      nothing). Text is the characters, cut at 500 like the builder. Instances
 *      are walked into, so an override inside one moves the hash.
 *   n  the node count the walk visited.
 *
 * Fills, strokes, effects, fonts and auto-layout are NOT in it: a pure colour
 * or token change does not move s. The design store's own hash pass covers
 * those, at many times the calls.
 *
 * For the ids passed in K (frames the design store holds a spec for), the walk
 * also returns k: the same line format under the store's pruning rules
 * (instances and vector-like nodes are leaves, depth capped at 80), rooted at
 * that node. specFingerprint() computes k from a stored spec, so a live k
 * unlike the spec's says the frame's structure moved since the store read it.
 */
import fs from "node:fs";
import path from "node:path";

export const FP_MS = 20000; // stop starting new boards after this; the chunk reports where it stopped
export const FP_BUDGET = 13000; // result characters per call, well under the 20 KB cut
export const FP_ROW = 28; // "id hash count," for a top-level board, measured on the harvest ids

// The walk is source text so the exact same code runs inside use_figma and in
// the self-test (through new Function), the way figma/lib's builder does.
export const FP_LIB = String.raw`
const FP_GROUPISH = { GROUP: 1, BOOLEAN_OPERATION: 1 };
const FP_LEAF = { VECTOR: 1, BOOLEAN_OPERATION: 1, STAR: 1 };
const fpGet = (n, k) => { try { return n[k]; } catch (e) { return undefined; } };
const fpNum = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
const fpHalf = (v) => Math.round(fpNum(v) * 2) / 2;
const fpCut = (s) => {
  const t = typeof s === "string" ? s : "";
  if (t.length <= 500) return t;
  let e = 500;
  const c = t.charCodeAt(e - 1);
  if (c >= 0xd800 && c < 0xdc00) e--;
  return t.slice(0, e) + "…";
};
const fpLine = (id, t, b, vis, text) => id + "|" + t + "|" + b.join(",") + "|" + vis + "|" + text + "\n";
function fpAcc() {
  let h = 0x811c9dc5;
  return {
    add(s) { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } },
    hex() { return (h >>> 0).toString(16).padStart(8, "0"); },
  };
}
// full: walk into instances (s). Otherwise the design store's rules (k).
function fpWalk(root, full, onNode) {
  const acc = fpAcc();
  let count = 0;
  const visit = (n, parent, isRoot, depth) => {
    count++;
    if (onNode && !isRoot) onNode(n);
    const t = fpGet(n, "type");
    const pt = parent ? fpGet(parent, "type") : null;
    const gx = !isRoot && FP_GROUPISH[pt] ? fpNum(fpGet(parent, "x")) : 0;
    const gy = !isRoot && FP_GROUPISH[pt] ? fpNum(fpGet(parent, "y")) : 0;
    const w = fpHalf(fpGet(n, "width")), h = fpHalf(fpGet(n, "height"));
    const b = isRoot ? [0, 0, w, h] : [fpHalf(fpNum(fpGet(n, "x")) - gx), fpHalf(fpNum(fpGet(n, "y")) - gy), w, h];
    acc.add(fpLine(n.id, t, b, fpGet(n, "visible") === false ? 0 : 1, t === "TEXT" ? fpCut(fpGet(n, "characters")) : ""));
    if (depth >= 80) return;
    if (FP_LEAF[t] && !full) return;
    if (t === "INSTANCE" && !full) return;
    const kids = fpGet(n, "children");
    if (kids && typeof kids.length === "number") for (const k of kids) visit(k, n, false, depth + 1);
  };
  visit(root, null, true, 0);
  return [acc.hex(), count];
}
`;

// FP_LIB is this module's own constant, evaluated once so Node walks and hashes with the code Figma runs.
export const fpLib = new Function(`${FP_LIB}; return { fpAcc, fpLine, fpWalk };`)();

/** A store-spec node walked under the same rules as the live k walk. */
export function specFingerprint(tree, loadPart = () => null) {
  const lib = fpLib;
  const acc = lib.fpAcc();
  let count = 0;
  const missing = [];
  const visit = (n, depth) => {
    if (n && n.ref && !n.id) {
      const part = loadPart(n.ref);
      if (!part) { missing.push(n.ref); return; }
      return visit(part, depth);
    }
    count++;
    const t = n.t;
    acc.add(lib.fpLine(n.id, t, n.b || [0, 0, 0, 0], n.vis === false ? 0 : 1, t === "TEXT" ? (n.tx && typeof n.tx.c === "string" ? n.tx.c : "") : ""));
    if (depth >= 80 || t === "INSTANCE" || t === "VECTOR" || t === "BOOLEAN_OPERATION" || t === "STAR") return;
    for (const k of n.c || []) visit(k, depth + 1);
  };
  visit(tree, 0);
  return { k: acc.hex(), n: count, missing };
}

/** Chunks for one page's top-level boards, sized by FP_BUDGET. */
export function fingerprintChunks(pageId, childCount, budget = FP_BUDGET) {
  const per = Math.max(1, Math.floor(budget / FP_ROW));
  const parts = Math.max(1, Math.ceil(childCount / per));
  const size = Math.ceil(childCount / parts);
  const out = [];
  for (let from = 0; from < childCount; from += size) out.push([pageId, from, Math.min(childCount, from + size)]);
  return out.length ? out : [[pageId, 0, 0]];
}

// shallow: instances and vector-like nodes are leaves (the store's rules), so a board costs a fraction of the
// walk; an override inside an instance no longer moves s.
export function fingerprintScript(fileKey, chunk, storeIds = [], { ms = FP_MS, shallow = false } = {}) {
  return `${FP_LIB}
const FULL = ${shallow ? "false" : "true"};
const FILE_KEY = ${JSON.stringify(fileKey)};
const PLAN = ${JSON.stringify(chunk)};
const K = new Set(${JSON.stringify(storeIds)});
const t0 = Date.now();
const out = [];
const kv = {};
const errs = {};
let nodes = 0;
const onNode = K.size ? (n) => { if (K.has(n.id) && !kv[n.id]) kv[n.id] = fpWalk(n, false).join(" "); } : null;
for (const [pid, from, to] of PLAN) {
  const p = figma.root.children.find((x) => x.id === pid);
  if (!p) { out.push([pid, null, -1, from, from, ""]); continue; }
  await p.loadAsync();
  const kids = p.children;
  const end = to == null ? kids.length : Math.min(to, kids.length);
  const rows = [];
  let i = from;
  for (; i < end; i++) {
    if (Date.now() - t0 > ${ms}) break;
    const n = kids[i];
    try {
      if (K.has(n.id) && !kv[n.id]) kv[n.id] = fpWalk(n, false).join(" ");
      const r = fpWalk(n, FULL, onNode);
      nodes += r[1];
      rows.push(n.id + " " + r[0] + " " + r[1]);
    } catch (e) {
      rows.push(n.id + " ERR 0");
      errs[n.id] = String((e && e.message) || e).slice(0, 120);
    }
  }
  out.push([pid, p.name, kids.length, from, i, rows.join(",")]);
}
return { fingerprint: 1, mode: FULL ? "full" : "shallow", fileKey: FILE_KEY, ms: Date.now() - t0, nodes, want: [...K], kv, errs, chunks: out };`;
}

/**
 * The store check alone: each listed design-store frame found by id and walked under the store's rules. It
 * needs no page walk, so it costs one call per file; a frame getNodeByIdAsync cannot find once every page is
 * loaded is reported missing.
 */
export function storeCheckScript(fileKey, ids) {
  return `${FP_LIB}
const FILE_KEY = ${JSON.stringify(fileKey)};
const IDS = ${JSON.stringify(ids)};
const t0 = Date.now();
for (const p of figma.root.children) await p.loadAsync();
const kv = {};
const missing = [];
const errs = {};
for (const id of IDS) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) { missing.push(id); continue; }
  try { kv[id] = fpWalk(n, false).join(" "); } catch (e) { errs[id] = String((e && e.message) || e).slice(0, 120); }
}
return { fingerprint: 1, mode: "store", fileKey: FILE_KEY, ms: Date.now() - t0, want: IDS, kv, missing, errs, chunks: [] };`;
}

/**
 * Fold fingerprint payloads into per-page baselines. A page is accepted only
 * when its chunks tile [0, childCount) exactly, every id matches the page's
 * live/ harvest at the same index, and no board errored; anything else is
 * refused with the reason, never written short.
 */
export function reconcileFingerprints(docs, liveIdsOf) {
  const pages = new Map();
  const refused = [];
  const kv = {};
  const want = new Map();
  // Frames a store check looked up by id: settled whether or not their page was walked.
  const direct = new Map();
  for (const { source, doc } of docs) {
    if (!doc || doc.fingerprint !== 1 || !doc.fileKey || !Array.isArray(doc.chunks)) {
      refused.push({ page: source, why: "not a fingerprint payload" });
      continue;
    }
    for (const id of doc.want || []) want.set(`${doc.fileKey}:${id}`, doc.fileKey);
    if (doc.mode === "store") {
      const errs = doc.errs || {};
      for (const id of doc.want || []) direct.set(`${doc.fileKey}:${id}`, errs[id] ? "error" : (doc.missing || []).includes(id) ? "missing" : "found");
    }
    for (const [id, v] of Object.entries(doc.kv || {})) kv[`${doc.fileKey}:${id}`] = v;
    for (const [pid, name, count, from, end, rows] of doc.chunks) {
      const key = `${doc.fileKey}|${pid}`;
      const mode = doc.mode || "full";
      if (!pages.has(key)) pages.set(key, { fileKey: doc.fileKey, pageId: pid, pageName: name, count, mode, spans: [], rows: new Map(), errs: {}, ms: 0, nodes: 0 });
      const pg = pages.get(key);
      if (pg.mode !== mode) pg.bad = `chunks mix a ${pg.mode} and a ${mode} walk`;
      if (pg.count !== count) pg.bad = `chunks disagree on the child count (${pg.count} vs ${count})`;
      pg.spans.push([from, end]);
      const list = rows ? rows.split(",") : [];
      if (list.length !== end - from) pg.bad = `chunk [${from},${end}) carries ${list.length} rows`;
      list.forEach((r, j) => {
        const [id, h, n] = r.split(" ");
        if (pg.rows.has(from + j)) pg.bad = `index ${from + j} twice`;
        pg.rows.set(from + j, { id, h, n: +n });
        if (h === "ERR") pg.errs[id] = (doc.errs || {})[id] || "error";
      });
      pg.ms += doc.ms || 0;
      pg.nodes += list.reduce((a, r) => a + (+r.split(" ")[2] || 0), 0);
    }
  }
  const ok = [];
  for (const pg of pages.values()) {
    const why = (() => {
      if (pg.bad) return pg.bad;
      if (pg.count < 0) return "page not found in the file";
      for (let i = 0; i < pg.count; i++) if (!pg.rows.has(i)) return `INCOMPLETE: index ${i} not reached (resume with --chunk '[["${pg.pageId}",${i},${pg.count}]]')`;
      if (Object.keys(pg.errs).length) return `${Object.keys(pg.errs).length} board(s) errored: ${Object.entries(pg.errs).slice(0, 3).map(([a, b]) => `${a} ${b}`).join("; ")}`;
      const live = liveIdsOf(pg.fileKey, pg.pageId);
      if (live.length !== pg.count) return `live/ holds ${live.length} rows, Figma ${pg.count}: harvest the page first`;
      for (let i = 0; i < pg.count; i++) if (live[i] !== pg.rows.get(i).id) return `index ${i} is ${pg.rows.get(i).id} in Figma and ${live[i]} in live/: harvest the page first`;
      return null;
    })();
    if (why) refused.push({ page: `${pg.pageName || "?"} (${pg.pageId})`, fileKey: pg.fileKey, why });
    else ok.push(pg);
  }
  return { pages: ok, refused, kv, want, direct };
}

/** What moved against an earlier baseline for the same page: changed, added, removed. */
export function compareBaseline(prev, rows) {
  const changed = [];
  const added = [];
  const before = new Map(Object.entries(prev || {}));
  for (const { id, h, n } of rows) {
    const p = before.get(id);
    if (p === undefined) added.push(id);
    else if (p.split(" ")[0] !== h) changed.push({ id, was: p, now: `${h} ${n}` });
    before.delete(id);
  }
  return { changed, added, removed: [...before.keys()] };
}

/** k of a stored frame, read from figma/store, or null when the store has no spec for it. */
export function storeFingerprint(figmaDir, frameKey) {
  const idxPath = path.join(figmaDir, "store", "index.json");
  if (!fs.existsSync(idxPath)) return null;
  const idx = JSON.parse(fs.readFileSync(idxPath, "utf8")).frames || {};
  const e = idx[frameKey];
  if (!e || !e.path) return null;
  const p = path.join(figmaDir, e.path);
  if (!fs.existsSync(p)) return null;
  const spec = JSON.parse(fs.readFileSync(p, "utf8"));
  const loadPart = (ref) => {
    const pe = idx[`${frameKey}/${ref}`];
    if (!pe || !pe.path || !fs.existsSync(path.join(figmaDir, pe.path))) return null;
    return JSON.parse(fs.readFileSync(path.join(figmaDir, pe.path), "utf8")).tree;
  };
  return { ...specFingerprint(spec.tree, loadPart), syncedAt: e.syncedAt || spec.syncedAt || null, page: e.page || spec.page || null, name: e.name || spec.name || null, stale: !!e.stale };
}
