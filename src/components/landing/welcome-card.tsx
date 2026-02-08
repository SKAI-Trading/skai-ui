import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";

const d = content.landing.waitlist.dashboard;

const DEFAULT_LAUNCH_WORDS = ["Trade", "Predict", "Play", "SKAI Agent"];

export interface WelcomeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  isLoading?: boolean;
  subtitle?: string;
  launchWords?: string[];
  comingSoonLabel?: string;
  skaiPoints?: number | null;
}

const WelcomeCard = React.forwardRef<HTMLDivElement, WelcomeCardProps>(
  (
    {
      username,
      isLoading = false,
      subtitle = d.checkEmail,
      launchWords = DEFAULT_LAUNCH_WORDS,
      comingSoonLabel = d.comingSoon,
      skaiPoints,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
      if (launchWords.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => (prev + 1) % launchWords.length);
      }, 2000);
      return () => clearInterval(interval);
    }, [launchWords.length]);

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
        {typeof skaiPoints === "number" && (
          <div className="flex items-baseline gap-[6px] mb-[16px]">
            <span className="font-manrope font-light text-[#17F9B4] text-[24px] md:text-[28px] lg:text-[36px] leading-[28px] md:leading-[32px] lg:leading-[40px] tracking-[-0.96px]">
              {skaiPoints.toLocaleString()}
            </span>
            <span className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[13px] lg:text-[15px] leading-[14px] md:leading-[16px] lg:leading-[18px]">
              SKAI Points
            </span>
          </div>
        )}
        <button
          type="button"
          disabled
          className="w-full py-[12px] px-[16px] rounded-[12px] bg-[#001615] border-none font-manrope font-normal text-[14px] md:text-[16px] leading-[20px] cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
        >
          <span className="font-manrope font-normal text-[#123F3C] text-[12px] leading-[16px] md:text-[14px] md:leading-[18px] lg:text-[16px] lg:leading-[22px] inline-block min-w-[80px] transition-opacity duration-300">
            {launchWords[currentWordIndex]}
          </span>
          <span className="bg-[#122524] px-[8px] py-[2px] rounded-full font-manrope font-normal text-[#56C7F3] text-[8px] leading-[10px] lg:text-[11px] lg:leading-[14px]">
            {comingSoonLabel}
          </span>
        </button>
      </div>
    );
  },
);
WelcomeCard.displayName = "WelcomeCard";

export { WelcomeCard };
