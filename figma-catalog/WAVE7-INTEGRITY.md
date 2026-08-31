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

---
---

# Part II — the `w7b-verify` lane

§1–§8 were written by `w7-verify` before a session limit ended it. Everything
below continues from that state rather than restarting, and every number was
re-measured live rather than inherited.

---

## 9. ★★★ THE ATOMIC REFUSAL FIRED — AND IT WAS A COLUMN-HEADER LINE

§4.4 pre-empted a bad **column-6** verdict. What actually took the wave down was
duller and was not on anyone's list.

**Five separate lanes opened their file with the bare column header**

```
key<TAB>status<TAB>primaryFile<TAB>route<TAB>reason<TAB>bp
```

`apply-status.mjs` skips only lines beginning with `#`. Everything else is parsed
as a data row, so it read the literal word `status` in column 2, found it was not
a row status, and refused. **This was live, not predicted:**

```
$ node figma-catalog/apply-status.mjs --dry-run
REFUSING TO WRITE registry.json — 1 malformed status row(s):
  status.wave7.furniture.tsv:11 [key]: unrecognised status "status"
REAL_EXIT=1
```

Caught by `validate-wave7.mjs` within minutes of the first TSVs landing, at a
point when the wave had produced **8 rows total**. All five were fixed inside a
few minutes of being told; the run was never actually lost.

### ★ Five lanes making one mistake is not five mistakes

It is a discoverability defect. The `#` convention is recorded only in comments
*inside other lanes' files*, so a lane starting a fresh TSV cannot see it. The
generic "not a row status" message was true and useless — it did not name the
one-character fix.

`validate-wave7.mjs` now detects this exact shape (column 1 `key`, column 2
`status`) and prints the remedy. **The new check was mutation-tested, not
assumed:**

| step | result |
|---|---|
| self-test with the new fixture | **9/9 caught**, control clean |
| mutate `=== "key"` → `=== "keyZZZ"`, confirmed landed with `grep -F` | **8/9 — the new fixture MISSED**, all others still caught |
| revert, `grep -F` confirms 1 occurrence restored | **9/9 caught**, control clean |

The mutation went red on exactly one fixture and nothing else, which is what
distinguishes a real oracle from a test that passes forever.

### ⚠️ And I nearly filed a false defect against the primary tool

My first reading of the refusal was `EXIT=0` — a refusal that exits zero would be
a serious finding. It was wrong. I had written
`node apply-status.mjs ... | head -30; echo $?`, which reports the **head's**
status, not the command's. Re-run without the pipe: `REAL_EXIT=1`. The tool is
correct.

★ This is `recurring-issues.md` §286–§287, cited in this repo's own CLAUDE.md,
walked into anyway — **by the lane whose job is catching exactly this.** Being
told about a trap is not protection from it (WAVE5-INTEGRITY made the same
observation about itself). Every exit code in this file was measured without a
pipe.

---

## 10. ★★★ THE REGISTRY DRIFT IS 52 FRAMES, NOT 4 — AND IT IS NOT DATA LOSS

§4.2 found `registry.json` stale by **4** recovered ids and set a close-out check:
*"unmatched ids must move 92 → 88."* **That check is withdrawn.** The coordinator
independently confirmed the finding and withdrew it.

### The measurement

`coverage.mjs` reads `live/*.tsv`. `build-registry.mjs` reads
`<section>.nodes.txt`. Two independent harvests, and nobody had asked how far
apart they were. Diffing coverage's genuine set against `registry.json`:

| | |
|---|---:|
| In-scope genuine frames (live harvest) | **1,914** |
| — of those, ABSENT from `registry.json` | **52** |
| as a share of the denominator | **2.72%** |

| Page | missing | what they are |
|---|---:|---|
| Home 2 | **34** | `Skai > Home > Intell…` boards at 1440x900 and 1440x1124, `sidebar - open - age` 248x844 |
| Towers | 9 | the 954x621 game states — Medium, Hard, Expert, Master, Easy cashout, Easy auto Selection … |
| Coinflip | 3 | two 954x621 Desktop, one 324x66 |
| Hi-Lo | 2 | 954x621 Desktop, 356x621 |
| Scratchers / Baccarat / Roulette / Slide | 1 each | 954x621 Desktop, 347x347 Mobile, 324x166 |

