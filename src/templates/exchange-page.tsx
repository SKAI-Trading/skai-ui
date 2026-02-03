/**
 * ExchangePageTemplate
 * 
 * Pure presentational template for the unified swap/bridge exchange page.
 * Combines same-chain swaps and cross-chain bridging in one interface.
 * 
 * @example
 * ```tsx
 * import { ExchangePageTemplate } from '@skai/ui';
 * 
 * function Exchange() {
 *   return (
 *     <ExchangePageTemplate
 *       mode={mode}
 *       fromChain={fromChain}
 *       toChain={toChain}
 *       onModeChange={setMode}
 *       renderSwapForm={() => <SwapForm />}
 *       renderChart={() => <PriceChart />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Skeleton } from "../components/feedback/skeleton";

// ============================================================================
// TYPES
// ============================================================================

export type ExchangeMode = 'swap' | 'bridge';

export interface ExchangeChain {
  /** Chain ID */
  id: number;
  /** Chain name */
  name: string;
  /** Native symbol */
  symbol: string;
  /** Chain icon URL */
  iconUrl?: string;
  /** Icon color class */
  colorClass?: string;
}

export interface ExchangeToken {
  /** Token address */
  address: string;
  /** Token symbol */
  symbol: string;
  /** Token name */
  name: string;
  /** Token decimals */
  decimals: number;
  /** Token icon URL */
  iconUrl?: string;
  /** User balance */
  balance?: string;
  /** USD price */
  price?: number;
}

export interface ExchangeQuote {
  /** Input amount */
  inputAmount: string;
  /** Output amount */
  outputAmount: string;
  /** Price impact percentage */
  priceImpact?: number;
  /** Exchange rate */
  rate?: number;
  /** Estimated gas */
  estimatedGas?: string;
  /** Fee amount */
  fee?: string;
  /** Route description */
  route?: string;
  /** Estimated time (for bridges) */
  estimatedTime?: string;
}

export type ExchangeStatus = 'idle' | 'quoting' | 'approving' | 'executing' | 'success' | 'error';

export interface ExchangePageProps {
  /** Current exchange mode */
  mode?: ExchangeMode;
  /** Callback when mode changes */
  onModeChange?: (mode: ExchangeMode) => void;
  /** Whether wallet is connected */
  isConnected?: boolean;
  /** User wallet address */
  walletAddress?: string;
  /** Source chain */
  fromChain?: ExchangeChain;
  /** Destination chain */
  toChain?: ExchangeChain;
  /** Available chains */
  chains?: ExchangeChain[];
  /** Callback when from chain changes */
  onFromChainChange?: (chain: ExchangeChain) => void;
  /** Callback when to chain changes */
  onToChainChange?: (chain: ExchangeChain) => void;
  /** Swap chains callback */
  onSwapChains?: () => void;
  /** Source token */
  fromToken?: ExchangeToken;
  /** Destination token */
  toToken?: ExchangeToken;
  /** Available tokens for from chain */
  fromTokens?: ExchangeToken[];
  /** Available tokens for to chain */
  toTokens?: ExchangeToken[];
  /** Input amount */
  inputAmount?: string;
  /** Callback when input changes */
  onInputAmountChange?: (amount: string) => void;
  /** Current quote */
  quote?: ExchangeQuote | null;
  /** Transaction status */
  status?: ExchangeStatus;
  /** Error message */
  error?: string | null;
  /** Execute swap/bridge */
  onExecute?: () => void;
  /** Whether loading */
  isLoading?: boolean;
  /** Whether chart is visible */
  showChart?: boolean;
  /** Toggle chart visibility */
  onToggleChart?: () => void;
  /** User fee tier */
  feeTier?: {
    name: string;
    feePercent: number;
    volume30d?: number;
  };
  
