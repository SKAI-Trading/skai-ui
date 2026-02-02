# SKAI UI Migration Guide

This guide helps you migrate from `@/components/ui` (ShadCN) imports to the unified `@skai/ui` design system library.

## Quick Start

### 1. Update Imports

**Before (ShadCN-style):**
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

**After (@skai/ui):**
```tsx
import { Button, Card, CardHeader, CardContent, Input } from "@skai/ui";
```

### 2. Use SKAI-Branded Components (Recommended)

For Figma-accurate styling, use the SKAI-branded variants:

```tsx
import {
  SkaiButton,    // Figma-accurate button with 4 sizes × 4 types
  SkaiCard,      // Green Coal background, 24px radius
  SkaiInput,     // Figma-accurate input with states
} from "@skai/ui";

// Example usage
<SkaiButton skaiType="primary" skaiSize="large">
  Get Started
</SkaiButton>

<SkaiCard>
  <SkaiCardHeader>
    <SkaiCardTitle>Card Title</SkaiCardTitle>
  </SkaiCardHeader>
  <SkaiCardContent>Content here</SkaiCardContent>
</SkaiCard>

<SkaiInput
  label="Amount"
  placeholder="0.00"
  skaiSize="large"
  helperAction={<button>Max</button>}
  secondaryValue="≈ $1,234.56"
/>
```

---

## Import Mappings

### Core Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/button` | `import { Button, SkaiButton } from "@skai/ui"` |
| `@/components/ui/card` | `import { Card, SkaiCard, ... } from "@skai/ui"` |
| `@/components/ui/input` | `import { Input, SkaiInput } from "@skai/ui"` |
| `@/components/ui/badge` | `import { Badge } from "@skai/ui"` |
| `@/components/ui/label` | `import { Label } from "@skai/ui"` |
| `@/components/ui/textarea` | `import { Textarea } from "@skai/ui"` |

### Form Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/checkbox` | `import { Checkbox } from "@skai/ui"` |
| `@/components/ui/radio-group` | `import { RadioGroup, RadioGroupItem } from "@skai/ui"` |
| `@/components/ui/select` | `import { Select, SelectTrigger, ... } from "@skai/ui"` |
| `@/components/ui/slider` | `import { Slider } from "@skai/ui"` |
| `@/components/ui/switch` | `import { Switch } from "@skai/ui"` |
| `@/components/ui/toggle` | `import { Toggle, ToggleGroup } from "@skai/ui"` |

### Layout Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/accordion` | `import { Accordion, ... } from "@skai/ui"` |
| `@/components/ui/scroll-area` | `import { ScrollArea } from "@skai/ui"` |
| `@/components/ui/separator` | `import { Separator } from "@skai/ui"` |
| `@/components/ui/sidebar` | `import { Sidebar, ... } from "@skai/ui"` |
| `@/components/ui/resizable` | `import { ResizablePanelGroup, ... } from "@skai/ui"` |

### Navigation Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/tabs` | `import { Tabs, TabsList, ... } from "@skai/ui"` |
| `@/components/ui/breadcrumb` | `import { Breadcrumb, ... } from "@skai/ui"` |
| `@/components/ui/pagination` | `import { Pagination, ... } from "@skai/ui"` |
| `@/components/ui/command` | `import { Command, ... } from "@skai/ui"` |
| `@/components/ui/navigation-menu` | `import { NavigationMenu, ... } from "@skai/ui"` |

### Overlay Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/dialog` | `import { Dialog, ... } from "@skai/ui"` |
| `@/components/ui/sheet` | `import { Sheet, ... } from "@skai/ui"` |
| `@/components/ui/dropdown-menu` | `import { DropdownMenu, ... } from "@skai/ui"` |
| `@/components/ui/popover` | `import { Popover, ... } from "@skai/ui"` |
| `@/components/ui/tooltip` | `import { Tooltip, ... } from "@skai/ui"` |
| `@/components/ui/context-menu` | `import { ContextMenu, ... } from "@skai/ui"` |
| `@/components/ui/hover-card` | `import { HoverCard, ... } from "@skai/ui"` |

