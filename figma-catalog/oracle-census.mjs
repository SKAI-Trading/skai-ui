#!/usr/bin/env node
/**
 * oracle-census.mjs — enumerate the parity oracles by WHAT THEY CITE, not by
 * what they are called.
 *
 * ⚠️ WHY THIS EXISTS: THE NAME GLOB IS THE DENOMINATOR, AND IT IS WRONG.
 *
 * WAVE9-INTEGRITY §8 ran every parity oracle in the repo and reported
 * "105 files, one red". The glob behind that 105 was
 * `*figma*.test.tsx` / `*parity*.test.tsx`, case-insensitive — a FILENAME rule.
 * Its own §11 recorded the limit as an open gap:
 *
 *   "A complete oracle census would key on files citing a Figma node id, not on
 *    filename. Recorded as a known gap, not closed."
 *
 * It was not a hypothetical. `PlayStateCard.test.tsx` was reported to that lane
 * as an instance of the class and was never in the 105, because its name carries
 * neither word. A sweep that reports "0 of 105 are red for that reason" over a
 * population selected by naming convention is measuring the convention.
 *
 * This closes it. A file is an oracle here if it cites a Figma node id the
 * CATALOG carries — which is a statement about the test's content, and cannot be
 * satisfied by renaming a file or missed by not renaming one.
 *
 * ★ THE CITATION RULE IS IMPORTED, NOT RESTATED. `scan-citations.mjs` owns it:
 * the id shape, the date exclusion (`2026-08-27` is not a node id), and the
 * requirement that the id exist in `registry.json`. That last part is what stops
 * this inflating — a bare `\d+-\d+` scan matches Tailwind arbitrary values and
 * version ranges, and would report most of the test suite as parity oracles.
 *
 * WHAT IT DOES NOT DO. It does not run anything and it does not judge whether an
 * oracle is sound — `audit-oracle-tests.mjs` triages vacuity, and only mutation
 * proves it. This answers one question: WHICH FILES ARE IN THE POPULATION.
 *
 * Usage:
 *   node figma-catalog/oracle-census.mjs             # the census
 *   node figma-catalog/oracle-census.mjs --missed    # only what the glob misses
 *   node figma-catalog/oracle-census.mjs --self-test # prove it is not vacuous
 *
 * Writes nothing, ever.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ID_RE, known, looksLikeDate, SKIP_DIRS } from "./scan-citations.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(DIR, "..", "..", "..");

/*
  ⚠️ FOUR ROOTS, NOT THREE, AND THE DIFFERENCE IS LOAD-BEARING.

  `scan-citations.mjs` walks `src`, `modules/skai-gaming/src` and
  `modules/skai-wallet/src` — deliberately, because it is reproducing an index
  first built over those three. A census of TESTS must not inherit that: wave 9
  found parity oracles under `modules/skai-ui` and `modules/skai-command` as
  well, and each submodule has its own vitest config, so a run from the wrong
  root collects zero files and EXITS 0.

  The roots are printed on every run. A denominator nobody can see is the defect
  this whole file exists to fix.
*/
const ROOTS = [
  "src",
  "modules/skai-gaming/src",
  "modules/skai-wallet/src",
  "modules/skai-ui/src",
  "modules/skai-command/src",
];

/** The filename rule wave 9 used, kept verbatim so the two can be compared. */
const NAME_GLOB = (base) => /\.(test|spec)\.(ts|tsx)$/.test(base) && /figma|parity/i.test(base);

const IS_TEST = (base) => /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(base);

function* walkTests(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walkTests(p);
    } else if (IS_TEST(e.name)) yield p;
  }
}

/** Node ids this text cites that the catalog carries. Imported rule, applied here. */
export function citedIds(text) {
  const hits = new Set();
  // ⚠️ ID_RE carries /g and therefore `lastIndex`. `matchAll` resets it per call,
  // but a shared global regex used with .test() or .exec() elsewhere would not —
  // stated because the export makes it reachable from anywhere now.
  for (const m of text.matchAll(ID_RE)) {
    if (looksLikeDate(m[1], m[2])) continue;
    const id = `${m[1]}-${m[2]}`;
    if (known.has(id)) hits.add(id);
  }
  return hits;
}

