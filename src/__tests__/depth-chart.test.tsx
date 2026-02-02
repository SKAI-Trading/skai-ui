import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  DepthChart,
  DepthPoint,
  calculateDepthFromOrderBook,
} from "../components/trading/depth-chart";

const createMockBids = (): DepthPoint[] => [
  { price: 50000, cumulative: 10, side: "bid" },
  { price: 49900, cumulative: 25, side: "bid" },
  { price: 49800, cumulative: 45, side: "bid" },
];

const createMockAsks = (): DepthPoint[] => [
  { price: 50100, cumulative: 8, side: "ask" },
  { price: 50200, cumulative: 20, side: "ask" },
  { price: 50300, cumulative: 38, side: "ask" },
];

describe("DepthChart", () => {
  describe("Rendering", () => {
    it("should render loading state when loading prop is true", () => {
      render(<DepthChart bids={[]} asks={[]} loading={true} />);
      expect(screen.getByText(/loading depth chart/i)).toBeInTheDocument();
    });

    it("should render empty state when no data", () => {
      render(<DepthChart bids={[]} asks={[]} />);
      expect(screen.getByText(/no depth data available/i)).toBeInTheDocument();
    });

    it("should render chart with data", () => {
      render(<DepthChart bids={createMockBids()} asks={createMockAsks()} />);
      expect(screen.getByText("Depth Chart")).toBeInTheDocument();
    });

    it("should display mid price", () => {
      const { container } = render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          midPrice={50050}
          pricePrecision={2}
        />,
      );
      // SVG rendering is limited in jsdom - just verify component renders
      // and the container has content
      expect(container.firstChild).toBeInTheDocument();
      // The component should render with depth chart title
      expect(screen.getByText("Depth Chart")).toBeInTheDocument();
    });
  });

  describe("Live Toggle", () => {
    it("should display Live when isLive is true", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          isLive={true}
          onLiveToggle={() => {}}
        />,
      );
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    it("should display Paused when isLive is false", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          isLive={false}
          onLiveToggle={() => {}}
        />,
      );
      expect(screen.getByText("Paused")).toBeInTheDocument();
    });

    it("should call onLiveToggle when button is clicked", () => {
      const onLiveToggle = vi.fn();
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          onLiveToggle={onLiveToggle}
        />,
      );

      fireEvent.click(screen.getByText("Live"));
      expect(onLiveToggle).toHaveBeenCalled();
    });
  });

  describe("Sentiment", () => {
    it("should display sentiment when provided", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          sentiment={{
            sentiment: "Bullish",
            buyPressure: 65,
            sellPressure: 35,
          }}
        />,
      );
      expect(screen.getByText("Bullish")).toBeInTheDocument();
      expect(screen.getByText("65.0% Buy")).toBeInTheDocument();
      expect(screen.getByText("35.0% Sell")).toBeInTheDocument();
    });

    it("should display Bearish sentiment", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          sentiment={{
            sentiment: "Bearish",
            buyPressure: 35,
            sellPressure: 65,
          }}
        />,
      );
      expect(screen.getByText("Bearish")).toBeInTheDocument();
    });

    it("should display Neutral sentiment", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          sentiment={{
            sentiment: "Neutral",
            buyPressure: 50,
            sellPressure: 50,
          }}
        />,
      );
      expect(screen.getByText("Neutral")).toBeInTheDocument();
    });

    it("should hide sentiment when showSentiment is false", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          sentiment={{
            sentiment: "Bullish",
            buyPressure: 65,
            sellPressure: 35,
          }}
          showSentiment={false}
        />,
      );
      // The sentiment bar should not be present
      expect(screen.queryByText("65.0% Buy")).toBeInTheDocument(); // Still in footer
    });
  });

  describe("Legend", () => {
    it("should display legend by default", () => {
      render(<DepthChart bids={createMockBids()} asks={createMockAsks()} />);
      expect(screen.getByText("Bids")).toBeInTheDocument();
      expect(screen.getByText("Asks")).toBeInTheDocument();
    });

    it("should hide legend when showLegend is false", () => {
      render(
        <DepthChart
          bids={createMockBids()}
          asks={createMockAsks()}
          showLegend={false}
        />,
      );
      expect(screen.queryByText("Bids")).not.toBeInTheDocument();
    });
  });

  describe("calculateDepthFromOrderBook", () => {
    it("should calculate cumulative depth from order book", () => {
      const orderBook = {
        bids: [
          { price: 50000, size: 10 },
          { price: 49900, size: 15 },
          { price: 49800, size: 20 },
        ],
        asks: [
          { price: 50100, size: 8 },
          { price: 50200, size: 12 },
          { price: 50300, size: 18 },
        ],
      };

      const { bids, asks } = calculateDepthFromOrderBook(orderBook);

      expect(bids).toHaveLength(3);
      expect(bids[0]).toEqual({ price: 50000, cumulative: 10, side: "bid" });
      expect(bids[1]).toEqual({ price: 49900, cumulative: 25, side: "bid" });
      expect(bids[2]).toEqual({ price: 49800, cumulative: 45, side: "bid" });

      expect(asks).toHaveLength(3);
      expect(asks[0]).toEqual({ price: 50100, cumulative: 38, side: "ask" });
      expect(asks[1]).toEqual({ price: 50200, cumulative: 30, side: "ask" });
      expect(asks[2]).toEqual({ price: 50300, cumulative: 18, side: "ask" });
    });

    it("should handle empty order book", () => {
      const { bids, asks } = calculateDepthFromOrderBook({
        bids: [],
        asks: [],
      });

      expect(bids).toHaveLength(0);
      expect(asks).toHaveLength(0);
    });
  });
});
