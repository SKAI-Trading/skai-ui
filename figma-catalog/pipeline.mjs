#!/usr/bin/env node
/**
 * pipeline.mjs — regenerate every derived catalog file in the one order that
 * is correct, and prove the run kept what was set by hand.
 *
 *   node figma-catalog/pipeline.mjs            regenerate           (npm run catalog)
 *   node figma-catalog/pipeline.mjs --check    regenerate, exit 1 if any derived file was stale
 *                                                                   (npm run catalog:check)
 *   node figma-catalog/pipeline.mjs drift      live/ -> snapshot -> validate -> figma-drift
 *                                                                   (npm run catalog:drift)
 *   node figma-catalog/pipeline.mjs --self-test
 *
 * The order is fixed because two of the steps are not commutative:
 *
 *   coverage.mjs --check   refuses a short harvest BEFORE anything is rebuilt
 *   build-registry.mjs     nodes.txt + titles.tsv + citations -> registry.json,
 *                          carrying hand-set fields forward from the prior file
 *   families.mjs           registry.json -> families.json
 *   apply-status.mjs       status.<section>.tsv -> per-frame status/route/notes
 *   (retire implFiles)     in-process: drop the entries implfile-retirements.tsv
 *                          lists. Straight after apply-status, which appends
 *                          column 3 and would put a retired entry back.
 *   apply-verify.mjs       vverify.<section>.tsv -> visual verdicts. MUST run
 *                          after apply-status: it downgrades an over-optimistic
 *                          `done`, and apply-status would put the `done` back.
 *                          On 2026-09-09 the committed registry carried 163
 *                          frames as done whose own vverify rows said partial,
 *                          because apply-status had been the last thing run.
 *   catalog-view.mjs       registry.json -> figma-frame-catalog.md. Needs the
 *                          path as an argument; `> file` is not a file on Windows.
 *   bp-report.mjs          breakpoint coverage; exits 1 on a malformed column 6
 *   coverage.mjs           live vs catalog -> coverage.json, COVERAGE.md,
 *                          WAVE10-INTEGRITY.md
 *
 * What it proves afterwards: no frame that survived the rebuild lost its
 * verifiedAt, or any implFiles entry implfile-retirements.tsv does not list.
 * status and notes legitimately move when a TSV changed, so those are
 * reported, not enforced.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY = path.join(DIR, "registry.json");

const STEPS = [
  ["coverage.mjs", ["--check"]],
  ["build-registry.mjs", []],
  ["families.mjs", []],
  ["apply-status.mjs", []],
  ["apply-verify.mjs", []],
  ["catalog-view.mjs", ["figma-frame-catalog.md"]],
  ["bp-report.mjs", []],
  ["coverage.mjs", []],
];

const DERIVED = [
  "registry.json",
  "families.json",
  "figma-frame-catalog.md",
  "coverage.json",
  "COVERAGE.md",
  "WAVE10-INTEGRITY.md",
];

const HAND_SET = ["implFiles", "status", "notes", "verifiedAt", "route", "bpStatus"];
const HARVEST_STALE_DAYS = 14;

// ── pure helpers (self-tested) ───────────────────────────────────────────────

/**
 * Text with every timestamp-bearing line removed, so two runs of the same
 * inputs compare equal. Every derived file stamps when it was generated, and
 * that stamp is the one thing a regeneration is allowed to change. Only a full
 * ISO instant counts as a stamp: a derived file that prints a bare run DATE is
 * a file that changes every day, and --check is right to call it stale. The
 * self-test pins both halves (COVERAGE.md did exactly that until 2026-09-24).
 */
export function stableText(s) {
  return String(s)
    .split(/\r?\n/)
    .filter((l) => !/\b20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/.test(l))
    .join("\n");
}

const has = (v) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && !v.length);

/** Hand-set fields per frame key, for the before/after comparison. */
export function handSet(reg) {
  const out = {};
  for (const [k, f] of Object.entries(reg.frames || {})) {
    out[k] = {};
    for (const h of HAND_SET) out[k][h] = f[h];
  }
  return out;
}

