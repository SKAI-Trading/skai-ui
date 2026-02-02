import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Palette,
  Type,
  Ruler,
  Shield,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/**
 * # Design Linter
 *
 * Automated checks for design consistency across your components.
 * Catch issues before they reach production.
 */

type Severity = "error" | "warning" | "info" | "success";

interface LintRule {
  id: string;
  name: string;
  description: string;
  category:
    | "color"
    | "typography"
    | "spacing"
    | "accessibility"
    | "consistency";
  severity: Severity;
  check: () => LintResult;
}

interface LintResult {
  passed: boolean;
  message: string;
  details?: string[];
  autoFix?: () => void;
}

interface LintReport {
  rule: LintRule;
  result: LintResult;
}

// Mock lint rules
const lintRules: LintRule[] = [
  // Color Rules
  {
    id: "color-contrast",
    name: "Color Contrast",
    description: "Text must have sufficient contrast against background",
    category: "color",
    severity: "error",
    check: () => ({
      passed: true,
      message: "All text meets WCAG AA contrast requirements",
      details: [
        "Primary text: 12.5:1 ✓",
        "Secondary text: 7.2:1 ✓",
        "Muted text: 4.8:1 ✓",
      ],
    }),
  },
  {
    id: "brand-colors",
    name: "Brand Color Usage",
    description: "Only approved brand colors should be used",
    category: "color",
    severity: "warning",
    check: () => ({
      passed: false,
      message: "Found 2 non-brand colors in use",
      details: [
        "#1a1a2e in CardHeader - consider using --card",
        "#e94560 in AlertBadge - consider using --destructive",
      ],
      autoFix: () => console.log("Auto-fixing colors..."),
    }),
  },
  {
    id: "color-semantic",
    name: "Semantic Color Usage",
    description: "Use semantic colors for their intended purpose",
    category: "color",
    severity: "info",
    check: () => ({
      passed: true,
      message: "Semantic colors used correctly",
    }),
  },

  // Typography Rules
  {
    id: "font-scale",
    name: "Typography Scale",
    description: "All font sizes should use the design system scale",
    category: "typography",
    severity: "error",
    check: () => ({
      passed: false,
      message: "Found 1 custom font size",
      details: [
        "font-size: 17px in PriceLabel - use text-lg (18px) or text-base (16px)",
      ],
    }),
  },
  {
    id: "font-weight",
    name: "Font Weight Consistency",
    description: "Use only approved font weights",
    category: "typography",
    severity: "warning",
    check: () => ({
      passed: true,
      message: "All font weights are from the approved set",
    }),
  },
  {
    id: "line-height",
    name: "Line Height",
    description: "Text should have appropriate line height for readability",
    category: "typography",
    severity: "info",
    check: () => ({
      passed: true,
      message: "Line heights are within acceptable range",
    }),
  },

  // Spacing Rules
  {
    id: "spacing-scale",
    name: "Spacing Scale",
    description: "All spacing should use the 4px grid system",
    category: "spacing",
    severity: "warning",
    check: () => ({
      passed: false,
      message: "Found 3 off-grid spacing values",
      details: [
        "padding: 15px → use 16px (spacing-4)",
        "margin: 10px → use 8px or 12px",
        "gap: 7px → use 8px (spacing-2)",
      ],
      autoFix: () => console.log("Auto-fixing spacing..."),
    }),
  },
  {
    id: "consistent-padding",
    name: "Consistent Padding",
    description: "Similar components should have consistent padding",
    category: "spacing",
    severity: "info",
    check: () => ({
      passed: true,
      message: "Padding is consistent across similar components",
    }),
  },

  // Accessibility Rules
  {
    id: "focus-visible",
    name: "Focus Indicators",
    description: "Interactive elements must have visible focus states",
    category: "accessibility",
    severity: "error",
    check: () => ({
      passed: true,
      message: "All interactive elements have focus indicators",
    }),
  },
  {
    id: "touch-target",
    name: "Touch Target Size",
    description: "Interactive elements must be at least 44x44px",
    category: "accessibility",
    severity: "error",
    check: () => ({
      passed: false,
      message: "Found 1 element below minimum touch target",
      details: ["IconButton (32x32px) - increase to 44x44px minimum"],
    }),
  },
  {
    id: "aria-labels",
    name: "ARIA Labels",
    description: "Icon-only buttons must have aria-label",
    category: "accessibility",
    severity: "error",
    check: () => ({
      passed: true,
      message: "All icon buttons have accessible labels",
    }),
  },

  // Consistency Rules
  {
    id: "border-radius",
    name: "Border Radius",
    description: "Use consistent border radius from the scale",
    category: "consistency",
    severity: "warning",
    check: () => ({
      passed: true,
      message: "Border radius values are consistent",
    }),
  },
  {
    id: "shadow-usage",
    name: "Shadow Usage",
    description: "Shadows should use the design system tokens",
    category: "consistency",
    severity: "info",
    check: () => ({
      passed: true,
      message: "Shadow tokens used correctly",
    }),
  },
  {
    id: "animation-timing",
    name: "Animation Timing",
    description: "Animations should use approved duration and easing",
    category: "consistency",
    severity: "info",
    check: () => ({
      passed: true,
      message: "Animation timing is consistent",
    }),
  },
];

