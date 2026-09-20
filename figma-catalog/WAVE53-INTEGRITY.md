# Wave 53 integrity record (2026-09-19 to 2026-09-20)

Casey at 21:16: "continue", after the wave 52 close and its four rulings (Baccarat strip,
116x48 logomark, three-entry sidebar list with Trading at /spot). Wave 53 is the same shape
as 52 with those rulings at the top of the lanes they touch.

**Result: done 810 -> 845 of 3,825 (21.2% -> 22.1%), visually verified 380 -> 412 (10.8%), 53 claimed statuses pulled down by a visual verdict (51 last wave).** 31 lanes, 269 status rows (46 done, 218 partial, 5 frame-defect), 88 commits across five repos (Skai-Trading, skai-ui, skai-gaming, skai-wallet, skai-landing). The registry moved 40 frames forward (37 partial to done, 1 not-started to done, 2 partial to frame-defect) and lost no title, implFiles or verifiedAt.

## 0. Shape

- Thirty-one file-disjoint lanes, twenty running at once and eleven dispatched as lanes
  finished (21:24 to 21:55). CAP 14 frames per brief, 410 rows briefed. Same lane map as
  wave 52 (`wave53/make-briefs.mjs`, derived by `patch-briefs.mjs`), with a per-lane
  direction block carrying the rulings and every wave 52 hand-off, and
  `tokenDiscoveryService.ts` moved from the trench-trade owns to a peer fence.
- Rules: `LANE-RULES-0920.md`. New this wave: a lane's final report is final and its owns
  must be clean when it sends it; a lane re-woken by a peer message commits the smallest
  thing needed and re-reports with the sha; `git submodule status` prints a describe, not
  a branch; imports by exact casing; CRLF files named.
- Figma: all 51 pages hash-checked unchanged at 21:3x (`harvest.mjs verify-ingest --write`
  stamped 2026-09-20). The denominator stays 3,825.
- Fences (`wave53/peer-files.txt`): the Solana read-path service files (two successive
  peers, 92 then a8, routing every Solana read through the `solana-proxy` edge function),
  auth paths, `scripts/chain/`, `src/contracts/generated/`, `modules/skai-chain/`,
  `modules/skai-gaming/src/services/gaming/`, `modules/skai-launch/`, `modules/skai-offer/`
  and the offer edge functions, `supabase/`, `docs/`. Peer b0's `src/config/contracts.ts`
  was fenced until it committed (e7b091ad4: the casino stack was redeployed tonight,
  SKAICasino proxy 0xF6067409…).

## 1. Kill and recovery

- 21:46 the whole Claude Code process exited (the fourth kill in three days), taking every
  peer session with it. Casey: "continue. reset complete" at 21:47. `inventory-kill.mjs`
  listed each lane's commits and dirty files; all twenty stopped lanes were resumed by id at
  21:48 with that inventory. Four had already reported before the kill; the resumed lanes
  lost nothing because rows and commits were appended as they went. The recovery cost
  about three minutes.
- Five files a peer's interim gate had flagged (IVSBroadcasterV2.tsx, HomeSidebarExpanded.tsx,
  TokenTable.tsx, CourseDetailPage.tsx, futuresFigmaParity.test.tsx) were named in the
  resume messages. Three of the five flags were against intermediate states of files
  mid-edit and were clean at HEAD (streaming, learn, predict); TokenTable's TS2322 and a
  Discover.tsx CreatorRow narrowing were real and fixed by their lanes (56380f4f9,
  b44027b77). A peer's gate on a shared tree mid-wave measures work in flight; only the
  fold gate on the final tree counts.
- Re-woken lanes: predict-dashboard, home-sidebar-layout (three reports), slots-hooked-untamed
  (four), slots-sugar-starbound-vegas, social-profile-discover. Every one ended with clean
  owns and a named sha.

## 2. Lanes

