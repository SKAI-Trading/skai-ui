// tokens/ store: reading, merging an export result, the call ledger, and lookups.
// Files and shapes are the contract in figma/SCHEMA.md (tokens/ and ledger/ sections).

import fs from "node:fs";
import path from "node:path";
import { EXPORT_KIND, PROVENANCE_KIND, fnv1a32 } from "./tokens-plugin.mjs";
import { readLedger, callsOn, budgetFrom, assertBudget as sharedAssertBudget, nonceSeen, appendLine, utcDay } from "./ledger.mjs";

export const FILES = {
  "3sSzw1KewMtUbeLAv7uW0r": "Skai-Web-App",
  mhF3BkzlTaGiLzJ7kvpmVc: "Skai-Web-App-2",
  M6r9FEn042UWTQD1zvy6GM: "Skai-Games",
};
export const LIBRARY_FILE = "TyX8YAtNDEIvsnSLQ3IXId";

const TYPE_OF = { C: "COLOR", F: "FLOAT", S: "STRING", B: "BOOLEAN" };

export function paths(root) {
  const t = path.join(root, "tokens");
  return {
    root,
    tokens: t,
    variables: path.join(t, "variables.json"),
    text: path.join(t, "text-styles.json"),
    effect: path.join(t, "effect-styles.json"),
    paint: path.join(t, "paint-styles.json"),
    sources: path.join(t, "sources.json"),
    drift: path.join(t, "DRIFT.md"),
    ledger: path.join(root, "ledger", "calls.jsonl"),
  };
}

const readJson = (f, dflt) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, "")) : dflt);

// Sorted keys at every level so a re-ingest of the same data writes the same bytes. LF only.
function sortDeep(x) {
  if (Array.isArray(x)) return x.map(sortDeep);
  if (x && typeof x === "object") {
    const o = {};
    for (const k of Object.keys(x).sort()) o[k] = sortDeep(x[k]);
    return o;
  }
  return x;
}
export function writeJson(f, obj) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(sortDeep(obj), null, 2) + "\n");
}

// ---------------------------------------------------------------- ledger

// The ledger and the budget are lib/ledger.mjs's: one reading of calls.jsonl for sync and tokens alike.
export { utcDay };

export function callsToday(p, day = utcDay()) {
  return callsOn(readLedger(p.ledger), day);
}

export function budget() {
  return budgetFrom();
}

/** Throws when one more call would pass the daily cap. `left` counts this call as not yet made. */
export function assertBudget(p) {
  const lines = readLedger(p.ledger);
  const day = utcDay();
  const cap = budgetFrom();
  sharedAssertBudget(lines, { day, budget: cap, need: 1 });
  const used = callsOn(lines, day);
  return { used, cap, left: cap - used };
}

/** How the ledger has seen a result by its checksum (the nonce of a tokens line): "ok", "refused" or null. */
export function ledgerSeen(p, sum) {
  if (!sum) return null;
  const lines = readLedger(p.ledger).map((l) => (l.nonce === undefined && l.sum !== undefined ? { ...l, nonce: l.sum, ok: l.ok !== false } : l));
  return nonceSeen(lines, sum);
}
export const ledgerHas = (p, sum) => ledgerSeen(p, sum) === "ok";

export function appendLedger(p, entry) {
  const at = new Date().toISOString();
  const line = { at, day: at.slice(0, 10), kind: "tokens", calls: 1, ok: true, ...entry };
  appendLine(p.ledger, line);
  return line;
}

// ---------------------------------------------------------------- load / emit

/**
 * Loads tokens/ into key-indexed maps. Keys (Figma's publish keys) are the identity: names
 * are only the emitted index, and a name shared by two collections is re-keyed on emit.
 */
export function load(p) {
  const vj = readJson(p.variables, { v: 1, variables: {}, collections: {} });
  const vars = new Map();
  const nameToKey = new Map();
  for (const [name, e] of Object.entries(vj.variables || {})) {
    vars.set(e.key, { ...e, name: e.name || name });
    nameToKey.set(name, e.key);
  }
  // Stored aliases carry the emitted name; hold them by key so a later re-key cannot break them.
  for (const e of vars.values()) {
    for (const [m, val] of Object.entries(e.modes || {})) {
      if (val && typeof val === "object" && "alias" in val) {
        const k = nameToKey.get(val.alias);
        e.modes[m] = k ? { aliasKey: k } : { alias: val.alias };
      }
    }
  }
  const styles = (f, kind) => {
    const m = new Map();
    for (const [name, e] of Object.entries(readJson(f, {}))) m.set(e.key, { ...e, name, kind });
    return m;
  };
  return {
    vars,
    collections: vj.collections || {},
    text: styles(p.text, "text"),
    effect: styles(p.effect, "effect"),
    paint: styles(p.paint, "paint"),
    sources: migrateSources(readJson(p.sources, { v: 1, runs: {}, library: null })),
  };
}

