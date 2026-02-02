/**
 * Mobile-First Patterns Documentation
 *
 * Touch-friendly, responsive UI patterns for mobile trading.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/drawer";
import { SkaiIcon } from "../components/skai-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

const meta: Meta = {
  title: "Patterns/Mobile First",
  parameters: {
    layout: "padded",
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        component: `
# 📱 Mobile-First Patterns

Touch-optimized, responsive patterns for trading on mobile devices.

## Key Principles

1. **Touch Targets** - Minimum 44×44px for all interactive elements
2. **Bottom Navigation** - Primary actions within thumb reach
3. **Sheets & Drawers** - Modal content from bottom, not center
4. **Gestures** - Swipe actions for common operations
5. **Reduced Density** - More whitespace, larger text

## Testing

Always test on actual mobile devices or use viewport controls.

## Breakpoints

| Breakpoint | Width | Typical Use |
|------------|-------|-------------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape |
| xl | 1280px | Desktop |
        `,
      },
    },
  },
};

export default meta;

// =============================================================================
// TOUCH TARGETS
// =============================================================================

export const TouchTargets: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          ✓ Good: 44×44px minimum
        </h3>
        <div className="flex gap-3">
          <Button size="lg" className="h-11">
            Buy ETH
          </Button>
          <Button size="lg" variant="outline" className="h-11">
            Sell ETH
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          ✗ Bad: Too small for touch
        </h3>
        <div className="flex gap-2">
          <Button size="sm" className="h-6 text-xs opacity-50">
            Buy
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs opacity-50"
          >
            Sell
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Icon Buttons
        </h3>
        <div className="flex gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-lg border bg-background">
            <SkaiIcon name="settings" size="md" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg border bg-background">
            <SkaiIcon name="bell" size="md" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg border bg-background">
            <SkaiIcon name="wallet" size="md" />
          </button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All interactive elements should be at least 44×44px for comfortable touch.",
      },
    },
  },
};

// =============================================================================
// BOTTOM SHEETS
// =============================================================================

function BottomSheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Open Token Selector</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh]">
        <SheetHeader>
          <SheetTitle>Select Token</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          <input
            className="w-full rounded-lg border bg-background px-4 py-3"
            placeholder="Search tokens..."
          />
          <div className="space-y-1">
            {["ETH", "USDC", "USDT", "WBTC", "DAI"].map((token) => (
              <button
                key={token}
                className="flex w-full items-center gap-3 rounded-lg p-4 hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {token[0]}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{token}</p>
                  <p className="text-sm text-muted-foreground">
                    {token === "ETH" ? "Ethereum" : token}
                  </p>
                </div>
                <span className="text-muted-foreground">$1,234.56</span>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const BottomSheets: StoryObj = {
  render: () => <BottomSheetDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Bottom sheets for selection modals - more natural on mobile than centered dialogs.",
      },
    },
  },
};

// =============================================================================
// DRAWER PATTERN
// =============================================================================

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          Transaction Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Transaction Details</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 space-y-4">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Status</span>
            <Badge className="bg-green-500">Confirmed</Badge>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Type</span>
            <span>Swap</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">From</span>
            <span>1.5 ETH</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">To</span>
            <span>2,345.67 USDC</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Fee</span>
            <span>0.15% ($3.52)</span>
          </div>
          <Button className="w-full mt-4">View on Explorer</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const Drawers: StoryObj = {
  render: () => <DrawerDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Drawer component with drag handle - can be swiped down to dismiss.",
      },
    },
  },
};

// =============================================================================
// BOTTOM NAVIGATION
// =============================================================================

export const BottomNavigation: StoryObj = {
  render: () => (
    <div className="relative h-[400px] border rounded-lg overflow-hidden bg-background">
      {/* Content Area */}
      <div className="p-4">
        <h2 className="text-xl font-bold">Portfolio</h2>
        <p className="text-muted-foreground mt-2">Your trading content here</p>
      </div>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 border-t bg-background">
        <div className="flex justify-around py-2">
          {[
            { icon: "home", label: "Home", active: false },
            { icon: "swap", label: "Trade", active: true },
            { icon: "chart", label: "Charts", active: false },
            { icon: "wallet", label: "Wallet", active: false },
            { icon: "user", label: "Profile", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                item.active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <SkaiIcon name={item.icon as any} size="md" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
        {/* Safe area spacing for notched phones */}
        <div className="h-safe-area-inset-bottom bg-background" />
      </nav>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fixed bottom navigation bar with safe area support for notched devices.",
      },
    },
  },
};

