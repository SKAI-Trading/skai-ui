#!/usr/bin/env node
// figma:spec and figma:find. Reads the design store (figma/store, figma/tokens) joined with the catalog
// (figma-catalog/registry.json). Nothing here calls Figma: a frame that is not stored says so and prints the
// sync step that would fetch it.
//
//   node figma/read.mjs spec <node | fileKey:node | figma link | title words> [--depth N] [--node <id>] [--json] [--flat]
//   node figma/read.mjs find [<node | title words>] [--file <path>] [--page <text>] [--route <text>]
//                            [--status <s,...>] [--width <px>] [--stored | --missing | --stale] [--limit N] [--json]
//   node figma/read.mjs --self-test

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRenderer, makeTokens, num } from "./lib/render.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const USAGE = `usage:
  npm run figma:spec -- <node | fileKey:node | figma link | title words> [--depth N] [--node <id>] [--json] [--flat]
  npm run figma:find -- [<node | title words>] [--file <path>] [--page <text>] [--route <text>]
                        [--status <s,...>] [--width <px>] [--stored | --missing | --stale] [--limit N] [--json]

spec prints one node per line: TYPE "name" id [x y w×h], then what is set on it: hidden, op, the text and its
style, inst <component> {props}, auto-layout (H/V/G gap pad ai jc, w/h FILL|HUG, abs), r radius, fill,
stroke <paint> <weight> <align>, fx, clip. A token prints as "name (value)" from tokens/, or "name (?)" when
tokens/ does not hold it. (raw) marks a literal where the system has a token: a colour, gap, padding, radius,
or type with no text style.
--depth N stops N levels below the frame, --node <id> prints one layer's subtree, --json prints the stored
spec as it is, --flat prints one line per text node.

find matches a node id or every title word, narrowed by the options. --file matches a frame's implFiles
(a bare file name or a trailing part of the path is enough). --limit defaults to 50; 0 lists every hit.

exit: 0 ok · 1 nothing matched or bad usage · 2 several frames matched · 3 the frame is not stored`;

class UsageError extends Error {}

export function defaultPaths(root = HERE) {
  return { root, tokens: path.join(root, "tokens"), registry: path.join(root, "..", "figma-catalog", "registry.json") };
}

function readJson(file) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`${file} is not valid JSON: ${e.message}`);
  }
}

const colon = (node) => String(node).replace(/^(\d+)-(\d+)$/, "$1:$2");
// Same naming as nodeFile() in lib/pack.mjs, which writes the files: ":" becomes "-" and an instance path's ";"
// becomes "_".
const dash = (node) => String(node).replace(/:/g, "-").replace(/;/g, "_");
const specRel = (fileKey, node) => `store/${fileKey}/${dash(node)}.json`;

const TOKEN_FILES = [
  ["variables", "variables.json"],
  ["textStyles", "text-styles.json"],
  ["effectStyles", "effect-styles.json"],
];

export function openStore(paths) {
  const registry = readJson(paths.registry);
  const index = readJson(path.join(paths.root, "store", "index.json"));
  const files = {};
  const missingTokens = [];
  for (const [key, name] of TOKEN_FILES) {
    files[key] = readJson(path.join(paths.tokens, name));
    if (!files[key]) missingTokens.push(`tokens/${name}`);
  }
  files.paintStyles = readJson(path.join(paths.tokens, "paint-styles.json"));

  const frames = new Map();
  for (const f of Object.values(registry?.frames ?? {})) {
    if (!f?.fileKey || !f?.node) continue;
    const node = colon(f.node);
    const key = `${f.fileKey}:${node}`;
    frames.set(key, { key, fileKey: f.fileKey, node, cat: f, idx: null });
  }
  for (const [key, entry] of Object.entries(index?.frames ?? {})) {
    // A split part is indexed as "<frame key>/<part node>" with partOf; it belongs to its frame, not the list.
    if (entry?.partOf || key.includes("/")) continue;
    let row = frames.get(key);
    if (!row) {
      const [fileKey, ...rest] = key.split(":");
      row = { key, fileKey, node: rest.join(":"), cat: null, idx: null };
      frames.set(key, row);
    }
    row.idx = entry;
  }
  return { paths, registry, index, tokens: makeTokens(files), missingTokens, frames };
}

// Stale is the sync's verdict, read off the index entry: an explicit flag, or a recorded live hash that no
// longer matches the stored one.
function isStale(entry) {
  if (!entry) return false;
  if (entry.stale === true) return true;
  return typeof entry.liveHash === "string" && typeof entry.hash === "string" && entry.liveHash !== entry.hash;
}

function stateOf(store, row) {
  const rel = row.idx?.path ?? specRel(row.fileKey, row.node);
  const file = path.join(store.paths.root, rel);
  const stored = fs.existsSync(file);
  return { rel, file, stored, stale: stored && isStale(row.idx), indexed: !!row.idx, gone: !!row.cat?.gone };
}

function storedLabel(st) {
  if (st.stored) return st.stale ? "stored, stale" : "stored";
  if (st.gone) return "gone";
  return st.indexed ? "not stored (index lists it, file missing)" : "not stored";
}

const titleOf = (row) => row.cat?.title ?? row.idx?.name ?? "";
const pageOf = (row) => row.cat?.page ?? row.idx?.page ?? null;

function widthOf(row) {
  if (typeof row.idx?.w === "number") return row.idx.w;
  for (const v of [row.cat?.measuredViewport, row.cat?.viewport]) {
    const m = /^(\d+(?:\.\d+)?)\s*x/i.exec(v ?? "");
    if (m) return Number(m[1]);
  }
  return null;
}

export function parseRef(query) {
  const q = query.trim();
  const link = /figma\.com\/(?:design|file|proto)\/([A-Za-z0-9]{22})(?:\/[^?#]*)?\?(?:[^#]*&)?node-id=(\d+)(?:-|:|%3A)(\d+)/i.exec(q);
  if (link) return { fileKey: link[1], node: `${link[2]}:${link[3]}` };
  const full = /^([A-Za-z0-9]{22}):(\d+)[:-](\d+)$/.exec(q);
  if (full) return { fileKey: full[1], node: `${full[2]}:${full[3]}` };
  const bare = /^(\d+)[:-](\d+)$/.exec(q);
  if (bare) return { node: `${bare[1]}:${bare[2]}` };
  return null;
}

function matchQuery(store, query) {
  const rows = [...store.frames.values()];
  const ref = parseRef(query);
  if (ref) return rows.filter((r) => r.node === ref.node && (!ref.fileKey || r.fileKey === ref.fileKey));
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return rows.filter((r) => {
    const title = titleOf(r).toLowerCase();
    return words.every((w) => title.includes(w));
  });
}

const sortRows = (rows) =>
  [...rows].sort(
    (a, b) =>
      (pageOf(a) ?? "\uffff").localeCompare(pageOf(b) ?? "\uffff") ||
      titleOf(a).localeCompare(titleOf(b)) ||
      a.key.localeCompare(b.key),
  );

function hitLine(store, row, st = stateOf(store, row)) {
  const w = widthOf(row);
  return [
    row.key,
    pageOf(row) ?? "no page",
    titleOf(row) || "untitled",
    w == null ? "—" : num(w),
    row.cat ? row.cat.status ?? "unknown" : "not catalogued",
    storedLabel(st),
    st.stored ? st.rel : "—",
  ].join(" · ");
}

// The one place that names the sync step (sync.mjs extract-script --file/--nodes, planned by lib/pack.mjs).
function fetchSteps(row) {
  return [
    `  npm run figma:sync -- extract-script --file ${row.fileKey} --nodes ${row.node}`,
    "  (run the printed script with use_figma, save its result as JSON, then)",
    "  npm run figma:sync -- extract-ingest <result.json>",
  ];
}

function figmaLink(store, row) {
  const name = store.registry?.fileKeys?.[row.fileKey];
  return `https://www.figma.com/design/${row.fileKey}/${name ? encodeURIComponent(name) : ""}?node-id=${dash(row.node)}&m=dev`;
}

