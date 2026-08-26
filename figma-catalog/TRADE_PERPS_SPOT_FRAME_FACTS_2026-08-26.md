# Trade > Perps / Spot — frame facts, 2026-08-26

Written while working the `/trade/perps`, `/spot` and `/rewards` bug reports
filed against `app.skai.trade` (`cc0be65a`, `5cb669a9`, `0ce8e207`, `9c096298`,
`0d1104d7`, `536007ae`, `58c9ae14`, `4162572b`, `a3dec5f5`, `1c6c167e`,
`b216f949`, `2d17587a`, `757d795c`, `edcbc1d6`, `3236d523`).

Every measurement below was read out of `get_metadata` against
`mhF3BkzlTaGiLzJ7kvpmVc` (Skai Web App 2), not off a screenshot, a frame title
or a code comment. Where a screenshot IS the evidence it is named as such.

---

## 1. The chart-settings drawer is TWO titled groups, not one list

`3931:89692` "Right menu" (x=990 y=8 **442x884**) holds two sibling section
frames, and they are separate `Frame 201` heading blocks:

| Frame | y | h | Heading node | Heading text |
|---|---|---|---|---|
| `3931:89697` "Frame 341" | 52 | 252 | `3931:89700` | **Chart display** |
| `3931:89784` "Frame 342" | 328 | 184 | `3931:89787` | **Order display** |

Gutter between them: `328 − (52 + 252) = 24px`.

Both groups carry the **same** description string — `3931:89702` and
`3931:89789` are both "Determine what shows up on your chart." That is not a
copy/paste slip in the frame, and it is not one in the code either.

Internal geometry, identical in both groups: heading block 48 tall (title 24
+ 8 gap + description 16), rows start at group-relative y=64, row pitch 34px
(18px `input/selection` + 16px gap).

### The "Order display" rows

`3931:89798` "Frame 446", four rows in this reading order:

| y | node | label |
|---|---|---|
| 0 | `3931:89802` | Position information |
| 34 | `3931:89806` | Trade history |
| 68 | `3931:89810` | Est. Liq. Price (Isolated margin) |
| 102 | `3931:89814` | Current orders |

⚠️ **Reports `536007ae` / `58c9ae14` were triaged 2026-08-25 as "no controls
named Position information / Trade history / Est. Liq. Price / Current orders
exist anywhere in `src/`". That was already false when it was written.**
`ChartSettingsPanel.tsx` has carried `currentOrders` and `positionInfo` rows
since the native-canvas port. What was genuinely missing was the **section** —
both rows were appended to the "Chart display" list, so the heading the report
names had no counterpart. Fixed 2026-08-26; the other two rows stay absent for
data reasons recorded in that file's docblock.

The `Frame 172` at y=60 (`3931:89828`, "Show Skai insights" + an `input/toggle`)
is `hidden="true"` — it is not a row of this drawer.

---

## 2. The perps bottom-panel history tabs

All three reports (`cc0be65a` order history, `5cb669a9` trade history,
`0ce8e207` funding history) attach a current-vs-Figma screenshot pair of the
SAME tab strip. Two of their three asks are already shipped and should not be
re-worked:

- **counts in the tab labels** — `Positions (3) · Orders (3) · Order history (3)`
  ride inside the label, not as a separate badge (`tabCounts` in
  `PerpPositionsPanel`).
- **the scrollbar** — `skai-scrollbar` on the panel's scroller. Chrome matches
  `::-webkit-scrollbar` per element and never inherits, which is why the
  `html::-webkit-scrollbar` block did not reach this panel.

The strip also draws a trailing `Filter ▾` at the right edge in all three
frames. The panel has a side filter, but only on the Positions tab and only
with more than one position — **not** a general per-tab Filter control. Not
built; not fabricated either.

### Trade history — `4201:130583`

Header row `4201:130604`, eight columns at these x:

| x | node | heading |
|---|---|---|
| 0 | `4201:130606` | S/N |
| 45 | `4201:130607` | Trading pairs |
| 259.07 | `4201:130608` | Size |
| 420.86 | `4201:130609` | Price |
| 585.64 | `4201:130610` | Direction |
| 750.43 | `4201:130611` | Fee |
| 959.21 | `4201:130612` | Closed PnL |
| 1164 | `4201:130613` | *(CTA/button — Time/date)* |

Rows are 44px on a 60px pitch with a 1px rule between; the Size cell is two
lines (`4207:131323` USD over `4207:131325` base amount); the Closed PnL cell
pairs the figure with an `icons/action` share glyph (`4201:130634`). Footer
`4207:131642` at y=392: `⌘E Export as CSV` / `⌘V View all`.

**Two of those cells have no source on the order rail** and render the unknown
em dash:

- **Closed PnL.** `Order` (skaiOrderService) carries side/type/size/filled/
  price/avgFillPrice/fee and no realized-PnL field. Per-fill PnL means matching
  each closing fill to the opening lots it consumed — position accounting this
  rail does not do.
- **The leverage tag beside the pair** (`4201:130626` "40x"). Leverage is a
  property of the position, not the order. The frame's own row 4
  (`4201:130691`) draws that tag `hidden`, so an untagged pair is a state the
  frame itself has.

The frame's Direction cell reads "Close Long" / "Close Short" / "Sell", which
needs a reduce-only flag `Order` does not carry. The cell states Buy / Sell.

### Funding history — `0ce8e207`, screenshot evidence

The frame draws a **table** — `S/N · Trading pairs · Size · Position side ·
Payment · Rate · Time/date` — of the viewer's own funding **payments**. The app
renders `FundingHistoryChart`, which is a MARKET-level rate series
(`fundingHistoryService.FundingRatePoint`: timestamp / rate / annualizedRate /
markPrice / indexPrice / openInterest). There is no per-user funding-payment
ledger anywhere on this rail, so the frame's `Payment` and `Position side`
columns cannot be sourced. **Blocked on a payments source, not on layout.**

---

## 3. `/rewards` and the top bar

`b216f949` ("the predict header is not highlighted blue on the top header")
resolves against `HomeTopBar`, **not** `Header.tsx` — the reporter's screenshot
shows `Predict` with no caret, and `Header.tsx` gives Predict a rich dropdown
that draws one. That half is already fixed in the tree
(`topNavGroup.ts` → `PREDICT_PATH_PREFIXES = ["/predict", "/rewards"]`).

Its second half is not: frame `8911:163781` is a `Header-desktop-two-layer`
instance, and the app draws a ONE-layer bar. The second layer is
`Trending · Breaking · New | Politics · Sports · Crypto · Finance · Tech ·
Climate & Science · Iran · Geo-politics · More ▾`. That is top-bar chrome, not
a rewards-page concern.

`757d795c` ("the custom dropdown ... is not currently implemented") is
ambiguous in the same way: its four attachments show BOTH the account dropdown
(with a `Rewards` row, and a Figma sticky reading "This dropdown is live and
will be designed when all sections are complete … UPDATE: This can now be
used") AND a per-row `⋮` menu on the rewards market table reading
`Place order / Favorite / Cancel orders`. The two live in different components.
Needs the reporter to say which.
