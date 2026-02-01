# SKAI-UI Component Backlog

> **Last Updated:** 2026-02-01
> **Total Components:** 30 planned enhancements
> **Status Legend:** ✅ Done | 🔄 In Progress | ⏳ Planned | ❌ Blocked

---

## 📊 Progress Overview

| Category           | Total  | Done  | In Progress | Planned |
| ------------------ | ------ | ----- | ----------- | ------- |
| Missing Core       | 5      | 4     | 0           | 1       |
| Trading-Specific   | 8      | 4     | 0           | 4       |
| Data Visualization | 5      | 0     | 0           | 5       |
| Enhanced Tables    | 4      | 0     | 0           | 4       |
| UX Improvements    | 5      | 0     | 0           | 5       |
| Accessibility      | 3      | 0     | 0           | 3       |
| **TOTAL**          | **30** | **8** | **0**       | **22**  |

---

## ✅ Sprint 1 - COMPLETE (8 components)

### Missing Core Components

| #   | Component          | Status | Priority | Reference     | Notes                             |
| --- | ------------------ | ------ | -------- | ------------- | --------------------------------- |
| 1   | **Carousel**       | ✅     | High     | shadcn/embla  | Token showcases, NFT galleries    |
| 2   | **Sonner Toast**   | ✅     | High     | shadcn/sonner | Promise states, modern animations |
| 3   | **Tour/Spotlight** | ✅     | Medium   | Ant Design    | Onboarding guide for new users    |
| 4   | **QRCode**         | ✅     | Medium   | Ant Design    | Wallet address sharing            |

### Trading-Specific Components

| #   | Component              | Status | Priority | Reference    | Notes                        |
| --- | ---------------------- | ------ | -------- | ------------ | ---------------------------- |
| 5   | **Masonry**            | ✅     | Low      | Ant Design   | NFT/token gallery layouts    |
| 6   | **CandlestickChart**   | ✅     | Critical | TradingView  | OHLC with zoom, crosshair    |
| 7   | **FundingRateDisplay** | ✅     | Critical | Hyperliquid  | Perps funding with countdown |
| 8   | **LiquidationWarning** | ✅     | Critical | Exchange std | Position risk alerts         |

---

## 📋 Backlog - Trading Components

| #   | Component               | Status | Priority | Description                               |
| --- | ----------------------- | ------ | -------- | ----------------------------------------- |
| 9   | **OrderTypeSelector**   | ⏳     | High     | Market/Limit/Stop-Loss/Take-Profit toggle |
| 10  | **PositionCard**        | ⏳     | High     | Open position with PnL, leverage, prices  |
| 11  | **TradingPairSelector** | ⏳     | High     | Search + recent pairs + favorites         |
| 12  | **MarketStats**         | ⏳     | Medium   | 24h volume, high, low, change             |
| 13  | **SlippageSelector**    | ⏳     | Medium   | Visual slippage tolerance picker          |

---

## 📋 Backlog - Data Visualization

| #   | Component         | Status | Priority | Description                               |
| --- | ----------------- | ------ | -------- | ----------------------------------------- |
| 14  | **Sparkline**     | ⏳     | High     | Inline mini chart for price trends        |
| 15  | **Heatmap**       | ⏳     | Medium   | Token correlation, activity visualization |
| 16  | **TreeMap**       | ⏳     | Medium   | Portfolio allocation visualization        |
| 17  | **AreaBumpChart** | ⏳     | Low      | Ranking changes over time                 |
| 18  | **RadialGauge**   | ⏳     | Medium   | Portfolio health, risk score              |

---

## 📋 Backlog - Enhanced Tables

| #   | Component           | Status | Priority | Description                              |
| --- | ------------------- | ------ | -------- | ---------------------------------------- |
| 19  | **DataTable**       | ⏳     | High     | TanStack-powered with sorting, filtering |
| 20  | **VirtualizedList** | ⏳     | High     | 10k+ row performance                     |
| 21  | **ColumnResizer**   | ⏳     | Medium   | Draggable column widths                  |
| 22  | **RowExpander**     | ⏳     | Medium   | Expandable rows for details              |

---

## 📋 Backlog - UX Improvements

| #   | Component                | Status | Priority | Description                   |
| --- | ------------------------ | ------ | -------- | ----------------------------- |
| 23  | **CommandPalette**       | ⏳     | High     | Cmd+K global search           |
| 24  | **FloatingActionButton** | ⏳     | Medium   | Quick actions (swap, deposit) |
| 25  | **Affix/StickyHeader**   | ⏳     | Medium   | Sticky scroll elements        |
| 26  | **ConfettiEffect**       | ⏳     | Low      | Celebration animations        |
| 27  | **Watermark**            | ⏳     | Low      | Security watermark            |

---

## 📋 Backlog - Accessibility & Advanced

| #   | Component             | Status | Priority | Description               |
| --- | --------------------- | ------ | -------- | ------------------------- |
| 28  | **KeyboardShortcuts** | ⏳     | Medium   | Hotkey bindings display   |
| 29  | **ColorModePicker**   | ⏳     | Low      | Theme color customization |
| 30  | **RTLSupport**        | ⏳     | Low      | Right-to-left utilities   |

---

## 🏗️ Implementation Notes

### Component Structure

```
modules/skai-ui/src/components/
├── carousel.tsx           # Sprint 1
├── sonner.tsx             # Sprint 1
├── tour.tsx               # Sprint 1
├── qr-code.tsx            # Sprint 1
├── masonry.tsx            # Sprint 1
├── candlestick-chart.tsx  # Sprint 1
├── funding-rate.tsx       # Sprint 1
├── liquidation-warning.tsx # Sprint 1
└── ...
```

### Dependencies to Add

- `embla-carousel-react` - Carousel
- `sonner` - Toast notifications
- `qrcode.react` - QR code generation
- `lightweight-charts` - TradingView candlestick

### Testing Requirements

- [ ] Unit tests for each component
- [ ] Storybook stories with all variants
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile responsiveness check

---

## 📅 Sprint Schedule

| Sprint   | Components                    | Target     |
| -------- | ----------------------------- | ---------- |
| Sprint 1 | 1-8 (Core + Trading Critical) | 2026-02-01 |
| Sprint 2 | 9-13 (Trading)                | 2026-02-08 |
| Sprint 3 | 14-18 (Visualization)         | 2026-02-15 |
| Sprint 4 | 19-22 (Tables)                | 2026-02-22 |
| Sprint 5 | 23-30 (UX + A11y)             | 2026-03-01 |

---

## 🔗 References

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Ant Design Components](https://ant.design/components/overview)
- [Mantine UI](https://mantine.dev/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Nivo Charts](https://nivo.rocks/components/)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