| lane | brief | rows | done | partial | other | none |
|---|---|---|---|---|---|---|
| skai-ui-primitives | 2 | 5 | 1 | 2 | 2 | 01bd680, 9f38a11 |
| games-table | 14 | 5 | 0 | 5 | 0 | 74b19618, a7c486e7 |
| home-sidebar-layout | 14 | 12 | 7 | 4 | 1 | 9faefbfc5, b7c4d9b22, cccfbd055, d3e4938fc, cccfbd055 |
| learn-pages | 14 | 9 | 7 | 2 | 0 | 97b6aeff4, 440a700df, eb58458c3, 8755c0d34, 8e1b86d5e |
| streaming | 14 | 2 | 1 | 1 | 0 | 12230a703, 99065bfa3, 01bd680 |
| sportsbook | 14 | 10 | 5 | 5 | 0 | df635a18, 21787d9c, 1acd6690, 4f7bf6f0 |
| trade-perp | 14 | 7 | 2 | 5 | 0 | 6e933f5bb, ba494a958, 042c543c3 |
| trade-spot | 14 | 7 | 0 | 7 | 0 | b739b8b5f, 8099d6610 |
| trench-discover-shell-launch | 14 | 4 | 1 | 2 | 1 | dc17eb25c |
| trench-trade | 14 | 7 | 0 | 7 | 0 | 72e91008a, 56380f4f9 |
| predict-dashboard | 14 | 7 | 0 | 7 | 0 | 1eec42a04 |
| predict-detail | 14 | 14 | 0 | 14 | 0 | f135acf40, 9559b161d, f22a476d0 |
| play-hub | 14 | 15 | 2 | 13 | 0 | b2141c83, 6a42a794, e11e1487 |
| games-instant | 14 | 14 | 0 | 14 | 0 | 95f06f9e |
| slots-hooked-untamed | 14 | 14 | 0 | 14 | 0 | 73380ffd, 3c1b3e28, 9251c19c, c8d3fade, 77dbe9c6, dcefb8af, 77dbe9c6, e11e1487, dcefb8af, 77dbe9c6, 26aed7d6 |
| slots-sugar-starbound-vegas | 14 | 11 | 0 | 11 | 0 | 9755da1a, fff88d6d, f6bdaa75, dcefb8af |
| home-portfolio-feed | 14 | 15 | 1 | 14 | 0 | da67c35ee, b14144cbe, 6b2803530, 5b76d4e99, 465a95441 |
| home-whales-screens-ai | 14 | 4 | 2 | 1 | 1 | 672da7126, a1614d7c1 |
| social-feed | 14 | 7 | 0 | 7 | 0 | 95391eb03 |
| social-profile-discover | 14 | 3 | 1 | 2 | 0 | d72125628, 3cd98667a, b44027b77 |
| social-groups-tokens | 14 | 7 | 1 | 6 | 0 | 43ae330eb, d383b8268, 0ed8208e4, a012df405 |
| governance-dao | 14 | 14 | 0 | 14 | 0 | c06293c49, 7b8681e17, fa5a3420b, 92913b4ca |
| defi-earn | 14 | 14 | 2 | 12 | 0 | 875d41098, 04102e74c, bed35328a, 07d0ca808 |
| explorer | 14 | 3 | 0 | 3 | 0 | a90524be, 330331c1 |
| account-notifications-rewards | 14 | 4 | 0 | 4 | 0 | 2aa7e58bf, d9a2b271b, bac73942b |
| onboarding-landing | 14 | 14 | 4 | 10 | 0 | eb412fc, b91151d, 60809b0, 2aff762 |
| social-messages | 14 | 6 | 2 | 4 | 0 | 4455aa1b3, 4800f5cd1, ca87efef8 |
| trade-bridge-deposit-chart | 14 | 7 | 4 | 3 | 0 | 982acc81b, 28a4f046a |
| wallet-components | 14 | 11 | 3 | 8 | 0 | 230d4fc, 2bf132e, daafc12 |
| wallet-shell-pages | 14 | 14 | 0 | 14 | 0 | 0c83c7d |
| help-legal-nft-tx | 2 | 3 | 0 | 3 | 0 | ebea24330, e14c49e3f |

Rows: 269. Verdicts: done 46, partial 218, frame-defect 5.

