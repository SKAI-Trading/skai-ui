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

### Phase 1: Core Layout Shell ⬜

Create presentational layout components that accept slots/children:

- [ ] `AppShell` - Main layout wrapper
  - Props: `header`, `footer`, `sidebar`, `children`, `noPadding`
  - Handles viewport calculations, flex layout
  - No business logic, pure presentation

- [ ] `AppHeader` - Header container
  - Props: `logo`, `navigation`, `actions`, `mobileMenu`, `className`
  - Slots for logo, nav items, right-side actions
  - Responsive behavior built-in

- [ ] `AppFooter` - Footer container
  - Props: `links`, `social`, `copyright`, `className`
  - Standard footer layout

### Phase 2: Navigation Components ⬜

- [ ] `NavItem` - Single navigation item
  - Props: `href`, `icon`, `label`, `badge`, `active`, `onClick`
  - Supports icons, badges, active states

- [ ] `NavGroup` - Grouped navigation items
  - Props: `label`, `items`, `collapsible`
  - Dropdown/submenu support

- [ ] `MobileNav` - Mobile bottom navigation
  - Props: `items`, `activeItem`, `onItemClick`
  - Touch-friendly, fixed bottom position

- [ ] `Sidebar` - Collapsible sidebar
  - Props: `items`, `collapsed`, `onToggle`
  - Expandable/collapsible states

### Phase 3: Dock & Ticker ⬜

- [ ] `DockBar` - Bottom dock container (extends existing `DockIcon`)
  - Props: `items`, `ticker`, `position`
  - Drag-and-drop reordering
  - Ticker tape integration

- [ ] `TickerTape` - Scrolling ticker
  - Props: `items`, `speed`, `direction`, `pauseOnHover`
  - Smooth infinite scroll
  - Click-to-pause

### Phase 4: Specialized Components ⬜

- [ ] `StatusBar` - Header status display
  - Props: `items` (array of { icon, value, label, onClick })
  - Animated counters
  - Tooltip support

- [ ] `AccountMenu` - User account dropdown
  - Props: `user`, `items`, `onLogout`
  - Avatar, wallet address display
  - Menu items with icons

- [ ] `BalanceDisplay` - Token/currency balance
  - Props: `balance`, `symbol`, `icon`, `loading`
  - Formatted numbers
  - Loading skeleton

### Phase 5: Layout Variants ⬜

- [ ] `TradingLayout` - Full-height trading view
  - Built-in viewport calculations
  - Resizable panels integration
  - No padding mode

- [ ] `DashboardLayout` - Dashboard with sidebar
  - Collapsible sidebar
  - Breadcrumb support

- [ ] `CenteredLayout` - Centered content (auth pages)
  - Max-width container
  - Optional background

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
