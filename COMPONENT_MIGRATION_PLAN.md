# 🚀 SKAI UI Component Migration Plan

**Status:** ✅ FOUNDATION COMPLETE - Ready for Component Migration  
**Last Updated:** February 1, 2026  
**Progress:** Typography System 100% Complete, Build Pipeline Ready

## ✅ COMPLETED FOUNDATION (2.5 Hours)

### 🎯 Typography System (PERFECT)
- **54 responsive variants** implemented with perfect Figma alignment
- **Design tokens integration** with CSS variables and Tailwind tokens  
- **Typography component system** with semantic HTML mapping
- **Comprehensive documentation** with 4 major story groups

### ⚡ Core Components Updated
- **Button Component** - Perfect design system alignment, 6 types × 5 sizes
- **Card Component** - Semantic typography classes (CardTitle, CardDescription)
- **Build Pipeline** - Production-ready, 4.16s builds, multi-format output

---

## 🎯 NEXT PHASE: COMPONENT MIGRATION PRIORITY

### 🔥 PHASE 1: High-Impact Components (1-2 hours)

**TraderCard.tsx** - ⭐ HIGHEST PRIORITY
- **Current:** Hardcoded text sizes and inconsistent fonts  
- **Migration:** Use `skai-card-title`, `skai-number-3` for prices, `skai-para-2` for details
- **Impact:** Most visible component in trading interface
- **Location:** `src/components/copytrading/TraderCard.tsx`

**Navigation Components** - ⭐ HIGH PRIORITY
- **AppShell header/navigation** - Use `skai-sub-2` for nav items
- **Sidebar components** - Consistent typography hierarchy
- **Breadcrumbs and tabs** - Design system alignment

**Modal Headers & Dialogs** - ⭐ HIGH PRIORITY  
- **Dialog titles** - Use `skai-section-title` or `skai-card-title`
- **Modal content** - Use `skai-body` and `skai-small` for descriptions
- **Action buttons** - Already using updated Button component ✅

### ⚡ PHASE 2: Form Components (1 hour)

**Input Components**
- **Form labels** - Use `skai-label-1` class
- **Help text** - Use `skai-small` class  
- **Error messages** - Use `skai-para-2` with error colors

**Select & Dropdown Components**  
- **Option text** - Use `skai-para-1` for consistent sizing
- **Placeholder text** - Use `skai-para-2` with muted colors

### 🔧 PHASE 3: Data Display Components (1 hour)

**Tables & Lists**
- **Table headers** - Use `skai-sub-2-semibold`
- **Table cells** - Use `skai-para-1` for data, `skai-number-4` for numbers
- **List items** - Use Typography List and ListItem components

**Charts & Data Visualization**  
- **Chart titles** - Use `skai-card-title`
- **Axis labels** - Use `skai-label-2` 
- **Tooltips** - Use `skai-small`

### 📱 PHASE 4: Utility Components (30 minutes)

**Badges & Tags**
- **Badge text** - Use `skai-label-2` class
- **Status indicators** - Use design system colors + typography

**Tooltips & Popovers**
- **Tooltip content** - Use `skai-small` for concise text
- **Popover headers** - Use `skai-sub-2-semibold`

---

## 🔄 MIGRATION METHODOLOGY

### 1. Component Analysis (5 minutes per component)
```bash
# Search for hardcoded font styles
grep -r "text-\|font-\|text\[" src/components/ComponentName.tsx

# Check for inline styles
grep -r "fontSize\|fontWeight\|fontFamily" src/components/ComponentName.tsx
```

### 2. Typography Mapping (10 minutes per component)
```typescript
// BEFORE: Hardcoded styles
<h3 className="text-2xl font-semibold">Title</h3>
<p className="text-sm text-gray-400">Description</p>

// AFTER: Design system classes  
<h3 className="skai-card-title">Title</h3>
<p className="skai-small text-muted-foreground">Description</p>
```

### 3. Component Testing (5 minutes per component)
- Visual comparison with Figma designs
- Responsive behavior verification (desktop/tablet/mobile)
- Storybook documentation update

---

## 📋 MIGRATION CHECKLIST (Per Component)

### Pre-Migration
- [ ] Document current typography usage
- [ ] Identify hardcoded font styles
- [ ] Screenshot current appearance

### Migration  
- [ ] Replace hardcoded classes with skai-* variants
- [ ] Update component props if needed
- [ ] Test responsive behavior
- [ ] Verify semantic HTML structure

### Post-Migration
- [ ] Update Storybook stories with new examples
- [ ] Visual regression test
- [ ] Performance impact check
- [ ] Documentation update

---

## 🚀 INTEGRATION TIMELINE

### Week 1: Foundation Integration (DONE ✅)
- Typography system implementation
- Core component updates (Button, Card)
- Build pipeline optimization

### Week 2: Component Migration Sprint  
- **Day 1-2:** High-impact components (TraderCard, Navigation)
- **Day 3:** Form components migration
- **Day 4:** Data display components  
- **Day 5:** Utility components + testing

### Week 3: Polish & Optimization
- **Visual regression testing** across all migrated components
- **Performance optimization** if needed
- **Documentation completion** for all components
- **Developer guidelines** for future component development

---

## 📊 SUCCESS METRICS

### Design Consistency
- **Typography alignment** - 100% match with Figma specifications
- **Responsive scaling** - Perfect behavior across breakpoints  
- **Component uniformity** - All components using design system

### Developer Experience
- **Build performance** - Sub-5 second builds maintained
- **Bundle size impact** - <5% increase acceptable  
- **Development velocity** - Faster component creation with design system

### Business Impact  
- **Visual brand consistency** across entire platform
- **Professional appearance** matching design specifications
- **Improved accessibility** with WCAG-compliant typography

---

## 🔧 TECHNICAL NOTES

### Design System Usage
```typescript
// Import the system
import { Typography, H1, P, Price } from "@skai/ui";

// Use semantic components
<H1>Page Title</H1>
<P>Body content with automatic responsive scaling</P>  
<Price>$1,234.56</Price>

// Or use the unified Typography component
<Typography variant="card-title">Flexible Title</Typography>
<Typography variant="small">Helper text</Typography>
```

### CSS Class Reference  
- **Headlines:** `skai-headline-3`, `skai-headline-4`
- **Sub-headlines:** `skai-sub-1`, `skai-sub-2`, `skai-sub-2-semibold`
- **Body text:** `skai-para-1`, `skai-para-1-semibold`, `skai-para-2`
- **Numbers:** `skai-number-1` through `skai-number-4` (tabular-nums)
- **Labels:** `skai-label-1`, `skai-label-2`
- **Semantic:** `skai-card-title`, `skai-body`, `skai-small`, `skai-price`

---

**🎯 Ready to begin Phase 1 component migration with a rock-solid foundation!**