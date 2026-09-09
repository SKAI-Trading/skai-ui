# Wave 39 — integrity and close-out (2026-09-09)

Written by the orchestrating session after all thirteen lanes reported. Every number
carries its denominator, the rule inherited from `WAVE9-INTEGRITY.md` onward. The
brief the lanes worked from is `WAVE39-BRIEF.md`.

**Baseline (pinned before launch):** main `31991f1bb` · skai-ui `196627e` · skai-gaming
`4b10d5ac` · skai-wallet `6333e64` · skai-landing `2d88171` · parity 560 / 3,584 done,
151 verified.

**Close (catalog HEAD `5e420ca`, fold-in commit):** the same 3,584 in-scope frames,
3,581 of them carrying a row (99.9%).

---

## 1. What moved

| measure | before | after | delta |
|---|---:|---:|---:|
| in-scope genuine frames (of 4,212 live; 628 furniture) | 3,584 | 3,584 | 0 |
| frames with a status row | 3,581 | 3,581 | 0 |
| `done` | 560 (15.6%) | 591 (16.5%) | **+31** |
| `done` and visually verified | 151 (4.2%) | 160 (4.5%) | **+9** |
| claimed statuses pulled down by a visual verdict | — | 92 | — |
| drift: live-only / catalog-only | — | 3 / 0 | — |

**The status page's percentage reads lower than before this wave, and that is the
denominator, not regression.** The 09-09 audit reported 560 / 2,798 = 20.0%. Bringing
Governance and Utilities and Onboarding and Authentication into scope for this wave
added 786 in-scope frames, so the same 560 became 15.6% before a lane touched anything.
Both figures are true of their day; compare like with like.

The headline is honest and small: 31 more frames measured to the frame at every board
they draw, nine more of them verified visually. The bulk of the wave's output is
elsewhere — 1,076 `partial` rows, most replacing `not-started` or `unknown`, meaning the
page is now built to the frame with a named remainder rather than not built at all. That
is progress the `done` percentage does not show, and it should not: `done` means
measured, and a partial row says exactly what is still open.

The three live-only drift frames are the harvest's, not the wave's; `catalog:drift`
reports them and the next harvest folds them in.

## 2. The lanes

Thirteen lanes, partitioned by file ownership per `WAVE_PLAYBOOK.md`. Each wrote its
own `status.wave39.<lane>.tsv`; none was regenerated afterward. Row counts are data rows
(comment lines excluded), as read from the files at close.

| lane | rows | done | partial | blocked-on-backend | not-started | frame-defect | furniture | unknown |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| governance-account | 108 | 0 | 67 | 6 | 35 | 0 | 0 | 0 |
| governance-explorer | 569 | 0 | 191 | 12 | 108 | 0 | 51 | 207 |
| home | 382 | 0 | 299 | 5 | 62 | 4 | 9 | 3 |
| onboarding | 129 | 0 | 103 | 3 | 16 | 4 | 3 | 0 |
| play-arcade | 22 | 0 | 6 | 13 | 0 | 2 | 1 | 0 |
| play-cards | 52 | 0 | 27 | 0 | 0 | 16 | 9 | 0 |
| play-hub | 57 | 23 | 34 | 0 | 0 | 0 | 0 | 0 |
| play-instant | 13 | 0 | 13 | 0 | 0 | 0 | 0 | 0 |
| predict | 7 | 0 | 7 | 0 | 0 | 0 | 0 | 0 |
| social | 14 | 3 | 6 | 5 | 0 | 0 | 0 | 0 |
| trade | 200 | 5 | 175 | 11 | 5 | 0 | 1 | 3 |
| trench | 15 | 0 | 15 | 0 | 0 | 0 | 0 | 0 |
| wallet | 123 | 11 | 106 | 0 | 0 | 0 | 6 | 0 |
| **total** | **1,691** | **42** | **1,049** | **55** | **226** | **26** | **80** | **213** |

42 `done` rows became +31 in coverage because some restated a frame already `done`, and
because coverage applies the visual verdicts in `vverify.*.tsv` after the status rows:
a `done` on a frame whose verdict is `partial` counts as partial. That is by design
(`coverage.mjs` section 4b) and it is what keeps the percentage from being raised by
editing status rows.

Commits landed by the lanes, all pushed at close: main 13, skai-gaming 9, skai-wallet 3,
skai-landing 1, skai-ui 17 plus the fold-in `5e420ca`. Pointer bump in main:
`c799832bb`.

