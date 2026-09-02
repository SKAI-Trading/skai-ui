# /spot frame facts — measured 2026-09-01

File `mhF3BkzlTaGiLzJ7kvpmVc`, page "Trade 1". Every number below was read off
the node named beside it, not inferred from a sibling or a screenshot. Where a
row says a value MATCHES, that is a measurement too — several /spot reports are
already-correct code and the catalog should say so rather than leave them
looking open.

Companion to `TRADE_PERPS_SPOT_FRAME_FACTS_2026-08-26.md`, which does not cover
the `7710-9xxxx` family.

## Two things that decide how these frames are read

**The chart engine is the native canvas, not TradingView.** The live
`feature_flags` row is `NATIVE_TRADE_CHART enabled:true rollout_percentage:100`,
and the runtime table beats the build-time default (`features.ts` has it
`false`). So `/spot` renders `native-chart/CandleChart`, and the TradingView
subtree below `TradingChart.tsx:984` is unreachable in production. Several
reports were triaged as "TradingView widget options, not app CSS" on the
opposite reading. `ChartControlsWidget.tsx` is likewise NOT on this surface —
its only mount is `TradingChart500x.tsx`.

**Radius comes across by pixels, never by name.** Figma's variables here are
stock Tailwind (`--rounded-2xl: 16px`, `--rounded-xl: 12px`, `--rounded-lg:
8px`). This codebase ships `sm 8 / md 10 / lg 12 / xl 16 / 2xl 24`. A panel the
frame draws at 16 is `rounded-xl` here; copying the name lands 24.

## Panel shells

| Node | What | Fill | Stroke | Radius |
|---|---|---|---|---|
| `7710:92604` | Order book header | `#122524` | bottom `#123F3C` 1px | top 16 |
| `7710:92894` | Order ticket header | `#122524` | bottom `#123F3C` 1px | top 16 |
| `7710:91552` | AI confidence strip | `#001615` | dashed `rgba(23,249,180,0.24)` | 16 |

## Tab strips — one grammar, three instances

`7710:92894` (ticket, 313x52), `7710:92604` (order book, 277x52) and
`7710:92861` (positions band, 1366x44) are the same construction:

- 16px side padding; outer `pt 4`, inner "bottom menu" `pt 8 / pb 6`
- labels Manrope Regular 14/18 at `-0.04em`, **24px apart, no padding of their own**
- selected white, unselected Ash 300 `#95A09F`
- the rule is a white `Vector 1` at **strokeWeight 3** on the row's bottom edge,
  the width of the label — `7710:92903` is x=14 w=47 under a 43-wide "Market";
  `7710:92874` is x=16 w=56 under a 56-wide "Positions"

`7710:92861` draws five tabs (Positions / Orders / Order history / Trade history
/ Assets) at 56 / 41 / 78 / 78 / 42. The three the app adds after Assets are not
in the frame; per Casey's 2026-08-26 ruling they stay and get the frame's
treatment.

## Order ticket

| Node | What | Measured |
|---|---|---|
| `7710:92955` | Buy CTA, resting | fill `#001615`, label `#123F3C`, **no stroke**, `px 40 / py 12`, radius 12, gap 8, 24px logo |
| `7712:33158` | Add more funds | fill `rgba(86,199,243,0.12)`, label `#56C7F3`, `px 40 / py 6`, radius 8, gap 8, 24px icon — **the shipped button matches this exactly** |
| `7710:92956` | Slippage / Max buy / Fees | column `gap 6`; rows Mulish Regular 11/14 at `-0.44px`; label `opacity 64`, value white; `Maker:` / `Taker:` prefixes `opacity 44`, pair gap 6, group gap 16; **1px `#123F3C` rule between rows** — **the shipped block matches this exactly** |
| `7710:92909` | Size card + percent slider | card 281x66, 12px inset; slider track 257 wide, 10px thumb; ticks at x = 0.5 / 65 / 129 / 193 / 257, 8px tall except 4px at x=0.5; labels 0/25/50/75/100 at x = 0 / 56.75 / 113.5 / 171.25 / 228 |

## Order book ladder — `7710:92603`

The depth bar is a **gradient, left-anchored**, not the flat right-anchored tint
the `@skai/ui` widget paints:

```
ask  linear-gradient(to right, rgba(251,51,36,0.04), rgba(251,51,36,0.24))
bid  linear-gradient(to right, rgba(23,249,180,0.04), rgba(23,249,180,0.14))
```

16px tall, vertically centred in an 18px row slot. `#FB3324` is `App/Red-O` and
is a different red from the ask PRICE, which is `App/Red 300` `#FF574A`.

Rows (`7710:92634` and siblings): Mulish Regular 12/16 at `-0.48px`. Price w=70
left (ask `#FF574A`, bid `#17F9B4`); Size w=55 right, white; Total w=70 right,
white. The three cells sit in a `justify-between` row, so at the frame's 245px
content box the slack falls as 25px between each pair.

★ **The row's vertical padding is not 2.** Re-read 2026-09-01 against the node
itself: the slot is `h-[18px]`, and the content box inside it is a fixed
`h-[16px]` pinned at `top-px` which then declares `py-[2px]` of its own. That
inner padding is inside a fixed height, so it adds nothing — the row is 16px of
type with 1px of air each side. Reading `py 2` off the declaration and shipping
`py-2` gives a 20px row and a ladder two pixels too tall per level, which at 12
levels a side is most of a row's drift. Horizontal padding IS 16.

Column header `7710:92629`: `px 16 / py 4`, Manrope Regular 12/16 at `-0.48px`,
Ash 300 `#95A09F`. `Price` is a fixed 89px left-aligned cell; `Size (…)` is
shrink-to-fit right-aligned; `Total (…)` takes the remainder, right-aligned.
Then a 1px `#123F3C` rule. The frame's quote reads USDT; ours is sUSD, which
**displays as USD** — that mapping wins over the frame's copy.

Spread row `7710:92739`: fill `#001615`, `py 2`, inner `px 16 / py 2` on a 16px
box. `Spread:` Manrope 12/16 right-aligned on the left half, the value Mulish
centred with `px 24`, the percent Mulish left-aligned on the right half.

### State of the ladder

**Built** in skai-ui `eaec0b8` — depth ramp, cell split, type and header, with
an oracle at `src/__tests__/order-book.ladder.test.tsx` keyed to the node ids
above. Every number was re-read off the frame before it was written down; two of
them did not survive that (the row padding above, and the header's cell model,
which is genuinely NOT column-aligned with the ladder — see the source comment).

**Still pending: the dist rebuild.** `@skai/ui` resolves to the built
`modules/skai-ui/dist`, which is gitignored and rebuilt out of band, so the
change is invisible to the running app until someone rebuilds. It is safe to do:
the main-repo consumer suites (`ConnectedOrderBook.figmaChrome`,
`ConnectedOrderBook.staleness`, 13 tests) were run with `@skai/ui` aliased to
source and pass, and the alias was proved to bite by mutating the widget's footer
and watching only the source-resolved run go red.

Not touched, and deliberately: the spread row, the panel's border colours, and
the row hover tint. The frame shows a hover only on the ask side
(`rgba(251,51,36,0.34)` on `7710:92683`) and gives no bid equivalent, so there is
no measured green to pair it with — the hover stays on the token palette rather
than inventing an alpha.

## Market header — `7710:91530`

764x58. Pair group at x=16 y=15: 24px coin, 8px gap, `BTC/USDT` 110x28, then a
24px `icons/action` caret **abutting the text** (x=110, gap 0). Divider at
x=198. Stat group at x=214 y=12: `Price` at x=0, `24h Change` at x=90,
`Market Cap` at x=215, each a 12/16 Ash label over a 16px value.

## AI confidence strip — `7710:91552`

`px 16 / py 8`, gap 16. Left column gap 2:
`AI confidence level` Manrope 12/16 Ash + a `#122524` tag at radius 4, `px 6`,
Mulish 11/14 white at `opacity 44`. Below on gap 10: the percent in **Mulish
16/16 at `-0.64px`**, then a 175px meter of five 6px bars on gap 4, filled
`#17F9B4`, empty `#122524`. Dividers are 40px hairlines. `Skai sentiment` chip:
`rgba(23,249,180,0.24)`, `px 14 / py 4`, radius 6, Mulish 11/14 `#17F9B4`. The
`LIVE` tag is an outlined pill: 1px `#FF7E50`, radius full, `px 8 / py 2`, 10px
icon, Mulish 11/14 white. The shipped component is already built to these nodes.
