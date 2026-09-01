# Wave 10 — parity (delta from WAVE9-BRIEF.md)

**`WAVE9-BRIEF.md` binds in full and is short — read it, then `WAVE5-BRIEF.md`.**
Read `WAVE9-INTEGRITY.md` §2 before you form any theory about the numbers.

---

> ## ⛔ COMMIT YOUR TSV EVERY FEW ROWS. THIS IS THE WHOLE LESSON OF WAVE 9.
>
> The catalog working tree was wiped mid-wave. Waves 2–8 — 126 status files —
> restored intact from the object store. **Wave 9 lost all 18 lane files and 212
> measured rows, because not one had ever been committed.**
>
> Writing incrementally guards a lane process dying. It guards NOTHING when the
> file is untracked. From your first block of rows:
>
> ```
> cd modules/skai-ui
> git add figma-catalog/status.wave10.<lane>.tsv
> git commit -m "catalog: wave 10 <lane> rows"
> ```
> Explicit pathspec, never `git add -A` — this is a shared tree with peer lanes'
> work in it. Repeat every few rows. An extra commit costs nothing.
>
> ⛔ **Never run `git submodule update` on `modules/skai-ui`.** The superproject
> index can pin a commit BEHIND the submodule's own HEAD and will silently roll
> the tree back past committed work.

## 1. ★★★ THE BIG OPPORTUNITY: THE CODE SURVIVED, THE VERDICTS DID NOT

The wipe hit `figma-catalog/` only. **`src/`, `modules/skai-gaming` and
`modules/skai-wallet` were untouched**, so twelve lanes' worth of wave-9 CODE
FIXES are in the tree right now while their frames still read `partial`.

**Before you measure anything new, re-measure the frames your surface already
fixed.** Known-landed wave-9 code whose verdicts were lost:

| surface | code that landed and is unrecorded |
|---|---|
| Blackjack | loss state built (`BJ.lose`/`isLosing`), rank line-height 37, card shadow blur, Baccarat swept identically. **Reported 13/13; banked 7/16.** |
| Home 2 | `VerifyPaymentScreen` three-width ladder + scoped colour tokens; `lg:text-[32px]/9` H1 ramp on MarketIntel/Signals/News/Sentiment/Analysis |
| Home 2 intel | `InsightXScreen` verdict money fix; `MarketIntelTickerCard` radius/border/shadow/height/gap; insight-row gaps and Mulish 11/14 |
| Play | `PlayBetsTable` inset+type+range ramps; `PlayStateCard` positive tone `text-sky-blue`; `PlayReferralBanner` radius/shadow/fills |
| Predict | `MarketModules` three-tier band; `DetailCard` `rounded-[12px] lg:rounded-[16px]`; `ActivityPanel` six corrections |
| Predict dash | `PredictDashboardScreen` xl rhythm (24/40/32/32) |
| Trench | `TrenchColumn` gap 8 + three radius tiers; Discover table rows as cards; `ChainChartCard` md tier |
| Trade 2 | `MobileBuySellBar`, `MarginModeSheet`, `PerpConfirmOrderModal` |

★ **This is the cheapest parity in the programme.** The measurement is done, the
fix is shipped; the row just has to be written and committed. Do it first.

## 2. Where the number is

```
PARITY 281/1914 = 14.68%      BUILT AT ALL 1443/1914 = 75.39%
                 gen  done  partial  unknown  parity
Trade 2          375    29     278      14     7.7%   <- biggest bucket
Social           402    25     242      17     6.2%   <- worst parity
Predict          254    26     168      23    10.2%
Play             269    35     151       4    13.0%
Home 2           138    11     100       8     8.0%
Wallet 2         159   113      41       0    71.1%   <- FINISHABLE
Blackjack         16     7       6       0    43.8%   <- FINISHABLE
Privacy & Terms    6     6       0       0   100.0%   <- done
```

★ **NINE game pages still at 0.0%**: Chicken (15 partial), Fortune Wheel (11),
Plinko (9), Limbo (9), Hi-Lo (7), Towers (6+8 unknown), Roulette (3), Video
Poker (2), RPS (2). Crash (46.2%) and Dice (13.0%) came off zero in wave 9.

## 3. ⛔ SETTLED — DO NOT RE-ESCALATE

**`registry.json` drift does NOT affect the parity number.** Three separate
reports claimed it did in wave 9; all three were wrong and cost the wave real
time. `coverage.mjs` builds its denominator from `live/*.tsv` and reads
`status.*.tsv` directly — the registry is not an input on either side of the
fraction. The seven status buckets exactly partition the 1,914, and all 52
unaddressable frames carry rows and ARE counted.

- The re-harvest is an **addressability repair**, not a denominator correction.
- `validate-wave7.mjs` is the instrument with the blind spot, and it computes
  nothing anyone quotes.
- If `validate-wave7.mjs` says a row "applies to ZERO frames" and the node is
  real, in-scope and live: **do not re-key it and do not delete it. There is no
  key that would work.** Report it and move on.
- Node ids are **per file**. There is no global id cutoff.

## 4. Instrument traps — the new ones

- ★ **A test can fail RED against its own mock.** `vi.mock` is file-wide and
  hoisted, so a component mocked for one describe block is mocked for all of
  them. `trenchTypeRamps` asserted a card's fill against `<div>SIMILAR-PANEL</div>`
  and failed while the component was already correct. **Before believing a
  component assertion, check the file's own `vi.mock` list for the component
  under test.** Reach past it with `vi.importActual`, then mutation-check.
- **`itemSpacing` is INERT under `primaryAxisAlignItems: SPACE_BETWEEN`** — the
  node reports a value the layout ignores.
- **An `itemSpacing` is ambiguous until you know the node's layout DIRECTION.**
- **Breakpoint cannot be inferred from frame WIDTH** — use canvas position.
- **Figma blur radius is 2× the CSS value** for `LAYER_BLUR`/`BACKGROUND_BLUR`
  only. Drop-shadow blur is 1:1.
- **An `implFiles` entry can be a NAME MATCH** — grep the named file for the node
  id in both `1234-5678` and `1234:5678` forms.
- **A brief's CODE facts rot within the wave.** Re-measure the code, not just the
  frame.

## 5. The bar

`done` = geometry **and** type **and** colour, measured off node data, **numbers
in the row**. A `done` whose reason has no digits is not a `done`. Demotions are
a good outcome. **Report promotions and demotions separately.**

Column 6 is `<width>=<verdict>` or EMPTY; `-` and a bare `n-a` are invalid;
`blocked-on-backend`/`frame-defect`/`furniture` are column 2 only. Prefix the
header with `# `. Run `node figma-catalog/validate-wave7.mjs` after your first
rows.

## 6. Report back

```
frames in my work list : N
frames re-recorded from wave-9 code that already landed : N
frames measured on all three axes : N
promotions to done : N        demotions from done : N
final histogram : done N · partial N · not-started N · blocked N ·
                  frame-defect N · furniture N · unknown N
oracle tests added : N  (and whether each survived a mutation)
TSV committed : yes/no  (commit hash)
```
