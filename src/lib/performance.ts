/**
 * Performance utilities for skai-ui components
 * Provides helpers for memoization, virtualization, and render optimization
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

// ============================================================================
// Component Memoization Utilities
// ============================================================================

/**
 * Deep comparison function for props
 * Useful for complex objects in React.memo
 */
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 === "object") {
    const keys1 = Object.keys(obj1 as object);
    const keys2 = Object.keys(obj2 as object);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (
        !deepEqual(
          (obj1 as Record<string, unknown>)[key],
          (obj2 as Record<string, unknown>)[key],
        )
      ) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Create a memoized component with deep comparison
 */
export function createMemoizedComponent<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string,
): React.MemoExoticComponent<React.ComponentType<P>> {
  const MemoizedComponent = React.memo(Component, deepEqual);
  MemoizedComponent.displayName =
    displayName || `Memoized(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

// ============================================================================
// Render Optimization Hooks
// ============================================================================

/**
 * Prevent unnecessary re-renders by batching state updates
 */
export function useBatchedState<T>(
  initialState: T,
): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState(initialState);

  const batchUpdate = useCallback((updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return [state, batchUpdate];
}

/**
 * Track render count for debugging
 */
export function useRenderCount(componentName?: string): number {
  const countRef = useRef(0);
  countRef.current += 1;

  if (process.env.NODE_ENV === "development" && componentName) {
    console.log(`[${componentName}] Render count: ${countRef.current}`);
  }

  return countRef.current;
}

/**
 * Only update when specific props change
 */
export function useSelectiveUpdate<T extends object, K extends keyof T>(
  props: T,
  watchKeys: K[],
): Pick<T, K> {
  const watchedProps = watchKeys.reduce(
    (acc, key) => {
      acc[key] = props[key];
      return acc;
    },
    {} as Pick<T, K>,
  );

  return useMemo(
    () => watchedProps,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watchKeys.map((key) => props[key]),
  );
}

/**
 * Defer expensive calculations until idle
 */
export function useDeferredValue<T>(value: T, delay = 0): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    // Use requestIdleCallback if available
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setDeferredValue(value), {
        timeout: delay || 100,
      });
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback to setTimeout
      const id = setTimeout(() => setDeferredValue(value), delay);
      return () => clearTimeout(id);
    }
  }, [value, delay]);

  return deferredValue;
}

// ============================================================================
// Virtualization Helpers
// ============================================================================

/**
 * Calculate visible items for virtual list
 */
export interface VirtualListConfig {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualListResult {
  startIndex: number;
  endIndex: number;
  visibleCount: number;
  totalHeight: number;
  offsetY: number;
}

export function calculateVirtualList(
  scrollTop: number,
  config: VirtualListConfig,
): VirtualListResult {
  const { itemCount, itemHeight, containerHeight, overscan = 3 } = config;

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    startIndex + visibleCount + overscan * 2,
  );

  return {
    startIndex,
    endIndex,
    visibleCount,
    totalHeight: itemCount * itemHeight,
    offsetY: startIndex * itemHeight,
  };
}

/**
 * Hook for virtualized list
 */
export function useVirtualList(config: VirtualListConfig) {
  const [scrollTop, setScrollTop] = useState(0);

  const result = useMemo(
    () => calculateVirtualList(scrollTop, config),
    [scrollTop, config],
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    ...result,
    handleScroll,
    scrollTop,
  };
}

// ============================================================================
// Lazy Loading Utilities
// ============================================================================

/**
 * Intersection Observer hook for lazy loading
 */
export interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView({
  threshold = 0,
  rootMargin = "0px",
  triggerOnce = false,
}: UseInViewOptions = {}) {
  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce and already triggered, skip
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setInView(isIntersecting);

        if (isIntersecting && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, inView };
}

// ============================================================================
// Throttle & Debounce for Events
// ============================================================================

/**
 * Throttle callback for scroll/resize events
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number,
): T {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    ((...args) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRan.current;

      if (timeSinceLastRun >= limit) {
        callback(...args);
        lastRan.current = now;
      } else {
        // Schedule trailing call
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, limit - timeSinceLastRun);
      }
    }) as T,
    [callback, limit],
  );
}

/**
 * RAF-based throttle for smooth animations
 */
export function useRAFThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
): T {
  const frameRef = useRef<number>();
  const argsRef = useRef<unknown[]>();

  return useCallback(
    ((...args) => {
      argsRef.current = args;

      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(() => {
          callback(...(argsRef.current as Parameters<T>));
          frameRef.current = undefined;
        });
      }
    }) as T,
    [callback],
  );
}

// ============================================================================
// Memory Management
// ============================================================================

/**
 * Clean up subscriptions/listeners on unmount
 */
export function useCleanup(cleanup: () => void) {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  useEffect(() => {
    return () => cleanupRef.current();
  }, []);
}

/**
 * Stable callback reference (prevents unnecessary re-renders)
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

// ============================================================================
// Image Loading Optimization
// ============================================================================

/**
 * Preload image before rendering
 */
export function useImagePreload(src: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => setLoaded(true);
    img.onerror = () => setError(new Error(`Failed to load image: ${src}`));

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loaded, error };
}

/**
 * Preload multiple images
 */
export function useImagePreloadMultiple(srcs: string[]) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error>>({});

  useEffect(() => {
    const images: HTMLImageElement[] = [];

    srcs.forEach((src) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        setLoaded((prev) => ({ ...prev, [src]: true }));
      };

      img.onerror = () => {
        setErrors((prev) => ({
          ...prev,
          [src]: new Error(`Failed to load: ${src}`),
        }));
      };

      images.push(img);
    });

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [JSON.stringify(srcs)]); // eslint-disable-line react-hooks/exhaustive-deps

  const allLoaded = srcs.every((src) => loaded[src]);
  const hasErrors = Object.keys(errors).length > 0;

  return { loaded, errors, allLoaded, hasErrors };
}

// ============================================================================
// Bundle Size Helpers
// ============================================================================

/**
 * Lazy import component with loading state
 */
export function createLazyComponent<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  _displayName?: string,
) {
  const LazyComponent = React.lazy(importFn);
  return LazyComponent;
}

// Type declarations for requestIdleCallback
declare global {
  interface Window {
    requestIdleCallback(
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ): number;
    cancelIdleCallback(handle: number): void;
  }
}
