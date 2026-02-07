import type { Meta, StoryObj } from "@storybook/react";
import { HomePageTemplate } from "./home-page";

const meta: Meta<typeof HomePageTemplate> = {
  title: "Templates/Home",
  component: HomePageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof HomePageTemplate>;

export const Default: Story = {
  args: {
    userName: "Casey",
    isConnected: true,
    userStats: {
      portfolioValue: 12450.0,
      portfolioChange24h: 3.2,
      totalTrades: 47,
      totalGames: 12,
      skaiPoints: 2500,
      tier: "Gold",
      streakDays: 5,
    },
    quickActions: [
      {
        id: "swap",
        title: "Swap",
        description: "Swap tokens instantly",
        icon: null,
        route: "/swap",
      },
      {
        id: "trade",
        title: "Trade",
        description: "Trade perpetuals",
        icon: null,
        route: "/trade",
      },
      {
        id: "predict",
        title: "Predict",
        description: "Prediction markets",
        icon: null,
        route: "/predict",
        isNew: true,
      },
      {
        id: "earn",
        title: "Earn",
        description: "Daily faucet & lottery",
        icon: null,
        route: "/earn",
      },
    ],
    activityFeed: [
      {
        id: "1",
        type: "trade",
        title: "Swapped ETH for USDC",
        description: "0.5 ETH -> 1,750 USDC",
        timestamp: "2 min ago",
        amount: 1750,
        isPositive: true,
      },
      {
        id: "2",
        type: "reward",
        title: "Daily Faucet Claimed",
        description: "+100 SKAI Points",
        timestamp: "1 hour ago",
        amount: 100,
        isPositive: true,
      },
      {
        id: "3",
        type: "game",
        title: "Prediction Won",
        description: "ETH above $3,500 by Friday",
        timestamp: "3 hours ago",
        amount: 250,
        isPositive: true,
      },
    ],
    featureHighlights: [
      {
        id: "1",
        title: "AI Trading Agent",
        description:
          "Let our AI agent analyze markets and execute trades for you.",
        route: "/ai-agent",
        cta: "Try AI Agent",
      },
      {
        id: "2",
        title: "Governance",
        description:
          "Vote on proposals and shape the future of SKAI.",
        route: "/governance",
        cta: "View Proposals",
      },
    ],
  },
};
