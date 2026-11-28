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
 *   kind      exactly the one the frame's status implies (kindOfStatus):
 *             ui         partial: the build differs from the board, or has not
 *                        been compared with it yet
 *             backend    blocked-on-backend; the line is exactly BACKEND_LINE
 *             not-built  not-started
 *             unchecked  a live frame no status row covers, or any other status
 *   notesSha  the first 12 hex of sha1 over the frame's registry.json notes when
 *             the line was written. When the notes move, the line is due a rewrite.
 *
 * What fails the check: a malformed row, a line that is not plain (lineProblems),
 * a kind the frame's status does not imply, a second line for one frame, and a
 * line for a frame the catalog does not hold. What it only counts: open frames
 * with no line yet, lines whose notes have moved since, and lines for frames
 * that are no longer open. The writing pass fills those over time, and the
 * emitter ships a line only for a frame that is open.
 *
 * The open frames are the ones figma-parity.json counts as `open` (genuine minus
 * done), read off coverage.json: every in-scope frameStatuses entry not done, and
 * every live-only frame.
 *
 * Read by: pipeline.mjs (the self-test and the check, after coverage.mjs);
 * src/__tests__/figmaCatalogGaps.test.ts (both, for the tier-1 gate); and, in
 * the Skai-Trading checkout, scripts/figma/parity-open-frames.mjs, which
 * emit-parity-json.mjs loads to build each page's openFrames (openFramesByPage,
 * checkGaps, frameIndex, kindOfStatus, autoLine), and its test
 * tests/build/parityOpenFrames.test.ts. A change to an export's shape is a
 * change to skai.trade's feed.
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

/**
 * Words with a capital inside them that a line may still use: token, product
 * and market names the app itself prints. Anything else shaped like that
 * (MinesBetPanel, useBetCurrency) is a code identifier. The game names need no
 * entry: as the app writes them (Hi-Lo, Price Grid, Sugar Rush) none has a
 * capital inside a word. Acronyms are listed for the reader; all capitals never
 * trip the rule.
 */
export const ALLOWED_MIXED_CASE = [
  "sUSD", "SKAI", "PnL", "DeFi", "TVL", "NFT", "NFTs", "Skaiscan", "USD", "USDC", "USDT", "BTC", "ETH",
  "MoonPay", "TradingView", "WalletConnect", "MetaMask", "YouTube", "TikTok", "iOS", "iPhone",
  "DexScreener", "CoinGecko", "OpenSea", "SkaiPay",
];

const NAME_RE = new RegExp(`\\b(?:${NAMES.join("|")})\\b`, "i");
// "Jordan asked for", "Kim wants": a request credited to a person, named or not on the list.
const ASKED_RE = /\b[A-Z][a-z]+\s+(?:asked|asks|said|says|wants|wanted|ruled|reported|requested|prefers|flagged)\b/;

// References into the catalog's own process. A bare game word passes: a Crash
// round, Round 1 of 3, a Plinko lane, lane 3, a wave animation, the Nonce field
// of a fairness panel. A wave with any number is the catalog's (wave 7, wave
// 80), and so is a round with one unless it reads "round N of M"; the catalog's
// lanes and its issue and report numbers run to two digits (lane 12, #77), so
// lane 3 and a #1 rank pass.
const PROCESS_RE = [
  /\bHQ\s?-?\s?\d/i,
  /\bHQ-/i,
  /\bwaves?\s*#?\d/i,
  // "of M" exempts a round only for an M of one or two digits standing alone:
  // the notes cite rulings as "round 27 of 2026-10-27".
  /\brounds?\s*#?\d+(?!\d)(?!\s*of\s+\d{1,2}(?![\d-]))/i,
  /\blanes?\s*#?\d{2,}/i,
  /\b[wl]\d{2,3}\b/i,
  /\b[PQ]\d{2,3}\b/,
  /#\d{2,}/,
  /\bruling/i,
  /\b(?:commits?|committed)\b/i,
];

// Backend parts by name. A frame blocked on them reads BACKEND_LINE and nothing
// more. "Contract" alone is a perps word (Hot contracts), so only a contract
// address or a smart contract counts.
const BACKEND_RE =
  /\b(?:relays?|keepers?|edge\s+functions?|RLS|hot\s+keys?|endpoints?|contract\s+address(?:es)?|smart\s+contracts?|RPCs?|indexers?|cron(?:\s+jobs?)?)\b/i;

