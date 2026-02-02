import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../core/badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-primary");

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveClass("bg-secondary");

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive")).toHaveClass("bg-destructive");

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("border");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-class");
  });

  it("renders children correctly", () => {
    render(
      <Badge>
        <span data-testid="child">Child</span>
      </Badge>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("passes through HTML attributes", () => {
    render(<Badge data-testid="test-badge">Test</Badge>);
    expect(screen.getByTestId("test-badge")).toBeInTheDocument();
  });

  it("has correct base styles", () => {
    render(<Badge>Styled</Badge>);
    const badge = screen.getByText("Styled");
    expect(badge).toHaveClass("inline-flex");
    expect(badge).toHaveClass("rounded-full");
    expect(badge).toHaveClass("text-xs");
  });
});
