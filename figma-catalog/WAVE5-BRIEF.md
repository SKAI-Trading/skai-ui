# Wave 5 — shared lane brief

Read this whole file before touching anything. Every rule here was paid for by a
previous wave getting it wrong; none of it is generic advice.

Your lane assignment names **the files you own** and **the frames you answer
for**. Twenty lanes run at once. The partition is by FILE OWNERSHIP and it is
disjoint: if you find yourself wanting to edit a file outside your list, do NOT
edit it — report it instead.

---

## 0. Hard prohibitions

- **No git commands.** Not `add`, not `commit`, not `checkout`, not `stash`.
  Another session works in this same tree; `git checkout -- <f>` on uncommitted
  work is a DELETE that leaves `git status` clean.
- **No `npm run build`.** No whole-project `npm run typecheck`.
- **Never delete working behaviour** to make a screen match a frame. See §6.
- **Never mention Claude, AI, or an assistant** in code, comments, or files. No
  emojis in anything that could become a commit message.
- Do not edit `src/index.css`. The 44px tap floor there is an open decision
  escalated to Casey (see §4).

## 1. What `done` means — Casey's ruling, 2026-08-26

`done` = **MEASURED PARITY**: geometry, type and colour checked off Figma node
data against the **rendered DOM at that frame's own width**, with the numbers
written into your row.

`done` does NOT mean "I read the code and nobody spotted a difference". The last
wave demoted ~600 rows because they were citations, not measurements. A row
claiming `done` without numbers in its reason column will be demoted again.

Status vocabulary (exact strings): `done` · `partial` · `not-started` ·
`blocked-on-backend` · `frame-defect` · `furniture` · `unknown`.

- `unknown` is the honest answer when you did not measure it. **Use it freely.**
  It is not a failure; a false `done` is.
- `furniture` = canvas chrome, not a screen: `Directory`, `Breakpoint`,
  `Scroll bar`, `Notes`, `Screenshot …`, loose rectangles/text/vectors, hidden
  nodes. Excluded from the parity denominator.
- `frame-defect` = the FRAME is wrong or self-contradictory, not the code.

## 2. Reading Figma without lying to yourself

- **An UNLOADED page reports `children.length === 0`.** Use
  `figma.root.children` for the page list, then `await page.loadAsync()`. Do NOT
  trust `get_metadata` with no nodeId — it once listed 1 page for a 13-page file.
- **Call `setCurrentPageAsync` at most ONCE per `use_figma` call.**
- **Compare ID SETS, not counts.** Two pages with 36 nodes each can differ by a
  2-for-2 swap and a count check sees nothing.
- **A render and node data are authoritative for different things.**
  - Node data gives the exact fill but **silently omits ancestor `opacity`**.
  - A render composites translucency correctly but **antialiases**.
  - Measured case: pill fill `#FFBD16 @ 0.34` really paints `#574007` (render
    right); pill text `#FFBD16` opaque was transcribed from a render as
    `#EAAD15` (render wrong). Check `opacity` on the node AND every ancestor.
- ⚠️ **CORRECTED 2026-08-27 — screenshot render bleed is NOT a constant.** This
  brief originally said "exactly +160w / +109h. Subtract it." **That is false and
  subtracting it will corrupt your measurements.** Measured on the Trade 2 page:
  a 1440x900 frame returned 1440x900 — **zero bleed** — while a 400x470 frame
  returned 560x630, i.e. **+160w / +160h**. The bleed tracks OVERLAPPING CANVAS
  NEIGHBOURS, because the tool defaults to `contentsOnly: false`. It is largest
  on small frames, which is exactly the class most components are.
  ★ **Never subtract a fixed number.** Read the frame's real `width`/`height`
  from node data and treat the screenshot as a picture, not a ruler.
- A high node id does NOT mean a new design — diff fills + text + image lists.

## 3. Radius — the single most repeated mistake

**We ship a different scale from Figma's stock v3.**

