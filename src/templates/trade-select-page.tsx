/**
 * Trade Select Page Template
 * 
 * Trade type selection with tier-gated access:
 * - Basic swap trading (all users)
 * - Pro trading features (tier-gated)
 * - Perpetual trading (tier-gated)
 * - Feature comparison
 * 
 * @example
 * ```tsx
 * <TradeSelectPageTemplate
 *   userTier="Silver"
 *   hasProAccess={true}
 *   hasPerpsAccess={false}
 *   onSelectMode={handleSelect}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Progress } from "../components/feedback/progress";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface TradingMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  features: string[];
  requiredTier?: string;
  isLocked?: boolean;
  isComingSoon?: boolean;
  badge?: string;
}

export interface TierInfo {
  name: string;
  color: string;
  icon?: React.ReactNode;
  minPoints: number;
}

export interface TradeSelectPageTemplateProps {
  /** Available trading modes */
  tradingModes: TradingMode[];
  /** User's current tier */
  userTier: string;
  /** User's current points */
  userPoints: number;
  /** Points needed for Pro access */
  pointsToProAccess?: number;
  /** Points needed for Perps access */
  pointsToPerpsAccess?: number;
  /** Whether user has Pro access */
  hasProAccess: boolean;
  /** Whether user has Perps access */
  hasPerpsAccess: boolean;
  /** Tier configurations */
  tierConfigs?: TierInfo[];
  /** Loading state */
  isLoading?: boolean;
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Select trading mode handler */
  onSelectMode?: (mode: TradingMode) => void;
  /** Upgrade tier handler */
  onUpgradeTier?: () => void;
  /** Connect wallet handler */
  onConnect?: () => void;
  /** View rewards handler */
  onViewRewards?: () => void;
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

interface TierProgressProps {
  currentTier: string;
  currentPoints: number;
  pointsToNext?: number;
  nextTierName?: string;
}

function TierProgress({ currentTier, currentPoints, pointsToNext, nextTierName }: TierProgressProps) {
  const progressPercent = pointsToNext && pointsToNext > 0 
    ? Math.min(100, (currentPoints / (currentPoints + pointsToNext)) * 100)
    : 100;

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Tier</p>
            <p className="text-xl font-bold">{currentTier}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">SKAI Points</p>
            <p className="text-xl font-bold">{currentPoints.toLocaleString()}</p>
          </div>
        </div>
        
        {pointsToNext && pointsToNext > 0 && nextTierName && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextTierName}</span>
              <span>{pointsToNext.toLocaleString()} points needed</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TradingModeCardProps {
  mode: TradingMode;
  isLocked: boolean;
  onSelect?: () => void;
  onUpgrade?: () => void;
}

function TradingModeCard({ mode, isLocked, onSelect, onUpgrade }: TradingModeCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all",
      isLocked && "opacity-75",
      mode.isComingSoon && "opacity-60",
      !isLocked && !mode.isComingSoon && "hover:border-primary hover:shadow-lg"
    )}>
      {/* Badge */}
      {mode.badge && (
        <div className="absolute top-2 right-2">
          <Badge variant={mode.isComingSoon ? "secondary" : "default"}>
            {mode.badge}
          </Badge>
        </div>
      )}

      {/* Lock Overlay */}
      {isLocked && !mode.isComingSoon && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm font-medium">Requires {mode.requiredTier} Tier</p>
            <Button size="sm" className="mt-2" onClick={onUpgrade}>
              Upgrade
            </Button>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            {mode.icon}
          </div>
          <div>
            <CardTitle>{mode.title}</CardTitle>
            <CardDescription>{mode.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        <ul className="space-y-2">
          {mode.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Button
          className="w-full"
          variant={mode.isComingSoon ? "secondary" : "default"}
          disabled={isLocked || mode.isComingSoon}
          onClick={onSelect}
        >
          {mode.isComingSoon 
            ? "Coming Soon" 
            : isLocked 
            ? `Unlock with ${mode.requiredTier}`
            : `Start ${mode.title}`
          }
        </Button>
      </CardContent>
    </Card>
  );
}

interface FeatureComparisonProps {
  modes: TradingMode[];
}

function FeatureComparison({ modes }: FeatureComparisonProps) {
  // Get all unique features
  const allFeatures = Array.from(new Set(modes.flatMap(m => m.features)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
        <CardDescription>Compare features across trading modes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Feature</th>
                {modes.map((mode) => (
                  <th key={mode.id} className="text-center py-2 px-4">
                    {mode.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-2 pr-4 text-muted-foreground">{feature}</td>
                  {modes.map((mode) => (
                    <td key={mode.id} className="text-center py-2 px-4">
                      {mode.features.includes(feature) ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function TradeSelectPageTemplate({
  tradingModes,
  userTier,
  userPoints,
  pointsToProAccess,
  pointsToPerpsAccess,
  hasProAccess,
  hasPerpsAccess,
  tierConfigs: _tierConfigs,
  isLoading = false,
  isAuthenticated = true,
  onSelectMode,
  onUpgradeTier,
  onConnect,
  onViewRewards,
  headerContent,
  footerContent,
  className,
}: TradeSelectPageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  void _tierConfigs;

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Connect to Trade</h2>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to access trading features
            </p>
            <Button onClick={onConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Determine lock status for each mode
  const modesWithLockStatus = tradingModes.map(mode => ({
    ...mode,
    isLocked: mode.requiredTier ? (
      mode.requiredTier === "Silver" ? !hasProAccess :
      mode.requiredTier === "Gold" ? !hasPerpsAccess :
      false
    ) : false,
  }));

  // Get next tier info
  const nextTier = !hasProAccess ? "Silver" : !hasPerpsAccess ? "Gold" : null;
  const pointsToNext = !hasProAccess ? pointsToProAccess : !hasPerpsAccess ? pointsToPerpsAccess : undefined;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Choose Your Trading Mode</h1>
        <p className="text-muted-foreground">
          Select a trading mode based on your experience and goals
        </p>
      </div>

      {headerContent}

      {/* Tier Progress */}
      <TierProgress
        currentTier={userTier}
        currentPoints={userPoints}
        pointsToNext={pointsToNext}
        nextTierName={nextTier || undefined}
      />

      {/* Trading Modes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modesWithLockStatus.map((mode) => (
          <TradingModeCard
            key={mode.id}
            mode={mode}
            isLocked={mode.isLocked || false}
            onSelect={() => onSelectMode?.(mode)}
            onUpgrade={onUpgradeTier}
          />
        ))}
      </div>

      {/* Feature Comparison */}
      <FeatureComparison modes={tradingModes} />

      {/* Upgrade CTA */}
      {(!hasProAccess || !hasPerpsAccess) && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">Unlock More Features</h3>
                <p className="text-sm text-muted-foreground">
                  Earn SKAI points to unlock advanced trading modes
                </p>
              </div>
              <div className="flex gap-2">
                {onViewRewards && (
                  <Button variant="outline" onClick={onViewRewards}>
                    View Rewards
                  </Button>
                )}
                {onUpgradeTier && (
                  <Button onClick={onUpgradeTier}>
                    Upgrade Tier
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {footerContent}
    </div>
  );
}

export default TradeSelectPageTemplate;
