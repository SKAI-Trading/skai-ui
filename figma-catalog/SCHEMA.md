# Figma Design Tracking System — Schema

> **Moved 2026-07-28: this catalog now lives in the `skai-ui` submodule**
> (`modules/skai-ui/figma-catalog/` from the Skai-Trading working copy). It used to sit at
> the Skai-Trading repo root.
>
> **★ The `implFiles`, `citedByFiles` and `route` values are MAIN-REPO relative
> (`src/...`), and this file no longer lives in that repo.** A path like
> `src/components/home-redesign/PortfolioScreen.tsx` resolves against **Skai-Trading**, not
> against skai-ui. Nothing in the toolchain resolves them — they are read by humans and
> agents — but do not "fix" them to be skai-ui-relative, and do not assume a file exists
> locally just because a row cites it.
>
> Every script here locates its own data via `path.dirname(fileURLToPath(import.meta.url))`,
> so they are location-independent and needed no path edits. Verified after the move: the
> rebuilt `registry.json` is byte-identical to the pre-move one apart from `generated`.
>
> **Updating the catalog is now two commits**: one in the skai-ui submodule, then a pointer
> bump in Skai-Trading. `registry.json` regenerates on every build, so expect that pair
> routinely.

Purpose: a durable, machine-readable registry of **every** Figma page, frame, and
component in the SKAI redesign, tied to its implementation in code — accurate
enough to **verify** or **implement** any part to 100% on demand.

File key: `3sSzw1KewMtUbeLAv7uW0r` (Skai-Web-App). Link template:
`https://www.figma.com/design/3sSzw1KewMtUbeLAv7uW0r/Skai-Web-App?node-id=<NODE>&m=dev`

**Multi-file (added 2026-07-23):** the catalog now spans more than one Figma
file. `registry.json` carries a top-level `fileKeys` map (`{key: displayName}`)
and `sectionFile` (`{section: fileKey}`); every frame records its own `fileKey`,
`fileName`, and bare `node`. Links are built per-frame, so a section can live in
a different file. Current files:

| File key | Name | Sections |
|----------|------|----------|
| `3sSzw1KewMtUbeLAv7uW0r` | Skai-Web-App | home, wallet, trade, predict, play, pwa, onboarding, legal, master-sheet |
| `M6r9FEn042UWTQD1zvy6GM` | Skai-Games | dice, crash, mines, blackjack, coinflip, skratch, missing-play-images |

**Bug-report-sourced sections (added 2026-07-27).** Every section above except
three is sourced from `~/Desktop/figma.txt`. The exceptions — `onboarding`,
`legal`, `master-sheet` — come from Figma URLs in Supabase `bug_reports`, for
frames figma.txt never listed. See [BUGREF_AUDIT.md](BUGREF_AUDIT.md) and
`bugref-aliases.tsv`, which maps deep-linked child node-ids back to the covering
catalog frame so audits don't re-flag them as gaps.

**`trade` = 692 frames, the whole Trade page (re-scoped 2026-07-27).**
figma.txt's `Trade (7/27 update):` section is now the sole approved truth for
Trade, superseding the earlier 219-node `Trade:` heading. Its 692 links
decompose exactly into the old trade 219 + 64 bug-report-only Trade frames +
284 of the 285 `trench` frames + 125 new frames (mostly the 375px mobile tier
for Swap/Margin/Bridge/Launch/Perps/Dashboard). **The `trench` and
`trade-bugrefs` sections are therefore RETIRED** — all three described the same
Figma page, so they are folded into `trade` rather than left overlapping. The
one trench frame absent from the 692 (`9695-96406`) no longer resolves in Figma
at all; it is recorded as `gone` in `bugref-aliases.tsv`, and
`audit-figma-txt.mjs` reads those rows so a deleted-upstream id is not reported
as a permanent gap. Per-frame `status`/`verifiedAt` survived the fold because
`build-registry.mjs` preserves hand-set fields by node-id (120 verdicts carried
over, verified).

Note `audit-figma-txt.mjs` also carries a `SECTION_ALIAS` map: a figma.txt
heading does not always slugify to the catalog section key (`Trade (7/27
update):` → `trade`). Its heading regex must stay permissive enough to match
digits/parens/slashes — the original `[A-Za-z ]`-only pattern silently skipped
that heading, auditing its 692 links against nothing.

