#!/usr/bin/env node
/**
 * row-tree-check.mjs — check status rows against the WORKING TREE, not against
 * the catalog.
 *
 * WHY THIS EXISTS
 * ---------------
 * `validate-wave7.mjs` asks whether a row is well-formed and addresses a real
 * frame. Nothing asked whether the row's claims about the CODE survive contact
 * with the repository. Wave 10's biggest bucket is lanes re-recording verdicts
 * for code that landed in an earlier wave, and that is the cheapest possible
 * place to bank a `done` for a fix nobody re-checked.
 *
 * This does the two halves of that a script can do honestly:
 *
 *   1. column 3 (`primaryFile`) names a file that EXISTS;
 *   2. every `Something.tsx:NNN` citation in the reason points to a line the
 *      file actually has.
 *
 * ⚠️ IT CANNOT TELL YOU A MEASUREMENT IS RIGHT. A row can name the right file,
 * cite a real line, and still be wrong about every number on it. Reading the
 * component is the only thing that settles that. This is triage: it finds rows
 * pointing at something that is not there.
 *
 * ★ WHY COLUMN 3 IS WORTH A CHECKER OF ITS OWN. It is not decorative:
 * `apply-status.mjs:329-330` pushes it VERBATIM into the frame's `implFiles`,
 * with no split and no validation. So a wrong path becomes a permanent index
 * entry naming a file that is not there, and a multi-file sentence becomes ONE
 * entry naming nothing at all — while the real paths inside it stay invisible to
 * `scan-citations.mjs` and every impl audit. Measured on the wave-10 files the
 * first time this ran: 7 rows with a path that did not exist and 43 rows whose
 * column 3 was prose. Both classes were fixed the same day.
 *
 * ★★★ AND A WARNING ABOUT THIS SCRIPT'S OWN FIRST DRAFT, because it is the more
 * useful half. It resolved a cited basename by taking the first file with that
 * name. There are 117 files called `index.ts` under the roots it walks, so
 * `points-game/index.ts:5466` resolved to a 9-line barrel and was reported as
 * "cites line 5466, file has only 9 lines" — specific, confident, and entirely
 * fabricated. The real file has 6,035 lines.
 *
 * A checker that resolves by basename does not hide a defect, it INVENTS one,
 * and an invented defect costs a lane a round trip defending correct work. So a
 * citation is checked ONLY when the basename is unique in the repository or the
 * row's own column 3 names it; everything else is counted as skipped and the
 * count is printed. An unstated denominator quietly padded with guesses is the
 * failure this whole directory keeps paying for.
 *
 * Usage:
 *   node figma-catalog/row-tree-check.mjs                # newest wave on disk
 *   node figma-catalog/row-tree-check.mjs --wave 10      # a specific wave
 *   node figma-catalog/row-tree-check.mjs --all          # every status file
 *   node figma-catalog/row-tree-check.mjs --done         # only `done` rows
 *   node figma-catalog/row-tree-check.mjs --self-test    # prove it is not vacuous
 *
 * Writes nothing, ever. Exit 1 if any row points at something absent.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { splitStatusLine } from "./bp.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(DIR, "..", "..", "..");
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", "coverage"]);

/** basename -> every path carrying it. A basename with more than one is unusable. */
function indexRepo(roots = ["src", "modules", "supabase"]) {
  const map = new Map();
  const stack = roots.map((r) => path.join(REPO, r));
  while (stack.length) {
    const d = stack.pop();
    let ents;
    try {
      ents = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of ents) {
      if (SKIP_DIRS.has(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else {
        if (!map.has(e.name)) map.set(e.name, []);
        map.get(e.name).push(p);
      }
    }
  }
  return map;
}

const CITE_RE = /([A-Za-z0-9_.-]+\.(?:tsx|ts|css))[: ]:?(\d{2,4})\b/g;
/** Column 3 is one path; these separators mean a lane wrote a sentence instead. */
const splitPrimary = (s) => String(s).split(/[;+]/).map((x) => x.trim()).filter(Boolean);

/**
 * @param rows  [{ where, primary, reason }]
 * @param exists  (relPath) => boolean
 * @param lineCount  (absPath) => number|null
 * @param byBase  Map basename -> paths
 */
export function check(rows, exists, lineCount, byBase) {
  const out = {
    rows: rows.length,
    withFile: 0,
    missingFile: 0,
    multiPath: 0,
    cites: 0,
    badCites: 0,
    skippedCites: 0,
    problems: [],
  };
  for (const r of rows) {
    const primary = (r.primary || "").trim();
    if (primary && primary !== "-" && primary !== "—") {
      out.withFile++;
      const parts = splitPrimary(primary);
      const missing = parts.filter((p) => !exists(p));
      if (parts.length > 1) {
        out.multiPath++;
        out.problems.push(
          `${r.where}  column 3 holds ${parts.length} paths — apply-status.mjs pushes it verbatim into implFiles, so it indexes as one entry naming no file`,
        );
      } else if (missing.length) {
        out.missingFile++;
        const alt = byBase.get(path.basename(primary)) ?? [];
        out.problems.push(
          `${r.where}  column 3 names a file that does not exist: ${primary}` +
            (alt.length === 1 ? `  → the only file with that name is ${path.relative(REPO, alt[0]).split(path.sep).join("/")}` : ""),
        );
      }
    }
    for (const m of String(r.reason || "").matchAll(CITE_RE)) {
      const [, base, nStr] = m;
      let abs = null;
      for (const part of splitPrimary(r.primary || "")) {
        if (path.basename(part) === base && exists(part)) abs = path.join(REPO, part);
      }
      if (!abs) {
        const hits = byBase.get(base) ?? [];
        // ⚠️ Refuse to guess. See the header: guessing here invents defects.
        if (hits.length !== 1) {
          out.skippedCites++;
          continue;
        }
        abs = hits[0];
      }
      const lc = lineCount(abs);
      if (lc === null) {
        out.skippedCites++;
        continue;
      }
      out.cites++;
      if (Number(nStr) > lc) {
        out.badCites++;
        out.problems.push(`${r.where}  cites ${base}:${nStr} but that file has ${lc} lines`);
      }
    }
  }
  return out;
}

// ── self-test ───────────────────────────────────────────────────────────────
// Fixtures in memory, driven through `check` itself. Nothing is written to the
// catalog directory: a stray status-shaped file there is picked up by whatever
// apply-status.mjs run comes next.
if (process.argv.includes("--self-test")) {
  const exists = (p) => p === "src/Real.tsx" || p === "src/Other.tsx";
  const lineCount = (abs) => (abs.endsWith("Real.tsx") ? 100 : abs.endsWith("Twin.ts") ? 9 : 50);
  const byBase = new Map([
    ["Real.tsx", [path.join(REPO, "src/Real.tsx")]],
    ["Other.tsx", [path.join(REPO, "src/Other.tsx")]],
    // the duplicate-basename case: two files, so a citation naming it is unusable
    ["Twin.ts", [path.join(REPO, "a/Twin.ts"), path.join(REPO, "b/Twin.ts")]],
  ]);
  const one = (primary, reason) => check([{ where: "f:1", primary, reason }], exists, lineCount, byBase);
  let caught = 0;
  const cases = [];
  const t = (label, cond, detail = "") => {
    cases.push(label);
    if (cond) caught++;
    console.log(`  ${cond ? "CAUGHT " : "MISSED "} ${label}${cond ? "" : `\n      ${detail}`}`);
  };

  t("a column-3 path that does not exist", one("src/Ghost.tsx", "").missingFile === 1);
  t(
    "and it names the unique file with that basename when there is one",
    one("src/nope/Real.tsx", "").problems[0].includes("the only file with that name is"),
  );
  t("a column 3 holding two paths", one("src/Real.tsx + src/Other.tsx", "").multiPath === 1);
  t("a citation past the end of the file", one("src/Real.tsx", "see Real.tsx:400").badCites === 1);
  t("a citation inside the file is NOT flagged", one("src/Real.tsx", "see Real.tsx:40").badCites === 0);
  /*
    ★ THE ONE THAT MATTERS. This is the defect the first draft shipped: a cited
    basename carried by more than one file must be SKIPPED, not resolved to
    whichever came first. `Twin.ts` has 9 lines at one path; a citation to
    `Twin.ts:400` must not be reported as broken, because we do not know which
    Twin was meant.
  */
  const dup = one("src/Real.tsx", "see Twin.ts:400");
  t(
    "an ambiguous basename is SKIPPED, not guessed at",
    dup.badCites === 0 && dup.skippedCites === 1,
    `got badCites ${dup.badCites}, skipped ${dup.skippedCites} — a guess here invents defects`,
  );
  t(
    "a clean row produces nothing",
    one("src/Real.tsx", "measured header 56; see Real.tsx:12").problems.length === 0,
  );
  const pass = caught === cases.length;
  console.log(`\nself-test: ${caught}/${cases.length} cases.`);
  process.exit(pass ? 0 : 1);
}

// ── the run ─────────────────────────────────────────────────────────────────
const ALL = process.argv.includes("--all");
const DONE_ONLY = process.argv.includes("--done");
const wi = process.argv.indexOf("--wave");
const wavesOnDisk = [
  ...new Set(
    fs.readdirSync(DIR).map((f) => /^status\.wave(\d+)\./.exec(f)?.[1]).filter(Boolean).map(Number),
  ),
].sort((a, b) => a - b);
const WAVE = wi !== -1 ? process.argv[wi + 1] : String(wavesOnDisk[wavesOnDisk.length - 1] ?? 7);
const re = ALL ? /^status\..+\.tsv$/ : new RegExp(`^status\\.wave${WAVE}\\..+\\.tsv$`);
const files = fs.readdirSync(DIR).filter((f) => re.test(f)).sort();

if (!files.length) {
  console.log(`row-tree-check: NO status files matched — nothing was checked. This is NOT a pass.`);
  process.exit(1);
}

const rows = [];
for (const f of files) {
  const lines = fs.readFileSync(path.join(DIR, f), "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim() || l.trimStart().startsWith("#")) continue;
    const r = splitStatusLine(l);
    if (DONE_ONLY && r.status !== "done") continue;
    rows.push({ where: `${f}:${i + 1}`, primary: r.primaryFile, reason: r.reason });
  }
}

const byBase = indexRepo();
const lineCache = new Map();
const lineCount = (p) => {
  if (!lineCache.has(p)) {
    try {
      lineCache.set(p, fs.readFileSync(p, "utf8").split(/\r?\n/).length);
    } catch {
      lineCache.set(p, null);
    }
  }
  return lineCache.get(p);
};
const res = check(rows, (p) => fs.existsSync(path.join(REPO, p)), lineCount, byBase);

console.log(`row-tree-check: ${ALL ? "every status file" : `wave ${WAVE}`} — ${files.length} file(s)`);
console.log(`  rows scanned                          : ${res.rows}${DONE_ONLY ? "  (done only)" : ""}`);
console.log(`  naming a primaryFile                  : ${res.withFile}`);
console.log(`    -> path does not exist              : ${res.missingFile}`);
console.log(`    -> column 3 holds more than one path: ${res.multiPath}`);
console.log(`  line citations checked                : ${res.cites}`);
console.log(`    -> line beyond end of file          : ${res.badCites}`);
console.log(`  citations skipped, ambiguous basename : ${res.skippedCites}`);

if (res.problems.length) {
  console.log(`\n${res.problems.length} problem(s):`);
  for (const p of res.problems) console.log(`  ${p}`);
} else {
  console.log(`\nno row points at a file or line that is absent.`);
}
process.exit(res.problems.length ? 1 : 0);
