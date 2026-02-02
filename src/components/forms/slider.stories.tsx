import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../forms/slider";
import { Label } from "../core/label";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "object",
      description: "Default value for the slider",
    },
    max: {
      control: "number",
      description: "Maximum value",
    },
    step: {
      control: "number",
      description: "Step increment",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">75%</span>
        </div>
        <Slider defaultValue={[75]} max={100} step={1} />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    disabled: true,
  },
};

// Trading-specific examples
export const SlippageTolerance: Story = {
  name: "Slippage Tolerance",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-sm">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="font-medium">Slippage Tolerance</Label>
          <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
            0.5%
          </span>
        </div>
        <Slider defaultValue={[0.5]} max={5} step={0.1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>5%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Your transaction will revert if the price changes unfavorably by more
        than this percentage.
      </p>
    </div>
  ),
};

export const TradePercentage: Story = {
  name: "Trade Amount Percentage",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-sm">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="font-medium">Amount to Swap</Label>
          <span className="text-lg font-bold">50%</span>
        </div>
        <Slider defaultValue={[50]} max={100} step={25} />
        <div className="flex justify-between">
          <button className="px-3 py-1 text-xs border rounded hover:bg-muted">
            25%
          </button>
          <button className="px-3 py-1 text-xs border rounded bg-primary text-primary-foreground">
            50%
          </button>
          <button className="px-3 py-1 text-xs border rounded hover:bg-muted">
            75%
          </button>
          <button className="px-3 py-1 text-xs border rounded hover:bg-muted">
            MAX
          </button>
        </div>
      </div>
      <div className="pt-2 border-t">
        <p className="text-sm text-muted-foreground">
          You will swap <span className="font-mono font-medium">0.5 ETH</span>{" "}
          (~$1,250.00)
        </p>
      </div>
    </div>
  ),
};

export const LeverageSlider: Story = {
  name: "Leverage Selector",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-sm">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="font-medium">Leverage</Label>
          <span className="text-xl font-bold text-primary">10x</span>
        </div>
        <Slider defaultValue={[10]} min={1} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1x</span>
          <span>25x</span>
          <span>50x</span>
          <span>75x</span>
          <span>100x</span>
        </div>
      </div>
      <div className="p-3 bg-destructive/10 rounded text-sm">
        <p className="text-destructive font-medium">⚠️ High Leverage Warning</p>
        <p className="text-xs text-muted-foreground mt-1">
          Higher leverage increases liquidation risk
        </p>
      </div>
    </div>
  ),
};

export const PriceRange: Story = {
  name: "Price Range (Limit Order)",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-sm">
      <h3 className="font-semibold">Set Price Range</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Min Price</Label>
            <span className="text-sm font-mono">$1,800</span>
          </div>
          <Slider defaultValue={[1800]} min={1000} max={3000} step={50} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Max Price</Label>
            <span className="text-sm font-mono">$2,500</span>
          </div>
          <Slider defaultValue={[2500]} min={1000} max={3000} step={50} />
        </div>
      </div>
      <div className="p-3 bg-muted rounded text-sm">
        <p>
          Current ETH Price: <span className="font-mono">$2,145.32</span>
        </p>
      </div>
    </div>
  ),
};
