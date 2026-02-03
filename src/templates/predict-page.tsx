/**
 * PredictPageTemplate
 * 
 * Pure presentational template for prediction markets.
 * Create, browse, and bet on prediction markets.
 * 
 * @example
 * ```tsx
 * import { PredictPageTemplate } from '@skai/ui';
 * 
 * function Predict() {
 *   return (
 *     <PredictPageTemplate
 *       markets={markets}
 *       onPlaceBet={handleBet}
 *       renderMarketDetail={(m) => <MarketDetail market={m} />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";

// ============================================================================
// TYPES
// ============================================================================

export type MarketStatus = 'active' | 'closed' | 'resolved' | 'disputed' | 'cancelled';
export type MarketCategory = 'crypto' | 'sports' | 'politics' | 'entertainment' | 'other';
export type OutcomeType = 'yes' | 'no';

export interface MarketOutcome {
  /** Outcome ID */
  id: string;
  /** Label (e.g., "Yes", "No", team name) */
  label: string;
  /** Current probability (0-1) */
  probability: number;
  /** Total volume on this outcome */
  volume: number;
  /** Is winning outcome (after resolution) */
  isWinner?: boolean;
}

export interface PredictionMarket {
  /** Market ID */
  id: string;
  /** Question/Title */
  question: string;
  /** Description */
  description?: string;
  /** Category */
  category: MarketCategory;
  /** Status */
  status: MarketStatus;
  /** Outcomes */
  outcomes: MarketOutcome[];
  /** Total volume */
  totalVolume: number;
  /** Number of participants */
  participants: number;
  /** Resolution date */
  resolutionDate: Date;
  /** Created at */
  createdAt: Date;
  /** Creator address */
  creator: string;
  /** Creator name */
  creatorName?: string;
  /** Image URL */
  imageUrl?: string;
  /** Resolution source */
  resolutionSource?: string;
  /** Is featured */
  isFeatured?: boolean;
}

export interface UserPosition {
  /** Market ID */
  marketId: string;
  /** Market question */
  question: string;
  /** Outcome ID */
  outcomeId: string;
  /** Outcome label */
  outcomeLabel: string;
  /** Amount bet */
  amount: number;
  /** Entry probability */
  entryProbability: number;
  /** Current probability */
  currentProbability: number;
  /** Potential payout */
  potentialPayout: number;
  /** Current value */
  currentValue: number;
  /** PnL */
  pnl: number;
  /** Status */
  status: MarketStatus;
}

export interface PredictStats {
  /** Total positions value */
  totalValue: number;
  /** Total PnL */
  totalPnl: number;
  /** Win rate */
  winRate: number;
  /** Total bets placed */
  totalBets: number;
  /** Active positions */
  activePositions: number;
}

export type PredictTab = 'browse' | 'my-bets' | 'create';
export type MarketSort = 'volume' | 'ending' | 'newest' | 'hot';

export interface PredictPageProps {
  /** Active tab */
  activeTab?: PredictTab;
  /** Callback when tab changes */
  onTabChange?: (tab: PredictTab) => void;
  /** Category filter */
  categoryFilter?: MarketCategory | 'all';
  /** Callback when category changes */
  onCategoryChange?: (category: MarketCategory | 'all') => void;
  /** Sort order */
  sortBy?: MarketSort;
  /** Callback when sort changes */
  onSortChange?: (sort: MarketSort) => void;
  /** Search query */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Whether connected */
  isConnected?: boolean;
  /** Whether loading */
  isLoading?: boolean;
  /** User stats */
  userStats?: PredictStats;
  /** Featured markets */
  featuredMarkets?: PredictionMarket[];
  /** All markets */
  markets?: PredictionMarket[];
  /** User positions */
  positions?: UserPosition[];
  /** Selected market for detail */
  selectedMarket?: PredictionMarket | null;
  /** Callback when selecting market */
  onSelectMarket?: (market: PredictionMarket | null) => void;
  
  // Actions
  /** Place bet */
  onPlaceBet?: (marketId: string, outcomeId: string, amount: number) => void;
  /** Sell position */
  onSellPosition?: (position: UserPosition) => void;
  /** Create market */
  onCreateMarket?: () => void;
  /** Connect wallet */
  onConnect?: () => void;
  
