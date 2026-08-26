# Social > Groups — frame facts, 2026-08-26

Written while working eleven bug reports filed against `/trading-groups` on
2026-08-25 (`2721ef8d`, `a2eeeba5`, `4dd47ac0`, `238d6963`, `e83a37e3`,
`0ddc94cc`, `e30e8261`, `870d5206`, `148b0f2c`, `a10d3ed9`, `ab44cddf`). Every
statement below was read out of `get_metadata` / `get_screenshot` against
`3sSzw1KewMtUbeLAv7uW0r`, not out of a title, a note or the code.

Companion to `SOCIAL_LABEL_CORRECTIONS_2026-08-20.md`, which records the same
class of problem for the rest of the section. Do **not** edit `registry.json`
titles to match — `figma-drift.mjs` matches RETARGET rows by exact title.

## Every one of these reports links the `main` CHILD, not the catalog frame

The reporter copies the URL from Figma with the inner content frame selected, so
the node in `figma_link` is one level below the frame the catalog indexes. Both
resolve; they are the same screen. Reading the catalog for the linked id returns
nothing, which reads as "this frame is not in the catalog" and is wrong.

| Report links | Catalog frame | Screen |
|---|---|---|
| `5194-270744` | `5194-270743` | Groups - search (All groups) |
| `5198-47083` | `5198-47082` | Groups - search - empty |
| `5198-47892` | `5198-47891` | Groups - search > Discover |
| `5198-50315` | `5198-50314` | Groups - search > Created |
| `5198-63238` | `5198-62746` | Groups - search - empty > Create group |
| `5202-63934` | `5202-63932` | View group > Statistics |
| `5203-64552` | `5203-64550` | View group > Members |
| `5204-65394` | `5204-65392` | View group > Rules |
| `10232-201330` | `10232-200912` | View group > Adjust settings |

`5198-51022` and `10227-200411` are the two exceptions — those reports link the
catalog node itself.

## The Created tab DOES draw a `Token req.` column

`GroupsSearchTable.tsx` carried a note saying "the 1440 Created frame
`5198-50314` has no such column" and dismissed the `Token req.` block in the 375
Created redraw (`11526-290070`) as a copy-paste artefact of the Discover row.
Read against the rendered frame, that is **false**. The Created header is:

```
S/N | Date created | Group | Token req. | Type / Criteria | Description | Action
```

and every row draws **two** pills — `Private` **and** `Token` — which is why the
header reads `Type / Criteria` there and plain `Type` on All groups and
Discover.

The column is still not rendered, but for the OTHER reason, and that one holds:
the Created tab is built from `getMyTradingGroups()`, which reads
`trading_groups` rows and carries no `access_rules`; neither feed it can be
enriched from (`list_trading_groups`, `discoverEligibleGroups`) carries rules for
a group the viewer already owns. Every cell would be an em dash and every second
pill absent. Drawing it needs a rules-carrying read — a service change.

## `Token req.` keeps its full stop at every width

`5198-47892`, `5198-50315` and the 375 redraw `11526-290452` all write
`Token req.`. The desktop table header shipped `Token req` while the 375 list
already had the stop, so two surfaces of one component disagreed with each other
and with all three frames. Fixed 2026-08-26.

## Group-cell geometry differs by width — 52px vs 34px

| Frame | Avatar | Gap to text | Type tag |
|---|---|---|---|
| `5194-270744` (1440) | `Rectangle 34624566` **52x52** | `Frame 500` at x=64 → **12px** | own `Type` column |
| `11526-288877` (375) | same rectangle **34x34** | `Frame 500` at x=42 → **8px** | inline, on the NAME line |

The 375 row holds the name (`Frame 499`, x=0) and the tag (`Frame 814`, x=98)
inside one 18px-tall `Frame 1000003847`. The code drew a single 36px avatar at
every width and put the tag on a row of its own beneath the head. Fixed
2026-08-26.

## `5194-271101` is NOT a missing section

The All-groups frame runs to 1665px, and below the table sits `Frame 619`
"Highest market cap streams" with a `Row` of six 240x183 cards (ByteBrokers,
SignalSeekers, RouteRunners, Pathfinders, KeyKeepers, RouteRunners).

**It renders nothing.** `get_screenshot` on `5194:271101` returns a 1x1 PNG for a
node whose declared size is 1144x235, and the parent frame's own render trims to
844px tall — everything below that y is blank. The cards are empty scaffolding
with no fills. Any "the page is missing a streams carousel" reading of this
family comes from the metadata, not from the artwork.

## `10227-200411` — the members dropdown, and which rows have a source

Four items: `Recent` (10227:200413), `Member requests` (10227:200810),
`Followers` (10227:200415), `Following` (10227:200417). A `line` at y=46 rules
off the first item only; item geometry is 234x30 with the label at x=8.

- `Member requests` **became buildable on 2026-08-26** —
  `supabase/migrations/20260826120000_trading_group_join_requests.sql` adds
  `trading_group_join_requests` and six SECURITY DEFINER rails. Any catalog note
  or code comment saying "there is no such table" is now stale; several said so
  and have been corrected in place.
- `Followers` / `Following` still have none. `getGroupMembers` joins `users`, and
  `follower_count` lives on `user_profiles` — 11 rows, exactly 2 non-zero, max 2
  (prod, 2026-08-25).

## `10232-201473` — where the "Member requests · 4 new" card belongs

It is the **third card of the group-info RIGHT RAIL**, under `Market cap` /
`Members` (`10232:201471`-ish) and `Community token`. It is not inside the
Adjust-settings drawer, which is what its position in that frame's node tree
suggests. Visible in the `10232-200912` and `5204-65394` renders.

