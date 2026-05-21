import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Kbd } from "../components/data-display/kbd";

describe("Kbd", () => {
  it("renders a <kbd> element with children", () => {
    render(<Kbd>Esc</Kbd>);
    const el = screen.getByText("Esc");
    expect(el.tagName).toBe("KBD");
  });

  it("renders multiple keys joined with +", () => {
    render(<Kbd keys={["⌘", "K"]} />);
    expect(screen.getByText("⌘").tagName).toBe("KBD");
    expect(screen.getByText("K").tagName).toBe("KBD");
    // separator marked aria-hidden
    expect(screen.getByText("+")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies size variant classes", () => {
    const { rerender } = render(<Kbd size="sm">a</Kbd>);
    expect(screen.getByText("a")).toHaveClass("h-5");
    rerender(<Kbd size="lg">a</Kbd>);
    expect(screen.getByText("a")).toHaveClass("h-8");
  });

  it("applies variant classes", () => {
    render(<Kbd variant="solid">x</Kbd>);
    expect(screen.getByText("x")).toHaveClass("bg-foreground");
  });
});
