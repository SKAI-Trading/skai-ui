# Bug-report figma_link resolution, 2026-09-21

Every distinct `figma_link` on an open bug report, resolved to the catalog page, the
scope ruling that governs it, and the frame that owns it. Produced by the figma-catalog
lane of the 2026-09-21 sweep so the surface lanes stop re-deriving it one report at a
time, and so a link that resolves to nothing is visible as a catalog gap rather than as
a reporter's mistake.

## What was measured

Source set: `bug_reports` with `status in ('backlog','triaged','needs_info','in_progress')`
and a non-empty `figma_link` — **114 reports, 112 distinct `(fileKey, node)` pairs**.
(Three links are cited twice: `3471-7254`, `4437-112714`, `9099-147294`.)

Resolution order, first hit wins:

1. the node is a top-level child in `live/<fileKey>__<pageId>.tsv`
2. `live/_resolved.json` — a nested id already probed and recorded
3. `bug-node-index.tsv` — layer D, the deep-link index
4. `bugref-aliases.tsv` — including ids certified `gone`

Anything still unresolved went to Figma directly: `loadAsync()` on every page, then
`figma.getNodeByIdAsync(id)` and a walk up `.parent` to the PAGE node, taking the last
node before it as the owning screen. One `use_figma` call per file.

## Result

| | count |
|---|---|
| resolved to an in-scope page | 110 |
| certified gone in Figma (re-checked today, still absent) | 2 |
| orphans — cite a node that exists nowhere | **0** |
| cite a superseded or placeholder frame | **0** |

No open report cites a retired page. The `v1-superseded` idea does not apply to any of
them: Home 1, Wallet 1, Trade 1 are `in-scope` under the 2026-09-09 ruling, and the 16
links that land there are the only design those surfaces have.

The two gone ids are `4341-23128` and `9899-106541`, both in Skai-Web-App. Re-probed
today, both still return null from `getNodeByIdAsync` after every page was loaded.
A missing spec citation is not evidence the app bug is unreal; neither row was closed
on this, and neither should be.

## What was wrong, and what this lane changed

**62 of the 112 resolved to nothing in the catalog on the first pass.** Not because the
nodes were dead — every one of the 62 exists, at depth 1 to 9 under a top-level frame
the catalog already holds, on a page already ruled in-scope. The gap was
`bug-node-index.tsv`, which was built on 2026-08-13 against the reports open that day
and never refreshed. Reports filed since cite nodes it never saw, and a node the index
does not carry reads to the lane working the report as "not in the catalog" — which is
how a live citation gets treated as a bad link and a reporter gets re-asked for a spec
that was always there.

The 62 rows were resolved live and appended to `bug-node-index.tsv` under a dated block.
Cross-checks run before writing, all 62 of 62: the owning frame appears in its
`live/` page file, it appears in `registry.json` under a section, and the page Figma
reported matches the page `live/` files it under. No row invents a frame.

One further row was half-written by an earlier pass — `8911-161038` carried a section
but no depth, page or owning screen. Resolved and completed: depth 1 under
`3558-39458`, `Skai > Predict > Rewards > drop downs 1VH (1440 x 900px)`, page Predict.

Effect on the measurement: `coverage.mjs` now classes 58 node ids as `bug-link`
(a known deep link, not drift) where it classed 48, and 532 status rows name no node id
where 545 did.

## Drift check against Figma

Step 0 of the harvest loop, run today on all three files: **51 pages of 51 hashed equal
to `live/`, 0 changed, 0 new.** The catalog and Figma agree exactly as of this check, so
no re-harvest was needed and the parity denominator is not short. `live/_pages.json`
records 6,052 top-level nodes across the 51 pages.

`registry.json`'s `pagesHarvested` still reads 2026-09-15. That field records the last
date the registry was rebuilt off a harvest, not the last time Figma was read; the
manifest is the one to believe. The README now says so.

## Numbers the status feed will publish

From `coverage.json` regenerated today: 3,825 in-scope genuine frames, 3,823 with a row,
**1,056 done (27.6%)**, **635 of those visually verified (16.6%)**, 69 claimed statuses
pulled down by a visual verdict. `emit-parity-json.mjs` will publish this with **no
denominator caveat**, which is correct: the caveat fires only when a page in the growth
table under "Figma-catalog measurement integrity" in `docs/product/V1_TODO.md` has grown
under the snapshot, and today's hash check proves none has.

