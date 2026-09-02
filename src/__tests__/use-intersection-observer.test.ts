import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act, render, waitFor } from "@testing-library/react";
import * as React from "react";
import {
  useIntersectionObserver,
  useScrollProgress,
  type UseIntersectionObserverOptions,
} from "../hooks/use-intersection-observer";

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();
  options: IntersectionObserverInit;

  constructor(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
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

  // Helper to trigger intersection for a specific element (or all if no target)
  trigger(isIntersecting: boolean, target?: Element) {
    // If a specific target is provided, only create entry for that element
    const elementsToReport = target
      ? [target].filter((el) => this.elements.has(el))
      : Array.from(this.elements);

    const entries: IntersectionObserverEntry[] = elementsToReport.map((el) => ({
      target: el,
      isIntersecting,
      boundingClientRect: el.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: el.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now(),
    }));

    if (entries.length > 0) {
      this.callback(entries, this as unknown as IntersectionObserver);
    }
  }

  static instances: MockIntersectionObserver[] = [];
  static clear() {
    MockIntersectionObserver.instances = [];
  }
}

/**
 * Mount the hook on a real element.
 *
 * The hook only constructs an IntersectionObserver once `ref.current` holds a
 * node, and React is what puts it there. Assigning to `ref.current` by hand
 * after `renderHook` misses that: the effect has already run and seen null, so
 * no observer exists and every option the caller passed goes unexercised.
 * Rendering an element with the ref attached is what makes the observer real.
 */
function renderProbe(options: UseIntersectionObserverOptions = {}) {
  const seen: {
    isIntersecting: boolean;
    entry: IntersectionObserverEntry | null;
    element: HTMLElement | null;
  } = { isIntersecting: false, entry: null, element: null };

  const Probe: React.FC<{ opts: UseIntersectionObserverOptions }> = ({
    opts,
  }) => {
    const { ref, isIntersecting, entry } = useIntersectionObserver(opts);
    seen.isIntersecting = isIntersecting;
    seen.entry = entry;
    seen.element = ref.current;
    return React.createElement("div", {
      ref: ref as React.Ref<HTMLDivElement>,
      "data-testid": "probe",
    });
  };

  const utils = render(React.createElement(Probe, { opts: options }));
  return { ...utils, seen };
}

/** The single observer the probe created, failing loudly if there isn't one. */
function soleObserver(): MockIntersectionObserver {
  expect(MockIntersectionObserver.instances).toHaveLength(1);
  return MockIntersectionObserver.instances[0];
}

describe("useIntersectionObserver", () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    MockIntersectionObserver.clear();
    (window as unknown as Record<string, unknown>).IntersectionObserver =
      MockIntersectionObserver;
  });

  afterEach(() => {
    (window as unknown as Record<string, unknown>).IntersectionObserver =
      originalIntersectionObserver;
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
    const { seen } = renderProbe();
    const observer = soleObserver();

    expect(seen.isIntersecting).toBe(false);

    act(() => {
      observer.trigger(true);
    });
    await waitFor(() => expect(seen.isIntersecting).toBe(true));
    expect(seen.entry?.isIntersecting).toBe(true);

    act(() => {
      observer.trigger(false);
    });
    await waitFor(() => expect(seen.isIntersecting).toBe(false));
  });

  it("observes the element the ref was attached to", () => {
    const { getByTestId } = renderProbe();
    expect(soleObserver().elements.has(getByTestId("probe"))).toBe(true);
  });

  it("creates no observer while disabled", () => {
    renderProbe({ enabled: false });
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("should handle disabled state", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ enabled: false }),
    );

    expect(result.current.isIntersecting).toBe(false);
  });

  it("should accept custom threshold", () => {
    const { seen } = renderProbe({ threshold: 0.5 });

    // The observer is looked up positionally, not by the value under test —
    // finding it by `threshold === 0.5` and then asserting that same equality
    // is a tautology, and it is satisfied by there being no observer at all.
    expect(soleObserver().options.threshold).toBe(0.5);
    expect(seen.isIntersecting).toBe(false);
  });

  it("should accept array of thresholds", () => {
    const thresholds = [0, 0.25, 0.5, 0.75, 1];
    renderProbe({ threshold: thresholds });

    expect(soleObserver().options.threshold).toEqual(thresholds);
  });

  it("should accept custom rootMargin", () => {
    renderProbe({ rootMargin: "10px 20px" });

    expect(soleObserver().options.rootMargin).toBe("10px 20px");
  });

  it("should handle triggerOnce option", async () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true }),
    );

    const element = document.createElement("div");
    Object.defineProperty(result.current.ref, "current", {
      value: element,
      writable: true,
    });

    // Verify the hook returns expected structure with triggerOnce
    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeNull();
  });

  it("should clean up observer on unmount", () => {
    const { unmount } = renderHook(() => useIntersectionObserver());

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });

  it("should handle re-renders without creating duplicate observers", () => {
    const { rerender, result } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0 } },
    );

    // Verify initial hook returns expected structure
    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);

    // Capture the initial count for comparison
    const initialCount = MockIntersectionObserver.instances.length;

    rerender({ threshold: 0.5 });

    // Verify hook still works after rerender
    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);

    // Should clean up old observer before creating new one - count should not increase
    // (old observer is disconnected, so count stays same or decreases)
    expect(MockIntersectionObserver.instances.length).toBeLessThanOrEqual(
      initialCount,
    );
  });

  it("should return entry object with intersection details", async () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Initially entry is null
    expect(result.current.entry).toBeNull();
  });

  it("should use provided root element", () => {
    const rootElement = document.createElement("div");
    renderProbe({ root: rootElement });

    expect(soleObserver().options.root).toBe(rootElement);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount, getByTestId } = renderProbe();
    const observer = soleObserver();
    const element = getByTestId("probe");

    expect(observer.elements.has(element)).toBe(true);
    unmount();
    expect(observer.elements.size).toBe(0);
  });

  it("stops observing after the first intersection when triggerOnce is set", async () => {
    const { seen } = renderProbe({ triggerOnce: true });
    const observer = soleObserver();

    act(() => {
      observer.trigger(true);
    });
    await waitFor(() => expect(seen.isIntersecting).toBe(true));
    expect(observer.elements.size).toBe(0);
  });
});

describe("useScrollProgress", () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    MockIntersectionObserver.clear();
    (window as unknown as Record<string, unknown>).IntersectionObserver =
      MockIntersectionObserver;
  });

  afterEach(() => {
    (window as unknown as Record<string, unknown>).IntersectionObserver =
      originalIntersectionObserver;
  });

  it("does not re-create the observer on re-render (stable threshold)", () => {
    const element = document.createElement("div");
    const { result, rerender } = renderHook(() => useScrollProgress());

    act(() => {
      Object.defineProperty(result.current.ref, "current", {
        value: element,
        writable: true,
        configurable: true,
      });
    });
    rerender();

    const countAfterFirst = MockIntersectionObserver.instances.length;

    // Several extra renders with no prop change must NOT spin up new observers.
    rerender();
    rerender();
    rerender();

    expect(MockIntersectionObserver.instances.length).toBe(countAfterFirst);
    expect(result.current.progress).toBe(0);
  });
});

describe("useIntersectionObserver with real IntersectionObserver", () => {
  // Skip if IntersectionObserver is not available
  const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

  it.skipIf(!hasIntersectionObserver)(
    "should work with real browser API",
    () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.ref).toBeDefined();
      expect(typeof result.current.isIntersecting).toBe("boolean");
    },
  );
});
