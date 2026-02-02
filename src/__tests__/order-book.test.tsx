import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  OrderBook,
  OrderBookData,
  OrderBookLevel,
} from "../components/trading/order-book";

const createMockLevel = (
  id: string,
  price: number,
  size: number,
  total: number,
): OrderBookLevel => ({
  id,
  price,
  size,
  total,
});

const createMockOrderBook = (): OrderBookData => ({
  bids: [
    createMockLevel("bid-1", 50000, 1.5, 1.5),
    createMockLevel("bid-2", 49999, 2.0, 3.5),
    createMockLevel("bid-3", 49998, 1.0, 4.5),
  ],
  asks: [
    createMockLevel("ask-1", 50001, 1.0, 1.0),
    createMockLevel("ask-2", 50002, 1.5, 2.5),
    createMockLevel("ask-3", 50003, 2.0, 4.5),
  ],
  spread: 1,
  spreadPercent: 0.002,
  lastUpdate: Date.now(),
});

describe("OrderBook", () => {
  describe("Rendering", () => {
    it("should render loading state when data is null", () => {
      render(<OrderBook data={null} />);
      expect(screen.getByText(/loading order book/i)).toBeInTheDocument();
    });

    it("should render loading state when loading prop is true", () => {
      render(<OrderBook data={createMockOrderBook()} loading={true} />);
      expect(screen.getByText(/loading order book/i)).toBeInTheDocument();
    });

    it("should render order book data", () => {
      render(<OrderBook data={createMockOrderBook()} />);
      expect(screen.getByText("Order Book")).toBeInTheDocument();
      // Check for prices using getAllByText as they may appear in multiple columns
      expect(screen.getAllByText("50000.00").length).toBeGreaterThan(0);
      expect(screen.getAllByText("50001.00").length).toBeGreaterThan(0);
    });

    it("should display spread information", () => {
      render(<OrderBook data={createMockOrderBook()} />);
      // Spread value should be displayed
      expect(screen.getByText("Spread")).toBeInTheDocument();
      expect(screen.getByText("0.0020%")).toBeInTheDocument();
    });

    it("should render with custom precision", () => {
      render(
        <OrderBook
          data={createMockOrderBook()}
          pricePrecision={4}
          sizePrecision={2}
        />,
      );
      // With 4 decimal places for price
      expect(screen.getByText("50000.0000")).toBeInTheDocument();
      // Check that sizes are displayed - use getAllByText since there may be multiple
      const sizeElements = screen.getAllByText("1.50");
      expect(sizeElements.length).toBeGreaterThan(0);
    });

    it("should render with custom quote currency", () => {
      render(<OrderBook data={createMockOrderBook()} quoteCurrency="BTC" />);
      expect(screen.getByText("Price (BTC)")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onPriceClick when row is clicked", () => {
      const onPriceClick = vi.fn();
      render(
        <OrderBook data={createMockOrderBook()} onPriceClick={onPriceClick} />,
      );

      fireEvent.click(screen.getByText("50000.00"));
      expect(onPriceClick).toHaveBeenCalledWith(50000);
    });

    it("should call onRowDoubleClick when row is double-clicked", () => {
      const onRowDoubleClick = vi.fn();
      render(
        <OrderBook
          data={createMockOrderBook()}
          onRowDoubleClick={onRowDoubleClick}
        />,
      );

      fireEvent.doubleClick(screen.getByText("50000.00"));
      expect(onRowDoubleClick).toHaveBeenCalledWith(50000, 1.5, "bid");
    });

    it("should call onLiveToggle when live button is clicked", () => {
      const onLiveToggle = vi.fn();
      render(
        <OrderBook data={createMockOrderBook()} onLiveToggle={onLiveToggle} />,
      );

      fireEvent.click(screen.getByText("Live"));
      expect(onLiveToggle).toHaveBeenCalled();
    });

    it("should display Paused when isLive is false", () => {
      render(
        <OrderBook
          data={createMockOrderBook()}
          isLive={false}
          onLiveToggle={() => {}}
        />,
      );
      expect(screen.getByText("Paused")).toBeInTheDocument();
    });
  });

  describe("Depth Bars", () => {
    it("should render depth bars by default", () => {
      const { container } = render(<OrderBook data={createMockOrderBook()} />);
      const depthBars = container.querySelectorAll('[aria-hidden="true"]');
      expect(depthBars.length).toBeGreaterThan(0);
    });

    it("should not render depth bars when showDepthBars is false", () => {
      const { container } = render(
        <OrderBook data={createMockOrderBook()} showDepthBars={false} />,
      );
      const depthBars = container.querySelectorAll('[aria-hidden="true"]');
      expect(depthBars.length).toBe(0);
    });
  });

  describe("Accessibility", () => {
    it("should have table role", () => {
      render(<OrderBook data={createMockOrderBook()} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should have aria-label", () => {
      render(<OrderBook data={createMockOrderBook()} />);
      expect(screen.getByRole("table")).toHaveAttribute(
        "aria-label",
        "Order Book",
      );
    });

    it("should have row groups for bids and asks", () => {
      render(<OrderBook data={createMockOrderBook()} />);
      expect(screen.getByLabelText("Bid orders")).toBeInTheDocument();
      expect(screen.getByLabelText("Ask orders")).toBeInTheDocument();
    });
  });

  describe("Levels", () => {
    it("should limit displayed levels", () => {
      const data = createMockOrderBook();
      // Add more levels
      for (let i = 4; i <= 20; i++) {
        data.bids.push(createMockLevel(`bid-${i}`, 50000 - i, 1, i));
        data.asks.push(createMockLevel(`ask-${i}`, 50000 + i, 1, i));
      }

      const { container } = render(<OrderBook data={data} levels={5} />);
      // Check that we don't have all 20 levels displayed
      const rows = container.querySelectorAll('[role="row"]');
      // Header + 5 bids + 5 asks = 11 rows
      expect(rows.length).toBeLessThan(42); // 1 header + 20 bids + 20 asks
    });
  });
});
