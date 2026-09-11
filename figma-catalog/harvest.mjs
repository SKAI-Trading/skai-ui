#!/usr/bin/env node
/**
 * harvest.mjs — the one way to read live Figma into this catalog.
 *
 * Every harvest before this one was a script somebody typed into `use_figma`
 * for that wave. That is how the catalog got a 20-character name cap on 48 of
 * 49 pages (2026-08-26), a page-children capture diffed against a full-subtree
 * registry (wave 21, 97 false "deleted with code" rows), and a count taken from
 * `get_metadata` that agreed with a node list taken from `get_metadata` and
 * certified nothing (wave 21 again). None of those was a bad idea at the time;
 * they were the same idea re-derived under pressure with one detail wrong.
 *
 * This file fixes the details once:
 *
 *   plan          size the calls from the page list, so no call can hit the
 *                 20KB cap that silently truncates a `use_figma` result
 *   script        print the exact Plugin-API code for one chunk — full names,
 *                 top-level children only, and the page's OWN child count in
 *                 every chunk so a short capture is refused, never folded in
 *   ingest        write live/<fileKey>__<pageId>.tsv and both page manifests
 *                 (live/_pages.json, pages.json) — but only for a page whose
 *                 chunks reconcile to its count with no gap, overlap or dupe
 *   to-snapshot   bridge live/ into the section-keyed snapshot that
 *                 validate-snapshot.mjs, figma-drift.mjs and
 *                 snapshot-to-nodes.mjs already consume, so ONE harvest feeds
 *                 coverage AND drift instead of two hand-made ones
 *   probe-script  print the code that asks Figma whether each catalogued id
 *                 that is not a live top-level child still exists (nested, or
 *                 deleted) — the only instrument that separates the two
 *   probe-ingest  record those answers in live/_resolved.json, which
 *                 coverage.mjs already reads, and which to-snapshot uses to
 *                 keep a nested-but-alive id rather than report it removed
 *   verify-script print the code that hashes every page of a file (one
 *                 FNV-1a per page over the exact harvest rows) in ONE call
 *   verify-ingest compare those hashes with live/: an equal page is stamped
 *                 harvested today, a changed or new page is named for a
 *                 real harvest. Run this FIRST — on 2026-09-10 it showed two
 *                 of the three files unchanged and saved forty chunk reads
 *
 * Usage:
 *   node harvest.mjs verify-script --file <fileKey>
 *   node harvest.mjs verify-ingest <verify.json> [...] [--write]
 *   node harvest.mjs plan   --file <fileKey> [--counts pagelist.json|verify.json] [--budget 13000]
 *   node harvest.mjs script --file <fileKey> --chunk '[["9061:15449",0,null]]'
 *   node harvest.mjs ingest <chunk.json> [...] [--write] [--full]
 *   node harvest.mjs to-snapshot [--out snapshot.live.json]
 *   node harvest.mjs probe-script --file <fileKey>
 *   node harvest.mjs probe-ingest <probe.json> [...] [--write]
 *   node harvest.mjs section --file <fileKey> --page <pageId> --name <slug>
 *   node harvest.mjs --self-test
 *
 * `section` scaffolds a NEW section for a harvested page that has none:
 * <slug>.nodes.txt, <slug>.titles.tsv and the page's `sections` entry in
 * pages.json. build-registry.mjs still needs its SECTION_FILE / SECTIONS /
 * game-name literals edited by hand; it reports a missing one on the next run.
 *
 * Every subcommand that writes is a dry run without `--write`.
 *
 * The page-list read that feeds `plan` is one `use_figma` call per file:
 *
 *   const out = [];
 *   for (const p of figma.root.children) { await p.loadAsync(); out.push([p.id, p.name, p.children.length]); }
 *   return { file: figma.root.name, pages: out };
 *
 * `loadAsync` reads a page without switching to it, which is why one call can
 * cover a whole file. An UNLOADED page reports `children.length === 0` — a
 * plausible zero, not an error — so the load is not optional.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const LIVE = path.join(DIR, "live");
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export const hyphen = (s) => String(s).trim().replace(":", "-");
export const colon = (s) => String(s).trim().replace("-", ":");
const today = () => new Date().toISOString().slice(0, 10);

/**
 * Readiness from the page name. SCHEMA.md: the leading emoji is the team's
 * signal (Casey 2026-07-28) because Figma's own devStatus is unreadable here.
 * Returns null when the name says nothing, so a caller can keep what it had.
 */
export function readinessOf(name) {
  const n = String(name || "").trim();
  if (n.startsWith("✅")) return "ready";
  if (n.startsWith("🚧") || /^WIP\b/i.test(n)) return "wip";
  // ✝️ is the tombstone marker (build-registry.mjs:26): the body moved to
  // another file and the page is kept only so old links still resolve.
  if (n.startsWith("✝")) return "tombstone";
  if (n.startsWith("📍") || n.startsWith("🌎")) return "meta";
  if (n === "Thumbnail" || /^-+$/.test(n)) return "meta";
  // A bare name ("Towars Draft (Disregard)") says nothing the vocabulary
  // knows; return null so the manifest's own value survives the harvest.
  return null;
}

/**
 * A NEW page has no ruling yet. Anything ready-for-dev with no section is
 * `unscoped`, which coverage.mjs reports and does not count — a ✅ page that
 * silently joined the denominator would move the parity number without anyone
 * deciding it should. Scope is Casey's call; this only makes the page visible.
 */
export function provisionalScope(readiness) {
  if (readiness === "ready") return "unscoped";
  if (readiness === "meta") return "meta";
  if (readiness === "tombstone") return "tombstone";
  return "wip";
}

// ── file helpers ─────────────────────────────────────────────────────────────
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
// Keep whatever indent the file already uses (pages.json is one space,
// live/_pages.json two) so a harvest diff shows data, not a re-indent.
const indentOf = (p) => {
  try {
    const m = fs.readFileSync(p, "utf8").match(/^\{\r?\n([ \t]+)"/);
    return m ? m[1] : 2;
  } catch {
    return 2;
  }
};
const writeJson = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, indentOf(p)) + "\n");
const readLines = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8").split(/\r?\n/).filter((l) => l.trim()) : []);
const tsvPath = (fileKey, pageId) => path.join(LIVE, `${fileKey}__${hyphen(pageId)}.tsv`);

/** Parse one live/*.tsv row. Same rule as coverage.mjs: an absent 6th column is VISIBLE. */
export function parseLiveRow(line) {
  const [id, name, type, w, h, visible] = line.split("\t");
  return { id: colon(id), name: name ?? "", type: type ?? "", w: +w || 0, h: +h || 0, visible: visible !== "0" };
}

function fileKeysKnown() {
  const keys = new Map();
  const reg = path.join(DIR, "registry.json");
  if (fs.existsSync(reg)) for (const [k, v] of Object.entries(readJson(reg).fileKeys || {})) keys.set(k, v);
  const man = path.join(LIVE, "_pages.json");
  if (fs.existsSync(man)) for (const p of readJson(man).pages) if (!keys.has(p.fileKey)) keys.set(p.fileKey, "?");
  return keys;
}

