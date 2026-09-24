#!/usr/bin/env node
// figma:tokens: the Figma variables and styles, held in figma/tokens/. The set is read from the library file itself
// (library-script / library-ingest); the frame walk (export-*) adds use counts and anything the library lacks.
//
//   node figma/tokens.mjs status
//   node figma/tokens.mjs export-script --file <fileKey> [--budget <ms>] [--stride N [--offset K]] [--from P:C] [--restart] [--out <f>]
//   node figma/tokens.mjs export-ingest <result.json>
//   node figma/tokens.mjs provenance-script [--file TyX8YAtNDEIvsnSLQ3IXId] [--out <f>]
//   node figma/tokens.mjs provenance-ingest <result.json>
//   node figma/tokens.mjs library-script [--file TyX8YAtNDEIvsnSLQ3IXId] [--from N | --restart] [--no-publish] [--out <f>]
//   node figma/tokens.mjs library-ingest <result.json>   one part of the library read; repeat until complete
//   node figma/tokens.mjs ledger-failed --file <fileKey> [--note <text>]
//   node figma/tokens.mjs reindex         rewrite tokens/ through the current code (no call)
//   node figma/tokens.mjs get <name>
//   node figma/tokens.mjs list [--collection <name>] [--type COLOR|FLOAT|STRING|BOOLEAN|TEXT|EFFECT|PAINT]
//   node figma/tokens.mjs diff            writes figma/tokens/DRIFT.md
//   node figma/tokens.mjs --self-test
//
// Only the *-script commands plan a Figma call, and they refuse past the daily budget
// (FIGMA_DAILY_BUDGET, default 120, counted from ledger/calls.jsonl). Every *-ingest appends its
// ledger line before it writes anything. Everything else reads tokens/ and costs no call.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportScript, provenanceScript, libraryScript, SCRIPT_CAP, LIBRARY_KIND } from "./lib/tokens-plugin.mjs";
import {
  FILES,
  LIBRARY_FILE,
  paths,
  load,
  save,
  knownKeys,
  assertBudget,
  callsToday,
  budget,
  appendLedger,
  ledgerHas,
  ledgerSeen,
  openPass,
  parseResult,
  ingestExport,
  ingestProvenance,
  ingestLibrary,
  allTokens,
  resolveValue,
  EXPORT_KIND,
  PROVENANCE_KIND,
} from "./lib/tokens-store.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function args(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = argv[i + 1];
      if (v === undefined || v.startsWith("--")) opt[k] = true;
      else {
        opt[k] = v;
        i++;
      }
    } else pos.push(a);
  }
  return { pos, opt };
}

/** Tracked pages of one file, in the file's page order: the pages holding a tracked catalog frame. */
export function trackedPages(catalogDir, fileKey) {
  const reg = JSON.parse(fs.readFileSync(path.join(catalogDir, "registry.json"), "utf8"));
  const pj = JSON.parse(fs.readFileSync(path.join(catalogDir, "pages.json"), "utf8"));
  const out = new Set(Object.keys(pj.outOfScope || {}));
  const names = new Set();
  for (const f of Object.values(reg.frames)) {
    if (f.fileKey !== fileKey || f.gone || !f.page || out.has(f.page)) continue;
    names.add(f.page);
  }
  const pages = pj.pages.filter((p) => p.fileKey === fileKey && names.has(p.pageName));
  const missing = [...names].filter((n) => !pages.some((p) => p.pageName === n));
  return { pages: pages.map((p) => ({ id: p.pageId, name: p.pageName, n: p.liveChildren })), missing };
}

/**
 * Parses a saved result. A result refused (damaged, wrong kind) still stands for a call that was made, so it is
 * ledgered with ok:false before the error is raised; the same refused copy ingested again writes calls:0.
 */
export function parseOrLedger(p, file, kind, opt = {}) {
  const text = fs.readFileSync(file, "utf8");
  try {
    return parseResult(text, kind);
  } catch (e) {
    const claimed = (/"sum":"([0-9a-f]{8})"/.exec(text) || [])[1] || null;
    const fileKey = (/"file":"([0-9A-Za-z]{22,})"/.exec(text) || [])[1] || opt.file || "unknown";
    const again = claimed && ledgerSeen(p, claimed);
    appendLedger(p, { file: fileKey, frames: 0, ok: false, nonce: claimed, calls: again ? 0 : 1, note: String(e.message).slice(0, 160) });
    throw e;
  }
}

