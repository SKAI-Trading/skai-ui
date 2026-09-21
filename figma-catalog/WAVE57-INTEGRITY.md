# Wave 57 — integrity record (2026-09-21)

**Done 1,092 of 3,825 genuine in-scope frames (28.5%); 680 visually verified (17.8%).**
Wave 56 closed at 1,056 / 635, so +36 done and +45 verified. Twenty lanes, **195 rows**,
zero duplicate keys, both validators exit 0.

- Fold: skai-ui `62d39a2`
- Pointer bump: `8310a653f` (skai-ui `62d39a2`, skai-gaming `6189f8f2`, skai-wallet
  `d8edd391`, skai-landing `7a26231`)
- **Live: `skai-trading@20260921-1539-9d51de3f7`, `dirty:false`**
- Published: `https://skai.trade/figma-parity.json` reads 1092 / 3825 (28.5%), verified 680;
  committed to skai-landing `8f97a30`

Figma hash check at 06:0x: all 51 pages equal across the three files, 0 changed. No harvest
owed, so `V1_TODO.md`'s growth table is unmoved.

---

## The wave's defining statistic: seventeen carried notes were overturned

Lanes re-read frames first-hand and found the prose about them wrong seventeen times. **Four
were lanes correcting their own earlier verdicts.** The frames were right every time.

| what a note claimed | what the frame says |
|---|---|
| a 118x34 control is the gauges panel's **submit** (wave 50) | it is "All gauges", an outlined scope filter |
| "one flex gap cannot be both 20 and 24" (wave 42) | not one gap — rule, summary and CTA are SIBLINGS; each board closes exactly |
| "a Governance page has nothing to refresh" (wave 55) | `Governance.tsx:102` already held the query |
| the 768/375 hero boards read the shipped counter suffix (waves 52-53) | no board draws that string |
| `11154-59546` is a My bets list row | it is the system bet notification at 343 |
| `DartsGame.tsx`: "nothing binds this weights copy" | `dartsBoardGeometry.test.ts` binds it |
| `fairnessSubBar375.test.ts` is red | green, 74 passing |
| a 16px glyph's action "could not be read from metadata" | **there is no glyph** — `<g id="icons/action"></g>`, no path |
| `10706-128843` is a holders table | it is the Trench Discover grid, nine named columns |
| the perp family "draws a 40-tall strip below 1024" | HEAD draws 42 |
| `8570-143201`: "269 here against 271" | all four boards measure 708x268.9999 |
| two crash-board "departures" | both are matches (toggle hidden in frame; Bets body IS the empty state) |

★ **The most dangerous shape is a note explaining why something COULD NOT be done.** Three of
the seventeen were that, each load-bearing for multiple waves, because a reason not to act is
never re-examined — nothing fails while it stands.

★ **So record what was MEASURED and the node it came from, never a conclusion.** "Frame 636 is
34 tall on the full 708 column" survives; "the head belongs in the card" does not, because the
next reader cannot tell whether it was measured or assumed.

---

## The catalog scored 101 frames against the wrong breakpoint column

`build-registry.mjs` derived both `viewport` AND `device` from the `(w x h px)` suffix in a
frame's TITLE, and `apply-status.mjs:433` keys each frame's breakpoint verdict off that band.
So a board measured and closed at 768 had its verdict read out of the **desktop** column — one
nothing could ever have filled.

**Three lanes found this independently, from three directions**, before it was fixed: a full
sweep of the live harvest (33 frames by measurement), a wallet lane finding two 768-titled
boards that are 375s, and a trade lane finding the 8626 pair are 375x812 phone boards under a
1440 title.

Fixed: the band now comes from the MEASURED node. Diffed field by field against the pre-fold
registry:

```
2,178 frames GAINED a band   — no parseable title viewport, so they defaulted to
                               bpStatus "unknown". They have a real measured width now,
                               which is exactly what apply-status.mjs:431-432 said they lacked.
  101 frames CHANGED band    — desktop->tablet 58, tablet->mobile 23, desktop->mobile 20.
    0 frames LOST a band.
```