const CODE_FILE = /\b[\w-]+\.(?:tsx?|jsx?|mjs|cjs|json|tsv|md|css|scss|html|sql|ps1|sh|py|go|rs|sol|svg|ya?ml|toml)\b/i;

// Characters a reader cannot see, which can split a name or a word past every rule here.
// Written as code points so no raw invisible character sits in this source.
const cp = (code) => String.fromCharCode(code);
const INVISIBLE = new RegExp(`[${cp(0xad)}${cp(0x200b)}-${cp(0x200f)}${cp(0x202a)}-${cp(0x202e)}${cp(0x2060)}-${cp(0x2064)}${cp(0xfeff)}]`);
// Every node id in the three files opens with four or more digits (2005 is the
// lowest), and an instance id carries an I before them (I9825:21726). A colon,
// a dash or one of the dashes from hyphen to horizontal bar (U+2010..U+2015)
// joins the two halves, so an amount range like 100-500 passes. Joined by a
// slash, both halves need four digits, so a board size like 1440/900 passes.
// A sub-node id can open with three digits (976:357); joined by a colon with
// three or more digits on both sides it counts, while 3:2, 35:1 and 0:30 do not.
const NODE_ID_RE = new RegExp(`\\b[Ii]?\\d{4,}\\s?[:\\-${cp(0x2010)}-${cp(0x2015)}]\\s?\\d+\\b`);
const NODE_ID_SLASH_RE = /\b[Ii]?\d{4,}\s?\/\s?\d{4,}\b/;
const NODE_ID_COLON_RE = /\b[Ii]?\d{3,}\s?:\s?\d{3,}\b/;

/** Hex runs a line must not hold: 0x anything, or 7+ hex digits mixing digits and letters. */
function holdsHex(s) {
  // An address or a hash written 0x..., cut short (0x5B41...0002) or not, but
  // not the "0x184" inside a size like 130x184.
  if (/\b0x[0-9a-f]{3,}/i.test(s)) return true;
  // Maximal runs, wherever they sit: glued to a word (sha3423cec) or an
  // underscore (3423cec_final) still counts. A run needs a digit and a letter,
  // so "defaced", "feedback" and the figure 1000000 pass.
  for (const run of s.match(/[0-9a-f]{7,}/gi) || []) if (/\d/.test(run) && /[a-f]/i.test(run)) return true;
  return false;
}

/** Node ids in any of the shapes a note writes them, dates aside: 9825-21726, 9825:21726, 9825/21726, I9825:21726, or with an en dash. */
function holdsNodeId(s) {
  // Dates and year ranges (2024-2026: two years from 19xx or 20xx) are set aside first.
  const undated = s.replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ").replace(/\b(?:19|20)\d{2}-(?:19|20)\d{2}\b/g, " ");
  return NODE_ID_RE.test(undated) || NODE_ID_SLASH_RE.test(undated) || NODE_ID_COLON_RE.test(undated);
}

/** A word with a lower-case letter right before a capital, or a snake_case word, that the allow-list does not hold. */
function holdsIdentifier(s) {
  for (const word of s.match(/[A-Za-z0-9_]+/g) || []) {
    if (ALLOWED_MIXED_CASE.includes(word)) continue;
    if (/[a-z][A-Z]/.test(word) || /[A-Za-z]_[A-Za-z]/.test(word)) return true;
  }
  return false;
}

