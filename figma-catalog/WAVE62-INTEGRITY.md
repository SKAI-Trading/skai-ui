# Wave 62 — integrity record (2026-09-22)

**Figure: 1,202 of 3,820 in-scope genuine frames done (31.5%), 778 verified.**
Wave 61 closed at 1,200 / 775 against the same denominator. 15 lanes, 71 rows. Pipeline exit 0, both
validators exit 0, conflicts 1 → 0.

**+2 done and +3 verified for 71 rows, and the arithmetic is the honest part.** Four frames were promoted
and two were pulled back down, by the lane that had claimed them:

| Move | Frame | Why |
| --- | --- | --- |
| + | `11398-85199` | Social group filter — the one conflict, settled below |
| + | `11998-266062` | Explorer DeFi board, built from nothing this wave |
| + | `9691-11229` | Bingo 1440 — board now lands on the frame's exact 954 |
| + | `9799-16713` | Baccarat 1440 — same 954, reached from the other side |
| − | `7916-115982` | its wave-47b `done` rested on **one node** (`get_design_context` on the CTA alone); the column was never measured |
| − | `7806-84981` | wave 55 called this file "nothing outstanding"; it was the **fourth** recurrence of the same leading miss |

A wave that only adds is a wave that is not re-reading. Both demotions came from the lane that owned the
file, and both were caught by measuring a frame an earlier wave had closed on partial evidence.

## The dominant result: the instruments were wrong, not the geometry

Wave 61 found inherited *notes* were wrong. Wave 62 found inherited *tests* were wrong — four oracles were
green while certifying something the code no longer did, or never did.

1. **`baccaratDialogWidth.test.ts` asserted 922 from its own `SHELL_PAD = 16`** after `c5e7b1a4` removed
   that padding from the shell. Re-derived out of `GameShell.tsx` **by axis rather than by string**, and
   mutation-checked twice: `md:p-4` fails it, and so does `md:px-4` beside an intact `md:py-4` — the case a
   spelling check walks straight past. Unreadable padding now throws rather than counting as zero.
2. **An NFT leading oracle asserted a value appeared exactly *twice*, and those two were correct.** A test
   of the wrong **set**: the contract chip and both Socials values carried `md:text-sm` with no leading and
   drew 28 and 20 against a board closing at 24 and 16. A cardinality assertion silently fixes the
   population it measures.
3. **`fairnessSubBar375.test.ts` was carried in a brief as red.** It is green 74/74 and already handles the
   cases said to be missing.
4. **`tsc` caught a null-narrowing error nine green tests missed.** Tests and the type gate fail on
   different things; neither substitutes for the other.

Five more oracles were mutation-proved on the group filter, "including a value-preserving lengthening a
substring check would miss".

## A stale snapshot repeated by three lanes is still one observation

Three lanes reported that `/play/baccarat` draws its title row twice, one calling the oracle "correctly
red". Measured: the file was clean, carried the guard, suite green **17/17**, closed by `b824a582`. Two
lanes likewise reported `baccaratDialogWidth.test.ts` as pending after it had landed in `159b00ee`; one of
them corrected itself unprompted — *"what I saw was the pre-commit edit in the session-opening snapshot."*

The lane that owned the file corrected the **diagnosis** as well as the count: no double title row was ever
live — `BaccaratGame` gated on `variant`, and the real defect was that the widget re-derived the condition
privately. Both sides now share `pageOwnsTitleRow`.

⇒ Agreement between lanes is not corroboration when they inherited the same snapshot. Ask which of them
touched the file.

## The one conflict, and why both rows were right

`11398-85199` came back `done` from social-groups and `partial` from social-feed. Both read the board
first-hand and **agree on every number** — panel 200x152, four item frames 184x26 at y=8/50/84/118, a
184-wide line of height 0 at y=42, rows 184 = 200−16, and 8+26+8+0+8+26+8+26+8+26+8 = 152 = reported, so
the 1px stroke is drawn inside on a declared-padding edge child (the EQUAL case, not an inferred tail).

They disagreed about **when**. social-feed deliberately measured against `git show HEAD` because
`TradingGroups.tsx` was dirty with a peer's uncommitted edit — *"measuring the shared tree would have read
a peer's half-written file as a match"* — and named social-groups as holding the repair. social-groups then
committed it. Settled `done`, and the fold verified rather than trusted: `70a3e4985` is an ancestor of
HEAD, `border-0` + `outline outline-1 outline-offset-[-1px]`, the rule at `-my-[0.5px] h-px` and the radix
viewport `h-auto` are live at HEAD, and the oracle is green 16/16.

★ **A row that names its measurement basis is reconcilable; one that does not is merely contradictory.**
That single sentence in social-feed's row is what turned a conflict into a timestamp.

## Two frames were closed that the figure cannot count

Slots closed the Vegas fortune and Sugar rush title-row art at all three widths, and play-hub verified both
independently. Neither moved the number, and neither is a mistake: `10688-7224` and `10758-20788` are
titled `Rectangle 34624567` / `Rectangle 34624566` — bare rectangles, classified **furniture**, and
furniture is outside the 3,820 genuine denominator by design.

The work was still owed. `PlayGameTitleRow` used `object-cover`, centring the fill at −20.83% where every
board lays it at −2.99% — 5.71px of crop on a 32px square, visible to users. Sugar rush proved the shared
`artBox` prop was necessary: 106.25% wide is a zoom, which no `object-position` can express.

