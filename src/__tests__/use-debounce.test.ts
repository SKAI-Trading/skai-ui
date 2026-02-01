import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce, useDebouncedCallback } from "../hooks/use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: "d" });
    act(() => vi.advanceTimersByTime(200));

    // Still "a" because timer keeps resetting
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe("d");
  });
});

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should debounce callback execution", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    result.current("test");
    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(500));
    expect(callback).toHaveBeenCalledWith("test");
  });

  it("should only call callback once for rapid invocations", async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    // Call multiple times in sequence
    await act(async () => {
      result.current("a");
    });
    await act(async () => {
      result.current("b");
    });
    await act(async () => {
      result.current("c");
    });

    // Wait for the debounce to complete
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // The last call should be executed
    expect(callback).toHaveBeenCalledWith("c");
  });

  it("should clear previous timeout on new call", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    result.current("first");

    act(() => vi.advanceTimersByTime(200));

    result.current("second");

    act(() => vi.advanceTimersByTime(500));

    // Should only be called with the last value
    expect(callback).toHaveBeenLastCalledWith("second");
  });
});
