# Wave 9 — catalog integrity

Written by the `w9-verify` lane. Its job is to stop the wave lying and to compute
the percentage with the uncertainty stated rather than hidden.

Every number below carries its denominator. That is the rule that produced this
file: the dominant failure mode in this catalog is not a checker that says
"wrong", it is a checker that says "fine" about a population nobody sized.

> ## ⛔ READ §1 FIRST. The wave's output was destroyed mid-run and most of it is
> ## not recoverable. Nothing else in this file matters until that is understood.

---

## 1. ★★★ THE WORKING TREE WAS WIPED AT 04:44 AND TOOK THE WHOLE WAVE WITH IT

This is not a measurement defect. It is data loss, it happened during the run,
and it is the reason the wave-9 numbers below are what they are.

### The timeline, measured

| time | state |
|---|---|
| 04:37 | `validate-wave7.mjs` reads **18 files, 212 rows**. Normal. |
| 04:41 | `coverage.mjs --histogram`: genuine 1,914, **done 292**, partial 1,165. |
| 04:44 | `figma-catalog/` holds **2 files**. `modules/skai-ui/.git` is GONE. `ls figma-catalog/*.mjs` → 0. |
| 04:44 | `git submodule status modules/skai-ui` → `-c7830899…`. The leading `-` = DEINITIALISED. |
| 04:45–04:49 | lane TSVs reappear one at a time — lanes rewriting their own files, not a restore. |
| 04:50 | tree restored from the object store. **384 of 384 tracked files back**, verified by diffing HEAD against disk. |

The wipe was scoped to `figma-catalog/` plus the `.git` link. The rest of
`modules/skai-ui` (`src/`, `package.json`, `node_modules`) was untouched.

### ★★★ WHAT WAS ACTUALLY LOST: EVERY WAVE-9 ROW, BECAUSE NONE WAS EVER COMMITTED

Checked in the object store, not inferred. `HEAD` (`bf7ef9b`, 04:19:01) carries:

| wave | committed status files |
|---|---:|
| 2 | 13 |
| 3 | 9 |
| 4 | 10 |
| 5 | 9 |
| 6 | 9 |
| 7 | 10 |
| 8 | 20 |
| **9** | **0** |

**All 18 wave-9 lane files were untracked working-tree files.** Waves 2 through 8
are tracked and were restored intact. Wave 9 was not tracked and is gone.

The only surviving record of what existed is the 04:37 validator run:
**18 files · 212 rows · done 19 · partial 109 · frame-defect 26 ·
blocked-on-backend 48 · not-started 10**, roughly 237 KB of lane output.

Recovery is partial and comes only from lanes rewriting from their own
transcripts. As of the last reading: **6 of 18 lane files present, 214 rows** —
a similar row count over a different population, not the same work.

★ The four files that came back first do not match their pre-wipe sizes:
`social-live` 6577→5136→6921, `social-profile` 7965→5381, `trade2-perp`
4309→10218→26040, `trench-trade` 6262→37170. Some lanes are reconstructing, some
are shorter than before, one is far longer. **A lane that appends to a
part-restored file will double-write or silently drop rows.** Every lane must
re-read its own file before its next append.

### The recovery, and the trap next to it

The object store survived at **`.git/modules/modules/skai-ui`** — note the
doubled `modules`; `.git/modules/skai-ui` does not exist and looking there
reports the repository as gone. Restore is:

```
printf 'gitdir: ../../.git/modules/modules/skai-ui\n' > modules/skai-ui/.git
git --git-dir=.git/modules/modules/skai-ui --work-tree=modules/skai-ui \
    checkout HEAD -- figma-catalog/
```

★ Safe for lane work *specifically because* no wave-9 file is in `HEAD`:
`checkout HEAD -- <path>` writes only paths HEAD carries, so it restores the
tooling and the older waves **around** the surviving lane files without touching
them.

> ⛔ **DO NOT use `git submodule update` for this.** The superproject index pins
> `c7830899`, which is BEHIND the submodule's own HEAD `bf7ef9b`. That command
> would take the tree backwards past two committed catalog commits (`bf7ef9b`
> route-cell corrections, `50cb913` 16 measured rows). They stay reachable in the
> object store, but the tree would not show them.

### ★ The durable lesson, and it is a process one

