import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";

const meta: Meta = {
  title: "Design Tokens/Spacing & Layout",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const SpacingScale: StoryObj = {
  name: "Spacing Scale",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Spacing</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Consistent spacing using an 8px base grid system.
        </p>

        <div className="space-y-2">
          {[
            { name: "0", value: "0px", class: "w-0" },
            { name: "px", value: "1px", class: "w-px" },
            { name: "0.5", value: "2px", class: "w-0.5" },
            { name: "1", value: "4px", class: "w-1" },
            { name: "1.5", value: "6px", class: "w-1.5" },
            { name: "2", value: "8px", class: "w-2" },
            { name: "2.5", value: "10px", class: "w-2.5" },
            { name: "3", value: "12px", class: "w-3" },
            { name: "4", value: "16px", class: "w-4" },
            { name: "5", value: "20px", class: "w-5" },
            { name: "6", value: "24px", class: "w-6" },
            { name: "8", value: "32px", class: "w-8" },
            { name: "10", value: "40px", class: "w-10" },
            { name: "12", value: "48px", class: "w-12" },
            { name: "16", value: "64px", class: "w-16" },
            { name: "20", value: "80px", class: "w-20" },
            { name: "24", value: "96px", class: "w-24" },
          ].map((space) => (
            <div key={space.name} className="flex items-center gap-4">
              <code className="w-12 text-sm text-muted-foreground text-right">
                {space.name}
              </code>
              <code className="w-16 text-sm text-muted-foreground">
                {space.value}
              </code>
              <div className={`h-4 bg-primary rounded ${space.class}`} />
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Usage</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            {`// Tailwind classes
<div className="p-4">        {/* 16px padding */}
<div className="mt-8">       {/* 32px margin-top */}
<div className="gap-2">      {/* 8px gap */}
<div className="space-y-6">  {/* 24px vertical spacing */}

// When to use what
- 2 (8px):  Tight spacing - icon gaps, inline elements
- 4 (16px): Standard spacing - card padding, form gaps
- 6 (24px): Section spacing - between related groups
- 8 (32px): Large spacing - between sections
- 12+ (48px+): Page-level spacing - hero sections`}
          </pre>
        </div>
      </div>
    </div>
  ),
};

export const GridSystem: StoryObj = {
  name: "Grid System",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Grid System</h1>
        <p className="text-lg text-muted-foreground mb-8">
          12-column grid with responsive breakpoints.
        </p>

        {/* 12 Column Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">12 Column Grid</h2>
          <div className="grid grid-cols-12 gap-2 mb-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-primary/20 rounded flex items-center justify-center text-xs font-mono"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Column Spans */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-12 (Full)
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-6
              </div>
              <div className="col-span-6 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-6
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-4
              </div>
              <div className="col-span-4 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-4
              </div>
              <div className="col-span-4 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-4
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-3 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-3
              </div>
              <div className="col-span-3 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-3
              </div>
              <div className="col-span-3 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-3
              </div>
              <div className="col-span-3 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-3
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-8 h-10 bg-primary rounded flex items-center justify-center text-sm">
                col-span-8 (Main)
              </div>
              <div className="col-span-4 h-10 bg-primary/60 rounded flex items-center justify-center text-sm">
                col-span-4 (Sidebar)
              </div>
            </div>
          </div>
        </section>

        {/* Common Layouts */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Common Layouts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trading Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1 text-xs">
                  <div className="col-span-12 h-6 bg-muted rounded flex items-center justify-center">
                    Header
                  </div>
                  <div className="col-span-3 h-24 bg-muted rounded flex items-center justify-center">
                    Sidebar
                  </div>
                  <div className="col-span-6 h-24 bg-primary/30 rounded flex items-center justify-center">
                    Chart
                  </div>
                  <div className="col-span-3 h-24 bg-muted rounded flex items-center justify-center">
                    Order Book
                  </div>
                  <div className="col-span-8 h-12 bg-muted rounded flex items-center justify-center">
                    Trade Form
                  </div>
                  <div className="col-span-4 h-12 bg-muted rounded flex items-center justify-center">
                    Positions
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Landing Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1 text-xs">
                  <div className="col-span-12 h-6 bg-muted rounded flex items-center justify-center">
                    Nav
                  </div>
                  <div className="col-span-12 h-20 bg-primary/30 rounded flex items-center justify-center">
                    Hero
                  </div>
                  <div className="col-span-4 h-12 bg-muted rounded flex items-center justify-center">
                    Feature
                  </div>
                  <div className="col-span-4 h-12 bg-muted rounded flex items-center justify-center">
                    Feature
                  </div>
                  <div className="col-span-4 h-12 bg-muted rounded flex items-center justify-center">
                    Feature
                  </div>
                  <div className="col-span-12 h-8 bg-muted rounded flex items-center justify-center">
                    CTA
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Portfolio View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1 text-xs">
                  <div className="col-span-12 h-6 bg-muted rounded flex items-center justify-center">
                    Header
                  </div>
                  <div className="col-span-12 h-12 bg-primary/30 rounded flex items-center justify-center">
                    Balance Summary
                  </div>
                  <div className="col-span-8 h-20 bg-muted rounded flex items-center justify-center">
                    Holdings Table
                  </div>
                  <div className="col-span-4 h-20 bg-muted rounded flex items-center justify-center">
                    Allocation Chart
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Mobile (Single Column)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1 text-xs max-w-[150px] mx-auto">
                  <div className="col-span-12 h-6 bg-muted rounded flex items-center justify-center">
                    Header
                  </div>
                  <div className="col-span-12 h-16 bg-primary/30 rounded flex items-center justify-center">
                    Content
                  </div>
                  <div className="col-span-12 h-12 bg-muted rounded flex items-center justify-center">
                    Card
                  </div>
                  <div className="col-span-12 h-12 bg-muted rounded flex items-center justify-center">
                    Card
                  </div>
                  <div className="col-span-12 h-8 bg-muted rounded flex items-center justify-center">
                    Bottom Nav
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  ),
};

export const Breakpoints: StoryObj = {
  name: "Breakpoints",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Responsive Breakpoints</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Mobile-first breakpoints for responsive design.
        </p>

        <div className="space-y-4">
          {[
            {
              name: "sm",
              width: "640px",
              device: "Large phones",
              example: "sm:grid-cols-2",
            },
            {
              name: "md",
              width: "768px",
              device: "Tablets",
              example: "md:grid-cols-3",
            },
            {
              name: "lg",
              width: "1024px",
              device: "Laptops",
              example: "lg:grid-cols-4",
            },
            {
              name: "xl",
              width: "1280px",
              device: "Desktops",
              example: "xl:grid-cols-5",
            },
            {
              name: "2xl",
              width: "1536px",
              device: "Large screens",
              example: "2xl:grid-cols-6",
            },
          ].map((bp) => (
            <div
              key={bp.name}
              className="flex items-center gap-4 p-4 bg-card rounded-lg border"
            >
              <code className="w-12 text-lg font-bold text-primary">
                {bp.name}
              </code>
              <div className="flex-1">
                <p className="font-medium">{bp.device}</p>
                <p className="text-sm text-muted-foreground">
                  Min-width: {bp.width}
                </p>
              </div>
              <div
                className="h-8 bg-primary/20 rounded"
                style={{ width: `${parseInt(bp.width) / 10}px` }}
              />
              <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {bp.example}
              </code>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Responsive Example</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            {`// Mobile-first responsive grid
<div className="
  grid 
  grid-cols-1      // Mobile: 1 column
  sm:grid-cols-2   // ≥640px: 2 columns
  md:grid-cols-3   // ≥768px: 3 columns
  lg:grid-cols-4   // ≥1024px: 4 columns
  gap-4
">
  {tokens.map(token => <TokenCard key={token.id} />)}
</div>

// Hide/show based on screen size
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>

// Container max-widths
<div className="max-w-sm">   {/* 384px */}
<div className="max-w-md">   {/* 448px */}
<div className="max-w-lg">   {/* 512px */}
<div className="max-w-xl">   {/* 576px */}
<div className="max-w-2xl">  {/* 672px */}
<div className="max-w-4xl">  {/* 896px */}
<div className="max-w-6xl">  {/* 1152px */}
<div className="max-w-7xl">  {/* 1280px */}`}
          </pre>
        </div>

        {/* Live Demo */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Live Demo (Resize your window)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 bg-primary/20 rounded-lg text-center font-medium"
              >
                Card {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            <span className="sm:hidden">1 column (mobile)</span>
            <span className="hidden sm:inline md:hidden">
              2 columns (sm: ≥640px)
            </span>
            <span className="hidden md:inline lg:hidden">
              3 columns (md: ≥768px)
            </span>
            <span className="hidden lg:inline">4 columns (lg: ≥1024px)</span>
          </p>
        </div>
      </div>
    </div>
  ),
};

export const ContainerSizes: StoryObj = {
  name: "Container Sizes",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Container Sizes</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Standard container widths for different content types.
        </p>

        <div className="space-y-8">
          {[
            {
              name: "max-w-sm",
              width: "384px",
              use: "Modals, small forms, wallet cards",
            },
            {
              name: "max-w-md",
              width: "448px",
              use: "Login forms, token selectors",
            },
            {
              name: "max-w-lg",
              width: "512px",
              use: "Swap widget, trade forms",
            },
            {
              name: "max-w-xl",
              width: "576px",
              use: "Settings panels, larger modals",
            },
            {
              name: "max-w-2xl",
              width: "672px",
              use: "Article content, documentation",
            },
            {
              name: "max-w-4xl",
              width: "896px",
              use: "Dashboard cards, tables",
            },
            {
              name: "max-w-6xl",
              width: "1152px",
              use: "Main content area, page layouts",
            },
            {
              name: "max-w-7xl",
              width: "1280px",
              use: "Full-width layouts, landing pages",
            },
          ].map((container) => (
            <div key={container.name}>
              <div className="flex items-center gap-4 mb-2">
                <code className="font-mono text-primary">{container.name}</code>
                <span className="text-sm text-muted-foreground">
                  {container.width}
                </span>
                <span className="text-sm">— {container.use}</span>
              </div>
              <div
                className={`${container.name} h-12 bg-primary/20 rounded-lg border-2 border-dashed border-primary/40 flex items-center justify-center`}
              >
                <span className="text-sm font-mono">{container.width}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