// =============================================================================
// MOBILE TABS
// =============================================================================

export const MobileTabs: StoryObj = {
  render: () => (
    <div className="space-y-4">
      {/* Scrollable Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Scrollable Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-2 min-w-max pb-2">
              {[
                "All",
                "Swaps",
                "Transfers",
                "Approvals",
                "NFTs",
                "Staking",
                "Bridge",
              ].map((tab, i) => (
                <button
                  key={tab}
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                    i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full-width Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Full-width Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="buy" className="h-11">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="h-11">
                Sell
              </TabsTrigger>
            </TabsList>
            <TabsContent value="buy" className="mt-4">
              <p className="text-muted-foreground">Buy form content</p>
            </TabsContent>
            <TabsContent value="sell" className="mt-4">
              <p className="text-muted-foreground">Sell form content</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Tab patterns for mobile: scrollable for many options, full-width for binary choices.",
      },
    },
  },
};

// =============================================================================
// SWIPE ACTIONS
// =============================================================================

export const SwipeActions: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Swipe left on items to reveal actions (demonstration):
      </p>

      <div className="relative overflow-hidden rounded-lg border">
        {/* Action buttons (revealed on swipe) */}
        <div className="absolute right-0 top-0 bottom-0 flex">
          <button className="flex w-20 items-center justify-center bg-yellow-500 text-white">
            <SkaiIcon name="edit" size="sm" />
          </button>
          <button className="flex w-20 items-center justify-center bg-red-500 text-white">
            <SkaiIcon name="trash" size="sm" />
          </button>
        </div>

        {/* Main content */}
        <div className="relative bg-background p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
            Ξ
          </div>
          <div className="flex-1">
            <p className="font-medium">ETH Price Alert</p>
            <p className="text-sm text-muted-foreground">Alert at $2,500</p>
          </div>
          <Badge variant="outline">Active</Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Note: Actual swipe functionality requires touch event handling.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Swipe-to-reveal actions pattern for list items.",
      },
    },
  },
};

// =============================================================================
// MOBILE FORM
// =============================================================================

export const MobileForm: StoryObj = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Quick Swap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Large Input for Mobile */}
        <div className="space-y-2">
          <label className="text-sm font-medium">You Pay</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              className="flex-1 rounded-lg border bg-background px-4 py-4 text-lg"
              placeholder="0.00"
            />
            <button className="flex items-center gap-2 rounded-lg border px-4 py-2">
              <span className="font-medium">ETH</span>
              <SkaiIcon name="chevron-down" size="sm" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">Balance: 2.345 ETH</p>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
            <SkaiIcon name="swap" size="sm" />
          </button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <label className="text-sm font-medium">You Receive</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              className="flex-1 rounded-lg border bg-muted px-4 py-4 text-lg"
              value="2,345.67"
            />
            <button className="flex items-center gap-2 rounded-lg border px-4 py-2">
              <span className="font-medium">USDC</span>
              <SkaiIcon name="chevron-down" size="sm" />
            </button>
          </div>
        </div>

        {/* Full-width Submit */}
        <Button className="w-full h-14 text-lg">Review Swap</Button>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mobile-optimized form with large touch targets and numeric keyboard.",
      },
    },
  },
};

// =============================================================================
// RESPONSIVE CARD GRID
// =============================================================================

export const ResponsiveGrid: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Grid adjusts from 1 column (mobile) to 2 (tablet) to 3 (desktop):
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            token: "ETH",
            amount: "2.345",
            value: "$5,678.90",
            change: "+5.2%",
          },
          {
            token: "USDC",
            amount: "10,000",
            value: "$10,000.00",
            change: "0%",
          },
          {
            token: "WBTC",
            amount: "0.15",
            value: "$6,750.00",
            change: "+3.1%",
          },
        ].map((item) => (
          <Card key={item.token}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-bold">
                  {item.token[0]}
                </div>
                <div>
                  <p className="font-bold text-lg">{item.amount}</p>
                  <p className="text-sm text-muted-foreground">{item.token}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-medium">{item.value}</span>
                <Badge
                  variant="outline"
                  className={
                    item.change.startsWith("+")
                      ? "text-green-500 border-green-500/30"
                      : item.change.startsWith("-")
                        ? "text-red-500 border-red-500/30"
                        : ""
                  }
                >
                  {item.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Responsive grid that adjusts columns based on viewport width.",
      },
    },
  },
};
