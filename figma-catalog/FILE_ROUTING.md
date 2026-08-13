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

```
2001:2        Thumbnail          3422:20110    📍 Games master sheet
9220:26175    🌎 Cover Images    2003:674      ✅ Dice
9003:72411    ✅ Plinko          9003:85754    ✅ Crash
9003:102080   ✅ Mines           9003:112414   ✅ Blackjack
9003:122027   ✅ Coinflip        9003:133221   ✅ Scratchers
9061:15464    ✅ Chicken         9058:1819     ✅ Hi-Lo
9390:18294    ✅ Darts           9390:18295    ✅ Keno
9390:18297    ✅ Fortune Wheel   9737:13087    ✅ Video Poker
9390:18296    ✅ Bingo           9737:13085    🚧 Roulette
9390:18298    🚧 Rock Paper Scissors            9061:15449   🚧 Towers
9737:13088    🚧 Baccarat        9660:2        🚧 SKAI Cross
```

All 22 are accounted for in `pages.json`; Roulette and Baccarat are recorded in
`outOfScope` as empty pages rather than as coverage gaps.

Note `9163:4859` on the **Mines** page is titled `Skai > Play > Casino > Dice
(1440 x 900px)`, and `9003:117620` on the **Blackjack** page is `Cards ALT - Chicken`.
These are the duplicated-scaffolding artefacts CATALOG_DESIGN.md warns about: the page
emoji is ✅ but the frame was copied from another game and never renamed. Do not read a
game's name off a frame title without checking which page owns it.
