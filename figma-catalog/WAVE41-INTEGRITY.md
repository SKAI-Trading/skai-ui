# Wave 41 — integrity and close-out, batch b (2026-09-14)

Written by the orchestrating session after the six lanes of batch b reported. Every
number carries its denominator, the rule inherited from `WAVE9-INTEGRITY.md` onward.
The brief the lanes worked from is `WAVE41-BRIEF.md`.

Wave 41 was cut for twenty lanes on 2026-09-10 after Casey's message ("Games have been
updated ... the stretched out UI for mobile ... now done for all 21 games as well as 5
slot games ... make sure the figma % is true and updated ... then lets do a big wave and
start cooking on the integration"). The twenty-lane launch died three times in its
reading phase on the model's session limit and landed nothing; the lesson is recorded in
`a-twenty-lane-fleet-dies-in-its-reading-phase-2026-09-13.md`. Batch b is the first six
lanes run at a size that finishes: the five slot pages Casey listed as missing from the
status board, and Wallet. The games batch (five lanes over the 21 redrawn game pages) and
the web-app lanes follow at the same size.

**Baseline (pinned before batch b, 2026-09-13):** main `cc918fe8e` (SlotGameId widening
and the bet-limit seed) · skai-ui at the 2026-09-11 fold · skai-gaming `61cc7b41` ·
skai-landing `d16aaf9` · parity 594 / 3,814 done (15.6%), 163 verified.

**Close (this fold):** the same 3,814 in-scope frames, 3,813 of them carrying a row
(100.0%); 605 done (15.9%), 174 verified (4.6%).

---

## 1. What moved

| measure | before | after | delta |
|---|---:|---:|---:|
| in-scope genuine frames (of 4,585 live; 771 furniture) | 3,814 | 3,814 | 0 |
| frames with a status row | 3,613 (94.7%) | 3,813 (100.0%) | **+200** |
| `done` | 594 (15.6%) | 605 (15.9%) | **+11** |
| `done` and visually verified | 163 (4.3%) | 174 (4.6%) | **+11** |
| claimed statuses pulled down by a visual verdict | 92 | 92 | 0 |
| drift: live-only / catalog-only | 201 / 0 | 1 / 1 | — |

The 200 frames that gained a row are the five slot pages: they entered scope on
2026-09-11 with no rows at all, so the denominator carried them as unrowed drift for
three days. The one remaining live-only frame and the one catalog-only frame are the
harvest's (`catalog:drift` names them); the next harvest folds them in.

The headline is small and honest: eleven more frames measured to the frame and eleven
more verified visually. The bulk of batch b's output is the 235 `partial` rows that
replaced `not-started`, each naming what is still open, and the code those rows describe:
four new slot-engine pages, one rebuilt, and seven wallet screens brought to their
boards. No lane used a browser (wave rule), so no screen row claims a DOM-measured
`done`; the `done` rows are assets, symbols and frames resolved from source against node
data read live this pass.

## 2. The lanes

Six lanes, partitioned by file ownership per `WAVE_PLAYBOOK.md`. Each wrote its own
`status.wave41.<lane>.tsv`; none was regenerated afterward. Row counts are data rows
(comment lines excluded), as read from the files at close.

| lane | rows | done | partial | blocked-on-backend | not-started | frame-defect | furniture |
|---|---:|---:|---:|---:|---:|---:|---:|
| slots-cosmic | 53 | 12 | 39 | 0 | 2 | 0 | 0 |
| slots-safari | 62 | 0 | 30 | 0 | 0 | 11 | 21 |
| slots-gem | 59 | 0 | 30 | 27 | 0 | 0 | 2 |
| slots-vegas | 83 | 3 | 13 | 16 | 1 | 12 | 38 |
| slots-fisherman | 69 | 1 | 53 | 5 | 0 | 1 | 9 |
| wallet | 95 | 14 | 70 | 7 | 0 | 4 | 0 |
| **total** | **421** | **30** | **235** | **55** | **3** | **28** | **70** |

30 `done` rows became +11 in coverage: 28 hold in the registry, two wallet rows were
pulled to `partial` by wave 39's visual verdicts (the lane restated frames it had not
re-read, and the verdict outranks the claim, by design), and 17 restated frames that were
already `done`. That arithmetic is `coverage.mjs` section 4b doing its job; it is what
keeps the percentage from being raised by editing status rows.

