/**
 * `skaiBorderRadius` is not what the app paints, and nothing used to say so.
 *
 * WHY THIS IS AN ORACLE AND NOT A SNAPSHOT. The preset spreads the constant and
 * then overrides three of its keys off `--radius`, so `sm` and `md` resolve to
 * values the declaration never mentions:
 *
 *   design-tokens.ts   sm: "4px"                       declared
 *   tailwind-preset.ts sm: calc(var(--radius) - 4px)   overrides it
 *   base.css           --radius: 0.75rem = 12px        resolves it to 8px
 *
 * A lane told "our sm is 4px" measures a 4px corner in Figma, writes
 * `rounded-sm`, and paints 8px. Reading Figma's 8px it writes `rounded-md` and
 * paints 10px. Neither throws and both look deliberate — figma-catalog/TOKENS.md
 * records this as the cause of every radius defect in the 2026-08-11 sweep.
 *
 * So the assertions are arithmetic on the RESOLVED value. They fail if the
 * override is dropped, if `--radius` moves, or if someone "corrects" the
 * constant to the painted numbers — which would silently shift every
 * `rounded-sm` in the tree by 4px, because the override subtracts from
 * `--radius` rather than from the constant.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { skaiBorderRadius } from "../lib/design-tokens";

const ROOT = path.resolve(__dirname, "..", "..");

const PRESET_SRC = readFileSync(
  path.join(ROOT, "src/lib/tailwind-preset.ts"),
  "utf8",
);
const BASE_CSS = readFileSync(
  path.join(ROOT, "src/styles/base.css"),
  "utf8",
);

/**
 * The `borderRadius` block's own overrides, as authored. Keys spread in from
 * the constant are deliberately not returned — this is the shadowing set.
 */
function presetOverrides(src: string): Record<string, string> {
  const block = src.match(/borderRadius:\s*\{([\s\S]*?)\n\s*\},/);
  if (!block) throw new Error("tailwind-preset.ts: no borderRadius block");
  const out: Record<string, string> = {};
  for (const line of block[1].split("\n")) {
    const m = /^\s*"?([\w-]+)"?:\s*"([^"]+)",/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

/** `--radius` in px, as declared for the default theme. */
function radiusPx(css: string): number {
  const m = css.match(/--radius:\s*([\d.]+)rem;/);
  if (!m) throw new Error("base.css: no --radius declaration");
  return Number(m[1]) * 16;
}

/** Resolve `var(--radius)` / `calc(var(--radius) - Npx)` to a pixel number. */
function resolve(expr: string, radius: number): number {
  if (expr === "var(--radius)") return radius;
  const m = /^calc\(var\(--radius\)\s*-\s*(\d+)px\)$/.exec(expr);
  if (m) return radius - Number(m[1]);
  const px = /^(\d+)px$/.exec(expr);
  if (px) return Number(px[1]);
  throw new Error(`unrecognised radius expression: ${expr}`);
}

const OVERRIDES = presetOverrides(PRESET_SRC);
const RADIUS = radiusPx(BASE_CSS);

describe("border radius — the constant is shadowed by the preset", () => {
  it("declares --radius as 12px, which every override is measured from", () => {
    expect(RADIUS).toBe(12);
  });

  it("shadows exactly sm, md and lg", () => {
    expect(Object.keys(OVERRIDES).sort()).toEqual(["lg", "md", "sm"]);
  });

  it("paints sm 8 / md 10 / lg 12, not the declared 4 / 8 / 12", () => {
    expect(resolve(OVERRIDES.sm, RADIUS)).toBe(8);
    expect(resolve(OVERRIDES.md, RADIUS)).toBe(10);
    expect(resolve(OVERRIDES.lg, RADIUS)).toBe(12);
  });

  it("keeps sm and md diverged from the declaration, which is the trap", () => {
    // If these ever agree, the hazard is gone and the docblock on
    // skaiBorderRadius should say so rather than warning about nothing.
    expect(resolve(OVERRIDES.sm, RADIUS)).not.toBe(
      Number(skaiBorderRadius.sm.replace("px", "")),
    );
    expect(resolve(OVERRIDES.md, RADIUS)).not.toBe(
      Number(skaiBorderRadius.md.replace("px", "")),
    );
    // lg is the one key that survives the override unchanged.
    expect(resolve(OVERRIDES.lg, RADIUS)).toBe(
      Number(skaiBorderRadius.lg.replace("px", "")),
    );
  });

  it("passes xl, 2xl, none and full through untouched", () => {
    for (const key of ["xl", "2xl", "none", "full"]) {
      expect(OVERRIDES[key]).toBeUndefined();
    }
    expect(skaiBorderRadius.xl).toBe("16px");
    expect(skaiBorderRadius["2xl"]).toBe("24px");
  });

  it("goes red if the override is dropped, so the guard is live", () => {
    // Negative control against a fixture rather than the real file: a preset
    // that only spreads the constant shadows nothing, and the check above that
    // pins the shadowing set has to notice.
    const withoutOverride = `
      borderRadius: {
        ...skaiBorderRadius,
      },
    `;
    expect(Object.keys(presetOverrides(withoutOverride))).toEqual([]);
  });
});