Node-ids are only unique *within* a file — the same bare id can name different
frames in two files (e.g. `6330-54594` is home scaffolding in Skai-Web-App and a
dice Breakpoint in Skai-Games). So frames from a **secondary** file are stored
under a **compound registry key** `"<fileKey>:<node>"` to avoid clobbering a
primary-file frame; the primary file keeps bare-node-id keys for back-compat.
`code-node-citations.json` is keyed by bare node-id and was built from the
primary file only, so secondary-file frames never inherit its citations.

The main file uses the `Skai > <Section> …` title convention; other files may
not (`sectionFile`→`NON_SKAI_SECTIONS` in `build-registry.mjs` drives a
per-file title grammar — e.g. Dice mixes `Skai > … > Dice [device]` device
frames with plain design-state names like `Desktop Full Game - Roll Over`).

## Files in `figma-catalog/`

| File | Content | Source | Needs Figma API |
|------|---------|--------|-----------------|
| `<section>.nodes.txt` | node-ids per section (home/wallet/trade/predict/play/dice) | parsed from `~/Desktop/figma.txt` | no |
| `<section>.titles.tsv` | `node-id <TAB> frame title` | `get_metadata` harvest (subagents) | yes |
| `code-node-citations.json` | which src files cite which node-ids (both directions) | grep of `src/` | no |
| `pages.json` | **live page inventory** for every tracked file: pageId, pageName, readiness, liveChildren, which sections cover it | `use_figma` harvest | yes |
| `registry.json` | **the master record** — one entry per frame (see below) | assembled from the above | no (assembly only) |
| `components.tsv` | Figma published/local components: `name <TAB> id <TAB> variantProps` | `use_figma` enumeration | yes |
| `bug-node-index.tsv` | **layer D** — every node-id referenced by an OPEN bug report, resolved to `{type, name, depth, owning screen, page, section}` | `getNodeByIdAsync` + parent walk | yes |
| `FILE_ROUTING.md` | which Figma FILE each page really lives in, and why the "old file / retry in the live file" rule is wrong for most sections | `figma.root.children` per file | yes |
| `TOKENS.md` | **layer E (started)** — Figma's radius scale vs the class we ship, with the conversion table | bound-variable read off 473 nodes | yes |
| `bp.mjs` | **the breakpoint dimension** — width constants, the verdict vocabulary, the column-6 parser, and the derived design-coverage helper. Imported by `apply-status.mjs` and `bp-report.mjs`; not runnable on its own | — | no |
| `bp-report.mjs` | breakpoint coverage report **and** the column-6 validator. Exits 1 on a malformed cell. `--gaps` lists every actionable row, `--hygiene` lists orphan and duplicate rows | reads `status.*.tsv` + `registry.json` | no |

## registry.json — per-frame record

```jsonc
{
  "generated": "<iso8601>",
  "fileKey": "3sSzw1KewMtUbeLAv7uW0r",
  "frames": {
    "<node-id>": {
      "section": "home|wallet|trade|predict|play",
      "title": "Skai > Home - welcome - with CTA 1VH (1440 x 900px)",
      // parsed from title:
      "screen": "welcome",              // the function segment
      "variant": "with CTA",            // state/variant qualifier (nullable)
      "viewport": "1440x900",           // device size
      "device": "desktop|tablet|mobile",// derived from viewport width (1440=desktop, 768=tablet, 390ish=mobile)
      // implementation linkage:
      "page": "✅ Trade",               // the Figma PAGE this frame's section lives on (from pages.json); null if unmapped
      "readiness": "ready|wip|meta|unknown", // ready-for-dev, from the page-name emoji — see below
      "citedByFiles": ["src/..."],      // files whose comments cite this node-id (from code-node-citations.json)
      "implFiles": ["src/..."],         // hand-verified implementing file(s) — set during mapping pass
      "status": "done|partial|not-started|unknown",  // ⚠ carries NO width — see the breakpoint section
      "bpStatus": "unknown",             // the breakpoint verdict at THIS frame's own `device`
      "route": "/... or ?tab=...",      // where it renders in the app (if routed)
      "notes": "",                       // gaps, backend deps, deviations
      "verifiedAt": null                 // iso when last render-verified against Figma
    }
  },
  "breakpoints": {                       // family-level, written by apply-status.mjs
    "<section>/<family>": {
      "desktop": "renders", "tablet": "renders", "mobile": "missing",
      "worst": "missing",                // worst CODE verdict across the three
      "design": { "desktop": 46, "tablet": 64, "mobile": 108, "unplaced": 0 }, // DERIVED
      "designMissing": [],               // widths with zero frames — derived, not typed
      "at": "2026-08-20",                // provenance date of the verdicts
      "source": "route-overflow-sweep"   // which sweep produced them
    }
  }
}
```

