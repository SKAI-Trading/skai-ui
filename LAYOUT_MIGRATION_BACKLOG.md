# Layout System Migration Backlog

> **Goal**: Migrate all layout/shell components from main app to skai-ui so they're reusable across all SKAI applications.

## Current State

Layout components currently live in `src/components/layout/` in the main app:

- `Layout.tsx` - Main app shell wrapper
- `Header.tsx` - Top navigation header (~865 lines)
- `Footer.tsx` - Site footer
- `BottomTickerBar.tsx` - Bottom dock with ticker/actions (~1073 lines)
- `MobileBottomNav.tsx` - Mobile navigation bar
- `HeaderStatusBar.tsx` - Points/vault display in header
- `AccountDropdown.tsx` - User account menu
- `EthBalanceDisplay.tsx` - ETH balance in header
- `PageTransition.tsx` - Page transition animations
- `PlayLayout.tsx` - Gaming section layout variant
- `FloatingActionBar.tsx` - Floating action buttons

## Migration Strategy

**Principle**: Separate presentation (skai-ui) from business logic (app-specific)

### Phase 1: Core Layout Shell ✅

Create presentational layout components that accept slots/children:

- [x] `AppShell` - Main layout wrapper
  - Props: `header`, `footer`, `sidebar`, `children`, `noPadding`
  - Handles viewport calculations, flex layout
  - No business logic, pure presentation

- [x] `AppHeader` - Header container
  - Props: `logo`, `navigation`, `actions`, `mobileMenu`, `className`
  - Slots for logo, nav items, right-side actions
  - Responsive behavior built-in

- [x] `AppFooter` - Footer container
  - Props: `links`, `social`, `copyright`, `className`
  - Standard footer layout

### Phase 2: Navigation Components ✅

- [x] `NavItem` - Single navigation item (as `AppHeaderNavItem`)
  - Props: `href`, `icon`, `label`, `badge`, `active`, `onClick`
  - Supports icons, badges, active states

- [x] `NavGroup` - Grouped navigation items ✅
  - Props: `label`, `items`, `collapsible`, `icon`, `badge`, `defaultExpanded`
  - Collapsible sections with nested items
  - Multiple variants (default, muted, bordered, elevated)
  - Storybook: `nav-group.stories.tsx`

- [x] `MobileNav` - Mobile bottom navigation
  - Props: `items`, `activeItem`, `onItemClick`
  - Touch-friendly, fixed bottom position

- [ ] `Sidebar` - Collapsible sidebar (existing component, needs enhancement)
  - Props: `items`, `collapsed`, `onToggle`
  - Expandable/collapsible states

### Phase 3: Dock & Ticker ✅

- [x] `DockBar` - Bottom dock container (extends existing `DockIcon`)
  - Props: `items`, `ticker`, `position`
  - Drag-and-drop reordering
  - Ticker tape integration

- [x] `TickerTape` - Scrolling ticker ✅
  - Props: `items`, `speed`, `direction`, `pauseOnHover`, `showFade`, `gap`, `separator`
  - Smooth infinite scroll animation
  - Click handlers and links
  - Change indicators (positive/negative/neutral)
  - Edge fade gradients
  - Storybook: `ticker-tape.stories.tsx`

### Phase 4: Specialized Components ✅

- [x] `StatusBar` - Header status display ✅
  - Props: `items` (array of { icon, value, label, onClick, tooltip, highlight, loading })
  - Multiple variants (default, muted, bordered, glass)
  - Tooltip integration
  - Highlight states (positive/negative)
  - Storybook: `status-bar.stories.tsx`

- [x] `AccountMenu` - User account dropdown ✅
  - Props: `name`, `avatarUrl`, `walletAddress`, `items`, `groups`, `onLogout`
  - Avatar with fallback initials
  - Wallet address with copy button
  - Grouped menu items
  - Multiple trigger variants
  - Storybook: `account-menu.stories.tsx`

- [x] `BalanceDisplay` - Token/currency balance ✅
  - Props: `balance`, `symbol`, `icon`, `loading`, `decimals`, `compact`, `hideValue`
  - Number formatting with locale support
  - Compact notation (1K, 1M, etc.)
  - Loading skeleton
  - Privacy mode (hide value)
  - BalanceChange component for +/- styling
  - Storybook: `balance-display.stories.tsx`

