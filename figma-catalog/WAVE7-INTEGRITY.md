# Wave 7 — catalog integrity

Written by the `w7-verify` lane. Its job is to stop the wave lying and to compute
the percentage Casey asked for, with the uncertainty stated rather than hidden.

Every number below carries its denominator. That is not a stylistic habit — it is
the rule that produced this file, because the dominant failure mode in this
catalog is not a checker that says "wrong", it is a checker that says "fine"
about a population nobody sized.

---

## 1. The wave-7 start state, MEASURED

Taken with **zero `status.wave7.*.tsv` on disk** except this lane's own four
disclosed rows (§5), so it is a true baseline and not a partial result.

```
node figma-catalog/apply-status.mjs --dry-run   # counts, writes nothing
node figma-catalog/coverage.mjs --histogram     # rollup as JSON, writes nothing
node figma-catalog/bp-report.mjs                # dead sections, design vs code
```

| Measure | Value | Source |
|---|---:|---|
| Status rows loaded | 5,579 | `apply-status.mjs` |
| Frames updated | 1,630 | `apply-status.mjs` |
| — matched by node id | 1,137 | `apply-status.mjs` |
| — matched by family | 493 | `apply-status.mjs` |
| Unaddressable rows | 15 | `apply-status.mjs` |
| Id-keyed rows naming an unknown node | 88 | `apply-status.mjs` |
| Rows in dead sections | 101 | `bp-report.mjs` |
| **In-scope genuine frames** | **1,914** | `coverage.mjs` |
| Live-only drift | 0 (was 4) | `coverage.mjs` |

In-scope histogram, over **1,914** genuine frames:

| Status | N | % of genuine |
|---|---:|---:|
| `done` | 228 | 11.91% |
| `partial` | 883 | 46.13% |
| `not-started` | 196 | 10.24% |
| `blocked-on-backend` | 126 | 6.58% |
| `frame-defect` | 51 | 2.66% |
| `furniture` (catalog says furniture, the script says genuine) | 60 | 3.13% |
| `unknown` | 370 | 19.33% |

### ⚠️ The brief's stated start state was stale. It said 1,910.

`WAVE7-BRIEF.md` was written from `coverage.json` generated `2026-08-31T17:57Z`,
which predates two commits. Both differences are recorded here so that neither is
ever misattributed to a wave-7 lane:

| | brief said | actual | why |
|---|---:|---:|---|
| genuine | 1,910 | **1,914** | 4 nodes recovered by the `9cd5648` re-harvest |
| `not-started` | 202 | **196** | `086d11c` reclassified 6 Social frames |
| `blocked-on-backend` | 122 | **126** | same commit (+4) |
| `frame-defect` | 49 | **51** | same commit (+2) |
| live-only drift | 0 | 4 → **0** | the 4 recovered nodes, now given rows (§5) |

`done`, `partial`, `unknown` and `furniture` were unchanged. The coordinator has
since corrected `WAVE7-BRIEF.md` and `docs/product/V1_TODO.md` to 1,914.

---

## 2. THE PERCENTAGE, STATED HONESTLY

Two numbers, and they are not the same thing.

> ### At measured parity — `done` / genuine
> ## 228 / 1,914 = **11.91%**
>
> ### Built at all — (`done` + `partial`) / genuine
> ## 1,111 / 1,914 = **58.05%**

### The uncertainty band, which is the part that must not be dropped

`unknown` means **nobody looked**. It is neither built nor unbuilt, so it cannot
be assigned to either side, and 370 frames — **19.33%** — are in it.

That makes 58.05% a **FLOOR**, not a figure. The ceiling is what the number would
be if every `unknown` turned out to be built:

| Bound | Formula | Value |
|---|---|---:|
| **Floor** | (done + partial) / genuine | **58.05%** |
| **Ceiling** | (done + partial + unknown) / genuine | **77.38%** |

> **The truth is somewhere between 58.05% and 77.38%, and nothing in the catalog
> currently narrows it further.** Quoting either end alone is a misrepresentation:
> the floor understates by treating 370 unexamined frames as unbuilt, and the
> ceiling overstates by treating all 370 as built.

