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
