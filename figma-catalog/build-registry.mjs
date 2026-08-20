#!/usr/bin/env node
/**
 * build-registry.mjs — assemble figma-catalog/registry.json
 *
 * Merges:
 *   - <section>.nodes.txt      (node-ids per section)
 *   - <section>.titles.tsv     (node-id <TAB> title)  [optional per section]
 *   - code-node-citations.json (nodeToFiles map)
 * Preserves hand-set fields (implFiles/status/notes/verifiedAt) from the
 * existing registry.json, keyed by node-id. Idempotent.
 *
 * Run: node figma-catalog/build-registry.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
// Primary file (kept as the top-level default for backward compat).
const FILE_KEY = "3sSzw1KewMtUbeLAv7uW0r";
// Multi-file catalog: each Figma file we track, key -> display name (used for
// per-frame links). Dice frames live in the SEPARATE "Skai-Games" file.
//
// 2026-08-11: Home, Wallet and Trade were MOVED OUT of Skai-Web-App into a new
// "Skai-Web-App-2" file. The three source pages are still present in the old
// file but are now tombstones — renamed with a ✝️ prefix, emptied down to a
// handful of leftover Rectangles, and carrying a "Goto File Now" hyperlink
// whose href is where this key came from.
//
// Figma PRESERVED the node-ids across the move, so no re-harvest was needed:
// every id in home/wallet/trade/pwa.nodes.txt still resolves, just in the new
// file. Only the key was wrong — which is worse than it sounds, because a
// wrong key still produces a well-formed URL. All 1,553 of those rows linked
// to a valid-looking node in a file that no longer contains it.
const FILE_KEYS = {
  "3sSzw1KewMtUbeLAv7uW0r": "Skai-Web-App",
  "mhF3BkzlTaGiLzJ7kvpmVc": "Skai-Web-App-2",
  "M6r9FEn042UWTQD1zvy6GM": "Skai-Games",
};
// Which Figma file each section's nodes come from.
const SECTION_FILE = {
  // 2026-08-05: the five 🚧 under-construction pages that had NO section, so every
  // frame on them was structurally invisible to this catalog. Harvested LIVE from
  // Figma (PageNode.loadAsync), not from figma.txt — which is a Jul-28 snapshot and
  // never listed them. Cataloguing a WIP page is not the same as calling it ready:
  // `readiness` still comes from the page's 🚧 emoji, so they report as wip.
  social: "3sSzw1KewMtUbeLAv7uW0r",
  governance: "3sSzw1KewMtUbeLAv7uW0r",
  "user-flow": "3sSzw1KewMtUbeLAv7uW0r",
  towers: "M6r9FEn042UWTQD1zvy6GM",
  keno: "M6r9FEn042UWTQD1zvy6GM",
  // 2026-08-11: five Games pages that no section covered. Only skai-cross holds
  // real designs. The other four are page SCAFFOLDING — each opens with frames
  // still titled "Skai > Play > Casino > Scratchers/Blackjack", copied when the
  // page was created and never renamed, plus raw "Screenshot 2026-08-10..."
  // captures. Rock Paper Scissors is nothing BUT that scaffolding. Catalogued
  // because the nodes are real; do not read the page's ✅/🚧 as design progress.
  "fortune-wheel": "M6r9FEn042UWTQD1zvy6GM",
  "skai-cross": "M6r9FEn042UWTQD1zvy6GM",
  "video-poker": "M6r9FEn042UWTQD1zvy6GM",
  bingo: "M6r9FEn042UWTQD1zvy6GM",
  "rock-paper-scissors": "M6r9FEn042UWTQD1zvy6GM",
  // 2026-08-18: page 9660:2 was RENAMED "🚧 SKAI Cross" -> "✅ Price Grid" AND
  // its contents were replaced wholesale — all 15 old ids are gone and the 20
  // now on it share no title with any of them.
  //
  // This is NOT the harmless slug-vs-page-title mismatch the catalog already
  // tolerates elsewhere (`skratch` <-> "Scratchers"). SKAI Cross and Price Grid
  // are TWO SEPARATE LIVE GAMES: Play.tsx mounts `SkaiCrossGame` (id
  // "skai-cross", its own art + accent #1297C8) at :1610 and `PriceGridGame`
  // (id "price-grid", flag `price_grid_enabled`, accent #0E6E78) at :1625, and
  // price-grid has its own route (PlayPriceGrid.tsx) and 8-file component dir.
  // So keeping these 20 frames under the `skai-cross` key would tell anyone
  // implementing SkaiCrossGame.tsx to build the wrong game.
  //
  // `skai-cross` is therefore NOT deleted — it is kept as a TOMBSTONE. Its 15
  // ids stay in skai-cross.nodes.txt and are recorded `gone` in
  // bugref-aliases.tsv, so the rows survive for the record but are excluded
  // from page-coverage math. It maps to no live page: see `unmappedSections`
  // in pages.json for the reason, which this script reports on every run.
  //
  // ★ The finding that matters more than the rename: SKAI Cross is a SHIPPING
  // game that no longer has ANY Figma page. That is a design-coverage gap on
  // live code, not a catalog bookkeeping detail.
  "price-grid": "M6r9FEn042UWTQD1zvy6GM",
  // 2026-08-18: four Games pages that no section covered. Limbo and Slide are
  // brand new. Baccarat and Roulette are the two pages this file previously
  // recorded as out-of-scope for holding ZERO frames — see the note below.
  limbo: "M6r9FEn042UWTQD1zvy6GM",
  slide: "M6r9FEn042UWTQD1zvy6GM",
  baccarat: "M6r9FEn042UWTQD1zvy6GM",
  roulette: "M6r9FEn042UWTQD1zvy6GM",
  // 2026-08-13: "🌎 Cover Images - Skai Originals" (9220:26175). NOT a screen
  // page -- it holds the marketing cover art each game tile uses, in Desktop
  // (195x277) and Mobile (76x108) pairs. Catalogued because those frames are
  // the source of truth for the tile art the Play hub ships, and nothing else
  // in this catalog covered them.
  //
  // ★ CORRECTED 2026-08-18. This comment used to end by recording Roulette
  // (9737:13085) and Baccarat (9737:13088) as deliberately ABSENT because they
  // "have 0 children, so there is nothing to harvest". That was true on 08-13
  // and is FALSE now: both pages have since been designed AND promoted to ✅,
  // and they hold 19 frames each. The note outlived the fact it described, and
  // for five days it read as a standing decision rather than a stale
  // measurement — which is exactly how 38 real frames stay invisible forever.
  // Both are now catalogued sections; see SECTION_FILE above.
  "cover-images": "M6r9FEn042UWTQD1zvy6GM",
  // Moved to Skai-Web-App-2 on 2026-08-11 (ids preserved — see FILE_KEYS).
  home: "mhF3BkzlTaGiLzJ7kvpmVc",
  wallet: "mhF3BkzlTaGiLzJ7kvpmVc",
  trade: "mhF3BkzlTaGiLzJ7kvpmVc",
  // Skai-Web-App-2 did not just re-home these surfaces, it EXTENDED them: each
  // one gained a second page of entirely new frames in a fresh id range
  // (13008-* for Home/Wallet, 13006-* for Trade). They are separate sections
  // because a section maps to one page — and because "Home 2" is not a mobile
  // port of Home. It is Whales, Skai Pro (plans / checkout / PDF invoices) and
  // Agentic Backtesting, drawn at 1440 / 768 / 375.
  "home-2": "mhF3BkzlTaGiLzJ7kvpmVc",
  "wallet-2": "mhF3BkzlTaGiLzJ7kvpmVc",
  "trade-2": "mhF3BkzlTaGiLzJ7kvpmVc",
  predict: "3sSzw1KewMtUbeLAv7uW0r",
  play: "3sSzw1KewMtUbeLAv7uW0r",
  dice: "M6r9FEn042UWTQD1zvy6GM",
  // pwa = "Install to homescreen" screens. They follow the "Skai > Home > ..."
  // convention like the rest of Home, and they moved WITH Home on 2026-08-11 —
  // all five ids now resolve on the "✅ Home 1" page of Skai-Web-App-2.
  pwa: "mhF3BkzlTaGiLzJ7kvpmVc",
  // crash = the Crash casino game; lives in the Skai-Games file alongside dice.
  crash: "M6r9FEn042UWTQD1zvy6GM",
  // mines = the Mines casino game; Skai-Games file alongside dice + crash.
  mines: "M6r9FEn042UWTQD1zvy6GM",
  // 2026-07-27 figma.txt additions. The three new casino games + the play-art
  // gap list all live in the Skai-Games file; trench is a Skai-Web-App surface.
  blackjack: "M6r9FEn042UWTQD1zvy6GM",
  coinflip: "M6r9FEn042UWTQD1zvy6GM",
  skratch: "M6r9FEn042UWTQD1zvy6GM",
  "missing-play-images": "M6r9FEn042UWTQD1zvy6GM",
  // 2026-07-27 bug-report reconciliation. These three sections cover Skai-Web-App
  // frames that QA bug reports link to but figma.txt does NOT list, so they were
  // absent from the catalog entirely. Sourced from the reports' own figma_link
  // column (see bugref-aliases.tsv + BUGREF_AUDIT.md), not from figma.txt.
  //   onboarding   = the "Onboarding and Authentication" page (waitlist/verify/
  //                  link-wallet/reserve-name/pre-launch-dashboard flow)
  //   legal        = the "Privacy and Terms" page (long-scroll legal screens)
  //   master-sheet = the "Master sheet" page's 3035x3805 overview boards
  onboarding: "3sSzw1KewMtUbeLAv7uW0r",
  legal: "3sSzw1KewMtUbeLAv7uW0r",
  "master-sheet": "3sSzw1KewMtUbeLAv7uW0r",
  // plinko = the Plinko casino game; Skai-Games file alongside the other games.
  plinko: "M6r9FEn042UWTQD1zvy6GM",
  // 2026-07-29 ready-for-dev promotions + one new page, all Skai-Games.
  darts: "M6r9FEn042UWTQD1zvy6GM",
  chicken: "M6r9FEn042UWTQD1zvy6GM",
  hilo: "M6r9FEn042UWTQD1zvy6GM",
};
// NOTE (2026-07-27): `trench` and `trade-bugrefs` are RETIRED as sections. The
// "Trade (7/27 update)" list in figma.txt (692 links) is now the sole approved
// truth for the whole Trade page, and it decomposes exactly into the old
// trade 219 + trade-bugrefs 64 + 284 of the 285 trench frames + 125 new frames.
// Keeping them separate would have meant three overlapping sections describing
// the same page. Per-frame status/verifiedAt survived the fold because
// build-registry preserves hand-set fields by node-id. The one trench frame not
// in the 692 (9695-96406) no longer resolves in Figma at all — it was deleted
// upstream, and is recorded as `gone` in bugref-aliases.tsv rather than kept as
// a one-frame section.
const SECTIONS = [
  "home", "wallet", "trade", "predict", "play", "dice", "pwa", "crash", "mines",
  "blackjack", "coinflip", "skratch", "missing-play-images",
  "onboarding", "legal", "master-sheet",
  // 2026-07-28: `Plinko:` (20 links) appeared in figma.txt but had no section, so
  // the whole page — a ✅ ready-for-dev one — was uncataloged. Found by the
  // uncovered-page report in this script, confirmed by audit-figma-txt.mjs.
  "plinko",
  // 2026-07-29: three Games pages became ready-for-dev overnight — Chicken and
  // Hi-Lo were promoted from 🚧, Darts arrived already ✅. None is in figma.txt,
  // so these were harvested live from Figma rather than parsed from the txt.
  "darts", "chicken", "hilo",
  // 2026-08-05: the previously-uncovered 🚧 pages. Towers excludes its 51
  // "Rectangle 346246xx" grid-cell nodes (tower rungs, pure furniture); Bingo,
  // Fortune Wheel and Rock Paper Scissors are omitted because those pages are
  // genuinely EMPTY in Figma (0 top-level children), so there is nothing to catalog.
  "social", "governance", "user-flow", "towers", "keno",
  // 2026-08-11: the new second pages in Skai-Web-App-2. See SECTION_FILE.
  // TODO wallet-2 and trade-2 have no .titles.tsv yet, so their 589 frames are
  // catalogued but unclassified (screens/nonScreen both 0). Harvest titles.
  "home-2", "wallet-2", "trade-2",
  // 2026-08-11: five previously-uncovered Games pages. See SECTION_FILE.
  "fortune-wheel", "skai-cross", "video-poker", "bingo", "rock-paper-scissors",
  // 2026-08-13: the cover-art page. See SECTION_FILE for why it is catalogued.
  "cover-images",
  // 2026-08-18: four new/uncovered Games pages, plus `price-grid` — the live
  // contents of page 9660:2, which `skai-cross` used to hold. See SECTION_FILE
  // for why that is a new section rather than a rename of the old one.
  "limbo", "slide", "baccarat", "roulette", "price-grid",
];

// The list above is an ORDERING hint, not the source of truth.
//
// Adding a section used to mean editing three separate places — the nodes.txt
// file, SECTION_FILE, and this array — and forgetting the third failed SILENTLY:
// the ids sat on disk, the page reported zero rows, and nothing said why. That
// is the same stale-literal defect that hid 16 of 24 sections in catalog-view.
//
// So: trust the filesystem, and make any disagreement announce itself.
const DISCOVERED = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".nodes.txt"))
  .map((f) => f.slice(0, -".nodes.txt".length));

const unlisted = DISCOVERED.filter((s) => !SECTIONS.includes(s)).sort();
if (unlisted.length) {
  console.warn(`\n!! ${unlisted.length} section file(s) on disk are not in the SECTIONS order list — appending:`);
  for (const s of unlisted) console.warn(`   ${s}.nodes.txt`);
  SECTIONS.push(...unlisted);
}

const phantom = SECTIONS.filter((s) => !DISCOVERED.includes(s));
if (phantom.length) {
  console.warn(`\n!! ${phantom.length} section(s) are listed but have NO <section>.nodes.txt — they contribute nothing:`);
  for (const s of phantom) console.warn(`   ${s}`);
}
// The main file uses the "Skai > <Section> ..." convention. The Skai-Games file
// does NOT — its game frames are plain component/screen names, so we detect a
// "screen" for those sections by other means (see parseTitle `opts.skaiConvention`).
// Skai-Games sections do NOT follow the "Skai > …" title convention: most of their
// frames are plain design-state names ("Desktop Split", "Side Bet Tab", "Target Tab
// Auto", "Card out"). A section left OUT of this set is parsed with the Skai-only
// grammar, which silently demotes every one of those real frames to "non-screen" —
// that is exactly what happened to blackjack/coinflip/skratch on their first build.
const NON_SKAI_SECTIONS = new Set([
  "dice", "crash", "mines", "blackjack", "coinflip", "skratch", "missing-play-images",
  "plinko",
  // 2026-08-05: Towers and Keno are Skai-Games pages whose frames are plain design
  // names ("Desktop Full Game", "Mobile", "Desktop Selection"). Keno's frames are
  // additionally MIS-TITLED — they read "Scratchers" and "Blackjack" — the
  // wrong-game-title issue already recorded for the newer game pages.
  "towers", "keno",
  // 2026-08-11: the same story again, now confirmed as a page TEMPLATE rather
  // than a one-off slip. Every newer Games page is created by duplicating an
  // existing one, so it opens with "Skai > Play > Casino > Scratchers" and
  // "… > Blackjack" frames that were never renamed. Fortune Wheel, Video Poker,
  // Bingo and Rock Paper Scissors all carry that pair verbatim; SKAI Cross is
  // the only one of the five with genuinely authored frames.
  "fortune-wheel", "skai-cross", "video-poker", "bingo", "rock-paper-scissors",
  // 2026-08-18: the same page-template story, now measured rather than assumed.
  // Every one of these five opens with the duplicated "Skai > Play > Casino >
  // Blackjack" desktop+mobile pair (Slide's desktop copy still says "Towers",
  // Roulette's still says "Scratchers"), and everything the designer actually
  // authored uses plain design-state names — "Desktop Full Game", "Starting",
  // "Extended LB", "Auto Advanced", "Mobile Auto Advanced", "Frame 270".
  // Parsing these with the Skai grammar would demote every authored frame to
  // non-screen AND file it under Blackjack.
  "limbo", "slide", "baccarat", "roulette", "price-grid",
  // 2026-07-29. These three matter DOUBLY: not only do their frames use plain
  // design-state names ("Easy Desktop Full Game", "Card out", "Mobile Medium"),
  // their `Skai > …` titles are COPY-PASTE ARTIFACTS naming the WRONG GAME —
  // the Darts page contains "Skai > Play > Casino > Hi-Lo Start" and
  // "… > Blackjack", Chicken the same, Hi-Lo a "… > Scratchers". The pages were
  // duplicated and never renamed. Parsing them with the Skai grammar would both
  // demote every real frame to non-screen AND file them under the wrong game.
  "darts", "chicken", "hilo",
]);
// For a Skai-Games (non-Skai-convention) section, the product/game family name.
// A section's frames fold into one canonical "Casino > <game>" family.
const GAME_BY_SECTION = {
  dice: "Dice", crash: "Crash", mines: "Mines", blackjack: "Blackjack",
  coinflip: "Coinflip", skratch: "Scratchers", "missing-play-images": "Play art",
  plinko: "Plinko",
  darts: "Darts", chicken: "Chicken", hilo: "Hi-Lo",
  // 2026-08-05 / 08-11 game pages. Without an entry each fell through to the
  // `opts.game || "Dice"` fallback in parseTitle, so their catalog family read
  // "Casino > Dice" instead of their own game — SKAI Cross, Towers, Keno,
  // Fortune Wheel, Video Poker, Bingo and Rock Paper Scissors were all mislinked
  // to Dice. Naming each here folds its frames into "Casino > <game>". (Some of
  // these pages were duplicated from Dice/Scratchers/Blackjack and their frame
  // TITLES still name the wrong game — an upstream Figma rename gap — but the
  // family link is now correct.)
  towers: "Towers", keno: "Keno",
  "fortune-wheel": "Fortune Wheel", "skai-cross": "SKAI Cross",
  "video-poker": "Video Poker", bingo: "Bingo",
  "rock-paper-scissors": "Rock Paper Scissors",
  "cover-images": "Cover Images",
  // 2026-08-18. `price-grid` is its own family, NOT an alias of SKAI Cross —
  // the two ship as separate games (see SECTION_FILE). Without an entry each of
  // these would fall through to the `opts.game || "Dice"` default and file its
  // frames under "Casino > Dice".
  limbo: "Limbo", slide: "Slide", baccarat: "Baccarat", roulette: "Roulette",
  "price-grid": "Price Grid",
};

const readLines = (p) =>
  fs.existsSync(p) ? fs.readFileSync(p, "utf8").split("\n").map((l) => l.trim()).filter(Boolean) : [];

/**
 * component-aliases.tsv — classify frames the "Skai > ..." title grammar cannot.
 *
 * A frame named for WHAT IT IS ("X accounts - My list - tablet", "Technicals -
 * Buy") instead of where it lives parses as kind:non-screen / family:null, which
 * drops it out of families.mjs, catalog-view.mjs and every audit — present in the
 * registry, absent from the category system. This map assigns those frames a
 * real family (kind:"component") or marks them as canvas furniture
 * (kind:"scaffold") so they are accounted for either way.
 */
