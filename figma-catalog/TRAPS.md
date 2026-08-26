# Measurement traps in this catalog — read before you conclude anything

Written 2026-08-26 by the catalog lane, from traps that produced a confidently
wrong answer **during this session**, not from recollection. Every number here
was measured; the command that measured it is named so you can re-run it.

The traps share one shape: **they fail toward a reassuring answer.** A missing
frame, a clean sweep, a matching radius. None of them throw.

---

## 1. `registry.json` uses TWO key formats, and the intuitive one is backwards

`build-registry.mjs:564`:

```js
const regKey = isPrimary ? id : `${fileKey}:${id}`;
```

`registry.fileKey` — the "primary" file — is **`3sSzw1KewMtUbeLAv7uW0r`, the OLD
file**. So:

| Frames in | Key format | Count |
|---|---|---|
| `3sSzw1KewMtUbeLAv7uW0r` (Predict, Play, Social, Governance, Onboarding, master-sheet, legal, user-flow) | **bare** `3456-3142` | **1,553** |
| `mhF3BkzlTaGiLzJ7kvpmVc` + `M6r9FEn042UWTQD1zvy6GM` | compound `fileKey:node` | 2,214 |

**The trap:** the natural lookup for a bug link is
`registry.frames[fileKey + ':' + node]`. That misses **all 1,553** primary-file
frames — i.e. every Predict, Play, Social, Governance and Onboarding frame,
which are exactly the sections carrying the most open bugs. It returns
`undefined`, which reads as *"this frame is not in the catalog."*

I hit this today. It made 34 fully-catalogued screens look like a layer-B
coverage gap, and I wrote that false conclusion down before checking.

**The correct lookup — use this, don't hand-roll it:**

```js
const key = fileKey === registry.fileKey ? node : `${fileKey}:${node}`;
const frame = registry.frames[key];
```

Every frame carries a correct `fileKey` **field** regardless of its key, so
`Object.values(registry.frames)` is always safe. It is only key-based lookup
that is asymmetric. There are **zero** node ids present under both forms, so the
two namespaces do not overlap — a bare-key hit is never ambiguous.

`SCHEMA.md:68-74` records the design intent. What was missing, and is the part
that actually bites, is the *consequence* above.

## 2. `cited: 0` means "never scanned" for 27 of the 34 sections that report it

Measured against `code-node-citations.json` → `nodeToFiles` (577 entries; the
61 + 131 below sum to `stats.cited: 192`, so this reconciles):

| Frames in | With a citation entry |
|---|---|
| `3sSzw…` (primary) | 61 of 1,553 |
| `mhF3…` **v1** pages — home, trade, wallet | 131 of 2,214 |
| `mhF3…` **v2** pages — home-2, wallet-2, trade-2 | **0** |
| `M6r9…` **the entire Games file** (all 23 game sections + cover-images) | **0** |

**34 sections report `cited: 0`; 27 of them are sections the scan has never
reached.** For those, `cited: 0` carries no information about whether code
references the frame.

⚠️ `SCHEMA.md:73-74` says citations were built "from the primary file only". That
is now out of date — mhF3's v1 pages do carry 131 citations. The accurate
statement is the table above: the gap is the **Games file and the v2 pages**, not
"every secondary file".

**And the guard that is supposed to catch this is circular for exactly those
sections.** `verify-catalog-counts.mjs:157-167` asserts *"every cited:0 section is
a true zero, not a suppressed one"* by testing whether any of the section's node
ids appear in `nodeToFiles`. For a section the scan never covered, none can — so
the check passes by construction and reports `ok`. It is a real check for the
seven primary-file sections and a tautology for the other 27.

Do not cite that green tick as evidence a Games section has no code behind it.

## 3. Frame TITLES name the wrong game across the whole Games file

Not two frames — **systematic**. Measured today by resolving every open bug node
to its owning page, then reading the H1 TEXT inside the frame as an independent
oracle:

| Page (truth) | Its main frame is TITLED | H1 text inside (truth) |
|---|---|---|
| ✅ Limbo | `… > Blackjack (1440 x 900px)` | **Limbo** |
| ✅ Roulette | `… > Scratchers (1440 x 900px)` | **Roulette** |
| ✅ Rock Paper Scissors | `… > Blackjack (1440 x 900px)` | **Rock Paper Scissors** |
| ✅ Video Poker | `… > Scratchers (1440 x 900px)` | **Video Poker** |
| ✅ Fortune Wheel | `… > Scratchers (1440 x 900px)` | **Fortune Wheel** |
| ✅ Bingo | `… > Scratchers (1440 x 900px)` | **Bingo** |
| ✅ Keno | `… > Scratchers (1440 x 900px)` | **Keno** |
| ✅ Price Grid | `… > Blackjack (1440 x 900px)` | **Price Grid** |
| ✅ Baccarat | `… > Blackjack (1440 x 900px)` | **Baccarat** |
| ✅ Slide | `… > Towers (1440 x 900px)` | **Slide** |
| ✅ Chicken | `… > Hi-Lo Start (1440 x 900px)` | **Chicken** |
| ✅ Darts | `… > Hi-Lo Start (1440 x 900px)` | **Darts** |

