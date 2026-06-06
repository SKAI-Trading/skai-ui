import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkaiLoader } from "./skai-loader";

describe("SkaiLoader", () => {
  it("exposes an accessible status with the default label", () => {
    render(<SkaiLoader data-testid="loader" />);
    const node = screen.getByTestId("loader");
    expect(node).toHaveAttribute("role", "status");
    expect(node).toHaveAttribute("aria-busy", "true");
    expect(node).toHaveAttribute("aria-label", "Loading");
  });

  it("respects a custom accessible label", () => {
    render(<SkaiLoader label="Loading markets" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveAttribute("aria-label", "Loading markets");
  });

  it("renders the bolt mark (svg) and an optional message", () => {
    const { container } = render(<SkaiLoader message="Loading markets" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("Loading markets")).toBeInTheDocument();
  });

  it("uses fixed positioning in fullScreen mode and absolute otherwise", () => {
    const { rerender } = render(<SkaiLoader fullScreen data-testid="loader" />);
    expect(screen.getByTestId("loader").className).toMatch(/fixed/);
    rerender(<SkaiLoader data-testid="loader" />);
    expect(screen.getByTestId("loader").className).toMatch(/absolute/);
  });

  it("drops the gradient background when background is transparent", () => {
    render(<SkaiLoader background="transparent" data-testid="loader" />);
    expect(screen.getByTestId("loader").className).not.toMatch(/#001615/);
  });

  it("forwards a ref to the underlying element", () => {
    const captured: { current: HTMLDivElement | null } = { current: null };
    render(
      <SkaiLoader
        ref={(node) => {
          captured.current = node;
        }}
      />,
    );
    expect(captured.current).not.toBeNull();
    expect(captured.current?.tagName).toBe("DIV");
  });
});
