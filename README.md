# @skai/ui

> A comprehensive, production-ready UI component library for SKAI Trading applications built with React, TypeScript, Radix UI, and Tailwind CSS.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-8.x-ff4785.svg)](https://storybook.js.org/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Accessible-purple.svg)](https://www.radix-ui.com/)

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Available Components](#-available-components)
- [Usage Examples](#-usage-examples)
- [Storybook](#-storybook)
- [Adding New Components](#-adding-new-components-from-figma)
- [Design Tokens](#-design-tokens)
- [Development Workflow](#-development-workflow)

## 🚀 Quick Start

```tsx
import { Button, Card, CardContent, Input } from '@skai/ui';
import '@skai/ui/styles'; // Import Tailwind styles

function SwapCard() {
  return (
    <Card className="w-[400px]">
      <CardContent className="space-y-4 pt-6">
        <Input type="number" placeholder="0.00" />
        <Button className="w-full">Swap</Button>
      </CardContent>
    </Card>
  );
}
```

## 📦 Installation

The library is linked locally in the monorepo:

```json
// In main app's package.json
"dependencies": {
  "@skai/ui": "file:modules/skai-ui"
}
```

### Import Styles

Add the styles import to your app's entry point:

```tsx
// In your App.tsx or main.tsx
import '@skai/ui/styles';
```

## 🧩 Available Components

### Layout & Containers

| Component | Description | Usage |
|-----------|-------------|-------|
| `Card` | Container with header, content, footer | Grouping related content |
| `Separator` | Visual divider | Separating sections |
| `ScrollArea` | Custom scrollable container | Long lists, overflow content |

### Forms & Inputs

| Component | Description | Usage |
|-----------|-------------|-------|
| `Button` | Interactive button with variants | Actions, submissions |
| `Input` | Text/number input field | Data entry |
| `Textarea` | Multi-line text input | Long-form content |
| `Label` | Form field label | Input labeling |
| `Checkbox` | Binary selection | Toggleable options |
| `RadioGroup` | Single selection from options | Mutually exclusive choices |
| `Select` | Dropdown selection | Choosing from list |
| `Slider` | Range input | Numeric ranges |
| `Switch` | Toggle switch | On/off settings |
| `Toggle` | Toggleable button | Binary state buttons |

### Feedback & Status

| Component | Description | Usage |
|-----------|-------------|-------|
| `Alert` | Important messages | Warnings, errors, info |
| `AlertDialog` | Confirmation dialogs | Critical actions |
| `Badge` | Status indicators | Tags, labels, counts |
| `Progress` | Progress indication | Loading, completion |
| `Skeleton` | Loading placeholder | Content loading states |
| `Tooltip` | Hover information | Help text, explanations |

### Overlays & Modals

| Component | Description | Usage |
|-----------|-------------|-------|
| `Dialog` | Modal window | Forms, confirmations |
| `Sheet` | Slide-out panel | Side panels, drawers |
| `DropdownMenu` | Action menu | Context actions |
| `ContextMenu` | Right-click menu | Context-specific actions |
| `Popover` | Floating content | Popovers, dropdowns |
| `HoverCard` | Hover-triggered card | Preview content |

### Navigation & Display

| Component | Description | Usage |
|-----------|-------------|-------|
| `Tabs` | Tabbed interface | Content organization |
| `Table` | Data table | Tabular data |
| `Avatar` | User/token images | Profile pictures |

## 📖 Storybook

Launch Storybook to explore all components interactively:

```bash
cd modules/skai-ui
npm run dev
```

Open http://localhost:6006 to view the component library.

### Available Stories (12+ component categories)

- **Button** - All variants, sizes, states, trading-specific examples
- **Card** - Token cards, portfolio cards, form cards
- **Input** - Text, numbers, with icons, trading inputs
- **Badge** - Price changes, status, tiers, networks
- **Dialog** - Confirmation, forms, settings, success states
- **Tabs** - Trade tabs, portfolio tabs, settings
- **Select** - Token select, network select, slippage
- **DropdownMenu** - Wallet menu, token actions, settings
- **Table** - Token prices, transactions, portfolio, leaderboard
- **Tooltip** - Info tooltips, warnings, icon buttons
- **Alert** - Success, warning, error, network status
- **Progress** - Swap progress, volume tiers, quests

## 🎨 Adding New Components from Figma

### Step 1: Export from Figma

1. Select the component in Figma
2. Use Figma's "Dev Mode" or inspect panel
3. Note the design tokens (colors, spacing, typography)

### Step 2: Create Component File

```bash
touch src/components/new-component.tsx
```

### Step 3: Implement the Component

```tsx
// src/components/new-component.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const newComponentVariants = cva(
  "inline-flex items-center justify-center rounded-md", // Base styles
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newComponentVariants> {}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(newComponentVariants({ variant, size, className }))}
      {...props}
    />
  )
);
NewComponent.displayName = "NewComponent";

export { NewComponent, newComponentVariants };
```

### Step 4: Export from Index

```tsx
// src/index.ts - Add export
export * from "./components/new-component";
```

### Step 5: Create Stories

```tsx
// src/components/new-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { NewComponent } from "./new-component";

const meta: Meta<typeof NewComponent> = {
  title: "Components/NewComponent",
  component: NewComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NewComponent>;

export const Default: Story = {
  args: { children: "New Component" },
};
```

### Step 6: Build and Test

```bash
npm run build      # Build the library
npm run dev        # View in Storybook
npm run typecheck  # Verify types
```

## 🎨 Design Tokens

### Colors (CSS Variables)

```typescript
colors: {
  'skai-primary': '#6366f1',    // Indigo - Primary brand color
  'skai-secondary': '#8b5cf6',  // Purple - Secondary actions
  'skai-accent': '#06b6d4',     // Cyan - Highlights
  'skai-success': '#22c55e',    // Green - Success states
  'skai-warning': '#f59e0b',    // Amber - Warnings
  'skai-error': '#ef4444',      // Red - Errors
}
```

### Animations

Custom animations available:

- `animate-pulse-glow` - Subtle glow pulse effect
- `animate-fade-in` - Fade in entrance
- `animate-slide-in` - Slide in from bottom

## 🛠️ Development Workflow

### Creating a New Component

1. Create a folder in `src/components/YourComponent/`
2. Add these files:
   - `YourComponent.tsx` - Main component
   - `index.ts` - Exports
   - `YourComponent.stories.tsx` - Storybook stories

3. Export from `src/index.ts`

### Example Component Structure

```
src/components/YourComponent/
├── YourComponent.tsx       # Component implementation
├── YourComponent.stories.tsx # Storybook stories
└── index.ts               # Exports
```

### Running Tests

```bash
npm run test        # Run tests once
npm run test:watch  # Watch mode
```

### Building

```bash
npm run build       # Build for production
```

Output will be in `dist/` with:

- `index.js` - CommonJS bundle
- `index.mjs` - ES Module bundle
- `index.d.ts` - TypeScript declarations
- `styles.css` - Compiled CSS

## 📚 Using in Applications

### Installation

```bash
npm install @skai/ui
```

### Setup

1. Import styles in your app's main CSS:

```css
@import "@skai/ui/dist/styles.css";
```

2. Import and use components:

```tsx
import { Button, Card, Input, Badge } from "@skai/ui";

function App() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your name" />
        <Button variant="gradient">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## 🤝 Contributing

### For Design Team Members

1. **Branch naming**: `design/your-feature-name`
2. **Commit messages**: `feat(component): description` or `fix(component): description`
3. **Always test in Storybook** before committing
4. **Update stories** when modifying components

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test in Storybook
4. Submit a PR with screenshots if visual changes

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details.

## 🔗 Related

- [SKAI Trading App](https://github.com/SKAI-Trading/skai-trading)
- [Figma Design System](link-to-figma) _(coming soon)_
