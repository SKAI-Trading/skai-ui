#!/usr/bin/env node

/**
 * @skai-trade/ui — install-time dist guard (npm `prepare` hook)
 *
 * WHY THIS EXISTS
 * `dist/` is gitignored, but package.json points `types` (and every
 * `exports[...].types`) at `./dist/*.d.ts`. A fresh `git clone` + `npm ci`
 * therefore leaves consumers with a package that has NO declaration files, and
 * every `import ... from "@skai-trade/ui"` fails typecheck with TS7016
 * ("Could not find a declaration file for module"), cascading into TS7006
 * implicit-any errors on handler params. Nothing about the consumer's own code
 * is wrong — the sibling package simply was never built.
 *
 * npm runs `prepare` for `file:` linked dependencies (verified on npm 11 for
 * both `npm install` and `npm ci`), in this package's own directory, after the
 * dependency tree is on disk. So this is the hook that turns
 * "clone + install" into a typecheckable consumer with no manual out-of-band
 * `npm run build` in this submodule.
 *
 * BEHAVIOUR
 *   - dist already present and newer than every build input -> skip (fast, and
 *     keeps `prepublishOnly` -> `build:quiet` from being rebuilt underneath).
 *   - build toolchain not resolvable (e.g. `--omit=dev` production install)
 *     -> warn loudly, exit 0. Never turn a missing optional build into a
 *     failed install.
 *   - build fails -> warn loudly with the remedy, exit 0. Consumers will still
 *     see the real error from their own typecheck; breaking `npm ci` for the
 *     whole workspace is worse.
 *   - SKAI_UI_SKIP_PREPARE=1 -> skip entirely (for CI jobs that build
 *     explicitly, or to shave install time when dist is irrelevant).
 */

import { spawnSync } from "child_process";
import { existsSync, readdirSync, renameSync, rmSync, statSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, "..");
const distDir = path.join(pkgRoot, "dist");

const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

const log = (msg) => console.log(`  ${c.cyan}[ui]${c.reset} ${msg}`);
const warn = (msg) => console.warn(`  ${c.yellow}[ui]${c.reset} ${msg}`);

/** Artifacts every consumer entry point resolves to. Missing any -> rebuild. */
const REQUIRED = [
  "index.js",
  "index.cjs",
  "index.d.ts",
  "icons.js",
  "icons.cjs",
  "icons.d.ts",
  "motion.js",
  "motion.cjs",
  "motion.d.ts",
  "styles.css",
];

/** Files/dirs whose mtime invalidates dist. */
const INPUTS = [
  "src",
  "assets",
  "tsup.config.ts",
  "tsconfig.json",
  "tailwind.config.ts",
  "package.json",
];

function newestMtime(target) {
  let newest = 0;
  const walk = (p) => {
    let st;
    try {
      st = statSync(p);
    } catch {
      return;
    }
    if (st.isDirectory()) {
      for (const entry of readdirSync(p)) {
        if (entry === "node_modules" || entry === ".git") continue;
        walk(path.join(p, entry));
      }
      return;
    }
    if (st.mtimeMs > newest) newest = st.mtimeMs;
  };
  walk(target);
  return newest;
}

function distIsFresh() {
  const missing = REQUIRED.filter((f) => !existsSync(path.join(distDir, f)));
  if (missing.length > 0)
    return { fresh: false, reason: `missing ${missing.join(", ")}` };

  let oldestArtifact = Infinity;
  for (const f of REQUIRED) {
    const m = statSync(path.join(distDir, f)).mtimeMs;
    if (m < oldestArtifact) oldestArtifact = m;
  }

  let newestInput = 0;
  let culprit = null;
  for (const input of INPUTS) {
    const m = newestMtime(path.join(pkgRoot, input));
    if (m > newestInput) {
      newestInput = m;
      culprit = input;
    }
  }

  if (newestInput > oldestArtifact) {
    return { fresh: false, reason: `${culprit} is newer than dist` };
  }
  return { fresh: true };
}

/** Packages the build needs. tsup loads typescript for the dts pass. */
const BUILD_TOOLS = ["tsup", "tailwindcss", "typescript"];

/**
 * The tools may live in this package's node_modules OR be hoisted to a
 * consumer's root. Node's resolver walks up, so createRequire from this file
 * covers both.
 */
