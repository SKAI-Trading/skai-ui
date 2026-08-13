#!/usr/bin/env node
/**
 * figma-apply-retargets.mjs — move hand-set work onto the frame that replaced it.
 *
 * Casey's ruling: live Figma is always correct. When a designer REBUILDS a
 * screen, Figma issues a new node-id, so the catalog's row for the old id is
 * pointing at something that no longer exists — while the row's most valuable
 * content (which code implements it, who verified it, when) is still true of
 * the rebuilt frame.
 *
 * `figma-drift.mjs` identifies those pairs by exact title match and logs them as
 * RETARGET. This applies them.
 *
 * ── Why this MERGES rather than repoints ─────────────────────────────────────
 * The obvious implementation — rewrite the old row's `node` to the new id — is
 * wrong here, and the drift harvest is what showed it. The rebuilt frames live
 * on a different PAGE, and this catalog maps one section per page, so those
 * frames are ALREADY catalogued under a sibling section (`wallet` -> `wallet-2`,
 * `trade` -> `trade-2`, `home` -> `home-2`). Repointing would produce two rows
 * for one frame: the sibling's, and the repointed original.
 *
 * So the operation is a MERGE:
 *   - copy each hand-set field from the stale row onto the live row, but only
 *     where the live row has nothing — a value someone set on the live row is
 *     newer evidence and always wins;
 *   - mark the stale row `gone`, which is this catalog's existing convention for
 *     "deleted upstream, kept for the record" (see bugref-aliases.tsv). Nothing
 *     is deleted, so every step is reversible.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   node figma-apply-retargets.mjs figma-drift.webapp.json            # dry run
 *   node figma-apply-retargets.mjs figma-drift.webapp.json --apply    # write
 *
 * Dry run is the DEFAULT and prints exactly what would change. A tool that
 * rewrites a third of the catalog should never do so because someone forgot a
 * flag.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const driftPath = process.argv[2];
const APPLY = process.argv.includes("--apply");

if (!driftPath) {
  console.error("usage: node figma-apply-retargets.mjs <figma-drift.*.json> [--apply]");
  process.exit(1);
}

let drift;
try {
  drift = JSON.parse(fs.readFileSync(path.resolve(driftPath), "utf8"));
} catch (e) {
  console.error(`Cannot read drift file: ${e.message}`);
  process.exit(1);
}

const registryPath = path.join(DIR, "registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

/** node-id -> [key, row] for every row, so we can find a frame by bare id. */
const byNode = new Map();
for (const [key, row] of Object.entries(registry.frames)) {
  if (!byNode.has(row.node)) byNode.set(row.node, []);
  byNode.get(row.node).push([key, row]);
}

const MERGE_FIELDS = ["implFiles", "status", "notes", "verifiedAt", "route"];
const isEmpty = (v) =>
  v === undefined || v === null || v === "" || v === "unknown" ||
  (Array.isArray(v) && v.length === 0);

const plan = [];
const skipped = [];

for (const [section, info] of Object.entries(drift.sections || {})) {
  for (const { oldId, newId, title } of info.retargets || []) {
    const olds = byNode.get(oldId) || [];
    const news = byNode.get(newId) || [];

    if (!olds.length) { skipped.push({ oldId, newId, why: "stale row not in registry" }); continue; }
    if (!news.length) { skipped.push({ oldId, newId, why: "live row not in registry (harvest it first)" }); continue; }

    // A node-id is unique per file, so >1 row means the same frame is catalogued
    // under two sections. Merging into an ambiguous target is not safe.
    if (news.length > 1) { skipped.push({ oldId, newId, why: `live id appears in ${news.length} sections` }); continue; }

    const [oldKey, oldRow] = olds[0];
    const [newKey, newRow] = news[0];

    const moves = [];
    for (const f of MERGE_FIELDS) {
      if (isEmpty(oldRow[f])) continue;      // nothing to give
      if (!isEmpty(newRow[f])) continue;     // live row already knows better
      moves.push(f);
    }
    plan.push({ section, oldId, newId, title, oldKey, newKey, moves,
                oldSection: oldRow.section, newSection: newRow.section });
  }
}

const withMoves = plan.filter((p) => p.moves.length);
const implMoves = plan.filter((p) => p.moves.includes("implFiles"));

console.log(`retargets in drift file : ${plan.length + skipped.length}`);
console.log(`  applicable            : ${plan.length}`);
console.log(`  carrying work to move : ${withMoves.length}`);
console.log(`    of which implFiles  : ${implMoves.length}`);
console.log(`  skipped               : ${skipped.length}`);
for (const s of skipped.slice(0, 5)) console.log(`      ${s.oldId} -> ${s.newId}: ${s.why}`);
if (skipped.length > 5) console.log(`      ... ${skipped.length - 5} more`);

const pairs = new Set(plan.map((p) => `${p.oldSection}->${p.newSection}`));
console.log(`  section moves         : ${[...pairs].join(", ") || "none"}`);

if (!APPLY) {
  console.log("\nDRY RUN — nothing written. Re-run with --apply to commit these merges.");
  process.exit(0);
}

let merged = 0, marked = 0;
for (const p of plan) {
  const oldRow = registry.frames[p.oldKey];
  const newRow = registry.frames[p.newKey];
  for (const f of p.moves) {
    newRow[f] = oldRow[f];
    merged++;
  }
  oldRow.gone = true;
  oldRow.aliasNote =
    `rebuilt as ${p.newId} on ${newRow.page}; hand-set fields merged onto that row ` +
    `(figma-apply-retargets ${drift.generated})`;
  marked++;
}

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");
console.log(`\nAPPLIED: ${merged} field(s) merged, ${marked} stale row(s) marked gone.`);
console.log("No row was deleted. Re-run build-registry.mjs to refresh derived stats.");
