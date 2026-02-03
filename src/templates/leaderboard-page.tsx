/**
 * LeaderboardPageTemplate - Token Leaderboard Page
 *
 * Pure presentational component for displaying token rankings.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - Top 3 podium display (gold/silver/bronze)
 * - Stats overview cards (market cap, volume, holders, count)
 * - Sortable rankings table
 * - Rank badges with icons
 * - Loading skeleton
 * - Empty state
 *
 * @module templates/leaderboard-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";
import { Skeleton } from "../components/feedback/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Coins,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type SortMetric =
  | "market_cap"
  | "volume"
  | "holders"
  | "price_change"
  | "newest";

export type TimeFrame = "24h" | "7d" | "30d" | "all";

export interface LeaderboardToken {
  id: string;
  name: string;
  symbol: string;
  avatarUrl?: string;
  price: number;
  priceChange24h?: number;
  marketCap?: number;
  totalVolume?: number;
  holderCount?: number;
  createdAt?: string;
  ownerUsername?: string;
  verified?: boolean;
}

export interface LeaderboardStats {
  totalMarketCap: number;
  totalVolume: number;
  totalHolders: number;
  tokenCount: number;
}

export interface LeaderboardPageTemplateProps {
  /** Array of tokens to display in the leaderboard */
  tokens: LeaderboardToken[];
  /** Aggregated stats for the header cards */
  stats: LeaderboardStats;
  /** Current sort metric */
  sortMetric: SortMetric;
  /** Current time frame filter */
  timeFrame?: TimeFrame;
  /** Whether data is loading */
  isLoading: boolean;
  /** Error message if any */
  error?: string | null;
  /** Callback when sort metric changes */
  onSortChange: (metric: SortMetric) => void;
  /** Callback when time frame changes */
  onTimeFrameChange?: (timeFrame: TimeFrame) => void;
  /** Callback when a token row is clicked */
  onTokenClick: (token: LeaderboardToken) => void;
  /** Callback for Discover button */
  onDiscoverClick: () => void;
  /** Callback for Create Token button */
  onCreateTokenClick: () => void;
  /** Format number function */
  formatNumber?: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** Format currency function */
  formatCurrency?: (value: number) => string;
  /** Optional class name */
  className?: string;
  /** Whether to show the top 3 podium */
  showPodium?: boolean;
  /** Whether to show time frame selector */
  showTimeFrameSelector?: boolean;
  /** Custom page title */
  title?: string;
  /** Custom page subtitle */
  subtitle?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Rank badge with special styling for top 3
 */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
        <Crown className="h-5 w-5 text-yellow-500" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/20">
        <Medal className="h-5 w-5 text-slate-400" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/20">
        <Medal className="h-5 w-5 text-amber-700" />
      </div>
    );
  }
  return (
    <span className="w-8 text-center font-medium text-muted-foreground">{rank}</span>
  );
}

/**
 * Price change indicator with arrow
 */
function PriceChangeIndicator({
  change,
  className,
}: {
  change?: number;
  className?: string;
}) {
  if (change === undefined || change === null) {
    return <span className="text-muted-foreground">-</span>;
  }

  const isPositive = change >= 0;
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "flex items-center gap-1",
        isPositive ? "text-green-500" : "text-red-500",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(change).toFixed(2)}%
    </span>
  );
}

/**
 * Individual token row in the leaderboard
 */
