# Wave 50 integrity record (2026-09-17 22:2x to 2026-09-18 02:xx Denver; UTC 2026-09-18)

Casey: "Send a group of 25+ agents to attack the figma catalog integration. Lets move the
% up and update /status." Wave 50 is that group: thirty lanes over every live section,
each a file-disjoint slice built by longest-prefix ownership of the paths its rows name,
at most sixteen rows a lane (475 rows dispatched; 173 rows on paths a peer session held
were kept back). The harness runs twenty subagents at once, so twenty launched at 22:2x
and ten were dispatched one-for-one as lanes finished, the last two (both wallet lanes)
at 01:2x. The last report arrived at 01:48. No Figma refresh opened this wave: the wave
49 harvest of 2026-09-17 20:0x is still current (3,824 in-scope genuine frames).

## 0. The kill and the resume

At about 23:5x the account's session limit (429, "resets 12:20am") killed all twenty
running lanes at once, before any had committed or written a status file; eleven held
uncommitted edits. Recovery was by inventory, not by memory: for every lane,
`git status --short` over its owns list and `git log --since=<ISO>` over the same paths,
then a resume by agent id carrying that inventory (`inventory-kill1.json` in the session
scratchpad). The Figma MCP tools were renamed during the outage (`mcp__claude_ai_Figma__*`);
every resumed and newly dispatched lane was told the new names. No edit was lost and no
lane rebuilt what it had already built. The cost was the second half of two lanes' Figma
budgets (governance-measure-b and trench-discover-shell-launch reached six or seven of
sixteen). The orchestrator's own context was compacted once after the resume; the ten
reports that had already arrived were rebuilt from the session transcript
(`extract-reports.mjs`), not from memory.

## 1. The lanes

| lane | rows | done | partial | blocked | frame-defect | other | commits |
|---|---:|---:|---:|---:|---:|---:|---|
| account-notifications-rewards | 10 | 0 | 10 | 0 | 0 | 0 | 1536edae9, ffd2e1f7f, 19ecdce01, 15ccaf39b |
| defi-earn | 12 | 0 | 12 | 0 | 0 | 0 | 9bfbaf4c9, c4ce7070f, 310eb92b9 |
| explorer | 15 | 0 | 15 | 0 | 0 | 0 | e649f4b9d, 54ef0b6d6, bc4d3a6ec, 590238b09, 220962a35, 1c3fe8b23, a6b29bc43 |
| games-instant | 12 | 2 | 10 | 0 | 0 | 0 | skai-gaming f6141abf, c70edd79 |
| games-table | 9 | 2 | 7 | 0 | 0 | 0 | skai-gaming e22e84a8, 4a27e593, 57746ebe, bbda4f09, 6a701adc, ac72860b |
| governance-dao | 12 | 0 | 12 | 0 | 0 | 0 | aa6eb108b, 63d181351, 3e348f435 |
| governance-measure-a | 16 | 0 | 15 | 0 | 0 | 1 not-started | none (empty owns; verdicts and hand-offs only) |
| governance-measure-b | 7 | 0 | 6 | 0 | 0 | 1 not-started | none (empty owns; verdicts and hand-offs only) |
| home-portfolio-feed | 16 | 0 | 16 | 0 | 0 | 0 | dbe9cf133, bd7e05e26 |
| home-sidebar-layout | 16 | 9 | 7 | 0 | 0 | 0 | 5b84ea069, 6e780ee64, 55ae41f26 |
| home-whales-screens-ai | 7 | 2 | 5 | 0 | 0 | 0 | 533905ee9, 2f2473ac9, d02857b0b, 25432d2fc |
| learn-help-legal | 10 | 0 | 10 | 0 | 0 | 0 | a53eac1bd, dba2a7473, 5ed4ecf25 |
| onboarding-landing | 16 | 2 | 14 | 0 | 0 | 0 | skai-landing 1d5c43f |
| play-hub | 16 | 9 | 7 | 0 | 0 | 0 | skai-gaming 2c50d919 |
| predict-dashboard | 5 | 2 | 3 | 0 | 0 | 0 | none (no number missed) |
| predict-detail | 16 | 2 | 10 | 4 | 0 | 0 | 1bbe996cb |
| skai-ui-primitives | 7 | 6 | 0 | 0 | 1 | 0 | skai-ui 73b3495, d589754 |
| slots-hooked-untamed | 16 | 10 | 6 | 0 | 0 | 0 | skai-gaming 135925f6, 299c7ecb |
| slots-sugar-starbound-vegas | 16 | 9 | 7 | 0 | 0 | 0 | skai-gaming 9f7bb311, 9b0f82ca, e5ff1465, 444ed6d0, 07b9e7a5, 32e543b7 |
| social-feed | 14 | 0 | 14 | 0 | 0 | 0 | 950fbbd85 |
| social-groups-tokens | 8 | 4 | 4 | 0 | 0 | 0 | f524c74c7, 31631cc2f |
| social-messages | 10 | 5 | 5 | 0 | 0 | 0 | b23585000, ff21fe3bf, 0270c0b1f, f386e1bfe, 8a24f8f4d |
| social-profile-discover | 7 | 0 | 7 | 0 | 0 | 0 | 30c974490, 72c3d35de, 065c6e119 |
| trade-bridge-deposit-chart | 16 | 7 | 9 | 0 | 0 | 0 | e0c1079f3, 7d72842e8, e5a670e34, 168007ce0, 9c6621018 |
| trade-perp | 8 | 2 | 6 | 0 | 0 | 0 | 35f77ae2d, f7d16646a |
| trade-spot | 11 | 3 | 8 | 0 | 0 | 0 | feb79b999, a8c066b2d |
| trench-discover-shell-launch | 6 | 1 | 5 | 0 | 0 | 0 | a8008fb91, 41ee64d83, 2d001794b |
| trench-trade | 8 | 1 | 7 | 0 | 0 | 0 | 85be63d9f, 66fdc55f4 |
| wallet-components | 14 | 9 | 5 | 0 | 0 | 0 | skai-wallet a2758ac, c2d47b3, 67b6014 |
| wallet-shell-pages | 9 | 0 | 7 | 0 | 0 | 2 furniture | skai-wallet a635f70 |
| **total** | **345** | **87** | **249** | **4** | **1** | **4** | 59 on main, 17 skai-gaming, 4 skai-wallet, 2 skai-ui, 1 skai-landing |

