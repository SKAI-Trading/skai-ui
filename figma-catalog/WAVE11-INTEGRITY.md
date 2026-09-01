# Wave 11 — catalog integrity

Written by the `w11-verify` lane. Its job is to stop the wave lying, to keep the
gate from eating correct work, and to compute the percentage with the uncertainty
stated rather than hidden.

Every number carries its denominator. That rule is inherited from
`WAVE9-INTEGRITY.md` and `WAVE10-INTEGRITY.md`, and it is still the one that
produces the findings, because the dominant failure here is not a checker that
says "wrong" — it is a checker that says something confident about a population
nobody sized.

**Snapshot point:** catalog HEAD `d5e3067`, 21 wave-11 files, 455 wave-11 rows.
Lanes were still writing. Everything below is "as measured at close of this
lane's work", not a frozen wave total.

> **Re-read after `7a0a3c8` (games-zero-a landed Chicken rows while this file was
> being written): parity unchanged at 340/1,914 = 17.76%; built-at-all moved one
> frame to 1,423/1,914 = 74.35%; the nine zero-parity pages are unchanged at 2 of
> 9 moved.** Chicken's eight new rows produced no `done`. Every headline below
> survives the re-read, which is the reason to do it rather than assume.

---

## 1. ★★★ THE GATE HAS BEEN ANNOUNCING A WAVE-WIDE WRITE BLOCKER THAT DOES NOT EXIST

`validate-wave7.mjs --all` closed every run with:

> `❌ 142 row(s) would make apply-status.mjs REFUSE TO WRITE registry.json — for EVERY lane`

**It would not. Not one of them.**

### The writer's actual refusal condition, read out of the writer

`apply-status.mjs` refuses on exactly one thing: `bpErrors.length`. That array is
appended in three places and there is no fourth.

| # | condition | where |
|---|---|---|
| 1 | `normaliseStatus(row.status) === null` — column 2 is not a row status | `:264` |
| 2 | `row.extra.length` — a TAB inside the reason prose | `:273` |
| 3 | `parseBpCell(row.bpCell).errors` — column-6 grammar | `:276` |

The "a `done` with no digits" rule exists **only in the validator**. It is this
programme's quality bar, and it was being reported in the writer's voice.

### How many of the 142 the writer rejects

| | |
|---|---:|
| rows printed under the ❌ banner (`--all`, 171 files, 8,149 rows) | **142** |
| — of those, the no-digit `done` rule | **142** |
| — unrecognised column-2 status | **0** |
| — column-6 grammar | **0** |
| — stray tab in the reason | **0** |
| **rows `apply-status.mjs` actually rejects** | **0** |

Measured three ways, agreeing: `apply-status.mjs --dry-run` exits **0** and
prints no `REFUSING TO WRITE`; the real run exits 0 and writes `registry.json`;
and the banner's own 142 lines all carry the substring `NO DIGITS`.

> ★ **Two lanes reported this as blocking the wave and the integrity lane acted
> on it.** That is the cost. A gate that cries wolf teaches the reflex of reading
> past it, and reading past a red `--all` is exactly how the genuine refusal
> cleared at `131ab4f` sat unnoticed for over a wave. The same instrument
> produced both failures within two waves, in opposite directions.

### What the message does now

The rule moved to its own `quality` accumulator with its own words — *"this
`done` carries no measured numbers; it is counted in parity and should be
re-measured or demoted"* — plus an explicit line saying `apply-status.mjs` writes
`registry.json` regardless. `--all` now ends with
`✅ nothing here would stop apply-status.mjs writing registry.json.`

### ★ Pinned by CHANNEL, not by exit code

The self-test asserts which accumulator holds the message, by name. Exit-worthiness
alone could not pin this: a later edit could make the no-digit rule non-exit-worthy
and leave it in `errors`, and the banner would go on telling every lane the wave is
blocked.

Four mutations, each a suppression, run against a copy (`.validate-mutant.mjs`,
removed after; it matches no status glob). Anchors verified landed with a
single-quoted `grep -c -F`:

| mutation | self-test | exit |
|---|---|---|
| **m1** — the no-digit rule pushed back into `errors` (the fix reverted) | **15/16** — killed the pin | 1 |
| **m2** — the same-wave/cross-wave collision split suppressed | **15/16** — killed the collision fixture | 1 |
| **m3** — the channel assertion suppressed, fix left in | 16/16 | 0 |
| **m4** — ★ m1 **and** m3 together (fix and assertion both reverted) | **15/16** — still killed | 1 |
| restored | **16/16**, both controls clean, 0 SKIPPED | 0 |

