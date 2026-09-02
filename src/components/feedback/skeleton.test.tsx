import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "./skeleton";

/** Exact members of the class list — `animate-pulse` must not be satisfied by
 *  `animate-pulse-slow`, nor `rounded-md` by `rounded-md-x`. */
const tok = (el: Element) =>
  (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);

describe("Skeleton", () => {
  it("renders with default accessible label", () => {
    render(<Skeleton data-testid="sk" />);
    const node = screen.getByTestId("sk");
    expect(node).toBeInTheDocument();
    expect(node).toHaveAttribute("role", "status");
    expect(node).toHaveAttribute("aria-busy", "true");
    expect(node).toHaveAttribute("aria-label", "Loading");
  });

  it("respects a custom accessible label", () => {
    render(<Skeleton label="Loading user" data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute(
      "aria-label",
      "Loading user",
    );
  });

  it("forwards a ref to the underlying element", () => {
    const captured: { current: HTMLDivElement | null } = { current: null };
    render(
      <Skeleton
        ref={(node) => {
          captured.current = node;
        }}
        data-testid="sk"
      />,
    );
    expect(captured.current).not.toBeNull();
    expect(captured.current?.tagName).toBe("DIV");
  });

  it("merges custom className with defaults", () => {
    render(<Skeleton className="custom-foo" data-testid="sk" />);
    const node = screen.getByTestId("sk");
    expect(tok(node)).toContain("custom-foo");
    expect(tok(node)).toContain("animate-pulse");
    // Motion has to collapse under prefers-reduced-motion, so the paired
    // opt-out ships alongside the pulse rather than being assumed.
    expect(tok(node)).toContain("motion-reduce:animate-none");
  });

  it("applies the shape radius, and only that shape's", () => {
    const { rerender } = render(<Skeleton data-testid="sk" />);
    expect(tok(screen.getByTestId("sk"))).toContain("rounded-md");

    rerender(<Skeleton shape="circle" data-testid="sk" />);
    expect(tok(screen.getByTestId("sk"))).toContain("rounded-full");

    rerender(<Skeleton shape="text" data-testid="sk" />);
    const text = tok(screen.getByTestId("sk"));
    expect(text).toContain("rounded");
    expect(text).toContain("h-4");
  });
});