## Title grammar (observed)

`Skai > <Section> - <screen function> [<state/variant>] (<W> x <H>px)`

- **Section**: Home / Wallet / Trade / Predict / Play (matches figma.txt sections)
- **screen function**: the surface — `welcome`, `sidebar normal`, `portfolio`, `spot - buy`, `market detail`, `casino lobby`, etc.
- **state/variant**: qualifiers like `with CTA`, `open - agentic support`, `empty`, `loading`, hover/active states
- **viewport**: `1440 x 900` (desktop 1VH), `768 x 1024` (tablet), mobile widths — the same screen recurs per device, which is why 1170 frames >> unique screens

## Readiness semantics (added 2026-07-28)

`readiness` answers *should this be built yet*; `status` answers *have we built it*.
They are independent — conflating them produces a worklist wrong in both directions.

Source is the **leading emoji of the Figma page name**, which is the convention the team
actually uses (Casey, 2026-07-28): ✅ → `ready`, 🚧 → `wip`, 📍/🌎 → `meta`.

Figma's own Dev Mode flag (`node.devStatus`, `READY_FOR_DEV|COMPLETED`) is **not readable
here**: the MCP plugin sandbox rejects the getter (`"devStatus" is not a supported API`)
and `get_metadata` omits it entirely. Only the REST API exposes it, and no Figma PAT exists
in this repo. Do not promise a devStatus-based sweep without one.

A section with no page entry gets `readiness: "unknown"` and is **reported**, never
defaulted to `wip` — an unmapped section must not masquerade as a deliberate WIP verdict.

## Why pages.json exists — the catalog cannot see what was never pasted

Section node lists are parsed from `~/Desktop/figma.txt`, a hand-maintained link dump. **Any
Figma page never pasted into it is structurally invisible to this catalog** — not
mis-catalogued, absent. That is the single root cause of the 2026-07-28 gaps: `🚧 Social`
(147 nodes), `🚧 Governance and Utilities` (155), `✅ Plinko` (20), `🚧 Hi-Lo` (16),
`🚧 Chicken` (5), `🚧 Towers` (117) had no section at all.

`pages.json` is the live inventory harvested straight from Figma, so `build-registry.mjs`
can diff itself against reality and **print any page no section covers**. The next page
David adds announces itself instead of silently missing.

Two counting rules it encodes, both learned the hard way:

- **`liveChildren` counts top-level children INCLUDING furniture** (`Directory`,
  `Breakpoint`, `Rectangle N`, `Vector N`), so it is an upper bound, not a target. Home
  looked 6 short and was 1; Mines and Blackjack looked 1 short and were complete.
- **Counting requires `setCurrentPageAsync` per page.** Pages load lazily and an unloaded
  page reports `children.length === 0` rather than throwing — a bulk read silently reports
  an empty file.

`rows > live` (Wallet is −8, Trade has 36) means some rows point at nodes that are not
top-level children of that page, which is why section-count subtraction understates gaps
and only an id diff settles them.

## Status semantics

- `done` — frame implemented in code AND render-verified (Playwright/screenshot) against Figma
- `partial` — some structure built, gaps remain (note them)
- `not-started` — no implementing code
- `unknown` — not yet mapped (default until the code-mapping pass runs)

Node-id citation in code (`citedByFiles`) is a *hint*, not proof of `done` — a frame
can be implemented without its node-id in a comment, and a cited node may be
aspirational. `status` is set only by the mapping pass, never inferred from citations alone.

## Breakpoint dimension (added 2026-08-20)

### The hole this closes

`status` above has **no width in it**. Measured across all 24 `status.*.tsv` on
2026-08-20: of **262 rows marked `done`, 223 said nothing about any viewport**,
and six sections — `governance`, `governance-account`, `governance-vaults`,
`social`, `wallet`, `play` — mentioned a width on **zero** rows.

So `status: done` meant *"done at whatever width the author happened to open"*,
overwhelmingly 1440. A responsive gap sitting behind a `done` row was invisible
to every report the catalog could produce, and therefore could never be
scheduled. It was not that the answer was wrong; there was no place to put one.

