# SKAI-UI Asset Audit

> Generated: February 1, 2026
> Last Updated: February 1, 2026
> Purpose: Track legacy, unused, and dead assets for cleanup

## Summary

### ✅ Completed Actions

| Action                     | Status  | Details                                      |
| -------------------------- | ------- | -------------------------------------------- |
| Fixed `assets.ts`          | ✅ Done | Removed 50+ references to non-existent files |
| Deleted unused game assets | ✅ Done | Removed darts.png, dice.png                  |
| Added PerpTrading story    | ✅ Done | Full 3-panel layout with AI widgets          |

### ✅ Assets In Use (Keep)

#### skai-ui/public/assets/

| Category          | File                | Status    | Used By          |
| ----------------- | ------------------- | --------- | ---------------- |
| **logo**          | skai-logo-full.svg  | ✅ Active | Header, About    |
| **logo**          | skai-logo-mark.svg  | ✅ Active | Favicon, icons   |
| **logo**          | skai-logo-white.svg | ✅ Active | Dark backgrounds |
| **logo**          | skai-logo-dark.svg  | ✅ Active | Light mode       |
| **chains**        | ethereum.svg        | ✅ Active | Chain selector   |
| **chains**        | base.svg            | ✅ Active | Chain selector   |
| **chains**        | polygon.svg         | ✅ Active | Chain selector   |
| **chains**        | arbitrum.svg        | ✅ Active | Chain selector   |
| **chains**        | optimism.svg        | ✅ Active | Chain selector   |
| **tokens**        | eth.svg             | ✅ Active | Token displays   |
| **tokens**        | btc.svg             | ✅ Active | Token displays   |
| **tokens**        | usdc.svg            | ✅ Active | Token displays   |
| **tokens**        | usdt.svg            | ✅ Active | Token displays   |
| **tokens**        | skai.svg            | ✅ Active | SKAI token       |
| **tokens**        | unknown.svg         | ✅ Active | Fallback         |
| **wallets**       | metamask.svg        | ✅ Active | Wallet selector  |
| **wallets**       | coinbase.svg        | ✅ Active | Wallet selector  |
| **wallets**       | rainbow.svg         | ✅ Active | Wallet selector  |
| **wallets**       | walletconnect.svg   | ✅ Active | Wallet selector  |
| **illustrations** | empty.svg           | ✅ Active | Empty states     |
| **illustrations** | error.svg           | ✅ Active | Error states     |
| **illustrations** | success.svg         | ✅ Active | Success states   |
| **illustrations** | trading.svg         | ✅ Active | Trading pages    |
| **illustrations** | hero.svg            | ✅ Active | Landing page     |
| **backgrounds**   | gradient-1.svg      | ✅ Active | Backgrounds      |
| **backgrounds**   | pattern-1.svg       | ✅ Active | Backgrounds      |

### ~~❌ Assets Referenced But Missing~~ (FIXED)

> **RESOLVED**: All missing asset references have been removed from `src/lib/assets.ts`.
> The library now only exports assets that actually exist in the filesystem.
> Icons, social badges, and extra illustrations should use Lucide icons or inline SVGs.

### 🗑️ Main App Assets (public/) - Audit

#### Active Game Assets (Keep)

| File                            | Used By                             |
| ------------------------------- | ----------------------------------- |
| /assets/games/hilo.png          | Play.tsx, continuePlayingService.ts |
| /assets/games/crash.png         | Play.tsx, continuePlayingService.ts |
| /assets/games/coin-flip.png     | Play.tsx, continuePlayingService.ts |
| /assets/games/mines.png         | Play.tsx, continuePlayingService.ts |
| /assets/games/plinko.png        | Play.tsx, continuePlayingService.ts |
| /assets/games/chicken.png       | Play.tsx, continuePlayingService.ts |
| /assets/games/blackjack.png     | Play.tsx, continuePlayingService.ts |
| /assets/games/slots.png         | Play.tsx, continuePlayingService.ts |
| /assets/games/gems.png          | Play.tsx, continuePlayingService.ts |
| /assets/games/mega-slots.png    | Play.tsx, continuePlayingService.ts |
| /assets/games/towers.png        | Play.tsx, continuePlayingService.ts |
| /assets/games/fortune-wheel.png | Play.tsx, continuePlayingService.ts |
| /assets/games/roulette.png      | Play.tsx, continuePlayingService.ts |
| /assets/games/scratchers.png    | Play.tsx, continuePlayingService.ts |
| /assets/games/safari-slots.svg  | Play.tsx, continuePlayingService.ts |
| /assets/games/skai-cross.svg    | Play.tsx, continuePlayingService.ts |
| /assets/games/skai-quest.png    | Play.tsx, continuePlayingService.ts |
| /assets/games/cosmic-slots.png  | Play.tsx                            |
| /assets/games/coming-soon.png   | Play.tsx (placeholder)              |

#### ~~Unused Game Assets~~ (DELETED)

| File                        | Status                                            |
| --------------------------- | ------------------------------------------------- |
| ~~/assets/games/darts.png~~ | ✅ DELETED - no references                        |
| ~~/assets/games/dice.png~~  | ✅ DELETED - no references                        |
| /assets/games/poker.png     | ⚠️ Only in Play.tsx casino section (keep for now) |

#### UI Container Assets (Keep - Used by Cosmic Slots)

