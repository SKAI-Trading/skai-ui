#!/usr/bin/env node
/**
 * snapshot-to-nodes.mjs — fold a validated harvest into the registry's inputs.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * The catalog had a seam with nothing across it. `figma-drift.mjs` reads a
 * SNAPSHOT and reports what changed; `build-registry.mjs` reads `<section>.
 * nodes.txt` and `<section>.titles.tsv`. Nothing wrote the first into the
 * second, so a harvest could succeed completely, produce a correct drift
 * report, and leave `registry.json` untouched.
 *
 * That is not hypothetical. On 2026-09-06 the snapshots were 30-33 hours old,
 * the drift report listed 870 actionable rows, and `registry.json` — the file
 * `coverage.mjs` and every measuring lane actually reads — still declared
 * `pagesHarvested: 2026-08-18`, nineteen days earlier. Three waves of
 * harvesting had reached the report and never reached the state.
 *
 * A drift report is INFORMATION. The registry is STATE. This script is the only
 * thing that turns one into the other.
 *
 * ── Contract ─────────────────────────────────────────────────────────────────
 *   node figma-catalog/snapshot-to-nodes.mjs <snapshot.json> [--write]
 *
 * Without `--write` it reports the delta per section and touches nothing. That
 * is the default deliberately: folding a harvest in CHANGES THE DENOMINATOR
 * every parity figure is quoted against, so it should be a decision someone
 * takes after reading the numbers, not a side effect of running a script.
 *
 * ⛔ REFUSES A SNAPSHOT THAT HAS NOT PROVED ITSELF. Every section must carry
 * `liveChildCount` equal to `nodes.length`, because a short harvest folded into
 * the registry does not merely mis-report — it DELETES catalogued ids, and
 * `build-registry.mjs` preserves hand-set implFiles/status/notes keyed by node
 * id, so those records go with them. Run `validate-snapshot.mjs` first; this
 * repeats the cheap half of that check rather than trusting it was run.
 *
 * ⚠️ SUBTREE SNAPSHOTS ARE NOT INTERCHANGEABLE WITH PAGE-CHILDREN ONES. A
 * full-depth harvest of the five Skai-originals game pages carries ~10,000
 * uncatalogued leaf nodes (Vector, CTA/button, Path 58) that the catalogue
 * deliberately excludes. Folding those in would bury `figma-todo.tsv` under one
 * ADDED row each. The script warns when a section's capture exceeds its current
 * node list by more than 5x, and leaves the judgement to the caller — see the
 * ruling recorded in docs/product/V1_TODO.md.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const files = args.filter((a) => !a.startsWith("--"));

if (files.length === 0) {
  console.error("usage: node snapshot-to-nodes.mjs <snapshot.json> [--write]");
  process.exit(1);
}

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

/** Existing ids for a section, or null when the section is new to the catalog. */
function currentIds(section) {
  const p = path.join(DIR, `${section}.nodes.txt`);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
}

const rows = [];
const refused = [];

for (const file of files) {
  const doc = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [section, v] of Object.entries(doc)) {
    const nodes = Array.isArray(v?.nodes) ? v.nodes : null;
    if (!nodes) {
      refused.push({ section, why: "no `nodes` array" });
      continue;
    }
    // The completeness claim, repeated rather than trusted. A short harvest
    // folded in deletes catalogued ids and the hand-set records keyed to them.
    if (typeof v.liveChildCount !== "number" || nodes.length !== v.liveChildCount) {
      refused.push({
        section,
        why:
          `unproven capture: ${nodes.length} nodes against liveChildCount ` +
          `${JSON.stringify(v.liveChildCount)}. Folding this in would DELETE ` +
          `catalogued ids and the implFiles/status/notes keyed to them.`,
      });
      continue;
    }

    const before = currentIds(section);
    const ids = nodes.map((n) => String(n[0]));
    const titles = nodes.map((n) => `${n[0]}\t${n[1] ?? ""}`);

    const prior = new Set(before || []);
    const now = new Set(ids);
    const added = ids.filter((i) => !prior.has(i)).length;
    const removed = (before || []).filter((i) => !now.has(i)).length;

    // ── The guard the completeness check cannot be ───────────────────────────
    // `liveChildCount === nodes.length` is satisfiable by a DEFEATED harvest:
    // `get_metadata` does not descend into every frame and says nothing about
    // having stopped, so a capture that takes both its node list AND its count
    // from it produces two numbers that agree exactly and certify nothing. That
    // is not a hypothesis — wave 21 passed that check on 33 sections while
    // returning 1,914 of a towers page's 2,011 descendants.
    //
    // What exposes it is the REMOVAL count. Figma does not delete 407 of a
    // section's 827 frames in nineteen days; a design file grows and gets
    // retitled. A mass deletion is the signature of a SHORT CAPTURE, and folding
    // one in destroys the hand-set implFiles/status/notes keyed to every id it
    // drops.
    if (before && before.length >= 20) {
      const lost = removed / before.length;
      if (lost > 0.25) {
        refused.push({
          section,
          why:
            `MASS DELETION: ${removed} of ${before.length} catalogued ids ` +
            `(${(lost * 100).toFixed(0)}%) are absent from this capture. Design ` +
            `files do not shed a quarter of a section; a short harvest looks ` +
            `exactly like this and passes the count check, because both numbers ` +
            `came from the same lossy read. Re-harvest with the Plugin API.`,
        });
        continue;
      }
    }

    // A subtree harvest against a page-children list. Not an error — the game
    // sections genuinely hold thousands of leaf nodes — but folding one in is a
    // different decision from refreshing a section in place.
    const ratio = before && before.length ? ids.length / before.length : Infinity;

    rows.push({ section, before: before ? before.length : 0, after: ids.length, added, removed, ratio, ids, titles, isNew: before === null });
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`snapshot-to-nodes: ${rows.length} section(s) readable, ${refused.length} refused.\n`);

if (rows.length) {
  console.log("  section                 before   after   +added  -removed   note");
  for (const r of rows.sort((a, b) => b.after - a.after)) {
    const note = r.isNew
      ? "NEW section"
      : r.ratio > 5
        ? `SUBTREE? ${r.ratio.toFixed(0)}x the current list`
        : "";
    console.log(
      `    ${pad(r.section, 22)} ${String(r.before).padStart(6)} ${String(r.after).padStart(7)} ` +
        `${String("+" + r.added).padStart(8)} ${String("-" + r.removed).padStart(9)}   ${note}`,
    );
  }
  const net = rows.reduce((a, r) => a + r.after - r.before, 0);
  console.log(`\n  net change to the registry's id count: ${net > 0 ? "+" : ""}${net}`);
  console.log("  ⚠ this moves the denominator every parity figure is quoted against.");
}

if (refused.length) {
  console.log(`\n  ${refused.length} section(s) REFUSED:`);
  for (const r of refused) console.log(`    ${pad(r.section, 22)} ${r.why}`);
}

if (!write) {
  console.log("\n  DRY RUN — nothing written. Re-run with --write to apply, then:");
  console.log("    node figma-catalog/build-registry.mjs");
  process.exit(0);
}

for (const r of rows) {
  fs.writeFileSync(path.join(DIR, `${r.section}.nodes.txt`), r.ids.join("\n") + "\n", "utf8");
  fs.writeFileSync(path.join(DIR, `${r.section}.titles.tsv`), r.titles.join("\n") + "\n", "utf8");
}
console.log(`\n  wrote ${rows.length * 2} files. Now run:`);
console.log("    node figma-catalog/build-registry.mjs");
process.exit(0);
