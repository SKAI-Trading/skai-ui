// node figma/tokens.mjs --self-test: runs without Figma. The generated scripts are executed
// against a mock of the Plugin API built from fixtures/tokens-mock.json, then ingested into a
// temporary store, so what is tested is the exact text a use_figma call would receive.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportScript, provenanceScript, libraryScript, runScript, fnv1a32, SCRIPT_CAP, LIBRARY_KIND } from "./tokens-plugin.mjs";
import {
  paths,
  load,
  save,
  knownKeys,
  assertBudget,
  appendLedger,
  ledgerHas,
  openPass,
  callsToday,
  parseResult,
  ingestExport,
  ingestProvenance,
  ingestLibrary,
  weightOf,
  resolveValue,
  allTokens,
  EXPORT_KIND,
  PROVENANCE_KIND,
} from "./tokens-store.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(HERE, "fixtures");
const MIXED = Symbol("mixed");

// ------------------------------------------------------------------ mock Plugin API

export function mockFigma(fx, opts = {}) {
  const calls = [];
  const alias = (id) => ({ type: "VARIABLE_ALIAS", id });
  const bvOf = (bv) => {
    const o = {};
    for (const [k, v] of Object.entries(bv || {})) o[k] = Array.isArray(v) ? v.map(alias) : alias(v);
    return o;
  };
  // use_figma THROWS on a property the node type does not have (it does not return undefined):
  // "node.findAll: no such property 'findAll' on RECTANGLE node". The mock does the same, per type.
  const PROPS = {
    FRAME: ["fillStyleId", "strokeStyleId", "effectStyleId", "children", "findAll"],
    GROUP: ["effectStyleId", "children", "findAll"],
    RECTANGLE: ["fillStyleId", "strokeStyleId", "effectStyleId"],
    TEXT: ["fillStyleId", "strokeStyleId", "effectStyleId", "textStyleId", "getStyledTextSegments"],
  };
  const strict = (obj) =>
    new Proxy(obj, {
      get(target, k) {
        if (typeof k === "symbol" || k in target) return target[k];
        throw new TypeError(`node.${String(k)}: no such property '${String(k)}' on ${target.type} node`);
      },
    });
  const makeNode = (n) => {
    const kids = (n.kids || []).map(makeNode);
    const all = {
      id: n.id,
      type: n.type,
      boundVariables: bvOf(n.bv),
      textStyleId: n.textStyleId === "MIXED" ? MIXED : n.textStyleId || "",
      fillStyleId: n.fillStyleId === "MIXED" ? MIXED : n.fillStyleId || "",
      strokeStyleId: "",
      effectStyleId: n.effectStyleId || "",
      children: kids,
      findAll() {
        const out = [];
        const walk = (x) => {
          for (const c of "children" in x ? x.children : []) {
            out.push(c);
            walk(c);
          }
        };
        walk(this);
        return out;
      },
      getStyledTextSegments(fields) {
        calls.push(["segments", n.id, fields.join(",")]);
        return (n.segments || []).map((s) => ({ ...s }));
      },
    };
    const node = { id: all.id, type: all.type, boundVariables: all.boundVariables };
    for (const k of PROPS[n.type] || []) node[k] = all[k];
    return strict(node);
  };
  const pages = new Map();
  for (const pg of fx.file.pages) {
    let loaded = false;
    const children = pg.children.map(makeNode);
    const page = {
      id: pg.id,
      type: "PAGE",
      name: pg.name,
      async loadAsync() {
        calls.push(["loadAsync", pg.id]);
        loaded = true;
      },
      get children() {
        if (!loaded) throw new Error(`page ${pg.id} read before loadAsync`);
        return children;
      },
    };
    pages.set(pg.id, page);
  }
  const cols = new Map(
    fx.collections.map((c) => [
      c.id,
      { id: c.id, name: c.name, key: c.key, remote: c.remote, modes: c.modes.map(([modeId, name]) => ({ modeId, name })), variableIds: new Array(c.count).fill("x") },
    ]),
  );
  const vars = new Map(
    fx.variables.map((v) => {
      const valuesByMode = {};
      for (const [m, val] of Object.entries(v.values)) valuesByMode[m] = val && val.alias ? alias(val.alias) : val;
      const obj = { id: v.id, key: v.key, name: v.name, remote: true, resolvedType: v.type, scopes: v.scopes, variableCollectionId: v.col, valuesByMode, codeSyntax: v.web ? { WEB: v.web } : {} };
      return [v.id, obj];
    }),
  );
  const styles = new Map(
    fx.styles.map((s) => {
      const o = { id: s.id, key: s.key, name: s.name, type: s.type, remote: true };
      if (s.type === "TEXT") Object.assign(o, { fontName: s.fontName, fontSize: s.fontSize, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textCase: s.textCase, textDecoration: s.textDecoration, boundVariables: bvOf(s.bv) });
      if (s.type === "EFFECT") o.effects = s.effects;
      if (s.type === "PAINT") o.paints = s.paints.map((p) => ({ ...p, boundVariables: p.bvColor ? { color: alias(p.bvColor) } : {} }));
      return [s.id, o];
    }),
  );
  const lib = fx.library;
  const figma = {
    mixed: MIXED,
    skipInvisibleInstanceChildren: false,
    root: { name: opts.library ? lib.name : fx.file.name },
    async getNodeByIdAsync(id) {
      calls.push(["getNodeByIdAsync", id]);
      return pages.get(id) || null;
    },
    async getStyleByIdAsync(id) {
      calls.push(["getStyleByIdAsync", id]);
      return styles.get(id) || null;
    },
    variables: {
      async getVariableByIdAsync(id) {
        calls.push(["getVariableByIdAsync", id]);
        return vars.get(id) || null;
      },
      async getVariableCollectionByIdAsync(id) {
        return cols.get(id) || null;
      },
      async getLocalVariableCollectionsAsync() {
        return lib.collections.map((c) => ({ name: c.name, key: c.key, remote: false, modes: c.modes.map((name, i) => ({ modeId: `m${i}`, name })), variableIds: new Array(c.count).fill("x") }));
      },
      async getLocalVariablesAsync() {
        return lib.variableKeys.map((key, i) => ({ key, name: `v${i}` }));
      },
    },
    async getLocalTextStylesAsync() {
      return lib.styleKeys.text.map((key) => ({ key }));
    },
    async getLocalEffectStylesAsync() {
      return lib.styleKeys.effect.map((key) => ({ key }));
    },
    async getLocalPaintStylesAsync() {
      return lib.styleKeys.paint.map((key) => ({ key }));
    },
  };
  return { figma, calls };
}

/**
 * The library file, as the library read sees it: local collections, variables and styles with values. Every object
 * throws on a property it does not have, as use_figma does. opts: noGrid (the API lacks getLocalGridStylesAsync),
 * hang (the id of an item whose publish status never resolves), breakStyle (a text style whose fontName read throws),
 * extraVar (the library gained a variable), noStylePub (a style's getPublishStatusAsync is not a function, as live).
 */
