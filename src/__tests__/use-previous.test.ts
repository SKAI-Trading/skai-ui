import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePrevious, useHasChanged } from "../hooks/use-previous";

describe("usePrevious", () => {
  it("should return undefined on first render", () => {
    const { result } = renderHook(() => usePrevious("initial"));

    expect(result.current).toBeUndefined();
  });

  it("should return previous value after update", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "first" },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    rerender({ value: "third" });
    expect(result.current).toBe("second");
  });

  it("should work with numbers", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it("should work with objects", () => {
    const obj1 = { name: "first" };
    const obj2 = { name: "second" };

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);
  });

  it("should work with boolean values", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: false },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: true });
    expect(result.current).toBe(false);

    rerender({ value: false });
    expect(result.current).toBe(true);
  });

  it("should work with null and undefined", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: null as null | undefined | string } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: undefined });
    expect(result.current).toBeNull();

    rerender({ value: "defined" });
    expect(result.current).toBeUndefined();
  });

  it("should maintain reference stability when same value is passed", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "same" },
    });

    rerender({ value: "same" });
    expect(result.current).toBe("same");

    rerender({ value: "same" });
    expect(result.current).toBe("same");
  });
});

describe("useHasChanged", () => {
  it("should return true on first render (undefined to initial)", () => {
    const { result } = renderHook(() => useHasChanged("initial"));

    expect(result.current).toBe(true);
  });

  it("should return true when value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: "first" } }
    );

    rerender({ value: "second" });
    expect(result.current).toBe(true);
  });

  it("should return false when value stays the same", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: "same" } }
    );

    // First re-render with same value - previous was undefined
    rerender({ value: "same" });
    expect(result.current).toBe(false);

    // Second re-render with same value
    rerender({ value: "same" });
    expect(result.current).toBe(false);
  });

  it("should detect changes in numbers", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: 0 } }
    );

    rerender({ value: 1 });
    expect(result.current).toBe(true);

    rerender({ value: 1 });
    expect(result.current).toBe(false);
  });

  it("should use reference equality for objects", () => {
    const obj1 = { value: 1 };
    const obj2 = { value: 1 };

    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: obj1 } }
    );

    // Same reference - no change
    rerender({ value: obj1 });
    expect(result.current).toBe(false);

    // Different reference (even if same content) - changed
    rerender({ value: obj2 });
    expect(result.current).toBe(true);
  });

  it("should handle boolean changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: false } }
    );

    rerender({ value: true });
    expect(result.current).toBe(true);

    rerender({ value: true });
    expect(result.current).toBe(false);

    rerender({ value: false });
    expect(result.current).toBe(true);
  });

  it("should handle null/undefined transitions", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useHasChanged(value),
      { initialProps: { value: null as null | undefined | string } }
    );

    rerender({ value: undefined });
    expect(result.current).toBe(true);

    rerender({ value: "defined" });
    expect(result.current).toBe(true);

    rerender({ value: null });
    expect(result.current).toBe(true);
  });
});