/** Recomputes run.complete and run.coverage from the per-page counts. */
export function coverageOf(run) {
  const planned = run.plannedPages || Object.keys(run.pages);
  // Without the planned page list a record cannot prove it saw every page.
  run.complete = !!run.plannedPages && planned.every((id) => run.pages[id] && !run.pages[id].missing && run.pages[id].walked >= run.pages[id].children);
  const tops = planned.reduce((n, id) => n + ((run.pages[id] && run.pages[id].children) || 0), 0);
  const walkedTops = planned.reduce((n, id) => n + ((run.pages[id] && run.pages[id].walked) || 0), 0);
  // A page never loaded has no child count yet, so the denominator covers only pages the walk reached.
  const notReached = planned.filter((id) => !run.pages[id]);
  run.coverage = {
    pagesPlanned: planned.length,
    pagesTouched: planned.filter((id) => run.pages[id] && run.pages[id].walked > 0).length,
    pagesNotReached: notReached,
    framesWalked: walkedTops,
    framesOnReachedPages: tops,
  };
  return run.coverage;
}

// A run record from before passes existed (one cursor, usesByKey) becomes a single stride-1 pass.
function migrateSources(src) {
  for (const [k, run] of Object.entries(src.runs || {})) {
    if (run.passes) continue;
    const m = { ...run, passes: [{ stride: 1, offset: 0, from: [0, 0], calls: run.calls, frames: run.frames, next: run.next }], usesInWalkedFrames: run.usesByKey || {} };
    if (FILES[k]) m.fileName = FILES[k];
    delete m.usesByKey;
    delete m.next;
    src.runs[k] = m;
  }
  for (const run of Object.values(src.runs || {})) coverageOf(run);
  return src;
}

export function knownKeys(st) {
  const out = [];
  for (const m of [st.vars, st.text, st.effect, st.paint]) for (const [k, e] of m) if (e.remote) out.push(k.slice(0, 12));
  return out.sort();
}

function variableNames(st) {
  const count = new Map();
  for (const e of st.vars.values()) count.set(e.name, (count.get(e.name) || 0) + 1);
  const nameOf = new Map();
  for (const [k, e] of st.vars) nameOf.set(k, count.get(e.name) > 1 ? `${e.collection}/${e.name}` : e.name);
  return nameOf;
}

function styleNames(m) {
  const count = new Map();
  for (const e of m.values()) count.set(e.name, (count.get(e.name) || 0) + 1);
  const nameOf = new Map();
  for (const [k, e] of m) nameOf.set(k, count.get(e.name) > 1 ? `${e.name} #${k.slice(0, 6)}` : e.name);
  return nameOf;
}

/** key12 or full key -> emitted variable name */
function resolverFor(st) {
  const nameOf = variableNames(st);
  const by12 = new Map();
  for (const k of st.vars.keys()) by12.set(k.slice(0, 12), k);
  return (ref) => {
    const k = st.vars.has(ref) ? ref : by12.get(String(ref).slice(0, 12));
    return k ? nameOf.get(k) : null;
  };
}

// "$<key12>" markers in paints/effects, left by the plugin script where a variable was bound.
function resolveMarkers(x, nameOfRef, unresolved) {
  if (typeof x === "string") {
    const m = /^\$([0-9a-f]{12})(@[\d.]+)?$/i.exec(x);
    if (!m) return x;
    const n = nameOfRef(m[1]);
    if (!n) {
      unresolved.add(m[1]);
      return x;
    }
    return n + (m[2] || "");
  }
  if (Array.isArray(x)) return x.map((y) => resolveMarkers(y, nameOfRef, unresolved));
  if (x && typeof x === "object") {
    const o = {};
    for (const [k, v] of Object.entries(x)) o[k] = resolveMarkers(v, nameOfRef, unresolved);
    return o;
  }
  return x;
}

