import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("is an announced status region by default", () => {
    render(<Spinner label="Loading data" />);
    const node = screen.getByRole("status");
    expect(node).toHaveAttribute("aria-busy", "true");
    expect(node).toHaveAttribute("aria-live", "polite");
    expect(node).toHaveAttribute("aria-label", "Loading data");
  });

  it("renders decoratively (no status/live region) when decorative", () => {
    const { container } = render(<Spinner decorative label="Saving" />);
    expect(screen.queryByRole("status")).toBeNull();
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveAttribute("aria-hidden", "true");
    expect(node).not.toHaveAttribute("aria-live");
    // No screen-reader text duplicated when decorative.
    expect(node.querySelector(".sr-only")).toBeNull();
  });
});
