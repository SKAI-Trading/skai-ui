# figma/ — the design store: data contract (v1)

`modules/skai-ui/figma/` holds SKAI's design as data, read from the three Figma files so that a designer or a developer
needs only this package to build to the design. Figma stays the place designs are drawn; this store is the place
code reads them. Every read here costs zero Figma calls. Only `figma:sync` and the `figma:tokens` export plan Figma
calls (they print read-only scripts for `use_figma` and ingest what comes back), under a daily call budget.
[README.md](README.md) is the guide to using the store; this file is what the scripts promise.

| File | Key | What it is |
|---|---|---|
| Skai-Web-App | `3sSzw1KewMtUbeLAv7uW0r` | web app, 13 pages |
| Skai-Web-App-2 | `mhF3BkzlTaGiLzJ7kvpmVc` | web app continuation, 7 pages |
| Skai-Games | `M6r9FEn042UWTQD1zvy6GM` | games, 31 pages |

The frames tracked are the catalog's (`figma-catalog/registry.json`): every registry frame that is not `gone`, has a
page, and whose page is not ruled out of scope in `figma-catalog/pages.json`. The catalog says whether a frame is
built; this store says what the frame IS.

## Layout

```
figma/
  SCHEMA.md                   this contract
  README.md                   the guide: find a frame, read a spec, use tokens, run a sync
  store/<fileKey>/<node>.json one frame spec per catalogued frame; <node> uses "-" (7710-91527.json),
                              and an instance path's ";" becomes "_"
  store/<fileKey>/<node>/<part>.json   the split-off parts of a frame over 60 KB (see Depth), named the same way
  store/index.json            every stored frame and part: page, name, size, hash, syncedAt, bytes, path (+ stale, partOf)
  store/sync-state.json       sync's working state: each frame's last live hash, transfers part-way
  tokens/variables.json       every variable of the library file, plus any the frames use that it lacks, resolved,
                              and the collections they come from
  tokens/text-styles.json     every text style of the library file (+ any the frames use that it lacks), resolved
  tokens/effect-styles.json   every effect style (shadows, blurs), the same way
  tokens/paint-styles.json    every paint style (colours, gradients), the same way
  tokens/grid-styles.json     every layout-grid style, the same way
  tokens/sources.json         where the tokens came from: the library read, per-file walk coverage, use counts
  tokens/DRIFT.md             generated report: each Figma token against every token source in the code
  assets/manifest.json        exported icons and images: node -> file (reserved: no CLI writes assets/ yet)
  assets/icons/*.svg, assets/images/*.{png,webp}
  ledger/calls.jsonl          one line per Figma call the CLIs made, sync and tokens alike (see the budget)
  lib/                        shared code: canonical.mjs (canonical JSON, FNV-1a 64), plugin-builder.js (the spec
                              builder and drivers that run inside Figma), pack.mjs (tracked set, planning, scripts),
                              ledger.mjs, render.mjs (figma:spec output), tokens-*.mjs; fixtures/ for the self-tests
  lib/TRANSPORT.md            how a script and its result travel through use_figma, and the 20 KB result cut
  sync.mjs  read.mjs  tokens.mjs   the three CLIs (npm run figma:sync | figma:spec | figma:find | figma:tokens)
```

Everything under `store/`, `tokens/`, `assets/` and `ledger/` is written ONLY by the scripts. Never edit it by hand.

## Frame spec (`store/<fileKey>/<node>.json`)

```jsonc
{
  "v": 1,
  "fileKey": "mhF3BkzlTaGiLzJ7kvpmVc",
  "node": "7710:91527",
  "page": "✅ Trade 1",
  "name": "Skai > Trade > Spot 1VH (1440 x 900px)",
  "hash": "a1b2c3d4e5f60718",      // fnv1a-64 hex of the canonical tree (see Hashing)
  "syncedAt": "2026-09-24T08:00:00Z",
  "tree": { /* Node */ }
}
```

A split part's spec (see Depth) has the same header, its `name` is the part's layer name, and it adds
`"partOf": "<frame key>"`. The file is written a header field per line, then the tree one node per line, each child
one space deeper than its parent, with LF line endings, so a sync's diff reads node by node. Parse it as JSON; do
not depend on that layout.

### Node (compact keys; a key is OMITTED when it holds its default)