**212 measured rows sat untracked for four hours.** Waves 2–8 all committed their
TSVs; wave 9 had not committed one. The catalog's own history shows the habit
that protects against this and the wave had simply not got there yet. Lanes
should commit their TSV after the first block of rows, not at the end — the cost
of an extra commit is nothing against the cost of this.

---

## 2. ★★★ THE HEADLINE FINDING: THE PARITY NUMBER WAS NEVER DISTORTED

Three separate reports reached me during this wave saying the registry drift was
corrupting the published percentage — that missing frames "deflate the
denominator and so inflate parity", that phantom `partial` rows "inflate
built-at-all", and that Home 2's 8.0% was "computed over a denominator that omits
the current spec entirely".

**All three are false, and the same single fact refutes them: `registry.json` is
not an input to the parity number.**

### The proof, arithmetic and checkable

`coverage.mjs` builds its denominator from `live/*.tsv` and reads
`status.*.tsv` **directly** (`:308`); it touches `registry.json` only to collect
node ids into a token-filtering set (`:229-230`) that already contains every live
id anyway (`:227`). There is no `kind` filter and no registry lookup on either
side of the fraction.

Measured consequence — the seven status buckets **exactly partition** the live
genuine set:

```
done 288 + partial 1165 + not-started 172 + blocked 101
     + frame-defect 67 + furniture 42 + unknown 79  =  1914
genuine = 1914 · matched = 1914 · liveOnly = 0
per-page byStatus sum == matched on 28 of 28 pages
```

A registry ghost is not in the live harvest, so it is not in that partition.
**A node that does not exist cannot be inside a partition of the set of nodes
that do.** Its `partial` is counted nowhere.

And the other direction, tested on the 22 Home 2 ids reported as "the current
spec, missing":

```
of the 22 ids named: in live harvest 22, IN THE PARITY DENOMINATOR 22, in registry 0
```

All twenty-two are already inside Home 2's `genuine: 138`. Home 2's parity
already accounts for them.

> ### Correcting `registry.json` in either direction changes the denominator by **0** and the numerator by **0**.
> The re-harvest is an **addressability repair**, not a denominator correction.
> That removes the urgency the decision was framed with, and it means no
> percentage in this file moves because of it — in either direction.

### §2.1 Which instrument produces the number, and which one is blind

I was asked to say, if the published percentage comes from the instrument that
cannot see the missing frames, to say so in those words. **It does not, and the
blindness runs the other way.**

| | resolves through | can it see the 52 drifted frames? |
|---|---|---|
| `coverage.mjs` — **produces the percentage** | `live/*.tsv` + `status.*.tsv` | **YES.** All 52 are in its 1,914, and all 52 carry status rows. |
| `validate-wave7.mjs` — gates lane files | `registry.json` → each frame's `.node` | **NO.** This is the instrument with the blind spot. |

Home 2's "138/138 matched, 0 `liveOnly`" is **correct, not reassuring-but-wrong**.
Every one of its 138 frames has a row. The disagreement between the two tools is
real, but the tool that cannot see the frames is the validator, and the validator
does not compute anything anyone quotes.

★ This is the third wave running in which the finding is the same shape:
**the damaged artifact is `registry.json`; the number is not.** WAVE7-INTEGRITY
§10 and §14 both landed there. Anyone reading this file for a headline should
take that as the finding.

---

## 3. THE DRIFT, MEASURED IN BOTH DIRECTIONS

New tool: **`registry-drift.mjs`** (§7). Both directions filtered to the same
in-scope-genuine population `coverage.mjs` counts.

⚠️ The raw diff is not the class. Every live id against every registry node id is
**1,477 of 5,041** and is meaningless — it counts out-of-scope pages, hidden
nodes, loose RECTANGLEs and Screenshot furniture. (A figure of "3,180 of 5,209"
was also circulating; I could not reproduce it and it is in any case the same
unfiltered quantity.)

### Direction A — live but unregistered

| | |
|---|---:|
| In-scope genuine frames | **1,914** |
| — with no registry frame carrying their node id | **52 (2.72%)** |

Unchanged from WAVE7-INTEGRITY §10, which measured the same 52 one wave ago.
**The class has not grown; it has simply not been fixed.**

| Page | missing |
|---|---:|
| Home 2 | 34 |
| Towers | 9 |
| Coinflip | 3 |
| Hi-Lo | 2 |
| Scratchers / Baccarat / Roulette / Slide | 1 each |

