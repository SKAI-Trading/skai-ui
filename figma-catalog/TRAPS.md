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
