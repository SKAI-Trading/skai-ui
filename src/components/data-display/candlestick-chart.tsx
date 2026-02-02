"use client";

import * as React from "react";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
  ColorType,
  type MouseEventParams,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import { cn } from "../../lib/utils";

interface CandlestickChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** OHLC data for the chart */
  data: CandlestickData<Time>[];
  /** Chart height in pixels */
  height?: number;
  /** Show volume bars */
  showVolume?: boolean;
  /** Volume data (optional, will be shown as histogram) */
  volumeData?: { time: Time; value: number; color?: string }[];
  /** Up candle color */
  upColor?: string;
  /** Down candle color */
  downColor?: string;
  /** Wick up color */
  wickUpColor?: string;
  /** Wick down color */
  wickDownColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Show crosshair */
  crosshair?: boolean;
  /** Enable zoom/pan */
  handleScroll?: boolean;
  /** Enable pinch zoom */
  handleScale?: boolean;
  /** Price format */
  priceFormat?: {
    type?: "price" | "volume" | "percent";
    precision?: number;
    minMove?: number;
  };
  /** Time visible options */
  timeVisible?: boolean;
  /** Seconds visible */
  secondsVisible?: boolean;
  /** Callback when crosshair moves */
  onCrosshairMove?: (price: number | null, time: Time | null) => void;
  /** Auto-resize on container change */
  autoResize?: boolean;
}

/**
 * CandlestickChart - TradingView-style OHLC candlestick chart
 *
 * Built on top of Lightweight Charts for optimal performance.
 *
 * @example
 * const data = [
 *   { time: '2024-01-01', open: 100, high: 105, low: 98, close: 103 },
 *   { time: '2024-01-02', open: 103, high: 110, low: 101, close: 108 },
 * ];
 *
 * <CandlestickChart data={data} height={400} />
 */
const CandlestickChart = React.forwardRef<
  HTMLDivElement,
  CandlestickChartProps
>(
  (
    {
      data,
      height = 400,
      showVolume = false,
      volumeData,
      upColor = "#22c55e",
      downColor = "#ef4444",
      wickUpColor = "#22c55e",
      wickDownColor = "#ef4444",
      backgroundColor = "transparent",
      textColor = "#9ca3af",
      gridColor = "#1f2937",
      crosshair = true,
      handleScroll = true,
      handleScale = true,
      priceFormat,
      timeVisible = true,
      secondsVisible = false,
      onCrosshairMove,
      autoResize = true,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const chartRef = React.useRef<IChartApi | null>(null);
    const candlestickSeriesRef = React.useRef<ISeriesApi<"Candlestick"> | null>(
      null,
    );
    const volumeSeriesRef = React.useRef<ISeriesApi<"Histogram"> | null>(null);

    // Initialize chart
    React.useEffect(() => {
      if (!containerRef.current) return;

      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
        crosshair: crosshair
          ? {
              mode: 0, // Normal mode
              vertLine: {
                width: 1,
                color: "#6b7280",
                style: 2, // Dashed
              },
              horzLine: {
                width: 1,
                color: "#6b7280",
                style: 2,
              },
            }
          : {
              mode: 2, // Hidden
            },
        handleScroll,
        handleScale,
        timeScale: {
          timeVisible,
          secondsVisible,
          borderColor: gridColor,
        },
        rightPriceScale: {
          borderColor: gridColor,
        },
      });

      chartRef.current = chart;

      // Add candlestick series (v5 API uses addSeries with series class)
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor,
        downColor,
        wickUpColor,
        wickDownColor,
        borderVisible: false,
        priceFormat: priceFormat || {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
      });

      candlestickSeriesRef.current = candlestickSeries;
      candlestickSeries.setData(data);

      // Add volume series if enabled
      if (showVolume && volumeData) {
        const volumeSeries = chart.addSeries(HistogramSeries, {
          color: "#26a69a",
          priceFormat: {
            type: "volume",
          },
          priceScaleId: "",
        });

        volumeSeries.priceScale().applyOptions({
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });

        volumeSeriesRef.current = volumeSeries;
        volumeSeries.setData(volumeData);
      }

      // Fit content
      chart.timeScale().fitContent();

      // Subscribe to crosshair move
      if (onCrosshairMove) {
        chart.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
          if (param.time && param.seriesData.size > 0) {
            const data = param.seriesData.get(candlestickSeries);
            if (data && "close" in data) {
              onCrosshairMove(
                (data as CandlestickData<Time>).close,
                param.time,
              );
            }
          } else {
            onCrosshairMove(null, null);
          }
        });
      }

      // Auto-resize
      if (autoResize) {
        const resizeObserver = new ResizeObserver((entries) => {
          if (
            entries.length === 0 ||
            entries[0].target !== containerRef.current
          ) {
            return;
          }
          const { width } = entries[0].contentRect;
          chart.applyOptions({ width });
        });

        resizeObserver.observe(containerRef.current);

        return () => {
          resizeObserver.disconnect();
          chart.remove();
        };
      }

      return () => {
        chart.remove();
      };
    }, []); // Only run once on mount

    // Update data when it changes
    React.useEffect(() => {
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(data);
        chartRef.current?.timeScale().fitContent();
      }
    }, [data]);

    // Update volume data when it changes
    React.useEffect(() => {
      if (volumeSeriesRef.current && volumeData) {
        volumeSeriesRef.current.setData(volumeData);
      }
    }, [volumeData]);

    // Combine refs
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    return (
      <div
        ref={containerRef}
        className={cn("w-full", className)}
        style={{ height }}
        {...props}
      />
    );
  },
);

CandlestickChart.displayName = "CandlestickChart";

// Helper to format OHLC data from API responses
function formatCandleData(
  candles: Array<{
    timestamp: number | string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }>,
): {
  candleData: CandlestickData<Time>[];
  volumeData: { time: Time; value: number; color: string }[];
} {
  const candleData: CandlestickData<Time>[] = [];
  const volumeData: { time: Time; value: number; color: string }[] = [];

  for (const candle of candles) {
    const time = (
      typeof candle.timestamp === "number"
        ? Math.floor(candle.timestamp / 1000)
        : candle.timestamp
    ) as Time;

    candleData.push({
      time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    });

    if (candle.volume !== undefined) {
      volumeData.push({
        time,
        value: candle.volume,
        color: candle.close >= candle.open ? "#22c55e80" : "#ef444480",
      });
    }
  }

  return { candleData, volumeData };
}

export { CandlestickChart, formatCandleData };
export type { CandlestickChartProps };