### Direction B — registered but not live

| | |
|---|---:|
| Registry frames | 3,776 |
| — node not a top-level child of any harvested page | **206** |
| — of those, on an in-scope page | **182** |
| — of those, carrying a real verdict (not `unknown`) | **35** |

Statuses: `unknown` 147 · `partial` 17 · `furniture` 13 · `done` 2 ·
`frame-defect` 2 · `match` 1. Worst pages: Trade 2 88, Towers 54, Keno 13.

> ⚠️ **"Not live" means "not a TOP-LEVEL child today", which is not the same as
> "deleted".** A re-parented node — still in Figma, now nested under a new frame —
> looks identical from here. Only `getNodeByIdAsync` separates them. **13 have
> been probed live** (7 RPS/Hi-Lo, 4 Towers, 2 Plinko) and all 13 returned null.
> **The other 169 are UNPROBED**, and this number must not be reported as 182
> deleted frames.

---

## 4. ★★★ THE "ONE-LINE DIAGNOSTIC" IS RIGHT ABOUT 34 OF 52 AND WRONG ABOUT 18

The proposed explanation was that `registry.json` has no node id ≥ 13385, so
every frame Figma gained after the 2026-08-18 harvest is invisible. I was asked
to verify the max-id claim rather than accept it. **Verified, and it is
half a mechanism.**

### The true maxima — and they are PER FILE

A node id is unique only *within* a Figma file, and the three tracked files have
independent counters, so a single global cutoff is not even well defined.

| fileKey | registry max major id | registry frames |
|---|---:|---:|
| `mhF3BkzlTaGiLzJ7kvpmVc` | **13346** | 1,636 |
| `3sSzw1KewMtUbeLAv7uW0r` | 11530 | 1,553 |
| `M6r9FEn042UWTQD1zvy6GM` | 10428 | 587 |

So the true global maximum is **13346**, not 13385, and "zero registry frames at
or above 13385" is true only trivially.

### The split, and it is perfectly clean

| file | missing | above that file's own registry max | below it |
|---|---:|---:|---:|
| `mhF3Bkz…` (Home 2 / Trade 2) | 34 | **34** | 0 |
| `M6r9FEn…` (games pages) | 18 | 0 | **18** |

> ★ **The registry already holds id `10428` from the games file and is missing
> `10248`, `10221`, `10215`, `10130`, `10120`.** A harvest-date cutoff cannot skip
> an id *below* one it captured. **Two different mechanisms, on two different
> Figma files.**

The 18 the cutoff cannot explain: Towers `10120-10815 / -10859 / -11748 /
-13193 / -13227 / -13280`, `10130-13627 / -13859 / -15152`; Coinflip
`10215-5078 / -6194`, `10221-6245`; Scratchers `10221-7338`; Hi-Lo `10248-9763`,
`10249-9938`; Baccarat `10250-14407`; Roulette `10250-14562`; Slide
`10250-15144`.

★ **This is why the size had to be measured before anything was fixed.** A repair
built on the cutoff theory — "re-harvest everything ≥ 13385" — closes 34 and
leaves 18, and would report success. It is WAVE7-INTEGRITY §18.8 again: *the loud
failure is not the boundary of the damage.*

### And the two rows that opened the wave were never mis-keyed

`10248-9763` (Desktop, 954x621) and `10249-9938` (Frame 1000004045, 356x621) are
real, visible, in-scope, genuine Hi-Lo frames at depth 1. **9 of 11 depth-1 FRAMEs
on that page resolve fine** — the reported "0 of 11" came from diffing against
`Object.keys(reg.frames)` (which are `<fileKey>:<node>` compounds) instead of
each value's `.node` field. There is no third index; resolution is by node id
alone. `10250-14561` was also reported missing and is furniture — a
`Screenshot 2026-08-2` RECTANGLE, correctly outside the denominator.

⚠️ **Do not re-key or delete those rows. There is no key that would work.**

---

## 5. ★★★ 148 MEASURED ROWS, SIX WAVES, NEVER BANKED

The question was how much earlier-wave work the registry gap has swallowed.
Measured with `bp.mjs`'s own `parseRowKey` / `splitStatusLine` / `normaliseStatus`
— imported, not restated.

