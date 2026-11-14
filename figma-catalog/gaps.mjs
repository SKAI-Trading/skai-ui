#!/usr/bin/env node
/**
 * gaps.mjs — the public line each open frame carries on skai.trade/status.
 *
 *   node figma-catalog/gaps.mjs                        check gaps.tsv against the catalog (a pipeline step)
 *   node figma-catalog/gaps.mjs fold <lines.json>...   dry run: which lines would go in, and which are refused
 *   node figma-catalog/gaps.mjs fold <lines.json>... --write [--at YYYY-MM-DD]
 *   node figma-catalog/gaps.mjs --self-test
 *
 * Under each page, the status page lists the frames still open on it, each with
 * one or two plain sentences on what differs from its board, so a tester can
 * tell a known gap from a new bug (Casey, 2026-11-13). The lines are public, so
 * they say nothing a tester cannot use: no file paths, commits, ids or names,
 * and a frame waiting on backend work says exactly that and no more.
 *
 * gaps.tsv holds one row per frame: fileKey, node, kind, gap, notesSha, writtenAt.
 *
 *   kind      ui         the build differs from the board
 *             backend    blocked on backend work; the line is exactly BACKEND_LINE
 *             not-built  nothing is built yet
 *             unchecked  a live frame no status row covers
 *   notesSha  the first 12 hex of sha1 over the frame's registry.json notes when
 *             the line was written. When the notes move, the line is due a rewrite.
 *
 * What fails the check: a malformed row, a line that is not plain (lineProblems),
 * a second line for one frame, and a line for a frame the catalog does not hold.
 * What it only counts: open frames with no line yet, lines whose notes have moved
 * since, and lines for frames that are no longer open. The writing pass fills
 * those over time, and the emitter ships a line only for a frame that is open.
 *
 * The open frames are the ones figma-parity.json counts as `open` (genuine minus
 * done), read off coverage.json: every in-scope frameStatuses entry not done, and
 * every live-only frame. The emitter imports openFramesByPage from here, so the
 * two can never disagree on which frames those are.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));

export const GAPS_FILE = "gaps.tsv";
export const COLUMNS = ["fileKey", "node", "kind", "gap", "notesSha", "writtenAt"];
export const KINDS = ["ui", "backend", "not-built", "unchecked"];
export const BACKEND_LINE = "Waiting on backend work.";
export const MAX_CHARS = 240;

/** The team. A public line names nobody. */
export const NAMES = ["Casey", "Adam", "Ty", "Miami"];

const NAME_RE = new RegExp(`\\b(?:${NAMES.join("|")})\\b`, "i");

// The words the catalog's own notes are written in. Each is a whole word, so
// "background", "rounded" and "waveform" pass.
const PROCESS_RE = [
  /\bHQ-/i,
  /\b(?:rounds?|waves?|lanes?|rulings?|nonces?|commits?|committed)\b/i,
  /\buse_figma\b/i,
  /\b(?:w\d{2,3}|L\d{2,3})\b/,
];

const CODE_FILE = /\b[\w-]+\.(?:tsx?|jsx?|mjs|cjs|json|tsv|md|css|sql|ps1|sh|py)\b/i;

