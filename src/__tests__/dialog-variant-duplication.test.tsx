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
import type { ReactElement } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import resolveConfig from "tailwindcss/resolveConfig";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/overlays/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/feedback/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../components/overlays/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../components/layout/drawer";

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

/**
 * AlertDialogContent shipped the same shape one step further along: its radius
 * existed ONLY as `sm:rounded-lg`, with no bare class beside it. Two consequences,
 * and the first is the one a user sees.
 *
 *   1. Below 640 the element had no radius at all, so all 26 call sites drew
 *      square corners on every phone.
 *   2. A caller's own unprefixed radius could not evict an `sm:` class, so the
 *      12px won above 640 regardless of what the caller asked for.
 *
 * The radius is now bare, which fixes both at once and changes nothing about the
 * width where it already rendered.
 */
function renderAlert(callerClass?: string): Element {
  render(
    <AlertDialog open>
      <AlertDialogContent className={callerClass}>
        <AlertDialogTitle>t</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>,
  );
  return screen.getByText("t").closest("[role=alertdialog]") as Element;
}

describe("AlertDialogContent states its radius at every width", () => {
  it("carries no utility written both bare and behind a breakpoint", () => {
    expect(findVariantDuplicates(tokensOf(renderAlert()))).toEqual([]);
  });

  it("draws a radius on a phone, not only from sm: up", () => {
    const classes = tokensOf(renderAlert());
    expect(classes).toContain("rounded-lg");
    // The bug: stated only behind sm:, every width below 640 fell back to 0.
    expect(classes).not.toContain("sm:rounded-lg");
  });

  it("lets a caller's unprefixed radius displace it entirely", () => {
    const classes = tokensOf(renderAlert("rounded-[16px]"));
    expect(classes).toContain("rounded-[16px]");
    expect(classes.map(baseUtility).filter((u) => u === "rounded-lg")).toEqual([]);
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
    // wanting 12px throughout must write `sm:p-3` as well. The measurement that
    // keeps this ramp on `sm:` rather than moving it is recorded with the rest
    // of the hinge decisions below.
    const classes = tokensOf(renderDialog("p-3"));
    expect(classes).toContain("p-3");
    expect(classes).not.toContain("p-4");
    expect(classes).toContain("sm:p-6");
  });
});

/**
 * ─── WHERE EACH RULE HINGES ────────────────────────────────────────────────
 *
 * The boards are drawn at 375, 768 and 1440. Tailwind's `sm:` is 640, which is
 * not one of them, so a two-value rule hung off `sm:` applies its upper value
 * across a 128px band no board describes. Where a rule's two values come off
 * the phone board and the tablet board, the phone value is in force to 767 and
 * the rule belongs on `md:`.
 *
 * That reasoning decides the side-panel cap and nothing else in these four
 * files. The rest keep `sm:`, and the measurement for each is recorded on its
 * own test rather than in a list that can drift away from the code.
 *
 * THE CAP. `sheetVariants` and `drawerContentVariants` cap `side="left"` and
 * `side="right"` at `max-w-sm`, 384px, against a panel that is otherwise
 * `w-3/4`. The measured panels ramp 359 -> 442 between the 375 and 768 boards
 * and hold 442 to 1440 (Trench right-menus 13006:310854 / 13006:332803; the
 * chat-settings panel reads the same pair), so 442 is a tablet-up number and
 * the cap starts where the tablet board does. On `sm:` it also made a wider
 * viewport draw a NARROWER panel — `w-3/4` reaches 479 at 639 and the cap cut
 * it to 384 at 640 — which is the shape of the "panel is cut off / too narrow"
 * complaints these panels collected.
 *
 * READING THE HINGE, NOT THE STRING. `effectiveAt` merges through the same `cn`
 * production uses and then resolves per width, so these assertions measure what
 * the browser paints rather than what the source says. A class-list assertion
 * is green on both sides of a breakpoint; a width ladder is not.
 */

const TW = resolveConfig({ content: [] });

/** Tailwind's min-width scale, read rather than restated. */
const BREAKPOINT_PX: Record<string, number> = {
  "": 0,
  ...Object.fromEntries(
    Object.entries(TW.theme?.screens as Record<string, string>).map(
      ([name, value]) => [`${name}:`, parseFloat(value)],
    ),
  ),
};

/**
 * The utility that actually paints `prop` at `width`, after the merge.
 *
 * Tailwind emits the unprefixed block first and each `@media` block after it,
 * so among the utilities whose breakpoint has been reached the winner is the
 * one at the largest breakpoint. `null` means the property is unset there.
 */
function effectiveAt(
  classes: string[],
  prop: RegExp,
  width: number,
): string | null {
  let best: string | null = null;
  let bestBp = -1;
  for (const token of classes) {
    const { variants, utility } = splitVariants(token);
    if (variants.length > 1) continue;
    const prefix = variants.length === 1 ? `${variants[0]}:` : "";
    const bp = BREAKPOINT_PX[prefix];
    if (bp === undefined || bp > width) continue;
    if (!prop.test(utility)) continue;
    if (bp >= bestBp) {
      bestBp = bp;
      best = utility;
    }
  }
  return best;
}

