/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberInput } from "../components/forms/number-input";

const renderControlled = (initial = 5, props: Record<string, unknown> = {}) => {
  const onChange = vi.fn();
  render(
    <NumberInput
      value={initial}
      onChange={onChange}
      min={-100}
      max={100}
      step={1}
      aria-label="qty"
      {...props}
    />,
  );
  return { onChange };
};

describe("NumberInput keyboard", () => {
  it("ArrowUp increments by step", () => {
    const { onChange } = renderControlled(5);
    const input = screen.getByLabelText("qty");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(6);
  });

  it("ArrowDown decrements by step", () => {
    const { onChange } = renderControlled(5);
    const input = screen.getByLabelText("qty");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("Shift+ArrowUp increments by 10x step", () => {
    const { onChange } = renderControlled(5);
    const input = screen.getByLabelText("qty");
    fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(15);
  });

  it("Shift+ArrowDown decrements by 10x step", () => {
    const { onChange } = renderControlled(50);
    const input = screen.getByLabelText("qty");
    fireEvent.keyDown(input, { key: "ArrowDown", shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(40);
  });

  it("clamps to max when Shift+ArrowUp would overshoot", () => {
    const { onChange } = renderControlled(95, { max: 100 });
    const input = screen.getByLabelText("qty");
    fireEvent.keyDown(input, { key: "ArrowUp", shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("exposes spinbutton ARIA semantics", () => {
    renderControlled(7, { min: 0, max: 10 });
    const input = screen.getByLabelText("qty");
    expect(input.getAttribute("role")).toBe("spinbutton");
    expect(input.getAttribute("aria-valuenow")).toBe("7");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
  });
});