const COMPONENT_ALIASES = (() => {
  const out = {};
  for (const line of readLines(path.join(DIR, "component-aliases.tsv"))) {
    if (line.startsWith("#")) continue;
    const [node, section, kind, family, device, note] = line.split("\t").map((s) => (s || "").trim());
    if (!node || !kind) continue;
    out[node] = {
      section,
      kind,
      family: family && family !== "-" ? family : null,
      device: device && device !== "-" ? device : null,
      note: note || "",
    };
  }
  return out;
})();

// title -> {screen, variant, viewport, device, kind, vh, family}
// Grammar: a real top-level SCREEN is titled "Skai > <Section> ...". Everything
// else (Notes, Breakpoint, Directory, Rectangle N, profile image, icons/*, Code,
// dropdown-N, "sidebar - open ...", "Input w/o voice", component/state fragments)
// is canvas scaffolding or a sub-component pulled into the section's node list.
// Rule: kind:"screen" iff the title begins with "Skai >". This matches the
// observed naming convention exactly and is more reliable than a keyword blocklist.
function parseTitle(title, opts = {}) {
  const skaiConvention = opts.skaiConvention !== false;
  if (!title || title === "ERROR") return { kind: title === "ERROR" ? "error" : "untitled" };

  const vp = title.match(/\((\d+)\s*x\s*(\d+)\s*px\)/i);
  let viewport = null,
    device = null;
  if (vp) {
    const w = +vp[1];
    viewport = `${w}x${vp[2]}`;
    device = w >= 1200 ? "desktop" : w >= 700 ? "tablet" : "mobile";
  }

  // Secondary-file convention (Skai-Games "Dice"): titles are a MIX of the
  // "Skai > Play > Casino > Dice [device]" device frames and plain design-state
  // names ("Desktop Full Game - Roll Over", "Auto Advanced Extended"), plus real
  // Figma scaffolding ("Breakpoint", "Directory", "icons/action", "Frame N").
  // Fold every real frame into one canonical family so the dice product reads as
  // a single screen with device viewports + states, not many one-off families.
  if (!skaiConvention) {
    // Skai-Games (non-Skai-convention) sections fold every real frame into one
    // canonical "Casino > <game>" family. The game name is passed by the caller
    // (opts.game), defaulting to "Dice" for backward compatibility.
    const game = opts.game || "Dice";
    const canonical = `Casino > ${game}`;
    const raw = title.replace(/\s*\([^)]*\)\s*$/, "").trim();
    const GENERIC = /^(Breakpoint|Director(?:y|ies)|icons?\/|Frame\s+\d+|Rectangle\b|Group\b|Component\b|Ellipse\b|Vector\b|Notes?$)/i;
    if (GENERIC.test(raw) || !raw) {
      return { screen: raw || null, variant: null, viewport, device, vh: null, kind: "non-screen", family: null };
    }
    // real screen / design-state — derive device from viewport, else a leading
    // Desktop/Tablet/Mobile word in the name.
    let dev = device;
    if (!dev) {
      if (/\bdesktop\b/i.test(raw)) dev = "desktop";
      else if (/\btablet\b/i.test(raw)) dev = "tablet";
      else if (/\bmobile\b/i.test(raw)) dev = "mobile";
    }
    let variant;
    if (/^Skai\s*>/i.test(raw)) {
      // "Skai > Play > Casino > <game>[ Tablet Alt]" → device-qualifier remainder
      const stripRe = new RegExp(`^Skai\\s*>\\s*Play\\s*>\\s*Casino\\s*>\\s*${game}\\b`, "i");
      variant = raw.replace(stripRe, "").replace(/^\s*[->–]\s*/, "").trim() || null;
    } else {
      // plain design-state name is itself the variant
      variant = raw || null;
    }
    const vhm = raw.match(/\b(\d+)VH\b/i);
    return {
      screen: canonical + (variant ? ` - ${variant}` : ""),
      variant,
      viewport,
      device: dev,
      vh: vhm ? +vhm[1] : null,
      kind: "screen",
      family: canonical,
    };
  }

  const isSkai = /^Skai\s*>/i.test(title);
  if (!isSkai) {
    // scaffolding / component fragment — keep the raw title as screen for reference
    return { screen: title.replace(/\s*\([^)]*\)\s*$/, "").trim() || null, variant: null, viewport, device, vh: null, kind: "non-screen", family: null };
  }

  // Strip leading "Skai > " and trailing "(W x Hpx)"; capture NVH marker
  let body = title.replace(/^Skai\s*>\s*/i, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
  const vhm = body.match(/\b(\d+)VH\b/i);
  const vh = vhm ? +vhm[1] : null;
  body = body.replace(/\s*\b\d+VH\b\s*/gi, " ").replace(/\s{2,}/g, " ").trim();

  // Titles mix " > " (hierarchy path) and " - " (state qualifier), e.g.
  //   "Home - welcome > onboarding Qs - load effect"  (dash after section word)
  //   "Home > Whales > KOLs"                           (arrow after section word)
  //   "Pro > checkout - send tokens - step 2"          (title section ≠ figma section)
  // Strip an optional leading known-section word + its separator, then the
  // family is the first " - "-delimited segment (which keeps its " > " path),
  // and the variant is the remainder.
  const afterSection = body.replace(/^(Home|Wallet|Trade|Predict|Play)\s*(?:[->]\s*)?/i, "").trim();
  const segs = afterSection.split(/\s+-\s+/);
  const family = (segs[0] || "").trim() || "(section root)";
  const variant = segs.length > 1 ? segs.slice(1).join(" - ").trim() : null;
  // screen = human-facing full path (family + variant), used for display
  const screen = family + (variant ? ` - ${variant}` : "");

  return { screen, variant, viewport, device, vh, kind: "screen", family };
}