Rows are frames a lane REACHED (measured or built); frames it did not reach keep their
previous row. Unstamped commits are on the superproject `main`. The two governance-measure
lanes were dispatched with an empty owns array by construction (their rows' files all fell
to other lanes under longest-prefix ownership) and so wrote verdicts and hand-offs and no
code; every one of their rows names the file and the exact change.

| measure | before (wave 49 close) | after | delta |
|---|---:|---:|---:|
| in-scope genuine frames | 3,824 | 3,824 | 0 |
| `done` | 686 (17.9%) | 749 (19.6%) | +63 |
| `done` and visually verified | 269 (7.0%) | 327 (8.6%) | +58 |
| claimed statuses pulled down by a visual verdict | 37 | 44 | +7 |
| whole-frame lines added to the vverify files | 36 | 112 | across 14 section files; `vverify.cover-images.tsv` is new |

## 2. Rule-decided calls this wave (Casey can override; each row names the rule)

Casey's three rulings of 2026-09-17 21:5x were built as ruled: the casino "Instant
payouts" card ships the frame's own sentence (skai-gaming 2c50d919; the blackjack suite
that pinned the overruled sentence was corrected in 6a701adc); the Trench Customize-rows
panel gained its columns, three with a real source (X handle, Socials, Dex paid) and
eighteen as disabled tags each stating its own missing source (66fdc55f4; a test pins
eighteen distinct sentences); the alert picker keeps Blip / Chime / Ping. Base governs over
ALT: Table ALT 10219-182536 measures value for value and its column order stays the base's.
The 44px touch floor yielded to the frame wherever a board draws a smaller control
(`no-min-size` on sub-44 pills, a 36 square gauge control, 32 remove chips). No payout,
fee, rate or rail moved: the token-gated deposit clause on the four group-settings boards
stays unbuilt (a fee the product cannot charge); the perps ticket's fee rates still read
from `estimateOrderFee`; the coinflip beat holds only the card, and settlement, balance,
toast and ring stay ahead of it. No mock data: Earn's Fee and Volume (1W) columns draw the
unknown dash; the eighteen Customize-rows tags say what is missing; the referrals range
selector stays unbuilt rather than fed. The wallet lanes' rows are `done` on source only;
the wallet surface deploys from another session. Sportsbook pages stayed out of the wave.

