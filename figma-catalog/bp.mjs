/**
 * bp.mjs — the breakpoint dimension of the catalog schema.
 *
 * WHY THIS EXISTS
 * ---------------
 * `status.<section>.tsv` column 2 is a SINGLE verdict per row. Measured
 * 2026-08-20 across the 24 status files: of 262 rows marked `done`, 223 said
 * nothing about any viewport width, and six sections (governance,
 * governance-account, governance-vaults, social, wallet, play) mentioned a
 * width on ZERO rows. So `done` meant "done at whatever width the author
 * happened to open" — overwhelmingly 1440. A responsive gap sitting behind a
 * `done` row was invisible to every report and could never be scheduled.
 *
 * This module adds a per-row verdict at each of the three breakpoints the
 * design system actually uses — 1440 / 768 / 375, confirmed from the
 * catalogued frame titles — WITHOUT re-verifying 500+ rows nobody has time to
 * re-verify.
 *
 * THE TWO AXES, AND WHY ONLY ONE OF THEM IS HAND-AUTHORED
 * -------------------------------------------------------
 * A width question has two independent halves, and the old single `status`
 * collapsed both:
 *
 *   DESIGN axis — does a Figma frame exist at this width?
 *   CODE axis   — does the implementation work at this width?
 *
 * The DESIGN axis is **derived, never typed**. registry.json already stores a
 * per-frame `device` parsed from the frame title's viewport, so the frame
 * count per family per width is a fact the catalog already holds. Deriving it
 * means governance's 114 rows report `design-missing` at tablet and mobile
 * with zero hand edits, and self-correct the day those frames are drawn.
 * (`deriveDesign` below.) It also means nobody can typo it out of sync.
 *
 * Only the CODE axis is hand-authored, in optional column 6.
 *
 * ★ THE DEFAULT IS `unknown`, AND IT IS NEVER INHERITED FROM COLUMN 2.
 * A row with no column 6 reads `unknown` at all three widths. It must NOT
 * inherit the row's overall `status`: a row that says `done` because someone
 * checked it at 1440 would then assert `done` at 375, which is strictly worse
 * than today's silence — it would look verified. `unknown` is the honest
 * answer to a question nobody asked, and it is the one the coverage report
 * counts as an outstanding gap.
 */

/** The three breakpoints, in CSS pixels. Derived from 3,917 catalogued frame
 *  titles: 712 frames at 1440, 504 at 768, 578 at 375. */
/**
 * The row-status vocabulary, defined ONCE here because it was defined twice and
 * the two copies drifted with a 7% data loss behind each of them.
 *
 * On 2026-08-26 `apply-status.mjs` was found doing
 * `if (!VALID.has(row.status)) continue;` — a silent skip that discarded 140 of
 * 1,931 rows, including every `blocked-on-backend` verdict. It was fixed there.
 * The identical whitelist and the identical silent `continue` were then found in
 * `bp-report.mjs`, dropping 154 of 2,140 rows (7.2%) the same way, so its
 * coverage denominator was wrong and no verdict on those rows could ever appear.
 *
 * ★ Fixing one file was not fixing the class. A single exported set is what
 * stops a third copy appearing — see SCHEMA.md "Status semantics" for what each
 * value MEANS, and note `done` was tightened to measured parity on the same day.
 */
export const STATUS_VALID = Object.freeze(
  new Set([
    "done",
    "partial",
    "not-started",
    "blocked-on-backend",
    "frame-defect",
    "furniture",
    "unknown",
  ]),
);

/** Legacy spellings seen in the wild. Mapped, never dropped. */
export const STATUS_ALIASES = Object.freeze(
  new Map([
    ["scaffolding", "furniture"],
    ["art-asset", "furniture"],
    ["real-component", "partial"],
    ["real-screen", "partial"],
    // A refuter's word for a row it re-measured and would not promote. The
    // notes on these carry the delta that kept them open, so the row is
    // measured but unfinished, which is what `partial` means.
    ["open", "partial"],
    ["blocked", "blocked-on-backend"],
    // Held for a product ruling rather than for a source. There is no status
    // for "waiting on a decision", and inventing one would have to be threaded
    // through coverage.mjs's severity order to mean anything; the reason stays
    // legible in the notes column.
    ["blocked-on-casey", "partial"],
  ]),
);