## 3. Decisions for Casey (from the lanes' final reports; shipped defaults in brackets)
- **skai-ui-primitives**: hero counterSuffix Users everywhere vs 1440 Traders. DIST REBUILD NEEDED.
- **games-table**: Chip Value / Number of Bets / Advanced rows (a) leave unbuilt / (b) Chip Value alone as a stake setter.
- **home-sidebar-layout**: intelligent-support ORDER Market intel/Trading/Analysis [shipped, four of five boards] vs 5810:111233 Trading/Analysis/Market intel; collapsed rail bottom cluster 36 pitch vs hold.
- **learn-pages**: draft preview build/drop; category/difficulty split at lg confirm vs expand 5460:87941; articles author submission path build vs keep Publish refused.
- **streaming**: chat selected-row wash 297x50 bleed vs inset 265; chat wrap 281 (five frames) vs 238 hanging indent.
- **sportsbook**: disclosure underline 85 (three boards) vs 91 (two) vs bind; 768 empty slip vault copy ship/drop/rewrite; quick-bet expanded balance host passes / unavailable / hold. UI only, no rail touched.
- **trade-perp**: Funding history 4201-128723 seven-column ledger (a) derived payments / (b) Rate+Time real, Payment dashed / (c) keep chart [shipped].
- **trade-spot**: ticket order-type strip 52 on three 1440 boards vs shipped 40, the unhidden 99x26 control at x=182 (a) rule what the chip carries and build, closing five rows / (b) keep 40, five rows frame-defect.
- **trench-discover-shell-launch**: create-token Advanced options Mayhem/Cash back/Select launchpad [two boards, shipped] vs Mayhem/Tokenized agent/Cash back (one board); filters eight Min/Max pairs vs 13006-155570 two-thumb slider.
- **trench-trade**: Frame 552 three sky-blue chips (a) name the metrics / (b) leave undrawn / (c) drop the row, cell 40 tall. Catalog: 13006-185060/185256/185323 column 3 names AdjustTrenchSettings.tsx but the panel is FiltersPanel.tsx (shell lane).
- **predict-dashboard**: 375 list row candidate name keep 60px label vs drop for the frame 231 bar; parameter panel 10px swatch keep (label x=18) vs frame x=0.
- **predict-detail**: quick-bet sheet execution path / prefill venue modal / drop; $1.00 unit-price cell stays empty (rule); ActivityPanel date clause; 10201-106360 host component.
- **play-hub**: 1VH crops base governs [shipped] / build 8-tighter / retire; +$200 (68%) tile omit [shipped] / POINTS / sUSD; licence marks stay off [shipped] / supply numbers; casino hero one slide [shipped] / two more.
- **games-instant**: 768 board column (a) 422 square centred / (b) 708 full bleed with 468 panel / (c) today full-width; continuous board empty 20-slot history strip draw placeholder vs no-strip-until-history rule. Peer-dirty: src/pages/play/FishermanSlotsPageSections.tsx (slots lane).
- **slots-hooked-untamed**: 11306-15099 info card one 719 column / two 485 [shipped] / 719 own copy; 11606-21938 desktop column 1318 [shipped] / 1200.
- **slots-sugar-starbound-vegas**: phone Home in-canvas status row 10407:13341 draw vs none; 10387-4470 empty idle grid state vs placeholders. Re-woken: dcefb8af (load bar colours off the skin: SlotLoadBarPaint, Starbound default).
- **home-portfolio-feed**: toggle discs keep removed [base boards] vs restore (Home 2 Add-whale boards 13008:125095/125300, reports f7b4b448 + 0699934a); share dialog 960 two-pane vs single column; /leaderboard Share entry point add vs retitle.
- **home-whales-screens-ai**: 13008-112079 keep CTA on all Flow tabs vs hide on the scrolled cut.
- **social-feed**: two-image post grid keep single tile [shipped] / build two 226 tiles on 8. Peer-dirty: Discover.tsx, Streaming.tsx, Discover.shelf.figma.test.tsx (lanes own those).
- **social-profile-discover**: shelf data (a) creator rows, viewers dash [shipped] / (b) live streams / (c) stream-to-token join; 375 results (a) hairlined 36-tall rows + Show more creators / (b) keep pager.
- **social-groups-tokens**: roster four rows as built vs keep Role/Oldest 204px; group row menu three/four rows as built vs crop to two.
- **governance-dao**: Frame 297 vault copy on airdrop + gauge empty state ship/drop/reword; illustration halves commission/keep empty/drop; airdrop stat grid + vesting bar keep vs remove. Hand-offs in defi-earn owns: GaugeWeightsTable.tsx, src/pages/earn/OpportunityDetail.tsx (one line: AddStep to a 506 centred panel closes FOUR frames), src/pages/defi/Earn.tsx.
- **defi-earn**: phone Earn list drop Risk+Fee [built] vs keep; Frame 604 empty left card at 768 ship empty / title into it / single card; empty-gauges 160x34 control label unread (read vs leave out).
- **explorer**: blocks reward per-row 16px kebab build a row menu vs leave undrawn; dashboard Customize drawer (450 wide, 2x2 presets, Reset + Save) build with two live presets and two unavailable vs leave. Owns clean; 3 rows; no vverify lines; validators exit 0. Reported 22:38.
- **account-notifications-rewards**: Current tier = referral tier (server count RPC) / points tier / drop; row kebab menu vs mark; empty-state vault sentence design fixes vs ship.
- **onboarding-landing**: counterSuffix Users vs Traders; onboarding column centred (bug 55642bd9) vs boards absolute y; confirm three socials against report 752e313b four. Hand-offs skai-ui: landing-header.tsx Instagram hidden sm:inline-flex (375 draws two of three), icon gap 24 vs 32, legal gap 16 vs 24; landing-footer.tsx four socials no props; email-verification-modal.tsx OTP box 78 at lg; wallet-choice-modal.tsx fixed 88 row; content.ts externalWallet subtitle existing vs external.
- **social-messages**: quoted-reply mirror LEFT (3 boards) vs RIGHT (10216-182243); 375 thread gap 24 painted vs 32 shipped; group-row Frame 280 14+2+16 vs 14+4+14.
- **trade-bridge-deposit-chart**: 7679-71122 chip muted Green Coal 200 (frame defect) vs solid App/Green high-confidence state; 9432-158544/159649 346 card with 544 plot: later full-bleed 375 governs vs Trench chart own 346 variant. Note: skai-gaming Play.tsx imports missing ./gameRegistry and VegasSlotsGame.tsx missing ../../shared/KeyboardShortcuts (peer mid-rewrite?) — CHECKED 22:20: both files EXIST at HEAD (gameRegistry.ts since 09-19, KeyboardShortcuts.tsx); a transient esbuild dep-scan state, not a peer rewrite.
- **wallet-components**: NFT detail own 580 page (6 frames) vs dialog re-key; reset-password CTA 46 vs 44.
- **wallet-shell-pages**: Scan QR BC-UR decoder vs superseded by keystore import; warning-card inset (16,12)/(14,10)/(12,10); 52 CTA pair dissent or rule; 12/24-word toggle keep vs drop. Not deployed.

