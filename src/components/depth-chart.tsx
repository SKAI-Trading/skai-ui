import * as React from "react";
import { cn } from "../lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

/**
 * A point on the depth chart
 */
export interface DepthPoint {
  /** Price at this point */
  price: number;
  /** Cumulative volume at this price */
  cumulative: number;
  /** Which side of the book */
  side: "bid" | "ask";
}

/**
 * Sentiment data for market pressure display
 */
export interface SentimentData {
  /** Overall sentiment: Bullish, Bearish, or Neutral */
  sentiment: "Bullish" | "Bearish" | "Neutral";
  /** Buy pressure percentage (0-100) */
  buyPressure: number;
  /** Sell pressure percentage (0-100) */
  sellPressure: number;
}

export interface DepthChartProps {
  /** Bid depth data (price levels with cumulative volume) */
  bids: DepthPoint[];
  /** Ask depth data (price levels with cumulative volume) */
  asks: DepthPoint[];
  /** Mid price for the reference line */
  midPrice?: number;
  /** Market sentiment data */
  sentiment?: SentimentData | null;
  /** Whether the feed is live */
  isLive?: boolean;
  /** Callback when live toggle is clicked */
  onLiveToggle?: () => void;
  /** Whether data is loading */
  loading?: boolean;
  /** Height of the chart */
  height?: number | string;
  /** Custom className */
  className?: string;
  /** Bid area color */
  bidColor?: string;
  /** Ask area color */
  askColor?: string;
  /** Price precision (decimal places) */
  pricePrecision?: number;
  /** Show sentiment bar */
  showSentiment?: boolean;
  /** Show legend */
  showLegend?: boolean;
}

/**
 * DepthChart component visualizes order book depth as an area chart.
 * Shows cumulative bid/ask volume at different price levels.
 *
 * @example
 * ```tsx
 * // Basic usage with static data
 * <DepthChart
 *   bids={[
 *     { price: 49900, cumulative: 10, side: "bid" },
 *     { price: 49800, cumulative: 25, side: "bid" },
 *   ]}
 *   asks={[
 *     { price: 50100, cumulative: 8, side: "ask" },
 *     { price: 50200, cumulative: 20, side: "ask" },
 *   ]}
 *   midPrice={50000}
 * />
 *
 * // With sentiment and live toggle
 * <DepthChart
 *   bids={bidData}
 *   asks={askData}
 *   midPrice={50000}
 *   sentiment={{ sentiment: "Bullish", buyPressure: 65, sellPressure: 35 }}
 *   isLive={true}
 *   onLiveToggle={() => setIsLive(!isLive)}
 *   showSentiment={true}
 *   showLegend={true}
 * />
 * ```
 */
