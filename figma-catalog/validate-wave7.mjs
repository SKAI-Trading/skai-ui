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
 *   node figma-catalog/validate-wave7.mjs --verbose    # list every registry-gap row
 *
 * Exit 0 = every row would apply. Exit 1 = at least one row would be refused or
 * would apply to nothing THAT THE LANE CAN FIX. Writes nothing, ever.
 *
 * ⚠️ A row whose node id names a real Figma node the registry cannot address is
 * reported loudly and does NOT exit 1 — the lane cannot fix it and the only edit
 * available to them is a deletion of correct work. See the registryGap note.
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
// ★ IMPORTED, NOT COPIED — same rule as the bp.mjs import above. `loadLiveNodes`
// carries coverage.mjs's furniture/scope classification, and a second copy of it
// here is how the 402-frame error in WAVE7-INTEGRITY §10 happened.
import { loadLiveNodes } from "./registry-drift.mjs";

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

/*
  ★★★ "IN NO REGISTRY FRAME" IS TWO DIFFERENT FAILURES AND THEY HAVE OPPOSITE
  FIXES. THIS SPLIT IS WAVE9-INTEGRITY §10, APPLIED.

  Until now every unresolved node id got one message — "node X is in NO registry
  frame — this row applies to ZERO frames" — and exit 1. Measured across all 134
  status files on 2026-09-01, that single message covered 220 rows on 98 distinct
  ids, and they split like this:

      not a TOP-LEVEL child of any page     20 rows /  19 ids
      live, in-scope, GENUINE              148 rows /  52 ids   <- the registry gap
      live, in-scope, furniture             44 rows /  19 ids
      live, but on an out-of-scope page      8 rows /   8 ids

  ⚠️ AND THE FIRST GROUP IS ITSELF TWO THINGS. `live/*.tsv` lists only depth-1
  children of a page, so a node that is real but INTERIOR — nested inside a frame
  that IS harvested — is indistinguishable here from an id that names nothing.
  `4725:55130` was resolved live during wave 10 (`getNodeByIdAsync`) and is a
  descendant of `4725:55110` three levels down: real, and permanently
  unaddressable, because no harvest of top-level children can ever reach it.
  Re-harvesting does not fix an interior node; folding the measurement into the
  ancestor frame's row does. The message says so, because the two fixes differ
  and the old one named only the wrong half.

  There is no containment data on disk to separate them — see `ancestorHint`.

  Only the first group is a lane's mistake. The other 200 rows name nodes that
  exist in Figma; the registry simply cannot address them (WAVE9-INTEGRITY §3
  Direction A — 52 frames, unchanged across three waves). Telling a lane its work
  "applies to ZERO frames" and failing the gate over it INVITES THE LANE TO
  DELETE OR RE-KEY CORRECT WORK, which is exactly how a measured frame leaves the
  catalog. There is no key that would work.

  And the verdicts are not lost meanwhile: `coverage.mjs` reads status.*.tsv
  directly, so all 148 of those rows are already counted in the published
  percentage. What is missing is only their presence in `registry.json`.

  This file already contains the precedent, in its own words, for the
  family-with-no-screen case:

      "It is NOT exit-worthy, deliberately: no lane can fix it by editing a TSV,
       and an exit 1 would block every lane over something they did not cause."

  Same reasoning, now applied. Exit 1 survives for the only case a lane can fix.
*/
/** Rows whose node id names a real Figma node the registry cannot address. */
const registryGap = [];

let LIVE_NODES = null;
let LIVE_LOAD_ERROR = null;
/**
 * The live harvest, loaded once and only when an unresolved id turns up.
 *
 * ⚠️ If `live/` is unreadable this returns an EMPTY map, which would classify
 * every unresolved id as "not live" and hand back the old exit-1 behaviour for
 * all of them. That is the safe direction, but it must be VISIBLE — a fallback
 * that silently restores the thing you just fixed is the failure this catalog
 * keeps producing. `LIVE_LOAD_ERROR` is printed in the report when it is set.
 */
function liveNodes() {
  if (LIVE_NODES) return LIVE_NODES;
  try {
    LIVE_NODES = loadLiveNodes(DIR);
  } catch (e) {
    LIVE_LOAD_ERROR = e.message;
    LIVE_NODES = new Map();
  }
  return LIVE_NODES;
}

