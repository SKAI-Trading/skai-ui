/**
 * AdminPageTemplate
 * 
 * Pure presentational template for the admin panel.
 * This is a highly complex page with many tabs, so it uses render props
 * for all tab content sections.
 * 
 * @example
 * ```tsx
 * import { AdminPageTemplate } from '@skai/ui';
 * 
 * function AdminPanel() {
 *   const { isAdmin, permissions, activeTab } = useAdmin();
 *   return (
 *     <AdminPageTemplate
 *       isAdmin={isAdmin}
 *       activeTab={activeTab}
 *       onTabChange={setActiveTab}
 *       renderDashboard={() => <AdminDashboard />}
 *       renderUserManagement={() => <AdminUserManagement />}
 *       // ... other render props for each tab
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";
import { ScrollArea } from "../components/layout/scroll-area";
import { Skeleton } from "../components/feedback/skeleton";

// ============================================================================
// TYPES
// ============================================================================

export type AdminTabCategory = 
  | 'overview' 
  | 'users' 
  | 'engagement' 
  | 'finance' 
  | 'gaming' 
  | 'rewards' 
  | 'platform' 
  | 'security' 
  | 'system';

export interface AdminTab {
  /** Tab identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon emoji */
  icon: string;
  /** Category for grouping */
  category: AdminTabCategory;
  /** Whether user has permission to view */
  hasPermission?: boolean;
  /** Badge content (e.g., count) */
  badge?: string | number;
}

export interface AdminPermissions {
  /** Can manage users */
  canManageUsers?: boolean;
  /** Can manage finances */
  canManageFinance?: boolean;
  /** Can manage system settings */
  canManageSystem?: boolean;
  /** Can view analytics */
  canViewAnalytics?: boolean;
  /** Can manage security */
  canManageSecurity?: boolean;
  /** Can manage gaming */
  canManageGaming?: boolean;
  /** Is super admin */
  isSuperAdmin?: boolean;
}

export interface AdminSystemStatus {
  /** Service name */
  name: string;
  /** Service status */
  status: 'online' | 'offline' | 'degraded' | 'loading';
  /** Uptime percentage */
  uptime?: number;
  /** Version info */
  version?: string;
  /** Last check time */
  lastChecked?: Date;
  /** Error message if any */
  error?: string;
}

export interface AdminPageProps {
  /** Whether user is admin */
  isAdmin?: boolean;
  /** Whether user is super admin */
  isSuperAdmin?: boolean;
  /** Admin permissions */
  permissions?: AdminPermissions;
  /** Currently active tab */
  activeTab?: string;
  /** Callback when tab changes */
  onTabChange?: (tab: string) => void;
  /** Available tabs configuration */
  tabs?: AdminTab[];
  /** Whether loading admin status */
  isLoading?: boolean;
  /** System status indicators */
  systemStatus?: AdminSystemStatus[];
  /** Admin's wallet address */
  adminAddress?: string;
  /** Admin's username */
  adminUsername?: string;
  /** Whether rate limited */
  isRateLimited?: boolean;
  /** Rate limit blocked until */
  blockedUntil?: Date;
  /** Search query for sidebar */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  
  // ============================================================================
  // RENDER PROPS FOR TAB CONTENT
  // Each tab section is rendered via a render prop so the consumer
  // can inject the actual admin components
  // ============================================================================
  
  // Overview tabs
  renderDashboard?: () => React.ReactNode;
  renderPerformance?: () => React.ReactNode;
  renderAnalytics?: () => React.ReactNode;
  
  // Users tabs
  renderUserManagement?: () => React.ReactNode;
  renderBadges?: () => React.ReactNode;
  renderEarlyAccess?: () => React.ReactNode;
  renderDocsAccess?: () => React.ReactNode;
  renderPointsHistory?: () => React.ReactNode;
  renderPointsBoosters?: () => React.ReactNode;
  renderReferrals?: () => React.ReactNode;
  renderSupport?: () => React.ReactNode;
  renderBugTracker?: () => React.ReactNode;
  
  // Engagement tabs
  renderAnnouncements?: () => React.ReactNode;
  renderPopups?: () => React.ReactNode;
  renderQuests?: () => React.ReactNode;
  renderPopupAnalytics?: () => React.ReactNode;
  renderABTesting?: () => React.ReactNode;
  renderTargeting?: () => React.ReactNode;
  renderScheduling?: () => React.ReactNode;
  renderPushNotifications?: () => React.ReactNode;
  
