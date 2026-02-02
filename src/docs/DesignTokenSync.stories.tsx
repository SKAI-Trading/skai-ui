import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  RefreshCw,
  Download,
  Upload,
  Check,
  AlertTriangle,
  Link2,
  Palette,
  Type,
  Box,
  ArrowLeftRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/**
 * # Design Token Sync
 *
 * Two-way sync with Figma Variables API. Keep design tokens
 * in sync between code and design without manual updates.
 */

interface TokenSyncStatus {
  category: string;
  codeTokens: number;
  figmaTokens: number;
  synced: number;
  conflicts: number;
  lastSync: Date;
}

interface TokenConflict {
  name: string;
  category: string;
  codeValue: string;
  figmaValue: string;
  resolution: "use-code" | "use-figma" | "pending";
}

const mockSyncStatus: TokenSyncStatus[] = [
  {
    category: "Colors",
    codeTokens: 48,
    figmaTokens: 48,
    synced: 46,
    conflicts: 2,
    lastSync: new Date(Date.now() - 3600000),
  },
  {
    category: "Typography",
    codeTokens: 24,
    figmaTokens: 24,
    synced: 24,
    conflicts: 0,
    lastSync: new Date(Date.now() - 3600000),
  },
  {
    category: "Spacing",
    codeTokens: 12,
    figmaTokens: 12,
    synced: 12,
    conflicts: 0,
    lastSync: new Date(Date.now() - 3600000),
  },
  {
    category: "Shadows",
    codeTokens: 8,
    figmaTokens: 6,
    synced: 6,
    conflicts: 0,
    lastSync: new Date(Date.now() - 86400000),
  },
  {
    category: "Border Radius",
    codeTokens: 6,
    figmaTokens: 6,
    synced: 6,
    conflicts: 0,
    lastSync: new Date(Date.now() - 3600000),
  },
  {
    category: "Animations",
    codeTokens: 10,
    figmaTokens: 8,
    synced: 8,
    conflicts: 0,
    lastSync: new Date(Date.now() - 172800000),
  },
];

const mockConflicts: TokenConflict[] = [
  {
    name: "color-primary",
    category: "Colors",
    codeValue: "#00E5A0",
    figmaValue: "#00E599",
    resolution: "pending",
  },
  {
    name: "color-error",
    category: "Colors",
    codeValue: "#EF4444",
    figmaValue: "#DC2626",
    resolution: "pending",
  },
];

const SyncStatusBadge = ({
  synced,
  total,
}: {
  synced: number;
  total: number;
}) => {
  if (total === 0) {
    return <Badge className="bg-muted text-muted-foreground">No Tokens</Badge>;
  }
  const percentage = (synced / total) * 100;
  if (percentage === 100) {
    return <Badge className="bg-green-500/20 text-green-500">Synced</Badge>;
  }
  if (percentage >= 80) {
    return <Badge className="bg-yellow-500/20 text-yellow-500">Partial</Badge>;
  }
  return <Badge className="bg-red-500/20 text-red-500">Out of Sync</Badge>;
};

const TokenIcon = ({ category }: { category: string }) => {
  const icons: Record<string, typeof Palette> = {
    Colors: Palette,
    Typography: Type,
    Spacing: Box,
    Shadows: Box,
    "Border Radius": Box,
    Animations: Clock,
  };
  const Icon = icons[category] || Box;
  return <Icon className="w-4 h-4 text-muted-foreground" />;
};

