import type { Meta, StoryObj } from "@storybook/react";
import { TradingLayout, TradingPanel } from "../components/trading-layout";
import {
  TrendingUp,
  TrendingDown,
  Settings,
  Maximize2,
  LayoutGrid,
} from "lucide-react";

const meta: Meta<typeof TradingLayout> = {
  title: "Layout/TradingLayout",
  component: TradingLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Full-height trading view layout optimized for financial applications.

## Features
- Full viewport height (no scroll on main container)
- Optional left/right sidebars for watchlist, order book, etc.
- Configurable sidebar widths
- Header and footer slots
- TradingPanel component for consistent panel styling

## Usage
\`\`\`tsx
import { TradingLayout, TradingPanel } from "@skai/ui";

<TradingLayout
  header={<Header />}
  leftSidebar={<TradingPanel title="Watchlist">...</TradingPanel>}
  rightSidebar={<TradingPanel title="Order Book">...</TradingPanel>}
  footer={<TickerBar />}
>
  <TradingChart />
</TradingLayout>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TradingLayout>;

// Mock components for stories
const MockHeader = () => (
  <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
    <div className="flex items-center gap-4">
      <span className="font-bold text-skai-green">SKAI</span>
      <nav className="flex gap-4 text-sm">
        <span className="text-foreground">Trade</span>
        <span className="text-muted-foreground">Portfolio</span>
        <span className="text-muted-foreground">Markets</span>
      </nav>
    </div>
    <div className="flex items-center gap-2">
      <button className="px-3 py-1.5 text-sm bg-skai-green text-white rounded-md">
        Connect Wallet
      </button>
    </div>
  </div>
);

const MockChart = () => (
  <div className="h-full bg-card rounded-lg border border-border flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl font-bold text-skai-green">ETH/USDT</div>
      <div className="text-2xl text-foreground mt-2">$3,456.78</div>
      <div className="text-sm text-green-500 mt-1">+2.34% (24h)</div>
      <div className="text-muted-foreground text-sm mt-4">
        [Chart Component Here]
      </div>
    </div>
  </div>
);

const MockWatchlist = () => (
  <TradingPanel title="Watchlist" variant="bordered">
    <div className="space-y-2">
      {[
        { symbol: "BTC", price: "42,156.00", change: "+1.23%" },
        { symbol: "ETH", price: "3,456.78", change: "+2.34%" },
        { symbol: "SOL", price: "98.45", change: "-0.87%" },
        { symbol: "AVAX", price: "34.12", change: "+4.56%" },
      ].map((item) => (
        <div
          key={item.symbol}
          className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
        >
          <span className="font-medium">{item.symbol}</span>
          <div className="text-right">
            <div className="text-sm">${item.price}</div>
            <div
              className={`text-xs ${item.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
            >
              {item.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  </TradingPanel>
);

const MockOrderBook = () => (
  <TradingPanel
    title="Order Book"
    actions={<Settings className="h-4 w-4 text-muted-foreground" />}
    variant="bordered"
    noPadding
  >
    <div className="divide-y divide-border">
      {/* Sell orders */}
      <div className="p-2">
        {[
          { price: "3,460.00", amount: "2.5", total: "8,650.00" },
          { price: "3,458.50", amount: "5.2", total: "17,984.20" },
          { price: "3,457.00", amount: "1.8", total: "6,222.60" },
        ].map((order, i) => (
          <div
            key={i}
            className="flex justify-between text-xs py-1 text-red-500"
          >
            <span>{order.price}</span>
            <span>{order.amount}</span>
            <span>{order.total}</span>
          </div>
        ))}
      </div>
      {/* Spread */}
      <div className="p-2 text-center bg-muted/30">
        <span className="text-sm font-medium text-foreground">$3,456.78</span>
      </div>
      {/* Buy orders */}
      <div className="p-2">
        {[
          { price: "3,456.00", amount: "3.1", total: "10,713.60" },
          { price: "3,455.50", amount: "4.8", total: "16,586.40" },
          { price: "3,454.00", amount: "2.2", total: "7,598.80" },
        ].map((order, i) => (
          <div
            key={i}
            className="flex justify-between text-xs py-1 text-green-500"
          >
            <span>{order.price}</span>
            <span>{order.amount}</span>
            <span>{order.total}</span>
          </div>
        ))}
      </div>
    </div>
  </TradingPanel>
);

const MockOrderForm = () => (
  <TradingPanel title="Place Order" variant="bordered">
    <div className="space-y-4">
      <div className="flex gap-2">
        <button className="flex-1 py-2 bg-green-500 text-white rounded text-sm font-medium">
          Buy
        </button>
        <button className="flex-1 py-2 bg-muted text-muted-foreground rounded text-sm font-medium">
          Sell
        </button>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Amount (ETH)</label>
        <input
          type="text"
          placeholder="0.00"
          className="w-full mt-1 px-3 py-2 bg-muted rounded border border-border text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Price (USDT)</label>
        <input
          type="text"
          placeholder="Market"
          className="w-full mt-1 px-3 py-2 bg-muted rounded border border-border text-sm"
        />
      </div>
      <button className="w-full py-2.5 bg-green-500 text-white rounded font-medium">
        Buy ETH
      </button>
    </div>
  </TradingPanel>
);

const MockFooter = () => (
  <div className="flex items-center gap-4 px-4 py-1.5 bg-card border-t border-border text-xs">
    <span className="text-muted-foreground">
      BTC: <span className="text-foreground">$42,156</span>
    </span>
    <span className="text-muted-foreground">
      ETH: <span className="text-foreground">$3,456</span>
    </span>
    <span className="text-muted-foreground">
      Gas: <span className="text-foreground">23 gwei</span>
    </span>
    <span className="ml-auto text-green-500">● Connected</span>
  </div>
);

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    header: <MockHeader />,
    leftSidebar: <MockWatchlist />,
    rightSidebar: (
      <div className="flex flex-col gap-1 h-full">
        <div className="flex-1 min-h-0">
          <MockOrderBook />
        </div>
        <div className="flex-1 min-h-0">
          <MockOrderForm />
        </div>
      </div>
    ),
    children: <MockChart />,
    footer: <MockFooter />,
  },
};

