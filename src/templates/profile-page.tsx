/**
 * Profile Page Template
 *
 * A complete public profile page matching the SKAI design system.
 * Use this as the presentational layer for user profiles.
 *
 * RULE: This template receives ALL data via props.
 *       It NEVER fetches data, makes API calls, or handles routing directly.
 *       Business logic stays in the page component (SKAI-Trading).
 *
 * @example
 * ```tsx
 * import { ProfilePageTemplate } from '@skai/ui/templates';
 *
 * function UserProfile() {
 *   const data = useProfileData(username);
 *   return (
 *     <ProfilePageTemplate
 *       {...data}
 *       onFollow={handleFollow}
 *       onBuyToken={handleBuy}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { cn } from "../lib/utils";

// Components from skai-ui
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";
import { TierBadge } from "../components/trading/tier-badge";

// Types
import type {
  PageTemplateBaseProps,
  UserIdentity,
  SocialLinks,
  TokenDisplay,
  ProfileStats,
  BadgeDisplay,
  TradingGroupDisplay,
  StreamStatus,
  PrivacySettings,
} from "./base-types";

// =============================================================================
// ICON COMPONENTS (inline SVGs for independence from lucide)
// =============================================================================

const Icons = {
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UsersRound: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 21a8 8 0 0 0-16 0" />
      <circle cx="10" cy="8" r="5" />
      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
    </svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Copy: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
  Lock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  TrendingDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  ),
  Coins: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  ),
  BarChart3: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  Activity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Wallet: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  Radio: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
      <path d="M7.76 16.24a6 6 0 0 1 0-8.48" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.48" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  Twitter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Send: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="22" x2="11" y1="2" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Share: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  ),
  Discord: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

// =============================================================================
// PROFILE PAGE TEMPLATE PROPS
// =============================================================================

export interface ProfilePageTemplateProps extends PageTemplateBaseProps {
  // === Profile Data ===
  /** User identity data */
  user: UserIdentity;
  /** Social links */
  socialLinks?: SocialLinks;
  /** User bio */
  bio?: string;
  /** Featured badges */
  featuredBadges?: BadgeDisplay[];
  /** ETH balance */
  ethBalance?: number;
  /** Stream status */
  streamStatus?: StreamStatus;
  /** Privacy settings */
  privacy?: PrivacySettings;

  // === Social Token ===
  /** Social token data */
  token?: TokenDisplay;

  // === Stats ===
  /** Profile stats */
  stats?: ProfileStats;
  /** Follower count */
  followerCount?: number;
  /** Following count */
  followingCount?: number;

  // === Trading Groups ===
  /** Trading groups the user belongs to */
  tradingGroups?: TradingGroupDisplay[];

  // === Relationship State ===
  /** Whether current user is following this profile */
  isFollowing?: boolean;
  /** Whether this is the current user's own profile */
  isOwnProfile?: boolean;

  // === UI State ===
  /** Whether address was copied */
  isCopied?: boolean;
  /** Active tab */
  activeTab?: string;
  /** Whether message button is loading */
  isMessageLoading?: boolean;

  // === Callbacks ===
  /** Copy wallet address */
  onCopyAddress?: () => void;
  /** Toggle follow */
  onFollowToggle?: () => void;
  /** Open buy token modal */
  onBuyToken?: () => void;
  /** Open sell token modal */
  onSellToken?: () => void;
  /** Navigate to edit profile */
  onEditProfile?: () => void;
  /** Start message conversation */
  onMessage?: () => void;
  /** Copy trade */
  onCopyTrade?: () => void;
  /** Share profile */
  onShare?: () => void;
  /** Navigate to token page */
  onTokenClick?: () => void;
  /** Navigate to stream */
  onStreamClick?: () => void;
  /** Change active tab */
  onTabChange?: (tab: string) => void;
  /** Open followers modal */
  onFollowersClick?: () => void;
  /** Open following modal */
  onFollowingClick?: () => void;
  /** Open holders modal */
  onHoldersClick?: () => void;
  /** Navigate to trading group */
  onGroupClick?: (groupId: string) => void;

  // === Slots for Custom Content ===
  /** Custom content for Overview tab */
  overviewContent?: React.ReactNode;
  /** Custom content for Activity tab (own profile only) */
  activityContent?: React.ReactNode;
  /** Custom content for Trades tab */
  tradesContent?: React.ReactNode;
  /** Custom content for Holdings tab */
  holdingsContent?: React.ReactNode;
  /** Custom badges display component */
  badgesSlot?: React.ReactNode;
  /** Custom share button component */
  shareButtonSlot?: React.ReactNode;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatNumber(num: number | undefined | null): string {
  if (num == null) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatCurrency(num: number | undefined | null): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num ?? 0);
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

