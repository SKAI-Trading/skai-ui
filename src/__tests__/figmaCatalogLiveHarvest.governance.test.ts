import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The Governance and Utilities page of the Skai Web App Figma file (fileKey
 * `3sSzw1KewMtUbeLAv7uW0r`, pageId `5210:118077`) covers Earn, Governance,
 * Learn, Explorer, Airdrop, Rewards, Leaderboard and Account. `coverage.mjs`
 * takes only two inputs from Figma — `live/_pages.json` and the per-page node
 * list — so the denominator those surfaces are scored against is this one
 * file's row count.
 *
 * THE RULE. The harvest holds one row per top-level child of the live page, and
 * `_pages.json` records that same number as `n`. A harvest SHORTER than the live
 * page shrinks the denominator and RAISES the published percentage, which is the
 * direction nobody reviews. The manifest and the TSV agreeing with each other is
 * not evidence for either — they agreed at 331 for twelve days while the page
 * carried 725 — so the count below is pinned to what Figma reported, not to what
 * the two catalog files say about one another.
 *
 * Counted 2026-09-07 by two routes that agreed at 725: `loadAsync()` then
 * `page.children.length`, and `setCurrentPageAsync` then a unique-id count over
 * `figma.currentPage.children`. The rows were checked against Figma with an
 * FNV-1a hash of the same six-column encoding computed on both sides
 * (`ea96a9ec`, 48522 chars), so the file is byte-identical to the page, not
 * merely the right length.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIVE = path.resolve(HERE, "../../figma-catalog/live");
const FILE_KEY = "3sSzw1KewMtUbeLAv7uW0r";
const PAGE_ID = "5210:118077";
const TSV = path.join(LIVE, `${FILE_KEY}__${PAGE_ID.replace(":", "-")}.tsv`);

/** Live children measured on the page 2026-09-07, both routes agreeing. */
const LIVE_CHILD_COUNT = 725;

/** `coverage.mjs` keys on the hyphen form; the TSV writes the colon form. */
const normId = (s: string) => s.trim().replace(":", "-");

/**
 * The 1440 board was already complete in the 2026-08-26 snapshot at 125 frames
 * and still measures 125. Every one of the 397 children added since is a
 * responsive board or its furniture: 375 went 14 -> 144 and 768 went 39 -> 132.
 * A harvest that reads the page at desktop width only would pass a row count and
 * still miss two thirds of the work, so the boards are asserted separately.
 */
const BOARD_FRAME_COUNTS = { 375: 144, 768: 132, 1440: 125 };

/** Top-level children absent from the 2026-08-26 snapshot. */
const ADDED_SINCE_SNAPSHOT = [
  "11983-182767", // Skai > Explorer (768 x 1024px), FRAME 768x2680
  "11986-226555", // Skai > Explorer > Dashboard - transactions (768 x 1024px)
  "12016-75585", // Skai > Earn > Vaults - ALT (375 x 812px), FRAME 375x1636
  "12225-462758", // Skai > Earn > Faucet > Winners > Share outcome (375 x 812px)
  "12261-474854", // Skai > Earn > Faucet 1VH (768 x 1024px)
  "12261-470424", // Skai > Earn > My positions > Update position (375 x 812px)
];

/** Present in the 2026-08-26 snapshot; a re-harvest must not drop them. */
const SNAPSHOT_ANCHORS = [
  "5220-10989", // Directory
  "5371-64317", // Skai > Governance > Proposals (1440 x 900px)
  "11768-350087", // Skai > Account 1VH (768 x 1024px)
];

/**
 * Held by the 2026-08-26 snapshot and no longer resolving in the file —
 * `getNodeByIdAsync` returns null for all three, so they are deleted, not moved.
 * `5539-100875` is still cited by `status.governance.tsv` and
 * `status.governance-account.tsv`, which is a row pointed at a frame that no
 * longer exists; those files are hand-set and are not this harvest's to edit.
 * The ids are listed here so a re-paste of the stale snapshot fails loudly
 * rather than quietly restoring three phantom rows to the denominator.
 */
const GONE_SINCE_SNAPSHOT = ["5539-100875", "11713-327264", "11768-350612"];

type Row = { id: string; name: string; type: string; w: number; h: number; visible: boolean };

function readHarvest(): { raw: string; rows: Row[] } {
  const raw = fs.readFileSync(TSV, "utf8");
  const rows = raw
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => {
      const [id, name, type, w, h, visible] = l.split("\t");
      return { id: normId(id), name, type, w: Number(w), h: Number(h), visible: visible !== "0" };
    });
  return { raw, rows };
}

describe("figma-catalog live harvest — Governance and Utilities", () => {
  it("holds one row per live top-level child", () => {
    expect(readHarvest().rows).toHaveLength(LIVE_CHILD_COUNT);
  });

  it("records the same count in _pages.json, so coverage.mjs measures the whole page", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(LIVE, "_pages.json"), "utf8"));
    const page = manifest.pages.find(
      (p: { fileKey: string; pageId: string }) => p.fileKey === FILE_KEY && p.pageId === PAGE_ID,
    );
    expect(page, `no ${PAGE_ID} entry in live/_pages.json`).toBeTruthy();
    expect(page.n).toBe(LIVE_CHILD_COUNT);
  });

  it("carries the children the 2026-08-26 snapshot missed", () => {
    const ids = new Set(readHarvest().rows.map((r) => r.id));
    expect(ADDED_SINCE_SNAPSHOT.filter((id) => !ids.has(id))).toEqual([]);
  });

  it("still carries the children the 2026-08-26 snapshot had", () => {
    const ids = new Set(readHarvest().rows.map((r) => r.id));
    expect(SNAPSHOT_ANCHORS.filter((id) => !ids.has(id))).toEqual([]);
  });

  it("omits the three ids that no longer resolve in the file", () => {
    const ids = new Set(readHarvest().rows.map((r) => r.id));
    expect(GONE_SINCE_SNAPSHOT.filter((id) => ids.has(id))).toEqual([]);
  });

  it("reaches all three boards, not the 1440 one the snapshot stopped at", () => {
    const { rows } = readHarvest();
    const atWidth = (w: number) => rows.filter((r) => r.w === w).length;
    expect({
      375: atWidth(375),
      768: atWidth(768),
      1440: atWidth(1440),
    }).toEqual(BOARD_FRAME_COUNTS);
  });

  it("gives every row a well-formed id and all six columns", () => {
    const { raw, rows } = readHarvest();
    const lines = raw.split(/\r?\n/).filter((l) => l.trim());
    expect(lines.filter((l) => l.split("\t").length !== 6)).toEqual([]);
    expect(rows.filter((r) => !/^\d+-\d+$/.test(r.id)).map((r) => r.id)).toEqual([]);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
  });

  it("uses CRLF, the encoding the rest of live/ is written in", () => {
    const { raw } = readHarvest();
    expect(raw.endsWith("\r\n")).toBe(true);
    expect(raw.split("\r\n").length - 1).toBe(LIVE_CHILD_COUNT);
  });
});
