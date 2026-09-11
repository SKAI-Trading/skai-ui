# Figma frame catalog

Every top-level frame in the three SKAI Figma files, which section of the app it
belongs to, whether it is built, and what code implements it. The catalog lives in
this submodule (`@skai/ui`) because the design system is the one thing every SKAI
surface shares; the app repos read `registry.json` and the generated Markdown.

| Figma file | Key | Pages |
|---|---|---|
| Skai-Web-App | `3sSzw1KewMtUbeLAv7uW0r` | 13 |
| Skai-Web-App-2 | `mhF3BkzlTaGiLzJ7kvpmVc` | 7 |
| Skai-Games | `M6r9FEn042UWTQD1zvy6GM` | 31 |

Last complete harvest: **2026-09-09**, 51 pages, 5,895 top-level nodes (`live/_pages.json`).

## What you edit, what is generated

Hand-maintained inputs:

- `<section>.nodes.txt` / `<section>.titles.tsv` — which frames a section owns, and their names.
- `status.<section>.tsv` — build status per frame or family. **Never regenerate one**; they are the record.
- `vverify.<section>.tsv` — visual verification verdicts.
- `pages.json` — page → section mapping, `outOfScope` reasons, the change log.
- `live/_pages.json` — the live page manifest. Its `scope` column is a ruling, not a measurement.
- `bugref-aliases.tsv` — bug-report node ids → covering frame, and ids certified `gone`.

Generated (commit them, never hand-edit): `registry.json`, `families.json`,
`figma-frame-catalog.md`, `coverage.json`, `COVERAGE.md`, `WAVE10-INTEGRITY.md`,
`live/*.tsv`, `live/_resolved.json`, `figma-todo.live.tsv`, `figma-drift.live.json`.

`SCHEMA.md` documents every file; `CATALOG_DESIGN.md` is the rationale; `TRAPS.md`
and `WAVE_PLAYBOOK.md` are for anyone measuring parity against it.

## Regenerate

From `modules/skai-ui`:

```sh
npm run catalog          # rebuild every derived file, in the one correct order
npm run catalog:check    # same, then exit 1 if any derived file was stale
```

`pipeline.mjs` runs `coverage.mjs --check` (refuses a short harvest), then
`build-registry` → `families` → `apply-status` → `apply-verify` → `catalog-view` →
`bp-report` → `coverage`, and stops at the first failure. Afterwards it proves no
surviving frame lost its `implFiles` or `verifiedAt`, and reports which fields moved.
The order is not optional: apply-verify downgrades an over-optimistic `done`, and
apply-status run after it would put the `done` back.

Run `catalog:check` before committing anything under `figma-catalog/`. It is the
step that catches a TSV edited without its derived files.

The headline in `COVERAGE.md` has two parts. **Done** is what the status rows
claim. **Verified** is the done frames a `vverify.<section>.tsv` verdict of
`match` stands behind; coverage applies those verdicts per frame, so a row
claiming `done` over a verdict of `partial` counts as partial. Both ship to the
status page. `AUDIT-2026-09-09.md` records how each half was checked against
Figma and what the `match` verdicts do and do not prove.

## Keeping it in step with Figma

Figma is read through the MCP Plugin API (`use_figma`), which is the only instrument
that enumerates a page completely. REST `get_metadata` is lossy and stops without
saying so; results over 20 KB are cut mid-JSON. `harvest.mjs` is built so that
neither can produce a short catalog: every chunk echoes the page's own child count,
and ingest refuses any page whose chunks do not tile it exactly.

The loop, per Figma file:

0. **Verify.** `npm run catalog:harvest -- verify-script --file <key>` prints a
   one-call read-only script that hashes every page of the file (FNV-1a over the
   exact rows step 2 would return). Run it with `use_figma`, save the result, then
   `npm run catalog:harvest -- verify-ingest <verify.json> --write`. A page whose
   hash, row count and name match `live/` is stamped harvested today and needs
   nothing else; the pages it lists as CHANGED or NEW are the only ones steps 1-3
   have to read. On 2026-09-10 the Games file had moved and the two web-app files
   had not, and this step turned forty-eight chunk reads into six. The verify
   payload is also a valid `--counts` file for `plan`.
