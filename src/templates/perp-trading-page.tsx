/**
 * Perp Trading Page Template
 * 
 * Perpetual futures trading interface with:
 * - Long/Short position entry
 * - Leverage selection
 * - Margin type selection
 * - Position management
 * - Funding rates display
 * - Liquidation price calculator
 * 
 * @example
 * ```tsx
 * <PerpTradingPageTemplate
 *   market={selectedMarket}
 *   positions={userPositions}
 *   leverage={leverage}
 *   onPlaceOrder={handleOrder}
 *   renderChart={() => <PriceChart />}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent } from "../components/core/card";
import { Input } from "../components/core/input";
import { Label } from "../components/core/label";
import { Slider } from "../components/forms/slider";
import { Tabs, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export type OrderSide = "long" | "short";
export type OrderType = "market" | "limit" | "stop";
export type MarginType = "isolated" | "cross";

export interface PerpMarket {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  markPrice: number;
  indexPrice: number;
  fundingRate: number;
  nextFundingTime: string;
  volume24h: number;
  openInterest: number;
  maxLeverage: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  size: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  margin: number;
  leverage: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  marginType: MarginType;
}

export interface PerpTradingPageTemplateProps {
  /** Current market */
  market: PerpMarket | null;
  /** User's open positions */
  positions: Position[];
  /** Selected order side */
  orderSide?: OrderSide;
  /** Selected order type */
  orderType?: OrderType;
  /** Selected margin type */
  marginType?: MarginType;
  /** Leverage value (1-100) */
  leverage?: number;
  /** Size input value */
  size?: string;
  /** Price input value (for limit orders) */
  price?: string;
  /** Available margin/balance */
  availableMargin?: number;
  /** Calculated liquidation price */
  estimatedLiquidationPrice?: number;
  /** Estimated PnL at entry */
  estimatedFee?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Processing order state */
  isProcessing?: boolean;
  /** Whether user is connected */
  isConnected?: boolean;
  /** Error message */
  error?: string | null;
  /** Order side change handler */
  onOrderSideChange?: (side: OrderSide) => void;
  /** Order type change handler */
  onOrderTypeChange?: (type: OrderType) => void;
  /** Margin type change handler */
  onMarginTypeChange?: (type: MarginType) => void;
  /** Leverage change handler */
  onLeverageChange?: (leverage: number) => void;
  /** Size change handler */
  onSizeChange?: (size: string) => void;
  /** Price change handler */
  onPriceChange?: (price: string) => void;
  /** Place order handler */
  onPlaceOrder?: () => void;
  /** Close position handler */
  onClosePosition?: (positionId: string) => void;
  /** Edit position handler */
  onEditPosition?: (positionId: string) => void;
  /** Connect wallet handler */
  onConnect?: () => void;
  /** Render price chart */
  renderChart?: () => React.ReactNode;
  /** Render order book */
  renderOrderBook?: () => React.ReactNode;
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

interface MarketInfoProps {
  market: PerpMarket | null;
  isLoading?: boolean;
}

