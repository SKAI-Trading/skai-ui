import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../layout/separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-md">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Portfolio Overview</h4>
        <p className="text-sm text-muted-foreground">
          Your current holdings and performance
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Total Value</div>
        <Separator orientation="vertical" />
        <div>$12,345.67</div>
        <Separator orientation="vertical" />
        <div className="text-green-500">+5.2%</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>ETH</div>
      <Separator orientation="vertical" />
      <div>$2,145.32</div>
      <Separator orientation="vertical" />
      <div className="text-green-500">+2.1%</div>
    </div>
  ),
};

// Trading-specific examples
export const SwapDetails: Story = {
  name: "Swap Details Separator",
  render: () => (
    <div className="p-4 border rounded-lg max-w-sm space-y-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Rate</span>
        <span>1 ETH = 2,145.32 USDC</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="text-muted-foreground">Price Impact</span>
        <span className="text-green-500">&lt;0.01%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Slippage</span>
        <span>0.5%</span>
      </div>
      <Separator />
      <div className="flex justify-between">
        <span className="text-muted-foreground">Network Fee</span>
        <span>~$0.50</span>
      </div>
      <div className="flex justify-between font-medium">
        <span>Minimum Received</span>
        <span>2,134.58 USDC</span>
      </div>
    </div>
  ),
};

export const TransactionSummary: Story = {
  name: "Transaction Summary",
  render: () => (
    <div className="p-4 border rounded-lg max-w-sm">
      <h3 className="font-semibold mb-4">Transaction Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">From</span>
          <div className="flex items-center gap-2">
            <span>1.5 ETH</span>
            <span className="text-xs text-muted-foreground">($3,217.98)</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">To</span>
          <div className="flex items-center gap-2">
            <span>3,200 USDC</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Exchange Rate</span>
          <span>1 ETH = 2,145.32 USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Route</span>
          <span>ETH → WETH → USDC</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gas Fee</span>
          <span>~$0.50</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Platform Fee</span>
          <span>$1.60 (0.05%)</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-semibold">
        <span>Total Cost</span>
        <span>$3,219.08</span>
      </div>
    </div>
  ),
};

export const NavigationSeparator: Story = {
  name: "Navigation Menu",
  render: () => (
    <div className="space-y-2 max-w-xs">
      <button className="w-full text-left px-3 py-2 rounded hover:bg-muted">
        Dashboard
      </button>
      <button className="w-full text-left px-3 py-2 rounded hover:bg-muted">
        Portfolio
      </button>
      <button className="w-full text-left px-3 py-2 rounded hover:bg-muted">
        Trade
      </button>
      <Separator />
      <button className="w-full text-left px-3 py-2 rounded hover:bg-muted">
        Settings
      </button>
      <button className="w-full text-left px-3 py-2 rounded hover:bg-muted">
        Help
      </button>
      <Separator />
      <button className="w-full text-left px-3 py-2 rounded hover:bg-muted text-destructive">
        Disconnect Wallet
      </button>
    </div>
  ),
};

export const StatsRow: Story = {
  name: "Stats with Separators",
  render: () => (
    <div className="flex items-center justify-center gap-0 p-4 border rounded-lg">
      <div className="px-6 text-center">
        <p className="text-2xl font-bold">$12.5M</p>
        <p className="text-xs text-muted-foreground">Total Volume</p>
      </div>
      <Separator orientation="vertical" className="h-12" />
      <div className="px-6 text-center">
        <p className="text-2xl font-bold">1,234</p>
        <p className="text-xs text-muted-foreground">Trades Today</p>
      </div>
      <Separator orientation="vertical" className="h-12" />
      <div className="px-6 text-center">
        <p className="text-2xl font-bold text-green-500">+8.2%</p>
        <p className="text-xs text-muted-foreground">24h Change</p>
      </div>
    </div>
  ),
};
