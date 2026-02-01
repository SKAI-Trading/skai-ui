import { useRef, useEffect } from "react";

/**
 * Get the previous value of a variable
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Check if value has changed
 */
export function useHasChanged<T>(value: T): boolean {
  const previous = usePrevious(value);
  return previous !== value;
}
