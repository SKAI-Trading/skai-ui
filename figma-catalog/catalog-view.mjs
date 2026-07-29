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
const SECTIONS = ["home", "wallet", "trade", "predict", "play", "dice", "pwa", "crash"];

const out = [];
out.push("# Figma Frame Catalog — SKAI redesign\n");
out.push(
  `_Generated ${reg.generated} from \`figma-catalog/registry.json\`. Files: ${Object.entries(FILE_KEYS)
    .map(([k, n]) => `${n} \`${k}\``)
    .join(", ")}._\n`,
);
out.push(`Rebuild: \`node figma-catalog/build-registry.mjs && node figma-catalog/catalog-view.mjs > figma-frame-catalog.md\`\n`);

// overall tally
out.push("## Coverage\n");
out.push("| Section | Frames | Titled | Screens | Scaffolding | Families | Code-cited |");
out.push("|---------|-------:|-------:|--------:|------------:|---------:|-----------:|");
for (const s of SECTIONS) {
  const st = reg.stats.bySection[s];
  const fams = new Set(
    Object.values(reg.frames).filter((f) => f.section === s && f.kind === "screen").map((f) => f.family),
  );
  out.push(
    `| ${s} | ${st.frames} | ${st.titled} | ${st.screens ?? "?"} | ${st.nonScreen ?? "?"} | ${fams.size} | ${st.cited} |`,
  );
}
out.push("");

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
