# Figma catalog — the design, and why it is shaped this way

Written 2026-08-11, from measurements taken the same day. Every number here was
counted, not estimated; the queries and scripts are named so they can be re-run.

## The problem this has to solve

There are **603 open Figma-linked bug reports** (`status in ('new','needs_info')`,
`figma_link is not null`), out of 1,981 filed in total. Casey's framing was that most
exist "because things don't match". That is right, but the useful question is *what*
does not match, and the answer changes what the catalog needs to be.

### Measurement 1 — the catalog could not see 80% of what reporters point at

Bug links carry a `node-id`. Extracting them gives **514 distinct nodes** with an open
bug. Comparing against every id in every `*.nodes.txt`:

| | count |
|---|---|
| buggy nodes **in** the catalog | 104 (20%) |
| buggy nodes **missing** from the catalog | **410 (80%)** |

The cause is structural, not sloppiness. The catalog indexes **top-level children of a
page** — whole screens. Reporters link to the *thing that is wrong*, which is a panel,
a modal, a button, nested 2–13 levels deep. Resolving a sample of those ids shows
exactly that: `13006-134391` is a `CTA/button` at depth 7 inside
`Skai > Trench 1VH (1440 x 900px)`.

So for four of every five bugs, the catalog cannot answer "what is this, and which
screen is it on". That is why it has never been usable for closing bugs, and it is the
single most important gap.

### ✅ CLOSED 2026-08-13 — `bug-node-index.tsv`

Re-measured against the current open backlog (488 open reports carrying a `figma_link`,
445 distinct links, **430 distinct `(fileKey, node)` pairs**):

| | before | after |
|---|---|---|
| resolvable to a catalogued screen | 105 (24%) | **373 (87%)** |
| unresolvable | 325 (76%) | **0** |
| — of which confirmed deleted upstream | — | 57, recorded as `gone` |

The "before" figure is quoted **conservatively**. Measured at the start of this session
it was 98/430; by the end it was 105/430, because a concurrent lane grew
`registry.json` from 3,170 to 3,176 frames while the sweep was running. The higher
number is used so the improvement is not overstated. If you re-derive this, expect the
baseline to drift again — the delta is the durable part, not the absolute.

Every one of the 430 is now accounted for: 75 point at a catalogued screen directly,
231 are children resolved to their owning screen, 53 pointed at the **wrong file** and
carry the corrected `resolvedFileKey`, 14 were already aliased, and 57 resolve in no
file at all and are marked `gone` (verified twice — `getNodeByIdAsync` **and**
`get_metadata`, which are independent code paths).

The method is the one sketched below and it is fully mechanical:
`figma.getNodeByIdAsync(id)` → walk `.parent` to the `PAGE` → the last node before the
page is the owning screen. Deep nodes reach **depth 12**; the median is 2–4.

The 53 wrong-file rows are not reporter error — they are the file move, and the rule
everyone was given for handling it is itself wrong. See `FILE_ROUTING.md`.

### Measurement 2 — 25 components generate the whole surface

Every `INSTANCE` across Home 1/2, Wallet 1/2, Trade 1/2 was resolved to its
`COMPONENT_SET` (so variants collapse to one component). The result:

**25 distinct components. 54,047 placements.**

`icons/action` 17,152 · `CTA/button` 15,560 · `icons/graphical` 6,381 ·
`labels/tag` 3,417 · `images/circle` 3,316 · full table in `components.tsv`.

A wrong hex on `CTA/button` is wrong 15,560 times, so a single component defect arrives
as many bug numbers. **But that is not the whole backlog, and the first draft of this
document overstated it.** Classifying the 603 by whether they name a component:

| | open bugs | share |
|---|---|---|
| names a component | 261 | **43%** |
| names none | 342 | **57%** |

The 43% is the component-shaped half — `icons/*` 90, `CTA/button` 62,
`input/selection` 31, `Header-*` 26, `input/primary-inputs` 20 — and it does collapse
into 25 fixes.

