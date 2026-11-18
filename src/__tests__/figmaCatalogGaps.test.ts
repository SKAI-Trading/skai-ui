import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * figma-catalog/gaps.tsv is published: skai.trade/status shows each line under
 * its page, so a tester can tell a known gap from a new bug. Nothing but this
 * suite runs on the way to that page (the pipeline's catalog:check is a hand
 * step), so it runs both halves of gaps.mjs here: its own rule cases, and the
 * committed table checked against the committed catalog.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GAPS = path.resolve(HERE, "../../figma-catalog/gaps.mjs");

const run = (...args: string[]) => {
  const r = spawnSync(process.execPath, [GAPS, ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  return { status: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
};

describe("figma-catalog gap lines", () => {
  it("keep their rules: every self-test case passes", () => {
    const { status, out } = run("--self-test");
    expect(out).not.toContain("FAIL");
    expect(out).toMatch(/self-test: (\d+)\/\1 passed\./);
    expect(status).toBe(0);
  });

  it("hold in the committed table: no line that is not plain, no frame with two, none for a frame the catalog lacks", () => {
    const { status, out } = run();
    expect(out).toMatch(/gaps\.tsv: \d+ line\(s\) for \d+ open in-scope frame\(s\)\./);
    expect(out).not.toContain("refused");
    expect(status).toBe(0);
  });
});