// ── plan ─────────────────────────────────────────────────────────────────────
/**
 * Split a file's pages into chunks that fit one `use_figma` result.
 *
 * `use_figma` cuts its return value at 20KB and appends `// truncated to 20kb`,
 * which makes the payload unparseable rather than short — so a chunk that
 * overflows is detected, but it costs a round trip. Row length is estimated per
 * page from the last harvest plus headroom for full names (the 08-26 files are
 * capped at 20 characters, so their average understates).
 *
 * @param pages   [[pageId, pageName, n], ...] — the live page list
 * @param estFor  (pageId) => estimated chars per row
 * @param budget  chars of row text per chunk
 */
export function planChunks(pages, estFor, budget = 13000) {
  const chunks = [];
  let cur = [];
  let curBytes = 0;
  const flush = () => {
    if (cur.length) chunks.push(cur);
    cur = [];
    curBytes = 0;
  };
  for (const [id, , n] of pages) {
    const est = estFor(id);
    const perChunk = Math.max(1, Math.floor(budget / est));
    if (n === 0) {
      cur.push([id, 0, null]);
      continue;
    }
    if (n * est > budget) {
      // Balanced parts, not greedy fills: 442 rows at 147 per call is three
      // calls of ~147, not three of 147 and one carrying a single row.
      flush();
      const parts = Math.ceil(n / perChunk);
      const size = Math.ceil(n / parts);
      for (let from = 0; from < n; from += size) chunks.push([[id, from, Math.min(n, from + size)]]);
      continue;
    }
    if (curBytes + n * est > budget) flush();
    cur.push([id, 0, null]);
    curBytes += n * est;
  }
  flush();
  return chunks;
}

function cmdPlan(args) {
  const fileKey = arg(args, "--file");
  if (!fileKey) die("plan: --file <fileKey> is required");
  const budget = +arg(args, "--budget") || 13000;
  const manifest = readJson(path.join(LIVE, "_pages.json"));
  let pages;
  const countsPath = arg(args, "--counts");
  if (countsPath) {
    const doc = readJson(countsPath);
    pages = (doc.pages || doc).map((p) => (Array.isArray(p) ? p : [p.id, p.name, p.n]));
  } else {
    pages = manifest.pages.filter((p) => p.fileKey === fileKey).map((p) => [p.pageId, p.pageName, p.n]);
    console.error("plan: sizing from live/_pages.json — pass --counts <pagelist.json> to size from a fresh page-list read");
  }
  const estFor = (pageId) => {
    const lines = readLines(tsvPath(fileKey, pageId));
    if (!lines.length) return 80;
    const avg = lines.reduce((a, l) => a + l.length, 0) / lines.length;
    // The 2026-08-26 sweep capped names at 20 characters, so its averages
    // understate — but only on pages where a name actually reached the cap.
    // "image 123" never did, and 1,157 of those need no headroom.
    const maxName = Math.max(...lines.map((l) => (l.split("\t")[1] || "").length));
    const row = manifest.pages.find((p) => p.fileKey === fileKey && p.pageId === pageId);
    const truncated = (row?.harvestedAt || manifest.harvestedAt) <= "2026-08-26" && maxName >= 20;
    return Math.max(60, Math.round(avg + (truncated ? 40 : 15)));
  };
  const chunks = planChunks(pages, estFor, budget);
  const nameOf = new Map(pages.map((p) => [p[0], p[1]]));
  console.log(`plan: ${fileKey} — ${pages.length} pages, ${pages.reduce((a, p) => a + p[2], 0)} rows, ${chunks.length} chunks at ~${budget} chars`);
  chunks.forEach((c, i) => {
    const desc = c.map(([id, from, to]) => `${id} ${nameOf.get(id)}${to == null ? "" : ` [${from},${to})`}`).join(" | ");
    console.log(`  ${String(i + 1).padStart(2)}  ${JSON.stringify(c)}\n      ${desc}`);
  });
  const out = arg(args, "--out");
  if (out) {
    writeJson(out, { fileKey, budget, chunks });
    console.log(`plan written: ${out}`);
  }
}

// ── script ───────────────────────────────────────────────────────────────────
/**
 * The Plugin-API code for one chunk. Read-only. Returns, per page in the plan:
 * its name, its OWN top-level child count, the index range captured, and the
 * rows as TSV text. The page list of the whole file rides along on every
 * chunk so `ingest` can see a page that was renamed or removed.
 */
export function chunkScript(fileKey, chunk) {
  return `const FILE_KEY = ${JSON.stringify(fileKey)};
const PLAN = ${JSON.stringify(chunk)};
const clean = (s) => String(s).replace(/\\s+/g, " ").trim();
const out = [];
for (const [pid, from, to] of PLAN) {
  const p = figma.root.children.find((x) => x.id === pid);
  if (!p) { out.push([pid, null, -1, from, to, ""]); continue; }
  await p.loadAsync();
  const kids = p.children;
  const end = to == null ? kids.length : Math.min(to, kids.length);
  const rows = [];
  for (let i = from; i < end; i++) {
    const n = kids[i];
    rows.push([n.id, clean(n.name), n.type, Math.round(n.width || 0), Math.round(n.height || 0), n.visible ? 1 : 0].join("\\t"));
  }
  out.push([pid, p.name, kids.length, from, end, rows.join("\\n")]);
}
return { harvest: 1, fileKey: FILE_KEY, file: figma.root.name, pages: figma.root.children.map((p) => [p.id, p.name]), chunks: out };`;
}

function cmdScript(args) {
  const fileKey = arg(args, "--file");
  const chunk = arg(args, "--chunk");
  if (!fileKey || !chunk) die("script: --file <fileKey> --chunk '<json>' are required");
  process.stdout.write(chunkScript(fileKey, JSON.parse(chunk)) + "\n");
}

// ── ingest ───────────────────────────────────────────────────────────────────
/**
 * Reconcile chunk payloads into complete pages. Pure, so the self-test can
 * drive it. Returns { pages: Map<"fileKey|pageId", {...}>, refused: [...],
 * pageLists: Map<fileKey, [[id,name],...]> }.
 */