The **`Directory` frame lies too** — Baccarat's reads `Skai Originals >
Blackjack`, Slide's reads `Skai Originals > Towers`. So does the mobile cut
(Slide's 375 frame is titled `… > Blackjack`).

**The reliable identifiers, in order:** the owning **PAGE name** → the **H1 TEXT
node** inside the frame → the artwork. Never the frame title, never the
Directory, never the registry `notes`.

★ The corollary that costs the most: grepping `*.titles.tsv` for a game name
returns nothing for these twelve, which reads as *"this game has no Figma
design."* It has one. See §4.

### The debris is not only in titles — it is in the CONTENT, and transcribing it violates the no-mock-data rule

The H1 oracle identifies the frame. It does **not** certify everything inside it.

Towers' mobile page `10130-14171` is genuinely Towers, but its Community-wins rows
all read **"Blackjack"**, with named players and dollar payouts, and it carries a
**"Try Blackjack in Fun Mode"** CTA. That is copy-paste debris from the page the
frame was duplicated from — surfaced by the towers/rps/keno/bingo lane, which
correctly refused to transcribe it.

Why this one is sharper than a wrong title: **a wrong title wastes your time; a
transcribed sample row ships fabricated winnings.** Named players with dollar
payouts, rendered as real, is exactly what the no-mock-data rule
(`CLAUDE.md`) forbids, and it would arrive looking like a faithful Figma
implementation.

So: identify the frame by page + H1, then treat **sample data, leaderboard rows,
community-wins entries and cross-game CTAs inside it as unverified** until the
content matches the game. If a row names a different game, it is debris, not spec.

### ⚠️ Where the TEXT oracle itself fails: OUTLINED COPY

The oracle this whole section recommends assumes copy is a `TEXT` node. On
artwork it often is not, and then it fails silently — raised by the cards lane,
measured here.

`modules/skai-gaming/src/assets/games/blackjack/felt-ribbon.svg`: **0 `<text>`,
0 `<tspan>`, 30 `<path>`.** Grepping it for `Perfect Pairs`, `Blackjack pays` or
`21+3` returns **0 hits each** — the copy is outlined into the paths and is on
screen the whole time.

The Figma side matches. The Blackjack board frames `9178-8146` / `9178-8257`
carry **5 TEXT nodes between them, every one a digit** (`3`,`3`,`6`,`3`,`3`) —
against **69 VECTOR nodes**. Ask those frames for their first TEXT and the answer
is `3`.

So scope the oracle honestly:

| Level | TEXT oracle |
|---|---|
| page / screen frames (`9738-13101` etc.) | **works** — the game name is a real TEXT node |
| board & felt artwork | **fails** — copy is outlined into vectors |

★ **A text-node count, a title grep and a string grep over the asset all come
back clean on copy that is plainly visible.** Three independent-looking checks,
one shared blind spot — none of them reads paths.

Two consequences already banked:

- Report `b6a6e296` ("payout labels positioned slightly differently") is **not
  reproducible, and that is the finding**: nothing in the app places those
  strings. Moving them means re-exporting the asset.
- `BaccaratGame.tsx:1677-1700` records the sharp end — reusing that same export
  on the baccarat felt would have printed **Blackjack's paytable** behind
  "Tie Pays 8 to 1", visible only on render.

#### So how DO you check outlined copy? Read the paths.

The cards lane built this for `b6a6e296`; reproduced independently here.

Parse the `d` attribute into absolute points, collect the on-curve points **and**
the cubic control points, take min/max. That is the **control hull**. Compare it
against Figma's vector bbox. Reusable ~35-line `hull()` in
`modules/skai-gaming/src/components/play/games/cards/blackjack/blackjackRibbonLabelParity.test.ts`
(mutation-checked: a +3px shift of the Perfect Pairs outline fails it).

My independent run against Figma `9178-8240/8241/8242`:

| | dx | dw | dh |
|---|---|---|---|
| `Path 293` "Blackjack pays 3 to 2" | -0.0003 | -0.0001 | 0.0000 |
| `Path 294` "Perfect Pairs" | 0.0000 | -0.0001 | 0.0000 |
| `Path 295` "21+3" | +0.0003 | 0.0000 | 0.0000 |

Three caveats, all load-bearing:

1. **It is a HULL, not a bbox.** The control hull *contains* the true outline. It
   is near-exact for glyphs because their control points hug the curve; on art
   with wide-swinging beziers it will read larger than Figma. The method is
   "compare hulls, expect near-agreement **on type**", not "this is the bbox".
2. **Establish a common origin first.** Raw `y` disagreed by **201.6178** on all
   three labels here — because Figma's `x`/`y` are parent-relative and the SVG has
   its own space. The tell that this is an origin shift and not movement is that
   the offset is **constant**: spread across the three was 0.0001. A *varying*
   offset is real drift. Compare the spread, not the offset.
3. **Do not hand-roll the number tokenizer.** `felt-ribbon.svg` contains
   `3.88007e-05`. The common shortcut `-?[\d.]+` splits that into `3.88007` and
   `-05` — two tokens where there was one, which knocks every later coordinate in
   that path out of pairing. Verified: the shipped regex
   `-?\d*\.?\d+(?:[eE][-+]?\d+)?` handles it; the naive one does not. One `e` in
   50KB of path data is enough to corrupt a whole path silently.

## 4. "13 of 26 shipped casino games have no Figma screen" is WRONG

`CATALOG_DESIGN.md` carries that claim, and its own method line explains the
error: *"Cross referencing every game it can mount against all 3,206 **titled**
frames."* It matched on frame title. Per §3, the titles lie.

Re-measured 2026-08-26 against the live Games file, using page + H1 text:

**Have a real, content-complete design** (previously listed as undesigned):
`video-poker`, `rps`, `fortune-wheel`, `roulette`, `bingo`, `price-grid`,
`baccarat` — plus `limbo`, `slide`, `towers`, `keno`, `darts`, `chicken`, which
now have their own pages.

Proof is content, not titles: Roulette has `Chip Value: 0.01` and a 1–10B chip
ladder; RPS has `Rock` / `Paper` / `Scissors`; Video Poker has a
`0.00x/1.50x/2.00x/3.00x/5.00x` paytable; Bingo has `Balls Dropped` /
`Shuffle Card`; Baccarat has `Tie Pays 8 to 1` at 1440 **and** 375.

**Genuinely undesigned right now** — reference screenshots only, no frames:
`Cosmic Slots` (6 pasted screenshots), `Vegas fortune` (1 screenshot).

**In progress, and the distinction matters:**
- `Safari Slots` — **real design at all three breakpoints**: `10272-4179`
  (1440×3467), `10272-3834` (768×1627), `10272-4933` (375×1605), plus load
  screens. Its page is 🚧 and `pages.json` called it *"MOSTLY REFERENCE, NOT
  DESIGN"* — that note is stale, harvested 07:51 today, before the frames landed.
- `Gem Slots` — has Directory + breakpoint markers + 3 frames, but the H1 text of
  every one reads **"Safari slots"**, and the ids are in Safari's `10285-*`
  range. This is a fresh duplicate that has not been re-skinned. **Here the text
  oracle agrees with the title**, which is exactly what tells you it is a copy
  rather than a mislabel.

`SKAI Cross` is the real gap: page `9660:2` was renamed to `✅ Price Grid` and its
contents replaced, so a **shipping** game now has no Figma page at all.
(`pages.json.unmappedSections.skai-cross` already records this correctly.)

## 5. Radius: the table circulating in lane briefs is the DEAD declaration

Lane briefs are quoting **`sm 4 / md 8 / lg 12 / xl 16 / 2xl 24`**. That is
`skaiBorderRadius` in `design-tokens.ts:1282-1290` — and the preset **overrides
three of those keys after spreading it**
(`modules/skai-ui/src/lib/tailwind-preset.ts:392-397`):

```ts
borderRadius: {
  ...skaiBorderRadius,
  lg: "var(--radius)",             // 12px
  md: "calc(var(--radius) - 2px)", // 10px
  sm: "calc(var(--radius) - 4px)", //  8px
},
```

`--radius: 0.75rem` = 12px (`src/index.css:539`). Root `tailwind.config.ts:47`
consumes the preset via `presets: [skaiPreset]`.

| Class | Figma value (stock Tailwind v3) | **We actually ship** |
|---|---|---|
| `rounded-sm` | 2px | **8px** (not 4px) |
| `rounded` | 4px | 4px |
| `rounded-md` | 6px | **10px** (not 8px) |
| `rounded-lg` | 8px | 12px |
| `rounded-xl` | 12px | 16px |
| `rounded-2xl` | 16px | 24px |
| `rounded-3xl` | 24px | 24px |

**Why the brief's version is dangerous, not merely imprecise:** told "our sm is
4px", a lane reading Figma 4px ships `rounded-sm` and paints **8px**; reading
Figma 8px it thinks "that's our md" and ships `rounded-md`, painting **10px**.
Both land wrong, in the direction of *looking* deliberate.

**Always write the pixel literal** (`rounded-[8px]`), never the token name, and
say which you used. Full conversion table + sourcing: `TOKENS.md`.

### …but the override is PARTIAL, and over-applying it flags false deltas

Independently derived by the towers/rps/keno/bingo lane, and worth stating
because it caused the opposite error. Only **`sm`, `md` and `lg`** are
overridden. **`xl` (16px) and `2xl` (24px) survive the spread untouched.**

So a frame specifying **16px** maps correctly to `rounded-xl`, and that is **not**
a delta. An earlier triage note on report `f1bca2ea` listed `rounded-xl` as a
mismatch against an RPS frame's 16px and nearly had it "fixed" to something else.

Reading "the preset overrides the spread" and applying it to the whole ramp is
the mirror image of trusting the dead declaration — both end in a wrong class.
The rule that survives both: **match on the resolved pixel VALUE.** If you must
read a token, `xl`/`2xl` are safe to read from `design-tokens.ts`; `sm`/`md`/`lg`
from that same table are lies.

## 6. Plugin-API getters throw on access — you cannot feature-detect them

`typeof node.findAllWithCriteria === 'function'` **throws** on a `RECTANGLE`:

```
TypeError: node.findAllWithCriteria: no such property 'findAllWithCriteria' on RECTANGLE node
```

Optional chaining does not save you either. It is the same shape as the
documented `componentPropertyDefinitions` gotcha. Branch on `node.type` against
an explicit whitelist:

```js
const CONTAINERS = ['FRAME','GROUP','COMPONENT','COMPONENT_SET','INSTANCE','SECTION','BOOLEAN_OPERATION'];
if (CONTAINERS.indexOf(node.type) !== -1) { … }
```

Cost me three failed `use_figma` fan-outs today, twice after a "fix".

## 7. Joining on a column that does not exist yields a silent zero

My first coverage diff keyed `bug-node-index.tsv` rows on `o.node`. The column is
`refNode`. Every lookup produced `undefined`, the join matched **0 of 431 rows**,
and the script cheerfully reported **181 uncatalogued frames**. The real number
was 142, and the 39-row difference was pure instrument error.

Nothing threw. The output was a plausible, actionable-looking list.

**Assert your join found something.** A join that matches zero rows is a bug
until proven otherwise — print the hit count and eyeball it before you believe
the miss list.

### In a shared tree the same bug reads as "a peer clobbered my work" — and that is worse

Nineteen lanes are editing this checkout, so a false negative does not arrive as
"my query is wrong". It arrives as *"my content is gone."* The natural response
is to restore the file from a backup, which is precisely the move that has
already nearly deleted a peer's edits here (`LANE_BRIEF_V2`: never restore a
whole-file backup; a peer's edit lands between your backup and your restore).
**So a bad oracle does not merely mislead you — it recommends a destructive fix.**

Two instances, both on 2026-08-26, from different mechanisms:

- The towers lane grepped its status rows for `Advanced OFF` and
  `3,208 points staked`. Both strings are real — but they live in a **code
  comment** and a **bug report**, never in the `.tsv`. Two claims reported
  missing; nothing was missing.
- Then this file's author, writing an "anchored" integrity check *specifically to
  avoid that*, searched `TRAPS.md` for `felt-diligence` with a case-sensitive
  `includes()`. The text says `Felt-diligence` — sentence-initial. Reported MISS
  on a file that was byte-identical to HEAD.

★ **Before raising a clobbering alarm, ask git, not your grep.**
`git diff HEAD -- <file>` (empty output = unmodified) and `git status --short`
answer *"was this file changed"* directly. They do not depend on your pattern,
your casing, or your memory of which artifact you wrote a sentence into — which
is the whole reason a grep failed twice in one afternoon. Confirm the file
actually changed **before** you go looking for what changed in it.

#### That is only step one, and on its own it answers the wrong question

The towers lane made the correction, and it matters: with nineteen lanes editing,
**`M` is the expected state.** `git diff HEAD` is non-empty on every file worth
checking, so it tells you the file moved and nothing about whether *your* content
survived. It settles the alarm only in the case where nothing happened.

The check that actually settles it compares **values, not strings**: pull your
own committed version with `git show <your-sha>:<file>`, extract the field you
care about, extract the same field from the working tree, and diff the two. It
never names a search string, so it cannot fail on casing or on which artifact you
were remembering.

Run on the three rows in question — `git show e881819:` and `6812b8c:` against
the tree, comparing column 5 — it returns an unambiguous answer. **All three**
gained the same appended `CORRECTED 2026-08-26 (was unknown)` note, with the
original prose intact as an exact prefix; columns 1–5 changed; nothing was
removed or altered. Additive, not destructive.

**So: `git diff HEAD` to learn the file moved. Value-diff against your own commit
to learn whether it moved AT YOUR EXPENSE.** Only the second distinguishes *"a
peer edited this"* from *"a peer clobbered this"* — and that is the distinction
deciding whether anyone reaches for a backup.

#### ⚠️ A bare integer is not a measurement — state the unit, or use no number at all

Two lanes measured that same append and reported **+175** and **+179**. Each
then treated the other's figure as an error. Neither was wrong:

| Unit | towers col 5 | delta |
|---|---|---|
| UTF-8 **bytes** (`Buffer.byteLength`, or a `latin1` read) | 4000 → 4179 | **+179** |
| **code points** / JS code units (a `utf8` read) | 3992 → 4167 | **+175** |

The appended text opens `U+0020 U+26A0 U+FE0F` — `⚠️` is two code points at
three bytes each, so bytes exceed characters by exactly 4. Reading a file with
`latin1` yields **byte** counts while looking exactly like character counts, and
that is how one of these was reported as characters.

★ The values were never in conflict; only the units were, and neither side
stated one. So the closing form of this whole file's lesson: **a number without
its unit is not a measurement**, and "which unit am I counting in" is part of the
checker's state — the thing §12 says a real check must not depend on.

**The fix is to stop counting.** The prefix test —

```js
current.startsWith(mine)   // true
```

— answers *"is my content still intact"* exactly, needs no length, no unit and no
encoding decision, and would have been immune to all of it. Prefer a value
comparison over a count every time; a count invites a unit argument that the
comparison cannot have.

## 8. `registry.json` is DERIVED — diffing against it dates the last rebuild

When the compound-key bug (§1) made 34 screens look absent, my second hypothesis
was "the registry is stale relative to `*.nodes.txt`." I ran
`node build-registry.mjs` to prove it.

Result: **3767 → 3767 frames, 0 added, 0 removed, 0 verdict drift.** A complete
no-op. The registry was already current; the lookup was wrong.

Two lessons: check `<section>.nodes.txt` (the source) before calling anything a
catalog gap — and a rebuild is a cheap, safe way to test a staleness hypothesis,
because it is verifiably idempotent.

---

## The 2026-08-26 backlog re-measurement (for anyone re-deriving coverage)

Open = `status in (new, needs_info, triaged, in_progress, backlog)`.

| | count |
|---|---|
| open reports carrying a Figma URL | 279 |
| distinct `(fileKey, node)` pairs | 256 |
| already a `registry.json` frame | 10 |
| already a `bugref-aliases.tsv` row | 65 |
| already a `bug-node-index.tsv` row | 39 |
| newly resolved and appended today | **142** |
| **unresolvable (`gone`)** | **0** |

All 142 resolved in the file the link named — no retargets, no deletions. The
gap was **staleness of the index against a turned-over backlog**, not missing
design. `bug-node-index.tsv` now holds 578 data rows.

Note the free-text sweep (figma.com URLs in `title`/`description`) added **0**
reports beyond the `figma_link` column this time. It cost nothing to check and
it found 14 last time — keep running it, but do not assume it always yields.

---

## 9. Two shared-tree git traps that both bit during this wave

Not measurement traps, but they destroyed information today and one of them has
now caught two different agents.

**`@'...'@` is PowerShell. The Bash tool is Git Bash.** Pasting a PowerShell
here-string into `git commit -m` does not error — it commits a message whose
first line is a literal `@`, pushing the real subject to line 2. The reflog shows
this happening twice in this wave (`85a63c2 commit: @`, `4b6102c commit: @`).
`git log --oneline` then reads `@` where the subject should be. Use a real
heredoc: `git commit -F - <<'MSG' … MSG`.

**`git commit --amend` is unsafe in a shared checkout, and fails silently.**
Nineteen lanes commit into this tree. In the ~2 minutes between my commit and my
`--amend` to fix the `@` subject, a peer committed. `--amend` rewrites whatever
HEAD points at *now*, so it rewrote **the peer's commit**, replacing their
message with mine. Their content was untouched and I restored their message from
`git reflog` (which is the recovery path — the old commit object survives), but
nothing warned me: the amend reported success and `git log --oneline -1` showed a
plausible result.

★ Before `--amend`, confirm HEAD is still the commit you think it is:

```sh
git log -1 --format=%H   # compare against the hash your commit printed
```

Prefer a new follow-up commit over amending. A bad subject line is much cheaper
than silently overwriting a peer's work.

---

## 10. A responsive sweep measures REACHABILITY, never whether the thing WORKS

Found by the towers/rps/keno/bingo lane; verified here against skai-gaming
`04cd2a2` ("fix(bingo): stop charging players for rounds the UI called a
failure") and `bingoRailEnvelope.test.ts:10-25`.

The `@2026-08-25/games-375-routing` sweep recorded Bingo as `mobile=partial` on a
tap-target measurement. Its bar, quoted from `SCHEMA.md:348`, is *"bet amount,
currency toggle, primary action and result all reachable, no horizontal page
scroll, primary CTA ≥ 44px."* Every one of those held.

**Bingo could not complete a single round.** `BingoGame` read
`result.drawnNumbers`; the POINTS rail returns the same data as `drawnBalls`, so
the UI showed "Failed to play" on a round that had **already settled with the
stake debited**. The lane measured 13 of 13 ledger rounds failing, 3,208 points
staked against 11 returned.

Two things to take from it:

- **`renders` / `reachable` / `partial` on a viewport row is not evidence the
  game is playable.** A responsive verdict and a functional verdict are different
  measurements, and `status.*.tsv` column 2 does not distinguish them. Reading one
  as the other is how a game stayed listed as merely `partial` while it was
  taking money for rounds it then called a failure.
- **The field-name contract differs BY RAIL.** The KEEPER rail emits
  `drawnNumbers` (it renames `round.drawnBalls`); the POINTS adapter emits
  `drawnBalls`. So the component worked on one rail and failed on the other —
  a defect invisible to any check that exercises a single rail.

★ Anything phrased as a money path deserves a played round, not a screenshot.

### The class was swept, and POSITION matters more than the name

The by-rail field-name class was swept across all 12 game components by the
towers/rps/keno/bingo lane; three named cases spot-checked here. **Bingo was the
only refusal gate on a field the points rail does not emit.** Do not go looking
for a wave of these — the sweep is done.

What it found, and why the result is the useful part:

| Read | Where | Consequence |
|---|---|---|
| Bingo `result.drawnNumbers` | **refusal gate**, after the debit | round settles, UI says "Failed to play" |
| FortuneWheelPro `result.isBonus` | display | history label shows `${multiplier}x` instead of "BONUS" |
| Cosmic/SafariSlots `result.stats` | display, guarded | session counters silently do not update |

`GemSlotsGame`'s `result.hadWins` looks like a fourth and is **not**: that
`result` is `executeCascade`'s own local return type
(`GemSlotsGame.tsx:1722`, `{newGrid, hadWins, totalPayout}`), not a settlement
envelope. Verified here — a name-only grep flags it.

★ **The generalisation to keep: a mismatch in a DISPLAY read degrades, a mismatch
in a GATE lies.** The audit worth running on any new game is therefore *"does
anything gate the round on a field name?"* — not *"do the field names match?"*
The second question returns noise; the first returns money bugs. And the gate is
only severe because it sits **after** the debit: it cannot refuse the bet, it can
only hide a round that already completed.

---

## 11. `Math.round` in a measurement script manufactured a difference that reached code

Small, but it propagated into a committed source comment, which is why it is here.

My first sweep of the Towers panel frames reported heights with `Math.round`.
That printed the mobile Advanced-ON panel as **777** and the desktop one as
**777.33**, and the towers lane — reasonably — carried that asymmetry into a
frame-reference table in `TowerBetPanel` (skai-gaming `5efbba8`).

Re-measured at two decimal places, **both are 777.33**. There is no
desktop/mobile difference. The rounding invented one.

The real shape is a clean 2x2, and it is worth having because it settles a report:

| | Advanced OFF | Advanced ON |
|---|---|---|
| desktop 356w | `10130-13720` 621h, 19 text nodes | `10130-14013` 777.33h, 35 |
| mobile 347w | `10130-14946` 621h, 19 text nodes | `10130-14802` 777.33h, 35 |

Delta is **156.33px** and +16 text nodes in both rows, identically.
**"Advanced" appears as a label in all four frames**, and the designer drew both
states at both widths. Better still, the towers lane confirmed the label *and* its
toggle are present in the collapsed frames (`10130:15019`/`15020`) with none of
the rows they reveal — direct evidence, not an argument about button semantics.
That closes report `176075a8` from the frames rather than by inference.

#### ⚠️ CORRECTION: 156.33 is NOT the size of the disclosed block

This section previously said the 156.33 delta was "exactly the On Win / On Loss /
Stop-on block". **That is false, and I repeated it from the towers lane without
testing it.** They caught it and I re-measured:

| | content ends | frame height | trailing slack | CTA y |
|---|---|---|---|---|
| collapsed `10130-13720` | 433.33 | 621 | **187.67** | 381.33 |
| expanded `10130-14013` | 761.33 | 777.33 | **16** | 709.33 |

The disclosed block is **328px** — the CTA moves 381.33 → 709.33, which is
4 rows x 66 + 4 gaps x 16. The frame grows only 156.33 because the collapsed
frames carry 187.67 of trailing slack against the expanded pair's 16, and
`187.67 - 16 = 171.67 = 328 - 156.33`. Both numbers are real; they measure
different things.

★★ **A DERIVED claim needs its own check, even when every input to it is
verified.** This is the purest instance in the file and the one none of the other
rules catch. There was no bad instrument and no bad oracle: 156.33 was correctly
measured, the block was correctly identified, and "156.33 *is* the block" was a
**third proposition** resting on two true ones, which nothing was ever pointed at.
It got asserted because the two numbers sat next to each other and the equation
looked tidy.

§7's "compare values, don't count" does not help here — both values were right.
The only thing that catches it is noticing that a *relationship between two
measurements is itself a claim*, and measuring the relationship directly (here:
where does the CTA actually move to?).

The conclusion never rested on the arithmetic, which is why this is a correction
rather than a retraction.

★ Two things worth taking: report geometry at the precision you measured it, not
a prettier one — a rounded number is a claim. And when a lane builds on your
measurement, the inference is yours to check too, not just the number.

**The reader-side half, which is the one that would actually have caught it.**
The rounding created the bad number; publishing it did not have to follow. The
table went out with **777 next to 777.33 in adjacent rows** — two values that the
surrounding argument said were the same control at two widths, differing by a
third of a pixel. That shape is the tell. A third of a pixel is not a design
decision; it is a unit artifact, a rounding artifact, or a transcription error,
and none of those are things to publish.

So: when two numbers your own model says should be identical differ by a
sub-pixel amount, re-measure before writing it down. Treat the near-miss as
evidence about your instrument, not about the design. (Ground truth here was
`height="777.3333129882812"` on both.)

Provenance is worth keeping too, and was: `10130-13720` measured by the catalog
lane; `10130-14013`, `10130-14946`, `10130-14802` by the towers lane. Recorded as
a split rather than blurred into "measured" — which is what let the disagreement
be traced to one instrument instead of argued about.

---

## 12. A citation that names a CONTAINER where the argument needs a CHILD

Third sighting of one root cause, so it generalises. Raised by the towers lane;
verified and extended here.

Four reports argued that Towers / RPS / Roulette / Fortune Wheel draw their
Manual|Auto row from one reused component, "dimensionally identical", citing
`9903:2271` / `9733:6227` / `9907:1653` / **`10130:13720`**.

The premise is right. The Towers citation is not: `10130:13720` is the whole
**356x621 bet panel**. The row is a child. All four rows measured:

| | Advanced OFF | Advanced ON |
|---|---|---|
| desktop 356w | `10250-15211` | `10250-15195` |
| mobile 347w | `10130-15021` | `10130-14931` |

Every one is **324x42** with two `card` children at **158x34**, x=4 and x=162 —
so the "dimensionally identical" claim now holds on measurement, not assertion.
(`10250-15211` was the one nobody had; the towers lane correctly claimed no id
for it rather than guessing.)

### Why it happened — and why the dimension check is the only reliable tell

This was not carelessness. **Three different nodes share the name
`Frame 1000004105`**, and they are not a parent and its own child:

| Node | Size | What it is |
|---|---|---|
| `10130-14013` | 356 x 777.33 | the desktop AUTO **panel** |
| `10250-15195` | 324 x 42 | the Manual\|Auto **row** inside `10130-14013` |
| `10250-15211` | 324 x 42 | the Manual\|Auto **row** inside `10130-13720` |

The name spans **two different parent panels at two different depths** — and the
other parent, `10130-13720`, is called `Frame 270`, a different name entirely. So
this is worse than a local ambiguity: eyeballing one frame's subtree would not
reveal it, and neither would scoping a search to the frame you think you are in.
A name here does not merely fail to identify a node; it points at a node in a
*different* frame at a *different* depth.

(Same family as §3's lying titles — a name is not an identifier in this library.
The registry's own key-format split in §1 is the machine-readable version of the
same problem.) The discriminator that works is geometry —

★ **Check that the cited id's dimensions match the dimensions your argument is
about.** `356x621` was never going to be the same component as a `324x42` track.
A container id in a child's place reads as precise, survives review, and is
wrong; the size mismatch is mechanical and catches it in one call.

### The same distinction, three different jobs

Worth stating because it kept resolving different questions:

1. **A nodes list may not contain a child id** — its contract is top-level
   children of a page (§8, and `10130-13760`/`13771` were excluded on it).
2. **Code MAY cite a child id** — `TowerBetPanel` legitimately cites
   `10130-13760` for the balance row it actually draws. Different contract.
3. **A cross-file argument must cite at the level it argues about** — this
   section.

Rules 1 and 2 look contradictory and are not; the contract differs per artifact.
Getting 1 right does not give you 3.

★ **And satisfying 1 and 2 is what lets 3 through.** The towers lane named the
mechanism precisely: the two had been collapsed into a single instinct about
being careful with child ids — so having exercised that instinct twice, the third
case *felt* already handled. Felt-diligence is the failure mode. It is why the
third rule needs a mechanical check (the dimension test above) rather than more
care: care was already being applied, to the wrong two questions.

**Demonstrated, not just asserted.** The first draft of this very section cited
§1 as the source of the `Frame 270` collision. §1 is the registry key-format
split — related, but not that example. So the author was writing the document
*about* misattributed references, with full attention on that exact class, and
still misattributed a reference. That is the argument for the mechanical check in
its strongest form: attention was not the missing ingredient, and adding more of
it would not have helped. Only a check that does not depend on the checker's
state catches this — which is what the dimension test is, and what "read it
carefully" is not.

---

## 13. A `child` alias is true and still hides the more useful relationship: TWINS

Raised by the cards lane, verified here with `getNodeByIdAsync` plus a
`findAll` descendant test.

`bugref-aliases.tsv:496` maps `M6r9FEn042UWTQD1zvy6GM:9178-8257` to the page
frame `9003-117337` with reason `child`. **That row is correct** — `9178-8257`
really does sit at depth 6 under `9003-117337`. Nothing to fix.

But the relationship that answers questions about it is a different one:

| | `9178-8146` | `9178-8257` |
|---|---|---|
| name | `Desktop Start` | `Desktop` |
| size | 954 x 621 | 954 x 621 |
| depth | **0** (child of the page) | **6** (under `Frame 658`) |
| children | `Frame 1000004005` @ 764,-72 · 130 x 143.6842 | *identical* |
| | `Frame 1000004100` @ 230.88,65 · 492.2396 x 491 | *identical* |
| TEXT / VECTOR | 5 / 69 | 5 / 69 |

Descendant test: **`9178-8257` is NOT inside `9178-8146`** (`findAll` returns
nothing). They are **twins** — same board, drawn twice, in different places in
the tree, at different depths, under different parents.

★ **An alias schema with only `child` / `page` / `gone` cannot express "duplicate
of", so a true `child` row silently becomes the only recorded relationship.**
Reading it, you go looking for a parent-child explanation of a difference that
has none.

**And the duplicate is an asset, not a nuisance.** Two frames that agree on every
coordinate are a stronger oracle than one — if a measurement reproduces across
both twins it is the spec, and if the twins disagree, that disagreement is itself
the finding. When an alias says `child`, it is worth one call to check whether it
is really a sibling: compare sizes and child geometry before assuming hierarchy.

---

## 14. A single frame of a ROTATING part cannot establish its rest orientation

Raised by the roulette/fortune-wheel lane. New class, and the discriminator is
clean.

Roulette's wheel turret was transcribed off `9925:16308`, and the shipped code put
it at 45°. The static frame `9948:22957` puts the tips on the cardinals; the
transcribed frame caught it around 16.5°, because the turret rides *inside* the
rotating wheel and that frame is a spin-state capture.

Checking it here made the mechanism sharper than "it's a different state":
**`9925:16308` is a `RECTANGLE`, 1334x1380, with zero children.** It is a pasted
render, not a live frame — so there is no turret node to read an angle from at
all, and any angle taken from it was measured off pixels of a frozen animation.

★ **The tell: ratios agree, the angle does not.** Divide the rotation out and the
two frames match on every proportion — tip 0.447 vs 0.454 of the inner disc,
waist 0.153 vs 0.150, hole 0.093 vs 0.099. Two frames that agree on all ratios and
disagree only on angle are **the same design mid-animation**, not two designs.
Treat the one whose features land on the cardinals as rest state.

Related, and the reason `get_metadata` alone will not save you: Fortune Wheel's
`9733:7556` is a 50-tick **annulus** — one stroked circle split into 50
round-capped arcs — but its nodes are all named `Ellipse` and all sized alike, so
the layer list reads as 50 overlapping full-size ellipses. (Confirmed to one level:
`Group 319` holds `Ellipse 202` 446.06², `Group 315` 399.595², `Frame 1000004188`
185.858². The 50 arcs sit below that; I did not descend further.) **Layer names
describe the construction, not the render.**

### One component, instanced per game — verified pixel-identical

The fairness sub-bar is a single component placed on every game page, not a
look-alike rebuilt per game. Confirmed by comparing children:

| | Roulette `9799-15326` | Dice `9061-16828` |
|---|---|---|
| frame | `Frame 656` 163.333 x 30 | `Frame 656` 163.333 x 30 |
| `icons/action` | x=0 w=13.333 | x=0 w=13.333 |
| `CTA/button` x3 | x=23.333 / 63.333 / 103.333, w=30 | identical |
| `icons/graphical` | x=143.333 w=20 | identical |

A 10px pitch, matching to the pixel. That is why Limbo/Mines/Plinko already import
the sub-bar glyphs from `assets/games/dice/` — same glyphs, correctly shared.

⚠️ Note the citation for the Dice side was given as `9061-16826`. That id is the
**1318 x 54 wrapper**; the 163.333 x 30 cluster is `9061-16828` inside it. Exactly
§12's container-for-child pattern, and the dimension check is what surfaced it —
`1318 x 54` was never going to be the same object as a `163.33 x 30` cluster.
