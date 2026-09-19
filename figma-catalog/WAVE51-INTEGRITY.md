# Wave 51 integrity record (2026-09-19 11:2x to 12:1x Denver; UTC 2026-09-19)

Casey: "continue" after the wave 50 close. Wave 51 opened as the next thirty-lane
fleet and stood down to one solo pass within its first ten minutes: a peer session
reported that the account had hit its WEEKLY token limit an hour earlier (429, "resets
Sep 22, 2pm America/Denver") and that three of its own five lanes had died on it
mid-edit. A thirty-lane wave would have died in its reading phase exactly as the wave
50 kill did (`a-twenty-lane-fleet-dies-in-its-reading-phase-2026-09-13`), so the
briefs were not cut. What ran instead: the Figma freshness check, the one page that
had moved, and Casey's two build rulings from the wave 50 close, done by hand.

## 0. The Figma check

`harvest.mjs verify-script` hashed every page of the three files in three calls: 50
pages equal to the 2026-09-17 harvest, 1 changed (Skai-Web-App Play, 345 to 346
top-level children), 0 not in the manifest. Three chunks of the Play page were read and
reconciled with no gap, overlap or duplicate; the addition is one genuine 343x200 frame,
`Frame 633` (13549:99145), a 375-width component with no status row yet.
`snapshot-to-nodes.mjs --write` moved the denominator from 3,824 to 3,825; `pipeline.mjs`
exit 0. Folded and pushed as skai-ui 8b60001; the parity feed republished at 749 of
3,825 (19.6%, unchanged to one decimal) as skai-landing a8a83b7.

## 1. The pass

| item | rows | done | partial | commits |
|---|---:|---:|---:|---|
| Hooked rules guard (Casey ruling 1) | 3 | 0 | 3 | skai-gaming 80cb060 |
| Gas tracker fee tiles (Casey ruling 2) | 2 | 0 | 2 | ca472bbda |
| Play page re-harvest | 0 | 0 | 0 | skai-ui 8b60001 |
| **total** | **5** | **0** | **5** | |

`status.wave51.solo.tsv`, five rows, every row stamped `@2026-09-19/wave51-solo`;
`row-tree-check.mjs` exit 0 ("no row points at a file or line that is absent");
`bp-report.mjs` exit 0. No vverify line: nothing matched a whole frame.

| measure | before (wave 50 close) | after | delta |
|---|---:|---:|---:|
| in-scope genuine frames | 3,824 | 3,825 | +1 |
| `done` | 749 (19.6%) | 749 (19.6%) | 0 |
| `done` and visually verified | 327 | 327 | 0 |

## 2. What was built

**Hooked's Information and Paytable screens no longer print "RTP NaN%".** Casey's
ruling: guard it with the explicit unavailable state, never a number. The engine's two
scenes formatted every rules line straight off `definition.certified` and
`definition.scatter`; Hooked's definition carries `NaN` sentinels and an empty paytable
until its certification pipeline lands (`games/fisherman-slots/uncertified.ts`), so a
player opening Information read "NaN Scatter symbols award NaN free spins" and "RTP
NaN%". Every rules line now goes through `engine/certification.ts`: a certified game
(Starbound, Untamed) prints its config's figures exactly as before; an uncertified game
prints the grid line and one sentence saying its bonus rules, win cap and return are not
yet certified, and the paytable's corner reads "Return to player not yet certified".
The page notice and `fishermanSlotsService` already read `isCertified`; that is now an
alias of the engine's test, so nothing can disagree about what certified means.
`certification.test.ts` pins that no line printed for Hooked contains a NaN, an
Infinity or a figure, and that every line printed for the two certified games carries
the config's own numbers. 4 tests green.

**The gas tracker draws the four fee tiles the boards draw.** Casey's ruling: "Build all
features to match?", read as build the tiles to the frame. The 768 board
(11998:248840) puts four 350x126 tiles under the header, two-up on 8 gutters:
Current base fee, Standard, Fast, Super fast, each a Green Coal 200 card at radius 12
on a 16 inset with a Manrope 12/16 title, a Mulish Light 24/28 figure and a Mulish
14/16 Ash line reading "Base: n | Priority: n"; the 375 board (12000:357207) keeps
them two-up at 168x90 on a 12 inset (12/14, 20/24, 12/14). SKAI Chain has no
priority-fee market, so every tile prints the live base fee, the Standard tile prints
"Priority: 0" as the board itself does, and the Fast and Super fast tiles print
"Priority: no fee market" where the board prints 0.01 and 0.23; no premium and no
confirmation time is invented. The page's former single Current Base Fee card is
replaced by the grid. The 1440 board's tile row was not read (the wave 41 row read only
its header), so the row stays partial at 1440 and the tiles take the analytics
section's four-up 12 gutter there. `GasTrackerPage.feeTiles.test.ts` pins the order,
the shared base fee, the two priority states and the unknown glyph before the first
reading. 3 tests green.

