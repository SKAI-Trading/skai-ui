/**
 * Accessibility utilities for skai-ui components
 * Provides helpers for ARIA attributes, keyboard navigation, and screen reader support
 */

import { KeyboardEvent, useCallback, useRef, useState } from "react";

// ============================================================================
// ARIA Helper Utilities
// ============================================================================

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export const generateId = (prefix = "skai"): string => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Create ARIA describedby relationship
 */
export interface AriaDescribedByProps {
  id: string;
  describedById: string;
}

export const createAriaDescribedBy = (
  baseId: string,
): AriaDescribedByProps => ({
  id: baseId,
  describedById: `${baseId}-description`,
});

/**
 * Create ARIA labelledby relationship
 */
export interface AriaLabelledByProps {
  id: string;
  labelledById: string;
}

export const createAriaLabelledBy = (baseId: string): AriaLabelledByProps => ({
  id: baseId,
  labelledById: `${baseId}-label`,
});

// ============================================================================
// Keyboard Navigation Utilities
// ============================================================================

/**
 * Common keyboard keys used in navigation
 */
export const Keys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
} as const;

/**
 * Handle keyboard navigation for list items
 */
export interface UseRovingFocusOptions {
  itemCount: number;
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
  onSelect?: (index: number) => void;
}

export function useRovingFocus({
  itemCount,
  orientation = "vertical",
  loop = true,
  onSelect,
}: UseRovingFocusOptions) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isVertical = orientation === "vertical" || orientation === "both";
      const isHorizontal =
        orientation === "horizontal" || orientation === "both";

      let newIndex = activeIndex;
      let handled = false;

      switch (event.key) {
        case Keys.ArrowUp:
          if (isVertical) {
            newIndex = activeIndex - 1;
            handled = true;
          }
          break;
        case Keys.ArrowDown:
          if (isVertical) {
            newIndex = activeIndex + 1;
            handled = true;
          }
          break;
        case Keys.ArrowLeft:
          if (isHorizontal) {
            newIndex = activeIndex - 1;
            handled = true;
          }
          break;
        case Keys.ArrowRight:
          if (isHorizontal) {
            newIndex = activeIndex + 1;
            handled = true;
          }
          break;
        case Keys.Home:
          newIndex = 0;
          handled = true;
          break;
        case Keys.End:
          newIndex = itemCount - 1;
          handled = true;
          break;
        case Keys.Enter:
        case Keys.Space:
          onSelect?.(activeIndex);
          handled = true;
          break;
      }

      if (handled) {
        event.preventDefault();

        // Handle loop behavior
        if (loop) {
          if (newIndex < 0) newIndex = itemCount - 1;
          if (newIndex >= itemCount) newIndex = 0;
        } else {
          newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));
        }

        setActiveIndex(newIndex);
      }
    },
    [activeIndex, itemCount, loop, onSelect, orientation],
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    getItemProps: (index: number) => ({
      tabIndex: index === activeIndex ? 0 : -1,
      "aria-selected": index === activeIndex,
    }),
  };
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function useFocusTrap(active = true) {
  const containerRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== Keys.Tab) return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    },
    [active],
  );

  return { containerRef, handleKeyDown };
}

// ============================================================================
// Screen Reader Utilities
// ============================================================================

/**
 * Live region for announcements
 */
export interface UseLiveRegionOptions {
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
}

export function useLiveRegion({
  politeness = "polite",
  atomic = true,
}: UseLiveRegionOptions = {}) {
  const [message, setMessage] = useState("");

  const announce = useCallback((text: string, clearAfter = 1000) => {
    setMessage(text);
    if (clearAfter > 0) {
      setTimeout(() => setMessage(""), clearAfter);
    }
  }, []);

  const liveRegionProps = {
    role: "status" as const,
    "aria-live": politeness,
    "aria-atomic": atomic,
  };

  return { message, announce, liveRegionProps };
}

/**
 * Visually hidden text for screen readers only
 */
export const visuallyHiddenStyles: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Visually hidden component
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span style={visuallyHiddenStyles}>{children}</span>;
}

// ============================================================================
// Focus Management Utilities
// ============================================================================

/**
 * Manage focus return when closing modals/dialogs
 */
export function useFocusReturn() {
  const previousFocus = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    previousFocus.current?.focus();
    previousFocus.current = null;
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Auto-focus an element on mount
 */
export function useAutoFocus(shouldFocus = true) {
  const setRef = useCallback(
    (element: HTMLElement | null) => {
      if (shouldFocus && element) {
        // Delay focus to ensure element is ready
        requestAnimationFrame(() => {
          element.focus();
        });
      }
    },
    [shouldFocus],
  );

  return setRef;
}

// ============================================================================
// ARIA Attribute Helpers
// ============================================================================

/**
 * Props for expandable/collapsible elements
 */
export const getExpandedProps = (expanded: boolean, controlsId: string) => ({
  "aria-expanded": expanded,
  "aria-controls": controlsId,
});

/**
 * Props for selected elements
 */
export const getSelectedProps = (selected: boolean) => ({
  "aria-selected": selected,
});

/**
 * Props for disabled elements
 */
export const getDisabledProps = (disabled: boolean) => ({
  "aria-disabled": disabled,
  tabIndex: disabled ? -1 : 0,
});

/**
 * Props for loading states
 */
export const getLoadingProps = (
  loading: boolean,
  loadingText = "Loading...",
) => ({
  "aria-busy": loading,
  "aria-label": loading ? loadingText : undefined,
});

/**
 * Props for required form fields
 */
export const getRequiredProps = (required: boolean) => ({
  "aria-required": required,
  required,
});

/**
 * Props for invalid form fields
 */
export const getInvalidProps = (
  invalid: boolean,
  errorMessage?: string,
  errorId?: string,
) => ({
  "aria-invalid": invalid,
  "aria-describedby": invalid && errorId ? errorId : undefined,
  "aria-errormessage": invalid && errorMessage ? errorMessage : undefined,
});

// ============================================================================
// Color Contrast Utilities
// ============================================================================

/**
 * Get contrasting text color based on background
 */
export function getContrastColor(hexColor: string): "black" | "white" {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark
  return luminance > 0.5 ? "black" : "white";
}

// ============================================================================
// Reduced Motion Utilities
// ============================================================================

// Note: usePrefersReducedMotion is available from "./hooks/use-media-query"
// Import it as: import { usePrefersReducedMotion } from "@skai/ui";

/**
 * Get animation duration based on reduced motion preference
 * Use with usePrefersReducedMotion from hooks/use-media-query
 */
export function getAnimationDuration(
  prefersReducedMotion: boolean,
  normalDuration: number,
  reducedDuration = 0,
): number {
  return prefersReducedMotion ? reducedDuration : normalDuration;
}
