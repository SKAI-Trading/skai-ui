import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Separator } from "./separator";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i}>
            <div className="text-sm">Tag {i + 1}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-[150px] h-[100px] rounded-md border bg-muted flex items-center justify-center"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

// Trading-specific examples
export const TokenList: Story = {
  name: "Token List",
  render: () => (
    <ScrollArea className="h-[400px] w-[350px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 font-semibold">Select Token</h4>
        <div className="space-y-2">
          {[
            { symbol: "ETH", name: "Ethereum", balance: "2.5", value: "$5,363.30" },
            { symbol: "USDC", name: "USD Coin", balance: "1,500", value: "$1,500.00" },
            { symbol: "USDT", name: "Tether", balance: "750", value: "$750.00" },
            { symbol: "BTC", name: "Bitcoin", balance: "0.05", value: "$2,178.39" },
            { symbol: "SKAI", name: "SKAI Token", balance: "10,000", value: "$234.00" },
            { symbol: "LINK", name: "Chainlink", balance: "50", value: "$725.00" },
            { symbol: "UNI", name: "Uniswap", balance: "25", value: "$162.50" },
            { symbol: "AAVE", name: "Aave", balance: "5", value: "$465.00" },
            { symbol: "CRV", name: "Curve", balance: "200", value: "$116.00" },
            { symbol: "MKR", name: "Maker", balance: "0.5", value: "$687.50" },
            { symbol: "COMP", name: "Compound", balance: "10", value: "$524.00" },
            { symbol: "SNX", name: "Synthetix", balance: "100", value: "$256.00" },
            { symbol: "YFI", name: "Yearn Finance", balance: "0.01", value: "$89.50" },
            { symbol: "SUSHI", name: "SushiSwap", balance: "150", value: "$127.50" },
            { symbol: "1INCH", name: "1inch", balance: "300", value: "$123.00" },
          ].map((token) => (
            <div
              key={token.symbol}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                {token.symbol.slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{token.name}</p>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-mono">{token.balance}</p>
                <p className="text-sm text-muted-foreground">{token.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

export const TransactionHistory: Story = {
  name: "Transaction History",
  render: () => (
    <ScrollArea className="h-[350px] w-[400px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 font-semibold">Recent Transactions</h4>
        <div className="space-y-3">
          {[
            { type: "Swap", from: "1.5 ETH", to: "3,200 USDC", time: "2 min ago", status: "success" },
            { type: "Send", from: "500 USDC", to: "0x1234...5678", time: "15 min ago", status: "success" },
            { type: "Swap", from: "0.1 BTC", to: "4,350 USDC", time: "1 hour ago", status: "success" },
            { type: "Receive", from: "0xabcd...efgh", to: "1,000 SKAI", time: "2 hours ago", status: "success" },
            { type: "Swap", from: "2,000 USDC", to: "0.93 ETH", time: "3 hours ago", status: "success" },
            { type: "Swap", from: "500 USDC", to: "250 LINK", time: "5 hours ago", status: "failed" },
            { type: "Send", from: "100 USDC", to: "0x9876...5432", time: "6 hours ago", status: "success" },
            { type: "Swap", from: "1 ETH", to: "2,140 USDC", time: "1 day ago", status: "success" },
            { type: "Receive", from: "Coinbase", to: "0.5 ETH", time: "1 day ago", status: "success" },
            { type: "Swap", from: "5,000 SKAI", to: "117 USDC", time: "2 days ago", status: "success" },
          ].map((tx, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                  tx.status === "success"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {tx.type === "Swap" ? "↔" : tx.type === "Send" ? "↑" : "↓"}
              </div>
              <div className="flex-1">
                <p className="font-medium">{tx.type}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.from} → {tx.to}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs ${
                    tx.status === "success" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tx.status === "success" ? "✓ Success" : "✗ Failed"}
                </p>
                <p className="text-xs text-muted-foreground">{tx.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

export const NetworkCarousel: Story = {
  name: "Network Selector",
  render: () => (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-2 p-4">
        {[
          { name: "Ethereum", icon: "⟠", color: "bg-blue-500" },
          { name: "Base", icon: "🔵", color: "bg-blue-600" },
          { name: "Arbitrum", icon: "🔷", color: "bg-blue-400" },
          { name: "Polygon", icon: "🟣", color: "bg-purple-500" },
          { name: "Optimism", icon: "🔴", color: "bg-red-500" },
          { name: "Avalanche", icon: "🔺", color: "bg-red-600" },
          { name: "BNB Chain", icon: "💛", color: "bg-yellow-500" },
          { name: "Fantom", icon: "👻", color: "bg-blue-300" },
          { name: "zkSync", icon: "⚡", color: "bg-indigo-500" },
          { name: "Linea", icon: "📐", color: "bg-gray-500" },
        ].map((network) => (
          <button
            key={network.name}
            className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <div
              className={`h-10 w-10 rounded-full ${network.color} flex items-center justify-center text-white text-lg`}
            >
              {network.icon}
            </div>
            <span className="text-xs font-medium">{network.name}</span>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
