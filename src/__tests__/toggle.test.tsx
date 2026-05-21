import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toggle } from "../components/forms/toggle";

describe("Toggle", () => {
  it("renders a button", () => {
    render(<Toggle aria-label="bold">B</Toggle>);
    expect(screen.getByRole("button")).toHaveTextContent("B");
  });

  it("flips data-state on click", () => {
    render(<Toggle aria-label="b">B</Toggle>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-state", "off");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("data-state", "on");
  });

  it("calls onPressedChange", () => {
    const onChange = vi.fn();
    render(
      <Toggle aria-label="b" onPressedChange={onChange}>
        B
      </Toggle>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("applies outline variant border", () => {
    render(
      <Toggle aria-label="b" variant="outline">
        B
      </Toggle>,
    );
    expect(screen.getByRole("button")).toHaveClass("border");
  });

  it("applies size classes", () => {
    const { rerender } = render(
      <Toggle aria-label="b" size="sm">
        B
      </Toggle>,
    );
    expect(screen.getByRole("button")).toHaveClass("h-9");
    rerender(
      <Toggle aria-label="b" size="lg">
        B
      </Toggle>,
    );
    expect(screen.getByRole("button")).toHaveClass("h-11");
  });

  it("does not toggle when disabled", () => {
    const onChange = vi.fn();
    render(
      <Toggle aria-label="b" disabled onPressedChange={onChange}>
        B
      </Toggle>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
