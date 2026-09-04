# Orphan triage - lane trench-rest (wave21 REMOVED-WITH-WORK)

Scope: every REMOVED-WITH-WORK row in `figma-todo.wave21.merged.tsv` whose
`implFiles` names `trench-redesign/discover/DiscoverScreen.tsx`,
`trench-redesign/discover/MarketPulseBoard.tsx`, or any
`trench-redesign/trade/**` file.

Assigned 22. Triaged 22.

Verdict: **0 orphaned, 0 deletion candidates, 22 LIVE.** Every node id is also
still present in Figma, unmoved and unrenamed. No code was touched.

---

## The finding that collapses the list: nothing was removed from Trade 2

All 83 trade-2 REMOVED rows in this wave are an artefact of the diff, not a
design change.

**The trade-2 page did not lose a single frame between the two harvests.**
The wave20 and wave21 snapshots of page `13006:134300` hold the *identical*
set of 417 top-level child ids - set equality, zero on either side:

```
snapshot.wave20.trade2.json   nodes = 417
snapshot.wave21.merged.json   trade-2.liveChildCount = 417, nodes = 417
wave20 ids == wave21 ids      True   (only-in-20 = 0, only-in-21 = 0)
```

**The snapshot records top-level page children only. The catalog holds nested
nodes too.** trade-2 is catalogued at 495 rows; 417 of the live ids match 407
of them, and the other 88 catalogued rows are nodes nested *inside* those
top-level frames. A nested node can never appear in a top-level-children list,
so the diff reported all 88 as removed. 73 of the 88 carry `title: null` and
`kind: untitled` - they were never harvested from Figma at all, and exist only
because `build-registry.mjs` grepped the tree and found code citing the id.
Their own note says so:

> "Row present because the code cites this node. citedByFiles/implFiles are
> derived by grepping the tree for the node id, not transcribed."

**Structural proof that these are nested, not deleted.** Four of my own rows -
`13006-201813`, `13006-201814`, `13006-201815`, `13006-201816` - are returned
by `get_metadata` as *descendants of* `13006-201800`, which is itself another
of my rows:

```
<frame id="13006:201800" name="modal" x="438" y="302" width="564" height="296">
  <frame id="13006:201802" name="Frame 480" ...>
    <frame id="13006:201813" name="Frame 186" x="0" y="92" width="516" height="54">
      <instance id="13006:201814" name="CTA/button" .../>
      <instance id="13006:201815" name="CTA/button" .../>
      <instance id="13006:201816" name="CTA/button" .../>
```

A page's top-level children cannot be nested inside one another. Those five
rows are therefore provably deep nodes, and their absence from a top-level
snapshot carries no information about deletion.

**Every one of my 22 node ids still resolves live in Figma**
(file `mhF3BkzlTaGiLzJ7kvpmVc`, "Skai-Web-App-2"), queried 2026-09-04. Node
ids unchanged, so nothing "superseded" them - there is no MOVED case here.

The three rows that carry measured geometry match their recorded numbers
exactly, which rules out a re-cut board as well as a rename:

| node | catalog recorded | Figma today | match |
|---|---|---|---|
| `13006-210578` | x=8 y=26 w=1047 h=608 | 1047 x 608 | yes |
| `13006-212012` | x=8 y=640 w=1047 h=277 | x=8 y=640 w=1047 h=277 (`Frame 444`) | yes |
| `13006-212076` | x=1061 y=26 w=313 h=1740 | x=1061 y=26 w=313 h=1740 (`Multi-panel - combined`) | yes |

Instrument note for whoever re-runs this: `get_screenshot`'s
`original_width`/`original_height` are the *rendered content bounds*, not the
frame box. For `13006-212076` they read 402 x 888 against a real box of
313 x 1740, because hidden layers are excluded from the render. Reading those
numbers as geometry would have manufactured a drift finding that does not
exist. `get_metadata` gives the frame box; use it for geometry.

**Consequence:** these 83 rows should retire as a catalog bookkeeping fix, or
better, the diff should be re-run against a depth-matched harvest. No code is
implicated. Retiring the rows would still discard the `implFiles` / `status` /
`notes` record for 83 nodes that are all still in the design, including three
carrying real measurement work and one carrying an open composition
escalation (`13006-212076`, see below).

---

## Reachability - both halves, per file

Feature gate: both routes below branch on `REDESIGN_TRENCH`, whose build-time
default is ON - `src/config/features.ts:74`,
`REDESIGN_TRENCH: import.meta.env.VITE_REDESIGN_TRENCH !== "false"`. So the
redesign renders unless a `feature_flags` row or `VITE_REDESIGN_TRENCH=false`
turns it off.

