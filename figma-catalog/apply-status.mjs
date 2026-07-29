#!/usr/bin/env node
/**
 * apply-status.mjs — fold figma-catalog/status.<section>.tsv (family-level
 * verified statuses) back into registry.json at the FRAME level.
 *
 * Each status line: family <TAB> status <TAB> primaryFile <TAB> route <TAB> reason
 * Every screen frame in that section/family gets status/route/notes set, and
 * implFiles gets primaryFile added. Non-screen frames are left as-is.
 *
 * Usage: node figma-catalog/apply-status.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const regPath = path.join(DIR, "registry.json");
const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
const SECTIONS = ["home", "wallet", "trade", "predict", "play", "dice", "pwa", "crash"];
const VALID = new Set(["done", "partial", "not-started", "unknown"]);

// family key -> {status, primaryFile, route, reason}
const statusByFam = {};
let loaded = 0;
for (const sec of SECTIONS) {
  const p = path.join(DIR, `status.${sec}.tsv`);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const [family, status, primaryFile, route, ...rest] = line.split("\t");
    const reason = rest.join("\t");
    const st = (status || "").trim();
    if (!VALID.has(st)) continue;
    statusByFam[`${sec}/${family.trim()}`] = {
      status: st,
      primaryFile: (primaryFile || "").trim(),
      route: (route || "").trim(),
      reason: (reason || "").trim(),
    };
    loaded++;
  }
}

let applied = 0;
const famCounts = {};
for (const f of Object.values(reg.frames)) {
  if (f.kind !== "screen") continue;
  const key = `${f.section}/${f.family}`;
  const s = statusByFam[key];
  if (!s) continue;
  f.status = s.status;
  if (s.route && s.route !== "-") f.route = s.route;
  if (s.reason) f.notes = s.reason;
  if (s.primaryFile && s.primaryFile !== "-" && !f.implFiles.includes(s.primaryFile))
    f.implFiles.push(s.primaryFile);
  applied++;
  famCounts[key] = s.status;
}

reg.generated = new Date().toISOString();
fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));

// summary
const bySecStatus = {};
for (const f of Object.values(reg.frames)) {
  if (f.kind !== "screen") continue;
  const b = (bySecStatus[f.section] = bySecStatus[f.section] || {});
  b[f.status] = (b[f.status] || 0) + 1;
}
const famStatus = {};
for (const st of Object.values(famCounts)) famStatus[st] = (famStatus[st] || 0) + 1;
console.log(`status lines loaded: ${loaded}; frames updated: ${applied}`);
console.log("families by status:", JSON.stringify(famStatus));
console.log("screen frames by section/status:", JSON.stringify(bySecStatus, null, 2));
