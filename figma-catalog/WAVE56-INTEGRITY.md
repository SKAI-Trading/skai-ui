# Wave 56 integrity record (2026-09-21)

Casey at 00:0x: "continue a big wave." Wave 56 is the wave 55 shape (file-disjoint lanes, twenty
at once) run alongside a bug-fix fleet that has grown to eleven lanes in the same working tree,
with Casey's three rulings of 23:3x at the top of the lanes they touch.

**Result: 1,056 done of 3,825 (27.6%), 635 visually verified** — up from 981 (25.6%) and 560 at the wave 55 close, on an unchanged denominator. **+75 done and +75 verified**, the largest single-wave movement so far. 190 status rows across twenty lanes (83 done, 94 partial, 6 frame-defect, 5 furniture, 2 blocked-on-backend). Registry: 67 partial→done, 10 unknown→done, 1 not-started→done, 4 partial→frame-defect, 5 unknown→furniture, 5 unknown→partial, 2 partial→blocked-on-backend; 4,801 frames in and 4,801 out, no title, implFiles or verifiedAt lost. Visually downgraded frames FELL from 71 to 69, because two frames a verdict had been holding down were measured and closed.

## 0. Shape

- Thirty-one briefs generated, **twenty dispatched** at 00:05 in two calls of ten
  (`wave56/make-briefs.mjs`, derived by `patch-briefs.mjs`; the sportsbook lane is behind the
  `SPORTSBOOK=1` env flag and was missing from the first generation until the pre-dispatch check
  caught it). CAP 14 frames per brief, **262 rows briefed across the twenty**, 723 rows held
  behind peer fences, 13 fenced outright.
- **Seven briefs were dispatched for the FIRST TIME in any wave**, having been held through 54 and
  55 while the peer fleet owned their surfaces: onboarding-landing, trade-bridge-deposit-chart,
  trade-spot, social-groups-tokens, social-messages, learn-pages, skai-ui-primitives. None of them
  carries a prior measurement, so each was told to read its boards whole rather than lean on a
  carried number.
- **Eight briefs were NOT dispatched, and the distinction between the two reasons matters.** Seven
  because the peer fleet owns their directories outright and no honest slice remained:
  home-sidebar-layout, home-portfolio-feed, home-whales-screens-ai, trench-trade,
  trench-discover-shell-launch, predict-dashboard, predict-detail. Shrinking a lane into the gaps
  is how two fleets end up in one file, so they were dropped instead. The eighth,
  help-legal-nft-tx, generates **zero rows because every frame in its slice is already done** —
  that lane is finished, not blocked.
- Rules: `LANE-RULES-0921a.md`. New this wave: Casey's SKAI-price ruling with its limits attached;
  the sportsbook lock-tier ruling stated as a constraint rather than a licence; the four facts the
  peer fleet handed over (gate and build green at HEAD, `DiscoveredToken.source` now required, the
  fee split live at 100% to vault stakers, and two files finished tonight that must be read at
  HEAD); and the note that `apply-verify` now WARNS on a verdict word it cannot apply.
- Figma: all 51 pages hash-checked **equal, 0 changed** at 00:2x with the generated verify script,
  stamped 2026-09-21. No harvest owed, and the denominator does not move by design this wave.

## 1. The fence, which was the wave's main constraint

`ListAgents` showed nine peer sessions at dispatch, and the bug fleet had grown from five lanes
holding files to **eleven lanes holding whole directories**: all of `src/components/trench-redesign/`,
all of `src/components/home-redesign/`, `src/components/account/portfolio/`, `src/pages/predict/`,
`src/components/predict*/` and the CSP scripts. Three of its lanes are **cross-cutting** — they
work a row list rather than a directory (/streaming, /play/scratchers, /play/casino, /trade/live,
/trade/perps, /messages) — so every wave 56 lane carries the instruction to report rather than
fight if it meets one.

