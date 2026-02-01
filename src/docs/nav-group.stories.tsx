import type { Meta, StoryObj } from "@storybook/react";
import { NavGroup } from "../components/nav-group";
import {
  Home,
  LineChart,
  Wallet,
  Settings,
  Users,
  FileText,
  Bell,
  Shield,
  HelpCircle,
  Gamepad2,
  Trophy,
  Zap,
} from "lucide-react";

const meta: Meta<typeof NavGroup> = {
  title: "Layout/NavGroup",
  component: NavGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Collapsible navigation groups with nested items. Perfect for sidebar navigation with expandable sections.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "bordered", "elevated"],
    },
    defaultExpanded: {
      control: "boolean",
    },
    collapsible: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavGroup>;

// Basic example
export const Default: Story = {
  args: {
    label: "Trading",
    icon: <LineChart className="h-4 w-4" />,
    items: [
      { id: "swap", label: "Swap", icon: <Zap className="h-4 w-4" /> },
      {
        id: "positions",
        label: "Positions",
        icon: <FileText className="h-4 w-4" />,
      },
      { id: "orders", label: "Orders", icon: <FileText className="h-4 w-4" /> },
    ],
    defaultExpanded: true,
  },
};

// Non-collapsible
export const NonCollapsible: Story = {
  args: {
    label: "Main Menu",
    collapsible: false,
    items: [
      { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LineChart className="h-4 w-4" />,
      },
      { id: "wallet", label: "Wallet", icon: <Wallet className="h-4 w-4" /> },
    ],
  },
};

// With badges
export const WithBadges: Story = {
  args: {
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
    badge: "5",
    defaultExpanded: true,
    items: [
      { id: "all", label: "All Notifications", badge: "12" },
      { id: "unread", label: "Unread", badge: "5" },
      { id: "mentions", label: "Mentions", badge: "2" },
      { id: "archived", label: "Archived" },
    ],
  },
};

// With active item
export const WithActiveItem: Story = {
  args: {
    label: "Games",
    icon: <Gamepad2 className="h-4 w-4" />,
    defaultExpanded: true,
    items: [
      { id: "hilo", label: "HiLo", icon: <Zap className="h-4 w-4" /> },
      {
        id: "prediction",
        label: "Prediction",
        icon: <LineChart className="h-4 w-4" />,
        active: true,
      },
      {
        id: "tournament",
        label: "Tournament",
        icon: <Trophy className="h-4 w-4" />,
      },
    ],
  },
};

// Muted variant
export const MutedVariant: Story = {
  args: {
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    variant: "muted",
    defaultExpanded: true,
    items: [
      { id: "profile", label: "Profile", icon: <Users className="h-4 w-4" /> },
      {
        id: "security",
        label: "Security",
        icon: <Shield className="h-4 w-4" />,
      },
      { id: "help", label: "Help", icon: <HelpCircle className="h-4 w-4" /> },
    ],
  },
};

// Bordered variant
export const BorderedVariant: Story = {
  args: {
    label: "Resources",
    icon: <FileText className="h-4 w-4" />,
    variant: "bordered",
    defaultExpanded: true,
    items: [
      { id: "docs", label: "Documentation" },
      { id: "api", label: "API Reference" },
      { id: "changelog", label: "Changelog" },
    ],
  },
};

// Multiple groups
export const MultipleGroups: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <NavGroup
        label="Trading"
        icon={<LineChart className="h-4 w-4" />}
        defaultExpanded
        items={[
          { id: "swap", label: "Swap" },
          { id: "limit", label: "Limit Orders" },
          { id: "positions", label: "Positions", badge: "3" },
        ]}
      />
      <NavGroup
        label="Games"
        icon={<Gamepad2 className="h-4 w-4" />}
        items={[
          { id: "hilo", label: "HiLo" },
          { id: "prediction", label: "Prediction" },
          { id: "slots", label: "Slots", badge: "New" },
        ]}
      />
      <NavGroup
        label="Settings"
        icon={<Settings className="h-4 w-4" />}
        items={[
          { id: "profile", label: "Profile" },
          { id: "security", label: "Security" },
          { id: "notifications", label: "Notifications" },
        ]}
      />
    </div>
  ),
};

// Sidebar simulation
export const SidebarSimulation: Story = {
  render: () => (
    <div className="w-64 p-4 bg-card rounded-lg border space-y-1">
      <NavGroup
        collapsible={false}
        items={[
          {
            id: "home",
            label: "Home",
            icon: <Home className="h-4 w-4" />,
            active: true,
          },
          {
            id: "dashboard",
            label: "Dashboard",
            icon: <LineChart className="h-4 w-4" />,
          },
        ]}
      />
      <div className="h-px bg-border my-2" />
      <NavGroup
        label="Trading"
        icon={<LineChart className="h-4 w-4" />}
        defaultExpanded
        items={[
          { id: "swap", label: "Swap" },
          { id: "limit", label: "Limit Orders" },
          { id: "positions", label: "Positions", badge: "3" },
        ]}
      />
      <NavGroup
        label="Games"
        icon={<Gamepad2 className="h-4 w-4" />}
        badge="Hot"
        items={[
          { id: "hilo", label: "HiLo" },
          { id: "prediction", label: "Prediction" },
        ]}
      />
      <div className="h-px bg-border my-2" />
      <NavGroup
        collapsible={false}
        items={[
          {
            id: "settings",
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
          },
          {
            id: "help",
            label: "Help",
            icon: <HelpCircle className="h-4 w-4" />,
          },
        ]}
      />
    </div>
  ),
};
