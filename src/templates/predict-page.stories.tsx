import type { Meta, StoryObj } from "@storybook/react";
import { PredictPageTemplate } from "./predict-page";

const meta: Meta<typeof PredictPageTemplate> = {
  title: "Templates/Predict",
  component: PredictPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof PredictPageTemplate>;

export const Default: Story = {
  args: {
    activeTab: "browse",
    categoryFilter: "all",
    sortBy: "volume",
    searchQuery: "",
    isConnected: true,
    isLoading: false,
    userStats: {
      totalValue: 2500,
      totalPnl: 350,
      winRate: 65,
      totalBets: 23,
      activePositions: 4,
    },
    featuredMarkets: [
      {
        id: "1",
        question: "Will ETH reach $5,000 by March 2026?",
        description: "Ethereum price prediction market",
        category: "crypto",
        status: "active",
        outcomes: [
          { id: "yes", label: "Yes", probability: 0.62, volume: 150000 },
          { id: "no", label: "No", probability: 0.38, volume: 92000 },
        ],
        totalVolume: 242000,
        resolutionDate: new Date("2026-03-31T23:59:59Z"),
        createdAt: new Date("2026-01-15T00:00:00Z"),
        participants: 1250,
        creator: "0x1234...5678",
        isFeatured: true,
      },
    ],
    markets: [
      {
        id: "2",
        question: "Will Bitcoin halving happen in April 2028?",
        description: "Bitcoin halving date prediction",
        category: "crypto",
        status: "active",
        outcomes: [
          { id: "yes", label: "Yes", probability: 0.85, volume: 500000 },
          { id: "no", label: "No", probability: 0.15, volume: 88000 },
        ],
        totalVolume: 588000,
        resolutionDate: new Date("2028-05-01T00:00:00Z"),
        createdAt: new Date("2026-01-01T00:00:00Z"),
        participants: 3400,
        creator: "0x2345...6789",
      },
      {
        id: "3",
        question: "SOL above $300 by end of Q1?",
        description: "Solana price prediction",
        category: "crypto",
        status: "active",
        outcomes: [
          { id: "yes", label: "Yes", probability: 0.45, volume: 75000 },
          { id: "no", label: "No", probability: 0.55, volume: 92000 },
        ],
        totalVolume: 167000,
        resolutionDate: new Date("2026-03-31T23:59:59Z"),
        createdAt: new Date("2026-02-01T00:00:00Z"),
        participants: 890,
        creator: "0x3456...7890",
      },
    ],
    positions: [],
  },
};
