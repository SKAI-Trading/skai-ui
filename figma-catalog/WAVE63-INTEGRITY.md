# Wave 63 — integrity record (2026-09-22)

**Figure: 1,232 of 3,816 in-scope genuine frames done (32.3%), 810 verified.**
Wave 62 closed at 1,202 / 778 against a denominator of 3,820. 14 lanes (twelve at dispatch, two more into slots the first finishers freed), 136 rows. Pipeline
exit 0, both validators exit 0, conflicts 3 → 0.

**+30 done and +32 verified, with nothing pulled back** — wave 62 moved +2. The denominator fell 3,820 →
3,816 because four May sign-up modals left it under Casey's 2026-09-19 ruling that the landing's August
frame set governs and "the May boards are marked superseded on those terms" — checked before the verdicts
were accepted, in two independent records (`WAVE51-INTEGRITY.md` §3 and the rulings log). Nothing was built
for them, so the numerator does not claim them.

| page | frames promoted to done |
| --- | --- |
| Governance and Utilities | 8 |
| Trade 1 | 7 |
| Onboarding and Authentication | 5 |
| Home 1 | 4 |
| Social | 3 |
| Play | 2 |
| Home 2 | 1 |

The frames a verdict was holding open — which no brief could assign until this wave's generator fix —
fell from 76 to 57: sorted first in every table, they were the cheapest closes available, as predicted.

## Before the wave: the catalog was re-harvested, and three dispatch defects were fixed

**The boards the lanes read are the boards the catalog holds.** A hash-first verify over every page of all
three Figma files found **50 of 51 pages identical** to the last harvest. The one change was the Towers draft
page (`10120:10113`, scope `excluded`, named "Disregard"): 51 → 53 top-level children, a vectorised mask group
`12155:33` and its hidden source `12155:4`. The chunk tiled the page exactly; the page is unsectioned, so
nothing folded in — 4,801 frames before and after, no field changed on any surviving frame. Drift: 0 rows.

`figma-todo.live.tsv` dropped from 62 rows to none in that refresh, which looked like an instrument losing
rows. It was not: the list is written by `catalog:drift`, which runs *before* `snapshot-to-nodes` resolves
what it lists, so the committed copy is always one fold behind. The 62 dated from 2026-09-14 and every one
had a specific resolution in today's data — the two ADDED Hooked frames catalogued, the four
REMOVED-WITH-WORK frames gone from Figma and from the registry, the 55 RETITLED rows cleared when the harvest
rewrote titles from layer names.

**1. 37 open frames could never be assigned to any lane.** The brief generator filtered on the registry's
status, which still reads `done` for a frame whose claim a `partial` or `deferred` verdict pulled back. The
published figure counts those as open. The generator now takes "open" from `coverage.json` — the file the
figure is computed from — keyed `id|page` because ids repeat across the cloned files, and lists those frames
FIRST, annotated with the verdict that holds them. Someone already built them; the verdict names the gap.

**2. Five lane goals named work that had already landed**, each checked at HEAD before dispatch and struck:
`ConnectedOrderBook.figmaChrome.test.tsx`'s "two reds" (green 21/21), the COSMIC SLOTS tile name
(renamed; the fix is recorded at `fishermanSlotsPageContent.ts:147`), `onWalletCancel` (wired in
`SkaiSignInFlow.tsx:449` and `LandingWaitlist.tsx`), the Farmers docblock (struck), and the Predict
two-layer row (live as `PredictHeaderSecondLayer`, `HomeTopBar.tsx:136`). Wave 62 had found one whole Goal
stale; this wave's lanes had mostly not run since before wave 60, so their goals were older still.

**3. The lane rules named a Figma connector that had disconnected.** `mcp__plugin_figma_figma__*` went away
this session and `mcp__claude_ai_Figma__*` carries the same tools, deferred. Twelve lanes would each have
spent their start-up discovering that; the derivation now names the live tools and how to load them, and
asserts no stale name survives.

## Found mid-wave: the work list was routed on each frame's oldest guess

The governance-dao lane opened its status file with a note that was not about any frame: *"ROUTING DEFECT,
not a frame finding"* — five earn frames come back to it every wave, though their file belongs to defi-earn.
The cause was in the brief generator. `implFiles` accumulates column 3 of each successive row, oldest first,
and the generator routed on `implFiles[0]`: the least-informed guess, often a placeholder written before the
page existed ("NONE - no per-opportunity detail route"). That placeholder is rejected as not a path, so the
frame fell to its section's fallback lane, whatever file a later row had named.

Measured catalog-wide from probe copies (the dispatched briefs were not touched): routing on the latest real
path moves governance-dao from 415 open to 301, and learn-pages from 3 to 45 — so the section Casey ruled on
09-19 should be BUILT was invisible to its own lane — with defi-earn +52, wallet-components +43 and
skai-ui-primitives +16. Twenty-four frames leave the assignable pool because their latest file is fenced.
"The largest slice in the catalog" was partly a routing artifact. Fixed for wave 64.

