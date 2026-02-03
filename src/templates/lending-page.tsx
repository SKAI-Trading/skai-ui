/**
 * LendingPageTemplate
 * 
 * Pure presentational template for DeFi lending/borrowing.
 * Supply assets, borrow against collateral, manage positions.
 * 
 * @example
 * ```tsx
 * import { LendingPageTemplate } from '@skai/ui';
 * 
 * function Lending() {
 *   return (
 *     <LendingPageTemplate
 *       userPositions={positions}
 *       markets={markets}
 *       healthFactor={2.5}
 *       onSupply={handleSupply}
 *       onBorrow={handleBorrow}
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
import { Progress } from "../components/feedback/progress";
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

export type LendingProtocol = 'moonwell' | 'aave' | 'compound' | 'other';

export interface LendingToken {
  /** Token address */
  address: string;
  /** Symbol */
  symbol: string;
  /** Name */
  name: string;
  /** Decimals */
  decimals: number;
  /** Icon URL */
  iconUrl?: string;
  /** Price USD */
  priceUsd: number;
}

export interface LendingMarket {
  /** Market ID */
  id: string;
  /** Token */
  token: LendingToken;
  /** Protocol */
  protocol: LendingProtocol;
  /** Total supplied */
  totalSupply: number;
  /** Total borrowed */
  totalBorrow: number;
  /** Supply APY */
  supplyApy: number;
  /** Borrow APY */
  borrowApy: number;
  /** Utilization rate */
  utilization: number;
  /** Collateral factor */
  collateralFactor: number;
  /** Can be used as collateral */
  isCollateral: boolean;
  /** Available liquidity */
  availableLiquidity: number;
  /** User can supply */
  canSupply?: boolean;
  /** User can borrow */
  canBorrow?: boolean;
}

export interface UserPosition {
  /** Market ID */
  marketId: string;
  /** Token */
  token: LendingToken;
  /** Supplied amount */
  supplyAmount: number;
  /** Supplied value USD */
  supplyValueUsd: number;
  /** Borrowed amount */
  borrowAmount: number;
  /** Borrowed value USD */
  borrowValueUsd: number;
  /** Is used as collateral */
  isCollateral: boolean;
  /** Claimable rewards */
  rewards?: number;
}

export interface LendingStats {
  /** Total supply value */
  totalSupplyValue: number;
  /** Total borrow value */
  totalBorrowValue: number;
  /** Net APY */
  netApy: number;
  /** Health factor (>1 = safe, <1 = liquidation risk) */
  healthFactor?: number;
  /** Borrow limit */
  borrowLimit: number;
  /** Borrow limit used */
  borrowLimitUsed: number;
  /** Available to borrow */
  availableToBorrow: number;
  /** Claimable rewards */
  totalRewards?: number;
}

export type LendingTab = 'supply' | 'borrow' | 'positions' | 'rewards';
export type LendingAction = 'supply' | 'withdraw' | 'borrow' | 'repay';

export interface LendingPageProps {
  /** Active tab */
  activeTab?: LendingTab;
  /** Callback when tab changes */
  onTabChange?: (tab: LendingTab) => void;
  /** Active protocol filter */
  protocolFilter?: LendingProtocol | 'all';
  /** Callback when protocol changes */
  onProtocolChange?: (protocol: LendingProtocol | 'all') => void;
  /** Whether connected */
  isConnected?: boolean;
  /** Whether loading */
  isLoading?: boolean;
  /** User stats */
  userStats?: LendingStats;
  /** Markets */
  markets?: LendingMarket[];
  /** User positions */
  positions?: UserPosition[];
  /** Search query */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  
  // Actions
  /** Open supply modal */
  onSupply?: (market: LendingMarket) => void;
  /** Open withdraw modal */
  onWithdraw?: (position: UserPosition) => void;
  /** Open borrow modal */
  onBorrow?: (market: LendingMarket) => void;
  /** Open repay modal */
  onRepay?: (position: UserPosition) => void;
  /** Toggle collateral */
  onToggleCollateral?: (position: UserPosition, enabled: boolean) => void;
  /** Claim rewards */
  onClaimRewards?: () => void;
  /** Connect wallet */
  onConnect?: () => void;
  