/** Every reason a line is not fit for the public page; empty when it is. */
export function lineProblems(kind, gap) {
  const out = [];
  const s = typeof gap === "string" ? gap : "";
  if (!KINDS.includes(kind)) out.push(`kind ${JSON.stringify(kind)} is not one of ${KINDS.join(", ")}`);
  const chars = [...s].length;
  if (chars < 1 || chars > MAX_CHARS) out.push(`the line is ${chars} characters; it must be 1 to ${MAX_CHARS}`);
  if (/[\t\r\n]/.test(s)) out.push("the line holds a tab or a line break");
  else if (s !== s.trim()) out.push("the line starts or ends with a space");
  if (kind === "backend" && s !== BACKEND_LINE) out.push(`a backend line reads exactly ${JSON.stringify(BACKEND_LINE)}`);
  if (kind !== "backend" && s === BACKEND_LINE) out.push(`${JSON.stringify(BACKEND_LINE)} is the backend line; this one is kind ${kind}`);
  if (/(?:^|[^\w])(?:src|modules)\//i.test(s) || /\/[^\s/]*\.[a-z][a-z0-9]{0,4}\b/i.test(s) || CODE_FILE.test(s)) out.push("it names a path or a file");
  if (/https?:\/\/|\bwww\.|figma\.com/i.test(s)) out.push("it holds a link");
  if (/\b[0-9a-f]{7,}\b/i.test(s)) out.push("it holds a hex run of 7 or more");
  if (/\d+[:-]\d+/.test(s)) out.push("it holds a node id (digits, a colon or dash, digits)");
  if (PROCESS_RE.some((re) => re.test(s))) out.push("it uses a word from the catalog's process (HQ-, round, wave, lane, ruling, nonce, use_figma, commit)");
  if (NAME_RE.test(s)) out.push("it names a person");
  return out;
}

export const notesSha = (notes) => crypto.createHash("sha1").update(String(notes ?? ""), "utf8").digest("hex").slice(0, 12);

/** The kind a frame with no line ships, from the status coverage resolved for it. */
export function kindOfStatus(status) {
  if (status === "partial") return "ui";
  if (status === "blocked-on-backend") return "backend";
  if (status === "not-started") return "not-built";
  return "unchecked";
}

/** registry.json frames by `${fileKey}|${node}`, whichever key form the registry used. */
export function frameIndex(registry) {
  const frames = Array.isArray(registry?.frames) ? registry.frames : Object.values(registry?.frames || {});
  return new Map(frames.filter((f) => f && f.fileKey && f.node).map((f) => [`${f.fileKey}|${f.node}`, f]));
}

const pageKey = (p) => `${p.fileKey}:${p.pageId}`;

/**
 * The open frames of every in-scope page, keyed `${fileKey}:${pageId}`. Each is
 * { fileKey, node, status, live }: `status` is coverage's resolved status, null
 * for a live-only frame, which carries `live` ({ name, w }) instead. Throws when
 * a page's list does not come to genuine minus done, which is what the page
 * publishes as `open`.
 */
export function openFramesByPage(coverage) {
  const pages = (coverage?.pages || []).filter((p) => p && p.scope === "in-scope");
  const byName = new Map();
  for (const p of pages) {
    // frameStatuses names its page, not its file, so two in-scope pages sharing
    // a name would put one page's frames under the other.
    if (byName.has(p.pageName)) throw new Error(`two in-scope pages are named ${JSON.stringify(p.pageName)}; frameStatuses cannot tell their frames apart`);
    byName.set(p.pageName, p);
  }
  const out = new Map(pages.map((p) => [pageKey(p), []]));
  for (const f of coverage?.frameStatuses || []) {
    if (!f || f.scope !== "in-scope" || f.status === "done") continue;
    const p = byName.get(f.page);
    if (!p) throw new Error(`frameStatuses puts ${f.id} on ${JSON.stringify(f.page)}, which is not an in-scope page`);
    out.get(pageKey(p)).push({ fileKey: p.fileKey, node: f.id, status: f.status, live: null });
  }
  for (const p of pages)
    for (const n of p.liveOnly || []) out.get(pageKey(p)).push({ fileKey: p.fileKey, node: n.id, status: null, live: { name: n.name, w: n.w } });
  for (const p of pages) {
    const done = Number.isFinite(p.byStatus?.done) ? p.byStatus.done : 0;
    const got = out.get(pageKey(p)).length;
    if (got !== p.genuine - done) throw new Error(`${p.pageName}: ${got} open frames found, but genuine ${p.genuine} minus done ${done} is ${p.genuine - done}`);
  }
  return out;
}

const HEADER = [
  "# gaps.tsv: the public line each open frame shows under its page on skai.trade/status. HAND-MAINTAINED; gaps.mjs checks it.",
  "#",
  "# kind: ui (differs from its board), backend (blocked on backend work), not-built (nothing built yet), unchecked (a live frame no status row covers).",
  `# gap: one or two plain sentences, 1 to ${MAX_CHARS} characters, naming no path, id, hash or person. A backend line reads exactly "${BACKEND_LINE}"`,
  "# notesSha: the first 12 hex of sha1 over the frame's registry.json notes when the line was written. When the notes move, the line is due a rewrite.",
  "# A fold rewrites the lines of the frames it touches: node figma-catalog/gaps.mjs fold <lines.json> --write",
  COLUMNS.join("\t"),
];

/** Rows of gaps.tsv. A malformed row is an error, never skipped. */
export function parseGaps(text) {
  const rows = [];
  const errors = [];
  String(text ?? "")
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (!line.trim() || line.startsWith("#") || line === COLUMNS.join("\t")) return;
      const at = `${GAPS_FILE}:${i + 1}`;
      const cells = line.split("\t");
      if (cells.length !== COLUMNS.length) {
        errors.push(`${at}: ${cells.length} cells; a row has ${COLUMNS.length} (${COLUMNS.join(", ")})`);
        return;
      }
      const [fileKey, node, kind, gap, sha, writtenAt] = cells;
      const bad = [];
      if (!/^[A-Za-z0-9]{10,}$/.test(fileKey)) bad.push(`fileKey ${JSON.stringify(fileKey)} is not a Figma file key`);
      if (!/^\d+-\d+$/.test(node)) bad.push(`node ${JSON.stringify(node)} is not a node id like 1234-5678`);
      if (!/^[0-9a-f]{12}$/.test(sha)) bad.push("notesSha is not 12 lowercase hex");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(writtenAt)) bad.push("writtenAt is not YYYY-MM-DD");
      bad.push(...lineProblems(kind, gap));
      if (bad.length) errors.push(`${at}: ${bad.join("; ")}`);
      else rows.push({ at, fileKey, node, kind, gap, notesSha: sha, writtenAt });
    });
  return { rows, errors };
}

