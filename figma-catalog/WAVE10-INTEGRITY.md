# Wave 10 — catalog integrity

Written by the `w10-verify` lane. Its job is to stop the wave lying, to keep the
atomic refusal from eating correct work, and to compute the percentage with the
uncertainty stated rather than hidden.

Every number carries its denominator. That rule is inherited from
`WAVE9-INTEGRITY.md` and it is the one that keeps producing findings, because the
dominant failure in this catalog is not a checker that says "wrong" — it is a
checker that says "fine" about a population nobody sized.

**Lanes were still running when these numbers were taken.** Everything in §4 is
"as measured at close of this lane's work", not a frozen wave total.

---

## 1. ★★★ THE GATE WAS FAILING 200 ROWS OF CORRECT WORK AND TELLING LANES TO DELETE THEM

`WAVE9-INTEGRITY` §10 identified this and deliberately deferred it, judging it
"the single highest-value thing to do before wave 10". It was done first, before
most lanes had written.

`validate-wave7.mjs` had one message for any node id `registry.json` cannot
address — *"node X is in NO registry frame — this row applies to ZERO frames"* —
and exit 1. Measured across all 134 committed status files before the change:

| what the id actually is | rows | distinct ids |
|---|---:|---:|
| not a top-level child of any harvested page | 20 | 19 |
| **live, in-scope, GENUINE — the registry gap** | **148** | **52** |
| live, in-scope, but furniture | 44 | 19 |
| live, but on an out-of-scope page | 8 | 8 |
| **total** | **220** | **98** |

**Only 20 of 220 rows were a lane's mistake.** The other 200 name nodes that
exist in Figma. The 52 are Direction A, the drift class that has now stood
unchanged for three waves — and `coverage.mjs` reads `status.*.tsv` directly, so
all 148 of those verdicts were already inside the published percentage. Nothing
was waiting on the registry; the gate was simply failing over it.

The 148/52 split reproduces `WAVE9-INTEGRITY` §5 exactly, by a different route
(validator log → `loadLiveNodes`), with the same per-page distribution: Home 2
34, Towers 9, Coinflip 3, Hi-Lo 2, Scratchers / Baccarat / Roulette / Slide 1
each.

### What the message does now

- node **not in any top-level harvest** → exit 1, as before;
- node **live** (any of the three live buckets) → its own banner, **not
  exit-worthy**, with *"DO NOT re-key and DO NOT delete this row."*

The live rule is imported from `registry-drift.mjs`'s `loadLiveNodes()` rather
than copied. That is not decoration: this same file once kept a private copy of a
guard's existence and told nineteen lanes their finished work was being
discarded, and `bp-report.mjs`'s private `STATUS_VALID` silently dropped 154 of
2,140 rows.

### ★ And a fourth case the first version still conflated

Reported by a lane and resolved live with `getNodeByIdAsync`: **`4725:55130` is
real, and it is a descendant of `4725:55110` three levels down.**

`live/*.tsv` lists only depth-1 children of a page, so an **interior** node is
indistinguishable from a dead id here — and it can never be addressable however
fresh the harvest is. A re-harvest does not fix an interior node. The fix is to
**fold the measurement into the ancestor frame's row**, because the catalog's
unit is the frame. The message now names both causes and both fixes, and stays
exit 1, because unlike the registry-gap branch there is a lane action either way.

**I cannot separate interior from deleted, and neither can any tool reading only
this repo.** I checked all three candidate sources rather than assuming: `live/*.tsv`
is a flat depth-1 list, `*.nodes.txt` is a bare id list with no depth or parent
column, and registry frames have no parent field. So the validator ships a
**hint**, not a determination: it names live in-scope frames sharing the node
id's major part. Measured over the 19 unresolved ids — 1 candidate for the Social
id, 3 for four ids (including `4725-55130`, where the true ancestor `4725-55110`
is among them), 4, 9 and 11 for the games ids, and **375 candidates each for the
eight Trade 2 ids**. A hint naming 375 frames is the page, not a hint, so it stays
silent above five and fires on 11 of 19.

> ⚠️ **A deleted node shares its id-major with its old neighbours too.** The hint
> narrows where to probe. It cannot answer interior-vs-deleted, and it must not be
> collapsed into a finding by a later reader.

### Interior nodes, counted — with the denominator, and no extrapolation

| | |
|---|---:|
| ids in the `not-top-level` bucket | **19** |
| — probed live with `getNodeByIdAsync` | **1** |
| — of those, INTERIOR (real, permanently unaddressable) | **1** |
| — of those, deleted | **0** |
| — **unprobed** | **18** |