// Load code citations (nodeToFiles)
let nodeToFiles = {};
const citPath = path.join(DIR, "code-node-citations.json");
if (fs.existsSync(citPath)) {
  try {
    nodeToFiles = JSON.parse(fs.readFileSync(citPath, "utf8")).nodeToFiles || {};
  } catch {}
}

// Preserve hand-set fields from prior registry
let prior = {};
const regPath = path.join(DIR, "registry.json");
if (fs.existsSync(regPath)) {
  try {
    prior = JSON.parse(fs.readFileSync(regPath, "utf8")).frames || {};
  } catch {}
}

// pages.json — the LIVE page inventory harvested from Figma (see its _comment).
// Section node lists come from ~/Desktop/figma.txt, so a page never pasted into
// that file is invisible to this catalog; pages.json is what lets us notice.
// It drives two things: the per-frame `page`/`readiness` stamp, and the
// uncovered-page report at the end of this script.
let PAGES = { pages: [], unmappedSections: {} };
try {
  PAGES = JSON.parse(fs.readFileSync(path.join(DIR, "pages.json"), "utf8"));
} catch {
  console.warn("pages.json missing — frames get readiness 'unknown' and no page report");
}
// section -> its page. A section maps to exactly one page; a page may hold
// several sections (Home holds both `home` and `pwa`).
const PAGE_BY_SECTION = {};
for (const pg of PAGES.pages || []) {
  for (const s of pg.sections || []) PAGE_BY_SECTION[s] = pg;
}