⇒ **Wave 63 briefs should mark furniture ids as furniture**, so a lane knows before it spends the wave
whether the frame can move the figure. "Cannot move the number" and "not worth building" are different
findings and this wave conflated them for two lanes.

## Other things that turned out not to be true

- **A brief's whole Goal was stale.** All three slots items had already landed in `fff52b1a` / `561cf7ed` /
  `570ef6bb`. Recorded in the rows so a fourth wave does not chase them.
- **A wrong box read right.** A lane derived the bingo row's 1318 cap from `PLAY_PAGE_COLUMN_CLASS` and got
  the right number from the wrong box — `RoutedGamePage` wraps only the title row in the page gutter and
  renders the widget outside it, so the cap is `GameShell`'s own. Both are 1318. Reading `Frame 271` live
  then showed the phone is full-bleed 375 too, which the wrong derivation would never have surfaced.
- **A load bar that was always empty.** Phaser emits no `progress` on an empty queue, and `relayout()`
  restarts the scene where `queue()` skips every texture already held — so every relayout held an empty bar
  captioned "Loading... 0%" for 320ms, under a comment promising a full one.
- **A real defect behind a "fenced" note**, twice: Connected wallets was not fenced (the data is read in
  `SettingsTab.tsx`), and `7911-115798` was opened for the first time in five waves after five rounds of
  "NOT OPENED (quota)".

## The 2026-09-04 supersession ruling is corroborated — the wave-61 audit note was wrong

Wave 61 recorded that the ruling behind the five share-net-worth `ruled-out` frames "could not be
corroborated outside the lines citing each other". That was a failure of grep scope.
`status.wave41.wallet.tsv:42`, stamped `@2026-09-13/wave41-wallet` and committed in the wave-41 fold,
reads: *"RULED 2026-09-04: this 'home - skin 2' share family is SUPERSEDED by 13008-30018 / 13008-51352 /
13008-45556 (a two-switch Include list against the three-state board the app implements); do not implement
it."*

Independent on the three axes that matter: a different file (a status row, not a vverify verdict), an
earlier date than any `ruled-out` line, and a **mechanism** the later lines never restate. Restating is
what a circular citation does. The verdicts stand and no Casey confirmation is owed. The note is corrected
in place, because a stale doubt is as harmful as a stale permission — left alone it would have pushed a
future wave to re-open five correctly-closed frames.

⛔ Still true: the gate tests only that `/rul(ed|ing)/` and any ISO date appear in the reason. It cannot
tell a real citation from a plausible one, and it would pass an invented one.

## Casey calls raised this wave

- **Coinflip's phone footers draw 1.9800** where the rail pays 1.9500 on chain and 1.9000 on POINTS at the
  same 50.0000 win chance. Same shape as `9204-17308`: the code is right and the frame is wrong. Blocks
  three frames. Asked two waves running.
- **The 768 game-page gutter.** Boards read first-hand at x=30 w=708; the app ships 736. (A) `px-[30px]`,
  (B) keep `px-4`, (C) spend the 15px one-edge scrollbar reservation differently.
- **Sugar rush's candy bomb, diamond and second swirl** have no paytable entry — give them one, or rule
  them art-only. Nothing has been built that implies they pay.
- **The Starbound menu** — keep the drawer, or take the board's five-row popover (the board is defective; it
  says "Expand" twice).
- **What event shows the slots refresh screen** — re-boot state, page refresh, or ruled out.
- **Roulette's 375 source export** — both boards declare the same fill hash, so one export closes both.
- **The art square's 1px stroke** — every game, or only the boards that draw it.
- **The phone wallet column** — keep the shipped 346, or take the 328 at a 24 gutter, which settles
  `7882-18863` and both swap fragments together.
- **My-referrals Status column** — keep a 7th column no board draws, or drop it and lose the only
  pending/active signal.
- **Preferences "Reset to default"** — rule what it resets and build it, or rule it out, which closes both
  Preferences rows.

Carried and still unanswered: the Bridge Route row reading "Skai Mainnet" under a *From Solana to Base*
header (15 rows), the Baccarat Auto rows (three waves running), the AI home's primary nav drawing 16-tall
rows where touch wants 44 and the code ships neither, and the launchpad Choose button.

## Carried into wave 63

- `PLAY_PAGE_GUTTER_CLASS` and each wrapper still need the 30, blocked on the gutter ruling above.
- Four **stale comments** left by `c5e7b1a4`: `playPageTemplate.ts:117-122` (justifies `px-4` by a
  `both-edges` reservation `HomeShellLayout.tsx:319` no longer declares), `AviatorGamePro.tsx:3516`,
  `towerTheme.ts:201`, `BaccaratGame.tsx:2311`, `baccaratBetCellRow.test.ts:312`.
- 27 actionable touch-floor controls remain of the 112 counted tree-wide.
- `AddWalletDrawer.tsx` hand-off from wallet-components to wallet-shell-pages (the 46/52/64 and 50 box).
- `7675-51300` and `7727-14906` are re-asserted `done` by their lane but held at `partial` by a `deferred`
  verdict. That is the system working — a status row cannot outrank a measurement — but the verdict needs
  re-measuring or the rows need standing down.
