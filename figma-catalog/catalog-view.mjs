#!/usr/bin/env node
/**
 * catalog-view.mjs — render registry.json as a human-readable Markdown catalog.
 * Groups screens by section → family, lists frame count, devices, variants,
 * a representative Figma link, and any implementing files / status.
 * Usage: node figma-catalog/catalog-view.mjs > figma-frame-catalog.md
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
const FK = reg.fileKey;
const FILE_KEYS = reg.fileKeys || { [FK]: "Skai-Web-App" };
// Link per-frame: frames carry their own fileKey/fileName/node (multi-file catalog).
// Fall back to the primary file for older single-file registries.
const link = (f) => {
  const fk = (f && f.fileKey) || FK;
  const name = (f && f.fileName) || FILE_KEYS[fk] || "Skai-Web-App";
  const node = (f && f.node) || (f && f.id) || f;
  return `https://www.figma.com/design/${fk}/${name}?node-id=${node}&m=dev`;
};
// DERIVE the section list from the registry rather than hardcoding it. The old
// literal was
//   ["home","wallet","trade","predict","play","dice","pwa","crash"]
// — the same stale eight that apply-status.mjs carried before it was fixed, and
// stale in the same way: build-registry.mjs had grown to 24 sections and this
// view silently rendered only those 8. onboarding, legal, master-sheet, mines,
// blackjack, coinflip, skratch, missing-play-images, plinko, darts, chicken,
// hilo, social, governance, user-flow, towers and keno were all catalogued,
// tracked and statused, yet absent from the generated Markdown — which reads as
// "not catalogued" to anyone browsing the doc instead of the JSON.
//
// Ordering: readiness first (ready > wip > meta) so ready-for-dev work is at the
// top, then by screen count, so the biggest outstanding surface leads.
const RANK = { ready: 0, wip: 1, meta: 2 };
const readinessOf = (s) => {
  const f = Object.values(reg.frames).find((x) => x.section === s);
  return (f && f.readiness) || "meta";
};
const SECTIONS = Object.keys(reg.stats.bySection).sort((a, b) => {
  const r = RANK[readinessOf(a)] - RANK[readinessOf(b)];
  if (r) return r;
  return (reg.stats.bySection[b].screens ?? 0) - (reg.stats.bySection[a].screens ?? 0);
});

const out = [];
out.push("# Figma Frame Catalog — SKAI redesign\n");
out.push(
  `_Generated ${reg.generated} from \`figma-catalog/registry.json\`. Files: ${Object.entries(FILE_KEYS)
    .map(([k, n]) => `${n} \`${k}\``)
    .join(", ")}._\n`,
);
out.push(`Rebuild: \`node figma-catalog/build-registry.mjs && node figma-catalog/catalog-view.mjs > figma-frame-catalog.md\`\n`);

// overall tally
const screensOf = (s) =>
  Object.values(reg.frames).filter((f) => f.section === s && f.kind === "screen");
const tally = (arr) => {
  const t = { done: 0, partial: 0, "not-started": 0, unknown: 0 };
  for (const f of arr) if (f.status in t) t[f.status]++;
  return t;
};

out.push("## Coverage\n");
out.push(
  "Readiness is the marker on the Figma page itself (`✅` ready-for-dev, `🚧` under construction, " +
    "`📍`/`🌎` reference). Status counts **screens only** — scaffolding (dropdowns, notes, breakpoints, " +
    "master modules) is on the canvas but is not a surface to build.\n",
);
out.push("| Section | Rdy | Frames | Screens | Scaffold | Families | Done | Partial | Not started | Untriaged | Cited |");
out.push("|---------|:---:|-------:|--------:|---------:|---------:|-----:|--------:|------------:|----------:|------:|");
let gt = { done: 0, partial: 0, "not-started": 0, unknown: 0 };
for (const s of SECTIONS) {
  const st = reg.stats.bySection[s];
  const scr = screensOf(s);
  const fams = new Set(scr.map((f) => f.family));
  const t = tally(scr);
  for (const k of Object.keys(gt)) gt[k] += t[k];
  const mark = { ready: "✅", wip: "🚧", meta: "📍" }[readinessOf(s)] || "";
  out.push(
    `| ${s} | ${mark} | ${st.frames} | ${st.screens ?? "?"} | ${st.nonScreen ?? "?"} | ${fams.size} | ` +
      `${t.done} | ${t.partial} | ${t["not-started"]} | ${t.unknown} | ${st.cited} |`,
  );
}
const gTot = gt.done + gt.partial + gt["not-started"] + gt.unknown;
out.push(
  `| **all** | | **${reg.stats.total}** | **${gTot}** | | | **${gt.done}** | **${gt.partial}** | ` +
    `**${gt["not-started"]}** | **${gt.unknown}** | **${reg.stats.cited}** |`,
);
out.push("");

// Page-level drift + out-of-scope, so the doc carries the same truth as the registry.
const cov = reg.stats.pageCoverage || [];
const drifted = cov.filter((p) => p.delta);
out.push("### Drift against live Figma\n");
if (!drifted.length) {
  out.push("Every catalogued page matches its live child count. No drift.\n");
} else {
  out.push("Frames that exist in Figma but are not in the catalog:\n");
  out.push("| Page | Catalogued | Live | Delta |");
  out.push("|------|-----------:|-----:|------:|");
  for (const p of drifted) out.push(`| ${p.page} | ${p.rows} | ${p.live} | ${p.delta} |`);
  out.push("");
}
const unc = reg.stats.uncoveredPages || [];
if (unc.length) {
  out.push("### Pages with no section\n");
  out.push("Recorded as out of scope in `pages.json` (`outOfScope` carries the reason):\n");
  out.push("| Page | Top-level nodes |");
  out.push("|------|----------------:|");
  for (const p of unc) out.push(`| ${p.page} | ${p.live} |`);
  out.push("");
}

// Per-section family breakdown
for (const s of SECTIONS) {
  out.push(`\n## ${s[0].toUpperCase() + s.slice(1)}\n`);
  const frames = Object.entries(reg.frames).filter(([, f]) => f.section === s && f.kind === "screen");
  // group by family
  const byFam = {};
  for (const [id, f] of frames) (byFam[f.family] = byFam[f.family] || []).push({ id, ...f });
  const fams = Object.entries(byFam).sort((a, b) => b[1].length - a[1].length);
  if (!fams.length) {
    out.push("_No titled screens yet._\n");
    continue;
  }
  out.push("| Family | Frames | Devices | Variants | Impl / status | Example |");
  out.push("|--------|-------:|---------|----------|---------------|---------|");
  for (const [fam, items] of fams) {
    const devices = [...new Set(items.map((i) => i.device).filter(Boolean))].join(", ") || "-";
    const variants = [...new Set(items.map((i) => i.variant).filter(Boolean))];
    const vTxt = variants.length ? variants.slice(0, 6).join("; ") + (variants.length > 6 ? " …" : "") : "-";
    const impl = [...new Set(items.flatMap((i) => i.implFiles || []))];
    const cited = [...new Set(items.flatMap((i) => i.citedByFiles || []))];
    // Prefer the verified per-frame status; fall back to citation hint if still unknown.
    const statuses = [...new Set(items.map((i) => i.status))].filter((s) => s && s !== "unknown");
    let stat;
    if (statuses.length) stat = statuses.join("/");
    else if (impl.length) stat = "impl?";
    else if (cited.length) stat = `cited(${cited.length}f)`;
    else stat = "unknown";
    const ex = items[0];
    out.push(
      `| ${fam} | ${items.length} | ${devices} | ${vTxt} | ${stat} | [${ex.node || ex.id}](${link(ex)}) |`,
    );
  }
}

// Write via the stdout STREAM, not the "/dev/stdout" path: that path does not
// exist on Windows, so writeFileSync threw ENOENT C:\dev\stdout and this
// documented pipeline step could never run here. An explicit path arg still
// works: `node catalog-view.mjs out.md`.
const outPath = process.argv[2];
if (outPath) fs.writeFileSync(outPath, out.join("\n") + "\n");
else process.stdout.write(out.join("\n") + "\n");
