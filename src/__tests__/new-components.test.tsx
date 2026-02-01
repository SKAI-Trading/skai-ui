import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { Spinner, LoadingOverlay } from "../components/spinner";
import {
  EmptyState,
  NoResults,
  NoData,
  OfflineState,
} from "../components/empty-state";
import {
  ErrorBoundary,
  DefaultErrorFallback,
} from "../components/error-boundary";
import {
  PriceChange,
  PercentageChange,
  USDChange,
} from "../components/price-change";
import { PnLDisplay } from "../components/pnl-display";
import { NetworkBadge, NETWORK_CONFIGS } from "../components/network-badge";
import {
  TransactionStatusBadge,
  TransactionProgress,
} from "../components/transaction-status";

describe("Spinner", () => {
  it("should render with default props", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("should render with custom label", () => {
    render(<Spinner label="Processing" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Processing",
    );
  });

  it("should apply size variants", () => {
    const { rerender } = render(<Spinner size="xs" />);
    expect(screen.getByRole("status")).toHaveClass("h-3", "w-3");

    rerender(<Spinner size="xl" />);
    expect(screen.getByRole("status")).toHaveClass("h-12", "w-12");
  });

  it("should apply variant classes", () => {
    const { rerender } = render(<Spinner variant="success" />);
    expect(screen.getByRole("status")).toHaveClass("text-green-500");

    rerender(<Spinner variant="error" />);
    expect(screen.getByRole("status")).toHaveClass("text-red-500");
  });
});

describe("LoadingOverlay", () => {
  it("should render children when not loading", () => {
    render(
      <LoadingOverlay loading={false}>
        <div data-testid="content">Content</div>
      </LoadingOverlay>,
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should show overlay when loading", () => {
    render(
      <LoadingOverlay loading>
        <div data-testid="content">Content</div>
      </LoadingOverlay>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should display loading text", () => {
    render(<LoadingOverlay loading text="Please wait..." />);
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("should render title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("should render description", () => {
    render(
      <EmptyState title="No items" description="Try a different search" />,
    );
    expect(screen.getByText("Try a different search")).toBeInTheDocument();
  });

  it("should render action", () => {
    render(<EmptyState title="No items" action={<button>Add item</button>} />);
    expect(
      screen.getByRole("button", { name: "Add item" }),
    ).toBeInTheDocument();
  });

  it("should hide icon when hideIcon is true", () => {
    const { container } = render(<EmptyState title="No items" hideIcon />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});

describe("NoResults / NoData / OfflineState", () => {
  it("should render NoResults with default title", () => {
    render(<NoResults />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("should render NoData with default title", () => {
    render(<NoData />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("should render OfflineState with default title and description", () => {
    render(<OfflineState />);
    expect(screen.getByText("You're offline")).toBeInTheDocument();
    expect(
      screen.getByText("Check your internet connection and try again"),
    ).toBeInTheDocument();
  });
});

describe("ErrorBoundary", () => {
  // Suppress error boundary console errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) throw new Error("Test error");
    return <div>No error</div>;
  };

  it("should render children when no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should render fallback when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should call onError callback", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalled();
  });

  it("should render custom fallback", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom</div>}>
        <ThrowError shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });
});

describe("DefaultErrorFallback", () => {
  it("should render error message", () => {
    const error = new Error("Something broke");
    const resetFn = vi.fn();

    render(<DefaultErrorFallback error={error} resetErrorBoundary={resetFn} />);

    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("should call resetErrorBoundary on button click", () => {
    const resetFn = vi.fn();
    render(
      <DefaultErrorFallback
        error={new Error("Test")}
        resetErrorBoundary={resetFn}
      />,
    );

    fireEvent.click(screen.getByText("Try again"));
    expect(resetFn).toHaveBeenCalled();
  });
});

describe("PriceChange", () => {
  it("should render positive change in green", () => {
    render(<PriceChange value={5.25} />);
    const element = screen.getByText("+5.25%");
    expect(element.parentElement).toHaveClass("text-green-500");
  });

  it("should render negative change in red", () => {
    render(<PriceChange value={-3.5} />);
    expect(screen.getByText("3.50%")).toBeInTheDocument();
    expect(screen.getByText("3.50%").parentElement).toHaveClass("text-red-500");
  });

  it("should render zero as neutral", () => {
    render(<PriceChange value={0} />);
    expect(screen.getByText("0.00%").parentElement).toHaveClass(
      "text-muted-foreground",
    );
  });

  it("should support custom decimals", () => {
    render(<PriceChange value={5.12345} decimals={4} />);
    expect(screen.getByText("+5.1235%")).toBeInTheDocument();
  });

  it("should support prefix and suffix", () => {
    render(
      <PriceChange value={10} isPercentage={false} prefix="$" suffix=" USD" />,
    );
    expect(screen.getByText("+$10.00 USD")).toBeInTheDocument();
  });

  it("should invert colors when invertColors is true", () => {
    render(<PriceChange value={5} invertColors />);
    expect(screen.getByText("+5.00%").parentElement).toHaveClass(
      "text-red-500",
    );
  });
});

describe("PercentageChange / USDChange", () => {
  it("should render PercentageChange with percentage", () => {
    render(<PercentageChange value={10} />);
    expect(screen.getByText("+10.00%")).toBeInTheDocument();
  });

  it("should render USDChange with dollar prefix", () => {
    render(<USDChange value={100} />);
    expect(screen.getByText("+$100.00")).toBeInTheDocument();
  });
});

describe("PnLDisplay", () => {
  it("should render profit in green", () => {
    render(<PnLDisplay value={500} />);
    const container = screen.getByText("+$500.00").closest("div");
    expect(container).toHaveClass("text-green-500");
  });

  it("should render loss in red", () => {
    render(<PnLDisplay value={-250} />);
    const container = screen.getByText("$250.00").closest("div");
    expect(container).toHaveClass("text-red-500");
  });

  it("should render percentage when provided", () => {
    render(<PnLDisplay value={100} percentage={10.5} />);
    expect(screen.getByText("(+10.50%)")).toBeInTheDocument();
  });

  it("should render label", () => {
    render(<PnLDisplay value={100} label="Daily PnL:" />);
    expect(screen.getByText("Daily PnL:")).toBeInTheDocument();
  });
});

describe("NetworkBadge", () => {
  it("should render network name", () => {
    render(<NetworkBadge chainId={1} />);
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("should render short name when specified", () => {
    render(<NetworkBadge chainId={1} shortName />);
    expect(screen.getByText("ETH")).toBeInTheDocument();
  });

  it("should handle unknown chain IDs", () => {
    render(<NetworkBadge chainId={999999} />);
    expect(screen.getByText("Chain 999999")).toBeInTheDocument();
  });

  it("should have correct network configs", () => {
    expect(NETWORK_CONFIGS[8453].name).toBe("Base");
    expect(NETWORK_CONFIGS[10].name).toBe("Optimism");
    expect(NETWORK_CONFIGS[42161].name).toBe("Arbitrum");
  });
});

describe("TransactionStatusBadge", () => {
  it("should render pending status", () => {
    render(<TransactionStatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should render confirmed status", () => {
    render(<TransactionStatusBadge status="confirmed" />);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("should render failed status", () => {
    render(<TransactionStatusBadge status="failed" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("should render custom label", () => {
    render(<TransactionStatusBadge status="pending" label="Processing..." />);
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("should render as link when txHash and explorerUrl provided", () => {
    render(
      <TransactionStatusBadge
        status="confirmed"
        txHash="0x123"
        explorerUrl="https://etherscan.io"
      />,
    );
    // The link has role="status" for accessibility, but it's still an anchor
    const link = screen.getByRole("status");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://etherscan.io/tx/0x123");
  });
});

describe("TransactionProgress", () => {
  it("should render all steps", () => {
    render(
      <TransactionProgress
        currentStep={2}
        steps={["Approve", "Swap", "Complete"]}
      />,
    );

    expect(screen.getByText("Approve")).toBeInTheDocument();
    expect(screen.getByText("Swap")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("should highlight failed step", () => {
    render(
      <TransactionProgress
        currentStep={2}
        steps={["Approve", "Swap", "Complete"]}
        failedStep={2}
      />,
    );

    // The step label (span element) should have the red text class
    const stepLabel = screen.getByText("Swap");
    expect(stepLabel).toHaveClass("text-red-500");
  });
});
