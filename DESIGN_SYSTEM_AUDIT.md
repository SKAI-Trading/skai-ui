# SKAI UI Design System - Complete Audit & Fix Plan
*February 1, 2026 - 8 Hour Deep Dive*

## 🚨 **CRITICAL FINDINGS**

### Typography System - MAJOR INCONSISTENCIES DISCOVERED

**CURRENT STATE: BROKEN**
- **3 DIFFERENT FONT SYSTEMS** in use across the codebase
- **Design tokens JSON** declares: Poppins + Inter  
- **Design tokens CSS** declares: Inter + JetBrains Mono
- **Typography CSS** implements: Cormorant Garamond + Manrope + Mulish
- **Main app** may be using different fonts entirely

### Problems Identified:

1. **Font Loading**: Multiple font families declared but potentially not loaded
2. **Performance**: Loading too many font families impacts performance
3. **Consistency**: Components using different typography systems
4. **Figma Sync**: Unknown which font system matches actual Figma designs
5. **Documentation**: Storybook shows different typography than implementation

---

## 🎯 **AUDIT PLAN**

### Phase 1: Typography Foundation (2 hours)
- [ ] Determine **SOURCE OF TRUTH** font system from Figma
- [ ] Audit all font loading in main app
- [ ] Consolidate to ONE typography system
- [ ] Update all design token files to match
- [ ] Create comprehensive typography Storybook stories

### Phase 2: Component Inventory (2 hours)  
- [ ] Audit ALL 123+ components in skai-ui
- [ ] Cross-reference with main app usage
- [ ] Identify missing components from Figma
- [ ] Flag components not being used
- [ ] Create component coverage matrix

### Phase 3: Design Token Alignment (2 hours)
- [ ] Audit color tokens vs Figma color palette
- [ ] Verify spacing scale matches design system
- [ ] Check border radius, shadows, animations
- [ ] Validate component tokens (button heights, etc.)
- [ ] Update Tailwind config in main app

### Phase 4: Missing Features & Documentation (2 hours)
- [ ] Identify missing components from live site
- [ ] Create comprehensive component documentation
- [ ] Update Storybook with all component variants
- [ ] Validate accessibility compliance
- [ ] Performance audit and optimization

---

## 📋 **CURRENT COMPONENT INVENTORY**

Based on skai-ui/src/components analysis:

### ✅ **BASIC COMPONENTS (23)**
- Accordion, Alert, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Chart
- Checkbox, Dialog, Dropdown, Input, Label  
- Progress, Radio, Select, Slider, Switch
- Table, Tabs, Textarea

### 🎯 **TRADING SPECIFIC (30+)**
- Amount Input, Autocomplete, Balance Display
- Candlestick Chart, Currency Input, Depth Chart
- Fee Display, Funding Rate, Gas Estimate
- Leverage Slider, Order Book, Price Display
- Risk Gauge, Token Icon, Token Select
- Trading Layout, Transaction Status
- PNL Display, Percentage Bar
- Network Badge, Tier Badge

### 🚧 **LAYOUT & NAVIGATION (15+)**
- App Shell, Dashboard Layout, Centered Layout
- Page Layouts, Mobile Nav, Nav Group
- Dock Bar, Dock Icon, Status Bar
- App Header, App Footer, Account Menu

### 🎨 **VISUAL & FEEDBACK (20+)**
- Empty State, Error Boundary, Loading Button
- Notification, Online Indicator, Particle Background
- QR Code, Spinner, Status Indicator
- Toast, Tooltip, Countdown
- Copy Button, Search Input

### 🔧 **UTILITIES & HOOKS (25+)**
- Theme Provider, Resizable, Scrolling Ticker
- Tour, Masonry, Stepper
- Tag Input, Password Input, Number Input
- Plus 12+ custom hooks

---

## 🎨 **TYPOGRAPHY SYSTEM CONSOLIDATION**

### Recommendation: **KEEP CURRENT TYPOGRAPHY.CSS**
Based on analysis, `typography.css` appears most complete:

