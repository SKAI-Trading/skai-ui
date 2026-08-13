#!/usr/bin/env node
/**
 * figma-drift.mjs — turn a live Figma snapshot into an actionable TODO log.
 *
 * Casey's ruling, 2026-08-13: **live Figma is always correct.** When a frame is
 * added, removed or renamed, the catalog's job is not to quietly match it — it
 * is to SAY SO, so the change can be worked through the system.
 *
 * ── Why this exists rather than a plain re-harvest ────────────────────────────
 * `build-registry.mjs` preserves hand-set fields (implFiles / status / notes /
 * verifiedAt) keyed by node-id. That is the most expensive data in the catalog:
 * it is the record of which code implements which frame and who verified it.
 * A blind re-harvest drops every one of those fields for a node-id that no
 * longer exists — silently, because the row simply stops being written.
 *
 * So a REMOVED node is the interesting event, not the boring one. If it carried
 * implFiles, some code in this repo implements a frame the designer has since
 * deleted, and somebody needs to decide whether that code should go too. This
 * tool surfaces exactly that, with the metadata attached, instead of discarding
 * it.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   1. Harvest live Figma into a snapshot (via the Figma MCP; see SNAPSHOT
 *      SHAPE below). One entry per catalogued section.
 *   2. node figma-catalog/figma-drift.mjs <snapshot.json>
 *
 * Writes:
 *   figma-todo.tsv      one row per actionable change, newest run replaces it
 *   figma-drift.json    the same data structured, plus the dropped metadata
 *
 * Exit code is 0 even when drift is found — drift is information, not failure.
 * Exit 1 only for a malformed snapshot, so a wrong invocation cannot read as
 * "no drift".
 *
 * ── SNAPSHOT SHAPE ───────────────────────────────────────────────────────────
 *   { "<section>": { "pageId": "9061:15449",
 *                    "nodes": [ ["9061-15450", "Directory"], ... ] } }
 *
 * A section present in the registry but ABSENT from the snapshot is reported as
 * `not-harvested`, never as "everything was deleted" — an incomplete harvest
 * must not read as mass deletion. That distinction is the whole reason the
 * snapshot is keyed by section rather than being a flat list.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));

const snapshotPath = process.argv[2];
if (!snapshotPath) {
  console.error("usage: node figma-drift.mjs <snapshot.json>");
  process.exit(1);
}

let snapshot;
try {
  snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
} catch (e) {
  console.error(`Cannot read snapshot ${snapshotPath}: ${e.message}`);
  process.exit(1);
}
if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
  console.error("Snapshot must be an object keyed by section.");
  process.exit(1);
}

const registry = JSON.parse(
  fs.readFileSync(path.join(DIR, "registry.json"), "utf8"),
);

/**
 * node-id -> row, and section -> Set(node-id), from the CURRENT registry.
 *
 * `registry.frames` is an OBJECT keyed "<fileKey>:<node>", not an array, and the
 * dash-form id lives on `.node`. Iterating it as an array yields nothing and
 * every live frame then looks new — a silent, very convincing wrong answer.
 *
 * Rows already flagged `gone` are excluded: the catalog's existing convention
 * (fed by bugref-aliases.tsv) is that a node deleted upstream is KEPT for the
 * record rather than dropped. Re-reporting those every run would bury real
 * drift under 11 permanent rows.
 */
const byId = new Map();
const bySection = new Map();
const alreadyGone = new Set();
for (const frame of Object.values(registry.frames || {})) {
  const id = frame.node;
  if (!id) continue;
  if (frame.gone) {
    alreadyGone.add(id);
    continue;
  }
  byId.set(id, frame);
  if (!bySection.has(frame.section)) bySection.set(frame.section, new Set());
  bySection.get(frame.section).add(id);
}

/**
 * Hand-set fields worth rescuing when a node disappears.
 *
 * `status` is listed here so it is PRESERVED in figma-drift.json, but it is
 * deliberately NOT evidence of human work — see below.
 */
const HAND_SET = ["implFiles", "status", "notes", "verifiedAt"];

