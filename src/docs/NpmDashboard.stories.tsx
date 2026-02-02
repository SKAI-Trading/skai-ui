import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef, useEffect } from "react";
import {
  Package,
  Download,
  TrendingUp,
  Users,
  GitBranch,
  Calendar,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  RefreshCw,
} from "lucide-react";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/**
 * # NPM Package Dashboard
 *
 * Track package downloads, dependents, version adoption,
 * and overall health of the published design system.
 */

interface VersionStats {
  version: string;
  downloads: number;
  percentage: number;
  releaseDate: Date;
  isLatest: boolean;
  isDeprecated: boolean;
}

interface DependentProject {
  name: string;
  version: string;
  lastUpdated: Date;
  status: "current" | "behind" | "outdated";
}

const mockVersions: VersionStats[] = [
  {
    version: "0.2.1",
    downloads: 4521,
    percentage: 52,
    releaseDate: new Date(Date.now() - 604800000),
    isLatest: true,
    isDeprecated: false,
  },
  {
    version: "0.2.0",
    downloads: 2134,
    percentage: 24,
    releaseDate: new Date(Date.now() - 1209600000),
    isLatest: false,
    isDeprecated: false,
  },
  {
    version: "0.1.9",
    downloads: 1256,
    percentage: 14,
    releaseDate: new Date(Date.now() - 2419200000),
    isLatest: false,
    isDeprecated: false,
  },
  {
    version: "0.1.8",
    downloads: 534,
    percentage: 6,
    releaseDate: new Date(Date.now() - 3628800000),
    isLatest: false,
    isDeprecated: false,
  },
  {
    version: "0.1.7",
    downloads: 189,
    percentage: 2,
    releaseDate: new Date(Date.now() - 4838400000),
    isLatest: false,
    isDeprecated: true,
  },
  {
    version: "0.1.6",
    downloads: 98,
    percentage: 1,
    releaseDate: new Date(Date.now() - 6048000000),
    isLatest: false,
    isDeprecated: true,
  },
];

const mockDependents: DependentProject[] = [
  {
    name: "skai-trading",
    version: "0.2.1",
    lastUpdated: new Date(),
    status: "current",
  },
  {
    name: "skai-landing",
    version: "0.2.0",
    lastUpdated: new Date(Date.now() - 172800000),
    status: "behind",
  },
  {
    name: "skai-admin",
    version: "0.2.1",
    lastUpdated: new Date(Date.now() - 86400000),
    status: "current",
  },
  {
    name: "skai-mobile",
    version: "0.1.9",
    lastUpdated: new Date(Date.now() - 604800000),
    status: "outdated",
  },
  {
    name: "skai-docs",
    version: "0.2.0",
    lastUpdated: new Date(Date.now() - 259200000),
    status: "behind",
  },
];

const weeklyDownloads = [
  3200, 3800, 4100, 3900, 4500, 5200, 5800, 6100, 5900, 6800, 7200, 8732,
];

