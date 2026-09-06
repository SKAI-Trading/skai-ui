/**
 * The checkbox must not resolve to a circle.
 *
 * WHY THIS IS AN ORACLE AND NOT A SNAPSHOT. The failure it guards is invisible
 * in the source: `rounded-sm` looks like a small radius and reads as obviously
 * correct. It is the RESOLUTION that goes wrong, and it goes wrong only in a
 * host that sets `--radius` high enough:
 *
 *   src/index.css          --radius: 0.75rem              = 12px
 *   tailwind-preset.ts:396 sm: calc(var(--radius) - 4px)  =  8px
 *   checkbox.tsx           h-4 w-4                        = 16px box
 *
 * 8px on a 16px box is half the side, so the control drew as a perfect circle —
 * the shape this product uses for single-select — on all 28 call sites,
 * including the perp confirm modal and the wallet chain picker. Three separate
 * bug reports were filed against one surface as if they were three defects.
 *
 * So the assertion is arithmetic on the RESOLVED value, not a string match on
 * the class. A future edit that swaps the literal back to any named radius, or
 * that shrinks the box without shrinking the radius, fails here.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

function checkboxClasses(): string[] {
  const src = readFileSync(
    path.join(ROOT, "src/components/forms/checkbox.tsx"),
    "utf8",
  );
  // The Root's class string is the one carrying the box and the radius.
  const m = src.match(/"peer ([^"]+)"/);
  if (!m) throw new Error("checkbox.tsx: no `peer ...` class string found");
  return ("peer " + m[1]).split(/\s+/);
}

/** px for `h-4` / `w-4` — Tailwind's spacing scale is 4px per step. */
function sizePx(token: string): number {
  const m = /^[hw]-(\d+)$/.exec(token);
  if (!m) throw new Error(`not a size token: ${token}`);
  return Number(m[1]) * 4;
}

/** px for a literal radius token like `rounded-[4px]`. */
function radiusPx(tokens: string[]): number {
  const lit = tokens.find((t) => /^rounded-\[\d+px\]$/.test(t));
  if (!lit) {
    const named = tokens.find((t) => t.startsWith("rounded"));
    throw new Error(
      `the radius must be a pixel literal, because the named scale is ` +
        `host-dependent — found ${named ?? "no radius at all"}`,
    );
  }
  return Number(/\[(\d+)px\]/.exec(lit)![1]);
}

describe("Checkbox shape", () => {
  it("states its radius as a pixel literal, not a host-dependent name", () => {
    expect(() => radiusPx(checkboxClasses())).not.toThrow();
  });

  it("is not a circle: the radius is under half the box", () => {
    const tokens = checkboxClasses();
    const h = sizePx(tokens.find((t) => /^h-\d+$/.test(t))!);
    const w = sizePx(tokens.find((t) => /^w-\d+$/.test(t))!);
    expect(h).toBe(w);
    // Exactly half is a circle; anything approaching it reads as one.
    expect(radiusPx(tokens)).toBeLessThan(h / 2);
  });

  it("still reads as a rounded square, not a hard-cornered one", () => {
    expect(radiusPx(checkboxClasses())).toBeGreaterThan(0);
  });

  it("keeps the box square, so the radius test means what it says", () => {
    const tokens = checkboxClasses();
    expect(tokens).toContain("h-4");
    expect(tokens).toContain("w-4");
  });
});
