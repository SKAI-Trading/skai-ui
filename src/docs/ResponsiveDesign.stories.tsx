/**
 * Responsive Design Documentation
 *
 * Mobile-first responsive patterns, breakpoints, touch targets,
 * and adaptive layouts for SKAI interfaces.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import {
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  X,
  ChevronRight,
  Home,
  TrendingUp,
  Gamepad2,
  Wallet,
  User,
  Settings,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: "Documentation/Responsive Design",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# 📱 Responsive Design

Mobile-first design patterns and responsive breakpoints for SKAI.

## Breakpoints

| Name | Width | Description |
|------|-------|-------------|
| \`sm\` | 640px | Large phones |
| \`md\` | 768px | Tablets |
| \`lg\` | 1024px | Small laptops |
| \`xl\` | 1280px | Desktop |
| \`2xl\` | 1536px | Large screens |

## Mobile-First Approach

All styles start from mobile and scale up using \`min-width\` breakpoints.
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// BREAKPOINT VISUALIZATION
// ============================================================================

// Breakpoint reference - currently using inline data in stories
// const breakpoints = [
//   { name: "Mobile", width: "< 640px", icon: Smartphone, color: "cyan" },
//   { name: "Tablet", width: "768px", icon: Tablet, color: "teal" },
//   { name: "Desktop", width: "1024px+", icon: Monitor, color: "green" },
// ];

export const BreakpointSystem: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Breakpoint System</h2>
        <p className="text-muted-foreground mb-6">
          SKAI uses Tailwind's default breakpoints with mobile-first approach.
        </p>
      </div>

      {/* Visual Breakpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Device Breakpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-20 bg-black/20 rounded-lg overflow-hidden">
            {/* Breakpoint markers */}
            <div className="absolute inset-0 flex">
              <div className="w-1/4 border-r border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="h-6 w-6 mx-auto text-cyan-400" />
                  <span className="text-xs text-muted-foreground">Mobile</span>
                  <span className="text-xs block text-cyan-400">
                    &lt; 640px
                  </span>
                </div>
              </div>
              <div className="w-1/4 border-r border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="h-6 w-6 mx-auto text-cyan-400" />
                  <span className="text-xs text-muted-foreground">sm</span>
                  <span className="text-xs block text-cyan-400">640px</span>
                </div>
              </div>
              <div className="w-1/4 border-r border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <Tablet className="h-6 w-6 mx-auto text-teal-400" />
                  <span className="text-xs text-muted-foreground">md</span>
                  <span className="text-xs block text-teal-400">768px</span>
                </div>
              </div>
              <div className="w-1/4 flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="h-6 w-6 mx-auto text-green-400" />
                  <span className="text-xs text-muted-foreground">lg+</span>
                  <span className="text-xs block text-green-400">1024px+</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakpoint Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tailwind Breakpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 pr-4">Prefix</th>
                  <th className="text-left py-3 pr-4">Min Width</th>
                  <th className="text-left py-3 pr-4">CSS</th>
                  <th className="text-left py-3">Common Use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    prefix: "sm:",
                    width: "640px",
                    css: "@media (min-width: 640px)",
                    use: "Large phones, landscape",
                  },
                  {
                    prefix: "md:",
                    width: "768px",
                    css: "@media (min-width: 768px)",
                    use: "Tablets",
                  },
                  {
                    prefix: "lg:",
                    width: "1024px",
                    css: "@media (min-width: 1024px)",
                    use: "Small laptops",
                  },
                  {
                    prefix: "xl:",
                    width: "1280px",
                    css: "@media (min-width: 1280px)",
                    use: "Desktops",
                  },
                  {
                    prefix: "2xl:",
                    width: "1536px",
                    css: "@media (min-width: 1536px)",
                    use: "Large screens",
                  },
                ].map((bp) => (
                  <tr key={bp.prefix} className="border-b border-white/5">
                    <td className="py-3 pr-4">
                      <code className="text-cyan-400">{bp.prefix}</code>
                    </td>
                    <td className="py-3 pr-4 font-mono">{bp.width}</td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">
                      {bp.css}
                    </td>
                    <td className="py-3 text-muted-foreground">{bp.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// TOUCH TARGETS
// ============================================================================

export const TouchTargets: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Touch Targets</h2>
        <p className="text-muted-foreground mb-6">
          Minimum touch target sizes for mobile accessibility (44x44px minimum).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Size Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Touch Target Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Too Small */}
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <Plus className="h-4 w-4 text-red-400" />
              </button>
              <div>
                <Badge className="bg-red-500/20 text-red-400">
                  ❌ 32px - Too Small
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Hard to tap accurately on mobile
                </p>
              </div>
            </div>

            {/* Minimum */}
            <div className="flex items-center gap-4">
              <button className="w-11 h-11 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <Plus className="h-5 w-5 text-amber-400" />
              </button>
              <div>
                <Badge className="bg-amber-500/20 text-amber-400">
                  ⚠️ 44px - Minimum
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  WCAG 2.1 minimum requirement
                </p>
              </div>
            </div>

            {/* Recommended */}
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <Plus className="h-6 w-6 text-green-400" />
              </button>
              <div>
                <Badge className="bg-green-500/20 text-green-400">
                  ✅ 48px - Recommended
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Comfortable tap target for all users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader>
            <CardTitle>Touch Target Spacing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bad Spacing */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                ❌ Insufficient spacing (4px)
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="w-11 h-11 rounded-lg bg-red-500/20 border border-red-500/30"
                  />
                ))}
              </div>
            </div>

            {/* Good Spacing */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                ✅ Proper spacing (8px+)
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="w-11 h-11 rounded-lg bg-green-500/20 border border-green-500/30"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Mobile touch target sizing */
.touch-target {
  /* Minimum 44px for accessibility */
  min-height: 44px;
  min-width: 44px;
  
  /* Recommended 48px for comfort */
  @apply h-12 w-12; /* 48px */
  
  /* Add padding for larger tap area */
  @apply p-3;
}

/* Increase spacing on mobile */
.button-group {
  @apply gap-1 md:gap-2;
}

/* Example: Icon button with proper touch target */
<button className="h-12 w-12 rounded-xl flex items-center justify-center">
  <Plus className="h-6 w-6" />
</button>

/* Padding-based touch target expansion */
<button className="p-4 -m-4"> {/* Visual 16px, touch 48px */}
  <span>Click me</span>
</button>
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

export const MobileNavigation: StoryObj = {
  render: () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
      { icon: Home, label: "Home", active: true },
      { icon: TrendingUp, label: "Trade", active: false },
      { icon: Gamepad2, label: "Play", active: false },
      { icon: Wallet, label: "Wallet", active: false },
      { icon: User, label: "Profile", active: false },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Mobile Navigation</h2>
          <p className="text-muted-foreground mb-6">
            Navigation patterns optimized for mobile devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bottom Tab Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Bottom Tab Bar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/40 rounded-2xl p-1">
                <div className="flex justify-around">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      className={`flex flex-col items-center py-3 px-4 rounded-xl transition-colors ${
                        item.active
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-xs mt-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Fixed to bottom of screen on mobile
              </p>
            </CardContent>
          </Card>

          {/* Hamburger Menu */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hamburger Menu</CardTitle>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  {menuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {menuOpen && (
                <div className="space-y-1 p-2 bg-black/40 rounded-xl">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        item.active
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
              {!menuOpen && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Click the menu icon to open
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile Header */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Header Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/40 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <button className="p-2 -ml-2 rounded-lg hover:bg-white/10">
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="font-bold text-lg">Page Title</h1>
                <button className="p-2 -mr-2 rounded-lg hover:bg-white/10">
                  <Settings className="h-6 w-6" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Fixed header with back button and action
            </p>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// ============================================================================
// RESPONSIVE LAYOUTS
// ============================================================================

export const ResponsiveLayouts: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Responsive Layouts</h2>
        <p className="text-muted-foreground mb-6">
          Common layout patterns that adapt to different screen sizes.
        </p>
      </div>

      {/* Grid Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center"
              >
                <span className="text-lg font-bold">{i}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-black/30">
            <code className="text-xs text-cyan-400">
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Stack to Row */}
      <Card>
        <CardHeader>
          <CardTitle>Stack → Row</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-20 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              First
            </div>
            <div className="flex-1 h-20 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              Second
            </div>
            <div className="flex-1 h-20 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              Third
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-black/30">
            <code className="text-xs text-cyan-400">
              flex flex-col md:flex-row
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="h-32 lg:h-full rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                <span className="text-muted-foreground">Sidebar</span>
              </div>
            </aside>
            <main className="flex-1">
              <div className="h-48 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <span>Main Content</span>
              </div>
            </main>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-black/30">
            <code className="text-xs text-cyan-400">
              flex flex-col lg:flex-row | w-full lg:w-64
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// RESPONSIVE TEXT
// ============================================================================

export const ResponsiveText: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Responsive Typography</h2>
        <p className="text-muted-foreground mb-6">
          Text sizing that scales appropriately across devices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heading Scales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Page Heading
            </h1>
            <code className="text-xs text-muted-foreground">
              text-2xl md:text-3xl lg:text-4xl
            </code>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Section Heading</h2>
            <code className="text-xs text-muted-foreground">
              text-xl md:text-2xl
            </code>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Subsection Heading
            </h3>
            <code className="text-xs text-muted-foreground">
              text-lg md:text-xl
            </code>
          </div>
          <div>
            <p className="text-sm md:text-base">
              Body text that's slightly smaller on mobile to fit more content.
            </p>
            <code className="text-xs text-muted-foreground">
              text-sm md:text-base
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Number Display */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold font-mono">
                $12,345.67
              </p>
              <code className="text-xs text-muted-foreground">
                text-xl sm:text-2xl md:text-3xl
              </code>
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-xs text-muted-foreground mb-1">Change</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold font-mono text-green-400">
                +23.45%
              </p>
              <code className="text-xs text-muted-foreground">
                text-lg sm:text-xl md:text-2xl
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

export const ResponsiveUtilities: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Responsive Utilities</h2>
        <p className="text-muted-foreground mb-6">
          Utility classes for showing/hiding content at different breakpoints.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Show/Hide Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 pr-4">Class</th>
                  <th className="text-left py-3 pr-4">Mobile</th>
                  <th className="text-left py-3 pr-4">Tablet</th>
                  <th className="text-left py-3">Desktop</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    class: "hidden md:block",
                    mobile: "❌",
                    tablet: "✅",
                    desktop: "✅",
                  },
                  {
                    class: "md:hidden",
                    mobile: "✅",
                    tablet: "❌",
                    desktop: "❌",
                  },
                  {
                    class: "hidden lg:block",
                    mobile: "❌",
                    tablet: "❌",
                    desktop: "✅",
                  },
                  {
                    class: "lg:hidden",
                    mobile: "✅",
                    tablet: "✅",
                    desktop: "❌",
                  },
                  {
                    class: "hidden sm:block md:hidden",
                    mobile: "❌",
                    tablet: "✅",
                    desktop: "❌",
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 pr-4">
                      <code className="text-cyan-400 text-xs">{row.class}</code>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        aria-label={
                          row.mobile === "✅"
                            ? "Visible on mobile"
                            : "Hidden on mobile"
                        }
                      >
                        {row.mobile}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        aria-label={
                          row.tablet === "✅"
                            ? "Visible on tablet"
                            : "Hidden on tablet"
                        }
                      >
                        {row.tablet}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        aria-label={
                          row.desktop === "✅"
                            ? "Visible on desktop"
                            : "Hidden on desktop"
                        }
                      >
                        {row.desktop}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Example */}
      <Card>
        <CardHeader>
          <CardTitle>Live Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 md:hidden">
              <p className="text-sm">📱 This is only visible on mobile</p>
              <code className="text-xs text-muted-foreground">md:hidden</code>
            </div>
            <div className="hidden md:block p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
              <p className="text-sm">
                💻 This is only visible on tablet and up
              </p>
              <code className="text-xs text-muted-foreground">
                hidden md:block
              </code>
            </div>
            <div className="hidden lg:block p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm">🖥️ This is only visible on desktop</p>
              <code className="text-xs text-muted-foreground">
                hidden lg:block
              </code>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Resize your browser to see elements show/hide
          </p>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Mobile-first",
                desc: "Start with mobile styles, add breakpoints for larger screens",
                good: true,
              },
              {
                title: "Avoid desktop-only",
                desc: "Don't hide important content on mobile",
                good: true,
              },
              {
                title: "Test all breakpoints",
                desc: "Check layouts at 320px, 768px, 1024px, 1440px",
                good: true,
              },
              {
                title: "Use container queries",
                desc: "For component-level responsiveness (Tailwind v3.2+)",
                good: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-black/20"
              >
                <span className="text-green-400">✓</span>
                <div>
                  <span className="font-semibold">{item.title}</span>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
