/**
 * MessagesPageTemplate
 * 
 * Pure presentational template for the social messaging interface.
 * This is a complex layout with conversation sidebar, message thread, and various panels.
 * Uses render props extensively due to the complexity of the messaging system.
 * 
 * @example
 * ```tsx
 * import { MessagesPageTemplate } from '@skai/ui';
 * 
 * function MessagesPage() {
 *   const { conversations, activeConversation, messages } = useMessages();
 *   return (
 *     <MessagesPageTemplate
 *       conversations={conversations}
 *       activeConversation={activeConversation}
 *       messages={messages}
 *       onSelectConversation={setActiveConversation}
 *       onSendMessage={sendMessage}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";
import { ScrollArea } from "../components/layout/scroll-area";
import { Skeleton } from "../components/feedback/skeleton";
import { Textarea } from "../components/core/textarea";

// ============================================================================
// TYPES
// ============================================================================

export type ConversationType = 'direct' | 'group' | 'token-gated' | 'support';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type InboxFilter = 'all' | 'unread' | 'token-gated' | 'groups' | 'archived';

export interface ConversationParticipant {
  /** User ID */
  id: string;
  /** Display name */
  name: string;
  /** Username/handle */
  username?: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Whether user is online */
  isOnline?: boolean;
  /** Last seen timestamp */
  lastSeen?: Date;
  /** Whether user is verified */
  isVerified?: boolean;
}

export interface Conversation {
  /** Unique conversation ID */
  id: string;
  /** Conversation type */
  type: ConversationType;
  /** Display name (for groups) or participant name (for DMs) */
  name: string;
  /** Participant(s) in the conversation */
  participants: ConversationParticipant[];
  /** Last message preview */
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
    senderName: string;
  };
  /** Unread message count */
  unreadCount: number;
  /** Whether conversation is pinned */
  isPinned?: boolean;
  /** Whether conversation is muted */
  isMuted?: boolean;
  /** Whether conversation is archived */
  isArchived?: boolean;
  /** Token gate configuration (if applicable) */
  tokenGate?: {
    tokenAddress: string;
    tokenSymbol: string;
    minBalance: number;
  };
  /** Group avatar URL */
  avatarUrl?: string;
}

export interface MessageAttachment {
  /** Attachment ID */
  id: string;
  /** Attachment type */
  type: 'image' | 'video' | 'audio' | 'file' | 'sticker';
  /** URL to the attachment */
  url: string;
  /** File name */
  name?: string;
  /** File size in bytes */
  size?: number;
  /** MIME type */
  mimeType?: string;
  /** Thumbnail URL (for images/videos) */
  thumbnailUrl?: string;
}

export interface MessageReaction {
  /** Emoji used */
  emoji: string;
  /** User IDs who reacted */
  userIds: string[];
  /** Count of reactions */
  count: number;
}

export interface Message {
  /** Unique message ID */
  id: string;
  /** Conversation ID this message belongs to */
  conversationId: string;
  /** Sender information */
  sender: ConversationParticipant;
  /** Message content */
  content: string;
  /** Message timestamp */
  timestamp: Date;
  /** Message delivery status */
  status: MessageStatus;
  /** Attachments */
  attachments?: MessageAttachment[];
  /** Reactions on this message */
  reactions?: MessageReaction[];
  /** ID of message being replied to */
  replyToId?: string;
  /** Reply preview content */
  replyTo?: {
    content: string;
    senderName: string;
  };
  /** Whether message is edited */
  isEdited?: boolean;
  /** Whether message is deleted */
  isDeleted?: boolean;
  /** Whether message is pinned */
  isPinned?: boolean;
  /** Whether this is a system message */
  isSystem?: boolean;
}

export interface MessagesPageProps {
  /** Current user ID */
  currentUserId: string;
  /** List of conversations */
  conversations: Conversation[];
  /** Currently active conversation */
  activeConversation?: Conversation;
  /** Messages in the active conversation */
  messages: Message[];
  /** Current inbox filter */
  inboxFilter?: InboxFilter;
  /** Whether loading conversations */
  isLoadingConversations?: boolean;
  /** Whether loading messages */
  isLoadingMessages?: boolean;
  /** Whether sending a message */
  isSending?: boolean;
  /** Search query for conversations */
  searchQuery?: string;
  /** Message input value */
  messageInput?: string;
  /** Whether mobile sidebar is open */
  mobileSidebarOpen?: boolean;
  /** Whether settings panel is open */
  settingsOpen?: boolean;
  
