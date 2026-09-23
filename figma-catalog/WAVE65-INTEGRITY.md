# Wave 65 — integrity record (2026-09-22 to 09-23)

**Figure: 1,232 of 3,816 in-scope genuine frames done (32.3%), 810 verified.** That is one more of each
than wave 64's 1,231 and 809. The pipeline and `catalog:check` both exit 0.

This was two waves in one:

- **13 frame lanes**, board-free again: the claude.ai Figma and Supabase connectors stayed disconnected all
  night.
- **17 test-health lanes**, sized from a full run of the app suite.
- **One fix lane**, for the made-up copy-trading figures that a test lane found.

A few frames moved. Most of the wave's value is in the second half: a suite that could not gate anything
is now mostly green, and it turned up real defects the frame work never would have.

## How the wave ran

- **The frame lanes drew from a pool of 141 frames.** Each frame's latest row is a recent first-hand read
  that names a gap, and no Casey call, backend or board blocks it. Each lane built only to those recorded
  reads and cited them. Anything that needed a board was carried.
- **The full suite would not run as one process.** Under `vmThreads` a worker died about five minutes in
  and no report was written.
  - Run in eight sequential shards at 4 workers, it finished: **178 red files of 2,988, and 714 failed cases
    of 43,639**, at origin `725a17f73`.
  - That count is an upper bound; see "The instrument" below.
- **Three session limits cut the wave off,** at about 21:53, 23:04 and 00:20.
  - Each time, every uncommitted change was backed up first, the tree was swept for planted test mutations,
    and each lane was resumed with its own state.
  - Nothing was lost. One peer's staged change, found in the shared index, was left alone and later
    withdrawn by its owner.
- **The harness caps a session at 20 concurrent agents.** Lanes spawned research sub-agents of their own,
  which took slots. The rule "no sub-agents" now opens the lane rules.
- **Peer sessions pushed the shared `main` in full at least five times during the wave** (21:37, 22:47, 23:25,
  and about 01:14 and 01:44). Each push carried lane commits to origin before the fold had verified them. Those
  commits were verified where they landed and fixed forward.
  - Between about 23:53 and 01:10, peers pushed only copies of their own commits, over SSH.
  - Lane commits made in that window waited locally for a later full push, or for this fold's cherry-pick.
  - skai-gaming's and skai-wallet's origins hold the lanes' commits in those repos, and the app's pointers
    already include them.
- **A peer's commit reverted one lane repair, silently** (00:03).
  - A pre-fix copy of `useSportsLeaderboard.test.ts` sat staged in the shared index while the working tree held
    the fix. A peer lane's `git add <its own file>` plus a bare `git commit` swept it in.
  - The peer then described the inverse diff as the lane's "follow-up".
  - It was caught by comparing blob ids, committed forward, and never reached origin.
  - Lanes now never leave anything staged between tool calls.

## What moved in the catalog

Eight status transitions, each reported by its lane:

- **Closed to done:** 6415-45113 (the 375 phone hero) and 6736-38442 (the 768 add menu opening upward).
- **Moved DOWN on purpose:**
  - 10213-136686 and 10215-137653 (the tridots dropdowns): the live menus are not the frames' panels.
  - 13006-253481 (the stacked Instant trade ticket): nothing mounts it.
- **Blocked on the backend:** 11474-207758, 11474-207421 and 11442-169953. The live indexer feed has no
  rows and no symbol or comment routes, so a post can only ever show its unavailable state.
- **Corrected in place:** two whales frames (13008-122389, 13008-116574) had been recorded done while 1px
  off per row. They are now truly done.
- **One verified frame dropped back to partial:** 3118-25371, a wallet frame.

Frame fixes that are built but not closed include:

- the Governance and Earn 768 columns, 736 → 708;
- the composer column and both centred wallet modals, where a 1px border had eaten the boards' 330 / 424 /
  516;
- the Spot order-book notes and tests;
- the sportsbook 768 drawer, slip and 1440 band gaps;
- the Predict mode word;
- the darts throw column;
- the crash phone seam;
- the Live launch card's chart slot, drawn unavailable;
- honest states replacing a placeholder private key and a "No position" line that told buyers they held
  nothing.

