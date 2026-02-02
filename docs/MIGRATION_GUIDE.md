# Migration Guide: skai-interface to skai-ui

This guide documents how to migrate components from `skai-interface` to use `skai-ui` as the single source of truth.

## Current Status

### Phase 1: Foundation ✅ COMPLETE
- Typography system (54 responsive variants)
- Design tokens (CSS, JSON, TypeScript)
- Core components (Button, Card, Input, Badge, Label, Textarea)
- Build pipeline with multi-format output

### Phase 2: Component Organization ✅ COMPLETE
Components have been reorganized into semantic categories:

```
src/components/
├── core/           # Button, Card, Input, Badge, Label, Textarea, Typography
├── forms/          # Checkbox, Select, Slider, Switch, Form, etc.
├── layout/         # Separator, ScrollArea, Accordion, Sidebar, etc.
├── navigation/     # Tabs, Breadcrumb, Pagination, DockBar, etc.
├── feedback/       # Alert, Progress, Skeleton, Toast, etc.
├── overlays/       # Dialog, Sheet, Dropdown, Popover, etc.
├── data-display/   # Table, Avatar, Calendar, Chart, etc.
├── trading/        # TokenIcon, PriceDisplay, OrderBook, etc.
├── utility/        # ThemeProvider, CopyButton, OnlineIndicator, etc.
└── branding/       # SkaiLogo, SkaiIcon
```

## Components Already in skai-ui

The following components from `skai-interface/src/components/ui/` are already available in `skai-ui`:

| skai-interface Component | skai-ui Location | Status |
|-------------------------|------------------|--------|
| FeeDisplay.tsx | components/trading/fee-display.tsx | ✅ Ready |
| OnlineIndicator.tsx | components/utility/online-indicator.tsx | ✅ Ready |
| ParticleBackground.tsx | components/utility/particle-background.tsx | ✅ Ready |
| chart.tsx | components/data-display/chart.tsx | ✅ Ready |
| dock-icon.tsx | components/navigation/dock-icon.tsx | ✅ Ready |
| resizable.tsx | components/layout/resizable.tsx | ✅ Ready |
| sonner.tsx | components/feedback/sonner.tsx | ✅ Ready |
| toast.tsx | components/feedback/toast.tsx | ✅ Ready |
| toaster.tsx | components/feedback/toaster.tsx | ✅ Ready |
| accordion.tsx | components/layout/accordion.tsx | ✅ Ready |
| alert-dialog.tsx | components/feedback/alert-dialog.tsx | ✅ Ready |
| alert.tsx | components/feedback/alert.tsx | ✅ Ready |
| avatar.tsx | components/data-display/avatar.tsx | ✅ Ready |
| badge.tsx | components/core/badge.tsx | ✅ Ready |
| breadcrumb.tsx | components/navigation/breadcrumb.tsx | ✅ Ready |
| button.tsx | components/core/button.tsx | ✅ Ready |
| calendar.tsx | components/data-display/calendar.tsx | ✅ Ready |
| card.tsx | components/core/card.tsx | ✅ Ready |
| checkbox.tsx | components/forms/checkbox.tsx | ✅ Ready |
| collapsible.tsx | components/layout/collapsible.tsx | ✅ Ready |
| context-menu.tsx | components/overlays/context-menu.tsx | ✅ Ready |
| dialog.tsx | components/overlays/dialog.tsx | ✅ Ready |
| dropdown-menu.tsx | components/overlays/dropdown-menu.tsx | ✅ Ready |
| form.tsx | components/forms/form.tsx | ✅ Ready |
| hover-card.tsx | components/overlays/hover-card.tsx | ✅ Ready |
| input-otp.tsx | components/forms/input-otp.tsx | ✅ Ready |
| input.tsx | components/core/input.tsx | ✅ Ready |
| label.tsx | components/core/label.tsx | ✅ Ready |
| pagination.tsx | components/navigation/pagination.tsx | ✅ Ready |
| popover.tsx | components/overlays/popover.tsx | ✅ Ready |
| progress.tsx | components/feedback/progress.tsx | ✅ Ready |
| radio-group.tsx | components/forms/radio-group.tsx | ✅ Ready |
| scroll-area.tsx | components/layout/scroll-area.tsx | ✅ Ready |
| select.tsx | components/forms/select.tsx | ✅ Ready |

