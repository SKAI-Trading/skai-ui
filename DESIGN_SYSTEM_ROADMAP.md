# SKAI UI Design System Roadmap

> Making skai-ui the **ultimate source of truth** for all SKAI UI/UX development

---

## 📊 Current State Assessment

### ✅ What We Have (Strong Foundation)

| Category               | Status      | Items                                                 |
| ---------------------- | ----------- | ----------------------------------------------------- |
| **Core Components**    | ✅ Complete | 100+ components (Button, Card, Input, Dialog, etc.)   |
| **Design Tokens**      | ✅ Complete | Colors, typography, spacing, shadows                  |
| **Trading Components** | ✅ Complete | SwapInput, TokenSelect, PriceDisplay, OrderBook, etc. |
| **Documentation**      | ✅ Partial  | Introduction, component stories, patterns             |
| **Theme System**       | ✅ Complete | ThemeProvider, dark/light mode                        |
| **Accessibility**      | ✅ Good     | Radix UI primitives, ARIA support                     |
| **Animations**         | ✅ Good     | FadeIn, SlideIn, motion utilities                     |
| **Content System**     | ✅ Basic    | Centralized copy/text management                      |
| **Asset System**       | ✅ Basic    | Centralized asset paths                               |

### ⚠️ Gaps Identified

| Gap                   | Priority  | Description                                      |
| --------------------- | --------- | ------------------------------------------------ |
| **Figma Sync**        | 🔴 High   | No automated sync between Figma tokens and code  |
| **Asset Library**     | 🔴 High   | Asset paths defined but no actual assets in repo |
| **Icon Coverage**     | 🟡 Medium | Only 15 custom icons, many missing               |
| **Page Templates**    | 🟡 Medium | Templates exist but not comprehensive            |
| **Migration Guide**   | 🟡 Medium | Main app still has `/components/ui` directory    |
| **Changelog**         | 🟢 Low    | No formal versioning/changelog                   |
| **Visual Regression** | 🟢 Low    | No automated visual testing                      |

---

## 🎯 Phase 1: Foundation Completeness (Week 1-2)

### 1.1 Complete Icon Library

```
Priority: HIGH
Owner: Design + Dev
```

**Current Icons:** ~15 (tier icons, wallet icons, basic UI)

**Missing Icons (Must Add):**

- [ ] Navigation: home, search, menu, close, back, forward
- [ ] Actions: edit, delete, copy, share, download, upload
- [ ] Trading: candles, chart-line, chart-bar, order, limit, market
- [ ] Social: user, users, message, notification, heart, star
- [ ] System: settings, lock, unlock, eye, eye-off, info, warning
- [ ] Crypto: blockchain, gas, wallet, swap, bridge, stake

**Deliverable:** All icons available via `<SkaiIcon name="..." />`

### 1.2 Asset Library Setup

```
Priority: HIGH
Owner: Design
```

Create actual asset files referenced in `assets.ts`:

```
modules/skai-ui/public/assets/
├── logo/
│   ├── skai-logo-full.svg
│   ├── skai-logo-mark.svg
│   ├── skai-logo-white.svg
│   └── skai-logo-dark.svg
├── tokens/
│   ├── eth.svg
│   ├── usdc.svg
│   └── [top 50 tokens].svg
├── chains/
│   ├── ethereum.svg
│   ├── base.svg
│   └── [supported chains].svg
├── wallets/
│   ├── metamask.svg
│   ├── coinbase.svg
│   └── [supported wallets].svg
├── illustrations/
│   ├── hero.svg
│   ├── empty-state.svg
│   └── error.svg
└── backgrounds/
    ├── gradient-1.svg
    └── pattern-1.svg
```

### 1.3 Main App Migration

```
Priority: HIGH
Owner: Dev
```

Remove `src/components/ui/` from main app, migrate to skai-ui:

- [ ] Replace `toast` / `use-toast` with `@skai/ui` version
- [ ] Replace `dock-icon` with `@skai/ui` version
- [ ] Replace `FeeDisplay` with `@skai/ui` version
- [ ] Replace `OnlineIndicator` with `@skai/ui` version
- [ ] Remove duplicate component files

---

## 🎯 Phase 2: Designer Experience (Week 2-3)

### 2.1 Figma Token Sync

```
Priority: HIGH
Owner: Design + Dev
```

**Setup:**

1. Install Figma Tokens plugin
2. Configure sync with `design-tokens.json`
3. CI pipeline to detect token drift

**Workflow:**

```
Figma → Export Tokens → design-tokens.json → Build → CSS Variables
```

**Tools:**