And for Direction B, `WAVE9-INTEGRITY` §3's 182 in-scope ghosts: **13 probed
(all null), 169 unprobed, unchanged.** The interior finding gives that class a
*mechanism* it did not have — a re-parented node becomes interior, and interior
is exactly what "still in Figma, not top-level today" looks like — but it does
not give it a count. **1 confirmed interior node is not evidence about the other
181.** Walking back a "182 deleted frames" reading once was enough; re-creating
it as "182 possibly interior" would be worse, because it would look checked.

### Mutation-tested, six mutations, every one a suppression

Run against a **copy** (`.validate-mutant.mjs`), never the live gate, so no lane
ever read a wrong answer. Each landed check used single-quoted `grep -c -F`
(`grep -iF` is silently empty in this shell).

| mutation | self-test | exit |
|---|---|---|
| every non-exit branch made exit-worthy (the whole split reverted) | **10/13** | 1 |
| live lookup suppressed — everything treated as not-live | **10/13** | 1 |
| furniture branch suppressed | 12/13 | 1 |
| scope branch suppressed | 12/13 | 1 |
| the SKIPPED path — every bucket forced empty | 10/10, **3 SKIPPED** | **1** |
| restored | 13/13, both controls clean | 0 |

★ **The seventh run is the one worth keeping.** Reverting the split *and*
removing the exit-worthiness assertion together goes **13/13 GREEN**. Every
fixture's message lands in the same joined report whichever accumulator holds it,
so a substring match alone cannot tell the two branches apart — the assertion is
the only thing that catches the revert. Without it the split would have been
decorative and the suite would have gone green over a reverted fix.

The three new fixtures take their node ids **from the live harvest at run time**
rather than hardcoding them, so a re-harvest cannot rot them into a MISSED on a
fixture whose label still claims to test the branch. An empty bucket prints
SKIPPED and **fails**, rather than vanishing from a suite that stays green.

---

## 2. THE NUMBERS

Measured with `coverage.mjs`, and the baseline recomputed with the **same
instrument** over the wave-10-start commit (`8bdf29f`, extracted with
`git archive`) rather than quoted from the brief.

**Snapshot point:** catalog HEAD `50d9065`, 19 wave-10 files, 570 wave-10 rows.
Lanes were still writing; a later reading will differ.

> That baseline run reproduces the brief field for field —
> `done 281 · partial 1162 · not-started 172 · blocked 114 · frame-defect 66 ·
> furniture 43 · unknown 76 = 1914`. **The baseline is confirmed, not restated.**

> ### At measured parity — `done` / genuine
> ## 317 / 1,914 = **16.56%**  (baseline 14.68%, **+1.88pp**)
>
> ### Built at all — (`done` + `partial`) / genuine
> ## 1,416 / 1,914 = **73.98%** floor  (baseline 75.39%, **−1.41pp**)
>
> ### The band
> ## **73.98% – 76.70%**, width **2.72pp**  (baseline 3.97pp)

The ceiling is the floor plus the 52 remaining `unknown` — the formula that
reproduces WAVE9's stated 79.36% for the baseline exactly.

The seven buckets still exactly partition the denominator:
`done 317 · partial 1099 · not-started 233 · blocked 87 · frame-defect 83 ·
furniture 43 · unknown 52 = 1914`, with `liveOnly` drift 0.

★ **Parity up and built-at-all DOWN is the wave working, not a contradiction.**
Re-measurement promoted 37 frames out of `partial` and pushed 47 the other way
into `not-started` and 17 into `frame-defect`. A wave that only promotes is a
wave that only looked at the frames it expected to pass. The band narrowing 1.25
points (3.97 → 2.72pp) is the same effect: 24 fewer `unknown`.

### 2.1 Promotions and demotions, separately

A rollup delta is a NET: "+30 done" is equally consistent with 30 promotions and
no re-verification, or 45 promotions and 15 demotions. `coverage.mjs` exposed no
per-frame verdict, so this wave added a read-only `--frames` dump (§3) and the
two were diffed frame by frame.

| | |
|---|---:|
| in-scope frames, both dumps | 1,914 (0 present in only one) |
| frames whose resolved verdict CHANGED | **196 of 1,914** |
| **★ PROMOTIONS to `done`** | **39** |
| **★ DEMOTIONS from `done`** | **3** |
| net | +36 |

Promotions came from `partial` 37 and `blocked-on-backend` 2. The three
demotions, named individually so none hides in a net:

```
3554-10890   Predict   done -> partial
3562-40397   Predict   done -> partial
9185-15873   Play      done -> not-started
```

> ⚠️ **39 promotions against 3 demotions is a ratio worth stating plainly.**
> WAVE8-BRIEF §3: a wave whose `done` only increases is a wave re-verifying
> nothing. Wave 9 ran 6 promotions / 8 demotions — the healthier shape. Wave 10's
> bulk was re-recording verdicts for code that had already landed, so promotions
> are expected here; but the re-verification pressure this programme relies on
> came from the `partial` column this wave, not from the `done` column.

