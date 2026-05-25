/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "../components/layout/aspect-ratio";

describe("AspectRatio", () => {
  it("renders children inside an absolutely positioned wrapper", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <span>kid</span>
      </AspectRatio>,
    );
    const root = screen.getByTestId("ar");
    expect(root).toBeInTheDocument();
    expect(root.style.aspectRatio).toBe("1.7777777777777777");
    // Child wrapper sits below
    const inner = root.firstElementChild as HTMLElement;
    expect(inner.className).toContain("absolute");
    expect(inner.textContent).toBe("kid");
  });

  it("defaults to square (ratio=1) when no ratio is given", () => {
    render(<AspectRatio data-testid="sq" />);
    expect(screen.getByTestId("sq").style.aspectRatio).toBe("1");
  });

  it("forwards style and id", () => {
    render(<AspectRatio id="x" style={{ background: "red" }} ratio={4 / 3} />);
    const el = document.getElementById("x")!;
    expect(el.style.background).toContain("red");
    expect(el.style.aspectRatio).toBe("1.3333333333333333");
  });

  it("applies className to the wrapper", () => {
    render(<AspectRatio className="my-class" data-testid="ar" />);
    expect(screen.getByTestId("ar").className).toContain("my-class");
  });
});
