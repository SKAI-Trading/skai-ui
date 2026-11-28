#!/usr/bin/env node
/**
 * watch.mjs: keep the catalog, and so skai.trade/status, in step with Figma
 * without anyone asking.
 *
 * Casey, 2026-11-27, after folding the designer's Collectables drop by hand:
 * "make sure the figma catalog picks up on figma changes and updates like this
 * from now on so I don't need to constantly do this."
 *
 *   node figma-catalog/watch.mjs run [--dry] [--here]   one pass (the scheduled job runs this)
 *   node figma-catalog/watch.mjs status                  last run, pending calls, open hand-offs
 *   node figma-catalog/watch.mjs pause [reason] | resume
 *   node figma-catalog/watch.mjs install [--every-hours 6]
 *   node figma-catalog/watch.mjs --self-test
 *
 * A pass is the README's harvest loop with every step that needs no judgment
 * done here, in code, and every step that does handed to Casey's HQ inbox:
 *
 *   1. Hash every page of every file (one read-only call per file). Nothing
 *      moved: stop. Once a week an unchanged pass is still committed, so the
 *      harvest stamps and the call ledger stay current.
 *   2. Re-read the changed pages whole, and check each page's rows re-hash to
 *      the step-1 hash (a page that moved between the two reads waits for the
 *      next pass). Ingest them, and probe every catalogued id that is no longer
 *      top-level.
 *   3. Run the drift pass and sort its rows. ADDED, RETITLED, and REMOVED of an
 *      id the probe certified gone fold in. REMOVED-WITH-WORK, RETARGET,
 *      NEW-SECTION and NOT-HARVESTED do not: their section is left unfolded and
 *      the rows go to HQ. So do a new page (it needs a scope ruling), a page
 *      that vanished, and a change to a tombstone copy.
 *   4. Fold only the sections whose pages changed (snapshot-to-nodes --only),
 *      record the gone ids, give every new open frame its public gap line,
 *      regenerate, re-run drift, and require `pipeline.mjs --check` to pass.
 *   5. Refuse the commit if any surviving frame's status, implFiles, notes,
 *      verifiedAt, route or citations moved, or a title moved that drift did
 *      not report as a designer rename.
 *   6. Commit inside figma-catalog/ and the call ledger only, push skai-ui
 *      main (the pipeline then republishes skai.trade/status), report to HQ.
 *
 * Who reads Figma. Figma is reachable only through the Figma MCP's use_figma,
 * which only a Claude session has. Each read is a headless `claude -p` run on a
 * small model, handed the exact read-only scripts harvest.mjs prints and told
 * to run them verbatim. Its results are taken from the run's stream-json
 * transcript, never retyped, and a result counts only when the code that ran is
 * byte for byte the code it was handed. A call with code it was not handed is a
 * hand-off, never a result.
 *
 * Where it runs. A dedicated clone of skai-ui (install puts it in
 * ~/skai-orch/figma-watch/skai-ui), never the shared working tree, so it can
 * neither take a peer's staged file into a commit nor be taken into one. A pass
 * is skipped while the shared tree has uncommitted or unpushed catalog work, so
 * a session folding by hand is not raced. `--here` lets a person run a pass in
 * another checkout; it still refuses the superproject's shared tree.
 *
 * Budget. A pass needs one call per file plus one session; it is skipped when
 * that would leave fewer than MIN_LEFT of the day's calls (figma/lib/ledger.mjs,
 * 120 a day by default, shared with every session). Calls are recorded in the
 * clone's pending file as they are spent and written into
 * figma/ledger/calls.jsonl with the next commit.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { compareVerify, verifyScript, chunkScript, fnv1a } from "./harvest.mjs";
import { openFramesByPage, parseGaps, formatGaps, kindOfStatus, notesSha, lineProblems } from "./gaps.mjs";
import { readLedger, callsOn, budgetFrom, utcDay, appendLine } from "../figma/lib/ledger.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const UI = path.dirname(DIR);
const HOME = process.env.FIGMA_WATCH_HOME || path.join(os.homedir(), "skai-orch", "figma-watch");
const CLONE = path.join(HOME, "skai-ui");
const SHARED_UI = process.env.FIGMA_WATCH_SHARED || path.join(os.homedir(), "Documents", "GitHub", "Skai-Trading", "modules", "skai-ui");
const REMOTE = "https://github.com/SKAI-Trading/skai-ui.git";
const TASK_NAME = "SKAI Figma watch";
const HQ_AS = "Figma-watch";
const LEDGER = path.join(UI, "figma", "ledger", "calls.jsonl");
const PENDING = path.join(HOME, "pending-calls.jsonl");
const STATE = path.join(HOME, "state.json");
const CONFIG = path.join(HOME, "config.json");
const PAUSED = path.join(HOME, "paused");
const LOCK = path.join(HOME, "lock");

export const USE_FIGMA = "mcp__plugin_figma_figma__use_figma";
export const CREATE_SESSION = "mcp__plugin_figma_figma__create_session";
const FIGMA_PREFIX = "mcp__plugin_figma_figma__";
// The only tools an executor run may call.
export const EXEC_TOOLS = new Set(["ToolSearch", USE_FIGMA, CREATE_SESSION]);
// Every other MCP server a headless session on this machine loads (its init
// message, 2026-11-28), denied by server prefix.
export const DENIED_SERVERS = [
  "mcp__plugin_supabase_supabase", "mcp__plugin_playwright_playwright", "mcp__plugin_chrome-devtools-mcp_chrome-devtools",
  "mcp__claude-in-chrome", "mcp__GitKraken", "mcp__claude_ai_Claude_Docs", "mcp__claude_ai_Figma", "mcp__plugin_sentry_sentry",
  "mcp__plugin_prompts_chat_prompts_chat", "mcp__plugin_huggingface-skills_huggingface-skills", "mcp__plugin_semgrep_guardian",
  "mcp__plugin_cloudflare_cloudflare-api", "mcp__plugin_cloudflare_cloudflare-bindings", "mcp__plugin_cloudflare_cloudflare-builds",
  "mcp__plugin_cloudflare_cloudflare-observability", "mcp__plugin_cloudflare_cloudflare-docs", "mcp__plugin_context7_context7",
  "mcp__plugin_deploy-on-aws_awsiac", "mcp__plugin_deploy-on-aws_awsknowledge", "mcp__plugin_deploy-on-aws_awspricing",
];
const EXEC_MODEL = process.env.FIGMA_WATCH_MODEL || "haiku";
const MIN_LEFT = 25;
const STAMP_EVERY_DAYS = 7;
const BATCH_JOBS = 6;
const FAILS_BEFORE_HANDOFF = 3;

// Drift classes (figma-drift.mjs) a pass may fold without a person.
export const FOLDABLE = new Set(["ADDED", "RETITLED"]);
// Fields of a surviving frame no harvest may move. A harvest adds frames,
// drops certified-gone ones and renames; everything here is someone's work.
export const GUARDED_FIELDS = ["status", "implFiles", "notes", "verifiedAt", "route", "citedByFiles", "bpStatus"];

// The public line a new open frame ships until someone writes a better one.
// The feed prints the frame's title beside it, so the line need not repeat it.
export const DEFAULT_LINES = {
  unchecked: "This design has not yet been checked against the app.",
  ui: "Part of this design is built; what still differs has not been written up yet.",
  "not-built": "This design has not been built yet.",
};

// ── small pure helpers (covered by --self-test) ─────────────────────────────

/** ASCII-only, and none of the characters cmd.exe reads inside hq.cmd's arguments. */
export function hqText(s, max = 160) {
  return String(s)
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/[<>|&^%"]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** The prompt that turns a small model into a script runner. */
export function execPrompt(jobs) {
  const lines = [
    "You run read-only Figma scripts and nothing else. You have no other task.",
    "",
    `1. Call ToolSearch with query "select:${USE_FIGMA},${CREATE_SESSION}".`,
    `2. Call ${CREATE_SESSION} once, with fileKey ${jobs[0].fileKey} and description "Read-only check of the design catalog against the file".`,
    `3. For each job below, in order, call ${USE_FIGMA} once with that job's fileKey, the sessionId from step 2, skillNames "figma-use",`,
    "   a short description, and code equal to the job's code exactly, character for character, from the line after CODE BEGIN",
    "   to the line before CODE END. Do not change, shorten, reformat, fix or add to the code. Do not retry a job that fails.",
    "   Never call any tool with code that is not one of these jobs.",
    "4. When every job has been called once, reply with the single word DONE.",
  ];
  jobs.forEach((j, i) => lines.push("", `JOB ${i + 1} fileKey ${j.fileKey}`, "CODE BEGIN", j.code.trimEnd(), "CODE END"));
  return lines.join("\n") + "\n";
}

/** Every tool call and its result from a `claude -p --output-format stream-json` transcript. */
export function parseTranscript(text) {
  const msgs = String(text)
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  const uses = new Map();
  const calls = [];
  let result = null;
  for (const m of msgs) {
    if (m.type === "result") result = m;
    const content = m.message?.content;
    if (!Array.isArray(content)) continue;
    for (const b of content) {
      if (b?.type === "tool_use") uses.set(b.id, { name: b.name, input: b.input || {}, answered: false });
      else if (b?.type === "tool_result" && uses.has(b.tool_use_id)) {
        const u = uses.get(b.tool_use_id);
        u.answered = true;
        const t = Array.isArray(b.content)
          ? b.content.filter((x) => x?.type === "text").map((x) => x.text).join("")
          : String(b.content ?? "");
        calls.push({ name: u.name, input: u.input, text: t, isError: Boolean(b.is_error) });
      }
    }
  }
  // A Figma call that never got its result still spent a call.
  const figmaCalls = [...uses.values()].filter((u) => String(u.name).startsWith(FIGMA_PREFIX));
  return { calls, uses: [...uses.values()], figmaCalls, cost: result?.total_cost_usd ?? null, ok: result?.subtype === "success" };
}

const sameCode = (a, b) => String(a ?? "").trimEnd() === String(b ?? "").trimEnd();

/**
 * Pair each job with the use_figma call that ran exactly its code. `stray` is
 * every use_figma call whose code is none of the jobs': the one outcome that
 * could mean something other than a read happened.
 */
export function matchJobs(jobs, parsed) {
  const taken = new Set();
  const results = jobs.map((job) => {
    const i = parsed.calls.findIndex((c, k) => !taken.has(k) && c.name === USE_FIGMA && c.input.fileKey === job.fileKey && sameCode(c.input.code, job.code));
    if (i < 0) return { job, payload: null, why: "the executor never ran it" };
    taken.add(i);
    const c = parsed.calls[i];
    if (c.isError) return { job, payload: null, why: `Figma answered with an error: ${c.text.slice(0, 200)}` };
    try {
      return { job, payload: JSON.parse(c.text), why: null };
    } catch {
      return { job, payload: null, why: `the result is not JSON: ${c.text.slice(0, 120)}` };
    }
  });
  const stray = parsed.calls.filter((c) => c.name === USE_FIGMA && !jobs.some((j) => j.fileKey === c.input.fileKey && sameCode(c.input.code, j.code)));
  return { results, stray };
}

/** The chunk lists `harvest.mjs plan` prints, one per numbered line. */
export function parsePlan(stdout) {
  const out = [];
  for (const line of String(stdout).split(/\r?\n/)) {
    const m = line.match(/^\s*\d+\s+(\[\[.*\]\])\s*$/);
    if (m) out.push(JSON.parse(m[1]));
  }
  return out;
}

/**
 * Re-hash each page from its harvest chunks, in order, and compare with the
 * verify read's hash. Returns the pages whose rows do not tile or do not match.
 */
export function pagesNotMatchingVerify(harvestPayloads, verifyPages) {
  const byPage = new Map();
  for (const p of harvestPayloads) for (const c of p.chunks || []) {
    const [pid, , count, from, end, rows] = c;
    if (!byPage.has(pid)) byPage.set(pid, []);
    byPage.get(pid).push({ count, from, end, rows });
  }
  const bad = [];
  for (const [pid, , n, hash] of verifyPages) {
    const parts = (byPage.get(pid) || []).sort((a, b) => a.from - b.from);
    if (!parts.length) continue;
    let at = 0;
    let tiles = true;
    for (const p of parts) {
      if (p.from !== at) tiles = false;
      at = p.end;
    }
    if (at !== n || parts.some((p) => p.count !== n)) tiles = false;
    const joined = parts.map((p) => p.rows).filter((r) => r !== "").join("\n");
    if (!tiles || fnv1a(joined) !== hash) bad.push({ pageId: pid, n, tiles, hash, got: fnv1a(joined) });
  }
  return bad;
}

/** Rows of figma-todo.live.tsv. */
export function parseTodo(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
  if (!lines.length) return [];
  const head = lines[0].split("\t");
  return lines.slice(1).map((l) => {
    const cells = l.split("\t");
    return Object.fromEntries(head.map((h, i) => [h, cells[i] ?? ""]));
  });
}

/**
 * Sort drift rows of the sections whose pages changed into what folds and
 * what waits for a person.
 * @param rows        parseTodo rows
 * @param sections    Set of section names whose pages changed
 * @param goneIds     Set of ids the probe certified gone ("<fileKey>|<id>")
 * @param fileOf      section -> fileKey
 */
export function classifyDrift(rows, sections, goneIds, fileOf) {
  const dirty = new Map();
  const gone = [];
  const retitled = [];
  const flag = (s, why) => {
    if (!dirty.has(s)) dirty.set(s, []);
    dirty.get(s).push(why);
  };
  for (const r of rows) {
    if (!sections.has(r.section)) continue;
    const where = `${r.section} ${r.nodeId}`;
    if (r.change === "ADDED") continue;
    if (r.change === "RETITLED") {
      retitled.push({ section: r.section, id: r.nodeId, now: r.title, was: String(r.why || "").replace(/^was:\s*/, "") });
      continue;
    }
    if (r.change === "REMOVED") {
      if (goneIds.has(`${fileOf(r.section)}|${r.nodeId}`)) gone.push({ section: r.section, id: r.nodeId, title: r.title });
      else flag(r.section, `REMOVED ${where} (${r.title}): the probe did not certify it gone`);
      continue;
    }
    flag(r.section, `${r.change} ${where} (${r.title}): ${r.why}`);
  }
  return { dirty, gone, retitled };
}

/**
 * Field moves on frames present before and after that no harvest may make.
 * Titles are compared with whitespace folded, as figma-drift.mjs compares
 * them: a harvest read folds runs of spaces in a name, so the first re-read of
 * a page harvested before that rule turns "Create course  (375" into
 * "Create course (375" (Governance, 2026-11-28). That is not a lost title.
 */
export function guardRegistry(before, after, allowTitle = new Set()) {
  const key = (f) => `${f.fileKey}|${f.node}`;
  const ws = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
  const now = new Map(Object.values(after.frames || {}).map((f) => [key(f), f]));
  const bad = [];
  for (const f of Object.values(before.frames || {})) {
    const g = now.get(key(f));
    if (!g) continue;
    for (const field of GUARDED_FIELDS) if (JSON.stringify(f[field] ?? null) !== JSON.stringify(g[field] ?? null)) bad.push(`${key(f)} ${field}`);
    if (ws(f.title) !== ws(g.title) && !allowTitle.has(key(f))) bad.push(`${key(f)} title`);
  }
  return bad;
}

/** Gap lines for open frames that have none yet, in the plain wording above. */
export function missingGapLines(coverage, registry, gapsText) {
  const have = new Set(parseGaps(gapsText).rows.map((r) => `${r.fileKey}|${r.node}`));
  const frames = new Map(Object.values(registry.frames || {}).map((f) => [`${f.fileKey}|${f.node}`, f]));
  const out = [];
  for (const [, list] of openFramesByPage(coverage)) {
    for (const f of list) {
      const k = `${f.fileKey}|${f.node}`;
      if (have.has(k)) continue;
      const kind = kindOfStatus(f.status);
      if (!DEFAULT_LINES[kind]) continue; // a backend frame ships its sentence on its own
      out.push({ fileKey: f.fileKey, node: f.node, kind, gap: DEFAULT_LINES[kind], notesSha: notesSha(frames.get(k)?.notes) });
    }
  }
  return out;
}

/** One line for the commit subject: every changed page, before and after. */
export function changeSummary(changed, unknown) {
  const name = (s) => hqText(s, 60) || "untitled page";
  const parts = [
    ...changed.map((c) => `${name(c.pageName)} ${c.wasN} to ${c.n}`),
    ...unknown.map((u) => `new page ${name(u.pageName)} (${u.n})`),
  ];
  return parts.join(", ");
}

// ── process plumbing ────────────────────────────────────────────────────────

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}
const writeJson = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const config = () => readJson(CONFIG, {});
const tool = (name, fallback) => config()[name] || fallback;

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 512 * 1024 * 1024, windowsHide: true, ...opts });
  return { status: r.status ?? (r.error ? -1 : 0), stdout: r.stdout || "", stderr: (r.stderr || "") + (r.error ? String(r.error) : "") };
}
// No terminal is attached under the scheduler: a credential problem has to
// fail the command, not wait on a prompt nobody will answer.
const git = (...args) => run(tool("git", "git"), ["-C", UI, ...args], { env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
const nodeScript = (script, args = [], opts = {}) => run(tool("node", process.execPath), [path.join(DIR, script), ...args], { cwd: UI, ...opts });

let LOG_FILE = null;
function log(...parts) {
  const line = `${new Date().toISOString()} ${parts.join(" ")}`;
  console.log(line);
  if (LOG_FILE) fs.appendFileSync(LOG_FILE, line + "\n");
}

export function hq(args) {
  const bin = tool("hq", path.join(os.homedir(), "Desktop", "skai-hq-main", "hq.cmd"));
  if (!fs.existsSync(bin)) return { status: -1, stdout: "", stderr: "hq.cmd not found" };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "figma-watch-hq-"));
  const argv = args.map((a) => {
    if (a && typeof a === "object") {
      const f = path.join(dir, a.file);
      fs.writeFileSync(f, a.text);
      return `"${f}"`;
    }
    return /^[A-Za-z0-9@._:\\/-]+$/.test(a) ? a : `"${hqText(a, 200)}"`;
  });
  const r = run("cmd.exe", ["/d", "/s", "/c", `""${bin}" ${argv.join(" ")}"`], { windowsVerbatimArguments: true });
  fs.rmSync(dir, { recursive: true, force: true });
  if (r.status !== 0 || /not running/i.test(r.stdout + r.stderr)) log("hq:", hqText(r.stdout + r.stderr, 300));
  return r;
}

