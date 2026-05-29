import { useEffect, useRef, RefObject } from "react";

/**
 * Detect clicks outside of an element
 * @param handler - Callback when click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 * @returns Ref to attach to the target element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
): RefObject<T> {
  const ref = useRef<T>(null);
  // Inline-closure consumers (`useClickOutside(() => setOpen(false))`) used to
  // detach + re-attach the document-level mousedown/touchstart listeners on
  // every render because `handler` was in the deps array. Latest-callback ref
  // keeps the listener stable while still always calling the freshest closure
  // (W60-UI-01).
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handlerRef.current(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [enabled]);

  return ref;
}

/**
 * Detect clicks outside of multiple elements
 * @param refs - Array of refs to check
 * @param handler - Callback when click outside all refs is detected
 * @param enabled - Whether the hook is active
 */
export function useClickOutsideMultiple(
  refs: RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
): void {
  const handlerRef = useRef(handler);
  const refsRef = useRef(refs);
  useEffect(() => {
    handlerRef.current = handler;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const isInside = refsRef.current.some((ref) => {
        const el = ref.current;
        return el && el.contains(event.target as Node);
      });

      if (!isInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [enabled]);
}
