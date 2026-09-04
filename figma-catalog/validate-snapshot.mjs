#!/usr/bin/env node
/**
 * validate-snapshot.mjs — refuse a Figma harvest that cannot prove it is complete.
 *
 * ── Why this exists ──────────────────────────────────────────────────────────
 * figma-drift.mjs turns a snapshot into a TODO log, and its most valuable output
 * is the REMOVED node: if a deleted frame carried implFiles, code in this repo
 * implements a design the designer has since dropped, and somebody has to decide
 * whether that code goes too.
 *
 * That makes a SHORT HARVEST the most dangerous input the pipeline can receive.
 * A lane that captures 30 of 50 children reports 20 deletions that never
 * happened, each one an invitation to delete working code.
 *
 * It has happened. The Figma metadata tree, which is the cheap way to harvest a
 * page, does not descend into every frame: it returned 1,914 nodes for a towers
 * page holding 2,011, 2,245 for a rock-paper-scissors page holding 2,757, and
 * 46 for a cover-images page holding 214. A lane that counts what came back has
 * counted the instrument, not the page. Nothing in the snapshot distinguishes
 * the two — a count cannot certify itself, because the count is the thing in
 * doubt.
 *
 * ── What a snapshot must now carry ───────────────────────────────────────────
 *   { "<section>": {
 *       "pageId":         "9061:15449",
 *       "pageName":       "Towers - Skai originals",
 *       "liveChildCount": 50,          // read from Figma SEPARATELY from `nodes`
 *       "nodes":          [ ["9061-15450","Directory"], ... ]   // 50 of them
 *   } }
 *
 * `liveChildCount` must come from a DIFFERENT read than the one that built
 * `nodes` — the page's own child count, not `nodes.length` copied across. The
 * whole point is that two independent reads have to agree. A harvester that
 * derives one from the other satisfies the letter of this check and none of its
 * purpose, so the two are also required to be plausible against the registry.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   node figma-catalog/validate-snapshot.mjs <snapshot.json> [more.json ...]
 *
 * Exit 0  — every section is internally consistent and safe to hand to
 *           figma-drift.mjs.
 * Exit 1  — at least one section cannot prove completeness. The report names it.
 *
 * Exit 1 is deliberate and is the opposite of figma-drift.mjs's contract: drift
 * is information and exits 0, but an unverifiable harvest is a FAILURE, because
 * everything downstream of it is unsound.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node validate-snapshot.mjs <snapshot.json> [more.json ...]");
  process.exit(1);
}

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

/** Registry counts per section, used only as a plausibility prior. */
function registryCounts() {
  const p = path.join(DIR, "registry.json");
  if (!fs.existsSync(p)) return null;
  const frames = JSON.parse(fs.readFileSync(p, "utf8")).frames || {};
  const out = {};
  for (const k of Object.keys(frames)) {
    const s = frames[k].section || "(none)";
    out[s] = (out[s] || 0) + 1;
  }
  return out;
}

/**
 * Node-ids the catalog already records as deleted upstream.
 *
 * `bugref-aliases.tsv` is where a deletion is written down once somebody has
 * read the id back against Figma and found nothing; `build-registry.mjs` reads
 * the same rows to set `gone` on a registry row, and `figma-drift.mjs` drops
 * those rows before it diffs. The depth check below has to drop them too, or it
 * measures a harvest against ids the pipeline it guards has already retired —
 * and a section retires enough of them to fail on arithmetic alone.
 */
function retiredIds() {
  const out = new Set();
  const p = path.join(DIR, "bugref-aliases.tsv");
  if (!fs.existsSync(p)) return out;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const [ref, , reason] = line.split("\t");
    if (reason === "gone") out.add(ref.includes(":") ? ref.split(":").pop().trim() : ref.trim());
  }
  return out;
}

/**
 * Registry node ids per section, for the depth check below, minus the ones
 * recorded as deleted upstream. `excluded` carries the count so the report can
 * say how much of a section was set aside rather than dropping it silently.
 */
function registryIds() {
  const p = path.join(DIR, "registry.json");
  if (!fs.existsSync(p)) return null;
  const frames = JSON.parse(fs.readFileSync(p, "utf8")).frames || {};
  const retired = retiredIds();
  const out = {};
  for (const [key, f] of Object.entries(frames)) {
    const s = f.section || "(none)";
    // Registry keys are hyphen-form for one file and fileKey-prefixed for
    // another; the node field is authoritative. Normalise to hyphen form,
    // which is what a snapshot's node list uses.
    const id = String(f.node || key).split(":").slice(-2).join("-").replace(":", "-");
    const bucket = (out[s] ||= { ids: new Set(), excluded: 0 });
    if (f.gone || retired.has(id)) bucket.excluded++;
    else bucket.ids.add(id);
  }
  return out;
}

const prior = registryCounts();
const priorIds = registryIds();
const overlaps = [];
const problems = [];
const ok = [];
let sections = 0;

