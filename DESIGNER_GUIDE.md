# SKAI UI Design System Guide

> **For Designers & UI Developers**: This guide explains how to customize the SKAI UI without breaking functionality.

## 🎨 Quick Start for Designers

### What You Can Safely Modify

> ## 🛑 STOP — most of this table is currently FALSE (verified 2026-08-11)
>
> **The main app never loads this library's stylesheet.** The import is commented
> out at `src/index.ts:256` (`// import '@skai/ui/dist/styles.css';`), and the only
> line the app pulls from here is `src/index.css:12` →
> `modules/skai-ui/src/styles/typography.css`.
>
> So `design-tokens.css`, `styles/index.css` and `styles/base.css` **do not reach
> production**. Editing them, rebuilding and deploying changes **zero pixels** — the
> worst kind of failure, because everything reports success.
>
> The theme that actually renders is defined in the MAIN app at
> `src/index.css:372-472`, and it disagrees with this library's copies:
> `--primary` is `#2DEDAD` green here vs `#56C7F3` blue in `styles/index.css:58`;
> `--radius` is `0.75rem` in the app vs `0.5rem` in `design-tokens.css:283`. That
> divergence is the proof — if these files were live, every corner in the product
> would be the wrong size.
>
> **Until `@import "../modules/skai-ui/src/styles/index.css"` is added to the app's
> `src/index.css` and the duplicate `:root` blocks are removed**, a colour change is
> a two-repo job: edit `src/index.css` in skai-interface AND the copies here, then
> rebuild `dist`.
>
> Rows below marked ❌ do not work today. Rows marked ✅ do.

| What                | Where                                      | Impact                      |
| ------------------- | ------------------------------------------ | --------------------------- |
| ❌ **Colors**        | `design-tokens.json` / `design-tokens.css` | NOT LOADED — edit `src/index.css` in the main app |
| ❌ **Typography**    | `design-tokens.json` / `design-tokens.css` | NOT LOADED — but `styles/typography.css` IS. Note the webfont `<link>` lives in the app's `index.html:209-222`, so swapping a typeface is still a two-repo change |
| ❌ **Spacing**       | `design-tokens.json` / `design-tokens.css` | NOT LOADED — page spacing is literals in page components |
| ❌ **Border Radius** | `design-tokens.json` / `design-tokens.css` | NOT LOADED — app ships `--radius: 0.75rem` from `src/index.css:446` |
| ❌ **Shadows**       | `design-tokens.json` / `design-tokens.css` | NOT LOADED |
| ✅ **Token scale**   | `src/tokens-export` (Tailwind preset)      | WORKS — the app consumes `skaiPreset`, so `bg-alien-green`, `text-headline-1`, `rounded-lg` all resolve from here |
| **Text Content**    | `lib/content.ts`                           | All UI text/copy            |
| **Images**          | `lib/assets.ts`                            | Logos, icons, illustrations |
| **Component Props** | Storybook                                  | Visual variants             |

### What NOT to Modify (Without Developer Help)

- Component logic (`.tsx` files)
- Event handlers and callbacks
- API integrations
- TypeScript interfaces
- Build configuration

---

## 📁 File Structure Overview

```
skai-ui/
├── src/
│   ├── design-tokens.css      ← 🎨 CSS variables (colors, spacing, etc.)
│   ├── design-tokens.json     ← 🎨 Figma-compatible token format
│   ├── lib/
│   │   ├── content.ts         ← ✏️ All text content
│   │   ├── assets.ts          ← 🖼️ Images and icons
│   │   ├── theme-config.ts    ← 🎨 Theme configuration
│   │   └── layout.tsx         ← 📐 Layout components
│   ├── components/            ← 🧩 UI components
│   ├── docs/                  ← 📚 Storybook stories
│   └── styles/
│       └── index.css          ← 🎨 Global styles
├── figma.config.json          ← 🔗 Figma Code Connect mapping
└── tailwind.config.ts         ← 🎨 Tailwind configuration
```

---

## 🎨 Customizing Colors

### Option 1: Edit CSS Variables (Recommended)

Open `src/design-tokens.css` or `src/styles/index.css`:

```css
:root {
  /* Brand Colors */
  --primary: 197 87% 55%; /* Change these HSL values */
  --secondary: 166 80% 55%;

  /* Trading Colors */
  --long: 142 76% 36%; /* Buy/profit green */
  --short: 0 84% 60%; /* Sell/loss red */

  /* Background */
  --background: 225 80% 4%; /* Main background */
  --card: 225 60% 8%; /* Card backgrounds */
}
```

### Option 2: Edit JSON Tokens (For Figma Sync)

Open `src/design-tokens.json`:

```json
{
  "colors": {
    "brand": {
      "primary": {
        "$value": "#56C7F3",
        "$type": "color"
      }
    }
  }
}
```

### Color Format Conversion

| Format | Example             | Use In             |
| ------ | ------------------- | ------------------ |
| HSL    | `197 87% 55%`       | CSS variables      |
| Hex    | `#56C7F3`           | JSON tokens, Figma |
| RGB    | `rgb(86, 199, 243)` | Direct styles      |

---

## ✏️ Customizing Text Content

All UI text is centralized in `src/lib/content.ts`:

