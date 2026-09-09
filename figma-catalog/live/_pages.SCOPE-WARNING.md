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

**Re-measured live 2026-09-08 by a second lane, and it holds.** Top-level child
counts read off each page: Portfolio — Home 1 **50**, Home 2 **0**. Perps —
Trade 1 **78**, Trade 2 **0**. Spot — Trade 1 **124**, Trade 2 **2** (124 not
123; the difference is one frame, the conclusion is unchanged). The `3:3`
overlap is confirmed exactly: the `3sSzw1KewMtUbeLAv7uW0r` tombstone has 154
top-level ids and **144 of them are present in `mhF3BkzlTaGiLzJ7kvpmVc`**, with
only 10 unique to the tombstone.

One clarification worth having, because it is easy to measure the wrong pair:
**Home 1 vs Home 2, Wallet 1 vs Wallet 2 and Trade 1 vs Trade 2 share ZERO
top-level ids with each other.** The duplication is not v1→v2 inside one file;
it is 3sSzw→mhF3 **across** files. So "v2" is not a copy of "v1" at all, which
is why the supersession the label implies never happened.

The clearest single number for what Trade 2 actually is: **Trench frames —
Trade 1 8, Trade 2 136.** Trade 2 is overwhelmingly a *Trench* surface. It was
never a Trade replacement, so "Trade 1 is superseded by Trade 2" was never true
of Spot or Perps.

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
- ~~A 4th file, `qCg6vd2Kd4KCgZgYzVsFWD` ("Skai-Web-App-2-QA-Sheet") … rows
  citing it are unresolvable by every instrument available.~~ **RESOLVED
  2026-09-08 — the rows are resolvable and all six are in-scope.** The access
  problem is real and unchanged (`use_figma` and `get_metadata` both return *"you
  don't have edit access"*), but access was never required: the QA sheet is a
  copy of Skai-Web-App-2 and **shares its node ids**. All six cited ids were
  looked up in `mhF3BkzlTaGiLzJ7kvpmVc` — every one exists, every one sits on
  ✅ Home 2 (`13008:110718`, in-scope), and each is a `Skai > Pro …` 768px frame
  matching its report title (e.g. `13008:126152` = *"Skai > Pro > checkout >
  welcome to gold 1VH (768 x 1024px)"* against the report *"Tablet View (768px) >
  Pro > Checkout > Welcome to Plan"*). Recorded in `_pages.json` →
  `fileAliases`. Still worth granting access so the file can be harvested
  properly, but no row is blocked on it.
- **The same failure has a second form: a report can carry a TRACKED but WRONG
  fileKey**, which reads as a deleted node rather than a bad link. 12 reports
  cited a node absent from the file their link named; re-checked against the
  sibling file, **3 of the 12 are alive in `mhF3BkzlTaGiLzJ7kvpmVc`** — reports
  `1aaf397f` (`3023:15273`, Wallet 1), `a078ae7a` (`2998:19599`, Wallet 1) and
  `4162572b` (`7761:224662`, Trade 1). Only 9 are genuinely absent from both.
  This follows directly from §1: because the ids were copied file-to-file, a node
  deleted from the `3sSzw1KewMtUbeLAv7uW0r` copy often still exists in `mhF3`.
  **Check the sibling file before calling a cited node deleted** — and a missing
  spec citation is not evidence the app bug is unreal, so none were closed.

## What IS safe to rely on here

- `held` is a genuinely distinct state and means do-not-build. Page
  `5210:118077` ("Governance and Utilities") is `held`, and 15 of 16 `/account`
  reports resolve to it — a real product question, not a labelling bug.
- Resolve a node to its page with `getNodeByIdAsync` plus a `.parent` walk. Do
  not infer the page from a node-id prefix, and do not use the `.tsv` snapshots
  (2026-08-13 / 08-26) — spot-checked, they resolved 1 of 7 sampled nodes.