/*
  A candidate-ancestor hint for an interior node, and it is DELIBERATELY SILENT
  most of the time.

  There is no containment data anywhere on disk: `live/*.tsv` is a flat depth-1
  list and registry frames carry no parent field, so "interior" cannot be proved
  locally at all. The only local signal is that a Figma node id's major part is
  the session that created it, which a parent usually shares with its children —
  and equally with their siblings and cousins.

  Measured over the 19 unresolved ids on 2026-09-01, that signal is excellent on
  the games and Social pages (1, 3, 4 candidates) and worthless on Trade 2, where
  EIGHT ids each match 375 live frames. A hint that names 375 frames is not a
  hint. So it fires only at 5 or fewer, and it says "candidate", never "ancestor".
*/
const HINT_MAX = 5;
let SAME_MAJOR = null;
function ancestorHint(nodeId) {
  if (!SAME_MAJOR) {
    SAME_MAJOR = new Map();
    for (const n of liveNodes().values()) {
      if (n.scope !== "in-scope" || n.furniture !== null) continue;
      const maj = n.id.split("-")[0];
      if (!SAME_MAJOR.has(maj)) SAME_MAJOR.set(maj, []);
      SAME_MAJOR.get(maj).push(n);
    }
  }
  const cands = SAME_MAJOR.get(nodeId.split("-")[0]) ?? [];
  if (!cands.length || cands.length > HINT_MAX) return "";
  return (
    `  [candidate ancestors, same id major, unproven: ` +
    cands.map((c) => `${c.id} "${c.name}"`).join(" | ") +
    `]`
  );
}

/**
 * Why one unresolved node id is unresolved. Returns the bucket plus the sentence
 * the lane should act on.
 */
function classifyUnresolved(nodeId) {
  const n = liveNodes().get(nodeId);
  if (!n)
    return {
      bucket: "not-top-level",
      exitWorthy: true,
      note:
        "and no page's TOP-LEVEL harvest carries it either. That is TWO different things with different fixes: " +
        "(a) the id is wrong — re-key it or drop the row; or " +
        "(b) the node is INTERIOR, a descendant of a frame that IS harvested. `live/*.tsv` lists only depth-1 " +
        "children, so an interior node can NEVER be addressable however fresh the harvest is — a re-harvest will " +
        "not fix it. If it is interior, FOLD the measurement into the ANCESTOR frame's row and keep every number; " +
        "the catalog's unit is the frame. Do not discard the verdict." +
        ancestorHint(nodeId),
    };
  if (n.scope !== "in-scope")
    return {
      bucket: "out-of-scope",
      exitWorthy: false,
      note: `but it is live on "${n.page}" (${n.scope}). coverage.mjs counts no frame on that page, so the row is counted nowhere — and no key would change that. DO NOT re-key or delete this row.`,
    };
  if (n.furniture !== null)
    return {
      bucket: "furniture",
      exitWorthy: false,
      note: `but it is live on "${n.page}" and classified furniture (${n.furniture}), so it sits outside the parity denominator by design. DO NOT re-key or delete this row.`,
    };
  return {
    bucket: "registry-gap",
    exitWorthy: false,
    note: `but it IS live, in scope and genuine on "${n.page}" — this is the registry gap (WAVE9-INTEGRITY §3 Direction A), not your row. coverage.mjs already counts your verdict. DO NOT re-key or delete this row.`,
  };
}

