import * as React from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";

const d = content.landing.waitlist.dashboard;

export type DashboardTab = "trade" | "play" | "predict";

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
}

const TAB_LABELS: Record<DashboardTab, string> = {
  trade: "Trade",
  play: "Play",
  predict: "Predict",
};

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
      className,
      ...props
    },
    ref,
  ) => {

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col justify-center px-8 py-[33px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]",
          className,
        )}
        {...props}
      >
        <h2 className="font-manrope font-light text-white text-[20px] md:text-[24px] lg:text-[32px] leading-[24px] md:leading-[28px] lg:leading-[36px] tracking-[-0.8px] md:tracking-[-0.96px] lg:tracking-[-1.28px] mb-[8px]">
          Welcome,{" "}
          <span className="text-[#56C7F3]">
            {isLoading ? "..." : username}
          </span>
          !
        </h2>
        <p className="font-manrope font-normal text-[#E0E0E0] text-[10px] md:text-[12px] lg:text-[14px] leading-[14px] md:leading-[16px] lg:leading-[18px] tracking-[-0.4px] md:tracking-[-0.48px] lg:tracking-[-0.56px] mb-[8px]">
          {subtitle}
        </p>

        {/* Connected accounts & stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-[8px]">
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
          <div className="flex items-baseline gap-[6px] mb-[16px]">
            <span className="font-manrope font-light text-[#2DEDAD] text-[24px] md:text-[28px] lg:text-[36px] leading-[28px] md:leading-[32px] lg:leading-[40px] tracking-[-0.96px]">
              {skaiPoints.toLocaleString()}
            </span>
            <span className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[13px] lg:text-[15px] leading-[14px] md:leading-[16px] lg:leading-[18px]">
              SKAI Points
            </span>
          </div>
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
