# Lane brief — Skai-Web-App-2 parity wave, 2026-08-26

Read this whole file before touching anything. It is short on purpose; every
line is something that has already cost a previous lane real time.

## The mission

`Skai-Web-App-2` (`mhF3BkzlTaGiLzJ7kvpmVc`) holds **718 frames the catalog has
never assessed** — Home 2 (129), Wallet 2 (182), Trade 2 (407). There is no
`status.home-2.tsv`, no `status.wallet-2.tsv`, no `status.trade-2.tsv`. Node and
title harvests exist for the first two; **the trade-2 harvest is misfiled** (89
rows of `3928-*` ids for a page whose 407 children are all `13006:*`) — ignore
it and harvest live.

⚠️ **CORRECTED 2026-08-26, later the same day. The paragraph that stood here was
WRONG and it is the reason to read this note before trusting anything below.**

It read: *"Casey ruled these v2 pages are the CURRENT design. File 1 carries
tombstones reading 'Home (moved to Skai Web App 2)'. So parity against Home 1 /
Wallet 1 / Trade 1 is parity against a superseded spec."*

**V1 is not superseded.** The tombstones carry node ids `2003:674` /
`2998:19593` / `3:3` — **the same ids as Home 1 / Wallet 1 / Trade 1**. "Moved to
Skai Web App 2" names the **file**. Home 1 *is* the moved page. `Home 2` /
`Wallet 2` / `Trade 2` are page-continuation indices inside that file, created
because one page outgrew a canvas — not replacements.

Measured proof: the Directory banners **partition** the product rather than
duplicate it (Home 1 = Home / with deposit / moat / Portfolio; Home 2 = Whales /
Pro / Advanced Tools; Trade 1 = Spot / Perps; Trade 2 = Trench / Launch / Swap).
And **Home 1 holds the newest content in the file** — max node id prefix 13502
against Home 2's 13459, with a Directory dated 25 Aug 2026. A superseded page
does not receive newer frames than the page said to replace it.

Real supersession is **4 surfaces / 19 frames of 852 children (2.2%)**.
**Trade 2 contains no Spot, no Perps and no Dashboard** — acting on the old
paragraph would have retired the core trading surfaces.

What still stands: the v2 pages genuinely had **zero** parity assessment, which
is why the wave was worth running. What does not stand is any conclusion that a
v1 frame stopped being a parity target.

Two more rulings from the same conversation:

- **Governance is HELD.** Its page is `🚧 Governance and Utilities` — wip, not
  ready. 121 rows, deliberately out of scope. Do not build it.
- **The 20 game rollups get re-verified** (one lane owns this).

## Your deliverable

1. **A status file for YOUR SLICE ONLY**, named exactly as your prompt says
   (e.g. `status.trade-2.trade-a.tsv`). **Never write to a shared file** — nine
   other agents are running and a concurrent write loses someone's work. The
   coordinator merges.

   Tab-separated, no header, one row per frame:
   ```
   <family/title>	<status>	<code path or ->	<route or ->	<notes>
   ```
   `status` ∈ `done | partial | not-started | blocked-on-backend`.

2. **Fix the highest-value REAL parity gaps you find** in code. Assessment
   first, fixes second. A defect you found and reported honestly beats a fix you
   guessed at.

3. **A report** to the coordinator: what you assessed, what you fixed, what you
   deliberately did not, and every out-of-scope defect with file:line.

## Figma rules that have burned people

- **An UNLOADED page reports `children.length === 0`.** Not an error — a
  plausible zero. Predict once read 0 minutes after measuring 284. Call
  `await figma.setCurrentPageAsync(page)` **once per `use_figma` call**, and fan
  multi-page work out across parallel calls rather than looping pages inside one.
- **`get_metadata` with no nodeId is unreliable for listing pages** — it
  reported 1 page for a file that has 13. Use
  `figma.root.children.map(p => ({id: p.id, name: p.name}))`.
- **IDENTIFY FRAMES BY ARTWORK, NOT TITLE.** Titles are wrong across this
  library: Slide's desktop assembly is titled "Towers", its mobile "Blackjack";
  Chicken's frames are filed as "Hi-Lo Start" and "Blackjack". **The `notes` in
  the registry are wrong just as often and sound researched.**
- **A screenshot is a render, not a measurement** — it includes the drop shadow,
  measured at exactly **+160w / +109h**. Measure from node geometry.
- **Compare ID SETS, not counts.** Equal counts hide an equal-sized swap. Drift
  means zero live-only AND zero catalog-only.
- **"1VH" names the VIEWPORT in the title, never the frame height.** One frame
  titled `375 x 812` is 1982 tall. Same title can carry two different cuts —
  cropped-to-viewport, or grown to full scroll.
