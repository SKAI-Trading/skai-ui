# Lane brief — Predict, 2026-08-21

fileKey **`3sSzw1KewMtUbeLAv7uW0r`**, page **`3173:26018`** ("✅ Predict").
Read this whole file before your first tool call.

## The catalog is TRUSTWORTHY here — unlike Social

Verified this session by diffing live ids against `registry.json`:
**284 live top-level children, 284 registry rows, zero live-only, zero
registry-only.** Predict is in step. You may plan from the catalog.

⚠️ But `status` still is not evidence. 130 of the 284 read `status: "unknown"`,
and that is mostly a **measurement artefact** — `apply-status.mjs` skips
non-screen frames, so they can never leave `unknown`. **`unknown` does not mean
unbuilt. Check the code.**

## Casey's rule that governs this whole section

> **A market TYPE is a filter, never a route.**

This has been **superseded twice** by people who built `/predict/sports`,
`/predict/crypto` etc. as separate pages. Crypto / Sports / Politics / Finance /
Breaking are **filters on one surface**. If a frame looks like a standalone
category page, it is a filtered state of the same page. Do not add routes for
them, and if you think you have found a genuine exception, report it instead.

## Hard rules — violating any of these fails the lane

1. **NEVER run git.** ~11 lanes share this working tree; one git command from
   you sweeps up their half-written files.
2. **NEVER run `npm run build`**, and **never a whole-project typecheck** —
   `modules/skai-gaming/tsconfig.json` pulls in `../../src/**/*` and concurrent
   runs OOM the box.
3. **NEVER remove working behaviour to match a frame.** If matching Figma would
   delete something that works, keep it and report the conflict. Casey decides —
   2 of 4 such conflicts were HELD last time.
4. **Touch only your own files.** `src/App.tsx` belongs to NO lane this wave: if
   you need a route, report the exact shape and I apply it.
5. **No mock data, ever.** Unreadable → the `Offline` sentinel from
   `src/services/sourceState.ts`. **`unknown` must never render as `0`.**
6. **Never mention Claude, AI, or any assistant** in code, comments, tests or
   reports.

## What is actually dead behind Predict — measured, not assumed

Casey's ruling for this wave: **build against an explicit unavailable state.**
Ship the component, render a *named* unavailable state, disable controls with a
stated reason, and report precisely what the server would need. Do not fabricate,
and do not skip the frame.

Measured against prod / the live indexer this session:

- **The candle/chart rail is DOWN, not empty.** `GET /api/v1/candles/BTC-USD/1h`
  → **HTTP 503 `{"success":false,"error":"candle engine not available"}`**.
  `s.candleEngine` is nil in the deployed indexer build. `/api/v1/markets` lists
  only `BTC-USD` and `ETH-USD`. Any frame drawing a price chart is drawing
  something that cannot load today.
- **`outcome_markets`: 8 rows, 7 of them PAST `close_time` while still
  `status='open'`, 0 resolved, earliest closed 2026-05-07. `total_volume` is 0
  on all 8.** So every "live market" frame is drawing a board that is, in
  reality, entirely expired.
- ★ **Trading past close is already gated — use the shared predicate.**
  `isMarketTradeable(status, closeTime)` in `src/lib/predict/outcomeFormat.ts`.
  The contract reverts past the deadline (`SKAIOutcomeMarket.sol` `buyShares:808`
  and `sellShares:877` are both
  `if (block.timestamp >= m.closeTime) revert TradingClosed();`). **Do not write
  a second `status === 'open'` check** — that is exactly how the card came to
  print "Closed" while leaving its Yes/No buttons enabled.
- **`predict_comments` does not exist.** `src/components/predict/CommentsModule.tsx`
  (497 lines) and `commentsService.ts` are complete and imported by NOTHING. If
  your frames include the Comments module, that is your unavailable state.
- **`prediction_bets` = 0 rows. `prediction_market_prices` = 0 rows.**
  `skai_prediction_bets` has 1,678 rows but is a **different feature** —
  price-direction bets with `entry_price`/`exit_price`/`market_end`, not Yes/No
  outcome markets. Do not join them.

## Reading Figma correctly

- **Identify every frame by ARTWORK, never its title.** Then **re-read the
  `notes` against the artwork** — notes are wrong about as often as titles and
  they *sound researched*. If a note cites `file:line`, open it; several cited
  bugs were already fixed.
- **NEVER edit a title in `registry.json`.** `figma-drift.mjs` matches RETARGET
  rows by exact title; correcting one makes the frame report REMOVED next
  harvest. Report corrections in your final message.
- ★ **A screenshot is a viewport, not the frame.** A 1440x900 render of a taller
  page **crops it**. On any frame taller than the viewport, read `get_metadata`
  before concluding something is absent.