The card carries a stacked 3-avatar badge and
`@CryptosTraderX, @DeFiNewsAlerts, etc.`. `memberRequestsBadge()` in
`src/pages/social/groups/groupsView.ts` produces its caption and is still
rendered nowhere, because the right rail does not exist in code — see below.

## The group-info right rail has no data source

`5202-63934` / `5203-64552` / `5204-65394` all draw a ~350px right column:

1. `Market cap $221.49K` + `Members` (avatar stack)
2. `Community token` — `SKAI / SKAI token / Default / $14.2B / Holders: 3M`
3. `Member requests · 4 new`

Only (3) has a live source. There is no group-level market-cap feed, no group
token-holder count, and the SKAI token is unlaunched — `skai_getMarketStats`
answers `market "SKAI-USD" not found`. The same frames also draw a
`Comb. market cap` chart with 1D/1W/1M/1Y/ALL and a `0x4q5...3d6` +
`View on Skaiscan` chip; `trading_groups` has no address column and a group is
not a deployed contract.

## The frames' tab bar is underlined, never a pill

All three View-group frames draw `Statistics | Members | Rules` as labels on one
rule spanning the panel, ~22px apart, the active one carrying a 2px underline in
its own colour. `@skai/ui`'s default `TabsTrigger` paints a `primary/20` chip
with a 1px border and a shadow, which is correct elsewhere in the app. Overridden
per-call-site on `TradingGroupProfile.tsx` 2026-08-26; the primitive is
unchanged.

Note the frames draw **three** tabs. The code has four (`Access Rules`, the
token-gate requirements) plus an owner-only fifth (`Requests`). Neither is a
parity miss to delete — see `TradingGroupProfile.tsx` for why the two "rules"
tabs are different concepts.

## `5198-51022` describes a payment the product cannot take

The gated-join confirmation reads `Join Diamond Hands Club with 88 SKAI?` /
`Deposit a one time fee of 88 SKAI to join this group.` / `Yes, continue to pay`.

`trading_group_access_rules` stores a **holding threshold** (`min_balance`) and
no price. There is no fee column, no treasury row and no payment call anywhere in
the join path — `addMember` only ever checks a balance. The same wording appears
in the access-type copy at `5198:63525` / `10232:201410` ("...or depositing a
predetermined amount of the SKAI token to join"), which is withheld in code for
the same reason.

The neighbouring clause at `5198:63516` / `10232:201401` ("Only invited members
can join, members can also request to join") **was** withheld for the same class
of reason and is now shipped — the rail exists as of 2026-08-26.

## `5198-47082` — the empty panel is 620px and the centring is a spec

The empty Groups frame is one of the closest matches in this family: the copy
already agreed word for word, which is why the previous pass reported no defect
against report `a2eeeba5`. The one thing it could not settle was whether the
frame's very tall panel was a stated height or a canvas artefact, and it
declined to guess. The node tree settles it.

| node | name | geometry |
|---|---|---|
| `5198:47138` | `Frame 429` — the table panel | 1144 x 676 |
| `5198:47139` | `Frame 299` — the tab / filter row | h 56 |
| `5198:47869` | `Frame 301` — the panel **body** | **h 620** |
| `5198:47870` | `Frame 280` — the body's 8px inset | h 604 |
| `5198:47873` | `middle` — the message block | y 243, h 118 |

604 − 243 − 118 = **243**, exactly the gap above it. Equal gaps top and bottom
is a centring nobody reaches by accident, so 620px is the body height and the
message centres in it. Shipped 2026-08-26 on the loading, error, sign-in **and**
empty arms alike — the earlier objection to a min-height was that the sibling
states "would then look short beside it", which is answered by giving all four
one body rather than by leaving all four short. It also removes a double resize
on a cold load.

Type ramp, by the frame's own style names (`get_design_context` on `5198:47873`):

| element | node | frame | was |
|---|---|---|---|
| `No groups to show` | `5198:47875` | Lg/Sub-headline 2 300 = 18px / 24, Core/White | `text-base/6` (16px) |
| the sentence | `5198:47876` | Lg/Paragraph 3 300 = 12px / 16, App/Ash 300, wrap `w-[214px]` | `text-sm/5` at `max-w-[260px]` |
| gap inside `description` | `5198:47874` | 4px | 8px |
| gap block → button | `5198:47873` | 24px | 16px |
| `Create group` | `5198:47879` | h 34, **w 161**, 4px label→icon, `rounded-lg` | h 34, hug, 8px |

`rounded-lg` here is **Figma stock v3 = 8px**, and ours is 12px, so the call site
writes the pixel literal `rounded-[8px]`. 620px is transcribed from the 1440
frame only — there is no empty-state frame at 768 or 375 in this file, so the
narrow layouts still hug their content.

⚠️ `Frame 297` (`5198:47880`) is NOT hidden and reads "Add SKAI from your wallet
to your vault to earn interest and play games." It is boilerplate left over from
whatever frame this one was duplicated from, not groups copy. Do not build it.

## `10232-201473` is a rail card, not a groups-table badge

Correcting an assumption an earlier pass carried: the `Member requests · 4 new`
string belongs to **card 3 of the group-info right rail**, not to a badge on the
groups table. Nothing was added to the table.

That rail is still blocked (two of its three cards have no data source, above),
so as of 2026-08-26 the string is drawn on the surface that does exist — the
owner-only `Requests` panel heading on `TradingGroupProfile.tsx`. Before that
`memberRequestsBadge` had no call site at all: green under its own unit test,
rendering nowhere, and free to drift from `pendingCount` unnoticed.