★ **`status` still carries no width, and must never be read as a desktop
verdict.** It is the legacy aggregate. The width answers live in their own
column, and they start at `unknown`.

### Two axes, and only one of them is typed

A width question has two independent halves. The old single column collapsed both:

| Axis | Question | Where it comes from |
|------|----------|---------------------|
| **DESIGN** | Is there a Figma frame at this width? | **DERIVED** from `registry.json` — every frame already stores a `device` parsed from its title's viewport |
| **CODE** | Does the implementation work at this width? | **Hand-authored**, column 6 of `status.<section>.tsv` |

Deriving the design axis is what makes this cheap: `governance`'s 114 desktop
frames / 0 tablet / 0 mobile becomes a `design-missing` verdict on ~70 rows with
**zero hand edits**, and it self-corrects the day those frames are drawn.
Nobody can typo it out of sync, and nobody has to re-type it.

⚠ **The derived counts are asymmetric in trustworthiness.** `section`, `family`
and `device` are all parsed from frame titles, and titles are labels, not
identities — roughly ten games carry a 375 frame *titled* as a different game
(`9442-17258` is titled Blackjack and is actually Darts). A **zero is strong
evidence** (nobody mistitles a frame into non-existence); a **nonzero count is a
hint**. Also count `kind === "screen"` only: `towers` has 67 frames of which 60
are furniture (`Rectangle N`, `Vector N`, `Screenshot …`).

### The breakpoints

`desktop 1440` · `tablet 768` · `mobile 375`. Confirmed from the catalogued
frame titles: 712 frames at 1440, 504 at 768, 578 at 375. Constants live in
`BP_WIDTHS` in `bp.mjs` — do not re-hardcode them.

### The column

`status.<section>.tsv` gains an **optional sixth column**:

```text
family <TAB> status <TAB> primaryFile <TAB> route <TAB> reason <TAB> bp
```

Grammar (whitespace-separated, order-independent):

```text
<width>=<verdict> [<width>=<verdict> …] [@<YYYY-MM-DD>[/<source-slug>]]

desktop=done tablet=renders mobile=broken @2026-08-20/games-375-sweep
```

**Why column 6 and not a sidecar file or three columns:**

- **Absent means `unknown`, so all 500+ existing rows default correctly with
  zero edits.** That was the hard requirement: 605 rows cannot be re-verified by
  hand, and a migration that made them *assert* something would be worse than
  the silence it replaced.
- Co-located with the row it qualifies, so it cannot drift and cannot orphan the
  way a parallel `bp.<section>.tsv` would.
- Column 5 (`reason`) used to absorb every remaining tab via `rest.join("\t")`.
  Verified before claiming column 6: **zero rows across all 24 files had more
  than five tab-separated fields**, so the slot was genuinely free. `reason` is
  now strictly column 5, and a row with a seventh field is **refused with an
  error**, not silently misparsed as a verdict.

### ★ The default is `unknown`, and it is NEVER inherited from `status`

A row with no column 6 reads `unknown` at all three widths. It does **not**
inherit column 2. If it did, every row someone marked `done` after checking 1440
would start asserting `done` at 375 — which is strictly worse than today's
silence, because it would *look verified*. `unknown` is the honest answer to a
question nobody asked, and it is what the coverage report counts as an
outstanding gap.

Likewise `apply-status.mjs` writes `bpStatus: "unknown"` onto every screen frame
**explicitly** rather than leaving the field absent, so a consumer cannot
mistake "no opinion" for "this build predates the field" and fall back to the
width-less `status`.

### The verdict vocabulary

| Verdict | Means |
|---------|-------|
| `unknown` | Nobody has looked at this width. **The default.** |
| `missing` | The surface does not render at this width **at all** — absent, not merely broken. |
| `renders` | Lays out at this width: no horizontal overflow, no clipped controls. **NOT compared to a Figma frame.** |
| `partial` | Usable at this width, named gaps remain — put them in the reason column. |
| `done` | Implemented **and** render-verified against the Figma frame at this width. |
| `broken` | Reachable but unusable — overflow, clipped controls, or the flow cannot be completed. |
| `not-started` | Verified that no responsive handling exists here (e.g. a fixed-width container). |
| `n-a` | This width is deliberately out of scope for this surface. **Never** use it to mean "not checked". |

Severity for worst-of rollups, worst first:
`missing` → `broken` → `not-started` → `partial` → `renders` → `done`.
`unknown` and `n-a` are excluded from that ordering on purpose — neither is a
code judgement, so neither may win a worst-of comparison and hide a real one.

