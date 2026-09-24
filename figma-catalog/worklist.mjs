#!/usr/bin/env node
/**
 * worklist.mjs — cut the catalog's open frames into packets a lane can take.
 *
 *   node figma-catalog/worklist.mjs                write worklist.md + worklist.tsv next to this file
 *   node figma-catalog/worklist.mjs --out <dir>    write them somewhere else (a lane previewing in a shared tree)
 *   node figma-catalog/worklist.mjs --lanes 12     how many packets the wave-1 table picks
 *   node figma-catalog/worklist.mjs --self-test
 *
 * INPUTS are the two derived files and nothing else. coverage.json's
 * `frameStatuses` is the per-frame status the published figure is tallied from
 * (newest generation first, vverify verdicts applied), so a frame lands here with
 * exactly the status COVERAGE.md counts it at. Re-resolving status from
 * status.*.tsv would be a second copy of coverage.mjs's rule, and every copy of a
 * rule in this directory has drifted from the original within a wave.
 * registry.json supplies title, measured size, implFiles, route and notes.
 *
 * The design store's index (../figma/store/index.json) is read for one thing:
 * each row's spec path and whether that spec is stored, stale or missing, by
 * the worklist's rule in figma/SCHEMA.md ("Stored, stale, missing"): an index
 * entry whose file is on disk. figma:find goes by the file alone and sync
 * status by the entry alone, so after an ingest that stopped part-way the
 * three can differ. It never changes which packet a frame lands in, and
 * sync.mjs, which reads the packets to order its fetches, builds the worklist
 * without it.
 *
 * Before writing anything the in-scope tallies are checked against
 * coverage.json's own rollup, and every open frame must join exactly one
 * registry frame. Either failure exits 2 and writes nothing: a worklist that is
 * quietly short is the one nobody notices.
 *
 * WHERE A FRAME GOES
 *   packet    in-scope and partial, not-started or unknown
 *   backend   in-scope and blocked-on-backend, grouped by the gap its row names
 *   design    in-scope and frame-defect. SCHEMA.md: the frame is wrong and the
 *             code is right, so matching it would ship a bug. That is a redraw,
 *             not a code lane, and it is listed apart for the same reason.
 *   left out  done, furniture, ruled-out, and every page whose scope is not
 *             in-scope (wip, excluded, tombstone, held, unscoped, meta)
 *
 * HOW PACKETS ARE CUT
 *   owner     each frame's owning code is one path out of its implFiles: a file
 *             before a directory, then the path the most open frames cite, then
 *             the later entry (implFiles only ever grows by appending). A frame
 *             that cites no path is owned by its route, else by its family.
 *   split     an owner with more than PACKET_MAX frames becomes a series of
 *             near-equal packets. A series shares files, so it runs in order.
 *   merge     owners under PACKET_MIN frames are packed together, first by
 *             class + section + directory, then by class + section.
 *   rank      class first (money-trade, wagering, user-facing, internal), then
 *             frame count, then owner name.
 *   conflict  two packets conflict when they cite the same path, or one cites a
 *             directory the other's file sits in. The wave-1 table is the top
 *             packets that conflict with none picked before them.
 *
 * The output is derived. pipeline.mjs does not write it and a lane must not
 * commit it.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BP_KEYS } from "./bp.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const FIGMA_DIR = path.join(DIR, "..", "figma");

export const PACKET_MAX = 25;
export const PACKET_MIN = 10;
export const LANES = 12;

export const CLASSES = ["money-trade", "wagering", "user-facing", "internal"];

const PACKET_STATUSES = new Set(["partial", "not-started", "unknown"]);
const BACKEND = "blocked-on-backend";
const DESIGN = "frame-defect";

// Every status coverage.mjs can resolve a frame to, and the rollup key it is
// published under. A status missing from this map is refused rather than
// routed nowhere.
const ROLLUP_KEYS = {
  done: "done",
  partial: "partial",
  "not-started": "notStarted",
  unknown: "unknown",
  "blocked-on-backend": "blocked",
  "frame-defect": "frameDefect",
  furniture: "catalogFurniture",
};

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function nodeCmp(a, b) {
  const pa = String(a).split(/[-:]/).map(Number);
  const pb = String(b).split(/[-:]/).map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? -1) - (pb[i] ?? -1);
    if (d) return d;
  }
  return cmp(String(a), String(b));
}

const bandRank = (b) => (BP_KEYS.includes(b) ? BP_KEYS.indexOf(b) : BP_KEYS.length);

function frameCmp(a, b) {
  return (
    cmp(a.page, b.page) ||
    cmp(a.family, b.family) ||
    bandRank(a.band) - bandRank(b.band) ||
    cmp(a.fileKey, b.fileKey) ||
    nodeCmp(a.node, b.node)
  );
}

// ── implFiles ────────────────────────────────────────────────────────────────

// implFiles is free text accumulated from status column 3: "src/a.tsx + src/b.tsx",
// "src/pages/Airdrop.tsx:175-188", "NONE - nearest is src/pages/defi/Earn.tsx:211
// (OpportunityCard)", "—". Only repo-rooted paths are taken; a bare
// "instant/keno/" is a note about the path before it.
const PATH_TOKEN = /\b(?:src|modules|supabase|public|scripts|tests)\/[A-Za-z0-9_@.\/\-\[\]]+/g;

export const isFile = (p) => /\.[A-Za-z0-9]+$/.test(p.slice(p.lastIndexOf("/") + 1));

/**
 * { paths, hints }. An entry that opens with NONE / no says nothing implements
 * the frame; any path in it is the nearest code, kept as a hint and never used
 * as the owner.
 */
export function extractPaths(entries) {
  const own = [];
  const hints = [];
  for (const raw of entries || []) {
    const e = String(raw);
    const isHint = /^\s*(?:none|no)\b/i.test(e);
    for (let p of e.match(PATH_TOKEN) || []) {
      p = p.replace(/[.,;]+$/, "").replace(/\/+$/, "");
      (isHint ? hints : own).push(p);
    }
  }
  const paths = [...new Set(own)];
  return { paths, hints: [...new Set(hints)].filter((h) => !paths.includes(h)) };
}

// A settlement rail, an edge function or the chain can be cited by a frame's row
// ("rail at supabase/functions/_shared/slide.ts") without being code a UI lane
// may own. It is kept in the packet's file list and never chosen as its owner
// while a UI path is on offer.
export const isBackendPath = (p) => /^(?:supabase|scripts)\//.test(p) || /^modules\/skai-(?:chain|bot)(?:\/|$)/.test(p);

/** The owning path: UI before backend, a file before a directory, then the most cited, then the later entry. */
export function chooseOwner(paths, cite) {
  let best = null;
  paths.forEach((p, i) => {
    const c = { p, tier: (isBackendPath(p) ? 0 : 2) + (isFile(p) ? 1 : 0), n: cite.get(p) || 0, i };
    if (!best || c.tier > best.tier || (c.tier === best.tier && (c.n > best.n || (c.n === best.n && c.i > best.i))))
      best = c;
  });
  return best ? best.p : null;
}

/** The route a row names, without the prose rows add after it: "/earn (App.tsx:1332)" -> "/earn". */
export function normRoute(route) {
  const m = /^\/[^\s(]*/.exec(String(route ?? "").trim());
  if (!m) return null;
  return m[0].replace(/[),.;]+$/, "") || "/";
}

export function overlaps(a, b) {
  if (a === b) return true;
  if (!isFile(a) && b.startsWith(a + "/")) return true;
  if (!isFile(b) && a.startsWith(b + "/")) return true;
  return false;
}

// ── class ────────────────────────────────────────────────────────────────────

const MONEY_SECTIONS = new Set(["trade", "trade-2", "wallet", "wallet-2", "predict"]);
const MONEY_WORD =
  /(?:^|[\/\s?=&_.-])(?:spot|perps?|swap|bridge|trench|launchpad|crypto|wallet|send|receive|deposit|withdraw|portfolio|predict|earn|defi|vaults?|stake|staking|checkout|upgrade|lending)(?=$|[\/\s?=&_.:-])/i;
const WAGER_WORD = /(?:^|[\/\s?=&_.-])(?:play|sports|sportsbook|casino)(?=$|[\/\s?=&_.:-])/i;

/**
 * 0 money-trade: trade, wallet and predict sections, or a route/path naming a
 *   money surface (spot, perps, swap, bridge, portfolio, earn, checkout, ...).
 * 1 wagering: the play section, any Skai-Games frame, skai-gaming code.
 * 3 internal: the master sheet, the admin panel.
 * 2 everything else a user sees.
 */
