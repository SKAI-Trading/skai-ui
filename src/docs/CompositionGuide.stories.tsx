import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/core/button";
import { Card } from "../components/core/card";
import { Badge } from "../components/core/badge";

/**
 * # Component Composition Guide
 *
 * Learn how to combine atomic components into complex, production-ready UIs.
 * Each example shows step-by-step composition from basic to advanced.
 */

const meta: Meta = {
  title: "Design System/Composition Guide",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Component Composition Guide

Learn how to build complex UIs by combining atomic components. Each example includes:
- Live preview
- Step-by-step breakdown
- Copy-ready code
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// =============================================================================
// CARD COMPOSITION
// =============================================================================

export const CardComposition: Story = {
  name: "📦 Card Composition",
  render: () => (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Building Cards</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Cards are the foundation of most UI patterns. Here's how to compose
          them for different use cases.
        </p>
      </div>

      {/* Level 1: Basic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-sm flex items-center justify-center">
              1
            </span>
            Basic Card
          </h3>
          <Card className="p-6">
            <h4 className="font-semibold">Card Title</h4>
            <p className="text-slate-600 text-sm mt-1">Simple content</p>
          </Card>
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          <pre className="text-green-400 text-xs overflow-auto">{`<Card className="p-6">
  <h4 className="font-semibold">Card Title</h4>
  <p className="text-slate-600 text-sm mt-1">Simple content</p>
</Card>`}</pre>
        </div>
      </div>

      {/* Level 2: Card with Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-sm flex items-center justify-center">
              2
            </span>
            Card with Header & Actions
          </h3>
          <Card>
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h4 className="font-semibold">Portfolio</h4>
                <p className="text-slate-500 text-sm">Your assets</p>
              </div>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </div>
            <div className="p-4">
              <p className="text-2xl font-bold">$124,567.89</p>
              <p className="text-green-500 text-sm">+2.34% today</p>
            </div>
          </Card>
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          <pre className="text-green-400 text-xs overflow-auto">{`<Card>
  <div className="flex items-center justify-between p-4 border-b">
    <div>
      <h4 className="font-semibold">Portfolio</h4>
      <p className="text-slate-500 text-sm">Your assets</p>
    </div>
    <Button size="sm" variant="outline">View All</Button>
  </div>
  <div className="p-4">
    <p className="text-2xl font-bold">$124,567.89</p>
    <p className="text-green-500 text-sm">+2.34% today</p>
  </div>
</Card>`}</pre>
        </div>
      </div>

      {/* Level 3: Card with List Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-sm flex items-center justify-center">
              3
            </span>
            Card with List Content
          </h3>
          <Card>
            <div className="p-4 border-b">
              <h4 className="font-semibold">Assets</h4>
            </div>
            <div className="divide-y">
              {[
                { token: "ETH", balance: "2.5", value: "$8,642" },
                { token: "USDC", balance: "5,000", value: "$5,000" },
                { token: "SOL", balance: "25.8", value: "$2,541" },
              ].map((asset) => (
                <div
                  key={asset.token}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold">
                      {asset.token[0]}
                    </div>
                    <div>
                      <p className="font-medium">{asset.token}</p>
                      <p className="text-slate-500 text-sm">{asset.balance}</p>
                    </div>
                  </div>
                  <p className="font-mono">{asset.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          <pre className="text-green-400 text-xs overflow-auto">{`<Card>
  <div className="p-4 border-b">
    <h4 className="font-semibold">Assets</h4>
  </div>
  <div className="divide-y">
    {assets.map((asset) => (
      <div key={asset.token} className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 ...">
            {asset.token[0]}
          </div>
          <div>
            <p className="font-medium">{asset.token}</p>
            <p className="text-slate-500 text-sm">{asset.balance}</p>
          </div>
        </div>
        <p className="font-mono">{asset.value}</p>
      </div>
    ))}
  </div>
</Card>`}</pre>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// FORM COMPOSITION
// =============================================================================

export const FormComposition: Story = {
  name: "📝 Form Composition",
  render: () => (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Building Forms</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Forms combine inputs, labels, buttons, and validation into cohesive
          user experiences.
        </p>
      </div>

      {/* Swap Form Example */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-4">Swap Form Pattern</h3>
          <Card className="max-w-md">
            <div className="p-4 border-b">
              <div className="flex gap-2">
                <Button size="sm" variant="default">
                  Swap
                </Button>
                <Button size="sm" variant="ghost">
                  Limit
                </Button>
                <Button size="sm" variant="ghost">
                  Buy
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {/* From Input */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>You pay</span>
                  <span>Balance: 2.5 ETH</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-mono outline-none"
                    defaultValue="1.0"
                  />
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-2 rounded-lg">
                    <span className="text-lg">⟠</span>
                    <span className="font-semibold">ETH</span>
                    <span>▼</span>
                  </button>
                </div>
              </div>

              {/* Swap Arrow */}
              <div className="flex justify-center -my-2 relative z-10">
                <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-900 flex items-center justify-center">
                  ↓
                </button>
              </div>

              {/* To Input */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 -mt-2">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>You receive</span>
                  <span>Balance: 5,000 USDC</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-2xl font-mono outline-none"
                    defaultValue="3,456.78"
                  />
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-2 rounded-lg">
                    <span className="text-lg">$</span>
                    <span className="font-semibold">USDC</span>
                    <span>▼</span>
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm space-y-1 text-slate-500">
                <div className="flex justify-between">
                  <span>Rate</span>
                  <span>1 ETH = 3,456.78 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span>0.30%</span>
                </div>
              </div>

              <Button className="w-full">Swap</Button>
            </div>
          </Card>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 h-fit">
          <pre className="text-green-400 text-xs overflow-auto">{`<Card>
  {/* Tabs */}
  <div className="p-4 border-b">
    <div className="flex gap-2">
      <Button size="sm">Swap</Button>
      <Button size="sm" variant="ghost">Limit</Button>
    </div>
  </div>
  
  <div className="p-4 space-y-4">
    {/* From Input */}
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex justify-between text-sm mb-2">
        <span>You pay</span>
        <span>Balance: {fromBalance}</span>
      </div>
      <div className="flex items-center gap-3">
        <input type="text" className="flex-1 text-2xl..." />
        <TokenSelector token={fromToken} />
      </div>
    </div>

    {/* Swap Direction Button */}
    <SwapDirectionButton onClick={handleSwap} />

    {/* To Input - Similar structure */}
    
    {/* Fee Details */}
    <FeeDetails rate={rate} fee={fee} />

    <Button className="w-full">Swap</Button>
  </div>
</Card>`}</pre>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// DATA TABLE COMPOSITION
// =============================================================================

export const DataTableComposition: Story = {
  name: "📊 Data Table Composition",
  render: () => (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Building Data Tables</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tables display structured data with sorting, filtering, and actions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h4 className="font-semibold">Open Orders</h4>
              <p className="text-slate-500 text-sm">3 active orders</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Filter
              </Button>
              <Button size="sm" variant="destructive">
                Cancel All
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-500">
                    Pair
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-500">
                    Type
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-500">
                    Price
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-500">
                    Amount
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-500">
                    Filled
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    pair: "ETH/USDT",
                    type: "buy",
                    price: "$3,400.00",
                    amount: "2.5 ETH",
                    filled: "40%",
                  },
                  {
                    pair: "BTC/USDT",
                    type: "sell",
                    price: "$42,500.00",
                    amount: "0.1 BTC",
                    filled: "0%",
                  },
                  {
                    pair: "SOL/USDT",
                    type: "buy",
                    price: "$95.00",
                    amount: "50 SOL",
                    filled: "100%",
                  },
                ].map((order, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-4 py-3 font-mono font-semibold">
                      {order.pair}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          order.type === "buy" ? "default" : "destructive"
                        }
                      >
                        {order.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {order.price}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {order.amount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: order.filled }}
                          />
                        </div>
                        <span className="text-sm text-slate-500">
                          {order.filled}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost">
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-slate-500">Showing 1-3 of 3</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled>
                Previous
              </Button>
              <Button size="sm" variant="outline" disabled>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

// =============================================================================
// NAVIGATION COMPOSITION
// =============================================================================

export const NavigationComposition: Story = {
  name: "🧭 Navigation Composition",
  render: () => (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Building Navigation</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Navigation patterns for headers, sidebars, and mobile menus.
        </p>
      </div>

      {/* Desktop Header */}
      <div>
        <h3 className="font-bold mb-4">Desktop Header</h3>
        <div className="bg-white dark:bg-slate-900 border rounded-lg">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                SKAI
              </div>
              {/* Nav Links */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium text-primary">
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Trade
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Play
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Wallet
                </a>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                <span className="text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none w-40"
                />
              </div>
              <button className="relative">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <Button size="sm">Connect Wallet</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div>
        <h3 className="font-bold mb-4">Mobile Header</h3>
        <div className="bg-white dark:bg-slate-900 border rounded-lg max-w-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button className="text-xl">☰</button>
            <div className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              SKAI
            </div>
            <button className="relative">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div>
        <h3 className="font-bold mb-4">Tab Navigation</h3>
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-1 inline-flex">
          <button className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white">
            Overview
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900">
            History
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900">
            Settings
          </button>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// MODAL COMPOSITION
// =============================================================================

export const ModalComposition: Story = {
  name: "🪟 Modal Composition",
  render: () => (
    <div className="space-y-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Building Modals</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Modal patterns for dialogs, confirmations, and forms.
        </p>
      </div>

      {/* Token Select Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold mb-4">Token Select Modal</h3>
          <div className="relative">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 rounded-lg" />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-xl max-w-sm mx-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Select Token</h4>
                <button className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name or address"
                    className="bg-transparent text-sm outline-none flex-1"
                  />
                </div>
              </div>

              {/* Popular */}
              <div className="p-4 border-b">
                <p className="text-xs text-slate-500 mb-2">Popular</p>
                <div className="flex flex-wrap gap-2">
                  {["ETH", "USDC", "USDT", "DAI"].map((token) => (
                    <button
                      key={token}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-300" />
                      <span className="text-sm font-medium">{token}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Token List */}
              <div className="max-h-64 overflow-y-auto">
                {[
                  { symbol: "ETH", name: "Ethereum", balance: "2.5" },
                  { symbol: "USDC", name: "USD Coin", balance: "5,000" },
                  { symbol: "USDT", name: "Tether", balance: "1,234.56" },
                  { symbol: "DAI", name: "Dai", balance: "500" },
                ].map((token) => (
                  <button
                    key={token.symbol}
                    className="flex items-center justify-between w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="text-left">
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-xs text-slate-500">{token.name}</p>
                      </div>
                    </div>
                    <p className="font-mono text-sm">{token.balance}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <div>
          <h3 className="font-bold mb-4">Confirmation Modal</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-black/50 rounded-lg" />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl max-w-sm mx-auto shadow-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto mb-4 flex items-center justify-center text-3xl">
                  ⚠️
                </div>
                <h4 className="text-lg font-bold mb-2">Confirm Swap</h4>
                <p className="text-slate-600 text-sm">
                  You are about to swap 1.0 ETH for 3,456.78 USDC
                </p>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Rate</span>
                  <span>1 ETH = 3,456.78 USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee</span>
                  <span>0.30% (~$10.37)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Slippage</span>
                  <span>0.5%</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">Confirm</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
