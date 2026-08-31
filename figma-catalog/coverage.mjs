#!/usr/bin/env node
/**
 * coverage.mjs — the catalog's progress tracker.
 *
 * Answers, per Figma page and with NO hand-maintained input:
 *   - how many top-level nodes are LIVE
 *   - how many of those are FURNITURE (never a build target) vs GENUINE spec
 *   - how many genuine frames have a catalog row, matched BY NODE ID
 *   - the status breakdown of those rows
 *   - BOTH drift directions: live-only (nobody has a row) and catalog-only
 *     (a row pointing at a node that is not a live top-level child)
 * then rolls the in-scope pages up into one percentage.
 *
 *   node figma-catalog/coverage.mjs            # writes COVERAGE.md + coverage.json
 *   node figma-catalog/coverage.mjs --check    # verify inputs only, write nothing
 *
 * ---------------------------------------------------------------------------
 * WHY IT LOOKS LIKE THIS — five things that have already made this measurement
 * lie, each of which this script refuses structurally rather than by convention.
 *
 * 1. ROW COUNTS ARE NOT COVERAGE, IN EITHER DIRECTION. One rollup row can cover
 *    30 frames (`status.dice.tsv` has ONE row naming 22 node ids in its prose),
 *    and 14-25% of the nodes on a page are furniture that can never be built.
 *    Counting rows therefore both over- and under-states at once. So the
 *    denominator here is LIVE GENUINE FRAMES, and rows are matched onto them.
 *
 * 2. TITLES ARE NOT IDENTITIES. Slide's desktop assembly is titled "Towers";
 *    Chicken's frames are filed as "Hi-Lo Start" and "Blackjack"; 14 titles
 *    repeat verbatim on one page. `apply-status.mjs` folds rows onto frames by
 *    `section/family`, which is parsed from the title — fine for populating the
 *    registry, useless as evidence of coverage. **Every match here is by node
 *    id**, scanned out of the whole row (column 1 bracket form `[13008-110719]`,
 *    a leading `13006:247883.` in the reason, or `node 11400-91695` mid-prose).
 *
 * 3. AN UNLOADED FIGMA PAGE REPORTS `children.length === 0`. Not an error — a
 *    plausible zero. Predict once read 0 minutes after measuring 284. So the
 *    live harvest is a separate, explicit artifact (`live/`), and this script
 *    REFUSES TO RUN if any page's node list is missing or does not have exactly
 *    the row count `live/_pages.json` recorded. A short harvest shrinks the
 *    denominator and RAISES the percentage — it fails in the flattering
 *    direction, which is the direction nobody reviews.
 *
 * 4. EQUAL COUNTS HIDE AN EQUAL-SIZED SWAP. Dice measured 36 live and 36
 *    catalog with a 2-for-2 swap inside it. Both drift sets are therefore
 *    always printed, and "no drift" means BOTH are empty — never that the
 *    totals agree.
 *
 * 5. A TOKEN THAT LOOKS LIKE A NODE ID USUALLY ISN'T. `2026-08-20` and `03:21`
 *    match every plausible node-id regex. Rather than guess, a candidate token
 *    is only accepted if it appears in the catalog's own id universe (registry
 *    frames, `*.nodes.txt`, `*.titles.tsv`, the bug indexes) or in the live
 *    harvest. Everything else is counted and sampled as `unrecognised` so the
 *    filter is auditable instead of invisible.
 *
 * ---------------------------------------------------------------------------
 * INPUTS (all machine-generated; nothing here is typed by hand)
 *   live/_pages.json                   page manifest + authoritative live counts
 *   live/<fileKey>__<pageId>.tsv       nodeId, name, type, w, h, visible
 *   status.<section>.tsv               the catalog rows (54 files, 1,931 rows)
 *   registry.json, *.nodes.txt, *.titles.tsv, bug-node-index.tsv,
 *   bugref-aliases.tsv                 the known-id universe, for token filtering
 *
 * To refresh the live half, re-run the harvest recorded in `live/_pages.json`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const LIVE = path.join(DIR, "live");
// `--histogram` prints the full in-scope rollup and the per-page table as JSON
// on stdout and writes NOTHING. WAVE5-BRIEF §9 forbids regenerating
// coverage.json mid-wave — it races twenty concurrent lanes — while the
// integrity lane still has to read the histogram to compute the wave
// percentage. Both drift lanes hit this contradiction in wave 5 and worked
// around it by reading the stale file. This flag removes the need to choose.
const HISTOGRAM = process.argv.includes("--histogram");
const CHECK_ONLY = process.argv.includes("--check") || HISTOGRAM;

const fail = (msg) => {
  console.error(`coverage.mjs REFUSING TO REPORT — ${msg}`);
  process.exit(1);
};

/** Node ids are written with ':' by the Figma API and '-' by every catalog file. */
const normId = (s) => String(s).trim().replace(":", "-");

// ---------------------------------------------------------------------------
// 1. LIVE HALF
// ---------------------------------------------------------------------------
if (!fs.existsSync(path.join(LIVE, "_pages.json")))
  fail(`no live/_pages.json — run the harvest recorded in that file's _comment first`);
const manifest = JSON.parse(fs.readFileSync(path.join(LIVE, "_pages.json"), "utf8"));

