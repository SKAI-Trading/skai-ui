import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Clock,
  Download,
  Layers,
} from "lucide-react";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/**
 * # Analytics Dashboard
 *
 * Track component usage across all projects. Understand which components
 * are most popular, identify underutilized ones, and make data-driven decisions.
 */

interface ComponentUsage {
  name: string;
  category: string;
  imports: number;
  instances: number;
  trend: number;
  projects: string[];
  lastUsed: Date;
}

interface ProjectStats {
  name: string;
  components: number;
  coverage: number;
  lastUpdated: Date;
}

const mockUsageData: ComponentUsage[] = [
  {
    name: "Button",
    category: "Primitives",
    imports: 1247,
    instances: 3892,
    trend: 12,
    projects: ["app", "landing", "admin"],
    lastUsed: new Date(),
  },
  {
    name: "Card",
    category: "Primitives",
    imports: 892,
    instances: 2156,
    trend: 8,
    projects: ["app", "landing", "admin"],
    lastUsed: new Date(),
  },
  {
    name: "Input",
    category: "Forms",
    imports: 756,
    instances: 1834,
    trend: 5,
    projects: ["app", "admin"],
    lastUsed: new Date(),
  },
  {
    name: "Badge",
    category: "Primitives",
    imports: 623,
    instances: 1567,
    trend: -3,
    projects: ["app", "landing"],
    lastUsed: new Date(Date.now() - 86400000),
  },
  {
    name: "Dialog",
    category: "Overlays",
    imports: 456,
    instances: 892,
    trend: 15,
    projects: ["app", "admin"],
    lastUsed: new Date(),
  },
  {
    name: "Tabs",
    category: "Navigation",
    imports: 389,
    instances: 734,
    trend: 2,
    projects: ["app"],
    lastUsed: new Date(Date.now() - 172800000),
  },
  {
    name: "TokenIcon",
    category: "Trading",
    imports: 345,
    instances: 1256,
    trend: 28,
    projects: ["app"],
    lastUsed: new Date(),
  },
  {
    name: "PriceDisplay",
    category: "Trading",
    imports: 298,
    instances: 987,
    trend: 22,
    projects: ["app"],
    lastUsed: new Date(),
  },
  {
    name: "Tooltip",
    category: "Overlays",
    imports: 267,
    instances: 612,
    trend: -5,
    projects: ["app", "landing"],
    lastUsed: new Date(Date.now() - 259200000),
  },
  {
    name: "Skeleton",
    category: "Feedback",
    imports: 234,
    instances: 567,
    trend: 18,
    projects: ["app"],
    lastUsed: new Date(),
  },
  {
    name: "Avatar",
    category: "Display",
    imports: 198,
    instances: 445,
    trend: 4,
    projects: ["app", "admin"],
    lastUsed: new Date(),
  },
  {
    name: "Switch",
    category: "Forms",
    imports: 156,
    instances: 312,
    trend: -8,
    projects: ["app"],
    lastUsed: new Date(Date.now() - 432000000),
  },
  {
    name: "OrderBook",
    category: "Trading",
    imports: 89,
    instances: 134,
    trend: 45,
    projects: ["app"],
    lastUsed: new Date(),
  },
  {
    name: "CandlestickChart",
    category: "Trading",
    imports: 67,
    instances: 89,
    trend: 35,
    projects: ["app"],
    lastUsed: new Date(),
  },
  {
    name: "Carousel",
    category: "Display",
    imports: 23,
    instances: 34,
    trend: -15,
    projects: ["landing"],
    lastUsed: new Date(Date.now() - 604800000),
  },
];

const mockProjects: ProjectStats[] = [
  {
    name: "skai-trading (app)",
    components: 45,
    coverage: 87,
    lastUpdated: new Date(),
  },
  {
    name: "skai-landing",
    components: 23,
    coverage: 72,
    lastUpdated: new Date(Date.now() - 86400000),
  },
  {
    name: "skai-admin",
    components: 31,
    coverage: 68,
    lastUpdated: new Date(Date.now() - 172800000),
  },
];