- [Tokens Studio for Figma](https://tokens.studio/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/) for token transformation

### 2.2 Design Documentation Pages

```
Priority: MEDIUM
Owner: Design
```

Add comprehensive Storybook documentation:

- [ ] **Getting Started/For Designers** - How designers use the system
- [ ] **Getting Started/For Developers** - Setup and integration
- [ ] **Design Tokens/All Tokens** - Complete token reference
- [ ] **Design Tokens/Color Usage** - When to use each color
- [ ] **Design Tokens/Typography Scale** - Font pairing guide
- [ ] **Design Tokens/Spacing System** - Layout rhythm guide
- [ ] **Brand/Voice & Tone** - Writing guidelines
- [ ] **Brand/Logo Usage** - Logo do's and don'ts
- [ ] **Brand/Imagery** - Photo/illustration style
- [ ] **Accessibility/Guidelines** - A11y requirements
- [ ] **Accessibility/Checklist** - Component a11y checklist

### 2.3 Component Specifications

```
Priority: MEDIUM
Owner: Design
```

For each component, document in Storybook:

- [ ] Anatomy diagram
- [ ] States (default, hover, active, disabled, loading, error)
- [ ] Size variants
- [ ] Responsive behavior
- [ ] Accessibility requirements
- [ ] Do's and Don'ts

---

## 🎯 Phase 3: Developer Experience (Week 3-4)

### 3.1 CLI Scaffolding Tool

```
Priority: MEDIUM
Owner: Dev
```

Create CLI for generating components:

```bash
npx @skai/ui add button
npx @skai/ui add swap-form
npx @skai/ui init  # Setup in new project
```

### 3.2 Code Snippets & Examples

```
Priority: MEDIUM
Owner: Dev
```

Add copy-paste ready examples:

- [ ] Complete swap form
- [ ] Token selector with search
- [ ] Order book display
- [ ] Portfolio card
- [ ] Transaction history table
- [ ] User profile card
- [ ] Notification toast patterns
- [ ] Error handling patterns
- [ ] Loading state patterns

### 3.3 Testing Infrastructure

```
Priority: MEDIUM
Owner: Dev
```

- [ ] 80%+ unit test coverage
- [ ] Integration tests for complex components
- [ ] Visual regression tests (Chromatic or Percy)
- [ ] Accessibility automated tests (axe-core)

---

## 🎯 Phase 4: Advanced Features (Week 4-6)

### 4.1 Theme Builder UI

```
Priority: LOW
Owner: Dev
```

Interactive theme customization in Storybook:

- Color picker for brand colors
- Typography selector
- Export custom theme config

### 4.2 Component Playground

```
Priority: LOW
Owner: Dev
```

Live editor for components (like Chakra's playground):

- Edit props in real-time
- Copy generated code
- Share via URL

### 4.3 Internationalization Support

```
Priority: LOW
Owner: Dev
```

- [ ] RTL layout support
- [ ] Number/currency formatting utils
- [ ] Date/time formatting utils
- [ ] Translation-ready content strings

### 4.4 Mobile-First Components

```
Priority: MEDIUM
Owner: Design + Dev
```

Ensure all components work perfectly on mobile:

- [ ] Touch-friendly hit targets (44px minimum)
- [ ] Mobile-optimized sheets/dialogs
- [ ] Swipe gestures where appropriate
- [ ] Virtual keyboard handling

---

## 🎯 Phase 5: Ecosystem Integration (Ongoing)

### 5.1 Submodule Adoption

```
Priority: ONGOING
Owner: All Teams
```

| App                 | Status         | Migration            |
| ------------------- | -------------- | -------------------- |
| skai-trading (main) | 🟡 Partial     | In progress          |
| skai-landing        | 🟡 Partial     | Uses some components |
| skai-bot            | ⬜ Not started | Dashboard UI         |
| skai-gaming         | ⬜ Not started | Game UI components   |
| skai-discord        | ⬜ Not started | Bot dashboard        |

### 5.2 Version Management

```
Priority: MEDIUM
Owner: Dev
```

- [ ] Semantic versioning (semver)
- [ ] Changelog generation
- [ ] Breaking change warnings
- [ ] Deprecation notices
- [ ] Migration codemods

---

## 📋 Quick Wins (Do This Week)

1. **Add missing SkaiIcon entries** for common UI icons
2. **Export assets** from Figma and add to `/public/assets/`
3. **Delete `/src/components/ui/`** from main app, use skai-ui imports
4. **Add "For Designers" intro page** in Storybook
5. **Create token sync script** from Figma

---

## 🏆 Success Metrics

| Metric              | Current | Target |
| ------------------- | ------- | ------ |
| Component count     | 100+    | 120+   |
| Icon count          | ~15     | 100+   |
| Storybook stories   | ~70     | 150+   |
| Test coverage       | ~40%    | 80%+   |
| A11y score          | Good    | AAA    |
| Main app migration  | 50%     | 100%   |
| Documentation pages | 10      | 25+    |

---

## 🔗 Related Resources

- **Storybook:** https://docs.skai.trade/ui/
- **Figma:** https://figma.com/file/TyX8YAtNDEIvsnSLQ3IXId/Skai-Design
- **GitHub:** https://github.com/SKAI-Trading/skai-ui
- **NPM:** `@skai/ui` (when published)

---

## 👥 Team Responsibilities

| Role              | Responsibilities                              |
| ----------------- | --------------------------------------------- |
| **Design Lead**   | Token definitions, component specs, visual QA |
| **Frontend Lead** | Architecture, migrations, build tooling       |
| **Developers**    | Component implementation, testing             |
| **Product**       | Feature prioritization, usage tracking        |

---

_Last Updated: February 2026_
_Owner: SKAI Frontend Team_