## 3. What the lanes found

The dominant defect this wave was a breakpoint keyed on a width no board draws. Eleven
768 boards across Learn, Earn and Governance draw gutter 30 over a 708 column, and every
wave-42 Learn page, the yield vaults and gauge voting heads, the course video page and the
university shell keyed their only step on `lg:` (1024) or `sm:` (640), so 768 got the 375
treatment on every one of them. The same shape recurs in the explorer (block rhythm 32 at
768, recorded as 24; seven blocks columns where four drew), the account settings pane (its
own docblock admitted the 768 and 375 panes were never read, carried unopened since wave
39), the leaderboard (never opened at 768 or 375; a green test pinned the unmeasured 16
gutter under its own note that Figma had never answered), the course page (`aspect-[16/7]`
from the 1440 board alone), the predict order ticket (every value below the direction row
flat from the 432 rail, on a reading taken from two crops that stop at that row), and the
Starbound tablet stage (four rows sat blocked on a missing 708x720 stage whose every
offset is the desktop bar scaled by 415/502).

Second: the recorded reading was the app, not the frame. 3886-15237 carried "chart
702x512, order book 320x646, ticket 320x646" since wave 41; both 1440 boards draw
764 / 277 / 313, and 4020-42901's "1026 vs 1047" gap dies with it (1366 - 6 - 313 = 1047).
The perps confirm modal's glow shipped at (-151,-145) where both 1440 nodes draw
(-150,-424); docblock, test and class list agreed with each other and none with the node.
The social sidebar's docblock carried the right reading and converted it wrong against the
232 column (rule inset 16 a side, not `mx-2`). The home top bar's `gap-[58px]` was an
even-distribution result frozen at one state's width, not a token.

Third: a dimension nobody measured. The governance About panel had been measured three
times on size, columns, gutters and padding and never on line height; both its named styles
disagree with Tailwind's bundled leading at all six steps. A CSS border is not a Figma
stroke: the auth modal's `border` + `p-4` narrowed its column by 2 and pushed field text in
by 17 (an inset ring fixes both); the AI confidence strip's `border-transparent` sat outside
its padding and broke the tablet chart column's sum by 2; the wallet builds CTAs and fields
as padding plus leading, which is exact only without a border, so three bordered controls
were 1 to 2 over and `flex` stretch handed each row the taller number. The shared
`input/toggle` was republished at 40.593x24 around an unchanged 37.926x21.333 track, so
every row that holds it grew by 2.667 and a read that stops at the track sees nothing.

Fourth: the catalog's own surface names. 11998-251087 is the NFT page, not a second Tokens
board; the seven `section` frames are PerpPositionsPanel's tabs, not PortfolioTabs; the
six Private-key frames are the Account settings page (KeyExportCard.tsx), not
ExportKeyModal.tsx; the eight Share networth / Share portfolio frames are one dialog drawn
twice; the nine never-opened wallet Swap frames are the swap card embedded in the token
page (506 wide is that route's aside); KOLsPanel.tsx does not exist (13006-227835 now
points at TopHoldersPanel.tsx); WaitlistModal.tsx does not exist (the Login boards are
drawn by skai-ui auth-modal.tsx); five Sample-course rows cited a list tile where the
surface is CourseDetailPage.tsx; every "NONE / ZERO importers" row in the
governance-measure slice was wrong and now names its file; six of the ten social-feed
components have zero JSX mount sites at HEAD (the panel matches its frame and nothing opens
it); 3120-27415's registry file is PortfolioChart.tsx where the surface is
TokenPriceChart.tsx.

Fifth: the frame moved under the build. Both chicken mobile panels were rebuilt full-bleed
in Figma (9380-10283 375x440, 9380-10404 375x758; relayed across lanes and built the same
hour in ac72860b); the Groups and Messages boards split the same row differently by 2; the
v2 "Temporary landing" set is not the v1 set at the same widths and one component cannot
satisfy both; the reply bubble now has three readings left and one right.

