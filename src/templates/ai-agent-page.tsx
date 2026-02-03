/**
 * AIAgentPageTemplate
 * 
 * Pure presentational template for the AI trading assistant page.
 * This is an extremely complex page with chat, signals, trading panels,
 * and real-time data. Uses render props extensively for all panels.
 * 
 * @example
 * ```tsx
 * import { AIAgentPageTemplate } from '@skai/ui';
 * 
 * function AIAgent() {
 *   const { messages, signals, isConnected } = useAIAgent();
 *   return (
 *     <AIAgentPageTemplate
 *       messages={messages}
 *       signals={signals}
 *       isConnected={isConnected}
 *       renderChatPanel={() => <ChatPanel />}
 *       renderSignalsPanel={() => <SignalsPanel />}
 *       // ... other render props
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Textarea } from "../components/core/textarea";
import { ScrollArea } from "../components/layout/scroll-area";
import { Skeleton } from "../components/feedback/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";

// ============================================================================
// TYPES
// ============================================================================

export type AgentStatus = 'online' | 'offline' | 'busy' | 'thinking' | 'error';
export type SignalType = 'BUY' | 'SELL' | 'HOLD' | 'ALERT';
export type SignalStrength = 'STRONG' | 'MODERATE' | 'WEAK';

export interface AIMessage {
  /** Unique message ID */
  id: string;
  /** Message content */
  content: string;
  /** Sender role */
  role: 'user' | 'assistant' | 'system';
  /** Timestamp */
  timestamp: Date;
  /** Whether pending/sending */
  isPending?: boolean;
  /** Error if failed */
  error?: string;
  /** Associated action (trade, analysis, etc.) */
  action?: {
    type: 'trade' | 'analysis' | 'alert' | 'recommendation';
    data?: Record<string, unknown>;
  };
}

export interface AISignal {
  /** Signal ID */
  id: string;
  /** Token/asset */
  token: string;
  /** Token symbol */
  symbol: string;
  /** Token icon URL */
  iconUrl?: string;
  /** Signal type */
  type: SignalType;
  /** Signal strength */
  strength: SignalStrength;
  /** Signal message */
  message: string;
  /** Price at signal */
  price?: number;
  /** Target price */
  targetPrice?: number;
  /** Stop loss price */
  stopLoss?: number;
  /** Confidence percentage 0-100 */
  confidence?: number;
  /** Timestamp */
  timestamp: Date;
  /** Strategy that generated signal */
  strategy?: string;
  /** Whether user acted on signal */
  acted?: boolean;
}

export interface AIAgentInfo {
  /** Agent name */
  name: string;
  /** Agent avatar URL */
  avatarUrl?: string;
  /** Agent status */
  status: AgentStatus;
  /** Agent capabilities */
  capabilities?: string[];
  /** Uptime */
  uptime?: number;
  /** Total trades executed */
  totalTrades?: number;
  /** Win rate percentage */
  winRate?: number;
  /** Profit/Loss amount */
  pnl?: number;
}

export interface IntelligenceMetric {
  /** Metric label */
  label: string;
  /** Metric value */
  value: string | number;
  /** Change percentage */
  change?: number;
  /** Icon emoji */
  icon?: string;
}

export type AIAgentTabType = 
  | 'chat' 
  | 'signals' 
  | 'whale' 
  | 'copy' 
  | 'arbitrage' 
  | 'portfolio' 
  | 'settings';

export interface AIAgentPageProps {
  /** Agent information */
  agent?: AIAgentInfo;
  /** WebSocket connection status */
  isConnected?: boolean;
  /** Whether loading */
  isLoading?: boolean;
  /** Chat messages */
  messages?: AIMessage[];
  /** Current signals */
  signals?: AISignal[];
  /** Currently active tab */
  activeTab?: AIAgentTabType;
  /** Callback when tab changes */
  onTabChange?: (tab: AIAgentTabType) => void;
  /** Whether sidebar is visible */
  showSidebar?: boolean;
  /** Toggle sidebar visibility */
  onToggleSidebar?: () => void;
  /** Intelligence metrics for sidebar */
  intelligence?: IntelligenceMetric[];
  
  // Chat props
  /** Current chat input value */
  chatInput?: string;
  /** Callback when chat input changes */
  onChatInputChange?: (value: string) => void;
  /** Callback when sending message */
  onSendMessage?: () => void;
  /** Whether currently sending/thinking */
  isSending?: boolean;
  /** Voice recording active */
  isRecording?: boolean;
  /** Toggle voice recording */
  onToggleRecording?: () => void;
  /** Clear chat history */
  onClearChat?: () => void;
  