/**
 * Compare hand-set fields on frames present in both. Losing verifiedAt, or any
 * implFiles entry that implfile-retirements.tsv does not list, is a broken
 * invariant — build-registry is supposed to carry both forward. Anything else
 * that moved is reported so a reader can see the pipeline did work, and which
 * work.
 *
 * Until 2026-09-24 only an implFiles list going from non-empty to EMPTY was
 * refused, so one entry of several could vanish unnoticed, and there was no
 * way at all to drop an entry naming a deleted file: nothing removes one, and
 * the guard stopped anything that tried. Now every entry is accounted for.
 */
export function compareHandSet(before, after, retirements = []) {
  const gone = Object.keys(before).filter((k) => !(k in after));
  const added = Object.keys(after).filter((k) => !(k in before));
  const changed = {};
  const lost = [];
  for (const k of Object.keys(before)) {
    if (!(k in after)) continue;
    for (const h of HAND_SET) {
      const b = before[k][h];
      const a = after[k][h];
      if (JSON.stringify(b) === JSON.stringify(a)) continue;
      changed[h] = (changed[h] || 0) + 1;
      if (h === "implFiles") {
        const kept = new Set((Array.isArray(a) ? a : []).map((e) => String(e).trim()));
        for (const e of Array.isArray(b) ? b : [])
          if (!kept.has(String(e).trim()) && !retiredFor(retirements, k, e))
            lost.push(`${k} lost implFiles entry ${JSON.stringify(e)}, which implfile-retirements.tsv does not list`);
      } else if (h === "verifiedAt" && has(b) && !has(a)) lost.push(`${k} lost ${h}`);
    }
  }
  return { gone, added, changed, lost };
}

// ── implFiles retirement ─────────────────────────────────────────────────────
/*
  ★ THE ONE REVIEWED WAY AN implFiles ENTRY LEAVES registry.json.

  implFiles only ever grows: build-registry carries the prior list forward and
  apply-status appends each status row's column 3. So a file deleted from the
  repo stays named as a frame's implementation forever, and so does every
  placeholder a row wrote in column 3 ("—", "no", "NONE - there is none").
  Measured 2026-09-24: 7 paths that do not exist on 57 frames, and 8
  placeholder strings on 327 more.

  implfile-retirements.tsv lists them: frame key (or `*` for every frame that
  carries the entry), the exact entry, the date, and the reason — which names
  the commit that deleted the file, or says the path never existed. The retire
  step runs right after apply-status, because apply-status would re-append a
  status row's column 3 if it ran later. A listed entry any of whose paths
  still exists is refused before anything runs: this table retires files that
  are gone, never a live file somebody would rather not see.
*/
export const RETIREMENTS_FILE = "implfile-retirements.tsv";

/** Parse the table. Malformed rows are errors, never skipped. */
export function parseRetirements(text) {
  const rows = [];
  const errors = [];
  String(text)
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (!line.trim() || line.trimStart().startsWith("#")) return;
      const [frame = "", entry = "", date = "", ...rest] = line.split("\t");
      const reason = rest.join(" ").trim();
      const at = `${RETIREMENTS_FILE}:${i + 1}`;
      if (!frame.trim() || !entry.trim()) errors.push(`${at}: needs a frame key (or *) and the exact implFiles entry`);
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) errors.push(`${at}: the date must be YYYY-MM-DD, got ${JSON.stringify(date)}`);
      else if (!reason) errors.push(`${at}: needs a reason naming the commit that removed the file, or saying it never existed`);
      else rows.push({ at, frame: frame.trim(), entry: entry.trim(), date: date.trim(), reason });
    });
  return { rows, errors };
}

/** The path-like parts of an entry. A placeholder ("—", "no") has none. */
export function entryPaths(entry) {
  return String(entry)
    .split(/\s+\+\s+|,\s+/)
    .map((s) => s.trim())
    .filter((s) => s.includes("/") || /\.[A-Za-z]{1,5}$/.test(s));
}

export const retiredFor = (rows, key, entry) =>
  rows.some((r) => (r.frame === "*" || r.frame === key) && r.entry === String(entry).trim());

/** Rows naming a path that exists, per `exists`. Each one is a refusal. */
export function refusedRetirements(rows, exists) {
  const out = [];
  for (const r of rows)
    for (const p of entryPaths(r.entry)) if (exists(p)) out.push(`${r.at}: ${p} still exists — retire only an entry naming no file that exists`);
  return out;
}

