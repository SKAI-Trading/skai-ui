# Roulette + Fortune Wheel — frame facts, 2026-08-26

Measured live (`get_metadata` + 1:1 `get_screenshot` renders, radial colour scans
in Python), file `M6r9FEn042UWTQD1zvy6GM`. Everything below is a measurement, not
a registry read — the registry supplied top-level node ids only.

Companion to `TRAPS.md` §3: **both pages' main desktop frames are TITLED
"Skai > Play > Casino > Scratchers".** Identify by page name and the H1 text
node. Roulette page `9737:13085`, frame `9799:15067`. Fortune Wheel page
`9390:18297`, frame `9691:12630`.

---

## 1. Roulette — the fairness sub-bar the app did not have (report `1c7e73fe`)

`9799:15324` "Frame 1000004041", **1318 x 54, at y=629** — i.e. directly under
the 621-tall game block `9799:15121`, with the frame's 8px seam.

```
Frame 1000004037   (16, 12)    1286 x 30       content box
  Frame 656        (0, 0)       163.33 x 30    left cluster, 10px pitch
    icons/action   (0, 8.33)     13.33         info
    CTA/button     (23.33, 0)    30 x 30       refresh
    CTA/button     (63.33, 0)    30 x 30       heart
    CTA/button     (103.33, 0)   30 x 30       sound
    icons/graphical(143.33, 5)   20            fullscreen
  skai-short       (637.68, 0)   71.98 x 30    centred wordmark
  Frame 1000004038 (1184, 3)    102 x 24       "Provably fair" (72 x 18) + 24px glyph
```

★ **This is ONE component instanced on every game page**, and at matching depth
the instances are identical to the pixel. So the sub-bar SVG assets already
committed under `assets/games/dice/` are the same glyphs, not a borrowed
look-alike — Limbo, Mines and Plinko already import them from there.

⚠️ **CORRECTED 2026-08-26 — this table first paired Dice `9061:16826` against
Roulette `9799:15326` and called them identical. Those are two different
LEVELS.** 16826 is the 1318 x 54 wrapper; 15326 is the 163.333 x 30 cluster.
`TRAPS.md` §12 is exactly this (a container id standing in for a child), and the
**dimension check is what catches it** — a 1318 x 54 frame was never going to be
the same object as a 163.33 x 30 cluster. Verified level by level:

| level | size | dice | roulette |
|---|---|---|---|
| wrapper | 1318 x 54 | `9061:16826` | `9799:15324` |
| content box | 1286 x 30 | `9061:16827` | `9799:15325` |
| cluster | 163.333 x 30 | `9061:16828` | `9799:15326` |

Cite the cluster as **`9061:16828`**, not 16826. The conclusion was right; the
citation was not.

The Roulette **title row** (`9799:15071 → 15072 → 15073`) holds exactly three
nodes: a 24px chevron, a 32x32 art square, the word "Roulette". No control
cluster. That is the other half of the report and it checks out.

Shipped in skai-gaming `41e85aa` as `RoulettePageSections.tsx`. **Not deployed.**

---

## 2. Roulette — the turret is on the CARDINALS (report `71134134`)

★ **A SINGLE FRAME OF A ROTATING PART CANNOT ESTABLISH ITS REST ORIENTATION,
and this is the case that proves it.**

The turret was transcribed from `9925:16308`, which is the **spinning-state**
render (motion-blurred numerals, ball visible). The turret rides inside the
rotating wheel, so that frame catches it at whatever angle the spin froze at.
Measured there: tips at **~16.5 / 109.5 / 203 / 289.5 degrees**. The code shipped
45 / 135 / 225 / 315 — which is neither that frame's angle nor the rest angle.

The static frame the report cites, **`9948:22957`** (287.88 x 285, group
`9948:22958` 249.49 sq), settles it. Radial colour scan at 1:1, centre
(143.94, 143.94):

| angle | gold spans |
|---|---|
| 0, 90, 180, 270 | r = 8 .. **34** |
| everything else | r = 8 .. 11-13 |

⇒ four-point star, **tips on the cardinals**, hole radius ≈ 7.

Normalised against the inner disc (r=75 there, r=0.515 of the full wheel in
`9925:16308`), the two frames **agree on every ratio**:

| | 9948:22957 (static) | 9925:16308 (spinning) |
|---|---|---|
| tip   | 0.447 | 0.454 |
| waist | 0.153 | 0.150 |
| hole  | 0.093 | 0.099 |

They disagree **only** on the angle — exactly what a rotating part predicts.

Ring geometry, for anyone re-deriving it: `9925:16308` runs pockets
0.52 .. 0.87 of the FULL wheel radius with a `#123230` rim outside;
`9948:22957` omits the rim, so its pockets run 0.609 .. 1.0 of its own group.

