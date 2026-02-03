/**
 * AI Hub Page Template
 * 
 * AI-powered assistant hub with:
 * - Chat interface with suggestions
 * - Quick action modules
 * - Market signals integration
 * - Copy trading recommendations
 * - AI insights feed
 * 
 * @example
 * ```tsx
 * <AIHubPageTemplate
 *   suggestions={quickSuggestions}
 *   modules={featureModules}
 *   onSuggestionClick={handleSuggestion}
 *   onChatSubmit={handleChat}
 *   renderChatInterface={() => <ChatInterface />}
 * />
 * ```
 */

import * as React from "react";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface QuickSuggestion {
  id: string;
  text: string;
  icon?: React.ReactNode;
  route?: string | null;
  action?: string;
}

export interface FeatureModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  gradient?: string;
  accent?: string;
}

export interface MarketSignal {
  id: string;
  type: "bullish" | "bearish" | "neutral";
  asset: string;
  message: string;
  confidence: number;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  category: "market" | "opportunity" | "risk" | "tip";
  timestamp: string;
  actionLabel?: string;
  actionRoute?: string;
}

export interface AIHubPageTemplateProps {
  /** Quick suggestion chips */
  suggestions: QuickSuggestion[];
  /** Feature modules for quick access */
  modules: FeatureModule[];
  /** Market signals */
  signals?: MarketSignal[];
  /** AI insights feed */
  insights?: AIInsight[];
  /** Chat input value */
  inputValue?: string;
  /** Whether AI is typing/thinking */
  isTyping?: boolean;
  /** Whether chat is shown */
  showChat?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Whether user is connected */
  isConnected?: boolean;
  /** User's wallet address */
  walletAddress?: string;
  /** Input change handler */
  onInputChange?: (value: string) => void;
  /** Chat submit handler */
  onChatSubmit?: (message: string) => void;
  /** Suggestion click handler */
  onSuggestionClick?: (suggestion: QuickSuggestion) => void;
  /** Module click handler */
  onModuleClick?: (module: FeatureModule) => void;
  /** Signal click handler */
  onSignalClick?: (signal: MarketSignal) => void;
  /** Insight action click handler */
  onInsightAction?: (insight: AIInsight) => void;
  /** Show chat handler */
  onShowChat?: () => void;
  /** Connect wallet handler */
  onConnect?: () => void;
  /** Render custom chat interface */
  renderChatInterface?: () => React.ReactNode;
  /** Render market signals card */
  renderSignalsCard?: () => React.ReactNode;
  /** Render copy trading card */
  renderCopyTradingCard?: () => React.ReactNode;
  /** Render insights feed */
  renderInsightsFeed?: () => React.ReactNode;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

interface SuggestionChipsProps {
  suggestions: QuickSuggestion[];
  onSuggestionClick?: (suggestion: QuickSuggestion) => void;
}

function SuggestionChips({ suggestions, onSuggestionClick }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onSuggestionClick?.(suggestion)}
        >
          {suggestion.icon}
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
}

interface ModuleGridProps {
  modules: FeatureModule[];
  onModuleClick?: (module: FeatureModule) => void;
}

