/**
 * Loading States Documentation
 *
 * Comprehensive loading patterns for trading applications.
 * Includes skeletons, spinners, overlays, and progressive loading.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Skeleton } from "../components/feedback/skeleton";
import { Spinner, LoadingOverlay } from "../components/feedback/spinner";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";
import { Progress } from "../components/feedback/progress";
import { useState, useEffect } from "react";

const meta: Meta = {
  title: "Patterns/Loading States",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# ⏳ Loading States

Patterns for indicating loading, processing, and async operations.

## Principles

1. **Immediate Feedback** - Show loading instantly (< 100ms)
2. **Predictable Layout** - Skeleton matches final content
3. **Progressive Disclosure** - Load in logical order
4. **Estimated Duration** - Progress bar for long operations

## Pattern Types

| Pattern | Use Case | Duration |
|---------|----------|----------|
| **Spinner** | Quick operations | < 3s |
| **Skeleton** | Content loading | < 5s |
| **Progress** | Known duration | Any |
| **Overlay** | Blocking actions | Any |

## Trading-Specific

- Transaction confirmations (1-3 blocks)
- Price fetching (real-time)
- Wallet connection (user action required)
- Order submission (near instant)
        `,
      },
    },
  },
};

export default meta;

// =============================================================================
// SKELETON PATTERNS
// =============================================================================

export const SkeletonCard: StoryObj = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Loading State */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Loaded State */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
              <span className="text-white font-bold">Ξ</span>
            </div>
            <div>
              <p className="font-medium">Ethereum</p>
              <p className="text-sm text-muted-foreground">ETH</p>
            </div>
          </div>
          <p className="text-2xl font-bold">$12,345.67</p>
          <p className="text-sm text-green-500">+5.23% today</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Skeleton loading state next to loaded content for comparison.",
      },
    },
  },
};

export const SkeletonTable: StoryObj = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Skeleton pattern for transaction lists and tables.",
      },
    },
  },
};

export const SkeletonChart: StoryObj = {
  render: () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Skeleton pattern for chart components with time controls.",
      },
    },
  },
};

// =============================================================================
// SPINNER PATTERNS
// =============================================================================

export const SpinnerInContext: StoryObj = {
  render: () => (
    <div className="space-y-6">
      {/* Inline Loading */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span>ETH Price</span>
            <div className="flex items-center gap-2">
              <Spinner size="xs" />
              <span className="text-sm text-muted-foreground">Updating...</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Loading */}
      <div className="flex gap-4">
        <Button disabled>
          <Spinner size="sm" variant="white" className="mr-2" />
          Submitting Order...
        </Button>
        <Button variant="outline" disabled>
          <Spinner size="sm" className="mr-2" />
          Connecting...
        </Button>
      </div>

      {/* Centered Loading */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading your portfolio...
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different spinner placements: inline, in buttons, and centered.",
      },
    },
  },
};

// =============================================================================
// PROGRESS PATTERNS
// =============================================================================

