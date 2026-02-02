import type { Meta, StoryObj } from "@storybook/react";
import {
  Home,
  BarChart3,
  Wallet as WalletIcon,
  Settings,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  MoreHorizontal,
  ChevronDown,
  Zap,
  Shield,
  Gift,
} from "lucide-react";

// =============================================================================
// PRODUCTION PAGE MOCKUPS
// Exact pixel-perfect replicas of production pages
// =============================================================================

// Mock data matching production
const portfolioData = {
  totalBalance: 124567.89,
  change24h: 2345.67,
  changePercent: 1.92,
  assets: [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 45.234,
      value: 156789.12,
      change: 2.34,
      icon: "⟠",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 1.234,
      value: 52345.67,
      change: -0.87,
      icon: "₿",
    },
    {
      symbol: "SOL",
      name: "Solana",
      balance: 234.56,
      value: 23456.78,
      change: 5.67,
      icon: "◎",
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      balance: 567.89,
      value: 12345.67,
      change: -2.34,
      icon: "△",
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      balance: 12345.67,
      value: 8765.43,
      change: 1.23,
      icon: "⬡",
    },
  ],
  recentActivity: [
    { type: "swap", from: "ETH", to: "USDC", amount: 1.5, time: "2 min ago" },
    { type: "receive", token: "SOL", amount: 50, time: "1 hour ago" },
    { type: "send", token: "BTC", amount: 0.1, time: "3 hours ago" },
  ],
};

const tradingPairs = [
  {
    pair: "ETH/USDT",
    price: 3456.78,
    change: 2.34,
    volume: "1.2B",
    high: 3500,
    low: 3400,
  },
  {
    pair: "BTC/USDT",
    price: 42156.0,
    change: -0.87,
    volume: "2.4B",
    high: 42500,
    low: 41800,
  },
  {
    pair: "SOL/USDT",
    price: 98.45,
    change: 5.67,
    volume: "456M",
    high: 100,
    low: 94,
  },
];

// =============================================================================
// DASHBOARD PAGE MOCKUP
// =============================================================================

