# Social > Messages — frame facts, 2026-08-26

Written while triaging nineteen bug reports filed against `/messages` on
2026-08-26 (`dcfa4880`, `084fbe8a`, `5ffd9724`, `c8bd9c17`, `4e241d2a`,
`ea7b5967`, `1efba4cd`, `aa67f021`, `3bed0697`, `25beb2ba`, `089d50a1`,
`39145e7e`, `16d56d7d`, `5056eddb`, `6b9376f4`, `125007ff`, `954834ce`,
`e3984e39`, `8aed83d4`). All against `3sSzw1KewMtUbeLAv7uW0r`.

Frame statements below were read out of `get_metadata` or out of the designer's
own PNG export attached to the report — not out of a frame title or a code
comment. Where a claim rests on the attachment rather than the API, it says so.

Direct sibling of `SOCIAL_GROUPS_FRAME_FACTS_2026-08-26.md`. The off-by-one
finding recorded there reproduces here exactly, on a different section and a
different reporter session.

## The off-by-one reproduces: reports link the `main` CHILD, not the catalog frame

Same cause as the Groups sweep. Looking the reported id up in `registry.json`
returns nothing, which reads as "this frame is not catalogued" and is wrong for
ten of the fourteen ids that miss on a naive lookup. `5198-9152` is literally
named `main` in `get_metadata` output, which is the tell.

| Report links | Catalog frame | Screen |
|---|---|---|
| `5152-203839` | `5152-203838` | Messages — empty |
| `5153-206245` | `5153-206244` | Messages — populated list (root frame) |
| `5153-205033` | `5153-205032` | Messages > open conversation |
| `5154-206769` | `5154-206768` | open conversation > image attachment, active |
| `5164-266353` | `5164-266351` | Messages > Unread filter |
| `5164-267631` | `5164-267630` | Messages > group message requests |
| `5171-270125` | `5171-270124` | message requests > preview pane |
| `5198-9152` | `5198-9151` | conversation page with notes |
| `10215-137088` | `10215-137087` | open conversation > scroll effect |
| `10216-138152` | `10216-138151` | open conversation > image attachment |

Already indexed under the reported id, no translation needed: `10213-16819`,
`5160-207895`, `5161-209418`, `5162-265168`.

Absent from `registry.json` at the reported id **and** at the neighbouring ids
(`grep -oh` over the prefix, not a single-id lookup): `5162-266324` (All
dropdown), `5164-267365` (Groups filter), `5168-269859` (Adjust chat settings),
`10335-239204` (Social sidebar section). The `10335` page itself is indexed —
six other nodes on it are present — so the page was scanned and these nodes were
not picked up, rather than the page having been missed.

## Two frames delete live features if implemented as drawn

This is the load-bearing part of this file. Both were escalated to `needs_info`
rather than triaged for build.

### `5198-9152` — conversation page with notes, omits the Tasks bar

`get_metadata` on the frame returns the conversation list, the empty right pane,
the header and the composer. There is no Tasks or todo node anywhere in it.

The reporter's third attachment is a designer note from David Ofiare dated
Wed Apr 29 2026, reproduced here because it is the whole reason this frame is
not a delete instruction:

> It is important to recognise that the task checker part of the personal notes
> and groups have been omitted here, because they currently can't be found in
> the app.skai.trade link, and I'm avoiding designing something entirely new
> that would be a hassle to create, when we already had what worked.
>
> In the event that we intend to bring this feature back, I can simply slot it
> into this new design, as there's enough provisional real estate.

The task checker is not gone from the app — it is live and mounted. `TodoPanel`
renders at `src/pages/social/Messages.tsx:275` and is driven from
`ConversationHeader.tsx:387`, `MessageInputArea.tsx:261` and
`MessageThread.tsx:73`, over `TodoPanel` / `SortableTodoItem` /
`SortableTodoListTab` / `TodoReferencePreview` in `src/components/messages/`.
The designer could not find it; that is a discovery failure, not a spec.

`125007ff` targets the same surface (`5153-205033`) without carrying the note.
Implementing that report alone still deletes the Tasks bar. The two must be read
together.

### `5168-269859` — Adjust chat settings, omits six persisted controls

The whole 442x884 `Right menu` frame contains a title, one radio group
(`Nobody` / `Mutuals only` / `Everyone on Skai`) and a CTA instance at y=798.
Verified by walking the full `get_metadata` tree, not by reading the screenshot —
the frame has a large empty region between y=242 and the CTA, which is the shape
that makes a screenshot look truncated when it is not.

`src/components/messages/MessagingSettingsSheet.tsx` ships seven controls, each
persisted through `messagingService.updateInboxSettings`:
`accept_messages_from`, `allow_message_requests`, `auto_accept_followers`,
`notification_push`, `notification_email`, `show_read_receipts`,
`show_online_status`. The Figma radio group maps to `accept_messages_from`
alone. Matching the frame exactly drops the other six.

## The Social sidebar is built, Figma-matched, and never mounted

`dcfa4880` (collapsed rail) and `8aed83d4` (expanded, `10213-16819`) are both
real, and both have the same cause. `src/components/social/SocialSidebar.tsx`
exists and passes its own Figma tests
(`SocialSidebar.drawer.figma.test.tsx` renders the real component against
frame specs). It is exported from the `src/components/social/index.ts` barrel
and imported by nothing outside its own tests. No route writes `<SocialSidebar`.

`/messages` mounts under `HomeShellLayout` (`src/App.tsx:1874`), whose rail is
`home-redesign/HomeSidebarRail.tsx` / `HomeSidebarExpanded.tsx` — the home /
AI-chat rail the report screenshots show (New chat, Portfolio, Whales, Skai
agent).

`status.wave4.social-a.tsv` reached the same verdict on the same day by an
import-graph reachability walk: `fileReachable=true` via the barrel,
`jsxSites=0`. Worth preserving from that row's history — this node was once
marked `done` on the strength of "cited in <file>", then corrected to
`NOT MEASURABLE`, then to `partial`. A citation is not a mount, and green Figma
component tests prove the component matches the frame, not that any user can
reach it.

## Not built, and gated behind a parent that is also not built

`5161-209418` (disappearing messages) and `5162-265168` (block screenshots) are
both `not-started` in `status.social.tsv`, each recorded after a search of `src/`
that returned only unrelated hits. Re-confirmed on this pass. Both are rows
inside the profile panel drawn by `5160-207895`, whose live counterpart is still
a centered dialog (`MessageDialogs.tsx`) rather than a side panel — so neither
child has an entry point until that lands.

Flag for whoever builds `5162-265168`: a web page cannot prevent an OS-level
screenshot. That control can only ever be advisory, and shipping it as though it
enforces something would be a false security signal.

## Trap notes for the next pass

- `e3984e39` asks for the empty state, but the attached "current" capture is the
  populated list. The left-pane half of `5152-203839` has never been
  photographed against the app; do not treat that attachment as a before shot.
- `4e241d2a` is titled as an add. Message requests already exist and work
  (`src/components/messaging/MessageRequestsSurface.tsx`, hosted at
  `MessageDialogs.tsx:144`). It is a restyle plus two new actions.
- `aa67f021` is smaller than its title. The dropdown items already match the
  frame exactly and in order; only the selected-row treatment and chevrons on
  `Requests` / `Settings` differ.
- `MessageRequestsSurface` lives in `src/components/messaging/`, not
  `src/components/messages/`. Shared component, different owner from its host.