| key | meaning | default |
|---|---|---|
| `id` | node id (`7710:91528`) | required |
| `t` | Figma type: FRAME, GROUP, TEXT, RECTANGLE, ELLIPSE, LINE, VECTOR, BOOLEAN_OPERATION, INSTANCE, COMPONENT, COMPONENT_SET, SECTION | required |
| `n` | layer name | required |
| `b` | `[x, y, w, h]` relative to the parent, rounded to 0.5; the frame's own root is `[0, 0, w, h]`, so moving a frame on the canvas does not change its hash. A child of a GROUP is placed relative to the group, not to the frame Figma measures it in | required |
| `vis` | `false` when hidden | visible |
| `op` | opacity | 1 |
| `l` | auto-layout: `{m, g, p, ai, jc, wrap, sx, sy, abs}` | no auto-layout |
| `r` | corner radius: number, `[tl,tr,br,bl]`, or a token | 0 |
| `f` | fills: `[Paint]` | none |
| `s` | strokes: `[Paint]`, with `sw` stroke weight and `sa` align (INSIDE, OUTSIDE, CENTER) | none |
| `fx` | effects: an effect-style name, or `[Effect]` | none |
| `clip` | `true` when it clips content | false |
| `tx` | text: `{c, st, ff, fs, fw, lh, ls, ta, tc, td}` | not text |
| `ci` | instance: `{k, n, set, props}` (component key, name, set name, variant props) | not an instance |
| `c` | children `[Node]` | none |
| `ref`, `h` | in place of a whole node: a split-off subtree, `{"ref": "<node>", "h": "<part hash>"}` and no other key (see Depth) | not split |

`l` in full: `m` layout mode `H` | `V` | `G` (grid); `g` item spacing; `p` padding `[t, r, b, l]`; `ai` counter-axis
align (`MIN` `CENTER` `MAX` `BASELINE`); `jc` primary-axis align (`MIN` `CENTER` `MAX` `SPACE_BETWEEN`); `wrap` true
when wrapping; `sx` / `sy` the node's own sizing inside its parent (`FIXED` `HUG` `FILL`); `abs` true when absolutely
positioned inside an auto-layout parent.

`tx` in full: `c` characters (cut at 500 with a trailing `…`); `st` the text-style NAME when one is applied (then
`ff/fs/fw/lh/ls` are omitted unless overridden); `ff` family, `fs` size, `fw` weight, `lh` line height (px, or `"auto"`),
`ls` letter spacing (as Figma reports it); `ta` alignment; `tc` case; `td` decoration. Mixed-style text gives `seg`:
`[{c, st | ff/fs/fw…, f}]` in order.

### Values are TOKENS first

Wherever Figma binds a property to a variable or style, the spec writes the variable or style NAME, not the value:
`"g": "s-4"`, `"r": "rounded-xl"`, `"f": ["Primary/Green Coal 200"]`, `"st": "Lg/Paragraph 2 300"`. Only an unbound
value is written raw (`16`, `"#052D2D"`). A raw value in a spec is itself a finding: the design did not use the system.
Resolve any name through `tokens/`.

### Paint

A string for a solid: a token name or `#RRGGBB`, with `@<opacity>` when the paint's opacity is below 1
(`"#FFFFFF@0.64"`). An object otherwise: `{"grad": "LINEAR" | "RADIAL" | "ANGULAR" | "DIAMOND", "stops": [[pos, paint]], "angle": deg}`;
`{"img": "<imageHash>", "scale": "FILL" | "FIT" | "CROP" | "TILE"}`; `{"video": "<hash>"}`. A gradient or image paint below
full opacity adds `"op"`. A paint style is written as its style name. A hidden paint is dropped. A variable or style
that Figma could not resolve is written as its id (`VariableID:…`, `S:…`), never as a guessed value.

### Effect

`{"t": "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR", "c": paint, "o": [x, y], "r": radius, "sp": spread}`.

### Depth

Full depth down to 80 levels below the frame (anything deeper is dropped), except: VECTOR, BOOLEAN_OPERATION and STAR
keep `b`, `f` and `s` but no children; an INSTANCE keeps its `ci` and its children only when its content differs from
the main component (overrides), otherwise no children.

