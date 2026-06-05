import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

type Chain = "base" | "ethereum";

export interface PortfolioCardProps extends React.HTMLAttributes<HTMLDivElement> {
  walletAddress?: string | null;
  usdcBalance?: number | null;
  /** Whether the user has already claimed the one-time first-deposit reward */
  hasClaimedDeposit?: boolean;
  onBack?: () => void;
  /** Render prop for embedding a Thirdweb PayEmbed or similar widget */
  renderPayWidget?: () => React.ReactNode;
}

const PortfolioCard = React.forwardRef<HTMLDivElement, PortfolioCardProps>(
  (
    {
      walletAddress,
      usdcBalance,
      hasClaimedDeposit,
      onBack,
      renderPayWidget: _renderPayWidget,
      className,
      ...props
    },
    ref,
  ) => {
    const hasBalance = typeof usdcBalance === "number" && usdcBalance > 0;
    const [copied, setCopied] = useState(false);
    const [selectedChain, setSelectedChain] = useState<Chain>("base");

    const handleCopy = useCallback(() => {
      if (!walletAddress) return;
      navigator.clipboard.writeText(walletAddress).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }, [walletAddress]);

    // Memoize QR so it only re-renders when address changes
    const qrCode = useMemo(() => {
      if (!walletAddress) return null;
      return (
        <QRCodeSVG
          value={walletAddress}
          size={180}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={false}
          imageSettings={{
            src: "/favicon.png",
            x: undefined,
            y: undefined,
            height: 36,
            width: 36,
            excavate: true,
          }}
        />
      );
    }, [walletAddress]);

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#0D3331] flex flex-col gap-[14px] rounded-2xl border border-[#123F3C] p-[16px] relative",
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
          <SkaiIcon name="wallet" size="sm" className="text-[#2DEDAD] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            Deposit
          </p>
        </div>

        {/* Balance (if any) */}
        {hasBalance && (
          <div className="flex flex-col gap-[2px] bg-[#001615]/40 rounded-lg px-[14px] py-[10px]">
            <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F]">
              sUSD Balance
            </span>
            <span className="font-['Manrope',sans-serif] font-light text-[28px] leading-[32px] tracking-[-1.12px] text-white">
              ${usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* One-time SKAI Points reward banner — sUSD on Base only */}
        {!hasClaimedDeposit && (
          <div className="flex items-center gap-[8px] px-[12px] py-[10px] rounded-lg bg-[#0D3D3A]/60 border border-[#2DEDAD]/15">
            <span className="font-['Manrope',sans-serif] font-bold text-[#2DEDAD] text-[18px]">1:1</span>
            <div className="flex flex-col gap-[1px]">
              <span className="font-['Manrope',sans-serif] font-medium text-[#E0E0E0] text-[12px] leading-[16px]">
                1 SKAI Point for every sUSD on your first deposit
              </span>
              <span className="font-['Manrope',sans-serif] font-normal text-[#8B9E9D] text-[10px] leading-[14px]">
                One-time reward &middot; sUSD on Base only
              </span>
            </div>
          </div>
        )}

        {/* Chain toggle */}
        <div className="flex gap-2">
          {(["base", "ethereum"] as const).map((chain) => (
            <button
              key={chain}
              type="button"
              onClick={() => setSelectedChain(chain)}
              className={cn(
                "flex-1 py-[8px] px-[12px] rounded-[8px] font-['Manrope',sans-serif] font-medium text-[12px] md:text-[13px] leading-[16px] transition-all duration-200",
                selectedChain === chain
                  ? "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/30"
                  : "bg-[#001615] text-[#8B9E9D] border border-transparent hover:border-[rgba(255,255,255,0.1)]",
              )}
            >
              {chain === "base" ? "Base" : "Ethereum"}
            </button>
          ))}
        </div>

        {/* ═══ DEPOSIT VIEW: QR + Address + Copy ═══ */}
        {walletAddress ? (
          <div className="flex flex-col items-center gap-[12px]">
            {/* QR Code — real scannable QR matching wallet.skai.trade */}
            <div className="p-4 bg-white rounded-2xl shadow-lg shadow-white/10 inline-block">
              {qrCode}
            </div>

            <p className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F] text-center">
              {selectedChain === "base"
                ? "Scan or copy address to deposit ETH or sUSD on Base"
                : "Scan or copy address to deposit ETH or sUSD on Ethereum"}
            </p>

            {/* Address + Copy */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center gap-[8px] bg-[#001615]/50 rounded-lg px-[12px] py-[10px] border border-[#95A09F]/10 hover:border-[#56C7F3]/30 transition-all group"
            >
              <span className="flex-1 font-['JetBrains_Mono',monospace] font-normal text-[11px] leading-[14px] text-[#95A09F] truncate text-left">
                {walletAddress}
              </span>
              <span className={cn(
                "flex-shrink-0 font-['Manrope',sans-serif] font-medium text-[11px] leading-[14px] transition-colors",
                copied ? "text-[#2DEDAD]" : "text-[#56C7F3] group-hover:text-[#2DEDAD]",
              )}>
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>

            {/* Accepted assets info */}
            <div className="w-full flex flex-col gap-[4px] px-[4px]">
              <span className="font-['Manrope',sans-serif] font-normal text-[#8B9E9D] text-[10px] leading-[14px]">
                Accepted: ETH &amp; sUSD on {selectedChain === "base" ? "Base" : "Ethereum Mainnet"}
              </span>
              {selectedChain === "base" && !hasClaimedDeposit && (
                <span className="font-['Manrope',sans-serif] font-normal text-[#2DEDAD] text-[10px] leading-[14px]">
                  Deposit sUSD on Base to earn 1 SKAI Point per sUSD
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[10px] bg-[#001615]/40 rounded-lg px-[14px] py-[20px]">
            <SkaiIcon name="wallet" size="md" className="text-[#95A09F]/50" />
            <p className="font-['Manrope',sans-serif] font-normal text-[13px] leading-[18px] text-[#95A09F] text-center">
              Connect your wallet to view your deposit address
            </p>
          </div>
        )}
      </div>
    );
  },
);
PortfolioCard.displayName = "PortfolioCard";

export { PortfolioCard };
