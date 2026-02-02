import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../forms/switch";
import { Label } from "../core/label";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the switch is on",
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="default" />
      <Label htmlFor="default">Toggle setting</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked />
      <Label htmlFor="checked">Enabled</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off">Disabled (off)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on">Disabled (on)</Label>
      </div>
    </div>
  ),
};

// Trading-specific examples
export const TradingSettings: Story = {
  name: "Trading Settings",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold text-lg">Trading Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-slippage">Auto slippage</Label>
            <p className="text-xs text-muted-foreground">
              Automatically adjust slippage based on market conditions
            </p>
          </div>
          <Switch id="auto-slippage" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="expert-mode">Expert mode</Label>
            <p className="text-xs text-muted-foreground">
              Disable transaction confirmations
            </p>
          </div>
          <Switch id="expert-mode" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="multihop">Multi-hop trades</Label>
            <p className="text-xs text-muted-foreground">
              Allow routing through multiple pools
            </p>
          </div>
          <Switch id="multihop" defaultChecked />
        </div>
      </div>
    </div>
  ),
};

export const NotificationToggles: Story = {
  name: "Notification Toggles",
  render: () => (
    <div className="space-y-4 p-4 border rounded-lg max-w-md">
      <h3 className="font-semibold text-lg">Notifications</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Price alerts</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Trade confirmations</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Whale activity</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Portfolio updates</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">Marketing emails</span>
          <Switch />
        </div>
      </div>
    </div>
  ),
};

export const DarkModeToggle: Story = {
  name: "Theme Toggle",
  render: () => (
    <div className="flex items-center justify-between p-4 border rounded-lg max-w-sm">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">🌙</span>
        <div>
          <p className="font-medium">Dark Mode</p>
          <p className="text-xs text-muted-foreground">
            Toggle dark/light theme
          </p>
        </div>
      </div>
      <Switch defaultChecked />
    </div>
  ),
};