★ This is why WAVE7-BRIEF §5 says every `unknown` you convert makes the number
more honest **whichever way it goes**. Resolving one down to `not-started` narrows
the band from the top and is worth exactly as much as closing one to `done`. A
wave that only ever moved `done` upward would be a wave that re-verified nothing.

### And measured parity is the number with teeth

11.91% is the only figure that means *checked against Figma node data with the
numbers written down*. 58.05% includes `partial`, which means "implemented,
measured work remaining" — real, but not parity. Do not let the larger number
stand in for the smaller one.

---

## 3. Per-surface

Sorted by size. `built%` = (done+partial)/genuine — the floor. `ceiling%` adds
`unknown`. Where the two are equal the surface has no unknowns left and its
number is settled.

| Page | genuine | done | partial | not-started | blocked | frame-defect | furniture | unknown | built% | ceiling% |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Social | 402 | 8 | 225 | 46 | 62 | 11 | 1 | 49 | 58.0 | 70.1 |
| Trade 2 | 375 | 54 | 102 | 42 | 16 | 1 | 18 | 142 | 41.6 | 79.5 |
| Play | 269 | 34 | 137 | 72 | 22 | 1 | 3 | 0 | 63.6 | 63.6 |
| Predict | 254 | 11 | 165 | 12 | 7 | 15 | 0 | 44 | 69.3 | 86.6 |
| Wallet 2 | 159 | 111 | 47 | 0 | 0 | 1 | 0 | 0 | **99.4** | 99.4 |
| Home 2 | 138 | 3 | 105 | 11 | 5 | 1 | 0 | 13 | 78.3 | 87.7 |
| Coinflip | 34 | 0 | 26 | 1 | 0 | 0 | 7 | 0 | 76.5 | 76.5 |
| Dice | 23 | 0 | 3 | 1 | 0 | 0 | 0 | 19 | 13.0 | 95.7 |
| Darts | 18 | 0 | 7 | 0 | 0 | 1 | 3 | 7 | 38.9 | 77.8 |
| Keno | 18 | 0 | 11 | 5 | 0 | 0 | 2 | 0 | 61.1 | 61.1 |
| Chicken | 17 | 0 | 2 | 0 | 0 | 0 | 1 | 14 | 11.8 | 94.1 |
| Rock Paper Scissors | 17 | 0 | 2 | 0 | 14 | 0 | 1 | 0 | 11.8 | 11.8 |
| Blackjack | 16 | 7 | 0 | 0 | 0 | 0 | 3 | 6 | 43.8 | 81.3 |
| Fortune Wheel | 16 | 0 | 2 | 0 | 0 | 0 | 5 | 9 | 12.5 | 68.8 |
| Towers | 16 | 0 | 2 | 0 | 0 | 0 | 1 | 13 | 12.5 | 93.8 |
| Scratchers | 14 | 0 | 4 | 1 | 0 | 0 | 1 | 8 | 28.6 | 85.7 |
| Roulette | 14 | 0 | 3 | 1 | 0 | 8 | 2 | 0 | 21.4 | 21.4 |
| Crash | 13 | 0 | 4 | 0 | 0 | 0 | 0 | 9 | 30.8 | 100.0 |
| Bingo | 13 | 0 | 5 | 0 | 0 | 6 | 2 | 0 | 38.5 | 38.5 |
| Baccarat | 13 | 0 | 6 | 4 | 0 | 0 | 3 | 0 | 46.2 | 46.2 |
| Slide | 13 | 0 | 2 | 0 | 0 | 0 | 1 | 10 | 15.4 | 92.3 |
| Mines | 12 | 0 | 4 | 0 | 0 | 0 | 1 | 7 | 33.3 | 91.7 |
| Plinko | 10 | 0 | 4 | 0 | 0 | 0 | 1 | 5 | 40.0 | 90.0 |
| Video Poker | 10 | 0 | 3 | 0 | 0 | 6 | 1 | 0 | 30.0 | 30.0 |
| Limbo | 9 | 0 | 2 | 0 | 0 | 0 | 0 | 7 | 22.2 | 100.0 |
| Price Grid | 8 | 0 | 3 | 0 | 0 | 0 | 3 | 2 | 37.5 | 62.5 |
| Hi-Lo | 7 | 0 | 7 | 0 | 0 | 0 | 0 | 0 | 100.0 | 100.0 |
| Privacy and Terms | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 6 | 0.0 | 100.0 |
| **TOTAL** | **1,914** | **228** | **883** | 196 | 126 | 51 | 60 | 370 | **58.05** | **77.38** |

