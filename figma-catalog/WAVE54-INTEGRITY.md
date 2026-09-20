# Wave 54 integrity record (2026-09-20)

Casey at 00:2x: "continue with next wave. Lets do a big multi agent run and lets make sure we
make good progress." Wave 54 is the wave 53 shape (file-disjoint lanes, twenty at once, rolling
refill) run alongside another session's thirty-lane bug-fix fleet in the same tree, with the
three wave 53 rulings at the top of the lanes they touch.

**Result: done 845 -> 929 of 3,825 (22.1% -> 24.3%), visually verified 412 -> 473 (12.4%), 54 claimed statuses pulled down by a visual verdict (53 last wave).** 29 lanes, 359 status rows (95 done, 162 partial, 26 frame-defect, 5 blocked-on-backend, 71 furniture), 72 lane commits across three repos (Skai-Trading, skai-ui, skai-gaming) plus five orchestrator fixes. The registry moved 185 frames (85 partial to done, 24 partial to frame-defect, 5 partial to blocked-on-backend, 70 unknown to furniture, 1 unknown to partial) and lost no title, implFiles or verifiedAt. The 71 furniture calls are Directory bands, Breakpoint rulers, tool-tip instances, bare rectangles and widget nodes classified from the on-disk page lists; the in-scope denominator stays 3,825 because coverage counts furniture by registry kind, so those calls change no percentage.

## 0. Shape

- Twenty-nine lanes dispatched: twenty at 00:34 in one call and nine refills as lanes reported
  (00:48 to 11:48). CAP 14 frames per brief, 393 rows briefed, 560 rows held behind peer fences.
  Two lanes were not dispatched: wallet-components (0 rows once the wallet submodule was fenced)
  and wallet-shell-pages (its only surface is that submodule). Same lane map as wave 53
  (`wave54/make-briefs.mjs`, derived by `patch-briefs.mjs`) with a per-lane direction block
  carrying the rulings and every wave 53 hand-off.
- Rules: `LANE-RULES-0920b.md`. New this wave: a bug-fix fleet shares the tree, so a file dirty
  in `git status` that a lane did not dirty is a peer's; every commit subject ends with the
  frame key(s) so the bug fleet can close its rows against our shas; test files are compiled by
  nothing in the gate, so a touched test gets a scratch-tsconfig check; read a service's return
  type before drawing a field off it.
- Figma: all 51 pages hash-checked equal at 00:3x with the generated verify script
  (`harvest.mjs verify-ingest --write` stamped 2026-09-20). The denominator moves only by the
  furniture calls recorded in section 2.
- Fences (`wave54/peer-files.txt`): the bug fleet's six live lanes and two finished-but-unfolded
  lanes (predict futures, detail, ticket, header actions, category page, rewards, dashboard, nav
  row and its tests; the perp terminal and `perp-v2/`; `HomeSidebarExpanded` and `HomeTopBar`;
  `src/services/gaming/` and the instant games; `modules/skai-wallet` and `modules/skai-landing`,
  where its platform lane was live), the Solana/auth/spot service files, the offer surfaces,
  `supabase/migrations/`, `docs/`. The fleet held its wave C and batch 2 until this wave reported,
  which is why trench, spot, play, home, rewards, account, streaming and social were ours tonight.
  Two of Casey's wave 53 rulings therefore wait for wave 55: the NFT-detail routed page (wallet)
  and the perp Funding-history ledger (`perp-v2`).

## 1. Kill and recovery

- 00:50, sixteen minutes after dispatch, the account session limit ("resets 5:10am") killed
  nineteen of the twenty-one lanes then running; only trade-perp had reported. The peer's fleet
  died on the same wall. Casey: "continue. reset complete" at 11:32. `inventory-kill.mjs` listed
  each lane's commits and dirty files; all twenty unfinished lanes were resumed by id at 11:35
  with that inventory and "commit the dirty work first, then continue". Fifteen commits had
  landed before the kill and thirteen lanes had rows; every dirty file was still on disk and was
  committed by its lane after the resume. The recovery cost about three minutes of orchestration
  and no work.
