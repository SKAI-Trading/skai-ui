# Wave 43 integrity record (2026-09-14, 22:12 to 22:30 Denver)

A measurement wave, no code edits. Session skai-trading-08's wave 23 fixed several
hundred bug reports on 2026-09-14 and 268 of its changes were built against Figma
frames; no lane wrote catalog rows for them, so the catalog carried each frame's pre-fix
verdict. Casey asked for the catalog to be true before the next build wave. Five lanes
re-measured every one of those frames against the source at HEAD, from 08's consolidated
list (`wave23_catalog_deltas_for_95.json`: 216 frames on the web-app file, 46 on the
social file, 6 on the slots file).

## 1. The lanes

| lane | rows | read live | done | partial | blocked-on-backend | not-started | frame-defect |
|---|---:|---:|---:|---:|---:|---:|---:|
| home | 74 | 24 | 15 | 58 | 1 | 0 | 0 |
| trench-launch | 58 | 25 | 4 | 52 | 0 | 1 | 1 |
| play-sports | 47 | 28 | 25 | 21 | 1 | 0 | 0 |
| wallet-social-predict | 47 | 38 | 10 | 35 | 1 | 1 | 0 |
| trade | 40 | 40 | 14 | 21 | 0 | 0 | 5 |
| **total** | **266** | **155** | **68** | **187** | **3** | **2** | **6** |

Rows the seat budget did not reach say `NOT RE-READ` and keep the verdict they had. Two
node ids appeared twice in 08's list and are written once each.

| measure | before (wave 42 close) | after | delta |
|---|---:|---:|---:|
| `done` | 592 (15.5%) | 585 (15.3%) | -7 |
| `done` and visually verified | 169 (4.4%) | 174 (4.6%) | +5 |
| claimed statuses pulled down by a visual verdict | 32 | 35 | +3 |
| whole-frame matches added to the vverify files | 0 | 55 | +55 |

`done` went down because the reconcile is honest in both directions: wave 23's own
`done` and `implemented` claims were class-tested, not measured, and 14 of them did not
survive a live read (six on trench and launch, seven on the wallet, one on trade), while
most of the frames the lanes measured as matching are nodes the registry does not hold
yet (next section) and cannot count until it does.

## 2. Half the rows have nowhere to land

133 of the 266 rows name a node id that is not in `registry.json`: home 25, trench-launch
18, play-sports 37, trade 28, wallet-social-predict 25. Their status rows are written and
kept, and `bp-report` lists them as applying to zero frames. The cause is the September
short harvests recorded in `pages.json` (`_reharvested`): the home, wallet and trade
sections were refused because the `get_metadata` capture returned 38%, 51% and 49% of
their catalogued ids, and the registry still carries their 2026-08-18 node lists. 08's
lanes worked from bug reports that cite Figma nodes directly, so they reached frames the
catalog never enumerated. The rows fold in the moment the registry holds those nodes;
nothing needs re-measuring. Two cautions for whoever runs that harvest: `harvest.mjs
plan --file mhF3BkzlTaGiLzJ7kvpmVc` sizes the web-app file at 7 pages, 1,715 rows and 15
Plugin-API chunks, but its scripts capture top-level page children only, and many of
08's nodes are nested frames (a wallet input, a header row, a control inside a board),
so the capture must enumerate at the depth the registry's `<section>.nodes.txt` lists
were built from, or the 133 nodes must be added to those lists explicitly from the
status rows (each row carries the node id, the frame title with its width, and the
file key).

**Closed 2026-09-15, and the cause above was wrong.** All 133 ids were probed live with
`getNodeByIdAsync` on their file: every one is alive. 130 are nested frames (depth 1 to
10) under top-level frames the registry already held; 3 are new top-level frames on the
Hooked page (the HUD balance bars). A page-children harvest can never see a nested frame,
however complete it is, and `verify-ingest` the same day hashed every Home, Wallet and
Trade page equal to `live/`, so the September short-harvest story does not explain these
rows. The 130 were appended to their section's `nodes.txt` and `titles.tsv` (title = the
top frame's catalog title, then the lane's label, then the layer name and size) and
recorded in `live/_resolved.json`; the 3 arrived through a re-ingest of the Hooked page.
Ten sportsbook ids carried the web-app-2 key in 08's list and resolve on the Play page of
Skai-Web-App; they were attached there. Registry 4,654 -> 4,783 frames; every wave 43 row
now applies to a frame. The parity headline did not move (585 done of 3,813), because a
nested frame is not in the live top-level denominator; what moved is that the 133 measured
verdicts are now attached to frames a lane can be briefed on.

