import type { Meta, StoryObj } from "@storybook/react";
import { CandlestickChart, formatCandleData } from "../components/candlestick-chart";
import type { Time } from "lightweight-charts";

const meta: Meta<typeof CandlestickChart> = {
  title: "Trading/CandlestickChart",
  component: CandlestickChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "TradingView-style OHLC candlestick chart built on Lightweight Charts. Supports zoom, pan, crosshair, and volume overlay.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CandlestickChart>;

// Generate sample candlestick data
const generateCandleData = (days: number, startPrice: number) => {
  const data = [];
  let price = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0] as Time;
    
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * 2 * volatility;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);
    
    data.push({
      time: dateStr,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });
    
    price = close;
  }
  
  return data;
};

const generateVolumeData = (candleData: ReturnType<typeof generateCandleData>) => {
  return candleData.map((candle) => ({
    time: candle.time,
    value: Math.random() * 1000000 + 500000,
    color: candle.close >= candle.open ? "#22c55e80" : "#ef444480",
  }));
};

const sampleData = generateCandleData(90, 3200);
const volumeData = generateVolumeData(sampleData);

export const Default: Story = {
  args: {
    data: sampleData,
    height: 400,
  },
};

export const WithVolume: Story = {
  args: {
    data: sampleData,
    volumeData: volumeData,
    showVolume: true,
    height: 400,
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    height: 400,
    upColor: "#00ff88",
    downColor: "#ff4466",
    wickUpColor: "#00ff88",
    wickDownColor: "#ff4466",
  },
};

export const DarkTheme: Story = {
  args: {
    data: sampleData,
    height: 400,
    backgroundColor: "#0f172a",
    textColor: "#94a3b8",
    gridColor: "#1e293b",
  },
};

export const NoCrosshair: Story = {
  args: {
    data: sampleData,
    height: 400,
    crosshair: false,
  },
};

export const CompactHeight: Story = {
  args: {
    data: sampleData.slice(-30),
    height: 200,
  },
};

export const FullExample: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">ETH/USDT</h3>
          <p className="text-muted-foreground text-sm">Ethereum</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">$3,245.67</p>
          <p className="text-green-500 text-sm">+2.34%</p>
        </div>
      </div>
      <CandlestickChart
        data={sampleData}
        volumeData={volumeData}
        showVolume={true}
        height={350}
        backgroundColor="transparent"
      />
    </div>
  ),
};

export const BTCChart: Story = {
  render: () => {
    const btcData = generateCandleData(60, 65000);
    const btcVolume = generateVolumeData(btcData);
    
    return (
      <div className="space-y-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">BTC/USDT</h3>
            <p className="text-muted-foreground text-sm">Bitcoin</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">$65,432.10</p>
            <p className="text-red-500 text-sm">-1.23%</p>
          </div>
        </div>
        <CandlestickChart
          data={btcData}
          volumeData={btcVolume}
          showVolume={true}
          height={350}
        />
      </div>
    );
  },
};

export const WithCrosshairCallback: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Hover over the chart to see crosshair callback in action (check console)
        </p>
        <CandlestickChart
          data={sampleData}
          height={400}
          onCrosshairMove={(price, time) => {
            if (price !== null) {
              console.log(`Price: $${price.toFixed(2)}, Time: ${time}`);
            }
          }}
        />
      </div>
    );
  },
};
