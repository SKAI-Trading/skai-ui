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
    <div className="p-4 border rounded-lg max-w-sm">
      <h3 className="font-semibold mb-3">Slippage Tolerance</h3>
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
              className="flex items-center justify-center p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-muted transition-colors"
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
    <div className="p-4 border rounded-lg max-w-sm">
      <h3 className="font-semibold mb-3">Select Network</h3>
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
              className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{network.icon}</span>
                <span className="font-medium">{network.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {network.fee}
              </span>
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
    <div className="p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold mb-3">Order Type</h3>
      <RadioGroup defaultValue="market" className="space-y-3">
        <div className="flex items-start">
          <RadioGroupItem value="market" id="market" className="mt-1" />
          <div className="ml-3">
            <Label htmlFor="market" className="font-medium cursor-pointer">
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
            <Label htmlFor="limit" className="font-medium cursor-pointer">
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
            <Label htmlFor="stop" className="font-medium cursor-pointer">
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
    <div className="p-4 border rounded-lg">
      <RadioGroup defaultValue="1D" className="flex gap-1">
        {["1H", "4H", "1D", "1W", "1M", "ALL"].map((tf) => (
          <div key={tf}>
            <RadioGroupItem
              value={tf}
              id={`tf-${tf}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`tf-${tf}`}
              className="flex items-center justify-center px-3 py-1.5 text-sm border rounded cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-muted transition-colors"
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
    <div className="p-4 border rounded-lg max-w-sm">
      <h3 className="font-semibold mb-3">Transaction Speed</h3>
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
              className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary hover:bg-muted transition-colors"
            >
              <div>
                <span className="font-medium">{option.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {option.time}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm">{option.price}</span>
                <span className="text-xs text-muted-foreground ml-1">
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
