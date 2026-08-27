#!/usr/bin/env node
/**
 * bp-report.mjs — the breakpoint coverage report, and the validator for
 * column 6 of `status.<section>.tsv`.
 *
 * WHAT IT IS FOR
 * --------------
 * The single `status` column made a responsive gap invisible: measured
 * 2026-08-20, 223 of 262 `done` rows said nothing about any width, and six
 * sections mentioned a width on zero rows. A gap that no report can print is a
 * gap that never gets scheduled. This prints it.
 *
 * It reports two independent axes per row — see bp.mjs:
 *   DESIGN (derived from registry frame titles) — is there a frame at this width?
 *   CODE   (hand-authored, column 6)            — does the build work at this width?
 *
 * EXIT CODES
 *   0  everything parsed
 *   1  at least one malformed column-6 cell, or a reason column containing a TAB
 *
 * Usage:
 *   node figma-catalog/bp-report.mjs            # coverage summary
 *   node figma-catalog/bp-report.mjs --gaps     # + every actionable row
 *   node figma-catalog/bp-report.mjs --hygiene  # + orphan and duplicate rows
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  BP_KEYS,
  BP_VERDICTS,
  BP_WIDTHS,
  deriveDesign,
  isSkippableStatusLine,
  normaliseStatus,
  parseBpCell,
  parseRowKey,
  resolveSection,
  splitStatusLine,
} from "./bp.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const args = new Set(process.argv.slice(2));
// The status vocabulary now lives in bp.mjs. It was duplicated here, and the
// copy silently discarded 154 of 2,140 rows (7.2%) — including all 103
// `blocked-on-backend` verdicts — so this report's denominator was wrong and no
// verdict on those rows could ever surface. See bp.mjs STATUS_VALID.

const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
const design = deriveDesign(reg.frames);

// Sections that actually exist in the registry. A status file whose section
// name matches none of these applies to nothing — status.governance-account.tsv
// and status.governance-vaults.tsv are exactly that: 105 rows that apply-status
// loads, keys as `governance-account/…`, and then matches against zero frames,
// because the live section is `governance`. They are the merged file's two
// halves, kept for provenance. Summing the three files triple-counts.
const liveSections = new Set(Object.values(reg.frames).map((f) => f.section));

// node id → the section that frame really belongs to. An id-keyed row carries no
// section of its own, and a cross-cutting file has none to lend it, so without
// this index 972 id-keyed rows were filed under a pseudo-section named after
// their filename (`wave3.verify-games`, `wave4.row-conflicts`, …). The registry
// already knows the answer for every frame it holds.
const sectionByNode = new Map();
// And node id → `section/family`, because `design` (deriveDesign) is keyed that
// way. An id-keyed row has to borrow its frame's family to ask the design axis
// how many frames exist at each width; without this the design column reads
// 0/0/0 for every section whose rows key by id.
const designKeyByNode = new Map();
for (const f of Object.values(reg.frames)) {
  const id = String(f.node ?? "").replace(":", "-");
  if (!id) continue;
  sectionByNode.set(id, f.section);
  designKeyByNode.set(id, `${f.section}/${f.family}`);
}

const files = fs
  .readdirSync(DIR)
  .map((f) => /^status\.(.+)\.tsv$/.exec(f))
  .filter(Boolean)
  // The section is RESOLVED from the stem, not taken as the stem. Parallel-lane
  // files are named `status.wave2.<lane>.tsv` so ten agents cannot clobber one
  // file, and `wave2.social-a` is not a section — taking the stem literally is
  // what put 1,696 rows in "dead sections" here and 1,458 in apply-status.
  // A file that resolves to null is cross-cutting by declaration; it keeps its
  // stem so the report still lists it rather than dropping it silently.
  .map((m) => ({ file: m[0], section: resolveSection(m[1], liveSections) ?? m[1], stem: m[1] }))
  .sort((a, b) => a.section.localeCompare(b.section));

const errors = [];
const rows = [];
const dupes = [];
for (const { file, section } of files) {
  const lines = fs.readFileSync(path.join(DIR, file), "utf8").split("\n");
  const seen = new Map();
  for (let i = 0; i < lines.length; i++) {
    // Comments and blanks are skipped EXPLICITLY. They used to be skipped as a
    // side effect of the status whitelist, which is what made the silent
    // `continue` look deliberate while it also swallowed 7% of real verdicts.
    if (isSkippableStatusLine(lines[i])) continue;
    const r = splitStatusLine(lines[i]);
    const where = `${file}:${i + 1} [${r.family}]`;
    const canonical = normaliseStatus(r.status);
    if (canonical === null) {
      errors.push(`${where}: unrecognised status "${r.status}" — see bp.mjs STATUS_VALID`);
      continue;
    }
    r.status = canonical;
    if (r.extra.length)
      errors.push(`${where}: ${6 + r.extra.length} tab-separated fields; a reason must not contain a TAB`);
    const bp = parseBpCell(r.bpCell);
    for (const e of bp.errors) errors.push(`${where}: ${e}`);
    /*
      Resolve the row the SAME way apply-status does, rather than assuming the
      file's section. `parseRowKey` handles a bracketed id, a bare id and an
      explicit `<section>/<family>` pair, so the 1,026 rows this report used to
      file under invented sections named after their filename — `wave3.verify-
      games` and friends — now land in the real section they measured.

      Sharing the parser is the point. Every previous version of this bug was one
      file being fixed while its sibling kept a private copy of the rule, and
      this file has already been the sibling twice.
    */
    const addr = parseRowKey(r.family, section, liveSections);
    const rowSection =
      addr === null
        ? section
        : addr.kind === "id"
          ? (sectionByNode.get(addr.nodeId) ?? section)
          : addr.section;
    // Two keys, deliberately. `key` identifies the ROW for duplicate detection —
    // an id row must stay distinct from its siblings in the same family, or every
    // per-frame row in a family reads as a duplicate of the first. `designKey`
    // asks the design axis about the family, which is the unit design counts use.
    const key = addr && addr.kind === "id" ? `#${addr.nodeId}` : `${rowSection}/${r.family}`;
    const designKey =
      addr && addr.kind === "id" ? (designKeyByNode.get(addr.nodeId) ?? key) : key;
    if (seen.has(key)) dupes.push(`${where}: duplicate family key, also at ${file}:${seen.get(key)} — apply-status keeps the LAST one`);
    seen.set(key, i + 1);
    // `section: rowSection`, NOT the file's section — that is the whole point of
    // resolving the key above. `fileSection` is kept alongside it for provenance.
    rows.push({ file, fileSection: section, section: rowSection, key, designKey, line: i + 1, ...r, bp: bp.verdicts, at: bp.at, source: bp.source });
  }
}