function missingTools() {
  const require = createRequire(import.meta.url);
  return BUILD_TOOLS.filter((dep) => {
    try {
      require.resolve(`${dep}/package.json`);
      return false;
    } catch {
      return true;
    }
  });
}

/**
 * npm only installs a `file:` link's devDependencies when the link target sits
 * inside the consumer's own directory tree. A sibling consumer (e.g.
 * `"@skai-trade/ui": "file:../skai-ui"`) gets none of them, so without this the
 * build tools are simply absent and dist can never be produced.
 *
 * This installs this package's own dev tree — the same thing the manual
 * `cd modules/skai-ui && npm install` step did — preferring `npm ci` so the
 * committed lock decides versions and nothing writes back to it. react and
 * react-dom are then dropped, because leaving a second copy of react resolvable
 * from this package is what gives consumers duplicate React contexts (the
 * reason consumers strip them post-install today).
 */
function installBuildDeps() {
  // `npm ci` first: it honours the committed lock and never writes to it.
  // `npm install` is the fallback for a lock that has drifted out of sync with
  // package.json, where ci refuses to run at all. A lock-free install is not an
  // option here — resolving this tree from scratch trips an ERESOLVE peer
  // conflict that only the lock resolves.
  const attempts = [
    ["ci", "--no-audit", "--no-fund"],
    ["install", "--no-audit", "--no-fund"],
  ];

  let ok = false;
  for (const args of attempts) {
    log(`installing build dependencies ${c.dim}(npm ${args[0]})${c.reset}`);
    const res = spawnSync("npm", args, {
      cwd: pkgRoot,
      stdio: "inherit",
      shell: true,
      // Stops this install's own `prepare` from recursing back into here.
      env: { ...process.env, SKAI_UI_SKIP_PREPARE: "1" },
    });
    if (res.status === 0) {
      ok = true;
      break;
    }
  }

  // A second resolvable copy of react under this package is what gives
  // consumers duplicate React contexts, so drop the dev-only copies the install
  // just placed here (consumers strip these post-install for the same reason).
  for (const dep of ["react", "react-dom"]) {
    rmSync(path.join(pkgRoot, "node_modules", dep), {
      recursive: true,
      force: true,
    });
  }
  return ok;
}

function main() {
  if (process.env.SKAI_UI_SKIP_PREPARE === "1") {
    log(`dist build skipped ${c.dim}(SKAI_UI_SKIP_PREPARE=1)${c.reset}`);
    return;
  }

  const { fresh, reason } = distIsFresh();
  if (fresh) {
    log(`dist is up to date ${c.dim}(skipping build)${c.reset}`);
    return;
  }

  let missing = missingTools();
  if (missing.length > 0) {
    installBuildDeps();
    missing = missingTools();
  }
  if (missing.length > 0) {
    warn(`cannot build dist (${reason}): ${missing.join(", ")} unavailable.`);
    warn(
      `consumers will hit TS7016 on "@skai-trade/ui" imports. Fix with:` +
        ` cd ${path.relative(process.cwd(), pkgRoot) || "."} && npm install && npm run build`
    );
    return;
  }

  log(`building dist ${c.dim}(${reason})${c.reset}`);

  // tsup runs with `clean: true`, so it deletes dist before it knows whether the
  // dts pass will succeed. A failing build would otherwise leave consumers worse
  // off than before this hook existed (a previously-good dist replaced by a
  // JS-only one). Hold the old dist aside and put it back on failure.
  const stash = path.join(pkgRoot, ".dist-prepare-backup");
  rmSync(stash, { recursive: true, force: true });
  const hadDist = existsSync(distDir);
  if (hadDist) renameSync(distDir, stash);

  const res = spawnSync("npm", ["run", "build"], {
    cwd: pkgRoot,
    stdio: "inherit",
    shell: true,
  });

  if (res.status !== 0) {
    warn(`dist build failed (exit ${res.status ?? "signal " + res.signal}).`);
    if (hadDist) {
      rmSync(distDir, { recursive: true, force: true });
      renameSync(stash, distDir);
      warn(`kept the previous dist — consumers are no worse off than before.`);
    } else {
      warn(
        `consumers will hit TS7016 on "@skai-trade/ui" imports until this is` +
          ` fixed. Reproduce with: cd ${path.relative(process.cwd(), pkgRoot) || "."} && npm run build`
      );
    }
    return;
  }

  rmSync(stash, { recursive: true, force: true });
  log(`${c.green}dist ready${c.reset}`);
}

main();
