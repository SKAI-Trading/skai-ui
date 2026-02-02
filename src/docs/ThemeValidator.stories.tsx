import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Sun,
  Moon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Palette,
  Type,
  Contrast,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Card } from "../components/core/card";
import { Button } from "../components/core/button";

/**
 * # Dark/Light Mode Validator
 *
 * Ensure all components render correctly in both dark and light themes.
 * Catch contrast issues, missing styles, and theme inconsistencies.
 */

interface ThemeCheck {
  component: string;
  category: string;
  checks: {
    name: string;
    type: "contrast" | "color" | "border" | "shadow" | "text";
    darkMode: "pass" | "fail" | "warning";
    lightMode: "pass" | "fail" | "warning";
    details?: string;
  }[];
}

const mockChecks: ThemeCheck[] = [
  {
    component: "Button",
    category: "Primitives",
    checks: [
      {
        name: "Primary contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Secondary contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Outline visibility",
        type: "border",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Disabled state",
        type: "color",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Focus ring",
        type: "border",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
  {
    component: "Card",
    category: "Primitives",
    checks: [
      {
        name: "Background contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Border visibility",
        type: "border",
        darkMode: "pass",
        lightMode: "warning",
        details: "Border too subtle in light mode",
      },
      {
        name: "Shadow visibility",
        type: "shadow",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
  {
    component: "Input",
    category: "Forms",
    checks: [
      {
        name: "Text contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Placeholder contrast",
        type: "contrast",
        darkMode: "warning",
        lightMode: "pass",
        details: "Placeholder too dark in dark mode (3.8:1)",
      },
      {
        name: "Border focus",
        type: "border",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Error state",
        type: "color",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Disabled background",
        type: "color",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
  {
    component: "Badge",
    category: "Primitives",
    checks: [
      {
        name: "Default variant",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Outline variant",
        type: "border",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Destructive variant",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
  {
    component: "Dialog",
    category: "Overlays",
    checks: [
      {
        name: "Overlay opacity",
        type: "color",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Content background",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Title contrast",
        type: "text",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Close button",
        type: "contrast",
        darkMode: "pass",
        lightMode: "warning",
        details: "Close icon too light",
      },
    ],
  },
  {
    component: "Tooltip",
    category: "Overlays",
    checks: [
      {
        name: "Background contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "fail",
        details: "White text on light bg (2.1:1)",
      },
      {
        name: "Arrow visibility",
        type: "border",
        darkMode: "pass",
        lightMode: "fail",
        details: "Arrow not visible in light mode",
      },
    ],
  },
  {
    component: "Table",
    category: "Display",
    checks: [
      {
        name: "Header contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      { name: "Row hover", type: "color", darkMode: "pass", lightMode: "pass" },
      {
        name: "Stripe alternation",
        type: "color",
        darkMode: "warning",
        lightMode: "pass",
        details: "Stripes too subtle in dark mode",
      },
      {
        name: "Border visibility",
        type: "border",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
  {
    component: "Select",
    category: "Forms",
    checks: [
      {
        name: "Trigger contrast",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Dropdown background",
        type: "color",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Option hover",
        type: "color",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Checkmark visibility",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
  {
    component: "Alert",
    category: "Feedback",
    checks: [
      {
        name: "Info variant",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Warning variant",
        type: "contrast",
        darkMode: "pass",
        lightMode: "warning",
        details: "Yellow text hard to read (3.5:1)",
      },
      {
        name: "Error variant",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
      {
        name: "Success variant",
        type: "contrast",
        darkMode: "pass",
        lightMode: "pass",
      },
    ],
  },
];

const StatusIcon = ({ status }: { status: "pass" | "fail" | "warning" }) => {
  if (status === "pass")
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === "fail") return <XCircle className="w-4 h-4 text-red-500" />;
  return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
};

const ComponentCard = ({
  check,
  isExpanded,
  onToggle,
}: {
  check: ThemeCheck;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const darkPasses = check.checks.filter((c) => c.darkMode === "pass").length;
  const lightPasses = check.checks.filter((c) => c.lightMode === "pass").length;
  const total = check.checks.length;

  const darkStatus =
    darkPasses === total
      ? "pass"
      : check.checks.some((c) => c.darkMode === "fail")
        ? "fail"
        : "warning";
  const lightStatus =
    lightPasses === total
      ? "pass"
      : check.checks.some((c) => c.lightMode === "fail")
        ? "fail"
        : "warning";

  return (
    <Card className="overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <div>
            <div className="font-medium">{check.component}</div>
            <div className="text-xs text-muted-foreground">
              {check.category}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <StatusIcon status={darkStatus} />
            <span className="text-sm font-mono">
              {darkPasses}/{total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <StatusIcon status={lightStatus} />
            <span className="text-sm font-mono">
              {lightPasses}/{total}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border">
          {check.checks.map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-3 flex items-center justify-between border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                  {item.type === "contrast" && <Contrast className="w-3 h-3" />}
                  {item.type === "color" && <Palette className="w-3 h-3" />}
                  {item.type === "text" && <Type className="w-3 h-3" />}
                  {item.type === "border" && <Eye className="w-3 h-3" />}
                  {item.type === "shadow" && <Eye className="w-3 h-3" />}
                </span>
                <div>
                  <div className="text-sm">{item.name}</div>
                  {item.details && (
                    <div className="text-xs text-muted-foreground">
                      {item.details}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <StatusIcon status={item.darkMode} />
                <StatusIcon status={item.lightMode} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const DarkLightValidator = () => {
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "issues">("all");
  const [isValidating, setIsValidating] = useState(false);

  const toggleComponent = (name: string) => {
    setExpandedComponents((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const filteredChecks =
    filter === "all"
      ? mockChecks
      : mockChecks.filter((check) =>
          check.checks.some(
            (c) => c.darkMode !== "pass" || c.lightMode !== "pass",
          ),
        );

  const summary = {
    total: mockChecks.length,
    darkPassing: mockChecks.filter((c) =>
      c.checks.every((ch) => ch.darkMode === "pass"),
    ).length,
    lightPassing: mockChecks.filter((c) =>
      c.checks.every((ch) => ch.lightMode === "pass"),
    ).length,
    issues: mockChecks.filter((c) =>
      c.checks.some((ch) => ch.darkMode !== "pass" || ch.lightMode !== "pass"),
    ).length,
  };

  const runValidation = () => {
    setIsValidating(true);
    setTimeout(() => setIsValidating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="flex items-center">
                <Sun className="w-7 h-7 text-yellow-500" />
                <Moon className="w-7 h-7 text-sky-blue -ml-2" />
              </div>
              Theme Validator
            </h1>
            <p className="text-muted-foreground">
              Validate component rendering in dark and light modes.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={runValidation}
            disabled={isValidating}
          >
            {isValidating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {isValidating ? "Validating..." : "Run Validation"}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Components</div>
            <div className="text-2xl font-bold">{summary.total}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Moon className="w-4 h-4" />
              Dark Mode
            </div>
            <div className="text-2xl font-bold text-green-500">
              {summary.darkPassing}/{summary.total}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Sun className="w-4 h-4" />
              Light Mode
            </div>
            <div className="text-2xl font-bold text-green-500">
              {summary.lightPassing}/{summary.total}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Issues Found
            </div>
            <div
              className={`text-2xl font-bold ${summary.issues > 0 ? "text-yellow-500" : "text-green-500"}`}
            >
              {summary.issues}
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-muted-foreground">Show:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded text-sm ${
              filter === "all"
                ? "bg-skai-green text-black"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All Components
          </button>
          <button
            onClick={() => setFilter("issues")}
            className={`px-3 py-1.5 rounded text-sm ${
              filter === "issues"
                ? "bg-skai-green text-black"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Issues Only ({summary.issues})
          </button>
        </div>

        {/* Component List */}
        <div className="space-y-4">
          {filteredChecks.map((check) => (
            <ComponentCard
              key={check.component}
              check={check}
              isExpanded={expandedComponents.includes(check.component)}
              onToggle={() => toggleComponent(check.component)}
            />
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-8 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Legend</span>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Pass (WCAG AA)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Warning (3:1 - 4.5:1)</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Fail (&lt;3:1)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Theme Validator",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Dark/Light Mode Validator

Ensure theme compatibility:
- **Contrast Checks** - WCAG AA compliance (4.5:1 for text)
- **Color Visibility** - Backgrounds, borders, shadows
- **Interactive States** - Hover, focus, disabled
- **Component Coverage** - All variants and states

Catch theme issues before they reach production.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Validator: Story = {
  name: "🌓 Theme Validator",
  render: () => <DarkLightValidator />,
};