function TokenRow({
  token,
  rank,
  metric,
  onClick,
  formatNumber,
}: {
  token: LeaderboardToken;
  rank: number;
  metric: SortMetric;
  onClick: () => void;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}) {
  const getMetricValue = () => {
    switch (metric) {
      case "market_cap":
        return token.marketCap !== undefined
          ? `$${formatNumber(token.marketCap, { maximumFractionDigits: 0 })}`
          : "-";
      case "volume":
        return token.totalVolume !== undefined
          ? `$${formatNumber(token.totalVolume, { maximumFractionDigits: 0 })}`
          : "-";
      case "holders":
        return token.holderCount !== undefined
          ? formatNumber(token.holderCount, { maximumFractionDigits: 0 })
          : "-";
      case "price_change":
        return token.priceChange24h !== undefined ? (
          <PriceChangeIndicator change={token.priceChange24h} />
        ) : (
          "-"
        );
      case "newest":
        return token.createdAt ? new Date(token.createdAt).toLocaleDateString() : "-";
      default:
        return "-";
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-muted/50"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <RankBadge rank={rank} />

      <Avatar className="h-10 w-10">
        <AvatarImage src={token.avatarUrl} alt={token.name} />
        <AvatarFallback>
          {token.symbol?.slice(0, 2).toUpperCase() || "??"}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{token.name}</span>
          {token.verified && (
            <Badge variant="secondary" className="text-xs">
              Verified
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">${token.symbol}</span>
      </div>

      <div className="text-right">
        <div className="font-medium">
          $
          {formatNumber(token.price, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </div>
        <PriceChangeIndicator
          change={token.priceChange24h}
          className="justify-end text-sm"
        />
      </div>

      <div className="hidden min-w-[100px] text-right sm:block">
        <div className="text-sm text-muted-foreground">
          {metric === "market_cap"
            ? "Market Cap"
            : metric === "volume"
              ? "Volume"
              : metric === "holders"
                ? "Holders"
                : metric === "price_change"
                  ? "Change"
                  : "Created"}
        </div>
        <div className="font-medium">{getMetricValue()}</div>
      </div>
    </div>
  );
}

/**
 * Top 3 podium display (2nd, 1st, 3rd arrangement)
 */
function TopThreePodium({
  tokens,
  onTokenClick,
  formatNumber,
}: {
  tokens: LeaderboardToken[];
  onTokenClick: (token: LeaderboardToken) => void;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}) {
  if (tokens.length < 3) return null;

  const [first, second, third] = tokens;

  const podiumOrder = [
    {
      token: second,
      rank: 2,
      height: "h-24",
      bg: "bg-slate-400/10",
      color: "text-slate-400",
    },
    {
      token: first,
      rank: 1,
      height: "h-32",
      bg: "bg-yellow-500/10",
      color: "text-yellow-500",
    },
    {
      token: third,
      rank: 3,
      height: "h-20",
      bg: "bg-amber-700/10",
      color: "text-amber-700",
    },
  ];

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 items-end gap-4">
          {podiumOrder.map(({ token, rank, height, bg, color }) => (
            <div
              key={token.id}
              className="flex cursor-pointer flex-col items-center"
              onClick={() => onTokenClick(token)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onTokenClick(token)}
            >
              <div className="relative mb-2">
                <Avatar
                  className={cn(
                    "border-2",
                    rank === 1
                      ? "h-20 w-20 border-yellow-500"
                      : rank === 2
                        ? "h-16 w-16 border-slate-400"
                        : "h-14 w-14 border-amber-700"
                  )}
                >
                  <AvatarImage src={token.avatarUrl} alt={token.name} />
                  <AvatarFallback>
                    {token.symbol?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full",
                    bg
                  )}
                >
                  {rank === 1 ? (
                    <Crown className={cn("h-4 w-4", color)} />
                  ) : (
                    <Medal className={cn("h-4 w-4", color)} />
                  )}
                </div>
              </div>

              <div className="mb-2 text-center">
                <p className="max-w-[120px] truncate font-semibold">{token.name}</p>
                <p className="text-sm text-muted-foreground">${token.symbol}</p>
              </div>

              <div
                className={cn(
                  "flex w-full flex-col items-center justify-end rounded-t-lg p-4",
                  height,
                  bg
                )}
              >
                <span className={cn("text-2xl font-bold", color)}>#{rank}</span>
                <span className="text-sm text-muted-foreground">
                  ${formatNumber(token.marketCap || 0, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Stats card component
 */
function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function LeaderboardPageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b p-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="text-right">
                <Skeleton className="mb-1 h-5 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>
              <div className="hidden text-right sm:block">
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-16 text-center">
        <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
        <h2 className="mb-2 text-xl font-semibold">No Tokens Yet</h2>
        <p className="mb-4 text-muted-foreground">
          Be the first to create a social token and claim the #1 spot!
        </p>
        <Button onClick={onCreateClick}>Create Your Token</Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ERROR STATE
// ============================================================================

function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <TrendingDown className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Unable to Load Leaderboard</h2>
        <p className="mb-4 text-muted-foreground">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const defaultFormatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat("en-US", options).format(value);
};

export function LeaderboardPageTemplate({
  tokens,
  stats,
  sortMetric,
  timeFrame,
  isLoading,
  error,
  onSortChange,
  onTimeFrameChange,
  onTokenClick,
  onDiscoverClick,
  onCreateTokenClick,
  formatNumber = defaultFormatNumber,
  className,
  showPodium = true,
  showTimeFrameSelector = false,
  title = "Token Leaderboard",
  subtitle = "Top social tokens ranked by market cap, volume, and holders",
}: LeaderboardPageTemplateProps) {
  // Show skeleton while loading
  if (isLoading) {
    return <LeaderboardPageSkeleton />;
  }

  return (
    <div className={cn("container mx-auto max-w-6xl px-4 py-8", className)}>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onDiscoverClick}>
            <Sparkles className="mr-2 h-4 w-4" />
            Discover
          </Button>
          <Button onClick={onCreateTokenClick}>
            <Coins className="mr-2 h-4 w-4" />
            Create Token
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label="Total Market Cap"
          value={`$${formatNumber(stats.totalMarketCap, { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Volume"
          value={`$${formatNumber(stats.totalVolume, { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          icon={Users}
          label="Total Holders"
          value={formatNumber(stats.totalHolders, { maximumFractionDigits: 0 })}
        />
        <StatCard icon={Coins} label="Total Tokens" value={String(stats.tokenCount)} />
      </div>

      {/* Error State */}
      {error && <ErrorState error={error} />}

      {/* Empty State */}
      {!error && tokens.length === 0 && (
        <EmptyState onCreateClick={onCreateTokenClick} />
      )}

      {/* Content */}
      {!error && tokens.length > 0 && (
        <>
          {/* Top 3 Podium (only for market cap) */}
          {showPodium && sortMetric === "market_cap" && tokens.length >= 3 && (
            <TopThreePodium
              tokens={tokens.slice(0, 3)}
              onTokenClick={onTokenClick}
              formatNumber={formatNumber}
            />
          )}

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <CardTitle>Rankings</CardTitle>
                <div className="flex gap-2">
                  {showTimeFrameSelector && onTimeFrameChange && (
                    <Select
                      value={timeFrame}
                      onValueChange={(v) => onTimeFrameChange(v as TimeFrame)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24h</SelectItem>
                        <SelectItem value="7d">7d</SelectItem>
                        <SelectItem value="30d">30d</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Select
                    value={sortMetric}
                    onValueChange={(v) => onSortChange(v as SortMetric)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market_cap">Market Cap</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="holders">Holders</SelectItem>
                      <SelectItem value="price_change">Price Change</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {tokens.map((token, index) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    rank={index + 1}
                    metric={sortMetric}
                    onClick={() => onTokenClick(token)}
                    formatNumber={formatNumber}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default LeaderboardPageTemplate;