## The lanes' own type check never ran, for at least two waves

The social-profile-discover lane reported, with a deliberate error as proof, that the lane rules'
scoped-tsc template gave a false pass. Verified independently: the template put a tsconfig in the
scratchpad that inherited `types: ["vitest/globals","@testing-library/jest-dom"]`; from outside the repo
neither resolves, so tsc raised two TS2688 options errors — and **tsc skips semantic checking entirely
when options errors exist**. A file with a deliberate TS2322 produced 2 TS2688 and **0 TS2322**. Every
"scoped tsc: exit 2 on type-root errors only, 0 in my files" this wave and last was checking nothing.

The fold's `typecheck:gate` runs the real config in a clean worktree, so nothing unchecked ships; what the
defect cost was the lanes' own confidence, which was false. The template now clears `types` and names both
libraries by absolute path — it reports the deliberate error and exits 0 on a clean file — and the rules
say plainly that **any TS2688 in the output means nothing was checked**. All running lanes were told
mid-wave and asked to re-run their changed files.

## The rules carried facts they had outlived

The wave-63 rules were derived from wave 62's by adding lessons, never by re-checking what they carried.
Three carried facts were false: that the gate is blind to `src/components/home-redesign` (wave 62 removed
that exclusion — and one lane reported it back as fact), that the exclusion's errors were still to be fixed,
and that the touch floor lives at `index.css:748-754` (it has moved; the rules now name it by content). All
three corrected mid-wave; a correction to a false statement is safe to publish while lanes run, unlike a
change to routing.

## Three red tests nobody looked at, repaired

