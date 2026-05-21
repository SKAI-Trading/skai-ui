import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Separator } from "../components/layout/separator";

describe("Separator", () => {
  it("renders horizontal by default with decorative role none", () => {
    const { container } = render(<Separator />);
    const el = container.firstChild as HTMLElement;
    // Radix Separator with decorative=true has role="none"
    expect(el.getAttribute("role")).toBe("none");
    expect(el).toHaveAttribute("data-orientation", "horizontal");
  });

  it("supports vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-orientation", "vertical");
  });

  it("renders as ARIA separator when not decorative", () => {
    render(
      <Separator
        decorative={false}
        orientation="vertical"
        aria-label="section"
      />,
    );
    const el = screen.getByRole("separator");
    // ARIA convention: horizontal is implicit default — vertical is explicit
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });

  it("forwards className", () => {
    const { container } = render(<Separator className="my-custom" />);
    expect(container.firstChild).toHaveClass("my-custom");
  });
});
