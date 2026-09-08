import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The Trade 2 page of the Skai Web App 2 Figma file (fileKey
 * `mhF3BkzlTaGiLzJ7kvpmVc`, pageId `13006:134300`) is the parity denominator for
 * every Trade / Trench / Launch surface. `figma-catalog/coverage.mjs` takes only
 * two inputs from Figma — `live/_pages.json` and the per-page node list — so the
 * published percentage is a function of this one file's row count.
 *
 * THE RULE. The harvest must hold one row per top-level child of the live page,
 * and `_pages.json` must record that same number as `n`. A harvest SHORTER than
 * the live page shrinks the denominator and RAISES the percentage, which is the
 * direction nobody reviews; `coverage.mjs` refuses on it for exactly that
 * reason. The manifest and the TSV agreeing with each other proves nothing about
 * either — they were consistent at 407 for twelve days while the page carried
 * 417 — so this test pins the count to what Figma reported, not to what the two
 * catalog files happen to say about one another.
 *
 * Counted 2026-09-07 by two independent routes that agreed at 417: `loadAsync()`
 * then `page.children.length`, and `setCurrentPageAsync` then a unique-id count
 * over `figma.currentPage.children`. The ten ids below are the top-level
 * children the 2026-08-26 snapshot did not hold.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIVE = path.resolve(HERE, "../../figma-catalog/live");
const FILE_KEY = "mhF3BkzlTaGiLzJ7kvpmVc";
const PAGE_ID = "13006:134300";
const TSV = path.join(LIVE, `${FILE_KEY}__${PAGE_ID.replace(":", "-")}.tsv`);

/** Live children measured on the page 2026-09-07, both routes agreeing. */
const LIVE_CHILD_COUNT = 417;

/** `coverage.mjs` keys on the hyphen form; the TSV writes the colon form. */
const normId = (s: string) => s.trim().replace(":", "-");

/**
 * Top-level children absent from the 2026-08-26 snapshot. Two are genuine
 * frames — a `Trench scroller - undocked` rail and a second 1440x900 Trench
 * board — and the rest are canvas chrome that `coverage.mjs` classifies as
 * furniture. Both kinds belong in the harvest: the furniture rule is derived
 * from the row, so a row that never lands cannot be classified at all.
 */
const ADDED_SINCE_SNAPSHOT = [
  "14180-115254", // Trench scroller - undocked, FRAME 1382x22
  "13935-69044", // Skai > Trench 1VH (1440 x 900px), FRAME 1440x900
  "13935-70751",
  "13935-70798",
  "13935-70822",
  "13935-70892",
  "13935-70938",
  "13935-70962",
  "13943-71082",
  "13943-71081",
];

/** Present in the 2026-08-26 snapshot; a re-harvest must not drop them. */
const SNAPSHOT_ANCHORS = ["13006-134301", "13006-357209"];

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

describe("figma-catalog live harvest — Trade 2", () => {
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
    expect([...ADDED_SINCE_SNAPSHOT].filter((id) => !ids.has(id))).toEqual([]);
  });

  it("still carries the children the 2026-08-26 snapshot had", () => {
    const ids = new Set(readHarvest().rows.map((r) => r.id));
    expect([...SNAPSHOT_ANCHORS].filter((id) => !ids.has(id))).toEqual([]);
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