★ **m4 is the one worth keeping.** WAVE10 §1's seventh run found that reverting a
fix *and* its assertion together went fully green, leaving the split decorative.
Here it does not: `wantExit: false` catches the revert independently of the
channel assertion, so the pin is held twice. **m3 surviving is correct, not a
gap** — with the fix in place nothing is in the wrong channel, so removing a
check that only fires on a regression changes nothing. A mutation that a correct
program survives is not a missing test.

### ⚠️ And the exit code, stated plainly so it can be overruled

The quality warnings are **not exit-worthy**. That is a deliberate trade and it
has a cost: a lane can write a no-digit `done` and the gate stays green on that
account. Two things make it the right call today — §2 shows the rule is far too
weak to be a bar, and 0 of the 142 sit in wave-11 files, so nothing is being
waved through. The banner prints a per-file breakdown and calls out any offending
row that is in the current wave's files as new debt. **If the wave wants new debt
blocked, that is one line and a deliberate decision, not a default.**

---

## 2. ★★★ THE NO-DIGIT RULE IS A FLOOR, AND THE REAL POPULATION IS AT LEAST TWICE THE BRIEF'S 142

`WAVE11-BRIEF` §2 calls the 142 "the biggest single target". Two measurements say
the target is both **larger** and **somewhere else entirely**.

### 2.1 The 142 decide nothing

Method: take the frame population and its resolved verdict from
`coverage.mjs --frames` — the same `worst` the percentage is tallied from — then
reproduce only the row-keying and generation rule, and **prove the reproduction
by checking it reproduces coverage's own verdict on every frame**. It does:
**1,914 of 1,914.** Then remove each row and re-resolve.

| | |
|---|---:|
| no-digit `done` rows, all 172 status files, 8,241 rows | **142** |
| — key no frame in the parity population at all | **98** (84 bare family key, 14 an id no frame matches) |
| — key a frame but are superseded by a later generation on every frame they key | **44** |
| **— rows whose removal changes any frame's resolved verdict** | **0** |

**Removing all 142 tomorrow would move parity by exactly 0.00pp.** The gate
reports every row that trips a rule, including rows no consumer reads; it does
not distinguish *"this row is wrong"* from *"this row matters"*.

> ⚠️ **The detector is not vacuous.** The same removal test over wider
> populations: of 1,664 `done` rows, **378 decide** a frame's verdict; of 8,241
> rows, **1,122 do**. A 0 from a detector that answers 0 for everything is not a
> measurement.

### 2.2 ★ The class the rule cannot see, and it is the one that costs parity

`\d` cannot tell a measurement from a citation. Strip node ids and dates from
every `done` reason and ask whether a digit survives:

| | |
|---|---:|
| `done` rows with no digits at all (what the gate reports) | 142 |
| **`done` rows whose digits are ALL node ids or dates** | **155** |
| **the crude population together** | **297** |

And that 155 is still a **lower bound**, because the worst instance found this
wave is not in it. `status.wave4.row-conflicts.tsv` holds **94 `done` rows**
whose reason is a supersession argument —
`[SOCIAL-SUPERSEDED] [scope:in-scope] [was: done vs partial] WRONG ROW: status.social.tsv:1 …`
— whose digits are *file line numbers*. Not node ids, not measurements, and
invisible to both rules.

Its cost, measured at close:

| | |
|---|---:|
| `done` rows in `status.wave4.row-conflicts.tsv` | 94 |
| — that DECIDE a frame's resolved verdict today | **9** (Trade 2 7, Social 1, Blackjack 1) |
| frames resolving `done` with one of its rows in their newest generation | **17** |

★ **This is the mechanism the Blackjack lane hit**: generation-4 boilerplate
outranks generation-3 measurement under newest-generation-first resolution, so a
scope argument silently becomes the page's verdict. Blackjack fell
**81.3% → 56.3%** when 7 such rows were re-measured — and 1 of that file's rows
still decides a Blackjack frame.

> ### ⛔ The correction the next brief needs
> **"142 legacy no-digit `done` rows" is the wrong target on both axes.** The
> rows it names change nothing, and the rows that do change something are a
> different, larger, differently-shaped population that the rule cannot see.
> Nine `done` frames in today's published number stand on a single file whose
> reason column is an argument about which row wins.

---

## 3. THE SECOND FALSE BLOCKER, SAME ROOT — 3,949 LINES OF INTENDED BEHAVIOUR REPORTED AS DEFECTS