function header(store, row, st, spec) {
  const b = spec?.tree?.b;
  const w = widthOf(row);
  const size = Array.isArray(b) ? `${num(b[2])}×${num(b[3])}` : w != null ? `${num(w)} wide` : null;
  const lines = [spec?.name ?? (titleOf(row) || row.key), `  key      ${row.key}`];
  lines.push(`  page     ${spec?.page ?? pageOf(row) ?? "no page"}${size ? ` · ${size}` : ""}`);
  if (row.cat) {
    const c = row.cat;
    const bits = [c.section ?? "no section", c.status ?? "unknown"];
    if (c.route) bits.push(`route ${c.route}`);
    if (c.implFiles?.length) bits.push(c.implFiles.join(", "));
    lines.push(`  catalog  ${bits.join(" · ")}`);
  } else {
    lines.push("  catalog  not in figma-catalog/registry.json");
  }
  if (spec) lines.push(`  spec     ${st.rel} · synced ${spec.syncedAt ?? "?"} · hash ${spec.hash ?? "?"}`);
  lines.push(`  figma    ${figmaLink(store, row)}`);
  if (spec && store.missingTokens.length) {
    lines.push(`  tokens   ${store.missingTokens.join(", ")} not found: those names print without a value`);
  }
  if (st.stale) {
    lines.push("STALE: sync saw the live frame change after this spec was stored, so it may not match Figma. Refetch:");
    lines.push(...fetchSteps(row));
  }
  return lines;
}

function footer(s) {
  const bits = [`nodes ${s.nodes}`, `text ${s.text}`, `hidden ${s.hidden}`, `raw ${s.raw}`];
  if (s.unresolved) bits.push(`not in tokens/ ${s.unresolved}`);
  if (s.refs) bits.push(`refs inlined ${s.refs}`);
  if (s.refsMissing.length) bits.push(`refs missing ${s.refsMissing.length}`);
  if (s.cut) bits.push(`below --depth ${s.cut}`);
  return bits.join(" · ");
}

