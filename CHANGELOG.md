# SKAI-UI Changelog

All notable changes to the design system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.1] - 2026-02-01

### Added

- **Toast System** - Complete toast notification system with variants (default, destructive, success, warning)
- **Resizable Panels** - Layout component for split-pane interfaces and trading dashboards
- **Online Indicator** - Status dot component for chat and social features
- **Fee Display** - Trading fee breakdown component with tier information
- **Dock Icon** - macOS-style dock with magnification effect for navigation
- **Particle Background** - Animated canvas background for hero sections
- **Chart Components** - Recharts wrapper with SKAI styling

### Added Stories

- `fee-display.stories.tsx` - Fee display variants and comparisons
- `online-indicator.stories.tsx` - Status indicator sizes and contexts
- `particle-background.stories.tsx` - Theme variations (cyan, purple, teal)
- `dock-icon.stories.tsx` - Navigation dock patterns
- `resizable.stories.tsx` - Trading layouts and panel configurations
- `toast.stories.tsx` - All toast variants and trading-specific toasts

### Documentation

- `DESIGNERS_GUIDE.md` - Comprehensive guide for frontend designers
- `CHANGELOG.md` - This file for tracking design changes

## [0.1.0] - 2026-01-15

### Initial Release

#### Core Components

- Button, Card, Input, Label, Textarea
- Badge, Alert, AlertDialog
- Progress, Skeleton, Tooltip
- Checkbox, RadioGroup, Select, Slider, Switch, Toggle
- Dialog, Sheet, Popover, DropdownMenu, ContextMenu
- Tabs, Table, Avatar, Calendar
- Separator, ScrollArea, Accordion, Collapsible

#### Trading Components

- TokenIcon - Display token logos with fallback
- PriceDisplay - Format and display crypto prices
- AmountInput - Token amount input with max button
- SwapInput - Complete swap input with token select
- TokenSelect - Searchable token selector
- LoadingButton - Button with loading state
- CopyButton - One-click copy to clipboard
- WalletAddress - Truncated wallet display with copy
- StatCard - Statistics display card
- ConfirmDialog - Confirmation dialogs for actions

#### Design System

- Theme configuration (`theme-config.ts`)
- Design tokens (JSON format for Figma sync)
- Content system (`content.ts`)
- Asset system (`assets.ts`)
- Animation library (`animations.tsx`)
- Accessibility utilities (`accessibility.tsx`)
- Layout primitives (`layout.tsx`)

#### Storybook

- 40+ component stories
- Page templates and mockups
- Design token documentation
- Responsive design testing
- Accessibility guidelines

---

## Guidelines for Updating

When making changes, add an entry under the appropriate section:

### Added

New features or components

### Changed

Changes to existing functionality

### Deprecated

Features that will be removed in future versions

### Removed

Features that were removed

### Fixed

Bug fixes

### Security

Security-related changes

---

## Versioning

- **MAJOR** (1.0.0) - Breaking changes to component APIs
- **MINOR** (0.1.0) - New components or features
- **PATCH** (0.0.1) - Bug fixes and minor improvements