function emit(text, out) {
  if (out) {
    fs.writeFileSync(out, text);
    console.error(`wrote ${out} (${Buffer.byteLength(text)} bytes)`);
  } else process.stdout.write(text);
}

function fmtVal(v) {
  if (v && typeof v === "object") return v.alias ? `-> ${v.alias}` : JSON.stringify(v);
  return String(v);
}

export async function main(argv, root = HERE, catalogDir = path.join(HERE, "..", "figma-catalog")) {
  const { pos, opt } = args(argv);
  const cmd = pos[0];
  const p = paths(root);

  if (opt["self-test"] || cmd === "self-test") {
    const { selfTest } = await import("./lib/tokens-selftest.mjs");
    return selfTest();
  }

  if (cmd === "status") {
    const st = load(p);
    console.log(`budget: ${callsToday(p)} of ${budget()} calls used today (UTC)`);
    console.log(`tokens: ${st.vars.size} variables, ${st.text.size} text styles, ${st.effect.size} effect styles, ${st.paint.size} paint styles, ${st.grid.size} grid styles`);
    const ex = st.sources.export;
    if (ex) console.log(`export: ${ex.complete ? "COMPLETE" : "INCOMPLETE"}, ${ex.method} of ${ex.sourceName} (${ex.source}) at ${ex.updatedAt}${ex.complete ? "" : `; ${ex.why.join("; ")}`}`);
    else console.log("export: no library read yet; the token set is only what the frame walk found (run library-script)");
    console.log("walks (use counts only; the token set comes from the library read):");
    for (const [k, r] of Object.entries(st.sources.runs || {})) {
      const c = r.coverage || {};
      const open = openPass(st, k);
      console.log(`  ${k} ${r.fileName}: ${r.complete ? "complete" : "INCOMPLETE"}; ${c.framesWalked ?? r.frames} of ${c.framesOnReachedPages ?? "?"} top-level frames on the pages reached, ${c.pagesTouched ?? "?"} of ${c.pagesPlanned ?? "?"} pages sampled${c.pagesNotReached && c.pagesNotReached.length ? ` (${c.pagesNotReached.length} not reached)` : ""}, ${r.nodes} nodes, ${r.calls} call(s)${open ? `; open pass stride ${open.stride} offset ${open.offset} at ${JSON.stringify(open.next)}` : ""}`);
    }
    const lib = st.sources.library;
    if (lib && lib.match) console.log(`library ${lib.fileName} (${lib.file}): ${lib.match.map((m) => `${m.kind} ${m.inLibrary}/${m.stored}`).join(", ")}; collections matched ${lib.collectionsMatched}`);
    return 0;
  }

  if (cmd === "export-script") {
    const file = opt.file;
    if (!FILES[file]) throw new Error(`--file must be one of ${Object.keys(FILES).join(", ")}`);
    const b = assertBudget(p);
    const st = load(p);
    const { pages, missing } = trackedPages(catalogDir, file);
    if (missing.length) console.error(`warning: registry pages with no pages.json entry (not walked): ${missing.join(", ")}`);
    const open = opt.restart ? null : openPass(st, file);
    let from = [0, 0];
    let stride = 1;
    let offset = 0;
    if (open) ({ next: from, stride, offset } = open);
    if (opt.from) from = String(opt.from).split(":").map(Number);
    if (opt.stride) stride = Number(opt.stride);
    if (opt.offset) offset = Number(opt.offset);
    if (!(stride >= 1) || !(offset >= 0) || offset >= stride) throw new Error(`bad --stride ${stride} / --offset ${offset}`);
    const src = exportScript({ file, pages: pages.map((x) => x.id), known: knownKeys(st), from, stride, offset, budget: Number(opt.budget) || 30000 });
    const bytes = Buffer.byteLength(src);
    if (bytes > SCRIPT_CAP) throw new Error(`script is ${bytes} bytes, over the ${SCRIPT_CAP} cap`);
    console.error(`export-script ${file} (${FILES[file]}): ${pages.length} pages from ${JSON.stringify(from)}, stride ${stride} offset ${offset}, ${knownKeys(st).length} known keys skipped, ${bytes} bytes; budget ${b.used}/${b.cap}, this is call ${b.used + 1}`);
    emit(src, opt.out);
    return 0;
  }

  if (cmd === "export-ingest") {
    const r = parseOrLedger(p, pos[1], EXPORT_KIND, opt);
    if (ledgerHas(p, r.sum)) console.error(`ledger already holds result ${r.sum}: re-ingesting without counting a new call`);
    else appendLedger(p, { file: r.h.file, frames: r.h.frames, nonce: r.sum, calls: ledgerSeen(p, r.sum) === "refused" ? 0 : 1 });
    const st = load(p);
    const at = new Date().toISOString();
    const res = ingestExport(st, r, at);
    const { unresolved } = save(p, st, at);
    console.log(
      `ingested ${r.h.file} (${r.h.fileName}): +${res.added.v} variables, +${res.added.ts} text, +${res.added.es} effect, +${res.added.ps} paint styles; ` +
        `${r.h.frames} frames / ${r.h.nodes} nodes in ${r.h.ms} ms; ${res.complete ? "every tracked page walked" : `coverage ${res.coverage.framesWalked}/${res.coverage.framesOnReachedPages} frames on reached pages, ${res.coverage.pagesNotReached.length} page(s) not reached${res.next ? `, pass open at ${JSON.stringify(res.next)}` : ""}`}` +
        `${res.truncated ? `; ${res.truncated} definitions did not fit, run export-script again` : ""}`,
    );
    if (res.miss) console.log(`  ${res.miss} ids resolved to nothing (recorded in sources.json)`);
    if (res.unknownUses.length) console.log(`  use counts for unknown keys: ${res.unknownUses.join(" ")}`);
    if (unresolved.length) console.log(`  aliases/bindings not yet resolvable: ${unresolved.join(" ")}`);
    if (Object.keys(res.errors).length) console.log(`  errors: ${JSON.stringify(res.errors)}`);
    return 0;
  }

  if (cmd === "provenance-script") {
    const file = opt.file || LIBRARY_FILE;
    const b = assertBudget(p);
    const st = load(p);
    const src = provenanceScript({ file });
    const bytes = Buffer.byteLength(src);
    if (bytes > SCRIPT_CAP) throw new Error(`script is ${bytes} bytes, over the ${SCRIPT_CAP} cap`);
    console.error(`provenance-script ${file}: ${bytes} bytes; budget ${b.used}/${b.cap}, this is call ${b.used + 1}`);
    emit(src, opt.out);
    return 0;
  }

  if (cmd === "provenance-ingest") {
    const r = parseOrLedger(p, pos[1], PROVENANCE_KIND, opt);
    if (!ledgerHas(p, r.sum)) appendLedger(p, { file: r.h.file, frames: 0, nonce: r.sum, calls: ledgerSeen(p, r.sum) === "refused" ? 0 : 1 });
    const st = load(p);
    const at = new Date().toISOString();
    const lib = ingestProvenance(st, r, at);
    save(p, st, at);
    console.log(`library ${lib.fileName} (${lib.file}): ${lib.localCollections.length} local collections (${lib.localCollections.map((c) => c.name).join(", ")}), ${lib.collectionsMatched} of ours matched; ${lib.match.map((m) => `${m.kind} ${m.inLibrary}/${m.stored} in library`).join(", ")}${lib.keysCut ? `; key lists CUT ${lib.keysCut}x` : ""}`);
    return 0;
  }

  if (cmd === "library-script") {
    const file = opt.file || LIBRARY_FILE;
    const b = assertBudget(p);
    const st = load(p);
    const ex = st.sources.export;
    let from = 0;
    if (opt.from !== undefined) from = Number(opt.from);
    else if (!opt.restart && ex && ex.method === "library-read" && ex.source === file && !ex.complete && ex.next) from = ex.next;
    if (!(Number.isInteger(from) && from >= 0)) throw new Error(`bad --from ${opt.from}`);
    const src = libraryScript({ file, from, pub: !opt["no-publish"] });
    const bytes = Buffer.byteLength(src);
    if (bytes > SCRIPT_CAP) throw new Error(`script is ${bytes} bytes, over the ${SCRIPT_CAP} cap`);
    console.error(`library-script ${file}: rows from ${from}${from ? " (continuing the read in progress)" : ""}, ${bytes} bytes; budget ${b.used}/${b.cap}, this is call ${b.used + 1}`);
    emit(src, opt.out);
    return 0;
  }

  if (cmd === "library-ingest") {
    const r = parseOrLedger(p, pos[1], LIBRARY_KIND, opt);
    if (ledgerHas(p, r.sum)) console.error(`ledger already holds result ${r.sum}: re-ingesting without counting a new call`);
    else appendLedger(p, { file: r.h.file, frames: 0, nonce: r.sum, calls: ledgerSeen(p, r.sum) === "refused" ? 0 : 1 });
    const st = load(p);
    const at = new Date().toISOString();
    const res = ingestLibrary(st, r, at);
    if (res.already) {
      console.log(`part ${r.sum} (rows ${res.part.from}..${res.part.from + res.part.n - 1}) is already in the store; nothing changed`);
      return 0;
    }
    const { unresolved } = save(p, st, at);
    const ex = res.ex;
    const m = r.d.m;
    const kinds = { v: "variables", ts: "text", ps: "paint", es: "effect", gs: "grid" };
    console.log(
      `library ${ex.sourceName} (${ex.source}): rows ${m.from}..${m.from + m.n - 1} of ${m.total} (${Object.entries(kinds).map(([k, l]) => `${r.d[k].length} ${l}`).join(", ")}) in ${m.ms} ms; ` +
        `library lists ${m.counts.cols} collections, ${m.counts.v} variables, ${m.counts.ts} text, ${m.counts.ps} paint, ${m.counts.es} effect, ${m.counts.gs} grid styles${m.gridRead ? "" : " (grid styles NOT read)"}`,
    );
    console.log(`  so far: new ${Object.entries(kinds).map(([k, l]) => `${ex.added[k]} ${l}`).join(", ")}; ${ex.same} already stored and identical; ${ex.changes.length} field difference(s) against what the walk stored`);
    for (const c of ex.changes.slice(-40)) console.log(`    ${c.kind} ${c.name} ${c.field}: ${c.was} -> ${c.now}`);
    const unread = Object.entries(ex.publish.unread).filter(([, n]) => n);
    console.log(`  publish status: ${ex.publish.complete ? `read for all ${ex.publish.of} items` : `read for ${Math.max(0, ex.publish.read)} of ${ex.publish.of} items; unread (no mark written): ${unread.map(([k, n]) => `${n} ${kinds[k]}`).join(", ")}${Object.keys(ex.publish.errors).length ? ` (${Object.keys(ex.publish.errors).join("; ")})` : ""}`}`);
    if (ex.externalAliases.length) console.log(`  aliases to variables outside the library: ${ex.externalAliases.map((x) => `${x[1] || "?"} (${x[0]})`).join(", ")}`);
    if (Object.keys(r.d.err || {}).length) console.log(`  errors: ${JSON.stringify(r.d.err)}`);
    if (unresolved.length) console.log(`  aliases/bindings not yet resolvable: ${unresolved.join(" ")}`);
    if (ex.complete) {
      const lib = st.sources.library;
      console.log(`  COMPLETE: every local collection, variable and style of ${ex.sourceName} is in figma/tokens/.`);
      if (ex.provenanceCheck) console.log(`  against the provenance key list of ${ex.provenanceCheck.checkedAt}: ${["v", "t", "e", "p"].map((l) => `${l} ${ex.provenanceCheck[l]}`).join(", ")}`);
      for (const mm of lib.match) if (mm.notInLibrary.length) console.log(`  ${mm.kind} the walk found that ${ex.sourceName} does not define (kept, flagged notInLibrary): ${mm.notInLibrary.join(", ")}`);
    } else console.log(`  NOT complete: ${ex.why.join("; ")}`);
    return 0;
  }

  if (cmd === "reindex") {
    // Rewrites tokens/ through the current code (migrations, names, library marks). No Figma call.
    const st = load(p);
    const { unresolved } = save(p, st, new Date().toISOString());
    console.log(`reindexed: ${st.vars.size} variables, ${st.text.size} text, ${st.effect.size} effect, ${st.paint.size} paint styles${unresolved.length ? `; unresolved ${unresolved.join(" ")}` : ""}`);
    return 0;
  }

  if (cmd === "ledger-failed") {
    if (!opt.file) throw new Error("--file is required");
    const line = appendLedger(p, { file: opt.file, frames: 0, ok: false, note: opt.note || "call made, result not ingested" });
    console.log(`ledger: ${JSON.stringify(line)}`);
    return 0;
  }

  if (cmd === "get") {
    const q = pos.slice(1).join(" ");
    if (!q) throw new Error("usage: get <name>");
    const st = load(p);
    const all = allTokens(st);
    let hits = all.filter((t) => t.name === q);
    if (!hits.length) hits = all.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));
    if (!hits.length) {
      console.log(`no token named "${q}" in figma/tokens/ (${all.length} stored). Run \`npm run figma:tokens -- list\` to browse.`);
      return 1;
    }
    for (const t of hits.slice(0, 40)) {
      const e = t.entry;
      const marks = [e.notInLibrary ? "NOT defined in the library file (found by the frame walk)" : "", e.publish ? `library publish status ${e.publish}` : "", e.hiddenFromPublishing ? "hidden from publishing" : ""].filter(Boolean);
      console.log(`${t.name}  [${t.kind}${t.kind === "variable" ? ` ${t.type}, collection ${t.collection}` : ""}]  key ${t.key}${e.remote ? " (library)" : " (local)"}${marks.length ? `  ${marks.join("; ")}` : ""}`);
      if (t.kind === "variable") {
        for (const [m, v] of Object.entries(e.modes)) {
          const r = resolveValue(st, e, m);
          const shown = v && typeof v === "object" && ("aliasKey" in v || "alias" in v) ? `-> ${allTokens(st).find((x) => x.key === v.aliasKey)?.name || v.alias} = ${r && r.unresolved ? "unresolved" : r}` : fmtVal(v);
          console.log(`  ${m}: ${shown}`);
        }
        if (e.scopes && e.scopes.length) console.log(`  scopes: ${e.scopes.join(", ")}`);
        if (e.codeSyntax) console.log(`  code: ${e.codeSyntax.WEB}`);
      } else if (t.kind === "text-style") {
        console.log(`  ${e.ff || "(no font family in Figma)"} ${e.fs}px weight ${e.fw === "" || e.fw == null ? "(unknown)" : e.fw}, line-height ${e.lh}, letter-spacing ${e.ls}, case ${e.tc}, decoration ${e.td}`);
      } else if (t.kind === "effect-style") console.log(`  ${JSON.stringify(e.effects)}`);
      else if (t.kind === "grid-style") console.log(`  ${JSON.stringify(e.grids)}`);
      else console.log(`  ${JSON.stringify(e.paints)}`);
    }
    if (hits.length > 40) console.log(`… ${hits.length - 40} more`);
    return 0;
  }

  if (cmd === "list") {
    const st = load(p);
    let all = allTokens(st);
    if (opt.collection) all = all.filter((t) => t.collection === opt.collection);
    if (opt.type) all = all.filter((t) => t.type === String(opt.type).toUpperCase());
    for (const t of all) {
      const e = t.entry;
      let v = "";
      if (t.kind === "variable") {
        const first = resolveValue(st, e);
        v = first && first.unresolved ? `unresolved ${first.unresolved}` : String(first);
      } else if (t.kind === "text-style") v = `${e.ff} ${e.fs}/${e.lh} ${e.fw}`;
      else v = JSON.stringify(e.effects || e.paints || e.grids);
      console.log(`${t.type.padEnd(7)} ${t.collection.padEnd(22)} ${t.name.padEnd(40)} ${v}`);
    }
    console.error(`${all.length} tokens`);
    return 0;
  }

  if (cmd === "diff") {
    const { writeDrift } = await import("./lib/tokens-drift.mjs");
    const out = writeDrift(p, path.join(root, ".."), path.join(root, "..", "..", ".."));
    console.log(`wrote ${out.path}: ${out.summary}`);
    return 0;
  }

  console.error("usage: node figma/tokens.mjs status | export-script | export-ingest | provenance-script | provenance-ingest | library-script | library-ingest | ledger-failed | reindex | get | list | diff | --self-test");
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code || 0),
    (e) => {
      console.error(`error: ${e.message}`);
      process.exit(1);
    },
  );
}
