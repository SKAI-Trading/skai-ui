import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Progress } from "../components/progress";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  FileX,
  Info,
  Loader2,
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";

const meta: Meta = {
  title: "Patterns/Feedback",
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const ToastNotifications: StoryObj = {
  name: "Toast Notifications",
  render: () => (
    <div className="w-[400px] space-y-4">
      <h2 className="text-2xl font-bold mb-6">Toast Notifications</h2>

      {/* Success */}
      <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-green-500">Transaction Successful</p>
          <p className="text-sm text-muted-foreground">
            Swapped 1.5 ETH for 3,217.50 USDC
          </p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Error */}
      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-red-500">Transaction Failed</p>
          <p className="text-sm text-muted-foreground">
            Insufficient gas. Please try again with higher gas limit.
          </p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-yellow-500">High Slippage Warning</p>
          <p className="text-sm text-muted-foreground">
            Price impact is 5.2%. Consider reducing trade size.
          </p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-blue-500">Transaction Pending</p>
          <p className="text-sm text-muted-foreground">
            Waiting for confirmation...
          </p>
        </div>
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      </div>

      {/* With Action */}
      <div className="flex items-start gap-3 p-4 bg-card border rounded-lg">
        <Zap className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">New Feature Available</p>
          <p className="text-sm text-muted-foreground mb-2">
            Try our new AI trading assistant
          </p>
          <div className="flex gap-2">
            <Button size="sm">Try Now</Button>
            <Button size="sm" variant="ghost">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const LoadingStates: StoryObj = {
  name: "Loading States",
  render: () => (
    <div className="w-[500px] space-y-6">
      <h2 className="text-2xl font-bold">Loading States</h2>

      <div className="grid gap-4">
        {/* Full Page Loading */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Full Page Loading</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your portfolio...</p>
          </CardContent>
        </Card>

        {/* Skeleton Loading */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Skeleton Loading</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/5" />
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Transaction Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Transaction Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Approved</p>
                <p className="text-sm text-muted-foreground">
                  Token approval confirmed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Swapping</p>
                <p className="text-sm text-muted-foreground">
                  Transaction in progress...
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  3
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">Complete</p>
                <p className="text-sm text-muted-foreground">Waiting...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const EmptyStates: StoryObj = {
  name: "Empty States",
  render: () => (
    <div className="w-[500px] space-y-6">
      <h2 className="text-2xl font-bold">Empty States</h2>

      <div className="grid gap-4">
        {/* No Results */}
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any tokens matching "xyz123"
            </p>
            <Button variant="outline">Clear Search</Button>
          </CardContent>
        </Card>

        {/* Empty Portfolio */}
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Holdings Yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding some tokens to your portfolio
            </p>
            <Button>Buy Tokens</Button>
          </CardContent>
        </Card>

        {/* No Transactions */}
        <Card>
          <CardContent className="py-12 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Transactions</h3>
            <p className="text-muted-foreground">
              Your transaction history will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const ErrorStates: StoryObj = {
  name: "Error States",
  render: () => (
    <div className="w-[500px] space-y-6">
      <h2 className="text-2xl font-bold">Error States</h2>

      <div className="grid gap-4">
        {/* Connection Error */}
        <Card>
          <CardContent className="py-12 text-center">
            <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Connection Lost</h3>
            <p className="text-muted-foreground mb-4">
              Unable to connect to the network. Check your internet connection.
            </p>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>

        {/* Transaction Error */}
        <Card className="border-red-500/20">
          <CardContent className="py-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-500 mb-1">
                  Transaction Failed
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The transaction was reverted. This usually happens when:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Insufficient gas limit</li>
                  <li>• Price changed during swap</li>
                  <li>• Slippage tolerance too low</li>
                </ul>
                <div className="flex gap-2">
                  <Button size="sm">Try Again</Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 404 Style */}
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-6xl font-bold text-muted-foreground mb-4">404</p>
            <h3 className="font-semibold text-lg mb-2">Page Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button variant="outline">Go Home</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const StatusIndicators: StoryObj = {
  name: "Status Indicators",
  render: () => (
    <div className="w-[400px] space-y-6">
      <h2 className="text-2xl font-bold">Status Indicators</h2>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Connection Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span>Connected</span>
            </div>
            <Badge className="bg-green-500/20 text-green-500">
              Base Mainnet
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
              <span>Connecting...</span>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-500">
              Switching
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span>Disconnected</span>
            </div>
            <Badge className="bg-red-500/20 text-red-500">Offline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Transaction Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { status: "Pending", color: "yellow", icon: Loader2, spin: true },
            { status: "Confirming", color: "blue", icon: Loader2, spin: true },
            { status: "Confirmed", color: "green", icon: Check, spin: false },
            { status: "Failed", color: "red", icon: X, spin: false },
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-3 p-2">
              <div
                className={`h-2 w-2 rounded-full bg-${item.color}-500 ${
                  item.spin ? "animate-pulse" : ""
                }`}
              />
              <span className="flex-1">{item.status}</span>
              <item.icon
                className={`h-4 w-4 text-${item.color}-500 ${
                  item.spin ? "animate-spin" : ""
                }`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Live Indicators</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-sm">Syncing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted" />
            <span className="text-sm text-muted-foreground">Offline</span>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
