import type { Meta, StoryObj } from "@storybook/react";
import { PriceDisplay } from "../components/trading/price-display";

const meta: Meta<typeof PriceDisplay> = {
  title: "Trading/PriceDisplay",
  component: PriceDisplay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays cryptocurrency prices with formatting, trend colors, and change percentages.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "number",
      description: "Price value",
    },
    change: {
      control: "number",
      description: "24h change percentage",
    },
    currency: {
      control: "text",
      description: "Currency code for formatting",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Text size",
    },
    showTrendIcon: {
      control: "boolean",
      description: "Whether to show trend icon",
    },
    compact: {
      control: "boolean",
      description: "Use compact notation (1.2K instead of 1,200)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 1234.56,
    currency: "USD",
  },
};

export const WithPositiveChange: Story = {
  args: {
    value: 2847.32,
    change: 5.24,
    showTrendIcon: true,
  },
};

export const WithNegativeChange: Story = {
  args: {
    value: 2847.32,
    change: -3.18,
    showTrendIcon: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PriceDisplay value={1234.56} size="sm" change={2.5} showTrendIcon />
      <PriceDisplay value={1234.56} size="md" change={2.5} showTrendIcon />
      <PriceDisplay value={1234.56} size="lg" change={2.5} showTrendIcon />
    </div>
  ),
};

export const CompactNotation: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PriceDisplay value={1234567} compact />
      <PriceDisplay value={999} compact />
      <PriceDisplay value={1234567890} compact />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Large numbers are shortened (1.2M, 1.2B) in compact mode.",
      },
    },
  },
};

export const SmallPrices: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PriceDisplay value={0.00001234} />
      <PriceDisplay value={0.000000001} />
      <PriceDisplay value={0.99} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Very small prices preserve significant digits.",
      },
    },
  },
};

export const DifferentCurrencies: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PriceDisplay value={1234.56} currency="USD" />
      <PriceDisplay value={1234.56} currency="EUR" />
      <PriceDisplay value={1234.56} currency="GBP" />
      <PriceDisplay value={1234.56} currency="JPY" />
    </div>
  ),
};