const SimpleLineChart = ({
  data,
  height = 80,
}: {
  data: number[];
  height?: number;
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const denominator = data.length > 1 ? data.length - 1 : 1;

  const points = data
    .map((value, index) => {
      const x = data.length === 1 ? 50 : (index / denominator) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ height, width: "100%" }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00E5A0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00E5A0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill="url(#lineGradient)" />
      <polyline
        points={points}
        fill="none"
        stroke="#00E5A0"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const StatusBadge = ({ status }: { status: DependentProject["status"] }) => {
  const config = {
    current: {
      color: "bg-green-500/20 text-green-500",
      icon: CheckCircle,
      label: "Current",
    },
    behind: {
      color: "bg-yellow-500/20 text-yellow-500",
      icon: Clock,
      label: "1 behind",
    },
    outdated: {
      color: "bg-red-500/20 text-red-500",
      icon: AlertTriangle,
      label: "Outdated",
    },
  };
  const { color, icon: Icon, label } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${color}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const NpmPackageDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const totalDownloads = mockVersions.reduce((sum, v) => sum + v.downloads, 0);
  const latestAdoption = mockVersions.find((v) => v.isLatest)?.percentage || 0;
  const deprecatedDownloads = mockVersions
    .filter((v) => v.isDeprecated)
    .reduce((sum, v) => sum + v.downloads, 0);

  const weeklyGrowth = Math.round(
    ((weeklyDownloads[weeklyDownloads.length - 1] -
      weeklyDownloads[weeklyDownloads.length - 2]) /
      weeklyDownloads[weeklyDownloads.length - 2]) *
      100,
  );

  const handleRefresh = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setIsRefreshing(true);
    refreshTimerRef.current = setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Package className="w-8 h-8 text-skai-green" />
              NPM Package Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track @skai/ui package health and adoption.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on npm
            </Button>
          </div>
        </div>

        {/* Package Info */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-red-500"
                  fill="currentColor"
                >
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg">@skai/ui</div>
                <div className="text-sm text-muted-foreground">
                  SKAI Design System Component Library
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Latest Version
                </div>
                <div className="font-mono font-semibold text-skai-green">
                  v0.2.1
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">License</div>
                <div className="font-semibold">MIT</div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">127</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-skai-green" />
              <span className="text-sm text-muted-foreground">
                Weekly Downloads
              </span>
            </div>
            <div className="text-2xl font-bold">
              {weeklyDownloads[weeklyDownloads.length - 1].toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3" />+{weeklyGrowth}% from last week
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-sky-blue" />
              <span className="text-sm text-muted-foreground">Dependents</span>
            </div>
            <div className="text-2xl font-bold">{mockDependents.length}</div>
            <div className="text-xs text-muted-foreground">
              {mockDependents.filter((d) => d.status === "current").length} on
              latest
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">
                Latest Adoption
              </span>
            </div>
            <div className="text-2xl font-bold">{latestAdoption}%</div>
            <div className="text-xs text-muted-foreground">
              on v{mockVersions.find((v) => v.isLatest)?.version}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Deprecated Usage
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {Math.round((deprecatedDownloads / totalDownloads) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {deprecatedDownloads.toLocaleString()} downloads
            </div>
          </Card>
        </div>

        {/* Download Trend */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold mb-4">Download Trend (12 weeks)</h2>
          <SimpleLineChart data={weeklyDownloads} height={120} />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>12 weeks ago</span>
            <span>Today</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Version Distribution */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Version Distribution</h2>
            <div className="space-y-3">
              {mockVersions.map((version) => (
                <div key={version.version} className="flex items-center gap-3">
                  <div className="w-16 font-mono text-sm flex items-center gap-1">
                    {version.isLatest && (
                      <>
                        <Badge className="bg-skai-green/20 text-skai-green text-[10px] px-1">
                          latest
                        </Badge>
                        <span>v{version.version}</span>
                      </>
                    )}
                    {version.isDeprecated && (
                      <>
                        <Badge
                          variant="destructive"
                          className="text-[10px] px-1"
                        >
                          deprecated
                        </Badge>
                        <span className="text-muted-foreground">
                          v{version.version}
                        </span>
                      </>
                    )}
                    {!version.isLatest && !version.isDeprecated && (
                      <span className="text-muted-foreground">
                        v{version.version}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          version.isDeprecated
                            ? "bg-red-500/50"
                            : version.isLatest
                              ? "bg-skai-green"
                              : "bg-sky-blue"
                        } transition-all`}
                        style={{ width: `${version.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-mono text-sm">
                      {version.percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({version.downloads.toLocaleString()})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Dependents */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Dependent Projects</h2>
            <div className="space-y-3">
              {mockDependents.map((dep) => (
                <div
                  key={dep.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{dep.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-mono">v{dep.version}</span>
                      <span>•</span>
                      <span>
                        Updated {dep.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={dep.status} />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Projects on latest:
                </span>
                <span className="font-semibold text-green-500">
                  {mockDependents.filter((d) => d.status === "current").length}/
                  {mockDependents.length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Release Timeline */}
        <Card className="mt-6 p-6">
          <h2 className="font-semibold mb-4">Recent Releases</h2>
          <div className="space-y-4">
            {mockVersions.slice(0, 4).map((version, idx) => (
              <div key={version.version} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      version.isLatest ? "bg-skai-green" : "bg-muted-foreground"
                    }`}
                  />
                  {idx < 3 && <div className="w-0.5 h-8 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">
                      v{version.version}
                    </span>
                    {version.isLatest && (
                      <Badge className="bg-skai-green/20 text-skai-green text-xs">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {version.releaseDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">
                    {version.downloads.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">downloads</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/NPM Dashboard",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# NPM Package Dashboard

Monitor published package health:
- **Download Trends** - Weekly/monthly download counts
- **Version Adoption** - Track migration to latest version
- **Dependent Projects** - Who's using your package
- **Deprecation Alerts** - Usage of deprecated versions
- **Release Timeline** - Version history and metrics

Keep your package healthy and adoption high.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Dashboard: Story = {
  name: "📦 Package Dashboard",
  render: () => <NpmPackageDashboard />,
};
