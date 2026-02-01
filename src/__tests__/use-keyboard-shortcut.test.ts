import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useKeyboardShortcut,
  useEscapeKey,
  SHORTCUTS,
} from "../hooks/use-keyboard-shortcut";

describe("useKeyboardShortcut", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, "addEventListener");
    removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should register keydown event listener on mount", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });

  it("should remove event listener on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut("k", callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });

  it("should call callback when matching key is pressed", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should be case-insensitive for letters", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "K" }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when different key is pressed", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "j" }));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should require Ctrl/Cmd when ctrl option is true", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback, { ctrl: true }));

    // Without ctrl - should not fire
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    });
    expect(callback).not.toHaveBeenCalled();

    // With ctrl - should fire
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
      );
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should require Shift when shift option is true", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback, { shift: true }));

    // Without shift - should not fire
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    });
    expect(callback).not.toHaveBeenCalled();

    // With shift - should fire
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", shiftKey: true }),
      );
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should require Alt when alt option is true", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback, { alt: true }));

    // Without alt - should not fire
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    });
    expect(callback).not.toHaveBeenCalled();

    // With alt - should fire
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", altKey: true }),
      );
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not register when enabled is false", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("k", callback, { enabled: false }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k" }));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should prevent default when preventDefault is true", () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut("k", callback, { preventDefault: true }),
    );

    const event = new KeyboardEvent("keydown", { key: "k" });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should stop propagation when stopPropagation is true", () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut("k", callback, { stopPropagation: true }),
    );

    const event = new KeyboardEvent("keydown", { key: "k" });
    const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

    act(() => {
      document.dispatchEvent(event);
    });

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("should handle special keys like Escape", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut(SHORTCUTS.ESCAPE, callback));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle Enter key", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut(SHORTCUTS.ENTER, callback));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle arrow keys", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut(SHORTCUTS.ARROW_DOWN, callback));

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("useEscapeKey", () => {
  it("should call callback on Escape key press", () => {
    const callback = vi.fn();
    renderHook(() => useEscapeKey(callback));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when disabled", () => {
    const callback = vi.fn();
    renderHook(() => useEscapeKey(callback, false));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should re-enable when enabled changes to true", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) => useEscapeKey(callback, enabled),
      { initialProps: { enabled: false } },
    );

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(callback).not.toHaveBeenCalled();

    rerender({ enabled: true });

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("SHORTCUTS constants", () => {
  it("should have correct escape value", () => {
    expect(SHORTCUTS.ESCAPE).toBe("Escape");
  });

  it("should have correct enter value", () => {
    expect(SHORTCUTS.ENTER).toBe("Enter");
  });

  it("should have correct arrow keys", () => {
    expect(SHORTCUTS.ARROW_UP).toBe("ArrowUp");
    expect(SHORTCUTS.ARROW_DOWN).toBe("ArrowDown");
    expect(SHORTCUTS.ARROW_LEFT).toBe("ArrowLeft");
    expect(SHORTCUTS.ARROW_RIGHT).toBe("ArrowRight");
  });

  it("should have all expected shortcuts", () => {
    expect(SHORTCUTS.SPACE).toBe(" ");
    expect(SHORTCUTS.TAB).toBe("Tab");
    expect(SHORTCUTS.BACKSPACE).toBe("Backspace");
    expect(SHORTCUTS.DELETE).toBe("Delete");
  });
});