/**
 * True for a line that is a `#` comment or blank — the two things a status
 * reader must skip on purpose.
 *
 * ⚠️ Both broken readers used the status whitelist to skip comment lines as a
 * side effect (`bp-report.mjs` even said so: `// comments and headers`). That is
 * why the silent `continue` looked deliberate and survived review: it WAS doing
 * a real job, just also swallowing every unrecognised verdict alongside it.
 * Skip comments explicitly, then judge the status on its own.
 */
export function isSkippableStatusLine(line) {
  const t = (line ?? "").trim();
  return t === "" || t.startsWith("#");
}

/** Canonical status for a row, or `null` if it is not a recognised verdict. */
export function normaliseStatus(status) {
  const s = (status ?? "").trim();
  if (STATUS_ALIASES.has(s)) return STATUS_ALIASES.get(s);
  return STATUS_VALID.has(s) ? s : null;
}

/**
 * Resolve a `status.<stem>.tsv` filename stem to a REAL registry section.
 *
 * ⚠️ WHY THIS EXISTS. `apply-status.mjs` derives the section from the FILENAME.
 * Parallel lanes were told to write `status.wave2.<lane>.tsv` so ten concurrent
 * agents could not clobber one shared file — which was right for collisions and
 * wrong for this: `wave2.social-a` is not a section, so **1,458 of 2,140 rows
 * applied to zero frames**. `status.home-2.tsv` was the only wave deliverable
 * whose name happened to resolve.
 *
 * The same trap had already been documented one file over: status.governance-
 * account.tsv and status.governance-vaults.tsv carry a header saying their 121
 * rows resolve to sections that do not exist. It was recorded and then walked
 * into again, because the fix was a note rather than code.
 *
 * Rules, applied in order until a real section matches:
 *   1. the stem itself                       `social` → social
 *   2. drop a leading `waveN.`               `wave2.social-a` → `social-a`
 *   3. drop a leading verb                   `verify-social` → `social`
 *   4. drop trailing `.segment`s             `trade-2.trench` → `trade-2`
 *   5. drop a trailing `-<short suffix>`     `social-a` → `social`
 *
 * Returns `null` when nothing matches — a genuinely cross-cutting file such as
 * `wave3.frame-defects`. Callers must REPORT those, never silently drop them.
 */
/**
 * Lane files whose name genuinely does not encode their section, so no rule can
 * derive it. Same idea as `SECTION_ALIAS` in `audit-figma-txt.mjs`.
 *
 * Everything under `wave2.trench-*` / `launch-components` / `creator-rewards-*`
 * assessed frames on the **Trade 2** Figma page; `home2-intel-hub` assessed the
 * Home 2 page. `null` marks a file that is legitimately cross-cutting — it spans
 * many sections and must NOT be forced into one.
 */
export const SECTION_FILE_ALIASES = Object.freeze(
  new Map([
    ["wave2.trench-pnl", "trade-2"],
    ["wave2.trench-order-types", "trade-2"],
    ["wave2.trench-mobile-positions", "trade-2"],
    ["wave2.trench-execution-rail", "trade-2"],
    ["wave2.launch-components", "trade-2"],
    ["wave2.creator-rewards-charts", "trade-2"],
    ["wave2.home2-intel-hub", "home-2"],
    // Cross-cutting by design: one row per GAME, or one row per defective frame
    // across every page. Forcing a section would file them under the wrong one.
    ["game-rollups.verified", null],
    ["wave2.games-pagesections", null],
    ["wave3.frame-defects", null],
    ["wave3.v1-supersession", null],
    // One row per FRAME across all 21 game pages — genuinely spans 21 sections.
    ["wave3.verify-games", null],
    // Covers TWO sections. The derivation rules would resolve it to `predict`
    // and silently misfile every play row — worse than leaving it out, because a
    // wrong section reads as a real verdict. Its rows are prefixed `predict:` /
    // `play:` in the reason column; SPLIT IT into status.predict.tsv and
    // status.play.tsv rather than teaching the resolver to guess.
    ["wave2.predict-play", null],
  ]),
);