function MarketInfo({ market, isLoading }: MarketInfoProps) {
  if (isLoading || !market) {
    return (
      <div className="flex items-center gap-6 p-4 border-b">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 p-4 border-b overflow-x-auto">
      <div>
        <h2 className="text-lg font-bold">{market.symbol}</h2>
        <span className="text-xs text-muted-foreground">Perpetual</span>
      </div>
      
      <div>
        <p className="text-xl font-bold">${market.markPrice.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">Mark Price</p>
      </div>

      <div>
        <p className={cn(
          "text-sm font-medium",
          market.fundingRate >= 0 ? "text-green-500" : "text-red-500"
        )}>
          {market.fundingRate >= 0 ? "+" : ""}{(market.fundingRate * 100).toFixed(4)}%
        </p>
        <p className="text-xs text-muted-foreground">Funding Rate</p>
      </div>

      <div>
        <p className="text-sm">${(market.volume24h / 1_000_000).toFixed(2)}M</p>
        <p className="text-xs text-muted-foreground">24h Volume</p>
      </div>

      <div>
        <p className="text-sm">${(market.openInterest / 1_000_000).toFixed(2)}M</p>
        <p className="text-xs text-muted-foreground">Open Interest</p>
      </div>
    </div>
  );
}

interface OrderFormProps {
  orderSide?: OrderSide;
  orderType?: OrderType;
  marginType?: MarginType;
  leverage?: number;
  size?: string;
  price?: string;
  availableMargin?: number;
  maxLeverage?: number;
  estimatedLiquidationPrice?: number;
  estimatedFee?: number;
  isProcessing?: boolean;
  error?: string | null;
  onOrderSideChange?: (side: OrderSide) => void;
  onOrderTypeChange?: (type: OrderType) => void;
  onMarginTypeChange?: (type: MarginType) => void;
  onLeverageChange?: (leverage: number) => void;
  onSizeChange?: (size: string) => void;
  onPriceChange?: (price: string) => void;
  onPlaceOrder?: () => void;
}

function OrderForm({
  orderSide = "long",
  orderType = "market",
  marginType = "cross",
  leverage = 10,
  size = "",
  price = "",
  availableMargin = 0,
  maxLeverage = 100,
  estimatedLiquidationPrice,
  estimatedFee,
  isProcessing,
  error,
  onOrderSideChange,
  onOrderTypeChange,
  onMarginTypeChange,
  onLeverageChange,
  onSizeChange,
  onPriceChange,
  onPlaceOrder,
}: OrderFormProps) {
  return (
    <div className="space-y-4">
      {/* Long/Short Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={orderSide === "long" ? "default" : "outline"}
          className={cn(orderSide === "long" && "bg-green-500 hover:bg-green-600")}
          onClick={() => onOrderSideChange?.("long")}
        >
          Long
        </Button>
        <Button
          variant={orderSide === "short" ? "default" : "outline"}
          className={cn(orderSide === "short" && "bg-red-500 hover:bg-red-600")}
          onClick={() => onOrderSideChange?.("short")}
        >
          Short
        </Button>
      </div>

      {/* Order Type */}
      <Tabs value={orderType} onValueChange={onOrderTypeChange as (value: string) => void}>
        <TabsList className="w-full">
          <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
          <TabsTrigger value="limit" className="flex-1">Limit</TabsTrigger>
          <TabsTrigger value="stop" className="flex-1">Stop</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Margin Type */}
      <div className="flex gap-2">
        <Button
          variant={marginType === "cross" ? "default" : "outline"}
          size="sm"
          onClick={() => onMarginTypeChange?.("cross")}
        >
          Cross
        </Button>
        <Button
          variant={marginType === "isolated" ? "default" : "outline"}
          size="sm"
          onClick={() => onMarginTypeChange?.("isolated")}
        >
          Isolated
        </Button>
      </div>

      {/* Leverage Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Leverage</Label>
          <span className="font-medium">{leverage}x</span>
        </div>
        <Slider
          value={[leverage]}
          onValueChange={([value]) => onLeverageChange?.(value)}
          min={1}
          max={maxLeverage}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1x</span>
          <span>{maxLeverage}x</span>
        </div>
      </div>

      {/* Size Input */}
      <div className="space-y-2">
        <Label>Size (USD)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={size}
          onChange={(e) => onSizeChange?.(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Available: ${availableMargin.toFixed(2)}
        </p>
      </div>

      {/* Price Input (for limit orders) */}
      {orderType !== "market" && (
        <div className="space-y-2">
          <Label>{orderType === "stop" ? "Stop Price" : "Limit Price"}</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => onPriceChange?.(e.target.value)}
          />
        </div>
      )}

      {/* Estimates */}
      <div className="space-y-2 p-3 rounded-lg bg-muted/50">
        {estimatedLiquidationPrice !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Liq. Price</span>
            <span className="text-red-500">${estimatedLiquidationPrice.toFixed(2)}</span>
          </div>
        )}
        {estimatedFee !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Fee</span>
            <span>${estimatedFee.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Place Order Button */}
      <Button
        className={cn(
          "w-full",
          orderSide === "long" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
        )}
        size="lg"
        onClick={onPlaceOrder}
        disabled={isProcessing || !size}
      >
        {isProcessing 
          ? "Processing..." 
          : `${orderSide === "long" ? "Long" : "Short"} ${orderType.charAt(0).toUpperCase() + orderType.slice(1)}`
        }
      </Button>
    </div>
  );
}

interface PositionsListProps {
  positions: Position[];
  onClose?: (positionId: string) => void;
  onEdit?: (positionId: string) => void;
}

function PositionsList({ positions, onClose, onEdit }: PositionsListProps) {
  if (positions.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No open positions
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Symbol</th>
            <th className="text-right py-2">Size</th>
            <th className="text-right py-2">Entry</th>
            <th className="text-right py-2">Mark</th>
            <th className="text-right py-2">PnL</th>
            <th className="text-right py-2">Liq. Price</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id} className="border-b last:border-0">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <Badge variant={position.side === "long" ? "default" : "destructive"}>
                    {position.side.toUpperCase()}
                  </Badge>
                  <span>{position.symbol}</span>
                  <span className="text-muted-foreground">{position.leverage}x</span>
                </div>
              </td>
              <td className="text-right py-3">${position.size.toFixed(2)}</td>
              <td className="text-right py-3">${position.entryPrice.toFixed(2)}</td>
              <td className="text-right py-3">${position.markPrice.toFixed(2)}</td>
              <td className={cn(
                "text-right py-3",
                position.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500"
              )}>
                ${position.unrealizedPnl.toFixed(2)} ({position.unrealizedPnlPercent.toFixed(2)}%)
              </td>
              <td className="text-right py-3 text-red-500">
                ${position.liquidationPrice.toFixed(2)}
              </td>
              <td className="text-right py-3">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(position.id)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onClose?.(position.id)}>
                    Close
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function PerpTradingPageTemplate({
  market,
  positions,
  orderSide = "long",
  orderType = "market",
  marginType = "cross",
  leverage = 10,
  size,
  price,
  availableMargin = 0,
  estimatedLiquidationPrice,
  estimatedFee,
  isLoading = false,
  isProcessing = false,
  isConnected = true,
  error,
  onOrderSideChange,
  onOrderTypeChange,
  onMarginTypeChange,
  onLeverageChange,
  onSizeChange,
  onPriceChange,
  onPlaceOrder,
  onClosePosition,
  onEditPosition,
  onConnect,
  renderChart,
  renderOrderBook,
  headerContent,
  footerContent,
  className,
}: PerpTradingPageTemplateProps) {
  // Not connected
  if (!isConnected) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to start trading perpetuals
            </p>
            <Button onClick={onConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {/* Market Info Bar */}
      <MarketInfo market={market} isLoading={isLoading} />

      {headerContent}

      {/* Main Trading Interface */}
      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        {/* Chart and Positions */}
        <div className="border-r">
          {/* Chart */}
          <div className="h-[400px] border-b">
            {renderChart ? renderChart() : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Price Chart
              </div>
            )}
          </div>

          {/* Positions */}
          <div className="p-4">
            <h3 className="font-bold mb-4">Positions</h3>
            <PositionsList
              positions={positions}
              onClose={onClosePosition}
              onEdit={onEditPosition}
            />
          </div>
        </div>

        {/* Order Form & Order Book */}
        <div>
          {/* Order Form */}
          <div className="p-4 border-b">
            <OrderForm
              orderSide={orderSide}
              orderType={orderType}
              marginType={marginType}
              leverage={leverage}
              size={size}
              price={price}
              availableMargin={availableMargin}
              maxLeverage={market?.maxLeverage}
              estimatedLiquidationPrice={estimatedLiquidationPrice}
              estimatedFee={estimatedFee}
              isProcessing={isProcessing}
              error={error}
              onOrderSideChange={onOrderSideChange}
              onOrderTypeChange={onOrderTypeChange}
              onMarginTypeChange={onMarginTypeChange}
              onLeverageChange={onLeverageChange}
              onSizeChange={onSizeChange}
              onPriceChange={onPriceChange}
              onPlaceOrder={onPlaceOrder}
            />
          </div>

          {/* Order Book */}
          <div className="p-4">
            <h3 className="font-bold mb-4">Order Book</h3>
            {renderOrderBook ? renderOrderBook() : (
              <div className="h-48 flex items-center justify-center text-muted-foreground border rounded-lg">
                Order Book
              </div>
            )}
          </div>
        </div>
      </div>

      {footerContent}
    </div>
  );
}

export default PerpTradingPageTemplate;