  // Render props
  /** Render supply modal */
  renderSupplyModal?: () => React.ReactNode;
  /** Render borrow modal */
  renderBorrowModal?: () => React.ReactNode;
  /** Render protocol info */
  renderProtocolInfo?: (protocol: LendingProtocol) => React.ReactNode;
  /** Render risk warning */
  renderRiskWarning?: () => React.ReactNode;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrency(value: number): string {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatAmount(amount: number, decimals: number = 4): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`;
  return amount.toFixed(decimals);
}

function getHealthFactorColor(hf: number): string {
  if (hf >= 2) return 'text-green-500';
  if (hf >= 1.5) return 'text-yellow-500';
  if (hf >= 1) return 'text-orange-500';
  return 'text-red-500';
}

function getHealthFactorLabel(hf: number): string {
  if (hf >= 2) return 'Safe';
  if (hf >= 1.5) return 'Moderate';
  if (hf >= 1) return 'At Risk';
  return 'Liquidation Risk';
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface UserStatsBarProps {
  stats?: LendingStats;
}

function UserStatsBar({ stats }: UserStatsBarProps) {
  if (!stats) return null;
  
  const borrowUsedPercent = stats.borrowLimit > 0 
    ? (stats.borrowLimitUsed / stats.borrowLimit) * 100 
    : 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* Supply Value */}
          <div>
            <p className="text-sm text-muted-foreground">Total Supplied</p>
            <p className="text-xl font-bold text-green-500">{formatCurrency(stats.totalSupplyValue)}</p>
          </div>
          
          {/* Borrow Value */}
          <div>
            <p className="text-sm text-muted-foreground">Total Borrowed</p>
            <p className="text-xl font-bold text-red-500">{formatCurrency(stats.totalBorrowValue)}</p>
          </div>
          
          {/* Net APY */}
          <div>
            <p className="text-sm text-muted-foreground">Net APY</p>
            <p className={`text-xl font-bold ${stats.netApy >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercent(stats.netApy)}
            </p>
          </div>
          
          {/* Health Factor */}
          {stats.healthFactor !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground">Health Factor</p>
              <p className={`text-xl font-bold ${getHealthFactorColor(stats.healthFactor)}`}>
                {stats.healthFactor === Infinity ? '∞' : stats.healthFactor.toFixed(2)}
              </p>
              <p className={`text-xs ${getHealthFactorColor(stats.healthFactor)}`}>
                {getHealthFactorLabel(stats.healthFactor)}
              </p>
            </div>
          )}
          
          {/* Borrow Limit */}
          <div>
            <p className="text-sm text-muted-foreground">Borrow Limit Used</p>
            <div className="flex items-center gap-2">
              <Progress value={borrowUsedPercent} className="flex-1 h-2" />
              <span className="text-sm font-medium">{borrowUsedPercent.toFixed(0)}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.availableToBorrow)} available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MarketRowProps {
  market: LendingMarket;
  onSupply?: () => void;
  onBorrow?: () => void;
}

function MarketRow({ market, onSupply, onBorrow }: MarketRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
      {/* Token */}
      <div className="flex items-center gap-3 min-w-[150px]">
        {market.token.iconUrl ? (
          <img 
            src={market.token.iconUrl} 
            alt={market.token.symbol}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
            {market.token.symbol.slice(0, 2)}
          </div>
        )}
        <div>
          <p className="font-medium">{market.token.symbol}</p>
          <p className="text-xs text-muted-foreground">{market.token.name}</p>
        </div>
      </div>
      
      {/* Total Supply */}
      <div className="text-right min-w-[100px]">
        <p className="font-medium">{formatCurrency(market.totalSupply * market.token.priceUsd)}</p>
        <p className="text-xs text-muted-foreground">{formatAmount(market.totalSupply)}</p>
      </div>
      
      {/* Supply APY */}
      <div className="text-right min-w-[80px]">
        <p className="font-medium text-green-500">{formatPercent(market.supplyApy)}</p>
        <p className="text-xs text-muted-foreground">Supply APY</p>
      </div>
      
      {/* Total Borrow */}
      <div className="text-right min-w-[100px]">
        <p className="font-medium">{formatCurrency(market.totalBorrow * market.token.priceUsd)}</p>
        <p className="text-xs text-muted-foreground">{formatAmount(market.totalBorrow)}</p>
      </div>
      
      {/* Borrow APY */}
      <div className="text-right min-w-[80px]">
        <p className="font-medium text-red-500">{formatPercent(market.borrowApy)}</p>
        <p className="text-xs text-muted-foreground">Borrow APY</p>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 min-w-[140px] justify-end">
        {market.canSupply !== false && (
          <Button size="sm" variant="outline" onClick={onSupply}>
            Supply
          </Button>
        )}
        {market.canBorrow !== false && (
          <Button size="sm" variant="outline" onClick={onBorrow}>
            Borrow
          </Button>
        )}
      </div>
    </div>
  );
}