const byFrame = (a, b) => {
  if (a.fileKey !== b.fileKey) return a.fileKey < b.fileKey ? -1 : 1;
  const [a1, a2] = a.node.split("-").map(Number);
  const [b1, b2] = b.node.split("-").map(Number);
  return a1 - b1 || a2 - b2;
};

export function formatGaps(rows) {
  const body = rows
    .slice()
    .sort(byFrame)
    .map((r) => [r.fileKey, r.node, r.kind, r.gap, r.notesSha, r.writtenAt].join("\t"));
  return `${[...HEADER, ...body].join("\n")}\n`;
}

/**
 * gaps.tsv against the catalog. `errors` fail the check; `stale`, `missing`
 * and `notOpen` are counts the writing pass works down.
 */
export function checkGaps({ coverage, registry, text }) {
  const { rows, errors } = parseGaps(text);
  const open = new Map();
  for (const list of openFramesByPage(coverage).values()) for (const f of list) open.set(`${f.fileKey}|${f.node}`, f);
  const frames = frameIndex(registry);
  const seen = new Map();
  const stale = [];
  const notOpen = [];
  for (const r of rows) {
    const key = `${r.fileKey}|${r.node}`;
    if (seen.has(key)) {
      errors.push(`${r.at}: a second line for ${r.fileKey} ${r.node} (the first is ${seen.get(key)}); a frame has at most one`);
      continue;
    }
    seen.set(key, r.at);
    const frame = frames.get(key);
    if (!open.has(key)) {
      if (!frame) errors.push(`${r.at}: ${r.fileKey} ${r.node} is no frame the catalog holds`);
      else notOpen.push(`${r.at} ${r.node} (${frame.gone ? "gone" : frame.status})`);
      continue;
    }
    if (r.notesSha !== notesSha(frame?.notes)) stale.push(`${r.at} ${r.node}`);
  }
  const missing = [...open.keys()].filter((k) => !seen.has(k));
  return { rows, errors, stale, missing, notOpen, open: open.size };
}

/**
 * Lines from a writing pass into the table: each item is { fileKey, node,
 * kind, gap, notesSha }. A line that fails lineProblems, names a frame that is
 * not open, or repeats a frame earlier in the batch is refused and listed. An
 * accepted line replaces the frame's existing one.
 */
