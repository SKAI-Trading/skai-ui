# Which Figma file is a node actually in?

Measured 2026-08-13 by listing `figma.root.children` on each file. Every page name
below is copied verbatim from the live file, not from memory or from a prior doc.

## The rule most agents are given is WRONG for two thirds of the product

The standing fleet instruction reads:

> Live product file: `mhF3BkzlTaGiLzJ7kvpmVc` (Skai-Web-App-2). `3sSzw1KewMtUbeLAv7uW0r`
> is the OLD file — it 404s most node ids, but ids were PRESERVED across the move, so
> retry the same node id against the live file.

**That is true ONLY for Home, Wallet and Trade.** It is false for everything else, and
following it literally makes an agent conclude "this node was deleted" about a node that
is alive and well in the old file.

`mhF3BkzlTaGiLzJ7kvpmVc` contains **six content pages, and nothing else**:

```
2001:2         Thumbnail
2003:674       ✅ Home 1
13008:110718   ✅ Home 2
2998:19593     ✅ Wallet 1
13008:26951    ✅ Wallet 2
3:3            ✅ Trade 1
13006:134300   ✅ Trade 2
```

There is no Predict page, no Play page, no Onboarding page, no Social page and no
Governance page in the live file. They were never moved.

`3sSzw1KewMtUbeLAv7uW0r` is **not a dead file**. It is the sole home of nine pages:

```
2001:2         Thumbnail
3422:20110     📍 Master sheet
10385:2        🚧 Titles + Emblems
10438:15679    🚧 User Flow
3:2            ✅ Onboarding and Authentication
2311:5967      ✅ Privacy and Terms
3173:26018     ✅ Predict
4459:128102    ✅ Play
4914:113562    🚧 Social
5210:118077    🚧 Governance and Utilities
2003:674       ✝️ Home   (moved to "Skai Web App 2")
2998:19593     ✝️ Wallet (moved to "Skai Web App 2")
3:3            ✝️ Trade  (moved to "Skai Web App 2")
```

The three `✝️` pages are tombstones — the page objects survive under their original ids,
but their frames live in the new file. Those are the only three surfaces the
"retry against the live file" rule applies to.

`registry.json.sectionFile` already encodes this correctly and was verified against the
live page lists on 2026-08-13. It is the authority; this file explains why.

## Decision table

| Section | File to query | Retry in the other file if it 404s? |
|---|---|---|
| home, home-2, wallet, wallet-2, trade, trade-2, pwa | `mhF3BkzlTaGiLzJ7kvpmVc` | No — the old file's copies are tombstoned |
| predict, play | `3sSzw1KewMtUbeLAv7uW0r` | No — these pages do not exist in the live file |
| onboarding, legal, master-sheet, social, governance, user-flow | `3sSzw1KewMtUbeLAv7uW0r` | No |
| every casino game, cover-images | `M6r9FEn042UWTQD1zvy6GM` | No |

A bug link whose URL names `3sSzw…` but whose node is a Home/Wallet/Trade node is a
**stale link**, not a missing node. `bug-node-index.tsv` marks each of those
`status=retarget` and gives the correct `resolvedFileKey` — 53 of the 430 bug-linked
nodes are in that state.

## `get_metadata` with no nodeId is not a file probe

Called without a `nodeId`, `get_metadata` returns `2001:2 Thumbnail` for **every** file
in this org. It looks like an answer and identifies nothing. To ask "what is in this
file", run `figma.root.children` through `use_figma` as this document did.

## Pages load lazily, but `getNodeByIdAsync` is NOT affected

Worth stating because it was tested and the intuitive answer is wrong.
`pages.json` correctly warns that counting a page's `children` requires
`setCurrentPageAsync` first, because an unloaded page reports `children.length === 0`
rather than throwing. **That trap does not extend to `getNodeByIdAsync`** — it resolves
nodes on unloaded pages fine. Verified 2026-08-13: a single script resolved nodes across
all six pages of the live file with no page switching, and re-running the 57 unresolved
ids *with* `setCurrentPageAsync` on Onboarding, Social and Governance returned zero
additional hits.

So when `getNodeByIdAsync` returns null, the node genuinely is not in that file. Confirm
with `get_metadata` on the same id — an independent code path — before recording it as
`gone`, which is what was done for all 57 in `bug-node-index.tsv`.

## The Games file

⚠️ **The list that used to sit here was measured 2026-08-13 and is now wrong in five
ways.** Re-listed live 2026-08-26 via `figma.root.children` — **30 pages, not 22**:

