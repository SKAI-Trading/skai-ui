import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "../hooks/use-click-outside";
import { useKeyboardShortcut } from "../hooks/use-keyboard-shortcut";

/**
 * Regression for W60-UI-01:
 *
 * Prior versions of useClickOutside / useKeyboardShortcut put the user
 * `handler` / `callback` in the effect deps, so every render re-ran the
 * effect and detached + re-attached document-level mousedown/touchstart
 * /keydown listeners. With inline closures (the common case) this happened
 * on EVERY parent render.
 *
 * These tests pin the listener-attach count to 1 across re-renders. They
 * would fail if the effect ever re-runs unnecessarily.
 */

describe("useClickOutside — listener stability across re-renders", () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(document, "addEventListener");
    removeSpy = vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("does not re-attach mousedown/touchstart on every render when handler identity changes", () => {
    const { rerender, unmount } = renderHook(
      // Fresh closure each render
      ({ value }: { value: number }) =>
        useClickOutside(() => {
          void value;
        }),
      { initialProps: { value: 0 } },
    );

    const countAddsFor = (type: string) =>
      addSpy.mock.calls.filter((call: unknown[]) => call[0] === type).length;

    expect(countAddsFor("mousedown")).toBe(1);
    expect(countAddsFor("touchstart")).toBe(1);

    rerender({ value: 1 });
    rerender({ value: 2 });
    rerender({ value: 3 });

    // Still ONE listener of each — the latest-callback ref absorbs the
    // changing closure without touching the document.
    expect(countAddsFor("mousedown")).toBe(1);
    expect(countAddsFor("touchstart")).toBe(1);

    unmount();

    const countRemovesFor = (type: string) =>
      removeSpy.mock.calls.filter((call: unknown[]) => call[0] === type).length;
    expect(countRemovesFor("mousedown")).toBe(1);
    expect(countRemovesFor("touchstart")).toBe(1);
  });
});

describe("useKeyboardShortcut — listener stability across re-renders", () => {
  let addSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addSpy = vi.spyOn(document, "addEventListener");
    removeSpy = vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("does not re-attach keydown when only the inline callback identity changes", () => {
    const { rerender, unmount } = renderHook(
      ({ value }: { value: number }) =>
        useKeyboardShortcut("k", () => {
          void value;
        }),
      { initialProps: { value: 0 } },
    );

    const countAdds = () =>
      addSpy.mock.calls.filter((call: unknown[]) => call[0] === "keydown").length;

    expect(countAdds()).toBe(1);

    rerender({ value: 1 });
    rerender({ value: 2 });

    expect(countAdds()).toBe(1);

    unmount();
    expect(
      removeSpy.mock.calls.filter((call: unknown[]) => call[0] === "keydown").length,
    ).toBe(1);
  });

  it("always invokes the LATEST callback (no stale closure)", () => {
    let latestSeen = -1;
    const { rerender } = renderHook(
      ({ value }: { value: number }) =>
        useKeyboardShortcut("k", () => {
          latestSeen = value;
        }),
      { initialProps: { value: 0 } },
    );

    rerender({ value: 7 });
    rerender({ value: 42 });

    // Simulate the actual key press now
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    expect(latestSeen).toBe(42);
  });
});
