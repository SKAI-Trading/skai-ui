/**
 * Buy Page Template
 * 
 * Fiat on-ramp page with:
 * - Thirdweb Pay integration placeholder
 * - Amount input
 * - Token selection
 * - Payment method selection
 * - Transaction status
 * 
 * @example
 * ```tsx
 * <BuyPageTemplate
 *   selectedToken={token}
 *   amount={amount}
 *   paymentMethods={methods}
 *   onAmountChange={setAmount}
 *   renderPayWidget={() => <ThirdwebPay />}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Label } from "../components/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface BuyToken {
  symbol: string;
  name: string;
  icon?: React.ReactNode;
  price: number;
  network: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: React.ReactNode;
  type: "card" | "bank" | "crypto" | "wallet";
  fee: number;
  minAmount?: number;
  maxAmount?: number;
  isAvailable: boolean;
}

export interface TransactionQuote {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toToken: string;
  fee: number;
  rate: number;
  expiresIn: number;
}

export interface BuyPageTemplateProps {
  /** Available tokens to buy */
  tokens: BuyToken[];
  /** Selected token */
  selectedToken?: BuyToken | null;
  /** Amount to spend (fiat) */
  amount?: string;
  /** Selected payment method */
  selectedPaymentMethod?: string | null;
  /** Available payment methods */
  paymentMethods: PaymentMethod[];
  /** Current quote */
  quote?: TransactionQuote | null;
  /** Loading quote state */
  isLoadingQuote?: boolean;
  /** Processing transaction state */
  isProcessing?: boolean;
  /** Transaction success */
  isSuccess?: boolean;
  /** Transaction hash (on success) */
  txHash?: string;
  /** Error message */
  error?: string | null;
  /** Whether user is connected */
  isConnected?: boolean;
  /** User's wallet address */
  walletAddress?: string;
  /** Token change handler */
  onTokenChange?: (token: BuyToken) => void;
  /** Amount change handler */
  onAmountChange?: (amount: string) => void;
  /** Payment method change handler */
  onPaymentMethodChange?: (methodId: string) => void;
  /** Get quote handler */
  onGetQuote?: () => void;
  /** Buy handler */
  onBuy?: () => void;
  /** Connect handler */
  onConnect?: () => void;
  /** View transaction handler */
  onViewTransaction?: (txHash: string) => void;
  /** Reset handler (after success) */
  onReset?: () => void;
  /** Render Thirdweb Pay widget */
  renderPayWidget?: () => React.ReactNode;
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

interface TokenSelectorProps {
  tokens: BuyToken[];
  selectedToken?: BuyToken | null;
  onSelect?: (token: BuyToken) => void;
}