function recordCalls(figmaCalls, kind, note) {
  const at = new Date().toISOString();
  for (const c of figmaCalls) {
    const k = c.name === CREATE_SESSION ? "session" : kind;
    fs.appendFileSync(PENDING, JSON.stringify({ at, day: at.slice(0, 10), kind: k, file: c.input?.fileKey || "", calls: 1, frames: 0, ok: c.answered !== false, note: `Figma watch ${note}` }) + "\n");
  }
}
const pendingLines = () => readLedger(PENDING);

/** Run jobs through the headless executor, in batches; returns [{job, payload, why}]. */
function execute(jobs, kind, runDir) {
  const claude = tool("claude", "claude");
  const out = [];
  let stray = [];
  for (let i = 0; i < jobs.length; i += BATCH_JOBS) {
    const batch = jobs.slice(i, i + BATCH_JOBS);
    const tag = `${kind}-${String(i / BATCH_JOBS + 1).padStart(2, "0")}`;
    // The user settings run bypassPermissions and pre-allow writes on several
    // servers (Supabase SQL and migrations among them). A deny rule wins over
    // both, so every server but Figma's is denied by name; anything that still
    // gets called is caught below as a stray.
    const r = run(
      claude,
      [
        "-p", "--model", EXEC_MODEL, "--tools", "ToolSearch", "--output-format", "stream-json", "--verbose", "--no-session-persistence",
        "--permission-mode", "bypassPermissions", "--disallowedTools", ...DENIED_SERVERS,
      ],
      { input: execPrompt(batch), cwd: runDir, timeout: 15 * 60 * 1000 },
    );
    fs.writeFileSync(path.join(runDir, `${tag}.jsonl`), r.stdout);
    if (r.stderr.trim()) fs.writeFileSync(path.join(runDir, `${tag}.err`), r.stderr);
    const parsed = parseTranscript(r.stdout);
    recordCalls(parsed.figmaCalls, kind, `${kind} ${[...new Set(batch.map((j) => j.fileKey))].join(" ")}`);
    const m = matchJobs(batch, parsed);
    stray = stray.concat(m.stray, parsed.uses.filter((u) => !EXEC_TOOLS.has(u.name)));
    log(`executor ${tag}: ${m.results.filter((x) => x.payload).length}/${batch.length} jobs answered, ${parsed.figmaCalls.length} Figma call(s), cost ${parsed.cost ?? "?"}`);
    out.push(...m.results);
  }
  return { results: out, stray };
}

