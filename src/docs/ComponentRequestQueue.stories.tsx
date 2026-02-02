import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  ListTodo,
  Plus,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  MessageSquare,
  Calendar,
  Tag,
  Filter,
  Search,
  ThumbsUp,
  X,
} from "lucide-react";
import { Card } from "../components/core/card";
import { Button } from "../components/core/button";

/**
 * # Component Request Queue
 *
 * Track and prioritize new component requests from the team.
 * Vote, discuss, and manage the design system roadmap.
 */

interface ComponentRequest {
  id: string;
  title: string;
  description: string;
  requester: { name: string; avatar: string };
  status:
    | "new"
    | "in-review"
    | "approved"
    | "in-progress"
    | "completed"
    | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  votes: number;
  comments: number;
  createdAt: Date;
  targetVersion?: string;
  tags: string[];
}

const mockRequests: ComponentRequest[] = [
  {
    id: "1",
    title: "Sortable Data Grid",
    description:
      "Need a data grid component with column sorting, filtering, pagination, and row selection for the admin dashboard.",
    requester: { name: "Sarah Chen", avatar: "SC" },
    status: "approved",
    priority: "high",
    category: "Display",
    votes: 24,
    comments: 8,
    createdAt: new Date(Date.now() - 604800000),
    targetVersion: "v0.3.0",
    tags: ["table", "admin", "sorting"],
  },
  {
    id: "2",
    title: "Date Range Picker",
    description:
      "A date range picker for selecting time periods in analytics dashboards. Should support presets like 'Last 7 days', 'Last month', etc.",
    requester: { name: "Mike Ross", avatar: "MR" },
    status: "in-progress",
    priority: "high",
    category: "Forms",
    votes: 18,
    comments: 5,
    createdAt: new Date(Date.now() - 432000000),
    targetVersion: "v0.2.0",
    tags: ["date", "forms", "analytics"],
  },
  {
    id: "3",
    title: "Stepper / Multi-step Form",
    description:
      "A stepper component for multi-step forms and wizards. Should show progress, allow navigation, and validate steps.",
    requester: { name: "Emma Wilson", avatar: "EW" },
    status: "in-review",
    priority: "medium",
    category: "Navigation",
    votes: 15,
    comments: 12,
    createdAt: new Date(Date.now() - 259200000),
    tags: ["wizard", "forms", "navigation"],
  },
  {
    id: "4",
    title: "Rich Text Editor",
    description:
      "WYSIWYG editor for content creation. Basic formatting, lists, links, images. Could use Tiptap or Slate.",
    requester: { name: "Alex Kim", avatar: "AK" },
    status: "new",
    priority: "medium",
    category: "Forms",
    votes: 12,
    comments: 3,
    createdAt: new Date(Date.now() - 172800000),
    tags: ["editor", "content", "wysiwyg"],
  },
  {
    id: "5",
    title: "Notification Center",
    description:
      "A notification dropdown/panel showing recent alerts, messages, and activity. Should support different notification types.",
    requester: { name: "Jordan Lee", avatar: "JL" },
    status: "new",
    priority: "low",
    category: "Overlays",
    votes: 9,
    comments: 2,
    createdAt: new Date(Date.now() - 86400000),
    tags: ["notifications", "alerts"],
  },
  {
    id: "6",
    title: "File Upload with Preview",
    description:
      "Drag & drop file upload with image preview, progress bar, and multi-file support.",
    requester: { name: "Taylor Swift", avatar: "TS" },
    status: "new",
    priority: "medium",
    category: "Forms",
    votes: 14,
    comments: 4,
    createdAt: new Date(Date.now() - 86400000),
    tags: ["upload", "files", "images"],
  },
  {
    id: "7",
    title: "Command Palette",
    description:
      "Keyboard-driven command palette (like VS Code's Cmd+K). Quick access to actions and navigation.",
    requester: { name: "Chris Dev", avatar: "CD" },
    status: "approved",
    priority: "high",
    category: "Navigation",
    votes: 21,
    comments: 7,
    createdAt: new Date(Date.now() - 518400000),
    targetVersion: "v0.3.0",
    tags: ["keyboard", "navigation", "power-user"],
  },
  {
    id: "8",
    title: "Virtualized List",
    description:
      "Virtualized/windowed list for rendering large datasets efficiently. Should integrate with existing scroll patterns.",
    requester: { name: "Pat Tech", avatar: "PT" },
    status: "completed",
    priority: "high",
    category: "Display",
    votes: 16,
    comments: 6,
    createdAt: new Date(Date.now() - 1209600000),
    targetVersion: "v0.1.0",
    tags: ["performance", "lists", "large-data"],
  },
];

