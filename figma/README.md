# The design store

`figma/` holds SKAI's designs as data, so a designer or a developer with only this package can build to the design.
Figma is where designs are drawn. This store is what code reads. Reading it costs no Figma call and needs no Figma
account.

The data contract (every file, every field) is [SCHEMA.md](SCHEMA.md). This page is the guide to using it.

## What it is, and what it is not

It is:

- **Frame specs.** One JSON file for each catalogued Figma frame a sync has fetched, under `store/`. A spec is the
  frame's layer tree:
  each layer's type, name, position and size, auto-layout, radius, fills, strokes, effects, text and component
  instance. A value the designer bound to the design system is written as the token's name, not its number.
- **Tokens.** The Skai-Design library's variables and text, paint, effect and grid styles, under `tokens/`, with their
  values.
- **A call ledger.** `ledger/calls.jsonl` has one line for every Figma call the scripts made, which is how the daily
  budget is kept.

It is not:

- **Not complete yet.** Only the frames a sync has fetched are stored. `npm run figma:sync -- status` gives the count
  (when this was written: 3 stored of 4,786 tracked). A frame that is not stored says so, and prints the command
  that fetches it.
- **Not a place to design.** A design change is made in Figma and reaches the store through a sync. Nothing under
  `store/`, `tokens/` or `ledger/` is edited by hand.
- **Not the build status.** Whether a frame is built in the app lives in the catalog (`../figma-catalog/`, statuses
  `done`, `partial` and so on). The store says what a frame IS; the catalog says whether it is built.
- **Not shipped code.** Nothing in `src/` imports `figma/`, and it is not in the package's published files.
- **Not images.** `assets/` (icons and images) is reserved in the contract, but nothing writes it yet.

## Quick start

Run these from `modules/skai-ui`. The `--` hands the rest of the line to the script.

```bash
npm run figma:find -- input voice               # which frame? (title words, a file, a route, a page)
npm run figma:spec -- 2745:3552                 # what does that frame look like?
npm run figma:tokens -- get s-5                 # what is that token?
npm run figma:sync -- status                    # how much is stored, and how many Figma calls are left today
```

## Find a frame

`figma:find` searches the catalog's frames and says, for each one, whether its spec is stored.

By title words (every word must appear in the title):

```text
$ npm run figma:find -- input voice
mhF3BkzlTaGiLzJ7kvpmVc:2745:3552 · ✅ Home 1 · Input w/o voice · 680 · done · stored · store/mhF3BkzlTaGiLzJ7kvpmVc/2745-3552.json
1 frame(s): 1 stored (0 stale), 0 not stored
```

Each line is: the frame key (`<fileKey>:<node>`), the Figma page, the frame's title, its width, its catalog status,
whether the spec is stored, and the spec's path under `figma/`.

Other ways in:

| You have | Run |
|---|---|
| the file you are editing | `npm run figma:find -- --file AskComposer.tsx` (a file name or a trailing part of its path; `pot.tsx` does not match `Spot.tsx`) |
| a route | `npm run figma:find -- --route /trade/perps --width 1440` (matches inside the catalog's route) |
| a Figma page | `npm run figma:find -- --page crash` |
| a node id or a Figma link | `npm run figma:find -- 2745-3552` |
| only stored, missing or stale frames | add `--stored`, `--missing` or `--stale` |
| a catalog status | add `--status partial,not-started` |

`--limit N` caps the list (default 50; `--limit 0` lists every hit) and `--json` prints the hits as JSON. It exits 0
with hits and 1 with none.

In Git Bash on Windows, an argument that starts with `/` is rewritten into a Windows path before the script sees it,
so `--route /trade/perps` finds nothing there. Leave the slash off (`--route trade/perps` matches the same frames) or
set `MSYS_NO_PATHCONV=1`. PowerShell and other shells pass it through unchanged.

The catalog's worklist carries the same state for every frame it lists: `npm run catalog:worklist -- --out <dir>`
writes `worklist.md` and `worklist.tsv` there, and each row names its spec (`stored`, `stale` or `missing`) and the
spec's path. Write them outside the repo, or do not commit them: they are derived.

## Read a spec

`figma:spec` takes a frame key, a bare node id, a Figma link (quote it: it holds `&`) or title words, and prints the
stored spec as an indented tree, one layer per line. This is a real stored frame, the home page's ask box without a
voice button:

```text
$ npm run figma:spec -- 2745:3552
Input w/o voice
  key      mhF3BkzlTaGiLzJ7kvpmVc:2745:3552
  page     ✅ Home 1 · 680×126
  catalog  home · done · route / (AiHome composer) and the conversation view composer · src/components/home-redesign/AskComposer.tsx
  spec     store/mhF3BkzlTaGiLzJ7kvpmVc/2745-3552.json · synced 2026-09-24T08:17:42.289Z · hash 7e979e19fd8336df
  figma    https://www.figma.com/design/mhF3BkzlTaGiLzJ7kvpmVc/Skai-Web-App-2?node-id=2745-3552&m=dev

FRAME "Input w/o voice" 2745:3552 [0 0 680×126] · V gap s-8 (32) pad s-5 (20) h HUG · r 24 (raw) · fill #052D2D (raw) · fx Input hint (dark) (drop-shadow 0,4 blur 12 #000000@0.24) · clip
  TEXT "Ask anything..." 2745:3553 [20 20 640×22] · op 0.44 · "Ask anything..." Lg/Paragraph 1 300 (Manrope 16/22 w400 ls -4%) · w FILL h HUG · fill Core/White (#FFFFFF)
  FRAME "bottom" 2745:3554 [20 74 640×32] · H gap 447 (raw) ai CENTER jc SPACE_BETWEEN w FILL h HUG
    FRAME "Frame 254" 2745:3555 [0 0 32×32] · H gap s-3 (12) ai CENTER w HUG h HUG
      FRAME "Frame 197" 2745:3556 [0 0 32×32] · H gap 10 (raw) pad s-2 (8) ai CENTER w HUG h HUG · r border-radius/rounded-lg (8) · stroke Primary/Green Coal 100 (#123F3C) 1 CENTER
        INSTANCE "icons/action" 2745:3557 [8 8 16×16] · inst icons/action {Size=16px, Type=Add} · clip
          BOOLEAN_OPERATION "icon" I2745:3557;1442:1846 [1 1 14×14] · fill Core/White (#FFFFFF)
      FRAME "cost" 2745:3558 [44 9 223×14] · hidden · H gap s-6 (24) ai CENTER w HUG h HUG
      ...
    FRAME "right" 2745:3565 [608 0 32×32] · H gap 7 (raw) ai CENTER w HUG h HUG
      FRAME "Frame 199" 2745:3566 [0 0 32×32] · hidden · H gap 10 (raw) pad s-2 (8) ai CENTER w HUG h HUG · r border-radius/rounded-lg (8) · stroke Primary/Green Coal 100 (#123F3C) 1 CENTER
        INSTANCE "icons/action" 2745:3567 [8 8 16×16] · inst icons/action {Size=16px, Type=Voice} · clip
      FRAME "Frame 198" 2745:3568 [0 0 32×32] · H gap 10 (raw) pad s-2 (8) ai CENTER w HUG h HUG · r border-radius/rounded-lg (8) · fill Primary/Green Coal 300 (#001615)
      ...

nodes 20 · text 5 · hidden 2 · raw 7
```

(Two runs of layers are cut here, marked `...`; the command prints all 20.)

How to read a line:

- `FRAME "bottom" 2745:3554` is the layer's type, its name in Figma and its node id.
- `[20 74 640×32]` is x and y relative to the parent layer, then width × height. The frame itself is always at `0 0`.
- `V gap s-8 (32) pad s-5 (20)` is auto-layout: `V` vertical or `H` horizontal, the gap between children, the padding.
  `ai` and `jc` are the cross-axis and main-axis alignment; `w FILL h HUG` is how the layer sizes itself in its parent.
- `r` is the corner radius, `fill`, `stroke` and `fx` (effects) are what they say, `op` is opacity, and `clip` means it
  clips its content.
- `inst icons/action {Size=16px, Type=Add}` is an instance of a component, with its variant properties.
- `hidden` means the designer hid the layer. It is not drawn. Here the cost row (`Frame 254 > cost`) and the
  microphone button (`Frame 199`) are both hidden, so the box shows one button on the right, the send button.

Two things this frame shows that are worth knowing:

- **A gap under `SPACE_BETWEEN` is not the drawn space.** The `bottom` row's `H gap 447` is the number Figma keeps,
  but `jc SPACE_BETWEEN` spreads the children to the row's ends, so the space between them is 640 − 32 − 32 = 576.
  Build the alignment, not the number.
- **`op 0.44` on placeholder text** is the placeholder colour: white at 44%, not a separate grey.

Options:

| Option | What it does |
|---|---|
| `--depth N` | stop N levels below the frame (`--depth 0` prints the frame alone); the footer counts the child layers it left out |
| `--node <id>` | print one layer and what is under it, e.g. `--node 2745:3568` |
| `--flat` | one line per text layer, with its style, fill, id and path of parent names |
| `--json` | print the stored file as it is (with `--node`, just that layer) |

`figma:spec` exits 0 when it prints a spec, 1 when nothing matches, 2 when several frames match (it lists them, so
name one by its key) and 3 when the frame is not stored. A frame that is not stored prints its catalog row and the
command that fetches it:

```text
$ npm run figma:spec -- 7710:91527
...
NOT STORED: there is no spec at store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527.json yet.
read.mjs never calls Figma. To fetch this frame (Figma calls, counted against the daily budget):
  npm run figma:sync -- extract-script --file mhF3BkzlTaGiLzJ7kvpmVc --nodes 7710:91527
  (run the printed script with use_figma, save its result as JSON, then)
  npm run figma:sync -- extract-ingest <result.json>
```

A stale spec (Figma changed after it was stored) still prints, with a `STALE:` warning and the same fetch command
above the tree.

The file itself is `store/<fileKey>/<node>.json`, with `:` in the node id written as `-`. It is JSON with short keys
(`t` type, `n` name, `b` box, `l` auto-layout, `f` fills, `c` children and so on), listed in
[SCHEMA.md](SCHEMA.md#frame-spec-storefilekeynodejson). A frame over 60 KB is split: some subtrees are stored as their
own files in the frame's folder and `figma:spec` joins them back in.

## Raw values and token names

Wherever the designer bound a property to the design system, the spec holds the token's NAME. `figma:spec` prints the
name with its value in brackets:

- `pad s-5 (20)`: padding bound to the spacing variable `s-5`, which is 20 px.
- `r border-radius/rounded-lg (8)`: radius bound to `border-radius/rounded-lg`, 8 px.
- `fill Primary/Green Coal 300 (#001615)`: a paint style.
- `Lg/Paragraph 1 300 (Manrope 16/22 w400 ls -4%)`: a text style, as family, size / line height, weight, letter
  spacing.

Build these with the code's token for that name, not with the number.

A value marked `(raw)` is one the designer typed in where the system has a token: `r 24 (raw)` and
`fill #052D2D (raw)` on this frame's box, `H gap 447 (raw)` on its row. Build the value, and treat it as a finding:
the design did not use the system there. Do not invent a token for it; ask the designer whether it should be one.

Two more marks: `name (?)` is a token the store's `tokens/` does not hold, and `(→ Other/Name #hex)` is a variable that
points at another variable.

In the JSON, a bound value is the token's name as a string (`"g": "s-8"`, `"f": ["Core/White"]`) and a raw value is
a number or a `#RRGGBB` colour (`"r": 24`, `"f": ["#052D2D"]`). An `@0.64` on the end of a paint is its opacity.

## Tokens

The tokens come from the Skai-Design library file (`TyX8YAtNDEIvsnSLQ3IXId`), read from that file itself, plus any
token a frame uses that the library lacks (marked `notInLibrary`).

```text
$ npm run figma:tokens -- get s-5
s-5  [variable FLOAT, collection Spacing]  key b77bf2c2d6655e27856f1c00d84be8c714706c6d (library)
  Mode 1: 20
  scopes: GAP

$ npm run figma:tokens -- get border-radius/rounded-lg
border-radius/rounded-lg  [variable FLOAT, collection Primatives]  key b117d82f9ef70f47e7ff9595119acb9292ba3b0a (library)
  Mode 1: 8
  Mode 2: 8
  scopes: CORNER_RADIUS
  code: rounded-lg

$ npm run figma:tokens -- get "Lg/Paragraph 1 300"
Lg/Paragraph 1 300  [text-style]  key 8edaf6582cc52e4f4d5f4c58c1ebfd25c224fc52 (library)
  Manrope 16px weight 400, line-height 22, letter-spacing -4%, case ORIGINAL, decoration NONE
```

`code:` is the code name the library gives a variable, where it gives one. `get` tries the exact name first, then any
name containing what you typed (`get "Green Coal 300"` finds `Primary/Green Coal 300`), and exits 1 when nothing
matches.

| Command | What it does |
|---|---|
| `npm run figma:tokens -- list` | every token, one line each with its value |
| `npm run figma:tokens -- list --collection Spacing` | one collection; the styles list as `text styles`, `paint styles` and so on |
| `npm run figma:tokens -- list --type COLOR` | one type: COLOR, FLOAT, STRING, BOOLEAN, TEXT, EFFECT or PAINT |
| `npm run figma:tokens -- status` | how many tokens, where they came from, whether the library read is complete |
| `npm run figma:tokens -- diff` | writes `tokens/DRIFT.md`: every Figma token against every token source in the code |

`diff` changes no source file; it only writes the report. The token files themselves are described in
[SCHEMA.md](SCHEMA.md#tokens).

## Sync: bringing Figma into the store

Only this step touches Figma, and it needs someone with Figma access to run `use_figma`. The scripts never call
Figma themselves: each `*-script` command prints a read-only script, you run it with `use_figma` on the file it names,
save what comes back exactly as given, and hand it to the matching `*-ingest` command.

### The budget

- The store allows **120 Figma calls a day** (UTC) by default; `FIGMA_DAILY_BUDGET` changes it. The Figma account
  itself allows 200 a day and 15 a minute, shared by everyone.
- Every call is written to `ledger/calls.jsonl` before its result is used, so a crash cannot hide one.
- Every `*-script` command refuses to plan a call past the budget (sync exits 3) and says how many are left.
- `status` shows the count. This is the store on 2026-09-24:

```text
$ npm run figma:sync -- status
tracked   4786  (mhF3 1820 · 3sSz 2048 · M6r9 918)
stored    3  stale 0  missing 4783  (+0 split part files, 0 stored frames no longer tracked)
  mhF3BkzlTaGiLzJ7kvpmVc  stored 1/1820  stale 0  missing 1819
  3sSzw1KewMtUbeLAv7uW0r  stored 0/2048  stale 0  missing 2048
  M6r9FEn042UWTQD1zvy6GM  stored 2/918  stale 0  missing 916
transfer  1 frame(s) part-way, parked as oversize: mhF3BkzlTaGiLzJ7kvpmVc:7710:91527
live      107 frame(s) with a live hash on record
calls     14 of 120 spent on 2026-09-24 (UTC), 106 left
```

### Fetch one frame

```bash
npm run figma:sync -- extract-script --file mhF3BkzlTaGiLzJ7kvpmVc --nodes 2745:3552 --out <dir>
# run the script it wrote with use_figma on that file, save the result as JSON, then
npm run figma:sync -- extract-ingest <result.json>
```

Without `--out` the script goes to the system temp folder; `--print` writes it to the screen instead. The ingest
writes the spec and its line in `store/index.json`. Without `--file` and `--nodes`, `extract-script` takes the next
batch of stale and missing frames, the catalog worklist's packets first.

A frame too big for one result comes over several calls: run `extract-script` again and it carries on where the last
result stopped. A frame that would need more than 12 calls is parked; name it with `--nodes` to carry it on anyway.

### Find what changed

```bash
npm run figma:sync -- hash-script --file M6r9FEn042UWTQD1zvy6GM --out <dir>
# run each script with use_figma, then
npm run figma:sync -- hash-ingest <result.json>
```

A hash pass asks Figma for one short fingerprint per frame instead of the frame itself, so it is cheap (a file's 918
frames plan as 2 scripts). A stored frame whose fingerprint moved is marked stale, and the next `extract-script` picks
it up.

### When something goes wrong

- **A result was mis-copied.** The ingest refuses it, names the lines that no longer match their checks (for example
  `segment 0 (10:1) line 0 of 1`), and still counts the call. Copy it again exactly and ingest again; the second
  ingest is not counted twice.
- **A result came back cut** (use_figma keeps only the first 20 KB of a result) or a call returned nothing usable:
  count the call by hand, then plan a smaller batch.

  ```bash
  npm run figma:sync -- record-call --kind extract --file <fileKey> --note "result cut at 20 KB"
  ```

- **You want to check a stored spec**: `npm run figma:sync -- verify <fileKey>:<node>` recomputes its fingerprint from
  the file and prints it beside the index's.

How a script's result is packed to fit under the 20 KB cut, and how each part of it is checked, is in
[lib/TRANSPORT.md](lib/TRANSPORT.md). Tokens are synced by `figma:tokens -- library-script` and `library-ingest`
(the library read), under the same budget and ledger.

## Rules

- **Never edit `store/`, `tokens/`, `ledger/` or `assets/` by hand.** The scripts write them. Every spec carries a
  fingerprint of its own content, so a hand edit either breaks that check or quietly stops matching Figma.
- **Figma is where design is drawn; the store is what code reads.** To change a design, change it in Figma, then
  sync.
- **Nobody, person or agent lane, calls Figma to learn a design.** Read the store. When a frame is missing or stale,
  fetch it with the sync, under the budget, and from then on everyone reads the stored copy.
- **Every Figma call goes in the ledger**, including one that failed.
- **Scripts only read.** Nothing in a sync script creates, changes or deletes anything in Figma.

## See also

- [SCHEMA.md](SCHEMA.md): the contract for every file here.
- [lib/TRANSPORT.md](lib/TRANSPORT.md): how results travel out of Figma.
- [tokens/DRIFT.md](tokens/DRIFT.md): Figma's tokens against the code's.
- [../figma-catalog/](../figma-catalog/): which frames are tracked, and whether each one is built.
- Every CLI has a self-test that runs without Figma: `node figma/sync.mjs --self-test`, `node figma/read.mjs --self-test`,
  `node figma/tokens.mjs --self-test`.