These are **real screens**, not furniture — several are full board widths.

### ★ Why the rebuild alone will not fix them

`build-registry.mjs` reads `.nodes.txt`. Verified: `13388-149975` (a 1440x900
Home 2 board) is absent from `registry.json` **and from all 39 `.nodes.txt`
files**. The 4 blackjack/bingo ids were patched into `.nodes.txt` by hand; the
other 48 were not. Re-running `build-registry.mjs` against unchanged `.nodes.txt`
reproduces the same gap.

Close-out order agreed with the coordinator: **refresh `.nodes.txt` from the live
harvest for all 52 → `build-registry.mjs` → `apply-status.mjs` → `coverage.mjs`.**
Deliberately after the lanes are down, not under them.

### ★★★ THE UNMATCHED-ID COUNT IS NOT A DATA-LOSS FIGURE. Stated plainly.

> **`coverage.mjs` is UNAFFECTED, and the wave percentage comes from
> `coverage.mjs`.** It reads `live/*.tsv`, counts all 52 inside its 1,914, and
> matches status rows to them **by node id without ever consulting
> `registry.json`**. A verdict written against one of the 52 lands in the wave
> percentage normally.

Only `apply-status.mjs` is affected, and only in that the verdict sits in a TSV
rather than in `registry.json` until the refresh. So:

- A row reported as *"applies to ZERO frames"* because its node is one of the 52
  is **correct work that has landed**, not a lost verdict.
- The unmatched-id count will **RISE** during wave 7, and the rise is lanes doing
  their job. The honest check is `88 + (wave-7 rows written against the 52)`,
  every one nameable by file and line.

### ★ The generalisable error, which the coordinator named better than I could

Three drifts were found in one session, and each was patched at the instance:
`_pages.json` refreshed but not its consumers; `_pages.json` fixed but nobody
asked what else read the harvest; 4 ids patched but nobody asked how many were
missing. **After finding a drift, measure its SIZE before fixing any of it.** The
loud failure is not the boundary of the damage.

### ★ And the method is the only reason the 52 is trustworthy

My first attempt at this number was **wrong, and wrong in a way that would have
published confidently**. I reimplemented `coverage.mjs`'s furniture rule and got
**1,512 genuine, not 1,914** — a 402-frame error, 21% of the denominator. The
cause was one operator: coverage reads `visible: visible !== "0"` (an absent
column counts as VISIBLE); I had written `vis !== "1"` (an absent column counts
as hidden).

I only caught it because I checked my rule against coverage's **published**
totals before pointing it at anything unknown. Once corrected it reproduced all
three exactly — `genuine 1914 · furniture 418 · live 2332` — and only then was it
used to find the gap.

> ★ **A checker must reproduce a known answer before it is trusted with an
> unknown one.** This is the same sin `bp-report.mjs` committed when it kept its
> own copy of `STATUS_VALID` and silently discarded 154 of 2,140 rows. Restating
> a rule instead of importing it is a coin flip, and mine landed 402 frames off.

---

## 11. ✅ THE FIRST ORACLE TEST OF THE WAVE, MUTATION-TESTED AND SURVIVING

§6 audited 33 `*.figma.test.tsx` files and found only 7 resolved actuals through
the shipping Tailwind config, only 3 carried a transcribed Figma fixture, and 16
asserted **no geometry at all**. It also recorded that mutation testing had
deliberately NOT been performed, because the geometry lives in shared constants
and mutating them under 19 lanes is the documented "mutation echo" hazard.

**One new oracle landed in wave 7 and it has now been mutation-tested.**
`src/components/trench-redesign/discover/FiltersPanel.figma.test.tsx`, 284 lines,
11 `it()` blocks.

It meets all three clauses of the WAVE6-BRIEF §2 sound shape:

1. Figma pixels are **literals with node-id provenance** — page `13006:134300`,
   frame `13006:176980`, right menu `x=990 y=8 442x884`, `cornerRadius 24`,
   `padding 24`, fill `#122524 @ 0.8`.