/** Drop every listed entry from the registry in place. */
export function applyRetirements(reg, rows) {
  const removed = [];
  const used = new Set();
  for (const [k, f] of Object.entries(reg.frames || {})) {
    if (!Array.isArray(f.implFiles) || !f.implFiles.length) continue;
    const keep = [];
    for (const e of f.implFiles) {
      const r = rows.find((x) => (x.frame === "*" || x.frame === k) && x.entry === String(e).trim());
      if (r) {
        removed.push(`${k}\t${e}`);
        used.add(r.at);
      } else keep.push(e);
    }
    f.implFiles = keep;
  }
  return { removed, unused: rows.filter((r) => !used.has(r.at)).map((r) => r.at) };
}

/**
 * implFiles paths are relative to the Skai-Trading checkout this submodule sits
 * in (SCHEMA.md). Outside one — a scratch export — they cannot be checked, and
 * the run says so rather than passing the check vacuously.
 */
function checkoutRoot() {
  const root = path.resolve(DIR, "..", "..", "..");
  const here = path.join(root, "modules", "skai-ui", "figma-catalog");
  try {
    return fs.realpathSync(here) === fs.realpathSync(DIR) ? root : null;
  } catch {
    return null;
  }
}

function loadRetirements() {
  const p = path.join(DIR, RETIREMENTS_FILE);
  const { rows, errors } = parseRetirements(readIf(p));
  if (errors.length) {
    console.error(`pipeline: ${RETIREMENTS_FILE} is malformed — nothing was run:\n  ${errors.join("\n  ")}`);
    process.exit(1);
  }
  const root = checkoutRoot();
  if (!root) {
    const n = rows.filter((r) => entryPaths(r.entry).length).length;
    console.log(`pipeline: not inside a Skai-Trading checkout, so ${n} retired path(s) in ${RETIREMENTS_FILE} were NOT checked for still existing.`);
  } else {
    const refused = refusedRetirements(rows, (p2) => fs.existsSync(path.join(root, p2)));
    if (refused.length) {
      console.error(`pipeline: ${RETIREMENTS_FILE} retires ${refused.length} path(s) that still exist — nothing was run:\n  ${refused.join("\n  ")}`);
      process.exit(1);
    }
  }
  return rows;
}

function retireStep(rows) {
  console.log(`\n── retire implFiles (${RETIREMENTS_FILE}) ${"─".repeat(37)}`);
  const reg = readJson(REGISTRY);
  const { removed, unused } = applyRetirements(reg, rows);
  fs.writeFileSync(REGISTRY, JSON.stringify(reg, null, 2));
  console.log(`${rows.length} row(s); ${removed.length} entr${removed.length === 1 ? "y" : "ies"} removed this run.`);
  if (unused.length) console.log(`  rows matching no frame this run (already retired, or a typo): ${unused.join(", ")}`);
}