A frame spec whose canonical JSON is over 60,000 characters after that is split. Its largest child subtrees, largest
first and never one under 4,000 characters, become `{"ref": "<node>", "h": "<part hash>"}` until the frame fits; a cut
subtree still over the size is split the same way, so a part can hold refs of its own. Every part of a frame, at any
level, is stored in the frame's directory, `store/<fileKey>/<frameNode>/<childNode>.json`, indexed as
`<fileKey>:<frameNode>/<childNode>` with `"partOf": "<frame key>"` (the frame, never the part holding the ref). Not
beside the frame: a cut child can itself be a catalogued frame, whose own spec (root `b` zeroed) differs from the part,
which keeps its `b` relative to its parent. The ref carries the part's hash, so a change inside a part still changes
the frame hash. When a frame is extracted again, a part its new cut no longer has is deleted, file and index entry.

## Hashing

`hash` = FNV-1a 64-bit (hex) of the canonical JSON of `tree`: keys sorted, no whitespace, `syncedAt` excluded at any
depth. For a split frame that is the tree with its refs in place; each part's hash is the hash of its own tree. The
SAME builder runs inside Figma (the sync's hash pass returns only `{node: hash}`, so change detection costs no
extraction) and in Node (to verify a stored spec: `npm run figma:sync -- verify <frame key>` prints the index hash, the
file's hash and the hash recomputed from the file). A frame is extracted only when it is missing from
`store/index.json` or its entry is stale.

## store/index.json

```jsonc
{ "v": 1, "syncedAt": "...", "frames": {
  "mhF3BkzlTaGiLzJ7kvpmVc:7710:91527": { "page": "✅ Trade 1", "name": "...", "w": 1440, "h": 900,
    "hash": "a1b2c3d4e5f60718", "syncedAt": "...", "bytes": 18234, "path": "store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527.json" },
  "mhF3BkzlTaGiLzJ7kvpmVc:7710:91527/7710:91600": { "page": "✅ Trade 1", "name": "Order book", "w": 1064, "h": 836,
    "hash": "...", "syncedAt": "...", "bytes": 9120, "path": "store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527/7710-91600.json",
    "partOf": "mhF3BkzlTaGiLzJ7kvpmVc:7710:91527" } } }
```

Keyed `<fileKey>:<node>` in colon form; a part is `<frame key>/<part node>`. `bytes` is the spec file's size, `path` is
relative to `figma/`, `w`/`h` are the frame's size (a part's are its own `b`). The top `syncedAt` is the last extract
that stored a frame. The file is written one entry per line, keys sorted.

### Stored, stale, missing

These are the three states of a tracked frame, and every reader means the same thing by them:

- **stored**: the frame has an index entry (a part entry never counts as a frame). A reader that opens the spec also
  checks the file is there; an entry whose file is gone reads as not stored.
- **stale**: the entry holds `"stale": true`. A hash pass (`hash-ingest`) sets it when the frame's live hash differs
  from the entry's `hash`, and when the pass reports the node missing from Figma (then `sync-state.json` records it
  `gone`). A later hash pass whose live hash equals the stored one again removes the flag, and extracting the frame
  rewrites the entry without it. A stale spec is still the last design sync read, so readers print it with a warning.
- **missing**: no index entry.

`npm run figma:sync -- status` counts all three per file, plus split part files, stored frames the catalog no longer
tracks, transfers part-way, and today's calls.

## store/sync-state.json

Sync's working state, written only by sync; a reader of designs never needs it.

```jsonc
{ "v": 1,
  "partial": { "<frame key>": { "H": "<live frame hash>", "T": 1645, "pg": "<page>", "n": "<name>", "w": 1440, "h": 900,
                                "x": [ /* the items received so far */ ], "calls": 1, "oversize": true } },
  "live": { "<frame key>": { "h": "<hash>", "at": "..." }, "<frame key>": { "gone": true, "at": "..." } } }
```

`live` is the last live hash sync saw for each frame, from a hash pass or a completed extract, or `gone` when a hash
pass found no such node. `partial` is a frame too big for one result, arriving over several calls: `H` is the live hash
the transfer started at, `T` how many items the frame streams, `x` the items so far. The item format, and how a
transfer continues or restarts, are in [lib/TRANSPORT.md](lib/TRANSPORT.md). A transfer projected to need more than 12
calls is parked with `"oversize": true` and is not planned again until it is named with `--nodes`.

## Fetching one frame

```
npm run figma:sync -- extract-script --file <fileKey> --nodes <node>
```

