# Sportsbook (`/sports`) — frame facts, 2026-08-26

Written while working the 33 `needs_info` reports filed against `/sports`
(excluding the three against `/predict/sports`, which are a different lane).

Every statement below was read out of `get_screenshot` / the catalog's own
`bug-node-index.tsv` against file `3sSzw1KewMtUbeLAv7uW0r`, out of the reports'
attached screenshots, or out of a live `eth_call` against
`https://rpc.skai.trade` — not out of a title, a note, or the code.

## Provenance — this doc is PUSHED, and which copy you get depends on the pointer

Recorded 2026-08-31 because the Figma MCP is down and, while it is, this file is
the only route to the `/sports` spec. Nineteen `bug_reports` rows point readers
here by path (`resolution_notes ilike '%SPORTSBOOK_FRAME_FACTS%'`, measured against
prod PostgREST), several of them phrased "the **local** frame facts at …", which is
easy to read as "only in someone's working tree". It is not. MEASURED with git,
not assumed:

**The durable claim, which does not go stale:**
`git cat-file -e origin/main:figma-catalog/SPORTSBOOK_FRAME_FACTS_2026-08-26.md`
→ **rc 0**. The file is on `skai-ui` `origin/main`, and `git diff --quiet
origin/main -- <this file>` → **rc 0**, so the working-tree copy you are reading
is byte-identical to the pushed one. Re-run both before quoting this block; they
are two commands and they answer the only question that matters.

⚠️ **Everything below is a SNAPSHOT, and it has already rotted once.** The
commit and blob ids in the original version of this block (`ede0729` as
last-touching, `77891b5` as the `origin/main` blob, main `ea9ae07` pinning
`db88827`) were all correct when written on 2026-08-31 and were all FALSE
twenty-four hours later, because the catalog is committed to many times a night.
Do not read a SHA here as current. **Re-measured 2026-09-01:**

| fact | value | how to re-measure |
|---|---|---|
| `skai-ui` `origin/main` tip | `c783089` | `git rev-parse --short origin/main` |
| last commit touching this file | `44e9200` | `git log -1 --format=%h origin/main -- <this file>` |
| its blob on `origin/main` | `ddd3cd5` | `git rev-parse origin/main:<this file>` |
| main repo `origin/main` | `1149be5eb`, pinning `skai-ui` `c7830899` | `git ls-tree origin/main modules/skai-ui` |
| `ede0729` (the section-6 correction) reachable from the pushed pointer | **rc 0** | `git merge-base --is-ancestor ede0729 origin/main` |

So a fresh clone of the main repo at its pushed pointer still gets the corrected
section 6 — that conclusion survived re-measurement even though every id backing
it changed.

★ **One trap, and it is the reason this block exists.** The pair sometimes quoted
for "the frame-facts spec is pushed" — `skai-ui 3d5193a` / main `1cc85c695` — is a
DIFFERENT and OLDER copy. `3d5193a` is the *messages* frame-facts commit; it does
carry this file (`git cat-file -e 3d5193a:<path>` rc 0) and it IS on `origin/main`
(`git branch -r --contains 3d5193a` lists it), but its blob is `91030fd` against
`ddd3cd5` on the tip, and `git merge-base --is-ancestor ede0729 3d5193a` → **rc 1**.
Checking out that pointer gets you the PRE-correction section 6. Three claims get
conflated here and only the first two are true: "the doc is on origin/main", "the
commit I quoted is on origin/main", and "the doc AT the SHA I quoted is current".
`git branch -r --contains <sha>` answers the second and is routinely mistaken for
the third — it says the COMMIT is reachable, never that the FILE in it is the
newest version. DEPTH: git object graph only — no statement below this block was
re-verified against Figma this pass, and the Figma MCP is still down.

**Both display names are one file.** Reports from 2026-08-06 link
"Skai-Web-App"; those from 2026-08-21/22 link "Skai-Web-App-1". Both carry
fileKey `3sSzw1KewMtUbeLAv7uW0r`. There is no second file and no 404 in this
batch — every node id resolved.

---

## 1. The 33 reports are 6 components, not 33

Grouped by the node each report actually links, with the catalog's frame title:

| Group | Reports | Nodes → title |
|---|---|---|
| **Bet slip** | `c38703ec` `06538dfa` `087be070` `93edefc3` `15626be1` `81a629a3` `19e156a2` `5e9524ea` | `4865-79010` with values · `4891-82254` normal · `4891-82125` combined-elongated · `4892-82479` combined win · `4892-82838` combined loss · `4896-83198` **system**-elongated · `9191-105864` + `4914-99876` right sidepanel |
| **Game view** | `3bcafe72` `d850876a` `a92e0eb4` `24a8d0e8` `22b26382` `9b61894f` `52cae3ac` `88d026ed` | `9215-17213` not started · `9227-16083` not started 2 · `9227-73669` + `9227-73828` not started 3 – tilt · `9227-74080` not started 3 – outcome · `9227-73346` + `9227-73494` + `9227-73572` in play |
| **Bet notification** | `2c0f9e39` `d65bdcf9` `712ca85a` | `9185-15873` card – state 1 · `9185-15853` card – state 2 · `4911-89112` content |
| **Page level** | `9c6b8f80` `774ce557` `b22b9ecf` `aa134717` `41137f2e` `f7567044` | `9170-113296` card with tool tip · `9170-114084` Soccer > AVL CHE · `4911-92925` Starting soon · `4913-97944` Side panel – Lawn tennis · `4799-60925` Sportsbook 1VH · `9215-15732` Player props |
| **Bookie tabs** | `1b458562` `f4180e76` `55786fab` `9d11c0ca` `99a6423f` | `4792-31204` main (×2) · `4798-57447` main · `4792-35540` main · (no link) |
| **Left nav** | `34bf6404` `d64bd02a` | `4799-61761` CTA/button · `9146-94962` Frame 220 |

