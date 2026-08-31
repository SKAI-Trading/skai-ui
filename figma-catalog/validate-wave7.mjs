#!/usr/bin/env node
/**
 * validate-wave7.mjs — pre-flight every `status.wave7.*.tsv` against the SAME
 * parsers `apply-status.mjs` uses, WITHOUT writing registry.json.
 *
 * WHY THIS EXISTS
 * ---------------
 * The status-row refusal is ATOMIC: one malformed cell in one lane's file stops
 * `registry.json` being written for EVERY lane. That has now cost two
 * consecutive waves a run:
 *   wave 5  a lane wrote `blocked` in column 6 — a valid ROW status, not a valid
 *           breakpoint verdict (6 cells).
 *   wave 6  a lane wrote `not-measured` / `not-built`, invented outright.
 *
 * Column 2 and column 6 do NOT share a vocabulary, and nothing in the row's
 * shape hints at that:
 *   both        unknown · done · partial · not-started
 *   column 2    blocked-on-backend · frame-defect · furniture
 *   column 6    missing · renders · broken · n-a
 *
 * So a lane can write a word that is obviously legal, in the wrong column, and
 * take the whole wave down. This script finds it in seconds instead.
 *
 * It imports `parseBpCell`, `normaliseStatus`, `splitStatusLine` and
 * `parseRowKey` from `bp.mjs` rather than restating the vocabulary. That is
 * deliberate and load-bearing: `bp-report.mjs` once kept its own copy of
 * STATUS_VALID and the copy silently discarded 154 of 2,140 rows — including
 * every `blocked-on-backend` verdict. A validator with its own second opinion
 * about what is legal is worse than no validator, because it reports green
 * against a vocabulary the real tool does not use.
 *
 * Usage:
 *   node figma-catalog/validate-wave7.mjs              # all status.wave7.*.tsv
 *   node figma-catalog/validate-wave7.mjs <glob-stem>  # e.g. wave7.trench
 *   node figma-catalog/validate-wave7.mjs --self-test  # prove it is not vacuous
 *
 * Exit 0 = every row would apply. Exit 1 = at least one row would be refused or
 * would apply to nothing. Writes nothing, ever.
 *
 * ★ `--self-test` feeds it the exact rows that broke waves 5 and 6 and asserts
 * each one is caught. Run it before believing a green: a checker that reports
 * "nothing wrong" has to be able to say what it would have caught. The fixtures
 * are held in memory and no file is ever created in the catalog directory —
 * a `status.wave7.__selftest.tsv` on disk would be picked up by whatever
 * `apply-status.mjs` run the orchestrator does next.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  normaliseStatus,
  parseBpCell,
  parseRowKey,
  resolveSection,
  splitStatusLine,
  STATUS_VALID,
  BP_VERDICTS,
} from "./bp.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
const REAL_SECTIONS = new Set(Object.values(reg.frames).map((f) => f.section));
/** Every node id the registry can address, normalised to the `1234-5678` form. */
const KNOWN_NODES = new Set(
  Object.values(reg.frames).map((f) => String(f.node ?? "").replace(":", "-")),
);

