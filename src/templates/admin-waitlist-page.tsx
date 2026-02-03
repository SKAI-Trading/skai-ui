/**
 * Admin Waitlist Page Template
 * 
 * Waitlist management dashboard for administrators:
 * - View and search waitlist entries
 * - Export waitlist data
 * - View signup analytics
 * - Manage invitations
 * 
 * @example
 * ```tsx
 * <AdminWaitlistPageTemplate
 *   entries={waitlistEntries}
 *   stats={waitlistStats}
 *   isLoading={isLoading}
 *   onSearch={handleSearch}
 *   onExport={handleExport}
 *   onDeleteEntries={handleDelete}
 *   renderSignupChart={(data) => <SignupChart data={data} />}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Checkbox } from "../components/forms/checkbox";
import { Input } from "../components/core/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/data-display/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface WaitlistEntry {
  id: string;
  email: string;
  username?: string;
  wallet_address?: string;
  wallet_type: "External" | "Email" | "Unknown";
  skai_points: number;
  signup_date: string;
  ip_address?: string;
  referral_count?: number;
  eth_balance?: number;
  status?: "pending" | "invited" | "converted" | "removed";
}

export interface WaitlistStats {
  total_signups: number;
  external_wallet_count: number;
  email_wallet_count: number;
  conversion_rate: number;
  signups_today: number;
  signups_this_week: number;
  signups_this_month: number;
  total_referrals: number;
  avg_eth_balance?: number;
}

export interface SignupDataPoint {
  date: string;
  count: number;
  external?: number;
  email?: number;
}

export interface AdminWaitlistPageTemplateProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Waitlist entries */
  entries: WaitlistEntry[];
  /** Waitlist statistics */
  stats: WaitlistStats | null;
  /** Signup chart data */
  signupChartData?: SignupDataPoint[];
  /** Total entries count (for pagination) */
  totalEntries?: number;
  /** Current page */
  currentPage?: number;
  /** Items per page */
  pageSize?: number;
  /** Search query */
  searchQuery?: string;
  /** Filter by wallet type */
  walletTypeFilter?: "all" | "External" | "Email";
  /** Filter by status */
  statusFilter?: "all" | "pending" | "invited" | "converted";
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Selected entry IDs */
  selectedIds?: string[];
  /** Loading state */
  isLoading?: boolean;
  /** Exporting state */
  isExporting?: boolean;
  /** Active tab */
  activeTab?: string;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Wallet type filter handler */
  onWalletTypeFilter?: (type: "all" | "External" | "Email") => void;
  /** Status filter handler */
  onStatusFilter?: (status: "all" | "pending" | "invited" | "converted") => void;
  /** Sort handler */
  onSort?: (field: string) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Selection handler */
  onSelectionChange?: (ids: string[]) => void;
  /** Select all handler */
  onSelectAll?: () => void;
  /** Export handler */
  onExport?: (format: "csv" | "json") => void;
  /** Delete entries handler */
  onDeleteEntries?: (ids: string[]) => void;
  /** Send invitations handler */
  onSendInvitations?: (ids: string[]) => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Back navigation handler */
  onBack?: () => void;
  /** Render signup chart */
  renderSignupChart?: (data: SignupDataPoint[]) => React.ReactNode;
  /** Render wallet type chart */
  renderWalletTypeChart?: (external: number, email: number) => React.ReactNode;
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

interface StatsCardsProps {
  stats: WaitlistStats | null;
  isLoading?: boolean;
}

function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_signups.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +{stats.signups_today} today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            External Wallets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {stats.external_wallet_count.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total_signups > 0 
              ? ((stats.external_wallet_count / stats.total_signups) * 100).toFixed(1) 
              : "0.0"}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Email Wallets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {stats.email_wallet_count.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total_signups > 0 
              ? ((stats.email_wallet_count / stats.total_signups) * 100).toFixed(1) 
              : "0.0"}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Conversion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {stats.conversion_rate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Waitlist → Active users
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  selectedIds: string[];
  isLoading?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onSelectAll?: () => void;
}