- The peer's read of the tree after the kill matched the inventory path for path: every dirty
  or untracked file belonged to one of these lanes, none to the fleet.

## 2. Lanes

| lane | brief | rows | done | partial | other | none |
|---|---|---|---|---|---|---|
| governance-dao | 14 | 16 | 0 | 16 | 0 | 6bcbe8162, 629db59a5, 6821f304e |
| home-portfolio-feed | 14 | 8 | 0 | 8 | 0 | b83948c1e, ffc6ec8fe |
| trade-spot | 14 | 9 | 7 | 2 | 0 | aec71c48e, c797ddf51, dfb9ae524 |
| slots-sugar-starbound-vegas | 14 | 7 | 5 | 2 | 0 | 09e37a78, e0fa8a4a |
| play-hub | 14 | 8 | 0 | 8 | 0 | ef328790, c0e0d7a5, b2141c83 |
| trench-discover-shell-launch | 14 | 17 | 1 | 10 | 6 | 0c429b403, b4415c8a7 |
| trench-trade | 14 | 8 | 1 | 6 | 1 | c89fa245c, 85638ba19 |
| home-whales-screens-ai | 14 | 12 | 6 | 6 | 0 | fe5d61faa, c46b5910e |
| social-profile-discover | 14 | 14 | 10 | 2 | 2 | 17bda849a, 9f850ed0a |
| slots-hooked-untamed | 14 | 14 | 2 | 12 | 0 | f0a80ead, ffafad67, b9094648, e0fa8a4a, 1fa342a4, f0a80ead, ffafad67, b9094648, 1fa342a4 |
| account-notifications-rewards | 14 | 5 | 2 | 0 | 3 | 612baaa64, 824ff7ac5, 8d466847d, f93c3e01c |
| sportsbook | 14 | 11 | 7 | 2 | 2 | 66d75ff2, 5e0b26c6, 40fbad1d |
| explorer | 14 | 3 | 0 | 3 | 0 | 75ae42b4b, 4279a6836, 77cb4db64 |
| defi-earn | 14 | 16 | 0 | 16 | 0 | bed35328a, dab197f8a, fa8eabd15, 03c096642, aff2c1b48 |
| predict-detail | 14 | 11 | 0 | 11 | 0 | dc9b423c8, ba2378202 |
| games-table | 14 | 8 | 4 | 1 | 3 | 62bc60c8, 316f6a4f |
| streaming | 14 | 6 | 4 | 2 | 0 | 11e80c563, cf72951ff, 695ad2f54, 0d3ce240c |
| trade-perp | 14 | 51 | 0 | 4 | 47 | none |
| social-feed | 14 | 9 | 6 | 1 | 2 | 7e1aa2f18, 24c94f637 |
| social-groups-tokens | 14 | 6 | 4 | 2 | 0 | 8e0a0f002, 0de31ba08 |
| predict-dashboard | 14 | 14 | 0 | 14 | 0 | 64c9d5277, ba2378202 |
| trade-bridge-deposit-chart | 14 | 13 | 3 | 0 | 10 | 90b1c6d80, 29491cbec, 3d9c21da6 |
| games-instant | 14 | 14 | 0 | 14 | 0 | 117f7824, 62bc60c8 |
| learn-pages | 14 | 14 | 13 | 1 | 0 | 34cbadba2, ea4f845e3, fc3b8f9e0 |
| social-messages | 14 | 9 | 6 | 3 | 0 | d810d8bf9, 3c05cba36 |
| home-sidebar-layout | 14 | 14 | 0 | 14 | 0 | 89cc5643a |
| skai-ui-primitives | 2 | 11 | 8 | 1 | 2 | a8a6669, 9f38a11, ca6fb7e, e85e9dc, e2b0157, bb0e297, 25fcced |
| help-legal-nft-tx | 2 | 4 | 4 | 0 | 0 | 2805a01a4, d8aa9f85d |
| onboarding-landing | 14 | 27 | 2 | 1 | 24 | none |

