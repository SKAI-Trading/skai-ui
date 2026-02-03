/**
 * EarnPageTemplate
 * 
 * Pure presentational template for the earn/rewards page.
 * Includes faucet, lottery, and referral sections.
 * 
 * @example
 * ```tsx
 * import { EarnPageTemplate } from '@skai/ui';
 * 
 * function EarnPage() {
 *   const { faucetStats, user, referralLink } = useEarnData();
 *   return (
 *     <EarnPageTemplate
 *       faucetStats={faucetStats}
 *       referralLink={referralLink}
 *       activeTab={activeTab}
 *       onTabChange={setActiveTab}
 *       renderFaucet={() => <FaucetClaimCard />}
 *       renderLottery={() => <LotterySection />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Button } from "../components/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/core/card";
import { Input } from "../components/core/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";

// ============================================================================
// TYPES
// ============================================================================

export interface FaucetStats {
  /** Total number of faucet claims */
  totalClaims: number;
  /** Total SKAI earned from faucet */
  totalEarned: number;
  /** Current daily claim streak */
  currentStreak: number;
  /** Best streak achieved */
  bestStreak?: number;
  /** Time until next claim is available */
  nextClaimIn?: number;
}

export interface LotteryStats {
  /** Current jackpot amount */
  jackpot: number;
  /** User's total tickets */
  userTickets: number;
  /** Total tickets in current draw */
  totalTickets: number;
  /** Time until next draw */
  nextDrawIn: number;
  /** User's winning history */
  totalWinnings?: number;
}

export interface ReferralStats {
  /** Total number of referrals */
  totalReferrals: number;
  /** Active referrals */
  activeReferrals: number;
  /** Total earnings from referrals */
  totalEarnings: number;
}

export type EarnTab = 'faucet' | 'lottery' | 'referral';

export interface EarnPageProps {
  /** Faucet statistics */
  faucetStats?: FaucetStats;
  /** Lottery statistics */
  lotteryStats?: LotteryStats;
  /** Referral statistics */
  referralStats?: ReferralStats;
  /** User's referral link */
  referralLink?: string;
  /** Currently active tab */
  activeTab?: EarnTab;
  /** Callback when tab changes */
  onTabChange?: (tab: EarnTab) => void;
  /** Vault balance */
  vaultBalance?: number;
  /** Wallet balance */
  walletBalance?: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether user is connected */
  isConnected?: boolean;
  /** Callback when copying referral link */
  onCopyReferralLink?: () => void;
  /** Callback when navigating to referral page */
  onNavigateReferral?: () => void;
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
  
  // ============================================================================
  // RENDER PROPS
  // ============================================================================
  
  /** Render the faucet claim section */
  renderFaucet?: () => React.ReactNode;
  /** Render the lottery section */
  renderLottery?: () => React.ReactNode;
  /** Render the welcome modal */
  renderWelcomeModal?: () => React.ReactNode;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const defaultFaucetStats: FaucetStats = {
  totalClaims: 0,
  totalEarned: 0,
  currentStreak: 0,
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface QuickStatsProps {
  faucetStats: FaucetStats;
  variant?: 'desktop' | 'mobile';
}

function QuickStats({ faucetStats, variant = 'desktop' }: QuickStatsProps) {
  if (variant === 'mobile') {
    return (
      <div className="md:hidden grid grid-cols-3 gap-3 mb-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
        <div className="text-center">
          <p className="text-lg font-bold text-primary">
            {faucetStats.totalEarned.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground">Earned</p>
        </div>
        <div className="text-center border-x border-border/30">
          <p className="text-lg font-bold text-orange-500 flex items-center justify-center gap-1">
            <span>🔥</span>
            {faucetStats.currentStreak}
          </p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-secondary">
            {faucetStats.totalClaims}
          </p>
          <p className="text-xs text-muted-foreground">Rolls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-3">
      <div className="text-center">
        <p className="text-xl font-bold text-primary">
          {faucetStats.totalEarned.toFixed(0)}
        </p>
        <p className="text-xs text-muted-foreground">SKAI Earned</p>
      </div>
      <div className="w-px h-8 bg-border/50" />
      <div className="text-center">
        <p className="text-xl font-bold text-orange-500 flex items-center justify-center gap-1">
          <span>🔥</span>
          {faucetStats.currentStreak}
        </p>
        <p className="text-xs text-muted-foreground">Day Streak</p>
      </div>
    </div>
  );
}

interface ReferralTabContentProps {
  referralLink?: string;
  stats?: ReferralStats;
  onCopy?: () => void;
  onNavigate?: () => void;
  isLoading?: boolean;
}

function ReferralTabContent({ 
  referralLink, 
  stats, 
  onCopy, 
  onNavigate,
  isLoading: _isLoading 
}: ReferralTabContentProps) {
  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            Invite Friends, Earn Rewards
          </CardTitle>
          <CardDescription>
            Share your referral link and earn SKAI when friends trade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Referral Link */}
          <div className="flex gap-2">
            <Input
              value={referralLink || "Connect wallet to get your link"}
              readOnly
              className="bg-background/50"
            />
            <Button
              onClick={onCopy}
              disabled={!referralLink}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              <span className="mr-2">📋</span>
              Copy
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.activeReferrals}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Earned</p>
              </div>
            </div>
          )}

