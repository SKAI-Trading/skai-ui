#!/usr/bin/env node
/**
 * remaining.mjs — print node-ids in a section that still lack a real title.
 * Usage: node figma-catalog/remaining.mjs <section> [limit]
 * A node "has a title" if it appears in <section>.titles.tsv with a non-ERROR value.
 * ERROR rows are treated as still-remaining (so they get retried).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const section = process.argv[2];
const limit = process.argv[3] ? +process.argv[3] : Infinity;
if (!section) {
  console.error("usage: node remaining.mjs <section> [limit]");
  process.exit(1);
}

const nodes = fs.readFileSync(path.join(DIR, `${section}.nodes.txt`), "utf8")
  .split("\n").map((l) => l.trim()).filter(Boolean);

const done = new Set();
const tsv = path.join(DIR, `${section}.titles.tsv`);
if (fs.existsSync(tsv)) {
  for (const line of fs.readFileSync(tsv, "utf8").split("\n")) {
    const t = line.indexOf("\t");
    if (t < 0) continue;
    const id = line.slice(0, t).trim();
    const title = line.slice(t + 1).trim();
    if (title && title !== "ERROR") done.add(id);
  }
}

const remaining = nodes.filter((n) => !done.has(n));
process.stderr.write(`${section}: ${done.size}/${nodes.length} titled, ${remaining.length} remaining\n`);
console.log(remaining.slice(0, limit).join("\n"));
