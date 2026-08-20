# Social section — label corrections, 2026-08-20

Five lanes worked the Social section (311 registry frames) and every one of
them independently hit the same trap: **the registry title does not describe
the artwork.** This file records what each frame actually draws, so the next
wave identifies by artwork from the start instead of re-deriving it.

## Do NOT "fix" these titles in `registry.json`

`figma-drift.mjs` matches RETARGET rows by **exact title**. Editing a title to
make it accurate breaks the match and the frame reports as REMOVED on the next
harvest. Corrections live here, in prose, on purpose.

## The correct file key

`sectionFile.social` = **`3sSzw1KewMtUbeLAv7uW0r`** (Skai-Web-App).

Social is *not* in `M6r9FEn042UWTQD1zvy6GM` (Skai-Games) — `get_screenshot`
there returns "node not found". A lane brief said otherwise and cost a lane its
first read.

## Frames whose title contradicts their artwork

| Node | Title says | Artwork actually is |
|---|---|---|
| `5198-9151` | "Unread messages 1VH" | The **Groups** pill with the same three group rows as `5164-266951`, differing only in which row is selected. It is **not** the unread state. The catalog's "unresolved, treat as distinct" flag is now resolved: distinct, but not what the name claims. |
| `5162-265801` | "Sample Conversation > Dropdown options" | The **conversation-list filter menu** open under the "All ▾" pill: All messages / Unread / Personal / Groups / Requests › / Settings › / ─── / Mark all as read. Not the per-message options menu, so the catalog's "the trigger is a RIGHT-CLICK ContextMenu" note describes a different frame entirely. |
| `5100:183573`, `5101:186045`, `5194:271601`, `10232:201644` | "Skai > Social" | A page whose `<h1>` reads **Discover**. |
| `10335:235331` vs `10335:236189` | *identical titles* | `236189` is the **multi-select** state (circular checkboxes, "Select all", "Delete"); `235331` has neither. |
| `10256:150766` | "share post" | Shares a **referral** link (`skai.trade/ref/…`, "100 SKAI per friend"). |
| `5110:187509` | "Discover - search" | A page headed **"Search social"** — a table, not the card list `/discover` renders. |
| 102 frames titled `Skai > Play 1VH (375 x 812px)` / `(768 x 1024px)` | Play | The **mobile + tablet responsive redraw of the Social section**. 41 distinct surfaces across 63 mobile / 39 tablet frames: 14 Messages, 8 Groups, 19 feed/Discover/posts/stories. **Live-streaming surfaces in the cluster: 0.** All 102 have since been renamed in Figma; `registry.json` and `snapshot.webapp-0818.json` both carry the dead name. 99 of 102 resolved live via `get_metadata`. |
| `11398-78648`, `11398-77975`, `11398-85223` | (as above) | **Deleted from Figma.** Re-verified individually — not transient read failures. |
| `11410-138568`, `11435-158497`, `11442-160938` (tablet), `11410-139136`, `11438-159797`, `11442-162043` (mobile) | "Skai > Launch > Live" | The **live-stream browse page** — "Live on Skai", a "Go live" CTA, LIVE-badged stream cards with viewer counts, category rows. `routes.tsv` assigns `Launch` to trade-2/launchpad, so the name reads as token-launch and misfiles all six. |

## Registry notes that are wrong, not merely stale

- **All 10 `family === "Social > Groups"` frames carry an identical `notes`
  string.** The note written for `5204-65392` was copied across the family, so
  it describes the Rules tab no matter which row you read. Identify by artwork:
  `5198-50314` is the Created tab (an `S/N` column, every row's action is
  `View`); `5198-47891` is Discover (a `Token req` column, action is `Buy`).
- That note also claims *"The Rules tab exists as 'Access Rules'"*. **It does
  not.** Figma's Rules tab (`5204-65392`) is free-text conduct rules ("1.
  Respect all traders…"). The code's "Access Rules" tab is token-gating
  requirements. Different concepts, and `trading_groups` has no rules-text
  column.
- **`5160-207895`** — the note says "the profile half is a CENTERED DIALOG, not
  the side panel the frame draws". Backwards: the frame **draws** a centered
  dialog, which is what the code already has.
- That same note reports a live bug, "`MessageDialogs.tsx:334` navigates to
  `/@${username}` … View Profile resolves to nothing". **Already fixed** —
  `useProfileNavigation` is imported at `:34` and called at `:341`.
- **`4998-157146`** — the note says "Stream type modal … no
  webcam-vs-OBS-vs-screenshare choice". The artwork is **"Create your own token
  to go live"**: Create token vs Start anyway, with copy about earning a share
  of trading fees. It is a monetisation chooser, not a capture-source chooser.

## Six "behind the super-admin gate" notes are stale