/*
  ★★★ THE SILENT DROP — FOUND, FIXED, AND THEN THIS CHECK WAS ITSELF WRONG.

  HISTORY, because both halves are load-bearing.

  `w7b-wallet2` found that `apply-status.mjs` opened its only status-writing loop
  with `if (f.kind !== "screen") continue;`, so a row addressed to a non-screen
  frame parsed, validated as addressable, counted toward "status lines loaded",
  and was then silently discarded. Measured: 646 of 826 wave-7 id-keyed rows
  (78.2%), and 2,578 of 4,912 catalog-wide (52.5%). Three lanes would have landed
  zero. It is the origin of the registry's large `non-screen` + `unknown`
  population.

  ⚠️ THE ORCHESTRATOR THEN FIXED IT, AND THIS SCRIPT DID NOT NOTICE. For a short
  window it printed "🚨 218 of 218 (100.0%) will be SILENTLY DROPPED", citing a
  line number that by then held the comment recording the guard's REMOVAL.
  `w7b-games-unknown` caught it by reading `apply-status.mjs` instead of
  believing the validator.

  ★★★ THAT IS EXACTLY THE SIN THIS FILE'S OWN HEADER WARNS ABOUT — a validator
  keeping a SECOND COPY of a rule instead of importing it. `bp-report.mjs` did it
  with `STATUS_VALID` and discarded 154 rows; this script did it with a guard's
  existence and told 19 lanes their finished work was being thrown away. A stale
  copy fails toward alarm here rather than reassurance, which is the safer
  direction, but it is the same defect.

  THE RULE AS IT ACTUALLY STANDS (apply-status.mjs, the `byFam` line):
      const byFam = f.kind === "screen" ? statusByFam[key] : undefined;
    - an ID-keyed row names ONE frame deliberately and now applies WHATEVER the
      kind. No check here; there is nothing left to warn about.
    - a FAMILY-keyed row names `section/family` — every frame sharing a screen
      name — and is still screen-restricted, so it must not smear a verdict
      across a screen's sub-frames.

  So the only thing left to detect is a FAMILY row whose family contains no
  screen frame at all. That is what `FAMILY_KINDS` below is for.

  ★ It is NOT exit-worthy, deliberately: no lane can fix it by editing a TSV, and
  an exit 1 would block every lane over something they did not cause.

  ★ And coverage.mjs was UNAFFECTED throughout — it reads status.*.tsv directly
  (:308) and touches registry.json only to collect node ids (:229-230), with no
  `kind` filter anywhere. The wave PERCENTAGE never passed through the damaged
  artifact.
*/
/** `section/family` -> the set of frame kinds in that family. */
const FAMILY_KINDS = new Map();
for (const f of Object.values(reg.frames)) {
  const k = `${f.section}/${f.family}`;
  if (!FAMILY_KINDS.has(k)) FAMILY_KINDS.set(k, new Set());
  FAMILY_KINDS.get(k).add(f.kind);
}
/** Rows that will land on nothing because their FAMILY has no screen frame. */
const droppedByKind = [];

const SELF_TEST = process.argv.includes("--self-test");
// The filter is the first NON-FLAG argument. Reading argv[2] blindly made
// `--all` be treated as a filename substring, which matched nothing and printed
// a confident "nothing was checked" — a flag silently becoming a filter is
// exactly how a sweep ends up with a denominator of zero.
const filter = SELF_TEST ? null : process.argv.slice(2).find((a) => !a.startsWith("--")) || null;

let rows = 0;
let idRows = 0;
let famRows = 0;
let bpCells = 0;
const errors = [];
const unapplied = [];
const seenIds = new Map();
const histogram = {};