/** Every reason a line is not fit for the public page; empty when it is. */
export function lineProblems(kind, gap) {
  const out = [];
  const s = typeof gap === "string" ? gap : "";
  if (!KINDS.includes(kind)) out.push(`kind ${JSON.stringify(kind)} is not one of ${KINDS.join(", ")}`);
  const chars = [...s].length;
  if (chars < 1 || chars > MAX_CHARS) out.push(`the line is ${chars} characters; it must be 1 to ${MAX_CHARS}`);
  if (/[\t\r\n]/.test(s)) out.push("the line holds a tab or a line break");
  else if (s !== s.trim()) out.push("the line starts or ends with a space");
  if (INVISIBLE.test(s)) out.push("the line holds an invisible character");
  if (kind === "backend" && s !== BACKEND_LINE) out.push(`a backend line reads exactly ${JSON.stringify(BACKEND_LINE)}`);
  // A ui line may say one part waits on backend work; only a backend line opens with it.
  if (kind !== "backend" && /^\W*waiting on backend/i.test(s)) out.push("only a backend line reads as waiting on backend work");
  if (/(?:^|[^\w])(?:src|modules|supabase|scripts)\//i.test(s) || /[\w.-]+\/[\w.-]+\/[\w.-]+/.test(s) || /\/[^\s/]*\.[a-z][a-z0-9]{0,4}\b/i.test(s) || CODE_FILE.test(s)) {
    out.push("it names a path or a file");
  }
  if (/https?:\/\/|\bwww\.|figma\.com|[\w.+-]+@[\w-]+\.[a-z]/i.test(s)) out.push("it holds a link or an address");
  if (holdsHex(s)) out.push("it holds a hex run (0x, or 7 or more hex digits mixing digits and letters)");
  if (holdsNodeId(s)) out.push("it holds a node id (an optional I, 4 or more digits, a colon or dash, digits; or 4+ digits on both sides of a slash)");
  if (holdsIdentifier(s)) out.push("it holds a code identifier (camelCase, PascalCase or snake_case)");
  if (PROCESS_RE.some((re) => re.test(s))) out.push("it refers into the catalog's process (HQ-, round 12, wave 80, w80, L93, P067, Q18, #77, ruling, commit)");
  if (kind !== "backend" && BACKEND_RE.test(s)) out.push("it names a backend part (relay, keeper, edge function, RLS, hot key, endpoint, contract address, smart contract, RPC, indexer, cron)");
  if (NAME_RE.test(s) || ASKED_RE.test(s)) out.push("it names a person");
  return out;
}

export const notesSha = (notes) => crypto.createHash("sha1").update(String(notes ?? ""), "utf8").digest("hex").slice(0, 12);

/**
 * The one kind an open frame's line may carry, from the status coverage
 * resolved for it. A line whose kind disagrees is refused: when a fold moves a
 * frame's status, the line has to move with it.
 */
export function kindOfStatus(status) {
  if (status === "partial") return "ui";
  if (status === "blocked-on-backend") return "backend";
  if (status === "not-started") return "not-built";
  return "unchecked";
}

/**
 * The line a frame with none written still ships: a frame blocked on backend
 * work reads BACKEND_LINE, and nothing else is filled in. Null when there is
 * none to give.
 */
export function autoLine(status) {
  if (kindOfStatus(status) !== "backend") return null;
  return lineProblems("backend", BACKEND_LINE).length ? null : { kind: "backend", gap: BACKEND_LINE };
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
  "# kind: the one the frame's status implies: ui (partial), backend (blocked-on-backend), not-built (not-started), unchecked (a live frame no status row covers).",
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
    const want = kindOfStatus(open.get(key).status);
    if (r.kind !== want) {
      errors.push(`${r.at}: ${r.node} is kind ${r.kind}, but its status ${open.get(key).status ?? "(live only)"} makes it ${want}; rewrite the line`);
      continue;
    }
    if (r.notesSha !== notesSha(frame?.notes)) stale.push(`${r.at} ${r.node}`);
  }
  const missing = [...open.keys()].filter((k) => !seen.has(k));
  return { rows, errors, stale, missing, notOpen, open: open.size };
}

/**
 * Lines from a writing pass into the table: each item is { fileKey, node,
 * kind, gap, notesSha, closedOnMain? }. A line that fails lineProblems, names a
 * frame that is not open, carries a kind its frame's status does not imply,
 * repeats a frame earlier in the batch, or comes with a non-empty closedOnMain
 * (its writer found the residual already closed on main, so the frame wants a
 * re-check in the next catalog fold, not a public gap) is refused and listed.
 * An accepted line replaces the frame's existing one.
 */
