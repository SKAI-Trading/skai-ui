# Running a 30-agent Figma-matching wave

How to turn this catalog into parallel work orders without agents colliding,
fabricating data, or reporting false green. Every rule here exists because the
failure it prevents has already happened in this repo.

## Before the wave: three gates on the work itself

A surface is only safe to hand to a UI agent when all three pass.

**1. Backend exists** — check `backend.tsv`. If `wave_action` is `build-backend`
the surface is NOT UI work; a schema/function agent has to land first. Handing it
to a UI agent produces one of two bad outcomes: the agent stalls, or it
synthesizes the data. The second is worse — it violates the no-mock-data policy
and yields a screen that demos perfectly and lies.

Currently `MISSING`: Whales (no tracked-wallet table), Skai Pro invoices (no
invoice/receipt record or PDF renderer), Agentic Backtesting (no strategy or run
table), Wallet batch send, Wallet payment requests, Trench per-user settings.
That is roughly 60 designed frames with nothing to render from.

`blocked` surfaces — Sportsbook (ODDS key revoked) and Wallet bridge (predeploy
bricked, withdrawals fail-closed) — must not enter a wave at all. The backend is
deployed and non-functional; an agent will "fix" the UI against a dead feed and
the bug will reopen.

**2. The component owner is known** — check `components.tsv`. 25 components carry
54,047 placements. If a screen's defect is really a `CTA/button` defect, fixing it
per-screen multiplies the work by every screen that uses it. Route component-level
findings to the component lane instead.

Note the four marked `outside`: `Header-{mobile,tablet,desktop}` and
`Bottom-navigation-{mobile,tablet}` are single components in Figma but live in the
main app, not `@skai/ui`. They are shared in design and unshared in code — expect
per-surface drift and fix them at the source.

