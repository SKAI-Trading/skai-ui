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
      "status": "done|partial|not-started|unknown",
      "route": "/... or ?tab=...",      // where it renders in the app (if routed)
      "notes": "",                       // gaps, backend deps, deviations
      "verifiedAt": null                 // iso when last render-verified against Figma
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
```

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

- `status.<section>.tsv` (family <TAB> status <TAB> primaryFile <TAB> route <TAB> reason)
  is the DURABLE source of verified status — hand/agent-authored per `VERIFY_BRIEF.md`.
  `apply-status.mjs` is what writes authoritative `status` into registry.json;
  build-registry alone leaves frames `unknown` until apply-status runs.
- `families.json.proposedStatus` (likely-done/partial/not-started) is only a
  citation-count PRIOR for triage — never authoritative.

