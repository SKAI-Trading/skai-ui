import type { Meta, StoryObj } from "@storybook/react";
import { LazyChart } from "../components/lazy-chart";

const meta: Meta<typeof LazyChart> = {
  title: "Data Display/LazyChart",
  component: LazyChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The LazyChart component provides a wrapper around recharts that dynamically loads the library.
This can save ~400KB from the initial bundle.

## Features
- Line, Area, and Bar chart types
- Multiple data series support
- Custom colors
- Grid, tooltip, and legend options
- Loading skeleton fallback
- Lazy loaded for performance
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LazyChart>;

const generatePriceData = () => {
  const data = [];
  let price = 50000;
  for (let i = 0; i < 30; i++) {
    price += (Math.random() - 0.5) * 1000;
    data.push({
      time: `Day ${i + 1}`,
      price: Math.round(price),
    });
  }
  return data;
};

const generateVolumeData = () => {
  const data = [];
  for (let i = 0; i < 12; i++) {
    data.push({
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
      buy: Math.round(Math.random() * 1000 + 500),
      sell: Math.round(Math.random() * 800 + 300),
    });
  }
  return data;
};

export const LineChart: Story = {
  args: {
    type: "line",
    data: generatePriceData(),
    xKey: "time",
    yKeys: ["price"],
    colors: ["hsl(169, 89%, 56%)"],
    height: 300,
  },
};

export const AreaChart: Story = {
  args: {
    type: "area",
    data: generatePriceData(),
    xKey: "time",
    yKeys: ["price"],
    colors: ["hsl(200, 95%, 55%)"],
    height: 300,
  },
};

export const BarChart: Story = {
  args: {
    type: "bar",
    data: generateVolumeData(),
    xKey: "month",
    yKeys: ["buy"],
    colors: ["hsl(169, 89%, 56%)"],
    height: 300,
  },
};

export const MultipleSeries: Story = {
  args: {
    type: "area",
    data: generateVolumeData(),
    xKey: "month",
    yKeys: ["buy", "sell"],
    colors: ["hsl(169, 89%, 56%)", "hsl(0, 84%, 60%)"],
    showLegend: true,
    height: 300,
  },
};

export const WithoutGrid: Story = {
  args: {
    type: "line",
    data: generatePriceData(),
    xKey: "time",
    yKeys: ["price"],
    showGrid: false,
    height: 250,
  },
};

export const NoAnimation: Story = {
  args: {
    type: "bar",
    data: generateVolumeData(),
    xKey: "month",
    yKeys: ["buy", "sell"],
    colors: ["hsl(169, 89%, 56%)", "hsl(0, 84%, 60%)"],
    animate: false,
    height: 300,
  },
};

export const CustomHeight: Story = {
  args: {
    type: "area",
    data: generatePriceData(),
    xKey: "time",
    yKeys: ["price"],
    height: 150,
  },
};

export const TradingColors: Story = {
  args: {
    type: "bar",
    data: generateVolumeData(),
    xKey: "month",
    yKeys: ["buy", "sell"],
    colors: ["#2cecad", "#ef4444"],
    showLegend: true,
    showTooltip: true,
    height: 350,
  },
};