// ── the pass ────────────────────────────────────────────────────────────────

class Stop extends Error {
  constructor(kind, msg, detail = "") {
    super(msg);
    this.kind = kind; // "skip" (quiet), "retry" (count toward a hand-off), "handoff" (HQ now)
    this.detail = detail;
  }
}

function preflight(here, noSync) {
  const sup = git("rev-parse", "--show-superproject-working-tree").stdout.trim();
  if (sup) throw new Stop("handoff", `refusing to run inside a superproject checkout (${sup}): the watch runs in its own clone`);
  if (!here && path.resolve(UI).toLowerCase() !== path.resolve(CLONE).toLowerCase())
    throw new Stop("handoff", `this copy is at ${UI}, not the watch clone ${CLONE}; pass --here to run it anyway`);
  // --no-sync (with --dry): test a pass against the checkout exactly as it
  // stands, e.g. a scratch clone with its catalog rolled back to replay a harvest.
  if (noSync) return;
  const branch = git("rev-parse", "--abbrev-ref", "HEAD").stdout.trim();
  if (branch !== "main") throw new Stop("handoff", `the clone is on ${branch}, not main`);
  if (git("status", "--porcelain").stdout.trim()) throw new Stop("handoff", "the clone has uncommitted changes from an earlier pass; inspect or reset it", git("status", "--short").stdout);
  const f = git("fetch", "-q", "origin", "main");
  if (f.status !== 0) throw new Stop("retry", `git fetch failed: ${f.stderr.trim()}`);
  if (git("rev-list", "origin/main..HEAD").stdout.trim()) throw new Stop("handoff", "the clone holds a commit origin/main does not; an earlier push failed");
  const m = git("merge", "-q", "--ff-only", "origin/main");
  if (m.status !== 0) throw new Stop("handoff", `fast-forward to origin/main failed: ${m.stderr.trim()}`);
}

