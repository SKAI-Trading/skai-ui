import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ArrowLeftRight, Check, X, Eye, EyeOff } from "lucide-react";
import { Card } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/**
 * # Visual Diff Tool
 *
 * Compare component states, theme variations, or before/after changes.
 * Perfect for design reviews and QA.
 */

type ComparisonMode = "side-by-side" | "overlay" | "slider";

interface ComparisonItem {
  id: string;
  name: string;
  render: () => React.ReactNode;
}

// Example comparisons
const buttonComparisons: ComparisonItem[] = [
  {
    id: "default",
    name: "Default Theme",
    render: () => (
      <div className="p-8 bg-background rounded-lg">
        <Button>Primary Button</Button>
      </div>
    ),
  },
  {
    id: "alt",
    name: "Alternative Theme",
    render: () => (
      <div className="p-8 bg-slate-100 rounded-lg">
        <Button className="bg-blue-500 hover:bg-blue-600">
          Primary Button
        </Button>
      </div>
    ),
  },
];

const cardComparisons: ComparisonItem[] = [
  {
    id: "v1",
    name: "Version 1.0",
    render: () => (
      <div className="p-8 bg-background rounded-lg">
        <Card className="p-6 w-64">
          <h3 className="font-semibold">Card Title</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Old card design with basic styling
          </p>
        </Card>
      </div>
    ),
  },
  {
    id: "v2",
    name: "Version 2.0",
    render: () => (
      <div className="p-8 bg-background rounded-lg">
        <Card className="p-6 w-64 border-skai-green/30 shadow-lg shadow-skai-green/10">
          <h3 className="font-semibold text-skai-green">Card Title</h3>
          <p className="text-sm text-muted-foreground mt-2">
            New card design with brand accent
          </p>
        </Card>
      </div>
    ),
  },
];

// Comparison component
const VisualComparison = ({
  left,
  right,
  mode,
}: {
  left: ComparisonItem;
  right: ComparisonItem;
  mode: ComparisonMode;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(50);

  if (mode === "side-by-side") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2 font-medium">
            {left.name}
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            {left.render()}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-2 font-medium">
            {right.name}
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            {right.render()}
          </div>
        </div>
      </div>
    );
  }

  if (mode === "overlay") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            className="flex-1 accent-skai-green"
          />
          <span className="text-sm font-mono w-12">{overlayOpacity}%</span>
        </div>
        <div className="relative border border-border rounded-lg overflow-hidden">
          <div>{left.render()}</div>
          <div
            className="absolute inset-0"
            style={{ opacity: overlayOpacity / 100 }}
          >
            {right.render()}
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{left.name}</span>
          <span>{right.name}</span>
        </div>
      </div>
    );
  }

  // Slider mode
  return (
    <div className="space-y-4">
      <div
        className="relative border border-border rounded-lg overflow-hidden cursor-ew-resize"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = (x / rect.width) * 100;
          setSliderPosition(Math.max(0, Math.min(100, percent)));
        }}
      >
        <div className="relative">
          {right.render()}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            {left.render()}
          </div>
          <div
            className="absolute inset-y-0 w-1 bg-skai-green cursor-ew-resize"
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-skai-green rounded-full flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{left.name}</span>
        <span>{right.name}</span>
      </div>
    </div>
  );
};

const VisualDiffTool = () => {
  const [mode, setMode] = useState<ComparisonMode>("side-by-side");
  const [comparison, setComparison] = useState<"button" | "card">("button");

  const comparisons =
    comparison === "button" ? buttonComparisons : cardComparisons;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Visual Diff Tool</h1>
          <p className="text-muted-foreground">
            Compare component variations, themes, or versions visually.
          </p>
        </div>

        {/* Controls */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground mr-2">
                Component:
              </span>
              <select
                value={comparison}
                onChange={(e) =>
                  setComparison(e.target.value as "button" | "card")
                }
                className="px-3 py-2 bg-muted rounded-lg border border-border"
              >
                <option value="button">Button</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              {(["side-by-side", "overlay", "slider"] as ComparisonMode[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      mode === m
                        ? "bg-skai-green text-black"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {m === "side-by-side" && "Side by Side"}
                    {m === "overlay" && "Overlay"}
                    {m === "slider" && "Slider"}
                  </button>
                ),
              )}
            </div>
          </div>
        </Card>

        {/* Comparison View */}
        <Card className="p-6">
          <VisualComparison
            left={comparisons[0]}
            right={comparisons[1]}
            mode={mode}
          />
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Button variant="outline" className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            Approve Changes
          </Button>
          <Button variant="outline" className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Request Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

// Theme comparison
const ThemeComparisonTool = () => {
  const [showLight, setShowLight] = useState(true);
  const [showDark, setShowDark] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Theme Comparison</h1>
        <p className="text-muted-foreground mb-8">
          Preview components in different themes simultaneously.
        </p>

        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLight}
              onChange={(e) => setShowLight(e.target.checked)}
              className="accent-skai-green"
            />
            {showLight ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            Light Theme
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDark}
              onChange={(e) => setShowDark(e.target.checked)}
              className="accent-skai-green"
            />
            {showDark ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            Dark Theme
          </label>
        </div>

        <div
          className={`grid gap-6 ${showLight && showDark ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {showLight && (
            <Card className="overflow-hidden">
              <div className="bg-white text-slate-900 p-6">
                <Badge className="mb-4 bg-slate-100 text-slate-900">
                  Light Theme
                </Badge>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      Primary
                    </Button>
                    <Button className="bg-slate-200 hover:bg-slate-300 text-slate-900">
                      Secondary
                    </Button>
                    <Button className="border border-slate-300 bg-transparent text-slate-900">
                      Outline
                    </Button>
                  </div>
                  <Card className="p-4 bg-slate-50 border-slate-200">
                    <h3 className="font-semibold">Card Title</h3>
                    <p className="text-sm text-slate-600">
                      Card content in light theme
                    </p>
                  </Card>
                  <input
                    type="text"
                    placeholder="Input field"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </Card>
          )}

          {showDark && (
            <Card className="overflow-hidden">
              <div className="bg-background text-foreground p-6">
                <Badge variant="outline" className="mb-4">
                  Dark Theme
                </Badge>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <Card className="p-4">
                    <h3 className="font-semibold">Card Title</h3>
                    <p className="text-sm text-muted-foreground">
                      Card content in dark theme
                    </p>
                  </Card>
                  <input
                    type="text"
                    placeholder="Input field"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Design System/Visual Diff",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Visual Diff Tool

Compare designs visually with multiple modes:
- **Side by Side** - Traditional comparison view
- **Overlay** - Stack with adjustable opacity
- **Slider** - Drag to reveal differences

Perfect for:
- Design reviews
- Theme comparisons
- Version updates
- QA testing
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const DiffTool: Story = {
  name: "🔍 Visual Diff",
  render: () => <VisualDiffTool />,
};

export const ThemeComparison: Story = {
  name: "🎨 Theme Comparison",
  render: () => <ThemeComparisonTool />,
};
