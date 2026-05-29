import { useState, useCallback, useRef, useEffect } from "react";

export interface UseCopyToClipboardReturn {
  /** The currently copied text */
  copiedText: string | null;
  /** Whether the copy was successful */
  isCopied: boolean;
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Reset the copied state */
  reset: () => void;
}

/**
 * Copy text to clipboard with status tracking
 * @param resetDelay - Time in ms to auto-reset copied state (default: 2000ms)
 * @returns Copy utilities and state
 */
export function useCopyToClipboard(
  resetDelay: number = 2000,
): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  // Track the in-flight reset timer + mounted state so we never set state
  // after unmount (React 18 warning) and so rapid successive copy() calls
  // don't accumulate stale timers (W60-UI-01).
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    if (!isMountedRef.current) return;
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn("Clipboard not supported");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        if (!isMountedRef.current) return true;
        setCopiedText(text);
        setIsCopied(true);

        // Auto-reset after delay — cancel any prior pending reset first so
        // rapid back-to-back copy() calls don't leave a stale timer running.
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
          resetTimerRef.current = null;
        }
        if (resetDelay > 0) {
          resetTimerRef.current = setTimeout(reset, resetDelay);
        }

        return true;
      } catch (error) {
        console.warn("Copy failed", error);
        if (!isMountedRef.current) return false;
        setCopiedText(null);
        setIsCopied(false);
        return false;
      }
    },
    [reset, resetDelay],
  );

  return { copiedText, isCopied, copy, reset };
}
