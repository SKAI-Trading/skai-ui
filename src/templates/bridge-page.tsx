/**
 * BridgePageTemplate - Cross-Chain Token Bridging Page
 *
 * Pure presentational component for cross-chain bridging UI.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - Chain selection (from/to)
 * - Token selection
 * - Amount input with max button
 * - Fee display
 * - Estimated receive amount
 * - Estimated time
 * - Bridge execution status
 * - Transaction hash link
 * - Loading states
 * - Not connected state
 *
 * @module templates/bridge-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/core/card";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";
import { Label } from "../components/core/label";
import { Badge } from "../components/core/badge";
import { Skeleton } from "../components/feedback/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import { Alert, AlertDescription, AlertTitle } from "../components/feedback/alert";

// ============================================================================
// ICON COMPONENTS (inline SVGs for independence)
// ============================================================================

const Icons = {
  ArrowRightLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  ),
  ArrowDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  ),
  Loader2: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Info: (props: React.SVGProps<SVGSVGElement>) => (
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
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  ExternalLink: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
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
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => (
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
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
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
      <polyline points="12 6 12 12 16 14" />
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
};

// ============================================================================
// TYPES
// ============================================================================

export interface BridgeChain {
  id: number;
  name: string;
  symbol: string;
  icon?: string;
  color?: string;
}

export interface BridgeToken {
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
}

export type BridgeStatus =
  | "idle"
  | "quoting"
  | "approving"
  | "bridging"
  | "success"
  | "error";

/** Status of a pending timelock withdrawal for the track-withdrawal feature */
export interface TimelockDisplayInfo {
  requestId: number;
  tokenSymbol: string;
  amount: string;
  status: "pending" | "ready" | "executed" | "cancelled";
  remainingSeconds: number;
  destChainId: number;
}

export interface BridgePageTemplateProps {
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Connect wallet callback */
  onConnect: () => void;
  /** Available chains */
  chains: BridgeChain[];
  /** Available tokens */
  tokens: BridgeToken[];
  /** Selected source chain */
  fromChain: BridgeChain;
  /** Selected destination chain */
  toChain: BridgeChain;
  /** Selected token */
  selectedToken: BridgeToken;
  /** Bridge amount */
  amount: string;
  /** Wallet balance */
  balance?: string;
  /** Whether balance is loading */
  balanceLoading?: boolean;
  /** Estimated receive amount */
  estimatedReceive?: string | null;
  /** Bridge fee amount */
  bridgeFee?: string | null;
  /** Bridge fee percentage */
  bridgeFeePercent?: number;
  /** Estimated bridge time */
  estimatedTime?: string | null;
  /** Bridge status */
  status: BridgeStatus;
  /** Transaction hash */
  txHash?: string | null;
  /** Explorer URL for transaction */
  txExplorerUrl?: string | null;
  /** Error message */
  error?: string | null;
  /** Chain change handlers */
  onFromChainChange: (chainId: string) => void;
  onToChainChange: (chainId: string) => void;
  /** Token change handler */
  onTokenChange: (symbol: string) => void;
  /** Amount change handler */
  onAmountChange: (amount: string) => void;
  /** Swap chains handler */
  onSwapChains: () => void;
  /** Max button handler */
  onMaxAmount: () => void;
  /** Bridge execution handler */
  onBridge: () => void;
  /** Reset handler */
  onReset?: () => void;
  /** Optional class name */
  className?: string;

  // ── Extended props for full bridge info (Task 16, 17, 18) ──

  /** Whether the bridge contract is paused */
  bridgePaused?: boolean;
  /** Whether the relayer is healthy */
  relayerHealthy?: boolean;
  /** Whether bridge status data is loading */
  bridgeStatusLoading?: boolean;
  /** Per-transaction limit in human-readable form (e.g. "100 ETH") */
  maxPerTxDisplay?: string | null;
  /** Remaining daily volume for the selected token */
  remainingDailyVolumeDisplay?: string | null;
  /** Pending timelock withdrawals for the user (Task 18) */
  pendingTimelocks?: TimelockDisplayInfo[];
  /** Callback when user wants to execute a ready timelock */
  onExecuteTimelock?: (requestId: number) => void;
  /** Callback when user wants to cancel a pending timelock */
  onCancelTimelock?: (requestId: number) => void;
}

// ============================================================================
// SKELETON
// ============================================================================