const statusConfig = {
  new: { label: "New", color: "bg-blue-500/20 text-blue-500", icon: Circle },
  "in-review": {
    label: "In Review",
    color: "bg-purple-500/20 text-purple-500",
    icon: AlertCircle,
  },
  approved: {
    label: "Approved",
    color: "bg-green-500/20 text-green-500",
    icon: CheckCircle,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-yellow-500/20 text-yellow-500",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-skai-green/20 text-skai-green",
    icon: CheckCircle,
  },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-500", icon: X },
};

const priorityConfig = {
  low: { label: "Low", color: "text-gray-500", icon: ArrowDown },
  medium: { label: "Medium", color: "text-blue-500", icon: ArrowRight },
  high: { label: "High", color: "text-orange-500", icon: ArrowUp },
  critical: { label: "Critical", color: "text-red-500", icon: AlertCircle },
};

const RequestCard = ({
  request,
  onVote,
}: {
  request: ComponentRequest;
  onVote: () => void;
}) => {
  const status = statusConfig[request.status];
  const priority = priorityConfig[request.priority];
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;

  return (
    <Card className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-4">
        {/* Vote Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={onVote}
            className="w-12 h-12 rounded-lg bg-muted hover:bg-skai-green/20 flex flex-col items-center justify-center transition-colors group"
            aria-label={`Vote for ${request.title}, currently ${request.votes} votes`}
          >
            <ThumbsUp className="w-4 h-4 text-muted-foreground group-hover:text-skai-green" />
            <span className="text-sm font-bold mt-0.5">{request.votes}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold hover:text-skai-green cursor-pointer">
                {request.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {request.description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${status.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {request.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-muted rounded text-xs">
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-skai-green/20 flex items-center justify-center text-[10px] font-medium">
                {request.requester.avatar}
              </div>
              <span>{request.requester.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <PriorityIcon className={`w-3 h-3 ${priority.color}`} />
              <span className={priority.color}>{priority.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{request.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{request.createdAt.toLocaleDateString()}</span>
            </div>
            {request.targetVersion && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{request.targetVersion}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const ComponentRequestQueue = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [filter, setFilter] = useState<"all" | ComponentRequest["status"]>(
    "all",
  );
  const [sortBy, setSortBy] = useState<"votes" | "date" | "priority">("votes");
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  const handleVote = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)),
    );
  };

  const filteredRequests = requests
    .filter((r) => filter === "all" || r.status === filter)
    .filter(
      (r) =>
        search === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "date")
        return b.createdAt.getTime() - a.createdAt.getTime();
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const summary = {
    total: requests.length,
    new: requests.filter((r) => r.status === "new").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <ListTodo className="w-8 h-8 text-skai-green" />
              Component Requests
            </h1>
            <p className="text-muted-foreground">
              Track, vote, and prioritize new component requests.
            </p>
          </div>
          <Button onClick={() => setShowNewForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Total Requests
            </div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">New</div>
            <div className="text-2xl font-bold text-blue-500">
              {summary.new}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              In Progress
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {summary.inProgress}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-500">
              {summary.completed}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-muted rounded-lg border border-border w-64"
              />
            </div>
            <div className="h-6 w-px bg-border mx-2" />
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(
              [
                "all",
                "new",
                "in-review",
                "approved",
                "in-progress",
                "completed",
              ] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded text-sm capitalize ${
                  filter === status
                    ? "bg-skai-green text-black"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-muted rounded-lg border border-border text-sm"
          >
            <option value="votes">Most Voted</option>
            <option value="date">Newest</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onVote={() => handleVote(request.id)}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="p-8 text-center">
            <ListTodo className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No requests found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try a different search term"
                : "No requests match this filter"}
            </p>
          </Card>
        )}

        {/* New Request Form (Modal) */}
        {showNewForm && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-component-request-title"
            onKeyDown={(e) => e.key === "Escape" && setShowNewForm(false)}
          >
            <Card className="w-[500px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  id="new-component-request-title"
                  className="font-semibold text-lg"
                >
                  New Component Request
                </h3>
                <button
                  onClick={() => setShowNewForm(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Component Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Date Range Picker"
                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe the component, use cases, and any specific requirements..."
                    rows={4}
                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border">
                      <option>Display</option>
                      <option>Forms</option>
                      <option>Navigation</option>
                      <option>Overlays</option>
                      <option>Feedback</option>
                      <option>Trading</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., forms, date, analytics"
                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewForm(false)}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Request Queue",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Component Request Queue

Manage design system roadmap:
- **Submit Requests** - Propose new components
- **Vote & Prioritize** - Community-driven prioritization
- **Track Status** - New → In Review → Approved → In Progress → Completed
- **Discuss** - Comment threads on each request
- **Tag & Search** - Find requests by category or keyword

Make design system evolution collaborative.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Queue: Story = {
  name: "📋 Request Queue",
  render: () => <ComponentRequestQueue />,
};
