/**
 * Notifications & Alerts Documentation
 *
 * Toast notifications, alerts, and feedback patterns for trading apps.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Alert, AlertDescription, AlertTitle } from "../components/feedback/alert";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";
import { SkaiIcon } from "../components/branding/skai-icon";
import { useState } from "react";

const meta: Meta = {
  title: "Patterns/Notifications & Alerts",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 🔔 Notifications & Alerts

Feedback patterns for user actions, system events, and trading updates.

## Types

| Type | Use Case | Duration |
|------|----------|----------|
| **Toast** | Transient feedback | 3-5s auto-dismiss |
| **Alert** | Important info | Persistent until dismissed |
| **Banner** | System-wide notices | Until action taken |
| **Badge** | Status indicators | Real-time updates |

## Trading-Specific Notifications

- **Transaction Success/Failure**
- **Price Alerts**
- **Order Fills**
- **Wallet Events**
- **Network Issues**
        `,
      },
    },
  },
};

export default meta;

// =============================================================================
// ALERT VARIANTS
// =============================================================================

export const AlertTypes: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <SkaiIcon name="info" className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Gas prices are currently elevated. Consider waiting for lower fees.
        </AlertDescription>
      </Alert>

      <Alert variant="default" className="border-green-500/30 bg-green-500/10">
        <SkaiIcon name="check" className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Success</AlertTitle>
        <AlertDescription>
          Your swap was successful! 1.5 ETH → 2,345.67 USDC
        </AlertDescription>
      </Alert>

      <Alert
        variant="default"
        className="border-yellow-500/30 bg-yellow-500/10"
      >
        <SkaiIcon name="warning" className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-500">Warning</AlertTitle>
        <AlertDescription>
          Slippage tolerance is set high (5%). Your trade may be frontrun.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <SkaiIcon name="x" className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Transaction failed: Insufficient gas. Please try again with higher gas
          limit.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Four alert types: info, success, warning, and error.",
      },
    },
  },
};

// =============================================================================
// TRADING NOTIFICATIONS
// =============================================================================

export const TradingNotifications: StoryObj = {
  render: () => (
    <div className="space-y-4">
      {/* Transaction Confirmed */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
            <SkaiIcon name="check" size="sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-green-500">Swap Confirmed</p>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Swapped 1.5 ETH for 2,345.67 USDC
            </p>
            <Button variant="link" size="sm" className="p-0 h-auto mt-2">
              View on Explorer →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Price Alert */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
            <SkaiIcon name="bell" size="sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-blue-500">Price Alert</p>
              <span className="text-xs text-muted-foreground">2m ago</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ETH reached your target price of $2,400
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm">Buy Now</Button>
              <Button variant="outline" size="sm">
                Dismiss
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Filled */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white">
            <SkaiIcon name="swap" size="sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-purple-500">Order Filled</p>
              <span className="text-xs text-muted-foreground">5m ago</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Limit order: Buy 0.5 ETH @ $2,350 filled
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total: $1,175.00 • Fee: $1.76
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Network Warning */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-white">
            <SkaiIcon name="warning" size="sm" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-yellow-500">
                Network Congestion
              </p>
              <Badge
                variant="outline"
                className="text-yellow-500 border-yellow-500/30"
              >
                High Gas
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Base network is experiencing high traffic. Expected wait: ~5
              minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Trading-specific notification cards with actions.",
      },
    },
  },
};

// =============================================================================
// SYSTEM BANNERS
// =============================================================================