Reading notes, because a per-surface table invites the wrong conclusion:

- **`done` is concentrated almost entirely in Wallet 2 (111) and Trade 2 (54).**
  Those two carry 165 of 228 — 72% of all measured parity in the catalog. Twenty
  of the twenty-eight pages have **zero** `done`.
- **Trade 2's 41.6% floor is the least trustworthy number on the page.** 142 of
  its 375 frames are `unknown` — its band is 41.6–79.5%, the widest anywhere.
- **Crash and Limbo read 100% at the ceiling only because almost everything on
  them is `unknown`** (9 of 13, 7 of 9). A high ceiling on a small page is a
  measure of ignorance, not progress.
- **Rock Paper Scissors and Roulette have settled bands and low numbers** —
  11.8% and 21.4% with no unknowns. Those are real, and they are honest.
- Governance, Onboarding, the three v1 pages, tombstones and wip are out of the
  roll-up by standing decision.

---

## 4. What went wrong before the wave started

### 4.1 ★ `coverage.mjs` could not run AT ALL. Nobody could compute a percentage.

**Found and fixed today.** From commit `9cd5648` until this fix, `coverage.mjs`
exited 1 on every invocation, for every page and every lane.

Commit `9cd5648` re-harvested the blackjack and bingo pages for full titles and
picked up **4 top-level nodes the original wave-4 harvest had missed** — but did
not update `live/_pages.json`, whose `n` still read 20 and 16. The guard refused
on *any* harvest/manifest inequality.

**Verified against live Figma before relaxing anything, by ID SET and not by
count** (WAVE5-BRIEF §2: equal counts hide an equal-sized swap): the blackjack
page really has 23 direct children and bingo really has 17, matching the harvest
exactly, zero ids on either side.

The fix was to split the guard **by direction**, which the file's own header note
3 had already argued for without applying it:

- `harvest < manifest` — the harvest is SHORT. It shrinks the denominator and
  **raises** the percentage. Flattering, and nobody reviews the flattering
  direction. **Stays a hard refusal.**
- `harvest > manifest` — the manifest is stale behind a re-harvest. Proceeding on
  the harvest **enlarges** the denominator and **lowers** the percentage. It
  cannot flatter, so it is reported as `staleManifest` and the run continues.

★ **The original wave-4 harvest was short on two pages, and had therefore been
inflating their completion percentage since `87a9889`.** The guard was right; it
had simply never fired because nothing re-measured those pages until now.

The coordinator has since reconciled `_pages.json` (`0397fed`), and
`staleManifest` is now empty.

### 4.2 ★ Two artifacts derive from that harvest, not one

`registry.json` is **also** derived from the harvest and was **also** not rebuilt.
All four recovered ids are absent from it (3,772 frames, generated `18:23Z`).

Consequence, and it is asymmetric:

- `coverage.mjs` reads `live/*.tsv` → it counts the four. Drift is genuinely 0.
- `apply-status.mjs` reads `registry.json` → it does not. Its "id-keyed rows
  naming a node no registry frame carries" goes **88 → 92**.

The coordinator has **deliberately deferred** the `build-registry.mjs` run to
wave close: 19 lanes read `registry.json` live, and a rebuild under them risks
handing one a half-written file, which costs a whole lane's run. A cosmetic
warning count is the cheaper side of that trade.