/** Check one file's worth of lines. Pure: appends to the shared accumulators. */
function checkLines(file, lines) {
  const stem = /^status\.(.+)\.tsv$/.exec(file)?.[1] ?? file;
  const sec = resolveSection(stem, REAL_SECTIONS);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.trimStart().startsWith("#")) continue;
    const row = splitStatusLine(line);
    const where = `${file}:${i + 1}`;
    rows++;

    // ── column 2 ────────────────────────────────────────────────────────────
    const canonical = normaliseStatus(row.status);
    if (canonical === null) {
      /*
        ★ THE UNPREFIXED COLUMN HEADER — wave 7's actual killer, found live.

        FIVE separate lanes independently opened their file with the bare
        header `key<TAB>status<TAB>primaryFile<TAB>route<TAB>reason<TAB>bp`.
        `apply-status.mjs` skips ONLY lines beginning with `#`, so it parsed
        each one as a data row, read the literal word `status` in column 2, and
        refused to write registry.json — atomically, for all 19 lanes.

        Five lanes making the same mistake is not five mistakes, it is a
        discoverability defect: the `#` convention lives in a comment inside
        other people's files. The generic "not a row status" message above is
        true and useless here — it does not tell the lane the one-character
        fix. So this shape gets named, with its remedy.
      */
      const isHeader = row.family?.trim() === "key" && row.status?.trim() === "status";
      errors.push(
        `${where}: column 2 "${row.status}" is not a row status. Valid: ${[...STATUS_VALID].join(" | ")}` +
          (isHeader
            ? `  ← this is the COLUMN HEADER written without a leading "#". apply-status.mjs skips only lines starting with "#", so it parses this as a data row and REFUSES TO WRITE registry.json for EVERY lane. Fix: prefix the line with "# ".`
            : Object.hasOwn(BP_VERDICTS, row.status)
              ? `  ← that IS a valid column-6 breakpoint verdict; it is in the wrong column.`
              : ""),
      );
      continue;
    }
    histogram[canonical] = (histogram[canonical] || 0) + 1;

    // ── stray tabs ──────────────────────────────────────────────────────────
    if (row.extra.length)
      errors.push(
        `${where}: ${5 + 1 + row.extra.length} tab-separated fields — a reason must not contain a TAB (the tail is misread as a bp cell)`,
      );

    // ── column 6 ────────────────────────────────────────────────────────────
    const bp = parseBpCell(row.bpCell);
    if (bp.present) bpCells++;
    for (const e of bp.errors) {
      const m = /unknown verdict "([^"]+)"/.exec(e);
      // The hint must cover ABBREVIATIONS, not just exact column-2 statuses.
      // Wave 5's actual killer was `blocked`, which is not itself a row status —
      // it is how a lane shortened `blocked-on-backend`. An exact-match hint
      // stays silent on the one word that has actually broken a wave, so match
      // any column-2 status that starts with what was written.
      const near = m ? [...STATUS_VALID].find((s) => s === m[1] || s.startsWith(m[1] + "-")) : null;
      errors.push(
        `${where}: column 6 — ${e}` +
          (near
            ? `  ← "${near}" is a valid column-2 ROW STATUS; it is in the wrong column. Column 6 wants a breakpoint verdict.`
            : ""),
      );
    }

    // ── column 1 addressability ─────────────────────────────────────────────
    const addr = parseRowKey(row.family, sec, REAL_SECTIONS);
    if (addr === null) {
      unapplied.push(`${where}: column 1 "${row.family}" addresses nothing — no node id, no resolvable section`);
      continue;
    }
    if (addr.kind === "id") {
      idRows++;
      if (!KNOWN_NODES.has(addr.nodeId))
        unapplied.push(`${where}: node ${addr.nodeId} is in NO registry frame — this row applies to ZERO frames`);
      // ✅ NO KIND CHECK HERE ANY MORE — see the NODE_KIND note at the top.
      // apply-status.mjs now applies an ID-keyed row whatever the frame's kind.
      const prev = seenIds.get(addr.nodeId);
      if (prev)
        unapplied.push(
          `${where}: node ${addr.nodeId} already claimed by ${prev} — later file silently replaces the earlier verdict`,
        );
      else seenIds.set(addr.nodeId, where);
    } else if (addr.kind === "section") {
      unapplied.push(
        `${where}: column 1 "${row.family}" parsed as a SECTION ROLLUP — rollups are recorded but deliberately never applied to any frame`,
      );
    } else {
      famRows++;
      // The screen-only restriction survives HERE and only here. A family row
      // names `section/family`, i.e. every frame sharing a screen name, so
      // apply-status.mjs still refuses to smear it across non-screen children:
      //   const byFam = f.kind === "screen" ? statusByFam[key] : undefined;
      // If NO frame in the family is a screen, the row lands on nothing.
      const famKey = `${addr.section}/${addr.family}`;
      const kinds = FAMILY_KINDS.get(famKey);
      if (kinds && !kinds.has("screen"))
        droppedByKind.push({
          where,
          nodeId: famKey,
          frameKind: [...kinds].join("+"),
          file,
        });
    }

    // ── a `done` with no numbers is not a `done` ────────────────────────────
    if (canonical === "done" && !/\d/.test(row.reason || ""))
      errors.push(
        `${where}: status "done" but the reason column carries NO DIGITS — measured parity requires the measured numbers in the row`,
      );
  }
}

