/**
 * Market Detail Page Template
 * 
 * Prediction market detail page with:
 * - Market information and status
 * - Betting interface (Yes/No)
 * - Odds history chart
 * - LP rewards and positions
 * - Recent bets feed
 * 
 * @example
 * ```tsx
 * <MarketDetailPageTemplate
 *   market={marketData}
 *   userPosition={position}
 *   recentBets={bets}
 *   onPlaceBet={handleBet}
 *   renderOddsChart={(data) => <OddsChart data={data} />}
 * />
 * ```
 */

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Label } from "../components/core/label";
import { Progress } from "../components/feedback/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "resolved" | "cancelled" | "pending";
  outcome?: "yes" | "no" | null;
  created_at: string;
  end_date: string;
  resolved_at?: string;
  creator: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  yes_odds: number;
  no_odds: number;
  total_volume: number;
  total_liquidity: number;
  participant_count: number;
  image_url?: string;
}

export interface UserPosition {
  yes_shares: number;
  no_shares: number;
  total_invested: number;
  potential_payout: number;
  unrealized_pnl: number;
  avg_yes_price?: number;
  avg_no_price?: number;
}

export interface LPPosition {
  liquidity_provided: number;
  share_of_pool: number;
  earned_fees: number;
  current_value: number;
}

export interface RecentBet {
  id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  side: "yes" | "no";
  amount: number;
  shares: number;
  price: number;
  timestamp: string;
}

export interface OddsHistoryPoint {
  timestamp: string;
  yes_odds: number;
  no_odds: number;
}

