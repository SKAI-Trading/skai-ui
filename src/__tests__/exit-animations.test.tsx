import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  FadeOut,
  SlideIn,
  SlideOut,
  AnimatedList,
  Collapse,
} from "../lib/animations";

// Mock matchMedia for useReducedMotion
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe("Exit Animations", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("FadeOut", () => {
    it("should render children", () => {
      render(<FadeOut>Content</FadeOut>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should call onAnimationEnd after animation completes", async () => {
      const onAnimationEnd = vi.fn();
      render(
        <FadeOut out duration={300} onAnimationEnd={onAnimationEnd}>
          Content
        </FadeOut>,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onAnimationEnd).toHaveBeenCalled();
    });

    it("should not animate when out is false", () => {
      render(<FadeOut out={false}>Content</FadeOut>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("SlideIn", () => {
    it("should render children", () => {
      render(<SlideIn>Content</SlideIn>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should support delay prop", () => {
      render(
        <SlideIn delay={100} animate>
          Content
        </SlideIn>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should render when animate is false", () => {
      render(<SlideIn animate={false}>Content</SlideIn>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("SlideOut", () => {
    it("should render children", () => {
      render(<SlideOut>Content</SlideOut>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should call onAnimationEnd after animation completes", async () => {
      const onAnimationEnd = vi.fn();
      render(
        <SlideOut out duration={300} onAnimationEnd={onAnimationEnd}>
          Content
        </SlideOut>,
      );

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onAnimationEnd).toHaveBeenCalled();
    });
  });

  describe("Reduced Motion", () => {
    beforeEach(() => {
      mockMatchMedia(true); // Enable reduced motion
    });

    it("should skip animation with FadeOut when reduced motion enabled", () => {
      const onAnimationEnd = vi.fn();
      render(
        <FadeOut out duration={300} onAnimationEnd={onAnimationEnd}>
          Content
        </FadeOut>,
      );
      // Should call immediately without waiting for timer
      expect(onAnimationEnd).toHaveBeenCalled();
    });

    it("should skip animation with SlideOut when reduced motion enabled", () => {
      const onAnimationEnd = vi.fn();
      render(
        <SlideOut out duration={300} onAnimationEnd={onAnimationEnd}>
          Content
        </SlideOut>,
      );
      expect(onAnimationEnd).toHaveBeenCalled();
    });
  });
});

describe("AnimatedList", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  const items = ["Item 1", "Item 2", "Item 3"];

  it("should render all items", () => {
    render(
      <AnimatedList
        items={items}
        keyExtractor={(item) => item}
        renderItem={(item) => <div>{item}</div>}
      />,
    );

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("should apply vertical direction by default", () => {
    render(
      <AnimatedList
        items={items}
        keyExtractor={(item) => item}
        renderItem={(item) => <div>{item}</div>}
      />,
    );

    const container = screen.getByText("Item 1").parentElement?.parentElement;
    expect(container).toHaveClass("flex-col");
  });

  it("should apply horizontal direction", () => {
    render(
      <AnimatedList
        items={items}
        keyExtractor={(item) => item}
        renderItem={(item) => <div>{item}</div>}
        direction="horizontal"
      />,
    );

    const container = screen.getByText("Item 1").parentElement?.parentElement;
    expect(container).toHaveClass("flex-row");
  });
});

describe("Collapse", () => {
  it("should render children", () => {
    render(<Collapse open>Content</Collapse>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render when closed", () => {
    render(<Collapse open={false}>Content</Collapse>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