  // Render props
  /** Render swap/bridge form */
  renderForm?: () => React.ReactNode;
  /** Render price chart */
  renderChart?: () => React.ReactNode;
  /** Render token selector */
  renderTokenSelector?: (type: 'from' | 'to') => React.ReactNode;
  /** Render chain selector */
  renderChainSelector?: (type: 'from' | 'to') => React.ReactNode;
  /** Render settings dialog */
  renderSettings?: () => React.ReactNode;
  /** Render connect wallet button */
  renderConnectButton?: () => React.ReactNode;
  /** Render transaction history */
  renderHistory?: () => React.ReactNode;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface ModeToggleProps {
  mode: ExchangeMode;
  onModeChange: (mode: ExchangeMode) => void;
}

function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-muted p-1">
      <button
        onClick={() => onModeChange('swap')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === 'swap' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        🔄 Swap
      </button>
      <button
        onClick={() => onModeChange('bridge')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === 'bridge' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        🌉 Bridge
      </button>
    </div>
  );
}

interface ExchangeQuoteDisplayProps {
  quote: ExchangeQuote;
  mode: ExchangeMode;
}

function ExchangeQuoteDisplay({ quote, mode }: ExchangeQuoteDisplayProps) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Rate</span>
        <span>{quote.rate?.toFixed(6) || '—'}</span>
      </div>
      {quote.priceImpact !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Price Impact</span>
          <span className={quote.priceImpact > 1 ? 'text-yellow-500' : quote.priceImpact > 3 ? 'text-red-500' : ''}>
            {quote.priceImpact.toFixed(2)}%
          </span>
        </div>
      )}
      {quote.fee && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Fee</span>
          <span>{quote.fee}</span>
        </div>
      )}
      {quote.estimatedGas && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Est. Gas</span>
          <span>{quote.estimatedGas}</span>
        </div>
      )}
      {mode === 'bridge' && quote.estimatedTime && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Est. Time</span>
          <span>{quote.estimatedTime}</span>
        </div>
      )}
      {quote.route && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Route</span>
          <span className="text-xs truncate max-w-[150px]">{quote.route}</span>
        </div>
      )}
    </div>
  );
}

interface DefaultFormProps {
  mode: ExchangeMode;
  fromChain?: ExchangeChain;
  toChain?: ExchangeChain;
  fromToken?: ExchangeToken;
  toToken?: ExchangeToken;
  inputAmount?: string;
  onInputAmountChange?: (amount: string) => void;
  quote?: ExchangeQuote | null;
  status: ExchangeStatus;
  onSwapChains?: () => void;
  onExecute?: () => void;
  isConnected?: boolean;
  renderConnectButton?: () => React.ReactNode;
  renderTokenSelector?: (type: 'from' | 'to') => React.ReactNode;
  renderChainSelector?: (type: 'from' | 'to') => React.ReactNode;
}