### Feedback Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/alert` | `import { Alert, ... } from "@skai/ui"` |
| `@/components/ui/alert-dialog` | `import { AlertDialog, ... } from "@skai/ui"` |
| `@/components/ui/progress` | `import { Progress } from "@skai/ui"` |
| `@/components/ui/skeleton` | `import { Skeleton } from "@skai/ui"` |
| `@/components/ui/toast` | `import { Toast, useToast } from "@skai/ui"` |

### Data Display Components

| Old Import | New Import |
|------------|------------|
| `@/components/ui/table` | `import { Table, ... } from "@skai/ui"` |
| `@/components/ui/avatar` | `import { Avatar, ... } from "@skai/ui"` |
| `@/components/ui/calendar` | `import { Calendar } from "@skai/ui"` |

### Trading Components (NEW)

These are SKAI-specific components with no ShadCN equivalent:

```tsx
import {
  // Token/Crypto
  TokenIcon,
  PriceDisplay,
  TokenPair,
  SwapInput,

  // Trading UI
  OrderBook,
  OrderBookRow,
  StatCard,

  // Layout
  GlassPanel,

  // Status
  OnlineIndicator,
  StatusBar,
  TickerTape,
  ScrollingTicker,

  // Utility
  CopyButton,
  LoadingButton,
  ParticleBackground,
} from "@skai/ui";
```

### Icons

```tsx
import { SkaiIcon } from "@skai/ui";

// Usage
<SkaiIcon name="home" size="md" />
<SkaiIcon name="swap" size="lg" className="text-[#17F9B4]" />
<SkaiIcon name="eth" size="sm" />
```

Available icons: home, search, menu, close, settings, user, wallet, swap, bridge, stake, gas, chart-line, chart-bar, plus, minus, check, x, arrow-up, arrow-down, arrow-left, arrow-right, external-link, copy, download, upload, refresh, filter, sort, eye, eye-off, lock, unlock, warning, info, help, and many more.

### Branding

```tsx
import { SkaiLogo, SkaiIcon } from "@skai/ui";

// Full logo
<SkaiLogo variant="full" />

// Icon only
<SkaiLogo variant="icon" />
```

---

## Typography Classes

Use the SKAI typography classes for Figma-accurate text:

```tsx
// Headlines (Cormorant Garamond)
<h1 className="skai-headline-2">82px headline</h1>
<h2 className="skai-headline-3">54px/40px/30px responsive</h2>
<h3 className="skai-headline-4">40px/30px/26px responsive</h3>

// Super-headlines (Manrope)
<h2 className="skai-super-1">30px/24px/20px responsive</h2>
<h3 className="skai-super-2">24px/22px/18px responsive</h3>

// Sub-headlines (Manrope)
<h4 className="skai-sub-1">20px/18px/16px responsive</h4>
<h5 className="skai-sub-2">18px/17px/15px responsive</h5>
<h6 className="skai-sub-3">16px fixed</h6>
<span className="skai-sub-4">14px fixed</span>

// Paragraphs (Manrope)
<p className="skai-para-1">16px body text</p>
<p className="skai-para-2">14px secondary text</p>
<p className="skai-para-3">12px small text</p>

// Numbers (Mulish with tabular-nums)
<span className="skai-number-1">20px numbers</span>
<span className="skai-number-2">16px numbers</span>
<span className="skai-number-3">14px numbers</span>
<span className="skai-number-4">12px numbers</span>
<span className="skai-number-5">10px numbers</span>

// Labels (Mulish)
<label className="skai-label-1">14px label</label>
<label className="skai-label-2">12px label</label>
<label className="skai-label-3">10px label</label>
<label className="skai-label-4">8px label</label>
```

---

## Color Classes

Use semantic colors that respond to theme:

```tsx
// Backgrounds
<div className="bg-background" />      // Main background
<div className="bg-card" />            // Card/surface background
<div className="bg-muted" />           // Muted background
<div className="bg-primary" />         // Primary (Sky Blue)
<div className="bg-secondary" />       // Secondary (Alien Green)
<div className="bg-destructive" />     // Error/Destructive (Red)

// Text
<span className="text-foreground" />   // Primary text
<span className="text-muted-foreground" /> // Muted text
<span className="text-primary" />      // Primary color text
<span className="text-secondary" />    // Secondary color text

// Trading colors
<span className="text-long" />         // Profit/Long (Green)
<span className="text-short" />        // Loss/Short (Red)

// SKAI brand colors (explicit)
<span className="text-[#56C7F3]" />    // Sky Blue
<span className="text-[#17F9B4]" />    // Alien Green
<span className="text-[#FF574A]" />    // Error Red
<span className="text-[#95A09F]" />    // Ash (muted)
```