★ **Three reports are exact duplicates of a sibling's node.** `d850876a` and
`3bcafe72` both link a frame titled "Game view – not started 3 – tilt";
`22b26382`, `9b61894f` and `24a8d0e8` all link "Game view – in play";
`9d11c0ca` and `1b458562` link the same `4792-31204`. Anyone estimating this
backlog by report count will over-count by roughly 4×.

---

## 2. ★★★ Two frames prove the design already forbids fabricated numbers

This is the single most useful thing in this document, because it means the
no-mock-data rule and Figma parity are the SAME instruction here, not competing
ones.

### `4891-82254` "Bet slip – normal" renders `--`, not `0`

The frame is a one-leg slip with **no stake entered**. Every money figure on it
is drawn as a literal `--`:

- the leg's own "Estimated payout" strip → `--`
- "Total bet" → `--`
- summary "Estimated payout" → `--`

and the currency ticker is dropped with the number: `-- USDC` appears nowhere.
The moment a stake exists (`4891-82125`, two legs at 10) the same rows read
`15 USDC`.

The code rendered `0` in all three places. `0 USDC` claims the bet is projected
to return nothing; `--` says there is nothing to project because no input was
given. Fixed 2026-08-26 — `estimatedPayout` and `totalStake` are now
`number | null`, and `Amount` renders the dash for null.

### `4891-82125` draws one payout strip **per leg**

Two 10-stake legs at decimal 1.5 read `15 USDC` **twice** — a strip fused
beneath each leg card. The panel drew a single strip after the whole list, so a
two-leg slip showed one figure where the frame shows two. Fixed the same day.

---

## 3. ⚠️ UNRESOLVED: `4891-82125` totals contradict a parlay

Measured off the frame, not derived:

- two legs, decimal odds **1.5** each, stake **10 USDC** each
- "Total odds" **2.25** (= 1.5 × 1.5, the product)
- "Total bet" **20 USDC**
- "Estimated payout" **30 USDC**

30 is `10×1.5 + 10×1.5` — the **sum of per-leg returns**, i.e. the *Single*
calculation shown on the *Combined* tab. A real parlay pays stake × product =
`20 × 2.25 = 45`.

`betSlipView.ts` computes 45, and its header comment asserts "The ACTIVE
combined frame, by contrast, is a real parlay: stake × product." **That comment
is contradicted by this frame.** The same file already documents the settled
combined frames having the identical sum-not-product inconsistency and chose to
reproduce it there.

**Left unchanged and escalated.** This is a displayed payout figure on a money
path with contradictory evidence, and this repo's history has several
"paytable overpaid" P0s that began as a confident reading of an ambiguous
frame. Casey's call: reproduce the frame (30) or keep the parlay maths (45).

---

## 4. `4896-83198` "Bet slip – system – elongated" is the only slip frame NOT built

The `system` tab exists in `BetSlipTab` and is rendered **disabled**, with a
title attribute saying so. `estimatedPayout` treats `system` as `combined`.

Deliberately left disabled. A system bet is a combinatorial wager (all 2-folds
of N, etc.), so shipping the tab without its combination arithmetic would show
wrong payouts — the failure mode section 3 is trying to avoid. It needs a
specified combination set before it is worth building.

---

## 5. Frame titles that contradict their report's prose

Two cases in this batch, both the recorded "registry notes lie" trap.

### `9170-113296` is a parlay card, not a page

Report `9c6b8f80` is titled "Rebuild Sportsbook Section UI: Missing and
Inaccurate Components" and its body asks to "redo this component layout from
scratch". The **linked node** is a single card: "2 Legs", a `CONSERVATIVE`
badge, two legs (Sean O'Malley vs Aiemann Zahabi 1.12, CLE Cavaliers vs TOR
Raptors 2.46), "Win probability 62.5%", "Combined odds 3.58", "$10 payout
$35.80", an "Add to bet slip" button, and a "Today, 21:44" footer with
share/favourite icons.

`src/pages/sports/components/PopularParlays.tsx` already implements exactly
this: Conservative/Balanced/Long Shot labels, `combinedOdds`, `payoutOn10`,
`winProb`, per-leg rows. The reporter's own screenshot (`41137f2e-a`) shows the
section rendering **"No parlay suggestions yet — they appear once at least 2
events with moneylines are available."** — which is the honest empty state of a
built section during the feed outage, not a missing section.

### `4799-61761` is a 36×36 "%" glyph

Report `34bf6404` reads "Live RTP section is missing from the left panel under
Sports book". The node is the icon alone. The row it belongs to was **retired
by a later ruling** — see section 7.

---

## 6. The Game view is ONE component behind 8 reports, and it is 100% feed-fed

`9215-17213`, `9227-16083`, `9227-73669`, `9227-73828`, `9227-74080`,
`9227-73346`, `9227-73494`, `9227-73572` are all states of a single panel
titled **"Game view"** with a pin icon top-right and a four-tab strip along the
bottom: **Gameplay | Tilt | Events | Outcome** (active tab = sky blue
`#56C7F3`).

Header, by state:

- **not started** — two team kits + abbreviations stacked left (`AVL` / `CHE`),
  and right-aligned "Starts in **1 Day**" or a live countdown "Starts in
  **21:06:24**".
- **in play** — a match clock (`45' + 3`) top-left, period columns `1 2 R`
  top-right, and a score per team (`0 - 0`).

