import type { Meta, StoryObj } from "@storybook/react";
import { MobileNav, type MobileNavItem } from "../components/navigation/mobile-nav";
import {
  Home,
  LineChart,
  Wallet,
  Settings,
  Gamepad2,
  Repeat,
  Bot,
  Bell,
} from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof MobileNav> = {
  title: "Navigation/MobileNav",
  component: MobileNav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Bottom navigation bar for mobile devices. Fixed to bottom on mobile, hidden on desktop. Supports badges, active states, and custom link components.",
      },
    },
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "glass", "floating"],
    },
    safeArea: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-[600px] overflow-hidden rounded-lg border bg-background">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Mobile navigation preview. The nav bar is fixed at the bottom.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileNav>;

const basicItems: MobileNavItem[] = [
  { id: "home", label: "Home", icon: <Home className="h-5 w-5" />, href: "/" },
  {
    id: "trade",
    label: "Trade",
    icon: <LineChart className="h-5 w-5" />,
    href: "/trade",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: <Wallet className="h-5 w-5" />,
    href: "/wallet",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
    activeItem: "home",
  },
};

export const GlassVariant: Story = {
  name: "Glass Variant",
  args: {
    items: basicItems,
    activeItem: "trade",
    variant: "glass",
  },
};

export const FloatingVariant: Story = {
  name: "Floating Variant",
  args: {
    items: basicItems,
    activeItem: "wallet",
    variant: "floating",
  },
};

export const WithBadges: Story = {
  name: "With Badges",
  args: {
    items: [
      { id: "home", label: "Home", icon: <Home className="h-5 w-5" />, href: "/" },
      {
        id: "trade",
        label: "Trade",
        icon: <LineChart className="h-5 w-5" />,
        href: "/trade",
      },
      {
        id: "notifications",
        label: "Alerts",
        icon: <Bell className="h-5 w-5" />,
        href: "/alerts",
        badge: 3,
      },
      {
        id: "wallet",
        label: "Wallet",
        icon: <Wallet className="h-5 w-5" />,
        href: "/wallet",
        badgeDot: true,
      },
    ],
    activeItem: "home",
  },
};

export const TradingApp: Story = {
  name: "Trading App Navigation",
  render: () => {
    const ControlledNav = () => {
      const [active, setActive] = useState("trade");

      const items: MobileNavItem[] = [
        { id: "home", label: "Home", icon: <Home className="h-5 w-5" />, href: "/" },
        {
          id: "trade",
          label: "Trade",
          icon: <Repeat className="h-5 w-5" />,
          href: "/trade",
        },
        {
          id: "play",
          label: "Play",
          icon: <Gamepad2 className="h-5 w-5" />,
          href: "/play",
          badge: "NEW",
        },
        { id: "ai", label: "AI", icon: <Bot className="h-5 w-5" />, href: "/ai" },
        {
          id: "wallet",
          label: "Wallet",
          icon: <Wallet className="h-5 w-5" />,
          href: "/wallet",
        },
      ];

      return (
        <MobileNav
          items={items}
          activeItem={active}
          onItemSelect={(item) => setActive(item.id)}
          variant="glass"
        />
      );
    };

    return <ControlledNav />;
  },
};

export const FiveItems: Story = {
  name: "Five Items (Max Recommended)",
  args: {
    items: [
      { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
      { id: "trade", label: "Trade", icon: <LineChart className="h-5 w-5" /> },
      { id: "play", label: "Play", icon: <Gamepad2 className="h-5 w-5" /> },
      { id: "ai", label: "AI", icon: <Bot className="h-5 w-5" /> },
      { id: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" /> },
    ],
    activeItem: "play",
    variant: "default",
  },
};

export const WithSafeArea: Story = {
  name: "With Safe Area (iOS)",
  args: {
    items: basicItems,
    activeItem: "home",
    safeArea: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Adds extra padding at the bottom for iOS devices with home indicator.",
      },
    },
  },
};

export const InteractiveDemo: Story = {
  name: "Interactive Demo",
  render: () => {
    const InteractiveNav = () => {
      const [active, setActive] = useState("home");

      const items: MobileNavItem[] = [
        { id: "home", label: "Home", icon: <Home className="h-5 w-5" /> },
        { id: "trade", label: "Trade", icon: <LineChart className="h-5 w-5" /> },
        { id: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" /> },
        { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
      ];

      const content: Record<string, string> = {
        home: "Welcome to SKAI Trading! Your gateway to DeFi.",
        trade: "Execute swaps, limit orders, and view charts.",
        wallet: "Manage your portfolio and track balances.",
        settings: "Configure your trading preferences.",
      };

      return (
        <>
          <div className="p-6 pb-24">
            <h2 className="mb-2 text-xl font-bold capitalize">{active}</h2>
            <p className="text-muted-foreground">{content[active]}</p>
          </div>
          <MobileNav
            items={items}
            activeItem={active}
            onItemSelect={(item) => setActive(item.id)}
          />
        </>
      );
    };

    return <InteractiveNav />;
  },
};
