/**
 * How much of the catalog's `not-started` backlog is fictional?
 *
 * WHY — `registry.json`'s `not-started` is derived from
 * `code-node-citations.json`, whose `generated` field is 2026-07-21. Anything
 * built after that date is structurally invisible to it, so a frame can read
 * `not-started` while its component has shipped and cites the node id in its
 * first comment line. This measures the size of that lie across the wave-6
 * work lists.
 *
 * METHOD, and its limits, stated so the number can be argued with:
 *   - Reads every source file under the code roots ONCE and indexes which of
 *     the target node ids appear in it, in both `1234-5678` and `1234:5678`
 *     forms.
 *   - The catalog directory itself is EXCLUDED. Catalog files cite node ids by
 *     definition; counting them would make every frame look implemented.
 *   - Test files are counted separately from product files, because a node id
 *     that appears only in a test is evidence of a test, not of a mount.
 *   - This is a LOWER BOUND on "already implemented". It only catches frames
 *     whose id was written into the source as a comment. A component built
 *     without citing its node id is invisible here and counts as not-started.
 *
 * Usage (from modules/skai-ui):  node figma-catalog/worklist-impl-audit.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";

const REPO = path.resolve("../..");
const DIR = path.resolve("figma-catalog");
const asJson = process.argv.includes("--json");

const ROOTS = [
  "src",
  "modules/skai-gaming/src",
  "modules/skai-ui/src",
  "modules/skai-wallet/src",
  "modules/skai-command/src",
].map((r) => path.join(REPO, r));

const SKIP = /node_modules|[/\\]dist[/\\]|[/\\]\.git[/\\]|figma-catalog/;
const EXT = /\.(tsx?|jsx?|css)$/;

function walk(dir, out = []) {
  let e;
  try {
    e = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const d of e) {
    const p = path.join(dir, d.name);
    if (SKIP.test(p)) continue;
    if (d.isDirectory()) walk(p, out);
    else if (EXT.test(d.name)) out.push(p);
  }
  return out;
}

// Targets: every id on every wave-6 work list.
const WL = path.join(DIR, "wave6-worklists");
const targets = new Map(); // id -> {lane, title, device}
for (const f of fs.readdirSync(WL)) {
  const lane = f.replace(/\.tsv$/, "");
  for (const line of fs
    .readFileSync(path.join(WL, f), "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter((l) => l.trim())) {
    const c = line.split("\t");
    targets.set(c[0].trim().replace(":", "-"), {
      lane,
      device: c[1],
      title: (c[2] || "").trim(),
    });
  }
}

const files = [];
for (const r of ROOTS) walk(r, files);

const hits = new Map(); // id -> {product:[], test:[]}
for (const id of targets.keys()) hits.set(id, { product: [], test: [] });

const dash = [...targets.keys()];
const colon = dash.map((d) => d.replace("-", ":"));

for (const file of files) {
  let src;
  try {
    src = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const rel = path.relative(REPO, file).replace(/\\/g, "/");
  const isTest = /\.(test|spec)\.[tj]sx?$/.test(rel);
  for (let i = 0; i < dash.length; i++) {
    if (src.includes(dash[i]) || src.includes(colon[i])) {
      hits.get(dash[i])[isTest ? "test" : "product"].push(rel);
    }
  }
}

const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
const byBare = new Map();
for (const k of Object.keys(reg.frames))
  byBare.set(k.includes(":") ? k.split(":")[1] : k, reg.frames[k]);

const rows = [];
for (const [id, meta] of targets) {
  const h = hits.get(id);
  const frame = byBare.get(id);
  rows.push({
    id,
    lane: meta.lane,
    device: meta.device,
    title: meta.title.slice(0, 60),
    registryStatus: frame?.status ?? "ABSENT",
    registryImplFiles: (frame?.implFiles || []).length,
    productCitations: h.product.length,
    testCitations: h.test.length,
    productFiles: h.product,
    testFiles: h.test,
  });
}

const cited = rows.filter((r) => r.productCitations > 0);
const testOnly = rows.filter((r) => r.productCitations === 0 && r.testCitations > 0);
const none = rows.filter((r) => r.productCitations === 0 && r.testCitations === 0);
const contradiction = rows.filter(
  (r) => r.registryStatus === "not-started" && r.productCitations > 0,
);
const implFilesButNotStarted = rows.filter(
  (r) => r.registryStatus === "not-started" && r.registryImplFiles > 0,
);

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(`code roots scanned: ${ROOTS.length}; source files read: ${files.length}`);
  console.log(`worklist frames (denominator): ${rows.length}`);
  console.log(
    `code-node-citations.json generated: ${JSON.parse(fs.readFileSync(path.join(DIR, "code-node-citations.json"), "utf8")).generated ?? "?"}`,
  );
  console.log("");
  console.log(`cited by node id in PRODUCT source : ${cited.length}  (${((cited.length / rows.length) * 100).toFixed(1)}%)`);
  console.log(`cited only in a TEST file          : ${testOnly.length}`);
  console.log(`no citation anywhere               : ${none.length}`);
  console.log("");
  console.log(
    `!! registry says not-started BUT product source cites the id: ${contradiction.length}`,
  );
  console.log(
    `   registry says not-started BUT registry's own implFiles is non-empty: ${implFilesButNotStarted.length}`,
  );
  console.log("");
  const byLane = {};
  for (const r of rows) {
    byLane[r.lane] ??= { n: 0, cited: 0 };
    byLane[r.lane].n++;
    if (r.productCitations > 0) byLane[r.lane].cited++;
  }
  console.log("per lane — frames / already cited in product source:");
  for (const [k, v] of Object.entries(byLane))
    console.log(`  ${k.padEnd(20)} ${String(v.cited).padStart(2)} / ${String(v.n).padStart(2)}`);
  console.log("\nframes the registry calls not-started that product code already cites:");
  for (const r of contradiction)
    console.log(`  ${r.id.padEnd(15)} ${r.lane.padEnd(18)} ${r.productFiles.slice(0, 3).join(", ")}`);
  console.log(
    "\nNOTE: this is a LOWER BOUND. It only sees frames whose node id was written into the source.",
  );
}
