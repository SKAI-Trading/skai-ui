import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";

const d = content.landing.waitlist.dashboard;

export type DashboardTab = "trade" | "play" | "predict";

/** Tier-specific gradient and text colors (matches main app TierProgressCard) */
const TIER_COLORS: Record<string, { from: string; to: string; text: string }> = {
  standard: { from: "#64748b", to: "#94a3b8", text: "#94a3b8" },
  bronze:   { from: "#92400e", to: "#b45309", text: "#b45309" },
  silver:   { from: "#6b7280", to: "#9ca3af", text: "#9ca3af" },
  gold:     { from: "#ca8a04", to: "#eab308", text: "#eab308" },
  platinum: { from: "#cbd5e1", to: "#e2e8f0", text: "#e2e8f0" },
  diamond:  { from: "#06b6d4", to: "#22d3ee", text: "#22d3ee" },
};

const DEFAULT_TIER_COLOR = TIER_COLORS.standard;

/** All tier definitions with point thresholds and rewards */
const ALL_TIERS = [
  { key: "standard", name: "Standard", min: 0,       rewards: ["All 20+ games", "AI chat (25/day)", "Welcome bonus"] },
  { key: "bronze",   name: "Bronze",   min: 1_000,   rewards: ["5% fee cashback", "Daily login bonus", "AI chat (50/day)"] },
  { key: "silver",   name: "Silver",   min: 5_000,   rewards: ["10% fee discount", "1.2× points", "Whale alerts"] },
  { key: "gold",     name: "Gold",     min: 25_000,  rewards: ["15% fee discount", "GPT-4.1 AI (100/day)", "Real-time signals"] },
  { key: "platinum", name: "Platinum", min: 100_000, rewards: ["20% fee discount", "1.5× points", "Booster events"] },
  { key: "diamond",  name: "Diamond",  min: 500_000, rewards: ["30% fee discount", "Premium AI (250/day)", "15s price updates"] },
] as const;

function formatPts(n: number): string {
  if (n === 0) return "0";
  return n >= 1_000 ? `${n / 1_000}K` : String(n);
}

export interface WelcomeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  isLoading?: boolean;
  subtitle?: string;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
  skaiPoints?: number | null;
  twitterHandle?: string | null;
  referralCount?: number | null;
  email?: string | null;
  /** Current tier name (e.g. "Standard", "Bronze", "Gold") */
  currentTierName?: string;
  /** Next tier name to reach (null if at max) */
  nextTierName?: string | null;
  /** Points required for the next tier */
  nextTierPoints?: number | null;
  /** Progress fraction 0-1 toward next tier */
  tierProgress?: number | null;
}

const TAB_LABELS: Record<DashboardTab, string> = {
  trade: "Trade",
  play: "Play",
  predict: "Predict",
};