export function resolveSection(stem, realSections) {
  if (SECTION_FILE_ALIASES.has(stem)) return SECTION_FILE_ALIASES.get(stem);
  const has = (s) => (realSections instanceof Set ? realSections.has(s) : realSections.includes(s));
  const tries = [];
  let s = stem;
  tries.push(s);
  s = s.replace(/^wave\d+\./, "");
  tries.push(s);
  s = s.replace(/^(verify|audit|check|re)-/, "");
  tries.push(s);
  // Drop trailing dot-segments, longest prefix first: `a.b.c` → `a.b` → `a`.
  let dotted = s;
  while (dotted.includes(".")) {
    dotted = dotted.slice(0, dotted.lastIndexOf("."));
    tries.push(dotted);
  }
  // Then a trailing lane suffix on the surviving stem: `social-a` → `social`.
  for (const base of [...tries]) {
    const m = /^(.*)-(?:[a-z]|\d|[a-z]{1,12})$/.exec(base);
    if (m) tries.push(m[1]);
  }
  /*
    ⚠️ And the one-character variant that made FOUR wave-3 deliverables inert:
    the sections are `home-2` / `trade-2` / `wallet-2`, hyphen before the digit,
    while the lane names I mandated were `verify-home2` / `verify-trade2` /
    `verify-wallet2`. Same class as the two failures above, third occurrence —
    which is the argument for a rule here rather than naming discipline in a
    brief. A lane cannot get the filename wrong in a way that silently discards
    its work if the resolver normalises the shape.
  */
  for (const base of [...tries]) {
    const m = /^(.*[a-z])(\d+)$/.exec(base);
    if (m) tries.push(`${m[1]}-${m[2]}`);
  }
  for (const t of tries) if (t && has(t)) return t;
  return null;
}

/**
 * Parse a status row's column 1 into something the registry can be addressed by.
 *
 * ⚠️ THIS EXISTS BECAUSE `resolveSection` IS NOT ENOUGH, and the gap silently
 * ate three wave-4 lanes (2026-08-26). `resolveSection` answers "which section
 * is this FILE about?", which presumes every status file is about exactly one.
 * Some legitimately are not: `status.wave4.row-conflicts.tsv` reconciles rows
 * across Social, Sportsbook and Play by construction, and
 * `status.wave4.games-uncovered.tsv` covers eleven game sections. Those files
 * resolve to NO section, so they were dropped whole — 287 rows of measured work
 * applied to zero frames, which is the third occurrence of exactly the failure
 * `resolveSection`'s own comment block was written to end.
 *
 * The fix is a RULE, not a list of blessed filenames: **a file needs no section
 * if every one of its rows says which frame it means.** Three key forms do:
 *
 *   A  `Some Screen [10335-235331]`   title + bracketed node id (the 2026-08 waves)
 *   B  `9178:14731`                   a bare node id, nothing else
 *   C  `play/blackjack-detail`        an explicit `<section>/<family>` pair
 *
 * A row that is none of these — a bare family name — is only addressable via
 * the file's section, so in a section-less file it is REFUSED and reported.
 * It is never downgraded to a guess: picking a section for it would attach a
 * measured verdict to frames nobody looked at, which is worse than dropping it
 * and strictly harder to notice afterwards.
 *
 * Forms A and B return `{kind:"id"}` and are section-INDEPENDENT: `registry
 * .frames` is keyed by node id, so the id alone addresses exactly one frame no
 * matter which file carried it. That is also why an id match is strictly better
 * than a family match even in a single-section file — a family key hits every
 * frame sharing a screen name.
 *
 * @param {string} rawKey       column 1, verbatim
 * @param {string|null} sectionHint  the file's resolved section, or null
 * @param {Set<string>|string[]} realSections  sections present in registry.json
 * @returns {{kind:"id",nodeId:string}|{kind:"fam",section:string,family:string}|null}
 */
