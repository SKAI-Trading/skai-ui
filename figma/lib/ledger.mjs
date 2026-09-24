/**
 * ledger.mjs — ledger/calls.jsonl, one line per Figma call sync spent, and the
 * daily budget read from it.
 *
 * A line: {"at", "day" (UTC), "kind", "file", "calls", "frames", "nonce", "ok"}.
 * `calls` is 1 for a call that happened and 0 for a second ingest of a result
 * whose call is already counted. `ok` is false when the result was refused
 * (damaged in transcription, wrong file); the call still counts, because it
 * was spent. A line that does not parse counts as one call, so a damaged
 * ledger can only make the budget tighter.
 */
import fs from "node:fs";
import path from "node:path";

export const DEFAULT_BUDGET = 120;

export const utcDay = (d = new Date()) => d.toISOString().slice(0, 10);

export function budgetFrom(env = process.env) {
  const raw = env.FIGMA_DAILY_BUDGET;
  if (raw === undefined || raw === "") return DEFAULT_BUDGET;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) throw new Error(`FIGMA_DAILY_BUDGET must be a whole number, got ${JSON.stringify(raw)}`);
  return n;
}

export function readLedger(file) {
  if (!fs.existsSync(file)) return [];
  const out = [];
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      out.push({ day: null, calls: 1, damaged: true });
    }
  }
  return out;
}

/** Calls counted against a UTC day. A damaged line counts against every day. */
export function callsOn(lines, day) {
  let n = 0;
  for (const l of lines) {
    if (l.damaged) n += 1;
    else if (l.day === day) n += Number.isFinite(l.calls) ? l.calls : 1;
  }
  return n;
}

export class BudgetError extends Error {}

/**
 * Refuse when today's calls plus `need` would pass the budget. Returns how
 * many calls are left after `need`.
 */
export function assertBudget(lines, { day, budget, need = 1 }) {
  const used = callsOn(lines, day);
  if (used + need > budget) {
    throw new BudgetError(
      `refused: the ledger holds ${used} Figma call(s) for ${day} (UTC) against a budget of ${budget}; ` +
        `${Math.max(0, budget - used)} left, this needs ${need}. Set FIGMA_DAILY_BUDGET to change the cap.`,
    );
  }
  return budget - used - need;
}

/** How a result with this nonce was seen before: "ok", "refused" or null. */
export function nonceSeen(lines, nonce) {
  let seen = null;
  for (const l of lines) {
    if (l.nonce !== nonce) continue;
    if (l.ok) return "ok";
    seen = "refused";
  }
  return seen;
}

export function appendLine(file, entry) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(entry) + "\n");
}
