import type { Meta, StoryObj } from "@storybook/react";
import { LeaderboardPageTemplate } from "./leaderboard-page";

const meta: Meta<typeof LeaderboardPageTemplate> = {
  title: "Templates/Leaderboard",
  component: LeaderboardPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof LeaderboardPageTemplate>;

export const Default: Story = {
  args: {
    sortMetric: "market_cap",
    timeFrame: "24h",
    isLoading: false,
    showPodium: true,
    showTimeFrameSelector: true,
    stats: {
      totalMarketCap: 245000000,
      totalVolume: 18500000,
      totalHolders: 42000,
      tokenCount: 156,
    },
    tokens: [
      {
        id: "1",
        name: "Ethereum",
        symbol: "ETH",
        price: 3456.78,
        priceChange24h: 2.34,
        marketCap: 415000000000,
        totalVolume: 12500000000,
        holderCount: 1200000,
        verified: true,
      },
      {
        id: "2",
        name: "Solana",
        symbol: "SOL",
        price: 198.45,
        priceChange24h: 5.67,
        marketCap: 92000000000,
        totalVolume: 3200000000,
        holderCount: 450000,
        verified: true,
      },
      {
        id: "3",
        name: "Avalanche",
        symbol: "AVAX",
        price: 42.18,
        priceChange24h: -1.23,
        marketCap: 16500000000,
        totalVolume: 890000000,
        holderCount: 180000,
        verified: true,
      },
      {
        id: "4",
        name: "Polygon",
        symbol: "MATIC",
        price: 0.89,
        priceChange24h: 0.45,
        marketCap: 8900000000,
        totalVolume: 520000000,
        holderCount: 320000,
        verified: true,
      },
      {
        id: "5",
        name: "Chainlink",
        symbol: "LINK",
        price: 18.92,
        priceChange24h: -0.78,
        marketCap: 11200000000,
        totalVolume: 675000000,
        holderCount: 250000,
        verified: true,
      },
    ],
    onSortChange: () => {},
    onTokenClick: () => {},
    onDiscoverClick: () => {},
    onCreateTokenClick: () => {},
  },
};
