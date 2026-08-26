# Sportsbook (`/sports`) — frame facts, 2026-08-26

Written while working the 33 `needs_info` reports filed against `/sports`
(excluding the three against `/predict/sports`, which are a different lane).

Every statement below was read out of `get_screenshot` / the catalog's own
`bug-node-index.tsv` against file `3sSzw1KewMtUbeLAv7uW0r`, out of the reports'
attached screenshots, or out of a live `eth_call` against
`https://rpc.skai.trade` — not out of a title, a note, or the code.

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
