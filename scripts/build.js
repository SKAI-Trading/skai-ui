#!/usr/bin/env node

/**
 * @skai/ui Build Script
 * Runs the full build with timing and clean output
 */

import { spawn } from "child_process";
import { cpSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

const c = colors;

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: options.silent ? "pipe" : "inherit",
      shell: true,
      cwd: path.join(__dirname, ".."),
    });

    let stdout = "";
    let stderr = "";

    if (options.silent) {
      proc.stdout?.on("data", (data) => {
        stdout += data.toString();
      });
      proc.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
    }

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with code ${code}\n${stderr}`));
      }
    });

    proc.on("error", reject);
  });
}

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

async function build() {
  const startTime = Date.now();

  try {
    // Show start banner
    await runCommand("node", ["scripts/build-banner.js", "start"]);

    // Step 1: TypeScript build with tsup
    console.log(`  ${c.cyan}→${c.reset} Compiling TypeScript...`);
    const tsupStart = Date.now();
    await runCommand("npx", ["tsup"], { silent: true });
    console.log(
      `  ${c.green}✓${c.reset} TypeScript compiled ${c.dim}(${formatTime(Date.now() - tsupStart)})${c.reset}`,
    );

    // Step 2: CSS build with Tailwind
    console.log(`  ${c.magenta}→${c.reset} Building CSS...`);
    const cssStart = Date.now();
    await runCommand(
      "npx",
      [
        "tailwindcss",
        "-i",
        "./src/styles/index.css",
        "-o",
        "./dist/styles.css",
        "--minify",
      ],
      { silent: true },
    );
    console.log(
      `  ${c.green}✓${c.reset} CSS compiled ${c.dim}(${formatTime(Date.now() - cssStart)})${c.reset}`,
    );

    // Step 3: Copy static assets (share images, etc.)
    const assetsDir = path.join(__dirname, "..", "assets");
    const distAssetsDir = path.join(__dirname, "..", "dist", "assets");
    if (existsSync(assetsDir)) {
      cpSync(assetsDir, distAssetsDir, { recursive: true });
      console.log(`  ${c.green}✓${c.reset} Static assets copied`);
    }

    console.log();

    // Calculate total time
    const totalTime = formatTime(Date.now() - startTime);

    // Show success banner with timing
    await runCommand("node", ["scripts/build-banner.js", "success", totalTime]);

    process.exit(0);
  } catch (error) {
    console.error(`\n  ${c.red}✗${c.reset} ${error.message}`);
    await runCommand("node", [
      "scripts/build-banner.js",
      "error",
      error.message,
    ]);
    process.exit(1);
  }
}

build();
