/**
 * Home Page Template
 * 
 * Main dashboard/home page with:
 * - Welcome section and stats
 * - Quick actions
 * - Feature highlights
 * - Activity feed
 * - Terminal chat integration
 * 
 * @example
 * ```tsx
 * <HomePageTemplate
 *   userStats={stats}
 *   quickActions={actions}
 *   activityFeed={activities}
 *   onActionClick={handleAction}
 *   renderTerminalChat={() => <TerminalChat />}
 * />
 * ```
 */

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface UserStats {
  portfolioValue: number;
  portfolioChange24h: number;
  totalTrades: number;
  totalGames: number;
  skaiPoints: number;
  tier: string;
  streakDays?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  route: string;
  badge?: string;
  isNew?: boolean;
}

export interface ActivityItem {
  id: string;
  type: "trade" | "game" | "reward" | "social" | "system";
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
  amount?: number;
  isPositive?: boolean;
}

export interface FeatureHighlight {
  id: string;
  title: string;
  description: string;
  image?: string;
  route: string;
  cta: string;
}

export interface HomePageTemplateProps {
  /** User statistics */
  userStats: UserStats | null;
  /** Quick action buttons */
  quickActions: QuickAction[];
  /** Activity feed items */
  activityFeed: ActivityItem[];
  /** Feature highlights */
  featureHighlights?: FeatureHighlight[];
  /** User's display name */
  userName?: string;
  /** User's avatar URL */
  userAvatar?: string;
  /** Whether user is connected */
  isConnected?: boolean;
  /** Whether to show welcome modal */
  showWelcomeModal?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Quick action click handler */
  onActionClick?: (action: QuickAction) => void;
  /** Feature highlight click handler */
  onFeatureClick?: (feature: FeatureHighlight) => void;
  /** Activity item click handler */
  onActivityClick?: (activity: ActivityItem) => void;
  /** Connect wallet handler */
  onConnect?: () => void;
  /** Close welcome modal handler */
  onCloseWelcome?: () => void;
  /** View all activity handler */
  onViewAllActivity?: () => void;
  /** Render terminal chat */
  renderTerminalChat?: () => React.ReactNode;
  /** Render welcome modal */
  renderWelcomeModal?: () => React.ReactNode;
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

interface StatsGridProps {
  stats: UserStats | null;
  isLoading?: boolean;
}

function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Portfolio Value</p>
          <p className="text-2xl font-bold">${stats.portfolioValue.toLocaleString()}</p>
          <p className={cn(
            "text-sm",
            stats.portfolioChange24h >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {stats.portfolioChange24h >= 0 ? "+" : ""}{stats.portfolioChange24h.toFixed(2)}% (24h)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">SKAI Points</p>
          <p className="text-2xl font-bold">{stats.skaiPoints.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{stats.tier}</Badge>
            {stats.streakDays && stats.streakDays > 0 && (
              <span className="text-sm text-orange-500">🔥 {stats.streakDays} day streak</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Trades</p>
          <p className="text-2xl font-bold">{stats.totalTrades}</p>
          <p className="text-sm text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Games Played</p>
          <p className="text-2xl font-bold">{stats.totalGames}</p>
          <p className="text-sm text-muted-foreground">All time</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface QuickActionsGridProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

function QuickActionsGrid({ actions, onActionClick }: QuickActionsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Card
          key={action.id}
          className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
          onClick={() => onActionClick?.(action)}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {action.icon}
              </div>
              {action.isNew && (
                <Badge variant="default" className="text-xs">New</Badge>
              )}
              {action.badge && !action.isNew && (
                <Badge variant="secondary" className="text-xs">{action.badge}</Badge>
              )}
            </div>
            <h3 className="font-semibold mt-4">{action.title}</h3>
            {action.description && (
              <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onActivityClick?: (activity: ActivityItem) => void;
  onViewAll?: () => void;
}

function ActivityFeed({ activities, onActivityClick, onViewAll }: ActivityFeedProps) {
  const typeColors = {
    trade: "text-blue-500 bg-blue-500/10",
    game: "text-purple-500 bg-purple-500/10",
    reward: "text-yellow-500 bg-yellow-500/10",
    social: "text-green-500 bg-green-500/10",
    system: "text-gray-500 bg-gray-500/10",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onActivityClick?.(activity)}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  typeColors[activity.type]
                )}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-right">
                  {activity.amount !== undefined && (
                    <p className={cn(
                      "font-medium",
                      activity.isPositive ? "text-green-500" : "text-red-500"
                    )}>
                      {activity.isPositive ? "+" : "-"}${Math.abs(activity.amount).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FeatureHighlightsProps {
  highlights: FeatureHighlight[];
  onFeatureClick?: (feature: FeatureHighlight) => void;
}

function FeatureHighlights({ highlights, onFeatureClick }: FeatureHighlightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {highlights.map((feature) => (
        <Card 
          key={feature.id}
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          onClick={() => onFeatureClick?.(feature)}
        >
          {feature.image && (
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className={cn(!feature.image && "pt-6")}>
            <h3 className="font-bold text-lg">{feature.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
            <Button className="mt-4" variant="outline" size="sm">
              {feature.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function HomePageTemplate({
  userStats,
  quickActions,
  activityFeed,
  featureHighlights = [],
  userName,
  userAvatar,
  isConnected = true,
  showWelcomeModal = false,
  isLoading = false,
  onActionClick,
  onFeatureClick,
  onActivityClick,
  onConnect,
  onCloseWelcome: _onCloseWelcome,
  onViewAllActivity,
  renderTerminalChat,
  renderWelcomeModal,
  headerContent,
  footerContent,
  className,
}: HomePageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  void _onCloseWelcome;

  // Welcome modal
  if (showWelcomeModal && renderWelcomeModal) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderWelcomeModal()}
      </div>
    );
  }

  // Not connected
  if (!isConnected) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold mb-2">Welcome to SKAI</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to start trading, playing, and earning
            </p>
            <Button size="lg" onClick={onConnect}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>

        {/* Feature highlights for non-connected users */}
        {featureHighlights.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Discover SKAI</h2>
            <FeatureHighlights highlights={featureHighlights} onFeatureClick={onFeatureClick} />
          </section>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back{userName ? `, ${userName}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your portfolio
            </p>
          </div>
        </div>
      </div>

      {headerContent}

      {/* Stats Grid */}
      <StatsGrid stats={userStats} isLoading={isLoading} />

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <QuickActionsGrid actions={quickActions} onActionClick={onActionClick} />
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Feed */}
        <ActivityFeed 
          activities={activityFeed} 
          onActivityClick={onActivityClick}
          onViewAll={onViewAllActivity}
        />

        {/* Terminal Chat or Feature Highlights */}
        {renderTerminalChat ? (
          <Card>
            <CardHeader>
              <CardTitle>SKAI Assistant</CardTitle>
              <CardDescription>Ask me anything about trading</CardDescription>
            </CardHeader>
            <CardContent>
              {renderTerminalChat()}
            </CardContent>
          </Card>
        ) : featureHighlights.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Featured</h2>
            <FeatureHighlights 
              highlights={featureHighlights.slice(0, 2)} 
              onFeatureClick={onFeatureClick} 
            />
          </div>
        ) : null}
      </div>

      {footerContent}
    </div>
  );
}

export default HomePageTemplate;