| | |
|---|---:|
| Rows scanned across 125 committed status files | 6,977 |
| **Rows addressing one of the 52 unaddressable frames** | **148** |
| Distinct frames covered by at least one such row | **52 of 52** |

By wave: legacy 34 · wave2 5 · wave3 52 · wave4 46 · wave5 2 · wave7 8 · wave8 1.
Verdicts: `partial` 80 · `not-started` 31 · `unknown` 21 · **`done` 8** ·
`blocked-on-backend` 3 · `frame-defect` 3 · `furniture` 2.

Worst files: `status.home-2.tsv` 34, `status.wave3.verify-home2.tsv` 34,
`status.wave4.home-2-reverify.tsv` 34, `status.wave3.verify-games.tsv` 18.

> ★ **But "never banked" needs qualifying, and the qualification is the good
> news.** All 52 frames have rows, so `coverage.mjs` counts every one of those
> verdicts in the published percentage. What is lost is only their presence in
> `registry.json`. **The measurement work was paid for and IS being counted; it is
> the index that never received it.** That is why `liveOnly` drift reads 0.

---

## 6. ★ THE `untitled` POPULATION IS 669, NOT SIX

Asked to check whether `kind: untitled` appears beyond the six Trade 2 InsightX
frames. It does, by two orders of magnitude.

| kind | frames | of 3,776 |
|---|---:|---:|
| `screen` | 1,687 | 44.7% |
| `non-screen` | 1,411 | 37.4% |
| **`untitled`** | **669** | **17.7%** |
| `component` | 6 | 0.2% |
| `scaffold` | 3 | 0.1% |

**All 669 have an empty title.** Sections: `trade-2` 480, `play` 167,
`onboarding` 22. Statuses: `partial` 373 · `unknown` 110 · `not-started` 83 ·
`furniture` 45 · **`done` 40** · `blocked-on-backend` 17 · `frame-defect` 1.

★ They are invisible to a **title-driven** pass, not to an id-keyed one — 40 of
them already carry `done`. This is a discoverability defect, not a coverage hole,
and it is the population WAVE7-INTEGRITY §14 identified as hitting the old
`kind === "screen"` guard (removed in `f81cee7`). The six named Trade 2 frames
are a 0.9% sample of it.

---

## 7. THE NEW ORACLE, AND WHAT IT COST TO MAKE IT NON-VACUOUS

`registry-drift.mjs` — measures both directions, writes nothing.

### It refuses to report before reproducing a known answer

It must restate `coverage.mjs`'s furniture rule (that file exports nothing), and
WAVE7-INTEGRITY §10 records a lane doing exactly that and landing **402 frames
off** on one operator. So the script **spawns `coverage.mjs --histogram` and
exits 2 unless its own live / furniture / genuine counts reproduce coverage's
published ones exactly** — read from that run, never hardcoded, because a checker
that hardcodes a fact about the thing it checks goes stale and stays confident.

```
self-check: my furniture rule reproduces coverage.mjs exactly —
            live 2332, furniture 418, genuine 1914.
```

### ★★★ ITS FIRST SELF-TEST WENT 8/8 GREEN WITH A FIXTURE ASSERTING THE OPPOSITE OF ITS OWN LABEL

The fixture named *"an absent `visible` column counts the node as VISIBLE"*
built `{visible: undefined}` by hand and asserted `furniture === 1` — i.e. that
it counts as **hidden**. It passed, because `classify()` reads `!n.visible` and
`undefined` is falsy.

The operator it claimed to test lives in the **parse** (`visible !== "0"`), which
`measure()` never runs. **A fixture that reaches a different code path from the
one it names is a vacuous green wearing a label.** Fixed by extracting
`parseLiveRow` and driving the fixture through it.

★ This is WAVE7-INTEGRITY §18.3 with the polarity reversed. That lesson was
"a self-test can enshrine a stale belief". This one is: **a self-test can enshrine
a belief that was never true**, and a green suite reads identically either way.

### Mutation-tested — five mutations, each one a suppression

WAVE7-INTEGRITY §18.2: *a mutation that WIDENS a predicate does not test it.*
Every mutation below suppresses a behaviour. Each was confirmed landed with
`grep -c -F` (never `-iF`, which is silently empty in this shell), and the file
was restored and re-verified after each.