const MAX_WIDTH = /^max-w-/;

/** The ladder straddles both candidate hinges, so either one moving shows up. */
const LADDER = [375, 639, 640, 641, 767, 768, 769, 1440];

function renderSheet(side: "left" | "right", className?: string): Element {
  render(
    <Sheet defaultOpen>
      <SheetContent side={side} className={className}>
        <SheetTitle>t</SheetTitle>
      </SheetContent>
    </Sheet>,
  );
  return screen.getByRole("dialog");
}

function renderDrawer(side: "left" | "right", className?: string): Element {
  render(
    <Drawer defaultOpen>
      <DrawerContent side={side} className={className}>
        <DrawerTitle>t</DrawerTitle>
      </DrawerContent>
    </Drawer>,
  );
  return screen.getByRole("dialog");
}

describe("the ladder these assertions are read against", () => {
  it("is Tailwind's own scale, so a moved breakpoint fails here first", () => {
    // If someone re-scales the project's breakpoints, every width below means
    // something different. This is the instrument check for that.
    expect(BREAKPOINT_PX["sm:"]).toBe(640);
    expect(BREAKPOINT_PX["md:"]).toBe(768);
    expect(BREAKPOINT_PX["lg:"]).toBe(1024);
  });

  it("resolves max-w-sm to the 384 the frames are compared against", () => {
    const scale = TW.theme?.maxWidth as Record<string, string>;
    expect(parseFloat(scale.sm) * 16).toBe(384);
  });
});

describe("the side-panel cap starts at the tablet board", () => {
  const sides = ["left", "right"] as const;

  it.each(sides)("SheetContent side=%s states the cap once, at md:", (side) => {
    const capped = tokensOf(renderSheet(side)).filter(
      (c) => baseUtility(c) === "max-w-sm",
    );
    // Exhaustive rather than a ban: this fails on `sm:max-w-sm`, on a bare
    // `max-w-sm`, and on any pair of the two.
    expect(capped).toEqual(["md:max-w-sm"]);
  });

  it.each(sides)("DrawerContent side=%s states the cap once, at md:", (side) => {
    const capped = tokensOf(renderDrawer(side)).filter(
      (c) => baseUtility(c) === "max-w-sm",
    );
    expect(capped).toEqual(["md:max-w-sm"]);
  });

  it.each(sides)(
    "leaves side=%s uncapped through the whole 640-767 band",
    (side) => {
      const classes = tokensOf(renderSheet(side));
      const applied = LADDER.map((w) => [w, effectiveAt(classes, MAX_WIDTH, w)]);
      // The decisive rows are 641 and 767: on `sm:` they read "max-w-sm", and
      // the panel there is narrower than it was one pixel below 640.
      expect(applied).toEqual([
        [375, null],
        [639, null],
        [640, null],
        [641, null],
        [767, null],
        [768, "max-w-sm"],
        [769, "max-w-sm"],
        [1440, "max-w-sm"],
      ]);
    },
  );

  it("holds the drawer to the same ladder as its twin", () => {
    // The two variants are the same rule written twice; a drift between them
    // only surfaces when someone finally mounts the drawer.
    const sheet = tokensOf(renderSheet("right"));
    const drawer = tokensOf(renderDrawer("right"));
    for (const w of LADDER) {
      expect(effectiveAt(drawer, MAX_WIDTH, w), `at ${w}px`).toBe(
        effectiveAt(sheet, MAX_WIDTH, w),
      );
    }
  });
});

describe("what a caller has to write to beat the cap", () => {
  it("an md: cap of its own displaces the primitive's entirely", () => {
    const classes = tokensOf(renderSheet("right", "md:max-w-[442px]"));
    expect(classes.filter((c) => baseUtility(c) === "max-w-sm")).toEqual([]);
    expect(effectiveAt(classes, MAX_WIDTH, 768)).toBe("max-w-[442px]");
    expect(effectiveAt(classes, MAX_WIDTH, 1440)).toBe("max-w-[442px]");
  });

  it("an unprefixed cap of its own is still outranked from 768 up", () => {
    // tailwind-merge scopes conflicts per variant chain, so a bare `max-w-*`
    // and the primitive's `md:` one are separate groups and both survive. This
    // is the whole reason the cap has to be answered at its own breakpoint.
    const classes = tokensOf(renderSheet("right", "max-w-none"));
    expect(effectiveAt(classes, MAX_WIDTH, 767)).toBe("max-w-none");
    expect(effectiveAt(classes, MAX_WIDTH, 768)).toBe("max-w-sm");
  });

  it("an sm: cap covers the 640 band and nothing above it", () => {
    // The shape every caller that predates this hinge is in: `sm:max-w-[442px]`
    // wins to 767 and the primitive takes the panel back to 384 at 768. Those
    // call sites need the same value spelled `md:`, not deleted.
    const classes = tokensOf(renderSheet("right", "sm:max-w-[442px]"));
    expect(effectiveAt(classes, MAX_WIDTH, 641)).toBe("max-w-[442px]");
    expect(effectiveAt(classes, MAX_WIDTH, 767)).toBe("max-w-[442px]");
    expect(effectiveAt(classes, MAX_WIDTH, 768)).toBe("max-w-sm");
  });
});

