# Wave 60 — integrity record (2026-09-21/22)

**Figure: 1,188 of 3,825 in-scope genuine frames done (31%), 763 verified.**
Wave 59 closed at 1,168 / 742. 29 lanes, 165 rows (44 done, 102 partial, 16 furniture, 3
frame-defect), 109 verdict lines. Pipeline `npm run catalog` exit 0 with no citation refusals;
`bp-report.mjs` and `row-tree-check.mjs` both exit 0.

## The delta is reconciled frame by frame, not inferred

The registry's status count moved done 1,348 → 1,364 (+16) across all frames, while the published
figure moved +19 (then +20 after the correction below). They are different quantities: the published
one counts in-scope frames after verdicts are applied. Decomposing `coverage.json.frameStatuses`
between the wave-59 fold and this one:

**in-scope done GAINED 27, LOST 8 — net +19, exact.**

The 8 losses are this wave's overturned false closures, by id:

| frame | what the earlier `done` had missed |
|---|---|
| `3294-24639` | 1440 predict header; all three instances re-measured, the flat `pb-[13px]` stood the narrow boards at 84/88 |
| `10312-17987`, `10516-23121` | wave-55 `done`/`match` on Predict Activity that did not hold |
| `2735-25298`, `6415-45113`, `6736-40379` | Home composer: greeting type, and a column centred on the screen rather than the content area |
| `7727-14937`, `7727-15382` | wallet unlock/welcome: skai-ui's `small` short-logo preset is 58x24, not the 87x36 the rows assumed |

Nine further August rows were corrected by the onboarding lane: a shared `justify-content:center`
class, added for the waitlist hero alone, was centring the username and congratulations pages, so the
mark sat near 257 against the board's 229 at 375. The earlier rows had checked only the form.

⇒ The recurring shape: **a row closed on the part someone looked at.** A frame is not done because its
form matches; the page's own position on the board is part of the frame.

## A same-generation conflict, corrected at the fold

`6736-39216` (Home upload image, 768) was claimed `done` by home-portfolio-feed and `partial` by
home-sidebar-layout. The second row's own reason reads "this board's catalog verdict was already done
and this row does not move it" — but a `partial` in the status column does move it: within one
generation the later stem wins, so the row demoted a frame against its own stated intent. Both lanes
measured the board whole and agree (every sum closes; the hero greeting is 28 tall, matching the 24/28
ladder the first lane installed). Status corrected to `done`, with the reason recorded in the row.
`coverage.json.conflicts` is back to its 9 pre-existing entries — worth a wave-61 pass.

## Registry diff (the fields that go missing silently)

4,801 frames both sides, 0 added, 0 removed, **0 titles / implFiles / verifiedAt lost**. Transitions:
25 partial→done, 16 unknown→furniture, 9 done→partial, 3 unknown→partial, 1 partial→frame-defect,
1 frame-defect→partial.

## Verdict files that count for nothing

`coverage.json` reports `visualUnmapped: [vverify.trade-bugrefs.tsv, vverify.trench.tsv]` — 111 verdict
lines skipped, because `coverage.mjs` resolves `vverify.<section>.tsv` through `pages.json`'s section
list and no section carries those names. In principle that inflates the figure, since a `partial` or
`deferred` verdict downgrades a claimed `done`. Checked line by line against `live/` rather than
assumed: **108 of 111 key to node ids absent from the live snapshot** (a pre-retarget generation), 2 of
the remaining 3 already carry the same verdict in the mapped `vverify.trade.tsv`, and the last
(`3903-26048`, partial) agrees with the `partial` the registry already holds. The figure is not
inflated. Both files now carry that evidence and the revival path in their headers.

## Decisions taken under Casey's delegation ("do what's best for 1-4")