`design-missing` is deliberately **not** in this list. It is derived, never typed.

#### `renders` is the rung an automated sweep is allowed to write

A Playwright pass that finds no horizontal overflow proves the page **lays
out**; it does not compare a single pixel to Figma. Writing `done` off such a
sweep is exactly the overclaim this dimension exists to stop. A later auditor
who actually compares the frame upgrades `renders` → `done`, and the coverage
report shows that climb happening.

#### ★ Worked example 1 — why `missing` is separate from `broken`

`/swap` measured **zero horizontal overflow at 375** on 2026-08-20. It passed
because there is no swap UI at 375 at all: the string "Swap" appears 6× at 1440,
6× at 768 and **0× at 375** — the route resolves to `/portfolio` and the panel
never mounts.

**"No overflow" and "the feature is there" are different facts, and one `status`
column cannot tell them apart.** Neither can an overflow number. `missing` is
the rung that separates them, and it ranks *worst of all*: a broken feature is
at least reachable and gets reported by its users, whereas an absent one looks
healthy from every automated angle.

#### ★ Worked example 2 — wired ≠ renders

`status.slide.tsv` says the Slide route is **"FULLY WIRED"**, and warns against
correcting it. True, and irrelevant: the route registers and the page then
throws into the error boundary (`DialogTitle` outside a `Dialog`) at 1440, 768
**and** 375. Seeding it `mobile=broken` with desktop passing would have been
wrong in the direction that hides an outage — hence `desktop=broken
tablet=broken mobile=broken`.

### Provenance tags — where the scope of a claim lives

The `@YYYY-MM-DD/source-slug` token is not decoration. **A verdict is bounded by
its tag**, which is what lets a weak rung like `renders` be applied in bulk
without overclaiming. Tags in use:

| Tag | Method, and what it does NOT cover |
|-----|------------------------------------|
| `@2026-08-20/route-overflow-sweep` | Route loaded in its **default state** at 1440/768/375 on real production DOM in a signed-in session. Measured `documentElement.scrollWidth − innerWidth`, every element whose box escapes the viewport **excluding** those inside an `overflow-x:auto/scroll/hidden` ancestor, and hard-clipped text. ⚠ **States reached by interaction were not entered**, and nothing was compared to Figma. |
| `@2026-08-20/games-375-sweep` | Whether a game's bet→settle flow is **completable** at 375. ⚠ Says nothing about Figma parity, and (except where a width is written explicitly) nothing about 1440/768. |

When you run a new sweep, add a row here. A tag with no entry is a verdict
nobody can audit.

### How a future auditor records a per-width verdict

1. Open the row in `status.<section>.tsv` for the family you verified.
2. Append (or edit) column 6 — a real TAB, then the cell. Write **only** the
   widths you actually measured; leave the rest off, and they stay `unknown`.
   Serialising an `unknown` back out is not an error, it is just noise —
   `formatBpCell` omits them.
3. Stamp provenance: `@<the date you measured>/<sweep-slug>`, and add the slug
   to the tag table above if it is new.
4. Run `node figma-catalog/bp-report.mjs`. It **exits 1** on a malformed cell,
   so a typo cannot become a silent blind spot.
5. Re-run the pipeline below so `registry.json` picks it up.

Do **not** batch-fill widths you did not measure. A row left `unknown` shows up
as an outstanding gap in the coverage report, which is the entire point; an
invented verdict does not, which is the failure being fixed.

### Reading it back

- `registry.frames[<node>].bpStatus` — the verdict at **that frame's own
  `device`**. A frame whose title carried no parseable viewport gets `unknown`:
  that is a title-grammar gap, not a responsive gap.
- `registry.breakpoints["<section>/<family>"]` — the full triple, the `worst`
  rollup, the derived `design` counts, `designMissing`, and the provenance.
- `node figma-catalog/bp-report.mjs [--gaps] [--hygiene]` — the coverage table,
  the design gaps, and the actionable list.

`build-registry.mjs` carries `bpStatus` across a rebuild the same way it carries
`status`. It has to: a bare `build-registry` run would otherwise reset every
width verdict to `unknown`, which is the same shape of silent-wipe bug that
destroyed 920 `vverify` markers on 2026-07-28.

### Baseline, so drift is measurable

Immediately after the dimension was introduced (2026-08-20):

