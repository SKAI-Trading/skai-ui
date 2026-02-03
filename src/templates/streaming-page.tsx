/**
 * StreamingPageTemplate
 * 
 * Pure presentational template for the live streaming page.
 * Supports browsing streams, watching, and broadcasting.
 * 
 * @example
 * ```tsx
 * import { StreamingPageTemplate } from '@skai/ui';
 * 
 * function Streaming() {
 *   return (
 *     <StreamingPageTemplate
 *       streams={liveStreams}
 *       currentStream={selectedStream}
 *       renderPlayer={() => <StreamPlayer />}
 *       renderChat={() => <StreamChat />}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { ScrollArea } from "../components/layout/scroll-area";
import { Skeleton } from "../components/feedback/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";

// ============================================================================
// TYPES
// ============================================================================

export type StreamStatus = 'live' | 'offline' | 'ending' | 'starting';

export interface StreamerInfo {
  /** Streamer ID */
  id: string;
  /** Username */
  username: string;
  /** Display name */
  displayName?: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Is verified */
  isVerified?: boolean;
  /** Follower count */
  followers?: number;
  /** Social token symbol */
  tokenSymbol?: string;
}

export interface LiveStream {
  /** Stream ID */
  id: string;
  /** Stream title */
  title: string;
  /** Streamer info */
  streamer: StreamerInfo;
  /** Stream status */
  status: StreamStatus;
  /** Viewer count */
  viewers: number;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Stream category */
  category?: string;
  /** Tags */
  tags?: string[];
  /** Started at */
  startedAt?: Date;
  /** Is copy trading enabled */
  copyTradingEnabled?: boolean;
  /** Total trades on stream */
  tradesCount?: number;
  /** PnL on stream */
  streamPnl?: number;
}

export interface StreamChatMessage {
  /** Message ID */
  id: string;
  /** Sender info */
  sender: {
    id: string;
    username: string;
    avatarUrl?: string;
    badges?: string[];
  };
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: Date;
  /** Is pinned */
  isPinned?: boolean;
  /** Is donation */
  isDonation?: boolean;
  /** Donation amount */
  donationAmount?: number;
}

export type StreamingView = 'browse' | 'watch' | 'broadcast';

export interface StreamingPageProps {
  /** Current view */
  view?: StreamingView;
  /** Callback when view changes */
  onViewChange?: (view: StreamingView) => void;
  /** Whether user is logged in */
  isLoggedIn?: boolean;
  /** Current user info */
  currentUser?: StreamerInfo;
  /** Whether loading */
  isLoading?: boolean;
  /** List of live streams */
  streams?: LiveStream[];
  /** Currently selected stream */
  currentStream?: LiveStream | null;
  /** Callback when selecting a stream */
  onSelectStream?: (stream: LiveStream) => void;
  /** Chat messages for current stream */
  chatMessages?: StreamChatMessage[];
  /** Chat input value */
  chatInput?: string;
  /** Callback when chat input changes */
  onChatInputChange?: (value: string) => void;
  /** Send chat message */
  onSendChatMessage?: () => void;
  /** Whether copy trading is active */
  isCopyingTrades?: boolean;
  /** Toggle copy trading */
  onToggleCopyTrading?: () => void;
  /** Copy trading amount */
  copyAmount?: number;
  /** Search query */
  searchQuery?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Active category filter */
  activeCategory?: string;
  /** Callback when category changes */
  onCategoryChange?: (category: string) => void;
  /** Whether user is currently streaming */
  isStreaming?: boolean;
  /** Start streaming */
  onStartStream?: () => void;
  /** End streaming */
  onEndStream?: () => void;
  /** Stream duration in seconds */
  streamDuration?: number;
  
  // Render props
  /** Render stream player */
  renderPlayer?: () => React.ReactNode;
  /** Render chat panel */
  renderChat?: () => React.ReactNode;
  /** Render broadcaster */
  renderBroadcaster?: () => React.ReactNode;
  /** Render stream analytics */
  renderAnalytics?: () => React.ReactNode;
  /** Render donation panel */
  renderDonationPanel?: () => React.ReactNode;
  /** Render copy trading panel */
  renderCopyTradingPanel?: () => React.ReactNode;
  /** Render moderator tools */
  renderModeratorTools?: () => React.ReactNode;
}

// ============================================================================
// HELPERS
// ============================================================================

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViewers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface StreamCardProps {
  stream: LiveStream;
  onClick?: () => void;
}