  // Signal props
  /** Callback when clicking a signal */
  onSignalClick?: (signal: AISignal) => void;
  /** Filter signals by type */
  signalFilter?: SignalType | 'ALL';
  /** Change signal filter */
  onSignalFilterChange?: (filter: SignalType | 'ALL') => void;
  
  // Action props
  /** Pending trade action */
  pendingAction?: {
    type: 'trade' | 'confirm';
    data: Record<string, unknown>;
  };
  /** Confirm pending action */
  onConfirmAction?: () => void;
  /** Cancel pending action */
  onCancelAction?: () => void;
  
  // ============================================================================
  // RENDER PROPS FOR PANELS
  // ============================================================================
  
  /** Render the chat panel */
  renderChatPanel?: () => React.ReactNode;
  /** Render the signals panel */
  renderSignalsPanel?: () => React.ReactNode;
  /** Render whale tracking panel */
  renderWhalePanel?: () => React.ReactNode;
  /** Render copy trading panel */
  renderCopyPanel?: () => React.ReactNode;
  /** Render arbitrage panel */
  renderArbitragePanel?: () => React.ReactNode;
  /** Render portfolio analysis panel */
  renderPortfolioPanel?: () => React.ReactNode;
  /** Render settings panel */
  renderSettingsPanel?: () => React.ReactNode;
  /** Render custom quick actions */
  renderQuickActions?: () => React.ReactNode;
  /** Render price ticker */
  renderPriceTicker?: () => React.ReactNode;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface AgentHeaderProps {
  agent?: AIAgentInfo;
  isConnected?: boolean;
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
}

function AgentHeader({ agent, isConnected, onToggleSidebar, showSidebar }: AgentHeaderProps) {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'busy': return 'bg-yellow-500';
      case 'thinking': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
    }
  };
  
  const getStatusText = (status: AgentStatus) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'busy': return 'Busy';
      case 'thinking': return 'Thinking...';
      case 'error': return 'Error';
    }
  };
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={agent?.avatarUrl} alt={agent?.name} />
          <AvatarFallback className="bg-primary/20">
            <span className="text-lg">🤖</span>
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            {agent?.name || 'AI Agent'}
            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent?.status || 'offline')}`} />
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{getStatusText(agent?.status || 'offline')}</span>
            {isConnected !== undefined && (
              <>
                <span>•</span>
                <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
                  {isConnected ? '🔗 Connected' : '⛓️‍💥 Disconnected'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {agent?.winRate !== undefined && (
          <Badge variant="outline" className="gap-1">
            <span>📈</span>
            {agent.winRate.toFixed(1)}% Win Rate
          </Badge>
        )}
        {agent?.pnl !== undefined && (
          <Badge 
            variant={agent.pnl >= 0 ? 'default' : 'destructive'}
            className="gap-1"
          >
            {agent.pnl >= 0 ? '💰' : '📉'}
            {agent.pnl >= 0 ? '+' : ''}{agent.pnl.toFixed(2)}
          </Badge>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleSidebar}
        >
          {showSidebar ? '◀️' : '▶️'}
        </Button>
      </div>
    </div>
  );
}

interface TabNavigationProps {
  activeTab: AIAgentTabType;
  onTabChange: (tab: AIAgentTabType) => void;
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: AIAgentTabType; label: string; icon: string }[] = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'signals', label: 'Signals', icon: '📡' },
    { id: 'whale', label: 'Whale Tracking', icon: '🐋' },
    { id: 'copy', label: 'Copy Trading', icon: '📋' },
    { id: 'arbitrage', label: 'Arbitrage', icon: '⚖️' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];
  
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto">
      {tabs.map(tab => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className="gap-2 whitespace-nowrap"
        >
          <span>{tab.icon}</span>
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

interface IntelligenceSidebarProps {
  metrics?: IntelligenceMetric[];
  signals?: AISignal[];
  onSignalClick?: (signal: AISignal) => void;
}

function IntelligenceSidebar({ metrics = [], signals = [], onSignalClick }: IntelligenceSidebarProps) {
  const recentSignals = signals.slice(0, 5);
  
  return (
    <div className="w-72 border-l border-border bg-card/30 flex flex-col">
      {/* Intelligence Metrics */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span>🧠</span>
          Intelligence
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric, i) => (
            <div key={i} className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                {metric.icon && <span>{metric.icon}</span>}
                {metric.label}
              </div>
              <div className="text-sm font-semibold">
                {metric.value}
                {metric.change !== undefined && (
                  <span className={`text-xs ml-1 ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Signals */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-sm font-semibold px-4 py-3 flex items-center gap-2 border-b border-border">
          <span>📡</span>
          Recent Signals
        </h3>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {recentSignals.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No signals yet
              </p>
            ) : (
              recentSignals.map(signal => (
                <button
                  key={signal.id}
                  onClick={() => onSignalClick?.(signal)}
                  className="w-full p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{signal.symbol}</span>
                    <Badge 
                      variant={
                        signal.type === 'BUY' ? 'default' : 
                        signal.type === 'SELL' ? 'destructive' : 
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {signal.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {signal.message}
                  </p>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT CHAT INTERFACE
// ============================================================================

interface DefaultChatPanelProps {
  messages?: AIMessage[];
  chatInput?: string;
  onChatInputChange?: (value: string) => void;
  onSendMessage?: () => void;
  isSending?: boolean;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  onClearChat?: () => void;
}

function DefaultChatPanel({
  messages = [],
  chatInput = '',
  onChatInputChange,
  onSendMessage,
  isSending,
  isRecording,
  onToggleRecording,
  onClearChat,
}: DefaultChatPanelProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(date);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="font-semibold">💬 Chat with AI</h2>
        <Button variant="ghost" size="sm" onClick={onClearChat}>
          🗑️ Clear
        </Button>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🤖</span>
              <p className="text-muted-foreground">
                Start a conversation with your AI trading assistant
              </p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.role === 'system'
                      ? 'bg-muted text-muted-foreground italic'
                      : 'bg-card border border-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    {message.isPending && <span className="text-xs">⏳</span>}
                    {message.error && <span className="text-xs text-destructive">❌</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Ask the AI assistant..."
            value={chatInput}
            onChange={(e) => onChatInputChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage?.();
              }
            }}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isSending}
          />
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              variant={isRecording ? 'destructive' : 'outline'}
              onClick={onToggleRecording}
              disabled={isSending}
            >
              {isRecording ? '⏹️' : '🎤'}
            </Button>
            <Button
              size="icon"
              onClick={onSendMessage}
              disabled={isSending || !chatInput?.trim()}
            >
              {isSending ? '⏳' : '📤'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT SIGNALS PANEL
// ============================================================================

interface DefaultSignalsPanelProps {
  signals?: AISignal[];
  filter?: SignalType | 'ALL';
  onFilterChange?: (filter: SignalType | 'ALL') => void;
  onSignalClick?: (signal: AISignal) => void;
}

function DefaultSignalsPanel({ 
  signals = [], 
  filter = 'ALL', 
  onFilterChange,
  onSignalClick,
}: DefaultSignalsPanelProps) {
  const filteredSignals = filter === 'ALL' 
    ? signals 
    : signals.filter(s => s.type === filter);
  
  const getSignalIcon = (type: SignalType) => {
    switch (type) {
      case 'BUY': return '🟢';
      case 'SELL': return '🔴';
      case 'HOLD': return '🟡';
      case 'ALERT': return '⚠️';
    }
  };
  
  const getStrengthBars = (strength: SignalStrength) => {
    switch (strength) {
      case 'STRONG': return '███';
      case 'MODERATE': return '██░';
      case 'WEAK': return '█░░';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header with filters */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="font-semibold flex items-center gap-2">
          <span>📡</span>
          Trading Signals
        </h2>
        <div className="flex items-center gap-1">
          {(['ALL', 'BUY', 'SELL', 'HOLD', 'ALERT'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange?.(f)}
            >
              {f === 'ALL' ? 'All' : getSignalIcon(f)}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Signals List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredSignals.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📡</span>
              <p className="text-muted-foreground">
                No {filter !== 'ALL' ? filter.toLowerCase() : ''} signals
              </p>
            </div>
          ) : (
            filteredSignals.map(signal => (
              <Card 
                key={signal.id} 
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => onSignalClick?.(signal)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {signal.iconUrl ? (
                        <img src={signal.iconUrl} alt={signal.symbol} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm">{signal.symbol[0]}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{signal.symbol}</p>
                        <p className="text-xs text-muted-foreground">{signal.token}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          signal.type === 'BUY' ? 'default' : 
                          signal.type === 'SELL' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {getSignalIcon(signal.type)} {signal.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{signal.message}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      {signal.price && (
                        <span>💰 ${signal.price.toFixed(4)}</span>
                      )}
                      {signal.targetPrice && (
                        <span className="text-green-500">🎯 ${signal.targetPrice.toFixed(4)}</span>
                      )}
                      {signal.stopLoss && (
                        <span className="text-red-500">🛑 ${signal.stopLoss.toFixed(4)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono">{getStrengthBars(signal.strength)}</span>
                      {signal.confidence !== undefined && (
                        <span>{signal.confidence}%</span>
                      )}
                    </div>
                  </div>
                  
                  {signal.strategy && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Strategy: {signal.strategy}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function AIAgentLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      
      {/* Tabs skeleton */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-2/3" />
      </div>
    </div>
  );
}

// ============================================================================
// PENDING ACTION DIALOG
// ============================================================================

interface PendingActionProps {
  action?: {
    type: 'trade' | 'confirm';
    data: Record<string, unknown>;
  };
  onConfirm?: () => void;
  onCancel?: () => void;
}

function PendingAction({ action, onConfirm, onCancel }: PendingActionProps) {
  if (!action) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {action.type === 'trade' ? '📊' : '✅'}
            Confirm Action
          </CardTitle>
          <CardDescription>
            {action.type === 'trade' 
              ? 'Review and confirm this trade'
              : 'Please confirm this action'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-3 rounded-lg bg-muted text-xs overflow-auto max-h-48">
            {JSON.stringify(action.data, null, 2)}
          </pre>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function AIAgentPageTemplate({
  agent,
  isConnected,
  isLoading = false,
  messages = [],
  signals = [],
  activeTab = 'chat',
  onTabChange,
  showSidebar = true,
  onToggleSidebar,
  intelligence = [],
  chatInput,
  onChatInputChange,
  onSendMessage,
  isSending,
  isRecording,
  onToggleRecording,
  onClearChat,
  onSignalClick,
  signalFilter = 'ALL',
  onSignalFilterChange,
  pendingAction,
  onConfirmAction,
  onCancelAction,
  renderChatPanel,
  renderSignalsPanel,
  renderWhalePanel,
  renderCopyPanel,
  renderArbitragePanel,
  renderPortfolioPanel,
  renderSettingsPanel,
  renderQuickActions,
  renderPriceTicker,
}: AIAgentPageProps) {
  // Loading state
  if (isLoading) {
    return <AIAgentLoadingSkeleton />;
  }
  
  // Get content for active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return renderChatPanel?.() ?? (
          <DefaultChatPanel
            messages={messages}
            chatInput={chatInput}
            onChatInputChange={onChatInputChange}
            onSendMessage={onSendMessage}
            isSending={isSending}
            isRecording={isRecording}
            onToggleRecording={onToggleRecording}
            onClearChat={onClearChat}
          />
        );
      case 'signals':
        return renderSignalsPanel?.() ?? (
          <DefaultSignalsPanel
            signals={signals}
            filter={signalFilter}
            onFilterChange={onSignalFilterChange}
            onSignalClick={onSignalClick}
          />
        );
      case 'whale':
        return renderWhalePanel?.() ?? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4">🐋</span>
            <p className="text-muted-foreground">Whale Tracking Panel</p>
            <p className="text-xs text-muted-foreground mt-2">Pass renderWhalePanel prop to customize</p>
          </div>
        );
      case 'copy':
        return renderCopyPanel?.() ?? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4">📋</span>
            <p className="text-muted-foreground">Copy Trading Panel</p>
            <p className="text-xs text-muted-foreground mt-2">Pass renderCopyPanel prop to customize</p>
          </div>
        );
      case 'arbitrage':
        return renderArbitragePanel?.() ?? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4">⚖️</span>
            <p className="text-muted-foreground">Arbitrage Panel</p>
            <p className="text-xs text-muted-foreground mt-2">Pass renderArbitragePanel prop to customize</p>
          </div>
        );
      case 'portfolio':
        return renderPortfolioPanel?.() ?? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4">💼</span>
            <p className="text-muted-foreground">Portfolio Analysis Panel</p>
            <p className="text-xs text-muted-foreground mt-2">Pass renderPortfolioPanel prop to customize</p>
          </div>
        );
      case 'settings':
        return renderSettingsPanel?.() ?? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4">⚙️</span>
            <p className="text-muted-foreground">Agent Settings Panel</p>
            <p className="text-xs text-muted-foreground mt-2">Pass renderSettingsPanel prop to customize</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Price Ticker (optional) */}
      {renderPriceTicker && (
        <div className="border-b border-border">
          {renderPriceTicker()}
        </div>
      )}
      
      {/* Agent Header */}
      <AgentHeader 
        agent={agent}
        isConnected={isConnected}
        onToggleSidebar={onToggleSidebar}
        showSidebar={showSidebar}
      />
      
      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={onTabChange || (() => {})} 
      />
      
      {/* Quick Actions (optional) */}
      {renderQuickActions && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          {renderQuickActions()}
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {renderTabContent()}
        </div>
        
        {/* Intelligence Sidebar */}
        {showSidebar && (
          <IntelligenceSidebar 
            metrics={intelligence}
            signals={signals}
            onSignalClick={onSignalClick}
          />
        )}
      </div>
      
      {/* Pending Action Dialog */}
      <PendingAction 
        action={pendingAction}
        onConfirm={onConfirmAction}
        onCancel={onCancelAction}
      />
    </div>
  );
}

export default AIAgentPageTemplate;
