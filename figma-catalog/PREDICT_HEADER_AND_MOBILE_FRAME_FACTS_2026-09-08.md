# Predict — header nav, mobile bottom bar, 375 dashboard sections, futures settings sheets

Measured 2026-09-08 via the Figma Plugin API (`use_figma`): `getNodeByIdAsync`
per node after `setCurrentPageAsync` on `✅ Predict` (3173:26018), reading
`fills` / `strokes` / `effects` / `layoutMode` / `itemSpacing` / `paddingX` and,
for text, `characters` + `fontSize` + `fontName`. File `3sSzw1KewMtUbeLAv7uW0r`
(Skai Web App 1). Page scope is **in-scope** in `live/_pages.json`, so everything
below is a parity target.

Written because eleven open bug reports carry a comment of the form "THE EXACT
QUESTION for whoever has the MCP", recorded on 2026-09-07 when the Figma MCP was
down for the whole session. Those questions are answered here.

★ Colour caveat that cost a wrong reading once already. Screenshot pixels cannot
tell a 60%-alpha `#001615` bar from a solid one when the page behind it is also
`#001615`. The alpha below came from the node's `fills[0].opacity`, not from
sampling a PNG.

---

## 1. The two-layer header — the row eleven reports call "the header tabs"

The same component in both cuts. Frames place it as `Header-desktop-two-layer`
at 1440 and `Header-mobile` at 375, and its SECOND row is the
Trending / Breaking / New + category nav.

| | 1440 | 375 |
|---|---|---|
| instance | `Header-desktop-two-layer` 8911:142487, 8623:56286 | `Header-mobile` 10635:80174 |
| box | 1440 x 92 | 375 x 82 |
| layout | VERTICAL, gap 12 | VERTICAL, gap 12, padding 6 / 19 / 12 / 19 |
| fill | — | `#001615` (green-coal-300), 1px `#123F3C` stroke |
| row 1 `main` | 1402 x 40 at 19,8 — HORIZONTAL gap 39 | `Frame 1185` 337 x 36 at 19,6 |
| row 2 `nav` | 1402 x 18 at 19,60 — HORIZONTAL gap 24 | 337 x 16 at 19,54 — HORIZONTAL gap 24 |

**Row 2 items, in order, at 375** (`nav` 10635:80202, on the 375 Dashboard
frame). Every one is Manrope Regular **12 / 14** (`fontSize` 12, `lineHeight`
`{PIXELS, 14}`), fill **`#95A09F`** (Ash 300), 14 tall — nothing is active on
this instance:

    Trending 46 · Breaking 45 · New 24 · [rule] · Politics 38 · Sports 35 ·
    Crypto 36 · Finance 41 · Tech 26 · Climate & Science 92 · Iran 20 ·
    Geo-politics 63 · More 43 (+ a 16px chevron)

The rule between New and Politics is a rotated `line` VECTOR whose layout width
is 0, so the 24 gap holds across it.

Content runs 797 wide inside a 337 window, i.e. the row is a horizontal
scroller. Its right edge carries the affordance the phone frame draws and the
1440 one does not: `icons/action` 16x16 pinned at x=321 over `Rectangle 158`
76x18 at x=337 — a chevron on a fade, both absolutely positioned outside the
auto-layout flow.

**Same list at 1440**, from 8623:56286: 54 / 53 / 28, rule, 44 / 41 / 42 / 48 /
30 / 107 / 23 / 74 / 48, items 18 tall, Manrope Regular **14 / 18**. On that
instance — a sample-market frame — `Trending` is ACTIVE at `#56C7F3` (Sky Blue
300) and the other twelve are `#95A09F`.

### ⚠ The type ramp is NOT flat, and the app currently treats it as flat

`PredictPage.tsx` `PILL_CLASS` and `PredictCategoryPage.tsx` `STRIP_LINK_CLASS`
are both a width-independent `text-[14px] leading-[18px]`, sourced to the 1440
measurement (`nav` 8610:164252, 1202 x 22) with the note "no cut of this file
ramps a control UP as the board narrows". The 1440 half of that is right. The
375 cut had never been read, and it is **12 / 14, not 14 / 18** — read off
`fontSize` and `lineHeight`, and the item widths fall in the same proportion
(46/45/24 against 54/53/28).

Not fixed here, deliberately, and three things have to land together before it
can be:

1. `TYPE_PILL_CLASS` on the same page is 12px and
   `predictTypeRowSubordinate.test.tsx` pins it STRICTLY below `PILL_CLASS` —
   relationally, out of the rendered DOM, not against a literal. Ramping the nav
   to 12 at 375 makes the two rows equal at exactly the width where the type row
   is most crowded, so the market-type row needs its own 375 value in the same
   change.
2. The 768 cut of this row is still unmeasured, so the breakpoint the ramp
   should hang on is unknown. `sm:` is 640 and matches no board in this file.
3. jsdom does not evaluate media queries, so a responsive ramp has to be pinned
   by a test that reads the class list rather than a computed size.

### Where the row is drawn, and where it is not