```
✅ Cormorant Garamond: Headlines (elegant serif)
✅ Manrope: Sub-headlines, UI text (modern sans-serif)  
✅ Mulish: Numbers, labels (readable sans-serif)
✅ JetBrains Mono: Code, technical data
```

### Actions Required:
1. **Update design-tokens.json** to match typography.css
2. **Update design-tokens.css** to match typography.css  
3. **Verify font loading** in main app
4. **Create Storybook stories** for all typography variants
5. **Document responsive breakpoints** clearly

---

## 🔍 **FIGMA ALIGNMENT CHECKLIST**

### Colors
- [ ] Primary brand colors match
- [ ] Semantic colors (success/error/warning) match
- [ ] Trading colors (buy/sell/neutral) match
- [ ] Background and surface colors match
- [ ] Text color hierarchy matches

### Typography
- [ ] Font families loaded and applied correctly
- [ ] Font sizes match across breakpoints
- [ ] Line heights and letter spacing match
- [ ] Font weights available and used correctly
- [ ] Responsive typography scales properly

### Spacing & Layout
- [ ] Grid system matches Figma layouts
- [ ] Spacing scale (4px, 8px, 12px, etc.) consistent
- [ ] Component padding/margins match designs
- [ ] Breakpoint behavior matches responsive designs

### Components
- [ ] Button variants and states match
- [ ] Input field styling matches
- [ ] Card layouts and spacing match
- [ ] Navigation patterns match
- [ ] Trading UI components match exactly

---

## 📊 **COMPONENT COVERAGE MATRIX**

| Figma Component | skai-ui Status | Main App Usage | Stories Complete | Notes |
|-----------------|---------------|----------------|------------------|--------|
| **FORMS** |
| Button | ✅ Complete | ✅ Used | ⚠️ Partial | Missing trading variants |
| Input | ✅ Complete | ✅ Used | ⚠️ Partial | Missing error states |
| Select | ✅ Complete | ✅ Used | ✅ Complete | Good coverage |
| **TRADING** |
| Token Card | ❓ Unknown | ✅ Used | ❌ Missing | Critical gap |
| Price Display | ✅ Complete | ✅ Used | ✅ Complete | Good |
| Order Book | ✅ Complete | ✅ Used | ⚠️ Partial | Missing themes |
| **LAYOUT** |
| Page Header | ⚠️ Partial | ✅ Used | ❌ Missing | Needs standardization |
| Sidebar Nav | ⚠️ Partial | ✅ Used | ❌ Missing | Custom implementation |
| **FEEDBACK** |
| Toast | ✅ Complete | ✅ Used | ✅ Complete | Good |
| Loading | ⚠️ Partial | ✅ Used | ⚠️ Partial | Multiple implementations |

*Matrix to be completed during audit...*

---

## ⚡ **IMMEDIATE ACTIONS**

### 1. Typography Fix (30 minutes)
```bash
# Update design tokens to match typography.css
# Fix font family declarations
# Verify font loading in main app
```

### 2. Component Documentation (60 minutes)
```bash
# Create missing Storybook stories
# Document all component variants
# Add usage examples for each
```

### 3. Figma Sync (90 minutes)
```bash
# Compare each component to Figma designs
# Update styling to match exactly
# Document discrepancies for review
```

---

## 🎯 **SUCCESS METRICS**

By end of 8-hour session:

- [ ] **Typography**: Single source of truth, all files aligned
- [ ] **Components**: 100% documented in Storybook
- [ ] **Figma Sync**: All components match designs
- [ ] **Performance**: Optimized font loading
- [ ] **Documentation**: Complete usage guides
- [ ] **Coverage**: Component matrix 100% complete
- [ ] **Testing**: All components tested and validated

---

## 📝 **NEXT STEPS**

1. **Start with Typography** - Fix the foundational issue
2. **Component by Component** - Systematic audit
3. **Documentation** - Comprehensive Storybook updates
4. **Testing** - Validate in main app
5. **Performance** - Optimize and measure
6. **Handoff** - Complete documentation for team

Let's build this the right way! 🚀