```text
COVERAGE: 116/595 rows (19%) carry a verdict at ≥1 width.
  desktop   97/595    96 renders, 1 broken
  tablet    98/595    96 renders, 2 broken
  mobile   116/595   104 renders, 10 broken, 2 missing
```

Compare, do not memorise — the denominator grows as sections are added. **The
number that must never fall is the count of rows carrying a verdict.**

## Rebuild

`node modules/skai-ui/figma-catalog/build-registry.mjs` (from the Skai-Trading working
copy; `node figma-catalog/build-registry.mjs` from inside skai-ui) — merges section node lists + titles.tsv +
code-node-citations.json into registry.json. Idempotent; preserves any hand-set
`implFiles`/`status`/`notes`/`verifiedAt` from the prior registry (keyed by node-id).

## Full pipeline (regenerate everything)

Paths below are from the **Skai-Trading** working copy. From inside the skai-ui repo, drop
the `modules/skai-ui/` prefix.

```sh
node modules/skai-ui/figma-catalog/build-registry.mjs   # frames + titles + citations → registry.json
node modules/skai-ui/figma-catalog/families.mjs         # roll frames → families.json (+ proposedStatus prior)
node modules/skai-ui/figma-catalog/apply-status.mjs     # fold status.<section>.tsv → per-frame status/route/notes
node modules/skai-ui/figma-catalog/apply-verify.mjs     # fold vverify.<section>.tsv → visual verdicts  ← MUST FOLLOW apply-status
node modules/skai-ui/figma-catalog/catalog-view.mjs > modules/skai-ui/figma-catalog/figma-frame-catalog.md
node modules/skai-ui/figma-catalog/bp-report.mjs        # breakpoint coverage; EXITS 1 on a malformed column 6
```

`bp-report.mjs` writes nothing, so its position is free — but run it after any
edit to `status.<section>.tsv`, because it is the only thing that validates
column 6 outside of `apply-status.mjs` itself.

### ⚠ `apply-verify` MUST run AFTER `apply-status`, and this list used to omit it

Both scripts write the **same** `status` and `notes` fields. `apply-status` rewrites `notes`
wholesale from `status.<section>.tsv`, so running it *after* `apply-verify` **strips every
`[vverify: …]` marker and overwrites the visual verdicts** — observed 2026-07-28: a bare
`apply-status` run removed **920** vverify markers and flipped `partial` → `done`, i.e. it
manufactured false "finished" verdicts on screens a screenshot pass had judged incomplete.

`apply-verify.mjs` was missing from this list entirely, so following the documented
pipeline after any verification sweep destroyed that sweep's output. **If you run
`apply-status`, you must re-run `apply-verify` behind it.**

**Canary — compare, do not memorise a number.** The check is that the marker count must
never DROP across a rebuild:

```sh
cp registry.json /tmp/reg.before.json     # before the pipeline
# …run build-registry → families → apply-status → apply-verify → catalog-view…
python -c "print(open('/tmp/reg.before.json',encoding='utf-8').read().count('vverify:'), \
                 open('registry.json',encoding='utf-8').read().count('vverify:'))"
```

Equal is correct; higher is fine (new frames matched existing verdicts); **a drop toward 0
is this bug** — `git checkout -- registry.json` and re-run in the right order. An absolute
figure rots: this doc said "expect ~920" and was already wrong by 2026-07-29 (930) simply
because the catalog had grown, which briefly looked like a defect and was not.

`catalog-view.mjs` writes to the stdout **stream** and also accepts an explicit output path
(`node … catalog-view.mjs out.md`). It previously wrote to the literal path `/dev/stdout`,
which throws `ENOENT C:\dev\stdout` on Windows — see `recurring-issues.md §271`.

- `status.<section>.tsv` (family <TAB> status <TAB> primaryFile <TAB> route <TAB> reason
  [<TAB> bp]) is the DURABLE source of verified status — hand/agent-authored per
  `VERIFY_BRIEF.md`. The optional sixth column carries the per-breakpoint
  verdicts; see **Breakpoint dimension** above. `reason` is now strictly column
  5 and **must not contain a TAB** — a seventh field is refused with an error
  rather than misparsed as a width verdict.
  `apply-status.mjs` is what writes authoritative `status` into registry.json;
  build-registry alone leaves frames `unknown` until apply-status runs.
- `families.json.proposedStatus` (likely-done/partial/not-started) is only a
  citation-count PRIOR for triage — never authoritative.

