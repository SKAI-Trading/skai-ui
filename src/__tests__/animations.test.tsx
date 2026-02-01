import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useReducedMotion,
  durations,
  easings,
  animationClasses,
} from "../lib/animations";

describe("Animation System", () => {
  describe("durations", () => {
    it("exports expected duration values", () => {
      expect(durations.instant).toBe(0);
      expect(durations.fast).toBe(150);
      expect(durations.normal).toBe(300);
      expect(durations.slow).toBe(500);
      expect(durations.slower).toBe(700);
    });
  });

  describe("easings", () => {
    it("exports standard easing functions", () => {
      expect(easings.ease).toContain("cubic-bezier");
      expect(easings.easeIn).toContain("cubic-bezier");
      expect(easings.easeOut).toContain("cubic-bezier");
      expect(easings.easeInOut).toContain("cubic-bezier");
    });

    it("exports bouncy easing functions", () => {
      expect(easings.bounce).toContain("cubic-bezier");
      expect(easings.bounceIn).toContain("cubic-bezier");
      expect(easings.bounceOut).toContain("cubic-bezier");
    });

    it("exports spring easing", () => {
      expect(easings.spring).toContain("cubic-bezier");
    });
  });

  describe("animationClasses", () => {
    it("exports fade animation classes", () => {
      expect(animationClasses.fadeIn).toContain("animate-in");
      expect(animationClasses.fadeIn).toContain("fade-in");
      expect(animationClasses.fadeOut).toContain("animate-out");
    });

    it("exports slide animation classes", () => {
      expect(animationClasses.slideInTop).toContain("slide-in-from-top");
      expect(animationClasses.slideInBottom).toContain("slide-in-from-bottom");
      expect(animationClasses.slideInLeft).toContain("slide-in-from-left");
      expect(animationClasses.slideInRight).toContain("slide-in-from-right");
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
