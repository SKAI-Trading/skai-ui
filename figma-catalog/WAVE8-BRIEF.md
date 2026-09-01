# Wave 8 — the PARITY wave (delta from WAVE5 / WAVE6 / WAVE7 briefs)

> ## ⛔ READ THIS LINE BEFORE YOU WRITE YOUR FIRST ROW
>
> **If your TSV starts with a column header, PREFIX IT WITH `# `.**
>
> ```
> # key<TAB>status<TAB>primaryFile<TAB>route<TAB>reason
> ```
>
> A bare `key<TAB>status<TAB>…` line is parsed as DATA, `status` is not a valid
> verdict, and `apply-status.mjs` then **refuses to write `registry.json` for the
> ENTIRE WAVE** — every other lane's rows included. The refusal is atomic.
>
> This is the SIXTH occurrence. Five lanes did it in wave 7; **20 of 20 did it in
> wave 8**, which means the fault is this brief, not the lanes. It is one
> character. Run `node figma-catalog/validate-wave8.mjs` (or `validate-wave7.mjs`)
> the moment your file has one row in it — it catches this in seconds.

**Read `WAVE5-BRIEF.md` in full first — all of it still binds.** Then
`WAVE7-BRIEF.md` §1-§8 (Figma is authenticated, `live/*.tsv` names are truncated,
column 2 ≠ column 6, write your TSV incrementally, be economical).

This file says only what is different, and one thing is: **the target has
changed.**

---

## 1. The target is `partial` → `done`. Nothing else moves the number now.

Wave 7 closed `unknown` from 370 to 91. The band is settled. What has NOT moved
in three waves is **measured parity: 11.9% → 12.0% → 12.17%.**

There are **1,221 `partial` frames**. `partial` means *built, not verified*. Your
job is to verify them — or to find they are not at parity and say what is wrong.

★ **Wallet 2 is at 71.1% parity and proves the bar is reachable.** Every other
major surface is under 14%, and **17 of 27 game pages have ZERO `done` frames**.
A game that ships and is routed should be able to produce at least one measured
frame. If it cannot, that is itself the finding.

## 2. What `done` requires — all three axes, off node data

Not two. Not "geometry matched and the rest looked right".

| axis | what to read | what to write in the row |
|---|---|---|
| **geometry** | node `width`/`height`, `x`/`y`, padding, `itemSpacing`, radius | the numbers, both sides |
| **type** | font family, size, line-height, letter-spacing, weight | the ramp, per breakpoint |
| **colour** | `fills`, **and `opacity` on the node AND every ancestor** | resolved hex, composited |

⚠️ A render and node data are authoritative for **different** things: node data
gives the exact fill but omits ancestor opacity; a render composites correctly
but antialiases. `#FFBD16 @ 0.34` really paints `#574007`.

⚠️ **Radius, corrected 2026-08-31**: the shipped scale is **bare `rounded` = 4** /
sm 8 / md 10 / lg 12 / xl 16 / 2xl 24 / **3xl 24**. `skaiBorderRadius` has no
`DEFAULT` and no `3xl` key and sits under `extend`, so both fall through to
Tailwind's stock values. Earlier briefs said "there is no class for 4px" — that
was WRONG for three waves. A lane "fixing" a bare `rounded` to `rounded-sm`
moves 4px to 8px **against** the frame.

## 3. A DEMOTION IS A GOOD OUTCOME. Do not promote to move the number.

Wave 7's `done` rose only +5 across 980 rows: **28 promotions against 25
demotions.** Trade 2's `done` FELL 54 → 35 while its floor rose 41.6% → 86.7%.
Its `done` fell and its honesty rose — those are the same event.

★ **A wave whose `done` only increases is a wave re-verifying nothing.** If you
measure a frame currently marked `done` and it is not at parity, demote it and
say why. That is worth more than a new `done`.

**A `done` row with no numbers in its reason column is not a `done`** and will be
demoted next wave.

## 4. When you fix a rule, SWEEP EVERY CALLER

Wave 7 found `isMarketTradeable` — the canonical closed-market predicate — was
being re-derived as `status === 'open'` in **three** separate places. Two were
still live after the class was recorded as *resolved*, and the write was a
**guaranteed revert**: the user signs, pays gas, and the contract rejects it at
`SKAIOutcomeMarket.sol:808`.

So: if you fix a predicate, a constant, or a shared class, **grep for every other
site that re-derives it** before you finish. A duplicated rule cannot fail
loudly — every copy renders something plausible.

## 5. Two instruments that lie, both confirmed this week

- ⚠️ **`grep -iF` returns NOTHING in this shell.** `-cF` works; `-ciF`,
  `-cniF`, `-crniF` are silently empty. It fails in the *reassuring* direction on
  the exact operation that proves a mutation landed — one lane found six of its
  greps were vacuous. **Never combine `-i` with `-F`.**
- ⚠️ **A vitest run that collects 0 files exits 0 and prints a confident pass.**
  Always read the `Test Files N passed (N)` line. If there is no such line, it
  collected nothing. I did this to myself twice this week.

## 6. Do not trust a page to tell you which game a frame belongs to

Verified live: the `✅ Bingo` page holds a frame titled
`… > Scratchers (1440 x 900px)` and another titled `… > Blackjack (375 x 812px)`.
The `✅ Hi-Lo` page holds a **768x1024 Scratchers** screen and a Blackjack screen.
**Same two games, two different wrong pages** — and it hid for months behind the
20-char title cap in `live/*.tsv`.

★ **Read the title from node data. The page is a filing convention; the title is
the claim.** If you find another instance, report it — we now have two and no
reason to think that is the end.

## 7. Report back

As WAVE7 §6. State plainly:

```
frames in my work list : N
frames I measured on all three axes : N
promotions to done     : N        demotions from done : N
final histogram        : done N · partial N · not-started N · blocked N ·
                         frame-defect N · furniture N · unknown N
oracle tests added     : N  (and whether each survived a mutation)
```

**Promotions and demotions separately.** A net figure hides the re-verification,
which is the part that makes the number trustworthy.