export const ChartOnly: Story = {
  args: {
    header: <MockHeader />,
    showLeftSidebar: false,
    showRightSidebar: false,
    children: <MockChart />,
    footer: <MockFooter />,
  },
  parameters: {
    docs: {
      description: {
        story: "Full-width chart view with sidebars hidden.",
      },
    },
  },
};

export const LeftSidebarOnly: Story = {
  args: {
    header: <MockHeader />,
    leftSidebar: <MockWatchlist />,
    showRightSidebar: false,
    children: <MockChart />,
    footer: <MockFooter />,
  },
};

export const RightSidebarOnly: Story = {
  args: {
    header: <MockHeader />,
    showLeftSidebar: false,
    rightSidebar: <MockOrderForm />,
    children: <MockChart />,
    footer: <MockFooter />,
  },
};

export const CustomWidths: Story = {
  args: {
    header: <MockHeader />,
    leftSidebar: <MockWatchlist />,
    leftSidebarWidth: 200,
    rightSidebar: <MockOrderForm />,
    rightSidebarWidth: 400,
    children: <MockChart />,
  },
  parameters: {
    docs: {
      description: {
        story: "Custom sidebar widths: left 200px, right 400px.",
      },
    },
  },
};

export const NoGap: Story = {
  args: {
    header: <MockHeader />,
    leftSidebar: <MockWatchlist />,
    rightSidebar: <MockOrderForm />,
    gap: 0,
    children: <MockChart />,
  },
  parameters: {
    docs: {
      description: {
        story: "No gap between panels for a more compact layout.",
      },
    },
  },
};

export const WithPadding: Story = {
  args: {
    header: <MockHeader />,
    leftSidebar: <MockWatchlist />,
    rightSidebar: <MockOrderForm />,
    padding: true,
    gap: 2,
    children: <MockChart />,
    footer: <MockFooter />,
  },
  parameters: {
    docs: {
      description: {
        story: "Added padding around the main content area.",
      },
    },
  },
};

// =============================================================================
// TRADING PANEL STORIES
// =============================================================================

export const PanelVariants: Story = {
  render: () => (
    <div className="p-4 flex gap-4 bg-background">
      <TradingPanel title="Default" className="w-64">
        <p className="text-sm text-muted-foreground">Default panel style</p>
      </TradingPanel>
      <TradingPanel title="Bordered" variant="bordered" className="w-64">
        <p className="text-sm text-muted-foreground">With border</p>
      </TradingPanel>
      <TradingPanel title="Elevated" variant="elevated" className="w-64">
        <p className="text-sm text-muted-foreground">With shadow</p>
      </TradingPanel>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "TradingPanel supports default, bordered, and elevated variants.",
      },
    },
  },
};

export const PanelWithActions: Story = {
  render: () => (
    <div className="p-4 bg-background">
      <TradingPanel
        title="Order Book"
        actions={
          <div className="flex gap-1">
            <button className="p-1 hover:bg-muted rounded">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        }
        variant="bordered"
        className="w-80"
      >
        <p className="text-sm text-muted-foreground">
          Panel header with action buttons
        </p>
      </TradingPanel>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "TradingPanel with action buttons in the header.",
      },
    },
  },
};
