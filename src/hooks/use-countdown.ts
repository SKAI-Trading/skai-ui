import { useState, useEffect, useCallback, useRef } from "react";

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isComplete: boolean;
}

export interface UseCountdownOptions {
  /** Interval in ms (default: 1000) */
  interval?: number;
  /** Callback when countdown completes */
  onComplete?: () => void;
  /** Auto-start countdown (default: true) */
  autoStart?: boolean;
}

/**
 * Countdown timer hook
 * @param targetDate - Target date/time or seconds remaining
 * @param options - Configuration options
 * @returns Countdown state and controls
 */
export function useCountdown(
  targetDate: Date | number,
  options: UseCountdownOptions = {},
): CountdownTime & {
  start: () => void;
  pause: () => void;
  reset: () => void;
} {
  const { interval = 1000, onComplete, autoStart = true } = options;

  const calculateTimeLeft = useCallback((): number => {
    if (typeof targetDate === "number") {
      return targetDate;
    }
    const now = new Date().getTime();
    const target = targetDate.getTime();
    return Math.max(0, Math.floor((target - now) / 1000));
  }, [targetDate]);

  const [totalSeconds, setTotalSeconds] = useState(calculateTimeLeft);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialSecondsRef = useRef(calculateTimeLeft());

  // Latest onComplete in a ref — inline `onComplete={() => navigate('/done')}`
  // would otherwise tear down + recreate the interval every parent render,
  // dropping ticks and making the countdown visibly stutter (W60-UI-01).
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // If the consumer swaps `targetDate` (e.g. user picks a new deadline) the
  // hook used to keep counting from the OLD target's totalSeconds because the
  // initializer only ran at mount. Now we recalc whenever targetDate
  // identity changes, and the visible totalSeconds catches up in the same
  // render so the UI never shows stale data for a frame.
  useEffect(() => {
    const fresh = calculateTimeLeft();
    initialSecondsRef.current = fresh;
    setTotalSeconds(fresh);
  }, [calculateTimeLeft]);

  const isComplete = totalSeconds <= 0;

  // Parse seconds into time units
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Countdown logic
  useEffect(() => {
    if (!isRunning || isComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          onCompleteRef.current?.();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isComplete, interval]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTotalSeconds(initialSecondsRef.current);
    setIsRunning(autoStart);
  }, [autoStart]);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isComplete,
    start,
    pause,
    reset,
  };
}

/**
 * Format countdown time as string
 */
export function formatCountdown(
  time: CountdownTime,
  format: "full" | "short" | "minimal" = "short",
): string {
  const { days, hours, minutes, seconds } = time;

  if (format === "full") {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  if (format === "minimal") {
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  // Short format
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}