The full transition table, which is where the re-classification actually shows:

```
 47  partial            -> not-started
 37  partial            -> done
 32  blocked-on-backend -> not-started
 22  not-started        -> partial
 19  unknown            -> partial
 17  partial            -> frame-defect
  8  partial            -> blocked-on-backend
  3  unknown            -> not-started
  3  blocked-on-backend -> partial
  2  done               -> partial
  2  blocked-on-backend -> done
  1  unknown            -> blocked-on-backend
  1  frame-defect       -> blocked-on-backend
  1  done               -> not-started
  1  unknown            -> frame-defect
```

★ **`blocked-on-backend → not-started` 32 times** is the largest single honest
correction in the wave, and it is the `blocked-on-backend-is-mostly-wrong`
finding landing: work that had been taken off the schedule on a blocker that did
not hold.

### 2.2 Per surface

| page | gen | done base → now | partial base → now | parity base → now |
|---|---:|---|---|---|
| Social | 402 | 25 → **35** (+10) | 242 → 225 | 6.2% → **8.7%** |
| Trade 2 | 375 | 29 → **36** (+7) | 278 → 244 | 7.7% → **9.6%** |
| Play | 269 | 35 → **40** (+5) | 151 → 156 | 13.0% → **14.9%** |
| Predict | 254 | 26 → **27** (+1) | 168 → 159 | 10.2% → **10.6%** |
| Wallet 2 | 159 | 113 → **115** (+2) | 41 → 39 | 71.1% → **72.3%** |
| Home 2 | 138 | 11 → **14** (+3) | 100 → 101 | 8.0% → **10.1%** |
| **Blackjack** | 16 | 7 → **13** (+6) | 6 → **0** | 43.8% → **81.3%** |
| Towers | 16 | 0 → 0 | 6 → **14** | **0.0%** |
| Baccarat | 13 | 2 → **4** (+2) | 4 → 2 | 15.4% → **30.8%** |
| Hi-Lo | 7 | 0 → 0 | 7 → **0** | **0.0%** |
| Privacy and Terms | 6 | 6 → 6 | 0 → 0 | **100.0%** |

Blackjack is the wave's clearest result: **`partial` is now zero on that page**,
so every frame carries a settled verdict. Predict's +1 is a net of 3 promotions
against 2 demotions — the only page where the two ran in both directions.

Unchanged at `done` and omitted for space: Coinflip 11.8%, Dice 13.0%, Crash
46.2%, Mines 25.0%, Price Grid 25.0%, Scratchers 21.4%, Bingo 15.4%, Slide 15.4%,
Darts 5.6%, Keno 5.6%.

### 2.3 ★ How many of the nine zero-parity pages got off zero

> ## **0 of 9.**

Chicken, Fortune Wheel, Plinko, Limbo, Hi-Lo, Towers, Roulette, Video Poker and
RPS all still read `done` = 0. **That is the second consecutive wave in which no
game page at zero has moved** (WAVE9 §9.4 recorded 0 of 11).

The `partial` column moved a lot underneath the zero, and in both directions:
**Hi-Lo 7 → 0** and **Towers 6 → 14**. Hi-Lo's seven frames left `partial` without
one arriving at `done`, which is a page being honestly re-read, not a page
regressing. But the headline stands: the nine pages that had never banked a
measured frame still have not.

---

## 3. THE PER-FRAME DUMP, AND WHY IT IS NOT A SECOND COPY OF THE RULE

`coverage.mjs --frames` — `id · page · scope · resolved status`, one row per
matched genuine frame. It is in `CHECK_ONLY`, so it writes nothing.

The resolution it reports is **not recomputed**. It is the same `worst` variable
the percentage is tallied from, captured at the point of tally. That matters
because the rule is subtle — newest generation first, *then* worst-of within that
generation — and `coverage.mjs`'s own comment records that getting it wrong once
reported 65 Home 2 frames as `done` where a re-verify had left 3.

**Verified additive:** `--histogram` output is **byte-identical** to the committed
version over the same inputs (7,723 bytes both).

**Verified bound to the right variable, by mutation:** sourcing the dump from
`rows[0].status` instead reports `done 389` against the true 305 and
`unknown 314` against 57. Restored, it returns 305.

**Verified self-consistent:** the dump's in-scope rows total 1,914 and its seven
buckets sum to 1,914 — the same exact partition WAVE9 §2 established.

---

## 4. ★★★ THE ORACLE CENSUS, KEYED ON WHAT TESTS CITE — WAVE 9'S OPEN GAP, CLOSED

`WAVE9-INTEGRITY` §11 left this open in its own words: *"A complete oracle census
would key on files citing a Figma node id, not on filename. Recorded as a known
gap, not closed."* It was not hypothetical — `PlayStateCard.test.tsx` was
reported to that lane as an instance of the class and was never in its 105,
because its name carries neither `figma` nor `parity`.

