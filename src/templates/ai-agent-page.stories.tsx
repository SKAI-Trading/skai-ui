import type { Meta, StoryObj } from "@storybook/react";
import { AIAgentPageTemplate } from "./ai-agent-page";

const meta: Meta<typeof AIAgentPageTemplate> = {
  title: "Templates/AI Agent",
  component: AIAgentPageTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["stable"],
};

export default meta;
type Story = StoryObj<typeof AIAgentPageTemplate>;

export const Default: Story = {
  args: {
    isConnected: true,
    isLoading: false,
    activeTab: "chat",
    showSidebar: true,
    chatInput: "",
    isSending: false,
    isRecording: false,
    agent: {
      name: "SKAI Agent",
      description: "AI-powered trading assistant with real-time market analysis",
      status: "active",
      capabilities: [
        "Market Analysis",
        "Trade Execution",
        "Portfolio Optimization",
        "Risk Management",
      ],
      uptime: 99.7,
      totalTrades: 1247,
      winRate: 68.5,
      pnl: 15230.5,
    },
    messages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your SKAI trading agent. I can help you analyze markets, execute trades, and manage your portfolio. What would you like to do today?",
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "2",
        role: "user",
        content: "What's the current market sentiment for ETH?",
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        id: "3",
        role: "assistant",
        content:
          "ETH is showing bullish momentum with strong buying pressure. The RSI is at 62 (neutral-bullish), and the MACD just crossed above the signal line. Key levels to watch: Support at $3,400, Resistance at $3,600.",
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
    ],
    signals: [
      {
        id: "s1",
        type: "BUY",
        symbol: "ETH-USD",
        strength: "strong",
        price: 3456.78,
        timestamp: new Date().toISOString(),
        reason: "MACD crossover with strong volume confirmation",
      },
      {
        id: "s2",
        type: "SELL",
        symbol: "SOL-USD",
        strength: "moderate",
        price: 198.45,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        reason: "Overbought RSI with bearish divergence",
      },
    ],
    intelligence: [
      { label: "Market Mood", value: "Bullish", change: 5.2, icon: "📈" },
      { label: "Fear & Greed", value: 72, change: 8, icon: "🎯" },
      { label: "Active Signals", value: 12, icon: "📡" },
      { label: "Win Rate (7d)", value: "71%", change: 3.5, icon: "🏆" },
    ],
  },
};