> **Close-out check, agreed with the coordinator.** After the rebuild,
> `apply-status.mjs` must show `frames updated` matched-by-node-id rising and the
> unmatched-id count falling **92 → 88**. If it does not, the rebuild did not pick
> up the re-harvest and the number must not be reported to Casey.

★ The durable lesson, which is the general form of both 4.1 and 4.2:
**after refreshing an input, enumerate everything downstream of it — do not stop
at the one thing that broke.** `_pages.json` broke loudly and got fixed;
`registry.json` broke quietly and was found only because a validator complained
about four rows.

### 4.3 Rows applying to nothing — the failure that has now happened five times

`apply-status.mjs` reported this as a **bare count**, which
`WAVE5-INTEGRITY.md` had already flagged as unactionable: *"a count cannot be
acted on, and it is exactly what would hide this misparse if a lane ever wrote
such a key."* It now names the rows **by file and line, grouped by file**, so a
whole lane's work applying to zero frames shows as a block rather than as a
number that drifts upward. At baseline, 88 rows across 10 files, worst offenders
`status.wave4.home-2-reverify.tsv` (34) and `status.wave3.verify-games.tsv` (24).

A second detector was added for a failure nobody had been reporting at all:
**two rows claiming the same node id.** Files are processed in stem order and the
later silently replaces the earlier. Across the whole catalog that is **1,551**
collisions, of which **759 DISAGREE on status** — two rows measured the same
frame, reached different conclusions, and *filename order, not evidence*, decided
which one the registry records. The other 792 agree and are harmless
supersessions. (`coverage.mjs` separately reports 56 in-scope conflicts; it
resolves them to the worst verdict, which is a different and safer rule than
`apply-status.mjs`'s last-writer-wins. **The two tools disagree about how a
conflict resolves.** Recorded, not fixed — changing either under 19 live lanes is
the larger risk.)

### 4.4 The atomic column-6 refusal — pre-empted

One bad cell in one lane's file stops `registry.json` being written for **every**
lane. Wave 5 lost a run to `blocked`; wave 6 lost one to
`not-measured` / `not-built`.

`validate-wave7.mjs` now checks every `status.wave7.*.tsv` using **bp.mjs's own**
`parseBpCell` / `normaliseStatus` / `parseRowKey` — deliberately not a second copy
of the vocabulary, because `bp-report.mjs` once kept its own copy and that copy
silently discarded 154 of 2,140 rows including every `blocked-on-backend`
verdict. A validator with a second opinion about what is legal is worse than none.

It also flags rows that would apply to zero frames, duplicate id claims, and any
`done` whose reason column carries **no digits**.

**It is proven non-vacuous.** `--self-test` feeds it the eight rows that actually
broke waves 5 and 6 and asserts each is caught, plus a control asserting a
well-formed row produces no complaint:

```
CAUGHT  wave-5 killer: `blocked` in column 6
CAUGHT  wave-6 killer: `not-measured` in column 6
CAUGHT  wave-6 killer: `not-built` in column 6
CAUGHT  column-6 word in column 2 (`renders`)
CAUGHT  a `done` with no numbers in its reason
CAUGHT  id-keyed row naming a node no frame carries
CAUGHT  bare family name with no resolvable section
CAUGHT  a TAB inside the reason prose
CLEAN   control: a well-formed row produces no complaint
self-test: 8/8 known-bad rows caught, control clean.
```

★ **The self-test found a real hole in the validator on its first run.** Wave 5's
actual killer word was `blocked`, which is **not** a column-2 status — it is how
a lane shortened `blocked-on-backend`. An exact-match hint stayed silent on the
one word that has actually taken a wave down. The hint now matches prefixes.

★ **And the validator caught its own author.** Its first real use was on this
lane's own four rows, and it correctly reported all four applying to zero frames
(§4.2). That is the best evidence it works. It therefore exits **non-zero** on
"applies to zero frames", not just on parse errors — that failure has happened
five times and been read past every time, and a warning that exits 0 is a warning
nobody acts on.

### 4.5 Measuring must never be what breaks the wave