Prod `feature_flags` row `STREAMING_PUBLIC` is **`enabled=true,
rollout_percentage=100`**, set 2026-08-13 on owner instruction. The build-time
default in `src/config/features.ts:264` is off, but the row is the runtime
override and wins, and `src/pages/social/Streaming.tsx:669` already reads it.

Every "Behind the super-admin gate" note (6 frames) and the "350 KB wired and
unreachable" headline on `4998-155882` no longer hold. **Streaming is live to
all users today.**

## The general rule this section proves

A registry `notes` field is a *previous reader's* claim, at the moment they
wrote it, about a frame they may have mis-identified. Six of the corrections
above are notes, not titles — so "identify by artwork, not title" is not
enough. Identify by artwork, then check whether the note survives the artwork
you just saw.

---

## Update 2026-08-20 — re-harvested against live Figma

Lane `social-catalog-reharvest` re-read page `4914:113562` and brought
`registry.json` back in step. Everything below is measured, with the command
that measured it. **Several corrections above are now RESOLVED UPSTREAM** —
Casey renamed the frames in Figma — and a stale correction is as harmful as a
stale title, so they are struck here rather than left to be re-applied.

### Counts, and how they were measured

| Claim | n | How |
|---|---|---|
| Live top-level children of `4914:113562` | **442** | `use_figma` → `page.children.length`, after `setCurrentPageAsync` |
| `registry.json` rows with `section: "social"` before | **311** | count over `registry.frames` |
| Live but never catalogued | **139** | id set difference; independently reproduced by `figma-drift.mjs` as 139 ADDED |
| Catalogued but not a live top-level child | **8** | id set difference |
| Catalogued ids whose title changed upstream | **109** | `figma-drift.mjs` RETITLED |
| Frames titled `375 x 812` / `768 x 1024` | **96 / 91** | regex over live names; independently confirmed by lane `social-responsive-new` |

Registry rows are now **450** = 442 live + 8 kept-as-`gone`. `pageCoverage` for
the page reads `rows 442, gone 8, live 442, delta 0`, and re-running the drift
tool against the live snapshot reports the section **clean**.

Artefacts, all regenerable, none hand-edited:

- `social.live-0821.tsv` — all 442, verbatim names, with type / WxH / x,y
- `social.new-0821.tsv` — just the 139 new ones
- `snapshot.social-0821.json` — the drift-tool input
- `figma-todo.social-0821.tsv` + `figma-drift.social-0821.json` — **the record of
  what changed**, including all 109 before/after title pairs
- `figma-todo.social-0821-verify.tsv` + `figma-drift.social-0821-verify.json` —
  the same diff re-run *after* the update, proving `clean`

### ~~102 frames titled `Skai > Play 1VH`~~ — RESOLVED UPSTREAM

The row above is now history. Casey renamed them in Figma; the dead name
survived in `registry.json` — which this pass has updated — and in
`snapshot.webapp-0818.json`, which it has **not** and must not: that file is a
dated record of what Figma held on 2026-08-18, and rewriting a historical
snapshot to match today would destroy the only evidence that the rename
happened. Read it as history, never as current state.

The arithmetic closes exactly: **99 retitled + 3 deleted = 102**, and the 3
deletions are the same three that row already named (`11398-78648`,
`11398-77975`, `11398-85223`).

The 99 now carry real breadcrumbs — Messages, Groups - search, Discover -
search, create story / view story, create post, Sample creator profile, Sample
post / token, `Social - with "tweets"`.

★ **The reason this had to be applied, not just noted.** `figma-drift.mjs`
recognises a rebuilt frame (RETARGET) by joining a REMOVED old id to an ADDED
new id on **exact title** — reading the title from the *registry* on one side
and from *live Figma* on the other (`figma-drift.mjs:194-208`). A registry title
that no longer equals the live name silently disables that rescue: the row would
be reported as REMOVED and its `implFiles` would look orphaned. So the rule that
protects the join is **"the registry title must equal the live Figma name"**,
which is why `build-registry.mjs` re-reads titles from `<section>.titles.tsv`
every run and why `title` is *not* in its preserved-hand-set list. Leaving a
stale title alone is not the cautious option — it is the failure mode. What must
never happen is a **hand-authored** "more accurate" title matching neither side.

### ~~Six `Skai > Launch > Live` frames misfile as token-launch~~ — RESOLVED UPSTREAM

Five of the six were renamed to real Social names; the sixth
(`11435-158497`) was deleted. Live now:

| Node | Live name |
|---|---|
| `11410:138568` | `Skai > Social > Live (768 x 1024px)` |
| `11442:160938` | `Skai > Social > Live > Stream type modal 1VH (768 x 1024px)` |
| `11410:139136` | `Skai > Social > Live (375 x 812px)` |
| `11438:159797` | `Skai > Social > Live > Stream type modal 1VH (375 x 812px)` |
| `11442:162043` | `Skai > Social > Live 1VH (375 x 812px)` |
| `11435-158497` | **deleted** |