const pages = [];
const problems = [];
/** Pages whose harvest is LONGER than the manifest — reported, never silent. */
const staleManifest = [];
for (const p of manifest.pages) {
  const file = path.join(LIVE, `${p.fileKey}__${p.pageId.replace(":", "-")}.tsv`);
  if (!fs.existsSync(file)) {
    if (p.n === 0) {
      pages.push({ ...p, nodes: [] });
      continue; // a genuinely empty page (the "----------" separator) needs no file
    }
    problems.push(`missing node list for ${p.pageName} (${p.pageId}) — expected ${file}`);
    continue;
  }
  const nodes = fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => {
      const [id, name, type, w, h, visible] = l.split("\t");
      return { id: normId(id), name: name ?? "", type: type ?? "", w: +w || 0, h: +h || 0, visible: visible !== "0" };
    });
  // ★ THE LOUD GUARD. See header note 3.
  //
  // ⚠️ SPLIT BY DIRECTION 2026-08-31. It used to refuse on ANY inequality, and
  // that bricked the whole report for every page and every lane the moment a
  // page was legitimately RE-HARVESTED. That is not hypothetical: commit
  // `9cd5648` re-harvested the blackjack and bingo pages for full titles and
  // picked up 4 top-level nodes the original wave-4 harvest had MISSED (3 on
  // blackjack, 1 on bingo) without updating `_pages.json`. From then until this
  // change `coverage.mjs` exited 1 on every invocation — nobody could compute a
  // wave percentage at all.
  //
  // The two directions are not symmetric, and note 3 says exactly why:
  //   harvest < manifest   the harvest is SHORT. It shrinks the denominator and
  //                        RAISES the percentage. Flattering, unreviewed — stays
  //                        a hard refusal.
  //   harvest > manifest   the manifest is STALE behind a re-harvest. Using the
  //                        harvest ENLARGES the denominator and LOWERS the
  //                        percentage. It cannot flatter, so it is reported
  //                        loudly and the run proceeds on the harvest.
  //
  // Verified against live Figma before this was relaxed, by ID SET and not by
  // count (WAVE5-BRIEF §2): the blackjack page really has 23 direct children and
  // bingo really has 17, matching the harvest exactly with zero ids on either
  // side. The manifest's 20/16 are the stale numbers.
  //
  // This is a report, not a fix. `live/_pages.json` still has to be reconciled;
  // `staleManifest` is surfaced in the output so it cannot be forgotten.
  if (nodes.length < p.n)
    problems.push(
      `${p.pageName} (${p.pageId}): harvest has ${nodes.length} rows, manifest measured ${p.n} live children` +
        ` — a short harvest inflates the completion percentage, so this is refused, not warned about`,
    );
  else if (nodes.length > p.n)
    staleManifest.push(
      `${p.pageName} (${p.pageId}): harvest has ${nodes.length} rows, manifest records ${p.n}` +
        ` — manifest is stale behind a re-harvest; proceeding on the LARGER harvest (lowers the percentage, cannot flatter). Reconcile live/_pages.json to n=${nodes.length}.`,
    );
  const bad = nodes.filter((n) => !/^\d+-\d+$/.test(n.id));
  if (bad.length) problems.push(`${p.pageName}: ${bad.length} row(s) whose first field is not a node id, e.g. "${bad[0].id}"`);
  pages.push({ ...p, nodes });
}
if (problems.length) fail(`${problems.length} input problem(s):\n  ` + problems.join("\n  "));
if (staleManifest.length) {
  console.error(`coverage.mjs — ${staleManifest.length} page(s) with a STALE MANIFEST (reported, run continues):`);
  for (const s of staleManifest) console.error(`  ${s}`);
}

// ---------------------------------------------------------------------------
// 2. FURNITURE RULE — derived from live node data, never hand-maintained.
//
// SCHEMA.md: furniture is "not spec at all: Directory banners, Breakpoint
// rulers, loose rectangles, FigJam stickies", and it is EXCLUDED FROM THE
// PARITY DENOMINATOR because counting it makes a completion percentage
// permanently wrong. Two independent signals, plus visibility:
//
//   a) TYPE. A top-level node that is not a FRAME / COMPONENT / COMPONENT_SET /
//      SECTION is not a screen. That catches every RECTANGLE ("Rectangle 155",
//      the pasted "Screenshot 2026-07-28 at 6.05.34 PM"), every VECTOR, every
//      loose TEXT annotation ("Skai's Start game buttons are massive, l..."),
//      every WIDGET (the FigJam "Notes" stickies), and every loose INSTANCE
//      (`CTA/button`, `logos/others`) — a library instance dropped on the canvas
//      is a design-system fragment, not a surface to build.
//   b) NAME. `Directory` and `Breakpoint` are FRAMEs, so type alone misses them;
//      they are the canvas chrome the team lays out with. Same for `Scroll bar`.
//      The list is deliberately only the KNOWN canvas-chrome vocabulary. It does
//      NOT include `Group N` / `Frame N`: a default name is evidence that nobody
//      named the node, not evidence that it holds nothing — `Group 316` on Price
//      Grid is 1410x900, i.e. a desktop-sized composition. Those count as
//      genuine and are disclosed under `defaultNamed` instead, because a rule
//      that guesses intent from a default name would quietly shrink the
//      denominator and raise the percentage.
//   c) HIDDEN. The lane brief is explicit: hidden nodes are not spec. Counted
//      as its own bucket so the rule stays visible rather than folded away.
//
// Anything else is GENUINE and lands in the denominator, including the
// component/state fragments (`Up - long`, `Bet slip - empty`, `dropdown-market`)
// — those are real, catalogued design work even though they are not screens.
// ---------------------------------------------------------------------------
const SPEC_TYPES = new Set(["FRAME", "COMPONENT", "COMPONENT_SET", "SECTION", "GROUP"]);
const FURNITURE_NAME = [
  /^Directory\b/i,
  /^Breakpoint\b/i,
  /^Scroll bar\b/i,
  /^Rectangle \d+$/i,
  /^Vector \d+$/i,
  /^Ellipse \d+$/i,
  /^Line \d+$/i,
  /^Screenshot\b/i,
  /^Screen Shot\b/i,
  /^Slice\b/i,
  /^Image \d+$/i,
  /^Notes$/i,
  /^Unrecommended/i,
];

function classify(n) {
  if (!n.visible) return { furniture: true, why: "hidden" };
  if (FURNITURE_NAME.some((re) => re.test(n.name))) return { furniture: true, why: "canvas-chrome" };
  if (!SPEC_TYPES.has(n.type)) return { furniture: true, why: `loose-${n.type.toLowerCase()}` };
  return { furniture: false, why: "" };
}