function WaitlistTable({ 
  entries, 
  selectedIds, 
  isLoading,
  onSelectionChange,
  onSelectAll,
}: WaitlistTableProps) {
  const toggleSelection = (id: string) => {
    if (!onSelectionChange) return;
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No waitlist entries found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === entries.length && entries.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Wallet Type</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">ETH Balance</TableHead>
            <TableHead className="text-right">Referrals</TableHead>
            <TableHead>Signup Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(entry.id)}
                  onCheckedChange={() => toggleSelection(entry.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{entry.email}</TableCell>
              <TableCell>{entry.username || "-"}</TableCell>
              <TableCell>
                <Badge variant={entry.wallet_type === "External" ? "default" : "secondary"}>
                  {entry.wallet_type}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {entry.skai_points.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {entry.eth_balance !== undefined 
                  ? `${entry.eth_balance.toFixed(4)} ETH`
                  : "-"
                }
              </TableCell>
              <TableCell className="text-right">
                {entry.referral_count || 0}
              </TableCell>
              <TableCell>
                {new Date(entry.signup_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    entry.status === "converted" ? "default" :
                    entry.status === "invited" ? "secondary" :
                    "outline"
                  }
                >
                  {entry.status || "pending"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalEntries: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

function Pagination({ currentPage, totalEntries, pageSize, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalEntries / pageSize);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function AdminWaitlistPageTemplate({
  title = "Waitlist Management",
  description = "View and manage platform waitlist entries",
  entries,
  stats,
  signupChartData = [],
  totalEntries = 0,
  currentPage = 1,
  pageSize = 25,
  searchQuery = "",
  walletTypeFilter = "all",
  statusFilter = "all",
  sortBy: _sortBy,
  sortOrder: _sortOrder,
  selectedIds = [],
  isLoading = false,
  isExporting = false,
  activeTab = "entries",
  onTabChange,
  onSearch,
  onWalletTypeFilter,
  onStatusFilter,
  onSort: _onSort,
  onPageChange,
  onSelectionChange,
  onSelectAll,
  onExport,
  onDeleteEntries,
  onSendInvitations,
  onRefresh,
  onBack,
  renderSignupChart,
  renderWalletTypeChart,
  headerContent,
  footerContent,
  className,
}: AdminWaitlistPageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  // via the onSort callback and sortBy/sortOrder state management
  void _sortBy;
  void _sortOrder;
  void _onSort;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExport && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onExport("csv")}
                disabled={isExporting}
              >
                {isExporting ? "Exporting..." : "Export CSV"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onExport("json")}
                disabled={isExporting}
              >
                Export JSON
              </Button>
            </>
          )}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          )}
        </div>
      </div>

      {headerContent}

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Entries Tab */}
        <TabsContent value="entries" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by email, username, or wallet..."
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <Select value={walletTypeFilter} onValueChange={onWalletTypeFilter as (value: string) => void}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Wallet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="External">External</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={onStatusFilter as (value: string) => void}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedIds.length} selected
              </span>
              {onSendInvitations && (
                <Button 
                  size="sm" 
                  onClick={() => onSendInvitations(selectedIds)}
                >
                  Send Invitations
                </Button>
              )}
              {onDeleteEntries && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteEntries(selectedIds)}
                >
                  Delete Selected
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectionChange?.([])}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Table */}
          <WaitlistTable
            entries={entries}
            selectedIds={selectedIds}
            isLoading={isLoading}
            onSelectionChange={onSelectionChange}
            onSelectAll={onSelectAll}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalEntries={totalEntries || entries.length}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Signup Chart */}
            {renderSignupChart && signupChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Signups Over Time</CardTitle>
                  <CardDescription>Daily waitlist signups</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderSignupChart(signupChartData)}
                </CardContent>
              </Card>
            )}

            {/* Wallet Type Distribution */}
            {renderWalletTypeChart && stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Type Distribution</CardTitle>
                  <CardDescription>External vs Email wallets</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderWalletTypeChart(stats.external_wallet_count, stats.email_wallet_count)}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Stats */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.signups_this_week}</div>
                  <p className="text-xs text-muted-foreground">signups</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.signups_this_month}</div>
                  <p className="text-xs text-muted-foreground">signups</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_referrals}</div>
                  <p className="text-xs text-muted-foreground">from existing users</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {footerContent}
    </div>
  );
}

export default AdminWaitlistPageTemplate;
