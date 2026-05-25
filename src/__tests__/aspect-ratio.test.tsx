/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "../lib/layout";

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
    expect(root.style.aspectRatio).toBe("1.7777777777777777");
    const inner = root.firstElementChild as HTMLElement;
    expect(inner.className).toContain("absolute");
    expect(inner.textContent).toBe("kid");
  });

  it("defaults to 'video' (16/9) when no ratio is given", () => {
    render(<AspectRatio data-testid="def" />);
    expect(screen.getByTestId("def").style.aspectRatio).toBe(
      `${16 / 9}`,
    );
  });

  it("accepts string shorthand: square / video / wide / ultrawide", () => {
    const { rerender } = render(
      <AspectRatio ratio="square" data-testid="ar" />,
    );
    expect(screen.getByTestId("ar").style.aspectRatio).toBe("1");

    rerender(<AspectRatio ratio="wide" data-testid="ar" />);
    expect(screen.getByTestId("ar").style.aspectRatio).toBe(`${21 / 9}`);

    rerender(<AspectRatio ratio="ultrawide" data-testid="ar" />);
    expect(screen.getByTestId("ar").style.aspectRatio).toBe(`${32 / 9}`);
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
    expect(el.style.aspectRatio).toBe(`${4 / 3}`);
  });

  it("applies className to the wrapper", () => {
    render(<AspectRatio className="my-class" data-testid="ar" />);
    expect(screen.getByTestId("ar").className).toContain("my-class");
  });
});