/**
 * A DEFAULT is not a decision.
 *
 * `build-registry.mjs:475` assigns `status: p.status || "unknown"`, so every row
 * that nobody has triaged still carries a truthy `status`. Treating that as
 * "somebody did work here" put **2,453 of 3,885 rows (63%)** one deletion away
 * from the REMOVED-WITH-WORK class — the highest-ranked, most-alarming class in
 * figma-todo.tsv, the one whose entire job is to stop a reader before they
 * delete something.
 *
 * Caught on the first real run: all 12 of keno's REMOVED-WITH-WORK rows had
 * `implFiles: []`, `notes: null`, `verifiedAt: null`. Twelve false alarms in the
 * top class is how you teach someone to skim the top class.
 *
 * So `status` only counts when it is something a human chose. Everything else
 * must be non-empty in its own right.
 */
const UNTRIAGED_STATUS = new Set(["unknown", "", null, undefined]);
const hasHandSetWork = (row) => {
  if (!row) return false;
  if (Array.isArray(row.implFiles) && row.implFiles.length) return true;
  if (row.notes) return true;
  if (row.verifiedAt) return true;
  return !UNTRIAGED_STATUS.has(row.status);
};

const todo = [];
const drift = { generated: new Date().toISOString(), sections: {} };

for (const [section, ids] of bySection) {
  const live = snapshot[section];

  if (!live) {
    // NOT the same as "all frames deleted". Say so loudly and move on.
    drift.sections[section] = { status: "not-harvested", catalogued: ids.size };
    todo.push([
      section, "-", "NOT-HARVESTED", "-",
      `${ids.size} catalogued frames were not covered by this snapshot; drift unknown`,
      "",
    ]);
    continue;
  }

  const liveIds = new Map((live.nodes || []).map(([id, title]) => [id, title]));

  const added = [...liveIds.keys()].filter((id) => !ids.has(id));
  const removed = [...ids].filter((id) => !liveIds.has(id));
  const retitled = [];
  for (const id of ids) {
    if (!liveIds.has(id)) continue;
    const was = byId.get(id)?.title;
    const now = liveIds.get(id);
    if (was && now && was !== now) retitled.push({ id, was, now });
  }

  drift.sections[section] = {
    status: added.length || removed.length || retitled.length ? "drift" : "clean",
    catalogued: ids.size,
    live: liveIds.size,
    added: added.length,
    removed: removed.length,
    retitled: retitled.length,
    // The rescue: every dropped row's hand-set work, kept verbatim.
    removedRows: removed.map((id) => {
      const row = byId.get(id) || {};
      const kept = {};
      for (const k of HAND_SET) if (row[k] !== undefined) kept[k] = row[k];
      return { id, title: row.title, ...kept };
    }),
  };

  /**
   * ★ RE-CREATION, NOT DELETION — the single most important distinction here.
   *
   * When a designer rebuilds a screen on a new page, Figma assigns NEW node
   * ids. The old ids resolve nowhere, so a naive diff reports them as deleted
   * and the new ones as added. Acting on that reading would delete working
   * code: on 2026-08-13 the `home` section showed 127 "deletions" carrying 79
   * implFiles across WhalesScreen / CheckoutPage / WhaleSelectorModal -- all
   * still live, all still correct, because equivalent frames had been rebuilt
   * on "Home 2" under 13008-* ids.
   *
   * Titles in this file are fully-qualified breadcrumbs
   * ("Skai > Home > Whales > filter - custom input 1VH (1440 x 900px)"), which
   * makes them a reliable join key. An exact title match between a removed and
   * an added node is a RETARGET: keep the row's hand-set work, repoint its id.
   */
  const removedByTitle = new Map();
  for (const id of removed) {
    const t = byId.get(id)?.title;
    if (t) (removedByTitle.get(t) || removedByTitle.set(t, []).get(t)).push(id);
  }
  const retargets = [];
  const claimedAdds = new Set();
  for (const id of added) {
    const t = liveIds.get(id);
    const candidates = removedByTitle.get(t);
    if (!t || !candidates || !candidates.length) continue;
    const oldId = candidates.shift();
    retargets.push({ oldId, newId: id, title: t });
    claimedAdds.add(id);
  }
  const retargetedOld = new Set(retargets.map((r) => r.oldId));
  drift.sections[section].retargeted = retargets.length;
  drift.sections[section].retargets = retargets;

  for (const { oldId, newId, title } of retargets) {
    const row = byId.get(oldId) || {};
    todo.push([
      section, `${oldId} -> ${newId}`, "RETARGET", title,
      "Same title, new node-id: the frame was REBUILT, not deleted. Repoint the catalog row and KEEP its implFiles/status/verifiedAt -- the code still implements it.",
      Array.isArray(row.implFiles) ? row.implFiles.join(" ") : "",
    ]);
  }

  for (const id of added) {
    if (claimedAdds.has(id)) continue;
    todo.push([
      section, id, "ADDED", liveIds.get(id) || "",
      "New frame in Figma with no catalog row -- needs implementation or an explicit out-of-scope note",
      "",
    ]);
  }
  for (const id of removed) {
    if (retargetedOld.has(id)) continue;
    const row = byId.get(id) || {};
    const impl = Array.isArray(row.implFiles) ? row.implFiles.join(" ") : "";
    todo.push([
      section, id, hasHandSetWork(row) ? "REMOVED-WITH-WORK" : "REMOVED",
      row.title || "",
      hasHandSetWork(row)
        ? "Frame gone from Figma with NO same-title replacement, but the catalog recorded implementing code -- check the code is not now orphaned before removing the row"
        : "Frame gone from Figma with no same-title replacement; catalog row is stale",
      impl,
    ]);
  }
  for (const r of retitled) {
    todo.push([
      section, r.id, "RETITLED", r.now,
      `was: ${r.was}`,
      Array.isArray(byId.get(r.id)?.implFiles)
        ? byId.get(r.id).implFiles.join(" ")
        : "",
    ]);
  }
}