Under `--all` the gate also printed **4,071 rows "would apply to ZERO frames"**
and exited 1. Of those, **3,989 were `already claimed by`** — and

| | |
|---|---:|
| collisions where the two rows are in DIFFERENT waves | **3,949** |
| collisions where the two rows are in the SAME wave | **40** |

A cross-wave collision is the supersession `apply-status.mjs` sorts by generation
in order to perform; its own comment at that branch calls it correct — *"across
waves that is intended (wave 7 supersedes wave 5)"*. The case it calls a defect is
two lanes of one wave, where filename order rather than evidence decides.

Cross-wave collisions are now counted, listed under `--verbose`, and not
exit-worthy. Same-wave keeps the exit. **The `--all` log went from 4,232 lines to
160**, which is the difference between a report someone reads and one they scroll
past to find the ❌.

Of the 40 same-wave collisions, 32 are the `status.governance.tsv` /
`status.governance-vaults.tsv` provenance halves the writer's own comment already
names as harmless, and one is a file colliding with **itself** — a duplicate node
id inside `status.wave5.discover-createtoken.tsv`.

> ### ★ ACTIONABLE NOW — 8 live cross-lane collisions in wave 11
> `status.wave11.social-blocked.tsv:59-66` and `status.wave11.predict-dash.tsv:30-37`
> claim the same eight node ids: `3624-51447`, `10636-101271`, `10637-195039`,
> `10637-195507`, `10657-221494`, `10657-227941`, `10657-228292`, `3631-56793`.
> `apply-status.mjs` takes the later filename — `social-blocked` — silently.
> This is WAVE10 §6.2 recurring and it needs the two lanes to adjudicate, not a
> tool to resolve.

---

## 4. THE NUMBERS

Baseline recomputed with the **same instrument** over the wave-11-start commit
(`9b2bc12`, extracted with `git archive`) rather than quoted from the brief.

> That run reproduces the brief field for field — `done 314 · partial 1102 ·
> not-started 233 · blocked 87 · frame-defect 83 · furniture 43 · unknown 52 =
> 1914`, parity 16.41%, built 73.98%. **The baseline is confirmed, not restated.**

> ### At measured parity — `done` / genuine
> ## 340 / 1,914 = **17.76%**  (baseline 16.41%, **+1.35pp**)
>
> ### Built at all — (`done` + `partial`) / genuine
> ## 1,422 / 1,914 = **74.29%** floor  (baseline 73.98%, **+0.31pp**)
>
> ### The band
> ## **74.29% – 76.80%**, width **2.51pp**  (baseline 2.72pp)

The seven buckets still exactly partition the denominator:
`done 340 · partial 1082 · not-started 228 · blocked 73 · frame-defect 100 ·
furniture 43 · unknown 48 = 1914`, with `liveOnly` drift 0 and `rollupOnly` 0.

### 4.1 Promotions and demotions, separately

A rollup delta is a NET. Diffed frame by frame between the two `--frames` dumps.

| | |
|---|---:|
| in-scope frames, both dumps | 1,914 (0 present in only one) |
| frames whose resolved verdict CHANGED | **133 of 1,914** |
| **★ PROMOTIONS to `done`** | **50** |
| **★ DEMOTIONS from `done`** | **24** |
| net | +26 |

> ★ **50 against 24 is the healthiest ratio the programme has recorded.** Wave 10
> ran 39/3, and its own report flagged that as re-verifying too little; wave 9 ran
> 6/8. Twenty-four demotions is a wave holding its bar on work it had already
> banked.

The full transition table:

```
 47  partial            -> done
 18  done               -> partial
 12  not-started        -> partial
 11  partial            -> frame-defect
 10  blocked-on-backend -> partial
 10  blocked-on-backend -> not-started
  6  not-started        -> blocked-on-backend
  4  done               -> frame-defect
  4  unknown            -> not-started
  3  not-started        -> done
  2  done               -> unknown
  2  partial            -> not-started
  2  unknown            -> frame-defect
  1  unknown            -> partial
  1  partial            -> unknown
```

`frame-defect` rose 83 → 100, and 11 of those came out of `partial` — design work
being separated from engineering work rather than left ambiguous.

### 4.2 Per surface

