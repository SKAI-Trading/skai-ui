#!/usr/bin/env node
/**
 * scan-citations.mjs — rebuild `code-node-citations.json` from the source tree.
 *
 * ⚠️ WHY THIS EXISTS: THE INDEX HAD NO REGENERATOR, AND WENT FIVE WEEKS STALE.
 *
 * `build-registry.mjs` READS `code-node-citations.json` to decide which frames
 * have implementing code, and `status: not-started` follows from that. But
 * nothing in the catalog WROTE it — the file was produced once, on
 * 2026-07-21T22:52:32.887Z, and then silently aged.
 *
 * The consequence, measured 2026-08-27: **any surface built after 2026-07-21
 * reads as unimplemented, forever.** Node `8360-127832` was marked
 * `not-started` with `implFiles: []` and the note "No code cites 8360-127832",
 * while `src/components/trench-redesign/discover/TrenchTrackers.tsx:2` cites it
 * in its first comment line — a file whose mtime is 2026-07-28, seven days after
 * the index was frozen. A wave-6 work list built by selecting
 * `status === "not-started"` sent lanes to rebuild **29 of 123 frames (24%) that
 * already existed**, and that is a lower bound: it only catches frames whose id
 * appears literally in a comment.
 *
 * ★ A derived index with a `generated` timestamp is a SNAPSHOT, not a fact.
 * This script exists so the snapshot can be retaken. Run it before sizing any
 * build wave off `registry.status`.
 *
 * WHAT COUNTS AS A CITATION
 * -------------------------
 * A Figma node id written anywhere in a source file — comment or code — in
 * either of the two forms the codebase uses interchangeably:
 *
 *     1234-5678     (the URL / catalog form)
 *     1234:5678     (the Plugin API form)
 *
 * Both normalise to the hyphen form, because `registry.frames[].node` is stored
 * that way and a bare id is unique across files (see build-registry.mjs:505).
 *
 * ⚠️ THE FALSE-POSITIVE PROBLEM, and how it is handled. `\d+-\d+` also matches
 * dates (`2026-08-27`), version ranges, tailwind arbitrary values and CSS. A
 * naive scan inflates the index with junk that then reads as "this frame is
 * implemented", which is the SAME failure in the opposite direction — worse,
 * because it removes work from the schedule rather than adding it.
 *
 * So a match is kept only if it is:
 *   - shaped like a real Figma id: 1-7 digits, hyphen/colon, 1-7 digits; and
 *   - NOT a plausible date (first part 1900-2100 with a 2-digit second part); and
 *   - present in the CATALOG — `registry.json` must carry a frame with that node.
 *
 * That last rule is the load-bearing one: it means this scan can only ever
 * confirm citations of frames the catalog already knows about, so it cannot
 * invent coverage. Ids found in code but absent from the registry are reported
 * separately as `unknownIds` — they are usually stale, or a frame the harvest
 * has not seen, and they are worth a human look rather than silent inclusion.
 *
 * Usage:
 *   node figma-catalog/scan-citations.mjs           # rebuild the index
 *   node figma-catalog/scan-citations.mjs --dry-run # report, write nothing
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(DIR, "..", "..", "..");
const OUT = path.join(DIR, "code-node-citations.json");
const dryRun = process.argv.includes("--dry-run");

/** Kept identical to the roots the 2026-07-21 index recorded, so the rebuild is comparable. */
const ROOTS = ["src", "modules/skai-gaming/src", "modules/skai-wallet/src"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx"]);
export const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git", "coverage", "__snapshots__"]);

const registry = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
/** Every node id the catalog knows, in hyphen form. A citation must hit one of these. */
export const known = new Set(
  Object.values(registry.frames)
    .map((f) => String(f.node ?? "").replace(":", "-"))
    .filter(Boolean),
);

/*
  ★ EXPORTED SO THE CITATION RULE HAS ONE IMPLEMENTATION.

  `oracle-census.mjs` needs the same answer to "does this file cite a Figma node
  id?" that this script gives. The three parts of that answer — the id shape, the
  date exclusion, and the requirement that the id be one the catalog carries —
  are subtle enough that a copy would drift, and this directory has already paid
  for that twice (`bp-report.mjs`'s private STATUS_VALID dropped 154 rows;
  `validate-wave7.mjs`'s private copy of a guard told 19 lanes their work was
  being discarded). The executable half of this file is behind IS_MAIN below, so
  importing these costs an import and runs no scan.
*/
export const ID_RE = /\b(\d{1,7})[-:](\d{1,7})\b/g;

/** A date like 2026-08 or 1999-12 is not a node id. Node ids in this file start at 3 digits anyway. */
export function looksLikeDate(a, b) {
  const y = Number(a);
  return b.length <= 2 && y >= 1900 && y <= 2100;
}

export function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walk(p);
    } else if (EXTS.has(path.extname(e.name))) {
      yield p;
    }
  }
}