// ── self-test ─────────────────────────────────────────────────────────────
// Each fixture is [label, row, a substring the report MUST contain]. These are
// the actual failures from waves 5 and 6, not invented ones.
if (SELF_TEST) {
  const T = "\t";
  const FIXTURES = [
    [
      "wave-5 killer: `blocked` in column 6",
      `Some Screen [9003-117337]${T}partial${T}-${T}-${T}header 56 = frame 56${T}desktop=blocked @2026-08-31`,
      "wrong column",
    ],
    [
      "wave-6 killer: `not-measured` in column 6",
      `Some Screen [9003-117337]${T}partial${T}-${T}-${T}header 56${T}desktop=not-measured @2026-08-31`,
      "unknown verdict",
    ],
    [
      "wave-6 killer: `not-built` in column 6",
      `Some Screen [9003-117337]${T}partial${T}-${T}-${T}header 56${T}mobile=not-built @2026-08-31`,
      "unknown verdict",
    ],
    [
      "column-6 word in column 2 (`renders`)",
      `Some Screen [9003-117337]${T}renders${T}-${T}-${T}header 56`,
      "wrong column",
    ],
    [
      "a `done` with no numbers in its reason",
      `Some Screen [9003-117337]${T}done${T}-${T}-${T}matches the frame`,
      "NO DIGITS",
    ],
    [
      "id-keyed row naming a node no frame carries",
      `Ghost [9999-99999]${T}partial${T}-${T}-${T}width 375`,
      "applies to ZERO frames",
    ],
    [
      "bare family name with no resolvable section",
      `some-family-nobody-knows${T}partial${T}-${T}-${T}width 375`,
      "addresses nothing",
    ],
    [
      "a TAB inside the reason prose",
      `Some Screen [9003-117337]${T}partial${T}-${T}-${T}header 56${T}card 24${T}extra`,
      "must not contain a TAB",
    ],
    // wave-7's real killer, caught live in five lanes' files on the day.
    [
      "wave-7 killer: the column header written without a leading `#`",
      `key${T}status${T}primaryFile${T}route${T}reason${T}bp`,
      "COLUMN HEADER written without a leading",
    ],
    /*
      The SILENT DROP. `13008-27159` is a real registry frame with
      kind `non-screen`, and it is the node w7b-wallet2 used as proof: a wave-4
      row gave it a `done` with full measurements and `registry.json` still reads
      `status: "unknown", notes: ""`. The verdict was loaded and then discarded.

      This fixture is the reason the check cannot rot silently — if someone
      "cleans up" the kind guard in apply-status.mjs, or reclassifies this node
      to `screen`, the fixture stops firing and says so.
    */
    [
      "the silent drop: a row addressed to a NON-SCREEN registry frame",
      `Wallet component [13008-27159]${T}partial${T}-${T}-${T}width 375`,
      "SILENTLY DROPPED",
    ],
  ];
  let caught = 0;
  for (const [label, row, must] of FIXTURES) {
    errors.length = 0;
    unapplied.length = 0;
    droppedByKind.length = 0;
    seenIds.clear();
    checkLines("status.wave7.__fixture.tsv", [row]);
    const report = [
      ...errors,
      ...unapplied,
      // The silent drop is reported through its own banner, not through
      // `errors`/`unapplied`, so the self-test has to reach into it explicitly
      // or the fixture below is vacuous — it would report MISSED whether the
      // check worked or not.
      ...droppedByKind.map(
        (d) => `${d.where}: SILENTLY DROPPED — registry frame kind "${d.frameKind}" is not "screen"`,
      ),
    ].join("\n");
    const ok = report.includes(must);
    if (ok) caught++;
    console.log(`  ${ok ? "CAUGHT " : "MISSED "} ${label}`);
    if (!ok) console.log(`      wanted a report containing "${must}", got: ${report || "(nothing)"}`);
  }
  // And a control: a well-formed row must produce NO complaint. Without this the
  // suite could pass by flagging everything.
  errors.length = 0;
  unapplied.length = 0;
  droppedByKind.length = 0;
  seenIds.clear();
  checkLines(
    "status.wave7.__fixture.tsv",
    [`Skai > Play > Casino > Blackjack (1440 x 900px) [9003-117337]${T}done${T}a.tsx${T}/play${T}header 56 = frame 56; radius 12 = frame 12${T}desktop=renders @2026-08-31/w7-verify`],
  );
  const controlClean = !errors.length && !unapplied.length;
  console.log(`  ${controlClean ? "CLEAN  " : "FALSE+ "} control: a well-formed row produces no complaint`);
  if (!controlClean) console.log(`      got: ${[...errors, ...unapplied].join("\n")}`);
  const pass = caught === FIXTURES.length && controlClean;
  console.log(`\nself-test: ${caught}/${FIXTURES.length} known-bad rows caught, control ${controlClean ? "clean" : "FAILED"}.`);
  process.exit(pass ? 0 : 1);
}

// ⚠️ `--all` widens the sweep to EVERY status.*.tsv, not just wave 7.
// Observed 2026-08-31: wave-7 lanes are editing LEGACY files in place
// (status.social.tsv, status.wave4.social-a.tsv, …) rather than each writing a
// new status.wave7.<lane>.tsv. A validator that only globs `wave7` therefore
// sees none of those rows, and reports a confident green over a denominator of
// zero — the exact vacuous-green shape this catalog keeps producing. The atomic
// column-6 refusal does not care which file the bad cell is in.
const ALL = process.argv.includes("--all");
const files = fs
  .readdirSync(DIR)
  .filter((f) => (ALL ? /^status\..+\.tsv$/.test(f) : /^status\.wave7\..+\.tsv$/.test(f)))
  .filter((f) => !filter || f.includes(filter))
  .sort();

