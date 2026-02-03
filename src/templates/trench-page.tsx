/**
 * Trench (Copy Trading) Page Template
 * 
 * Full-featured copy trading page with:
 * - Trader discovery and leaderboard
 * - Active copy relationships management
 * - Performance tracking and statistics
 * - Copy settings configuration
 * 
 * @example
 * ```tsx
 * <TrenchPageTemplate
 *   traders={topTraders}
 *   myRelationships={relationships}
 *   performanceSummary={summary}
 *   onStartCopying={handleCopy}
 *   onStopCopying={handleStop}
 *   renderTraderCard={(trader) => <TraderCard trader={trader} />}
 * />
 * ```
 */

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent } from "../components/core/card";
import { Input } from "../components/core/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export type SortOption = "pnl_30d" | "pnl_7d" | "win_rate" | "copiers" | "total_trades";

export interface CopyTrader {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  pnl_7d: number;
  pnl_30d: number;
  pnl_all_time: number;
  win_rate: number;
  total_trades: number;
  copier_count: number;
  avg_trade_size: number;
  risk_score: "low" | "medium" | "high";
  is_verified?: boolean;
  specialties?: string[];
}

export interface CopyRelationship {
  id: string;
  trader: CopyTrader;
  started_at: string;
  allocation: number;
  max_trade_size: number;
  is_paused: boolean;
  total_copied_trades: number;
  total_pnl: number;
  status: "active" | "paused" | "stopped";
}

export interface PerformanceSummary {
  total_invested: number;
  total_pnl: number;
  active_copies: number;
  total_copied_trades: number;
  best_performer?: CopyTrader;
  worst_performer?: CopyTrader;
}