export function reconcile(payloads) {
  const acc = new Map();
  const refused = [];
  const pageLists = new Map();
  for (const { source, doc } of payloads) {
    if (!doc || doc.harvest !== 1 || !doc.fileKey || !Array.isArray(doc.chunks)) {
      refused.push({ source, why: "not a harvest payload (want {harvest:1, fileKey, chunks})" });
      continue;
    }
    if (Array.isArray(doc.pages)) pageLists.set(doc.fileKey, doc.pages);
    for (const [pid, pname, total, from, end, text] of doc.chunks) {
      const key = `${doc.fileKey}|${pid}`;
      if (total < 0) {
        refused.push({ source, page: key, why: "page id not found in the file" });
        continue;
      }
      const e = acc.get(key) || { fileKey: doc.fileKey, pageId: pid, pageName: pname, total, ranges: [], rows: new Map(), sources: new Set() };
      if (e.total !== total) refused.push({ source, page: key, why: `chunks disagree on the page's child count: ${e.total} vs ${total}` });
      e.sources.add(source);
      e.ranges.push([from, end]);
      const lines = text ? text.split("\n") : [];
      if (lines.length !== end - from) refused.push({ source, page: key, why: `range [${from},${end}) carries ${lines.length} rows, expected ${end - from}` });
      lines.forEach((l, i) => {
        const r = parseLiveRow(l);
        if (!/^\d+:\d+$/.test(r.id)) refused.push({ source, page: key, why: `row ${from + i} has no node id: ${JSON.stringify(l.slice(0, 60))}` });
        else if (e.rows.has(r.id)) refused.push({ source, page: key, why: `duplicate node id ${r.id} (chunk overlap?)` });
        else e.rows.set(r.id, { ...r, index: from + i });
      });
      acc.set(key, e);
    }
  }
  const pages = new Map();
  for (const [key, e] of acc) {
    e.ranges.sort((a, b) => a[0] - b[0]);
    let cursor = 0;
    let gap = null;
    for (const [from, end] of e.ranges) {
      if (from !== cursor) {
        gap = from > cursor ? `gap [${cursor},${from})` : `overlap at ${from}`;
        break;
      }
      cursor = end;
    }
    if (!gap && cursor !== e.total) gap = `gap [${cursor},${e.total})`;
    if (gap) {
      refused.push({ page: key, why: `INCOMPLETE: ${gap} — captured ${e.rows.size} of ${e.total} live children` });
      continue;
    }
    if (e.rows.size !== e.total) {
      refused.push({ page: key, why: `SHORT: ${e.rows.size} rows against the page's own count ${e.total}` });
      continue;
    }
    pages.set(key, { ...e, rows: [...e.rows.values()].sort((a, b) => a.index - b.index) });
  }
  return { pages, refused, pageLists };
}

function loadPayload(file) {
  const raw = fs.readFileSync(file, "utf8");
  if (/\/\/\s*truncated to 20kb/i.test(raw)) return { source: file, doc: null, why: "payload was cut at 20KB by use_figma — re-run with a smaller chunk" };
  try {
    return { source: file, doc: JSON.parse(raw) };
  } catch (e) {
    return { source: file, doc: null, why: `not JSON: ${e.message}` };
  }
}

function cmdIngest(args) {
  const write = args.includes("--write");
  const full = args.includes("--full");
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) die("ingest: at least one chunk.json is required");

  const loaded = files.map(loadPayload);
  const { pages, refused, pageLists } = reconcile(loaded.filter((l) => l.doc));
  for (const l of loaded) if (!l.doc) refused.push({ source: l.source, why: l.why });

  const manifest = readJson(path.join(LIVE, "_pages.json"));
  const pagesJson = readJson(path.join(DIR, "pages.json"));
  const stamp = today();
  const report = [];
  const changelog = [];
  const byKey = (p) => `${p.fileKey}|${p.pageId}`;
  const manIdx = new Map(manifest.pages.map((p) => [byKey(p), p]));
  const pjIdx = new Map(pagesJson.pages.map((p) => [byKey(p), p]));

  // Pages the file no longer has, or has renamed — visible only because every
  // chunk carries the file's page list.
  for (const [fileKey, list] of pageLists) {
    const liveIds = new Map(list.map(([id, name]) => [id, name]));
    for (const p of manifest.pages.filter((x) => x.fileKey === fileKey)) {
      if (!liveIds.has(p.pageId)) report.push(`  !! ${p.pageName} (${p.pageId}) is in live/_pages.json but NOT in the file's page list any more — left in place, rule on it`);
    }
    for (const [id, name] of liveIds) {
      const key = `${fileKey}|${id}`;
      if (!manIdx.has(key) && !pages.has(key)) report.push(`  !! ${name} (${id}) is a page in the file with no manifest row and no chunk in this ingest — harvest it`);
    }
  }

  for (const [key, e] of [...pages.entries()].sort()) {
    const file = tsvPath(e.fileKey, e.pageId);
    const before = readLines(file).map(parseLiveRow);
    const beforeIds = new Set(before.map((r) => r.id));
    const afterIds = new Set(e.rows.map((r) => r.id));
    const added = e.rows.filter((r) => !beforeIds.has(r.id));
    const removed = before.filter((r) => !afterIds.has(r.id));
    const beforeName = new Map(before.map((r) => [r.id, r.name]));
    let renamed = 0;
    let lengthened = 0;
    for (const r of e.rows) {
      const was = beforeName.get(r.id);
      if (was == null || was === r.name) continue;
      if (was.length === 20 && r.name.startsWith(was)) lengthened++;
      else renamed++;
    }
    const readiness = readinessOf(e.pageName);
    const man = manIdx.get(key);
    const pj = pjIdx.get(key);
    const line = [];
    line.push(`${e.pageName} (${e.pageId})  ${before.length} -> ${e.rows.length}`);
    if (added.length) line.push(`+${added.length}`);
    if (removed.length) line.push(`-${removed.length}`);
    if (renamed) line.push(`${renamed} renamed`);
    if (lengthened) line.push(`${lengthened} names un-truncated`);
    if (man && man.pageName !== e.pageName) {
      line.push(`PAGE RENAMED from "${man.pageName}"`);
      changelog.push(`${e.fileKey} ${e.pageId}: page renamed "${man.pageName}" -> "${e.pageName}"`);
    }
    if (man && readiness && man.readiness !== readiness) {
      line.push(`readiness ${man.readiness} -> ${readiness}`);
      changelog.push(`${e.fileKey} ${e.pageId} ${e.pageName}: readiness ${man.readiness} -> ${readiness}`);
    }
    if (!man) {
      line.push("NEW PAGE (scope provisional)");
      changelog.push(`${e.fileKey} ${e.pageId} ${e.pageName}: NEW page, ${e.rows.length} top-level children, scope ${provisionalScope(readiness)} pending a ruling`);
    }
    if (added.length || removed.length) changelog.push(`${e.fileKey} ${e.pageId} ${e.pageName}: ${before.length} -> ${e.rows.length} top-level children (+${added.length} / -${removed.length})`);
    report.push("  " + line.join("  "));
    for (const r of added.slice(0, 8)) report.push(`      + ${r.id}\t${r.type}\t${r.w}x${r.h}\t${r.name}`);
    if (added.length > 8) report.push(`      + … ${added.length - 8} more`);
    for (const r of removed.slice(0, 8)) report.push(`      - ${r.id}\t${r.type}\t${r.w}x${r.h}\t${r.name}`);
    if (removed.length > 8) report.push(`      - … ${removed.length - 8} more`);

    if (!write) continue;
    fs.writeFileSync(file, e.rows.map((r) => [r.id, r.name, r.type, r.w, r.h, r.visible ? 1 : 0].join("\t")).join("\n") + "\n");
    if (man) {
      man.pageName = e.pageName;
      if (readiness) man.readiness = readiness;
      man.n = e.rows.length;
      man.harvestedAt = stamp;
    } else {
      manifest.pages.push({
        fileKey: e.fileKey,
        pageId: e.pageId,
        pageName: e.pageName,
        readiness: readiness || "unknown",
        n: e.rows.length,
        openReports: 0,
        scope: provisionalScope(readiness),
        harvestedAt: stamp,
        note: `Added by harvest.mjs ingest ${stamp}. Scope is PROVISIONAL until ruled on; coverage.mjs reports it and does not count it.`,
      });
    }
    if (pj) {
      pj.pageName = e.pageName;
      if (readiness) pj.readiness = readiness;
      pj.liveChildren = e.rows.length;
    } else {
      pagesJson.pages.push({ fileKey: e.fileKey, pageId: e.pageId, pageName: e.pageName, readiness: readiness || "unknown", liveChildren: e.rows.length, sections: [] });
    }
  }

  console.log(`ingest: ${pages.size} page(s) complete, ${refused.length} refused, from ${files.length} payload(s).\n`);
  for (const r of report) console.log(r);
  if (refused.length) {
    console.log(`\n  ${refused.length} REFUSED — nothing is written for these pages:`);
    for (const r of refused) console.log(`    ${r.page || r.source}: ${r.why}`);
  }
  if (!write) {
    console.log("\n  DRY RUN — nothing written. Re-run with --write to apply.");
    return;
  }
  if (full) {
    const covered = new Set(pages.keys());
    const missing = manifest.pages.filter((p) => pageLists.has(p.fileKey) && !covered.has(byKey(p)) && p.n !== 0);
    if (missing.length) {
      console.log(`\n  --full REFUSED: ${missing.length} manifest page(s) were not in this ingest — the top-level harvestedAt stays at ${manifest.harvestedAt}:`);
      for (const p of missing) console.log(`    ${p.pageName} (${p.pageId})`);
    } else {
      manifest.harvestedAt = stamp;
      manifest.method = "harvest.mjs: one use_figma call per chunk (see `node harvest.mjs plan`); PageNode.loadAsync per page, top-level children only, full names; every chunk carries the page's own children.length and ingest refuses a page whose chunks do not reconcile to it";
      pagesJson.harvested = stamp;
      pagesJson.method = "harvest.mjs ingest --full: page names, readiness and liveChildren synced from live/_pages.json after a complete Plugin-API sweep of every page";
    }
  }
  if (changelog.length) {
    pagesJson.figmaChangeLog = pagesJson.figmaChangeLog || {};
    const prev = pagesJson.figmaChangeLog[stamp];
    pagesJson.figmaChangeLog[stamp] = [...(Array.isArray(prev) ? prev : prev ? [prev] : []), `harvest.mjs ingest${full ? " --full" : ""}:`, ...changelog];
  }
  writeJson(path.join(LIVE, "_pages.json"), manifest);
  writeJson(path.join(DIR, "pages.json"), pagesJson);
  console.log(`\n  wrote ${pages.size} live/*.tsv, live/_pages.json, pages.json${changelog.length ? ` (+${changelog.length} changelog lines)` : ""}.`);
  console.log("  Next: node coverage.mjs --check   then   node harvest.mjs to-snapshot");
}

