/**
 * Admin Analytics Page Template
 * 
 * Comprehensive platform analytics dashboard for administrators:
 * - Conversion funnel metrics
 * - Cache performance monitoring
 * - Security event tracking
 * - Business metrics and KPIs
 * - Real-time charts and graphs
 * 
 * @example
 * ```tsx
 * <AdminAnalyticsPageTemplate
 *   metrics={platformMetrics}
 *   cacheStats={cacheData}
 *   businessMetrics={businessData}
 *   emailQueueStats={emailStats}
 *   isLoading={isLoading}
 *   onRefresh={handleRefresh}
 *   renderConversionFunnel={(data) => <ConversionChart data={data} />}
 *   renderCacheChart={(data) => <CachePerformanceChart data={data} />}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Progress } from "../components/feedback/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface ConversionStep {
  name: string;
  count: number;
  percentage: number;
  change?: number;
}

export interface CacheStats {
  memory: {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
  };
  dynamo?: {
    hits: number;
    misses: number;
    errors: number;
    avgLatency: number;
    hitRate: number;
    isConnected: boolean;
  };
  combined: {
    totalHits: number;
    totalMisses: number;
    combinedHitRate: number;
  };
}

export interface SecurityEvent {
  id: string;
  type: "login" | "failed_login" | "suspicious" | "blocked" | "rate_limited";
  description: string;
  ip_address?: string;
  wallet_address?: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface EmailQueueStats {
  pending: number;
  sent_today: number;
  failed_today: number;
  avg_send_time_ms: number;
}

export interface BusinessMetric {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export interface AnalyticsChartPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AdminAnalyticsPageTemplateProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Conversion funnel steps */
  conversionFunnel: ConversionStep[];
  /** Cache performance statistics */
  cacheStats: CacheStats | null;
  /** Security events list */
  securityEvents: SecurityEvent[];
  /** Email queue statistics */
  emailQueueStats: EmailQueueStats | null;
  /** Business metrics cards */
  businessMetrics: BusinessMetric[];
  /** Active users count */
  activeUsers?: number;
  /** Total revenue */
  totalRevenue?: number;
  /** Platform health score (0-100) */
  healthScore?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Refreshing state */
  isRefreshing?: boolean;
  /** Active tab */
  activeTab?: string;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Refresh data handler */
  onRefresh?: () => void;
  /** Record cache stats handler */
  onRecordCacheStats?: () => void;
  /** Export data handler */
  onExportData?: (type: string) => void;
  /** Render conversion funnel chart */
  renderConversionChart?: (data: ConversionStep[]) => React.ReactNode;
  /** Render cache performance chart */
  renderCacheChart?: (data: AnalyticsChartPoint[]) => React.ReactNode;
  /** Render security events timeline */
  renderSecurityTimeline?: (events: SecurityEvent[]) => React.ReactNode;
  /** Render business metrics chart */
  renderBusinessChart?: (data: AnalyticsChartPoint[]) => React.ReactNode;
  /** Render revenue chart */
  renderRevenueChart?: () => React.ReactNode;
  /** Render user activity chart */
  renderUserActivityChart?: () => React.ReactNode;
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

interface MetricCardProps {
  metric: BusinessMetric;
  isLoading?: boolean;
}

