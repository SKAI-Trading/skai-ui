#!/usr/bin/env node

/**
 * @skai/ui Build Banner
 * Displays clean ASCII art and build info for the component library
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  red: "\x1b[31m",
};

const c = colors;

const skaiUILogo = `
${c.cyan}${c.bright}    ╔═╗╦╔═╔═╗╦  ${c.magenta}╦ ╦╦
${c.cyan}${c.bright}    ╚═╗╠╩╗╠═╣║  ${c.magenta}║ ║║
${c.cyan}${c.bright}    ╚═╝╩ ╩╩ ╩╩  ${c.magenta}╚═╝╩${c.reset}
`;

const divider = `${c.dim}${"─".repeat(60)}${c.reset}`;
const doubleDivider = `${c.cyan}${"═".repeat(60)}${c.reset}`;

function getPackageInfo() {
  try {
    const pkgPath = path.join(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return { name: pkg.name, version: pkg.version };
  } catch {
    return { name: "@skai/ui", version: "0.0.0" };
  }
}

function getGitInfo() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    const commit = execSync("git rev-parse --short HEAD", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    return { branch, commit };
  } catch {
    return { branch: "unknown", commit: "unknown" };
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getDistSize() {
  try {
    const distPath = path.join(__dirname, "..", "dist");
    if (!fs.existsSync(distPath)) return null;

    let totalSize = 0;
    const files = fs.readdirSync(distPath);

    for (const file of files) {
      const filePath = path.join(distPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        totalSize += stat.size;
      }
    }

    return {
      total: formatBytes(totalSize),
      fileCount: files.length,
    };
  } catch {
    return null;
  }
}

function showStartBanner() {
  const pkg = getPackageInfo();
  const git = getGitInfo();

  console.log();
  console.log(doubleDivider);
  console.log(skaiUILogo);
  console.log(
    `${c.dim}        Component Library for the SKAI Ecosystem${c.reset}`,
  );
  console.log(doubleDivider);
  console.log();
  console.log(
    `  ${c.yellow}📦${c.reset} ${c.bright}Building ${c.cyan}${pkg.name}${c.reset}${c.bright}@${pkg.version}${c.reset}`,
  );
  console.log();
  console.log(
    `  ${c.dim}├─${c.reset} Branch:   ${c.green}${git.branch}${c.reset}`,
  );
  console.log(
    `  ${c.dim}├─${c.reset} Commit:   ${c.blue}${git.commit}${c.reset}`,
  );
  console.log(`  ${c.dim}├─${c.reset} Bundler:  ${c.magenta}tsup${c.reset}`);
  console.log(
    `  ${c.dim}└─${c.reset} Output:   ${c.cyan}ESM + CJS + DTS${c.reset}`,
  );
  console.log();
  console.log(divider);
  console.log();
}

function showSuccessBanner(buildTime) {
  const pkg = getPackageInfo();
  const distInfo = getDistSize();

  console.log();
  console.log(doubleDivider);
  console.log(skaiUILogo);
  console.log(`  ${c.green}${c.bright}✓ BUILD SUCCESSFUL${c.reset}`);
  console.log();

  if (buildTime) {
    console.log(
      `  ${c.dim}├─${c.reset} Time:       ${c.yellow}${buildTime}${c.reset}`,
    );
  }

  if (distInfo) {
    console.log(
      `  ${c.dim}├─${c.reset} Size:       ${c.cyan}${distInfo.total}${c.reset} ${c.dim}(${distInfo.fileCount} files)${c.reset}`,
    );
  }

  console.log(
    `  ${c.dim}├─${c.reset} Package:    ${c.magenta}${pkg.name}@${pkg.version}${c.reset}`,
  );
  console.log(
    `  ${c.dim}├─${c.reset} Storybook:  ${c.blue}npm run dev${c.reset}`,
  );
  console.log(
    `  ${c.dim}└─${c.reset} Publish:    ${c.green}npm publish${c.reset}`,
  );
  console.log();
  console.log(`  ${c.dim}📚 Components exported:${c.reset}`);
  console.log(
    `  ${c.dim}   dist/index.js    ${c.reset}${c.cyan}(ESM)${c.reset}`,
  );
  console.log(
    `  ${c.dim}   dist/index.cjs   ${c.reset}${c.yellow}(CJS)${c.reset}`,
  );
  console.log(
    `  ${c.dim}   dist/index.d.ts  ${c.reset}${c.blue}(Types)${c.reset}`,
  );
  console.log(
    `  ${c.dim}   dist/styles.css  ${c.reset}${c.magenta}(CSS)${c.reset}`,
  );
  console.log(doubleDivider);
  console.log();
}

function showErrorBanner(error) {
  console.log();
  console.log(`${c.red}${"═".repeat(60)}${c.reset}`);
  console.log(skaiUILogo);
  console.log(`  ${c.red}${c.bright}✗ BUILD FAILED${c.reset}`);
  console.log();

  if (error) {
    console.log(`  ${c.dim}Error:${c.reset} ${c.red}${error}${c.reset}`);
  }

  console.log();
  console.log(`  ${c.yellow}Troubleshooting:${c.reset}`);
  console.log(`  ${c.dim}├─${c.reset} rm -rf dist node_modules`);
  console.log(`  ${c.dim}├─${c.reset} npm install`);
  console.log(`  ${c.dim}└─${c.reset} npm run build`);
  console.log(`${c.red}${"═".repeat(60)}${c.reset}`);
  console.log();
}

function showCSSBanner() {
  console.log();
  console.log(
    `  ${c.magenta}🎨${c.reset} ${c.bright}Building CSS...${c.reset}`,
  );
  console.log(
    `  ${c.dim}└─${c.reset} Tailwind CSS → ${c.cyan}dist/styles.css${c.reset}`,
  );
  console.log();
}

function showCSSSuccessBanner() {
  console.log(`  ${c.green}✓${c.reset} CSS compiled successfully`);
  console.log();
}

// Get the command from args
const command = process.argv[2];

switch (command) {
  case "start":
    showStartBanner();
    break;
  case "success":
    showSuccessBanner(process.argv[3]);
    break;
  case "error":
    showErrorBanner(process.argv[3]);
    break;
  case "css":
    showCSSBanner();
    break;
  case "css-done":
    showCSSSuccessBanner();
    break;
  default:
    showStartBanner();
}
