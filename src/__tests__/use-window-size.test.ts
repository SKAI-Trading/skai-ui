import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useWindowSize,
  useScrollPosition,
  useScrolled,
} from "../hooks/use-window-size";

describe("useWindowSize", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Reset to default values
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it("should return current window dimensions", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it("should update dimensions on resize", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 800 });
      Object.defineProperty(window, "innerHeight", { value: 600 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useWindowSize());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should handle multiple resize events", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 500 });
      Object.defineProperty(window, "innerHeight", { value: 400 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({ width: 500, height: 400 });

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 1920 });
      Object.defineProperty(window, "innerHeight", { value: 1080 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({ width: 1920, height: 1080 });
  });
});

describe("useScrollPosition", () => {
  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;

  beforeEach(() => {
    Object.defineProperty(window, "scrollX", {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "scrollX", {
      writable: true,
      configurable: true,
      value: originalScrollX,
    });
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: originalScrollY,
    });
  });

  it("should return initial scroll position", () => {
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it("should update on scroll", () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, "scrollX", { value: 100 });
      Object.defineProperty(window, "scrollY", { value: 200 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it("should clean up scroll listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollPosition());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should handle horizontal and vertical scroll independently", () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, "scrollX", { value: 50 });
      Object.defineProperty(window, "scrollY", { value: 0 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: 50, y: 0 });

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: 50, y: 100 });
  });
});

describe("useScrolled", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("should return false when not scrolled past threshold", () => {
    const { result } = renderHook(() => useScrolled(10));

    expect(result.current).toBe(false);
  });

  it("should return true when scrolled past default threshold", () => {
    const { result } = renderHook(() => useScrolled());

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 15 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("should respect custom threshold", () => {
    const { result } = renderHook(() => useScrolled(50));

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 40 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 60 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("should return false when exactly at threshold", () => {
    const { result } = renderHook(() => useScrolled(100));

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("should toggle based on scroll position", () => {
    const { result } = renderHook(() => useScrolled(10));

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 20 });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 5 });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });
});
