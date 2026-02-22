import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  /** Animation duration in ms (default: 1000) */
  duration?: number;
  /** Decimal places (default: 0) */
  decimals?: number;
  /** Easing function (default: easeOutExpo) */
  easing?: (t: number) => number;
  /** Start counting when true (default: true) */
  enabled?: boolean;
}

/** Ease-out exponential — fast start, smooth deceleration */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * useCountUp — animated number counting hook (Figma: Number & value animations)
 *
 * Smoothly animates from 0 (or previous value) to the target number.
 *
 * @example
 * ```tsx
 * const count = useCountUp(12345.67, { decimals: 2, duration: 1500 });
 * return <span>${count}</span>;
 * ```
 */
export function useCountUp(
  target: number,
  options: UseCountUpOptions = {},
): string {
  const {
    duration = 1000,
    decimals = 0,
    easing = easeOutExpo,
    enabled = true,
  } = options;

  const [display, setDisplay] = useState(target.toFixed(decimals));
  const rafRef = useRef<number>();
  const fromRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setDisplay(target.toFixed(decimals));
      return;
    }

    const from = fromRef.current;
    const diff = target - from;

    if (diff === 0) {
      setDisplay(target.toFixed(decimals));
      return;
    }

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const current = from + diff * easedProgress;

      setDisplay(current.toFixed(decimals));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, easing, enabled]);

  return display;
}
