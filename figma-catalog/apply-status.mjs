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
  isSkippableStatusLine,
  normaliseStatus,
  parseBpCell,
  parseRowKey,
  resolveSection,
  SECTION_FILE_ALIASES,
  splitStatusLine,
  STATUS_VALID,
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
// Each entry is {stem, section}: the FILE it came from, and the REAL registry
// section its rows apply to.
//
// ⚠️ The section used to be the stem itself. That is correct for
// `status.social.tsv` and wrong for every parallel-lane file: lanes were told to
// write `status.wave2.<lane>.tsv` so ten concurrent agents could not clobber one
// file, and `wave2.social-a` is not a section — so **1,458 of 2,140 rows applied
// to zero frames**. `resolveSection` maps them; a file it cannot resolve is
// REPORTED, never silently skipped.
const REAL_SECTIONS = new Set(Object.values(reg.frames).map((f) => f.section));
/** Rows that name neither a node id nor a resolvable section — reported, never guessed. */
const unaddressable = [];
/** Section-level rollup rows, kept for their reasoning and deliberately NOT applied to frames. */
const rollupBySection = {};
const SECTIONS = fs
  .readdirSync(DIR)
  .map((f) => /^status\.(.+)\.tsv$/.exec(f))
  .filter(Boolean)
  .map((m) => {
    const stem = m[1];
    const section = resolveSection(stem, REAL_SECTIONS);
    return { stem, section };
  })
  /*
    ⚠️ THERE USED TO BE A `.filter((s) => s.section !== null)` HERE, AND IT WAS
    THE SAME BUG A FOURTH TIME — the worst-behaved instance of it, because the
    alias map made it SILENT.

    A file resolving to no section was dropped whole. Files listed in
    SECTION_FILE_ALIASES with a `null` value were dropped too, and because
    `SECTION_FILE_ALIASES.has(stem)` was true they were also excluded from the
    warning below. So declaring a file "cross-cutting by design" — the documented
    thing to do — was what guaranteed nobody would ever be told its rows applied
    to nothing.

    Measured 2026-08-26, before this change: 988 addressable rows were being
    discarded, among them ALL 500 rows of `status.wave3.verify-games.tsv` and all
    195 of `status.wave3.v1-supersession.tsv`. Both key by bare node id, so every
    one of them could have been applied without knowing the file's section at all.

    ★ The section is a FALLBACK for addressing a row, not a precondition for
    reading the file. Sections are kept even when null; `parseRowKey` decides per
    row whether it can be addressed, and a row that genuinely cannot be is
    reported by file and line rather than dropped with its 3,943 neighbours.
  */
  .sort((a, b) => a.stem.localeCompare(b.stem));
// ⚠️ THIS SET HAD THE EXACT BUG THE COMMENT ABOVE DESCRIBES, one line later.
//
// It was ["done","partial","not-started","unknown"], and the loop below did
// `if (!VALID.has(row.status)) continue;` — a SILENT skip. Measured 2026-08-26:
// 140 of 1,931 rows (7%) were being dropped on the floor, including ALL 103
// `blocked-on-backend` verdicts — which are the most carefully reasoned rows in
// the catalog, each naming the exact missing relation behind a surface.
//
// The lanes wrote a verdict, the tool discarded it, and the section then read as
// though nobody had looked. Same failure this file's own header calls out, and
// the same one the bp-cell comment below refuses to allow for column 6: "a
// malformed cell is refused, never downgraded to `unknown` — silently reading a
// typo as 'nobody checked' would erase the one person who did." Column 6 got
// that discipline; column 2 did not.
//
// Statuses, and what each one MEANS (Casey's ruling 2026-08-26):
//   done               measured parity — geometry, type and colour checked off
//                      node data against the rendered DOM at the frame's width.
//                      NOT "nobody spotted a difference": that weaker reading is
//                      how two `done` rows went stale against node sets that had
//                      since grown.
//   partial            implemented, measured work remaining
//   not-started        no implementing code
//   blocked-on-backend built or buildable, but no source exists; the row names
//                      the exact missing relation or endpoint
//   frame-defect       THE FRAME IS WRONG and the code is right. Matching it
//                      would ship the bug — e.g. a paytable printing 60x where
//                      the rail pays 50x. Design owns the redraw; engineering
//                      is finished. Distinct from `done` so it stays visible.
//   furniture          not spec at all: Directory banners, Breakpoint rulers,
//                      loose rectangles, FigJam stickies. Recorded so nobody
//                      re-discovers them, EXCLUDED from the parity denominator.
//   unknown            nobody has looked
// The set and its legacy aliases live in bp.mjs (STATUS_VALID / normaliseStatus).
// They were briefly duplicated here, which is precisely the shape that caused
// this bug: two copies of the vocabulary, one of them silently discarding 7% of
// every lane's rows. One definition, imported by both readers.

