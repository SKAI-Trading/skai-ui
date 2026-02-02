import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Label } from "./label";

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Username</Label>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("associates with input using htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" aria-label="Email" />
      </>
    );
    expect(screen.getByText("Email")).toHaveAttribute("for", "email");
  });

  it("applies custom className", () => {
    render(<Label className="custom-label">Custom</Label>);
    expect(screen.getByText("Custom")).toHaveClass("custom-label");
  });

  it("renders children correctly", () => {
    render(
      <Label>
        <span data-testid="child">Required *</span>
      </Label>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref).toHaveBeenCalled();
  });

  it("has correct base styles", () => {
    render(<Label>Styled</Label>);
    const label = screen.getByText("Styled");
    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-medium");
  });

  it("shows disabled styling when peer is disabled", () => {
    render(<Label>Disabled peer</Label>);
    const label = screen.getByText("Disabled peer");
    expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });
});