Sixth, the instruments. Four lanes proved `bp-report.mjs` reads their file by breaking one
verdict deliberately (exit 1, correct line) before restoring it. Two parity suites in
predict and one in trade were green on the defect because they pinned the shipped value at
every rung; all now assert the ramp. `DevTokensPanel.test.tsx` located rows by the class of
the defect it should have caught; `AddWalletDrawer.test.tsx` asserts the padding and so is
green on a height it cannot see. The fold found sixteen status rows whose primary-file
column carried a mount note, a `:line` suffix or a second path after the path;
`apply-status.mjs` would have indexed each as one `implFiles` entry naming no file, so the
fold moved the notes into the reason column (`fix-column3.mjs`, idempotent) and
`row-tree-check.mjs` reads clean over all 343 rows that name a file. `vverify.wallet.tsv`
carries `match` for all six of the wallet shell's frames with a live surface while every
one measured this pass has a stated gap: the notes are scoped and the verdict column is
not, so those six are due a re-scope.

Two things a player can read that are not true, both outside the lanes' owns and both for
Casey (section 5): Hooked's Information screen prints "RTP NaN%" from uncertified
sentinels (`MenuScene.ts:165`, `PaytableScene.ts:120`), and the gas tracker's
Standard / Fast / Super-fast tiles would print priority fees on a chain with no
priority-fee market (left unbuilt).

## 4. Hand-offs

- `src/components/dashboard/LeaderboardTable.tsx` owes the frame's 7/6/4-column table for
  all four leaderboard rows; no lane owned it this wave.
- `src/components/legal/StreamingTermsGate.tsx` owes four desktop type steps for
  10094-250606, named for the first time.
- `src/pages/predict/PredictCategoryPage.tsx`: `gap-4 xl:gap-6` at :555 and :625 must be 24
  at 375 for the Breaking slug; `PredictInsightsPanel` is mounted only at
  `PredictPage.tsx:865`.