1. **Plan.** `npm run catalog:harvest -- plan --file <key> --counts <verify.json>`
   prints the chunks (page id, index range) sized from the fresh counts to stay
   under the 20 KB cap. Long node names (Titles + Emblems) need smaller chunks;
   `--budget` lowers the target.
2. **Harvest.** For each chunk, `npm run catalog:harvest -- script --file <key> --chunk '<json>'`
   prints a read-only Plugin API script. Run it with `use_figma` and save the
   returned JSON to a file, one per chunk. The script uses `page.loadAsync()`, never
   `setCurrentPageAsync`, and touches nothing.
3. **Ingest.** `npm run catalog:harvest -- ingest <chunk.json>...` is a dry run that
   reconciles every chunk and reports, per page, ids added, removed, renamed and
   un-truncated. Add `--write` to update `live/*.tsv`, `live/_pages.json` and
   `pages.json`; add `--full` only when every page of every file was ingested, so the
   top-level harvest date advances only on a complete sweep. A new page arrives with
   scope `unscoped` (ready) or `wip`, is reported by coverage, and is not counted
   until someone rules on it.
4. **Probe.** `npm run catalog:harvest -- probe-script --file <key>` lists catalogued
   ids that are no longer top-level children and prints a `getNodeByIdAsync` script
   for them. Run it with `use_figma`, save the result, then
   `npm run catalog:harvest -- probe-ingest <probe.json> --write`. An id found alive
   under another frame is recorded in `live/_resolved.json` and treated as present;
   an id not found after every page was loaded is certified gone.
5. **Drift.** `npm run catalog:drift` builds `snapshot.live.json` from `live/`,
   validates it (depth mismatch, count source, certified deletions) and writes
   `figma-todo.live.tsv`, most actionable row first: `REMOVED-WITH-WORK`, `RETARGET`
   (same title, new id: repoint, keep the work), `ADDED`, `REMOVED`, `RETITLED`.
6. **Fold in.** `node figma-catalog/snapshot-to-nodes.mjs figma-catalog/snapshot.live.json`
   shows what would change in `*.nodes.txt` / `*.titles.tsv`; `--write` applies it.
   It refuses a section losing more than a quarter of its ids on an uncertified count.
   Record each certified-gone id in `bugref-aliases.tsv` as `gone` so the status rows
   keep their history and drift stops listing it. Then `npm run catalog`.

`harvest.mjs --self-test` and `pipeline.mjs --self-test` cover the reconciliation and
comparison rules without touching Figma.

## What the tooling refuses, on purpose

- A page whose chunks leave a gap, overlap, repeat an id, or disagree on the page's
  child count (`ingest`).
- A live TSV whose row count differs from the manifest (`coverage.mjs --check`, first
  step of the pipeline).
- A capture in which fewer than half of a section's catalogued ids appear, unless the
  missing ones are certified gone (`validate-snapshot.mjs`). That shape is a shallow
  capture against a deep registry, and reporting it would claim false deletions.
- A fold-in that drops more than a quarter of a section on an uncertified count
  (`snapshot-to-nodes.mjs`).
- A pipeline run in which a surviving frame lost `implFiles` or `verifiedAt` (exit 2).

## Traps

- **Node ids are unique only within a file.** Skai-Games and Skai-Web-App-2 were
  cloned from one ancestor, so `2713-3937` is a different frame in each. Key on
  `(fileKey, node)`; never infer a page from an id prefix.
- **A page you have not loaded reports zero children.** Every harvest script calls
  `loadAsync()` on the page it reads.
- **Titles can differ by an invisible character.** macOS screenshot names carry a
  narrow no-break space before AM/PM. Drift folds whitespace before comparing.
- **Readiness comes from the page name's leading marker** (`✅` ready, `🚧` wip,
  `📍` / `🌎` meta, `✝️` tombstone). A tombstone is a page whose body moved to
  another file; it is expected to have no section.
- **`status.` is a glob.** Any `status.*.tsv` is read as a frame status table by
  apply-status, bp-report and coverage. Do not use the prefix for anything else.
- **Shared working tree.** Always commit with explicit paths from this submodule,
  then bump the pointer in Skai-Trading.
