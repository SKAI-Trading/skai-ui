import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Progress } from "../components/progress";
import { USED_COMPONENTS, HIGH_PRIORITY } from "../../.storybook/addons/usage-indicator";

const meta: Meta = {
  title: "🏠 Getting Started/Welcome",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Welcome to SKAI Design System

The complete component library and design token system for SKAI Trading.

## 🎯 Component Usage Tracking

This design system now tracks which components are actually used in the main application vs. what's available but unused.

## 📊 Current Status

- **${USED_COMPONENTS.size} components** actively used in main app
- **${HIGH_PRIORITY.size} components** marked as high-priority for migration  
- **80+ components** available but currently unused
- **~21% utilization rate** (target: 90%+)

## 🚀 Migration Plan

The design system is underutilized! We have a systematic plan to migrate from legacy components to this design system over 4 weeks.

Look for the usage indicators on each component story:
- **✅ USED**: Component is live in main app
- **🎯 PRIORITY**: High-priority for next migration wave
- **💤 UNUSED**: Available but not currently used
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Welcome: Story = {
  render: () => {
    const totalComponents = USED_COMPONENTS.size + HIGH_PRIORITY.size + 80; // Approximate total
    const utilizationPercent = Math.round((USED_COMPONENTS.size / totalComponents) * 100);

    return (
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl">⚡</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            SKAI Design System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete component library with usage tracking and migration planning for SKAI Trading platform.
          </p>
        </div>

        {/* Usage Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-400">✅ Components Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">{USED_COMPONENTS.size}</div>
              <p className="text-sm text-muted-foreground">
                Currently imported and used in main app
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-yellow-400">🎯 High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{HIGH_PRIORITY.size}</div>
              <p className="text-sm text-muted-foreground">
                Next components for migration
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-500/20 bg-gray-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-400">💤 Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-400 mb-2">80+</div>
              <p className="text-sm text-muted-foreground">
                Built but not yet utilized
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Utilization Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Current Utilization</span>
              <span className="font-bold">{utilizationPercent}%</span>
            </div>
            <Progress value={utilizationPercent} className="h-2" />
            <div className="text-sm text-muted-foreground">
              Target: 90%+ utilization by end of migration period
            </div>
          </CardContent>
        </Card>

        {/* Migration Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>🗓️ 4-Week Migration Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full">Week 1</Badge>
                <h4 className="font-semibold">Core Components</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Card</li>
                  <li>• Input</li>
                  <li>• Avatar</li>
                  <li>• Table</li>
                  <li>• Tabs</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-full">Week 2</Badge>
                <h4 className="font-semibold">Trading Components</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• PriceDisplay</li>
                  <li>• TokenIcon</li>
                  <li>• AmountInput</li>
                  <li>• BalanceDisplay</li>
                  <li>• TransactionStatus</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-full">Week 3</Badge>
                <h4 className="font-semibold">Layout System</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AppShell</li>
                  <li>• AppHeader</li>
                  <li>• DashboardLayout</li>
                  <li>• TradingLayout</li>
                  <li>• MobileNav</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="w-full">Week 4</Badge>
                <h4 className="font-semibold">Advanced</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• OrderBook</li>
                  <li>• DepthChart</li>
                  <li>• CandlestickChart</li>
                  <li>• RiskGauge</li>
                  <li>• Tour</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Indicators Guide */}
        <Card>
          <CardHeader>
            <CardTitle>🏷️ Usage Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Every component story now shows its usage status in the main application:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white">✅ USED</Badge>
                <span className="text-sm">Component is live in main app</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500 text-white">🎯 PRIORITY</Badge>
                <span className="text-sm">High-priority for migration</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gray-500 text-white">💤 UNUSED</Badge>
                <span className="text-sm">Available but not used</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-auto p-4 flex-col">
                <div className="text-lg mb-2">🎨 Explore Components</div>
                <div className="text-sm opacity-80">Browse available components and their usage status</div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <div className="text-lg mb-2">📊 View Usage Panel</div>
                <div className="text-sm opacity-80">Check the "Usage" tab in the bottom panel</div>
              </Button>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Use the sidebar navigation to explore components by category. 
                Look for usage indicators to understand migration priority.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const QuickStart: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Quick Start Guide</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>📦 Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-black/40 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`# Install the design system
npm install @skai/ui

# Import components
import { Button, Card, Input } from '@skai/ui';

# Import styles
import '@skai/ui/dist/styles.css';`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎨 Tailwind Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-black/40 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`// tailwind.config.ts
import { skaiPreset } from '@skai/ui';

export default {
  presets: [skaiPreset],
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config;`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 Migration Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Identify Legacy Components</h4>
            <p className="text-sm text-muted-foreground">
              Look for custom component implementations that duplicate skai-ui functionality.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Replace High-Priority Items</h4>
            <p className="text-sm text-muted-foreground">
              Start with components marked as 🎯 PRIORITY - these are most commonly used.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. Test Thoroughly</h4>
            <p className="text-sm text-muted-foreground">
              Use this Storybook to verify component behavior before implementing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};