for (const file of args) {
  if (!fs.existsSync(file)) {
    problems.push({ file, section: "-", why: "file does not exist" });
    continue;
  }
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    problems.push({ file, section: "-", why: `not parseable JSON: ${e.message}` });
    continue;
  }

  for (const [section, v] of Object.entries(doc)) {
    sections++;
    const where = `${path.basename(file)} :: ${section}`;
    const nodes = Array.isArray(v?.nodes) ? v.nodes : null;

    if (!nodes) {
      problems.push({ file, section, why: "no `nodes` array" });
      continue;
    }
    if (!v.pageId || !/^\d+[:-]\d+$/.test(String(v.pageId))) {
      problems.push({ file, section, why: `pageId missing or malformed: ${JSON.stringify(v.pageId)}` });
      continue;
    }

    // The completeness claim. Absent, this snapshot cannot be trusted at all.
    if (typeof v.liveChildCount !== "number") {
      problems.push({
        file,
        section,
        why:
          "no `liveChildCount` — the harvester did not record an independent " +
          "read of the page's child count, so a short capture is indistinguishable " +
          "from a deletion",
      });
      continue;
    }

    if (nodes.length !== v.liveChildCount) {
      problems.push({
        file,
        section,
        why:
          `SHORT HARVEST: captured ${nodes.length} of ${v.liveChildCount} live children. ` +
          `Reporting this would claim ${v.liveChildCount - nodes.length} false deletions.`,
      });
      continue;
    }

    // Shape of each entry: ["1234-5678", "Name"]. A colon here is the pageId's
    // format leaking into the node list, which figma-drift.mjs will not match.
    const badShape = nodes.filter(
      (n) => !Array.isArray(n) || n.length < 2 || typeof n[0] !== "string" || !/^\d+-\d+$/.test(n[0]),
    );
    if (badShape.length) {
      problems.push({
        file,
        section,
        why: `${badShape.length} node entries are malformed (want ["1234-5678","Name"], hyphen not colon). First: ${JSON.stringify(badShape[0])}`,
      });
      continue;
    }

    const dupes = nodes.length - new Set(nodes.map((n) => n[0])).size;
    if (dupes) {
      problems.push({ file, section, why: `${dupes} duplicate node ids` });
      continue;
    }

    // ── Depth check ──────────────────────────────────────────────────────────
    // A harvest can be internally consistent and still enumerate the wrong
    // THING. A page's children and its full subtree are both complete lists,
    // and nothing inside a snapshot says which one was taken; where a page
    // nests, the shallower list leaves catalogued ids unmentioned and drift
    // reads every one as a deletion. Trade 2 is the live example — 407 of its
    // 495 catalogued ids are page children and 83 sit as deep as level 15, so
    // a children-only harvest of it claims 83 deletions that did not happen.
    //
    // Overlap is what separates the two cases. Genuine drift over weeks retires
    // some ids and adds others, but it does not fail to mention three quarters
    // of what the registry already holds. That is a depth mismatch, and it is
    // not a judgement call — it is arithmetic, so it fails rather than warns.
    //
    // The ids measured are the ones drift will actually diff, so anything the
    // catalog records as deleted upstream is out of the denominator. A deletion
    // nobody has written down yet still counts against the harvest, which is
    // what keeps this check from being answered by an assertion.
    const was = prior?.[section];
    const known = priorIds?.[section]?.ids;
    const retired = priorIds?.[section]?.excluded || 0;
    if (known && known.size) {
      const seen = nodes.filter((n) => known.has(String(n[0]).replace(":", "-"))).length;
      const overlap = seen / known.size;
      if (overlap < 0.5) {
        problems.push({
          file,
          section,
          why:
            `DEPTH MISMATCH: only ${seen} of ${known.size} registry ids (${(overlap * 100).toFixed(0)}%) ` +
            `appear in this capture. Drift retires ids; it does not omit most of them. ` +
            `This reads as page-children captured against a full-subtree registry — ` +
            `reporting it would claim ${known.size - seen} false deletions.`,
        });
        continue;
      }
      overlaps.push({ section, seen, of: known.size, retired });
    }

    // Plausibility against the registry COUNT. Not a failure — the whole point
    // of a harvest is that reality may have moved — but a swing this large is
    // worth a human reading before drift acts on it.
    const note =
      was == null
        ? "no registry prior"
        : Math.abs(nodes.length - was) > Math.max(10, was * 0.25)
          ? `LARGE SWING vs registry: ${was} -> ${nodes.length}`
          : `vs registry ${was}`;
    ok.push({ section, n: nodes.length, note });
  }
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`validate-snapshot: ${sections} section(s) across ${args.length} file(s).`);
console.log();

if (ok.length) {
  console.log("  verified complete:");
  for (const o of ok.sort((a, b) => b.n - a.n)) {
    console.log(`    ${pad(o.section, 24)} ${String(o.n).padStart(4)} nodes   ${o.note}`);
  }
  console.log();
}

if (overlaps.length) {
  console.log("  registry ids found in each capture:");
  for (const o of overlaps.sort((a, b) => b.of - a.of)) {
    const pct = ((o.seen / o.of) * 100).toFixed(0);
    const retired = o.retired ? `   (${o.retired} more recorded deleted upstream)` : "";
    console.log(`    ${pad(o.section, 24)} ${String(o.seen).padStart(4)} of ${String(o.of).padEnd(4)} ${pct.padStart(3)}%${retired}`);
  }
  console.log();
}

if (problems.length) {
  console.log(`  ${problems.length} section(s) CANNOT be trusted:`);
  for (const p of problems) {
    console.log(`    ${pad(p.section, 24)} ${p.why}`);
  }
  console.log();
  console.log("  Not safe for figma-drift.mjs. A short or malformed harvest reports");
  console.log("  deletions that did not happen, and a deleted row carrying implFiles");
  console.log("  reads as code implementing a dropped design.");
  process.exit(1);
}

console.log("  every section proved complete. Safe to run:");
console.log(`    node figma-catalog/figma-drift.mjs <merged-snapshot.json>`);
process.exit(0);