export interface TrenchPageTemplateProps {
  /** Top traders list */
  traders: CopyTrader[];
  /** User's copy relationships */
  myRelationships: CopyRelationship[];
  /** Performance summary */
  performanceSummary: PerformanceSummary | null;
  /** Search results */
  searchResults?: CopyTrader[];
  /** Search query */
  searchQuery?: string;
  /** Sort option */
  sortBy?: SortOption;
  /** Loading state */
  isLoading?: boolean;
  /** Searching state */
  isSearching?: boolean;
  /** Active tab */
  activeTab?: string;
  /** Selected trader for dialog */
  selectedTrader?: CopyTrader | null;
  /** Whether user has a social profile */
  hasSocialProfile?: boolean;
  /** Whether user is connected */
  isConnected?: boolean;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Sort change handler */
  onSortChange?: (sort: SortOption) => void;
  /** Start copying a trader */
  onStartCopying?: (traderId: string, settings?: CopySettings) => void;
  /** Stop copying a trader */
  onStopCopying?: (relationshipId: string) => void;
  /** Pause/resume copying */
  onTogglePause?: (relationshipId: string) => void;
  /** Update copy settings */
  onUpdateSettings?: (relationshipId: string, settings: Partial<CopySettings>) => void;
  /** View trader profile */
  onViewTrader?: (trader: CopyTrader) => void;
  /** Create social profile */
  onCreateProfile?: () => void;
  /** Connect wallet */
  onConnect?: () => void;
  /** Render custom trader card */
  renderTraderCard?: (trader: CopyTrader, onCopy: () => void) => React.ReactNode;
  /** Render custom relationship card */
  renderRelationshipCard?: (rel: CopyRelationship) => React.ReactNode;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface CopySettings {
  allocation: number;
  max_trade_size: number;
  copy_stop_loss?: boolean;
  copy_take_profit?: boolean;
}

// =============================================================================
// Sub-components
// =============================================================================

interface PerformanceCardsProps {
  summary: PerformanceSummary | null;
  isLoading?: boolean;
}

function PerformanceCards({ summary, isLoading }: PerformanceCardsProps) {
  if (isLoading || !summary) {
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

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Invested</p>
          <p className="text-2xl font-bold">${summary.total_invested.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total P&L</p>
          <p className={cn(
            "text-2xl font-bold",
            summary.total_pnl >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {summary.total_pnl >= 0 ? "+" : ""}${summary.total_pnl.toLocaleString()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Active Copies</p>
          <p className="text-2xl font-bold">{summary.active_copies}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Copied Trades</p>
          <p className="text-2xl font-bold">{summary.total_copied_trades}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface TraderCardDefaultProps {
  trader: CopyTrader;
  onCopy?: () => void;
  onView?: () => void;
}

function TraderCardDefault({ trader, onCopy, onView }: TraderCardDefaultProps) {
  const riskColors = {
    low: "text-green-500 bg-green-500/10",
    medium: "text-yellow-500 bg-yellow-500/10",
    high: "text-red-500 bg-red-500/10",
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={trader.avatar_url} />
              <AvatarFallback>{trader.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{trader.username}</h3>
                {trader.is_verified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {trader.bio || "No bio"}
              </p>
            </div>
          </div>
          <Badge className={riskColors[trader.risk_score]}>
            {trader.risk_score} risk
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">30d P&L</p>
            <p className={cn(
              "text-sm font-semibold",
              trader.pnl_30d >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {trader.pnl_30d >= 0 ? "+" : ""}{trader.pnl_30d.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-sm font-semibold">{trader.win_rate.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Copiers</p>
            <p className="text-sm font-semibold">{trader.copier_count}</p>
          </div>
        </div>

        {/* Specialties */}
        {trader.specialties && trader.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {trader.specialties.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button className="flex-1" size="sm" onClick={onCopy}>
            Copy Trader
          </Button>
          <Button variant="outline" size="sm" onClick={onView}>
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface RelationshipCardDefaultProps {
  relationship: CopyRelationship;
  onStop?: () => void;
  onTogglePause?: () => void;
  onUpdateSettings?: () => void;
}

function RelationshipCardDefault({ 
  relationship: rel, 
  onStop, 
  onTogglePause,
  onUpdateSettings,
}: RelationshipCardDefaultProps) {
  return (
    <Card className={cn(rel.is_paused && "opacity-60")}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={rel.trader.avatar_url} />
              <AvatarFallback>{rel.trader.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{rel.trader.username}</h3>
              <p className="text-xs text-muted-foreground">
                Copying since {new Date(rel.started_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant={rel.is_paused ? "secondary" : "default"}>
            {rel.is_paused ? "Paused" : "Active"}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Allocation</p>
            <p className="text-sm font-semibold">${rel.allocation.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total P&L</p>
            <p className={cn(
              "text-sm font-semibold",
              rel.total_pnl >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {rel.total_pnl >= 0 ? "+" : ""}${rel.total_pnl.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="text-sm font-semibold">{rel.total_copied_trades}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onTogglePause}
          >
            {rel.is_paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="sm" onClick={onUpdateSettings}>
            Settings
          </Button>
          <Button variant="destructive" size="sm" onClick={onStop}>
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function TrenchPageTemplate({
  traders,
  myRelationships,
  performanceSummary,
  searchResults,
  searchQuery = "",
  sortBy = "pnl_30d",
  isLoading = false,
  isSearching = false,
  activeTab = "discover",
  selectedTrader: _selectedTrader,
  hasSocialProfile = true,
  isConnected = true,
  onTabChange,
  onSearch,
  onSortChange,
  onStartCopying,
  onStopCopying,
  onTogglePause,
  onUpdateSettings,
  onViewTrader,
  onCreateProfile,
  onConnect,
  renderTraderCard,
  renderRelationshipCard,
  headerContent,
  footerContent,
  className,
}: TrenchPageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  void _selectedTrader;
  // Not connected state
  if (!isConnected) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to start copy trading
            </p>
            <Button onClick={onConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No social profile state
  if (!hasSocialProfile) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Create Your Profile</h2>
            <p className="text-muted-foreground mb-4">
              You need a social profile to use copy trading features
            </p>
            <Button onClick={onCreateProfile}>Create Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayTraders = searchResults && searchQuery ? searchResults : traders;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Copy Trading</h1>
        <p className="text-muted-foreground">
          Discover and copy top traders automatically
        </p>
      </div>

      {headerContent}

      {/* Performance Summary */}
      <PerformanceCards summary={performanceSummary} isLoading={isLoading} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="discover">Discover Traders</TabsTrigger>
          <TabsTrigger value="portfolio">
            My Portfolio ({myRelationships.filter(r => !r.is_paused).length})
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search traders..."
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={onSortChange as (value: string) => void}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pnl_30d">30d P&L</SelectItem>
                <SelectItem value="pnl_7d">7d P&L</SelectItem>
                <SelectItem value="win_rate">Win Rate</SelectItem>
                <SelectItem value="copiers">Most Copied</SelectItem>
                <SelectItem value="total_trades">Most Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Traders Grid */}
          {isLoading || isSearching ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayTraders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {searchQuery ? "No traders found matching your search" : "No traders available"}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayTraders.map((trader) => 
                renderTraderCard ? (
                  <React.Fragment key={trader.id}>
                    {renderTraderCard(trader, () => onStartCopying?.(trader.id))}
                  </React.Fragment>
                ) : (
                  <TraderCardDefault
                    key={trader.id}
                    trader={trader}
                    onCopy={() => onStartCopying?.(trader.id)}
                    onView={() => onViewTrader?.(trader)}
                  />
                )
              )}
            </div>
          )}
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myRelationships.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No Active Copies</h3>
                <p className="text-muted-foreground mb-4">
                  Start copying top traders to build your portfolio
                </p>
                <Button onClick={() => onTabChange?.("discover")}>
                  Discover Traders
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myRelationships.map((rel) =>
                renderRelationshipCard ? (
                  <React.Fragment key={rel.id}>
                    {renderRelationshipCard(rel)}
                  </React.Fragment>
                ) : (
                  <RelationshipCardDefault
                    key={rel.id}
                    relationship={rel}
                    onStop={() => onStopCopying?.(rel.id)}
                    onTogglePause={() => onTogglePause?.(rel.id)}
                    onUpdateSettings={() => onUpdateSettings?.(rel.id, {})}
                  />
                )
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {footerContent}
    </div>
  );
}

export default TrenchPageTemplate;