// Node-ids deleted upstream in Figma after they were cataloged — the `gone` rows in
// bugref-aliases.tsv, the same source audit-figma-txt.mjs reads. They keep their
// hand-set status (they WERE built) but must be excluded from page-coverage math:
// a row whose node no longer exists cannot be compared against a live page, and
// leaving them in is what makes a delta go NEGATIVE and read as an anomaly.
const GONE = new Set();
{
  const p = path.join(DIR, "bugref-aliases.tsv");
  if (fs.existsSync(p)) {
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      if (!line || line.startsWith("#")) continue;
      const [ref, , reason] = line.split("\t");
      if (reason === "gone") GONE.add(ref.includes(":") ? ref.split(":").pop() : ref.trim());
    }
  }
}

const frames = {};

/**
 * Registry keys are "<fileKey>:<node>" (a bare node-id for the primary file), so
 * two SECTIONS that share a fileKey and list the same node-id COLLIDE: the later
 * section overwrites the earlier and the frames map ends up holding one row, not
 * two. That de-duplication is correct — but the stats used to be incremented
 * per-id while the node lists were read, which counted the overwritten losers as
 * well as the survivors.
 *
 * Measured 2026-08-20: `stats.total` read **4373** against **3628** actual rows
 * in `frames`. The 745-row overcount decomposes exactly, with no remainder:
 *   home    -> home-2   127     wallet -> wallet-2 182
 *   trade   -> trade-2  407     missing-play-images -> cover-images 24
 *   home    -> pwa        5
 * `missing-play-images` was the worst case: all 24 of its ids collided, so it
 * reported 24 frames while owning ZERO rows — and `status.missing-play-images.tsv`
 * and `vverify.missing-play-images.tsv` were therefore folding onto nothing.
 *
 * Two changes: stats are DERIVED from the frames map after the loop (so they can
 * only ever describe rows that exist), and every collision is recorded in
 * `stats.keyCollisions` so an overwrite announces itself instead of being
 * silently absorbed into a bigger number.
 */
