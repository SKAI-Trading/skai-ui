# Wave 39 — implement Figma pages toward parity (2026-09-09)

You are one lane of a 13-lane wave. Your work order is `<lane>.json` beside this file:
every open frame in your assignment, with its Figma link, page, current status, the
route it maps to and the files that implement it. Casey's direction: **the Figma
design is exactly how the system is meant to be.** Build to the frame. The only
overrides are explicit rulings (below). `done` means MEASURED against the frame, not
"I changed the code".

## Repo facts you need

- Main app: `C:\Users\casey\Documents\GitHub\Skai-Trading` (React + Vite, Tailwind). Games:
  `modules/skai-gaming` (its own git). Wallet: `modules/skai-wallet` (own git). Landing:
  `modules/skai-landing` (own git). UI package: `modules/skai-ui` (own git; **you may not
  edit `modules/skai-ui/src`** — report component-level defects instead).
- Every primitive comes from `@skai/ui`; never hand-roll a Button/Card/Input.
- Boards are 1440 / 768 / 375. Tailwind `sm:` (640) matches none of them; `md:` is 768,
  `lg:` is 1024. Radius: write pixel literals (`rounded-[12px]`), our token scale differs
  from Figma's stock one. Under 768 a global 44px touch floor applies unless `no-min-size`.
- Read a Figma frame with `get_design_context` / `get_screenshot` (fileKey + node id from
  your JSON). Use `use_figma` only read-only, and load the `figma-use` skill first. Read the
  frame's measured width, never its name; several frames are named `(768 x 1024px)` and
  measure 375.
- Product rulings that override a frame: MoonPay is the only on-ramp (a frame showing
  others is wrong); a panel with no live data source stays `unavailable`, never a
  fabricated number (no-mock-data policy: no `Math.random`, no hardcoded tables); sUSD is
  displayed as USD; Legend tier is $499.99 per month; never change a payout or RTP to match
  a design; the rail beats the frame on money.
- Backend gate: if a surface has no table or function behind it (Whales, Skai Pro
  invoices, wallet batch send, payment requests, Trench per-user settings), build the
  honest empty/unavailable state and mark the row `blocked-on-backend`. The Bridge modal
  is bricked and off-limits. Sportsbook frames are out of this wave.

## Ownership — the rule that keeps 13 lanes from destroying each other's work

- You may edit ONLY the paths listed under `owns` in your launch prompt. Every other path
  is another lane's or a peer session's. If a frame in your list needs a file you do not
  own, MEASURE it, write the row naming the exact file and change needed, and move on.
- **In-flight peer files, never touch:** `src/pages/predict/PredictDashboard.tsx`,
  `src/pages/predict/__tests__/dashboardCategoryStrip.figmaParity.test.tsx`,
  `modules/skai-gaming/src/components/play/ui/PlayModeCards.tsx`,
  `modules/skai-gaming/src/components/play/ui/PlayModeCards.artCrop.test.tsx`,
  `modules/skai-gaming/src/components/play/ui/PlayModeCards.artSplit.test.tsx`,
  `modules/skai-wallet/src/__tests__/components/swapSheetContainerRamp.test.tsx`,
  `modules/skai-landing/src/pages/StatusPage.tsx`.
- Never remove or delete code to match a frame. A single-screen frame crops global
  chrome; an omitted control is not an instruction to delete it. Prefer moving; when
  unsure, leave it and report it.
- Do not message other lanes. Report to the orchestrator only, in your final report.
- Scratchpad files must carry your lane name (`measure.<lane>.mjs`).

## What you must NOT run

- No `npm run build`, no `vite build`, no `tsc` over the whole project, no `npm install`,
  no dev server (`npm run dev`, `vite`), no browser tools (chrome-devtools, playwright).
  Twelve lanes doing any of those starves the machine and the shared `.vite` cache; a
  build during a wave measures half-written work. One gate runs after the wave.
- Allowed: `npx vitest run <your own test file>` from inside the submodule that owns it,
  and `npx tsc --noEmit` is NOT allowed (it is the whole program). Type-check by reading
  the types you use.

## How to work a frame

1. Open the frame (`get_design_context`, then `get_screenshot` when layout matters). Note
   measured width, the children, spacing, type, colour tokens. Compare to the component.
2. Implement the difference in files you own. Small, reviewable edits. Keep existing
   behaviour and data wiring; this is parity, not a rewrite.
3. Measure what you built against the frame from the source: sizes, spacing, order,
   copy, tokens. Where a state cannot be reached from source alone, say so.
4. **Commit every few files** with explicit pathspecs from the repo that owns them:
   `git add -- <files> && git commit -m "<message>"`. Never `git add -A`, never
   `commit -a`. On `index.lock`, wait 5 s and retry up to 5 times; never delete a lock you
   did not create. Push is the orchestrator's job; do not push. Messages are plain,
   present-tense, name the surface, no emoji, no mention of tooling.
5. Write your status rows as you go (below). A frame you looked at but did not change
   still gets a row with its measured verdict.

## Status rows — the deliverable that moves the number

File: `modules/skai-ui/figma-catalog/status.wave39.<lane>.tsv`. Copy the header and comment
style from `status.wave37.play-instant.tsv`; the column grammar is in `SCHEMA.md` (status
rows) and column 6 (`bp`) follows `bp.mjs`: `1440=<verdict> 768=<verdict> 375=<verdict>
@2026-09-09/wave39-<lane>`. One row per frame, keyed by node id (hyphen form, e.g.
`4711-28434`). Status vocabulary: `done` (built and measured to match at every width the
frame covers), `partial` (built, named gaps), `not-started`, `blocked-on-backend`,
`frame-defect` (the frame itself is wrong; say how), `furniture`. Reason column: what you
measured, in numbers, and what remains. Never edit an existing `status.*.tsv`.

## Final report (return this, under 300 words)

- Frames in assignment / examined / done / partial / blocked / handed off (with the
  file each hand-off needs).
- Commits: repo and short SHA for each.
- The status file path and row count.
- Decisions only Casey can make, one line each.
- Anything you found that is not yours (a peer's dirty file, a broken shared component).
