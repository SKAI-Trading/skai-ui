import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { WalletQRCode } from "../data-display/qr-code";

type Chain = "base" | "ethereum";

const USDC_INFO: Record<Chain, { address: string; label: string; decimals: number }> = {
  base: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    label: "sUSDC (Base)",
    decimals: 6,
  },
  ethereum: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    label: "sUSDC (Ethereum)",
    decimals: 6,
  },
};

export interface FundWalletCardProps extends React.HTMLAttributes<HTMLDivElement> {
  walletAddress?: string | null;
  onChainChange?: (chain: Chain) => void;
}

const FundWalletCard = React.forwardRef<HTMLDivElement, FundWalletCardProps>(
  ({ walletAddress, onChainChange, className, ...props }, ref) => {
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
        <h3 className="font-manrope font-medium text-white text-[16px] md:text-[18px] lg:text-[20px] leading-[22px] tracking-[-0.64px] mb-[4px]">
          Fund Your Wallet
        </h3>
        <p className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] lg:text-[13px] leading-[16px] mb-[12px]">
          Deposit sUSDC to earn 1 SKAI Point per sUSDC
        </p>

        {/* Chain toggle */}
        <div className="flex gap-2 mb-[16px]">
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
            <div className="flex justify-center mb-[12px]">
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

            {/* sUSDC info */}
            <div className="flex flex-col gap-[4px] px-[8px]">
              <span className="font-manrope font-normal text-[#8B9E9D] text-[10px] md:text-[11px] leading-[14px]">
                {usdc.label} · {usdc.decimals} decimals
              </span>
              <span className="font-manrope font-normal text-[#2DEDAD] text-[11px] md:text-[12px] leading-[16px]">
                1 SKAI Point per $1 sUSDC
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-[24px] gap-[8px]">
            <span className="font-manrope font-normal text-[#8B9E9D] text-[13px] md:text-[14px] leading-[18px] text-center">
              Loading your wallet address...
            </span>
            <span className="font-manrope font-normal text-[#56C7F3] text-[11px] md:text-[12px] leading-[16px]">
              {usdc.label} · 1 SKAI Point per $1 sUSDC
            </span>
          </div>
        )}
      </div>
    );
  },
);
FundWalletCard.displayName = "FundWalletCard";

export { FundWalletCard };
