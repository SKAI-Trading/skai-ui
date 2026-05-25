/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisuallyHidden } from "../components/utility/visually-hidden";

describe("VisuallyHidden", () => {
  it("renders content readable by screen readers", () => {
    render(<VisuallyHidden>Hidden but announced</VisuallyHidden>);
    expect(screen.getByText("Hidden but announced")).toBeInTheDocument();
  });

  it("applies inline sr-only styles", () => {
    render(<VisuallyHidden data-testid="vh">label</VisuallyHidden>);
    const el = screen.getByTestId("vh");
    expect(el.style.position).toBe("absolute");
    expect(el.style.width).toBe("1px");
    expect(el.style.height).toBe("1px");
    expect(el.style.overflow).toBe("hidden");
  });

  it("merges consumer style overrides without dropping the hidden base", () => {
    render(
      <VisuallyHidden style={{ color: "red" }} data-testid="vh">
        x
      </VisuallyHidden>,
    );
    const el = screen.getByTestId("vh");
    expect(el.style.position).toBe("absolute"); // base preserved
    expect(el.style.color).toBe("red"); // consumer style applied
  });

  it("supports asChild via Slot", () => {
    render(
      <VisuallyHidden asChild>
        <strong data-testid="child">hi</strong>
      </VisuallyHidden>,
    );
    const el = screen.getByTestId("child");
    expect(el.tagName).toBe("STRONG");
    expect(el.style.position).toBe("absolute");
  });

  it("forwards id and data attributes", () => {
    render(
      <VisuallyHidden id="myid" data-foo="bar">
        x
      </VisuallyHidden>,
    );
    const el = document.getElementById("myid");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("data-foo")).toBe("bar");
  });
});
