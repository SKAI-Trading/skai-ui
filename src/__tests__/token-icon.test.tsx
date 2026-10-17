import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useLayoutEffect, useRef, type ReactNode } from "react";
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
 * Every reopen of the wallet's Send sheet left its seven token marks on their
 * placeholder discs, on wallet.skai.trade and in the app's mini wallet. The
 * first open drew all of them.
 *
 * Art the browser already holds is complete as soon as the <img> gets its src,
 * and its load event is queued at once, so it reaches the element right after
 * the commit and ahead of the passive effects. The component used to reset its
 * loading flag from such an effect whenever the URL changed, mount included:
 * the reset landed after the load, and no second load ever came.
 *
 * jsdom loads no images, so two things stand in for the browser: `holdArt`
 * makes every <img> report what art already in memory reports, and
 * `DeliverAtCommit` dispatches an event at its images from a layout effect,
 * which runs where the browser's queued load lands.
 */
function holdArt(naturalWidth: number) {
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(
    naturalWidth,
  );
}

function DeliverAtCommit({
  type,
  children,
}: {
  type: "load" | "error";
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    box.current
      ?.querySelectorAll("img")
      .forEach((img) => img.dispatchEvent(new Event(type)));
  }, [type]);
  return <div ref={box}>{children}</div>;
}

function expectDrawn(container: HTMLElement) {
  const marks = container.querySelectorAll("img");
  expect(marks.length).toBeGreaterThan(0);
  marks.forEach((img) => expect(img).not.toHaveClass("opacity-0"));
  expect(container.querySelector(".animate-pulse")).toBeNull();
}

// The Send sheet's marks: four chain chips, then three token rows, all bundled
// files the browser keeps once the first open has fetched them.
const SEND_SHEET_MARKS: Array<[string, string]> = [
  ["SKAI", "/icons/tokens/skai.png"],
  ["BASE", "/icons/tokens/base.png"],
  ["ETH", "/icons/tokens/eth.png"],
  ["POL", "/icons/tokens/polygon.png"],
  ["ETH", "/icons/tokens/eth.png"],
  ["ETH", "/icons/tokens/eth.png"],
  ["POL", "/icons/tokens/polygon.png"],
];

function SendSheet({ open, held }: { open: boolean; held: boolean }) {
  if (!open) return null;
  const marks = SEND_SHEET_MARKS.map(([symbol, src], i) => (
    <TokenIcon key={i} symbol={symbol} src={src} />
  ));
  return held ? (
    <DeliverAtCommit type="load">{marks}</DeliverAtCommit>
  ) : (
    <div>{marks}</div>
  );
}