Both measurement tools now have **non-writing** modes, added because
`WAVE5-BRIEF` §9 forbids regenerating `coverage.json` mid-wave while the
integrity lane still has to read the histogram — a contradiction both wave-5
drift lanes hit and worked around by reading a stale file.

- `apply-status.mjs --dry-run` — every count, no `registry.json` write.
- `coverage.mjs --histogram` — full rollup and per-page table as JSON on stdout,
  no `COVERAGE.md` / `coverage.json` write.

---

## 5. ⚠️ DISCLOSURE — this lane wrote four status rows

The integrity lane is normally barred from writing status rows, so that it never
grades its own production. It wrote `status.wave7.verify-orphans.tsv` — four rows
— at the coordinator's explicit request, and the exception is disclosed here and
in that file's header.

**It is safe because these four cannot move any number this lane then reports.**
Verified by running the rollup before and after:

```
matched          1910 -> 1914
catalogFurniture   56 -> 60
liveOnly            4 -> 0
genuine, done, partial   UNCHANGED
```

A column-2 `furniture` row stays inside `genuine` — `coverage.mjs`'s own
type/name furniture rule is what shrinks the denominator, not the catalog status
— so both the floor and the ceiling are bit-for-bit unchanged. The only number
that moved is live-only drift, back to 0.

All four are the nodes recovered by the `9cd5648` re-harvest, measured from live
Figma node data at depth 1:

| node | name | size | children | x |
|---|---|---|---:|---:|
| `10358-10260` | Blackjack Desktop | 195x277 | **0** | −2846 |
| `10404-2119` | Blackjack Desktop | 1390x1968 | **0** | −7388 |
| `10404-2125` | Frame 1000004104 | 1080x1800 | 3 (card artwork) | −5698 |
| `10428-2140` | Frame 1000004220 | 1080x1800 | 3 (incl. a layer named `efwefec 1`) | −5705 |

Two are literally empty frames. All four are parked off-canvas at large negative
x, none is a board width (1440 / 768 / 375), and 1080x1800 is a 3:5 poster
aspect. That is artwork, not spec — `furniture`.

---

## 6. ★★★ A PASSING `*.figma.test.tsx` IS NOT EVIDENCE OF MEASURED PARITY

This is the finding most likely to produce false `done` rows in wave 7, so it is
stated with its denominator.

**33 `*.figma.test.tsx` files exist under `src/`.** Audited by
`audit-oracle-tests.mjs`:

| Property | count | of 33 |
|---|---:|---:|
| render the component | 33 | 100% |
| cite a Figma node id | 33 | 100% |
| resolve actuals through the **shipping Tailwind config** | **7** | **21%** |
| define a transcribed Figma fixture (literals + node id) | **3** | **9%** |
| assert **no geometry at all** — no numeric expectation, no fixture | **16** | **48%** |

Across all 33: **466 `it()` blocks, 83 bare numeric expectations.**

WAVE6-BRIEF §2 defines the sound shape: *"every expectation is a Figma pixel …
every actual is resolved through the shipping Tailwind config … nothing re-reads
the component's own strings."* **Only 7 of 33 meet the middle clause.**

Sixteen files cite Figma node ids in comments and then assert labels, roles and
attributes. Spot-checked rather than trusted to a regex —
`CreatorProfileShell.figma.test.tsx` cites **24** node ids across 15 `it()` blocks
and its matchers are 36 `toBeTruthy`, 8 `toBeNull`, 8 `toBe` on strings, 1
`toEqual`. Zero geometry.

> ★ **That is a citation, not a measurement — the exact thing Casey's 2026-08-26
> `done` ruling was written against, reproduced one layer down inside the tests
> that were supposed to enforce it.** The previous wave demoted ~600 catalog rows
> for being citations; the test layer has been quietly re-accumulating the same
> debt.

**Those tests are not worthless** — `CreatorProfileShell` guards the no-mock-data
rule properly (`toBe("—")`, `not.toBe("0")`, `data-offline-source`), which is
valuable. They are simply **not parity oracles** and cannot support a `done`.

