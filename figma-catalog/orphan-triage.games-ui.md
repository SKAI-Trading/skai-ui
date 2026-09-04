# Orphan triage — lane `games-ui` (wave 21 REMOVED-WITH-WORK)

Source: `figma-todo.wave21.merged.tsv`, rows where `change = REMOVED-WITH-WORK`
and `implFiles` names a games-ui file. Metadata read from
`figma-drift.wave21.merged.json` (NOT `figma-drift.json` — see "Instrument
notes" below, the unsuffixed file is three weeks stale and reports every one of
these sections `clean`).

**Assigned 13. Triaged 13. Verdict: 8 LIVE, 5 MOVED, 0 ORPHANED. No code
touched, no row edited.**

Files in scope: `TowerStackerPro.tsx`, `HiLoGame.tsx`, `DiceGame.tsx`,
`PlinkoGame.tsx`, their page shells, and `modules/skai-ui/src/figma-icons.tsx`.

---

## Instrument notes — read before trusting any number here

**1. The drift file named in the brief is the wrong one.** `figma-drift.json`
carries `generated: 2026-08-13` and reports `dice`, `hilo`, `plinko` and
`towers` as `status: clean, removed: 0`, and `trade-2` as `not-harvested`. It
cannot explain a single row in this lane. The file that matches the merged TSV
is `figma-drift.wave21.merged.json`. Anyone reconciling this wave against the
unsuffixed name will conclude the rows are phantoms.

**2. Every "gone from Figma" claim below was probed live, with a negative
control.** A probe that returns not-found for everything proves nothing, so
before trusting the misses I probed `9058:4372` — a node the snapshot says is
still live — and it returned a full subtree. The instrument can return success
against this file, so the misses are real absences and not a broken call.

That control also settled a second question by accident. `9058:4372` is titled
`Skai > Play > Casino > Scratchers` in the layer name *and* in its own rendered
breadcrumb (`9058:5137`), but its body copy (`9058:5038`) reads "Guess whether
the next card lands higher or lower… Hi-Lo is pure risk-and-reward" and its
board draws King-highest / Ace-lowest with `Profit Higher: (1.17x)` /
`Profit Lower: (4.29x)`. The existing note at the top of `hiloPageContent.ts`
— content beats title, this is the Hi-Lo tablet page — is **confirmed correct**.

**3. Geometry for a deleted node is unrecoverable from this tree.** The
`live/*.tsv` captures are from the same 2026-08-13 pass and already lack these
ids, so where a MOVED match rests on size I say which side of it I could
measure and which I could not.

---

## LIVE — 8 rows. The frame is genuinely gone; the code still renders.

All eight node ids were probed against file `M6r9FEn042UWTQD1zvy6GM` and every
one returned not-found. The removals are real. The implementing code is
reachable from a mounted route in every case, so each row is a catalog event
only: retire the row, leave the code alone.

| nodeId | title | implementing file | route that still renders it |
|---|---|---|---|
| `9100-5928` | card | `DiceGame.tsx` | `/play/dice` |
| `9175-9500` | card | `DiceGame.tsx` | `/play/dice` |
| `9058-6701` | Layout | `HiLoGame.tsx`, `HiLoPage.tsx` | `/play/hilo` |
| `9175-9939` | signals | `PlinkoGame.tsx` | `/play/plinko` |
| `9391-18698` | hf_20260802_165842_f42a9cf4… 1 | `TowerStackerPro.tsx` | `/play/towers` |
| `9079-2977` | Desktop Full Game | `TowerStackerPro.tsx` | `/play/towers` |
| `9391-19091` | Desktop Full Game | `TowerStackerPro.tsx` | `/play/towers` |
| `10120-9847` | Screenshot 2026-08-18 at 11.57.32 PM 1 | `TowerStackerPro.tsx` | `/play/towers` |

Reachability, both halves, traced once per component:

- **`DiceGame.tsx`** — exported by `components/play/games/instant/index.ts:5`;
  imported by `pages/play/DicePage.tsx:3` and rendered at `DicePage.tsx:39`.
  `DicePage` is lazy-imported at `src/App.tsx:583-589` and mounted at
  `src/App.tsx:1456` on `path="/play/dice"`.
- **`PlinkoGame.tsx`** — exported by `components/play/games/instant/index.ts:11`
  and `components/play/index.ts:45`; rendered at `PlinkoPage.tsx:46`. `PlinkoPage`
  is lazy-imported at `src/App.tsx:607-613`, mounted at `src/App.tsx:1489` on
  `path="/play/plinko"`. Also imported by `PlayOriginals.tsx:7` for the grid.
- **`HiLoGame.tsx` / `HiLoPage.tsx`** — `HiLoGame` exported by
  `games/cards/index.ts:6`; rendered by `HiLoPage.tsx` and also by `Play.tsx:258`
  and `PlayOriginals.tsx:12`. `HiLoPage` lazy-imported at `src/App.tsx:677-683`,
  mounted at `src/App.tsx:1579` on `path="/play/hilo"`.
- **`TowerStackerPro.tsx` / `TowersPage.tsx`** — exported by
  `games/crash/index.ts:6` and `components/play/index.ts:36`; rendered by
  `TowersPage.tsx` and imported by `PlayNewReleases.tsx:9` and
  `PlayOriginals.tsx:11`. `TowersPage` lazy-imported at `src/App.tsx:727-733`,
  mounted at `src/App.tsx:1619` on `path="/play/towers"`.

All four routes sit inside `<GeoRestrictedRoute feature="play">`, the same
wrapper every other casino route uses. That is a geography gate, not a dead
gate — it is not evidence of an unmounted path.

### Two of these rows were never really about the code they name

- **`9058-6701` "Layout"** is not a Hi-Lo frame. `hiloPageContent.ts:45` records
  it as the **shared** stats/fairness strip (help, refresh, heart, sound,
  expand, Skai wordmark, Provably fair) that every game detail page draws. It
  was a stray top-level copy of a shared component sitting loose on the Hi-Lo
  page canvas. Its deletion says nothing about `HiLoGame.tsx`, and the strip
  itself is implemented and rendered — `HiLoPageSections.tsx:204`, "REGION 1 —
  Stats / fairness strip".

- **`9175-9939` "signals"** and the two dice **"card"** rows are the same
  species. `card` and `signals` are internal design-system layer names, not
  screens: the live probe of `9058:4372` shows them nested as containers —
  `9061:15289 card` wrapping `9061:15290 signals`, and again at
  `9061:15381`/`9061:15382`. They appear as top-level page children only when
  someone drags a copy out onto the canvas. Deleting them is canvas tidy-up.

### No MOVED candidate exists for the dice or towers rows — checked, not assumed

- **dice.** The section swapped 2-for-2: `-9100:5928 -9175:9500`,
  `+10192:2949 +10215:1015`. Neither addition can be a renamed "card":
  `10192:2949` is an **INSTANCE** at 41x24 named `input/toggle`, and
  `10215:1015` is a **RECTANGLE** at 1193x722 (a screenshot). The surviving
  sibling `9175:9528 card` is a FRAME at 160x42 — a different node type and a
  different size class from both additions. The count guard passes while the id
  set changed, which is how this went unnoticed.
- **towers.** No node titled "Desktop Full Game" remains anywhere on the towers
  page. Two exist elsewhere in the file (`dice 9069-859`, `slide 10030-42256`),
  on other pages, so they are not re-parents of these. `9391-18698` is an
  `hf_20260802_**165842**_f42a9cf4…` image; the live page carries
  `9391-19746 hf_20260802_**175310**_1d541834…` — a different capture at a
  different timestamp, not a rename. Same for `10120-9847`
  ("…11.57.32 PM"): the live screenshots are "…1.45.27 PM" (`9391-19912`) and
  "…1.08.53 AM" (`10250-15233`).
- A title sweep for `Layout` and `signals` across all 33 harvested pages returns
  nothing. No same-title replacement anywhere.

---