| class | Figma v3 | THIS codebase |
|---|---|---|
| `rounded-sm` | 4 | **8** |
| `rounded-md` | 6 | **10** |
| `rounded-lg` | 8 | **12** |
| `rounded-xl` | 12 | **16** |
| `rounded-2xl` | 16 | **24** |

So Figma's `rounded-xl` (12px) is our `rounded-lg`. **There is no class for 4px.**
`design-tokens.ts` says `sm: 4` and is NOT the shipped value — the Tailwind
preset overrides it from `--radius`.

★ **Write PIXEL LITERALS: `rounded-[8px]`.** Never carry the token NAME over from
the frame. Every instance of this found on 2026-08-11 had the correct pixel value
in a comment directly above a class one step too large.

## 4. The 44px tap floor

`src/index.css` forces `min-height/min-width: 44px` on `button` / `a` /
`[role=button]` below 768px — which is exactly the iPad Mini width most reports
come from. A row measuring ~10px taller than the frame is usually this, not
padding.

- **Both blocks exempt `:not(.no-min-size)`.** That class is the sanctioned
  opt-out. Apply it **per control**, with the measured Figma height in a comment.
- **Do NOT edit `index.css`** and do not apply `no-min-size` blanket. Primary
  CTAs in sheets and modals are often legitimately 44px+.
- The header-band case is already escalated to Casey. Leave it.

## 5. Type

`text-*` sets font-size **and** line-height together, so
`text-sm leading-4 lg:text-base` loses the line-height above 1024. Use the slash
form: `text-sm/4 lg:text-base/4`. `tracking-tight` is -0.025em but the SKAI ramp
wants **-0.04em** → `tracking-[-0.04em]` (the preset does not extend letterSpacing).

## 6. When the frame and the app disagree

"Live Figma is always correct" is a **SOURCING** rule — it settles which file to
read, not whether to delete code.

- If matching the frame would **delete working behaviour**, that is Casey's call.
  Write the row as `frame-defect` or `partial`, explain, and move on.
- **A frame crop is not a licence to look wrong.** Single-screen frames crop
  global chrome (headers, nav, footers). Their absence is not a delete order.
- Casey's ruling 2026-08-26: **KEEP *and* RESTYLE** what a frame omits — preserve
  the behaviour AND bring it up to the frame's visual standard.
- Where a value has no source, **OMIT the line — omitted ≠ zero.** A `$0.00` is a
  confident claim; an absent row is not.

## 7. Measuring the running app

- Dev server: `npm run dev` (do not build). Drive Chrome via the
  chrome-devtools MCP tools.
- **Use zero-width scrollbars.** A classic scrollbar cost 6px of body width AND
  made `scrollbar-gutter: stable both-edges` reserve 6px per edge — that 6px got
  filed as a real divergence by a lane that did not control for it.
- ⚠️ **`@skai/ui` resolves through `modules/skai-ui/dist/`, not `src/`.** A change
  to skai-ui source is invisible to the browser until dist is rebuilt. If you
  changed skai-ui and the browser disagrees, that is evidence about the BUILD.
  Check: `grep -c '<your new class>' modules/skai-ui/dist/index.js`.
- ★ **Localhost cannot test trades or complete a POINTS round** — WS Origin 403,
  a mock DEV wallet, and `points-game` CORS pinned to app.skai.trade. Local
  sweeps measure **reachability and layout only**. Do not report a money path as
  verified from localhost.

## 8. Before you believe a checker that says "nothing wrong"

**Make it tell you how much it looked at.** Seven separate vacuous greens have
been shipped by previous waves. Ask for the DENOMINATOR.

- A test run that collected 0 files still exits 0.
- `exclude` beats `include` in tsconfig: `tsconfig.app.json` excludes
  `modules/skai-gaming`, so a lane config based on it compiles ZERO files and
  exits clean. Prove non-vacuity:
  `npx tsc -p <cfg> --listFilesOnly | grep -cE "^[A-Za-z]:/.*<yourdir>"` must be
  > 0, and check `TS18003` separately (a plain `grep -c` counts the error text).