| page | gen | done base → now | parity base → now |
|---|---:|---|---|
| Social | 402 | 35 → **48** (+13) | 8.7% → **11.9%** |
| Trade 2 | 375 | 36 → **35** (−1) | 9.6% → **9.3%** |
| Play | 269 | 40 → **37** (−3) | 14.9% → **13.8%** |
| Predict | 254 | 24 → **25** (+1) | 9.4% → **9.8%** |
| Wallet 2 | 159 | 115 → **124** (+9) | 72.3% → **78.0%** |
| Home 2 | 138 | 14 → **19** (+5) | 10.1% → **13.8%** |
| **Blackjack** | 16 | 13 → **9** (−4) | 81.3% → **56.3%** |
| **Plinko** | 10 | 0 → **3** | **0.0% → 30.0%** |
| **Limbo** | 9 | 0 → **3** | **0.0% → 33.3%** |
| Privacy and Terms | 6 | 6 → 6 | **100.0%** |

Unchanged and omitted for space: Coinflip 11.8%, Dice 13.0%, Darts 5.6%, Keno
5.6%, Scratchers 21.4%, Crash 46.2%, Bingo 15.4%, Baccarat 30.8%, Slide 15.4%,
Mines 25.0%, Price Grid 25.0%.

### 4.3 ★★★ TWO OF THE NINE ZERO-PARITY PAGES MOVED — THE FIRST IN THREE WAVES

> ## **2 of 9.**  Plinko 0 → 3, Limbo 0 → 3.

Wave 9 recorded 0 of 11 and wave 10 recorded 0 of 9. **Chicken, Towers, Fortune
Wheel, Roulette, Video Poker, Rock Paper Scissors and Hi-Lo are still at zero** —
seven pages that have never banked a measured frame.

### 4.4 Did Blackjack or Wallet 2 finish?

> ## **Neither, and Blackjack moved backwards.**

- **Blackjack: 13/16 → 9/16.** The brief called it "3 FRAMES FROM FINISHING". It
  is now seven, because four of the thirteen were not measurements (§2.2). Named
  individually: `9003-118852`, `9003-119356`, `9003-119858` and `9178-10465`, all
  `done → partial`. **This is the wave's single most valuable result** — the
  nearest-to-finished page was the one standing on the weakest evidence, and
  "nearly finished" is exactly the condition under which nobody re-checks.
- **Wallet 2: 115/159 → 124/159 (78.0%).** Nine promotions, no demotions. Its
  ceiling is 96.86%, not 100%.
- **Privacy and Terms 6/6 remains the only finished page.**

Demotions by page: Play 15, Predict 4, Blackjack 4, Trade 2 1. Play and Trade 2
both fell in `done` while rising in re-classification — a page being read
honestly, not a page regressing.

---

## 5. THE GATE AT BOTH SCOPES, AT CLOSE

WAVE10 §9.13: a default-scoped gate hides everything outside its scope.

| | current wave (default) | `--all` |
|---|---:|---:|
| files | **21** | **172** |
| rows | **455** | **8,241** |
| would block the writer | **0** | **0** |
| exit | 1 | 1 |
| log lines | 24 | **160** (was 4,232) |

Both exits are 1 and **neither is a write blocker**. Default: the 8 wave-11
cross-lane collisions of §3. `--all`: those plus 32 legacy same-wave collisions,
33 rows whose column 1 addresses nothing, 29 section rollups and 20 ids no
top-level harvest carries — every one a pre-existing legacy class.

★ **The file count is 172, not the 151 the brief quotes.** The writer and the
validator use the same `readdirSync` glob and both see 172. A brief's tooling
facts rot inside the wave just as its code facts do.

`apply-status.mjs`: **exits 0, 8,208 status lines loaded, 2,996 frames updated**
(2,558 by node id, 438 by family). Self-test 6/6 ordering cases, control ok. The
registry was never written by this lane — every run was `--dry-run`, and
`git status` confirms `registry.json` untouched.

---

## 6. THE COMMENT RULE — THREE READ SITES, TWO ANSWERS, NOW ONE

`coverage.mjs:247` and `:281` tested `startsWith("#")` at column 0;
`coverage.mjs:322`, `apply-status.mjs:256` and `validate-wave7.mjs:300` tolerate
indentation. An indented `#` was a comment to three readers and a data row to two.

All three sites in `coverage.mjs` now route through one `isCommentLine`, pinned by
a `--self-test` (6/6) that runs before any file is read. Reverting the predicate
to column 0 fails 2 of the 6. `--histogram` output is **byte-identical** before
and after (7,799 bytes both).

> ⚠️ **Say what this is and is not.** Measured: **zero** indented `#` lines exist
> across 171 status files, 39 `*.titles.tsv` and the two index files — and both
> strict sites feed their value through a `^\d+-\d+$` test that no line beginning
> with `#` can pass. **The divergence has never produced a wrong number.** This is
> a latent defect removed, not a live one fixed, and the honest framing matters:
> the brief's *"a data row to two"* is true of the code and not yet true of any
> data.