export function foldLines(existing, items, { coverage, at }) {
  const open = new Map();
  for (const list of openFramesByPage(coverage).values()) for (const f of list) open.set(`${f.fileKey}|${f.node}`, f);
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
    else if (KINDS.includes(item?.kind) && item.kind !== kindOfStatus(open.get(key).status)) {
      why.push(`kind ${item.kind}, but the frame's status ${open.get(key).status ?? "(live only)"} makes it ${kindOfStatus(open.get(key).status)}`);
    }
    if (String(item?.closedOnMain ?? "").trim()) why.push("its writer found it closed on main: re-check the frame in the next catalog fold");
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
  const files = args.filter((a, i) => a !== "--write" && a !== "--at" && (atFlag < 0 || i !== atFlag + 1));
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

  // Lines a tester can read and should: game words, figures and ratios that
  // share a shape with something the rules refuse.
  const honest = [
    ["a plain ui line", "ui", "The bet panel is 24px narrower than the board, and the Auto tab is missing."],
    ["a plain not-built line", "not-built", "This screen is not built yet."],
    ["an unchecked line", "unchecked", "Not yet compared with the build."],
    ["the backend line, as backend", "backend", BACKEND_LINE],
    ["words that hold a process word (background, rounded, waveform)", "ui", "The background is lighter and the rounded corners are smaller; the waveform is static."],
    ["a route with no file extension, and a pair of words", "ui", "The /play/mines header is taller; Win/Loss sits on one line."],
    ["a game round", "ui", "Each round's result is missing from the history strip."],
    ["Rounds played", "ui", "The Rounds played figure shows a dash."],
    ["a Nonce field", "ui", "The provably fair panel has no Nonce field."],
    ["a payout ratio (pays 3:2)", "ui", "The table reads Blackjack pays 3:2 in a smaller font than the design."],
    ["odds (35:1)", "ui", "The straight bet label shows 35:1 where the design shows 36x."],
    ["an aspect ratio (16:9)", "ui", "The share card is drawn 16:9 where the design draws 4:3."],
    ["a range (1-10)", "ui", "The 1-10 multiplier ladder is missing."],
    ["a time", "ui", "The countdown reads 0:30 where the design shows 00:30."],
    ["a score", "ui", "The live score 2-1 sits left of the team crest."],
    ["Plinko lanes", "ui", "The ball lanes are narrower than the design."],
    ["a wave animation", "ui", "The wave animation behind the reels is missing."],
    ["a date", "ui", "The snapshot date reads 2026-03-31 where the design writes March 31."],
    ["a seven-digit figure", "ui", "The jackpot shows 1000000 without separators."],
    ["a word made of hex letters", "ui", "The defaced badge art and the feedback toast are missing."],
    ["a size whose digits read 0x (130x184)", "ui", "The tiles are drawn 195x277 against 130x184."],
    ["one part waiting on backend work, inside a ui line", "ui", "The chart counts only your newest 10,000 trades; older history is waiting on backend work."],
    ["names the app prints (sUSD, PnL, DeFi, MoonPay)", "ui", "The sUSD balance, Closed PnL and DeFi tabs differ, and MoonPay is not offered."],
    ["market and product names (DexScreener, CoinGecko, SkaiPay, OpenSea)", "ui", "The DexScreener, CoinGecko, SkaiPay and OpenSea links are missing."],
    ["TikTok and iPhone", "ui", "The TikTok share and the iPhone install banner are missing."],
    ["a rank (#1)", "ui", "The #1 trader's badge is missing."],
    ["Hot contracts", "ui", "The Hot contracts list is missing."],
    ["contracts on perps", "ui", "The perps contracts are listed in a different order."],
    ["Round 1 of 3", "ui", "The Round 1 of 3 label shows a dash."],
    ["Round 12 of 30", "ui", "The Round 12 of 30 counter is missing."],
    ["a year range", "ui", "The 2024-2026 season table is missing."],
    ["long odds (100:1)", "ui", "The odds read 100:1 where the design shows 101x."],
    ["lane 3", "ui", "The ball in lane 3 lands short of the design."],
    ["a board size (1440/900)", "ui", "At 1440/900 the header is taller than the design."],
    ["an amount range (100-500 SKAI)", "ui", "The 100-500 SKAI bracket is missing."],
  ];
  for (const [what, kind, gap] of honest) t(`passes ${what}`, plain(kind, gap), `${JSON.stringify(gap)}: ${lineProblems(kind, gap).join("; ")}`);
  // "Ab " repeated: no hex run, so only the length rule can decide these two.
  const sized = (n) => `${"Ab ".repeat(n).slice(0, n - 1)}.`;
  t(`${MAX_CHARS} characters pass`, plain("ui", sized(MAX_CHARS)), lineProblems("ui", sized(MAX_CHARS)));

  // Each case trips one rule where it can, so a rule that stops working fails here.
  const refused = [
    ["an empty line", "ui", ""],
    [`${MAX_CHARS + 1} characters`, "ui", sized(MAX_CHARS + 1)],
    ["a tab", "ui", "The header\tis taller."],
    ["a line break", "ui", "The header\nis taller."],
    ["a leading space", "ui", " The header is taller."],
    ["an unknown kind", "visual", "The header is taller."],
    ["a backend line in other words", "backend", "Waiting on the bets feed."],
    ["the backend sentence on a ui line", "ui", BACKEND_LINE],
    ["the backend sentence, unstopped, on a ui line", "ui", "Waiting on backend work"],
    ["the backend sentence plus a reason, on a ui line", "ui", "Waiting on backend work. The bets endpoint is down."],
    ["a src path", "ui", "Built in src/pages but the header is taller."],
    ["a modules path", "ui", "See modules/skai-gaming for the panel."],
    ["a word/word/word path", "ui", "Built in components/play/games/crash only."],
    ["an edge function path", "ui", "supabase/functions/relay-bridge-withdraw returns 503."],
    ["a slash with a file extension", "ui", "The art at covers/mines.png is cropped."],
    ["a bare code file", "ui", "MinesGame.tsx draws the old header."],
    ["a yaml file", "ui", "The theme.yaml colors differ."],
    ["an svg file", "ui", "The icon-edit-16.svg glyph is missing."],
    ["a go file", "ui", "market.go skips the tab."],
    ["a solidity file", "ui", "outcome.sol holds the funds."],
    ["a link", "ui", "Compare the header with figma.com first."],
    ["an email address", "ui", "Write to ops@skai.trade for the tab."],
    ["a contract address", "ui", "Deposits go to 0x5B41000000000000000000000000000000000002 and fail."],
    ["a tx hash written 0x", "ui", "The claim tx 0x9f3c2a7be41d reverted."],
    ["a 0x run of letters alone", "ui", "Sent to 0xdeadbeef and lost."],
    ["an address cut short with an ellipsis", "ui", `Deposits go to 0x5B41${cp(0x2026)}0002 and fail.`],
    ["an address cut short, lower case", "ui", `The pool owner 0xe2bd${cp(0x2026)}1ef7 holds it.`],
    ["an address cut short with three dots", "ui", "Sent from 0x39a4...4efa and lost."],
    ["a short commit hash", "ui", "Fixed on main in 3423cec but the tab is missing."],
    ["a hash glued to a word", "ui", "Fixed by sha3423cec on main."],
    ["a hash before an underscore", "ui", "See build 3423cec_final."],
    ["a PascalCase component", "ui", "MinesBetPanel draws the old header."],
    ["a camelCase hook", "ui", "useBetCurrency returns POINTS here."],
    ["a snake_case word", "ui", "Needs one use_figma read."],
    ["a node id with a dash", "ui", "The Auto ladder of 9825-21726 is missing."],
    ["a node id with a colon", "ui", "Matches 9825:21726 except the tab."],
    ["a node id with an en dash", "ui", `The Auto ladder of 9825${cp(0x2013)}21726 is missing.`],
    ["a node id with a slash", "ui", "Matches 9825/21726 except the tab."],
    ["a node id spaced", "ui", "Matches 9825 : 21726 except the tab."],
    ["an instance node id", "ui", "Matches I9825:21726 except the tab."],
    ["an instance node id, lower case", "ui", "Matches i6711:32702 except the tab."],
    ["an instance node id, lower case, with a dash", "ui", "Matches i6711-32702 except the tab."],
    ["an instance sub-node id, lower case", "ui", "Matches i976:357 except the tab."],
    ["a sub-node id of three digits", "ui", "Matches 976:357 except the tab."],
    ["another sub-node id", "ui", "The strip of 974:301 is missing."],
    ["a node id of four digits each side, not a year range", "ui", "Matches 9825-2172 except the tab."],
    ["HQ-", "ui", "Tracked as HQ-26."],
    ["HQ without a dash", "ui", "Tracked as HQ26."],
    ["HQ- with no number", "ui", "Filed on the HQ-board."],
    ["round with its number", "ui", "Ruled in round 57."],
    ["round glued to its number", "ui", "Ruled in Round57."],
    ["wave with its number", "ui", "Closed in wave 80."],
    ["lane with its number", "ui", "Read by lane 12 only."],
    ["a wave id, upper case", "ui", "Read in W80 only."],
    ["a wave id", "ui", "Read in w83 only."],
    ["a lane id", "ui", "Read by L93 only."],
    ["a lane id, lower case", "ui", "Read by l149 only."],
    ["a lane id, upper case", "ui", "Read by L149 only."],
    ["a single-digit wave", "ui", "Closed in wave 7."],
    ["a single-digit round", "ui", "Ruled in round 9."],
    ["a round in the middle of a sentence", "ui", "The tab moved per round 4 of the review."],
    ["a round cited with its date", "ui", "Kept since round 27 of 2026-10-27."],
    ["a round cited with a month and day", "ui", "Kept since round 27 of 10-27."],
    ["a ruling with its number", "ui", "Kept by ruling 60."],
    ["a ruling glued to its number", "ui", "Kept by ruling60."],
    ["a packet id", "ui", "As P067 recorded, the tab is missing."],
    ["a question id", "ui", "Kept by Q18 for now."],
    ["an issue number", "ui", "Tracked in #77 for now."],
    ["ruling", "ui", "A ruling keeps the old chip."],
    ["commit", "ui", "A later commit moves the tab."],
    ["a backend reason in a ui line", "ui", "The relay refuses the bet while the keeper is down."],
    ["the hot key", "ui", "The hot key owns the pool, so deposits are held."],
    ["an edge function and RLS", "ui", "Top holders waits on the holder index edge function and RLS."],
    ["an endpoint", "ui", "The table waits on the history endpoint."],
    ["a contract address", "ui", "The vault contract address is not shown."],
    ["a smart contract", "ui", "The smart contract is not live."],
    ["an RPC", "ui", "The chart reads from the RPC instead."],
    ["an indexer", "ui", "Top holders waits on the indexer."],
    ["a cron", "ui", "The board refreshes on a cron."],
    ["Casey", "ui", "Casey asked for the old tab."],
    ["Adam, case folded", "ui", "As adam reported, the tab is missing."],
    ["Ty", "ui", "Ty saw the header move."],
    ["a person not on the list, asking", "ui", "Jordan asked for the old tab."],
    ["a name split by an invisible character", "ui", `Ca${cp(0x200b)}sey asked for the old tab.`],
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
  const kinds = checkGaps({
    coverage: cov(),
    registry,
    text: [row("1-2", "unchecked", "Not yet compared with the build.", notesSha("tab missing")), row("1-9", "ui", "The header is taller.", notesSha(""))].join("\n"),
  });
  t(
    "checkGaps refuses a kind the frame's status does not imply: unchecked on a partial frame, ui on a live-only one",
    kinds.errors.length === 2 && /1-2 is kind unchecked, but its status partial makes it ui/.test(kinds.errors[0]) && /1-9 is kind ui, but its status \(live only\) makes it unchecked/.test(kinds.errors[1]),
    JSON.stringify(kinds.errors),
  );
  t(
    "autoLine fills BACKEND_LINE for a frame blocked on backend work and nothing else",
    JSON.stringify(autoLine("blocked-on-backend")) === JSON.stringify({ kind: "backend", gap: BACKEND_LINE }) && autoLine("partial") === null && autoLine("not-started") === null && autoLine(null) === null,
  );

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
  const strict = foldLines(
    [],
    [
      { fileKey: K, node: "1-2", kind: "unchecked", gap: "Not yet compared with the build.", notesSha: notesSha("tab missing") },
      { fileKey: K, node: "1-3", kind: "backend", gap: BACKEND_LINE, notesSha: notesSha("no feed"), closedOnMain: "the feed is live on main" },
      { fileKey: K, node: "1-9", kind: "unchecked", gap: "Not yet compared with the build.", notesSha: notesSha(""), closedOnMain: "" },
    ],
    { coverage: cov(), at: "2026-11-13" },
  );
  const strictWhy = strict.refused.map((x) => `${x.node} ${x.why.join("; ")}`);
  t(
    "foldLines refuses a kind the status does not imply, and a line its writer found closed on main; an empty closedOnMain goes in",
    strict.added === 1 &&
      strict.rows[0]?.node === "1-9" &&
      strictWhy.length === 2 &&
      /^1-2 kind unchecked, but the frame's status partial makes it ui$/.test(strictWhy[0]) &&
      /^1-3 its writer found it closed on main/.test(strictWhy[1]),
    JSON.stringify(strictWhy),
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