  // Callbacks
  /** Callback when selecting a conversation */
  onSelectConversation?: (conversation: Conversation) => void;
  /** Callback when filter changes */
  onFilterChange?: (filter: InboxFilter) => void;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Callback when message input changes */
  onMessageInputChange?: (value: string) => void;
  /** Callback when sending a message */
  onSendMessage?: (content: string, attachments?: File[]) => void;
  /** Callback when creating new conversation */
  onNewConversation?: () => void;
  /** Callback when toggling mobile sidebar */
  onToggleMobileSidebar?: () => void;
  /** Callback when toggling settings */
  onToggleSettings?: () => void;
  /** Callback when reacting to a message */
  onReactToMessage?: (messageId: string, emoji: string) => void;
  /** Callback when replying to a message */
  onReplyToMessage?: (messageId: string) => void;
  /** Callback when editing a message */
  onEditMessage?: (messageId: string, newContent: string) => void;
  /** Callback when deleting a message */
  onDeleteMessage?: (messageId: string) => void;
  /** Callback when pinning a message */
  onPinMessage?: (messageId: string) => void;
  /** Callback when archiving conversation */
  onArchiveConversation?: (conversationId: string) => void;
  /** Callback when muting conversation */
  onMuteConversation?: (conversationId: string) => void;
  /** Callback when leaving conversation */
  onLeaveConversation?: (conversationId: string) => void;
  
  // Render props for complex sections
  /** Render the emoji picker */
  renderEmojiPicker?: (onSelect: (emoji: string) => void) => React.ReactNode;
  /** Render the attachment picker */
  renderAttachmentPicker?: () => React.ReactNode;
  /** Render message actions menu */
  renderMessageActions?: (message: Message) => React.ReactNode;
  /** Render conversation settings */
  renderConversationSettings?: (conversation: Conversation) => React.ReactNode;
  /** Render new conversation dialog */
  renderNewConversationDialog?: () => React.ReactNode;
  /** Render user profile card on hover */
  renderUserProfileCard?: (user: ConversationParticipant) => React.ReactNode;
  /** Custom message renderer */
  renderMessage?: (message: Message, isOwn: boolean) => React.ReactNode;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatMessageTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getStatusIcon(status: MessageStatus): string {
  switch (status) {
    case 'sending': return '⏳';
    case 'sent': return '✓';
    case 'delivered': return '✓✓';
    case 'read': return '✓✓';
    case 'failed': return '⚠️';
    default: return '';
  }
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const { name, lastMessage, unreadCount, isPinned, isMuted, type, avatarUrl, participants } = conversation;
  
  // Get avatar for DMs from participant, or use group avatar
  const displayAvatar = type === 'direct' && participants.length > 0 
    ? participants[0].avatarUrl 
    : avatarUrl;
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
        ${isActive 
          ? 'bg-primary/10 border border-primary/30' 
          : 'hover:bg-muted/50'
        }
      `}
    >
      {/* Avatar */}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={displayAvatar} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-medium truncate flex items-center gap-1">
            {isPinned && <span className="text-xs">📌</span>}
            {type === 'token-gated' && <span className="text-xs">🔒</span>}
            {type === 'group' && <span className="text-xs">👥</span>}
            {name}
          </span>
          {lastMessage && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatMessageTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage.content}
          </p>
        )}
      </div>
      
      {/* Badges */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {unreadCount > 0 && !isMuted && (
          <Badge variant="default" className="h-5 min-w-[20px] justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {isMuted && (
          <span className="text-xs text-muted-foreground">🔕</span>
        )}
      </div>
    </button>
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onReact?: (emoji: string) => void;
  renderActions?: () => React.ReactNode;
}

function MessageBubble({ message, isOwn, showAvatar = true, onReact, renderActions }: MessageBubbleProps) {
  const { sender, content, timestamp, status, replyTo, isEdited, isDeleted, isPinned, reactions, isSystem } = message;
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {content}
        </span>
      </div>
    );
  }
  
  if (isDeleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="px-4 py-2 rounded-lg bg-muted/30 text-muted-foreground italic text-sm">
          Message deleted
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
      {/* Avatar (for others' messages) */}
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
          <AvatarImage src={sender.avatarUrl} alt={sender.name} />
          <AvatarFallback className="text-xs">{getInitials(sender.name)}</AvatarFallback>
        </Avatar>
      )}
      
      {/* Message bubble */}
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Reply preview */}
        {replyTo && (
          <div className="text-xs text-muted-foreground mb-1 pl-2 border-l-2 border-primary/50">
            <span className="font-medium">{replyTo.senderName}</span>
            <p className="truncate">{replyTo.content}</p>
          </div>
        )}
        
        {/* Content */}
        <div className={`
          px-4 py-2 rounded-2xl relative
          ${isOwn 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted rounded-bl-md'
          }
        `}>
          {isPinned && (
            <span className="absolute -top-2 -right-2 text-xs">📌</span>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            <span>{formatMessageTime(timestamp)}</span>
            {isEdited && <span>(edited)</span>}
            {isOwn && <span>{getStatusIcon(status)}</span>}
          </div>
        </div>
        
        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {reactions.map(reaction => (
              <button
                key={reaction.emoji}
                onClick={() => onReact?.(reaction.emoji)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-muted/50 text-xs hover:bg-muted transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Actions (shown on hover) */}
      {renderActions && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          {renderActions()}
        </div>
      )}
    </div>
  );
}

interface InboxFiltersProps {
  activeFilter: InboxFilter;
  onFilterChange: (filter: InboxFilter) => void;
  counts?: Record<InboxFilter, number>;
}

function InboxFilters({ activeFilter, onFilterChange, counts }: InboxFiltersProps) {
  const filters: { value: InboxFilter; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '📥' },
    { value: 'unread', label: 'Unread', icon: '🔵' },
    { value: 'groups', label: 'Groups', icon: '👥' },
    { value: 'token-gated', label: 'Token-Gated', icon: '🔒' },
    { value: 'archived', label: 'Archived', icon: '📦' },
  ];
  
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {filters.map(filter => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="flex-shrink-0 gap-1"
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
          {counts?.[filter.value] !== undefined && counts[filter.value] > 0 && (
            <Badge variant="secondary" className="ml-1 h-4 min-w-[16px] text-xs">
              {counts[filter.value]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}

// ============================================================================
// SKELETON LOADERS
// ============================================================================

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

function MessageSkeleton({ isOwn }: { isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
      <Skeleton className={`h-16 w-48 rounded-2xl ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'}`} />
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <ConversationSkeleton key={i} />
      ))}
    </div>
  );
}

