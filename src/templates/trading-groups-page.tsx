/**
 * TradingGroupsPageTemplate - Trading Groups Discovery and Management Page
 *
 * Pure presentational component for trading groups UI.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - My Groups tab (groups user is member of)
 * - Discover tab (eligible token-gated groups)
 * - Browse tab (public groups)
 * - Create group button/dialog trigger
 * - Search functionality
 * - Group cards with join/view actions
 * - Loading skeletons
 * - Empty states
 * - Not connected state
 *
 * @module templates/trading-groups-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "../components/core/card";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";
import { Badge } from "../components/core/badge";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";

// ============================================================================
// ICON COMPONENTS (inline SVGs for independence)
// ============================================================================

const Icons = {
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
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
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
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  RefreshCw: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
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
  MessageCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  ),
  Trash2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  ),
  Eye: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Crown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  ),
};

// ============================================================================
// TYPES
// ============================================================================

export interface TradingGroupOwner {
  id: string;
  username?: string;
  avatar_url?: string;
}

export interface TradingGroup {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  access_type: "public" | "private" | "token_gated";
  member_count: number;
  owner?: TradingGroupOwner;
  is_owner?: boolean;
  is_member?: boolean;
  token_symbol?: string;
  min_token_amount?: string;
  created_at?: string;
  // Stats
  show_pnl?: boolean;
  show_win_rate?: boolean;
  show_trades?: boolean;
  show_positions?: boolean;
}

export type TradingGroupsTab = "my-groups" | "discover" | "browse";

export interface TradingGroupsPageTemplateProps {
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Active tab */
  activeTab: TradingGroupsTab;
  /** Tab change handler */
  onTabChange: (tab: TradingGroupsTab) => void;
  /** Search query */
  searchQuery: string;
  /** Search change handler */
  onSearchChange: (query: string) => void;
  /** User's groups */
  myGroups: TradingGroup[];
  /** Eligible token-gated groups */
  eligibleGroups: TradingGroup[];
  /** Public groups */
  publicGroups: TradingGroup[];
  /** Loading states */
  isLoadingMyGroups: boolean;
  isLoadingEligible: boolean;
  isLoadingPublic: boolean;
  /** Which group is being joined (id) */
  isJoiningGroup?: string | null;
  /** Which group is being deleted (id) */
  isDeletingGroup?: string | null;
  /** Callbacks */
  onCreateGroup: () => void;
  onViewGroup: (groupId: string) => void;
  onJoinGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onRefreshMyGroups: () => void;
  onRefreshEligible: () => void;
  onRefreshPublic: () => void;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// SKELETON
// ============================================================================

export function TradingGroupsPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="mb-6 h-10 w-full" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Not connected state
 */
function NotConnectedState() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="py-12 text-center">
        <Icons.Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Trading Groups</h2>
        <p className="mb-6 text-muted-foreground">
          Connect your wallet to view and join trading groups
        </p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState({ message, subMessage }: { message: string; subMessage?: string }) {
  return (
    <div className="py-12 text-center">
      <Icons.Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 font-medium text-foreground">{message}</h3>
      {subMessage && <p className="text-sm text-muted-foreground">{subMessage}</p>}
    </div>
  );
}

/**
 * Group card component
 */
