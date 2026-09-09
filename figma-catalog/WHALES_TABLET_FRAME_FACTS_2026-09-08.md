# Whales at 768 — frame facts, measured 2026-09-08

File `mhF3BkzlTaGiLzJ7kvpmVc`, page **"✅ Home 2"** (`13008:110718`), which
`live/_pages.json` scopes `in-scope`. Every number below was read off the node
named beside it with `get_metadata`, not inferred from a sibling, a screenshot,
or the desktop board.

## ⛔ THE TRAP THAT COST THIS SURFACE THREE REPORTS

`src/components/home-redesign/whales/ActivityView.tsx` carried its whole `md:`
tier against **`9917:115712` / `9917:115714` / `9917:115723`** and
**`9934:147643` / `:147649`**.

**None of those node ids exist in ANY tracked file.** `get_metadata` returns
*"The provided node ID was not found in the file"* for `9917:115714`,
`9917:115723` and `9934:147643` against `mhF3BkzlTaGiLzJ7kvpmVc`,
`3sSzw1KewMtUbeLAv7uW0r` **and** `M6r9FEn042UWTQD1zvy6GM`. The sibling-file check
is not optional — `_pages.SCOPE-WARNING.md` records that ids were copied
`3sSzw`→`mhF3`, so a node missing from the file a comment names is often alive in
the other one, and calling it deleted on one lookup is a known wrong answer. Here
it survives all three. The Home 2 page draws a different tablet entirely, and
reports 5e35db62 / e9ddc081 / d9b65dd8 (2026-09-09) are the same finding: the app
was built to a cut nobody can now produce.

★ **A node id in a code comment is not proof the node is on the page you are
building to.** Resolve it before you trust it: a missing id fails loudly, but a
*wrong-file* id that happens to resolve fails silently.

⚠️ **This file makes NO claim about `v1-superseded` meaning "retired".** It cites
Home 2 only because Home 2 is where the whales tablet frames are — Home 1 has
none. Commit `d76adff` retracted the "v1-superseded is not a parity target"
reading, and independently re-measured here: Home 1 (`2003:674`) and Home 2
(`13008:110718`) share **zero** top-level ids, and Home 2 holds **zero** frames
matching `deposit|quick balance|wallet mini|buy with fiat|send crypto` against
Home 1's 29. The two pages are different frame sets, not two versions of one.

## The bento stacks. There is no "Wallets | X accounts" tab pair at 768.

| Node | Board | bento | = Frame 445 + gap + Frame 446 |
|---|---|---|---|
| `13008:119991` | Whales — no data (768x1024) | 708x818 | 403 + 8 + 407 |
| `13008:121240` | Whales (768x1537) | 708x1128 | 403 + 8 + 717 |
| `13008:122597` | Whales (375x1452) | 347x944 | 497 + 8 + 439 |

Both panels drawn, both on screen, 8px apart, at BOTH small widths. Nothing on
either 768 board draws a pane control. The desktop split (`13008:115137`) is the
only two-column tier.

## Wallet-manager header row — the DESKTOP bar at the tablet's width

`Frame 1` `13008:119996` (no data) and `13008:121245` (populated), each 676 wide
over the card's 16px inset, identical to each other:

| Item | x | w | Node (populated board) |
|---|---|---|---|
| nav (collapsed select) | 0 | 128 | `13008:121246` |
| search | 148.5 | 181 | `13008:121252` |
| actions | 350 | 326 | `13008:121255` |

128 + 181 + 326 = 635 in a 676 track; 148.5 and 350 are exactly where
`space-between` lands them. Inside the actions group: Import 96 at x=0, Export
96 at x=104, Add wallet 118 at x=208 — **8px gaps, labels drawn**
(`13008:121256-58`), which is the desktop group `13008:110761-63` unchanged.

The nav is ONE pill, not three labels: `Frame 404` is 128 wide around a 112-wide
label+caret, and the other two tabs are parked at x=152 under `hidden`
(`13008:119999-120002`). Same control, same 128x22, as the 375 board
`13008:122605`. Only the desktop board `13008:110748` gives the row its full 308
and all three labels.

Search internals are the suite's standard `search` frame: 16px `icons/action` at
x=8 y=8, placeholder at x=34 y=9 — the 8/16-on-a-10 pair every whales search
draws.

## Display settings — the split is Activity-vs-Flow, not narrow-vs-wide

| Node | Board | Size | Label |
|---|---|---|---|
| `13008:120051` | Whales — no data 768 (Activity) | 133x32, glyph slot x=8 y=4, label x=40 y=8 | **drawn** |
| `13008:121491` | Whales 768 (Activity) | 133x32, same | **drawn** |
| `13008:122594` | Whales 375 (Activity) | 133x32, same | drawn |
| `13008:120858` | Whales 768 (Flow) | 32x32, glyph x=4 y=4 | hidden |
| `13008:122991` | Whales 375 (Flow) | 32x32 | hidden |

The Flow header squares the pill because the AI Analysis pill sits 8px to its
right and the pair has to fit — `13008:120861` at 768 is 131x34 with a 16px
`icons/platform` at x=24 and its label at x=44; `13008:122994` is the 375
equivalent. Activity draws no such button, which is why its label survives at
both narrow tiers. Reading `13008:120858` as "768 hides the label" — without
checking which TAB the board is — is what shipped the wrong rule.

## Page header, 768 — `Frame 337` `13008:120042` / `13008:121482`

708x36 at x=30 y=24, 24px above the bento.

| Child | x | w/h | Note |
|---|---|---|---|
| "Whales" | 0 | 121x28 | 24/28 type |
| nav | 291.5 | 113x22 | active pill `Frame 404` 61 (8 + 45 + 8), second label 28 at x=85 → **24px apart** |
| Frame 512 | 575 | 133x32 | Display settings, right edge flush at 708 |

The nav's own centre is 348 against the container's 354; a `1fr auto 1fr` grid
that centres on 354 is inside Figma's own manual-placement noise here.

## What was changed against these numbers

Main repo commit `17e880fc4` (2026-09-08), `ActivityView.tsx` +
`WhalesScreen.tsx`, with `whalesTabletBento.figma.test.tsx` pinning both halves
— including the negative case, because **Trench mounts the same component** and
its own 768 boards (`13006:344538`, `:345991`) DO draw the pane tabs. Every step
is gated on the `board` prop for that reason.