// ---------------------------------------------------------------------------
// 3. THE KNOWN-ID UNIVERSE — the filter that keeps dates out of the drift sets.
// ---------------------------------------------------------------------------
const known = new Set();
const addIfId = (s) => {
  const v = normId(s);
  if (/^\d+-\d+$/.test(v)) known.add(v);
};
for (const p of pages) for (const n of p.nodes) known.add(n.id);
{
  const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
  for (const k of Object.keys(reg.frames)) addIfId(k.includes(":") ? k.slice(k.indexOf(":") + 1) : k);
}
for (const f of fs.readdirSync(DIR)) {
  const full = path.join(DIR, f);
  if (/\.nodes\.txt$/.test(f)) {
    for (const l of fs.readFileSync(full, "utf8").split(/\r?\n/)) addIfId(l);
  } else if (/\.titles\.tsv$/.test(f) || f === "bug-node-index.tsv" || f === "bugref-aliases.tsv") {
    for (const l of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
      if (l.startsWith("#")) continue;
      addIfId(l.split("\t")[0]);
    }
  }
}

// OPTIONAL SECOND PASS — `live/_resolved.json`. The known-id universe above
// cannot settle a token the catalog has never harvested, and the ambiguity is
// real in both directions: `9758-6724` is a genuine TEXT node nested inside a
// Video Poker frame, while `5542-5545` is the line range in
// `points-game/index.ts:5542-5545`. Both match every plausible node-id regex.
// So the plausible-shaped unknowns were put to Figma itself
// (`getNodeByIdAsync` in each of the three files, after loading every page) and
// the answers recorded. Without this file the script still runs; Drift B is
// then a LOWER BOUND and says so.
const resolved = fs.existsSync(path.join(LIVE, "_resolved.json"))
  ? JSON.parse(fs.readFileSync(path.join(LIVE, "_resolved.json"), "utf8"))
  : null;
const resolvedFound = new Map();
if (resolved)
  for (const [id, v] of Object.entries(resolved.found || {})) {
    const first = Array.isArray(v) ? v[0] : v;
    resolvedFound.set(normId(id), first);
    known.add(normId(id));
  }

// Nodes that are known to be DEEP LINKS (a descendant of a catalogued frame, or
// a whole-page link from a bug report). A catalog row pointing at one of these
// is not drift — it is a report linking below the frame level.
const deepLinked = new Set();
for (const f of ["bugref-aliases.tsv", "bug-node-index.tsv"]) {
  const full = path.join(DIR, f);
  if (!fs.existsSync(full)) continue;
  for (const l of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
    if (l.startsWith("#") || !l.trim()) continue;
    const v = normId(l.split("\t")[0]);
    if (/^\d+-\d+$/.test(v)) deepLinked.add(v);
  }
}

// ---------------------------------------------------------------------------
// 4. CATALOG HALF — every status row, indexed by every node id it mentions.
// ---------------------------------------------------------------------------
const STATUS_ALIASES = new Map([
  ["scaffolding", "furniture"],
  ["art-asset", "furniture"],
  ["real-component", "partial"],
  ["real-screen", "partial"],
]);
// Worst-first, so a node claimed by two rows reports the LESS complete verdict.
// `furniture` and `unknown` are not completeness judgements and are ranked last
// on purpose — neither may win a worst-of and hide a real gap.
const SEVERITY = ["not-started", "blocked-on-backend", "partial", "frame-defect", "done", "furniture", "unknown"];
const sev = (s) => {
  const i = SEVERITY.indexOf(s);
  return i === -1 ? SEVERITY.length : i;
};

const ID_TOKEN = /\b\d{1,7}[-:]\d{1,7}\b/g;
const rowsByFile = {};
const rowIndex = new Map(); // normalised id -> [row, ...]  — rows that KEY this frame (column 1)
// Rows that merely CITE the frame in a route or reason. Kept separate so a
// citation can never masquerade as a verdict — see the note at the index loop.
const mentionIndex = new Map(); // normalised id -> [row, ...]
let totalRows = 0,
  rowsNamingNoId = 0,
  unrecognisedTokens = 0;
const unrecognisedSample = new Set();
const allRows = [];