const DashboardPageMockup = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-skai-green flex items-center justify-center text-black font-bold">
                S
              </div>
              <span className="font-semibold text-lg">SKAI</span>
            </div>
            <nav className="flex items-center gap-6">
              {[
                { icon: Home, label: "Dashboard", active: true },
                { icon: BarChart3, label: "Trade", active: false },
                { icon: WalletIcon, label: "Portfolio", active: false },
                { icon: Zap, label: "Play", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "text-skai-green"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search tokens..."
                className="w-64 pl-10 pr-4 py-2 bg-muted rounded-lg border border-border text-sm"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-skai-green rounded-full" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-skai-green/10 border border-skai-green/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-skai-green/30" />
              <span className="text-sm font-medium">0x1234...5678</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Portfolio Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Good morning, Trader</h1>
          <p className="text-muted-foreground">
            Here's your portfolio overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-card rounded-xl border border-border">
            <div className="text-muted-foreground text-sm mb-1">
              Total Balance
            </div>
            <div className="text-2xl font-semibold">
              ${portfolioData.totalBalance.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-skai-green text-sm">
              <ArrowUpRight className="w-4 h-4" />
              +${portfolioData.change24h.toLocaleString()} (
              {portfolioData.changePercent}%)
            </div>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <div className="text-muted-foreground text-sm mb-1">24h Volume</div>
            <div className="text-2xl font-semibold">$12,456.78</div>
            <div className="flex items-center gap-1 mt-2 text-skai-green text-sm">
              <TrendingUp className="w-4 h-4" />
              +15.3% vs yesterday
            </div>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <div className="text-muted-foreground text-sm mb-1">
              Open Positions
            </div>
            <div className="text-2xl font-semibold">5</div>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
              <Shield className="w-4 h-4" />3 in profit
            </div>
          </div>
          <div className="p-5 bg-card rounded-xl border border-border">
            <div className="text-muted-foreground text-sm mb-1">
              SKAI Points
            </div>
            <div className="text-2xl font-semibold">12,450</div>
            <div className="flex items-center gap-1 mt-2 text-skai-green text-sm">
              <Gift className="w-4 h-4" />
              Rank #234
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assets List */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Your Assets</h2>
              <button className="text-sm text-skai-green hover:underline">
                View All
              </button>
            </div>
            <div className="divide-y divide-border">
              {portfolioData.assets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${asset.value.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm ${asset.change >= 0 ? "text-skai-green" : "text-destructive"}`}
                    >
                      {asset.change >= 0 ? "+" : ""}
                      {asset.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Recent Activity</h2>
              <button className="p-1 hover:bg-muted rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {portfolioData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "swap"
                        ? "bg-sky-blue/20 text-sky-blue"
                        : activity.type === "receive"
                          ? "bg-skai-green/20 text-skai-green"
                          : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {activity.type === "swap"
                      ? "⇄"
                      : activity.type === "receive"
                        ? "↓"
                        : "↑"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium capitalize">
                      {activity.type}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {activity.type === "swap"
                      ? `${activity.amount} ${activity.from} → ${activity.to}`
                      : `${activity.amount} ${activity.token}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="mt-6 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold">Market Overview</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-skai-green/10 text-skai-green rounded-lg text-sm font-medium">
                Top Gainers
              </button>
              <button className="px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium">
                Top Losers
              </button>
              <button className="px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium">
                Trending
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="p-4 font-medium">Pair</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">24h Change</th>
                  <th className="p-4 font-medium">24h Volume</th>
                  <th className="p-4 font-medium">24h High</th>
                  <th className="p-4 font-medium">24h Low</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {tradingPairs.map((pair) => (
                  <tr
                    key={pair.pair}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{pair.pair}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono">
                      ${pair.price.toLocaleString()}
                    </td>
                    <td
                      className={`p-4 ${pair.change >= 0 ? "text-skai-green" : "text-destructive"}`}
                    >
                      <span className="flex items-center gap-1">
                        {pair.change >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {pair.change >= 0 ? "+" : ""}
                        {pair.change}%
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{pair.volume}</td>
                    <td className="p-4 font-mono">
                      ${pair.high.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono">
                      ${pair.low.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 bg-skai-green text-black rounded-lg text-sm font-medium">
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Bottom Ticker */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border">
        <div className="flex items-center gap-6 px-6 py-2 overflow-x-auto">
          {tradingPairs.map((pair) => (
            <div key={pair.pair} className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium">{pair.pair}</span>
              <span className="text-sm font-mono">
                ${pair.price.toLocaleString()}
              </span>
              <span
                className={`text-xs ${pair.change >= 0 ? "text-skai-green" : "text-destructive"}`}
              >
                {pair.change >= 0 ? "+" : ""}
                {pair.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TRADING PAGE MOCKUP
// =============================================================================

const TradingPageMockup = () => {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Compact Header */}
      <header className="bg-card border-b border-border shrink-0">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-skai-green flex items-center justify-center text-black font-bold text-sm">
                S
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">ETH/USDT</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-xl font-semibold">$3,456.78</span>
              <span className="text-skai-green text-sm">+2.34%</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                24h High: <span className="text-foreground">$3,500</span>
              </span>
              <span>
                24h Low: <span className="text-foreground">$3,400</span>
              </span>
              <span>
                24h Vol: <span className="text-foreground">$1.2B</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 bg-muted rounded-lg text-sm">
              Spot
            </button>
            <button className="px-3 py-1.5 text-muted-foreground hover:text-foreground text-sm">
              Perp
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-skai-green/10 border border-skai-green/30 rounded-lg text-sm">
              <div className="w-5 h-5 rounded-full bg-skai-green/30" />
              <span>0x1234...5678</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Trading Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left - Order Book */}
        <div className="w-72 border-r border-border bg-card flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Order Book</span>
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-muted-foreground border-b border-border">
              <span>Price (USDT)</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Total</span>
            </div>
            {/* Sell orders */}
            <div className="px-3 py-1">
              {[
                { price: 3460.0, amount: 2.5, total: 8650 },
                { price: 3458.5, amount: 5.2, total: 17984 },
                { price: 3457.0, amount: 1.8, total: 6222 },
                { price: 3456.9, amount: 3.4, total: 11753 },
                { price: 3456.85, amount: 0.9, total: 3111 },
              ].map((order, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 py-0.5 text-xs">
                  <span className="text-destructive font-mono">
                    {order.price.toFixed(2)}
                  </span>
                  <span className="text-right font-mono">{order.amount}</span>
                  <span className="text-right font-mono text-muted-foreground">
                    {order.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            {/* Spread */}
            <div className="px-3 py-2 bg-muted/30 text-center">
              <span className="text-sm font-semibold">$3,456.78</span>
              <span className="text-xs text-muted-foreground ml-2">
                Spread: 0.02%
              </span>
            </div>
            {/* Buy orders */}
            <div className="px-3 py-1">
              {[
                { price: 3456.7, amount: 4.1, total: 14172 },
                { price: 3456.5, amount: 2.8, total: 9678 },
                { price: 3456.0, amount: 6.5, total: 22464 },
                { price: 3455.5, amount: 3.2, total: 11057 },
                { price: 3455.0, amount: 1.5, total: 5182 },
              ].map((order, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 py-0.5 text-xs">
                  <span className="text-skai-green font-mono">
                    {order.price.toFixed(2)}
                  </span>
                  <span className="text-right font-mono">{order.amount}</span>
                  <span className="text-right font-mono text-muted-foreground">
                    {order.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Chart */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-card flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-skai-green mb-4">
                ETH/USDT
              </div>
              <div className="text-3xl">$3,456.78</div>
              <div className="text-skai-green mt-2">+$79.23 (+2.34%)</div>
              <div className="text-muted-foreground text-sm mt-4">
                [TradingView Chart]
              </div>
            </div>
          </div>
          {/* Time controls */}
          <div className="flex items-center gap-2 px-4 py-2 border-t border-border bg-card">
            {["1m", "5m", "15m", "1h", "4h", "1D", "1W"].map((tf) => (
              <button
                key={tf}
                className={`px-2 py-1 text-xs rounded ${
                  tf === "1h"
                    ? "bg-skai-green/10 text-skai-green"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Right - Order Form */}
        <div className="w-80 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-skai-green text-black rounded-lg font-medium">
                Buy
              </button>
              <button className="flex-1 py-2 bg-muted text-muted-foreground rounded-lg font-medium">
                Sell
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-2 text-sm">
              <button className="flex-1 py-1.5 bg-skai-green/10 text-skai-green rounded">
                Limit
              </button>
              <button className="flex-1 py-1.5 text-muted-foreground hover:text-foreground rounded">
                Market
              </button>
              <button className="flex-1 py-1.5 text-muted-foreground hover:text-foreground rounded">
                Stop
              </button>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Price (USDT)
              </label>
              <input
                type="text"
                value="3,456.78"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Amount (ETH)
              </label>
              <input
                type="text"
                placeholder="0.00"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono"
              />
            </div>
            <div className="flex justify-between text-xs">
              {["25%", "50%", "75%", "100%"].map((pct) => (
                <button
                  key={pct}
                  className="px-3 py-1 bg-muted rounded hover:bg-muted/80"
                >
                  {pct}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Total (USDT)
              </label>
              <input
                type="text"
                value="0.00"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm font-mono"
                readOnly
              />
            </div>
            <div className="pt-2">
              <button className="w-full py-3 bg-skai-green text-black rounded-lg font-semibold">
                Buy ETH
              </button>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Available: <span className="text-foreground">10,000.00 USDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Open Orders */}
      <div className="h-48 border-t border-border bg-card shrink-0">
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border">
          <button className="text-sm font-medium text-skai-green">
            Open Orders (3)
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Order History
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Trade History
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Positions
          </button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-xs">
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Pair</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Side</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Filled</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  time: "12:34:56",
                  pair: "ETH/USDT",
                  type: "Limit",
                  side: "Buy",
                  price: 3400,
                  amount: 1.5,
                  filled: "0%",
                  total: 5100,
                },
                {
                  time: "11:22:33",
                  pair: "ETH/USDT",
                  type: "Limit",
                  side: "Sell",
                  price: 3600,
                  amount: 0.8,
                  filled: "0%",
                  total: 2880,
                },
              ].map((order, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-2 text-muted-foreground">
                    {order.time}
                  </td>
                  <td className="px-4 py-2">{order.pair}</td>
                  <td className="px-4 py-2">{order.type}</td>
                  <td
                    className={`px-4 py-2 ${order.side === "Buy" ? "text-skai-green" : "text-destructive"}`}
                  >
                    {order.side}
                  </td>
                  <td className="px-4 py-2 font-mono">${order.price}</td>
                  <td className="px-4 py-2 font-mono">{order.amount}</td>
                  <td className="px-4 py-2">{order.filled}</td>
                  <td className="px-4 py-2 font-mono">${order.total}</td>
                  <td className="px-4 py-2">
                    <button className="text-destructive hover:underline text-xs">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// WALLET PAGE MOCKUP
// =============================================================================

const WalletPageMockup = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your assets and transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-muted border border-border rounded-lg font-medium text-sm">
            Deposit
          </button>
          <button className="px-4 py-2 bg-muted border border-border rounded-lg font-medium text-sm">
            Withdraw
          </button>
          <button className="px-4 py-2 bg-skai-green text-black rounded-lg font-medium text-sm">
            Transfer
          </button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-gradient-to-br from-skai-green/20 to-sky-blue/10 rounded-xl border border-skai-green/30">
          <div className="text-sm text-muted-foreground mb-1">
            Total Balance
          </div>
          <div className="text-3xl font-bold">$124,567.89</div>
          <div className="flex items-center gap-1 mt-2 text-skai-green text-sm">
            <ArrowUpRight className="w-4 h-4" />
            +$2,345.67 (1.92%) today
          </div>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <div className="text-sm text-muted-foreground mb-1">Available</div>
          <div className="text-3xl font-bold">$98,765.43</div>
          <div className="text-sm text-muted-foreground mt-2">
            Ready to trade
          </div>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <div className="text-sm text-muted-foreground mb-1">In Orders</div>
          <div className="text-3xl font-bold">$25,802.46</div>
          <div className="text-sm text-muted-foreground mt-2">
            Locked in open orders
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Assets</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              <span className="text-muted-foreground">Hide small balances</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search assets"
                className="pl-9 pr-4 py-1.5 bg-muted rounded-lg border border-border text-sm w-48"
              />
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border">
              <th className="p-4 font-medium">Asset</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Available</th>
              <th className="p-4 font-medium">In Orders</th>
              <th className="p-4 font-medium">USD Value</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.assets.map((asset) => (
              <tr
                key={asset.symbol}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {asset.icon}
                    </div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono">{asset.balance}</td>
                <td className="p-4 font-mono">
                  {(asset.balance * 0.8).toFixed(4)}
                </td>
                <td className="p-4 font-mono">
                  {(asset.balance * 0.2).toFixed(4)}
                </td>
                <td className="p-4 font-mono">
                  ${asset.value.toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-skai-green/10 text-skai-green rounded text-xs font-medium">
                      Trade
                    </button>
                    <button className="px-3 py-1 bg-muted rounded text-xs font-medium">
                      Transfer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================================================
// STORYBOOK CONFIG
// =============================================================================

const meta: Meta = {
  title: "Production Pages/Mockups",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Production Page Mockups

Exact pixel-perfect replicas of production pages for design review and development.

## Purpose
- **Design Review** - Compare mockups with Figma designs
- **Component Integration** - See how components work together
- **Development Reference** - Use as implementation guide
- **Stakeholder Preview** - Demo before deploying

## Pages Available
1. **Dashboard** - Main portfolio overview
2. **Trading** - Spot/perp trading interface
3. **Wallet** - Asset management

## Usage for Designers
1. View these mockups alongside your Figma designs
2. Note any discrepancies in spacing, colors, or layout
3. Use the Theme Configurator to adjust tokens
4. Export changes and update design system
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Dashboard: Story = {
  name: "Dashboard Page",
  render: () => <DashboardPageMockup />,
  parameters: {
    docs: {
      description: {
        story:
          "Main dashboard showing portfolio overview, assets, activity, and market data.",
      },
    },
  },
};

export const Trading: Story = {
  name: "Trading Page",
  render: () => <TradingPageMockup />,
  parameters: {
    docs: {
      description: {
        story:
          "Full trading interface with order book, chart, order form, and positions.",
      },
    },
  },
};

export const Wallet: Story = {
  name: "Wallet Page",
  render: () => <WalletPageMockup />,
  parameters: {
    docs: {
      description: {
        story: "Wallet management page showing balances and asset list.",
      },
    },
  },
};
