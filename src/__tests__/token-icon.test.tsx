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

  it("recovers from an error state when the image URL changes", () => {
    // Regression: hasError used to persist across symbol/src swaps, so a token
    // whose icon errored kept showing the fallback even after switching to a
    // valid token.
    const { rerender } = render(
      <TokenIcon symbol="TEST" src="https://example.com/broken.png" />,
    );
    fireEvent.error(screen.getByRole("img"));
    // Fallback initials are shown after the error.
    expect(screen.getByText("TE")).toBeInTheDocument();

    // Swap to a new image URL — the component should reset and try to render
    // the image again instead of staying on the fallback.
    rerender(
      <TokenIcon symbol="NEW" src="https://example.com/working.png" />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/working.png");
  });
});

/**
 * Report 1e78983e — "the Ticker icons in portfolio are very blurry".
 *
 * The reporter asked for PNGs; the icons already WERE PNGs, so the fix is not a
 * format change. CoinGecko serves each asset at three fixed sizes chosen by the
 * path segment, and the built-in map was pinned to the 50px one while the
 * widest slot paints 40 CSS px — 80 physical px on the 2x display the report's
 * screenshot was taken on.
 *
 * These sizes are an INDEPENDENT ORACLE, not a re-read of the source: they were
 * measured on 2026-08-13 by fetching all 14 URLs and reading the decoded image
 * dimensions, so this table cannot drift into agreement with a regression the
 * way a constant imported from the component would.
 */
const COINGECKO_VARIANT_PX: Record<string, number> = {
  thumb: 25,
  small: 50,
  large: 250,
};

/** Widest slot the component paints (`sizeMap.xl`), at a 2x device pixel ratio. */
const WIDEST_SLOT_PHYSICAL_PX = 40 * 2;

describe("TokenIcon — built-in art is high enough resolution for its slot", () => {
  const BUILT_IN_SYMBOLS = [
    "ETH", "WETH", "BTC", "WBTC", "USDC", "USDT", "DAI",
    "SOL", "MATIC", "ARB", "OP", "LINK", "UNI", "AAVE",
  ];

  it.each(BUILT_IN_SYMBOLS)(
    "%s resolves to art at least as wide as the widest slot it is painted in",
    (symbol) => {
      render(<TokenIcon symbol={symbol} />);
      // Assert on the RENDERED src — the artifact the browser actually fetches —
      // rather than on the TOKEN_ICONS map, so wiring the map to the <img>
      // incorrectly would also fail here.
      const src = screen.getByRole("img").getAttribute("src") ?? "";

      const variant = src.match(
        /assets\.coingecko\.com\/coins\/images\/\d+\/([a-z]+)\//,
      )?.[1];
      expect(
        variant,
        `${symbol} should resolve to a recognised CoinGecko size variant, got: ${src}`,
      ).toBeDefined();

      const px = COINGECKO_VARIANT_PX[variant as string];
      expect(
        px,
        `${symbol} uses unknown CoinGecko variant "${variant}" — add its measured size to COINGECKO_VARIANT_PX`,
      ).toBeDefined();

      // Reverting any URL to /small/ (50px) or /thumb/ (25px) fails here.
      expect(
        px,
        `${symbol} ships ${px}px art into an ${WIDEST_SLOT_PHYSICAL_PX}px physical slot — it will render blurry (report 1e78983e)`,
      ).toBeGreaterThanOrEqual(WIDEST_SLOT_PHYSICAL_PX);
    },
  );
});
