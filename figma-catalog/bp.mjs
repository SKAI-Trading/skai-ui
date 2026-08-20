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
export const BP_WIDTHS = Object.freeze({ desktop: 1440, tablet: 768, mobile: 375 });

/** Ordered so reports read widest→narrowest, matching how the designs are drawn. */
export const BP_KEYS = Object.freeze(["desktop", "tablet", "mobile"]);

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
    const w = tok.slice(0, eq);
    const v = tok.slice(eq + 1);
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
