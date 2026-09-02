import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkaiLoader } from "./skai-loader";

/** Exact members of the class list. A regex over `className` matches the
 *  utility wherever it appears, so /fixed/ is satisfied by `md:fixed` — a
 *  loader that is only fixed above 768px. Positioning is compared as a token. */
const tok = (el: Element) =>
  (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);

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
    const full = tok(screen.getByTestId("loader"));
    expect(full).toContain("fixed");
    expect(full).toContain("inset-0");
    expect(full).not.toContain("absolute");

    rerender(<SkaiLoader data-testid="loader" />);
    const inline = tok(screen.getByTestId("loader"));
    expect(inline).toContain("absolute");
    expect(inline).toContain("inset-0");
    expect(inline).not.toContain("fixed");
  });

  it("drops the gradient background when background is transparent", () => {
    const { rerender } = render(
      <SkaiLoader background="transparent" data-testid="loader" />,
    );
    const transparent = tok(screen.getByTestId("loader"));
    expect(transparent).toContain("bg-transparent");
    expect(transparent).not.toContain("bg-[#001615]");

    rerender(<SkaiLoader data-testid="loader" />);
    expect(tok(screen.getByTestId("loader"))).toContain("bg-[#001615]");
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