Rows: 359. Verdicts: partial 162, done 95, frame-defect 26, blocked-on-backend 5, furniture 71.

## 3. Decisions for Casey (from the lanes' final reports; shipped defaults in brackets)
- **governance-dao**: (1) airdrop CTA label page label on 140/160 floor [shipped] / read frame / fixed 160; (2) vault copy card fill #523410 untokened glass panel [shipped] / new token / hex; (3) airdrop 375 band illustration-only keep copy card [shipped] / hide below md / commission art; (4) gauge empty path drops epoch badge keep [shipped] / bare badge. Farmers docblock item already fixed at HEAD. 16 rows; 13 vverify.governance lines incl. two correcting wave 53 match -> partial on 11405-101828/103640; tests 52/23/9; 0 type errors in four test files; validators exit 0; owns clean; 7 reads. Reported 11:45 (after resume).
- **home-portfolio-feed**: (1) Share dialog at 1440 960 two-pane [shipped] / 738 single column; (2) stacked cuts card block below controls [shipped] / above; (3) networth share one dialog two modes / separate / wait for a source; (4) /leaderboard Share add entry point / retitle.
- **trade-spot**: (1) the 99x26 slot is at OPACITY 0 on all three boards and reads Market (fact the ruling lacked): keep explicit unavailable as built / draw at opacity 0 / wire as order-type select; (2) chart settings Trade history + Est. Liq. rows draw inert (needs ChartSettingsPanel.orderDisplay.test.tsx:128-145 peer flip) / keep omitted; (3) pair-search slot five Gaming (frame) / Trench (name); (4) order-book Enlarge inert / define; (5) tick picker frame 0.01/0.1/1 / keep GROUPING_PRESETS.
- **slots-sugar-starbound-vegas**: status row on phone/tablet Home draw / none [shipped]; menu rows frame five (Sound/Music/Expand/Information/Home) / keep drawer [shipped] / frame rows with rules behind Information; 10387-4470 idle grid draw / placeholders [shipped]. Open Hooked engine hand-offs not reached: TM mark + crest shadow, volatility pill, removal-effect texture. 7 rows; 5 vverify.cosmic-slots lines; validators exit 0; owns clean; 6 reads. Reported 11:44 (after resume). | 11:46 woken by Hooked lane confirmation; nothing touched, report stands.
- **play-hub**: Trending 768 first menu Popular [shipped] / All games; 1440 catalogue tiles hidden meta rows keep [shipped] / suppress at lg.
- **trench-discover-shell-launch**: left float (138367/141502) build docked 448 Live-trades column / leave [shipped], columns scroll at 432 [base] vs shrink to 286 [ALT]; filters footer single save CTA / Reset + Save [shipped]; 155570 Min/Max pairs [shipped] / two-thumb slider / retire; 134301 764/704/14 [shipped] / 734/674/44; Discover/LIVE two nameless round buttons name / leave [shipped].
- **trench-trade**: (1) filters footer single Apply / Reset + Apply [shipped]; (2) display settings 1440 section gap 24 [shipped, 155671 frame-defect] / 32; (3) v1 token header 9264-93524 at 375 current family [shipped] / build 346 card / retire v1; (4) instant-trade one-row cuts eight presets per side [shipped] / four.
- **home-whales-screens-ai**: (1) select-whale footer Enter an address manually keep [shipped] / drop; (2) 375 Whales empty block Home 2 board (10/14 hint, 20 seam, 150x32 CTA) / Trench board as shipped; (3) 768 distributing rows 12 inset keep [shipped] / revert to 8. Notes: three test files red at 20 s under the 11-file run, pass alone (cold import). 12 rows; 6 vverify.home-2; validators exit 0; owns clean; 12 reads. Reported 11:56.
- **social-profile-discover**: story composer build now as refused-everything surface mounted by social-feed / wait for the story rail.
- **slots-hooked-untamed**: (a) 11306-15099 two 485 [shipped] / one 719; (b) 11606-21938 1318 [shipped] / 1200; (c) ALT load-screen ground backdrop [shipped] / flat #001615.
- **account-notifications-rewards**: (1) referrals empty vault sentence design fixes [default] / ship / reword; (2) 2FA SMS half disabled unavailable segment [shipped] / hide / build SMS rail; (3) backup-codes preview notice dropped [shipped] / restore. 5 rows; 5 vverify.governance lines; tests 54/7 files; scratch tsc 0 in own files; owns clean; 9 Figma reads. Reported 11:44 (after resume).
- **sportsbook**: underline 85 [shipped] / 91 / design fixes; quick-bet notice stake $ for USD-pegged, ticker otherwise [shipped] / always ticker. UI only, no rail touched. 11 rows; 7 vverify.play match lines; parity suite 44/44; validators exit 0; owns clean. Reported 11:46 (after resume).
- **explorer**: (1) per-row kebab build row menu / disabled glyph / keep undrawn; (2) Transactions band copy frame More than N / About N [shipped]; (3) Analytics Average block size tile prints ms on the frame: design fixes / keep bytes [shipped]. NO-MOCK FLAGS (fold check): useValidators.ts docblock says it returns a synthesized fallback when the RPC is unreachable; TokenListPage.tsx:565 falls back to a static table price t.price when no live quote (explorer owns, not reached). 3 rows; 3 vverify.governance; validators exit 0; owns clean. Reported 11:51.
- **defi-earn**: (1) governance hero/stat row/badges stay removed [shipped] / restore stat row / restore all; (2) Frame 405 controls reserve empty [shipped] / design names / drop; (3) Frame 604 inset landing 24/153 [shipped] / About 16/137; (4) phone bands empty [shipped] / collapse / show copy. 16 rows; 9 vverify.governance; 107 oracle cases pass; validators exit 0; owns clean. Reported 11:47.
- **predict-detail**: (1) Activity second trigger order control only [shipped] / restore min-amount filter; (2) for-<date> clause wire through MarketModules [built, awaiting wire] / drop; (3) pinned strip on sample market 2 (10594-60147) Frame 423 [shipped] / two-line question + three icons / mix; (4) 10201-106360 selected sports card: SportsLiveEventCard governs [shipped] / build 343x190 card family. 10654-200390 title says 1440 over a 768 node (design defect). 11 rows; 3 vverify.predict lines; tests 76/76; scratch tsc clean in own files; owns clean. Reported 11:41 (after resume). | RE-WOKEN: committed ba2378202 (UnifiedMarketCard 768 button row 46 + two tests) per predict-dashboard; attribution resolved.
- **games-table**: (1) Baccarat Chip Value: the 375 PAGE panel 9873:584 draws it on every cut, 1-1T chips: stay unbuilt / build as stake setter; (2) Chicken counters infinity glyph never / build with cap; (3) Blackjack 768 9003:118852 governs [built] / 9003:119356 422; (4) Chicken Potential Profit dollar slot keep no-fiat / extend 09-06 ruling. Baccarat 375 felt constants fitted to the retired 323 board; refit anchors in the 9799-18183 row. 8 rows; 3 vverify.chicken + 1 vverify.blackjack; validators exit 0; owns clean. Reported 11:48.
- **streaming**: (1) browse card top-right chip session P&L [shipped] / social-token market cap / drop; (2) OBS URL-row chevron unavailable slot [shipped] / rule an action / drop; (3) pop-out rail switches to viewers [shipped] / keep chat docked too.
- **trade-perp**: TP 2 tier (a) disabled unavailable row / (b) omit / (c) design removes. Funding ledger still waits on perp-v2. 51 rows; validators exit 0; seat 5 reads. Reported 00:47.
- **social-feed**: composer character counter keep [shipped] / drop; group row menu three/four rows [shipped] / crop to two.
- **social-groups-tokens**: (1) Created list rows draw Token req. with mark + unavailable left / keep redraw Description + Created [shipped]; (2) group page tabs frame three / five [shipped]; (3) 768/1440 rail right column / one column [shipped].
- **predict-dashboard**: (1) phone hero below the board [shipped 10509:18308] / above at 343x406; (2) FAQ closed row at 375 54 [shipped, 3 boards] / 40 (3 boards); (3) footer below lg keep SiteFooter [shipped] / hide. 14 rows; 8 vverify.predict; validators exit 0; owns clean. Reported 11:54.
- **trade-bridge-deposit-chart**: (1) bridge Other alternatives (nine boards) frame defect design drops it [rowed] / explicit unavailable / restore Across/Stargate link-outs; (2) error CTA label at 375/768 Insufficient funds to bridge everywhere [ships] / narrow boards Bridge SOL in red. Timeframe tablet corner 9050:213899 unread, carries 12. 13 rows; 3 vverify.trade + 5 vverify.trade-2; tests 107 + 70; scratch tsc clean; validators exit 0; owns clean. Reported 12:11 (after second resume).
- **games-instant**: 1VH crops 11100-67984/68399 carry a wallet body + centred footer the base lacks: base governs [shipped] / build footer at 375 / frame-defect. Tests 354/355 (gameInfoCardRungs.test.ts red pre-existing: slots page sections). 14 rows; 7 vverify.play; validators exit 0; owns clean. Reported 12:01 (after second resume).
- **learn-pages**: (1) 375 marketplace shelves base board grid as built / revert to the 1VH crop rail; (2) shelf page rows at 768 rails of four with header actions as drawn / plain two-up grid; (3) preview-dropped + DDL-unapplied rows marked done on the rulings: keep / hold partial until reversed; (4) 1440 Learn column 1144 by ruling as built / the board 1318. Noted: Frame 350 top inset 32 at 768 / 24 at 375 on boards vs PanelCard 16/12 (wave 53 done rows); catalogue files the two shelf-page boards under lessonsData.ts (wrong). 14 rows; 6 vverify.governance; 18/18 tests; test files type-check clean; validators exit 0; 10 reads; owns clean. Reported 12:10 (after second resume).
- **social-messages**: (1) Groups second chip one chip [shipped] / name what 33 counts; (2) 768 Groups pitch hairline on 8 [shipped, 3 boards] / 4 no rule at md; (3) 36px controls on requests band/head recorded [shipped] / explicit unavailable / wire to thread header menu. 9 rows; 6 vverify.social; 51 tests; scratch tsc clean; validators exit 0; owns clean; 7 reads. Reported 12:09 (after second resume).
- **home-sidebar-layout**: (1) header divider none 92 tall per base 3294:24639 [shipped] / 8575:81619 line 96; (2) row 2 alignment centred per predict screens [shipped] / left per 3294:24639; (3) sidebar token counts no pill [shipped] / explicit unavailable pill; (4) soccer league rows unbuilt [shipped] / eight unavailable rows.
- **help-legal-nft-tx**: (1) Terms/Privacy copy vs board (dates, Trade1001x, repeated headings 4/11, omitted GDPR/arbitration clauses) board / live / counsel; (2) 375 legal footer gap above the row keep shipped 104 / name a figure / design fixes overlap.

