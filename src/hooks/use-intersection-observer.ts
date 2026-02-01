import { useState, useEffect, useRef, RefObject } from "react";

export interface UseIntersectionObserverOptions {
  /** Root element for intersection (default: viewport) */
  root?: Element | null;
  /** Margin around root */
  rootMargin?: string;
  /** Threshold(s) at which to trigger */
  threshold?: number | number[];
  /** Whether to observe (default: true) */
  enabled?: boolean;
  /** Only trigger once */
  triggerOnce?: boolean;
}

export interface UseIntersectionObserverReturn {
  /** Ref to attach to target element */
  ref: RefObject<HTMLElement>;
  /** Whether element is in view */
  isIntersecting: boolean;
  /** The IntersectionObserverEntry */
  entry: IntersectionObserverEntry | null;
}

/**
 * Observe element intersection with viewport or container
 * @param options - IntersectionObserver options
 * @returns Intersection state and ref
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    enabled = true,
    triggerOnce = false,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  const isIntersecting = entry?.isIntersecting ?? false;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || (triggerOnce && hasTriggered)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        if (triggerOnce && entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, enabled, triggerOnce, hasTriggered]);

  return { ref, isIntersecting, entry };
}

/**
 * Lazy load content when element enters viewport
 */
export function useLazyLoad(
  rootMargin: string = "100px",
): UseIntersectionObserverReturn {
  return useIntersectionObserver({
    rootMargin,
    triggerOnce: true,
  });
}

/**
 * Track scroll progress through an element
 */
export function useScrollProgress(): {
  ref: RefObject<HTMLElement>;
  progress: number;
} {
  const { ref, entry } = useIntersectionObserver({
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
  });

  const progress = entry?.intersectionRatio ?? 0;

  return { ref, progress };
}
