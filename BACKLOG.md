# SKAI-UI Improvement Backlog

Generated: February 1, 2026

## 📋 30 Prioritized Improvements

### 🔴 CRITICAL - Accessibility & Security (Items 1-4)

| # | Item | Status | Effort | Impact |
|---|------|--------|--------|--------|
| 1 | Add `aria-describedby`, `aria-invalid` to form components (Input, NumberInput, AmountInput) | ✅ Done | Medium | High |
| 2 | Add `aria-live="polite"` to Countdown, TransactionStatus, notifications | ⬜ Todo | Low | High |
| 3 | Add keyboard navigation to TokenSelect search (arrow keys, Escape) | ⬜ Todo | Medium | High |
| 4 | Add screen reader announcements for PriceChange, PnLDisplay updates | ⬜ Todo | Low | Medium |

### 🟠 HIGH - Test Coverage (Items 5-10)

| # | Item | Status | Effort | Impact |
|---|------|--------|--------|--------|
| 5 | Port StatusIndicator tests from `OnlineStatusDot.test.ts` (39 tests) | ✅ Done | Low | High |
| 6 | Port RiskGauge tests from `RiskScore.test.tsx` (22 tests) | ✅ Done | Low | High |
| 7 | Add tests for overlay components (Dialog, Popover, Sheet, DropdownMenu) | ⬜ Todo | High | High |
| 8 | Add tests for form components (Select, Slider, RadioGroup, Switch) | ⬜ Todo | High | High |
| 9 | Add tests for missing hooks (useKeyboardShortcut, useIntersectionObserver, useWindowSize, usePrevious) | ⬜ Todo | Medium | Medium |
| 10 | Add visual regression tests via Storybook (Chromatic integration) | ⬜ Todo | Medium | High |

### 🟡 MEDIUM - Missing Components (Items 11-20)

| # | Item | Status | Effort | Impact |
|---|------|--------|--------|--------|
| 11 | Create `OrderBook` component from main app (260 lines, trading core) | ⬜ Todo | High | High |
| 12 | Create `DepthChart` component for bid/ask visualization | ⬜ Todo | High | High |
| 13 | Create `Autocomplete` / `Combobox` component (search with suggestions) | ⬜ Todo | High | High |
| 14 | Create `PasswordInput` with visibility toggle | ✅ Done | Low | Medium |
| 15 | Create `SearchInput` with clear button and loading state | ⬜ Todo | Low | Medium |
| 16 | Create `CurrencyInput` with formatting (trading-critical) | ⬜ Todo | Medium | High |
| 17 | Create `TagInput` for multi-value selection | ⬜ Todo | Medium | Medium |
| 18 | Create `DatePicker` composite component | ⬜ Todo | High | Medium |
| 19 | Create `Stepper` for multi-step forms/wizards | ⬜ Todo | Medium | Medium |
| 20 | Create `ScrollingTicker` from BottomTickerBar pattern | ⬜ Todo | Medium | Medium |

### 🟢 MEDIUM - Theming & Design Tokens (Items 21-23)

| # | Item | Status | Effort | Impact |
|---|------|--------|--------|--------|
| 21 | Add trading semantic color tokens (long/short, bid/ask, profit/loss) | ✅ Done | Low | High |
| 22 | Add component theming for Badge, Toast, Alert, Table | ⬜ Todo | Medium | Medium |
| 23 | Create CSS custom property fallbacks for older browsers | ⬜ Todo | Low | Low |

### 🔵 MEDIUM - Performance (Items 24-26)

| # | Item | Status | Effort | Impact |
|---|------|--------|--------|--------|
| 24 | Lazy load recharts in Chart component (~400KB savings) | ⬜ Todo | Medium | High |
| 25 | Tree-shake lucide-react icons (~100KB savings) | ⬜ Todo | Low | Medium |
| 26 | Add `sideEffects: false` to package.json for better tree-shaking | ⬜ Todo | Low | Medium |

### ⚪ LOWER - Documentation & DX (Items 27-30)

| # | Item | Status | Effort | Impact |
|---|------|--------|--------|--------|
| 27 | Add Storybook stories for 25 missing components | ⬜ Todo | High | Medium |
| 28 | Export all component prop types (InputProps, SliderProps, etc.) | ✅ Done | Medium | Medium |
| 29 | Add JSDoc with `@example` code snippets to all components | ⬜ Todo | High | Medium |
| 30 | Add exit animations (FadeOut), layout animations (list reordering), number animations | ⬜ Todo | Medium | Medium |

---

## 📊 Progress Summary

- **Completed:** 6/30 (20%)
- **In Progress:** 0/30
- **Todo:** 24/30

### ✅ Quick Wins Completed (Feb 1, 2026)

| # | Item | Files Created |
|---|------|---------------|
| 1 | ARIA attributes for Input | `input.tsx` enhanced with `error`, `errorId`, `description`, `aria-invalid` |
| 5 | StatusIndicator component + tests | `status-indicator.tsx`, `status-indicator.test.tsx` (31 tests) |
| 6 | RiskGauge component + tests | `risk-gauge.tsx`, `risk-gauge.test.tsx` (35 tests) |
| 14 | PasswordInput component + tests | `password-input.tsx`, `password-input.test.tsx` (28 tests) |
| 21 | Trading semantic color tokens | `theme-config.ts` - added bid/ask, profit/loss, priceUp/priceDown |
| 28 | Export InputProps type | `input.tsx` - exported `InputProps` interface |

## 🎯 Next Sprint Recommendations

### Sprint 1 (This Week)
- [ ] Item 2: aria-live for Countdown/TransactionStatus
- [ ] Item 3: TokenSelect keyboard navigation
- [ ] Item 15: SearchInput component

### Sprint 2 (Next Week)
- [ ] Item 7: Overlay component tests
- [ ] Item 8: Form component tests
- [ ] Item 16: CurrencyInput component

### Sprint 3 (Following Week)
- [ ] Item 11: OrderBook component
- [ ] Item 12: DepthChart component
- [ ] Item 13: Autocomplete/Combobox

---

## 📁 Source Files for Porting

### From Main Repo Tests
- `tests/unit/components/social/OnlineStatusDot.test.ts` → StatusIndicator patterns
- `tests/unit/components/ai/RiskScore.test.tsx` → RiskGauge patterns
- `tests/a11y/accessibility.test.tsx` → A11y test patterns

### From Main Repo Components
- `src/components/trade/OrderBook.tsx` → OrderBook component
- `src/components/trade/DepthChart.tsx` → DepthChart component
- `src/components/layout/BottomTickerBar.tsx` → ScrollingTicker pattern
