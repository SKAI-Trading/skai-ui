import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";
import { Bold, Italic, Underline, Star, Bell, Eye } from "lucide-react";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs", "stable"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
    "aria-label": "Toggle bold",
  },
};

export const WithText: Story = {
  args: {
    children: "Toggle",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: <Italic className="h-4 w-4" />,
    "aria-label": "Toggle italic",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Small toggle">
        <Bold className="h-3 w-3" />
      </Toggle>
      <Toggle size="default" aria-label="Default toggle">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="lg" aria-label="Large toggle">
        <Bold className="h-5 w-5" />
      </Toggle>
    </div>
  ),
};

// Trading-specific examples
export const FavoriteToggle: Story = {
  name: "Favorite Token",
  render: () => (
    <div className="flex max-w-sm items-center gap-3 rounded-lg border p-4">
      <div className="flex-1">
        <p className="font-medium">Ethereum</p>
        <p className="text-sm text-muted-foreground">ETH</p>
      </div>
      <p className="font-mono">$2,145.32</p>
      <Toggle aria-label="Add to favorites" className="data-[state=on]:text-yellow-500">
        <Star className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};

export const WatchlistToggle: Story = {
  name: "Watchlist Tokens",
  render: () => (
    <div className="max-w-md space-y-2">
      {[
        { symbol: "ETH", name: "Ethereum", price: "$2,145.32", watched: true },
        { symbol: "BTC", name: "Bitcoin", price: "$43,567.89", watched: true },
        {
          symbol: "SKAI",
          name: "SKAI Token",
          price: "$0.0234",
          watched: false,
        },
        { symbol: "USDC", name: "USD Coin", price: "$1.00", watched: false },
      ].map((token) => (
        <div
          key={token.symbol}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
            {token.symbol.slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{token.name}</p>
            <p className="text-xs text-muted-foreground">{token.symbol}</p>
          </div>
          <p className="font-mono text-sm">{token.price}</p>
          <Toggle
            aria-label={`Watch ${token.symbol}`}
            defaultPressed={token.watched}
            className="data-[state=on]:text-yellow-500"
          >
            <Star className="h-4 w-4" />
          </Toggle>
        </div>
      ))}
    </div>
  ),
};

export const NotificationToggle: Story = {
  name: "Price Alert Toggle",
  render: () => (
    <div className="flex max-w-sm items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">Price Alerts</p>
          <p className="text-xs text-muted-foreground">
            Get notified when price changes
          </p>
        </div>
      </div>
      <Toggle aria-label="Toggle price alerts" defaultPressed>
        <Bell className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};

export const VisibilityToggle: Story = {
  name: "Balance Visibility",
  render: () => (
    <div className="max-w-sm rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Balance</span>
        <Toggle aria-label="Toggle balance visibility" variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Toggle>
      </div>
      <p className="text-3xl font-bold">$12,345.67</p>
      <p className="text-sm text-green-500">+$234.56 (1.94%)</p>
    </div>
  ),
};

export const TextFormattingToggles: Story = {
  name: "Text Formatting",
  render: () => (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Toggle aria-label="Toggle bold" size="sm">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic" size="sm">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline" size="sm">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};
