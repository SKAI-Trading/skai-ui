/**
 * NotificationsPageTemplate
 * 
 * Pure presentational template for the notifications center page.
 * Displays user notifications with read/unread states.
 * 
 * @example
 * ```tsx
 * import { NotificationsPageTemplate } from '@skai/ui';
 * 
 * function NotificationsPage() {
 *   const { notifications, loading, markAllRead, markRead } = useNotifications();
 *   return (
 *     <NotificationsPageTemplate
 *       notifications={notifications}
 *       isLoading={loading}
 *       onMarkAllRead={markAllRead}
 *       onMarkRead={markRead}
 *       onNotificationClick={(n) => navigate(n.link)}
 *     />
 *   );
 * }
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { Skeleton } from "../components/feedback/skeleton";

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType = 
  | 'announcement' 
  | 'badge_reward' 
  | 'lottery_win' 
  | 'referral' 
  | 'stream_live' 
  | 'system' 
  | 'transaction'
  | 'general';

export type AnnouncementType = 'info' | 'warning' | 'success' | 'urgent';

export interface NotificationItem {
  /** Unique identifier */
  id: string;
  /** Notification type for icon selection */
  type: NotificationType;
  /** Title text */
  title: string;
  /** Body message */
  message: string;
  /** Whether notification has been read */
  read: boolean;
  /** Creation timestamp */
  createdAt: Date;
  /** Optional emoji/icon override */
  icon?: string;
  /** Optional navigation link */
  link?: string;
  /** Additional type-specific data */
  data?: {
    urgent?: boolean;
    announcementType?: AnnouncementType;
    notificationType?: string;
    [key: string]: unknown;
  };
}

export interface NotificationsPageProps {
  /** Array of notification items */
  notifications: NotificationItem[];
  /** Whether notifications are loading */
  isLoading?: boolean;
  /** Callback to mark all notifications as read */
  onMarkAllRead?: () => void;
  /** Callback when marking a single notification as read */
  onMarkRead?: (id: string) => void;
  /** Callback when clicking a notification */
  onNotificationClick?: (notification: NotificationItem) => void;
  /** Custom icon renderer for notification types */
  renderIcon?: (type: NotificationType, data?: NotificationItem['data']) => React.ReactNode;
  /** Page title */
  title?: string;
  /** Mark all read button text */
  markAllReadText?: string;
  /** Empty state message */
  emptyMessage?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface NotificationIconProps {
  type: NotificationType;
  data?: NotificationItem['data'];
  customIcon?: string;
}

function NotificationIcon({ type, data, customIcon }: NotificationIconProps) {
  if (customIcon) {
    return <span className="text-xl">{customIcon}</span>;
  }
  
  // Default icon based on type - simple emoji fallbacks
  const iconMap: Record<NotificationType, string> = {
    announcement: data?.announcementType === 'urgent' ? '🚨' : '📢',
    badge_reward: '🏆',
    lottery_win: data?.notificationType === 'jackpot' ? '🎰' : '🎫',
    referral: '🎁',
    stream_live: '🔴',
    system: '⚙️',
    transaction: '✅',
    general: '🔔'
  };
  
  return <span className="text-xl">{iconMap[type] || '🔔'}</span>;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onClick?: () => void;
  renderIcon?: NotificationsPageProps['renderIcon'];
}

function NotificationCard({ notification, onClick, renderIcon }: NotificationCardProps) {
  const { type, title, message, read, createdAt, icon, data } = notification;
  const isUrgent = data?.urgent || data?.announcementType === 'urgent';
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-start gap-4 p-4 text-left transition-colors rounded-lg border
        ${read 
          ? "bg-background hover:bg-muted/50 opacity-70" 
          : isUrgent 
            ? "bg-destructive/5 hover:bg-destructive/10 border-destructive/20"
            : "bg-primary/5 hover:bg-primary/10 border-primary/10"
        }
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {renderIcon 
          ? renderIcon(type, data) 
          : <NotificationIcon type={type} data={data} customIcon={icon} />
        }
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium ${!read ? "text-foreground" : "text-muted-foreground"}`}>
            {title}
          </span>
          {!read && (
            <Badge variant="default" className="text-xs px-1.5 py-0">
              New
            </Badge>
          )}
          {isUrgent && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0 animate-pulse">
              Urgent
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {message}
        </p>
        <span className="text-xs text-muted-foreground mt-1 block">
          {formatTimeAgo(createdAt)}
        </span>
      </div>
      
      {/* Unread indicator */}
      {!read && (
        <div className="flex-shrink-0 mt-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      )}
    </button>
  );
}

// ============================================================================
// SKELETON LOADERS
// ============================================================================

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <span className="text-3xl opacity-50">🔔</span>
      </div>
      <p>{message}</p>
    </div>
  );
}

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export function NotificationsPageTemplate({
  notifications,
  isLoading = false,
  onMarkAllRead,
  onMarkRead,
  onNotificationClick,
  renderIcon,
  title = "Notifications",
  markAllReadText = "Mark all read",
  emptyMessage = "No notifications yet"
}: NotificationsPageProps) {
  const hasUnread = notifications.some(n => !n.read);
  
  const handleClick = (notification: NotificationItem) => {
    if (!notification.read && onMarkRead) {
      onMarkRead(notification.id);
    }
    onNotificationClick?.(notification);
  };
  
  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMarkAllRead}
            disabled={isLoading || !hasUnread}
            className="gap-2"
          >
            <span className="text-sm">✓✓</span>
            {markAllReadText}
          </Button>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : notifications.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleClick(notification)}
                  renderIcon={renderIcon}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationsPageTemplate;