- **D1 — the RTP displays of coinflip, limbo, slide and hi-lo.** After the POINTS rail moved to 95%, the
  two rails stopped paying the same number and each game quoted one figure, wrong on one rail: coinflip
  showed 1.90 on an sUSD flip the chain pays 1.95; limbo showed a 50.0000% win chance on a POINTS rail
  winning 47.9798%; slide's page said "the house edge is 1%" while the rail charged 5%; hi-lo rounded
  its badge up (31.67x shown against 31.6666x paid) and quoted 95/wc on a chain paying 99/wc. Fixed in
  skai-gaming `5a3879bf`, `6819db78`, `884aa722`, `0428e934` — every figure now reads the rail the
  bet's currency settles on. Reviewed here assertion by assertion: each changed test is re-pinned to a
  parsed rail source, frame figures are required absent, nothing loosened, and the house-never-negative
  block is intact. 161/163 pass; the two reds assert that the rails agree, and they do not.
  The admin card carried the same wrong fact and is fixed (skai-gaming `42a275f2`).
- **D2 — the Earn APY** (`src/hooks/defi/useEarnData.ts`, `c661e91c8`): every rate with no published
  source returns `null`, including the trading pool's former "lifetime P&L × 4".
- **D3 — darts paytables**: the three ladders are solved to exactly 9500 bps but wait on height-gated
  chain code and lab re-certification; rows stay `partial` citing it.
- **D4 — the seven Trench Holders trader columns**: stay `partial` until a Bitquery key is live.

## ⛔ Deploy coupling this creates

Deployed `points-game` is still the 2026-09-14 build, older than the 95% retune, so live POINTS rounds
pay the old rates today. The order is: **an app bundle carrying skai-gaming at or past `0428e934`
first, then `supabase functions deploy points-game game-settlement`.** A server that moves first makes
limbo print 50.0000% on a rail winning 47.98% and slide claim a 1% edge while charging 5% — the
overstating direction. Until the server moves the new bundle understates, which is the safe side.

## Instrument failures found and closed

1. **The type gate could report green off a compiler that never ran.** A failed `npx` printed no
   diagnostics, `collect()` read that as zero errors, the gate announced "2,598 fewer than baseline"
   and exited 0 — and `--update` would have written the empty set as the new baseline. Fixed
   (`f3f494d6a`): non-zero exit with zero diagnostic lines exits 3 in every mode. Controlled both ways.
2. **The gate does not look at `src/components/home-redesign`**, which `src/App.tsx` imports. Measured
   with the exclusion dropped: 22 errors, 21 in tests, one unused import in `upgrade/UpgradeFlow.tsx`.
   Cheap to close, but it must be re-baselined from a clean worktree — doing it in the shared tree
   would bake ten lanes' half-edited files in as "known".
3. **A positive control planted in the shared tree is read by every peer's instrument.** A 28-second
   plant in `CoinFlipGame.tsx` was caught by a concurrent gate and reported as a defect in a commit.

## Method corrections that outlived the wave

- **The 1px stroke test is only valid on DECLARED padding.** A tail inferred by subtracting children
  from the reported height balances by construction on any auto-layout frame. The worked example
  circulated in the lane rules was also wrong: all three predict headers are the EQUAL case.
- **A 1px "departure" is usually two coordinate spaces.** Streaming's shine was held open a wave on
  "-150 here, -151 at 1440"; all three boards read -150 and the -151 was the CSS figure, measured
  inside the 1px border.
- **A four-wave "cannot be done" note fell to one re-reading.** "No `object-position` can undo the
  frames' zoom" was true of `object-position`; a rest `scale` plus `transform-origin` expresses both
  the zoom and its anchor, closing four plinko and mines tiles.
- **Lanes overturned the briefs I gave them**, which is the programme working: the ordered "closes on a
  re-read" frame was false (the board draws a parlay's figures, the code is right); both social-feed
  hand-offs were wrong; and `dist` had not gone stale after all — a rebuild produced byte-identical
  output.

## Systemic finding for the next wave

**83 controls across 27 files sit at the 44px mobile touch floor**, inflated out of tracks their
boards fix at 38 and 42 — found by games-instant in its own paths alone, corroborated by streaming
(six controls on one sheet) and darts. Only the controls with frame numbers were fixed. This is a
single defect with 83 instances, not 83 defects.
