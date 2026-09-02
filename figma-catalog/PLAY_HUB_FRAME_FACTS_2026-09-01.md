# Play hub — frame facts measured 2026-09-01 (lane A7)

File `3sSzw1KewMtUbeLAv7uW0r` (Skai Web App 1) unless stated otherwise.
Every colour below was **sampled from a 1:1 render**, never read from a
variable name.

---

## 1. The `/play` page ground is ONE flat colour

Frame **9099:146637** "Skai > Play (1440 x 900px)", natural size 1440 × 4221.
Rendered 1:1 and sampled by row:

| row | `#001615` = rgb(0,22,21) | of 1440 |
|---|---|---|
| y=40 | 1379 | remainder is content |
| y=1000 | 1406 | |
| y=3000 | 1166 | |

**No grid, no particle field, no glow orbs, anywhere in 4221px.**
`bg-green-coal` compiles to rgb(0 22 21), so it is the correct fill.

### ★ The trap: the hub's grid was invisible to a class-name search

`.grid-bg` is a real rule (`src/index.css`, `skai-ui/src/styles/base.css`) that
really does draw a 60px masked green grid — and **no component applies it**. The
hub's grid was built from Tailwind *arbitrary values*:

```
bg-[linear-gradient(rgba(44,236,173,0.03)_1px,transparent_1px),…] bg-[size:60px_60px]
```

so the class name it resembles appears in **no source file**. Grepping `grid-bg`
returns nothing whether the defect is present or absent. An earlier pass did
exactly that and routed the bug to the main repo as a shell problem; it was
`skai-gaming/src/pages/play/Play.tsx:2402`.

**Rule: for arbitrary-value utilities, grep the GEOMETRY (`60px_60px`), never the
name of the rule it resembles.**

---

## 2. Sports rail — the coral plate is a shared constant, the arch is not

Row **9099:146844**, cards 250 × 96, art box 64 × 64 at x=170,y=16.

All four shipped exports (`assets/play/sports/{soccer,basketball,football,tennis}.svg`)
open with the **identical** first path — a 64×64 rounded-8 rect, `fill="#FF7E50"`.
Only below it do they diverge.

- **Ground `#FF7E50` is reusable.** A sport with no illustration can stand on it.
- **The stadium arch is NOT.** Its geometry is hand-placed per plate — soccer's
  second path starts x=25.42, basketball's 32.09, football's 23.22. There is no
  shared value; a fourth would be invented.

### ★ The trap: node 9099:146931 is scaffolding, not an empty state

Code cited it as "the frame's un-illustrated card" and drew a bare 1px outline
from it. It is the **sixth card of a five-card row**, at x=1330 — outside the
row's own 1318 width — and labelled "Tennis". It is the clipped next card that
shows the rail scrolls. **The frame specifies no empty state at all.**

Frame draws 5 plates (Soccer, Basketball, Football, FIFA, Tennis); the rail ships
7 sports. The two lists disagree in **both** directions — open design question.

---

## 3. Trending tile subtitle has TWO shapes, not one

Row **9099:146736**. Both subtitle rows sit at y=289 under the 195 × 277 card, 18 tall.

| shape | node | contents | width | tiles |
|---|---|---|---|---|
| **A — players** | `Frame 607` | 10×10 `icons/action` at y=4 · count · the word `playing` | 98 | 1, 3, 6, 7 |
| **B — recent win** | `Frame 608` | 18×18 `images/circle` at y=0 · handle · signed amount | 152–154 | 2, 4, 5 |

Example A: 9099:146744 / …745 "2,169" / …746 "playing".
Example B: 9099:146754 / …755 "Valorant155" / …756 "+30.07K".

The app implements **only shape A**. A static mock showing a mix cannot
discriminate "each tile picks whichever signal it has" from "all tiles rotate on
a timer"; the interleave (A on 1,3,6,7) does not settle it. Prefer the former —
it needs no invented cadence and degrades correctly on a quiet casino.

---

## 4. RPS bet panel — Manual | Auto, and the currency control

File **`M6r9FEn042UWTQD1zvy6GM`** (Skai Games). Panel Frame 270 = **9907:1652**,
356 × 621, 16px padding, six blocks at y = 16, 74, 180, 248, 306, 364 against
heights 42, 90, 52, 42, 42, 66 — **every seam exactly 16px**.

### Manual | Auto — 9907:1653 (the FIRST block, y=16)

- Track 324 × 42, 4px padding, **no fill** — sits straight on the panel ground.
- Two cards 158 × 34 butted at x=4 (`9907:1654` Manual) and x=162 (`9907:1661` Auto).
- **Corner 8px**, measured by scanning where the fill starts along the arc: first
  blue pixel at y=4 is x=11, reaching the card's x=4 edge by y=11.
- Selected: fill `#56C7F3`, label `#001615`. Unselected: **no fill**, label `#FFFFFF`.

### Currency control — 9907:1756, INSIDE the bet field

Within the Bet-amount card (`9907:1749`, 160 × 42) sits `Frame 1000004096`
(x=35, y=1, 101 × 16):

- `9907:1757` ellipse `circle` 16 × 16 at x=73 — the currency coin
- `9907:1758` `Frame 354` 8 × 4 at x=93 — a caret vector
- `9907:1759` text `"0.01 SKAI"` — **hidden**

There is **no** standalone three-up "Point / SKAI / USD" row. The control
collapses into the bet field as a coin + caret, and the currency label is
explicitly hidden — three hidden copies exist (`9907:1759`, `9907:1761`,
`9937:19150`), so it is deliberate, not one stray layer.

⚠ The frame states no menu — only "current currency, tap to change". Reuse the
existing currency menu rather than inventing a second one.
