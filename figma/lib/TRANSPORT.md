# How a sync script's result gets out of Figma

`use_figma` returns whatever the script returns, as `JSON.stringify` text, and keeps only the first **20,480 UTF-8
bytes**. Anything longer is cut mid-JSON and `// truncated to 20kb` is appended. Measured on 2026-09-24: three cut
results were each 20,500 bytes long (20,480 plus the 20-byte marker) at 20,338, 20,455 and 20,500 characters, so the
limit counts bytes, and a non-ASCII name costs 2 to 4 of them.

A frame spec as plain JSON runs about 210 bytes a node. The Spot trading screen (`mhF3BkzlTaGiLzJ7kvpmVc` `7710:91527`,
1,645 nodes) would have taken 23 results that way, so it was parked. Extract results now carry each frame packed, in the
format below.

Hash results stay plain JSON. A hash pass is limited by time, not size: it builds about four frames a second, so a
25-second pass returns about 100 hashes, roughly 3 KB, far under the cut.

## Format z1

Each frame's record (its parts, flattened to the pre-order item list sync has always used: a `{_p, _h}` marker opens
each part, and every node carries its depth as `_d`) is packed on its own:

1. `text` is the `canonicalJson` of the item list (`lib/canonical.mjs`).
2. `bytes` is raw DEFLATE (RFC 1951) of the text's UTF-8, with the preset dictionary `ZDICT` in the window before
   the stream starts. A lone surrogate is 3 bytes, the way `fnv1a64` already reads it.
3. What travels is base64 of a byte range of that stream, cut into 2,048-character lines. Each line comes with
   the last 8 hex digits of its own FNV-1a 64.

The encoder is `zcodec` in `lib/transport.mjs`. It is pasted into the script as source, like the builder, so it uses
only core ECMAScript: its own UTF-8, DEFLATE and base64, and no `TextEncoder` or `CompressionStream`. The Plugin API
typings declare `figma.base64Encode` and nothing like `TextEncoder`, but a typings file does not list host globals,
so the codec assumes neither. The DEFLATE is LZ77 over a 32 KB window: hash chains 1,024 deep, lazy matching up to 258, and blocks of 16,384
symbols. Each block takes the cheaper of the fixed codes and dynamic codes. Dynamic code lengths come from
package-merge, which is optimal under DEFLATE's 15- and 7-bit limits and always gives a complete code, which zlib
insists on. Packing is deterministic: a given frame gives the same bytes in any engine. That is what lets one
frame's stream be carried across calls by byte offset.

The decoder is `node:zlib`, an implementation independent of the encoder. Where the encoder is wrong, zlib refuses
the stream rather than agreeing with the mistake.

### An extract result

```jsonc
{ "v": 1, "kind": "extract", "file": "<fileKey>", "nonce": "<from the script>",
  "enc": "z1", "dz": "<DICT_ID>",
  "segs": [ { "f": "7710:91527", "H": "<frame hash>", "pg": "<page>", "n": "<name>", "w": 1440, "h": 900,
              "T": 1645,            // items in the frame's list
              "R": 347000,          // UTF-8 bytes of its canonical JSON
              "Z": 36000,           // bytes of its packed stream
              "zh": "<fnv1a64 of the canonical JSON>",
              "o": 0,               // byte offset of this slice in the stream
              "z": ["<base64 line>", ...], "zc": ["<8 hex>", ...] } ],
  "missing": [], "errors": {}, "rest": [], "ms": [<loading pages>, <the rest>, <of that, packing>],
  "sum": "<fnv1a64 of the result's canonical JSON without sum>" }
```

A frame that fits goes out whole (`o` 0, every byte). If it does not fit, the part that does goes out and ends the
result, and later calls send the rest from that offset. Every slice but the last is a whole number of base64 groups (a
multiple of 3 bytes), so the slices' base64 simply joins. A frame that does not fit whole starts only when it is first,
or when a quarter of the budget is still free; otherwise it waits in `rest`.

### The budget

The driver measures the returned JSON in UTF-8 bytes as it builds it, and holds it under `ZRESULT_BUDGET`
(18,000, 2,480 under the cut). Before each frame it reserves the bytes for every id that could still end up in `rest`,
so a result that stops early still fits. A last check after `ms` is set drops a segment rather than send a result over
the budget; that check should never fire. `extract-script --budget <bytes>` changes the figure.

After the codec, the base script and the dictionary, an extract script is about 37,400 characters. That is under the
45,000 that `pack.mjs` allows and use_figma's 50,000.

## What makes it lossless, and what is checked where

| Check | Where | Catches |
|---|---|---|
| `sum` over the whole result | ingest, before anything is written | any change to the result after Figma returned it |
| a line's 8-digit check | ingest | names the line that was mis-copied, and refuses a result whose line checks disagree with its lines |
| `enc` and `dz` equal this checkout's | ingest | a result from another format or dictionary (it would decode wrongly or not at all) |
| slice continues the transfer on record (same `H`, `Z`, `zh`, `T`, offset = bytes held) | ingest | a slice from a different transfer, or from before an edit |
| zlib inflates the stream | ingest, last slice | a stream the encoder got wrong |
| `fnv1a64(text) === zh` | ingest, last slice | any byte of the stream wrong |
| `canonicalJson(JSON.parse(text)) === text` | ingest, last slice | text that would not hash as Figma hashed it |
| item count `=== T` | ingest, last slice | a stream holding a different list |
| every part's hash from its content, the first part is the frame, its hash is `H` | `storeFrame` (unchanged) | content that is not what Figma hashed |