- ★ **A screenshot is also a RENDER, not a measurement** — it includes the drop
  shadow. Sizes read off a screenshot come out too large. Use `get_metadata`.
- ⚠️ **`hidden="true"` children are common here.** Presence in metadata is not
  the same as being drawn. Check `hidden` before building something.
- `get_metadata` on the whole page returns millions of characters. Query your own
  node ids, never the page.

## Measurements that are bundle-dependent — write explicit px

- `modules/skai-gaming` declares no tailwind preset, so `rounded-lg` is 8px there
  and 12px in the host app. **The same class renders two different radii.**
- Figma's radius scale sits a step below ours: Figma `lg` 8 / `xl` 12 / `2xl` 16
  against our `sm` 8 / `md` 10 / `lg` 12 / `xl` 16 / `2xl` 24.
- `src/index.css:747-753` floors every `button` at **44px** min-height *and*
  min-width at and below 768px (`max-width` is INCLUSIVE — it fires at exactly
  768). A 30px Figma button needs the sanctioned `no-min-size` escape.
- **sUSD displays as USD** via `tokenDisplaySymbol` in `@skai/ui` — a mapping,
  never a rename.

## Verifying your work — read this, the defaults lie

★★★ **`npx vitest run` prints `Type Errors  no errors` and that line is
VACUOUS.** `vitest.config.ts:290` enables `typecheck` but never sets
`typecheck.include`, so it defaults to `**/*.test-d.ts` — and this repo has
**zero** such files. Zero errors across zero files, printed identically whether
your code compiles or not. **Do not cite it.**

Use a scoped real `tsc` instead:

```jsonc
// tsconfig.lane-<name>.json  (delete it when you finish)
{
  "extends": "./config/typescript/tsconfig.app.json",
  "include": ["src/**/*.d.ts", "src/test/setup.ts", "src/<your dirs>/**/*"]
}
```
```
npx tsc -p tsconfig.lane-<name>.json --noEmit
```

⚠️ **Both extra entries are required.** Without `src/vite-env.d.ts` every
`import.meta.glob` reports a phantom TS2339; without `src/test/setup.ts` every
component test reports phantom `toBeInTheDocument` TS2339s. Three lanes chased
those ghosts last wave. Errors reached through *imports* are pre-existing —
attribute before you fix.

★★ **A suite that fails to COLLECT still shows an all-green `Tests` line.** A
parse error or an import that throws at module scope reports as a *Failed Suite*
while `Tests 118 passed` prints beside it, because zero tests were collected so
zero failed. **Read the `Test Files` line first** and check the collected count
against what you expect.

⚠️ `replaceAll` is **ES2021** and the gate's `lib` is ES2020 — it is TS2550. Use
`.split(x).join(y)`.

**Vitest 4:** `vi.fn<() => Promise<T>>()` takes ONE type arg. A zero-param
`vi.fn` makes `.mock.calls` elements `[]`, so indexing them is TS2493 — type the
parameters (`vi.fn(async (..._a: unknown[]) => r)`) rather than deleting the
which-arguments assertion.

**Narrowing traps that cost 16 real errors last wave:**
```ts
if (isOffline(a) || isOffline(b)) { … }   // narrows NEITHER operand
const t = cond ? a : b;                   // a ternary does NOT narrow its else
```
Split the union into two typed locals BEFORE the JSX. **Never silence these with
a cast** — a cast compiles and then hands an `Offline` sentinel to a renderer,
which is a fabricated value on screen.

## Tests: an independent oracle, then prove it bites

- Expected values are **transcribed by hand from the frame into the test file**.
  A test that re-derives its expectation from the code under test passes over
  broken code.
- **Mutation-check every meaningful assertion**: break the source, capture the
  real failure text, restore, re-run green. Put the captured text in your report.
- Use **per-file** backups, never a directory copy — 11 lanes share this tree and
  a peer nearly lost another lane's files that way.
- For source-scanning tests the strong mutation is **delete the code, keep the
  comment** — a docblock naming a symbol passes a naive `source.includes()` with
  the real code gone. Strip comments before scanning.
- One fixture **per frame**. Merging frames produces a merged oracle.

## Your report

1. **Frames**: how many you opened, by node id, and how you identified each.
2. **Catalog corrections**: any title or note contradicting the artwork.
3. **What you built**, file by file.
4. **What you did NOT build and why** — especially anything drawn with no server
   model behind it. Name it and stop; do not fabricate.
5. **Mutation checks**: captured failure text for each.
6. **Out-of-scope defects** with `file:line`.
7. Exact test command and result — the `Test Files` line, and your scoped `tsc`
   result. Not the vitest type line.

State counts as `n = …` with how you measured. If you could not verify
something, say so plainly rather than implying you did.

★ **A claim about the tree has a shelf life of minutes in a wave this parallel.**
Where a claim is checkable, land a guard instead of prose.
