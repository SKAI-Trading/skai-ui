# Wave 52 integrity record (2026-09-19)

Casey's direction at 17:5x: "Lets continue and do next wave. This should be a big one and
lets do a few % more. We need to really fill in the gaps. Where is learn at? can we do
streaming? I want to make sure everything is matching figma." Rulings at 18:1x
(AskUserQuestion): build all three Learn items (marketplace, Create-course routed page,
Create-article step; schema to `supabase/_pending/` only) and put Sportsbook in (UI only,
bankroll untouched).

**Result: done 759 → 810 of 3,825 (19.8% → 21.2%), visually verified 337 → 380 (9.9%),
51 claimed statuses pulled down by a visual verdict.** 31 lanes, 245 status rows (76 done,
162 partial, 3 blocked-on-backend, 4 frame-defect), 78 commits across five repos. That is
+1.4 points, not the "few %" asked for: about a third of the rows this wave closed were
measurements of frames nobody had opened (first verdicts, hand-offs, frame defects), which
move the verified number and the next wave, not this one's done count.

## 0. Shape

- Thirty-one file-disjoint lanes over every open frame, twenty running at once and eleven
  dispatched as lanes finished (18:1x to 18:52). CAP 14 frames per brief, 412 rows briefed.
  Learn, Streaming and Sportsbook were build lanes for the first time.
- Rules: `LANE-RULES-0919b.md` (scratchpad `wave52/`). New this wave: lanes append status
  rows as they go and commit after every closed row, so a session-limit kill loses nothing;
  `git -C <absolute>` everywhere because parallel shell calls share one working directory.
- Fences: peer a1 (modules/skai-chain, skai-gaming services/gaming), peer da
  (modules/skai-launch), peer 92 (AuthContext, hooks/auth, components/auth, pages/Landing*).
  Fence prefixes beat every owns entry (`peerHolds` first, `PEER_EXCEPT` list).
- The deploy worktree was locked by peer 92's deploy of 5c86019f5 (live 18:07 build,
  verified 19:18 as `skai-trading@20260919-1807-5c86019f5 dirty:false`) and then by its
  redeploy of a spot-ladder regression (section 4).

## 1. Kill and recovery

- 19:10 the account session limit killed six lanes mid-build: skai-ui-primitives,
  slots-sugar-starbound-vegas, trade-bridge-deposit-chart, wallet-components,
  wallet-shell-pages and home-whales-screens-ai (already reported, re-woken by a peer lane's
  hand-off message). explorer and slots-hooked-untamed survived. Reset 21:30; Casey:
  "continue. reset is complete."
- `inventory-kill.mjs 2026-09-20T00:10:00Z` listed each lane's commits and dirty files; all
  six were resumed by id at 19:15 with that inventory. Because rows and commits were
  appended as lanes went, nothing was lost: every one of the 31 status files existed at
  the kill, and the two dirty files (vegas-fortune `skin.ts`, `HomeTopBar.tsx`) were
  finished and committed by their own lanes.
- A lane's report is not the end of its edits: predict-dashboard and home-whales each
  re-woke on the other's hand-off message and left a primary file dirty after reporting.
  Both were asked by id to commit (11c3a1e71, 4f2d055d1). Rule for the next wave: `git
  status` every REPORTED lane's owns before the fold, not just the running lanes'.

## 2. Lanes

