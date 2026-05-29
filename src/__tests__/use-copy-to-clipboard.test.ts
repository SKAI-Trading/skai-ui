import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";

describe("useCopyToClipboard", () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(""),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
    });
  });

  it("should initialize with idle state", () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current.copiedText).toBeNull();
    expect(result.current.isCopied).toBe(false);
  });

  it("should copy text to clipboard", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const success = await result.current.copy("test text");
      expect(success).toBe(true);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text");
    expect(result.current.copiedText).toBe("test text");
    expect(result.current.isCopied).toBe(true);
  });

  it("should reset status after timeout", async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("test");
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isCopied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });

  it("should handle copy failure", async () => {
    (
      navigator.clipboard.writeText as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Copy failed"));

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const success = await result.current.copy("test");
      expect(success).toBe(false);
    });

    expect(result.current.isCopied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });

  it("should provide reset function", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("test");
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isCopied).toBe(false);
    expect(result.current.copiedText).toBeNull();
  });

  it("should not auto-reset when resetDelay is 0", async () => {
    const { result } = renderHook(() => useCopyToClipboard(0));

    await act(async () => {
      await result.current.copy("test");
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should still be copied since no auto-reset
    expect(result.current.isCopied).toBe(true);
  });

  // W60-UI-01 regression — prior version left a setTimeout running after
  // unmount, which fired a setState on an unmounted hook (React warning) and
  // accumulated stale timers on every back-to-back copy() call.
  it("should not set state after unmount when reset timer fires", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("hello");
    });

    unmount();

    // Advancing past resetDelay must not produce a "set state on unmounted"
    // warning; the cleanup effect cancels the timer.
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it("cancels the previous reset timer when copy() is called again", async () => {
    const { result } = renderHook(() => useCopyToClipboard(1000));

    await act(async () => {
      await result.current.copy("first");
    });

    // Halfway through the first reset window
    act(() => {
      vi.advanceTimersByTime(500);
    });

    await act(async () => {
      await result.current.copy("second");
    });

    // 600ms after the SECOND copy — original timer would have fired here
    // (500 + 600 = 1100 > 1000) and clobbered the new value if not cancelled.
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current.copiedText).toBe("second");
    expect(result.current.isCopied).toBe(true);

    // 1000ms after the second copy — now the (renewed) timer fires.
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.isCopied).toBe(false);
  });
});