// ── to-snapshot ──────────────────────────────────────────────────────────────
/**
 * Build the section-keyed snapshot from live/. Pure; the self-test drives it.
 *
 * @param pages     [{fileKey, pageId, pageName, n, harvestedAt, rows:[{id,name,...}]}]
 * @param sections  Map<"fileKey|pageId", [section, ...]>  (from pages.json)
 * @param knownIds  Map<section, Set<hyphen id>>            (from <section>.nodes.txt)
 * @param resolved  Map<hyphen id, {topLevelId, name, pageId}> — alive-but-nested
 *
 * A page with ONE section is the simple case. A page with two (Home 1 holds
 * `home` and `pwa`; Cover Images holds `cover-images` and
 * `missing-play-images`) is split by membership: an id already in a section's
 * node list stays there, and a NEW id goes to the first-listed section — the
 * catalog has no other evidence for which one it belongs to, and the split is
 * recorded on the snapshot so a reader can see it was a rule, not a fact.
 *
 * `nested` carries catalogued ids that are not top-level children but that
 * `probe` found alive under a live top-level frame. figma-drift.mjs and
 * snapshot-to-nodes.mjs treat them as PRESENT. Without this, every nested id
 * reads as a deletion — the wave-21 failure, 97 false "removed with work" rows.
 */
/**
 * A node listed in two sections' nodes.txt (home and pwa both carry the five
 * Install-to-homescreen frames) belongs to whichever section the registry keyed
 * it to, because that row is the one figma-drift.mjs diffs against. Left in
 * both, the first-listed section reports it ADDED and the owner reports it
 * REMOVED, and the same five frames show up as ten rows of drift.
 */
export function settleOwners(knownIds, ownerOf, fileOf) {
  let moved = 0;
  for (const [sec, ids] of knownIds) {
    // Node ids are unique only WITHIN a file. Skai-Games and Skai-Web-App-2
    // were both cloned from one ancestor, so `2713-3937` is a Directory frame
    // on Home 1 in one and a different Directory frame on Dice in the other;
    // the registry keeps both. Only a same-file listing is a duplicate.
    const file = fileOf.get(sec);
    for (const id of [...ids]) {
      const owner = ownerOf.get(`${file}|${id}`);
      if (owner && owner !== sec && knownIds.has(owner) && fileOf.get(owner) === file) {
        ids.delete(id);
        moved++;
      }
    }
  }
  return moved;
}