export function save(p, st, syncedAt) {
  applyLibrary(st);
  const nameOfRef = resolverFor(st);
  const nameOf = variableNames(st);
  const unresolved = new Set();
  const variables = {};
  for (const [k, e] of st.vars) {
    const modes = {};
    for (const [m, val] of Object.entries(e.modes || {})) {
      if (val && typeof val === "object" && "aliasKey" in val) {
        const n = nameOfRef(val.aliasKey);
        if (!n) unresolved.add(val.aliasKey.slice(0, 12));
        modes[m] = { alias: n || `$${val.aliasKey.slice(0, 12)}` };
      } else if (val && typeof val === "object" && "alias" in val) {
        const n = /^\$[0-9a-f]{12}$/i.test(val.alias) ? nameOfRef(val.alias.slice(1)) : null;
        if (/^\$/.test(val.alias) && !n) unresolved.add(val.alias.slice(1));
        modes[m] = { alias: n || val.alias };
      } else modes[m] = val;
    }
    const out = { id: e.id, key: k, collection: e.collection, type: e.type, modes, remote: !!e.remote, scopes: e.scopes || [] };
    if (e.codeSyntax) out.codeSyntax = e.codeSyntax;
    variables[nameOf.get(k)] = out;
  }
  writeJson(p.variables, { v: 1, syncedAt, collections: st.collections, variables });

  const emitStyles = (m, f, shape) => {
    const nameOfStyle = styleNames(m);
    const o = {};
    for (const [k, e] of m) o[nameOfStyle.get(k)] = resolveMarkers(shape(e, k), nameOfRef, unresolved);
    if (m.size || fs.existsSync(f)) writeJson(f, o);
  };
  emitStyles(st.text, p.text, (e, k) => {
    const o = { ff: e.ff, fs: e.fs, fw: e.fw, lh: e.lh, ls: e.ls, tc: e.tc, td: e.td, key: k, remote: !!e.remote };
    if (e.bv) o.bv = e.bv;
    return o;
  });
  emitStyles(st.effect, p.effect, (e, k) => ({ effects: e.effects, key: k, remote: !!e.remote }));
  emitStyles(st.paint, p.paint, (e, k) => ({ paints: e.paints, key: k, remote: !!e.remote }));
  writeJson(p.sources, st.sources);
  return { unresolved: [...unresolved].sort() };
}

// ---------------------------------------------------------------- ingest

/** @type {Array<[RegExp, number]>} */
const WEIGHTS = [
  [/thin|hairline/i, 100],
  [/extra ?light|ultra ?light/i, 200],
  [/light/i, 300],
  [/regular|normal|book|roman/i, 400],
  [/medium/i, 500],
  [/semi ?bold|demi ?bold/i, 600],
  [/extra ?bold|ultra ?bold|heavy/i, 800],
  [/bold/i, 700],
  [/black/i, 900],
];
/** Figma reports a font STYLE ("Semi Bold"); the contract wants a weight. Unknown styles stay as text. */
export function weightOf(style) {
  const s = String(style || "");
  for (const [re, w] of WEIGHTS) if (re.test(s)) return /italic/i.test(s) ? `${w} italic` : w;
  return s;
}

/** Parses a saved use_figma result and refuses one whose payload does not match its checksum. */
export function parseResult(text, kind) {
  let r = JSON.parse(String(text).replace(/^﻿/, ""));
  // Some transports wrap the return value; accept {result: {...}} too.
  if (r && r.result && r.result.k) r = r.result;
  if (!r || r.k !== kind) throw new Error(`not a ${kind} result (k=${r && r.k})`);
  const sum = fnv1a32(JSON.stringify(r.d));
  if (sum !== r.sum) throw new Error(`checksum mismatch: payload hashes to ${sum}, result says ${r.sum}: the saved copy is not the result Figma returned`);
  return r;
}

/**
 * Merges one export result into the store. Returns a summary. The ledger line is written by the
 * caller BEFORE this runs, so a crash here still counts the call.
 */