/** Compact tier roadmap with selectable tiers showing rewards */
function TierRoadmap({ currentTierKey, currentPoints }: { currentTierKey: string; currentPoints: number }) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const activeKey = selectedKey ?? currentTierKey;
  const activeTier = ALL_TIERS.find((t) => t.key === activeKey) ?? ALL_TIERS[0];
  const activeColor = TIER_COLORS[activeKey] ?? DEFAULT_TIER_COLOR;
  const isUnlocked = currentPoints >= activeTier.min;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {/* Tier pills */}
      <div className="flex gap-1">
        {ALL_TIERS.map((tier) => {
          const color = TIER_COLORS[tier.key] ?? DEFAULT_TIER_COLOR;
          const unlocked = currentPoints >= tier.min;
          const isCurrent = tier.key === currentTierKey;
          const isActive = tier.key === activeKey;

          return (
            <button
              key={tier.key}
              type="button"
              onClick={() => setSelectedKey(tier.key === selectedKey ? null : tier.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-[2px] py-[6px] px-1 rounded-md transition-all text-center border",
                isActive
                  ? "border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)]"
                  : "border-transparent hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.02)]",
                isCurrent && "ring-1 ring-[rgba(255,255,255,0.12)]",
              )}
            >
              <div
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{ backgroundColor: unlocked ? color.to : "rgba(139,158,157,0.3)" }}
              />
              <span
                className="font-manrope font-medium text-[8px] md:text-[9px] leading-tight truncate w-full"
                style={{ color: unlocked ? color.text : "#5A7170" }}
              >
                {tier.name}
              </span>
              <span className="font-manrope text-[7px] md:text-[8px] text-[#5A7170] leading-tight">
                {formatPts(tier.min)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rewards for selected/active tier */}
      <div
        className="flex items-center gap-3 px-3 py-[6px] rounded-lg border transition-all"
        style={{
          borderColor: `${activeColor.to}22`,
          backgroundColor: `${activeColor.to}08`,
        }}
      >
        <div className="flex flex-col gap-[1px] min-w-0 flex-1">
          <div className="flex items-center gap-1.5 justify-between">
            <span
              className="font-manrope font-semibold text-[10px] md:text-[11px]"
              style={{ color: activeColor.text }}
            >
              {activeTier.name} Rewards
            </span>
            {isUnlocked ? (
              <span className="font-manrope text-[9px] md:text-[10px] text-[#2DEDAD] font-medium">✓ Unlocked</span>
            ) : (
              <span className="font-manrope text-[9px] md:text-[10px] text-[#5A7170]">
                {formatPts(activeTier.min)} pts required
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-[2px]">
            {activeTier.rewards.map((r: string, i: number) => (
              <span
                key={i}
                className="font-manrope text-[8px] md:text-[9px] text-[#95A09F]"
              >
                • {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const WelcomeCard = React.forwardRef<HTMLDivElement, WelcomeCardProps>(
  (
    {
      username,
      isLoading = false,
      subtitle = d.checkEmail,
      activeTab = "trade",
      onTabChange,
      skaiPoints,
      twitterHandle,
      referralCount,
      email,
      currentTierName,
      nextTierName,
      nextTierPoints,
      tierProgress,
      className,
      ...props
    },
    ref,
  ) => {
    const tierKey = currentTierName?.toLowerCase() ?? "standard";
    const tierColor = TIER_COLORS[tierKey] ?? DEFAULT_TIER_COLOR;
    const progressPct = tierProgress != null ? Math.min(Math.max(tierProgress * 100, 0), 100) : 0;
    const showTier = currentTierName != null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col justify-center px-8 py-[33px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]",
          className,
        )}
        {...props}
      >
        <h2 className="font-manrope font-light text-white text-[20px] md:text-[24px] lg:text-[32px] leading-[24px] md:leading-[28px] lg:leading-[36px] tracking-[-0.8px] md:tracking-[-0.96px] lg:tracking-[-1.28px] mb-[12px]">
          Welcome,{" "}
          <span className="text-[#56C7F3]">
            {isLoading ? "..." : username}
          </span>
          !
        </h2>
        <p className="font-manrope font-normal text-[#E0E0E0] text-[10px] md:text-[12px] lg:text-[14px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-[-0.4px] md:tracking-[-0.48px] lg:tracking-[-0.56px] mb-[6px]">
          {subtitle}
        </p>

        {/* Connected accounts & stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-[14px]">
          {twitterHandle && (
            <span className="flex items-center gap-[5px] font-manrope font-normal text-[#56C7F3] text-[11px] md:text-[12px] lg:text-[13px] leading-[16px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @{twitterHandle}
            </span>
          )}
          {typeof referralCount === "number" && referralCount > 0 && (
            <span className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] lg:text-[13px] leading-[16px]">
              {referralCount} referral{referralCount !== 1 ? "s" : ""}
            </span>
          )}
          {email && (
            <span className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] lg:text-[13px] leading-[16px] truncate max-w-[180px]" title={email}>
              {email}
            </span>
          )}
        </div>

        {typeof skaiPoints === "number" && (
          <div className="flex items-baseline gap-[6px] mb-[14px]">
            <span className="font-manrope font-light text-[#2DEDAD] text-[24px] md:text-[28px] lg:text-[36px] leading-[28px] md:leading-[32px] lg:leading-[40px] tracking-[-0.96px]">
              {skaiPoints.toLocaleString()}
            </span>
            <span className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[13px] lg:text-[15px] leading-[14px] md:leading-[16px] lg:leading-[18px]">
              SKAI Points
            </span>
          </div>
        )}

        {/* Tier Progress */}
        {showTier && (
          <div className="flex flex-col gap-[5px] mb-[18px]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-manrope text-[11px] md:text-[12px]">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tierColor.to }}
                />
                <span className="font-medium" style={{ color: tierColor.text }}>
                  {currentTierName}
                </span>
              </span>
              {nextTierName ? (
                <span className="font-manrope text-[11px] md:text-[12px] text-[#95A09F]">
                  Next:{" "}
                  <span className="text-[#E0E0E0] font-medium">
                    {nextTierName}
                  </span>
                </span>
              ) : (
                <span className="font-manrope text-[11px] md:text-[12px] text-[#2DEDAD] font-medium">
                  Max Tier!
                </span>
              )}
            </div>

            <div className="w-full h-[6px] md:h-[8px] rounded-full bg-[#0A1B1A] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${tierColor.from}, ${tierColor.to})`,
                }}
              />
            </div>

            {nextTierName && nextTierPoints != null && typeof skaiPoints === "number" && (
              <div className="flex items-center justify-between">
                <span className="font-manrope text-[10px] md:text-[11px] text-[#95A09F]">
                  <span className="text-[#2DEDAD]">
                    {skaiPoints.toLocaleString()}
                  </span>{" "}
                  / {nextTierPoints.toLocaleString()} pts
                </span>
                <span
                  className="font-manrope text-[10px] md:text-[11px] font-medium"
                  style={{ color: tierColor.text }}
                >
                  {(nextTierPoints - skaiPoints).toLocaleString()} pts to go
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tier Roadmap */}
        {showTier && (
          <TierRoadmap currentTierKey={tierKey} currentPoints={skaiPoints ?? 0} />
        )}

        <div className="flex w-full gap-2">
          {(["trade", "predict", "play"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange?.(tab)}
              className={cn(
                "flex-1 py-[10px] px-[12px] rounded-[10px] font-manrope font-medium text-[12px] md:text-[13px] lg:text-[14px] leading-[16px] transition-all duration-200",
                activeTab === tab
                  ? "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/30 shadow-[0_0_12px_rgba(45,237,173,0.1)]"
                  : "bg-[#001615] text-[#8B9E9D] border border-transparent hover:border-[rgba(255,255,255,0.1)] hover:text-[#B0C4C3]",
              )}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>
    );
  },
);
WelcomeCard.displayName = "WelcomeCard";

export { WelcomeCard };
