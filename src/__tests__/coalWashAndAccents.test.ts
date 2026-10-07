/**
 * White washes and accent text follow the light theme, and nothing else moves.
 *
 * With the light theme set on the whole app, two more families of utilities
 * need a light value. A white wash (`bg-white/5`, `border-white/10`,
 * `divide-white/10`) is how the frames lift a row or draw a hairline on Green
 * Coal; on a light surface it vanishes. Accent text (Sky Blue, Alien Green, Red
 * 300, Sun Yellow) is drawn for a dark ground and drops to 1.1:1 to 3.1:1 on
 * white.
 *
 * These compile the real preset and read the emitted CSS. Each themed value
 * reads a `--coal-*` property and falls back to the exact channels it painted
 * before, so with nothing set (the dark theme, or under `coal-dark`) the output
 * paints what it always did. A solid white fill, a near-solid one and the
 * accent fills are left fixed.
 */
import { describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import {
  accentColors,
  earthColors,
  extendedAccentColors,
  semanticColors,
} from "../lib/design-tokens";

const CLASSES = [
  "bg-white",
  "bg-white/5",
  "bg-white/40",
  "bg-white/[0.41]",
  "bg-white/90",
  "bg-white/[0.04]",
  "hover:bg-white/10",
  "border-white",
  "border-white/10",
  "border-t-white/5",
  "divide-white/10",
  "text-white-fixed",
  "text-sky-blue",
  "text-sky-blue/60",
  "text-alien-green",
  "text-alien-green-bright",
  "text-skai-green",
  "text-skai-green-300",
  "text-skai-green-opacity-24",
  "text-skai-red",
  "text-skai-red-300",
  "text-sun-yellow",
  "bg-sky-blue",
  "border-sky-blue",
  "bg-alien-green",
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

describe("a white wash follows the theme, a white fill does not", () => {
  it("leaves solid white exactly as the hex compiled", async () => {
    const css = await compile();
    expect(rule(css, ".bg-white")).toEqual({
      "--tw-bg-opacity": "1",
      "background-color": "rgb(255 255 255 / var(--tw-bg-opacity, 1))",
    });
    expect(rule(css, ".border-white")["border-color"]).toBe("rgb(255 255 255 / var(--tw-border-opacity, 1))");
  });

  it.each([
    [".bg-white\\/5", "background-color", "0.05"],
    [".bg-white\\/40", "background-color", "0.4"],
    [".bg-white\\/\\[0\\.04\\]", "background-color", "0.04"],
    [".hover\\:bg-white\\/10:hover", "background-color", "0.1"],
    [".border-white\\/10", "border-color", "0.1"],
    [".border-t-white\\/5", "border-top-color", "0.05"],
  ])("%s reads --coal-wash at its own alpha", async (selector, prop, alpha) => {
    const css = await compile();
    expect(rule(css, selector)[prop]).toBe(`rgb(var(--coal-wash, 255 255 255) / ${alpha})`);
  });

  it("covers divide washes too", async () => {
    const css = await compile();
    expect(css).toMatch(/\.divide-white\\\/10 > :not\(\[hidden\]\) ~ :not\(\[hidden\]\) \{\s*border-color: rgb\(var\(--coal-wash, 255 255 255\) \/ 0\.1\)/);
  });

  it.each([
    [".bg-white\\/\\[0\\.41\\]", "0.41"],
    [".bg-white\\/90", "0.9"],
  ])("keeps %s, above 40%, a fixed white", async (selector, alpha) => {
    const css = await compile();
    expect(rule(css, selector)["background-color"]).toBe(`rgb(255 255 255 / ${alpha})`);
  });
});

describe("accent text takes the theme's cut of its hue", () => {
  it.each([
    [".text-sky-blue", "coal-accent-sky", accentColors.skyBlue],
    [".text-alien-green", "coal-accent-green", accentColors.alienGreen],
    [".text-alien-green-bright", "coal-accent-green", extendedAccentColors.alienGreenBright],
    [".text-skai-green", "coal-accent-green", semanticColors.green[300]],
    [".text-skai-green-300", "coal-accent-green", semanticColors.green[300]],
    [".text-skai-red", "coal-accent-red", semanticColors.red[300]],
    [".text-skai-red-300", "coal-accent-red", semanticColors.red[300]],
    [".text-sun-yellow", "coal-accent-yellow", earthColors.sunYellow],
  ])("%s reads --%s with its own channels as the fallback", async (selector, name, hex) => {
    const css = await compile();
    expect(rule(css, selector).color).toBe(`rgb(var(--${name}, ${triplet(hex)}) / var(--tw-text-opacity, 1))`);
  });

  it("keeps an opacity modifier on the themed value", async () => {
    const css = await compile();
    expect(rule(css, ".text-sky-blue\\/60").color).toBe(`rgb(var(--coal-accent-sky, ${triplet(accentColors.skyBlue)}) / 0.6)`);
  });

  it("leaves the semi-transparent tokens and every accent fill fixed", async () => {
    const css = await compile();
    expect(rule(css, ".text-skai-green-opacity-24").color).toBe(semanticColors.green.opacity24);
    for (const selector of [".bg-sky-blue", ".border-sky-blue", ".bg-alien-green"]) {
      expect(Object.values(rule(css, selector)).join(" ")).not.toContain("var(--coal");
    }
  });
});

describe("text-white-fixed", () => {
  it("is white in every theme, for text on a fill made to carry white", async () => {
    const css = await compile();
    expect(rule(css, ".text-white-fixed")).toEqual({
      "--tw-text-opacity": "1",
      color: "rgb(255 255 255 / var(--tw-text-opacity, 1))",
    });
  });
});
