import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../core/label";
import { Input } from "../core/input";
import { Checkbox } from "../forms/checkbox";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs", "stable"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label>Email Address</Label>,
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

// Trading-specific examples
export const FormLabels: Story = {
  name: "Trading Form Labels",
  render: () => (
    <div className="max-w-sm space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="amount">
          Amount <span className="text-destructive">*</span>
        </Label>
        <Input id="amount" type="number" placeholder="0.00" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="slippage">Slippage Tolerance</Label>
        <Input id="slippage" type="number" placeholder="0.5" />
        <p className="text-xs text-muted-foreground">
          Your transaction will revert if the price changes more than this percentage.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="recipient" className="flex items-center gap-2">
          Recipient Address
          <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input id="recipient" placeholder="0x..." />
      </div>
    </div>
  ),
};

export const RequiredLabel: Story = {
  name: "Required Field",
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="wallet">
        Wallet Address <span className="text-destructive">*</span>
      </Label>
      <Input id="wallet" placeholder="0x..." required />
    </div>
  ),
};

export const DisabledLabel: Story = {
  name: "Disabled Field",
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="locked" className="text-muted-foreground">
        Locked Amount
      </Label>
      <Input id="locked" value="1,000 SKAI" disabled />
      <p className="text-xs text-muted-foreground">
        This amount is locked until 2025-12-31
      </p>
    </div>
  ),
};

export const LabelWithTooltip: Story = {
  name: "Label with Info",
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="impact" className="flex items-center gap-1">
        Price Impact
        <span
          className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-xs"
          title="The difference between market price and estimated price due to trade size"
        >
          ?
        </span>
      </Label>
      <Input id="impact" value="0.05%" disabled />
    </div>
  ),
};