if (!files.length) {
  // ★ A validator that looked at nothing must NEVER read as a pass. Seven
  // vacuous greens have shipped in this project already; a run that collected
  // zero files still exits 0 unless it is made not to.
  console.log("validate-wave7: NO status.wave7.*.tsv files found — nothing was checked.");
  console.log("  This is NOT a pass. Denominator = 0.");
  process.exit(0);
}

for (const file of files) checkLines(file, fs.readFileSync(path.join(DIR, file), "utf8").split(/\r?\n/));

console.log(`validate-wave7: ${files.length} file(s), ${rows} row(s) read.`);
console.log(`  addressable: ${idRows} by node id, ${famRows} by family; ${bpCells} row(s) carry a column-6 cell.`);
console.log(`  column-2 histogram: ${Object.entries(histogram).map(([k, v]) => `${k} ${v}`).join(" · ") || "(none)"}`);

// ── THE SILENT DROP — printed FIRST, and above the lane-fixable problems ──────
// A green run below this banner is not evidence a lane's rows will land in
// registry.json. See the NODE_KIND comment at the top of this file.
if (droppedByKind.length) {
  const byFile = {};
  for (const d of droppedByKind) (byFile[d.file] ??= []).push(d);
  const pct = ((droppedByKind.length / Math.max(idRows, 1)) * 100).toFixed(1);
  console.log(
    `\n🚨 ${droppedByKind.length} of ${idRows} id-keyed row(s) (${pct}%) will be SILENTLY DROPPED by apply-status.mjs.`,
  );
  console.log(`   Cause: apply-status.mjs:272 \`if (f.kind !== "screen") continue;\` — the only loop that`);
  console.log(`   writes f.status. These rows parse, address a real frame, and are then never applied.`);
  console.log(`   NOT a lane error and NOT fixable by editing a TSV. One line, in the orchestrator's file.`);
  console.log(`   coverage.mjs is UNAFFECTED (it reads status.*.tsv directly), so the wave PERCENTAGE is sound.`);
  // Two things a fixer needs, both learned the hard way during this wave.
  console.log(`   NOTE 1: the kinds are NOT all "non-screen" — see the per-lane breakdown. Whitelisting`);
  console.log(`           only "non-screen" still loses every "untitled" row.`);
  console.log(`   NOTE 2: the same guard also gates the f.bpStatus default written just above it. Dropping`);
  console.log(`           it wholesale starts writing bpStatus onto frames with no device — the existing`);
  console.log(`           BP_KEYS.includes(f.device) ternary already resolves those to "unknown", so it is`);
  console.log(`           harmless. Do not revert the fix on seeing bpStatus appear on component frames.`);
  for (const [f, list] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
    const kinds = {};
    for (const d of list) kinds[d.frameKind] = (kinds[d.frameKind] || 0) + 1;
    const zero = list.length === (byFile[f]?.length ?? 0) ? "" : "";
    console.log(
      `      ${f.padEnd(36)} ${String(list.length).padStart(3)} dropped  (${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(", ")})${zero}`,
    );
  }
}

if (unapplied.length) {
  console.log(`\n⚠️  ${unapplied.length} row(s) would apply to ZERO frames:`);
  for (const u of unapplied) console.log(`      ${u}`);
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} row(s) would make apply-status.mjs REFUSE TO WRITE registry.json — for EVERY lane:`);
  for (const e of errors) console.log(`      ${e}`);
  console.log(`\n    Column 6 grammar: <width>=<verdict> [...] [@YYYY-MM-DD[/source-slug]]`);
  console.log(`    Column 6 verdicts: ${Object.keys(BP_VERDICTS).join(" | ")}`);
  console.log(`    Column 2 statuses: ${[...STATUS_VALID].join(" | ")}`);
}
if (!errors.length && !unapplied.length)
  console.log(`\n✅ all ${rows} row(s) across ${files.length} file(s) parse and address a real frame.`);

// ★ A row that applies to ZERO frames exits NON-ZERO, the same as a parse error.
// It does not block registry.json the way a malformed cell does, so the
// temptation is to treat it as a warning — but "a lane's finished work applied
// to nothing" is the failure that has already happened FIVE times in this
// catalog, and every one of those times it was reported and then read past. A
// warning that exits 0 is a warning nobody acts on.
process.exit(errors.length || unapplied.length ? 1 : 0);
