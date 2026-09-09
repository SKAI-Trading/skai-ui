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
 * implFiles or its verifiedAt. status and notes legitimately move when a TSV
 * changed, so those are reported, not enforced.
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
 * that stamp is the one thing a regeneration is allowed to change.
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
 * Compare hand-set fields on frames present in both. Losing implFiles or
 * verifiedAt is a broken invariant — build-registry is supposed to carry both
 * forward. Anything else that moved is reported so a reader can see the
 * pipeline did work, and which work.
 */
export function compareHandSet(before, after) {
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
      if ((h === "implFiles" || h === "verifiedAt") && has(b) && !has(a)) lost.push(`${k} lost ${h}`);
    }
  }
  return { gone, added, changed, lost };
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

  const before = fs.existsSync(REGISTRY) ? handSet(readJson(REGISTRY)) : {};
  const priorText = Object.fromEntries(DERIVED.map((f) => [f, stableText(readIf(path.join(DIR, f)))]));

  for (const [script, args] of STEPS) run(script, args);

  const after = handSet(readJson(REGISTRY));
  const cmp = compareHandSet(before, after);
  console.log(`\n── hand-set fields ${"─".repeat(52)}`);
  console.log(`frames ${Object.keys(before).length} -> ${Object.keys(after).length}  (gone ${cmp.gone.length}, new ${cmp.added.length})`);
  for (const k of cmp.gone.slice(0, 12)) console.log(`  gone  ${k}`);
  for (const k of cmp.added.slice(0, 12)) console.log(`  new   ${k}`);
  const moved = Object.entries(cmp.changed);
  console.log(moved.length ? `changed on surviving frames: ${moved.map(([h, n]) => `${h} ${n}`).join(", ")}` : "changed on surviving frames: none");
  if (cmp.lost.length) {
    console.error(`\npipeline: INVARIANT BROKEN — ${cmp.lost.length} frame(s) lost a field build-registry must carry forward:`);
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

function selfTest() {
  let pass = 0;
  let fail = 0;
  const check = (name, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `\n        ${detail}`}`);
    ok ? pass++ : fail++;
  };
  check("stableText drops only timestamp-bearing lines", stableText('{\n  "generated": "2026-09-09T10:28:08.807Z",\n  "n": 3\n}') === '{\n  "n": 3\n}');
  const b = { A: { implFiles: ["x.tsx"], status: "done", notes: "n", verifiedAt: "2026-09-01T00:00:00.000Z", route: "/a", bpStatus: "unknown" }, G: { implFiles: [], status: "unknown" } };
  const a = { A: { implFiles: [], status: "partial", notes: "n", verifiedAt: "2026-09-01T00:00:00.000Z", route: "/a", bpStatus: "unknown" }, N: { status: "unknown" } };
  const r = compareHandSet(b, a);
  check("compareHandSet: a surviving frame that lost implFiles breaks the invariant; a status move is only reported", r.lost.length === 1 && /A lost implFiles/.test(r.lost[0]) && r.changed.status === 1 && r.gone.join() === "G" && r.added.join() === "N", JSON.stringify(r));
  const r2 = compareHandSet({ A: { status: "done" } }, { A: { status: "done", verifiedAt: "2026-09-09T00:00:00.000Z" } });
  check("compareHandSet: gaining a field is not a loss", r2.lost.length === 0 && r2.changed.verifiedAt === 1);
  console.log(`\nself-test: ${pass}/${pass + fail} passed.`);
  process.exit(fail ? 1 : 0);
}

const argv = process.argv.slice(2);
if (argv.includes("--self-test")) selfTest();
else if (argv[0] === "drift") drift();
else if (!argv.length || argv[0] === "--check") regenerate({ check: argv[0] === "--check" });
else {
  console.error(`pipeline: unknown argument ${argv.join(" ")}\n  node figma-catalog/pipeline.mjs [--check] | drift | --self-test`);
  process.exit(1);
}
