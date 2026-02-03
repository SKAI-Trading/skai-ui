/**
 * CryptoDetailsPageTemplate - Token/Cryptocurrency Details Page
 *
 * Pure presentational component for displaying comprehensive token statistics.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - Token header with image, name, price, rank
 * - Quick stats grid (market cap, volume, FDV, supply)
 * - Price performance section (24h, 7d, 30d)
 * - ATH/ATL with progress
 * - Supply information with progress
 * - Market stats sidebar
 * - Social links
 * - About/description section
 * - Trade CTA
 * - Loading skeleton
 * - Error/not found state
 *
 * @module templates/crypto-details-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";
import { Skeleton } from "../components/feedback/skeleton";
import { Progress } from "../components/feedback/progress";
import { Separator } from "../components/layout/separator";

// ============================================================================
// ICON COMPONENTS (inline SVGs for independence)
// ============================================================================

const Icons = {
  ArrowUpRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  ArrowDownRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 7l10 10" />
      <path d="M17 7v10H7" />
    </svg>
  ),
  Minus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  ),
  ExternalLink: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Coins: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  ),
  BarChart3: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  ArrowRightLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  ),
  RefreshCw: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Lock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ============================================================================
// TYPES
// ============================================================================

export interface CryptoToken {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank?: number;
  volume24h: number;
  fullyDilutedValuation: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply?: number;
  priceChangePercent24h: number;
  priceChangePercent7d: number;
  priceChangePercent30d: number;
  marketCapChangePercent24h: number;
  high24h: number;
  low24h: number;
  ath: number;
  athDate?: string;
  athChangePercent: number;
  atl: number;
  atlDate?: string;
  atlChangePercent: number;
  description?: string;
  coingeckoUrl?: string;
  // Social token specific fields
  isSocialToken?: boolean;
  creatorAllocation?: number;
  creatorAllocationPercent?: number;
  vestingDuration?: number;
  // Social links
  website?: string;
  twitter?: string;
  discord?: string;
  github?: string;
}

export interface CryptoDetailsPageTemplateProps {
  /** Token data */
  token?: CryptoToken | null;
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether data is refreshing */
  isRefreshing?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Token symbol being looked up */
  symbol: string;
  /** Callback when back button is clicked */
  onBack: () => void;
  /** Callback when refresh button is clicked */
  onRefresh: () => void;
  /** Callback when trade button is clicked */
  onTrade: (symbol: string) => void;
  /** Callback for external link (CoinGecko) */
  onExternalLink?: (url: string) => void;
  /** Format price function */
  formatPrice?: (price: number) => string;
  /** Format currency function */
  formatCurrency?: (num: number) => string;
  /** Format number function */
  formatNumber?: (num: number, decimals?: number) => string;
  /** Format date function */
  formatDate?: (dateStr: string) => string;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// DEFAULT FORMATTERS
// ============================================================================

const defaultFormatNumber = (num: number, decimals = 2): string => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toFixed(decimals);
};

const defaultFormatPrice = (price: number): string => {
  if (price >= 1000)
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
};

const defaultFormatCurrency = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const defaultFormatDate = (dateStr: string): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Percentage change indicator
 */