## 2b. The fleet, phase 1 (12:49 to 13:2x Denver)

At 12:2x Casey ruled wave 51 proper a half fleet of about twelve lanes, sharing the
account budget with a peer session's five bug-report lanes. That peer could fence its
lanes only by path prefix, and its prefixes covered most of `src/` and skai-gaming, so
the fleet ran in two phases: six lanes first on files outside every peer prefix, six
more once the peer reported, gated and released the tree (14:00). Phase 1:

| lane | rows | done | partial | other | commits |
|---|---:|---:|---:|---:|---|
| skai-ui-primitives | 5 | 3 | 0 | 2 frame-defect | skai-ui 73e64b1, 4e93bb9 |
| wallet | 11 | 5 | 6 | 0 | skai-wallet baeaef8, e0514f4 |
| onboarding-landing | 20 | 0 | 20 | 0 | skai-landing c0b23b2, 89ac5a6 |
| home (AI wizard) | 11 | 0 | 8 | 2 frame-defect, 1 furniture | 77f2e03e6, 28400d2b6, 0fcdde006, 7cff35c09 |
| learn-account | 10 | 0 | 10 | 0 | be14fb7df |
| slots (engine) | 10 | 0 | 10 | 0 | skai-gaming e7b70e9c, 345dcabc, e825f39a |
| **total** | **67** | **8** | **54** | **5** | |

Folded as skai-ui edd5572: done 749 to 756 of 3,825 (19.6% to 19.8%), visually verified
327 to 334; 21 vverify lines. What the lanes found: the auth modal's "borrowed Axiom
pane" reason had been false since wave 39 (642 vectors, no image node), and the missing
wallet handshake sheet was built at 768 and 375; the wallet's wave-41 "field 52 against
50" deltas had added a border to a border-box box and were never real, the true gap being
16 between field blocks where the boards draw 20; five more of the landing's wave-50 gap
terms are the May-versus-August version question, not defects, and all three hero boards
now draw the subhead the app retired under bug 419bd2b4; the create-agent wizard's step
rail is two shapes, its rule a column remainder, and its 768 orb was gated behind `lg`;
the three 375 Rewards boards had never been opened; and the slot menu drawer was the
landscape box centred on every stage. New decisions for Casey are listed in
`scratchpad/wave51/lanes.json` reports and carried into section 3 below.

## 3. Decisions for Casey

From phase 1 (shipped default in brackets):

1. Wallet-connect handshake sheet titles itself after the pressed wallet's id; the
   Phantom-named boards read "MetaMask". (a) keep the pressed id [shipped], (b) design
   retitles.
2. 11229:192104 overflows its sheet by 181 either side (a 768 block pasted unresized).
   (a) design fixes it, (b) reproduce it.
3. `onWalletCancel` is optional and unwired. (a) pass it at SkaiSignInFlow.tsx:414 and
   LandingWaitlist.tsx:2693, (b) ship with no back control [current].
4. Hardware wallet (7482-145038, 7713-13587): build a real BC-UR scanner, or accept the
   keystore file import and retire the three Scan QR boards as superseded?
5. Wallet warning-card inset: three boards draw one component three ways (16,12
   [ships]; 14,10; 12,10). Keep, take one board's, or split by width?
6. Import-phrase 12/24 toggle: the board hides it; removing it makes 24-word import
   paste-only. Keep [current] or remove?
7. Landing username and completion geometry: the May set or the August set?
8. Landing hero subhead: the frame's "Discover the new world" or the app's "Tap into"
   (retired under bug 419bd2b4)?
9. Landing 375 mark clearance: 40, 32, or keep 50 [current]?
10. Create-agent wizard shell: full-bleed dialog over the app chrome [current,
    test-pinned] or inside the shell as all ten boards draw it? Every wizard row is
    partial on this alone.
