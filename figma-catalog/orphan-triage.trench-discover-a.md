# Orphan triage — lane trench-discover-a

Wave 21 drift, `figma-todo.wave21.merged.tsv`, class REMOVED-WITH-WORK.
Files: `src/components/trench-redesign/discover/TokenCard.tsx`,
`BlacklistModal.tsx`, `AlertsModal.tsx`.

Assigned: **26 rows**. Triaged: **26**. No row was skipped.

Verdict: **26 LIVE, 0 ORPHANED, 0 MOVED.** Nothing here is a deletion candidate.
Every node id is still in the Figma file today, and every file still renders on a
route. No code was touched.

(Row `13006-194971` names `AdjustTrenchSettings.tsx` / `metricBands.ts` /
`trenchDisplayPrefs.ts` alongside `TokenCard.tsx`; it is counted here because
`TokenCard.tsx` is on it. 27 distinct node ids across the 26 rows — `13006-188668`
appears once but carries five implFiles.)

## The finding: these frames were never removed

The brief asked whether a board had been re-cut wholesale. It is worse and
simpler than that — **no frame in this lane was deleted at all.** The drift class
is an artefact of comparing two different populations.

`snapshot.wave21.trade2.json` records `liveChildCount: 417` and carries exactly
417 nodes. It enumerates only the **direct children of the page** — the top-level
`1VH (1440 x 900px)` boards. `figma-drift.mjs:153` then computes

    const removed = [...ids].filter((id) => !liveIds.has(id));

against that page-children list. The trade-2 registry holds rows at **every
depth**, so every catalogued descendant is reported removed by construction,
whatever Figma actually contains.

This is not confined to trade-2. All **33** harvested sections have
`nodes.length === liveChildCount`, so all 33 are page-children-only:

    towers keno coinflip dice darts chicken rock-paper-scissors fortune-wheel
    cover-images blackjack plinko crash skratch hilo price-grid mines baccarat
    roulette bingo slide governance home pwa home-2 onboarding master-sheet
    play predict social trade trade-2 wallet-2 wallet

And of the **97** REMOVED-WITH-WORK rows wave-wide, **0** are present in the
page-children harvest, **73** have `title: null`, and **77** carry the same
provenance note:

> `[wave-4 2026-08-13] Row present because the code cites this node.`
> `citedByFiles/implFiles are derived by grepping the tree for the node id, not transcribed.`

Those 77 rows were never harvested from Figma. They were synthesised by grepping
the repo for node ids in code comments, which is why they have no title — and a
null title cannot match anything, so figma-drift's same-title RETITLED matcher
could never rescue them. They land in the top, most-alarming class automatically.

`validate-snapshot.mjs` is working correctly and does not catch this. It proves
the child count is complete (417 = 417). It is a completeness proof for the wrong
population, so it is a green that cannot go red for this failure mode.

Corroboration that the instrument, not the file, is at fault: the four
non-wave-4 rows that record a *genuine* deletion say so from a direct node probe
— `dice 9100-5928` and `9175-9500` both note "getNodeByIdAsync returns NULL".
That is the right instrument, and it is the one used below.

## Evidence — Figma side

Direct `get_metadata` probes against file `mhF3BkzlTaGiLzJ7kvpmVc`
(`Skai-Web-App-2`), 2026-09-04. All 27 node ids resolve.

`13006:191789` "Skai > Trench > Blacklist 1VH" — 2,124 descendants:

| node | live as |
|---|---|
| 13006:194608 | frame `modal` |
| 13006:194611 | frame `controls` |
| 13006:194615 | vector `line` |
| 13006:194616 | frame `nav` |
| 13006:194629 | vector `line` |
| 13006:194631 | frame `Header` |
| 13006:194635 | frame `content` |
| 13006:194650 | frame `Frame 470` |

`13006:134301` "Skai > Trench 1VH" — 1,283 descendants:

| node | live as |
|---|---|
| 13006:134424 | frame `Frame 6` |
| 13006:134428 | frame `Frame 500` |
| 13006:134436 | frame `Frame 24` |
| 13006:134451 | frame `Frame 516` |
| 13006:134456 | frame `Frame 506` |
| 13006:134459 | frame `chain` |
| 13006:134461 | frame `Frame 501` |

`13006:185849` "Skai > Trench > Alerts - toggle off" — 2,097 descendants:

| node | live as |
|---|---|
| 13006:188668 | frame `modal` |
| 13006:188669 | ellipse `shine` |
| 13006:188671 | frame `controls` |
| 13006:188676 | frame `content` |
| 13006:188681 | frame `Frame 203` |

`13006:188690` "Skai > Trench > Alerts - toggle on" — 2,137 descendants:

| node | live as |
|---|---|
| 13006:191509 | frame `modal` |
| 13006:191528 | frame `Frame 504` |
| 13006:191552 | frame `Frame 34` |
| 13006:191558 | frame `Frame 561` |
| 13006:191570 | instance `CTA/button` |

`13006:194925` "Right menu - Metrics":

| node | live as |
|---|---|
| 13006:194971 | frame `Frame 342` — the "Customize table" section |

**`13006:134427` needed a second probe.** It does not appear in the `13006:134301`
subtree dump, which is where a numeric-adjacency guess puts it. Probed directly
it resolves: `<rounded-rectangle id="13006:134427" name="Rectangle 34624566"
width="78" height="78" />`. Alive, just not where the id ranges implied. Recording
this because the neighbour heuristic would have produced one confident false
orphan out of 27.

## Evidence — code side, part 1: the import search

All three files are imported by name, no aliasing involved:

    src/components/trench-redesign/discover/TrenchColumn.tsx:16   import { TokenCard } from "./TokenCard";
    src/components/trench-redesign/discover/DiscoverScreen.tsx:17 import { BlacklistModal } from "./BlacklistModal";
    src/components/trench-redesign/discover/MarketPulseBoard.tsx:27 import { AlertsModal } from "./AlertsModal";
    src/components/trench-redesign/trade/TradeHeader.tsx:18      import { BlacklistModal } from "../discover/BlacklistModal";

## Evidence — code side, part 2: the reachability trace

Both chains end at a mounted route, so neither is import-from-another-orphan.

    /trench  (src/App.tsx:1891)
      -> isFeatureEnabled("REDESIGN_TRENCH") ? <TrenchRedesign/> : <Trench/>
      -> TrenchRedesign            src/pages/trade/TrenchRedesign.tsx:4
      -> DiscoverScreen            -> BlacklistModal        (:17)
                                   -> AdjustTrenchSettings  (:15)
                                   -> MarketPulseBoard      (:25)
      -> MarketPulseBoard          -> AlertsModal           (:27)
                                   -> TrenchColumn          (:26)
      -> TrenchColumn              -> TokenCard             (:16)

    /crypto/:symbol  (src/App.tsx:1831)
      -> TradeRouteBranch -> TrenchTradeTerminal -> TradeTerminal:6
      -> TradeHeader:18 -> BlacklistModal

`REDESIGN_TRENCH` defaults **on** — `src/config/features.ts:74` reads
`import.meta.env.VITE_REDESIGN_TRENCH !== "false"`. That is the build-time
default only; per CLAUDE.md the `feature_flags` row is the runtime override and
wins. I did not query the table. It does not change the verdict either way:
`BlacklistModal` is independently reachable through `/crypto/:symbol`, which is
not behind that flag.

## Instrument note worth carrying

Two greps in this lane returned a clean, wrong answer:

1. **Node ids are cited in colon form.** Grepping `13006-134427` across `src/`
   found 6 of 27 ids. Grepping `13006[:-]134427` found **27 of 27** — the code
   comments use `13006:NNNNNN`. The dash-only sweep would have reported 21
   components as having lost their citation.
2. **`get_metadata` output is saved as escaped JSON.** Matching `id="13006:194608"`
   scored 0 across all eight Blacklist nodes, because the file holds
   `id=\"13006:194608\"`. The first pass read as eight confirmed deletions.

Both failed in the reassuring direction — toward "the frame is gone, the code is
dead". Anchor on the bare id, never on the surrounding punctuation.

## Recommendation

Leave all 26 rows alone pending a decision on the harvester. Retiring them would
discard the implFiles record for 27 frames that are still in Figma and still on
screen. The fix is upstream: harvest descendants, or scope the drift diff to the
depth the snapshot actually covers. Under the current harvest, the correct
reading of REMOVED-WITH-WORK is "not enumerated", not "removed".

No code was deleted, weakened, or edited by this lane. `registry.json` and the
status TSVs are untouched.