// family key -> {status, primaryFile, route, reason, bp}
const statusByFam = {};
// Node-id-keyed verdicts, from rows whose column 1 reads `<title> [node-id]`.
// See the comment at the assignment site for why both keyings must coexist.
const statusById = {};
let loaded = 0;
// Column 6 is parsed STRICTLY and every complaint is collected, because the
// failure mode this whole dimension exists to prevent is a width verdict that
// looks recorded and is not. A malformed cell is refused, never downgraded to
// `unknown` — silently reading a typo as "nobody checked" would erase the one
// person who did.
const bpErrors = [];
for (const { stem, section: sec } of SECTIONS) {
  const p = path.join(DIR, `status.${stem}.tsv`);
  if (!fs.existsSync(p)) continue;
  const lines = fs.readFileSync(p, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    // `#` comment lines are a real convention in these files (several carry long
    // explanatory headers). They were previously absorbed by the silent status
    // skip; now that an unrecognised status is a loud error, they have to be
    // excluded explicitly or every header line reports as a typo.
    if (line.trimStart().startsWith("#")) continue;
    const row = splitStatusLine(line);
    const where = `status.${stem}.tsv:${i + 1} [${row.family}]`;
    // Map a known legacy spelling, then REFUSE anything still unrecognised —
    // loudly, into the same error channel the bp cell uses. A silent `continue`
    // here is what discarded 140 rows; an unknown status is now a typo someone
    // has to fix, not a verdict that quietly evaporates.
    const canonical = normaliseStatus(row.status);
    if (canonical === null) {
      bpErrors.push(
        `${where}: unrecognised status "${row.status}" — must be one of ${[...STATUS_VALID].join(", ")}`,
      );
      continue;
    }
    row.status = canonical;
    // A seventh field can only be a stray tab inside the reason prose — column 5
    // no longer absorbs the tail, so it would otherwise be misparsed as a bp cell.
    if (row.extra.length)
      bpErrors.push(`${where}: ${5 + 1 + row.extra.length} tab-separated fields; a reason must not contain a TAB`);
    const bp = parseBpCell(row.bpCell);
    for (const e of bp.errors) bpErrors.push(`${where}: ${e}`);
    const verdict = {
      status: row.status,
      primaryFile: row.primaryFile,
      route: row.route,
      reason: row.reason,
      bp: bp.verdicts,
      bpAt: bp.at,
      bpSource: bp.source,
      bpPresent: bp.present,
    };

    /*
      ── Column 1 carries a NODE ID on parallel-lane files ──────────────────
      Legacy rows key by family name ("welcome"). Every lane file from the
      2026-08 waves keys by `<title> [node-id]` — "Directory [4914-113563]" —
      because 14 titles repeat verbatim on a single page and a family key could
      not tell them apart.

      Matching on family alone meant those rows hit nothing: the section fix
      that made them loadable was necessary and NOT sufficient, and
      `frames updated` stayed at 1377 while 1,458 rows were "loaded".

      An id match is also strictly better than a family match — `registry.frames`
      is keyed by node id, so it addresses ONE frame instead of every frame
      sharing a screen name.

      ⚠️ AND THE BRACKET FORM IS NOT THE ONLY SELF-ADDRESSING ONE. This regex
      required brackets, so `status.wave3.verify-games.tsv` (500 rows keyed by a
      BARE `9178:14731`) and `status.wave4.games-radius.tsv` (10 rows keyed
      `play/blackjack-detail`) fell through to the family branch and were filed
      under a section they did not belong to — or, for a section-less file,
      dropped outright. `parseRowKey` in bp.mjs handles all three forms and is
      shared with bp-report.mjs so a fifth copy cannot drift.
    */
    const addr = parseRowKey(row.family, sec, REAL_SECTIONS);
    if (addr === null) {
      // Only reachable for a BARE family name in a file with no resolvable
      // section — the one shape that genuinely cannot be addressed. Reported
      // with file and line, never guessed at: attaching a measured verdict to
      // frames nobody looked at is worse than dropping it, and much harder to
      // notice later.
      unaddressable.push(where);
      continue;
    }
    if (addr.kind === "id") statusById[addr.nodeId] = verdict;
    // A section rollup is KEPT but not applied — see the Form D note in bp.mjs.
    // It lands in registry.rollups so the reasoning survives, without any frame
    // inheriting a verdict nobody measured at that frame's width.
    else if (addr.kind === "section") rollupBySection[addr.section] = { ...verdict, from: where };
    else statusByFam[`${addr.section}/${addr.family}`] = verdict;
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
let appliedById = 0;
const famCounts = {};
for (const [regKey, f] of Object.entries(reg.frames)) {
  if (f.kind !== "screen") continue;
  const key = `${f.section}/${f.family}`;
  // An id-keyed row wins over a family-keyed one: it names THIS frame, where a
  // family row names every frame sharing the screen name. `registry.frames` is
  // keyed by bare node id for the primary file and `<fileKey>:<node>` for
  // secondary files, so try the bare node too.
  const bareNode = f.node ?? (regKey.includes(":") ? regKey.slice(regKey.indexOf(":") + 1) : regKey);
  const byId = statusById[String(bareNode).replace(":", "-")];
  const s = byId ?? statusByFam[key];
  if (byId) appliedById++;
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

// Section rollups: one row standing for a whole game/section. Stored under their
// own key so no consumer can mistake them for per-frame parity — the `status`
// here is an assessment of the SECTION, and the frames inside it keep whatever
// they were individually measured at (usually `unknown`).
reg.rollups = rollupBySection;

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
console.log(
  `status lines loaded: ${loaded}; frames updated: ${applied} (${appliedById} matched by node id, ${applied - appliedById} by family)`,
);
// Rows that named a node id no frame carries. Loud, because this is the shape
// that let 1,458 rows read as recorded while applying to nothing.
const unmatchedIds = Object.keys(statusById).filter(
  (id) => !Object.values(reg.frames).some((f) => String(f.node ?? "").replace(":", "-") === id),
);
if (unmatchedIds.length) {
  console.log(
    `\n⚠️  ${unmatchedIds.length} id-keyed row(s) name a node no registry frame carries (stale id, nested child, or a frame the harvest never saw).`,
  );
}
// A row that names neither a node id nor a resolvable section applies to ZERO
// frames. This warning is now per ROW rather than per FILE: a section-less file
// is fine as long as its rows address themselves, and 988 rows that did were
// being thrown away with the ~100 that did not. Reported every run, with the
// line number, because "cross-cutting by design" used to suppress the message
// entirely and that is how the largest loss went unnoticed for three waves.
if (unaddressable.length) {
  console.log(
    `\n⚠️  ${unaddressable.length} row(s) name neither a node id nor a resolvable section, so they apply to zero frames:`,
  );
  for (const w of unaddressable.slice(0, 25)) console.log(`      ${w}`);
  if (unaddressable.length > 25) console.log(`      … and ${unaddressable.length - 25} more`);
  console.log(
    `    Fix by keying the row to its node id ("Title [1234-5678]" or a bare "1234:5678"),`,
  );
  console.log(`    or to an explicit "<section>/<family>" pair, or by splitting the file per section.`);
}
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
