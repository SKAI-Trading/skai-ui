import * as React from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";
import { assets } from "../../lib/assets";

const d = content.landing.waitlist.dashboard;

export interface BadgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeName: string;
  badgeSubtitle: string;
  badgePoints: number;
  badgeIcon?: string;
  statusLabel?: string;
}

const BadgeCard = React.forwardRef<HTMLDivElement, BadgeCardProps>(
  (
    {
      badgeName,
      badgeSubtitle,
      badgePoints,
      badgeIcon = assets.badges.pioneer,
      statusLabel = d.badge.status,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-center gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-[33px] rounded-[24px] border border-[#123F3C] bg-[#122524] relative",
        className,
      )}
      {...props}
    >
      {/* Badge Icon */}
      <div className="flex-shrink-0">
        <img
          src={badgeIcon}
          alt={badgeName}
          className="w-12 h-12 md:w-[80px] md:h-[80px] lg:w-[150px] lg:h-[150px] object-contain"
        />
      </div>

      <div className="flex md:flex-col justify-between lg:gap-4 gap-2 w-full">
        {/* Text */}
        <div className="flex flex-col flex-1 justify-center min-w-0">
          <h3 className="font-manrope font-light text-white text-[16px] leading-[18px] md:text-[18px] md:leading-[22px] lg:text-[24px] lg:leading-[28px] tracking-[-0.72px] md:tracking-[-0.8px] lg:tracking-[-0.96px] mb-[4px]">
            {badgeName}
          </h3>
          <p className="font-manrope font-normal text-[#E0E0E0] text-[12px] md:text-[14px] leading-[16px] md:leading-[20px]">
            {badgeSubtitle}
          </p>
        </div>

        {/* Reward and Status */}
        <div className="flex flex-col md:flex-row items-end gap-[6px] md:gap-[10px] flex-shrink-0">
          <span className="font-manrope font-normal text-[#2DEDAD] text-[14px] md:text-[16px] lg:text-[22px] leading-[18px] md:leading-[20px] lg:leading-[26px] whitespace-nowrap">
            +{badgePoints} SKAI Points
          </span>
          <span className="font-manrope text-[10px] md:text-[8px] lg:text-[11px] leading-[12px] md:leading-[10px] lg:leading-[14px] px-[8px] md:px-[8px] lg:px-[12px] py-[3px] md:py-[2px] lg:py-[4px] rounded-[8px] bg-[#2DEDAD] text-[#001615] whitespace-nowrap">
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  ),
);
BadgeCard.displayName = "BadgeCard";

export { BadgeCard };