## MOVED — 5 rows. The drift row is a false positive.

### 5a. Three chain badges are alive right now — `figma-icons.tsx` (3 rows)

| nodeId | catalog title | live probe result |
|---|---|---|
| `13006-134372` | Chain badge — Solana (32px) | **ALIVE** — `<ellipse name="circle" x=0 y=0 w=32 h=32>` |
| `13006-134373` | Chain badge — Base (32px) | **ALIVE** — `<ellipse name="circle" x=40 y=0 w=32 h=32>` |
| `13006-134374` | Chain badge — BNB (32px) | **ALIVE** — `<ellipse name="circle" x=80 y=0 w=32 h=32>` |

Superseded by nothing — they were never removed. Their parent is
**`13006:134371` "Frame 373"** (112x32), which probes as exactly those three
32px circles at a 40px pitch. The catalog row for `13006-134371` is *also* in
this wave's removed list, and it is alive too.

The mechanism: the wave-21 harvest enumerates only the **top-level children** of
a page (`liveChildCount 417` = `nodes.length 417` for page `13006:134300`). All
three badge ids fall between top-level frames `13006-134301` and `13006-135613`
— i.e. they are descendants of the first frame on the page, so they can never
appear in the snapshot, so `figma-drift.mjs` reports them removed on every run
in perpetuity.

A same-title rescue was impossible by construction here for a second reason:
these catalog titles are hand-written descriptions
("Chain badge — Solana (32px): black disc, #17F9B4 ring, gradient tri-bars"),
while the real layer name is `circle`. `figma-drift.mjs` matches on title, so
these rows can only ever land in REMOVED-WITH-WORK, never in RETITLED. The row
notes say as much: "Row present because the code cites this node."

The code is LIVE regardless. `figma-icons.tsx` exports `FigmaSolanaIcon:1377`,
`FigmaBaseChainIcon:1432`, `FigmaBnbIcon:1462`; `networkIcons.tsx:6` imports all
three from `@skai/ui/icons`; `DiscoverScreen.tsx:27` imports `NetworkBadgeRow`
from it; `TrenchRedesign.tsx:4` renders `DiscoverScreen`; `src/App.tsx:1891`
mounts `/trench`. The gate there is `isFeatureEnabled("REDESIGN_TRENCH")`, which
defaults **true** (`features.ts:74`, `!== "false"`). Six further consumers do not
touch that flag at all: `ImportWalletsModal.tsx:38-40`, `InsightXScreen.tsx:95-97`,
`TokenTradeDetail.tsx:95`, `ChainChartCard.tsx:63`, `ChainPriceChips.tsx:34`,
`LaunchMarketCard.tsx:92`.

> ⚠ Separately: the catalog title for `13006-134373` still reads
> "⚠ BROKEN EXPORT … not the Base brandmark". `figma-icons.tsx:1395` records that
> ruling as **reversed on 2026-08-18** (report 78e962e4) — the frame paints a flat
> #0052FF disc with a bar knocked transparent, and that is intended. The row title
> and the code now disagree. Flagging, not editing.

### 5b. Two Hi-Lo rows were Scratchers frames; the content survives on the Scratchers page (2 rows)

Both node ids probe as deleted, but neither frame's *content* is lost — each has
a counterpart on `✅ Scratchers - Skai originals` (page `9003:133221`), which is
where `hiloPageContent.ts` says they belonged all along.

| removed | superseded by | how matched |
|---|---|---|
| `9058-5154` "Skai > Play > Casino > Scratchers (768 x 1024px)" | **`9003-149392`** | Exact title **and** exact geometry. `hiloPageContent.ts:21` records the removed node as **768x1607**; `live/…__9003-133221.tsv` gives `9003:149392  FRAME  768x1607`. |
| `9058-2367` "Card out" | **`9003-139146`** (356x621) *or* **`9212-22275`** (356x695) | Exact title, and both candidates are 356-wide Scratchers bet panels — `hiloPageContent.ts:19` describes the removed node as "a generic Manual/Auto bet panel with no higher/lower control at all — the Scratchers panel". I could not pin which: the deleted node's geometry is absent from the 2026-08-13 capture too. |

