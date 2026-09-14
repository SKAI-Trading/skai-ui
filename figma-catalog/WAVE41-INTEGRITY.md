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

## 7. What is next

The games batch: five lanes (`games-instant-a`, `games-instant-b`, `games-cards`,
`games-arcade-a`, `games-arcade-b`) from their lane JSONs in the wave 41 scratchpad,
run five or six at a time and allowed to finish. Every game page changed on 2026-09-10,
so a game `done` row older than that is stale and each lane re-measures all of its
frames. Then the web-app lanes at the same size.