const ProfilePageSkeleton: React.FC = () => (
  <div className="container mx-auto max-w-5xl px-4 py-6">
    {/* Banner skeleton */}
    <Skeleton className="mb-6 h-48 w-full rounded-xl" />

    {/* Profile header skeleton */}
    <div className="relative -mt-16 mb-8">
      <div className="flex items-end gap-4 px-4">
        <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
        <div className="flex-1 pb-4">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>

    {/* Stats skeleton */}
    <div className="mb-8 grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  </div>
);

// =============================================================================
// NOT FOUND STATE
// =============================================================================

interface ProfileNotFoundProps {
  username?: string;
  onBack?: () => void;
  onExplore?: () => void;
}

const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({
  username,
  onBack,
  onExplore,
}) => (
  <div className="container mx-auto max-w-4xl px-4 py-12">
    <div className="mx-auto max-w-2xl rounded-xl border bg-card p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Icons.User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-3 text-2xl font-bold">Profile Not Created</h1>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">@{username}</span> hasn't
          created their social profile yet.
        </p>
      </div>

      {/* What they're missing */}
      <div className="mb-8">
        <h2 className="mb-4 text-center text-lg font-semibold">
          What Social Profiles Unlock
        </h2>
        <div className="grid gap-3">
          {[
            {
              icon: Icons.Coins,
              color: "primary",
              title: "Social Token",
              description: "Launch your own token that fans can buy and trade.",
            },
            {
              icon: Icons.TrendingUp,
              color: "green-500",
              title: "Copy Trading",
              description: "Let others copy your trades and earn fees.",
            },
            {
              icon: Icons.Users,
              color: "blue-500",
              title: "Trading Groups",
              description: "Create or join exclusive trading communities.",
            },
            {
              icon: Icons.MessageSquare,
              color: "purple-500",
              title: "Direct Messaging",
              description: "Encrypted messaging with followers.",
            },
            {
              icon: Icons.BarChart3,
              color: "orange-500",
              title: "Public Portfolio",
              description: "Share your performance with your community.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <div
                className={`h-10 w-10 rounded-full bg-${item.color}/10 flex flex-shrink-0 items-center justify-center`}
              >
                <item.icon className={`h-5 w-5 text-${item.color}`} />
              </div>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        )}
        {onExplore && <Button onClick={onExplore}>Explore SKAI</Button>}
      </div>
    </div>
  </div>
);

// =============================================================================
// SOCIAL ICON BUTTON
// =============================================================================

interface SocialIconButtonProps {
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  title?: string;
  colorClass?: string;
}

const SocialIconButton: React.FC<SocialIconButtonProps> = ({
  href,
  icon: Icon,
  label,
  title,
  colorClass = "bg-muted/50 hover:bg-muted",
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn("h-9 w-9 rounded-full transition-all", colorClass)}
    asChild
  >
    <a href={href} target="_blank" rel="noopener noreferrer" title={title}>
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </a>
  </Button>
);

// =============================================================================
// STAT CARD
// =============================================================================

interface StatCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColorClass: string;
  value: string;
  label: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColorClass,
  value,
  label,
  onClick,
}) => (
  <Card
    className={cn(
      "group transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
      onClick && "cursor-pointer"
    )}
    onClick={onClick}
  >
    <CardContent className="p-4 text-center">
      <div
        className={cn(
          "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110",
          iconColorClass
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

// =============================================================================
// PROFILE PAGE TEMPLATE
// =============================================================================

const ProfilePageTemplate: React.FC<ProfilePageTemplateProps> = ({
  // Loading & Error
  isLoading = false,
  // error - available for future use
  className,

  // Profile Data
  user,
  socialLinks,
  bio,
  // featuredBadges - passed via badgesSlot
  ethBalance = 0,
  streamStatus,
  privacy = {},

  // Token
  token,

  // Stats
  stats,
  followerCount = 0,
  followingCount = 0,

  // Trading Groups
  tradingGroups = [],

  // Relationship
  isFollowing = false,
  isOwnProfile = false,

  // UI State
  isCopied = false,
  activeTab = "overview",
  isMessageLoading = false,

  // Callbacks
  onCopyAddress,
  onFollowToggle,
  onBuyToken,
  onSellToken,
  onEditProfile,
  onMessage,
  onCopyTrade,
  onShare,
  onTokenClick,
  onStreamClick,
  onTabChange,
  onFollowersClick,
  onFollowingClick,
  onHoldersClick,
  onGroupClick,

  // Slots
  overviewContent,
  activityContent,
  tradesContent,
  holdingsContent,
  badgesSlot,
  shareButtonSlot,
}) => {
  // Loading state
  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  // Not found state
  if (!user) {
    return <ProfileNotFound username="unknown" />;
  }

  return (
    <div className={cn("container mx-auto max-w-5xl px-4 py-6", className)}>
      {/* Profile Header - Modern Card Design */}
      <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-br from-card via-card to-muted/30">
        {/* Decorative Header Accent */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Section - Avatar & Identity */}
            <div className="flex flex-col items-center gap-4 lg:items-start">
              {/* Avatar with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 scale-110 rounded-full bg-primary/20 blur-xl" />
                <Avatar className="relative h-28 w-28 border-4 border-primary/30 shadow-2xl ring-2 ring-background">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-3xl">
                    {user.displayName?.[0]?.toUpperCase() ||
                      user.username?.[0]?.toUpperCase() ||
                      "?"}
                  </AvatarFallback>
                </Avatar>
                {streamStatus?.isLive && (
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 animate-pulse items-center justify-center rounded-full border-2 border-background bg-red-500">
                    <Icons.Radio className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Social Icons - Mobile */}
              <div className="flex gap-2 lg:hidden">
                {socialLinks?.twitter && (
                  <SocialIconButton
                    href={`https://twitter.com/${socialLinks.twitter}`}
                    icon={Icons.Twitter}
                    label="Twitter"
                    title={`@${socialLinks.twitter}`}
                  />
                )}
                {socialLinks?.discord && (
                  <SocialIconButton
                    href={`https://discord.com/users/${socialLinks.discordUserId || socialLinks.discord}`}
                    icon={Icons.Discord}
                    label="Discord"
                    title={`@${socialLinks.discord}`}
                    colorClass="bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#5865F2]"
                  />
                )}
                {socialLinks?.telegram && (
                  <SocialIconButton
                    href={`https://t.me/${socialLinks.telegram}`}
                    icon={Icons.Send}
                    label="Telegram"
                    title={`@${socialLinks.telegram}`}
                  />
                )}
                {socialLinks?.website && (
                  <SocialIconButton
                    href={socialLinks.website}
                    icon={Icons.Globe}
                    label="Website"
                    title={socialLinks.website}
                  />
                )}
              </div>
            </div>

            {/* Center Section - User Info */}
            <div className="flex-1 text-center lg:text-left">
              {/* Name Row with Badges */}
              <div className="mb-1 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user.displayName || user.username}
                </h1>
                {token && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer border-0 bg-primary text-primary-foreground transition-all hover:bg-primary/90"
                    onClick={onTokenClick}
                  >
                    <Icons.Coins className="mr-1 h-3 w-3" /> ${token.symbol}
                  </Badge>
                )}
                {user.isVerified && (
                  <Badge className="border border-blue-500/30 bg-blue-500/20 text-blue-400">
                    <Icons.Check className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
                {user.tier && (
                  <TierBadge tier={user.tier} variant="compact" size="sm" />
                )}
                {streamStatus?.isLive && (
                  <Badge
                    className="animate-pulse cursor-pointer border border-red-500/30 bg-red-500/20 text-red-400"
                    onClick={onStreamClick}
                  >
                    <Icons.Radio className="mr-1 h-3 w-3" /> LIVE
                  </Badge>
                )}
              </div>

              {/* Username */}
              <p className="mb-3 text-foreground/70">@{user.username}</p>

              {/* Wallet & Balance Row */}
              <div className="mb-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {(isOwnProfile || privacy.showWalletAddress !== false) && (
                  <button
                    onClick={onCopyAddress}
                    className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 font-mono text-sm transition-colors hover:bg-muted"
                  >
                    {shortenAddress(user.walletAddress)}
                    {isCopied ? (
                      <Icons.Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Icons.Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                    {isOwnProfile && privacy.showWalletAddress === false && (
                      <Icons.Lock className="ml-1 h-3 w-3 text-yellow-500" />
                    )}
                  </button>
                )}

                {(isOwnProfile || privacy.showWalletBalance !== false) && (
                  <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-sm">
                    <Icons.Wallet className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="font-semibold text-yellow-500">
                      {ethBalance.toFixed(4)}
                    </span>
                    <span className="text-yellow-500/70">ETH</span>
                    {isOwnProfile && privacy.showWalletBalance === false && (
                      <Icons.Lock className="ml-1 h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Bio */}
              {bio && (
                <p className="mb-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {bio}
                </p>
              )}

              {/* Featured Badges */}
              {badgesSlot}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {token && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700"
                      onClick={onBuyToken}
                    >
                      <Icons.TrendingUp className="mr-1.5 h-4 w-4" /> Buy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      onClick={onSellToken}
                    >
                      <Icons.TrendingDown className="mr-1.5 h-4 w-4" /> Sell
                    </Button>
                  </>
                )}

                {isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={onEditProfile}>
                    <Icons.Settings className="mr-1.5 h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={onFollowToggle}
                    >
                      <Icons.Users className="mr-1.5 h-4 w-4" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMessageLoading}
                      onClick={onMessage}
                    >
                      <Icons.MessageSquare className="mr-1.5 h-4 w-4" /> Message
                    </Button>
                    {privacy.allowCopyTrading && (
                      <Button variant="secondary" size="sm" onClick={onCopyTrade}>
                        <Icons.Copy className="mr-1.5 h-4 w-4" /> Copy Trade
                      </Button>
                    )}
                  </>
                )}

                {shareButtonSlot || (
                  <Button variant="ghost" size="sm" onClick={onShare}>
                    <Icons.Share className="mr-1.5 h-4 w-4" /> Share
                  </Button>
                )}
              </div>
            </div>

            {/* Right Section - Token Market Cap & Social Links */}
            <div className="flex flex-col items-center gap-4 lg:items-end">
              {/* Market Cap Card */}
              {token && token.marketCap !== undefined && (
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 to-primary/10 opacity-50 blur-xl transition-opacity group-hover:opacity-70" />
                  <div className="relative min-w-[180px] rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-5 text-center">
                    <p className="mb-1 text-xs uppercase tracking-wider text-primary/70">
                      Market Cap
                    </p>
                    <p className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold text-transparent">
                      {formatCurrency(token.marketCap)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ${token.symbol}
                    </p>
                  </div>
                </div>
              )}

              {/* Social Links - Desktop */}
              <div className="hidden gap-2 lg:flex">
                {socialLinks?.twitter && (
                  <SocialIconButton
                    href={`https://twitter.com/${socialLinks.twitter}`}
                    icon={Icons.Twitter}
                    label="Twitter"
                    title={`@${socialLinks.twitter}`}
                    colorClass="bg-muted/50 hover:bg-primary/20 hover:text-primary"
                  />
                )}
                {socialLinks?.discord && (
                  <SocialIconButton
                    href={`https://discord.com/users/${socialLinks.discordUserId || socialLinks.discord}`}
                    icon={Icons.Discord}
                    label="Discord"
                    title={`@${socialLinks.discord}`}
                    colorClass="bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2]"
                  />
                )}
                {socialLinks?.telegram && (
                  <SocialIconButton
                    href={`https://t.me/${socialLinks.telegram}`}
                    icon={Icons.Send}
                    label="Telegram"
                    title={`@${socialLinks.telegram}`}
                    colorClass="bg-muted/50 hover:bg-[#0088cc]/20 hover:text-[#0088cc]"
                  />
                )}
                {socialLinks?.website && (
                  <SocialIconButton
                    href={socialLinks.website}
                    icon={Icons.Globe}
                    label="Website"
                    title={socialLinks.website}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div
        className={cn(
          "mb-6 grid grid-cols-2 gap-3",
          token ? "md:grid-cols-5" : "md:grid-cols-4"
        )}
      >
        <StatCard
          icon={Icons.Users}
          iconColorClass="bg-blue-500/10 text-blue-500"
          value={formatNumber(followerCount)}
          label="Followers"
          onClick={onFollowersClick}
        />

        {token && (
          <StatCard
            icon={Icons.Coins}
            iconColorClass="bg-primary/10 text-primary"
            value={formatNumber(token.holderCount)}
            label="Holders"
            onClick={onHoldersClick}
          />
        )}

        <StatCard
          icon={Icons.UsersRound}
          iconColorClass="bg-purple-500/10 text-purple-500"
          value={formatNumber(followingCount)}
          label="Following"
          onClick={onFollowingClick}
        />

        <StatCard
          icon={Icons.BarChart3}
          iconColorClass="bg-yellow-500/10 text-yellow-500"
          value={stats?.winRate ? `${(stats.winRate * 100).toFixed(0)}%` : "-"}
          label="Win Rate"
        />

        <StatCard
          icon={(stats?.totalPnl || 0) >= 0 ? Icons.TrendingUp : Icons.TrendingDown}
          iconColorClass={
            (stats?.totalPnl || 0) >= 0
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }
          value={
            privacy.showPnl !== false ? formatCurrency(stats?.totalPnl || 0) : "***"
          }
          label="Total P&L"
        />
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">
            <Icons.BarChart3 className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="activity" className="flex-1">
              <Icons.Activity className="mr-2 h-4 w-4" /> Friends Activity
            </TabsTrigger>
          )}
          <TabsTrigger value="trades" className="flex-1">
            <Icons.Activity className="mr-2 h-4 w-4" /> Trades
            {!privacy.showTrades && <Icons.Lock className="ml-1 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="holdings" className="flex-1">
            <Icons.Coins className="mr-2 h-4 w-4" /> Holdings
            {!privacy.showHoldings && <Icons.Lock className="ml-1 h-3 w-3" />}
          </TabsTrigger>
          <TabsTrigger value="followers" className="flex-1">
            <Icons.Users className="mr-2 h-4 w-4" /> Followers
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex-1">
            <Icons.UsersRound className="mr-2 h-4 w-4" /> Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {overviewContent || (
            <Card>
              <CardHeader>
                <CardTitle>Trading Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(stats.totalVolume)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average Trade Size
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(stats.averageTradeSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best Trade</p>
                      <p className="text-lg font-semibold text-green-500">
                        {privacy.showPnl !== false
                          ? formatCurrency(stats.bestTradePnl)
                          : "***"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Worst Trade</p>
                      <p className="text-lg font-semibold text-red-500">
                        {privacy.showPnl !== false
                          ? formatCurrency(stats.worstTradePnl)
                          : "***"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No trading data available</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="activity" className="mt-6">
            {activityContent || (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Friends activity will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="trades" className="mt-6">
          {isOwnProfile || privacy.showTrades ? (
            tradesContent || (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Recent Trades
                    {isOwnProfile && !privacy.showTrades && (
                      <Badge className="border-yellow-500/50 bg-yellow-500/20 text-yellow-500">
                        <Icons.Lock className="mr-1 h-3 w-3" />
                        Only you can see this
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Trade history will appear here
                  </p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Icons.Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Trades are Private</h3>
                <p className="text-muted-foreground">
                  This user has chosen to keep their trade history private.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="holdings" className="mt-6">
          {isOwnProfile || privacy.showHoldings ? (
            holdingsContent || (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Token Holdings
                    {isOwnProfile && !privacy.showHoldings && (
                      <Badge className="border-yellow-500/50 bg-yellow-500/20 text-yellow-500">
                        <Icons.Lock className="mr-1 h-3 w-3" />
                        Only you can see this
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Holdings will appear here</p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Icons.Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Holdings are Private</h3>
                <p className="text-muted-foreground">
                  This user has chosen to keep their holdings private.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="followers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Followers ({followerCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {followerCount > 0 ? (
                <div className="py-4 text-center">
                  <Button
                    variant="outline"
                    onClick={onFollowersClick}
                    className="gap-2"
                  >
                    <Icons.Users className="h-4 w-4" />
                    View All {followerCount} Followers
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to see the full list
                  </p>
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  No followers yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Groups ({tradingGroups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tradingGroups.length > 0 ? (
                <div className="space-y-3">
                  {tradingGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                      onClick={() => onGroupClick?.(group.id)}
                    >
                      <div className="flex items-center gap-3">
                        {group.avatarUrl ? (
                          <img
                            src={group.avatarUrl}
                            alt={group.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                            <Icons.UsersRound className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {group.memberCount} member
                            {group.memberCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs capitalize text-muted-foreground">
                        {group.myRole || "member"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-muted-foreground">
                  {isOwnProfile
                    ? "You haven't joined any trading groups yet."
                    : "This user hasn't joined any public trading groups."}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

ProfilePageTemplate.displayName = "ProfilePageTemplate";

export { ProfilePageTemplate, ProfileNotFound, ProfilePageSkeleton };
