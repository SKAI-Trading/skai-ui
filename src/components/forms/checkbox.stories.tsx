import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../forms/checkbox";
import { Label } from "../core/label";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs", "stable"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Already checked</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
    </div>
  ),
};

// Trading-specific examples
export const AgreementCheckboxes: Story = {
  name: "Trading Agreements",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold text-lg">Confirm Trade</h3>
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="slippage" className="mt-1" />
          <Label htmlFor="slippage" className="text-sm leading-relaxed">
            I understand that the final price may differ due to slippage
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="fees" className="mt-1" />
          <Label htmlFor="fees" className="text-sm leading-relaxed">
            I accept the network fees associated with this transaction
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="risks" className="mt-1" />
          <Label htmlFor="risks" className="text-sm leading-relaxed">
            I acknowledge the risks of trading digital assets
          </Label>
        </div>
      </div>
    </div>
  ),
};

export const NotificationSettings: Story = {
  name: "Notification Preferences",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold text-lg">Notifications</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="price-alerts">Price alerts</Label>
          <Checkbox id="price-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="trade-complete">Trade completion</Label>
          <Checkbox id="trade-complete" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="news">Market news</Label>
          <Checkbox id="news" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="promo">Promotional offers</Label>
          <Checkbox id="promo" />
        </div>
      </div>
    </div>
  ),
};

export const FilterOptions: Story = {
  name: "Token Filters",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-sm">
      <h3 className="font-semibold">Filter Tokens</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="verified" defaultChecked />
          <Label htmlFor="verified">Verified only</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="stablecoins" />
          <Label htmlFor="stablecoins">Stablecoins</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="memecoins" />
          <Label htmlFor="memecoins">Memecoins</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="defi" defaultChecked />
          <Label htmlFor="defi">DeFi tokens</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="nft" />
          <Label htmlFor="nft">NFT tokens</Label>
        </div>
      </div>
    </div>
  ),
};