Every lane re-read its frames live this pass (Casey's 2026-09-10 note said every game
page changed), which is why each status file carries a header naming the frames read as
code versus by metadata. Gem's 37 unread frames say `NOT RE-READ` in the row rather than
carrying a verdict.

### Commits by lane

All in `modules/skai-gaming` unless marked; every commit used explicit pathspecs.

- **slots-cosmic** — `40391d1a` Start button, Starbound logo, per-orientation win ring and
  banner, sprites wired by node; `f77251bc` frame facts for the 09-10 re-read;
  `86adf748` phone wins table, shelf cards, hero ramp per board. Orchestrator: `e2bf77fc`
  (BootScene `moveBelow` without a type argument, TS2558).
- **slots-safari** — `7be745db` Untamed (`safari_slots`) definition, skin, content, logo;
  `da41080a` the Untamed detail page at 1440/768/375; `9c581e65` one `useBetCurrency`
  feeding `SlotGame` and the strip's `CurrencyToggle` (the Cosmic page's pattern).
- **slots-gem** — `0d14b6e6` page, skin, copy templates, definition builder, card raster;
  `b957d78b` phone Bets dropdown, load-screen sizes, card fade; `c764c4de` five skin SVGs
  rewritten without Figma's `foreignObject` blur wrapper.
- **slots-vegas** — `c511df25` skin and content with the math as an `Offline` sentinel;
  `8c2b8fd0` the page, drawing the frame's load screen while the math is pending;
  `9c1e9489` admin card gains the `vegas_fortune_*` block; `0acaf3c5` one lifted
  `useBetCurrency`; `f29bcdbd` two mobile-button SVGs rewritten without `foreignObject`.
- **slots-fisherman** — `1d38150f` Hooked (`fisherman_slots`) skin and definition with
  uncertified sentinels; `77d0b20a` page, sections, service, admin card, suite; `ca233b03`
  full-bleed 375 shapes; `7605c8fa` one lifted `useBetCurrency`; `ae07d503` tile ramp and
  frame facts. Orchestrator: the availability union's early return rewritten as an
  equality test (see section 3).
- **wallet** (`modules/skai-wallet`) — `68b8828` recovery screens; `ae24bca` accounts
  panel under rename; `ace8a0f` welcome, landing, unlock, auth fields; `d35aa2c` and
  `62b6e8b` email-verification modal on all three boards; `ab83aea` activity table;
  `853ea7d` NFT import fields and empty tab; `572793b` token-detail phone group.
- **orchestrator, routes** — main `c69e8e4c8` and skai-gaming `32393312` (section 3).

## 3. Integration state

**Which engine games can settle.** The server's `SLOT_GAMES` map holds `cosmic_slots` and
`safari_slots` only, and peer commit `bdd218ff` opened the chain rail for both (SKAI and
sUSD). Untamed therefore settles on every rail today. Gem, Vegas Fortune and Hooked mount
the engine with honest sentinels: the reels load, the page says the server cannot settle
the game yet, and no outcome, paytable or figure is drawn client-side (each definition's
test enforces that). The pipeline that lifts each notice is, in order: chain
`SlotGameConfig` in `slot_games.go` → `cmd/slot-certify` → `cmd/slot-vectors` →
`npm run slots:vectors` → the TypeScript port and a `SLOT_GAMES` entry. None of that is a
lane's to write.

**Routes.** `/play/safari-slots`, `/play/gem-slots`, `/play/vegas-fortune` and
`/play/fisherman-slots` are registered in the host app (main `c69e8e4c8`), each shaped
like the Cosmic route: a component reading `SLOT_ENGINE_{SAFARI,GEM,VEGAS,FISHERMAN}`
through `isFeatureEnabled` and redirecting to `/play/casino` while shut. All four flags
default OFF and their `feature_flags` rows are seeded `enabled=false, rollout 100` by
migration `20260914190518_slot_engine_page_flags` (applied; ledger paired; the main
commit is unpushed, per the migration rule Casey pushes).

