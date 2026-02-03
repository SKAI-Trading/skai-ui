/**
 * AccountPageTemplate - User Account Settings Page
 *
 * Pure presentational component for the account/settings page.
 * All data and callbacks must be passed via props - NO data fetching here.
 *
 * Features:
 * - User summary card (avatar, name, tier)
 * - Tabbed interface (Profile, Analytics, Activity, Settings)
 * - Portfolio dashboard link
 * - Loading and disconnected states
 *
 * @module templates/account-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "../components/core/card";
import { Button } from "../components/core/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Loader2, Crown, User, BarChart3, Activity, Settings } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type AccountTab = "profile" | "analytics" | "activity" | "settings";

export interface AccountUser {
  id: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  tier?: string;
  email?: string;
  walletAddress?: string;
}

export interface AccountPageTemplateProps {
  /** Current user data */
  user?: AccountUser | null;
  /** Whether user is connected */
  isConnected: boolean;
  /** Whether auth is loading */
  isLoading: boolean;
  /** Current active tab */
  activeTab: AccountTab;
  /** Callback when tab changes */
  onTabChange: (tab: AccountTab) => void;
  /** Callback for Portfolio Dashboard button */
  onPortfolioClick: () => void;
  /** Content for Profile tab */
  profileContent: React.ReactNode;
  /** Content for Analytics tab */
  analyticsContent: React.ReactNode;
  /** Content for Activity tab */
  activityContent: React.ReactNode;
  /** Content for Settings tab */
  settingsContent: React.ReactNode;
  /** User summary card component (optional - use default or custom) */
  userSummaryCard?: React.ReactNode;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Loading state component
 */
function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Default user summary card
 */
function DefaultUserSummaryCard({ user }: { user?: AccountUser | null }) {
  if (!user) return null;

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-card to-card/80">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
            <AvatarFallback className="bg-primary/10 text-lg font-bold">
              {user.displayName?.[0] || user.username?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.displayName || user.username}</h2>
            {user.username && user.displayName && (
              <p className="text-muted-foreground">@{user.username}</p>
            )}
            {user.tier && (
              <div className="mt-1 flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{user.tier} Tier</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function AccountPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 py-4">
        {/* User Summary Skeleton */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-6 w-40" />
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <Skeleton className="mx-auto h-10 w-full max-w-3xl" />
          <Skeleton className="mx-auto h-64 w-full max-w-2xl" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AccountPageTemplate({
  user,
  isConnected,
  isLoading,
  activeTab,
  onTabChange,
  onPortfolioClick,
  profileContent,
  analyticsContent,
  activityContent,
  settingsContent,
  userSummaryCard,
  className,
}: AccountPageTemplateProps) {
  // Loading state - auth is loading
  if (isConnected && isLoading) {
    return <LoadingState message="Loading your profile..." />;
  }

  // Loading state - verifying account
  if (isConnected && !isLoading && !user?.id) {
    return <LoadingState message="Verifying account..." />;
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background to-primary/5",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Hero Section - User Summary Card */}
        {userSummaryCard || <DefaultUserSummaryCard user={user} />}

        {/* Tabs Section */}
        <div className="mt-4">
          {/* Portfolio Dashboard Link */}
          <div className="mx-auto mb-4 max-w-5xl">
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 sm:w-auto"
              onClick={onPortfolioClick}
            >
              <Crown className="h-4 w-4 text-primary" />
              View Portfolio Dashboard
              <span className="ml-1 text-xs text-muted-foreground">
                (Vault, Badges, Holdings)
              </span>
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as AccountTab)}
            className="w-full"
          >
            <TabsList className="mx-auto grid w-full max-w-3xl grid-cols-4">
              <TabsTrigger value="profile" className="gap-1.5">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-1.5">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <div className="mx-auto max-w-2xl">{profileContent}</div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              {analyticsContent}
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              {activityContent}
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              {settingsContent}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default AccountPageTemplate;
