# Orphan triage - lane `home` (wave 21 REMOVED-WITH-WORK)

Files in scope: `src/components/home-redesign/` - `HomeShellLayout.tsx`,
`HomeSidebarExpanded.tsx`, `HomeSidebarRail.tsx`, `HomeTopBar.tsx`,
`sidebarSurfaces.ts`.

Assigned 8 rows. Triaged 8. No code was changed, deleted or weakened.

Figma file `mhF3BkzlTaGiLzJ7kvpmVc`; pages `13008:110718` ("Home 2") and
`13006:134300` ("Trade 2").

## Headline: 7 of my 8 rows are false positives, and the cause is harvest depth

`snapshot.wave21.trade2.json` records `liveChildCount: 417` and exactly 417
nodes. The live harvest is **the page's direct children only** - one level deep.
The catalogue it is diffed against contains deep descendants: four of my rows
carry the note *"Row present because the code cites this node. citedByFiles /
implFiles are derived by grepping the tree for the node id, not transcribed."*
Those nodes were never page children, so they cannot appear in a depth-1 live
list, and the diff reports them as removed.

I did not stop at that inference. I queried Figma for each node id. Seven of my
eight still exist, at the same id, unchanged.

This is not a board that was re-cut. Nothing moved. The instrument cannot see
below depth 1.

Scope of the artifact across the whole wave: of the 97 REMOVED-WITH-WORK rows,
**85 fall strictly inside the id interval of a live top-level frame of the same
page** - including **all 83 trade-2 rows**. The 12 that do not are on home-2 (1),
dice (2), hilo (4), plinko (1), towers (4) and cover-images (2 inside).

Spot-check for another lane, so this is not just my own rows: the 8 rows on
`src/components/trench-redesign/discover/TokenCard.tsx` are `13006-134424`,
`134427`, `134428`, `134436`, `134451`, `134456`, `134459`, `134461`. One
`get_metadata` call on `13006:134424` returns a live 409x94 card frame **with the
other seven present inside it as descendants**. Eight rows, one live frame, zero
deletions. The "8 removed frames on one file" pattern in the brief is this same
artifact, not eight independent deletions.

## MOVED / false positive - 6 rows (frame still live at the same id)

Verified by `get_metadata` against the live file. Code is also live in every
case.

| nodeId | What Figma returns now | Live top-level ancestor |
|---|---|---|
| `13006-252239` | `Frame 218` (0,176) 232x42 - "Trench" text + `icons/action` chevron = the disclosure header | `13006:252220` "sidebar - open - trench" |
| `13006-252244` | `internal` (0,220) 232x134 | same |
| `13006-252249` | text "Alpha" | same |
| `13006-252257` | text "PnL" | same |
| `13006-252263` | text "Market Pulse" | same |
| `13006-146207` | `dropdown` (103,48) 300x344, five `nav` rows | `13006:144635` "Skai > Trade - dropdown 1VH (1440 x 900px)" (by id adjacency in the live list; the node itself was confirmed directly) |

The ancestor for the five Trench nodes is measured, not inferred - all five
appear inside the `13006:252220` tree in a single metadata dump, and
`13006-252220` is itself present in the live snapshot.

Two independent corroborations that these are the right nodes:

- Catalog note on `13006-252244` says the frame draws three children, *"Alpha
  (13006:252249), PnL (13006:252257) and Market Pulse (13006:252263)"*, and
  `13006-252257`'s note records *"Three 42px rows on a 44px pitch: Alpha y=0,
  PnL y=44, Market Pulse y=88 (42*3 + 2*2 + 4 = 134)"*. Live geometry: `internal`
  is 134 tall, rows sit at y=0, y=44, y=88. Exact.
- Catalog note on `13006-146207` records a 300x344 panel and icon nodes
  `13006:146209 / 146214 / 146219 / 146224 / 146229`. Live: 300x344, and all
  five icon instances are present.

Code reachability for these six rows (`HomeSidebarExpanded.tsx`,
`sidebarSurfaces.ts`, `HomeTopBar.tsx`):

`src/App.tsx:91` imports `HomeShellLayout`; it is mounted at `App.tsx:1104`
around every authed route when `REDESIGN_HOME` is on.
`HomeShellLayout.tsx:23` imports `HomeTopBar`, `:24` imports
`HomeSidebarExpanded`, and `:203` renders `<HomeSidebarExpanded collapsed={!expanded} />`.
`HomeSidebarExpanded.tsx:199` imports `sidebarSurfaces`. All live.

## LIVE - 1 row

**`13008-130964`** - "Skai > Home 1VH (1440 x 900px)", impl
`src/components/home-redesign/HomeShellLayout.tsx`, catalog status `done`.