plans a script for exactly that frame (a parked transfer named this way continues where it stopped). Run the printed
script with `use_figma` on that file, save the result exactly as returned, then
`npm run figma:sync -- extract-ingest <result.json>`. `figma:spec` prints these steps for a frame that is not stored or
is stale. Without `--nodes`, `extract-script` takes the next stale or missing frames, the catalog worklist's packets
first. [lib/TRANSPORT.md](lib/TRANSPORT.md) says how the script and its result travel.

## tokens/

`variables.json`: `{ "v": 1, "syncedAt": "...", "variables": { "<name>": { "id", "key", "collection", "type": "COLOR" |
"FLOAT" | "STRING" | "BOOLEAN", "modes": { "<modeName>": value }, "remote": true, "scopes": [...] } } }`. COLOR values
are `#RRGGBB` or `#RRGGBBAA`; an alias is `{"alias": "<name>"}`. Keyed by NAME because specs cite names; a name that is
not unique across collections is keyed `<collection>/<name>`.

`text-styles.json`: `{ "<name>": { "ff", "fs", "fw", "lh", "ls", "tc", "td", "key", "remote" } }`.
`effect-styles.json`: `{ "<name>": { "effects": [Effect], "key", "remote" } }`.

Added by the tokens export (2026-09-24), all additive:

- `variables.json` also holds `"collections": { "<name>": { "key", "remote", "modes": [...], "variables": n, "seenIn":
  [fileKey], "library": { "file", "fileName", "proof" } } }`. `library.file` is set only when the collection's key is a
  LOCAL collection of that file (checked by reading the library file itself); otherwise it is `null`. A variable may
  carry `"codeSyntax": {"WEB": "..."}` when the library sets one.
- `paint-styles.json`: `{ "<name>": { "paints": [Paint], "key", "remote" } }`. In these files every colour but
  White and Black is a paint style, and specs cite paint styles by name, so this is what resolves a colour.
- A text style may carry `"bv": { "<field>": "<variable name>" }` for a variable bound on the style. `fw` is the weight
  number read from the font style (`"Regular"` is 400); an italic style is `"300 italic"`; an unknown style stays text.
  `lh` is px or `"auto"` or `"N%"`, `ls` is px or `"N%"`, both as Figma reports them.
- A style name shared by two styles (two keys) is keyed `<name> #<first 6 of key>`.
- `sources.json`: `{ "v": 1, "runs": { "<fileKey>": { fileName, pages: { "<pageId>": {walked, children} }, passes,
  coverage, complete, usesInWalkedFrames: { "<key>": n } } }, "library": { file, fileName, localCollections,
  localCounts, keys, match } }`. A walk may sample every Nth frame, so `complete` is true only when every tracked page
  was walked to its last top-level frame; use counts are counts in the frames walked, not in the file. A run also
  records `calls`, `frames`, `nodes`, `ms`, `plannedPages`, `startedAt`, `updatedAt` and `truncated`; `library` also
  records `checkedAt`, `collectionsMatched`, `keysCut` and a `note`.
- `DRIFT.md` is written by `figma:tokens -- diff` and changes no token source.
- Tokens ledger lines are `kind: "tokens"` and carry the result's checksum as their `nonce`.

Added by the library read (2026-09-24), all additive:

- The token SET comes from the library file itself (`TyX8YAtNDEIvsnSLQ3IXId`, Skai-Design): `figma:tokens --
  library-script` / `library-ingest` (result kind `tokens-library/1`) read every local collection, variable and text,
  paint, effect and grid style, with values, in parts under the 20 KB cut (`--from N` continues; the cursor and counts
  are inside the checksum). The frame walk (`export-*`) adds use counts and any token the library lacks.
- `grid-styles.json`: `{ "<name>": { "grids": [Grid], "key", "remote" } }`, Grid = `{ "pattern", "alignment",
  "gutterSize", "count", "sectionSize", "offset", "c", "bv" }` as Figma names them, each only when Figma sets it;
  `count` is `"auto"` for Figma's Infinity; a hidden grid is dropped. Written once any grid style is stored.