- `src/components/trade/tradeCtaStyles.ts`: `TRADE_CTA_SELL` `text-white` to
  `text-green-coal-300` (the lit sell CTA paints white on #FF574A);
  `parts/ProOrderTypeMenu.tsx:115` holds the second copy of the pad pair blocking
  3931-93237's last pixel.
- `src/components/learn/university/UniversityShell.tsx` needs a `md:` step (gutter 30 /
  708, avatar 64 not 100, CTA 46 not 50) kept off the existing column split;
  `src/pages/learn/courses/CourseVideoPage.tsx` has the same `lg:` gate and a `sm:gap-16`;
  `CourseDetailPage.tsx`'s `PurchasedBody` was left at the 375 treatment by dba2a7473.
- `ArticleListRow.tsx` was measured off the top-level Learn board but is mounted on the
  university Articles tab, whose own board 11764-348558 draws a course-card row with a
  78x78 cover and a Price / Views pair. 11764-348102 is a second Article-preview step with
  no surface (`not-started`).
- `LiveBadge` (`src/components/home-redesign/markets/MarketCard.tsx:130`) carries the last
  13006-150329 difference: `bg-[#001615]/70 backdrop-blur-sm` against a chip with no fill,
  shared with the home market cards.
- `PerpPositionsPanel.tsx` owns the seven `section` frames (its TABS measure 66/36/67/67/95/36
  on 9150-79379); the 42-tall strip drawn at 950 and 1350 is a detached copy, not a rung.
- `modules/skai-wallet/src/components/AddWalletDrawer.tsx`: SECONDARY_CTA renders 47/53/65
  and the field 52 where the boards draw 46/52/64 and 50; its suite at :760, :766, :897,
  :941 and :1390 pins the padding and must pin the box.
- `modules/skai-gaming` shared slots engine (no lane's owns): `IntroScene` draws Starbound's
  Start pill and no feature cards for Hooked or Untamed (`introCards` reaches only the
  preloader; `drawLadder` returns with no tiers); `cellRect` divides 412 by 6 so fills draw
  64.667 against 67 with 4 seams against 2; `BootScene.loadMetrics()` is Cosmic's;
  `fishermanSlotsPageContent.ts:153` still names the tile "COSMIC SLOTS";
  `VEGAS_FORTUNE_TABLET_FRAME` is wireable but has no `character`.
- `modules/skai-gaming` play: `GameShell.tsx` owes 9178-14134's and chicken's 375 full-bleed
  gutter; the Advanced rows of `CoinflipBetPanel.tsx:171`, `MinesBetPanel.tsx:875` and
  `ScratchBetPanel.tsx:93` were not measured; Baccarat has no PageSections or route; every
  Target row cites `targetPlayable = false` at a line that no longer exists (now
  `variants.coinflipTarget`, `CoinFlipGame.tsx:1109`, default in `gameVariants.ts:24`;
  ruling 0f0df6da holds).
- `src/components/home-redesign/HomeSidebarExpanded.tsx` has ten empty drawer slots on
  10938-214312; `HomeTopBar.tsx` draws a 2-up stat row where 14129:83324 draws three 88s;
  `AiHome.tsx` is the `main` of all four 1VH boards.
- `src/components/social`: group-menu item lists are owed in `menus/socialRowMenus.tsx`
  with their triggers in `pages/social/TradingGroups.tsx` and `pages/social/Discover.tsx`;
  the sidebar's `mx-4` fix needs its oracle in `SocialSidebar.drawer.figma.test.tsx`.
- The "Include:" colon on the share sheet lives in `public/locales/*/common.json`; editing
  only the inline default would read as applied and reach nobody.
- The Connected-wallets rows need `linkedWalletsService.ts` / `useLinkedWallets` (fenced
  this wave); the Farmers tile has no ERC-4626 holder count to draw.
- Catalog re-targets carried by this wave's rows: 11998-251087 to `NFTPage.tsx`;
  13006-227835 to `TopHoldersPanel.tsx`; 11387-72346 to `MessageThread.tsx`; the OTP
  boards to `EmailVerificationModal.tsx`; the Private-key boards to `KeyExportCard.tsx`;
  the two Login boards to skai-ui `auth-modal.tsx`; the Sample-course rows to
  `CourseDetailPage.tsx`. `apply-status.mjs` adds a primary file to `implFiles` and never
  removes one, so the stale names stay listed beside the right ones until a registry pass
  prunes them.

## 5. Decisions for Casey

Top of the list, because a player can read them:

1. Hooked Information screen prints "RTP NaN%" from uncertified sentinels
   (`MenuScene.ts:165`, `PaytableScene.ts:120`). (a) guard it with an explicit unavailable
   state (recommended; the no-mock-data pattern), (b) hide both scenes while uncertified,
   (c) leave.
2. Gas tracker Standard / Fast / Super-fast tiles would print priority fees on a chain
   with no priority-fee market. (a) leave unbuilt (current), (b) redraw the frame,
   (c) build showing base fee only.
3. Airdrop not-eligible boards (768 and 375) still draw "Claim now" and "Your allocation
   is ready!". (a) fix the boards, (b) keep the app's honest branch (current),
   (c) build as drawn. Lane recommends (b) plus (a).

Then by section (shipped default in brackets):

Onboarding, auth, landing
4. Email field at 768 and below draws the frame's 14px, which beats `index.css`'s 16px
   iOS-zoom guard. Keep the frame [shipped], or take the guard?
5. Signup ALT 10734:74426 contradicts all three instances. Redraw, or retire the ALT?
6. v2 "Temporary landing" vs v1 at the same widths: CTA height 70/50 (v2) or 66/54 (v1)?
   768 modal line boxes 16 (v2) or 18 (v1)? Socials: frames draw three, report 752e313b
   kept four. Counter "200k": drop, or show the real ~800?
7. Wallet welcome 7676-51711 draws an email account-creation form. (a) build it,
   (b) record the board superseded by the 2026-07-03 thirdweb-only ruling (recommended).
8. Wallet 7717-10565: keep the 12/24-word toggle the board hides (the only way to hand-enter
   24 words) [current], or drop it and lose that path.
9. Wallet CTA height at 768: 50 (four boards) [built] or 52 (two boards).
10. Wallet 7728-59766's CTA: this board's 46, or the 44 four sibling boards share [current].

Home
11. Private key on app.skai.trade: (a) keep the door to wallet.skai.trade [current; keeps
    key material on one origin], (b) build the frame's password-and-reveal flow,
    (c) redraw the frames as a door.
12. Share sheet: the eight frames draw one single-column dialog (738/448/354);
    `SharePortfolioModal` ships 960 across two panes with its capture pane on no board.
    (a) rebuild to the single column and move the capture, (b) keep the two-pane
    [current], (c) treat the frames as superseded.
13. Leaderboard share has no entry point: (a) add one, (b) drop the title.
14. 13008-112079 (1440 Flow board) draws no AI Analysis CTA while its two siblings draw it
    at 158x36. (a) keep the `tab === "flow"` rule [current], (b) build to 112079.
15. Intelligent support: ship three rows (5810:111233), or keep the seven from the Home-2
    hub boards [current]?
16. Collapsed rail bottom cluster: take 9003:131212's 28px (36 pitch plus 16 rule
    clearance) and accept every icon moving on hover, or keep it still [current]?
17. Folder chats: 14px text rows per 6250:93706, or keep the 26px tap target [current]?

Trade
18. Ticket order-type strip: keep 40 (3931-94545) [built] or 52 (Trade-panel frames and
    both boards); the 12 is 7732:32821, a 99x26 pair control laid out unpainted. Build the
    control, or leave 40?
19. `GROUPING_PRESETS.BTC` ships six ticks (panel 236 tall); `dropdown-3` draws three
    (122). Cut BTC to 0.01 / 0.1 / 1, or keep six?
20. Perps ticket amount-card shadow: three SCREEN tickets draw 0/10/80 at 25%, three
    COMPONENT boards draw `Input hint (dark)` 0/4/12 at 24%. (a) keep screens [shipped],
    (b) switch to the token.
21. Signed-out perps board 3908-39491 draws no sidebar; the app draws the rail either way.
    (a) frame is a crop, keep the rail [shipped], (b) hide it signed out.
22. Positions band 1366x258 on 4018-40830 vs 273 on the base board; source floors at 273.
    (a) keep the floor [shipped], (b) drop to 258 and risk clipping.
23. The "shouty" chip 7679-71122: (a) never ships, (b) ships on a bot severity field that
    does not exist yet, (c) replaces the muted chip everywhere, breaking three /spot frames.

Trench and launchpad
24. Eighteen sourceless Customize-rows columns: (a) leave as disabled tags naming what is
    missing [shipped], (b) commission a source for a subset (Holders / Top 10 holders /
    Dev holding are one one-token-per-call edge function; Sniper / Bundler / Insider need a
    wallet classification that does not exist).
25. `/launchpad/create` at 1440 centres its 1144 column on the viewport (148/148, the rail
    eating the left margin); `mx-auto` centres it on `main`, 29px right. (a) as drawn via a
    right margin equal to the rail (only holds with the rail collapsed; it animates on
    hover), (b) leave centred on the content area [current].
26. KOLs board 13006-227835: its catalog file never existed; is `TopHoldersPanel.tsx` its
    second witness, or is the KOLs panel a surface never built?

Predict
27. Category pill on both cards: keep (7ac26b2c) [shipped] or drop to the frame's tag
    glyph (two `done` rows hang on it)?
28. 375 mode band: chips [shipped] or bare words plus a rule? The frames disagree at one
    width.
29. Direction row below lg: flush [shipped] or inset 4 over a track?
30. ActivityPanel row: thread the market date down to draw "for <date>", or keep one line
    [shipped]?
31. Parameter swatch: keep (partial) [shipped] or drop to match the frame (loses the
    chart-line identifier)?
32. Futures list label: keep (bar 68 short) [shipped] or drop where an avatar exists?
33. 375 top inset: hold every Predict page at 16 [current], or move category to 18 (four
    families read, no agreement)?
34. Embed slot (`PredictHeaderActions.tsx`): build a chromeless widget route, or accept
    44-vs-72 permanently?

Social
35. Join-request buttons above 1024: keep the frame's paint (left button is the second tab
    stop) [shipped] or Accept-left everywhere? Sub-line: the frame's label [shipped],
    relative age, or both? Deposit clause: withhold until a debit exists [shipped], or
    ship the sentence?
