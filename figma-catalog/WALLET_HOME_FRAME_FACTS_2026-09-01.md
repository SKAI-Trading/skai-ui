# Wallet home — frame facts, measured 2026-09-01

Measured by lane W1 while working the streaks / quick-actions / share-portfolio
widget reports. Everything here was sampled from a render, not read off a token
name or a layer title.

## Which board governs the wallet home

`WalletHomeRoute` is the only route that mounts `StreakBanner`, `NetWorthCard`
and `QuickActionsBar`. Its boards are:

| width | board |
|-------|-------|
| 1440  | `13008:26985` |
| 768   | `13008:39376` |
| 375   | `13008:40894` |

`13008:28453` ("… > home > streaks 1VH") is a **streaks page**, and the wallet
has no streaks route — the routes are home, activity, account, send, receive,
swap, token detail, login, unlock, welcome. Frames under that board describe a
surface that does not ship. This mattered: `13008:28468` was used to reskin the
home streak card teal, and it is a different page's card.

★ **A card takes the board of the page it renders on.** That is the rule that
survives; "the newer board wins" is not, and neither is "the board beats a loose
frame" — see below.

## `3026:16854` is not a loose frame

It renders **byte-identical** to `13008:27000` (same sha256 on the PNG export at
the same `maxDimension`), and `13008:27000` sits on the 1440 home board. A 2026-08-19
ruling reskinned this card on the stated ground that `3026:16854` was "a loose
680x96 frame at the canvas origin with no board around it". That is true of where
the node sits on the canvas and false about the design.

★ **Before concluding a frame is orphaned, render it next to the board's own
child and compare the bytes.** Canvas position is not provenance.

## Streak card fills, by surface

| surface | node | card | stat box |
|---------|------|------|----------|
| home | `13008:27000` (= `3026:16854`) | `#2b0000` + Ellipse 24 bloom | `#411511` |
| streaks page (not built) | `13008:28468` | `#001615` flat | `#122524` |
| account menu | `13008:27758` | `#122524` panel | `#411511` |

The account menu is the tie-breaker for the box: on a Green Coal 200 panel the
frame still paints the stat box coral-red, so `#411511` is the box's own fill and
not something inherited from a red card.

## Reproducing a Figma blurred-ellipse glow as a CSS gradient

Figma's "Ellipse 24" (`13008:27001`): solid `#C94F44`, rx 219 / ry 219.5, layer
opacity 0.64, Gaussian blur stdDeviation 136.078, exported on a 982.312 x 983.312
canvas (`inset: -62%`, sized to hold the blur shoulder).

Two traps, and both make the glow too wide and too flat, which reads as a dull
muddy card rather than a bright bloom:

1. **Measure the ellipse offset against the CARD, not the export box.** The node
   is at `x=362.5 w=438`, so its centre is `362.5 + 219 = 581.5` across a **680px**
   card — 98.5px in from the right edge. The shadow-expanded export box is 800.5px
   wide and yields 219px, which drags the bloom into the middle of the card.
2. **`radial-gradient(circle at …)` with no size resolves 100% to the box's
   FARTHEST CORNER.** On a 982x983 box that is 694.9px, not the 491.156px radius
   the stops were sampled at — every stop lands 1.415x further out. Write
   `radial-gradient(circle 491.156px at 50% 50%, …)`.

Correcting both took mean |ΔR| across the card from 27.9 to 10.8 against the
frame. The residual is a near-uniform +8..+14, which is the `inset 0 1px 16px
#c94f44` rim the frame also draws; it is not worth chasing.

## Quick actions header

The current 1440 board **draws** `Quick actions  Edit ✎ … Collapse ›`. The older
`3123:2327` omits Edit, and the 375 board `13008:40945` omits it too. Edit is the
only route into the favourites editor, so the 375 omission is a crop, not a
deletion order — hiding it under a desktop breakpoint strands phone users.

Collapse chevron: the frame's mark is a **filled** vector measuring 7.06 x 12.71
in a 16px box. lucide's `ChevronRight` covers 4.00 x 8.00 stroked in the same box,
so "the arrow is too small" is the glyph, never the box. Same shape of finding as
the share sheet's back chevron (`M16.5898 3.53027…`, 10.59 x 19.06 in 24px, against
lucide's 8 x 14).

## Share portfolio

Current board `13008:30032`; current card face `13008:34634`.

- Panel `#122524`; the preview/"View full screen" row is `#052D2D` inside a 1px
  `#123F3C` hairline; the button plate is `rgba(0,22,21,0.8)` at `backdrop-blur(10px)`
  — sampled composite `rgb(1,27,26)`.
- Section labels ("Select theme", "Include:", and each toggle label) are pure
  **`#FFFFFF`**, not the secondary grey.
- The current card face **has** a large QR (about 39% of the card width) with the
  Skai bolt knocked out of its centre. `7491:148751` is the previous generation —
  balance-led, no QR — and reports citing it are citing a superseded frame.
- The "Include:" list is three switches: Portfolio balance / Achievements / QR code,
  all drawn On.

★ **`get_screenshot` returns the node plus its shadow bleed.** A 680x96 card with a
`0 10 80` shadow comes back 840x256. Subtract the bleed before computing any
offset as a fraction of width, or every ratio is wrong by the shadow.