2. Actuals resolve through the **shipping** config — `tailwind.config.ts` → the
   `@skai/ui` preset → `--radius` read out of `src/index.css` at runtime.
3. The "what it used to be" comparison **renders a bare `SheetContent`** from the
   same `@skai/ui` build, so the library default is measured, not restated.

And it contains an internal-consistency check that is the reason `442` is a
measured number rather than a round one: `990 + 442 = 1432 = 1440 − 8`, and
`8 + 884 = 892 = 900 − 8`. The panel is inset 8px on three edges, which is what
makes `inset-y-2 right-2 w-[calc(100%-1rem)]` checkable.

### The mutation, done narrowly and disclosed

| step | result |
|---|---|
| baseline | **11 passed** |
| mutate `FiltersPanel.tsx:312` `className={RIGHT_MENU_SHEET_CLASS}` → a literal `"fixed inset-y-0 right-0 w-96 rounded-none p-4"`, confirmed landed with `grep -F` | **8 failed, 3 passed** |
| restore from backup, `grep -F` confirms 1 original occurrence and 0 mutant | **11 passed** |

★ **Scope was chosen to avoid the §6 hazard, not to dodge the work.**
`RIGHT_MENU_SHEET_CLASS` lives in `rightMenuChrome.tsx` and is imported by six
components across `trade/perp-v2` and `trench-redesign`; mutating it would have
put a red run in other lanes' paths. `FiltersPanel.tsx:312` only *consumes* the
constant, so the blast radius is one component and its own test file. The owning
lane was told before the edit and told again after the revert.

The 3 survivors are the ones that should survive — the frame-arithmetic block,
which asserts Figma numbers against each other and never touches the component.

> **This is the only wave-7 `done` currently backed by a mutation-proven oracle.**
> The other `done` rows are backed by measured numbers in their reason column,
> which is the wave-5 bar, but not by an executable oracle.

---

## 12. ★★★ FIFTEEN POPULATED DATA TABLES WERE FILED AS `furniture` ON A DEDUPLICATION ARGUMENT

Found by `w7b-furniture`, **verified here independently from the live harvest
before being recorded.**

`status.wave3.verify-trade2.tsv:163-177` marks 15 Trade 2 frames `furniture`,
each with a reason of the form *"a full-width RE-CROP of a table already
catalogued as a screen row (… mobile 375 crop)"*.

Two things are wrong with that, and the second is checkable:

**1. Deduplication is not furniture.** SCHEMA.md defines furniture as *"not spec
at all: Directory banners, Breakpoint rulers, loose rectangles, FigJam
stickies"*. "This is a duplicate of something else" is a different claim, and it
does not make a populated data table stop being spec.

**2. The breakpoint labels are contradicted by the measurements.** Pulled
straight from `live/*.tsv`:

| claimed | measured widths |
|---|---|
| "mobile 375 crop" / "tablet 768 crop" | 1061 (x3) · 1053 (x3) · 1047 (x2) · 801 · 777 · 562 (x2) · 538 · 489 · 432 |

All 15 are `FRAME`, all `visible=1`, and **not one is 375 or 768 wide.**

### ★ The quiet part: they were never removed from the denominator

All 15 are **visible `FRAME`s whose names are not on the canvas-chrome list**, so
`coverage.mjs` correctly counts them **genuine** and they sit inside the 1,914
today. **The defect is the status on the row, not the classification.** The
wave-3 rows did something subtler than delete them: they left them in the
denominator carrying a status that is neither `done` nor `partial`, so they
**depress the built-at-all floor** while reading as "not spec, nobody needs to
look at this". Fifteen frames of responsive-table work, hidden in plain sight,
counted against the percentage the whole time.

