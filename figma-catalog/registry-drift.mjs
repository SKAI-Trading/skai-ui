#!/usr/bin/env node
/**
 * registry-drift.mjs — measure how far `registry.json` has drifted from the LIVE
 * harvest, IN BOTH DIRECTIONS, over a denominator stated on every line.
 *
 * WHY THIS EXISTS
 * ---------------
 * Wave 9 opened with `validate-wave7.mjs` exiting 1 on three rows whose node ids
 * "are in NO registry frame". Two explanations were live and they have OPPOSITE
 * fixes:
 *
 *     the rows are mis-keyed        -> edit the TSV
 *     the registry is under-indexed -> edit nothing, fix the registry
 *
 * A per-instance patch under the first theory DELETES measured rows. It is the
 * second: 148 rows across six waves already name these frames. WAVE7-INTEGRITY
 * §10 records the same trap one wave earlier — four ids were patched into
 * `.nodes.txt` by hand and the real class was 52. Measure the SIZE first.
 *
 * ★ AND THE RAW DIFF IS NOT THE CLASS. Diffing every live id against every
 * registry node id gives ~1,477 of 5,041 and means nothing: it counts
 * out-of-scope pages, hidden nodes, loose RECTANGLEs and Screenshot furniture,
 * none of which is in the parity denominator. Both directions below are filtered
 * to the SAME in-scope-genuine population `coverage.mjs` counts.
 *
 * ★★★ THE CHECK THAT MAKES THE NUMBERS TRUSTWORTHY, AND IT RUNS FIRST.
 * Reaching the in-scope-genuine set needs `coverage.mjs`'s furniture rule, and
 * coverage.mjs exports nothing, so the rule is necessarily restated here.
 * Restating a rule is a coin flip: WAVE7-INTEGRITY §10 records a lane doing
 * exactly this and landing 402 frames — 21% of the denominator — off, on one
 * operator (`visible !== "0"` written as `vis !== "1"`, flipping every absent
 * column from visible to hidden).
 *
 * So the restatement is never trusted alone. This script SPAWNS
 * `coverage.mjs --histogram` and REFUSES to report unless its own live /
 * furniture / genuine counts reproduce coverage's published ones exactly. The
 * expected values are read from that run, never hardcoded — a checker that
 * hardcodes a fact about the thing it checks goes stale the moment the fact
 * moves, and is confident either way.
 *
 * Usage:
 *   node figma-catalog/registry-drift.mjs             # the two directions
 *   node figma-catalog/registry-drift.mjs --verbose   # every drifted id listed
 *   node figma-catalog/registry-drift.mjs --self-test # prove it is not vacuous
 *
 * Writes nothing, ever. Exit 0 = no in-scope drift in either direction.
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const LIVE = path.join(DIR, "live");

// ── coverage.mjs's rule, restated because that file exports nothing ──────────
// Mirrors coverage.mjs:195-217, and re-verified against its output every run.
const SPEC_TYPES = new Set(["FRAME", "COMPONENT", "COMPONENT_SET", "SECTION", "GROUP"]);
const FURNITURE_NAME = [
  /^Directory\b/i,
  /^Breakpoint\b/i,
  /^Scroll bar\b/i,
  /^Rectangle \d+$/i,
  /^Vector \d+$/i,
  /^Ellipse \d+$/i,
  /^Line \d+$/i,
  /^Screenshot\b/i,
  /^Screen Shot\b/i,
  /^Slice\b/i,
  /^Image \d+$/i,
  /^Notes$/i,
  /^Unrecommended/i,
];

const normId = (s) => String(s).trim().replace(":", "-");

/**
 * Parse ONE `live/*.tsv` row. Exported so the self-test drives the operator that
 * actually matters rather than a hand-built object.
 *
 * ⚠️ `visible !== "0"` — an ABSENT sixth column counts as VISIBLE. This single
 * operator is the 402-frame error in WAVE7-INTEGRITY §10. It lives HERE, in the
 * parse, not in `classify()` — which is why a fixture built from
 * `{visible: undefined}` tests nothing about it. One was, in this file's first
 * draft, and it went green while asserting the exact opposite of its own label.
 */
export function parseLiveRow(line) {
  const [id, name, type, w, h, visible] = line.split("\t");
  return { id: normId(id), name: name ?? "", type: type ?? "", w: +w || 0, h: +h || 0, visible: visible !== "0" };
}

