/**
 * The token switch (2026-09-24): every code token that names a Figma token
 * carries Figma's value.
 *
 * The oracle is the Skai-Design export in figma/tokens/*.json (read from the
 * library file TyX8YAtNDEIvsnSLQ3IXId), never a constant of this package, so
 * a token moved away from the design fails here by its Figma name.
 *
 * radiusScaleIsShadowed.test.ts used to pin the old arrangement, where the
 * preset overrode sm / md / lg off `--radius` and the app painted sm 8 /
 * md 10 / lg 12 / xl 16 / 2xl 24 against Figma's 2 / 6 / 8 / 12 / 16. It now
 * pins that nothing overrides the constant; this file pins the constant to
 * Figma.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import resolveConfig from "tailwindcss/resolveConfig";
import skaiPreset from "../lib/tailwind-preset";
import {
  accentColors,
  semanticColors,
  skaiBorderRadius,
  skaiFontSizes,
} from "../lib/design-tokens";
import { colors as tkColors } from "../lib/tokens";

const ROOT = path.resolve(__dirname, "..", "..");
const readJson = (p: string) => JSON.parse(readFileSync(path.join(ROOT, p), "utf8"));

type FigmaVariable = { modes: Record<string, number | string> };
type FigmaText = { ff: string | null; fs: number; fw: string | number; lh: number | string; ls: string };

const variables: Record<string, FigmaVariable> = readJson("figma/tokens/variables.json").variables;
const paints: Record<string, { paints: unknown[] }> = readJson("figma/tokens/paint-styles.json");
const texts: Record<string, FigmaText> = readJson("figma/tokens/text-styles.json");

const theme = resolveConfig({ content: [], presets: [skaiPreset] }).theme as unknown as {
  borderRadius: Record<string, string>;
  fontSize: Record<string, [string, Record<string, string>]>;
};

/** "8px" / "0.5rem" / "0" to pixels. */
function px(value: string): number {
  const v = value.trim();
  if (v === "0") return 0;
  const m = /^(-?[\d.]+)(px|rem)$/.exec(v);
  if (!m) throw new Error(`not a length: ${value}`);
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1]);
}

/** A Figma paint as "#RRGGBB" or "#RRGGBB@alpha". */
function paint(name: string): string {
  const p = paints[name]?.paints?.[0];
  if (typeof p !== "string") throw new Error(`no solid paint style ${name}`);
  return p.toUpperCase();
}

/** A code colour ("#rrggbb" or "rgba(r, g, b, a)") in the same form. */
function colour(value: string): string {
  const hex = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (hex) return `#${hex[1].toUpperCase()}`;
  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/.exec(value.trim());
  if (!rgba) throw new Error(`not a colour: ${value}`);
  const h = [1, 2, 3].map((i) => Number(rgba[i]).toString(16).padStart(2, "0")).join("").toUpperCase();
  return `#${h}@${Number(rgba[4])}`;
}

describe("radius: the class of each Figma variable's name paints that variable's value", () => {
  const radiusVars = Object.entries(variables).filter(([n]) => n.startsWith("border-radius/"));
  const keyOf = (name: string) => name.replace("border-radius/rounded", "").replace(/^-/, "") || "DEFAULT";

  it("reads the Figma radius variables", () => {
    expect(radiusVars.length).toBe(11);
  });

  for (const [name, v] of radiusVars) {
    const key = keyOf(name);
    if (key === "4xl" || key === "5xl") continue;
    it(`rounded${key === "DEFAULT" ? "" : `-${key}`} is ${v.modes["Mode 1"]}px (${name})`, () => {
      expect(theme.borderRadius[key], `theme has ${key}`).toBeDefined();
      expect(px(theme.borderRadius[key])).toBe(v.modes["Mode 1"]);
    });
  }

  it("lacks only rounded-4xl and rounded-5xl, whose two modes disagree", () => {
    const missing = radiusVars.map(([n]) => keyOf(n)).filter((k) => theme.borderRadius[k] === undefined);
    expect(missing.sort()).toEqual(["4xl", "5xl"]);
  });

  it("skaiBorderRadius is what the preset paints: nothing overrides it", () => {
    for (const [key, value] of Object.entries(skaiBorderRadius)) {
      expect(theme.borderRadius[key], key).toBe(value);
    }
  });
});

describe("colours: code tokens named for a Figma paint style hold its value", () => {
  const cases: Array<[string, string, string]> = [
    ["Primary/Alien Green 300", "accentColors.alienGreen", accentColors.alienGreen],
    ["App/Green 300", "semanticColors.green[300]", semanticColors.green[300]],
    ["App/Green-O", "semanticColors.green.opacity24", semanticColors.green.opacity24],
    ["App/Red 300", "semanticColors.red[300]", semanticColors.red[300]],
    ["App/Red-O", "semanticColors.red.opacity34", semanticColors.red.opacity34],
    ["Primary/Sky Blue 300", "accentColors.skyBlue", accentColors.skyBlue],
    ["App/Green 300", "tokens colors.app.green300", tkColors.app.green300],
    ["App/Red-O", "tokens colors.app.redO", tkColors.app.redO],
  ];
  for (const [figma, where, value] of cases) {
    it(`${where} is ${figma}`, () => {
      expect(colour(value)).toBe(paint(figma));
    });
  }
});

