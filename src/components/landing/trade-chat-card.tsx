import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon } from "../branding/skai-icon";
import { WalletQRCode } from "../data-display/qr-code";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "deposit";
  content: string;
  /** Optional action the AI suggests (opens a specific tool view) */
  action?: ChatAction;
  timestamp: number;
}

export type ChatAction =
  | { type: "scan" }
  | { type: "swap" }
  | { type: "bridge" }
  | { type: "portfolio" }
  | { type: "deposit" }
  | { type: "link"; url: string; label: string };

type Chain = "base" | "ethereum";

export interface TradeChatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Called when user sends a message.
   * Receives `onChunk` callback for streaming — call it with partial text
   * as tokens arrive so the UI updates in real-time.
   * Must return the final complete response string.
   */
  onSendMessage?: (
    message: string,
    opts?: { onChunk?: (partial: string) => void },
  ) => Promise<string>;
  /** Called when user wants to open a specific tool (scan chart, swap, etc.) */
  onOpenTool?: (tool: "scan" | "swap" | "bridge" | "portfolio" | "deposit") => void;
  /** Current wallet address for deposit QR */
  walletAddress?: string | null;
  /** Username for personalization */
  username?: string;
  /** Current SKAI Points balance */
  skaiPoints?: number | null;
  /** Whether user has already claimed the one-time deposit reward */
  hasClaimedDeposit?: boolean;
}

const SUGGESTIONS = [
  { label: "Scan a chart", icon: "chart" as const, message: "I want to scan and analyze a chart" },
  { label: "Swap tokens", icon: "swap" as const, message: "I want to swap tokens" },
  { label: "Buy USDC", icon: "token" as const, message: "How do I buy USDC on Base?" },
  { label: "My portfolio", icon: "wallet" as const, message: "Show me my portfolio" },
  { label: "Bridge assets", icon: "bridge" as const, message: "I want to bridge assets" },
  { label: "Market prices", icon: "trending-up" as const, message: "What are the current ETH and USDC prices?" },
];

let msgCounter = 0;
const nextId = () => `msg-${++msgCounter}-${Date.now()}`;

// ─── Lightweight Markdown Renderer ───────────────────────────────────────────

/** Render simple markdown (bold, bullets, headers) to React elements */
function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `ln-${i}`;

    // Heading ### or ##
    if (line.startsWith("### ")) {
      elements.push(
        <p key={key} className="font-bold text-[#56C7F3] text-[13px] mt-1 mb-0.5">
          {inlineBold(line.slice(4))}
        </p>,
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <p key={key} className="font-bold text-[#56C7F3] text-[14px] mt-1 mb-0.5">
          {inlineBold(line.slice(3))}
        </p>,
      );
      continue;
    }

    // Bullet list item
    if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <p key={key} className="pl-3 before:content-['•'] before:absolute before:left-0 relative">
          <span className="ml-0.5">{inlineBold(line.slice(2))}</span>
        </p>,
      );
      continue;
    }

    // Empty line → small spacer
    if (line.trim() === "") {
      elements.push(<span key={key} className="block h-1.5" />);
      continue;
    }

    // Normal text
    elements.push(<p key={key}>{inlineBold(line)}</p>);
  }

  return <>{elements}</>;
}

/** Convert **bold** markers to <strong> */
function inlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-white">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}

// ─── Deposit Bubble ──────────────────────────────────────────────────────────

