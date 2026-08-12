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
| **D. Nodes** | What is node X, and which screen owns it? | **partial** — needed to make bug links resolvable |
| **E. Tokens** | What is the real hex/radius/spacing, and what does code call it? | **not started** — the 35% colour bucket lives here |

### Why layer C is the highest-value one to finish

`components.tsv` currently has every `impl` as `UNMAPPED` — we know the 25 Figma
components and their usage counts, but not which `@skai/ui` component owns each one.
Filling that column turns every component-level bug into a single-file fix, and makes
parity mechanically checkable: one component, one code owner, one set of tokens.

That mapping is also the prerequisite for Code Connect, which would let Figma itself
point developers at the right component.

### Why layer E matters more than its bug count suggests

This repo has documented token traps that produce exactly the "colour does not match"
report: `sky-blue` resolves to **#2DEDAD (green)** after the 2026-06-12 green-theme
directive, and `alien-green` (#2DEDAD) vs `alien-green-bright` (#17F9B4) are routinely
confused — a wave agent once "fixed" a colour *away* from Figma on a reporter's say-so.
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
2. **Finish layer D** — 179 bug nodes remain (151 unresolved in chunk B, 28 that
   resolved in neither app file and may be deleted, 7 in the Games file). Method:
   extract `node-id` from `figma_link`, `getNodeByIdAsync`, walk `parent` to the PAGE
   and record the last node before it as the owning screen. Try Skai-Web-App first,
   then Skai-Web-App-2 — ids were preserved across the move, so Home/Wallet/Trade ids
   resolve only in the latter.
3. **Layer E** — `get_variable_defs` per surface, mapped to repo tokens, with a
   validator in the pipeline.
4. **Join bug counts onto rows** so every screen and component shows its open-mismatch
   count, and the catalog can be read as a worklist.
5. Titles for the 623 still-untitled frames, and `status.*.tsv` for the 15 sections
   that have none (1,200 frames inventoried but never assessed).

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