export function parseRowKey(rawKey, sectionHint, realSections) {
  const key = (rawKey ?? "").trim();
  if (!key) return null;
  const has = (s) => (realSections instanceof Set ? realSections.has(s) : realSections.includes(s));

  // Form A — a bracketed node id anywhere in the key.
  const bracketed = /\[(\d{1,9}[-:]\d{1,9})\]/.exec(key);
  if (bracketed) return { kind: "id", nodeId: bracketed[1].replace(":", "-") };

  // Form B — the key IS a node id. Anchored, so a family that merely contains
  // digits (`wave-2`, `top-10`) cannot be mistaken for one.
  const bare = /^(\d{1,9})[-:](\d{1,9})$/.exec(key);
  if (bare) return { kind: "id", nodeId: `${bare[1]}-${bare[2]}` };

  // Form C — `<section>/<family>`, split at the FIRST slash so a family may
  // itself contain one. Only accepted when the prefix is a section that really
  // exists; otherwise fall through rather than invent one.
  const slash = key.indexOf("/");
  if (slash > 0) {
    const maybeSection = key.slice(0, slash);
    const family = key.slice(slash + 1);
    if (family && has(maybeSection)) return { kind: "fam", section: maybeSection, family };
  }

  // Otherwise it is a bare family, addressable only through the file's section.
  if (sectionHint) return { kind: "fam", section: sectionHint, family: key };

  /*
    Form D — a SECTION ROLLUP: `Casino > Fortune Wheel`, one row standing for a
    whole game rather than for any one frame. 104 of these exist across five
    files and they are the only rows left that no other form addresses.

    ★ A rollup is recorded, NEVER applied to frame statuses. `Casino > Blackjack
    = done` would otherwise stamp `done` on every Blackjack frame, and Casey's
    2026-08-26 ruling defines `done` as measured parity at a specific width. That
    is the precise inflation the Home 2 re-verify had just finished undoing — it
    demoted 88 rows to `unknown` because they were never measured. Letting a
    rollup re-inflate them through a different door would be the same error with
    a new mechanism.

    So this returns its own `kind`, and the caller files it in `registry.rollups`
    where it is queryable and clearly not a per-frame verdict.
  */
  const tail = key.includes(">") ? key.slice(key.lastIndexOf(">") + 1) : key;
  const slug = tail.trim().toLowerCase().replace(/\s+/g, "-");
  // `Hi-Lo` slugs to `hi-lo` while the section is `hilo`, so try the de-hyphenated
  // form too rather than special-casing one game.
  for (const cand of [slug, slug.replace(/-/g, ""), ROLLUP_SECTION_ALIASES.get(slug)]) {
    if (cand && has(cand)) return { kind: "section", section: cand };
  }
  return null;
}

/**
 * Figma page names that do not slugify to their registry section. Only for the
 * cases where no rule can bridge the gap — `Scratchers` vs `skratch` is a
 * spelling difference, not a shape one, so a resolver rule would have to guess.
 */
export const ROLLUP_SECTION_ALIASES = Object.freeze(new Map([["scratchers", "skratch"]]));

export const BP_WIDTHS = Object.freeze({ desktop: 1440, tablet: 768, mobile: 375 });

/** Ordered so reports read widest→narrowest, matching how the designs are drawn. */
export const BP_KEYS = Object.freeze(["desktop", "tablet", "mobile"]);

/**
 * Words rows keep reaching for that are not verdicts, mapped to the verdict
 * they mean. The column-2 status vocabulary is the usual source: a row that is
 * `blocked-on-backend` overall gets `blocked` written into a breakpoint cell,
 * where it says nothing about whether that board renders.
 *
 * This exists because the whole run is all-or-nothing: `apply-status.mjs`
 * refuses to write anything when any row anywhere is malformed, so one cell of
 * one wave's file freezes every other wave's rows with it. Repairing the data
 * each time only lasts until the next wave writes the same word again.
 *
 * Mapped, never dropped — and deliberately conservative. Nothing here promotes
 * a cell toward `done`; the two "we could not judge" words land on `unknown`,
 * which is what an unjudged board is.
 */
export const BP_VERDICT_ALIASES = Object.freeze(
  new Map([
    ["blocked", "unknown"],
    ["blocked-on-backend", "unknown"],
    ["unmounted", "missing"],
    ["frame-defect", "broken"],
    ["furniture", "n-a"],
    ["n/a", "n-a"],
    ["open", "partial"],
    ["measured", "partial"],
    ["fixed", "renders"],
    ["match", "renders"],
  ]),
);

/** The same three boards keyed by the pixel width a row is likely to name. */
export const BP_PX_TO_KEY = Object.freeze(
  new Map(Object.entries(BP_WIDTHS).map(([key, px]) => [String(px), key])),
);

