# Wave 11 — parity (delta from WAVE10-BRIEF.md)

**`WAVE10-BRIEF.md` binds in full — read it, then `WAVE5-BRIEF.md`.**

---

> ## ⛔ COMMIT YOUR TSV EVERY FEW ROWS. IT WORKED — KEEP DOING IT.
>
> Wave 9 lost 212 measured rows to an untracked wipe. Wave 10 committed
> incrementally and **six lanes were killed mid-flight by a session limit with
> zero row loss.** From your first block:
> ```
> cd modules/skai-ui
> git add figma-catalog/status.wave11.<lane>.tsv && git commit -m "catalog: wave 11 <lane> rows"
> ```
> Explicit pathspec, never `git add -A`. Shared tree.
>
> ★ **AND COMMIT YOUR CODE.** Wave 10 found source files that were untracked
> while HEAD already imported them — every local build passed because the file
> was on disk. **No compiler can tell "in the repo" from "in this directory".**

## 1. Where the number is

```
PARITY 314/1914 = 16.41%   BUILT 1416/1914 = 73.98%
unknown 52 · blocked 87 · frame-defect 83 · not-started 233

                 gen  done  partial  parity
Trade 2          375    36    244     9.6%   <- biggest bucket
Social           402    35    225     8.7%
Predict          254    24    162     9.4%
Play             269    40    156    14.9%
Home 2           138    14    101    10.1%
Wallet 2         159   115     39    72.3%   <- ceiling is 96.86%, not 100%
Blackjack         16    13      0    81.2%   <- 3 FRAMES FROM FINISHING
Baccarat          13     4      2    30.8%
Privacy & Terms    6     6      0   100.0%   <- done
```

★ **NINE pages still at 0.0%**: Chicken (15 partial), Towers (14), Fortune Wheel
(11), Limbo (9), Plinko (9), Roulette (4), Video Poker (2), RPS (2), Hi-Lo (0).

## 2. ★★★ THE BIGGEST SINGLE TARGET: 142 LEGACY `done` ROWS WITH NO NUMBERS

`node figma-catalog/validate-wave7.mjs --all` reports **142 rows whose status is
`done` and whose reason contains NO DIGITS** — `status.home-2.tsv`,
`status.trade-2.tsv` and siblings. A `done` with no numbers is a citation, not a
measurement, and it is counted in the 16.41% today.

**If your surface has any, re-measure them or demote them.** Expect the parity
number to FALL as a result. That is the bar working — a wave that only
promotes is a wave re-verifying nothing.

## 3. Six wave-10 lanes were killed mid-flight — their surfaces are UNDER-COUNTED

`trade2-perp`, `trench-discover`, `predict-dash`, `social-feed`, `social-blocked`
and `verify` were cut by a session limit. Everything they committed survived;
what they had not yet written is gone. **Read your surface's
`status.wave10.*.tsv` FIRST and extend it — do not repeat it.**

## 4. Money-path rule, sharpened by wave 10

`unknown` must never render as `0`. Where there is no source, **OMIT the line** —
omitted is not zero. Follow `src/hooks/wallet/tokenPrice.ts`: `number | Offline`,
no third case.

★★★ **A money-path fix is not done when the MAPPER is fixed. It is done when
EVERY WRITER to that field is fixed.** Wave 10 found a websocket path doing
`?? 0` that rewrote an honest `—` into a green `+0.00%` **one second after** the
REST mapping got it right — the third instance of a defect two earlier fixes had
already closed one layer down. **Sweep every writer.**

## 5. Instrument traps — the wave-10 additions

- ★ **Assert the SUM, not the parts.** A height is an outcome of independent
  utilities: padding, leading and a default. A lane pinned `px-2`, `py-1` and
  `not h-7` — all three green on a control rendering **40px**, because the
  variant's default `h-10` was merely uncovered. Asserting `padY*2 + leading`
  catches it, and it also surfaces frame defects no part-wise check can reach.
- ★ **A test can fail RED against its own `vi.mock`.** The mock is file-wide and
  hoisted. Check the file's mock list for the component under test.
- ★ **`itemSpacing` is INERT under `SPACE_BETWEEN`** — 43 of 44 right-menu panels
  report 32 and draw 39 different gaps. Also inert on a **single-child**
  auto-layout. Check `primaryAxisAlignItems` and the child count.
- ★ **Read a GROUP's size off its painted child**, not its bounds — one member
  with nonsense coordinates inflates the box.
- ★ **A sanity check must assert something the suspected failure would CHANGE.**
  A lane's probes were all facts true under both the broken and the correct
  instrument, so they passed at exactly the moment they were needed.
- ★ **`--all` at close.** The gate lanes run defaults to the CURRENT WAVE ONLY
  (19 files); the writer globs 151. That hid a total write refusal for a wave.
- Figma blur is 2x CSS (`LAYER_/BACKGROUND_BLUR` only). Bracketed title size is
  the VIEWPORT, not the frame. `implFiles` can be a name match — grep both id
  forms. A brief's CODE facts rot within the wave: re-measure the code.

## 6. The bar

`done` = geometry **and** type **and** colour, off node data, **numbers in the
row**. Report promotions and demotions SEPARATELY. Column 6 is
`<width>=<verdict>` or EMPTY; header prefixed `# `.

## 7. Report back

```
frames in my work list : N
legacy no-digit `done` rows re-measured or demoted : N
frames measured on all three axes : N
promotions to done : N        demotions from done : N
final histogram : done N · partial N · not-started N · blocked N ·
                  frame-defect N · furniture N · unknown N
oracle tests added : N  (and whether each survived a mutation)
TSV committed : yes/no (hashes)   code committed : yes/no (hashes)
```