function DepositBubble({
  walletAddress,
  hasClaimedDeposit,
}: {
  walletAddress: string;
  hasClaimedDeposit?: boolean;
}) {
  const [chain, setChain] = useState<Chain>("base");

  return (
    <div className="max-w-[92%] rounded-xl rounded-bl-sm bg-[#001615]/50 border border-[#95A09F]/10 px-[12px] py-[10px] font-['Manrope',sans-serif]">
      {/* Intro text */}
      <p className="text-[13px] leading-[18px] text-[#E0E0E0] mb-[8px]">
        {hasClaimedDeposit
          ? "Deposit USDC to fund your wallet and start trading with AI."
          : "Welcome! Deposit USDC to earn 100 SKAI Points and start trading with AI."}
      </p>

      {/* One-time reward badge — only shown if not yet claimed */}
      {!hasClaimedDeposit && (
        <div className="flex items-center gap-[6px] mb-[8px] px-[8px] py-[6px] rounded-md bg-[#0D3D3A]/60 border border-[#2DEDAD]/15">
          <span className="text-[#2DEDAD] font-bold text-[14px]">+100</span>
          <span className="text-[#8B9E9D] text-[11px] leading-[14px]">
            SKAI Points for your first deposit (one-time reward)
          </span>
        </div>
      )}

      {/* Chain toggle */}
      <div className="flex gap-[4px] mb-[8px]">
        {(["base", "ethereum"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChain(c)}
            className={cn(
              "flex-1 py-[5px] rounded-md text-[11px] font-medium transition-colors",
              chain === c
                ? "bg-[#0D3D3A] text-[#2DEDAD] border border-[#2DEDAD]/30"
                : "bg-[#001615] text-[#8B9E9D] border border-transparent hover:border-[rgba(255,255,255,0.1)]",
            )}
          >
            {c === "base" ? "Base" : "Ethereum"}
          </button>
        ))}
      </div>

      {/* QR Code — compact */}
      <div className="flex justify-center mb-[4px]">
        <WalletQRCode
          address={walletAddress}
          chainName={chain === "base" ? "Base" : "Ethereum"}
          showAddress
          showCopy
          size={80}
          bordered={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const TradeChatCard = React.forwardRef<HTMLDivElement, TradeChatCardProps>(
  (
    {
      onSendMessage,
      onOpenTool,
      walletAddress,
      username,
      skaiPoints,
      hasClaimedDeposit,
      className,
      ...props
    },
    ref,
  ) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Build initial messages once on mount
    useEffect(() => {
      const initial: ChatMessage[] = [];

      // Deposit bubble as first message (if wallet connected)
      if (walletAddress) {
        initial.push({
          id: "deposit",
          role: "deposit",
          content: "",
          timestamp: Date.now(),
        });
      }

      // Welcome message
      initial.push({
        id: "welcome",
        role: "assistant",
        content: username
          ? `Hey ${username}! I'm your AI trading assistant. Ask me anything — swap tokens, buy USDC or ETH, analyze charts, check your portfolio, or bridge assets.`
          : "Hey! I'm your AI trading assistant. Ask me anything — swap tokens, buy USDC or ETH, analyze charts, check your portfolio, or bridge assets.",
        timestamp: Date.now(),
      });

      setMessages(initial);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scrollToBottom = useCallback(() => {
      // Scroll only the messages container, not the page
      const el = messagesEndRef.current;
      if (el?.parentElement) {
        el.parentElement.scrollTop = el.parentElement.scrollHeight;
      }
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSend = useCallback(async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setShowSuggestions(false);
      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      // Create a placeholder for the assistant reply (will be updated as tokens stream in)
      const assistantId = nextId();
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        if (onSendMessage) {
          // Add empty placeholder so streaming chunks can update it
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant" as const, content: "", timestamp: Date.now() },
          ]);

          const response = await onSendMessage(trimmed, {
            onChunk: (partial) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: partial } : m,
                ),
              );
            },
          });

          // Ensure final content is set (in case onChunk wasn't called)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: response } : m,
            ),
          );
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant" as const,
              content: "I'm not connected to the AI backend yet. Try using the quick actions below or deposit USDC to get started.",
              timestamp: Date.now(),
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant" as const,
            content: "Something went wrong. Please try again.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    }, [isLoading, onSendMessage]);

    const handleSuggestionClick = (suggestion: typeof SUGGESTIONS[number]) => {
      handleSend(suggestion.message);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#123F3C] flex flex-col rounded-lg overflow-hidden relative max-h-[520px]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-[8px] px-[16px] py-[12px] border-b border-[#95A09F]/10">
          <SkaiIcon name="skai-ai" size="sm" className="text-[#56C7F3] flex-shrink-0" />
          <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            SKAI AI
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#56C7F3]/15 text-[#56C7F3] font-medium font-['Manrope',sans-serif]">
            TRADING
          </span>

          {/* Tool shortcuts */}
          <div className="ml-auto flex items-center gap-[4px]">
            {(["scan", "swap", "portfolio", "bridge"] as const).map((tool) => (
              <button
                key={tool}
                type="button"
                title={tool === "scan" ? "Scan chart" : tool.charAt(0).toUpperCase() + tool.slice(1)}
                onClick={() => onOpenTool?.(tool)}
                className="w-7 h-7 rounded-md bg-[#001615]/40 text-[#95A09F] flex items-center justify-center hover:bg-[#001615]/60 hover:text-[#56C7F3] transition-colors"
              >
                <SkaiIcon
                  name={tool === "scan" ? "chart" : tool === "portfolio" ? "wallet" : tool}
                  size="xs"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-[8px] px-[16px] py-[12px] flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#95A09F]/20 scrollbar-track-transparent">
          {messages.map((msg) => {
            // Deposit bubble — special render
            if (msg.role === "deposit" && walletAddress) {
              return (
                <div key={msg.id} className="flex justify-start">
                  <DepositBubble walletAddress={walletAddress} hasClaimedDeposit={hasClaimedDeposit} />
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-[12px] py-[8px] font-['Manrope',sans-serif] text-[13px] leading-[18px]",
                    msg.role === "user"
                      ? "bg-[#56C7F3]/15 text-white border border-[#56C7F3]/20 rounded-br-sm"
                      : "bg-[#001615]/50 text-[#E0E0E0] border border-[#95A09F]/10 rounded-bl-sm",
                  )}
                >
                  {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#001615]/50 rounded-xl rounded-bl-sm px-[12px] py-[8px] border border-[#95A09F]/10">
                <div className="flex gap-1.5 items-center h-[18px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#56C7F3] animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#56C7F3] animate-pulse [animation-delay:200ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#56C7F3] animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions — shown initially */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-[6px] px-[16px] pb-[8px]">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                disabled={isLoading}
                className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-full bg-[#001615]/40 border border-[#95A09F]/15 hover:border-[#56C7F3]/40 hover:bg-[#56C7F3]/5 transition-all duration-200 disabled:opacity-40"
              >
                <SkaiIcon name={s.icon} size="xs" className="text-[#56C7F3]" />
                <span className="font-['Manrope',sans-serif] font-medium text-[11px] md:text-[12px] leading-[14px] text-[#95A09F] group-hover:text-white whitespace-nowrap">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-[8px] px-[12px] py-[10px] border-t border-[#95A09F]/10 bg-[#001615]/20">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask me anything about trading..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] placeholder:text-[#95A09F]/50"
          />
          <button
            type="button"
            title="Send"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#56C7F3] text-[#001615] flex items-center justify-center hover:bg-[#2DEDAD] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-[#001615]/30 border-t-[#001615] rounded-full animate-spin" />
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
TradeChatCard.displayName = "TradeChatCard";

export { TradeChatCard };
