# Wave 42 integrity record (2026-09-14, 17:55 to 19:20 Denver)

Wave 41 re-measured every section against the Figma source and left a list of
decisions; Casey ruled on them at 17:35 ("figma is source so yes, game names have
changed. do whats best for 1-7 and ask me multiple choice if you still have issues") and
answered four multiple-choice questions at 17:40. Wave 42 executed those rulings and
built the gaps wave 41 had measured. Ten lanes, two of them new features, plus three
short follow-ups sent back to finished lanes. All six batch-1 lanes died on the session
limit within a minute of launch and were resumed by id after Casey's reset; none died
after that.

## 1. The rulings this wave executed

| ruling | source | where it landed |
|---|---|---|
| Game names change: Untamed, Starbound, Sugar rush, Hooked (ids unchanged) | Casey 17:35 | games-names lane, 4 skai-gaming + 2 superproject commits, 2 `site_config` descriptions |
| Airdrop rate is an admin-settable config row, empty until set; 0.5 never ships | MC 17:40 | explorer lane; migration `20260915004059` applied |
| Bridge rebuilt to the frame's one ticket now, presentation only | MC 17:40 | bridge lane, `343e027f1` |
| Base governs over ALT; ALT recorded, built only when named | MC 17:40 | play-hub, social-profile, trade-followups rows |
| Skai University and the Earn detail routes built now, unavailable where no source | MC 17:40 | university (64 frames), earn-detail (100 frames) |
| Explorer body 1318 (the hub's ruling, same number) | orchestrator | explorer lane: sixteen per-page caps removed |
| Gas unit label `rei` on explorer surfaces | orchestrator | `src/components/explorer/gasUnit.ts` |
| Performance overview mounts on `/account`; `/:username` stays the public profile | orchestrator | account lane |
| 375 detail CTA is 32 via `no-min-size` | orchestrator | play-hub lane |
| Region ALT modal is a frame defect: `skai.jp` is a third-party Japanese blog | orchestrator, verified 17:40 | play-hub rows, never built |
| InsightX CTA word "AI Analysis"; CandleChart square corners | orchestrator, handed to wave 23 | session 08's lanes |

## 2. The lanes

| lane | rows | done | partial | blocked-on-backend | not-started | frame-defect | furniture |
|---|---:|---:|---:|---:|---:|---:|---:|
| games-names | 5 | 0 | 5 | 0 | 0 | 0 | 0 |
| explorer | 84 | 0 | 74 | 9 | 1 | 0 | 0 |
| account | 38 | 0 | 31 | 0 | 6 | 0 | 1 |
| play-hub | 13 | 0 | 10 | 0 | 0 | 3 | 0 |
| social-profile | 28 | 0 | 20 | 0 | 8 | 0 | 0 |
| bridge | 15 | 0 | 9 | 0 | 0 | 6 | 0 |
| university | 64 | 0 | 64 | 0 | 0 | 0 | 0 |
| earn-detail | 100 | 0 | 78 | 3 | 19 | 0 | 0 |
| trade-followups | 201 | 5 | 165 | 24 | 4 | 3 | 0 |
| governance-handoffs | 37 | 0 | 37 | 0 | 0 | 0 | 0 |
| **total** | **585** | **5** | **493** | **36** | **38** | **12** | **1** |

| measure | before (wave 41 close) | after | delta |
|---|---:|---:|---:|
| `done` | 590 (15.5%) | 592 (15.5%) | +2 |
| `done` and visually verified | 167 (4.4%) | 169 (4.4%) | +2 |
| claimed statuses pulled down by a visual verdict | 32 | 32 | 0 |
| whole-frame matches added to the vverify files | 0 | 50 | +50 |
| rows carrying a wave 42 stamp | 0 | 585 | +585 |

No lane ran a browser. `done` moves only where a lane measured the frame matching the
source at every width it draws; the wave's weight is in the rows, the routes and the
rulings, not in that column.

## 3. Commits (all by pathspec, none pushed; superproject unless marked)

- **games-names** — skai-gaming `a96bcccd` hub, detail page and slot engine take the
  four names; `636fda16` game screens, rules, bets rail, admin cards; `dad94fc6` name
  suites and provenance notes; `a9a91ed9` the Sugar rush and Untamed content modules
  registered by hub id (a batch-b registration gap the rename exposed). Superproject
  `73b88715a` admin config, explorer, agent quick actions; orchestrator `2db072b5c` the
  AI agent quick action. Two `site_config` stake descriptions updated in place.
- **explorer** — `140d92516` content column capped at 1318 and `gasUnit.ts`;
  `d26c53645` every gas figure labelled in rei; `c1c7a0abd` airdrop rate read from
  config; `18d5cd928` the sixteen per-page width caps dropped; `0a41cb9e3` addresses
  board search field and Important card. Orchestrator: `63af82fe9` migration file
  aligned to its ledger version; `0663fa670` app_config read policy honours is_public.
- **account** — `fd3ed1e2` one rule for when an overview figure is real; `72c6ec71`
  the overview screen rebuilt to its three boards; `b8217ebc` mounted on `/account` at
  the 1202 board width; `53491db7` position test pinned; `52bf64e1` type ladder pinned;
  `73c52665f` the retired My-account overview card removed; `fa40b2d5` its comments
  and mock cleared.
- **play-hub** — skai-gaming `af7df9f6` below-the-bar rungs and the 32 CTA; `2f202730`
  the 12 phone padding; `3e3590b1` the phone bets control; `c8ee148e` licence heading
  and seam stepped per board.
- **social-profile** — `3885ce9be` creator-profile shell mounted at `/:username` with
  its 1440 board; `353d58698` the `/post/:postId` route; `77a039037` PostDetail;
  `f1eecced0` `/post` reserved; `3658540ba` the route id resolved as a feed item.
  Session 08 wired the card link in `4e8715c3f`.
- **bridge** — `343e027f1` the one ticket; `5d7c7f20a` a 24-assertion ticket oracle;
  `5746e6f08` Swap and Limit tabs given the routes the app already has.
- **university** — `01fa89e98` the Learn read client; `1877c2987` the article lookup
  by a typed column match (security fix); `476901eb0` profile, tabs, lists;
  `5c5a53810` course page, purchase ticket, transcript pane; `19029ccbf` article
  reader and composer; `b15087559` route lines; `79f0c5c9b` tests.
- **earn-detail** — `c0c80c31e` the opportunity route and page; `7adc2630d` the list
  linked to it; `4675834eb` faucet Earn more; `c8cc62639` vault overview labels;
  `f1c83e262` the held-position state.
- **trade-followups** — `abf52f1ba` the order-type strip at 36.
- **governance-handoffs** — `910be4e5a` gauge voting overview and bribe panels;
  `24e3efd2b` insurance fund card (coverage bar below the stats); `fcd96c2ec`
  `DelegatesTable.tsx` and `OffChainDelegationCard.tsx` mounted in DelegationManager,
  two stale oracles moved; `5c3ea08b4` the collective card at the band's 24/28 type
  with the paragraph it had never drawn; `a4dee9d2b` `AirdropSnapshotList.tsx` under
  the claim panel. Every new surface draws the frame's geometry with an explicit
  unavailable state and no rows; nothing on a vote, stake, delegate or claim call
  changed.
- **orchestrator, skai-ui** — `e97906f` the header rich dropdown at 12px.

## 4. Findings that travel

- **A width cap is only as good as its innermost repeat.** `ExplorerLayout` was one
  line; sixteen explorer pages re-capped themselves inside it. The fix ships with
  `explorerBodyWidth.test.ts`, which reads all 25 page sources and refuses a second cap.
- **A retired source that returns `[]` is a fabricated zero.** `getChainTrades` returns
  an empty list while `CHAIN_MIRRORS_RETIRED` is true; `userStatsService`'s trading half
  would have printed every trader a confident 0% win rate. The account overview reads
  `getUserAnalytics` through one withholding rule instead. `useExplorer.ts` still reads
  the retired call.
- **Two ids were sharing one route param.** Feed cards carry an indexer feed-item id;
  the new post page resolved it as a social-token id. Fixed to read the item first and
  take a token only from the row. An indexer `GET /api/v1/social/feed/{id}` would
  remove the page's bounded scan of the public feed.
- **`app_config`'s read policy ignored `is_public`.** Two non-public rows were readable
  by anon; both are admin-panel reads. Policy now: public rows for everyone, every row
  for an admin wallet.
- **A PostgREST filter took an interpolated id.** Caught by the background review on
  the Learn client's first commit; fixed the same hour by picking the column from the
  id's shape and using a typed match.
- **The game name is a literal in four maps and seven content files**, not one table;
  the next rename costs the same sweep. `GamingPage.tsx:117` keys an indexer lookup on
  "Cosmic Slots" and stays.
- **Parked frame content looks like missing copy in metadata.** The 1440 empty-bets
  vault line is drawn at opacity 0; `get_design_context` shows the opacity, `get_metadata`
  does not.
- **`TradeUnified.tsx` was deleted on 2026-08-12** and 22 catalog rows still cite it;
  148 trade rows cite a `trade.json` that is not in the catalog.
- **The backend holds no University at all**: no course, entitlement, video or
  transcript store; `purchases` is the token-sale table. Every University figure is
  unavailable by construction.

## 5. Decisions only Casey can make

1. **Purchases and prices.** The University purchase rail prices in SKAI, which is
   unlaunched; where a course price is stored; an entitlement ledger distinct from
   completions; whether articles get a submission path with moderation.
2. **Earn detail.** The frame prints a held position in dollars while `userValue` is in
   the opportunity's own asset with no trustworthy conversion (kept in units). Staking
   has no detail board. The Add-liquidity chart needs `CandleChart.tsx` (wave 23).
3. **Bridge.** Post-wallet-interaction states have no drawn spec (shipped states stand).
   The Swap tab now opens the wallet swap and the Limit tab the perps ticket, whose
   Limit tab is itself "coming soon".
4. **Social.** Confirm the `/:username` drops the frame makes (banner, four-card stats,
   the Activity, Agents, Trades, Holdings and Followers tabs, Friends Activity, Share,
   badges, tier chip, Copy Trade); a buy path before the post trade sheet ships; Block
   needs a `user_blocks` table.
5. **Explorer.** Analytics draws four stat cards where the code ships eight live ones
   (recorded as "build to the frame's four next pass"); Customize presets without a
   source render as unavailable options; Points cards keep honest labels against the
   board's "Total" wording because the leaderboard is top-N capped; the perps header
   draws Oracle where code draws a blank Market Cap.
6. **Governance.** Which board governs Frame 604: `5371:64385` draws the left half as
   an image card with the title elsewhere, while `status.governance.tsv:49` (off
   `5370:61920`) puts the title and sub-nav there; the lane kept the title rather than
   orphan the sub-nav. The bribe card's card-level CTA implies a batch `claimBribes`
   that does not exist (a money-path change; per-row claims kept).
7. **Hub versus Play.** Session 08's FU5 (queued) rebuilds the Play hub's sports rail;
   the games-names lane edited only name strings in that file.

## 6. Hand-offs

- Still "Gwei" outside the explorer: `modules/skai-wallet/.../GasIndicator.tsx:142`,
  `src/components/admin/AdminChainHealth.tsx:165`, `src/components/ai/MultiChainSignals.tsx:197`.
- `useExplorer.ts` reads the retired `getChainTrades`.
- Indexer: `GET /api/v1/social/feed/{id}` returning the list route's `FeedItem` shape.
- `gameInfoCardRungs` is red at HEAD: the three slot detail pages never carried the
  `gap-8` body the test pins (a batch-b structural gap, not the rename).
- Frame defects recorded, not built: Courses 1VH `5393-86875` (More menu overlays its
  left half); Analytics card 3 "Average block size 1600 ms"; Bridge settings is a
  Solana wallet-connect panel on an EVM-only rail; the region ALT names `skai.jp`.
- `ProOrderTypeMenu.tsx:115` (wave 23) for the last 1px of the order-type strip.
- `src/pages/GaugeVoting.tsx` stacks its two panels on `space-y-4` where the frame's
  column gap is 8; `src/pages/YieldVaults.tsx` owes the `1 year` select, the `Farmers`
  stat and the TVL delta; `src/pages/Airdrop.tsx` keeps a `max-w-2xl` claim column
  against the frame's 1318 page.
- Red at HEAD before wave 42 and left: `tests/pages/Earn.faucet.test.tsx` (2 timeouts),
  `tests/integration/vault/withdrawCompleteFlow.test.tsx` (2). Two governance oracles
  (`DelegationManager.figma`, `TreasuryDashboard.figma`) pinned Title Case that wave
  41's sentence-case rebuild had superseded; the assertions moved in `fcd96c2ec`.

## 7. Verification at close

- Mid-batch build: exit 0 at 18:37 into a scratchpad output directory (3,018 assets).
- Mid-batch gate: red on 6, all attributable (session 08's two Launchpad errors; four
  unused imports in files lanes were editing at that moment).
- Closing gate (`typecheck:gate`, 19:09): red on 11, eight of them wave 42's (three
  unused imports the lanes left behind, a course-price cell reading `.free` on a union
  that includes `Offline`, a comment author missing `isFollowedByViewer`). All eight
  cleared in `c191df23c`; the re-run at 19:16 is red on 3, all session 08's (two in
  `Launchpad.tsx` carried since 17:00, one new in `topBetsRows.test.ts`), owned by 08
  before any push. The lanes' own "no type errors" claims were true of the files they
  ran; the app-config gate is the one that counts.