`done` and `verified` are unchanged by this: the band decides which column answers, not whether
a frame counts. The title is kept as the declared `viewport` so the two can be compared rather
than one silently replacing the other; a hand-classified `COMPONENT_ALIASES` device still wins,
because those are rulings rather than guesses; and **the 101 contradictions now print on every
build** — a finding with no standing report becomes a stale note, which is this catalog's most
common defect.

⛔ **The patch applied cleanly and did nothing, twice over.** First its multi-line anchors were
written with `\n` against a **CRLF** file, so they matched nothing while the single-line anchor
matched fine — the natural outcome is a HALF-APPLIED patch. That was caught by rehearsing
against a copy, and no damage occurred because `rep()` asserts every anchor before anything is
written. Then, with the anchors fixed, the override still never executed: the live harvest
writes node ids **colon**-separated (`10385:7`) while `nodes.txt` and the registry use the
**dash** form (`10385-7`), so the join matched nothing, silently, for every frame. ★ **A
rehearsal that proves a patch APPLIES proves nothing about whether it WORKS** — assert the new
field exists on a non-zero number of records.

---

## The rate limit killed thirteen lanes mid-sentence

At ~06:2x the account session limit terminated thirteen of twenty lanes. **All 137 rows already
appended survived; everything still in an agent's head was lost.** Every lane was re-dispatched
as a resume after the reset and finished in 8-21 minutes, because briefs, fences and partial
rows were all on disk.

★ **Incremental commit is not only a collision discipline — it is what makes an interrupted run
partially valuable instead of worthless.**

⛔ Three lanes had committed CODE with no status file, so that work landed as dirty files nobody
could attribute, and one (`Messages.tsx`, failing a contract test on an unprefixed `w-[454px]`)
was tripped over by a sibling lane. **The record and the change are one unit of work and belong
in the same commit**; told to do both, an agent under pressure does the interesting one.

⛔ **And I applied that lesson only to the survivors.** The "append as you close" instruction
went into the thirteen resume prompts and none of the seven lanes that never died. Eight hours
later one of those was still running with **no status file and no commits**. `ListAgents` said
`running` the whole time, which was true and useless. ★ **Check ARTEFACTS, not liveness** — and
watch the file's MTIME, not its row count, because the count is cumulative and cannot
distinguish "recording" from "holding it all in context". One message converted eight hours of
invisible work into durable rows.

---

## Money and evidence: seven refusals

Lanes declined to build seven things rather than invent them, which is the behaviour the
no-mock policy is actually asking for.

- **The sportsbook cash-out affordance.** `MyBetsPanel` stays unmounted because the live MyBets
  carries a cash-out control on an active bet and the panel has none. Mounting it to match the
  board would REMOVE a money affordance to match a frame that never drew one. ★ A frame governs
  layout, never the removal of a control that moves money.
- **Darts' three paytables.** Hard's legend prints 0.1x/0.5x/4.8x/9.6x/42x/500x against
  Medium's 63x top and Easy's 8.5x, with ring geometry following each legend; the shipped rail
  uses one multiplier set and varies difficulty by probability weight (95.35/95.00/95.30%).
- **The governance donut** (`11705:320243`): every figure is a USD valuation of a SKAI holding
  and no SKAI price is ruled for one.
- **A streaming control at x=608** that renders with no label — building it would invent a
  function.
- **The Tickets payout CTA**, whose action is unruled, so the cell draws an em dash.
- **The Members row actions** (65/81/70 boxes), which need `get_design_context` for their labels.
- **`Frame 619`'s streams shelf**, a cross-page import of a peer's 2,700-line module — a
  data-coupling decision, not a parity fix.

★★ **And the label can be the fabrication, not the figure.** Two lanes found this
independently: `deriveMarketCap` (on-chain supply x price) printed under "**Circulating** market
cap", and a shelf heading naming "**streams**" beside a viewer count correctly drawing a dash.
In both cases the computation was honest and the word above it claimed more — **invisible to
every check that reads the code, because the code is correct**. The first was fixed to "On-chain
market cap"; the second is Casey's, because building the frame exactly would introduce the
fabrication.

---

## Two things that were built and reached nobody

- `PostTokenChartCard` had been verdict-**`match` since wave 34** — complete, correct, and
  rendered on no screen. ⛔ **A `match` verdict says the component agrees with the frame. It
  says nothing about whether anything mounts it.**
