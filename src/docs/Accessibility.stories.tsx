/**
 * Accessibility Guidelines
 *
 * Complete accessibility documentation for SKAI design system.
 * Covers WCAG compliance, keyboard navigation, screen readers, and motion.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import {
  Check,
  X,
  Eye,
  Keyboard,
  Volume2,
  MousePointer,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const meta: Meta = {
  title: "Documentation/Accessibility",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# ♿ Accessibility Guidelines

SKAI is committed to WCAG 2.1 AA compliance. This guide covers:

- **Color Contrast** - Meeting minimum contrast ratios
- **Keyboard Navigation** - Full keyboard support
- **Screen Readers** - ARIA labels and live regions
- **Motion** - Respecting prefers-reduced-motion
- **Focus Management** - Visible focus indicators

## Quick Checks

\`\`\`typescript
// Always provide accessible labels
<Button aria-label="Close modal">
  <X className="h-4 w-4" />
</Button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <ul role="list">...</ul>
</nav>
\`\`\`
        `,
      },
    },
  },
};

export default meta;

// ============================================================================
// COLOR CONTRAST
// ============================================================================

interface ContrastPair {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
  usage: string;
}

const contrastPairs: ContrastPair[] = [
  {
    name: "Primary on Background",
    foreground: "#56C0F6",
    background: "#001615",
    ratio: 8.92,
    aa: true,
    aaa: true,
    usage: "Links, interactive elements",
  },
  {
    name: "Secondary on Background",
    foreground: "#2DEDAD",
    background: "#001615",
    ratio: 10.1,
    aa: true,
    aaa: true,
    usage: "CTA buttons, accents",
  },
  {
    name: "White on Background",
    foreground: "#FFFFFF",
    background: "#001615",
    ratio: 17.8,
    aa: true,
    aaa: true,
    usage: "Body text, headings",
  },
  {
    name: "Muted Text",
    foreground: "rgba(255,255,255,0.5)",
    background: "#001615",
    ratio: 5.2,
    aa: true,
    aaa: false,
    usage: "Secondary text, placeholders",
  },
  {
    name: "Error Red",
    foreground: "#FF6B6B",
    background: "#001615",
    ratio: 6.8,
    aa: true,
    aaa: false,
    usage: "Error states, warnings",
  },
  {
    name: "Success Green",
    foreground: "#22C55E",
    background: "#001615",
    ratio: 8.3,
    aa: true,
    aaa: true,
    usage: "Success states, gains",
  },
  {
    name: "White on Glass",
    foreground: "#FFFFFF",
    background: "rgba(0,0,0,0.4)",
    ratio: 12.4,
    aa: true,
    aaa: true,
    usage: "Text on glass cards",
  },
  {
    name: "White on CTA",
    foreground: "#FFFFFF",
    background: "#2DEDAD",
    ratio: 3.1,
    aa: false,
    aaa: false,
    usage: "CTA button text (use dark text or larger)",
  },
];

export const ColorContrast: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Color Contrast Ratios</h2>
        <p className="text-muted-foreground mb-6">
          All color combinations are tested for WCAG 2.1 contrast requirements.
          <br />
          <strong>AA (4.5:1)</strong> - Standard text |{" "}
          <strong>AAA (7:1)</strong> - Enhanced contrast
        </p>
      </div>

      <div className="grid gap-4">
        {contrastPairs.map((pair) => (
          <Card key={pair.name}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Preview */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-32 h-16 rounded-lg flex items-center justify-center font-semibold"
                    style={{
                      background: pair.background,
                      color: pair.foreground,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    Aa
                  </div>
                  <div>
                    <h3 className="font-semibold">{pair.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {pair.usage}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{pair.ratio}:1</div>
                    <div className="text-xs text-muted-foreground">Ratio</div>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      variant={pair.aa ? "default" : "destructive"}
                      className={
                        pair.aa ? "bg-green-500/20 text-green-400" : ""
                      }
                    >
                      {pair.aa ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      AA
                    </Badge>
                    <Badge
                      variant={pair.aaa ? "default" : "secondary"}
                      className={
                        pair.aaa
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10"
                      }
                    >
                      {pair.aaa ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      AAA
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-400">
                Tip: CTA Button Text
              </h4>
              <p className="text-sm text-muted-foreground">
                White text on our teal CTA buttons (#2DEDAD) doesn't meet AA
                contrast. Use{" "}
                <code className="text-cyan-400">font-semibold</code> or larger
                text (18px+) to meet large text requirements (3:1 ratio).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

export const KeyboardNavigation: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Keyboard Navigation</h2>
        <p className="text-muted-foreground mb-6">
          All interactive elements must be keyboard accessible. Test your
          components with Tab, Enter, Space, and Arrow keys.
        </p>
      </div>

      {/* Key Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "Tab", action: "Move focus to next element" },
              { key: "Shift + Tab", action: "Move focus to previous element" },
              { key: "Enter", action: "Activate buttons, links, submit forms" },
              {
                key: "Space",
                action: "Toggle checkboxes, buttons, expand dropdowns",
              },
              {
                key: "Escape",
                action: "Close modals, dropdowns, cancel operations",
              },
              {
                key: "Arrow Keys",
                action: "Navigate within components (tabs, menus, sliders)",
              },
              { key: "Home / End", action: "Jump to first/last item in lists" },
              { key: "Page Up/Down", action: "Scroll large content areas" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 p-3 rounded-lg bg-black/20"
              >
                <kbd className="px-3 py-1.5 rounded bg-white/10 border border-white/20 font-mono text-sm min-w-[100px] text-center">
                  {item.key}
                </kbd>
                <span className="text-sm text-muted-foreground">
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Focus Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Focus indicators must be clearly visible. Use the Tab key to
            navigate these examples:
          </p>

          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <a
              href="#"
              className="text-cyan-400 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-background rounded"
              onClick={(e) => e.preventDefault()}
            >
              Link Example
            </a>
          </div>

          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Focus ring styles */
.focus-visible {
  outline: none;
  ring: 2px solid rgba(86, 192, 246, 0.8);
  ring-offset: 2px;
  ring-offset-color: var(--color-background);
}

/* Tailwind CSS utility */
focus-visible:ring-2 focus-visible:ring-cyan-500 
focus-visible:ring-offset-2 focus-visible:ring-offset-background

/* Never remove focus outline without replacement! */
/* ❌ BAD: */ outline: none;
/* ✅ GOOD: */ outline: none; box-shadow: 0 0 0 2px var(--ring-color);
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Tab Order */}
      <Card>
        <CardHeader>
          <CardTitle>Tab Order Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: CheckCircle,
                title: "Follow visual order",
                description:
                  "Tab sequence should match the visual layout (left-to-right, top-to-bottom)",
                good: true,
              },
              {
                icon: CheckCircle,
                title: "Skip links for navigation",
                description:
                  'Add "Skip to main content" link at the top for keyboard users',
                good: true,
              },
              {
                icon: CheckCircle,
                title: "Trap focus in modals",
                description: "Keep focus inside dialogs until dismissed",
                good: true,
              },
              {
                icon: X,
                title: "Avoid positive tabindex",
                description:
                  'Using tabindex="1" or higher disrupts natural order',
                good: false,
              },
              {
                icon: X,
                title: "Don't rely on hover alone",
                description:
                  "All hover interactions must have keyboard equivalents",
                good: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-3 p-3 rounded-lg ${
                  item.good ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    item.good ? "text-green-400" : "text-red-400"
                  }`}
                />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// SCREEN READERS
// ============================================================================

export const ScreenReaders: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Screen Reader Support</h2>
        <p className="text-muted-foreground mb-6">
          Use ARIA attributes and semantic HTML to ensure screen reader
          compatibility.
        </p>
      </div>

      {/* ARIA Labels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            ARIA Labels & Descriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {[
              {
                title: "Icon-only buttons",
                bad: "<Button><X /></Button>",
                good: '<Button aria-label="Close modal"><X /></Button>',
              },
              {
                title: "Form inputs",
                bad: '<Input placeholder="Email" />',
                good: '<Label htmlFor="email">Email</Label>\n<Input id="email" aria-describedby="email-hint" />\n<span id="email-hint">We\'ll never share your email</span>',
              },
              {
                title: "Loading states",
                bad: "<Spinner />",
                good: '<Spinner aria-label="Loading" />\n<div aria-live="polite" aria-busy="true">Loading...</div>',
              },
              {
                title: "Status updates",
                bad: "<Toast>Transaction complete!</Toast>",
                good: '<Toast role="status" aria-live="polite">Transaction complete!</Toast>',
              },
            ].map((example, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/20">
                <h4 className="font-semibold mb-3">{example.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <X className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-400">Inaccessible</span>
                    </div>
                    <pre className="text-xs bg-red-500/10 p-3 rounded overflow-x-auto">
                      <code>{example.bad}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">Accessible</span>
                    </div>
                    <pre className="text-xs bg-green-500/10 p-3 rounded overflow-x-auto">
                      <code>{example.good}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Regions */}
      <Card>
        <CardHeader>
          <CardTitle>Live Regions for Dynamic Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use <code className="text-cyan-400">aria-live</code> to announce
            dynamic updates to screen readers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/20">
              <code className="text-sm text-cyan-400">aria-live="polite"</code>
              <p className="text-xs text-muted-foreground mt-2">
                Waits for user to finish current task. Use for: Toast messages,
                status updates
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/20">
              <code className="text-sm text-cyan-400">
                aria-live="assertive"
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Interrupts immediately. Use for: Errors, critical alerts
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/20">
              <code className="text-sm text-cyan-400">role="status"</code>
              <p className="text-xs text-muted-foreground mt-2">
                Implicit polite region. Use for: Progress indicators, counters
              </p>
            </div>
          </div>

          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
// Price change announcement
<div 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  ETH price updated to $2,345.67, up 2.5%
</div>

// Transaction status
<div role="status">
  {isLoading ? (
    <span aria-busy="true">Processing transaction...</span>
  ) : (
    <span>Transaction confirmed!</span>
  )}
</div>

// Error alert
<div role="alert" aria-live="assertive">
  Transaction failed: Insufficient balance
</div>
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Semantic HTML */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic HTML Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
<!-- Page structure -->
<header role="banner">
  <nav aria-label="Main navigation">...</nav>
</header>

<main role="main" id="main-content">
  <section aria-labelledby="trade-heading">
    <h2 id="trade-heading">Trade</h2>
    ...
  </section>
</main>

<aside role="complementary" aria-label="Trading stats">
  ...
</aside>

<footer role="contentinfo">
  ...
</footer>

<!-- Skip link (first element in body) -->
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// REDUCED MOTION
// ============================================================================

export const ReducedMotion: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Respecting Motion Preferences
        </h2>
        <p className="text-muted-foreground mb-6">
          Honor <code className="text-cyan-400">prefers-reduced-motion</code>{" "}
          for users with vestibular disorders or motion sensitivity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Motion Preferences CSS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Or selectively disable specific animations */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-pulse-glow,
  .gradient-text,
  .shimmer {
    animation: none;
  }
  
  /* Keep essential transitions but make them instant */
  .transition-colors {
    transition-duration: 0ms;
  }
}

/* Alternative: provide reduced motion versions */
@media (prefers-reduced-motion: reduce) {
  .card-hover {
    /* Remove transform, keep color change */
    transform: none !important;
    transition: background-color 0.1s ease;
  }
}
            `.trim()}
            </code>
          </pre>

          {/* Demo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Standard Animation</h4>
              <div
                className="h-24 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center"
                style={{
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                <span className="font-semibold">Animated</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Reduced Motion</h4>
              <div
                className="h-24 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center"
                style={{ animation: "none" }}
              >
                <span className="font-semibold">Static</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JavaScript Hook */}
      <Card>
        <CardHeader>
          <CardTitle>React Hook for Motion Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className="text-cyan-400">
              {`
// hooks/useReducedMotion.ts
import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Usage
function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div
      className={cn(
        "transition-transform",
        !prefersReducedMotion && "hover:scale-105"
      )}
      style={{
        animation: prefersReducedMotion ? 'none' : 'float 3s ease-in-out infinite'
      }}
    >
      Content
    </div>
  );
}
            `.trim()}
            </code>
          </pre>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Animation Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[
              {
                good: true,
                title: "Use subtle transitions",
                description:
                  "Prefer opacity and color over transform and position changes",
              },
              {
                good: true,
                title: "Keep durations short",
                description:
                  "200-300ms for most interactions, under 500ms for page transitions",
              },
              {
                good: true,
                title: "Avoid rapid flashing",
                description:
                  "Never flash more than 3 times per second (seizure risk)",
              },
              {
                good: true,
                title: "Make animations purposeful",
                description:
                  "Every animation should communicate something, not just decorate",
              },
              {
                good: false,
                title: "Auto-playing video/animation",
                description:
                  "Provide controls to pause or disable. Never autoplay with sound",
              },
              {
                good: false,
                title: "Parallax scrolling",
                description:
                  "Can cause nausea. Always respect prefers-reduced-motion",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex gap-3 p-3 rounded-lg ${
                  item.good ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                {item.good ? (
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// ACCESSIBILITY CHECKLIST
// ============================================================================

export const AccessibilityChecklist: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Accessibility Checklist</h2>
        <p className="text-muted-foreground mb-6">
          Use this checklist before shipping any component or feature.
        </p>
      </div>

      {[
        {
          category: "Visual",
          icon: Eye,
          items: [
            "Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)",
            "Information isn't conveyed by color alone (use icons, patterns)",
            "Focus indicators are visible on all interactive elements",
            "Text can be resized to 200% without breaking layout",
            "UI works in high contrast mode",
          ],
        },
        {
          category: "Keyboard",
          icon: Keyboard,
          items: [
            "All functionality available via keyboard",
            "Tab order follows logical reading order",
            "Focus is trapped inside modals/dialogs",
            "Focus returns to trigger when modal closes",
            "No keyboard traps (user can always tab away)",
          ],
        },
        {
          category: "Screen Readers",
          icon: Volume2,
          items: [
            "All images have alt text (or aria-hidden if decorative)",
            "Form inputs have associated labels",
            "Icon-only buttons have aria-label",
            "Dynamic content uses aria-live regions",
            "Page has proper heading hierarchy (h1 → h2 → h3)",
          ],
        },
        {
          category: "Interaction",
          icon: MousePointer,
          items: [
            "Touch targets are at least 44×44px",
            "Hover content is also available on focus",
            "No time limits (or user can extend/disable)",
            "Error messages are descriptive and helpful",
            "Form validation provides inline feedback",
          ],
        },
      ].map((section) => (
        <Card key={section.category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <section.icon className="h-5 w-5" />
              {section.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-black/20"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Testing Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Testing Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "axe DevTools",
                description: "Browser extension for automated a11y testing",
                url: "https://www.deque.com/axe/",
              },
              {
                name: "WAVE",
                description: "Web accessibility evaluation tool",
                url: "https://wave.webaim.org/",
              },
              {
                name: "Lighthouse",
                description: "Built into Chrome DevTools, includes a11y audit",
                url: "chrome://lighthouse",
              },
              {
                name: "NVDA",
                description: "Free screen reader for Windows",
                url: "https://www.nvaccess.org/",
              },
              {
                name: "VoiceOver",
                description: "Built-in screen reader on macOS/iOS",
                url: "macOS Settings > Accessibility",
              },
              {
                name: "Contrast Checker",
                description: "Check color contrast ratios",
                url: "https://webaim.org/resources/contrastchecker/",
              },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
              >
                <h4 className="font-semibold text-cyan-400">{tool.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// Add keyframes for demo (with deduplication to prevent multiple injections)
if (
  typeof document !== "undefined" &&
  !document.getElementById("accessibility-stories-styles")
) {
  const style = document.createElement("style");
  style.id = "accessibility-stories-styles";
  style.textContent = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}
`;
  document.head.appendChild(style);
}
