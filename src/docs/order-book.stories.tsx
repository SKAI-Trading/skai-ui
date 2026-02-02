import type { Meta, StoryObj } from "@storybook/react";
import {
  OrderBook,
  OrderBookData,
  OrderBookLevel,
} from "../components/trading/order-book";
import { useState } from "react";

const meta: Meta<typeof OrderBook> = {
  title: "Trading/OrderBook",
  component: OrderBook,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The OrderBook component displays bid/ask levels with depth visualization.
It's commonly used in trading interfaces to show market depth.

## Features
- Live/paused toggle
- Click to select price
- Double-click for quick trade
- Depth bars showing cumulative volume
- Price change animations
- Customizable precision and levels
        `,
      },
    },
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj<typeof OrderBook>;

// Helper to create mock data
const createMockOrderBook = (): OrderBookData => {
  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];

  let bidTotal = 0;
  let askTotal = 0;

  for (let i = 0; i < 15; i++) {
    const bidSize = Math.random() * 2 + 0.5;
    bidTotal += bidSize;
    bids.push({
      id: `bid-${i}`,
      price: 50000 - i * 10 - Math.random() * 5,
      size: bidSize,
      total: bidTotal,
    });

    const askSize = Math.random() * 2 + 0.5;
    askTotal += askSize;
    asks.push({
      id: `ask-${i}`,
      price: 50010 + i * 10 + Math.random() * 5,
      size: askSize,
      total: askTotal,
    });
  }

  return {
    bids,
    asks,
    spread: asks[0].price - bids[0].price,
    spreadPercent: ((asks[0].price - bids[0].price) / bids[0].price) * 100,
    lastUpdate: Date.now(),
  };
};

export const Default: Story = {
  args: {
    data: createMockOrderBook(),
    levels: 12,
  },
};

export const Loading: Story = {
  args: {
    data: null,
    loading: true,
  },
};

export const CustomPrecision: Story = {
  args: {
    data: createMockOrderBook(),
    pricePrecision: 4,
    sizePrecision: 6,
    quoteCurrency: "BTC",
  },
};

export const WithoutDepthBars: Story = {
  args: {
    data: createMockOrderBook(),
    showDepthBars: false,
  },
};

export const FewLevels: Story = {
  args: {
    data: createMockOrderBook(),
    levels: 5,
  },
};

export const Interactive: Story = {
  render: () => {
    const [data, setData] = useState(createMockOrderBook());
    const [isLive, setIsLive] = useState(true);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Selected price:{" "}
          {selectedPrice ? `$${selectedPrice.toFixed(2)}` : "None"}
        </div>
        <div className="h-[500px]">
          <OrderBook
            data={data}
            isLive={isLive}
            onLiveToggle={() => setIsLive(!isLive)}
            onPriceClick={setSelectedPrice}
            onRowDoubleClick={(price, size, side) => {
              alert(
                `Double-clicked: ${side} ${size.toFixed(4)} @ $${price.toFixed(2)}`,
              );
            }}
          />
        </div>
        <button
          onClick={() => setData(createMockOrderBook())}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Refresh Data
        </button>
      </div>
    );
  },
};
