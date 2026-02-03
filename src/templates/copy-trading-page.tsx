/**
 * CopyTradingPageTemplate
 * 
 * Pure presentational template for the copy trading hub.
 * Browse top traders, follow/copy their trades, manage settings.
 * 
 * @example
 * ```tsx
 * import { CopyTradingPageTemplate } from '@skai/ui';
 * 
 * function CopyTrading() {
 *   return (
 *     <CopyTradingPageTemplate
 *       leaderboard={traders}
 *       following={myFollowing}
 *       onFollow={handleFollow}
 *       renderTraderProfile={() => <TraderProfile />}
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
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";

// ============================================================================
// TYPES
// ============================================================================

export type LeaderboardPeriod = '24h' | '7d' | '30d' | 'all';
export type LeaderboardSortBy = 'pnl' | 'winRate' | 'trades' | 'followers' | 'roi';

export interface TraderStats {
  /** Total PnL */
  totalPnl: number;
  /** Win rate percentage */
  winRate: number;
  /** Total trades */
  totalTrades: number;
  /** Average profit per trade */
  avgProfit: number;
  /** Max drawdown percentage */
  maxDrawdown: number;
  /** Sharpe ratio */
  sharpeRatio?: number;
  /** ROI percentage */
  roi: number;
}

export interface LeaderboardTrader {
  /** Trader ID */
  id: string;
  /** Wallet address */
  address: string;
  /** Username */
  username?: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Is verified */
  isVerified?: boolean;
  /** Rank */
  rank: number;
  /** Stats for the period */
  stats: TraderStats;
  /** Follower count */
  followers: number;
  /** Is currently being followed */
  isFollowing?: boolean;
  /** Copy multiplier if copying */
  copyMultiplier?: number;
}

export interface FollowRelation {
  /** Relation ID */
  id: string;
  /** Trader being followed */
  trader: LeaderboardTrader;
  /** Copy settings */
  copyEnabled: boolean;
  /** Copy amount per trade */
  copyAmount?: number;
  /** Copy multiplier */
  copyMultiplier: number;
  /** Max position size */
  maxPositionSize?: number;
  /** PnL since following */
  pnlSinceFollow: number;
  /** Trades copied */
  tradesCopied: number;
  /** Started following at */
  startedAt: Date;
}

export interface CopiedTrade {
  /** Trade ID */
  id: string;
  /** Original trader */
  trader: LeaderboardTrader;
  /** Market/pair */
  market: string;
  /** Side */
  side: 'long' | 'short';
  /** Entry price */
  entryPrice: number;
  /** Exit price */
  exitPrice?: number;
  /** Size */
  size: number;
  /** PnL */
  pnl?: number;
  /** Status */
  status: 'pending' | 'executed' | 'partial' | 'failed' | 'closed';
  /** Copied at */
  copiedAt: Date;
}

export type CopyTradingTab = 'leaderboard' | 'following' | 'history' | 'settings';

export interface CopyTradingPageProps {
  /** Active tab */
  activeTab?: CopyTradingTab;
  /** Callback when tab changes */
  onTabChange?: (tab: CopyTradingTab) => void;
  /** Whether user is connected */
  isConnected?: boolean;
  /** User wallet address */
  userAddress?: string;
  /** Whether loading */
  isLoading?: boolean;
  /** Leaderboard data */
  leaderboard?: LeaderboardTrader[];
  /** Time period for leaderboard */
  period?: LeaderboardPeriod;
  /** Callback when period changes */
  onPeriodChange?: (period: LeaderboardPeriod) => void;
  /** Sort by field */
  sortBy?: LeaderboardSortBy;
  /** Callback when sort changes */
  onSortChange?: (sort: LeaderboardSortBy) => void;
  /** Search query */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Currently following */
  following?: FollowRelation[];
  /** Copied trades history */
  copiedTrades?: CopiedTrade[];
  /** Selected trader for detail view */
  selectedTrader?: LeaderboardTrader | null;
  /** Callback when selecting trader */
  onSelectTrader?: (trader: LeaderboardTrader | null) => void;
  /** Follow a trader */
  onFollow?: (trader: LeaderboardTrader) => void;
  /** Unfollow a trader */
  onUnfollow?: (traderId: string) => void;
  /** Start copying trades */
  onStartCopy?: (traderId: string, settings: { amount: number; multiplier: number }) => void;
  /** Stop copying trades */
  onStopCopy?: (traderId: string) => void;
  /** User's total stats from copy trading */
  userStats?: {
    totalPnl: number;
    tradesCopied: number;
    activeFollows: number;
    avgWinRate: number;
  };
  
