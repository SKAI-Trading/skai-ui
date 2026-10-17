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
  discordConnectPoints?: number;
  hasClaimedToday?: boolean;
  isLoadingUser?: boolean;
  onShareToX?: () => void;
  discordUrl?: string;
  title?: string;
  referralCount?: number | null;
  onDiscordConnect?: () => void;
  discordHandle?: string | null;
  twitterHandle?: string | null;
}

const ReferralCard = React.forwardRef<HTMLDivElement, ReferralCardProps>(
  (
    {
      referralLink,
      referralPoints,
      shareTweetPoints,
      // Discord signup incentive defaults to 0 (hidden). Callers must
      // explicitly opt in by passing discordConnectPoints > 0 to show the
      // "Claim X SKAI Points" incentive text. The "Join Skai Community"
      // button itself is always visible — it's a link to the Discord
      // server, not a signup path. Per 2026-04-16: signup removed from
      // landing dashboard; only /verify role-gate uses Discord OAuth.
      discordConnectPoints = 0,
      hasClaimedToday = false,
      isLoadingUser = false,
      onShareToX,
      discordUrl = urls.social.discord,
      title = d.referral.title,
      referralCount,
      onDiscordConnect,
      discordHandle,
      twitterHandle,
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    // The dashboard boards draw the card as four stacked groups in Green Coal
    // 200 on a Green Coal 100 line, with their shadow. Per width:
    //   375 (2424:7715)   343x288, r20, padding 8, groups 16 apart; the text
    //                     lines sit a further 8 in, the boxes and button do not
    //   768 (2424:4081)   352x332, r18, padding 16, groups 22 apart
    //   1440 (2422:2943)  448x394, r32, padding 24, groups 24 apart
    // The link box is Green Coal 300 on a Green Coal 100 line (54 / 50 / 44
    // tall), the share box the same on Sky Blue, and the Discord button
    // Button/large in Sky Blue (64 / 54 / 44).
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4 md:gap-[22px] lg:gap-6 rounded-[20px] md:rounded-[18px] lg:rounded-[32px] ring-1 ring-inset ring-green-coal-100 bg-green-coal-200 shadow-[0_10px_80px_rgba(0,0,0,0.3)] p-2 md:p-4 lg:p-6",
          className,
        )}
        {...props}
      >
        <div data-testid="referral-card-content" className="flex flex-col gap-1 lg:gap-2 px-2 pt-2 md:p-0">
          <h3 className="font-manrope text-white text-sub-1-mobile md:text-sub-1-tablet lg:text-sub-1">
            {title}
          </h3>
          <p className="font-manrope text-skai-gray-100 text-para-2-mobile md:text-para-2-tablet lg:text-para-2">
            {/* Not "for each friend that joins": Casey ruled on 2026-09-22 that a
                sign-up earns nothing, and the referral pays on the friend's first
                deposit or trade (qualify_referral). */}
            Earn{" "}
            <span className="text-alien-green-bright lg:font-numbers">{referralPoints} SKAI Points</span>{" "}
            for each friend who makes their first deposit or trade.
            {typeof referralCount === "number" && referralCount > 0 && (
              <span className="text-[#2DEDAD]"> You've referred {referralCount} friend{referralCount !== 1 ? "s" : ""}!</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="block font-manrope text-white text-para-2-tablet lg:text-para-2 px-2 md:px-0">
            {d.referral.linkLabel}
          </label>

          <div
            data-testid="referral-card-link"
            className="flex items-center justify-between gap-2 rounded-xl lg:rounded-2xl ring-1 ring-inset ring-green-coal-100 bg-green-coal-300 p-[14px] md:p-4 lg:px-[22px] overflow-hidden"
          >
            <span className="min-w-0 flex-1 truncate font-manrope text-white text-para-1-mobile font-bold md:font-normal md:text-para-1-tablet lg:text-para-1">
              {referralLink}
            </span>
            {/* The negative margins hand the button the box's whole height and
                right edge to tap, without moving the drawn COPY. */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoadingUser}
              className={cn(
                "-my-[14px] -mr-[14px] py-[14px] pr-[14px] md:-my-4 md:-mr-4 md:py-4 md:pr-4 lg:-mr-[22px] lg:pr-[22px] flex shrink-0 items-center gap-1 lg:gap-2 whitespace-nowrap border-none bg-transparent font-manrope text-para-1-mobile font-bold md:font-normal md:text-para-2-tablet lg:text-para-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                copied ? "text-[#2DEDAD]" : "text-sky-blue",
              )}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {content.global.actions.copied}
                </>
              ) : (
                <>
                  <SkaiIcon name="copy" size="sm" className="w-3 h-3 lg:w-4 lg:h-4" />
                  {d.referral.copyButton}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Points incentive */}
          {!hasClaimedToday && shareTweetPoints > 0 && !twitterHandle && (
            <p className="font-manrope text-white text-para-2-tablet lg:text-para-2 px-2 md:px-0">
              Claim <span className="text-alien-green-bright">{shareTweetPoints} SKAI Points</span>
            </p>
          )}

          <button
            type="button"
            onClick={onShareToX}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl lg:rounded-2xl p-3 lg:px-[22px] lg:py-4 font-manrope text-para-1-mobile font-bold md:font-normal md:text-para-2-tablet lg:text-para-2 transition-all",
              twitterHandle
                ? "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/30"
                : "bg-green-coal-300 hover:bg-[#0d3538] ring-1 ring-inset ring-sky-blue lg:ring-[1.5px] text-sky-blue",
            )}
          >
            <SkaiIcon name="x" size="sm" />
            <span>{twitterHandle ? `@${twitterHandle} connected` : "Share With Friends"}</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Discord points incentive */}
          {discordConnectPoints > 0 && !discordHandle && (
            <p className="font-manrope text-white text-para-2-tablet lg:text-para-2 px-2 md:px-0">
              Claim <span className="text-alien-green-bright">{discordConnectPoints} SKAI Points</span>
            </p>
          )}

          <button
            type="button"
            onClick={() => window.open(discordUrl, "_blank")}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl lg:rounded-2xl px-6 lg:px-10 py-[14px] md:py-[18px] lg:py-5 font-manrope text-para-1-mobile font-bold md:font-normal md:text-para-1-tablet lg:text-para-1 transition-all border-none",
              discordHandle
                ? "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/30"
                : "bg-sky-blue text-green-coal-300",
            )}
          >
            <SkaiIcon name="discord" size="sm" className="w-4 h-4 lg:w-6 lg:h-6" />
            {discordHandle ? `${discordHandle} connected` : "Join Skai Community"}
          </button>
        </div>
      </div>
    );
  },
);
ReferralCard.displayName = "ReferralCard";

export { ReferralCard };
