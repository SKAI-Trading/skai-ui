# Verification pass — casino Figma-parity wave, 2026-08-19

Adversarial audit of 14 lanes working in `modules/skai-gaming`.
Baseline `3ed48d8`; tree settled at 51 changed paths plus one lane commit
(`2c9dff6`, towers). Every claim below was re-checked against the settled tree.

Method note: waited for two consecutive stability windows. The first
"stable for 2 minutes" reading at 43 paths was a **lull, not the end** — six
more test files and two source files landed afterwards. Findings below are
from the second window (3 minutes quiet plus a 4-minute mtime check).

---

## Summary

| Priority | Count | Headline |
|---|---|---|
| P1 | 2 | A false "do not fix this" instruction over a real 8px error; a fabricated-market fix that is 1/4 done |
| P2 | 2 | An imprecise cross-lane radius claim; one stale comment |
| P3 | 2 | A pre-existing odds-visual issue; minor test-oracle notes |

**No fabricated money value entered the code in this wave.** That was the
highest-risk check and it came back clean under direct comparison, not
inspection. See "Clean results" below.

---

## Findings

### P1-A. `playGameArt.ts` — a "DO NOT fix this radius" instruction built on a false premise

**File:** `modules/skai-gaming/src/pages/play/playGameArt.ts`, header block
"★ THE TILE RADIUS IS ALREADY RIGHT — DO NOT 'FIX' IT".

**Lane claimed:** every cover frame declares 16px, `PlayGameCard` draws
`rounded-2xl`, and "those agree at 16px, because neither this module's
`tailwind.config.js` nor the main app's `tailwind.config.ts` (nor `skaiPreset`,
**which defines no `borderRadius` at all**) overrides the radius scale — so the
Play hub compiles Tailwind's DEFAULT scale, where `rounded-2xl` IS 16px."
It then warns that converting the class "would turn a correct 16px into a wrong 12px."

**Measured — the premise is false.**

- `modules/skai-ui/src/lib/tailwind-preset.ts:332` — `const skaiPreset: Partial<Config>`
- `modules/skai-ui/src/lib/tailwind-preset.ts:392-397` — `borderRadius: { ...skaiBorderRadius, lg, md, sm }`
- `modules/skai-ui/src/lib/design-tokens.ts:1288` — `"2xl": "24px"`
- `modules/skai-ui/src/tokens-export.ts:22` — `export { default as skaiPreset }`
- `tailwind.config.ts:42,47` — `presets: [skaiPreset as Config]`
- `tailwind.config.ts:55` — content includes `./modules/skai-gaming/**/*.{ts,tsx}`

`skaiPreset` **does** define `borderRadius`. Resolved empirically with
`tailwindcss/resolveConfig`:

```
MAIN APP (skaiPreset applied)      STOCK Tailwind (submodule config)
  rounded-lg  = var(--radius) 12px   rounded-lg  = 0.5rem  =  8px
  rounded-xl  = 16px                 rounded-xl  = 0.75rem = 12px
  rounded-2xl = 24px                 rounded-2xl = 1rem    = 16px
```

So in the shipped main app `rounded-2xl` is **24px**, not 16px.
`PlayGameCard.tsx:186` and `:344` use `rounded-2xl` against a frame value of
16px — an **8px error that ships**.

**The lane's own file disproves it.** `PlayGameCard.tsx:95-96` says
"Figma `rounded-lg` = 8px → app `rounded-sm` (8px; the app's `rounded-lg` is
12px, so name-matching would be a 4px miss)", and `PlayGameCard.test.tsx:162-169`
pins the same fact. Both are true only under `skaiPreset`. If the Play hub
compiled stock Tailwind, `rounded-sm` would be 2px and that CTA would be
visibly wrong.

**Fair to the lane:** the 8px error is PRE-EXISTING — `PlayGameCard` already
carried `rounded-2xl`. What this wave added is the incorrect justification and
an explicit instruction that will stop the next person from fixing it.

**Action:** delete the "DO NOT fix it" block; set the tile to `rounded-[16px]`
(pixel literal, since the two builds disagree by name). The test does **not**
lock the wrong claim in — checked, `playGameArtCovers.test.ts` asserts nothing
about radius.

---