const SELF_TEST = process.argv.includes("--self-test");
const VERBOSE = process.argv.includes("--verbose");
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
      if (!KNOWN_NODES.has(addr.nodeId)) {
        const v = classifyUnresolved(addr.nodeId);
        const msg = `${where}: node ${addr.nodeId} is in NO registry frame — ${v.note}`;
        if (v.exitWorthy) unapplied.push(msg);
        else registryGap.push({ where, nodeId: addr.nodeId, bucket: v.bucket, msg, file });
      }
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
      "id-keyed row naming a node no page's TOP-LEVEL harvest carries",
      `Ghost [9999-99999]${T}partial${T}-${T}-${T}width 375`,
      "no page's TOP-LEVEL harvest carries it",
      null,
      true, // exit-worthy: wrong id or interior node — either way the lane acts
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
      ★ THE POSITIVE HALF OF THE KIND CHECK — it MUST fire on the branch kept.

      `w7b-games-unknown` pointed out that the regression control below (an
      id-keyed row on a non-screen frame must be SILENT) passes both when the
      guard is correctly gone AND when no rule is evaluated at all — because the
      id-path check was deleted outright. A control that cannot tell "the rule is
      right" from "there is no rule" is the vacuous-green shape relocated.

      So the suite needs one case that MUST fire on the branch that survives.
      `hilo/Casino > Scratchers` is one of only two real named families in the
      registry holding no `screen` frame (both are `component`), so a
      family-keyed row on it lands on nothing — which is what apply-status.mjs's
      surviving `f.kind === "screen" ? statusByFam[key] : undefined` means.

      If someone deletes the family branch, this goes MISSED. One case that must
      fire, one that must not.
    */
    [
      "family-keyed row on a family with NO screen frame",
      `Casino > Scratchers${T}partial${T}-${T}-${T}width 375`,
      "no screen frame",
      // A family key only resolves when the FILE's stem names a section, so this
      // one fixture runs under a hilo-shaped name. Under the default
      // `__fixture` stem the same key parses as a SECTION ROLLUP instead.
      //
      // ⚠️ THIS NAME IS PASSED AS A STRING AND NEVER WRITTEN TO DISK. It has to
      // be said explicitly, because `status.wave7.hilo.tsv` looks exactly like a
      // real lane file and matches the same `readdirSync` glob apply-status.mjs
      // uses — the header's `__selftest` example signalled "not real" in its
      // name, and this one does not. Verified absent from the catalog directory.
      "status.wave7.hilo.tsv",
    ],
  ];

  /*
    ★★★ THE THREE NON-EXIT BRANCHES, DRIVEN BY IDS PICKED FROM TODAY'S DATA.

    The split above is worthless if nothing exercises the branch that does NOT
    exit. But hardcoding an id here would rot the first time the registry is
    re-harvested — and it would rot toward MISSED on a fixture whose label still
    claims to test the branch, which is WAVE9-INTEGRITY §7's vacuous green with a
    different mask. So each id is looked up in the live harvest at run time:
    the first node that is live, in the right bucket, and absent from
    `KNOWN_NODES`.

    If a bucket is EMPTY the fixture cannot run. That is good news (the drift is
    fixed) and it must not read as a pass, so it prints SKIPPED and is removed
    from the denominator, which is printed. A fixture that silently disappears
    from a suite is how a suite shrinks to nothing while staying green.
  */
  const pickLive = (want) => {
    for (const n of liveNodes().values()) {
      if (KNOWN_NODES.has(n.id)) continue;
      if (want === "registry-gap" && n.scope === "in-scope" && n.furniture === null) return n;
      if (want === "furniture" && n.scope === "in-scope" && n.furniture !== null) return n;
      if (want === "out-of-scope" && n.scope !== "in-scope") return n;
    }
    return null;
  };
  for (const [bucket, must] of [
    ["registry-gap", "this is the registry gap"],
    ["furniture", "classified furniture"],
    ["out-of-scope", "coverage.mjs counts no frame on that page"],
  ]) {
    const n = pickLive(bucket);
    if (!n) {
      FIXTURES.push([`live-but-unregistered (${bucket}) — NO SUCH NODE ON DISK`, null, null, null, null, true]);
      continue;
    }
    FIXTURES.push([
      `live-but-unregistered (${bucket}): ${n.id} on "${n.page}" — reported, NOT exit-worthy`,
      `Real frame [${n.id}]${T}partial${T}-${T}-${T}width 375`,
      must,
      null,
      false, // ← the whole point: this must NOT fail the gate
    ]);
  }

  let caught = 0;
  let skipped = 0;
  for (const [label, row, must, asFile, wantExit, skip] of FIXTURES) {
    if (skip) {
      skipped++;
      console.log(`  SKIPPED ${label} — the bucket is empty today, so this branch went UNTESTED.`);
      continue;
    }
    errors.length = 0;
    unapplied.length = 0;
    droppedByKind.length = 0;
    registryGap.length = 0;
    seenIds.clear();
    checkLines(asFile ?? "status.wave7.__fixture.tsv", [row]);
    const report = [
      ...errors,
      ...unapplied,
      ...registryGap.map((g) => g.msg),
      // The silent drop is reported through its own banner, not through
      // `errors`/`unapplied`, so the self-test has to reach into it explicitly
      // or the fixture below is vacuous — it would report MISSED whether the
      // check worked or not.
      ...droppedByKind.map(
        (d) => `${d.where}: family ${d.nodeId} has no screen frame (kinds: ${d.frameKind}) — a family row lands on nothing`,
      ),
    ].join("\n");
    // ⚠️ A SUBSTRING MATCH ALONE CANNOT TELL THE TWO BRANCHES APART — every
    // message lands in the same joined report whichever accumulator holds it.
    // The exit-worthiness IS the behaviour under test, so it is asserted
    // separately. Without this, moving a message between accumulators would go
    // undetected and the split would be decorative.
    const sawMust = report.includes(must);
    const exits = errors.length > 0 || unapplied.length > 0;
    const exitOk = wantExit === undefined || wantExit === null || exits === wantExit;
    const ok = sawMust && exitOk;
    if (ok) caught++;
    console.log(`  ${ok ? "CAUGHT " : "MISSED "} ${label}`);
    if (!sawMust) console.log(`      wanted a report containing "${must}", got: ${report || "(nothing)"}`);
    else if (!exitOk)
      console.log(`      message correct, but exit-worthiness is ${exits} and must be ${wantExit}`);
  }
  // And a control: a well-formed row must produce NO complaint. Without this the
  // suite could pass by flagging everything.
  errors.length = 0;
  unapplied.length = 0;
  droppedByKind.length = 0;
  registryGap.length = 0;
  seenIds.clear();
  checkLines(
    "status.wave7.__fixture.tsv",
    [`Skai > Play > Casino > Blackjack (1440 x 900px) [9003-117337]${T}done${T}a.tsx${T}/play${T}header 56 = frame 56; radius 12 = frame 12${T}desktop=renders @2026-08-31/w7-verify`],
  );
  const controlClean = !errors.length && !unapplied.length && !registryGap.length;
  console.log(`  ${controlClean ? "CLEAN  " : "FALSE+ "} control: a well-formed row produces no complaint`);

  /*
    ★ REGRESSION CONTROL — an ID-keyed row on a NON-SCREEN frame must be SILENT.

    `13008-27159` is kind `non-screen`. It is the node `w7b-wallet2` used to prove
    the silent drop: a wave-4 row gave it a `done` with full measurements and the
    registry still read `status: "unknown", notes: ""`.

    ⚠️ THIS USED TO BE A "CAUGHT" FIXTURE ASSERTING THE DROP HAPPENS. The
    orchestrator then fixed `apply-status.mjs` (`f81cee7`) so id-keyed rows apply
    whatever the kind — and the fixture went on passing, because it was asserting
    the presence of a defect that no longer existed. A self-test can ENSHRINE A
    STALE BELIEF just as easily as it can catch a regression, and a green suite
    is not evidence the suite is asking the right question.

    So it is inverted: this row must now produce NO complaint. If the kind guard
    is ever reintroduced on the id path, this control goes FALSE+ and says so.
  */
  errors.length = 0;
  unapplied.length = 0;
  droppedByKind.length = 0;
  registryGap.length = 0;
  seenIds.clear();
  checkLines(
    "status.wave7.__fixture.tsv",
    [`Wallet component [13008-27159]${T}partial${T}-${T}-${T}width 375 = frame 375`],
  );
  const idKindClean =
    !errors.length && !unapplied.length && !droppedByKind.length && !registryGap.length;
  console.log(
    `  ${idKindClean ? "CLEAN  " : "FALSE+ "} control: an ID-keyed row on a NON-SCREEN frame applies (guard removed in f81cee7)`,
  );
  if (!controlClean) console.log(`      got: ${[...errors, ...unapplied, ...registryGap.map((g) => g.msg)].join("\n")}`);
  const ran = FIXTURES.length - skipped;
  const pass = caught === ran && controlClean && idKindClean && skipped === 0;
  console.log(
    `\nself-test: ${caught}/${ran} known-bad rows caught` +
      (skipped ? `, ${skipped} SKIPPED (branch untested — see above)` : "") +
      `, control ${controlClean ? "clean" : "FAILED"}, id-kind control ${idKindClean ? "clean" : "FAILED"}.`,
  );
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
/*
  ⚠️ THE WAVE NUMBER USED TO BE HARDCODED HERE, and that made this validator
  useless the day wave 8 started: pointed at `wave8` it reported
  "NO status.wave7.*.tsv files found" and refused. The refusal was correct — it
  said "This is NOT a pass. Denominator = 0" rather than reporting green over
  nothing — but the tool still could not check the wave that was running.

  ★ Same class as the guard this script once kept a private copy of: a checker
  that hardcodes a fact about the thing it checks goes stale the moment that
  fact moves, and it is confident either way. So the wave is now DERIVED from
  the newest `status.wave<N>.*.tsv` on disk, and printed, so a reader can see
  which population was actually checked instead of assuming.

  `--wave <N>` pins it explicitly; `--all` still sweeps every status file,
  because the atomic column-6 refusal does not care which file the bad cell is
  in and older lanes wrote into un-numbered files.
*/
const waveFlagIdx = process.argv.indexOf("--wave");
const waveArg = waveFlagIdx !== -1 ? process.argv[waveFlagIdx + 1] : null;
const wavesOnDisk = [
  ...new Set(
    fs
      .readdirSync(DIR)
      .map((f) => /^status\.wave(\d+)\./.exec(f)?.[1])
      .filter(Boolean)
      .map(Number),
  ),
].sort((a, b) => a - b);
const WAVE = waveArg ?? (wavesOnDisk.length ? String(wavesOnDisk[wavesOnDisk.length - 1]) : "7");
const waveRe = new RegExp(`^status\\.wave${WAVE}\\..+\\.tsv$`);
if (!ALL) console.log(`(checking wave ${WAVE}; waves on disk: ${wavesOnDisk.join(", ") || "none"})`);
const files = fs
  .readdirSync(DIR)
  .filter((f) => (ALL ? /^status\..+\.tsv$/.test(f) : waveRe.test(f)))
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
  const pct = ((droppedByKind.length / Math.max(famRows, 1)) * 100).toFixed(1);
  console.log(
    `\n⚠️  ${droppedByKind.length} of ${famRows} FAMILY-keyed row(s) (${pct}%) name a family with NO screen frame.`,
  );
  console.log(`   apply-status.mjs applies a family row only where \`f.kind === "screen"\`, so these land`);
  console.log(`   on nothing. Re-key them by node id — an id-keyed row applies whatever the frame's kind.`);
  console.log(`   (ID-keyed rows are NOT affected: that guard was removed in f81cee7.)`);
  for (const [f, list] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
    const kinds = {};
    for (const d of list) kinds[d.frameKind] = (kinds[d.frameKind] || 0) + 1;
    const zero = list.length === (byFile[f]?.length ?? 0) ? "" : "";
    console.log(
      `      ${f.padEnd(36)} ${String(list.length).padStart(3)} dropped  (${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(", ")})${zero}`,
    );
  }
}

