# Wallet 2 — Send / Swap / Batch-send 375 boards, measured 2026-09-08

File `mhF3BkzlTaGiLzJ7kvpmVc`, page `13008:26951` **✅ Wallet 2**, which
`live/_pages.json` scopes **in-scope**. Every node below was resolved to that
page and every number was read off the node, not inferred from a sibling.

Why this file exists: eight bug reports cite these frames and three separate
lanes left all eight open with the same sentence — *"the Figma MCP was
unreachable for this entire session"*. The MCP was up on 2026-09-08 and these
are the measurements those lanes could not take. Nothing here was built; this is
the input to whoever does build it.

⛔ **Two sections carry a same-day correction and it is worth reading before the
rest.** This file first claimed `13008:41886` and `13008:55085` were cited
nowhere in the tree. Both claims were false. The grep behind them covered three
files picked from the report titles — `SendModal.tsx`, `SwapModal.tsx`,
`BatchSendModal.tsx` — instead of `src`. `41886` was already implemented in
`RecipientSearch.tsx`, and `55085` was fixed in `8ad32f1` while this was being
written. Only `13008:42193` really is uncited. The measurements were right; the
claim about the tree was not, and it failed in the direction that invents work.

---

## ⛔ The correction that matters most: five reports say "Swap" and mean "Send"

Every prior note on this batch reads *"six rows against SwapModal's 375 board,
measure them in one pass"*. That instruction sends a builder to the wrong file
for five of the six. The report **titles** say Swap. The **frames** do not.

| report | title says | node | the frame's own header/body text | file |
|---|---|---|---|---|
| `3ced98a0` | Swap step 1 | `13008:41207` | "Swap crypto" | SwapModal.tsx ✅ |
| `19a8bc08` | Send step 1 | `13008:41317` | "Send crypto", Token step | SendModal.tsx ✅ |
| `451e65db` | Swap step 2 details | `13008:41511` | **"Send crypto"**, Details step | **SendModal.tsx** |
| `699a804d` | Swap step 2 username scroll | `13008:41886` | recipient `@username` dropdown | **RecipientSearch.tsx** (mounted by SendModal) |
| `29dc1921` | Swap review & send step 3 | `13008:42014` | **"Review send"** | **SendModal.tsx** |
| `c36ef164` | Swap processing pop-up | `13008:42193` | **"Send is in progress…"** | **SendModal.tsx** |

Swap has no recipient and no Token/Details/Review rail, so a username picker and
a "Review send" screen could never have been Swap frames.

**Corroborated from source, not from the titles** — the code already agrees with
the frames and only the report titles disagree:

```
SendModal.tsx cites  13008:41340, 41350   children of 41317
                     13008:41561          child of 41511
                     13008:42039, 42074   children of 42014
SwapModal.tsx cites  13008:41223, 41233, 41278   all children of 41207
```

★ The lesson: a report's TITLE is the reporter's guess at which flow they were
in. The cited node is the evidence. Read the frame's own text before routing.

---

## The three-step rail (Send only)

`Token → Details → Review`, drawn on `13008:41317`, `41511` and `42014` as
`Frame 206`: three 18px `input/selection` marks with 18x0 rules between them,
labels 14 tall at y=22. Rail width shrinks as the title grows — 173 / 173 / 155.
The header row is 36 tall with a 24px back mark at y=6 and the title at x=34.

These ARE steps, not states — each carries a different rail position and
different body content. That does **not** overturn the older "four frames named
`modal` with identical node trees are STATES, not steps" ruling: that ruling was
about a different, identical-tree set. Check the tree before applying either.

---

## `13008:41207` — Swap, the main sheet (`3ced98a0`)

`Main container` 346x492 at (15,64). No step rail; Swap is one sheet.

