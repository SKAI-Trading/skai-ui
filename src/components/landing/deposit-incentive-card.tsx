import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";
import { WalletQRCode } from "../data-display/qr-code";

type Chain = "base" | "ethereum";

const USDC_INFO: Record<Chain, { address: string; label: string; decimals: number }> = {
  base: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    label: "sUSD (Base)",
    decimals: 6,
  },
  ethereum: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    label: "sUSD (Ethereum)",
    decimals: 6,
  },
};

export interface DepositIncentiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** User wallet address for QR code */
  walletAddress?: string | null;
  /** Current SKAI Points balance */
  skaiPoints?: number | null;
  /** Whether user has already claimed the one-time deposit reward */
  hasClaimedDeposit?: boolean;
  /** Callback when chain is changed */
  onChainChange?: (chain: Chain) => void;
  /** Callback when user wants to proceed to AI tools */
  onContinueToAI?: () => void;
}

const DepositIncentiveCard = React.forwardRef<HTMLDivElement, DepositIncentiveCardProps>(
  ({ walletAddress, skaiPoints, hasClaimedDeposit, onChainChange, onContinueToAI, className, ...props }, ref) => {
    const [selectedChain, setSelectedChain] = useState<Chain>("base");

    const handleChainChange = (chain: Chain) => {
      setSelectedChain(chain);
      onChainChange?.(chain);
    };

    const usdc = USDC_INFO[selectedChain];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-[16px] rounded-2xl border border-[#123F3C] bg-[#0D3331]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-[8px] mb-[4px]">
          <SkaiIcon name="wallet" size="sm" className="text-[#2DEDAD] flex-shrink-0" />
          <h3 className="font-manrope font-medium text-white text-[16px] md:text-[18px] lg:text-[20px] leading-[22px] tracking-[-0.64px]">
            Deposit & Earn
          </h3>
        </div>

        <p className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] lg:text-[13px] leading-[16px] mb-[12px]">
          {hasClaimedDeposit
            ? "Deposit sUSD to fund your wallet and unlock AI trading tools"
            : "Deposit sUSD to earn SKAI Points and unlock AI trading tools"}
        </p>

        {/* One-time deposit reward banner — only if not yet claimed */}
        {!hasClaimedDeposit && (
          <div className="flex items-center gap-[8px] mb-[12px] px-[12px] py-[10px] rounded-lg bg-[#0D3D3A]/60 border border-[#2DEDAD]/15">
            <span className="font-manrope font-bold text-[#2DEDAD] text-[18px]">1:1</span>
            <div className="flex flex-col gap-[1px]">
              <span className="font-manrope font-medium text-[#E0E0E0] text-[12px] leading-[16px]">
                1 SKAI Point for every sUSD on your first deposit
              </span>
              <span className="font-manrope font-normal text-[#8B9E9D] text-[10px] leading-[14px]">
                One-time reward &middot; sUSD on Base only
              </span>
            </div>
          </div>
        )}

        {/* Chain toggle */}
        <div className="flex gap-2 mb-[12px]">
          {(["base", "ethereum"] as const).map((chain) => (
            <button
              key={chain}
              type="button"
              onClick={() => handleChainChange(chain)}
              className={cn(
                "flex-1 py-[8px] px-[12px] rounded-[8px] font-manrope font-medium text-[12px] md:text-[13px] leading-[16px] transition-all duration-200",
                selectedChain === chain
                  ? "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/30"
                  : "bg-[#001615] text-[#8B9E9D] border border-transparent hover:border-[rgba(255,255,255,0.1)]",
              )}
            >
              {chain === "base" ? "Base" : "Ethereum"}
            </button>
          ))}
        </div>

        {walletAddress ? (
          <>
            {/* QR Code */}
            <div className="flex justify-center mb-[8px]">
              <WalletQRCode
                address={walletAddress}
                chainName={selectedChain === "base" ? "Base" : "Ethereum"}
                showAddress
                showCopy
                size={140}
                bordered={false}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            {/* sUSD info */}
            <div className="flex flex-col gap-[4px] px-[8px] mb-[12px]">
              <span className="font-manrope font-normal text-[#8B9E9D] text-[10px] md:text-[11px] leading-[14px]">
                {usdc.label} · {usdc.decimals} decimals
              </span>
              <span className="font-manrope font-normal text-[#2DEDAD] text-[11px] md:text-[12px] leading-[16px]">
                Send sUSD to this address to get started
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-[24px] gap-[8px] mb-[12px]">
            <div className="w-6 h-6 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin" />
            <span className="font-manrope font-normal text-[#8B9E9D] text-[13px] md:text-[14px] leading-[18px] text-center">
              Loading your wallet address...
            </span>
          </div>
        )}

        {/* CTA to continue to AI tools */}
        {onContinueToAI && (
          <button
            type="button"
            onClick={onContinueToAI}
            className="w-full py-[12px] rounded-[10px] font-manrope font-medium text-[14px] leading-[18px] bg-[#56C7F3] text-[#001615] hover:bg-[#2DEDAD] transition-all duration-200 text-center flex items-center justify-center gap-[8px]"
          >
            <SkaiIcon name="wallet" size="xs" className="text-[#001615]" />
            Go to Wallet
          </button>
        )}
      </div>
    );
  },
);
DepositIncentiveCard.displayName = "DepositIncentiveCard";

export { DepositIncentiveCard };