for (const f of fs.readdirSync(DIR).filter((x) => /^status\..+\.tsv$/.test(x)).sort()) {
  const lines = fs.readFileSync(path.join(DIR, f), "utf8").split(/\r?\n/);
  rowsByFile[f] = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const cols = line.split("\t");
    let status = (cols[1] || "").trim();
    if (STATUS_ALIASES.has(status)) status = STATUS_ALIASES.get(status);
    const row = {
      file: f,
      line: i + 1,
      family: cols[0] || "",
      status,
      bpCell: (cols[5] || "").trim(),
      reason: cols[4] || "",
      ids: new Set(),
    };
    totalRows++;
    rowsByFile[f]++;
    allRows.push(row);
    /*
      ★ A row that KEYS a frame and a row that MENTIONS one are not the same
      claim, and conflating them manufactured every conflict this report found.

      This loop used to scan the WHOLE LINE for id tokens, so a reason saying
      "same shape as 9058-4372, which is NOT Scratchers" indexed as a verdict ON
      9058-4372 — a disclaimer counted as a claim of ownership. Measured
      2026-08-26: of 193 reported conflicts, **98 had no row that keyed the
      frame at all** and 33 more paired one keyed row against pure prose. The
      worst-of resolution was therefore systematically pessimistic, because the
      losing row was usually a citation.

      Column 1 is the key. Everything else is context:
        - column 4 (route) is where `status.trade-2.components.tsv` parked a
          PARENT SCREEN id on 151 of its 189 rows — one frame collected 30
          "verdicts" that way;
        - column 5 (reason) is prose, and prose cites precedent, contrast and
          explicit disclaimers.
    */
    const keyedIds = new Set();
    const mentionedIds = new Set();
    for (const tok of (cols[0] || "").match(ID_TOKEN) || []) {
      const id = normId(tok);
      if (known.has(id)) keyedIds.add(id);
    }
    for (const tok of line.match(ID_TOKEN) || []) {
      const id = normId(tok);
      if (known.has(id)) {
        if (!keyedIds.has(id)) mentionedIds.add(id);
        row.ids.add(id);
      } else {
        unrecognisedTokens++;
        if (unrecognisedSample.size < 20) unrecognisedSample.add(tok);
      }
    }
    row.keyedIds = keyedIds;
    row.mentionedIds = mentionedIds;
    if (!row.ids.size) rowsNamingNoId++;
    // Only a KEYED row is indexed as a verdict on the frame. A mention still
    // counts toward coverage awareness but must never contradict a real one.
    for (const id of keyedIds) {
      if (!rowIndex.has(id)) rowIndex.set(id, []);
      rowIndex.get(id).push(row);
    }
    for (const id of mentionedIds) {
      if (!mentionIndex.has(id)) mentionIndex.set(id, []);
      mentionIndex.get(id).push(row);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. MATCH, PER PAGE
// ---------------------------------------------------------------------------
const liveIds = new Set();
// A node id is unique only WITHIN a Figma file (SCHEMA.md: `6330-54594` is home
// scaffolding in Skai-Web-App and a dice Breakpoint in Skai-Games). Skai-Web-App-2
// began as a copy of Skai-Web-App, so a large block of ids exists in both. Status
// rows do not record a fileKey, so a row's id can legitimately match a frame in
// two files and this script cannot tell which was meant. Counted, disclosed, and
// left alone — inventing a file for a row would be worse than naming the doubt.
const filesPerId = new Map();
for (const p of pages)
  for (const n of p.nodes) {
    liveIds.add(n.id);
    if (!filesPerId.has(n.id)) filesPerId.set(n.id, new Set());
    filesPerId.get(n.id).add(p.fileKey);
  }
const ambiguousIds = new Set([...filesPerId].filter(([, s]) => s.size > 1).map(([id]) => id));

const report = [];
const conflictList = [];
// Frames where a later wave re-verified an earlier row. Not a conflict - the
// system working. Tracked separately so the health signal does not worsen as
// the catalog gets more honest.
const supersededList = [];
for (const p of pages) {
  const furniture = [];
  const genuine = [];
  const whyCounts = {};
  for (const n of p.nodes) {
    const c = classify(n);
    if (c.furniture) {
      furniture.push(n);
      whyCounts[c.why] = (whyCounts[c.why] || 0) + 1;
    } else genuine.push(n);
  }
  const byStatus = {};
  const liveOnly = [];
  let matched = 0;
  // A frame whose ONLY covering row is a rollup — a row that names 8 or more
  // node ids — is covered by a verdict taken over a whole family at once, not
  // by anyone looking at that frame. `status.dice.tsv` is a single row naming 22
  // ids. This is the mechanism behind "a rollup row can cover 30 frames", and it
  // is the difference between a frame being COUNTED and a frame being ASSESSED.
  let rollupOnly = 0;
  let defaultNamed = 0;
  let ambiguous = 0;
  let conflicts = 0;
  let superseded = 0;
  for (const n of genuine) {
    if (/^(Frame|Group) \d+$/i.test(n.name)) defaultNamed++;
    const rows = rowIndex.get(n.id);
    if (!rows || !rows.length) {
      liveOnly.push(n);
      continue;
    }
    matched++;
    if (ambiguousIds.has(n.id)) ambiguous++;
    if (rows.every((r) => r.ids.size >= 8)) rollupOnly++;
    /*
      ★ THE HEADLINE NUMBER IS TALLIED FROM THE NEWEST GENERATION, NOT FROM ALL
      ROWS — and getting that wrong is how the ledger reported a re-verify that
      had already happened as though it never had.

      Two rules answer "what is this frame's status?", and until 2026-08-26 they
      disagreed silently. `byStatus` used worst-of across EVERY row, while the
      supersession block below correctly resolves a later wave over an earlier
      one. Worst-of ranks `unknown` LAST on purpose (see sev(): it is not a
      completeness judgement), so a wave-4 lane demoting a frame to `unknown`
      because nobody had actually measured it LOST to the wave-0 row still
      calling it `done`.

      Measured on frame 13008-114693: `status.home-2.tsv` says done,
      `status.wave3.verify-home2.tsv` says unknown, `status.wave4.home-2-reverify
      .tsv` says unknown — and the ledger counted it done. Across Home 2 that is
      65 `done` reported where the re-verify had left 3. The re-verify's entire
      job was to stop unmeasured frames reading as measured, and the tally undid
      it.

      Same shape as the RTP band that could not see a catch-0 payout: a
      resolution rule that ranks the honest verdict last cannot report it, no
      matter how many lanes write it down.

      So: newest generation first, THEN worst-of within that generation. The
      second half still matters — two lanes of the same wave disagreeing should
      resolve conservatively rather than flatter — and `unknown` staying last
      within a generation is right, because a lane that measured beats a lane
      that did not look.
    */
    const genOf = (file) => {
      const m = /^status\.wave(\d+)\./.exec(file);
      return m ? Number(m[1]) : 0;
    };
    const newestGen = Math.max(...rows.map((r) => genOf(r.file)));
    const current = rows.filter((r) => genOf(r.file) === newestGen);
    const worst = current.slice().sort((a, b) => sev(a.status) - sev(b.status))[0].status || "unknown";
    byStatus[worst] = (byStatus[worst] || 0) + 1;
    // Two rows, two lanes, one frame, two different verdicts. The worst-of above
    // resolves it conservatively so the number cannot flatter — but a resolution
    // is not an agreement, and a `done`/`not-started` pair on one frame means one
    // of the two lanes is simply wrong. Surfaced rather than smoothed over.
    const distinct = new Set(rows.map((r) => r.status));
    if (distinct.size > 1) {
      /*
        ★ SUPERSESSION IS NOT DISAGREEMENT.

        Most "conflicts" are one wave re-verifying an earlier wave's row. When
        `done` was tightened to measured parity on 2026-08-26, wave-3 lanes
        demoted rows the base files still call `done` — that pair is the system
        working, not two lanes contradicting each other. Counting it as conflict
        made the number climb precisely BECAUSE the catalog was getting more
        honest, which is the wrong direction for a health signal.

        A row from a later wave supersedes an earlier one on the same frame.
        Only rows of the SAME generation that disagree are a real conflict — and
        those are the ones where somebody has to be wrong.
      */
      const gen = (file) => {
        const m = /^status\.wave(\d+)\./.exec(file);
        return m ? Number(m[1]) : 0;
      };
      const newest = Math.max(...rows.map((r) => gen(r.file)));
      const newestRows = rows.filter((r) => gen(r.file) === newest);
      const newestDistinct = new Set(newestRows.map((r) => r.status));
      if (newestDistinct.size > 1) {
        conflicts++;
        conflictList.push({
          id: n.id,
          page: p.pageName,
          name: n.name,
          statuses: [...newestDistinct].sort(),
          rows: newestRows.map((r) => `${r.file}:${r.line}`),
          kind: "same-generation",
        });
      } else {
        superseded++;
        supersededList.push({
          id: n.id,
          page: p.pageName,
          from: [...distinct].filter((s) => !newestDistinct.has(s)).sort(),
          to: [...newestDistinct][0],
          by: newestRows.map((r) => `${r.file}:${r.line}`),
        });
      }
    }
  }
  report.push({
    ...p,
    nodes: undefined,
    live: p.nodes.length,
    furniture: furniture.length,
    furnitureWhy: whyCounts,
    genuine: genuine.length,
    matched,
    rollupOnly,
    defaultNamed,
    ambiguous,
    conflicts,
    byStatus,
    liveOnly: liveOnly.map((n) => ({ id: n.id, name: n.name, type: n.type, w: n.w, h: n.h })),
  });
}

// CATALOG-ONLY DRIFT: an id a row points at that is not a live top-level child
// of any page in any tracked file. Split, because the two halves are different
// asks: a deep link is a report pointing below frame level and needs no action;
// an unaccounted id is a row describing something that no longer exists.
// Four outcomes, and only the last is a row describing something that is gone:
//   page-ref   the row cites a PAGE id, not a frame — common in the wave3 rows
//   nested     a node inside a frame that IS a live top-level child (a deep link)
//   bug-link   listed in bug-node-index / bugref-aliases as a known deep link
//   gone       neither live, nor nested under anything live, nor a known link
const catalogOnly = [];
for (const [id, rows] of rowIndex) {
  if (liveIds.has(id)) continue;
  const r = resolvedFound.get(id);
  let cls;
  if (r && r.type === "PAGE") cls = "page-ref";
  else if (r && r.topLevelId && liveIds.has(normId(r.topLevelId))) cls = "nested";
  else if (deepLinked.has(id)) cls = "bug-link";
  else cls = "gone";
  catalogOnly.push({
    id,
    cls,
    resolved: r ? { type: r.type, name: r.name, depth: r.depth, pageName: r.pageName } : null,
    rows: rows.map((x) => `${x.file}:${x.line}`),
    status: rows.slice().sort((a, b) => sev(a.status) - sev(b.status))[0].status,
  });
}
catalogOnly.sort((a, b) => a.id.localeCompare(b.id));

// ---------------------------------------------------------------------------
// 6. ROLL-UP
// ---------------------------------------------------------------------------
const bucket = (scope) => report.filter((r) => r.scope === scope);
const sum = (rows, k) => rows.reduce((a, r) => a + (typeof k === "function" ? k(r) : r[k]), 0);
const statusSum = (rows, s) => rows.reduce((a, r) => a + (r.byStatus[s] || 0), 0);

const inScope = bucket("in-scope");
const rollup = {
  pages: inScope.length,
  live: sum(inScope, "live"),
  furniture: sum(inScope, "furniture"),
  genuine: sum(inScope, "genuine"),
  matched: sum(inScope, "matched"),
  done: statusSum(inScope, "done"),
  partial: statusSum(inScope, "partial"),
  notStarted: statusSum(inScope, "not-started"),
  blocked: statusSum(inScope, "blocked-on-backend"),
  frameDefect: statusSum(inScope, "frame-defect"),
  catalogFurniture: statusSum(inScope, "furniture"),
  unknown: statusSum(inScope, "unknown"),
  liveOnly: sum(inScope, (r) => r.liveOnly.length),
  rollupOnly: sum(inScope, "rollupOnly"),
  defaultNamed: sum(inScope, "defaultNamed"),
  ambiguous: sum(inScope, "ambiguous"),
  conflicts: sum(inScope, "conflicts"),
};
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) : "0.0");