### DiscoverScreen.tsx - LIVE
Rows: `13006-134366`, `13006-134370`, `13006-134384`, `13006-134387`,
`13006-188668`, `13006-195278`

- Imported: `src/pages/trade/TrenchRedesign.tsx:4`
  (`@/components/trench-redesign/discover/DiscoverScreen`) and its own test.
- Rendered: `TrenchRedesign.tsx` returns `<TrenchShell><DiscoverScreen /></TrenchShell>`.
- Route: `src/App.tsx:406` lazy-loads `./pages/trade/TrenchRedesign`;
  `src/App.tsx:1891` mounts it at `<Route path="/trench" ...>`.

### MarketPulseBoard.tsx - LIVE, and it is the default view
Rows: `13006-134366`, `13006-134382`, `13006-134400`, `13006-195269`

- Imported: `DiscoverScreen.tsx:25`.
- Rendered: `DiscoverScreen.tsx:495`, gated on `surface === "market-pulse"`.
  That gate is not dead - `DiscoverScreen.tsx:121` initialises
  `React.useState<TrenchSurface>("market-pulse")`, so this board is what
  `/trench` shows on arrival.
- Route: as above, `/trench`.

Co-named files on those rows reach the same place:
`TrenchColumn.tsx` and `AlertsModal.tsx` are imported at
`MarketPulseBoard.tsx:26-27`; `pulsePrefs.ts` at `AlertsModal.tsx:41` and
`TrenchColumn.tsx:18`; `switchTheme.ts` at `AlertsModal.tsx:42`;
`AdjustTrenchSettings.tsx` at `DiscoverScreen.tsx:15`, rendered at `:665`.
(Those files belong to other lanes - noted only so the whole row resolves.)

### OneClickTradeModal.tsx - LIVE
Rows: `13006-201800`, `13006-201813`, `13006-201814`, `13006-201815`,
`13006-201816`, `13006-204639`, `13006-204656`, `13006-207496`

Seven of these eight are one Figma modal and its own descendants, per the
metadata dump above - the row count reflects nesting depth, not eight
deletions.

- Imported: `src/components/trench-redesign/trade/OrderPanel.tsx:40`.
- Rendered: `OrderPanel.tsx:357`, `<OneClickTradeModal open={oneClickOpen} ...>`,
  opened by a real control at `OrderPanel.tsx:182` (`onClick={() => setOneClickOpen(true)}`).
- Chain to route: `OrderPanel` <- `TradeTerminal.tsx:174` <-
  `src/pages/trench/TrenchTradeTerminal.tsx:4` <-
  `TradeRouteBranch.tsx:6-16` (lazy) <- `src/App.tsx:411` import,
  `src/App.tsx:1831` `<Route path="/crypto/:symbol" ...>`.

### instantTradePrefs.ts - LIVE
Row: `13006-207496`

Imported by `OneClickTradeModal.tsx:35`, `InstantTradeSettingsModal.tsx:11`,
`OrderPanel.tsx:49`, and `discover/TrenchColumn.tsx:19`. All four reach a
mounted route by the chains above.

### PanelTabs.tsx - LIVE
Rows: `13006-210578`, `13006-212012`, `13006-212076`

- Imported: `TradeTerminal.tsx:13`.
- Rendered: `TradeTerminal.tsx:147`.
- Route: `/crypto/:symbol`, chain as above.

### TradeHeader.tsx - LIVE
Row: `13006-210579`

- Imported: `TradeTerminal.tsx:6`. Rendered: `TradeTerminal.tsx:78`.
- Route: `/crypto/:symbol`.

### TradeTerminal.tsx - LIVE
Rows: `13006-210579`, `13006-212076`

- Imported: `src/pages/trench/TrenchTradeTerminal.tsx:4`.
- Route: `/crypto/:symbol` via `TradeRouteBranch`, `src/App.tsx:1831`.

### InstantTradeSettingsModal.tsx - LIVE
Row: `13006-219554`

- Imported: `TradeTerminal.tsx:15`. Rendered: `TradeTerminal.tsx:215-216`,
  opened from `TradeHeader`'s `onOpenInstantTrade` (`TradeTerminal.tsx:82`)
  and `OrderPanel`'s `onOpenSettings` (`TradeTerminal.tsx:174`).
- Route: `/crypto/:symbol`.

---

## Carried forward, not resolved here

`13006-212076` (`Multi-panel - combined`) still holds the composition
escalation its catalog note records, and the frame is still in Figma to
answer it against: the design's right rail is OrderPanel / COMMUNITY /
SIMILAR TOKENS, while the code renders OrderPanel, TokenInfoPanel,
PositionReadout, RiskPanel and puts Community and Similar tokens inside
`PanelTabs`. Retiring the row on a bad "removed" signal would drop that open
question. Not a lane decision.