/** `null` = GENUINE (in the parity denominator); a string = why it is furniture. */
export function classify(n) {
  if (!n.visible) return "hidden";
  if (FURNITURE_NAME.some((re) => re.test(n.name))) return "canvas-chrome";
  if (!SPEC_TYPES.has(n.type)) return `loose-${n.type.toLowerCase()}`;
  return null;
}

/**
 * Every node in the live harvest, keyed by hyphen-form id. Shared with any
 * caller that needs to tell "this row's node id is wrong" apart from "this frame
 * is real and the registry has not caught up" — opposite fixes, and one of them
 * is to edit nothing.
 *
 * ★ EXPORTED RATHER THAN COPIED. `bp-report.mjs` once kept its own copy of
 * STATUS_VALID and silently discarded 154 of 2,140 rows. One implementation.
 */
export function loadLiveNodes(dir = DIR) {
  const liveDir = path.join(dir, "live");
  const manifest = JSON.parse(fs.readFileSync(path.join(liveDir, "_pages.json"), "utf8"));
  const out = new Map();
  for (const p of manifest.pages) {
    const file = path.join(liveDir, `${p.fileKey}__${p.pageId.replace(":", "-")}.tsv`);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      if (!line.trim()) continue;
      const n = parseLiveRow(line);
      out.set(n.id, { ...n, page: p.pageName, scope: p.scope, furniture: classify(n) });
    }
  }
  return out;
}

/**
 * The whole measurement, pure, so the self-test can drive it with fixtures
 * instead of with the repository.
 *
 * @param pages  [{ pageName, scope, nodes: [{id,name,type,visible}] }]
 * @param frames [{ node, page, kind, status, title, fileKey }] — registry values
 */
export function measure(pages, frames) {
  let live = 0;
  let furniture = 0;
  const genuine = [];
  const liveAnywhere = new Set(); // every scope — direction B needs it
  const scopeOf = new Map();
  for (const p of pages) {
    scopeOf.set(p.pageName, p.scope);
    for (const n of p.nodes) liveAnywhere.add(normId(n.id));
    if (p.scope !== "in-scope") continue;
    live += p.nodes.length;
    for (const n of p.nodes) {
      if (classify(n) !== null) furniture++;
      else genuine.push({ ...n, id: normId(n.id), page: p.pageName });
    }
  }

  // Direction A — a frame `coverage.mjs` COUNTS that `registry.json` cannot
  // address. This is what makes validate-wave7 exit 1 on a correct row.
  //
  // ⚠️ RESOLUTION IS BY THE `.node` FIELD, NOT BY THE DICT KEY. Registry keys are
  // `<fileKey>:<node>`; the keys look like node ids and are a different set.
  // Diffing against `Object.keys(reg.frames)` reports every id as missing, which
  // is the tell that a comparison is broken rather than a finding. That mistake
  // was made twice during the investigation this file came out of.
  const regNodes = new Set(frames.map((f) => normId(f.node ?? "")));
  const unregistered = genuine.filter((n) => !regNodes.has(n.id));

  // Direction B — a registry frame naming a node that is no longer a top-level
  // child of any live page. `.nodes.txt` (the registry's input) and `live/*.tsv`
  // are BOTH top-level harvests, so this is like-for-like; the difference is the
  // date, not the depth.
  const ghosts = frames
    .map((f) => ({ ...f, node: normId(f.node ?? ""), scope: scopeOf.get(f.page) ?? "(page not in manifest)" }))
    .filter((f) => !liveAnywhere.has(f.node));

  return { live, furniture, genuine, unregistered, ghosts, liveAnywhere, regNodes };
}

// Everything below runs only when this file is the entry point. Without the
// guard, importing `parseLiveRow` would spawn coverage.mjs and print a report.
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