/**
 * The four rules that keep hinging at 640, each with the reading that keeps it
 * there. All four are stock shadcn ramps rather than anything a board asks for,
 * and for each of them 768 is a WORSE hinge than 640, not a better one: moving
 * a rule right extends the value the boards contradict across another 128px.
 *
 * Retiring a ramp outright is a different change from re-hinging one, with a
 * blast radius (217 header call sites, 151 footer, 251 content) that puts it
 * outside a lane. These tests pin the current hinge so that decision stays a
 * decision instead of arriving as drift.
 */
describe("the rules that stay on the 640 hinge", () => {
  it("DialogContent's padding step, because the boards step at 1024", () => {
    // The two dialog insets that were measured hold the phone value through the
    // tablet board and step on the desktop one: the perp confirm modal is 12 at
    // 768 (9148:80644) and 24 at 1440 (3976:40708); the market search modal is
    // 24/12 at both 375 (9061:240254) and 768 (9148:79119), 24/16 at 1440
    // (3962:34367). Neither steps at 768, so `md:` is not where they step, and
    // twenty call sites carry an `sm:p-*` cancel that only reaches this rule
    // while it is on `sm:`.
    const classes = tokensOf(renderDialog());
    expect(effectiveAt(classes, /^p-/, 639)).toBe("p-4");
    expect(effectiveAt(classes, /^p-/, 641)).toBe("p-6");
  });

  const headers: Array<[string, () => Element]> = [
    ["DialogHeader", () => renderPart(<DialogHeader>h</DialogHeader>)],
    ["SheetHeader", () => renderPart(<SheetHeader>h</SheetHeader>)],
    ["AlertDialogHeader", () => renderPart(<AlertDialogHeader>h</AlertDialogHeader>)],
    ["DrawerHeader", () => renderPart(<DrawerHeader>h</DrawerHeader>)],
  ];

  it.each(headers)(
    "%s's alignment, because the boards are left-aligned on the phone too",
    (_name, mount) => {
      // The 375 board draws its dialog headers left (9061:240254's controls row
      // starts at x=8), and every caller in the app that states an alignment
      // states ONE for all widths — eight left, six centre, none ramping. So the
      // centre half is what the boards contradict, and hinging it at 768 would
      // draw it over another 128px.
      const classes = tokensOf(mount());
      expect(effectiveAt(classes, /^text-(left|center|right)$/, 639)).toBe(
        "text-center",
      );
      expect(effectiveAt(classes, /^text-(left|center|right)$/, 641)).toBe(
        "text-left",
      );
    },
  );

  const footers: Array<[string, () => Element]> = [
    ["DialogFooter", () => renderPart(<DialogFooter>f</DialogFooter>)],
    ["SheetFooter", () => renderPart(<SheetFooter>f</SheetFooter>)],
    ["AlertDialogFooter", () => renderPart(<AlertDialogFooter>f</AlertDialogFooter>)],
    ["DrawerFooter", () => renderPart(<DrawerFooter>f</DrawerFooter>)],
  ];

  it.each(footers)(
    "%s's direction, because the boards draw the button row at 375 as well",
    (_name, mount) => {
      // The right-menu footer is a two-up row with an 8px gap on all three
      // boards — 13006:181751/:181752 at 375, :322581/:322582 at 768,
      // :181189/:181190 at 1440 — and the 768 confirm modal draws a single
      // full-width CTA (9148:80677). No board stacks a footer, so the reversed
      // column is already the value to question, and moving the hinge would
      // stack another 128px of widths.
      const classes = tokensOf(mount());
      expect(effectiveAt(classes, /^flex-(row|col)(-reverse)?$/, 639)).toBe(
        "flex-col-reverse",
      );
      expect(effectiveAt(classes, /^flex-(row|col)(-reverse)?$/, 641)).toBe(
        "flex-row",
      );
      expect(effectiveAt(classes, /^space-x-/, 641)).toBe("space-x-2");
    },
  );

  it("AlertDialogCancel's margin, because it is the footer's rule wearing a margin", () => {
    // The 8px only exists to separate the buttons while the footer is a column,
    // so it has to clear exactly where the footer becomes a row. Hinged at 768
    // it would push Cancel 8px below Action across 640-767, where the footer is
    // already a row. Its sm: value is 0 rather than a second step, so nothing in
    // the app cancels it: 24 call sites, three pass a className, none touch mt-.
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>t</AlertDialogTitle>
          <AlertDialogCancel>c</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const classes = tokensOf(screen.getByText("c"));
    expect(effectiveAt(classes, /^mt-/, 639)).toBe("mt-2");
    expect(effectiveAt(classes, /^mt-/, 641)).toBe("mt-0");
  });
});

/** Mounts a bare header/footer part and hands back its element. */
function renderPart(node: ReactElement): Element {
  const { container } = render(node);
  return container.firstElementChild as Element;
}