const collisions = [];

/**
 * Which fileKey(s) claim each bare node-id — needed to attribute code citations.
 *
 * `code-node-citations.json` is keyed by BARE node-id, and a bare id is unique
 * only WITHIN a Figma file. The old rule was "attribute citations only for the
 * primary file"; safe, but it silently became wrong the moment home / wallet /
 * trade moved to Skai-Web-App-2. Those three sections then reported `cited: 0` —
 * which reads as "no code references these frames" when the truth was "the
 * attribution rule refused to look". Verified live 2026-08-20: all eight sampled
 * home ids that src/ cites (2713-4179, 5777-28765, …) resolve in
 * Skai-Web-App-2 with exactly the catalogued titles, and resolve NOWHERE in the
 * primary file — so there was never a primary-file node to confuse them with.
 *
 * The rule that is both safe and correct is UNIQUE OWNERSHIP: attribute a bare id
 * when exactly one catalogued fileKey claims it. Measured 2026-08-20: of 3,761
 * distinct catalogued ids only SIX are claimed by two files — 2713-3937,
 * 2713-3943, 2736-25840, 2738-28626, 6330-54594, 6330-54596, every one of them
 * Skai-Web-App-2 vs Skai-Games, and 6330-54594 is the exact collision the old
 * comment named. None of the 577 ids in the citation index is one of the six, so
 * this attributes 192 ids (was 61) and refuses none. Any future refusal is
 * recorded in `stats.citationRefusals` rather than being dropped in silence.
 */
