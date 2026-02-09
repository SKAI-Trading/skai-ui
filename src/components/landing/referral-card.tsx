import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";
import { urls } from "../../lib/constants";
import { SkaiIcon } from "../branding/skai-icon";

const d = content.landing.waitlist.dashboard;

export interface ReferralCardProps extends React.HTMLAttributes<HTMLDivElement> {
  referralLink: string;
  referralPoints: number;
  shareTweetPoints: number;
  hasClaimedToday?: boolean;
  isLoadingUser?: boolean;
  onShareToX?: () => void;
  discordUrl?: string;
  title?: string;
  referralCount?: number | null;
}

const ReferralCard = React.forwardRef<HTMLDivElement, ReferralCardProps>(
  (
    {
      referralLink,
      referralPoints,
      shareTweetPoints,
      hasClaimedToday = false,
      isLoadingUser = false,
      onShareToX,
      discordUrl = urls.social.discord,
      title = d.referral.title,
      referralCount,
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(`https://${referralLink}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#122524] border border-[#123F3C] rounded-[32px] p-6",
          className,
        )}
        {...props}
      >
        <h3 className="font-manrope font-light text-white text-[16px] leading-[18px] md:text-[18px] lg:text-[24px] md:leading-[22px] lg:leading-[28px] tracking-[-0.72px] md:tracking-[-0.8px] lg:tracking-[-0.96px] mb-[8px]">
          {title}
        </h3>
        <p className="font-manrope font-normal text-[#E0E0E0] text-[10px] leading-[20px] md:text-[12px] md:leading-[16px] lg:text-[14px] lg:leading-[18px] mb-6">
          Earn {referralPoints} SKAI Points for each friend that joins.
          {typeof referralCount === "number" && referralCount > 0 && (
            <span className="text-[#17F9B4]"> You've referred {referralCount} friend{referralCount !== 1 ? "s" : ""}!</span>
          )}
        </p>

        {/* Referral Link Label */}
        <label className="block font-manrope font-normal text-white text-[12px] lg:text-[14px] leading-[16px] lg:leading-[18px] mb-[8px]">
          {d.referral.linkLabel}
        </label>

        {/* Referral Link Input */}
        <div className="flex items-center mb-6 rounded-[12px] border border-[#56C7F3] bg-[#001615] overflow-hidden">
          <span className="font-manrope font-normal text-white text-[14px] md:text-[16px] leading-[20px] md:leading-[22px] flex-1 px-[22px] py-4 truncate">
            {referralLink}
          </span>
          <div className="h-[20px] w-[1px] bg-[rgba(255,255,255,0.1)]" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={isLoadingUser}
            className={cn(
              "px-[16px] py-[12px] font-manrope font-normal text-[14px] md:text-[16px] leading-[20px] md:leading-[22px] transition-all whitespace-nowrap flex items-center gap-[8px] border-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
              copied ? "text-[#17F9B4]" : "text-[#56C7F3]",
            )}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                {content.global.actions.copied}
              </>
            ) : (
              <>
                <SkaiIcon name="copy" size="sm" />
                {d.referral.copyButton}
              </>
            )}
          </button>
        </div>

        {/* Claim Points Label */}
        <div className="flex items-center gap-[8px] mb-[10px]">
          <span className="font-manrope font-normal text-[#17F9B4] text-[12px] lg:text-[14px] leading-[16px] lg:leading-[18px]">
            {hasClaimedToday
              ? `+${shareTweetPoints} SKAI Points claimed`
              : `Claim ${shareTweetPoints} SKAI Points`}
          </span>
        </div>

        {/* Share on X Button */}
        <button
          type="button"
          onClick={onShareToX}
          className="w-full py-[16px] px-[16px] rounded-[12px] bg-[#0a2a2e] hover:bg-[#0d3538] transition-all font-manrope font-normal text-[14px] md:text-[16px] leading-[20px] md:leading-[22px] flex items-center justify-center gap-[10px] mb-4 border-[1.5px] border-[#56C7F3] text-[#56C7F3] shadow-[0_0_12px_rgba(86,199,243,0.15)]"
        >
          <SkaiIcon name="x" size="sm" />
          <span>Share With Friends</span>
        </button>

        {/* Discord Button */}
        <button
          type="button"
          onClick={() => window.open(discordUrl, "_blank")}
          className="w-full py-[21px] px-[16px] rounded-[12px] font-manrope font-normal text-[14px] md:text-[16px] leading-[20px] md:leading-[22px] flex items-center justify-center gap-[8px] transition-all bg-[#56C7F3] text-[#001615] border-none"
        >
          <SkaiIcon name="discord" size="sm" className="w-5 h-5" />
          Join Skai Community
        </button>
      </div>
    );
  },
);
ReferralCard.displayName = "ReferralCard";

export { ReferralCard };