function cmdSpec(store, words, opts, out) {
  const query = words.join(" ").trim();
  if (!query) throw new UsageError("spec needs a node id, a fileKey:node, a figma link or title words");
  let rows = matchQuery(store, query);
  if (rows.length > 1 && !parseRef(query)) {
    const exact = rows.filter((r) => titleOf(r).toLowerCase() === query.toLowerCase());
    if (exact.length === 1) rows = exact;
  }
  if (!rows.length) {
    out(`No catalogued or stored frame matches "${query}".`);
    if (parseRef(query)) out("A layer inside a frame is not listed on its own: find its frame, then pass --node <id>.");
    return 1;
  }
  if (rows.length > 1) {
    out(`${rows.length} frames match "${query}". Name one by its key:`);
    for (const r of sortRows(rows).slice(0, 20)) out(`  ${hitLine(store, r)}`);
    if (rows.length > 20) out(`  and ${rows.length - 20} more: npm run figma:find -- ${query} --limit 0`);
    return 2;
  }

  const row = rows[0];
  const st = stateOf(store, row);
  if (!st.stored) {
    out(...header(store, row, st, null));
    if (st.gone) {
      out(`GONE: the catalog records ${row.key} as gone (it no longer resolves in Figma), so sync cannot fetch it.`);
      return 3;
    }
    out(
      st.indexed
        ? `NOT STORED: store/index.json lists ${st.rel}, but the file is missing.`
        : `NOT STORED: there is no spec at ${st.rel} yet.`,
    );
    out("read.mjs never calls Figma. To fetch this frame (Figma calls, counted against the daily budget):");
    out(...fetchSteps(row));
    return 3;
  }

  const text = fs.readFileSync(st.file, "utf8");
  if (opts.json && !opts.node) {
    out(text.replace(/\s+$/, ""));
    return 0;
  }
  let spec;
  try {
    spec = JSON.parse(text);
  } catch (e) {
    throw new Error(`${st.rel} is not valid JSON: ${e.message}`);
  }
  if (!spec || typeof spec.tree !== "object") throw new Error(`${st.rel} has no tree`);

  // A {ref} part is found through store/index.json ("<frame key>/<part>", which sync.mjs writes under the
  // frame's own directory), else beside the frame, where SCHEMA.md puts it.
  const renderer = createRenderer({
    tokens: store.tokens,
    loadRef: (id) => {
      const part = store.index?.frames?.[`${row.key}/${id}`];
      const tries = [part?.path, specRel(row.fileKey, id)];
      for (const rel of tries) {
        if (!rel) continue;
        const sub = readJson(path.join(store.paths.root, rel));
        if (sub?.tree) return { tree: sub.tree, path: rel };
      }
      return null;
    },
  });
  let root = spec.tree;
  if (opts.node) {
    const id = colon(opts.node);
    root = renderer.find(spec.tree, id);
    if (!root) {
      out(`No layer ${id} in ${st.rel}.`);
      return 1;
    }
    if (opts.json) {
      out(JSON.stringify(root, null, 2));
      return 0;
    }
  }
  const depth = opts.depth ?? Infinity;
  const body = opts.flat ? renderer.flat(root, { depth }) : renderer.tree(root, { depth });
  const s = renderer.stats;

  out(...header(store, row, st, spec));
  if (opts.node) out(`  layer    ${root.id} ${JSON.stringify(root.n ?? "")}`);
  out("", ...body, "", footer(s));
  if (s.refsMissing.length) {
    out(`INCOMPLETE: ${s.refsMissing.length} split subtree(s) not stored (${s.refsMissing.join(", ")}). Re-extract the frame:`);
    out(...fetchSteps(row));
  }
  return 0;
}

