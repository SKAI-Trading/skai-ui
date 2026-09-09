# ⛔ READ THIS BEFORE ACTING ON `scope` IN `_pages.json`

Two facts about this file have caused real, measured damage. Both were found on
2026-09-08, during a sweep in which ~113 actionable bug reports were affected and
rows were closed on a false premise.

---

## 1. ENTRIES ARE KEYED BY **(fileKey, pageId)** — A PAGE-ID-ONLY LOOKUP IS WRONG

The same `pageId` exists in **three different Figma files**, with different
scopes and wildly different frame counts:

| fileKey | `2003:674` | `2998:19593` | `3:3` |
|---|---|---|---|
| `3sSzw1KewMtUbeLAv7uW0r` | tombstone, n=20 | tombstone, n=13 | tombstone, n=154 |
| `mhF3BkzlTaGiLzJ7kvpmVc` | v1-superseded, n=277 | v1-superseded, n=178 | v1-superseded, n=420 |
| `M6r9FEn042UWTQD1zvy6GM` | in-scope, n=36 | — | — |

⇒ **Look up `(fileKey, pageId)`.** Matching on `pageId` alone returns whichever
entry happens to come first and is therefore nondeterministic — a page can read
`tombstone`, `v1-superseded` or `in-scope` depending only on iteration order.
Take the `fileKey` from the bug report's own `figma_link`; never assume it.

---

## 2. ⛔⛔ `v1-superseded` DOES **NOT** MEAN "RETIRED, DO NOT BUILD"

It describes a **file duplication**, not a retirement. For many surfaces the v1
page is **the only design that exists**:

| page | v1 content | supposed v2 replacement |
|---|---|---|
| Home 1 `2003:674` | **50** `Portfolio` frames | Home 2 `13008:110718`: **0** |
| Trade 1 `3:3` | **123** Spot + **78** Perps frames | Trade 2 `13006:134300`: **2** Spot, **0** Perps |

**158 node ids appear in both files** (144 on `3:3`) — the signature of a
duplication, which is what "moved to Skai Web App 2" actually means.

`casey-rulings-2026-08-26-parity.md` §4 states it directly:

> *"Home 1 IS the moved page; Home 2 is a page-continuation index inside that
> file… **191 surfaces / 490 frames on the v1 pages have no v2 counterpart and
> remain parity targets**."*

⇒ A QA operator who links a Home 1 or Trade 1 frame for `/portfolio` or `/spot`
is citing the **only** design there is. Closing that report as "retired spec"
discards live, actionable parity work.

⇒ **Do not close a report on the `v1-superseded` label alone.** If the cited
surface has no counterpart on the v2 page, the report stands.

---

## Why this warning is a file and not a fixed `scope` value

The scope values are deliberately left alone: correcting them is a product call
for Casey, and three separate files are involved, so a blind edit could be as
wrong as the label. **What was missing was not the correction — it was the
correction reaching the artefact people actually open.**

That gap is the whole lesson. This was found and written into memory on
**2026-08-26** (`casey-rulings-2026-08-26-parity.md` §4, and
`self-improvement-operational-slips.md` #221). It never reached this directory.
So on 2026-09-08 four independent lanes re-derived the wrong conclusion from this
file, and a memory note was written telling still more lanes to close on it.

> **A correction that does not reach the artefact people consult has not been
> made.** It is a note about a mistake that is still live.

---

## Still owed

- Casey to rule on the correct `scope` for `2003:674`, `2998:19593` and `3:3`
  under fileKey `mhF3BkzlTaGiLzJ7kvpmVc`.
- Re-open every bug report closed citing *v1-superseded*, *retired spec* or
  *no v2 replacement*.
- A 4th file, `qCg6vd2Kd4KCgZgYzVsFWD` ("Skai-Web-App-2-QA-Sheet"), began
  appearing on reports on 2026-09-08 and is in **no** catalog artefact;
  `get_metadata` returns *"you don't have edit access"*, so rows citing it are
  unresolvable by every instrument available. Needs access granted or the file
  harvesting.

## What IS safe to rely on here

- `held` is a genuinely distinct state and means do-not-build. Page
  `5210:118077` ("Governance and Utilities") is `held`, and 15 of 16 `/account`
  reports resolve to it — a real product question, not a labelling bug.
- Resolve a node to its page with `getNodeByIdAsync` plus a `.parent` walk. Do
  not infer the page from a node-id prefix, and do not use the `.tsv` snapshots
  (2026-08-13 / 08-26) — spot-checked, they resolved 1 of 7 sampled nodes.