- An entry may carry, each only when it holds: `"notInLibrary": true`, a token the frame walk found that the library
  file does not define (set only from the library's whole key list, never from a cut one); `"hiddenFromPublishing":
  true` (variables); `"publish": "UNPUBLISHED" | "CHANGED"`, the library's publish status when it is not CURRENT, since
  the product files see a library token as last published. A status use_figma could not read writes no mark:
  `getPublishStatusAsync` is not a function on styles in use_figma (measured 2026-09-24), so no style carries one.
- `remote` is `true` for every library token, including one only the library read found: it is the product files'
  view (they read it from the library).
- A variable's `id` is per file. It is the id the walk saw in a product file (`VariableID:<key>/<n>`, where `<n>` is
  that file's own number for its imported copy) or, for a variable only the library read found, the library's own
  (`VariableID:<n>`). No id is built from a key and another file's number. Match a spec's unresolved
  `VariableID:<key>/…` to a token by the key inside it.
- `sources.json` `export`: `{ "method": "library-read", "source", "sourceName", "complete", "why": [...], "total",
  "counts", "parts": [{ from, n, sum, at, pub, items, gridRead }], "got", "perCol", "added", "same", "changes": [{ kind,
  name, field, was, now }], "publish": { read, of, complete, unread, unreadVariables, errors }, "externalAliases",
  "bad", "provenanceCheck" }`. `complete` is true only when parts read in order from row 0 cover every row the library
  listed, the distinct keys read per kind equal the library's counts (a rename between calls can repeat one row and
  skip another while the rows still add up), each collection's variable count is met, grid styles were read and no
  item failed to read; `why` says what is missing otherwise. `changes` lists each field where a token the walk had stored differs from the library's
  definition (the library's is written). `variables.json` carries `"export": { complete, source, sourceName, method,
  at }` from it. After a complete read, `library` is rebuilt from it (`method` says so, `localCounts.grid` added, key
  lists from the full keys) and `provenanceCheck` compares it with the previous key lists.
- `DRIFT.md` states whether the set is complete and where it came from, marks walk-only tokens in their rows, and
  lists computed checks on the Figma set itself (several variables claiming one code-syntax name, a line height below
  its font size, a spacing step off the scale's own 4 x N rule, modes named only "Mode N").

## ledger/calls.jsonl and the budget

Every Figma call is appended BEFORE its result is ingested, one JSON object per line:

```jsonc
{"at": "2026-09-24T08:17:42.289Z", "day": "2026-09-24", "kind": "extract", "file": "mhF3BkzlTaGiLzJ7kvpmVc",
 "calls": 1, "frames": 1, "nonce": "4333afed9740", "ok": true}
```

- `day` is the UTC day. `kind` is `"hash"` | `"extract"` (sync), `"tokens"` (the tokens export and its library check),
  or `"assets"` (reserved). `frames` is how many frames the result carried.
- `nonce` is the one the script was given (sync) or the result's checksum (tokens). `ok` is false when the result was
  refused, e.g. damaged in transcription: the call still counts. A second ingest of a refused result writes
  `"calls": 0`; a result already ingested is never counted twice.
- A call that returned nothing to ingest (an error, a result cut at 20 KB) is counted by hand with
  `npm run figma:sync -- record-call --kind <kind> --file <fileKey> [--note <text>]` (or
  `npm run figma:tokens -- ledger-failed --file <fileKey> [--note <text>]`), which writes `"calls": 1, "frames": 0,
  "ok": false` and the note.
- Lines written before the ledger was shared may carry `sum` instead of `nonce`, or `failed: true`; readers take a
  `sum` as the nonce.

A line that does not parse counts as one call, against every day. The daily cap (default 120, `FIGMA_DAILY_BUDGET`, a
whole number) sums `calls` over the UTC day's lines; every command that plans a call refuses to plan past it (sync
exits 3) and says how many calls remain. The Figma account allows 200 read calls a day, 15 a minute, shared by every
session.

## What reads this, and what never does

- Lanes, developers and designers read specs, tokens and assets from here. A lane never calls Figma to learn a design.
- The catalog (`figma-catalog/`) links a frame to its spec by the same `<fileKey>:<node>` key. `figma-catalog/worklist.mjs`
  reads `store/index.json` to give each worklist row its spec path and its stored / stale / missing state.
- `sync.mjs extract-script` reads the worklist's packet order to choose what to fetch first; nothing in `figma/` writes to
  `figma-catalog/`.
- Nothing in `src/` imports `figma/`: it is design data, not shipped code, and is not in the package's `files`.
