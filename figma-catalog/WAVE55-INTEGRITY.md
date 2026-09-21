# Wave 55 integrity record (2026-09-20)

Casey at 16:2x: "continue." Wave 55 is the wave 54 shape (file-disjoint lanes, twenty at once,
rolling refill) run alongside another session's bug-fix fleet in the same tree, with Casey's
three rulings of 12:59 at the top of the lanes they touch.

**Result: 981 done of 3,825 (25.6%), 523 visually verified** — up from 929 (24.3%) and 473 at the wave 54 fold, on an unchanged denominator. 242 status rows across twenty lanes (74 done, 153 partial, 8 blocked-on-backend, 6 frame-defect, 1 not-started). Registry: 57 frames partial→done, 2 done→partial by their own verdict, 8 partial→blocked-on-backend, 6 partial→frame-defect, 1 partial→not-started; 4,801 frames in and 4,801 out, no title, implFiles or verifiedAt lost. Visually downgraded frames rose from 54 to 71, which is the verdict rule doing its job.

## 0. Shape

- Thirty-one briefs generated, twenty dispatched at 17:00 in one call (`wave55/make-briefs.mjs`,
  derived by `patch-briefs.mjs`). CAP 14 frames per brief, 396 rows briefed this pass, 434 rows
  held behind peer fences, 23 fenced outright. Eleven briefs were held back because the bug
  fleet's wave C and its five ruling lanes hold their surfaces: home-sidebar-layout,
  onboarding-landing, trade-bridge-deposit-chart, trade-perp, trade-spot,
  trench-discover-shell-launch, social-groups-tokens, social-messages, help-legal-nft-tx,
  learn-pages, skai-ui-primitives.
- Rules: `LANE-RULES-0920c.md`. New this wave: the wave 54 sentence claiming the gate compiles no
  test file is DELETED and replaced by the measured fact (the gate does compile test files under
  `src/`; what it misses is extra errors in a file that already carries baselined ones); the perp
  rail is dead, so perp UI is measured and never wired; the validators page returns an honest
  empty set that renders as a confident zero, and the explorer lane closes that with an
  `unavailable` flag; a Supabase 42501 is INTENDED this week, because four RLS migrations reached
  production on 2026-09-20, and is reported rather than "fixed".
- Figma: all 51 pages hash-checked equal at 16:3x with the generated verify script
  (`harvest.mjs verify-ingest --write` stamped 2026-09-20). The denominator moves only by the
  furniture calls recorded in section 2.
- Fences (`wave55/peer-files.txt`, 68 entries): the bug fleet's wave C (trench discover,
  trackers, settings and live, `src/pages/trench`; the Spot page, `ConnectedOrderBook`,
  `MarketHeader`, `order/`, `MarketSearchModal`, `AIConfidenceStrip`; predict-redesign new,
  sports and futures; the whales screens) and its five ruling lanes (the perp terminal and
  `perp-v2/`, `services/perp/`, the LI.FI bridge services and `env.ts`, `modules/skai-chain`,
  `skai-bot`, `skai-landing`, the price-grid game, `supabase/`, `scripts/aws/`, the
  tier/subscription hooks), plus the standing Solana, auth and spot service list, the offer and
  command surfaces, and `docs/`. The fleet held its batch 2 until this wave reported, which is
  why play and slots, home, portfolio, sports, rewards, launchpad, account, upgrade, streaming,
  the crypto token page, social, defi, explorer and the wallet were ours.

## 1. The model-tier limit, and the fence check it bought

- A first dispatch at 16:5x lost all twenty lanes within minutes, most of them still reading. Not
  all: home-portfolio-feed had already written its complete fourteen-row status file at 16:52,
  which the re-dispatched lane of the same name would have duplicated key for key had it not been
  told. The 429 was not the session window that killed wave 54 twice: its
  body read "You've reached your Fable limit. Switch to another model, or manage usage credits",
  and named the model sent to the API. That is a model-tier limit, and a session reset does not
  clear it. Casey switched the session to Opus; subagents inherit the parent session's model, and
  the re-dispatch at 17:00 passed `model: opus` explicitly. All twenty launched clean.