Negotiated by asking what the peer HELD rather than announcing what this wave would take. That
reply named three lanes to drop, confirmed one carried ruling was free ("the spot control is
yours"), and handed over four facts that would otherwise have cost lanes hours to re-derive.

**The pre-dispatch fence check earned itself for the second wave running.** Cross-checking every
dispatch lane's owns against `peer-files.txt` caught `onboarding-landing` owning
`src/components/auth/` and `trade-perp` owning the perp terminal and `perp-v2/`, all peer-held;
each was stripped under a dated withdrawal line. The same pass caught the sportsbook lane missing
entirely, which turned out to be the env flag rather than a fault.

**Two sessions had appeared with no fence at all** (`b5`, `99`), both busy. Both were sent this
wave's full path list. `99` answered disjoint at file level — market-making bot and chain gateway,
nothing under `src/`, `modules/skai-gaming/` or `modules/skai-ui/`, everything committed — and is
now recorded in `peer-files.txt` so a later wave does not re-ask.

## 2. Lanes

| lane | brief | rows | done | partial | other | commits |
|---|---|---|---|---|---|---|
| onboarding-landing | 14 | 14 | 1 | 13 | 0 | ab0e3ba, 8160be7, 84b2c95, 55642bd9 |
| trade-bridge-deposit-chart | 14 | 4 | 1 | 0 | 3 | 94fb8164a, ab6ccf5eb |
| trade-spot | 14 | 8 | 2 | 5 | 1 | 8179b9542, 8099d6610 |
| trade-perp | 8 | 9 | 0 | 4 | 5 | 7edc6b2e7 |
| social-groups-tokens | 14 | 4 | 0 | 4 | 0 | ed7d7af55, 793aa02 |
| social-messages | 14 | 1 | 1 | 0 | 0 | 9447b94bf, 3a0cd9a00 |
| social-feed | 14 | 14 | 8 | 6 | 0 | f6a65492b, 156eff59a, e2cfb5bf1 |
| social-profile-discover | 14 | 7 | 4 | 3 | 0 | 0c48bc836, 023913d65, bc4c630ab, c347df710, 0f31fed8f |
| governance-dao | 14 | 11 | 2 | 9 | 0 | 860e45721, 399c51142, c6f43e8a9 |
| learn-pages | 14 | 14 | 11 | 3 | 0 | a598d4c55, c103bd25f, 4e5d03094, ef401463a, cc08270b5 |
| skai-ui-primitives | 2 | 5 | 3 | 0 | 2 | 0d83a20, b2de9a1, d12fcaa |
| explorer | 14 | 10 | 3 | 7 | 0 | 8ea1027f9, c7213d1cb, 1b058a95e, 9831673a8, e92139534 |
| sportsbook | 14 | 10 | 8 | 0 | 2 | c88594dc, 7fb22881, 62d8bb4cc |
| streaming | 14 | 5 | 4 | 1 | 0 | 89938a559, b75ef924c |
| games-table | 14 | 11 | 4 | 7 | 0 | abcf71b1, aa0e67b2, faf14173 |
| games-instant | 14 | 12 | 10 | 2 | 0 | ec07f277, d4a8c064, 312eb1ac, 4cb8128b, efe1468d |
| play-hub | 14 | 16 | 0 | 16 | 0 | f08b3ca4 |
| slots-hooked-untamed | 14 | 13 | 9 | 4 | 0 | ae601809, 2ab873c6, d8dc3081, c9980e27, 2e1e24ca |
| slots-sugar-starbound-vegas | 14 | 16 | 10 | 6 | 0 | eb416b84, 07dbd80f |
| defi-earn | 14 | 6 | 2 | 4 | 0 | 8df33a095, 0a89737e3, 4fbc51494, 979eb15a7 |

Rows: 190. Verdicts: done 83, partial 94, frame-defect 6, furniture 5, blocked-on-backend 2.

## Decisions named by lanes
- **onboarding-landing**: (1) the onboarding column, keep centred (bug 55642bd9) or take the frames' absolute anchors, since ExternalWallet already top-aligns and hits y202 exactly; (2) counterSuffix, "Users are already winning with us" (two boards) or "Traders..." (1440); (3) the 375 dashboard order, keep or put referral above the AI panel or drop the two surplus cards.
- **trade-bridge-deposit-chart**: (1) the Bridge Route row draws "Skai Mainnet" under a Solana-to-Base header, a chain that is NEITHER END of its own route — design re-draws it, or it is a deliberate destination summary; (2) does /spot get a holders table (10706-128843/128950/129546), given its columns are Trench's and keyed on a per-wallet SOL balance the chain does not carry.
- **trade-spot**: the Fees readout, keep 0.1000/0.2000, or draw the frame's, or render unavailable until the chain schedule is readable.
- **trade-perp**: (a) keep the unavailable block or draw the ruling's ledger now knowing it renders zero rows; (b) count the loose 966/910/490 tables as parity targets or mark them furniture.
- **social-groups-tokens**: (1) the token-gated lede, print the deposit clause once a debit exists or keep it withheld [shipped] — it blocks EVERY create-panel frame from closing; (2) the Created-tab "Token req." block, which 768 (11398:87378) draws as 1440 does and only the 375 redraw omits, so build it with an explicit unavailable left or keep the redraw [shipped]; (3) rules_details, where the panel frames draw one rules field and the page frame draws "Additional details", so keep its editor (the only one) or drop it and make the column read-only.
- **social-messages**: (a) the typing bubble's side, the typist's [shipped] or the frame's own-message side; (b) the Groups rows' second unlabelled chip, name what it counts or drop it; (c) the quoted-reply mirror side (11387-72346).
- **social-feed**: (1) dropdown-main (302936/302943), the panel replaces the four nav pills with Top 20 becoming a fourth row, or it scopes the search only and the pills keep the view, or the pills stand and the panel is superseded — NOT MOUNTED, because it is a subset of an existing control and mounting it gives one state two controls; (2) dropdown-time, make the figures windowed or six windows over all-time figures or keep All time — built as the last, drawn honestly with six windows all disabled with the reason and nothing marked selected.
- **social-profile-discover**: the 1440 shelf heading reads "Highest market cap STREAMS" (10303:229901) while 768/375 read "Highest market cap". It ships the shorter one, because no stream joins to a bonding curve and the card already says so three times. Keep the shipped wording, or ship the frame's word, or feed the shelf from streamingService and drop the market-cap sort.
- **learn-pages**: (1) the shelf page's two 140x34 selects (Popular, All groups), build as a client sort over view_count/created_at, or leave open until a ranked read exists, or drop them — not built, because listCourses takes neither argument; (2) the row's "Buy course" pill needs a price and community_courses HAS NO PRICE COLUMN, so author the column to supabase/_pending/ or keep the open action (currently the latter); (3) at 375 the tag is drawn on the FREE card and hidden on the paid one, the REVERSE of 768/1440 — design defect or intended.
- **skai-ui-primitives**: (1) Login ENTER/ring, keep Sky Blue or match sign up's green or have design draw the state; (2) the two ALTs, redraw from their instances or retire.
- **explorer**: (1) the per-row kebab (11998:245436, 11998:247449, 11991:234354 — three frames, one unknown, entries never stated), leave undrawn or build with the row actions the page already does or Casey supplies the entries; (2) the address line's plus/alarm/share glyphs, leave undrawn or build watchlist plus alert plus share or drop them from the frame.
- **sportsbook**: (1) House vault inside Earn as drawn, or keep the /sports?tab=pool redirect; (2) does the HOUSE pool get tiers at all, since tierConfigs is the TRADING vault's and the board labels its contract "Trading vault" three times; (3) what record stands behind Bonus (1/6/10/15%), or is the column dropped.
- **games-table**: (1) the Baccarat 1440 board is 656 not 952, a 224 History rail no frame draws — drop the rail at lg, or float/relocate it, or widen past 1318 (needs 1582), or rule 656 the shipped board; the 375 half is already fixed and the "341" in the old row was stale. (2) Baccarat Auto On Win/On Loss/Stop — the locked Advanced toggle IS the expansion's unavailable state so the row is done, or build them unavailable behind a toggle that never opens, or a real auto loop.
- **games-instant**: (1) dice's two 768 cuts DISAGREE — panel column 444 against 398, toggle 40.59x24 against 37.93x21.33, On Win pair 332 against 286; 468 ships, so keep 468 or let 422 govern. (2) 11711-5905 omits Number of Bets where 11711-5985 draws it at 375 — keep the control or hide it on the collapsed Auto cut.
- **play-hub**: (a) a per-game live-stream source for 9132-93239, name one or leave the picker empty; (b) the RTP FAQ CTA still has no destination, unlike this one.
- **slots-sugar-starbound-vegas**: (1) desktop menu 10400-5509, keep the working 380x430 drawer [shipped] or cut to the frame's five-row 167x188 popover, losing volume and the certified rules; (2) the status row (05:28, Skai, Starbound) on the Home boards, none [shipped] or draw; (3) 10387-4470 idle grid, placeholders [shipped] or a drawn state; (4) 11930-39529 against 11930-41016 wins table, a 7-column scroller or 3 columns, two generations and neither an ALT.
- **defi-earn**: (1) the Earn rail, keep five pills [shipped] or drop Pool and leave the board's own pool rows unreachable from the filter; (2) the "more" affordance, pager only [shipped] or a "Show more opportunities" link only or both by board.

Every shipped default named in brackets above stands until Casey says otherwise, as in
WAVE50 section 5, WAVE51 section 3, WAVE52 section 3, WAVE53 section 3 and WAVE54 section 3.

## 4. Verification

- Final `typecheck:gate` on main with every lane reported and skai-ui dist rebuilt: GATE_LINE
- skai-ui dist: DIST_LINE
- skai-wallet: not touched this wave. No wallet lane ran (wallet-components and wallet-shell-pages were among the eleven briefs held back), so no wallet tsc and no wallet pointer move.
- skai-gaming tsc: GAMING_LINE
- Catalog: `row-tree-check.mjs` and `bp-report.mjs` exit 0; pipeline exit 0 and `catalog:check` clean; registry diff against the pre-fold snapshot: 4,801 frames in, 4,801 out, 0 gone, 0 added, 0 lost titles, 0 lost implFiles, 0 lost verifiedAt.
- Row integrity, checked incrementally as lanes reported rather than once at the end
  (`verify-lanes.mjs`): every reported lane's status file was read for row count, duplicate keys
  within the file, duplicate keys across files, field count and breakpoint stamp, and every path
  in its owns was matched against `git status` in the repo that holds it. At the fold: 190 rows, 190 distinct keys, no duplicates and no malformed rows. ★ The first run of `verify-lanes.mjs` reported EIGHTEEN malformed rows across six lanes, and every one was the INSTRUMENT: the script was re-pointed from wave 55 by replacing the wave number and left yesterday's date in the stamp pattern, so it rejected correctly-stamped `@2026-09-21/wave56-*` columns. A new checker failing broadly on work there is reason to trust is a reason to suspect the checker — it cost two minutes instead of six wrong messages to lanes.
- Feed: FEED_LINE
- Pushes: PUSH_LINE
- Peer items landed or found during the wave, for the record: PEER_ITEMS_LINE
- Release: RELEASE_LINE

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

NEXT_LINE