```typescript
export const content = {
  global: {
    brand: {
      name: "SKAI",
      tagline: "Trade Smarter, Not Harder", // Edit this!
    },
    actions: {
      connect: "Connect Wallet", // Edit this!
      swap: "Swap",
      buy: "Buy",
    },
  },

  landing: {
    hero: {
      title: "The Future of Trading", // Edit this!
      subtitle: "Trade smarter with AI-powered insights",
    },
  },

  trading: {
    swap: {
      title: "Swap",
      from: "From",
      to: "To",
      button: "Swap",
    },
  },
};
```

### Using Dynamic Text

For text with variables:

```typescript
import { content, interpolate } from "@skai/ui";

// In content.ts
buttonApprove: "Approve {{token}}";

// In component
interpolate(content.trading.swap.buttonApprove, { token: "ETH" });
// Result: "Approve ETH"
```

---

## 🖼️ Customizing Images & Assets

All assets are defined in `src/lib/assets.ts`:

```typescript
export const assets = {
  logo: {
    full: "/assets/logo/skai-logo-full.svg", // Change path
    mark: "/assets/logo/skai-logo-mark.svg",
  },

  illustrations: {
    hero: "/assets/illustrations/hero.svg",
    trading: "/assets/illustrations/trading.svg",
  },
};
```

### Adding New Assets

1. Add the file to `/public/assets/`
2. Update `assets.ts` with the new path
3. Import and use: `<img src={assets.logo.full} />`

---

## 📐 Using Layout Components

Layout primitives help structure UI without custom CSS:

### Stack (Vertical/Horizontal)

```tsx
import { Stack, HStack, VStack } from '@skai/ui';

// Vertical stack with gap
<VStack gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</VStack>

// Horizontal stack, centered
<HStack gap={2} align="center" justify="between">
  <span>Left</span>
  <span>Right</span>
</HStack>
```

### Grid

```tsx
import { Grid, GridItem } from "@skai/ui";

<Grid cols={3} gap={4}>
  <GridItem>Cell 1</GridItem>
  <GridItem colSpan={2}>Spans 2 columns</GridItem>
</Grid>;
```

### Container

```tsx
import { Container, Center } from "@skai/ui";

<Container size="xl" padding>
  <Center>Centered content</Center>
</Container>;
```

### Responsive Visibility

```tsx
import { Hide, Show } from '@skai/ui';

<Hide below="md">Hidden on mobile</Hide>
<Show above="lg">Only on desktop</Show>
```

---

## 🔗 Figma Integration

### Setting Up Code Connect

1. Install Figma Code Connect extension in VS Code
2. Edit `figma.config.json` with your Figma file URLs
3. Map Figma components to code components

### Syncing Design Tokens

1. Export tokens from Figma Tokens plugin
2. Replace `design-tokens.json` content
3. Run build to apply changes

### Mapping Components

In `figma.config.json`, update node URLs:

```json
{
  "mappings": {
    "components": {
      "button": {
        "figmaNodeUrl": "https://www.figma.com/file/ABC123?node-id=1:2"
      }
    }
  }
}
```

---

## 🎭 Theming

### Creating a Custom Theme

```typescript
import { createTheme, applyTheme } from "@skai/ui";

const myTheme = createTheme({
  colors: {
    brand: {
      primary: "220 100% 50%", // Custom blue
      secondary: "280 80% 60%", // Custom purple
    },
  },
  radius: {
    lg: "1rem", // Rounder corners
  },
});

// Apply at runtime
applyTheme(myTheme);
```

### Theme Variables Available

| Category   | Variables                                                                             |
| ---------- | ------------------------------------------------------------------------------------- |
| Colors     | `brand.primary`, `brand.secondary`, `background.*`, `text.*`, `border.*`, `trading.*` |
| Typography | `fonts.*`, `sizes.*`, `weights.*`, `lineHeights.*`                                    |
| Spacing    | `0` through `24`                                                                      |
| Radius     | `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`                                         |
| Shadows    | `none`, `sm`, `md`, `lg`, `xl`, `glow`                                                |

---

## 📚 Storybook Reference

### Running Storybook

```bash
cd modules/skai-ui
npm run dev
```

Open http://localhost:6006

### What Storybook Shows

- All available components
- Interactive props/controls
- Usage examples
- Dark/light theme preview

### Testing Visual Changes

1. Make changes to tokens/content/assets
2. Run Storybook
3. Check all components still look correct
4. Build: `npm run build`

---

## ✅ Safe Modification Checklist

Before making changes:

- [ ] Identified the correct file to modify
- [ ] Change is visual-only (not logic)
- [ ] Backed up original values
- [ ] Tested in Storybook
- [ ] Checked dark/light themes
- [ ] Verified mobile responsiveness
- [ ] Run build (`npm run build`) - no errors

---

## 🆘 Getting Help

| Issue               | Solution                                   |
| ------------------- | ------------------------------------------ |
| Colors not updating | Clear browser cache, rebuild               |
| Build fails         | Check JSON syntax, run `npm run typecheck` |
| Component broken    | Restore from git, ask developer            |
| Figma sync issues   | Check node URLs in `figma.config.json`     |

### Support Contacts

- **Design questions**: Check Storybook first
- **Technical issues**: Create GitHub issue
- **Urgent**: Tag `@developer` in Discord/Slack