New tool: **`oracle-census.mjs`**. A test is an oracle if it cites a node id the
**registry carries** — a statement about content, which cannot be satisfied by
renaming a file or missed by not renaming one. The citation rule (id shape, date
exclusion, registry membership) is **imported from `scan-citations.mjs`**, whose
executable half now sits behind an `IS_MAIN` guard; without it, importing the
rule would walk three source roots and rewrite `code-node-citations.json` as a
side effect of an import.

### The two populations, measured

| | |
|---:|---|
| **901** | test files scanned, across **five** roots |
| **235** | cite a node id the catalog carries |
| **117** | match the wave-9 NAME glob |
| 83 | both |
| **152** | ★ **cite a real frame and the name glob MISSES** |
| 34 | named like an oracle but cite no node id |

Five roots, not three: `src`, `skai-gaming`, `skai-wallet`, `skai-ui` and
`skai-command`. Each submodule has its own vitest config, and a run from the
wrong root collects zero files and **exits 0**.

> ★ **Wave 9's "105 files, one red" covered roughly a third of the population
> that a content key finds.** The sweep was sound; its denominator was a naming
> convention.

### The 152 were run. All of them.

Collected counts read off the `Test Files N passed (N)` line with ANSI codes
stripped, and exit codes taken without a pipe.

| root | files | collected | tests | red |
|---|---:|---:|---:|---:|
| repo root config | 130 | **130** | 2,124 | **0** |
| `modules/skai-wallet` | 21 | **21** | 248 | **0** |
| `modules/skai-ui` | 2 | **2** | 29 | **0** |
| **total** | **153** | **153 (100%)** | **2,401** | **0** |

**Nothing in the population wave 9 could not see is red.** That is a reassuring
result, and it is worth having as a measured one rather than an assumed one.

⚠️ **"Cites a node id" is an upper bound on the oracle population, exactly as
"has `figma` in its name" is.** Some of the 235 are behaviour tests that mention
a frame in a comment. The defensible claim is narrow and is the one that matters:
**the wave-9 sweep's population was selected by filename, and 152 node-id-citing
test files sat outside it.**

### The one standing red is now green, and wave 9's diagnosis was right

`activityHeaderTypeRamp.figma.test.tsx` — the single red in wave 9's 105, which
that report diagnosed as a **defective oracle**, not an unmade fix: its filter
`/(^|:)(text-|leading-|font-|tracking-)/` admitted the alignment utilities
`text-right` / `text-center` it claimed to strip. It now passes 3/3, and the fix
is exactly the diagnosis — an `ALIGNMENT` exclusion, with a comment saying it was
done that way *"rather than loosening the type filter, which would let a real
`text-sm` through."* **A correct diagnosis of a wrong test, acted on.**

### ⚠️ My first run of these 153 files reported six batches failing, and zero tests had run

`--reporter=basic` does not exist in this vitest. Every batch exited 1 on a
**startup error**, and my `grep -E 'Test Files'` matched nothing — which reads
identically to "the run collected nothing" and, taken with exit 1, reads like 130
files of failures. Reading one log settled it in seconds.

★ Same shape as WAVE9 §8's ANSI-code incident and the same remedy: **a run that
exits non-zero has not told you whether it ran.** Read the log.

---

## 5. VERIFYING THE RE-RECORDED ROWS — THE WAVE'S BIGGEST AND CHEAPEST BUCKET

Wave 10's largest category is lanes writing verdicts for wave-9 code that already
landed. Legitimate, and the easiest place in the programme to bank a `done` for a
fix nobody re-checked. Every claim below was checked **against the working tree,
not against the lane's claim**.

### 5.1 Deep-read, claim by claim

**`games-cards` — 6 of 6 `done` rows verified exact.** Every ratio in the rows is
byte-for-byte in `blackjackTheme.ts`: `win #17F9B4`, `lose #FF574A`,
`height 142.192/90.732`, `radius 13.542/90.732`, `pad 6.771/90.732`,
`rankLine 37/90.732`, `winRing 3/90.732`, shadow `-0.681 / 3.387 / 0.681` over
90.732, `ribbonWidth 492.24`, `ribbonHeight 87.764`, `splitGap 200/90.732`,
`DECK_RATIO.step 9.579/91.684`, `overhang 72/143.684`, and
`HAND_GAP = "min(3.4432cqw, 19.749px)"`. The wiring claim resolves too:
`isLosing` is at **`BlackjackGame.tsx:2651`** exactly, and the predicate is the
one the row describes — `typeof settledPayout === "number" && settledPayout < hand.bet`.

