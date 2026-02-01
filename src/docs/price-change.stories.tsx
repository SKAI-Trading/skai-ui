import type { Meta, StoryObj } from "@storybook/react";
import {
  PriceChange,
  PercentageChange,
  USDChange,
} from "../components/price-change";
import { PnLDisplay, UnrealizedPnL } from "../components/pnl-display";

const meta: Meta<typeof PriceChange> = {
  title: "Trading/PriceChange",
  component: PriceChange,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriceChange>;

export const Positive: Story = {
  args: {
    value: 5.25,
  },
};

export const Negative: Story = {
  args: {
    value: -3.45,
  },
};

export const Neutral: Story = {
  args: {
    value: 0,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Positive:</span>
        <PriceChange value={12.5} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Negative:</span>
        <PriceChange value={-8.2} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm text-muted-foreground">Neutral:</span>
        <PriceChange value={0} />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <PriceChange value={5.5} size="xs" />
      <PriceChange value={5.5} size="sm" />
      <PriceChange value={5.5} size="md" />
      <PriceChange value={5.5} size="lg" />
      <PriceChange value={5.5} size="xl" />
    </div>
  ),
};

export const USDFormat: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <USDChange value={1500.5} />
      <USDChange value={-250.25} />
    </div>
  ),
};

export const CustomDecimals: Story = {
  args: {
    value: 5.12345,
    decimals: 4,
  },
};

export const NoIcon: Story = {
  args: {
    value: 7.5,
    showIcon: false,
  },
};

export const InvertedColors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        Regular (green = profit):
      </span>
      <PriceChange value={5} />
      <span className="text-sm text-muted-foreground mt-2">
        Inverted (green = loss, for shorts):
      </span>
      <PriceChange value={5} invertColors />
    </div>
  ),
};

// PnL Display stories
export const PnLPositive: Story = {
  render: () => <PnLDisplay value={1250.5} percentage={15.2} />,
};

export const PnLNegative: Story = {
  render: () => <PnLDisplay value={-450.25} percentage={-8.5} />,
};

export const PnLWithLabel: Story = {
  render: () => <PnLDisplay value={500} percentage={10} label="Daily P&L:" />,
};

export const UnrealizedPnLDisplay: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <UnrealizedPnL value={1200} percentage={12.5} isUnrealized />
      <PnLDisplay value={800} percentage={8.5} label="Realized:" />
    </div>
  ),
};

export const PnLSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <PnLDisplay value={500} size="sm" />
      <PnLDisplay value={500} size="md" />
      <PnLDisplay value={500} size="lg" />
      <PnLDisplay value={500} size="xl" />
    </div>
  ),
};