Every shipped default named in brackets above stands until Casey says otherwise, as in
WAVE50 section 5, WAVE51 section 3 and WAVE52 section 3.

## 4. Verification

- Final `typecheck:gate` on main with every lane reported and skai-ui dist rebuilt:
  the first run (22:38:34 to 22:41:41, main c00e15e90) found **1 NEW**: `ReferralsSection.tsx` read `profile.username` off a `user_profiles` row (`getProfileByWallet` returns the profile-service `UserProfile`, which carries `display_name` and no handle; the handle lives on `public.users`, which no client role may read by wallet). The rewards lane's 2aa7e58bf drew the referee row as `@username`. Fixed by the orchestrator: the resolved row carries `displayName` from `display_name`, drawn as the name without the at-sign, and the formatted address stands in when there is none. The second run (22:45:13 to 22:50:30): **no new type errors, 2,521 known baseline, 77 fewer than baseline** (exit 0). Peer a8's 15 bug-fix lanes were dispatched into the same tree at about 22:48 and were not yet dirty when it finished.
- skai-ui dist: tsup `--no-clean` exit 0 at 22:20:55 to 22:21:20 from the primitives lane's two commits (01bd680 logomark 116x48, 9f38a11 table density and fixed layout), before the final gate.
- skai-wallet tsc: **exit 0, 0 errors** on the combined wallet HEAD daafc12, clean tree
  (orchestrator run 22:18:04 to 22:18:39), matching both wallet lanes' own exit 0. The
  wallet surface is NOT deployed by this wave.