// ── self-test ───────────────────────────────────────────────────────────────
// Fixtures are held in memory. Nothing is written to the catalog directory — a
// stray file here is picked up by whatever apply-status.mjs run comes next.
if (IS_MAIN && process.argv.includes("--self-test")) {
  const N = (id, name, type = "FRAME", visible = true) => ({ id, name, type, visible });
  let caught = 0;
  const cases = [];
  const check = (label, cond, detail = "") => {
    cases.push(label);
    if (cond) caught++;
    console.log(`  ${cond ? "CAUGHT " : "MISSED "} ${label}${cond ? "" : `\n      ${detail}`}`);
  };

  {
    const r = measure(
      [{ pageName: "P", scope: "in-scope", nodes: [N("1-1", "Desktop"), N("1-2", "Mobile")] }],
      [{ node: "1-1", page: "P", kind: "screen", status: "partial" }],
    );
    check(
      "direction A: a live genuine frame absent from registry",
      r.unregistered.length === 1 && r.unregistered[0].id === "1-2",
      `got ${JSON.stringify(r.unregistered.map((x) => x.id))}`,
    );
  }
  {
    const r = measure(
      [{ pageName: "P", scope: "in-scope", nodes: [N("1-1", "Desktop")] }],
      [
        { node: "1-1", page: "P", kind: "screen", status: "partial" },
        { node: "9-9", page: "P", kind: "screen", status: "partial" },
      ],
    );
    check(
      "direction B: a registry frame no longer in the live harvest",
      r.ghosts.length === 1 && r.ghosts[0].node === "9-9",
      `got ${JSON.stringify(r.ghosts.map((x) => x.node))}`,
    );
  }
  {
    // ★ Registry keys are HYPHEN form; live/*.tsv ids are COLON form. Comparing
    // them unnormalised reports "5041 of 5041 missing" — a broken comparison,
    // not a finding.
    const r = measure(
      [{ pageName: "P", scope: "in-scope", nodes: [N("1:1", "Desktop")] }],
      [{ node: "1-1", page: "P", kind: "screen", status: "partial" }],
    );
    check(
      "colon-form live id matches hyphen-form registry node (normalisation)",
      r.unregistered.length === 0 && r.ghosts.length === 0,
      `unregistered=${JSON.stringify(r.unregistered.map((x) => x.id))} ghosts=${JSON.stringify(r.ghosts.map((x) => x.node))}`,
    );
  }
  {
    /*
      ★ THE OPERATOR THAT COST 402 FRAMES — and the fixture that first tested the
      wrong thing. A 5-column live row (no `visible` field) must parse VISIBLE so
      the node stays in the denominator.

      ⚠️ The first draft built `{visible: undefined}` by hand and passed it to
      `measure()`. That never reaches the parse: `classify()` reads `!n.visible`,
      so `undefined` is HIDDEN, and the fixture asserted `furniture === 1` under
      a label saying "counts as VISIBLE". A fixture that reaches a different code
      path from the one it names is a vacuous green wearing a label.
    */
    const fiveCol = parseLiveRow("1:1\tDesktop\tFRAME\t954\t621");
    const hidden = parseLiveRow("1:2\tDesktop\tFRAME\t954\t621\t0");
    const r = measure([{ pageName: "P", scope: "in-scope", nodes: [fiveCol, hidden] }], []);
    check(
      "a 5-column live row (no `visible` field) parses VISIBLE and stays in the denominator",
      fiveCol.visible === true && hidden.visible === false && r.genuine.length === 1 && r.genuine[0].id === "1-1",
      `fiveCol.visible=${fiveCol.visible} hidden.visible=${hidden.visible} genuine=${JSON.stringify(r.genuine.map((x) => x.id))}`,
    );
  }
  {
    const r = measure([{ pageName: "T", scope: "tombstone", nodes: [N("5-5", "Desktop")] }], []);
    check(
      "an out-of-scope page contributes no genuine frames",
      r.genuine.length === 0 && r.live === 0,
      `genuine=${r.genuine.length} live=${r.live}`,
    );
  }
  {
    // ...but an out-of-scope page's ids must still suppress a false ghost: a
    // frame parked on a tombstone page is not deleted from Figma.
    const r = measure(
      [{ pageName: "T", scope: "tombstone", nodes: [N("5-5", "Desktop")] }],
      [{ node: "5-5", page: "T", kind: "screen", status: "partial" }],
    );
    check(
      "a live id on an OUT-OF-SCOPE page is not reported as a ghost",
      r.ghosts.length === 0,
      `got ${JSON.stringify(r.ghosts.map((x) => x.node))}`,
    );
  }
  {
    const r = measure(
      [{ pageName: "P", scope: "in-scope", nodes: [N("1-1", "Screenshot 2026-08-2", "RECTANGLE"), N("1-2", "Breakpoint")] }],
      [],
    );
    check(
      "furniture (loose RECTANGLE + canvas-chrome FRAME) is excluded from direction A",
      r.unregistered.length === 0 && r.furniture === 2,
      `unregistered=${JSON.stringify(r.unregistered.map((x) => x.id))} furniture=${r.furniture}`,
    );
  }
  // ── CONTROL — must NOT fire. A suite that only asserts "the detector fires"
  //    can pass by flagging everything.
  {
    const r = measure(
      [{ pageName: "P", scope: "in-scope", nodes: [N("1-1", "Desktop"), N("1-2", "Mobile")] }],
      [
        { node: "1-1", page: "P", kind: "screen", status: "done" },
        { node: "1-2", page: "P", kind: "screen", status: "done" },
      ],
    );
    const clean = r.unregistered.length === 0 && r.ghosts.length === 0 && r.genuine.length === 2;
    cases.push("control");
    if (clean) caught++;
    console.log(`  ${clean ? "CLEAN  " : "FALSE+ "} control: a registry in step with the harvest reports zero drift`);
  }
  console.log(`\nself-test: ${caught}/${cases.length} passed.`);
  process.exit(caught === cases.length ? 0 : 1);
}