function ModuleGrid({ modules, onModuleClick }: ModuleGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {modules.map((module) => (
        <Card
          key={module.id}
          className={cn(
            "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
            module.gradient && `bg-gradient-to-br ${module.gradient}`
          )}
          onClick={() => onModuleClick?.(module)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50">
                {module.icon}
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{module.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface ChatInputProps {
  value?: string;
  isTyping?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (message: string) => void;
}

function ChatInput({ value = "", isTyping, onChange, onSubmit }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isTyping) {
      onSubmit?.(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        placeholder="Ask SKAI anything about trading, markets, or crypto..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pr-24 py-6 text-lg"
        disabled={isTyping}
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        disabled={!value.trim() || isTyping}
      >
        {isTyping ? "Thinking..." : "Send"}
      </Button>
    </form>
  );
}

interface SignalsListProps {
  signals: MarketSignal[];
  onSignalClick?: (signal: MarketSignal) => void;
}

function SignalsList({ signals, onSignalClick }: SignalsListProps) {
  const typeColors = {
    bullish: "text-green-500 bg-green-500/10",
    bearish: "text-red-500 bg-red-500/10",
    neutral: "text-yellow-500 bg-yellow-500/10",
  };

  return (
    <div className="space-y-3">
      {signals.map((signal) => (
        <div
          key={signal.id}
          className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onSignalClick?.(signal)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{signal.asset}</span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              typeColors[signal.type]
            )}>
              {signal.type.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{signal.message}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Confidence: {signal.confidence}%</span>
            <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

interface InsightsFeedProps {
  insights: AIInsight[];
  onInsightAction?: (insight: AIInsight) => void;
}

function InsightsFeed({ insights, onInsightAction }: InsightsFeedProps) {
  const categoryColors = {
    market: "bg-blue-500/10 text-blue-500",
    opportunity: "bg-green-500/10 text-green-500",
    risk: "bg-red-500/10 text-red-500",
    tip: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                categoryColors[insight.category]
              )}>
                {insight.category.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(insight.timestamp).toLocaleString()}
              </span>
            </div>
            <CardTitle className="text-base">{insight.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{insight.content}</p>
            {insight.actionLabel && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onInsightAction?.(insight)}
              >
                {insight.actionLabel}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function AIHubPageTemplate({
  suggestions,
  modules,
  signals = [],
  insights = [],
  inputValue = "",
  isTyping = false,
  showChat = false,
  isLoading = false,
  isConnected = true,
  walletAddress: _walletAddress,
  onInputChange,
  onChatSubmit,
  onSuggestionClick,
  onModuleClick,
  onSignalClick,
  onInsightAction,
  onShowChat: _onShowChat,
  onConnect,
  renderChatInterface,
  renderSignalsCard,
  renderCopyTradingCard,
  renderInsightsFeed,
  headerContent,
  footerContent,
  className,
}: AIHubPageTemplateProps) {
  // Props prefixed with _ are available for consumer implementation
  void _walletAddress;
  void _onShowChat;

  // Chat view
  if (showChat && renderChatInterface) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderChatInterface()}
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-primary">SKAI</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your AI-powered trading assistant. Ask me anything about markets, 
          get trade recommendations, or explore platform features.
        </p>

        {/* Chat Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <ChatInput
            value={inputValue}
            isTyping={isTyping}
            onChange={onInputChange}
            onSubmit={onChatSubmit}
          />
        </div>

        {/* Suggestions */}
        <div className="flex justify-center">
          <SuggestionChips 
            suggestions={suggestions} 
            onSuggestionClick={onSuggestionClick}
          />
        </div>
      </div>

      {headerContent}

      {/* Feature Modules */}
      <section>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <ModuleGrid modules={modules} onModuleClick={onModuleClick} />
      </section>

      {/* Signals and Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Market Signals */}
        <section>
          <h2 className="text-xl font-bold mb-4">Market Signals</h2>
          {renderSignalsCard ? (
            renderSignalsCard()
          ) : isLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : signals.length > 0 ? (
            <Card>
              <CardContent className="py-4">
                <SignalsList signals={signals} onSignalClick={onSignalClick} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No signals available
              </CardContent>
            </Card>
          )}
        </section>

        {/* AI Insights */}
        <section>
          <h2 className="text-xl font-bold mb-4">AI Insights</h2>
          {renderInsightsFeed ? (
            renderInsightsFeed()
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : insights.length > 0 ? (
            <InsightsFeed insights={insights} onInsightAction={onInsightAction} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No insights available
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Copy Trading Card */}
      {renderCopyTradingCard && (
        <section>
          <h2 className="text-xl font-bold mb-4">Copy Trading</h2>
          {renderCopyTradingCard()}
        </section>
      )}

      {/* Connect Prompt */}
      {!isConnected && (
        <Card className="border-primary/50">
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to get personalized AI insights and recommendations
            </p>
            <Button onClick={onConnect}>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}

      {footerContent}
    </div>
  );
}

export default AIHubPageTemplate;
