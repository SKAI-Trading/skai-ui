/**
 * Wave-6 per-lane applied-ness check.
 *
 * WHY THIS EXISTS — four separate times a lane's finished work has applied to
 * ZERO frames. The catalog's own reports give totals, and a total cannot tell
 * you WHICH lane vanished. This names the lane.
 *
 * For each status.wave6.<lane>.tsv it reports:
 *   rows          data rows (comments and blanks excluded)
 *   idKeyed       rows addressable per WAVE5-BRIEF section 9 (bracketed id, or bare id)
 *   inRegistry    id-keyed rows whose node the registry actually carries
 *   inWorklist    id-keyed rows that are on THAT lane's own work list
 *   applied       frames whose registry status now equals the row's status
 *   done          rows claiming done (each needs an oracle test per WAVE6 section 2)
 *   citedTests    test paths named in the reason column
 *
 * `applied` is the number that matters. A lane with rows > 0 and applied == 0
 * is the failure this file was written to catch.
 *
 * Usage (from modules/skai-ui):  node figma-catalog/wave6-verify.mjs
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("figma-catalog");
const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
const regKeys = Object.keys(reg.frames);
const byBare = new Map();
for (const k of regKeys) byBare.set(k.includes(":") ? k.split(":")[1] : k, reg.frames[k]);

// Lane work lists -> the ids each lane owes.
const WL = path.join(DIR, "wave6-worklists");
const worklist = {};
for (const f of fs.readdirSync(WL)) {
  const lane = f.replace(/\.tsv$/, "");
  worklist[lane] = new Set(
    fs
      .readFileSync(path.join(WL, f), "utf8")
      .split(/\r?\n/)
      .slice(1)
      .filter((l) => l.trim())
      .map((l) => l.split("\t")[0].trim().replace(":", "-")),
  );
}
// d1/d2 and c1/c2 split one work list between two lanes.
function worklistFor(lane) {
  if (worklist[lane]) return worklist[lane];
  const base = lane.replace(/(-[a-z])?\d$/, (mm) => mm.replace(/\d$/, ""));
  return worklist[base] || worklist[lane.replace(/\d$/, "")] || null;
}

const TEST_RE = /((?:src|modules)\/[\w./-]*?\.(?:test|spec)\.tsx?)/g;
const VALID = new Set([
  "done",
  "partial",
  "not-started",
  "blocked-on-backend",
  "frame-defect",
  "furniture",
  "unknown",
]);
const BP_VALID = new Set([
  "unknown",
  "missing",
  "renders",
  "done",
  "partial",
  "broken",
  "not-started",
  "n-a",
]);

const rowsOut = [];
const files = fs.readdirSync(DIR).filter((f) => /^status\.wave6\..*\.tsv$/.test(f)).sort();
for (const f of files) {
  const lane = f.replace(/^status\.wave6\./, "").replace(/\.tsv$/, "");
  const raw = fs.readFileSync(path.join(DIR, f), "utf8").split(/\r?\n/);
  const rec = {
    lane,
    file: f,
    rows: 0,
    idKeyed: 0,
    inRegistry: 0,
    inWorklist: 0,
    applied: 0,
    notApplied: [],
    statuses: {},
    badStatus: [],
    badBp: [],
    done: 0,
    citedTests: new Set(),
    offWorklist: [],
  };
  const wl = worklistFor(lane);
  raw.forEach((line, i) => {
    if (!line.trim() || line.startsWith("#")) return;
    rec.rows++;
    const c = line.split("\t");
    const key = (c[0] || "").trim();
    const status = (c[1] || "").trim();
    const reason = c[4] || "";
    const bp = (c[5] || "").trim();

    rec.statuses[status] = (rec.statuses[status] || 0) + 1;
    if (!VALID.has(status)) rec.badStatus.push(`${f}:${i + 1} "${status}"`);
    if (status === "done") rec.done++;

    for (const m of reason.matchAll(TEST_RE)) rec.citedTests.add(m[1]);

    if (bp) {
      for (const cell of bp.split(/\s+/)) {
        if (cell.startsWith("@")) continue;
        const [, v] = cell.split("=");
        if (v && !BP_VALID.has(v)) rec.badBp.push(`${f}:${i + 1} "${cell}"`);
      }
    }

    const br = key.match(/\[(\d+[-:]\d+)\]\s*$/);
    const bare = key.match(/^(\d+[-:]\d+)$/);
    const id = (br?.[1] || bare?.[1] || "").replace(":", "-");
    if (!id) return;
    rec.idKeyed++;
    const frame = byBare.get(id);
    if (!frame) return;
    rec.inRegistry++;
    if (wl?.has(id)) rec.inWorklist++;
    else rec.offWorklist.push(id);
    if (frame.status === status) rec.applied++;
    else rec.notApplied.push(`${id} row=${status} registry=${frame.status}`);
  });
  rec.citedTests = [...rec.citedTests];
  rowsOut.push(rec);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(
  `${pad("lane", 20)}${pad("rows", 6)}${pad("idKey", 7)}${pad("inReg", 7)}${pad("inWL", 6)}${pad("APPLIED", 9)}${pad("done", 6)}statuses`,
);
console.log("-".repeat(110));
let tRows = 0,
  tApplied = 0,
  tDone = 0;
for (const r of rowsOut) {
  tRows += r.rows;
  tApplied += r.applied;
  tDone += r.done;
  const flag = r.rows > 0 && r.applied === 0 ? "  <== APPLIED TO NOTHING" : "";
  console.log(
    `${pad(r.lane, 20)}${pad(r.rows, 6)}${pad(r.idKeyed, 7)}${pad(r.inRegistry, 7)}${pad(r.inWorklist, 6)}${pad(r.applied, 9)}${pad(r.done, 6)}${JSON.stringify(r.statuses)}${flag}`,
  );
}
console.log("-".repeat(110));
console.log(`TOTAL rows=${tRows} applied=${tApplied} done=${tDone} across ${files.length} lane file(s)`);
console.log(`Denominator: 123 frames across 17 work lists.`);

const badStatus = rowsOut.flatMap((r) => r.badStatus);
const badBp = rowsOut.flatMap((r) => r.badBp);
if (badStatus.length) console.log(`\nINVALID column-2 status (${badStatus.length}):\n  ` + badStatus.join("\n  "));
if (badBp.length)
  console.log(
    `\nINVALID column-6 bp verdict (${badBp.length}) — THIS ABORTS apply-status.mjs GLOBALLY:\n  ` +
      badBp.join("\n  "),
  );
const off = rowsOut.filter((r) => r.offWorklist.length);
if (off.length)
  console.log(
    `\nRows keyed to a frame NOT on that lane's work list:\n  ` +
      off.map((r) => `${r.lane}: ${r.offWorklist.join(", ")}`).join("\n  "),
  );

console.log(`\nOracle tests cited in reason columns:`);
for (const r of rowsOut) {
  if (!r.citedTests.length) continue;
  console.log(`  ${r.lane}:`);
  for (const t of r.citedTests) {
    const abs = path.resolve("../..", t);
    console.log(`    ${fs.existsSync(abs) ? "EXISTS " : "MISSING"} ${t}`);
  }
}
const noTest = rowsOut.filter((r) => r.done > 0 && !r.citedTests.length);
if (noTest.length)
  console.log(
    `\n!! Lanes claiming done with NO test cited (WAVE6 section 2 forbids): ` +
      noTest.map((r) => `${r.lane}(${r.done})`).join(", "),
  );