export interface MarketDetailPageTemplateProps {
  /** Market data */
  market: Market | null;
  /** User's betting position */
  userPosition: UserPosition | null;
  /** User's LP position */
  lpPosition: LPPosition | null;
  /** Recent bets on this market */
  recentBets: RecentBet[];
  /** Odds history data */
  oddsHistory: OddsHistoryPoint[];
  /** Selected bet side */
  selectedSide?: "yes" | "no";
  /** Bet amount input */
  betAmount?: string;
  /** Estimated shares for current bet */
  estimatedShares?: number;
  /** Estimated average price */
  estimatedPrice?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Placing bet state */
  isPlacingBet?: boolean;
  /** Active tab */
  activeTab?: string;
  /** Whether user is connected */
  isConnected?: boolean;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Side selection handler */
  onSelectSide?: (side: "yes" | "no") => void;
  /** Bet amount change handler */
  onBetAmountChange?: (amount: string) => void;
  /** Place bet handler */
  onPlaceBet?: () => void;
  /** Add liquidity handler */
  onAddLiquidity?: (amount: number) => void;
  /** Remove liquidity handler */
  onRemoveLiquidity?: (amount: number) => void;
  /** Claim rewards handler */
  onClaimRewards?: () => void;
  /** Share market handler */
  onShare?: () => void;
  /** Back navigation handler */
  onBack?: () => void;
  /** Connect wallet handler */
  onConnect?: () => void;
  /** Render odds history chart */
  renderOddsChart?: (data: OddsHistoryPoint[]) => React.ReactNode;
  /** Render volume chart */
  renderVolumeChart?: () => React.ReactNode;
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

interface MarketHeaderProps {
  market: Market;
  onBack?: () => void;
  onShare?: () => void;
}

function MarketHeader({ market, onBack, onShare }: MarketHeaderProps) {
  const statusColors = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    resolved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Markets
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="outline">{market.category}</Badge>
          <Badge className={statusColors[market.status]}>
            {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
          </Badge>
          {onShare && (
            <Button variant="ghost" size="sm" onClick={onShare}>
              Share
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {market.image_url && (
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={market.image_url} 
              alt={market.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold">{market.title}</h1>
          <p className="text-muted-foreground">{market.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={market.creator.avatar_url} />
                <AvatarFallback>{market.creator.username[0]}</AvatarFallback>
              </Avatar>
              <span>by {market.creator.username}</span>
            </div>
            <span>•</span>
            <span>Ends {new Date(market.end_date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{market.participant_count} participants</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OddsPanelProps {
  market: Market;
}

function OddsPanel({ market }: OddsPanelProps) {
  const yesPercent = market.yes_odds * 100;
  const noPercent = market.no_odds * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Odds</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-green-500">YES</span>
              <span className="text-sm font-medium">{yesPercent.toFixed(1)}%</span>
            </div>
            <Progress value={yesPercent} className="h-3 bg-red-500/20" />
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>NO: {noPercent.toFixed(1)}%</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="text-lg font-bold">${market.total_volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Liquidity</p>
            <p className="text-lg font-bold">${market.total_liquidity.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BettingPanelProps {
  market: Market;
  selectedSide?: "yes" | "no";
  betAmount?: string;
  estimatedShares?: number;
  estimatedPrice?: number;
  isPlacingBet?: boolean;
  isConnected?: boolean;
  onSelectSide?: (side: "yes" | "no") => void;
  onBetAmountChange?: (amount: string) => void;
  onPlaceBet?: () => void;
  onConnect?: () => void;
}

function BettingPanel({
  market,
  selectedSide,
  betAmount,
  estimatedShares,
  estimatedPrice,
  isPlacingBet,
  isConnected,
  onSelectSide,
  onBetAmountChange,
  onPlaceBet,
  onConnect,
}: BettingPanelProps) {
  if (market.status !== "active") {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {market.status === "resolved" 
            ? `Market resolved: ${market.outcome?.toUpperCase()}`
            : "Market is not active"
          }
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Place Your Bet</CardTitle>
        <CardDescription>Choose YES or NO and enter amount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Side Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedSide === "yes" ? "default" : "outline"}
            className={cn(
              selectedSide === "yes" && "bg-green-600 hover:bg-green-700"
            )}
            onClick={() => onSelectSide?.("yes")}
          >
            YES ({(market.yes_odds * 100).toFixed(0)}%)
          </Button>
          <Button
            variant={selectedSide === "no" ? "default" : "outline"}
            className={cn(
              selectedSide === "no" && "bg-red-600 hover:bg-red-700"
            )}
            onClick={() => onSelectSide?.("no")}
          >
            NO ({(market.no_odds * 100).toFixed(0)}%)
          </Button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={betAmount}
            onChange={(e) => onBetAmountChange?.(e.target.value)}
            disabled={!selectedSide}
          />
        </div>

        {/* Estimate */}
        {selectedSide && betAmount && parseFloat(betAmount) > 0 && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Estimated Shares</span>
              <span className="font-medium">{estimatedShares?.toFixed(2) || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Price</span>
              <span className="font-medium">${estimatedPrice?.toFixed(4) || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Potential Payout</span>
              <span className="font-medium text-green-500">
                ${estimatedShares?.toFixed(2) || "—"}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {isConnected ? (
          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedSide || !betAmount || parseFloat(betAmount || "0") <= 0 || isPlacingBet}
            onClick={onPlaceBet}
          >
            {isPlacingBet ? "Placing Bet..." : `Bet ${selectedSide?.toUpperCase() || ""}`}
          </Button>
        ) : (
          <Button className="w-full" size="lg" onClick={onConnect}>
            Connect Wallet to Bet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface PositionCardProps {
  position: UserPosition | null;
  lpPosition: LPPosition | null;
  onClaimRewards?: () => void;
}

function PositionCard({ position, lpPosition, onClaimRewards }: PositionCardProps) {
  if (!position && !lpPosition) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          You have no position in this market
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Position</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {position && (position.yes_shares > 0 || position.no_shares > 0) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Betting Position</h4>
            <div className="grid grid-cols-2 gap-4">
              {position.yes_shares > 0 && (
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">YES Shares</p>
                  <p className="text-lg font-bold text-green-500">
                    {position.yes_shares.toFixed(2)}
                  </p>
                  {position.avg_yes_price && (
                    <p className="text-xs text-muted-foreground">
                      Avg: ${position.avg_yes_price.toFixed(4)}
                    </p>
                  )}
                </div>
              )}
              {position.no_shares > 0 && (
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">NO Shares</p>
                  <p className="text-lg font-bold text-red-500">
                    {position.no_shares.toFixed(2)}
                  </p>
                  {position.avg_no_price && (
                    <p className="text-xs text-muted-foreground">
                      Avg: ${position.avg_no_price.toFixed(4)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Unrealized P&L</span>
              <span className={cn(
                "font-medium",
                position.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {position.unrealized_pnl >= 0 ? "+" : ""}${position.unrealized_pnl.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {lpPosition && lpPosition.liquidity_provided > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">LP Position</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Liquidity</p>
                <p className="font-medium">${lpPosition.liquidity_provided.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pool Share</p>
                <p className="font-medium">{lpPosition.share_of_pool.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Earned Fees</p>
                <p className="font-medium text-green-500">${lpPosition.earned_fees.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Value</p>
                <p className="font-medium">${lpPosition.current_value.toFixed(2)}</p>
              </div>
            </div>
            {lpPosition.earned_fees > 0 && onClaimRewards && (
              <Button size="sm" variant="outline" onClick={onClaimRewards}>
                Claim ${lpPosition.earned_fees.toFixed(2)} Rewards
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentBetsListProps {
  bets: RecentBet[];
  isLoading?: boolean;
}

function RecentBetsList({ bets, isLoading }: RecentBetsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (bets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bets yet
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {bets.map((bet) => (
        <div 
          key={bet.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={bet.user.avatar_url} />
              <AvatarFallback>{bet.user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{bet.user.username}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(bet.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={bet.side === "yes" ? "default" : "secondary"}>
              {bet.side.toUpperCase()}
            </Badge>
            <p className="text-sm mt-1">
              ${bet.amount.toFixed(2)} → {bet.shares.toFixed(2)} shares
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function MarketDetailPageTemplate({
  market,
  userPosition,
  lpPosition,
  recentBets,
  oddsHistory,
  selectedSide,
  betAmount,
  estimatedShares,
  estimatedPrice,
  isLoading = false,
  isPlacingBet = false,
  activeTab = "trade",
  isConnected = false,
  onTabChange,
  onSelectSide,
  onBetAmountChange,
  onPlaceBet,
  onAddLiquidity,
  onRemoveLiquidity,
  onClaimRewards,
  onShare,
  onBack,
  onConnect,
  renderOddsChart,
  renderVolumeChart: _renderVolumeChart,
  headerContent,
  footerContent,
  className,
}: MarketDetailPageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  void _renderVolumeChart;

  if (isLoading || !market) {
    return (
      <div className={cn("space-y-6", className)}>
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Market Header */}
      <MarketHeader market={market} onBack={onBack} onShare={onShare} />

      {headerContent}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Odds Panel */}
          <OddsPanel market={market} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trade">Trade</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="trade">
              <BettingPanel
                market={market}
                selectedSide={selectedSide}
                betAmount={betAmount}
                estimatedShares={estimatedShares}
                estimatedPrice={estimatedPrice}
                isPlacingBet={isPlacingBet}
                isConnected={isConnected}
                onSelectSide={onSelectSide}
                onBetAmountChange={onBetAmountChange}
                onPlaceBet={onPlaceBet}
                onConnect={onConnect}
              />
            </TabsContent>

            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Odds History</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderOddsChart ? (
                    renderOddsChart(oddsHistory)
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart not available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bets</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentBetsList bets={recentBets} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* User Position */}
          <PositionCard 
            position={userPosition}
            lpPosition={lpPosition}
            onClaimRewards={onClaimRewards}
          />

          {/* LP Actions */}
          {market.status === "active" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provide Liquidity</CardTitle>
                <CardDescription>Earn fees by adding liquidity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Pool APR</p>
                  <p className="text-2xl font-bold text-green-500">12.5%</p>
                </div>
                {isConnected ? (
                  <>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => onAddLiquidity?.(100)}
                    >
                      Add Liquidity
                    </Button>
                    {lpPosition && lpPosition.liquidity_provided > 0 && (
                      <Button 
                        className="w-full" 
                        variant="ghost"
                        onClick={() => onRemoveLiquidity?.(lpPosition.liquidity_provided)}
                      >
                        Remove Liquidity
                      </Button>
                    )}
                  </>
                ) : (
                  <Button className="w-full" onClick={onConnect}>
                    Connect to Add Liquidity
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {footerContent}
    </div>
  );
}

export default MarketDetailPageTemplate;
