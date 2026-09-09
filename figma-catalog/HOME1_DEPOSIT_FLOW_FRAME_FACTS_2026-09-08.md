# Home 1 deposit flow — measured 2026-09-08

File `mhF3BkzlTaGiLzJ7kvpmVc`, page `2003:674` "Home 1", scope **`v1-superseded`**
in `live/_pages.json`.

Twelve open bug reports cite frames in this flow. Every one of them resolves to
this page, so on the page flag alone all twelve read as "not a parity target".
This file records why that reading is not safe to act on, and what the one
question for Casey actually is.

Companion to `status.scope-adjudication-2026-09-08.tsv`, which lists the twelve
rows alongside the 43 in-scope rows from the same sweep.

## What was measured, and how

Each node was resolved with `figma.getNodeByIdAsync(id)` and a `.parent` walk up
to the PAGE node. Not the id prefix, not the `live/*.tsv` snapshot — both of
which misplace nodes of this age, and both of which would have put these twelve
on a v2 page because their prefixes run `13484`–`13502`.

| report node | frame |
|---|---|
| `13486:49630` | `Header-desktop` on "Home - with deposit 1VH (1440 x 900px)" |
| `13486:49723` | `Frame 1137`, the welcome/get-started band on the same screen |
| `13486:49332` | Home - with deposit > deposit modal (1440) |
| `13484:48643` | deposit modal > Buy with Fiat (1440) |
| `13490:168974` | Buy with Fiat > select currency (1440) |
| `13490:169814` | Buy with Fiat > pay with (1440) |
| `13490:170320` | deposit modal > Send crypto (1440) |
| `13495:171110` | `dropdown-networks` |
| `13495:171067` | `dropdown-token` |
| `13502:172088` | Send crypto > Deposit received (1440) |
| `13502:171904` | `Wallet MINI`, the quick-balance panel |
| `13502:171979` | `dropdown-my wallets` |

## Fact 1 — there is no v2 replacement, and it is not close

Page `13008:110718` "Home 2" (in-scope) holds **240 top-level frames and not one**
whose name matches `deposit`, `fiat`, `send crypto`, `select currency`,
`pay with`, `my wallets`, `receive`, `fund`, `top up` or `onramp`. Read live off
`page.children`, not off the 2026-08-26 snapshot.

Home 2 is Whales, Market intel, Agentic/Intelligent support and Sentiment. It is
not a home *shell* redraw, so "Home 2 supersedes Home 1" cannot mean the funding
flow was replaced by something better. Nothing replaced it.

The nearest in-scope funding spec anywhere in the file is on a different host:
page `13008:26951` "Wallet 2" draws `Skai > Wallet > continue on web > home >
receive - step 1 / step 2 / set amount` at 1440, 768 and 375. That is
wallet.skai.trade's own receive flow, not app.skai.trade's deposit modal.

## Fact 2 — this flow is the NEWEST drawing on the page, not the oldest

Figma node ids are globally monotonic within a file, so a larger session prefix
means a later creation. Ranked that way, the six newest top-level nodes on
Home 1 are all this flow:

| node | name | nearest neighbour |
|---|---|---|
| `14355:262060` | `modal` | deposit modal > Send crypto 1VH (768 x 1024px), 548px |
| `14355:262291` | `modal` | deposit modal > Send crypto 1VH (375 x 812px), 454px |
| `14321:261423` | `modal` | deposit modal > Send crypto 1VH (1440 x 900px), 780px |
| `14317:260169` | quick balance - wallet mini ALT 1VH (375 x 812px) | — |
| `14317:260499` | quick balance - my wallets ALT 1VH (375 x 812px) | — |
| `14317:261272` | `dropdown-my wallets` | — |

For comparison, the newest top-level node on Home 2 is `14316:248325` and on
Trade 2 it is `14180:115254`. **The newest drawing across all three of this
file's Home/Trade pages sits on the page marked superseded, and it is this
flow.** The 768 and 375 cuts of the entire deposit flow (`14129:*`, `14136:*`)
were likewise drawn after the v2 page nodes `13008:110718` and `13006:134300`
existed.

★ A flow does not get three fresh breakpoints and three draft send-crypto modals
drawn *after* its replacement page is created if it has been retired.

## What this does and does not settle

It does **not** settle that the page flag is wrong. `v1-superseded` was
harvested 2026-08-26 at page granularity, and page granularity cannot express
"most of this page is superseded, one flow on it never moved".

It does settle that the twelve rows must not be closed as
not-reproducible-against-current-spec on the flag alone. The premise behind that
disposition — that a retired frame has no live spec to build toward — fails
here: the spec exists, at three breakpoints, and it is the freshest work on the
page.

**The one question for Casey, for all twelve rows at once:** is the
deposit-encouragement flow (deposit CTA, welcome band, deposit modal,
buy-with-fiat plus currency and pay-with, send-crypto plus network/token
dropdowns and deposit received, quick balance, my-wallets dropdown) still live
spec that simply never changed pages, or was it dropped when v2 was drawn? If it
is live, either it needs re-scoping on this page or the flow needs a home on
Home 2.

## Rows

`3863371d` · `9ecb03c8` · `28d5686e` · `4d410bbf` · `0734c994` · `97a46c55` ·
`b6df3c2f` · `86a8d277` · `627e8ed1` · `f3e21bd2` · `c41bbe7b` · `81ead45f`

All twelve left at `backlog`. Each carries a comment with the measurement above;
no `resolution_notes` were overwritten, because a peer lane had already routed
these to Casey on the registry.json reading and that note is still correct as
far as it goes.