```
2001:2        Thumbnail                    3422:20110    📍 Games master sheet
9220:26175    🌎 Cover Images               2003:674      ✅ Dice
9003:72411    ✅ Plinko                     9003:85754    ✅ Crash
9003:102080   ✅ Mines                      9003:112414   ✅ Blackjack
9003:122027   ✅ Coinflip                   9003:133221   ✅ Scratchers
9061:15464    ✅ Chicken                    9058:1819     ✅ Hi-Lo
9390:18294    ✅ Darts                      9390:18295    ✅ Keno
9390:18297    ✅ Fortune Wheel              9737:13087    ✅ Video Poker
9390:18296    ✅ Bingo                      9737:13085    ✅ Roulette
9390:18298    ✅ Rock Paper Scissors        9061:15449    ✅ Towers
9737:13088    ✅ Baccarat                   9929:16390    ✅ Limbo
9929:16391    ✅ Slide                      9660:2        ✅ Price Grid
10120:10113   Towars Draft (Disregard)     10265:3       ----------
10265:2       🚧 Safari Slots               10266:5       🚧 Cosmic Slots
10266:6       🚧 Vegas fortune              10266:7       🚧 Gem Slots
```

Every page name now carries a **` - Skai originals`** suffix (omitted above for width) —
so an exact-match on the old bare names finds nothing.

What changed, and why each one matters:

1. **`9660:2` is no longer SKAI Cross — it is `✅ Price Grid`.** The page was renamed and
   its contents replaced wholesale. SKAI Cross is a **shipping** game that now has no
   Figma page at all. `pages.json.unmappedSections.skai-cross` records this in full.
2. **Roulette, Baccarat, Rock Paper Scissors and Towers are all `✅` now**, not `🚧`.
3. **Roulette and Baccarat are NOT empty pages.** The old note below claimed they were
   recorded in `outOfScope` as empty. Both carry complete designs — Baccarat has 1440
   **and** 375 cuts plus a `Tie Pays 8 to 1` paytable. Anything relying on "those two are
   empty" is acting on a 13-day-old reading.
4. **Four new pages** — Limbo, Slide, and the four slots pages (Safari / Cosmic / Vegas
   fortune / Gem). Their true state differs sharply per page: see `TRAPS.md` §4.
5. `10120:10113 Towars Draft (Disregard)` is a 51-node draft the author has explicitly
   told you to ignore — note the typo, an exact-name match on "Towers" misses it.

★ **Do not read a game's name off a frame title on any of these pages.** The
duplicated-scaffolding artefact noted below is not two frames — it is systematic across
twelve games. `TRAPS.md` §3 has the full title-vs-truth table.

Note `9163:4859` on the **Mines** page is titled `Skai > Play > Casino > Dice
(1440 x 900px)`, and `9003:117620` on the **Blackjack** page is `Cards ALT - Chicken`.
These are the duplicated-scaffolding artefacts CATALOG_DESIGN.md warns about: the page
emoji is ✅ but the frame was copied from another game and never renamed. Do not read a
game's name off a frame title without checking which page owns it.

## The wallet set was REGENERATED — old ids are dead, replacements are in this repo

Measured 2026-08-18 while working the wallet bug lane. Every id in the **3154 / 3164 /
3166** range now 404s in BOTH files. That is not deletion — those frames were re-exported
under new ids in the **13008** range, and the new ids are already committed here in
`wallet.titles.tsv`.

Five reports were parked on "the node 404s, so there is no spec to measure against".
That blocker is false. Grep the frame NAME in the TSVs before concluding a spec is gone:

| Surface | Dead id (as cited in reports/code) | Live id (`mhF3BkzlTaGiLzJ7kvpmVc`) |
|---|---|---|
| Notifications panel | `3164:22302` | `13008:27989` (tablet `13008:42806`) |
| Notification settings | `3164:22925` | `13008:28216` |
| Account dropdown | `3166:25085`, `7911:41913` | `13008:27689` (streak card = `dropdown-3` `13008:27757`) |
| Streaks | — | `13008:28453` |
| Quick actions, edit state | `7492:150434` | `13008:27159` |
| Progress / stepper | `3154:4650` | not located; no candidate found |
| Wallet-accounts sidecar | — | `3080:811` (never moved, still live) |

## Two frames that are in mhF3 despite looking like `3sSz` nodes

The rule above ("Home / Wallet / Trade moved, everything else stayed") is right, but it is
applied by *page*, and some frames that read as Portfolio or Home content moved with the
Wallet pages. Both of these were recorded as deleted by earlier passes because only the
file named in the report's link was tried:

| Node | What it is | Report link says | Actually in |
|---|---|---|---|
| `2752:5211` | Create non-custodial wallet card | `3sSz` | `mhF3` |
| `2760:12291` | Tier medallion (Bronze) | `3sSz` | `mhF3` |
| `2899:15797` | Home > Portfolio > Vault (1440x900) | — | `mhF3` |

★ Retry an id against BOTH files before writing "deleted". A 404 in one file is not an
answer; it is half of one.

⚠️ And `2899:15849`, cited on report 50810f73 as "the Portfolio Vault tab", does not
resolve in either file. The page frame is `2899:15797`; the 15849 id is a child that no
longer exists. A child id going stale while its parent page survives is the normal
outcome of a re-export — prefer the page-level id from `*.titles.tsv`.