export function buildSnapshot(pages, sections, knownIds, resolved, stamp, knownTitles = new Map()) {
  const snap = {};
  const skipped = [];
  for (const p of pages) {
    const secs = sections.get(`${p.fileKey}|${p.pageId}`) || [];
    if (!secs.length) {
      skipped.push(`${p.pageName} (${p.pageId}) — no section in pages.json`);
      continue;
    }
    const liveTop = new Set(p.rows.map((r) => hyphen(r.id)));
    const buckets = new Map(secs.map((s) => [s, []]));
    for (const r of p.rows) {
      const id = hyphen(r.id);
      const owner = secs.find((s) => knownIds.get(s)?.has(id)) || secs[0];
      buckets.get(owner).push([id, r.name]);
    }
    for (const s of secs) {
      const nodes = buckets.get(s);
      const nested = [];
      for (const id of knownIds.get(s) || []) {
        if (liveTop.has(id)) continue;
        const r = resolved.get(id);
        if (!r || !r.topLevelId || !liveTop.has(hyphen(r.topLevelId))) continue;
        // A nested id keeps its CATALOG title. Its Figma layer name is "Frame
        // 166" or "circle"; the title in <section>.titles.tsv was written by
        // hand to say what the frame is, and snapshot-to-nodes writes whatever
        // is here back over it. Four such titles were lost on 2026-09-09.
        nested.push([id, knownTitles.get(s)?.get(id) ?? r.name ?? ""]);
      }
      snap[s] = {
        pageId: p.pageId,
        pageName: p.pageName,
        harvestedAt: p.harvestedAt || stamp,
        liveChildCount: nodes.length,
        pageChildCount: p.rows.length,
        countSource: "use_figma",
        nodesSource: "use_figma",
        ...(secs.length > 1 ? { splitFromPage: { sections: secs, rule: "known ids by membership; new ids to the first-listed section" } } : {}),
        nodes,
        ...(nested.length ? { nested } : {}),
      };
    }
  }
  return { snapshot: snap, skipped };
}

function cmdToSnapshot(args) {
  const out = arg(args, "--out") || path.join(DIR, "snapshot.live.json");
  const manifest = readJson(path.join(LIVE, "_pages.json"));
  const pagesJson = readJson(path.join(DIR, "pages.json"));
  const sections = new Map(pagesJson.pages.map((p) => [`${p.fileKey}|${p.pageId}`, p.sections || []]));
  const knownIds = new Map();
  for (const f of fs.readdirSync(DIR)) {
    if (!f.endsWith(".nodes.txt")) continue;
    knownIds.set(f.slice(0, -".nodes.txt".length), new Set(readLines(path.join(DIR, f)).map(hyphen)));
  }
  const regPath = path.join(DIR, "registry.json");
  if (fs.existsSync(regPath)) {
    const reg = readJson(regPath);
    const ownerOf = new Map();
    for (const fr of Object.values(reg.frames || {})) if (fr.section && fr.node) ownerOf.set(`${fr.fileKey}|${hyphen(fr.node)}`, fr.section);
    const fileOf = new Map(Object.entries(reg.sectionFile || {}));
    const moved = settleOwners(knownIds, ownerOf, fileOf);
    if (moved) console.log(`to-snapshot: ${moved} id(s) listed under two sections kept only where registry.json keys them`);
  }
  const resolved = new Map();
  const rp = path.join(LIVE, "_resolved.json");
  if (fs.existsSync(rp)) for (const [id, v] of Object.entries(readJson(rp).found || {})) resolved.set(hyphen(id), Array.isArray(v) ? v[0] : v);
  const knownTitles = new Map();
  for (const s of knownIds.keys()) {
    const tp = path.join(DIR, `${s}.titles.tsv`);
    if (!fs.existsSync(tp)) continue;
    knownTitles.set(s, new Map(readLines(tp).map((l) => { const i = l.indexOf("\t"); return [hyphen(l.slice(0, i)), l.slice(i + 1)]; })));
  }
  const pages = manifest.pages.map((p) => ({ ...p, rows: readLines(tsvPath(p.fileKey, p.pageId)).map(parseLiveRow) }));
  const { snapshot, skipped } = buildSnapshot(pages, sections, knownIds, resolved, manifest.harvestedAt, knownTitles);
  writeJson(out, snapshot);
  const secs = Object.keys(snapshot);
  const oldest = pages.filter((p) => sections.get(`${p.fileKey}|${p.pageId}`)?.length).map((p) => p.harvestedAt || manifest.harvestedAt).sort()[0];
  console.log(`to-snapshot: ${secs.length} section(s) from ${pages.length} live pages -> ${path.relative(process.cwd(), out) || out}`);
  console.log(`  oldest page in it harvested ${oldest}; ${secs.filter((s) => snapshot[s].nested).length} section(s) carry nested-but-alive ids`);
  for (const s of skipped) console.log(`  skipped: ${s}`);
  console.log("  Next: node validate-snapshot.mjs snapshot.live.json && node figma-drift.mjs snapshot.live.json");
}

// ── section ──────────────────────────────────────────────────────────────────
/**
 * Scaffold a NEW section from a harvested page: every top-level node, in page
 * order, into <name>.nodes.txt and <name>.titles.tsv, and the page's `sections`
 * entry in pages.json. Furniture (Directory, Breakpoint, loose rectangles) is
 * included on purpose — coverage.mjs classifies it, and a nodes list that
 * pre-filtered it would hide the count that classification is checked against.
 *
 * build-registry.mjs still needs its three literals edited by hand (SECTION_FILE,
 * the SECTIONS array, and the game-name map for a Games page); it says so on the
 * next run if one is missing.
 */
function cmdSection(args) {
  const fileKey = arg(args, "--file");
  const pageArg = arg(args, "--page");
  const name = arg(args, "--name");
  if (!fileKey || !pageArg || !name) die("usage: section --file <fileKey> --page <pageId> --name <slug>");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) die(`section name must be a lowercase slug, got ${JSON.stringify(name)}`);
  const manifest = readJson(path.join(LIVE, "_pages.json"));
  const page = manifest.pages.find((p) => p.fileKey === fileKey && p.pageId === colon(pageArg));
  if (!page) die(`no harvested page ${fileKey} ${pageArg} in live/_pages.json — harvest it first`);
  const rows = readLines(tsvPath(fileKey, page.pageId)).map(parseLiveRow);
  if (!rows.length) die(`${page.pageName} holds no top-level nodes — nothing to catalogue; record it in pages.json outOfScope instead`);
  const nodesPath = path.join(DIR, `${name}.nodes.txt`);
  const titlesPath = path.join(DIR, `${name}.titles.tsv`);
  if (fs.existsSync(nodesPath) || fs.existsSync(titlesPath)) die(`${name} already has a nodes/titles file — this scaffolds NEW sections; use to-snapshot + snapshot-to-nodes.mjs to update one`);
  const pagesPath = path.join(DIR, "pages.json");
  const pagesJson = readJson(pagesPath);
  const pj = pagesJson.pages.find((p) => p.fileKey === fileKey && p.pageId === page.pageId);
  if (!pj) die(`${page.pageName} is in live/_pages.json but not pages.json — run ingest --write first`);
  fs.writeFileSync(nodesPath, rows.map((r) => hyphen(r.id)).join("\n") + "\n");
  fs.writeFileSync(titlesPath, rows.map((r) => `${hyphen(r.id)}\t${r.name}`).join("\n") + "\n");
  pj.sections = Array.isArray(pj.sections) ? pj.sections : [];
  if (!pj.sections.includes(name)) pj.sections.push(name);
  writeJson(pagesPath, pagesJson);
  const frames = rows.filter((r) => r.type === "FRAME").length;
  console.log(`section ${name}: ${rows.length} top-level nodes (${frames} FRAME) from "${page.pageName}" -> ${name}.nodes.txt, ${name}.titles.tsv; pages.json sections now ${JSON.stringify(pj.sections)}`);
  console.log(`  next: add "${name}": "${fileKey}" to SECTION_FILE in build-registry.mjs, append "${name}" to its SECTIONS array (and to the game-name map for a Games page), then node pipeline.mjs`);
}