Body, by tab:

- **Gameplay** — a green pitch with markings, overlaid by a centre card. Pre-game
  that card is the matchup (kits, `vs`, competition name e.g. "FA Cup", and a
  W/L form badge per team). In play it is the latest event, e.g. a yellow-card
  chip reading "Yellow card / Cole Palmer 48'".
- **Outcome** — "Last 5 matches — England", a head-to-head list of dated rows
  (`21 July, 2026: World Cup`) with a coloured scoreline chip (green `1 - 0`,
  amber `1 - 1`).
- **Tilt**, **Events** — not captured; no report links a frame showing them
  open, so their content is **unknown**, not empty. Search before asserting.

**NOT BUILT, and deliberately not built in this pass.** Every tab's body is live
match data — player positions, momentum, an event timeline, head-to-head
history. The odds vendor key is revoked, so there are no fixtures; `GameDetail`
needs an event to mount and therefore cannot be reached at all right now. The
existing `LiveGameTracker.tsx` (526 lines, lazily mounted at
`GameDetail.tsx:715`) is an **ESPN-style scoreboard**, a different design — it
is not a partial implementation of this panel.

Building it now would mean shipping four tabs whose entire content is an offline
indicator, on a route no user can currently open, with no way to verify it
against the real data shape. That is a judgement, not a rule — Casey can
override it.

---

## 7. Two reports ask to restore what a LATER ruling deleted

Both are ruling-vs-ruling and need Casey, not code.