          {/* Full Referral Page Link */}
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={onNavigate}
          >
            View Full Referral Dashboard
            <span>→</span>
          </Button>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <span className="text-3xl mb-2 block">📤</span>
              <h4 className="font-semibold mb-1">1. Share Your Link</h4>
              <p className="text-sm text-muted-foreground">
                Send your unique referral link to friends
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <span className="text-3xl mb-2 block">👋</span>
              <h4 className="font-semibold mb-1">2. Friends Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                They create an account and start trading
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <span className="text-3xl mb-2 block">💰</span>
              <h4 className="font-semibold mb-1">3. Earn Rewards</h4>
              <p className="text-sm text-muted-foreground">
                Get up to 35% of their trading fees
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SKELETON LOADERS
// ============================================================================

function FaucetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

function LotterySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function EarnPageTemplate({
  faucetStats = defaultFaucetStats,
  lotteryStats: _lotteryStats,
  referralStats,
  referralLink,
  activeTab = 'faucet',
  onTabChange,
  vaultBalance: _vaultBalance,
  walletBalance: _walletBalance,
  isLoading = false,
  isConnected: _isConnected = false,
  onCopyReferralLink,
  onNavigateReferral,
  title = "Earn SKAI",
  subtitle = "Faucet • Lottery • Referrals",
  renderFaucet,
  renderLottery,
  renderWelcomeModal,
}: EarnPageProps) {
  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      {/* Welcome Modal */}
      {renderWelcomeModal?.()}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Quick Stats - Desktop */}
        <QuickStats faucetStats={faucetStats} variant="desktop" />
      </div>

      {/* Mobile Stats */}
      <QuickStats faucetStats={faucetStats} variant="mobile" />

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange?.(v as EarnTab)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="faucet" className="gap-2 text-sm md:text-base">
            <span>🎁</span>
            <span>Faucet</span>
          </TabsTrigger>
          <TabsTrigger value="lottery" className="gap-2 text-sm md:text-base">
            <span>🎫</span>
            <span>Lottery</span>
          </TabsTrigger>
          <TabsTrigger value="referral" className="gap-2 text-sm md:text-base">
            <span>👥</span>
            <span>Referral</span>
          </TabsTrigger>
        </TabsList>

        {/* Faucet Tab */}
        <TabsContent value="faucet" className="space-y-6">
          {isLoading ? (
            <FaucetSkeleton />
          ) : renderFaucet ? (
            renderFaucet()
          ) : (
            <FaucetSkeleton />
          )}
        </TabsContent>

        {/* Lottery Tab */}
        <TabsContent value="lottery" className="space-y-6">
          {isLoading ? (
            <LotterySkeleton />
          ) : renderLottery ? (
            renderLottery()
          ) : (
            <LotterySkeleton />
          )}
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral" className="space-y-6">
          <ReferralTabContent
            referralLink={referralLink}
            stats={referralStats}
            onCopy={onCopyReferralLink}
            onNavigate={onNavigateReferral}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EarnPageTemplate;
