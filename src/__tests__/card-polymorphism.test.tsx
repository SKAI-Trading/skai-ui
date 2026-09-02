/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardTitle, SkaiCard, SkaiCardTitle } from "../components/core/card";

/** Exact members of the class list — `rounded-lg` must not be satisfied by
 *  `rounded-lg-x` or `md:rounded-lg`. */
const tok = (el: Element) =>
  (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);

describe("Card polymorphism", () => {
  it("renders a div by default", () => {
    render(<Card data-testid="c">hi</Card>);
    expect(screen.getByTestId("c").tagName).toBe("DIV");
  });

  it("renders as a different element when `as` is provided", () => {
    render(
      <Card as="article" data-testid="c">
        hi
      </Card>,
    );
    expect(screen.getByTestId("c").tagName).toBe("ARTICLE");
  });

  it("asChild forwards classes onto the child (anchor)", () => {
    render(
      <Card asChild data-testid="c">
        <a href="/x">click</a>
      </Card>,
    );
    const a = screen.getByTestId("c") as HTMLAnchorElement;
    expect(a.tagName).toBe("A");
    expect(a.getAttribute("href")).toBe("/x");
    // The full base card surface has to land on the child, not just its radius.
    expect(tok(a)).toContain("rounded-lg");
    expect(tok(a)).toContain("border");
    expect(tok(a)).toContain("bg-card");
  });

  it("CardTitle defaults to h3 and accepts h1-h6", () => {
    const { rerender } = render(<CardTitle data-testid="t">t</CardTitle>);
    expect(screen.getByTestId("t").tagName).toBe("H3");
    rerender(
      <CardTitle as="h1" data-testid="t">
        t
      </CardTitle>,
    );
    expect(screen.getByTestId("t").tagName).toBe("H1");
  });
});

describe("SkaiCard polymorphism", () => {
  it("SkaiCard renders article when as=article", () => {
    render(
      <SkaiCard as="article" data-testid="sc">
        x
      </SkaiCard>,
    );
    expect(screen.getByTestId("sc").tagName).toBe("ARTICLE");
  });

  it("SkaiCardTitle accepts h2", () => {
    render(
      <SkaiCardTitle as="h2" data-testid="st">
        x
      </SkaiCardTitle>,
    );
    expect(screen.getByTestId("st").tagName).toBe("H2");
  });
});