```
header      346x28    back 24 at y=2, title "Swap crypto" at x=34,
                      settings icons/graphical 28x28 at x=268
body        346x448 at y=44, inner Frame 355 322x360 at (12,12)
 Sell card  322x120   signals inset 12, 298 wide
            percent chips 25/50/75/Max, 37 wide on a 39 pitch, 18 tall
            token row 40 tall: disc 24 at (8,8), symbol at x=40, caret 16 at x=70
            amount right-aligned; Balance: line 14 tall at y=48
 CTA swap   40x40 centred at x=141, y=100 (overlaps the two cards)
 Buy card   322x116 at y=124  (4px shorter than Sell — no percent row)
 divider    "Swap summary" 14 tall at y=256, 102.5px rules either side
 summary    322x74 at y=286, three 14-tall rows on a 30 pitch,
            1px rules at y=22 and y=52
primary CTA 322x44 at (12,392)
```

## `13008:41317` — Send step 1, token select (`19a8bc08`)

`Main container` 346x412 at (15,64). Header 36 tall.

```
search      input/primary-inputs 322x48
chain chips row at y=68: six 32px discs on a 40 pitch, "All" label inset 8
token list  Frame 341 322x148 at y=120 — three rows 322x44 on a 52 pitch
 row        inner at (8,6) 32 tall; disc 24 at y=4 with a 12x12 chain badge
            at x=16,y=0; symbol 14 at x=48; "Solana - 0x4q5...3d6" 14 at y=16
            fiat 16 right-aligned; amount 12 below it
CTA         322x44 at (12,304)
```

## `13008:41511` — Send step 2, details (`451e65db`)

`Main container` 346x490 at (15,64). Body `Main Container` 346x438 at y=52.

```
token card      322x48   disc 24 at y=4 + 12x12 chain badge; "Solana"/"SOL" at x=48
recipient       input/primary-inputs 322x70 at y=68
Amount field    input/primary-inputs 322x94 at y=158
                label 14 · field 50 at y=22 · message 14 at y=80
                content inset 16, value 16 tall, "Max" 26 wide right-aligned at x=264
                message row: "$100.99" left, "1.10 SOL Available" at x=161
speed selector  Frame 342 322x74 at y=272
                label 14 · three cells 104.67 wide x44 at y=30 on a 108.67 pitch
                each cell: name 16 over an estimate 12  (Slow ~5 min /
                Standard ~1 min / Fast ~15 sec)
CTA             322x44 at (12,382)
```

⚠️ **Ask Casey before shipping the speed selector.** His 2026-09-05 `/spot`
ruling was "fee `$0.00`, no *Slow* tag". That ruling names `/spot`, which is a
different surface, so it does **not** automatically govern the wallet — but a
"Slow" tag is exactly what it removed, and building one here without asking is
how a ruling gets quietly reversed on a neighbouring screen.

## `13008:41886` — the recipient dropdown (`699a804d`) · ALREADY BUILT

⛔ **CORRECTION, same day.** This section first said "NOT CITED ANYWHERE IN THE
TREE". That was false, and it was false because the grep behind it covered only
`SendModal.tsx`, `SwapModal.tsx` and `BatchSendModal.tsx` — three files chosen
from the report titles — rather than `src`. A repo-wide grep finds it at
`src/components/RecipientSearch.tsx:518`, carrying this exact frame and its two
siblings:

```
1440  13008:38846  647x504  r16  pad 8  port 488  rows 40, 16 inset
 768  13008:40776  548x504  r16  pad 8  port 488  rows 40, 12 inset
 375  13008:41886  322x452  r12  pad 8  port 436  rows 40, 12 inset
```

and implementing them — `max-h-[436px] md:max-h-[488px]`,
`rounded-[12px] md:rounded-[16px]`, `py-2 pl-2`, and `pr-6`/`pr-2` switched on
whether the rail is drawn (24 = 16 gutter + the 8 the rail occupies). Landed in
`5b7caac` and `0ecdab8`. The owning component is **`RecipientSearch.tsx`**,
which `SendModal.tsx` mounts — so even the corrected routing above lands one
file short.