| mutation | result |
|---|---|
| `visible !== "0"` → `visible === "1"` (the 402-frame inversion) | **7/8** — killed the parse fixture |
| drop the colon→hyphen normalisation | **6/8** — killed the normalisation fixture |
| stop filtering out-of-scope pages | **7/8** — killed the scope fixture |
| count furniture as genuine | **6/8** — killed the furniture fixture |
| collect `liveAnywhere` only for in-scope pages | **7/8** — killed the false-ghost fixture |
| restored | **8/8, control clean** |

⚠️ **And my restore-verification command was itself broken.** After the restore I
ran a `grep -c -F` with escaped quotes inside a double-quoted `$( )` and got
`original 0, mutant 0` — which reads as "the file is neither". The self-test said
8/8. Re-run with single quotes: `original 1, mutant 0`. **The instrument was
broken, not the restore** — and it failed in the alarming direction, which is the
safer one, but it is the same class as everything else in this file.

---

## 8. THE ORACLE-RED SWEEP — 105 FILES, ONE RED, AND IT IS THE TEST THAT IS WRONG

Prompted by a report that wave-8 `done` rows were standing on code edits never
made. **Every parity/figma-named oracle in the repo was run.**

### The denominator of the glob, stated

`find src modules -not -path '*/node_modules/*'` for
`*figma*.test.{ts,tsx}` / `*parity*.test.{ts,tsx}` (case-insensitive) →
**105 files**, out of 1,113 test files in `src/` + `modules/`. Grouped by which
vitest config owns them, because the root config covers `src/**` and
`modules/skai-gaming/src/**` but no other submodule — a run from the wrong root
collects zero and **exits 0**.

| root | files | collected | tests | red |
|---|---:|---:|---:|---:|
| repo root config | 96 | **96** | 1,466 | **1 test in 1 file** |
| `modules/skai-wallet` | 7 | **7** | 82 | 0 |
| `modules/skai-ui` | 1 | **1** | 21 | 0 |
| `modules/skai-command` | 1 | **1** | 4 | 0 |
| **total** | **105** | **105 (100%)** | **1,573** | **1** |

Collected counts read off the `Test Files N passed (N)` line in every case, and
exit codes taken without a pipe (`REAL_EXIT=`).

⚠️ **My own grep for those summary lines reported skai-command as having
collected nothing.** The line was there; ANSI colour codes sat between
`Test Files` and the count and my pattern missed them. Reading the full log
settled it. *A missing summary line and a grep that cannot match one look
identical.*

### The single red is a DEFECTIVE ORACLE, not an unmade fix

`src/components/home-redesign/whales/activityHeaderTypeRamp.figma.test.tsx:164`
— `expected 3 to be 1`. Its own comment says the three header cells must be
identical *"apart from the per-cell alignment utility appended by `cn`"*. Its
filter is `/(^|:)(text-|leading-|font-|tracking-)/`, and Tailwind spells
alignment `text-right` / `text-center`. Reproduced exactly:

```
cell1 (col-span-2)  : font-manrope leading-[14px] md:leading-4 text-ash text-xs tracking-[-0.04em]
cell2 (text-right)  : … text-ash text-right text-xs …
cell3 (text-center) : … text-ash text-center text-xs …
distinct ramps = 3   (test asserts 1)
col-span-2  -> stripped
text-right  -> KEPT (counted as type ramp)
text-center -> KEPT (counted as type ramp)
```

**The type ramp is byte-identical across all three cells.** The component is at
parity; the filter admits the very utility it claims to strip. The two tests that
read only the `col-span-2` cell pass. And the code edit the row claims **did
land** — `HEADER_CELL` reads `leading-[14px] … md:leading-4` in the working tree.

Not fixed here: it is another lane's untracked file and the owning lane is live.

### The three reported instances did not reproduce

- `sportsbookRadiusParity.test.tsx`, reported `3 failed | 5 passed` continuously
  since wave 8: **8 tests, all passing.**
- `PlayStateCard` — reported green by the reporter themselves before I ran.

So: **0 of 105 oracle files are red for the reason the class was named after.**

> ★ **A red oracle is not evidence of an unmade fix, and this sweep found the
> reverse case.** The stated shape — a doc comment and a test that agree with
> each other and are both wrong about the code — is real and worth guarding. But
> the one red in 105 files is a test that is wrong about code that is right.
> **Both directions exist, and only running it tells you which.**