★ Two numbers in that V1_TODO section are stale and this lane did not edit them, because
`docs/` is a separate submodule and this wave's lane boundaries stop at `figma-catalog`.
The growth table's four per-page counts are from 2026-09-09 and read 240 / 277 / 417 /
725 where Figma now holds 242 / 280 / 420 / 725. The emitter is unaffected — it only
looks for rows where "live now" exceeds "in the snapshot", and all four are still equal —
but a reader takes them as current. The `[PARTIAL]` line below the table is worse: it
still quotes the wave-50 figures, 3,824 in-scope / 749 done (19.6%) / 327 verified, and
the honest numbers are 3,825 / 1,056 (27.6%) / 635.

## Traps this run hit

**`registry.json` keys the primary file by bare node id.** `registry.fileKey` is
`3sSzw1KewMtUbeLAv7uW0r`, and its frames are keyed `3471-7251`; frames of the other two
files are keyed `<fileKey>:<node>`. Looking every frame up in the uniform
`<fileKey>:<node>` form reports the whole Skai-Web-App file as uncatalogued. On the first
pass here that produced 29 frames reading as missing, and all 29 were present. Check the
key convention before concluding a section is absent.

**A page name is not a page identity.** `2003:674`, `2998:19593` and `3:3` each exist in
both web-app files with different names and different scopes — on Skai-Web-App they are
tombstones whose bodies moved, on Skai-Web-App-2 they are the live Home 1 / Wallet 1 /
Trade 1. Resolve `(fileKey, pageId)`, never pageId alone.

**The QA-Sheet file key resolves, and is already handled.** `qCg6vd2Kd4KCgZgYzVsFWD`
(Skai-Web-App-2-QA-Sheet) is a copy of Skai-Web-App-2 that shares its node ids, and this
account cannot open it. `live/_pages.json` carries the alias; its one open citation,
`13008-126152`, resolves to Home 2 in `mhF3BkzlTaGiLzJ7kvpmVc` and is in scope. It adds
no frames to any denominator.

## Lookup table

`resolution` says how the link was resolved, not how good it is. `owningFrame` is the
top-level frame a surface lane should build or measure against; `frameStatus` is what
`registry.json` claims for that frame today, which a visual verdict may already have
pulled down. Files: `web1` = `3sSzw1KewMtUbeLAv7uW0r`, `web2` = `mhF3BkzlTaGiLzJ7kvpmVc`,
`games` = `M6r9FEn042UWTQD1zvy6GM`, `qa-sheet` = `qCg6vd2Kd4KCgZgYzVsFWD`.