function DefaultForm({
  mode,
  fromChain,
  toChain,
  fromToken,
  toToken,
  inputAmount,
  onInputAmountChange,
  quote,
  status,
  onSwapChains,
  onExecute,
  isConnected,
  renderConnectButton,
  renderTokenSelector,
  renderChainSelector,
}: DefaultFormProps) {
  const getStatusLabel = () => {
    switch (status) {
      case 'quoting': return 'Getting quote...';
      case 'approving': return 'Approving...';
      case 'executing': return mode === 'swap' ? 'Swapping...' : 'Bridging...';
      case 'success': return 'Success!';
      case 'error': return 'Failed';
      default: return mode === 'swap' ? 'Swap' : 'Bridge';
    }
  };
  
  const isDisabled = status === 'quoting' || status === 'approving' || status === 'executing' || !quote;
  
  return (
    <div className="space-y-4">
      {/* From Section */}
      <div className="p-4 rounded-xl bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">From</span>
          {fromToken?.balance && (
            <span className="text-xs text-muted-foreground">
              Balance: {parseFloat(fromToken.balance).toFixed(4)} {fromToken.symbol}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {renderChainSelector ? renderChainSelector('from') : (
            <Button variant="outline" size="sm" className="gap-2">
              {fromChain?.iconUrl && <img src={fromChain.iconUrl} alt={fromChain.name} className="w-5 h-5 rounded-full" />}
              {fromChain?.name || 'Select'}
            </Button>
          )}
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={inputAmount || ''}
            onChange={(e) => onInputAmountChange?.(e.target.value)}
            className="flex-1 text-lg border-0 bg-transparent"
          />
          {renderTokenSelector ? renderTokenSelector('from') : (
            <Button variant="outline" size="sm" className="gap-2">
              {fromToken?.iconUrl && <img src={fromToken.iconUrl} alt={fromToken.symbol} className="w-5 h-5 rounded-full" />}
              {fromToken?.symbol || 'Select'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background"
          onClick={onSwapChains}
        >
          ↕️
        </Button>
      </div>
      
      {/* To Section */}
      <div className="p-4 rounded-xl bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">To</span>
          {mode === 'bridge' && toChain && fromChain?.id !== toChain?.id && (
            <Badge variant="secondary" className="text-xs">Cross-chain</Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {renderChainSelector ? renderChainSelector('to') : (
            <Button variant="outline" size="sm" className="gap-2">
              {toChain?.iconUrl && <img src={toChain.iconUrl} alt={toChain.name} className="w-5 h-5 rounded-full" />}
              {toChain?.name || 'Select'}
            </Button>
          )}
          <div className="flex-1 text-lg px-3">
            {quote?.outputAmount || '0.0'}
          </div>
          {renderTokenSelector ? renderTokenSelector('to') : (
            <Button variant="outline" size="sm" className="gap-2">
              {toToken?.iconUrl && <img src={toToken.iconUrl} alt={toToken.symbol} className="w-5 h-5 rounded-full" />}
              {toToken?.symbol || 'Select'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Quote Details */}
      {quote && (
        <ExchangeQuoteDisplay quote={quote} mode={mode} />
      )}
      
      {/* Action Button */}
      {isConnected ? (
        <Button 
          onClick={onExecute} 
          disabled={isDisabled}
          className="w-full"
          size="lg"
        >
          {status === 'quoting' || status === 'approving' || status === 'executing' ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              {getStatusLabel()}
            </span>
          ) : (
            getStatusLabel()
          )}
        </Button>
      ) : (
        renderConnectButton?.() || (
          <Button className="w-full" size="lg">
            Connect Wallet
          </Button>
        )
      )}
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function ExchangeLoadingSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function ExchangePageTemplate({
  mode = 'swap',
  onModeChange,
  isConnected,
  walletAddress: _walletAddress,
  fromChain,
  toChain,
  chains: _chains,
  onFromChainChange: _onFromChainChange,
  onToChainChange: _onToChainChange,
  onSwapChains,
  fromToken,
  toToken,
  fromTokens: _fromTokens,
  toTokens: _toTokens,
  inputAmount,
  onInputAmountChange,
  quote,
  status = 'idle',
  error,
  onExecute,
  isLoading,
  showChart = true,
  onToggleChart,
  feeTier,
  renderForm,
  renderChart,
  renderTokenSelector,
  renderChainSelector,
  renderSettings,
  renderConnectButton,
  renderHistory,
}: ExchangePageProps) {
  if (isLoading) {
    return <ExchangeLoadingSkeleton />;
  }
  
  return (
    <div className="container max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {mode === 'swap' ? '🔄 Swap' : '🌉 Bridge'}
          </h1>
          {onModeChange && (
            <ModeToggle mode={mode} onModeChange={onModeChange} />
          )}
        </div>
        <div className="flex items-center gap-2">
          {feeTier && (
            <Badge variant="outline" className="gap-1">
              <span>⭐</span>
              {feeTier.name} ({feeTier.feePercent}% fee)
            </Badge>
          )}
          {onToggleChart && (
            <Button variant="ghost" size="sm" onClick={onToggleChart}>
              {showChart ? '📉 Hide Chart' : '📈 Show Chart'}
            </Button>
          )}
          {renderSettings?.()}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`grid gap-6 ${showChart && renderChart ? 'lg:grid-cols-2' : 'max-w-lg mx-auto'}`}>
        {/* Chart Panel */}
        {showChart && renderChart && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span>📊</span>
                Price Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        )}
        
        {/* Swap/Bridge Form */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span>{mode === 'swap' ? '🔄' : '🌉'}</span>
              {mode === 'swap' ? 'Swap Tokens' : 'Bridge Tokens'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderForm ? renderForm() : (
              <DefaultForm
                mode={mode}
                fromChain={fromChain}
                toChain={toChain}
                fromToken={fromToken}
                toToken={toToken}
                inputAmount={inputAmount}
                onInputAmountChange={onInputAmountChange}
                quote={quote}
                status={status}
                onSwapChains={onSwapChains}
                onExecute={onExecute}
                isConnected={isConnected}
                renderConnectButton={renderConnectButton}
                renderTokenSelector={renderTokenSelector}
                renderChainSelector={renderChainSelector}
              />
            )}
            
            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                ⚠️ {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction History */}
      {renderHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <span>📜</span>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderHistory()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ExchangePageTemplate;