⚠️ **The glob is name-based and that is its limit.** `PlayStateCard.test.tsx`,
the second reported instance, is not name-matched and was never in the 105.
A complete oracle census would key on *files citing a Figma node id*, not on
filename. Recorded as a known gap, not closed.

---

## 9. THE NUMBERS, RESTATED

### 9.1 The baseline is CONFIRMED, not restated

I was asked whether the 14.32% baseline could be trusted. Recomputed from
committed state (the only state that survived), it reproduces the brief exactly:

```
genuine 1914 · done 274 · partial 1165 · not-started 173 · blocked 118
              · frame-defect 62 · furniture 42 · unknown 80
parity       = 274/1914 = 14.32%
built-at-all = 1439/1914 = 75.18%   ceiling 79.36%   band 4.18pp
live-only drift 0
```

Identical to WAVE9-BRIEF's stated baseline on every field. **The baseline was
sound.** The doubt about it came from the registry-drift theory, and §2 shows
that theory does not touch the number.

★ It also confirms the wave-9 gains were entirely in the untracked files: the
04:41 working-tree reading was **done 292** (parity 15.26%) against a committed
274. **Eighteen promotions existed at 04:41 and do not exist now.**

### 9.2 The current state — and it is BELOW baseline

From `coverage.mjs --histogram`, with 6 of 18 lane files rebuilt:

> ### At measured parity — `done` / genuine
> ## 272 / 1,914 = **14.21%**   (baseline 14.32%, **−0.11pp**)
>
> ### Built at all — (`done` + `partial`) / genuine
> ## 1,443 / 1,914 = **75.39%** floor   (baseline 75.18%, +0.21pp)
>
> ### The band
> ## **75.39% – 79.36%**, width 3.97pp (baseline 4.18pp)

### 9.3 Promotions and demotions, separately

Reported separately because a net figure hides the re-verification.

| surface | done, baseline → now | partial | parity |
|---|---|---|---|
| Social | 20 → **25** (+5) | 241 → 242 | 4.98% → **6.22%** |
| Predict | 25 → **26** (+1) | 169 → 168 | 9.84% → **10.24%** |
| **Trade 2** | 37 → **29** (−8) | 279 → 278 | 9.87% → **7.73%** |
| Play | 35 → 35 | 141 → **151** (+10) | 13.01% |
| Wallet 2 | 113 → 113 | 44 → 41 | 71.07% |

**Promotions to `done`: +6 (Social 5, Predict 1). Demotions from `done`: −8, all
Trade 2.** Net −2.

★ **The demotions are the wave holding its bar, and they survived the wipe while
six of the promotions did not.** WAVE8-BRIEF §3: a wave whose `done` only
increases is a wave re-verifying nothing. Trade 2 losing eight is the same event
as wave 7's 54 → 35 and should be read the same way.

### 9.4 How many of the eleven zero-parity pages got off zero

> ## **0 of 11.**

Dice, Chicken, Crash, Fortune Wheel, Plinko, Limbo, Hi-Lo, Towers, Roulette,
Video Poker and RPS all still read `done` = 0. **No game page moved at all** —
every surface that changed is one of the five in §9.3. Four game lanes
(`games-zero-a/b/c`, `games-cards`) were running and none of their files
survived the wipe.

★ And two of those pages cannot be scored honestly until §3's Direction A is
fixed: Towers is missing 9 of its live frames from the registry and carries 54
in-scope ghosts, so **54 of its 72 registry rows name nodes that are not
top-level today.**

---

## 10. THE DECISION I WAS ASKED FOR: RE-HARVEST, OR PARK

**Park for this wave. Re-harvest at close, with the lanes down.** Reasoning, and
the first point changes the trade entirely:

1. **It is not a denominator correction.** §2 shows both directions move parity
   and built-at-all by exactly **0**. The re-harvest buys addressability — rows
   landing in `registry.json`, ghosts cleared — not accuracy in any published
   figure. Nothing that is quoted to anyone is waiting on it.
2. **It cannot be done from local files at all.** `build-registry.mjs` reads
   `<section>.nodes.txt`, which is itself the stale 2026-08-18 harvest;
   WAVE7-INTEGRITY §10 already established that re-running it against unchanged
   `.nodes.txt` reproduces the same gap. A real fix needs live Figma calls per
   page for ids **and** titles. That is not a step I can sequence safely under
   running lanes.
