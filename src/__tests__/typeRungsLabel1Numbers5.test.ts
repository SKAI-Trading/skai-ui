/**
 * Label 1 and Numbers 5 at every board size.
 *
 * The preset had Label 1 at 16/16 only and no Numbers 5 at all, so the
 * Account boards drew Mulish 12/16 / 14/16 (Label 1) and 12/14 / 12/16
 * (Numbers 5) in arbitrary pixels. tokensMatchFigma.test.ts checks every key
 * that is named for a Figma style against the style; this file makes sure the
 * five keys are there for it to check, and that typography.css gives each
 * class its family the way it does the other rungs, with no capitals.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import resolveConfig from "tailwindcss/resolveConfig";
import { describe, expect, it } from "vitest";

import { skaiFontSizes } from "../lib/design-tokens";
import skaiPreset from "../lib/tailwind-preset";

const ROOT = path.resolve(__dirname, "..", "..");
const texts: Record<string, { ff: string; fs: number; lh: number; fw: number }> = JSON.parse(
  readFileSync(path.join(ROOT, "figma/tokens/text-styles.json"), "utf8"),
);
const css = readFileSync(path.join(ROOT, "src/styles/typography.css"), "utf8").replace(/\r\n/g, "\n");
const theme = resolveConfig({ content: [], presets: [skaiPreset] }).theme as unknown as {
  fontSize: Record<string, [string, Record<string, string>]>;
};

const KEYS: Array<[string, string]> = [
  ["number-5", "Lg/Numbers 5 300"],
  ["number-5-tablet", "Md/Numbers 5 300"],
  ["number-5-mobile", "Sm/Numbers 5 300"],
  ["label-1-tablet", "Md/Label 1 300"],
  ["label-1-mobile", "Sm/Label 1 300"],
];

const px = (v: string) => (v.endsWith("rem") ? parseFloat(v) * 16 : parseFloat(v));

/** Every rule whose selector list names `.cls` on its own. */
function rulesFor(cls: string): string[] {
  const out: string[] = [];
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selectors = m[1].split(",").map((s) => s.trim());
    if (selectors.includes(`.${cls}`)) out.push(m[2]);
  }
  return out;
}

describe("Label 1 and Numbers 5 rungs", () => {
  it.each(KEYS)("%s is in the preset as %s", (key, style) => {
    const t = texts[style];
    expect(t, style).toBeDefined();
    const entry = (skaiFontSizes as unknown as Record<string, [string, Record<string, string>]>)[key];
    expect(entry, key).toBeDefined();
    expect(px(entry[0])).toBe(t.fs);
    expect(px(entry[1].lineHeight)).toBe(t.lh);
    expect(theme.fontSize[key]?.[0]).toBe(entry[0]);
  });

  it.each(KEYS)(".text-%s takes Mulish from typography.css, and no capitals", (key) => {
    const rules = rulesFor(`text-${key}`);
    expect(rules.length, `.text-${key} has a family rule`).toBeGreaterThan(0);
    expect(rules.join(";")).toMatch(/font-family:\s*"Mulish"/);
    expect(rules.join(";")).not.toMatch(/text-transform/);
  });

  it("the Numbers 5 steps keep tabular figures, as the other Numbers steps do", () => {
    for (const key of ["number-5-tablet", "number-5-mobile"]) {
      expect(rulesFor(`text-${key}`).join(";")).toMatch(/font-variant-numeric:\s*tabular-nums/);
    }
  });

  it("leaves Label 1 at 16/16 on the desktop key", () => {
    const [size, opts] = theme.fontSize["label-1"];
    expect(px(size)).toBe(16);
    expect(px(opts.lineHeight)).toBe(16);
  });
});