So a stored spec is byte-for-byte the canonical JSON Figma built, and every stored hash is the hash it would have had
without packing. A refused result still counts its call: the ledger line is written first, as before.

### Saving a result

Save the returned JSON exactly as given. If it was mis-copied, the ingest says which lines no longer match their
checks, for example `segment 0 (7710:91527) line 4 of 9`. Copy those lines again from the output and re-ingest.
The call is already counted, so a second ingest of the same nonce writes `calls: 0`.

## A transfer part-way (`store/sync-state.json`)

In the z1 format a frame part-way through a transfer is recorded as:

```jsonc
"partial": { "<frame key>": { "enc": "z1", "H": "<frame hash>", "T": 1645, "R": 347000, "Z": 36000, "zh": "<...>",
                              "pg": "...", "n": "...", "w": 1440, "h": 900,
                              "z": "<the base64 received so far>", "got": 13002, "calls": 1, "oversize": false } }
```

`got` is the next byte offset to ask for. The next `extract-script` continues the transfer first. When the live frame
has changed, its hash no longer matches `H`: the script restarts at byte 0 in the same call, and the ingest replaces
the transfer. A transfer projected to need more than 12 calls is parked as `oversize` and planned again only when
named with `--nodes`. That projection is exact after the first slice, because `Z` is known.

A partial left in the older plain format (`x`, an item list, no `enc`) cannot be joined to a packed stream. Its frame
is planned again from 0 and is no longer treated as parked.

## The dictionary

`ZDICT` (10,156 bytes) holds the token names in `tokens/` and one real item of each common node shape, taken from
the first live specs. It also holds a few templates for kinds those specs lack (line, group, gradient, image, shadow,
blur, component, text case). It is part of the format: `DICT_ID` is the first 8 hex digits of its FNV-1a 64, the
script sends it back as `dz`, and a result made with another dictionary is refused. Changing the dictionary is safe
whenever no transfer is part-way.

A script is pasted into use_figma by hand, and the dictionary is about a quarter of it. So the script first checks that
its own copy of the dictionary hashes to the `dz` it was given. If it does not, the copy was not exact: the script
packs with no dictionary and returns `dz` `cbf29ce4` (`DICT_NONE`, the id of the empty text), and the ingest decodes
that just as well. A slip in the dictionary costs some ratio, not the call. A transfer keeps the dictionary it
started with, and a slice packed with the other one is refused. Held-out, a dictionary built from some specs made the other specs' streams 17 to 26%
smaller. It matters most for the small frames that fit in one call, and hardly at all past a stream's first 32 KB.

## Numbers

Real specs, packed bytes against the plain canonical JSON:

| Frame | Plain | Packed | Ratio |
|---|---|---|---|
| 9088:4795 CTA/button (Games) | 682 | 68 | 10.0x |
| 2745:3552 Input w/o voice | 3,506 | 429 | 8.2x |
| 9142:19454 LB With Header | 10,645 | 707 | 15.1x |
| 7710:91527, first 73 items | 15,233 | 1,248 | 12.2x |

Those four were in the dictionary's sample, so they flatter it. Without a dictionary, zlib -9 gets 1.7x, 3.7x, 7.8x
and 6.2x on the same four, and this encoder is within 0.5% of zlib -9 on each.

At 18,000 bytes a result carries about 17,400 base64 characters, or 13,000 stream bytes. At the 8x to 12x above, a
frame of up to roughly 100 to 150 KB of plain spec fits in one call. On the store's frames so far that is about 500 to
700 nodes. Before, a result held about 16 KB of plain spec, or 75 nodes.

Speed: a 357 KB spec packs in about 50 ms in V8 and 560 ms in V8 with the JIT off (`--jitless`, a stand-in for an
interpreter sandbox). Building that frame in Figma took about 30 s.

## Self-tests

`node figma/lib/transport.mjs --self-test` checks the codec on its own. `node figma/sync.mjs --self-test` runs those
checks too, then the whole path through the mocked Figma:

- Every fixture and stored file round-trips.
- 400 random values round-trip, with every JSON escape, every UTF-8 width and both lone surrogates, as do nesting
  300 deep, a 144,000-character string, and `__proto__`, empty and numeric keys.
- zlib inflates the packed bytes exactly across many blocks, a 300 KB run, a repeat exactly 32 KB back, and noise.
- Package-merge gives complete codes within the limit on Fibonacci and 300 random tables.
- The codec as pasted into the script packs the same bytes as the module.
- A 1,600-node board with CJK and emoji names, long text and a 70-deep chain arrives over several calls, every result
  at most 18,000 bytes, and is stored at its live hash.
- An old plain partial restarts, and a foreign dictionary, a mismatched continuation and a ragged slice are refused.

The mutations that were planted and killed are listed in the lane log. Worth trying if you want to break it:

- A frame whose packed stream is exactly a multiple of the slice size.
- Names that are all 4-byte characters under a tight `--budget`.
- An edit to the design between two slices.
- A result pasted with its line breaks re-flowed.

## Not tried

`figma.io.write(path, data)` is listed in the use_figma typings as writing "image/data to be returned in tool
response". It might return data outside the 20 KB cut. It is a write API, and trying it costs a call, so nothing here
uses it.
