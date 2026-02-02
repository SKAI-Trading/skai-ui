import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/core/button";
import { Card } from "../components/core/card";
import { Badge } from "../components/core/badge";
import { Input } from "../components/core/input";
import { Checkbox } from "../components/forms/checkbox";
import { Label } from "../components/core/label";

/**
 * # Design System Dashboard
 *
 * A comprehensive overview of all components in the SKAI design system.
 * Quick access to every component with live previews and documentation links.
 */

// Component Preview Card
const ComponentCard = ({
  name,
  category,
  variants,
  children,
  docLink,
}: {
  name: string;
  category: string;
  variants: number;
  children: React.ReactNode;
  docLink?: string;
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="p-4 border-b bg-slate-50 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-xs text-slate-500">{category}</p>
        </div>
        <Badge variant="secondary">{variants} variants</Badge>
      </div>
    </div>
    <div className="p-6 flex items-center justify-center min-h-[120px] bg-white dark:bg-slate-900">
      {children}
    </div>
    {docLink && (
      <div className="p-2 border-t bg-slate-50 dark:bg-slate-800">
        <a
          href={docLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-xs text-primary hover:underline block text-center"
        >
          View Documentation →
        </a>
      </div>
    )}
  </Card>
);

// Stats Card
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  </Card>
);

const meta: Meta = {
  title: "Design System/Dashboard",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Design System Dashboard

A bird's eye view of all components in the SKAI design system.
Use this page to quickly find and preview any component.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  name: "📊 Overview",
  render: () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">SKAI Design System</h1>
          <p className="text-lg opacity-90">
            A comprehensive component library for building the SKAI trading
            platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Components" value={25} icon="🧱" />
          <StatCard label="Variants" value={87} icon="🎨" />
          <StatCard label="Stories" value={52} icon="📖" />
          <StatCard label="Design Tokens" value={120} icon="🎯" />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              name: "Theme Config",
              icon: "🎨",
              desc: "Customize design tokens",
            },
            { name: "Mock Data", icon: "📊", desc: "Realistic test data" },
            { name: "Figma Guide", icon: "🔗", desc: "Design handoff" },
            { name: "Responsive", icon: "📱", desc: "Preview breakpoints" },
          ].map((link) => (
            <Card
              key={link.name}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-2xl mb-2">{link.icon}</div>
              <h3 className="font-bold">{link.name}</h3>
              <p className="text-sm text-slate-500">{link.desc}</p>
            </Card>
          ))}
        </div>

        {/* Component Categories */}
        <h2 className="text-2xl font-bold mb-6">Components by Category</h2>

        {/* Primitives */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
              🧱
            </span>
            Primitives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComponentCard name="Button" category="Primitives" variants={5}>
              <div className="flex gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="outline">
                  Outline
                </Button>
              </div>
            </ComponentCard>

            <ComponentCard name="Badge" category="Primitives" variants={4}>
              <div className="flex gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Alert</Badge>
              </div>
            </ComponentCard>

            <ComponentCard name="Card" category="Primitives" variants={1}>
              <Card className="p-3 text-sm">Card Container</Card>
            </ComponentCard>

            <ComponentCard name="Input" category="Primitives" variants={3}>
              <Input placeholder="Enter text..." className="w-32" />
            </ComponentCard>
          </div>
        </div>

        {/* Form Elements */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">
              📝
            </span>
            Form Elements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComponentCard name="Checkbox" category="Forms" variants={2}>
              <div className="flex items-center gap-2">
                <Checkbox id="demo" />
                <Label htmlFor="demo">Accept terms</Label>
              </div>
            </ComponentCard>

            <ComponentCard name="Label" category="Forms" variants={1}>
              <Label>Form Label</Label>
            </ComponentCard>

            <ComponentCard name="Select" category="Forms" variants={2}>
              <div className="px-3 py-2 border rounded-lg text-sm">
                Select option ▼
              </div>
            </ComponentCard>

            <ComponentCard name="Textarea" category="Forms" variants={1}>
              <div className="px-3 py-2 border rounded-lg text-sm text-slate-400 w-32 h-16">
                Type here...
              </div>
            </ComponentCard>
          </div>
        </div>

        {/* Trading */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">
              📈
            </span>
            Trading Components
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComponentCard name="TokenIcon" category="Trading" variants={10}>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  E
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  B
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
              </div>
            </ComponentCard>

            <ComponentCard name="PriceDisplay" category="Trading" variants={3}>
              <div className="text-center">
                <div className="text-xl font-bold font-mono">$3,456.78</div>
                <div className="text-green-500 text-sm">+2.34%</div>
              </div>
            </ComponentCard>

            <ComponentCard name="AmountInput" category="Trading" variants={2}>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                <div className="text-xs text-slate-500">Amount</div>
                <div className="font-mono text-lg">1.5 ETH</div>
              </div>
            </ComponentCard>

            <ComponentCard name="OrderBook" category="Trading" variants={2}>
              <div className="text-xs space-y-1 font-mono">
                <div className="text-red-500">3,458.00 | 2.5</div>
                <div className="text-red-500">3,457.50 | 1.2</div>
                <div className="text-green-500">3,456.00 | 3.1</div>
                <div className="text-green-500">3,455.50 | 0.8</div>
              </div>
            </ComponentCard>
          </div>
        </div>

        {/* Layout */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
              📐
            </span>
            Layout Components
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComponentCard name="Tabs" category="Layout" variants={3}>
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <div className="px-3 py-1 rounded bg-white dark:bg-slate-700 text-sm font-medium">
                  Tab 1
                </div>
                <div className="px-3 py-1 text-sm text-slate-500">Tab 2</div>
                <div className="px-3 py-1 text-sm text-slate-500">Tab 3</div>
              </div>
            </ComponentCard>

            <ComponentCard name="Dialog" category="Layout" variants={2}>
              <Card className="p-3 shadow-lg">
                <div className="text-sm font-bold">Modal Title</div>
                <div className="text-xs text-slate-500">Content here</div>
              </Card>
            </ComponentCard>

            <ComponentCard name="Sheet" category="Layout" variants={4}>
              <div className="flex">
                <div className="w-16 h-20 bg-slate-200 dark:bg-slate-700 rounded-l-lg" />
                <div className="w-12 h-20 bg-slate-300 dark:bg-slate-600 rounded-r-lg -ml-2 shadow-lg" />
              </div>
            </ComponentCard>

            <ComponentCard name="Accordion" category="Layout" variants={1}>
              <div className="space-y-1 text-sm">
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded">
                  Section 1 ▼
                </div>
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded">
                  Section 2 ▶
                </div>
              </div>
            </ComponentCard>
          </div>
        </div>

        {/* Feedback */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">
              💬
            </span>
            Feedback Components
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComponentCard name="Toast" category="Feedback" variants={4}>
              <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                ✓ Success!
              </div>
            </ComponentCard>

            <ComponentCard name="Tooltip" category="Feedback" variants={4}>
              <div className="relative">
                <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center">
                  ?
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">
                  Tooltip
                </div>
              </div>
            </ComponentCard>

            <ComponentCard name="Skeleton" category="Feedback" variants={3}>
              <div className="space-y-2">
                <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </ComponentCard>

            <ComponentCard name="Progress" category="Feedback" variants={2}>
              <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary rounded-full" />
              </div>
            </ComponentCard>
          </div>
        </div>

        {/* Version Info */}
        <div className="border-t pt-8 mt-12 text-center text-sm text-slate-500">
          <p>SKAI Design System v0.1.0</p>
          <p className="mt-1">Built with React, Radix UI, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  ),
};