function MessagesListSkeleton() {
  return (
    <div className="p-4">
      <MessageSkeleton isOwn={false} />
      <MessageSkeleton isOwn={true} />
      <MessageSkeleton isOwn={false} />
      <MessageSkeleton isOwn={false} />
      <MessageSkeleton isOwn={true} />
    </div>
  );
}

// ============================================================================
// EMPTY STATES
// ============================================================================

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-4">
      <span className="text-4xl mb-4">💬</span>
      <h3 className="font-semibold mb-2">No conversations yet</h3>
      <p className="text-sm text-muted-foreground">
        Start a new conversation to connect with others
      </p>
    </div>
  );
}

function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <span className="text-5xl mb-4">👋</span>
      <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
      <p className="text-muted-foreground">
        Send a message to begin chatting
      </p>
    </div>
  );
}

function NoConversationSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-muted/20">
      <span className="text-6xl mb-4">💬</span>
      <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
      <p className="text-muted-foreground max-w-sm">
        Choose a conversation from the sidebar to view messages, or start a new one
      </p>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function MessagesPageTemplate({
  currentUserId,
  conversations,
  activeConversation,
  messages,
  inboxFilter = 'all',
  isLoadingConversations = false,
  isLoadingMessages = false,
  isSending = false,
  searchQuery = '',
  messageInput = '',
  mobileSidebarOpen = false,
  onSelectConversation,
  onFilterChange,
  onSearchChange,
  onMessageInputChange,
  onSendMessage,
  onNewConversation,
  onToggleMobileSidebar,
  onReactToMessage,
  onReplyToMessage: _onReplyToMessage,
  onEditMessage: _onEditMessage,
  onDeleteMessage: _onDeleteMessage,
  renderEmojiPicker,
  renderAttachmentPicker,
  renderMessageActions,
  renderConversationSettings,
  renderNewConversationDialog,
  renderMessage,
}: MessagesPageProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);
  
  const handleSend = () => {
    if (messageInput.trim() && onSendMessage) {
      onSendMessage(messageInput.trim());
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Filter conversations based on inbox filter
  const filteredConversations = React.useMemo(() => {
    let filtered = conversations;
    
    switch (inboxFilter) {
      case 'unread':
        filtered = conversations.filter(c => c.unreadCount > 0);
        break;
      case 'groups':
        filtered = conversations.filter(c => c.type === 'group');
        break;
      case 'token-gated':
        filtered = conversations.filter(c => c.type === 'token-gated');
        break;
      case 'archived':
        filtered = conversations.filter(c => c.isArchived);
        break;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.lastMessage?.content.toLowerCase().includes(query)
      );
    }
    
    // Sort: pinned first, then by last message time
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });
  }, [conversations, inboxFilter, searchQuery]);
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className={`
        w-80 border-r border-border flex flex-col bg-background
        ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:flex'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>💬</span>
              Messages
            </h1>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={onNewConversation}
              title="New conversation"
            >
              <span className="text-lg">✏️</span>
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-4 py-2 border-b border-border">
          <InboxFilters
            activeFilter={inboxFilter}
            onFilterChange={onFilterChange || (() => {})}
          />
        </div>
        
        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoadingConversations ? (
              <ConversationListSkeleton />
            ) : filteredConversations.length === 0 ? (
              <EmptyConversations />
            ) : (
              filteredConversations.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={() => onSelectConversation?.(conversation)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConversation ? (
          <NoConversationSelected />
        ) : (
          <>
            {/* Conversation Header */}
            <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-background">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={onToggleMobileSidebar}
                >
                  <span>←</span>
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.avatarUrl} />
                  <AvatarFallback>{getInitials(activeConversation.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    {activeConversation.name}
                    {activeConversation.type === 'token-gated' && <span>🔒</span>}
                  </h2>
                  {activeConversation.type === 'group' && (
                    <p className="text-xs text-muted-foreground">
                      {activeConversation.participants.length} members
                    </p>
                  )}
                </div>
              </div>
              
              {/* Header actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" title="Search messages">
                  <span>🔍</span>
                </Button>
                <Button variant="ghost" size="icon" title="Settings">
                  <span>⚙️</span>
                </Button>
              </div>
            </div>
            
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {isLoadingMessages ? (
                <MessagesListSkeleton />
              ) : messages.length === 0 ? (
                <EmptyMessages />
              ) : (
                <>
                  {messages.map((message, index) => {
                    const isOwn = message.sender.id === currentUserId;
                    const showAvatar = index === 0 || 
                      messages[index - 1].sender.id !== message.sender.id;
                    
                    if (renderMessage) {
                      return (
                        <React.Fragment key={message.id}>
                          {renderMessage(message, isOwn)}
                        </React.Fragment>
                      );
                    }
                    
                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        onReact={(emoji) => onReactToMessage?.(message.id, emoji)}
                        renderActions={() => renderMessageActions?.(message)}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-end gap-2">
                {/* Attachment button */}
                {renderAttachmentPicker ? (
                  renderAttachmentPicker()
                ) : (
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <span>📎</span>
                  </Button>
                )}
                
                {/* Text input */}
                <Textarea
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => onMessageInputChange?.(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                
                {/* Emoji button */}
                {renderEmojiPicker ? (
                  renderEmojiPicker((emoji) => {
                    onMessageInputChange?.(messageInput + emoji);
                  })
                ) : (
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <span>😊</span>
                  </Button>
                )}
                
                {/* Send button */}
                <Button
                  size="icon"
                  disabled={!messageInput.trim() || isSending}
                  onClick={handleSend}
                  className="flex-shrink-0"
                >
                  {isSending ? <span>⏳</span> : <span>➤</span>}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Dialogs */}
      {renderNewConversationDialog?.()}
      {activeConversation && renderConversationSettings?.(activeConversation)}
    </div>
  );
}

export default MessagesPageTemplate;
