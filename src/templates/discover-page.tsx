/**
 * DiscoverPageTemplate - Creator/Token Discovery Page
 *
 * Pure presentational component for browsing and discovering creators.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - Stats overview cards
 * - Search input
 * - Sort tabs (trending, newest, market cap, holders, volume)
 * - Creator cards with token info
 * - Loading skeletons
 * - Empty states
 *
 * @module templates/discover-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "../components/core/card";
import { Input } from "../components/core/input";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";
import { Skeleton } from "../components/feedback/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Tabs, TabsList, TabsTrigger } from "../components/navigation/tabs";
import {
  Search,
  TrendingUp,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Clock,
  BarChart3,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type DiscoverSortOption =
  | "trending"
  | "newest"
  | "market_cap"
  | "holders"
  | "volume";

export interface DiscoverCreator {
  id: string;
  name: string;
  symbol: string;
  displayName?: string;
  subdomain?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  price: number;
  priceChange24h?: number;
  marketCap?: number;
  holderCount?: number;
  totalVolume?: number;
  createdAt?: string;
}

export interface DiscoverStats {
  totalCreators: number;
  totalMarketCap: number;
  totalHolders: number;
  totalVolume: number;
}

export interface DiscoverPageTemplateProps {
  /** Array of creators to display */
  creators: DiscoverCreator[];
  /** Aggregated stats for the header cards */
  stats: DiscoverStats;
  /** Current search query */
  searchQuery: string;
  /** Current sort option */
  sortBy: DiscoverSortOption;
  /** Whether data is loading */
  isLoading: boolean;
  /** Error message if any */
  error?: string | null;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
  /** Callback when sort option changes */
  onSortChange: (sort: DiscoverSortOption) => void;
  /** Callback when a creator card is clicked */
  onCreatorClick: (creator: DiscoverCreator) => void;
  /** Callback for Create Token button */
  onCreateTokenClick: () => void;
  /** Callback for Load More button */
  onLoadMore?: () => void;
  /** Whether more items can be loaded */
  hasMore?: boolean;
  /** Format number function */
  formatNumber?: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** Optional class name */
  className?: string;
  /** Custom page title */
  title?: string;
  /** Custom page subtitle */
  subtitle?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

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
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "flex items-center gap-0.5",
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
 * Individual creator card
 */
function CreatorCard({
  creator,
  onClick,
  formatNumber,
}: {
  creator: DiscoverCreator;
  onClick: () => void;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}) {
  return (
    <Card
      className="cursor-pointer border-border/50 transition-all hover:border-primary/30 hover:bg-accent/50"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && onClick()}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={creator.avatarUrl} alt={creator.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-lg font-bold">
              {creator.symbol?.[0] || "?"}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">
                {creator.displayName || creator.name}
              </h3>
              {creator.isVerified && (
                <Badge variant="secondary" className="px-1.5 text-[10px]">
                  ✓
                </Badge>
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">
              @{creator.subdomain || creator.symbol.toLowerCase()}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {creator.holderCount || 0} holders
              </span>
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />${creator.symbol}
              </span>
            </div>
          </div>

          {/* Price & Change */}
          <div className="shrink-0 text-right">
            <p className="font-mono font-medium">
              ${formatNumber(creator.price || 0, { maximumFractionDigits: 6 })}
            </p>
            <PriceChangeIndicator
              change={creator.priceChange24h}
              className="justify-end text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              MCap: $
              {formatNumber(creator.marketCap || 0, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Creator card skeleton
 */
function CreatorCardSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="text-right">
            <Skeleton className="mb-1 h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Stats card component
 */
function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={cn(
        highlight &&
          "border-primary/20 bg-gradient-to-br from-primary/10 to-transparent"
      )}
    >
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function DiscoverPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <Skeleton className="mb-2 h-3 w-16" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Tabs Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">No Creators Yet</h3>
        <p className="mb-4 text-muted-foreground">
          Be the first to launch your creator token!
        </p>
        <Button onClick={onCreateClick}>Create Your Token</Button>
      </CardContent>
    </Card>
  );
}

/**
 * No search results state
 */
function NoSearchResults({ query }: { query: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-8 text-center">
        <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-muted-foreground">No creators found for "{query}"</p>
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

export function DiscoverPageTemplate({
  creators,
  stats,
  searchQuery,
  sortBy,
  isLoading,
  error,
  onSearchChange,
  onSortChange,
  onCreatorClick,
  onCreateTokenClick,
  onLoadMore,
  hasMore = false,
  formatNumber = defaultFormatNumber,
  className,
  title = "Discover Creators",
  subtitle = "Find and invest in your favorite traders and creators",
}: DiscoverPageTemplateProps) {
  // Show skeleton while loading
  if (isLoading) {
    return <DiscoverPageSkeleton />;
  }

  return (
    <div className={cn("container mx-auto max-w-4xl px-4 py-6", className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Creators" value={String(stats.totalCreators)} highlight />
        <StatCard
          label="Total MCap"
          value={`$${formatNumber(stats.totalMarketCap, { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="Holders"
          value={formatNumber(stats.totalHolders, { maximumFractionDigits: 0 })}
        />
        <StatCard
          label="24h Volume"
          value={`$${formatNumber(stats.totalVolume, { maximumFractionDigits: 0 })}`}
        />
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            className="pl-9"
          />
        </div>
      </div>

      {/* Sort Tabs */}
      <Tabs
        value={sortBy}
        onValueChange={(v: string) => onSortChange(v as DiscoverSortOption)}
        className="mb-6"
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="trending" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="newest" className="gap-1">
            <Clock className="h-3 w-3" />
            Newest
          </TabsTrigger>
          <TabsTrigger value="market_cap" className="gap-1">
            <BarChart3 className="h-3 w-3" />
            Market Cap
          </TabsTrigger>
          <TabsTrigger value="holders" className="gap-1">
            <Users className="h-3 w-3" />
            Holders
          </TabsTrigger>
          <TabsTrigger value="volume" className="gap-1">
            <Coins className="h-3 w-3" />
            Volume
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-destructive/50">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-3">
        {creators.length === 0 ? (
          searchQuery ? (
            <NoSearchResults query={searchQuery} />
          ) : (
            <EmptyState onCreateClick={onCreateTokenClick} />
          )
        ) : (
          creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onClick={() => onCreatorClick(creator)}
              formatNumber={formatNumber}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {creators.length > 0 && hasMore && onLoadMore && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default DiscoverPageTemplate;
