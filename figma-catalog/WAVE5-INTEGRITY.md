# Wave 5 — catalog integrity

The point of this file is to make "the wave worked" a checkable claim rather than
a feeling. **Four times now, a lane's finished work has applied to ZERO frames**
and read as though nobody had looked. The numbers below are the baseline; the
post-wave run has to move them in the expected direction or something silently
ate the work again.

## Baseline — 2026-08-27, immediately before wave 5

Taken from the committed state at `skai-ui@d3ca228`, after the three tooling
fixes and before any `status.wave5.*.tsv` existed.

| Measure | Baseline | Source |
|---|---:|---|
| Status rows loaded | 5,015 | `apply-status.mjs` |
| Frames updated | 1,622 | `apply-status.mjs` |
| — matched by node id | 1,034 | `apply-status.mjs` |
| — matched by family | 588 | `apply-status.mjs` |
| Unaddressable rows | 15 | `apply-status.mjs` |
| Rows in dead sections | 95 | `bp-report.mjs` |
| Id-keyed rows naming an unknown node | 83 | `apply-status.mjs` |
| **In-scope genuine frames `done`** | **227 / 1,910 (11.9%)** | `coverage.mjs` |
| Genuine frames with a row | 1,598 / 1,910 (83.7%) | `coverage.mjs` |
| Live-only drift | 312 | `coverage.mjs` |

Per-page `done` at baseline — the numbers each lane has to beat:

| Page | genuine | done | partial | not-started | blocked | live-only |
|---|---:|---:|---:|---:|---:|---:|
| Social | 402 | 8 | 225 | 7 | 23 | 132 |
| Trade 2 | 375 | 57 | 102 | 4 | 14 | 180 |
| Play | 269 | 34 | 137 | 72 | 22 | 0 |
| Predict | 254 | 7 | 162 | 0 | 56 | 0 |
| Wallet 2 | 159 | 111 | 47 | 0 | 0 | 0 |
| Home 2 | 138 | 3 | 59 | 7 | 5 | 0 (+64 unknown) |
| 21 game pages | ~300 | 7 | ~100 | ~13 | 14 | 0 |

Out of the roll-up and deliberately untouched: Governance (held by Casey),
Onboarding (standing exclusion), the three v1 pages, tombstones, wip.

## What the post-wave run must show

1. **`frames updated` and `matched by node id` must RISE** by roughly the number
   of id-keyed rows the lanes wrote. If a lane wrote 100 rows and this number
   does not move, that lane's work applied to nothing — the failure that has
   already happened four times.
2. **`unaddressable rows` must stay near 15.** Every wave-5 row is supposed to be
   keyed by node id (WAVE5-BRIEF §9). A jump here means lanes keyed by bare
   family name and their verdicts are not addressable.
3. **`done` will not simply rise.** Two of the corrections this cycle moved it
   DOWN (Home 2 65→3) and two moved it up (Wallet 2 89→111). A wave that only
   ever increases `done` is a wave that is not re-verifying anything.
4. **Live-only drift must FALL** by what `social-drift` (132) and `trade2-drift`
   (180) classify — that is 312 frames currently invisible to every report.

## Checks to run afterwards

```
cd modules/skai-ui
node figma-catalog/apply-status.mjs      # rows loaded / updated / unaddressable
node figma-catalog/coverage.mjs          # the headline and per-page table
node figma-catalog/bp-report.mjs         # dead sections, design vs code axes
```

★ And the standing rule that produced this file: **before believing a checker
that reports "nothing wrong", make it tell you how much it looked at.** Every
number above carries its denominator for exactly that reason.

## Parser audit — done 2026-08-27, while the wave was in flight

`parseRowKey` was probed adversarially with 22 keys. It is correct on all four
intended forms. Two latent weaknesses were found; **neither is currently biting,
and both are recorded rather than fixed because nineteen lanes may invoke these
tools at any moment and editing `bp.mjs` under them is the larger risk.**

### 1. A family name shaped like a node id is read as one — LATENT, not live

`parseRowKey("2026-08", "social", …)` returns `id 2026-08`, not
`fam social/2026-08`. Same for `"1-1"`, `"50-50"`. A row keyed with a
date-shaped or short numeric family name silently becomes an id-keyed row
pointing at a node that does not exist, and then applies to nothing.

**Tightening by length is NOT available**: `3-2` and `3-3` are real page ids in
this very file, so short ids are legitimate and a minimum-length rule would break
real rows.

Measured whether it is live: of **1,547** bare-id-shaped column-1 values across
every status file, **40** name a node the registry does not carry, and **0 of
those 40 have the misparse signature** (both components short). So the defect is
real in the parser and absent from the data.

★ The right fix is not in the parser, it is in the REPORT. `apply-status.mjs`
says *"83 id-keyed row(s) name a node no registry frame carries"* as a bare
COUNT. A count cannot be acted on, and it is exactly what would hide this
misparse if a lane ever wrote such a key. **Make that warning name the rows by
file and line**, the way the unaddressable-row warning already does. Then a
misparsed key shows up as something to fix rather than as a number that drifts
upward.

### 2. A bare family equal to a section name becomes a section rollup

`parseRowKey("legal", null, …)` returns a SECTION rollup for `legal`. Strictly
this should be unaddressable — it is a bare family with no section hint.

**Blast radius is small and contained by an existing decision**: section rollups
are recorded in `registry.rollups` and deliberately never applied to frame
statuses, so nothing inherits a verdict from this. The only cost is that a row
which ought to be REPORTED as unaddressable is quietly filed instead. Worth
tightening (require the `>` separator for the rollup form), not worth an
in-flight edit.

## Results

_(filled in after the wave)_