The 57% is **section-level scope divergence**, and reading it changes the plan. It
splits three ways:

- *sections missing* — "missing multiple sections entirely", "to be completely redone"
- *sections EXTRA* — the app has surfaces Figma does not: "Remove SKAI AI SignalWidget
  … it is not in the figma design", "Remove AI Confidence Trend Widget", "Remove
  account widget", "Remove token details and market details". These are **deletions**,
  not styling drift, and no amount of component work touches them.
- *section geometry and background* — overlay/background styling, chart line weights

So the honest statement: fixing 25 components addresses about two fifths of the
backlog and is the highest-leverage single move. The other three fifths is per-surface
reconciliation — including removing things we built that the design never asked for.

## Where the work is — `hotspots.tsv`

`node hotspots.mjs` joins open bug counts onto catalog sections through the `route`
column that `status.<section>.tsv` already carries, and writes `hotspots.tsv`:

```text
130  trade    63  predict   57  play    28  home
23   skratch  20  coinflip  11  blackjack  10  mines  3 plinko  2 dice  1 wallet
```

Three numbers are deliberately held OUT of that ranking rather than smoothed into it:

- **`/` — 162 bugs, unattributable.** Four sections (home, onboarding, trade, wallet)
  list `/` as their route. Breaking that tie by frame count would have put 162 reports
  against `trade` and made it look like the dominant hotspot on evidence that does not
  support it. Fix the route column; do not break the tie.
- **`/launchpad` — 56 bugs, and `/sports` — 37. No catalog section claims either
  route.** 93 open bugs on surfaces the catalog cannot describe. That is a coverage
  gap, not a rounding error.

Two matcher traps are worth knowing, because both produced confident wrong answers
before being caught:

1. A catalog route is a *pattern* (`/crypto/:symbol`), a reported url is *concrete*
   (`/crypto/TOADUS`). Literal prefix matching silently drops every dynamic route — 26
   `/crypto/*` bugs came back "unmatched" until the matcher compared segment by segment.
2. `/` has zero segments, so a prefix test makes it a **catch-all**. That version
   reported a triumphant `603/603` match with "unmatched: none" — because `/launchpad`
   and `/sports` had been absorbed by whichever section claimed the root. A matcher
   that reaches 100% deserves the same suspicion as a test that never fails; the tell
   was `trade` jumping 104 → 385, a number moving further than the change justified.

## The layered model

The catalog is five layers. Only the first two existed before today.

| Layer | Question it answers | State |
|---|---|---|
| **A. Pages** | What surfaces exist, and are they ready for dev? | `pages.json` — complete, 42 pages across 3 files |
| **B. Screens** | What screens exist on each page, and are they built? | `<section>.nodes.txt` / `.titles.tsv` / `status.*.tsv` — 3,829 frames, 100% inventoried |
| **C. Components** | What is the design system, and where is each piece used? | `components.tsv` — **new**, 25 components, all `impl` UNMAPPED |
| **D. Nodes** | What is node X, and which screen owns it? | **DONE for the open backlog (2026-08-13)** — `bug-node-index.tsv`, 430/430 accounted for |
| **E. Tokens** | What is the real hex/radius/spacing, and what does code call it? | **radius DONE (2026-08-13)** — `TOKENS.md`; colour still open |

### Why layer C is the highest-value one to finish

`components.tsv` currently has every `impl` as `UNMAPPED` — we know the 25 Figma
components and their usage counts, but not which `@skai/ui` component owns each one.
Filling that column turns every component-level bug into a single-file fix, and makes
parity mechanically checkable: one component, one code owner, one set of tokens.

That mapping is also the prerequisite for Code Connect, which would let Figma itself
point developers at the right component.

### Why layer E matters more than its bug count suggests

