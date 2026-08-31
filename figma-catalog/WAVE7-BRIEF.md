# Wave 7 — measurement wave (delta from WAVE5-BRIEF.md and WAVE6-BRIEF.md)

**Read `WAVE5-BRIEF.md` in full first. All of it still binds** — hard
prohibitions, the radius scale, the 44px tap floor, type rules, product
constraints, TSV format. `WAVE6-BRIEF.md` §2-§6 still bind too.

This file says only what CHANGED. Three things did, and two of them reverse
wave-6 instructions.

---

## 1. ★ FIGMA IS AUTHENTICATED NOW. `done` IS REACHABLE.

Wave 6 could not produce a single `done` row because the Figma MCP was
unauthenticated. **It is up** — verified: `whoami` returns `Skai.trade`, Full
seat on Skai HQ (pro).

So the wave-6 instruction "no lane can file `done`" is **withdrawn**. The
wave-5 bar applies again in full:

> `done` = geometry, type and colour measured off Figma **node data** against
> the implementation, with the numbers written into your row.

**Read node data for every frame you judge.** `get_design_context`,
`get_variable_defs`, or `use_figma` with a script. Do not file a `done` from a
cached number, a prior wave's row, or a screenshot.

⚠️ Still true, and still the reason `done` is expensive: a render and node data
are authoritative for **different** things. Node data gives the exact fill but
omits ancestor `opacity`; a render composites correctly but antialiases. Check
`opacity` on the node AND every ancestor.

⚠️ Still true: **do NOT start a dev server or open the browser.** Both remain
single-instance and a fleet destroys them. Node data is your oracle.

## 2. ★ NEVER IDENTIFY A FRAME FROM `live/*.tsv` — its names are TRUNCATED AT 20 CHARS

The cached harvest caps the name column at 20 characters. `Skai > Play > Casino`
is *exactly* 20, so on the Play page and every game page **every screen frame
collapses to one identical title**.

This is not theoretical. The `✅ Bingo` page holds a frame really titled
`Skai > Play > Casino > Scratchers (1440 x 900px)` and another titled
`… > Blackjack (375 x 812px)`; in the cache both read `Skai > Play > Casino`.

`live/*.tsv` is authoritative for **id, type, width, height, visibility** and
nothing else. **For a title, read node data.** If a whole page's frames appear to
share one title, that is the cap, not the designer.

(Two pages are already refreshed with full titles: `9003-112414` blackjack,
`9390-18296` bingo. The rest are still truncated — one lane is fixing that.)

## 3. `registry.status` IS TRUSTWORTHY AGAIN — as of today

Wave 6's work lists were sized off a `not-started` derived from a five-week-stale
citation index, and **29 of 123 frames (24%) were already built**.

`scan-citations.mjs` now exists and was run today: cited nodes 577 → 1,139,
`not-started` 238 → 202. So your work list is sound. **But keep the habit**: if a
frame looks built, grep `src/` for its node id in both `1234-5678` and
`1234:5678` forms before writing `not-started`.

## 4. Column 2 and column 6 DO NOT share a vocabulary

This has now broken two consecutive waves, and the refusal is **atomic** — one
bad cell in one lane's file stops `registry.json` being written for EVERY lane.

| valid in BOTH | column 2 ONLY | column 6 ONLY |
|---|---|---|
| `unknown` `done` `partial` `not-started` | `blocked-on-backend` `frame-defect` `furniture` | `missing` `renders` `broken` `n-a` |

Wave 5 lost a run to `blocked` in column 6; wave 6 lost one to `not-measured`
and `not-built`. **Validate before you finish** — import `parseBpCell` and
`normaliseStatus` from `bp.mjs` and check `.errors` is empty. Do not run
`apply-status.mjs` yourself; it writes `registry.json` and that is the
orchestrator's.

## 5. What each status MEANS for the percentage

The wave reports two numbers and they are NOT the same:

- **built at all** = `done` + `partial`, over in-scope genuine frames.
- **at measured parity** = `done` only.

`unknown` is neither — it means nobody looked, and it is currently 370 frames
(19.4%), which is why "built at all" is a FLOOR, not a figure. **Every `unknown`
you convert into a real verdict makes the whole number more honest**, whichever
way it goes. Resolving an `unknown` down to `not-started` is as valuable as
closing one to `done`.

So: **do not leave a frame `unknown` if you can measure it.** And do not promote
one to `done` to make a number move — a false `done` is the only outcome that
makes this wave worse than not running it.

## 6. Report back — with the numbers I need for the roll-up

As WAVE5 §12 and WAVE6 §6, and in your final message state plainly:

```
frames in my work list : N
frames I measured      : N
final histogram        : done N · partial N · not-started N · blocked N · frame-defect N · furniture N · unknown N
oracle tests added     : N   (and whether each survived a mutation)
files created/changed  : list
```

The histogram is what the wave percentage is computed from, so give it exactly,
with its denominator. A report without a denominator cannot be counted.

---

## 7. ★ WRITE YOUR TSV INCREMENTALLY. DO NOT SAVE IT FOR THE END.

**Wave 7's first attempt lost 19 lanes' work to a session rate limit.** Every
build lane was mid-exploration when the limit hit; not one had written its status
file yet, so twenty lanes produced exactly ONE TSV between them. The work was
done and then thrown away by an event none of them controlled.

**So: create your `status.wave7.<lane>.tsv` with a header as your FIRST action,
and append to it after every two or three frames.** Never hold results in your
head or in a scratch file until the end. A partial TSV with six honest rows is
worth infinitely more than a perfect one that never gets written — and it is
also resumable, because the next lane can see exactly where you stopped.

The same applies to any source edit: make it, verify it, move on. Do not batch
ten file changes behind one long investigation.

## 8. Be economical — the limit is shared

Twenty concurrent lanes exhausted a session limit in about an hour. You are
sharing a budget with every other lane in this wave.

- Read what you need, not the whole tree. `grep` before `Read`.
- Do not re-derive facts the briefs already give you — they are there precisely
  so you do not spend tokens rediscovering them.
- Do not re-verify a prior wave's finding unless you have reason to doubt it;
  cite it and move on.
- If a frame is going to take twenty tool calls to resolve, write it `unknown`
  with the reason and spend those calls on three frames that will resolve.

**Depth on a few frames beats breadth across many.** Ten frames measured with
numbers in the reason column moves the wave percentage honestly; sixty rows of
citation moves nothing and gets demoted next wave.
