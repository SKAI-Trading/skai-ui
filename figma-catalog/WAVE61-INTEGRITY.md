# Wave 61 — integrity record (2026-09-22)

**Figure: 1,200 of 3,820 in-scope genuine frames done (31.4%), 775 verified.**
Wave 60 closed at 1,188 / 763 against a denominator of 3,825. 16 lanes, 68 rows (8 done, 59 partial,
1 frame-defect). Pipeline exit 0, no citation refusals, both validators exit 0, **conflicts 9 → 0**.

The denominator moved for a reason recorded below, and the `done` count is one lower than it read
mid-wave because a lane demoted a frame it had just measured. Both are the intended direction.

## The catalog's own measurement was repaired

Three defects in how the figure was computed, all fixed and each attributed by re-running coverage with
the fixing lane's files reverted and peers held constant — so the deltas below are that lane's own
effect, not the tree's total.

1. **A frame Casey ruled out could not be closed by any verdict.** `coverage.mjs` let only `match`
   sustain a `done` claim, so five share-net-worth frames had been opened by five waves and closed by
   none; writing `match` would have re-committed the exact defect wave 55 fixed (`ShareCard.tsx` draws a
   different family — `vverify.wallet.tsv:76`). Ruled: a ruled-out frame is **not done** — nothing was
   built — so `ruled-out` removes it from the **denominator** instead, fail-closed behind a dated-ruling
   citation. Isolated effect: denominator 3,825 → 3,820 with `done` and `verified` **identical**. The
   shrink closed no frames.
2. **Three verdict lines carried the word `done`**, which is outside `match|partial|deferred|not-wired`,
   so `coverage.mjs` skipped them silently. Re-measured to `match`. Each key turned out to have three
   lines and last-wins, so a wave-60 line already said `match`: the invalid words cost the record's
   honesty, not the figure.
3. **Nine frames whose status files contradicted each other** settled on whichever row showed a
   measurement. Seven of the losers said in their own text that they had not been re-read.

Tasks 1–3 together: done 1,188 → 1,194, verified 763 → 769, conflicts 9 → 0.

## What the lanes actually found

The dominant result this wave was not new geometry. It was that **inherited notes were wrong**:

- A promo card recorded for five waves as "an empty illustration, nothing to export" — its **fill is an
  image**, and `get_metadata` reports an image fill as no children. It exported at 1500x728 on request.
  The same band was gated `hidden md:grid`, so the phone board had been drawing **nothing at all**.
- "Farmers is the fourth stat" — it is second on every board. No row was wrong; every row had assumed.
- A four-wave-old roulette ask ("a second export at the mobile wheel scale") dissolved when both boards'
  fills hashed **identical**: 375 needs one export, and the CSS mechanism already ships.
- "No source for the Comments count" — `predict_comments` had been readable since 09-18. Wiring it
  closed three Activity frames.
- A scroll cue the boards draw and the app lacked was closed by **mounting a rail that already existed**,
  built for those exact nodes and live on three other surfaces.
- The 375 predict band shipped **88 against the board's 82** on every `/predict/*` route. Two prior waves
  had summed the row as 42 from the class list and missed the `min-h-12` floor underneath it.
- A wallet page stated `max-w-[580px]` **and** `md:px-4`, so under border-box its cards drew 548 against
  580 — every seam earlier waves "closed" there was measured against a column 32 too narrow.

## Coordinate space is the dominant measurement error

Three lanes hit the same shape at three scales, and in each case both numbers were correct:

1. **30 vs 30** — a board's page gutter matched against crash's `md:px-[30px]`, which is measured from
   the panel edge. Acting on it would have misaligned 24 pages. (I routed that before checking.)
2. **−150 vs −151** — a frame held open a whole wave on a shine offset; all three boards read −150 and
   the −151 was the CSS figure, measured inside the 1px border.
3. **Absolute coordinates fed to a sliced canvas** — a hand-off's `x=-103 y=564 w=715.5` are right on the
   375 board and land at device x −555…90 inside a `xMidYMax slice` viewBox of 1440x900, with the cut
   varying by viewport. The receiving lane refused the numbers, kept the ratio, and rebuilt against the
   canvas box.

⇒ Before using a number, name the box it is measured from. A ratio usually transfers between spaces; an
absolute coordinate usually does not.

## Instruments that lied, and how they were caught

- **An oracle matched its own comment.** `tag.includes("no-min-size")` — JSX allows a comment inside the
  opening tag, and the lane's explanatory prose contained the string. Both oracles went green against a
  **reverted** fix. Caught only by mutation-testing.
- **An oracle hardcoded two call sites** where there are now four; the other two went unmeasured while
  the test passed.
- **An edit silently converted a 300KB file LF→CRLF**, invisible in `git diff` under this repo's
  autocrlf normalisation, caught by two tests that grep the source text.
- **A background task reported exit 0** while the gate and the build it wrapped both exited 1.

## The game shell's gutter, settled by measurement

Two lanes disagreed, and both were right about their own page. The deciding fact came from a sweep:
three 768 boards (crash `9003:96041`, mines `9003:110110`, blackjack `9003:118852`) all draw
**30 / 708 / 30**, and baccarat's 1440 **32 is the centring residue of the 1318 cap** — `(1382−1318)/2` —
not a second gutter spec. One rule reproduces both. All 25 `*PageSections` wrappers are self-capped at
1318 (six cap below a decorative glow div, which is why a quick read misses them), so removing the
shell's horizontal half aligns rather than breaks them. Landed as skai-gaming `c5e7b1a4`, shell and five
oracles in one commit, the oracles now asserting the vertical step and **banning the horizontal tokens by
name**. ⚠ Outstanding: the 30 on `PLAY_PAGE_GUTTER_CLASS` and each wrapper, without which 768 still
renders 736 against the board's 708.

## The 44px touch floor, counted honestly

`src/index.css` forces a 44px min-height at ≤768px. Tree-wide that affects **112** controls — wave 60's
"83" was one lane's paths, a different denominator. Seven were opted out at the call site with frame
citations, leaving 105: **40** fenced to other lanes, **34** where no board fixes them under 44 (29
sportsbook on that lane's recorded ruling; 5 where the board draws 16-tall text rows, not buttons),
**27** actionable across 24 files, **4** not defects at all. Grouped list in the wave scratchpad.

## Casey calls raised this wave

Coinflip's phone footers draw 1.9800 where the rail pays 1.9500/1.9000 at the same 50.0000 — one ruling
closes three frames, the same shape as `9204-17308`. The AI home's primary nav draws 16-tall rows: parity
says 16, touch says 44, the code ships neither. Roulette's source export would close both boards. A Route
row on the Bridge boards reading "Skai Mainnet" under a *From Solana to Base* header blocks 15 rows.
Baccarat Auto rows, asked three waves running. Plus the per-lane calls in each status row.