if (errors.length) {
  console.error(`INVALID — ${errors.length} malformed row(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const applied = rows.filter((r) => liveSections.has(r.section));
const orphanSections = [...new Set(rows.filter((r) => !liveSections.has(r.section)).map((r) => r.section))];
const orphanRows = applied.filter((r) => !design[r.designKey]);

// ── summary ────────────────────────────────────────────────────────────────
console.log(`Breakpoints: ${BP_KEYS.map((k) => `${k} ${BP_WIDTHS[k]}px`).join(" · ")}`);
console.log(
  `Rows: ${rows.length} across ${files.length} status files; ${applied.length} in a live registry section` +
    (orphanSections.length ? `; ${rows.length - applied.length} in dead sections (${orphanSections.join(", ")})` : ""),
);
console.log("");

const pad = (s, n) => String(s).padEnd(n);
const hdr = `${pad("section", 22)}${pad("rows", 6)}${pad("design D/T/M", 16)}${BP_KEYS.map((k) => pad(k, 26)).join("")}`;
console.log(hdr);
console.log("-".repeat(hdr.length));

const totals = { rows: 0, byWidth: Object.fromEntries(BP_KEYS.map((k) => [k, {}])) };
// Iterate SECTIONS, not files. Iterating files printed one line per file and
// labelled each with its resolved section, so `governance` — which has three
// files (governance, governance-account, governance-vaults) all resolving to the
// one live section — printed three identical 228-row lines. Read down the column
// that is 684 rows of governance work where there are 228. The file list is
// provenance; the section is the unit the report is about.
for (const section of [...new Set(rows.map((r) => r.section))].sort()) {
  const secRows = rows.filter((r) => r.section === section);
  if (!secRows.length) continue;
  const d = { desktop: 0, tablet: 0, mobile: 0 };
  // ONCE PER FAMILY, not once per row. `design` counts the frames in a family,
  // so summing it per row multiplies it by however many rows that family has —
  // and now that id-keyed rows resolve into their real sections, a family can
  // carry dozens. It read as blackjack having 138 desktop frames where it has 6.
  for (const dk of new Set(secRows.map((r) => r.designKey))) {
    const g = design[dk];
    if (!g) continue;
    for (const k of BP_KEYS) d[k] += g[k];
  }
  const cells = BP_KEYS.map((k) => {
    const c = {};
    for (const r of secRows) c[r.bp[k]] = (c[r.bp[k]] || 0) + 1;
    for (const [v, n] of Object.entries(c)) totals.byWidth[k][v] = (totals.byWidth[k][v] || 0) + n;
    const known = Object.entries(c).filter(([v]) => v !== "unknown");
    return pad(known.length ? known.map(([v, n]) => `${n} ${v}`).join(", ") : `— (${c.unknown} unknown)`, 26);
  });
  totals.rows += secRows.length;
  const live = liveSections.has(section) ? "" : " ‡";
  console.log(`${pad(section + live, 22)}${pad(secRows.length, 6)}${pad(`${d.desktop}/${d.tablet}/${d.mobile}`, 16)}${cells.join("")}`);
}
if (orphanSections.length) console.log("\n‡ = no such section in registry.json; these rows apply to zero frames.");

const audited = rows.filter((r) => BP_KEYS.some((k) => r.bp[k] !== "unknown")).length;
console.log("");
console.log(`COVERAGE: ${audited}/${rows.length} rows (${Math.round((audited / rows.length) * 100)}%) carry a verdict at ≥1 width.`);
for (const k of BP_KEYS) {
  const c = totals.byWidth[k];
  const known = Object.entries(c).filter(([v]) => v !== "unknown").sort((a, b) => b[1] - a[1]);
  const kn = known.reduce((a, [, n]) => a + n, 0);
  console.log(`  ${pad(k, 8)} ${pad(`${kn}/${rows.length}`, 10)} ${known.map(([v, n]) => `${n} ${v}`).join(", ") || "nothing measured"}`);
}

// ── design gaps (derived, trustworthy in the ZERO direction only) ───────────
const missingByWidth = Object.fromEntries(BP_KEYS.map((k) => [k, []]));
for (const r of applied) {
  const g = design[r.key];
  if (!g) continue;
  for (const k of BP_KEYS) if (g[k] === 0) missingByWidth[k].push(r.key);
}
console.log("");
console.log("DESIGN GAPS (no Figma frame at that width — derived from frame titles, see bp.mjs):");
for (const k of BP_KEYS) {
  const list = missingByWidth[k];
  const bySec = {};
  for (const key of list) bySec[key.split("/")[0]] = (bySec[key.split("/")[0]] || 0) + 1;
  const top = Object.entries(bySec).sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(`  ${pad(k, 8)} ${pad(list.length + " rows", 12)} ${top.map(([s, n]) => `${s}:${n}`).join(" ")}`);
}

// ── actionable ─────────────────────────────────────────────────────────────
const bad = applied.filter((r) => BP_KEYS.some((k) => r.bp[k] === "broken" || r.bp[k] === "missing"));
console.log("");
console.log(`ACTIONABLE: ${bad.length} row(s) recorded broken or missing at some width.`);
if (args.has("--gaps")) {
  for (const r of bad) {
    const at = BP_KEYS.filter((k) => r.bp[k] === "broken" || r.bp[k] === "missing").map((k) => `${k}=${r.bp[k]}`);
    console.log(`  ${pad(r.key, 44)} ${at.join(" ")}${r.at ? `  @${r.at}${r.source ? "/" + r.source : ""}` : ""}`);
  }
}

if (args.has("--hygiene")) {
  console.log("");
  console.log(`HYGIENE — ${orphanRows.length} row(s) match no screen frame (stale family name, or a section that lost its rows):`);
  for (const r of orphanRows.slice(0, 40)) console.log(`  ${r.file}:${r.line}  ${r.key}`);
  if (orphanRows.length > 40) console.log(`  … and ${orphanRows.length - 40} more`);
  console.log("");
  console.log(`HYGIENE — ${dupes.length} duplicate family key(s); apply-status keeps only the last:`);
  for (const d of dupes.slice(0, 40)) console.log(`  ${d}`);
  if (dupes.length > 40) console.log(`  … and ${dupes.length - 40} more`);
}

if (!args.has("--gaps") || !args.has("--hygiene")) {
  console.log("");
  console.log("(--gaps lists every actionable row; --hygiene lists orphan and duplicate rows)");
}
console.log("");
console.log("Verdicts:", Object.keys(BP_VERDICTS).join(" | "), "— see SCHEMA.md § Breakpoint dimension");
