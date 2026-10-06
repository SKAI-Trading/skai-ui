/**
 * Green Coal, White and Ash can follow the light theme — and paint exactly
 * what they always did until something asks them to.
 *
 * Reports 24dbeb11, a480fd88, 3a9349ca and 773f8a9d (2026-10-06): in the light
 * theme the rail, the account menu, the notification panel and the header's
 * quick-balance popover all stayed dark. They are painted with the Figma
 * shell's fixed colours, and a fixed colour has no light value to switch to.
 *
 * The preset now routes the utilities that paint those roles through custom
 * properties. These tests compile the real preset and read the emitted CSS:
 *
 *   - each themed utility reads its property, with the colour it painted
 *     before as the fallback, so a page that sets nothing is unchanged;
 *   - the fallback is computed from the token constants, not retyped here;
 *   - the ink on accent buttons (`text-green-coal-300`) and the palette as
 *     data (`theme("colors")`) are deliberately left fixed.
 */
import { describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import skaiPreset from "../lib/tailwind-preset";
import { coreColors, greenCoalColors, neutralColors } from "../lib/design-tokens";

const CLASSES = [
  "bg-green-coal-300",
  "bg-green-coal-200",
  "bg-green-coal-100",
  "bg-green-coal-200/60",
  "hover:bg-green-coal-100",
  "border-green-coal-100",
  "border-green-coal-300",
  "ring-green-coal-300",
  "divide-green-coal-100",
  "from-green-coal-200",
  "text-white",
  "text-white/70",
  "text-ash",
  "text-green-coal-300",
];

async function compile(): Promise<string> {
  const config = {
    presets: [skaiPreset],
    content: [{ raw: `<div class="${CLASSES.join(" ")}"></div>`, extension: "html" }],
    corePlugins: { preflight: false },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  return result.css;
}

/** Every declaration of one rule, keyed by property. The selector is matched as text. */
function rule(css: string, selector: string): Record<string, string> {
  const at = css.indexOf(`${selector} {`);
  if (at < 0) throw new Error(`no rule for ${selector}`);
  const body = css.slice(css.indexOf("{", at) + 1, css.indexOf("}", at));
  const out: Record<string, string> = {};
  for (const decl of body.split(";")) {
    const i = decl.indexOf(":");
    if (i > 0) out[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
  }
  return out;
}

const triplet = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

describe("Green Coal follows the theme only where asked (24dbeb11, a480fd88, 3a9349ca, 773f8a9d)", () => {
  it.each([
    [".bg-green-coal-300", "background-color", "coal-base", greenCoalColors[300]],
    [".bg-green-coal-200", "background-color", "coal-raised", greenCoalColors[200]],
    [".bg-green-coal-100", "background-color", "coal-fill", greenCoalColors[100]],
    [".border-green-coal-100", "border-color", "coal-line", greenCoalColors[100]],
    [".border-green-coal-300", "border-color", "coal-base", greenCoalColors[300]],
    [".ring-green-coal-300", "--tw-ring-color", "coal-base", greenCoalColors[300]],
    [".text-white", "color", "coal-ink", coreColors.white],
    [".text-ash", "color", "coal-ink-muted", neutralColors.ash],
  ])("%s paints %s from --%s, falling back to the old colour", async (selector, prop, name, hex) => {
    const css = await compile();
    expect(rule(css, selector)[prop]).toContain(`var(--${name}, ${triplet(hex)})`);
  });

  it("keeps opacity modifiers and variants on the same property", async () => {
    const css = await compile();
    expect(rule(css, ".bg-green-coal-200\\/60")["background-color"]).toBe(`rgb(var(--coal-raised, ${triplet(greenCoalColors[200])}) / 0.6)`);
    expect(rule(css, ".text-white\\/70").color).toBe("rgb(var(--coal-ink, 255 255 255) / 0.7)");
    expect(rule(css, ".hover\\:bg-green-coal-100:hover")["background-color"]).toContain("var(--coal-fill,");
    expect(css).toMatch(/\.divide-green-coal-100[^{]*\{[^}]*var\(--coal-line, /);
    expect(rule(css, ".from-green-coal-200")["--tw-gradient-from"]).toContain("var(--coal-raised,");
  });

  it("leaves the dark ink on accent buttons fixed", async () => {
    const css = await compile();
    const color = rule(css, ".text-green-coal-300").color;
    expect(color).not.toContain("var(--coal");
    expect(color).toContain(triplet(greenCoalColors[300]));
  });

  it("leaves the palette itself as hex for anything reading it as data", () => {
    const theme = resolveConfig({ content: [], presets: [skaiPreset] } as never).theme as unknown as {
      colors: Record<string, Record<string, string> | string>;
    };
    expect((theme.colors["green-coal"] as Record<string, string>)[300]).toBe(greenCoalColors[300]);
    expect(theme.colors.white).toBe(coreColors.white);
    expect(theme.colors.ash).toBe(neutralColors.ash);
  });
});