Two lanes hit the Figma MCP seat's burst cap mid-run (roughly fourteen node reads, then
several minutes refused). Both carried their verdicts from the source and the prior rows
and marked every such row `NOT RE-READ` / `CARRIED`; those rows are `partial` or
`frame-defect`, never `done`.

## 3. Gates, on the quiet tree after the lanes finished

| gate | result |
|---|---|
| main `typecheck:gate` | 0 new errors against a 2,588-error baseline (10 fewer than baseline) |
| main vitest, `ReferralShareDialog.figma.test.tsx` | 9 / 9 after fixing the clipboard mock's signature (TS2554, the only new error the gate found) |
| skai-landing `tsc` | 0 errors; `StatusPage.test.tsx` 29 / 29 |
| skai-wallet `npm run build` | green after two pre-existing fixture type errors in `SendModal.figmaParity.test.tsx` (missing required props; `address: null` on the native token) |
| skai-wallet vitest, that file | 14 / 14 |
| `catalog:check` | derived files regenerated and committed; 43 rows resolve to no frame, 182 id-keyed rows name a node the registry lacks (stale ids and nested children, carried from earlier waves), 6,392 ids claimed by more than one file — the later file wins, as documented |

Pre-existing red tests, not touched: landing `CompletionPage` / `UsernamePage`; main
`homePageLiveHarvest.figma.test` pins the 09-07 harvest date and goes red on every
harvest.

## 4. Visual pass

One dev server, one browser, serial. Viewports 1440x1000 and 375x812 on twenty routes,
768x1024 on `/play` and `/spot`. This is a shell-level pass — the page's sections,
order, chrome and overflow against the frame — not a per-frame measurement, so it adds
no `vverify` rows: every `done` frame on these routes that lacked a verified row is a
state the pass did not open (resume play, unsupported region, create post, snipe
settings).

| route | 1440 | 375 | note |
|---|---|---|---|
| `/play` | matches | matches | 768 also matches; hero, mode cards, game search, sports rail, featured filter tabs |
| `/play/casino` | matches | matches | seven filter chips, provider card, popular rail |
| `/play/dice` | matches | matches | board above controls at 375 |
| `/play/coinflip` | matches | matches | |
| `/play/blackjack` | matches | matches | ribbon felt, 2x2 action grid |
| `/play/roulette` | matches | **broken** | see below |
| `/play/scratchers` | matches | matches | 3x3 grid, 2-column paytable at 375 |
| `/play/rock-paper-scissors` | matches | matches | third move button truncates to `Sciss…` at 375 |
| `/rewards` | matches | matches | tier chips truncate at 375 (`Fr…`, `Br…`) |
| `/social` | matches | matches | empty feed state |
| `/discover` | matches | matches | |
| `/account` | matches | matches | rendered behind the login dialog in a dev session; dismissed to verify |
| `/explorer` | matches | matches | |
| `/portfolio` | matches | matches | |
| `/` | matches | matches | |
| `/spot` | matches | matches | 768 also matches; 375 scrolls, per the 09-05 ruling |
| `/trench` | matches | matches | |
| `/predict/all` | matches | matches | category row drawn once |

No route scrolls horizontally at 375 (document width 369 of 375) or at 768 (762 of 768).

**Roulette at 375 is a real defect and it predates the wave.** The betting grid collapses
and the split-bet hit spots, drawn at a fixed size, sit across the number cells. Wave
39's diff to `RoulettePro.tsx` is twenty lines and only reorders the table and footer
under `md`; the cards lane's roulette rows are `frame-defect` and `partial`, none claims
375 `done`. Follow-up item, not a wave regression.

Things that look wrong on localhost and are not: h1–h6 render in Cormorant Garamond
because that is the design system's display face for editorial headings (`index.css`,
since `f14e5089c` on 07-15); `/play/baccarat` has no route because Baccarat opens as a
modal from the lobby; console errors are environment — 401s from the production database
under the dev placeholder user, a 403 websocket handshake from a localhost origin, and a
CSP block on the local keeper health probe.

## 5. Decisions only Casey can make

Recorded by the lanes in their rows (`grep -i casey status.wave39.*.tsv`), grouped here.

1. **Home deposit flow (26 frames, home lane).** `Skai > Home - with deposit`, its
   deposit modal, Buy with Fiat, select currency, pay with, Send crypto, Deposit
   received, quick balance and the wallet-mini fragments at all three boards. No
   implementing code exists. Either the flow is built (MoonPay only on the buy step, a
   send step, a quick-balance panel) or the frames are ruled out of scope.