- **`34bf6404` / `9d11c0ca` — Live RTP.** The "Live RTP" nav row was removed by
  the **2026-08-12 ruling on report `e216c5ef`** ("Remove these sections and the
  RTP should just be in rewards page"). `LiveRtpPanel` was not deleted — it is
  lazy-imported and rendered inside `/rewards` behind `showLiveRtp`
  (`src/pages/rewards/Rewards.tsx:60-66`), and
  `HomeSidebarExpanded.surfaces.test.tsx:460` pins the row's **absence** as
  intentional. `9d11c0ca`'s screenshot also carries a content note — *"Although
  the house always wins, RTP shows games that are yielding the highest amount of
  payouts to users in the platform, so they can play that instead to
  hypothetically win more"* — which is a copy change to `LiveRtpPanel`,
  independent of where the panel lives.

- **`d64bd02a` — sportsbook submenu.** Figma lists 16 sports; the app ships 7.
  `sidebarSurfaces.ts:182-194` records this as **deliberate**: the `Sport` union
  supports nfl/nba/mlb/nhl/soccer/mma/tennis, so the other 9 rows would navigate
  to `?sport=` values `Sports.tsx` rejects and silently fall back to "all" —
  nine dead controls dressed as navigation. Same principle Casey's own ruling
  applies to fabricated odds.

⛔ Both live in `src/components/home-redesign/**`, which a peer session held
mid-refactor for the whole of this wave. Not editable here regardless of the
ruling.

---

## 8. Live chain facts behind the deposit report (`d5ef00b8`)

All by `eth_call` to `https://rpc.skai.trade`, 2026-08-26.
`SKAIHousePool` = `0x4219b26DbDca826e15CEa752201A87eeA305eD43`,
sUSD = `0x5B41000000000000000000000000000000000002`.

| Read | Value | Meaning |
|---|---|---|
| `paused()` | `false` | Not the blocker |
| `minLpDeposit()` | `50000000` | $50.00 at 6dp — matches the UI |
| `withdrawalDelay()` | `86400` | 24h — matches the UI |
| `totalShares()` | `5e29` | Pool has been seeded |
| sUSD `balanceOf(pool)` | `500000000000` | $500,000 |
| `keepers(0x1c80eF25…4470)` | **`true`** | ★ relay IS authorised |
| sUSD `decimals()` / `name()` | `6` / `"USD Coin"` | |
| sUSD `DOMAIN_SEPARATOR()` | `0x3530f4ab…cf5405` | see below |

★ **`keepers()` is TRUE, so the `NotKeeper()` hypothesis is falsified.**
`BookieDashboard.tsx` leads its opaque-revert copy with that cause, gated on
`depositRelayerAuthorized !== true` — so with the preflight landing it correctly
drops the cause. The comment block still presents it as the prime suspect and is
now out of date.

★ **The permit domain does not match the chain.** `SUSD_PERMIT_DOMAIN`
(`src/lib/relay/types.ts:90`: name `"USD"`, version `"1"`, chainId `7254`,
verifyingContract `0x5b41…0002`) computes to
`0x146c56d8104f2cc9482de72286d9c91d562815f03ce89e3fe1f4bc254189b29f`. The token
reports `0x3530f4ab…cf5405`. `relay-deposit` runs `permit()` before
`depositFor`, and `depositFor` then does `safeTransferFrom(beneficiary, …)`
against the allowance permit was meant to create — so a domain the token does
not recognise means no allowance is ever set.

**The correct domain is NOT known.** 312 name/version/chainId combinations were
tried and none reproduced the on-chain value; the token's own EIP-5267
`eip712Domain()` returns fields=`0x0f` with an **empty name and empty version**,
which does not reproduce it either. So the check added to `fetchBookiePoolConfig`
is **reporting-only and never blocks** — a false negative would strand users who
can currently deposit.

**Could not confirm the revert.** This chain's RPC strips revert data:
`eth_call` on `depositFor` from the keeper answers a bare
`"execution reverted: execution reverted"`, with no error selector. That is also
why `relay-deposit` can only return "Deposit relay failed".

Minor: `HOUSE_POOL_ABI` in `BookieDashboard.tsx:60` declares
`totalAssets()`, which `SKAIHousePool.sol` does not implement (its real reader is
`totalPoolBalance()`); the call reverts on chain. It is currently **unused**, so
this is a dead-but-wrong ABI entry rather than a live bug.

---

## 9. The header lie the reporters photographed

`41137f2e-a` and `1b458562-a` (the reporters' own attachments) both show the
chip **"⏱ Data may be outdated"** rendering at the same time as the banner
**"Live odds are offline — the odds provider is rejecting our data feed"**, and
both notices sitting above the **House Pool** tab, which reads no odds at all.

Already fixed before this pass by `src/pages/sports/lib/feedNotice.ts`
(`resolveFeedNotice`) and `lib/eventsPlaceholder.ts`. Recorded here because a
large share of the "sections are missing / completely different" reports in this
backlog are screenshots of that contradiction over an empty page, not of a
layout defect.

---

## 10. The place-bet gate read an UNREADABLE balance as a sufficient one

Not a frame fact. Recorded here because it was found while mounting the frames
in section 4, it sits on the money path, and the next person in these files
should know both halves — the half that is fixed and the half that is not.

### Fixed — `BetSlipPanel.tsx`, commit `1ec0122ae`

The gate was `availableBalance < totalWager`. `useSportsBalance` supplies that
as a bare `number` computed `Math.max(0, balance - pendingAmount)`, with **no
case for "we could not read it"**. When the expression is `NaN`:

```
NaN < 20   →   false        // "the balance is sufficient"
```

so a balance nobody had read passed the check. The same `insufficientBalance`
flag also guards the button's `onClick`, so the disable and the last-chance
check failed open **together** — there was no second line of defence.

This is the `null < total` hazard from CLAUDE.md wearing a different hat: an
unknown silently coerced into a pass. It is also not hypothetical — two wager
helpers in the *same file* already wrote
`Number.isFinite(availableBalance) ? availableBalance : 0`. The money gate was
the one place that did not.

The unknown is now its own state, so it blocks **and names itself**
("Balance Unavailable") rather than failing silently, and the two display sites
stop rendering the string `"NaN"`: the header chip shows the unknown glyph `—`
(deliberately not `$0.00`, and a different glyph from the loading `…`), and the
warning says the read failed instead of "you have $NaN". A readable `0` is
untouched — zero is a known balance and still compares normally.

Cover: `BetSlipPanel.balanceGate.test.tsx`. The funded case is an independent
oracle, so the suite cannot pass by disabling the button unconditionally;
verified by mutation (removing the guard fails 2 of 5).

⚠ Instrument trap hit while writing that test: the panel renders six
quick-wager chips labelled `"Quick wager $5"` … `"Use maximum wager"`, so
finding the Place button by `aria-label` containing `"wager $"` returns an
always-enabled chip. That selector reported `disabled === false` for cases the
panel was blocking correctly — a broken instrument reading as broken code.
Match on `"potential payout"`, which is unique to the real button.

### NOT fixed — `useSportsBalance.ts`, and why it was left alone

Two things in the hook are worth a report of their own. Both are **out of the
sports lane's file scope** (`src/hooks/sports/**` is shared by
`HeaderStatusBar`, `OrderEntryPanel` and `BookieDashboard`), so they were not
edited here.

1. **`chainAvailable` is a module-level mutable global.** `_lastReadSucceeded`
   (`:87`) is written inside `fetchChainBalance` and read at render (`:287`).
   Every `useSportsBalance()` consumer shares the one variable, so it reflects
   whichever fetch resolved last **across all of them** — one component's
   successful read can report the chain as available to a component whose own
   read just failed. A liveness signal that fails toward reassurance.

2. **A failed read returns `0n`, so an unknown balance renders as a confident
   `$0.00`.** `fetchChainBalance` catches network errors and returns zero
   (`:129-131`). For the bet gate this happens to fail *closed*
   (`0 < wager` → insufficient), but every *display* of that figure states a
   balance we do not have. That is the "omitted ≠ zero" rule inverted, and the
   fix is the `number | Offline` shape from `src/hooks/wallet/tokenPrice.ts`,
   applied at the hook rather than patched at each of the four call sites.

Note the NaN in the fixed half is currently **latent, not reachable**:
`pendingAmount` only moves via `addPending`, which has no production caller, and
`rawToNumber(bigint)` cannot produce `NaN`. It was fixed anyway because the type
permits it, four consumers read it, and the failure mode is silent.

---

## 11. Game view + bet-notification re-harvest — three CORRECTIONS to section 6

Full re-read of all 12 nodes, 2026-08-26. **Every node id resolved; nothing was
substituted.** Section 6 above is right about the grouping and wrong about three
facts. All three matter before anyone scopes this.

> ⚠ `get_metadata` with no nodeId returned **one** page (`2001:2 "Thumbnail"`)
> for this file — the known under-report. All 12 nodes resolved when queried
> directly. Do not treat that listing as the page inventory.

### CORRECTION 1 — Tilt and Events are NOT "unknown". They were captured.

Section 6 says *"Tilt, Events — not captured; no report links a frame showing
them open, so their content is unknown, not empty. Search before asserting."*
The search has now been run, and it says otherwise:

- **`9227:73669` renders TILT open.**
- **`9227:73828` renders EVENTS open.** Its frame NAME says
  `"Game view - not started 3 - tilt"`, and `73669` carries the **identical name
  string**. The name lies about the subject; trust the render.
- **`9227:74080` renders OUTCOME open.**

So all four tabs are specified. The child frame names (`Frame 357/358/360/362`)
also do **not** encode selection — their order shuffles while the highlight moves
independently, which is what made this look uncaptured.

### CORRECTION 2 — the panel is a 432px RAIL, not a screen, and there is no mobile artboard

The eight standalone frames are **432 wide because that is a column inside the
1440 desktop page**, not because they are a breakpoint. Proven, not inferred: in
the host page `9215:15732` (1440 → `main` 1382 → content 1318) the same widget
sits at **x=886, 432 wide** — and 886 + 432 = 1318 exactly.

> ⛔ **THAT SENTENCE IS FALSE, and it cost three waves. Corrected 2026-09-01.**
>
> ~~**There is no 768 and no 375 artboard for any of this.** If a mobile
> sportsbook is wanted, it is not in Figma and has to be designed.~~
>
> **Sixteen more Game view artboards exist on this same page**, and all sixteen
> resolve by id:
>
> | width | frames |
> |---|---|
> | **708** | `11116:85400` `11116:85474` `11116:85548` in play · `11116:85638` `11116:85719` pre-match · `11116:85818` Tilt · `11116:85890` Events · `11116:86035` Outcome |
> | **343** | `11148:201689` `11150:39358` `11150:39212` `11150:39427` `11150:39285` in play · `11137:186039` `11150:40456` `11150:40603` pre-match / Tilt |
>
> 708 = 768 − 2×30 and 343 = 375 − 2×16 — the tablet and mobile content
> columns. Measured shells, all three cuts:
>
> | band | 343 | 708 | 432 |
> |---|---|---|---|
> | header | 50 | 50 | 50 |
> | body pre-match | 302.799 | 377.799 | 377.812 |
> | body in play | 302.799 | 399.799 | 401.812 |
> | strip | 54 | 64 | 66 |
> | gutter | 12 | 16 | 16 |
> | column gap | 8 | 24 | 24 |
> | header radius | top 12 | top 12 | top 16 |
> | strip radius | bottom 12 | bottom 12 | bottom 24 |
> | tab cell | 78.25 × 30 | 167.5 × 32 | 98.5 × 34 |
> | tab label | Mulish 12/14 | Mulish 14/16 | Mulish 14/18 |
>
> ★ At 343 the rail is the **same height in both clocks** — the body is fixed
> and the info row grows into it. A height derived from the desktop cut is 22px
> out. The pitch wrapper is 401 at **both** 432 and 708 and only fills at 343.
> The mobile set has **no Events and no Outcome** artboard.
>
> ★ **The lesson.** This did not say "not found" — it said the artboards *do not
> exist*, and 16 frames sat at `not-started` on that sentence while
> `GameViewRail.tsx` copied it into its own docblock. **A stale absence claim
> costs exactly what a stale violation claim costs.** Two further claims in this
> section were wrong the same way: the body's `clipsContent` is TRUE on all 24
> frames (it is what crops the wrapper's 0.5px overhang, not what permits it),
> and `Pitch` is not "an empty layout box by design" on the non-Gameplay tabs —
> it holds a head-to-head list and only the WRAPPER FILL changes.

The eight are a 3x3 canvas matrix (one cell empty) at x 20368 / 20915 / 21462:

| | col 1 | col 2 | col 3 |
|---|---|---|---|
| y 15366 (h 493.81) | `9227:73669` Tilt | `9227:73828` Events | `9227:74080` Outcome |
| y 15965 (h 517.81) | `9227:73346` Yellow card | `9227:73494` Red card | `9227:73572` Goal |
| y 16588 (h 493.81) | `9215:17213` Pre-match A | `9227:16083` Pre-match B | — |

**Net distinct designs behind the eight reports: 5**, not 8 —
(1) panel shell + tab strip, (2) pre-match header + Gameplay card in two density
variants, (3) in-play header + toast in three accent variants, (4) three tab
bodies sharing one shell, (5) the 1440 page around it.

### Shell spec (pixel literals — do NOT map these onto our Tailwind scale)

- Root 432 wide. Header `Frame 299` 432x50: bg `#122524`, border-bottom 1px
  `#123F3C`, **radius top 16px / bottom 0**, padding-x 16px. Label "Game view"
  Manrope Regular 14/18, -0.56px, `#FFFFFF`. Pin button 24x24, radius 8px.
- Body 432x377.812 (pre-match) / 432x401.812 (in play): bg `#122524`, padding
  16px, gap 48px, **`overflow: clip`**, shadow `0px 10px 80px rgba(0,0,0,0.25)`.
- Tab strip `Frame 300` 432x66: bg `#122524`, border-top 1px `#123F3C`, padding
  16px, **radius bottom 24px**. Four cells **98.5x34**, gap 2px; first cell
  radius-left 8px, last radius-right 8px, middle two square. Labels
  **Gameplay . Tilt . Events . Outcome**, Mulish Regular 14/18, -0.56px.
  **Unselected** bg `#123F3C` text `#FFFFFF`; **selected** bg `#56C7F3` text
  `#001615`.
- The in-play header adds a clock and period columns `1 2 R`, and lives in the
  **same node** as the pre-match header (`Frame 1000003789`), just toggled on.
  Score reads `AVL 0 - 0 CHE`; the `-` and the `2` render at **64% opacity**.
- Event toast `Frame 1000003793` **202x80**: bg `#001615`, radius 8px,
  **border-left 2px + border-right 2px in the accent only** (top and bottom
  borderless). Yellow card `#FFFF16` (chip 26x36 r4) . Red card `#FF574A`
  (chip 26x36 r4) . Goal `#17F9B4` (ball 34x34).
- Pitch turf `#13602c` plus a texture at **28% opacity,
  `mix-blend-mode: soft-light`**, with 1.232px white markings. **Absent on the
  Tilt / Events / Outcome frames** — there `Pitch` is an empty 377x239.013
  layout box, by design, not a missing layer.

### CORRECTION 3 — the "bet notification card states" are not statuses

`9185:15873` and `9185:15853` are **not** won / lost / pending. There is no
status and there are no status colours. They are the **two content states of one
427x224 slot** that sits under the match header on the soccer page — verified by
rendering the host page, which shows two of them side by side. (870-16)/2 = 427;
the standalone 428.667 is a canvas artifact, so build to 427.

- **`9185:15873` = ODDS / 1X2 state.** Two team rows (flag 32x32, name Mulish
  14/18, price Mulish **22/26** -0.88px), then three buttons ~126.889x50 radius
  12px on `rgba(0,22,21,0.8)` + blur 10px, coloured **`AVL` `#56C7F3` / `DRAW`
  `#95A09F` / `CHE` `#FF574A`** — that is home / draw / away, *not* a result
  state. Footer: `Today, 20:30` + an `EPL` pill (border 1px `#95A09F`, radius
  9999px) + a heart icon.
- **`9185:15853` = EXPERT TIPS state.** Same shell; adds a decorative
  **`Ellipse 13` 561x561 at (96,86)** bleeding out of the clip — that glow is the
  strongest tell between the two states. Title "Expert tips" Manrope Regular
  16/22 in **`#FFFF16`**; body Mulish 14/18 white at **64% opacity**; one
  selection row 396.667x42.
- **Shared shell, build once:** 427x224, bg `#122524`, **radius 24px**, padding
  16px, backdrop-blur **2.729px**, shadow `0px 1px 4px rgba(0,0,0,0.75)`,
  `overflow: clip`.

`4911:89112` (report 712ca85a) is **a different thing again** — a **588x74
toast**, bg **`#052d2d`** (the only use of that hex anywhere in this harvest),
border 1px `#123F3C`, radius 12px, backdrop-blur 20px, icon tile 42x42 on
`#56C7F3` radius 8px. Copy: "System bet" / "Your system bet worth [coin]
`204.17 $` has been placed successfully!". Filing it with the two cards is a
mis-grouping.

### `9215:15732` (report f7567044) is the HOST PAGE, not a section

Name `"Skai > Play > Sportsbook > Soccer > AVL CHE > Player props (1440 x 900px)"`,
actual **1440x4058**. It is the only frame in this set carrying full global
chrome (Header-desktop 1440x56, the 58px sidebar, the news ticker, and a footer
reading `Home . Help . Terms . Privacy . Anti-money laundering policy . Gaming
license . Responsible gaming policy`). It contains the match header card
(870x156, radius 24px), the two 427x224 cards, the market tab strip
(`Main 18 . Bet builder 4 . Halves 2 . Stats 4 . Player props 8 <-active`),
eight odds-market cards, and the game-view rail at x886.

★ **HIDDEN IS NOT REMOVED, and there is a lot of it here.** Every panel hides a
400x64 `CTA/button`; every pre-match header hides the in-play clock row; **every
collapsed market card hides a full 838x34 three-way odds row** (`Aston Villa
(AVL) 1.77 / Draw 1.77 / Chelsea (CHE) 1.77`) plus a `74%` label and wallet
icons — that is the market's EXPANDED state, not dead layers; every card header
hides a `Total: $89.01` volume readout; and the page hides `Frame 269` (a 680x244
bet-slip / stake panel) **four times**, plus `Bottom nav` once. None of that is a
cut instruction.

`9227:74080` additionally **clips its own content**: `Frame 1000003807` is 204
tall from y97.2 inside a 239.013 `Pitch` that has `overflow: clip`, so the third
result row is cut mid-block. Build it as a **scroll**, not as a two-row list.

### Defects in the DESIGN — settle these before building to them

1. `9227:74080` Outcome row 3 reads **`AVL ... AVL`**; one side should be `ARG`.
2. `9215:15732` live rail: **`Today, 21;44`** — a semicolon where a colon belongs.
3. `9215:16010` lists **`Noni Madueke` twice** in the player-goals market.
4. `4911:89112` declares a **391px text row inside a 276px parent**.
5. `9227:73828` is **named** "tilt" but renders **Events** (see Correction 1).
6. Every event-toast subtitle carries a **trailing double space**.

### Still parked

None of this changes the vendor block. Every tab body is live match data, and
`GameDetail` needs an event to mount, so the route cannot currently be opened at
all. This section exists so that when the odds key returns the build is already
specified and nobody re-derives the grouping — it is not a signal to start.

---

## 12. Page-layout harvest — `4799-60925`, `4913-97944`, `9170-114084`, `4911-92925`, `9170-113296`

Re-read 2026-08-26. **All five node ids resolved; nothing was substituted.** These
are the frames behind the "rebuild the whole page" reports. Unlike section 11's
set, most of this is **buildable chrome** with no odds dependency — which is why
these reports sit in the BUILD NOW half of the split.

| Node | Actual layer name | Measured size | Breakpoint |
|---|---|---|---|
| `4799-60925` | `Skai > Play > Sportsbook 1VH (1440 x 900px)` | 1440 x **900** | 1440 |
| `4913-97944` | `... > Side panel - Lawn tennis (1440 x 900px)` | 1440 x **2773** | 1440 |
| `9170-114084` | `... > Soccer > AVL CHE (1440 x 900px)` | 1440 x **3707** | 1440 |
| `4911-92925` | `... > Starting soon (1440 x 900px)` | 1440 x **4390** | 1440 |
| `9170-113296` | `card with tool tip` | 428.67 x 404 | component |

★ **Every page frame is NAMED "(1440 x 900px)" and only one of them is 900 tall.**
Trust the measured height, never the name. **All five are 1440 only — there is no
768 and no 375 sportsbook frame**, so those breakpoints are UNHARVESTED, not
"not needed".

> Instrument notes, both worth reusing: `get_metadata` with no nodeId again
> reported this file as having ONE page ("2001:2 Thumbnail") — wrong, all five
> nodes resolved directly. And `get_screenshot` returned a **1x1 PNG** for five
> transparent container nodes; those were specified from metadata +
> `get_design_context` instead. **A 1x1 render is a renderer failure, not an
> empty section.**

### ⚠ `4799-60925` CROPS ITS OWN BODY — it is a hero comp, not the whole page

The frame is 900 tall but its `main` is **5491** tall; rendering it clips at
~844px. The name says "1VH" — one viewport height. Sections below y≈900 (Popular
events, Basketball, Popular games, Bets/Top 10, About/FAQ) are all present in the
node tree and specified below, but INVISIBLE in the render.

**Do not read this frame as evidence the page ends after Trending events.** That
is the same class of mistake as reading a cropped single-screen frame as a
delete instruction.

### Page geometry (1440)

`Header-desktop` 1440x56 at y0 · `sidebar` 58x844 at (0,56) · `main` (58,56)
1382 wide · content column **1318** at main-relative (32,24), i.e. a **32px
gutter each side** · bottom news ticker 1382x22 · collapsed **Bet slip** bar
300x50 at (1108,828).

Absolute Y of each section: 80 title · 148 hero · 424 filter row · 490 Trending
events · 806 Sports · 994 Popular events · 1448 Basketball (12 events) · 3502
Popular games · 3901 Bets/Top 10 · 4439 divider · 4479 About + FAQ · 5433 logo ·
5497 footer nav.

### Title, hero, filter row (pixel literals — do NOT map to our Tailwind scale)

- **Title** `Sports book` (two words, lowercase b) — Manrope **Light 300, 32px /
  36px, -1.28px**, `#FFFFFF`. Leading icon slot and trailing search slot are both
  `hidden` in this frame.
- **Hero** 1318x244, two equal 659 halves, **gap 0**, shadow
  `0 4px 12px rgba(0,0,0,0.24)`.
  - Left half: radius **24px on the LEFT corners only**, a single raster image
    fill, `backdrop-filter: blur(2.729px)`.
    ★ **The Arsenal crest, "VS", the Man City crest and both team names are
    BAKED INTO THAT PNG** — the node has zero children. The hero cannot be
    data-driven from this frame; it needs either real crest assets plus markup,
    or the exported image used as-is.
  - Right half: **flat `#052F3F`** (radius 24px on the RIGHT corners only),
    padding 32px h / 16px v, gap 16px.
    **There is NO GRADIENT anywhere in this banner** — if a brief expects one,
    the Figma does not have it.
    - Headline `Top matches, top sports!` — Manrope **Light 300, 42px / 48px,
      -1.68px**, white, width 475.
    - Subcopy `Bet now on the most coveted matches across Soccer, basketball,
      Hockey, Wrestling, and so on.` — Manrope Regular 18px / 24px, -0.72px,
      white at **64% opacity**, wraps to 2 lines.
    - CTA **153x50**, fill **`#FFFFFF`**, radius **12px**, padding 40px h / 16px
      v. Label `Bet now` Manrope Regular 14/18, -0.56px, **`#001615`**, plus a
      16x16 forward icon.
- **Filter row** 1318x34, space-between. ⚠ **NOT a row of uniform pills — only
  the ACTIVE item is a chip.** Left group 489x28, gap 24px:
  `Featured` (active: fill `#123F3C`, radius **4px**, padding 8/2, label white,
  no icon) · `My bets` · `Starting soon` · `LIVE` (pill: **1px border
  `#FF7E50`, no fill**, radius 9999px, 10x10 dot + `LIVE` in Mulish 11/14,
  -0.44px, white) · `All sports`. Inactive items are plain 24px icon + 4px gap +
  label in `#95A09F`, no fill and no border.
  **Active-state rule**, confirmed by diffing against `4911:92987` where
  "Starting soon" is active: the active item gains fill `#123F3C` + radius 4px +
  padding 8/2, its label flips `#95A09F` -> `#FFFFFF`, and when it has an icon
  the icon moves INSIDE the chip. Height stays 28px.
  Search field 200x34 at x1118: fill `#001615`, 1px `#123F3C`, radius **8px**,
  padding left 16 / right 24 / vertical 8, placeholder `Search events` in
  `#95A09F` at **74% opacity**.

### Section-header pattern (shared by every section)

1318x36, space-between. Left: title **Manrope Regular 24px / 28px, -0.96px,
white** + 8px gap + a **16x16 chevron**. Right: two carousel buttons **36x36** at
x1236, gap 10px, padding 10px, icon 16x16, **1px border `#123F3C`, radius 9999px,
NO FILL** (transparent — sampled interior is the page background). A `View all`
text node exists in that slot but is `hidden` in every section.

Deviations: **Basketball** adds a 24x24 sport icon and a `12 events` count tag.
**Bets** is 38 tall and replaces the arrows with a segmented control 390x38 —
three buttons 124.67x30, `Top bets` / `Recent` / `My bets`, active solid
**`#56C7F3`**, inactive `#122524`.

### THE EVENT CARD (Trending events) — full anatomy

Row 1318x224, four cards **428.667 wide, gap 16px** at x 0 / 444.667 / 889.333 /
**1334** — the fourth deliberately overflows the 1318 column, which is what makes
it a carousel.

| | Default | Selected |
|---|---|---|
| Fill | `#122524` | **`#052D2D`** |
| Border | none | **2px `#56C7F3`** |
| Radius | **24px** | 24px |
| Padding | **16px** | 16px |
| Shadow | `0 1px 4px rgba(0,0,0,0.75)` | same |
| Backdrop | `blur(2.729px)` | same |
| Extra | — | decorative swoosh at left **-298px**, top 103.5px, 980.9x178.9, clipped |

**There is NO hover state in any of these frames** — only default and selected.

- **Team row** 396.67x76, column gap **12px**; each row 32 tall, gap 8px: crest
  **32x32 ellipse** + name (Mulish 14/18, -0.56px, two-tone in ONE string: club
  `#FFFFFF`, parenthesised code `#95A09F`) + odds right-aligned (**Mulish 22/26,
  -0.88px, `#FFFFFF`**). ★ **The odds number is white in EVERY state — there is
  no colour coding on the number itself.**
- **3-way buttons** 396.67x**50**, gap 8px, three at **126.889x50**: fill
  **`rgba(0,22,21,0.8)`** + `backdrop-filter: blur(10px)`, **radius 12px**, no
  border, padding 24px h / 14px v. Label Manrope Regular 16/22, -0.64px.
  ★ **The LABEL COLOUR encodes the outcome and the fill never changes:**
  home/left **`#56C7F3`**, `DRAW` **`#95A09F`**, away/right **`#FF574A`**.
- **Footer** 396.67x18, space-between: kickoff `Today, 20:30` (Mulish 14/18,
  `#95A09F`) — then gap 12px — league chip (**1px `#95A09F`, no fill**, radius
  9999px, padding 8/2, Mulish 11/14, -0.44px, `#95A09F`; `UCL` / `EPL`), a 16x16
  share icon, and a 16x16 heart.

### The long-format event row (used by the detail and Starting-soon pages)

870x200, fill `#122524`, radius **24px**, padding 16px, gap 16px, backdrop blur
2.729px, **no border and no shadow**. Odds buttons: fill `rgba(0,22,21,0.8)` +
blur 10px, **radius 8px**, padding left 12 / right 8 / vertical 8, label two-tone
Mulish 12/16 (-0.48px) with the selection code coloured and the `(price)` white,
plus a right-aligned provider chip (`Bovada`, `LowVig.ag`) on `#122524`, radius
9999px.
`4911-92925` carries **three market columns** (`Spread` / `Total` / `ML`) where
`4913-97944` carries one (`Winner`); its top-left is a match clock
(`17' 2nd half`, white) rather than a chip, and it adds share + heart icons.

### `9170-113296` is a PARLAY CARD, and section 5 above is confirmed

Independently re-measured: it is a bare **428.67x404** component named
`card with tool tip`, parked on the canvas with **no page chrome at all**, and it
is the same component as the Popular-events parlay card at 428.67x362 plus a
42px footer row. Its anatomy — a `CONSERVATIVE` strategy chip
(`rgba(23,249,180,0.24)` on `#17F9B4`, radius 9999px), `2 Legs`, per-leg rows,
`Win probability` with three overlapping 16px avatars, `Combined odds`,
`$10 payout` in `#17F9B4`, and an `Add to bet slip` CTA — is what
`src/pages/sports/components/PopularParlays.tsx` already implements.
**Section 5's reading of report `9c6b8f80` stands: the linked node is a card, not
a page, and that card is built.**

### ★ VARIANT AND PLACEHOLDER TRAPS — do not implement these literally

1. **The footer link count differs by frame.** `4799-60925` has a **4-link**
   footer (`Home . Help . Terms . Privacy`); its taller siblings have the
   **7-link** version adding `Anti-money laundering policy`, `Gaming license`,
   `Responsible gaming policy`. The 4-link version is the SHORT VARIANT — the
   three missing legal links are **not deleted**. (Compare the standing
   fail-closed rule on licence marks: absent by design is not absent by
   accident.)
2. **The hidden third parlay leg** (`Sporting Lisbon vs Sporting Lagos`) sits at
   **`opacity: 0`** inside the Popular-events card. That is a variant state, not
   an instruction to cap parlays at two legs.
3. **Duplicate placeholder content**: the Sports row ends `Tennis`, `Tennis`; the
   Starting-soon sport row ends `FIFA`, `FIFA`. Neither is a spec for two
   identical categories.
4. **The sidebar is 58x844 on EVERY frame, including the 4390px-tall one.** It
   does not stretch to full page height — it is a fixed/sticky viewport-height
   element, not a sidebar that stops partway down.
5. **Two components look like one.** The main page's Sports tiles are **250x96**
   with a **64x64** icon square at radius 8px; Starting-soon's sport selector is
   **250x64** with a **32x32** icon square at radius **4px**. Same visual family,
   different components — do not reuse one for the other.
6. `9170-113296` has no chrome at all. **Its isolation does not imply removing
   surrounding UI.**

### Design defects to settle before building

- `Today, 21;44` — semicolon for a colon, in both the parlay card footer and the
  match-detail live-score strip.
- The duplicated `Tennis` / `FIFA` / `Noni Madueke` entries noted above.

### What is buildable here without the odds feed

The title, hero, filter row, section-header pattern, carousel arrows, sport
tiles, Popular games row, About/FAQ, and the footer are all chrome with no odds
dependency. The event cards, market accordions, live-score strip and Bets/Top 10
table are odds- and bet-fed and must render honest offline states, never
fabricated prices.