> ⚠️ **A first draft of this section said they count as genuine "because they are
> default-named". That is wrong, and `w7b-furniture` corrected it.** `classify()`
> (`coverage.mjs:212-216`) is: hidden → furniture; canvas-chrome NAME → furniture;
> non-`SPEC_TYPES` → furniture; else genuine. A default name plays **no part** —
> it only increments the separate `defaultNamed` counter for caveat 8. Proof
> inside the same lane's set: `Hover and clicks` (`13006-247576`) is not
> default-named and is counted genuine identically.
>
> ★ The wording mattered because of where it would have led. A reader fixing
> "default names are counted genuine" would add default-name detection to the
> furniture rule — **exactly what `coverage.mjs:180-187` refuses in writing**,
> and for a good reason: `Group 316` on Price Grid is 1410x900, a full screen
> with a lazy name. A rule that guessed intent from a default name would quietly
> shrink the denominator and raise the percentage. **A wrong explanation of a
> right number invites a wrong fix.**

### ★ And the same shape applies to the 38 confirmed-furniture frames

`w7b-furniture` volunteered this against its own result rather than leaving it to
be found: the 38 frames it *confirmed* as furniture are also visible FRAMEs that
stay inside the 1,914 carrying a `furniture` status. Same shape, same depressive
effect on the floor. **Those confirmations do not fix anything on their own** —
they document what a `classify()` change would have to cover. They are not a
cleanup that has already happened.

---

## 13. ⚠️ A DENOMINATOR CUT WAS PROPOSED AND IS NOT ADOPTED

`w7b-furniture` adjudicated all 60 `catalogFurniture` frames, confirmed 38 as
genuinely furniture, and proposed **"honest denominator: 1,914 − 38 = 1,876"**.

**Recorded as a reviewable proposal, not published as the denominator.** Two
reasons:

1. **It is not a number `coverage.mjs` will ever print.** §5 established by
   running the rollup before and after that a column-2 `furniture` row stays
   inside `genuine` — coverage's own TYPE/NAME rule is what removes a frame, not
   the catalog status. Those 38 remain in the 1,914 whatever their row says.
2. **It moves the number the flattering way.** 1,111/1,914 = 58.05%;
   1,111/1,876 = 59.22%. `coverage.mjs`'s guard is split by direction for exactly
   this reason — a shrinking denominator *"RAISES the percentage — flattering,
   and nobody reviews the flattering direction"*. A cut resting on per-frame human
   adjudication is precisely the kind that needs review before it becomes a
   headline.

★ The asymmetry is deliberate and is the rule this file runs on: **the burden on
a change that raises the number is higher than on one that lowers it.** The same
lane applied that rule to itself unprompted, taking `play`'s `frame-defect` over
its own `furniture` on `9112-13214` because the `frame-defect` keeps the frame IN
the denominator. That is the correct instinct.

Also carried forward: 4 `catalogFurniture` frames written after that lane's
snapshot remain unadjudicated — `13008-55685`, `9380-7138`, `9391-19746`,
`9433-10192`.

---

## 14. ★★★ THE SILENT DROP — 78% OF THIS WAVE'S ROWS NEVER REACH `registry.json`

Found by `w7b-wallet2`. Verified here from `registry.json` without using its
counts, and the independent number came out **larger**.

`apply-status.mjs:272` opens the **only** loop that writes `f.status`:

```js
for (const [regKey, f] of Object.entries(reg.frames)) {
  if (f.kind !== "screen") continue;
```

A row addressed to a frame whose kind is not `screen` is parsed, counted in
"status lines loaded", reported **addressable** by `validate-wave7.mjs` — and
then never applied. **The verdict evaporates between "loaded" and "written".**

| | |
|---|---:|
| wave-7 id-keyed rows | 826 |
| **silently dropped** | **646 (78.2%)** |

| lane | dropped | as |
|---|---:|---|
| `games-unknown` | 145 | non-screen |
| `trade2-unknown` | 129 | **untitled** |
| `trade2` | 122 | **untitled** |
| `play` | 79 | non-screen |
| `wallet2` | 51 | non-screen |
| `furniture` | 43 | 25 non-screen + 18 untitled |
| `home2` | 41 | non-screen |
| `predict` | 34 | non-screen |
| `verify-orphans` | 2 | non-screen |
| `social` | **0** | — the only lane that lands everything it writes |

