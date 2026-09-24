import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { distArtifacts } from "../../scripts/dist-artifacts.js";

/**
 * The install hook (scripts/ensure-dist.js) rebuilds dist when one of these
 * files is missing. Its list used to be written by hand and never gained the
 * ./charts entry, so with dist/charts.d.ts gone it printed "dist is up to date"
 * and every `@skai/ui/charts` import failed typecheck with TS7016.
 *
 * Mutation-check: put the old hand-written list back in ensure-dist.js and
 * return it from distArtifacts; the first test must go red on charts.*.
 */
const ROOT = path.resolve(__dirname, "..", "..");
const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));

describe("distArtifacts", () => {
  it("requires the declarations, ESM and CJS files of every entry, charts included", () => {
    const required = distArtifacts(pkg);
    for (const entry of ["index", "icons", "motion", "charts"]) {
      expect(required).toContain(`${entry}.d.ts`);
      expect(required).toContain(`${entry}.js`);
      expect(required).toContain(`${entry}.cjs`);
    }
    expect(required).toContain("styles.css");
  });

  it("requires every types file package.json points a consumer at", () => {
    const required = distArtifacts(pkg);
    const typesTargets = [
      pkg.types,
      ...Object.values(pkg.exports).flatMap((target) =>
        typeof target === "object" && target !== null
          ? [(target as { types?: string }).types]
          : []
      ),
    ].filter((t): t is string => typeof t === "string");

    expect(typesTargets.length).toBeGreaterThan(1);
    for (const target of typesTargets) {
      expect(required).toContain(target.replace(/^\.\/dist\//, ""));
    }
  });

  it("picks up an entry the day it is declared, through nested conditions", () => {
    const required = distArtifacts({
      main: "./dist/index.cjs",
      exports: {
        ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
        "./tables": {
          import: { types: "./dist/tables.d.ts", default: "./dist/tables.js" },
          require: { types: "./dist/tables.d.cts", default: "./dist/tables.cjs" },
        },
        "./package.json": "./package.json",
        "./fonts/*": "./dist/fonts/*.woff2",
      },
    });

    expect(required).toEqual([
      "index.cjs",
      "index.d.ts",
      "index.js",
      "tables.cjs",
      "tables.d.cts",
      "tables.d.ts",
      "tables.js",
    ]);
  });
});
