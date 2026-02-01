import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown, formatCountdown } from "../hooks/use-countdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with correct values for Date target", () => {
    const target = new Date(Date.now() + 3600000); // 1 hour from now
    const { result } = renderHook(() => useCountdown(target));

    expect(result.current.hours).toBe(1);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });

  it("should initialize with correct values for seconds target", () => {
    const { result } = renderHook(() => useCountdown(90)); // 90 seconds

    expect(result.current.totalSeconds).toBe(90);
    expect(result.current.minutes).toBe(1);
    expect(result.current.seconds).toBe(30);
  });

  it("should count down over time", () => {
    const { result } = renderHook(() => useCountdown(5));

    expect(result.current.totalSeconds).toBe(5);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.totalSeconds).toBe(4);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.totalSeconds).toBe(2);
  });

  it("should complete when reaching zero", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCountdown(2, { onComplete }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isComplete).toBe(true);
    expect(onComplete).toHaveBeenCalled();
  });

  it("should support pause and resume", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.totalSeconds).toBe(8);

    act(() => {
      result.current.pause();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should still be 8 since paused
    expect(result.current.totalSeconds).toBe(8);

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.totalSeconds).toBe(6);
  });

  it("should support reset", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.totalSeconds).toBe(5);

    act(() => {
      result.current.reset();
    });

    expect(result.current.totalSeconds).toBe(10);
  });

  it("should support autoStart option", () => {
    const { result } = renderHook(() => useCountdown(10, { autoStart: false }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.totalSeconds).toBe(10); // Still 10 since not started
  });

  it("should calculate days correctly", () => {
    const { result } = renderHook(() => useCountdown(90061)); // 1 day + 1 hour + 1 minute + 1 second

    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(1);
    expect(result.current.minutes).toBe(1);
    expect(result.current.seconds).toBe(1);
  });
});

describe("formatCountdown", () => {
  it("should format full style correctly", () => {
    const countdown = {
      days: 1,
      hours: 2,
      minutes: 30,
      seconds: 45,
      totalSeconds: 95445,
      isComplete: false,
      isRunning: true,
      start: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
    };

    expect(formatCountdown(countdown, "full")).toBe("1d 2h 30m 45s");
  });

  it("should format short style correctly", () => {
    const countdown = {
      days: 0,
      hours: 2,
      minutes: 30,
      seconds: 45,
      totalSeconds: 9045,
      isComplete: false,
      isRunning: true,
      start: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
    };

    expect(formatCountdown(countdown, "short")).toBe("02:30:45");
  });

  it("should format minimal style correctly", () => {
    const countdown = {
      days: 0,
      hours: 0,
      minutes: 5,
      seconds: 30,
      totalSeconds: 330,
      isComplete: false,
      isRunning: true,
      start: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
    };

    // Minimal shows only the largest unit
    expect(formatCountdown(countdown, "minimal")).toBe("5m");
  });

  it("should handle zero values", () => {
    const countdown = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isComplete: true,
      isRunning: false,
      start: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
    };

    // Short format with 0 hours shows mm:ss
    expect(formatCountdown(countdown, "short")).toBe("00:00");
  });
});
