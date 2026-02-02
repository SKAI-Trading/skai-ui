import type { Meta, StoryObj } from "@storybook/react";
import { PnLDisplay, PnLCard } from "../components/trading/pnl-display";

const meta: Meta<typeof PnLDisplay> = {
  title: "Trading/PnLDisplay",
  component: PnLDisplay,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Display profit/loss values with automatic color coding. Green for profit, red for loss, gray for breakeven.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "number" },
      description: "PnL value (positive = profit, negative = loss)",
    },
    percentage: {
      control: { type: "number" },
      description: "Optional percentage change",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    currency: {
      control: "text",
      description: "Currency symbol",
    },
    label: {
      control: "text",
      description: "Optional label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PnLDisplay>;

export const Profit: Story = {
  args: {
    value: 1234.56,
    percentage: 12.5,
  },
};

export const Loss: Story = {
  args: {
    value: -567.89,
    percentage: -4.2,
  },
};

export const Breakeven: Story = {
  args: {
    value: 0.005,
    percentage: 0.01,
  },
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex flex-col gap-4">
      <PnLDisplay value={1234.56} percentage={12.5} size="sm" label="Small" />
      <PnLDisplay value={1234.56} percentage={12.5} size="md" label="Medium" />
      <PnLDisplay value={1234.56} percentage={12.5} size="lg" label="Large" />
      <PnLDisplay value={1234.56} percentage={12.5} size="xl" label="XL" />
    </div>
  ),
};

export const WithCard: Story = {
  name: "PnL Card",
  render: () => (
    <div className="grid w-[400px] grid-cols-2 gap-4">
      <PnLCard title="Today" value={234.56} percentage={3.2} />
      <PnLCard title="This Week" value={-89.12} percentage={-1.5} />
      <PnLCard title="This Month" value={1567.89} percentage={8.7} />
      <PnLCard title="All Time" value={12450.0} percentage={45.2} />
    </div>
  ),
};

export const TradingContext: Story = {
  name: "Trading Context",
  render: () => (
    <div className="w-[300px] space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Position PnL</span>
        <PnLDisplay value={456.78} percentage={5.6} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Unrealized</span>
        <PnLDisplay value={-123.45} percentage={-2.1} />
      </div>
      <div className="flex items-center justify-between border-t pt-4">
        <span className="font-medium">Total</span>
        <PnLDisplay value={333.33} percentage={3.5} size="lg" />
      </div>
    </div>
  ),
};
