# Bug-report Figma reference audit (2026-07-27)

Question asked: do we have **every** Figma reference from the user bug reports in
the catalog? Answer at the time of writing: **yes — 824 / 824 distinct references
are accounted for**, after adding 86 frames and an alias map.

## How the reference set was built

`bug_reports` (Supabase `hpongymihuyqgcecowjr`) carries Figma URLs in two places,
and both must be read — the `figma_link` column **and** free-text `title` /
`description`. Filtering on the column alone misses 14 reports.

```sql
select figma_link from bug_reports where figma_link is not null
union all
select (regexp_matches(coalesce(title,'')||' '||coalesce(description,''),
        'https?://[^\s)"''<>]*figma\.com[^\s)"''<>]*','g'))[1]
  from bug_reports
 where figma_link is null
   and (title ilike '%figma.com%' or description ilike '%figma.com%');
```

- **1069** reports carry a Figma URL (1055 in `figma_link`, 14 only in free text)
- → **824** distinct `(fileKey, node-id)` pairs
- across **3** file keys: `3sSzw1KewMtUbeLAv7uW0r` (Skai-Web-App, 1064 refs),
  `M6r9FEn042UWTQD1zvy6GM` (Skai-Games, 4), `CuCgVP8PSgDNTcbt8mNJLd`
  (Skai-Web-App **(Copy)**, 1)

## What the diff found

391 of the 824 were already in `registry.json`. The other **433** were not — but
a raw node-id diff badly overstates the gap, because QA deep-links whatever was
selected in Figma, which is usually a **child** of the frame. Resolving every id
to its top-level frame ancestor (`figma.getNodeByIdAsync` → walk to the `PAGE`
parent) splits them:

| Class | Count | Meaning | Treatment |
|---|---|---|---|
| B | 330 | descendant of a frame the catalog **already** had | alias row |
| A | 74 | genuinely uncataloged **top-level frame** | added to catalog |
| C | 24 | descendant of an uncataloged top-level frame (14 distinct parents) | parent added + alias row |
| D | 2 | report linked a whole Figma **page**, not a frame | alias row (`page`) |
| E | 2 | node-id no longer resolves in the file | alias row (`gone`) |
| — | 1 | the `(Copy)` file (no edit access) | alias row (`copy-file`) |

So the true gap was **86 top-level frames** (74 class A + 14 class C parents,
minus 2 that were both), not 433. **76% of the apparent gap was deep-links into
frames already covered.**

## Frames added — 4 new sections, 86 frames (1580 → 1666)

None of the 86 appear in `~/Desktop/figma.txt`; that file is separately
reconciled at 1598 links / 0 missing (`audit-figma-txt.json`). These frames exist
in Figma and are cited by QA, but were never in the approved implement-list.

| Section | Frames | Figma page | Content |
|---|---|---|---|
| `onboarding` | 17 | ✅ Onboarding and Authentication | waitlist → get-early-access → verification → choose/link wallet → reserve name → congratulations → pre-launch dashboard (desktop + tablet) |
| `legal` | 2 | ✅ Privacy and Terms | Privacy, Terms (long-scroll 1440-wide) |
| `master-sheet` | 3 | 📍 Master sheet | 3035x3805 overview boards (Home > Moat, Portfolio, Pro) — all `kind:non-screen` |
| `trade-bugrefs` | 64 | ✅ Trade | Swap, Margin, Bridge, Launch/create-token, Dashboard, Perpetual-futures states + order/leverage panel fragments |

### `trade-bugrefs` was folded into `trade` the same day — see below

It was created as a quarantine section because the 2026-07-25 directive made
figma.txt's 219-node trade section the sole approved truth for `trade`, so
merging 64 more Trade-page frames would have reversed that. Hours later the user
added a `Trade (7/27 update):` section to figma.txt that **includes all 64**,
which resolved the scope question in favour of merging. See the addendum.

---

# Addendum — Trade re-scope (2026-07-27, same day)

The user appended a `Trade (7/27 update):` section to `~/Desktop/figma.txt`:
**692 links, all in the primary Skai-Web-App file, all top-level frames on the
✅ Trade page.** It is now the sole approved truth for Trade and supersedes the
earlier 219-node `Trade:` heading.

## The 692 decompose exactly

| Source | Frames |
|---|---|
| the old approved `trade` section | 219 |
| the `trade-bugrefs` quarantine (all of it) | 64 |
| `trench` (284 of its 285) | 284 |
| brand-new, in no section | 125 |
| **total** | **692** |

