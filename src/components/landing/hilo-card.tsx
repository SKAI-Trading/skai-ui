import * as React from "react";
import { useState, useCallback } from "react";
import { cn } from "../../lib/utils";

export interface HiLoResult {
  roll: number;
  result: "win" | "lose" | "push";
  payout: number;
  newBalance: number;
  serverSeed: string;
  nonce: number;
}

export interface HiLoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  skaiPoints: number;
  userId?: string | null;
  onPlayBet?: (betAmount: number, choice: "hi" | "lo") => Promise<HiLoResult>;
  onPointsChange?: (newBalance: number) => void;
}

interface HistoryEntry {
  roll: number;
  choice: "hi" | "lo";
  won: boolean;
  push: boolean;
}

const BET_OPTIONS = [1] as const;

const HiLoCard = React.forwardRef<HTMLDivElement, HiLoCardProps>(
  ({ skaiPoints, userId, onPlayBet, onPointsChange, className, ...props }, ref) => {
    const [betAmount] = useState(1);
    const [showRules, setShowRules] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastResult, setLastResult] = useState<HiLoResult | null>(null);
    const [lastChoice, setLastChoice] = useState<"hi" | "lo" | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
      if (!userId) return [];
      try {
        const stored = localStorage.getItem(`skai_hilo_history_${userId}`);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    });

    const canPlay = !!userId && !!onPlayBet;

    const handlePlay = useCallback(
      async (choice: "hi" | "lo") => {
        if (!onPlayBet || !userId || isPlaying || skaiPoints < betAmount) return;
        setIsPlaying(true);
        setLastResult(null);
        setLastChoice(choice);

        try {
          const result = await onPlayBet(betAmount, choice);
          setLastResult(result);
          onPointsChange?.(result.newBalance);

          const entry: HistoryEntry = {
            roll: result.roll,
            choice,
            won: result.result === "win",
            push: result.result === "push",
          };
          const newHistory = [entry, ...history].slice(0, 5);
          setHistory(newHistory);
          try {
            localStorage.setItem(
              `skai_hilo_history_${userId}`,
              JSON.stringify(newHistory),
            );
          } catch { /* localStorage full — non-critical */ }
        } catch (err) {
          console.error("HiLo play failed:", err);
        } finally {
          setIsPlaying(false);
        }
      },
      [isPlaying, skaiPoints, betAmount, onPlayBet, onPointsChange, history, userId],
    );

    const resultColor = lastResult
      ? lastResult.result === "win"
        ? "text-[#2DEDAD]"
        : lastResult.result === "lose"
          ? "text-[#F04438]"
          : "text-[#F5A623]"
      : "";

    const resultText = lastResult
      ? lastResult.result === "win"
        ? `WIN! +${lastResult.payout} pts`
        : lastResult.result === "lose"
          ? `LOSE -${betAmount} pts`
          : "PUSH (returned)"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col p-[16px] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-[12px]">
          <div className="flex items-center gap-[6px]">
            {/* Dice icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#2DEDAD" strokeWidth="1.8" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#2DEDAD" />
              <circle cx="15.5" cy="8.5" r="1.5" fill="#2DEDAD" />
              <circle cx="12" cy="12" r="1.5" fill="#2DEDAD" />
              <circle cx="8.5" cy="15.5" r="1.5" fill="#2DEDAD" />
              <circle cx="15.5" cy="15.5" r="1.5" fill="#2DEDAD" />
            </svg>
            <h3 className="font-manrope font-medium text-white text-[16px] md:text-[18px] lg:text-[20px] leading-[22px] tracking-[-0.64px]">
              Hi / Lo
            </h3>
            <button
              type="button"
              onClick={() => setShowRules((v) => !v)}
              className={cn(
                "w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 shrink-0",
                showRules
                  ? "bg-[#2DEDAD] text-[#001615]"
                  : "bg-[#ffffff10] text-[#8B9E9D] hover:bg-[#ffffff18] hover:text-white",
              )}
              aria-label="How to play"
            >
              ?
            </button>
          </div>
          <span className="font-manrope font-normal text-[#8B9E9D] text-[12px] md:text-[13px] leading-[16px]">
            Balance:{" "}
            <span className="text-[#2DEDAD] font-medium">
              {skaiPoints.toLocaleString()} pts
            </span>
          </span>
        </div>

        {/* How to Play rules */}
        {showRules && (
          <div className="mb-[12px] p-[12px] rounded-[12px] bg-[#0A2A28] border border-[#2DEDAD]/15 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="font-manrope font-semibold text-[#2DEDAD] text-[12px] mb-[6px]">How to Play</p>
            <ol className="font-manrope text-[#8B9E9D] text-[11px] leading-[16px] list-decimal list-inside space-y-[3px]">
              <li>A random number from <span className="text-white font-medium">0 – 9,999</span> is rolled</li>
              <li>Pick <span className="text-[#2DEDAD] font-medium">HI</span> if you think it will be <span className="text-white font-medium">above 5,000</span></li>
              <li>Pick <span className="text-[#56C7F3] font-medium">LO</span> if you think it will be <span className="text-white font-medium">below 5,000</span></li>
              <li>Win = <span className="text-[#2DEDAD] font-medium">2× your bet</span> returned · Wrong = <span className="text-[#F04438] font-medium">lose bet</span></li>
              <li>Exactly 5,000 = <span className="text-[#F5A623] font-medium">Push</span> (bet returned)</li>
            </ol>
            <p className="font-manrope text-[#5A7170] text-[10px] mt-[6px]">1 SKAI Point per bet · Provably fair · Results verifiable on-chain</p>
          </div>
        )}

        {/* Bet selector */}
        <div className="flex items-center gap-[6px] mb-[16px]">
          <span className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] leading-[14px] mr-[4px]">
            Bet:
          </span>
          {BET_OPTIONS.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled
              className={cn(
                "px-[10px] h-[32px] md:h-[36px] rounded-[8px] font-manrope font-medium text-[13px] md:text-[14px] transition-all duration-150",
                "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/40",
              )}
            >
              {amt} pt
            </button>
          ))}
        </div>

        {/* Hi / Lo buttons */}
        <div className="flex gap-3 mb-[16px]">
          <button
            type="button"
            disabled={!canPlay || isPlaying || skaiPoints < betAmount}
            onClick={() => handlePlay("hi")}
            className={cn(
              "flex-1 py-[14px] md:py-[16px] rounded-[12px] font-manrope font-bold text-[15px] md:text-[16px] transition-all duration-200 flex flex-col items-center gap-[2px]",
              !canPlay || isPlaying || skaiPoints < betAmount
                ? "bg-[#001615] text-[#3A5553] cursor-not-allowed"
                : "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/20 hover:border-[#2DEDAD]/50 hover:shadow-[0_0_16px_rgba(45,237,173,0.15)] active:scale-[0.97]",
            )}
          >
            <span>HI</span>
            <span className="font-normal text-[10px] md:text-[11px] opacity-60">
              &gt; 5000
            </span>
          </button>
          <button
            type="button"
            disabled={!canPlay || isPlaying || skaiPoints < betAmount}
            onClick={() => handlePlay("lo")}
            className={cn(
              "flex-1 py-[14px] md:py-[16px] rounded-[12px] font-manrope font-bold text-[15px] md:text-[16px] transition-all duration-200 flex flex-col items-center gap-[2px]",
              !canPlay || isPlaying || skaiPoints < betAmount
                ? "bg-[#001615] text-[#3A5553] cursor-not-allowed"
                : "bg-[#0D3D3A] text-[#56C7F3] border border-[#56C7F3]/20 hover:border-[#56C7F3]/50 hover:shadow-[0_0_16px_rgba(86,199,243,0.15)] active:scale-[0.97]",
            )}
          >
            <span>LO</span>
            <span className="font-normal text-[10px] md:text-[11px] opacity-60">
              &lt; 5000
            </span>
          </button>
        </div>

        {/* Result display */}
        {isPlaying && (
          <div className="flex items-center justify-center py-[12px] mb-[8px]">
            <span className="font-manrope font-medium text-[#8B9E9D] text-[14px] animate-pulse">
              Rolling...
            </span>
          </div>
        )}
        {lastResult && !isPlaying && (
          <div className="flex items-center justify-center gap-[8px] py-[8px] mb-[8px] rounded-[8px] bg-[#001615]">
            <span className="font-manrope font-bold text-white text-[18px] md:text-[20px] tracking-wide">
              {lastResult.roll.toLocaleString()}
            </span>
            <span className={cn("font-manrope font-medium text-[13px] md:text-[14px]", resultColor)}>
              {lastChoice?.toUpperCase()} — {resultText}
            </span>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="flex items-center gap-[6px] flex-wrap">
            <span className="font-manrope font-normal text-[#8B9E9D] text-[10px] leading-[12px]">
              Last:
            </span>
            {history.map((h, i) => (
              <span
                key={`${h.roll}-${i}`}
                className={cn(
                  "font-manrope font-normal text-[10px] md:text-[11px] leading-[14px]",
                  h.push
                    ? "text-[#F5A623]"
                    : h.won
                      ? "text-[#2DEDAD]"
                      : "text-[#F04438]",
                )}
              >
                {h.roll.toLocaleString()}
                {h.push ? "=" : h.won ? "+" : "-"}
              </span>
            ))}
          </div>
        )}

        {/* Not signed in state */}
        {!canPlay && (
          <p className="font-manrope font-normal text-[#8B9E9D] text-[12px] md:text-[13px] leading-[16px] text-center mt-[4px]">
            Connect your wallet and sign up to play Hi / Lo
          </p>
        )}

        {/* No balance state */}
        {canPlay && skaiPoints <= 0 && (
          <p className="font-manrope font-normal text-[#8B9E9D] text-[11px] md:text-[12px] leading-[16px] text-center mt-[8px]">
            You need SKAI Points to play. Earn points by sharing or depositing USDC.
          </p>
        )}
      </div>
    );
  },
);
HiLoCard.displayName = "HiLoCard";

export { HiLoCard };
