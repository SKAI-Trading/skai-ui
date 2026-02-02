import type { Meta, StoryObj } from "@storybook/react";
import {
  DockContainer,
  DockIcon,
  SimpleDockIcon,
} from "../components/dock-icon";
import {
  Home,
  Settings,
  Wallet,
  TrendingUp,
  Gamepad2,
  MessageSquare,
  User,
} from "lucide-react";

const meta: Meta<typeof DockIcon> = {
  title: "Navigation/DockIcon",
  component: DockIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "macOS-style dock icons with magnification effect. Perfect for navigation bars and toolbars.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Tooltip label for the icon",
    },
    isActive: {
      control: "boolean",
      description: "Whether this icon is currently active",
    },
    showNotification: {
      control: "boolean",
      description: "Show notification badge",
    },
    notificationCount: {
      control: { type: "number", min: 0, max: 99 },
      description: "Number to display in notification badge",
    },
    disabled: {
      control: "boolean",
      description: "Whether the icon is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DockIcon>;

/**
 * Basic dock icon
 */
export const Default: Story = {
  render: () => (
    <DockContainer>
      <DockIcon label="Home">
        <Home className="h-6 w-6" />
      </DockIcon>
    </DockContainer>
  ),
};

/**
 * Active dock icon (highlighted)
 */
export const ActiveState: Story = {
  render: () => (
    <DockContainer>
      <DockIcon label="Trade" isActive>
        <TrendingUp className="h-6 w-6" />
      </DockIcon>
    </DockContainer>
  ),
};

/**
 * With notification badge
 */
export const WithNotification: Story = {
  render: () => (
    <DockContainer>
      <DockIcon label="Messages" showNotification notificationCount={3}>
        <MessageSquare className="h-6 w-6" />
      </DockIcon>
    </DockContainer>
  ),
};

/**
 * Complete navigation dock
 */
export const CompleteDock: Story = {
  render: () => (
    <DockContainer className="bg-background/80 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
      <DockIcon label="Home">
        <Home className="h-6 w-6" />
      </DockIcon>
      <DockIcon label="Trade" isActive>
        <TrendingUp className="h-6 w-6" />
      </DockIcon>
      <DockIcon label="Wallet">
        <Wallet className="h-6 w-6" />
      </DockIcon>
      <DockIcon label="Play">
        <Gamepad2 className="h-6 w-6" />
      </DockIcon>
      <DockIcon label="Messages" showNotification notificationCount={5}>
        <MessageSquare className="h-6 w-6" />
      </DockIcon>
      <DockIcon label="Profile">
        <User className="h-6 w-6" />
      </DockIcon>
      <DockIcon label="Settings">
        <Settings className="h-6 w-6" />
      </DockIcon>
    </DockContainer>
  ),
};

/**
 * Simple dock icon (no magnification)
 */
export const SimpleDock: Story = {
  render: () => (
    <div className="flex gap-4 p-4 bg-background/80 backdrop-blur-sm border border-white/10 rounded-lg">
      <SimpleDockIcon label="Home">
        <Home className="h-5 w-5" />
      </SimpleDockIcon>
      <SimpleDockIcon label="Trade" isActive>
        <TrendingUp className="h-5 w-5" />
      </SimpleDockIcon>
      <SimpleDockIcon label="Settings">
        <Settings className="h-5 w-5" />
      </SimpleDockIcon>
    </div>
  ),
};

/**
 * Disabled icon
 */
export const DisabledIcon: Story = {
  render: () => (
    <DockContainer>
      <DockIcon label="Wallet (Connect First)" disabled>
        <Wallet className="h-6 w-6" />
      </DockIcon>
    </DockContainer>
  ),
};
