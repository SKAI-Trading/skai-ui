/**
 * Guards the dialog primitive against a class of defect that is invisible in a
 * screenshot and invisible in a diff review: the same utility written twice, once
 * bare and once behind a responsive variant.
 *
 * `rounded-lg sm:rounded-lg` renders exactly like `rounded-lg` alone, so nothing
 * about the primitive's own appearance ever looks wrong. What it changes is what
 * a CALLER can do. `cn` is `twMerge(clsx(...))`, and tailwind-merge resolves
 * conflicts per variant group: a caller's unprefixed `rounded-[16px]` displaces
 * the bare `rounded-lg` and leaves `sm:rounded-lg` standing. Tailwind emits its
 * `min-width: 640px` block after the base layer, both selectors are one class
 * deep, so source order decides and the primitive wins from 640px up. The
 * caller's radius is then drawn on a phone and nowhere else.
 *
 * Measured 2026-09-01 before the duplicate came out: 22 of 244 `DialogContent`
 * call sites passed an unprefixed radius with no `sm:` counterpart and were
 * rendering 12px above 640 instead of the 16/24/32 they asked for. Fourteen more
 * had already discovered the lock and were paying for it with a hand-written
 * `sm:rounded-[...]` restatement.
 *
 * ORACLE DISCIPLINE. Class assertions here compare exact members of the split
 * class list, never substrings: `toContain("rounded-lg")` on a raw className
 * string is satisfied by `sm:rounded-lg`, which is the very token this file
 * exists to catch. Bans are written against the BASE utility with variant
 * prefixes stripped, so a future `md:rounded-lg` cannot slip past a ban aimed at
 * `sm:`.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../components/overlays/dialog";

/** Tailwind's min-width breakpoint variants. */
const RESPONSIVE_VARIANTS = new Set(["sm", "md", "lg", "xl", "2xl"]);

/**
 * Split a class into its variant chain and the utility it applies.
 *
 * Only colons at bracket depth zero separate variants, so `data-[state=open]:`,
 * `[&>button]:` and `w-[calc(100%-2rem)]` survive intact.
 */
function splitVariants(token: string): { variants: string[]; utility: string } {
  const variants: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) {
      variants.push(token.slice(start, i));
      start = i + 1;
    }
  }
  return { variants, utility: token.slice(start) };
}

/** Exact class tokens. Never assert against the raw className string. */
const tokensOf = (el: Element): string[] =>
  el.className.split(/\s+/).filter(Boolean);

/** The utility a class applies, with every variant prefix removed. */
const baseUtility = (token: string): string => splitVariants(token).utility;

/**
 * Utilities written both bare and behind a min-width breakpoint, or behind two
 * different breakpoints. Every such pair is a lock: identical rendering, and the
 * property can no longer be overridden from outside without guessing the exact
 * prefix.
 */
function findVariantDuplicates(classes: string[]): string[] {
  const byUtility = new Map<string, string[]>();
  for (const token of classes) {
    const { variants, utility } = splitVariants(token);
    const isBare = variants.length === 0;
    const isResponsiveOnly =
      variants.length === 1 && RESPONSIVE_VARIANTS.has(variants[0]);
    if (!isBare && !isResponsiveOnly) continue;
    const bucket = byUtility.get(utility) ?? [];
    bucket.push(token);
    byUtility.set(utility, bucket);
  }
  return [...byUtility.values()]
    .filter((bucket) => bucket.length > 1)
    .map((bucket) => bucket.join(" + "));
}

function renderDialog(className?: string) {
  render(
    <Dialog defaultOpen>
      <DialogContent className={className}>
        <DialogTitle>t</DialogTitle>
      </DialogContent>
    </Dialog>,
  );
  return screen.getByRole("dialog");
}

describe("splitVariants", () => {
  it("cuts only on colons outside brackets", () => {
    expect(splitVariants("rounded-lg")).toEqual({
      variants: [],
      utility: "rounded-lg",
    });
    expect(splitVariants("sm:rounded-lg")).toEqual({
      variants: ["sm"],
      utility: "rounded-lg",
    });
    expect(splitVariants("data-[state=open]:animate-in")).toEqual({
      variants: ["data-[state=open]"],
      utility: "animate-in",
    });
    expect(splitVariants("[&>button]:top-6")).toEqual({
      variants: ["[&>button]"],
      utility: "top-6",
    });
    expect(splitVariants("w-[calc(100%-2rem)]")).toEqual({
      variants: [],
      utility: "w-[calc(100%-2rem)]",
    });
  });
});

