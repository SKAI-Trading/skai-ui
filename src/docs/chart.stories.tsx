import type { Meta, StoryObj } from "@storybook/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../components/data-display/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const meta: Meta<typeof ChartContainer> = {
  title: "Components/Chart",
  component: ChartContainer,
  tags: ["autodocs", "beta"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Chart wrapper components built on Recharts. Provides consistent theming and tooltip styling for data visualization.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

// Sample data
const priceData = [
  { date: "Jan", price: 3200, volume: 1200 },
  { date: "Feb", price: 3450, volume: 1800 },
  { date: "Mar", price: 3100, volume: 1500 },
  { date: "Apr", price: 3650, volume: 2100 },
  { date: "May", price: 3800, volume: 1900 },
  { date: "Jun", price: 3550, volume: 1700 },
];

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--muted-foreground))",
  },
};

export const LineChartExample: Story = {
  name: "Line Chart",
  render: () => (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full">
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--color-price)"
            strokeWidth={2}
            dot={{ fill: "var(--color-price)" }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  ),
};

export const AreaChartExample: Story = {
  name: "Area Chart",
  render: () => (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full">
        <AreaChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--color-price)"
            fill="var(--color-price)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  ),
};

export const BarChartExample: Story = {
  name: "Bar Chart",
  render: () => (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full">
        <BarChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
};

export const MultipleLines: Story = {
  name: "Multiple Series",
  render: () => (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full">
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="var(--color-price)"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            stroke="var(--color-volume)"
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  ),
};

// Portfolio allocation data
const portfolioData = [
  { name: "ETH", value: 45, color: "#627EEA" },
  { name: "BTC", value: 30, color: "#F7931A" },
  { name: "SOL", value: 15, color: "#14F195" },
  { name: "USDC", value: 10, color: "#2775CA" },
];

const portfolioConfig = {
  ETH: { label: "Ethereum", color: "#627EEA" },
  BTC: { label: "Bitcoin", color: "#F7931A" },
  SOL: { label: "Solana", color: "#14F195" },
  USDC: { label: "USD Coin", color: "#2775CA" },
};

export const PieChartExample: Story = {
  name: "Pie Chart (Portfolio)",
  render: () => (
    <div className="h-[300px] w-full">
      <ChartContainer config={portfolioConfig} className="h-full">
        <PieChart>
          <Pie
            data={portfolioData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {portfolioData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent formatter={(value) => [`${value}%`, "Allocation"]} />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ChartContainer>
    </div>
  ),
};

// Trading performance data
const performanceData = [
  { date: "Mon", pnl: 245 },
  { date: "Tue", pnl: -120 },
  { date: "Wed", pnl: 380 },
  { date: "Thu", pnl: -85 },
  { date: "Fri", pnl: 520 },
  { date: "Sat", pnl: 180 },
  { date: "Sun", pnl: -40 },
];

const performanceConfig = {
  pnl: {
    label: "PnL",
    color: "hsl(var(--primary))",
  },
};

export const TradingPerformance: Story = {
  name: "Trading Performance",
  render: () => (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Weekly Performance</h3>
        <span className="text-sm font-medium text-green-500">+$1,080</span>
      </div>
      <div className="h-[200px]">
        <ChartContainer config={performanceConfig} className="h-full">
          <BarChart data={performanceData}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `$${Math.abs(value as number)}`,
                    (value as number) >= 0 ? "Profit" : "Loss",
                  ]}
                />
              }
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} fill="var(--color-pnl)">
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl >= 0 ? "hsl(142 76% 36%)" : "hsl(0 84% 60%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  ),
};

export const PriceHistory: Story = {
  name: "Price History Card",
  render: () => (
    <div className="max-w-lg space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">ETH/USD</h3>
          <p className="text-2xl font-bold">$3,456.78</p>
        </div>
        <span className="rounded bg-green-500/10 px-2 py-1 text-sm text-green-500">
          +5.23%
        </span>
      </div>
      <div className="h-[150px]">
        <ChartContainer config={chartConfig} className="h-full">
          <AreaChart data={priceData}>
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(142 76% 36%)"
              fill="hsl(142 76% 36%)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent formatter={(value) => [`$${value}`, "Price"]} />
              }
            />
          </AreaChart>
        </ChartContainer>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>24h Volume: $12.5B</span>
        <span>Market Cap: $415B</span>
      </div>
    </div>
  ),
};