| file | linkNode | resolution | owningFrame | page | scope | section | frameStatus |
|---|---|---|---|---|---|---|---|
| games | `9003:143366` | nested | `9003-142707` | ✅ Scratchers - Skai originals | in-scope | skratch | partial |
| games | `9190:15379` | top-level | `9190-15379` | ✅ Coinflip - Skai originals | in-scope | coinflip | done |
| games | `9733:5378` | layerD/child | `9691-12630` | ✅ Fortune Wheel - Skai originals | in-scope | fortune-wheel | partial |
| games | `9736:11636` | layerD/child | `9691-12630` | ✅ Fortune Wheel - Skai originals | in-scope | fortune-wheel | partial |
| games | `9907:1597` | layerD/child | `9907-1595` | ✅ Rock Paper Scissors - Skai originals | in-scope | rock-paper-scissors | partial |
| games | `9937:18892` | nested | `9907-1595` | ✅ Rock Paper Scissors - Skai originals | in-scope | rock-paper-scissors | partial |
| qa-sheet | `13008:126152` | top-level | `13008-126152` | ✅ Home 2 | in-scope | home-2 | partial |
| web1 | `10012:179584` | layerD/child | `10012-134986` | ✅ Play | in-scope | play | done |
| web1 | `10640:30558` | top-level | `10640-30558` | ✅ Predict | in-scope | predict | partial |
| web1 | `10640:75727` | top-level | `10640-75727` | ✅ Predict | in-scope | predict | not-started |
| web1 | `10640:76274` | top-level | `10640-76274` | ✅ Predict | in-scope | predict | not-started |
| web1 | `10657:234837` | layerD/child | `10657-234836` | ✅ Predict | in-scope | predict | partial |
| web1 | `11214:131480` | layerD/child | `11214-131460` | ✅ Play | in-scope | play | done |
| web1 | `3344:30618` | top-level | `3344-30618` | ✅ Predict | in-scope | predict | partial |
| web1 | `3358:34469` | layerD/child | `3358-34467` | ✅ Predict | in-scope | predict | partial |
| web1 | `3456:3144` | layerD/child | `3456-3142` | ✅ Predict | in-scope | predict | partial |
| web1 | `3471:7253` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `3471:7254` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `3471:7494` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `3471:7582` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `3529:4316` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `3550:4729` | layerD/child | `3550-4727` | ✅ Predict | in-scope | predict | partial |
| web1 | `3553:5222` | layerD/child | `3553-5220` | ✅ Predict | in-scope | predict | partial |
| web1 | `3620:47883` | layerD/child | `3620-47881` | ✅ Predict | in-scope | predict | partial |
| web1 | `3624:51449` | layerD/child | `3624-51447` | ✅ Predict | in-scope | predict | blocked-on-backend |
| web1 | `3624:51457` | layerD/child | `3624-51447` | ✅ Predict | in-scope | predict | blocked-on-backend |
| web1 | `3631:56376` | layerD/child | `3631-56374` | ✅ Predict | in-scope | predict | partial |
| web1 | `3640:58289` | layerD/child | `3640-58287` | ✅ Predict | in-scope | predict | partial |
| web1 | `4341:23128` | layerD/gone | `4341-23128` | (gone) | - | - | - |
| web1 | `4792:31247` | layerD/child | `4792-31202` | ✅ Play | in-scope | play | not-started |
| web1 | `4792:35540` | layerD/child | `4792-34490` | ✅ Play | in-scope | play | not-started |
| web1 | `4798:57448` | layerD/child | `4798-57445` | ✅ Play | in-scope | play | partial |
| web1 | `4841:72653` | layerD/child | `4841-72059` | ✅ Play | in-scope | play | partial |
| web1 | `4866:79147` | layerD/child | `4799-60925` | ✅ Play | in-scope | play | partial |
| web1 | `4998:155895` | layerD/child | `4998-155882` | ✅ Social | in-scope | social | partial |
| web1 | `5525:11326` | layerD/child | `5523-103993` | ✅ Governance and Utilities | in-scope | governance | partial |
| web1 | `5529:72567` | layerD/child | `5529-72564` | ✅ Governance and Utilities | in-scope | governance | partial |
| web1 | `5534:92871` | layerD/child | `5534-92868` | ✅ Governance and Utilities | in-scope | governance | done |
| web1 | `8610:162944` | layerD/child | `8583-127820` | ✅ Predict | in-scope | predict | partial |
| web1 | `8687:54506` | layerD/child | `8687-54504` | ✅ Predict | in-scope | predict | partial |
| web1 | `8827:137892` | layerD/child | `3350-32943` | ✅ Predict | in-scope | predict | partial |
| web1 | `8862:46507` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `8862:46780` | layerD/child | `3471-7251` | ✅ Predict | in-scope | predict | partial |
| web1 | `8909:136859` | layerD/child | `3538-22735` | ✅ Predict | in-scope | predict | partial |
| web1 | `8909:137293` | layerD/child | `3546-25568` | ✅ Predict | in-scope | predict | partial |
| web1 | `8909:139269` | layerD/screen | `8909-139269` | ✅ Predict | in-scope | predict | - |
| web1 | `8909:141201` | layerD/screen | `8909-141201` | ✅ Predict | in-scope | predict | - |
| web1 | `8911:161038` | layerD/child | `3558-39458` | ✅ Predict | in-scope | predict | partial |
| web1 | `8911:163463` | layerD/child | `8911-163462` | ✅ Predict | in-scope | predict | partial |
| web1 | `8911:163474` | layerD/child | `8911-163462` | ✅ Predict | in-scope | predict | partial |
| web1 | `8911:165814` | layerD/child | `8911-163462` | ✅ Predict | in-scope | predict | partial |
| web1 | `8937:48703` | layerD/child | `8937-48702` | ✅ Predict | in-scope | predict | partial |
| web1 | `8937:49089` | layerD/child | `8937-48702` | ✅ Predict | in-scope | predict | partial |
| web1 | `9099:147294` | layerD/child | `9099-146637` | ✅ Play | in-scope | play | done |
| web1 | `9112:13225` | layerD/child | `4711-28434` | ✅ Play | in-scope | play | done |
| web1 | `9112:13278` | layerD/child | `4711-28434` | ✅ Play | in-scope | play | done |
| web1 | `9112:13728` | top-level | `9112-13728` | ✅ Play | in-scope | play | frame-defect |
| web1 | `9170:112514` | layerD/child | `4841-72059` | ✅ Play | in-scope | play | partial |
| web1 | `9170:114086` | layerD/child | `9170-114084` | ✅ Play | in-scope | play | not-started |
| web1 | `9170:114095` | layerD/child | `9170-114084` | ✅ Play | in-scope | play | not-started |
| web1 | `9170:114145` | layerD/child | `9170-114084` | ✅ Play | in-scope | play | not-started |
| web1 | `9899:106541` | layerD/gone | `9899-106541` | (gone) | - | - | - |
| web2 | `13006:135613` | top-level | `13006-135613` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:136580` | nested | `13006-135613` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:146465` | nested | `13006-146233` | ✅ Trade 2 | in-scope | trade-2 | done |
| web2 | `13006:147876` | top-level | `13006-147876` | ✅ Trade 2 | in-scope | trade-2 | frame-defect |
| web2 | `13006:148300` | layerD/child | `13006-148299` | ✅ Trade 2 | in-scope | trade-2 | done |
| web2 | `13006:148858` | layerD/child | `13006-148857` | ✅ Trade 2 | in-scope | trade-2 | done |
| web2 | `13006:149615` | layerD/child | `13006-149613` | ✅ Trade 2 | in-scope | trade-2 | frame-defect |
| web2 | `13006:152696` | layerD/child | `13006-152694` | ✅ Trade 2 | in-scope | trade-2 | done |
| web2 | `13006:155544` | layerD/child | `13006-154151` | ✅ Trade 2 | in-scope | trade-2 | frame-defect |
| web2 | `13006:175024` | layerD/child | `13006-175023` | ✅ Trade 2 | in-scope | trade-2 | blocked-on-backend |
| web2 | `13006:176934` | layerD/child | `13006-176080` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:183682` | layerD/child | `13006-183651` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:207638` | top-level | `13006-207638` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:210579` | layerD/child | `13006-210576` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:212781` | top-level | `13006-212781` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:215131` | layerD/child | `13006-214989` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:216128` | nested | `13006-214989` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:224897` | top-level | `13006-224897` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:227835` | top-level | `13006-227835` | ✅ Trade 2 | in-scope | trade-2 | not-started |
| web2 | `13006:232250` | layerD/child | `13006-230793` | ✅ Trade 2 | in-scope | trade-2 | done |
| web2 | `13006:234845` | layerD/child | `13006-233358` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:246174` | layerD/child | `13006-246173` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:289838` | layerD/child | `13006-289837` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:291295` | layerD/child | `13006-291294` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13006:348660` | top-level | `13006-348660` | ✅ Trade 2 | in-scope | trade-2 | blocked-on-backend |
| web2 | `13006:355257` | layerD/child | `13006-355256` | ✅ Trade 2 | in-scope | trade-2 | partial |
| web2 | `13008:113592` | layerD/child | `13008-113591` | ✅ Home 2 | in-scope | home-2 | partial |
| web2 | `13008:28416` | layerD/child | `13008-28402` | ✅ Wallet 2 | in-scope | wallet-2 | partial |
| web2 | `13008:28468` | layerD/child | `13008-28453` | ✅ Wallet 2 | in-scope | wallet-2 | done |
| web2 | `13008:38730` | layerD/child | `13008-38622` | ✅ Wallet 2 | in-scope | wallet-2 | done |
| web2 | `13401:171587` | layerD/child | `13401-171586` | ✅ Home 2 | in-scope | home-2 | partial |
| web2 | `13421:173034` | layerD/child | `13421-173033` | ✅ Home 2 | in-scope | home-2 | partial |
| web2 | `13431:179337` | layerD/child | `13431-179336` | ✅ Home 2 | in-scope | home-2 | partial |
| web2 | `13436:181794` | layerD/child | `13436-180687` | ✅ Home 2 | in-scope | home-2 | blocked-on-backend |
| web2 | `3927:59259` | layerD/child | `3896-31118` | ✅ Trade 1 | in-scope | trade | done |
| web2 | `4201:130024` | layerD/child | `4201-128723` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `4437:112661` | layerD/child | `4437-112650` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `4437:112693` | layerD/child | `4437-112650` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `4437:112714` | layerD/child | `4437-112650` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `4459:127829` | layerD/child | `4459-127765` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `6702:25618` | top-level | `6702-25618` | ✅ Home 1 | in-scope | home | partial |
| web2 | `6736:39220` | layerD/child | `6736-39216` | ✅ Home 1 | in-scope | home | partial |
| web2 | `6910:59419` | layerD/child | `6910-59407` | ✅ Home 1 | in-scope | home | partial |
| web2 | `7712:38425` | top-level | `7712-38425` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `7717:14311` | nested | `7717-13587` | ✅ Wallet 1 | in-scope | wallet | partial |
| web2 | `7890:132958` | layerD/child | `4020-47586` | ✅ Trade 1 | in-scope | trade | done |
| web2 | `9042:164219` | nested | `9042-164168` | ✅ Trade 1 | in-scope | trade | done |
| web2 | `9069:261103` | nested | `9069-259546` | ✅ Trade 1 | in-scope | trade | partial |
| web2 | `9069:262546` | layerD/child | `9069-261150` | ✅ Trade 1 | in-scope | trade | done |
| web2 | `9081:267660` | layerD/child | `9081-267604` | ✅ Trade 1 | in-scope | trade | partial |
