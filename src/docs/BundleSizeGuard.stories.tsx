import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Scale,
  FileCode,
  Settings,
  Bell,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "../components/core/card";
import { Button } from "../components/core/button";
import { Badge } from "../components/core/badge";

/**
 * # Bundle Size Guard
 *
 * Set size limits for components and get alerts when they exceed thresholds.
 * Prevent bundle bloat before it ships to production.
 */

interface SizeLimit {
  id: string;
  pattern: string;
  maxSize: number;
  unit: "KB" | "bytes";
  currentSize: number;
  status: "pass" | "warning" | "fail";
  trend: number;
}

interface ComponentSize {
  name: string;
  category: string;
  raw: number;
  gzip: number;
  brotli: number;
  limit?: number;
  status: "pass" | "warning" | "fail" | "none";
}

const mockLimits: SizeLimit[] = [
  {
    id: "1",
    pattern: "Button",
    maxSize: 5,
    unit: "KB",
    currentSize: 2.4,
    status: "pass",
    trend: -5,
  },
  {
    id: "2",
    pattern: "Card",
    maxSize: 3,
    unit: "KB",
    currentSize: 1.8,
    status: "pass",
    trend: 2,
  },
  {
    id: "3",
    pattern: "Dialog",
    maxSize: 10,
    unit: "KB",
    currentSize: 8.6,
    status: "warning",
    trend: 12,
  },
  {
    id: "4",
    pattern: "DataTable",
    maxSize: 20,
    unit: "KB",
    currentSize: 24.5,
    status: "fail",
    trend: 8,
  },
  {
    id: "5",
    pattern: "Chart*",
    maxSize: 30,
    unit: "KB",
    currentSize: 45.2,
    status: "fail",
    trend: 15,
  },
  {
    id: "6",
    pattern: "Form*",
    maxSize: 15,
    unit: "KB",
    currentSize: 12.3,
    status: "pass",
    trend: -3,
  },
  {
    id: "7",
    pattern: "Trading/*",
    maxSize: 25,
    unit: "KB",
    currentSize: 18.7,
    status: "pass",
    trend: 4,
  },
];

const mockComponents: ComponentSize[] = [
  {
    name: "Button",
    category: "Primitives",
    raw: 2.4,
    gzip: 0.9,
    brotli: 0.7,
    limit: 5,
    status: "pass",
  },
  {
    name: "Card",
    category: "Primitives",
    raw: 1.8,
    gzip: 0.7,
    brotli: 0.5,
    limit: 3,
    status: "pass",
  },
  {
    name: "Input",
    category: "Forms",
    raw: 4.2,
    gzip: 1.6,
    brotli: 1.3,
    limit: 15,
    status: "pass",
  },
  {
    name: "Dialog",
    category: "Overlays",
    raw: 8.6,
    gzip: 3.2,
    brotli: 2.7,
    limit: 10,
    status: "warning",
  },
  {
    name: "DataTable",
    category: "Display",
    raw: 24.5,
    gzip: 9.1,
    brotli: 7.8,
    limit: 20,
    status: "fail",
  },
  {
    name: "CandlestickChart",
    category: "Trading",
    raw: 45.2,
    gzip: 15.8,
    brotli: 13.2,
    limit: 30,
    status: "fail",
  },
  {
    name: "TokenIcon",
    category: "Trading",
    raw: 3.1,
    gzip: 1.2,
    brotli: 1.0,
    status: "none",
  },
  {
    name: "PriceDisplay",
    category: "Trading",
    raw: 2.8,
    gzip: 1.1,
    brotli: 0.9,
    status: "none",
  },
  {
    name: "Tabs",
    category: "Navigation",
    raw: 5.4,
    gzip: 2.0,
    brotli: 1.7,
    status: "none",
  },
  {
    name: "Select",
    category: "Forms",
    raw: 12.3,
    gzip: 4.5,
    brotli: 3.8,
    limit: 15,
    status: "pass",
  },
  {
    name: "Tooltip",
    category: "Overlays",
    raw: 3.5,
    gzip: 1.3,
    brotli: 1.1,
    status: "none",
  },
  {
    name: "Avatar",
    category: "Display",
    raw: 2.1,
    gzip: 0.8,
    brotli: 0.6,
    status: "none",
  },
];

const SizeBar = ({
  current,
  limit,
  status,
}: {
  current: number;
  limit: number;
  status: "pass" | "warning" | "fail";
}) => {
  const percentage = Math.min((current / limit) * 100, 120);
  const color =
    status === "fail"
      ? "bg-red-500"
      : status === "warning"
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="relative">
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {/* Limit marker */}
      <div
        className="absolute top-0 h-3 w-0.5 bg-white/50"
        style={{ left: `${Math.min((limit / (limit * 1.2)) * 100, 100)}%` }}
      />
      {percentage > 100 && (
        <div
          className="absolute top-0 h-3 bg-red-500/30"
          style={{
            left: "100%",
            width: `${(percentage - 100) * 0.833}%`,
          }}
        />
      )}
    </div>
  );
};