// Simple bar chart component
const SimpleBarChart = ({
  data,
  maxValue,
}: {
  data: { label: string; value: number; color?: string }[];
  maxValue: number;
}) => (
  <div className="space-y-2">
    {data.map((item, i) => (
      <div key={i} className="flex items-center gap-3">
        <span className="text-xs w-20 truncate">{item.label}</span>
        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${item.color || "bg-skai-green"} transition-all duration-500`}
            style={{ width: `${(item.value / maxValue) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono w-12 text-right">{item.value}</span>
      </div>
    ))}
  </div>
);

// Trend indicator
const TrendIndicator = ({ value }: { value: number }) => (
  <span
    className={`flex items-center gap-1 text-xs font-medium ${
      value >= 0 ? "text-green-500" : "text-red-500"
    }`}
  >
    {value >= 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    )}
    {Math.abs(value)}%
  </span>
);

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [sortBy, setSortBy] = useState<"imports" | "instances" | "trend">(
    "imports",
  );

  const sortedData = [...mockUsageData].sort((a, b) => b[sortBy] - a[sortBy]);
  const topComponents = sortedData.slice(0, 10);

  const totalImports = mockUsageData.reduce((sum, c) => sum + c.imports, 0);
  const totalInstances = mockUsageData.reduce((sum, c) => sum + c.instances, 0);
  const avgCoverage =
    mockProjects.length > 0
      ? mockProjects.reduce((sum, p) => sum + p.coverage, 0) /
        mockProjects.length
      : 0;

  const categoryData = Object.entries(
    mockUsageData.reduce(
      (acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + c.imports;
        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-skai-green" />
              Usage Analytics
            </h1>
            <p className="text-muted-foreground">
              Track component adoption and usage patterns across projects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-sm ${
                  timeRange === range
                    ? "bg-skai-green text-black"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {range}
              </button>
            ))}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-skai-green" />
              <span className="text-sm text-muted-foreground">
                Total Components
              </span>
            </div>
            <div className="text-3xl font-bold">{mockUsageData.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              in design system
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-sky-blue" />
              <span className="text-sm text-muted-foreground">
                Total Imports
              </span>
            </div>
            <div className="text-3xl font-bold">
              {totalImports.toLocaleString()}
            </div>
            <TrendIndicator value={8} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">
                Total Instances
              </span>
            </div>
            <div className="text-3xl font-bold">
              {totalInstances.toLocaleString()}
            </div>
            <TrendIndicator value={12} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">
                Avg Coverage
              </span>
            </div>
            <div className="text-3xl font-bold">{avgCoverage.toFixed(0)}%</div>
            <TrendIndicator value={3} />
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Top Components */}
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Top Components</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1.5 bg-muted rounded-lg border border-border text-sm"
                aria-label="Sort components by"
              >
                <option value="imports">By Imports</option>
                <option value="instances">By Instances</option>
                <option value="trend">By Growth</option>
              </select>
            </div>
            <SimpleBarChart
              data={topComponents.map((c) => ({
                label: c.name,
                value: c[sortBy],
                color:
                  c.trend > 20
                    ? "bg-green-500"
                    : c.trend < 0
                      ? "bg-red-500"
                      : "bg-skai-green",
              }))}
              maxValue={Math.max(...topComponents.map((c) => c[sortBy]))}
            />
          </Card>

          {/* By Category */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">By Category</h2>
            <SimpleBarChart
              data={categoryData.map((c) => ({ ...c, color: "bg-sky-blue" }))}
              maxValue={Math.max(...categoryData.map((c) => c.value))}
            />
          </Card>
        </div>

        {/* Projects Overview */}
        <Card className="p-6 mb-8">
          <h2 className="font-semibold mb-4">Projects Using Design System</h2>
          <div className="grid grid-cols-3 gap-4">
            {mockProjects.map((project) => (
              <div key={project.name} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{project.name}</span>
                  <Badge variant="outline">
                    {project.components} components
                  </Badge>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Coverage</span>
                    <span>{project.coverage}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        project.coverage > 80
                          ? "bg-green-500"
                          : project.coverage > 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${project.coverage}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {project.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed Table */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4">All Components</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 font-medium">Component</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Imports</th>
                  <th className="pb-3 font-medium text-right">Instances</th>
                  <th className="pb-3 font-medium text-right">Trend</th>
                  <th className="pb-3 font-medium">Projects</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((component) => (
                  <tr
                    key={component.name}
                    className="border-b border-border/50 hover:bg-muted/50"
                  >
                    <td className="py-3 font-medium">{component.name}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">
                        {component.category}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-mono">
                      {component.imports}
                    </td>
                    <td className="py-3 text-right font-mono">
                      {component.instances}
                    </td>
                    <td className="py-3 text-right">
                      <TrendIndicator value={component.trend} />
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {component.projects.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 bg-muted rounded text-xs"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Analytics Dashboard",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Usage Analytics

Track design system adoption:
- **Import counts** - How often components are imported
- **Instance counts** - Total rendered instances
- **Trend analysis** - Growing vs declining usage
- **Project coverage** - Adoption per project
- **Category breakdown** - Usage by component type

Use data to prioritize maintenance and deprecation decisions.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: "📊 Analytics Overview",
  render: () => <AnalyticsDashboard />,
};
