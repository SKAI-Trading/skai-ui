# figma/ — the design store: data contract (v1)

`modules/skai-ui/figma/` holds SKAI's design as data, read from the three Figma files so that a designer or a developer
needs only this package to build to the design. Figma stays the place designs are drawn; this store is the place
code reads them. Every read here costs zero Figma calls. Only `figma:sync` talks to Figma, under a daily call budget.

| File | Key | What it is |
|---|---|---|
| Skai-Web-App | `3sSzw1KewMtUbeLAv7uW0r` | web app, 13 pages |
| Skai-Web-App-2 | `mhF3BkzlTaGiLzJ7kvpmVc` | web app continuation, 7 pages |
| Skai-Games | `M6r9FEn042UWTQD1zvy6GM` | games, 31 pages |

The frames tracked are the catalog's (`figma-catalog/registry.json`). The catalog says whether a frame is built; this
store says what the frame IS.

## Layout

```
figma/
  SCHEMA.md                   this contract
  README.md                   how to find a frame, read a spec, use tokens, run a sync
  store/<fileKey>/<node>.json one frame spec per catalogued frame; <node> uses "-" (7710-91527.json)
  store/index.json            every stored frame: page, name, size, hash, syncedAt, bytes
  tokens/variables.json       every Figma variable the frames use, resolved
  tokens/text-styles.json     every text style the frames use, resolved
  tokens/effect-styles.json   every effect style (shadows, blurs) the frames use
  assets/manifest.json        exported icons and images: node -> file
  assets/icons/*.svg, assets/images/*.{png,webp}
  ledger/calls.jsonl          one line per Figma call sync made: {at, day, kind, file, calls}
  lib/                        shared code (the in-plugin spec builder, hashing, packing)
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

### Node (compact keys; a key is OMITTED when it holds its default)

| key | meaning | default |
|---|---|---|
| `id` | node id (`7710:91528`) | required |
| `t` | Figma type: FRAME, GROUP, TEXT, RECTANGLE, ELLIPSE, LINE, VECTOR, BOOLEAN_OPERATION, INSTANCE, COMPONENT, COMPONENT_SET, SECTION | required |
| `n` | layer name | required |
| `b` | `[x, y, w, h]` relative to the parent, rounded to 0.5 | required |
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
`{"img": "<imageHash>", "scale": "FILL" | "FIT" | "CROP" | "TILE"}`; `{"video": "<hash>"}`. A hidden paint is dropped.

### Effect

`{"t": "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR", "c": paint, "o": [x, y], "r": radius, "sp": spread}`.

### Depth

Full depth, except: VECTOR, BOOLEAN_OPERATION and STAR keep `b`, `f` and `s` but no children; an INSTANCE keeps its
`ci` and its children only when its content differs from the main component (overrides), otherwise no children. A frame
spec above 60 KB after that is split: over-large child subtrees become `{"ref": "<node>"}` and are stored as their own
`store/<fileKey>/<childNode>.json` specs.

## Hashing

`hash` = FNV-1a 64-bit (hex) of the canonical JSON of `tree`: keys sorted, no whitespace, `syncedAt` excluded. The SAME
builder runs inside Figma (the sync's hash pass returns only `{node: hash}`, so change detection costs no extraction)
and in Node (to verify a stored spec). A frame is re-extracted only when its live hash differs from `store/index.json`.

## store/index.json

```jsonc
{ "v": 1, "syncedAt": "...", "frames": {
  "mhF3BkzlTaGiLzJ7kvpmVc:7710:91527": { "page": "✅ Trade 1", "name": "...", "w": 1440, "h": 900,
    "hash": "a1b2c3d4e5f60718", "syncedAt": "...", "bytes": 18234, "path": "store/mhF3BkzlTaGiLzJ7kvpmVc/7710-91527.json" } } }
```

## tokens/

`variables.json`: `{ "v": 1, "syncedAt": "...", "variables": { "<name>": { "id", "key", "collection", "type": "COLOR" |
"FLOAT" | "STRING" | "BOOLEAN", "modes": { "<modeName>": value }, "remote": true, "scopes": [...] } } }`. COLOR values
are `#RRGGBB` or `#RRGGBBAA`; an alias is `{"alias": "<name>"}`. Keyed by NAME because specs cite names; a name that is
not unique across collections is keyed `<collection>/<name>`.

`text-styles.json`: `{ "<name>": { "ff", "fs", "fw", "lh", "ls", "tc", "td", "key", "remote" } }`.
`effect-styles.json`: `{ "<name>": { "effects": [Effect], "key", "remote" } }`.

## ledger/calls.jsonl and the budget

Every Figma call sync makes is appended BEFORE its result is ingested: `{"at": ISO, "day": "YYYY-MM-DD" (UTC),
"kind": "hash" | "extract" | "tokens" | "assets", "file": fileKey, "calls": 1, "frames": n}`. The daily cap (default
120, `FIGMA_DAILY_BUDGET`) counts every line for the UTC day; `sync` refuses to plan past it and says how many calls
remain. The Figma account allows 200 read calls a day, 15 a minute, shared by every session.

## What reads this, and what never does

- Lanes, developers and designers read specs, tokens and assets from here. A lane never calls Figma to learn a design.
- The catalog (`figma-catalog/`) links a frame to its spec by the same `<fileKey>:<node>` key.
- Nothing in `src/` imports `figma/`: it is design data, not shipped code, and is not in the package's `files`.
