/**
 * ReferralPageTemplate
 * 
 * Pure presentational template for the referral program page.
 * Displays referral link, stats, commission tiers, and referral history.
 * 
 * @example
 * ```tsx
 * import { ReferralPageTemplate } from '@skai/ui';
 * 
 * function ReferralPage() {
 *   const { user, referrals, stats } = useReferralData();
 *   return (
 *     <ReferralPageTemplate
 *       isConnected={!!user}
 *       referralCode={user?.referralCode}
 *       referralLink={`https://skai.trade/ref/${user?.referralCode}`}
 *       stats={stats}
 *       referrals={referrals}
 *       onCopyLink={() => navigator.clipboard.writeText(referralLink)}
 *       onShare={(platform) => handleShare(platform)}
 *     />
 *   );
 * }
 * ```
 */

import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/core/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/overlays/dialog";
import { Input } from "../components/core/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/data-display/table";
import { Skeleton } from "../components/feedback/skeleton";

// ============================================================================
// TYPES
// ============================================================================

export interface CommissionTier {
  /** Tier level number */
  level: number;
  /** Referral count range (e.g., "1-10") */
  referrals: string;
  /** Commission percentage (e.g., "20%") */
  commission: string;
  /** Trading fee for this tier (e.g., "0.05%") */
  tradingFee?: string;
}

export interface ReferralRecord {
  /** Unique identifier */
  id: string;
  /** Referee's wallet address */
  refereeWallet: string;
  /** Referral status */
  status: 'pending' | 'completed' | 'expired';
  /** When the referral was created */
  createdAt: Date;
  /** When referral was completed (if applicable) */
  completedAt?: Date;
  /** Commission earned from this referral */
  commissionEarned?: number;
}

export interface ReferralStats {
  /** Total number of referrals */
  totalReferrals: number;
  /** Number of active/completed referrals */
  activeReferrals: number;
  /** Total earnings from referrals */
  totalEarnings: number;
  /** Current tier level */
  currentTier?: number;
}

export type SharePlatform = 'twitter' | 'telegram' | 'discord' | 'native';