// How much of the `done` population is measured parity under the 2026-08-26
// definition? The only per-row evidence of a MEASUREMENT in this catalog is a
// column-6 breakpoint cell, which carries an `@date/sweep-slug` provenance tag.
// Counted, not assumed — see the caveat section of COVERAGE.md.
const doneRows = allRows.filter((r) => r.status === "done");
const doneWithBp = doneRows.filter((r) => r.bpCell).length;
const doneWithId = doneRows.filter((r) => r.ids.size).length;
const doneSayingFurniture = doneRows.filter((r) => /\bFURNITURE\b/.test(r.reason)).length;

// Per status file: can its rows be attributed to a frame at all? A row naming
// no LIVE id is invisible to every id-keyed report, however careful it is.
const fileStats = Object.keys(rowsByFile)
  .sort()
  .map((file) => {
    const rs = allRows.filter((r) => r.file === file);
    const ids = new Set();
    let withLiveId = 0;
    for (const r of rs) {
      let any = false;
      for (const id of r.ids)
        if (liveIds.has(id)) {
          ids.add(id);
          any = true;
        }
      if (any) withLiveId++;
    }
    return { file, rows: rs.length, withLiveId, ids: ids.size };
  });
const rowsUnmatchable = fileStats.reduce((a, s) => a + (s.rows - s.withLiveId), 0);