Registry-wide, only **1,687 of 3,776 frames (44.7%)** are kind `screen`. 1,411
are `non-screen`, 669 `untitled`, 6 `component`, 3 `scaffold`. None of those can
receive a status however carefully it was measured.

★ Note **two** kinds hit the same guard. Trade 2's 251 rows are dropped as
`untitled`, not `non-screen` — a fix that whitelists only `non-screen` still
loses them.

### Not new to wave 7

`13008-27159` received a wave-4 `done` with full measurements. `registry.json`
today: `kind: "non-screen"`, `status: "unknown"`, `notes: ""`. **This is why the
registry holds so many `unknown` component frames — not that nobody looked, but
that the loop refused to write what they found.**

### ★★★ AND AGAIN: THE PERCENTAGE IS SOUND

> `coverage.mjs` reads `status.*.tsv` **directly** (`:308`) and touches
> `registry.json` only to collect node ids (`:229-230`). It has **no `kind`
> filter anywhere**. Every dropped verdict still counts in the wave percentage.
> **`registry.json` is the damaged artifact; the number is not.**

This is the same shape as §10 and it is now the wave's recurring theme: **three
independent defects, all in downstream consumers of the measurement, none in the
measurement.** Anyone reading this file for a headline should take that as the
finding.

### The fix, and why the obvious version of it was wrong

Shipped by the coordinator as **`f81cee7`**. Not the one-liner I offered — the
distinction the guard was reaching for is real and was kept:

- a **family-keyed** row addresses `section/family`, i.e. every frame sharing a
  screen name. Letting that stamp non-screen children would smear one verdict
  across a screen's parts. **Still `kind === "screen"` only.**
- an **id-keyed** row names ONE frame deliberately. **Now applies whatever the
  kind.**

**Measured after: frames updated 1,632 → 2,968; matched by node id 1,139 →
2,475. 1,336 previously-discarded verdicts now land.**

★ **The per-kind breakdown changed the fix.** The coordinator would have
whitelisted `non-screen`; the breakdown showed 669 `untitled` frames hitting the
same guard, so a whitelist would have looked like a fix and silently kept losing
251 Trade 2 rows. **The right shape was to remove the kind test from the id path
entirely, not to enumerate kinds.**

> ★★★ **A BINARY PREDICATE CANNOT REPORT A CATEGORY IT HAS NO BUCKET FOR.** This
> happened **twice in one day**. `w7b-wallet2`'s counting script wrote
> `if (f.kind === 'screen') … else …`, so every non-screen kind collapsed into one
> bucket and the `untitled` population was invisible in its own report. Anyone
> reading that table would have built the whitelist. **When a report says "X vs
> not-X", ask what `not-X` is hiding.**

### ⚠️⚠️ AND THEN MY OWN VALIDATOR WAS WRONG — WORSE THAN THE BUG IT FOUND

`validate-wave7.mjs` was first blind to this, structurally: it checked
`addr.kind` — the **row's address FORM** (id / section / family) — and never the
**frame's `kind` field**. Two unrelated things sharing a word.

I fixed that by hard-coding the guard's predicate **and its line number**. When
the coordinator removed the guard, my script went on asserting it existed and
cited `apply-status.mjs:272` — a line that by then held the comment recording the
removal. For a window it printed **"🚨 218 of 218 (100.0%) will be SILENTLY
DROPPED"** at lanes whose work was landing fine.

`w7b-games-unknown` caught it by reading `apply-status.mjs` instead of believing
the validator.

> ★★★ **That is precisely the sin this script's own header warns about.** The
> header says a validator keeping its own copy of a rule "is worse than no
> validator", citing `bp-report.mjs`'s private `STATUS_VALID` copy that discarded
> 154 rows. I then kept a private copy of a guard's *existence*. **Being told
> about a trap in your own header is not protection from it** — the third time
> this file has had to record that about its own author.

It fails toward **alarm** rather than reassurance, which is the safer direction.
It was still wrong, and lanes were acting on it.

**Corrected:** the id-path check is deleted outright. The only surviving check is
the one real case — a family-keyed row whose family holds no screen frame. Live
output flags zero, because all 948 wave-7 rows are id-keyed.

