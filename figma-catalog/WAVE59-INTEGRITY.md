# Wave 59 — integrity record (2026-09-21)

**Done 1,168 of 3,825 genuine in-scope frames (30.5%); 742 visually verified (19.4%).**
Wave 58 closed at 1,145 / 723, so +23 done and +19 verified. Thirty lanes, **211 rows**, 211
distinct keys, both validators exit 0, pipeline idempotent.

- Fold: skai-ui `991a20c`
- Pointer bump: superproject `6d623e122` — skai-ui `991a20c`, skai-gaming `538e8386`, skai-wallet
  `2a7d5c6`, skai-landing `9812fa8` — with the fold-gate fix `cf2c546c0` on top, which is the tip
  pushed. Fifty lane commits cherry-picked onto `origin/main` beneath them, zero conflicts.
- Parity feed committed at skai-landing `9812fa8`, reading 1,168 / 742 / 30.5%
- **NOT DEPLOYED.** Casey's Ruling 16 of the same day: *"just continue to build and deploy later."*
  Production still serves `skai-trading@20260921-1805-6f301513e` (`dirty:true`). Every `done` in this
  record means *landed on origin*, not *visible to a user*.

★ **Why +23 from 211 rows.** The registry records **33** frames newly `done`; **10 of them are Sugar
rush sprite masters on `gem-slots` pages, which are scoped `wip`** — catalogued, not counted. 33 − 10
= 23, matching the figure exactly. The rest of the rows were honest `partial`s: this wave's lanes
overturned far more carried claims than they closed frames, and no frame lost `done` status.

---

## The defining finding: the 1px stroke question is decidable by arithmetic

Six lanes traced defects to a 1px stroke. The orchestrator broadcast a one-directional rule to all
of them — *"a stroke sits outside the Figma layout box and inside a CSS border-box, so suspect the
stroke"* — and **it is wrong for some frames**. Two lanes had reached opposite conclusions about
strokes and both were right about their own frame. The home-whales lane found the test that settles
it per frame:

> **Sum the frame's own padding and children; compare to the height Figma reports.**
> **EQUAL** → the stroke is drawn inside and uncounted → CSS pays **(padding − 1) + border**.
> **ONE MORE** → the stroke is counted separately → CSS pays **padding + border**.

| frame | sum | reported | case | CSS |
|---|---|---|---|---|
| `3294:24639` | 8+40+12+18+14 = 92 | 92 | inside | `pb-[13px]` + `border-b` (`pb-[14px]` paints 93) |
| `Header-tablet` `9069:262306` | 6+40+6 = 52 | 52 | inside | shipped `pb-[5px]` is right |
| predict family header | 6+36+12+16+12 = 82 | 83 | counted | padding + border |
| Earn position card | 16+108+16 = 140 | 140 | inside | `h-[140px] p-[15px]` (was `h-[142px] p-4`) |

★ **"Inside or outside" is an ambiguous question and asking it in the abstract produced the fork.**
The sum answers it per frame from metadata plus one `get_design_context` read.

⛔ **Decide it on an EDGE-positioned child, never a centred one** (slots-hooked-untamed). A centred
text reading `calc(50% − 1px)` lands on 658 whether the content box is 1316 or 1318, so it cannot
discriminate. That lane settled its frame on four px-positioned coordinates, all `css + 1 == figma`,
and scoped the verdict to that frame only.

★ **The evidence had been on disk for two waves, filed as noise.** `vverify.onboarding.tsv:16,42,112`
record a browser measuring Continue at `434x62` against 436 and a `73.6` OTP step against 74, logged
as "matches to 2px". The onboarding lane then re-verified five rows recorded `done` in earlier waves:
**all five were false when recorded**, every column 2px narrow, and correct now only because a later
commit fixed them. **A recorded 2px discrepancy is evidence, not tolerance.**

---

## Carried findings overturned — and five of the stale briefs were the orchestrator's

Wave 57 overturned seventeen notes; wave 58 found the wrong prose had moved into the dispatch
prompts. Wave 59 repeats it across nearly every lane. A selection:

| lane | carried | what the node or the code said |
|---|---|---|
| trade-spot | `7712-38425` is the order-book ladder | it is the **Trades tape** — Price/Size/Time, 33 rows, no spread row |
| trade-spot | `8650-46141` "ticket delta 0, measured box by box" | it never measured the strip: `Frame 299` is 730x**48** against a shipped 40 |
| wallet-shell-pages | `7704-46353` geometry | Frame 270 is **187 not 121**; three waves built on a 66px error borrowed from another board |
| predict-dashboard | the "98-vs-100" column origin is a Casey decision | it is the stroke case above; wave 58 subtracted an 82 the app does not have |
| streaming | wave 55: the 2px is "a node-split artefact", keep pitch 16 | the base board refutes it; that advice would have closed a row on a false premise |
| learn-pages | the Create-course fields are Title / Summary / Tags | **state-key names leaking into the UI**; the frame draws Add to group / Course name / Description / What you'll learn |
| social-messages | panels in `components/messages/` are blocked on a mount | inverted: the composer draws inline copies, so the EXTRACTED components are the orphans |
| games-instant | `fairnessSubBar375.test.ts` is red | green, 74 passing |

⛔ **Five briefs were materially stale because the orchestrator wrote them from memory.** slots-sugar
found its **entire** brief already done — all four build items on disk, one closed in wave 52;
play-hub was told its slide Mobile work was uncommitted when it had been pushed a day earlier;
wallet-components was sent the same false claim twice (that `AddWalletDrawer`'s suite pins padding
but not the box — it pins the box at `:375` and `:790`); home-sidebar's "layout relationship" was the
card's own margin; and trade-perp's carried `lg:leading-[18px]` defect was correct code. **Every one
of these lanes checked before building**, which is why none of them shipped a wrong fix.