const fileKeysById = {};
for (const s of SECTIONS) {
  const fk = SECTION_FILE[s] || FILE_KEY;
  for (const id of readLines(path.join(DIR, `${s}.nodes.txt`))) {
    (fileKeysById[id] = fileKeysById[id] || new Set()).add(fk);
  }
}
const citationRefusals = [];

let stats = { total: 0, titled: 0, cited: 0, bySection: {} };

for (const section of SECTIONS) {
  const ids = readLines(path.join(DIR, `${section}.nodes.txt`));
  const fileKey = SECTION_FILE[section] || FILE_KEY;
  const fileName = FILE_KEYS[fileKey] || "Skai-Web-App";
  const isPrimary = fileKey === FILE_KEY;
  // load titles tsv if present
  const titles = {};
  for (const line of readLines(path.join(DIR, `${section}.titles.tsv`))) {
    const tab = line.indexOf("\t");
    if (tab > 0) titles[line.slice(0, tab).trim()] = line.slice(tab + 1).trim();
  }
  for (const id of ids) {
    const title = titles[id] || null;
    const parsed = parseTitle(title, {
      skaiConvention: !NON_SKAI_SECTIONS.has(section),
      game: GAME_BY_SECTION[section],
    });
    // Attribute code citations by UNIQUE OWNERSHIP of the bare node-id — see the
    // `fileKeysById` note above for why "primary file only" was the wrong rule.
    // A contested id is refused AND recorded, never dropped silently.
    const citeFiles = nodeToFiles[id] || [];
    const owners = fileKeysById[id];
    let cited = [];
    if (citeFiles.length) {
      if (owners && owners.size === 1) cited = citeFiles;
      else citationRefusals.push({ id, section, owners: owners ? [...owners] : [], files: citeFiles });
    }
    // Frames in a secondary file get a compound registry key so they can't
    // clobber a primary-file frame with the same bare node-id.
    const regKey = isPrimary ? id : `${fileKey}:${id}`;
    // A later section is about to overwrite an earlier section's row under the
    // same key. Record it — see the `collisions` note above.
    if (frames[regKey]) {
      collisions.push({ regKey, lostSection: frames[regKey].section, keptSection: section });
    }
    const p = prior[regKey] || {};
    // Ready-for-dev. The team's signal is the leading emoji on the Figma PAGE
    // name (✅ ready / 🚧 wip) — Casey 2026-07-28. Figma's own Dev Mode
    // `devStatus` is unreadable from here (the MCP plugin sandbox rejects the
    // getter; get_metadata omits it), so this is the available source of truth.
    // A section with no page entry stays "unknown" and is REPORTED below — it
    // must never silently default to wip, or an unmapped section reads as a
    // deliberate work-in-progress verdict.
    const pg = PAGE_BY_SECTION[section];
    frames[regKey] = {
      section,
      fileKey,
      fileName,
      node: id, // bare node-id for link building
      title,
      page: pg ? pg.pageName : null,
      readiness: pg ? pg.readiness : "unknown",
      gone: GONE.has(id) || undefined, // deleted upstream; kept for the record
      ...parsed,
      // Hand-classified overrides for frames the title grammar cannot place.
      // Applied AFTER ...parsed so they win, and only for the section the alias
      // was declared against (node-ids are unique per file, not globally).
      ...(COMPONENT_ALIASES[id] && COMPONENT_ALIASES[id].section === section
        ? {
            kind: COMPONENT_ALIASES[id].kind,
            family: COMPONENT_ALIASES[id].family,
            device: COMPONENT_ALIASES[id].device ?? parsed.device ?? null,
            aliasNote: COMPONENT_ALIASES[id].note || undefined,
          }
        : {}),
      citedByFiles: cited,
      implFiles: p.implFiles || [],
      status: p.status || "unknown",
      route: p.route || null,
      notes: p.notes || "",
      verifiedAt: p.verifiedAt || null,
    };
  }
}

