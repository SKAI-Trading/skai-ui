import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../overlays/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../data-display/avatar";
import { Button } from "../core/button";

const meta: Meta<typeof HoverCard> = {
  title: "Components/HoverCard",
  component: HoverCard,
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// Trading-specific examples
export const TokenHoverCard: Story = {
  name: "Token Info Hover",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
            E
          </div>
          <span className="font-medium">ETH</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
              E
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Ethereum</h4>
              <p className="text-sm text-muted-foreground">ETH</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-semibold">$2,145.32</p>
              <p className="text-sm text-green-500">+2.34%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Market Cap</p>
              <p className="font-mono">$257.8B</p>
            </div>
            <div>
              <p className="text-muted-foreground">Volume (24h)</p>
              <p className="font-mono">$12.4B</p>
            </div>
            <div>
              <p className="text-muted-foreground">Circulating Supply</p>
              <p className="font-mono">120.2M ETH</p>
            </div>
            <div>
              <p className="text-muted-foreground">All Time High</p>
              <p className="font-mono">$4,891.70</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Trade
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Chart
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WalletHoverCard: Story = {
  name: "Wallet Address Hover",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="font-mono text-sm text-primary hover:underline">
          0x1234...5678
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            <div>
              <p className="font-medium">whale.eth</p>
              <p className="text-xs text-muted-foreground">Top Trader #12</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Volume</span>
              <span className="font-mono">$2.4M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trades</span>
              <span className="font-mono">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-mono text-green-500">67.8%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              📋 Copy
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              🔗 View
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const PoolHoverCard: Story = {
  name: "Liquidity Pool Info",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-2 font-medium hover:underline">
          <div className="flex -space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-blue-500 text-xs text-white">
              E
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-blue-600 text-xs text-white">
              U
            </div>
          </div>
          ETH/USDC
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-blue-500 text-sm font-bold text-white">
                  E
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-blue-600 text-sm font-bold text-white">
                  U
                </div>
              </div>
              <div>
                <p className="font-semibold">ETH/USDC</p>
                <p className="text-xs text-muted-foreground">0.3% fee tier</p>
              </div>
            </div>
            <span className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-500">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">TVL</p>
              <p className="font-mono font-semibold">$124.5M</p>
            </div>
            <div>
              <p className="text-muted-foreground">Volume (24h)</p>
              <p className="font-mono font-semibold">$45.2M</p>
            </div>
            <div>
              <p className="text-muted-foreground">APR</p>
              <p className="font-mono font-semibold text-green-500">12.4%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fees (24h)</p>
              <p className="font-mono font-semibold">$135.6K</p>
            </div>
          </div>
          <Button size="sm" className="w-full">
            Add Liquidity
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const TransactionHoverCard: Story = {
  name: "Transaction Details",
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="font-mono text-sm text-primary hover:underline">
          0xabcd...efgh
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Transaction</span>
            <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
              Success
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>Swap</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">From</span>
              <span className="font-mono">1.5 ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To</span>
              <span className="font-mono">3,217 USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas</span>
              <span className="font-mono">$0.42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span>2 min ago</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full">
            View on Explorer
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
