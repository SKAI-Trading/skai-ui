# Wave 64 — integrity record (2026-09-22)

**Figure: 1,231 of 3,816 in-scope genuine frames done (32.3%), 809 verified** — one lower than wave 63's 1,232
and 810, in the honest direction. 3 lanes, 23 rows, all `partial` or `blocked-on-backend`. Pipeline exit 0,
conflicts 0.

The one frame that moved went DOWN, on purpose: the TP/SL fix below made the 1440 card `4020-44966` taller than
the board's 654 (the unavailable notice is new content), so the lane that made the change re-scored the frame it
had affected from `match` to `partial` rather than leave a verdict it had just made untrue. Whether the honest
notice keeps that card done is a Casey call (below).

**The Figma connector was down for the whole wave**, from about 17:57 — every call returned `MCP server
"claude.ai Figma" is not connected`, and the claude.ai Supabase connector dropped soon after. With no board to
measure against, no frame could honestly move to `done`, and none did. Casey said "continue", so the wave ran on
the work that needs no board read and rests on a measurement already on record. It needs the connector
reconnected in claude.ai before the next frame-closing wave.

## What a board-free wave could honestly do

Four sources held up: first-hand reads already recorded (node, date, numbers); frame SIZES from the day's
hash-verified harvest in `live/*.tsv`; the parity oracles themselves; and honest unavailable states. Nine carried
items were checked at HEAD before dispatch and only five survived:

- **Dropped — no first-hand source.** The AddWalletDrawer "46/52/64 and 50" box traced only to an old brief's goal
  text. The skai-ui dialog close glyph was named as owed and never measured.
- **Dropped — an open Casey call.** The slots' 347-wide portrait tint depends on whether the 347 inset or the 375
  full-width phone boards govern.
- **Dropped — no consumer.** Loading Mulish for a status line nothing draws yet.
- **Corrected before dispatch.** Three line references had drifted (the order book's mid row moved from `:468` to
  near `:506`), and Sugar Rush's stage needed every portrait box moved up 83.5 = (667 − 500) / 2, not just its
  height — a height-only change would have cropped the game.

## The parity oracles: 5 red, all stale, none a regression

Every `*.figma.test.*` in the app — 436 files, 7,040 cases — was run against pushed origin in a clean worktree:
6 cases red in 5 files. The oracle-health lane traced each to the commit that turned it red, and **all five were
stale oracles**: deliberate, measured changes nobody had carried into the test.

- **Three were broken by the touch-floor opt-outs.** Prepending `no-min-size` to a class list moved the literal's
  first utilities, and oracles that found their element by those first utilities lost it — including one suite
  that threw at collection and ran **zero** cases. They now find elements by what they do or the label they carry.
- **One was a count pinned to a number that legitimately grew** — the catalog routed 12 more real perps frames
  (86 → 98). It now holds a floor and the harvest's own live count.
- **One followed a shared primitive** — skai-ui split `TableCell`'s `p-4` into `px-4 py-4` — and had also been
  certifying 16 on an edge that is really 0.

Each repair was mutation-tested; the lane caught a hole in its own first fix that way. 158/158 pass together.

A separate check found 10 red cases in five skai-gaming `pages/play` suites (not parity oracles). They are older
than this wave: at origin's pointer there were 12 in 7 files, and the day's commits fixed two files and broke none.
Carried.

## What was built

- **Sugar Rush and Vegas fortune phone stages** 375x667 → 375x500, every portrait box moved with them, from the
  harvest's seven 375x500 frames per game (skai-gaming `52cc8e4d`, `51526d18`).
- **But the Vegas fix reached no player until the fold caught it.** Vegas fortune has no certified run, so its
  definition is `Offline`, the engine never mounts, and players see only the page's load stage — which still drew
  `aspect-[375/667]` beside a comment calling 667 the engine's stage. Fixed (`8800409d`) with a test that reads
  each slot page's aspect against its OWN skin's portrait stage, so neither can drift alone.
- **The order book's 1440 header band** 26 → 24 and its ladder split 15:16 (270 / 288), from 2026-09-21 first-hand
  reads (skai-ui `2c136bf`, `0bc86ec`). Still partial: the board's sixteenth bid needs 558px and the page's borders
  take 4 of it. The lane **corrected the brief** — it had named the mid row; the reading names the header band —
  because the brief told it to read the source rows in full rather than trust the summary.
- **The TP/SL modal** now opens with both fields disabled and the rail's own reasons shown, instead of refusing
  only after the form is filled; the hook still refuses as a backstop, and two tooltips promising an executor that
  no longer exists are gone (`5f8b593ae`, `508a4a5d0`).
- A comment in `content.ts` now says which boards draw the hero counter suffix (skai-ui `daa029b`).

## Carried

- The gutter comments (`playPageTemplate.ts`, `AviatorGamePro.tsx`, `towerTheme.ts`, `HomeShellLayout.tsx`) — the
  lane was cut before verifying which reservation is true, one edge or both.
- `PerpPositionsPanel.figma.test.tsx` near `:1548` checks a service path the modal no longer uses.
- The 10 older skai-gaming `pages/play` reds.
- **The skai-gaming pointer was NOT bumped by this fold.** skai-gaming's origin interleaves this wave's commits
  with another session's lottery changes, two of which depend on a database definer that is not live yet — that
  session sequenced its migration "so its definers land before the app". Bumping the pointer would land their app
  code ahead of their migrations. This wave's stage and Vegas fixes are on skai-gaming's origin and ride that
  session's bump when it is ready.

## For Casey

- **Reconnect the claude.ai Figma and Supabase connectors** — the next frame-closing wave needs boards.
- **`user_follows`**: `src/services/user/profileService.ts` near `:1217` and `:1275` says the web app runs as
  `anon` with no SELECT on `user_follows`; a wave-63 lane reported the live grants allow it. The repo's migrations
  serve the follow lists through RPCs and grant no direct anon SELECT, so the lane may have read the RPC path.
  Unverified with the database connector down — and if the whole follow graph is readable anonymously, whether
  that is intended is a privacy question, not a comment fix.
- The hero counter suffix: keep "Users are already on this list", or one of the boards' "…winning with us".
- `4020-44966`: does the TP/SL unavailable notice keep the card done, or does it stay partial until the rail can
  place a TP/SL?