★ **Several lanes overturned their OWN verdicts**, the healthiest signal in the set: sportsbook (its
wave-58 seam read "24 under the heading" and dropped the heading's own 16 — it is 8),
social-profile-discover (overturned its own build forty minutes later on a measurement),
wallet-components (retracted `768=done` because it had compared one card), home-whales and
trench-discover (each moved a `done` back to `partial`).

---

## ⛔⛔ Money: the 95% retune's DISPLAY half shipped ahead of its ENGINE, on two games

Found independently by two lanes, on different games and different rails:

| game | the client says | the rail pays |
|---|---|---|
| coinflip | `COIN_MULTIPLIER` **1.9** (= 95% RTP), set by peer `cb1a6107` | chain pays **19500/10000 = 1.95** (= 97.5%); `coinflipOdds.test.ts` RED at HEAD |
| Starbound / Untamed | HEAD **displays** 95.00% / 95.03% (`d4c8517e`) | the tune sits on an unmerged, un-height-gated branch |

A player is shown one RTP and settled at another. ★★ **A paytable retune ships ENGINE FIRST, or both
halves atomically behind one height gate — never display-first.** Client-first is right for a
layout change, where the worst case is cosmetic; it is wrong for a paytable, where the UI then
advertises odds the engine does not honour, which the Anjouan licence's lab certification covers.
Both lanes correctly refused to touch either side. Two of two games examined had the split.

---

## Five honesty defects that were not parity work at all

- **RLS silent-empty** (account-notifications): a signed-out read of an RLS-scoped table returns zero
  rows and no error. The referral leaderboard said "Be the first to refer friends" while prod holds
  **181 accounts with referrals, max 117**. ★ In `FaucetClaimCard` prod *corrected the lane's own
  hypothesis* — 568 claims, zero top-tier — so the count was honest and only the copy lied.
- **`=== true` on a reverted read** (trade-bridge): `bridgeState?.paused === true` answers false both
  for "not paused" and for "the contract read reverted" — the bricked bridge's normal case — so the
  review step drew Route and Est. time over a contract it had never reached. **A boolean from a
  remote read needs three states.**
- **A fabrication in a function signature** (onboarding): `useWaitlistCount(8700)` returns the default
  on all five failure paths, so skai.trade states "8,700" on the waitlist with nothing behind it, and
  eight tests pin the stand-in. A default parameter is not the shape any sweep looks for.
- **⛔ A LIVE fabricated APY** (defi-earn): `useEarnData.ts:552-571` displays `lifetime P&L × 4` as a
  pool APY, and that path is live. `:500-512` adds a hardcoded 1.5% / 0.5% "bonus" to vault APY
  (dormant). Handed off: return `null` from both. **Not fixed this wave — it is outside every lane's
  fence.**
- **Silent data loss** (social-groups-tokens): group Rules saved nothing on the edit flow because the
  patch allowlist was dated one day before the columns existed. Owners got "Settings saved" over text
  that reached no column. Fixed on both paths. The same lane measured the group token gate as
  browser-only and self-writable.

---

## Catalog integrity

- **29 vverify verdict lines are not applied** because their word is not one of
  `match | partial | deferred | not-wired` (`done` 12, `frame-defect` 8, `n/a` 5, `blocked` 2,
  `furniture` 1, `no-match` 1). ⚠ This is **not** a silent failure: `apply-verify.mjs` warns on every
  run — *"either fix the word or decide the row"* — and has done for weeks. The defect is **a warning
  nobody acts on.** Cause: two adjacent vocabularies sharing some words and not others, so a lane is
  fluent right up to the word that does nothing. Only the 12 `done` lines plausibly mean `match`, so the
  verified figure is understated by **at most ~12**, and only after re-measurement.
- **242 id-keyed rows across 78 files address nodes the registry no longer carries**, and 59 rows
  address neither a node nor a section. Owed: RETARGET via `catalog:drift`. **None are wave 59's.**
- ★ The dry run's "12,076 node ids claimed by more than one row; 3,383 disagree" is **not** a defect.
  `apply-status` sorts by the wave number before the stem, so last-writer-wins means most-recent-wave
  wins — the correct resolution for a measurement log. Read the comparator before calling a
  last-writer rule arbitrary.

---

## Orchestration

- **Casey asked for 30 lanes; the harness caps concurrent subagents at 20.** Twenty started, ten were
  refused outright, and the rest went in as slots freed, each chosen to absorb the finisher's
  hand-offs (social-feed's blocked mounts → social-messages and social-groups-tokens;
  predict-dashboard's blocker → predict-detail, whose file it was).
- **A weekly usage limit killed four lanes mid-write.** The shared catalog survived intact (209 rows,
  0 duplicates) and the submodules were clean; one source-and-test pair was left half-edited. All four
  were resumed from their own transcripts rather than re-spawned — a fresh agent is a second writer —
  and each was told to re-read its files at their CURRENT state rather than re-apply from memory.
  defi-earn finished the pair and committed it together.
- **A single uncommitted header row red-lighted both validators for all 28 lanes — the third wave
  running.** This time three lanes diagnosed it independently, each named the offending FILE before
  doubting its own rows, and each refused to edit another lane's status file. Nobody lost budget to it.
- **The orchestrator routed lanes across the fence three times** (wallet-components to
  `src/shell/`, home-whales to predict-detail's `PredictNavRow.tsx`, slots-hooked to the other slots
  lane's `src/slots/`). ★ A generator check scanning the briefs for cross-fence paths found **one**
  reference — a legitimate hand-off mention — and **missed all three**, because they were written
  submodule-relative, as bare filenames, and in an ad-hoc message. **A careless reference is the one
  written loosely, so a well-formed-path scanner finds everything except the failures it is named
  for.** The fix is the discipline: resolve every path against the fence, with its repo root, before
  naming it.
- **The selective move worked with zero conflicts, again.** Fifty superproject lane commits
  cherry-picked onto `origin/main` without one conflict, so no lane commit depended on a peer's.
  skai-wallet's seven were moved the same way, proven safe by file overlap, import overlap and
  committed-blob identity. ★ `cmp` on working-tree files first reported five of eleven files
  "different from what the lane tested"; the repo converts line endings on checkout, and the committed
  blobs were all identical. **Compare blobs, never working-tree bytes.**

---

## Gates

- ⛔⛔ **`npm run typecheck:gate` FAILED at the bump commit `6d623e122`**, with one new error:
  `DelegationManager.tsx: TS2304: Cannot find name 'Info'`. governance-dao's `b752bbd5d` had removed
  one of two `<Info>` usages and dropped the shared import; the survivor is the "Currently delegating
  to…" notice under `hasOnChainDelegation`, so **every user with an active on-chain delegation would
  have hit a `ReferenceError`**. The lane had reported 43/43 green, truthfully — vitest strips types
  without checking them, and no oracle rendered that branch. Confirmed as the lane's own commit
  rather than a cherry-pick combination before touching it (identical break in the shared tree, no
  peer change on origin), then **fixed, not re-baselined** — a one-token import restore, `cf2c546c0`.
  Re-gated at the new tip: **`✓ no new type errors … 89 fewer than baseline`.**
  ★ Thirty lanes reported green; the single error in 211 rows' work was invisible to every one of
  their checks and obvious to one `tsc` over the combined program. **The fold gate is the only
  instrument that reads the whole tree.** Wave 60's lane rules should require the type gate, not
  only tests.
- `npm run build` at `cf2c546c0`: **Build successful**, CSS stage clean, critical CSS extracted,
  `index.html` 18.4 KB.
- ⚠ **`origin/main` moved by one commit during the gates** (`cd3e4f303`, a peer's docs pointer bump),
  so the fold was rebased onto it — which changes the commit, and the rule is to gate the commit you
  push. Rather than re-run fifteen minutes of gates or wave it away, the rebased tree was PROVEN to
  differ from the gated-and-built tree in exactly one path, the `docs` gitlink, after confirming no
  tsconfig mentions `docs`, `vite.config` does not reference it, and no app source imports from it.
  So the code tree pushed is byte-identical to the one gated and built. ⇒ **When the base moves under
  a gated commit, diff the two TREES; if only paths outside the program differ, the gate transfers.
  If anything inside the program differs, re-gate.**
- Pushed `cd3e4f303..e86e7e8fa` with origin unmoved, zero `supabase/migrations/`, and **all 14
  submodule pointers resolving on their own remotes**, all re-checked in the same command as the push.
- `@skai/ui` `dist` rebuilt with `tsup --no-clean` and **verified to carry the waitlist fix** by its
  exact class fingerprint, `shadow-[inset_0_0_0_1px_#123f3c,…]`: 3 occurrences before, 4 after. The
  app consumes skai-ui through `dist`, so an unrebuilt bundle would have tested the old code and read
  green.
- `npm run test:ci` is not a gate.

---

## Casey's rulings this wave

- **16 — "just continue to build and deploy later."** Honoured by every lane and at the fold: nothing
  deployed.
- **17 — Baccarat History becomes a DRAWER.** ✅ Built (`9892b309`). The lane re-read Frame 658 at the
  node — 1318x621, exactly two children, no History rail in any Baccarat frame — re-derived the 656,
  and the popup now draws the board's 954/952 exactly.
- **18 — buy the Holders data source.** Scoped with live prices: the buy is **one indexed DEX-trade
  API covering three columns**, not seven (SOL balance is free, Balance and % Supply already come from
  Alchemy, Held and Funding are derivable). Bitquery Pro $79/mo recommended, Birdeye Starter $99/mo as
  fallback; confirm Alchemy's current tier first. The columns stay `partial` citing the missing source.
- **19 — darts Medium/Easy: orchestrator solves, Casey approves.** ⚠ The premise the orchestrator gave
  was wrong: all three difficulty weight vectors already exist at 95.35 / 95.00 / 95.30% on four
  agreeing copies, including the chain. What Ruling 15 actually asks for is three *multiplier
  ladders*, which do not exist. Solved to exactly 9500 bps each; the decision it forces is Casey's —
  the board's Hard ladder mathematically requires ~82% Miss against today's 57%.
- **13 (wave 57)** — ✅ now also live on portfolio (`efdc14faa`).

---

## Owed at the close

1. ⛔ **The live fabricated pool APY** at `useEarnData.ts:552-571` — `lifetime P&L × 4`. Return `null`.
2. ⛔ **The coinflip client/chain split** and the Starbound/Untamed display-ahead-of-engine split.
   Re-check the rest of Ruling 10's over-paying list for the same shape.
3. **Casey's 2026-09-19 AI-wizard ruling is still not implemented** — the test pinning the full-bleed
   dialog stands. It has slipped more than once; give it a lane, not a line in a brief.
4. **Re-measure the 12 vverify lines that say `done`** and rule on the other 17; or make
   `catalog:check` fail on unknown verdicts so the warning cannot be scrolled past.
5. **RETARGET the 242 stale-id rows** via `catalog:drift`.
6. **Write every path in a brief repo-qualified and resolved against the fence** before dispatch.
7. **Sync the shared trees carefully.** The superproject's and skai-wallet's local mains have
   diverged from origin (same lane changes, different shas) and carry other sessions' unpushed work.
   Do not reset either until `git cherry` shows no `+`.

### Frames and boards worth Casey's eye

- `10594-57490` (375 limit ticket) draws Total and To win both reading $20.00, and limit orders
  cannot exist there at all because both venues are AMMs.
- The group token gate is enforced nowhere server-side: add a check, or stop calling it a requirement.
- The diamond and the Sugar rush candy bomb have no paytable — build one, or rule them art-only.
- `13008-28652` (coral streak) has no lane and no rule for when a streak turns coral.

---

**Status at the close: landed and pushed on origin at superproject `e86e7e8fa`; type gate green
(89 below baseline, after fixing the one real error it found) and build successful; NOT deployed.**
Production still serves `skai-trading@20260921-1805-6f301513e`. This record is skai-ui-only, so its
pointer rides with wave 60's bump rather than moving the superproject after the gate.