  // Render props
  /** Render market detail */
  renderMarketDetail?: (market: PredictionMarket) => React.ReactNode;
  /** Render bet modal */
  renderBetModal?: () => React.ReactNode;
  /** Render create modal */
  renderCreateModal?: () => React.ReactNode;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

function getTimeRemaining(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}m`;
}

function getCategoryIcon(category: MarketCategory): string {
  switch (category) {
    case 'crypto': return '₿';
    case 'sports': return '⚽';
    case 'politics': return '🏛️';
    case 'entertainment': return '🎬';
    default: return '📊';
  }
}

function getStatusColor(status: MarketStatus): string {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'closed': return 'bg-yellow-500';
    case 'resolved': return 'bg-blue-500';
    case 'disputed': return 'bg-orange-500';
    case 'cancelled': return 'bg-gray-500';
  }
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface StatsBarProps {
  stats?: PredictStats;
}

function StatsBar({ stats }: StatsBarProps) {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Portfolio Value</p>
          <p className="text-xl font-bold">{formatCurrency(stats.totalValue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Total PnL</p>
          <p className={`text-xl font-bold ${stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.totalPnl >= 0 ? '+' : ''}{formatCurrency(stats.totalPnl)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-xl font-bold">{(stats.winRate * 100).toFixed(0)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Total Bets</p>
          <p className="text-xl font-bold">{stats.totalBets}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Active Positions</p>
          <p className="text-xl font-bold">{stats.activePositions}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface MarketCardProps {
  market: PredictionMarket;
  onClick?: () => void;
  onBet?: (outcomeId: string) => void;
}

function MarketCard({ market, onClick, onBet }: MarketCardProps) {
  const isActive = market.status === 'active';
  const [yesOutcome, noOutcome] = market.outcomes.length === 2 
    ? market.outcomes 
    : [market.outcomes[0], market.outcomes[1]];
  
  return (
    <Card className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={onClick}>
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {market.imageUrl ? (
            <img 
              src={market.imageUrl} 
              alt="" 
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
              {getCategoryIcon(market.category)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {getCategoryIcon(market.category)} {market.category}
              </Badge>
              <Badge className={getStatusColor(market.status)}>
                {market.status}
              </Badge>
              {market.isFeatured && (
                <Badge className="bg-yellow-500">⭐ Featured</Badge>
              )}
            </div>
            <h3 className="font-medium line-clamp-2">{market.question}</h3>
          </div>
        </div>
        
        {/* Probability bars */}
        {market.outcomes.length === 2 && yesOutcome && noOutcome && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-500 font-medium">
                {yesOutcome.label}: {formatPercent(yesOutcome.probability)}
              </span>
              <span className="text-red-500 font-medium">
                {noOutcome.label}: {formatPercent(noOutcome.probability)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-red-500/30 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${yesOutcome.probability * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Multi-outcome display */}
        {market.outcomes.length > 2 && (
          <div className="space-y-1 mb-3">
            {market.outcomes.slice(0, 3).map(outcome => (
              <div key={outcome.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{outcome.label}</span>
                <span className="font-medium">{formatPercent(outcome.probability)}</span>
              </div>
            ))}
            {market.outcomes.length > 3 && (
              <p className="text-xs text-muted-foreground">+{market.outcomes.length - 3} more outcomes</p>
            )}
          </div>
        )}
        
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{formatCurrency(market.totalVolume)} volume</span>
          <span>{market.participants} participants</span>
          {isActive && <span>Ends in {getTimeRemaining(market.resolutionDate)}</span>}
        </div>
        
        {/* Quick bet buttons */}
        {isActive && onBet && market.outcomes.length === 2 && (
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
              onClick={() => onBet(yesOutcome!.id)}
            >
              Bet {yesOutcome!.label}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => onBet(noOutcome!.id)}
            >
              Bet {noOutcome!.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PositionCardProps {
  position: UserPosition;
  onSell?: () => void;
}

function PositionCard({ position, onSell }: PositionCardProps) {
  const isActive = position.status === 'active';
  const isProfitable = position.pnl >= 0;
  
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-medium line-clamp-2 mb-2">{position.question}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{position.outcomeLabel}</Badge>
          <Badge className={getStatusColor(position.status)}>{position.status}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">{formatCurrency(position.amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Value</p>
            <p className="font-medium">{formatCurrency(position.currentValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Entry Price</p>
            <p className="font-medium">{formatPercent(position.entryProbability)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Price</p>
            <p className="font-medium">{formatPercent(position.currentProbability)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-sm text-muted-foreground">PnL</p>
            <p className={`font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}{formatCurrency(position.pnl)}
            </p>
          </div>
          {isActive && onSell && (
            <Button size="sm" variant="outline" onClick={onSell}>
              Sell Position
            </Button>
          )}
        </div>
        
        {isActive && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Potential payout: {formatCurrency(position.potentialPayout)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function PredictLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function PredictPageTemplate({
  activeTab = 'browse',
  onTabChange,
  categoryFilter = 'all',
  onCategoryChange,
  sortBy = 'volume',
  onSortChange,
  searchQuery = '',
  onSearchChange,
  isConnected,
  isLoading,
  userStats,
  featuredMarkets = [],
  markets = [],
  positions = [],
  selectedMarket,
  onSelectMarket,
  onPlaceBet: _onPlaceBet,
  onSellPosition,
  onCreateMarket,
  onConnect,
  renderMarketDetail,
  renderBetModal,
  renderCreateModal,
}: PredictPageProps) {
  if (isLoading) {
    return <PredictLoadingSkeleton />;
  }
  
  // Market detail view
  if (selectedMarket) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Button variant="ghost" onClick={() => onSelectMarket?.(null)}>
          ← Back to Markets
        </Button>
        
        {renderMarketDetail ? (
          renderMarketDetail(selectedMarket)
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {getCategoryIcon(selectedMarket.category)} {selectedMarket.category}
                </Badge>
                <Badge className={getStatusColor(selectedMarket.status)}>
                  {selectedMarket.status}
                </Badge>
              </div>
              <CardTitle>{selectedMarket.question}</CardTitle>
              {selectedMarket.description && (
                <CardDescription>{selectedMarket.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedMarket.outcomes.map(outcome => (
                  <div key={outcome.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{outcome.label}</div>
                      {outcome.isWinner && <Badge className="bg-green-500">Winner</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatPercent(outcome.probability)}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(outcome.volume)} volume</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
                <p>Total Volume: {formatCurrency(selectedMarket.totalVolume)}</p>
                <p>Participants: {selectedMarket.participants}</p>
                <p>Resolution: {selectedMarket.resolutionDate.toLocaleDateString()}</p>
                {selectedMarket.resolutionSource && (
                  <p>Source: {selectedMarket.resolutionSource}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  // Filter markets
  const filteredMarkets = markets.filter(m => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.question.toLowerCase().includes(q);
    }
    return true;
  });
  
  // Sort markets
  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    switch (sortBy) {
      case 'volume': return b.totalVolume - a.totalVolume;
      case 'ending': return a.resolutionDate.getTime() - b.resolutionDate.getTime();
      case 'newest': return b.createdAt.getTime() - a.createdAt.getTime();
      case 'hot': return b.participants - a.participants;
      default: return 0;
    }
  });
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🔮</span>
          Prediction Markets
        </h1>
        
        <div className="flex items-center gap-2">
          {!isConnected && (
            <Button onClick={onConnect}>Connect Wallet</Button>
          )}
          {isConnected && (
            <Button onClick={onCreateMarket} className="gap-2">
              <span>➕</span>
              Create Market
            </Button>
          )}
        </div>
      </div>
      
      {/* User Stats */}
      {isConnected && userStats && <StatsBar stats={userStats} />}
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as PredictTab)}>
        <TabsList>
          <TabsTrigger value="browse" className="gap-2">
            <span>🔍</span> Browse
          </TabsTrigger>
          <TabsTrigger value="my-bets" className="gap-2">
            <span>📊</span> My Bets
            {positions.length > 0 && (
              <Badge variant="secondary" className="ml-1">{positions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6 mt-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category */}
            <div className="flex rounded-lg border overflow-hidden">
              {(['all', 'crypto', 'sports', 'politics', 'entertainment'] as const).map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-1 text-sm transition-colors ${
                    categoryFilter === cat 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => onCategoryChange?.(cat)}
                >
                  {cat === 'all' ? 'All' : `${getCategoryIcon(cat)} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
                </button>
              ))}
            </div>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value as MarketSort)}
              className="px-3 py-1 rounded-lg border bg-background text-sm"
            >
              <option value="volume">Highest Volume</option>
              <option value="ending">Ending Soon</option>
              <option value="newest">Newest</option>
              <option value="hot">Most Popular</option>
            </select>
            
            {/* Search */}
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          {/* Featured Markets */}
          {featuredMarkets.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span>⭐</span>
                Featured Markets
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredMarkets.map(market => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    onClick={() => onSelectMarket?.(market)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Markets */}
          <div>
            <h2 className="text-lg font-semibold mb-3">All Markets</h2>
            {sortedMarkets.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🔮</span>
                <p className="text-muted-foreground">No markets found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedMarkets.map(market => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    onClick={() => onSelectMarket?.(market)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* My Bets Tab */}
        <TabsContent value="my-bets" className="mt-4">
          {!isConnected ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Connect wallet to view your bets</p>
                <Button onClick={onConnect}>Connect Wallet</Button>
              </CardContent>
            </Card>
          ) : positions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <span className="text-4xl mb-4 block">📊</span>
                <p className="text-muted-foreground">No positions yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Browse markets and place your first bet!
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => onTabChange?.('browse')}
                >
                  Browse Markets
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map(position => (
                <PositionCard
                  key={`${position.marketId}-${position.outcomeId}`}
                  position={position}
                  onSell={() => onSellPosition?.(position)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      {renderBetModal?.()}
      {renderCreateModal?.()}
    </div>
  );
}

export default PredictPageTemplate;