**3. A token/glyph answer exists** — colour and icon questions must be resolved
against `get_variable_defs` and `icons.tsv`, never against a reporter's adjective.
This repo has already shipped a colour change AWAY from Figma because an agent
trusted the word "darker". `sky-blue` renders **green** (#2DEDAD); `alien-green`
(#2DEDAD) and `alien-green-bright` (#17F9B4) are routinely swapped.

## Sequencing 30 agents: conflict domains

Agents collide on files, not on screens. Partition by what a work order WRITES.

| Lane | Writes | Concurrency |
|---|---|---|
| **skai-ui components** | `modules/skai-ui/src/**` | **ONE agent, ever** |
| Main-app shared chrome | `src/components/layout/**`, `src/components/ai/MobileBottomNav.tsx` | 1 |
| Per-section screens | that section's page/component files | many, 1 per section |
| Per-game screens | `modules/skai-gaming/src/**` per game | many, 1 per game |
| Backend | `supabase/migrations/**`, `supabase/functions/**` | 1 per table/function |

**The skai-ui lane is exclusive and non-negotiable.** `dist/` is a single shared
build artifact that every other surface consumes. Two agents rebuilding it race,
and a partial `dist` white-screens the app — the deploy scripts now hard-fail on
sourcemaps shipped without their `.js` siblings precisely because that reached
production once.

**Never let each agent run `npm run build`.** A previous wave told seven agents to
typecheck AND build; ~9 concurrent vite builds deadlocked the machine. Agents
report done; ONE gate run happens at the end.

**Never `git add -A`.** A concurrent session may be committing in the same working
tree — it has happened, mid-session, sweeping unrelated files into a commit whose
message described none of them. Every agent stages explicit paths.

## What a work order must contain

Assembled from the catalog, one per family or component:

```text
target       family + node-ids, all breakpoints (1440 / 768 / 375)
section      catalog section, and its open-bug count from hotspots.tsv
figma        file key + node link  (KEY MATTERS — Home/Wallet/Trade moved to
             Skai-Web-App-2 mhF3BkzlTaGiLzJ7kvpmVc; a stale key still produces a
             well-formed URL that lands on a dead node)
backend      row from backend.tsv + wave_action
components   which of the 25 the screen instantiates
impl         files to modify, and therefore the conflict domain
forbidden    paths this agent must not touch
acceptance   see below
```

## ★ Never remove, never lose code (Casey, 2026-08-12)

Standing rule for every wave from here. Parallel agents make both failures easy
and both expensive.

**Deleting is the last resort, not the first.** A frame not drawing something is
weak evidence on its own — the node may be a placeholder, the frame may cover a
different route, or the element may be live at a breakpoint you did not open.
Before removing anything:

1. Open the frame's **complete child list**, not a screenshot of it. The spot/perps
   lane did this correctly: it enumerated every child of the approved frame and
   named the exact geometry of each before deleting four widgets.
2. Check the element is absent at **all three breakpoints**, not just 1440.
3. Prefer moving over deleting. When the launchpad lane retired
   `TokenProfileRow.tsx`, it first moved that file's `FullScreenPreview` into
   `TokenPreviewPanel.tsx` and left a comment naming the move. Nothing was lost.
4. If a control loses its trigger, give it one rather than orphaning it. Removing
   the desktop token-details band left the Layout drawer's toggle controlling
   nothing, so it was re-pointed at the tablet Info tab — a real switch, not a
   dead one.
5. When unsure, **leave it and report it**. Several lanes correctly declined:
   Trench kept a live `dexId`-driven Protocol filter a placeholder frame omitted;
   spot/perps left `/trade/pro` alone because no frame covers that route.

**Losing code is a different failure, and the wave mechanics are the defence.**
Agents write only inside their lane; nobody runs `git add -A`; nobody commits
(the orchestrator does, in scoped batches, with explicit paths). A concurrent
session shares this working tree — a commit that sweeps unrelated files has
already happened here once.

After every wave, run the deletion audit before reporting success:

```bash
git log --diff-filter=D --name-only --format="%h %s" <base>..HEAD -- src/
git show --numstat <commit> -- src/ | sort -k2 -rn | head
```

The first lists files removed; the second ranks in-file deletions so a large
`-N` gets read deliberately rather than discovered later. A healthy parity wave
is strongly net-additive — this one was +3,818 / −1,151.

## Acceptance criteria

An agent may only report done when all of these hold:

- **All three breakpoints** exist in Figma and in code. A desktop-only
  implementation is not done — this is how family-level `done` verdicts fanned out
  and credited mobile frames that were never built.
- **No fabricated data.** If a source is unavailable the UI renders an explicit
  offline/unavailable state. `unknown` must never collapse to `0` — that is the
  live `getPlatformFee` defect, where a failed read returns 0 and gets cached as a
  real fee.
- **A designed placeholder is not parity.** If a component takes an optional
  `imageSrc`/`icon` and draws a tasteful fallback, grep the CALL SITE to confirm
  the asset is actually passed. The Play hero sat unwired behind exactly such a
  placeholder through a `done` status and a vverify `match`.
- **Screenshot at each breakpoint**, and read it. Rendering catches what static
  review cannot: a 0px-wide Plinko board on phones, a board drawn twice below
  1024px, a footer black-on-black in light theme.
- **The gate is `npm run typecheck:gate`** (tsgo). Plain `npm run typecheck` OOMs
  on ~2190 files; an empty tsc log IS the OOM, not progress. `modules/skai-gaming`
  spells it `type-check` — `npm run typecheck` there exits 1 "Missing script",
  which is indistinguishable from a gate failure by exit code alone.

## Reporting rules

- **Exit 0 from a generator does not mean it wrote anything.** `catalog-view.mjs`
  writes to stdout when given no path; a whole pipeline once reported green while
  the committed markdown still pointed at the old Figma file. Verify the artifact
  — mtime, git dirtiness, or grep for the value you changed.
- **A 100% result deserves suspicion.** The route matcher here once reported
  603/603 matched with "unmatched: none" because `/` has zero path segments and
  became a catch-all that swallowed two whole surfaces. The tell was a number
  moving further than the change justified.
- **Report what was skipped.** A silent top-N or sampling cap reads as full
  coverage to whoever reads the summary next.

## Order to run the wave

1. **Backend agents first**, on `build-backend` rows. Everything else waits on them.
2. **The single skai-ui component lane**, in `components.tsv` usage order —
   `icons/action` and `CTA/button` first, since they are 32,712 placements between
   them. Rebuild `dist` once at the end of the lane.
3. **Section lanes in `hotspots.tsv` order** — `home` 190, `trade-2` 108, `play` 94,
   `trade` 78, `predict` 63. `trade-2` deserves attention out of proportion to its
   age: it is the newest page in the catalog, has no `status.tsv` at all, and its
   407 frames have never been assessed, yet it is already the second-largest source
   of open bugs.
4. **One gate run**, then one deploy.
