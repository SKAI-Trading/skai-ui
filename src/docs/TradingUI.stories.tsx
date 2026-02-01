import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Badge } from "../components/badge";
import { Progress } from "../components/progress";
import { Separator } from "../components/separator";
import { Avatar, AvatarFallback } from "../components/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  ChevronDown,
  LineChart,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const meta: Meta = {
  title: "Patterns/Trading",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const OrderBook: StoryObj = {
  name: "Order Book",
  render: () => {
    const asks = [
      { price: 2152.5, amount: 0.234, total: 503.89 },
      { price: 2151.25, amount: 0.567, total: 1219.76 },
      { price: 2150.0, amount: 1.234, total: 2653.1 },
      { price: 2149.5, amount: 0.891, total: 1915.22 },
      { price: 2148.75, amount: 2.345, total: 5038.82 },
    ];

    const bids = [
      { price: 2147.0, amount: 3.456, total: 7419.67 },
      { price: 2146.5, amount: 1.234, total: 2648.74 },
      { price: 2145.25, amount: 0.678, total: 1454.48 },
      { price: 2144.0, amount: 2.109, total: 4521.7 },
      { price: 2143.5, amount: 0.456, total: 977.44 },
    ];

    const maxTotal = Math.max(
      ...asks.map((a) => a.total),
      ...bids.map((b) => b.total),
    );

    return (
      <Card className="w-[350px]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Order Book</CardTitle>
            <Badge variant="outline" className="text-xs">
              ETH/USDC
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Header */}
          <div className="grid grid-cols-3 text-xs text-muted-foreground mb-2 px-2">
            <span>Price (USDC)</span>
            <span className="text-right">Amount (ETH)</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sells) */}
          <div className="space-y-0.5 mb-2">
            {asks.map((ask, i) => (
              <div
                key={i}
                className="grid grid-cols-3 text-xs font-mono relative px-2 py-1"
              >
                <div
                  className="absolute inset-0 bg-red-500/10"
                  style={{
                    width: `${(ask.total / maxTotal) * 100}%`,
                    right: 0,
                    left: "auto",
                  }}
                />
                <span className="text-red-500 relative">
                  {ask.price.toFixed(2)}
                </span>
                <span className="text-right relative">
                  {ask.amount.toFixed(3)}
                </span>
                <span className="text-right text-muted-foreground relative">
                  {ask.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Spread */}
          <div className="py-2 px-2 bg-muted/50 rounded text-center">
            <span className="text-lg font-bold font-mono">$2,148.00</span>
            <span className="text-xs text-muted-foreground ml-2">
              Spread: 0.03%
            </span>
          </div>

          {/* Bids (Buys) */}
          <div className="space-y-0.5 mt-2">
            {bids.map((bid, i) => (
              <div
                key={i}
                className="grid grid-cols-3 text-xs font-mono relative px-2 py-1"
              >
                <div
                  className="absolute inset-0 bg-green-500/10"
                  style={{
                    width: `${(bid.total / maxTotal) * 100}%`,
                    right: 0,
                    left: "auto",
                  }}
                />
                <span className="text-green-500 relative">
                  {bid.price.toFixed(2)}
                </span>
                <span className="text-right relative">
                  {bid.amount.toFixed(3)}
                </span>
                <span className="text-right text-muted-foreground relative">
                  {bid.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const PriceTicker: StoryObj = {
  name: "Price Ticker",
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Price Ticker Variants</h2>

      {/* Compact */}
      <Card className="w-[300px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-500 text-white">
                E
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">ETH</span>
                <Badge variant="secondary" className="text-xs">
                  Ethereum
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">$2,148.32</span>
                <span className="text-green-500 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.34%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed */}
      <Card className="w-[400px]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  E
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">Ethereum</span>
                  <Badge variant="outline">ETH</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Rank #2</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-end gap-4 mb-4">
            <span className="text-4xl font-bold font-mono">$2,148.32</span>
            <div className="flex items-center gap-1 text-green-500 pb-1">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">+$48.76 (2.34%)</span>
            </div>
          </div>

          <div className="h-16 bg-muted/50 rounded-lg flex items-center justify-center mb-4">
            <LineChart className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground ml-2">
              Price Chart
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">24h High</p>
              <p className="font-mono">$2,189.45</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Low</p>
              <p className="font-mono">$2,098.12</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Volume</p>
              <p className="font-mono">$12.5B</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini */}
      <div className="flex gap-2">
        {[
          { symbol: "ETH", price: "$2,148", change: "+2.34%", up: true },
          { symbol: "BTC", price: "$43,567", change: "-0.82%", up: false },
          { symbol: "SOL", price: "$98.45", change: "+5.67%", up: true },
        ].map((token) => (
          <div
            key={token.symbol}
            className="px-3 py-2 bg-card border rounded-lg flex items-center gap-2"
          >
            <span className="font-semibold">{token.symbol}</span>
            <span className="font-mono text-sm">{token.price}</span>
            <span
              className={`text-xs ${token.up ? "text-green-500" : "text-red-500"}`}
            >
              {token.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const TradeForm: StoryObj = {
  name: "Trade Form",
  render: () => {
    const [side, setSide] = useState<"buy" | "sell">("buy");
    const [orderType, setOrderType] = useState<"market" | "limit">("market");

    return (
      <Card className="w-[350px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Trade ETH/USDC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buy/Sell Tabs */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={side === "buy" ? "default" : "outline"}
              onClick={() => setSide("buy")}
              className={
                side === "buy" ? "bg-green-500 hover:bg-green-600" : ""
              }
            >
              Buy
            </Button>
            <Button
              variant={side === "sell" ? "default" : "outline"}
              onClick={() => setSide("sell")}
              className={side === "sell" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Sell
            </Button>
          </div>

          {/* Order Type */}
          <Tabs
            value={orderType}
            onValueChange={(v) => setOrderType(v as "market" | "limit")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Price (Limit only) */}
          {orderType === "limit" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="text-muted-foreground">Mark: $2,148.00</span>
              </div>
              <Input
                type="text"
                placeholder="0.00"
                className="font-mono text-right"
                defaultValue="2148.00"
              />
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-muted-foreground">Balance: 2.5 ETH</span>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="0.00"
                className="font-mono pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ETH
              </span>
            </div>
            <div className="flex gap-1">
              {[25, 50, 75, 100].map((pct) => (
                <Button
                  key={pct}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-muted-foreground">Balance: $5,000</span>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="0.00"
                className="font-mono pr-16"
                readOnly
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USDC
              </span>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Fee</span>
              <span className="font-mono">$0.50</span>
            </div>
            {orderType === "market" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Price Impact</span>
                <span className="text-green-500">{"<0.01%"}</span>
              </div>
            )}
          </div>

          <Button
            className={`w-full ${
              side === "buy"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {side === "buy" ? "Buy ETH" : "Sell ETH"}
          </Button>
        </CardContent>
      </Card>
    );
  },
};

export const PortfolioBreakdown: StoryObj = {
  name: "Portfolio Breakdown",
  render: () => {
    const holdings = [
      {
        token: "ETH",
        amount: "2.5",
        value: 5363,
        allocation: 43.4,
        change: 2.34,
      },
      {
        token: "USDC",
        amount: "5,000",
        value: 5000,
        allocation: 40.5,
        change: 0,
      },
      {
        token: "SKAI",
        amount: "10,000",
        value: 1982,
        allocation: 16.1,
        change: 15.2,
      },
    ];

    const total = holdings.reduce((sum, h) => sum + h.value, 0);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-sm">Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-4xl font-bold">${total.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-1 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span>+$234.56 (1.94%) today</span>
            </div>
          </div>

          {/* Allocation Bar */}
          <div className="h-4 rounded-full overflow-hidden flex">
            <div className="bg-blue-500" style={{ width: "43.4%" }} />
            <div className="bg-green-500" style={{ width: "40.5%" }} />
            <div className="bg-purple-500" style={{ width: "16.1%" }} />
          </div>

          {/* Holdings List */}
          <div className="space-y-3">
            {holdings.map((holding) => (
              <div key={holding.token} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={`${
                      holding.token === "ETH"
                        ? "bg-blue-500"
                        : holding.token === "USDC"
                          ? "bg-green-500"
                          : "bg-purple-500"
                    } text-white`}
                  >
                    {holding.token[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{holding.token}</span>
                    <span className="font-mono">
                      ${holding.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{holding.amount}</span>
                    <span
                      className={
                        holding.change > 0
                          ? "text-green-500"
                          : holding.change < 0
                            ? "text-red-500"
                            : ""
                      }
                    >
                      {holding.change > 0 ? "+" : ""}
                      {holding.change}%
                    </span>
                  </div>
                </div>
                <div className="w-20">
                  <Progress value={holding.allocation} className="h-1" />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {holding.allocation}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const TradeHistory: StoryObj = {
  name: "Trade History",
  render: () => {
    const trades = [
      {
        type: "buy",
        pair: "ETH/USDC",
        amount: "1.5 ETH",
        price: "$2,145.00",
        total: "$3,217.50",
        time: "2m ago",
        status: "completed",
      },
      {
        type: "sell",
        pair: "SKAI/USDC",
        amount: "5,000 SKAI",
        price: "$0.198",
        total: "$990.00",
        time: "15m ago",
        status: "completed",
      },
      {
        type: "buy",
        pair: "SOL/USDC",
        amount: "10 SOL",
        price: "$98.50",
        total: "$985.00",
        time: "1h ago",
        status: "completed",
      },
      {
        type: "sell",
        pair: "ETH/USDC",
        amount: "0.5 ETH",
        price: "$2,150.00",
        total: "$1,075.00",
        time: "2h ago",
        status: "completed",
      },
    ];

    return (
      <Card className="w-[500px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Trade History</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trades.map((trade, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    trade.type === "buy" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}
                >
                  {trade.type === "buy" ? (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{trade.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {trade.pair}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {trade.amount} @ {trade.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{trade.total}</p>
                  <p className="text-xs text-muted-foreground">{trade.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
};
