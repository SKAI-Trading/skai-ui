import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator, StatusWithLabel, ConnectionStatus } from "../components/trading/status-indicator";

const meta: Meta<typeof StatusIndicator> = {
  title: "Trading/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Status indicator dots for showing connection state, user status, or system health.",
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["online", "offline", "away", "busy", "connecting", "error"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    pulse: {
      control: "boolean",
      description: "Animate with pulse effect",
    },
    glow: {
      control: "boolean",
      description: "Add glow effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Online: Story = {
  args: {
    status: "online",
    glow: true,
  },
};

export const Offline: Story = {
  args: {
    status: "offline",
  },
};

export const Connecting: Story = {
  args: {
    status: "connecting",
    pulse: true,
  },
};

export const AllStatuses: Story = {
  name: "All Statuses",
  render: () => (
    <div className="flex flex-wrap gap-6">
      <StatusWithLabel status="online" label="Online" />
      <StatusWithLabel status="offline" label="Offline" />
      <StatusWithLabel status="away" label="Away" />
      <StatusWithLabel status="busy" label="Busy" />
      <StatusWithLabel status="connecting" label="Connecting" pulse />
      <StatusWithLabel status="error" label="Error" />
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <StatusIndicator status="online" size="xs" />
        <p className="text-xs text-muted-foreground mt-1">xs</p>
      </div>
      <div className="text-center">
        <StatusIndicator status="online" size="sm" />
        <p className="text-xs text-muted-foreground mt-1">sm</p>
      </div>
      <div className="text-center">
        <StatusIndicator status="online" size="md" />
        <p className="text-xs text-muted-foreground mt-1">md</p>
      </div>
      <div className="text-center">
        <StatusIndicator status="online" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">lg</p>
      </div>
      <div className="text-center">
        <StatusIndicator status="online" size="xl" />
        <p className="text-xs text-muted-foreground mt-1">xl</p>
      </div>
    </div>
  ),
};

export const WithGlow: Story = {
  name: "With Glow Effect",
  render: () => (
    <div className="flex gap-6 p-4 bg-background/50">
      <StatusIndicator status="online" glow size="lg" />
      <StatusIndicator status="busy" glow size="lg" />
      <StatusIndicator status="away" glow size="lg" />
      <StatusIndicator status="connecting" glow pulse size="lg" />
    </div>
  ),
};

export const ConnectionStatusVariant: Story = {
  name: "Connection Status",
  render: () => (
    <div className="space-y-4">
      <ConnectionStatus status="connected" network="Ethereum Mainnet" />
      <ConnectionStatus status="connecting" network="Base" />
      <ConnectionStatus status="disconnected" network="No Network" />
      <ConnectionStatus status="error" network="Connection Failed" />
    </div>
  ),
};

export const TradingContext: Story = {
  name: "Trading Context",
  render: () => (
    <div className="p-4 bg-card rounded-lg border w-[300px]">
      <h3 className="font-semibold mb-3">System Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Blockchain</span>
          <StatusWithLabel status="online" label="Connected" size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price Feed</span>
          <StatusWithLabel status="online" label="Live" size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Order Engine</span>
          <StatusWithLabel status="away" label="Degraded" size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Backup Node</span>
          <StatusWithLabel status="offline" label="Standby" size="sm" />
        </div>
      </div>
    </div>
  ),
};