function peerBusy() {
  if (!fs.existsSync(path.join(SHARED_UI, "figma-catalog"))) return null;
  const g = (...a) => run(tool("git", "git"), ["-C", SHARED_UI, ...a]);
  const dirty = g("status", "--porcelain", "--", "figma-catalog", "figma/ledger").stdout.trim();
  if (dirty) return `the shared tree has uncommitted catalog work:\n${dirty.split(/\r?\n/).slice(0, 8).join("\n")}`;
  const ahead = g("rev-list", "origin/main..HEAD", "--", "figma-catalog").stdout.trim();
  if (ahead) return "the shared tree has an unpushed catalog commit";
  return null;
}

function budgetCheck(need) {
  const day = utcDay();
  const used = callsOn([...readLedger(LEDGER), ...pendingLines()], day);
  const left = budgetFrom() - used;
  if (left - need < MIN_LEFT) throw new Stop("skip", `budget: ${used} Figma call(s) spent on ${day} (UTC), ${left} left, a pass needs ${need} and keeps ${MIN_LEFT} for sessions`);
  return left;
}

function fileKeys(manifest) {
  return [...new Set(manifest.pages.map((p) => p.fileKey))];
}

function sectionsOf(pageKeys) {
  const snap = readJson(path.join(DIR, "snapshot.live.json"), {});
  const reg = readJson(path.join(DIR, "registry.json"), {});
  const fileOf = (s) => reg.sectionFile?.[s];
  const out = new Set();
  for (const [s, v] of Object.entries(snap)) if (pageKeys.has(`${fileOf(s)}|${v.pageId}`)) out.add(s);
  return { sections: out, fileOf };
}

function today() {
  return utcDay();
}

function flushLedger() {
  const lines = fs.existsSync(PENDING) ? fs.readFileSync(PENDING, "utf8").split(/\r?\n/).filter((l) => l.trim()) : [];
  for (const l of lines) {
    try {
      appendLine(LEDGER, JSON.parse(l));
    } catch {
      appendLine(LEDGER, { at: new Date().toISOString(), day: today(), kind: "watch", file: "", calls: 1, frames: 0, ok: false, note: "Figma watch: a pending line that did not parse" });
    }
  }
  return lines.length;
}

function commitAndPush(subject, body) {
  const changed = git("status", "--porcelain").stdout.split(/\r?\n/).filter(Boolean).map((l) => l.slice(3).replace(/^"|"$/g, ""));
  const outside = changed.filter((p) => !p.startsWith("figma-catalog/") && p !== "figma/ledger/calls.jsonl");
  if (outside.length) throw new Stop("handoff", `the pass changed files outside the catalog: ${outside.join(", ")}`);
  if (!changed.length) return null;
  const add = git("add", "--", ...changed);
  if (add.status !== 0) throw new Stop("handoff", `git add failed: ${add.stderr}`);
  const c = git("commit", "-q", "-m", subject, "-m", body);
  if (c.status !== 0) throw new Stop("handoff", `git commit failed: ${c.stderr}`);
  const sha = git("rev-parse", "--short", "HEAD").stdout.trim();
  let p = git("push", "-q", "origin", "HEAD:main");
  if (p.status !== 0) {
    // Someone pushed in between. A rebase of derived files is not safe to
    // resolve by hand here: drop the commit and let the next pass redo it on
    // top of theirs. The pending calls stay pending, so nothing is lost.
    git("reset", "-q", "--hard", "origin/main");
    throw new Stop("retry", `push refused (${p.stderr.trim().split(/\r?\n/).pop()}); the pass is dropped and re-runs on the new main`);
  }
  fs.rmSync(PENDING, { force: true });
  return sha;
}

function handoff(state, key, title, body) {
  state.handoffs = state.handoffs || {};
  const prior = state.handoffs[key];
  if (prior?.hq) {
    const shown = hq(["show", prior.hq]).stdout;
    if (/^state\s+(blocked|triaged|open|active|in[- ]progress)/im.test(shown)) {
      log(`hand-off already open as ${prior.hq}: ${title}`);
      return prior.hq;
    }
  }
  const a = hq(["add", title, "--body-file", { file: "body.txt", text: body }, "--as", HQ_AS]);
  const id = (a.stdout.match(/HQ-\d+/) || [])[0] || null;
  if (id) hq(["block", id, "--reason-file", { file: "reason.txt", text: body.slice(0, 3800) }, "--as", HQ_AS]);
  log(`hand-off ${id || "(HQ unavailable, logged only)"}: ${title}`);
  state.handoffs[key] = { hq: id, at: new Date().toISOString(), title };
  return id;
}