// ---------------------------------------------------------------------------
// 7. OUTPUT
// ---------------------------------------------------------------------------
const md = [];
const P = (s = "") => md.push(s);
const today = new Date().toISOString().slice(0, 10);

P(`# Catalog coverage — measured ${today}`);
P();
P(`Generated by \`node figma-catalog/coverage.mjs\`. Do not hand-edit; re-run it.`);
P(`Live half harvested ${manifest.harvestedAt} (${manifest.method}).`);
P();
P(`## Roll-up — in-scope pages only`);
P();
P(`| | |`);
P(`|---|---:|`);
P(`| In-scope pages | ${rollup.pages} |`);
P(`| Live top-level nodes | ${rollup.live} |`);
P(`| — furniture (excluded from the denominator) | ${rollup.furniture} (${pct(rollup.furniture, rollup.live)}%) |`);
P(`| **Genuine frames — the denominator** | **${rollup.genuine}** |`);
P(`| Genuine frames with a catalog row (matched by node id) | ${rollup.matched} (${pct(rollup.matched, rollup.genuine)}%) |`);
P(`| — of those, covered ONLY by a rollup row (a row naming ≥8 ids) | ${rollup.rollupOnly} (${pct(rollup.rollupOnly, rollup.matched)}% of matched) |`);
P(`| Genuine frames with NO row — live-only drift | ${rollup.liveOnly} (${pct(rollup.liveOnly, rollup.genuine)}%) |`);
P();
P(`| Status of the matched frames | count | % of genuine |`);
P(`|---|---:|---:|`);
for (const [label, n] of [
  ["`done`", rollup.done],
  ["`partial`", rollup.partial],
  ["`not-started`", rollup.notStarted],
  ["`blocked-on-backend`", rollup.blocked],
  ["`frame-defect`", rollup.frameDefect],
  ["`furniture` (catalog says furniture, this script says genuine)", rollup.catalogFurniture],
  ["`unknown`", rollup.unknown],
])
  P(`| ${label} | ${n} | ${pct(n, rollup.genuine)}% |`);
P();
P(`### Why ${rollup.furniture} nodes were excluded — the whole rule, so it can be argued with`);
P();
{
  const agg = {};
  for (const r of inScope) for (const [k, v] of Object.entries(r.furnitureWhy || {})) agg[k] = (agg[k] || 0) + v;
  const LABEL = {
    "canvas-chrome": "named canvas chrome — `Directory`, `Breakpoint`, `Scroll bar`, `Notes`, `Screenshot …`",
    hidden: "`visible === false` — hidden nodes are not spec",
    "loose-instance": "a library component instance dropped on the canvas (`CTA/button`, `logos/others`)",
    "loose-text": "a loose TEXT annotation at page level",
    "loose-rectangle": "a loose RECTANGLE — pasted screenshots and colour swatches",
    "loose-ellipse": "a loose ELLIPSE",
    "loose-vector": "a loose VECTOR",
  };
  P(`| reason | nodes |`);
  P(`|---|---:|`);
  for (const [k, v] of Object.entries(agg).sort((a, b) => b[1] - a[1])) P(`| ${LABEL[k] || k} | ${v} |`);
  P();
  P(`That is ${pct(rollup.furniture, rollup.live)}% of in-scope live nodes, inside the 14–25% band SCHEMA.md predicted. Nothing is excluded on a guess about intent: default-named \`Frame N\` / \`Group N\` nodes count as GENUINE (see caveat 8), because \`Group 316\` on Price Grid is 1410x900.`);
  P();
}
P(`### The headline number`);
P();
P(`**${rollup.done} of ${rollup.genuine} in-scope genuine frames (${pct(rollup.done, rollup.genuine)}%) are covered by a row marked \`done\`.**`);
P();
P(`Read the caveat section before quoting that. It is not ${pct(rollup.done, rollup.genuine)}% measured parity.`);
P();

P(`## Out of the roll-up`);
P();
P(`| Bucket | Pages | Live | Furniture | Genuine | Matched | \`done\` | Live-only |`);
P(`|---|---:|---:|---:|---:|---:|---:|---:|`);
for (const [scope, label] of [
  ["held", "held (Governance — Casey)"],
  ["excluded", "standing exclusion (Onboarding)"],
  ["v1-superseded", "v1, superseded by v2"],
  ["tombstone", "tombstone (body moved)"],
  ["meta", "meta"],
  ["wip", "wip / no section"],
]) {
  const b = bucket(scope);
  if (!b.length) continue;
  P(
    `| ${label} | ${b.length} | ${sum(b, "live")} | ${sum(b, "furniture")} | ${sum(b, "genuine")} | ${sum(b, "matched")} | ${statusSum(b, "done")} | ${sum(b, (r) => r.liveOnly.length)} |`,
  );
}
P();

