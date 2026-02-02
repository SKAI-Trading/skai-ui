import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TokenIcon } from "../components/trading/token-icon";

describe("TokenIcon", () => {
  it("renders with known token symbol", () => {
    render(<TokenIcon symbol="ETH" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "ETH icon");
  });

  it("shows fallback with initials for unknown token", () => {
    render(<TokenIcon symbol="UNKNOWN" />);
    // Unknown tokens without known URLs show fallback with initials
    expect(screen.getByText("UN")).toBeInTheDocument();
  });

  it("shows image for known token", () => {
    render(<TokenIcon symbol="ETH" />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src");
  });

  it("applies showBorder class when enabled", () => {
    render(<TokenIcon symbol="ETH" showBorder />);
    const container = screen.getByRole("img").closest("div");
    expect(container).toHaveClass("ring-2");
  });

  it("uses custom src when provided", () => {
    render(<TokenIcon symbol="TEST" src="https://example.com/icon.png" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/icon.png");
  });

  it("uses pixel size when number is provided", () => {
    render(<TokenIcon symbol="ETH" size={48} />);
    const container = screen.getByRole("img").closest("div");
    expect(container).toHaveStyle({ width: "48px", height: "48px" });
  });

  it("generates consistent fallback colors", () => {
    // For unknown tokens, we get the fallback directly
    const { rerender } = render(<TokenIcon symbol="RANDOMTOKEN" />);
    const container1 = screen.getByText("RA").closest("div");
    const color1 = container1?.style.backgroundColor;

    rerender(<TokenIcon symbol="RANDOMTOKEN" />);
    const container2 = screen.getByText("RA").closest("div");
    const color2 = container2?.style.backgroundColor;

    expect(color1).toBe(color2);
  });

  it("handles image load error gracefully", async () => {
    render(<TokenIcon symbol="ETH" />);
    const img = screen.getByRole("img");

    // Trigger error event
    fireEvent.error(img);

    // Should show fallback after error
    expect(screen.getByText("ET")).toBeInTheDocument();
  });
});
