# SKAI-UI Improvement Backlog

Generated: February 1, 2026
**Updated: February 2, 2026 - BACKLOG COMPLETE! 🎉**

## 📋 30 Prioritized Improvements

### 🔴 CRITICAL - Accessibility & Security (Items 1-4)

| #   | Item                                                                                        | Status  | Effort | Impact |
| --- | ------------------------------------------------------------------------------------------- | ------- | ------ | ------ |
| 1   | Add `aria-describedby`, `aria-invalid` to form components (Input, NumberInput, AmountInput) | ✅ Done | Medium | High   |
| 2   | Add `aria-live="polite"` to Countdown, TransactionStatus, notifications                     | ✅ Done | Low    | High   |
| 3   | Add keyboard navigation to TokenSelect search (arrow keys, Escape)                          | ✅ Done | Medium | High   |
| 4   | Add screen reader announcements for PriceChange, PnLDisplay updates                         | ✅ Done | Low    | Medium |

### 🟠 HIGH - Test Coverage (Items 5-10)

| #   | Item                                                                                                   | Status  | Effort | Impact |
| --- | ------------------------------------------------------------------------------------------------------ | ------- | ------ | ------ |
| 5   | Port StatusIndicator tests from `OnlineStatusDot.test.ts` (39 tests)                                   | ✅ Done | Low    | High   |
| 6   | Port RiskGauge tests from `RiskScore.test.tsx` (22 tests)                                              | ✅ Done | Low    | High   |
| 7   | Add tests for overlay components (Dialog, Popover, Sheet, DropdownMenu)                                | ✅ Done | High   | High   |
| 8   | Add tests for form components (Select, Slider, RadioGroup, Switch)                                     | ✅ Done | High   | High   |
| 9   | Add tests for missing hooks (useKeyboardShortcut, useIntersectionObserver, useWindowSize, usePrevious) | ✅ Done | Medium | Medium |
| 10  | Add visual regression tests via Storybook (Chromatic integration)                                      | ✅ Done | Medium | High   |

### 🟡 MEDIUM - Missing Components (Items 11-20)

| #   | Item                                                                   | Status  | Effort | Impact |
| --- | ---------------------------------------------------------------------- | ------- | ------ | ------ |
| 11  | Create `OrderBook` component from main app (260 lines, trading core)   | ✅ Done | High   | High   |
| 12  | Create `DepthChart` component for bid/ask visualization                | ✅ Done | High   | High   |
| 13  | Create `Autocomplete` / `Combobox` component (search with suggestions) | ✅ Done | High   | High   |
| 14  | Create `PasswordInput` with visibility toggle                          | ✅ Done | Low    | Medium |
| 15  | Create `SearchInput` with clear button and loading state               | ✅ Done | Low    | Medium |
| 16  | Create `CurrencyInput` with formatting (trading-critical)              | ✅ Done | Medium | High   |
| 17  | Create `TagInput` for multi-value selection                            | ✅ Done | Medium | Medium |
| 18  | Create `DatePicker` composite component                                | ✅ Done | High   | Medium |
| 19  | Create `Stepper` for multi-step forms/wizards                          | ✅ Done | Medium | Medium |
| 20  | Create `ScrollingTicker` from BottomTickerBar pattern                  | ✅ Done | Medium | Medium |

### 🟢 MEDIUM - Theming & Design Tokens (Items 21-23)

| #   | Item                                                                 | Status  | Effort | Impact |
| --- | -------------------------------------------------------------------- | ------- | ------ | ------ |
| 21  | Add trading semantic color tokens (long/short, bid/ask, profit/loss) | ✅ Done | Low    | High   |
| 22  | Add component theming for Badge, Toast, Alert, Table                 | ✅ Done | Medium | Medium |
| 23  | Create CSS custom property fallbacks for older browsers              | ✅ Done | Low    | Low    |

### 🔵 MEDIUM - Performance (Items 24-26)

| #   | Item                                                             | Status  | Effort | Impact |
| --- | ---------------------------------------------------------------- | ------- | ------ | ------ |
| 24  | Lazy load recharts in Chart component (~400KB savings)           | ✅ Done | Medium | High   |
| 25  | Tree-shake lucide-react icons (~100KB savings)                   | ✅ Done | Low    | Medium |
| 26  | Add `sideEffects: false` to package.json for better tree-shaking | ✅ Done | Low    | Medium |

### ⚪ LOWER - Documentation & DX (Items 27-30)

| #   | Item                                                                                  | Status  | Effort | Impact |
| --- | ------------------------------------------------------------------------------------- | ------- | ------ | ------ |
| 27  | Add Storybook stories for 25 missing components                                       | ✅ Done | High   | Medium |
| 28  | Export all component prop types (InputProps, SliderProps, etc.)                       | ✅ Done | Medium | Medium |
| 29  | Add JSDoc with `@example` code snippets to all components                             | ✅ Done | High   | Medium |
| 30  | Add exit animations (FadeOut), layout animations (list reordering), number animations | ✅ Done | Medium | Medium |

---

## 📊 Progress Summary

- **Completed:** 30/30 (100%) ✅
- **In Progress:** 0/30
- **Todo:** 0/30

### ✅ Sprint 5 Completed (Feb 2, 2026) - FINAL SPRINT

| #   | Item                  | Files Created                                                                                            |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| 10  | Chromatic Integration | `chromatic.config.json`, `.github/workflows/chromatic.yml`, package.json scripts                         |
| 11  | OrderBook Component   | `order-book.tsx` (~320 lines), `order-book.test.tsx` (16 tests), `order-book.stories.tsx` (6 stories)    |
| 12  | DepthChart Component  | `depth-chart.tsx` (~350 lines), `depth-chart.test.tsx` (15 tests), `depth-chart.stories.tsx` (8 stories) |
| 18  | DatePicker Component  | `date-picker.tsx` (~290 lines), `date-picker.test.tsx` (15 tests), `date-picker.stories.tsx` (9 stories) |
| 23  | CSS Fallbacks         | `css-fallbacks.ts` (~220 lines), `css-fallbacks.test.ts` (25 tests)                                      |
| 24  | LazyChart Component   | `lazy-chart.tsx` (~180 lines), `lazy-chart.stories.tsx` (8 stories)                                      |
| 27  | Storybook Stories     | 10+ new story files with 60+ stories (OrderBook, DepthChart, DatePicker, LazyChart, Autocomplete, etc.)  |
| 29  | JSDoc Examples        | Added to all new components with @example code snippets                                                  |