  // Finance tabs
  renderAllFees?: () => React.ReactNode;
  renderEnhancedFees?: () => React.ReactNode;
  renderTreasury?: () => React.ReactNode;
  renderTokenomics?: () => React.ReactNode;
  
  // Gaming tabs
  renderGaming?: () => React.ReactNode;
  renderPoker?: () => React.ReactNode;
  renderJackpot?: () => React.ReactNode;
  
  // Rewards tabs
  renderLottery?: () => React.ReactNode;
  renderFaucet?: () => React.ReactNode;
  
  // Platform tabs
  renderBridge?: () => React.ReactNode;
  renderGovernance?: () => React.ReactNode;
  renderFeatureFlags?: () => React.ReactNode;
  renderSocialTokens?: () => React.ReactNode;
  
  // Security tabs
  renderRateLimits?: () => React.ReactNode;
  renderGeoRestrictions?: () => React.ReactNode;
  renderAdminManagement?: () => React.ReactNode;
  renderRoles?: () => React.ReactNode;
  renderAuditLog?: () => React.ReactNode;
  renderSecurityAlerts?: () => React.ReactNode;
  renderSwapControls?: () => React.ReactNode;
  
  // System tabs
  renderAIAgents?: () => React.ReactNode;
  renderAICosts?: () => React.ReactNode;
  renderAPIs?: () => React.ReactNode;
  renderDatabase?: () => React.ReactNode;
  renderSystems?: () => React.ReactNode;
  renderAWSCosts?: () => React.ReactNode;
  renderBundleAnalyzer?: () => React.ReactNode;
  renderGitHub?: () => React.ReactNode;
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const defaultTabs: AdminTab[] = [
  // Overview
  { id: 'dashboard', label: 'Dashboard', icon: '📊', category: 'overview' },
  { id: 'performance', label: 'Performance', icon: '⚡', category: 'overview' },
  { id: 'analytics', label: 'Analytics', icon: '📈', category: 'overview' },
  
  // Users
  { id: 'users', label: 'Users', icon: '👥', category: 'users' },
  { id: 'badges', label: 'Badges', icon: '🏆', category: 'users' },
  { id: 'early-access', label: 'Early Access', icon: '🔑', category: 'users' },
  { id: 'support', label: 'Support', icon: '🎧', category: 'users' },
  { id: 'bug-tracker', label: 'Bug Tracker', icon: '🐛', category: 'users' },
  
  // Engagement
  { id: 'announcements', label: 'Announcements', icon: '📢', category: 'engagement' },
  { id: 'popups', label: 'Popups', icon: '🎯', category: 'engagement' },
  { id: 'quests', label: 'Quests', icon: '🎮', category: 'engagement' },
  { id: 'push-notifications', label: 'Push Notifications', icon: '🔔', category: 'engagement' },
  
  // Finance
  { id: 'all-fees', label: 'Fees', icon: '💰', category: 'finance' },
  { id: 'treasury', label: 'Treasury', icon: '🏦', category: 'finance' },
  { id: 'tokenomics', label: 'Tokenomics', icon: '🪙', category: 'finance' },
  
  // Gaming
  { id: 'gaming', label: 'Gaming', icon: '🎲', category: 'gaming' },
  { id: 'poker', label: 'Poker', icon: '♠️', category: 'gaming' },
  { id: 'jackpot', label: 'Jackpot', icon: '🎰', category: 'gaming' },
  
  // Rewards
  { id: 'lottery', label: 'Lottery', icon: '🎫', category: 'rewards' },
  { id: 'faucet', label: 'Faucet', icon: '💧', category: 'rewards' },
  
  // Platform
  { id: 'bridge', label: 'Bridge', icon: '🌉', category: 'platform' },
  { id: 'governance', label: 'Governance', icon: '🗳️', category: 'platform' },
  { id: 'feature-flags', label: 'Features', icon: '🚩', category: 'platform' },
  
  // Security
  { id: 'rate-limits', label: 'Rate Limits', icon: '⏱️', category: 'security' },
  { id: 'admin-management', label: 'Admins', icon: '🛡️', category: 'security' },
  { id: 'audit-log', label: 'Audit Log', icon: '📝', category: 'security' },
  { id: 'security-alerts', label: 'Alerts', icon: '🚨', category: 'security' },
  
  // System
  { id: 'ai-agents', label: 'AI Agents', icon: '🤖', category: 'system' },
  { id: 'apis', label: 'APIs', icon: '🔌', category: 'system' },
  { id: 'database', label: 'Database', icon: '🗄️', category: 'system' },
  { id: 'systems', label: 'Systems', icon: '⚙️', category: 'system' },
  { id: 'aws-costs', label: 'AWS Costs', icon: '☁️', category: 'system' },
];

const categoryLabels: Record<AdminTabCategory, string> = {
  overview: 'Overview',
  users: 'Users',
  engagement: 'Engagement',
  finance: 'Finance',
  gaming: 'Gaming',
  rewards: 'Rewards',
  platform: 'Platform',
  security: 'Security',
  system: 'System',
};

const categoryIcons: Record<AdminTabCategory, string> = {
  overview: '📊',
  users: '👥',
  engagement: '🎯',
  finance: '💰',
  gaming: '🎲',
  rewards: '🎁',
  platform: '🏗️',
  security: '🔒',
  system: '⚙️',
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface SidebarNavProps {
  tabs: AdminTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function SidebarNav({ tabs, activeTab, onTabChange, searchQuery, onSearchChange }: SidebarNavProps) {
  // Group tabs by category
  const grouped = tabs.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {} as Record<AdminTabCategory, AdminTab[]>);
  
  // Filter tabs by search
  const filteredGroups = Object.entries(grouped).reduce((acc, [category, categoryTabs]) => {
    const filtered = searchQuery 
      ? categoryTabs.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : categoryTabs;
    if (filtered.length > 0) acc[category as AdminTabCategory] = filtered;
    return acc;
  }, {} as Record<AdminTabCategory, AdminTab[]>);
  
  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        {Object.entries(filteredGroups).map(([category, categoryTabs]) => (
          <div key={category} className="mb-4">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <span>{categoryIcons[category as AdminTabCategory]}</span>
              {categoryLabels[category as AdminTabCategory]}
            </h3>
            <div className="space-y-1">
              {categoryTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  disabled={tab.hasPermission === false}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted text-foreground'
                    }
                    ${tab.hasPermission === false ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    {tab.label}
                  </span>
                  {tab.badge !== undefined && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

interface SystemStatusBarProps {
  systems: AdminSystemStatus[];
}

function SystemStatusBar({ systems }: SystemStatusBarProps) {
  const getStatusColor = (status: AdminSystemStatus['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      case 'loading': return 'bg-gray-400 animate-pulse';
    }
  };
  
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 border-b border-border">
      <span className="text-xs text-muted-foreground">Systems:</span>
      {systems.map(system => (
        <div key={system.name} className="flex items-center gap-2" title={system.error || `${system.name}: ${system.status}`}>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`} />
          <span className="text-xs">{system.name}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// ACCESS DENIED STATE
// ============================================================================

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <span className="text-6xl mb-4">🔒</span>
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access the admin panel.
        Please contact a super admin if you believe this is an error.
      </p>
    </div>
  );
}

// ============================================================================
// RATE LIMITED STATE
// ============================================================================

interface RateLimitedProps {
  blockedUntil?: Date;
}

function RateLimited({ blockedUntil }: RateLimitedProps) {
  const timeRemaining = blockedUntil 
    ? Math.max(0, Math.ceil((blockedUntil.getTime() - Date.now()) / 1000 / 60))
    : 0;
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <span className="text-6xl mb-4">⏱️</span>
      <h1 className="text-2xl font-bold mb-2 text-destructive">Rate Limited</h1>
      <p className="text-muted-foreground max-w-md mb-4">
        Too many failed attempts. Access is temporarily blocked.
      </p>
      {blockedUntil && (
        <Badge variant="destructive" className="text-lg px-4 py-2">
          Try again in {timeRemaining} minutes
        </Badge>
      )}
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function AdminLoadingSkeleton() {
  return (
    <div className="flex h-full">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r border-border p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

// ============================================================================
// TAB CONTENT WRAPPER
// ============================================================================

interface TabContentProps {
  render?: () => React.ReactNode;
}

function TabContent({ render }: TabContentProps) {
  if (!render) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <span className="text-4xl mb-4">🚧</span>
        <p className="text-muted-foreground">
          This section is not configured
        </p>
      </div>
    );
  }
  
  return <div className="h-full">{render()}</div>;
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function AdminPageTemplate({
  isAdmin = false,
  isSuperAdmin = false,
  permissions: _permissions,
  activeTab = 'dashboard',
  onTabChange,
  tabs = defaultTabs,
  isLoading = false,
  systemStatus = [],
  adminAddress: _adminAddress,
  adminUsername,
  isRateLimited = false,
  blockedUntil,
  searchQuery = '',
  onSearchChange,
  // Render props for all tabs
  renderDashboard,
  renderPerformance,
  renderAnalytics,
  renderUserManagement,
  renderBadges,
  renderEarlyAccess,
  renderDocsAccess,
  renderPointsHistory,
  renderPointsBoosters,
  renderReferrals,
  renderSupport,
  renderBugTracker,
  renderAnnouncements,
  renderPopups,
  renderQuests,
  renderPopupAnalytics,
  renderABTesting,
  renderTargeting,
  renderScheduling,
  renderPushNotifications,
  renderAllFees,
  renderEnhancedFees,
  renderTreasury,
  renderTokenomics,
  renderGaming,
  renderPoker,
  renderJackpot,
  renderLottery,
  renderFaucet,
  renderBridge,
  renderGovernance,
  renderFeatureFlags,
  renderSocialTokens,
  renderRateLimits,
  renderGeoRestrictions,
  renderAdminManagement,
  renderRoles,
  renderAuditLog,
  renderSecurityAlerts,
  renderSwapControls,
  renderAIAgents,
  renderAICosts,
  renderAPIs,
  renderDatabase,
  renderSystems,
  renderAWSCosts,
  renderBundleAnalyzer,
  renderGitHub,
}: AdminPageProps) {
  // Map tab IDs to render functions
  const renderMap: Record<string, (() => React.ReactNode) | undefined> = {
    'dashboard': renderDashboard,
    'performance': renderPerformance,
    'analytics': renderAnalytics,
    'users': renderUserManagement,
    'badges': renderBadges,
    'early-access': renderEarlyAccess,
    'docs-access': renderDocsAccess,
    'points-history': renderPointsHistory,
    'points-boosters': renderPointsBoosters,
    'referrals': renderReferrals,
    'support': renderSupport,
    'bug-tracker': renderBugTracker,
    'announcements': renderAnnouncements,
    'popups': renderPopups,
    'quests': renderQuests,
    'popup-analytics': renderPopupAnalytics,
    'ab-testing': renderABTesting,
    'targeting': renderTargeting,
    'scheduling': renderScheduling,
    'push-notifications': renderPushNotifications,
    'all-fees': renderAllFees,
    'enhanced-fees': renderEnhancedFees,
    'treasury': renderTreasury,
    'tokenomics': renderTokenomics,
    'gaming': renderGaming,
    'poker': renderPoker,
    'jackpot': renderJackpot,
    'lottery': renderLottery,
    'faucet': renderFaucet,
    'bridge': renderBridge,
    'governance': renderGovernance,
    'feature-flags': renderFeatureFlags,
    'social-tokens': renderSocialTokens,
    'rate-limits': renderRateLimits,
    'geo-restrictions': renderGeoRestrictions,
    'admin-management': renderAdminManagement,
    'roles': renderRoles,
    'audit-log': renderAuditLog,
    'security-alerts': renderSecurityAlerts,
    'swap-controls': renderSwapControls,
    'ai-agents': renderAIAgents,
    'ai-costs': renderAICosts,
    'apis': renderAPIs,
    'database': renderDatabase,
    'systems': renderSystems,
    'aws-costs': renderAWSCosts,
    'bundle-analyzer': renderBundleAnalyzer,
    'github': renderGitHub,
  };
  
  // Loading state
  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }
  
  // Rate limited state
  if (isRateLimited) {
    return <RateLimited blockedUntil={blockedUntil} />;
  }
  
  // Access denied
  if (!isAdmin) {
    return <AccessDenied />;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* System Status Bar */}
      {systemStatus.length > 0 && (
        <SystemStatusBar systems={systemStatus} />
      )}
      
      {/* Admin Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            {adminUsername && (
              <p className="text-xs text-muted-foreground">
                Logged in as {adminUsername}
                {isSuperAdmin && <Badge variant="destructive" className="ml-2 text-xs">Super Admin</Badge>}
              </p>
            )}
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <span>🔄</span>
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <span>📊</span>
            Export
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <SidebarNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange || (() => {})}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange || (() => {})}
        />
        
        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          <TabContent 
            render={renderMap[activeTab]} 
          />
        </div>
      </div>
    </div>
  );
}

export default AdminPageTemplate;
