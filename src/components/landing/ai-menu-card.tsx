import * as React from "react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AIToolOption = "scan" | "portfolio" | "swap" | "bridge" | "buy";

export interface AIMenuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Called when user selects a tool option */
  onSelectTool?: (tool: AIToolOption) => void;
  /** Called when user submits a free-form question */
  onAskQuestion?: (question: string) => void;
  /** Show loading state on question submit */
  isAsking?: boolean;
  /** Whether the user has deposited USDC (unlocks swap/portfolio/bridge) */
  hasDeposit?: boolean;
  /** Called when user clicks a deposit-gated tool without a deposit */
  onNeedDeposit?: () => void;
  /** Compact mode — hides question input for embedded use */
  compact?: boolean;
}

const TOOL_OPTIONS: Array<{
  id: AIToolOption;
  label: string;
  icon: "chart" | "wallet" | "swap" | "bridge" | "token" | "signal" | "trending-up" | "information";
  requiresDeposit: boolean;
}> = [
  { id: "scan", label: "Chart analysis", icon: "chart", requiresDeposit: false },
  { id: "portfolio", label: "Analyze portfolio", icon: "wallet", requiresDeposit: false },
  { id: "swap", label: "Swap tokens", icon: "swap", requiresDeposit: false },
  { id: "bridge", label: "Bridge", icon: "bridge", requiresDeposit: false },
  { id: "buy", label: "Buy USDC / ETH", icon: "token", requiresDeposit: false },
];

// ─── Component ───────────────────────────────────────────────────────────────

const AIMenuCard = React.forwardRef<HTMLDivElement, AIMenuCardProps>(
  (
    {
      onSelectTool,
      onAskQuestion,
      isAsking = false,
      hasDeposit = false,
      onNeedDeposit,
      compact = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [question, setQuestion] = useState("");

    const handleSubmit = () => {
      const q = question.trim();
      if (!q || isAsking) return;
      onAskQuestion?.(q);
      setQuestion("");
    };

    const handleToolClick = (tool: (typeof TOOL_OPTIONS)[number]) => {
      if (tool.requiresDeposit && !hasDeposit) {
        onNeedDeposit?.();
        return;
      }
      onSelectTool?.(tool.id);
    };

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
          <SkaiIcon name="skai-ai" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            SKAI AI
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#56C7F3]/15 text-[#56C7F3] font-medium font-['Manrope',sans-serif]">
            DEMO
          </span>
        </div>

        {/* Tool options grid — 5 items: 3 + 2 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px]">
          {TOOL_OPTIONS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleToolClick(tool)}
              className="flex items-center gap-[10px] px-[14px] py-[14px] rounded-[10px] transition-all duration-200 text-left group bg-[#001615]/50 border border-[#95A09F]/20 hover:border-[#56C7F3]/50 hover:bg-[#56C7F3]/5 cursor-pointer"
            >
              <SkaiIcon
                name={tool.icon}
                size="sm"
                className="flex-shrink-0 transition-colors text-[#56C7F3] group-hover:text-[#2DEDAD]"
              />
              <span className="font-['Manrope',sans-serif] font-medium text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] group-hover:text-white transition-colors">
                {tool.label}
              </span>
            </button>
          ))}
        </div>

        {/* Question input — hidden in compact mode */}
        {!compact && (
          <div className="flex items-center gap-[6px] md:gap-[8px]">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="or ask a question..."
              disabled={isAsking}
              className="flex-1 bg-[#001615]/60 border border-[#95A09F]/20 rounded-lg px-2.5 py-2 md:px-3 md:py-2.5 font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] placeholder:text-[#95A09F]/60 outline-none focus:border-[#56C7F3]/50 transition-colors"
            />
            <button
              type="button"
              title="Send"
              onClick={handleSubmit}
              disabled={!question.trim() || isAsking}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#001615]/60 text-[#56C7F3] flex items-center justify-center hover:bg-[#001615]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isAsking ? (
                <div className="w-4 h-4 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    );
  },
);
AIMenuCard.displayName = "AIMenuCard";

export { AIMenuCard };