Two deliberate, measured header changes (`533905ee9`, the with-deposit board's 85.67 gap; `2328a4731`, the
phone's own second-layer arm) had left three oracles red since they landed, because no gate runs them. One
read only string literals and fell through to the next element when the classes moved into `cn()`; one
guarded "one second-layer arm per utility" at ANY width, so a deliberate second breakpoint tripped it.
Re-pointed in `2ad074fcb`: the guard is per breakpoint (two arms at the same breakpoint still throw), the
phone arm gets its own case, and six mutations — each defect put back in a clean worktree — turn the suites
red.

## A fabricated figure on skai.trade

The onboarding lane found the waitlist hero printing **8,700** as a live count whenever the real read fails:
`useWaitlistCount(8700)` keeps its default on every failure path — timeout, error, bad payload, missing env.
Its comment called that fallback one that "tracks the real ~8.7k DB count (bug 961751b1, was 2500)": a wrong
count fixed by hard-coding the day's number, which drifts the moment the waitlist grows. The tests that
pinned the old 2,500 went red when it moved and stayed red. The lane was granted the two unowned test files
to replace the default with `number | Offline` and rewrite the tests to the honest contract. It did, in skai-landing `b689182`: the hero draws an ellipsis while the read settles and a dash when it fails, and putting the old behaviour back turns the rewritten tests red.
⚠ This does not reach skai.trade until a landing deploy — nothing is deployed this wave.

## Lane selection

Twelve lanes, the ceiling set on 2026-09-21 — concurrency divides a fixed budget per window and every lane
pays a start-up cost before its first row, so twenty lanes land fewer rows than twelve. Rotated onto the
largest slices that had not been worked since before wave 60: governance (415 open), home 1 (208), trade
spot (133), trench discover and launch (127), trade perp (115), trench trade (109), home 2 and the AI
screens (102), social profile (87), onboarding (72), sportsbook (70), Hooked and Untamed (64), streaming (48).
Left out on purpose: the lanes of the last two waves whose remaining frames are mostly blocked on Casey calls
— games-instant reached 2 of 14 last wave for that reason.

## What the lanes built

| lane | done | notes |
| --- | --- | --- |
| trade-perp | 8 | The leverage field Casey ruled at 62 was shipping **64**. "Delete position" is drawn and refused, the honest state for a rail that cannot close. Two frames the catalog called done were 2px over and missing their "Active" row. |
| learn-pages | 7 | Rebuilt the article composer; two old notes proved wrong (the modal title is centred; the toolbar opens from a "+"). |
| onboarding-landing | 5 | Plus 4 ruled out. The fabricated waitlist count is gone, and the hero logo — never position-checked — sat 68px low at 1440 and 33.5px high at 375. |
| home-portfolio-feed | 4 | None of its 14 assigned frames was editable (their files belong to lanes not running), so it built the export-key dialog and the badge preview from its overflow list; six boards read for the first time. |
| sportsbook | 2 | All 14 reached. The bet-placed toast was **built but never mounted** — the dominant defect class again — and wave 56's "done" on it missed five paint values. The six slip rows now point at the live slip, not an unrendered copy. |
| social-profile-discover | 2 | Follow sheets show real follower totals from `user_follows`, which the old note said had no source; the old test had passed "87 followers" in as the BIO. |
| streaming | 1 | +1 sibling corrected. Its earlier `done` was wrong on four counts, including a field drawn 62 against the board's 54. |
| defi-earn | 1 | Dispatched mid-wave. Fixed a money-display bug: the Earn detail table printed **dollar-denominated holdings as token counts** ("122.5 USDC"). |
| trade-spot | 1 | **Refused a carried instruction of mine, correctly**: the quick-amount buttons are 22 only at 1440, where there is no floor; the narrow boards draw 40 and 36. |
| home-whales-screens-ai | 1 | Corrected the stale `HomeTopBar` comment; withdrew a wave-55 `done` its board contradicts. |
| governance-dao | 0 | 19 reached. The airdrop's "empty" art half was an image fill, so one Casey call is withdrawn. Surfaced the routing defect above. |
| slots-hooked-untamed | 0 | 13 reached. Hooked and Untamed phone stages were 375x667 on boards 500 tall — 167px of dead background for every phone player. Engine opt-ins lent for the wave are proven not to touch the other three games by a test eight mutations turn red. |
| trench-trade | 0 | Its ticket goal had already landed. |
| trench-discover-shell-launch | 0 | One Casey call holds six of its frames. |

Late-wave fold work by the orchestrator: an unused `type CardSlot` left by the slots lane turned the
type gate red; removed with its stranded import (`6c0f0658`), gate green again.

## Instruments, continued

- **`apply-verify.mjs --help` is not help.** It ignores the flag and runs for real; one lane rewrote
  `registry.json` that way and restored it from HEAD. Read a catalog script's source before passing it a
  flag it may not parse.
- **A peer pushed the shared tree's `main` mid-wave**, carrying most of this wave's lane commits to origin
  inside its own submodule bump before this fold ran. All fourteen gitlinks on origin were verified to
  resolve on their remotes; the type gate had already been run over those commits. The fold carries only
  what was still unpushed, and leaves three commits that belong to another session for its owner.

## Casey calls

One answer closes several frames:

- **Pulse card pencil, speech bubble and caller avatars** (trench) — keep omitted / name sources and build /
  drop from the frames. Holds six shell boards and three card masters.
- **Yield vaults' one Aggregate TVL help glyph and Farmers' unnamed 43x18 control** — build / leave undrawn /
  design removes. Holds all five yield-vault rows.
- **The 1440 Discover shelf reads "Highest market cap streams"**; the app ships "Highest market cap". Holds
  three boards.
- **The August heroes' counter wording** — keep "Users are already on this list", or the boards' "already
  winning with us". Holds three.
- **Which phone boards govern the slots at 375**: the 347-wide inset boards, or the 375 full-width ones.

Product decisions:

- **The export-key field label.** The boards print "Encryption password" over a private key. Recommend
  keeping "Private key": labelling a private key as a password invites a user to treat it like one.
- **The Earn Save/Lend button carries MetaMask's fox**, but deposits go through the SKAI wallet — fox / no
  mark (shipped) / the SKAI wallet's mark.
- **The SKAI sub-line on the whale picker** needs a price: the sale-curve price, a dash, or leave it off
  (shipped, pending the 09-20 ruling's limits on where the sale-curve price is used).
- **Sportsbook**: where the toast sits (the app-wide toaster moves every toast), the stake coin (plain disc /
  USDC art, which sUSD isn't / a commissioned sUSD coin), the 768 collapsed slip, the phone slip inset.
- **Perps**: the ticket's size-row label; whether "Delete position" joins the row's close action once the
  engine can price and settle; the PnL cell on one line or two.
- **Trade spot**: rule the 346-wide /spot 375 family out or keep it partial; Est. Liq. Price omitted or drawn
  unavailable; the 768 ticket strip at 40 or 48; the launch ticket below 1024.
- **Trench trade**: the ALT-only text-size group; which of two desktop table families governs; the settings
  sentence; a Token-info cell no other board draws.
- **Learn**: whether the 768 course-video screen or its component governs the transcript; the always-
  unavailable Skai University profile as a dashed card or one panel.
- **Streaming**: exact chat row spacing, and the browse controls no board draws.
- **Home**: the 375 turn gap; the whale chip's "Mkt. cap" label; the logo's 2px rail nudge; badge copy.
- **Onboarding**: the 375 dashboard's DailyStreakMini; the footer social icon order.

The standing list from earlier waves is unchanged except where noted in `CASEY-CALLS-open.md`: the
coinflip 1.9800 footers and the 768 game-page gutter remain the highest-leverage open calls.