- skai-gaming tsc: **2,019 errors against the 2,002 baseline, exit 2** (started 22:02:01 when the last gaming lane reported, on gaming HEAD e11e1487, finished 22:48:06: 46 minutes). Every one of the 17 is accounted for, and none survives at HEAD except a test file: six TS2304 in `BootScene.ts` are the sugar lane's load-bar names (`loadBarPaint`, `SlotBarStops`, `hexColor`) read mid-edit, and dcefb8af / 3ad98c7c / 26aed7d6 import them at HEAD; one in `ReferralsSection.tsx` is the gate finding above, fixed; one in `PerpPositionsPanel.tsx` is the `density`/`layout` table props, resolved by the dist rebuild and absent from the main gate; nine in `HomeSidebarExpanded.supportGlyphs.test.tsx` are new TS2345 of the same class as the two already there (`renderIcon` takes an SVG function component and the sidebar lane passes skai-ui `FC<IconProps>` glyphs), a test file the main gate does not compile, handed to the next sidebar lane. The five gaming commits after e11e1487 (dcefb8af, 3ad98c7c, 77dbe9c6, 76535473, 26aed7d6 and a8's 0b50e38d) are unmeasured by this run; BaccaratGame.tsx keeps its three pre-existing errors.
- Catalog: `row-tree-check.mjs` and `bp-report.mjs` exit 0; `pipeline.mjs` exit 0 on the 31 status files (3,823 of 3,825 in-scope frames have a row; drift 2 live-only, 1 catalog-only, unchanged); registry diffed against HEAD field by field before the fold commit b3cdd26.
- Feed: `emit-parity-json.mjs` wrote 845 / 3,825 / 412 (22.1%), measured 2026-09-20T04:39:14Z, harvestedAt 2026-09-20 (the verify-ingest stamp); committed in skai-landing b7860ef and published to S3 with a CloudFront invalidation before the deploy, which republishes it at step 7.5.
- Pushes: main 5092d81fa (the rewards fix, on top of c00e15e90; origin was level, no merge needed; peers' pushes had already carried every lane commit up through the night). skai-wallet daafc12 and skai-landing b7860ef pushed at 22:43; skai-gaming 0b50e38d was already on origin (peer a8's push carried the four gaming lane commits). skai-ui is pushed with this record commit, on top of the fold b3cdd26 and the primitives lane's 01bd680 / 9f38a11.
- Peer items landed during the wave, for the record: the casino stack redeploy
  (SKAICasino proxy 0xF6067409…, `src/config/contracts.ts` e7b091ad4; `src/contracts/
  generated/index.ts` still names the dead 0x5B41…0072/73/74 and is generated); the
  Solana read path routed through `solana-proxy` (c59e7ed03, e44350bbc, f38ac084c,
  c6648c0b9; every Solana holding in the cross-chain portfolio had shown $0.00 because
  Jupiter's price host was retired and the caller did `prices[mint] || 0`); the vault-gate
  fix merged to skai-chain main 8a0b8327 with the fleet on release/2026-09-19-restart at
  f401f44ade54 (validator /status stamps a hand-typed sha f401f44a5f1e that does not exist;
  identify the build by sha256 a496fbae…967c); four launch migrations applied to prod
  without repo files, recorded by the launch session (38c3ae80e), and an offer_sale_seasons
  content drift (applied 11,573 chars vs committed 12,729) routed to the offer session.
- Release: the pointer bump from the clean deploy worktree and `deploy_main.ps1` follow this commit; the release stamp (`version.json`, dirty:false) is recorded by the follow-up commit that also carries Casey's rulings on section 3.

## 5. Next

- Catalog corrections lanes found this wave, to apply at the next harvest or fold: three
  Baccarat panel cuts carry the wrong sizes (9825:21494 is 356x780; 9825:21961 375x429.333
  and 9873:2611 375x749.333, catalogued 347, the 2026-09-10 full-bleed redraw never
  followed); 11130-119104/119125 are the placement toast's 340 cut (BetNotification.tsx),
  not My-bets rows; 11084-62278 is the /play/casino column; 13006-185060/185256/185323
  name AdjustTrenchSettings.tsx but the panel is FiltersPanel.tsx; 3879-38329 (the short
  logomark, done) is absent from registry.json; the Hooked 768 board is 768x1627 not 1840;
  10594-48407 is a quick-bet sheet, not the ticket pinned (three waves carried that);
  7713:17401 is the remove-wallet overlay background, not a home frame; the three
  ProfileSetupForm hand-offs named by the account lane do not exist as rows.
- Unreached and open: the seven perp section frames are done, but Funding history's
  seven-column ledger (4201-128723) is unruled; House vault x3 and the Sportsbook 768 page;
  NFT send is built but the NFT-detail routed page is unruled; the Trench 1440 shell rows
  (13006-134301/135613/138367/141502) and six v1 boards; five home-sidebar boards; the
  streaming boards that do not hang on the logomark.
- Engine slots Hooked still asks for (measured, not built): a stacked-crest drop, a
  recurring 20px TM mark, a 2.5px overlay blur that Graphics cannot draw.
- skai-ui hand-offs from the landing lane: `landing-header.tsx` (Instagram hidden below sm,
  icon gap 24 vs 32, legal gap 16 vs 24), `landing-footer.tsx` (four socials, gap 24 vs
  32), `email-verification-modal.tsx` OTP box 78 at lg, `wallet-choice-modal.tsx` fixed 88
  row, `content.ts` externalWallet subtitle "existing" vs "external".
- Still unruled and carried: the gate's prohibited-content list, Terms/Privacy copy
  (Trade1001x vs Trade500x; frame dates; repeated section numbers), the Learn draft
  preview, the Learn Step 2 DDL (unapplied by ruling).