| lane | brief | rows | done | partial | other | commits |
|---|---|---|---|---|---|---|
| learn-pages | 14 | 7 | 3 | 4 | 0 | main 6ba435e9d, 85f3edbf8, 58634fc43, 325b57713, 2c7d01158 |
| streaming | 14 | 3 | 0 | 3 | 0 | main ae3387135, 9bd9cf674 |
| sportsbook | 14 | 8 | 7 | 0 | 1 | main 476b7adb3, 7d2558f64, 8942696d5 |
| home-whales-screens-ai | 14 | 2 | 0 | 2 | 0 | main 82cc84139, 4cbfbd31c, 5f37aa7c5, 4f2d055d1 |
| onboarding-landing | 14 | 14 | 3 | 11 | 0 | skai-landing 2707ea5, 7789131, a1aaa59, 5fbe2c9 |
| trench-trade | 14 | 2 | 0 | 2 | 0 | main 24212c08b |
| predict-dashboard | 14 | 9 | 0 | 9 | 0 | main 662f8e3eb, 9e46bb9aa, 11c3a1e71, f73081c75 |
| governance-dao | 14 | 12 | 0 | 12 | 0 | main fc6504e9a, c50b447bc, f3866a76a, 8abf1c58f |
| explorer | 15 | 4 | 0 | 4 | 0 | main 352b4bdfd, b8127bd4f, 920bfba20 |
| defi-earn | 14 | 5 | 4 | 1 | 0 | main 390387a45, 012d9f01e |
| account-notifications-rewards | 14 | 3 | 2 | 1 | 0 | main 35921995f |
| social-profile-discover | 14 | 7 | 4 | 2 | 1 | main 3bbfc620f |
| social-feed | 14 | 12 | 11 | 1 | 0 | main 30acf96de, 786ca148d |
| social-messages | 14 | 5 | 2 | 3 | 0 | main bc9731397, 53a445152 |
| social-groups-tokens | 14 | 5 | 0 | 5 | 0 | main 7916b8d1b, 32a3a9293 |
| trade-spot | 14 | 4 | 1 | 3 | 0 | main 8099d6610, 5fbdda20f |
| trade-perp | 14 | 5 | 2 | 2 | 1 | main 47d445b82, 4d74b7f51 |
| trench-discover-shell-launch | 14 | 4 | 1 | 2 | 1 | main da770262e |
| predict-detail | 14 | 14 | 0 | 14 | 0 | main e55683a5b, e475b6e3c |
| home-portfolio-feed | 14 | 12 | 0 | 12 | 0 | main 12277c8bf, 0d016920c |
| trade-bridge-deposit-chart | 14 | 7 | 4 | 3 | 0 | main cb123f8d1, 0f65a729a, 298e578bf, 887e978c4, a08e4b3e5 |
| play-hub | 14 | 9 | 0 | 9 | 0 | skai-gaming 5240b870 |
| games-instant | 14 | 4 | 0 | 4 | 0 | skai-gaming 5e47ae9b, b2581abf, 82758fb1 |
| games-table | 14 | 7 | 0 | 7 | 0 | skai-gaming b98dee3f, 86f19bf8, 413f8ff6; main e4857f6d9 |
| slots-hooked-untamed | 14 | 14 | 6 | 8 | 0 | skai-gaming 70442176, d50eb93b, f8f8cb55 |
| slots-sugar-starbound-vegas | 14 | 8 | 5 | 2 | 1 | skai-gaming fff52b1a, c28c03ed, 924e7d0b, 570ef6bb, 22da7cc4 |
| home-sidebar-layout | 14 | 9 | 0 | 9 | 0 | none (every gap is a ruling or another lane's file) |
| wallet-components | 14 | 11 | 6 | 5 | 0 | skai-wallet 5bc6004, ca69f2b, d040f24 |
| wallet-shell-pages | 14 | 16 | 0 | 16 | 0 | skai-wallet 909854c, b8ee77e |
| help-legal-nft-tx | 4+1 | 5 | 3 | 2 | 0 | main 03664c7cc, 96465611b |
| skai-ui-primitives | 2 | 18 | 12 | 4 | 2 | skai-ui ef2c472, 5bfa0d2, e029d73, 0d83a20 |

Rows 245: done 76, partial 162, blocked-on-backend 3, frame-defect 4. Orchestrator fixes
on main: b6ad86750, cb25c95f3 (section 4). Catalog fold: skai-ui 37246fd.

Findings worth carrying (each is in its lane's rows):

- The seven auth-modal hand-off gaps from wave 51 were already built at HEAD; a hand-off
  list must be re-read against the file before it is worked (skai-ui-primitives).
- The phone slot stage was 167px taller than any board (`SlotGame.tsx` pinned 375/667);
  every other box had been pre-shifted to compensate. One `stageFor` source now
  (slots-sugar-starbound-vegas).
- The red `fairnessSubBar375.test.ts` was the stale side: three 375 boards were redrawn on
  a 54-tall frame and Coinflip had the same redraw unnoticed (games-instant).
- `/play/baccarat` existed nowhere; the game hard-wrapped itself in a Dialog. It now has a
  GameShell variant, a page and a route (games-table).
- The 768 swap card has two seam sets (sheet 16/20, embedded 20/24) on the same column; a
  board count is not an argument, ask what each set is a board OF (wallet-components).
- 11720-328046 and 11720-328489 carry the same Frame 631; the $451k Trench chip no longer
  exists in its frame, so a no-mock refusal carried since wave 19 was stale (learn-pages,
  trench-discover-shell-launch).
- The gate promises a prohibited-content list that exists on no board and not in /terms
  (help-legal-nft-tx); the bearish alert band's pill reads "Bullish" in red on the frame
  (trade-bridge-deposit-chart); 3886-15109 is the only board in its family drawing Market
  Cap where its twin draws Oracle (trade-perp, frame-defect).
- Hand-offs outside every owns list this wave: `src/components/home-redesign/AiHome.tsx:386`
  (two 24px ToggleSideButtons below lg, home-portfolio-feed), `SiteFooter.tsx`
  (trade-perp), `PerpPositionsPanel.tsx` seven section frames (trade-perp's file, not
  reached), skai-ui `table.tsx` padding (Orders column x), `engine/layout.ts` cellRect,
  `BootScene.ts` BOOT_FRAME per game, `IntroScene.ts` feature-card branch,
  `playGameArt.ts` fisherman entry, `RoutedGamePage.tsx` + `playPageTemplate.ts` px-3
  gutter, `GamingPage.tsx:115` keyed by "Cosmic Slots", `ProfileSetupForm.tsx` three rows,
  `ChickenGame.tsx` two chicken panels, `WalletShellLanding.tsx` two stale brief entries.

## 3. Decisions for Casey (29 lanes named one or more; three asked at the close)

**Ruled 2026-09-19 21:1x (AskUserQuestion):** (1) Baccarat: re-skin the bet-type selector INTO the frame's 324x42 strip, overriding the shipped felt cells; the four panel frames close on that build. (2) Short logomark: the frame governs, 116x48; the 135x48 anti-cram width is retired. (3) Home sidebar intelligent-support list: three entries with a new Trading destination, ruled as /spot in a follow-up. None of the three is built yet; they open the next wave. The other 26 ride on the shipped defaults named in brackets below.

- **learn-pages**: hero subhead boards read Lean (typo) shipped Learn; apply the pending DDL or leave the panel saying it saves nothing; Step 1 fields still inside CourseCreatorModal.tsx (refactor inline next pass).
- **streaming**: change skai-ui short logomark to 116x48 or keep and accept the narrower mark.
- **sportsbook**: match card handle Volume unavailable [current] / omit / hold; league tag full name [current] / abbreviation table / glyph; 11116-85719 in-play with no vendor MATCH_STATE_UNAVAILABLE [current] / block.
- **home-whales-screens-ai**: wizard page steps non-modal (a) keep [shipped] / (b) modal with inert chrome. RESUMED after predict-dashboard message; 5f37aa7c5 (HomeTopBar mounts the shared PredictNavRow slot=header), 4f2d055d1 (id-sniffing CSS guard dropped now 11c3a1e71 closes the hand-off; test inverted). Unmeasured: on a cold /predict load the dashboard band may paint once before standing down (effect-claimed slot; needs a browser). FINAL 19:25: 4 commits 82cc84139, 4cbfbd31c, 5f37aa7c5, 4f2d055d1; one-paint flash was a false comment, fixed by predict-dashboard f73081c75. Owed: 375 Predict column y=98-100 under 82-tall Header-mobile.
- **onboarding-landing**: 768 tick ruling 24 vs August board 16 [built 24]; completion mark DB badge + tier line removed (keep / restore); counterSuffix string (Traders / Users).
- **trench-trade**: row 3 three sky-blue chips export as icons/action, nothing names their metrics: (a) name them / (b) leave the cell short by three.
- **predict-dashboard**: sort mode with nothing to rank is a live link leaving order unchanged (a) keep, title/aria only [shipped] / (b) restore a visible marker. RESUMED by home-whales message; third commit 11c3a1e71 (dashboard band stands down via usePredictNavSlotHeld; sort controls are links on predictSortHref; predictSortHref no longer special-cases /predict). 683 tests. Two consequences for Casey: a link cannot toggle so the second press that cleared the sort is gone; Dashboard band active tint alien green vs PredictSortTabs sky blue (needs a Dashboard frame measurement).
- **governance-dao**: promo/illustration halves (art / copy-only / drop); gauge empty-state vault copy (ship / frame defect).
- **explorer**: NFT tile 4 Floor volume (a) keep 24H volume in SKAI / (b) define floor volume / (c) wait for a SKAI market; NFT collections table six of eight columns sourceless (a) build with dashes / (b) keep card grid; gas 1440 Mon-Sun heat map no historical source (a) unavailable state / (b) keep the real base-fee line. Closed 19:49 (1h32m).
- **account-notifications-rewards**: Preferences Reset to default (a) reset both stores / (b) users.settings only / (c) unbuilt [current].
- **social-profile-discover**: /discover heading Search social (frame) vs Discover Creators; stat tiles frame set vs shipped four.
- **social-feed**: two-image posts (a) build the frame two-up grid (460, two 226x198.8 on 8) and let compose hold two / (b) keep the single tile [current].
- **social-messages**: 375 thread between-group gap 32 (declared) vs 24 (eight painted deltas).
- **social-groups-tokens**: three tabs vs keep Access Rules + Requests; 768/1440 draw the rail as a right column vs one-column shell.
- **trade-spot**: Enlarge section (name / drawn-disabled / drop); pair-search slot five Gaming vs Trench; /spot hover grip (17,471) vs (20,535).
- **trade-perp**: positions band 258 (4018-40830, 4020-47586) or 273 (3903-22970, 3903-24462) [shipped 273].
- **trench-discover-shell-launch**: Launch > Live 1440 two boards one band (follow 1VH [shipped] / drop / both); the band gear (leave out / new display-settings sheet).
- **predict-detail**: ticket $1.00 cell empty vs explicit unavailable glyph; 10201-106360 give the fixture card a host or retire.
- **home-portfolio-feed**: vault first column (a) restore Vault balance (USD) with the offline dash / (b) keep it out (report 603ded62, no SKAI price).
- **trade-bridge-deposit-chart**: shouty AI chip solid green / muted / conditional; chart 346-inset 544 plot vs full-bleed 375 with 416 [ships]; bearish band pill reads Bullish in red (frame slip, code says Bearish). Killed 19:10, resumed 19:15, closed 19:31.
- **play-hub**: resume-play tile +$200 (68%) (a) sUSD-as-USD / (b) unit-less / (c) withheld [shipped]; Mines cover band per-cut alpha vs one opaque accent [shipped]; Plinko cover 1.156 scale vs object-cover [shipped]; licences row three marks vs one 18-plus tile [shipped].
- **games-instant**: Coinflip expand control hides below md as drawn (a) keep [shipped] / (b) draw it anyway. Peer-dirty (games-table): FortuneWheel/Plinko/Roulette/VideoPoker PageSections.tsx.
- **slots-hooked-untamed**: 11306-15099 info card single 719 column (prints another game figures) / shipped two 485 columns / 719 with our copy; 11416-19412 load-screen ground backdrop art [shipped] / flat #001615.
- **slots-sugar-starbound-vegas**: in-canvas status row 10407:13341 (a) build / (b) leave undrawn [keeps 10407-13179 + 10412-15598 partial]; tablet win board spaceship+streak (a) prop on a win / (b) leave out; promote VEGAS_FORTUNE_TABLET_FRAME into layouts.tablet (a) yes / (b) keep scaled landscape.
- **home-sidebar-layout**: intelligent-support list (a) keep shipped seven / (b) five on 13389:161486 + 14094:56305, drop Screener and InsightX [two witnesses] / (c) three on 5810:111233 etc., needs a Trading destination.
- **wallet-components**: reset-password CTA 46 vs the 44 four boards share; NFT detail as a routed 580 page (6 frames) vs keep the modal; 7806:82649 Auto->Tolerance seam 20 vs sibling 24. Wallet NOT deployed. Killed 19:10, resumed 19:15, closed 19:33.
- **wallet-shell-pages**: 7717:12332 CTA 52 vs family 50; 12/24-word toggle the board hides; warning card inset three boards three values; Scan QR: BC-UR decoder or record superseded by keystore import; 375 modal 354 on 11/10 gutter vs shipped even 10.
- **help-legal-nft-tx**: gate promises a prohibited-content list that exists nowhere (a) write one / (b) drop the sentence / (c) keep link; Terms/Privacy copy (a) frame / (b) live / (c) counsel.
- **skai-ui-primitives**: short logomark frame 116x48 vs shipped 135x48 (anti-cram at skai-logo.tsx:352-355; streaming lane 58.898 was a stale comment, miss is a 19px OVERSHOOT); counterSuffix Users (768+375, shipped) / Traders (1440) / per-breakpoint.

Every shipped default named in brackets above stands until Casey says otherwise, as in
WAVE50 section 5 and WAVE51 section 3.

## 4. Verification

- Interim `typecheck:gate` at 18:59 on the half-finished tree (deliberate, to catch finished
  lanes' errors before the fold): 2 NEW. `PerpPositionsPanel.tsx` kept `OrderHistoryRow`
  after the Orders tab got its own columns (trade-perp 4d74b7f51); `payCurrencyRate.ts`
  imported `coingeckoIds` against `coinGeckoIds.ts` (trench-trade 24212c08b), TS1149 casing
  that Windows resolves and the compiler refuses. Fixed b6ad86750 and cb25c95f3; 27 + 18
  tests green. Peer 92 found the same two independently and left both files alone.
- Final `typecheck:gate` 19:51 to 19:55 on main with every lane reported and skai-ui dist
  rebuilt: **no new type errors, 2,521 known baseline, 77 fewer than baseline** (exit 0).
- skai-ui dist: tsup `--no-clean` exit 0 at 19:26 from the primitives lane's four commits,
  before the final gate.
- skai-wallet tsc: **exit 0** on the combined wallet HEAD b8ee77e (orchestrator run,
  19:33:59 to 19:35:15), matching both wallet lanes' own exit 0. Tests as reported: 83 + 28
  (shell-pages) and 54 (components). The wallet surface is NOT deployed by this wave.
- skai-gaming tsc: **2,002 errors, the same total as every wave 51 run** (one run, 19:26 to 20:48, 82 minutes under 50-plus node processes, HEAD 22da7cc4, clean tree). Errors in the 27 files wave 52 touched: 3, all in BaccaratGame.tsx (TS2554 at 1011, TS2339 trackBetPlaced at 1176, TS2322 at 1676) and all three present in the wave 51 logs at lines 984/1149/1610 before the GameShell refactor moved them. ChickenGame.tsx keeps its 3 pre-existing TS2367. **0 new.**
- Catalog: `row-tree-check.mjs` 0 absent paths, `bp-report.mjs` 0, `pipeline.mjs` exit 0;
  drift 2 live-only, 1 catalog-only (unchanged from the wave 51 harvest, no harvest ran this
  wave).
- Feed: `figma-parity.json` 810 / 3,825 / 380 verified, published to skai.trade at 19:53
  (S3 no-cache + CloudFront invalidation I6WYHY2LQF93ID745JHCTG0FFK) and read back.
- Pushes, all with the one-shot credential helper because gh had drifted to `nativehelper`
  again at 18:5x: skai-ui 37246fd, skai-landing 405fc6e, skai-gaming 22da7cc4 (already on
  origin), skai-wallet b8ee77e (already on origin), main 49395b484 (a merge: origin had
  peer 92's 1a3f4603f and a1d83dad2 pushed from its worktree; the shared main was 58
  ahead and 2 behind, merged clean, no file overlapped a dirty one).
- Peer 92's regression, 19:30, worth every lane knowing: its own deploy's render check (no
  test) caught /spot's ladder at ORDERBOOK UNAVAILABLE with zero requests on the wire.
  `fetchOrderBook` and `subscribeToOrderBook` each built the pair from a bare ticker and
  only the second had been taught that a caller may pass a full pair, so "BTC/sUSD" came
  out of the first as "BTC/sUSD/USDC", resolved to no market, and returned before touching
  the network. Fixed in 7cfdabbbf (one `venuePairFor`, plus a service test asserting the
  pair the caller named reaches the service unchanged). Lesson: when you change what a
  value MEANS, grep for every site that BUILDS it, not just the ones that consume it.
- Release: **skai-trading@20260919-2025-d4b1a801b, dirty:false**, built 2026-09-19T20:35:22-06:00 from the detached clean worktree at d4b1a801b (bump of skai-ui 37246fd, skai-gaming 22da7cc4, skai-wallet b8ee77e, skai-landing 405fc6e over main 49395b484; deploy_main.ps1 steps 1 to 7 logged in scratchpad wave52/deploy-main.log; CloudFront invalidation issued 20:59; live version.json read back at 20:59 with the stamped commit). Peer 92 held the worktree until 20:21 for its own two deploys (1807-5c86019f5, 1942-1a3f4603f); this release followed at 20:22.

## 5. Next

- **Missed the cut, first for the next round:** peer a1 main 4dcb5c7ce (skai-gaming 7bc5f4dc) re-gates rps, bingo and slide behind a reason, because the production keeper answers HTTP 400 "unsupported game type" for all three while their USD bet tab has shown since 2026-09-13 (the deployed keeper is built from the release line, which never carried the skai-chain allowlist). Also peer 92 skai-gaming 996d70f7 (the flame as the trending flag). Neither is in d4b1a801b; the USD tab on those three games is still the pre-existing state after this deploy.

- Closed by peer 92 during the wave, inside its fenced auth path: `SkaiSignInFlow.tsx:422`
  onWalletCancel, the wave 51 landing lane's hand-off (main 10e6e7355). The landing side
  was already wired in skai-landing 5fbe2c9.
- Unreached this wave and still open: the five Predict futures frames (10597-66077, -69175,
  -69990, -70807, -71622); the seven perp section frames on `PerpPositionsPanel.tsx`; the
  375 Predict column at y=98-100 under an 82-tall `Header-mobile`, which moved when the
  header took the row; the bet slip, House vault and whole Sports page (no host owns the
  docked right rail); NFT send 7807-86527; five home-sidebar boards never opened.
- Learn: 3 of 79 done after this wave (marketplace, Create-course route, card fills); Step 1
  fields still inside `CourseCreatorModal.tsx`; the pending DDL at
  `supabase/_pending/2026-09-19_learn_course_faq_and_preferences.sql` is unapplied and the
  panel says so.
- Streaming: 0 of 3 rows closed; the logomark question is a ruling (section 3).
- Sportsbook: 7 of 8 rows closed on UI only; bankroll, vig, odds, settlement and rail
  untouched as ruled.
- `vverify.home.tsv:202-203` still claims the rail never renders at 768 on 6419-47130 /
  6702-24782; the node read says those boards draw no docked rail. Correct at the next
  fold.
- The pending HOLD migration and the retired outcome-market pair in `.env.production` were
  not touched and must not be.
