import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";

export interface BuyCardMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface BuyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Called when user sends a buy command (returns AI response) */
  onSendMessage?: (message: string) => Promise<string>;
  /** Current wallet address */
  walletAddress?: string | null;
  /** Navigate back to tool menu */
  onBack?: () => void;
  /** External link for fiat on-ramp */
  onRampUrl?: string;
}

const QUICK_ACTIONS = [
  { label: "Buy $50 USDC", message: "I want to buy $50 worth of USDC on Base" },
  { label: "Buy $100 USDC", message: "I want to buy $100 worth of USDC on Base" },
  { label: "Buy 0.05 ETH", message: "I want to buy 0.05 ETH on Base" },
  { label: "Compare prices", message: "Compare current USDC and ETH prices and recommend the best buy" },
];

const INITIAL_MESSAGES: BuyCardMessage[] = [
  {
    role: "assistant",
    content: "I can help you buy USDC or ETH. Tell me what you'd like to buy and how much, or use a quick action below.",
  },
];

const BuyCard = React.forwardRef<HTMLDivElement, BuyCardProps>(
  (
    {
      onSendMessage,
      walletAddress,
      onBack,
      onRampUrl = "https://wallet.skai.trade",
      className,
      ...props
    },
    ref,
  ) => {
    const [messages, setMessages] = useState<BuyCardMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: BuyCardMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        if (onSendMessage) {
          const response = await onSendMessage(trimmed);
          setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        } else {
          // Fallback when no handler — show guidance
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "To buy USDC or ETH, deposit funds to your wallet using the QR code on the Trade tab, or use a fiat on-ramp service. Once funded, you can swap between tokens using the Swap tool.",
            },
          ]);
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#123F3C] flex flex-col gap-[12px] rounded-lg p-[16px] relative",
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
          <SkaiIcon name="token" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            Buy USDC / ETH
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#56C7F3]/15 text-[#56C7F3] font-medium font-['Manrope',sans-serif] ml-auto">
            AI
          </span>
        </div>

        {/* Chat messages */}
        <div className="flex flex-col gap-[8px] max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#95A09F]/20 scrollbar-track-transparent pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-[12px] py-[8px] font-['Manrope',sans-serif] text-[13px] leading-[18px]",
                  msg.role === "user"
                    ? "bg-[#56C7F3]/15 text-white border border-[#56C7F3]/20"
                    : "bg-[#001615]/50 text-[#E0E0E0] border border-[#95A09F]/10",
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#001615]/50 rounded-lg px-[12px] py-[8px] border border-[#95A09F]/10">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#56C7F3]/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#56C7F3]/40 animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-[#56C7F3]/40 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-2 gap-[6px]">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => handleSend(action.message)}
                disabled={isLoading}
                className="text-left px-[10px] py-[8px] rounded-[8px] bg-[#001615]/40 border border-[#95A09F]/15 hover:border-[#56C7F3]/40 hover:bg-[#56C7F3]/5 transition-all duration-200 disabled:opacity-40"
              >
                <span className="font-['Manrope',sans-serif] font-medium text-[12px] leading-[16px] text-[#56C7F3]">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* On-ramp link */}
        <a
          href={onRampUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px] bg-[#001615]/30 hover:bg-[#001615]/50 transition-colors"
        >
          <SkaiIcon name="external-link" size="xs" className="text-[#95A09F]" />
          <span className="font-['Manrope',sans-serif] font-normal text-[11px] leading-[14px] text-[#95A09F] hover:text-[#2DEDAD] transition-colors">
            Buy with credit card via SKAI Wallet
          </span>
        </a>

        {/* Input */}
        <div className="flex items-center gap-[6px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Tell me what to buy..."
            disabled={isLoading}
            className="flex-1 bg-[#001615]/60 border border-[#95A09F]/20 rounded-lg px-2.5 py-2 md:px-3 md:py-2.5 font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] placeholder:text-[#95A09F]/60 outline-none focus:border-[#56C7F3]/50 transition-colors"
          />
          <button
            type="button"
            title="Send"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#56C7F3] text-[#001615] flex items-center justify-center hover:bg-[#2DEDAD] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#001615]/30 border-t-[#001615] rounded-full animate-spin" />
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
      </div>
    );
  },
);
BuyCard.displayName = "BuyCard";

export { BuyCard };
