import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "../hooks/use-countdown";

/**
 * W60-UI-01 regression: useCountdown previously only ran its initializer at
 * mount, so swapping `targetDate` (e.g. "user picked a new deadline") kept
 * counting from the OLD seconds-remaining. And `onComplete` was in the
 * interval-effect deps, so any inline `onComplete={() => navigate(...)}`
 * tore down the interval every parent render, visibly dropping ticks.
 */
describe("useCountdown — targetDate change + stable onComplete (regression)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("recomputes remaining seconds when targetDate identity changes", () => {
    const { result, rerender } = renderHook(
      ({ target }: { target: number }) => useCountdown(target),
      { initialProps: { target: 10 } },
    );
    expect(result.current.totalSeconds).toBe(10);

    rerender({ target: 60 });
    // Must adopt the new target immediately, NOT keep counting from 10.
    expect(result.current.totalSeconds).toBe(60);
  });

  it("does NOT restart the interval when only the onComplete callback identity changes", () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    const { rerender } = renderHook(
      ({ cb }: { cb: () => void }) =>
        useCountdown(30, { onComplete: cb }),
      { initialProps: { cb: () => {} } },
    );

    const initialCalls = setIntervalSpy.mock.calls.length;

    // 3 parent renders with fresh inline closures
    rerender({ cb: () => {} });
    rerender({ cb: () => {} });
    rerender({ cb: () => {} });

    // No additional setInterval calls — the interval-effect deps no longer
    // include onComplete; the latest onComplete is read via ref at tick time.
    expect(setIntervalSpy.mock.calls.length).toBe(initialCalls);
    setIntervalSpy.mockRestore();
  });

  it("calls the LATEST onComplete (not the stale one captured at mount)", () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(
      ({ cb }: { cb: () => void }) => useCountdown(2, { onComplete: cb }),
      { initialProps: { cb: first } },
    );

    // Swap onComplete BEFORE the countdown hits zero
    rerender({ cb: second });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(second).toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
  });
});
