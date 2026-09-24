// figma:tokens diff: compares figma/tokens/*.json with every token source in the code and writes
// figma/tokens/DRIFT.md. Reads files only; changes none of the sources.
//
// For each Figma token, and for each source, a cell says one of:
//   = path          the source names this token and holds the same value
//   ≠ path value    the source names this token and holds a different value
//   ~ path          the source holds this value, under another name
//   —               the source has neither
// Then, per source, the colours / radii / spacings / font sizes it defines that no Figma token holds.

import fs from "node:fs";
import path from "node:path";
import { load, allTokens } from "./tokens-store.mjs";

// ------------------------------------------------------------------ sources

export const SOURCES = [
  { id: "DT", side: "ui", file: "src/lib/design-tokens.ts" },
  { id: "TP", side: "ui", file: "src/lib/tailwind-preset.ts" },
  { id: "TK", side: "ui", file: "src/lib/tokens.ts" },
  { id: "DC", side: "ui", file: "src/lib/design-tokens.css" },
  { id: "DJ", side: "ui", file: "src/lib/design-tokens.figma.json" },
  { id: "SD", side: "ui", file: "src/design-tokens.css" },
  { id: "TC", side: "ui", file: "src/lib/theme-config.ts" },
  { id: "ST", side: "ui", file: "src/styles/*.css" },
  { id: "AI", side: "app", file: "src/index.css" },
  { id: "AT", side: "app", file: "tailwind.config.ts" },
];

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

// ------------------------------------------------------------------ TS / JS object literals

function tokenize(src) {
  const toks = [];
  let i = 0;
  let line = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === "\n") {
      line++;
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\r") {
      i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const j = src.indexOf("*/", i + 2);
      const end = j < 0 ? n : j + 2;
      for (let k = i; k < end; k++) if (src[k] === "\n") line++;
      i = end;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const s = i;
      const l0 = line;
      let j = i + 1;
      let v = "";
      while (j < n && src[j] !== c) {
        if (src[j] === "\\") {
          v += src[j + 1];
          j += 2;
          continue;
        }
        if (src[j] === "\n") line++;
        v += src[j];
        j++;
      }
      toks.push({ t: "str", v, s, e: j + 1, line: l0 });
      i = j + 1;
      continue;
    }
    if (c === "." && src[i + 1] === "." && src[i + 2] === ".") {
      toks.push({ t: "spread", v: "...", s: i, e: i + 3, line });
      i += 3;
      continue;
    }
    if (/[A-Za-z0-9_$.#%]/.test(c)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_$.#%]/.test(src[j])) j++;
      toks.push({ t: "id", v: src.slice(i, j), s: i, e: j, line });
      i = j;
      continue;
    }
    toks.push({ t: "p", v: c, s: i, e: i + 1, line });
    i++;
  }
  return toks;
}

/** Entries of every `const NAME = {…}` / `export default {…}` object literal: {path, raw, str, line}. */
export function extractTs(src) {
  const toks = tokenize(src);
  const out = [];
  const at = (i) => toks[i] || { t: "eof", v: "", s: src.length, e: src.length, line: 0 };
  const isOpen = (tk) => tk.t === "p" && (tk.v === "{" || tk.v === "[" || tk.v === "(");
  const isClose = (tk) => tk.t === "p" && (tk.v === "}" || tk.v === "]" || tk.v === ")");

  function skipValue(i) {
    let depth = 0;
    while (i < toks.length) {
      const tk = toks[i];
      if (isOpen(tk)) depth++;
      else if (isClose(tk)) {
        if (depth === 0) return i;
        depth--;
      } else if (depth === 0 && tk.t === "p" && tk.v === ",") return i;
      i++;
    }
    return i;
  }
  function scalar(i, pth) {
    const end = skipValue(i);
    if (end > i) {
      const first = toks[i];
      const last = toks[end - 1];
      let raw = src.slice(first.s, last.e).replace(/\s+as\s+[\w.<>[\]|, ]+$/, "").replace(/\s+satisfies\s+\w+$/, "").trim();
      const str = end - i === 1 && first.t === "str" ? first.v : null;
      if (str !== null) raw = str;
      out.push({ path: pth, raw, str, line: first.line });
    }
    return end;
  }
  function value(i, pth) {
    const tk = at(i);
    if (tk.t === "p" && tk.v === "{") return object(i + 1, pth);
    if (tk.t === "p" && tk.v === "[") return array(i + 1, pth);
    return scalar(i, pth);
  }
  function object(i, pth) {
    for (;;) {
      const tk = at(i);
      if (tk.t === "eof") return i;
      if (tk.t === "p" && tk.v === "}") {
        i++;
        // trailing `as const` / `satisfies X`
        return i;
      }
      if (tk.t === "p" && tk.v === ",") {
        i++;
        continue;
      }
      if (tk.t === "spread") {
        const end = skipValue(i + 1);
        const expr = src.slice(at(i + 1).s, at(end - 1).e).trim();
        out.push({ path: [...pth, `...${expr}`], raw: expr, spread: expr, line: tk.line });
        i = end;
        continue;
      }
      if ((tk.t === "id" || tk.t === "str") && at(i + 1).t === "p" && at(i + 1).v === ":") {
        i = value(i + 2, [...pth, tk.v]);
        continue;
      }
      if (tk.t === "p" && tk.v === "[") {
        // computed key: skip the entry
        i = skipValue(skipValue(i + 1) + 1);
        continue;
      }
      // shorthand, method, or something unparseable: skip to the next comma at this depth
      const end = skipValue(i);
      i = end === i ? i + 1 : end;
    }
  }
  function array(i, pth) {
    let idx = 0;
    for (;;) {
      const tk = at(i);
      if (tk.t === "eof") return i;
      if (tk.t === "p" && tk.v === "]") return i + 1;
      if (tk.t === "p" && tk.v === ",") {
        i++;
        idx++;
        continue;
      }
      const next = value(i, [...pth, String(idx)]);
      i = next === i ? i + 1 : next;
    }
  }
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    if (tk.t === "id" && (tk.v === "const" || tk.v === "let" || tk.v === "var") && at(i + 1).t === "id") {
      // const NAME [: Type] = {  or  = [
      let j = i + 2;
      let depth = 0;
      while (j < toks.length) {
        const x = toks[j];
        if (x.t === "p" && x.v === "<") depth++;
        else if (x.t === "p" && x.v === ">") depth--;
        else if (depth === 0 && x.t === "p" && (x.v === "=" || x.v === ";")) break;
        j++;
      }
      if (at(j).v === "=" && (at(j + 1).v === "{" || at(j + 1).v === "[")) i = value(j + 1, [at(i + 1).v]) - 1;
    } else if (tk.t === "id" && tk.v === "default" && at(i - 1).v === "export" && at(i + 1).v === "{") {
      i = value(i + 1, ["default"]) - 1;
    }
  }
  return out;
}

