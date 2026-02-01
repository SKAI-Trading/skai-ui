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
});
