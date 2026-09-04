# Orphan triage — lane trench-discover-b

Wave 21 drift, `figma-todo.wave21.merged.tsv`, `REMOVED-WITH-WORK` rows whose
`implFiles` name one of:

    src/components/trench-redesign/discover/AdjustTrenchSettings.tsx
    src/components/trench-redesign/discover/HotkeysMenu.tsx
    src/components/trench-redesign/discover/TrenchColumn.tsx
    src/components/trench-redesign/discover/hotkeyPrefs.ts
    src/components/trench-redesign/discover/trenchDisplayPrefs.ts
    src/components/trench-redesign/discover/networkIcons.tsx

**Assigned 28. Triaged 28. Verdict: 28 MOVED (false positive). 0 ORPHANED. 0 code touched.**

The implementing code for all six files is additionally confirmed LIVE on `/trench`.

---

## Headline: all 83 trade-2 rows are one instrument artifact, not 83 deletions

The brief asked whether a file carrying eight removed frames was really eight
independent deletions, and suggested looking for a board re-cut wholesale. It is
not a re-cut. It is a **unit mismatch in the drift diff**, and it accounts for
every trade-2 row in the wave, not just my 28.

**The harvest only ever records a page's direct children.**
`snapshot.wave21.trade2.json` carries `liveChildCount: 417` and exactly 417
entries. `live/mhF3BkzlTaGiLzJ7kvpmVc__13006-134300.tsv` is 407 lines with `1`
in its depth column. Nothing below depth 1 is ever in a snapshot.

**But the trade-2 catalog rows were reverse-derived from code, at any depth.**
Every one of my 28 rows carries this note in `figma-drift.wave21.merged.json`:

> `[wave-4 2026-08-13] Row present because the code cites this node.`
> `citedByFiles/implFiles are derived by grepping the tree for the node id, not transcribed.`

So the row exists because a source file names the node id in a comment. 26 of my
28 have `title: null` — there was never a harvested title to record, because the
harvest never saw the node.

Diffing a depth-1 id list against a catalog seeded from depth-N code citations
reports every nested citation as "removed from Figma", permanently.

**Measured, across all 32 `snapshot.*.json` files in the catalog (4,363 distinct ids):**

| | rows | never present in ANY snapshot |
|---|---|---|
| trade-2 | 83 | **83 (100%)** |
| cover-images, dice, hilo, home-2, plinko, towers | 14 | 0 |

All 83 trade-2 rows were never live in any harvest ever taken, so they cannot
have been removed in wave 21. All 14 non-trade-2 rows *were* present in an
earlier snapshot and are genuine removal candidates — someone else's lane.

These 83 will re-report as REMOVED-WITH-WORK in every future wave until the
drift script compares like with like.

---

## Per-row verdict: MOVED, with the parent that supersedes each

"Superseded by" here means: the node is not a page-level frame and never was;
it lives inside the listed top-level frame, which is **still present** in the
wave-21 live snapshot.

Verified directly against Figma (`get_metadata` on file `mhF3BkzlTaGiLzJ7kvpmVc`,
one call per parent). **All 28 nodes still exist.** Name shown is the live Figma
layer name.

### Parent `13006-134301` "Skai > Trench 1VH (1440 x 900px)" — live

| node | live name | implFiles |
|---|---|---|
| 13006-134371 | Frame 373 | networkIcons.tsx |
| 13006-134372 | circle | figma-icons.tsx, networkIcons.tsx |
| 13006-134400 | Frame 445 | MarketPulseBoard.tsx, TrenchColumn.tsx |
| 13006-134402 | Frame 299 | TrenchColumn.tsx |
| 13006-134411 | Frame 541 | TrenchColumn.tsx |
| 13006-134417 | Frame 305 | TrenchColumn.tsx |

### Parent `13006-155671` "Skai > Trench > Display settings 1VH" — live

| node | live name | implFiles |
|---|---|---|
| 13006-158489 | Right menu | AdjustTrenchSettings.tsx, rightMenuChrome.tsx |
| 13006-158510 | Frame 38 | AdjustTrenchSettings.tsx |
| 13006-158556 | Frame 560 | AdjustTrenchSettings.tsx |
| 13006-158563 | icons/action | AdjustTrenchSettings.tsx |
| 13006-158615 | Frame 1178 | AdjustTrenchSettings.tsx, rightMenuChrome.tsx |

### Parent `13006-162230` "Skai > Trench > Hotkeys 1VH" — live

| node | live name | implFiles |
|---|---|---|
| 13006-165084 | CTA/button | HotkeysMenu.tsx |
| 13006-165129 | Frame 560 | HotkeysMenu.tsx |
| 13006-165136 | Frame 561 | hotkeyPrefs.ts |
| 13006-165139 | CTA/button | HotkeysMenu.tsx |
| 13006-165149 | Frame 1178 | HotkeysMenu.tsx, rightMenuChrome.tsx |

### Parent `13006-185849` "Skai > Trench > Alerts - toggle off 1VH" — live

| node | live name | implFiles |
|---|---|---|
| 13006-188668 | modal | AlertsModal.tsx, DiscoverScreen.tsx, TrenchColumn.tsx, pulsePrefs.ts, switchTheme.ts |

### Parent `13006-188690` "Skai > Trench > Alerts - toggle on 1VH" — live