export function classify(row) {
  const hay = [row.route || "", ...row.paths].join(" ");
  if (MONEY_SECTIONS.has(row.section) || MONEY_WORD.test(hay)) return 0;
  if (
    row.section === "play" ||
    row.fileName === "Skai-Games" ||
    row.paths.some((p) => p.startsWith("modules/skai-gaming/")) ||
    WAGER_WORD.test(row.route || "")
  )
    return 1;
  if (
    row.section === "master-sheet" ||
    row.paths.some((p) => p.startsWith("modules/skai-command/")) ||
    /^\/admin\b/.test(normRoute(row.route) || "")
  )
    return 3;
  return 2;
}

// ── the gap a blocked row names ──────────────────────────────────────────────

/** A row's own reason, without the `[vverify: ...]` marker apply-verify appends. */
export function reasonText(notes) {
  const s = String(notes || "");
  const i = s.indexOf("[vverify:");
  return (i >= 0 ? s.slice(0, i) : s).replace(/\s+/g, " ").trim();
}

// Three tiers, tried in order. A sentence naming the missing thing ("no table
// for invoices", "is absent", "has no certified config") beats one that only
// files the row ("BLOCKED ON BACKEND, CARRIED."), which beats one that merely
// mentions a backend word.
const GAP_NAMED =
  /\b(?:no (?:live |server[- ]side |on-chain |certified )?(?:source|table|relation|rpc|endpoint|function|edge function|backend|api|feed|writer|settler|index|column|persistence|data source|history|price|market|decoder|config|engine|action)s?|(?:has|have) no \w+|(?:is|are) absent|absent from|does not exist|do not exist|doesn't exist|not deployed|never deployed|missing (?:relation|table|rpc|endpoint|function|column|migration)|only the (?:deployer|owner)|needs? (?:a |an |the )?(?:migration|table|rpc|endpoint|edge function|backfill|column|index|settler|writer))\b/i;
const GAP_FILED = /\b(?:blocked on (?:a |an |the )?[\w-]+|the blocker)\b/i;
const GAP_WEAK = /\b(?:backend|migration|backfill|edge function|rpc|endpoint|schema|supabase|server|api|settle[sd]?|contract)\b/i;

/**
 * The sentence in a blocked row that names what is missing. The row's first
 * sentence is usually provenance ("NOT RE-READ THIS PASS - carried."), so it is
 * the fallback, and `found: false` says the row names its gap in no sentence
 * this could recognise: read the row.
 */
export function gapSentence(notes, maxLen = 220) {
  const text = reasonText(notes);
  if (!text) return { gap: "", found: false };
  const sentences = text.split(/(?<=[.!?]["')\]]?)\s+(?=[A-Z0-9`"'(\[])/);
  const hit =
    sentences.find((s) => GAP_NAMED.test(s)) ?? sentences.find((s) => GAP_FILED.test(s)) ?? sentences.find((s) => GAP_WEAK.test(s));
  const pick = (hit ?? sentences[0]).trim();
  return { gap: pick.length > maxLen ? pick.slice(0, maxLen - 1).trimEnd() + "…" : pick, found: Boolean(hit) };
}

// ── the design store ─────────────────────────────────────────────────────────

export const SPEC_STATES = ["stored", "stale", "missing"];

/** Where store/index.json would put a frame's spec when its entry names no path (read.mjs does the same). */
const specRelOf = (fileKey, node) => `store/${fileKey}/${String(node).replace(/:/g, "-").replace(/;/g, "_")}.json`;

/**
 * A frame's spec in the design store. `store.index` is figma/store/index.json
 * parsed; `store.has(rel)` says whether a path relative to figma/ is on disk.
 * Stored and stale carry the spec's path relative to the skai-ui package
 * root. Missing carries none: no entry, a split part's entry (a part is never
 * a frame), or an entry whose file is gone, because a path to a file that is
 * not there is not a spec. A spec file with no entry is missing too: sync
 * writes the files before the index, so that is what an ingest that did not
 * finish leaves, and sync plans the frame again. Stale is the entry's flag only; an
 * index field the contract does not define (read.mjs also reads `liveHash`)
 * changes nothing here.
 */
export function specOf(store, fileKey, node) {
  const colonNode = String(node).replace(/-/g, ":");
  const e = store.index?.frames?.[`${fileKey}:${colonNode}`];
  if (!e || e.partOf) return { state: "missing", path: "" };
  const rel = typeof e.path === "string" ? e.path : specRelOf(fileKey, colonNode);
  if (!store.has(rel)) return { state: "missing", path: "" };
  return { state: e.stale === true ? "stale" : "stored", path: `figma/${rel}` };
}

/**
 * figma/store/index.json as a `store` for buildWorklist. No index is an empty
 * store, so every frame reads missing and the note says why; an index that does
 * not parse is an error, because a worklist that calls every frame missing off
 * a broken file is the quiet kind of wrong.
 */
export function readStore(figmaDir) {
  const file = path.join(figmaDir, "store", "index.json");
  const has = (rel) => fs.existsSync(path.join(figmaDir, rel));
  if (!fs.existsSync(file)) return { index: { frames: {} }, has, note: `${file} not found, so every frame reads missing` };
  let index;
  try {
    index = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`${file} is not valid JSON (${e.message}). Only figma/sync.mjs writes it: take it back from git, never mend it by hand.`);
  }
  if (!index || typeof index.frames !== "object" || index.frames === null) throw new Error(`${file} has no "frames" map`);
  return { index, has, note: null };
}

/** Tally of spec states over some rows, in SPEC_STATES order. */
function specMix(rows) {
  const n = { stored: 0, stale: 0, missing: 0 };
  for (const r of rows) if (r.specState) n[r.specState]++;
  return n;
}

// ── the build ────────────────────────────────────────────────────────────────

function majority(values) {
  const n = new Map();
  for (const v of values) n.set(v, (n.get(v) || 0) + 1);
  return [...n].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))[0][0];
}

function statusMix(rows) {
  const n = {};
  for (const r of rows) n[r.status] = (n[r.status] || 0) + 1;
  return ["partial", "not-started", "unknown"].filter((s) => n[s]).map((s) => `${s} ${n[s]}`).join(", ");
}

/**
 * The whole worklist, pure. Returns `{ problems }` when the inputs cannot be
 * trusted, else `{ packets, backend, design, wave1, stats, stamps }`. With a
 * `store` ({ index, has }, see specOf) every row also carries `specState` and
 * `spec`; without one both stay "" and render as unread.
 */
export function buildWorklist({ registry, coverage, store = null, lanes = LANES, max = PACKET_MAX, min = PACKET_MIN }) {
  const problems = [];
  const all = coverage.frameStatuses || [];
  const inScope = all.filter((f) => f.scope === "in-scope");

  const tally = {};
  for (const f of inScope) tally[f.status] = (tally[f.status] || 0) + 1;
  for (const s of Object.keys(tally)) if (!(s in ROLLUP_KEYS)) problems.push(`in-scope status "${s}" is not one this tool routes`);
  for (const [s, key] of Object.entries(ROLLUP_KEYS)) {
    const published = coverage.rollup?.[key] ?? 0;
    if ((tally[s] || 0) !== published)
      problems.push(`in-scope ${s}: frameStatuses holds ${tally[s] || 0}, coverage.json rollup.${key} publishes ${published}`);
  }

  const filesOfPage = new Map();
  for (const p of coverage.pages || []) {
    if (!filesOfPage.has(p.pageName)) filesOfPage.set(p.pageName, new Set());
    filesOfPage.get(p.pageName).add(p.fileKey);
  }
  const primary = registry.fileKey;
  const regKey = (fk, id) => (fk === primary ? id : `${fk}:${id}`);

  const rows = [];
  let ruledOut = 0;
  for (const f of inScope) {
    if (!PACKET_STATUSES.has(f.status) && f.status !== BACKEND && f.status !== DESIGN) continue;
    if (f.verdict === "ruled-out") {
      ruledOut++;
      continue;
    }
    const hits = [...(filesOfPage.get(f.page) || [])]
      .sort()
      .map((fk) => [fk, registry.frames?.[regKey(fk, f.id)]])
      .filter(([, fr]) => fr);
    if (hits.length !== 1) {
      problems.push(`${f.page} ${f.id} (${f.status}): ${hits.length ? "joins a registry frame in more than one file" : "joins no registry frame"}`);
      continue;
    }
    const [fileKey, fr] = hits[0];
    const { paths, hints } = extractPaths(fr.implFiles);
    const m = /^(\d+)x(\d+)$/.exec(fr.measuredViewport || "");
    rows.push({
      fileKey,
      fileName: fr.fileName || "",
      node: f.id,
      page: f.page,
      section: fr.section || "",
      family: fr.family || "",
      title: fr.title || "",
      width: m ? Number(m[1]) : null,
      band: fr.device || null,
      bandFrom: m ? "measured" : fr.device ? "declared" : "none",
      status: f.status,
      verdict: f.verdict || null,
      paths,
      hints,
      route: fr.route || null,
      notes: fr.notes || "",
      specState: "",
      spec: "",
    });
  }
  if (problems.length) return { problems };
  rows.sort(frameCmp);
  for (const r of rows) r.cls = classify(r);
  if (store)
    for (const r of rows) {
      const s = specOf(store, r.fileKey, r.node);
      r.specState = s.state;
      r.spec = s.path;
    }

  const open = rows.filter((r) => PACKET_STATUSES.has(r.status));
  const cite = new Map();
  for (const r of open) for (const p of r.paths) cite.set(p, (cite.get(p) || 0) + 1);
  for (const r of open) {
    const p = chooseOwner(r.paths, cite);
    const route = normRoute(r.route);
    r.ownerKind = p ? (isFile(p) ? "file" : "dir") : route ? "route" : "family";
    r.owner = p ?? (route ? `${r.section} ${route}` : `${r.section}/${r.family}`);
  }

  // One group per owner, then split the big ones and pack the small ones.
  const byOwner = new Map();
  for (const r of open) {
    const k = `${r.ownerKind}\t${r.owner}`;
    if (!byOwner.has(k)) byOwner.set(k, []);
    byOwner.get(k).push(r);
  }
  const groups = [];
  for (const k of [...byOwner.keys()].sort()) {
    const list = byOwner.get(k);
    const [kind, owner] = k.split("\t");
    const g = {
      owners: [owner],
      kind,
      frames: list,
      section: majority(list.map((r) => r.section)),
      cls: Math.min(...list.map((r) => r.cls)),
    };
    if (list.length <= max) {
      groups.push({ ...g, total: list.length, series: null });
      continue;
    }
    const n = Math.ceil(list.length / max);
    const base = Math.floor(list.length / n);
    const extra = list.length % n;
    for (let i = 0, at = 0; i < n; i++) {
      const size = base + (i < extra ? 1 : 0);
      groups.push({ ...g, frames: list.slice(at, at + size), total: list.length, series: { k: i + 1, n } });
      at += size;
    }
  }

  // A group's directory: the owner file's folder, the owner directory itself,
  // or, for a route or family owner or a bin spanning folders, its section in
  // brackets, which no directory can equal.
  for (const g of groups)
    g.area = g.kind === "file" ? path.posix.dirname(g.owners[0]) : g.kind === "dir" ? g.owners[0] : `(${g.section})`;
  const area = (g) => g.area;
  const join = (bin, g) => {
    bin.owners.push(...g.owners);
    bin.frames.push(...g.frames);
    bin.total = bin.frames.length;
    if (bin.area !== g.area) bin.area = `(${bin.section})`;
  };
  // Small groups under one key are packed together first, in owner order. A bin
  // still under `min` afterwards tops up a full-sized group of the same key that
  // has room, rather than being left as a two-frame packet. A series is never
  // touched: its packets already share a file.
  const pack = (list, keyOf) => {
    const out = list.filter((g) => g.series);
    const byKey = new Map();
    for (const g of list.filter((x) => !x.series)) {
      const k = keyOf(g);
      if (!byKey.has(k)) byKey.set(k, []);
      byKey.get(k).push(g);
    }
    for (const k of [...byKey.keys()].sort()) {
      const members = byKey.get(k).sort((a, b) => cmp(a.owners[0], b.owners[0]));
      const kept = members.filter((g) => g.frames.length >= min).map((g) => ({ ...g, owners: [...g.owners], frames: [...g.frames] }));
      const bins = [];
      for (const g of members.filter((x) => x.frames.length < min)) {
        const last = bins[bins.length - 1];
        if (last && last.frames.length + g.frames.length <= max) join(last, g);
        else bins.push({ ...g, owners: [...g.owners], frames: [...g.frames] });
      }
      for (const b of bins) {
        const room = b.frames.length < min && kept.find((g) => g.frames.length + b.frames.length <= max);
        if (room) join(room, b);
        else kept.push(b);
      }
      out.push(...kept);
    }
    return out;
  };
  let packed = pack(groups, (g) => `${g.cls}\t${g.section}\t${area(g)}`);
  packed = pack(packed, (g) => `${g.cls}\t${g.section}`);
  // Last, across sections but inside one directory: each game is its own
  // section, and six single-game owners in games/instant/ are one lane's work.
  packed = pack(packed, (g) => `${g.cls}\t${area(g)}`);

  packed.sort(
    (a, b) =>
      a.cls - b.cls ||
      b.total - a.total ||
      cmp(a.owners[0], b.owners[0]) ||
      (a.series?.k ?? 0) - (b.series?.k ?? 0),
  );

  const width = String(packed.length).length < 3 ? 3 : String(packed.length).length;
  const packets = packed.map((g, i) => {
    const frames = g.frames.slice().sort((a, b) => cmp(a.owner, b.owner) || frameCmp(a, b));
    const files = [...new Set(frames.flatMap((r) => r.paths))].sort();
    const hints = [...new Set(frames.flatMap((r) => r.hints))].filter((h) => !files.includes(h)).sort();
    const routes = [...new Set(frames.map((r) => normRoute(r.route)).filter(Boolean))].sort();
    const owners = [...new Set(g.owners)].sort();
    // A packed packet is named for the one directory its owners share, else its section.
    const dirs = new Set(frames.map((r) => (r.ownerKind === "file" ? path.posix.dirname(r.owner) : r.ownerKind === "dir" ? r.owner : "")));
    const shared = dirs.size === 1 ? [...dirs][0] : "";
    const label = owners.length === 1 ? owners[0] : `${shared ? `${shared}/` : `${g.section}:`} ${owners.length} owners`;
    const p = {
      id: `P${String(i + 1).padStart(width, "0")}`,
      cls: g.cls,
      className: CLASSES[g.cls],
      section: g.section,
      label,
      owners,
      series: g.series ? `${g.series.k}/${g.series.n}` : "",
      seriesKey: g.series ? owners[0] : null,
      total: g.total,
      frames,
      files,
      hints,
      routes,
      mix: statusMix(frames),
      conflicts: [],
    };
    for (const r of frames) r.packet = p.id;
    return p;
  });

  for (const a of packets)
    for (const b of packets) {
      if (a === b || (a.seriesKey && a.seriesKey === b.seriesKey)) continue;
      if (a.files.some((x) => b.files.some((y) => overlaps(x, y)))) a.conflicts.push(b.id);
    }

  const wave1 = [];
  for (const p of packets) {
    if (wave1.length >= lanes) break;
    const clash = wave1.some((q) => p.conflicts.includes(q.id) || (p.seriesKey && p.seriesKey === q.seriesKey));
    if (!clash) wave1.push(p);
  }

  const groupBy = (list, keyOf, prefix) => {
    const m = new Map();
    for (const r of list) {
      const k = keyOf(r);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(r);
    }
    const out = [...m.entries()].map(([k, fr]) => ({ key: k, frames: fr.sort(frameCmp), cls: Math.min(...fr.map((r) => r.cls)), section: fr[0].section }));
    out.sort((a, b) => a.cls - b.cls || b.frames.length - a.frames.length || cmp(a.key, b.key));
    const w = Math.max(2, String(out.length).length);
    out.forEach((g, i) => {
      g.id = `${prefix}${String(i + 1).padStart(w, "0")}`;
      g.className = CLASSES[g.cls];
      for (const r of g.frames) r.packet = g.id;
    });
    return out;
  };

  const blocked = rows.filter((r) => r.status === BACKEND);
  for (const r of blocked) {
    const g = gapSentence(r.notes);
    r.gap = g.gap;
    r.gapFound = g.found;
  }
  const backend = groupBy(blocked, (r) => `${r.section}\t${r.gap}`, "B");
  for (const g of backend) {
    g.gap = g.frames[0].gap;
    g.gapFound = g.frames[0].gapFound;
  }
  const design = groupBy(rows.filter((r) => r.status === DESIGN), (r) => r.section, "D");

  const outOfScope = {};
  for (const f of all) if (f.scope !== "in-scope" && f.status !== "done" && f.status !== "furniture") outOfScope[f.scope] = (outOfScope[f.scope] || 0) + 1;

  return {
    packets,
    backend,
    design,
    wave1,
    stats: {
      open: open.length,
      byStatus: { partial: tally.partial || 0, "not-started": tally["not-started"] || 0, unknown: tally.unknown || 0 },
      blocked: blocked.length,
      gapNamed: blocked.filter((r) => r.gapFound).length,
      design: rows.filter((r) => r.status === DESIGN).length,
      done: tally.done || 0,
      furniture: tally.furniture || 0,
      ruledOut: ruledOut + (coverage.rollup?.ruledOut || 0),
      liveOnly: coverage.rollup?.liveOnly || 0,
      outOfScope,
      sizes: packets.map((p) => p.frames.length),
      specs: store ? specMix(rows) : null,
      lanes,
      max,
      min,
    },
    stamps: {
      registry: registry.generated || "",
      coverage: coverage.generated || "",
      harvest: coverage.harvestedAt || "",
      store: store ? store.index?.syncedAt || "never synced" : null,
    },
  };
}

// ── rendering ────────────────────────────────────────────────────────────────

const cell = (v) => String(v ?? "").replace(/[\t\r\n]+/g, " ").trim();
const md = (v) => cell(v).replace(/\|/g, "\\|");
const dash = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const figmaLink = (r) => `[${r.node}](https://www.figma.com/design/${r.fileKey}/?node-id=${r.node})`;
const listSome = (xs, n) => (xs.length <= n ? xs.join(", ") : `${xs.slice(0, n).join(", ")} and ${xs.length - n} more`);
// worklist.md sits in figma-catalog/, and a spec path runs from the package root.
const specCell = (r) => (!r.specState ? "—" : r.spec ? `[${r.specState}](../${r.spec})` : r.specState);
const specLine = (rows) => {
  const n = specMix(rows);
  return SPEC_STATES.map((k) => `${k} ${n[k]}`).join(", ");
};

export const TSV_COLUMNS = [
  "packet", "class", "series", "owner", "fileKey", "node", "page", "section", "title",
  "width", "band", "bandFrom", "status", "verdict", "implFiles", "route", "gap",
  "specState", "spec",
];

/** Where the design store's index came from, for the headers. */
const storeStamp = (w) =>
  w.stamps.store === null ? "the design store was not read" : `figma/store/index.json (synced ${w.stamps.store})`;

export function renderTsv(w) {
  const line = (r, p) =>
    [
      r.packet, CLASSES[r.cls], p?.series || "", r.owner || "", r.fileKey, r.node, r.page, r.section, r.title,
      dash(r.width), dash(r.band), r.bandFrom, r.status, dash(r.verdict),
      [...r.paths, ...r.hints.map((h) => `~${h}`)].join(" ") || "—", dash(r.route), r.gap || "",
      dash(r.specState), dash(r.spec),
    ].map(cell).join("\t");
  const out = [
    `# worklist.tsv — derived by worklist.mjs from registry.json (${w.stamps.registry}), coverage.json (${w.stamps.coverage}, harvest ${w.stamps.harvest}) and ${storeStamp(w)}. Do not edit.`,
    `# packet: P = a lane packet, B = backend work (blocked-on-backend), D = design redraw (frame-defect). implFiles: paths cited by the row; a ~ path is the nearest code a NONE row names, not an owner.`,
    `# width: the measured frame width, — when the node was never measured. band from measured or declared (title).`,
    `# specState: the frame's spec in the design store, stored (an index entry and its file) | stale (Figma changed after it was stored) | missing (no entry, or its file is gone), the worklist's rule in figma/SCHEMA.md. spec: its path from the skai-ui package root, — when missing. Both — when the store was not read.`,
    TSV_COLUMNS.join("\t"),
  ];
  for (const p of w.packets) for (const r of p.frames) out.push(line(r, p));
  for (const g of w.backend) for (const r of g.frames) out.push(line(r, null));
  for (const g of w.design) for (const r of g.frames) out.push(line(r, null));
  return out.join("\n") + "\n";
}

export function renderMd(w) {
  const s = w.stats;
  const o = [];
  const sizes = s.sizes.slice().sort((a, b) => a - b);
  const offScope = Object.entries(s.outOfScope).sort((a, b) => cmp(a[0], b[0])).map(([k, n]) => `${k} ${n}`).join(", ") || "none";
  o.push("# Figma catalog worklist", "");
  o.push(
    `Derived by \`worklist.mjs\` (\`npm run catalog:worklist\`) from \`registry.json\` (${w.stamps.registry}), \`coverage.json\` (${w.stamps.coverage}, live harvest ${w.stamps.harvest}) and ${w.stamps.store === null ? "no design store (not read)" : `the design store's \`figma/store/index.json\` (synced ${w.stamps.store})`}. Do not edit; regenerate. Machine copy: \`worklist.tsv\`.`,
    "",
  );
  o.push("## Totals", "");
  o.push(
    `- **Packets:** ${s.open} open in-scope frames (partial ${s.byStatus.partial}, not-started ${s.byStatus["not-started"]}, unknown ${s.byStatus.unknown}) in ${w.packets.length} packets of ${sizes[0] ?? 0} to ${sizes[sizes.length - 1] ?? 0} frames (median ${sizes[Math.floor(sizes.length / 2)] ?? 0}; target ${s.min}-${s.max}).`,
    `- **Backend work:** ${s.blocked} blocked-on-backend frames in ${w.backend.length} groups by the gap each row names (${s.gapNamed} of ${s.blocked} name it in a sentence this tool recognises; the rest say "read the row"). Never dispatched as UI lanes.`,
    `- **Design redraws:** ${s.design} frame-defect frames in ${w.design.length} sections. The frame is wrong and the code is right, so there is nothing for a code lane to change.`,
    `- **Left out:** done ${s.done}, furniture ${s.furniture}, ruled-out ${s.ruledOut}, live frames no row covers ${s.liveOnly}; not-done frames on pages outside in-scope: ${offScope}.`,
    `- **Checked:** the in-scope tallies reproduce coverage.json's rollup, and every frame here joins exactly one registry frame.`,
    s.specs
      ? `- **Design store:** of the ${s.specs.stored + s.specs.stale + s.specs.missing} frames listed here, ${s.specs.stored + s.specs.stale} ${s.specs.stored + s.specs.stale === 1 ? "has" : "have"} a spec in \`figma/store/\` (${s.specs.stale} of them stale) and ${s.specs.missing} ${s.specs.missing === 1 ? "has" : "have"} none. Read one with \`npm run figma:spec -- <fileKey>:<node>\`; \`npm run figma:sync -- extract-script\` fetches stale frames and those with no index entry, worklist packets first, and a frame whose entry has lost its file only when named with \`--file <fileKey> --nodes <node>\` (see \`../figma/README.md\`).`
      : "- **Design store:** not read, so no row carries a spec.",
    "",
  );
  o.push("## How packets are cut", "");
  o.push(
    "- **Owner:** one path from the frame's implFiles: a file before a directory, then the path the most open frames cite, then the later entry. No path: the route, else the family.",
    `- **Size:** an owner over ${s.max} frames becomes a series (\`1/3\`, \`2/3\` ...) that shares files and runs in order. Owners under ${s.min} are packed together by class + section + directory, then by class + section.`,
    "- **Rank:** money-trade, then wagering, then user-facing, then internal; within a class by frame count.",
    "- **Conflicts:** packets that cite the same path, or a directory holding the other's file. Two conflicting packets must not run at once.",
    "",
  );
  o.push(`## Wave 1: the first ${w.wave1.length} packets that share no file`, "");
  o.push("| packet | class | frames | owner | status |", "|---|---|---|---|---|");
  for (const p of w.wave1) o.push(`| ${p.id} | ${p.className} | ${p.frames.length} | ${md(p.label)}${p.series ? ` (${p.series})` : ""} | ${md(p.mix)} |`);
  o.push("");
  o.push("## Packets", "");
  o.push("| packet | class | frames | owner | status | conflicts |", "|---|---|---|---|---|---|");
  for (const p of w.packets)
    o.push(`| ${p.id} | ${p.className} | ${p.frames.length} | ${md(p.label)}${p.series ? ` (${p.series})` : ""} | ${md(p.mix)} | ${p.conflicts.length} |`);
  o.push("");
  for (const p of w.packets) {
    o.push(`### ${p.id} · ${p.className} · ${md(p.label)}${p.series ? ` · series ${p.series}` : ""} · ${p.frames.length} frames`, "");
    o.push(`- Section: ${p.section}. Status: ${p.mix}.`);
    if (p.owners.length > 1) o.push(`- Owners: ${p.owners.map((x) => `\`${md(x)}\``).join(", ")}`);
    o.push(`- Files: ${p.files.length ? p.files.map((x) => `\`${md(x)}\``).join(", ") : "none cited"}`);
    if (p.hints.length) o.push(`- Nearest code named by NONE rows: ${p.hints.map((x) => `\`${md(x)}\``).join(", ")}`);
    if (p.routes.length) o.push(`- Routes: ${p.routes.map((x) => `\`${md(x)}\``).join(", ")}`);
    o.push(`- Conflicts: ${p.conflicts.length ? listSome(p.conflicts, 12) : "none"}`);
    if (s.specs) o.push(`- Specs: ${specLine(p.frames)}`);
    o.push("");
    o.push("| node | page | title | width | status | verdict | spec |", "|---|---|---|---|---|---|---|");
    for (const r of p.frames)
      o.push(`| ${figmaLink(r)} | ${md(r.page)} | ${md(r.title)} | ${r.width ?? `— (${r.band ?? "no band"}, declared)`} | ${r.status} | ${dash(r.verdict)} | ${specCell(r)} |`);
    o.push("");
  }
  o.push("## Backend work (blocked-on-backend)", "");
  o.push("Grouped by section and the gap sentence. A gap marked *read the row* is the row's opening sentence, because no sentence in it named a missing source this tool could recognise.", "");
  for (const g of w.backend) {
    o.push(`### ${g.id} · ${g.className} · ${g.section} · ${g.frames.length} frame${g.frames.length === 1 ? "" : "s"}`, "");
    o.push(`> ${md(g.gap || "(the row carries no reason)")}${g.gapFound ? "" : " *(read the row)*"}`, "");
    o.push(`Frames: ${g.frames.map(figmaLink).join(", ")}`, "");
    if (s.specs) o.push(`Specs: ${specLine(g.frames)}`, "");
  }
  o.push("## Design redraws (frame-defect)", "");
  o.push("Each of these frames draws something the product must not ship (SCHEMA.md, Status semantics). The redraw belongs to design; the code stays as it is.", "");
  for (const g of w.design) {
    o.push(`### ${g.id} · ${g.className} · ${g.section} · ${g.frames.length} frame${g.frames.length === 1 ? "" : "s"}`, "");
    o.push(`Frames: ${g.frames.map(figmaLink).join(", ")}`, "");
    if (s.specs) o.push(`Specs: ${specLine(g.frames)}`, "");
  }
  return o.join("\n");
}