3. **The tree has just been destroyed once today.** Rewriting the 5 MB artefact
   every lane resolves against, hours after a wipe, while lanes are still
   reconstructing lost files, is the wrong order of operations by a wide margin.
4. **Nothing is lost by waiting.** Every measured number lives in the TSV reason
   column, which is what `coverage.mjs` reads. §5's 148 rows prove the pattern:
   those verdicts are counted today despite never reaching the registry.

### What to do instead, now, and it is cheap

`validate-wave7.mjs` currently exits 1 on a row whose node is real, in-scope and
genuine, with the message *"node X is in NO registry frame — this row applies to
ZERO frames"*. **That message invites a lane to delete or re-key correct work**,
which is precisely how a measured frame leaves the catalog. The file already
contains the right precedent, in its own words, for the family-keyed case:

> *"It is NOT exit-worthy, deliberately: no lane can fix it by editing a TSV, and
> an exit 1 would block every lane over something they did not cause."*

The same reasoning applies here and is not yet applied. The fix is to cross-check
the unresolved id against the live harvest — `registry-drift.mjs` now exports
`loadLiveNodes()` for exactly this, so the validator imports the rule rather than
keeping a second copy of it — and to split the report:

- node **not live either** → the row is genuinely bogus → **exit 1**, as now;
- node **live, in-scope, genuine** → a registry gap the lane did not cause →
  reported loudly, **not exit-worthy**, with "do not re-key or delete this row".

Not applied in this file's session: the validator is the gate 19 lanes run, and
editing it while they run is the same hazard as the re-harvest, at smaller scale.
It is a contained change and it is the single highest-value thing to do before
wave 10.

---

## 11. HOUSEKEEPING AND CARRIED FORWARD

- **A dev server is running on port 8082**, background id `b7vw3ofvh`, left by a
  lane. Not an in-flight lane's work; do not attribute it to one. To be closed by
  the coordinator at wave close.
- **A cross-lane defect report was accurate when sighted and false when acted
  on.** A peer reported `frame-defect` in column 6 of
  `status.wave9.games-zero-c.tsv`. The lane had written it, the validator caught
  it, and it was corrected before the peer's report was read. ★ **A
  concurrently-written TSV can be read in a transient invalid state, so a
  cross-lane defect report needs a re-read at the time of ACTION, not only at the
  time of sighting.** Sibling of `cross-lane-defect-reports-can-be-mutation-echoes`.
- **Direction A is unchanged from wave 7 at 52 frames.** It has now blocked rows
  in two consecutive waves.
- **169 of the 182 in-scope ghosts are unprobed** — deleted vs re-parented is
  unresolved and needs `getNodeByIdAsync`.
- **A complete oracle census keyed on node-id citation, not filename**, is not
  done; the 105-file glob misses at least one file that was reported as an
  instance of the class.

---

## 12. THE METHOD NOTES WORTH KEEPING

Most came from this wave's own mistakes.

1. **Commit the artefact, not just the measurement.** 212 rows across 18 files
   were destroyed because no wave-9 TSV was ever committed, while waves 2–8 —
   126 files — restored intact from the same object store.
2. **Ask which FIELD a consumer reads before diffing against it.** "0 of 11
   frames are in the registry" came from diffing `Object.keys(reg.frames)`
   (`<fileKey>:<node>` compounds) when the resolver reads each value's `.node`.
   The truth was 9 of 11. The same mistake was made twice in one investigation.
3. **A clean-looking cutoff can be half a mechanism.** "No registry id ≥ 13385"
   is true and explains 34 of 52; the other 18 sit *below* their own file's
   registry maximum. A fix built on the cutoff would have closed 65% and reported
   success.
4. **A fixture that reaches a different code path from the one it names is a
   vacuous green wearing a label.** Mine asserted the exact opposite of its title
   and went 8/8.
5. **Verify a mutation-restore with correctly quoted grep.** My check reported
   "neither original nor mutant present" because of shell quoting, not because of
   the file.
6. **Read the whole log before concluding a run collected nothing.** ANSI codes
   defeated my grep for `Test Files`; the run was fine.
7. **A red oracle is not proof of an unmade fix.** One red in 105 files, and it
   was the test that was wrong about correct code.
8. **Before accepting that a number is distorted, find out which tool computes
   it.** Three reports said the parity percentage was being corrupted by
   `registry.json`. `registry.json` is not an input to it.