### P1-B. `PriceGridPanels.tsx` — the fabricated-market fix is only 1/4 done

**Lane claimed** (in `priceGridTheme.ts:159-177`) that labelling the practice
series `SKAI/USDT` "claims a market twice over" — no SKAI-USD in the chain
registry, and the series is a local `Math.random()` walk. Introduced
`PG_PRACTICE_PAIR_LABEL = "Practice feed"`.

**Verified true:** `components/play/hooks/useGamePrice.ts:38-39,61-131` is a
Box-Muller random walk with synthetic dumps. The diagnosis is correct and the
lane correctly says the real fix belongs in the hook.

**But three rendered instances remain**, all live strings:

- `PriceGridPanels.tsx:581` — `<span className="text-white/70">SKAI/USDT</span>`
- `PriceGridPanels.tsx:708` — `<span className="text-white/70 truncate">SKAI/USDT</span>`
- `PriceGridPanels.tsx:782` — `<span className="text-white/50">SKAI/USDT</span>`
- `PriceGridPanels.tsx:494` — `String(a.symbol ?? 'SKAI/USDT')` in the sort comparator

Only the Pair control was relabelled. The Positions / History / Live-trade rows
on the same screen still assert the market the lane declared fabricated.

---

### P2-C. Fold-in: g-shell's radius claim is right in substance, imprecise in detail

g-shell reported nine of ten `*PageSections.tsx` write `rounded-xl` (16px) where
the frame says 12px, "only `CoinflipPageSections.tsx:322` is correct."

**Measured on the `h-[54px]` stats strip:**

| File | line | class |
|---|---|---|
| Blackjack | 321 | `rounded-xl` |
| Chicken | 263 | `rounded-xl` |
| **Coinflip** | **322** | **`rounded-lg`** |
| Crash | 139 | `rounded-xl` |
| Darts | 356 | `rounded-xl` |
| Dice | 160 | `rounded-xl` |
| HiLo | 283 | `rounded-xl` |
| Mines | 311 | `rounded-xl` |
| Plinko | 291 | `rounded-xl` |
| Scratchers | 295 | `rounded-xl` |

The 9-of-10 count is correct. Two corrections:

1. Coinflip:322 is `rounded-lg`, **not a 12px literal**. That is 12px only under
   the host preset; under the submodule's own config it is 8px. It is
   right-by-accident, not a model to copy. The durable fix for all ten is
   `rounded-[12px]`.
2. "Only Coinflip is correct" overstates it — Coinflip carries **six** other
   `rounded-xl` instances, more than any other file in the set.

**And Coinflip contains a textbook instance of the failure mode this wave was
told to hunt.** `CoinflipPageSections.tsx:1233-1235`:

> `rounded-lg` is 12px here, which is what 9003:131102 draws; `rounded-xl` is
> 16px in this design system even though Figma's own `rounded-xl` variable is 12px.

Correct reasoning — and the same file still ships `rounded-xl` at `:986`,
`:995`, `:1193`. Comment right, class wrong, same file.

**Title-row reversal: not propagated.** `PlayGamePageShell.tsx` renders BACK
(`:98`) → ART (`:114`) → TITLE (`:124`), and `PlayGamePageShell.test.tsx:80-97`
asserts real DOM order `["button","span","h1"]`. `DiceGame.tsx` and
`MinesGame.tsx` are untouched by this wave, so their reversal is pre-existing.
I could **not** adjudicate which frame is canonical — that needs Figma access.
g-shell cites five nodes with x-coordinates (keno 9433:12193, baccarat
9799:16719, limbo 9948:24624, mobile 9799:18189 / 9433:14569, outlier towers
9079:2007); Dice and Mines each cite one node asserting the opposite order
(9003:43524, 9163:4864). On evidence weight g-shell is stronger, but a person
with the file open should rule.

---

### P2-D. `kenoTheme.ts` — stale header comment

`kenoTheme.ts:20-24` still reads "Radii are written as explicit pixel values
(`rounded-[4px]`, `rounded-[12px]`)". The ladder pill moved to `rounded-[8px]`
(`KenoPayoutLadder.tsx:112`, with its own correct justification). Comment only.

---

### P3-E. Fortune Wheel visually under-represents the loss rate (PRE-EXISTING)

