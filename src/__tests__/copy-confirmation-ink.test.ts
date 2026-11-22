/**
 * Report a56400fe: a copy confirmation is the copy mark turning into a check
 * in the mark's own ink. CopyButton turned its check green and the AI chat
 * drew a white one, and an earlier app fix (eab2cc76) had made the green the
 * rule, so this guards the direction for every copy control in this library.
 *
 * It reads each swap of the form `copied ? <check> : <copy mark>`, where the
 * check is a Check icon or an inline svg drawing the check path, and fails
 * when the check carries a green, or a Sky Blue its copy mark does not carry.
 * It also fails when a class list turns green on a copied state, which is how
 * CopyButton and the landing referral card painted theirs.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(__dirname, "..");

const GREEN = /#2dedad|#17f9b4|(?<![\w-])text-(?:green|emerald)-\d|skai-green|alien-green/i;
const SKY = /sky-blue|#56c7f3/i;

/** A copied condition, then `?`, then (maybe in parens or a fragment) the check. */
const SWAP =
  /\b[\w.]*[cC]opied\w*\b[^?\n{}]{0,60}\?\s*\(?\s*(?:<>\s*)?(<[\w.]*Check\w*\b[^>]*>|<svg\b[\s\S]*?<\/svg>)/g;
/** The other branch: the first element after the `:`, an svg whole. */
const MARK = /^[\s\S]{0,600}?:\s*\(?\s*(?:<>\s*)?(<svg\b[\s\S]*?<\/svg>|<(?!\/)[\w.]+\b[^>]*>)/;
const CHECK_PATH = "M20 6L9 17l-5-5";
/** A class literal chosen by a copied condition. */
const COPIED_CLASS = /[cC]opied[^?&\n]{0,60}\s*(?:\?|&&)\s*["'`]([^"'`]*)["'`]/g;

function sources(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(path.join(SRC, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") out.push(...sources(rel));
    } else if (/\.tsx$/.test(entry.name) && !/\.(test|spec|stories)\.tsx$/.test(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

type Swap = { at: string; check: string; mark: string };

function swapsIn(file: string, src: string): Swap[] {
  const out: Swap[] = [];
  for (const m of src.matchAll(SWAP)) {
    if (m[1].startsWith("<svg") && !m[1].includes(CHECK_PATH)) continue;
    const after = src.slice(m.index! + m[0].length);
    const line = src.slice(0, m.index!).split("\n").length;
    out.push({ at: `${file}:${line}`, check: m[1], mark: after.match(MARK)?.[1] ?? "" });
  }
  return out;
}

const FILES = ["components", "templates"]
  .flatMap((dir) => sources(dir))
  .map((file) => ({ file, src: readFileSync(path.join(SRC, file), "utf8") }));
const SWAPS = FILES.flatMap(({ file, src }) => swapsIn(file, src));

describe("a56400fe: a copied check takes its copy mark's ink", () => {
  it("finds the copy swaps it guards, CopyButton's among them", () => {
    // A guard that matches nothing passes everything.
    expect(SWAPS.length).toBeGreaterThanOrEqual(6);
    expect(SWAPS.some((s) => s.at.startsWith("components/utility/copy-button.tsx"))).toBe(true);
  });

  it("draws no copied check in a green", () => {
    expect(SWAPS.filter((s) => GREEN.test(s.check)).map((s) => `${s.at} ${s.check}`)).toEqual([]);
  });

  it("draws a copied check Sky Blue only where its copy mark is Sky Blue", () => {
    const off = SWAPS.filter((s) => SKY.test(s.check) && !SKY.test(s.mark));
    expect(off.map((s) => `${s.at} ${s.check} / ${s.mark}`)).toEqual([]);
  });

  it("turns no class list green on a copied state", () => {
    const green = FILES.flatMap(({ file, src }) =>
      [...src.matchAll(COPIED_CLASS)]
        .filter((m) => GREEN.test(m[1]))
        .map((m) => `${file}:${src.slice(0, m.index!).split("\n").length} ${m[1]}`),
    );
    expect(green).toEqual([]);
  });
});