## The test suite

The 17 test-health lanes measured every red file ALONE at HEAD before touching it. Each red was traced to
the commit that turned it red, and repaired without weakening. Every repair was mutation-tested: a defect
was planted in the component, the test was confirmed red, and the file was restored.

- **Most reds were stale tests behind deliberate changes.** The commonest shape is a closed `vi.mock`
  factory that lists only some of a module's exports, so it breaks the day the component imports one more.
- **Several areas are now fully or nearly green:**
  - perps (812/812), predict (919/919), governance and vault (643/643), home shell (616/616), chart
    (577/577);
  - admin and security: 1,635 of 1,636;
  - gaming services: 213 failing cases down to 5;
  - trading and market: 1,884 of 1,887 (the 3 are the swap fee cases below);
  - platform (Supabase, SEO, performance, edge helpers): 563 of 566;
  - routes and shell: 575 cases, with 11 red, each tied to a named defect or ruling;
  - streaming: 63 of 64 files green, with 955 cases passing. The one red waits on the viewer-count ruling below.
- **Three edge-helper suites had run zero cases since `b4fbc18d4`,** because of an `esm.sh` import: clientIp,
  rateLimit and getTokenLaunches. 32 cases now run again.
- **One perps test was calling the live chain RPC** on every run. It now uses a stub.
- **Tests that passed without testing anything were rewritten to test something.** Examples include a
  take-profit case asserting a call the modal no longer makes, an `oddsFeedOffline` recovery case that
  could not fail, and a `sportsChainErrors` case that echoes its own input (left for Casey).
- **Four suites for deleted client game engines were retired:** grid/crash-coinflip, slots, hi-lo and
  blackjack. Each is backed by a logged proof naming the removing commit (skai-gaming `b703e232`), where the
  behaviour now settles, and the tests that cover it there. Cases for surviving code were kept, plus
  tripwires that fail if a deleted engine comes back.
- **The slots suites now load Phaser's canvas shim,** so 46 slots cases run in the full suite for the first
  time.

## The instrument

Six things about how tests were run and recorded tonight were wrong, and all six are fixed or recorded:

1. **`--maxWorkers=1` makes phantom reds.** A single `vmThreads` worker running several files leaks the
   DOM between them. perp-v2 + perp: 56 failures at 1 worker, 458/458 at 2.
2. **The clean worktree was a CRLF checkout** while the shared tree was LF. Tests that read source text
   went red only there. It has been re-checked out as LF.
3. **The shared tree itself was half CRLF:** 4,146 of 8,321 files over an LF index. `.gitattributes` is
   `* text=auto` with `core.eol` unset, so every checkout, rebase or restore wrote CRLF, and the lanes'
   own `git checkout --` restores flipped more. `core.eol=lf` has been set in the repo config since 22:58;
   `git config --unset core.eol` reverts it.
4. **A `git checkout --` restore was once refused by a peer's `index.lock`,** and a planted defect sat live
   in `PerpOrderEntry.tsx` for about a minute. Restores are now byte copies with a sha256 check.
5. **In vitest 4, `vi.restoreAllMocks()` does not reset a `vi.fn()`.** Queued answers leak into the next
   case. That was 13 of one suite's 19 reds.
6. **The fold commit `877b995` stored seven vverify tables with CRLF line endings:** crash, darts, dice, home-2,
   home, trade-2 and wallet. The lanes' copies in the shared skai-ui were CRLF under its `core.autocrlf=true`, and
   the clean checkout committed those bytes as they were. The contents did not change, but every line of those
   files shows as rewritten. The commit that adds this record puts them back to LF.

The skai-ui `dist/` the app builds against is untracked, and the clean worktree's `@skai/ui` resolves to the
SHARED tree's copy. That copy was built before wave 64's order-book fix (`2c136bf`), and the fold's gate and build
read it as it is.

- Tonight's production deploy (`2d0b23f19`) read its own worktree's skai-ui instead, which carries the fix.
- The shared copy's rebuild is carried: it waits until no other session is building skai-ui.

## Real defects found (code not changed by the lanes unless noted)

**Money, security and compliance:**

