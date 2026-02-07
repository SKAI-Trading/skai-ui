import type { Meta, StoryObj } from "@storybook/react";
import { TradePageTemplate } from "./trade-page";

const meta: Meta<typeof TradePageTemplate> = {
  title: "Templates/Trade",
  component: TradePageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof TradePageTemplate>;

export const Default: Story = {
  args: {
    selectedSymbol: "ETH-USD",
    tradeSide: "long",
    orderType: "market",
    connectionStatus: "connected",
    maxLeverage: 500,
    oneClickEnabled: false,
    marketInfo: {
      symbol: "ETH-USD",
      price: 3456.78,
      change24h: 2.34,
      high24h: 3520.0,
      low24h: 3380.0,
      volume24h: 1200000000,
      fundingRate: 0.0012,
    },
    shortcuts: [
      { keys: "Ctrl+Enter", description: "Place order", category: "Trading" },
      { keys: "Ctrl+L", description: "Toggle long/short", category: "Trading" },
      { keys: "Escape", description: "Close modal", category: "General" },
    ],
    riskDisclaimer:
      "Trading perpetuals involves significant risk. You may lose more than your initial investment.",
    compactDisclaimer: true,
  },
};