Either way the attribution on these two rows was **wrong from the start**.
`hiloPageContent.ts:11-22` and `HiLoPage.tsx:14` both state that `9058-1833`,
`9058-2367`, `9058-7261` and `9058-5154` "really are Scratchers filed under
Hi-Lo… none of those five informed this page". Their removal cannot orphan
`HiLoGame.tsx` because they never implemented it. `/play/hilo` is mounted and
renders regardless.

---

## ORPHANED — none.

Every file named across all 13 rows exists, is imported under its real alias
form (`@gaming/…`, `@skai/ui/icons`, `@/components/…` — searched by symbol, not
by filename), and is reachable from a route in `src/App.tsx`. Nothing in this
lane is a candidate for deletion, and nothing was deleted.

---

## Two systemic findings

**A. The Towers board was re-cut wholesale.** `towers` shows 35 removals against
53 catalogued rows, and they are not 35 independent decisions. Thirty of them
are one contiguous block — `9079-3120` … `9079-3154`, every one named
`Rectangle 346246xx` — plus `9079-3251` and `9079-2977` from the same
generation. Against that, all 12 additions are the newer `10120-*` / `10130-*` /
`10250-*` generation, and they are named for game **states** rather than
mock-ups: Medium, Hard, Expert, Master, Selection mid game, Easy Loss reveal,
Easy cashout, Easy auto Selection, all 954x621. The `9079-*` desktop mock-up
generation was replaced by a per-difficulty state set. `9079-2001`, the 1440x3294
desktop page, survived. So two of my four towers rows (`9079-2977`,
`9391-19091`, both titled "Desktop Full Game") are collateral of one re-cut, not
two design deletions — though I could not tie either to a specific successor id,
because the new frames are cut by difficulty and the old ones were not.

**B. `trade-2`'s removed list is dominated by a harvest-scope artifact, and this
is not a games-ui problem.** I screened all 88 `trade-2` removals by testing
whether each id falls inside the id gap between two consecutive live top-level
frames — the signature of a deep child. **83 of 88 do.** The remaining 5 carry
entirely different page prefixes (`7909-`, `9081-`, `4018-`, `7890-`, `3928-`)
and are a separate question.

I verified five of the 83 live and all five exist: `13006:134372`,
`13006:134373`, `13006:134374`, their parent `13006:134371`, and — from another
lane's territory, deliberately, to check the class generalises beyond my own
rows — `13006:252239`, which returns `Frame 218` (232x42) containing a "Trench"
button and an action icon.

Those 83 rows name exactly the files the wave brief flagged as suspicious
clusters:

```
 11 AdjustTrenchSettings.tsx      6 DiscoverScreen.tsx        3 figma-icons.tsx
 10 AlertsModal.tsx               6 trenchDisplayPrefs.ts     3 PanelTabs.tsx
  9 TokenCard.tsx                 5 sidebarSurfaces.ts        2 networkIcons.tsx
  8 BlacklistModal.tsx            4 MarketPulseBoard.tsx      … 17 more files
  8 OneClickTradeModal.tsx        4 rightMenuChrome.tsx
  7 TrenchColumn.tsx              4 HotkeysMenu.tsx
```

The brief's guess was right and the reason is mechanical: eight removals on one
file is not eight deletions, it is one file that cites eight nested nodes. Any
catalog row whose node is a descendant rather than a top-level page child will
read as REMOVED-WITH-WORK on every future run until either the harvester
descends or those rows are marked as nested citations.

This corroborates rather than discovers — lanes `trench-discover-a` and
`trench-discover-b` reached the same mechanism independently on their own 26 and
28 rows (`orphan-triage.trench-discover-a.md`, `…-b.md`). Three lanes converging
on it from different row sets is the strongest form of the claim.

---

## What I did not do

No code deleted, weakened or edited. No row edited in `registry.json` or in any
status TSV. Deletion candidates are Casey's call and there are none to raise
from this lane.