**`trench-discover` — 9 of 9 verified.** The md tier the rows stand on is real
(`ChainChartCard.tsx:268` and `:343`), `rounded-[12px] … lg:rounded-[16px]` at
`:242`, ticker at `:248`. The rows for the 1440 frames claim the new `md:` step
does not leak upward, and it does not: `:354` and `:360` carry
`text-[12px] leading-[14px] … lg:leading-4` with no `md:` variant. One citation
drifts two lines (`:341` for a class at `:343`, same JSX element) — noted, not a
defect.

### 5.2 ★ The one stale claim, and it is the inverse of the expected failure

`status.wave10.predict-detail.tsx:2` ended: *"ONE divergence held open: the frame
vector is strokeWeight 3 and impl ships `after:h-0.5` = 2."*

`MarketModules.tsx` ships **`after:h-[3px]`**. The only `after:h-0.5` left in the
file is inside the lane's own comment explaining why the old value was 2, and
`git diff` shows the change is the same lane's, this wave.

So the row recorded an open divergence that the row's own author had closed. It
does not inflate parity — the code is *better* than the row claims — but it would
send the next reader to fix correct code. **A row written across its own edit
boundary**: WAVE10-BRIEF §4's "a brief's CODE facts rot within the wave", occurring
inside a single row. Reported and fixed by the lane.

### 5.3 ★★★ TWO GREP ORACLES FAILED IN OPPOSITE DIRECTIONS IN ONE SWEEP

Checking "did the claimed fix land?" with `grep -c -F` on a bracket-literal class
went wrong both ways within ten minutes:

- **False alarm.** `LogoutConfirmModal.tsx` returned **0** for `rounded-[16px]`
  and `rounded-[12px]`, which reads as a `done` standing on an unmade fix. It
  ships `rounded-xl` and `rounded-lg` — which in *this repo's* scale are 16 and
  12. The row was right.
- **False reassurance-shaped hit.** `FeedCommentsDialog.tsx` returned **1** for
  `max-w-[546px]`, the value the row said it had replaced. That occurrence is at
  `:212`, inside a comment explaining the correction. The shipped class is
  `max-w-[564px]`.

> ★ **A class-literal grep is not an oracle for "was this fixed".** It cannot see
> a token spelling and it cannot tell code from prose. Both directions appeared in
> one sweep, and only reading the line settled either.

### 5.4 The complete, cheap check — with its denominator

New tool: **`row-tree-check.mjs`**, run over every wave-10 row, not a sample. It
checks the two things a script can check honestly: column 3 names a file that
exists, and every `File.tsx:NNN` citation points to a line the file has.

Column 3 earns a checker because **`apply-status.mjs:329-330` pushes it verbatim
into `implFiles`**, with no split and no validation.

| | first run | after lanes fixed |
|---|---:|---:|
| rows scanned | 347 | **485** |
| naming a primaryFile | 334 | 472 |
| — path does not exist | **7** | **0** |
| — column 3 holds more than one path | **43** | **0** |
| line citations checked | 108 | 140 |
| — beyond end of file | 0 | **0** |

The 7 were near-miss paths in one lane (`src/components/messages/ConversationHeader.tsx`
for a file under `pages/social/messages/`, and the near-mirror for `Messages.tsx`);
the 43 were one lane writing a multi-file sentence into a single-path column. Both
fixed the same day, and one lane then swept all 15 of its distinct column-3 values
rather than only the 7 reported.

★ **The 43 are a documentation gap, not a lane habit.** The lane pointed out that
the briefs give column 3 as `<primaryFile>` and never say it is pushed verbatim
into `implFiles`, and that committed wave-3/4/8 files carry the same shape. A
brief line saying "one real path, everything else in the reason" would stop it
recurring.

### 5.5 ⚠️ MY OWN CHECKER INVENTED NINE DEFECTS BEFORE IT FOUND ANY REAL ONE

Its first draft resolved a cited basename to the first file with that name. There
are **117 files named `index.ts`** under the roots it walks, so
`points-game/index.ts:5466` resolved to a **9-line barrel** and was reported as
*"cites line 5466 but that file has only 9 lines"* — specific, confident, and
entirely fabricated. The real file has **6,035** lines and every citation was
valid.

> ★ **A checker that resolves by basename does not hide a defect, it INVENTS
> one** — and an invented defect costs a lane a round trip defending correct
> work, which is the same harm §1's split exists to prevent. An ambiguous
> basename is now skipped and the skipped count printed. The self-test pins that
> case specifically, and the withdrawal was sent to the lane before it acted.

---

## 6. THE ATOMIC REFUSAL — WHAT THE GATE CAUGHT

Run repeatedly as TSVs landed. **The wave-10 gate closes green: 570 rows across
19 files, exit 0**, with 29 registry-gap rows reported and correctly not failing.
No new column-6 variant appeared; the grammar violations the brief warned about
(`blocked` in column 6, `not-measured`, a bare `-`, `n-a`, the unprefixed header)
did not recur once.

