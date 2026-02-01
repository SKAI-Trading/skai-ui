import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceDisplay } from "../components/price-display";

describe("PriceDisplay", () => {
  it("renders price with default currency symbol", () => {
    render(<PriceDisplay value={123.45} />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("123.45")).toBeInTheDocument();
  });

  it("formats with different currencies", () => {
    render(<PriceDisplay value={1234.56} currency="EUR" />);
    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText(/1,234\.56/)).toBeInTheDocument();
  });

  it("shows positive change with trend icon", () => {
    render(<PriceDisplay value={100} change={5.5} />);
    // Change is always shown when provided
    expect(screen.getByText(/\+5\.50%/)).toBeInTheDocument();
  });

  it("shows negative change with trend icon", () => {
    render(<PriceDisplay value={100} change={-3.2} />);
    expect(screen.getByText(/-3\.20%/)).toBeInTheDocument();
  });

  it("applies size classes correctly", () => {
    const { container, rerender } = render(
      <PriceDisplay value={100} size="sm" />,
    );
    expect(container.querySelector("span")).toHaveClass("text-sm");

    rerender(<PriceDisplay value={100} size="lg" />);
    expect(container.querySelector("span")).toHaveClass("text-lg");
  });

  it("uses compact notation for large numbers", () => {
    render(<PriceDisplay value={1500000} compact />);
    expect(screen.getByText("1.50M")).toBeInTheDocument();
  });

  it("shows sign for positive values when enabled", () => {
    const { container } = render(<PriceDisplay value={100} showSign />);
    expect(container.textContent).toContain("+");
  });

  it("positions currency as suffix when specified", () => {
    render(
      <PriceDisplay value={100} currency="ETH" currencyPosition="suffix" />,
    );
    const ethText = screen.getByText("ETH");
    expect(ethText).toBeInTheDocument();
  });

  it("handles very small prices with more decimals", () => {
    render(<PriceDisplay value={0.00001234} />);
    // Smart decimals increase for small numbers
    expect(screen.getByText(/0\.000012/)).toBeInTheDocument();
  });

  it("handles zero value", () => {
    render(<PriceDisplay value={0} />);
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
  });

  it("handles NaN gracefully", () => {
    render(<PriceDisplay value={NaN} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("applies trend colors", () => {
    const { container, rerender } = render(
      <PriceDisplay value={100} trend="up" />,
    );
    expect(container.querySelector("span")).toHaveClass("text-green-500");

    rerender(<PriceDisplay value={100} trend="down" />);
    expect(container.querySelector("span")).toHaveClass("text-red-500");
  });
});