Every shipped default named in brackets above stands until Casey says otherwise, as in
WAVE50 section 5, WAVE51 section 3, WAVE52 section 3 and WAVE53 section 3.

## 4. Verification

- Final `typecheck:gate` on main with every lane reported and skai-ui dist rebuilt: the first run (12:20:14 to 12:21:37, main d8aa9f85d) found **1 NEW**: the messages lane's new oracle `MessageRequestsSurface.messageRun.figma.test.tsx` imported `screen` without reading it (TS6133; the gate does compile that test path). Fixed by the orchestrator, d75c0ade8, 6 tests green. The second run (12:24:45 to 12:26:36, main d75c0ade8): **no new type errors, 2,521 known baseline, 77 fewer than baseline** (exit 0). The two gaming-typecheck source errors (predict modules barrel 4d44423ab, feed PostCard 9f848c092) were fixed before this run.
- skai-ui dist: tsup `--no-clean` exit 0 at 12:04:58 to 12:05:16 on skai-ui bb0e297, after the primitives lane's four commits (ca6fb7e content.ts, e85e9dc landing-header, e2b0157 landing-footer, bb0e297 switch), before the final gate.
- skai-wallet: not touched this wave (the submodule was a peer's; no wallet lane ran), so no
  wallet tsc and no wallet deploy.
- skai-gaming tsc: **2,005 errors against the 2,002 baseline, exit 2** (started 11:49:22 on gaming HEAD 1fa342a4 when five of the six gaming lanes had reported, ended 12:16:02, 27 minutes; it is a local process and survived the 11:58 kill). Against wave 53's 2,019 every predicted delta closed (the sidebar glyph test 11 to 0, ReferralsSection 1 to 0, PerpPositionsPanel 1 to 0, BootScene 6 to 0). Five new: `src/components/predict/modules/index.ts` re-exported the min-amount options the Activity module no longer draws (predict-detail; fixed by the orchestrator, 4d44423ab) and `src/components/social/feed/PostCard.tsx` narrowed `Offline | FeedCommentPreview[]` through an intermediate variable (social-feed; fixed inline, 9f848c092; 170 tests green); the other three are the bug fleet's test files (`openOrdersView.test.tsx` TS2322, `gamingApprovalService.burst.test.ts` TS2556 x2, both fenced) and were handed back. Two gaming files changed after the run started (`GameDetailPage.tsx`, `PlayGameDetailSections.tsx`, games-instant 117f7824) and are unmeasured by it; BaccaratGame.tsx keeps its three pre-existing errors.
- Catalog: `row-tree-check.mjs` and `bp-report.mjs` exit 0; `pipeline.mjs` exit 0 on the 29 status files (3,823 of 3,825 in-scope frames have a row; drift 2 live-only, 1 catalog-only, unchanged); registry diffed against HEAD field by field before the fold commit skai-ui 87ced80.
- Feed: `emit-parity-json.mjs` wrote 929 / 3,825 / 473 (24.3%), measured 2026-09-20T18:21:14Z, harvestedAt 2026-09-20 (the verify-ingest stamp); committed in skai-landing 3ac570f and published to S3 with a CloudFront invalidation before the deploy, which republishes it at step 7.5.
- Pushes: main d75c0ade8 (80 commits over origin: the 72 lane commits, the five orchestrator fixes, the bug fleet's batch-1 commits including its 291cfcfbf gate fixes, and peer 57's offer curve). skai-gaming 0311aee1 (16 commits including the fleet's burst-test fix). skai-landing 3ac570f (the feed only; the landing submodule was a peer's this wave). skai-ui is pushed with this record commit, on top of the fold 87ced80 and the primitives lane's four commits.
- Peer items landed or found during the wave, for the record: the bug fleet's CSP finding (the
  app's CSP existed in three drifted copies and the repo copies were the stale ones, missing the
  five Solana origins live since 2026-09-19; fixed in `scripts/aws/skai-prod-csp.js` with
  `tests/security/landingCspHosts.test.ts`, which fails on any host live-but-absent-from-source;
  read it before any CloudFront or CSP change); the fleet's platform lane's finding that
  `/trade/perps` cannot open a position at all (the ticket calls `openTrade`, `closeTrade` and
  `updateTpSl`, none of which exists in the live implementation, which carries `openPosition`
  and `liquidate`; market orders revert, which is why the engine reads PositionCount 0 beside a
  book of 1,000 trades; perp UI measures and writes up, it does not wire); and the predict
  block-gap correction (the fleet's `predictMarketsBlockGap` test pinned 24 where the boards
  join at 16 below 1440; the fleet takes pin and tokens in one commit, crediting the
  predict-dashboard lane's measurement).
- Release: pointer bump 4e111f8ed from the clean deploy worktree (skai-ui 8d3492c, skai-gaming 0311aee1, skai-landing 3ac570f, on the gated main d75c0ade8); `deploy_main.ps1` started 12:29 and `https://app.skai.trade/version.json` reads **skai-trading@20260920-1230-4e111f8ed dirty:false commit:4e111f8ed9c9615eb42275687ac40a8d563bdc3d**. Live before it: ec05bd92b (wave 53).

## 5. Next

- Catalog corrections lanes found this wave, to apply at the next harvest or fold: 13006-159412's
  column 3 named AdjustTrenchSettings.tsx for twenty waves but the board draws no panel
  (TokenCard.tsx); 13006-185256/185323 are FiltersPanel.tsx; 11442-169953 is the compose dialog,
  not a drafts list; 11130-119146 is the placement toast's single 340 cut (BetNotification.tsx,
  now recorded); four /leaderboard boards sat at partial for two waves because a wave 52 vverify
  line used the word `done`, which `apply-verify.mjs` rejects (corrected to `match`); wave 53's
  `match` on 11405-101828/103640 was container-only (corrected to partial); 10852:361479 is the
  870+432 two-column frame, not the 506 panel (bed35328a had applied the save board's 506 to
  every category, now reverted); every 768 slip body pads 90 at the bottom where a wave 53 done
  row recorded 16; the perp-v2 docblock at :2805 names 7890-130857 as drawn when it is not; the
  brief goal lines for slots (`fishermanSlotsPageContent.ts:153`) and play-hub
  (`playPageTemplate.ts` px-3) were stale.
