# Launch (`/launchpad`, `/launchpad/create`) — frame facts, 2026-08-26

Written while working the eleven backlog reports filed against the Launch
surface in two waves, 2026-07-27 and 2026-08-01: `705410b7`, `18c526d8`,
`583c032f`, `abefbd95`, `adb0c5ba`, `41c8b16d`, `071241ed`, `e4603bf5`,
`1a50dbbc`, `f73c9a9e`, `39a10295`.

Every statement below was read out of `get_metadata` against the named file, or
out of the reports' own screenshot attachments — not out of a title, a note, or
the code.

---

## 1. Every node id in the 2026-07/08 wave is dead in BOTH files

The ten reports from those two waves all link `3sSzw1KewMtUbeLAv7uW0r`. Each id
was requested **by id in both files** — the discipline `src/pages/Launchpad.tsx`
records, after two earlier agents closed this batch off a bad negative. All ten
404 in `3sSzw1KewMtUbeLAv7uW0r` **and** in `mhF3BkzlTaGiLzJ7kvpmVc`:

| Report | Linked node | `3sSzw…` | `mhF3…` |
|---|---|---|---|
| `705410b7` | `8493-31691` | 404 | 404 |
| `18c526d8` | `8493-33199` | 404 | — |
| `583c032f` | `4423-104542` | 404 | — |
| `abefbd95` | `4446-118388` | 404 | 404 |
| `adb0c5ba` | `7909-47219` | 404 | — |
| `41c8b16d` | `8489-68562` | 404 | — |
| `071241ed` | `4423-90854` | 404 | — |
| `e4603bf5` | `8489-65970` | 404 | — |
| `1a50dbbc` | `4423-106436` | 404 | 404 |
| `f73c9a9e` | `4437-116944` | 404 | 404 |

Four were probed in both files; the rest 404 in the file they were filed
against. The Launch frames were re-cut into `mhF3BkzlTaGiLzJ7kvpmVc` under the
`13006:*` range, so **a 404 here means "re-find this frame in Skai-Web-App-2",
not "the design was withdrawn"** — the current Launch landing frame is
`13006:146234` and the current create frame is `13006:147566`.

**The consequence that bites:** for these reports the *screenshot attachment is
the only surviving copy of the spec*. Do not treat the attachments as
illustrations, and do not close a report because its link is dead.

## 2. TWO different frames are both named "Trench scroller"

This one produced a wrong answer during this session and is the reason
`39a10295` ("Mismatching footers") looked unactionable.

| Node | Size | What it actually contains |
|---|---|---|
| `13006:147304` | 1382×20, at `y=0` | **Token ticker.** Qwen $15.71K, uAI $17.78K, Monieman… $44.33K, Cope $100.22K, GYATT, WOJAK, LIGHT, NRT, Zerax, OLDEN, GIGA — a market-cap strip. |
| `13006:147365` | 1382×22, at `y=878` | **Wallet / preset status strip.** `Preset 1`, a counter, `37.21`, three chain icons, `$56.98K` `$200.11` `$112.98K`, then `14.12K` `112.46K` `43.09K` `0.0₂13` `0.0₂81`. No tokens, no prices-by-pair. |

Same name, opposite content, top vs bottom of the frame. Selecting the component
by NAME mounts the wrong one. `TrenchScroller.tsx` implements the **top** one
(`13006:147304`) and is correctly mounted at the top of `/launchpad`.

`39a10295`'s `figma_link` points at **`13006:147365`** — the bottom strip. So
that report is not about a links footer at all: it is "the app's bottom bar
shows market pairs with price and percentage; the frame's bottom bar shows
preset / balances / gas stats." `e4603bf5`'s two attachments are exactly that
pair, current vs Figma, which independently confirms the reading.

The app's bottom bar is `HomeBottomTicker` (global shell, `fixed bottom-0 h-7
hidden lg:flex`), and `/launchpad` passes `showFooter={false}` so the links
`<Footer />` never renders either. **Both reports are global-chrome findings,
not launchpad ones** — changing that strip changes every page in the shell.

## 3. Spec text that exists ONLY inside the attachments

Four designer sticky-notes, recovered by downloading the attachments. These are
requirements, not commentary, and the node ids that would have carried them are
dead (§1).

**On `705410b7` (Launch landing, frame `1440×2226`):**

- *"Within these tabs are similar cards, tailored to their respective
  categories, but with similar format, so I'll exclude repeating the designs
  below, since 'All' contains a prototype for all."* — i.e. every category tab
  reuses ONE card format. Do not expect a per-tab card design.
- *"Will display up to 99 items before next reload."* — the markets grid page
  size. **Not reachable today**, and the ceiling is upstream of Launch:
  `tokenDiscoveryService.ts` caps its fetchers well below 99 (`boosts.slice(0,
  50)`, `profiles.slice(0, 40)` / `slice(0, 60)`, pump.fun `limit=30`, search
  `tokens.slice(0, 50)`). Raising it is a change to the shared discovery
  service, which Trench also reads.

**On `583c032f` (Sample token › Dashboard – negative 1VH, `1440×900`):**

- *"Conditions: Advanced analysis, just loads up the AI chat interface and
  prompts the AI directly to digest and advise on this data."* — the frame's
  `Advanced AI` button is a hand-off to the existing AI chat with a seeded
  prompt, NOT a new analysis engine.
- *"Update: InsightX, because all the other competitors seem to be using them
  for their bubble maps. Feel free to integrate another more effective
  version."* — the bubble map is an **external vendor** (InsightX, whose logo is
  drawn bottom-right of the frame). Blocked on a vendor decision and a key.

Note also that `583c032f`'s url says `/launchpad`, but its frame breadcrumb
reads *Skai > Launch > Sample token > Dashboard* and draws a token dashboard
(bubble map, Skai sentiment, Verdict, Similar name tokens, Reports/News/Whale
activity). That is the Trench token-dashboard surface, not the Launch landing.

## 4. `adb0c5ba` is the global left icon rail, not a Launch control

Its two attachments are the left sidebar icon column, current vs Figma. The
visible delta is the trailing icon count and which item carries the selected
rounded-box background. Global chrome — same caveat as §2.

## 5. The create frame prints 15mb / 30mb, and the rail refuses above 8

`f73c9a9e`'s attachment is the `Skai > Launch > create token (1440 × 900px)`
frame. Its Token-image hints read *"Image - max 15mb"* and *"Video - max 30mb"*;
the banner reads *"max 4.3mb"* and *"3:1 aspect ratio, 1500x500px"*.

Both of the first two are unreachable — every launchpad upload goes through
`get-asset-upload-url`, which 400s above 8MB for every category. Recorded here
because the frame text is what a future parity pass would copy. See commit
`8c97e98c5` and `src/services/launchpad/tokenMediaService.ts`
(`TOKEN_MEDIA_MAX_BYTES`), which state the rail's real cap instead. Whether the
server cap should RISE to honour the frame is open and is Casey's call.

The same frame also draws **Advanced options** — `Mayhem mode`, `Cash back`,
`Select launchpad` (five launchpad icons). Those are built in
`LaunchpadCreate.tsx` against `13006:147533` and rendered as explicitly
unavailable, because no contract parameter backs any of them:
`SKAITokenFactory.createToken`, `createCurve` and `buy` take no such argument.