⚠️ **`--all` still exits 1, and that is a different bar, not an unfixed
blocker.** The remaining refusal-class messages are the validator's own
*"`done` but the reason carries NO DIGITS"* rule, in legacy files —
`status.home-2.tsv` 36, `status.wallet.tsv` 27, `status.home.tsv` 24,
`status.wallet-2.a.tsv` 21, `status.trade-2.launch.tsv` 16. `apply-status.mjs`
does not enforce that rule and exits 0. **Two gates, two bars, and the stricter
one is not the writer** — worth knowing before anyone reads a red `--all` as the
registry being blocked again.

What it did catch, all lane-fixable and all fixed:

1. **`play-shells` — one node id claimed twice in one file.** Line 3 was keyed to
   line 2's node. The lane resolved it by **folding** the measurement into the
   ancestor row, keeping every number, rather than re-keying to an id that would
   not have resolved either. That is the interior-node case in §1 and it is where
   it was discovered.
2. **★ Four frames claimed by two lanes at once** (`social-feed` and
   `social-blocked`). `apply-status.mjs` takes the later filename; `coverage.mjs`
   takes newest generation then worst-of. **On `11442-170034` the two tools would
   have picked different winners** — `partial` and `blocked-on-backend`
   respectively — so a reader checking one tool would not have seen the
   disagreement at all. Settled by the lanes, with the measurements folded into
   rows each lane holds alone and each fold naming the row it replaced.
3. Two predict-detail rows naming ids no top-level harvest carries — open at the
   time of writing, and reported with the interior-vs-wrong-id distinction.

★ **Cross-lane row collisions are a class this catalog had no check for.** They
are not a grammar error, both files are individually valid, and the loss is
silent. The gate finds them only because it indexes node ids across the whole
wave.

---

## 7. THE DRIFT, RE-MEASURED

`registry-drift.mjs` self-test 8/8, and its self-check reproduces `coverage.mjs`
exactly (live 2332, furniture 418, genuine 1914).

| | wave 9 | wave 10 |
|---|---:|---:|
| Direction A — live in-scope genuine, unregistered | 52 (2.72%) | **52 (2.72%)** |
| Direction B — registry frames not top-level live | 206 | **206** |
| — on an in-scope page | 182 | **182** |
| — probed live | 13 (all null) | **13** |

**Unchanged in both directions for a third consecutive wave.** Neither moves the
published percentage: `liveOnly` drift is **0**, and the seven status buckets
exactly partition the 1,914.

⛔ Restating what `WAVE9-INTEGRITY` §2 settled, because three separate reports got
it wrong in one wave: **`registry.json` is not an input to the parity number.**
Correcting it in either direction moves parity and built-at-all by **0**.

---

## 7.5 ★★★ THE WRITER: A SORT THAT INVERTED AT WAVE 10, AND A REFUSAL THAT HAS BEEN STANDING IN FRONT OF IT

Two findings, and the second changes what the first means.

### The inversion

`apply-status.mjs:102` sorted files with `a.stem.localeCompare(b.stem)` and
resolves duplicate node ids **last-writer-wins** (`:245`). The comment at that
branch states the intent — *"across waves that is intended (wave 7 supersedes
wave 5)"* — and it was true for eight waves. `localeCompare` is lexicographic:

```
"status.wave10.x".localeCompare("status.wave9.x")  ===  -1
```

The real order was **10, 2, 3, 4, 5, 6, 7, 8, 9**. Waves 2–9 stayed correct
relative to each other, which is exactly why nothing caught it for eight waves,
and **wave 10 alone fell below all of them** — so under last-wins every earlier
wave would overwrite it.

Re-derived with `bp.mjs`'s own `parseRowKey` / `splitStatusLine` /
`normaliseStatus` across 151 status files:

| | |
|---|---:|
| nodes carrying a wave-10 id-keyed row | 520 |
| — registry winner would come from an OLDER wave | **471** |
| — …and the status actually differs | **189** |

Two lanes measured the same class independently — 471/189 with the same parser,
458/184 with a hand-rolled regex — so the effect is real and the figure is ±5%.

★ **The damage concentrates on exactly the work meant to correct stale
verdicts.** The overwrite rate tracks how much prior coverage a lane's frames
already carried, so a re-audit lane takes it by construction: one such lane had
**69 of 69 rows overwritten, 33 differing, and every one of the 33 an unblocking
reverted to the `blocked-on-backend` it was correcting.**

**Fixed** (`8b4134b`): sorted by parsed generation, mirroring `coverage.mjs`'s
`genOf()`. Verified precisely targeted — the relative order of every non-wave10
file is byte-identical before and after, wave 10's internal order is unchanged,
and legacy files are generation 0, which they effectively already were.