The header instance opens EVERY Predict frame, including the market detail
frames — `Skai > Predict > sample market - full (375x812px)` 10509:19476 draws
it with **Trending active in sky blue**, and 8623:56286 does the same at 1440.
The app renders the row as page content on `/predict/all` and `/predict/<slug>`
only; `PredictMarketDetail` has neither half.

What the frames do NOT answer, and the reason the detail row is still unbuilt:
what a click does from a detail page. On the board the categories are `<Link>`s
and the sort tabs are local state; a detail page has nothing to sort, and the
frame shows the instance in its DEFAULT variant (Trending active) rather than in
a state that could only belong to a detail page. Nothing in either frame carries
a destination. Building the sort half needs a `?sort=` deep link on
`/predict/all` that does not exist today and that no frame asks for.

---

## 2. `Bottom-navigation-mobile` 10640:30604 — measured against the shipped bar

Frame: 375 x **54**, HORIZONTAL, padding **4** on all four sides, five cells of
73.4 x 46 laid edge to edge (x = 4, 77.4, 150.8, 224.2, 297.6 — **no gap**).
Each cell: a 16 x 16 icon at y=6 and a 16-tall label at y=24. Labels **Trade ·
Predict · Play · Social · More**, Predict tinted.

* fill `#001615` at **opacity 0.60**
* stroke `#123F3C`
* effect **BACKGROUND_BLUR radius 20**

`modules/skai-ui/src/components/layout/mobile-bottom-nav.tsx:97-98` ships
`h-[52px] items-center justify-between gap-1 px-[19px] py-2`, `border-t
border-[#123f3c] bg-[rgba(0,22,21,0.6)] backdrop-blur-[10px]`, icons `size-4`,
labels `text-[13px] sm:text-[14px]`.

So the colour and its alpha already match, and the report that reads the
background as wrong is describing the three things that differ:

| | frame | shipped |
|---|---|---|
| height | 54 | 52 |
| blur radius | 20 | 10 |
| padding | 4 / 4 / 4 / 4 | 8 vertical, 19 horizontal |
| cell layout | 5 x 73.4, gap 0 | `justify-between gap-1` |

The file's own comment sources the translucency to node 6704:26136, a different
node from the one the report cites. Both agree on the alpha; only the blur
disagrees.

---

## 3. The five 375 dashboard sections

`Frame 1223` is the section wrapper on each category cut: 343 wide at x=16
(16 gutter a side), VERTICAL, **gap 16**.

* title row `Frame 337` 343 x 36, HORIZONTAL gap 8 — title block `Frame 450`
  299 x 24, then a 36 x 36 `CTA/button` at x=307, radius 8
* `Prediction markets` block, VERTICAL gap 16, opening with `Frame 403`
  343 x 18 (HORIZONTAL, gap 24 — the in-section nav) and then the market column

Market-column gap is per section, not global:

| section | node | frame height | column | gap |
|---|---|---|---|---|
| Overview | 10635:79870 | 1457 | `markets` | 16 |
| Elections | 10636:84555 | 1820 | `Frame 1225` | 16 |
| Sports | 10636:91678 | 1868 | `markets` | **8** |
| Economy | 10636:101272 | 504 | `markets` | **8** |
| Oscars | 10636:95405 | 1854 | `Frame 1228` | 16 |

Economy is also the only one that draws a `Frame 338` band above its column:
343 x 40, radius 8, padding 8, HORIZONTAL gap 8 — a 24px `icons/graphical`, a
271 x 14 label block, a 16px `icons/action` at x=319.

**There is no designed empty state.** Every one of the five draws a populated
column; none carries a zero-market variant at any depth. So the several reports
that ask "what does this section look like when its category has no markets"
have no parity answer to measure against, and Casey's 2026-09-08 ruling that
empty category tabs are fine at launch is the whole of the answer.

---

## 4. The two futures settings sheets at 375

Identical chrome, different body height. Both are `Right menu`, a near-full-
screen panel rather than a bottom sheet:

* 359 x 796 at 8,8 — an 8px inset on all four sides of the 375 x 812 board
* VERTICAL, gap 32
* `Frame 344` 335 x H at 12,12 (12px inset), VERTICAL gap 24
  * `controls` 335 x 22, HORIZONTAL gap 10 — an **18px** title, then a 16 x 16
    `icons/action` at x=319
  * `Frame 341` / `Frame 560`, VERTICAL gap 24 — the control rows
* `Frame 1178` 335 x 44 at 12,**740**, HORIZONTAL gap 8 — two equal 164 x 44
  CTAs: "Reset to default" (14px + a 16px icon) and "Save settings" (14px)

| sheet | node | parent frame | `Frame 344` height |
|---|---|---|---|
| Chart settings | 10594:57927 | 10597:72437 | 310 |
| Parameter settings | 10594:57886 | 10597:71622 | 238 |

Both are reached from a futures DETAIL, which is two levels inside the
Multiple-choice view on `/predict/all` — not on `/predict`, where the reports
were filed.