11. "Configure trading style" heading: drop (14123:81330 draws none) or keep pending a
    1440 read [current]?
12. Mis-titled boards 14179-163655 (titled 1440, is 375) and 14179-163502 (titled "no
    data", draws data): design renames, or the catalog carries the correction?
13. Rewards Frame 709 range selector over a money figure: (a) disabled naming its
    missing source, (b) unbuilt [wave 50 ruling], (c) a dated earnings read.
14. Rewards Frame 186 "All referrals" segment: (a) disabled, (b) unbuilt [current],
    (c) a site-wide aggregate.
15. Create-course step 2 (FAQ, Allow comments): (a) add the columns, (b) ship disabled,
    (c) hold [current]. Frame defect: the three empty referral boards close with vault
    copy.
16. Slot menu rows: the frame's five decorative rows, or four working rows plus volume
    and rules text [current]?

The 63 undecided items of `WAVE50-INTEGRITY.md` section 5 stand, and Casey's third wave
50 ruling (fix the two Airdrop not-eligible boards; the app keeps its honest branch) is
design's, not this repo's.

## 4. Verification at close

- Superproject `typecheck:gate`, main tree, twice: the first run caught eight new
  errors of my own (two scenes calling helpers they had not imported, two helpers and
  two imports left unused), the second after the fix: exit 0, "no new type errors. 2520
  known baseline error(s); 78 fewer than baseline". The gate's tsconfig reaches the
  skai-gaming engine scenes, which is how it caught them.
- Tests: `certification.test.ts` 4 of 4 from inside skai-gaming;
  `GasTrackerPage.feeTiles.test.ts` 3 of 3 from the root.
- skai-gaming `tsc --noEmit` with the heap flag, three runs because the first two
  started before the fixes above: run 1 (before the import fix) 2,010 errors with four
  TS2304 in the touched files; run 2 (after the import fix, before the cleanup) 2,005
  with three; run 3 on the committed state (80cb060 plus a peer's b128e35b), 12:2x to
  13:4x under the fleet's load: exit 2, 2,002 errors, none in the five files the RTP
  guard touched. The baseline is about 2,019 (wave 50 close); the count moves with the
  superproject src the gaming config includes.
- Peer state taken as given: origin/main was red on the gate at 81551abcc (five errors
  predating the wave, fixed by peer session 92 at e5035b47f before this pass gated);
  `.env.production` deliberately names the retired outcome-market contract while a
  user's open positions are refunded, and was not touched; the HOLD migration under
  `supabase/_pending/` was not applied.
- Pushed: skai-ui 8b60001 and 7c4d3b9; skai-gaming 80cb060; skai-landing a8a83b7; main
  ca472bbda. Pointer bump 0798f33ff from the detached deploy worktree on top of
  origin/main (skai-ui 7c4d3b9, skai-gaming 80cb060, skai-landing a8a83b7; every other
  pin as origin/main carries it).
- Deploy: `deploy_main.ps1` from the detached worktree at 0798f33ff, 11:45 to 12:00, 14m
  32s, exit 0: release `skai-trading@20260919-1145-0798f33ff` live on app.skai.trade
  (verified by version.json), CloudFront invalidated, the parity feed re-published
  unchanged. Its version.json reads dirty:true, "2 uncommitted entries" at stamp time
  (11:50:53). The worktree read clean at 11:45 before the deploy and clean again after
  it, and re-running the skai-ui build and the app build in the worktree afterwards
  dirtied nothing, so the two entries could not be named. The bundle was built from the
  pinned commit's files; the flag is recorded, not smoothed, per emit-version.mjs, and a
  peer session's gated deploy later today supersedes this release.

## 5. What is next

1. Wave 51 proper, once the weekly limit resets on 2026-09-22 14:00 Denver: the
   thirty-lane fleet over the 3,076 open frames with the three rule fixes from the wave
   50 record (column 3 is one bare path; `row-tree-check.mjs` before the fold; an empty
   owns array is re-partitioned, not dispatched), and the standing direction Casey gave
   with ruling 2: build every frame's features, with the unavailable state where no
   source exists, rather than leaving a partial with a reason.
2. First rows for that fleet: `Frame 633` (13549:99145) on the Play page, the gas
   tracker's 1440 tile row, and the Hooked menu boards once design settles their figures.