- **Hidden nodes are not spec.** Check `hidden`/`visible` before transcribing.
  Most `0.01 SKAI` text in this library is `hidden="true"`.

## Product rules — these override Figma

- **"Match figma always" is NOT absolute.** If matching would DELETE working
  behaviour, that is Casey's call: report it, do not do it.
- **POINTS and sUSD only. SKAI is NOT a betting option** (`isSkaiBettingAvailable()`
  is a hard `return false`). Frames printing `100.11 SKAI` are template leftovers.
- **sUSD DISPLAYS as "USD"** — a mapping (`tokenDisplaySymbol`), never a rename.
- **NO MOCK DATA, ever.** Production paths never synthesise a price, count or
  balance. When a source fails, render an explicit unavailable state.
  **Unknown must never become 0** — `null < total` coerces to `0 < total` and has
  already told a funded user "insufficient". Loading `…` is a different glyph
  from unknown `—`.
- **An empty FEED is not an empty MARKET.** Copy may describe the source and must
  not narrate the world behind it.
- **Licence marks (GCB / GambleAware) are absent BY DESIGN, fail-closed.** Never
  add them "per Figma" — that publishes a regulator seal we do not hold.
- **A market TYPE is a filter, never a route.**
- Never mention Claude/AI in code, comments, commits or docs. No emojis in commits.

## Verification — how to not report a false green

**SIX vacuous greens have been found in this repo.** Before believing any
checker that reports "nothing wrong", make it tell you HOW MUCH it looked at.

| Signal | Why it can't fail |
|---|---|
| vitest `Type Errors  no errors` | `typecheck.include` unset → `**/*.test-d.ts`, repo has ZERO. **Never cite this line.** |
| vitest `Tests N passed` | a suite that fails to COLLECT contributes 0/0. **Read `Test Files` first**, and check the collected count against what you expected. |
| scoped `tsc` clean | `exclude` beat `include`; zero files compiled |
| a test that reads CSS | vitest stubs `.css($|\?)` to `''` — **`?raw` does not escape it** |
| `import type` from a bad path | esbuild ERASES it unresolved; a nonexistent path passes vitest |
| `--listFiles \| grep -c <dir>` | the **TS18003 error text contains the path**, so it counts 1 for a config that compiled nothing |

**Your typecheck recipe:**

```jsonc
// tsconfig.lane-<yourname>.json  — pick the RIGHT base:
//   src/**                  -> ./config/typescript/tsconfig.app.json
//   modules/skai-gaming/**  -> ./config/typescript/tsconfig.gaming.json
//                              (app.json EXCLUDES skai-gaming; exclude BEATS include)
{ "extends": "./config/typescript/tsconfig.gaming.json",
  "include": ["src/**/*.d.ts", "src/test/setup.ts", "<your paths>/**/*"] }
```

Always include **both** `src/**/*.d.ts` (for `vite-env.d.ts`) and
`src/test/setup.ts` (jest-dom matchers), or you get phantom TS2339s.

Prove it compiled something, **anchored**:

```
npx tsc -p tsconfig.lane-x.json --noEmit --listFilesOnly | grep -cE "^[A-Za-z]:/.*<your dir>"   # must be > 0
npx tsc -p tsconfig.lane-x.json --noEmit | grep -c TS18003                                      # must be 0
```

**Mutation-check every claim.** Change the thing you assert, capture the FAILURE
TEXT, restore, re-run green. A mutation can silently NO-OP on CRLF — verify it
actually landed (sha or grep) before trusting red *or* green.

## Shared-tree rules — nine peers are editing the same checkout

- **Do NOT run any git command.** Not status, not add, not commit. The
  coordinator commits.
- **Do NOT run `npm run build` or a whole-project typecheck.** ~10 concurrent
  whole-project `tsc` runs OOM the box (`modules/skai-gaming/tsconfig.json`
  includes `../../src/**/*`). Scoped configs only.
- **NEVER restore a file from a whole-file backup.** A peer's edit lands between
  your backup and your restore and you delete it — this happened, and one
  near-miss would have reinstated a catch-0 payout into a live money file.
  Mutate by exact single-substring replace (Edit fails loudly on non-match).
- **A peer's "defect" may be YOUR peer's live mutation.** A lane reported
  `LIMBO_MAX_BET = 100` as a money bug; it was another lane's in-flight mutation
  test. Re-measure anything you did not observe yourself.
- Migrations: WRITE them, never apply.
- If a file you need is being actively rewritten by someone else, say so and
  work around it. Do not fight over it.

## Escalate rather than guess

Report to the coordinator — do not decide alone — when you find:
a money/RTP/payout change; a currency gate; anything that deletes working
behaviour to match a frame; a regulator/licence mark; a schema change; a
contradiction between two frames with no tiebreak.
