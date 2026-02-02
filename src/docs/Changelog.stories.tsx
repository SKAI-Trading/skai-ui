import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Clock,
  GitBranch,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card } from "../components/core/card";
import { Badge } from "../components/core/badge";

/**
 * # Component Changelog
 *
 * Track all changes to the design system. Stay informed about updates,
 * breaking changes, and new features.
 */

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: {
    type: "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";
    component?: string;
    description: string;
    breaking?: boolean;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "0.2.0",
    date: "2026-02-01",
    type: "minor",
    changes: [
      {
        type: "added",
        component: "ComponentPlayground",
        description: "Interactive playground for experimenting with components",
      },
      {
        type: "added",
        component: "TokenExporter",
        description:
          "Export tokens in CSS, SCSS, JSON, Tailwind, Figma formats",
      },
      {
        type: "added",
        component: "Changelog",
        description: "Component changelog tracking system",
      },
      {
        type: "added",
        component: "VisualDiff",
        description: "Visual regression testing comparison tool",
      },
      {
        type: "changed",
        component: "ThemeConfigurator",
        description: "Improved color picker with better contrast checking",
      },
      {
        type: "fixed",
        component: "Button",
        description: "Fixed focus ring visibility in dark mode",
      },
    ],
  },
  {
    version: "0.1.5",
    date: "2026-01-28",
    type: "patch",
    changes: [
      {
        type: "added",
        component: "ProductionMockups",
        description: "Full-page mockups matching production design",
      },
      {
        type: "added",
        component: "MockDataLibrary",
        description: "Realistic mock data generators",
      },
      {
        type: "added",
        component: "DesignTokens",
        description: "Complete design token documentation",
      },
      {
        type: "added",
        component: "CompositionGuide",
        description: "Component composition examples",
      },
      {
        type: "added",
        component: "ResponsivePreview",
        description: "Device frame previews at all breakpoints",
      },
      {
        type: "added",
        component: "FigmaIntegration",
        description: "Figma to code translation guide",
      },
      {
        type: "added",
        component: "AccessibilityChecker",
        description: "Built-in accessibility audit tools",
      },
      {
        type: "added",
        component: "CodeExport",
        description: "One-click code copy system",
      },
    ],
  },
  {
    version: "0.1.4",
    date: "2026-01-25",
    type: "patch",
    changes: [
      {
        type: "added",
        component: "AppShell",
        description: "New layout system with sidebar, header, content areas",
      },
      {
        type: "added",
        component: "DashboardLayout",
        description: "Pre-built dashboard layout variant",
      },
      {
        type: "added",
        component: "TradingLayout",
        description: "Multi-panel trading interface layout",
      },
      {
        type: "changed",
        component: "Card",
        description: "Added new variants: elevated, outlined, ghost",
        breaking: true,
      },
      {
        type: "deprecated",
        component: "PageLayout",
        description: "Use AppShell instead",
      },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-01-20",
    type: "patch",
    changes: [
      {
        type: "added",
        component: "CandlestickChart",
        description: "Interactive candlestick chart with zoom and pan",
      },
      {
        type: "added",
        component: "DepthChart",
        description: "Order book depth visualization",
      },
      {
        type: "added",
        component: "OrderBook",
        description: "Real-time order book component",
      },
      {
        type: "fixed",
        component: "TokenIcon",
        description: "Fixed image loading for unknown tokens",
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-01-15",
    type: "patch",
    changes: [
      {
        type: "added",
        component: "SwapInput",
        description: "Token swap input with balance and max button",
      },
      {
        type: "added",
        component: "TokenSelect",
        description: "Token selection dropdown with search",
      },
      {
        type: "added",
        component: "PriceDisplay",
        description: "Formatted price with change indicator",
      },
      {
        type: "changed",
        component: "Input",
        description: "Added size variants: sm, default, lg",
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-01-10",
    type: "patch",
    changes: [
      {
        type: "added",
        component: "ThemeProvider",
        description: "Dark/light theme support",
      },
      {
        type: "added",
        component: "ThemeToggle",
        description: "Theme switcher component",
      },
      {
        type: "fixed",
        component: "Dialog",
        description: "Fixed backdrop blur on Safari",
      },
      {
        type: "security",
        description: "Updated dependencies to patch vulnerabilities",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-01-01",
    type: "major",
    changes: [
      {
        type: "added",
        description: "Initial release of SKAI UI component library",
      },
      {
        type: "added",
        component: "Button",
        description: "Button component with variants",
      },
      {
        type: "added",
        component: "Card",
        description: "Card container component",
      },
      {
        type: "added",
        component: "Input",
        description: "Text input component",
      },
      { type: "added", component: "Badge", description: "Badge component" },
      {
        type: "added",
        component: "Dialog",
        description: "Modal dialog component",
      },
      {
        type: "added",
        component: "Tabs",
        description: "Tab navigation component",
      },
    ],
  },
];

const changeTypeColors: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  added: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  changed: {
    bg: "bg-blue-500/20",
    text: "text-blue-500",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  deprecated: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  removed: {
    bg: "bg-red-500/20",
    text: "text-red-500",
    icon: <XCircle className="w-4 h-4" />,
  },
  fixed: {
    bg: "bg-purple-500/20",
    text: "text-purple-500",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  security: {
    bg: "bg-orange-500/20",
    text: "text-orange-500",
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

const versionTypeColors: Record<string, string> = {
  major: "bg-red-500",
  minor: "bg-blue-500",
  patch: "bg-green-500",
};

const ChangelogViewer = () => {
  const [expandedVersions, setExpandedVersions] = useState<string[]>(
    changelog.length > 0 ? [changelog[0].version] : [],
  );
  const [filter, setFilter] = useState<string | null>(null);

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) =>
      prev.includes(version)
        ? prev.filter((v) => v !== version)
        : [...prev, version],
    );
  };

  const filteredChangelog = filter
    ? changelog
        .map((entry) => ({
          ...entry,
          changes: entry.changes.filter((c) => c.type === filter),
        }))
        .filter((entry) => entry.changes.length > 0)
    : changelog;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Changelog</h1>
          <p className="text-muted-foreground">
            Track all changes to the SKAI design system.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === null
                ? "bg-skai-green text-black"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {Object.keys(changeTypeColors).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                filter === type
                  ? "bg-skai-green text-black"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {changeTypeColors[type].icon}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredChangelog.map((entry) => (
            <Card key={entry.version} className="overflow-hidden">
              <button
                onClick={() => toggleVersion(entry.version)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedVersions.includes(entry.version) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono font-bold">
                      v{entry.version}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${versionTypeColors[entry.type]}`}
                      title={entry.type}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {entry.changes.length} changes
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {entry.date}
                  </span>
                </div>
              </button>

              {expandedVersions.includes(entry.version) && (
                <div className="border-t border-border p-4">
                  <div className="space-y-3">
                    {entry.changes.map((change, i) => {
                      const style = changeTypeColors[change.type];
                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-lg ${style.bg}`}
                        >
                          <div className={style.text}>{style.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-medium uppercase ${style.text}`}
                              >
                                {change.type}
                              </span>
                              {change.component && (
                                <span className="text-sm font-mono bg-black/20 px-2 py-0.5 rounded">
                                  {change.component}
                                </span>
                              )}
                              {change.breaking && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Breaking
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm mt-1">{change.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Version Legend */}
        <Card className="mt-8 p-4">
          <h3 className="font-semibold mb-3">Version Legend</h3>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Major (breaking changes)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Minor (new features)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span>Patch (bug fixes)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Changelog",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Component Changelog

Track all design system changes:
- **Added** - New components or features
- **Changed** - Updates to existing components
- **Deprecated** - Features to be removed
- **Removed** - Deleted features
- **Fixed** - Bug fixes
- **Security** - Security patches
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Viewer: Story = {
  name: "📋 Changelog",
  render: () => <ChangelogViewer />,
};
