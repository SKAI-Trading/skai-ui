#!/usr/bin/env node
/**
 * audit-figma-txt.mjs — diff EVERY link in ~/Desktop/figma.txt against
 * registry.json, so a section (or a single frame) added to the text file can
 * never sit uncataloged and unnoticed.
 *
 * Parses each `<section>:` heading and every figma.com link under it, recording
 * the link's OWN fileKey (the file spans more than one) plus the bare node-id.
 * Reports, per section: total links, how many are already in the registry, and
 * every missing node.
 *
 * Run: node figma-catalog/audit-figma-txt.mjs [path-to-figma.txt]
 */
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
// figma.txt is the catalog's INPUT — the hand-maintained link dump every
// <section>.nodes.txt is parsed from. It lived at ~/Desktop/figma.txt, which
// meant the audit could not run on a machine that lacked it (and the catalog
// silently omitted any page never pasted into it). It is now committed at
// figma-catalog/figma.txt; prefer that, keep the Desktop path as a fallback.
const REPO_TXT = path.join(DIR, "figma.txt");
const SRC =
  process.argv[2] ||
  (fs.existsSync(REPO_TXT) ? REPO_TXT : path.join(os.homedir(), "Desktop", "figma.txt"));
const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));

// registry keys: bare node for the primary file, "<fileKey>:<node>" otherwise.
// Index by BOTH so a lookup succeeds regardless of which file the link names.
const byFileNode = new Set();
const byNode = new Set();
for (const f of Object.values(reg.frames)) {
  byFileNode.add(`${f.fileKey}:${f.node}`);
  byNode.add(f.node);
}

// slugify a heading into the section key build-registry.mjs would use
const slug = (h) =>
  h.replace(/:$/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// A figma.txt heading does not always slugify to the catalog section name. Map
// the exceptions here so the audit compares a section against the right frames
// instead of reporting a phantom uncataloged section.
//   trade-7-27-update -> the 2026-07-27 re-scope of the whole Trade page; it is
//   the sole approved truth for `trade` and SUPERSEDES the earlier "Trade:"
//   heading (whose 219 links are a subset of these 692), plus the retired
//   `trench` and `trade-bugrefs` sections.
const SECTION_ALIAS = {
  "trade-7-27-update": "trade",
  // 2026-07-28. Three more headings that are NOT their own section. Without
  // these the audit prints "section: NO" for a heading whose frames are in fact
  // fully cataloged elsewhere — a false alarm that trains the reader to ignore
  // the column, which is exactly how the REAL gap (plinko) sat unnoticed.
  //   wallet-import = 32 Wallet-page import/recovery frames, all under `wallet`
  //   trench        = 285 Trade-page frames, folded into `trade` on 2026-07-27
  //   play-region…  = a single Play-page popup, now listed in play.nodes.txt
  "wallet-import": "wallet",
  trench: "trade",
  "play-region-message-popup": "play",
};

// Node-ids that figma.txt still lists but that NO LONGER RESOLVE in the Figma
// file — deleted upstream after the list was pasted. There is nothing to
// catalog, so counting them as "missing" would be a permanent false gap that
// trains the reader to ignore a non-zero MISSING column. Sourced from the
// `gone` rows in bugref-aliases.tsv (see BUGREF_AUDIT.md).
const GONE = new Set();
{
  const p = path.join(DIR, "bugref-aliases.tsv");
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const [ref, , reason] = line.split("\t");
      if (reason === "gone") GONE.add(ref.includes(":") ? ref.split(":").pop() : ref);
    }
  }
}

const lines = fs.readFileSync(SRC, "utf8").split("\n");
const sections = [];
let cur = null;
for (const raw of lines) {
  const line = raw.trim();
  // Headings are not always plain words: "Trade (7/27 update):" carries digits,
  // parens and a slash. The old /^([A-Za-z][A-Za-z ]*):$/ silently skipped it,
  // which meant its 692 links were audited against NOTHING — the whole section
  // was invisible and reported as neither present nor missing. Keep this
  // permissive, and let SECTION_ALIAS map the slug onto the real section key.
  const head = line.match(/^([A-Za-z][A-Za-z0-9 ()/_.,'-]*):\s*$/);
  if (head) {
    const key = slug(head[1]);
    cur = { heading: head[1].trim(), key: SECTION_ALIAS[key] || key, links: [] };
    sections.push(cur);
    continue;
  }
  // a link can carry either /design/<key>/ or be a bare node-id line
  const m = line.match(/figma\.com\/design\/([A-Za-z0-9]+)\/[^?]*\?[^ ]*node-id=([0-9]+[-:][0-9]+)/);
  if (m && cur) cur.links.push({ fileKey: m[1], node: m[2].replace(":", "-") });
}

let grandTotal = 0, grandMissing = 0;
const report = [];
for (const s of sections) {
  const seen = new Set();
  const uniq = [];
  for (const l of s.links) {
    const k = `${l.fileKey}:${l.node}`;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(l);
  }
  const missing = uniq.filter(
    (l) => !byFileNode.has(`${l.fileKey}:${l.node}`) && !byNode.has(l.node) && !GONE.has(l.node),
  );
  grandTotal += uniq.length;
  grandMissing += missing.length;
  const files = [...new Set(uniq.map((l) => l.fileKey))];
  report.push({
    heading: s.heading,
    key: s.key,
    links: s.links.length,
    unique: uniq.length,
    inRegistry: uniq.length - missing.length,
    missing: missing.length,
    fileKeys: files,
    inCatalog: Object.values(reg.frames).some((f) => f.section === s.key),
    missingNodes: missing.map((m) => m.node),
  });
}

console.log(`source: ${SRC}`);
console.log(`sections: ${report.length}  unique frames: ${grandTotal}  MISSING: ${grandMissing}\n`);
const pad = (s, n) => String(s).padEnd(n);
console.log(pad("section", 22) + pad("uniq", 6) + pad("inReg", 7) + pad("MISSING", 9) + pad("secInCat", 10) + "fileKeys");
for (const r of report) {
  console.log(
    pad(r.key, 22) + pad(r.unique, 6) + pad(r.inRegistry, 7) + pad(r.missing, 9) +
    pad(r.inCatalog ? "yes" : "NO", 10) + r.fileKeys.join(","),
  );
}
const gaps = report.filter((r) => r.missing > 0);
if (gaps.length) {
  console.log("\n--- sections with uncataloged frames ---");
  for (const g of gaps) {
    console.log(`\n${g.key} (${g.missing} missing, file ${g.fileKeys.join(",")})`);
    // emit a ready-to-use nodes.txt body
    console.log(g.missingNodes.join("\n"));
  }
}
// machine-readable for follow-up tooling
fs.writeFileSync(path.join(DIR, "audit-figma-txt.json"), JSON.stringify({ generated: new Date().toISOString(), source: SRC, grandTotal, grandMissing, report }, null, 2));
console.log("\nwrote figma-catalog/audit-figma-txt.json");