// Stats, derived from the rows that actually SURVIVED into `frames`.
//
// Every section is pre-seeded at zero so a section whose rows were all
// overwritten still appears — reporting `frames: 0` is the useful signal, and it
// is what makes the missing-play-images case visible instead of absent.
stats = { total: 0, titled: 0, cited: 0, bySection: {} };
for (const section of SECTIONS) {
  stats.bySection[section] = { frames: 0, titled: 0, screens: 0, nonScreen: 0, cited: 0 };
}
for (const f of Object.values(frames)) {
  const b =
    stats.bySection[f.section] ||
    (stats.bySection[f.section] = { frames: 0, titled: 0, screens: 0, nonScreen: 0, cited: 0 });
  stats.total++;
  b.frames++;
  if (f.title && f.title !== "ERROR") {
    stats.titled++;
    b.titled++;
    if (f.kind === "non-screen") b.nonScreen++;
    else b.screens++;
  }
  if (f.citedByFiles.length) {
    stats.cited++;
    b.cited++;
  }
}

// Which section lost rows to which, and how many. `total` here is the exact
// difference between "ids listed across all <section>.nodes.txt" and
// `stats.total`, so the two numbers reconcile without a remainder.
{
  const byPair = {};
  for (const c of collisions) {
    const k = `${c.lostSection} -> ${c.keptSection}`;
    byPair[k] = (byPair[k] || 0) + 1;
  }
  const listedIds = SECTIONS.reduce(
    (n, s) => n + readLines(path.join(DIR, `${s}.nodes.txt`)).length,
    0,
  );
  stats.keyCollisions = {
    total: collisions.length,
    idsListed: listedIds,
    rowsKept: stats.total,
    reconciles: listedIds - collisions.length === stats.total,
    bySectionPair: byPair,
  };
}

// Citations the unique-ownership rule declined to attribute. Empty is the normal
// state; a non-empty list means a bare id is claimed by two catalogued files and
// somebody must say which one the code comment meant. `cited: 0` on a section is
// only meaningful once this is empty — otherwise it may just be a refusal.
stats.citationRefusals = citationRefusals;

// Readiness rollup, and the coverage report that makes a missing page announce
// itself instead of being silently absent.
stats.byReadiness = {};
for (const f of Object.values(frames)) {
  stats.byReadiness[f.readiness] = (stats.byReadiness[f.readiness] || 0) + 1;
}