---

## 7. MY OWN SLIPS, RECORDED

1. **My first cross-check reported three false findings, and the proof caught
   them.** The reproduction disagreed with `coverage.mjs` on three Social frames.
   The cause was not my rule: a lane wrote `status.wave11.social-live.tsv` at
   11:01:35, **two and a half minutes** between my `--frames` snapshot and my
   analysis of it. Re-run back to back: 1,914 of 1,914. ★ **A shared-tree
   snapshot goes stale in minutes, and the only reason this did not become three
   reported defects is that the script refuses to report unless it first
   reproduces a known answer.** Build the proof before the finding.
2. **I concluded the source files were LF from a mangled render.** `cat -A` piped
   through a `sed` that stripped the `$` showed no `^M`, so I wrote multi-line
   mutation anchors with `\n` — against CRLF files. Three of four mutations
   reported "DID NOT LAND", which reads as a fact about the code and was a fact
   about my anchor. A direct `s.includes("\r\n")` settled it in one call. ★ The
   abort was right: a mutation script that cannot verify its own edit landed must
   refuse, or "no change" reads as a passing mutant.
3. `grep -P` is unavailable in this shell's locale (`-P supports only unibyte and
   UTF-8 locales`) and fails loudly; `grep -iF` fails silently. Both were hit.

---

## 8. CARRIED FORWARD

- ⛔ **8 cross-lane collisions between `w11-social-blocked` and `w11-predict-dash`
  are unadjudicated** (§3). `social-blocked` wins on filename alone.
- ⛔ **`status.wave4.row-conflicts.tsv` still decides 9 `done` frames** with a
  reason column that is a supersession argument (§2.2). Trade 2 7, Social 1,
  Blackjack 1. This is the highest-value re-measurement target in the catalog and
  it is invisible to every automated rule now in the tree.
- **The registry drift is unchanged for a fourth wave**: 16 registry-gap rows in
  wave-11 files, 245 across all files on 79 nodes. Neither direction moves the
  percentage.
- **A duplicate node id inside `status.wave5.discover-createtoken.tsv`** — one row
  in a file colliding with another row in the same file.
- **`--help`, `h2cur.tmp.mjs`, `h2scan.tmp.mjs` are still untracked debris** in
  the catalog directory, carried from wave 10. None matches a status glob.
- **A "quality" gate that no longer exits is only as good as the report that
  carries it.** If nobody reads §2, the 297 rows stay. That is the trade this
  wave made deliberately; revisit it if the number does not fall.

---

## 9. THE METHOD NOTES WORTH KEEPING

1. **An error message is a claim, and a claim about another program must be
   checked against that program.** The gate spent at least a wave asserting what
   `apply-status.mjs` would do, in `apply-status.mjs`'s voice, about 142 rows it
   accepts without complaint. Reading the writer took ten minutes and no amount
   of reasoning about the validator would have reached it.
2. **A warning count is not a work count.** All 142 rows trip a rule; **0** change
   any published number. A gate that cannot separate "wrong" from "matters"
   produces both a false blocker and a false target.
3. **Pin the channel, not just the exit code.** A message can be made
   non-exit-worthy and still print under a banner that terrifies nineteen lanes.
   Asserting *which accumulator holds it* is what a regression would change.
4. **Test the test, and be pleased when it is redundant.** Reverting the fix and
   its assertion together still failed here, because exit-worthiness holds the
   pin independently. Wave 10 ran the same experiment and went green.
5. **A surviving mutation is not automatically a gap.** Removing a check that only
   fires on a regression changes nothing while the code is correct. Say which
   kind you have.
6. **Prove the reproduction before reporting from it.** Reproducing another tool's
   resolution rule is how a lane once landed 402 frames off. Making the script
   exit 2 unless it reproduces `coverage.mjs` frame for frame turned a live
   mid-measurement write into a caught anomaly instead of three false findings.
7. **`\d` is not a measurement detector.** The rule the whole brief was built on
   is blind to a reason dense with node ids or file line numbers, which is where
   the parity actually leaks. Search for the behaviour — a `done` standing on an
   argument — not the shape you already know.
8. **Reporting intended behaviour as a defect is the same failure as missing
   one.** 3,949 lines of correct supersession buried 40 real collisions and made a
   4,232-line report unreadable.
9. **The nearest-to-finished surface is the least re-checked.** Blackjack was "3
   frames from finishing" and was the page standing on the weakest evidence.
   81.3% → 56.3%.