const normFile = (p) => p.replace(/\\/g, "/").replace(/^\.\//, "");
const fileMatches = (impl, q) => impl === q || impl.endsWith(`/${q}`) || q.endsWith(`/${impl}`);

function cmdFind(store, words, opts, out) {
  const query = words.join(" ").trim();
  const narrowed = ["file", "page", "route", "status", "width", "stored", "missing", "stale"].some((k) => opts[k] != null);
  if (!query && !narrowed) throw new UsageError("find needs a query or at least one filter");
  if (opts.stored && opts.missing) throw new UsageError("--stored and --missing cannot both hold");

  let rows = query ? matchQuery(store, query) : [...store.frames.values()];
  if (opts.file) {
    const q = normFile(opts.file);
    rows = rows.filter((r) => (r.cat?.implFiles ?? []).some((f) => fileMatches(normFile(f), q)));
  }
  if (opts.page) {
    const q = opts.page.toLowerCase();
    rows = rows.filter((r) => (pageOf(r) ?? "").toLowerCase().includes(q));
  }
  if (opts.route) {
    const q = opts.route.toLowerCase();
    rows = rows.filter((r) => (r.cat?.route ?? "").toLowerCase().includes(q));
  }
  if (opts.status) {
    const want = new Set(opts.status.split(",").map((s) => s.trim()).filter(Boolean));
    rows = rows.filter((r) => want.has(r.cat?.status));
  }
  if (opts.width != null) rows = rows.filter((r) => widthOf(r) === opts.width);

  let hits = sortRows(rows).map((row) => ({ row, st: stateOf(store, row) }));
  if (opts.stored) hits = hits.filter((h) => h.st.stored);
  if (opts.missing) hits = hits.filter((h) => !h.st.stored);
  if (opts.stale) hits = hits.filter((h) => h.st.stale);

  if (opts.json) {
    const list = hits.map(({ row, st }) => ({
      key: row.key,
      page: pageOf(row),
      title: titleOf(row),
      width: widthOf(row),
      status: row.cat ? row.cat.status ?? "unknown" : null,
      stored: st.stored,
      stale: st.stale,
      gone: st.gone,
      path: st.stored ? st.rel : null,
      route: row.cat?.route ?? null,
      implFiles: row.cat?.implFiles ?? [],
    }));
    out(JSON.stringify(list, null, 2));
    return hits.length ? 0 : 1;
  }

  if (!store.index) out("note: store/index.json not found, so no frame is stored yet.");
  if (!store.registry) out("note: figma-catalog/registry.json not found, so only stored frames are searched.");
  if (!hits.length) {
    out("No frames match.");
    return 1;
  }
  const limit = opts.limit ?? 50;
  const shown = limit ? hits.slice(0, limit) : hits;
  for (const { row, st } of shown) out(hitLine(store, row, st));
  const stored = hits.filter((h) => h.st.stored).length;
  const stale = hits.filter((h) => h.st.stale).length;
  const gone = hits.filter((h) => !h.st.stored && h.st.gone).length;
  let summary = `${hits.length} frame(s): ${stored} stored (${stale} stale), ${hits.length - stored - gone} not stored`;
  if (gone) summary += `, ${gone} gone`;
  if (shown.length < hits.length) summary += ` · showing ${shown.length}, --limit 0 lists all`;
  out(summary);
  return 0;
}

const VALUE_FLAGS = new Set(["depth", "node", "file", "page", "route", "status", "width", "limit"]);
const COUNT_FLAGS = new Set(["depth", "width", "limit"]);
const BOOL_FLAGS = new Set(["json", "flat", "stored", "missing", "stale", "help", "self-test"]);

export function parseArgs(argv) {
  const opts = {};
  const words = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      words.push(arg);
      continue;
    }
    const eq = arg.indexOf("=");
    const name = eq < 0 ? arg.slice(2) : arg.slice(2, eq);
    let val = eq < 0 ? undefined : arg.slice(eq + 1);
    if (BOOL_FLAGS.has(name)) {
      if (val !== undefined) throw new UsageError(`--${name} takes no value`);
      opts[name] = true;
      continue;
    }
    if (!VALUE_FLAGS.has(name)) throw new UsageError(`unknown option --${name}`);
    if (val === undefined) {
      val = argv[++i];
      if (val === undefined) throw new UsageError(`--${name} needs a value`);
    }
    if (COUNT_FLAGS.has(name)) {
      if (!/^\d+$/.test(val)) throw new UsageError(`--${name} takes a whole number, got "${val}"`);
      opts[name] = Number(val);
    } else {
      opts[name] = val;
    }
  }
  return { opts, words };
}

export function main(argv, { paths = defaultPaths(), out = (...lines) => console.log(lines.join("\n")) } = {}) {
  try {
    const [cmd, ...rest] = argv;
    if (!cmd || cmd === "--help" || cmd === "help") {
      out(USAGE);
      return cmd ? 0 : 1;
    }
    if (cmd !== "spec" && cmd !== "find") throw new UsageError(`unknown command "${cmd}"`);
    const { opts, words } = parseArgs(rest);
    if (opts.help) {
      out(USAGE);
      return 0;
    }
    const store = openStore(paths);
    return cmd === "spec" ? cmdSpec(store, words, opts, out) : cmdFind(store, words, opts, out);
  } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    out(`read.mjs: ${e.message}`, "", USAGE);
    return 1;
  }
}

// ---------------------------------------------------------------------------------------------- self-test