export function ingestExport(st, r, at) {
  const { h, d } = r;
  const idOf = (idc, key) => (idc.indexOf("~") >= 0 ? idc.replace("~", key) : idc);
  const added = { v: 0, ts: 0, es: 0, ps: 0 };
  const uses = new Map();
  for (const c of d.col) {
    const [name, key, remote, modes, n] = c;
    const prev = st.collections[name] || {};
    st.collections[name] = { ...prev, key, remote: !!remote, modes, variables: Math.max(n || 0, prev.variables || 0), seenIn: [...new Set([...(prev.seenIn || []), h.file])].sort() };
  }
  for (const row of d.v) {
    const [idc, name, ci, T, key, remote, scopes, vals, u, web] = row;
    const col = d.col[ci];
    const modes = {};
    col[3].forEach((m, i) => {
      const val = vals[i];
      modes[m] = val && typeof val === "object" && "a" in val ? { alias: val.a.startsWith("?") ? val.a : `$${val.a}` } : val;
    });
    const e = { id: idOf(idc, key), name, collection: col[0], type: TYPE_OF[T] || T, modes, remote: !!remote, scopes };
    if (web) e.codeSyntax = { WEB: web };
    if (!st.vars.has(key)) added.v++;
    st.vars.set(key, e);
    uses.set(key, (uses.get(key) || 0) + (u || 0));
  }
  for (const row of d.ts) {
    const [name, key, remote, ff, style, size, lh, ls, tc, td, u, bv] = row;
    const e = { name, kind: "text", ff, fs: size, fw: weightOf(style), lh, ls, tc, td, remote: !!remote };
    if (bv) e.bv = bv;
    if (!st.text.has(key)) added.ts++;
    st.text.set(key, e);
    uses.set(key, (uses.get(key) || 0) + (u || 0));
  }
  for (const row of d.es) {
    const [name, key, remote, effects, u] = row;
    if (!st.effect.has(key)) added.es++;
    st.effect.set(key, { name, kind: "effect", effects, remote: !!remote });
    uses.set(key, (uses.get(key) || 0) + (u || 0));
  }
  for (const row of d.ps) {
    const [name, key, remote, paints, u] = row;
    if (!st.paint.has(key)) added.ps++;
    st.paint.set(key, { name, kind: "paint", paints, remote: !!remote });
    uses.set(key, (uses.get(key) || 0) + (u || 0));
  }
  // Use counts for definitions this call skipped because they were already stored.
  const full = (k12) => {
    for (const m of [st.vars, st.text, st.effect, st.paint]) for (const k of m.keys()) if (k.startsWith(k12)) return k;
    return null;
  };
  const unknownUses = [];
  for (const [k12, u] of d.uk) {
    const k = full(k12);
    if (k) uses.set(k, (uses.get(k) || 0) + (u || 0));
    else unknownUses.push(k12);
  }

  // Per-file run record. Coverage is counted per page, so "complete" means every planned page was walked to
  // its last top-level frame, never merely that a call returned without a cursor.
  const fileName = FILES[h.file] || h.fileName;
  const stride = h.stride || 1;
  const offset = h.offset || 0;
  const fromZero = !h.from || (h.from[0] === 0 && h.from[1] === 0);
  let run = st.sources.runs[h.file];
  const rewalk = run && fromZero && (stride === 1 || (run.passes || []).some((p) => p.stride === stride && p.offset === offset));
  if (!run || rewalk) run = { startedAt: at, calls: 0, frames: 0, nodes: 0, ms: 0, pages: {}, passes: [], usesInWalkedFrames: {} };
  run.fileName = fileName;
  run.updatedAt = at;
  run.calls += 1;
  run.frames += h.frames;
  run.nodes += h.nodes;
  run.ms += h.ms;
  if (h.plan) run.plannedPages = h.plan;
  let pass = fromZero ? null : run.passes.find((p) => p.stride === stride && p.offset === offset && p.next);
  if (!pass) {
    pass = { stride, offset, from: h.from || [0, 0], calls: 0, frames: 0 };
    run.passes.push(pass);
  }
  pass.calls += 1;
  pass.frames += h.frames;
  pass.next = h.next;
  run.truncated = (run.truncated || 0) + (d.trunc || 0);
  for (const [id, walked, total] of h.pages) {
    const pg = run.pages[id] || { walked: 0, children: total };
    if (walked === -1) pg.missing = true;
    else pg.walked = Math.min(total, pg.walked + walked);
    pg.children = total;
    run.pages[id] = pg;
  }
  coverageOf(run);
  for (const [k, u] of uses) run.usesInWalkedFrames[k] = (run.usesInWalkedFrames[k] || 0) + u;
  if (Object.keys(d.err || {}).length) run.errors = { ...(run.errors || {}), ...d.err };
  if (d.miss.length) run.unresolvedIds = [...new Set([...(run.unresolvedIds || []), ...d.miss])].sort();
  st.sources.runs[h.file] = run;
  return { added, truncated: d.trunc || 0, next: h.next, unknownUses, miss: d.missN || d.miss.length, errors: d.err || {}, coverage: run.coverage, complete: run.complete };
}