// Materialise `...ident` spreads and bare `ident` values that name another object parsed from the same side.
export function resolveTsRefs(entries, pool) {
  const byRoot = new Map();
  for (const e of pool) {
    const r = e.path[0];
    if (!byRoot.has(r)) byRoot.set(r, []);
    byRoot.get(r).push(e);
  }
  const lookup = (expr) => {
    const parts = String(expr)
      .replace(/\s+as\s+.*$/, "")
      .replace(/\[\s*["']?([^\]"']+)["']?\s*\]/g, ".$1")
      .split(".");
    const rows = byRoot.get(parts[0]);
    if (!rows) return null;
    const pre = parts;
    const hit = rows.filter((r) => pre.every((p, k) => r.path[k] === p) && r.path.length > pre.length);
    if (hit.length) return { rows: hit, depth: pre.length };
    const leaf = rows.find((r) => r.path.length === pre.length && pre.every((p, k) => r.path[k] === p) && !r.spread);
    return leaf ? { rows: [leaf], depth: pre.length, leaf: true } : null;
  };
  const out = [];
  for (const e of entries) {
    const expr = e.spread || (e.str === null && /^[A-Za-z_$][\w$.]*(\[[^\]]+\])*(\.[\w$]+)*(\s+as\s+\w+)?$/.test(e.raw) ? e.raw : null);
    const found = expr ? lookup(expr) : null;
    if (!found) {
      out.push(e);
      continue;
    }
    const base = e.spread ? e.path.slice(0, -1) : e.path;
    if (found.leaf) out.push({ ...found.rows[0], path: e.path, line: e.line, via: expr, viaLine: found.rows[0].line });
    else for (const r of found.rows) out.push({ ...r, path: [...base, ...r.path.slice(found.depth)], via: expr, viaLine: e.line });
  }
  // A key written after a spread overrides it: keep the last entry for each path.
  const last = new Map();
  out.forEach((e, i) => last.set(e.path.join("\u0000"), i));
  return out.filter((e, i) => last.get(e.path.join("\u0000")) === i);
}

// ------------------------------------------------------------------ CSS

const TYPO_PROPS = new Set(["font-size", "line-height", "letter-spacing", "font-weight", "font-family"]);

/** Custom properties (with their selector) and the font declarations of class rules. */
export function extractCss(src) {
  const out = [];
  let line = 1;
  const stack = [];
  let buf = "";
  let bufLine = 1;
  const text = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "\n") line++;
    if (c === "{") {
      stack.push(buf.trim().replace(/\s+/g, " "));
      buf = "";
      bufLine = line;
    } else if (c === "}") {
      decls(buf, bufLine);
      stack.pop();
      buf = "";
      bufLine = line;
    } else if (c === ";") {
      decls(buf, bufLine);
      buf = "";
      bufLine = line;
    } else {
      if (!buf.trim()) bufLine = line;
      buf += c;
    }
  }
  function decls(chunk, l) {
    const m = /^\s*(--[\w-]+|[a-z-]+)\s*:\s*([\s\S]+?)\s*$/.exec(chunk);
    if (!m) return;
    const sel = stack.filter((s) => !s.startsWith("@")).pop() || ":root";
    const media = stack.filter((s) => s.startsWith("@")).join(" ");
    const prop = m[1];
    const raw = m[2].replace(/\s*!important$/, "");
    if (prop.startsWith("--")) out.push({ path: [sel, prop], raw, str: raw, line: l + (chunk.match(/^\s*\n/g) || []).length, ctx: sel, media });
    else if (TYPO_PROPS.has(prop) && /\./.test(sel)) out.push({ path: [sel, prop], raw, str: raw, line: l, ctx: sel, media, decl: true });
  }
  return out;
}

// ------------------------------------------------------------------ JSON

export function extractJson(src) {
  const obj = JSON.parse(src);
  const lines = src.split("\n");
  const out = [];
  const walk = (x, pth) => {
    if (x && typeof x === "object" && !Array.isArray(x)) for (const [k, v] of Object.entries(x)) walk(v, [...pth, k]);
    else if (Array.isArray(x)) x.forEach((v, i) => walk(v, [...pth, String(i)]));
    else {
      const key = pth[pth.length - 1];
      const at = lines.findIndex((l) => l.includes(`"${key}"`) && l.includes(String(x)));
      out.push({ path: pth, raw: String(x), str: typeof x === "string" ? x : null, line: at >= 0 ? at + 1 : null });
    }
  };
  walk(obj, []);
  return out;
}

// ------------------------------------------------------------------ values

const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [clamp(f(0) * 255), clamp(f(8) * 255), clamp(f(4) * 255)];
}
const hex2 = (x) => x.toString(16).padStart(2, "0").toUpperCase();

/** {r,g,b,a} from #hex, rgb()/rgba(), hsl()/hsla(), or a bare "H S% L%" triplet; else null. */
export function parseColor(raw) {
  const s = String(raw).trim();
  let m = /^#([0-9a-f]{3,8})$/i.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 100) / 100 : 1 };
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(s);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: alpha(m[4]) };
  m = /^(?:hsla?\()?\s*(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)?$/i.exec(s);
  if (m && (s.startsWith("hsl") || !/[()]/.test(s))) {
    const [r, g, b] = hslToRgb(+m[1], +m[2], +m[3]);
    return { r, g, b, a: alpha(m[4]) };
  }
  if (/^white$/i.test(s)) return { r: 255, g: 255, b: 255, a: 1 };
  if (/^black$/i.test(s)) return { r: 0, g: 0, b: 0, a: 1 };
  return null;
}
function alpha(x) {
  if (x === undefined) return 1;
  const v = x.endsWith("%") ? parseFloat(x) / 100 : parseFloat(x);
  return Math.round(v * 100) / 100;
}
export const colorText = (c) => `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}${c.a < 1 ? `@${c.a}` : ""}`;
/** Same colour within 2/255 per channel (HSL triplets round) and 0.02 alpha. */
export const sameColor = (a, b) => !!a && !!b && Math.abs(a.r - b.r) <= 2 && Math.abs(a.g - b.g) <= 2 && Math.abs(a.b - b.b) <= 2 && Math.abs(a.a - b.a) <= 0.02;