## Migration Steps for skai-interface

### Step 1: Update Package.json

Ensure skai-ui is properly linked:

```json
{
  "dependencies": {
    "@skai/ui": "file:./modules/skai-ui"
  }
}
```

### Step 2: Import Styles

In your main app entry point:

```tsx
// Import skai-ui styles
import "@skai/ui/styles";
```

### Step 3: Update Component Imports

Replace local imports with skai-ui imports:

```tsx
// BEFORE (from local ui folder)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// AFTER (from skai-ui)
import {
  Button,
  Card, CardContent, CardHeader,
  Dialog, DialogContent
} from "@skai/ui";
```

### Step 4: Use Tailwind Preset

In your `tailwind.config.ts`:

```typescript
import { skaiPreset } from "@skai/ui";

export default {
  presets: [skaiPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./modules/skai-ui/src/**/*.{ts,tsx}",
  ],
  // ... your custom config
} satisfies Config;
```

### Step 5: Delete Local UI Components

After verifying the app works with skai-ui imports, delete:
- `src/components/ui/` folder (all components now from skai-ui)

## Trading-Specific Components

skai-ui includes specialized trading components:

```tsx
import {
  // Price & Balance Display
  PriceDisplay,
  PriceChange,
  BalanceDisplay,
  PnLDisplay,

  // Trading UI
  TokenIcon,
  TokenSelect,
  SwapInput,
  AmountInput,
  FeeDisplay,
  GasEstimate,

  // Trading Advanced
  OrderBook,
  DepthChart,
  CandlestickChart,

  // Status & Risk
  StatusIndicator,
  RiskGauge,
  TransactionStatus,
  NetworkBadge,
  TierBadge,

  // Settings
  TradeSettings,
  LeverageSlider,
} from "@skai/ui";
```

## Layout Components

Use the pre-built layouts:

```tsx
import {
  // App Shell
  AppShell,
  AppHeader,
  AppFooter,

  // Navigation
  MobileNav,
  DockBar,
  NavGroup,

  // Layouts
  TradingLayout,
  DashboardLayout,
  CenteredLayout,
} from "@skai/ui";
```

## Typography Components

Use the new typography system:

```tsx
import {
  Typography,
  H1, H2, H3, H4,
  P, Small,
  Price, Code,
  Blockquote,
  List, ListItem,
} from "@skai/ui";

// Usage
<H1>Page Title</H1>
<P>Body text with responsive sizing</P>
<Price>$1,234.56</Price>
<Typography variant="card-title">Custom Variant</Typography>
```

## Design Tokens

Access design tokens directly:

```tsx
import {
  skaiColors,
  semanticColors,
  skaiButton,
  skaiInput,
  skaiPreset,
} from "@skai/ui";
```

## Hooks

Use UI-specific hooks:

```tsx
import {
  useToast,
  useDebounce,
  useLocalStorage,
  useMediaQuery,
  useCopyToClipboard,
  useCountdown,
  useClickOutside,
  useKeyboardShortcut,
} from "@skai/ui";
```

## Troubleshooting

### Import Errors
If you get "Module not found" errors, ensure:
1. `modules/skai-ui` exists and is up to date
2. Run `npm install` in both repos
3. Check tsconfig paths are configured

### Style Conflicts
If styles look different:
1. Import skai-ui styles FIRST
2. Check for CSS specificity conflicts
3. Use the Tailwind preset for consistent design tokens

### TypeScript Errors
If you get type errors:
1. Ensure `@skai/ui` types are generated (`npm run build` in skai-ui)
2. Check your tsconfig includes the skai-ui module
3. Restart your TypeScript language server

## Next Steps

1. **Audit remaining components** in skai-interface that aren't in skai-ui
2. **Migrate domain-specific UI** (trading, gaming, defi) to skai-ui
3. **Update all imports** in skai-interface to use skai-ui
4. **Remove duplicate components** from skai-interface
5. **Document component variants** in Storybook
