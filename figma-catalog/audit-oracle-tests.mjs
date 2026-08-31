#!/usr/bin/env node
/**
 * audit-oracle-tests.mjs — find VACUOUS parity oracles.
 *
 * A `done` row is only as good as the test behind it, and the failure mode that
 * matters is not a test that fails — it is a test that CANNOT fail. WAVE6-BRIEF
 * §2 names it exactly:
 *
 *   "nothing re-reads the component's own strings. A test that imports the
 *    component's constants and compares them to themselves passes forever and
 *    proves nothing."
 *
 * The shape of a sound oracle, from the exemplar
 * `src/components/trade/order/ScaledOrderFields.figma.test.tsx`:
 *   - every EXPECTATION is a Figma pixel literal, transcribed from node data;
 *   - every ACTUAL is resolved through the SHIPPING Tailwind config, so the test
 *     proves what the browser would paint without opening one;
 *   - the module under test contributes the COMPONENT and nothing else.
 *
 * This script is a triage tool, not a verdict. It reports SIGNALS with counts so
 * a human can go and look, because the only conclusive proof that a test is not
 * vacuous is to mutate the component and watch it go red. What it buys you is
 * knowing WHICH of 34 files to spend that on.
 *
 * ★ It reports its own denominator on every run. A checker that says "nothing
 * wrong" without saying how much it looked at is the single most repeated
 * failure in this project's history.
 *
 * Usage: node figma-catalog/audit-oracle-tests.mjs [substring-filter]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
// figma-catalog -> skai-ui -> modules -> repo root
const REPO = path.resolve(DIR, "../../..");
const SRC = path.join(REPO, "src");
const filter = process.argv[2] || null;

/** Every *.figma.test.tsx under src/, recursively. */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules") continue;
      walk(p, out);
    } else if (/\.figma\.test\.tsx$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(SRC).filter((f) => !filter || f.includes(filter));
if (!files.length) {
  console.log("audit-oracle-tests: NO *.figma.test.tsx found — nothing was checked. This is NOT a pass.");
  process.exit(0);
}

const rows = [];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(REPO, file).replace(/\\/g, "/");
  const base = path.basename(file).replace(/\.figma\.test\.tsx$/, "");

  // ── signal 1: does it import anything from the module under test besides the
  // component? A named import that is not PascalCase and not a `type` is a
  // constant or a helper — the self-comparison risk.
  const selfImports = [];
  const importRe = /import\s*\{([^}]*)\}\s*from\s*["'](\.[^"']*)["']/g;
  for (const m of src.matchAll(importRe)) {
    const spec = m[2];
    // Only sibling modules — the component under test and its immediate helpers.
    if (!/^\.\/[A-Za-z0-9_.-]+$/.test(spec)) continue;
    for (const raw of m[1].split(",")) {
      const name = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
      if (!name) continue;
      if (/^type\s/.test(raw.trim())) continue;
      if (/^[A-Z][A-Za-z0-9]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name)) continue; // a component
      selfImports.push(`${name} from ${spec}`);
    }
  }

  // ── signal 1b: THE PRECISE VACUITY SIGNATURE.
  //
  // Importing the component's own constant is NOT by itself a defect, and the
  // first version of this script said it was — it flagged
  // SocialTridotsMenu.figma.test.tsx, which turns out to be sound:
  //     expect(ACCOUNT_TRIDOTS_WIDTH_PX).toBe(FIGMA_ACCOUNT_TRIDOTS.widthPx)
  // The component's constant is the ACTUAL; the EXPECTED is a Figma literal
  // transcribed into the test (node 11530:303299, widthPx 160). That is exactly
  // the right shape — an independent oracle checking a shipped constant.
  //
  // The test passes forever only when the self-imported symbol is the EXPECTED
  // value, i.e. it appears inside the matcher's argument. Then both sides come
  // from the same module and the assertion is a tautology.
  const selfNames = new Set(selfImports.map((s) => s.split(" from ")[0]));
  const selfAsExpected = [];
  for (const m of src.matchAll(/\.(?:toBe|toEqual|toStrictEqual|toContain|toHaveLength)\(([^)]*)\)/g)) {
    for (const n of selfNames) if (new RegExp(`\\b${n}\\b`).test(m[1])) selfAsExpected.push(`${n} in ${m[0].slice(0, 60)}`);
  }

  // ── signal 2: is any actual resolved through the shipping Tailwind config?
  const usesTailwind = /resolveConfig|tailwind\.config/.test(src);
  // ── does the file define its OWN Figma fixture — transcribed literals with a
  // node id beside them? That is the independent half of the oracle, and it is
  // invisible to a `.toBe(<number>)` count because the numbers live in a const.
  const figmaFixture = /const\s+[A-Z][A-Z0-9_]*\s*=\s*\{/.test(src) && /node:\s*["'`]/.test(src);
  // ── signal 3: does it read the shipped CSS (the --radius source of truth)?
  const readsIndexCss = /index\.css/.test(src);
  // ── signal 4: does it render, or only inspect strings?
  const renders = /\brender\s*\(/.test(src);
  // ── signal 5: how many numeric literal expectations? A parity oracle with no
  // numbers is not asserting geometry at all.
  const numericExpectations = [...src.matchAll(/\.toBe(?:CloseTo)?\(\s*-?\d+(?:\.\d+)?\s*\)/g)].length;
  // ── signal 6: does it cite Figma node ids? Provenance for the literals.
  const nodeIds = new Set([...src.matchAll(/\b\d{3,6}[:-]\d{2,7}\b/g)].map((m) => m[0]));
  const its = [...src.matchAll(/\bit\(\s*["'`]/g)].length;

  const flags = [];
  // Ranked by how strongly each implies the test cannot fail.
  if (selfAsExpected.length) flags.push(`SELF-AS-EXPECTED(${selfAsExpected.length})`);
  if (numericExpectations === 0 && !figmaFixture) flags.push("NO-GEOMETRY-ANYWHERE");
  if (!usesTailwind) flags.push("no-tailwind-oracle");
  if (!renders) flags.push("no-render");
  if (nodeIds.size === 0) flags.push("no-node-id");

  rows.push({ rel, base, flags, selfImports, selfAsExpected, usesTailwind, figmaFixture, readsIndexCss, renders, numericExpectations, nodeIds: nodeIds.size, its });
}

rows.sort((a, b) => b.flags.length - a.flags.length || a.rel.localeCompare(b.rel));

console.log(`audit-oracle-tests: ${files.length} *.figma.test.tsx examined under src/.`);
console.log(
  `  ${rows.filter((r) => r.usesTailwind).length} resolve actuals through the shipping Tailwind config; ` +
    `${rows.filter((r) => r.renders).length} render; ` +
    `${rows.filter((r) => r.nodeIds > 0).length} cite a Figma node id; ` +
    `${rows.filter((r) => r.figmaFixture).length} define a transcribed Figma fixture.`,
);
console.log(
  `  total: ${rows.reduce((a, r) => a + r.its, 0)} it() blocks, ${rows.reduce((a, r) => a + r.numericExpectations, 0)} bare numeric literal expectations.\n`,
);

// The two tiers are reported separately, because mixing them is how the first
// version of this script produced a 28-of-33 scare list that was mostly sound.
const hard = rows.filter((r) => r.flags.some((f) => /^SELF-AS-EXPECTED|^NO-GEOMETRY/.test(f)));
const soft = rows.filter((r) => r.flags.length && !hard.includes(r));

console.log(`TIER 1 — ${hard.length} of ${rows.length} file(s) show a signature that can make a test unfalsifiable:\n`);
for (const r of hard) {
  console.log(`  ${r.rel}`);
  console.log(`      flags: ${r.flags.join(" · ")}`);
  console.log(`      it() ${r.its} · bare numeric expectations ${r.numericExpectations} · node ids ${r.nodeIds} · figma fixture ${r.figmaFixture ? "yes" : "NO"}`);
  for (const s of r.selfAsExpected.slice(0, 6)) console.log(`      self-as-expected: ${s}`);
}
if (!hard.length) console.log("  (none)");

console.log(`\nTIER 2 — ${soft.length} file(s) with weaker signals only (still worth a look, not alarming):`);
for (const r of soft) console.log(`  ${r.rel}  [${r.flags.join(" · ")}]`);
if (!soft.length) console.log("  (none)");

console.log(`\nA signal is NOT a verdict. The only proof a test is not vacuous is to mutate the`);
console.log(`component value it asserts and watch it go RED — and to confirm with grep -F that`);
console.log(`the mutation actually landed before believing the result.`);