/** The open pass to continue, if the last call on this file stopped on its time budget. */
export function openPass(st, fileKey) {
  const run = st.sources.runs[fileKey];
  if (!run || !run.passes) return null;
  return run.passes.filter((p) => p.next).pop() || null;
}

export const LIBRARY_NAME = "Skai-Design";

export function ingestProvenance(st, r, at) {
  const { h, d } = r;
  st.sources.library = {
    file: h.file,
    fileName: h.file === LIBRARY_FILE ? LIBRARY_NAME : h.fileName,
    note: "use_figma reports figma.root.name as 'Document'; the file is identified by the fileKey the call ran against",
    checkedAt: at,
    localCollections: d.cols.map(([name, key, modes, n]) => ({ name, key, modes, variables: n })),
    localCounts: d.counts,
    keys: d.lib,
    keysCut: d.cut || 0,
  };
  applyLibrary(st);
  return st.sources.library;
}

const unpackW = (s, w) => {
  const out = new Set();
  for (let i = 0; i + w <= String(s || "").length; i += w) out.add(s.slice(i, i + w));
  return out;
};

/**
 * Marks every stored token and collection with whether the library file defines it, from the library's own
 * key prefixes (sources.library.keys). Runs on every save, so a token exported after the check is still judged.
 */
export function applyLibrary(st) {
  const lib = st.sources.library;
  if (!lib || !lib.keys) return null;
  const w = lib.keys.w || 12;
  const sets = { v: unpackW(lib.keys.v, w), t: unpackW(lib.keys.t, w), e: unpackW(lib.keys.e, w), p: unpackW(lib.keys.p, w) };
  const colKeys = new Set(lib.localCollections.map((c) => c.key));
  for (const [name, c] of Object.entries(st.collections)) {
    c.library = colKeys.has(c.key)
      ? { file: lib.file, fileName: lib.fileName, proof: "this collection's key is a local collection of that file" }
      : { file: null, proof: `this collection's key is NOT a local collection of ${lib.file}` };
    st.collections[name] = c;
  }
  const tally = (m, set, label, names) => {
    const miss = [];
    let hit = 0;
    for (const [k] of m) {
      if (set.has(k.slice(0, w))) hit++;
      else miss.push(names.get(k));
    }
    return { kind: label, stored: m.size, inLibrary: hit, notInLibrary: miss.sort() };
  };
  lib.match = [
    tally(st.vars, sets.v, "variables", variableNames(st)),
    tally(st.text, sets.t, "text styles", styleNames(st.text)),
    tally(st.effect, sets.e, "effect styles", styleNames(st.effect)),
    tally(st.paint, sets.p, "paint styles", styleNames(st.paint)),
  ];
  lib.collectionsMatched = Object.values(st.collections).filter((c) => c.library && c.library.file).length;
  return lib;
}

// ---------------------------------------------------------------- lookups

export function allTokens(st) {
  const nameOfVar = variableNames(st);
  const out = [];
  for (const [k, e] of st.vars) out.push({ kind: "variable", name: nameOfVar.get(k), key: k, collection: e.collection, type: e.type, entry: e });
  const add = (m, kind, type) => {
    const n = styleNames(m);
    for (const [k, e] of m) out.push({ kind, name: n.get(k), key: k, collection: `${kind.replace(/-style$/, "")} styles`, type, entry: e });
  };
  add(st.text, "text-style", "TEXT");
  add(st.effect, "effect-style", "EFFECT");
  add(st.paint, "paint-style", "PAINT");
  return out.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/** Follows an alias chain to a concrete value for one mode (the first mode when none is named). */
export function resolveValue(st, entry, mode, seen = new Set()) {
  const modes = entry.modes || {};
  const m = mode && mode in modes ? mode : Object.keys(modes)[0];
  const val = modes[m];
  if (val && typeof val === "object" && ("aliasKey" in val || "alias" in val)) {
    let k = val.aliasKey || null;
    if (!k && /^\$[0-9a-f]{12}$/i.test(val.alias)) for (const key of st.vars.keys()) if (key.startsWith(val.alias.slice(1))) k = key;
    const target = k ? st.vars.get(k) : null;
    if (!target || seen.has(k)) return { unresolved: val.alias || val.aliasKey };
    seen.add(k);
    return resolveValue(st, target, mode, seen);
  }
  return val;
}

export { EXPORT_KIND, PROVENANCE_KIND };