- The accident bought a re-check, and the re-check found a real defect. `make-briefs.mjs` is
  supposed to let a peer's hold beat a lane's owns, but it does not strip the swallowed entry
  from the printed **Owns** list, so three briefs listed a path that `peer-files.txt` holds
  outright AND listed the same path under **Fenced**: `games-instant` owned the price-grid game,
  `trench-trade` owned six files in trench discover, `home-whales-screens-ai` owned the whole
  whales directory. Two of the three were dirty in `git status` at that moment, mid-edit under
  the other fleet. All three entries were vestigial, so each lane kept a full fourteen-row slice
  once they were stripped, each under a dated withdrawal line above its Fenced block. The check
  is now a command and not a trust: flag every `Owns` entry `o` for which some peer prefix `p`
  satisfies `o === p || o.startsWith(p)`. The reverse direction, a peer holding a subdirectory of
  a lane's owns, is the normal carve-out and is not a collision.
- `baseline-dispatch.txt` records every repo HEAD and every dirty path at 16:55, so any file this
  wave did not write can be attributed to its owner at the fold rather than guessed at.

## 2. Lanes

| lane | brief | rows | done | partial | other | commits |
|---|---|---|---|---|---|---|
| games-table | 14 | 7 | 3 | 4 | 0 | 7825fffc, 58f69d3a, 549c05e0 |
| wallet-components | 14 | 14 | 4 | 10 | 0 | 7af235f, 4a7dc31, 0b5ab22, 75cd5af, 070a26e, f40d421, 2b830ee, e404af0, 1d99d4c |
| explorer | 14 | 4 | 0 | 4 | 0 | 8a00e515b, 286f52e12, 751a3e3a2, 0d4f22f12, 77fe91995 |
| home-portfolio-feed | 14 | 11 | 3 | 8 | 0 | 90ef3d364, cb1b3b5b7 |
| play-hub | 14 | 14 | 0 | 14 | 0 | 2aa5617e, 3458c3d3 |
| games-instant | 14 | 16 | 8 | 8 | 0 | ba27a3c3 |
| slots-sugar-starbound-vegas | 14 | 14 | 8 | 6 | 0 | 561cf7ed, 9ccebbae, 3ce217f2, fd708d07, 35af5bad, d5a7002e, 956a6d9d |
| predict-detail | 14 | 14 | 2 | 12 | 0 | f30bcce99, b8d847eba, dc9b423c8, 602ef88d6 |
| social-profile-discover | 14 | 14 | 8 | 3 | 3 | 3bc8d601d, a5f7a28c0, 6212c9c46 |
| trench-trade | 14 | 12 | 7 | 4 | 1 | d8c301673, 28bbb2124, 5338da76a, 928bad37a |
| slots-hooked-untamed | 14 | 14 | 8 | 6 | 0 | 9c856de8, 5b1a1bb2, aeae9c5f, 03ab6d88 |
| governance-dao | 14 | 14 | 0 | 14 | 0 | a77b51338, 2a3037f24 |
| account-notifications-rewards | 14 | 10 | 3 | 6 | 1 | aa60b810a, 576de28b8, cd5b5068c |
| home-whales-screens-ai | 14 | 14 | 7 | 7 | 0 | 6f7075533, 3eb4b9e21, cfc86c69c, 5a30153cc, 463d58bc7 |
| sportsbook | 14 | 7 | 1 | 2 | 4 | db353dc0, d7b3350b, 2d119f69 |
| predict-dashboard | 14 | 14 | 1 | 13 | 0 | aab320547, 17e540cf5, 5070d3199 |
| defi-earn | 14 | 10 | 0 | 10 | 0 | 4a21f12d6, 8a495d13d, 00a1a70ec, 2aaca07c8 |
| wallet-shell-pages | 14 | 17 | 9 | 6 | 2 | d0cc7e7 |
| streaming | 14 | 8 | 1 | 7 | 0 | 5b16f55f6, 9a69c8f26 |
| social-feed | 14 | 14 | 1 | 9 | 4 | ea368f6da, f526a2fec, f526a2fec |

Rows: 242. Verdicts: done 74, partial 153, blocked-on-backend 8, not-started 1, frame-defect 6.

