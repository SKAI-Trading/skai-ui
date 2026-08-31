/**
 * Adversarial audit of Figma parity "oracle" tests.
 *
 * WHY THIS EXISTS — wave 6 lets a row claim `done` only when a parity oracle
 * test encodes the Figma pixels. The failure mode that would make that bar
 * worthless is a test that reads the component's OWN values and compares them
 * to themselves: it passes forever and proves nothing. This script is the cheap
 * static half of the check. The expensive half is mutation (change a component
 * value, confirm the test goes RED) and no static scan substitutes for it.
 *
 * It reports, per test file:
 *   figmaLiterals  numeric expectations that look like transcribed px
 *   selfImports    symbols imported FROM the module under test and then used
 *                  inside an expectation - the vacuity signature
 *   sourceGrep     the test reads the component source and asserts on it,
 *                  which makes the source both subject and oracle
 *   classOnly      `toContain("rounded-lg")`-style assertions with no px
 *                  resolution; the exemplar calls these out as proving nothing
 *                  because Figma's scale and this repo's are offset one step
 *
 * Usage (from modules/skai-ui):
 *   node figma-catalog/oracle-audit.mjs <repoRoot> [--since <ISO>] [--json]
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const repoRoot = path.resolve(args[0] || "../..");
const asJson = args.includes("--json");
const sinceIdx = args.indexOf("--since");
const since = sinceIdx >= 0 ? Date.parse(args[sinceIdx + 1]) : null;
const onlyList = (() => {
  const i = args.indexOf("--files");
  if (i < 0) return null;
  return new Set(
    fs
      .readFileSync(args[i + 1], "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
})();

const SKIP = /node_modules|[/\\]dist[/\\]|[/\\]\.git[/\\]/;

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (/\.(test|spec)\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const roots = ["src", "modules/skai-gaming/src", "modules/skai-ui/src", "modules/skai-wallet/src"]
  .map((r) => path.join(repoRoot, r))
  .filter((p) => fs.existsSync(p));

let files = [];
for (const r of roots) walk(r, files);
files = files.filter((f) => /figma|parity/i.test(path.basename(f)));
if (since !== null) files = files.filter((f) => fs.statSync(f).mtimeMs >= since);
if (onlyList) files = files.filter((f) => onlyList.has(path.relative(repoRoot, f).replace(/\\/g, "/")));

const results = [];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(repoRoot, file).replace(/\\/g, "/");

  // Imports that come from a sibling/relative module, i.e. plausibly the
  // component under test. A named symbol pulled from there and then used in an
  // expectation is the vacuity signature.
  const selfImportSymbols = new Set();
  const importRe = /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["'](\.[^"']*)["']/g;
  let m;
  while ((m = importRe.exec(src))) {
    for (const raw of m[1].split(",")) {
      const sym = raw.replace(/\btype\b/, "").split(/\s+as\s+/)[0].trim();
      // Only CONSTANT-shaped symbols matter; components/types are fine to import.
      if (/^[A-Z0-9_]{3,}$/.test(sym)) selfImportSymbols.add(sym);
    }
  }

  const expectations = [...src.matchAll(/expect\(([\s\S]{0,200}?)\)\s*(?:,\s*[\s\S]*?\))?\s*\.\s*(?:to|not)/g)].map(
    (x) => x[0],
  );

  // A numeric literal on the RIGHT of an assertion is a transcribed pixel.
  const literalRe = /\.(?:toBe|toEqual|toBeCloseTo|toHaveLength)\(\s*(-?\d+(?:\.\d+)?)\s*\)/g;
  const figmaLiterals = [...src.matchAll(literalRe)].map((x) => Number(x[1]));

  // Vacuity: an imported CONST appearing inside an expectation.
  const selfCompared = [];
  for (const sym of selfImportSymbols) {
    const used = expectations.some((e) => new RegExp(`\\b${sym}\\b`).test(e));
    if (used) selfCompared.push(sym);
  }

  // The test reads the component's own source and asserts on the text.
  const sourceGrep =
    /readFileSync\([^)]*\.(tsx?|css)["'`)]/.test(src) &&
    !/index\.css|tailwind\.config|design-tokens/.test(src);

  // Class-name-only assertions with no px resolution anywhere in the file.
  const classAssertions = [
    ...src.matchAll(/toContain\(\s*["'`](rounded-[a-z0-9]+|text-[a-z0-9]+|p-\d+|gap-\d+)["'`]\s*\)/g),
  ].map((x) => x[1]);
  const resolvesPx = /resolveConfig|--radius|borderRadius|parseFloat|getComputedStyle/.test(src);

  results.push({
    file: rel,
    bytes: src.length,
    tests: (src.match(/\b(it|test)\s*\(/g) || []).length,
    expectations: expectations.length,
    figmaLiterals: figmaLiterals.length,
    distinctLiterals: [...new Set(figmaLiterals)].sort((a, b) => a - b),
    selfComparedConsts: selfCompared,
    sourceGrep,
    classOnlyAssertions: classAssertions.length,
    resolvesPx,
    verdict:
      selfCompared.length > 0
        ? "SUSPECT-self-compare"
        : figmaLiterals.length === 0
          ? "SUSPECT-no-literals"
          : classAssertions.length > 0 && !resolvesPx
            ? "SUSPECT-class-name-only"
            : "looks-independent",
  });
}

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log(`scanned ${files.length} figma/parity test file(s) under ${roots.length} root(s)`);
  const bad = results.filter((r) => r.verdict !== "looks-independent");
  console.log(`  looks-independent: ${results.length - bad.length}`);
  console.log(`  SUSPECT:           ${bad.length}`);
  for (const r of results) {
    console.log(
      `${r.verdict === "looks-independent" ? "  ok  " : "  !!  "}${r.file}  tests=${r.tests} expects=${r.expectations} px=${r.figmaLiterals} ${r.verdict}${r.selfComparedConsts.length ? " [" + r.selfComparedConsts.join(",") + "]" : ""}`,
    );
  }
  console.log(
    "\nNOTE: a static scan cannot prove non-vacuity. Every file above still needs a mutation:",
  );
  console.log("change a component pixel, re-run, and confirm the test goes RED.");
}