interface PositionRowProps {
  position: UserPosition;
  onWithdraw?: () => void;
  onRepay?: () => void;
  onToggleCollateral?: (enabled: boolean) => void;
}

function PositionRow({ position, onWithdraw, onRepay, onToggleCollateral }: PositionRowProps) {
  const hasSupply = position.supplyAmount > 0;
  const hasBorrow = position.borrowAmount > 0;
  
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        {/* Token */}
        <div className="flex items-center gap-3 min-w-[150px]">
          {position.token.iconUrl ? (
            <img 
              src={position.token.iconUrl} 
              alt={position.token.symbol}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
              {position.token.symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="font-medium">{position.token.symbol}</p>
            <p className="text-xs text-muted-foreground">{position.token.name}</p>
          </div>
        </div>
        
        {/* Supply */}
        {hasSupply && (
          <div className="text-right">
            <p className="font-medium text-green-500">{formatAmount(position.supplyAmount)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(position.supplyValueUsd)} supplied</p>
          </div>
        )}
        
        {/* Borrow */}
        {hasBorrow && (
          <div className="text-right">
            <p className="font-medium text-red-500">{formatAmount(position.borrowAmount)}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(position.borrowValueUsd)} borrowed</p>
          </div>
        )}
        
        {/* Collateral Toggle */}
        {hasSupply && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Collateral</span>
            <button
              className={`w-10 h-5 rounded-full transition-colors ${
                position.isCollateral ? 'bg-green-500' : 'bg-muted'
              }`}
              onClick={() => onToggleCollateral?.(!position.isCollateral)}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                position.isCollateral ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasSupply && (
            <Button size="sm" variant="outline" onClick={onWithdraw}>
              Withdraw
            </Button>
          )}
          {hasBorrow && (
            <Button size="sm" variant="outline" onClick={onRepay}>
              Repay
            </Button>
          )}
        </div>
      </div>
      
      {/* Rewards */}
      {position.rewards && position.rewards > 0 && (
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Claimable Rewards</span>
          <span className="text-sm font-medium text-yellow-500">
            {formatCurrency(position.rewards)}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function LendingLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-32" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function LendingPageTemplate({
  activeTab = 'supply',
  onTabChange,
  protocolFilter = 'all',
  onProtocolChange,
  isConnected,
  isLoading,
  userStats,
  markets = [],
  positions = [],
  searchQuery = '',
  onSearchChange,
  onSupply,
  onWithdraw,
  onBorrow,
  onRepay,
  onToggleCollateral,
  onClaimRewards,
  onConnect,
  renderSupplyModal,
  renderBorrowModal,
  renderProtocolInfo: _renderProtocolInfo,
  renderRiskWarning,
}: LendingPageProps) {
  if (isLoading) {
    return <LendingLoadingSkeleton />;
  }
  
  // Filter markets
  const filteredMarkets = markets.filter(m => {
    if (protocolFilter !== 'all' && m.protocol !== protocolFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.token.symbol.toLowerCase().includes(q) || 
             m.token.name.toLowerCase().includes(q);
    }
    return true;
  });
  
  // Positions with values
  const supplyPositions = positions.filter(p => p.supplyAmount > 0);
  const borrowPositions = positions.filter(p => p.borrowAmount > 0);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🏦</span>
          Lending
        </h1>
        
        {!isConnected && (
          <Button onClick={onConnect}>Connect Wallet</Button>
        )}
        
        {isConnected && userStats?.totalRewards && userStats.totalRewards > 0 && (
          <Button onClick={onClaimRewards} className="gap-2">
            <span>🎁</span>
            Claim {formatCurrency(userStats.totalRewards)}
          </Button>
        )}
      </div>
      
      {/* Risk Warning */}
      {renderRiskWarning?.()}
      
      {/* User Stats */}
      {isConnected && <UserStatsBar stats={userStats} />}
      
      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Protocol Filter */}
        <div className="flex rounded-lg border overflow-hidden">
          {(['all', 'moonwell', 'aave', 'compound'] as const).map(protocol => (
            <button
              key={protocol}
              className={`px-3 py-1 text-sm transition-colors ${
                protocolFilter === protocol 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
              onClick={() => onProtocolChange?.(protocol)}
            >
              {protocol === 'all' ? 'All' : protocol.charAt(0).toUpperCase() + protocol.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search markets..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as LendingTab)}>
        <TabsList>
          <TabsTrigger value="supply" className="gap-2">
            <span>📥</span> Supply
          </TabsTrigger>
          <TabsTrigger value="borrow" className="gap-2">
            <span>📤</span> Borrow
          </TabsTrigger>
          <TabsTrigger value="positions" className="gap-2">
            <span>📊</span> My Positions
            {positions.length > 0 && (
              <Badge variant="secondary" className="ml-1">{positions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <span>🎁</span> Rewards
          </TabsTrigger>
        </TabsList>
        
        {/* Supply Tab */}
        <TabsContent value="supply" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supply Markets</CardTitle>
              <CardDescription>
                Supply assets to earn interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground border-b mb-2">
                <span className="min-w-[150px]">Asset</span>
                <span className="min-w-[100px] text-right">Total Supply</span>
                <span className="min-w-[80px] text-right">Supply APY</span>
                <span className="min-w-[100px] text-right">Total Borrow</span>
                <span className="min-w-[80px] text-right">Borrow APY</span>
                <span className="min-w-[140px]"></span>
              </div>
              
              {filteredMarkets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No markets found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMarkets.map(market => (
                    <MarketRow
                      key={market.id}
                      market={market}
                      onSupply={() => onSupply?.(market)}
                      onBorrow={() => onBorrow?.(market)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Borrow Tab */}
        <TabsContent value="borrow" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Borrow Markets</CardTitle>
              <CardDescription>
                Borrow assets using your collateral
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect wallet to borrow</p>
                  <Button onClick={onConnect}>Connect Wallet</Button>
                </div>
              ) : (userStats?.borrowLimit ?? 0) === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No borrow limit</p>
                  <p className="text-sm text-muted-foreground">
                    Supply assets and enable them as collateral to borrow
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMarkets
                    .filter(m => m.canBorrow !== false)
                    .map(market => (
                      <MarketRow
                        key={market.id}
                        market={market}
                        onSupply={() => onSupply?.(market)}
                        onBorrow={() => onBorrow?.(market)}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-6 mt-4">
          {!isConnected ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Connect wallet to view positions</p>
                <Button onClick={onConnect}>Connect Wallet</Button>
              </CardContent>
            </Card>
          ) : positions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <span className="text-4xl mb-4 block">📊</span>
                <p className="text-muted-foreground">No active positions</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supply or borrow assets to create a position
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Supply Positions */}
              {supplyPositions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-green-500">📥</span>
                      Supplied Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supplyPositions.map(position => (
                      <PositionRow
                        key={position.marketId}
                        position={position}
                        onWithdraw={() => onWithdraw?.(position)}
                        onToggleCollateral={(enabled) => onToggleCollateral?.(position, enabled)}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Borrow Positions */}
              {borrowPositions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-red-500">📤</span>
                      Borrowed Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {borrowPositions.map(position => (
                      <PositionRow
                        key={position.marketId}
                        position={position}
                        onRepay={() => onRepay?.(position)}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🎁</span>
                Rewards
              </CardTitle>
              <CardDescription>
                Earn additional rewards by supplying and borrowing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect wallet to view rewards</p>
                  <Button onClick={onConnect}>Connect Wallet</Button>
                </div>
              ) : (userStats?.totalRewards ?? 0) === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🎁</span>
                  <p className="text-muted-foreground">No rewards to claim</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supply and borrow assets to earn rewards
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-500/10">
                    <div>
                      <p className="font-medium">Total Claimable</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        {formatCurrency(userStats?.totalRewards ?? 0)}
                      </p>
                    </div>
                    <Button onClick={onClaimRewards} className="gap-2">
                      <span>🎁</span>
                      Claim All
                    </Button>
                  </div>
                  
                  {/* Per-position rewards */}
                  {positions.filter(p => p.rewards && p.rewards > 0).map(position => (
                    <div key={position.marketId} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {position.token.iconUrl ? (
                          <img 
                            src={position.token.iconUrl} 
                            alt={position.token.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                            {position.token.symbol.slice(0, 2)}
                          </div>
                        )}
                        <span>{position.token.symbol}</span>
                      </div>
                      <span className="font-medium text-yellow-500">
                        {formatCurrency(position.rewards ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      {renderSupplyModal?.()}
      {renderBorrowModal?.()}
    </div>
  );
}

export default LendingPageTemplate;
