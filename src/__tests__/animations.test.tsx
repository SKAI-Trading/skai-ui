import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useReducedMotion,
  durations,
  easings,
  animationClasses,
} from "../lib/animations";
import { durations as canonicalDurations } from "../lib/motion-tokens";

/** Exact members of a class string. `toContain("fade-in")` on the raw string is
 *  satisfied by `fade-in-0`, and `toContain("slide-in-from-top")` by
 *  `slide-in-from-top-4` — a different distance from the one named. */
const tok = (classes: string) => classes.split(/\s+/).filter(Boolean);

/** A complete, well-formed cubic-bezier declaration — four numeric control
 *  points, nothing trailing. `toContain("cubic-bezier")` also passes on a
 *  truncated or empty-argument value. */
const CUBIC_BEZIER = /^cubic-bezier\((-?\d*\.?\d+, ){3}-?\d*\.?\d+\)$/;

describe("Animation System", () => {
  describe("durations", () => {
    it("maps the legacy names onto the canonical ladder", () => {
      // The legacy aliases are a value snap, not a rename: motion-tokens.ts is
      // the source of truth and these names resolve into it.
      expect(durations.instant).toBe(canonicalDurations.instant);
      expect(durations.fast).toBe(canonicalDurations.fast);
      expect(durations.normal).toBe(canonicalDurations.base);
      expect(durations.slow).toBe(canonicalDurations.slow);
      expect(durations.slower).toBe(canonicalDurations.slower);
    });

    it("exports the canonical ladder values", () => {
      expect(durations.instant).toBe(0);
      expect(durations.fast).toBe(100);
      expect(durations.normal).toBe(200);
      expect(durations.slow).toBe(300);
      expect(durations.slower).toBe(500);
    });
  });

  describe("easings", () => {
    it("exports standard easing functions", () => {
      expect(easings.ease).toMatch(CUBIC_BEZIER);
      expect(easings.easeIn).toMatch(CUBIC_BEZIER);
      expect(easings.easeOut).toMatch(CUBIC_BEZIER);
      expect(easings.easeInOut).toMatch(CUBIC_BEZIER);
    });

    it("exports bouncy easing functions", () => {
      expect(easings.bounce).toMatch(CUBIC_BEZIER);
      expect(easings.bounceIn).toMatch(CUBIC_BEZIER);
      expect(easings.bounceOut).toMatch(CUBIC_BEZIER);
    });

    it("exports spring easing", () => {
      expect(easings.spring).toMatch(CUBIC_BEZIER);
    });
  });

  describe("animationClasses", () => {
    it("exports fade animation classes", () => {
      expect(tok(animationClasses.fadeIn)).toContain("animate-in");
      expect(tok(animationClasses.fadeIn)).toContain("fade-in");
      expect(tok(animationClasses.fadeOut)).toContain("animate-out");
      expect(tok(animationClasses.fadeOut)).toContain("fade-out");
    });

    it("exports slide animation classes", () => {
      expect(tok(animationClasses.slideInTop)).toContain("slide-in-from-top");
      expect(tok(animationClasses.slideInBottom)).toContain(
        "slide-in-from-bottom",
      );
      expect(tok(animationClasses.slideInLeft)).toContain("slide-in-from-left");
      expect(tok(animationClasses.slideInRight)).toContain(
        "slide-in-from-right",
      );
    });

    it("exports duration modifier classes", () => {
      expect(animationClasses.durationFast).toBe("duration-150");
      expect(animationClasses.durationNormal).toBe("duration-300");
      expect(animationClasses.durationSlow).toBe("duration-500");
    });
  });

  describe("useReducedMotion", () => {
    it("returns false by default", () => {
      // Mock matchMedia
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      window.matchMedia = mockMatchMedia;

      const { result } = renderHook(() => useReducedMotion());
      expect(result.current).toBe(false);
    });

    it("returns true when user prefers reduced motion", () => {
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });
      window.matchMedia = mockMatchMedia;

      const { result } = renderHook(() => useReducedMotion());
      expect(result.current).toBe(true);
    });

    it("updates when preference changes", () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;

      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: (
          event: string,
          handler: (e: MediaQueryListEvent) => void,
        ) => {
          if (event === "change") {
            changeHandler = handler;
          }
        },
        removeEventListener: vi.fn(),
      });
      window.matchMedia = mockMatchMedia;

      const { result } = renderHook(() => useReducedMotion());
      expect(result.current).toBe(false);

      // Simulate preference change
      act(() => {
        if (changeHandler) {
          changeHandler({ matches: true } as MediaQueryListEvent);
        }
      });

      expect(result.current).toBe(true);
    });
  });
});
