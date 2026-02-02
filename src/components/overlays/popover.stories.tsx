import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverContent, PopoverTrigger } from "../overlays/popover";
import { Button } from "../core/button";
import { Input } from "../core/input";
import { Label } from "../core/label";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Trading-specific examples
export const SlippagePopover: Story = {
  name: "Slippage Settings",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          ⚙️ 0.5%
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Slippage Tolerance</h4>
            <p className="text-sm text-muted-foreground">
              Your transaction will revert if the price changes unfavorably by
              more than this percentage.
            </p>
          </div>
          <div className="flex gap-2">
            {["0.1%", "0.5%", "1.0%"].map((v) => (
              <Button
                key={v}
                variant={v === "0.5%" ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                {v}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Custom" className="flex-1" />
            <span className="text-sm">%</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const TokenInfoPopover: Story = {
  name: "Token Info",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            E
          </div>
          <span className="font-medium">ETH</span>
          <span className="text-muted-foreground">ⓘ</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <h4 className="font-medium">Ethereum</h4>
              <p className="text-sm text-muted-foreground">ETH</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-mono">$2,145.32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Change</span>
              <span className="text-green-500">+2.34%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-mono">$257.8B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume (24h)</span>
              <span className="font-mono">$12.4B</span>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground font-mono break-all">
              Contract: 0x0000...0000 (Native)
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Chart
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Explorer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const GasFeePopover: Story = {
  name: "Gas Estimator",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          ⛽ ~$0.50
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h4 className="font-medium">Gas Estimate</h4>
          <div className="space-y-2">
            {[
              { speed: "Slow", time: "~10 min", gwei: "5", price: "$0.25" },
              { speed: "Standard", time: "~3 min", gwei: "15", price: "$0.50" },
              { speed: "Fast", time: "~30 sec", gwei: "30", price: "$1.00" },
            ].map((option) => (
              <button
                key={option.speed}
                className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                  option.speed === "Standard"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
              >
                <div>
                  <p className="font-medium">{option.speed}</p>
                  <p className="text-xs text-muted-foreground">{option.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{option.price}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.gwei} gwei
                  </p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Gas prices are estimated and may vary.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WalletAddressPopover: Story = {
  name: "Wallet Address",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <span className="font-mono">0x1234...5678</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
            <div>
              <p className="font-medium">My Wallet</p>
              <p className="text-sm text-muted-foreground">Base Network</p>
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Address</p>
            <p className="font-mono text-sm break-all">
              0x1234567890abcdef1234567890abcdef12345678
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              📋 Copy
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              🔗 Explorer
            </Button>
          </div>
          <Button size="sm" variant="destructive" className="w-full">
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