★ The lesson, which is the durable part: **a "cited nowhere" claim is only as
good as the grep that produced it.** Three files picked from a report title is
not a search of the tree, and the negative it returns reads exactly like the
positive would have. Grep `src`, and keep a control in the same run — the
control here (`13008:54426` → 2 hits, `13008:41340` → 2 hits) fired correctly
while the real query was being asked of the wrong scope.

The measurement itself stands, and is what the code implements:

Top-level frame on the page, `dropdown - start scroll`, **322x452**.

The report's word "scroll" is the whole finding: the frame is 452 tall and its
content `Frame 355` is **660** tall, so the design clips it and draws the bar.

```
content     Frame 355 289.99 wide at (8,8), 660 tall  -> clipped to 452
row         40 tall on a 56 pitch, 1px rule between rows
            index 16 wide, avatar 32, handle at x=40
            status right-aligned in a 55px column: "following" / "-" / "0.01%"
first row   44 tall — the "@enter username or paste an address" entry row,
            with a labels/tag 53x22 at its right
scrollbar   track 13008:42011  8 wide at x=314, y=8, 436 tall
            thumb 13008:42012  4 wide, 174 tall, inset 12 from the track top
```

## `13008:42014` — Send step 3, review (`29dc1921`)

`Main container` 346x408 at (15,64). Header 36, rail 155 wide.

```
token card   322x48   disc 24 + chain badge; fiat 16 over amount 12 at x=48
Background   322x196 at y=68
 Frame 366   322x94   From/To labels 14 at (24,16); the pair row 274x40 at y=38
             left wallet: disc 24 + name; a 40x40 CTA at x=117 between them;
             right address 14 at x=195
 Frame 277   322x78 at y=118, 1px rules at y=0, y=34 and y=78
             Network row 18 tall at y=8, chain disc 18 + "Base" right-aligned
             Network fee row 28 tall at y=42 with a labels/tag 30x18 at x=69
CTA pair     two 156x44 at (12,300), 10px apart  ← a PAIR, not one button
```

## `13008:42193` — the processing overlay (`c36ef164`) · NOT CITED ANYWHERE IN THE TREE

`Overlay` **375x812** — full-bleed scrim, not a sheet.

```
modal    346x430 at (15,191)     vertically centred: 191 above, 191 below
pad      12, inner width 322
controls 322x16 at y=12, close 16x16 flush right (x=306)
title    "Transaction processing..." 322x22 at y=48
body     322x32 at y=78  ("Send is in progress. It may take a few minutes for
         blockchain validation to be completed.")
card     322x224 at y=130, spinner chart 128x128 at (97,48) inside it
CTA      322x44 at y=374
```

---

## Batch send — `BatchSendModal.tsx`

## `13008:54424` — batch send, token step (`17fc008b`) · BUILT IN `8ad32f1`

`Frame 347` 346x366 at y=50. At the time of measurement only `13008:54426` (the
search input) was cited; `8ad32f1` then gave the row its phone rung — a 32px
icon block round a 24px mark with the chain badge at x=16 at 375, against a 40px
block with the badge at x=26 from 768 up, which had shipped at the desktop
numbers with no breakpoint at all.

```
search   input/primary-inputs 322x48
chips    row at y=68, six 32px discs on a 40 pitch
list     Frame 341 322x154 at y=120 — three rows 322x46 on a 54 pitch
 row     inner at (8,7) 32 tall; disc 24 at y=4 + 12x12 chain badge
         symbol 14; "Solana - 0x4q5...3d6" **16** tall at y=16
CTA      322x44 at (12,310)
```

★ **The batch picker is NOT the Send picker.** Rows 46 on a 54 pitch here
against Send's 44 on a 52, subtitle 16 against 14, inner inset y=7 against y=6.
The two look identical and are drawn three different numbers apart. Copying one
into the other is the failure this note exists to prevent.

