/**
 * TradePageTemplate
 * 
 * Pure presentational template for the main perpetual trading page.
 * This is a complex layout with chart, orderbook, trade panel, and portfolio sections.
 * 
 * @example
 * ```tsx
 * import { TradePageTemplate } from '@skai/ui';
 * 
 * function TradePage() {
 *   const [symbol, setSymbol] = useState('ETH-USD');
 *   return (
 *     <TradePageTemplate
 *       selectedSymbol={symbol}
 *       onSymbolChange={setSymbol}
 *       // Pass all the trading components as render props
 *       renderChart={(symbol) => <TradingChart symbol={symbol} />}
 *       renderOrderBook={(symbol) => <OrderBook symbol={symbol} />}
 *       renderTradePanel={(props) => <PerpTradePanel {...props} />}
 *       renderPortfolio={() => <PortfolioTabs />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader } from "../components/core/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/overlays/dialog";
import { Skeleton } from "../components/feedback/skeleton";

// ============================================================================
// TYPES
// ============================================================================

export type TradeSide = 'long' | 'short';
export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
export type MarketType = 'perp' | 'spot' | 'futures';

export interface MarketInfo {
  /** Trading symbol (e.g., "ETH-USD") */
  symbol: string;
  /** Base asset (e.g., "ETH") */
  baseAsset: string;
  /** Quote asset (e.g., "USD") */
  quoteAsset: string;
  /** Current price */
  price?: number;
  /** 24h price change percentage */
  priceChange24h?: number;
  /** 24h volume */
  volume24h?: number;
  /** 24h high */
  high24h?: number;
  /** 24h low */
  low24h?: number;
  /** Market type */
  marketType?: MarketType;
}

export interface OpenInterestData {
  /** Long open interest in base currency */
  longOpenInterest: bigint;
  /** Short open interest in base currency */
  shortOpenInterest: bigint;
  /** Maximum capacity */
  maxCapacity: bigint;
}

export interface KeyboardShortcut {
  /** Key combination (e.g., "Ctrl+Enter") */
  keys: string;
  /** Description of action */
  description: string;
  /** Category for grouping */
  category?: string;
}

export interface TradePageProps {
  /** Currently selected trading symbol */
  selectedSymbol: string;
  /** Callback when symbol changes */
  onSymbolChange?: (symbol: string) => void;
  /** Current trade side */
  tradeSide?: TradeSide;
  /** Callback when side changes */
  onTradeSideChange?: (side: TradeSide) => void;
  /** Current order type */
  orderType?: OrderType;
  /** Callback when order type changes */
  onOrderTypeChange?: (type: OrderType) => void;
  /** Market information */
  marketInfo?: MarketInfo;
  /** Open interest data */
  openInterest?: OpenInterestData;
  /** Whether one-click trading is enabled */
  oneClickEnabled?: boolean;
  /** Callback to toggle one-click trading */
  onToggleOneClick?: () => void;
  /** Connection status */
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
  /** Maximum leverage */
  maxLeverage?: number;
  /** Available keyboard shortcuts */
  shortcuts?: KeyboardShortcut[];
  /** Whether shortcuts modal is open */
  shortcutsModalOpen?: boolean;
  /** Callback to toggle shortcuts modal */
  onToggleShortcutsModal?: (open: boolean) => void;
  /** Risk disclaimer text */
  riskDisclaimer?: string;
  /** Whether to show compact risk disclaimer */
  compactDisclaimer?: boolean;
  /** Loading states */
  isLoading?: boolean;
  
  // ============================================================================
  // RENDER PROPS - Allow consumer to inject actual trading components
  // ============================================================================
  