export function foldLines(existing, items, { coverage, at }) {
  const open = new Set();
  for (const list of openFramesByPage(coverage).values()) for (const f of list) open.add(`${f.fileKey}|${f.node}`);
  const rows = new Map(existing.map((r) => [`${r.fileKey}|${r.node}`, r]));
  const taken = new Set();
  const refused = [];
  let added = 0;
  let replaced = 0;
  for (const item of items) {
    const key = `${item?.fileKey}|${item?.node}`;
    const why = lineProblems(item?.kind, item?.gap);
    if (!/^[0-9a-f]{12}$/.test(item?.notesSha ?? "")) why.push("notesSha is not 12 lowercase hex");
    if (!open.has(key)) why.push("not an open in-scope frame");
    if (taken.has(key)) why.push("a second line for this frame in the same batch");
    if (why.length) {
      refused.push({ fileKey: item?.fileKey, node: item?.node, gap: item?.gap, why });
      continue;
    }
    taken.add(key);
    if (rows.has(key)) replaced++;
    else added++;
    rows.set(key, { fileKey: item.fileKey, node: item.node, kind: item.kind, gap: item.gap, notesSha: item.notesSha, writtenAt: at });
  }
  return { rows: [...rows.values()], added, replaced, refused };
}

// ── running ──────────────────────────────────────────────────────────────────

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
const readGaps = () => (fs.existsSync(path.join(DIR, GAPS_FILE)) ? fs.readFileSync(path.join(DIR, GAPS_FILE), "utf8") : "");

function check() {
  const r = checkGaps({ coverage: readJson("coverage.json"), registry: readJson("registry.json"), text: readGaps() });
  console.log(`${GAPS_FILE}: ${r.rows.length} line(s) for ${r.open} open in-scope frame(s).`);
  const warn = (what, list) => {
    if (!list.length) return;
    console.log(`  warning: ${list.length} ${what}${list.length > 5 ? `, first 5: ${list.slice(0, 5).join(", ")}` : `: ${list.join(", ")}`}`);
  };
  warn("open frame(s) with no line yet", r.missing);
  warn("line(s) whose frame's notes moved since they were written", r.stale);
  warn("line(s) for frames no longer open (the emitter ships none of them)", r.notOpen);
  if (r.errors.length) {
    console.error(`gaps.mjs: ${r.errors.length} line(s) refused:\n  ${r.errors.join("\n  ")}`);
    process.exit(1);
  }
}

function fold(args) {
  const write = args.includes("--write");
  const atFlag = args.indexOf("--at");
  const at = atFlag >= 0 ? args[atFlag + 1] : new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(at || "")) {
    console.error(`gaps.mjs fold: --at must be YYYY-MM-DD, got ${JSON.stringify(at)}`);
    process.exit(1);
  }
  const files = args.filter((a, i) => a !== "--write" && a !== "--at" && i !== atFlag + 1);
  if (!files.length) {
    console.error("gaps.mjs fold: name at least one JSON file of lines");
    process.exit(1);
  }
  const items = files.flatMap((f) => {
    const v = JSON.parse(fs.readFileSync(path.resolve(f), "utf8"));
    return Array.isArray(v) ? v : [v];
  });
  const parsed = parseGaps(readGaps());
  if (parsed.errors.length) {
    console.error(`gaps.mjs fold: ${GAPS_FILE} is malformed, nothing folded:\n  ${parsed.errors.join("\n  ")}`);
    process.exit(1);
  }
  const coverage = readJson("coverage.json");
  const r = foldLines(parsed.rows, items, { coverage, at });
  console.log(`${items.length} line(s) read: ${r.added} new, ${r.replaced} replacing a line, ${r.refused.length} refused.`);
  for (const x of r.refused) console.log(`  refused ${x.fileKey} ${x.node}: ${x.why.join("; ")}\n          ${JSON.stringify(x.gap)}`);
  if (write) {
    fs.writeFileSync(path.join(DIR, GAPS_FILE), formatGaps(r.rows));
    console.log(`wrote ${GAPS_FILE} (${r.rows.length} lines). Run npm run catalog:check next.`);
  } else console.log("dry run: nothing written (add --write).");
}

