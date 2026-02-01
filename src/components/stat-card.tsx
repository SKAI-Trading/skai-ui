import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title/label for the stat */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Percentage or value change */
  change?: number;
  /** Period for the change (e.g., "24h", "7d") */
  changePeriod?: string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Trend direction (auto-calculated from change if not provided) */
  trend?: "up" | "down" | "neutral";
  /** Loading state */
  loading?: boolean;
  /** Compact variant */
  compact?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      subtitle,
      change,
      changePeriod = "24h",
      icon,
      trend: propTrend,
      loading = false,
      compact = false,
      className,
      ...props
    },
    ref,
  ) => {
    const trend =
      propTrend ??
      (change !== undefined
        ? change > 0
          ? "up"
          : change < 0
            ? "down"
            : "neutral"
        : undefined);

    const TrendIcon =
      trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

    const trendColor =
      trend === "up"
        ? "text-green-500"
        : trend === "down"
          ? "text-red-500"
          : "text-muted-foreground";

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border bg-card",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">{title}</p>
              {loading ? (
                <div className="h-5 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <p className="font-semibold">{value}</p>
              )}
            </div>
          </div>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <Card ref={ref} className={className} {...props}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {(change !== undefined || subtitle) && (
                <div className="flex items-center gap-2 mt-1">
                  {change !== undefined && (
                    <span
                      className={cn("flex items-center text-xs", trendColor)}
                    >
                      <TrendIcon className="h-3 w-3 mr-0.5" />
                      {change > 0 ? "+" : ""}
                      {change.toFixed(2)}%
                      {changePeriod && (
                        <span className="text-muted-foreground ml-1">
                          {changePeriod}
                        </span>
                      )}
                    </span>
                  )}
                  {subtitle && (
                    <span className="text-xs text-muted-foreground">
                      {subtitle}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  },
);

StatCard.displayName = "StatCard";

export { StatCard };