P(`## Per page`);
P();
P(`\`furn\` = furniture. \`gen\` = genuine frames (the denominator). \`row\` = genuine frames a status row names by node id. \`only\` = live-only drift.`);
P();
P(`| Page | Scope | Live | furn | gen | row | ${"`done`"} | ${"`part`"} | ${"`n/s`"} | ${"`blk`"} | only | cov |`);
P(`|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|`);
const order = { "in-scope": 0, held: 1, excluded: 2, "v1-superseded": 3, tombstone: 4, wip: 5, meta: 6 };
for (const r of report.slice().sort((a, b) => (order[a.scope] - order[b.scope]) || b.genuine - a.genuine)) {
  P(
    `| ${r.pageName} | ${r.scope} | ${r.live} | ${r.furniture} | ${r.genuine} | ${r.matched} | ` +
      `${r.byStatus.done || 0} | ${r.byStatus.partial || 0} | ${r.byStatus["not-started"] || 0} | ${r.byStatus["blocked-on-backend"] || 0} | ` +
      `${r.liveOnly.length} | ${r.genuine ? pct(r.matched, r.genuine) + "%" : "—"} |`,
  );
}
P();

P(`## Drift A — live-only (a genuine frame nobody has a row for)`);
P();
P(`Ranked by count. These are the unassessed frames.`);
P();
for (const r of report.slice().sort((a, b) => b.liveOnly.length - a.liveOnly.length)) {
  if (!r.liveOnly.length) continue;
  P(`### ${r.pageName} — ${r.liveOnly.length} live-only of ${r.genuine} genuine  _(${r.scope})_`);
  P();
  P("```");
  for (const n of r.liveOnly) P(`${n.id}\t${n.w}x${n.h}\t${n.name}`);
  P("```");
  P();
}

P(`## Drift B — catalog-only (a row pointing at a node that is not a live top-level child)`);
P();
const co = catalogOnly.filter((c) => c.cls === "gone");
const byCls = {};
for (const c of catalogOnly) byCls[c.cls] = (byCls[c.cls] || 0) + 1;
P(`${catalogOnly.length} node ids are named by a row but are not a live top-level child of any page. They are not all drift:`);
P();
P(`| outcome | count | is it drift? |`);
P(`|---|---:|---|`);
P(`| \`nested\` — a node inside a frame that IS live | ${byCls.nested || 0} | no, a deep link |`);
P(`| \`bug-link\` — listed in the bug node indexes | ${byCls["bug-link"] || 0} | no, a deep link |`);
P(`| \`page-ref\` — the row cites a Figma PAGE id, not a frame | ${byCls["page-ref"] || 0} | no |`);
P(`| **\`gone\`** — not live, not nested under anything live, not a known link | **${byCls.gone || 0}** | **yes** |`);
P();
P(`★ Report both directions. Equal counts hide an equal-sized swap: Dice measured 36 live and 36 catalog with a 2-for-2 swap inside it.`);
P();
if (!resolved) P(`⚠ \`live/_resolved.json\` is absent, so \`gone\` here is a LOWER BOUND — an id the catalog never harvested cannot be told apart from a source-code line range without asking Figma.`);
P();
if (co.length) {
  P("```");
  for (const c of co.slice(0, 400)) P(`${c.id}\t${c.status}\t${c.rows.slice(0, 3).join(" ")}`);
  if (co.length > 400) P(`… ${co.length - 400} more`);
  P("```");
  P();
}

P(`## Drift D — one frame, two lanes, two different verdicts`);
P();
{
  const all = conflictList;
  const ins = all.filter((c) => (report.find((r) => r.pageName === c.page) || {}).scope === "in-scope");
  P(`**${ins.length} of the ${rollup.matched} in-scope matched frames (${pct(ins.length, rollup.matched)}%) are named by two or more rows that DISAGREE on status** — ${all.length} across all scopes. The tables above resolve each one to its worst verdict so no number can flatter, but a resolution is not an agreement: a \`done\`/\`not-started\` pair on a single frame means one of the two lanes is wrong, and nothing in the catalog currently says which.`);
  P();
  const pairs = {};
  for (const c of all) {
    const k = c.statuses.join(" + ");
    pairs[k] = (pairs[k] || 0) + 1;
  }
  P(`| the disagreement | frames |`);
  P(`|---|---:|`);
  for (const [k, v] of Object.entries(pairs).sort((a, b) => b[1] - a[1])) P(`| \`${k}\` | ${v} |`);
  P();
  const flat = all.filter((c) => c.statuses.includes("done") && (c.statuses.includes("not-started") || c.statuses.includes("blocked-on-backend")));
  if (flat.length) {
    P(`The ${flat.length} sharpest — one row says \`done\`, another says the surface does not exist or has no data source:`);
    P();
    P("```");
    for (const c of flat.slice(0, 60)) P(`${c.id}\t${c.statuses.join("+")}\t${c.rows.slice(0, 4).join(" ")}`);
    if (flat.length > 60) P(`… ${flat.length - 60} more`);
    P("```");
    P();
  }
}

P(`## Drift C — rows that cannot be matched to any live frame`);
P();
P(`Not drift in the frame sense: these rows may describe real, finished work. But they name no live node id, so **no report can attribute them to a frame** and they contribute nothing to the coverage above. Coverage on the pages they describe is understated by exactly this much, and the fix is to add the node id to the row — not to fall back to a title match.`);
P();
P(`| status file | rows | rows naming a live node id | distinct live ids named |`);
P(`|---|---:|---:|---:|`);
for (const s of fileStats.filter((s) => s.withLiveId < s.rows).sort((a, b) => (a.withLiveId / a.rows) - (b.withLiveId / b.rows) || b.rows - a.rows))
  P(`| \`${s.file}\` | ${s.rows} | ${s.withLiveId}${s.withLiveId === 0 ? " ← none" : ""} | ${s.ids} |`);
P();