The self-test **asserts the order we want, not the order found**, and includes
**wave 100 against wave 99**, because fixing the boundary that bit you and
leaving the next one is how a class returns. Reverting the comparator fails
exactly the three two-digit cases and passes the other three — independent
confirmation that waves 2–9 were always ordered correctly.

`validate-wave7.mjs` inherited the same lexicographic order for the file list
behind its "already claimed by" message, which names a *survivor*. Within one
wave it was accurate; under `--all` it would have named the wrong one. Mirrored.

### The finding that reframed it: the apply could not run — ✅ now cleared

Running the writer to produce a before/after delta, it **refused**:

```
REFUSING TO WRITE registry.json — 497 malformed status row(s)
  status.figma-unblock.predict.tsv   288
  status.figma-unblock.launch.tsv    209
```

Run against the wave-10 **baseline** commit it refused identically (495 errors,
same two files). **So the inversion never actually damaged `registry.json` — the
atomic refusal had been standing in front of it the whole time**, and the
registry was stale rather than corrupted.

The 497 was token-level; the real defect was **25 rows**: 20 using column 6 as a
method field (`MEASURED 2026-09-01 at LEAF depth: …`, every word becoming a bad
`<width>=<verdict>` token, 490 of the 497) and 5 carrying an invalid column-2
status (`note` ×2, `out-of-lane` ×2, `conflict` ×1). Every row had exactly six
fields, so it was never stray tabs.

★ **Nobody had been shown it.** The gate lanes run defaults to the current wave,
and both files are legacy. `validate-wave7.mjs --all` surfaces it in seconds, and
a wave close should include one full-scope run.

**Both files were cleared during the wave** and the writer now exits 0.

### ✅ The apply was then run, and the sort fix measured rather than predicted

| | |
|---|---:|
| frames whose registry status the apply changed | **297 of 3,776** |

Isolating the sort fix — the **same** starting registry, both comparators:

| | |
|---|---:|
| frames the two runs disagree about | **187** |
| **★ `done` verdicts the fix RESTORES** | **40** |

Against the **189** predicted from the status files with `bp.mjs`'s parsers
before either run. Predicted 189, observed 187: the counterfactual held.

> ### ★★★ AND THE TWO LEDGERS NOW AGREE
>
> ```
> in-scope frames the registry can address : 1862
> AGREE with coverage.mjs                  : 1860
> disagree                                 :    2   (unknown vs partial)
> not addressable at all                   :   52   (Direction A, exactly)
> ```
>
> **1,860 of 1,862.** For the first time in this programme's recorded history the
> writer's ledger and the tally's ledger say the same thing about essentially
> every frame, and the residue is exactly the 52-frame drift class — which is a
> harvest problem, not a resolution one.

> ### ★★★ THREE CONSECUTIVE WAVES, AND IT IS NOW A PROPERTY, NOT AN INCIDENT
>
> WAVE7 §10/§14, WAVE9 §2, and now this: **the damaged artefact is
> `registry.json`; the published number is not.** This wave states it in its
> strongest form yet — the registry is not merely drifting, it is **unwritable**,
> and parity is still exactly right, because `coverage.mjs` builds its
> denominator from `live/*.tsv` and reads `status.*.tsv` directly. The percentage
> has never passed through the registry.
>
> The corollary is the useful part: **`registry.json` being wrong is never a
> reason to doubt the percentage, and the percentage being right is never
> evidence the registry is sound.** They are independent, and each has now been
> mistaken for the other.

---

## 8. HOUSEKEEPING AND CARRIED FORWARD

- **`rollupOnly` reached 0** (baseline 2), and **`conflicts` fell 49 → 39**.
- **169 of the 182 Direction-B ghosts remain unprobed**, and the interior finding
  gives that class a mechanism but **no count**. See §1.
- **18 of the 19 `not-top-level` ids are unprobed.** Each needs one
  `getNodeByIdAsync` call; the validator's hint narrows 11 of them.
- ⛔ **`apply-status.mjs` cannot write, and 25 rows in two legacy files are the
  reason** (§7.5). Not fixed here: they are not this lane's files. This is the
  first thing to clear at wave close, before anything else about the registry is
  discussed.
- **A stray `--help` file sits untracked in the catalog directory**, left by a
  malformed command, alongside `h2cur.tmp.mjs` and `h2scan.tmp.mjs` from a lane.
  Harmless — none matches a status glob — but it is debris.
- ★ **"Fold into the ancestor" needs a third branch**, contributed by
  `w10-predict-detail` after resolving both its unaddressable ids live. Before
  folding, **check what the ancestor's row already carries**. Both its nodes were
  interior, and they took different fixes: one had a *top-level twin* at the same
  size, so it was re-keyed and re-measured end to end, keeping the numbers
  attached to a node that describes them; the other's ancestor was a whole
  **page** frame already keyed by five files, so folding upward would have
  superseded a much richer verdict with a narrower one — **destroying information
  to gain addressability**. Its numbers went into a same-tier top-level sibling
  instead. Order of preference: top-level twin → same-tier sibling → ancestor.