36. Creators page size: the frame's 9 [shipped] or more? The pager at 768/375 has no
    artboard: keep the desktop band [shipped], hide below md, or commission rungs? Who
    takes `LeaderboardTable.tsx`?
37. Group rows: Groups boards split Frame 280 14+2+16, Messages boards 14+4+14.
    (a) group-row conditional, (b) keep 4 below lg [shipped], (c) re-harvest.
38. Reply bubble 10216-182243 mirror, three readings left vs one right. (a) left
    everywhere, (b) ramp left to right at lg, (c) redraw the component.
39. Two-image posts (10335-236021 / 11527-291862): (a) ship end to end via
    `posts.metadata` jsonb, no schema change, (b) rule the state out of the product.
40. Right-click menus at 375 (11380-24252); a right-click has no touch equivalent.
    (a) long-press, (b) a tridots trigger, (c) desktop-only.

Account, rewards, governance, Earn, Learn, explorer
41. Delete dialog's optional "reason for leaving": the frame omits it. (a) keep dropped
    [shipped], (b) restore.
42. Security's Password group draws Current / New / Confirm for a rail that does not exist
    (embedded-wallet auth). (a) hide the group, (b) build a password rail, (c) leave
    unbuilt [current].
43. Referrals range selector and All-referrals pill have no data behind them. (a) leave
    unbuilt [current], (b) build with an explicit unavailable state.