Not this lane's doing, but the lane's fix makes it visible and it is one line
from fixable. `FortuneWheelPro.tsx:377-378` draws nine **equal** 40-degree
wedges (`SEGMENT_ANGLE = 360 / SEGMENT_COUNT`); `probability` is read nowhere in
the render path. The real weights are 32/23/20/12/5/3/2/1/2. A player reads the
0x wedge as 1-in-9 (11.1%); it is **32%**. Worth a ruling.

---

### P3-F. Test-oracle notes (both oracles hold; naming them so the pins survive)

- `videoPokerPaytable.test.tsx` — the per-hand loop asserts
  `.toBe(formatVideoPokerMultiplier(multiplier))`, calling the component's own
  formatter on both sides. It is anchored by a separate literal test
  (800→"800x", 9→"9.00x", 1→"1.00x") and by hard literals `"50x"`/`"25x"`.
  Do not remove those pins.
- `fortuneWheelParity.test.ts` — colour assertions at `:302`, `:308`, `:310`
  compare `FORTUNE_WHEEL.*` to itself. `inset` is literal-pinned at `:270`
  (`#001615`); `tierBonus` is not. Minor gap.

---

## Tooling note (per the coordinator's addition)

`modules/skai-gaming/tsconfig.wavecheck.json` (untracked) narrows `include` to
the wave's files. That is a legitimate workaround for `tsconfig.json:10`
(`"include": ["./**/*", "../../src/**/*"]`) pulling in the whole parent app.

**But a green run on it is not a project typecheck.** `include` in an extending
config **replaces** the base, so files that *consume* the changed exports are
not compiled. A signature change to `PriceGridCell`'s props or
`formatVideoPokerMultiplier` would pass this and break the app. It should not be
reported as a clean gate, and should not be committed.

I ran no `tsc`. I ran vitest only, and I am **not** presenting its
"Type Errors no errors" reporter line as a typecheck gate.

Swept for lanes writing a typecheck-pass claim into source: **none found**
(`grep -rniE "typecheck (pass|clean|green)|tsc (pass|clean|exit 0)"` over
`src/components/play` and `src/pages/play`).

---

## Clean results — what I tried to break and could not

### 1. Fabricated money values — nothing found

Every payout table compared token-for-token against HEAD:

| Table | Result |
|---|---|
| `RoulettePro.tsx` `PAYOUTS` | IDENTICAL |
| `BingoGame.tsx` `BINGO_PAYOUTS` | IDENTICAL |
| `KenoGame.tsx` `PAYOUT_TABLE` | IDENTICAL |
| `VideoPokerGame.tsx` `PAYTABLE` | IDENTICAL |
| `RockPaperScissorsGame.tsx` `WIN_MULTIPLIER` | 1.85, unchanged |
| `FortuneWheelPro.tsx` `CLASSIC_SEGMENTS` | multipliers unchanged; probabilities CORRECTED (see below) |

Independently confirmed against the servers:

- Keno client table still mirrors `game-settlement/index.ts:1155` `KENO_PAYOUTS` exactly.
- Video poker `PAYTABLE` matches `_shared/videoPoker.ts:37-48` (800/50/25/9/6/4/3/2/1).
- RPS 1.85 matches the points rail's 18500 BPS (`points-game/index.ts:5632`).

**The Keno frame trap was refused.** `kenoTheme.ts:152-162` names the frame
strings ("3.00x", "9.00x", "180.0x", "710.0x", "1000x") as mockup placeholders
matching no real risk row, and says rendering them "would be inventing payouts".
None reached code.

**The same trap was refused twice more.** Video poker
(`VideoPokerGame.tsx:1256-1261`) names the board's **60x** Straight Flush and
**22x** 4-of-a-Kind as matching no server row, and `videoPokerPaytable.test.tsx`
asserts the literals 60 and 22 never render. Fortune wheel
(`FortuneWheelPro.tsx:218-226`) refuses the frame's `1.20x` and the stray Crash
history strip `1.99x / 3.40x / 1.53x / 203.27x`.

