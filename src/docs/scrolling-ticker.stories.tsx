import type { Meta, StoryObj } from "@storybook/react";
import { ScrollingTicker, TickerItem } from "../components/scrolling-ticker";
import { TrendingUp, TrendingDown } from "lucide-react";

const meta: Meta<typeof ScrollingTicker> = {
  title: "Layout/ScrollingTicker",
  component: ScrollingTicker,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The ScrollingTicker component creates an infinite scrolling marquee effect.
Perfect for displaying live price feeds, news tickers, or promotional content.

## Features
- Infinite scroll animation
- Pause on hover
- Customizable speed
- Left or right direction
- Gap control
- Auto-duplicates items for seamless loop
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollingTicker>;

const cryptoPrices: TickerItem[] = [
  { id: "btc", content: "BTC $50,234.56", meta: { change: 2.5 } },
  { id: "eth", content: "ETH $3,456.78", meta: { change: -1.2 } },
  { id: "sol", content: "SOL $123.45", meta: { change: 5.8 } },
  { id: "avax", content: "AVAX $34.56", meta: { change: -0.5 } },
  { id: "matic", content: "MATIC $0.89", meta: { change: 3.2 } },
  { id: "arb", content: "ARB $1.23", meta: { change: 1.8 } },
];

export const Default: Story = {
  args: {
    items: cryptoPrices,
  },
};

export const SlowSpeed: Story = {
  args: {
    items: cryptoPrices,
    speed: 15,
  },
};

export const FastSpeed: Story = {
  args: {
    items: cryptoPrices,
    speed: 50,
  },
};

export const ReverseDirection: Story = {
  args: {
    items: cryptoPrices,
    direction: "right",
  },
};

export const NoPauseOnHover: Story = {
  args: {
    items: cryptoPrices,
    pauseOnHover: false,
  },
};

export const CustomGap: Story = {
  args: {
    items: cryptoPrices,
    gap: 64,
  },
};

export const CustomRendering: Story = {
  render: () => (
    <ScrollingTicker
      items={cryptoPrices}
      renderItem={(item) => {
        const change = item.meta?.change as number;
        const isPositive = change >= 0;
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-card/50 rounded-full">
            <span className="font-mono font-medium">{item.content}</span>
            <span
              className={`flex items-center text-xs ${isPositive ? "text-primary" : "text-destructive"}`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </div>
        );
      }}
    />
  ),
};

export const NewsHeadlines: Story = {
  render: () => {
    const news: TickerItem[] = [
      { id: "1", content: "🚀 Bitcoin breaks $50k resistance" },
      { id: "2", content: "📊 DeFi TVL reaches new ATH" },
      { id: "3", content: "🔥 Ethereum gas fees at monthly low" },
      { id: "4", content: "💰 Institutional adoption accelerates" },
      { id: "5", content: "🌐 New L2 launches with record TPS" },
    ];

    return (
      <div className="bg-card border-y border-border">
        <ScrollingTicker items={news} speed={25} gap={48} />
      </div>
    );
  },
};

export const PromotionalBanner: Story = {
  render: () => {
    const promos: TickerItem[] = [
      { id: "1", content: "🎁 50% OFF trading fees this week!" },
      { id: "2", content: "✨ New token listing: SKAI" },
      { id: "3", content: "🏆 Trading competition live now" },
    ];

    return (
      <div className="bg-primary text-primary-foreground">
        <ScrollingTicker
          items={promos}
          speed={20}
          className="py-2 font-semibold"
        />
      </div>
    );
  },
};

export const WithCustomClass: Story = {
  args: {
    items: cryptoPrices,
    className: "bg-gradient-to-r from-primary/10 to-secondary/10 py-3",
    itemClassName: "text-lg font-bold",
  },
};