2. **`/spot` phone layout (trade lane).** The May frames draw an inset 346px column; the
   later frames and the app draw full-bleed 375. Which governs.
3. **Account routes (governance-account).** The six `Skai > Account` frames (5518:100072
   family) map to `/account`, but the app also serves `/portfolio` for the private-key
   frames. One route or two.
4. **Security tab rails.** The password and email frames assume a password rail; the
   product's auth is the embedded wallet. Build the frames, or rule them superseded. The
   frame's 60.9x36 toggle is not the `@skai/ui` Switch — a component item for skai-ui.
5. **Explorer extras.** The all-time records strip and the Validators & Staking table are
   not on the frame and were retained. Keep or remove.
6. **Landing.** Confirm the May *Get early access / Login* set is retired by the August
   *Sign up / Login* set; pick the teaser video cut; pick which of the six share-card
   frames is the canonical og-image; onboarding i2 is a four-string content edit (pick
   one); i5's live count needs the PII ruling before any RPC; i6 ships at all or not.
7. **Hi-Lo CTA** reads `Play`; the frame says `Bet` (report af18e8ad, still open).
8. **Blocked-player modal** sends players to skai.jp; whether that property exists is a
   product call before the copy is built.
9. **Play hub live-player count** — the frame prints a sample figure, the code prints a
   measured count. Behaviour call, not a parity edit.
10. **Limbo mobile board** — one decision raised on the chip rail's sizing (10021-30111).
11. From the lanes' close-out messages: Coinflip 768 cuts; Blackjack 768 board box;
    Baccarat autobet; hardware-wallet scanner; the onboarding modal set; header socials;
    Trench tab-in-card; Trending/New menus on the predict header; Chicken CTA copy.

## 6. Hand-offs

- **skai-ui component items** (lanes may not edit `modules/skai-ui/src`): Switch toggle
  at the frame's 60.9x36; email-verification OTP input; wallet-choice rows; landing
  header socials.
- **Backend-gated frames**, built to an honest `unavailable` state and rowed
  `blocked-on-backend`: play-arcade 13, governance-explorer 12, trade 11, governance-
  account 6, social 5, home 5, onboarding 3.
- **Frame defects** rowed `frame-defect` (the frame is wrong, the code is right):
  play-cards 16 (the roulette boards' duplicated `13 to 24` cell and a bottom row that
  starts at 3), home 4, onboarding 4, play-arcade 2.
- **Roulette 375 board** (section 4).
- `deploy-edge-functions.yml` fails at workflow start; the `service-status` function was
  deployed by hand and byte-verified.

## 7. Deploys

All three through `scripts/aws/deploy_*.ps1` after `preflight:env`, with no other
deploy running (process table checked excluding this shell and its parent). Each
surface was then read back by its own `version.json` and rendered in a browser; the
commit string is the proof, not the timestamp.

| surface | script | release | invalidation | read back |
|---|---|---|---|---|
| app.skai.trade | `deploy_main.ps1` | `skai-trading@20260909-1546-c799832bb` | `I4U14DBTSZSGZ9UY5CM48PPAEZ` | `commitShort` `c799832bb`; `/play` renders the hero at 1440 and 375, no horizontal scroll |
| wallet.skai.trade | `deploy_wallet.ps1` | `skai-wallet@20260909-1553-345dc15` | `IA8IPB17HZ1DCQHL2QYJZWK4IH` | `commitShort` `345dc15` |
| skai.trade | `deploy_landing.ps1` | `skai-landing@20260909-1554-9be2dcb` | `I9AKTYR94GLDONHH5ORFSICPQ` | `/status` prints 16.5%, 591 of 3,584, 160 verified; Onboarding and Governance rows on the board; bug panel 5,525 / 4,248 / 426 |

Every build carries `dirty: true` because the shared working tree held peer sessions'
uncommitted edits at build time. Those edits were read before deploying: a predict
dashboard change that stops drawing its category row twice, and a 375 box-model fix on
the play-mode cards. Both were already in the renders section 4 verified, so they
shipped as seen, not as assumed.

The status page's Chain RPC row reads `Degraded` — it asked for block 8,222,790 and the
node returned 8,222,789. That is the probe doing its job on a known RPC fault, not a
deploy artefact.

`deploy_main.ps1` also republished `figma-parity.json` to skai.trade (step 7.5), so the
feed and the app moved together.
