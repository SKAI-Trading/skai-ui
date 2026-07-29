#!/usr/bin/env node
/**
 * families.mjs — roll registry.json frames up into families and score
 * implementation evidence from code citations + routing.
 *
 * Writes figma-catalog/families.json: one entry per section/family with
 * frame ids, devices, variants, the set of code files that cite any of its
 * frames, the top dirs those files live in, and an evidence-based status
 * proposal (never overwrites a hand-set status in registry.json).
 *
 * Usage: node figma-catalog/families.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));

const fams = {};
for (const [id, f] of Object.entries(reg.frames)) {
  if (f.kind !== "screen") continue;
  const key = `${f.section}/${f.family}`;
  const e = (fams[key] = fams[key] || {
    section: f.section,
    family: f.family,
    frames: [],
    devices: new Set(),
    variants: new Set(),
    citedFiles: new Set(),
    handStatus: new Set(),
  });
  e.frames.push(id);
  if (f.device) e.devices.add(f.device);
  if (f.variant) e.variants.add(f.variant);
  for (const cf of f.citedByFiles || []) e.citedFiles.add(cf);
  e.handStatus.add(f.status);
}

// dir signal: collapse cited files to their 2-3 level dirs
const dirOf = (p) => p.split("/").slice(0, 4).join("/");

const out = {};
for (const [key, e] of Object.entries(fams)) {
  const citedFiles = [...e.citedFiles];
  const dirs = [...new Set(citedFiles.map(dirOf))].sort();
  // evidence-based proposal (NOT authoritative — verified in task 3)
  let proposed = "not-started";
  if (citedFiles.length >= 3) proposed = "likely-done";
  else if (citedFiles.length >= 1) proposed = "partial";
  out[key] = {
    section: e.section,
    family: e.family,
    frameCount: e.frames.length,
    frames: e.frames,
    devices: [...e.devices],
    variants: [...e.variants],
    citedFileCount: citedFiles.length,
    citedFiles,
    dirs,
    proposedStatus: proposed,
  };
}

fs.writeFileSync(path.join(DIR, "families.json"), JSON.stringify({ generated: new Date().toISOString(), families: out }, null, 2));

// summary
const bySec = {};
for (const e of Object.values(out)) {
  const b = (bySec[e.section] = bySec[e.section] || { families: 0, "likely-done": 0, partial: 0, "not-started": 0 });
  b.families++;
  b[e.proposedStatus]++;
}
console.log("families.json written:", Object.keys(out).length, "families");
console.log(JSON.stringify(bySec, null, 2));
