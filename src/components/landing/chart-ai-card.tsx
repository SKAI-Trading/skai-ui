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
  detectedSymbol?: string;
  detectedTimeframe?: string;
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
  onAnalyzeChart: (imageBase64: string) => Promise<ChartAnalysisResult>;
  onAskFollowUp: (question: string, analysisContext: string) => Promise<string>;
  onResetChart?: () => void;
  onShareAnalysis?: (analysis: ChartAnalysisResult, chartImage: string) => void;
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
  if (!username) {
    return `skai_chart_ai_used_anon_${typeof window !== "undefined" ? window.location.hostname : "unknown"}`;
  }
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

function CollapsibleSection({
  title,
  defaultExpanded = true,
  children,
}: {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-left group"
      >
        <span className={cn(
          "text-[11px] text-[#95A09F] transition-transform duration-200 inline-block",
          expanded ? "rotate-90" : "rotate-0",
        )}>
          ▸
        </span>
        <span className="font-['Manrope',sans-serif] font-bold text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] group-hover:text-[#56C7F3] transition-colors">
          {title}
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function AnalysisSummary({
  analysis,
  chartImage,
  onShareAnalysis,
}: {
  analysis: ChartAnalysisResult;
  chartImage?: string;
  onShareAnalysis?: (analysis: ChartAnalysisResult, chartImage: string) => void;
}) {
  const conf = normalizeConfidence(analysis.overallAssessment.confidence);
  const bias = analysis.overallAssessment.bias;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = [
      "SKAI Chart AI Analysis",
      `${bias.charAt(0).toUpperCase() + bias.slice(1)} (${conf}%)`,
      `Trend: ${analysis.trendAnalysis.direction}, ${analysis.trendAnalysis.strength}`,
      analysis.patterns.length > 0
        ? `Patterns: ${analysis.patterns.map((p) => p.name).join(", ")}`
        : null,
      analysis.keyLevels.length > 0
        ? `Levels: ${analysis.keyLevels.slice(0, 4).map((l) => `${l.type === "support" ? "S" : l.type === "resistance" ? "R" : "P"}: ${l.price || l.description}`).join(", ")}`
        : null,
      `Summary: ${analysis.overallAssessment.summary}`,
      analysis.overallAssessment.recommendations.length > 0
        ? `Recommendations: ${analysis.overallAssessment.recommendations.join("; ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [analysis, bias, conf]);

  const handleShare = useCallback(() => {
    if (onShareAnalysis && chartImage) {
      onShareAnalysis(analysis, chartImage);
    }
  }, [onShareAnalysis, analysis, chartImage]);

  return (
    <div className="flex flex-col gap-[8px] mt-2">
      {/* Overall bias + confidence + action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-['Manrope',sans-serif] font-bold text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
          {BIAS_ICONS[bias] || "◆"}{" "}
          <span
            className={cn(
              bias === "bullish" && "text-[#2DEDAD]",
              bias === "bearish" && "text-[#FF6B6B]",
              bias === "neutral" && "text-[#E0E0E0]",
            )}
          >
            {bias.charAt(0).toUpperCase() + bias.slice(1)}
          </span>
        </span>
        <span
          className={cn(
            "text-[11px] px-2 py-0.5 rounded-full font-medium",
            conf >= 70 && "bg-[#2DEDAD]/[0.13] text-[#2DEDAD]",
            conf >= 40 && conf < 70 && "bg-[#F5A623]/[0.13] text-[#F5A623]",
            conf < 40 && "bg-[#FF6B6B]/[0.13] text-[#FF6B6B]",
          )}
        >
          {conf}%
        </span>

        {/* Copy button */}
        <button
          type="button"
          title={copied ? "Copied!" : "Copy analysis"}
          onClick={handleCopy}
          className="ml-auto flex-shrink-0 w-7 h-7 rounded-md bg-[#001615]/40 text-[#95A09F] flex items-center justify-center hover:bg-[#001615]/60 hover:text-[#56C7F3] transition-colors"
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#2DEDAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>

        {/* Share button */}
        {onShareAnalysis && chartImage && (
          <button
            type="button"
            title="Share analysis"
            onClick={handleShare}
            className="flex-shrink-0 w-7 h-7 rounded-md bg-[#001615]/40 text-[#95A09F] flex items-center justify-center hover:bg-[#001615]/60 hover:text-[#56C7F3] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Trend */}
      <p className="font-['Manrope',sans-serif] font-normal text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
        <span className="font-bold">Trend:</span>{" "}
        {analysis.trendAnalysis.direction}, {analysis.trendAnalysis.strength}
      </p>

      {/* Summary — always visible, this is the primary output */}
      <p className="font-['Manrope',sans-serif] font-normal text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
        {analysis.overallAssessment.summary}
      </p>

      {/* Recommendations — visible by default, most actionable */}
      {analysis.overallAssessment.recommendations.length > 0 && (
        <CollapsibleSection title="Recommendations" defaultExpanded={true}>
          <div className="flex flex-col gap-1">
            {analysis.overallAssessment.recommendations.map((rec, i) => (
              <p
                key={i}
                className="font-['Manrope',sans-serif] font-normal text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#2DEDAD]"
              >
                → {rec}
              </p>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Patterns */}
      {analysis.patterns.length > 0 && (
        <CollapsibleSection title="Patterns" defaultExpanded={true}>
          <div className="flex flex-wrap gap-1.5">
            {analysis.patterns.map((p, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-[4px] font-medium"
                style={{
                  borderColor: CONFIDENCE_COLORS[p.confidence] + "44",
                  color: CONFIDENCE_COLORS[p.confidence],
                  backgroundColor: CONFIDENCE_COLORS[p.confidence] + "15",
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Key Levels */}
      {analysis.keyLevels.length > 0 && (
        <CollapsibleSection title="Key Levels" defaultExpanded={true}>
          <p className="font-['Manrope',sans-serif] font-normal text-[13px] md:text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
            {analysis.keyLevels
              .slice(0, 4)
              .map(
                (l) =>
                  `${l.type === "support" ? "S" : l.type === "resistance" ? "R" : "P"}: ${l.price || l.description}`,
              )
              .join(" · ")}
          </p>
        </CollapsibleSection>
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
      <div className="flex flex-col gap-3 py-2">
        {/* Skeleton shimmer: chart area */}
        <div className="w-full rounded-lg bg-[#001615]/40 animate-pulse aspect-video" />
        {/* Skeleton shimmer: text lines */}
        <div className="flex flex-col gap-2">
          <div className="h-3 w-3/4 rounded bg-[#001615]/40 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-[#001615]/40 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-[#001615]/40 animate-pulse" />
        </div>
        <span className="font-['Manrope',sans-serif] font-normal text-[12px] leading-[18px] text-[#95A09F]">
          Analyzing your chart...
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "border border-dashed rounded-lg p-3 md:p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
          isDragging
            ? "border-[#56C7F3] bg-[#56C7F3]/10"
            : "border-[#95A09F]/30 bg-[#001615]/40 hover:border-[#56C7F3]/50 hover:bg-[#56C7F3]/5",
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
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#95A09F]"
        >
          <path
            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] text-center">
          Drop or paste a chart image
        </span>
        <span className="font-['Manrope',sans-serif] font-normal text-[12px] leading-[18px] text-[#95A09F] text-center">
          or click to upload &middot; Best results with chart-only screenshots
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
      onResetChart,
      onShareAnalysis,
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
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const isLocked = usedCount >= maxInteractions;
    const remaining = Math.max(0, maxInteractions - usedCount);

    const scrollToBottom = useCallback(() => {
      requestAnimationFrame(() => {
        // Scroll the chat container to the bottom
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        // Also scroll the page so the card's bottom is visible
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, isAnalyzing, isSending, scrollToBottom]);

    useEffect(() => {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: `Hey ${username}! Upload or paste any trading chart and I'll analyze patterns, key levels, and give you trade recommendations.`,
        },
      ]);
    }, [username]);

    const incrementUsed = useCallback(() => {
      const next = usedCount + 1;
      setUsedCountState(next);
      setUsedCount(username, next);
    }, [usedCount, username]);

    const handleReset = useCallback(() => {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: `Hey ${username}! Upload or paste any trading chart and I'll analyze patterns, key levels, and give you trade recommendations.`,
        },
      ]);
      setAnalysis(null);
      setFollowUpInput("");
      onResetChart?.();
    }, [username, onResetChart]);

    const handleImageSelected = useCallback(
      async (base64: string) => {
        if (isLocked) return;
        setIsAnalyzing(true);

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
        } catch {
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
          "bg-[#123F3C] flex flex-col gap-[20px] rounded-lg p-[16px] relative",
          className,
        )}
        {...props}
      >
        {/* Header row — back + title + usage counter */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[8px]">
            {/* Back button */}
            {onResetChart && (
              <button
                type="button"
                title="Back"
                onClick={onResetChart}
                className="flex-shrink-0 w-6 h-6 rounded-md bg-[#001615]/40 text-[#95A09F] flex items-center justify-center hover:bg-[#001615]/60 hover:text-[#56C7F3] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {/* Chart pulse icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#56C7F3] flex-shrink-0"
            >
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
              SKAI Chart AI
            </p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#56C7F3]/15 text-[#56C7F3] font-medium font-['Manrope',sans-serif]">
              DEMO
            </span>
          </div>
          <span
            className={cn(
              "font-['Manrope',sans-serif] font-bold text-[11px] leading-[18px] tracking-[-0.56px] px-2 py-0.5 rounded-[4px]",
              isLocked
                ? "bg-[#FF6B6B]/15 text-[#FF6B6B]"
                : "bg-[#001615]/40 text-[#95A09F]",
            )}
          >
            {remaining}/{maxInteractions}
          </span>
        </div>

        {/* Expanded image lightbox */}
        {expandedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-[90vw] max-h-[85vh]">
              <img
                src={expandedImage}
                alt="Expanded chart"
                className="max-w-full max-h-[85vh] rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#001615]/80 text-white flex items-center justify-center hover:bg-[#001615] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div ref={chatContainerRef} className="flex flex-col gap-[8px] overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-[#001615]/60 rounded-lg p-[12px] max-w-[85%]">
                    {msg.chartImage && (
                      <div
                        className="relative max-w-[160px] rounded-[4px] mb-2 cursor-pointer group"
                        onClick={() => setExpandedImage(msg.chartImage!)}
                      >
                        <img
                          src={msg.chartImage}
                          alt="Uploaded chart"
                          className="w-full rounded-[4px] max-h-[100px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-[4px] flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <p className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[8px]">
                  {/* Show text content only for non-analysis messages (avoids duplicating the summary shown in AnalysisSummary) */}
                  {!msg.analysis && (
                    <p className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}

                  {/* Chart overlay + analysis — compact thumbnail with expand */}
                  {msg.analysis && msg.chartImage && (
                    <>
                      <div
                        className="relative max-w-[240px] rounded-[4px] overflow-hidden cursor-pointer group"
                        onClick={() => setExpandedImage(msg.chartImage!)}
                      >
                        <ChartOverlayCanvas
                          imageSrc={msg.chartImage}
                          keyLevels={msg.analysis.keyLevels}
                          patternRegions={msg.analysis.patternRegions}
                          detectedSymbol={msg.analysis.detectedSymbol}
                          detectedTimeframe={msg.analysis.detectedTimeframe}
                          className="rounded-[4px] overflow-hidden"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <AnalysisSummary
                        analysis={msg.analysis}
                        chartImage={msg.chartImage}
                        onShareAnalysis={onShareAnalysis}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Analyzing skeleton */}
          {isAnalyzing && (
            <div className="flex flex-col gap-3 py-1">
              <div className="w-full rounded-lg bg-[#001615]/40 animate-pulse aspect-video" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-3/4 rounded bg-[#001615]/40 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-[#001615]/40 animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-[#001615]/40 animate-pulse" />
              </div>
              <span className="font-['Manrope',sans-serif] font-normal text-[12px] leading-[18px] text-[#95A09F]">
                Analyzing chart...
              </span>
            </div>
          )}

          {/* Follow-up spinner */}
          {isSending && (
            <div className="flex items-center gap-3 py-1">
              <div className="w-4 h-4 border-2 border-[#56C7F3]/30 border-t-[#56C7F3] rounded-full animate-spin flex-shrink-0" />
              <span className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0]">
                Thinking...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {isLocked ? (
          <div className="flex flex-col gap-[8px] items-center py-1">
            <p className="font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] text-center">
              You've used all {maxInteractions} free analyses!
            </p>
            <p className="font-['Manrope',sans-serif] font-bold text-[14px] leading-[18px] tracking-[-0.56px] text-[#56C7F3]">
              Full access at public launch
            </p>
          </div>
        ) : !analysis ? (
          <DropZone
            onImageSelected={handleImageSelected}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <div className="flex items-center gap-[6px] md:gap-[8px]">
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
              className="flex-1 bg-[#001615]/60 border border-[#95A09F]/20 rounded-lg px-2.5 py-2 md:px-3 md:py-2.5 font-['Manrope',sans-serif] font-normal text-[14px] leading-[18px] tracking-[-0.56px] text-[#E0E0E0] placeholder:text-[#95A09F] outline-none focus:border-[#56C7F3]/50 transition-colors"
              disabled={isSending}
            />
            <button
              type="button"
              title="Send message"
              onClick={handleFollowUp}
              disabled={!followUpInput.trim() || isSending}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#001615]/60 text-[#56C7F3] flex items-center justify-center hover:bg-[#001615]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              title="New chart"
              onClick={handleReset}
              className="flex-shrink-0 h-9 px-2.5 rounded-lg bg-[#001615]/60 text-[#95A09F] flex items-center justify-center gap-1.5 hover:bg-[#001615]/80 hover:text-[#56C7F3] transition-colors font-['Manrope',sans-serif] font-medium text-[12px]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        )}
      </div>
    );
  },
);
ChartAICard.displayName = "ChartAICard";

export { ChartAICard };
