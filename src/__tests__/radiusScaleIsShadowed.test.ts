/**
 * `skaiBorderRadius` is what the app paints, and nothing shadows it.
 *
 * Until the 2026-09-24 token switch it was not. The preset spread the constant
 * and then overrode three of its keys off `--radius`, so `sm` and `md` resolved
 * to values the declaration never mentioned:
 *
 *   design-tokens.ts   sm: "4px"                       declared
 *   tailwind-preset.ts sm: calc(var(--radius) - 4px)   overrode it
 *   base.css           --radius: 0.75rem = 12px        resolved it to 8px
 *
 * A lane told "our sm is 4px" measured a 4px corner in Figma, wrote
 * `rounded-sm`, and painted 8px — figma-catalog/TOKENS.md records this as the
 * cause of every radius defect in the 2026-08-11 sweep. The switch made the
 * constant Figma's scale (sm 2 / md 6 / lg 8 / xl 12 / 2xl 16, the
 * `border-radius/rounded-*` variables) and dropped the override, in the preset
 * and in this package's own tailwind.config.ts, which builds dist/styles.css.
 *
 * So the assertions still read the authored override blocks: they fail if an
 * override off `--radius` comes back in either file, which would put a class
 * name back on a scale of whatever host sets `--radius`.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { skaiBorderRadius } from "../lib/design-tokens";

const ROOT = path.resolve(__dirname, "..", "..");

const PRESET_SRC = readFileSync(
  path.join(ROOT, "src/lib/tailwind-preset.ts"),
  "utf8",
).replace(/\r\n/g, "\n");
const CONFIG_SRC = readFileSync(
  path.join(ROOT, "tailwind.config.ts"),
  "utf8",
).replace(/\r\n/g, "\n");

/**
 * The `borderRadius` block's own keys, as authored. Keys spread in from the
 * constant are deliberately not returned — this is the shadowing set.
 */
function presetOverrides(src: string): Record<string, string> {
  const block = src.match(/borderRadius:\s*\{([\s\S]*?)\n\s*\},/);
  if (!block) throw new Error("no borderRadius block");
  const out: Record<string, string> = {};
  for (const line of block[1].split("\n")) {
    const m = /^\s*"?([\w-]+)"?:\s*"([^"]+)",/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const px = (value: string) => {
  const m = /^(\d+)px$/.exec(value);
  if (!m) throw new Error(`not a pixel literal: ${value}`);
  return Number(m[1]);
};

describe("border radius — the constant is what the preset paints", () => {
  it("the preset's borderRadius block authors no key of its own", () => {
    expect(presetOverrides(PRESET_SRC)).toEqual({});
  });

  it("the constant is Figma's scale: sm 2 / md 6 / lg 8 / xl 12 / 2xl 16 / 3xl 24", () => {
    expect(px(skaiBorderRadius.sm)).toBe(2);
    expect(px(skaiBorderRadius.md)).toBe(6);
    expect(px(skaiBorderRadius.lg)).toBe(8);
    expect(px(skaiBorderRadius.xl)).toBe(12);
    expect(px(skaiBorderRadius["2xl"])).toBe(16);
    expect(px(skaiBorderRadius["3xl"])).toBe(24);
    expect(skaiBorderRadius.none).toBe("0px");
    expect(skaiBorderRadius.full).toBe("9999px");
  });

  it("this package's tailwind.config.ts (dist/styles.css) paints lg / md / sm as the constant", () => {
    const own = presetOverrides(CONFIG_SRC);
    expect(Object.keys(own).sort()).toEqual(["lg", "md", "sm"]);
    for (const key of ["lg", "md", "sm"] as const) {
      expect(own[key], key).toBe(skaiBorderRadius[key]);
    }
  });

  it("no radius in either file derives from --radius", () => {
    for (const [file, src] of [["tailwind-preset.ts", PRESET_SRC], ["tailwind.config.ts", CONFIG_SRC]]) {
      for (const [key, value] of Object.entries(presetOverrides(src))) {
        expect(value, `${file} ${key}`).not.toMatch(/--radius/);
      }
    }
  });

  it("goes red if an override comes back, so the guard is live", () => {
    // Negative control against a fixture rather than the real file: the old
    // preset block, which the first case above has to notice.
    const withOverride = `
      borderRadius: {
        ...skaiBorderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    `;
    expect(Object.keys(presetOverrides(withOverride)).sort()).toEqual(["lg", "md", "sm"]);
  });
});
