# Lane brief — gap-closure wave, 2026-08-20

You are one lane of 30 working the same repo **at the same time**. Read this
whole file before your first tool call.

## Hard rules — violating any of these fails the lane

1. **NEVER remove code, features, or working behaviour.** If matching Figma
   would delete something that works (a live funnel, a wired preference, an
   option the frame does not draw), **keep the code and report the conflict**.
   Casey decides. Two of four such conflicts in the last wave were HELD, not
   applied.
2. **NEVER run git.** No `add`, `commit`, `push`, `checkout`, `stash`, `reset`.
   The orchestrator banks your work. Other lanes share this working tree — a
   git command from you sweeps up their half-written files.
3. **NEVER run `npm run build`** and **never run a whole-project typecheck.**
   `modules/skai-gaming/tsconfig.json` includes `../../src/**/*`; 30 lanes
   running that OOMs the box. Verify with a scoped `npx vitest run <your paths>`.
4. **Touch only the files your lane owns.** If you find a defect outside your
   lane, **report it with `file:line`** — do not fix it.
5. **No mock data, ever.** Production paths never synthesize prices, counts,
   liquidity or sentiment. When a real source fails, return the `Offline`
   sentinel from `src/services/sourceState.ts` (`number | Offline`,
   deliberately no third case) and let the UI render an explicit unavailable
   state. **`unknown` must never render as `0`.** `?? 0` on an unread value is
   the single most common way this repo has shipped a lie — a confident
   `$0.00`, a green `▲ 0.00%`, "0 holders". An omitted value is honest; a zero
   is a claim.
6. **Never mention Claude, AI, or any assistant** in code, comments, tests or
   reports. No emojis in anything that could become a commit message.

## Figma is the source of truth — but read it correctly

- **Live Figma is always correct.** If the catalog and the live file disagree,
  the live file wins. This is a *sourcing* rule, not a quality rule: it tells
  you where truth lives, not that every frame is well-designed.
- **Identify every frame by its ARTWORK, never its title.** Titles in this
  catalog are wrong at scale — 102 frames titled `Skai > Play 1VH` are the
  Social section; 6 titled `Skai > Launch > Live` are the live-stream browser.
- **Then re-read the `notes` field against the artwork you just saw.** Notes
  are wrong as often as titles and they *sound researched*. Six corrections
  last wave were notes. If a note cites a `file:line`, open it — several cited
  bugs were already fixed.
- **NEVER edit a title in `registry.json`.** `figma-drift.mjs` matches RETARGET
  rows by exact title; correcting one makes the frame report as REMOVED on the
  next harvest. Report corrections in your final message instead.
- A single-screen frame **crops global chrome**. Absence of a header in one
  frame is not an instruction to delete the header.

### File keys (`registry.json` → `sectionFile`)

| Section | fileKey |
|---|---|
| social, predict, governance, play, onboarding, legal, master-sheet | `3sSzw1KewMtUbeLAv7uW0r` |
| home, home-2, wallet, wallet-2, trade, trade-2, pwa | `mhF3BkzlTaGiLzJ7kvpmVc` |
| every individual game (darts, chicken, hilo, keno, …) | `M6r9FEn042UWTQD1zvy6GM` |

Use `get_screenshot` to see artwork, `get_metadata` for geometry,
`get_design_context` for tokens and structure. `get_metadata` with **no**
nodeId on a large file returns one page and is useless — always pass a nodeId.

## Measurements that are bundle-dependent — write explicit px

- `modules/skai-gaming/tailwind.config.js` declares **no preset**, so
  `rounded-lg` there is stock **8px**; the host app's preset makes it **12px**,
  and the app's globs cover skai-gaming. **The same class renders two different
  radii depending on which bundle compiles it.** Always write `rounded-[12px]`.
- Figma's radius scale sits one step below ours: Figma `md` 6 / `lg` 8 / `xl`
  12 / `2xl` 16 versus our resolved `sm` 8 / `md` 10 / `lg` 12 / `xl` 16 /
  `2xl` 24. A Figma `rounded-lg` is **8px**, not our 12.
- Spacing is *not* bundle-dependent (`skaiSpacing["8"]` = 32px = stock).
- `src/index.css:747-753` floors every `button` at **44px** min-height *and*
  min-width below 768px. A 30px Figma button needs the sanctioned
  `no-min-size` escape, not a fight with the cascade.
- **sUSD displays as USD** everywhere, via `tokenDisplaySymbol` in `@skai/ui`.
  It is a display mapping, never a rename.

## Tests: an independent oracle, then prove it bites

- The expected values go in the **test file, transcribed by hand from the
  frame**. A test that re-derives its expectation from the code under test
  passes over broken code and proves nothing.
- **Mutation-check every meaningful assertion**: break the source, capture the
  actual failure text, restore, re-run green. Put the captured failure text in
  your report. An assertion you did not see fail is an assertion you did not
  write.
- For tests that scan source text, the strong mutation is **delete the code,
  keep the comment** — a docblock mentioning a class name will pass a naive
  `source.includes()` check with the real code gone.
- One fixture **per frame**. Merging two frames into one fixture produces a
  merged oracle that fails against correct code.

### Vitest 4 typing traps — `vitest` says green, the GATE fails

The gate **does** typecheck `src/**` test files. Three lanes hit these on
2026-08-19 and all three reported "Type Errors no errors" from vitest:

```ts
vi.fn<[], Promise<T>>()          // WRONG — TS2558, and collapses the mock to `never`
vi.fn<() => Promise<T>>()        // right: ONE type arg, the whole function type

const spy = vi.fn(async () => r);              // .mock.calls elements are []
spy.mock.calls[0][0]                           // TS2493
const spy = vi.fn(async (..._a: unknown[]) => r);   // right
```

The second one matters beyond the type error: it blocks the assertion that
checks **which** arguments a mock got. Type the parameters — do not delete the
assertion.

Also avoid the smell `(...args: unknown[]) => fn(...(args as []))`; the `as []`
is what forces the empty tuple.

## Database work

If your lane needs schema or policy changes: **write the migration file** under
`supabase/migrations/` with a timestamped name, and **do not apply it**. Read
live schema read-only to verify your assumptions (`list_tables`,
`execute_sql` with SELECTs). The orchestrator reviews and applies.

Verify at the **object** level, not the row level — a missing row means
*unknown*, not *absent*. Check `pg_proc` / `pg_policies` / `pg_constraint`
directly; `information_schema` under-reports cross-schema FKs.

## Your report

End with a report covering:

1. **Frames**: how many you opened, by node id, and how you identified each.
2. **Catalog corrections**: any title or note that contradicts the artwork.
3. **What you built**, file by file.
4. **What you did NOT build and why** — especially anything the frames draw
   that has no server model behind it. Shipping a control that does nothing, or
   a promise the system cannot keep (a fee, a guarantee, a privacy claim), is
   worse than leaving the frame unbuilt. Name it and stop.
5. **Mutation checks**: the captured failure text for each.
6. **Out-of-scope defects** with `file:line`.
7. Exact test command you ran and its result.

State counts as `n = …` with how you measured. If you could not verify
something, say so plainly rather than implying you did.
