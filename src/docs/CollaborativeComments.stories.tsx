import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  MessageCircle,
  Send,
  Reply,
  MoreHorizontal,
  Check,
  Pin,
  AtSign,
  ThumbsUp,
  Clock,
} from "lucide-react";
import { Card } from "../components/core/card";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";

/**
 * # Collaborative Comments
 *
 * Leave inline feedback on any component. Perfect for design reviews,
 * QA feedback, and team collaboration.
 */

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  resolved: boolean;
  pinned: boolean;
  reactions: { emoji: string; users: string[] }[];
  replies: Comment[];
  target?: {
    component: string;
    story: string;
    selector?: string;
  };
}

const mockUsers: User[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", color: "bg-purple-500" },
  { id: "2", name: "Mike Rodriguez", avatar: "MR", color: "bg-blue-500" },
  { id: "3", name: "Emma Wilson", avatar: "EW", color: "bg-pink-500" },
  { id: "4", name: "Alex Kim", avatar: "AK", color: "bg-orange-500" },
];

const mockComments: Comment[] = [
  {
    id: "1",
    author: mockUsers[0],
    content:
      "The button hover state feels a bit too subtle. Can we increase the brightness change?",
    timestamp: new Date(Date.now() - 3600000 * 2),
    resolved: false,
    pinned: true,
    reactions: [{ emoji: "👍", users: ["2", "3"] }],
    replies: [
      {
        id: "1-1",
        author: mockUsers[1],
        content:
          "Agreed! I'd suggest going from 10% to 15% brightness increase on hover.",
        timestamp: new Date(Date.now() - 3600000),
        resolved: false,
        pinned: false,
        reactions: [],
        replies: [],
      },
    ],
    target: { component: "Button", story: "Primary" },
  },
  {
    id: "2",
    author: mockUsers[2],
    content: "Love the new card shadow! Much more refined than before. ✨",
    timestamp: new Date(Date.now() - 86400000),
    resolved: true,
    pinned: false,
    reactions: [
      { emoji: "❤️", users: ["1", "4"] },
      { emoji: "🎉", users: ["3"] },
    ],
    replies: [],
    target: { component: "Card", story: "Elevated" },
  },
  {
    id: "3",
    author: mockUsers[3],
    content:
      "@Sarah Chen should we update the focus ring color to match the new brand green?",
    timestamp: new Date(Date.now() - 7200000),
    resolved: false,
    pinned: false,
    reactions: [],
    replies: [
      {
        id: "3-1",
        author: mockUsers[0],
        content:
          "Yes! Let's use --skai-green for all focus indicators. I'll update the tokens.",
        timestamp: new Date(Date.now() - 3600000),
        resolved: false,
        pinned: false,
        reactions: [{ emoji: "✅", users: ["4"] }],
        replies: [],
      },
    ],
    target: { component: "Input", story: "Focus State" },
  },
];

const formatTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

// Avatar component
const Avatar = ({ user }: { user: User }) => (
  <div
    className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-bold`}
  >
    {user.avatar}
  </div>
);

// Single comment component
const CommentItem = ({
  comment,
  isReply = false,
  onResolve,
  onReply: _onReply,
}: {
  comment: Comment;
  isReply?: boolean;
  onResolve?: (id: string) => void;
  onReply?: (id: string) => void;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className={`${isReply ? "ml-10 mt-3" : ""}`}>
      <div
        className={`p-4 rounded-lg ${
          comment.resolved ? "bg-muted/30 opacity-60" : "bg-card"
        } ${comment.pinned ? "border-l-4 border-skai-green" : "border border-border"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar user={comment.author} />
            <div>
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(comment.timestamp)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {comment.pinned && <Pin className="w-4 h-4 text-skai-green" />}
            {comment.resolved && (
              <Badge variant="outline" className="text-xs text-green-500">
                <Check className="w-3 h-3 mr-1" />
                Resolved
              </Badge>
            )}
            <button className="p-1 hover:bg-muted rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target */}
        {comment.target && !isReply && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {comment.target.component} → {comment.target.story}
            </Badge>
          </div>
        )}

        {/* Content */}
        <p className="text-sm mb-3">{comment.content}</p>

        {/* Reactions */}
        {comment.reactions.length > 0 && (
          <div className="flex gap-2 mb-3">
            {comment.reactions.map((reaction, i) => (
              <button
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs hover:bg-muted/80"
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.users.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isReply && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ThumbsUp className="w-4 h-4" />
              React
            </button>
            {!comment.resolved && onResolve && (
              <button
                onClick={() => onResolve(comment.id)}
                className="flex items-center gap-1 text-xs text-green-500 hover:text-green-400 ml-auto"
              >
                <Check className="w-4 h-4" />
                Resolve
              </button>
            )}
          </div>
        )}

        {/* Reply input - Note: Reply submission is stubbed for demo purposes */}
        {showReplyInput && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 bg-muted rounded-lg border border-border text-sm"
            />
            <Button
              size="sm"
              onClick={() => {
                // Demo only: In production, this would append reply to comment.replies
                setReplyText("");
                setShowReplyInput(false);
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );
};

const CollaborativeComments = () => {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [_showMentions, _setShowMentions] = useState(false);

  const handleResolve = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: true } : c)),
    );
  };

  const filteredComments = comments.filter((c) => {
    if (filter === "open") return !c.resolved;
    if (filter === "resolved") return c.resolved;
    return true;
  });

  const stats = {
    total: comments.length,
    open: comments.filter((c) => !c.resolved).length,
    resolved: comments.filter((c) => c.resolved).length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-skai-green" />
            Design Comments
          </h1>
          <p className="text-muted-foreground">
            Collaborate on design decisions with your team.
          </p>
        </div>

        {/* Stats & Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <span>
                <strong>{stats.total}</strong> comments
              </span>
              <span className="text-yellow-500">
                <strong>{stats.open}</strong> open
              </span>
              <span className="text-green-500">
                <strong>{stats.resolved}</strong> resolved
              </span>
            </div>
            <div className="flex gap-1">
              {(["all", "open", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded text-sm capitalize ${
                    filter === f
                      ? "bg-skai-green text-black"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* New Comment */}
        <Card className="p-4 mb-6">
          <div className="flex gap-3">
            <Avatar user={mockUsers[0]} />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment... Use @ to mention someone"
                className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                    <AtSign className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                    <Pin className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  size="sm"
                  disabled={!newComment.trim()}
                  onClick={() => {
                    const trimmed = newComment.trim();
                    if (!trimmed) return;
                    setComments((prev) => [
                      {
                        id: `c${Date.now()}`,
                        author: {
                          id: "current",
                          name: "You",
                          avatar: "👤",
                          color: "bg-gray-500",
                        },
                        content: trimmed,
                        timestamp: new Date(),
                        status: "open" as const,
                        resolved: false,
                        pinned: false,
                        reactions: [],
                        replies: [],
                      },
                      ...prev,
                    ]);
                    setNewComment("");
                  }}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onResolve={handleResolve}
            />
          ))}
        </div>

        {filteredComments.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No {filter !== "all" ? filter : ""} comments yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Collaborative Comments",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Collaborative Comments

Team collaboration features:
- **Threaded replies** - Keep discussions organized
- **@mentions** - Notify specific team members
- **Reactions** - Quick feedback with emoji
- **Pinning** - Highlight important comments
- **Resolution** - Mark feedback as addressed

Perfect for design reviews and async collaboration.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const CommentThread: Story = {
  name: "💬 Comment Thread",
  render: () => <CollaborativeComments />,
};
