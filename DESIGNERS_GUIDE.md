# Designer's Guide to SKAI-UI

> **The complete reference for frontend designers working on the SKAI ecosystem.**

## � Live Storybook

**Access the live component library at: [storybook.skai.trade](https://storybook.skai.trade)**

> 🔐 **Authentication Required**: Connect your wallet to access. Contact team@skai.trade for access.

---

## �🎯 Purpose

This design system is the **single source of truth** for all visual and UI elements across SKAI. As a designer, you should only need to work within this repository to:

- ✅ Modify colors, typography, spacing
- ✅ Update component styles and variants
- ✅ Change text/copy across the app
- ✅ Update assets (logos, icons, images)
- ✅ Create new UI patterns
- ✅ Test responsive designs

---

## 📁 Key Files to Edit

### 🎨 Design Tokens

| File                      | What to Edit                               |
| ------------------------- | ------------------------------------------ |
| `src/design-tokens.json`  | Colors, spacing, typography (Figma sync)   |
| `src/lib/theme-config.ts` | Theme configuration (colors, fonts, sizes) |
| `src/styles/index.css`    | Global CSS, Tailwind customizations        |

### ✍️ Text & Copy

| File                 | What to Edit                        |
| -------------------- | ----------------------------------- |
| `src/lib/content.ts` | All UI text, labels, messages, CTAs |

### 🖼️ Assets

| File                | What to Edit                      |
| ------------------- | --------------------------------- |
| `src/lib/assets.ts` | Image paths, logos, illustrations |

### 🧩 Components

| Location          | What's There                       |
| ----------------- | ---------------------------------- |
| `src/components/` | All UI components                  |
| `src/docs/`       | Storybook stories (visual testing) |

---

## 🚀 Quick Start

```bash
# Navigate to skai-ui
cd modules/skai-ui

# Install dependencies (only needed first time or after pulling)
npm install

# Start Storybook (visual component browser)
npm run dev
# Opens http://localhost:6006
```

---

## 🎨 Changing Colors

### Option 1: Edit Theme Config (Recommended)

```typescript
// src/lib/theme-config.ts
export const theme = {
  colors: {
    brand: {
      primary: "199 90% 65%", // Change HSL values
      secondary: "166 80% 55%",
      tertiary: "270 76% 60%",
    },
    trading: {
      long: "142 71% 45%", // Green for profits
      short: "0 84% 60%", // Red for losses
    },
    // ... more colors
  },
};
```

### Option 2: Edit Design Tokens (Figma Sync)

```json
// src/design-tokens.json
{
  "colors": {
    "brand": {
      "primary": {
        "$value": "#56C0F6",
        "$type": "color"
      }
    }
  }
}
```

---

## ✏️ Changing Text/Copy

All user-facing text lives in `src/lib/content.ts`:

```typescript
// src/lib/content.ts
export const content = {
  global: {
    actions: {
      connect: "Connect Wallet", // Change this text
      swap: "Swap",
      buy: "Buy",
      sell: "Sell",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
    },
  },

  landing: {
    hero: {
      title: "The Future of Trading", // Change headline
      subtitle: "Trade smarter with AI", // Change subheadline
      cta: "Get Started", // Change button text
    },
  },

  trading: {
    swap: {
      title: "Swap Tokens",
      fromLabel: "From",
      toLabel: "To",
      priceImpact: "Price Impact",
    },
  },
};
```

### Using Content in Components

```tsx
import { content } from '@skai/ui';

function Hero() {
  return (
    <h1>{content.landing.hero.title}</h1>
    <p>{content.landing.hero.subtitle}</p>
    <Button>{content.landing.hero.cta}</Button>
  );
}
```

---

## 🖼️ Changing Assets

Edit `src/lib/assets.ts` to update images:

```typescript
// src/lib/assets.ts
export const assets = {
  logo: {
    full: "/assets/logo/skai-logo-full.svg", // Change path
    mark: "/assets/logo/skai-logo-mark.svg",
  },

  illustrations: {
    hero: "/assets/illustrations/hero.svg",
    empty: "/assets/illustrations/empty.svg",
  },
};
```

### Using Assets in Components

```tsx
import { assets } from "@skai/ui";

function Header() {
  return <img src={assets.logo.full} alt="SKAI" />;
}
```

---

## 🧩 Component Customization

### Modifying Component Variants

Components use `class-variance-authority` for variants:

```typescript
// src/components/button.tsx
const buttonVariants = cva("base-styles-here", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      // Add new variants here:
      gaming: "bg-purple-500 hover:bg-purple-600",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      // Add new sizes here:
      xl: "h-14 px-10 text-lg",
    },
  },
});
```

### Adding New Components

1. Create component file: `src/components/new-component.tsx`
2. Create story: `src/docs/new-component.stories.tsx`
3. Export from `src/index.ts`
4. Build: `npm run build`

---

## 📱 Responsive Design Testing

Storybook has viewport controls. Use stories to test:

```typescript
// src/docs/my-component.stories.tsx
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};
```

---

## 🔤 Typography

### Font Configuration

```typescript
// src/lib/theme-config.ts
typography: {
  fonts: {
    sans: "'Poppins', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    display: "'Poppins', sans-serif",
  },
  sizes: {
    xs: "0.75rem",   // 12px
    sm: "0.875rem",  // 14px
    base: "1rem",    // 16px
    lg: "1.125rem",  // 18px
    xl: "1.25rem",   // 20px
    "2xl": "1.5rem", // 24px
    // ... more
  }
}
```

---

## 🎭 Animations

Predefined animations in `src/lib/animations.tsx`:

- `FadeIn`, `FadeOut`
- `SlideIn`, `SlideOut`
- `ScaleIn`, `ScaleOut`
- `Bounce`, `Pulse`, `Shake`

```tsx
import { FadeIn, SlideIn } from '@skai/ui';

<FadeIn delay={0.2}>
  <Card>Content</Card>
</FadeIn>

<SlideIn direction="left">
  <Panel>Side content</Panel>
</SlideIn>
```

---

## ✅ Workflow

### Making Design Changes

1. **Start Storybook**: `npm run dev`
2. **Find component** in sidebar
3. **Edit source file** in `src/components/` or `src/lib/`
4. **See changes live** in Storybook (hot reload)
5. **Build library**: `npm run build`
6. **Test in main app**: Check changes on app.skai.trade

### Before Committing

```bash
# Type check
npm run typecheck

# Build to ensure no errors
npm run build

# Commit changes
git add .
git commit -m "design: description of changes"
git push
```

---

## � GitHub Integration (Push Changes)

### Method 1: GitHub Toolbar in Storybook

When viewing any component in Storybook, click the **GitHub icon** in the toolbar:

- **View Source** - Opens the component code on GitHub
- **Edit on GitHub** - Opens GitHub's web editor (commits directly to branch)
- **View History** - See all commits for this component
- **Create Pull Request** - Start a new PR for your changes
- **Report Issue** - File a bug or feature request

### Method 2: GitHub Web Editor (github.dev)

1. Go to https://github.dev/SKAI-Trading/skai-ui
2. This opens VS Code in your browser
3. Navigate to the file you want to edit
4. Make changes
5. Click Source Control (Ctrl+Shift+G)
6. Commit and push your changes

### Method 3: Create Branch via Workflow

1. Go to the [Component Update Workflow](https://github.com/SKAI-Trading/skai-ui/actions/workflows/component-update.yml)
2. Click "Run workflow"
3. Enter component name and description
4. A branch and draft PR will be created automatically
5. Edit files through the PR's "Files changed" tab

### Permissions Required

| Action          | Required Access      |
| --------------- | -------------------- |
| View source     | Read (everyone)      |
| Edit on GitHub  | Write (team members) |
| Create branches | Write                |
| Merge PRs       | Write + Approval     |

### Best Practices for GitHub Commits

```bash
# Good commit messages
"design: update button primary color to match brand refresh"
"fix: correct spacing in card component"
"feat: add new 'ghost' variant to button"

# Bad commit messages
"updated stuff"
"changes"
"fix"
```

---

## �📚 Storybook Categories

| Category           | What's Inside               |
| ------------------ | --------------------------- |
| **Introduction**   | Overview, getting started   |
| **Design Tokens**  | Colors, spacing, typography |
| **Components**     | All UI primitives           |
| **Trading**        | Trading-specific components |
| **Patterns**       | Common UI patterns          |
| **Page Templates** | Full page layouts           |
| **Accessibility**  | A11y guidelines             |

---

## 🆘 Getting Help

- **Component API**: Check Storybook "Docs" tab
- **Design tokens**: See `design-tokens.json`
- **Brand guidelines**: See `docs/BRAND_GUIDELINES.md`
- **Questions**: Ask in #design Slack channel

---

## 📋 Checklist for Design Changes

- [ ] Updated relevant design tokens
- [ ] Tested in Storybook
- [ ] Checked responsive breakpoints
- [ ] Verified accessibility (contrast, focus states)
- [ ] Updated content.ts if text changed
- [ ] Built successfully (`npm run build`)
- [ ] Committed with descriptive message