const severityConfig: Record<
  Severity,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  error: {
    icon: <XCircle className="w-5 h-5" />,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
};

const categoryConfig: Record<string, { icon: React.ReactNode; label: string }> =
  {
    color: { icon: <Palette className="w-4 h-4" />, label: "Color" },
    typography: { icon: <Type className="w-4 h-4" />, label: "Typography" },
    spacing: { icon: <Ruler className="w-4 h-4" />, label: "Spacing" },
    accessibility: {
      icon: <Shield className="w-4 h-4" />,
      label: "Accessibility",
    },
    consistency: { icon: <Zap className="w-4 h-4" />, label: "Consistency" },
  };

const DesignLinterDashboard = () => {
  const [reports, setReports] = useState<LintReport[]>(() =>
    lintRules.map((rule) => ({ rule, result: rule.check() })),
  );
  const [expandedRules, setExpandedRules] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runLinter = () => {
    setIsRunning(true);
    setTimeout(() => {
      setReports(lintRules.map((rule) => ({ rule, result: rule.check() })));
      setIsRunning(false);
    }, 1500);
  };

  const toggleRule = (id: string) => {
    setExpandedRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const filteredReports = reports.filter((report) => {
    if (filterCategory && report.rule.category !== filterCategory) return false;
    if (filterSeverity && report.rule.severity !== filterSeverity) return false;
    return true;
  });

  const stats = {
    total: reports.length,
    passed: reports.filter((r) => r.result.passed).length,
    errors: reports.filter(
      (r) => !r.result.passed && r.rule.severity === "error",
    ).length,
    warnings: reports.filter(
      (r) => !r.result.passed && r.rule.severity === "warning",
    ).length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Design Linter</h1>
            <p className="text-muted-foreground">
              Automated checks for design consistency and best practices.
            </p>
          </div>
          <Button onClick={runLinter} disabled={isRunning}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRunning ? "animate-spin" : ""}`}
            />
            {isRunning ? "Running..." : "Run Linter"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Rules</div>
          </Card>
          <Card className="p-4 text-center bg-green-500/10">
            <div className="text-3xl font-bold text-green-500">
              {stats.passed}
            </div>
            <div className="text-sm text-muted-foreground">Passed</div>
          </Card>
          <Card className="p-4 text-center bg-red-500/10">
            <div className="text-3xl font-bold text-red-500">
              {stats.errors}
            </div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </Card>
          <Card className="p-4 text-center bg-yellow-500/10">
            <div className="text-3xl font-bold text-yellow-500">
              {stats.warnings}
            </div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label
                htmlFor="category-filter"
                className="text-sm text-muted-foreground mr-2"
              >
                Category:
              </label>
              <select
                id="category-filter"
                value={filterCategory || ""}
                onChange={(e) => setFilterCategory(e.target.value || null)}
                className="px-3 py-1.5 bg-muted rounded-lg border border-border text-sm"
              >
                <option value="">All</option>
                {Object.entries(categoryConfig).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="severity-filter"
                className="text-sm text-muted-foreground mr-2"
              >
                Severity:
              </label>
              <select
                id="severity-filter"
                value={filterSeverity || ""}
                onChange={(e) =>
                  setFilterSeverity((e.target.value as Severity) || null)
                }
                className="px-3 py-1.5 bg-muted rounded-lg border border-border text-sm"
              >
                <option value="">All</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Rules List */}
        <div className="space-y-3">
          {filteredReports.map(({ rule, result }) => {
            const severity = result.passed ? "success" : rule.severity;
            const config = severityConfig[severity];
            const isExpanded = expandedRules.includes(rule.id);

            return (
              <Card key={rule.id} className={`overflow-hidden ${config.bg}`}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleRule(rule.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleRule(rule.id);
                    }
                  }}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-black/5 transition-colors cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <div className={config.color}>{config.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rule.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {categoryConfig[rule.category].icon}
                        <span className="ml-1">
                          {categoryConfig[rule.category].label}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                  </div>
                  {result.autoFix && !result.passed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        result.autoFix?.();
                      }}
                    >
                      Auto-fix
                    </Button>
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mt-3 mb-2">
                      {rule.description}
                    </p>
                    {result.details && (
                      <ul className="space-y-1">
                        {result.details.map((detail, i) => (
                          <li
                            key={i}
                            className="text-sm font-mono bg-black/10 px-3 py-2 rounded"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Design Linter",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Design Linter

Automated design consistency checks:
- **Color** - Contrast, brand colors, semantic usage
- **Typography** - Scale, weights, line heights
- **Spacing** - 4px grid, consistent padding
- **Accessibility** - Focus states, touch targets, ARIA
- **Consistency** - Border radius, shadows, animations

Run the linter to catch issues before they reach production.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Dashboard: Story = {
  name: "🔍 Linter Dashboard",
  render: () => <DesignLinterDashboard />,
};
