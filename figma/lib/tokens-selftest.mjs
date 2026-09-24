// node figma/tokens.mjs --self-test: runs without Figma. The generated scripts are executed
// against a mock of the Plugin API built from fixtures/tokens-mock.json, then ingested into a
// temporary store, so what is tested is the exact text a use_figma call would receive.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportScript, provenanceScript, runScript, fnv1a32, SCRIPT_CAP } from "./tokens-plugin.mjs";
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

  // 8. Read-only guard: neither script may contain a write call.
  {
    const ex = exportScript({ file: "k", pages: ["1:1"], known: [] });
    const pv = provenanceScript({ file: "k" });
    const WRITES = /\b(create[A-Z]\w*|set[A-Z]\w*Async|setBoundVariable|setValueForMode|appendChild|insertChild|remove\(|importVariableByKeyAsync|importComponentByKeyAsync|importStyleByKeyAsync|setPluginData|setSharedPluginData|setCurrentPageAsync|\.name\s*=[^=]|\.characters\s*=[^=]|\.fills\s*=[^=]|closePlugin|notify\()/;
    const w1 = WRITES.exec(ex);
    const w2 = WRITES.exec(pv);
    check("the export script has no write call", !w1, w1 && w1[0]);
    check("the provenance script has no write call", !w2, w2 && w2[0]);
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