function StreamCard({ stream, onClick }: StreamCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:bg-muted/30 transition-colors overflow-hidden"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {stream.thumbnailUrl ? (
          <img 
            src={stream.thumbnailUrl} 
            alt={stream.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📺</span>
          </div>
        )}
        {/* Live badge */}
        {stream.status === 'live' && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </Badge>
          </div>
        )}
        {/* Viewers */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="gap-1">
            👁️ {formatViewers(stream.viewers)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={stream.streamer.avatarUrl} />
            <AvatarFallback>{stream.streamer.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-1">{stream.title}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {stream.streamer.displayName || stream.streamer.username}
              {stream.streamer.isVerified && <span>✓</span>}
            </p>
            {stream.category && (
              <p className="text-xs text-muted-foreground">{stream.category}</p>
            )}
          </div>
        </div>
        
        {/* Tags */}
        {stream.tags && stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {stream.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Copy trading indicator */}
        {stream.copyTradingEnabled && (
          <div className="flex items-center gap-2 mt-2 text-xs text-green-500">
            <span>📋</span>
            <span>Copy Trading Available</span>
            {stream.streamPnl !== undefined && (
              <span className={stream.streamPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                {stream.streamPnl >= 0 ? '+' : ''}{stream.streamPnl.toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StreamBrowserProps {
  streams: LiveStream[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectStream: (stream: LiveStream) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

function StreamBrowser({ 
  streams, 
  searchQuery, 
  onSearchChange, 
  onSelectStream,
  activeCategory,
  onCategoryChange,
}: StreamBrowserProps) {
  const categories = ['All', 'Trading', 'Gaming', 'Education', 'Music', 'Other'];
  
  const filteredStreams = streams.filter(s => {
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.streamer.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          <Input
            placeholder="Search streams..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange?.(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Streams grid */}
      {filteredStreams.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">📺</span>
          <p className="text-muted-foreground">No streams found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStreams.map(stream => (
            <StreamCard 
              key={stream.id} 
              stream={stream} 
              onClick={() => onSelectStream(stream)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DefaultChatProps {
  messages: StreamChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

function DefaultChat({ messages, input, onInputChange, onSend }: DefaultChatProps) {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className={`text-sm ${msg.isDonation ? 'bg-yellow-500/10 p-2 rounded' : ''}`}>
              {msg.isDonation && (
                <div className="text-xs text-yellow-500 mb-1">
                  💰 Donated ${msg.donationAmount}
                </div>
              )}
              <span className="font-medium">{msg.sender.username}: </span>
              <span className="text-muted-foreground">{msg.content}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Send a message..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <Button size="icon" onClick={onSend}>
            📤
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING STATE
// ============================================================================

function StreamingLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function StreamingPageTemplate({
  view = 'browse',
  onViewChange,
  isLoggedIn,
  currentUser: _currentUser,
  isLoading,
  streams = [],
  currentStream,
  onSelectStream,
  chatMessages = [],
  chatInput = '',
  onChatInputChange,
  onSendChatMessage,
  isCopyingTrades,
  onToggleCopyTrading,
  copyAmount: _copyAmount,
  searchQuery = '',
  onSearchChange,
  activeCategory,
  onCategoryChange,
  isStreaming,
  onStartStream,
  onEndStream,
  streamDuration = 0,
  renderPlayer,
  renderChat,
  renderBroadcaster,
  renderAnalytics,
  renderDonationPanel,
  renderCopyTradingPanel,
  renderModeratorTools,
}: StreamingPageProps) {
  if (isLoading) {
    return <StreamingLoadingSkeleton />;
  }
  
  // Browse view
  if (view === 'browse' && !currentStream) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>📺</span>
            Live Streams
          </h1>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Button onClick={onStartStream} className="gap-2">
                <span>🎥</span>
                Go Live
              </Button>
            )}
          </div>
        </div>
        
        {/* Stream browser */}
        <StreamBrowser
          streams={streams}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange || (() => {})}
          onSelectStream={onSelectStream || (() => {})}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>
    );
  }
  
  // Broadcast view
  if (view === 'broadcast') {
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onViewChange?.('browse')}>
              ← Back
            </Button>
            <h1 className="text-xl font-bold">
              {isStreaming ? '🔴 You\'re Live!' : 'Start Streaming'}
            </h1>
            {isStreaming && streamDuration > 0 && (
              <Badge variant="outline">{formatDuration(streamDuration)}</Badge>
            )}
          </div>
          {isStreaming ? (
            <Button variant="destructive" onClick={onEndStream}>
              End Stream
            </Button>
          ) : (
            <Button onClick={onStartStream}>Go Live</Button>
          )}
        </div>
        
        {/* Broadcaster */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderBroadcaster?.() || (
              <Card className="aspect-video flex items-center justify-center">
                <span className="text-6xl">🎥</span>
              </Card>
            )}
          </div>
          <div className="space-y-4">
            {renderAnalytics?.()}
            {renderModeratorTools?.()}
          </div>
        </div>
      </div>
    );
  }
  
  // Watch view
  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onSelectStream?.(null as unknown as LiveStream)}>
          ← Back
        </Button>
        {currentStream && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentStream.streamer.avatarUrl} />
              <AvatarFallback>{currentStream.streamer.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{currentStream.title}</h2>
              <p className="text-xs text-muted-foreground">
                {currentStream.streamer.username} • {formatViewers(currentStream.viewers)} viewers
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Player */}
        <div className="lg:col-span-3 space-y-4">
          {renderPlayer?.() || (
            <Card className="aspect-video flex items-center justify-center bg-black">
              <span className="text-6xl">📺</span>
            </Card>
          )}
          
          {/* Copy trading panel */}
          {currentStream?.copyTradingEnabled && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span className="font-medium">Copy Trading</span>
                    {currentStream.streamPnl !== undefined && (
                      <Badge variant={currentStream.streamPnl >= 0 ? 'default' : 'destructive'}>
                        {currentStream.streamPnl >= 0 ? '+' : ''}{currentStream.streamPnl.toFixed(2)}%
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant={isCopyingTrades ? 'destructive' : 'default'}
                    size="sm"
                    onClick={onToggleCopyTrading}
                  >
                    {isCopyingTrades ? 'Stop Copying' : 'Start Copying'}
                  </Button>
                </div>
                {renderCopyTradingPanel?.()}
              </CardContent>
            </Card>
          )}
          
          {/* Donation panel */}
          {renderDonationPanel && (
            <Card>
              <CardContent className="p-4">
                {renderDonationPanel()}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Chat */}
        <div className="lg:col-span-1">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💬 Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {renderChat?.() || (
                <DefaultChat
                  messages={chatMessages}
                  input={chatInput}
                  onInputChange={onChatInputChange || (() => {})}
                  onSend={onSendChatMessage || (() => {})}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StreamingPageTemplate;
