/**
 * Token Leaderboard Page Template
 * 
 * Dedicated leaderboard for social tokens with rankings by:
 * - Market Cap
 * - 24h Volume
 * - Holder Count
 * - Price Change
 * 
 * @example
 * ```tsx
 * <TokenLeaderboardPageTemplate
 *   tokens={tokenList}
 *   sortBy="market_cap"
 *   onSortChange={handleSort}
 *   onTokenClick={handleTokenClick}
 * />
 * ```
 */

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Card, CardContent } from "../components/core/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import { Tabs, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export type TokenSortMetric = "market_cap" | "volume" | "holders" | "price_change" | "newest";
export type TimeFrame = "24h" | "7d" | "30d" | "all";

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image_url?: string;
  creator: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  price: number;
  price_change_24h: number;
  price_change_7d?: number;
  price_change_30d?: number;
  market_cap: number;
  volume_24h: number;
  holder_count: number;
  created_at: string;
  contract_address?: string;
}

export interface TokenLeaderboardPageTemplateProps {
  /** Token list */
  tokens: TokenData[];
  /** Sort metric */
  sortBy?: TokenSortMetric;
  /** Time frame for metrics */
  timeFrame?: TimeFrame;
  /** Loading state */
  isLoading?: boolean;
  /** Active tab/category */
  activeTab?: string;
  /** Sort change handler */
  onSortChange?: (sort: TokenSortMetric) => void;
  /** Time frame change handler */
  onTimeFrameChange?: (timeFrame: TimeFrame) => void;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Token click handler */
  onTokenClick?: (token: TokenData) => void;
  /** Creator click handler */
  onCreatorClick?: (creatorId: string) => void;
  /** Render custom token row */
  renderTokenRow?: (token: TokenData, rank: number) => React.ReactNode;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

interface RankBadgeProps {
  rank: number;
}

function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
        <span className="text-yellow-500 font-bold">👑</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400/20">
        <span className="text-slate-400 font-bold">🥈</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600/20">
        <span className="text-amber-600 font-bold">🥉</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
      <span className="text-sm font-medium text-muted-foreground">{rank}</span>
    </div>
  );
}

interface TokenRowProps {
  token: TokenData;
  rank: number;
  timeFrame: TimeFrame;
  onTokenClick?: (token: TokenData) => void;
  onCreatorClick?: (creatorId: string) => void;
}

function TokenRow({ token, rank, timeFrame, onTokenClick, onCreatorClick }: TokenRowProps) {
  const priceChange = timeFrame === "24h" 
    ? token.price_change_24h 
    : timeFrame === "7d" 
    ? token.price_change_7d 
    : timeFrame === "30d"
    ? token.price_change_30d
    : null; // "all" timeFrame - no specific price change metric

  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onTokenClick?.(token)}
    >
      <RankBadge rank={rank} />
      
      <Avatar className="w-10 h-10">
        <AvatarImage src={token.image_url} />
        <AvatarFallback>{token.symbol.slice(0, 2)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{token.name}</h3>
          <Badge variant="outline" className="text-xs">${token.symbol}</Badge>
        </div>
        <button
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onCreatorClick?.(token.creator.id);
          }}
        >
          by @{token.creator.username}
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold">${token.price.toFixed(4)}</p>
        <p className={cn(
          "text-sm",
          priceChange != null && priceChange >= 0 ? "text-green-500" : "text-red-500"
        )}>
          {priceChange != null && (
            <>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </>
          )}
        </p>
      </div>
      
      <div className="text-right hidden sm:block">
        <p className="text-sm text-muted-foreground">Market Cap</p>
        <p className="font-medium">${formatLargeNumber(token.market_cap)}</p>
      </div>
      
      <div className="text-right hidden md:block">
        <p className="text-sm text-muted-foreground">Volume (24h)</p>
        <p className="font-medium">${formatLargeNumber(token.volume_24h)}</p>
      </div>
      
      <div className="text-right hidden lg:block">
        <p className="text-sm text-muted-foreground">Holders</p>
        <p className="font-medium">{token.holder_count.toLocaleString()}</p>
      </div>
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toFixed(2);
}

interface StatsCardsProps {
  tokens: TokenData[];
  isLoading?: boolean;
}

function StatsCards({ tokens, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalMarketCap = tokens.reduce((sum, t) => sum + t.market_cap, 0);
  const totalVolume = tokens.reduce((sum, t) => sum + t.volume_24h, 0);
  // totalHolders available for consumer use
  const _totalHolders = tokens.reduce((sum, t) => sum + t.holder_count, 0);
  void _totalHolders;
  const avgPriceChange = tokens.length > 0 
    ? tokens.reduce((sum, t) => sum + t.price_change_24h, 0) / tokens.length 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Market Cap</p>
          <p className="text-2xl font-bold">${formatLargeNumber(totalMarketCap)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="text-2xl font-bold">${formatLargeNumber(totalVolume)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Tokens</p>
          <p className="text-2xl font-bold">{tokens.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Avg 24h Change</p>
          <p className={cn(
            "text-2xl font-bold",
            avgPriceChange >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {avgPriceChange >= 0 ? "+" : ""}{avgPriceChange.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function TokenLeaderboardPageTemplate({
  tokens,
  sortBy = "market_cap",
  timeFrame = "24h",
  isLoading = false,
  activeTab = "all",
  onSortChange,
  onTimeFrameChange,
  onTabChange,
  onTokenClick,
  onCreatorClick,
  renderTokenRow,
  headerContent,
  footerContent,
  className,
}: TokenLeaderboardPageTemplateProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Token Leaderboard</h1>
        <p className="text-muted-foreground">
          Discover and track the top social tokens on the platform
        </p>
      </div>

      {headerContent}

      {/* Stats */}
      <StatsCards tokens={tokens} isLoading={isLoading} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Tokens</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={onSortChange as (value: string) => void}>
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

          <Select value={timeFrame} onValueChange={onTimeFrameChange as (value: string) => void}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Token List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : tokens.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No tokens found
            </div>
          ) : (
            <div className="divide-y">
              {tokens.map((token, index) => 
                renderTokenRow ? (
                  <React.Fragment key={token.id}>
                    {renderTokenRow(token, index + 1)}
                  </React.Fragment>
                ) : (
                  <TokenRow
                    key={token.id}
                    token={token}
                    rank={index + 1}
                    timeFrame={timeFrame}
                    onTokenClick={onTokenClick}
                    onCreatorClick={onCreatorClick}
                  />
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {footerContent}
    </div>
  );
}

export default TokenLeaderboardPageTemplate;