  // Render props
  /** Render trader profile card */
  renderTraderProfile?: (trader: LeaderboardTrader) => React.ReactNode;
  /** Render settings panel */
  renderSettings?: () => React.ReactNode;
  /** Render notifications panel */
  renderNotifications?: () => React.ReactNode;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatPnl(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  if (Math.abs(value) >= 1000000) {
    return `${prefix}$${(value / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${prefix}$${(value / 1000).toFixed(1)}K`;
  }
  return `${prefix}$${value.toFixed(2)}`;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface StatsOverviewProps {
  stats?: {
    totalPnl: number;
    tradesCopied: number;
    activeFollows: number;
    avgWinRate: number;
  };
}

function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span className="text-sm text-muted-foreground">Total PnL</span>
          </div>
          <div className={`text-2xl font-bold mt-1 ${stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatPnl(stats.totalPnl)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="text-sm text-muted-foreground">Trades Copied</span>
          </div>
          <div className="text-2xl font-bold mt-1">{stats.tradesCopied}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
          <div className="text-2xl font-bold mt-1">{stats.activeFollows}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <span>📈</span>
            <span className="text-sm text-muted-foreground">Avg Win Rate</span>
          </div>
          <div className="text-2xl font-bold mt-1">{stats.avgWinRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  );
}

interface LeaderboardTableProps {
  traders: LeaderboardTrader[];
  sortBy: LeaderboardSortBy;
  onSortChange: (sort: LeaderboardSortBy) => void;
  onSelectTrader: (trader: LeaderboardTrader) => void;
  onFollow: (trader: LeaderboardTrader) => void;
}

function LeaderboardTable({ traders, sortBy, onSortChange, onSelectTrader, onFollow }: LeaderboardTableProps) {
  const headers: { key: LeaderboardSortBy; label: string }[] = [
    { key: 'pnl', label: 'PnL' },
    { key: 'roi', label: 'ROI' },
    { key: 'winRate', label: 'Win Rate' },
    { key: 'trades', label: 'Trades' },
    { key: 'followers', label: 'Followers' },
  ];
  
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 text-sm font-medium">#</th>
            <th className="text-left p-3 text-sm font-medium">Trader</th>
            {headers.map(h => (
              <th 
                key={h.key}
                className={`text-left p-3 text-sm font-medium cursor-pointer hover:text-foreground ${
                  sortBy === h.key ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => onSortChange(h.key)}
              >
                {h.label} {sortBy === h.key && '↓'}
              </th>
            ))}
            <th className="text-right p-3 text-sm font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {traders.map(trader => (
            <tr 
              key={trader.id} 
              className="border-t border-border hover:bg-muted/30 cursor-pointer"
              onClick={() => onSelectTrader(trader)}
            >
              <td className="p-3">
                <span className={`font-bold ${
                  trader.rank <= 3 ? 'text-yellow-500' : ''
                }`}>
                  {trader.rank <= 3 ? ['🥇', '🥈', '🥉'][trader.rank - 1] : trader.rank}
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={trader.avatarUrl} />
                    <AvatarFallback>{(trader.username || trader.address)[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-1">
                      {trader.username || formatAddress(trader.address)}
                      {trader.isVerified && <span className="text-blue-500">✓</span>}
                    </p>
                    {trader.username && (
                      <p className="text-xs text-muted-foreground">{formatAddress(trader.address)}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className={`p-3 ${trader.stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPnl(trader.stats.totalPnl)}
              </td>
              <td className={`p-3 ${trader.stats.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trader.stats.roi >= 0 ? '+' : ''}{trader.stats.roi.toFixed(1)}%
              </td>
              <td className="p-3">{trader.stats.winRate.toFixed(1)}%</td>
              <td className="p-3">{trader.stats.totalTrades}</td>
              <td className="p-3">{trader.followers}</td>
              <td className="p-3 text-right">
                <Button
                  variant={trader.isFollowing ? 'outline' : 'default'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow(trader);
                  }}
                >
                  {trader.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface FollowingListProps {
  following: FollowRelation[];
  onUnfollow: (traderId: string) => void;
  onStopCopy: (traderId: string) => void;
  onSelectTrader: (trader: LeaderboardTrader) => void;
}

function FollowingList({ following, onUnfollow, onStopCopy, onSelectTrader }: FollowingListProps) {
  if (following.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">👥</span>
        <p className="text-muted-foreground">You're not following anyone yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Browse the leaderboard to find top traders to follow
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {following.map(rel => (
        <Card key={rel.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => onSelectTrader(rel.trader)}
              >
                <Avatar>
                  <AvatarImage src={rel.trader.avatarUrl} />
                  <AvatarFallback>{(rel.trader.username || rel.trader.address)[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium flex items-center gap-1">
                    {rel.trader.username || formatAddress(rel.trader.address)}
                    {rel.trader.isVerified && <span className="text-blue-500">✓</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Following since {rel.startedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-medium ${rel.pnlSinceFollow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPnl(rel.pnlSinceFollow)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {rel.tradesCopied} trades copied
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {rel.copyEnabled ? (
                    <Button variant="outline" size="sm" onClick={() => onStopCopy(rel.trader.id)}>
                      Stop Copy
                    </Button>
                  ) : (
                    <Badge variant="secondary">Following Only</Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onUnfollow(rel.trader.id)}>
                    Unfollow
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function CopyTradingLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function CopyTradingPageTemplate({
  activeTab = 'leaderboard',
  onTabChange,
  isConnected,
  userAddress: _userAddress,
  isLoading,
  leaderboard = [],
  period = '7d',
  onPeriodChange,
  sortBy = 'pnl',
  onSortChange,
  searchQuery = '',
  onSearchChange,
  following = [],
  copiedTrades: _copiedTrades,
  selectedTrader,
  onSelectTrader,
  onFollow,
  onUnfollow,
  onStartCopy: _onStartCopy,
  onStopCopy,
  userStats,
  renderTraderProfile,
  renderSettings,
  renderNotifications: _renderNotifications,
}: CopyTradingPageProps) {
  if (isLoading) {
    return <CopyTradingLoadingSkeleton />;
  }
  
  // Trader detail view
  if (selectedTrader) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Button variant="ghost" onClick={() => onSelectTrader?.(null)}>
          ← Back to Leaderboard
        </Button>
        
        {renderTraderProfile ? (
          renderTraderProfile(selectedTrader)
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTrader.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {(selectedTrader.username || selectedTrader.address)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTrader.username || formatAddress(selectedTrader.address)}
                    {selectedTrader.isVerified && <span className="text-blue-500">✓</span>}
                  </CardTitle>
                  <CardDescription>
                    Rank #{selectedTrader.rank} • {selectedTrader.followers} followers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total PnL</p>
                  <p className={`text-xl font-bold ${selectedTrader.stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPnl(selectedTrader.stats.totalPnl)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className={`text-xl font-bold ${selectedTrader.stats.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedTrader.stats.roi.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-xl font-bold">{selectedTrader.stats.winRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                  <p className="text-xl font-bold">{selectedTrader.stats.totalTrades}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={() => onFollow?.(selectedTrader)}>
                  {selectedTrader.isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="outline">
                  📋 Copy Trades
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>📋</span>
          Copy Trading
        </h1>
        {renderSettings?.()}
      </div>
      
      {/* User Stats */}
      {isConnected && <StatsOverview stats={userStats} />}
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as CopyTradingTab)}>
        <TabsList>
          <TabsTrigger value="leaderboard" className="gap-2">
            <span>🏆</span> Leaderboard
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-2">
            <span>👥</span> Following ({following.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <span>📜</span> Trade History
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <span>⚙️</span> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
              <Input
                placeholder="Search traders..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['24h', '7d', '30d', 'all'] as LeaderboardPeriod[]).map(p => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPeriodChange?.(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Leaderboard */}
          <LeaderboardTable
            traders={leaderboard}
            sortBy={sortBy}
            onSortChange={onSortChange || (() => {})}
            onSelectTrader={onSelectTrader || (() => {})}
            onFollow={onFollow || (() => {})}
          />
        </TabsContent>
        
        <TabsContent value="following" className="mt-4">
          <FollowingList
            following={following}
            onUnfollow={onUnfollow || (() => {})}
            onStopCopy={onStopCopy || (() => {})}
            onSelectTrader={onSelectTrader || (() => {})}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">📜</span>
            <p className="text-muted-foreground">Trade history will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          {renderSettings?.() || (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">⚙️</span>
              <p className="text-muted-foreground">Settings panel not configured</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CopyTradingPageTemplate;