A flag opens a route only. Only Fisherman is in `ROUTED_GAME_PATHS` (skai-gaming
`32393312`), because it has no legacy widget and no tile. The Safari, Gem and Vegas
Fortune tiles open live legacy dialogs, and the map sends a tile to its route
unconditionally, so a mapped tile behind a shut gate would turn a working game into
"lands on the hub". `playRoutedGamePaths.test.ts` names the three as gated replacements,
checks each is a real route, and refuses a path that is in both the set and the map.
Moving a tile is therefore a code change (the map entry plus deleting the dialog case in
`Play.tsx`, as Cosmic's was), taken per game once its build is certified. Flipping a row
before that makes the page reachable by URL for review without touching a live game.

**The gate.** `typecheck:gate` was red at 13:20 on six new errors (four from lanes still
mid-edit, two from peer commits `0c90514bb` and `25e2ec599` that predate the batch and
belong to another session) and at 13:55 on four. Two of those were Hooked's availability
union: the app tsconfig compiles with `strict` off, and without `strictNullChecks` a
truthiness test on a boolean-literal discriminant does not narrow the union inside the
memo callback, so `reason` did not exist on the type. The lane's suite could not see it
because vitest strips types without checking them, and the page had never been in the
app compile at all — `modules/skai-gaming` is excluded from the app tsconfig and my route
registration was the first import. Rewritten as equality tests. The verdict at close is
recorded in section 6.

**A false alarm worth recording.** Two lanes reported `src/slots/SlotGame.test.tsx`
failing at file level with `Missing VITE_THIRDWEB_CLIENT_ID`. It passes from the
superproject root (17/17, confirmed by skai-trading-3b); the throw is what vitest produces
when run from inside `modules/skai-gaming`, where no root `.env` supplies the variable
and the submodule's own vitest config lacks jest-dom. Slot suites run from the root. The
two peer gate errors above cleared before the closing gate run.

## 4. Decisions only Casey can make

1. **Names.** Every frame renamed its game after the harvest: Safari Slots draws as
   **Untamed**, Cosmic Slots as **Starbound**, Gem Slots as **Sugar rush** (a well-known
   third-party slot the design closely resembles), Fisherman Slots as **Hooked**. Each
   page is built to its frame's name; ids, routes, config keys and the hub tiles keep the
   old names. Which name ships, and whether Sugar rush can ship at all, is a ruling.
2. **Desktop column.** Vegas Fortune, Gem and Hooked each have two 1440 boards, one at a
   1318 column and one at 1200 ("screen type 2"); the lanes built 1318.
3. **Copy that contradicts the certified math.** Untamed's paragraph says 25,000x and
   98.16% RTP against a certified 2,500x and 98.42%; Hooked's three page cuts carry the
   Untamed text (cubs, 25,000x beside 2,000x, 91.22%) under the Hooked heading; Gem's
   copy names diamonds and lollipops as the scatter and 1,000x beside 2,500x. The pages
   print certified figures where one exists and nothing where none does; the copy needs
   a designer's pass.
4. **More-games shelf.** The 375 cuts list a different shelf from the 1440 cuts on
   Untamed and Vegas Fortune; code carries 1440's everywhere.
5. **Vegas Fortune art.** Outlaw versus money-bag cover; load screen with or without the
   outlaws; three tablet bar placements.
6. **Wallet.** The forgot-password boards draw an email field the code deliberately
   omits (thirdweb collects it); the two "create new wallet" boards are an
   account-creation form the 2026-07-03 ruling forbids; hardware-wallet QR scanner versus
   file import; share picker as select versus tiles at 375.
7. **Cosmic refresh screen.** Frames `10407-13075` and `11930-40220` draw a state with no
   trigger named anywhere.

## 5. Hand-offs

- **Slot engine (skai-trading-3b's files: `SlotGame.tsx`, `types.ts`, `layout.ts`,
  `HudScene`, `MenuScene`).** The four skins want things the engine cannot draw yet, the
  same list from four lanes: a raster board frame from `skin.frame.url`; per-skin faces
  and palette (the engine hardcodes Cosmic's purple bar and violet stroke); a tablet
  layout slot at 708x720; load-screen composition (plank, bar, orb, "Presents" line);
  intro cards and drawer menus; portrait rig at the frames' 500-tall canvas; round
  40px mobile buttons; `poses` on `SlotLayout`; menu rows Sound/Music/Expand/Information;
  paytable and menu scenes that do not print NaN for an uncertified game. Details per
  skin in each game folder's `FRAME_FACTS.md`.
- **Certification pipeline** for `gem_slots`, `vegas_fortune`, `fisherman_slots` (section
  3). Gem's `definition.ts` exports a builder that takes the certified config; Vegas's
  `VEGAS_FORTUNE` is an `Offline` sentinel; Hooked's holds NaN sentinels.
- **play-hub lane (not yet run; the hub was under a peer's program overnight).** Tiles
  for `vegas-fortune` (the legacy tile id is `slots`) and `fisherman-slots`; tile art
  `gem-slots-sugar-rush.webp`; `GameDetailPage` and `FIGMA_GAME_ART` entries; admin
  `games/index.ts` mount of `FishermanSlotsConfigCard`; the three tile moves in section
  3 when certified.
- **Config rows.** `gaming_cosmic_slots_min_bet`, `gaming_gem_slots_min_bet` and
  `gaming_safari_slots_min_bet` do not exist; each game runs on the 0.01 build default
  while the POINTS rail rejects a fractional stake. Vegas and Hooked were seeded at 1 /
  1,000 by `20260914032021`. Seeding the other three changes a shipping game; Casey's
  call.
- **Wallet.** `AddWalletDrawer.tsx` fields derive 52 against 48/50/62 boards and its
  phone CTA pair 53 against 44, pinned by a peer's test at `py-5`; activity dollar line
  needs a value-at-time on `TransactionRecord`; NFT detail boards are pages, not the
  modal the code draws; token-detail phone board wants a collapsed swap accordion.
- **Shared.** `GameShell` pads 12 under md where the full-bleed 375 frames want 0; every
  wallet field draws 2px tall because CSS strokes sit outside Figma's inset.

## 6. Verification at close

- Catalog: `npm run catalog` folded the six status files and their vverify rows; every
  wave 41 row matched a registry frame (the 196 unknown-id rows in the fold log are older
  waves'). `catalog:check` is clean after the fold.
- Route guard: `playRoutedGamePaths.test.ts` 27 tests pass (root vitest).
- Skin assets: `skinSvgAssets.test.ts` green for every skin after `f29bcdbd` and
  `c764c4de`; `src/slots` 520 tests pass from inside the submodule, plus the 17 in
  `SlotGame.test.tsx` that only collect from the root (section 3).
- Ledger: `supabase migration list --linked` pairs `20260914190518` local and remote; 0
  remote-only rows.
- Gate: recorded by the orchestrator at close, below.

```text
[typecheck:gate] ✓ no new type errors. 2552 known baseline error(s); 46 fewer than baseline — run typecheck:gate:update to ratchet down.
```

Read off the gate's own verdict line at 13:24 Denver with every lane commit, the route
registration and the Hooked narrowing fix in the tree. No `typecheck:gate:update` was run.

## 7. Games batch (2026-09-14, 14:00 to 15:02 Denver)

Five lanes over the 21 redrawn game pages, launched after Casey's "Do it all", run on a
second model so the orchestrator's window was not the lanes'. It made no difference:
all five died five minutes in on the same account-wide session limit and were resumed by
id after the reset at 14:11, with their measured numbers intact. Every lane re-measured
every frame in its work order, `done` rows included, because a game `done` older than
2026-09-10 was a claim about the old frame.

**The number went down, and that is the batch working.**

| measure | before (batch b close) | after | delta |
|---|---:|---:|---:|
| `done` | 605 (15.9%) | 587 (15.4%) | **-18** |
| `done` and visually verified | 174 (4.6%) | 164 (4.3%) | -10 |
| claimed statuses pulled down by a visual verdict | 92 | 89 | -3 |
| frames with a status row | 3,813 | 3,813 | 0 |

The 21 game pages carried `done` rows from waves 8 through 39. On 2026-09-10 every
phone cut was rebuilt: board and bet panel both 375 wide at x=0, children inset 16
across and 12 down on a 343 column, an 8px seam between board and panel, no radius, the
type ramp stepped per game (crash, limbo and coinflip drop to 12/14; dice keeps 12/16 and
14/18). The desktop side did not move: every 954 by 621 board and every 356 panel
re-read at what the catalog recorded. So the old `done` rows were true of the old frame
and false of the new one, and the lanes wrote what they measured. Casey asked for the
percentage to be true; a re-measurement that only ever raises the number is not one.

| lane | rows | done | partial | blocked-on-backend | not-started | frame-defect | furniture |
|---|---:|---:|---:|---:|---:|---:|---:|
| games-instant-a | 66 | 0 | 64 | 0 | 0 | 1 | 1 |
| games-instant-b | 34 | 0 | 31 | 0 | 0 | 3 | 0 |
| games-cards | 49 | 16 | 19 | 0 | 0 | 14 | 0 |
| games-arcade-a | 39 | 0 | 34 | 0 | 0 | 3 | 2 |
| games-arcade-b | 40 | 4 | 15 | 9 | 0 | 12 | 0 |
| **total** | **228** | **20** | **163** | **9** | **0** | **33** | **3** |

No lane used a browser, so a screen row is `done` only where the frame matches the
source at every width it draws, stated in numbers. Rows the seat budget did not allow a
re-read say `NOT RE-READ` and are never `done` (arcade-a 26, instant-b 15, arcade-b 12,
gem-style honesty carried from batch b). The 33 frame defects are named per row: mis-filed
frames (a Home upload frame on the Dice page), cuts that carry the desktop ramp at 375,
lattices that disagree with their own base board, template payout literals repeated
across three games, and the five retired 347 standalone frames.

### Commits by lane (all `modules/skai-gaming`, explicit pathspecs, not pushed)

- **games-instant-a** — `5e053832` crash phone 12/14 and 8px seam; `5ee68675` limbo
  phone 12/14; `e538533f` coinflip 357 floor and 16/12 panel; `0bd1e1e1` dice CTA-first
  panel and 290 board; `ba3fcb3a` crash and limbo 16/12 insets, crash 247 board;
  `ad2bd21f` all four page columns to 16px; `9fc48414` limbo pills and hero.
- **games-instant-b** — `15bca5e4` mines stake chips hug their label; `0cf3dc38` hilo
  label and value ramp steps at md; `3ab1b925` slide reel re-read at 375; `428c67ba`
  slide panel ladders re-derived; `85532d6c` mines, plinko and slide phone panels 16/12.
- **games-cards** — `89751b55` blackjack phone board and panel refitted from a 345 box to
  373; `fc374924` roulette Bet panel keeps only the Your Bets total (Casey's ruling
  090e759d); `dd3fbf45` scratchers phone board, panel and paytable strip; `e2df0b16`
  baccarat, video poker and the scratch board on the 343 column.
- **games-arcade-a** — `6d214e2c` chicken column; `c264a366` darts column; `18119394`
  darts widget (210 board cap, 38px chips and track).
- **games-arcade-b** — `9e7a9b39` towers phone panel 375/343/16 with a 12 padY;
  `77abbc9d` bingo and rps phone panels; `6262388b` towers CTA says Cashout; `8349bb06`
  towers and price-grid docblocks; `86728d7a` cashout card ends on the token glyph.
- **wave 23 (skai-trading-08), same window, by agreement** — `014ec542` PlayerMark, the
  tinted pixel pillar for players with no photo, in tile win rows and the Top bets User
  column; `8a1454b9` the /play hub column capped at 1318. Coinflip's Game Mode row stays
  hidden by `targetPlayable = false` (ruling 0f0df6da, no change needed).

### Hand-offs the games batch converged on

- **GameShell (shared, blocks every phone row).** `components/play/shared/GameShell.tsx`
  pads 12 and rounds 16 below md where every 375 frame draws 0 and square; the 19
  `-mt-3 md:-mt-4` cancellations in the `*PageSections.tsx` files go with it in one
  commit. Four lanes named it independently. Same owner: the shared input toggle is
  40.593 by 24 in every frame and 38 by 21.333 in six panels.
- **Sections the lanes could not reach.** `PlayGameDetailSections.tsx` owns keno's and
  fortune-wheel's columns; `FortuneWheelPro`'s `HISTORY_CHIP.mobileScale` is fitted to the
  retired 347 cut; baccarat has no route and no PageSections, so both page cuts stay
  unbuilt; video poker's phone panel is a rebuild, not a spacing fix.
- **Server.** Rock-paper-scissors has only `play_rps` on the points rail: no start, round
  or cashout, no multi-hand (9 rows blocked). Bingo's frame draws a 50-slot tray the
  server's four ball counts do not price.
- **Player mark.** The per-game Community wins tables still draw initials; Casey's ruling
  wants the tinted pillar for players with no photo. A follow-up lane carries
  `PlayerAvatar fallback="mark"` into the 21 sections files.

### Decisions only Casey can make (games)

1. **Price Grid desktop.** Two 1440 layouts: 10030-30838 is a 356 panel beside a 954
   canvas (what the code builds); 10030-39086 is one 1318 by 858 canvas with the fields on
   the chart.
2. **Slide's field.** Six panel frames say "Auto Cashout", both page cuts say "Target
   Multiplier"; the 08-19 ruling picked the panels and the page cuts never followed.
3. **Coinflip Target mode.** Nine frames measured, none built; it waits on a rule and a
   house edge.
4. **Template payouts.** Three cash-out cards on three games print the same 2.340195
   under different multipliers; on the bingo badge it replaced 300.50303. No lane changed
   a figure; the frames need a designer's pass.

### Gate

An early pass at 14:33 over the first twelve lane commits read clean:

```text
[typecheck:gate] ✓ no new type errors. 2552 known baseline error(s); 46 fewer than baseline — run typecheck:gate:update to ratchet down.
```

The closing pass at 15:10 over all 26 commits reported two new errors, both in
`src/pages/Launchpad.tsx` (`safeExternalUrl` and `FigmaSearchIcon` not found). That file
is dirty in the shared tree and belongs to wave 23's running batch-7 lane (L36-pages); it
is a peer's edit caught mid-flight, not a games commit. No error in `modules/skai-gaming`
on either pass. Read off the gate's own verdict line both times; no
`typecheck:gate:update` was run.

## 8. Web-app batch 1 and the player-mark follow-up (2026-09-14, 15:15 to 16:05 Denver)

Five web-app lanes (home, trade, trade-2, predict, social) plus one follow-up lane
carrying Casey's no-photo ruling into the game pages, fenced by file list against wave
23's running batches (18 files moved to report-only; the fence held, and the one
collision was in the shared git index, section 8 note below). The web-app Figma files did
not change on 2026-09-10, so these lanes worked their open frames rather than
re-measuring everything; a frame the seat budget did not allow a re-read says
`NOT RE-READ` and keeps its prior verdict. All five died once on the session limit at
15:40 and were resumed by id.

| measure | before (games close) | after | delta |
|---|---:|---:|---:|
| `done` | 587 (15.4%) | 590 (15.5%) | +3 |
| `done` and visually verified | 164 (4.3%) | 167 (4.4%) | +3 |
| claimed statuses pulled down by a visual verdict | 89 | 38 | -51 |
| web-app rows carrying today's stamp | 0 | 1,024 | +1,024 |

The pull-down count halving is the batch's main effect on the catalog: 51 rows whose
status and visual verdict disagreed were re-measured and now say the same thing.

| lane | rows | done | partial | blocked-on-backend | not-started | frame-defect | furniture |
|---|---:|---:|---:|---:|---:|---:|---:|
| home | 253 | 0 | 218 | 3 | 26 | 3 | 3 |
| trade | 204 | 0 | 196 | 3 | 4 | 1 | 0 |
| trade-2 | 188 | 1 | 164 | 2 | 6 | 6 | 0 |
| predict | 144 | 2 | 88 | 7 | 46 | 1 | 0 |
| social | 235 | 0 | 167 | 33 | 24 | 11 | 0 |
| **total** | **1,024** | **3** | **833** | **48** | **106** | **22** | **3** |

### Commits (superproject unless marked; all lane commits pathspec-only from here on)

- **home** — `fba761d5e` Sentiment "View all topics" overlay; `f555bb25e` security fix,
  the post link goes through `safeExternalUrl` at the sink and a rejected URL renders as
  text (two background review findings closed); `966b57576` intelligent-support column
  inset per board with a stacked phone label pane.
- **trade** — `ba7e53802` records the two-frame dashboard CTA conflict and the hidden
  chart-settings layer so neither reopens; ten stale gaps re-measured and closed in rows.
- **trade-2** — `80c34daf0` Similar tokens phone card full-bleed with 12 rows;
  `9494649fd` Token info square below md; `c87e9ddca` KOL name ramp gated on board.
- **predict** — `f15531930` rewards heading steps 20/24, 24/28, 32/36 per board; filter
  fields take their tracking and 74% placeholder.
- **social** — `05bc6c014` /messages empty pane drawn per state; `c1af17b79` conversation
  search field per board (this commit also carried a peer's staged deletion of the
  retired RiskPanel files; HEAD is consistent and it stands).
- **player-mark** (`modules/skai-gaming`) — `8d7c8d31`, `0542aee3`: every PlayerAvatar on
  blackjack, coinflip, crash, dice, hi-lo, cosmic and vegas fortune passes
  `fallback="mark"` keyed on the wallet, 12 call sites.

### Findings that travel

- **117 of home's 253 frame ids are cited nowhere in `src/`** (scan of every `.ts/.tsx`);
  each row says which. That set is the next home pass's open-first list.
- **Stale gaps read as work nobody needs to do.** Trade re-measured ten carried gaps that
  waves 23 through 40 had already closed; "Show Skai insights" was `hidden` in the frame
  itself and three rows had carried it as a missing toggle.
- **17 game pages draw no avatar at all** in their Community wins User cell (bare handle),
  a separate gap from the initials one the ruling closed.
- **Shared git index.** A lane's `git add` then bare `git commit` sweeps whatever a peer
  has staged. The lane rules now say `git commit --only -- <files>` without staging.

### Decisions only Casey can make (web app)

1. Home 1 with-deposit is being built by wave 23's lane; 26 frames of home's assignment
   are built neither way until it lands. Which 375 board governs the intel hub (base
   14178-151580 vs ALT 14316-248325).
2. Trade: the dashboard CTA word ("AI Analysis" vs "Advanced AI", identical boxes on two
   1440 boards); the News tab's source (a literal build draws the Reports feed twice);
   the 768 pair-search width (680 drawn vs 736 shipped); the layout grip's x.
3. Trade-2: Bridge is a four-step wizard against the frame's one ticket tab; "Swap is a
   wallet only feature"; Trending's CTA Size=Large would make the size preference
   non-monotonic.
4. Predict: what window "All time" scopes with no rewards accrual; whether
   `SKAIConditionalTokens.merge` is live (Frame 655's two pills wait on that, not on a
   missing source).
5. Social: `/:username` mounting CreatorProfileShell drops five tabs on phone and tablet
   and 1440 is a different composition; comment-thread ALT as rail or dialog.

### Hand-offs

- `src/App.tsx` needs `/post/:postId` (13 built-but-unrouted social frames);
  `StreamingTermsGate.tsx` an `lg` rung; `StreamPanelSwitcher` and `DonationPanel` a
  Gift-streamer rail panel with a tier-goal source.
- `PredictPage.tsx` (30 frames) and `PredictCategoryPage.tsx` (16) are wave 23's; the
  Breaking column steps 24 where the page ships 16.
- `OrderEntryPanel.tsx:861` strip 34 against Frame 299's 36; `CandleChart` square top
  corners and the #123F3C hairline below lg; `skai-logo.tsx` has no 36px short preset.
- Red at HEAD, not ours: `predictDashboardFooterGutter.test.ts` (2) after a peer's shell
  split; `winsHeaderRamp.test.tsx` (expects 13 header pages, finds 17) after batch b's
  four slot pages, which is the slots follow-up in batch 2.

## 9. What is next

Batch 2: governance-account, governance-explorer, onboarding, play-hub (with
`PlayGameDetailSections.tsx` withheld), the GameShell gutter lane over
`components/play/shared` and the 19 page-section margins, and the slots follow-up for
the wins-header test and the two sections missing their split ramp.