### ★★★ THE SHARPEST LESSON OF THE WAVE: A SELF-TEST CAN ENSHRINE A STALE BELIEF

The banner was the visible error. The **fixture was the dangerous one.**

My self-test had a fixture labelled *"CAUGHT the silent drop"*, asserting that an
id-keyed row on a non-screen frame **is** dropped. After `f81cee7` it **kept
passing** — because it was asserting the presence of a defect that no longer
existed, and a 10/10 green read as confirmation the belief was current.

> **A self-test proves the checker still does what it was built to do. It cannot
> tell you the thing it was built to detect has been fixed.** A green suite is
> not evidence the suite is asking the right question.

Fixed by **inverting it into a regression control**: an id-keyed row on a
non-screen frame must now produce **no complaint**, so if the guard is ever
reintroduced the suite reports `FALSE+`. Retiring the banner alone would have
left the fixture lying.

### ★ A mutation that WIDENS a predicate does not test it

The new check has a self-test fixture (`13008-27159`), and proving it took two
attempts:

| mutation | fixture | why |
|---|---|---|
| `!== "screen"` → `!== "screenZZZ"` | **still CAUGHT** — proves nothing | widening flags *more* rows, so the fixture passed for the wrong reason |
| `!== "screen"` → `!== "non-screen"` | **MISSED** — the real kill | this is the only edit that actually suppresses the check |
| reverted, `grep -F` confirms | **10/10, control clean** | |

★ **A loosened condition still fires on the fixture.** Only a mutation that
*suppresses* the behaviour tests it. The first attempt would have been reported
as a passing mutation test and been worthless.

And before that: my first fixture reported **MISSED when the check was correct**
— a false RED, because a scripted patch to the self-test harness had silently
failed to apply and the harness was not reading `droppedByKind` at all. Caught by
`grep -c` on the patched string rather than by trusting the edit. **Verify the
edit landed before believing either colour, not just before believing a green.**

---

## 15. `done` ROWS SPOT-CHECKED — 32 of 32 CARRY MEASURED NUMBERS

Every wave-7 `done` row was cross-checked against the live harvest by script, not
sampled.

| check | result |
|---|---:|
| `done` rows with **no digits** in the reason (the validator's bar) | **0** |
| shortest reason | 194 chars, 25 digits |
| dimension in reason **matches the live harvest exactly** | **27 / 32** |
| dimension refers to a **named child node**, not the row's own frame | 5 / 32 |
| **genuine mismatches** | **0** |

★ **The 5 "mismatches" were my checker over-reporting, not bad rows.** My script
took the *first* `WxH` in the reason and compared it to the row's own frame. But
`Trench > Filters 1VH [13006-176980]` is a 1440x900 board whose reason correctly
describes its `Right menu` **child** as 442x884 — and `442x884` is a real,
repeated node size across the Trade 2 page. `13008-54086` (375x812) names a
different node outright: *"Frame 13008:54188 (Frame 1103) re-read this pass:
359x796"*.

This is §6's trap 1 recurring: **a checker that over-reports is not "safe"**. Had
I filed those 5 as defects, the lanes would have spent budget defending correct
work.

Two rows were verified end-to-end against the implementation:

| node | Figma | code | verdict |
|---|---|---|---|
| `10030-33518` Price Grid lattice | 130 rects at 100x100 on a 100px pitch, 130 ellipses at 10x10 | `PG_GRID` `cell: 100` (`:77`), `rule: 2` (`:79`), `dot: 10` (`:81`), `PG_RATIO` divides by cell (`:102-104`) | **exact** |
| `13008-114604` sidebar - open | frame 248x844, rows h42 pitch 44, icon slot 36x36 at (3,3), hairline 200x0 | `h-[42px]` `:379`, `leading-[18px] tracking-[-0.04em]` `:381`, `p-[3px]` `:479`, `gap-[2px]` `:652` | **exact, line numbers included** |

Both cite line numbers that resolve. That is the wave-5 bar met properly, and it
is a marked change from wave 5, where the Predict lane found **all 16** of its
`done` rows were citation-only.
