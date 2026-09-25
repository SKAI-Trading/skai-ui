/**
 * The files under dist/ that a consumer can resolve, read from package.json.
 *
 * ensure-dist.js used to keep these as a hand-written list, and the list fell
 * behind the package: the ./charts entry (60307db) was never added to it, so
 * an install with dist/charts.d.ts missing reported dist as up to date and
 * skipped the build, leaving `@skai/ui/charts` importers with TS7016. Reading
 * `main`, `module`, `types` and every `exports` target means a new entry is
 * covered the day it is declared.
 *
 * Wildcard targets ("./dist/*.js") are skipped: there is no single file to
 * look for.
 */
export function distArtifacts(pkg) {
  const found = new Set();

  const visit = (target) => {
    if (typeof target === "string") {
      const rel = target.replace(/^\.\//, "");
      if (rel.startsWith("dist/") && !rel.includes("*")) {
        found.add(rel.slice("dist/".length));
      }
      return;
    }
    if (target && typeof target === "object") {
      for (const value of Object.values(target)) visit(value);
    }
  };

  visit([pkg.main, pkg.module, pkg.types]);
  visit(pkg.exports);
  return [...found].sort();
}