// ── main ─────────────────────────────────────────────────────────────────────

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

function selfTest() {
  let pass = 0;
  let fail = 0;
  const check = (name, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : `\n        ${detail}`}`);
    ok ? pass++ : fail++;
  };
  const PRIMARY = "PRIM";
  // A fixture is a list of frames; the coverage rollup is computed from it, so
  // only a case that breaks the rollup on purpose can fail that check.
  const fixture = (specs) => {
    const pages = new Map();
    const frameStatuses = [];
    const frames = {};
    for (const s of specs) {
      const page = s.page ?? "P";
      const fileKey = s.fileKey ?? PRIMARY;
      const scope = s.scope ?? "in-scope";
      pages.set(`${fileKey}|${page}`, { fileKey, pageName: page, scope });
      frameStatuses.push({ id: s.id, page, scope, status: s.status, claimed: s.status, verdict: s.verdict ?? null });
      frames[fileKey === PRIMARY ? s.id : `${fileKey}:${s.id}`] = {
        section: s.section ?? "home",
        fileKey,
        fileName: s.fileName ?? "Skai-Web-App",
        node: s.id,
        title: s.title ?? `Frame ${s.id}`,
        family: s.family ?? "fam",
        device: s.device === undefined ? "desktop" : s.device,
        ...(s.w ? { measuredViewport: `${s.w}x900` } : {}),
        implFiles: s.impl ?? [],
        route: s.route ?? null,
        notes: s.notes ?? "",
      };
    }
    const rollup = {};
    for (const [st, key] of Object.entries(ROLLUP_KEYS))
      rollup[key] = frameStatuses.filter((f) => f.scope === "in-scope" && f.status === st).length;
    return {
      registry: { fileKey: PRIMARY, generated: "2026-01-01T00:00:00.000Z", frames },
      coverage: { generated: "2026-01-01T00:00:01.000Z", harvestedAt: "2026-01-01", rollup, pages: [...pages.values()], frameStatuses },
    };
  };
  const range = (n, f) => Array.from({ length: n }, (_, i) => f(i));
  const allRows = (w) => w.packets.flatMap((p) => p.frames);
  const packetOf = (w, node) => w.packets.find((p) => p.frames.some((r) => r.node === node))?.id;

  {
    const w = buildWorklist(
      fixture([
        { id: "1-1", status: "partial", impl: ["src/a/A.tsx"] },
        { id: "1-2", status: "partial", scope: "wip", page: "W", impl: ["src/a/A.tsx"] },
        { id: "1-3", status: "partial", scope: "tombstone", page: "T", impl: ["src/a/A.tsx"] },
        { id: "1-4", status: "not-started", scope: "excluded", page: "X", impl: ["src/a/A.tsx"] },
      ]),
    );
    check(
      "scope: only an in-scope page yields packet frames",
      !w.problems && allRows(w).map((r) => r.node).join() === "1-1" && w.stats.outOfScope.wip === 1 && w.stats.outOfScope.tombstone === 1,
      JSON.stringify(w.problems ?? allRows(w).map((r) => r.node)),
    );
  }
  {
    const w = buildWorklist(
      fixture([
        { id: "2-1", status: "done", impl: ["src/a/A.tsx"] },
        { id: "2-2", status: "furniture" },
        { id: "2-3", status: "unknown", impl: ["src/a/A.tsx"] },
        { id: "2-4", status: "not-started" },
        { id: "2-5", status: "partial", verdict: "ruled-out", impl: ["src/a/A.tsx"] },
      ]),
    );
    const got = allRows(w).map((r) => r.node).sort().join();
    check(
      "done, furniture and a ruled-out verdict are left out; unknown and not-started are packeted",
      !w.problems && got === "2-3,2-4" && w.stats.ruledOut === 1,
      JSON.stringify(w.problems ?? got),
    );
  }
  {
    const w = buildWorklist(
      fixture([
        {
          id: "3-1",
          status: "blocked-on-backend",
          notes: "NOT RE-READ THIS PASS - carried. The frame draws a leaderboard. There is no table for invoices, so nothing can list them. [vverify: partial | shot | no source]",
          impl: ["src/b/B.tsx"],
        },
        { id: "3-2", status: "frame-defect", notes: "The paytable prints 60x where the rail pays 50x.", impl: ["src/b/B.tsx"] },
        { id: "3-3", status: "partial", impl: ["src/b/B.tsx"] },
      ]),
    );
    check(
      "blocked-on-backend becomes backend work with its gap sentence, never a packet",
      !w.problems && w.backend.length === 1 && w.backend[0].frames[0].node === "3-1" && /no table for invoices/.test(w.backend[0].gap) && w.backend[0].gapFound && !packetOf(w, "3-1"),
      JSON.stringify(w.problems ?? w.backend.map((g) => g.gap)),
    );
    check(
      "frame-defect becomes a design redraw, never a packet",
      !w.problems && w.design.length === 1 && w.design[0].frames[0].node === "3-2" && !packetOf(w, "3-2") && packetOf(w, "3-3"),
      JSON.stringify(w.problems ?? w.design),
    );
  }
  {
    const g1 = gapSentence("NOT RE-READ. Carried from wave 40. [vverify: partial | x | the rpc is missing]");
    const g2 = gapSentence("Probed 2026-09-01. The predict_comments relation is absent from prod and no migration creates it.");
    check(
      "gapSentence: the vverify marker is not the row, and an unrecognised row says so",
      g1.found === false && g1.gap === "NOT RE-READ." && !/rpc/.test(g1.gap),
      JSON.stringify(g1),
    );
    check("gapSentence: picks the sentence that names the missing relation", g2.found && /predict_comments relation is absent/.test(g2.gap), JSON.stringify(g2));
    const g3 = gapSentence("BLOCKED ON BACKEND, CARRIED. Skai Pro invoices and receipts have no table or function behind them.");
    check("gapSentence: a sentence naming the gap beats one that only files the row", g3.found && /^Skai Pro invoices/.test(g3.gap), JSON.stringify(g3));
  }
  {
    const w = buildWorklist(
      fixture(
        range(10, (i) => ({
          id: `22-${i + 1}`,
          status: "partial",
          section: "slide",
          fileName: "Skai-Games",
          impl: ["modules/skai-gaming/src/games/slide/SlideGame.tsx (+ SlideReel.tsx; rail at supabase/functions/_shared/slide.ts)"],
        })),
      ),
    );
    check(
      "owner: a settlement rail the row cites is listed, never chosen as the owner",
      !w.problems && w.packets.length === 1 && w.packets[0].owners.join() === "modules/skai-gaming/src/games/slide/SlideGame.tsx" && w.packets[0].files.includes("supabase/functions/_shared/slide.ts"),
      JSON.stringify(w.problems ?? w.packets.map((p) => [p.owners, p.files])),
    );
  }
  {
    const games = ["limbo", "keno", "plinko", "coinflip"];
    const w = buildWorklist(
      fixture(
        games.flatMap((game, g) =>
          range(5, (i) => ({ id: `23-${g * 10 + i + 1}`, status: "partial", section: game, fileName: "Skai-Games", impl: [`modules/skai-gaming/src/games/instant/${game}.tsx`] })),
        ),
      ),
    );
    check(
      "merge: single-game owners in one directory pack across their sections",
      !w.problems && w.packets.length === 1 && w.packets[0].frames.length === 20 && w.packets[0].owners.length === 4,
      JSON.stringify(w.problems ?? w.packets.map((p) => [p.owners, p.frames.length])),
    );
  }
  {
    const w = buildWorklist(
      fixture([
        ...range(15, (i) => ({ id: `24-${i + 1}`, status: "partial", impl: ["src/pane/Big.tsx"] })),
        ...range(3, (i) => ({ id: `24-${i + 31}`, status: "partial", impl: ["src/pane/Tiny.tsx"] })),
      ]),
    );
    check(
      "merge: a leftover small group tops up a full-sized packet in its directory",
      !w.problems && w.packets.length === 1 && w.packets[0].frames.length === 18,
      JSON.stringify(w.problems ?? w.packets.map((p) => [p.owners, p.frames.length])),
    );
  }
  {
    const e1 = extractPaths(["NONE - nearest is src/pages/defi/Earn.tsx:211 (OpportunityCard)"]);
    const e2 = extractPaths(["src/pages/a/A.tsx + src/lib/b.ts", "src/pages/Airdrop.tsx:175-188", "—", "src/components/trade/mobile/"]);
    check(
      "extractPaths: a NONE row's path is a hint, never an owner",
      e1.paths.length === 0 && e1.hints.join() === "src/pages/defi/Earn.tsx",
      JSON.stringify(e1),
    );
    check(
      "extractPaths: joined paths split, line numbers and trailing slashes drop",
      e2.paths.join() === "src/pages/a/A.tsx,src/lib/b.ts,src/pages/Airdrop.tsx,src/components/trade/mobile" && !isFile(e2.paths[3]),
      JSON.stringify(e2),
    );
    check("normRoute: prose after the route is not part of it", normRoute("/earn (App.tsx:1332)") === "/earn" && normRoute("/ -> scan QR") === "/" && normRoute("wallet") === null);
  }
  {
    const w = buildWorklist(
      fixture([
        ...range(12, (i) => ({ id: `4-${i + 1}`, status: "partial", impl: ["src/hub/Hub.tsx"] })),
        { id: "4-99", status: "partial", impl: ["src/leaf/Own.tsx", "src/hub/Hub.tsx"] },
        ...range(11, (i) => ({ id: `5-${i + 1}`, status: "partial", impl: ["src/other/Other.tsx"], section: "social" })),
      ]),
    );
    const hub = w.packets.find((p) => p.owners.includes("src/hub/Hub.tsx"));
    const other = w.packets.find((p) => p.owners.includes("src/other/Other.tsx"));
    check(
      "owner: a frame citing a leaf and the hub is owned by the hub most frames cite",
      !w.problems && hub && hub.frames.length === 13 && packetOf(w, "4-99") === hub.id,
      JSON.stringify(w.problems ?? w.packets.map((p) => [p.id, p.owners, p.frames.length])),
    );
    check(
      "owner: two owners get two packets whose file sets do not overlap",
      !w.problems && other && other.id !== hub.id && !other.files.some((x) => hub.files.some((y) => overlaps(x, y))) && hub.conflicts.length === 0,
      JSON.stringify(w.problems ?? [hub?.files, other?.files]),
    );
  }
  {
    const w = buildWorklist(fixture(range(60, (i) => ({ id: `6-${i + 1}`, status: "partial", impl: ["src/big/Big.tsx"] }))));
    const sizes = w.packets.map((p) => p.frames.length).join();
    const series = w.packets.map((p) => p.series).join();
    check(
      "split: 60 frames on one file become a 3-packet series of 20, run in order",
      !w.problems && sizes === "20,20,20" && series === "1/3,2/3,3/3" && w.wave1.length === 1,
      `sizes ${sizes} series ${series} wave1 ${w.wave1?.length}`,
    );
  }
  {
    const w = buildWorklist(
      fixture([
        ...range(4, (i) => ({ id: `7-${i + 1}`, status: "partial", impl: ["src/dir/A.tsx"] })),
        ...range(4, (i) => ({ id: `7-${i + 11}`, status: "partial", impl: ["src/dir/B.tsx"] })),
        ...range(4, (i) => ({ id: `7-${i + 21}`, status: "not-started", impl: ["src/dir/C.tsx"] })),
      ]),
    );
    check(
      "merge: three 4-frame owners in one directory pack into one 12-frame packet",
      !w.problems && w.packets.length === 1 && w.packets[0].frames.length === 12 && w.packets[0].owners.length === 3,
      JSON.stringify(w.problems ?? w.packets.map((p) => [p.owners, p.frames.length])),
    );
  }
  {
    const w = buildWorklist(
      fixture([
        ...range(10, (i) => ({ id: `8-${i + 1}`, status: "partial", section: "trade", impl: ["src/pages/trade/Spot.tsx"], route: "/spot" })),
        ...range(25, (i) => ({ id: `9-${i + 1}`, status: "partial", section: "social", impl: ["src/pages/social/Feed.tsx"], route: "/social" })),
        ...range(15, (i) => ({ id: `10-${i + 1}`, status: "partial", section: "dice", fileName: "Skai-Games", impl: ["modules/skai-gaming/src/Dice.tsx"], route: "/play/dice" })),
      ]),
    );
    const order = w.packets.map((p) => p.className).join();
    check(
      "rank: a 10-frame trade packet outranks a 15-frame game and a 25-frame social packet",
      !w.problems && order === "money-trade,wagering,user-facing" && w.packets[0].id === "P001",
      order,
    );
  }
  {
    const w = buildWorklist(
      fixture([
        { id: "11-1", status: "partial", w: 1440, device: "desktop", impl: ["src/w/W.tsx"] },
        { id: "11-2", status: "partial", device: "mobile", impl: ["src/w/W.tsx"] },
      ]),
    );
    const [a, b] = ["11-1", "11-2"].map((n) => allRows(w).find((r) => r.node === n));
    check(
      "width: the measured width is reported; an unmeasured frame reads — with its declared band",
      !w.problems && a.width === 1440 && a.bandFrom === "measured" && b.width === null && b.bandFrom === "declared" && /\t—\tmobile\tdeclared\t/.test(renderTsv(w)),
      JSON.stringify([a, b].map((r) => r && [r.width, r.bandFrom])),
    );
  }
  {
    const shared = "src/shared/Panel.tsx";
    const w = buildWorklist(
      fixture([
        ...range(11, (i) => ({ id: `12-${i + 1}`, status: "partial", impl: ["src/x/X.tsx"] })),
        { id: "12-99", status: "partial", impl: ["src/x/X.tsx", shared] },
        ...range(14, (i) => ({ id: `13-${i + 1}`, status: "partial", impl: ["src/y/Y.tsx"] })),
        { id: "13-99", status: "partial", impl: ["src/y/Y.tsx", shared] },
      ]),
    );
    const x = w.packets.find((p) => p.owners.includes("src/x/X.tsx"));
    const y = w.packets.find((p) => p.owners.includes("src/y/Y.tsx"));
    check(
      "conflict: packets sharing a secondary file are marked, and wave 1 takes only one",
      !w.problems && x && y && x.conflicts.includes(y.id) && y.conflicts.includes(x.id) && w.wave1.length === 1,
      JSON.stringify(w.problems ?? [x?.owners, x?.conflicts, y?.owners, y?.conflicts, w.wave1.map((p) => p.id)]),
    );
  }
  {
    const f = fixture([
      ...range(30, (i) => ({ id: `14-${i + 1}`, status: i % 3 ? "partial" : "not-started", impl: [`src/d${i % 4}/F${i % 7}.tsx`], family: `f${i % 5}` })),
      ...range(6, (i) => ({ id: `15-${i + 1}`, status: "blocked-on-backend", notes: `There is no source for item ${i % 2}.` })),
    ]);
    const a = buildWorklist(f);
    const shuffled = {
      registry: { ...f.registry, frames: Object.fromEntries(Object.entries(f.registry.frames).reverse()) },
      coverage: { ...f.coverage, frameStatuses: f.coverage.frameStatuses.slice().reverse(), pages: f.coverage.pages.slice().reverse() },
    };
    const b = buildWorklist(shuffled);
    check(
      "determinism: reversed input order renders byte-identical md and tsv",
      !a.problems && renderMd(a) === renderMd(b) && renderTsv(a) === renderTsv(b),
      "outputs differ",
    );
  }
  {
    const f = fixture([{ id: "16-1", status: "partial", impl: ["src/a/A.tsx"] }]);
    delete f.registry.frames["16-1"];
    const w = buildWorklist(f);
    check("refuses: an open frame that joins no registry frame", Array.isArray(w.problems) && /16-1.*joins no registry frame/.test(w.problems.join()), JSON.stringify(w.problems));
  }
  {
    const f = fixture([{ id: "17-1", status: "partial", impl: ["src/a/A.tsx"] }]);
    f.coverage.rollup.partial = 2;
    const w = buildWorklist(f);
    check("refuses: tallies that do not reproduce the published rollup", Array.isArray(w.problems) && /rollup\.partial publishes 2/.test(w.problems.join()), JSON.stringify(w.problems));
  }
  {
    const f = fixture([{ id: "18-1", status: "partial", impl: ["src/a/A.tsx"] }]);
    f.coverage.frameStatuses[0].status = "shipped";
    const w = buildWorklist(f);
    check("refuses: a status this tool has no route for", Array.isArray(w.problems) && /"shipped"/.test(w.problems.join()), JSON.stringify(w.problems));
  }
  {
    // Control: an exact expected assignment, so a build that puts everything in
    // one packet (or none) cannot pass on the loose checks above.
    const w = buildWorklist(
      fixture([
        ...range(10, (i) => ({ id: `19-${i + 1}`, status: "partial", section: "wallet", impl: ["modules/skai-wallet/src/Send.tsx"] })),
        ...range(10, (i) => ({ id: `20-${i + 1}`, status: "partial", section: "home", impl: ["src/home/Feed.tsx"] })),
        { id: "21-1", status: "blocked-on-backend", section: "home", notes: "No table backs it." },
      ]),
    );
    const got = w.packets.map((p) => `${p.id}:${p.className}:${p.owners.join("+")}:${p.frames.length}`).join(" ");
    check(
      "control: two clean owners give exactly two packets and one backend group",
      !w.problems && got === "P001:money-trade:modules/skai-wallet/src/Send.tsx:10 P002:user-facing:src/home/Feed.tsx:10" && w.backend.length === 1 && w.design.length === 0,
      got,
    );
  }
  {
    // The design store: every row's spec path and state come off store/index.json
    // by <fileKey>:<node in colon form>, and nothing else about the row changes.
    const OTHER = "GAMESFILEKEY0000000000";
    const specs = [
      ...["30-1", "30-2", "30-3", "30-4", "30-5", "30-8", "30-9"].map((id) => ({ id, status: "partial", impl: ["src/s/S.tsx"] })),
      { id: "30-6", status: "blocked-on-backend", notes: "No table backs it.", impl: ["src/s/S.tsx"] },
      { id: "30-1", status: "partial", fileKey: OTHER, page: "G", fileName: "Skai-Games", impl: ["src/s/S.tsx"] },
    ];
    const at = (n) => `store/${PRIMARY}/${n}.json`;
    const frames = {
      [`${PRIMARY}:30:1`]: { hash: "a1", path: at("30-1") },
      [`${PRIMARY}:30:2`]: { hash: "a2", path: at("30-2"), stale: true },
      [`${PRIMARY}:30:4`]: { hash: "a4", path: at("30-4") },
      [`${PRIMARY}:30:1/30:5`]: { hash: "p5", path: `store/${PRIMARY}/30-1/30-5.json`, partOf: `${PRIMARY}:30:1` },
      [`${PRIMARY}:30:6`]: { hash: "a6", path: at("30-6") },
      [`${PRIMARY}:30:8`]: { hash: "a8", path: at("30-8"), partOf: `${PRIMARY}:30:1` },
      [`${PRIMARY}:30:9`]: { hash: "a9" },
    };
    const onDisk = new Set([at("30-1"), at("30-2"), `store/${PRIMARY}/30-1/30-5.json`, at("30-6"), at("30-8"), at("30-9")]);
    const store = { index: { v: 1, syncedAt: "2026-09-24T08:00:00.000Z", frames }, has: (rel) => onDisk.has(rel) };
    const f = fixture(specs);
    const w = buildWorklist({ ...f, store });
    const rowsOf = (x) => [...x.packets.flatMap((p) => p.frames), ...x.backend.flatMap((g) => g.frames), ...x.design.flatMap((g) => g.frames)];
    const got = rowsOf(w).map((r) => `${r.fileKey === PRIMARY ? "" : "other:"}${r.node}=${r.specState}${r.spec ? ` ${r.spec}` : ""}`).sort().join(" | ");
    const want = [
      `30-1=stored figma/store/${PRIMARY}/30-1.json`,
      `30-2=stale figma/store/${PRIMARY}/30-2.json`,
      "30-3=missing",
      "30-4=missing",
      "30-5=missing",
      `30-6=stored figma/store/${PRIMARY}/30-6.json`,
      "30-8=missing",
      `30-9=stored figma/store/${PRIMARY}/30-9.json`,
      "other:30-1=missing",
    ].join(" | ");
    check(
      "store: stored and stale carry the spec path; no entry, a gone file, a split part or another file's entry read missing",
      !w.problems && got === want,
      `got  ${got}\n        want ${want}`,
    );
    const tsv = renderTsv(w);
    const tsvRow = (node, fk = PRIMARY) => tsv.split("\n").find((l) => l.split("\t")[4] === fk && l.split("\t")[5] === node) || "";
    const header = tsv.split("\n").find((l) => l.startsWith("packet\t"));
    check(
      "store: worklist.tsv ends each row with specState and spec, a dash for a missing path",
      header === TSV_COLUMNS.join("\t") &&
        TSV_COLUMNS.slice(-2).join() === "specState,spec" &&
        tsvRow("30-2").endsWith(`\tstale\tfigma/store/${PRIMARY}/30-2.json`) &&
        tsvRow("30-4").endsWith("\tmissing\t—") &&
        tsvRow("30-1", OTHER).endsWith("\tmissing\t—") &&
        tsv.split("\n").filter((l) => l && !l.startsWith("#")).every((l) => l.split("\t").length === TSV_COLUMNS.length) &&
        /figma\/store\/index\.json \(synced 2026-09-24T08:00:00\.000Z\)/.test(tsv.split("\n")[0]),
      [header, tsvRow("30-2"), tsvRow("30-4")].join("\n        "),
    );
    const mdText = renderMd(w);
    const mdRow = (node, fk = PRIMARY) => mdText.split("\n").find((l) => l.startsWith(`| [${node}](https://www.figma.com/design/${fk}/`)) || "";
    check(
      "store: worklist.md links a stored or stale spec from its packet table and counts every group",
      mdRow("30-2").endsWith(` | [stale](../figma/store/${PRIMARY}/30-2.json) |`) &&
        mdRow("30-1").endsWith(` | [stored](../figma/store/${PRIMARY}/30-1.json) |`) &&
        mdRow("30-1", OTHER).endsWith(" | missing |") &&
        mdRow("30-3").endsWith(" | missing |") &&
        mdText.includes("- Specs: stored 2, stale 1, missing 5") &&
        mdText.includes("Specs: stored 1, stale 0, missing 0") &&
        mdText.includes("of the 9 frames listed here, 4 have a spec in `figma/store/` (1 of them stale) and 5 have none."),
      [mdRow("30-2"), mdRow("30-3")].join("\n        "),
    );
    const bare = buildWorklist(f);
    const shape = (x) => x.packets.map((p) => `${p.id}:${p.frames.map((r) => r.node).join(",")}`).join(" ") + ` B${x.backend.length} D${x.design.length}`;
    check(
      "store: reading the store changes no packet, and without it every row renders unread",
      !bare.problems && shape(bare) === shape(w) && rowsOf(bare).every((r) => r.specState === "" && r.spec === "") &&
        renderTsv(bare).split("\n").filter((l) => l && !l.startsWith("#") && !l.startsWith("packet\t")).every((l) => l.endsWith("\t—\t—")) &&
        renderMd(bare).includes("- **Design store:** not read") && /the design store was not read/.test(renderTsv(bare)),
      shape(bare),
    );
    const flipped = {
      registry: { ...f.registry, frames: Object.fromEntries(Object.entries(f.registry.frames).reverse()) },
      coverage: { ...f.coverage, frameStatuses: f.coverage.frameStatuses.slice().reverse(), pages: f.coverage.pages.slice().reverse() },
      store: { index: { ...store.index, frames: Object.fromEntries(Object.entries(frames).reverse()) }, has: store.has },
    };
    const w2 = buildWorklist(flipped);
    check("store: reversed index and input order render byte-identical md and tsv", renderMd(w2) === mdText && renderTsv(w2) === tsv, "outputs differ");
  }
  {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "worklist-store-"));
    const none = readStore(tmp);
    fs.mkdirSync(path.join(tmp, "store", "K"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "store", "K", "1-2.json"), "{}");
    fs.writeFileSync(path.join(tmp, "store", "index.json"), JSON.stringify({ v: 1, syncedAt: "x", frames: { "K:1:2": { path: "store/K/1-2.json" }, "K:1:3": { path: "store/K/1-3.json" } } }));
    const real = readStore(tmp);
    const onFile = [specOf(real, "K", "1-2"), specOf(real, "K", "1-3")];
    fs.writeFileSync(path.join(tmp, "store", "index.json"), '{"v":1,"frames":{');
    let broken = null;
    try {
      readStore(tmp);
    } catch (e) {
      broken = e.message;
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    check(
      "readStore: no index is an empty store with a note; the file check is on disk; an index that does not parse is refused",
      Object.keys(none.index.frames).length === 0 && /not found/.test(none.note || "") &&
        onFile[0].state === "stored" && onFile[0].path === "figma/store/K/1-2.json" && onFile[1].state === "missing" && real.note === null &&
        /not valid JSON/.test(broken || ""),
      JSON.stringify([none.note, onFile, broken]),
    );
  }
  {
    // On real files, the states the readers do not agree on: a spec file with no entry (what an ingest leaves when
    // it stops between writing the files and the index), a liveHash, which the contract does not define, and a
    // stale entry whose file is gone.
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "worklist-split-"));
    fs.mkdirSync(path.join(tmp, "store", "K"), { recursive: true });
    for (const n of ["1-4", "1-5"]) fs.writeFileSync(path.join(tmp, "store", "K", `${n}.json`), "{}");
    const frames = {
      "K:1:5": { hash: "a", liveHash: "b", path: "store/K/1-5.json" },
      "K:1:6": { hash: "a", path: "store/K/1-6.json", stale: true },
    };
    fs.writeFileSync(path.join(tmp, "store", "index.json"), JSON.stringify({ v: 1, syncedAt: "x", frames }));
    const s = readStore(tmp);
    const got = ["1-4", "1-5", "1-6"].map((n) => {
      const r = specOf(s, "K", n);
      return `${n}=${r.state}${r.path ? ` ${r.path}` : ""}`;
    }).join(" | ");
    fs.rmSync(tmp, { recursive: true, force: true });
    const want = "1-4=missing | 1-5=stored figma/store/K/1-5.json | 1-6=missing";
    check(
      "specOf: a spec file with no entry is missing, a liveHash without the flag is stored, a stale entry whose file is gone is missing",
      got === want,
      `got  ${got}\n        want ${want}`,
    );
  }
  {
    // figma/SCHEMA.md's "Stored, stale, missing" table says what the worklist calls each state the readers
    // disagree on. Build each one and hold specOf to the table's worklist column, so the two cannot drift apart.
    const REL = "store/K/1-2.json";
    const STATES = {
      "a spec file, no entry": { frames: {}, disk: [REL] },
      "an entry whose file is gone": { frames: { "K:1:2": { hash: "a", path: REL } }, disk: [] },
      "the same, flagged stale": { frames: { "K:1:2": { hash: "a", path: REL, stale: true } }, disk: [] },
      "an entry and its file, `liveHash` unlike `hash`, no flag": { frames: { "K:1:2": { hash: "a", liveHash: "b", path: REL } }, disk: [REL] },
    };
    let text = "";
    try {
      text = fs.readFileSync(path.join(FIGMA_DIR, "SCHEMA.md"), "utf8").replace(/\r\n/g, "\n");
    } catch {
      // no contract to read: the check below fails on the empty section
    }
    const section = /\n### Stored, stale, missing\n([\s\S]*?)(?=\n#{2,3} )/.exec(text)?.[1] ?? "";
    const table = section.split("\n").filter((l) => l.startsWith("|")).map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
    const head = table[0] ?? [];
    const col = head.indexOf("worklist");
    const bad = [];
    const seen = new Set();
    for (const row of table.slice(2)) {
      const st = STATES[row[0]];
      if (!st) {
        bad.push(`a row this check does not know: "${row[0]}"`);
        continue;
      }
      seen.add(row[0]);
      const got = specOf({ index: { frames: st.frames }, has: (rel) => st.disk.includes(rel) }, "K", "1-2").state;
      if (got !== row[col]) bad.push(`"${row[0]}": SCHEMA.md says ${row[col]}, specOf says ${got}`);
    }
    for (const k of Object.keys(STATES)) if (!seen.has(k)) bad.push(`no row "${k}"`);
    check(
      "SCHEMA.md's Stored, stale, missing table gives the state specOf gives, row by row",
      head[0] === "the store holds" && col > 0 && !bad.length,
      bad.join("; ") || `table header: ${head.join(" | ") || "none found"}`,
    );
  }
  console.log(`\nself-test: ${pass}/${pass + fail} passed.`);
  process.exit(fail ? 1 : 0);
}