function selfTest() {
  let pass = 0;
  let fail = 0;
  const t = (name, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `\n        ${detail}`}`);
    ok ? pass++ : fail++;
  };
  const plain = (kind, gap) => lineProblems(kind, gap).length === 0;

  t("a plain ui line passes", plain("ui", "The bet panel is 24px narrower than the board, and the Auto tab is missing."), lineProblems("ui", "The bet panel is 24px narrower than the board, and the Auto tab is missing."));
  t("a plain not-built line passes", plain("not-built", "This screen is not built yet."));
  t("an unchecked line passes", plain("unchecked", "Not yet compared with the build."));
  t("the backend line passes as backend", plain("backend", BACKEND_LINE));
  t("game words that contain a process word pass (background, rounded, waveform)", plain("ui", "The background is lighter and the rounded corners are smaller; the waveform is static."));
  t("a route with no file extension passes, and so does a ratio of words", plain("ui", "The /play/mines header is taller; Win/Loss sits on one line."));
  // "Ab " repeated: no hex run, so only the length rule can decide these two.
  const sized = (n) => `${"Ab ".repeat(n).slice(0, n - 1)}.`;
  t(`${MAX_CHARS} characters pass`, plain("ui", sized(MAX_CHARS)), lineProblems("ui", sized(MAX_CHARS)));

  const refused = [
    ["an empty line", "ui", ""],
    [`${MAX_CHARS + 1} characters`, "ui", sized(MAX_CHARS + 1)],
    ["a tab", "ui", "The header\tis taller."],
    ["a line break", "ui", "The header\nis taller."],
    ["a leading space", "ui", " The header is taller."],
    ["an unknown kind", "visual", "The header is taller."],
    ["a backend line in other words", "backend", "Waiting on the bets endpoint."],
    ["the backend sentence on a ui line", "ui", BACKEND_LINE],
    ["a src path", "ui", "Built in src/pages/Mines but the header is taller."],
    ["a modules path", "ui", "See modules/skai-gaming for the panel."],
    ["a slash with a file extension", "ui", "The art at covers/mines.png is cropped."],
    ["a bare code file", "ui", "MinesGame.tsx draws the old header."],
    ["a link", "ui", "Compare the header with figma.com first."],
    ["a short commit hash", "ui", "Fixed on main in 3423cec but the tab is missing."],
    ["a node id with a dash", "ui", "The Auto ladder of 9825-21726 is missing."],
    ["a node id with a colon", "ui", "Matches 9825:21726 except the tab."],
    ["HQ-", "ui", "Tracked as HQ-26."],
    ["round", "ui", "Ruled in round 57."],
    ["wave", "ui", "Closed in a later wave."],
    ["lane", "ui", "The lane that read it ran out of time."],
    ["ruling", "ui", "A ruling keeps the old chip."],
    ["nonce", "ui", "The read nonce was lost."],
    ["use_figma", "ui", "Needs one use_figma read."],
    ["commit", "ui", "A later commit moves the tab."],
    ["a lane id", "ui", "Read by L93 only."],
    ["a wave id", "ui", "Read in w83 only."],
    ["Casey", "ui", "Casey asked for the old tab."],
    ["Adam, case folded", "ui", "As adam reported, the tab is missing."],
    ["Ty", "ui", "Ty saw the header move."],
  ];
  for (const [what, kind, gap] of refused) t(`refuses ${what}`, !plain(kind, gap), `passed: ${JSON.stringify(gap)}`);

  t("notesSha is the first 12 hex of sha1 over the notes", notesSha("abc") === "a9993e364706" && notesSha(undefined) === notesSha(""));
  t("kindOfStatus maps the three open statuses and calls anything else unchecked", kindOfStatus("partial") === "ui" && kindOfStatus("blocked-on-backend") === "backend" && kindOfStatus("not-started") === "not-built" && kindOfStatus("furniture") === "unchecked" && kindOfStatus(null) === "unchecked");

  const K = "M6r9FEn042UWTQD1zvy6GM";
  const row = (node, kind, gap, sha = "0123456789ab", at = "2026-11-13") => [K, node, kind, gap, sha, at].join("\t");
  const p = parseGaps(
    [
      "# comment",
      COLUMNS.join("\t"),
      row("1-1", "ui", "The tab is missing."),
      row("1-2", "ui", "The tab is missing.", "XYZ"),
      row("1-3", "ui", "The tab is missing.", "0123456789ab", "13 Nov"),
      [K, "1-4", "ui", "The tab is missing."].join("\t"),
      row("abc", "ui", "The tab is missing."),
      row("1-6", "ui", "Fixed in 3423cec."),
    ].join("\r\n"),
  );
  t("parseGaps keeps a good row and skips comments and the header", p.rows.length === 1 && p.rows[0].node === "1-1", JSON.stringify(p.rows));
  t("parseGaps refuses a bad sha, a bad date, a short row, a bad node and an unplain line", p.errors.length === 5, JSON.stringify(p.errors));
  t("parseGaps names the short row by its cell count", p.errors.some((e) => /:6: 4 cells; a row has 6/.test(e)), JSON.stringify(p.errors));

  const page = (over) => ({ fileKey: K, pageId: "1:1", pageName: "Mines", scope: "in-scope", genuine: 4, byStatus: { done: 1, partial: 2 }, liveOnly: [{ id: "1-9", name: "Skai > Mines 1VH (375 x 812px)", w: 375 }], ...over });
  const cov = (over = {}, extra = {}) => ({
    pages: [page(over)],
    frameStatuses: [
      { id: "1-1", page: "Mines", scope: "in-scope", status: "done" },
      { id: "1-2", page: "Mines", scope: "in-scope", status: "partial" },
      { id: "1-3", page: "Mines", scope: "in-scope", status: "blocked-on-backend" },
    ],
    ...extra,
  });
  const open = openFramesByPage(cov());
  const list = open.get(`${K}:1:1`) || [];
  t("openFramesByPage lists the not-done frames and the live-only one", list.map((f) => f.node).join() === "1-2,1-3,1-9" && list[2].status === null && list[2].live.w === 375, JSON.stringify(list));
  let threw = null;
  try {
    openFramesByPage(cov({ genuine: 5 }));
  } catch (e) {
    threw = e.message;
  }
  t("openFramesByPage refuses a page whose open frames do not come to genuine minus done", /genuine 5 minus done 1/.test(threw || ""), threw);
  threw = null;
  try {
    openFramesByPage({ pages: [page({}), page({ pageId: "2:2", fileKey: "mhF3BkzlTaGiLzJ7kvpmVc" })], frameStatuses: [] });
  } catch (e) {
    threw = e.message;
  }
  t("openFramesByPage refuses two in-scope pages sharing a name", /two in-scope pages/.test(threw || ""), threw);

  const registry = { fileKey: "3sSzw1KewMtUbeLAv7uW0r", frames: { [`${K}:1-1`]: { fileKey: K, node: "1-1", status: "done", notes: "done" }, [`${K}:1-2`]: { fileKey: K, node: "1-2", status: "partial", notes: "tab missing" }, [`${K}:1-3`]: { fileKey: K, node: "1-3", status: "blocked-on-backend", notes: "no feed" } } };
  const g = checkGaps({
    coverage: cov(),
    registry,
    text: [row("1-2", "ui", "The Auto tab is missing.", notesSha("tab missing")), row("1-3", "backend", BACKEND_LINE, notesSha("an older note")), row("1-1", "ui", "The tab is missing."), row("1-7", "ui", "The tab is missing.")].join("\n"),
  });
  t("checkGaps counts a stale line, a line on a frame no longer open, and an open frame with no line", g.stale.length === 1 && /1-3/.test(g.stale[0]) && g.notOpen.length === 1 && /1-1/.test(g.notOpen[0]) && g.missing.join() === `${K}|1-9`, JSON.stringify(g));
  t("checkGaps refuses a line for a frame the catalog does not hold", g.errors.length === 1 && /1-7 is no frame/.test(g.errors[0]), JSON.stringify(g.errors));
  const twice = checkGaps({ coverage: cov(), registry, text: [row("1-2", "ui", "One."), row("1-2", "ui", "Two.")].join("\n") });
  t("checkGaps refuses a second line for one frame", twice.errors.length === 1 && /second line/.test(twice.errors[0]), JSON.stringify(twice.errors));

  const f = foldLines(
    [{ fileKey: K, node: "1-2", kind: "ui", gap: "Old.", notesSha: "0123456789ab", writtenAt: "2026-11-01" }],
    [
      { fileKey: K, node: "1-2", kind: "ui", gap: "The Auto tab is missing.", notesSha: notesSha("tab missing") },
      { fileKey: K, node: "1-3", kind: "backend", gap: BACKEND_LINE, notesSha: "short" },
      { fileKey: K, node: "1-3", kind: "backend", gap: "Waits on the feed.", notesSha: notesSha("no feed") },
      { fileKey: K, node: "1-9", kind: "unchecked", gap: "Not yet compared with the build.", notesSha: notesSha("") },
      { fileKey: K, node: "1-9", kind: "unchecked", gap: "Again.", notesSha: notesSha("") },
      { fileKey: K, node: "1-1", kind: "ui", gap: "The tab is missing.", notesSha: notesSha("done") },
    ],
    { coverage: cov(), at: "2026-11-13" },
  );
  const reasons = f.refused.map((x) => `${x.node} ${x.why.join("; ")}`);
  t(
    "foldLines replaces a frame's line and adds a new one, dated the fold",
    f.replaced === 1 && f.added === 1 && f.rows.find((r) => r.node === "1-2").gap === "The Auto tab is missing." && f.rows.find((r) => r.node === "1-2").writtenAt === "2026-11-13",
    JSON.stringify(f),
  );
  t(
    "foldLines refuses, each for its one reason, a bad sha, an unplain line, a repeat in the batch and a frame not open",
    reasons.length === 4 &&
      /^1-3 notesSha is not 12 lowercase hex$/.test(reasons[0]) &&
      /^1-3 a backend line reads exactly/.test(reasons[1]) &&
      /^1-9 a second line for this frame in the same batch$/.test(reasons[2]) &&
      /^1-1 not an open in-scope frame$/.test(reasons[3]),
    JSON.stringify(reasons),
  );
  const round = parseGaps(formatGaps(f.rows));
  t("formatGaps writes a table parseGaps reads back whole", round.errors.length === 0 && round.rows.length === 2, JSON.stringify(round));
  const line = (fileKey, node) => ({ fileKey, node, kind: "ui", gap: "The tab is missing.", notesSha: "0123456789ab", writtenAt: "2026-11-13" });
  const sorted = parseGaps(formatGaps([line(K, "1-10"), line("3sSzw1KewMtUbeLAv7uW0r", "5-1"), line(K, "1-9"), line(K, "2-1")]));
  t(
    "formatGaps sorts by file, then by node as numbers (1-9 before 1-10)",
    sorted.rows.map((r) => r.node).join() === "5-1,1-9,1-10,2-1",
    sorted.rows.map((r) => r.node).join(),
  );

  console.log(`\nself-test: ${pass}/${pass + fail} passed.`);
  process.exit(fail ? 1 : 0);
}

const IS_MAIN = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const argv = process.argv.slice(2);
if (!IS_MAIN) {
  /* imported for its helpers (scripts/figma/emit-parity-json.mjs) */
} else if (argv.includes("--self-test")) selfTest();
else if (argv[0] === "fold") fold(argv.slice(1));
else if (!argv.length) check();
else {
  console.error(`gaps.mjs: unknown argument ${argv.join(" ")}\n  node figma-catalog/gaps.mjs | fold <lines.json>... [--write] [--at YYYY-MM-DD] | --self-test`);
  process.exit(1);
}