function TokenSelector({ tokens, selectedToken, onSelect }: TokenSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select Token</Label>
      <Select
        value={selectedToken?.symbol}
        onValueChange={(value) => {
          const token = tokens.find(t => t.symbol === value);
          if (token) onSelect?.(token);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a token">
            {selectedToken && (
              <div className="flex items-center gap-2">
                {selectedToken.icon}
                <span>{selectedToken.symbol}</span>
                <span className="text-muted-foreground">- {selectedToken.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {tokens.map((token) => (
            <SelectItem key={token.symbol} value={token.symbol}>
              <div className="flex items-center gap-2">
                {token.icon}
                <span>{token.symbol}</span>
                <span className="text-muted-foreground">- {token.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface AmountInputProps {
  value?: string;
  onChange?: (value: string) => void;
  tokenSymbol?: string;
  tokenPrice?: number;
}

function AmountInput({ value = "", onChange, tokenSymbol, tokenPrice }: AmountInputProps) {
  const numericValue = parseFloat(value);
  const estimatedTokens = tokenPrice && Number.isFinite(numericValue) && numericValue > 0
    ? (numericValue / tokenPrice).toFixed(4)
    : "0.0000";

  return (
    <div className="space-y-2">
      <Label>Amount (USD)</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          type="number"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="pl-7 text-lg"
        />
      </div>
      {tokenSymbol && tokenPrice && (
        <p className="text-sm text-muted-foreground">
          ≈ {estimatedTokens} {tokenSymbol}
        </p>
      )}
    </div>
  );
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

function PaymentMethods({ methods, selectedId, onSelect }: PaymentMethodsProps) {
  return (
    <div className="space-y-2">
      <Label>Payment Method</Label>
      <div className="grid gap-2">
        {methods.map((method) => (
          <button
            key={method.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-all",
              method.isAvailable 
                ? "hover:border-primary cursor-pointer" 
                : "opacity-50 cursor-not-allowed",
              selectedId === method.id && "border-primary bg-primary/5"
            )}
            onClick={() => method.isAvailable && onSelect?.(method.id)}
            disabled={!method.isAvailable}
          >
            <div className="flex items-center gap-3">
              {method.icon}
              <div className="text-left">
                <p className="font-medium">{method.name}</p>
                <p className="text-xs text-muted-foreground">
                  {method.fee > 0 ? `${method.fee}% fee` : "No fee"}
                </p>
              </div>
            </div>
            {!method.isAvailable && (
              <Badge variant="secondary">Unavailable</Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface QuoteDisplayProps {
  quote: TransactionQuote | null;
  isLoading?: boolean;
}

function QuoteDisplay({ quote, isLoading }: QuoteDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Quote</CardTitle>
        <CardDescription>
          Expires in {quote.expiresIn} seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">You pay</span>
          <span>${quote.fromAmount.toFixed(2)} {quote.fromCurrency}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">You receive</span>
          <span className="font-medium">{quote.toAmount.toFixed(4)} {quote.toToken}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fee</span>
          <span>${quote.fee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Rate</span>
          <span>1 {quote.toToken} = ${quote.rate.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SuccessViewProps {
  txHash: string;
  amount: number;
  token: string;
  onViewTransaction?: (txHash: string) => void;
  onReset?: () => void;
}

function SuccessView({ txHash, amount, token, onViewTransaction, onReset }: SuccessViewProps) {
  return (
    <Card className="text-center py-8">
      <CardContent>
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Purchase Complete!</h2>
        <p className="text-muted-foreground mb-4">
          You received {amount.toFixed(4)} {token}
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => onViewTransaction?.(txHash)}>
            View Transaction
          </Button>
          <Button onClick={onReset}>
            Buy More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function BuyPageTemplate({
  tokens,
  selectedToken,
  amount,
  selectedPaymentMethod,
  paymentMethods,
  quote,
  isLoadingQuote = false,
  isProcessing = false,
  isSuccess = false,
  txHash,
  error,
  isConnected = true,
  walletAddress: _walletAddress,
  onTokenChange,
  onAmountChange,
  onPaymentMethodChange,
  onGetQuote,
  onBuy,
  onConnect,
  onViewTransaction,
  onReset,
  renderPayWidget,
  headerContent,
  footerContent,
  className,
}: BuyPageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  void _walletAddress;

  // Not connected
  if (!isConnected) {
    return (
      <div className={cn("max-w-md mx-auto", className)}>
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to buy crypto
            </p>
            <Button onClick={onConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess && txHash && quote) {
    return (
      <div className={cn("max-w-md mx-auto", className)}>
        <SuccessView
          txHash={txHash}
          amount={quote.toAmount}
          token={quote.toToken}
          onViewTransaction={onViewTransaction}
          onReset={onReset}
        />
      </div>
    );
  }

  // If renderPayWidget is provided, use it (Thirdweb Pay)
  if (renderPayWidget) {
    return (
      <div className={cn("max-w-md mx-auto", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Buy Crypto</CardTitle>
            <CardDescription>
              Purchase cryptocurrency with your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            {headerContent}
            {renderPayWidget()}
            {footerContent}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default form view
  return (
    <div className={cn("max-w-md mx-auto space-y-6", className)}>
      <div>
        <h1 className="text-2xl font-bold">Buy Crypto</h1>
        <p className="text-muted-foreground">
          Purchase cryptocurrency instantly
        </p>
      </div>

      {headerContent}

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Token Selection */}
          <TokenSelector
            tokens={tokens}
            selectedToken={selectedToken}
            onSelect={onTokenChange}
          />

          {/* Amount Input */}
          <AmountInput
            value={amount}
            onChange={onAmountChange}
            tokenSymbol={selectedToken?.symbol}
            tokenPrice={selectedToken?.price}
          />

          {/* Payment Methods */}
          <PaymentMethods
            methods={paymentMethods}
            selectedId={selectedPaymentMethod}
            onSelect={onPaymentMethodChange}
          />

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Quote */}
          <QuoteDisplay quote={quote ?? null} isLoading={isLoadingQuote} />

          {/* Action Button */}
          {quote ? (
            <Button 
              className="w-full" 
              size="lg"
              onClick={onBuy}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Buy ${quote.toAmount.toFixed(4)} ${quote.toToken}`}
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={onGetQuote}
              disabled={!selectedToken || !amount || !selectedPaymentMethod || isLoadingQuote}
            >
              {isLoadingQuote ? "Getting Quote..." : "Get Quote"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <div>
              <p className="font-medium text-sm">Secure Transaction</p>
              <p className="text-xs text-muted-foreground">
                Your payment is processed securely. We never store your card details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {footerContent}
    </div>
  );
}

export default BuyPageTemplate;
