// Source of the read-only scripts that run INSIDE Figma (use_figma) for the tokens export.
//
// Every script only reads. None creates, sets, appends, removes, renames or imports anything:
// importVariableByKeyAsync / importComponentByKeyAsync would write into the file, and
// figma.teamLibrary is not implemented in use_figma, so provenance is proved by KEY instead
// (see provenanceScript). libraryScript reads the library file's own definitions, complete.
//
// A result is JSON of the form {k, h, d, sum}: `d` is the payload, `sum` its fnv1a32 over
// JSON.stringify(d), so a copy of the result that lost or changed a character is refused at ingest.

import { randomBytes } from "node:crypto";

export const EXPORT_KIND = "tokens-export/1";
export const PROVENANCE_KIND = "tokens-provenance/1";
export const LIBRARY_KIND = "tokens-library/1";

// Kept below the 20 KB cut with room for the envelope.
export const RESULT_CAP = 16000;
export const SCRIPT_CAP = 18000;

export function fnv1a32(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// Shared helpers, pasted into both scripts. Plain ES2019: no optional chaining, no `??`.
const HELPERS = String.raw`
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); }
const k12 = (k) => String(k || "").slice(0, 12);
const h2 = (x) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, "0").toUpperCase();
const r2 = (x) => Math.round(x * 100) / 100;
const r4 = (x) => Math.round(x * 10000) / 10000;
function hex(c, extra) {
  const a = (c.a === undefined ? 1 : c.a) * (extra === undefined ? 1 : extra);
  const s = "#" + h2(c.r) + h2(c.g) + h2(c.b);
  return a < 0.999 ? s + h2(a) : s;
}
function atHex(c, extra) {
  const a = (c.a === undefined ? 1 : c.a) * (extra === undefined ? 1 : extra);
  const s = "#" + h2(c.r) + h2(c.g) + h2(c.b);
  return a < 0.999 ? s + "@" + r2(a) : s;
}
const errs = {};
function noteErr(where, e) { const k = where + ": " + String((e && e.message) || e).slice(0, 80); errs[k] = (errs[k] || 0) + 1; }
function unpack(s) { const out = new Set(); for (let i = 0; i + 12 <= s.length; i += 12) out.add(s.slice(i, i + 12)); return out; }
function done(kind, head, d) { const body = JSON.stringify(d); return { k: kind, h: head, d: d, sum: fnv(body) }; }
`;

// Paint, effect and text-metric readers, pasted into the export and library scripts. Each script defines
// ref(alias): "$<key12>" for a variable it can name, "?<id>" for one it cannot.
const READERS = String.raw`
function paint(p) {
  if (p.visible === false) return null;
  if (p.type === "SOLID") {
    const b = p.boundVariables && p.boundVariables.color;
    const op = p.opacity === undefined ? 1 : p.opacity;
    return b ? ref(b) + (op < 0.999 ? "@" + r2(op) : "") : atHex(p.color, op);
  }
  if (p.type.indexOf("GRADIENT_") === 0) {
    const t = p.gradientTransform;
    const stops = p.gradientStops.map((s) => [r4(s.position), (s.boundVariables && s.boundVariables.color) ? ref(s.boundVariables.color) : atHex(s.color)]);
    const o = { grad: p.type.slice(9), stops: stops };
    if (t) o.angle = Math.round(Math.atan2(t[1][0], t[0][0]) * 180 / Math.PI);
    if (p.opacity !== undefined && p.opacity < 0.999) o.op = r2(p.opacity);
    return o;
  }
  if (p.type === "IMAGE") return { img: p.imageHash, scale: p.scaleMode };
  if (p.type === "VIDEO") return { video: p.videoHash };
  return { raw: p.type };
}
function effect(e) {
  if (e.visible === false) return null;
  const b = e.boundVariables || {};
  const o = { t: e.type };
  if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW") {
    o.c = b.color ? ref(b.color) : atHex(e.color);
    o.o = [e.offset.x, e.offset.y];
    o.r = e.radius;
    if (e.spread) o.sp = e.spread;
  } else o.r = e.radius;
  return o;
}
const lh = (x) => !x || x.unit === "AUTO" ? "auto" : x.unit === "PERCENT" ? r2(x.value) + "%" : r2(x.value);
const ls = (x) => !x ? 0 : x.unit === "PERCENT" ? r2(x.value) + "%" : r2(x.value);
function bvOf(s) {
  const out = {};
  if (!("boundVariables" in s) || !s.boundVariables) return null;
  for (const f in s.boundVariables) { const a = s.boundVariables[f]; const x = Array.isArray(a) ? a[0] : a; if (x && x.id) out[f] = ref(x); }
  return Object.keys(out).length ? out : null;
}
`;

const EXPORT_BODY = String.raw`
const t0 = Date.now();
figma.skipInvisibleInstanceChildren = true;
const known = unpack(P.known);
const vUse = new Map();
const sUse = new Map();
const bump = (m, id) => m.set(id, (m.get(id) || 0) + 1);
function scan(x, m) {
  if (!x || typeof x !== "object") return;
  if (Array.isArray(x)) { for (const y of x) scan(y, m); return; }
  if (x.type === "VARIABLE_ALIAS" && typeof x.id === "string") { bump(m || vUse, x.id); return; }
  for (const key in x) scan(x[key], m);
}
const sid = (id) => { if (typeof id === "string" && id) bump(sUse, id); };
// A library id carries its publish key: "VariableID:<key>/<local>" and "S:<key>,<local>". A stored key is
// recognised from the id alone, which saves a resolve call (~0.25 s each) per known token.
const idKey = (id) => { const m = /^(?:VariableID:|S:)([0-9a-f]{40})[/,]/.exec(id); return m ? m[1] : null; };
const knownId = (id) => { const k = idKey(id); return k && known.has(k12(k)) ? k : null; };
// A property the node type lacks THROWS in use_figma (it is not undefined): test with the in operator first,
// and give each read its own try so one failure cannot drop the others.
function visit(n) {
  try { if ("boundVariables" in n) scan(n.boundVariables); } catch (e) { noteErr("boundVariables", e); }
  try {
    if (n.type === "TEXT") {
      const ts = n.textStyleId, fs = n.fillStyleId;
      if (typeof ts === "symbol" || typeof fs === "symbol") {
        for (const seg of n.getStyledTextSegments(["textStyleId", "fillStyleId"])) { sid(seg.textStyleId); sid(seg.fillStyleId); }
      } else { sid(ts); sid(fs); }
    } else if ("fillStyleId" in n) sid(n.fillStyleId);
  } catch (e) { noteErr("fill/text style", e); }
  try { if ("strokeStyleId" in n) sid(n.strokeStyleId); } catch (e) { noteErr("strokeStyleId", e); }
  try { if ("effectStyleId" in n) sid(n.effectStyleId); } catch (e) { noteErr("effectStyleId", e); }
}
const pagesOut = [];
let frames = 0, nodes = 0, next = null;
outer: for (let pi = P.from[0]; pi < P.pages.length; pi++) {
  if (Date.now() - t0 > P.budget) { next = [pi, 0]; break; }
  const page = await figma.getNodeByIdAsync(P.pages[pi]);
  if (!page || page.type !== "PAGE") { pagesOut.push([P.pages[pi], -1, 0, 0]); continue; }
  await page.loadAsync();
  const kids = page.children;
  const c0 = pi === P.from[0] ? P.from[1] : 0;
  let walked = 0;
  for (let ci = c0; ci < kids.length; ci++) {
    if (ci % P.stride !== P.offset) continue;
    if (Date.now() - t0 > P.budget) { next = [pi, ci]; pagesOut.push([page.id, walked, kids.length, c0]); break outer; }
    const top = kids[ci];
    visit(top); nodes++;
    if ("findAll" in top) { const all = top.findAll(); nodes += all.length; for (const n of all) visit(n); }
    walked++; frames++;
  }
  pagesOut.push([page.id, walked, kids.length, c0]);
}
const walkMs = Date.now() - t0;

const styles = new Map();
for (const id of sUse.keys()) {
  const kk = knownId(id);
  if (kk) { styles.set(id, { known: true, key: kk, remote: true, name: "" }); continue; }
  let s = null;
  try { s = await figma.getStyleByIdAsync(id); } catch (e) { noteErr("style", e); }
  styles.set(id, s);
  if (!s) continue;
  const extra = new Map();
  try {
    if ("boundVariables" in s) scan(s.boundVariables, extra);
    if (s.type === "PAINT") for (const p of s.paints) scan(p.boundVariables, extra);
    if (s.type === "EFFECT") for (const e of s.effects) scan(e.boundVariables, extra);
  } catch (e) { noteErr("stylevars", e); }
  for (const vid of extra.keys()) if (!vUse.has(vid)) vUse.set(vid, 0);
}

const vars = new Map();
const queue = Array.from(vUse.keys());
while (queue.length) {
  const id = queue.shift();
  if (vars.has(id)) continue;
  const kk = knownId(id);
  if (kk) { vars.set(id, { known: true, key: kk, remote: true, name: "" }); continue; }
  let v = null;
  try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) { noteErr("var", e); }
  vars.set(id, v);
  if (!v) continue;
  for (const m in v.valuesByMode) {
    const val = v.valuesByMode[m];
    if (val && val.type === "VARIABLE_ALIAS" && !vars.has(val.id)) queue.push(val.id);
  }
}
const cols = new Map();
for (const v of vars.values()) {
  if (!v || v.known || cols.has(v.variableCollectionId)) continue;
  let c = null;
  try { c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); } catch (e) { noteErr("collection", e); }
  cols.set(v.variableCollectionId, c);
}

const ref = (alias) => {
  if (!alias || !alias.id) return null;
  const v = vars.get(alias.id);
  return v ? "$" + k12(v.key) : "?" + alias.id;
};
function value(v, val) {
  if (val === undefined) return null;
  if (val && typeof val === "object" && val.type === "VARIABLE_ALIAS") return { a: ref(val).replace(/^\$/, "") };
  if (v.resolvedType === "COLOR") return hex(val);
  if (v.resolvedType === "FLOAT") return r4(val);
  return val;
}

const colIndex = new Map();
const d = { col: [], v: [], ts: [], es: [], ps: [], uk: [], miss: [], trunc: 0 };
const pending = [];
const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
const vList = Array.from(vars.entries()).filter((e) => e[1]).map((e) => ({ id: e[0], v: e[1], name: e[1].name })).sort(byName);
for (const it of vList) {
  const v = it.v;
  const uses = vUse.get(it.id) || 0;
  if (v.known || (v.remote && known.has(k12(v.key)))) { d.uk.push([k12(v.key), uses]); continue; }
  const c = cols.get(v.variableCollectionId);
  if (!colIndex.has(v.variableCollectionId)) {
    colIndex.set(v.variableCollectionId, d.col.length);
    d.col.push(c ? [c.name, c.key, c.remote ? 1 : 0, c.modes.map((m) => m.name), (c.variableIds || []).length] : ["?" + v.variableCollectionId, "", 1, Object.keys(v.valuesByMode), 0]);
  }
  const modeIds = c ? c.modes.map((m) => m.modeId) : Object.keys(v.valuesByMode);
  const idc = v.key && it.id.indexOf(v.key) >= 0 ? it.id.replace(v.key, "~") : it.id;
  const row = [idc, v.name, colIndex.get(v.variableCollectionId), v.resolvedType, v.key, v.remote ? 1 : 0, v.scopes, modeIds.map((m) => value(v, v.valuesByMode[m])), uses];
  if ("codeSyntax" in v && v.codeSyntax && v.codeSyntax.WEB) row.push(v.codeSyntax.WEB);
  pending.push(["v", row]);
}
const sList = Array.from(styles.entries()).filter((e) => e[1]).map((e) => ({ id: e[0], s: e[1], name: e[1].name })).sort(byName);
for (const it of sList) {
  const s = it.s;
  const uses = sUse.get(it.id) || 0;
  if (s.known || (s.remote && known.has(k12(s.key)))) { d.uk.push([k12(s.key), uses]); continue; }
  try {
    if (s.type === "TEXT") {
      const row = [s.name, s.key, s.remote ? 1 : 0, s.fontName.family, s.fontName.style, r2(s.fontSize), lh(s.lineHeight), ls(s.letterSpacing), s.textCase, s.textDecoration, uses];
      const bv = bvOf(s);
      if (bv) row.push(bv);
      pending.push(["ts", row]);
    } else if (s.type === "EFFECT") pending.push(["es", [s.name, s.key, s.remote ? 1 : 0, s.effects.map(effect).filter(Boolean), uses]]);
    else if (s.type === "PAINT") pending.push(["ps", [s.name, s.key, s.remote ? 1 : 0, s.paints.map(paint).filter(Boolean), uses]]);
  } catch (e) { noteErr("styleread", e); }
}
for (const e of vars.entries()) if (!e[1]) d.miss.push(e[0]);
for (const e of styles.entries()) if (!e[1]) d.miss.push(e[0]);
d.missN = d.miss.length;
d.miss = d.miss.slice(0, 40);

const head = { file: P.file, fileName: figma.root.name, from: P.from, stride: P.stride, offset: P.offset, plan: P.pages, next: next, pages: pagesOut, frames: frames, nodes: nodes, walkMs: walkMs, ms: Date.now() - t0, found: { v: vars.size, s: styles.size } };
let size = JSON.stringify(head).length + JSON.stringify(d).length + 200;
for (const p of pending) {
  const n = JSON.stringify(p[1]).length + 1;
  if (size + n > P.cap) { d.trunc++; continue; }
  size += n;
  d[p[0]].push(p[1]);
}
d.err = errs;
return done(KIND, head, d);
`;

const PROVENANCE_BODY = String.raw`
const t0 = Date.now();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const lists = { t: await figma.getLocalTextStylesAsync(), e: await figma.getLocalEffectStylesAsync(), p: await figma.getLocalPaintStylesAsync() };
// Key prefixes, packed. 12 characters each, or 8 when a large library would not fit (8 hex = 32 bits: a
// chance collision over a thousand keys is about 1 in 10,000). Past that the lists are cut and say so.
const packed = (list, w) => Array.from(new Set(list.map((x) => String(x.key || "").slice(0, w)))).sort().join("");
const all = (w) => ({ w: w, v: packed(vars, w), t: packed(lists.t, w), e: packed(lists.e, w), p: packed(lists.p, w) });
let lib = all(12);
if (JSON.stringify(lib).length > P.cap) lib = all(8);
let cut = 0;
while (JSON.stringify(lib).length > P.cap) { for (const k of ["v", "t", "e", "p"]) if (lib[k].length > 800) { lib[k] = lib[k].slice(0, lib[k].length - 800); cut++; } }
const d = {
  cols: cols.map((c) => [c.name, c.key, c.modes.map((m) => m.name), c.variableIds.length, c.remote ? 1 : 0]),
  counts: { vars: vars.length, text: lists.t.length, effect: lists.e.length, paint: lists.p.length },
  lib: lib,
  cut: cut
};
d.err = errs;
return done(KIND, { file: P.file, fileName: figma.root.name, ms: Date.now() - t0 }, d);
`;

// The library read: every local collection, variable and style of the library file itself, with values. Rows stream
// in one fixed order (variables by collection then name, then text, paint, effect and grid styles by name) and fill
// the result up to P.cap; P.from continues a read that did not fit. The cursor, the counts, the per-list checksums,
// the read id and the stream digest live inside d, so the result checksum covers them too.
const LIBRARY_BODY = String.raw`
const t0 = Date.now();
const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
const cols = (await figma.variables.getLocalVariableCollectionsAsync()).slice().sort(byName);
const vars = await figma.variables.getLocalVariablesAsync();
const lists = { ts: await figma.getLocalTextStylesAsync(), ps: await figma.getLocalPaintStylesAsync(), es: await figma.getLocalEffectStylesAsync(), gs: [] };
let gridRead = false;
try { lists.gs = await figma.getLocalGridStylesAsync(); gridRead = true; } catch (e) { noteErr("grid styles", e); }
const byId = new Map();
for (const v of vars) byId.set(v.id, v);
const ext = new Map();
const ref = (alias) => {
  if (!alias || !alias.id) return null;
  const v = byId.get(alias.id);
  if (v) return "$" + k12(v.key);
  ext.set(alias.id, 1);
  return "?" + alias.id;
};
function value(v, x) {
  if (x === undefined) return null;
  if (x && typeof x === "object" && x.type === "VARIABLE_ALIAS") return { a: ref(x).replace(/^\$/, "") };
  if (v.resolvedType === "COLOR") return hex(x);
  if (v.resolvedType === "FLOAT") return r4(x);
  return x;
}
function grid(g) {
  if (g.visible === false) return null;
  const o = { pattern: g.pattern };
  if (g.pattern === "GRID") o.sectionSize = g.sectionSize;
  else {
    o.alignment = g.alignment;
    o.gutterSize = g.gutterSize;
    o.count = g.count === Infinity ? "auto" : g.count;
    if (g.sectionSize !== undefined) o.sectionSize = g.sectionSize;
    if (g.offset !== undefined) o.offset = g.offset;
  }
  if (g.color) o.c = atHex(g.color);
  const bv = {};
  const b = g.boundVariables || {};
  for (const f in b) { const r = ref(b[f]); if (r) bv[f] = r; }
  if (Object.keys(bv).length) o.bv = bv;
  return o;
}

// Publish status: the product files see a library token as last PUBLISHED, so an unpublished edit matters.
// Read for every item at once, raced against P.pubBudget; an item whose status did not come back is "?".
const items = vars.concat(lists.ts, lists.ps, lists.es, lists.gs);
const pub = new Map();
let pubN = 0;
if (P.pub) {
  const work = Promise.all(items.map(async (x) => { try { pub.set(x.id, await x.getPublishStatusAsync()); pubN++; } catch (e) { noteErr("publish status", e); } }));
  if (typeof setTimeout === "function") await Promise.race([work, new Promise((r) => setTimeout(r, P.pubBudget))]);
  else await work;
}
const pc = (x) => { if (!P.pub) return ""; const s = pub.get(x.id); return s === undefined ? "?" : s === "UNPUBLISHED" ? "U" : s === "CHANGED" ? "X" : ""; };
// Trailing defaults are dropped from a row ("" for no code syntax / no status, 0 for not hidden / no bound variables).
const trim = (row) => { while (row.length && (row[row.length - 1] === "" || row[row.length - 1] === 0)) row.pop(); return row; };

const colIx = new Map(cols.map((c, i) => [c.id, i]));
const T = { COLOR: "C", FLOAT: "F", STRING: "S", BOOLEAN: "B" };
const d = { m: null, cols: [], v: [], ts: [], ps: [], es: [], gs: [], ext: [], bad: [] };
// A collection's variable count is always sent, 0 included: only the hidden flag is optional.
for (const c of cols) d.cols.push([c.name, c.key, c.modes.map((m) => m.name), c.variableIds.length].concat(c.hiddenFromPublishing ? [1] : []));
const ci = (v) => (colIx.has(v.variableCollectionId) ? colIx.get(v.variableCollectionId) : -1);
// Each row is built without its publish status, which is appended for the result. core keeps the rows without it for
// the stream digest: a status that did not come back on one call is not a change to the library.
const stream = [];
const core = [];
const add = (kind, x, build) => {
  try {
    const row = build(x);
    stream.push([kind, trim(row.concat([pc(x)]))]);
    core.push([kind, trim(row)]);
  } catch (e) { noteErr(kind, e); d.bad.push([kind, x.name, x.key]); }
};
for (const v of vars.slice().sort((a, b) => ci(a) - ci(b) || byName(a, b))) {
  add("v", v, (v) => {
    const i = ci(v);
    const modeIds = i >= 0 ? cols[i].modes.map((m) => m.modeId) : Object.keys(v.valuesByMode);
    return [v.id.replace(/^VariableID:/, ""), v.name, i, T[v.resolvedType] || v.resolvedType, v.key, v.scopes, modeIds.map((m) => value(v, v.valuesByMode[m])), (v.codeSyntax && v.codeSyntax.WEB) || "", v.hiddenFromPublishing ? 1 : 0];
  });
}
for (const s of lists.ts.slice().sort(byName)) add("ts", s, (s) => [s.name, s.key, s.fontName.family, s.fontName.style, r2(s.fontSize), lh(s.lineHeight), ls(s.letterSpacing), s.textCase, s.textDecoration, bvOf(s) || 0]);
for (const s of lists.ps.slice().sort(byName)) add("ps", s, (s) => [s.name, s.key, s.paints.map(paint).filter(Boolean)]);
for (const s of lists.es.slice().sort(byName)) add("es", s, (s) => [s.name, s.key, s.effects.map(effect).filter(Boolean)]);
for (const s of lists.gs.slice().sort(byName)) add("gs", s, (s) => [s.name, s.key, s.layoutGrids.map(grid).filter(Boolean)]);
for (const id of ext.keys()) {
  let v = null;
  try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) { noteErr("alias target", e); }
  d.ext.push([id, v ? v.name : null, v ? v.key : null]);
}

const counts = { cols: cols.length, v: vars.length, ts: lists.ts.length, ps: lists.ps.length, es: lists.es.length, gs: lists.gs.length };
// read: the id library-script gave this read at row 0, so a part of another read cannot pass as the next part of this
// one. digest: the whole stream the library gave THIS call, so a part read after the library changed in any row
// (deleted, added, renamed or edited, on either side of the cursor) does not match the parts before it.
const digest = fnv(JSON.stringify([d.cols, core]));
d.m = { file: P.file, read: P.read, digest: digest, from: P.from, n: 0, next: null, total: stream.length, counts: counts, gridRead: gridRead, pub: P.pub ? pubN : -1, items: items.length, ms: 0, sums: { v: "00000000", ts: "00000000", ps: "00000000", es: "00000000", gs: "00000000" } };
d.err = errs;
let size = JSON.stringify(d).length + 300;
let i = P.from;
for (; i < stream.length; i++) {
  const n = JSON.stringify(stream[i][1]).length + 1;
  // A part always carries at least one row, so a read cannot stall at a cursor.
  if (size + n > P.cap && i > P.from) break;
  size += n;
  d[stream[i][0]].push(stream[i][1]);
}
d.m.n = i - P.from;
d.m.next = i < stream.length ? i : null;
for (const k of ["v", "ts", "ps", "es", "gs"]) d.m.sums[k] = fnv(JSON.stringify(d[k]));
d.m.ms = Date.now() - t0;
return done(KIND, { file: P.file }, d);
`;

// Key prefixes travel as one string of 12-character blocks: a third smaller than a JSON array.
function pack(keys) {
  const uniq = [...new Set(keys.map((k) => String(k).slice(0, 12)))].sort();
  for (const k of uniq) if (k.length !== 12) throw new Error(`key shorter than 12 characters: ${k}`);
  return uniq.join("");
}

function assemble(kind, params, ...blocks) {
  return [
    `// ${kind} (read-only). Generated by modules/skai-ui/figma/tokens.mjs; paste as-is into use_figma.`,
    `const KIND = ${JSON.stringify(kind)};`,
    `const P = ${JSON.stringify(params)};`,
    HELPERS.trim(),
    ...blocks.map((b) => b.trim()),
    "",
  ].join("\n");
}

/**
 * @param {{file: string, pages: string[], known: string[], from?: number[], stride?: number, offset?: number, budget?: number, cap?: number}} p
 */
export function exportScript(p) {
  const params = {
    file: p.file,
    pages: p.pages,
    known: pack(p.known || []),
    from: p.from || [0, 0],
    stride: p.stride || 1,
    offset: p.offset || 0,
    budget: p.budget || 30000,
    cap: p.cap || RESULT_CAP,
  };
  return assemble(EXPORT_KIND, params, READERS, EXPORT_BODY);
}

/** A fresh library-read id: 12 hex characters, minted in Node (the plugin sandbox has no crypto). */
export function newReadId() {
  return randomBytes(6).toString("hex");
}

/**
 * The library read (read-only): every local collection, variable and style of `file`, with values, from row `from`.
 * A read from row 0 gets a new read id; a continuation must be given the id of the read it continues.
 * @param {{file: string, from?: number, read?: string, cap?: number, pub?: boolean, pubBudget?: number}} p
 */
export function libraryScript(p) {
  const from = p.from || 0;
  if (from > 0 && !p.read) throw new Error(`a library read continued from row ${from} needs the id of the read it continues`);
  const params = { file: p.file, read: p.read || newReadId(), from, cap: p.cap || RESULT_CAP, pub: p.pub !== false, pubBudget: p.pubBudget || 8000 };
  return assemble(LIBRARY_KIND, params, READERS, LIBRARY_BODY);
}

/**
 * @param {{file: string, cap?: number}} p
 */
export function provenanceScript(p) {
  return assemble(PROVENANCE_KIND, { file: p.file, cap: p.cap || RESULT_CAP - 1500 }, PROVENANCE_BODY);
}

// Runs a generated script the way use_figma does (top-level await and return inside an async
// function), against whatever `figma` object is passed. Used by the self-test with a mock.
export async function runScript(src, figma) {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  return new AsyncFunction("figma", src)(figma);
}