| node | live name | implFiles |
|---|---|---|
| 13006-191509 | modal | AlertsModal.tsx, TrenchColumn.tsx, pulsePrefs.ts |
| 13006-191558 | Frame 561 | AlertsModal.tsx, TrenchColumn.tsx, pulsePrefs.ts |

### Parent `13006-194925` "Right menu - Metrics" — live

| node | live name | implFiles |
|---|---|---|
| 13006-194971 | Frame 342 (Customize table) | AdjustTrenchSettings.tsx, TokenCard.tsx, metricBands.ts, trenchDisplayPrefs.ts |
| 13006-194996 | active | AdjustTrenchSettings.tsx |
| 13006-194999 | input/selection | trenchDisplayPrefs.ts |
| 13006-195005 | input/selection | trenchDisplayPrefs.ts |
| 13006-195011 | input/selection | trenchDisplayPrefs.ts |

This parent's subtree is the "Adjust trench settings" panel verbatim — Display
settings / Metrics / One-click CTA / Customize table, and the Market cap, Volume,
Holders and Tweet age bands that `metricBands.ts` and `trenchDisplayPrefs.ts`
encode. The catalog rows are pointing at real, current design.

### Parent `13006-195080` "Right menu - Row" — live

| node | live name | implFiles |
|---|---|---|
| 13006-195126 | Frame 342 (Customize table) | AdjustTrenchSettings.tsx, trenchDisplayPrefs.ts |

### Parent `13006-195199` "Right menu - Row" — live

| node | live name | implFiles |
|---|---|---|
| 13006-195245 | Frame 342 (Customize table) | AdjustTrenchSettings.tsx, trenchDisplayPrefs.ts |
| 13006-195269 | Frame 360 (Show/hide columns) | AdjustTrenchSettings.tsx, MarketPulseBoard.tsx |
| 13006-195278 | Frame 338 (One click trade behaviour) | AdjustTrenchSettings.tsx, DiscoverScreen.tsx |

---

## The code is LIVE — both halves of the orphan test

Nothing here is orphaned. Recorded because the wave's purpose is to make sure no
implementing code is stranded.

**1. Imports.** Searched the symbol under every alias form (`@/`, `@gaming/`,
relative), not just the filename:

    src/pages/Launchpad.tsx:133                    <- networkIcons
    src/components/launchpad/LaunchMarketCard.tsx:92  <- networkForChain
    src/components/trench-redesign/trade/TradeHeader.tsx:22
    src/components/trench-redesign/trade/AlphaTrackerModal.tsx:25
    src/components/trench-redesign/discover/DiscoverScreen.tsx:15  <- AdjustTrenchSettings
    src/components/trench-redesign/discover/DiscoverScreen.tsx:16  <- trenchDisplayPrefs
    src/components/trench-redesign/discover/DiscoverScreen.tsx:18  <- HotkeysMenu
    src/components/trench-redesign/discover/DiscoverScreen.tsx:27  <- NetworkBadgeRow
    src/components/trench-redesign/discover/MarketPulseBoard.tsx:26 <- TrenchColumn
    src/components/trench-redesign/discover/HotkeysMenu.tsx:18     <- hotkeyPrefs
    src/components/trench-redesign/discover/TokenCard.tsx:35,37
    src/components/trench-redesign/discover/TokenRow.tsx:15
    src/components/trench-redesign/discover/TokenTable.tsx:7

**2. Reachability to a mounted route** — not import-from-another-orphan:

    src/App.tsx:1891
      <Route path="/trench" element={ isFeatureEnabled("REDESIGN_TRENCH") ? <TrenchRedesign /> : <Trench /> } />
    src/App.tsx:406   const TrenchRedesign = lazyWithRetry(() => import("./pages/trade/TrenchRedesign"), ...)
      -> src/pages/trade/TrenchRedesign.tsx  Layout > TrenchShell > <DiscoverScreen />
        -> DiscoverScreen.tsx:326  <NetworkBadgeRow />           networkIcons.tsx
        -> DiscoverScreen.tsx:495  <MarketPulseBoard ... />      -> MarketPulseBoard.tsx:114,144 <TrenchColumn />
        -> DiscoverScreen.tsx:663  <HotkeysMenu ... />           -> HotkeysMenu.tsx:152,176 loadHotkeyPrefs / saveHotkeyPrefs
        -> DiscoverScreen.tsx:665  <AdjustTrenchSettings ... />
        -> DiscoverScreen.tsx:131,167  loadTrenchDisplayPrefs()  trenchDisplayPrefs.ts

The gate is open by default — `src/config/features.ts:74`
`REDESIGN_TRENCH: import.meta.env.VITE_REDESIGN_TRENCH !== "false"`, documented
"Default: ON". So `/trench` renders `DiscoverScreen`, and every one of the six
files is on that render path. `networkIcons.tsx` is additionally reached from
`/launchpad` and the trade surface.

---

## Instrument note

One measurement error worth recording, because it failed reassuring. My first
pass grepped the saved `get_metadata` output for `13006:165084"` and got
`NOT FOUND` for all five Hotkeys ids — which reads exactly like "confirmed
deleted". The file is JSON, so the bytes are `id=\"13006:165084\"`: the character
after the id is a backslash, not a quote. All five were present. A grep that
cannot match is not evidence of absence — the corrected pattern found every node.

## What I did not do

No code deleted, weakened, or moved. `registry.json` and every status TSV
untouched. Whether the 83 stale rows should be retired, or the drift script
taught to harvest deeper so nested citations stop reading as removals, is
Casey's call.