- **Four admin functions still grant PUBLIC execute:** `block_ip_address`, `unblock_ip_address`,
  `admin_force_end_stream` and `bulk_grant_docs_access`. No migration revoked it. Only their internal admin
  checks stand; the live grants are unverified.
- **`gameSettlementService.ts:1366`:** the last-line bet check skips the "SKAI not launched" gate, so a
  direct call can send a SKAI stake to the keeper.
- **The vault fee:** the vault screen quotes a 1% withdrawal fee, and `withdraw_from_vault` charges none.
- **Blackjack fairness:** nothing can verify a blackjack hand against its seeds any more.
- **The balance path:** `balancesService.ts:220-306` can cache a token list without sUSD during a partial
  outage, so a funded holder reads as holding none. Suspected, not reproduced.
- **Security policy:** the CSP admits `app.insightx.network` for an embed that nothing mounts.
- **The points rail:** its engine tests (Deno suites under `supabase/functions/_shared/`) are never run by
  anything.
- **Points that never reach the chain:** three functions add `skai_points` without writing `points_history`, so
  the chain sync never sees those points.
  - The three are `award_referral_points` (from migration 20260618181425), `settle_prediction_bet`
    (20260806085000) and `launch.award_launch_points` (20260921113146).
  - Each needs a new migration.
- **The swap fee helpers:** they fall back to a flat 1% when the fee read fails (`8abc77f73`), where the no-mock
  policy asks for a refusal or an unavailable state.
  - Sites: `configCache.ts:168`, and `swapService.ts:1258` and `:1380-1388`.
  - configCache's fallback is `1.0` while its fixtures read fractions, so it may mean 100%.
  - Nothing calls these helpers today. Two tests stay red on it.

**Product (fixed during the wave):**

- The account menu lit three rows on every `/account` visit.
- The delegation overview showed "0 SKAI" on a failed read.
- A Trench coin named YES or ID showed the wallet's prediction positions as its holding.
- Renaming a chat or folder in the Home sidebar saved only the last letter typed. It had been live since
  `a2c9eb9c1`, and was fixed in `c4f0da1b8`.
  - Cause: an inline callback ref re-selected the draft after every keystroke.
  - A new case types the name key by key, as a person does. The old cases set the whole value in one event and
    could not see it.
- **The copy-trading leaderboard made up period figures** (fixed in `cd69b5cef`, against the no-mock policy).
  - Its 24h and 7d PnL were all-time totals times 0.03 and 0.15, and its 30d and 90d were the all-time totals
    under a period label. The page opens on 30d. Trade counts were scaled the same way.
  - Chain-sourced traders showed placeholder zeros as measured PnL, win rate and trades.
  - No source measures a period. So All Time now shows the real totals, and every other period, and every chain
    row, shows "—". Eight planted defects were all caught.
- The watch page's fallback player showed a confident "0" viewers for an unknown count. It now shows the dash
  (`5d4fd3ff5`).

**Product (not fixed):**

- The browse card prints a viewer count without its thousands separator.
  - `formatViewerCount` (from `ab21e23e3`) is `String(Math.trunc(n))`, while the watch page's badge prints the
    same count as "1,234". No commit chose to drop the grouping.
  - The `StreamCard` test pins it and stays red on that one case.
- The build ships two framer-motion stacks: 12.43.0 at the root, and 12.38.0 under `modules/skai-ui/node_modules`.
  It also ships nested radix copies left by two Dependabot bumps.
  - vendor-animations is 251 KB against its 184 KB budget, and vendor-radix is 301 KB against 287 KB.
  - The budget test is right and stays red. No budget was raised.
- `/trade/pro` is a redirect, but it stays in the sitemap and in the list of indexable routes.
- `signalChartMessage.tsx:114` sends `/spot?token=SOL`, which silently opens BTC.
- `TokenSelector.tsx:468` cuts the token list off on short screens, and the list cannot scroll. Nothing renders the
  component today.
- `public/icons/tokens/susd.png` is missing from the app.
- Nothing in the repo writes `copy_trade_leaders`, so the live copy-trading leaderboard is probably empty. This was
  not checked against production. Its footer's "Updated every 5 minutes" has nothing behind it.