⚠️ **The "rescale by 0.87 and they are the same wheel" line that stood here was
an ASSERTED RELATIONSHIP between two measured numbers, and it was stated more
exactly than it is true.** 0.52 / 0.87 = **0.598**, against a measured
**0.609** — they agree to about 1% of the radius (~2.5px on the 223px render),
which is inside what a radial colour scan across an anti-aliased edge can
resolve, but it is NOT an identity. Read it as "consistent with the same wheel",
not "the same wheel". The conclusion it supports — that the shipped SVG's
62/100 inner-to-outer ratio is right — survives either reading, since 0.62 sits
between the two.

---

## 3. Fortune Wheel — the wheel is a TICK RING, not a pie (report `d7d6bc1f`)

`9733:7556` "Group 322", 446.06 x 469.

```
Group 319          446.06        the wheel
  Ellipse 202      446.06        track disc, #123F3C
  Group 315        399.595       = 0.896 of the wheel
    Ellipse 92     399.595       #001615 disc
    Group 309      50 x "Ellipse 152..201"   the ticks
  Frame 1000004188 185.858       centre readout ("Spin to Win!", 88 x 20)
Group 320          26.46 x 63    the pin, at y=63 (wheel top is y=85.94)
```

Radial scan at six angles, normalised to the wheel radius:

| band | radius | fill |
|---|---|---|
| centre | 0 .. 0.803 | `#001615` |
| readout ring (stroke only) | ~0.412 .. 0.417 | white @10% over `#001615` |
| tick band | 0.803 .. 0.892 | tier colour, or `#1A2D2C` for an empty slot |
| track | 0.892 .. 1.0 | `#123F3C` |

★ **The 50 "Ellipse" nodes are all 399.595 square** — they are one stroked
circle split into 50 arcs (stroke ≈ 0.089 R, round caps), not 50 shapes. The
band is an ANNULUS with a dark centre; the app draws a full-radius conic pie
with a text label on every wedge. **That is the headline delta on `d7d6bc1f`,
and it is a Casey question, not a parity fix**, because collapsing the pie to
the frame's band leaves no room for the wedge labels (17px of band at 14px
type) and the frame carries none. See the report.

**What DID ship** in skai-gaming `41e85aa` (not deployed): the three decorations
no frame draws are gone — a `from-primary/30 … blur-xl` halo, 24 pulsing
`bg-yellow-400` lamps at 48% radius, and a `Star` at `opacity-10` behind the
readout — and the pointer is now a fraction of the wheel (height 56/446.06 =
0.1253, overhang 16.94/446.06 = 0.0379, width derived from the exported
19.5821 x 49.4646 vector's aspect). It was a fixed 20 x 50 at `top: -12`:
about right against the `sm` 384 wheel and **25% oversized** against the 320
one, which is the 375 viewport.

---

## 4. Fortune Wheel — the multiplier strip already matches (report `90c69fb0`)

`9733:5378` "Frame 1000004187", 954 x 42. Five chips of **179.6 x 42** at
x = 12 / 199.6 / 387.2 / 574.8 / 762.4 ⇒ **padX 12, gap 8, equal widths**.
`get_design_context` on chip `9733:5379`:

```
bg #122524 · border rgba(255,255,255,0.1) · rounded-[8px]
drop-shadow 0 3px 0 #1a2d2c · px-[2px] py-[17px]
label: Manrope Bold 14, white, centred
```

Every one of those is what `PAYOUT_CHIP` already ships, and the label inherits
Manrope from `font-sans` (`design-tokens.ts` `sans: ["Manrope", …]`), so the
"Manrope Bold" note needs no `font-manrope` class. Radius 8 is a **pixel
literal** and must stay one: 8 is `rounded-sm` in this app and `rounded-lg` in
Figma's stock scale (see `TOKENS.md`).

Two deltas remain and neither is a styling fix:

1. **Chip COUNT: 9 (rail) vs 5 (frame).** Permanent — the strip is driven by
   `CLASSIC_SEGMENTS`, parsed at test time against
   `supabase/functions/game-settlement/index.ts` and `_shared/paytables.ts`.
2. **Vertical anchoring.** The frame pins the strip 12px above the 621-tall
   board's bottom edge (y=567..609) with 35px of air under the wheel. The app
   puts it 12px under the wheel with an `h-24` result block after it, because
   the app's board column is not a fixed 621. Restructuring that is a layout
   change, not a strip change.

The frame's five VALUES — 0.00x / 1.50x / 2.00x / 3.00x / 5.00x — do agree with
the rail's tier ladder. The `1.20x` and `203.27x` conflicts live on OTHER nodes
(`9691:14020`, `9733:6371`, hidden strip `9733:5276`), not on this one.