- Closing build: exit 0 at 19:15 into a scratchpad output directory (3,063 assets),
  started before the five type fixes; those touched imports, a dead constant and two
  type narrowings, none of which changes what vite emits.
- Fold (`pipeline.mjs`): exit 0; 3,813 of 3,814 in-scope frames have a row; hand-set
  fields changed on 577 rows (notes), 162 implFiles, 159 routes, 124 statuses, 120 bp
  verdicts, 101 verifiedAt; `bp-report.mjs` exit 0 with all ten files.
- Parity feed: `figma-parity.json` re-emitted (592 / 169 / 15.5%, measured 01:16Z),
  skai-landing `544128e`, deployed.
- Migrations applied and reconciled: `20260915004059_app_config_airdrop_conversion_rate`,
  `20260915004608_app_config_read_honours_is_public` (ledger and file versions equal;
  anon probe shows only the public rows).

## 8. What is next

- **A browser pass.** 50 whole-frame matches now sit in the vverify files and 493
  wave 42 rows say `partial` with the gap in numbers; a lane with `get_screenshot` and a
  DOM measurement at 1440, 768 and 375 is the only thing that moves `done` from here.
- **Casey's decisions** in section 5, above all the money ones: a University purchase
  rail, the Earn held-position unit, the bribe batch claim, the social buy path.
- **The three features drawn with no backend** (University, the Earn detail figures,
  the Delegates and Airdrop snapshot boards) need their sources before any of their
  rows can leave `partial`; the rows say what each source must supply.
- **Wave 23's holds** still cover the predict pages, the trench surfaces, the home
  shell and the sportsbook; the wave 41 rows for those (predict 144, home 253, trade's
  News tab) wait on session 08's lanes.
- **Left red at HEAD, none introduced this wave:** `gameInfoCardRungs`, the two
  Earn faucet timeouts, the two vault withdraw-flow tests, and 08's three gate errors.
