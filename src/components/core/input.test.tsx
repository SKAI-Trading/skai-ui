import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input, fieldTextSize } from "../core/input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles text input", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input).toHaveValue("Hello");
  });

  it("renders with different types", () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "text");

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "password");

    rerender(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "number");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId("input")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveClass("custom-class");
  });

  it("handles onChange event", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "test" },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles onFocus event", () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} data-testid="input" />);
    fireEvent.focus(screen.getByTestId("input"));
    expect(handleFocus).toHaveBeenCalled();
  });

  it("handles onBlur event", () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} data-testid="input" />);
    fireEvent.blur(screen.getByTestId("input"));
    expect(handleBlur).toHaveBeenCalled();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("renders with defaultValue", () => {
    render(<Input defaultValue="default text" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveValue("default text");
  });

  it("renders with value (controlled)", () => {
    const handleChange = vi.fn();
    render(
      <Input value="controlled" onChange={handleChange} data-testid="input" />,
    );
    expect(screen.getByTestId("input")).toHaveValue("controlled");
  });

  it("renders with required attribute", () => {
    render(<Input required data-testid="input" />);
    expect(screen.getByTestId("input")).toBeRequired();
  });

  it("renders with readOnly attribute", () => {
    render(<Input readOnly data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("readonly");
  });

  it("renders with name attribute", () => {
    render(<Input name="test-input" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("name", "test-input");
  });

  it("renders with min/max for number type", () => {
    render(<Input type="number" min={0} max={100} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  it("renders with step for number type", () => {
    render(<Input type="number" step={0.01} data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("step", "0.01");
  });
});

describe("Input text size (Casey 2026-10-08 Q29, and #105)", () => {
  // The field's own size classes, bare or at a breakpoint. `file:text-sm` is
  // the file-picker button's, not the field's, so it is left out.
  const FIELD_SIZE = /^(?:(?:max-)?(?:sm|md|lg|xl|2xl):)?text-(?:xs|sm|base|lg|xl|\dxl|\[[^\]]+\])$/;
  const sizes = () =>
    screen.getByTestId("input").className.split(/\s+/).filter((c) => FIELD_SIZE.test(c));

  it("draws 16 below md and the frames' 14 from md up when the caller names no size", () => {
    const { unmount } = render(<Input data-testid="input" />);
    expect(sizes()).toEqual(["text-base", "md:text-sm"]);
    unmount();
    render(<Input data-testid="input" className="h-11 bg-card text-white" />);
    expect(sizes()).toEqual(["text-base", "md:text-sm"]);
  });

  it("keeps a caller's size under 16 from md up and lifts the phone to 16", () => {
    render(<Input data-testid="input" className="text-xs" />);
    expect(sizes()).toEqual(["max-md:text-base", "text-xs"]);
  });

  it("leaves a caller's size of 16 or more alone at every width", () => {
    render(<Input data-testid="input" className="text-[22px]" />);
    expect(sizes()).toEqual(["text-[22px]"]);
  });

  it("keeps the phone 16 under a caller's size that starts at md", () => {
    render(<Input data-testid="input" className="md:text-lg" />);
    expect(sizes()).toEqual(["text-base", "md:text-lg"]);
  });
});

describe("fieldTextSize", () => {
  it("gives a field that names no size 16 below md and 14 from md up", () => {
    expect(fieldTextSize()).toBe("text-base md:text-sm");
    expect(fieldTextSize("h-11 text-white text-muted-foreground")).toBe("text-base md:text-sm");
    expect(fieldTextSize("lg:text-base rounded-xl px-4")).toBe("text-base md:text-sm");
  });

  it("lifts a phone to 16 under a size below 16, a preset or arbitrary one included", () => {
    for (const own of ["text-xs", "text-sm", "text-[14px]", "text-[0.75rem]", "text-para-2-mobile"]) {
      expect(fieldTextSize(`h-11 ${own}`), own).toBe("max-md:text-base");
    }
  });

  it("lifts it under a size it cannot read too", () => {
    expect(fieldTextSize("text-[length:var(--bet-size)]")).toBe("max-md:text-base");
  });

  it("gives nothing under a size of 16 or more", () => {
    for (const own of ["text-base", "text-lg", "text-[22px]", "text-[1.125rem]", "text-para-1", "text-number-2-mobile"]) {
      expect(fieldTextSize(`h-11 ${own}`), own).toBeUndefined();
    }
  });

  it("reads the last of several sizes, the one that wins", () => {
    expect(fieldTextSize("text-lg text-xs")).toBe("max-md:text-base");
    expect(fieldTextSize("text-xs text-lg")).toBeUndefined();
  });

  it("marks the phone 16 important under an important size, which a plain one would lose to", () => {
    // The bet slip's hex field sets `!text-number-4-mobile` (12).
    expect(fieldTextSize("!text-number-4-mobile md:!text-number-4-tablet")).toBe("max-md:!text-base");
    expect(fieldTextSize("!text-lg")).toBeUndefined();
  });

  it("holds 16 from 640 to 767 under a caller's sm: size below 16", () => {
    // The perps TP / SL fields step 12 -> 14 at sm.
    expect(fieldTextSize("text-[12px] sm:text-[14px] md:text-[14px]")).toBe("max-md:text-base sm:max-md:text-base");
    expect(fieldTextSize("sm:text-xs")).toBe("text-base md:text-sm sm:max-md:text-base");
    expect(fieldTextSize("text-lg sm:text-xl")).toBeUndefined();
  });

  it("carries the caller's own line height on the phone 16", () => {
    expect(fieldTextSize("text-sm/[18px]")).toBe("max-md:text-base/[18px]");
    expect(fieldTextSize("text-xs leading-4")).toBe("max-md:text-base/4");
    // A leading outranks the size's own; an sm: one carries into 640-767.
    expect(fieldTextSize("text-sm/[18px] leading-[14px]")).toBe("max-md:text-base/[14px]");
    expect(fieldTextSize("text-[12px] leading-[14px] sm:text-[14px] sm:leading-[16px]")).toBe(
      "max-md:text-base/[14px] sm:max-md:text-base/[16px]",
    );
    expect(fieldTextSize("!text-xs !leading-4")).toBe("max-md:!text-base/4");
    // With no sm: line height of its own, 640-767 runs on the bare one.
    expect(fieldTextSize("text-[12px] leading-[14px] sm:text-[14px]")).toBe(
      "max-md:text-base/[14px] sm:max-md:text-base/[14px]",
    );
  });
});
