import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "../forms/radio-group";
import { Label } from "../core/label";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
    </RadioGroup>
  ),
};

// Trading-specific examples
export const SlippageOptions: Story = {
  name: "Slippage Presets",
  render: () => (
    <div className="max-w-sm rounded-lg border p-4">
      <h3 className="mb-3 font-semibold">Slippage Tolerance</h3>
      <RadioGroup defaultValue="0.5" className="flex gap-2">
        {["0.1", "0.5", "1.0", "3.0"].map((value) => (
          <div key={value} className="flex-1">
            <RadioGroupItem
              value={value}
              id={`slippage-${value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`slippage-${value}`}
              className="flex cursor-pointer items-center justify-center rounded-lg border p-3 transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
            >
              {value}%
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};

export const NetworkSelector: Story = {
  name: "Network Selection",
  render: () => (
    <div className="max-w-sm rounded-lg border p-4">
      <h3 className="mb-3 font-semibold">Select Network</h3>
      <RadioGroup defaultValue="base" className="space-y-2">
        {[
          { id: "ethereum", name: "Ethereum", icon: "⟠", fee: "~$5.00" },
          { id: "base", name: "Base", icon: "🔵", fee: "~$0.01" },
          { id: "arbitrum", name: "Arbitrum", icon: "🔷", fee: "~$0.10" },
          { id: "polygon", name: "Polygon", icon: "🟣", fee: "~$0.02" },
        ].map((network) => (
          <div key={network.id} className="flex items-center">
            <RadioGroupItem
              value={network.id}
              id={network.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={network.id}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{network.icon}</span>
                <span className="font-medium">{network.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{network.fee}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};

export const OrderType: Story = {
  name: "Order Type",
  render: () => (
    <div className="max-w-md rounded-lg border p-4">
      <h3 className="mb-3 font-semibold">Order Type</h3>
      <RadioGroup defaultValue="market" className="space-y-3">
        <div className="flex items-start">
          <RadioGroupItem value="market" id="market" className="mt-1" />
          <div className="ml-3">
            <Label htmlFor="market" className="cursor-pointer font-medium">
              Market Order
            </Label>
            <p className="text-sm text-muted-foreground">
              Execute immediately at current market price
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <RadioGroupItem value="limit" id="limit" className="mt-1" />
          <div className="ml-3">
            <Label htmlFor="limit" className="cursor-pointer font-medium">
              Limit Order
            </Label>
            <p className="text-sm text-muted-foreground">
              Execute when price reaches your target
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <RadioGroupItem value="stop" id="stop" className="mt-1" />
          <div className="ml-3">
            <Label htmlFor="stop" className="cursor-pointer font-medium">
              Stop Loss
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically sell if price drops below threshold
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const TimeframeSelector: Story = {
  name: "Chart Timeframe",
  render: () => (
    <div className="rounded-lg border p-4">
      <RadioGroup defaultValue="1D" className="flex gap-1">
        {["1H", "4H", "1D", "1W", "1M", "ALL"].map((tf) => (
          <div key={tf}>
            <RadioGroupItem value={tf} id={`tf-${tf}`} className="peer sr-only" />
            <Label
              htmlFor={`tf-${tf}`}
              className="flex cursor-pointer items-center justify-center rounded border px-3 py-1.5 text-sm transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
            >
              {tf}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};

export const GasSpeed: Story = {
  name: "Gas Speed",
  render: () => (
    <div className="max-w-sm rounded-lg border p-4">
      <h3 className="mb-3 font-semibold">Transaction Speed</h3>
      <RadioGroup defaultValue="standard" className="space-y-2">
        {[
          {
            id: "slow",
            name: "Slow",
            time: "~10 min",
            gwei: "5 gwei",
            price: "$0.50",
          },
          {
            id: "standard",
            name: "Standard",
            time: "~3 min",
            gwei: "15 gwei",
            price: "$1.50",
          },
          {
            id: "fast",
            name: "Fast",
            time: "~30 sec",
            gwei: "30 gwei",
            price: "$3.00",
          },
        ].map((option) => (
          <div key={option.id} className="flex items-center">
            <RadioGroupItem
              value={option.id}
              id={`gas-${option.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`gas-${option.id}`}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
            >
              <div>
                <span className="font-medium">{option.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {option.time}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm">{option.price}</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({option.gwei})
                </span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  ),
};
