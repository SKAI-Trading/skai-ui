import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "../../lib/utils";
import { ChartOverlayCanvas } from "./chart-overlay-canvas";
import type { KeyLevel, PatternRegion } from "./chart-overlay-canvas";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChartAnalysisResult {
  patterns: Array<{
    name: string;
    confidence: "high" | "medium" | "low";
    description: string;
    implications: string;
  }>;
  trendAnalysis: {
    direction: "bullish" | "bearish" | "neutral" | "sideways";
    strength: "strong" | "moderate" | "weak";
    description: string;
  };
  keyLevels: KeyLevel[];
  indicators: Array<{
    name: string;
    signal: "buy" | "sell" | "neutral";
    description: string;
  }>;
  overallAssessment: {
    bias: "bullish" | "bearish" | "neutral";
    confidence: number;
    summary: string;
    recommendations: string[];
  };
  patternRegions?: PatternRegion[];
  warnings?: string[];
}

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  analysis?: ChartAnalysisResult;
  chartImage?: string;
}

export interface ChartAICardProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  /** Called to analyze a chart image. Returns the AI analysis result. */
  onAnalyzeChart: (imageBase64: string) => Promise<ChartAnalysisResult>;
  /** Called to ask a follow-up question. Returns the AI text response. */
  onAskFollowUp: (question: string, analysisContext: string) => Promise<string>;
  /** Maximum number of interactions allowed (default 5) */
  maxInteractions?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CONFIDENCE_COLORS: Record<string, string> = {
  high: "#2DEDAD",
  medium: "#F5A623",
  low: "#FF6B6B",
};

const BIAS_ICONS: Record<string, string> = {
  bullish: "▲",
  bearish: "▼",
  neutral: "◆",
};