This repo has documented token traps that produce exactly the "colour does not match"
report. ★ CORRECTED 2026-08-31: this paragraph used to say `sky-blue` resolves to
**#2DEDAD (green)** after the 2026-06-12 green-theme directive. That has been FALSE
since 2026-08-12. MEASURED at source: `modules/skai-ui/src/lib/design-tokens.ts:70`
holds `skyBlue: "#56C7F3"`, the preset maps `"sky-blue": accentColors.skyBlue` at
`:244`, and `:53-63` carries an explicit DO-NOT-REVERT recording the flip off alien
green — it names the exact hazard, that while `skyBlue === alienGreen` an accent
control was pixel-identical to a buy/long control. So `sky-blue` is BLUE and matches
Figma's Primary/Sky Blue 300 exactly. Anything that must be green uses the separate
`alien-green` (`:49`, #2DEDAD) or `skai-green` (`:248`, semanticColors.green[300],
also #2DEDAD) — those two are the real confusion pair, along with
`alien-green-bright` (#17F9B4). A wave agent once "fixed" a colour *away* from Figma
on a reporter's say-so. Leaving the old sentence in place was worse than a stale fact:
downstream rows cited it BY NAME as a ruled, app-wide gotcha and used it to defer real
defects (see the corrections on status.wave3.verify-social.tsv:196,
status.wave4.social-a.tsv:13/25 and status.wave4.social-b.tsv:10/11/12/38/39).
A token table with the Figma variable on one side and the Tailwind/`@skai/ui` token on
the other, plus a validator, closes that loop. Source of truth is
`get_variable_defs` on the node, never a reporter's adjective and never a token name
that merely sounds right.

## What is done, and what is next

Done today:

- Layer A/B fully reconciled — every live frame in all three files is catalogued
  (3,829 rows), 0 uncovered pages, 0 drifting pages.
- Home/Wallet/Trade repointed to Skai-Web-App-2 after the file move; 1,553 rows had
  been linking into a file that no longer contained them.
- Layer C harvested — `components.tsv`.
- Layer D proven — 231 of the 410 unmapped bug nodes resolved to
  `{type, name, owning screen}`; the method works and is mechanical.

Next, in value order:

1. **Fill `components.tsv` impl column** (25 rows). Highest leverage in the repo.
2. ~~Finish layer D~~ — **DONE 2026-08-13**, see `bug-node-index.tsv` and the CLOSED
   block above. The "try Skai-Web-App first, then Skai-Web-App-2" advice that used to
   sit here was **wrong** and is superseded by `FILE_ROUTING.md`: which file to query is
   determined by the SECTION, not by trial order, and Predict/Play/Onboarding/Social/
   Governance exist **only** in the old file.
3. **Layer E** — radius is done (`TOKENS.md`, measured off 473 bound variables).
   Colour remains: `get_variable_defs` per surface, mapped to repo tokens, with a
   validator in the pipeline.
4. **Ingest the snapshot harvest.** `build-registry.mjs:417-418` builds frames only from
   `<section>.nodes.txt`, so anything harvested but never pasted into a node list is
   invisible to `registry.json`. As of 2026-08-13 `snapshot.webapp.json` +
   `snapshot.games.json` hold **3,173** live top-level nodes and **1,216 of them have no
   registry entry**. The catalog therefore *understates* its own coverage — the data is
   on disk, the assembler just does not read it. Either feed the snapshots into
   `build-registry.mjs` or regenerate the `.nodes.txt` files from them; do not hand-add.
5. **Join bug counts onto rows** so every screen and component shows its open-mismatch
   count, and the catalog can be read as a worklist. `bug-node-index.tsv` now carries the
   `owningScreenNode` + `openRefs` columns this needs, so it is a join, not a harvest.
6. Titles for the 623 still-untitled frames, and `status.*.tsv` for the 15 sections
   that have none (1,200 frames inventoried but never assessed).

## ~~13 of 26 shipped casino games have no Figma screen~~ — RETRACTED 2026-08-26

⚠️ **This claim was WRONG and is retracted. Do not act on it.** It is kept, struck
through, because it circulated widely and lanes were told to treat those games as
undesigned. Full re-measurement in **`TRAPS.md` §3–§4**.

**Why it was wrong:** the method below says it cross-referenced against all 3,206
**titled** frames — i.e. it matched on frame *title*. Titles in the Games file
systematically name a different game than the page that owns them (Roulette's main
frame is titled `… > Scratchers`, Limbo's and Baccarat's are titled `… > Blackjack`,
Slide's is titled `… > Towers`). So a title grep for those games returned nothing and
that was read as "no design exists". This document already warned about the trap two
paragraphs below — and its own headline measurement walked straight into it.

Re-measured against the live file by **page name + the H1 TEXT node inside the frame**
(an oracle independent of the title): of the 13 named below, **seven have a real,
content-complete design** — video-poker, rps, fortune-wheel, roulette, bingo,
price-grid, baccarat. Only **cosmic-slots** and **vegas fortune** are genuinely
undesigned (pasted reference screenshots, zero frames). **safari-slots** has a full
design at all three breakpoints. The real undesigned surface is **SKAI Cross**, a
shipping game whose Figma page was renamed to Price Grid and its contents replaced.

The stale text follows, for provenance only:

> The render switch is `modules/skai-gaming/src/pages/play/Play.tsx:1402-1457`. Cross
> referencing every game it can mount against all 3,206 **titled** frames in the three
> files:
>
> **Designed (12)** — hilo, mines, plinko, chicken, crash, blackjack, coinflip, dice,
> towers, darts, keno, scratchers.
>
> **Shipped with NO game screen (13)** — baccarat, poker, video-poker, rps, slots
> (Vegas), fortune-wheel-pro, roulette-pro, gem-slots, bingo, safari-slots,
> cosmic-slots, mega-slots, price-grid.
>
> The only Figma mentions of those thirteen anywhere in the corpus are Play-browser
> **tile artwork** — `Cards - Fortune Wheel`, `Cards Large - Fortune Wheel On:hover`,
> `Cards - Cosmic Slots`. Thumbnails, not screens. This is the largest undesigned
> surface in the product.

Do not be reassured by the catalog sections named after four of them. `bingo`,
`fortune-wheel`, `video-poker` and `rock-paper-scissors` contain ONLY duplicated
scaffolding — `bingo.titles.tsv:5-6` is literally
`Skai > Play > Casino > Scratchers (1440 x 900px)` and
`Skai > Play > Casino > Blackjack (375 x 812px)`, copied when the page was created
and never renamed. A page-level ✅ on those is not design progress.

Two nuances that are Casey's call, not an auditor's assumption:

- **SKAI Cross** has real *component* design (`skai-cross.titles.tsv`:
  `SkaiCross/Currency Tab`, `Difficulty Card`, `Lane Marker`, `HUD Chip`, `Car`,
  `Stat Row`) but no assembled screen.
- `Skai > Play > Casino > Sample game` (+ `> Close game`, `> Game info`,
  `> My Stats`, `ALT`) may be a **generic shell every game inherits**. If that is the
  intent, the thirteen are "shell-covered, content-undesigned" rather than wholly
  undesigned — a much smaller job.

Stated bound on the evidence: 623 of the 3,829 catalogued frames are untitled, so
"no frame mentions this game" is evidence over **84%** of the corpus, not 100%.

The decision is design-or-pull, and it is a product call. Nothing here should be
built from the tile artwork.

## Rules the catalog enforces

- A page with no section is reported unless `pages.json.outOfScope` records **why**.
- A page whose section covers it only partially is reported once the gap is large in
  both absolute (≥10) and relative (≥25%) terms; `expectedDelta` acknowledges a known,
  accepted gap.
- `SECTIONS` is derived from the `*.nodes.txt` files on disk, and disagreements with
  the curated order list are reported in both directions. It is not a hand-kept list
  you can forget to update.
- A page's `✅`/`🚧` emoji is **not** evidence of design progress. Several Games pages
  are marked ✅ while containing only duplicated scaffolding from another game — see
  the note in `build-registry.mjs`.