export interface ReferralPageProps {
  /** Whether user wallet is connected */
  isConnected?: boolean;
  /** User's referral code */
  referralCode?: string;
  /** Full referral link */
  referralLink?: string;
  /** Referral statistics */
  stats?: ReferralStats;
  /** List of referral records */
  referrals?: ReferralRecord[];
  /** Commission tier structure */
  commissionTiers?: CommissionTier[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Currency symbol for earnings (default: USDC) */
  currencySymbol?: string;
  /** Callback when copying referral link */
  onCopyLink?: () => void;
  /** Callback when sharing to platform */
  onShare?: (platform: SharePlatform) => void;
  /** Custom wallet address formatter */
  formatAddress?: (address: string) => string;
  /** Custom date formatter */
  formatDate?: (date: Date) => string;
  /** Page title */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const defaultTiers: CommissionTier[] = [
  { level: 1, referrals: "1-10", commission: "20%", tradingFee: "0.05%" },
  { level: 2, referrals: "11-50", commission: "25%", tradingFee: "0.04%" },
  { level: 3, referrals: "51-100", commission: "30%", tradingFee: "0.03%" },
  { level: 4, referrals: "101+", commission: "35%", tradingFee: "0.02%" },
];

const defaultStats: ReferralStats = {
  totalReferrals: 0,
  activeReferrals: 0,
  totalEarnings: 0,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function defaultFormatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function defaultFormatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeVariant(status: ReferralRecord['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'completed': return 'default';
    case 'pending': return 'secondary';
    case 'expired': return 'destructive';
    default: return 'outline';
  }
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface HowItWorksDialogProps {
  tiers: CommissionTier[];
}

function HowItWorksDialog({ tiers }: HowItWorksDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span>❓</span>
          How it works
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Commission Tiers</DialogTitle>
          <DialogDescription>
            Unlock higher rewards as you refer more users
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3 text-center">
          {tiers.map((tier) => (
            <div
              key={tier.level}
              className="p-3 rounded-lg bg-accent/30 border border-border/50"
            >
              <div className="text-xs text-muted-foreground mb-1">
                Tier {tier.level}
              </div>
              <div className="text-lg font-bold text-secondary">
                {tier.commission}
              </div>
              <div className="text-xs text-muted-foreground">
                {tier.referrals} referrals
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-accent/20 rounded-lg">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Earn a percentage of your referrals' trading fees</li>
            <li>• Higher tiers unlock better commission rates and lower fees for you</li>
            <li>• Referrals must be active traders (minimum $100 volume/month)</li>
            <li>• Earnings are paid out weekly in USDC</li>
            <li>• No limits on how much you can earn</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface StatsCardsProps {
  stats: ReferralStats;
  currencySymbol: string;
  isLoading?: boolean;
}

function StatsCards({ stats, currencySymbol, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals,
      icon: "👥",
    },
    {
      label: "Active Referrals",
      value: stats.activeReferrals,
      icon: "✅",
    },
    {
      label: "Total Earnings",
      value: `${stats.totalEarnings.toFixed(2)} ${currencySymbol}`,
      icon: "💰",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{card.value}</p>
                )}
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface ReferralLinkCardProps {
  referralLink: string;
  onCopyLink?: () => void;
  onShare?: (platform: SharePlatform) => void;
}

function ReferralLinkCard({ referralLink, onCopyLink, onShare }: ReferralLinkCardProps) {
  return (
    <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🎁</span>
          Your Referral Code
        </CardTitle>
        <CardDescription>
          Share your code and earn rewards when friends trade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Link input and copy */}
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="bg-background/50 border-white/10"
          />
          <Button
            onClick={onCopyLink}
            className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-black"
          >
            <span className="mr-2">📋</span>
            Copy
          </Button>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => onShare?.('native')}
          >
            <span>📤</span>
            Share
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare?.('twitter')}
            title="Share on Twitter"
          >
            <span>𝕏</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare?.('telegram')}
            title="Share on Telegram"
          >
            <span>✈️</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ReferralsTableProps {
  referrals: ReferralRecord[];
  isLoading?: boolean;
  formatAddress: (address: string) => string;
  formatDate: (date: Date) => string;
  currencySymbol: string;
}

function ReferralsTable({ 
  referrals, 
  isLoading, 
  formatAddress, 
  formatDate,
  currencySymbol 
}: ReferralsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <span className="text-4xl block mb-4">👥</span>
        <p>No referrals yet. Share your link to get started!</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="font-mono">
                {formatAddress(referral.refereeWallet)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(referral.status)}>
                  {referral.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(referral.createdAt)}</TableCell>
              <TableCell className="text-right">
                {referral.commissionEarned !== undefined
                  ? `${referral.commissionEarned.toFixed(2)} ${currencySymbol}`
                  : '-'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================================================
// NOT CONNECTED STATE
// ============================================================================

function NotConnectedState() {
  return (
    <Card className="mb-6">
      <CardContent className="py-12 text-center">
        <span className="text-5xl block mb-4">👥</span>
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Connect your wallet to access your referral dashboard
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function ReferralPageTemplate({
  isConnected = false,
  referralCode: _referralCode,
  referralLink = "",
  stats = defaultStats,
  referrals = [],
  commissionTiers = defaultTiers,
  isLoading = false,
  currencySymbol = "USDC",
  onCopyLink,
  onShare,
  formatAddress = defaultFormatAddress,
  formatDate = defaultFormatDate,
  title = "Referral Program",
  subtitle = "Earn up to 35% commission on your referrals' fees",
}: ReferralPageProps) {
  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <HowItWorksDialog tiers={commissionTiers} />
        </div>
      </div>

      {/* Not Connected State */}
      {!isConnected && <NotConnectedState />}

      {/* Connected State */}
      {isConnected && (
        <div className="space-y-6">
          {/* Referral Link Card */}
          <ReferralLinkCard
            referralLink={referralLink}
            onCopyLink={onCopyLink}
            onShare={onShare}
          />

          {/* Stats Cards */}
          <StatsCards 
            stats={stats} 
            currencySymbol={currencySymbol}
            isLoading={isLoading}
          />

          {/* Referrals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                Track your referrals and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralsTable
                referrals={referrals}
                isLoading={isLoading}
                formatAddress={formatAddress}
                formatDate={formatDate}
                currencySymbol={currencySymbol}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

export default ReferralPageTemplate;