// ── running ──────────────────────────────────────────────────────────────────
function run(script, args) {
  const label = [script, ...args].join(" ");
  console.log(`\n── ${label} ${"─".repeat(Math.max(4, 70 - label.length))}`);
  const r = spawnSync(process.execPath, [path.join(DIR, script), ...args], { cwd: DIR, stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`\npipeline: ${label} exited ${r.status}. Nothing after it was run; the derived files are now mixed between the old and new inputs — fix the cause and run again.`);
    process.exit(r.status || 1);
  }
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const readIf = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

function harvestAge() {
  const p = path.join(DIR, "live", "_pages.json");
  if (!fs.existsSync(p)) return null;
  const at = readJson(p).harvestedAt;
  if (!at) return null;
  return Math.floor((Date.now() - new Date(at).getTime()) / 86400000);
}

function regenerate({ check }) {
  const age = harvestAge();
  if (age == null) console.log("pipeline: live/_pages.json has no harvestedAt — the live harvest is undated.");
  else if (age > HARVEST_STALE_DAYS) console.log(`pipeline: live harvest is ${age} days old (> ${HARVEST_STALE_DAYS}). Figma may have moved; see README.md, "Keeping it in step with Figma".`);
  else console.log(`pipeline: live harvest is ${age} day(s) old.`);

  const retirements = loadRetirements();
  const before = fs.existsSync(REGISTRY) ? handSet(readJson(REGISTRY)) : {};
  const priorText = Object.fromEntries(DERIVED.map((f) => [f, stableText(readIf(path.join(DIR, f)))]));

  for (const [script, args] of STEPS) {
    run(script, args);
    // Right after apply-status, which appends column 3 and would otherwise put
    // a retired entry straight back; before apply-verify, catalog-view and
    // coverage, which all read the list.
    if (script === "apply-status.mjs") retireStep(retirements);
  }

  const after = handSet(readJson(REGISTRY));
  const cmp = compareHandSet(before, after, retirements);
  console.log(`\n── hand-set fields ${"─".repeat(52)}`);
  console.log(`frames ${Object.keys(before).length} -> ${Object.keys(after).length}  (gone ${cmp.gone.length}, new ${cmp.added.length})`);
  for (const k of cmp.gone.slice(0, 12)) console.log(`  gone  ${k}`);
  for (const k of cmp.added.slice(0, 12)) console.log(`  new   ${k}`);
  const moved = Object.entries(cmp.changed);
  console.log(moved.length ? `changed on surviving frames: ${moved.map(([h, n]) => `${h} ${n}`).join(", ")}` : "changed on surviving frames: none");
  if (cmp.lost.length) {
    console.error(`\npipeline: INVARIANT BROKEN — ${cmp.lost.length} hand-set value(s) lost that build-registry must carry forward (an implFiles entry leaves only through ${RETIREMENTS_FILE}):`);
    for (const l of cmp.lost.slice(0, 20)) console.error(`  ${l}`);
    process.exit(2);
  }

  const stale = DERIVED.filter((f) => stableText(readIf(path.join(DIR, f))) !== priorText[f]);
  console.log(`\n── derived files ${"─".repeat(54)}`);
  if (!stale.length) console.log("every derived file already matched its inputs (only generation stamps moved).");
  else for (const f of stale) console.log(`  regenerated ${f}`);
  if (check && stale.length) {
    console.error(`\npipeline --check: ${stale.length} derived file(s) were stale. They are regenerated now — review and commit them.`);
    process.exit(1);
  }
}

function drift() {
  const snap = "snapshot.live.json";
  run("harvest.mjs", ["to-snapshot", "--out", snap]);
  run("validate-snapshot.mjs", [snap]);
  run("figma-drift.mjs", [snap]);
  console.log(`
pipeline drift: read figma-todo.live.tsv (most actionable first). Then:
  node figma-catalog/snapshot-to-nodes.mjs figma-catalog/${snap}            # dry run: what would fold in
  node figma-catalog/snapshot-to-nodes.mjs figma-catalog/${snap} --write    # only where every section was certified
  node figma-catalog/pipeline.mjs                                           # rebuild from the folded-in inputs
A REMOVED id that a probe certified gone belongs in bugref-aliases.tsv as \`gone\` (README.md).`);
}

/**
 * Run a catalog script with the process clock pinned to `iso`, through a
 * data: URL preload that replaces Date. Used by the self-test to prove a
 * derived file does not depend on the day it was generated.
 */
function runAt(iso, args) {
  const clock = `const R=Date;const T=R.parse(${JSON.stringify(iso)});globalThis.Date=class extends R{constructor(...a){super(...(a.length?a:[T]))}static now(){return T}};`;
  const r = spawnSync(process.execPath, ["--import", `data:text/javascript,${encodeURIComponent(clock)}`, ...args], {
    cwd: DIR,
    encoding: "utf8",
    maxBuffer: 1 << 27,
  });
  return { status: r.status, out: r.stdout || "", err: r.stderr || "" };
}

const firstDifference = (a, b) => {
  const x = a.split("\n");
  const y = b.split("\n");
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    if (x[i] !== y[i]) return `line ${i + 1}: ${JSON.stringify((x[i] || "").slice(0, 90))} vs ${JSON.stringify((y[i] || "").slice(0, 90))}`;
  return "identical";
};

function selfTest() {
  let pass = 0;
  let fail = 0;
  const check = (name, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `\n        ${detail}`}`);
    ok ? pass++ : fail++;
  };
  check("stableText drops only timestamp-bearing lines", stableText('{\n  "generated": "2026-09-09T10:28:08.807Z",\n  "n": 3\n}') === '{\n  "n": 3\n}');
  // The comparison must stay strict. A bare date is content, not a generation
  // stamp: widening this filter to hide one would have made the 2026-09-24
  // everyday-stale COVERAGE.md read clean while it still changed every day.
  check(
    "stableText keeps a line carrying only a date, so a run date in a derived file still reads as stale",
    stableText("# Catalog coverage — measured 2026-09-23\nbody") === "# Catalog coverage — measured 2026-09-23\nbody",
  );

  // ★ A derived file must be byte-identical when its inputs are. COVERAGE.md
  // used to open with `measured <today>`, so `--check` exited 1 on every new
  // day with nothing changed and a genuinely stale file could not be told
  // apart. Reads the catalog, writes nothing (coverage.mjs --markdown).
  const probe = runAt("2031-01-02T03:04:05.000Z", ["-e", "process.stdout.write(new Date().toISOString() + ' ' + Date.now())"]);
  check(
    "positive control: the pinned clock really replaces Date in the child",
    probe.status === 0 && probe.out === `2031-01-02T03:04:05.000Z ${Date.parse("2031-01-02T03:04:05.000Z")}`,
    `child printed ${JSON.stringify(probe.out)} (exit ${probe.status}) ${probe.err.split("\n")[0]}`,
  );
  const mdEarly = runAt("2031-01-02T03:04:05.000Z", [path.join(DIR, "coverage.mjs"), "--markdown"]);
  const mdLate = runAt("2033-06-07T20:21:22.000Z", [path.join(DIR, "coverage.mjs"), "--markdown"]);
  check(
    "COVERAGE.md is the same bytes under two different clocks, and neither clock's date appears in it",
    mdEarly.status === 0 &&
      mdLate.status === 0 &&
      mdEarly.out.length > 0 &&
      mdEarly.out === mdLate.out &&
      !mdEarly.out.includes("2031-01-02") &&
      !mdLate.out.includes("2033-06-07"),
    mdEarly.status !== 0 || mdLate.status !== 0
      ? `coverage.mjs --markdown exited ${mdEarly.status}/${mdLate.status}: ${(mdEarly.err || mdLate.err).split("\n")[0]}`
      : firstDifference(mdEarly.out, mdLate.out),
  );
  const b = { A: { implFiles: ["x.tsx"], status: "done", notes: "n", verifiedAt: "2026-09-01T00:00:00.000Z", route: "/a", bpStatus: "unknown" }, G: { implFiles: [], status: "unknown" } };
  const a = { A: { implFiles: [], status: "partial", notes: "n", verifiedAt: "2026-09-01T00:00:00.000Z", route: "/a", bpStatus: "unknown" }, N: { status: "unknown" } };
  const r = compareHandSet(b, a);
  check("compareHandSet: a surviving frame that lost implFiles breaks the invariant; a status move is only reported", r.lost.length === 1 && /A lost implFiles/.test(r.lost[0]) && r.changed.status === 1 && r.gone.join() === "G" && r.added.join() === "N", JSON.stringify(r));
  const r2 = compareHandSet({ A: { status: "done" } }, { A: { status: "done", verifiedAt: "2026-09-09T00:00:00.000Z" } });
  check("compareHandSet: gaining a field is not a loss", r2.lost.length === 0 && r2.changed.verifiedAt === 1);

  // ── implFiles retirement ──
  const one = compareHandSet({ A: { implFiles: ["src/a.tsx", "src/b.tsx"] } }, { A: { implFiles: ["src/a.tsx"] } });
  check(
    "compareHandSet refuses ONE unlisted implFiles entry leaving, even while others remain",
    one.lost.length === 1 && /src\/b\.tsx/.test(one.lost[0]),
    JSON.stringify(one.lost),
  );
  const listed = compareHandSet({ A: { implFiles: ["src/a.tsx", "src/b.tsx"] } }, { A: { implFiles: [] } }, [
    { frame: "*", entry: "src/a.tsx" },
    { frame: "A", entry: "src/b.tsx" },
  ]);
  check("compareHandSet accepts removals the table lists, down to an empty list", listed.lost.length === 0, JSON.stringify(listed.lost));
  const elsewhere = compareHandSet({ B: { implFiles: ["src/b.tsx"] } }, { B: { implFiles: [] } }, [{ frame: "A", entry: "src/b.tsx" }]);
  check("a row keyed to one frame does not license the same entry leaving another", elsewhere.lost.length === 1, JSON.stringify(elsewhere.lost));
  const parsed = parseRetirements(
    [
      "# frame\tentry\tdate\treason",
      "*\tsrc/gone.tsx\t2026-09-24\tdeleted in abc1234",
      "F1\tsrc/only-f1.tsx\t2026-09-24\tdeleted in abc1234",
      "*\tsrc/undated.tsx\t\tdeleted in abc1234",
      "*\tsrc/unreasoned.tsx\t2026-09-24\t",
      "\tsrc/no-frame.tsx\t2026-09-24\tdeleted in abc1234",
    ].join("\n"),
  );
  check(
    "parseRetirements keeps well-formed rows and refuses one missing its date, its reason or its frame",
    parsed.rows.length === 2 && parsed.errors.length === 3,
    JSON.stringify(parsed),
  );
  check(
    "entryPaths finds each path in a compound entry and none in a placeholder",
    entryPaths("src/a/b.tsx + c.tsx").length === 2 &&
      entryPaths("modules/x/src/dir/").length === 1 &&
      entryPaths("—").length === 0 &&
      entryPaths("NONE - there is none").length === 0,
  );
  check(
    "a listed path that still exists is refused; a gone path and a placeholder are not",
    refusedRetirements(
      [
        { at: "t:1", entry: "src/live.tsx" },
        { at: "t:2", entry: "src/gone.tsx" },
        { at: "t:3", entry: "—" },
        { at: "t:4", entry: "src/gone.tsx + src/live.tsx" },
      ],
      (p) => p === "src/live.tsx",
    ).length === 2,
  );
  const reg = { frames: { F1: { implFiles: ["src/gone.tsx", "src/keep.tsx", "src/only-f1.tsx"] }, F2: { implFiles: ["src/only-f1.tsx", "src/gone.tsx"] } } };
  const applied = applyRetirements(reg, parsed.rows);
  check(
    "applyRetirements drops a `*` entry everywhere and a frame-keyed entry on that frame only",
    JSON.stringify(reg.frames.F1.implFiles) === '["src/keep.tsx"]' && JSON.stringify(reg.frames.F2.implFiles) === '["src/only-f1.tsx"]' && applied.removed.length === 3,
    JSON.stringify(reg),
  );
  const reapplied = applyRetirements(reg, parsed.rows);
  check("...and a second run removes nothing and reports the rows as unused", reapplied.removed.length === 0 && reapplied.unused.length === 2);
  // The committed table itself. Reads the tree, writes nothing.
  const committed = parseRetirements(readIf(path.join(DIR, RETIREMENTS_FILE)));
  const root = checkoutRoot();
  if (committed.errors.length) check(`the committed ${RETIREMENTS_FILE} parses`, false, committed.errors.join("; "));
  else if (!root) console.log(`  SKIP  the committed ${RETIREMENTS_FILE}'s paths: not inside a Skai-Trading checkout, so they cannot be checked here`);
  else {
    const live = refusedRetirements(committed.rows, (p) => fs.existsSync(path.join(root, p)));
    check(`the committed ${RETIREMENTS_FILE} parses and retires no path that exists (${committed.rows.length} rows)`, live.length === 0, live.join("; "));
  }
  console.log(`\nself-test: ${pass}/${pass + fail} passed.`);
  process.exit(fail ? 1 : 0);
}

// Only when run as a script. The helpers above are exported, and importing this
// file used to run a whole regeneration off the importer's argv.
const IS_MAIN = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const argv = process.argv.slice(2);
if (!IS_MAIN) {
  /* imported for its helpers */
} else if (argv.includes("--self-test")) selfTest();
else if (argv[0] === "drift") drift();
else if (!argv.length || argv[0] === "--check") regenerate({ check: argv[0] === "--check" });
else {
  console.error(`pipeline: unknown argument ${argv.join(" ")}\n  node figma-catalog/pipeline.mjs [--check] | drift | --self-test`);
  process.exit(1);
}