function pass({ dry, here, noSync }, state) {
  preflight(here, noSync);
  const busy = peerBusy();
  if (busy) throw new Stop("skip", `skipped: ${busy}`);

  const manifest = readJson(path.join(DIR, "live", "_pages.json"));
  const files = fileKeys(manifest);
  budgetCheck(files.length + 1);

  const runDir = path.join(HOME, "runs", new Date().toISOString().replace(/[:.]/g, "-"));
  fs.mkdirSync(runDir, { recursive: true });

  // 1. hash every page
  const vjobs = files.map((fk) => ({ fileKey: fk, code: verifyScript(fk) }));
  const vres = execute(vjobs, "verify", runDir);
  if (vres.stray.length) throw new Stop("handoff", "the executor called a tool, or ran Figma code, it was not given; check the file's history for edits", strayText(vres.stray).slice(0, 3000));
  const failed = vres.results.filter((r) => !r.payload || r.payload.verify !== 1 || r.payload.fileKey !== r.job.fileKey);
  if (failed.length) throw new Stop("retry", `the verify read failed for ${failed.map((f) => `${f.job.fileKey} (${f.why || "not a verify payload"})`).join(", ")}`);
  const docs = vres.results.map((r) => r.payload);
  const vfiles = docs.map((d) => {
    const f = path.join(runDir, `verify-${d.fileKey}.json`);
    writeJson(f, d);
    return f;
  });
  const { equal, changed, unknown } = compareVerify(docs, manifest);
  const seen = new Set(docs.flatMap((d) => d.pages.map((p) => `${d.fileKey}|${p[0]}`)));
  const vanished = manifest.pages.filter((p) => !seen.has(`${p.fileKey}|${p.pageId}`));
  log(`verify: ${equal.length} page(s) equal, ${changed.length} changed, ${unknown.length} new, ${vanished.length} vanished`);
  state.failStreak = 0;

  const handoffs = [];
  // One hand-off per kind per pass, however many pages it names: a file that
  // gains thirty pages at once (the Hacksaw set, 2026-11) is one decision.
  if (vanished.length)
    handoffs.push(
      `${vanished.length} catalogued page(s) are in the manifest but no longer in their file: deleted, or moved to another file. Their frames keep their rows until someone decides.\n` +
        vanished.map((v) => `- ${hqText(v.pageName, 80)} (${v.fileKey} ${v.pageId}, ${v.n} top-level nodes, scope ${v.scope})`).join("\n") +
        `\nRecommended: find where each went before anything is removed.`,
    );

  if (!changed.length && !unknown.length) {
    const oldest = manifest.pages.filter((p) => files.includes(p.fileKey)).map((p) => p.harvestedAt || "").sort()[0] || "";
    const ageDays = oldest ? (Date.parse(today()) - Date.parse(oldest)) / 864e5 : Infinity;
    if (ageDays < STAMP_EVERY_DAYS && !handoffs.length) return { result: "unchanged" };
    if (dry) return { result: "unchanged (a stamp is due; dry run)" };
    nodeScript("harvest.mjs", ["verify-ingest", ...vfiles, "--write"]);
    regenerate();
    flushLedger();
    const sha = commitAndPush(`chore(figma): watch ${today()}, all ${equal.length} pages of the ${files.length} files hash-checked equal`, `No page moved since the last harvest; the pages are stamped harvested ${today()} and the watch's Figma calls are recorded in the ledger.`);
    for (const h of handoffs) handoff(state, sha1(h), "Figma watch: a catalogued page vanished from its file", h);
    return { result: `unchanged, stamped${sha ? ` in ${sha}` : ""}` };
  }

  // 2. re-read the changed pages whole
  const changedKeys = new Set([...changed, ...unknown].map((c) => `${c.fileKey}|${c.pageId}`));
  const hjobs = [];
  for (const fk of files) {
    const mine = [...changedKeys].filter((k) => k.startsWith(`${fk}|`)).map((k) => k.split("|")[1]);
    if (!mine.length) continue;
    const plan = nodeScript("harvest.mjs", ["plan", "--file", fk, "--counts", vfiles[files.indexOf(fk)]]);
    for (const chunk of parsePlan(plan.stdout)) if (chunk.some(([pid]) => mine.includes(pid))) hjobs.push({ fileKey: fk, code: chunkScript(fk, chunk) });
  }
  budgetCheck(hjobs.length + Math.ceil(hjobs.length / BATCH_JOBS) + files.length + 1);
  const hres = execute(hjobs, "harvest", runDir);
  if (hres.stray.length) throw new Stop("handoff", "the executor called a tool, or ran Figma code, it was not given; check the file's history for edits", strayText(hres.stray).slice(0, 3000));
  const hfail = hres.results.filter((r) => !r.payload || r.payload.harvest !== 1);
  if (hfail.length) throw new Stop("retry", `${hfail.length} harvest read(s) failed: ${hfail[0].why}`);
  const hfiles = hres.results.map((r, i) => {
    const f = path.join(runDir, `harvest-${String(i + 1).padStart(2, "0")}.json`);
    writeJson(f, r.payload);
    return f;
  });
  for (const d of docs) {
    const pages = d.pages.filter((p) => changedKeys.has(`${d.fileKey}|${p[0]}`));
    const bad = pagesNotMatchingVerify(hres.results.filter((r) => r.payload.fileKey === d.fileKey).map((r) => r.payload), pages);
    if (bad.length) throw new Stop("retry", `page(s) ${bad.map((b) => b.pageId).join(", ")} moved between the hash and the read; the next pass reads them again`);
  }
  const ing = nodeScript("harvest.mjs", ["ingest", ...hfiles, "--write"]);
  fs.writeFileSync(path.join(runDir, "ingest.log"), ing.stdout + ing.stderr);
  const refusedN = +((ing.stdout.match(/(\d+) refused/) || [])[1] || 0);
  if (ing.status !== 0 || refusedN) throw new Stop("handoff", `harvest ingest refused ${refusedN} page(s)`, ing.stdout.slice(-3000));
  nodeScript("harvest.mjs", ["verify-ingest", ...vfiles, "--write"]);

  // ...and probe what is no longer top-level
  const pjobs = [];
  for (const fk of files) {
    if (![...changedKeys].some((k) => k.startsWith(`${fk}|`))) continue;
    const ps = nodeScript("harvest.mjs", ["probe-script", "--file", fk]);
    if (ps.stdout.trim()) pjobs.push({ fileKey: fk, code: ps.stdout.trimEnd() });
  }
  if (pjobs.length) {
    budgetCheck(pjobs.length + 1);
    const pres = execute(pjobs, "probe", runDir);
    if (pres.stray.length) throw new Stop("handoff", "the executor called a tool, or ran Figma code, it was not given", strayText(pres.stray).slice(0, 3000));
    const pfail = pres.results.filter((r) => !r.payload || r.payload.probe !== 1);
    if (pfail.length) throw new Stop("retry", `the probe read failed: ${pfail[0].why}`);
    const pfiles = pres.results.map((r, i) => {
      const f = path.join(runDir, `probe-${i + 1}.json`);
      writeJson(f, r.payload);
      return f;
    });
    nodeScript("harvest.mjs", ["probe-ingest", ...pfiles, "--write"]);
  }

  // 3. drift, and what may fold
  const drift = nodeScript("pipeline.mjs", ["drift"]);
  fs.writeFileSync(path.join(runDir, "drift.log"), drift.stdout + drift.stderr);
  if (drift.status !== 0) throw new Stop("handoff", "the drift pass stopped (a capture was refused or a section failed validation)", drift.stdout.slice(-3000) + drift.stderr.slice(-1000));
  const { sections, fileOf } = sectionsOf(changedKeys);
  const resolved = readJson(path.join(DIR, "live", "_resolved.json"), {});
  const goneIds = new Set(Object.entries(resolved.notFound || {}).map(([id, v]) => `${v.fileKey}|${id}`));
  const todo = parseTodo(fs.readFileSync(path.join(DIR, "figma-todo.live.tsv"), "utf8"));
  const { dirty, gone, retitled } = classifyDrift(todo, sections, goneIds, fileOf);
  if (dirty.size)
    handoffs.push(
      `${dirty.size} section(s) changed in Figma in a way the watch does not fold on its own, so they were left unfolded (their live read is committed and figma-todo.live.tsv lists the rows):\n` +
        [...dirty].map(([s, whys]) => `${s}:\n${whys.map((w) => `- ${w}`).join("\n")}`).join("\n") +
        `\nRecommended: follow the figma-catalog skill's drift steps for these rows (a RETARGET keeps the work on the new id; a REMOVED-WITH-WORK needs the code checked before the row goes), then run the catalog.`,
    );
  if (unknown.length)
    handoffs.push(
      `${unknown.length} new page(s) were harvested and entered with a provisional scope, so they are reported but not counted:\n` +
        unknown.map((u) => `- ${hqText(u.pageName, 80)} (${u.fileKey} ${u.pageId}, ${u.n} top-level nodes)`).join("\n") +
        `\nRecommended: rule their scope (in-scope, wip, excluded or tombstone; pages that share a template can be ruled together). An in-scope page then needs a section (harvest.mjs section) and its build-registry entries.`,
    );
  const copies = changed.filter((c) => manifest.pages.find((p) => p.fileKey === c.fileKey && p.pageId === c.pageId)?.scope === "tombstone");
  if (copies.length)
    handoffs.push(
      `${copies.length} tombstone cop(ies) changed: the designer has started editing a page the catalog counts on its original.\n` +
        copies.map((c) => `- ${hqText(c.pageName, 80)} (${c.fileKey} ${c.pageId}, ${c.wasN} to ${c.n})`).join("\n") +
        `\nRecommended: diff each against its original before building anything from it, then rule whether it stays a tombstone.`,
    );
  const clean = [...sections].filter((s) => !dirty.has(s));
  log(`drift: ${clean.length} section(s) to fold (${clean.join(", ") || "none"}), ${dirty.size} handed off, ${gone.length} gone, ${retitled.length} retitled`);

  // 4. fold
  const headRegistry = JSON.parse(git("show", "HEAD:figma-catalog/registry.json").stdout || "{}");
  if (clean.length) {
    const fold = nodeScript("snapshot-to-nodes.mjs", [path.join(DIR, "snapshot.live.json"), "--only", clean.join(","), "--write"]);
    fs.writeFileSync(path.join(runDir, "fold.log"), fold.stdout + fold.stderr);
    if (fold.status !== 0 || /REFUSED/.test(fold.stdout)) throw new Stop("handoff", "snapshot-to-nodes refused a section the drift pass passed", fold.stdout.slice(-3000));
  }
  if (gone.length) {
    const aliases = path.join(DIR, "bugref-aliases.tsv");
    const eol = fs.readFileSync(aliases, "utf8").includes("\r\n") ? "\r\n" : "\n";
    const lines = [`# ${today()} (Figma watch): certified gone by the probe after loading every page; no work was recorded on them.`, ...gone.map((g) => `${g.id}\t-\tgone\t0\t0\t-`)];
    fs.appendFileSync(aliases, lines.join(eol) + eol);
    const gp = path.join(DIR, "gaps.tsv");
    const gt = fs.readFileSync(gp, "utf8");
    const parsed = parseGaps(gt);
    const drop = new Set(gone.map((g) => `${fileOf(g.section)}|${g.id}`));
    const kept = parsed.rows.filter((r) => !drop.has(`${r.fileKey}|${r.node}`));
    if (kept.length !== parsed.rows.length) fs.writeFileSync(gp, formatGaps(kept));
  }
  regenerate();
  const items = missingGapLines(readJson(path.join(DIR, "coverage.json")), readJson(path.join(DIR, "registry.json")), fs.readFileSync(path.join(DIR, "gaps.tsv"), "utf8"));
  if (items.length) {
    const lf = path.join(runDir, "gap-lines.json");
    writeJson(lf, items);
    const gf = nodeScript("gaps.mjs", ["fold", lf, "--write", "--at", today()]);
    if (/[1-9]\d* refused/.test(gf.stdout)) throw new Stop("handoff", "gaps.mjs refused a default gap line", gf.stdout.slice(-2000));
    regenerate();
  }
  const drift2 = nodeScript("pipeline.mjs", ["drift"]);
  if (drift2.status !== 0) throw new Stop("handoff", "the drift pass after the fold stopped", drift2.stdout.slice(-3000));
  const check = nodeScript("pipeline.mjs", ["--check"]);
  fs.writeFileSync(path.join(runDir, "check.log"), check.stdout + check.stderr);
  if (check.status !== 0) throw new Stop("handoff", "pipeline.mjs --check failed after the fold", check.stdout.slice(-3000));

  // 5. guard the record
  const allowTitle = new Set(retitled.map((r) => `${fileOf(r.section)}|${r.id}`));
  const moved = guardRegistry(headRegistry, readJson(path.join(DIR, "registry.json")), allowTitle);
  if (moved.length) throw new Stop("handoff", `the fold moved ${moved.length} guarded field(s) on surviving frames; nothing was committed`, moved.slice(0, 40).join("\n"));

  if (dry) {
    git("checkout", "-q", "--", ".");
    git("clean", "-qfd", "--", "figma-catalog");
    return { result: `dry run: would fold ${clean.join(", ") || "nothing"}; ${handoffs.length} hand-off(s)`, handoffs };
  }

  // 6. commit, push, report
  const summary = changeSummary(changed, unknown);
  const added = Object.keys(readJson(path.join(DIR, "registry.json")).frames).length - Object.keys(headRegistry.frames || {}).length;
  const hqAdd = hq(["add", `Figma watch: fold ${summary}`, "--as", HQ_AS]);
  const hqId = (hqAdd.stdout.match(/HQ-\d+/) || [])[0] || null;
  const subject = `chore(figma): watch ${today()}, ${summary}${hqId ? ` (${hqId})` : ""}`.slice(0, 200);
  const body = [
    `Folded by the Figma watch. ${equal.length} page(s) hashed equal, ${changed.length} changed, ${unknown.length} new.`,
    `Sections folded: ${clean.join(", ") || "none"}. Registry frames ${added >= 0 ? "+" : ""}${added}.`,
    gone.length ? `Certified gone and recorded: ${gone.map((g) => g.id).join(", ")}.` : "",
    retitled.length ? `Renamed in Figma: ${retitled.map((r) => r.id).join(", ")}.` : "",
    items.length ? `${items.length} new open frame(s) got the default public gap line.` : "",
    dirty.size ? `Left for a person: ${[...dirty.keys()].join(", ")} (see figma-todo.live.tsv).` : "",
  ]
    .filter(Boolean)
    .join("\n");
  flushLedger();
  const sha = commitAndPush(subject, body);
  if (hqId) {
    hq(["progress", hqId, "--as", HQ_AS, "--start", "--step", "Folded and pushed", "--steps", "1/1", "--note-file", { file: "note.txt", text: body }]);
    if (sha) hq(["close", hqId, "--done", "--commit", `skai-ui@${sha}`, "--note-file", { file: "note.txt", text: body }, "--as", HQ_AS]);
  }
  for (const h of handoffs) handoff(state, sha1(h), `Figma watch needs a decision: ${hqText(h.split("\n")[0], 110)}`, h);
  return { result: `folded ${summary}${sha ? ` in ${sha}` : ""}`, handoffs };
}

