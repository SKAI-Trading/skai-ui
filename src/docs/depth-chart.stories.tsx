import type { Meta, StoryObj } from "@storybook/react";
import {
  DepthChart,
  DepthPoint,
  calculateDepthFromOrderBook,
} from "../components/trading/depth-chart";
import { useState, useEffect } from "react";

const meta: Meta<typeof DepthChart> = {
  title: "Trading/DepthChart",
  component: DepthChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The DepthChart component visualizes order book depth as an area chart.
Shows cumulative bid/ask volume at different price levels.

## Features
- SVG-based rendering (no heavy chart library required)
- Bid/Ask area visualization
- Mid price reference line
- Sentiment indicator
- Live/paused toggle
- Custom colors
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DepthChart>;

// Mock data generators
const createMockBids = (): DepthPoint[] => {
  const bids: DepthPoint[] = [];
  let cumulative = 0;
  for (let i = 0; i < 20; i++) {
    cumulative += Math.random() * 5 + 2;
    bids.push({
      price: 50000 - i * 50,
      cumulative,
      side: "bid",
    });
  }
  return bids;
};

const createMockAsks = (): DepthPoint[] => {
  const asks: DepthPoint[] = [];
  let cumulative = 0;
  for (let i = 19; i >= 0; i--) {
    cumulative += Math.random() * 5 + 2;
    asks.unshift({
      price: 50100 + i * 50,
      cumulative,
      side: "ask",
    });
  }
  return asks;
};

export const Default: Story = {
  args: {
    bids: createMockBids(),
    asks: createMockAsks(),
    midPrice: 50050,
    height: 300,
  },
};

export const Loading: Story = {
  args: {
    bids: [],
    asks: [],
    loading: true,
    height: 300,
  },
};

export const WithSentiment: Story = {
  args: {
    bids: createMockBids(),
    asks: createMockAsks(),
    midPrice: 50050,
    sentiment: {
      sentiment: "Bullish",
      buyPressure: 65,
      sellPressure: 35,
    },
    height: 300,
  },
};

export const BearishSentiment: Story = {
  args: {
    bids: createMockBids(),
    asks: createMockAsks(),
    midPrice: 50050,
    sentiment: {
      sentiment: "Bearish",
      buyPressure: 35,
      sellPressure: 65,
    },
    height: 300,
  },
};

export const CustomColors: Story = {
  args: {
    bids: createMockBids(),
    asks: createMockAsks(),
    midPrice: 50050,
    bidColor: "hsl(200, 95%, 55%)",
    askColor: "hsl(330, 90%, 55%)",
    height: 300,
  },
};

export const NoLegend: Story = {
  args: {
    bids: createMockBids(),
    asks: createMockAsks(),
    midPrice: 50050,
    showLegend: false,
    showSentiment: false,
    height: 250,
  },
};

export const LiveUpdates: Story = {
  render: () => {
    const [bids, setBids] = useState(createMockBids());
    const [asks, setAsks] = useState(createMockAsks());
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
      if (!isLive) return;
      const interval = setInterval(() => {
        setBids(createMockBids());
        setAsks(createMockAsks());
      }, 2000);
      return () => clearInterval(interval);
    }, [isLive]);

    return (
      <DepthChart
        bids={bids}
        asks={asks}
        midPrice={50050}
        isLive={isLive}
        onLiveToggle={() => setIsLive(!isLive)}
        sentiment={{
          sentiment: "Bullish",
          buyPressure: Math.random() * 30 + 50,
          sellPressure: Math.random() * 30 + 20,
        }}
        height={350}
      />
    );
  },
};

export const FromOrderBook: Story = {
  render: () => {
    const orderBook = {
      bids: Array.from({ length: 15 }, (_, i) => ({
        price: 50000 - i * 25,
        size: Math.random() * 3 + 1,
      })),
      asks: Array.from({ length: 15 }, (_, i) => ({
        price: 50050 + i * 25,
        size: Math.random() * 3 + 1,
      })),
    };

    const { bids, asks } = calculateDepthFromOrderBook(orderBook);
    const midPrice = (orderBook.bids[0].price + orderBook.asks[0].price) / 2;

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Using calculateDepthFromOrderBook utility to convert order book data
        </p>
        <DepthChart bids={bids} asks={asks} midPrice={midPrice} height={300} />
      </div>
    );
  },
};
