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

## ★★★ THE FIFTH MEASUREMENT ARTIFACT — `liveOnly` is a KEYING metric, not a coverage metric

Found 2026-08-27 by `social-drift` and `trade2-drift` independently, then
verified here. **It corrects a number already published to `V1_TODO.md`.**

`coverage.mjs` computes `liveOnly` as "live genuine frames that no status row
names **by node id in column 1**". That has been read, reported and scheduled as
*"frames the catalog has never assessed"*. It is not the same thing. A row that
assessed a frame but keyed it by TITLE, with the node id in the reason column,
counts as `liveOnly` — the verdict exists and is invisible to the metric.

Verified against every non-wave-5 status file, using the STRICT rule (id in
column 1, or id opening the reason) rather than a substring search:

| Page | `liveOnly` | carries a real verdict | prose mention only | no mention at all |
|---|---:|---:|---:|---:|
| Social | 132 | **132** (52 partial · 53 not-started · 27 blocked) | 0 | **0** |
| Trade 2 | 180 | **71** (59 partial · 10 not-started · 2 blocked) | 103 | **6** |

**Social is a pure keying artifact — all 132 already assessed, nothing unbuilt.**
Trade 2 is genuinely mixed: 71 recoverable, 103 uncertain, 6 truly absent.

★ **Note the two lanes disagreed with each other and both overstated.**
`trade2-drift` reported "only 2 of 180 ids are cited in code … the gap is mostly
a keying problem", which is true of 71, not 178. Accepting either lane's summary
without re-deriving it would have replaced one wrong number with another.

★ **And I walked into the trap the first lane had just warned me about.** My
initial probe substring-matched whole lines and returned a tidy 132 / 178 —
`social-drift` had reported in the same breath that a naive substring match gave
**41 false positives on a single id**, because `status.wave4.row-conflicts.tsv`
quotes an id inside a paragraph *explaining the id convention*. A documentation
example indexed as a verdict. The strict rule cut Trade 2 from 178 to 71.
**Being told about a trap in the same message is not protection from it.**

### Consequences

1. **`V1_TODO.md` says "the remaining 180 are live-only drift — the actual open
   work on that page". That is wrong** and must be corrected to 6 absent + 103
   to re-test + 71 already assessed. Do not schedule 312 frames of work.
2. `coverage.mjs` should report `liveOnly` split three ways, not as one number.
   The honest name for the current metric is `unkeyed`, not `liveOnly`.
3. The recovery is a **re-keying pass**, not a build wave — move the node id into
   column 1 on rows that already carry it in prose. Cheap, and it converts ~203
   invisible verdicts into visible ones.

## Other corrections from landed lanes

- ⚠️ **The brief's "+160w / +109h screenshot bleed" constant is FALSE** and has
  been corrected in `WAVE5-BRIEF.md` §2. Measured: a 1440x900 frame bled zero, a
  400x470 frame bled +160/+160. It tracks overlapping canvas neighbours
  (`contentsOnly: false`), so it is worst on small frames — the class most
  components are. Any lane that subtracted a fixed number has corrupted small
  measurements; check for it when validating rows.
- ⚠️ **The `live/*.tsv` harvest truncates every name at exactly 20 characters.**
  A lane classifying off that file alone is guessing at identity. Full names must
  come from Figma directly or from the `*.titles.tsv` files.
- ⚠️ **My brief contradicted itself**: §9 forbids editing `coverage.json` while
  the drift lanes were told to run `coverage.mjs`, which rewrites it. Both drift
  lanes noticed and correctly READ the existing file instead of regenerating it
  under 19 concurrent lanes. Fixed below.
- "Trade 2 has no Spot frames" is slightly wrong — two `Spot > Sidebar` frames
  exist (768 and 375). The claim holds for Spot *board* frames and for Perps.

## Results — 2026-08-27, wave closed

9 of 20 lanes delivered before the wave was wrapped; 12 were stopped in flight.
506 rows written across 9 TSVs.

| Measure | Baseline | After | Δ |
|---|---:|---:|---:|
| Status rows loaded | 5,015 | 5,521 | **+506** |
| Frames updated | 1,622 | 1,630 | +8 |
| — matched by node id | 1,034 | 1,137 | **+103** |
| Unaddressable rows | 15 | 15 | **0** |
| Genuine frames with a row | 1,598 (83.7%) | **1,910 (100.0%)** | +312 |
| Live-only drift | 312 | **0** | **−312** |
| In-scope `done` | 227 (11.9%) | 230 (12.0%) | +3 |

### Against the four criteria set before launch

1. ✅ **`matched by node id` rose with the rows written** (+103). No lane's work
   applied to nothing — the failure that had happened four times did not happen a
   fifth.
2. ✅ **Unaddressable rows stayed at 15.** Every wave-5 row keyed by node id, as
   the brief required. Zero regression in keying hygiene.
3. ✅ **`done` did not simply rise** — +3 only, and that is the honest number
   (see below). Lanes demoted as well as promoted: Predict Futures found all 16
   of its `done` rows were citation-only, re-earned 4 and demoted 12.
4. ✅ **Live-only drift fell to ZERO.** Every genuine frame in scope now has a
   row. This is the wave's largest single result.

### ★ Why `done` moved only +3, and why that is the correct outcome

**The rig could not support the bar.** `done` requires measurement against a
rendered DOM, and the fleet could not render anything:

- `optimizeDeps.force: true` makes concurrent dev servers destroy each other's
  shared bundle. **All 25 servers probed DEAD.**
- The chrome-devtools MCP is a **single shared browser profile** — a second lane
  is refused outright.

So lanes correctly produced frame-side measurements and refused to call them
`done`. Three separate lanes said so explicitly and filed zero `done` rows rather
than promote a citation. **That is the discipline working**: a wave that reported
+80 `done` under these conditions would have been lying.

The refusal machinery also worked: `apply-status.mjs` REFUSED to write
`registry.json` over 6 malformed breakpoint cells (a lane wrote `blocked`, which
is a valid row status but not a valid bp verdict) rather than silently
downgrading them. Corrected to `not-started` and re-applied.

### Known-good failure carried forward

`src/components/social/feed/postImageUpload.test.ts` fails — **pre-existing, not
wave-5**. Commit `4ec3ddcc7` refactored `get-asset-upload-url` from a single
`ALLOWED_CONTENT_TYPES` to per-category `CATEGORY_CONTENT_TYPES` and left this
mirror test grepping the old name. The test exists to catch client/edge allowlist
drift and currently cannot, so that drift is unverified. 660 tests, 659 pass.