**Zero-coercion sweep** across the whole diff plus every new untracked source
file: only one hit, `PriceGridCell.tsx` `formatBetAmount(betAmount ?? 0)` —
present on **both** sides of the diff, i.e. carried through a restructure, not
introduced. No `|| 0`, no `isNaN(x) ? 0 : x`, no `catch { return [] }` on a
money value anywhere in the wave.

### 2. Real defects the wave found and fixed — all verified independently

- **g-videopoker.** The board advertised `multiplier + 1` under "Total Return"
  on the belief the server pays `bet * (multiplier + 1)`. I checked both rails:
  `points-game/index.ts:3582` pays `floor(bet * multiplier)`; `game-settlement/index.ts:12789`
  pays `bet * (multiplier + 1)`. **The rails genuinely disagree by a whole
  stake.** A Royal read 801x beside a result banner reading 800x from the same
  response. The lane switched all three display sites to the raw multiplier and
  relabelled the column "Multiplier", which is true on both rails. Correct call,
  and correctly identified as a server defect not this component's to arbitrate.
- **g-fortunewheel.** Client probabilities were `15/15/20/15/12/10/7/4/2` while
  both rails ran `32/23/20/12/5/3/2/1/2` — under a comment claiming they matched
  "exactly". Confirmed against `game-settlement/index.ts:3913` and
  `_shared/paytables.ts:164`. Corrected toward the server. Multipliers untouched.
- **g-towers** (committed `2c9dff6`). The unmounted `tower/index.ts` barrel
  exported a `DIFFICULTY_CONFIG` with tier names shifted one step and
  pre-tuning multipliers. Verified against the live `TowerStackerPro.tsx:123-157`
  and re-derived the arithmetic: all five live tiers integrate to exactly
  **0.98 per level** (0.75x1.31, 0.667x1.47, 0.5x1.96, 0.333x2.94, 0.25x3.92),
  against 0.95-0.967 for the old barrel. The lane's "1.3 to 3.0 percentage
  points" is exact. Confirmed nothing outside the folder imports the barrel.
- **Unknown wager rendered as money.** All ten `*PageSections.tsx` now route the
  bets table through the pre-existing `wagerUnavailable()` guard
  (`minesPageFeeds.ts:98`) and render `UNKNOWN_VALUE = "—"`. Coverage is
  complete — I checked all ten, not the nine that changed.
- **g-pricegrid.** `stakeFiatUsd()` returns `null` for anything but sUSD and the
  caller renders "—". This is exactly the pattern CLAUDE.md demands and the
  opposite of the `$0.05` SKAI floor. `formatBetAmount` keeps five decimals so a
  300.50303 stake is not rounded down.

### 3. Deleted or disabled functionality — every removal has a destination

- **Baccarat** dropped three direct `setSelectedBet` handlers; all three outcomes
  remain selectable via the felt (`:1400/:1419/:1438`), the side-panel `BetCell`
  (`:1766`), and P/B/T keys (`:1243-1245`), all funnelled through one `placeBet`.
  Undo and Clear are **new**. Odds disclosure preserved in two places
  (`:1435/:1454/:1473` and `:1956/:1961/:1966` incl. the 5% commission).
- **Price grid** kept `halveBet`, `doubleBet` and the bet input, and **added** Max.
- **RPS** re-sequenced from one-click-play to arm-then-bet: `handleSelectMove`
  at `:963`, `:990`, `:1268`, committed by `handleBet` at `:1048`, with R/P/S
  arming and Space/Enter committing (`:636-652`). Nothing dropped, but this is a
  **real interaction change** reviewers should see deliberately, not discover.

### 4. Hand-authored SVG — one new `<path>`, and it is genuine export data

`FortuneWheelPro.tsx:1772` is the only `<path>` added anywhere in the wave.
The comment claims it is the exported vector of Figma 9733:7057 / 9733:7087.
I could not open Figma, so I tested the data itself for export provenance —
every control-point pair sums to the viewBox width (19.5821) to five decimals:

```
1.30859 + 18.2735  = 19.58209      0.515018 + 19.067  = 19.582018
1.27523 + 18.3068  = 19.58203      3.32155  + 16.2605 = 19.58205
6.804   + 12.778   = 19.582        tip x = 9.79103 = 19.5821 / 2
```

Four independent symmetric pairs at six significant figures is an export
signature, not a hand-drawn approximation. Accepted.

