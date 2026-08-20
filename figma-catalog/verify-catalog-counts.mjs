#!/usr/bin/env node
/**
 * verify-catalog-counts.mjs — assert that the catalog's own numbers describe the
 * catalog's own contents.
 *
 * Why this exists
 * ---------------
 * Every count in `registry.json.stats` used to be incremented while the
 * `<section>.nodes.txt` lists were being READ, not derived from the rows that
 * survived into `frames`. Registry keys are `"<fileKey>:<node>"` (bare id for the
 * primary file), so two sections sharing a fileKey and listing the same id
 * collide and the later one wins. The losers were still counted.
 *
 * Measured 2026-08-20, before the fix: `stats.total` read **4373** against
 * **3628** actual rows. `missing-play-images` reported 24 frames while owning
 * ZERO rows, so `status.missing-play-images.tsv` and
 * `vverify.missing-play-images.tsv` were folding onto nothing and nobody could
 * see it.
 *
 * A wrong count is worse than a missing one: it is quotable. This file makes
 * every such claim executable, so the next drift fails loudly instead of being
 * repeated in a report.
 *
 * The oracle is INDEPENDENT on purpose
 * ------------------------------------
 * Nothing here imports build-registry.mjs or re-runs its logic. It reads the
 * published artefact (`registry.json`) and re-counts from the raw inputs
 * (`<section>.nodes.txt`, `<section>.titles.tsv`, `pages.json`,
 * `code-node-citations.json`). A check that re-derives its expectation from the
 * code under test passes over broken code.
 *
 * Usage:  node figma-catalog/verify-catalog-counts.mjs
 * Exit 0 = every invariant holds. Exit 1 = at least one is broken; each failure
 * prints what was expected, what was found, and how to reproduce it.
 *
 * ⚠ KNOWN RED as of 2026-08-20 — one invariant, and it is NOT a false alarm.
 * ------------------------------------------------------------------------
 * `every <section>.titles.tsv id is listed in its .nodes.txt` fails on
 * **trade-2**, and it was already failing before this file existed. Measurement,
 * not verdict: `trade-2.nodes.txt` holds 495 ids; `trade-2.titles.tsv` holds 89
 * rows, of which **73 are truncated** — the row reads `13006-13436` ⇥
 * `13006-134366`, i.e. the id column lost its last character and the title column
 * holds a node-id where a frame name belongs. Only **16** rows join, and the
 * registry consequently carries **480 of 495 trade-2 rows at `title: null`,
 * `kind: "untitled"`**.
 *
 * That is why `stats.bySection["trade-2"]` reads `frames: 495, titled: 15` — the
 * section LOOKS catalogued and is not. Fixing it needs a re-harvest of the
 * Trade 2 page, not an edit to the TSV, so it is left red on purpose: this is a
 * true alarm and suppressing it would restore exactly the invisibility the file
 * was written to end. Do not "green" this by deleting the check.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
const readLines = (f) =>
  fs.existsSync(path.join(DIR, f))
    ? read(f)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

const reg = JSON.parse(read("registry.json"));
const pages = JSON.parse(read("pages.json"));
const frames = Object.values(reg.frames || {});
const stats = reg.stats || {};

const failures = [];
const ok = [];
const check = (name, pass, detail) => {
  if (pass) ok.push(name);
  else failures.push(`${name}\n    ${detail}`);
};

// ── 1. stats.total describes rows that exist ────────────────────────────────
check(
  "stats.total equals the number of rows in registry.frames",
  stats.total === frames.length,
  `stats.total=${stats.total} frames=${frames.length} (delta ${stats.total - frames.length}). ` +
    `A positive delta means per-id counting is back and overwritten rows are being counted.`,
);

// ── 2. every per-section count matches an independent recount ───────────────
{
  const actual = {};
  for (const f of frames) actual[f.section] = (actual[f.section] || 0) + 1;
  const bad = [];
  for (const [s, v] of Object.entries(stats.bySection || {})) {
    const a = actual[s] || 0;
    if (v.frames !== a) bad.push(`${s}: stats says ${v.frames}, recount says ${a}`);
  }
  for (const s of Object.keys(actual))
    if (!(stats.bySection || {})[s]) bad.push(`${s}: rows exist but no stats.bySection entry`);
  check(
    "stats.bySection[*].frames matches a recount of registry.frames",
    bad.length === 0,
    bad.join("; "),
  );

  const sum = Object.values(stats.bySection || {}).reduce((n, v) => n + v.frames, 0);
  check(
    "stats.bySection sums to stats.total",
    sum === stats.total,
    `sum=${sum} stats.total=${stats.total}`,
  );
}

// ── 3. the key-collision ledger reconciles with no remainder ────────────────
{
  const kc = stats.keyCollisions;
  check("stats.keyCollisions is present", !!kc, "missing — the collision ledger was removed");
  if (kc) {
    const listed = Object.keys(stats.bySection || {}).reduce(
      (n, s) => n + readLines(`${s}.nodes.txt`).length,
      0,
    );
    check(
      "keyCollisions.idsListed matches a recount of every <section>.nodes.txt",
      kc.idsListed === listed,
      `ledger says ${kc.idsListed}, recount of the .nodes.txt files says ${listed}`,
    );
    check(
      "idsListed - collisions == rows kept (no unexplained remainder)",
      kc.idsListed - kc.total === stats.total && kc.reconciles === true,
      `${kc.idsListed} - ${kc.total} = ${kc.idsListed - kc.total}, stats.total=${stats.total}, ` +
        `reconciles=${kc.reconciles}`,
    );
  }
}

// ── 4. citations are attributed, not silently refused ──────────────────────
{
  const citedRows = frames.filter((f) => (f.citedByFiles || []).length).length;
  check(
    "stats.cited equals the number of rows carrying citedByFiles",
    stats.cited === citedRows,
    `stats.cited=${stats.cited} rows-with-citations=${citedRows}`,
  );

  const refusals = stats.citationRefusals;
  check(
    "stats.citationRefusals is present",
    Array.isArray(refusals),
    "missing — a refused citation would now be indistinguishable from an absent one",
  );
  if (Array.isArray(refusals))
    check(
      "no citation is refused for an ambiguous node-id",
      refusals.length === 0,
      `${refusals.length} refused: ${refusals.map((r) => r.id).join(", ")}. ` +
        `A bare id is claimed by two catalogued files; decide which one the code comment meant.`,
    );

  // A section reporting cited:0 must be a TRUE zero — no id of its own appears in
  // the citation index — rather than an attribution rule declining to look.
  const n2f = JSON.parse(read("code-node-citations.json")).nodeToFiles || {};
  const bad = [];
  for (const [s, v] of Object.entries(stats.bySection || {})) {
    if (v.cited !== 0) continue;
    const hits = frames.filter((f) => f.section === s && (n2f[f.node] || []).length).length;
    if (hits) bad.push(`${s}: reports cited:0 but ${hits} of its node-ids are in the citation index`);
  }
  check("every cited:0 section is a true zero, not a suppressed one", bad.length === 0, bad.join("; "));
}

// ── 5. page coverage: rows + gone accounts for the live children ───────────
{
  const bad = [];
  for (const pg of stats.pageCoverage || []) {
    if (pg.live == null) continue;
    if (pg.delta !== pg.live - pg.rows) bad.push(`${pg.page}: delta ${pg.delta} != live-rows ${pg.live - pg.rows}`);
  }
  check("pageCoverage.delta is live minus rows on every page", bad.length === 0, bad.join("; "));

  // The Social page is the one this lane re-harvested; it must be exactly in step.
  const soc = (stats.pageCoverage || []).find((p) => /Social/.test(p.page));
  check(
    "the Social page is exactly in step with live Figma (delta 0)",
    soc && soc.delta === 0,
    soc ? `rows=${soc.rows} gone=${soc.gone} live=${soc.live} delta=${soc.delta}` : "no Social page row",
  );
  const socPage = (pages.pages || []).find((p) => p.pageId === "4914:113562");
  check(
    "pages.json still records the Social page id 4914:113562",
    !!socPage,
    "the Social page entry is gone from pages.json",
  );
}

// ── 6. the harvest files agree with each other ─────────────────────────────
{
  const dupes = [];
  const mismatch = [];
  for (const s of Object.keys(stats.bySection || {})) {
    const ids = readLines(`${s}.nodes.txt`);
    if (new Set(ids).size !== ids.length) {
      const seen = new Set();
      const d = ids.filter((i) => (seen.has(i) ? true : (seen.add(i), false)));
      dupes.push(`${s}: ${[...new Set(d)].join(",")}`);
    }
    const titleIds = readLines(`${s}.titles.tsv`)
      .map((l) => l.slice(0, l.indexOf("\t")).trim())
      .filter(Boolean);
    if (!titleIds.length) continue; // a section may legitimately have no titles harvest yet
    const idSet = new Set(ids);
    const orphan = titleIds.filter((i) => !idSet.has(i));
    if (!orphan.length) continue;
    // Name the failure mode rather than just the count. The one live instance is
    // a TRUNCATION: the row is `<id-minus-last-char>\t<full-id>`, i.e. the id
    // column lost a character and the title column holds a node-id instead of a
    // frame name. That shape is worth calling out because the file still parses,
    // still has plausible row count, and quietly yields title:null on every row.
    const rows = readLines(`${s}.titles.tsv`).map((l) => [
      l.slice(0, l.indexOf("\t")).trim(),
      l.slice(l.indexOf("\t") + 1).trim(),
    ]);
    const truncated = rows.filter(([id, t]) => /^\d+-\d+$/.test(t) && t.startsWith(id) && t.length > id.length);
    mismatch.push(
      `${s}: ${orphan.length} of ${titleIds.length} titles.tsv id(s) are absent from ` +
        `nodes.txt (${orphan.slice(0, 3).join(",")}…), so only ${titleIds.length - orphan.length} ` +
        `of ${ids.length} catalogued ids can ever receive a title` +
        (truncated.length
          ? `. ${truncated.length} row(s) are TRUNCATED — the title column holds a node-id that ` +
            `starts with the (short) id column, e.g. "${truncated[0][0]}" -> "${truncated[0][1]}". ` +
            `The section needs a re-harvest, not a patch.`
          : ""),
    );
  }
  check("no <section>.nodes.txt contains a duplicate id", dupes.length === 0, dupes.join("; "));
  check("every <section>.titles.tsv id is listed in its .nodes.txt", mismatch.length === 0, mismatch.join("; "));
}

// ── report ────────────────────────────────────────────────────────────────
for (const name of ok) console.log(`  ok    ${name}`);
if (failures.length) {
  console.error(`\n${failures.length} of ${ok.length + failures.length} invariant(s) BROKEN:\n`);
  for (const f of failures) console.error(`  FAIL  ${f}\n`);
  process.exit(1);
}
console.log(`\nall ${ok.length} catalog-count invariants hold.`);