| File                                                     | Used By             |
| -------------------------------------------------------- | ------------------- |
| /assets/ui/3d_style/container_3d.png                     | cosmic-slots-phaser |
| /assets/ui/3d_style/container_3d_clickable.png           | cosmic-slots-phaser |
| /assets/ui/3d_style/container_3d_slot.png                | cosmic-slots-phaser |
| /assets/ui/3d_style/container_3d_progress_fill.png       | cosmic-slots-phaser |
| /assets/ui/pixel_style/container_pixel.png               | cosmic-slots-phaser |
| /assets/ui/pixel_style/container_pixel_clickable.png     | cosmic-slots-phaser |
| /assets/ui/pixel_style/container_pixel_slot.png          | cosmic-slots-phaser |
| /assets/ui/pixel_style/container_pixel_progress_fill.png | cosmic-slots-phaser |

#### Active Root Assets (Keep)

| File                  | Used By                 |
| --------------------- | ----------------------- |
| /wordmark.png         | Header.tsx, PWAGate.tsx |
| /logo.png             | Manifest, PWA           |
| /logo.svg             | Various                 |
| /favicon.png          | Browser tab             |
| /apple-touch-icon.png | iOS                     |
| /og-image.jpg         | Social sharing          |
| /skai-logo.png        | Fallback                |
| /icons/\*.png         | PWA icons               |
| /splash/\*.png        | PWA splash              |

---

## Figma Design System Sections

From Figma file `TyX8YAtNDEIvsnSLQ3IXId` (Skai-Design), canvas "🧩 Design System":

| Section           | Node ID  | Status     | skai-ui Implementation                         |
| ----------------- | -------- | ---------- | ---------------------------------------------- |
| **Badges**        | 253:58   | ⚠️ Partial | `tier-badge.tsx` exists, badges assets missing |
| **System assets** | 695:397  | ✅ Covered | Design tokens, footer                          |
| **Colours**       | 691:87   | ✅ Covered | `design-tokens.ts`, CSS variables              |
| **CTA (Buttons)** | 779:57   | ✅ Covered | `button.tsx` with variants                     |
| **Input**         | 801:1386 | ✅ Covered | `input.tsx`, `search-input.tsx`                |
| **Labels**        | 786:65   | ✅ Covered | `badge.tsx`, `label.tsx`                       |
| **Grid**          | 775:860  | ✅ Covered | Tailwind config, spacing tokens                |
| **Icons**         | 777:1309 | ⚠️ Partial | Using Lucide, missing SKAI icons               |
| **Typography**    | 774:744  | ✅ Covered | Tailwind fonts, design tokens                  |

---

## PageTemplates Storybook Gap Analysis

### Current Stories

1. ✅ **HomePage** - Matches Index.tsx reasonably well
2. ✅ **SwapPage** - Matches SwapNew.tsx
3. ✅ **PerpTradingPage** - ✅ ADDED - Full 3-panel layout with AI widgets
4. ✅ **PredictPage** - Matches prediction pages
5. ✅ **AccountPage** - Matches account pages
6. ✅ **MobileLayout** - Documents mobile navigation

### Missing Stories (Could Add Later)

1. ⚠️ **Play/Games** - Gaming section with cards and slots
2. ⚠️ **Social/Messages** - Messaging UI with online indicators
3. ⚠️ **AIAgent** - AI copilot interface
4. ⚠️ **Earn** - Staking and DeFi sections

---

## Recommended Actions

### ✅ Completed (High Priority)

1. [x] Fix `assets.ts` - removed references to missing files
2. [x] Add missing PerpTrading PageTemplate story
3. [x] Delete unused game assets: darts.png, dice.png

### Short-term (Medium Priority)

1. [ ] Create badge SVGs from Figma or refactor to use TierBadge component
2. [ ] Add social icon SVGs or standardize on inline SVGs
3. [ ] Create missing illustration SVGs (portfolio, games, ai, onboarding)

### Long-term (Low Priority)

1. [ ] Full Figma icon export and comparison
2. [ ] Automated asset usage detection in CI
3. [ ] Asset CDN/optimization strategy

---

## Asset Path Mapping

### skai-ui Assets (relative to package root)

```
modules/skai-ui/public/assets/
├── backgrounds/
│   ├── gradient-1.svg
│   └── pattern-1.svg
├── chains/
│   ├── arbitrum.svg
│   ├── base.svg
│   ├── ethereum.svg
│   ├── optimism.svg
│   └── polygon.svg
├── icons/
│   └── (empty - use Lucide)
├── illustrations/
│   ├── empty.svg
│   ├── error.svg
│   ├── hero.svg
│   ├── success.svg
│   └── trading.svg
├── logo/
│   ├── skai-logo-dark.svg
│   ├── skai-logo-full.svg
│   ├── skai-logo-mark.svg
│   └── skai-logo-white.svg
├── tokens/
│   ├── btc.svg
│   ├── eth.svg
│   ├── skai.svg
│   ├── unknown.svg
│   ├── usdc.svg
│   └── usdt.svg
└── wallets/
    ├── coinbase.svg
    ├── metamask.svg
    ├── rainbow.svg
    └── walletconnect.svg
```

### Main App Assets (relative to public/)

```
public/
├── assets/
│   ├── games/  (23 files)
│   └── ui/
│       ├── 3d_style/  (4 files)
│       └── pixel_style/  (4 files)
├── icons/  (10 PWA icons)
├── splash/  (1 file)
└── [root images: favicon, logo, wordmark, og-image]
```
