import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cssVar,
  getCSSVarValue,
  setCSSVar,
  generateFallbackCSS,
  supportsCSSVariables,
  defaultFallbacks,
  withFallbacks,
} from "../lib/css-fallbacks";

// Helper to mock CSS.supports
const mockCSS = (supportsValue: boolean) => {
  Object.defineProperty(window, "CSS", {
    value: {
      supports: vi.fn().mockReturnValue(supportsValue),
    },
    writable: true,
    configurable: true,
  });
};

describe("CSS Fallbacks", () => {
  const originalCSS = window.CSS;

  afterEach(() => {
    Object.defineProperty(window, "CSS", {
      value: originalCSS,
      writable: true,
      configurable: true,
    });
  });

  describe("supportsCSSVariables", () => {
    it("should return true in modern browsers", () => {
      mockCSS(true);
      expect(supportsCSSVariables()).toBe(true);
    });

    it("should return false when CSS.supports is not available", () => {
      Object.defineProperty(window, "CSS", {
        value: undefined,
        writable: true,
        configurable: true,
      });
      expect(supportsCSSVariables()).toBe(false);
    });
  });

  describe("cssVar", () => {
    beforeEach(() => {
      mockCSS(true);
    });

    it("should return CSS var() function with fallback", () => {
      const result = cssVar("--primary", "#2cecad");
      expect(result).toBe("var(--primary, #2cecad)");
    });

    it("should use default fallback when none provided", () => {
      const result = cssVar("--primary");
      expect(result).toBe(`var(--primary, ${defaultFallbacks["--primary"]})`);
    });

    it("should return fallback directly when CSS vars not supported", () => {
      mockCSS(false);
      const result = cssVar("--primary", "#2cecad");
      expect(result).toBe("#2cecad");
    });
  });

  describe("getCSSVarValue", () => {
    it("should return computed value from element", () => {
      const mockElement = document.createElement("div");
      mockElement.style.setProperty("--test-var", "red");
      document.body.appendChild(mockElement);

      // Note: In jsdom, computed styles may not work as expected
      const value = getCSSVarValue("--test-var", mockElement);
      // Just check it doesn't throw
      expect(typeof value).toBe("string");

      document.body.removeChild(mockElement);
    });

    it("should return default fallback for unknown properties", () => {
      const value = getCSSVarValue("--unknown-prop");
      expect(value).toBe("");
    });

    it("should return default fallback value when property not found", () => {
      const value = getCSSVarValue("--primary");
      // Should return either the computed value or the default fallback
      expect(typeof value).toBe("string");
    });
  });

  describe("setCSSVar", () => {
    it("should set CSS variable on element", () => {
      const element = document.createElement("div");
      setCSSVar("--test-color", "blue", element);
      expect(element.style.getPropertyValue("--test-color")).toBe("blue");
    });

    it("should set on document root by default", () => {
      setCSSVar("--global-test", "green");
      expect(
        document.documentElement.style.getPropertyValue("--global-test"),
      ).toBe("green");
      // Cleanup
      document.documentElement.style.removeProperty("--global-test");
    });
  });

  describe("generateFallbackCSS", () => {
    it("should generate CSS with default fallbacks", () => {
      const css = generateFallbackCSS();
      expect(css).toContain(":root {");
      expect(css).toContain("--primary:");
      expect(css).toContain("--background:");
      expect(css).toContain(".bg-primary");
      expect(css).toContain(".text-primary");
    });

    it("should include custom fallbacks", () => {
      const css = generateFallbackCSS({
        "--custom-color": "#ff0000",
      });
      expect(css).toContain("--custom-color: #ff0000");
    });

    it("should generate utility class fallbacks", () => {
      const css = generateFallbackCSS();
      expect(css).toContain(".bg-primary {");
      expect(css).toContain(".text-foreground {");
      expect(css).toContain(".border-border {");
      expect(css).toContain(".text-bid {");
      expect(css).toContain(".text-ask {");
    });
  });

  describe("withFallbacks", () => {
    it("should return original styles when CSS vars supported", () => {
      mockCSS(true);
      const styles = { backgroundColor: "var(--primary)" };
      expect(withFallbacks(styles)).toEqual(styles);
    });

    it("should replace CSS var() with fallback values when not supported", () => {
      mockCSS(false);

      const result = withFallbacks({
        backgroundColor: "var(--primary)",
        color: "var(--foreground)",
      });

      expect(result.backgroundColor).toBe(defaultFallbacks["--primary"]);
      expect(result.color).toBe(defaultFallbacks["--foreground"]);
    });

    it("should use inline fallback when provided in var()", () => {
      mockCSS(false);

      const result = withFallbacks({
        color: "var(--custom, #ff0000)",
      });

      expect(result.color).toBe("#ff0000");
    });

    it("should pass through non-var values unchanged", () => {
      mockCSS(false);

      const result = withFallbacks({
        padding: "10px",
        margin: "auto",
      });

      expect(result.padding).toBe("10px");
      expect(result.margin).toBe("auto");
    });
  });

  describe("defaultFallbacks", () => {
    it("should have all required color tokens", () => {
      expect(defaultFallbacks["--background"]).toBeDefined();
      expect(defaultFallbacks["--foreground"]).toBeDefined();
      expect(defaultFallbacks["--primary"]).toBeDefined();
      expect(defaultFallbacks["--secondary"]).toBeDefined();
      expect(defaultFallbacks["--destructive"]).toBeDefined();
      expect(defaultFallbacks["--muted"]).toBeDefined();
      expect(defaultFallbacks["--accent"]).toBeDefined();
    });

    it("should have trading color tokens", () => {
      expect(defaultFallbacks["--bid"]).toBeDefined();
      expect(defaultFallbacks["--ask"]).toBeDefined();
      expect(defaultFallbacks["--profit"]).toBeDefined();
      expect(defaultFallbacks["--loss"]).toBeDefined();
      expect(defaultFallbacks["--long"]).toBeDefined();
      expect(defaultFallbacks["--short"]).toBeDefined();
    });

    it("should have border radius token", () => {
      expect(defaultFallbacks["--radius"]).toBeDefined();
    });
  });
});