const strayText = (list) => list.map((s) => s.input?.code ?? `${s.name} ${JSON.stringify(s.input ?? {}).slice(0, 300)}`).join(`${"\n"}----${"\n"}`);
const sha1 = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);

function regenerate() {
  const r = nodeScript("pipeline.mjs");
  if (r.status !== 0) throw new Stop("handoff", "pipeline.mjs failed while regenerating the catalog", r.stdout.slice(-3000) + r.stderr.slice(-1000));
}

function cmdRun(args) {
  fs.mkdirSync(path.join(HOME, "logs"), { recursive: true });
  LOG_FILE = path.join(HOME, "logs", `${today().slice(0, 7)}.log`);
  if (fs.existsSync(PAUSED)) {
    log(`paused: ${fs.readFileSync(PAUSED, "utf8").trim() || "no reason given"}`);
    return 0;
  }
  try {
    fs.writeFileSync(LOCK, String(process.pid), { flag: "wx" });
  } catch {
    const age = Date.now() - fs.statSync(LOCK).mtimeMs;
    if (age < 2 * 3600 * 1000) {
      log("another pass holds the lock; skipped");
      return 0;
    }
    fs.writeFileSync(LOCK, String(process.pid));
  }
  const state = readJson(STATE, {});
  const opts = { dry: args.includes("--dry"), here: args.includes("--here"), noSync: args.includes("--no-sync") };
  if (opts.noSync && !opts.dry) {
    log("--no-sync is for a dry run only; nothing done");
    return 1;
  }
  try {
    const r = pass(opts, state);
    log(`pass: ${r.result}`);
    if (opts.dry) for (const h of r.handoffs || []) log(`would hand off:\n${h}`);
    state.last = { at: new Date().toISOString(), result: r.result };
    return 0;
  } catch (e) {
    if (!(e instanceof Stop)) e = new Stop("handoff", `unexpected error: ${e.stack || e}`);
    log(`stop (${e.kind}): ${e.message}`);
    if (e.detail) log(e.detail.split(/\r?\n/).slice(0, 30).join("\n"));
    state.last = { at: new Date().toISOString(), result: `stopped (${e.kind}): ${e.message}` };
    if (opts.dry) {
      // a dry run reports to its log only
    } else if (e.kind === "retry") {
      state.failStreak = (state.failStreak || 0) + 1;
      if (state.failStreak >= FAILS_BEFORE_HANDOFF) handoff(state, `retry-${sha1(e.message.replace(/\d+/g, "#"))}`, "Figma watch keeps failing", `${state.failStreak} passes in a row stopped: ${e.message}\n\n${e.detail}\n\nLogs: ${LOG_FILE}`);
    } else if (e.kind === "handoff") {
      handoff(state, sha1(e.message), `Figma watch stopped: ${hqText(e.message, 110)}`, `${e.message}\n\n${e.detail}\n\nNothing was committed. Logs: ${LOG_FILE}\nThe clone is ${CLONE}; once resolved, a clean clone (git status empty, no unpushed commit) lets the next pass run.`);
    }
    return e.kind === "skip" ? 0 : 1;
  } finally {
    writeJson(STATE, state);
    fs.rmSync(LOCK, { force: true });
    for (const d of fs.existsSync(path.join(HOME, "runs")) ? fs.readdirSync(path.join(HOME, "runs")) : []) {
      const p = path.join(HOME, "runs", d);
      if (Date.now() - fs.statSync(p).mtimeMs > 30 * 864e5) fs.rmSync(p, { recursive: true, force: true });
    }
  }
}