function GroupCard({
  group,
  onView,
  onJoin,
  onDelete,
  isJoining,
  isDeleting,
  showJoinButton = false,
  showDeleteButton = false,
}: {
  group: TradingGroup;
  onView?: () => void;
  onJoin?: () => void;
  onDelete?: () => void;
  isJoining?: boolean;
  isDeleting?: boolean;
  showJoinButton?: boolean;
  showDeleteButton?: boolean;
}) {
  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12">
            {group.avatar_url ? (
              <AvatarImage src={group.avatar_url} alt={group.name} />
            ) : null}
            <AvatarFallback className="bg-primary/20 text-primary">
              {group.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{group.name}</h3>
              {group.is_owner && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Icons.Crown className="h-3 w-3" />
                  Owner
                </Badge>
              )}
              {group.access_type === "token_gated" && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Icons.Lock className="h-3 w-3" />
                  Token Gated
                </Badge>
              )}
              {group.access_type === "public" && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Icons.Globe className="h-3 w-3" />
                  Public
                </Badge>
              )}
            </div>
            {group.description && (
              <p className="truncate text-sm text-muted-foreground">
                {group.description}
              </p>
            )}
            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icons.Users className="h-3 w-3" />
                {group.member_count} members
              </span>
              {group.owner?.username && <span>by @{group.owner.username}</span>}
              {group.token_symbol && group.min_token_amount && (
                <span className="text-amber-500">
                  Min: {group.min_token_amount} {group.token_symbol}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showJoinButton && onJoin && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin();
                }}
                disabled={isJoining}
              >
                {isJoining ? (
                  <Icons.RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  "Join"
                )}
              </Button>
            )}
            {showDeleteButton && onDelete && group.is_owner && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Icons.RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
            {onView && (
              <Button size="sm" variant="ghost" onClick={onView}>
                <Icons.Eye className="mr-1 h-4 w-4" />
                View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TradingGroupsPageTemplate({
  isConnected,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  myGroups,
  eligibleGroups,
  publicGroups,
  isLoadingMyGroups,
  isLoadingEligible,
  isLoadingPublic,
  isJoiningGroup,
  isDeletingGroup,
  onCreateGroup,
  onViewGroup,
  onJoinGroup,
  onDeleteGroup,
  onRefreshMyGroups,
  onRefreshEligible,
  onRefreshPublic,
  className,
}: TradingGroupsPageTemplateProps) {
  // Not connected state
  if (!isConnected) {
    return <NotConnectedState />;
  }

  // Filter groups by search
  const filterGroups = (groups: TradingGroup[]) => {
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase();
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query) ||
        g.owner?.username?.toLowerCase().includes(query)
    );
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );

  return (
    <div className={cn("container mx-auto max-w-4xl px-4 py-8", className)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trading Groups</h1>
          <p className="text-muted-foreground">
            Join trading communities and share alpha
          </p>
        </div>
        <Button onClick={onCreateGroup}>
          <Icons.Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v: string) => onTabChange(v as TradingGroupsTab)}
      >
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="my-groups" className="flex items-center gap-2">
            <Icons.Users className="h-4 w-4" />
            My Groups
            {myGroups.length > 0 && (
              <span className="rounded bg-primary/20 px-1.5 text-xs">
                {myGroups.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Icons.Sparkles className="h-4 w-4" />
            Discover
            {eligibleGroups.length > 0 && (
              <span className="rounded bg-green-500/20 px-1.5 text-xs text-green-400">
                {eligibleGroups.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Icons.Globe className="h-4 w-4" />
            Browse
          </TabsTrigger>
        </TabsList>

        {/* My Groups */}
        <TabsContent value="my-groups" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshMyGroups}
              disabled={isLoadingMyGroups}
            >
              <Icons.RefreshCw
                className={cn("mr-2 h-4 w-4", isLoadingMyGroups && "animate-spin")}
              />
              Refresh
            </Button>
          </div>

          {isLoadingMyGroups ? (
            renderSkeleton()
          ) : filterGroups(myGroups).length === 0 ? (
            <EmptyState
              message={searchQuery ? "No groups found" : "No groups yet"}
              subMessage={
                searchQuery
                  ? "Try a different search"
                  : "Create or join a trading group to get started"
              }
            />
          ) : (
            filterGroups(myGroups).map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onView={() => onViewGroup(group.id)}
                onDelete={() => onDeleteGroup(group.id)}
                showDeleteButton={group.is_owner}
                isDeleting={isDeletingGroup === group.id}
              />
            ))
          )}
        </TabsContent>

        {/* Discover (Eligible groups) */}
        <TabsContent value="discover" className="space-y-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Groups you're eligible to join based on your token holdings
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshEligible}
              disabled={isLoadingEligible}
            >
              <Icons.RefreshCw
                className={cn("mr-2 h-4 w-4", isLoadingEligible && "animate-spin")}
              />
              Refresh
            </Button>
          </div>

          {isLoadingEligible ? (
            renderSkeleton()
          ) : filterGroups(eligibleGroups).length === 0 ? (
            <EmptyState
              message={searchQuery ? "No groups found" : "No eligible groups"}
              subMessage={
                searchQuery
                  ? "Try a different search"
                  : "Buy social tokens to unlock access to exclusive trading groups"
              }
            />
          ) : (
            filterGroups(eligibleGroups).map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onView={() => onViewGroup(group.id)}
                onJoin={() => onJoinGroup(group.id)}
                showJoinButton
                isJoining={isJoiningGroup === group.id}
              />
            ))
          )}
        </TabsContent>

        {/* Browse (Public groups) */}
        <TabsContent value="browse" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshPublic}
              disabled={isLoadingPublic}
            >
              <Icons.RefreshCw
                className={cn("mr-2 h-4 w-4", isLoadingPublic && "animate-spin")}
              />
              Refresh
            </Button>
          </div>

          {isLoadingPublic ? (
            renderSkeleton()
          ) : filterGroups(publicGroups).length === 0 ? (
            <EmptyState
              message={searchQuery ? "No groups found" : "No public groups"}
              subMessage={
                searchQuery
                  ? "Try a different search"
                  : "Be the first to create a public trading group!"
              }
            />
          ) : (
            filterGroups(publicGroups).map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onView={() => onViewGroup(group.id)}
                onJoin={() => onJoinGroup(group.id)}
                showJoinButton={!group.is_member}
                isJoining={isJoiningGroup === group.id}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TradingGroupsPageTemplate;
