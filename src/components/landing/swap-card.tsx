import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

export interface SwapCardProps extends React.HTMLAttributes<HTMLDivElement> {
  usdcBalance?: number | null;
  onBack?: () => void;
  walletAppUrl?: string;
}

const SwapCard = React.forwardRef<HTMLDivElement, SwapCardProps>(
  (
    {
      usdcBalance,
      onBack,
      walletAppUrl = "https://wallet.skai.trade",
      className,
      ...props
    },
    ref,
  ) => {
    const hasBalance = typeof usdcBalance === "number" && usdcBalance > 0;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#123F3C] flex flex-col gap-[16px] rounded-lg p-[16px] relative",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-[8px]">
          {onBack && (
            <button
              type="button"
              title="Back"
              onClick={onBack}
              className="w-7 h-7 rounded-md bg-[#001615]/40 text-[#95A09F] flex items-center justify-center hover:bg-[#001615]/60 hover:text-[#56C7F3] transition-colors"
            >
              <SkaiIcon name="back" size="xs" />
            </button>
          )}
          <SkaiIcon name="swap" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            Swap
          </p>
        </div>

        {/* Swap preview */}
        <div className="flex flex-col gap-[8px]">
          {/* From */}
          <div className="flex items-center justify-between bg-[#001615]/50 rounded-lg px-[14px] py-[12px] border border-[#95A09F]/15">
            <div className="flex flex-col gap-[2px]">
              <span className="font-['Manrope',sans-serif] font-normal text-[10px] leading-[14px] text-[#95A09F]">
                From
              </span>
              <span className="font-['Manrope',sans-serif] font-medium text-[16px] leading-[20px] text-white">
                USDC
              </span>
            </div>
            {hasBalance && (
              <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F]">
                {usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available
              </span>
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center -my-[4px] relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#123F3C] border border-[#95A09F]/15 flex items-center justify-center">
              <SkaiIcon name="arrow-down" size="xs" className="text-[#56C7F3]" />
            </div>
          </div>

          {/* To */}
          <div className="flex items-center justify-between bg-[#001615]/50 rounded-lg px-[14px] py-[12px] border border-[#95A09F]/15">
            <div className="flex flex-col gap-[2px]">
              <span className="font-['Manrope',sans-serif] font-normal text-[10px] leading-[14px] text-[#95A09F]">
                To
              </span>
              <span className="font-['Manrope',sans-serif] font-medium text-[16px] leading-[20px] text-white">
                ETH, WETH, DAI...
              </span>
            </div>
          </div>
        </div>

        {/* Deposit incentive */}
        {!hasBalance && (
          <div className="flex items-start gap-[8px] bg-[#001615]/40 rounded-lg px-[12px] py-[10px]">
            <SkaiIcon name="info" size="xs" className="text-[#2DEDAD] flex-shrink-0 mt-0.5" />
            <p className="font-['Manrope',sans-serif] font-normal text-[12px] leading-[16px] text-[#95A09F]">
              Deposit USDC to start swapping. Earn <span className="text-[#2DEDAD] font-medium">1 SKAI Point per $1 USDC</span> deposited.
            </p>
          </div>
        )}

        {/* CTA → wallet.skai.trade */}
        <a
          href={walletAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-[12px] rounded-[10px] font-['Manrope',sans-serif] font-medium text-[14px] leading-[18px] bg-[#56C7F3] text-[#001615] hover:bg-[#2DEDAD] transition-all duration-200 text-center flex items-center justify-center gap-[8px]"
        >
          {hasBalance ? "Swap on SKAI Wallet" : "Deposit & Start Swapping"}
          <SkaiIcon name="external-link" size="xs" className="text-[#001615]" />
        </a>
      </div>
    );
  },
);
SwapCard.displayName = "SwapCard";

export { SwapCard };
