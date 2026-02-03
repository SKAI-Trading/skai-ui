import type { Meta, StoryObj } from "@storybook/react";
import {
  DockBar,
  DockBarIcon,
} from "../components/navigation/dock-bar";
import {
  MessageSquare,
  Settings,
  Wallet,
  Bell,
  Bot,
  Gamepad2,
  LineChart,
  HelpCircle,
} from "lucide-react";

const meta: Meta<typeof DockBar> = {
  title: "Navigation/DockBar",
  component: DockBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Bottom bar with ticker tape and dock icons. Combines scrolling price ticker with quick-action dock icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "solid", "glass", "transparent"],
    },
    safeArea: {
      control: "boolean",
    },
    fullWidthTicker: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] overflow-hidden rounded-lg border bg-background">
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Dock bar preview. The bar is fixed at the bottom.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DockBar>;

const MockTicker = () => (
  <div className="animate-marquee flex items-center gap-4 whitespace-nowrap">
    <span className="text-sm">
      <span className="text-muted-foreground">BTC</span>{" "}
      <span className="text-green-500">$43,521.00 +2.4%</span>
    </span>
    <span className="text-sm">
      <span className="text-muted-foreground">ETH</span>{" "}
      <span className="text-green-500">$2,250.00 +3.1%</span>
    </span>
    <span className="text-sm">
      <span className="text-muted-foreground">SOL</span>{" "}
      <span className="text-red-500">$98.50 -1.2%</span>
    </span>
    <span className="text-sm">
      <span className="text-muted-foreground">SKAI</span>{" "}
      <span className="text-green-500">$0.50 +15.3%</span>
    </span>
  </div>
);

const DockIcons = () => (
  <div className="flex items-center gap-1">
    <DockBarIcon icon={<MessageSquare className="h-4 w-4" />} label="Chat" />
    <DockBarIcon icon={<Bell className="h-4 w-4" />} label="Alerts" badge={3} />
    <DockBarIcon icon={<Settings className="h-4 w-4" />} label="Settings" />
  </div>
);

export const Default: Story = {
  args: {
    ticker: <MockTicker />,
    dock: <DockIcons />,
  },
};

export const GlassVariant: Story = {
  name: "Glass Variant",
  args: {
    variant: "glass",
    ticker: <MockTicker />,
    dock: <DockIcons />,
  },
};

export const SolidVariant: Story = {
  name: "Solid Variant",
  args: {
    variant: "solid",
    ticker: <MockTicker />,
    dock: <DockIcons />,
  },
};

export const DockOnly: Story = {
  name: "Dock Icons Only",
  args: {
    dock: (
      <div className="flex w-full items-center justify-center gap-1">
        <DockBarIcon icon={<LineChart className="h-4 w-4" />} label="Trade" />
        <DockBarIcon icon={<Gamepad2 className="h-4 w-4" />} label="Play" />
        <DockBarIcon icon={<Bot className="h-4 w-4" />} label="AI" />
        <DockBarIcon icon={<Wallet className="h-4 w-4" />} label="Wallet" />
        <DockBarIcon icon={<MessageSquare className="h-4 w-4" />} label="Chat" />
      </div>
    ),
  },
};

export const TickerOnly: Story = {
  name: "Ticker Only (Full Width)",
  args: {
    ticker: <MockTicker />,
    fullWidthTicker: true,
  },
};

export const WithCenter: Story = {
  name: "With Center Content",
  args: {
    ticker: <MockTicker />,
    center: (
      <div className="flex items-center gap-2 px-4">
        <span className="text-xs text-muted-foreground">Portfolio:</span>
        <span className="text-sm font-medium text-green-500">+$1,234.56</span>
      </div>
    ),
    dock: <DockIcons />,
  },
};

export const TradingPlatform: Story = {
  name: "Trading Platform Example",
  args: {
    variant: "glass",
    ticker: (
      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
        {[
          { symbol: "BTC/USD", price: "$43,521", change: "+2.4%" },
          { symbol: "ETH/USD", price: "$2,250", change: "+3.1%" },
          { symbol: "SOL/USD", price: "$98.50", change: "-1.2%" },
          { symbol: "SKAI/USD", price: "$0.50", change: "+15.3%" },
          { symbol: "AVAX/USD", price: "$35.20", change: "+0.8%" },
        ].map((item) => (
          <span key={item.symbol} className="flex items-center gap-2 text-sm">
            <span className="font-medium">{item.symbol}</span>
            <span className="text-muted-foreground">{item.price}</span>
            <span
              className={
                item.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }
            >
              {item.change}
            </span>
          </span>
        ))}
      </div>
    ),
    dock: (
      <div className="flex items-center gap-1">
        <DockBarIcon icon={<Bot className="h-4 w-4" />} label="AI Assistant" />
        <DockBarIcon icon={<MessageSquare className="h-4 w-4" />} label="Support" />
        <DockBarIcon icon={<HelpCircle className="h-4 w-4" />} label="Help" />
        <DockBarIcon icon={<Settings className="h-4 w-4" />} label="Settings" />
      </div>
    ),
    safeArea: true,
  },
};

export const WithBadges: Story = {
  name: "With Badge Indicators",
  args: {
    ticker: <MockTicker />,
    dock: (
      <div className="flex items-center gap-1">
        <DockBarIcon
          icon={<MessageSquare className="h-4 w-4" />}
          label="Chat"
          badge={5}
        />
        <DockBarIcon
          icon={<Bell className="h-4 w-4" />}
          label="Alerts"
          badge="!"
          badgeVariant="destructive"
        />
        <DockBarIcon
          icon={<Wallet className="h-4 w-4" />}
          label="Wallet"
          badge="NEW"
          badgeVariant="primary"
        />
        <DockBarIcon icon={<Settings className="h-4 w-4" />} label="Settings" />
      </div>
    ),
  },
};
