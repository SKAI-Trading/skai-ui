/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "../lib/layout";

/** Exact members of the class list — `absolute` must not be satisfied by
 *  `md:absolute`, which leaves the child statically positioned on a phone. */
const tok = (el: Element) =>
  (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);

/**
 * The ratio the element actually resolves to. CSSOM serialises an `aspect-ratio`
 * given as a bare number with its implicit denominator (`1.5` comes back as
 * `1.5 / 1`), and that form varies between engines, so compare the value the
 * declaration means rather than the text it happens to serialise to.
 */
const ratioOf = (el: HTMLElement) => {
  const [w, h = "1"] = el.style.aspectRatio.split("/");
  return Number(w) / Number(h);
};

describe("AspectRatio", () => {
  it("renders children inside an absolutely positioned wrapper", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <span>kid</span>
      </AspectRatio>,
    );
    const root = screen.getByTestId("ar");
    expect(root).toBeInTheDocument();
    // Uses modern CSS aspect-ratio (not the old padding-bottom hack).
    expect(ratioOf(root)).toBeCloseTo(16 / 9, 12);
    const inner = root.firstElementChild as HTMLElement;
    expect(tok(inner)).toContain("absolute");
    expect(tok(inner)).toContain("inset-0");
    expect(inner.textContent).toBe("kid");
  });

  it("defaults to 'video' (16/9) when no ratio is given", () => {
    render(<AspectRatio data-testid="def" />);
    expect(ratioOf(screen.getByTestId("def"))).toBeCloseTo(16 / 9, 12);
  });

  it("accepts string shorthand: square / video / wide / ultrawide", () => {
    const { rerender } = render(
      <AspectRatio ratio="square" data-testid="ar" />,
    );
    expect(ratioOf(screen.getByTestId("ar"))).toBeCloseTo(1, 12);

    rerender(<AspectRatio ratio="video" data-testid="ar" />);
    expect(ratioOf(screen.getByTestId("ar"))).toBeCloseTo(16 / 9, 12);

    rerender(<AspectRatio ratio="wide" data-testid="ar" />);
    expect(ratioOf(screen.getByTestId("ar"))).toBeCloseTo(21 / 9, 12);

    rerender(<AspectRatio ratio="ultrawide" data-testid="ar" />);
    expect(ratioOf(screen.getByTestId("ar"))).toBeCloseTo(32 / 9, 12);
  });

  it("merges consumer style without dropping aspect-ratio", () => {
    render(
      <AspectRatio
        ratio={4 / 3}
        style={{ background: "red" }}
        data-testid="ar"
      />,
    );
    const el = screen.getByTestId("ar");
    expect(el.style.background).toContain("red");
    expect(ratioOf(el)).toBeCloseTo(4 / 3, 12);
  });

  it("applies className to the wrapper alongside its own layout classes", () => {
    render(<AspectRatio className="my-class" data-testid="ar" />);
    const root = tok(screen.getByTestId("ar"));
    expect(root).toContain("my-class");
    expect(root).toContain("relative");
    expect(root).toContain("w-full");
  });
});