### The rule for wave 7

> **"There is a passing `*.figma.test.tsx`" does not justify `done`.** The row
> needs the measured Figma numbers in its reason column, and the test needs to
> assert those numbers against an actual resolved independently of the component.
> On today's evidence 16 of 33 existing tests would license a `done` they cannot
> support.

### Two traps found while building the auditor

1. **The first version of the detector over-flagged, 28 of 33.** It treated *any*
   import of the component's own constants as vacuity. That is wrong:
   `SocialTridotsMenu.figma.test.tsx` does
   `expect(ACCOUNT_TRIDOTS_WIDTH_PX).toBe(FIGMA_ACCOUNT_TRIDOTS.widthPx)`, where
   the component's constant is the **actual** and the expected is a literal
   transcribed into the test beside its node id (`11530:303299`, widthPx 160).
   That is exactly the right shape. The precise vacuity signature is the
   self-imported symbol appearing as the **expected** value, inside the matcher's
   argument — both sides from one module, a tautology.
   ★ **A checker that over-reports is not "safe". It buries the two real cases in
   twenty-six false ones and gets ignored.**
2. **A `.toBe(<number>)` count misses geometry held in a `const` fixture.** Three
   files assert real pixels through an object literal and score zero on a naive
   numeric-expectation count. The auditor detects the fixture separately.

`audit-oracle-tests.mjs` reports **signals, not verdicts**, and says so on every
run. The only conclusive proof a test is not vacuous is to mutate the component
value and watch it go red — confirming with `grep -F` that the mutation landed
before believing the result.

★ **Mutation testing was NOT performed in the shared tree, deliberately.** The
geometry these tests assert lives in shared constants (`RIGHT_MENU_SHEET_CLASS`
is used by six components across three feature areas), and mutating a shared
product file under 19 concurrent lanes is the documented "mutation echo" hazard —
a peer's reported live defect once turned out to be another lane's in-flight
mutation. A red run in someone else's lane would cost more than the proof is
worth. Mutation must be done in an isolated worktree, or on a sibling copy that
no lane owns.

---

## 7. What the post-wave run must show

1. **`matched by node id` must rise roughly in step with id-keyed rows written.**
   Baseline 1,137. If a lane wrote 100 id-keyed rows and this does not move, that
   lane's work applied to nothing — the failure that has happened five times.
   `apply-status.mjs` now names those rows by file and line.
2. **Unaddressable rows must stay at 15.** A jump means lanes keyed by bare family
   name and their verdicts are not addressable.
3. **`done` will not simply rise, and must not be expected to.** Wave 7 is the
   first wave since wave 5 that can produce `done` at all. If a lane demotes
   citation-only rows and `done` falls, **that is the system working** — report it
   as a correction, not a regression. Wave 5's Predict Futures lane found all 16
   of its `done` rows were citation-only, re-earned 4 and demoted 12. A wave whose
   `done` only ever increases is a wave that is re-verifying nothing.
4. **`unknown` must FALL.** It is 370, and it is the entire width of the
   uncertainty band. Every conversion narrows the band — `not-started` narrows it
   from the top, `done` and `partial` raise the floor. Both count.
5. **Live-only drift must stay 0.**
6. **The registry rebuild must move unmatched ids 92 → 88** (§4.2).

## 8. Commands

```
cd modules/skai-ui
node figma-catalog/validate-wave7.mjs              # lanes: run before finishing
node figma-catalog/validate-wave7.mjs --self-test  # prove it is not vacuous
node figma-catalog/audit-oracle-tests.mjs          # oracle-test vacuity signals
node figma-catalog/apply-status.mjs --dry-run      # counts, no registry write
node figma-catalog/coverage.mjs --histogram        # rollup JSON, no file write
node figma-catalog/bp-report.mjs                   # dead sections, design axes
```

★ The standing rule that produced this file: **before believing a checker that
reports "nothing wrong", make it tell you how much it looked at.** Every number
above carries its denominator for exactly that reason — including the ones that
are unflattering, and including the one place this lane's own checker was wrong.