/** A Figma paint string ("#17F9B4@0.24") as a colour. */
export function figmaColor(s) {
  const m = /^(#[0-9A-F]{6})([0-9A-F]{2})?(?:@([\d.]+))?$/i.exec(String(s));
  if (!m) return null;
  const c = parseColor(m[1]);
  if (m[2]) c.a = Math.round((parseInt(m[2], 16) / 255) * 100) / 100;
  if (m[3]) c.a = +m[3];
  return c;
}

/** Pixels from px / rem / a bare 0 / calc(a ± b); null otherwise. */
export function parsePx(raw) {
  const s = String(raw).trim();
  let m = /^(-?[\d.]+)px$/.exec(s);
  if (m) return +m[1];
  m = /^(-?[\d.]+)rem$/.exec(s);
  if (m) return Math.round(+m[1] * 16 * 100) / 100;
  if (/^0$/.test(s)) return 0;
  m = /^calc\(\s*(.+?)\s*([+-])\s*(.+?)\s*\)$/.exec(s);
  if (m) {
    const a = parsePx(m[1]);
    const b = parsePx(m[3]);
    if (a !== null && b !== null) return m[2] === "+" ? a + b : a - b;
  }
  return null;
}

/** Replaces var(--x) with the value defined for it (first definition, :root preferred), recursively. */
export function makeVarResolver(cssEntries) {
  const defs = new Map();
  for (const e of cssEntries) {
    const name = e.path[1];
    if (!name.startsWith("--")) continue;
    if (!defs.has(name)) defs.set(name, []);
    defs.get(name).push(e);
  }
  // A theme-level definition: :root (or html/body), inside @layer but not inside @media.
  const base = (x) => /(^|,\s*)(:root|html|body)\b/.test(x.ctx) && !/@media/.test(x.media || "");
  // The file's own definition first (a file's var() names its own tokens), then the input order, which the caller
  // sets to the stylesheet that side actually ships.
  const pick = (name, fromFile) => {
    const d = defs.get(name);
    if (!d) return null;
    const own = d.filter((x) => x.file === fromFile);
    const pool = own.length ? own : d;
    return (pool.find(base) || pool.find((x) => !/@media/.test(x.media || "")) || pool[0]).raw;
  };
  // A var whose theme-level definitions disagree across the scanned CSS: which one paints depends on load order.
  const conflicts = new Map();
  for (const [name, d] of defs) {
    const vals = [...new Set(d.filter(base).map((x) => String(x.raw).replace(/\s+/g, " ").trim()))];
    if (vals.length > 1) conflicts.set(name, d.filter(base).map((x) => `${x.raw} in ${x.file}`));
  }
  const resolve = (raw, fromFile, used, depth = 0) => {
    if (depth > 6) return raw;
    return String(raw).replace(/var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/g, (all, name, fb) => {
      const v = pick(name, fromFile);
      if (v !== null) {
        if (used && conflicts.has(name)) used.add(name);
        return resolve(v, fromFile, used, depth + 1);
      }
      return fb !== undefined ? resolve(fb, fromFile, used, depth + 1) : all;
    });
  };
  const hslVar = (raw) => String(raw).replace(/hsla?\(\s*([-\d.]+(?:deg)?\s+[\d.]+%\s+[\d.]+%)\s*(?:\/\s*([\d.]+%?))?\s*\)/g, (all, trip, a) => (a ? `hsl(${trip} / ${a})` : `hsl(${trip})`));
  return {
    resolve: (raw, fromFile) => hslVar(resolve(raw, fromFile)),
    resolveTracked: (raw, fromFile) => {
      const used = new Set();
      const value = hslVar(resolve(raw, fromFile, used));
      return { value, conflicted: [...used] };
    },
    conflicts,
    defs,
  };
}

// ------------------------------------------------------------------ reading the sources

function readSource(uiRoot, appRoot, s) {
  const base = s.side === "ui" ? uiRoot : appRoot;
  const files = s.file.includes("*")
    ? fs
        .readdirSync(path.join(base, path.dirname(s.file)))
        .filter((f) => f.endsWith(path.extname(s.file)))
        .sort()
        .map((f) => path.join(path.dirname(s.file), f).replace(/\\/g, "/"))
    : [s.file];
  const entries = [];
  const missing = [];
  for (const rel of files) {
    const abs = path.join(base, rel);
    if (!fs.existsSync(abs)) {
      missing.push(rel);
      continue;
    }
    const src = fs.readFileSync(abs, "utf8").replace(/\r\n/g, "\n");
    const rows = rel.endsWith(".css") ? extractCss(src) : rel.endsWith(".json") ? extractJson(src) : extractTs(src);
    for (const r of rows) entries.push({ ...r, file: rel, kind: rel.endsWith(".css") ? "css" : rel.endsWith(".json") ? "json" : "ts" });
  }
  return { ...s, files, entries, missing };
}

export function readSources(uiRoot, appRoot, list = SOURCES) {
  const read = list.map((s) => readSource(uiRoot, appRoot, s));
  // TS references resolve against every TS object on the same side (the preset spreads design-tokens.ts).
  // References chain (the preset spreads skaiColors, whose values name neutralColors.cloud), so resolve until stable.
  const settle = (rows, pool) => {
    for (let k = 0; k < 5; k++) {
      const next = resolveTsRefs(rows, pool);
      const same = next.length === rows.length && next.every((e, i) => e.raw === rows[i].raw && e.path.join("\u0000") === rows[i].path.join("\u0000"));
      rows = next;
      if (same) break;
    }
    return rows;
  };
  for (const side of ["ui", "app"]) {
    let tsPool = read.filter((s) => s.side === side).flatMap((s) => s.entries.filter((e) => e.kind === "ts"));
    tsPool = settle(tsPool, tsPool);
    for (const s of read.filter((x) => x.side === side)) s.entries = [...settle(s.entries.filter((e) => e.kind === "ts"), tsPool), ...s.entries.filter((e) => e.kind !== "ts")];
  }
  // var() resolves against the CSS of the same side, then the other side (the app consumes skai-ui's CSS too).
  // Resolution order = what each side ships: skai-ui's stylesheet is src/styles/* (build:css), the app's is
  // src/index.css; the loose token CSS files come after.
  const cssOf = (ids) => ids.flatMap((id) => read.filter((s) => s.id === id).flatMap((s) => s.entries.filter((e) => e.kind === "css")));
  const allCss = read.filter((s) => s.entries.some((e) => e.kind === "css")).map((s) => s.id);
  const order = (first) => [...first, ...allCss.filter((id) => !first.includes(id))];
  const resolvers = { ui: makeVarResolver(cssOf(order(["ST"]))), app: makeVarResolver(cssOf(order(["AI", "ST"]))) };
  for (const s of read) {
    for (const e of s.entries) {
      const { value: v, conflicted } = resolvers[s.side].resolveTracked(e.raw, e.file);
      if (conflicted.length) e.conflicted = conflicted.map((n) => ({ name: n, defs: resolvers[s.side].conflicts.get(n) }));
      e.value = v;
      e.color = parseColor(v);
      e.px = parsePx(v);
    }
  }
  return read;
}

// ------------------------------------------------------------------ Figma side

const RADIUS_GROUP = /radius|rounded/i;
const SPACING_GROUP = /spacing|space|gap/i;
const BORDER_GROUP = /borderwidth|border-width|stroke/i;
const OPACITY_GROUP = /opacity/i;
const FONT_GROUP = /font|text|typo|type|headline|para|label|number|sub|super/i;

function category(t) {
  if (t.kind === "paint-style") return "colour";
  if (t.kind === "text-style") return "type";
  if (t.kind === "effect-style") return "effect";
  if (t.kind === "grid-style") return "grid";
  if (t.type === "COLOR") return "colour";
  if (/^border-radius\//.test(t.name)) return "radius";
  if (/^border-width\//.test(t.name)) return "border";
  if (/^opacity\//.test(t.name)) return "opacity";
  if (/^s-/.test(t.name)) return "spacing";
  return "other";
}

/** Candidate normalised names a source might use for a Figma token, per category. */
function nameKeys(t, cat) {
  const leaf = t.name.split("/").pop();
  if (cat === "colour") {
    const keys = new Set([norm(leaf), norm(t.name.replace("/", " "))]);
    const noShade = leaf.replace(/\s+\d{3}$/, "");
    const weak = noShade !== leaf ? new Set([norm(noShade)]) : new Set();
    return { keys, weak };
  }
  if (cat === "radius") {
    const k = leaf.replace(/^rounded-?/, "") || "DEFAULT";
    return { keys: new Set([norm(k)]), weak: new Set([norm(leaf)]), group: RADIUS_GROUP };
  }
  if (cat === "spacing") {
    const k = leaf.replace(/^s-/, "").replace(",", ".");
    return { keys: new Set([k, norm(`s-${k}`)]), weak: new Set(), group: SPACING_GROUP, exactSeg: true };
  }
  if (cat === "border") {
    const k = leaf.replace(/^w-/, "");
    return { keys: new Set([k]), weak: new Set(), group: BORDER_GROUP, exactSeg: true };
  }
  if (cat === "opacity") {
    const k = leaf.replace(/^opacity-/, "");
    return { keys: new Set([k]), weak: new Set(), group: OPACITY_GROUP, exactSeg: true };
  }
  if (cat === "effect") {
    return { keys: new Set([norm(leaf.replace(/\(.*?\)/g, "")), norm(leaf)]), weak: new Set() };
  }
  if (cat === "type") {
    const k = typeKey(t.name);
    return { keys: k ? new Set([norm(k)]) : new Set(), weak: new Set() };
  }
  return { keys: new Set([norm(leaf)]), weak: new Set() };
}

/**
 * "Lg/Paragraph 2 300" -> "para-2", "Md/Sub-headline 2 600" -> "sub-2-semibold-tablet",
 * "Sm/Headline 3 - italics 300" -> "headline-3-italic-mobile": the key scheme skaiFontSizes uses.
 * The trailing number in a Figma style name is not its weight (Paragraph "300" is Manrope Regular).
 */
export function typeKey(name) {
  const [bp, rest = ""] = name.split("/");
  const m = /^(.*?)\s+(\d+)(\s*-\s*italics)?\s+(\d{3})$/i.exec(rest.trim());
  if (!m) return null;
  const ROLE = { paragraph: "para", numbers: "number", "sub-headline": "sub", "super-headline": "super", headline: "headline", label: "label" };
  const role = ROLE[m[1].toLowerCase()] || norm(m[1]);
  const bold = m[4] === "600" ? "-semibold" : "";
  const it = m[3] ? "-italic" : "";
  const size = { Lg: "", Md: "-tablet", Sm: "-mobile" }[bp] ?? `-${bp}`;
  return `${role}-${m[2]}${bold}${it}${size}`;
}

const STRIP = ["skai", "colors", "color", "tw"];
function segNorms(e) {
  const raw = e.path.map((p) => norm(p)).filter(Boolean);
  const out = new Set();
  const add = (s) => {
    out.add(s);
    for (const p of STRIP) if (s.startsWith(p) && s.length > p.length) out.add(s.slice(p.length));
  };
  // Also read each segment without a trailing "colors" (greenCoalColors.100 names Green Coal 100).
  for (const segs of [raw, raw.map((x) => x.replace(/colou?rs?$/, "") || x)]) {
    const n = segs.length;
    if (n) add(segs[n - 1]);
    if (n > 1) add(segs[n - 2] + segs[n - 1]);
    if (n > 2) add(segs[n - 3] + segs[n - 2] + segs[n - 1]);
    if (n > 1 && segs[n - 1] === "default") add(segs[n - 2]);
  }
  return out;
}
const pathText = (e) =>
  (e.kind === "css" ? (e.path[1].startsWith("--") ? e.path[1] : `${e.path[0]} ${e.path[1]}`) : e.path.join(".")) +
  (e.conflicted && e.conflicted.length ? ` [${e.conflicted.map((c) => `${c.name} is ${c.defs.join(" / ")}`).join("; ")}]` : "");

function figmaValue(t, cat) {
  const e = t.entry;
  if (cat === "colour") {
    if (t.kind === "paint-style") {
      const p = e.paints && e.paints[0];
      return typeof p === "string" ? { color: figmaColor(p), text: p } : { grad: p, text: p && p.grad ? `${p.grad.toLowerCase()} ${p.stops.map((s) => s[1]).join(" > ")}` : JSON.stringify(p) };
    }
    const v = Object.values(e.modes)[0];
    return { color: figmaColor(v), text: String(v) };
  }
  if (cat === "type") return { type: e, text: `${e.ff || "(no family)"} ${e.fs}/${e.lh} ${e.fw || "(no weight)"}${e.ls ? ` ls ${e.ls}` : ""}` };
  if (cat === "effect") return { effects: e.effects, text: e.effects.map((x) => (x.o ? `${x.t.toLowerCase()} ${x.o.join(" ")} ${x.r} ${x.c}` : `${x.t.toLowerCase()} ${x.r}`)).join(", ") };
  if (cat === "grid") return { grids: e.grids, text: (e.grids || []).map((g) => (g.pattern === "GRID" ? `grid ${g.sectionSize}px` : `${g.count} ${g.pattern.toLowerCase()}${g.sectionSize !== undefined ? ` of ${g.sectionSize}px` : ""}, gutter ${g.gutterSize}px, ${String(g.alignment).toLowerCase()}${g.offset !== undefined ? `, offset ${g.offset}px` : ""}`)).join("; ") };
  const modes = Object.values(e.modes);
  const v = modes[0];
  const text = modes.length > 1 && modes.some((x) => x !== v) ? `${v} (${Object.entries(e.modes).map(([m, x]) => `${m} ${x}`).join(", ")})` : String(v);
  return { num: v, text };
}

// ------------------------------------------------------------------ matching

function parseShadow(raw) {
  const m = /^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+([\d.]+)(?:px)?(?:\s+(-?[\d.]+)(?:px)?)?\s+(.+)$/.exec(String(raw).trim());
  if (!m) return null;
  return { x: +m[1], y: +m[2], r: +m[3], sp: m[4] ? +m[4] : 0, color: parseColor(m[5]) };
}

function typeGroup(entries, e, key) {
  const k = e.path.findIndex((p) => norm(p) === key || STRIP.some((s) => norm(p) === s + key));
  const pre = e.path.slice(0, k + 1).join("\u0000");
  return entries.filter((x) => x.path.slice(0, k + 1).join("\u0000") === pre && x.file === e.file);
}
function typeProps(group) {
  const o = {};
  for (const x of group) {
    const leaf = x.path[x.path.length - 1];
    const l = norm(leaf);
    if (l === "0" || l === "fontsize") o.fs = x.px;
    else if (l === "lineheight") o.lh = x.px;
    else if (l === "letterspacing") o.ls = x.value;
    else if (l === "fontweight") o.fw = x.value;
    else if (l === "fontfamily") o.ff = x.value;
  }
  return o;
}
function compareType(fig, o) {
  const diffs = [];
  if (o.fs !== undefined && o.fs !== null && o.fs !== fig.fs) diffs.push(`size ${o.fs}`);
  if (o.lh !== undefined && o.lh !== null && typeof fig.lh === "number" && Math.abs(o.lh - fig.lh) > 0.1) diffs.push(`lh ${o.lh}`);
  if (o.ls !== undefined && typeof fig.ls === "string" && fig.ls.endsWith("%")) {
    const want = parseFloat(fig.ls) / 100;
    const m = /^(-?[\d.]+)em$/.exec(String(o.ls).trim());
    if (m && Math.abs(+m[1] - want) > 0.001) diffs.push(`ls ${o.ls}`);
  }
  if (o.fw !== undefined && parseInt(o.fw, 10) !== parseInt(fig.fw, 10)) diffs.push(`weight ${o.fw}`);
  if (o.ff !== undefined && fig.ff && !String(o.ff).toLowerCase().includes(String(fig.ff).toLowerCase()))
    diffs.push(`family ${String(o.ff).slice(0, 30)}${/var\(/.test(o.ff) ? " (a var() no scanned CSS defines)" : ""}`);
  const compared = ["fs", "lh", "ls", "fw", "ff"].filter((k) => o[k] !== undefined && o[k] !== null).length;
  return { diffs, compared };
}

/** One cell for one Figma token in one source. */
export function matchToken(t, cat, fv, src) {
  const { keys, weak, group, exactSeg } = nameKeys(t, cat);
  const entries = src.entries;
  const named = [];
  const weakNamed = [];
  for (const e of entries) {
    if (e.spread) continue;
    const joined = e.path.join(".");
    const cssName = e.kind === "css" && e.path[1].startsWith("--") ? e.path[1] : null;
    if (group) {
      const scope = cssName || (exactSeg ? e.path.slice(0, -1).join(".") : joined);
      if (!group.test(scope)) continue;
      if (cat === "spacing" && /letter/i.test(scope)) continue;
    }
    if (cssName && group) {
      const suffix = (k) => new RegExp("-" + String(k).toLowerCase().replace(/\./g, "-") + "$");
      if ([...keys].some((k) => suffix(k).test(cssName.toLowerCase()))) named.push(e);
      continue;
    }
    if (cat === "type" && e.kind === "css" && !e.decl) continue;
    const segs = exactSeg ? new Set([norm(e.path[e.path.length - 1]), e.path[e.path.length - 1]]) : segNorms(e);
    if (cat === "type") {
      if (!keys.size) continue;
      if (e.path.some((p) => keys.has(norm(p)) || [...keys].some((k) => norm(p) === `skai${k}` || norm(p) === `text${k}`))) named.push(e);
      continue;
    }
    if ([...keys].some((k) => segs.has(k))) named.push(e);
    else if ([...weak].some((k) => segs.has(k))) weakNamed.push(e);
  }
  const valueOk = (e) => {
    if (cat === "colour") return fv.color ? sameColor(e.color, fv.color) : false;
    if (cat === "radius" || cat === "spacing" || cat === "border") return e.px !== null && typeof fv.num === "number" && Math.abs(e.px - fv.num) < 0.01;
    if (cat === "opacity") {
      const x = parseFloat(e.value);
      return Number.isFinite(x) && (Math.abs(x * 100 - fv.num) < 0.01 || Math.abs(x - fv.num) < 0.01);
    }
    if (cat === "effect") {
      const s = parseShadow(e.value);
      const f = fv.effects && fv.effects[0];
      return !!(s && f && f.o && s.x === f.o[0] && s.y === f.o[1] && s.r === f.r && sameColor(s.color, figmaColor(f.c)));
    }
    return false;
  };
  const shown = (e) => (cat === "colour" && e.color ? colorText(e.color) : e.px !== null && e.px !== undefined ? `${e.px}px` : String(e.value).slice(0, 24));

  if (cat === "type" && named.length) {
    const byGroup = new Map();
    for (const e of named) {
      const g = typeGroup(entries, e, [...keys][0]);
      byGroup.set(g.map((x) => x.line).join(","), { g, first: e });
    }
    const results = [...byGroup.values()].map(({ g, first }) => ({ first, ...compareType(fv.type, typeProps(g)) }));
    const good = results.find((r) => r.compared && !r.diffs.length);
    const lbl = (r) => (r.first.kind === "css" ? r.first.path[0] : r.first.path.slice(0, -1).join(".").replace(/\.\d+$/, ""));
    if (good) return { mark: "=", text: `= ${lbl(good)}`, entry: good.first };
    const r = results[0];
    return { mark: "≠", text: `≠ ${lbl(r)} (${r.diffs.join(", ") || "no comparable props"})`, entry: r.first };
  }
  const pick = named.length ? named : weakNamed;
  if (pick.length) {
    const same = pick.find(valueOk);
    if (same) return { mark: "=", text: `= ${pathText(same)}${named.length ? "" : " (no shade)"}`, entry: same };
    const e = pick.find((x) => x.color || x.px !== null) || pick[0];
    if (cat === "colour" && fv.grad) return { mark: "≠", text: `≠ ${pathText(e)}`, entry: e };
    return { mark: "≠", text: `≠ ${pathText(e)} ${shown(e)}${named.length ? "" : " (no shade)"}`, entry: e };
  }
  let byValue = [];
  if (cat === "colour" && fv.grad) {
    const stops = (fv.grad.stops || []).map((s) => figmaColor(s[1])).filter(Boolean);
    byValue = entries.filter((e) => /gradient/i.test(e.value) && stops.every((c) => (String(e.value).match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi) || []).some((x) => sameColor(parseColor(x), c))));
  } else if (cat === "type") byValue = [];
  else if (group)
    byValue = entries.filter((e) => {
      const cssName = e.kind === "css" && e.path[1].startsWith("--") ? e.path[1] : null;
      const scope = cssName || (exactSeg ? e.path.slice(0, -1).join(".") : e.path.join("."));
      return group.test(scope) && !(cat === "spacing" && /letter/i.test(scope)) && valueOk(e);
    });
  else byValue = entries.filter(valueOk);
  if (byValue.length) return { mark: "~", text: `~ ${pathText(byValue[0])}${byValue.length > 1 ? ` +${byValue.length - 1}` : ""}`, entry: byValue[0] };
  return { mark: "—", text: "—" };
}

// A font size is a fontSize / font-size leaf, or element 0 of a Tailwind fontSize tuple; never its lineHeight.
function isFontSize(e) {
  const leaf = norm(e.path[e.path.length - 1]);
  if (leaf === "fontsize") return true;
  return leaf === "0" && e.path.length > 2 && /fontsize/i.test(e.path.slice(0, -2).join("."));
}

// ------------------------------------------------------------------ report

const CAT_TITLES = [
  ["colour", "Colours (paint styles and colour variables)"],
  ["radius", "Corner radius"],
  ["spacing", "Spacing"],
  ["border", "Border width"],
  ["opacity", "Opacity"],
  ["type", "Text styles"],
  ["effect", "Effects"],
  ["grid", "Layout grids"],
  ["other", "Other"],
];

/**
 * Checks on the Figma set itself, each a fact computed from the tokens: several variables claiming one code-syntax
 * name, a text style whose line height is below its font size, and a spacing variable s-N whose value is not 4 x N
 * when every other s-N is (the scale's own rule, measured, not assumed).
 */
export function figmaChecks(tokens) {
  const out = [];
  const bySyntax = new Map();
  for (const t of tokens) {
    const w = t.kind === "variable" && t.entry.codeSyntax && t.entry.codeSyntax.WEB;
    if (w) bySyntax.set(w, [...(bySyntax.get(w) || []), t.name]);
  }
  for (const [w, names] of bySyntax) if (names.length > 1) out.push({ what: "code syntax", text: `${names.length} variables declare the WEB code syntax \`${w}\`: ${names.map((n) => `\`${n}\``).join(", ")}` });
  for (const t of tokens) {
    const e = t.entry;
    if (t.kind === "text-style" && typeof e.lh === "number" && typeof e.fs === "number" && e.lh < e.fs) out.push({ what: "line height", text: `\`${t.name}\` sets ${e.fs}px type on a ${e.lh}px line` });
  }
  const steps = tokens
    .filter((t) => t.kind === "variable" && /^s-\d+(,\d+)?$/.test(t.name))
    .map((t) => ({ t, n: Number(t.name.slice(2).replace(",", ".")), v: Object.values(t.entry.modes || {})[0] }))
    .filter((x) => typeof x.v === "number");
  const on = steps.filter((x) => Math.abs(x.v - x.n * 4) < 0.01);
  if (steps.length >= 4 && on.length >= steps.length - 2) {
    for (const x of steps) if (!on.includes(x)) out.push({ what: "spacing scale", text: `\`${x.t.name}\` is ${x.v}px where ${on.length} of the other ${steps.length - 1} spacing steps are 4 x N (4 x ${x.n} = ${x.n * 4}px)` });
  }
  return out;
}
const cell = (s) => String(s).replace(/\|/g, "\\|");