  /** Render the market ticker strip */
  renderTickerStrip?: () => React.ReactNode;
  /** Render the market header with symbol selector */
  renderMarketHeader?: (symbol: string, onSymbolChange: (s: string) => void) => React.ReactNode;
  /** Render the trading chart */
  renderChart?: (symbol: string) => React.ReactNode;
  /** Render the order book */
  renderOrderBook?: (symbol: string) => React.ReactNode;
  /** Render the trade panel */
  renderTradePanel?: (props: { symbol: string; onSymbolChange: (s: string) => void }) => React.ReactNode;
  /** Render the portfolio tabs */
  renderPortfolio?: () => React.ReactNode;
  /** Render open orders panel */
  renderOpenOrders?: () => React.ReactNode;
  /** Render recent trades panel */
  renderRecentTrades?: (symbol: string) => React.ReactNode;
  /** Render account actions */
  renderAccountActions?: () => React.ReactNode;
  /** Render AI insights panel */
  renderAIInsights?: (symbol: string) => React.ReactNode;
  /** Render AI sentiment trendline */
  renderAISentiment?: (symbol: string) => React.ReactNode;
  /** Render order confirmation modal */
  renderConfirmModal?: (symbol: string) => React.ReactNode;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface RiskDisclaimerProps {
  text?: string;
  compact?: boolean;
}

function RiskDisclaimer({ text, compact }: RiskDisclaimerProps) {
  const defaultText = "Trading perpetual contracts involves significant risk and may not be suitable for all investors. You could lose more than your initial deposit.";
  
  if (compact) {
    return (
      <div className="px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-xs text-destructive/80">
          ⚠️ {text || defaultText}
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
      <h4 className="font-semibold text-destructive mb-2">⚠️ Risk Warning</h4>
      <p className="text-sm text-destructive/80">{text || defaultText}</p>
    </div>
  );
}

interface OneClickBannerProps {
  enabled?: boolean;
  onToggle?: () => void;
}

function OneClickBanner({ enabled, onToggle }: OneClickBannerProps) {
  return (
    <div className={`
      flex items-center justify-between p-3 rounded-lg border transition-colors
      ${enabled 
        ? 'bg-primary/10 border-primary/30' 
        : 'bg-muted/50 border-border/50'
      }
    `}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{enabled ? '⚡' : '🔐'}</span>
        <div>
          <h4 className="font-medium text-sm">
            One-Click Trading {enabled ? 'Enabled' : 'Disabled'}
          </h4>
          <p className="text-xs text-muted-foreground">
            {enabled 
              ? 'Execute trades instantly without confirmation' 
              : 'Enable for faster trade execution'
            }
          </p>
        </div>
      </div>
      <Button
        variant={enabled ? "destructive" : "default"}
        size="sm"
        onClick={onToggle}
      >
        {enabled ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}

interface OpenInterestBarProps {
  data?: OpenInterestData;
  symbol: string;
  mode?: 'compact' | 'full';
}

function OpenInterestBar({ data, symbol: _symbol, mode: _mode = 'compact' }: OpenInterestBarProps) {
  if (!data) return null;
  
  const longOI = Number(data.longOpenInterest);
  const shortOI = Number(data.shortOpenInterest);
  const maxCap = Number(data.maxCapacity);
  const total = longOI + shortOI;
  const longPercent = total > 0 ? (longOI / total) * 100 : 50;
  const utilizationPercent = maxCap > 0 ? (total / maxCap) * 100 : 0;
  
  const formatAmount = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };
  
  return (
    <div className="p-3 rounded-lg border border-border/50 bg-card/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Open Interest</span>
        <span className="text-xs font-medium">
          {utilizationPercent.toFixed(1)}% Utilized
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-red-500"
          style={{ 
            width: '100%',
            background: `linear-gradient(to right, #22c55e ${longPercent}%, #ef4444 ${longPercent}%)`
          }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs">
        <span className="text-green-500">
          Long: {formatAmount(longOI)} ({longPercent.toFixed(0)}%)
        </span>
        <span className="text-red-500">
          Short: {formatAmount(shortOI)} ({(100 - longPercent).toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

interface ConnectionStatusProps {
  status?: 'connected' | 'connecting' | 'disconnected';
  compact?: boolean;
}

function ConnectionStatus({ status = 'disconnected', compact }: ConnectionStatusProps) {
  const statusConfig = {
    connected: { color: 'bg-green-500', label: 'Connected', icon: '🟢' },
    connecting: { color: 'bg-yellow-500', label: 'Connecting...', icon: '🟡' },
    disconnected: { color: 'bg-red-500', label: 'Disconnected', icon: '🔴' },
  };
  
  const config = statusConfig[status];
  
  if (compact) {
    return (
      <span className="text-xs" title={config.label}>
        {config.icon}
      </span>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}

interface ShortcutsDialogProps {
  shortcuts: KeyboardShortcut[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function ShortcutsDialog({ shortcuts, open, onOpenChange }: ShortcutsDialogProps) {
  // Group shortcuts by category
  const grouped = shortcuts.reduce((acc, shortcut) => {
    const cat = shortcut.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <span>⌨️</span>
          <span className="text-xs">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {category}
              </h4>
              <div className="space-y-1">
                {items.map((shortcut) => (
                  <div 
                    key={shortcut.keys}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs bg-muted rounded border">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// SKELETON LOADERS
// ============================================================================

function ChartSkeleton() {
  return (
    <div className="flex-1 min-h-[500px] bg-card rounded-lg border border-border/50">
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

function OrderBookSkeleton() {
  return (
    <Card className="w-[320px] h-[600px]">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="space-y-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function TradePanelSkeleton() {
  return (
    <Card className="w-[320px]">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function TradePageTemplate({
  selectedSymbol,
  onSymbolChange,
  tradeSide: _tradeSide = 'long',
  onTradeSideChange: _onTradeSideChange,
  orderType: _orderType = 'market',
  onOrderTypeChange: _onOrderTypeChange,
  marketInfo,
  openInterest,
  oneClickEnabled = false,
  onToggleOneClick,
  connectionStatus = 'connected',
  maxLeverage = 500,
  shortcuts = [],
  shortcutsModalOpen = false,
  onToggleShortcutsModal,
  riskDisclaimer,
  compactDisclaimer = true,
  isLoading = false,
  renderTickerStrip,
  renderMarketHeader,
  renderChart,
  renderOrderBook,
  renderTradePanel,
  renderPortfolio,
  renderOpenOrders,
  renderRecentTrades,
  renderAccountActions,
  renderAIInsights,
  renderAISentiment,
  renderConfirmModal,
}: TradePageProps) {
  // Extract base symbol for components (e.g., "ETH" from "ETH-USD")
  const baseSymbol = selectedSymbol.split("-")[0];
  
  const handleSymbolChange = (newSymbol: string) => {
    onSymbolChange?.(newSymbol.includes('-') ? newSymbol : `${newSymbol}-USD`);
  };
  
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Market Ticker Strip */}
      {renderTickerStrip?.()}

      {/* Risk Disclaimer */}
      <div className="w-full px-4 pt-3">
        <RiskDisclaimer text={riskDisclaimer} compact={compactDisclaimer} />
      </div>

      {/* Trading Badge & Status Bar */}
      <div className="w-full px-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground border-0">
              SKAI PERP DEX
            </Badge>
            <span className="text-sm text-muted-foreground">
              Up to {maxLeverage}x leverage • Pyth oracle prices • SKAI fee discounts
            </span>
            <ConnectionStatus status={connectionStatus} compact />
          </div>
          <ShortcutsDialog 
            shortcuts={shortcuts}
            open={shortcutsModalOpen}
            onOpenChange={onToggleShortcutsModal}
          />
        </div>
      </div>

      {/* One-Click Trading Banner */}
      <div className="w-full px-4 pt-2">
        <OneClickBanner 
          enabled={oneClickEnabled}
          onToggle={onToggleOneClick}
        />
      </div>

      {/* Open Interest Bar */}
      <div className="w-full px-4 pt-2">
        <OpenInterestBar 
          data={openInterest}
          symbol={selectedSymbol}
          mode="compact"
        />
      </div>

      {/* Main Trading Layout */}
      <div className="flex w-full gap-2 px-4 pt-2">
        {/* Left side: MarketHeader stacked above Chart */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Market Header */}
          {renderMarketHeader 
            ? renderMarketHeader(baseSymbol, handleSymbolChange)
            : (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selectedSymbol}</h2>
                    {marketInfo && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>${marketInfo.price?.toLocaleString()}</span>
                        {marketInfo.priceChange24h !== undefined && (
                          <span className={marketInfo.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {marketInfo.priceChange24h >= 0 ? '+' : ''}{marketInfo.priceChange24h.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          }
          
          {/* Chart */}
          {isLoading ? (
            <ChartSkeleton />
          ) : renderChart ? (
            <div className="flex-1 min-h-[500px]">
              {renderChart(baseSymbol)}
            </div>
          ) : (
            <ChartSkeleton />
          )}
        </div>

        {/* Right side: OrderBook and TradePanel */}
        <div className="w-[320px] flex-shrink-0">
          {isLoading ? (
            <OrderBookSkeleton />
          ) : renderOrderBook ? (
            renderOrderBook(baseSymbol)
          ) : (
            <OrderBookSkeleton />
          )}
        </div>
        
        <div className="w-[320px] flex-shrink-0">
          {isLoading ? (
            <TradePanelSkeleton />
          ) : renderTradePanel ? (
            renderTradePanel({ 
              symbol: selectedSymbol, 
              onSymbolChange: handleSymbolChange 
            })
          ) : (
            <TradePanelSkeleton />
          )}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="flex gap-2 px-4 pt-2 pb-4">
        {/* Portfolio Tabs */}
        <div className="flex-1">
          {renderPortfolio?.()}
        </div>
        
        {/* Open Orders & Recent Trades */}
        <div className="w-[320px] flex-shrink-0 flex flex-col gap-2">
          {renderOpenOrders?.()}
          {renderRecentTrades?.(baseSymbol)}
        </div>
        
        {/* Account Actions & AI Insights */}
        <div className="w-[320px] flex-shrink-0 flex flex-col gap-2">
          {renderAccountActions?.()}
          {renderAIInsights?.(baseSymbol)}
          {renderAISentiment?.(baseSymbol)}
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {renderConfirmModal?.(baseSymbol)}
    </div>
  );
}

export default TradePageTemplate;
