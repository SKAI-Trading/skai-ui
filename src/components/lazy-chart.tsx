import * as React from "react";
import { cn } from "../lib/utils";
import { Skeleton } from "./skeleton";

/**
 * Lazy-loaded chart wrapper that dynamically imports recharts
 * This can save ~400KB from the initial bundle
 */

// Types for the chart data
export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface LazyChartProps {
  /** Chart data */
  data: ChartDataPoint[];
  /** Chart type */
  type: "line" | "area" | "bar";
  /** Data key for X axis */
  xKey: string;
  /** Data key(s) for Y axis */
  yKeys: string[];
  /** Colors for each Y key */
  colors?: string[];
  /** Height of the chart */
  height?: number | string;
  /** Custom className */
  className?: string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Animation enabled */
  animate?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
}

// The actual chart component that uses recharts
const RechartsChart = React.lazy(() =>
  import("recharts").then((module) => ({
    default: ({
      data,
      type,
      xKey,
      yKeys,
      colors = ["hsl(169, 89%, 56%)", "hsl(0, 84%, 60%)", "hsl(45, 93%, 47%)"],
      height = 300,
      showGrid = true,
      showTooltip = true,
      showLegend = false,
      animate = true,
    }: Omit<LazyChartProps, "className" | "loadingComponent">) => {
      const {
        ResponsiveContainer,
        LineChart,
        AreaChart,
        BarChart,
        Line,
        Area,
        Bar,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        Legend,
      } = module;

      const ChartComponent =
        type === "line" ? LineChart : type === "area" ? AreaChart : BarChart;

      // Note: DataComponent not used directly - we use the specific components inline
      // for better type safety with their respective props

      return (
        <ResponsiveContainer
          width="100%"
          height={typeof height === "number" ? height : 300}
        >
          <ChartComponent data={data}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(222, 20%, 20%)"
              />
            )}
            <XAxis
              dataKey={xKey}
              tick={{ fill: "hsl(180, 20%, 70%)", fontSize: 12 }}
              stroke="hsl(222, 20%, 20%)"
            />
            <YAxis
              tick={{ fill: "hsl(180, 20%, 70%)", fontSize: 12 }}
              stroke="hsl(222, 20%, 20%)"
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 11%)",
                  border: "1px solid hsl(222, 20%, 20%)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(180, 100%, 98%)" }}
              />
            )}
            {showLegend && <Legend />}
            {yKeys.map((key, index) => {
              const color = colors[index % colors.length];
              if (type === "area") {
                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.3}
                    isAnimationActive={animate}
                  />
                );
              }
              if (type === "bar") {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={color}
                    isAnimationActive={animate}
                  />
                );
              }
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={animate}
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      );
    },
  })),
);

/**
 * LazyChart component that dynamically loads recharts.
 * Reduces initial bundle size by ~400KB.
 *
 * @example
 * ```tsx
 * // Line chart
 * <LazyChart
 *   type="line"
 *   data={priceData}
 *   xKey="time"
 *   yKeys={["price"]}
 *   colors={["#2cecad"]}
 * />
 *
 * // Area chart with multiple series
 * <LazyChart
 *   type="area"
 *   data={volumeData}
 *   xKey="date"
 *   yKeys={["buy", "sell"]}
 *   colors={["#2cecad", "#ef4444"]}
 *   showLegend={true}
 * />
 *
 * // Bar chart
 * <LazyChart
 *   type="bar"
 *   data={stats}
 *   xKey="month"
 *   yKeys={["volume"]}
 *   height={200}
 * />
 * ```
 */
export const LazyChart = React.forwardRef<HTMLDivElement, LazyChartProps>(
  ({ className, loadingComponent, height = 300, ...props }, ref) => {
    const fallback = loadingComponent || (
      <div
        className="flex items-center justify-center"
        style={{ height: typeof height === "number" ? height : 300 }}
      >
        <div className="w-full space-y-3 p-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-[200px] w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    );

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <React.Suspense fallback={fallback}>
          <RechartsChart height={height} {...props} />
        </React.Suspense>
      </div>
    );
  },
);

LazyChart.displayName = "LazyChart";

export default LazyChart;