export const SystemBanners: StoryObj = {
  render: () => (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="flex items-center justify-between rounded-lg bg-blue-500/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <SkaiIcon name="info" className="h-4 w-4 text-blue-500" />
          <span>
            Scheduled maintenance: Feb 15, 2:00 AM UTC (30 min downtime)
          </span>
        </div>
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="flex items-center justify-between rounded-lg bg-yellow-500/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <SkaiIcon name="warning" className="h-4 w-4 text-yellow-500" />
          <span>High volatility detected. Trade with caution.</span>
        </div>
        <Button variant="ghost" size="sm">
          Learn More
        </Button>
      </div>

      {/* Success Banner */}
      <div className="flex items-center justify-between rounded-lg bg-green-500/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <SkaiIcon name="check" className="h-4 w-4 text-green-500" />
          <span>New feature: Limit orders are now available!</span>
        </div>
        <Button variant="ghost" size="sm">
          Try It
        </Button>
      </div>

      {/* Error Banner */}
      <div className="flex items-center justify-between rounded-lg bg-red-500/10 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <SkaiIcon name="x" className="h-4 w-4 text-red-500" />
          <span>API degraded performance. Some features may be slow.</span>
        </div>
        <Button variant="ghost" size="sm">
          Status Page
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "System-wide banners for announcements and alerts.",
      },
    },
  },
};

// =============================================================================
// NOTIFICATION CENTER
// =============================================================================

function NotificationCenter() {
  const [notifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Swap Complete",
      message: "1.5 ETH → 2,345 USDC",
      time: "2m ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Price Alert",
      message: "ETH hit $2,400",
      time: "15m ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Gas Spike",
      message: "Gas prices are 3x normal",
      time: "1h ago",
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Order Filled",
      message: "Limit buy 0.5 ETH",
      time: "2h ago",
      read: true,
    },
  ]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Card className="w-96">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Button variant="ghost" size="sm">
          Mark all read
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 p-4 ${!n.read ? "bg-muted/30" : ""}`}
            >
              <div
                className={`mt-1 h-2 w-2 rounded-full ${getTypeStyles(n.type)}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${!n.read ? "" : "text-muted-foreground"}`}
                  >
                    {n.title}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {n.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export const NotificationCenterPattern: StoryObj = {
  render: () => <NotificationCenter />,
  parameters: {
    docs: {
      description: {
        story: "Dropdown notification center with read/unread states.",
      },
    },
  },
};

// =============================================================================
// INLINE FEEDBACK
// =============================================================================

export const InlineFeedback: StoryObj = {
  render: () => (
    <div className="space-y-6">
      {/* Form Field Error */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <input
          className="w-full rounded-md border border-red-500 bg-background px-3 py-2 text-sm"
          defaultValue="1000000"
        />
        <p className="text-sm text-red-500 flex items-center gap-1">
          <SkaiIcon name="warning" className="h-3 w-3" />
          Amount exceeds balance (max: 2,345.67 USDC)
        </p>
      </div>

      {/* Form Field Success */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Recipient Address</label>
        <input
          className="w-full rounded-md border border-green-500 bg-background px-3 py-2 text-sm"
          defaultValue="0x1234...5678"
        />
        <p className="text-sm text-green-500 flex items-center gap-1">
          <SkaiIcon name="check" className="h-3 w-3" />
          Valid address on Base network
        </p>
      </div>

      {/* Field Hint */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Slippage Tolerance</label>
        <input
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          defaultValue="0.5%"
        />
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <SkaiIcon name="info" className="h-3 w-3" />
          Higher slippage may result in worse execution price
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Inline feedback for form fields: errors, success, and hints.",
      },
    },
  },
};

// =============================================================================
// REAL-TIME BADGES
// =============================================================================

export const RealtimeBadges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {/* Connection Status */}
      <Badge variant="outline" className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Connected
      </Badge>

      {/* Pending Count */}
      <Badge variant="secondary">3 Pending</Badge>

      {/* Network Status */}
      <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">
        Base: Congested
      </Badge>

      {/* Live Indicator */}
      <Badge className="bg-red-500">
        <span className="mr-1">●</span>
        LIVE
      </Badge>

      {/* Update Available */}
      <Badge variant="outline" className="border-blue-500/30 text-blue-500">
        Update Available
      </Badge>

      {/* Tier Badge */}
      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
        ⭐ Gold Tier
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-time status badges for various system states.",
      },
    },
  },
};
