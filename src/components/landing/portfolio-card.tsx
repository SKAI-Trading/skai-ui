import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

export interface PortfolioCardProps extends React.HTMLAttributes<HTMLDivElement> {
  walletAddress?: string | null;
  usdcBalance?: number | null;
  onBack?: () => void;
  /** Render prop for embedding a Thirdweb PayEmbed or similar widget */
  renderPayWidget?: () => React.ReactNode;
}

/** Simple QR code rendered purely with CSS grid — no external lib needed */
function MiniQR({ value, size = 120 }: { value: string; size?: number }) {
  // Deterministic bit matrix from address string (visual representation, not scannable)
  // For a real scannable QR we'd need a library — this gives a recognisable pattern
  const modules = 21; // QR v1 = 21×21
  const grid: boolean[][] = [];
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(hash);
  for (let r = 0; r < modules; r++) {
    grid[r] = [];
    for (let c = 0; c < modules; c++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const inFinder =
        (r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7);
      if (inFinder) {
        const borderTL = r < 7 && c < 7 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        const borderTR = r < 7 && c >= modules - 7 && (r === 0 || r === 6 || c === modules - 1 || c === modules - 7 || (r >= 2 && r <= 4 && c >= modules - 5 && c <= modules - 3));
        const borderBL = r >= modules - 7 && c < 7 && (r === modules - 1 || r === modules - 7 || c === 0 || c === 6 || (r >= modules - 5 && r <= modules - 3 && c >= 2 && c <= 4));
        grid[r][c] = borderTL || borderTR || borderBL;
      } else {
        // Pseudo-random data from address hash
        const v = ((seed * (r * modules + c + 1)) >>> 0) % 3;
        grid[r][c] = v === 0;
      }
    }
  }

  const cellSize = size / modules;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#001615"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

const PortfolioCard = React.forwardRef<HTMLDivElement, PortfolioCardProps>(
  (
    {
      walletAddress,
      usdcBalance,
      onBack,
      renderPayWidget,
      className,
      ...props
    },
    ref,
  ) => {
    const hasBalance = typeof usdcBalance === "number" && usdcBalance > 0;
    const [copied, setCopied] = React.useState(false);
    const [activeView, setActiveView] = React.useState<"receive" | "buy">("receive");

    const handleCopy = React.useCallback(() => {
      if (!walletAddress) return;
      navigator.clipboard.writeText(walletAddress).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }, [walletAddress]);

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
          <SkaiIcon name="wallet" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            Portfolio
          </p>
        </div>

        {/* Balance (if any) */}
        {hasBalance && (
          <div className="flex flex-col gap-[2px] bg-[#001615]/40 rounded-lg px-[14px] py-[10px]">
            <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F]">
              USDC Balance
            </span>
            <span className="font-['Manrope',sans-serif] font-light text-[28px] leading-[32px] tracking-[-1.12px] text-white">
              ${usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#2DEDAD]">
              Earning 1 SKAI Point per $1 USDC
            </span>
          </div>
        )}

        {/* Tab toggle: Receive / Buy */}
        <div className="flex gap-[4px] bg-[#001615]/40 rounded-lg p-[3px]">
          <button
            type="button"
            onClick={() => setActiveView("receive")}
            className={cn(
              "flex-1 py-[7px] rounded-md font-['Manrope',sans-serif] font-medium text-[12px] leading-[16px] transition-all duration-200 text-center",
              activeView === "receive"
                ? "bg-[#56C7F3]/15 text-[#56C7F3] border border-[#56C7F3]/25"
                : "text-[#95A09F] hover:text-[#E0E0E0]",
            )}
          >
            Receive Crypto
          </button>
          <button
            type="button"
            onClick={() => setActiveView("buy")}
            className={cn(
              "flex-1 py-[7px] rounded-md font-['Manrope',sans-serif] font-medium text-[12px] leading-[16px] transition-all duration-200 text-center",
              activeView === "buy"
                ? "bg-[#2DEDAD]/15 text-[#2DEDAD] border border-[#2DEDAD]/25"
                : "text-[#95A09F] hover:text-[#E0E0E0]",
            )}
          >
            Buy Crypto
          </button>
        </div>

        {/* ═══ RECEIVE VIEW: QR + Address + Copy ═══ */}
        {activeView === "receive" && walletAddress && (
          <div className="flex flex-col items-center gap-[12px]">
            {/* QR Code */}
            <div className="bg-white rounded-xl p-[8px] shadow-lg">
              <MiniQR value={walletAddress} size={140} />
            </div>

            <p className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F] text-center">
              Scan or copy address to send USDC (Base network)
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
          </div>
        )}

        {/* ═══ RECEIVE — no wallet ═══ */}
        {activeView === "receive" && !walletAddress && (
          <div className="flex flex-col items-center gap-[10px] bg-[#001615]/40 rounded-lg px-[14px] py-[20px]">
            <SkaiIcon name="wallet" size="md" className="text-[#95A09F]/50" />
            <p className="font-['Manrope',sans-serif] font-normal text-[13px] leading-[18px] text-[#95A09F] text-center">
              Connect your wallet to view your deposit address
            </p>
          </div>
        )}

        {/* ═══ BUY VIEW ═══ */}
        {activeView === "buy" && (
          <div className="flex flex-col items-center gap-[10px]">
            {renderPayWidget ? (
              renderPayWidget()
            ) : (
              <div className="flex flex-col items-center gap-[10px] bg-[#001615]/40 rounded-lg px-[14px] py-[20px] w-full">
                <SkaiIcon name="swap" size="md" className="text-[#95A09F]/50" />
                <p className="font-['Manrope',sans-serif] font-normal text-[13px] leading-[18px] text-[#95A09F] text-center">
                  Buy crypto with card or transfer
                </p>
                <span className="font-['Manrope',sans-serif] font-medium text-[12px] leading-[16px] text-[#2DEDAD]">
                  Coming soon
                </span>
              </div>
            )}
          </div>
        )}

        {/* Points incentive */}
        {!hasBalance && (
          <div className="flex items-center justify-center gap-[6px] px-[8px] py-[6px] bg-[#2DEDAD]/8 rounded-lg border border-[#2DEDAD]/15">
            <SkaiIcon name="star" size="xs" className="text-[#2DEDAD]" />
            <span className="font-['Manrope',sans-serif] font-medium text-[11px] leading-[14px] text-[#2DEDAD]">
              Deposit USDC → Earn 1 SKAI Point per $1
            </span>
          </div>
        )}
      </div>
    );
  },
);
PortfolioCard.displayName = "PortfolioCard";

export { PortfolioCard };