const DesignTokenSync = () => {
  const [syncStatus, setSyncStatus] = useState(mockSyncStatus);
  const [conflicts, setConflicts] = useState(mockConflicts);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [figmaFileUrl, _setFigmaFileUrl] = useState(
    "https://figma.com/file/abc123/SKAI-Design-System",
  );

  const totalCodeTokens = syncStatus.reduce((sum, s) => sum + s.codeTokens, 0);
  const totalFigmaTokens = syncStatus.reduce(
    (sum, s) => sum + s.figmaTokens,
    0,
  );
  const totalSynced = syncStatus.reduce((sum, s) => sum + s.synced, 0);
  const totalConflicts = conflicts.filter(
    (c) => c.resolution === "pending",
  ).length;

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncStatus((prev) =>
      prev.map((s) => ({
        ...s,
        lastSync: new Date(),
        synced: Math.min(s.synced + 1, s.codeTokens),
      })),
    );
    setLastSynced(new Date());
    setIsSyncing(false);
  };

  const resolveConflict = (
    name: string,
    resolution: "use-code" | "use-figma",
  ) => {
    setConflicts((prev) =>
      prev.map((c) => (c.name === name ? { ...c, resolution } : c)),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <ArrowLeftRight className="w-8 h-8 text-skai-green" />
              Design Token Sync
            </h1>
            <p className="text-muted-foreground">
              Two-way sync with Figma Variables API.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Pull from Figma
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Push to Figma
            </Button>
            <Button size="sm" onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isSyncing ? "Syncing..." : "Sync All"}
            </Button>
          </div>
        </div>

        {/* Figma Connection */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-purple-500"
                  fill="currentColor"
                >
                  <path d="M5 5.5A5.5 5.5 0 0 1 10.5 0H12v5.5a5.5 5.5 0 0 1-5.5 5.5H5V5.5z" />
                  <path d="M12 0h1.5A5.5 5.5 0 0 1 19 5.5 5.5 5.5 0 0 1 13.5 11H12V0z" />
                  <path d="M12 13h1.5a5.5 5.5 0 1 1 0 11H12V13z" />
                  <path d="M5 13h5.5v5.5A5.5 5.5 0 0 1 5 13z" />
                  <path d="M5 24a5.5 5.5 0 0 1 5.5-5.5H12V24H5z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Figma Connected</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  {figmaFileUrl}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Last sync</div>
                <div className="text-sm font-medium">
                  {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Figma
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Code Tokens
            </div>
            <div className="text-2xl font-bold">{totalCodeTokens}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Figma Variables
            </div>
            <div className="text-2xl font-bold">{totalFigmaTokens}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Synced</div>
            <div className="text-2xl font-bold text-green-500">
              {totalSynced}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Conflicts</div>
            <div
              className={`text-2xl font-bold ${totalConflicts > 0 ? "text-yellow-500" : "text-green-500"}`}
            >
              {totalConflicts}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Sync Status by Category */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Sync Status</h2>
            <div className="space-y-3">
              {syncStatus.map((status) => (
                <div
                  key={status.category}
                  className="p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === status.category
                        ? null
                        : status.category,
                    )
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TokenIcon category={status.category} />
                      <span className="font-medium">{status.category}</span>
                    </div>
                    <SyncStatusBadge
                      synced={status.synced}
                      total={status.codeTokens}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Code: {status.codeTokens}</span>
                      <span>Figma: {status.figmaTokens}</span>
                      <span>Synced: {status.synced}</span>
                    </div>
                    {status.conflicts > 0 && (
                      <span className="text-yellow-500">
                        {status.conflicts} conflicts
                      </span>
                    )}
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${status.codeTokens > 0 ? (status.synced / status.codeTokens) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Conflicts */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Conflicts to Resolve
            </h2>
            {conflicts.filter((c) => c.resolution === "pending").length ===
            0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No conflicts! All tokens are in sync.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conflicts
                  .filter((c) => c.resolution === "pending")
                  .map((conflict) => (
                    <div
                      key={conflict.name}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-mono text-sm">
                            {conflict.name}
                          </span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {conflict.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="p-2 bg-background rounded">
                          <div className="text-xs text-muted-foreground mb-1">
                            Code Value
                          </div>
                          <div className="flex items-center gap-2">
                            {conflict.category === "Colors" && (
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: conflict.codeValue }}
                              />
                            )}
                            <span className="font-mono text-sm">
                              {conflict.codeValue}
                            </span>
                          </div>
                        </div>
                        <div className="p-2 bg-background rounded">
                          <div className="text-xs text-muted-foreground mb-1">
                            Figma Value
                          </div>
                          <div className="flex items-center gap-2">
                            {conflict.category === "Colors" && (
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: conflict.figmaValue }}
                              />
                            )}
                            <span className="font-mono text-sm">
                              {conflict.figmaValue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            resolveConflict(conflict.name, "use-code")
                          }
                        >
                          Use Code
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            resolveConflict(conflict.name, "use-figma")
                          }
                        >
                          Use Figma
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>

        {/* Resolved Conflicts Log */}
        {conflicts.filter((c) => c.resolution !== "pending").length > 0 && (
          <Card className="mt-6 p-6">
            <h2 className="font-semibold mb-4">Recently Resolved</h2>
            <div className="space-y-2">
              {conflicts
                .filter((c) => c.resolution !== "pending")
                .map((conflict) => (
                  <div
                    key={conflict.name}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="font-mono text-sm">{conflict.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Resolved using{" "}
                      {conflict.resolution === "use-code"
                        ? "code value"
                        : "Figma value"}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Token Sync",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Design Token Sync

Keep code and Figma in sync:
- **Two-way sync** - Pull from or push to Figma
- **Conflict resolution** - Visual diff when values differ
- **Category tracking** - Colors, typography, spacing, etc.
- **Audit trail** - Track what changed and when
- **Figma Variables API** - Direct integration

Never manually copy token values again.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Sync: Story = {
  name: "🔄 Token Sync",
  render: () => <DesignTokenSync />,
};