// ── self-test ───────────────────────────────────────────────────────────────
// In memory. Nothing is written to the catalog directory: a stray file there is
// picked up by whatever apply-status.mjs / coverage.mjs run comes next.
if (process.argv.includes("--self-test")) {
  const realId = [...known][0];
  let caught = 0;
  const cases = [];
  const check = (label, cond, detail = "") => {
    cases.push(label);
    if (cond) caught++;
    console.log(`  ${cond ? "CAUGHT " : "MISSED "} ${label}${cond ? "" : `\n      ${detail}`}`);
  };

  check(
    `a real catalog id is a citation (${realId})`,
    citedIds(`// measured off ${realId}`).has(realId),
    "the registry-membership rule rejected an id taken FROM the registry",
  );
  check(
    "the colon form counts the same as the hyphen form",
    citedIds(`node ${realId.replace("-", ":")}`).has(realId),
    "colon form not normalised",
  );
  check(
    "a date is not a citation",
    citedIds("measured 2026-08-27 and 1999-12").size === 0,
    "a date was admitted as a node id",
  );
  check(
    "an id-shaped number the catalog does not carry is not a citation",
    citedIds("gap 9999-99999 and w-[13-37]").size === 0,
    "an unknown id was admitted — this rule is what stops the census inflating",
  );
  // ★ The one that would have caught wave 9's gap. A file whose NAME carries
  // neither `figma` nor `parity`, but which cites a real node id, must be in the
  // census and must NOT be in the name glob. If these two ever agree, the census
  // has silently become a second name glob.
  check(
    "a node-id-citing test whose NAME matches neither `figma` nor `parity` is in the census but not the glob",
    citedIds(`// ${realId}`).size === 1 && !NAME_GLOB("PlayStateCard.test.tsx"),
    "the census and the name glob agree on a file they must disagree on",
  );
  check(
    "the name glob still recognises the files it was built for",
    NAME_GLOB("activityHeaderTypeRamp.figma.test.tsx") && NAME_GLOB("sportsbookRadiusParity.test.tsx"),
    "the glob was restated wrongly, so the comparison would be against the wrong baseline",
  );
  const pass = caught === cases.length;
  console.log(`\nself-test: ${caught}/${cases.length} cases.`);
  process.exit(pass ? 0 : 1);
}

// ── the census ──────────────────────────────────────────────────────────────
const MISSED_ONLY = process.argv.includes("--missed");
let scanned = 0;
const rows = [];
const missingRoots = [];
for (const root of ROOTS) {
  const abs = path.join(REPO, root);
  if (!fs.existsSync(abs)) {
    missingRoots.push(root);
    continue;
  }
  for (const file of walkTests(abs)) {
    scanned++;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const ids = citedIds(text);
    const rel = path.relative(REPO, file).split(path.sep).join("/");
    const base = path.basename(file);
    if (ids.size || NAME_GLOB(base)) rows.push({ rel, base, root, ids: ids.size, byName: NAME_GLOB(base) });
  }
}

if (!scanned) {
  // A census that looked at nothing must never read as a pass.
  console.log("oracle-census: NO test files found under any root — nothing was checked.");
  console.log("  This is NOT a result. Denominator = 0.");
  process.exit(1);
}

const byId = rows.filter((r) => r.ids > 0);
const byName = rows.filter((r) => r.byName);
const both = rows.filter((r) => r.ids > 0 && r.byName);
const idOnly = rows.filter((r) => r.ids > 0 && !r.byName);
const nameOnly = rows.filter((r) => r.byName && r.ids === 0);

console.log(`oracle-census — roots (${ROOTS.length}): ${ROOTS.join(", ")}`);
if (missingRoots.length) console.log(`  ⚠️ roots absent from disk, contributing 0: ${missingRoots.join(", ")}`);
console.log(`test files scanned                         : ${scanned}`);
console.log(`  cite a node id the catalog carries       : ${byId.length}`);
console.log(`  match the wave-9 NAME glob               : ${byName.length}`);
console.log(`  both                                     : ${both.length}`);
console.log(`  ★ cite an id but the NAME GLOB MISSES    : ${idOnly.length}`);
console.log(`  named like an oracle but cite NO node id : ${nameOnly.length}`);

if (idOnly.length) {
  console.log(`\n★ ${idOnly.length} file(s) the wave-9 sweep could not have run — they cite real frames:`);
  for (const r of idOnly.sort((a, b) => b.ids - a.ids)) console.log(`    ${String(r.ids).padStart(3)} ids  ${r.rel}`);
}
if (!MISSED_ONLY && nameOnly.length) {
  console.log(`\n${nameOnly.length} file(s) named like an oracle that cite no catalog node id.`);
  console.log(`  Not a defect by itself — a ramp test can be sound without naming a frame —`);
  console.log(`  but a parity oracle with no transcribed id has nothing tying it to Figma.`);
  for (const r of nameOnly) console.log(`    ${r.rel}`);
}
console.log(
  `\nThe two populations differ by ${idOnly.length + nameOnly.length} file(s). ` +
    `A sweep quoting either number alone is quoting a convention.`,
);