/**
 * Hand-authorable CODE-axis verdicts.
 *
 * `renders` is the deliberate rung between `unknown` and `done`, and it is the
 * one an automated sweep is allowed to write. A Playwright pass that finds no
 * horizontal overflow proves the page LAYS OUT at that width; it does not
 * compare a single pixel to the Figma frame. Writing `done` off such a sweep is
 * the overclaim this whole file exists to prevent.
 *
 * `design-missing` is NOT in this set on purpose — it is derived (see above).
 */
export const BP_VERDICTS = Object.freeze({
  unknown: "nobody has looked at this width. THE DEFAULT.",
  missing:
    "the surface does not render at this width AT ALL — absent, not merely broken. ★ An overflow sweep PASSES on absence.",
  renders:
    "lays out at this width with no horizontal overflow / no clipped controls. NOT compared to a Figma frame.",
  done: "implemented AND render-verified against the Figma frame at this width.",
  partial: "usable at this width, named gaps remain (put them in the reason column).",
  broken:
    "reachable but unusable at this width — overflow, clipped controls, or the flow cannot be completed.",
  "not-started": "verified that no responsive handling exists at this width (e.g. a fixed-width container).",
  "n-a": "this width is deliberately out of scope for this surface. Never use it to mean 'not checked'.",
});

/**
 * ★ WHY `missing` IS A SEPARATE RUNG FROM `broken` — the worked example.
 *
 * `/swap` measured ZERO horizontal overflow at 375 on 2026-08-20. It passed
 * because there is no swap UI at 375 at all: the string "Swap" appears 6 times
 * at 1440, 6 at 768 and 0 at 375 — the route resolves to `/portfolio` and the
 * panel never mounts. A single `status` column cannot tell "clean" from
 * "absent", and neither can an overflow number. `missing` is the rung that
 * separates them, and it ranks WORST of all, below `broken`: a broken feature
 * is at least reachable and reported by its users, whereas an absent one looks
 * fine from every automated angle.
 */

/** Severity order for 'worst verdict in this family' rollups. Lower = worse.
 *  `unknown` and `n-a` are deliberately absent: neither is a code judgement, so
 *  neither may win a worst-of comparison and hide a real one. */
const SEVERITY = { missing: 0, broken: 1, "not-started": 2, partial: 3, renders: 4, done: 5 };

export function bpUnknown() {
  return { desktop: "unknown", tablet: "unknown", mobile: "unknown" };
}

/**
 * Parse column 6 of a status row.
 *
 * Grammar (whitespace-separated, order-independent):
 *
 *     <width>=<verdict>  [<width>=<verdict> ...]  [@<YYYY-MM-DD>[/<source-slug>]]
 *
 * e.g.  `desktop=done tablet=renders mobile=broken @2026-08-20/overflow-sweep`
 *
 * An omitted width is `unknown`. An empty or absent cell is all-unknown.
 *
 * Errors are RETURNED, not thrown, and the caller is expected to refuse to
 * write anything when any row has one. A malformed cell must never degrade to
 * `unknown` silently: silent degradation is how a typo becomes a permanent
 * blind spot that reads as "nobody checked" when someone did.
 */
export function parseBpCell(cell) {
  const verdicts = bpUnknown();
  const errors = [];
  let at = null;
  let source = null;

  const raw = (cell || "").trim();
  if (!raw) return { verdicts, at, source, errors, present: false };

  for (const tok of raw.split(/\s+/)) {
    if (tok.startsWith("@")) {
      const m = /^@(\d{4}-\d{2}-\d{2})(?:\/([^\s]+))?$/.exec(tok);
      if (!m) {
        errors.push(`bad provenance token "${tok}" (want @YYYY-MM-DD or @YYYY-MM-DD/source-slug)`);
        continue;
      }
      if (at) errors.push(`two provenance tokens ("${at}" then "${m[1]}")`);
      at = m[1];
      source = m[2] || null;
      continue;
    }
    const eq = tok.indexOf("=");
    if (eq < 0) {
      errors.push(`token "${tok}" is not <width>=<verdict>`);
      continue;
    }
    // A board is as often named by its pixel width as by its key, and BP_WIDTHS
    // already fixes which is which. Reading `1440=done` as `desktop=done` costs
    // nothing and keeps a whole class of row out of the refusal path.
    const w = BP_PX_TO_KEY.get(tok.slice(0, eq)) ?? tok.slice(0, eq);
    const raw_v = tok.slice(eq + 1);
    const v = BP_VERDICT_ALIASES.get(raw_v) ?? raw_v;
    if (!BP_KEYS.includes(w)) {
      errors.push(`unknown width "${w}" (want ${BP_KEYS.join(" | ")})`);
      continue;
    }
    if (!Object.hasOwn(BP_VERDICTS, v)) {
      errors.push(`unknown verdict "${v}" for ${w} (want ${Object.keys(BP_VERDICTS).join(" | ")})`);
      continue;
    }
    if (verdicts[w] !== "unknown") errors.push(`width "${w}" given twice`);
    verdicts[w] = v;
  }

  return { verdicts, at, source, errors, present: true };
}

