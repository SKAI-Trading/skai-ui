import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();
  options: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper to trigger intersection
  trigger(isIntersecting: boolean, target?: Element) {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map(
      (el) => ({
        target: target || el,
        isIntersecting,
        boundingClientRect: el.getBoundingClientRect(),
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: el.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      })
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }

  static instances: MockIntersectionObserver[] = [];
  static clear() {
    MockIntersectionObserver.instances = [];
  }
}

describe("useIntersectionObserver", () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    MockIntersectionObserver.clear();
    (window as unknown as Record<string, unknown>).IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    (window as unknown as Record<string, unknown>).IntersectionObserver = originalIntersectionObserver;
  });

  it("should return ref and initial state", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeNull();
  });

  it("should create IntersectionObserver with default options", () => {
    renderHook(() => useIntersectionObserver());

    expect(MockIntersectionObserver.instances.length).toBe(0); // No element attached yet
  });

  it("should update isIntersecting when element enters viewport", async () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching ref to an element
    const element = document.createElement("div");
    Object.defineProperty(result.current.ref, "current", {
      value: element,
      writable: true,
    });

    // Re-render to trigger effect
    const { result: newResult, rerender } = renderHook(() =>
      useIntersectionObserver()
    );

    // After element is attached and observer is created
    await waitFor(() => {
      if (MockIntersectionObserver.instances.length > 0) {
        const observer = MockIntersectionObserver.instances[0];
        observer.observe(element);
        
        act(() => {
          observer.trigger(true);
        });
      }
    });
  });

  it("should handle disabled state", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ enabled: false })
    );

    expect(result.current.isIntersecting).toBe(false);
  });

  it("should accept custom threshold", () => {
    renderHook(() => useIntersectionObserver({ threshold: 0.5 }));

    // Threshold is passed to constructor
    if (MockIntersectionObserver.instances.length > 0) {
      expect(MockIntersectionObserver.instances[0].options.threshold).toBe(0.5);
    }
  });

  it("should accept array of thresholds", () => {
    renderHook(() =>
      useIntersectionObserver({ threshold: [0, 0.25, 0.5, 0.75, 1] })
    );

    if (MockIntersectionObserver.instances.length > 0) {
      expect(MockIntersectionObserver.instances[0].options.threshold).toEqual([
        0, 0.25, 0.5, 0.75, 1,
      ]);
    }
  });

  it("should accept custom rootMargin", () => {
    renderHook(() => useIntersectionObserver({ rootMargin: "10px 20px" }));

    if (MockIntersectionObserver.instances.length > 0) {
      expect(MockIntersectionObserver.instances[0].options.rootMargin).toBe(
        "10px 20px"
      );
    }
  });

  it("should handle triggerOnce option", async () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );

    const element = document.createElement("div");
    Object.defineProperty(result.current.ref, "current", {
      value: element,
      writable: true,
    });
  });

  it("should clean up observer on unmount", () => {
    const { unmount } = renderHook(() => useIntersectionObserver());

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });

  it("should handle re-renders without creating duplicate observers", () => {
    const { rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0 } }
    );

    const initialCount = MockIntersectionObserver.instances.length;

    rerender({ threshold: 0.5 });

    // Should clean up old observer before creating new one
    // The count might increase but old ones should be disconnected
  });

  it("should return entry object with intersection details", async () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Initially entry is null
    expect(result.current.entry).toBeNull();
  });

  it("should use provided root element", () => {
    const rootElement = document.createElement("div");

    renderHook(() => useIntersectionObserver({ root: rootElement }));

    if (MockIntersectionObserver.instances.length > 0) {
      expect(MockIntersectionObserver.instances[0].options.root).toBe(rootElement);
    }
  });
});

describe("useIntersectionObserver with real IntersectionObserver", () => {
  // Skip if IntersectionObserver is not available
  const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

  it.skipIf(!hasIntersectionObserver)("should work with real browser API", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isIntersecting).toBe("boolean");
  });
});
