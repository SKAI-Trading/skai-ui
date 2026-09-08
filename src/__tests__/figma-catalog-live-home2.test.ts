/**
 * The Home 2 live harvest is the parity DENOMINATOR, so a short one flatters.
 *
 * `figma-catalog/live/<fileKey>__<pageId>.tsv` lists the top-level children of
 * one Figma page and `live/_pages.json` records the count `coverage.mjs` holds
 * that file to. The two failure directions are not symmetric: a harvest that is
 * SHORT shrinks the in-scope denominator and RAISES the published percentage,
 * which is the direction nobody reviews. `coverage.mjs` already refuses to run
 * on `rows < n`, but nothing pins `n` itself — an `n` lowered to match a
 * truncated re-harvest passes that guard while quietly flattering the figure.
 * This file pins it.
 *
 * ✅ Home 2 (`mhF3BkzlTaGiLzJ7kvpmVc` / `13008:110718`) held 240 top-level
 * children on 2026-09-07. The count was read by two independent routes, as
 * `live/_pages.json`'s own METHOD note requires, because an unloaded page
 * reports `children.length === 0` — a plausible zero, not an error:
 *
 *   page.loadAsync()          then page.children.length      -> 240
 *   setCurrentPageAsync(page) then a unique-id Set over ids   -> 240 / 240
 *
 * The 240 rows were then checksummed in Figma (FNV-1a 1b58eb5c over 18,936
 * chars) and the same checksum recomputed off this TSV, so the file is a
 * byte-exact transcript rather than a same-count substitute.
 *
 * The 2026-08-26 snapshot recorded 168. All 168 of its ids still resolve; the
 * 72 additions are growth, not a swap, which is why the catalogued rows keyed
 * to those ids survive this re-harvest untouched.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const FILE_KEY = "mhF3BkzlTaGiLzJ7kvpmVc";
const PAGE_ID = "13008:110718";

/**
 * Measured floor, not a target. A page may legitimately grow — a later
 * re-harvest raises this alongside the manifest. It may only SHRINK through a
 * deliberate, reviewed edit, because a silent shrink is the flattering failure
 * this test exists to catch.
 */
const MEASURED_CHILDREN_2026_09_07 = 240;

/**
 * Found by walking up from the working directory, so the test reads the same
 * catalog whether vitest is launched from `modules/skai-ui` or the repo root.
 * `import.meta.url` is NOT usable here — vitest's jsdom transform hands back a
 * non-`file:` URL and `fileURLToPath` throws on it.
 *
 * `CATALOG_DIR` overrides the search ONLY so these assertions could be proven
 * to fail against the pre-re-harvest snapshot without editing files that three
 * concurrent harvest lanes were writing to at the time.
 */
function findCatalogDir(): string {
  let dir = process.cwd();
  for (let up = 0; up < 6; up++) {
    for (const candidate of [
      path.join(dir, "figma-catalog"),
      path.join(dir, "modules", "skai-ui", "figma-catalog"),
    ]) {
      if (fs.existsSync(path.join(candidate, "live", "_pages.json"))) return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`no figma-catalog/live/_pages.json found above ${process.cwd()}`);
}

const CATALOG_DIR = process.env.CATALOG_DIR ?? findCatalogDir();

const LIVE_DIR = path.join(CATALOG_DIR, "live");

/** Node ids carry ':' from the Figma API and '-' in every catalog FILENAME. */
const tsvPath = path.join(LIVE_DIR, `${FILE_KEY}__${PAGE_ID.replace(":", "-")}.tsv`);

const readRows = () =>
  fs
    .readFileSync(tsvPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => l.split("\t"));

const manifestEntry = () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "_pages.json"), "utf8"));
  const entry = manifest.pages.find(
    (p: { fileKey: string; pageId: string }) => p.fileKey === FILE_KEY && p.pageId === PAGE_ID,
  );
  if (!entry) throw new Error(`live/_pages.json has no row for ${FILE_KEY} / ${PAGE_ID}`);
  return entry as { n: number };
};

describe("figma-catalog live harvest — Home 2", () => {
  it("records at least the 240 children measured on 2026-09-07", () => {
    // Fails against the 2026-08-26 snapshot's 168.
    expect(manifestEntry().n).toBeGreaterThanOrEqual(MEASURED_CHILDREN_2026_09_07);
  });

  it("has exactly as many TSV rows as the manifest claims", () => {
    // coverage.mjs's own guard, restated where a stale `n` cannot satisfy it by
    // being lowered: the floor above and this equality have to hold together.
    expect(readRows().length).toBe(manifestEntry().n);
  });

  it("carries six columns and a colon-form node id on every row", () => {
    const rows = readRows();
    const wrongWidth = rows.filter((r) => r.length !== 6);
    expect(wrongWidth).toEqual([]);

    const badId = rows.map((r) => r[0]).filter((id) => !/^\d+:\d+$/.test(id));
    expect(badId).toEqual([]);

    const badVisible = rows.map((r) => r[5]).filter((v) => v !== "0" && v !== "1");
    expect(badVisible).toEqual([]);
  });

  it("lists every node once — a duplicate would pad the count without adding a frame", () => {
    const ids = readRows().map((r) => r[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("still resolves every id the 2026-08-26 snapshot catalogued", () => {
    // Growth is safe; a DROPPED id orphans the hand-set implFiles/status/notes
    // keyed to it, so the two directions are reported separately, never netted.
    const ids = new Set(readRows().map((r) => r[0]));
    const snapshotIds = [
      "13008:110719", // Directory — first row of the 2026-08-26 harvest
      "13008:113198", // Plans - long view
      "13008:116519", // X accounts - My list
      "13008:119800", // Skai PDF Invoice - 612 x 792px
      "13008:124957", // X accounts - My list - mobile
      "13008:130217", // Backtesting > All backtests 1VH (375 x 812px)
      "13449:191022", // Notes — last row of the 2026-08-26 harvest
    ];
    expect(snapshotIds.filter((id) => !ids.has(id))).toEqual([]);
  });
});
