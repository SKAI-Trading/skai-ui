/**
 * SKAI Accessibility Utilities
 *
 * Helpers for building accessible components.
 */

import * as React from "react";

// ============================================
// Unique ID Generation
// ============================================

let idCounter = 0;

/**
 * Generate a unique ID for form elements.
 * Uses React.useId when available (React 18+), falls back to counter.
 */
export function useGeneratedId(providedId?: string): string {
  const reactId = React.useId?.();
  const fallbackId = React.useMemo(() => {
    return providedId || reactId || `skai-${++idCounter}`;
  }, [providedId, reactId]);

  return fallbackId;
}

// ============================================
// Form Field Context (Standalone - for custom form implementations)
// ============================================

interface A11yFormFieldContextValue {
  id: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  hasError: boolean;
}

const A11yFormFieldContext = React.createContext<
  A11yFormFieldContextValue | undefined
>(undefined);

export function useA11yFormField() {
  const context = React.useContext(A11yFormFieldContext);
  if (!context) {
    throw new Error(
      "useA11yFormField must be used within a A11yFormFieldProvider",
    );
  }
  return context;
}

export interface A11yFormFieldProviderProps {
  children: React.ReactNode;
  id?: string;
  hasError?: boolean;
}

export function A11yFormFieldProvider({
  children,
  id: providedId,
  hasError = false,
}: A11yFormFieldProviderProps) {
  const id = useGeneratedId(providedId);

  const value = React.useMemo(
    () => ({
      id,
      labelId: `${id}-label`,
      descriptionId: `${id}-description`,
      errorId: `${id}-error`,
      hasError,
    }),
    [id, hasError],
  );

  return (
    <A11yFormFieldContext.Provider value={value}>
      {children}
    </A11yFormFieldContext.Provider>
  );
}

// ============================================
// Focus Management
// ============================================

/**
 * Focus trap hook for modals and dialogs
 */
export function useFocusTrap(active: boolean = true) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}

/**
 * Return focus to previous element when component unmounts
 */
export function useReturnFocus(active: boolean = true) {
  const previousElement = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (!active) return;

    previousElement.current = document.activeElement;

    return () => {
      if (previousElement.current instanceof HTMLElement) {
        previousElement.current.focus();
      }
    };
  }, [active]);
}

// ============================================
// Screen Reader Announcements
// ============================================

/**
 * Announce a message to screen readers
 */
export function announce(
  message: string,
  priority: "polite" | "assertive" = "polite",
) {
  const announcer = document.createElement("div");
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", priority);
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  announcer.textContent = message;

  document.body.appendChild(announcer);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Hook for managing announcements
 */
export function useAnnounce() {
  const announceRef = React.useRef<HTMLDivElement>(null);

  const announceMessage = React.useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (announceRef.current) {
        announceRef.current.setAttribute("aria-live", priority);
        announceRef.current.textContent = message;

        // Clear after delay
        setTimeout(() => {
          if (announceRef.current) {
            announceRef.current.textContent = "";
          }
        }, 1000);
      }
    },
    [],
  );

  const AnnouncerElement = React.useMemo(
    () => (
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    ),
    [],
  );

  return { announce: announceMessage, Announcer: AnnouncerElement };
}

// ============================================
// Keyboard Navigation
// ============================================

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyHandlers {
  [key: string]: KeyHandler;
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardNavigation(
  handlers: KeyHandlers,
  active: boolean = true,
) {
  React.useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const handler = handlers[event.key];
      if (handler) {
        handler(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlers, active]);
}

/**
 * Arrow key navigation for lists/grids
 */
export function useArrowNavigation(
  itemsRef: React.RefObject<HTMLElement[]>,
  options: {
    orientation?: "horizontal" | "vertical" | "both";
    loop?: boolean;
    onSelect?: (index: number) => void;
  } = {},
) {
  const { orientation = "vertical", loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = React.useState(0);

  const navigate = React.useCallback(
    (direction: "next" | "prev") => {
      const items = itemsRef.current;
      if (!items || items.length === 0) return;

      let newIndex = activeIndex;

      if (direction === "next") {
        newIndex = activeIndex + 1;
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1;
        }
      } else {
        newIndex = activeIndex - 1;
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0;
        }
      }

      setActiveIndex(newIndex);
      items[newIndex]?.focus();
    },
    [activeIndex, itemsRef, loop],
  );

  const handlers = React.useMemo(() => {
    const h: KeyHandlers = {};

    if (orientation === "vertical" || orientation === "both") {
      h.ArrowDown = () => navigate("next");
      h.ArrowUp = () => navigate("prev");
    }

    if (orientation === "horizontal" || orientation === "both") {
      h.ArrowRight = () => navigate("next");
      h.ArrowLeft = () => navigate("prev");
    }

    h.Enter = () => onSelect?.(activeIndex);
    h[" "] = () => onSelect?.(activeIndex);

    return h;
  }, [orientation, navigate, onSelect, activeIndex]);

  useKeyboardNavigation(handlers);

  return { activeIndex, setActiveIndex };
}

// ============================================
// Skip Link Component
// ============================================

export interface SkipLinkProps {
  /** Target element ID to skip to */
  targetId: string;
  /** Link text */
  children?: React.ReactNode;
}

export function SkipLink({
  targetId,
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border focus:rounded-md"
    >
      {children}
    </a>
  );
}

// ============================================
// Visually Hidden Component
// ============================================

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Force visibility for debugging */
  debug?: boolean;
}

export function VisuallyHidden({
  debug = false,
  className,
  children,
  ...props
}: VisuallyHiddenProps) {
  return (
    <span className={debug ? className : "sr-only"} {...props}>
      {children}
    </span>
  );
}