Zero of the old 219 were dropped, and every one of the 64 quarantined frames is
in the approved list — so the quarantine call was right to be additive, and the
merge is now the correct resolution.

## What changed

`trade` 219 → **692**; `trench` and `trade-bugrefs` **retired** as sections.
Three sections describing the same Figma page collapse into one. Registry
1666 → **1790** (net +124: +125 new, −1 deleted-upstream).

The 125 new frames are mostly the **375px mobile tier** that Trade previously
lacked entirely — mobile Swap, Margin, Bridge, Perpetual-Futures,
Launch/create-token, Dashboard (Reports/News/Whale-activity) — plus tablet
Bridge/Perps/Launch states, a `Trade > Nav bar` screen at both widths, and ~30
canvas scaffolding frames (Breakpoint/Directory/Rectangle/Notes/tool-tip/icons),
which are kept for list fidelity and auto-classified `kind:non-screen` so they
stay out of screen counts and build queues. Resulting screen device split:
107 desktop / 117 tablet / 132 mobile.

`trench`'s 285 frames had **no `titles.tsv` at all** — every one was `untitled`
with `family:null` and zero verdicts, so they were registered as bare ids
invisible to family rollups. Their titles were harvested during the fold, so the
merge also fixed that latent gap. Their raw Figma names include malformed
prefixes (`Skai > > Trade > …`, `Skai >  Trade > …`) kept verbatim; note only
133 of the 284 begin with `Skai >`, so the rest parse `kind:non-screen` by the
documented rule.

`9695-96406` — the single trench frame not in the 692 — **no longer resolves in
the Figma file** (deleted upstream), which is why the list omits it. Recorded as
a `gone` row in `bugref-aliases.tsv` rather than kept as a one-frame section.

## Verified

- `trade.nodes.txt` is byte-equal to figma.txt's 692, in the same order; 692/692 titled
- 1665 carried-over frames: **zero drift** in `status`/`route`/`notes`/`verifiedAt`/`implFiles`
- 120 trade `verifiedAt` verdicts preserved (was 120 across the three old sections)
- only 1 frame dropped registry-wide, the deleted `9695-96406`
- `audit-figma-txt.mjs`: **2290 unique links, 0 missing** across all 16 headings
- bug-report coverage still 824/824, 0 residual

## Auditor bug found and fixed

`audit-figma-txt.mjs`'s heading regex was `^([A-Za-z][A-Za-z ]*):\s*$` — letters
and spaces only. `Trade (7/27 update):` contains digits, parens and a slash, so
it **did not match**: the section was skipped entirely and its 692 links were
audited against nothing, reported as neither present nor missing. A silent
zero-coverage hole in the exact tool meant to catch uncataloged frames. The
pattern now accepts digits/parens/slashes, a `SECTION_ALIAS` map handles headings
that don't slugify to the section key, and `gone` ids are excluded so a
deleted-upstream frame is not a permanent false gap.

## `bugref-aliases.tsv`

359 rows mapping a referenced node-id to the catalog frame that covers it, so a
future audit does not re-flag deep-links as gaps:

```
refNode  catalogNode  reason  refs  openRefs  sampleReportId8
```

`reason` ∈ `child` | `page` | `gone` | `copy-file`. A `refNode` may carry a
`<fileKey>:` prefix when it is not the primary file — and a fileKey-qualified key
must be looked up **before** the bare id, since the same bare node-id can exist
in more than one Figma file (that is exactly the `(Copy)` case: report `29887c90`
links `Skai-Web-App (Copy)`, and a Figma file copy preserves node-ids, so
`2720-8186` there is the same `dropdown-3` inside `2720-7877` in the main file).

The 2 `gone` ids (`7717-10907`, `9042-164815`) and 2 `page` links
(`2003-674` = ✅ Home page, `2998-19593`) are recorded rather than added: there is
no frame to catalog.

## Reproducing

```bash
node figma-catalog/build-registry.mjs      # 1666 frames
node figma-catalog/audit-figma-txt.mjs     # figma.txt still 0 missing
```

Coverage is re-checkable by re-running the SQL above and asserting every pair is
either a `registry.json` frame or a `bugref-aliases.tsv` row.

## Caveat

Being cataloged says nothing about being **built**. These 86 frames enter with
`status:"unknown"` and no `implFiles`; the 256 open-report references among them
are a build/verify backlog, not resolved work. In particular `onboarding` (17
frames) is a whole product surface with no status pass yet.
