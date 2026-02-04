import type { Meta, StoryObj } from "@storybook/react";
import { TerminalChat, type TerminalLine } from "./terminal-chat";
import { useState } from "react";

const meta: Meta<typeof TerminalChat> = {
  title: "Utilities/TerminalChat",
  component: TerminalChat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A retro-style terminal interface for AI interactions and system displays.

Features:
- Authentic terminal styling with monospace font
- Typing animations for system messages
- Multiple message types (system, user, AI, error, success)
- Real-time processing indicators
- Customizable color schemes
- Auto-scrolling to latest messages
- Scan line effects for retro feel

Perfect for:
- AI chat interfaces
- System status displays
- Command-line style interactions
- Onboarding experiences
- Developer tools
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
      description: "Color scheme variant",
    },
    height: {
      control: "text",
      description: "Height of the terminal",
    },
    isProcessing: {
      control: "boolean",
      description: "Whether the terminal is currently processing",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input should be disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TerminalChat>;

// Demo terminal lines
const demoLines: TerminalLine[] = [
  {
    id: "1",
    text: "INITIALIZING SKAI_OS v2.5.0...",
    type: "system",
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: "2", 
    text: "CONNECTING TO DECENTRALIZED NETWORK...",
    type: "system",
    timestamp: new Date(Date.now() - 9000),
  },
  {
    id: "3",
    text: "ACCESS GRANTED.",
    type: "success",
    timestamp: new Date(Date.now() - 8000),
  },
  {
    id: "4",
    text: "help",
    type: "user",
    timestamp: new Date(Date.now() - 7000),
  },
  {
    id: "5",
    text: "Available commands: balance, trade, portfolio, market, help, exit",
    type: "ai",
    timestamp: new Date(Date.now() - 6000),
  },
  {
    id: "6",
    text: "balance",
    type: "user", 
    timestamp: new Date(Date.now() - 5000),
  },
  {
    id: "7",
    text: "Current balance: 1,250.75 SKAI",
    type: "ai",
    timestamp: new Date(Date.now() - 4000),
  },
];

export const Default: Story = {
  args: {
    lines: demoLines,
    isProcessing: false,
    placeholder: "Enter command...",
    title: "SKAI Terminal",
    variant: "default",
    height: "400px",
    onSubmit: async (input: string) => {
      console.log("Command submitted:", input);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Basic terminal chat with sample conversation history.",
      },
    },
  },
};

