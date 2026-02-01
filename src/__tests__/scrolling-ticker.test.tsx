import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ScrollingTicker,
  TickerItem,
  type ScrollingTickerItem,
} from "../components/scrolling-ticker";

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const defaultItems: ScrollingTickerItem[] = [
  { id: "1", content: <span>Item 1</span> },
  { id: "2", content: <span>Item 2</span> },
  { id: "3", content: <span>Item 3</span> },
];

describe("ScrollingTicker", () => {
  describe("Rendering", () => {
    it("should render all items", () => {
      render(<ScrollingTicker items={defaultItems} />);

      // Items are duplicated for seamless loop, so we check for multiple
      expect(screen.getAllByText("Item 1").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Item 2").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Item 3").length).toBeGreaterThanOrEqual(1);
    });

    it("should render nothing when items array is empty", () => {
      const { container } = render(<ScrollingTicker items={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ScrollingTicker items={defaultItems} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("should apply custom itemClassName", () => {
      render(
        <ScrollingTicker items={defaultItems} itemClassName="custom-item" />,
      );

      const items = screen.getAllByText("Item 1");
      expect(items[0].parentElement).toHaveClass("custom-item");
    });

    it("should render separators between items", () => {
      render(
        <ScrollingTicker
          items={defaultItems}
          separator={<span data-testid="separator">|</span>}
        />,
      );

      expect(screen.getAllByTestId("separator").length).toBeGreaterThan(0);
    });
  });

  describe("Animation", () => {
    it("should have animation style applied", () => {
      const { container } = render(
        <ScrollingTicker items={defaultItems} speed={50} />,
      );

      const scrollingDiv = container.querySelector('[style*="animation"]');
      expect(scrollingDiv).toBeInTheDocument();
    });

    it("should animate left by default", () => {
      const { container } = render(<ScrollingTicker items={defaultItems} />);

      const scrollingDiv = container.querySelector('[style*="animation"]');
      expect(scrollingDiv).toHaveStyle({ animationDirection: "normal" });
    });

    it("should animate right when direction is right", () => {
      const { container } = render(
        <ScrollingTicker items={defaultItems} direction="right" />,
      );

      const scrollingDiv = container.querySelector('[style*="animation"]');
      expect(scrollingDiv).toHaveStyle({ animationDirection: "reverse" });
    });
  });

  describe("Pause on hover", () => {
    it("should pause animation on hover by default", () => {
      const { container } = render(<ScrollingTicker items={defaultItems} />);

      fireEvent.mouseEnter(container.firstChild as Element);

      const scrollingDiv = container.querySelector('[style*="animation"]');
      expect(scrollingDiv).toHaveStyle({ animationPlayState: "paused" });
    });

    it("should resume animation on mouse leave", () => {
      const { container } = render(<ScrollingTicker items={defaultItems} />);

      fireEvent.mouseEnter(container.firstChild as Element);
      fireEvent.mouseLeave(container.firstChild as Element);

      const scrollingDiv = container.querySelector('[style*="animation"]');
      expect(scrollingDiv).toHaveStyle({ animationPlayState: "running" });
    });

    it("should not pause when pauseOnHover is false", () => {
      const { container } = render(
        <ScrollingTicker items={defaultItems} pauseOnHover={false} />,
      );

      fireEvent.mouseEnter(container.firstChild as Element);

      const scrollingDiv = container.querySelector('[style*="animation"]');
      expect(scrollingDiv).toHaveStyle({ animationPlayState: "running" });
    });
  });

  describe("Fade gradients", () => {
    it("should show fade gradients by default", () => {
      const { container } = render(<ScrollingTicker items={defaultItems} />);

      const gradients = container.querySelectorAll('[class*="gradient"]');
      expect(gradients.length).toBe(2); // Left and right
    });

    it("should hide fade gradients when showFade is false", () => {
      const { container } = render(
        <ScrollingTicker items={defaultItems} showFade={false} />,
      );

      const gradients = container.querySelectorAll('[class*="gradient"]');
      expect(gradients.length).toBe(0);
    });

    it("should apply custom fadeWidth", () => {
      const { container } = render(
        <ScrollingTicker items={defaultItems} fadeWidth={80} />,
      );

      const gradient = container.querySelector('[class*="gradient"]');
      expect(gradient).toHaveStyle({ width: "80px" });
    });
  });

  describe("Accessibility", () => {
    it("should have marquee role", () => {
      render(<ScrollingTicker items={defaultItems} />);
      expect(screen.getByRole("marquee")).toBeInTheDocument();
    });

    it("should have aria-label", () => {
      render(<ScrollingTicker items={defaultItems} />);
      expect(screen.getByLabelText("Scrolling ticker")).toBeInTheDocument();
    });

    it("should have aria-live off to prevent screen reader spam", () => {
      const { container } = render(<ScrollingTicker items={defaultItems} />);
      expect(container.firstChild).toHaveAttribute("aria-live", "off");
    });
  });
});

describe("TickerItem", () => {
  it("should render value", () => {
    render(<TickerItem value="$45,000" />);
    expect(screen.getByText("$45,000")).toBeInTheDocument();
  });

  it("should render label", () => {
    render(<TickerItem label="BTC" value="$45,000" />);
    expect(screen.getByText("BTC")).toBeInTheDocument();
  });

  it("should render change indicator", () => {
    render(<TickerItem value="$45,000" change={<span>+2.5%</span>} />);
    expect(screen.getByText("+2.5%")).toBeInTheDocument();
  });

  it("should render icon", () => {
    render(
      <TickerItem value="$45,000" icon={<span data-testid="icon">₿</span>} />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <TickerItem value="$45,000" className="custom-item" />,
    );
    expect(container.firstChild).toHaveClass("custom-item");
  });

  it("should render all parts together", () => {
    render(
      <TickerItem
        label="BTC"
        value="$45,000"
        change={<span className="text-green-500">+2.5%</span>}
        icon={<span>₿</span>}
      />,
    );

    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("$45,000")).toBeInTheDocument();
    expect(screen.getByText("+2.5%")).toBeInTheDocument();
    expect(screen.getByText("₿")).toBeInTheDocument();
  });
});
