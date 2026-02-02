import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef, useEffect } from "react";
import {
  Zap,
  Clock,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import { Card } from "../components/card";
import { Button } from "../components/button";

/**
 * # Performance Profiler
 *
 * Measure render times, bundle impact, and memory usage per component.
 * Identify performance bottlenecks and optimize your design system.
 */

interface ComponentMetrics {
  name: string;
  category: string;
  renderTime: number;
  rerenderTime: number;
  bundleSize: number;
  gzipSize: number;
  memoryUsage: number;
  dependencies: number;
  renderCount: number;
  status: "optimal" | "warning" | "critical";
}

const mockMetrics: ComponentMetrics[] = [
  {
    name: "Button",
    category: "Primitives",
    renderTime: 0.8,
    rerenderTime: 0.3,
    bundleSize: 2.4,
    gzipSize: 0.9,
    memoryUsage: 12,
    dependencies: 3,
    renderCount: 1,
    status: "optimal",
  },
  {
    name: "Card",
    category: "Primitives",
    renderTime: 1.2,
    rerenderTime: 0.5,
    bundleSize: 1.8,
    gzipSize: 0.7,
    memoryUsage: 8,
    dependencies: 2,
    renderCount: 1,
    status: "optimal",
  },
  {
    name: "Input",
    category: "Forms",
    renderTime: 2.1,
    rerenderTime: 0.8,
    bundleSize: 4.2,
    gzipSize: 1.6,
    memoryUsage: 18,
    dependencies: 5,
    renderCount: 3,
    status: "optimal",
  },
  {
    name: "Dialog",
    category: "Overlays",
    renderTime: 4.5,
    rerenderTime: 1.2,
    bundleSize: 8.6,
    gzipSize: 3.2,
    memoryUsage: 45,
    dependencies: 8,
    renderCount: 2,
    status: "warning",
  },
  {
    name: "DataTable",
    category: "Display",
    renderTime: 12.3,
    rerenderTime: 8.5,
    bundleSize: 24.5,
    gzipSize: 9.1,
    memoryUsage: 156,
    dependencies: 12,
    renderCount: 5,
    status: "critical",
  },
  {
    name: "CandlestickChart",
    category: "Trading",
    renderTime: 18.7,
    rerenderTime: 12.4,
    bundleSize: 45.2,
    gzipSize: 15.8,
    memoryUsage: 234,
    dependencies: 15,
    renderCount: 8,
    status: "critical",
  },
  {
    name: "TokenIcon",
    category: "Trading",
    renderTime: 1.5,
    rerenderTime: 0.4,
    bundleSize: 3.1,
    gzipSize: 1.2,
    memoryUsage: 15,
    dependencies: 4,
    renderCount: 1,
    status: "optimal",
  },
  {
    name: "PriceDisplay",
    category: "Trading",
    renderTime: 2.8,
    rerenderTime: 1.8,
    bundleSize: 2.8,
    gzipSize: 1.1,
    memoryUsage: 22,
    dependencies: 3,
    renderCount: 12,
    status: "warning",
  },
  {
    name: "Tabs",
    category: "Navigation",
    renderTime: 3.2,
    rerenderTime: 1.1,
    bundleSize: 5.4,
    gzipSize: 2.0,
    memoryUsage: 28,
    dependencies: 6,
    renderCount: 2,
    status: "optimal",
  },
  {
    name: "Select",
    category: "Forms",
    renderTime: 5.8,
    rerenderTime: 2.3,
    bundleSize: 12.3,
    gzipSize: 4.5,
    memoryUsage: 62,
    dependencies: 9,
    renderCount: 4,
    status: "warning",
  },
  {
    name: "Tooltip",
    category: "Overlays",
    renderTime: 1.8,
    rerenderTime: 0.6,
    bundleSize: 3.5,
    gzipSize: 1.3,
    memoryUsage: 16,
    dependencies: 4,
    renderCount: 1,
    status: "optimal",
  },
  {
    name: "Avatar",
    category: "Display",
    renderTime: 1.1,
    rerenderTime: 0.4,
    bundleSize: 2.1,
    gzipSize: 0.8,
    memoryUsage: 10,
    dependencies: 2,
    renderCount: 1,
    status: "optimal",
  },
];

const thresholds = {
  renderTime: { warning: 5, critical: 10 },
  bundleSize: { warning: 10, critical: 20 },
  memoryUsage: { warning: 50, critical: 100 },
  rerenderTime: { warning: 3, critical: 8 },
};

const StatusBadge = ({ status }: { status: ComponentMetrics["status"] }) => {
  const config = {
    optimal: { color: "bg-green-500/20 text-green-500", icon: CheckCircle },
    warning: { color: "bg-yellow-500/20 text-yellow-500", icon: AlertTriangle },
    critical: { color: "bg-red-500/20 text-red-500", icon: AlertTriangle },
  };
  const { color, icon: Icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${color}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

const MetricBar = ({
  value,
  max,
  threshold,
  unit,
}: {
  value: number;
  max: number;
  threshold: { warning: number; critical: number };
  unit: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const color =
    value >= threshold.critical
      ? "bg-red-500"
      : value >= threshold.warning
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono w-16 text-right">
        {value.toFixed(1)}
        {unit}
      </span>
    </div>
  );
};

const PerformanceProfiler = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<keyof ComponentMetrics>("renderTime");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "warning" | "critical"
  >("all");
  const [isRunning, setIsRunning] = useState(false);
  const profilerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (profilerTimerRef.current) clearTimeout(profilerTimerRef.current);
    };
  }, []);

  const filteredMetrics = mockMetrics
    .filter(
      (m) =>
        filterStatus === "all" ||
        m.status === filterStatus ||
        (filterStatus === "warning" && m.status === "critical"),
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number" && typeof bVal === "number")
        return bVal - aVal;
      return 0;
    });

  const summary = {
    total: mockMetrics.length,
    optimal: mockMetrics.filter((m) => m.status === "optimal").length,
    warning: mockMetrics.filter((m) => m.status === "warning").length,
    critical: mockMetrics.filter((m) => m.status === "critical").length,
    avgRenderTime:
      mockMetrics.reduce((sum, m) => sum + m.renderTime, 0) /
      mockMetrics.length,
    totalBundleSize: mockMetrics.reduce((sum, m) => sum + m.bundleSize, 0),
  };

  const runProfiler = () => {
    if (profilerTimerRef.current) clearTimeout(profilerTimerRef.current);
    setIsRunning(true);
    profilerTimerRef.current = setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8 text-skai-green" />
              Performance Profiler
            </h1>
            <p className="text-muted-foreground">
              Measure and optimize component performance across the design
              system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runProfiler}
              disabled={isRunning}
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? "Profiling..." : "Run Profiler"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4 text-skai-green" />
              <span className="text-xs text-muted-foreground">Components</span>
            </div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Optimal</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {summary.optimal}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Warnings</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {summary.warning}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Critical</span>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {summary.critical}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-sky-blue" />
              <span className="text-xs text-muted-foreground">Avg Render</span>
            </div>
            <div className="text-2xl font-bold">
              {summary.avgRenderTime.toFixed(1)}ms
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Filter:</span>
            {(["all", "warning", "critical"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm capitalize ${
                  filterStatus === status
                    ? "bg-skai-green text-black"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as keyof ComponentMetrics)
              }
              className="px-3 py-1.5 bg-muted rounded border border-border text-sm"
            >
              <option value="renderTime">Render Time</option>
              <option value="bundleSize">Bundle Size</option>
              <option value="memoryUsage">Memory Usage</option>
              <option value="rerenderTime">Re-render Time</option>
              <option value="renderCount">Render Count</option>
            </select>
          </div>
        </div>

        {/* Component List */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 text-xs font-medium text-muted-foreground border-b border-border">
            <div>Component</div>
            <div>Render Time</div>
            <div>Re-render</div>
            <div>Bundle Size</div>
            <div>Memory</div>
            <div>Renders</div>
            <div>Status</div>
          </div>
          {filteredMetrics.map((metric) => (
            <div
              key={metric.name}
              className={`grid grid-cols-7 gap-4 p-4 border-b border-border/50 hover:bg-muted/30 cursor-pointer ${
                selectedComponent === metric.name ? "bg-muted/50" : ""
              }`}
              onClick={() =>
                setSelectedComponent(
                  selectedComponent === metric.name ? null : metric.name,
                )
              }
            >
              <div>
                <div className="font-medium">{metric.name}</div>
                <div className="text-xs text-muted-foreground">
                  {metric.category}
                </div>
              </div>
              <div>
                <MetricBar
                  value={metric.renderTime}
                  max={20}
                  threshold={thresholds.renderTime}
                  unit="ms"
                />
              </div>
              <div>
                <MetricBar
                  value={metric.rerenderTime}
                  max={15}
                  threshold={thresholds.rerenderTime}
                  unit="ms"
                />
              </div>
              <div>
                <MetricBar
                  value={metric.bundleSize}
                  max={50}
                  threshold={thresholds.bundleSize}
                  unit="KB"
                />
              </div>
              <div>
                <MetricBar
                  value={metric.memoryUsage}
                  max={250}
                  threshold={thresholds.memoryUsage}
                  unit="KB"
                />
              </div>
              <div className="flex items-center">
                <span className="font-mono text-sm">{metric.renderCount}x</span>
              </div>
              <div>
                <StatusBadge status={metric.status} />
              </div>
            </div>
          ))}
        </Card>

        {/* Optimization Suggestions */}
        <Card className="mt-8 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-skai-green" />
            Optimization Suggestions
          </h2>
          <div className="space-y-3">
            {summary.critical > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="font-medium text-red-500 mb-1">
                  Critical: Heavy Components
                </div>
                <p className="text-sm text-muted-foreground">
                  DataTable and CandlestickChart exceed performance thresholds.
                  Consider lazy loading or code splitting.
                </p>
              </div>
            )}
            {summary.warning > 0 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="font-medium text-yellow-500 mb-1">
                  Warning: Frequent Re-renders
                </div>
                <p className="text-sm text-muted-foreground">
                  PriceDisplay re-renders 12 times per mount. Consider
                  React.memo or useMemo optimizations.
                </p>
              </div>
            )}
            <div className="p-3 bg-skai-green/10 border border-skai-green/30 rounded-lg">
              <div className="font-medium text-skai-green mb-1">
                Tip: Bundle Size
              </div>
              <p className="text-sm text-muted-foreground">
                Total bundle size: {summary.totalBundleSize.toFixed(1)}KB.
                Tree-shake unused exports to reduce further.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Performance Profiler",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Performance Profiler

Monitor and optimize design system performance:
- **Render Time** - Initial mount duration
- **Re-render Time** - Update cycle duration
- **Bundle Size** - Component weight (KB)
- **Memory Usage** - Runtime memory footprint
- **Render Count** - Number of renders per interaction

Identify bottlenecks and get optimization suggestions.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: "⚡ Performance Overview",
  render: () => <PerformanceProfiler />,
};
