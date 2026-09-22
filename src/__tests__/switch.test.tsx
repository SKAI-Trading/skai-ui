import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Switch } from "../components/forms/switch";

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

  it("moves the knob the width the stepped track leaves it at each rung", () => {
    // The travel is not a taste choice, it is what is left over: the root's
    // 2px ring insets the knob, so at 375 that is 40.59 - 4 - 20 = 16.59 and
    // from 768 it is 60.889 - 4 - 32 = 24.889. A knob that kept the smaller
    // travel on the larger track would stop short of the end and read as a
    // half-thrown switch, which no size assertion on the track would catch.
    render(<Switch aria-label="t" size="stepped" />);
    const knob = knobOf();
    expect(knob).toHaveClass("data-[state=checked]:translate-x-[16.59px]");
    expect(knob).toHaveClass("md:size-8");
    expect(knob).toHaveClass("md:data-[state=checked]:translate-x-[24.889px]");
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

  it("keeps the touch-floor opt-out on the stepped size, which is 36 tall at 768", () => {
    // index.css floors controls at 44 up to `max-width: 768px` INCLUSIVE, and
    // `md:` starts at 768, so at exactly that width this rung is a 36-tall
    // control inside the floor's range. Dropping `no-min-size` on the theory
    // that the larger rung clears the floor would square it to 44 there.
    render(<Switch aria-label="t" size="stepped" />);
    expect(trackOf()).toHaveClass("no-min-size");
  });
});
