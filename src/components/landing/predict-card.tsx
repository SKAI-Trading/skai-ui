import * as React from "react";
import { cn } from "../../lib/utils";

export interface PredictCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const PredictCard = React.forwardRef<HTMLDivElement, PredictCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col p-[16px] rounded-2xl border border-[#123F3C] bg-[#0D3331] overflow-hidden",
          className,
        )}
        {...props}
      >
        {/* Preview content (blurred behind overlay) */}
        <div className="select-none pointer-events-none blur-[2px] opacity-50">
          <div className="flex items-center justify-between mb-[12px]">
            <h3 className="font-manrope font-medium text-white text-[16px] md:text-[18px] lg:text-[20px] leading-[22px] tracking-[-0.64px]">
              Prediction Markets
            </h3>
            <span className="font-manrope font-normal text-[#8B9E9D] text-[12px] md:text-[13px] leading-[16px]">
              Wager SKAI Points
            </span>
          </div>

          {/* Mock market rows */}
          <div className="flex flex-col gap-[10px]">
            {[
              { q: "BTC above $100K by March?", yes: 72, no: 28 },
              { q: "ETH flips SOL market cap?", yes: 18, no: 82 },
              { q: "Fed cuts rates in Q2?", yes: 61, no: 39 },
            ].map((m) => (
              <div
                key={m.q}
                className="flex items-center gap-[8px] p-[10px] rounded-[10px] bg-[#001615] border border-[rgba(255,255,255,0.05)]"
              >
                <span className="flex-1 font-manrope font-normal text-white text-[12px] md:text-[13px] leading-[16px]">
                  {m.q}
                </span>
                <span className="font-manrope font-medium text-[#2DEDAD] text-[12px] md:text-[13px] leading-[16px] w-[48px] text-right">
                  {m.yes}% Yes
                </span>
                <span className="font-manrope font-medium text-[#F04438] text-[12px] md:text-[13px] leading-[16px] w-[44px] text-right">
                  {m.no}% No
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#001615]/70 backdrop-blur-[1px] rounded-2xl">
          <span className="font-manrope font-bold text-white text-[18px] md:text-[20px] lg:text-[22px] leading-[26px] tracking-[-0.4px] mb-[6px]">
            Coming Soon
          </span>
          <span className="font-manrope font-normal text-[#8B9E9D] text-[12px] md:text-[13px] leading-[16px] text-center max-w-[260px]">
            Predict crypto, macro, and world events using SKAI Points
          </span>
        </div>
      </div>
    );
  },
);
PredictCard.displayName = "PredictCard";

export { PredictCard };