export const DepthChart = React.forwardRef<HTMLDivElement, DepthChartProps>(
  (
    {
      bids,
      asks,
      midPrice,
      sentiment,
      isLive = true,
      onLiveToggle,
      loading = false,
      height = 200,
      className,
      bidColor = "hsl(169, 89%, 56%)",
      askColor = "hsl(0, 84%, 60%)",
      pricePrecision = 2,
      showSentiment = true,
      showLegend = true,
    },
    ref,
  ) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    // Calculate chart dimensions
    React.useEffect(() => {
      const updateDimensions = () => {
        if (chartRef.current) {
          setDimensions({
            width: chartRef.current.offsetWidth,
            height: chartRef.current.offsetHeight,
          });
        }
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center text-muted-foreground text-sm",
            className,
          )}
          style={{ height }}
        >
          <Activity className="w-4 h-4 animate-pulse mr-2" />
          Loading depth chart...
        </div>
      );
    }

    if (bids.length === 0 && asks.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center text-muted-foreground text-sm",
            className,
          )}
          style={{ height }}
        >
          No depth data available
        </div>
      );
    }

    // Calculate bounds
    const allData = [...bids, ...asks];
    const minPrice = Math.min(...allData.map((d) => d.price));
    const maxPrice = Math.max(...allData.map((d) => d.price));
    const maxCumulative = Math.max(...allData.map((d) => d.cumulative));
    const priceRange = maxPrice - minPrice || 1;

    // SVG path generators
    const generatePath = (data: DepthPoint[], isAsk: boolean) => {
      if (data.length === 0) return "";

      const points = data.map((d) => ({
        x: ((d.price - minPrice) / priceRange) * dimensions.width,
        y:
          dimensions.height -
          (d.cumulative / maxCumulative) * (dimensions.height - 20),
      }));

      // Create step path
      let path = `M ${points[0].x} ${dimensions.height}`;
      points.forEach((point, i) => {
        if (i === 0) {
          path += ` L ${point.x} ${point.y}`;
        } else {
          // Step: horizontal then vertical
          if (isAsk) {
            path += ` L ${point.x} ${points[i - 1].y} L ${point.x} ${point.y}`;
          } else {
            path += ` L ${points[i - 1].x} ${point.y} L ${point.x} ${point.y}`;
          }
        }
      });
      path += ` L ${points[points.length - 1].x} ${dimensions.height} Z`;

      return path;
    };

    const getSentimentIcon = () => {
      if (!sentiment) return <Minus className="w-4 h-4" />;
      if (sentiment.sentiment === "Bullish")
        return <TrendingUp className="w-4 h-4 text-primary" />;
      if (sentiment.sentiment === "Bearish")
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      return <Minus className="w-4 h-4" />;
    };

    const getSentimentGradient = () => {
      if (!sentiment) return "from-muted to-muted";
      const buyPct = sentiment.buyPressure;
      if (buyPct > 60) return "from-primary to-blue-400";
      if (buyPct < 40) return "from-destructive to-pink-500";
      return "from-muted to-muted";
    };

    const calculatedMidPrice =
      midPrice ??
      (bids.length > 0 && asks.length > 0
        ? (bids[0].price + asks[0].price) / 2
        : 0);

    const midPriceX =
      ((calculatedMidPrice - minPrice) / priceRange) * dimensions.width;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col relative bg-card/40 rounded-lg",
          className,
        )}
      >
        {/* Sentiment Overlay Bar */}
        {showSentiment && sentiment && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20 overflow-hidden z-10 rounded-t-lg">
            <div
              className={cn(
                "h-full bg-gradient-to-r transition-all duration-700",
                getSentimentGradient(),
              )}
              style={{ width: `${sentiment.buyPressure}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Depth Chart</h3>
            {sentiment && (
              <div className="flex items-center gap-1 text-xs">
                {getSentimentIcon()}
                <span
                  className={cn(
                    "font-medium",
                    sentiment.sentiment === "Bullish" && "text-primary",
                    sentiment.sentiment === "Bearish" && "text-destructive",
                    sentiment.sentiment === "Neutral" &&
                      "text-muted-foreground",
                  )}
                >
                  {sentiment.sentiment}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isLive ? "bg-primary animate-pulse" : "bg-muted",
              )}
            />
            {onLiveToggle && (
              <button
                onClick={onLiveToggle}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLive ? "Live" : "Paused"}
              </button>
            )}
          </div>
        </div>

        {/* Chart Area */}
        <div
          ref={chartRef}
          className="flex-1 p-2"
          style={{ height: typeof height === "number" ? height : undefined }}
        >
          {dimensions.width > 0 && dimensions.height > 0 && (
            <svg
              width={dimensions.width}
              height={dimensions.height}
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={bidColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={bidColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={askColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={askColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Bid Area */}
              <path
                d={generatePath(bids, false)}
                fill="url(#bidGradient)"
                stroke={bidColor}
                strokeWidth={2}
              />

              {/* Ask Area */}
              <path
                d={generatePath(asks, true)}
                fill="url(#askGradient)"
                stroke={askColor}
                strokeWidth={2}
              />

              {/* Mid Price Line */}
              {calculatedMidPrice > 0 && (
                <g>
                  <line
                    x1={midPriceX}
                    y1={0}
                    x2={midPriceX}
                    y2={dimensions.height}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeOpacity={0.3}
                    className="text-foreground"
                  />
                  <text
                    x={midPriceX}
                    y={12}
                    textAnchor="middle"
                    className="fill-foreground text-[10px]"
                  >
                    ${calculatedMidPrice.toFixed(pricePrecision)}
                  </text>
                </g>
              )}
            </svg>
          )}
        </div>

        {/* Footer/Legend */}
        {showLegend && (
          <div className="p-2 border-t border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-sm"
                  style={{
                    background: `linear-gradient(to right, ${bidColor}, transparent)`,
                  }}
                />
                <span className="text-muted-foreground">Bids</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-2 rounded-sm"
                  style={{
                    background: `linear-gradient(to right, ${askColor}, transparent)`,
                  }}
                />
                <span className="text-muted-foreground">Asks</span>
              </div>
            </div>
            {sentiment && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-medium",
                    sentiment.buyPressure > sentiment.sellPressure
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {sentiment.buyPressure.toFixed(1)}% Buy
                </span>
                <span className="text-muted-foreground">/</span>
                <span
                  className={cn(
                    "font-medium",
                    sentiment.sellPressure > sentiment.buyPressure
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {sentiment.sellPressure.toFixed(1)}% Sell
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

DepthChart.displayName = "DepthChart";

/**
 * Utility function to calculate depth data from order book levels
 * @example
 * ```tsx
 * const { bids, asks } = calculateDepthFromOrderBook(orderBookData);
 * ```
 */
export function calculateDepthFromOrderBook(orderBook: {
  bids: Array<{ price: number; size: number }>;
  asks: Array<{ price: number; size: number }>;
}): { bids: DepthPoint[]; asks: DepthPoint[] } {
  const bidDepth: DepthPoint[] = [];
  const askDepth: DepthPoint[] = [];

  let bidCumulative = 0;
  for (const bid of orderBook.bids) {
    bidCumulative += bid.size;
    bidDepth.push({
      price: bid.price,
      cumulative: bidCumulative,
      side: "bid",
    });
  }

  let askCumulative = 0;
  for (let i = orderBook.asks.length - 1; i >= 0; i--) {
    askCumulative += orderBook.asks[i].size;
    askDepth.unshift({
      price: orderBook.asks[i].price,
      cumulative: askCumulative,
      side: "ask",
    });
  }

  return { bids: bidDepth, asks: askDepth };
}

export default DepthChart;