/*
  Everything below runs only when this file is the entry point. Without the
  guard, importing `ID_RE` or `known` would walk three source roots and, absent
  --dry-run, overwrite `code-node-citations.json` as a side effect of an import.
  Same shape as the guard in registry-drift.mjs.
*/
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) main();

function main() {
  const fileToNodes = {};
  const nodeToFiles = {};
  const unknownIds = new Map();
  let scanned = 0;

  for (const root of ROOTS) {
    const abs = path.join(REPO, root);
    if (!fs.existsSync(abs)) {
      console.error(`  (root missing, skipped: ${root})`);
      continue;
    }
    for (const file of walk(abs)) {
      scanned++;
      let text;
      try {
        text = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const rel = path.relative(REPO, file).split(path.sep).join("/");
      const hits = new Set();
      for (const m of text.matchAll(ID_RE)) {
        if (looksLikeDate(m[1], m[2])) continue;
        const id = `${m[1]}-${m[2]}`;
        if (known.has(id)) hits.add(id);
        else unknownIds.set(id, (unknownIds.get(id) || 0) + 1);
      }
      if (!hits.size) continue;
      fileToNodes[rel] = [...hits].sort();
      for (const id of hits) (nodeToFiles[id] = nodeToFiles[id] || []).push(rel);
    }
  }
  for (const id of Object.keys(nodeToFiles)) nodeToFiles[id].sort();

  // ── Report against the index being replaced, so the delta is visible ──────────
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : null;
  const prevNodes = new Set(Object.keys(prev?.nodeToFiles ?? {}));
  const nowNodes = new Set(Object.keys(nodeToFiles));
  const gained = [...nowNodes].filter((id) => !prevNodes.has(id));
  const lost = [...prevNodes].filter((id) => !nowNodes.has(id));

  console.log(`scanned ${scanned} source files across ${ROOTS.length} roots`);
  if (prev) console.log(`previous index generated ${prev.generated}`);
  console.log(
    `citing files: ${Object.keys(fileToNodes).length}` +
      (prev ? ` (was ${Object.keys(prev.fileToNodes).length})` : ""),
  );
  console.log(
    `cited nodes:  ${nowNodes.size}` + (prev ? ` (was ${prevNodes.size})` : ""),
  );
  console.log(`  NEWLY cited (built since the last scan): ${gained.length}`);
  console.log(`  no longer cited (renamed, deleted, or the frame left the catalog): ${lost.length}`);
  if (gained.length) {
    console.log("  sample of newly-cited nodes:");
    for (const id of gained.slice(0, 8)) console.log(`    ${id} <- ${nodeToFiles[id][0]}`);
  }
  // Ids that LOOK like node ids but no catalog frame carries. Reported, never indexed —
  // silently including them would manufacture coverage for frames nobody has.
  const unknownSorted = [...unknownIds.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\nid-shaped tokens in code that NO registry frame carries: ${unknownSorted.length}`);
  if (unknownSorted.length) {
    for (const [id, n] of unknownSorted.slice(0, 6)) console.log(`    ${id} (${n}x)`);
    console.log("    (stale ids, nested children, or frames the harvest never saw — not indexed)");
  }

  if (dryRun) {
    console.log("\n--dry-run: nothing written.");
    process.exit(0);
  }

  fs.writeFileSync(
    OUT,
    JSON.stringify({ generated: new Date().toISOString(), roots: ROOTS, fileToNodes, nodeToFiles }, null, 2),
  );
  console.log(`\nwrote ${path.relative(REPO, OUT).split(path.sep).join("/")}`);
  console.log("Now re-run build-registry.mjs, then apply-status.mjs, then coverage.mjs.");

}