## `13008:55085` — batch send, review (`4ce4899c`) · BUILT WHILE THIS WAS WRITTEN

⛔ **CORRECTION, same day, same cause as the `41886` one above:** this first read
"NOT CITED ANYWHERE IN THE TREE" off a three-file grep. `skai-wallet 8ad32f1`
(2026-09-08 22:42) fixes both batch rows and adds
`src/__tests__/components/BatchSendModal.figmaParity.test.tsx`, which names
`17fc008b` (`13008:54424 / 49276 / 36677`) and `4ce4899c`
(`13008:55085 / 49869 / 37287`) and resolves both to Wallet 2 in-scope.

Its central finding matches the measurement below independently: **Frame 382
changes AXIS.** At 375 (`13008:55166`) the review actions are a vertical 10px
stack with Confirm on top; at 768 and 1440 they are a horizontal pair with
Cancel on the left. One flex row cannot express that, which is why it survived a
pass that had already ramped this sheet's search field, primary CTA and details
step. Shipped as `flex-col-reverse md:flex-row`, which draws the phone order
without moving Cancel behind Confirm in the DOM.

The measurement stands and is what the fix implements:

`Frame 346` 346x638 at y=50 — by far the tallest board in this set.

```
token card   322x48
Background   322x412 at y=68
 Frame 366   322x86   From/To labels 14 at (12,12); pair row 298x40 at y=34
             left wallet disc 24 + name; 40x40 CTA at x=141.5;
             right "3 recipient wallets" 54 wide at x=244
 table       Frame 285 322x170 at y=110
             header 306x12 at (8,16): S/N 25 · Recipient(s) 66 at x=32.67 ·
                                      Amount 143 at x=106.33 · Action 49 at x=257
             three rows 306x34 at y=36 / 78 / 120  (42 pitch)
             row: index 15 at x=8, handle 16 at x=23,
                  amount block 103 wide at x=155 — fiat 16 over token 16 at y=18,
                  a 16x16 action mark at x=127 of that block
             row 3 shows a raw address in a 86x22 pill instead of a handle
 divider     "Other details" 14 tall at y=304, 108.5px rules either side
 Frame 277   322x70 at y=342 — Network 18 at y=0, 1px rule at y=26,
             Network fee 28 at y=34 with a labels/tag 30x18, rule at y=70
CTA stack    Frame 382 322x110 at (12,516)
             TWO buttons 322x**50**, at y=0 and y=60 — 10px apart
```

★ **The CTA here is two stacked 50-tall buttons.** Every other board in this set
ends in a single 322x**44**. A sheet-wide "the CTA is 44" rule is wrong on this
one frame.

---

## Verifications of other lanes' numbers, done independently

Both re-measured off the nodes rather than taken from the commit messages:

- `54b629a` — "the QR block is 150 round a 141 white plate at 375".
  `13008:42541` is 149.625 around `13008:42542` at 140.625. **Correct.**
- `459ec58` — "375 `13008:50656` 80 + 16 + 226 in 322".
  `13008:50657` at x=0 w=80, `13008:50662` at x=96 w=226. **Correct**, and the
  ring really is on the LEFT, which is why report `5a4e494b`'s literal ask
  ("move the holdings to the left of the chart") is contradicted by its own
  cited node.

## One open discrepancy, recorded not fixed

`WalletAccountRoute.tsx:388` gives Save as `13008:44174 / 44255 / 44360
322x44` on all three boards. `13008:44255` is the **page's** Save. The account
edit **drawer** has its own, `13008:44283`, at **335x44** — x=12 inside a
359-wide frame padded 12 (359 − 12 − 12 = 335). 322 is the 346-board's inner
width and does not belong to the drawer. 13px narrow on the exact surface report
`98a6855f` is about. Not changed here: `modules/skai-wallet` had another lane
editing it live at the time of writing.