// ── probe ────────────────────────────────────────────────────────────────────
/** Catalogued ids on one file that are not live top-level children — the ones only Figma can classify. */
function probeCandidates(fileKey) {
  const manifest = readJson(path.join(LIVE, "_pages.json"));
  const live = new Set();
  for (const p of manifest.pages) if (p.fileKey === fileKey) for (const l of readLines(tsvPath(p.fileKey, p.pageId))) live.add(hyphen(l.split("\t")[0]));
  const reg = readJson(path.join(DIR, "registry.json"));
  const out = [];
  for (const f of Object.values(reg.frames)) {
    if (f.fileKey !== fileKey || f.gone) continue;
    if (!live.has(hyphen(f.node))) out.push({ id: hyphen(f.node), section: f.section, title: f.title });
  }
  return out;
}

export function probeScript(fileKey, ids) {
  return `const FILE_KEY = ${JSON.stringify(fileKey)};
const IDS = ${JSON.stringify(ids.map(colon))};
for (const p of figma.root.children) await p.loadAsync();
const out = [];
for (const id of IDS) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) { out.push([id, 0]); continue; }
  let top = n, depth = 0;
  while (top.parent && top.parent.type !== "PAGE") { top = top.parent; depth++; }
  const page = top.parent;
  out.push([id, 1, n.type, String(n.name).slice(0, 80), depth, top.id, page ? page.id : null, page ? page.name : null]);
}
return { probe: 1, fileKey: FILE_KEY, results: out };`;
}

function cmdProbeScript(args) {
  const fileKey = arg(args, "--file");
  if (!fileKey) die("probe-script: --file <fileKey> is required");
  const cands = probeCandidates(fileKey);
  console.error(`probe-script: ${cands.length} catalogued id(s) on ${fileKey} are not live top-level children:`);
  for (const c of cands) console.error(`  ${c.id}\t${c.section}\t${c.title || ""}`);
  if (!cands.length) return;
  process.stdout.write(probeScript(fileKey, cands.map((c) => c.id)) + "\n");
}

function cmdProbeIngest(args) {
  const write = args.includes("--write");
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) die("probe-ingest: at least one probe.json is required");
  const rp = path.join(LIVE, "_resolved.json");
  const resolved = fs.existsSync(rp) ? readJson(rp) : { found: {} };
  resolved.found = resolved.found || {};
  resolved.notFound = resolved.notFound || {};
  resolved.probes = resolved.probes || [];
  const stamp = today();
  let found = 0;
  let missing = 0;
  for (const file of files) {
    const doc = readJson(file);
    if (doc.probe !== 1 || !doc.fileKey || !Array.isArray(doc.results)) die(`${file}: not a probe payload`);
    for (const r of doc.results) {
      const id = hyphen(r[0]);
      if (r[1] === 1) {
        const [, , type, name, depth, topId, pageId, pageName] = r;
        resolved.found[id] = { fileKey: doc.fileKey, type, name, depth, topLevelId: hyphen(topId), pageId: pageId ? hyphen(pageId) : null, pageName, probedAt: stamp };
        delete resolved.notFound[id];
        found++;
        console.log(`  alive   ${id}\t${type}\tdepth ${depth}\tunder ${hyphen(topId)}\t${pageName}\t${name}`);
      } else {
        resolved.notFound[id] = { fileKey: doc.fileKey, probedAt: stamp };
        missing++;
        console.log(`  GONE    ${id}\t(getNodeByIdAsync returned null after loading every page of ${doc.fileKey})`);
      }
    }
    resolved.probes.push({ at: stamp, fileKey: doc.fileKey, checked: doc.results.length, found: doc.results.filter((r) => r[1] === 1).length });
  }
  resolved.resolvedAt = stamp;
  resolved.foundCount = Object.keys(resolved.found).length;
  resolved.notFoundCount = Object.keys(resolved.notFound).length;
  console.log(`\nprobe-ingest: ${found} alive (nested), ${missing} gone.`);
  if (!write) {
    console.log("  DRY RUN — live/_resolved.json untouched. Re-run with --write.");
    return;
  }
  writeJson(rp, resolved);
  console.log("  wrote live/_resolved.json. A GONE id is still reported by figma-drift.mjs as REMOVED; record it in bugref-aliases.tsv once someone has read the drift row.");
}

// ── verify (page-hash check) ─────────────────────────────────────────────────
/**
 * One FNV-1a 32-bit hash per page, over exactly the rows `script` would
 * return, computed once in Figma and once from live/. Equal means an ingest
 * would rewrite the page byte for byte, so the page can be stamped harvested
 * without the round trips; different means harvest that page. On 2026-09-10
 * three of these calls stood in for forty-eight chunk reads, because only the
 * Games file had moved. charCodeAt on both sides, so the two environments
 * agree on every character, emoji included.
 */
export function fnv1a(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16);
}

const foldWs = (s) => String(s).replace(/\s+/g, " ").trim();

/** The harvest row format, rebuilt from a parsed live/ row. */
export const harvestRow = (r) => [colon(r.id), foldWs(r.name), r.type, r.w, r.h, r.visible ? 1 : 0].join("\t");

export function pageHashFromLive(fileKey, pageId) {
  const lines = readLines(tsvPath(fileKey, pageId));
  return { n: lines.length, hash: fnv1a(lines.map((l) => harvestRow(parseLiveRow(l))).join("\n")) };
}

export function verifyScript(fileKey) {
  return `const FILE_KEY = ${JSON.stringify(fileKey)};
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16); };
const clean = (s) => String(s).replace(/\\s+/g, " ").trim();
const out = [];
for (const p of figma.root.children) {
  await p.loadAsync();
  const rows = p.children.map((n) => [n.id, clean(n.name), n.type, Math.round(n.width || 0), Math.round(n.height || 0), n.visible ? 1 : 0].join("\\t"));
  out.push([p.id, p.name, rows.length, fnv(rows.join("\\n"))]);
}
return { verify: 1, fileKey: FILE_KEY, file: figma.root.name, pages: out };`;
}

function cmdVerifyScript(args) {
  const fileKey = arg(args, "--file");
  if (!fileKey) die("verify-script: --file <fileKey> is required");
  process.stdout.write(verifyScript(fileKey) + "\n");
}

/**
 * Compare a verify payload with live/. A page whose hash, row count and name
 * all match is stamped harvested today (with --write); anything else is
 * listed for a real harvest. The top-level stamp moves only when every page
 * in the manifest carries today's date, the same rule `ingest --full` keeps.
 */
