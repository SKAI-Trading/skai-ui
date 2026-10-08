import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeAll, describe, it, expect, vi } from "vitest";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import { Switch } from "../components/forms/switch";

/** Ash #95A09F as Tailwind writes a fixed colour, with no variable a theme could repoint. */
const ASH = "149 160 159";

/** skai-ui's source as a consumer scans it: every .ts / .tsx under src, tests left out. */
function sourceFiles(dir = resolve(__dirname, "..")): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") out.push(...sourceFiles(path));
    } else if (/\.tsx?$/.test(entry.name) && !/\.(test|spec)\.tsx?$/.test(entry.name)) {
      out.push(path);
    }
  }
  return out;
}

type BgRule = { selector: string; value: string; specificity: number; order: number };
let sheet: Promise<BgRule[]> | undefined;

/**
 * Every background-color rule of the stylesheet a consumer builds from
 * skai-ui's source and its own file (this one): the preset over both.
 */
function backgroundRules(): Promise<BgRule[]> {
  sheet ??= (async () => {
    const content = [...sourceFiles(), resolve(__dirname, "switch.test.tsx")].map((f) => ({
      raw: readFileSync(f, "utf8"),
      extension: "tsx",
    }));
    const config = { presets: [skaiPreset], content, corePlugins: { preflight: false } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
    const rules: BgRule[] = [];
    let order = 0;
    postcss.parse(css).walkDecls("background-color", (decl) => {
      const rule = decl.parent as postcss.Rule;
      if (rule.type !== "rule" || rule.parent?.type !== "root") return;
      for (const selector of rule.selectors) {
        // Classes and attribute selectors, not escaped characters inside a class name.
        const specificity = [...selector.matchAll(/\\.|[.[]/g)].filter((m) => m[0] === "." || m[0] === "[").length;
        rules.push({ selector, value: decl.value.trim(), specificity, order: order++ });
      }
    });
    return rules;
  })();
  return sheet;
}

/**
 * Whether `el` matches `selector`. jsdom never matches a class whose name
 * holds an escaped `.` or `&`, such as `[.light_&]:...`, so classes and
 * attributes are compared here, unescaped; a pseudo-class is asked of jsdom on
 * its own. Only the descendant and child combinators are modelled, and only
 * once the part to their right has matched.
 */
function reaches(el: Element, selector: string): boolean {
  const compounds: selectorParser.Node[][] = [[]];
  const joins: string[] = [];
  for (const node of selectorParser().astSync(selector).nodes[0].nodes) {
    if (node.type === "combinator") {
      joins.push(node.value.trim() || " ");
      compounds.push([]);
    } else compounds[compounds.length - 1].push(node);
  }
  const fits = (e: Element, parts: selectorParser.Node[]) =>
    parts.every((p) => {
      if (p.type === "class") return e.classList.contains(p.value);
      if (p.type === "attribute") return p.value === undefined ? e.hasAttribute(p.attribute) : e.getAttribute(p.attribute) === p.value;
      if (p.type === "tag") return e.tagName.toLowerCase() === p.value.toLowerCase();
      if (p.type === "universal") return true;
      if (p.type === "pseudo") return e.matches(String(p).trim());
      throw new Error(`${p.type} in "${selector}" is not modelled`);
    });
  const match = (e: Element | null, i: number): boolean => {
    if (!e || !fits(e, compounds[i])) return false;
    if (i === 0) return true;
    const join = joins[i - 1];
    if (join === ">") return match(e.parentElement, i - 1);
    if (join !== " ") throw new Error(`combinator "${join}" in "${selector}" is not modelled`);
    for (let a = e.parentElement; a; a = a.parentElement) if (match(a, i - 1)) return true;
    return false;
  };
  return match(el, compounds.length - 1);
}

/**
 * The background the cascade gives `el`: the matching rule with the highest
 * specificity, then the later one. A fixed colour reads "r g b"; anything else
 * as written.
 */
async function offTrack(el: Element): Promise<string> {
  let best: BgRule | undefined;
  for (const rule of await backgroundRules()) {
    // A pseudo-element rule paints a part (placeholder, scrollbar), never the track.
    if (rule.selector.includes("::")) continue;
    let hit: boolean;
    try {
      hit = reaches(el, rule.selector);
    } catch (e) {
      // Engine-prefixed states (`:-moz-focusring`, `:-webkit-autofill`) jsdom cannot parse.
      if (/:-(moz|webkit|ms)-/.test(rule.selector)) continue;
      throw e;
    }
    if (!hit) continue;
    if (!best || rule.specificity > best.specificity || (rule.specificity === best.specificity && rule.order > best.order)) {
      best = rule;
    }
  }
  if (!best) return "none";
  const rgb = /^rgb\((\d+ \d+ \d+) \/ var\(--tw-bg-opacity(?:, ?1)?\)\)$/.exec(best.value);
  return rgb ? rgb[1] : best.value;
}

beforeAll(() => backgroundRules().then(() => undefined), 120_000);

describe("Switch", () => {
  it("renders as a switch role", () => {
    render(<Switch aria-label="toggle dark mode" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("starts unchecked by default", () => {
    render(<Switch aria-label="t" />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });

  it("flips state on click", () => {
    const onChange = vi.fn();
    render(<Switch aria-label="t" onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("respects defaultChecked", () => {
    render(<Switch aria-label="t" defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("does not toggle when disabled", () => {
    const onChange = vi.fn();
    render(<Switch aria-label="t" disabled onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("toggles via Space key", () => {
    const onChange = vi.fn();
    render(<Switch aria-label="t" onCheckedChange={onChange} />);
    const sw = screen.getByRole("switch");
    sw.focus();
    fireEvent.keyDown(sw, { key: " " });
    // Radix listens to keyup
    fireEvent.keyUp(sw, { key: " " });
  });
});

describe("Switch drawn as unavailable", () => {
  const REASON = "This launchpad does not offer it.";

  it("draws an outline, because a faded track is 1.00:1 on a dark surface", () => {
    // The whole point of the state. `disabled` alone composites bg-input at
    // 50% down to the surface it sits on, so the control disappears rather
    // than dimming; the border is what is still there to see.
    render(<Switch aria-label="t" unavailable={REASON} />);
    expect(screen.getByRole("switch")).toHaveClass("border-[#95a09f]");
  });

  it("carries the reason and is inert, without being taken off the page", () => {
    const onChange = vi.fn();
    render(<Switch aria-label="t" unavailable={REASON} onCheckedChange={onChange} />);
    const sw = screen.getByRole("switch");
    expect(sw).toBeInTheDocument();
    expect(sw).toHaveAttribute("title", REASON);
    expect(sw).toHaveAttribute("aria-disabled", "true");
    expect(sw).toBeDisabled();
    fireEvent.click(sw);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("wins over a caller that also said the control is live", () => {
    // An unavailable switch has to be inert whatever else was passed, or a
    // caller that forgets to drop `disabled={false}` ships a clickable one.
    const onChange = vi.fn();
    render(
      <Switch
        aria-label="t"
        unavailable={REASON}
        disabled={false}
        onCheckedChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("changes nothing for a caller that does not ask for it", () => {
    // The package is the main app's, the wallet's and command's as well, so
    // the guarantee is not "the new state looks right" but "every existing
    // Switch renders exactly as it did". Asserted against the rendered
    // attributes rather than by reading the source.
    const onChange = vi.fn();
    render(<Switch aria-label="t" onCheckedChange={onChange} />);
    const sw = screen.getByRole("switch");
    expect(sw).not.toHaveClass("border-[#95a09f]");
    expect(sw).not.toHaveAttribute("title");
    expect(sw).not.toHaveAttribute("aria-disabled");
    expect(sw).not.toBeDisabled();
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Switch track sizes", () => {
  // Each assertion names a class TOKEN. `toHaveClass` splits the attribute on
  // whitespace and compares whole tokens, so none of these can pass off a
  // substring of a longer utility the way a `className.includes(...)` oracle
  // would.
  const trackOf = (): HTMLElement => screen.getByRole("switch");
  const knobOf = (): HTMLElement =>
    screen.getByRole("switch").firstElementChild as HTMLElement;

  it("steps the box from the 375 board's 40.593x24 to the 768 board's 60.889x36", () => {
    // Both rungs are pinned in ONE test because the whole reason this size
    // exists is that the boards draw one control at two boxes: a test that
    // asserted either rung alone would stay green against a control that had
    // stopped stepping. Read off the nodes on 2026-09-22 — 11881:94366 draws
    // twelve instances at 40.592594x24, and 11846:355537 (768) and
    // 5529:73628 (1440) both draw 60.888889x36.
    render(<Switch aria-label="t" size="stepped" />);
    const track = trackOf();
    expect(track).toHaveClass("h-6", "w-[40.59px]");
    expect(track).toHaveClass("md:h-9", "md:w-[60.889px]");
  });

  it("draws the node's knob, ring and stops at each rung, not ones read off the padding", () => {
    // Read 2026-10-04 on the ellipse itself: 17.33 at 375 (11884:94598 on at
    // x=19, 11884:94612 off at x=2.33) and 26 at 768 (11846:355537 on at 28,
    // 11846:355570 off at 3), inside a track the root's 1.333 / 2 ring leaves.
    // The first cut inferred a 32 knob from the 2px pad; a 6px-oversized knob
    // still passes every track-size assertion, so the knob is pinned itself.
    render(<Switch aria-label="t" size="stepped" />);
    const knob = knobOf();
    expect(knob).toHaveClass(
      "size-[17.33px]",
      "data-[state=unchecked]:translate-x-[2.33px]",
      "data-[state=checked]:translate-x-[19px]",
      "md:size-[26px]",
      "md:data-[state=unchecked]:translate-x-[3px]",
      "md:data-[state=checked]:translate-x-7",
    );
    expect(trackOf()).toHaveClass("border-[1.333px]", "md:border-2");
  });

  it("lets the stepped knob replace the base knob rather than sit beside it", () => {
    // The base thumb is h-5 w-5 with a shadow-lg and rests at translate-x-0.
    // If tailwind-merge kept any of those next to the stepped classes, the
    // stylesheet's order would decide the knob instead of the size asked for.
    render(<Switch aria-label="t" size="stepped" />);
    const knob = knobOf().className.split(/\s+/);
    for (const stale of [
      "h-5",
      "w-5",
      "md:size-8",
      "shadow-lg",
      "data-[state=unchecked]:translate-x-0",
      "data-[state=checked]:translate-x-[16.59px]",
    ]) {
      expect(knob).not.toContain(stale);
    }
    expect(knob).toContain("shadow-none");
    expect(trackOf().className.split(/\s+/)).not.toContain("border-2");
  });

  it("leaves the default and compact sizes exactly where they were", () => {
    // 241 call sites take one of these two and none of them asked for a step.
    // Pinned against the rendered class list rather than by reading the
    // source, and asserting the ABSENCE of the md rung, because the way this
    // change could reach them is by stepping a size they already use.
    const { unmount } = render(<Switch aria-label="a" />);
    expect(trackOf()).toHaveClass("h-6", "w-11");
    expect(knobOf()).toHaveClass("data-[state=checked]:translate-x-5");
    expect(trackOf().className).not.toMatch(/\bmd:/);
    unmount();

    render(<Switch aria-label="b" size="compact" />);
    expect(trackOf()).toHaveClass("no-min-size", "h-6", "w-[40.59px]");
    expect(knobOf()).toHaveClass("data-[state=checked]:translate-x-[16.59px]");
    expect(trackOf().className).not.toMatch(/\bmd:/);
    expect(knobOf().className).not.toMatch(/\bmd:/);
  });

  it("keeps the 2px ring, the 20 knob and its shadow on default and compact", () => {
    // The stepped rung now draws the node's finer ring and knob. Neither of the
    // other two sizes asked for that, so their box inside the ring is pinned.
    for (const size of ["default", "compact"] as const) {
      const { unmount } = render(<Switch aria-label={size} size={size} />);
      expect(trackOf()).toHaveClass("border-2");
      expect(trackOf()).not.toHaveClass("border-[1.333px]");
      expect(knobOf()).toHaveClass("h-5", "w-5", "shadow-lg", "data-[state=unchecked]:translate-x-0");
      expect(knobOf()).not.toHaveClass("size-[17.33px]");
      unmount();
    }
  });

  it("keeps the touch-floor opt-out on the stepped size, which is 36 tall at 768", () => {
    // index.css floors controls at 44 up to `max-width: 768px` INCLUSIVE, and
    // `md:` starts at 768, so at exactly that width this rung is a 36-tall
    // control inside the floor's range. Dropping `no-min-size` on the theory
    // that the larger rung clears the floor would square it to 44 there.
    render(<Switch aria-label="t" size="stepped" />);
    expect(trackOf()).toHaveClass("no-min-size");
  });
});

describe("Switch: the stepped toggle's ring and at-rest track", () => {
  const trackOf = (): HTMLElement => screen.getByRole("switch");
  const classes = () => trackOf().className.split(/\s+/);

  it("rests on Ash inside a Green Coal 300 ring, as the boards' Off instance does", () => {
    // 11846:355570 (768, Off) photographed 2026-10-04: an Ash pill inside a
    // Green Coal 300 ring. The variant's own Green Coal 300 at rest is the
    // card's colour, so an Off toggle read as a white dot with no pill.
    render(<Switch aria-label="t" size="stepped" variant="toggle" />);
    expect(classes()).toContain("border-green-coal-300");
    expect(classes()).toContain("data-[state=unchecked]:bg-ash");
    expect(classes()).not.toContain("data-[state=unchecked]:bg-[#001615]");
    expect(classes()).not.toContain("border-transparent");
    // On stays the Sky Blue the variant pins.
    expect(classes()).toContain("data-[state=checked]:bg-[#56C7F3]");
  });

  it("rests toggle on Ash at compact and default too, and draws the ring only at stepped", () => {
    // Casey 2026-10-05 #70. The Off instances of 11881:94366 (11884:94612 ...
    // :94615) and 11846:355570 draw an Ash track inside the Green Coal 300
    // ring, read 2026-10-07. The smaller sizes used to rest on #001615, the
    // ring's colour, which is the card's colour too. Only `stepped` has the
    // node's ring-and-knob box, so the smaller two keep their transparent rim.
    for (const size of ["compact", "default"] as const) {
      const { unmount } = render(<Switch aria-label={size} size={size} variant="toggle" />);
      expect(classes()).toContain("data-[state=unchecked]:bg-ash");
      expect(classes()).not.toContain("data-[state=unchecked]:bg-[#001615]");
      expect(classes()).toContain("border-transparent");
      expect(classes()).not.toContain("border-green-coal-300");
      unmount();
    }
    render(<Switch aria-label="p" size="stepped" />);
    expect(classes()).toContain("data-[state=unchecked]:bg-input");
    expect(classes()).toContain("border-transparent");
    expect(classes()).not.toContain("border-green-coal-300");
  });

  it("rests sky on Ash and leaves primary on bg-input", () => {
    // `sky`'s only callers are the Predict futures settings panels, whose
    // frames draw the same `input/toggle`. `primary` is not that component.
    const { unmount } = render(<Switch aria-label="s" variant="sky" />);
    expect(classes()).toContain("data-[state=unchecked]:bg-ash");
    expect(classes()).not.toContain("data-[state=unchecked]:bg-input");
    expect(classes()).toContain("data-[state=checked]:bg-[#56C7F3]");
    unmount();
    render(<Switch aria-label="p" />);
    expect(classes()).toContain("data-[state=unchecked]:bg-input");
    expect(classes()).not.toContain("data-[state=unchecked]:bg-ash");
  });

  it("rests on Ash on a dark surface, whatever the surface's --muted-foreground holds", async () => {
    // Casey 2026-10-05 #70: Off is Ash #95A09F in the dark theme. The /play
    // hub wraps its live-RTP toggle in DARK_THEME_VARS, which pins
    // --muted-foreground to 225 20% 75% (#B3B9CC), so a track that read that
    // variable drew a blue-grey there. Resolved against the stylesheet a
    // consumer builds from skai-ui's source.
    for (const [variant, size] of [
      ["toggle", "compact"],
      ["toggle", "default"],
      ["toggle", "stepped"],
      ["sky", "default"],
    ] as const) {
      for (const style of [undefined, { ["--muted-foreground" as string]: "225 20% 75%" }]) {
        const { unmount } = render(
          <div style={style}>
            <Switch aria-label="t" variant={variant} size={size} />
          </div>,
        );
        expect(trackOf()).toHaveAttribute("data-state", "unchecked");
        expect(await offTrack(trackOf()), `${variant}/${size} ${style ? "under a pinned --muted-foreground" : ""}`).toBe(ASH);
        unmount();
      }
    }
  });

  it("rests on the light theme's own grey under .light, through --muted-foreground", async () => {
    // A fixed Ash is about 2.7:1 on a white card; the light theme's
    // --muted-foreground (220 9% 38% in the app) is 6.5:1.
    for (const [variant, size] of [
      ["toggle", "compact"],
      ["toggle", "stepped"],
      ["sky", "default"],
    ] as const) {
      const { unmount } = render(
        <div className="light">
          <Switch aria-label="t" variant={variant} size={size} />
        </div>,
      );
      expect(await offTrack(trackOf()), `${variant}/${size}`).toBe("hsl(var(--muted-foreground))");
      unmount();
    }
  });

  it("lets a caller's own Off fill hold in both themes", async () => {
    // The sports bet slip's quick-bet toggle names Ash itself.
    for (const wrapper of ["", "light"]) {
      const { unmount } = render(
        <div className={wrapper}>
          <Switch aria-label="t" variant="toggle" size="compact" className="data-[state=unchecked]:bg-ash" />
        </div>,
      );
      expect(await offTrack(trackOf()), wrapper || "dark").toBe(ASH);
      unmount();
    }
  });

  it("leaves primary on bg-input in both themes", async () => {
    for (const wrapper of ["", "light"]) {
      const { unmount } = render(
        <div className={wrapper}>
          <Switch aria-label="p" />
        </div>,
      );
      expect(await offTrack(trackOf()), wrapper || "dark").toBe("hsl(var(--input))");
      unmount();
    }
  });

  it("still draws the unavailable edge over the ring", () => {
    render(
      <Switch aria-label="t" size="stepped" variant="toggle" unavailable="Not offered here." />,
    );
    expect(classes()).toContain("border-[#95a09f]");
    expect(classes()).not.toContain("border-green-coal-300");
  });
});