export function BridgePageSkeleton() {
  return (
    <div className="container mx-auto max-w-xl py-8">
      <Skeleton className="mx-auto mb-8 h-12 w-48" />
      <Skeleton className="h-[500px] rounded-xl" />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Format seconds into a human-readable countdown string.
 */
function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "Ready";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function BridgePageTemplate({
  isConnected,
  onConnect,
  chains,
  tokens,
  fromChain,
  toChain,
  selectedToken,
  amount,
  balance,
  balanceLoading,
  estimatedReceive,
  bridgeFee,
  bridgeFeePercent = 0.1,
  estimatedTime,
  status,
  txHash,
  txExplorerUrl,
  error,
  onFromChainChange,
  onToChainChange,
  onTokenChange,
  onAmountChange,
  onSwapChains,
  onMaxAmount,
  onBridge,
  onReset,
  className,
  // Extended props
  bridgePaused,
  relayerHealthy,
  bridgeStatusLoading,
  maxPerTxDisplay,
  remainingDailyVolumeDisplay,
  pendingTimelocks,
  onExecuteTimelock,
  onCancelTimelock,
}: BridgePageTemplateProps) {
  const isLoading =
    status === "quoting" || status === "approving" || status === "bridging";
  const isSuccess = status === "success";
  const isError = status === "error";
  const isBridgeDisabled = bridgePaused || relayerHealthy === false;

  return (
    <div className={cn("container mx-auto max-w-xl px-4 py-8", className)}>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Icons.ArrowRightLeft className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Bridge</h1>
        </div>
        <p className="text-muted-foreground">
          Transfer tokens across chains seamlessly
        </p>
      </div>

      {/* Bridge Status Loading (Task 17) */}
      {bridgeStatusLoading && (
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Icons.Loader2 className="h-4 w-4 animate-spin" />
          Loading bridge status...
        </div>
      )}

      {/* Bridge Paused Warning (Task 16) */}
      {bridgePaused && (
        <Alert variant="destructive" className="mb-4">
          <Icons.AlertCircle className="h-4 w-4" />
          <AlertTitle>Bridge Paused</AlertTitle>
          <AlertDescription>
            The bridge is currently paused for maintenance. Please check back later.
          </AlertDescription>
        </Alert>
      )}

      {/* Relayer Down Warning (Task 15, 17) */}
      {relayerHealthy === false && !bridgePaused && (
        <Alert className="mb-4 border-yellow-500/30 bg-yellow-500/10">
          <Icons.AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-500">Relayer Offline</AlertTitle>
          <AlertDescription>
            The bridge relayer is not responding. Deposits may not be processed
            until the relayer is restored.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cross-Chain Bridge</span>
            <div className="flex items-center gap-2">
              {relayerHealthy !== undefined && (
                <Badge
                  variant="outline"
                  className={cn(
                    "font-normal",
                    relayerHealthy ? "border-green-500/30 text-green-500" : "border-red-500/30 text-red-500"
                  )}
                >
                  {relayerHealthy ? "Online" : "Offline"}
                </Badge>
              )}
              <Badge variant="outline" className="font-normal">
                {bridgeFeePercent}% Fee
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Bridge your tokens between supported networks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Chain */}
          <div className="space-y-2">
            <Label>From Network</Label>
            <Select
              value={fromChain.id.toString()}
              onValueChange={onFromChainChange}
              disabled={isLoading || isBridgeDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source chain" />
              </SelectTrigger>
              <SelectContent>
                {chains.map((chain) => (
                  <SelectItem
                    key={chain.id}
                    value={chain.id.toString()}
                    disabled={chain.id === toChain.id}
                  >
                    <div className="flex items-center gap-2">
                      {chain.icon && <span>{chain.icon}</span>}
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={onSwapChains}
              disabled={isLoading || isBridgeDisabled}
              className="rounded-full"
            >
              <Icons.ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Chain */}
          <div className="space-y-2">
            <Label>To Network</Label>
            <Select
              value={toChain.id.toString()}
              onValueChange={onToChainChange}
              disabled={isLoading || isBridgeDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent>
                {chains.map((chain) => (
                  <SelectItem
                    key={chain.id}
                    value={chain.id.toString()}
                    disabled={chain.id === fromChain.id}
                  >
                    <div className="flex items-center gap-2">
                      {chain.icon && <span>{chain.icon}</span>}
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Token Selection */}
          <div className="space-y-2">
            <Label>Token</Label>
            <Select
              value={selectedToken.symbol}
              onValueChange={onTokenChange}
              disabled={isLoading || isBridgeDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <div className="flex items-center gap-2">
                      {token.icon && <span>{token.icon}</span>}
                      <span>
                        {token.symbol} - {token.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Amount</Label>
              <span className="text-sm text-muted-foreground">
                Balance:{" "}
                {balanceLoading ? (
                  <Skeleton className="inline-block h-4 w-16" />
                ) : (
                  `${balance || "0"} ${selectedToken.symbol}`
                )}
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onAmountChange(e.target.value)
                }
                disabled={isLoading || isBridgeDisabled}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={onMaxAmount}
                disabled={isLoading || !balance || isBridgeDisabled}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Bridge Limits Display (Task 16) */}
          {(maxPerTxDisplay || remainingDailyVolumeDisplay) && (
            <div className="space-y-1 text-xs text-muted-foreground">
              {maxPerTxDisplay && (
                <div className="flex justify-between">
                  <span>Max per transaction</span>
                  <span>{maxPerTxDisplay}</span>
                </div>
              )}
              {remainingDailyVolumeDisplay && (
                <div className="flex justify-between">
                  <span>Remaining daily limit</span>
                  <span>{remainingDailyVolumeDisplay}</span>
                </div>
              )}
            </div>
          )}

          {/* Estimate Details */}
          {estimatedReceive && (
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You will receive</span>
                <span className="font-medium">
                  ~{estimatedReceive} {selectedToken.symbol}
                </span>
              </div>
              {bridgeFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bridge fee</span>
                  <span>
                    {bridgeFee} {selectedToken.symbol}
                  </span>
                </div>
              )}
              {estimatedTime && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Icons.Clock className="h-3 w-3" />
                    Estimated time
                  </span>
                  <span>{estimatedTime}</span>
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <Alert className="border-green-500/30 bg-green-500/10">
              <Icons.CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Bridge Successful!</AlertTitle>
              <AlertDescription>
                Your tokens are being bridged. This may take a few minutes.
                {txHash && txExplorerUrl && (
                  <a
                    href={txExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-green-500 hover:underline"
                  >
                    View on explorer
                    <Icons.ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Error State (Task 17) */}
          {isError && error && (
            <Alert variant="destructive">
              <Icons.AlertCircle className="h-4 w-4" />
              <AlertTitle>Bridge Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {!isConnected ? (
            <Button onClick={onConnect} className="w-full" size="lg">
              <Icons.Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          ) : isSuccess && onReset ? (
            <Button onClick={onReset} className="w-full" size="lg">
              <Icons.RefreshCw className="mr-2 h-4 w-4" />
              Bridge Again
            </Button>
          ) : (
            <Button
              onClick={onBridge}
              disabled={isLoading || !amount || parseFloat(amount) <= 0 || isBridgeDisabled}
              className="w-full"
              size="lg"
            >
              {bridgePaused ? (
                "Bridge Paused"
              ) : status === "quoting" ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Quote...
                </>
              ) : status === "approving" ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : status === "bridging" ? (
                <>
                  <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bridging...
                </>
              ) : (
                <>
                  <Icons.ArrowRightLeft className="mr-2 h-4 w-4" />
                  Bridge Tokens
                </>
              )}
            </Button>
          )}

          {/* Info Note */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Icons.Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Bridge transactions are final. Please verify the destination chain and
              amount before confirming. A {bridgeFeePercent}% platform fee applies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Timelock Withdrawals (Task 18) */}
      {pendingTimelocks && pendingTimelocks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icons.Clock className="h-5 w-5" />
              Pending Withdrawals
            </CardTitle>
            <CardDescription>
              Large withdrawals are held in a timelock for security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTimelocks.map((tl) => (
              <div
                key={tl.requestId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {tl.amount} {tl.tokenSymbol}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        tl.status === "ready"
                          ? "border-green-500/30 text-green-500"
                          : tl.status === "pending"
                          ? "border-yellow-500/30 text-yellow-500"
                          : tl.status === "executed"
                          ? "border-blue-500/30 text-blue-500"
                          : "border-red-500/30 text-red-500"
                      )}
                    >
                      {tl.status === "pending"
                        ? `Unlocks in ${formatCountdown(tl.remainingSeconds)}`
                        : tl.status === "ready"
                        ? "Ready to execute"
                        : tl.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {tl.status === "ready" && onExecuteTimelock && (
                    <Button
                      size="sm"
                      onClick={() => onExecuteTimelock(tl.requestId)}
                    >
                      Execute
                    </Button>
                  )}
                  {(tl.status === "pending" || tl.status === "ready") && onCancelTimelock && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCancelTimelock(tl.requestId)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BridgePageTemplate;
