/// <reference types="vitest/globals" />
import * as React from "react";
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

describe("NumberInput callback-identity stability (W53-A8 regression)", () => {
  // Parents commonly pass inline formatters like `formatValue={(v) => v.toFixed(2)}`.
  // Before W53-A8 the sync `useEffect` re-fired on every parent render because the
  // callback identity drifted, wiping intermediate (non-numeric) keystrokes such
  // as a partial negative sign or a trailing decimal that hasn't been completed.
  // Repro: type "-" (parseFloat → NaN → onChange NOT called → value stays 0),
  // then trigger a parent re-render. Pre-fix the sync effect re-runs because
  // `formatValue` identity changed, overwriting "-" with "0".
  it("preserves intermediate keystroke when parent re-renders with inline callbacks", () => {
    function Harness() {
      const [v, setV] = React.useState(0);
      const [tick, setTick] = React.useState(0);
      return (
        <>
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            aria-label="bump"
          >
            bump {tick}
          </button>
          <NumberInput
            value={v}
            onChange={setV}
            min={-100}
            max={100}
            // Inline callbacks — fresh identity every parent render.
            formatValue={(n) => n.toString()}
            parseValue={(s) => parseFloat(s) || 0}
            aria-label="qty"
          />
        </>
      );
    }
    render(<Harness />);
    const input = screen.getByLabelText("qty") as HTMLInputElement;
    // User types a lone "-" — not yet a valid number; onChange should NOT fire
    // (parseFloat("-") is NaN), so the parent's `v` stays 0.
    fireEvent.change(input, { target: { value: "-" } });
    expect(input.value).toBe("-");
    // Parent re-renders for an unrelated reason. Pre-fix the sync effect
    // would re-run and overwrite "-" with formatValue(0) = "0".
    fireEvent.click(screen.getByLabelText("bump"));
    expect(input.value).toBe("-");
  });
});
