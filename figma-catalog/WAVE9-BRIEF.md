# Wave 9 — parity, continued (delta from WAVE8-BRIEF.md)

**`WAVE8-BRIEF.md` binds in full and is short — read it, then `WAVE5-BRIEF.md`.**
This file is only what changed.

---

> ## ⛔ 2026-09-01 04:44 — THE CATALOG WAS WIPED MID-WAVE. READ THIS FIRST.
>
> `modules/skai-ui/figma-catalog/` (384 tracked files) was reduced to FOUR, and
> `modules/skai-ui/.git` was removed. Restored from the surviving object store at
> `.git/modules/modules/skai-ui` (note the **doubled** `modules`).
>
> **All 18 wave-9 TSVs were UNTRACKED, so all 18 were lost** — 212 measured rows
> (done 19 · partial 109 · frame-defect 26 · blocked 48 · not-started 10) that had
> sat uncommitted for four hours. Four lanes rebuilt theirs from transcript.
>
> ★ **THE RULE THAT FOLLOWS: `git add` + commit your TSV every few rows.** An
> incremental *write* protects nothing if the file is untracked — wave 8 learned
> to write incrementally, and wave 9 proved that is only half the lesson. **The
> durable copy is the committed one.**
>
> ⛔ **NEVER run `git submodule update` on `modules/skai-ui`.** The superproject
> index pins `c7830899`, which is THREE COMMITS BEHIND the submodule's own HEAD
> `bf7ef9b`. That command silently rolls the tree back past committed catalog
> work. The pointer needs reconciling separately.

> ## ⛔ BEFORE YOUR FIRST ROW — column 6 has bitten five waves running
>
> **Prefix a column header with `# `.** A bare `key<TAB>status<TAB>…` line parses
> as DATA and `apply-status.mjs` then refuses to write `registry.json` for the
> ENTIRE wave. 20 of 20 lanes did this in wave 8.
>
> **Column 6 is `<width>=<verdict>`, or EMPTY. Nothing else.**
> - `-` is the columns-3/4 empty convention and is **invalid here** — 21 rows
>   used it in wave 8 and blocked the write.
> - A bare `n-a` is **not a cell**; write `desktop=n-a tablet=n-a mobile=n-a`.
> - Valid verdicts: `unknown missing renders done partial broken not-started n-a`.
>   `blocked-on-backend`, `frame-defect` and `furniture` are **column 2 only**.
>
> Run `node figma-catalog/validate-wave7.mjs` the moment your file has one row.
> It auto-detects the newest wave and prints which one it checked.

## 1. Where the number is, and what moves it

Wave 8 moved parity **12.17% → 14.32%**, the first movement in four waves.

```
                 gen  done  partial  parity
Trade 2          375    37    279     9.9%    <- biggest bucket
Social           402    20    241     5.0%    <- worst parity, 61 blocked
Predict          254    25    169     9.8%
Play             269    35    141    13.0%
Home 2           138    11    100     8.0%
Wallet 2         159   113     44    71.1%    <- FINISHABLE
Privacy & Terms    6     6      0   100.0%    <- DONE. It can be done.
```

★ **A surface has now been finished.** Privacy and Terms is at 100%. Blackjack
reached 13/13 in this wave. The bar is reachable end-to-end.

★ **TEN game pages are still at 0.0%**: Dice (22 partial), Chicken (15),
Crash (13), Fortune Wheel (11), Plinko (9), Limbo (9), Hi-Lo (7), Towers (6),
Roulette (3), Video Poker (2), RPS (2). **Getting a page off zero is worth more
than a tenth frame on a page already moving.**

## 2. The bar is unchanged, and a demotion is still a good outcome

`done` = geometry **and** type **and** colour, measured off node data, numbers in
the row. **Report promotions and demotions separately.**

★ **A `done` whose reason has no digits is not a `done`.** One wave-9 lane
demoted 19 rows whose reason literally read *"status CARRIED … not measured by
this lane"*.

## 3. Instrument facts settled — do not re-litigate

- **Figma's blur radius is 2× the CSS value** (`BACKGROUND_BLUR radius 40` =
  `backdrop-blur-[20px]`). Governs `LAYER_BLUR`/`BACKGROUND_BLUR` only — **not**
  drop-shadow blur, which is 1:1.
- **An `implFiles` entry can be a NAME MATCH, not a measurement.** Grep the named
  file for the node id in **both** `1234-5678` and `1234:5678` forms.
- **`itemSpacing` is INERT under `primaryAxisAlignItems: SPACE_BETWEEN`** — the
  node still reports a value the layout ignores.
- **An `itemSpacing` is ambiguous until you know the node's layout DIRECTION.**
- **Breakpoint cannot be inferred from frame WIDTH** — use canvas position.
- **Guessing a sibling node id by incrementing is fabrication.** Resolve every id.
- ⚠️ **A brief is a snapshot of a tree 20 lanes are writing to.** Its CODE facts
  rot within the wave. **Re-measure the code, not just the frame.**

## 4. The money-path class is CLOSED — five sites, do not reopen

`isMarketTradeable` was re-derived as `status === 'open'` in five files. All five
now import the predicate. **If you touch tradeability, import it.**

★ New this wave: **an asymmetric coercion is worse than a symmetric one.** Ask
not "is a default substituted" but **which way can it move the output, and which
users hit it.**

## 5. Report back

```
frames in my work list : N
frames measured on all three axes : N
promotions to done : N        demotions from done : N
final histogram : done N · partial N · not-started N · blocked N ·
                  frame-defect N · furniture N · unknown N
oracle tests added : N  (and whether each survived a mutation)
```