## Decisions named by lanes
- **games-table**: (a) drop the History rail at lg so the block packs 356+8+954, or keep it and accept 656; (b) the 375 title row's x=23.5 w=328 against its four siblings' 16/343, frame defect [shipped] or reproduce, which moves every routed game via playPageTemplate.ts.
- **wallet-components**: (a) keep the 346 phone column [shipped] or take 7882-18863's 328/24; (b) keep the CTA at 44 [shipped] or take 7728-59766's 46 on the reset screen alone; (c) keep 7806-82583's 24 slippage seam [shipped] or take 7806-82649's 20.
- **explorer**: (1) the gas board's chart block is a 7x17 calendar heat map of daily average gas and no source exists (the indexer reports no gas series), so keep the live 20-block base-fee line, or replace with an unavailable panel, or add an indexer series; (2) the NFT board's 8-column table has no field on NFTCollection for 6 of 8 columns, so keep the cards or build it mostly em-dashed; (3) the AI and NFT boards each draw a 103x34 range control with no ranged read behind it, so leave unbuilt or draw it disabled.
- **home-portfolio-feed**: (a) the empty Copy-Trading toolbar, keep search [shipped] or crop to the frame; (b) the hover scrim on feed and InsightX [shipped] or revert to the dim.
- **play-hub**: (1) Plinko cover zoom, keep object-cover [shipped] or per-raster 130.91% on plinko alone; (2) Mines cover band, keep opaque #00609B [shipped] or accentAlpha 0.8 on mines alone; (3) RTP hero art 354x244, commission the raster or leave the copy card full width; (4) RTP "Read FAQs" CTA, name an off-site URL or point at the page's own accordion and drop the external glyph or leave unrendered [shipped]; (5) the +$200 (68%) tile, leave refused [shipped] or name the settlement currency so it can print.
- **games-instant**: (a) win-card badge, rail symbol [current] or the frame's fixed disc or a per-rail disc; (b) Auto Classic's "Bet On:" / Advanced / Potential Profit, keep [current] or drop; (c) 768 cut divergences, follow base or build a tablet rung.
done: 9190-14926, 9178-14783, 9190-15379, 9190-16004, 9190-14969, 9190-16383, 9204-16958, 9003-130613 (the last six on Casey's 12:59 ruling). partial: 9204-17308 (row top 217.18 underivable), 9204-17182, 10215-6194, 9003-132438, 9003-132031, 9178-14134, plus dice 9069-8353 and 9079-6072, first reads ever, both real 768-stage panels, retiring vverify.dice.tsv's "non-UI artifact".
- **slots-sugar-starbound-vegas**: what raises the refresh screen (11930-40031), a failed settlement, a lost socket, manual control, or design-only.
- **predict-detail**: the $1.00 cell on four ticket boards, stays empty by the rate rule and the rows close, or an explicit unavailable state, or build when SKAI lists; the outcome card's 44px, keep three lines and the row stays partial, or merge question and window as the frame does, closing 22; quick-bet sheet 10594-48407, execution path or prefill, pinned at 375/768 or not; selected sports card 10201-106360 needs a host, and the redesign sports directory is a peer's, so a ruled build is a hand-off.
- **social-profile-discover**: Posts on /discover, a view of the page [shipped, matches both boards] or restore the link to /social and leave Frame 302 unbuilt.
- **trench-trade**: (a) re-census Transactions 13006:233358 for row rules, or keep the opt-out; (b) build Holders' nine columns with five unavailable, or keep four.
- **slots-hooked-untamed**: (a) 11637-25043's description, content.ts's figure-free sentence or the frame's paragraph carrying another game's RTP; (b) the tablet menu draws "Expand" on rows 3 and 5, a frame defect with the fifth label unknown.
- **governance-dao**: the proposals filter row (search plus status select) is drawn by no board at any width, keep it as shipped or remove it as the hero was removed.
- **account-notifications-rewards**: (1) Private key, keep the wallet door [shipped] or build the password-and-reveal flow or redraw the frames; NEW FACT, /portfolio already reveals a key on this origin (ExportKeyModal plus PortfolioScreen), so item 11's "one origin" premise is stale. (2) "Reset to default" CTA, leave out [shipped] or define per-store defaults or drop. (3) the 768 toggle, keep 40.593x24 [shipped] or draw 60.889x36.
- **sportsbook**: House vault placement, build it inside Earn as the frame draws or keep the /earn/house-vault to /sports?tab=pool redirect and treat the Earn framing as a frame defect; the deposit card's lock tiers (Ninety / 16.0% APY / Bonus 6% / Exit 10% pro-rata) and its Solana SOL rail, supply a real source or drop them from the frame; the 375 slip gutter, 12 as shipped or 16 as three boards draw.
- **predict-dashboard**: (a) 10100-103339 draws the phone hero above the search row and 10509-18308 draws none, so ship above, keep below, or split by board; (b) category tabs, drop the section heading and hero to match, or keep as ruled.
- **defi-earn**: the Earn rail draws four pills (All, Staking, Lending, Vault) but the same board lists three POOLS, so ship five or drop pool filtering.
- **streaming**: the card's top-right chip, keep the session P&L [shipped] or print the creator-token market cap the board draws (now reachable) or drop it.
- **social-feed**: dropdown-time, six windows with windowed figures, or six windows over all-time figures, or keep "All time".

Every shipped default named in brackets above stands until Casey says otherwise, as in
WAVE50 section 5, WAVE51 section 3, WAVE52 section 3, WAVE53 section 3 and WAVE54 section 3.

## 4. Verification

- Final `typecheck:gate` on main with every lane reported and skai-ui dist rebuilt: **green, and it took three runs at three different bumps to get there.** `[typecheck:gate] ✓ no new type errors. 2516 known baseline error(s); 82 fewer than baseline` at 18:17:30 on bump fe27cf884, run DETACHED in `skai-deploy-clean`. Run 1, on the first bump, printed 3 NEW — all residue of the bug fleet's partial fix to its own trench tests (`DiscoverScreen.test.tsx` missing `source` on a second token literal; `rowIntelHeldRow.test.tsx` passing `hidden` where the prop is `hiddenColumns`), fixed by that session in f2b764ca3. Run 2, rebased onto it, printed 1 NEW and it was OURS: `IntroScene.ts` TS2305, the slots lane's commit that named the em-dash also deleted `volatilityBand`, which the scene still calls; restored beside the constant (gaming e3cb4c9e, 430 engine tests green, and the gate's own instrument run raw showed 2,554 total error lines with zero on those two files). Run 3 is the green one. ★ A gate run on the SHARED tree had printed 8 NEW, four of which were the bug fleet's killed lanes' uncommitted files, including a rename caught mid-flight; none was committed code. The gate reads working copies, so with a peer fleet in the tree it must be run detached at the commit being pushed.
- skai-ui dist: not rebuilt this wave. No skai-ui source commit landed (the primitives lane was one of the eleven held briefs); the wave 54 dist stands.
- skai-wallet: two wallet lanes ran, wallet-components (seven commits) and wallet-shell-pages (two), each running `tsc --noEmit` to exit 0 inside the submodule before every commit; wallet HEAD at the fold 1d99d4c.
- skai-gaming tsc: **1,995 errors against the 2,002 baseline, exit 2** — seven BELOW baseline, on gaming e3cb4c9e in the clean worktree, 18:16:02 to 18:44:25 (28 minutes). Of the 49 gaming files this wave changed, exactly one carries any error: `BaccaratGame.tsx`, with the same three wave 54 recorded as pre-existing (TS2554 at :1151, TS2339 `trackBetPlaced` at :1316, TS2322 at :1816). No error in any file this wave wrote.
- Catalog: `row-tree-check.mjs` and `bp-report.mjs` exit 0; pipeline exit 0 and `catalog:check` clean (every derived file matched its inputs); registry diff against the pre-fold snapshot: 4,801 frames in, 4,801 out, 0 gone, 0 added, 0 lost titles, 0 lost implFiles, 0 lost verifiedAt.
- Row integrity, checked incrementally as lanes reported rather than once at the end
  (`verify-lanes.mjs`): every reported lane's status file was read for row count, duplicate keys
  within the file, duplicate keys across files, field count and breakpoint stamp, and every path
  in its owns was matched against `git status` in the repo that holds it. At the fold: 242 rows, 242 distinct keys. Ten keys had carried two rows each during the wave — the six Private-key frames between home-portfolio-feed (hand-off) and account-notifications-rewards (read live, three built in aa60b810a), and four between defi-earn and governance-dao (two each way, each built by the other) — and in every case the hand-off row was demoted to a dated comment so the building lane's row stands alone. One lane (slots-sugar-starbound-vegas) found two instances of itself had written one file and merged rather than clobbered. The wave's one killed-then-resumed lane (home-portfolio-feed) was told what its file already held before it appended, and confirmed no double append.
- Feed: `emit-parity-json.mjs` wrote 981 / 3825 / 523 (25.6%) measured 2026-09-20T23:56:52.656Z, harvestedAt 2026-09-20; committed in skai-landing 9114623 and pushed, uploaded to s3://skai-trade-landing with no-cache headers and invalidated on E1FW8675ZA7SZQ (I960AOXDTO5U4IYFMKYB7M0N0L). The live feed at https://skai.trade/figma-parity.json reads **981/3825/523**. It went out BEFORE the app deploy, because the feed depends only on the committed catalog. ★ The first invalidation call failed with InvalidArgument: Git Bash rewrote the leading-slash path into a Windows path. `MSYS_NO_PATHCONV=1` in front of the aws call fixes it.
- Pushes: skai-ui 3a46073 (fold) and this record's follow-up; skai-gaming e3cb4c9e; skai-wallet 1d99d4c; main to dfbc00792 before the bump (the peer fix f2b764ca3 and the docs bump included); bump fe27cf884 pushed tmp:main from the clean worktree after both gates printed green there.
- Peer items landed or found during the wave, for the record: the SKAISubscription contract deploy that appeared unattributed at 16:5x was Casey's own (the app now points at it, a5db43b94; the genesis predeploy it replaced has zero bytes, which is why every user resolved Free; owner is the deployer key with no Safe on the chain to move it to, Ownable2Step present, 48h upgrade delay — bounded and known); `bp-report.mjs` went red at 17:1x on two malformed rows in the bug fleet's `status.bugs-0920.spot-buy-and-board-a.tsv` (bare width in the breakpoint column) and the owning session repaired both in skai-ui 9a37bde within minutes; the bug fleet's own gate caught one new error in this wave, an unused React import in `EarnPageHead.figma.test.tsx` (fixed, 8b448561b), and four more on its own surfaces that turned out to be its killed lanes' DIRTY files rather than committed code, which is why the gate for this wave runs detached at HEAD; the private-key item raised by the account lane was re-scoped by the bug fleet after a trace (the password derives the decryption key, so it is scoping, not a hole); the bug fleet took the `useRecentBets` cold-load confident zero and the two routed-game spacing fixes off this wave's hand-off list; `AIAgentManager.tsx` dirty during the wave was the bug fleet's Sentry fix, committed a1c2ba9c5.
- Release: pointer bump fe27cf884 from the clean deploy worktree (skai-ui 3a46073, skai-gaming e3cb4c9e, skai-wallet 1d99d4c); `deploy_main.ps1` ran from that worktree and `https://app.skai.trade/version.json` reads **skai-trading@20260920-2303-fe27cf884 dirty:false commit:fe27cf884de3cea92b0c82a71df7a2d5fbda6eb9**. Live before it: 4e111f8ed (wave 54).

## 5. Cross-fleet conduct, because it decided how much of this wave happened

Casey ran two fleets in one working tree tonight: this catalog wave and, from 17:2x, a twenty-lane
bug-fix fleet in another session, on the same surfaces. Three mechanics carried it, and they are
worth repeating rather than re-deriving:

- **The fence is a file, not a conversation.** `peer-files.txt` held the other fleet's paths and
  `EXCLUSIONS-for-a8.txt` held mine, generated from the lanes' own briefs rather than typed. When
  the other session needed surfaces back mid-wave, the answer was a regenerated file of paths,
  not a list of surface names, because its lanes were writing fixes and a stale fence costs a
  revert rather than a re-read.
- **Hand back as lanes report, not at the fold.** `handback.mjs` releases the owns of every lane
  that has reported, minus anything a still-running lane also owns. Three batches went back
  during the wave and unblocked the other fleet's play, game detail, account, sportsbook and
  predict rows hours before this record existed.
- **A shared gate cannot be partitioned by a file fence.** `bp-report.mjs` went red on two
  malformed rows in the other fleet's status file, which no lane of mine may edit. The fix was to
  send the owning session the exact lines and the expected shape, and to tell all twenty lanes in
  one broadcast to read the gate as "no line names YOUR file" until it cleared. It cleared in
  minutes. A lane repairing a stranger's row to make its own deliverable pass would have written
  a verdict nobody measured.

## 6. Next

- The eleven held briefs are the next wave's first dispatch once the bug fleet's batch 2 folds and hands the surfaces back: home-sidebar-layout, onboarding-landing, trade-bridge-deposit-chart, trade-perp, trade-spot, trench-discover-shell-launch, social-groups-tokens, social-messages, help-legal-nft-tx, learn-pages, skai-ui-primitives.
- `apply-verify` silently drops any verdict outside match / partial / deferred / not-wired: 72 written verdicts reach no artefact, and 42 of the 55 written as `done` sit on frames the registry already calls done. Casey's ruling at this close decides whether those 42 are converted; the warn-instead-of-skip change is owed regardless.
- Owed and unassigned: `src/shell/panels/TxDetailPanel.tsx` is built to the wrong node and five of its eleven rows need the unavailable state (wallet-components); the `md:hidden` crumb pattern leaves a stray top margin on every explorer page, one pass; `SlotGame.test.tsx` cannot collect on a missing thirdweb env and leaves `SlotGame.tsx` unexercised, one env stub; `getTokenHolders` still returns `[]` from its catch at the service, the consumers are guarded.
- Carried rulings now built: the Baccarat Chip Value stake setter (7825fffc) and the routed NFT-detail page (wallet e404af0, 1d99d4c). Still owed: the spot 99x26 control at opacity 0 (a peer's file) and the perp Funding-history ledger (dead rail, measure only).
