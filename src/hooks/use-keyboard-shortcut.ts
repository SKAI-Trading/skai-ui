import { useEffect, useCallback } from "react";

export interface KeyboardShortcutOptions {
  /** Whether Ctrl/Cmd key is required */
  ctrl?: boolean;
  /** Whether Shift key is required */
  shift?: boolean;
  /** Whether Alt key is required */
  alt?: boolean;
  /** Whether Meta key is required */
  meta?: boolean;
  /** Whether the shortcut is enabled */
  enabled?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Stop event propagation */
  stopPropagation?: boolean;
}

/**
 * Register a keyboard shortcut
 * @param key - The key to listen for (e.g., "k", "Enter", "Escape")
 * @param callback - Function to call when shortcut is triggered
 * @param options - Configuration options
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {},
): void {
  const {
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if modifiers match
      const ctrlMatch = ctrl
        ? event.ctrlKey || event.metaKey
        : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;
      const metaMatch = meta ? event.metaKey : true;

      // Check if the key matches (case-insensitive for letters)
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback(event);
      }
    },
    [key, ctrl, shift, alt, meta, preventDefault, stopPropagation, callback],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * Common keyboard shortcuts
 */
export const SHORTCUTS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  BACKSPACE: "Backspace",
  DELETE: "Delete",
} as const;

/**
 * Hook for escape key (commonly used for closing modals)
 */
export function useEscapeKey(
  callback: () => void,
  enabled: boolean = true,
): void {
  useKeyboardShortcut(SHORTCUTS.ESCAPE, callback, {
    enabled,
    preventDefault: false,
  });
}