const rowsByPage = {};
const goneByPage = {};
for (const f of Object.values(frames)) {
  const k = `${f.fileKey}|${f.page || "(unmapped)"}`;
  if (f.gone) { goneByPage[k] = (goneByPage[k] || 0) + 1; continue; }
  rowsByPage[k] = (rowsByPage[k] || 0) + 1;
}
const uncovered = [];
const outOfScope = [];
const pageReport = [];
for (const pg of PAGES.pages || []) {
  const rows = rowsByPage[`${pg.fileKey}|${pg.pageName}`] || 0;
  if (!pg.sections.length) {
    // A page no section covers. Meta pages (Thumbnail / master sheet / cover
    // art) are expected to be empty; a ready/wip page with 0 rows is a real gap.
    //
    // ...unless someone has written down WHY it is not catalogued. Without this
    // the report cries wolf forever on pages that were deliberately excluded —
    // and a warning nobody can silence is a warning everybody learns to skip.
    // outOfScope is keyed by pageName and the reason is carried into the
    // registry so the decision travels with the data.
    const reason = (PAGES.outOfScope || {})[pg.pageName];
    if (reason) {
      outOfScope.push({ page: pg.pageName, live: pg.liveChildren, reason });
      continue;
    }
    if (pg.readiness !== "meta") uncovered.push({ page: pg.pageName, live: pg.liveChildren });
    continue;
  }
  pageReport.push({
    page: pg.pageName,
    readiness: pg.readiness,
    rows,
    gone: goneByPage[`${pg.fileKey}|${pg.pageName}`] || 0,
    // Top-level children INCLUDING furniture, so `live` is an upper bound on
    // catalogable designs, not a target. rows > live means some rows point at
    // nodes that are not top-level children of this page.
    live: pg.liveChildren,
    delta: pg.liveChildren == null ? null : pg.liveChildren - rows,
  });
}
stats.pageCoverage = pageReport;
stats.uncoveredPages = uncovered;
stats.outOfScopePages = outOfScope;

// Under-coverage detection.
//
// Having a section is not the same as being covered BY it. Only "this page has
// no section at all" was ever warned about, so a page that WAS mapped could sit
// half-catalogued indefinitely and still look healthy: Towers carried 12 rows
// against 63 live frames, and the delta was written to stats.pageCoverage where
// nobody read it.
//
// `live` counts top-level children including furniture, so a small positive
// delta is normal and warning on every one would be noise. Flag only when the
// gap is big in BOTH absolute and relative terms, and let a page acknowledge a
// known gap with `expectedDelta` in pages.json rather than going quiet forever.
const DRIFT_MIN_ABS = 10; // ignore small gaps — furniture accounts for those
const DRIFT_MIN_PCT = 0.25; // ...unless a quarter of the page is uncatalogued
const drift = [];
for (const pg of PAGES.pages || []) {
  if (!pg.sections.length || pg.liveChildren == null || pg.readiness === "meta") continue;
  const rows = rowsByPage[`${pg.fileKey}|${pg.pageName}`] || 0;
  const unexplained = pg.liveChildren - rows - (pg.expectedDelta || 0);
  if (unexplained >= DRIFT_MIN_ABS && unexplained >= pg.liveChildren * DRIFT_MIN_PCT) {
    drift.push({
      page: pg.pageName,
      readiness: pg.readiness,
      rows,
      live: pg.liveChildren,
      expectedDelta: pg.expectedDelta || 0,
      unexplained,
      sections: pg.sections,
    });
  }
}
drift.sort((a, b) => b.unexplained - a.unexplained);
stats.driftingPages = drift;

const out = { generated: new Date().toISOString(), fileKey: FILE_KEY, fileKeys: FILE_KEYS, sectionFile: SECTION_FILE, pagesHarvested: PAGES.harvested || null, stats, frames };
fs.writeFileSync(regPath, JSON.stringify(out, null, 2));
console.log("registry.json written:", regPath);
console.log(JSON.stringify(stats, null, 2));

if (uncovered.length) {
  console.warn(`\n!! ${uncovered.length} Figma page(s) have NO section — every frame on them is missing from the catalog:`);
  for (const u of uncovered) console.warn(`   ${u.page}  (~${u.live ?? "?"} top-level nodes)`);
  console.warn("   Add a section (nodes.txt + titles.tsv + SECTION_FILE entry) or record why it is out of scope.");
}
const unmapped = Object.keys(PAGES.unmappedSections || {});
if (unmapped.length) {
  console.warn(`\n!! ${unmapped.length} section(s) map to no page, so their frames have readiness 'unknown':`);
  for (const s of unmapped) console.warn(`   ${s} — ${PAGES.unmappedSections[s]}`);
}

if (drift.length) {
  console.warn(`\n!! ${drift.length} page(s) are mapped but UNDER-COVERED — the section exists, the frames are not in it:`);
  for (const d of drift) {
    const exp = d.expectedDelta ? ` (allowing ${d.expectedDelta})` : "";
    console.warn(
      `   ${d.page}  ${d.rows}/${d.live} rows${exp} — ${d.unexplained} uncatalogued  [${d.sections.join(", ")}]`,
    );
  }
  console.warn("   Harvest the missing ids into <section>.nodes.txt, or set expectedDelta in pages.json with a reason.");
}
