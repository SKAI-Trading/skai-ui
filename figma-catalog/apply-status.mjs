#!/usr/bin/env node
/**
 * apply-status.mjs — fold figma-catalog/status.<section>.tsv (family-level
 * verified statuses) back into registry.json at the FRAME level.
 *
 * Each status line: family <TAB> status <TAB> primaryFile <TAB> route <TAB> reason [<TAB> bp]
 * Every screen frame in that section/family gets status/route/notes set, and
 * implFiles gets primaryFile added. Non-screen frames are left as-is.
 *
 * Column 6 (`bp`, OPTIONAL) carries the per-breakpoint verdicts — see bp.mjs
 * for the grammar and SCHEMA.md for the semantics. It is folded down two ways:
 *   - per frame:  `bpStatus` = the verdict at THAT frame's own device
 *   - per family: `registry.breakpoints["<section>/<family>"]`, which also
 *                 carries the DERIVED design-frame counts per width
 * An absent column 6 means `unknown` at all three widths and NEVER inherits
 * column 2 — see the header comment in bp.mjs for why that matters.
 *
 * Usage: node figma-catalog/apply-status.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  BP_KEYS,
  bpUnknown,
  deriveDesign,
  parseBpCell,
  splitStatusLine,
  worstVerdict,
} from "./bp.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const regPath = path.join(DIR, "registry.json");
const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
// DISCOVER the sections from the status files actually on disk, rather than a
// hardcoded list. The old literal was
//   ["home","wallet","trade","predict","play","dice","pwa","crash"]
// which had drifted behind build-registry.mjs's SECTIONS: it omitted onboarding,
// legal, master-sheet, mines, blackjack, coinflip, skratch, missing-play-images
// and plinko. A status.<section>.tsv for any of those was **silently ignored** —
// no warning, the section just stayed `unknown`, which reads as "nobody audited
// it" when in fact someone had. Deriving the list means a new section's verdicts
// are picked up with no code edit and no second place to keep in sync.
const SECTIONS = fs
  .readdirSync(DIR)
  .map((f) => /^status\.(.+)\.tsv$/.exec(f))
  .filter(Boolean)
  .map((m) => m[1])
  .sort();
const VALID = new Set(["done", "partial", "not-started", "unknown"]);

// family key -> {status, primaryFile, route, reason, bp}
const statusByFam = {};
let loaded = 0;
// Column 6 is parsed STRICTLY and every complaint is collected, because the
// failure mode this whole dimension exists to prevent is a width verdict that
// looks recorded and is not. A malformed cell is refused, never downgraded to
// `unknown` — silently reading a typo as "nobody checked" would erase the one
// person who did.
const bpErrors = [];
for (const sec of SECTIONS) {
  const p = path.join(DIR, `status.${sec}.tsv`);
  if (!fs.existsSync(p)) continue;
  const lines = fs.readFileSync(p, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const row = splitStatusLine(line);
    if (!VALID.has(row.status)) continue;
    const where = `status.${sec}.tsv:${i + 1} [${row.family}]`;
    // A seventh field can only be a stray tab inside the reason prose — column 5
    // no longer absorbs the tail, so it would otherwise be misparsed as a bp cell.
    if (row.extra.length)
      bpErrors.push(`${where}: ${5 + 1 + row.extra.length} tab-separated fields; a reason must not contain a TAB`);
    const bp = parseBpCell(row.bpCell);
    for (const e of bp.errors) bpErrors.push(`${where}: ${e}`);
    statusByFam[`${sec}/${row.family}`] = {
      status: row.status,
      primaryFile: row.primaryFile,
      route: row.route,
      reason: row.reason,
      bp: bp.verdicts,
      bpAt: bp.at,
      bpSource: bp.source,
      bpPresent: bp.present,
    };
    loaded++;
  }
}

if (bpErrors.length) {
  console.error(`REFUSING TO WRITE registry.json — ${bpErrors.length} malformed status row(s):`);
  for (const e of bpErrors) console.error(`  ${e}`);
  console.error(
    "\nColumn 6 grammar: <width>=<verdict> [...] [@YYYY-MM-DD[/source-slug]]  (see bp.mjs / SCHEMA.md)",
  );
  process.exit(1);
}

// DESIGN axis: how many screen frames exist per family at each width. Derived,
// never typed — see deriveDesign() in bp.mjs.
const designByFam = deriveDesign(reg.frames);

let applied = 0;
const famCounts = {};
for (const f of Object.values(reg.frames)) {
  if (f.kind !== "screen") continue;
  const key = `${f.section}/${f.family}`;
  const s = statusByFam[key];
  // ★ Every screen frame gets a bpStatus, including frames whose family has no
  // status row. The default is "unknown", written EXPLICITLY rather than left
  // absent, so a consumer that reads the field cannot mistake "no opinion" for
  // "field not supported yet" and fall back to the width-less `status`.
  const verdicts = s ? s.bp : bpUnknown();
  // A frame whose title carried no parseable viewport has no width to answer
  // for. That is a title-grammar gap, not a responsive gap, and it stays unknown.
  f.bpStatus = BP_KEYS.includes(f.device) ? verdicts[f.device] : "unknown";
  if (!s) continue;
  f.status = s.status;
  if (s.route && s.route !== "-") f.route = s.route;
  if (s.reason) f.notes = s.reason;
  if (s.primaryFile && s.primaryFile !== "-" && !f.implFiles.includes(s.primaryFile))
    f.implFiles.push(s.primaryFile);
  applied++;
  famCounts[key] = s.status;
}

// Family-level breakpoint record. Both axes side by side, which is the point:
// `design.tablet === 0` with `tablet === "unknown"` is a DESIGN gap, while
// `design.mobile === 99` with `mobile === "unknown"` is an UNAUDITED surface.
// The old single `status` column could not distinguish those two at all.
reg.breakpoints = {};
for (const [key, s] of Object.entries(statusByFam)) {
  const design = designByFam[key] || null;
  reg.breakpoints[key] = {
    ...s.bp,
    worst: worstVerdict(s.bp),
    design, // null = this row matches no screen frame (an orphan row; bp-report.mjs lists them)
    designMissing: design ? BP_KEYS.filter((w) => design[w] === 0) : null,
    at: s.bpAt,
    source: s.bpSource,
  };
}

reg.generated = new Date().toISOString();
fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));

// summary
const bySecStatus = {};
for (const f of Object.values(reg.frames)) {
  if (f.kind !== "screen") continue;
  const b = (bySecStatus[f.section] = bySecStatus[f.section] || {});
  b[f.status] = (b[f.status] || 0) + 1;
}
const famStatus = {};
for (const st of Object.values(famCounts)) famStatus[st] = (famStatus[st] || 0) + 1;
console.log(`status lines loaded: ${loaded}; frames updated: ${applied}`);
console.log("families by status:", JSON.stringify(famStatus));

// Breakpoint coverage, printed on every run so the gap cannot go back to being
// invisible. `node bp-report.mjs` is the detailed view.
{
  const rows = Object.values(reg.breakpoints);
  const perWidth = {};
  for (const w of BP_KEYS) {
    const c = {};
    for (const r of rows) c[r[w]] = (c[r[w]] || 0) + 1;
    perWidth[w] = c;
  }
  const audited = rows.filter((r) => BP_KEYS.some((w) => r[w] !== "unknown")).length;
  console.log(
    `breakpoint coverage: ${audited}/${rows.length} rows carry a verdict at ≥1 width ` +
      `(${Math.round((audited / rows.length) * 100)}%)`,
  );
  console.log("rows by width/verdict:", JSON.stringify(perWidth));
}
console.log("screen frames by section/status:", JSON.stringify(bySecStatus, null, 2));