describe("type: each skaiFontSizes key named for a Figma text style carries it", () => {
  // "Lg/Paragraph 2 600" -> "para-2-semibold"; Md -> -tablet, Sm -> -mobile.
  const ROLE: Record<string, string> = {
    paragraph: "para",
    numbers: "number",
    "sub-headline": "sub",
    "super-headline": "super",
    headline: "headline",
    label: "label",
  };
  function keyFor(style: string): string | null {
    const [bp, rest = ""] = style.split("/");
    const m = /^(.*?)\s+(\d+)(\s*-\s*italics)?\s+(\d{3})$/i.exec(rest.trim());
    if (!m) return null;
    const role = ROLE[m[1].toLowerCase()];
    if (!role) return null;
    const size = { Lg: "", Md: "-tablet", Sm: "-mobile" }[bp];
    if (size === undefined) return null;
    return `${role}-${m[2]}${m[4] === "600" ? "-semibold" : ""}${m[3] ? "-italic" : ""}${size}`;
  }
  const sizes = skaiFontSizes as unknown as Record<string, [string, Record<string, string>]>;
  const matched = Object.entries(texts)
    .map(([name, t]) => ({ name, t, key: keyFor(name) }))
    .filter((x): x is { name: string; t: FigmaText; key: string } => !!x.key && x.key in sizes);

  it("matches most of the preset's named keys to a Figma style", () => {
    expect(matched.length).toBeGreaterThanOrEqual(40);
  });

  for (const { name, t, key } of matched) {
    it(`${key} is ${name}: ${t.ff} ${t.fs}/${t.lh} ${t.fw}`, () => {
      const [size, opts] = sizes[key];
      expect(px(size), "size").toBe(t.fs);
      expect(Math.abs(px(opts.lineHeight) - Number(t.lh)), "line height").toBeLessThanOrEqual(0.1);
      expect(parseInt(String(opts.fontWeight), 10), "weight").toBe(parseInt(String(t.fw), 10));
      expect(opts.letterSpacing, "tracking").toBe(`${parseFloat(t.ls) / 100}em`);
      expect(opts.fontFamily, "family").toContain(`"${t.ff}"`);
      // The resolved preset hands Tailwind the same entry.
      expect(theme.fontSize[key][0]).toBe(size);
    });
  }
});

describe("type: typography.css classes named for a Figma text style carry its Lg values", () => {
  const css = readFileSync(path.join(ROOT, "src/styles/typography.css"), "utf8").replace(/\r\n/g, "\n");
  /** The first (unconditional) declaration block of a class. */
  function rule(cls: string): Record<string, string> {
    const m = new RegExp(`\\n\\.${cls} \\{([^}]*)\\}`).exec(css);
    if (!m) throw new Error(`.${cls} not declared`);
    const out: Record<string, string> = {};
    for (const d of m[1].split(";")) {
      const [k, ...v] = d.split(":");
      if (k.trim()) out[k.trim()] = v.join(":").trim();
    }
    return out;
  }
  const classes: Array<[string, string]> = [
    ["skai-headline-2", "Lg/Headline 2 300"],
    ["skai-headline-3", "Lg/Headline 3 300"],
    ["skai-headline-4", "Lg/Headline 4 300"],
    ["skai-sub-1", "Lg/Sub-headline 1 300"],
    ["skai-sub-2", "Lg/Sub-headline 2 300"],
    ["skai-para-1", "Lg/Paragraph 1 300"],
    ["skai-para-2", "Lg/Paragraph 2 300"],
    ["skai-para-3", "Lg/Paragraph 3 300"],
    ["skai-label-1", "Lg/Label 1 300"],
    ["skai-label-2", "Lg/Label 2 300"],
    ["text-headline-2", "Lg/Headline 2 300"],
    ["text-headline-3", "Lg/Headline 3 300"],
    ["text-headline-4", "Lg/Headline 4 300"],
    ["text-sub-1", "Lg/Sub-headline 1 300"],
    ["text-sub-2", "Lg/Sub-headline 2 300"],
    ["text-para-1", "Lg/Paragraph 1 300"],
    ["text-para-2", "Lg/Paragraph 2 300"],
    ["text-para-3", "Lg/Paragraph 3 300"],
    ["text-number-1", "Lg/Numbers 1 300"],
    ["text-number-2", "Lg/Numbers 2 300"],
    ["text-number-3", "Lg/Numbers 3 300"],
    ["text-number-4", "Lg/Numbers 4 300"],
    ["text-number-5", "Lg/Numbers 5 300"],
    ["text-label-1", "Lg/Label 1 300"],
    ["text-label-2", "Lg/Label 2 300"],
  ];
  for (const [cls, style] of classes) {
    it(`.${cls} is ${style}`, () => {
      const t = texts[style];
      const r = rule(cls);
      expect(r["font-family"], "family").toContain(`"${t.ff}"`);
      expect(px(r["font-size"]), "size").toBe(t.fs);
      expect(px(r["line-height"]), "line height").toBe(t.lh);
      expect(parseInt(r["font-weight"], 10), "weight").toBe(parseInt(String(t.fw), 10));
      expect(r["letter-spacing"], "tracking").toBe(`${parseFloat(t.ls) / 100}em`);
    });
  }
});