// Importers stop here: `loadLiveNodes` / `measure` / `parseLiveRow` / `classify`
// are all they need, and running the report as an import side effect would spawn
// coverage.mjs on every call.
if (IS_MAIN) {
  const manifest = JSON.parse(fs.readFileSync(path.join(LIVE, "_pages.json"), "utf8"));
  const pages = [];
  for (const p of manifest.pages) {
    const file = path.join(LIVE, `${p.fileKey}__${p.pageId.replace(":", "-")}.tsv`);
    const nodes = fs.existsSync(file)
      ? fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim()).map(parseLiveRow)
      : [];
    pages.push({ ...p, nodes });
  }
  const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
  const frames = Object.values(reg.frames);
  const r = measure(pages, frames);

  // ── SELF-CHECK against coverage.mjs's PUBLISHED totals, before anything else ──
  let expected = null;
  try {
    const out = execFileSync(process.execPath, [path.join(DIR, "coverage.mjs"), "--histogram"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
    expected = JSON.parse(out).rollup;
  } catch (e) {
    console.error("registry-drift: REFUSING TO REPORT — could not run coverage.mjs --histogram to check my own rule against.");
    console.error(`  ${e.message.split("\n")[0]}`);
    process.exit(2);
  }
  const mismatches = [
    ["live", r.live, expected.live],
    ["furniture", r.furniture, expected.furniture],
    ["genuine", r.genuine.length, expected.genuine],
  ].filter(([, got, want]) => got !== want);
  if (mismatches.length) {
    console.error("registry-drift: REFUSING TO REPORT — my restatement of coverage.mjs's furniture rule does NOT reproduce its published totals.");
    for (const [k, got, want] of mismatches) console.error(`  ${k}: I get ${got}, coverage.mjs publishes ${want}`);
    console.error("  Every number below rests on that rule. Fix the rule; do not read past this.");
    process.exit(2);
  }
  console.log(
    `self-check: my furniture rule reproduces coverage.mjs exactly — live ${r.live}, furniture ${r.furniture}, genuine ${r.genuine.length}.`,
  );
  console.log(`registry generated ${reg.generated}, pagesHarvested ${reg.pagesHarvested}; live harvest ${manifest.harvestedAt}.`);

  const VERBOSE = process.argv.includes("--verbose");
  const group = (list, keyFn) => {
    const m = new Map();
    for (const x of list) {
      const k = keyFn(x);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(x);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  };

  const gen = r.genuine.length;
  console.log(
    `\nA. LIVE BUT UNREGISTERED — in-scope genuine frames with no registry frame carrying their node id` +
      `\n   ${r.unregistered.length} of ${gen} (${((r.unregistered.length / gen) * 100).toFixed(2)}%)`,
  );
  console.log(`   Effect on the parity denominator: ZERO. coverage.mjs counts these already (they are inside the ${gen}).`);
  console.log(`   Effect: validate-wave7.mjs exits 1 on any row measuring one, and apply-status.mjs cannot write its verdict.`);
  for (const [page, list] of group(r.unregistered, (n) => n.page))
    console.log(`      ${page.padEnd(36)} ${String(list.length).padStart(3)}`);
  if (VERBOSE) for (const n of r.unregistered) console.log(`         ${n.id}\t${n.w}x${n.h}\t${n.type}\t${n.name}`);

  // ★ WHY A SINGLE "everything after date D is missing" THEORY IS WRONG.
  // A node id is unique only WITHIN a Figma file, and the three tracked files
  // have independent counters — so a global cutoff is not even well defined.
  // Split per file, against that file's own registry maximum.
  const maj = (id) => +String(id).split(/[-:]/)[0];
  const regMaxByFile = {};
  for (const f of frames) {
    const m = maj(f.node);
    if (!(f.fileKey in regMaxByFile) || m > regMaxByFile[f.fileKey]) regMaxByFile[f.fileKey] = m;
  }
  const liveNodes = loadLiveNodes();
  console.log(`\n   Split by whether the id exceeds its OWN FILE's registry maximum:`);
  const byFile = {};
  for (const n of r.unregistered) {
    const fk = [...new Set(manifest.pages.filter((p) => p.pageName === n.page).map((p) => p.fileKey))][0];
    (byFile[fk] ??= []).push(n);
  }
  for (const [fk, list] of Object.entries(byFile)) {
    const above = list.filter((n) => maj(n.id) > (regMaxByFile[fk] ?? 0)).length;
    console.log(
      `      ${fk}  registry max id ${regMaxByFile[fk]}  ->  ${above} above it (a harvest cutoff explains those),` +
        ` ${list.length - above} BELOW it (it cannot).`,
    );
  }

  const inScopeGhosts = r.ghosts.filter((g) => g.scope === "in-scope");
  console.log(
    `\nB. REGISTERED BUT NOT LIVE — registry frames whose node is no longer a top-level child of any harvested page` +
      `\n   ${r.ghosts.length} of ${frames.length} registry frames; ${inScopeGhosts.length} sit on an in-scope page.`,
  );
  console.log(`   Effect on the parity denominator: ZERO. coverage.mjs derives its ${gen} from the LIVE harvest, so a`);
  console.log(`   node that is not live is in neither the numerator nor the denominator, whatever status it carries.`);
  console.log(`   Effect: registry.json misrepresents itself, and a work list built from it names frames that are gone.`);
  {
    const st = {};
    for (const g of inScopeGhosts) st[g.status] = (st[g.status] || 0) + 1;
    console.log(`   in-scope ghost statuses: ${Object.entries(st).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
    console.log(`   carrying a REAL verdict (not \`unknown\`): ${inScopeGhosts.filter((g) => g.status && g.status !== "unknown").length}`);
  }
  for (const [page, list] of group(inScopeGhosts, (g) => g.page)) {
    const st = {};
    for (const g of list) st[g.status] = (st[g.status] || 0) + 1;
    console.log(
      `      ${page.padEnd(36)} ${String(list.length).padStart(3)}  (${Object.entries(st).map(([k, v]) => `${k} ${v}`).join(", ")})`,
    );
  }
  if (VERBOSE) for (const g of inScopeGhosts) console.log(`         ${g.node}\t${g.kind}\t${g.status}\t${g.title}`);

  /*
    ⚠️ WHAT DIRECTION B DOES **NOT** ESTABLISH. A ghost WAS a top-level child on
    the day `.nodes.txt` was harvested and is not one today. Two histories fit:
        DELETED     gone from the Figma file
        RE-PARENTED still there, nested under a new top-level frame
    Only `getNodeByIdAsync` separates them. 13 have been probed that way (RPS,
    Hi-Lo, Towers, Plinko) and all 13 returned null. The rest are UNPROBED and
    this script must not be read as calling them deleted. Either way they are
    outside the parity denominator, which is why no decision waits on it.
  */
  console.log(
    `\n   ⚠️ "not live" means "not a TOP-LEVEL child today". Deleted and re-parented look identical from here;` +
      `\n      only getNodeByIdAsync separates them. 13 probed live, all 13 deleted. The rest are UNPROBED.`,
  );
  console.log(`   (live harvest holds ${liveNodes.size} nodes across all scopes, for reference.)`);

  console.log(
    `\nNEITHER DIRECTION MOVES THE PUBLISHED PERCENTAGE. parity = done/genuine = ${expected.done}/${expected.genuine}` +
      ` and built-at-all = (done+partial)/genuine both come from the live harvest;` +
      `\nregistry.json is an addressing index, not an input to either. Correcting it changes the denominator by 0.`,
  );

  process.exit(r.unregistered.length || inScopeGhosts.length ? 1 : 0);
}