function normalizeConfidence(raw: number): number {
  const v = raw > 1 ? raw : raw * 100;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function getStorageKey(username: string): string {
  return `skai_chart_ai_used_${username}`;
}

function getUsedCount(username: string): number {
  try {
    return parseInt(localStorage.getItem(getStorageKey(username)) || "0", 10);
  } catch {
    return 0;
  }
}

function setUsedCount(username: string, count: number): void {
  try {
    localStorage.setItem(getStorageKey(username), String(count));
  } catch {
    // localStorage unavailable
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnalysisSummary({ analysis }: { analysis: ChartAnalysisResult }) {
  const conf = normalizeConfidence(analysis.overallAssessment.confidence);
  const bias = analysis.overallAssessment.bias;

  return (
    <div className="space-y-3 mt-3">
      {/* Overall */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[13px] font-semibold text-white">
          {BIAS_ICONS[bias] || "◆"} Overall:{" "}
          <span
            className="capitalize"
            style={{
              color:
                bias === "bullish"
                  ? "#2DEDAD"
                  : bias === "bearish"
                    ? "#FF6B6B"
                    : "#E0E0E0",
            }}
          >
            {bias}
          </span>
        </span>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: `${conf >= 70 ? "#2DEDAD" : conf >= 40 ? "#F5A623" : "#FF6B6B"}22`,
            color: conf >= 70 ? "#2DEDAD" : conf >= 40 ? "#F5A623" : "#FF6B6B",
          }}
        >
          {conf}% confidence
        </span>
      </div>

      {/* Trend */}
      <div className="text-[12px] text-[#B0B0B0]">
        <span className="text-[#E0E0E0] font-medium">Trend:</span>{" "}
        {analysis.trendAnalysis.direction}, {analysis.trendAnalysis.strength} —{" "}
        {analysis.trendAnalysis.description}
      </div>

      {/* Patterns */}
      {analysis.patterns.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.patterns.map((p, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 rounded-lg border font-medium"
              style={{
                borderColor: CONFIDENCE_COLORS[p.confidence] + "44",
                color: CONFIDENCE_COLORS[p.confidence],
                backgroundColor: CONFIDENCE_COLORS[p.confidence] + "11",
              }}
            >
              {p.name} ({p.confidence})
            </span>
          ))}
        </div>
      )}

      {/* Key Levels */}
      {analysis.keyLevels.length > 0 && (
        <div className="text-[12px] text-[#B0B0B0]">
          <span className="text-[#E0E0E0] font-medium">Key Levels:</span>{" "}
          {analysis.keyLevels
            .map((l) => `${l.type === "support" ? "S" : l.type === "resistance" ? "R" : "P"}: ${l.price || l.description}`)
            .join(" | ")}
        </div>
      )}

      {/* Summary */}
      <p className="text-[12px] text-[#B0B0B0] leading-[18px]">
        {analysis.overallAssessment.summary}
      </p>

      {/* Recommendations */}
      {analysis.overallAssessment.recommendations.length > 0 && (
        <div className="space-y-1">
          {analysis.overallAssessment.recommendations.map((rec, i) => (
            <div
              key={i}
              className="text-[11px] text-[#2DEDAD] flex items-start gap-1.5"
            >
              <span className="mt-0.5 flex-shrink-0">→</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DropZone({
  onImageSelected,
  isAnalyzing,
}: {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) onImageSelected(result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected],
  );

  // Clipboard paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [processFile]);

  if (isAnalyzing) {
    return (
      <div className="border border-dashed border-[#56C7F3]/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-[#56C7F3]/5 min-h-[120px]">
        <div className="w-6 h-6 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin" />
        <span className="text-[12px] text-[#56C7F3] font-medium">
          Analyzing your chart...
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-[120px]",
          isDragging
            ? "border-[#56C7F3] bg-[#56C7F3]/10"
            : "border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.02)] hover:border-[#56C7F3]/50 hover:bg-[#56C7F3]/5",
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) processFile(file);
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#56C7F3] opacity-60"
        >
          <path
            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[13px] text-[#E0E0E0] text-center">
          Drop or paste a chart image
        </span>
        <span className="text-[11px] text-[#808080]">
          or click to upload
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const ChartAICard = React.forwardRef<HTMLDivElement, ChartAICardProps>(
  (
    {
      username,
      onAnalyzeChart,
      onAskFollowUp,
      maxInteractions = 5,
      className,
      ...props
    },
    ref,
  ) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [analysis, setAnalysis] = useState<ChartAnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [followUpInput, setFollowUpInput] = useState("");
    const [usedCount, setUsedCountState] = useState(() =>
      getUsedCount(username),
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isLocked = usedCount >= maxInteractions;
    const remaining = Math.max(0, maxInteractions - usedCount);

    // Scroll to bottom on new messages
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Add greeting on mount
    useEffect(() => {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: `Hey ${username}! Upload or paste a trading chart and I'll give you a full technical analysis with pattern detection, key levels, and trade recommendations.`,
        },
      ]);
    }, [username]);

    const incrementUsed = useCallback(() => {
      const next = usedCount + 1;
      setUsedCountState(next);
      setUsedCount(username, next);
    }, [usedCount, username]);

    const handleImageSelected = useCallback(
      async (base64: string) => {
        if (isLocked) return;
        setIsAnalyzing(true);

        // Add user message with chart
        const userMsg: ChatMessage = {
          id: `user_${Date.now()}`,
          role: "user",
          content: "Analyze this chart",
          chartImage: base64,
        };
        setMessages((prev) => [...prev, userMsg]);

        try {
          const result = await onAnalyzeChart(base64);
          setAnalysis(result);

          const assistantMsg: ChatMessage = {
            id: `assistant_${Date.now()}`,
            role: "assistant",
            content: result.overallAssessment.summary,
            analysis: result,
            chartImage: base64,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          incrementUsed();
        } catch (err) {
          const errorMsg: ChatMessage = {
            id: `error_${Date.now()}`,
            role: "assistant",
            content:
              "Sorry, I couldn't analyze that chart. Please try again with a clearer image.",
          };
          setMessages((prev) => [...prev, errorMsg]);
        } finally {
          setIsAnalyzing(false);
        }
      },
      [isLocked, onAnalyzeChart, incrementUsed],
    );

    const handleFollowUp = useCallback(async () => {
      if (!followUpInput.trim() || isLocked || !analysis || isSending) return;

      const question = followUpInput.trim();
      setFollowUpInput("");
      setIsSending(true);

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: question,
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const response = await onAskFollowUp(
          question,
          JSON.stringify(analysis),
        );
        const assistantMsg: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: response,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        incrementUsed();
      } catch {
        const errorMsg: ChatMessage = {
          id: `error_${Date.now()}`,
          role: "assistant",
          content: "Sorry, I couldn't process that question. Please try again.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
      }
    }, [followUpInput, isLocked, analysis, isSending, onAskFollowUp, incrementUsed]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col rounded-[24px] border border-[#123F3C] bg-[#122524] overflow-hidden",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#56C7F3]"
            >
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="font-manrope font-semibold text-white text-[14px] md:text-[16px] tracking-[-0.32px]">
              SKAI Chart AI
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#56C7F3]/15 text-[#56C7F3] font-medium">
              DEMO
            </span>
          </div>
          <span
            className={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded-full",
              isLocked
                ? "bg-[#FF6B6B]/15 text-[#FF6B6B]"
                : "bg-[rgba(255,255,255,0.06)] text-[#B0B0B0]",
            )}
          >
            {remaining}/{maxInteractions}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[500px] min-h-[200px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[90%] rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-[#56C7F3]/10 text-[#E0E0E0]"
                    : "bg-[rgba(255,255,255,0.04)] text-[#E0E0E0]",
                )}
              >
                {/* User chart image thumbnail */}
                {msg.role === "user" && msg.chartImage && (
                  <img
                    src={msg.chartImage}
                    alt="Uploaded chart"
                    className="w-full max-w-[300px] rounded-lg mb-2"
                  />
                )}

                <p className="text-[13px] leading-[20px] font-manrope whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Analysis result with overlay */}
                {msg.analysis && msg.chartImage && (
                  <div className="mt-3 space-y-3">
                    <ChartOverlayCanvas
                      imageSrc={msg.chartImage}
                      keyLevels={msg.analysis.keyLevels}
                      patternRegions={msg.analysis.patternRegions}
                      className="rounded-lg overflow-hidden"
                    />
                    <AnalysisSummary analysis={msg.analysis} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Analyzing spinner inline */}
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin" />
                <span className="text-[12px] text-[#B0B0B0]">
                  Analyzing chart...
                </span>
              </div>
            </div>
          )}

          {/* Sending spinner */}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin" />
                <span className="text-[12px] text-[#B0B0B0]">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.06)]">
          {isLocked ? (
            <div className="text-center py-3">
              <p className="text-[13px] text-[#B0B0B0] mb-2">
                You've used all {maxInteractions} free analyses!
              </p>
              <p className="text-[12px] text-[#56C7F3]">
                Full access coming soon at public launch.
              </p>
            </div>
          ) : !analysis ? (
            <DropZone
              onImageSelected={handleImageSelected}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleFollowUp();
                  }
                }}
                placeholder="Ask a follow-up question..."
                className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-[#808080] outline-none focus:border-[#56C7F3]/50 transition-colors font-manrope"
                disabled={isSending}
              />
              <button
                onClick={handleFollowUp}
                disabled={!followUpInput.trim() || isSending}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#56C7F3]/15 text-[#56C7F3] flex items-center justify-center hover:bg-[#56C7F3]/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);
ChartAICard.displayName = "ChartAICard";

export { ChartAICard };