export function buildDrift(st, sources, meta = {}) {
  const tokens = allTokens(st);
  const uses = new Map();
  for (const run of Object.values(st.sources.runs || {})) for (const [k, u] of Object.entries(run.usesInWalkedFrames || {})) uses.set(k, (uses.get(k) || 0) + u);
  const rows = tokens.map((t) => {
    const cat = category(t);
    const fv = figmaValue(t, cat);
    return { t, cat, fv, uses: uses.get(t.key) || 0, cells: sources.map((s) => matchToken(t, cat, fv, s)) };
  });

  // Values the sources define that Figma has no token for.
  const figColors = rows.filter((r) => r.cat === "colour" && r.fv.color).map((r) => r.fv.color);
  const figNums = (cat) => new Set(rows.filter((r) => r.cat === cat).flatMap((r) => Object.values(r.t.entry.modes || {}).filter((x) => typeof x === "number")));
  const radii = figNums("radius");
  const spaces = figNums("spacing");
  const sizes = new Set(rows.filter((r) => r.cat === "type").map((r) => r.t.entry.fs));
  const orphans = sources.map((s) => {
    const list = [];
    for (const e of s.entries) {
      if (e.spread) continue;
      const j = e.path.join(".");
      if (e.color && !figColors.some((c) => sameColor(c, e.color))) list.push({ what: "colour", e, v: colorText(e.color) });
      else if (e.px !== null && RADIUS_GROUP.test(j) && !radii.has(e.px)) list.push({ what: "radius", e, v: `${e.px}px` });
      else if (e.px !== null && SPACING_GROUP.test(j) && !/letter/i.test(j) && !spaces.has(e.px)) list.push({ what: "spacing", e, v: `${e.px}px` });
      else if (e.px !== null && isFontSize(e) && !sizes.has(e.px)) list.push({ what: "font size", e, v: `${e.px}px` });
    }
    return { s, list };
  });

  const L = [];
  const today = meta.date || new Date().toISOString().slice(0, 10);
  L.push("# Token drift: Figma vs the code's token sources");
  L.push("");
  L.push(`Generated by \`npm run figma:tokens -- diff\` from \`figma/tokens/*.json\` on ${today}. Do not edit by hand: re-run it.`);
  L.push("This report is the input to phase 2 (generating skai-ui's tokens from the Figma set). It changes no source file.");
  L.push("");
  L.push("## Where the Figma side comes from");
  L.push("");
  const lib = st.sources.library;
  const ex = st.sources.export;
  const cols = Object.entries(st.collections);
  const counts = `${st.vars.size} variables, ${st.text.size} text styles, ${st.effect.size} effect styles, ${st.paint.size} paint styles${st.grid && st.grid.size ? `, ${st.grid.size} grid styles` : ""}`;
  const walkOnly = tokens.filter((t) => t.entry.notInLibrary);
  const complete = !!(ex && ex.complete);
  if (complete) {
    L.push(`- ${counts}. The set is COMPLETE: every local collection, variable and style of \`${ex.source}\` (${ex.sourceName}), read from the library file itself (${ex.method}, ${ex.parts.length} checksummed call${ex.parts.length === 1 ? "" : "s"}, last ${String(ex.updatedAt).slice(0, 10)})${walkOnly.length ? `, plus ${walkOnly.length} the frame walk found that the library does not define (flagged \`notInLibrary\`, marked "walk only" below)` : ""}.`);
    L.push(`  - Of the tokens the frame walk had stored before, ${ex.same} are identical to the library's definitions field by field; ${ex.changes.length} differ${ex.changes.length ? `: ${ex.changes.slice(0, 20).map((c) => `\`${c.name}\` ${c.field}`).join(", ")}` : ""}.`);
    const removed = (lib && lib.removed) || [];
    if (removed.length) L.push(`  - Deleted from the library since the read before, and not found by the frame walk, so dropped from the set: ${removed.map((x) => `\`${x.name}\` (${x.kind})`).join(", ")}.`);
    const unread = Object.entries(ex.publish.unread || {}).filter(([, n]) => n);
    L.push(`  - Publish status (the product files see a library token as last published): ${ex.publish.read} of ${ex.publish.of} items read${unread.length ? `; not readable for ${unread.map(([k, n]) => `${n} ${{ v: "variables", ts: "text", ps: "paint", es: "effect", gs: "grid" }[k]}`).join(", ")}${Object.keys(ex.publish.errors || {}).length ? ` (${Object.keys(ex.publish.errors).join("; ")})` : ""}` : ""}; ${tokens.filter((t) => t.entry.publish).length ? `marked: ${tokens.filter((t) => t.entry.publish).map((t) => `\`${t.name}\` ${t.entry.publish}`).join(", ")}` : "none read is UNPUBLISHED or CHANGED"}.`);
  } else {
    L.push(`- ${counts}, read from the tracked frames of the three files${ex ? ` and a library read that is NOT complete (${(ex.why || []).join("; ") || "no reason recorded"})` : ""}: NOT the whole set. Run \`figma:tokens -- library-script\` for the library's own list.`);
  }
  for (const [name, c] of cols) L.push(`- Collection **${name}** (key \`${c.key}\`, modes ${c.modes.join(", ")}${c.variables ? `, ${c.variables} variables` : ""}): ${c.library && c.library.file ? `a local collection of \`${c.library.file}\` (${c.library.fileName}), matched by key` : "NOT matched to a library file"}.`);
  if (lib && lib.match) {
    L.push(`- Library check against \`${lib.file}\` (${lib.fileName}), ${lib.method ? "from the library read" : "from its own local key list"}: ${lib.match.map((m) => `${m.kind} ${m.inLibrary}/${m.stored}`).join(", ")}.`);
    for (const m of lib.match) if (m.notInLibrary.length) L.push(`  - ${m.kind} NOT defined in ${lib.fileName}: ${m.notInLibrary.map((n) => `\`${n}\``).join(", ")}.`);
    if (!lib.method) L.push(`  - The library itself defines ${lib.localCounts.vars} variables, ${lib.localCounts.text} text, ${lib.localCounts.effect} effect and ${lib.localCounts.paint} paint styles; the frames walked use the counts above.`);
  }
  const colourVars = tokens.filter((t) => t.kind === "variable" && t.type === "COLOR");
  L.push(`- Colours are ${st.paint.size} PAINT STYLES; ${colourVars.length ? `the only colour variables are ${colourVars.map((t) => `\`${t.name}\``).join(", ")}` : "no variable holds a colour"}.`);
  L.push(`- The \`uses\` column counts uses in a SAMPLED walk of the product files (0 means not seen in the frames walked, not unused). Coverage per file${complete ? "" : " (tokens used only on frames not walked are missing from this report)"}:`);
  for (const [k, r] of Object.entries(st.sources.runs || {})) {
    const c = r.coverage || {};
    L.push(`  - ${r.fileName} \`${k}\`: ${c.framesWalked} top-level frames walked on ${c.pagesTouched} of ${c.pagesPlanned} tracked pages${c.pagesNotReached && c.pagesNotReached.length ? `; pages not reached: ${c.pagesNotReached.map((x) => `\`${x}\``).join(", ")}` : ""}${r.complete ? "; complete" : "; NOT complete"}.`);
  }
  L.push("");
  L.push("## Sources compared");
  L.push("");
  L.push("| id | file | side | entries parsed |");
  L.push("|---|---|---|---|");
  for (const s of sources) L.push(`| ${s.id} | \`${s.side === "app" ? "../../" : ""}${s.file}\`${s.files.length > 1 ? ` (${s.files.length} files)` : ""}${s.missing.length ? ` MISSING: ${s.missing.join(", ")}` : ""} | ${s.side === "app" ? "app" : "skai-ui"} | ${s.entries.length} |`);
  L.push("");
  L.push("Cells: `= path` the source names this token with the same value; `≠ path value` it names it with a different value;");
  L.push("`~ path` it holds the value under another name; `—` neither. Names are matched per category (a colour by its leaf name,");
  L.push("`rounded-lg` by the radius key `lg`, `s-4` by the spacing key `4`, `Lg/Paragraph 2 300` by the skaiFontSizes key `para-2`);");
  L.push("`var(--x)`, spreads and bare references to another token object are resolved before comparing. Colours compare within");
  L.push("2/255 per channel, because HSL triplets round.");
  L.push("");
  L.push("## Summary");
  L.push("");
  L.push(`| source | = same | ≠ differs | ~ value only | — lacks |`);
  L.push("|---|---|---|---|---|");
  sources.forEach((s, i) => {
    const c = { "=": 0, "≠": 0, "~": 0, "—": 0 };
    for (const r of rows) c[r.cells[i].mark]++;
    L.push(`| ${s.id} | ${c["="]} | ${c["≠"]} | ${c["~"]} | ${c["—"]} |`);
  });
  L.push("");
  for (const [cat, title] of CAT_TITLES) {
    const rs = rows.filter((r) => r.cat === cat);
    if (!rs.length) continue;
    L.push(`## ${title}`);
    L.push("");
    L.push(`| Figma token | value | uses | ${sources.map((s) => s.id).join(" | ")} |`);
    L.push(`|---|---|---|${sources.map(() => "---").join("|")}|`);
    for (const r of rs) L.push(`| \`${cell(r.t.name)}\`${r.t.entry.notInLibrary ? " (walk only: NOT in the library)" : ""}${r.t.entry.publish ? ` (${r.t.entry.publish})` : ""} | ${cell(r.fv.text)} | ${r.uses} | ${r.cells.map((c) => cell(c.text)).join(" | ")} |`);
    L.push("");
  }
  const checks = figmaChecks(tokens);
  L.push("## Checks on the Figma set itself");
  L.push("");
  L.push("Facts computed from the tokens above, for the designer to confirm or fix in the library; none is a code change.");
  L.push("");
  if (checks.length) for (const c of checks) L.push(`- ${c.what}: ${c.text}.`);
  else L.push("- none");
  const unnamed = Object.entries(st.collections).filter(([, c]) => c.modes && c.modes.length > 1 && c.modes.every((m) => /^Mode \d+$/.test(m)));
  if (unnamed.length) L.push(`- modes: ${unnamed.map(([n, c]) => `**${n}** has ${c.modes.length} modes named only ${c.modes.map((m) => `\`${m}\``).join(" / ")}`).join("; ")}, so nothing in the file says which screen or theme each is for.`);
  L.push("");
  L.push("## Values the sources define that Figma has no token for");
  L.push("");
  L.push("Colours matched against every Figma colour (paint styles and colour variables); radii, spacings and font sizes against");
  L.push("the values of Figma's radius, spacing and text-style tokens. `via` names the object a spread or reference came from.");
  L.push("");
  for (const { s, list } of orphans) {
    L.push(`### ${s.id} \`${s.side === "app" ? "../../" : ""}${s.file}\`: ${list.length}`);
    L.push("");
    const byKind = new Map();
    for (const x of list) {
      if (!byKind.has(x.what)) byKind.set(x.what, []);
      byKind.get(x.what).push(x);
    }
    for (const [what, xs] of byKind) {
      L.push(`- ${what} (${xs.length}): ${xs.map((x) => `\`${pathText(x.e)}\` ${x.v}${x.e.line ? ` (${s.files.length > 1 ? `${path.basename(x.e.file)}:` : ":"}${x.e.line})` : ""}${x.e.via ? ` via ${x.e.via}` : ""}`).join("; ")}`);
    }
    if (!list.length) L.push("- none");
    L.push("");
  }
  const marks = { "=": 0, "≠": 0, "~": 0, "—": 0 };
  for (const r of rows) for (const c of r.cells) marks[c.mark]++;
  return { text: L.join("\n") + "\n", rows, orphans, checks, summary: `${rows.length} Figma tokens (${complete ? "complete library set" : "walk only, NOT complete"}) x ${sources.length} sources: ${marks["="]} same, ${marks["≠"]} differ, ${marks["~"]} value-only, ${marks["—"]} lacking; ${orphans.reduce((n, o) => n + o.list.length, 0)} source values with no Figma token; ${checks.length} check(s) on the Figma set` };
}

export function writeDrift(p, uiRoot, appRoot) {
  const st = load(p);
  const sources = readSources(uiRoot, appRoot);
  const out = buildDrift(st, sources);
  fs.writeFileSync(p.drift, out.text);
  return { path: p.drift, summary: out.summary };
}

// ------------------------------------------------------------------ self-test

export async function driftSelfTest() {
  const results = [];
  const check = (name, ok, detail = "") => results.push({ name: `drift: ${name}`, ok: !!ok, detail });
  const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  const fx = path.join(here, "fixtures", "tokens-drift");

  const ts = extractTs(fs.readFileSync(path.join(fx, "ui", "src", "lib", "design-tokens.ts"), "utf8").replace(/\r\n/g, "\n"));
  const get = (p) => ts.find((e) => e.path.join(".") === p);
  check("a nested object key is read with its path and line", get("greenCoalColors.100") && get("greenCoalColors.100").raw === "#123F3C" && get("greenCoalColors.100").line === 3, JSON.stringify(get("greenCoalColors.100")));
  check("a font-size array element and its options are read", get("skaiFontSizes.para-2.0") && get("skaiFontSizes.para-2.0").raw === "0.875rem" && get("skaiFontSizes.para-2.1.lineHeight").raw === "1.125rem");
  check("comments are not read as values", !ts.some((e) => /IGNORED/.test(e.raw)));
  const preset = extractTs(fs.readFileSync(path.join(fx, "ui", "src", "lib", "tailwind-preset.ts"), "utf8").replace(/\r\n/g, "\n"));
  check("a spread is recorded as a spread", preset.some((e) => e.spread === "skaiBorderRadius"));
  check("an import line is not read as a token", !preset.some((e) => e.path[0] === "import"));

  const css = extractCss(":root {\n  --radius: 0.75rem;\n  --primary: 160 84% 55%;\n}\n.dark { --primary: 200 90% 65%; }\n.skai-para-2 { font-size: 14px; line-height: 18px; }\n");
  check("CSS custom properties keep their selector", css.some((e) => e.path[1] === "--primary" && e.ctx === ":root") && css.some((e) => e.path[1] === "--primary" && e.ctx === ".dark"));
  check("CSS class font declarations are read", css.some((e) => e.path[0] === ".skai-para-2" && e.path[1] === "font-size" && e.raw === "14px"));
  const { resolve } = makeVarResolver(css);
  check("var() resolves to the :root definition", resolve("hsl(var(--primary))") === "hsl(160 84% 55%)", resolve("hsl(var(--primary))"));
  check("calc() over a var resolves to pixels", parsePx(resolve("calc(var(--radius) - 2px)")) === 10);
  // Two stylesheets disagree on --radius: a file's own definition wins, the input order decides for others, and
  // the disagreement is reported instead of being resolved silently.
  const two = [
    ...extractCss("@layer base {\n  :root { --radius: 0.75rem; }\n}\n").map((e) => ({ ...e, file: "src/styles/base.css" })),
    ...extractCss(":root { --radius: 0.5rem; }\n").map((e) => ({ ...e, file: "src/design-tokens.css" })),
  ];
  const rv = makeVarResolver(two);
  const fromOther = rv.resolveTracked("var(--radius)", "src/lib/tailwind-preset.ts");
  const fromOwn = rv.resolveTracked("var(--radius)", "src/design-tokens.css");
  check("a var defined inside @layer base still counts as the theme value, in input order", fromOther.value === "0.75rem", fromOther.value);
  check("a file's own definition of a var wins for that file", fromOwn.value === "0.5rem", fromOwn.value);
  check("a var whose theme-level definitions disagree is reported as conflicted", fromOther.conflicted.join() === "--radius" && rv.conflicts.get("--radius").length === 2, JSON.stringify(fromOther));

  check("hex, rgba and hsl parse to the same colour", sameColor(parseColor("#17F9B4"), parseColor("rgb(23, 249, 180)")) && sameColor(parseColor("rgba(23,249,180,0.24)"), figmaColor("#17F9B4@0.24")));
  check("an HSL triplet parses", sameColor(parseColor("197 87% 65%"), parseColor("#56C7F3")), colorText(parseColor("197 87% 65%")));
  check("colours that differ are not the same", !sameColor(parseColor("#2DEDAD"), parseColor("#17F9B4")));
  check("rem is 16px", parsePx("1.125rem") === 18 && parsePx("12px") === 12 && parsePx("0") === 0);
  check("typeKey maps Figma style names to the skaiFontSizes scheme", typeKey("Lg/Paragraph 2 300") === "para-2" && typeKey("Md/Sub-headline 2 600") === "sub-2-semibold-tablet" && typeKey("Sm/Headline 3 - italics 300") === "headline-3-italic-mobile" && typeKey("Lg/Numbers 1 300") === "number-1");

  // End to end over fixture sources and a fixture token store.
  const { paths } = await import("./tokens-store.mjs");
  const p = paths(path.join(fx, "store"));
  const st = load(p);
  const srcs = readSources(path.join(fx, "ui"), path.join(fx, "app"), [
    { id: "DT", side: "ui", file: "src/lib/design-tokens.ts" },
    { id: "TP", side: "ui", file: "src/lib/tailwind-preset.ts" },
    { id: "ST", side: "ui", file: "src/styles/*.css" },
    { id: "AI", side: "app", file: "src/index.css" },
  ]);
  const out = buildDrift(st, srcs, { date: "2026-09-24" });
  const row = (n) => out.rows.find((r) => r.t.name === n);
  const c = (n, id) => row(n) && row(n).cells[srcs.findIndex((s) => s.id === id)];
  check("same name, same colour is '='", c("Primary/Green Coal 100", "DT").mark === "=", c("Primary/Green Coal 100", "DT").text);
  check("same name, different colour is '≠' with the code's value", c("App/Green 300", "DT").mark === "≠" && /#2DEDAD/.test(c("App/Green 300", "DT").text), c("App/Green 300", "DT").text);
  check("value under another name is '~'", c("Primary/Sky Blue 300", "AI").mark === "~" && /--accent/.test(c("Primary/Sky Blue 300", "AI").text), c("Primary/Sky Blue 300", "AI").text);
  check("absent is '—'", c("Accents/Coral 300", "DT").mark === "—");
  check("a radius spread through the preset and overridden off --radius is compared by its painted value", c("border-radius/rounded-lg", "TP").mark === "≠" && /12px/.test(c("border-radius/rounded-lg", "TP").text), c("border-radius/rounded-lg", "TP").text);
  check("a radius that survives the spread matches", c("border-radius/rounded-2xl", "TP").mark === "≠" && /24px/.test(c("border-radius/rounded-2xl", "TP").text) && c("border-radius/rounded-3xl", "TP").mark === "=", `${c("border-radius/rounded-2xl", "TP").text} / ${c("border-radius/rounded-3xl", "TP").text}`);
  check("spacing matches by key and value", c("s-4", "DT").mark === "=" && c("s-0,5", "DT").mark === "=", `${c("s-4", "DT").text} ${c("s-0,5", "DT").text}`);
  check("a text style matches its skaiFontSizes group", c("Lg/Paragraph 2 300", "DT").mark === "≠" && /weight 300/.test(c("Lg/Paragraph 2 300", "DT").text), c("Lg/Paragraph 2 300", "DT").text);
  check("a text style matches a CSS class", c("Lg/Paragraph 2 300", "ST").mark === "=", c("Lg/Paragraph 2 300", "ST").text);
  check("an effect style matches a box-shadow by value", c("Input hint (dark)", "DT").mark === "=", c("Input hint (dark)", "DT").text);
  const orph = out.orphans.find((o) => o.s.id === "DT").list.map((x) => x.v);
  check("a colour with no Figma token is listed", orph.includes("#6366F1"), orph.join(" "));
  check("a colour Figma has is not listed", !orph.includes("#123F3C"));
  check("the report states coverage and the library proof", /NOT complete/.test(out.text) && /matched by key/.test(out.text));
  check("the report is deterministic", buildDrift(st, srcs, { date: "2026-09-24" }).text === out.text);
  check("without a complete library read the report says the set is NOT the whole set", /NOT the whole set/.test(out.text) && !/The set is COMPLETE/.test(out.text));

  // A complete library read, a walk-only token, and the checks on the Figma set itself (in memory, on the fixture).
  const st2 = load(p);
  st2.sources.export = { complete: true, source: "TyX8YAtNDEIvsnSLQ3IXId", sourceName: "Skai-Design", method: "library-read", parts: [{}, {}], updatedAt: "2026-09-24T09:36:52.211Z", same: 5, changes: [], publish: { read: 3, of: 5, unread: { ts: 2 }, errors: { "publish status: not a function": 2 } } };
  [...st2.paint.values()].find((e) => e.name === "Accents/Coral 300").notInLibrary = true;
  const addVar = (key, name, collection, v, web) => st2.vars.set(key, { name, collection, type: "FLOAT", modes: { "Mode 1": v }, remote: true, scopes: [], ...(web ? { codeSyntax: { WEB: web } } : {}) });
  addVar("a000000000000000000000000000000000000001", "s-1", "Spacing", 4);
  addVar("a000000000000000000000000000000000000002", "s-2", "Spacing", 8);
  addVar("a000000000000000000000000000000000000096", "s-96", "Spacing", 348);
  addVar("a0000000000000000000000000000000000004a1", "border-radius/rounded-4xl", "Primatives", 32, "rounded-3xl");
  addVar("a0000000000000000000000000000000000004a2", "border-radius/rounded-5xl", "Primatives", 48, "rounded-3xl");
  st2.text.set("b000000000000000000000000000000000000004", { name: "Lg/Headline 4 300", kind: "text", ff: "Cormorant Garamond", fs: 34, fw: 300, lh: 24, ls: "-4%", tc: "ORIGINAL", td: "NONE", remote: true });
  const out2 = buildDrift(st2, srcs, { date: "2026-09-24" });
  check("a complete library read is stated as the source of the set", /The set is COMPLETE: every local collection, variable and style of `TyX8YAtNDEIvsnSLQ3IXId` \(Skai-Design\)/.test(out2.text), out2.text.split("\n").find((l) => /COMPLETE|NOT the whole/.test(l)));
  check("a walk-only token is marked in its row", /`Accents\/Coral 300` \(walk only: NOT in the library\)/.test(out2.text));
  check("a spacing step off the scale is reported with the value the scale gives", out2.checks.some((c) => c.what === "spacing scale" && /`s-96` is 348px/.test(c.text) && /384px/.test(c.text)) && !out2.checks.some((c) => /`s-4`/.test(c.text)), JSON.stringify(out2.checks));
  check("a line height below the font size is reported", out2.checks.some((c) => c.what === "line height" && /`Lg\/Headline 4 300` sets 34px type on a 24px line/.test(c.text)) && !out2.checks.some((c) => /Paragraph 2/.test(c.text)));
  check("variables sharing one code-syntax name are reported", out2.checks.some((c) => c.what === "code syntax" && /2 variables declare the WEB code syntax `rounded-3xl`/.test(c.text)));
  check("modes named only 'Mode N' are reported", /\*\*Primatives\*\* has 2 modes named only `Mode 1` \/ `Mode 2`/.test(out2.text));
  return results;
}
