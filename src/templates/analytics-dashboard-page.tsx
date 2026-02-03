/**
 * AnalyticsDashboardPageTemplate
 * 
 * Pure presentational template for the analytics dashboard.
 * Portfolio PnL, risk metrics, trade history, performance charts.
 * 
 * @example
 * ```tsx
 * import { AnalyticsDashboardPageTemplate } from '@skai/ui';
 * 
 * function AnalyticsDashboard() {
 *   return (
 *     <AnalyticsDashboardPageTemplate
 *       portfolioValue={portfolioData}
 *       trades={tradeHistory}
 *       renderPnLChart={() => <PnLChart data={chartData} />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Progress } from "../components/feedback/progress";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/navigation/tabs";

// ============================================================================
// TYPES
// ============================================================================

export type TimeRange = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL';
export type TradeType = 'swap' | 'limit' | 'bridge' | 'stake' | 'unstake' | 'claim';
export type TradeStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

export interface PortfolioValue {
  /** Current total value */
  totalValue: number;
  /** 24h change amount */
  change24h: number;
  /** 24h change percentage */
  changePercent24h: number;
  /** All-time high */
  allTimeHigh?: number;
  /** All-time low */
  allTimeLow?: number;
  /** Total deposited */
  totalDeposited?: number;
  /** Total withdrawn */
  totalWithdrawn?: number;
  /** Net PnL */
  netPnL?: number;
  /** PnL percentage */
  pnLPercent?: number;
}

export interface PerformanceMetric {
  /** Metric label */
  label: string;
  /** Current value */
  value: number;
  /** Display format */
  format: 'currency' | 'percent' | 'number';
  /** Change from previous period */
  change?: number;
  /** Is positive change good? */
  positiveIsGood?: boolean;
  /** Description */
  description?: string;
}

export interface RiskMetrics {
  /** Sharpe ratio */
  sharpeRatio?: number;
  /** Sortino ratio */
  sortinoRatio?: number;
  /** Max drawdown */
  maxDrawdown?: number;
  /** Win rate */
  winRate?: number;
  /** Profit factor */
  profitFactor?: number;
  /** Average win */
  averageWin?: number;
  /** Average loss */
  averageLoss?: number;
  /** Risk score (0-100) */
  riskScore?: number;
}

export interface TradeRecord {
  /** Trade ID */
  id: string;
  /** Type */
  type: TradeType;
  /** Status */
  status: TradeStatus;
  /** Token in */
  tokenIn: string;
  /** Token in symbol */
  tokenInSymbol: string;
  /** Amount in */
  amountIn: number;
  /** Token out */
  tokenOut: string;
  /** Token out symbol */
  tokenOutSymbol: string;
  /** Amount out */
  amountOut: number;
  /** USD value */
  usdValue?: number;
  /** Fee paid */
  fee?: number;
  /** Timestamp */
  timestamp: Date;
  /** Transaction hash */
  txHash?: string;
  /** Chain */
  chain?: string;
}

export interface AssetAllocation {
  /** Asset symbol */
  symbol: string;
  /** Asset name */
  name: string;
  /** Value in USD */
  value: number;
  /** Allocation percentage */
  allocation: number;
  /** PnL on this asset */
  pnl?: number;
  /** Color for chart */
  color?: string;
}

export type AnalyticsTab = 'overview' | 'trades' | 'risk' | 'allocation';

export interface AnalyticsDashboardPageProps {
  /** Active tab */
  activeTab?: AnalyticsTab;
  /** Callback when tab changes */
  onTabChange?: (tab: AnalyticsTab) => void;
  /** Time range */
  timeRange?: TimeRange;
  /** Callback when time range changes */
  onTimeRangeChange?: (range: TimeRange) => void;
  /** Whether loading */
  isLoading?: boolean;
  /** Portfolio value */
  portfolioValue?: PortfolioValue;
  /** Performance metrics */
  metrics?: PerformanceMetric[];
  /** Risk metrics */
  riskMetrics?: RiskMetrics;
  /** Trade history */
  trades?: TradeRecord[];
  /** Trade history page */
  tradesPage?: number;
  /** Total trade pages */
  tradesTotalPages?: number;
  /** Callback when trade page changes */
  onTradesPageChange?: (page: number) => void;
  /** Asset allocation */
  allocation?: AssetAllocation[];
  /** Export data */
  onExport?: (format: 'csv' | 'pdf') => void;
  /** Open trade detail */
  onTradeClick?: (trade: TradeRecord) => void;
  
