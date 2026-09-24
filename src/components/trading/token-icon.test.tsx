import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TokenIcon } from "./token-icon";

/**
 * sUSD reads as USD (Casey, 2026-08-12), and that includes what a screen reader
 * says and what the initials disc draws. The art is still found by the real
 * symbol: sUSD keeps its own coin.
 */
describe("TokenIcon names the stablecoin USD", () => {
  it("announces sUSD as a USD icon, drawing sUSD's own coin", () => {
    render(<TokenIcon symbol="sUSD" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "USD icon");
    expect(img).toHaveAttribute("src", "/icons/tokens/susd.png");
  });

  it("draws US, not SU, when the art does not load", () => {
    const { container } = render(<TokenIcon symbol="sUSD" src="/missing.png" />);
    fireEvent.error(screen.getByRole("img"));
    expect(container.textContent).toBe("US");
  });

  it("leaves every other token as it is", () => {
    render(<TokenIcon symbol="USDC" />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "USDC icon");
  });
});
