import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  StatusIndicator,
  statusIndicatorVariants,
} from "../components/trading/status-indicator";

/**
 * Exact members of a class list. A substring match over the joined string is
 * satisfied by any longer utility sharing the prefix, so `toContain("h-3")`
 * passes on `h-3.5` and `toContain("bg-green-500")` on `bg-green-500/90`.
 */
const tok = (cls: string) => cls.split(/\s+/).filter(Boolean);

describe("StatusIndicator", () => {
  describe("Status Variants", () => {
    it("renders online status with green color", () => {
      const { container } = render(<StatusIndicator status="online" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-green-500");
    });

    it("renders offline status with gray color", () => {
      const { container } = render(<StatusIndicator status="offline" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-gray-400");
    });

    it("renders away status with yellow color", () => {
      const { container } = render(<StatusIndicator status="away" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-yellow-500");
    });

    it("renders busy status with red color", () => {
      const { container } = render(<StatusIndicator status="busy" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-red-500");
    });

    it("renders connecting status with blue color", () => {
      const { container } = render(<StatusIndicator status="connecting" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-blue-500");
    });

    it("renders error status with destructive color", () => {
      const { container } = render(<StatusIndicator status="error" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-destructive");
    });

    it("defaults to offline when no status provided", () => {
      const { container } = render(<StatusIndicator />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("bg-gray-400");
    });
  });

  describe("Size Variants", () => {
    it("renders xs size", () => {
      const { container } = render(<StatusIndicator size="xs" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("h-1.5", "w-1.5");
    });

    it("renders sm size", () => {
      const { container } = render(<StatusIndicator size="sm" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("h-2", "w-2");
    });

    it("renders md size (default)", () => {
      const { container } = render(<StatusIndicator size="md" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("h-2.5", "w-2.5");
    });

    it("renders lg size", () => {
      const { container } = render(<StatusIndicator size="lg" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("h-3", "w-3");
    });

    it("renders xl size", () => {
      const { container } = render(<StatusIndicator size="xl" />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("h-4", "w-4");
    });
  });

  describe("Animation Variants", () => {
    it("applies pulse animation when pulse is true", () => {
      const { container } = render(<StatusIndicator pulse />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).toHaveClass("animate-pulse");
    });

    it("does not apply pulse animation when pulse is false", () => {
      const { container } = render(<StatusIndicator pulse={false} />);
      const indicator = container.querySelector('[role="status"]');
      expect(indicator).not.toHaveClass("animate-pulse");
    });

    it("applies glow effect for online status", () => {
      const { container } = render(<StatusIndicator status="online" glow />);
      const indicator = container.querySelector('[role="status"]');
      expect(tok(indicator!.className)).toContain(
        "shadow-[0_0_8px_rgba(34,197,94,0.6)]",
      );
    });

    it("applies glow effect for busy status", () => {
      const { container } = render(<StatusIndicator status="busy" glow />);
      const indicator = container.querySelector('[role="status"]');
      expect(tok(indicator!.className)).toContain(
        "shadow-[0_0_8px_rgba(239,68,68,0.6)]",
      );
    });

    it("applies glow effect for away status", () => {
      const { container } = render(<StatusIndicator status="away" glow />);
      const indicator = container.querySelector('[role="status"]');
      expect(tok(indicator!.className)).toContain(
        "shadow-[0_0_8px_rgba(234,179,8,0.6)]",
      );
    });

    it("applies glow effect for connecting status", () => {
      const { container } = render(
        <StatusIndicator status="connecting" glow />,
      );
      const indicator = container.querySelector('[role="status"]');
      expect(tok(indicator!.className)).toContain(
        "shadow-[0_0_8px_rgba(59,130,246,0.6)]",
      );
    });

    it("adds no glow shadow when glow is off", () => {
      const { container } = render(<StatusIndicator status="online" />);
      const indicator = container.querySelector('[role="status"]');
      expect(
        tok(indicator!.className).filter((c) => c.startsWith("shadow-")),
      ).toEqual([]);
    });
  });

  describe("Label Display", () => {
    it("does not show label by default", () => {
      render(<StatusIndicator status="online" />);
      expect(screen.queryByText("Online")).not.toBeInTheDocument();
    });

    it("shows label when showLabel is true", () => {
      render(<StatusIndicator status="online" showLabel />);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("shows correct default labels for each status", () => {
      const { rerender } = render(
        <StatusIndicator status="online" showLabel />,
      );
      expect(screen.getByText("Online")).toBeInTheDocument();

      rerender(<StatusIndicator status="offline" showLabel />);
      expect(screen.getByText("Offline")).toBeInTheDocument();

      rerender(<StatusIndicator status="away" showLabel />);
      expect(screen.getByText("Away")).toBeInTheDocument();

      rerender(<StatusIndicator status="busy" showLabel />);
      expect(screen.getByText("Do not disturb")).toBeInTheDocument();

      rerender(<StatusIndicator status="connecting" showLabel />);
      expect(screen.getByText("Connecting")).toBeInTheDocument();

      rerender(<StatusIndicator status="error" showLabel />);
      expect(screen.getByText("Connection error")).toBeInTheDocument();
    });

    it("uses custom statusText when provided", () => {
      render(
        <StatusIndicator
          status="online"
          showLabel
          statusText="Available now"
        />,
      );
      expect(screen.getByText("Available now")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role=status", () => {
      render(<StatusIndicator status="online" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has aria-label with default status text", () => {
      render(<StatusIndicator status="online" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Online",
      );
    });

    it("uses custom label for aria-label when provided", () => {
      render(<StatusIndicator status="online" label="User John is online" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "User John is online",
      );
    });

    it("uses statusText for aria-label when label not provided", () => {
      render(<StatusIndicator status="online" statusText="Ready to chat" />);
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Ready to chat",
      );
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className to wrapper", () => {
      const { container } = render(
        <StatusIndicator status="online" className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("spreads additional props", () => {
      render(
        <StatusIndicator status="online" data-testid="custom-indicator" />,
      );
      expect(screen.getByTestId("custom-indicator")).toBeInTheDocument();
    });
  });

  describe("statusIndicatorVariants", () => {
    it("generates correct classes for status", () => {
      const classes = tok(statusIndicatorVariants({ status: "online" }));
      expect(classes).toContain("bg-green-500");
    });

    it("generates correct classes for size", () => {
      const classes = tok(statusIndicatorVariants({ size: "lg" }));
      expect(classes).toContain("h-3");
      expect(classes).toContain("w-3");
    });

    it("generates correct classes for pulse", () => {
      const classes = tok(statusIndicatorVariants({ pulse: true }));
      expect(classes).toContain("animate-pulse");
    });

    it("combines multiple variants", () => {
      const classes = tok(
        statusIndicatorVariants({
          status: "online",
          size: "lg",
          pulse: true,
          glow: true,
        }),
      );
      expect(classes).toContain("bg-green-500");
      expect(classes).toContain("h-3");
      expect(classes).toContain("animate-pulse");
      expect(classes).toContain("shadow-[0_0_8px_rgba(34,197,94,0.6)]");
    });
  });
});