---

## Tailwind Preset

Ensure your `tailwind.config.ts` uses the SKAI preset:

```ts
import { skaiPreset } from "@skai/ui";
import type { Config } from "tailwindcss";

export default {
  presets: [skaiPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./modules/skai-ui/src/**/*.{ts,tsx}",
  ],
  // App-specific extensions here
} satisfies Config;
```

---

## CSS Import

Import the base styles in your app's entry point:

```tsx
// In your main CSS file or App.tsx
import "@skai/ui/styles";

// Or individual files
import "@skai/ui/styles/base.css";
import "@skai/ui/styles/typography.css";
import "@skai/ui/styles/animations.css";
```

---

## Common Migration Patterns

### 1. Button Migration

**Before:**
```tsx
<Button variant="default" size="lg">Click me</Button>
```

**After (for Figma accuracy):**
```tsx
<SkaiButton skaiType="primary" skaiSize="large">Click me</SkaiButton>
```

### 2. Card with Glass Effect

**Before:**
```tsx
<Card className="bg-opacity-50 backdrop-blur">
  <CardContent>...</CardContent>
</Card>
```

**After:**
```tsx
<GlassPanel>
  <CardContent>...</CardContent>
</GlassPanel>

// Or use the glass-panel utility class
<div className="glass-panel p-6">...</div>
```

### 3. Trading Price Display

**Before:**
```tsx
<span className={change > 0 ? "text-green-500" : "text-red-500"}>
  ${price.toFixed(2)} ({change}%)
</span>
```

**After:**
```tsx
<PriceDisplay
  value={price}
  change={change}
  currency="USD"
  size="md"
/>
```

### 4. Token Selection Input

**Before:**
```tsx
<div className="flex items-center gap-2">
  <img src={token.icon} className="w-6 h-6" />
  <Input value={amount} onChange={...} />
</div>
```

**After:**
```tsx
<SwapInput
  label="From"
  token={token}
  value={amount}
  onChange={...}
  balance={balance}
  usdValue={usdValue}
/>
```

---

## Design Token Usage

### Import Tokens Directly

```tsx
import {
  // Colors
  skaiColors,
  coreColors,
  greenCoalColors,
  semanticColors,

  // Typography
  skaiFonts,
  skaiFontSizes,

  // Spacing & Layout
  skaiSpacing,
  skaiBorderRadius,
  skaiShadows,

  // Component specs
  skaiButton,
  skaiInput,
} from "@skai/ui";

// Use in JS/TS
const buttonStyle = {
  backgroundColor: skaiColors["sky-blue"],
  borderRadius: skaiBorderRadius.xl,
};
```

---

## Troubleshooting

### React Hooks Error

If you see "Invalid hook call" or duplicate React errors:

```bash
# Remove duplicate React from skai-ui
rm -rf modules/skai-ui/node_modules/react
rm -rf modules/skai-ui/node_modules/react-dom
```

This is handled automatically by the `postinstall` script.

### Import Not Found

Ensure your `tsconfig.json` has the path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@skai/ui": ["./modules/skai-ui/src"],
      "@skai/ui/*": ["./modules/skai-ui/src/*"]
    }
  }
}
```

### Styles Not Applied

1. Check that styles are imported in your entry point
2. Ensure Tailwind content paths include skai-ui:
   ```ts
   content: ["./modules/skai-ui/src/**/*.{ts,tsx}"]
   ```

---

## Need Help?

- **Storybook**: Run `npm run storybook` in skai-ui to see all components
- **Figma**: Reference files TyX8YAtNDEIvsnSLQ3IXId and 3sSzw1KewMtUbeLAv7uW0r
- **Validation**: See `FIGMA_VALIDATION.md` for token verification