describe("findVariantDuplicates", () => {
  it("flags a utility restated behind a breakpoint", () => {
    expect(findVariantDuplicates(["rounded-lg", "sm:rounded-lg"])).toEqual([
      "rounded-lg + sm:rounded-lg",
    ]);
    expect(findVariantDuplicates(["md:p-6", "lg:p-6"])).toEqual([
      "md:p-6 + lg:p-6",
    ]);
  });

  it("leaves a genuine responsive step alone", () => {
    expect(findVariantDuplicates(["p-4", "sm:p-6"])).toEqual([]);
    expect(findVariantDuplicates(["rounded-none", "sm:rounded-[16px]"])).toEqual(
      [],
    );
  });

  it("does not mistake a state variant for a breakpoint restatement", () => {
    // `data-[state=open]:` and `motion-reduce:` are not min-width ranges, so a
    // utility repeated across them is not the lock this guard is about.
    expect(
      findVariantDuplicates(["animate-none", "motion-reduce:animate-none"]),
    ).toEqual([]);
  });
});

describe("DialogContent does not lock its own utilities", () => {
  it("carries no utility written both bare and behind a breakpoint", () => {
    const dialog = renderDialog();
    expect(findVariantDuplicates(tokensOf(dialog))).toEqual([]);
  });

  it("carries no locked utility anywhere in the rendered dialog", () => {
    renderDialog();
    const offenders: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      if (typeof el.className !== "string") continue;
      const dupes = findVariantDuplicates(tokensOf(el));
      if (dupes.length) offenders.push(`${el.tagName}: ${dupes.join(", ")}`);
    }
    expect(offenders).toEqual([]);
  });

  it("states its radius once, bare, so any caller can reach it", () => {
    const classes = tokensOf(renderDialog());
    expect(classes.filter((c) => c === "rounded-lg")).toHaveLength(1);
    expect(classes).not.toContain("sm:rounded-lg");
  });
});

describe("a caller's radius survives at every width", () => {
  it("an unprefixed radius displaces the primitive's radius entirely", () => {
    const classes = tokensOf(renderDialog("rounded-[16px]"));

    expect(classes).toContain("rounded-[16px]");
    // Negative assertions strip the variant, so `md:rounded-lg` would fail here
    // too. A ban spelled `not.toContain("sm:rounded-lg")` would not.
    expect(classes.map(baseUtility)).not.toContain("rounded-lg");
  });

  it("leaves a caller's own breakpoint ramp intact", () => {
    const classes = tokensOf(
      renderDialog("rounded-[16px] md:rounded-[24px] lg:rounded-[32px]"),
    );
    expect(classes).toContain("rounded-[16px]");
    expect(classes).toContain("md:rounded-[24px]");
    expect(classes).toContain("lg:rounded-[32px]");
    expect(classes.map(baseUtility)).not.toContain("rounded-lg");
  });

  it("keeps an existing sm: restatement working", () => {
    // Fourteen call sites wrote `sm:rounded-[16px]` to break the old lock. The
    // lock is gone and those lines are now redundant, but they must keep
    // rendering the same radius rather than reintroducing a step.
    const classes = tokensOf(renderDialog("rounded-[16px] sm:rounded-[16px]"));
    expect(classes).toContain("rounded-[16px]");
    expect(classes).toContain("sm:rounded-[16px]");
    expect(classes.map(baseUtility)).not.toContain("rounded-lg");
  });
});

describe("the padding ramp is a real step and is unchanged", () => {
  it("keeps p-4 with an sm:p-6 step", () => {
    const classes = tokensOf(renderDialog());
    expect(classes).toContain("p-4");
    expect(classes).toContain("sm:p-6");
  });

  it("records that a caller's unprefixed padding still cannot reach sm:p-6", () => {
    // Not a lock in the radius sense — `sm:p-6` differs from `p-4`, so it is a
    // deliberate responsive step, and removing it would repad every dialog in
    // the app. It does mean an unprefixed `p-3` only holds below 640; a caller
    // wanting 12px throughout must write `sm:p-3` as well. Whether this ramp
    // should hinge on `md:` (768, a breakpoint the frames are actually read at)
    // instead of `sm:` (640) is a product decision, not a lane's: 200 of 244
    // call sites pass no padding at all and would all shift.
    const classes = tokensOf(renderDialog("p-3"));
    expect(classes).toContain("p-3");
    expect(classes).not.toContain("p-4");
    expect(classes).toContain("sm:p-6");
  });
});