- Rulings still owed from wave 53, blocked by fences this wave: the wallet NFT-detail routed page
  (modules/skai-wallet) and the perp Funding-history ledger (`perp-v2/`, and see the dead-rail
  finding above before wiring anything there).
- Unreached and open: the House vault boards and the whole-page Sportsbook boards (no host owns
  the docked rail); the story composer (no upload category, table or write rail); the composer
  with-image state (`post-image` is not a server AssetCategory); Trench v1 boards; the six
  Private-key frames (KeyExportCard.tsx, account lane, not reached); the four Baccarat panel cuts
  (held by the Chip Value default); the TP 2 / Gain tier on the update-position modal (perp-v2,
  peer); the update to `RoutedGamePage.tsx:119` / `DartsPage.tsx:113` (mb-4 md:mb-2).
- Engine slots Hooked still asks for (measured, not built): TM mark and stacked-crest drop on the
  boot art, the volatility pill's unavailable state, `removalEffect`, the never-queued board
  export at `BootScene.ts:133`. The Starbound streak fix removed engine-constant streaks from all
  five games (deliberate: no facts file records one for the other four).
- No-mock flags from the explorer lane, checked at the fold: `TokenListPage.tsx:565`'s
  `t.price` fallback is inert for every token but sUSD, whose table price is the 1.0 peg of
  SKAI's own stablecoin (it displays as USD by the canonical mapping), so no fabricated market
  figure reaches the page. `useValidators.ts:220` is a real gap of the retired-mirror kind: when
  the indexer is unreachable it returns an honest EMPTY set and the page renders "no validators
  indexed yet", which is a confident zero where the truth is "unreachable"; its docblock still
  says "synthesized fallback", which the code no longer does. Owed to the explorer lane in wave
  55: an `unavailable` flag on `ValidatorsResult` and the offline indicator on the validators
  page, and the docblock reworded. Named here 2026-09-20 rather than fixed, because the fix
  crosses into the page's consumers and belongs to a lane with a row.
- skai-ui hand-offs: `switch.tsx` now carries the 40.59x24 variant the trade and social boards
  draw (opt-in `size="compact"` / `variant="toggle"`, bb0e297; consumers adopt it next wave);
  `GroupFormSheet.figma.test.tsx:243/254` asserts "Main rules"
  where the frame reads "Member rules (optional)"; `SocialRightMenu.tsx` leading back control.
- Still unruled and carried: the gate's prohibited-content list, Terms/Privacy copy, the Learn
  draft preview, the Learn Step 2 DDL (unapplied by ruling), the 99x26 spot control (which the
  boards draw at opacity 0 reading "Market", a fact the 23:3x ruling lacked).