export function mockLibrary(lx, opts = {}) {
  const calls = [];
  // `then` is exempt: awaiting a returned object probes it, and the real API objects are awaited all the time.
  const strict = (obj, label) =>
    new Proxy(obj, {
      get(t, k) {
        if (typeof k === "symbol" || k in t) return t[k];
        if (k === "then") return undefined;
        throw new TypeError(`${label}.${String(k)}: no such property '${String(k)}' on ${t.type || label}`);
      },
    });
  const alias = (id) => ({ type: "VARIABLE_ALIAS", id });
  const status = (x) => async () => {
    calls.push(["getPublishStatusAsync", x.id]);
    if (opts.hang === x.id) return new Promise(() => {});
    return x.status || "CURRENT";
  };
  // renameVar: [id, newName], the library renamed a variable (a rename keeps its key).
  const vars = lx.variables.map((v) => (opts.renameVar && v.id === opts.renameVar[0] ? { ...v, name: opts.renameVar[1] } : v));
  if (opts.extraVar) vars.push({ id: "VariableID:1:99", key: "ababababab990000000000000000000000000099", name: "s-99", col: "VariableCollectionId:1:0", type: "FLOAT", scopes: [], values: { m1: 396 } });
  const cols = lx.collections.map((c) =>
    strict({ id: c.id, name: c.name, key: c.key, remote: false, hiddenFromPublishing: false, isExtension: false, defaultModeId: c.modes[0][0], modes: c.modes.map(([modeId, name]) => ({ modeId, name })), variableIds: vars.filter((v) => v.col === c.id).map((v) => v.id) }, "collection"),
  );
  const V = vars.map((v) => {
    const valuesByMode = {};
    for (const [m, val] of Object.entries(v.values)) valuesByMode[m] = val && typeof val === "object" && val.alias ? alias(val.alias) : val;
    return strict({ id: v.id, key: v.key, name: v.name, description: "", remote: false, hiddenFromPublishing: !!v.hidden, resolvedType: v.type, scopes: v.scopes, variableCollectionId: v.col, valuesByMode, codeSyntax: v.web ? { WEB: v.web } : {}, getPublishStatusAsync: status(v) }, "variable");
  });
  const withColorBinding = ({ bvColor, ...x }) => (bvColor ? { ...x, boundVariables: { color: alias(bvColor) } } : x);
  const styleOf = (s) => {
    const o = { id: s.id, key: s.key, name: s.name, type: s.type, remote: false, description: "", getPublishStatusAsync: opts.noStylePub ? undefined : status(s) };
    if (s.type === "TEXT") {
      Object.assign(o, { fontName: s.fontName, fontSize: s.fontSize, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textCase: s.textCase, textDecoration: s.textDecoration });
      if (s.bv) o.boundVariables = Object.fromEntries(Object.entries(s.bv).map(([f, id]) => [f, alias(id)]));
      if (opts.breakStyle === s.name) delete o.fontName;
    }
    if (s.type === "EFFECT") o.effects = s.effects.map(withColorBinding);
    if (s.type === "PAINT") o.paints = s.paints.map(withColorBinding);
    if (s.type === "GRID") o.layoutGrids = s.layoutGrids.map((g) => (g.count === "Infinity" ? { ...g, count: Infinity } : g));
    return strict(o, "style");
  };
  const byType = (t) => lx.styles.filter((s) => s.type === t).map(styleOf);
  const g = {
    root: { name: "Document" },
    variables: strict(
      {
        async getLocalVariableCollectionsAsync() {
          return cols;
        },
        async getLocalVariablesAsync() {
          return V;
        },
        async getVariableByIdAsync(id) {
          calls.push(["getVariableByIdAsync", id]);
          const x = (lx.external || []).find((e) => e.id === id);
          return x ? strict({ id: x.id, key: x.key, name: x.name, remote: true }, "variable") : null;
        },
      },
      "figma.variables",
    ),
    async getLocalTextStylesAsync() {
      return byType("TEXT");
    },
    async getLocalPaintStylesAsync() {
      return byType("PAINT");
    },
    async getLocalEffectStylesAsync() {
      return byType("EFFECT");
    },
    async getLocalGridStylesAsync() {
      return byType("GRID");
    },
  };
  if (opts.noGrid) delete g.getLocalGridStylesAsync;
  return { figma: strict(g, "figma"), calls };
}

// ------------------------------------------------------------------ harness

const results = [];
function check(name, cond, detail = "") {
  results.push({ name, ok: !!cond, detail });
}
function throws(fn) {
  try {
    fn();
    return null;
  } catch (e) {
    return e;
  }
}
function tmpStore() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "figma-tokens-"));
  return { dir, p: paths(dir) };
}
const readJ = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

async function exportOnce(fx, p, extra = {}) {
  const st = load(p);
  const src = exportScript({ file: fx.file.key, pages: fx.file.pages.map((x) => x.id), known: knownKeys(st), budget: 60000, ...extra });
  const { figma, calls } = mockFigma(fx);
  const r = await runScript(src, figma);
  return { src, r, calls, figma };
}

function ingestText(p, text) {
  const r = parseResult(text, EXPORT_KIND);
  if (!ledgerHas(p, r.sum)) appendLedger(p, { file: r.h.file, frames: r.h.frames, nonce: r.sum });
  const st = load(p);
  const at = "2026-09-24T00:00:00.000Z";
  const res = ingestExport(st, r, at);
  const out = save(p, st, at);
  return { res, out };
}