// ── THE REGISTRY GAP — loud, itemised, and DELIBERATELY NOT EXIT-WORTHY ───────
// See the classifyUnresolved note above. These rows name nodes that are real in
// Figma; `registry.json` cannot address them and no edit to a TSV changes that.
// coverage.mjs counts them already.
if (registryGap.length) {
  const byBucket = {};
  for (const g of registryGap) (byBucket[g.bucket] ??= []).push(g);
  const ids = new Set(registryGap.map((g) => g.nodeId));
  console.log(
    `\n⚠️  ${registryGap.length} row(s) on ${ids.size} node(s) name a REAL Figma node that registry.json cannot address.`,
  );
  console.log(`   ⛔ DO NOT re-key and DO NOT delete these rows. There is no key that would work,`);
  console.log(`      and coverage.mjs reads status.*.tsv directly, so these verdicts are already counted.`);
  console.log(`      This is the registry drift of WAVE9-INTEGRITY §3, not anything a lane did.`);
  for (const [b, list] of Object.entries(byBucket).sort((a, b2) => b2[1].length - a[1].length)) {
    const bIds = new Set(list.map((g) => g.nodeId));
    console.log(`      ${b.padEnd(14)} ${String(list.length).padStart(4)} row(s) on ${bIds.size} node(s)`);
  }
  if (VERBOSE) for (const g of registryGap) console.log(`        ${g.msg}`);
  else console.log(`      (--verbose lists every row)`);
}
if (LIVE_LOAD_ERROR) {
  console.log(`\n⚠️  the live harvest could not be read (${LIVE_LOAD_ERROR}).`);
  console.log(`   Every unresolved node id was therefore treated as NOT LIVE and counts below.`);
  console.log(`   Some of those rows are probably correct work — do not act on them until live/ reads.`);
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
  console.log(
    `\n✅ all ${rows} row(s) across ${files.length} file(s) parse and address a real frame` +
      (registryGap.length ? ` (${registryGap.length} of them via the registry gap above, which is not a lane defect).` : "."),
  );

// ★ A row that applies to ZERO frames exits NON-ZERO, the same as a parse error.
// It does not block registry.json the way a malformed cell does, so the
// temptation is to treat it as a warning — but "a lane's finished work applied
// to nothing" is the failure that has already happened FIVE times in this
// catalog, and every one of those times it was reported and then read past. A
// warning that exits 0 is a warning nobody acts on.
//
// ★★★ `registryGap` IS THE ONE EXCEPTION, AND IT IS NOT A SOFTENING OF THAT RULE.
// The rule above is about work that lands on nothing and CAN be rescued by
// editing the row. A registry-gap row cannot: the node is real, coverage.mjs
// already counts the verdict, and the only edit available to the lane is a
// deletion that would destroy correct work. Exiting 1 there does not make anyone
// act, it makes them delete. Measured 2026-09-01: 200 of the 220 rows this gate
// used to fail on were in that state.
process.exit(errors.length || unapplied.length ? 1 : 0);