- `--reporter=basic` was REMOVED in vitest 4: it fails to load and **exits 0**.
- Verify a mutation LANDED before concluding a test caught it — only `grep -F`
  is trustworthy for strings with backslashes.
- If the same command is RED for one lane and GREEN for another, that is a
  RACE, not ordering.

## 9. Writing your results

Write **one file**: `modules/skai-ui/figma-catalog/status.wave5.<your-lane>.tsv`

Tab-separated, 5 or 6 columns, no tabs inside prose:

```
<key>	<status>	<primaryFile>	<route>	<reason>	[<bp cell>]
```

**Column 1 must address its own frame.** Use either form:

- `Some Screen [13008-114693]`  — title + bracketed node id (preferred)
- `13008:114693`                 — a bare node id

★ A bare family NAME is only addressable via the file's section and will be
reported as unapplied. Key by node id and your row lands no matter what the file
is called. Use `-` for an empty primaryFile or route.

Column 6 (optional) carries per-width verdicts:
`desktop=renders tablet=partial mobile=broken @2026-08-27`

**Your reason column must carry the numbers you measured.** "matches" is not a
measurement. "header 56 = frame 56; card row y=242 = frame 242; radius 12 =
frame 12" is.

Do NOT edit `registry.json`, `COVERAGE.md`, `coverage.json`, or any other lane's
TSV. The orchestrator runs `apply-status.mjs` and `coverage.mjs` afterwards.

⚠️ **CORRECTED 2026-08-27 — this rule contradicted the drift-lane instructions,
which told those lanes to RUN `coverage.mjs`. Running it REWRITES
`coverage.json`.** Both drift lanes spotted the conflict and did the right thing:
they READ the existing `coverage.json` rather than regenerating it under twenty
concurrent lanes. **That is the rule. Read it, never regenerate it** — the file
already carries a complete `liveOnly` per page, and a regeneration mid-wave races
every other lane's writes.

⚠️ **And know what `liveOnly` actually measures.** It is "no row names this frame
**by node id in column 1**" — a KEYING metric, not a coverage one. Verified
2026-08-27: all 132 Social `liveOnly` frames already carry a real verdict keyed
by title. Do NOT read `liveOnly` as "never assessed".

★ **When you test whether an id is already covered, the id must be in column 1 or
OPENING the reason.** A plain substring search over the line is wrong: one
boilerplate paragraph in `status.wave4.row-conflicts.tsv` quotes an id while
*explaining the id convention*, and a naive match indexed that documentation
example as 41 verdicts. The strict rule cut one page's apparent coverage from 178
to 71.

## 10. Code changes

Edit only files in your assignment. Every visual change gets a comment naming
**the frame node id and the measured value** it came from, in the style already
used across this codebase. Keep changes surgical; do not reformat neighbouring
code.

Run the tests that cover files you touched:
`npx vitest run <specific paths>` — never the whole suite.

## 11. Product constraints you must not violate

- **Predict: a market TYPE is a filter, never a route.** Do not create routes per
  market type.
- **POINTS and sUSD only.** SKAI is not a betting currency.
- Per-game STANDARD online-casino house edges, not a uniform 5%.
- Onboarding and landing are OUT OF SCOPE this wave. Governance is HELD.
- GCB / GambleAware licence marks are absent BY DESIGN (fail-closed). Do not add
  them.
- No mock data. When a real source fails, surface an explicit `unavailable` /
  `offline` state. `unknown` must never render as `0`.

## 12. Report back

Return, in this order:

1. **Counts with denominators**: frames examined / frames in your assignment;
   how many you measured vs read.
2. Your status histogram.
3. Files changed, with what was measured for each.
4. **Anything you could not decide** — escalations for Casey, with the two
   concrete options rather than a question.
5. Anything you found that contradicts this brief.