## 3. Findings that travel

- **Wave 23's `done` was a class-test claim.** Six trench and launch frames, seven wallet
  frames and one trade frame carried `done` with no width behind them; the live read
  found the gaps in numbers (a 3.2px pump.fun badge overdraw, a 4px order-panel header,
  wallet quick-action tiles at 60 where the frame draws 58, the 1440 tile order shipped
  as the 375 order so the HOT tag sits on the wrong tile).
- **Ten of 08's rows carried the wrong file key.** Ten sportsbook frames were listed under
  the web-app file and return "node not found" there; they live in the social file, as
  every `src/pages/sports` docblock says. A lane trusting the key files ten NOT RE-READ
  rows for frames that open.
- **`get_metadata` reads a hidden control as a missing one.** `11109:81874` reports four
  un-hidden children and reads as an absent control; `get_screenshot` returns 1x1. The
  source was right; metadata alone would have demoted a correct row.
- **Every intel screen is 1220 wide against the board's 1144** (`max-w-[1268px] px-6`),
  eight home rows; the portfolio has the same departure at 1440. Both are ruled, both
  keep those rows short of `done`.
- **The order-type strip's 768 height is recorded on three boards** (40, 48, 40) where
  `orderTypeStripHeight.figma.test.ts:21` says "recorded on neither board" and
  interpolates 38.
- **The Scan QR surface does not exist.** Only a dead `onScanQR` prop at
  `SendFlow.tsx:59`; the frame at 768 reads `missing`.
- **Registry drift:** two rows point at the retired `src/components/trench/DiscoverTabs.tsx`;
  two name `TradeChart.tsx` where the surface is `CompactTicket.tsx`; `HudScene` cites
  `10407:13319`, not the three HUD nodes assigned.
- **Frame defects, not built:** "Google Play", the band variant on four modal boards,
  "Arbitrium" (home); leverage copy "up to 40x" over presets printing 120x and a 0x
  preset, volume ticks over a plot with no volume pane (trade); three copy typos the
  source correctly does not ship (play).

## 4. Hand-offs for the next build wave

- The three exact deltas above (badge 3.2px, header 4px, tiles 60 vs 58) and the wallet
  quick-action order per width.
- `LiveStreamsView` builds the 1318 split under a 54px header with an honest no-source
  state; the source is the open item, not the layout.
- `PlayFilterBar`'s ramp table assigns 200 to 768 where three live nodes say 140; the
  licence tile gutter is 16 where the frame draws 11; `TrendingBets` volume art is 2px
  off in both axes.
- `Play.tsx` went dirty under a peer lane during the read; its rows describe `c8ee148e`.

## 5. Verification at close

- Fold (`pipeline.mjs`): exit 0; `bp-report.mjs` exit 0 with all five files.
- Two lanes wrote their verification lines to lane-named files the fold does not read;
  the lines were moved into `vverify.play.tsv`, `vverify.home.tsv`, `vverify.predict.tsv`
  and a new `vverify.wallet-2.tsv` before the fold.
- No code changed in this wave; the gate and build stand at the wave 42 close (gate
  green 21:45, deploy_main 22:13 from the clean worktree).

## 6. What is next

1. ~~Re-harvest home, wallet and trade so the 133 orphan rows attach.~~ Done 2026-09-15
   by probe, not by harvest; see the closing note under section 2.
2. **A build lane per section** over the wave 43 `partial` rows: every gap is in numbers.
3. **A browser pass** over the 55 matches queued in the vverify files and the 174
   verified frames.