function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing swap...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step 2 of 3</span>
            <span>~15 seconds remaining</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Multi-Step Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Approve Token", status: "complete" },
              { label: "Sign Transaction", status: "current" },
              { label: "Wait for Confirmation", status: "pending" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step.status === "complete"
                      ? "bg-green-500 text-white"
                      : step.status === "current"
                        ? "bg-primary text-white"
                        : "bg-muted"
                  }`}
                >
                  {step.status === "complete" ? (
                    "✓"
                  ) : step.status === "current" ? (
                    <Spinner size="xs" variant="white" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={
                    step.status === "pending" ? "text-muted-foreground" : ""
                  }
                >
                  {step.label}
                </span>
                {step.status === "current" && (
                  <Badge variant="secondary" className="ml-auto">
                    In Progress
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const ProgressIndicators: StoryObj = {
  render: () => <ProgressDemo />,
  parameters: {
    docs: {
      description: {
        story: "Progress bars and multi-step progress indicators.",
      },
    },
  },
};

// =============================================================================
// OVERLAY PATTERNS
// =============================================================================

function OverlayDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <Button onClick={() => setLoading(true)}>Trigger Loading Overlay</Button>

      <LoadingOverlay loading={loading} text="Processing transaction...">
        <Card>
          <CardHeader>
            <CardTitle>Swap ETH → USDC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>You pay</span>
              <span className="font-medium">1.5 ETH</span>
            </div>
            <div className="flex justify-between">
              <span>You receive</span>
              <span className="font-medium">2,345.67 USDC</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Fee</span>
              <span>0.15%</span>
            </div>
            <Button className="w-full" onClick={() => setLoading(true)}>
              Confirm Swap
            </Button>
          </CardContent>
        </Card>
      </LoadingOverlay>

      {loading && (
        <Button variant="outline" onClick={() => setLoading(false)}>
          Cancel Demo
        </Button>
      )}
    </div>
  );
}

export const LoadingOverlayPattern: StoryObj = {
  render: () => <OverlayDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Full overlay that blocks interaction during critical operations.",
      },
    },
  },
};

// =============================================================================
// TRANSACTION STATES
// =============================================================================

export const TransactionStates: StoryObj = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pending */}
      <Card className="border-yellow-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Spinner size="sm" variant="warning" />
            <div>
              <p className="font-medium">Transaction Pending</p>
              <p className="text-sm text-muted-foreground">
                Waiting for confirmation...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirming */}
      <Card className="border-blue-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <div>
              <p className="font-medium">Confirming</p>
              <p className="text-sm text-muted-foreground">
                1 of 3 confirmations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success */}
      <Card className="border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              ✓
            </div>
            <div>
              <p className="font-medium text-green-500">Success!</p>
              <p className="text-sm text-muted-foreground">
                Transaction confirmed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failed */}
      <Card className="border-red-500/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
              ✕
            </div>
            <div>
              <p className="font-medium text-red-500">Failed</p>
              <p className="text-sm text-muted-foreground">
                Transaction reverted
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All possible transaction states: pending, confirming, success, failed.",
      },
    },
  },
};

// =============================================================================
// OPTIMISTIC UI
// =============================================================================

function OptimisticDemo() {
  const [balance, setBalance] = useState(1000);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  const handleSwap = () => {
    setPendingAmount(100);
    // Simulate transaction
    setTimeout(() => {
      setBalance((prev) => prev + 100);
      setPendingAmount(null);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimistic UI Pattern</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Show expected result immediately while transaction confirms.
        </p>

        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between">
            <span>Current Balance</span>
            <span className="font-mono font-bold">${balance.toFixed(2)}</span>
          </div>
          {pendingAmount && (
            <div className="mt-2 flex justify-between text-sm text-green-500">
              <span className="flex items-center gap-2">
                <Spinner size="xs" variant="success" />
                Pending
              </span>
              <span>+${pendingAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Button onClick={handleSwap} disabled={pendingAmount !== null}>
          {pendingAmount ? "Processing..." : "Swap +$100"}
        </Button>
      </CardContent>
    </Card>
  );
}

export const OptimisticUI: StoryObj = {
  render: () => <OptimisticDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Optimistic UI shows expected result immediately while transaction confirms in background.",
      },
    },
  },
};

// =============================================================================
// EMPTY VS LOADING
// =============================================================================

export const EmptyVsLoading: StoryObj = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Loading State</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading transactions...
          </p>
        </CardContent>
      </Card>

      {/* Empty */}
      <Card>
        <CardHeader>
          <CardTitle>Empty State</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">📭</div>
          <p className="font-medium">No transactions yet</p>
          <p className="text-sm text-muted-foreground">
            Your transaction history will appear here
          </p>
          <Button className="mt-4" variant="outline" size="sm">
            Make your first trade
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Distinguish between loading state (data fetching) and empty state (no data).",
      },
    },
  },
};