function selfTest() {
  const fx = path.join(HERE, "lib", "fixtures", "read");
  const paths = { root: fx, tokens: path.join(fx, "tokens"), registry: path.join(fx, "registry.json") };
  const noTokens = { ...paths, tokens: path.join(fx, "no-tokens-dir") };
  let passed = 0;
  let failed = 0;

  const run = (argv, p = paths) => {
    const lines = [];
    const code = main(argv, { paths: p, out: (...l) => lines.push(...l.join("\n").split("\n")) });
    return { code, lines, text: lines.join("\n") };
  };
  const check = (name, ok, detail = "") => {
    if (ok) passed++;
    else {
      failed++;
      console.log(`FAIL ${name}${detail ? `\n     ${detail}` : ""}`);
    }
  };
  const hasLine = (name, res, line) => check(name, res.lines.includes(line), `no line ${JSON.stringify(line)}`);
  const lacks = (name, res, part) => check(name, !res.text.includes(part), `unexpected ${JSON.stringify(part)}`);

  const A = "mhF3BkzlTaGiLzJ7kvpmVc:7710:91527";
  const specA = run(["spec", "7710:91527"]);
  check("spec by node exits 0", specA.code === 0, `exit ${specA.code}`);
  check("spec prints the frame name first", specA.lines[0] === "Skai > Trade > Spot 1VH (1440 x 900px)", specA.lines[0]);
  hasLine("header key", specA, `  key      ${A}`);
  hasLine("header page and size", specA, "  page     ✅ Trade 1 · 1440×900");
  hasLine("header catalog row", specA, "  catalog  trade · partial · route /trade/spot · src/pages/trade/Spot.tsx");
  hasLine("header spec path", specA, "  spec     store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527.json · synced 2026-09-24T08:00:00Z · hash a1b2c3d4e5f60718");
  hasLine("header figma link", specA, "  figma    https://www.figma.com/design/mhF3BkzlTaGiLzJ7kvpmVc/Skai-Web-App-2?node-id=7710-91527&m=dev");
  hasLine("root: multi-mode token, clip", specA, 'FRAME "Skai > Trade > Spot 1VH (1440 x 900px)" 7710:91527 [0 0 1440×900] · fill Surface/Page (Dark #000000 | Light #FFFFFF) · clip');
  hasLine("ref part found through the index, in its frame's directory", specA, '  FRAME "Order book" 7710:91600 [0 64 1064×836] · fill Surface/Card (→ Primary/Green Coal 900 #0A1A1A) · ref store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527/7710-91600.json');
  hasLine("a ref inside a part", specA, '    FRAME "Depth rows" 7710:91602 [0 40 1064×700] · ref store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527/7710-91602.json');
  hasLine("bound typography inside the ref", specA, '    TEXT "Heading" 7710:91601 [16 16 200×20] · "Order book" font/family/display (Manrope) font/size/lg (18)/auto w600 (raw)');
  hasLine("layout, radius, raw fill, stroke, effect style", specA, '  FRAME "Order panel" 7710:91528 [1080 64 344×520] · V gap s-6 (24) pad s-4 (16) ai CENTER · r rounded-xl (12) · fill #052D2D (raw) · stroke Primary/Green Coal 200@0.5 (#1A3A3A) 1 INSIDE · fx Shadow/Card (drop-shadow 0,4 blur 12 #00000040)');
  hasLine("instance with variant props", specA, '    INSTANCE "Buy button" 7710:91529 [16 16 312×48] · inst Button {Size=Lg, State=Default}');
  hasLine("text with a style", specA, '      TEXT "Label" I7710:91529;1:2 [120 15 72×18] · "Buy Yes" Lg/Paragraph 2 300 (Manrope 14/18 w300) · fill Primary/Green Coal 200 (#1A3A3A)');
  hasLine("hidden node, raw type, raw colour with opacity", specA, '    TEXT "Hint" 7710:91530 [16 80 200×16] · hidden · "Market closed" Inter 12/16 w500 (raw) · fill #FFFFFF@0.64 (raw)');
  hasLine("raw gap, padding pair, radius corners", specA, '    FRAME "Price row" 7710:91531 [16 112 312×40] · H gap 12 (raw) pad 0 16 (raw) jc SPACE_BETWEEN w FILL · r 8 8 0 0 (raw)');
  hasLine("mixed text with an override", specA, '      TEXT "Price" 7710:91532 [16 11 120×18] · "$0.52 USD" mixed ×2 Lg/Paragraph 2 300 (Manrope 14/18 w300) + fs 16 (raw)');
  hasLine("segment with a style", specA, '        ~ "$0.52 " Lg/Paragraph 2 300 (Manrope 14/18 w300) · fill Primary/Green Coal 200 (#1A3A3A)');
  hasLine("segment with raw type and an unknown token", specA, '        ~ "USD" Manrope 12 w400 (raw) · fill Unknown/Token (?)');
  hasLine("instance with no props", specA, '      INSTANCE "Chevron" 7710:91533 [280 8 24×24] · inst Chevron');
  hasLine("instance of a variant set", specA, '    INSTANCE "Tab" 7710:91534 [16 170 100×32] · inst Tabs/Item (State=Active)');
  hasLine("a name in two collections", specA, '  FRAME "Gap probe" 7710:91540 [0 0 10×10] · H gap Spacing/s-2 (in 2 collections)');
  hasLine("a collection-qualified name", specA, '    FRAME "Web gap" 7710:91541 [0 0 4×4] · V gap Web/Spacing/s-2 (8)');
  hasLine("a ref with an instance-path id reads its _ file", specA, '    FRAME "Nested ref" I7710:91540;5:6 [0 0 2×2] · ref store/mhF3BkzlTaGiLzJ7kvpmVc/I7710-91540_5-6.json');
  hasLine("gradient, opacity, raw effect", specA, '  RECTANGLE "Glow" 7710:91550 [0 0 1440×200] · op 0.5 · fill linear gradient 90° [0 #FFFFFF (raw), 1 Primary/Green Coal 200 (#1A3A3A)] · fx drop-shadow 0,2 blur 8 #000000@0.25 (raw)');
  hasLine("image fill", specA, '  RECTANGLE "Hero image" 7710:91551 [0 200 400×300] · fill image 9f86d081884c7d65 FILL');
  hasLine("paint style and aliased stroke", specA, '  VECTOR "Icon" 7710:91552 [0 0 16×16] · fill Brand/Sky (#38BDF8) · stroke Surface/Card (→ Primary/Green Coal 900 #0A1A1A) 1.5 CENTER');
  hasLine("a ref that is not stored", specA, "  REF 7710:99999 not stored: this subtree is missing from the spec");
  hasLine("unknown text style and a case override", specA, '  TEXT "Badge" 7710:91553 [0 0 50×10] · "LIVE" Lg/Heading 5 (?) + tc UPPER');
  hasLine("footer counts", specA, "nodes 19 · text 5 · hidden 1 · raw 11 · not in tokens/ 2 · refs inlined 3 · refs missing 1");
  check("missing ref is reported after the tree", specA.text.includes("INCOMPLETE: 1 split subtree(s) not stored (7710:99999)"));
  lacks("a fresh spec is not called stale", specA, "STALE");
  lacks("tokens present: no missing-token note", specA, "  tokens   ");

  for (const q of [`${A}`, "mhF3BkzlTaGiLzJ7kvpmVc:7710-91527", "7710-91527",
    "https://www.figma.com/design/mhF3BkzlTaGiLzJ7kvpmVc/Skai-Web-App-2?node-id=7710-91527&m=dev",
    "https://www.figma.com/design/mhF3BkzlTaGiLzJ7kvpmVc?node-id=7710%3A91527"]) {
    const r = run(["spec", q]);
    check(`spec resolves "${q}"`, r.code === 0 && r.lines.includes(`  key      ${A}`), `exit ${r.code}: ${r.lines[0]}`);
  }
  const byTitle = run(["spec", "Welcome", "pop-up"]);
  check("spec resolves title words", byTitle.code === 0 && byTitle.lines.includes("  key      3sSzw1KewMtUbeLAv7uW0r:2713:4556"), `exit ${byTitle.code}: ${byTitle.lines[0]}`);

  const d1 = run(["spec", A, "--depth", "1"]);
  hasLine("depth 1 cuts the ref's children", d1, '  FRAME "Order book" 7710:91600 [0 64 1064×836] · fill Surface/Card (→ Primary/Green Coal 900 #0A1A1A) · ref store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527/7710-91600.json · +2 children');
  check("depth 1 marks the cut on the panel", d1.lines.some((l) => l.startsWith('  FRAME "Order panel"') && l.endsWith(" · +4 children")));
  lacks("depth 1 prints no grandchild", d1, '"Buy button"');
  check("depth 1 footer counts what is cut", d1.text.includes("below --depth 8"), d1.lines.at(-3));
  const d0 = run(["spec", A, "--depth=0"]);
  check("depth 0 prints the root alone", d0.lines.filter((l) => /^\s*(FRAME|TEXT|INSTANCE|RECTANGLE|VECTOR|REF) /.test(l)).length === 1);

  const sub = run(["spec", A, "--node", "7710-91531"]);
  check("--node exits 0", sub.code === 0, `exit ${sub.code}`);
  hasLine("--node names the layer", sub, '  layer    7710:91531 "Price row"');
  hasLine("--node prints the subtree from column 0", sub, 'FRAME "Price row" 7710:91531 [16 112 312×40] · H gap 12 (raw) pad 0 16 (raw) jc SPACE_BETWEEN w FILL · r 8 8 0 0 (raw)');
  hasLine("--node keeps the subtree's children", sub, '  INSTANCE "Chevron" 7710:91533 [280 8 24×24] · inst Chevron');
  lacks("--node leaves out the rest of the frame", sub, '"Order panel"');
  const inRef = run(["spec", A, "--node", "7710:91601"]);
  check("--node reaches a layer inside a ref", inRef.code === 0 && inRef.text.includes('TEXT "Heading" 7710:91601'), `exit ${inRef.code}`);
  const inNested = run(["spec", A, "--node", "7710:91602"]);
  check("--node reaches a part nested in a part", inNested.code === 0 && inNested.text.includes('\nFRAME "Depth rows" 7710:91602'), `exit ${inNested.code}`);
  const noLayer = run(["spec", A, "--node", "1:1"]);
  check("--node with an unknown layer exits 1", noLayer.code === 1 && noLayer.text.includes("No layer 1:1"), `exit ${noLayer.code}`);

  const asJson = run(["spec", A, "--json"]);
  const onDisk = fs.readFileSync(path.join(fx, "store", "mhF3BkzlTaGiLzJ7kvpmVc", "7710-91527.json"), "utf8");
  check("--json prints the stored file as it is", asJson.code === 0 && asJson.text === onDisk.replace(/\s+$/, ""));
  const subJson = run(["spec", A, "--node", "7710:91533", "--json"]);
  check("--json with --node prints that layer", subJson.code === 0 && JSON.parse(subJson.text).ci?.k === "beef01");

  const flat = run(["spec", A, "--flat"]);
  const flatText = flat.lines.filter((l) => l.startsWith('"'));
  check("--flat prints one line per text node", flatText.length === 5, `${flatText.length} text lines`);
  hasLine("--flat line: text, style, fill, id, path", flat, '"Buy Yes" Lg/Paragraph 2 300 (Manrope 14/18 w300) · fill Primary/Green Coal 200 (#1A3A3A) · I7710:91529;1:2 · Order panel > Buy button');
  hasLine("--flat marks hidden text", flat, '"Market closed" Inter 12/16 w500 (raw) · fill #FFFFFF@0.64 (raw) · 7710:91530 · Order panel · hidden');
  hasLine("--flat reads text inside a ref", flat, '"Order book" font/family/display (Manrope) font/size/lg (18)/auto w600 (raw) · 7710:91601 · Order book');
  hasLine("--flat reports the missing ref", flat, "REF 7710:99999 not stored: its text is missing from this list");
  lacks("--flat prints no layout lines", flat, "FRAME ");

  const bare = run(["spec", A], noTokens);
  hasLine("no tokens: the header says so", bare, "  tokens   tokens/variables.json, tokens/text-styles.json, tokens/effect-styles.json not found: those names print without a value");
  hasLine("no tokens: names print bare, raw still marked", bare, '  FRAME "Order panel" 7710:91528 [1080 64 344×520] · V gap s-6 pad s-4 ai CENTER · r rounded-xl · fill #052D2D (raw) · stroke Primary/Green Coal 200@0.5 1 INSIDE · fx Shadow/Card');
  hasLine("no tokens: a style prints by name", bare, '      TEXT "Label" I7710:91529;1:2 [120 15 72×18] · "Buy Yes" Lg/Paragraph 2 300 · fill Primary/Green Coal 200');
  lacks("no tokens: nothing is called unresolved", bare, "(?)");

  const ambiguous = run(["spec", "2713:3937"]);
  check("a node id in two files exits 2", ambiguous.code === 2, `exit ${ambiguous.code}`);
  check("the ambiguity lists both keys", ambiguous.text.includes("  mhF3BkzlTaGiLzJ7kvpmVc:2713:3937 · ") && ambiguous.text.includes("  M6r9FEn042UWTQD1zvy6GM:2713:3937 · "));
  const words = run(["spec", "spot"]);
  check("title words matching several frames exit 2", words.code === 2 && words.lines[0] === '3 frames match "spot". Name one by its key:', words.lines[0]);
  const exact = run(["spec", "Skai > Trade > Spot 1VH (1440 x 900px)"]);
  check("an exact title wins over partial matches", exact.code === 0, `exit ${exact.code}`);

  const missing = run(["spec", "mhF3BkzlTaGiLzJ7kvpmVc:7710:91999"]);
  check("a frame with no spec exits 3", missing.code === 3, `exit ${missing.code}`);
  hasLine("missing: says where the spec would be", missing, "NOT STORED: there is no spec at store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91999.json yet.");
  hasLine("missing: prints the sync step for that frame", missing, "  npm run figma:sync -- extract-script --file mhF3BkzlTaGiLzJ7kvpmVc --nodes 7710:91999");
  hasLine("missing: still prints the catalog row", missing, "  catalog  trade · not-started · route /trade/spot · src/pages/trade/Spot.tsx, src/components/trade/SpotMobile.tsx");
  const indexOnly = run(["spec", "7710:92000"]);
  check("index entry without its file exits 3", indexOnly.code === 3 && indexOnly.text.includes("store/index.json lists store/mhF3BkzlTaGiLzJ7kvpmVc/7710-92000.json, but the file is missing."), `exit ${indexOnly.code}`);
  const gone = run(["spec", "M6r9FEn042UWTQD1zvy6GM:9660-3"]);
  check("a gone frame exits 3 and says it cannot be fetched", gone.code === 3 && gone.text.includes("GONE: ") && !gone.text.includes("extract-script"), `exit ${gone.code}`);
  const unknown = run(["spec", "1234:5678"]);
  check("an unknown node exits 1", unknown.code === 1 && unknown.text.includes("--node"), `exit ${unknown.code}`);

  const staleB = run(["spec", "2713:4556"]);
  check("a stale spec still prints", staleB.code === 0 && staleB.text.includes('TEXT "Title" 2713:4557'));
  check("a stale spec says so up front", staleB.lines.some((l) => l.startsWith("STALE: ")) && staleB.text.indexOf("STALE: ") < staleB.text.indexOf('TEXT "Title"'));
  const uncatalogued = run(["spec", "M6r9FEn042UWTQD1zvy6GM:9003:1"]);
  hasLine("a stored frame the catalog lacks", uncatalogued, "  catalog  not in figma-catalog/registry.json");

  const byFile = run(["find", "--file", "src/pages/trade/Spot.tsx"]);
  check("find --file exits 0", byFile.code === 0, `exit ${byFile.code}`);
  hasLine("find: stored hit line", byFile, `${A} · ✅ Trade 1 · Skai > Trade > Spot 1VH (1440 x 900px) · 1440 · partial · stored · store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527.json`);
  hasLine("find: missing hit line, width from the catalog", byFile, "mhF3BkzlTaGiLzJ7kvpmVc:7710:91999 · ✅ Trade 1 · Skai > Trade > Spot 1VH (375 x 812px) · 375 · not-started · not stored · —");
  hasLine("find: index entry whose file is gone", byFile, "mhF3BkzlTaGiLzJ7kvpmVc:7710:92000 · ✅ Trade 1 · Skai > Trade > Spot - sell 1VH (1440 x 900px) · 1440 · partial · not stored (index lists it, file missing) · —");
  hasLine("find: summary", byFile, "3 frame(s): 1 stored (0 stale), 2 not stored");
  for (const f of ["Spot.tsx", "trade/Spot.tsx", "src\\pages\\trade\\Spot.tsx", "C:\\Users\\casey\\Skai-Trading\\src\\pages\\trade\\Spot.tsx"]) {
    const r = run(["find", "--file", f]);
    check(`find --file "${f}"`, r.lines.includes("3 frame(s): 1 stored (0 stale), 2 not stored"), r.lines.at(-1));
  }
  const mobileOnly = run(["find", "--file", "SpotMobile.tsx"]);
  check("find --file lists only that file's frames", mobileOnly.lines.at(-1) === "1 frame(s): 0 stored (0 stale), 1 not stored", mobileOnly.lines.at(-1));
  const partialName = run(["find", "--file", "pot.tsx"]);
  check("find --file does not match inside a file name", partialName.code === 1, `exit ${partialName.code}`);

  const staleOnly = run(["find", "--stale"]);
  check("find --stale lists both stale forms", staleOnly.lines.at(-1) === "2 frame(s): 2 stored (2 stale), 0 not stored", staleOnly.lines.at(-1));
  hasLine("find: stale via liveHash", staleOnly, "3sSzw1KewMtUbeLAv7uW0r:2713:4556 · ✅ Home 1 · Skai > Home > welcome pop-up 1VH (1440 x 900px) · 1440 · done · stored, stale · store/3sSzw1KewMtUbeLAv7uW0r/2713-4556.json");
  hasLine("find: stale flag on a frame the catalog lacks", staleOnly, "M6r9FEn042UWTQD1zvy6GM:9003:1 · ✅ Blackjack - Skai originals · Skai > Play > Casino > Blackjack (1440 x 900px) · 1440 · not catalogued · stored, stale · store/M6r9FEn042UWTQD1zvy6GM/9003-1.json");

  const storedOnly = run(["find", "--stored"]);
  check("find --stored lists frames, not their split parts", storedOnly.lines.at(-1) === "3 frame(s): 3 stored (2 stale), 0 not stored", storedOnly.lines.at(-1));
  lacks("find never prints a part key", storedOnly, "7710:91527/");

  const byNode = run(["find", "2713-3937"]);
  hasLine("find by node: no width anywhere prints the dash", byNode, "mhF3BkzlTaGiLzJ7kvpmVc:2713:3937 · ✅ Home 1 · Breakpoint · — · furniture · not stored · —");
  hasLine("find by node: width from the catalog viewport", byNode, "M6r9FEn042UWTQD1zvy6GM:2713:3937 · ✅ Dice - Skai originals · Skai > Play > Casino > Dice (375 x 812px) · 375 · partial · not stored · —");
  const byStatus = run(["find", "--status", "done,furniture"]);
  check("find --status takes a list", byStatus.lines.at(-1) === "2 frame(s): 1 stored (1 stale), 1 not stored", byStatus.lines.at(-1));
  const byPage = run(["find", "--page", "trade 1", "--width", "1440"]);
  check("find --page with --width", byPage.lines.at(-1) === "2 frame(s): 1 stored (0 stale), 1 not stored", byPage.lines.at(-1));
  const byRoute = run(["find", "--route", "side=sell"]);
  check("find --route matches inside the route", byRoute.lines.at(-1) === "1 frame(s): 0 stored (0 stale), 1 not stored", byRoute.lines.at(-1));
  const byWords = run(["find", "spot", "375"]);
  check("find by title words", byWords.lines.at(-1) === "1 frame(s): 0 stored (0 stale), 1 not stored", byWords.lines.at(-1));
  const goneHit = run(["find", "skai", "cross"]);
  hasLine("find: a gone frame", goneHit, "M6r9FEn042UWTQD1zvy6GM:9660:3 · no page · SKAI Cross · — · unknown · gone · —");
  hasLine("find: gone counted apart", goneHit, "1 frame(s): 0 stored (0 stale), 0 not stored, 1 gone");
  const limited = run(["find", "--file", "Spot.tsx", "--limit", "1"]);
  check("find --limit caps the list and says so", limited.lines.length === 2 && limited.lines[1].endsWith(" · showing 1, --limit 0 lists all"), limited.text);
  const listed = run(["find", "--missing", "--page", "trade", "--json"]);
  const parsed = JSON.parse(listed.text);
  check("find --json", listed.code === 0 && parsed.length === 2 && parsed.every((h) => h.stored === false && h.path === null));
  const none = run(["find", "no-such-frame-anywhere"]);
  check("find with no hit exits 1", none.code === 1 && none.text.includes("No frames match."), `exit ${none.code}`);

  check("find with nothing to find is a usage error", run(["find"]).code === 1);
  check("an unknown option is refused", run(["spec", A, "--depht", "2"]).code === 1);
  check("a bad count is refused", run(["spec", A, "--depth", "two"]).code === 1);
  check("--stored with --missing is refused", run(["find", "--stored", "--missing"]).code === 1);

  console.log(`read.mjs self-test: ${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  process.stdout.on("error", (e) => {
    if (e.code !== "EPIPE") throw e;
  });
  const argv = process.argv.slice(2);
  let code;
  try {
    if (argv.includes("--self-test")) code = selfTest();
    else {
      const lines = [];
      code = main(argv, { out: (...l) => lines.push(...l) });
      if (lines.length) process.stdout.write(`${lines.join("\n")}\n`);
    }
  } catch (e) {
    console.error(`read.mjs: ${e.message}`);
    code = 1;
  }
  process.exitCode = code;
}