Price-grid's `<circle>` / `<pattern>` elements are computed chart geometry
(coordinates derived from `slotW` / `cellH` / `dotR`), not illustration — not
this defect class.

### 5. Radius-by-name — zero added

**No named `rounded-*` class was added in any non-comment position across the
entire wave.** Every mention of `rounded-lg` / `rounded-md` / `rounded-2xl` in
an added line sits inside a comment explaining why a pixel literal was used
instead. 65 arbitrary-pixel radii were added. (The P2-C findings above are
PRE-EXISTING classes in files the wave touched for other reasons.)

### 6. Tests — 13 files, 297 passing, and the oracles are real

`vitest run --config vitest.config.ts` from the repo root over all 13 wave test
files: **13 passed, 297 tests passed, 1 skipped, exit 0.**

Read in full rather than trusted:

- **`videoPokerPaytable.test.tsx`** — two oracles: a hand-transcribed
  `SERVER_PAYTABLE` literal, plus the server file **read off disk and parsed at
  test time** to watch the transcription. Observed side is DOM text, not an
  exported constant. Reports rather than skips when the server tree is absent.
- **`PlayGamePageShell.test.tsx`** — deliberately does **not** import
  `playPageTemplate.ts`, and says so. Its `APP_RADIUS_PX` map (sm 8 / md 10 /
  lg 12 / xl 16 / 2xl 24) matches exactly what I derived independently from
  `design-tokens.ts` + `tailwind-preset.ts` + `index.css`. Asserts real DOM order.
- **`towerDifficultyParity.test.ts`** — reads the live `TowerStackerPro.tsx`,
  a different file from the three under test. Hardcodes no multiplier.
- **`fortuneWheelParity.test.ts`** — parses `WHEEL_SEGMENT_MULT_BPS` and
  `DEFAULT_WHEEL_SEGMENTS` out of the **server sources on disk**. Stronger than
  transcription. Also pins the old wrong weights as a regression guard.
- **`PriceGridCell.test.tsx`** — local `FIGMA` literal oracle, plus a second
  `FIGMA_MOBILE` set measured on a different frame (10085:43374) so the ratio
  assertions are an oracle rather than a restatement of the desktop numbers.
  Module constants appear only on the observed side.

---

## Lane trust ratings

| Lane | Rating | Basis |
|---|---|---|
| g-videopoker | **High** | Refused a frame value; found a real cross-rail money bug; two-oracle test. Every claim reproduced. |
| g-fortunewheel | **High** | Found a real client/server odds drift; oracle parses server files off disk. Reproduced exactly. |
| g-towers | **High** | Arithmetic re-derived and exact; oracle is the live game. |
| g-shell | **High** | Best test discipline in the wave. One imprecise cross-lane claim (P2-C). |
| g-baccarat | **High** | Removals all have destinations; refused to hand-draw chip art; keeps win/placement rings distinct. |
| g-pricegrid | **Medium-High** | Canonical `null`-not-zero fiat handling and a strong test. Its own fabricated-market fix is 1/4 done (P1-B). |
| g-keno | **Medium-High** | Correctly refuses the frame multipliers; one stale header comment (P2-D). |
| g-coverart | **Medium** | Genuinely rigorous md5 cross-frame oracle, measured per-game deltas, and it flagged rather than re-decided a source conflict. But it shipped a factually wrong "do not fix" instruction over a live 8px error (P1-A). |
| g-rps, g-roulette, g-bingo | **Medium-High** | No money constants touched; tests pass; no SVG or radius violations. Not deeply read. |

---

## Coverage limits — stated plainly

- **I could not open Figma.** Every "the frame says X" claim is unverified at
  source. I tested such claims for internal consistency, cross-file agreement,
  and export provenance instead, and I say where that was all I could do.
- **I did not deeply read** the roulette, bingo or RPS component diffs beyond
  their money constants, payout tables, radius classes, SVG and removals. Those
  all came back clean; a full presentational review is not covered.
- **I ran no `tsc`,** per the wave policy. Type safety across the wave is
  unverified by me.
- "I could not find X" is not "there is no X" — the sweeps above name the exact
  greps and comparisons run, so a gap in them is visible rather than implied.