// Sections present live but entirely absent from the registry.
for (const section of Object.keys(snapshot)) {
  if (bySection.has(section)) continue;
  const n = (snapshot[section].nodes || []).length;
  drift.sections[section] = { status: "new-section", live: n };
  todo.push([
    section, "-", "NEW-SECTION", "-",
    `${n} frames on a page with no catalog section at all`,
    "",
  ]);
}

// Most actionable first: work-bearing deletions, then additions, then the rest.
const RANK = {
  "REMOVED-WITH-WORK": 0, RETARGET: 1, "NEW-SECTION": 2, ADDED: 3,
  REMOVED: 4, RETITLED: 5, "NOT-HARVESTED": 6,
};
todo.sort((a, b) => (RANK[a[2]] ?? 9) - (RANK[b[2]] ?? 9) || a[0].localeCompare(b[0]));

/**
 * Output names derive from the SNAPSHOT name, so parallel lanes cannot clobber
 * each other.
 *
 * The first real run had two lanes (games, webapp) writing one shared
 * `figma-todo.tsv`. Whichever finished last silently replaced the other's
 * findings, and because the loser's sections then appear as NOT-HARVESTED in
 * the winner's file, the result LOOKS complete and self-consistent. A partial
 * log that reads as a whole one is worse than an obviously missing file.
 *
 * `snapshot.games.json` -> `figma-todo.games.tsv` + `figma-drift.games.json`.
 * A snapshot not named `snapshot.<lane>.json` keeps the plain names.
 */
const snapBase = path.basename(snapshotPath).replace(/\.json$/i, "");
const lane = /^snapshot\.(.+)$/i.exec(snapBase)?.[1];
const todoOut = lane ? `figma-todo.${lane}.tsv` : "figma-todo.tsv";
const driftOut = lane ? `figma-drift.${lane}.json` : "figma-drift.json";

const header = ["section", "nodeId", "change", "title", "why", "implFiles"];
fs.writeFileSync(
  path.join(DIR, todoOut),
  [header, ...todo].map((r) => r.join("\t")).join("\n") + "\n",
);
fs.writeFileSync(
  path.join(DIR, driftOut),
  JSON.stringify(drift, null, 2) + "\n",
);

const counts = todo.reduce((a, r) => ((a[r[2]] = (a[r[2]] || 0) + 1), a), {});
console.log(
  `registry: ${byId.size} live rows` +
    (alreadyGone.size ? ` (+${alreadyGone.size} already flagged gone, skipped)` : ""),
);
console.log(`${todoOut}: ${todo.length} rows`);
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(20)} ${v}`);
}
const withWork = counts["REMOVED-WITH-WORK"] || 0;
if (withWork) {
  console.log(
    `\n  ${withWork} deleted frame(s) had implementing code recorded. ` +
      `Their implFiles are preserved in figma-drift.json -- read it before ` +
      `deleting anything.`,
  );
}
