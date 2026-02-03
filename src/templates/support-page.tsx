/**
 * Support Page Template
 * 
 * User support ticket system with:
 * - Create new support tickets
 * - View ticket history
 * - Track ticket status
 * - Reply to tickets
 * 
 * @example
 * ```tsx
 * <SupportPageTemplate
 *   tickets={userTickets}
 *   categories={supportCategories}
 *   onCreateTicket={handleCreate}
 *   onReplyTicket={handleReply}
 * />
 * ```
 */

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/data-display/avatar";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { Label } from "../components/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/forms/select";
import { Textarea } from "../components/core/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/navigation/tabs";
import { Skeleton } from "../components/feedback/skeleton";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportCategory {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface TicketMessage {
  id: string;
  content: string;
  created_at: string;
  is_staff: boolean;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
  assigned_to?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface SupportPageTemplateProps {
  /** User's support tickets */
  tickets: SupportTicket[];
  /** Available support categories */
  categories: SupportCategory[];
  /** Currently selected ticket */
  selectedTicket?: SupportTicket | null;
  /** New ticket form data */
  newTicketData?: {
    subject: string;
    description: string;
    category: string;
    priority: TicketPriority;
  };
  /** Reply message content */
  replyContent?: string;
  /** Filter by status */
  statusFilter?: TicketStatus | "all";
  /** Loading state */
  isLoading?: boolean;
  /** Submitting ticket state */
  isSubmitting?: boolean;
  /** Sending reply state */
  isSending?: boolean;
  /** Active tab */
  activeTab?: string;
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Tab change handler */
  onTabChange?: (tab: string) => void;
  /** Status filter change handler */
  onStatusFilterChange?: (status: TicketStatus | "all") => void;
  /** Select ticket handler */
  onSelectTicket?: (ticket: SupportTicket) => void;
  /** New ticket data change handler */
  onNewTicketChange?: (data: Partial<SupportPageTemplateProps["newTicketData"]>) => void;
  /** Create ticket handler */
  onCreateTicket?: () => void;
  /** Reply content change handler */
  onReplyChange?: (content: string) => void;
  /** Send reply handler */
  onSendReply?: () => void;
  /** Close ticket handler */
  onCloseTicket?: (ticketId: string) => void;
  /** Reopen ticket handler */
  onReopenTicket?: (ticketId: string) => void;
  /** Back to list handler */
  onBackToList?: () => void;
  /** Login handler */
  onLogin?: () => void;
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

const statusColors: Record<TicketStatus, string> = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  waiting: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

interface TicketListItemProps {
  ticket: SupportTicket;
  isSelected?: boolean;
  onClick?: () => void;
}

function TicketListItem({ ticket, isSelected, onClick }: TicketListItemProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{ticket.subject}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {ticket.description}
          </p>
        </div>
        <Badge className={statusColors[ticket.status]}>
          {ticket.status.replace("_", " ")}
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span>{ticket.category}</span>
        <span>•</span>
        <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
        <span>•</span>
        <span>{ticket.messages.length} messages</span>
      </div>
    </div>
  );
}

interface TicketDetailProps {
  ticket: SupportTicket;
  replyContent?: string;
  isSending?: boolean;
  onReplyChange?: (content: string) => void;
  onSendReply?: () => void;
  onClose?: () => void;
  onReopen?: () => void;
  onBack?: () => void;
}

function TicketDetail({
  ticket,
  replyContent,
  isSending,
  onReplyChange,
  onSendReply,
  onClose,
  onReopen,
  onBack,
}: TicketDetailProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
              ← Back to Tickets
            </Button>
          )}
          <h2 className="text-xl font-bold">{ticket.subject}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={statusColors[ticket.status]}>
              {ticket.status.replace("_", " ")}
            </Badge>
            <Badge className={priorityColors[ticket.priority]}>
              {ticket.priority}
            </Badge>
            <span className="text-sm text-muted-foreground">
              #{ticket.id.slice(0, 8)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {ticket.status !== "closed" && ticket.status !== "resolved" && onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Ticket
            </Button>
          )}
          {(ticket.status === "closed" || ticket.status === "resolved") && onReopen && (
            <Button variant="outline" size="sm" onClick={onReopen}>
              Reopen Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Original Description */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Original Request</span>
            <span className="text-xs text-muted-foreground">
              {new Date(ticket.created_at).toLocaleString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="space-y-4">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.is_staff ? "flex-row" : "flex-row-reverse"
            )}
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={message.author.avatar_url} />
              <AvatarFallback>
                {message.is_staff ? "S" : message.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex-1 max-w-[80%] p-4 rounded-lg",
                message.is_staff 
                  ? "bg-muted" 
                  : "bg-primary text-primary-foreground"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {message.is_staff ? `${message.author.name} (Support)` : "You"}
                </span>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {ticket.status !== "closed" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Reply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your message..."
              value={replyContent}
              onChange={(e) => onReplyChange?.(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={onSendReply}
              disabled={!replyContent?.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send Reply"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface CreateTicketFormProps {
  categories: SupportCategory[];
  data?: SupportPageTemplateProps["newTicketData"];
  isSubmitting?: boolean;
  onChange?: (data: Partial<SupportPageTemplateProps["newTicketData"]>) => void;
  onSubmit?: () => void;
}

function CreateTicketForm({
  categories,
  data,
  isSubmitting,
  onChange,
  onSubmit,
}: CreateTicketFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
        <CardDescription>
          Describe your issue and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input
            placeholder="Brief description of your issue"
            value={data?.subject || ""}
            onChange={(e) => onChange?.({ subject: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={data?.category || ""} 
              onValueChange={(value) => onChange?.({ category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select 
              value={data?.priority || "medium"} 
              onValueChange={(value) => onChange?.({ priority: value as TicketPriority })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Please provide as much detail as possible..."
            value={data?.description || ""}
            onChange={(e) => onChange?.({ description: e.target.value })}
            rows={6}
          />
        </div>

        <Button 
          className="w-full" 
          onClick={onSubmit}
          disabled={!data?.subject || !data?.description || !data?.category || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </Button>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function SupportPageTemplate({
  tickets,
  categories,
  selectedTicket,
  newTicketData,
  replyContent,
  statusFilter = "all",
  isLoading = false,
  isSubmitting = false,
  isSending = false,
  activeTab = "tickets",
  isAuthenticated = true,
  onTabChange,
  onStatusFilterChange,
  onSelectTicket,
  onNewTicketChange,
  onCreateTicket,
  onReplyChange,
  onSendReply,
  onCloseTicket,
  onReopenTicket,
  onBackToList,
  onLogin,
  headerContent,
  footerContent,
  className,
}: SupportPageTemplateProps) {
  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access support
            </p>
            <Button onClick={onLogin}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredTickets = statusFilter === "all" 
    ? tickets 
    : tickets.filter(t => t.status === statusFilter);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Support Center</h1>
        <p className="text-muted-foreground">
          Get help with your account, trades, or technical issues
        </p>
      </div>

      {headerContent}

      {/* Selected Ticket View */}
      {selectedTicket ? (
        <TicketDetail
          ticket={selectedTicket}
          replyContent={replyContent}
          isSending={isSending}
          onReplyChange={onReplyChange}
          onSendReply={onSendReply}
          onClose={() => onCloseTicket?.(selectedTicket.id)}
          onReopen={() => onReopenTicket?.(selectedTicket.id)}
          onBack={onBackToList}
        />
      ) : (
        /* Tabs View */
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="tickets">My Tickets ({tickets.length})</TabsTrigger>
            <TabsTrigger value="new">New Ticket</TabsTrigger>
          </TabsList>

          {/* Tickets List Tab */}
          <TabsContent value="tickets" className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-4">
              <Select 
                value={statusFilter} 
                onValueChange={onStatusFilterChange as (value: string) => void}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tickets List */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : filteredTickets.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-medium mb-2">No Tickets</h3>
                  <p className="text-muted-foreground mb-4">
                    {statusFilter === "all" 
                      ? "You haven't created any support tickets yet"
                      : `No ${statusFilter.replace("_", " ")} tickets`
                    }
                  </p>
                  <Button onClick={() => onTabChange?.("new")}>
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => onSelectTicket?.(ticket)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* New Ticket Tab */}
          <TabsContent value="new">
            <CreateTicketForm
              categories={categories}
              data={newTicketData}
              isSubmitting={isSubmitting}
              onChange={onNewTicketChange}
              onSubmit={onCreateTicket}
            />
          </TabsContent>
        </Tabs>
      )}

      {footerContent}
    </div>
  );
}

export default SupportPageTemplate;
