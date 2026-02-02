import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import * as React from "react";
import {
  generateId,
  createAriaDescribedBy,
  createAriaLabelledBy,
  Keys,
  useRovingFocus,
  useFocusTrap,
  useLiveRegion,
  VisuallyHidden,
  useFocusReturn,
  useAutoFocus,
  getExpandedProps,
  getSelectedProps,
  getDisabledProps,
  getLoadingProps,
  getRequiredProps,
  getInvalidProps,
} from "../lib/accessibility";

describe("Accessibility Utilities", () => {
  describe("generateId", () => {
    it("generates unique IDs with default prefix", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toMatch(/^skai-\d+$/);
      expect(id2).toMatch(/^skai-\d+$/);
      expect(id1).not.toBe(id2);
    });

    it("uses custom prefix", () => {
      const id = generateId("custom");
      expect(id).toMatch(/^custom-\d+$/);
    });
  });

  describe("createAriaDescribedBy", () => {
    it("creates proper ARIA describedby props", () => {
      const result = createAriaDescribedBy("field1");

      expect(result.id).toBe("field1");
      expect(result.describedById).toBe("field1-description");
    });
  });

  describe("createAriaLabelledBy", () => {
    it("creates proper ARIA labelledby props", () => {
      const result = createAriaLabelledBy("input1");

      expect(result.id).toBe("input1");
      expect(result.labelledById).toBe("input1-label");
    });
  });

  describe("Keys", () => {
    it("has all common navigation keys", () => {
      expect(Keys.Enter).toBe("Enter");
      expect(Keys.Space).toBe(" ");
      expect(Keys.Escape).toBe("Escape");
      expect(Keys.Tab).toBe("Tab");
      expect(Keys.ArrowUp).toBe("ArrowUp");
      expect(Keys.ArrowDown).toBe("ArrowDown");
      expect(Keys.ArrowLeft).toBe("ArrowLeft");
      expect(Keys.ArrowRight).toBe("ArrowRight");
      expect(Keys.Home).toBe("Home");
      expect(Keys.End).toBe("End");
    });
  });

  describe("useRovingFocus", () => {
    it("initializes with activeIndex 0", () => {
      const { result } = renderHook(() => useRovingFocus({ itemCount: 5 }));

      expect(result.current.activeIndex).toBe(0);
    });

    it("provides setActiveIndex function", () => {
      const { result } = renderHook(() => useRovingFocus({ itemCount: 5 }));

      act(() => {
        result.current.setActiveIndex(3);
      });

      expect(result.current.activeIndex).toBe(3);
    });

    it("handles ArrowDown navigation", () => {
      const { result } = renderHook(() =>
        useRovingFocus({ itemCount: 5, orientation: "vertical" }),
      );

      act(() => {
        result.current.handleKeyDown({
          key: "ArrowDown",
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent);
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it("handles ArrowUp navigation", () => {
      const { result } = renderHook(() =>
        useRovingFocus({ itemCount: 5, orientation: "vertical" }),
      );

      // Start at index 2
      act(() => {
        result.current.setActiveIndex(2);
      });

      act(() => {
        result.current.handleKeyDown({
          key: "ArrowUp",
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent);
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it("loops when reaching bounds with loop=true", () => {
      const { result } = renderHook(() =>
        useRovingFocus({ itemCount: 3, loop: true }),
      );

      // Start at last item
      act(() => {
        result.current.setActiveIndex(2);
      });

      act(() => {
        result.current.handleKeyDown({
          key: "ArrowDown",
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent);
      });

      expect(result.current.activeIndex).toBe(0);
    });

    it("handles Home key", () => {
      const { result } = renderHook(() => useRovingFocus({ itemCount: 5 }));

      act(() => {
        result.current.setActiveIndex(3);
      });

      act(() => {
        result.current.handleKeyDown({
          key: "Home",
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent);
      });

      expect(result.current.activeIndex).toBe(0);
    });

    it("handles End key", () => {
      const { result } = renderHook(() => useRovingFocus({ itemCount: 5 }));

      act(() => {
        result.current.handleKeyDown({
          key: "End",
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent);
      });

      expect(result.current.activeIndex).toBe(4);
    });

    it("calls onSelect when Enter is pressed", () => {
      const onSelect = vi.fn();
      const { result } = renderHook(() =>
        useRovingFocus({ itemCount: 5, onSelect }),
      );

      act(() => {
        result.current.setActiveIndex(2);
      });

      act(() => {
        result.current.handleKeyDown({
          key: "Enter",
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent);
      });

      expect(onSelect).toHaveBeenCalledWith(2);
    });
  });

  describe("useFocusTrap", () => {
    it("returns containerRef and handleKeyDown", () => {
      const { result } = renderHook(() => useFocusTrap(true));
      expect(result.current.containerRef).toBeDefined();
      expect(typeof result.current.handleKeyDown).toBe("function");
    });

    it("containerRef starts with null", () => {
      const { result } = renderHook(() => useFocusTrap(true));
      expect(result.current.containerRef.current).toBeNull();
    });
  });

  describe("useLiveRegion", () => {
    it("returns announce function", () => {
      const { result } = renderHook(() => useLiveRegion({}));
      expect(typeof result.current.announce).toBe("function");
    });

    it("returns liveRegionProps", () => {
      const { result } = renderHook(() => useLiveRegion({}));
      expect(result.current.liveRegionProps).toBeDefined();
      expect(result.current.liveRegionProps.role).toBe("status");
    });
  });

  describe("VisuallyHidden", () => {
    it("renders children with visually hidden styles", () => {
      render(<VisuallyHidden>Hidden text</VisuallyHidden>);

      const element = screen.getByText("Hidden text");
      expect(element).toBeInTheDocument();

      // Check inline styles are applied
      const styles = element.style;
      expect(styles.position).toBe("absolute");
      expect(styles.width).toBe("1px");
      expect(styles.height).toBe("1px");
      expect(styles.overflow).toBe("hidden");
    });
  });

  describe("useFocusReturn", () => {
    it("captures current focused element", () => {
      const button = document.createElement("button");
      document.body.appendChild(button);
      button.focus();

      renderHook(() => useFocusReturn());

      // Should have captured the button as previously focused
      expect(document.activeElement).toBe(button);

      button.remove();
    });
  });

  describe("useAutoFocus", () => {
    it("returns a callback function", () => {
      const { result } = renderHook(() => useAutoFocus(true));
      expect(typeof result.current).toBe("function");
    });
  });

  describe("ARIA Helper Functions", () => {
    describe("getExpandedProps", () => {
      it("returns expanded true", () => {
        const props = getExpandedProps(true, "panel1");
        expect(props["aria-expanded"]).toBe(true);
        expect(props["aria-controls"]).toBe("panel1");
      });

      it("returns expanded false", () => {
        const props = getExpandedProps(false, "panel1");
        expect(props["aria-expanded"]).toBe(false);
      });
    });

    describe("getSelectedProps", () => {
      it("returns selected true", () => {
        const props = getSelectedProps(true);
        expect(props["aria-selected"]).toBe(true);
      });

      it("returns selected false", () => {
        const props = getSelectedProps(false);
        expect(props["aria-selected"]).toBe(false);
      });
    });

    describe("getDisabledProps", () => {
      it("returns disabled props", () => {
        const props = getDisabledProps(true);
        expect(props["aria-disabled"]).toBe(true);
        expect(props.tabIndex).toBe(-1);
      });

      it("returns enabled props", () => {
        const props = getDisabledProps(false);
        expect(props["aria-disabled"]).toBe(false);
        expect(props.tabIndex).toBe(0);
      });
    });

    describe("getLoadingProps", () => {
      it("returns loading props", () => {
        const props = getLoadingProps(true, "Loading data...");
        expect(props["aria-busy"]).toBe(true);
        expect(props["aria-label"]).toBe("Loading data...");
      });

      it("returns non-loading props", () => {
        const props = getLoadingProps(false);
        expect(props["aria-busy"]).toBe(false);
        expect(props["aria-label"]).toBeUndefined();
      });
    });

    describe("getRequiredProps", () => {
      it("returns required props", () => {
        const props = getRequiredProps(true);
        expect(props["aria-required"]).toBe(true);
        expect(props.required).toBe(true);
      });

      it("returns optional props", () => {
        const props = getRequiredProps(false);
        expect(props["aria-required"]).toBe(false);
        expect(props.required).toBe(false);
      });
    });

    describe("getInvalidProps", () => {
      it("returns invalid props with message", () => {
        const props = getInvalidProps(true, "Invalid input", "error1");
        expect(props["aria-invalid"]).toBe(true);
        expect(props["aria-errormessage"]).toBe("Invalid input");
        expect(props["aria-describedby"]).toBe("error1");
      });

      it("returns valid props", () => {
        const props = getInvalidProps(false);
        expect(props["aria-invalid"]).toBe(false);
        expect(props["aria-errormessage"]).toBeUndefined();
        expect(props["aria-describedby"]).toBeUndefined();
      });
    });
  });
});