describe("TokenIcon — art the browser already holds is drawn, not left on its placeholder", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("draws a mark whose art is complete before any load event", () => {
    holdArt(250);
    const { container } = render(<TokenIcon symbol="ETH" />);
    expectDrawn(container);
  });

  it("keeps a load that lands before the effects run", () => {
    const { container } = render(
      <DeliverAtCommit type="load">
        <TokenIcon symbol="ETH" />
      </DeliverAtCommit>,
    );
    expectDrawn(container);
  });

  it("draws all seven Send sheet marks again when the sheet is reopened", () => {
    const { container, rerender } = render(<SendSheet open held={false} />);
    // First open: the art comes off the network, after the effects.
    container.querySelectorAll("img").forEach((img) => fireEvent.load(img));
    expect(container.querySelectorAll("img")).toHaveLength(7);
    expectDrawn(container);

    rerender(<SendSheet open={false} held={false} />);
    expect(container.querySelector("img")).toBeNull();

    // Reopen: every file is already held.
    holdArt(64);
    rerender(<SendSheet open held />);
    expect(container.querySelectorAll("img")).toHaveLength(7);
    expectDrawn(container);
  });

  it("never draws a broken image as loaded", () => {
    // A broken image is complete too, but it has no natural size.
    holdArt(0);
    const { container } = render(<TokenIcon symbol="ETH" />);
    const img = screen.getByRole("img");
    expect(img).toHaveClass("opacity-0");
    expect(container.querySelector(".animate-pulse")).not.toBeNull();

    fireEvent.error(img);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("ET")).toBeInTheDocument();
  });

  it("keeps an error that lands before the effects run", () => {
    const { container } = render(
      <DeliverAtCommit type="error">
        <TokenIcon symbol="ETH" />
      </DeliverAtCommit>,
    );
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("ET")).toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("waits for the new art after the URL changes", () => {
    const { container, rerender } = render(
      <TokenIcon symbol="ETH" src="https://example.com/a.png" />,
    );
    fireEvent.load(screen.getByRole("img"));
    expectDrawn(container);

    rerender(<TokenIcon symbol="ETH" src="https://example.com/b.png" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/b.png");
    expect(img).toHaveClass("opacity-0");
    expect(container.querySelector(".animate-pulse")).not.toBeNull();

    fireEvent.load(img);
    expectDrawn(container);
  });

  it("does not draw the new art on a late load of the old one", () => {
    const { container, rerender } = render(
      <TokenIcon symbol="ETH" src="https://example.com/a.png" />,
    );
    const previous = screen.getByRole("img");

    rerender(<TokenIcon symbol="ETH" src="https://example.com/b.png" />);
    fireEvent.load(previous);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/b.png");
    expect(img).toHaveClass("opacity-0");
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
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

/**
 * Report bd9e3b2c — "the Skai ticker preview images have the old logo that is
 * squished".
 *
 * INDEPENDENT ORACLE. These aspect ratios are not read back out of the
 * component; they were measured on 2026-08-13 from the committed artwork:
 *
 *   main app  public/skai-logo-mark.svg          width 57  height 64,
 *                                                viewBox "0 0 57.1 64"  -> 0.892
 *   wallet    src/assets/wallet/skai-mark.svg    viewBox "0 0 28.9126 32" -> 0.903
 *   CoinGecko every URL in TOKEN_ICONS                                    -> 1.000
 *
 * and cross-checked against the reporter's 2x screenshot, where the blue pixels
 * of the SKAI and sUSD marks measured 64x64 (ratio 1.000) instead of the 58x64
 * (ratio 0.906) the same asset occupies when it is drawn un-cropped.
 *
 * `object-cover` on a portrait source in a square box clips the overflow off
 * the top and bottom, which is what produced the 1.000. `object-contain` fits
 * it whole. Square sources are unaffected either way, so cover stays for them —
 * they rely on it to fill the circle to its edges.
 */
describe("TokenIcon — non-square brand art is fitted, not cropped", () => {
  const PORTRAIT_SOURCES = [
    // How the main app and @skai/ui's own TOKEN_ICONS map spell it.
    "/skai-logo-mark.svg",
    // How skai-wallet bundles the same bolt: Vite content-hashes the filename.
    "/assets/skai-mark-DhK2p9xQ.svg",
    "/assets/wallet/skai-mark.svg",
  ];

  it.each(PORTRAIT_SOURCES)(
    "fits %s instead of cropping it",
    (src) => {
      render(<TokenIcon symbol="SKAI" src={src} />);
      const img = screen.getByRole("img");
      // Assert on the rendered class — the artifact that decides the pixels —
      // and on BOTH halves: contain present, cover absent. Asserting only the
      // absence of cover would also pass if the class list were empty.
      expect(img).toHaveClass("object-contain");
      expect(img).not.toHaveClass("object-cover");
    },
  );

  it.each(["ETH", "BTC", "USDC"])(
    "keeps %s (square CoinGecko art) on object-cover so it fills the circle",
    (symbol) => {
      // Positive twin for the assertion above: same two literals, opposite
      // condition. Without this, changing the component to emit `object-contain`
      // unconditionally would still pass the portrait cases.
      render(<TokenIcon symbol={symbol} />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("object-cover");
      expect(img).not.toHaveClass("object-contain");
    },
  );

  it("fits the SKAI and sUSD marks resolved from the built-in map", () => {
    // The built-in map is the path the wallet and the trade surfaces take when
    // no `src` override is passed, so it needs its own coverage: a regression
    // that only rewired the map would not be caught by the `src` cases above.
    const { rerender } = render(<TokenIcon symbol="SKAI" />);
    expect(screen.getByRole("img")).toHaveClass("object-contain");

    // sUSD draws its own square coin, which fills the circle like any other
    // coin image; it is not SKAI's bolt.
    rerender(<TokenIcon symbol="sUSD" />);
    const susd = screen.getByRole("img");
    expect(susd).toHaveAttribute("src", "/icons/tokens/susd.png");
    expect(susd).toHaveClass("object-cover");
  });
});