44. 375 shortens two 2FA strings ("Enable 2FA"). (a) width-gate the copy, (b) one wording
    everywhere [current].
45. Active tab rule: 1440 label+8, Address 768 label+12, university label+17.
    (a) per-board, (b) standardise +8, (c) standardise largest.
46. Explorer 8th tab: the frame's "Others" (Address overview / Chart / Other variables; no
    per-address read exists) vs the shipped "More" (five live sections). (a) build the
    frame's and rehome More, (b) keep More [shipped], (c) both.
47. Account activity rows: the frame collapses to one 48-tall line at 375 and one card per
    row at 768. (a) build the collapse, (b) keep five fields visible [shipped].
48. Boards name metrics with no source (AI "Total minted", launchpad "Total raised" and
    "Active curves", gaming "Total payout", transactions "Txn fee"). (a) keep the readable
    substitutes [shipped], (b) build the sources, (c) render explicit unavailable.
49. Frame 604 puts the Governance title above the band and draws two equal halves with the
    left half an image; `GovernancePageHead.tsx` puts the title inside the left half and
    splits at lg. Move the title out and build the image half, or keep the app's layout and
    mark the frame superseded?
50. Document archive has no destination. Keep it refusing [shipped], point it at gated
    docs.skai.trade, or publish the documents?
51. The vault standfirst "Showing position of deposited earning into this vault" is
    ungrammatical and shipped verbatim. Fix in Figma, or allow a paraphrase?
52. Create course is a routed page, not a modal. (a) build the page and open the schema,
    (b) keep the one-step modal [shipped], (c) defer.
53. Other-courses shelf: (a) add a related read, (b) explicit unavailable, (c) omit.
54. `/learn` top level: (a) rebuild as the marketplace (hero, Courses | Articles toggle,
    search, chip rail, two rails) as its own lane item, (b) keep lessons and re-scope the
    boards, (c) drop the board.
55. Create-article second step prices in SKAI (unlaunched). (a) build with the Paid-article
    block omitted, (b) build with the toggle disabled and labelled, (c) leave the step
    unbuilt [current].

Play
56. Continuous coinflip board 9190-14926 draws a present-but-empty 20-slot strip; the build
    draws none until a result (reports a763c535 / a2846d9f). Keep the build [shipped], or
    draw the placeholder row on Continuous only?
57. Coinflip win card row 3: keep the active rail's symbol [shipped], or ship the frame's
    fixed blue disc and mislabel two rails of three?
58. Mines cover: the frame declares an 80%-alpha stop, the card paints opaque (22/255 band
    delta). (a) alpha-capable accent, (b) accept 22/255 [current].
59. Plinko cover: the frame zooms its fill to show 76.4% of the raster, object-cover shows
    88.3%. (a) per-cut zoom on PlayGameCard, (b) leave it [current].
60. Sidebar drawer 10938-214312 has ten empty frame slots. (a) ship the nine existing sport
    glyphs, (b) keep emoji [current].
61. Play 1VH crops (10855-53595, 10900-146833) run an 8px-tighter band rhythm than the full
    boards. (a) full boards govern [current], (b) the 1VH rhythm.
62. Two same-titled 768 blackjack boards: (A) 9003:118852 governs, 468 panel [built];
    (B) 9003:119356, 422.
63. That cut's panel interior is stale (1x4 actions, 24 seam, superseded stake field)
    against the 375 cut's 2x2 / 16. (A) stale [assumed]; (B) rebuild to it.
