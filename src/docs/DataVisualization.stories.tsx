/**
 * Data Visualization Documentation
 *
 * Chart styles, data tables, real-time updates, and sparklines.
 * Based on Recharts patterns used in SKAI trading interfaces.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

const meta: Meta = {
  title: "Documentation/Data Visualization",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 📊 Data Visualization

Standards for charts, tables, and real-time data display in SKAI.

## Chart Library

SKAI uses **Recharts** for all charting needs:
- Lightweight (~45KB gzipped)
- React-native composable API
- Great animation support
- Accessible by default

## Color Palette for Data

| Use Case | Color | Hex |
|----------|-------|-----|
| Positive/Gain | Green | #22C55E |
| Negative/Loss | Red | #EF4444 |
| Primary line | Cyan | #56C0F6 |
| Secondary | Teal | #2DEDAD |
| Grid/Axis | Muted | rgba(255,255,255,0.1) |
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// CHART COLOR PALETTE
// ============================================================================

const chartColors = {
  "Primary Colors": [
    {
      name: "Primary Cyan",
      hex: "#56C0F6",
      usage: "Main data line, primary metrics",
    },
    {
      name: "Secondary Teal",
      hex: "#2DEDAD",
      usage: "Secondary data, comparisons",
    },
    {
      name: "Accent Gold",
      hex: "#F59E0B",
      usage: "Highlights, alerts, premium",
    },
  ],
  "Semantic Colors": [
    { name: "Positive Green", hex: "#22C55E", usage: "Gains, profit, success" },
    { name: "Negative Red", hex: "#EF4444", usage: "Loss, decline, errors" },
    { name: "Neutral Gray", hex: "#6B7280", usage: "Unchanged, neutral data" },
  ],
  "Chart Structure": [
    {
      name: "Grid Lines",
      hex: "rgba(255,255,255,0.05)",
      usage: "Background grid",
    },
    {
      name: "Axis Labels",
      hex: "rgba(255,255,255,0.5)",
      usage: "X/Y axis text",
    },
    { name: "Tooltip BG", hex: "rgba(0,0,0,0.9)", usage: "Tooltip background" },
    {
      name: "Area Fill",
      hex: "rgba(86,192,246,0.1)",
      usage: "Area chart gradient fill",
    },
  ],
  "Multi-series": [
    { name: "Series 1", hex: "#56C0F6", usage: "First data series" },
    { name: "Series 2", hex: "#2DEDAD", usage: "Second data series" },
    { name: "Series 3", hex: "#A855F7", usage: "Third data series" },
    { name: "Series 4", hex: "#F59E0B", usage: "Fourth data series" },
    { name: "Series 5", hex: "#EC4899", usage: "Fifth data series" },
  ],
};

export const ChartColorPalette: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chart Color Palette</h2>
        <p className="text-muted-foreground mb-6">
          Consistent colors for all data visualization. Designed for dark
          backgrounds with sufficient contrast.
        </p>
      </div>

      {Object.entries(chartColors).map(([category, colors]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-white/10"
                      style={{ background: color.hex }}
                    />
                    <div>
                      <span className="font-semibold">{color.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {color.usage}
                      </p>
                    </div>
                  </div>
                  <code className="text-sm font-mono text-cyan-400">
                    {color.hex}
                  </code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ============================================================================
// AREA CHART PATTERN
// ============================================================================

export const AreaChartPattern: StoryObj = {
  render: () => {
    // Generate mock data for visualization - currently showing static mockups
    // const upData = generateMockData(14, "up");
    // const downData = generateMockData(14, "down");

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Area Chart Pattern</h2>
          <p className="text-muted-foreground mb-6">
            Primary chart type for price/value visualization. Uses gradient
            fills with color-coded gains/losses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive Trend */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">ETH Price (14D)</CardTitle>
                <Badge className="bg-green-500/20 text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 relative bg-black/20 rounded-lg overflow-hidden">
                {/* Simulated chart area */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 192"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="greenGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,150 Q50,140 100,120 T200,80 T300,40 T400,30 V192 H0 Z"
                    fill="url(#greenGradient)"
                  />
                  <path
                    d="M0,150 Q50,140 100,120 T200,80 T300,40 T400,30"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Negative Trend */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">BTC Price (14D)</CardTitle>
                <Badge className="bg-red-500/20 text-red-400">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -8.3%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 relative bg-black/20 rounded-lg overflow-hidden">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 192"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="redGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,30 Q50,40 100,60 T200,100 T300,130 T400,150 V192 H0 Z"
                    fill="url(#redGradient)"
                  />
                  <path
                    d="M0,30 Q50,40 100,60 T200,100 T300,130 T400,150"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Recharts Area Chart Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-cyan-400">
                {`
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  data: { date: string; price: number }[];
  isPositive: boolean;
}

export function PriceChart({ data, isPositive }: PriceChartProps) {
  const color = isPositive ? '#22C55E' : '#EF4444';
  
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
        />
        
        <YAxis 
          hide 
          domain={['auto', 'auto']}
        />
        
        <Tooltip
          contentStyle={{
            background: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '12px',
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
          formatter={(value: number) => [\`$\${value.toFixed(2)}\`, 'Price']}
        />
        
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
              `.trim()}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// SPARKLINES
// ============================================================================

export const Sparklines: StoryObj = {
  render: () => {
    // Generate mini data
    const generateSparkData = (points: number) =>
      Array.from({ length: points }, () => Math.random() * 100);

    const tokens = [
      {
        symbol: "ETH",
        price: "$2,345.67",
        change: "+5.34%",
        positive: true,
        data: generateSparkData(20),
      },
      {
        symbol: "BTC",
        price: "$43,210.00",
        change: "-2.15%",
        positive: false,
        data: generateSparkData(20),
      },
      {
        symbol: "USDC",
        price: "$1.00",
        change: "+0.01%",
        positive: true,
        data: generateSparkData(20),
      },
      {
        symbol: "SKAI",
        price: "$0.0234",
        change: "+12.5%",
        positive: true,
        data: generateSparkData(20),
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sparklines</h2>
          <p className="text-muted-foreground mb-6">
            Compact inline charts for showing trends without detailed data. Used
            in token lists, leaderboards, and compact views.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Token Price Table with Sparklines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center font-bold">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <span className="font-semibold">{token.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {token.price}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="flex items-center gap-4">
                    <svg
                      width="80"
                      height="24"
                      viewBox="0 0 80 24"
                      className="overflow-visible"
                    >
                      <polyline
                        fill="none"
                        stroke={token.positive ? "#22C55E" : "#EF4444"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={token.data
                          .map(
                            (v, i) => `${(i / 19) * 80},${24 - (v / 100) * 20}`,
                          )
                          .join(" ")}
                      />
                    </svg>

                    <span
                      className={`text-sm font-mono w-20 text-right ${token.positive ? "text-green-400" : "text-red-400"}`}
                    >
                      {token.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle>Sparkline Component</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-cyan-400">
                {`
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export function Sparkline({ 
  data, 
  width = 80, 
  height = 24, 
  positive = true 
}: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return \`\${x},\${y}\`;
    })
    .join(' ');

  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible"
    >
      <polyline
        fill="none"
        stroke={positive ? '#22C55E' : '#EF4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
              `.trim()}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// DATA TABLES
// ============================================================================

export const DataTables: StoryObj = {
  render: () => {
    const transactions = [
      {
        hash: "0x742d...fE1a",
        type: "Swap",
        from: "ETH",
        to: "USDC",
        amount: "$1,234.56",
        time: "2m ago",
        status: "confirmed",
      },
      {
        hash: "0x8f2a...e7f8",
        type: "Swap",
        from: "USDC",
        to: "SKAI",
        amount: "$567.89",
        time: "5m ago",
        status: "confirmed",
      },
      {
        hash: "0x1f98...F984",
        type: "Transfer",
        from: "ETH",
        to: "-",
        amount: "$2,345.00",
        time: "12m ago",
        status: "pending",
      },
      {
        hash: "0x3a4b...c5d6",
        type: "Swap",
        from: "BTC",
        to: "ETH",
        amount: "$5,678.90",
        time: "1h ago",
        status: "confirmed",
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Data Tables</h2>
          <p className="text-muted-foreground mb-6">
            Tables for transaction history, leaderboards, and detailed data
            views.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Hash
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      From → To
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <code className="text-sm text-cyan-400 cursor-pointer hover:underline">
                          {tx.hash}
                        </code>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{tx.type}</Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {tx.from} {tx.to !== "-" && `→ ${tx.to}`}
                      </td>
                      <td className="p-4 text-right font-mono">{tx.amount}</td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="h-3 w-3" />
                          {tx.time}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Badge
                          className={
                            tx.status === "confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-amber-500/20 text-amber-400"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Table Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Table Design Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Align numbers right",
                  desc: "Makes comparison easier",
                },
                { title: "Align text left", desc: "Natural reading direction" },
                {
                  title: "Consistent formatting",
                  desc: "Same decimal places, units",
                },
                {
                  title: "Zebra striping optional",
                  desc: "Use hover states instead",
                },
                { title: "Sticky headers", desc: "For scrollable tables" },
                {
                  title: "Minimum touch targets",
                  desc: "44px for clickable rows",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-black/20"
                >
                  <BarChart3 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{item.title}</span>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// REAL-TIME UPDATES
// ============================================================================

export const RealTimeUpdates: StoryObj = {
  render: () => {
    const [price, setPrice] = useState(2345.67);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isLive, setIsLive] = useState(true);

    // Simulate real-time updates
    useEffect(() => {
      if (!isLive) return;

      const interval = setInterval(() => {
        setPrice((prev) => prev + (Math.random() - 0.5) * 10);
        setLastUpdate(new Date());
      }, 2000);

      return () => clearInterval(interval);
    }, [isLive]);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Real-Time Data Updates</h2>
          <p className="text-muted-foreground mb-6">
            Patterns for displaying live data with appropriate visual feedback.
          </p>
        </div>

        {/* Live Price Display */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Live Price Feed</CardTitle>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                />
                <span className="text-sm text-muted-foreground">
                  {isLive ? "Live" : "Paused"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLive(!isLive)}
                >
                  {isLive ? "Pause" : "Resume"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 rounded-xl bg-black/20">
              <div>
                <span className="text-muted-foreground">ETH/USD</span>
                <div className="text-4xl font-bold font-mono">
                  ${price.toFixed(2)}
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>Last update</div>
                <div>{lastUpdate.toLocaleTimeString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Animation Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Update Animation Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Flash highlight */}
              <div className="p-4 rounded-lg bg-black/20 space-y-2">
                <h4 className="font-semibold text-sm">Flash Highlight</h4>
                <div className="animate-pulse bg-cyan-500/20 rounded p-2">
                  <span className="font-mono">$2,345.67</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Brief background flash on change
                </p>
              </div>

              {/* Color transition */}
              <div className="p-4 rounded-lg bg-black/20 space-y-2">
                <h4 className="font-semibold text-sm">Color Transition</h4>
                <div className="p-2">
                  <span className="font-mono text-green-400 transition-colors duration-300">
                    $2,345.67
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Green/red based on direction
                </p>
              </div>

              {/* Counter animation */}
              <div className="p-4 rounded-lg bg-black/20 space-y-2">
                <h4 className="font-semibold text-sm">Counter Animation</h4>
                <div className="p-2">
                  <span className="font-mono">$2,345.67</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Animate number changes
                </p>
              </div>
            </div>

            <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
              <code className="text-cyan-400">
                {`
// Flash highlight on value change
const [flash, setFlash] = useState(false);
const prevValue = usePrevious(value);

useEffect(() => {
  if (prevValue !== value) {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  }
}, [value, prevValue]);

return (
  <div className={cn(
    "transition-colors duration-300",
    flash && "bg-cyan-500/20"
  )}>
    {value}
  </div>
);

// Color based on direction
const color = useMemo(() => {
  if (prevValue === undefined) return 'text-foreground';
  return value > prevValue ? 'text-green-400' : 'text-red-400';
}, [value, prevValue]);

// Animated counter
import { animate } from 'framer-motion';

useEffect(() => {
  const controls = animate(prevValue || 0, value, {
    duration: 0.5,
    onUpdate: (v) => setDisplayValue(v.toFixed(2))
  });
  return () => controls.stop();
}, [value]);
              `.trim()}
              </code>
            </pre>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-Time Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  do: true,
                  title: "Show connection status",
                  desc: "Live indicator, last update time",
                },
                {
                  do: true,
                  title: "Throttle visual updates",
                  desc: "Limit to ~60fps for performance",
                },
                {
                  do: true,
                  title: "Provide pause controls",
                  desc: "Let users stop distracting updates",
                },
                {
                  do: true,
                  title: "Show stale data warnings",
                  desc: "Indicate when data is outdated",
                },
                {
                  do: false,
                  title: "Constant flashing",
                  desc: "Can cause visual overload",
                },
                {
                  do: false,
                  title: "Sound on every update",
                  desc: "Reserve for important alerts",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    item.do ? "bg-green-500/10" : "bg-red-500/10"
                  }`}
                >
                  {item.do ? (
                    <TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold">{item.title}</span>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// LOADING STATES
// ============================================================================

export const ChartLoadingStates: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chart Loading States</h2>
        <p className="text-muted-foreground mb-6">
          Skeleton patterns for charts while data loads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Area Chart Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Area Chart Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative bg-black/20 rounded-lg overflow-hidden">
              {/* Animated gradient skeleton */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
              {/* Fake axis */}
              <div className="absolute bottom-4 left-4 right-4 h-px bg-white/10" />
              <div className="absolute left-4 bottom-4 top-4 w-px bg-white/10" />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Table Loading</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 rounded bg-white/5 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skeleton Component</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
interface ChartSkeletonProps {
  height?: number;
  showAxis?: boolean;
}

export function ChartSkeleton({ 
  height = 200, 
  showAxis = true 
}: ChartSkeletonProps) {
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-black/20"
      style={{ height }}
    >
      {/* Shimmer effect */}
      <div 
        className="absolute inset-0 animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          backgroundSize: '200% 100%',
        }}
      />
      
      {showAxis && (
        <>
          {/* X axis */}
          <div className="absolute bottom-4 left-12 right-4 h-px bg-white/10" />
          {/* Y axis */}
          <div className="absolute left-4 bottom-4 top-4 w-px bg-white/10" />
        </>
      )}
    </div>
  );
}

// CSS for shimmer
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// Add shimmer keyframes
const style = document.createElement("style");
style.textContent = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}