- **`audit-oracle-tests.mjs` still selects by filename** (`*.figma.test.tsx`) and
  **only under `src/`**. §4 shows what that misses. It was left alone because it
  is a triage tool nobody quotes, but it should take `oracle-census.mjs`'s
  population.
- **A type-only import can be broken and green.** Reported by `w10-predict-detail`:
  a new oracle imported `@/types/predict`, which does not exist. `import type` is
  erased at transpile, so the runtime suite passed *and* vitest's own typecheck
  line stayed clean. Worth a guard.

### My own slips, recorded

1. **I wrote a real status file into the shared catalog directory** —
   `status.wave99.__hintprobe.tsv`, to prove the ancestor hint fires. It existed
   about a second and is removed (verified 0 remaining), but `coverage.mjs` and
   `apply-status.mjs` glob that directory, so a transient status-shaped file can
   land in another lane's read. The self-tests drive `checkLines` in memory for
   exactly this reason and I should have done the same.
2. **My row checker invented nine defects** before finding any real one (§5.5).
3. **I merged `--histogram`'s stderr into its stdout** with `2>&1` and then could
   not parse the JSON. The tool was right: a comment at `coverage.mjs:892` says
   stdout is a JSON document and nothing else may land on it, because a trailing
   human summary had already made it unparseable once.

---

## 9. THE METHOD NOTES WORTH KEEPING

Most came from this wave's own mistakes.

1. **An error message is part of the tool's behaviour, and a wrong one destroys
   data.** The gate's single message covered four different situations, and in
   200 of 220 rows its advice — re-key or delete — would have removed correct
   measurements. Splitting the message was worth more than any measurement I made.
2. **When a fix and its test can both be reverted, test the test.** Reverting the
   split alone was caught; reverting the split *and* the exit-worthiness assertion
   went 13/13 green. A mutation applied to the assertion is what proves the
   assertion is load-bearing rather than decorative.
3. **Derive fixture data from the live source at run time.** A hardcoded node id
   in a fixture rots into a MISSED under a label still claiming to test the
   branch. And an empty bucket must print SKIPPED and FAIL, not vanish quietly
   from the suite.
4. **A checker that guesses invents defects.** Resolving a cited basename to the
   first of 117 matches produced a specific, confident, false finding. Refuse to
   guess and print the refusals.
5. **A class-literal grep cannot tell you whether a fix landed.** It misses token
   spellings (`rounded-xl` is 16 here) and it cannot tell code from a comment.
   Both errors, opposite directions, one sweep.
6. **A non-zero exit has not told you the run happened.** Six batches "failed"
   with zero tests run, because the reporter name did not exist.
7. **Two tools can resolve the same conflict differently.** `apply-status.mjs`
   takes the later filename; `coverage.mjs` takes newest-generation-then-worst-of.
   On a contested frame they picked different winners, and a reader checking
   either one alone would have seen agreement.
8. **Say what you probed and stop.** One interior node is confirmed. It is a
   mechanism for the 182, not a measurement of them.
9. **Recompute the baseline with the instrument, not from the brief.** Extracting
   the wave-start commit and running the same binary reproduced all seven buckets
   exactly, which is what makes every delta in §2 a measurement rather than a
   subtraction between two differently-produced numbers.
10. **A comment stating an invariant is not a test of it.** The supersession
    order was documented in prose at the branch that depended on it, and prose
    does not fail. Eight waves later the sort inverted underneath it and the
    comment went on asserting the opposite of the behaviour.
11. **Assert the order you want, not the order you found.** A test written by
    observing `localeCompare`'s output would have pinned the defect permanently.
    And fix the *next* boundary in the same pass — the wave-100 case costs one
    line and is the whole difference between fixing a bug and fixing a class.
12. **Run the tool before reporting what the tool would do.** Everyone in this
    wave, myself included, reasoned about the damage the sort inversion had done
    to `registry.json`. Actually running the writer showed it had done none,
    because the atomic refusal has blocked every write for at least a wave. The
    real finding was one layer down and nobody would have reached it by reading
    the sort line more carefully.
13. **A default-scoped gate hides everything outside its scope.** The two files
    blocking every apply are legacy, and the validator lanes run defaults to the
    current wave. `--all` surfaces them in seconds. A wave close should include
    one full-scope run, or the population the gate never looks at grows quietly.
14. **A type-only import can be broken and green.** Reported by a lane: an oracle
    importing a non-existent `@/types/predict` passed its runtime suite *and*
    left vitest's typecheck line clean, because `import type` is erased at
    transpile.