64. Slots load-screen ground: (a) keep the backdrop and retire the ALT set; (b) ship flat
    #001615. The ALT differs only in ground (same 216 track at 86.1% vs 52.8%).
65. Hooked 1440 info card: (a) keep the platform's two columns plus rule [shipped];
    (b) match the frame's single 719 column.
66. Starbound in-canvas status row "05:28 - Skai - Starbound": (a) live clock, (b) no time,
    (c) keep the shell's Back plus title [current].

## 6. Verification at close

- Fold: thirty status files, 345 rows, every row stamped `@2026-09-17/wave50-<lane>`;
  `fix-column3.mjs` normalised 16 rows (then 0 on re-run); `row-tree-check.mjs` exit 0
  ("no row points at a file or line that is absent"); `bp-report.mjs` exit 0;
  `pipeline.mjs` exit 0 at 01:50 (coverage: 749 done of 3,824, 327 verified, 44
  pull-downs; drift 1 live-only / 1 catalog-only, unchanged from the wave 49 close).
  112 vverify lines across 14 section files, `vverify.cover-images.tsv` new.
- skai-ui dist rebuilt from d589754 at 01:46 (one builder, `tsup --no-clean`, exit 0)
  before the superproject gate.
- skai-wallet: `tsc --noEmit -p tsconfig.json` from inside the submodule, reproduced by the
  orchestrator at 01:47: exit 0, no output. Both wallet lanes' own runs read exit 0.
- Superproject `typecheck:gate`, main tree, run at 01:52 after the dist rebuild with all
  59 lane commits on main: exit 0, "no new type errors. 2537 known baseline error(s); 61
  fewer than baseline". A real pass prints its baseline in the thousands; the fail-open
  tell ("0 known baseline error(s)") did not appear.
- skai-gaming: `tsc --noEmit -p tsconfig.json` with the 8 GB heap flag, from inside the
  submodule at 32e543b7 (17 commits past 1badf455), 01:50 to 02:22: exit 2 with 2,019
  errors (341 in gaming src, 1,678 in the superproject src its config includes; 2,021 at
  the wave 49 close). The 35 files this wave touched carry 11 of them, in four files
  (BlackjackGame.tsx 5, blackjackTabletStack.test.ts 2, ChickenGame.tsx 3, BingoGame.tsx
  1), and all 11 are pre-existing: the wave 49 close log carries the same four files at the
  same counts, and every one sits outside the wave's hunks (errors at lines 345 to 1372
  and test line 76; the wave's changes start at line 2059 and test line 94). New errors in
  touched files: 0.
- Lanes committed by pathspec and never pushed; the catalog fold commits all thirty status
  files, the new vverify file and this record with an explicit add.
- Deploy: skai-gaming pushed (1badf455 to 32e543b7), then the pointer bump committed in
  the detached deploy worktree on top of origin/main (a peer's d2539ee09) and pushed as
  7ac933258 (skai-ui d23ee42, skai-gaming 32e543b7, skai-landing 3e62327, docs cb9e52f;
  skai-wallet b314ae2 was the peer's own bump). `deploy_main.ps1` from that worktree,
  02:23 to 02:34: exit 0, release `skai-trading@20260918-0223-7ac933258`, version.json
  dirty:false, sourcemap guard satisfied, parity feed re-published unchanged at the 01:50
  measurement. A peer session deployed again at 04:54 as `skai-trading@20260918-0451-f2c0bf0e2`
  (dirty:true, built from the shared tree); that commit contains 7ac933258 and every wave
  50 pointer or a later one, so the wave's work is in the live release either way.

## 7. What is next

1. The 66 decisions above; the three at the top first.
2. Wave 51: the 3,075 frames still open, most-closable first, with three fixes to the
   lane rules from this wave: column 3 of a status row is one bare path (second witness
   and mount site go in the reason); the orchestrator runs `row-tree-check.mjs` before
   the fold; a lane whose owns array is empty is re-partitioned before launch, not
   dispatched to write verdicts alone.
3. Owners for the hand-offs in section 4 that no lane held: `LeaderboardTable.tsx`,
   `StreamingTermsGate.tsx`, the shared slots engine, `GameShell.tsx`, and the six
   `vverify.wallet.tsv` re-scopes.
