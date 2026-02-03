/**
 * PortfolioPageTemplate - User Portfolio Dashboard Page
 *
 * Pure presentational component for the portfolio/holdings page.
 * All data and callbacks must be passed via props - NO data fetching here.
 *
 * Features:
 * - Header with portfolio icon and settings link
 * - Quick stats row (points, vault, badges, tier)
 * - Tabbed interface (Holdings, DeFi, Social, Vault, Badges)
 * - Loading and disconnected states
 *
 * @module templates/portfolio-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/core/card";
import { Button } from "../components/core/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Wallet,
  Trophy,
  Award,
  Coins,
  Crown,
  Settings,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type PortfolioTab = "holdings" | "defi" | "social" | "vault" | "badges";

export interface PortfolioStats {
  points: number;
  skaiBalance: number;
  badgeCount: number;
  tier: string;
}

export interface PortfolioUser {
  id: string;
  displayName?: string;
  points: number;
  skaiBalance: number;
  tier?: string;
}

export interface PortfolioPageTemplateProps {
  /** Current user data */
  user?: PortfolioUser | null;
  /** Whether user is connected */
  isConnected: boolean;
  /** Whether auth is loading */
  isLoading: boolean;
  /** Current active tab */
  activeTab: PortfolioTab;
  /** Badge count */
  badgeCount: number;
  /** Callback when tab changes */
  onTabChange: (tab: PortfolioTab) => void;
  /** Callback for Account Settings button */
  onAccountSettingsClick: () => void;
  /** Callback for Go Home (when not connected) */
  onGoHome: () => void;
  /** Content for Holdings tab */
  holdingsContent: React.ReactNode;
  /** Content for DeFi tab */
  defiContent: React.ReactNode;
  /** Content for Social tab */
  socialContent: React.ReactNode;
  /** Content for Vault tab */
  vaultContent: React.ReactNode;
  /** Content for Badges tab */
  badgesContent: React.ReactNode;
  /** Format number function */
  formatNumber?: (num: number) => string;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

type ColorVariant = "primary" | "emerald" | "amber" | "purple";

const colorClasses: Record<ColorVariant, string> = {
  primary: "from-primary/20 to-primary/5 text-primary border-primary/20",
  emerald:
    "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-500 border-purple-500/20",
};

/**
 * Quick stat card component
 */
function QuickStatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: ColorVariant;
}) {
  return (
    <Card className={cn("border bg-gradient-to-br", colorClasses[color])}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="truncate text-lg font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Not connected state
 */
function NotConnectedState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to view your portfolio, vault balance, badges, and tier
          progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={onGoHome} variant="outline">
          Go to Home
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Loading state
 */
function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading your portfolio...</p>
      </div>
    </div>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function PortfolioPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto space-y-6 px-4 py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div>
              <Skeleton className="mb-1 h-8 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-3 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const defaultFormatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

export function PortfolioPageTemplate({
  user,
  isConnected,
  isLoading,
  activeTab,
  badgeCount,
  onTabChange,
  onAccountSettingsClick,
  onGoHome,
  holdingsContent,
  defiContent,
  socialContent,
  vaultContent,
  badgesContent,
  formatNumber = defaultFormatNumber,
  className,
}: PortfolioPageTemplateProps) {
  // Not connected state
  if (!isConnected || !user) {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col bg-gradient-to-br from-background to-primary/5",
          className
        )}
      >
        <main className="container mx-auto flex-1 px-4 py-8">
          <NotConnectedState onGoHome={onGoHome} />
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col bg-gradient-to-br from-background to-primary/5",
          className
        )}
      >
        <LoadingState />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-gradient-to-br from-background to-primary/5",
        className
      )}
    >
      <main className="container mx-auto flex-1 space-y-6 px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold md:text-3xl">
                My Portfolio
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your assets, rewards, and progress
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onAccountSettingsClick}
            className="w-fit"
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <QuickStatCard
            icon={Trophy}
            label="SKAI Points"
            value={formatNumber(user.points)}
            color="primary"
          />
          <QuickStatCard
            icon={Coins}
            label="Vault Balance"
            value={`${formatNumber(user.skaiBalance)} SKAI`}
            color="emerald"
          />
          <QuickStatCard
            icon={Award}
            label="Badges Earned"
            value={badgeCount.toString()}
            color="amber"
          />
          <QuickStatCard
            icon={TrendingUp}
            label="Current Tier"
            value={user.tier || "Bronze"}
            color="purple"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange(v as PortfolioTab)}
          className="space-y-4"
        >
          <TabsList className="grid h-12 grid-cols-5">
            <TabsTrigger value="holdings" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Holdings</span>
            </TabsTrigger>
            <TabsTrigger value="defi" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">DeFi</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="vault" className="gap-2">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">Vault</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="holdings">{holdingsContent}</TabsContent>
          <TabsContent value="defi">{defiContent}</TabsContent>
          <TabsContent value="social">{socialContent}</TabsContent>
          <TabsContent value="vault">{vaultContent}</TabsContent>
          <TabsContent value="badges">{badgesContent}</TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default PortfolioPageTemplate;