export const Processing: Story = {
  args: {
    lines: [
      ...demoLines,
      {
        id: "processing",
        text: "analyze market SKAI/USDC",
        type: "user",
        timestamp: new Date(),
      },
    ],
    isProcessing: true,
    placeholder: "Enter command...",
    title: "SKAI Terminal",
    variant: "default",
    height: "400px",
  },
  parameters: {
    docs: {
      description: {
        story: "Terminal in processing state with loading indicator.",
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    lines: [
      ...demoLines,
      {
        id: "error-cmd",
        text: "invalid_command",
        type: "user",
        timestamp: new Date(Date.now() - 1000),
      },
      {
        id: "error-response",
        text: "COMMAND NOT RECOGNIZED. Type 'help' for available commands.",
        type: "error",
        timestamp: new Date(),
      },
    ],
    variant: "error",
    title: "SKAI Terminal - Error",
    height: "400px",
  },
  parameters: {
    docs: {
      description: {
        story: "Terminal with error messages and error color scheme.",
      },
    },
  },
};

export const SuccessTheme: Story = {
  args: {
    lines: [
      {
        id: "success-1",
        text: "TRADE EXECUTED SUCCESSFULLY",
        type: "success",
        timestamp: new Date(Date.now() - 2000),
      },
      {
        id: "success-2",
        text: "Bought 100 SKAI at $2.45 per token",
        type: "ai",
        timestamp: new Date(Date.now() - 1000),
      },
      {
        id: "success-3",
        text: "Transaction hash: 0x1234...5678",
        type: "system",
        timestamp: new Date(),
      },
    ],
    variant: "success",
    title: "Trade Confirmation",
    height: "300px",
  },
  parameters: {
    docs: {
      description: {
        story: "Terminal with success theme showing completed trade.",
      },
    },
  },
};

export const WarningTheme: Story = {
  args: {
    lines: [
      {
        id: "warning-1",
        text: "WARNING: High volatility detected",
        type: "system",
        timestamp: new Date(Date.now() - 3000),
      },
      {
        id: "warning-2",
        text: "Current slippage: 5.2%",
        type: "ai",
        timestamp: new Date(Date.now() - 2000),
      },
      {
        id: "warning-3",
        text: "Recommend waiting for better market conditions",
        type: "ai",
        timestamp: new Date(),
      },
    ],
    variant: "warning",
    title: "Market Alert",
    height: "300px",
  },
  parameters: {
    docs: {
      description: {
        story: "Terminal with warning theme for market alerts.",
      },
    },
  },
};

export const TypingAnimation: Story = {
  args: {
    lines: [],
    isTyping: true,
    initialMessages: [
      "INITIALIZING SKAI_OS v2.5.0...",
      "CONNECTING TO DECENTRALIZED NETWORK...", 
      "ACCESS GRANTED.",
      "> AI AGENT ACTIVE.",
      "> MARKET ANALYSIS: VOLATILITY DETECTED.",
      "> RECOMMENDATION: CLAIM FAUCET TO BEGIN.",
    ],
    title: "System Startup",
    height: "400px",
  },
  parameters: {
    docs: {
      description: {
        story: "Terminal with typing animation for initial system messages.",
      },
    },
  },
};

export const Interactive: Story = {
  render: function InteractiveTerminal() {
    const [lines, setLines] = useState<TerminalLine[]>([
      {
        id: "welcome",
        text: "Welcome to SKAI Terminal! Type 'help' for commands.",
        type: "system",
        timestamp: new Date(),
      },
    ]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (input: string) => {
      // Add user message
      const userLine: TerminalLine = {
        id: `user-${Date.now()}`,
        text: input,
        type: "user",
        timestamp: new Date(),
      };
      setLines(prev => [...prev, userLine]);
      setIsProcessing(true);

      // Simulate AI response
      setTimeout(() => {
        let response: TerminalLine;
        
        switch (input.toLowerCase()) {
          case "help":
            response = {
              id: `ai-${Date.now()}`,
              text: "Available commands: balance, trade, portfolio, market, price [symbol], help, clear",
              type: "ai",
              timestamp: new Date(),
            };
            break;
          case "balance":
            response = {
              id: `ai-${Date.now()}`,
              text: "Current balance: 1,250.75 SKAI ($3,064.84 USD)",
              type: "ai", 
              timestamp: new Date(),
            };
            break;
          case "market":
            response = {
              id: `ai-${Date.now()}`,
              text: "📈 SKAI: $2.45 (+5.2%) | Volume: 2.1M | Market Cap: $125M",
              type: "ai",
              timestamp: new Date(),
            };
            break;
          case "clear":
            setLines([userLine]);
            setIsProcessing(false);
            return;
          default:
            if (input.toLowerCase().startsWith("price ")) {
              const symbol = input.slice(6).toUpperCase();
              response = {
                id: `ai-${Date.now()}`,
                text: `${symbol}: $${(Math.random() * 100).toFixed(2)} (${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 10).toFixed(1)}%)`,
                type: "ai",
                timestamp: new Date(),
              };
            } else {
              response = {
                id: `ai-${Date.now()}`,
                text: "Command not recognized. Type 'help' for available commands.",
                type: "error",
                timestamp: new Date(),
              };
            }
        }
        
        setLines(prev => [...prev, response]);
        setIsProcessing(false);
      }, 1000 + Math.random() * 1000);
    };

    return (
      <TerminalChat
        lines={lines}
        isProcessing={isProcessing}
        onSubmit={handleSubmit}
        placeholder="Enter command..."
        title="SKAI Interactive Terminal"
        height="500px"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Fully interactive terminal with command processing and realistic responses.",
      },
    },
  },
};

export const Compact: Story = {
  args: {
    lines: demoLines.slice(-3),
    title: "Mini Terminal",
    height: "200px",
    placeholder: "Quick command...",
  },
  parameters: {
    docs: {
      description: {
        story: "Compact terminal for embedded use cases.",
      },
    },
  },
};