function main(argv) {
  const opt = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const outDir = path.resolve(opt("--out") ?? DIR);
  const lanes = opt("--lanes") ? Number(opt("--lanes")) : LANES;
  if (!Number.isInteger(lanes) || lanes < 1) {
    console.error(`worklist: --lanes wants a positive whole number, got ${opt("--lanes")}`);
    process.exit(1);
  }
  const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  let store;
  try {
    store = readStore(FIGMA_DIR);
  } catch (e) {
    console.error(`worklist: REFUSED, nothing written. ${e.message}`);
    process.exit(2);
  }
  if (store.note) console.error(`note: ${store.note}`);
  const w = buildWorklist({ registry: read("registry.json"), coverage: read("coverage.json"), store, lanes });
  if (w.problems) {
    console.error(`worklist: REFUSED, nothing written. ${w.problems.length} problem(s) with the inputs:`);
    for (const p of w.problems.slice(0, 20)) console.error(`  ${p}`);
    if (w.problems.length > 20) console.error(`  and ${w.problems.length - 20} more`);
    console.error("Regenerate the catalog (npm run catalog) so registry.json and coverage.json come from one run.");
    process.exit(2);
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "worklist.md"), renderMd(w));
  fs.writeFileSync(path.join(outDir, "worklist.tsv"), renderTsv(w));
  const s = w.stats;
  console.log(
    `worklist: ${s.open} open frames in ${w.packets.length} packets; ${s.blocked} backend frames in ${w.backend.length} groups; ${s.design} design redraws.`,
  );
  console.log(`design store: ${s.specs.stored} stored, ${s.specs.stale} stale, ${s.specs.missing} missing, from ${storeStamp(w)}`);
  console.log(`wrote ${path.join(outDir, "worklist.md")} and worklist.tsv`);
  console.log("\ntop packets:");
  for (const p of w.packets.slice(0, 5))
    console.log(`  ${p.id}  ${p.className.padEnd(11)} ${String(p.frames.length).padStart(2)}  ${p.label}${p.series ? ` (${p.series})` : ""}  [${p.mix}]`);
}

if (IS_MAIN) {
  if (process.argv.includes("--self-test")) selfTest();
  else main(process.argv.slice(2));
}