export function compareVerify(docs, manifest) {
  const equal = [];
  const changed = [];
  const unknown = [];
  for (const doc of docs) {
    for (const [pageId, pageName, n, hash] of doc.pages) {
      const row = manifest.pages.find((p) => p.fileKey === doc.fileKey && p.pageId === pageId);
      if (!row || !fs.existsSync(tsvPath(doc.fileKey, pageId))) {
        unknown.push({ fileKey: doc.fileKey, pageId, pageName, n });
        continue;
      }
      const local = pageHashFromLive(doc.fileKey, pageId);
      const renamed = foldWs(row.pageName) !== foldWs(pageName);
      if (local.hash === hash && local.n === n && !renamed) equal.push({ row, pageName });
      else changed.push({ fileKey: doc.fileKey, pageId, pageName, n, wasN: local.n, renamed });
    }
  }
  return { equal, changed, unknown };
}

function cmdVerifyIngest(args) {
  const write = args.includes("--write");
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) die("verify-ingest: at least one verify.json is required");
  const manPath = path.join(LIVE, "_pages.json");
  const manifest = readJson(manPath);
  const docs = files.map((f) => {
    const doc = readJson(f);
    if (doc.verify !== 1 || !doc.fileKey || !Array.isArray(doc.pages)) die(`${f}: not a verify payload (run verify-script and save what use_figma returns)`);
    return doc;
  });
  const { equal, changed, unknown } = compareVerify(docs, manifest);
  const stamp = today();
  console.log(`verify-ingest: ${equal.length} page(s) equal to live/, ${changed.length} changed, ${unknown.length} not in the manifest.`);
  for (const c of changed) console.log(`  CHANGED  ${c.fileKey} ${c.pageId}\t${c.wasN} -> ${c.n}${c.renamed ? "\tRENAMED" : ""}\t${c.pageName}`);
  for (const u of unknown) console.log(`  NEW      ${u.fileKey} ${u.pageId}\t${u.n}\t${u.pageName}`);
  if (changed.length || unknown.length) {
    const byFile = new Map();
    for (const c of [...changed, ...unknown]) byFile.set(c.fileKey, (byFile.get(c.fileKey) || 0) + 1);
    for (const [fk, n] of byFile) console.log(`  next: node harvest.mjs plan --file ${fk} --counts <that file's verify.json>   (${n} page(s) to harvest; a chunk that also carries equal pages is harmless)`);
  }
  if (!write) {
    console.log("  DRY RUN — live/_pages.json untouched. Re-run with --write to stamp the equal pages.");
    return;
  }
  if (!equal.length) return;
  for (const { row } of equal) row.harvestedAt = stamp;
  if (manifest.pages.every((p) => p.harvestedAt === stamp)) manifest.harvestedAt = stamp;
  writeJson(manPath, manifest);
  const pagesPath = path.join(DIR, "pages.json");
  const pagesJson = readJson(pagesPath);
  pagesJson.figmaChangeLog = pagesJson.figmaChangeLog || {};
  const prev = pagesJson.figmaChangeLog[stamp];
  const byFile = new Map();
  for (const { row } of equal) byFile.set(row.fileKey, (byFile.get(row.fileKey) || 0) + 1);
  const line = `harvest.mjs verify-ingest: ${[...byFile].map(([fk, n]) => `${fk} ${n} page(s)`).join(", ")} hashed equal to live/ and stamped harvested${changed.length ? `; ${changed.length} changed page(s) left for ingest` : ""}.`;
  pagesJson.figmaChangeLog[stamp] = [...(Array.isArray(prev) ? prev : prev ? [prev] : []), line];
  writeJson(pagesPath, pagesJson);
  console.log(`  stamped ${equal.length} page(s) ${stamp}${manifest.harvestedAt === stamp ? " (top-level stamp moved too)" : ""}; wrote live/_pages.json and pages.json.`);
}

