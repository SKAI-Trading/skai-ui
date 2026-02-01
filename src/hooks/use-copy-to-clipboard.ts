import { useState, useCallback } from "react";

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

  const reset = useCallback(() => {
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
        setCopiedText(text);
        setIsCopied(true);

        // Auto-reset after delay
        if (resetDelay > 0) {
          setTimeout(reset, resetDelay);
        }

        return true;
      } catch (error) {
        console.warn("Copy failed", error);
        setCopiedText(null);
        setIsCopied(false);
        return false;
      }
    },
    [reset, resetDelay],
  );

  return { copiedText, isCopied, copy, reset };
}
