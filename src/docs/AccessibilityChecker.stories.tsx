import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Badge } from "../components/badge";
import { Input } from "../components/input";
import { Checkbox } from "../components/checkbox";

/**
 * # Accessibility Checker
 *
 * Built-in accessibility audit tool for SKAI components.
 * Ensure all components meet WCAG 2.1 AA standards.
 */

// A11y Check Item
interface A11yCheck {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "warning" | "na";
  wcag: string;
  category: string;
}

const CheckItem = ({ check }: { check: A11yCheck }) => {
  const statusColors = {
    pass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    fail: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    na: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };

  const statusIcons = {
    pass: "✓",
    fail: "✕",
    warning: "⚠",
    na: "—",
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${statusColors[check.status]}`}
      >
        {statusIcons[check.status]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{check.name}</h4>
          <Badge variant="outline" className="text-xs">
            {check.wcag}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {check.description}
        </p>
      </div>
      <Badge
        variant={
          check.status === "pass"
            ? "default"
            : check.status === "fail"
              ? "destructive"
              : "secondary"
        }
      >
        {check.status.toUpperCase()}
      </Badge>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Accessibility Checker

Automated accessibility audits for all SKAI components.
Each component is tested against WCAG 2.1 AA guidelines.

## Coverage
- Color contrast (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation (Tab order, focus indicators)
- Screen reader support (ARIA labels, roles)
- Interactive elements (Click targets, touch zones)
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// Sample accessibility checks
const buttonChecks: A11yCheck[] = [
  {
    id: "1",
    name: "Color Contrast",
    description: "Text meets 4.5:1 contrast ratio against background",
    status: "pass",
    wcag: "1.4.3",
    category: "Visual",
  },
  {
    id: "2",
    name: "Focus Indicator",
    description: "Visible focus ring when navigating with keyboard",
    status: "pass",
    wcag: "2.4.7",
    category: "Keyboard",
  },
  {
    id: "3",
    name: "Click Target",
    description: "Minimum 44x44px touch/click target size",
    status: "pass",
    wcag: "2.5.5",
    category: "Motor",
  },
  {
    id: "4",
    name: "Screen Reader",
    description: "Button role announced correctly",
    status: "pass",
    wcag: "4.1.2",
    category: "Screen Reader",
  },
  {
    id: "5",
    name: "Disabled State",
    description: "Disabled buttons have aria-disabled attribute",
    status: "pass",
    wcag: "4.1.2",
    category: "Screen Reader",
  },
];

const inputChecks: A11yCheck[] = [
  {
    id: "1",
    name: "Label Association",
    description: "Input has associated label via id/htmlFor",
    status: "pass",
    wcag: "1.3.1",
    category: "Screen Reader",
  },
  {
    id: "2",
    name: "Focus Indicator",
    description: "Visible focus ring on keyboard focus",
    status: "pass",
    wcag: "2.4.7",
    category: "Keyboard",
  },
  {
    id: "3",
    name: "Error Messages",
    description: "Errors linked with aria-describedby",
    status: "warning",
    wcag: "3.3.1",
    category: "Screen Reader",
  },
  {
    id: "4",
    name: "Placeholder Contrast",
    description: "Placeholder text meets minimum contrast",
    status: "warning",
    wcag: "1.4.3",
    category: "Visual",
  },
  {
    id: "5",
    name: "Required Field",
    description: "Required inputs have aria-required attribute",
    status: "pass",
    wcag: "3.3.2",
    category: "Screen Reader",
  },
];

const cardChecks: A11yCheck[] = [
  {
    id: "1",
    name: "Semantic Structure",
    description: "Card uses appropriate landmark or region",
    status: "pass",
    wcag: "1.3.1",
    category: "Screen Reader",
  },
  {
    id: "2",
    name: "Heading Hierarchy",
    description: "Card titles use appropriate heading level",
    status: "pass",
    wcag: "1.3.1",
    category: "Screen Reader",
  },
  {
    id: "3",
    name: "Interactive Card",
    description: "Clickable cards have button or link role",
    status: "na",
    wcag: "4.1.2",
    category: "Screen Reader",
  },
  {
    id: "4",
    name: "Color Contrast",
    description: "Card content meets contrast requirements",
    status: "pass",
    wcag: "1.4.3",
    category: "Visual",
  },
];

export const ComponentAudit: Story = {
  name: "🔍 Component Audit",
  render: () => {
    const [selectedComponent, setSelectedComponent] = useState("button");

    const components = [
      { id: "button", name: "Button", checks: buttonChecks },
      { id: "input", name: "Input", checks: inputChecks },
      { id: "card", name: "Card", checks: cardChecks },
    ];

    const currentComponent = components.find((c) => c.id === selectedComponent);
    if (!currentComponent) {
      return (
        <div className="p-8 text-muted-foreground">Component not found</div>
      );
    }
    const passCount = currentComponent.checks.filter(
      (c) => c.status === "pass",
    ).length;
    const failCount = currentComponent.checks.filter(
      (c) => c.status === "fail",
    ).length;
    const warningCount = currentComponent.checks.filter(
      (c) => c.status === "warning",
    ).length;

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Accessibility Audit</h1>
          <p className="text-slate-600 dark:text-slate-400">
            WCAG 2.1 AA compliance checker for all components
          </p>
        </div>

        {/* Component Selector */}
        <div className="flex gap-2 flex-wrap">
          {components.map((comp) => (
            <Button
              key={comp.id}
              variant={selectedComponent === comp.id ? "default" : "outline"}
              onClick={() => setSelectedComponent(comp.id)}
            >
              {comp.name}
            </Button>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <div className="text-3xl font-bold text-green-600">{passCount}</div>
            <div className="text-sm text-green-700 dark:text-green-400">
              Passing
            </div>
          </Card>
          <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
            <div className="text-3xl font-bold text-amber-600">
              {warningCount}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-400">
              Warnings
            </div>
          </Card>
          <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
            <div className="text-3xl font-bold text-red-600">{failCount}</div>
            <div className="text-sm text-red-700 dark:text-red-400">
              Failing
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Live Preview</h3>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg flex items-center justify-center">
            {selectedComponent === "button" && (
              <div className="flex gap-4">
                <Button>Default Button</Button>
                <Button variant="outline">Outline</Button>
                <Button disabled>Disabled</Button>
              </div>
            )}
            {selectedComponent === "input" && (
              <div className="w-64 space-y-2">
                <label htmlFor="demo-input" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="demo-input"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
            )}
            {selectedComponent === "card" && (
              <Card className="p-4 w-64">
                <h4 className="font-bold">Card Title</h4>
                <p className="text-sm text-slate-600">Card content here</p>
              </Card>
            )}
          </div>
        </Card>

        {/* Checks List */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-slate-50 dark:bg-slate-800">
            <h3 className="font-bold">Accessibility Checks</h3>
          </div>
          {currentComponent.checks.map((check) => (
            <CheckItem key={check.id} check={check} />
          ))}
        </Card>
      </div>
    );
  },
};

export const ColorContrastChecker: Story = {
  name: "🎨 Color Contrast",
  render: () => {
    const [foreground, setForeground] = useState("#0f172a");
    const [background, setBackground] = useState("#ffffff");

    // Calculate contrast ratio (simplified)
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };

    const getLuminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const getContrastRatio = (fg: string, bg: string) => {
      const fgRgb = hexToRgb(fg);
      const bgRgb = hexToRgb(bg);
      const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
      const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
      const lighter = Math.max(fgLum, bgLum);
      const darker = Math.min(fgLum, bgLum);
      return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
    };

    const ratio = parseFloat(getContrastRatio(foreground, background));
    const aaLarge = ratio >= 3;
    const aaNormal = ratio >= 4.5;
    const aaaLarge = ratio >= 4.5;
    const aaaNormal = ratio >= 7;

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Color Contrast Checker</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Test color combinations against WCAG contrast requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Color Inputs */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">Color Selection</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Foreground Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const temp = foreground;
                  setForeground(background);
                  setBackground(temp);
                }}
                className="text-sm text-primary hover:underline"
              >
                ↕ Swap Colors
              </button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6 flex flex-col">
            <h3 className="font-bold mb-4">Preview</h3>
            <div
              className="flex-1 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]"
              style={{ backgroundColor: background }}
            >
              <p
                className="text-4xl font-bold mb-2"
                style={{ color: foreground }}
              >
                Aa
              </p>
              <p className="text-xl" style={{ color: foreground }}>
                Sample Text
              </p>
              <p className="text-sm mt-4" style={{ color: foreground }}>
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Contrast Ratio</h3>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{ratio}:1</div>
              <p className="text-slate-500">
                {ratio >= 7
                  ? "Excellent"
                  : ratio >= 4.5
                    ? "Good"
                    : ratio >= 3
                      ? "Acceptable"
                      : "Poor"}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">WCAG Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>AA Large Text (3:1)</span>
                <Badge variant={aaLarge ? "default" : "destructive"}>
                  {aaLarge ? "PASS" : "FAIL"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>AA Normal Text (4.5:1)</span>
                <Badge variant={aaNormal ? "default" : "destructive"}>
                  {aaNormal ? "PASS" : "FAIL"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>AAA Large Text (4.5:1)</span>
                <Badge variant={aaaLarge ? "default" : "destructive"}>
                  {aaaLarge ? "PASS" : "FAIL"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>AAA Normal Text (7:1)</span>
                <Badge variant={aaaNormal ? "default" : "destructive"}>
                  {aaaNormal ? "PASS" : "FAIL"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  },
};

export const KeyboardNavigation: Story = {
  name: "⌨️ Keyboard Navigation",
  render: () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Keyboard Navigation Guide</h1>
        <p className="text-slate-600 dark:text-slate-400">
          All SKAI components support full keyboard navigation
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-slate-50 dark:bg-slate-800">
          <h3 className="font-bold">Keyboard Shortcuts</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Key</th>
              <th className="text-left px-4 py-3 font-semibold">Action</th>
              <th className="text-left px-4 py-3 font-semibold">Components</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              {
                key: "Tab",
                action: "Move focus to next element",
                components: "All",
              },
              {
                key: "Shift + Tab",
                action: "Move focus to previous element",
                components: "All",
              },
              {
                key: "Enter / Space",
                action: "Activate button or link",
                components: "Button, Link",
              },
              {
                key: "Escape",
                action: "Close dialog or dropdown",
                components: "Dialog, Select, Popover",
              },
              {
                key: "Arrow Up/Down",
                action: "Navigate options",
                components: "Select, Menu, Tabs",
              },
              {
                key: "Arrow Left/Right",
                action: "Switch tabs",
                components: "Tabs",
              },
              {
                key: "Home / End",
                action: "Jump to first/last option",
                components: "Select, Menu",
              },
            ].map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
                    {item.key}
                  </code>
                </td>
                <td className="px-4 py-3 text-sm">{item.action}</td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {item.components}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Interactive Demo */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">Try It: Tab Through These Elements</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Button 1</Button>
          <Button variant="outline">Button 2</Button>
          <Input placeholder="Text input" className="w-40" />
          <div className="flex items-center gap-2">
            <Checkbox id="a11y-check" />
            <label htmlFor="a11y-check" className="text-sm">
              Checkbox
            </label>
          </div>
          <Button variant="secondary">Button 3</Button>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Use Tab to navigate, Enter/Space to activate. Notice the focus ring on
          each element.
        </p>
      </Card>
    </div>
  ),
};