### Phase 5: Layout Variants ✅ COMPLETE

- [x] `TradingLayout` - Full-height trading view
  - Built-in viewport calculations (auto, full, viewport heights)
  - Left/right sidebar slots with configurable widths
  - Show/hide sidebars dynamically
  - Gap and padding options
  - `TradingPanel` component for panel styling
  - Storybook: `trading-layout.stories.tsx`

- [x] `DashboardLayout` - Dashboard with sidebar
  - Collapsible sidebar (controlled/uncontrolled)
  - Mobile responsive with overlay mode
  - Header slot for top navigation
  - `DashboardSidebar` with header/footer slots
  - `DashboardContent` with title, breadcrumb, actions
  - Max-width constraints for content
  - Storybook: `dashboard-layout.stories.tsx`

- [x] `CenteredLayout` - Centered content (auth pages)
  - Multiple background variants (gradient, pattern, muted)
  - Decorative blur elements
  - Fixed header/footer slots
  - Size variants (xs to xl)
  - `AuthCard` component for auth forms
  - Glass morphism card variant
  - Storybook: `centered-layout.stories.tsx`

## Implementation Notes

### Separation Pattern

```tsx
// skai-ui: Pure presentation
export const AppHeader = ({ logo, navigation, actions }: AppHeaderProps) => (
  <header className="sticky top-0 z-50 ...">
    <div className="logo-slot">{logo}</div>
    <nav className="nav-slot">{navigation}</nav>
    <div className="actions-slot">{actions}</div>
  </header>
);

// Main app: Business logic wrapper
export const Header = () => {
  const { isAdmin } = useAdmin();
  const { isConnected } = useWallet();

  return (
    <AppHeader
      logo={<Logo />}
      navigation={<NavItems items={getNavItems(isAdmin)} />}
      actions={<WalletButton connected={isConnected} />}
    />
  );
};
```

### Props vs Slots

- Use **props** for data (items, labels, values)
- Use **slots** (children/render props) for complex nested UI
- Keep components composable and flexible

## Priority Order

1. **AppShell** + **AppHeader** - Foundation for all apps
2. **MobileNav** - Mobile experience critical
3. **DockBar** - Unique SKAI feature
4. **TradingLayout** - Perp/spot trading pages
5. Rest as needed

## Apps to Support

- [x] Main App (app.skai.trade) - Primary target
- [ ] Landing Page (skai.trade) - **DEFERRED**
- [ ] Gaming Module (skai-gaming)
- [ ] Admin Dashboard
- [ ] Future: Mobile app (React Native)

## Files to Migrate

| Source (main app)       | Target (skai-ui)          | Priority | Status |
| ----------------------- | ------------------------- | -------- | ------ |
| `Layout.tsx`            | `AppShell`                | P0       | ⬜     |
| `Header.tsx`            | `AppHeader`               | P0       | ⬜     |
| `Footer.tsx`            | `AppFooter`               | P2       | ⬜     |
| `BottomTickerBar.tsx`   | `DockBar` + `TickerTape`  | P1       | ⬜     |
| `MobileBottomNav.tsx`   | `MobileNav`               | P1       | ⬜     |
| `HeaderStatusBar.tsx`   | `StatusBar`               | P2       | ⬜     |
| `AccountDropdown.tsx`   | `AccountMenu`             | P2       | ⬜     |
| `EthBalanceDisplay.tsx` | `BalanceDisplay`          | P3       | ⬜     |
| `PageTransition.tsx`    | (use existing animations) | P3       | ⬜     |

## Testing Requirements

- [ ] Storybook stories for each component
- [ ] Unit tests for interactive behavior
- [ ] Visual regression tests
- [ ] Responsive breakpoint testing
- [ ] Accessibility audit (keyboard nav, ARIA)

## Related Issues

- Perp trading page layout fix (completed) - exposed need for `noPadding` prop
- Header height inconsistencies (56px vs 64px in different calculations)
- Bottom ticker bar height (48px) needs to be a constant

---

**Created**: February 1, 2026  
**Last Updated**: February 1, 2026  
**Owner**: SKAI Engineering