function cmdStatus() {
  const state = readJson(STATE, {});
  const pending = pendingLines();
  console.log(`home      ${HOME}`);
  console.log(`clone     ${fs.existsSync(CLONE) ? CLONE : "(not installed)"}`);
  console.log(`paused    ${fs.existsSync(PAUSED) ? fs.readFileSync(PAUSED, "utf8").trim() || "yes" : "no"}`);
  console.log(`last pass ${state.last ? `${state.last.at}  ${state.last.result}` : "(none)"}`);
  console.log(`pending   ${pending.length} Figma call(s) not yet in the ledger`);
  for (const [, h] of Object.entries(state.handoffs || {})) console.log(`hand-off  ${h.hq || "(no HQ id)"}  ${h.at}  ${h.title}`);
  const t = run("schtasks.exe", ["/Query", "/TN", TASK_NAME, "/FO", "LIST"]);
  console.log(t.status === 0 ? t.stdout.split(/\r?\n/).filter((l) => /Next Run|Status|Last Run|Last Result/.test(l)).join("\n") : `task      ${TASK_NAME} is not registered`);
  return 0;
}

function cmdPause(args) {
  fs.mkdirSync(HOME, { recursive: true });
  fs.writeFileSync(PAUSED, args.join(" ") || `paused ${new Date().toISOString()}`);
  console.log(`paused: the scheduled pass does nothing until \`node figma-catalog/watch.mjs resume\``);
  return 0;
}
function cmdResume() {
  fs.rmSync(PAUSED, { force: true });
  console.log("resumed");
  return 0;
}

function which(name) {
  const r = run("where.exe", [name]);
  const hits = r.stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return hits.find((h) => /\.exe$/i.test(h)) || hits[0] || null;
}