### The page itself was renamed: `🚧 Social` → `✅ Social`

Social is **ready-for-dev**, not work-in-progress. `pages.json` is updated and
`readiness` moves `wip` → `ready`, which re-stamps all 450 rows. Anything that
treated Social as WIP is out of date.

### All 8 "catalogued but not live" are genuinely DELETED — and here is the test

`11442-177484`, `11459-187396`, `11398-78648`, `11398-84004`, `11398-77975`,
`11398-85223`, `11435-158497`, `11442-173579`.

Five of these were previously unresolved. **"Not a top-level child" is not
"deleted"** — the frame could be nested deeper or moved to another page — so a
null lookup on its own proves nothing. What settles it is a **control**:

```js
// with ✅ Social as currentPage, probe ids known to live on OTHER pages
await figma.getNodeByIdAsync("3173:26019")  // -> resolves, page "✅ Predict"
await figma.getNodeByIdAsync("2311:5968")   // -> resolves, page "✅ Privacy and Terms"
await figma.getNodeByIdAsync("4914:113564") // -> resolves, a nested child
await figma.getNodeByIdAsync("999999:999999") // -> null
```

`getNodeByIdAsync` **does** resolve across unloaded pages, and it **does** resolve
nested descendants. So for these 8, null means deleted — not moved, not nested.
Run the controls before trusting a null; without them the same output would also
be consistent with "moved to another page".

None of the 8 carried `implFiles`, `notes`, `verifiedAt` or a triaged `status`
(see `figma-drift.social-0821.json` → `removedRows`), so no implementation record
was orphaned. They are kept as `gone` rows in `bugref-aliases.tsv` rather than
dropped, per the existing convention.

### New: two live titles contradict their own artwork's dimensions

Figma-side errors. **Do not fix them in `registry.json`** — report only.

| Node | Actual size | Live title claims |
|---|---|---|
| `11530:303909` | **768x1024** | `... Sample Conversation > attachment 1VH (1440 x 900px)` |
| `11474:222012` | **375x1365** | `... Sample creator profile > Posts (1440 x 900px)` |

This is not cosmetic: `build-registry.mjs` parses `device` from the **title**, so
both rows are stamped `device: "desktop"` while being tablet- and mobile-width.
Any responsive worklist built from `device` will miss them and any count of the
mobile/tablet tier will be short by exactly these two — counting the 139 new
frames by title gives 39 + 37 = 76, by actual width 40 + 38 = 78.

Also `11400:91695` ends with a stray `)`:
`Skai > Social > Groups - search > Discover > View group (768 x 1024px))`. Left
verbatim on purpose — the title must equal what Figma holds.

### `social` reports `cited: 0`, and for once that is a TRUE zero

The catalog's `cited: 0` is usually untrustworthy — see below — but not here.
**Zero of the 450 social node-ids appear in `code-node-citations.json`**, checked
directly against the index rather than inferred from the stat. No shipped source
file cites a Social node-id in a comment.

`home`, `wallet` and `trade` were the opposite case: they reported `cited: 0`
while **83 / 36 / 12** of their ids were in the index all along. That is fixed —
see the header of `verify-catalog-counts.mjs`.

### Two corrections above now extend to their 375/768 twins

Reported by lane `social-responsive-new` from the artwork, recorded here so the
correction is not re-derived a third time. **Do not edit these titles.**

| Node | Title says | Artwork actually is |
|---|---|---|
| `11442:176880` (375), `11442:167934` (768) | "share post" | The **referral** share sheet, exactly as already recorded for `10256:150766`: "Earn when people buy from your referral.", a Share-to row (X, Telegram), `skai.trade/ref/vassimo125` + COPY, and "100 SKAI points for each friend that joins". Nothing about sharing a post. |
| `11461:197022` (375), `11459:185505` (768) | "Discover - search" | The **"Search social" table** page, as already recorded for `5110:187509` — confirming that correction holds at both narrow widths. Its stat tiles are Creators / Holders / Creator market cap / My created tokens; the code's `/discover` renders a card list with Creators / Total MCap / Holders / 24h Volume. Different page. |

★ A caution about over-applying the companion rule. "At 768 Social is ONE
column" is true of **Messages** and is being read as a global tablet rule. It is
not: in `11459:185505` (768) the tab row and both filter selects share one row
and every table row carries a `Holders` column, while `11461:197022` (375)
stacks them and drops the column. 768 is a genuine two-up breakpoint on that
surface. The rule is "match what the 768 frame draws", per frame.
