import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "./skeleton";

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
    expect(node.className).toContain("custom-foo");
    expect(node.className).toContain("animate-pulse");
  });
});
