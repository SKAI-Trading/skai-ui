import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

const CHAINS = ["Base", "Ethereum", "Arbitrum", "Optimism", "Polygon"] as const;
type Chain = (typeof CHAINS)[number];

const TOKENS = ["sUSD", "ETH", "WETH"] as const;
type Token = (typeof TOKENS)[number];

export interface BridgeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  usdcBalance?: number | null;
  onBack?: () => void;
  walletAppUrl?: string;
}

const BridgeCard = React.forwardRef<HTMLDivElement, BridgeCardProps>(
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

    const [fromChain, setFromChain] = React.useState<Chain>("Base");
    const [toChain, setToChain] = React.useState<Chain>("Ethereum");
    const [selectedToken, setSelectedToken] = React.useState<Token>("sUSD");
    const [showFromPicker, setShowFromPicker] = React.useState(false);
    const [showToPicker, setShowToPicker] = React.useState(false);

    const handleSwapChains = () => {
      setFromChain(toChain);
      setToChain(fromChain);
    };

    const selectFrom = (chain: Chain) => {
      if (chain === toChain) setToChain(fromChain);
      setFromChain(chain);
      setShowFromPicker(false);
    };

    const selectTo = (chain: Chain) => {
      if (chain === fromChain) setFromChain(toChain);
      setToChain(chain);
      setShowToPicker(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#123F3C] flex flex-col gap-[14px] rounded-lg p-[16px] relative",
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
          <SkaiIcon name="bridge" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            Bridge
          </p>
        </div>

        {/* Chain selectors */}
        <div className="flex items-center gap-[8px]">
          {/* FROM chain */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}
              className="w-full flex flex-col gap-[4px] bg-[#001615]/50 rounded-lg px-[14px] py-[12px] border border-[#95A09F]/15 hover:border-[#56C7F3]/30 transition-colors text-left cursor-pointer"
            >
              <span className="font-['Manrope',sans-serif] font-normal text-[10px] leading-[14px] text-[#95A09F]">
                From
              </span>
              <div className="flex items-center justify-between">
                <span className="font-['Manrope',sans-serif] font-medium text-[14px] leading-[18px] text-white">
                  {fromChain}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#95A09F]">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
            {showFromPicker && (
              <div className="absolute top-full left-0 right-0 mt-[4px] z-20 bg-[#0A2A28] border border-[#95A09F]/20 rounded-lg overflow-hidden shadow-xl">
                {CHAINS.filter(c => c !== fromChain).map(chain => (
                  <button
                    key={chain}
                    type="button"
                    onClick={() => selectFrom(chain)}
                    className="w-full text-left px-[14px] py-[10px] font-['Manrope',sans-serif] font-medium text-[13px] text-[#E0E0E0] hover:bg-[#56C7F3]/10 hover:text-[#56C7F3] transition-colors"
                  >
                    {chain}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap button */}
          <button
            type="button"
            onClick={handleSwapChains}
            className="w-8 h-8 rounded-full bg-[#001615]/50 border border-[#95A09F]/15 flex items-center justify-center flex-shrink-0 hover:border-[#56C7F3]/40 hover:bg-[#56C7F3]/10 transition-colors cursor-pointer"
          >
            <SkaiIcon name="swap" size="xs" className="text-[#56C7F3]" />
          </button>

          {/* TO chain */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}
              className="w-full flex flex-col gap-[4px] bg-[#001615]/50 rounded-lg px-[14px] py-[12px] border border-[#95A09F]/15 hover:border-[#56C7F3]/30 transition-colors text-left cursor-pointer"
            >
              <span className="font-['Manrope',sans-serif] font-normal text-[10px] leading-[14px] text-[#95A09F]">
                To
              </span>
              <div className="flex items-center justify-between">
                <span className="font-['Manrope',sans-serif] font-medium text-[14px] leading-[18px] text-white">
                  {toChain}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#95A09F]">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
            {showToPicker && (
              <div className="absolute top-full left-0 right-0 mt-[4px] z-20 bg-[#0A2A28] border border-[#95A09F]/20 rounded-lg overflow-hidden shadow-xl">
                {CHAINS.filter(c => c !== toChain).map(chain => (
                  <button
                    key={chain}
                    type="button"
                    onClick={() => selectTo(chain)}
                    className="w-full text-left px-[14px] py-[10px] font-['Manrope',sans-serif] font-medium text-[13px] text-[#E0E0E0] hover:bg-[#56C7F3]/10 hover:text-[#56C7F3] transition-colors"
                  >
                    {chain}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Token selector chips */}
        <div className="flex items-center gap-[6px]">
          <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F] mr-[2px]">
            Asset:
          </span>
          {TOKENS.map(token => (
            <button
              key={token}
              type="button"
              onClick={() => setSelectedToken(token)}
              className={cn(
                "px-[10px] py-[5px] rounded-lg font-['Manrope',sans-serif] font-medium text-[11px] leading-[14px] transition-all duration-200 border",
                selectedToken === token
                  ? "bg-[#56C7F3]/15 text-[#56C7F3] border-[#56C7F3]/30"
                  : "bg-[#001615]/30 text-[#95A09F] border-[#95A09F]/10 hover:border-[#56C7F3]/20 hover:text-[#E0E0E0]",
              )}
            >
              {token}
            </button>
          ))}
        </div>

        {/* Deposit incentive */}
        {!hasBalance && (
          <div className="flex items-start gap-[8px] bg-[#001615]/40 rounded-lg px-[12px] py-[10px]">
            <SkaiIcon name="info" size="xs" className="text-[#2DEDAD] flex-shrink-0 mt-0.5" />
            <p className="font-['Manrope',sans-serif] font-normal text-[12px] leading-[16px] text-[#95A09F]">
              Deposit {selectedToken} to start bridging across chains. Earn <span className="text-[#2DEDAD] font-medium">1 SKAI Point per $1 sUSD</span> deposited.
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
          {hasBalance ? `Bridge ${selectedToken}` : `Deposit & Bridge ${selectedToken}`}
          <SkaiIcon name="external-link" size="xs" className="text-[#001615]" />
        </a>
      </div>
    );
  },
);
BridgeCard.displayName = "BridgeCard";

export { BridgeCard };