  // Render props
  /** Render PnL chart */
  renderPnLChart?: () => React.ReactNode;
  /** Render allocation pie chart */
  renderAllocationChart?: () => React.ReactNode;
  /** Render custom metrics */
  renderCustomMetrics?: () => React.ReactNode;
  /** Render trade detail modal */
  renderTradeDetail?: (trade: TradeRecord) => React.ReactNode;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function getTradeTypeLabel(type: TradeType): string {
  switch (type) {
    case 'swap': return 'Swap';
    case 'limit': return 'Limit Order';
    case 'bridge': return 'Bridge';
    case 'stake': return 'Stake';
    case 'unstake': return 'Unstake';
    case 'claim': return 'Claim';
  }
}

function getStatusColor(status: TradeStatus): string {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'failed': return 'bg-red-500';
    case 'cancelled': return 'bg-gray-500';
  }
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface PortfolioHeaderProps {
  portfolio?: PortfolioValue;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onExport?: (format: 'csv' | 'pdf') => void;
}

function PortfolioHeader({ portfolio, timeRange, onTimeRangeChange, onExport }: PortfolioHeaderProps) {
  const isPositive = (portfolio?.changePercent24h ?? 0) >= 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <h2 className="text-3xl font-bold mt-1">
              {portfolio ? formatCurrency(portfolio.totalValue) : '$0.00'}
            </h2>
            {portfolio && (
              <div className={`flex items-center gap-2 mt-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <span>{isPositive ? '▲' : '▼'}</span>
                <span>{formatCurrency(Math.abs(portfolio.change24h))}</span>
                <span>({formatPercent(portfolio.changePercent24h)})</span>
                <span className="text-muted-foreground">24h</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Time range selector */}
            <div className="flex rounded-lg border overflow-hidden">
              {(['1D', '7D', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map(range => (
                <button
                  key={range}
                  className={`px-3 py-1 text-sm transition-colors ${
                    timeRange === range 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => onTimeRangeChange?.(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Export */}
            {onExport && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
                  PDF
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* PnL stats */}
        {portfolio?.netPnL !== undefined && (
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Net PnL</p>
              <p className={`font-semibold ${portfolio.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(portfolio.netPnL)}
              </p>
            </div>
            {portfolio.pnLPercent !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Return</p>
                <p className={`font-semibold ${portfolio.pnLPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(portfolio.pnLPercent)}
                </p>
              </div>
            )}
            {portfolio.allTimeHigh !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">ATH</p>
                <p className="font-semibold">{formatCurrency(portfolio.allTimeHigh)}</p>
              </div>
            )}
            {portfolio.totalDeposited !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Total Deposited</p>
                <p className="font-semibold">{formatCurrency(portfolio.totalDeposited)}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  metric: PerformanceMetric;
}

function MetricCard({ metric }: MetricCardProps) {
  const formatValue = () => {
    switch (metric.format) {
      case 'currency': return formatCurrency(metric.value);
      case 'percent': return `${metric.value.toFixed(2)}%`;
      default: return metric.value.toLocaleString();
    }
  };
  
  const changeIsGood = metric.positiveIsGood !== false 
    ? (metric.change ?? 0) >= 0 
    : (metric.change ?? 0) <= 0;
  
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">{metric.label}</p>
        <p className="text-xl font-bold mt-1">{formatValue()}</p>
        {metric.change !== undefined && (
          <p className={`text-xs mt-1 ${changeIsGood ? 'text-green-500' : 'text-red-500'}`}>
            {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
          </p>
        )}
        {metric.description && (
          <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface RiskMetricsCardProps {
  metrics?: RiskMetrics;
}

function RiskMetricsCard({ metrics }: RiskMetricsCardProps) {
  if (!metrics) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risk Metrics</CardTitle>
        <CardDescription>Portfolio risk analysis</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.winRate !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-xl font-bold">{(metrics.winRate * 100).toFixed(1)}%</p>
          </div>
        )}
        {metrics.profitFactor !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Profit Factor</p>
            <p className={`text-xl font-bold ${metrics.profitFactor >= 1 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.profitFactor.toFixed(2)}
            </p>
          </div>
        )}
        {metrics.maxDrawdown !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-xl font-bold text-red-500">{(metrics.maxDrawdown * 100).toFixed(1)}%</p>
          </div>
        )}
        {metrics.sharpeRatio !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className={`text-xl font-bold ${metrics.sharpeRatio >= 1 ? 'text-green-500' : 'text-muted-foreground'}`}>
              {metrics.sharpeRatio.toFixed(2)}
            </p>
          </div>
        )}
        {metrics.averageWin !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Avg Win</p>
            <p className="text-xl font-bold text-green-500">{formatCurrency(metrics.averageWin)}</p>
          </div>
        )}
        {metrics.averageLoss !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Avg Loss</p>
            <p className="text-xl font-bold text-red-500">{formatCurrency(Math.abs(metrics.averageLoss))}</p>
          </div>
        )}
        {metrics.riskScore !== undefined && (
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
            <div className="flex items-center gap-2">
              <Progress value={metrics.riskScore} className="flex-1" />
              <span className={`text-sm font-medium ${
                metrics.riskScore < 30 ? 'text-green-500' : 
                metrics.riskScore < 70 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {metrics.riskScore}/100
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TradeHistoryTableProps {
  trades?: TradeRecord[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onTradeClick?: (trade: TradeRecord) => void;
}

function TradeHistoryTable({ trades = [], page = 1, totalPages = 1, onPageChange, onTradeClick }: TradeHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No trades found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">From</th>
                    <th className="pb-2">To</th>
                    <th className="pb-2 text-right">Value</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {trades.map(trade => (
                    <tr 
                      key={trade.id} 
                      className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                      onClick={() => onTradeClick?.(trade)}
                    >
                      <td className="py-3">
                        <Badge variant="outline">{getTradeTypeLabel(trade.type)}</Badge>
                      </td>
                      <td className="py-3">
                        {trade.amountIn.toLocaleString()} {trade.tokenInSymbol}
                      </td>
                      <td className="py-3">
                        {trade.amountOut.toLocaleString()} {trade.tokenOutSymbol}
                      </td>
                      <td className="py-3 text-right">
                        {trade.usdValue ? formatCurrency(trade.usdValue) : '-'}
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(trade.status)}>
                          {trade.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {trade.timestamp.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page <= 1}
                  onClick={() => onPageChange?.(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page >= totalPages}
                  onClick={() => onPageChange?.(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface AllocationTableProps {
  allocation?: AssetAllocation[];
}

function AllocationTable({ allocation = [] }: AllocationTableProps) {
  const sortedAllocation = [...allocation].sort((a, b) => b.allocation - a.allocation);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAllocation.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No assets
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAllocation.map(asset => (
              <div key={asset.symbol} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: asset.color || '#3b82f6' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{asset.symbol}</span>
                    <span>{formatCurrency(asset.value)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{asset.name}</span>
                    <span>{asset.allocation.toFixed(1)}%</span>
                  </div>
                  <Progress value={asset.allocation} className="h-1 mt-1" />
                </div>
                {asset.pnl !== undefined && (
                  <span className={`text-sm ${asset.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercent(asset.pnl)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function AnalyticsLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function AnalyticsDashboardPageTemplate({
  activeTab = 'overview',
  onTabChange,
  timeRange = '1M',
  onTimeRangeChange,
  isLoading,
  portfolioValue,
  metrics = [],
  riskMetrics,
  trades = [],
  tradesPage = 1,
  tradesTotalPages = 1,
  onTradesPageChange,
  allocation = [],
  onExport,
  onTradeClick,
  renderPnLChart,
  renderAllocationChart,
  renderCustomMetrics,
  renderTradeDetail: _renderTradeDetail,
}: AnalyticsDashboardPageProps) {
  if (isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <span>📊</span>
        Analytics Dashboard
      </h1>
      
      {/* Portfolio Header with Value & Time Range */}
      <PortfolioHeader 
        portfolio={portfolioValue}
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        onExport={onExport}
      />
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as AnalyticsTab)}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <span>📈</span> Overview
          </TabsTrigger>
          <TabsTrigger value="trades" className="gap-2">
            <span>📝</span> Trades
          </TabsTrigger>
          <TabsTrigger value="risk" className="gap-2">
            <span>⚠️</span> Risk
          </TabsTrigger>
          <TabsTrigger value="allocation" className="gap-2">
            <span>🥧</span> Allocation
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* PnL Chart */}
          {renderPnLChart && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>{renderPnLChart()}</CardContent>
            </Card>
          )}
          
          {/* Metrics Grid */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric, i) => (
                <MetricCard key={i} metric={metric} />
              ))}
            </div>
          )}
          
          {/* Custom Metrics */}
          {renderCustomMetrics?.()}
        </TabsContent>
        
        {/* Trades Tab */}
        <TabsContent value="trades" className="mt-4">
          <TradeHistoryTable 
            trades={trades}
            page={tradesPage}
            totalPages={tradesTotalPages}
            onPageChange={onTradesPageChange}
            onTradeClick={onTradeClick}
          />
        </TabsContent>
        
        {/* Risk Tab */}
        <TabsContent value="risk" className="space-y-6 mt-4">
          <RiskMetricsCard metrics={riskMetrics} />
          
          {/* Additional risk info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Analysis</CardTitle>
              <CardDescription>
                Based on your trading history and portfolio composition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                Risk analysis is calculated from your historical trades, 
                win rate, average position size, and portfolio diversification.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Allocation Tab */}
        <TabsContent value="allocation" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Chart */}
            {renderAllocationChart && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribution</CardTitle>
                </CardHeader>
                <CardContent>{renderAllocationChart()}</CardContent>
              </Card>
            )}
            
            {/* Table */}
            <AllocationTable allocation={allocation} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsDashboardPageTemplate;
