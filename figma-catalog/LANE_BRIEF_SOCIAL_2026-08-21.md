# Lane brief — new Social designs, 2026-08-21

Casey has added **139 new frames** to the Social page since the catalog was
harvested. Live top-level children of page `4914:113562` = **442**;
`registry.json` holds **311** for `section: social`. You are one lane of ~20
working the delta.

fileKey: **`3sSzw1KewMtUbeLAv7uW0r`**. Read this whole file before your first
tool call, and read `SOCIAL_LABEL_CORRECTIONS_2026-08-20.md` too — it records
the label traps this section is full of.

## Hard rules — violating any of these fails the lane

1. **NEVER remove code, features, or working behaviour.** If matching Figma
   would delete something that works, **keep it and report the conflict**.
   Casey decides. Two of four such conflicts last wave were HELD.
2. **NEVER run git.** No add/commit/push/checkout/stash/reset. ~20 lanes share
   this tree; a git command from you sweeps up their half-written files.
3. **NEVER run `npm run build`** and **never a whole-project typecheck** —
   `modules/skai-gaming/tsconfig.json` includes `../../src/**/*` and 20 lanes
   running it OOMs the box. Verify with a scoped `npx vitest run <your paths>`.
4. **Touch only your own files.** Found a defect elsewhere? Report `file:line`.
   **`src/App.tsx` belongs to ONE lane this wave** — if you need a route, report
   the exact shape you need and I will apply it.
5. **No mock data, ever.** Unreadable → the `Offline` sentinel from
   `src/services/sourceState.ts`. **`unknown` must never render as `0`.** A
   confident `0` is a claim; an omitted value is honest.
6. **Never mention Claude, AI, or any assistant** in code, comments, tests or
   reports. No emojis in anything that could become a commit message.

## ⚠️ Two of these surfaces have NO backend. Expect it.

Last wave established, and it is probably still true — **verify, do not assume**:

- **`Sample post / token` detail has no route and no post entity.**
  `predict_comments` does not exist; `CommentsModule.tsx` (497 lines) and
  `commentsService.ts` are complete and imported by nothing.
- **`Sample creator profile` is a surface the app does not have.** There is a
  `/u/<handle>` route that resolves to nothing, and `Discover.tsx` used to link
  a *ticker* to it as if it were a person's handle.
- **Stories have no entity anywhere in `src/`.**

If your frames need one of these, the deliverable is **a component built against
an explicit unavailable state, plus a precise report of what the server would
need** — not a shell that fabricates. Building a surface that renders invented
counts is worse than not building it.

## Reading Figma correctly

- **Identify every frame by ARTWORK, never its title.** In this section 102
  frames titled `Skai > Play 1VH` are Social; four cover frames titled
  "Cards ALT - Chicken" are four different games. Titles here are wrong at scale.
- **Then re-read the `notes` against the artwork.** Notes are wrong about as
  often as titles and they *sound researched*. If a note cites `file:line`, open
  it — several cited bugs were already fixed.
- **NEVER edit a title in `registry.json`.** `figma-drift.mjs` matches RETARGET
  rows by exact title; correcting one makes the frame report as REMOVED next
  harvest. Report corrections in your final message.
- ★ **A screenshot is a viewport, not the frame.** A 1440x900 render of a taller
  drawer or panel **crops it**. Last wave a "Visible statistics" block with four
  toggles sat at y=701 inside an 884px panel and was invisible in the
  screenshot — "matching Figma" would have deleted four working controls.
  **On any frame taller than the viewport, read `get_metadata` before concluding
  something is absent.**
- `get_metadata` on the whole page returns ~12.8M characters. Query your own
  node ids, never the page.

## Measurements that are bundle-dependent — write explicit px

- `modules/skai-gaming` declares **no tailwind preset**, so `rounded-lg` is 8px
  there and 12px in the host app. **The same class renders two different radii.**
- Figma's radius scale sits a step below ours: Figma `lg` 8 / `xl` 12 / `2xl` 16
  against our `sm` 8 / `md` 10 / `lg` 12 / `xl` 16 / `2xl` 24.
- `src/index.css:747-753` floors every `button` at **44px** min-height *and*
  min-width below 768px. A 30px Figma button needs the sanctioned `no-min-size`
  escape. ⚠️ Most of this wave is 375/768 frames, so you WILL hit this.
- **sUSD displays as USD** via `tokenDisplaySymbol` in `@skai/ui` — a mapping,
  never a rename.

## Tests: an independent oracle, then prove it bites

- Expected values are **transcribed by hand from the frame into the test file**.
  A test that re-derives its expectation from the code under test passes over
  broken code.
- **Mutation-check every meaningful assertion**: break the source, capture the
  failure text, restore, re-run green. Put the captured text in your report.
- For source-scanning tests the strong mutation is **delete the code, keep the
  comment** — a docblock mentioning a class name passes a naive
  `source.includes()` with the real code gone.
- One fixture **per frame**. Merging frames produces a merged oracle that fails
  against correct code.

### Vitest 4 traps — vitest says green, the GATE fails

```ts
vi.fn<[], Promise<T>>()        // WRONG: TS2558, and collapses the mock to `never`
vi.fn<() => Promise<T>>()      // right: ONE type arg, the whole function type

const spy = vi.fn(async () => r);            // .mock.calls elements are []
spy.mock.calls[0][0]                         // TS2493
const spy = vi.fn(async (..._a: unknown[]) => r);   // right
```

The second blocks the assertion that checks **which** arguments a mock got —
type the parameters, don't delete the assertion.

## Your report

1. **Frames**: how many you opened, by node id, and how you identified each.
2. **Catalog corrections**: any title or note contradicting the artwork.
3. **What you built**, file by file.
4. **What you did NOT build and why** — especially anything the frames draw with
   no server model behind it. Shipping a control that does nothing, or a promise
   the system cannot keep, is worse than leaving a frame unbuilt. Name it and stop.
5. **Mutation checks**: captured failure text for each.
6. **Out-of-scope defects** with `file:line`.
7. Exact test command and result.

State counts as `n = …` with how you measured. If you could not verify
something, say so plainly rather than implying you did.

★ **A claim about the tree has a shelf life of minutes in a wave this parallel.**
Where a claim is checkable, land a guard instead of prose — the artefacts that
survived last wave were the executable ones.
