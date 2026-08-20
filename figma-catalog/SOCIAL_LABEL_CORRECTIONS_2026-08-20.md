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