const BundleSizeGuard = () => {
  const [limits, setLimits] = useState(mockLimits);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [_editingLimit, _setEditingLimit] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<{
    pattern: string;
    maxSize: number;
    unit: "KB" | "bytes";
  }>({
    pattern: "",
    maxSize: 10,
    unit: "KB",
  });

  const summary = {
    total: limits.length,
    passing: limits.filter((l) => l.status === "pass").length,
    warnings: limits.filter((l) => l.status === "warning").length,
    failing: limits.filter((l) => l.status === "fail").length,
    totalSize: mockComponents.reduce((sum, c) => sum + c.raw, 0),
  };

  const addLimit = () => {
    if (newLimit.pattern) {
      setLimits((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ...newLimit,
          currentSize: 0,
          status: "pass" as const,
          trend: 0,
        },
      ]);
      setNewLimit({ pattern: "", maxSize: 10, unit: "KB" });
      setShowAddDialog(false);
    }
  };

  const deleteLimit = (id: string) => {
    setLimits((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Scale className="w-8 h-8 text-skai-green" />
              Bundle Size Guard
            </h1>
            <p className="text-muted-foreground">
              Set size limits and catch bundle bloat before production.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Limit
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Total Limits
            </div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Passing
            </div>
            <div className="text-2xl font-bold text-green-500">
              {summary.passing}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Warnings
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {summary.warnings}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Failing
            </div>
            <div className="text-2xl font-bold text-red-500">
              {summary.failing}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Size</div>
            <div className="text-2xl font-bold">
              {summary.totalSize.toFixed(1)} KB
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Size Limits */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-skai-green" />
              Size Limits
            </h2>
            <div className="space-y-4">
              {limits.map((limit) => (
                <div key={limit.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{limit.pattern}</span>
                      <Badge
                        variant={
                          limit.status === "pass"
                            ? "default"
                            : limit.status === "warning"
                              ? "outline"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {limit.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 text-xs ${
                          limit.trend >= 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {limit.trend >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(limit.trend)}%
                      </span>
                      <button
                        onClick={() => deleteLimit(limit.id)}
                        className="p-1 hover:bg-muted rounded"
                        aria-label={`Delete limit ${limit.id}`}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <SizeBar
                    current={limit.currentSize}
                    limit={limit.maxSize}
                    status={limit.status}
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>
                      {limit.currentSize.toFixed(1)} {limit.unit}
                    </span>
                    <span>
                      Limit: {limit.maxSize} {limit.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Component Sizes */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-blue" />
              Component Sizes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-2 font-medium">Component</th>
                    <th className="pb-2 font-medium text-right">Raw</th>
                    <th className="pb-2 font-medium text-right">Gzip</th>
                    <th className="pb-2 font-medium text-right">Brotli</th>
                    <th className="pb-2 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockComponents.map((comp) => (
                    <tr key={comp.name} className="border-b border-border/50">
                      <td className="py-2">
                        <div className="font-medium">{comp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {comp.category}
                        </div>
                      </td>
                      <td className="py-2 text-right font-mono">
                        {comp.raw.toFixed(1)} KB
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {comp.gzip.toFixed(1)} KB
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {comp.brotli.toFixed(1)} KB
                      </td>
                      <td className="py-2 text-center">
                        {comp.status === "none" ? (
                          <span className="text-muted-foreground">—</span>
                        ) : comp.status === "pass" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                        ) : comp.status === "warning" ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mx-auto" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Add Limit Dialog */}
        {showAddDialog && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-size-limit-title"
          >
            <Card className="w-96 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 id="add-size-limit-title" className="font-semibold">
                  Add Size Limit
                </h3>
                <button
                  onClick={() => setShowAddDialog(false)}
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Pattern (glob supported)
                  </label>
                  <input
                    type="text"
                    value={newLimit.pattern}
                    onChange={(e) =>
                      setNewLimit((prev) => ({
                        ...prev,
                        pattern: e.target.value,
                      }))
                    }
                    placeholder="e.g., Button, Chart*, Trading/*"
                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">
                      Max Size
                    </label>
                    <input
                      type="number"
                      value={newLimit.maxSize}
                      onChange={(e) =>
                        setNewLimit((prev) => ({
                          ...prev,
                          maxSize: Number(e.target.value),
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-sm text-muted-foreground">
                      Unit
                    </label>
                    <select
                      value={newLimit.unit}
                      onChange={(e) =>
                        setNewLimit((prev) => ({
                          ...prev,
                          unit: e.target.value as "KB" | "bytes",
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 bg-muted rounded-lg border border-border"
                    >
                      <option value="KB">KB</option>
                      <option value="bytes">bytes</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full" onClick={addLimit}>
                  Add Limit
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* CI Integration */}
        <Card className="mt-6 p-6">
          <h2 className="font-semibold mb-4">CI Integration</h2>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre>{`# .github/workflows/bundle-check.yml
name: Bundle Size Check
on: [push, pull_request]
jobs:
  size-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: npx bundle-size-guard --config bundle.config.json
      - uses: actions/github-script@v7
        if: failure()
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: '⚠️ Bundle size limit exceeded!'
            })`}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Bundle Size Guard",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Bundle Size Guard

Prevent bundle bloat:
- **Size Limits** - Set max size per component/pattern
- **Glob Patterns** - Match multiple components (e.g., "Chart*")
- **Multiple Formats** - Track raw, gzip, and brotli sizes
- **Trend Tracking** - Monitor size changes over time
- **CI Integration** - Fail builds that exceed limits

Keep your design system lean and fast.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Guard: Story = {
  name: "📦 Bundle Guard",
  render: () => <BundleSizeGuard />,
};