- `StreamShareModal.tsx:305` leaves an empty slot for an unknown viewer count.
- `getFollowers` and `getFollowing` report 0 followers when the read fails.
- The badge-award user search escapes `_` and `%` twice.
- `VegasFortunePageSections.tsx:522` has a page-heading bug.

## For Casey

**Security and money:**

- Revoke PUBLIC on the four admin functions (a `_pending` migration), or grandfather them after a live
  check.
- The SKAI-stake gate at the keeper.
- Which withdrawal fee is real, 1% or none.
- The five mines settlement cases: `255c9d17` turned mines from refusing a stake into opening a keeper
  round. Retire them, re-point them, or block mines again.
- The Plinko test's paytable copy predates the 95% retune.
- The swap fee fallback: (a) re-point its tests to 1% and state the unit; (b) refuse, or show unavailable, when the
  fee read fails; or (c) delete the unused helpers.
- The three points writers that skip `points_history`: approve the migrations that add the write. Should launch
  points go on-chain at all?

**Tests waiting on a ruling:**

- `discordVerifyMountTombstone.test.tsx` (0/7) tests Discord-verify tracking that was removed on purpose on 06-04.
  Delete it, rewrite it to test the redirect, or keep it red?
- Resting buys and sells draw identically on the chart, while the comment at `spotChartOrderLines.ts:26-28` says
  otherwise. Keep the frame's chip, or add the side?
- Viewer counts: the browse card prints "1234 viewers" and the watch player "1,234". Group them in
  `formatViewerCount`, or rule them ungrouped? `StreamCard.test.tsx` waits on this.
- Copy-trading periods: its default 30D view is now all dashes, because nothing measures a period. Build real
  per-period stats, or default to All Time and hide the shorter periods?

**Housekeeping:**

- Git's https credential has expired.
  - Meanwhile, pushes and fetches go over SSH, which still authenticates as skaicasey.
  - Running `git fetch` in a terminal and signing in restores https.
- Dedupe framer-motion and radix in the build, or align their versions. The chunk-budget test waits on it.
- `.gitattributes`: `*.mjs text eol=lf`, or drop `dep-gate.mjs`'s hashbang.
- The Figma and Supabase connectors are still disconnected.

**Design calls from the frame lanes, one line each in their status rows.** The larger ones:

- the 768 game-page gutter (30 on the boards, 16 shipped);
- the Discover table family (1061 or 1053);
- whether the TP/SL notice keeps its card done;
- where each "Rewards" entry should land (the account menu and the mobile nav open different pages under
  one quest target).

## The fold

- **Catalog:** `877b995` is on skai-ui origin. A peer's `afcc6df4` (two casino hero slides) sits on top of it.
  - This record's commit puts the seven vverify tables back to LF, which changes no content.
  - It also regenerates the `implFiles` that `afcc6df4`'s rows call for on seven casino hero frames. The figure is
    unchanged.
- **App:** every lane commit reached origin through peers' full pushes of the shared `main`.
  - The last 12 landed at about 02:22: nine test repairs, and three fixes (the sidebar rename, the watch player's
    dash, the copy-trading leaderboard). The fold was verifying them at the time, as a cherry-pick candidate
    (`4ea62eb75` on `4929885de`).
  - The fold itself pushed only the app repo's skai-ui pointer bumps.
- **Checks:** run on that candidate, and again on origin's head `e40ecb41d` with the bump.
  - No migrations in the fold's own commits.
  - The 14 test files the 12 commits touch pass 277 of 278 cases. The one red is the points-writer oracle above.
  - `typecheck:gate`: no new errors, with 2,509 known and 16 fewer than baseline.
  - `npm run build`: exit 0.
- **The bump was gated again** on each base it was pushed onto: origin moved three times while the checks ran.
- **Not deployed from the fold.** A peer session was running deploys meanwhile, which it reported as having
  Casey's go.

## Carried

- The shared skai-ui `dist/` rebuild. It waits on the peer's deploys, which asked that nothing else build skai-ui
  meanwhile.
- The shared skai-ui checkout holds a peer's local twin (`abb62ab`) of `afcc6df4`. It is left for its owner to sync.
- 25 stale layout comments that the gutter lane logged outside its four files.
- The hand-offs named in the status rows.
