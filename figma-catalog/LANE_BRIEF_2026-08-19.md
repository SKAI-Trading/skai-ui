# Lane brief — Figma implementation wave, 2026-08-19

You own ONE section. Implement its Figma designs in code.

## Source of truth
- Figma file `M6r9FEn042UWTQD1zvy6GM` (Skai-Games).
- Catalog: `modules/skai-ui/figma-catalog/registry.json` — filter `frames` by your
  `section`. Keys are `fileKey:nodeId`. Read `notes` FIRST; several carry
  hard-won corrections.
- Read live Figma with the Figma MCP (`get_metadata`, `get_screenshot`,
  `get_design_context`). If an MCP call hangs, fall back to the catalog and SAY SO.

## HARD RULES
1. **Never delete code.** Casey's standing rule. Gate behind a flag, comment, or
   leave in place — but do not remove. If something must go, report it instead.
2. **Match Figma** — but see TRAPS: a frame is a picture, not an authority on money.
3. **NO git commands.** Do not commit, stage, push, or `git add`. The tree is
   shared with other sessions; the orchestrator commits.
4. **NO `npm run build`. NO whole-project typecheck.** Recurring-issues §316: 20
   lanes each running `tsc -p tsconfig.json` OOMs the box (that config pulls in
   `../../src/**`). Run **vitest only**, from INSIDE `modules/skai-gaming`.
5. Do not touch files outside your write scope. If you find a defect elsewhere,
   REPORT it with file:line — another lane owns it.

## TRAPS THIS WAVE ALREADY PAID FOR
- **Radius is bundle-dependent.** `modules/skai-gaming/tailwind.config.js` declares
  no preset, so `rounded-lg` = stock 8px there, but 12px under the host app whose
  globs cover this module. **Always write explicit px** (`rounded-[12px]`).
  Figma's scale sits a step below ours: its `md` 6 / `lg` 8 / `xl` 12 / `2xl` 16
  vs our resolved `sm` 8 / `md` 10 / `lg` 12 / `xl` 16 / `2xl` 24. Convert to
  PIXELS first, then pick.
- **Figma labels lie in this file — three proven cases.** Four cover frames are all
  named "Cards ALT - Chicken" (they are hi-lo, chicken, darts, fortune wheel);
  page 9660:2 was renamed SKAI Cross -> Price Grid and its contents replaced;
  Slide's Directory breadcrumb reads "Skai Originals > Towers". **Identify a
  frame by its ARTWORK, never its label.**
- **Never take a money value from a frame.** Keno's frames printed payouts
  matching no row of the server table. Limbo's desktop frames pair a 2.00 target
  with a 1.98 payout — applying the house edge twice. Verify every multiplier,
  payout, RTP or odds figure against the settlement rail
  (`supabase/functions/_shared/*`, `points-game`, `game-settlement`, or
  `modules/skai-chain/core/gaming/`) and report the comparison.
- **No mock data.** Production paths never synthesise prices/odds/counts. When a
  source fails, surface an explicit unavailable state.
- **sUSD displays as USD** via `tokenDisplaySymbol` from `@skai/ui` — a mapping,
  never a rename. Identity stays `sUSD`.
- `src/index.css:749` floors `button`/`a` at 44px min-height below 768px;
  `no-min-size` is the sanctioned escape.
- Tailwind `text-*` resets line-height — use the slash form (`text-sm/4`).

## VERIFICATION (required)
- Tests live beside the code, run with vitest from inside `modules/skai-gaming`.
- **Independent oracle**: your expected values must come from a source your code
  does not import — parse the rail's source at run time, or transcribe the Figma
  literal. A test that re-derives its expectation from the code under test proves
  nothing.
- **Mutation check**: break the thing you fixed, show the test fails, restore it.
  Paste the failure line in your report.
- State `n` for any claim quantified over a set ("all ten pages" — how many did
  you actually open?).

## REPORT BACK
- What you changed, file by file.
- What you MEASURED (numbers, not adjectives).
- Mutation-check output.
- What you did NOT do and why (blocked, out of scope, needs a ruling).
- Anything you found outside your scope, with file:line.
