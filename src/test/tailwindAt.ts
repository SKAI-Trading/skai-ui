/**
 * Resolves an element's Tailwind classes to the numbers they paint at a viewport width, through
 * this package's own preset, for tests that pin a Figma board's geometry. jsdom applies no
 * stylesheet, so the test reads the theme instead: padding, gap, corner radius and type.
 *
 * Only the md (768) and lg (1024) variants are applied; any other variant (hover:, sm:, group-*)
 * is ignored. Within a variant the utilities apply in Tailwind's own order (p, then px/py, then
 * the single sides; font size before font weight), and md before lg, as the built CSS does.
 */
import resolveConfig from "tailwindcss/resolveConfig";
import skaiPreset from "../lib/tailwind-preset";

type FontSizeEntry = string | [string, string | { lineHeight?: string; letterSpacing?: string; fontWeight?: string }];

const theme = (resolveConfig({ content: [], presets: [skaiPreset] } as never) as unknown as {
  theme: {
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    fontSize: Record<string, FontSizeEntry>;
    fontWeight: Record<string, string>;
    colors: Record<string, string | Record<string, string>>;
  };
}).theme;

export const themeColors = theme.colors;

const SCREENS: Record<string, number> = { md: 768, lg: 1024 };

export interface Painted {
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  gap?: number;
  radius?: number;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: string;
  fontWeight?: number;
}

function px(v: string): number {
  if (v.endsWith("rem")) return parseFloat(v) * 16;
  return parseFloat(v);
}

function scaled(scale: Record<string, string>, key: string): number | undefined {
  const arbitrary = key.match(/^\[(-?[\d.]+)px\]$/);
  if (arbitrary) return Number(arbitrary[1]);
  const v = scale[key];
  return v === undefined ? undefined : px(v);
}

function order(u: string): number {
  if (/^p-/.test(u)) return 0;
  if (/^p[xy]-/.test(u)) return 1;
  if (/^p[trbl]-/.test(u)) return 2;
  if (/^text-/.test(u)) return 3;
  if (/^font-/.test(u)) return 4;
  return 5;
}

function apply(u: string, out: Painted): void {
  const pad = u.match(/^p([xytrbl]?)-(.+)$/);
  if (pad) {
    const v = scaled(theme.spacing, pad[2]);
    if (v === undefined) return;
    const sides = { "": ["pt", "pr", "pb", "pl"], x: ["pr", "pl"], y: ["pt", "pb"], t: ["pt"], r: ["pr"], b: ["pb"], l: ["pl"] }[pad[1]] as (keyof Painted)[];
    for (const s of sides) (out as Record<string, number>)[s] = v;
    return;
  }
  const gap = u.match(/^gap-(.+)$/);
  if (gap) {
    const v = scaled(theme.spacing, gap[1]);
    if (v !== undefined) out.gap = v;
    return;
  }
  const radius = u.match(/^rounded(?:-(.+))?$/);
  if (radius) {
    const v = scaled(theme.borderRadius, radius[1] ?? "DEFAULT");
    if (v !== undefined) out.radius = v;
    return;
  }
  const text = u.match(/^text-(.+)$/);
  if (text && theme.fontSize[text[1]] !== undefined) {
    const entry = theme.fontSize[text[1]];
    const [size, opts] = Array.isArray(entry) ? entry : [entry, undefined];
    out.fontSize = px(size);
    const o = typeof opts === "string" ? { lineHeight: opts } : opts ?? {};
    if (o.lineHeight) out.lineHeight = px(o.lineHeight);
    if (o.letterSpacing) out.letterSpacing = o.letterSpacing;
    if (o.fontWeight) out.fontWeight = Number(o.fontWeight);
    return;
  }
  const weight = u.match(/^font-(.+)$/);
  if (weight && theme.fontWeight[weight[1]] !== undefined) out.fontWeight = Number(theme.fontWeight[weight[1]]);
}

/** What an element's classes paint at `width`. */
export function paintedAt(el: Element, width: number): Painted {
  const layers: string[][] = [[], [], []];
  for (const c of (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean)) {
    const m = c.match(/^(?:(md|lg):)?([^:]+)$/);
    if (!m) continue;
    const layer = m[1] === "md" ? 1 : m[1] === "lg" ? 2 : 0;
    if (layer > 0 && width < SCREENS[m[1]]) continue;
    layers[layer].push(m[2]);
  }
  const out: Painted = {};
  for (const layer of layers) for (const u of [...layer].sort((a, b) => order(a) - order(b))) apply(u, out);
  return out;
}