function cmdInstall(args) {
  const every = +(args[args.indexOf("--every-hours") + 1] || 0) || 6;
  fs.mkdirSync(path.join(HOME, "logs"), { recursive: true });
  const gitBin = which("git");
  const claude = which("claude");
  if (!gitBin || !claude) {
    console.error(`install: need git and claude on PATH (git ${gitBin}, claude ${claude})`);
    return 1;
  }
  if (!fs.existsSync(path.join(CLONE, ".git"))) {
    const c = run(gitBin, ["clone", "-q", "--branch", "main", REMOTE, CLONE]);
    if (c.status !== 0) {
      console.error(`install: clone failed: ${c.stderr}`);
      return 1;
    }
  }
  // The global helper for github.com is `gh auth git-credential`, which fails
  // with no terminal attached (the first scheduled pass, 2026-11-28: "could not
  // read Password"). The shared tree's skai-ui pushes through the Windows
  // credential manager; the clone does the same.
  run(gitBin, ["-C", CLONE, "config", "--local", "--replace-all", "credential.https://github.com.helper", ""]);
  run(gitBin, ["-C", CLONE, "config", "--local", "--add", "credential.https://github.com.helper", "manager"]);
  // A dry-run push to a ref that does not exist proves the credential without
  // caring whether the clone is behind main, and creates nothing.
  const probe = run(gitBin, ["-C", CLONE, "push", "--dry-run", "-q", "origin", "HEAD:refs/heads/figma-watch-auth-probe"], { env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
  if (probe.status !== 0) {
    console.error(`install: the clone cannot push without a prompt: ${probe.stderr.trim()}`);
    return 1;
  }
  const hqBin = path.join(os.homedir(), "Desktop", "skai-hq-main", "hq.cmd");
  writeJson(CONFIG, { node: process.execPath, git: gitBin, claude, hq: fs.existsSync(hqBin) ? hqBin : null });
  const script = path.join(CLONE, "figma-catalog", "watch.mjs");
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(Math.ceil((start.getHours() + 1) / every) * every);
  const ps = [
    `$a = New-ScheduledTaskAction -Execute 'C:\\Windows\\System32\\conhost.exe' -Argument '--headless "${process.execPath}" "${script}" run' -WorkingDirectory '${CLONE}'`,
    `$t = New-ScheduledTaskTrigger -Once -At ([datetime]'${start.toISOString()}') -RepetitionInterval (New-TimeSpan -Hours ${every})`,
    `$s = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 1)`,
    `Register-ScheduledTask -TaskName '${TASK_NAME}' -Action $a -Trigger $t -Settings $s -Description 'Checks the Figma files every ${every} hours and folds design changes into the skai-ui catalog (figma-catalog/watch.mjs).' -Force | Out-Null`,
  ].join("; ");
  const r = run("pwsh.exe", ["-NoProfile", "-NonInteractive", "-Command", ps]);
  if (r.status !== 0) {
    console.error(`install: Register-ScheduledTask failed: ${r.stderr || r.stdout}`);
    return 1;
  }
  console.log(`installed: clone ${CLONE}; task "${TASK_NAME}" every ${every} hours from ${start.toLocaleString()}; logs ${path.join(HOME, "logs")}`);
  return 0;
}

// ── self-test ───────────────────────────────────────────────────────────────

function selfTest() {
  let pass = 0;
  let fail = 0;
  const t = (name, ok) => {
    if (ok) pass++;
    else {
      fail++;
      console.log(`  FAIL  ${name}`);
    }
    if (ok) console.log(`  PASS  ${name}`);
  };
  const job = { fileKey: "testFile", code: "return 1;\n" };
  const line = (o) => JSON.stringify(o);
  const tx = [
    line({ type: "system", subtype: "init" }),
    line({ type: "assistant", message: { content: [{ type: "tool_use", id: "s", name: CREATE_SESSION, input: { fileKey: job.fileKey } }] } }),
    line({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: "s", content: '{"sessionId":"x"}' }] } }),
    line({ type: "assistant", message: { content: [{ type: "tool_use", id: "a", name: USE_FIGMA, input: { fileKey: job.fileKey, code: "return 1;" } }] } }),
    line({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: "a", content: [{ type: "text", text: '{"verify":1}' }] }] } }),
    line({ type: "assistant", message: { content: [{ type: "tool_use", id: "b", name: USE_FIGMA, input: { fileKey: job.fileKey, code: "figma.root.remove()" } }] } }),
    line({ type: "result", subtype: "success", total_cost_usd: 0.01 }),
    "not json",
  ].join("\n");
  const p = parseTranscript(tx);
  t("parseTranscript reads tool calls and their results, and counts an unanswered Figma call", p.calls.length === 2 && p.figmaCalls.length === 3 && p.ok && p.cost === 0.01);
  const m = matchJobs([job], p);
  t("matchJobs pairs a job with the call that ran its exact code (trailing space aside)", m.results[0].payload?.verify === 1);
  const p2 = parseTranscript(tx.replace("figma.root.remove()", "return 1;").replace('"id":"b"', '"id":"b2"'));
  t("matchJobs names no stray when every call ran a job's code", matchJobs([job], p2).stray.length === 0);
  const strayTx = [
    line({ type: "assistant", message: { content: [{ type: "tool_use", id: "c", name: USE_FIGMA, input: { fileKey: job.fileKey, code: "figma.root.remove()" } }] } }),
    line({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: "c", content: "ok" }] } }),
  ].join("\n");
  const ms = matchJobs([job], parseTranscript(strayTx));
  t("matchJobs reports a call with code it was not given as stray, and the job as never run", ms.stray.length === 1 && ms.results[0].payload === null);
  const edited = matchJobs([job], parseTranscript(strayTx.replace("figma.root.remove()", "return 2;")));
  t("a job whose code came back changed is not answered", edited.results[0].payload === null && edited.stray.length === 1);
  const errTx = [
    line({ type: "assistant", message: { content: [{ type: "tool_use", id: "d", name: USE_FIGMA, input: { fileKey: job.fileKey, code: job.code } }] } }),
    line({ type: "user", message: { content: [{ type: "tool_result", tool_use_id: "d", is_error: true, content: "rate limited" }] } }),
  ].join("\n");
  t("an error result is not a payload", /error/.test(matchJobs([job], parseTranscript(errTx)).results[0].why));
  const offTx = line({ type: "assistant", message: { content: [{ type: "tool_use", id: "e", name: "mcp__plugin_supabase_supabase__execute_sql", input: { query: "select 1" } }] } });
  t("a call to any tool but the three an executor may use is found", parseTranscript(offTx).uses.filter((u) => !EXEC_TOOLS.has(u.name)).length === 1);
  t("the Figma server is not on the deny list, and the database server is", !DENIED_SERVERS.some((d) => USE_FIGMA.startsWith(d)) && DENIED_SERVERS.includes("mcp__plugin_supabase_supabase"));

  t("execPrompt carries each job's code between its markers", execPrompt([job, { ...job, code: "return 2;" }]).includes("CODE BEGIN\nreturn 2;\nCODE END"));
  t(
    "parsePlan reads the numbered chunk lines and nothing else",
    JSON.stringify(parsePlan('plan: x\n   1  [["15003:57848",0,null]]\n      15003:57848 Thumbnail\n   2  [["4914:113562",0,111],["1:2",0,null]]\n')) ===
      JSON.stringify([[["15003:57848", 0, null]], [["4914:113562", 0, 111], ["1:2", 0, null]]]),
  );

  const rowsA = "1:1\tA\tFRAME\t10\t10\t1\n1:2\tB\tFRAME\t10\t10\t1";
  const rowsB = "1:3\tC\tFRAME\t10\t10\t1";
  const h = fnv1a(rowsA + "\n" + rowsB);
  const hp = [{ chunks: [["9:9", "P", 3, 2, 3, rowsB]] }, { chunks: [["9:9", "P", 3, 0, 2, rowsA]] }];
  t("pagesNotMatchingVerify re-joins chunks in order and accepts the verify hash", pagesNotMatchingVerify(hp, [["9:9", "P", 3, h]]).length === 0);
  t("pagesNotMatchingVerify names a page whose rows hash differently", pagesNotMatchingVerify(hp, [["9:9", "P", 3, "deadbeef"]]).length === 1);
  t("pagesNotMatchingVerify names a page whose chunks leave a gap", pagesNotMatchingVerify([hp[0]], [["9:9", "P", 3, fnv1a(rowsB)]]).length === 1);

  const todo = parseTodo("section\tnodeId\tchange\ttitle\twhy\timplFiles\ns1\t1-1\tADDED\tNew\t\t\ns1\t1-2\tREMOVED\tOld\tgone\t\ns1\t1-3\tREMOVED\tOld2\tgone\t\ns2\t2-1\tREMOVED-WITH-WORK\tBuilt\tcode\tsrc/a.tsx\ns1\t1-4\tRETITLED\tNew name\twas: Old name\t\ns3\t3-1\tRETARGET\tX\ty\t\n");
  const fileOf = () => "F";
  const c = classifyDrift(todo, new Set(["s1", "s2"]), new Set(["F|1-2"]), fileOf);
  t("classifyDrift folds ADDED and a certified-gone REMOVED", c.gone.length === 1 && c.gone[0].id === "1-2");
  t("classifyDrift holds a REMOVED the probe did not certify", c.dirty.get("s1")?.length === 1 && /1-3/.test(c.dirty.get("s1")[0]));
  t("classifyDrift holds REMOVED-WITH-WORK", c.dirty.has("s2"));
  t("classifyDrift takes a RETITLED as a designer rename", c.retitled.length === 1 && c.retitled[0].was === "Old name");
  t("classifyDrift ignores sections whose pages did not change", !c.dirty.has("s3"));

  const before = { frames: { a: { fileKey: "F", node: "1", status: "done", implFiles: ["x"], title: "T" }, b: { fileKey: "F", node: "2", status: "unknown", title: "U" } } };
  const okAfter = { frames: { a: { fileKey: "F", node: "1", status: "done", implFiles: ["x"], title: "T", page: "renamed" }, c: { fileKey: "F", node: "3", title: "V" } } };
  t("guardRegistry passes a fold that only adds, drops and renames pages", guardRegistry(before, okAfter).length === 0);
  const badAfter = { frames: { a: { fileKey: "F", node: "1", status: "partial", implFiles: [], title: "T2" } } };
  t("guardRegistry names a moved status, implFiles and an unreported title", guardRegistry(before, badAfter).length === 3);
  t("guardRegistry lets a reported rename through", guardRegistry(before, badAfter, new Set(["F|1"])).length === 2);
  const spaced = { frames: { a: { ...before.frames.a, title: "Create course  (375 x 812px)" } } };
  const folded = { frames: { a: { ...before.frames.a, title: "Create course (375 x 812px)" } } };
  t("guardRegistry takes a whitespace-only title change as no change, as drift does", guardRegistry(spaced, folded).length === 0);

  t("every default gap line is plain by gaps.mjs's own rules", Object.entries(DEFAULT_LINES).every(([k, v]) => lineProblems(k, v).length === 0));
  t("hqText keeps HQ arguments ASCII and free of cmd.exe operators", hqText('🚧 Collectables > Home & "x" 100% | y') === "Collectables Home x 100 y");
  t("changeSummary names every page with its counts", changeSummary([{ pageName: "🚧 Collectables", wasN: 44, n: 134 }], [{ pageName: "New", n: 3 }]) === "Collectables 44 to 134, new page New (3)");

  console.log(`\nself-test: ${pass}/${pass + fail} passed.`);
  return fail ? 1 : 0;
}

const IS_MAIN = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const [cmd, ...rest] = process.argv.slice(2);
  const code =
    cmd === "run" ? cmdRun(rest)
    : cmd === "status" ? cmdStatus()
    : cmd === "pause" ? cmdPause(rest)
    : cmd === "resume" ? cmdResume()
    : cmd === "install" ? cmdInstall(rest)
    : cmd === "--self-test" ? selfTest()
    : (console.error("usage: node figma-catalog/watch.mjs run [--dry] [--here] | status | pause [reason] | resume | install [--every-hours 6] | --self-test"), 1);
  process.exitCode = code;
}
