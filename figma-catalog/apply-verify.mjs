#!/usr/bin/env node
/**
 * apply-verify.mjs — fold figma-catalog/vverify.<section>.tsv (per-frame VISUAL
 * verification outcomes from the figma-match-100 screenshot loop) back into
 * registry.json at the FRAME level. Mirrors apply-status.mjs.
 *
 * This is distinct from the existing _verify.<section>.tsv / VERIFY_BRIEF.md
 * scaffold, which records CODE-status verification (done/partial by reading
 * source). This records VISUAL fidelity (a screenshot was compared to Figma).
 *
 * vverify line:  node-id <TAB> verdict <TAB> shotPath <TAB> note
 *   verdict ∈ match | partial | deferred | not-wired
 *
 * `not-wired` (added 2026-07-25 for the all-sections wired-verification sweep):
 * a frame the visual/code pass confirmed has ZERO implementation in the app.
 * It folds a `[vverify: not-wired ...]` marker like the others, sets verifiedAt
 * (the frame HAS been assessed), and forces status→not-started (an over-optimistic
 * `done`/`partial` code-mapping is corrected down to the truth: nothing renders it).
 *
 * Write strategy (IMPORTANT): build-registry.mjs reconstructs each frame and
 * preserves ONLY {implFiles, status, route, notes, verifiedAt}. So verdict +
 * shot are folded into `notes` behind an idempotent `[vverify: ...]` marker
 * (re-running replaces the marker, never doubles it), and `verifiedAt` is set.
 * Both survive a build-registry rebuild. A non-`match` verdict on a `done`
 * frame downgrades status→partial (corrects an over-optimistic code-mapping).
 *
 * Ordering caveat: apply-status.mjs OVERWRITES `notes` from the status TSV
 * reason. Run apply-verify.mjs AFTER apply-status.mjs in the pipeline (or
 * re-run it after a full rebuild) so the marker is not clobbered.
 *
 * Usage: node figma-catalog/apply-verify.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const regPath = path.join(DIR, "registry.json");
const reg = JSON.parse(fs.readFileSync(regPath, "utf8"));
// Every section present in registry.json must be listed here, or a
// vverify.<section>.tsv for it is read, counted in the "lines loaded" tally, and
// then SILENTLY DISCARDED — no verifiedAt, no [vverify:] marker, no status
// downgrade. That failure is invisible unless you diff the registry afterwards.
// Derived from the registry itself so a new section can never be dropped again;
// the literal list is kept only as the fallback for a malformed registry.
const SECTION_FALLBACK = ["home", "wallet", "trade", "predict", "play", "dice", "pwa", "crash", "mines"];
const SECTIONS = (() => {
  const found = new Set();
  for (const f of Object.values(reg.frames ?? reg)) {
    if (f && typeof f.section === "string" && f.section) found.add(f.section);
  }
  return found.size ? [...found].sort() : SECTION_FALLBACK;
})();
const VALID = new Set(["match", "partial", "deferred", "not-wired"]);
// Idempotent strip: the marker is ALWAYS appended last, so anchor from the
// first `[vverify:` to end-of-string. Using [^\]]* (stop at first `]`) breaks
// when a folded note itself contains `]` — it leaves a tail that accumulates on
// every re-run. [\s\S]*$ removes the whole marker regardless of inner brackets.
const MARKER = /\s*\[vverify:[\s\S]*$/;
const now = new Date().toISOString();

// section/node -> {verdict, shot, note}
const byKey = {};
let loaded = 0;
for (const sec of SECTIONS) {
  const p = path.join(DIR, `vverify.${sec}.tsv`);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const [node, verdict, shot, ...rest] = line.split("\t");
    const v = (verdict || "").trim();
    if (!VALID.has(v)) continue;
    byKey[`${sec}/${node.trim()}`] = {
      verdict: v,
      shot: (shot || "").trim(),
      note: rest.join("\t").trim(),
    };
    loaded++;
  }
}

let applied = 0;
for (const f of Object.values(reg.frames)) {
  if (f.kind !== "screen") continue;
  const rec = byKey[`${f.section}/${f.node}`];
  if (!rec) continue;
  f.verifiedAt = now;
  // Fold verdict + shot (+ optional note) into notes behind an idempotent marker.
  // `-` is the "no shot" placeholder (mirrors apply-status.mjs route handling).
  // Strip `]` from free-text fields so the marker stays a single bracket token
  // and the end-anchored MARKER strip above round-trips cleanly.
  const base = (f.notes || "").replace(MARKER, "").trim();
  const shot = rec.shot && rec.shot !== "-" ? rec.shot.replace(/\]/g, ")") : "";
  const note = rec.note ? rec.note.replace(/\]/g, ")") : "";
  const marker = `[vverify: ${rec.verdict}${shot ? ` | ${shot}` : ""}${note ? ` | ${note}` : ""}]`;
  f.notes = base ? `${base} ${marker}` : marker;
  // A visual pass that finds scope-down corrects an over-optimistic code status.
  // `not-wired` is the strongest correction: nothing implements the frame, so
  // any prior done/partial is wrong — force it to not-started. A plain
  // non-match (partial/deferred) only downgrades an over-optimistic `done`.
  if (rec.verdict === "not-wired") f.status = "not-started";
  else if (rec.verdict !== "match" && f.status === "done") f.status = "partial";
  applied++;
}

reg.generated = now;
fs.writeFileSync(regPath, JSON.stringify(reg, null, 2));

const byVerdict = {};
for (const f of Object.values(reg.frames)) {
  if (f.kind !== "screen" || !f.verifiedAt) continue;
  const m = (f.notes || "").match(/\[vverify:\s*(match|partial|deferred|not-wired)\b/);
  const v = m ? m[1] : "(verifiedAt set, no marker)";
  byVerdict[v] = (byVerdict[v] || 0) + 1;
}
console.log(`vverify lines loaded: ${loaded}; frames stamped: ${applied}`);
console.log("verified frames by verdict:", JSON.stringify(byVerdict));