// ── self-test ────────────────────────────────────────────────────────────────
function selfTest() {
  let pass = 0;
  const cases = [];
  const check = (label, ok, detail = "") => {
    cases.push(label);
    if (ok) pass++;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : `\n        ${detail}`}`);
  };
  const row = (id, name = "Frame", type = "FRAME") => `${id}\t${name}\t${type}\t100\t100\t1`;
  const payload = (fileKey, chunks, pages = []) => ({ source: "t", doc: { harvest: 1, fileKey, pages, chunks } });

  {
    const r = reconcile([payload("F", [["1:1", "P", 3, 0, 2, [row("1:2"), row("1:3")].join("\n")], ["1:1", "P", 3, 2, 3, row("1:4")]])]);
    check("two chunks that tile a page reconcile to one complete page", r.pages.size === 1 && r.refused.length === 0 && r.pages.get("F|1:1").rows.length === 3, JSON.stringify(r.refused));
  }
  {
    const r = reconcile([payload("F", [["1:1", "P", 3, 0, 2, [row("1:2"), row("1:3")].join("\n")]])]);
    check("a page missing its tail is REFUSED, not written short", r.pages.size === 0 && r.refused.some((x) => /INCOMPLETE/.test(x.why)), JSON.stringify(r.refused));
  }
  {
    const r = reconcile([payload("F", [["1:1", "P", 2, 0, 1, row("1:2")], ["1:1", "P", 2, 0, 2, [row("1:2"), row("1:3")].join("\n")]])]);
    check("overlapping chunks (same id twice) are refused", r.pages.size === 0 && r.refused.some((x) => /duplicate/.test(x.why)), JSON.stringify(r.refused));
  }
  {
    const r = reconcile([payload("F", [["1:1", "P", 2, 0, 2, [row("1:2"), row("1:3")].join("\n")], ["1:1", "P", 5, 2, 5, [row("1:4"), row("1:5"), row("1:6")].join("\n")]])]);
    check("chunks that disagree on the page's child count are refused", r.refused.some((x) => /disagree/.test(x.why)), JSON.stringify(r.refused));
  }
  {
    const r = reconcile([payload("F", [["1:1", "P", 1, 0, 1, "Frame\tno id here\tFRAME\t1\t1\t1"]])]);
    check("a row whose first field is not a node id is refused", r.pages.size === 0 && r.refused.some((x) => /no node id/.test(x.why)), JSON.stringify(r.refused));
  }
  {
    const r = reconcile([{ source: "t", doc: { nope: true } }]);
    check("a payload that is not a harvest is refused", r.refused.length === 1 && r.pages.size === 0);
  }
  {
    // CONTROL: a complete single-chunk page with an empty page alongside.
    const r = reconcile([payload("F", [["1:1", "P", 1, 0, 1, row("1:2")], ["2:2", "Sep", 0, 0, 0, ""]])]);
    check("control: a one-row page and an empty page both reconcile", r.pages.size === 2 && r.refused.length === 0, JSON.stringify(r.refused));
  }
  check("readiness: ✅ ready / 🚧 wip / 📍 meta / ✝️ tombstone / bare name null", readinessOf("✅ Home 1") === "ready" && readinessOf("🚧 Social") === "wip" && readinessOf("📍 Master sheet") === "meta" && readinessOf("WIP Safari") === "wip" && readinessOf("✝️ Home (moved)") === "tombstone" && readinessOf("Towars Draft (Disregard)") === null && provisionalScope("tombstone") === "tombstone");
  {
    const chunks = planChunks([["a", "A", 5], ["b", "B", 5], ["c", "C", 30]], () => 100, 1000);
    const flat = chunks.flat();
    const cRanges = flat.filter((c) => c[0] === "c").map((c) => [c[1], c[2]]);
    check("plan: small pages pack together, a big page splits by offset with no gap", chunks.length === 4 && JSON.stringify(cRanges) === "[[0,10],[10,20],[20,30]]" && flat.filter((c) => c[0] !== "c").length === 2, JSON.stringify(chunks));
  }
  {
    const pages = [{ fileKey: "F", pageId: "1:1", pageName: "✅ Home 1", n: 3, rows: [{ id: "1:2", name: "home a" }, { id: "1:3", name: "pwa a" }, { id: "1:4", name: "brand new" }] }];
    const sections = new Map([["F|1:1", ["home", "pwa"]]]);
    const known = new Map([["home", new Set(["1-2", "9-9"])], ["pwa", new Set(["1-3"])]]);
    const resolved = new Map([["9-9", { topLevelId: "1-2", name: "Frame 166" }]]);
    const titles = new Map([["home", new Map([["9-9", "Skai > Home > the thing this frame is"]])]]);
    const { snapshot } = buildSnapshot(pages, sections, known, resolved, "2026-01-01", titles);
    const ok =
      snapshot.home.nodes.map((n) => n[0]).join() === "1-2,1-4" &&
      snapshot.pwa.nodes.map((n) => n[0]).join() === "1-3" &&
      snapshot.home.nested?.[0]?.[0] === "9-9" &&
      snapshot.home.nested?.[0]?.[1] === "Skai > Home > the thing this frame is" &&
      snapshot.home.countSource === "use_figma" &&
      snapshot.home.liveChildCount === 2 &&
      snapshot.home.pageChildCount === 3;
    check("to-snapshot: split page keeps known ids in their section, sends a new id to the first, keeps a nested-alive id", ok, JSON.stringify(snapshot));
  }
  {
    const { snapshot, skipped } = buildSnapshot([{ fileKey: "F", pageId: "7:7", pageName: "✝️ Tomb", n: 1, rows: [{ id: "7:8", name: "x" }] }], new Map(), new Map(), new Map(), "d");
    {
      const known = new Map([["home", new Set(["1-1", "2-2", "7-7"])], ["pwa", new Set(["2-2", "3-3"])], ["dice", new Set(["7-7"])]]);
      const fileOf = new Map([["home", "W"], ["pwa", "W"], ["dice", "G"]]);
      const ownerOf = new Map([["W|2-2", "pwa"], ["W|3-3", "pwa"], ["W|7-7", "home"], ["G|7-7", "dice"], ["W|9-9", "elsewhere"]]);
      const moved = settleOwners(known, ownerOf, fileOf);
      check("to-snapshot: a same-file id listed under two sections stays only where the registry keys it; a same-id node in ANOTHER file is untouched", moved === 1 && !known.get("home").has("2-2") && known.get("pwa").has("2-2") && known.get("home").has("1-1") && known.get("home").has("7-7") && known.get("dice").has("7-7"));
    }
    check("to-snapshot: a page with no section is skipped and named, not silently dropped", Object.keys(snapshot).length === 0 && skipped.length === 1);
  }
  {
    const js = chunkScript("F", [["1:1", 0, null]]);
    check("script: emitted code is read-only Plugin API (loadAsync, no setCurrentPageAsync, echoes the page's own count)", /loadAsync/.test(js) && !/setCurrentPageAsync/.test(js) && /return \{ harvest: 1/.test(js) && /kids\.length, from, end/.test(js) && !/\.(remove|appendChild|createFrame|set)\(/.test(js));
  }
  {
    check("verify: fnv1a matches the Figma-side implementation on the empty string and a known row", fnv1a("") === "811c9dc5" && fnv1a("1:2\tFrame\tFRAME\t100\t100\t1") === fnv1a(harvestRow(parseLiveRow("1-2\tFrame\tFRAME\t100\t100"))), fnv1a(harvestRow(parseLiveRow("1-2\tFrame\tFRAME\t100\t100"))));
    const js = verifyScript("F");
    check("verify: emitted code is read-only and hashes the harvest row format", /loadAsync/.test(js) && !/setCurrentPageAsync/.test(js) && /return \{ verify: 1/.test(js) && !/\.(remove|appendChild|createFrame|set)\(/.test(js));
    const manifest = { pages: [{ fileKey: "F", pageId: "1:1", pageName: "✅ Home", harvestedAt: "2026-01-01" }] };
    const r = compareVerify([{ verify: 1, fileKey: "F", pages: [["1:1", "✅ Home", 0, fnv1a("")], ["2:2", "✅ New page", 3, "abc"]] }], manifest);
    // "F" has no live/ file, so BOTH pages must land in unknown: a page the
    // manifest knows but live/ lacks is never equal, whatever Figma hashes to.
    check("verify: a page with no live/ file is never equal; an unlisted page is NEW", r.unknown.length === 2 && r.equal.length === 0 && r.changed.length === 0, JSON.stringify(r));
    const r2 = compareVerify([{ verify: 1, fileKey: "F", pages: [["1:1", "✅ Home renamed", 0, fnv1a("")]] }], manifest);
    check("verify: compare reads the manifest name too, so a rename alone is CHANGED once the file exists (unknown here, same reason)", r2.unknown.length === 1 && r2.equal.length === 0, JSON.stringify(r2));
  }
  console.log(`\nself-test: ${pass}/${cases.length} passed.`);
  process.exit(pass === cases.length ? 0 : 1);
}

// ── cli ──────────────────────────────────────────────────────────────────────
function arg(args, flag) {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
}
function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (IS_MAIN) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === "--help" || cmd === "-h") {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0].replace(/^\/\*\*\n/, "").replace(/^ \* ?/gm, ""));
    process.exit(0);
  }
  if (cmd === "--self-test") selfTest();
  else if (cmd === "plan") cmdPlan(rest);
  else if (cmd === "script") cmdScript(rest);
  else if (cmd === "ingest") cmdIngest(rest);
  else if (cmd === "to-snapshot") cmdToSnapshot(rest);
  else if (cmd === "probe-script") cmdProbeScript(rest);
  else if (cmd === "probe-ingest") cmdProbeIngest(rest);
  else if (cmd === "verify-script") cmdVerifyScript(rest);
  else if (cmd === "verify-ingest") cmdVerifyIngest(rest);
  else if (cmd === "section") cmdSection(rest);
  else die(`unknown subcommand ${cmd}; run with --help`);
}
