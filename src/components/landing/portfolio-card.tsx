import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

export interface PortfolioCardProps extends React.HTMLAttributes<HTMLDivElement> {
  walletAddress?: string | null;
  usdcBalance?: number | null;
  onBack?: () => void;
  walletAppUrl?: string;
}

const PortfolioCard = React.forwardRef<HTMLDivElement, PortfolioCardProps>(
  (
    {
      walletAddress,
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
          <SkaiIcon name="wallet" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            Portfolio
          </p>
        </div>

        {/* Balance display */}
        {hasBalance ? (
          <div className="flex flex-col gap-[4px] bg-[#001615]/40 rounded-lg px-[14px] py-[12px]">
            <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F]">
              USDC Balance
            </span>
            <span className="font-['Manrope',sans-serif] font-light text-[28px] leading-[32px] tracking-[-1.12px] text-white">
              ${usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#2DEDAD]">
              Earning 1 SKAI Point per $1 USDC deposited
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[10px] bg-[#001615]/40 rounded-lg px-[14px] py-[20px]">
            <SkaiIcon name="wallet" size="md" className="text-[#95A09F]/50" />
            <p className="font-['Manrope',sans-serif] font-normal text-[13px] leading-[18px] text-[#95A09F] text-center">
              Deposit USDC to start earning SKAI Points
            </p>
            <span className="font-['Manrope',sans-serif] font-medium text-[12px] leading-[16px] text-[#2DEDAD]">
              1 SKAI Point per $1 USDC
            </span>
          </div>
        )}

        {/* Wallet address */}
        {walletAddress && (
          <div className="flex items-center gap-[6px] px-[4px]">
            <span className="font-['Manrope',sans-serif] font-normal text-[10px] leading-[14px] text-[#95A09F] truncate">
              {walletAddress}
            </span>
          </div>
        )}

        {/* CTA → wallet.skai.trade */}
        <a
          href={walletAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-[12px] rounded-[10px] font-['Manrope',sans-serif] font-medium text-[14px] leading-[18px] bg-[#56C7F3] text-[#001615] hover:bg-[#2DEDAD] transition-all duration-200 text-center flex items-center justify-center gap-[8px]"
        >
          {hasBalance ? "View Full Portfolio" : "Deposit & Earn Points"}
          <SkaiIcon name="external-link" size="xs" className="text-[#001615]" />
        </a>
      </div>
    );
  },
);
PortfolioCard.displayName = "PortfolioCard";

export { PortfolioCard };