/** Render a verdict triple back to cell syntax. Omits `unknown` widths, so an
 *  all-unknown triple serialises to "" and the column stays absent. */
export function formatBpCell(verdicts, at, source) {
  const parts = BP_KEYS.filter((k) => verdicts[k] && verdicts[k] !== "unknown").map(
    (k) => `${k}=${verdicts[k]}`,
  );
  if (!parts.length) return "";
  if (at) parts.push(`@${at}${source ? `/${source}` : ""}`);
  return parts.join(" ");
}

/**
 * Split a status.<section>.tsv line into its six columns.
 *
 * Column 5 (`reason`) used to absorb every remaining tab via rest.join("\t").
 * Verified 2026-08-20 across all 24 files: ZERO rows have more than five
 * tab-separated fields, so column 6 was free to claim. A row that grows a sixth
 * field which is not a valid bp cell is therefore a stray tab inside a reason,
 * and the caller must fail loudly rather than parse the tail as a verdict.
 */
export function splitStatusLine(line) {
  const f = line.replace(/\r$/, "").split("\t");
  return {
    family: (f[0] || "").trim(),
    status: (f[1] || "").trim(),
    primaryFile: (f[2] || "").trim(),
    route: (f[3] || "").trim(),
    reason: (f[4] || "").trim(),
    bpCell: (f[5] || "").trim(),
    extra: f.length > 6 ? f.slice(6) : [],
  };
}

/**
 * DESIGN axis, derived from registry frames.
 *
 * Returns `{ "<section>/<family>": {desktop:n, tablet:n, mobile:n, unplaced:n} }`
 * counting SCREEN frames only. `unplaced` is frames whose title carried no
 * parseable viewport — a title-grammar gap, NOT a responsive gap, and it must
 * never be read as a missing width.
 *
 * ⚠ TWO LIMITS, AND THEY POINT IN OPPOSITE DIRECTIONS.
 *
 * 1. Furniture. `kind !== "screen"` is what strips `Rectangle N` / `Vector N` /
 *    `Screenshot …` nodes; without it `towers` reads 67 frames when 60 of them
 *    are furniture. Never count raw frames per section — count screens.
 *
 * 2. Titles are labels, not identities. `section`, `family` and `device` are
 *    all parsed from the frame title, and ~10 games carry a 375 frame titled as
 *    a DIFFERENT game (node `9442-17258` is titled Blackjack and is actually
 *    Darts). So the asymmetry to hold onto is: **a ZERO here is strong
 *    evidence** — nobody mistitles a frame into non-existence — while a nonzero
 *    count is weak, because a title can put a frame under the wrong family.
 *    `design-missing` is therefore trustworthy; "design present" is a hint.
 */
export function deriveDesign(frames) {
  const out = {};
  for (const f of Object.values(frames)) {
    if (f.kind !== "screen") continue;
    const key = `${f.section}/${f.family}`;
    const b = (out[key] = out[key] || { desktop: 0, tablet: 0, mobile: 0, unplaced: 0 });
    if (BP_KEYS.includes(f.device)) b[f.device]++;
    else b.unplaced++;
  }
  return out;
}

/** true when the design axis says no frame exists at this width for this family. */
export function isDesignMissing(design, width) {
  return !!design && design[width] === 0;
}

/** Worst CODE-axis verdict across the three widths, or null if none is a judgement. */
export function worstVerdict(verdicts) {
  let worst = null;
  for (const k of BP_KEYS) {
    const v = verdicts[k];
    if (!Object.hasOwn(SEVERITY, v)) continue;
    if (worst === null || SEVERITY[v] < SEVERITY[worst]) worst = v;
  }
  return worst;
}