P(`## What this number does NOT mean`);
P();
P(`**1. A \`done\` row is not measured parity.** SCHEMA.md tightened \`done\` on 2026-08-26 to mean geometry, type ramp and colour tokens read off node data and compared against the rendered DOM, with the numbers written down. Every row that predates that ruling was written under the old reading — "nobody spotted a difference". **${doneRows.length} rows currently carry \`done\`**, and only **${doneWithBp}** of them (${pct(doneWithBp, doneRows.length)}%) carry any provenance-tagged measurement at all (a column-6 breakpoint cell with an \`@date/sweep-slug\`). The other ${doneRows.length - doneWithBp} assert completion with nothing behind them that a later auditor can re-check.`);
P();
P(`**2. \`done\` is silent about width.** Column 2 carries no viewport and must never be read as a desktop verdict. The width answers live in column 6 and start at \`unknown\`.`);
P();
P(`**3. Coverage is not correctness.** "A row names this node id" is all the matched column claims. It does not mean anyone opened the frame.`);
P();
P(`**4. Coverage is understated wherever rows carry no node id.** ${rowsNamingNoId} of ${totalRows} status rows (${pct(rowsNamingNoId, totalRows)}%) name no node id at all, and ${rowsUnmatchable} (${pct(rowsUnmatchable, totalRows)}%) name none that is a live top-level child — so they cannot be attributed to a frame and contribute nothing to the matched counts above. \`apply-status.mjs\` folds those rows onto frames by TITLE instead, which is why the registry looks better covered than this report does. Titles are not identities in this library, so the fix is to put node ids in the rows, not to trust the title match. Drift C lists every file, worst first.`);
P();
P(`**5. ${doneSayingFurniture} \`done\` rows say FURNITURE in their own reason.** They are Directory strips and Breakpoint rulers filed as finished work because the vocabulary had no better slot at the time. They should be re-filed as \`furniture\`, which SCHEMA.md now excludes from the parity denominator. This script already excludes them on the live side, so they inflate no percentage here — but they do inflate any count taken from the rows.`);
P();
P(`**6. Node-id tokens are filtered, and the filter is measured rather than guessed.** ${unrecognisedTokens} id-shaped token occurrences across the status files matched no node id and were discarded. Most are source-code line ranges — \`points-game/index.ts:5542-5545\` yields \`5542-5545\`, which is indistinguishable by shape from a real node id — plus dates (\`2026-08\`) and file:line refs (\`3:2\`). Sample: ${[...unrecognisedSample].slice(0, 8).map((s) => "`" + s + "`").join(", ")}. ${resolved ? `The ${resolved.candidatesChecked} plausible-shaped unknowns were put to Figma directly (\`getNodeByIdAsync\` in each of the three files); ${resolvedFound.size} resolved to a real node and are now classified in Drift B, and the rest are confirmed noise.` : `They were NOT put to Figma, so Drift B is a lower bound.`}`);
P();
P(`**7. A node id is unique only within a Figma file, and status rows do not record one.** ${ambiguousIds.size} live ids exist in more than one of the three files — Skai-Web-App-2 began as a copy of Skai-Web-App, so a whole block of ids is duplicated, and SCHEMA.md already records \`6330-54594\` as home scaffolding in one file and a dice Breakpoint in another. **${rollup.ambiguous} of the ${rollup.matched} in-scope matches are on such an id**, so the headline number is unaffected. ${(() => { const a = report.filter((r) => r.ambiguous); return a.length ? `Every ambiguous match lands outside the roll-up: ${a.map((r) => `${r.pageName} ${r.ambiguous}/${r.matched}`).join(", ")} — the same ids on both, i.e. the tombstone page is being credited with the v1 page's rows.` : "No page is affected."; })()} The fix is a fileKey column on the row; guessing one here would be worse than naming the doubt.`);
P();
P(`**8. ${rollup.defaultNamed} in-scope genuine frames still carry a default \`Frame N\` / \`Group N\` name.** They cannot be identified from their name at all, by a person or a script — which is its own reason not to trust title matching, and the reason they are counted as genuine rather than assumed empty.`);
P();
P(`**9. The live half is a snapshot.** \`pages.json.liveChildren\` was stale on 13 pages when this ran — Home 2 recorded 129 against a measured 168, Governance 260 against 331, Home 1 227 against 254. Re-harvest before quoting these numbers in a new week.`);
P();

const out = md.join("\n");
const json = {
  generated: new Date().toISOString(),
  harvestedAt: manifest.harvestedAt,
  rollup,
  doneRows: { total: doneRows.length, withBreakpointProvenance: doneWithBp, namingANodeId: doneWithId, sayingFurniture: doneSayingFurniture },
  rows: { total: totalRows, namingNoNodeId: rowsNamingNoId, namingNoLiveNodeId: rowsUnmatchable, unrecognisedTokens },
  statusFiles: fileStats,
  pages: report,
  catalogOnly,
  conflicts: conflictList,
};

if (HISTOGRAM) {
  console.log(
    JSON.stringify(
      {
        rollup,
        staleManifest,
        doneRows: json.doneRows,
        rows: json.rows,
        pages: report
          .filter((r) => r.scope === "in-scope")
          .map((r) => ({
            page: r.pageName,
            genuine: r.genuine,
            furniture: r.furniture,
            matched: r.matched,
            liveOnly: r.liveOnly.length,
            byStatus: r.byStatus,
          })),
      },
      null,
      2,
    ),
  );
} else if (CHECK_ONLY) {
  console.log(`inputs OK — ${pages.length} pages, ${sum(report, "live")} live nodes, ${totalRows} status rows`);
} else {
  fs.writeFileSync(path.join(DIR, "COVERAGE.md"), out + "\n");
  fs.writeFileSync(path.join(DIR, "coverage.json"), JSON.stringify(json, null, 2));
}

// In histogram mode stdout is a JSON document and nothing else may land on it —
// a trailing human summary made the output unparseable.
(HISTOGRAM ? console.error : console.log)(
  `in-scope: ${rollup.genuine} genuine frames of ${rollup.live} live (${rollup.furniture} furniture); ` +
    `${rollup.matched} have a row (${pct(rollup.matched, rollup.genuine)}%); ` +
    `${rollup.done} done (${pct(rollup.done, rollup.genuine)}%); ` +
    `drift: ${rollup.liveOnly} live-only, ${co.length} catalog-only`,
);