function MetricCard({ metric, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        {metric.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        {metric.change !== undefined && (
          <p className={cn(
            "text-xs mt-1",
            metric.trend === "up" && "text-green-500",
            metric.trend === "down" && "text-red-500",
            metric.trend === "neutral" && "text-muted-foreground"
          )}>
            {metric.change > 0 ? "+" : ""}{metric.change}%
            {metric.changeLabel && ` ${metric.changeLabel}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface ConversionFunnelProps {
  steps: ConversionStep[];
  isLoading?: boolean;
}

function ConversionFunnel({ steps, isLoading }: ConversionFunnelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{step.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {step.count.toLocaleString()}
              </span>
              <Badge variant={step.percentage > 50 ? "default" : "secondary"}>
                {step.percentage.toFixed(1)}%
              </Badge>
              {step.change !== undefined && (
                <span className={cn(
                  "text-xs",
                  step.change > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {step.change > 0 ? "↑" : "↓"} {Math.abs(step.change)}%
                </span>
              )}
            </div>
          </div>
          <Progress 
            value={step.percentage} 
            className="h-2"
          />
        </div>
      ))}
    </div>
  );
}

interface CacheStatsCardProps {
  stats: CacheStats | null;
  isLoading?: boolean;
  onRecordStats?: () => void;
}

function CacheStatsCard({ stats, isLoading, onRecordStats }: CacheStatsCardProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
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
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Cache</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.memory.hitRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.memory.hits.toLocaleString()} hits / {stats.memory.misses.toLocaleString()} misses
            </p>
          </CardContent>
        </Card>

        {stats.dynamo && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                DynamoDB Cache
                <Badge variant={stats.dynamo.isConnected ? "default" : "destructive"}>
                  {stats.dynamo.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {stats.dynamo.hitRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Avg latency: {stats.dynamo.avgLatency.toFixed(0)}ms
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Combined Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {stats.combined.combinedHitRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.combined.totalHits.toLocaleString()} total hits
            </p>
          </CardContent>
        </Card>
      </div>

      {onRecordStats && (
        <Button variant="outline" size="sm" onClick={onRecordStats}>
          Record Cache Snapshot
        </Button>
      )}
    </div>
  );
}

interface SecurityEventsListProps {
  events: SecurityEvent[];
  isLoading?: boolean;
}

function SecurityEventsList({ events, isLoading }: SecurityEventsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No security events recorded
      </div>
    );
  }

  const severityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    critical: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {events.map((event) => (
        <div
          key={event.id}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border",
            severityColors[event.severity]
          )}
        >
          <Badge variant="outline" className="mt-0.5">
            {event.severity}
          </Badge>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{event.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{new Date(event.timestamp).toLocaleString()}</span>
              {event.ip_address && (
                <span>
                  • IP: {event.ip_address.split(".").slice(0, 2).join(".")}.xxx.xxx
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface EmailQueueCardProps {
  stats: EmailQueueStats | null;
  isLoading?: boolean;
}

function EmailQueueCard({ stats, isLoading }: EmailQueueCardProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
        <p className="text-xs text-muted-foreground">Pending</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-500">{stats.sent_today}</div>
        <p className="text-xs text-muted-foreground">Sent Today</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-500">{stats.failed_today}</div>
        <p className="text-xs text-muted-foreground">Failed Today</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-500">{stats.avg_send_time_ms}ms</div>
        <p className="text-xs text-muted-foreground">Avg Send Time</p>
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function AdminAnalyticsPageTemplate({
  title = "Platform Analytics",
  description = "Comprehensive platform metrics and performance monitoring",
  conversionFunnel,
  cacheStats,
  securityEvents,
  emailQueueStats,
  businessMetrics,
  activeUsers: _activeUsers,
  totalRevenue: _totalRevenue,
  healthScore,
  isLoading = false,
  isRefreshing = false,
  activeTab = "overview",
  onTabChange,
  onRefresh,
  onRecordCacheStats,
  onExportData,
  renderConversionChart,
  renderCacheChart,
  renderSecurityTimeline,
  renderBusinessChart,
  renderRevenueChart,
  renderUserActivityChart,
  headerContent,
  footerContent,
  className,
}: AdminAnalyticsPageTemplateProps) {
  // Props prefixed with _ are available for consumer charts
  void _activeUsers;
  void _totalRevenue;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {onExportData && (
            <Button variant="outline" size="sm" onClick={() => onExportData("csv")}>
              Export CSV
            </Button>
          )}
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
        </div>
      </div>

      {headerContent}

      {/* Health Score Banner */}
      {healthScore !== undefined && (
        <Card className={cn(
          "border-l-4",
          healthScore >= 80 ? "border-l-green-500" : 
          healthScore >= 60 ? "border-l-yellow-500" : "border-l-red-500"
        )}>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium">Platform Health Score</p>
              <p className="text-xs text-muted-foreground">
                Based on uptime, performance, and error rates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={healthScore} className="w-32" />
              <span className="text-2xl font-bold">{healthScore}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {businessMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} isLoading={isLoading} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            {renderRevenueChart && (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderRevenueChart()}
                </CardContent>
              </Card>
            )}

            {/* User Activity Chart */}
            {renderUserActivityChart && (
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderUserActivityChart()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Business Chart */}
          {renderBusinessChart && (
            <Card>
              <CardHeader>
                <CardTitle>Business Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {renderBusinessChart(businessMetrics.map(m => ({
                  name: m.label,
                  value: typeof m.value === 'number' ? m.value : 0
                })))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from signup to conversion</CardDescription>
            </CardHeader>
            <CardContent>
              {renderConversionChart ? (
                renderConversionChart(conversionFunnel)
              ) : (
                <ConversionFunnel steps={conversionFunnel} isLoading={isLoading} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cache Tab */}
        <TabsContent value="cache" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cache Performance</CardTitle>
              <CardDescription>Memory and distributed cache statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <CacheStatsCard 
                stats={cacheStats} 
                isLoading={isLoading}
                onRecordStats={onRecordCacheStats}
              />
            </CardContent>
          </Card>

          {renderCacheChart && cacheStats && (
            <Card>
              <CardHeader>
                <CardTitle>Cache Hit Rate Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCacheChart([
                  { name: "Memory", value: cacheStats.memory.hitRate },
                  { name: "DynamoDB", value: cacheStats.dynamo?.hitRate || 0 },
                  { name: "Combined", value: cacheStats.combined.combinedHitRate },
                ])}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Recent security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              {renderSecurityTimeline ? (
                renderSecurityTimeline(securityEvents)
              ) : (
                <SecurityEventsList events={securityEvents} isLoading={isLoading} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Queue Status</CardTitle>
              <CardDescription>Notification delivery statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailQueueCard stats={emailQueueStats} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {footerContent}
    </div>
  );
}

export default AdminAnalyticsPageTemplate;