This is the one genuine deletion in my set. `get_metadata` on `13008:130964`
returns *"The provided node ID was not found in the file."* It was also the
highest-numbered `13008-` node on the page, and home-2's only removal.

The code is LIVE and must not be touched: `App.tsx:91` imports it, `App.tsx:1104`
mounts it as the frame around every authed route.

**The spec is not lost with the row.** A frame titled character-for-character
"Skai > Home 1VH (1440 x 900px)" is live at **`2713:4800`** on the "Home 1" page
of the *same file*. Its structure is what `HomeShellLayout` renders: a
`Header-desktop` 1440x56 instance, a `sidebar` 58x844 collapsed rail, a ticker
`scroller`, and `main`. The deleted node was a duplicate of it sitting on the
Home 2 board; the canonical frame survives on Home 1.

`figma-drift.mjs` matches same-title replacements **within a section**, so a
same-title frame one page over is exactly the false-negative it cannot catch.
Worth noting for other lanes: the 12 rows that fall outside a live id interval
should each be checked against the sibling page before anyone calls them gone.

## ORPHANED - 1 row. REPORT ONLY, DO NOT DELETE.

**`13006-147438`** - impl `src/components/home-redesign/HomeSidebarRail.tsx`.

Two separate findings on this row, and they point opposite ways.

**The frame is alive.** `get_metadata` on `13006:147438` returns a live
`CTA/button` instance, (0,220) 36x36, holding `icons/action`. It sits at y=220 -
the sixth slot of the seven-button 36px rail column (y = 0/44/88/132/176/220/264),
the same column visible in `2713:4800`'s `sidebar`. So the drift row is a false
positive like the other six.

**The code it names is orphaned.** Both halves of the test:

*1. Import search.* Grepping `src/**/*.{ts,tsx,js,jsx}` for the bare identifier
`HomeSidebarRail` - which catches every alias form, since a named import, a
namespace access (`X.HomeSidebarRail`), a re-export and a default import from
`"./HomeSidebarRail"` all have to spell it - returns exactly one non-comment,
non-self reference:

```
src/components/home-redesign/index.ts:7:export { HomeSidebarRail } from "./HomeSidebarRail";
```

Every other hit is a comment, a test docblock, or the file's own definition
(`HomeSidebarRail.tsx:89`, `:124`, `:242`). Nothing imports the symbol from the
barrel.

*2. Reachability.* A barrel re-export nobody consumes is not reachability. The
shell renders the other component: `HomeShellLayout.tsx:203` is
`<HomeSidebarExpanded collapsed={!expanded} />`. The collapsed 58px rail is
`HomeSidebarExpanded` with `collapsed`, not this file. `HomeShellLayout.tsx:192-202`
records why - the shell used to swap `HomeSidebarRail` and `HomeSidebarExpanded`
on hover/focus, which unmounted whatever a keyboard user had focused (WCAG 2.4.3
fail), so it was replaced by one always-mounted tree clipped to 58px. The trace
ends there. No route reaches `HomeSidebarRail`.

Two prior triages in this tree found the same thing and left it in writing:

- `HomeSidebarExpanded.tsx:3287` - *"the one call site a grep finds lives in
  HomeSidebarRail, which is never mounted."* (This is load-bearing: report
  b498f499 was "clicking the menu opens no page", and the cause was that the only
  navigation to `IntelligentSupportHub` lived in this dead file.)
- `HomeSidebarExpanded.social.test.tsx:287-292` - *"that file is exported from the
  barrel and imported by nothing, so asserting against it would prove nothing
  about what users see."*
- `status.home.tsv` already carries the note *"cited HomeSidebarRail.tsx orphaned
  but rail state renders"*.

242 lines, superseded by a deliberate accessibility fix, still exported from the
barrel. Deleting it is Casey's call, not this wave's.

## Instrument notes for whoever runs the next harvest

- `liveChildCount == len(nodes)` in every wave21 snapshot. The completeness proof
  confirms the harvest got **all the direct children**; it says nothing about
  depth. A catalogue holding code-cited deep nodes cannot be diffed against it
  without manufacturing removals.
- `figma-drift.json` in the catalog root is from **2026-08-13** and still marks
  home-2 and trade-2 `not-harvested`. It carries no metadata for these rows -
  `figma-drift.wave21.merged.json` is the one with content.
- `trade-2.titles.tsv` and `home-2.titles.tsv` are from 2026-09-01 and predate
  this harvest. `pages.json` already flags trade-2.titles.tsv as misfiled
  (89 rows of `3928-*/4018-*/7890-*` ids against a page whose 407 children are
  all `13006:`). I used the wave21 snapshots, not these.
