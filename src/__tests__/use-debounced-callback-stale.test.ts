import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedCallback } from "../hooks/use-debounce";

// W59 — useDebouncedCallback captured the callback identity at mount and never
// refreshed it because the returned function wasn't memoised on callback. This
// shipped a classic stale-closure bug for any consumer passing inline lambdas
// (which is almost all of them). The fix keeps the latest callback in a ref.
describe("useDebouncedCallback — captures latest callback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("invokes the latest callback after re-render", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 500),
      { initialProps: { cb: first as () => void } },
    );

    // arm the debounce with the OLD callback identity
    act(() => {
      (result.current as (...a: unknown[]) => void)("a");
    });

    // swap the callback before the timer fires
    rerender({ cb: second as () => void });

    act(() => vi.advanceTimersByTime(500));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("a");
  });

  it("returns a stable function identity when only callback changes", () => {
    const a = vi.fn();
    const b = vi.fn();
    const { result, rerender } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 500),
      { initialProps: { cb: a as () => void } },
    );
    const firstFn = result.current;
    rerender({ cb: b as () => void });
    expect(result.current).toBe(firstFn);
  });
});