- Darts' cover art was missed for **twenty waves** because its node had moved off the deleted
  `9479:19858`. The row was not wrong; it was aimed at a node that no longer existed, and read
  as "checked, nothing there" every single time.

The answer to both is in this wave too: the overview-tab mount (`e7f8bf729`) is proved by a
**source-grep test asserting the CALL SITE**, which a component test cannot do.

---

## Gates

- `npm run build` at the deployed commit: **exit 0**.
- `npm run typecheck:gate`, read by its printed line: **✖ 1 NEW error**, and it is not this
  wave's — `src/components/trench-redesign/trade/devTokensStatisticsRail.test.tsx:82` renders
  `<DevTokensPanel token={SOL} status="ready" />` while the component declares only `token`,
  from peer commit `74498f064` in a directory that is line 5 of this wave's fence. The owner was
  told twice, with the exact line. ⛔ **`typecheck:gate:update` was deliberately NOT run** —
  that would absorb a peer's error into the baseline, and Casey ruled at the wave 56 close that
  errors are fixed first so the baseline never moves to swallow them. The gate stays red and
  stays theirs.
  - ✅ **RESOLVED the same afternoon, and resolved the right way.** `5e0ae2120` "drop a status
    prop the dev tokens panel never took" — the stale-prop case, not the lost-intent case, and the
    commit says which. Re-run on current main `dc2ddf954`: **`✓ no new type errors. 2511 known
    baseline error(s)`**. ★ The baseline is still **2511**: the error was FIXED, not absorbed.
    Had `typecheck:gate:update` been run at deploy time it would have gone green an hour earlier
    and permanently hidden one real error inside the number. The red gate cost an hour; the
    re-baseline would have cost the gate.
- Catalog self-tests 17/17 and 3/3; `bp-report.mjs` and `row-tree-check.mjs` exit 0;
  20 lane files, 195 rows, 195 distinct keys.

⛔ **The first deploy attempt FAILED and the failure was worth its cost.** Rebasing onto current
origin/main pulled in `fb6e59e14`, which made main unbuildable for every session: a template
literal in a TEST file — ``lg:pb-[calc(theme(spacing.${spacing})_+_env(...))]`` — is harvested
verbatim by Tailwind's content scanner, which globs `./src/**/*.{ts,tsx}` including `__tests__`.
The test never runs; being scanned is enough. postcss blames `src/index.css:1:1`, which contains
nothing of the sort. Isolated by bisection (build exit 0 at `9d51de3f7`, failure at the same
tree rebased), reported, and fixed by its owner at `b6858212a` by excluding tests from the
content globs. Recorded as `recurring-issues.md` §358.

★ The deploy that failed reported **"exit code 0"** as a background task while its own line read
`deploy exit: 1` — the wrapper's status, not the command's. Production still served wave 56
while the notification said success.

---

## Owed at the close

- **Casey rulings, ~20 collected** across money affordances, unruled controls and board-versus-
  data conflicts. The load-bearing ones: the sportsbook cash-out; darts' three paytables; the
  governance donut and the three governance calls open since wave 53; the /discover "streams"
  heading; the Baccarat 1440 board being 656 not 952; /spot at 375 (ruled 977x family vs the
  8626 346-column); hidden-balance masking scope; keno's nine pre-draw placeholder numbers.
- **A peer's trench type error** (above) and **the `home-redesign` gate exclusion**: Casey ruled
  the 18 errors get fixed FIRST, then `config/typescript/tsconfig.tsgo.json:25-30` comes out so
  the baseline never moves to absorb them. Delete `config/typescript/tsconfig.homeprobe.json`
  when that lands.
- **Tooling**: `apply-status` should REJECT an out-of-vocabulary status the way `apply-verify`
  now warns; a lane's permitted `vverify.*` files should be DERIVED from its frames' sections;
  and `slots:vectors:check` belongs in the deploy path — it was red for eleven days on a CRLF
  difference that means nothing, and a tripwire that cries wolf that long has stopped being one.
- **Not this fleet's, carried upward**: both perp markets stale since 05:29:52Z
  (`skai_getMarketStats("BTC-USD")` reads 81,532 against a real 86,617); and a peer's own
  partition claims `src/pages/defi/` under two of its lanes, disclosed rather than hidden.
