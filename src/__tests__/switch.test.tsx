import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import { Switch } from "../components/forms/switch";

const BACKSLASH = String.fromCharCode(92);
/** How Tailwind writes the `data-[state=unchecked]:` variant's qualifier. */
const UNCHECKED = /\[data-state="?unchecked"?\]$/;

/**
 * The background colours the compiled CSS gives `el` at rest, as "r g b" when
 * the value is an rgb() and as written otherwise: every rule Tailwind emits
 * through this package's preset for the classes on `el` whose selector is one
 * of those classes qualified by `[data-state=unchecked]`.
 */
async function restingTrack(el: Element): Promise<string[]> {
  const config = {
    presets: [skaiPreset],
    content: [{ raw: el.getAttribute("class") ?? "", extension: "txt" }],
    corePlugins: { preflight: false },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  const out: string[] = [];
  postcss.parse(css).walkRules((rule) => {
    for (const selector of rule.selectors) {
      const qualifier = UNCHECKED.exec(selector);
      if (!selector.startsWith(".") || !qualifier) continue;
      const utility = selector.slice(1, qualifier.index).split(BACKSLASH).join("");
      if (!el.classList.contains(utility)) continue;
      rule.walkDecls("background-color", (decl) => {
        const rgb = /rgb\((\d+ \d+ \d+)/.exec(decl.value);
        out.push(rgb ? rgb[1] : decl.value);
      });
    }
  });
  return out;
}

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

  it("resolves the Off track to the frame's #95A09F through the preset", async () => {
    // Compiled, so a renamed or repointed token cannot pass on its class name.
    for (const [variant, size] of [
      ["toggle", "compact"],
      ["toggle", "default"],
      ["toggle", "stepped"],
      ["sky", "default"],
    ] as const) {
      const { unmount } = render(<Switch aria-label="t" variant={variant} size={size} />);
      expect(trackOf()).toHaveAttribute("data-state", "unchecked");
      expect(await restingTrack(trackOf()), `${variant}/${size}`).toEqual(["149 160 159"]);
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