export async function selfTest() {
  const fx = readJ(path.join(FIX, "tokens-mock.json"));

  // 1. The export script runs as use_figma would run it, reads only, and checks out.
  {
    const { p } = tmpStore();
    const { src, r, calls, figma } = await exportOnce(fx, p);
    check("export script stays under the script cap", Buffer.byteLength(src) < SCRIPT_CAP, `${Buffer.byteLength(src)} bytes`);
    check("export result carries a valid checksum", r.sum === fnv1a32(JSON.stringify(r.d)));
    check("result round-trips through JSON under the result cap", JSON.stringify(r).length < 18000);
    check("every page is loaded with loadAsync before its children are read", calls.filter((c) => c[0] === "loadAsync").length === 2);
    check("skipInvisibleInstanceChildren is switched on", figma.skipInvisibleInstanceChildren === true);
    check("a mixed-style text node is read segment by segment", calls.some((c) => c[0] === "segments" && c[1] === "10:4"));
    check("walk is complete with no resume cursor", r.h.next === null && r.h.frames === 4, JSON.stringify(r.h.pages));
    check("unresolvable alias target is reported, not invented", r.d.miss.includes("VariableID:dead00000000000000000000000000000000beef/9:9"), JSON.stringify(r.d.miss));

    const { out } = ingestText(p, JSON.stringify(r));
    const vj = readJ(p.variables);
    const V = vj.variables;
    check("variables.json has v and syncedAt", vj.v === 1 && vj.syncedAt === "2026-09-24T00:00:00.000Z");
    check("a name shared by two collections is keyed <collection>/<name>", V["Primatives/s-4"] && V["Legacy/s-4"] && !V["s-4"], Object.keys(V).join(" | "));
    check("an unshared name is keyed by the bare name", !!V["border-radius/rounded-lg"]);
    check("FLOAT value keeps its number under the mode NAME", V["Primatives/s-4"] && V["Primatives/s-4"].modes["Mode 1"] === 16);
    check("COLOR value is #RRGGBB", V["Primary/Green Coal 100"] && V["Primary/Green Coal 100"].modes.Dark === "#123F3C", JSON.stringify(V["Primary/Green Coal 100"]));
    check("COLOR below full alpha is #RRGGBBAA", V["Base/Coal half"] && V["Base/Coal half"].modes.Dark === "#123F3C80", JSON.stringify(V["Base/Coal half"]));
    check("an alias is {alias: <name>}", V["Primary/Green Coal 100"] && V["Primary/Green Coal 100"].modes.Light && V["Primary/Green Coal 100"].modes.Light.alias === "Base/Coal half");
    check("alias targets reached only through an alias are still exported", !!V["Base/Coal half"]);
    check("an alias to a missing variable stays marked unresolved", V["Border/Dangling"] && String(V["Border/Dangling"].modes["Mode 1"].alias).startsWith("?VariableID:dead"), JSON.stringify(V["Border/Dangling"]));
    check("id is restored in full from the compressed form", V["border-radius/rounded-lg"].id === "VariableID:bbbbbbbbbbbb0000000000000000000000000002/1:2");
    check("key, collection, remote, scopes are kept", V["border-radius/rounded-lg"].key === "bbbbbbbbbbbb0000000000000000000000000002" && V["border-radius/rounded-lg"].collection === "Primatives" && V["border-radius/rounded-lg"].remote === true && V["border-radius/rounded-lg"].scopes[0] === "CORNER_RADIUS");
    check("code syntax is kept when the library sets it", V["Primatives/s-4"].codeSyntax && V["Primatives/s-4"].codeSyntax.WEB === "var(--s-4)");
    check("collections record key, remote, mode names and the file seen in", vj.collections.Colors && vj.collections.Colors.key === "c0220000000000000000000000000000000000c2" && vj.collections.Colors.modes.join() === "Dark,Light" && vj.collections.Colors.seenIn[0] === fx.file.key);

    const T = readJ(p.text);
    const t = T["Lg/Paragraph 2 300"];
    check("text style is {ff, fs, fw, lh, ls, tc, td, key, remote}", t && t.ff === "Manrope" && t.fs === 14 && t.fw === 600 && t.lh === 18 && t.ls === "-4%" && t.tc === "ORIGINAL" && t.td === "NONE" && t.key === "dddddddddddd0000000000000000000000000101" && t.remote === true, JSON.stringify(t));
    check("AUTO line height is 'auto'", T["Lg/Number 1 700"] && T["Lg/Number 1 700"].lh === "auto" && T["Lg/Number 1 700"].fw === 700);
    check("a style reached only through a text segment is exported", !!T["Lg/Number 1 700"]);
    check("a variable bound on a text style is named", T["Lg/Number 1 700"].bv && T["Lg/Number 1 700"].bv.fontSize === "Primatives/s-4", JSON.stringify(T["Lg/Number 1 700"]));

    const E = readJ(p.effect);
    const e = E["Shadow/Card"];
    check("effect style keeps visible effects in SCHEMA Effect form", e && e.effects.length === 2 && e.effects[0].t === "DROP_SHADOW" && e.effects[0].c === "#000000@0.25" && e.effects[0].o.join() === "0,4" && e.effects[0].r === 12 && e.effects[1].t === "BACKGROUND_BLUR" && e.effects[1].r === 24, JSON.stringify(e));

    const PS = readJ(p.paint);
    const ps = PS["Fill/Brand half"];
    check("paint style drops hidden paints and names the bound variable with its opacity", ps && ps.paints.length === 1 && ps.paints[0] === "Primary/Green Coal 100@0.5", JSON.stringify(ps));
    check("nothing is left unresolved except the missing alias", out.unresolved.length === 0, out.unresolved.join(" "));

    const src2 = readJ(p.sources);
    const run = src2.runs[fx.file.key];
    const U = run && run.usesInWalkedFrames;
    check("sources.json records the run as complete with its use counts (a GROUP's effect style included)", run && run.complete === true && run.frames === 4 && U["aaaaaaaaaaaa0000000000000000000000000001"] === 2 && U["eeeeeeeeeeee0000000000000000000000000102"] === 2, JSON.stringify(U));
    // Fill/Brand half is on a RECTANGLE's fillStyleId (10:2) and on one text segment (10:4): both must count.
    check("a paint style on a shape's fill is collected, not only one on text", U["ffffffffffff0000000000000000000000000103"] === 2, String(U["ffffffffffff0000000000000000000000000103"]));
    check("coverage counts every top-level frame on every planned page", run.coverage.framesWalked === 4 && run.coverage.framesOnReachedPages === 4 && run.coverage.pagesPlanned === 2, JSON.stringify(run.coverage));
    check("the run is named from the file map, not root.name", run.fileName === "Skai-Web-App-2");
    check("a ledger line was appended for the call", callsToday(p) === 1 && callsToday(p, "1999-01-01") === 0);

    // resolveValue follows the alias chain.
    const st = load(p);
    const gc = [...st.vars.values()].find((x) => x.name === "Primary/Green Coal 100");
    check("resolveValue follows an alias to its concrete value", resolveValue(st, gc, "Light") === "#FFFFFF");
    check("weightOf maps font styles to weights", weightOf("Semi Bold") === 600 && weightOf("ExtraBold") === 800 && weightOf("Bold") === 700 && weightOf("Light") === 300 && weightOf("Extra Light") === 200 && weightOf("Regular") === 400 && weightOf("Bold Italic") === "700 italic");

    // 2. A second file: known definitions are skipped and only their use counts come back.
    const second = await exportOnce(fx, p);
    check("a re-export skips every stored library definition", second.r.d.v.length === 0 && second.r.d.ts.length === 0 && second.r.d.es.length === 0 && second.r.d.ps.length === 0, JSON.stringify(second.r.d).slice(0, 300));
    // Base/Coal half is reached only through Green Coal 100's alias, and a stored variable's aliases are not
    // followed again, so 9 of the 10 stored tokens are seen on nodes.
    check("…and still reports their use counts", second.r.d.uk.length === 9, String(second.r.d.uk.length));
    const resolves = second.calls.filter((c) => c[0] === "getStyleByIdAsync" || c[0] === "getVariableByIdAsync").map((c) => c[1]);
    check("a stored key is recognised from the id without a resolve call", resolves.length === 0, resolves.join(" "));
    const before = fs.readFileSync(p.variables, "utf8");
    ingestText(p, JSON.stringify(second.r));
    check("ingesting skipped definitions leaves variables.json byte-identical apart from syncedAt", fs.readFileSync(p.variables, "utf8") === before);
    const lines = () => fs.readFileSync(p.ledger, "utf8").trim().split("\n").length;
    const n0 = lines();
    ingestText(p, JSON.stringify(second.r));
    check("re-ingesting the same result is recognised in the ledger by its checksum", ledgerHas(p, second.r.sum) && lines() === n0, `${n0} -> ${lines()}`);

    // 3. Checksum refusal: one changed character in the saved copy.
    const tampered = JSON.stringify(r).replace('"#123F3C"', '"#123F3D"');
    check("the fixture tamper actually changed the text", tampered !== JSON.stringify(r));
    const err = throws(() => parseResult(tampered, EXPORT_KIND));
    check("a copy whose payload does not match its checksum is refused", err && /checksum mismatch/.test(err.message), err && err.message);
    check("a result of the wrong kind is refused", !!throws(() => parseResult(JSON.stringify(r), PROVENANCE_KIND)));
    // A refused copy is still a spent call: ledgered once with ok:false, and a second ingest of it counts 0.
    const { parseOrLedger } = await import("../tokens.mjs");
    const bad = path.join(path.dirname(p.ledger), "..", "bad.json");
    // A result never ingested before (a different stride), damaged in its copy.
    const fresh = (await exportOnce(fx, p, { stride: 3 })).r;
    const damaged = JSON.stringify(fresh).replace('"uk":[', '"uk":[["000000000000",1],');
    check("the damaged copy differs from the result", damaged !== JSON.stringify(fresh));
    fs.writeFileSync(bad, damaged);
    const before2 = callsToday(p);
    throws(() => parseOrLedger(p, bad, EXPORT_KIND));
    const mid = callsToday(p);
    throws(() => parseOrLedger(p, bad, EXPORT_KIND));
    check("a refused result still counts its call, once", mid === before2 + 1 && callsToday(p) === mid, `${before2} -> ${mid} -> ${callsToday(p)}`);
  }

  // 4. Truncation: a tiny cap returns part now and the rest on the next call.
  {
    const full = tmpStore();
    const a = await exportOnce(fx, full.p);
    ingestText(full.p, JSON.stringify(a.r));
    const part = tmpStore();
    const first = await exportOnce(fx, part.p, { cap: 1500 });
    check("a small cap truncates and says so", first.r.d.trunc > 0, `trunc=${first.r.d.trunc}`);
    check("a truncated result stays under the cap", JSON.stringify(first.r).length <= 1500, String(JSON.stringify(first.r).length));
    ingestText(part.p, JSON.stringify(first.r));
    let guard = 0;
    for (;;) {
      const again = await exportOnce(fx, part.p, { cap: 1500 });
      ingestText(part.p, JSON.stringify(again.r));
      if (!again.r.d.trunc || ++guard > 10) break;
    }
    const strip = (f) => JSON.stringify(readJ(f), (k, v) => (k === "usesByKey" || k === "calls" || k === "frames" || k === "nodes" || k === "ms" || k === "pages" || k === "truncated" ? undefined : v));
    check("truncated calls converge on the same variables.json", fs.readFileSync(part.p.variables, "utf8") === fs.readFileSync(full.p.variables, "utf8"));
    check("…and the same text/effect/paint styles", ["text", "effect", "paint"].every((k) => fs.readFileSync(part.p[k], "utf8") === fs.readFileSync(full.p[k], "utf8")));
    check("truncation loop converged", guard <= 10);
    void strip;
  }

  // 5. The time budget stops the walk with a resume cursor, and the continuation finishes it.
  {
    const { p } = tmpStore();
    const realNow = Date.now;
    let clock = 0;
    Date.now = () => (clock += 10);
    let r1;
    try {
      // With 10 ms per clock read, a 25 ms budget stops the walk inside page A.
      r1 = (await exportOnce(fx, p, { budget: 25 })).r;
    } finally {
      Date.now = realNow;
    }
    check("a spent time budget returns a resume cursor", Array.isArray(r1.h.next) && r1.h.frames < 4, JSON.stringify(r1.h));
    ingestText(p, JSON.stringify(r1));
    const st = load(p);
    const open = openPass(st, fx.file.key);
    check("sources.json marks the run incomplete with an open pass at the cursor", st.sources.runs[fx.file.key].complete === false && open && JSON.stringify(open.next) === JSON.stringify(r1.h.next));
    const r2 = (await exportOnce(fx, p, { from: r1.h.next })).r;
    check("the continuation starts at the cursor and finishes", r2.h.next === null && r1.h.frames + r2.h.frames === 4, `${r1.h.frames}+${r2.h.frames}`);
    ingestText(p, JSON.stringify(r2));
    const run = load(p).sources.runs[fx.file.key];
    check("the continued run is complete and counts every frame once", run.complete === true && run.frames === 4 && run.calls === 2 && run.passes.length === 1 && !openPass(load(p), fx.file.key), JSON.stringify(run));
  }

  // 6. Budget: refuse past the cap, honour FIGMA_DAILY_BUDGET.
  {
    const { p } = tmpStore();
    const prev = process.env.FIGMA_DAILY_BUDGET;
    try {
      process.env.FIGMA_DAILY_BUDGET = "3";
      for (let i = 0; i < 3; i++) appendLedger(p, { file: "x" });
      const e = throws(() => assertBudget(p));
      check("a script is refused once today's calls reach the budget", e && /0 left/.test(e.message), e && e.message);
      process.env.FIGMA_DAILY_BUDGET = "4";
      check("the budget comes from FIGMA_DAILY_BUDGET", assertBudget(p).left === 1);
      fs.appendFileSync(p.ledger, "{torn\n");
      check("a torn ledger line still counts as a call", callsToday(p) === 4);
    } finally {
      if (prev === undefined) delete process.env.FIGMA_DAILY_BUDGET;
      else process.env.FIGMA_DAILY_BUDGET = prev;
    }
  }

  // 7. Provenance: the library file's own key prefixes, matched offline against every stored token.
  {
    const { p } = tmpStore();
    const a = await exportOnce(fx, p);
    ingestText(p, JSON.stringify(a.r));
    const { figma } = mockFigma(fx, { library: true });
    const r = await runScript(provenanceScript({ file: "TyX8YAtNDEIvsnSLQ3IXId" }), figma);
    const pr = parseResult(JSON.stringify(r), PROVENANCE_KIND);
    check("provenance returns the library's collections and packed key prefixes", pr.d.cols.length === 2 && pr.d.lib.w === 12 && pr.d.lib.v.length === 48 && pr.d.cut === 0, JSON.stringify(pr.d.lib));
    const st = load(p);
    const lib = ingestProvenance(st, pr, "2026-09-24T00:00:00.000Z");
    save(p, st, "2026-09-24T00:00:00.000Z");
    const m = Object.fromEntries(lib.match.map((x) => [x.kind, x]));
    check("variables: 4 of 6 are the library's, and the two that are not are named", m.variables.inLibrary === 4 && m.variables.notInLibrary.join() === "Border/Dangling,Legacy/s-4", JSON.stringify(m.variables));
    check("styles: text 2/2, effect 1/1, paint 0/1", m["text styles"].inLibrary === 2 && m["effect styles"].inLibrary === 1 && m["paint styles"].inLibrary === 0);
    const vj = readJ(p.variables);
    check("a matched collection records the library file", vj.collections.Colors.library && vj.collections.Colors.library.file === "TyX8YAtNDEIvsnSLQ3IXId");
    check("an unmatched collection says it is NOT in that file", vj.collections.Legacy.library && vj.collections.Legacy.library.file === null);
    check("sources.json names the library file and says root.name is not the file name", readJ(p.sources).library.fileName === "Skai-Design" && /Document/.test(readJ(p.sources).library.note) && lib.collectionsMatched === 2);
    // A token stored AFTER the check is judged too (the check runs on every save).
    st.vars.set("c0ffee000000000000000000000000000000beef", { name: "Late/Token", collection: "Colors", type: "COLOR", modes: { Dark: "#000000" }, remote: true, scopes: [] });
    save(p, st, "2026-09-24T00:00:00.000Z");
    check("a token stored after the library check is still judged", readJ(p.sources).library.match[0].notInLibrary.includes("Late/Token"));
    // A small cap falls back to 8-character prefixes.
    const r8 = await runScript(provenanceScript({ file: "k", cap: 100 }), mockFigma(fx, { library: true }).figma);
    check("a large library falls back to 8-character prefixes", r8.d.lib.w === 8, JSON.stringify(r8.d.lib));
  }

  // 7b. Stride: every Nth top-level frame, never reported complete from a sample.
  {
    const { p } = tmpStore();
    const s0 = (await exportOnce(fx, p, { stride: 2, offset: 0 })).r;
    check("stride 2 offset 0 walks frames 0 and 2 of page A and frame 0 of page B", s0.h.frames === 3 && JSON.stringify(s0.h.pages) === JSON.stringify([["1:1", 2, 3, 0], ["2:1", 1, 1, 0]]), JSON.stringify(s0.h.pages));
    ingestText(p, JSON.stringify(s0));
    const run = load(p).sources.runs[fx.file.key];
    check("a sampled walk is not complete", run.complete === false && run.coverage.framesWalked === 3 && run.coverage.framesOnReachedPages === 4, JSON.stringify(run.coverage));
    const s1 = (await exportOnce(fx, p, { stride: 2, offset: 1 })).r;
    ingestText(p, JSON.stringify(s1));
    const run2 = load(p).sources.runs[fx.file.key];
    check("the other offset completes the coverage", run2.complete === true && run2.passes.length === 2 && run2.coverage.framesWalked === 4, JSON.stringify(run2.coverage));
  }

  // 7c. A record written before passes existed is migrated, not dropped.
  {
    const { p } = tmpStore();
    const a = (await exportOnce(fx, p)).r;
    ingestText(p, JSON.stringify(a));
    const src = readJ(p.sources);
    src.runs[fx.file.key] = { fileName: "Document", calls: 1, frames: 2, nodes: 5, ms: 1, pages: { "1:1": { walked: 2, children: 3 } }, next: [0, 2], complete: false, usesByKey: { aaaaaaaaaaaa0000000000000000000000000001: 7 } };
    fs.writeFileSync(p.sources, JSON.stringify(src));
    const st = load(p);
    const open = openPass(st, fx.file.key);
    check("an old record's cursor is found as an open pass", open && JSON.stringify(open.next) === "[0,2]", JSON.stringify(open));
    const c = (await exportOnce(fx, p, { from: [0, 2] })).r;
    ingestText(p, JSON.stringify(c));
    const run = load(p).sources.runs[fx.file.key];
    check("the migrated record keeps its earlier use counts and finishes", run.usesInWalkedFrames["aaaaaaaaaaaa0000000000000000000000000001"] >= 7 && run.complete === true && run.calls === 2 && !run.usesByKey, JSON.stringify(run));
  }

  // 10. The library read: the library file's own definitions, complete, merged over what the walk stored.
  {
    const lx = readJ(path.join(FIX, "tokens-library-mock.json"));
    const AT = "2026-09-24T01:00:00.000Z";
    // A store as the walk and the provenance call left it.
    const walkStore = async () => {
      const { p } = tmpStore();
      ingestText(p, JSON.stringify((await exportOnce(fx, p)).r));
      const st = load(p);
      ingestProvenance(st, parseResult(JSON.stringify(await runScript(provenanceScript({ file: lx.file }), mockFigma(fx, { library: true }).figma)), PROVENANCE_KIND), AT);
      save(p, st, AT);
      return p;
    };
    const libRun = async (extra = {}, opts = {}, lib = lx) => {
      const src = libraryScript({ file: lx.file, ...extra });
      const { figma, calls } = mockLibrary(lib, opts);
      return { src, r: await runScript(src, figma), calls };
    };
    const ingestLib = (p, text) => {
      const r = parseResult(text, LIBRARY_KIND);
      if (!ledgerHas(p, r.sum)) appendLedger(p, { file: r.h.file, frames: 0, nonce: r.sum });
      const st = load(p);
      const res = ingestLibrary(st, r, AT);
      if (!res.already) save(p, st, AT);
      return res;
    };

    const p = await walkStore();
    const one = await libRun();
    check("library: the script stays under the script cap", Buffer.byteLength(one.src) < SCRIPT_CAP, `${Buffer.byteLength(one.src)} bytes`);
    check("library: one result carries every row, with a valid checksum, under the result cap", one.r.d.m.next === null && one.r.d.m.n === one.r.d.m.total && one.r.sum === fnv1a32(JSON.stringify(one.r.d)) && JSON.stringify(one.r).length < 18000, JSON.stringify(one.r.d.m));
    check("library: the counts are the library's own lists", JSON.stringify(one.r.d.m.counts) === JSON.stringify({ cols: 2, v: 9, ts: 3, ps: 3, es: 2, gs: 1 }), JSON.stringify(one.r.d.m.counts));
    const callsBefore = callsToday(p);
    const res = ingestLib(p, JSON.stringify(one.r));
    const V = readJ(p.variables).variables;
    const ex = readJ(p.sources).export;
    check("library: a whole read is marked complete, with the library file as its source", ex.complete === true && ex.source === lx.file && ex.sourceName === "Skai-Design" && ex.why.length === 0, JSON.stringify(ex.why));
    check("library: variables.json carries the export marker", readJ(p.variables).export && readJ(p.variables).export.complete === true && readJ(p.variables).export.source === lx.file);
    check("library: the part's call is ledgered once", callsToday(p) === callsBefore + 1);
    check("library: every library variable is stored, and the walk's own are kept", Object.keys(V).length === 11 && !!V["s-6"] && !!V["Brand/Accent"] && !!V["Legacy/s-4"], Object.keys(V).join(" | "));
    check("library: values follow the collection's mode order, not valuesByMode's key order", V["Primary/Green Coal 100"].modes.Dark === "#123F3C" && V["Primary/Green Coal 100"].modes.Light.alias === "Base/Coal half", JSON.stringify(V["Primary/Green Coal 100"].modes));
    check("library: an alias to a variable in another collection is written as its name", V["Brand/Accent"].modes.Dark.alias === "Primary/Green Coal 100", JSON.stringify(V["Brand/Accent"].modes));
    const st1 = load(p);
    check("library: an alias chain resolves to the concrete value", resolveValue(st1, [...st1.vars.values()].find((x) => x.name === "Brand/Accent"), "Dark") === "#123F3C");
    check("library: a BOOLEAN false is kept as false", V["flags/dense"].modes["Mode 1"] === false && V["flags/dense"].type === "BOOLEAN", JSON.stringify(V["flags/dense"]));
    check("library: a hidden, unpublished variable says so", V["internal/scratch"].hiddenFromPublishing === true && V["internal/scratch"].publish === "UNPUBLISHED" && V["internal/scratch"].modes["Mode 1"] === "x");
    check("library: an alias to a variable outside the library stays marked, and its name is recorded", String(V["Border/External"].modes["Mode 1"].alias).startsWith("?VariableID:abcdef") && ex.externalAliases.some((x) => x[1] === "Other/Ink"), JSON.stringify(ex.externalAliases));
    // Ids are per file. The walk's product-file id stays; a library-only variable gets the library's own id; no id
    // is ever built from a key and another file's number (none of the 26 such ids would exist anywhere).
    check("library: a variable the walk saw keeps its product-file id", V["Primatives/s-4"].id === "VariableID:aaaaaaaaaaaa0000000000000000000000000001/1:1" && V["border-radius/rounded-lg"].id === "VariableID:bbbbbbbbbbbb0000000000000000000000000002/1:2", V["Primatives/s-4"].id);
    check("library: a variable only the library has gets the library's own id, not a built one", V["s-6"].id === "VariableID:7:5" && V["flags/dense"].id === "VariableID:7:8", V["s-6"].id);
    check("library: the library's value is written over the walk's, and marked CHANGED", V["border-radius/rounded-lg"].modes["Mode 1"] === 10 && V["border-radius/rounded-lg"].publish === "CHANGED");
    check("library: the one real difference is recorded, and nothing else (ids, markers, aliases compare equal)", ex.changes.length === 1 && ex.changes[0].name === "border-radius/rounded-lg" && ex.changes[0].field === "modes" && /8/.test(ex.changes[0].was) && /10/.test(ex.changes[0].now), JSON.stringify(ex.changes));
    check("library: the 6 stored tokens the library holds unchanged compare identical", ex.same === 6, String(ex.same));
    const PS = readJ(p.paint);
    const T = readJ(p.text);
    const E = readJ(p.effect);
    const walkFill = PS["Fill/Brand half #ffffff"];
    check("library: what the walk found and the library lacks is kept and flagged notInLibrary", V["Legacy/s-4"].notInLibrary === true && V["Border/Dangling"].notInLibrary === true && walkFill && walkFill.notInLibrary === true, Object.keys(PS).join(" | "));
    check("library: a library token carries no notInLibrary", !("notInLibrary" in V["Primatives/s-4"]) && !("notInLibrary" in V["s-6"]) && !("notInLibrary" in T["Lg/Paragraph 2 300"]) && PS["Fill/Brand half #f4f4f4"] && !("notInLibrary" in PS["Fill/Brand half #f4f4f4"]));
    check("library: a name the walk's style and a library style share keys both by name and key prefix", !PS["Fill/Brand half"] && PS["Fill/Brand half #f4f4f4"].paints[0] === "#FFFFFF@0.5", Object.keys(PS).join(" | "));
    // load() must recover the names a collision re-keyed, or the next save emits one holder under the bare name.
    const tf = () => ["variables", "text", "effect", "paint", "grid"].map((k) => fs.readFileSync(p[k], "utf8")).join("\n");
    const tf0 = tf();
    const stR = load(p);
    save(p, stR, AT);
    check("library: a load and save of the result writes the same token files (collision keys survive)", tf() === tf0);
    const cols = readJ(p.variables).collections;
    check("library: a collection's variable count is the library's, not the walk's partial count", cols.Primatives.variables === 6 && cols.Colors.variables === 3 && cols.Primatives.seenIn[0] === fx.file.key, JSON.stringify(cols.Primatives));
    check("library: a collection the library lacks stays marked NOT in it", cols.Legacy.library && cols.Legacy.library.file === null);
    check("library: a new text style is stored with its weight number", T["Lg/Label 1 300"] && T["Lg/Label 1 300"].fw === 400 && T["Lg/Label 1 300"].ls === "-4%", JSON.stringify(T["Lg/Label 1 300"]));
    check("library: a variable bound on a text style resolves to its (collision-keyed) name", T["Lg/Number 1 700"].bv.fontSize === "Primatives/s-4", JSON.stringify(T["Lg/Number 1 700"]));
    check("library: an effect colour bound to a variable is named, spread kept, unpublished marked", E.Glow && E.Glow.effects[0].c === "Brand/Accent" && E.Glow.effects[0].sp === 2 && E.Glow.publish === "UNPUBLISHED", JSON.stringify(E.Glow));
    check("library: a gradient paint style keeps its stops and angle", PS["Brand/Gradient"] && PS["Brand/Gradient"].paints[0].grad === "LINEAR" && PS["Brand/Gradient"].paints[0].stops[1][1] === "#17F9B4" && PS["Brand/Gradient"].paints[0].angle === 0, JSON.stringify(PS["Brand/Gradient"]));
    check("library: a paint bound to a variable is written as the variable's name", PS["Surface/Bound"] && PS["Surface/Bound"].paints[0] === "Primary/Green Coal 100", JSON.stringify(PS["Surface/Bound"]));
    const G = fs.existsSync(p.grid) ? readJ(p.grid) : {};
    const g0 = G["Grid/12 col"];
    check("library: grid styles are stored, a hidden grid dropped, an Infinity count written 'auto'", g0 && g0.grids.length === 2 && g0.grids[0].pattern === "COLUMNS" && g0.grids[0].count === 12 && g0.grids[0].gutterSize === 24 && g0.grids[0].offset === 80 && g0.grids[0].c === "#FF0000@0.1" && g0.grids[1].count === "auto", JSON.stringify(g0));
    const lib = readJ(p.sources).library;
    const lm = Object.fromEntries(lib.match.map((x) => [x.kind, x]));
    check("library: the match comes from the full read (variables 9/11, grid 1/1)", lm.variables.inLibrary === 9 && lm.variables.notInLibrary.join() === "Border/Dangling,Legacy/s-4" && lm["grid styles"] && lm["grid styles"].inLibrary === 1 && lib.localCounts.grid === 1, JSON.stringify(lm.variables));
    check("library: the earlier provenance key list is compared (the fixture's had 4 variable keys)", ex.provenanceCheck && /differs \(4 then, 9 now\)/.test(ex.provenanceCheck.v), JSON.stringify(ex.provenanceCheck));
    check("library: every publish status was read", ex.publish.complete === true && ex.publish.of === 18, JSON.stringify(ex.publish));
    const bytes = () => ["variables", "text", "effect", "paint", "grid", "sources"].map((k) => fs.readFileSync(p[k], "utf8")).join("\n");
    const b0 = bytes();
    const lines0 = fs.readFileSync(p.ledger, "utf8");
    const again = ingestLib(p, JSON.stringify(one.r));
    check("library: re-ingesting the same part changes nothing and counts no call", again.already === true && bytes() === b0 && fs.readFileSync(p.ledger, "utf8") === lines0);
    void res;

    // notInLibrary is a claim about the library's WHOLE list: from a cut list it is not made at all.
    const stCut = load(p);
    stCut.sources.library.keysCut = 1;
    save(p, stCut, AT);
    const cutFlags = ["variables", "text", "effect", "paint", "grid"].flatMap((k) => Object.values(readJ(p[k])).filter((e) => e && e.notInLibrary));
    check("library: with a cut key list no token is flagged notInLibrary", cutFlags.length === 0, String(cutFlags.length));
    const stBack = load(p);
    stBack.sources.library.keysCut = 0;
    save(p, stBack, AT);
    check("library: with the whole list the flags come back", readJ(p.variables).variables["Legacy/s-4"].notInLibrary === true);

    // A cap smaller than one row still moves the cursor on: every part carries at least one row.
    const tiny = (await libRun({ cap: 200, from: 3, read: "0123456789ab" })).r;
    check("library: a cap below one row still carries one row and advances the cursor", tiny.d.m.n === 1 && tiny.d.m.next === 4, JSON.stringify(tiny.d.m));

    // The CLI path: library-ingest ledgers the call before it writes the store, and a second run counts nothing.
    {
      const { main } = await import("../tokens.mjs");
      const cliRoot = path.dirname(path.dirname((await walkStore()).variables));
      const cp = paths(cliRoot);
      const file = path.join(cliRoot, "part.json");
      fs.writeFileSync(file, JSON.stringify(one.r));
      const quiet = async (argv) => {
        const [log, err] = [console.log, console.error];
        console.log = console.error = () => {};
        try {
          return await main(argv, cliRoot, path.join(HERE, "..", "..", "figma-catalog"));
        } finally {
          console.log = log;
          console.error = err;
        }
      };
      const c0 = callsToday(cp);
      const code = await quiet(["library-ingest", file]);
      const c1 = callsToday(cp);
      await quiet(["library-ingest", file]);
      check("library: the CLI ingest ledgers one call and completes the store", code === 0 && c1 === c0 + 1 && callsToday(cp) === c1 && readJ(cp.sources).export.complete === true, `${c0} -> ${c1} -> ${callsToday(cp)}`);
    }

    // Split: a small cap spreads the read over parts that continue each other and converge on the one-part store.
    const q = await walkStore();
    // Every part of one read: row 0 mints the read id, each continuation is given it.
    const readAll = async (lib = lx, opts = {}, cap = 1700) => {
      const out = [];
      let from = 0;
      let read;
      for (let k = 0; k < 20; k++) {
        const x = await runScript(libraryScript({ file: lx.file, cap, from, read }), mockLibrary(lib, opts).figma);
        out.push(x);
        read = x.d.m.read;
        if (x.d.m.next === null) break;
        from = x.d.m.next;
      }
      return out;
    };
    const parts = await readAll();
    check("library: a small cap splits the read into several parts, each under the cap", parts.length >= 3 && parts.every((x) => JSON.stringify(x).length <= 1700), `${parts.length} parts, ${parts.map((x) => JSON.stringify(x).length).join(",")}`);
    check("library: every part of one read carries its read id and the same stream digest", /^[0-9a-f]{12}$/.test(parts[0].d.m.read) && parts.every((x) => x.d.m.read === parts[0].d.m.read && x.d.m.digest === parts[0].d.m.digest), JSON.stringify(parts.map((x) => [x.d.m.read, x.d.m.digest])));
    check("library: a continuation script needs the id of the read it continues", !!throws(() => libraryScript({ file: lx.file, from: 7 })));
    ingestLib(q, JSON.stringify(parts[0]));
    const ex1 = readJ(q.sources).export;
    check("library: after the first part the read is NOT complete and says where to continue", ex1.complete === false && ex1.next === parts[0].d.m.next && /continue with library-script/.test(ex1.why.join()), JSON.stringify(ex1.why));
    check("library: a partial read makes no library claim yet (no notInLibrary from it)", readJ(q.sources).library.method === undefined);
    const skip = throws(() => ingestLib(q, JSON.stringify(parts[2])));
    check("library: a part that skips one is refused", skip && /does not continue/.test(skip.message), skip && skip.message);
    const changed = (await libRun({ cap: 1700, from: parts[0].d.m.next, read: parts[0].d.m.read }, { extraVar: true })).r;
    const moved = throws(() => ingestLib(q, JSON.stringify(changed)));
    check("library: a part read after the library changed is refused", moved && /does not continue/.test(moved.message), moved && moved.message);
    // A rename between calls keeps the total and the counts, but it moves a row across the cursor: one token would be
    // read twice and another never. The stream digest refuses the part; distinct keys are the second line.
    {
      const rq = await walkStore();
      ingestLib(rq, JSON.stringify(parts[0]));
      const renamed = (await libRun({ cap: 1700, from: parts[0].d.m.next, read: parts[0].d.m.read }, { renameVar: ["VariableID:7:5", "a-6"] })).r;
      check("library: the rename leaves the total and counts as they were (only the stream shows it)", renamed.d.m.total === parts[0].d.m.total && JSON.stringify(renamed.d.m.counts) === JSON.stringify(parts[0].d.m.counts));
      const rn = throws(() => ingestLib(rq, JSON.stringify(renamed)));
      check("library: a part read after a rename between calls is refused by the stream digest", rn && /differs from the one the read in progress started on/.test(rn.message), rn && rn.message);
      // Were a digest ever to match anyway (a collision, a forged copy), completeness still counts distinct keys.
      const rq2 = await walkStore();
      ingestLib(rq2, JSON.stringify(parts[0]));
      let at = parts[0].d.m.next;
      for (let k = 0; at !== null && k < 20; k++) {
        const x = (await libRun({ cap: 1700, from: at, read: parts[0].d.m.read }, { renameVar: ["VariableID:7:5", "a-6"] })).r;
        x.d.m.digest = parts[0].d.m.digest;
        x.sum = fnv1a32(JSON.stringify(x.d));
        ingestLib(rq2, JSON.stringify(x));
        at = x.d.m.next;
      }
      const exr = readJ(rq2.sources).export;
      check("library: a rename between calls that repeats one row and skips another is NOT complete", exr.complete === false && /distinct/.test(exr.why.join()), JSON.stringify(exr.why));
    }
    for (const x of parts.slice(1)) ingestLib(q, JSON.stringify(x));
    const tokenFiles = (pp) => ["variables", "text", "effect", "paint", "grid"].map((k) => fs.readFileSync(pp[k], "utf8")).join("\n");
    check("library: the parts converge on the same token files as the one-part read", tokenFiles(q) === tokenFiles(p));
    check("library: and only then is it complete", readJ(q.sources).export.complete === true);
    // A refresh: the next library read (a new session from row 0) into a store that already holds the library.
    // Names the first read re-keyed (Primatives/s-4, Fill/Brand half #...) must come back re-keyed, not bare.
    const refreshed = tokenFiles(p);
    for (const x of parts) ingestLib(p, JSON.stringify(x));
    check("library: re-reading an unchanged library changes no token file (re-keyed names stay re-keyed)", tokenFiles(p) === refreshed && readJ(p.sources).export.complete === true);

    // An empty collection: 0 variables listed, 0 read, and that meets the count.
    {
      const lxE = structuredClone(lx);
      // (Its own key: c033...c3 is the walk fixture's Legacy, and a key match reads as a rename.)
      lxE.collections.push({ id: "VariableCollectionId:3:0", name: "Empty", key: "c0660000000000000000000000000000000000c6", modes: [["e1", "Mode 1"]] });
      const e1 = await runScript(libraryScript({ file: lx.file }), mockLibrary(lxE).figma);
      const row = e1.d.cols.find((c) => c[0] === "Empty");
      check("library: an empty collection's row still carries its count, 0", row && row.length === 4 && row[3] === 0, JSON.stringify(row));
      const pe = await walkStore();
      ingestLib(pe, JSON.stringify(e1));
      const exE = readJ(pe.sources).export;
      const colE = readJ(pe.variables).collections.Empty;
      check("library: a read with an empty collection is complete, and the collection records 0 variables", exE.complete === true && colE && colE.variables === 0 && readJ(pe.sources).library.localCollections.find((c) => c.name === "Empty").variables === 0, `${JSON.stringify(exE.why)} ${JSON.stringify(colE)}`);
      // The first library-script dropped the 0 with a row's trailing defaults: a result it made still meets the count.
      const old = structuredClone(e1);
      old.d.cols = old.d.cols.map((c) => (c[0] === "Empty" ? c.slice(0, 3) : c));
      old.sum = fnv1a32(JSON.stringify(old.d));
      const po = await walkStore();
      ingestLib(po, JSON.stringify(old));
      check("library: a collection row whose 0 count was trimmed (the older script) still meets its count", readJ(po.sources).export.complete === true && readJ(po.variables).collections.Empty.variables === 0, JSON.stringify(readJ(po.sources).export.why));
      // The library deletes the collection: only a library read recorded it, so it leaves the store too.
      ingestLib(pe, JSON.stringify((await libRun({})).r));
      check("library: a collection only a library read recorded, that the library deletes, is dropped and listed", !readJ(pe.variables).collections.Empty && readJ(pe.variables).collections.Legacy && readJ(pe.sources).library.removed.some((x) => x.kind === "collection" && x.name === "Empty"), JSON.stringify(readJ(pe.sources).library.removed));
      // A walk that meets a stored library token returns only its use count (the definition is known), so its
      // collection gains no seenIn. When the library deletes both, the variable stays (flagged) and so does its collection.
      const lxX = structuredClone(lx);
      lxX.collections.push({ id: "VariableCollectionId:5:0", name: "Extra", key: "c0550000000000000000000000000000000000c5", modes: [["x1", "Mode 1"]] });
      lxX.variables.push({ id: "VariableID:7:50", key: "e5e5e5e5e5e50000000000000000000000000050", name: "x-1", col: "VariableCollectionId:5:0", type: "FLOAT", scopes: [], values: { x1: 4 } });
      const px = await walkStore();
      ingestLib(px, JSON.stringify((await libRun({}, {}, lxX)).r));
      const stX = load(px);
      Object.values(stX.sources.runs)[0].usesInWalkedFrames["e5e5e5e5e5e50000000000000000000000000050"] = 3;
      save(px, stX, AT);
      ingestLib(px, JSON.stringify((await libRun({})).r));
      const VX = readJ(px.variables);
      check("library: a deleted collection a walk-seen variable still belongs to is kept, and the variable is flagged", VX.variables["x-1"] && VX.variables["x-1"].notInLibrary === true && VX.collections.Extra && VX.collections.Extra.library.file === null && !readJ(px.sources).library.removed, `${JSON.stringify(VX.collections.Extra)} ${JSON.stringify(readJ(px.sources).library.removed)}`);
    }

    // Parts of two reads never combine. Day 1 reads the library whole; it then changes one grid gutter; day 2 reads it
    // again and is handed day 1's saved last part by mistake.
    {
      const lxG = structuredClone(lx);
      lxG.styles.find((s) => s.name === "Grid/12 col").layoutGrids[0].gutterSize = 32;
      const day1 = await readAll();
      const day2 = await readAll(lxG);
      const ps = await walkStore();
      for (const x of day1) ingestLib(ps, JSON.stringify(x));
      for (const x of day2.slice(0, -1)) ingestLib(ps, JSON.stringify(x));
      const splice = throws(() => ingestLib(ps, JSON.stringify(day1[day1.length - 1])));
      check("library: a saved part of an earlier read is refused as the last part of a new read", splice && /belongs to read/.test(splice.message) && readJ(ps.sources).export.complete === false, splice && splice.message);
      ingestLib(ps, JSON.stringify(day2[day2.length - 1]));
      check("library: the new read's own last part completes it, with the library's current value", readJ(ps.sources).export.complete === true && readJ(ps.grid)["Grid/12 col"].grids[0].gutterSize === 32, JSON.stringify(readJ(ps.grid)["Grid/12 col"]));
      // The same library on both days: the data would agree, but a part of another read is still refused (two
      // sessions reading at once, or a saved file from before).
      const day3 = await readAll();
      const pd = await walkStore();
      ingestLib(pd, JSON.stringify(day3[0]));
      const other = throws(() => ingestLib(pd, JSON.stringify(day1[1])));
      check("library: a part of another read of the same, unchanged library is refused too", day1[1].d.m.from === day3[0].d.m.next && day1[1].d.m.digest === day3[0].d.m.digest && other && /belongs to read/.test(other.message), other && other.message);
    }

    // One read, the library changed between its parts while every count stayed: a variable part 1 had already read is
    // deleted and one that sorts after the cursor is added, in the same collection. Or one value is edited.
    {
      const first = (await libRun({ cap: 1700 })).r;
      const lxS = structuredClone(lx);
      lxS.variables = lxS.variables.filter((v) => v.name !== "Border/External");
      lxS.variables.push({ id: "VariableID:7:99", key: "ababababab990000000000000000000000000099", name: "s-99", col: "VariableCollectionId:1:0", type: "FLOAT", scopes: [], values: { m1: 396 } });
      const later = await runScript(libraryScript({ file: lx.file, cap: 1700, from: first.d.m.next, read: first.d.m.read }), mockLibrary(lxS).figma);
      check("library: the swap keeps the total and the counts, and moves a row across the cursor", first.d.v.some((r) => r[1] === "Border/External") && later.d.v.some((r) => r[1] === "s-99") && later.d.m.total === first.d.m.total && JSON.stringify(later.d.m.counts) === JSON.stringify(first.d.m.counts), JSON.stringify(later.d.m.counts));
      const sw = await walkStore();
      ingestLib(sw, JSON.stringify(first));
      const swapErr = throws(() => ingestLib(sw, JSON.stringify(later)));
      check("library: a part read after a row was deleted before the cursor and one added after it is refused", swapErr && /differs from the one the read in progress started on/.test(swapErr.message) && readJ(sw.sources).export.complete === false, swapErr && swapErr.message);
      const lxV = structuredClone(lx);
      lxV.variables.find((v) => v.name === "s-6").values.m1 = 25;
      const edited = await runScript(libraryScript({ file: lx.file, cap: 1700, from: first.d.m.next, read: first.d.m.read }), mockLibrary(lxV).figma);
      const editErr = throws(() => ingestLib(sw, JSON.stringify(edited)));
      check("library: a part read after a value was edited between the calls is refused", editErr && /differs from the one the read in progress started on/.test(editErr.message), editErr && editErr.message);
      // A publish status that did not come back on one call is not a change to the library.
      const hungFirst = (await libRun({ cap: 1700, pubBudget: 30 }, { hang: "VariableID:7:5" })).r;
      const ph = await walkStore();
      ingestLib(ph, JSON.stringify(hungFirst));
      let at = hungFirst.d.m.next;
      let refused = null;
      for (let k = 0; at !== null && k < 20 && !refused; k++) {
        const x = (await libRun({ cap: 1700, from: at, read: hungFirst.d.m.read })).r;
        refused = throws(() => ingestLib(ph, JSON.stringify(x)));
        at = x.d.m.next;
      }
      check("library: a status unread on one call and read on the next still continues the read", !refused && hungFirst.d.v.length > 0 && readJ(ph.sources).export.complete === true, refused ? refused.message : JSON.stringify(readJ(ph.sources).export.why));
    }

    // notInLibrary is a token the frame WALK found that the library lacks; a token only a library read had, which the
    // library then deletes, leaves the set instead.
    {
      const { buildDrift } = await import("./tokens-drift.mjs");
      const { p: pn } = tmpStore();
      ingestLib(pn, JSON.stringify((await libRun({}, { extraVar: true })).r));
      check("library: (no walk ran) the first read stores s-99", !!readJ(pn.variables).variables["s-99"] && Object.keys(readJ(pn.sources).runs || {}).length === 0);
      ingestLib(pn, JSON.stringify((await libRun({})).r));
      const Vn = readJ(pn.variables).variables;
      const libN = readJ(pn.sources).library;
      check("library: a token the library deleted and no walk found leaves the set, listed as removed, and nothing is flagged walk-found", !("s-99" in Vn) && libN.removed && libN.removed.some((x) => x.name === "s-99" && x.kind === "variable") && Object.values(Vn).every((e) => !e.notInLibrary), `${JSON.stringify(libN.removed)} ${JSON.stringify(Vn["s-99"])}`);
      const dn = buildDrift(load(pn), [], { date: "2026-09-25" }).text;
      check("library: DRIFT names the dropped token and never calls it walk-found", !/`s-99` \(walk only/.test(dn) && !/the frame walk found/.test(dn) && /dropped from the set: `s-99` \(variable\)/.test(dn), dn.split("\n").filter((l) => /s-99|walk/.test(l)).join(" / "));

      // With a walk: a token the walk found, that the library deletes, stays and is flagged; a library-only one goes.
      const pw = await walkStore();
      ingestLib(pw, JSON.stringify((await libRun({})).r));
      const lxD = structuredClone(lx);
      lxD.variables = lxD.variables.filter((v) => v.name !== "s-4" && v.name !== "s-6");
      ingestLib(pw, JSON.stringify((await libRun({}, {}, lxD)).r));
      const Vw = readJ(pw.variables).variables;
      check("library: a walk-found token the library deletes is kept and flagged; a library-only one is dropped", Vw["Primatives/s-4"] && Vw["Primatives/s-4"].notInLibrary === true && !Vw["s-6"] && readJ(pw.sources).library.removed.map((x) => x.name).join() === "s-6", `${Object.keys(Vw).join(" | ")} ${JSON.stringify(readJ(pw.sources).library.removed)}`);

      // A rewalk restarts a run's counts: a walk-only token not seen again yet keeps its flag and its place.
      const pr = await walkStore();
      ingestLib(pr, JSON.stringify((await libRun({})).r));
      const stR = load(pr);
      for (const run of Object.values(stR.sources.runs)) run.usesInWalkedFrames = {};
      save(pr, stR, AT);
      ingestLib(pr, JSON.stringify((await libRun({})).r));
      const Vr = readJ(pr.variables).variables;
      check("library: after a rewalk reset its counts, a walk-only token keeps its flag and is not dropped", Vr["Legacy/s-4"] && Vr["Legacy/s-4"].notInLibrary === true && Vr["Border/Dangling"] && Vr["Border/Dangling"].notInLibrary === true && !readJ(pr.sources).library.removed, JSON.stringify(readJ(pr.sources).library.removed));

      // In the middle of a read the store still holds the previous read's key list: a token the new read has just
      // returned is not in it, and must be neither dropped nor flagged.
      const pm = await walkStore();
      ingestLib(pm, JSON.stringify((await libRun({})).r));
      const grow = await readAll(lx, { extraVar: true });
      const withNew = grow.findIndex((x) => x.d.v.some((r) => r[1] === "s-99"));
      for (const x of grow.slice(0, withNew + 1)) ingestLib(pm, JSON.stringify(x));
      const Vm = readJ(pm.variables).variables;
      check("library: mid-read, a token the new read has just returned is kept and not flagged", withNew >= 0 && withNew < grow.length - 1 && Vm["s-99"] && !Vm["s-99"].notInLibrary && readJ(pm.sources).export.complete === false, `${withNew}/${grow.length} ${JSON.stringify(Vm["s-99"])}`);
      for (const x of grow.slice(withNew + 1)) ingestLib(pm, JSON.stringify(x));
      check("library: ...and the finished read keeps it as the library's", readJ(pm.sources).export.complete === true && readJ(pm.variables).variables["s-99"] && !readJ(pm.variables).variables["s-99"].notInLibrary && !readJ(pm.sources).library.removed);
    }

    // The CLI plans a continuation with the read's id, and refuses, before a call is spent, one ingest would refuse.
    {
      const { main } = await import("../tokens.mjs");
      const cr = path.dirname(path.dirname((await walkStore()).variables));
      const cp = paths(cr);
      const plan = async (argv) => {
        const [log, err] = [console.log, console.error];
        console.log = console.error = () => {};
        try {
          const out = path.join(cr, "script.js");
          if (fs.existsSync(out)) fs.unlinkSync(out);
          await main(["library-script", ...argv, "--out", out], cr, path.join(HERE, "..", "..", "figma-catalog"));
          return { src: fs.readFileSync(out, "utf8") };
        } catch (e) {
          return { err: e };
        } finally {
          console.log = log;
          console.error = err;
        }
      };
      const none = await plan(["--from", "3"]);
      check("library: the CLI refuses --from with no read in progress", none.err && /no library read .* is in progress/.test(none.err.message), none.err ? none.err.message : "planned");
      ingestLib(cp, JSON.stringify(parts[0]));
      const cont = await plan([]);
      const P0 = cont.src && JSON.parse(/const P = (.*);/.exec(cont.src)[1]);
      check("library: the CLI continues the read in progress with its read id", P0 && P0.from === parts[0].d.m.next && P0.read === parts[0].d.m.read, JSON.stringify(P0));
      const wrong = await plan(["--from", String(parts[0].d.m.next + 1)]);
      check("library: the CLI refuses a --from other than where the read in progress continues", wrong.err && /continues at row/.test(wrong.err.message), wrong.err ? wrong.err.message : "planned");
      const fresh = await plan(["--restart"]);
      const P1 = fresh.src && JSON.parse(/const P = (.*);/.exec(fresh.src)[1]);
      check("library: --restart starts a new read from row 0 with a new read id", P1 && P1.from === 0 && /^[0-9a-f]{12}$/.test(P1.read) && P1.read !== parts[0].d.m.read, JSON.stringify(P1));
    }

    // Tamper: the cursor lives inside the checksum.
    const bent = JSON.stringify(parts[0]).replace(/"next":(\d+)/, (a, n) => `"next":${Number(n) + 1}`);
    check("library: the tamper changed the text", bent !== JSON.stringify(parts[0]));
    const bentErr = throws(() => parseResult(bent, LIBRARY_KIND));
    check("library: a copy with a changed cursor is refused by the checksum", bentErr && /checksum mismatch/.test(bentErr.message), bentErr && bentErr.message);

    // No grid-style API: the token set cannot be called complete.
    const ng = await walkStore();
    const noGrid = (await libRun({}, { noGrid: true })).r;
    ingestLib(ng, JSON.stringify(noGrid));
    const exg = readJ(ng.sources).export;
    check("library: without getLocalGridStylesAsync the read is not complete, and says why", noGrid.d.m.gridRead === false && exg.complete === false && /grid styles could not be read/.test(exg.why.join()), JSON.stringify(exg.why));

    // An item that fails to read is named, and the read is not complete.
    const bs = await walkStore();
    const broken = (await libRun({}, { breakStyle: "Lg/Label 1 300" })).r;
    ingestLib(bs, JSON.stringify(broken));
    const exb = readJ(bs.sources).export;
    check("library: an item whose read throws is named and blocks completeness", broken.d.bad.length === 1 && exb.complete === false && /Lg\/Label 1 300/.test(exb.why.join()), JSON.stringify(exb.why));

    // A publish status that never comes back: the script still returns, and that item's status is UNKNOWN.
    const hs = await walkStore();
    const hung = (await libRun({ pubBudget: 30 }, { hang: "VariableID:7:5" })).r;
    ingestLib(hs, JSON.stringify(hung));
    const exh = readJ(hs.sources).export;
    const Vh = readJ(hs.variables).variables;
    check("library: a hung publish status does not hang the read; that item is counted unread, not marked", !("publish" in Vh["s-6"]) && exh.publish.complete === false && exh.publish.read === 17 && exh.publish.unread.v === 1 && exh.publish.unreadVariables.join() === "s-6" && exh.complete === true, `${JSON.stringify(Vh["s-6"])} ${JSON.stringify(exh.publish)}`);

    // As measured live 2026-09-24: getPublishStatusAsync is not a function on styles in use_figma.
    const ns = await walkStore();
    const noPub = (await libRun({}, { noStylePub: true })).r;
    ingestLib(ns, JSON.stringify(noPub));
    const exn = readJ(ns.sources).export;
    const En = readJ(ns.effect);
    check("library: styles whose status cannot be read carry no mark, and the export counts them with the error", !("publish" in En.Glow) && exn.publish.unread.ts === 3 && exn.publish.unread.ps === 3 && exn.publish.unread.es === 2 && exn.publish.unread.gs === 1 && exn.publish.unread.v === 0 && Object.keys(exn.publish.errors).some((k) => /not a function/.test(k)) && readJ(ns.variables).variables["internal/scratch"].publish === "UNPUBLISHED", JSON.stringify(exn.publish));
  }

  // 8. Read-only guard: no script may contain a write call.
  {
    const ex = exportScript({ file: "k", pages: ["1:1"], known: [] });
    const pv = provenanceScript({ file: "k" });
    const lb = libraryScript({ file: "k" });
    const WRITES = /\b(create[A-Z]\w*|set[A-Z]\w*Async|setBoundVariable|setValueForMode|appendChild|insertChild|remove\(|importVariableByKeyAsync|importComponentByKeyAsync|importStyleByKeyAsync|setPluginData|setSharedPluginData|setCurrentPageAsync|\.name\s*=[^=]|\.characters\s*=[^=]|\.fills\s*=[^=]|closePlugin|notify\()/;
    const w1 = WRITES.exec(ex);
    const w2 = WRITES.exec(pv);
    const w3 = WRITES.exec(lb);
    check("the export script has no write call", !w1, w1 && w1[0]);
    check("the provenance script has no write call", !w2, w2 && w2[0]);
    check("the library script has no write call", !w3, w3 && w3[0]);
    // A realistic known-key list still fits.
    const many = Array.from({ length: 500 }, (_, i) => i.toString(16).padStart(12, "0"));
    check("500 known keys and 31 pages still fit under the script cap", Buffer.byteLength(exportScript({ file: "k", pages: Array.from({ length: 31 }, (_, i) => `${i}:1`), known: many })) < SCRIPT_CAP);
  }

  // 9. Drift report over fixture sources.
  {
    const { driftSelfTest } = await import("./tokens-drift.mjs");
    for (const r of await driftSelfTest()) results.push(r);
  }

  let failed = 0;
  for (const r of results) {
    if (!r.ok) failed++;
    console.log(`${r.ok ? "ok  " : "FAIL"} ${r.name}${!r.ok && r.detail ? `  -- ${r.detail}` : ""}`);
  }
  console.log(`\n${results.length - failed}/${results.length} passed`);
  return failed ? 1 : 0;
}

export { allTokens };