function PercentageChange({ value, className }: { value: number; className?: string }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  return (
    <span
      className={cn(
        "flex items-center gap-1 font-medium",
        isPositive
          ? "text-green-500"
          : isNeutral
            ? "text-muted-foreground"
            : "text-red-500",
        className
      )}
    >
      {isPositive ? (
        <Icons.ArrowUpRight className="h-4 w-4" />
      ) : isNeutral ? (
        <Icons.Minus className="h-4 w-4" />
      ) : (
        <Icons.ArrowDownRight className="h-4 w-4" />
      )}
      {isPositive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

/**
 * Stat box component
 */
function StatBox({
  label,
  value,
  subValue,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="mb-1 text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
      {subValue && <div className="text-sm">{subValue}</div>}
    </div>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function CryptoDetailsPageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="mb-6 h-48 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR STATE
// ============================================================================

function NotFoundState({
  symbol,
  error,
  onBack,
  onRefresh,
}: {
  symbol: string;
  error?: string | null;
  onBack: () => void;
  onRefresh: () => void;
}) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
      <Icons.Coins className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">Token Not Found</h1>
      <p className="mb-6 text-muted-foreground">
        {error || `The token "${symbol}" could not be found.`}
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <Icons.ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button onClick={onRefresh}>
          <Icons.RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CryptoDetailsPageTemplate({
  token,
  isLoading,
  isRefreshing = false,
  error,
  symbol,
  onBack,
  onRefresh,
  onTrade,
  onExternalLink,
  formatPrice = defaultFormatPrice,
  formatCurrency = defaultFormatCurrency,
  formatNumber = defaultFormatNumber,
  formatDate = defaultFormatDate,
  className,
}: CryptoDetailsPageTemplateProps) {
  // Loading skeleton
  if (isLoading) {
    return <CryptoDetailsPageSkeleton />;
  }

  // Error state
  if (error || !token) {
    return (
      <NotFoundState
        symbol={symbol}
        error={error}
        onBack={onBack}
        onRefresh={onRefresh}
      />
    );
  }

  // Calculate progress for ATH
  const athProgress = token.ath > 0 ? (token.currentPrice / token.ath) * 100 : 0;

  // Calculate supply percentage
  const supplyProgress =
    token.maxSupply && token.maxSupply > 0
      ? (token.circulatingSupply / token.maxSupply) * 100
      : token.totalSupply > 0
        ? (token.circulatingSupply / token.totalSupply) * 100
        : 0;

  return (
    <div className={cn("container mx-auto max-w-6xl px-4 py-8", className)}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icons.ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Token Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {token.image ? (
                    <img
                      src={token.image}
                      alt={token.name}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                      <span className="text-2xl font-bold">{token.symbol[0]}</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{token.name}</h1>
                      <Badge variant="outline">{token.symbol}</Badge>
                      {token.marketCapRank && token.marketCapRank > 0 && (
                        <Badge className="border-primary/30 bg-primary/20 text-primary">
                          Rank #{token.marketCapRank}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-4">
                      <PercentageChange value={token.priceChangePercent24h} />
                      <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Icons.RefreshCw
                          className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {formatPrice(token.currentPrice)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    24h: {formatPrice(token.low24h)} - {formatPrice(token.high24h)}
                  </p>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatBox
                  label="Market Cap"
                  value={formatCurrency(token.marketCap)}
                  subValue={
                    <PercentageChange
                      value={token.marketCapChangePercent24h}
                      className="text-sm"
                    />
                  }
                />
                <StatBox
                  label="24h Volume"
                  value={formatCurrency(token.volume24h)}
                  subValue={
                    <span className="text-muted-foreground">
                      {token.marketCap > 0
                        ? `${((token.volume24h / token.marketCap) * 100).toFixed(2)}% of MCap`
                        : "N/A"}
                    </span>
                  }
                />
                <StatBox
                  label="FDV"
                  value={formatCurrency(token.fullyDilutedValuation)}
                  subValue={
                    <span className="text-muted-foreground">Fully Diluted</span>
                  }
                />
                <StatBox
                  label="Circulating Supply"
                  value={formatNumber(token.circulatingSupply, 0)}
                  subValue={
                    <span className="text-muted-foreground">{token.symbol}</span>
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button onClick={() => onTrade(token.symbol)} className="flex-1">
                  <Icons.ArrowRightLeft className="mr-2 h-4 w-4" />
                  Trade {token.symbol}
                </Button>
                {token.coingeckoUrl && onExternalLink && (
                  <Button
                    variant="outline"
                    onClick={() => onExternalLink(token.coingeckoUrl!)}
                  >
                    <Icons.ExternalLink className="mr-2 h-4 w-4" />
                    CoinGecko
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.TrendingUp className="h-5 w-5" />
                Price Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">24 Hours</p>
                  <PercentageChange
                    value={token.priceChangePercent24h}
                    className="justify-center text-lg"
                  />
                </div>
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">7 Days</p>
                  <PercentageChange
                    value={token.priceChangePercent7d}
                    className="justify-center text-lg"
                  />
                </div>
                <div className="rounded-lg bg-muted/30 p-4 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">30 Days</p>
                  <PercentageChange
                    value={token.priceChangePercent30d}
                    className="justify-center text-lg"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* ATH/ATL */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">All-Time High</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(token.athDate || "")}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{formatPrice(token.ath)}</span>
                    <PercentageChange
                      value={token.athChangePercent}
                      className="text-sm"
                    />
                  </div>
                  <Progress value={athProgress} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {athProgress.toFixed(1)}% of ATH
                  </p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">All-Time Low</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(token.atlDate || "")}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{formatPrice(token.atl)}</span>
                    <PercentageChange
                      value={token.atlChangePercent}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {token.description && (
            <Card>
              <CardHeader>
                <CardTitle>About {token.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {token.description.length > 500 ? (
                    <>
                      <p>{token.description.slice(0, 500)}...</p>
                      {token.coingeckoUrl && onExternalLink && (
                        <Button
                          variant="link"
                          className="mt-2 h-auto p-0"
                          onClick={() => onExternalLink(token.coingeckoUrl!)}
                        >
                          Read more on CoinGecko
                          <Icons.ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <p>{token.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supply Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Coins className="h-5 w-5" />
                Supply
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Circulating</span>
                  <span className="font-medium">
                    {formatNumber(token.circulatingSupply, 0)} {token.symbol}
                  </span>
                </div>
                {(token.maxSupply || token.totalSupply > 0) && (
                  <>
                    <Progress value={supplyProgress} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {supplyProgress.toFixed(1)}% of{" "}
                      {token.maxSupply ? "max" : "total"} supply
                    </p>
                  </>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span>{formatNumber(token.totalSupply, 0)}</span>
                </div>
                {token.maxSupply && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Supply</span>
                    <span>{formatNumber(token.maxSupply, 0)}</span>
                  </div>
                )}
              </div>

              {/* Creator Locked Supply - for social tokens */}
              {token.isSocialToken && token.creatorAllocation && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Icons.Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Creator Locked Supply</span>
                    </div>
                    <div className="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locked Amount</span>
                        <span className="font-medium text-amber-500">
                          {formatNumber(token.creatorAllocation, 0)} {token.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">% of Total</span>
                        <span className="font-medium text-amber-500">
                          {token.creatorAllocationPercent || 10}%
                        </span>
                      </div>
                      {token.vestingDuration && (
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Icons.Clock className="h-3 w-3" />
                            Vesting Period
                          </span>
                          <span className="text-amber-500">
                            {Math.round(token.vestingDuration / (365 * 24 * 60 * 60))}{" "}
                            years
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Creator tokens are locked and vest linearly over the vesting
                      period
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Market Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.BarChart3 className="h-5 w-5" />
                Market Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Market Cap Rank</span>
                <span className="font-medium">#{token.marketCapRank || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Market Cap</span>
                <span>{formatCurrency(token.marketCap)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">24h Volume</span>
                <span>{formatCurrency(token.volume24h)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vol/MCap Ratio</span>
                <span>
                  {token.marketCap > 0
                    ? `${((token.volume24h / token.marketCap) * 100).toFixed(2)}%`
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          {(token.website || token.twitter || token.discord || token.github) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Globe className="h-5 w-5" />
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {token.website && onExternalLink && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onExternalLink(token.website!)}
                  >
                    <Icons.Globe className="mr-2 h-4 w-4" />
                    Website
                  </Button>
                )}
                {token.coingeckoUrl && onExternalLink && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onExternalLink(token.coingeckoUrl!)}
                  >
                    <Icons.ExternalLink className="mr-2 h-4 w-4" />
                    CoinGecko
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoDetailsPageTemplate;
