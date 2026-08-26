import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// SKAI ICON SYSTEM - Complete Icon Library
// =============================================================================
// Categories: Navigation, Actions, Trading, Social, System, Crypto, Wallets, Tiers
// Sizes: xs (10px), sm (16px), md (24px), lg (48px)
// =============================================================================

export type SkaiIconName =
  // Navigation
  | "home"
  | "menu"
  | "close"
  | "back"
  | "forward"
  | "enter"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "chevron-up"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "external-link"
  | "refresh"
  // Actions
  | "plus"
  | "minus"
  | "check"
  | "check-enclosed"
  | "copy"
  | "edit"
  | "delete"
  | "trash"
  | "download"
  | "upload"
  | "share"
  | "save"
  | "filter"
  | "sort"
  | "expand"
  | "collapse"
  // Trading & Charts
  | "chart"
  | "chart-line"
  | "chart-bar"
  | "chart-candle"
  | "swap"
  | "order"
  | "limit"
  | "market"
  | "trending-up"
  | "trending-down"
  | "percentage"
  // Crypto
  | "wallet"
  | "blockchain"
  | "gas"
  | "bridge"
  | "stake"
  | "unstake"
  | "token"
  | "nft"
  | "airdrop"
  // Social
  | "user"
  | "users"
  | "message"
  | "notification"
  | "bell"
  | "heart"
  | "heart-filled"
  | "star"
  | "star-filled"
  | "bookmark"
  | "bookmark-filled"
  // System
  | "settings"
  | "search"
  | "lock"
  | "unlock"
  | "eye"
  | "eye-off"
  | "info"
  | "warning"
  | "error"
  | "success"
  | "help"
  | "dot"
  | "loading"
  | "spinner"
  // Misc
  | "hot"
  | "fire"
  | "lightning"
  | "clock"
  | "calendar"
  | "link"
  | "qr-code"
  | "moon"
  | "sun"
  | "globe"
  | "code"
  // Wallet provider icons
  | "metamask"
  | "coinbase"
  | "phantom"
  | "walletconnect"
  | "rainbow"
  // Social icons (from Figma design system)
  | "discord"
  | "instagram"
  | "x"
  | "twitter"
  | "telegram"
  // Platform icons (from Figma design system)
  | "ai"
  | "games"
  | "skai-ai"
  | "chat"
  | "vault"
  | "ether"
  | "skai"
  | "signal"
  | "agent"
  | "information"
  | "candlesticks"
  // Graphical / Trading tools (from Figma design system)
  | "zoom-in"
  | "crosshair"
  | "trendline"
  | "fib-retracement"
  | "reward"
  | "xabcd-pattern"
  | "long-position"
  | "brush"
  | "text"
  | "magnet"
  | "measure"
  | "secure"
  | "fast"
  // Trade-nav glyphs (Figma `icons/graphical`, ring-enclosed)
  | "trade-perps"
  | "trade-spot"
  | "trade-swaps"
  | "trade-trench"
  | "trade-launch"
  // Social-nav glyphs (Figma `icons/graphical`, ring-enclosed)
  | "social-discover"
  | "social-live"
  | "social-groups"
  // Play-nav glyphs (Figma `icons/graphical`, ring-enclosed)
  | "play-casino"
  | "play-sportsbook"
  // Brand icons
  | "google"
  | "apple"
  // Tier icons
  | "tier-free"
  | "tier-bronze"
  | "tier-silver"
  | "tier-gold"
  | "tier-platinum"
  | "tier-diamond"
  | "tier-legend";

export type SkaiIconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface SkaiIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon name from the SKAI design system */
  name: SkaiIconName;
  /** Size preset from Figma: xs (10px), sm (16px), md (24px), lg (48px), xl (40px tier celebration), 2xl (90px modal centerpiece) */
  size?: SkaiIconSize;
  /** Custom color (defaults to currentColor) */
  color?: string;
}

const sizeMap: Record<SkaiIconSize, number> = {
  xs: 10,
  sm: 16,
  md: 24,
  lg: 48,
  xl: 40, // tier-upgrade summary glyph (Figma node 6014:84835)
  "2xl": 90, // tier-upgrade welcome-modal centerpiece (Figma node 2992:19212)
};

/**
 * Tier-badge geometry, transcribed from the Figma `icons/tiers` component set
 * (6014:72726-72731) rather than approximated by hand — reports 7e5be04a
 * (Bronze), d7213cb1 (Silver), 6aad9c99 (Gold), 23da23f7 (Platinum), 8924f60b
 * (Diamond), fd496624 (Legend), all "plan icon does not match Figma".
 *
 * The export draws a 48px frame holding a 36px `enclosure` disc at (6,6) and a
 * glyph in a 22px slot at (13,13). This registry's viewBox is 24x24, so every
 * measurement is halved: the disc becomes r=8.625 at (12,12) with a 0.75 stroke,
 * and each glyph keeps its EXACT exported path data inside a
 * `translate(...) scale(0.5)` group. Re-deriving path coordinates by hand is
 * what produced the badges these reports were filed against; the transform
 * wrapper means the vectors below are the shipped Figma bytes, unmodified.
 */
const TIER_ENCLOSURE = {
  cx: 12,
  cy: 12,
  r: 8.625,
  strokeWidth: 0.75,
} as const;

/**
 * Bronze and Gold share one five-point star (Figma exports byte-identical
 * geometry for both, differing only in fill). Silver's is a separate path —
 * it is stroked as well as filled, so it sits marginally heavier.
 */
const TIER_STAR_FILLED_D =
  "M8.70868 0.496701C9.09441 -0.165566 10.0512 -0.165568 10.4369 0.4967L12.9071 4.73777C13.0484 4.98037 13.2852 5.1524 13.5596 5.21182L18.3564 6.25056C19.1055 6.41276 19.4011 7.32269 18.8905 7.8942L15.6203 11.5541C15.4332 11.7634 15.3428 12.0418 15.3711 12.3211L15.8655 17.2041C15.9427 17.9667 15.1687 18.529 14.4673 18.22L9.97604 16.2408C9.71913 16.1276 9.42646 16.1276 9.16954 16.2408L4.67827 18.22C3.97693 18.529 3.2029 17.9667 3.2801 17.2041L3.77451 12.3211C3.80279 12.0418 3.71235 11.7634 3.52529 11.5541L0.255122 7.8942C-0.255532 7.32269 0.0401192 6.41276 0.789172 6.25056L5.58601 5.21182C5.8604 5.1524 6.09717 4.98037 6.23848 4.73777L8.70868 0.496701Z";

// SVG path data for each icon
const iconPaths: Record<SkaiIconName, React.ReactNode> = {
  close: (
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  hot: (
    <path
      d="M12 2c0 4-4 6-4 10a6 6 0 1012 0c0-4-4-6-4-10a4 4 0 01-4 0z"
      fill="currentColor"
    />
  ),
  fire: (
    <path
      d="M12 2c0 4-4 6-4 10a6 6 0 1012 0c0-4-4-6-4-10a4 4 0 01-4 0z"
      fill="currentColor"
    />
  ),
  enter: (
    <path
      d="M9 10l3 3m0 0l3-3m-3 3V3m7 8v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  back: (
    <path
      d="M19 12H5m0 0l7 7m-7-7l7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  forward: (
    <path
      d="M5 12h14m0 0l-7-7m7 7l-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: (
    <path
      d="M5 12l5 5L20 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "check-enclosed": (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 12l3 3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  copy: (
    <path
      d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2M8 4v12a2 2 0 002 2h8a2 2 0 002-2V8l-6-4H8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  dot: <circle cx="12" cy="12" r="4" fill="currentColor" />,
  loading: (
    <path
      d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-spin origin-center"
    />
  ),
  "arrow-up": (
    <path
      d="M12 19V5m0 0l-7 7m7-7l7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "arrow-down": (
    <path
      d="M12 5v14m0 0l7-7m-7 7l-7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chevron-left": (
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chevron-right": (
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chevron-up": (
    <path
      d="M18 15l-6-6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chevron-down": (
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  plus: (
    <path
      d="M12 5v14m-7-7h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  minus: (
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  search: (
    <path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  settings: (
    <path
      d="M12 15a3 3 0 100-6 3 3 0 000 6zm0 0v6m0-18v6m6.93 2.07l-1.41 1.42M6.34 17.66l-1.41 1.42m12.14 0l-1.41-1.42M6.34 6.34L4.93 4.93"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  menu: (
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "external-link": (
    <path
      d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  wallet: (
    <path
      d="M19 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2M21 12h-6a2 2 0 010-4h6a2 2 0 010 4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  swap: (
    <path
      d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  chart: (
    <path
      d="M3 3v18h18M7 16l4-4 4 4 5-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // NEW ICONS - Navigation
  // =============================================================================
  home: (
    <path
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "arrow-left": (
    <path
      d="M19 12H5m0 0l7-7m-7 7l7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "arrow-right": (
    <path
      d="M5 12h14m0 0l-7-7m7 7l-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  refresh: (
    <path
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // NEW ICONS - Actions
  // =============================================================================
  edit: (
    <path
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  delete: (
    <path
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  trash: (
    <path
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  download: (
    <path
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  upload: (
    <path
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  share: (
    <path
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  save: (
    <path
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  filter: (
    <path
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  sort: (
    <path
      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  expand: (
    <path
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  collapse: (
    <path
      d="M9 9V5m0 4H5m4 0l-5-5m16 9v4m0-4h4m-4 0l5 5M9 15v4m0-4H5m4 0l-5 5m16-5v-4m0 4h4m-4 0l5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // NEW ICONS - Trading
  // =============================================================================
  "chart-line": (
    <path
      d="M7 12l3-3 4 4 3-3M21 21H3V3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chart-bar": (
    <path
      d="M9 19V6M5 19v-3m8 3V9m4 10v-5m4 5V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chart-candle": (
    <>
      <path
        d="M9 5v14M9 8h3v8H9V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 3v18M15 6h3v12h-3V6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  order: (
    <path
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  limit: (
    <path
      d="M4 4v16h16M8 16l4-8 4 8M8 12h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  market: (
    <path
      d="M3 3v18h18M9 17V9m4 8V5m4 12v-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "trending-up": (
    <path
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "trending-down": (
    <path
      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  percentage: (
    <path
      d="M9 9h.01M15 15h.01M16 8l-8 8M9.5 9a.5.5 0 11-1 0 .5.5 0 011 0zm6 6a.5.5 0 11-1 0 .5.5 0 011 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // NEW ICONS - Crypto
  // =============================================================================
  blockchain: (
    <path
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  gas: (
    <path
      d="M13 10V3L4 14h7v7l9-11h-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bridge: (
    <path
      d="M3 12h18m-9-9v18M6 6l6 6-6 6m12-12l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  stake: (
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  unstake: (
    <path
      d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  token: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 6v12M8 10h8M8 14h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  nft: (
    <path
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  airdrop: (
    <path
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // NEW ICONS - Social
  // =============================================================================
  user: (
    <path
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  users: (
    <path
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  message: (
    <path
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  notification: (
    <path
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bell: (
    <path
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "heart-filled": (
    <path
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "star-filled": (
    <path
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bookmark: (
    <path
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "bookmark-filled": (
    <path
      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // NEW ICONS - System
  // =============================================================================
  lock: (
    <path
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  unlock: (
    <path
      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  eye: (
    <path
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "eye-off": (
    <path
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 16v-4m0-4h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  warning: (
    <path
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 9l-6 6m0-6l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 12l3 3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  spinner: (
    <path
      d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-spin origin-center"
    />
  ),
  // =============================================================================
  // NEW ICONS - Misc
  // =============================================================================
  lightning: (
    <path
      d="M13 10V3L4 14h7v7l9-11h-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  calendar: (
    <path
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  link: (
    <path
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "qr-code": (
    <path
      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  moon: (
    <path
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  sun: (
    <path
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  globe: (
    <path
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  code: (
    <path
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // =============================================================================
  // PLATFORM ICONS (from Figma design system)
  // =============================================================================
  ai: (
    <g transform="translate(2.15, 2.15) scale(1.59)">
      <path
        d="M5.55875 0.415032C5.81701 -0.138344 6.60389 -0.138344 6.86215 0.415032L8.38828 3.68507C8.45972 3.83814 8.58276 3.96118 8.73583 4.03262L12.0059 5.55875C12.5592 5.81701 12.5592 6.60389 12.0059 6.86215L8.73583 8.38828C8.58276 8.45972 8.45972 8.58276 8.38828 8.73583L6.86215 12.0059C6.60389 12.5592 5.81701 12.5592 5.55875 12.0059L4.03262 8.73583C3.96118 8.58276 3.83814 8.45972 3.68507 8.38828L0.415032 6.86215C-0.138344 6.60389 -0.138344 5.81701 0.415032 5.55875L3.68507 4.03262C3.83814 3.96118 3.96118 3.83814 4.03262 3.68507L5.55875 0.415032Z"
        fill="currentColor"
      />
    </g>
  ),
  games: (
    <>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  "skai-ai": (
    <g transform="translate(2, 2.77) scale(1.538)">
      <path
        d="M8.81489 4.20703C9.08479 4.20704 9.34331 4.31463 9.53462 4.50586L10.7055 5.67578V5.67773C10.887 5.85923 10.8872 6.15369 10.7065 6.33594L5.42036 11.6533C5.19955 11.8748 4.89939 12 4.58638 12H2.29536C2.17386 11.9998 2.10759 11.8566 2.18599 11.7637L6.89009 6.15527C7.04104 5.97464 6.91303 5.70052 6.67817 5.7002H5.36372C5.23648 5.6996 5.17353 5.54492 5.26314 5.45508L6.40962 4.30859C6.47451 4.2437 6.56345 4.2072 6.65474 4.20703H8.81489ZM8.54634 0C8.66785 0.000299409 8.73428 0.143409 8.65571 0.236328L3.95161 5.84277C3.80083 6.02344 3.92963 6.29762 4.1645 6.29785H5.47798C5.60567 6.29791 5.66932 6.45297 5.57954 6.54297L4.4311 7.69043C4.3661 7.75523 4.27732 7.79102 4.18599 7.79102H2.02681C1.75694 7.79094 1.49736 7.68442 1.3061 7.49316L0.136182 6.32227C-0.0451202 6.14081 -0.0453415 5.84628 0.135206 5.66406L5.42134 0.34668C5.64204 0.125222 5.94145 0.000134329 6.25435 0H8.54634ZM10.7905 0.133789C10.8736 -0.0444188 11.1272 -0.0444188 11.2104 0.133789L11.7016 1.18652C11.7246 1.23571 11.7638 1.2758 11.8129 1.29883L12.8667 1.79004C13.0447 1.87324 13.0447 2.12676 12.8667 2.20996L11.8129 2.70117C11.7638 2.7242 11.7246 2.76429 11.7016 2.81348L11.2104 3.86621C11.1272 4.04442 10.8736 4.04442 10.7905 3.86621L10.2993 2.81348C10.2763 2.76418 10.2363 2.72418 10.187 2.70117L9.13423 2.20996C8.95602 2.12679 8.95602 1.87321 9.13423 1.79004L10.187 1.29883C10.2363 1.27582 10.2763 1.23582 10.2993 1.18652L10.7905 0.133789Z"
        fill="currentColor"
      />
    </g>
  ),
  chat: (
    <path
      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  vault: (
    <>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M12 10v-2m0 10v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 3v2m10-2v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  ether: (
    <path
      d="M12 2l7 10-7 4-7-4 7-10zm0 14l7-4-7 10-7-10 7 4z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  skai: (
    <>
      <path
        d="M12 2l7 10-7 4-7-4 7-10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5 12l7 4 7-4-7 10-7-10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  signal: (
    <path
      d="M2 12a10 10 0 0118 0M6 12a6 6 0 0112 0M10 12a2 2 0 014 0M12 12v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  agent: (
    <>
      <rect
        x="5"
        y="8"
        width="14"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" />
      <circle cx="15" cy="14" r="1.5" fill="currentColor" />
      <path
        d="M12 4v4M8 4h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  information: (
    <g transform="translate(2, 2) scale(1.5)">
      <path
        d="M6.63333 10.6667C6.86667 10.6667 7.064 10.586 7.22533 10.4247C7.38667 10.2633 7.46711 10.0662 7.46667 9.83334C7.46622 9.60045 7.38578 9.40311 7.22533 9.24134C7.06489 9.07956 6.86756 8.99911 6.63333 9C6.39911 9.00089 6.202 9.08156 6.042 9.242C5.882 9.40245 5.80133 9.59956 5.8 9.83334C5.79867 10.0671 5.87933 10.2644 6.042 10.4253C6.20467 10.5862 6.40178 10.6667 6.63333 10.6667ZM6.03333 8.1H7.26667C7.26667 7.73334 7.30845 7.44445 7.392 7.23334C7.47556 7.02223 7.71156 6.73334 8.1 6.36667C8.38889 6.07778 8.61667 5.80267 8.78333 5.54134C8.95 5.28 9.03333 4.96623 9.03333 4.6C9.03333 3.97778 8.80556 3.5 8.35 3.16667C7.89445 2.83334 7.35556 2.66667 6.73333 2.66667C6.1 2.66667 5.58622 2.83334 5.192 3.16667C4.79778 3.5 4.52267 3.9 4.36667 4.36667L5.46667 4.8C5.52222 4.6 5.64733 4.38334 5.842 4.15C6.03667 3.91667 6.33378 3.8 6.73333 3.8C7.08889 3.8 7.35556 3.89734 7.53333 4.092C7.71111 4.28667 7.8 4.50045 7.8 4.73334C7.8 4.95556 7.73333 5.164 7.6 5.35867C7.46667 5.55334 7.3 5.73378 7.1 5.9C6.61111 6.33334 6.31111 6.66111 6.2 6.88334C6.08889 7.10556 6.03333 7.51111 6.03333 8.1ZM6.66667 13.3333C5.74445 13.3333 4.87778 13.1584 4.06667 12.8087C3.25556 12.4589 2.55 11.9838 1.95 11.3833C1.35 10.7829 0.875112 10.0773 0.525334 9.26667C0.175556 8.456 0.000445288 7.58934 8.43882e-07 6.66667C-0.000443601 5.744 0.174668 4.87734 0.525334 4.06667C0.876001 3.256 1.35089 2.55045 1.95 1.95C2.54911 1.34956 3.25467 0.87467 4.06667 0.525337C4.87867 0.176003 5.74533 0.000892256 6.66667 3.367e-06C7.588 -0.000885522 8.45467 0.174226 9.26667 0.525337C10.0787 0.876448 10.7842 1.35134 11.3833 1.95C11.9824 2.54867 12.4576 3.25423 12.8087 4.06667C13.1598 4.87912 13.3347 5.74578 13.3333 6.66667C13.332 7.58756 13.1569 8.45423 12.808 9.26667C12.4591 10.0791 11.9842 10.7847 11.3833 11.3833C10.7824 11.982 10.0769 12.4571 9.26667 12.8087C8.45645 13.1602 7.58978 13.3351 6.66667 13.3333Z"
        fill="currentColor"
      />
    </g>
  ),
  candlesticks: (
    <g transform="translate(5.5, 2) scale(1.167)">
      <path
        d="M7.71428 6V11.1429H10.2857V6H7.71428ZM7.28571 5.14286H10.7143C10.8279 5.14286 10.937 5.18801 11.0173 5.26839C11.0977 5.34876 11.1429 5.45777 11.1429 5.57143V11.5714C11.1429 11.6851 11.0977 11.7941 11.0173 11.8745C10.937 11.9549 10.8279 12 10.7143 12H7.28571C7.17205 12 7.06304 11.9549 6.98267 11.8745C6.90229 11.7941 6.85714 11.6851 6.85714 11.5714V5.57143C6.85714 5.45777 6.90229 5.34876 6.98267 5.26839C7.06304 5.18801 7.17205 5.14286 7.28571 5.14286Z"
        fill="currentColor"
      />
      <path
        d="M8.57142 2.57142H9.42856V5.57142H8.57142V2.57142ZM8.57142 11.5714H9.42856V14.5714H8.57142V11.5714Z"
        fill="currentColor"
      />
      <path
        d="M0.857143 3.42856V13.7143H3.42857V3.42856H0.857143ZM0.428571 2.57142H3.85714C3.97081 2.57142 4.07982 2.61657 4.16019 2.69694C4.24056 2.77732 4.28571 2.88633 4.28571 2.99999V14.1428C4.28571 14.2565 4.24056 14.3655 4.16019 14.4459C4.07982 14.5263 3.97081 14.5714 3.85714 14.5714H0.428571C0.314907 14.5714 0.205898 14.5263 0.125525 14.4459C0.0451526 14.3655 0 14.2565 0 14.1428V2.99999C0 2.88633 0.0451526 2.77732 0.125525 2.69694C0.205898 2.61657 0.314907 2.57142 0.428571 2.57142Z"
        fill="currentColor"
      />
      <path
        d="M1.71428 0H2.57142V3H1.71428V0ZM1.71428 14.1429H2.57142V17.1429H1.71428V14.1429Z"
        fill="currentColor"
      />
    </g>
  ),
  // ===========================================================================
  // TRADE-NAV GLYPHS — Figma `icons/graphical` (ring-enclosed)
  // ===========================================================================
  // Report 3cb4cd3b ("Trade dropdown icons differ"). The Trade dropdown
  // (mhF3BkzlTaGiLzJ7kvpmVc 13006:146207) draws every row's glyph as a 24px
  // `icons/graphical` instance holding a 21x21 `icon` boolean-operation at
  // (1.5, 1.5) — a RING with the symbol knocked out of it. The rows were
  // previously pointed at `candlesticks` / `crosshair` / `measure` / `fast`,
  // which are bare unenclosed line glyphs, so the mismatch was a whole icon
  // FAMILY rather than four individual swaps.
  //
  // Every `d` below is the exported Figma vector for its row, byte-for-byte:
  //   Perps  13006:146209   Spot   13006:146214   Swaps  13006:146219
  //   Trench 13006:146224   Launch 13006:146229
  // Nothing here was traced or redrawn — hand-tracing is how the wrong art
  // arrived in the first place. The 21-unit coordinates are kept as exported
  // and centred by the translate, so re-exporting the node yields the same
  // string and a diff is meaningful.
  //
  // Figma paints these Sky Blue #56C7F3, but that is the dropdown's colour, not
  // the glyph's — `fill="currentColor"` keeps colour in the caller's className
  // (same split as src/components/home-redesign/tradeNavIcons.tsx, the 16px
  // `icons/action` cut of the same family used by the sidebar trade column).
  "trade-perps": (
    <g transform="translate(1.5, 1.5)">
      <path
        d="M10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0ZM10.5 1C9.26368 1 8.08335 1.23829 7 1.66797V19.3311C8.08344 19.7608 9.26355 20 10.5 20C15.7467 20 20 15.7467 20 10.5C20 5.25329 15.7467 1 10.5 1ZM6 2.13184C3.02327 3.73595 1 6.88152 1 10.5C1 14.1183 3.02349 17.263 6 18.8672V2.13184Z"
        fill="currentColor"
      />
    </g>
  ),
  "trade-spot": (
    <g transform="translate(1.5, 1.5)">
      <path
        d="M10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0ZM10.5 1C5.25329 1 1 5.25329 1 10.5C1 15.7467 5.25329 20 10.5 20C15.7467 20 20 15.7467 20 10.5C20 5.25329 15.7467 1 10.5 1ZM15.5 15.6006L15.8496 15.958C14.4716 17.3088 12.5827 18.1426 10.5 18.1426C8.41731 18.1426 6.52843 17.3088 5.15039 15.958L5.5 15.6006L5.84961 15.2441C7.04833 16.4193 8.68936 17.1426 10.5 17.1426C12.3106 17.1426 13.9517 16.4193 15.1504 15.2441L15.5 15.6006ZM10.5 8C11.8807 8 13 9.11929 13 10.5C13 11.8807 11.8807 13 10.5 13C9.11929 13 8 11.8807 8 10.5C8 9.11929 9.11929 8 10.5 8ZM10.5 9C9.67157 9 9 9.67157 9 10.5C9 11.3284 9.67157 12 10.5 12C11.3284 12 12 11.3284 12 10.5C12 9.67157 11.3284 9 10.5 9ZM10.5 2.85645C12.5828 2.85645 14.4716 3.69114 15.8496 5.04199L15.5 5.39844L15.1504 5.75586C13.9517 4.58081 12.3106 3.85645 10.5 3.85645C8.68941 3.85645 7.04832 4.58081 5.84961 5.75586L5.5 5.39844L5.15039 5.04199C6.52845 3.69114 8.41723 2.85645 10.5 2.85645Z"
        fill="currentColor"
      />
    </g>
  ),
  "trade-swaps": (
    <g transform="translate(1.5, 1.5)">
      <path
        d="M10.5 0C16.299 2.308e-07 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 2.53482e-07 16.299 0 10.5C-2.4167e-07 4.70101 4.70101 2.53482e-07 10.5 0ZM10.5 1C9.71454 1 8.95167 1.09666 8.22168 1.27637V15.0703L10.1465 13.1465L10.8535 13.8535L8.0752 16.6309C7.98143 16.7246 7.85429 16.7773 7.72168 16.7773C7.58923 16.7772 7.46183 16.7245 7.36816 16.6309L4.59082 13.8535L5.29785 13.1465L7.22168 15.0703V1.58008C3.59022 2.91516 1 6.40539 1 10.5C1 15.7467 5.25329 20 10.5 20C11.2852 20 12.0476 19.9023 12.7773 19.7227V6.42969L10.8535 8.35352L10.1465 7.64648L12.9238 4.86914L13 4.80664C13.0815 4.75217 13.1778 4.72272 13.2773 4.72266C13.41 4.72266 13.5371 4.77537 13.6309 4.86914L16.4092 7.64648L15.7021 8.35352L13.7773 6.42871V19.4189C17.4091 18.084 20 14.5948 20 10.5C20 5.2533 15.7467 1 10.5 1Z"
        fill="currentColor"
      />
    </g>
  ),
  "trade-trench": (
    <g transform="translate(1.5, 1.5)">
      <path
        d="M10.5 0C16.299 2.308e-07 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 2.53482e-07 16.299 0 10.5C-2.4167e-07 4.70101 4.70101 2.53482e-07 10.5 0ZM1.01367 11C1.2737 16.0143 5.42103 20 10.5 20C15.579 20 19.7263 16.0143 19.9863 11H14.79L12.9346 14.248L12.79 14.5H8.20996L8.06543 14.248L6.20898 11H1.01367ZM10.5 1C5.42103 1 1.2737 4.98574 1.01367 10H6.79004L6.93457 10.252L8.79004 13.5H12.209L14.0654 10.252L14.21 10H19.9863C19.7263 4.98574 15.579 1 10.5 1Z"
        fill="currentColor"
      />
    </g>
  ),
  "trade-launch": (
    <g transform="translate(1.5, 1.5)">
      <path
        d="M10.5 0C16.299 2.308e-07 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 2.53482e-07 16.299 0 10.5C-2.4167e-07 4.70101 4.70101 2.53482e-07 10.5 0ZM10.5 1C5.25329 1 1 5.25329 1 10.5C1 15.579 4.98574 19.7263 10 19.9863V17.667H8.89941L8.75098 17.4443L7.56641 15.667H4.66699V14.5C4.66699 13.3311 5.24935 12.3852 5.78711 11.7578C6.05918 11.4404 6.33076 11.192 6.53418 11.0225C6.58172 10.9829 6.62729 10.9482 6.66699 10.917V7.83301C6.66707 6.38267 7.20784 4.95488 7.91797 3.88965C8.27418 3.35538 8.68417 2.89495 9.11035 2.56348C9.52707 2.23949 10.0091 2.00011 10.5 2C10.991 2.00016 11.4738 2.23933 11.8906 2.56348C12.3168 2.89498 12.7269 3.35541 13.083 3.88965C13.793 4.95484 14.3339 6.38284 14.334 7.83301V10.918C14.3735 10.949 14.4186 10.9831 14.4658 11.0225C14.6692 11.192 14.9408 11.4404 15.2129 11.7578C15.7506 12.3852 16.334 13.3312 16.334 14.5V15.667H13.4346L12.25 17.4443L12.1016 17.667H11V19.9863C16.0143 19.7263 20 15.579 20 10.5C20 5.2533 15.7467 1 10.5 1ZM9.43457 16.667H11.5664L12.2324 15.667H8.76855L9.43457 16.667ZM10.5 3C10.3246 3.00012 10.0563 3.09385 9.72363 3.35254C9.39992 3.60431 9.06038 3.9788 8.75 4.44434C8.12696 5.37893 7.66707 6.61696 7.66699 7.83301V11.4346L7.44434 11.583L7.44336 11.582V11.583C7.44121 11.5845 7.43704 11.588 7.43164 11.5918C7.42031 11.5997 7.40154 11.6125 7.37793 11.6299C7.33037 11.665 7.25996 11.7191 7.1748 11.79C7.00336 11.9329 6.77454 12.1436 6.54688 12.4092C6.0847 12.9484 5.66699 13.669 5.66699 14.5V14.667H15.334V14.5C15.334 13.6692 14.9161 12.9484 14.4541 12.4092C14.2265 12.1436 13.9976 11.9329 13.8262 11.79C13.7411 11.7191 13.6707 11.6651 13.623 11.6299C13.5995 11.6125 13.5808 11.5998 13.5693 11.5918C13.5639 11.588 13.5599 11.5846 13.5576 11.583L13.5566 11.582V11.583L13.334 11.4346V7.83301C13.3339 6.61713 12.8739 5.37888 12.251 4.44434C11.9406 3.97884 11.6 3.60435 11.2764 3.35254C10.9438 3.09399 10.6754 3.00017 10.5 3ZM10.5 5.33301C10.9861 5.33314 11.4532 5.5264 11.7969 5.87012C12.1406 6.21393 12.334 6.68086 12.334 7.16699C12.3339 7.65293 12.1404 8.11917 11.7969 8.46289C11.4532 8.80661 10.9861 8.99987 10.5 9C10.014 8.99991 9.54783 8.80649 9.2041 8.46289C8.86035 8.11914 8.66708 7.65313 8.66699 7.16699C8.66699 6.68074 8.86027 6.21395 9.2041 5.87012C9.54782 5.52662 10.0141 5.33309 10.5 5.33301ZM10.5 6.33301C10.2793 6.33309 10.0673 6.42118 9.91113 6.57715C9.75484 6.73344 9.66699 6.94596 9.66699 7.16699C9.66708 7.38791 9.75491 7.59964 9.91113 7.75586C10.0673 7.91193 10.2792 7.99991 10.5 8C10.7209 7.99987 10.9337 7.91204 11.0898 7.75586C11.2458 7.59968 11.3339 7.38772 11.334 7.16699C11.334 6.94607 11.246 6.73342 11.0898 6.57715C10.9337 6.42097 10.7209 6.33314 10.5 6.33301Z"
        fill="currentColor"
      />
    </g>
  ),
  // ===========================================================================
  // SOCIAL-NAV GLYPHS — Figma `icons/graphical` (ring-enclosed)
  // ===========================================================================
  // Report 5c1bd8f6 ("Social Dropdown Icon Mismatching"). Exactly the same
  // defect the Trade dropdown had in 3cb4cd3b, on the sibling menu: the Social
  // dropdown (3sSzw1KewMtUbeLAv7uW0r 5221:22665) draws each row's glyph as a
  // 24px `icons/graphical` instance — a RING with the symbol knocked out of it
  // — while the rows pointed at `search` / `signal` / `users`, which are bare
  // unenclosed line glyphs. One icon FAMILY wrong, not three glyph swaps.
  //
  // Every `d` below is the exported Figma vector for its row, byte-for-byte:
  //   Discover 5221:22687   Live 5221:22667   Trading groups 5221:22672
  // Nothing was traced or redrawn. These export in 24-unit coordinates already
  // (ring centred at 12 with r=10.5), so unlike the `trade-*` family they need
  // no translate — they drop straight into this registry's 24x24 viewBox.
  //
  // Figma paints them Sky Blue #56C7F3, but that is the dropdown's colour, not
  // the glyph's — `fill="currentColor"` keeps colour in the caller's className.
  "social-discover": (
    <path
      d="M12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5ZM12 2.5C6.75329 2.5 2.5 6.75329 2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C14.4415 21.5 16.6668 20.5779 18.3496 19.0645L16.0088 16.7236C14.8984 17.6655 13.4877 18.1914 12.0205 18.1914H12.0166L11.7178 18.1836L11.7139 18.1826C10.2907 18.1119 8.93523 17.5512 7.87891 16.5947L7.87598 16.5918L7.66016 16.3857L7.65723 16.3838C6.57253 15.2991 5.93423 13.852 5.8584 12.3271L5.85742 12.3232L5.84961 12.0244V12.0205C5.84961 10.4863 6.42134 9.01084 7.44629 7.87891L7.44922 7.87598L7.65527 7.66016L7.65723 7.65723C8.8144 6.50006 10.384 5.84961 12.0205 5.84961H12.0244L12.3232 5.85742L12.3271 5.8584C13.852 5.93423 15.2991 6.57253 16.3838 7.65723C17.5409 8.81439 18.1914 10.384 18.1914 12.0205V12.0244L18.1836 12.3232L18.1826 12.3271C18.1152 13.6837 17.5997 14.976 16.7236 16.0088L19.0645 18.3496C20.5779 16.6668 21.5 14.4415 21.5 12C21.5 6.7533 17.2467 2.5 12 2.5ZM12.0176 6.8584C10.6496 6.85917 9.33855 7.40364 8.37109 8.37109L8.37012 8.37012L8.19336 8.55469L8.19434 8.55566C7.33674 9.50268 6.8584 10.7369 6.8584 12.0205L6.86523 12.2803H6.86426C6.92842 13.5547 7.46437 14.7632 8.37109 15.6699C9.27759 16.5764 10.4857 17.1114 11.7598 17.1758L12.0225 17.1816C13.3908 17.1811 14.7022 16.6376 15.6699 15.6699C16.5766 14.7632 17.1116 13.5547 17.1758 12.2803L17.1826 12.0205C17.1826 10.7369 16.7043 9.50268 15.8467 8.55566V8.55469L15.6699 8.37012C14.7632 7.46368 13.5545 6.92841 12.2803 6.86426L12.0176 6.8584Z"
      fill="currentColor"
    />
  ),
  "social-live": (
    <path
      d="M12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5ZM12 2.5C6.75329 2.5 2.5 6.75329 2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C17.2467 21.5 21.5 17.2467 21.5 12C21.5 6.7533 17.2467 2.5 12 2.5ZM12 10.25C12.5525 10.25 13.082 10.4698 13.4727 10.8604C13.8633 11.251 14.0829 11.7806 14.083 12.333H12V10.25ZM12 8.16699C13.105 8.16699 14.1649 8.60542 14.9463 9.38672C15.7276 10.168 16.1669 11.2281 16.167 12.333H15.125C15.1249 11.5045 14.7957 10.71 14.21 10.124C13.6239 9.53797 12.8288 9.20801 12 9.20801V8.16699ZM12 6.08301C13.6575 6.08301 15.2469 6.74206 16.4189 7.91406C17.591 9.08609 18.2499 10.6755 18.25 12.333H17.208C17.208 11.6492 17.0732 10.9716 16.8115 10.3398C16.5498 9.70811 16.1661 9.13392 15.6826 8.65039C15.199 8.16684 14.625 7.7832 13.9932 7.52148C13.3613 7.25974 12.684 7.125 12 7.125V6.08301ZM12.0518 4C16.6351 4 20.333 7.69792 20.333 12.2812V12.333H19.292V12.2812C19.292 8.27083 16.0625 5.04199 12 5.04199V4H12.0518Z"
      fill="currentColor"
    />
  ),
  "social-groups": (
    <path
      d="M12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5ZM12.002 10.75C11.5695 10.7497 11.167 10.7914 10.7959 10.875C10.4247 10.9586 10.1051 11.0838 9.83887 11.25C9.57273 11.4162 9.36665 11.6102 9.2207 11.8311C9.07471 12.052 9.00195 12.2958 9.00195 12.5625L8.95801 18.3115L8.96582 18.5527C9.05281 19.7457 9.84854 20.7819 10.998 21.165C11.5337 21.3435 12.1104 21.3656 12.6563 21.2314L12.8887 21.1641C14.0356 20.7814 14.842 19.7523 14.9463 18.5625L14.958 18.3232L15.002 12.5625C15.0023 12.2963 14.931 12.052 14.7891 11.8311C14.6827 11.6656 14.5413 11.5149 14.3652 11.3799L14.1768 11.25C13.9105 11.0834 13.5915 10.9583 13.2207 10.875C12.9426 10.8125 12.644 10.7734 12.3262 10.7578L12.002 10.75ZM12 2.5C6.75329 2.5 2.5 6.75329 2.5 12C2.5 16.1966 5.22195 19.7554 8.99609 21.0127C8.33776 20.2886 7.9503 19.3309 7.95801 18.3047L7.96094 17.8418C7.33095 18.1278 6.56266 18.1159 5.90039 17.6748C5.29761 17.2729 4.94001 16.5916 4.95117 15.8672L5.00195 12.5723H5.00293C5.00853 11.7997 5.43868 11.2223 6.02832 10.8604C6.08677 10.8245 6.14738 10.7912 6.20801 10.7598C6.0738 10.4902 6.00234 10.1924 6.00195 9.87598V9.875C6.00195 9.3327 6.20117 8.83403 6.59668 8.44727C6.97986 8.07278 7.46672 7.875 8.00195 7.875C8.53667 7.87518 9.03268 8.06704 9.4209 8.45508C9.4561 8.4903 9.48853 8.5285 9.52051 8.56543C9.58439 8.00722 9.82237 7.50252 10.2373 7.09375C10.7195 6.61895 11.3273 6.37554 12.001 6.375H12.002C12.6786 6.37518 13.2932 6.61553 13.7773 7.09961C14.1873 7.5097 14.4204 8.0136 14.4824 8.56934C14.5185 8.52785 14.5565 8.48652 14.5967 8.44727C14.9799 8.07278 15.4667 7.875 16.002 7.875C16.5367 7.87518 17.0327 8.06704 17.4209 8.45508C17.8092 8.8435 18.002 9.33994 18.002 9.875C18.002 10.19 17.9315 10.4876 17.7988 10.7578C17.8557 10.787 17.9129 10.8165 17.9678 10.8496C18.5747 11.2155 19.002 11.8066 19.002 12.5879V12.6025L18.9502 15.9287C18.9393 16.6249 18.587 17.2719 18.0078 17.6582C17.349 18.0974 16.5861 18.1087 15.9609 17.8252L15.958 18.3301C15.9501 19.3748 15.5329 20.3427 14.8447 21.0654C18.7015 19.8564 21.5 16.2556 21.5 12C21.5 6.7533 17.2467 2.5 12 2.5ZM8.00195 11.375C7.40215 11.375 6.91838 11.488 6.55176 11.7129L6.42285 11.7998C6.14202 12.0113 6.00195 12.2743 6.00195 12.5879L5.95117 15.8828L5.95801 16.0264C5.99487 16.3559 6.17521 16.6552 6.45508 16.8418C7.20252 17.3397 8.20483 16.8112 8.21484 15.9131L8.25195 12.5625C8.25195 12.3543 8.28062 12.1544 8.33887 11.9629C8.36994 11.8608 8.40941 11.7604 8.45703 11.6631C8.51676 11.5407 8.45026 11.3883 8.31445 11.3818C8.21469 11.3775 8.11001 11.375 8.00195 11.375ZM15.708 11.3818C15.5737 11.3876 15.5072 11.538 15.5635 11.6602C15.6065 11.7533 15.6427 11.8503 15.6709 11.9502C15.7248 12.1418 15.752 12.346 15.752 12.5625L15.7148 15.8828C15.7055 16.7249 16.5838 17.2547 17.3096 16.9072L17.4531 16.8262C17.7207 16.6476 17.896 16.3632 17.9395 16.0488L17.9502 15.9131L18.002 12.5879C18.002 12.2676 17.8613 12.0022 17.5811 11.793L17.4521 11.7061C17.0856 11.4851 16.6016 11.3751 16.002 11.375C15.9025 11.3753 15.8039 11.3778 15.708 11.3818ZM8.00195 8.875C7.72755 8.875 7.49179 8.97081 7.2959 9.16211L7.22656 9.23633C7.07649 9.41407 7.00195 9.62708 7.00195 9.875C7.00229 10.1503 7.10031 10.3854 7.2959 10.5811C7.49152 10.7766 7.72707 10.875 8.00195 10.875C8.28495 10.8752 8.52237 10.7769 8.71387 10.5811C8.88131 10.4097 8.97607 10.2083 8.99707 9.97656L9.00195 9.875C9.00195 9.59179 8.90537 9.35373 8.71387 9.16211C8.54628 8.99467 8.3431 8.90087 8.10547 8.87988L8.00195 8.875ZM16.002 8.875C15.7275 8.875 15.4918 8.97081 15.2959 9.16211L15.2266 9.23633C15.0765 9.41407 15.002 9.62708 15.002 9.875C15.0023 10.1503 15.1003 10.3854 15.2959 10.5811C15.4915 10.7766 15.7271 10.875 16.002 10.875C16.2849 10.8752 16.5224 10.7769 16.7139 10.5811C16.8813 10.4097 16.9761 10.2083 16.9971 9.97656L17.002 9.875C17.002 9.59179 16.9054 9.35373 16.7139 9.16211C16.5463 8.99467 16.3431 8.90087 16.1055 8.87988L16.002 8.875ZM12.002 7.375C11.5854 7.37533 11.2311 7.51952 10.9395 7.80664L10.8369 7.91699C10.6134 8.18355 10.502 8.50293 10.502 8.875L10.5088 9.02832C10.5407 9.3792 10.6843 9.68231 10.9395 9.9375C11.1946 10.1925 11.4978 10.3363 11.8486 10.3682L12.002 10.375C12.4269 10.3748 12.7832 10.2289 13.0703 9.9375C13.3216 9.68234 13.4637 9.37913 13.4951 9.02832L13.502 8.875C13.5022 8.50365 13.3918 8.18456 13.1719 7.91797L13.0703 7.80664C12.7828 7.51922 12.4266 7.37517 12.002 7.375Z"
      fill="currentColor"
    />
  ),
  // ===========================================================================
  // PLAY-NAV GLYPHS — Figma `icons/graphical` (ring-enclosed)
  // ===========================================================================
  // Reports 4e135ac0 ("Casino icon doesn't match Figma in Play menu") and
  // ba9218fc ("Sportsbook icon doesn't match Figma in the Play menu"). This is
  // the THIRD filing of one defect — the Trade dropdown had it as 3cb4cd3b and
  // the Social dropdown as 5c1bd8f6 — on the last of the three rich dropdowns.
  //
  // The Play dropdown (3sSzw1KewMtUbeLAv7uW0r 4765:65172) draws both rows as
  // 24px `icons/graphical` instances, each holding a 21x21 `icon`
  // boolean-operation at (1.5, 1.5) — verified via get_metadata on 4765:65174
  // and 4765:65194, which report exactly that shape. The rows pointed at
  // `games` (a dice square) and `reward` (a trophy), which are bare unenclosed
  // glyphs from a different family. So, again, one icon FAMILY wrong rather
  // than two glyph swaps — no `size`/`strokeWidth` value could have closed it.
  //
  // Both `d`s below are the exported Figma vector for their row, byte-for-byte
  // (asset export of 4765:65174 / 4765:65194). Nothing traced or redrawn.
  // Like the `social-*` family and unlike `trade-*`, these export in 24-unit
  // coordinates already (ring centred at 12, r=10.5), so they need no
  // translate and drop straight into this registry's 24x24 viewBox.
  //
  // Figma paints them Sky Blue #56C7F3; that is the dropdown's colour, not the
  // glyph's, so `fill="currentColor"` keeps colour with the caller — the same
  // split as src/components/home-redesign/playNavIcons.tsx, which holds the
  // 15px `icons/action` cut of the same two symbols for the sidebar's Casino /
  // Sports book accordion headers. The sidebar was ALREADY on the right art;
  // the dropdown was the last surface that was not.
  "play-casino": (
    <path
      d="M12.0006 1.50002C14.7852 1.50014 17.4564 2.60619 19.4254 4.57521C21.3944 6.54432 22.5006 9.21536 22.5006 12C22.5006 14.7847 21.3944 17.4557 19.4254 19.4248C17.4564 21.3938 14.7852 22.4999 12.0006 22.5C9.21597 22.5 6.54493 21.3938 4.57582 19.4248C2.60669 17.4557 1.49965 14.7848 1.49965 12C1.49965 9.21524 2.60669 6.54434 4.57582 4.57521C6.54493 2.60623 9.21597 1.50002 12.0006 1.50002ZM12.8209 18.877C12.55 18.9093 12.2763 18.9277 12.0006 18.9277C11.7512 18.9277 11.5032 18.9132 11.2575 18.8867L10.7975 21.4199C11.1944 21.4706 11.5962 21.5 12.0006 21.5C12.4414 21.5 12.8786 21.4664 13.3102 21.4063L12.8209 18.877ZM5.16371 18.5918C5.20372 18.6333 5.24203 18.677 5.28285 18.7178C6.53924 19.9741 8.11178 20.8397 9.81313 21.2422L10.2741 18.708C9.0867 18.4024 7.99078 17.7856 7.10805 16.9053L5.16371 18.5918ZM16.8991 16.8985C16.0343 17.7633 14.9639 18.3735 13.8034 18.6865L14.2916 21.2188C15.9531 20.8058 17.4876 19.9486 18.7184 18.7178C18.7846 18.6516 18.8467 18.5816 18.9108 18.5137L16.9459 16.8486C16.93 16.8649 16.9152 16.8823 16.8991 16.8985ZM12.0006 6.0713C10.4284 6.0713 8.92003 6.69591 7.80824 7.80763C6.6965 8.91937 6.07198 10.4278 6.07191 12C6.07199 13.5721 6.69672 15.0797 7.80824 16.1914C8.92004 17.3032 10.4283 17.9277 12.0006 17.9277C13.5729 17.9277 15.0803 17.3032 16.192 16.1914C17.3037 15.0797 17.9283 13.5722 17.9284 12C17.9283 10.4278 17.3038 8.91937 16.192 7.80763C15.0803 6.69611 13.5727 6.07137 12.0006 6.0713ZM3.23793 15.669C3.56138 16.4416 3.98821 17.1703 4.50746 17.8369L6.45277 16.1504C6.1383 15.7301 5.87532 15.2763 5.66469 14.7998L3.23793 15.669ZM18.3659 14.7285C18.1606 15.2073 17.9029 15.6635 17.5934 16.0869L19.5582 17.752C20.0698 17.0798 20.4876 16.3459 20.8024 15.5694L18.3659 14.7285ZM12.4879 9.44728C12.5764 9.46058 12.6647 9.47792 12.7516 9.50002L12.9166 9.54298C13.0794 9.59087 13.2351 9.65248 13.3815 9.72951C13.5771 9.8325 13.7504 9.95974 13.901 10.1104L13.9713 10.1807L13.9274 10.2695L13.7018 10.7266L13.6198 10.8955L13.483 10.7666C13.1813 10.482 12.8432 10.3052 12.4664 10.2354V11.9277C12.5527 11.9512 12.6388 11.9752 12.7243 12.001C12.9456 12.0616 13.15 12.1423 13.3385 12.2442C13.5373 12.3516 13.6983 12.4987 13.818 12.6836C13.9433 12.8723 13.9996 13.1087 13.9996 13.3828C13.9996 13.6995 13.9148 13.9832 13.7418 14.2266C13.5709 14.4668 13.3347 14.6535 13.0397 14.7881C12.8704 14.8637 12.6851 14.9141 12.4879 14.9453V15.7666H11.7028V14.9649C11.4439 14.9406 11.1963 14.8888 10.9606 14.8067H10.9586C10.623 14.6845 10.3282 14.5082 10.0768 14.2774L10.0006 14.207L10.0465 14.1143L10.3502 13.4971L10.485 13.6123C10.7321 13.8221 10.9757 13.9694 11.2145 14.0596C11.373 14.1183 11.5432 14.1559 11.7252 14.1768V12.5899C11.6179 12.5606 11.5102 12.5298 11.403 12.4981C11.1806 12.4324 10.9738 12.3475 10.7848 12.2402L10.7819 12.2383C10.5848 12.121 10.4259 11.9671 10.3073 11.7783C10.1829 11.5803 10.1266 11.3321 10.1266 11.044C10.1266 10.7272 10.2121 10.442 10.3844 10.1944C10.5546 9.94506 10.7875 9.75244 11.0788 9.6172C11.2707 9.52969 11.4798 9.47378 11.7028 9.44337V8.63087H12.4879V9.44728ZM2.87172 9.37502C2.62842 10.2212 2.50063 11.1038 2.50063 12C2.50063 12.932 2.63735 13.8497 2.90004 14.7266L5.32777 13.8584C5.16061 13.2584 5.07194 12.6338 5.07191 12C5.07194 11.3923 5.15335 10.7931 5.30727 10.2158L2.87172 9.37502ZM18.6715 10.1416C18.8387 10.7418 18.9283 11.3661 18.9284 12C18.9283 12.6075 18.8458 13.2063 18.692 13.7832L21.1276 14.6231C21.3706 13.7774 21.5006 12.8956 21.5006 12C21.5006 11.068 21.362 10.1504 21.0993 9.27345L18.6715 10.1416ZM12.4664 14.1494C12.6211 14.1125 12.7469 14.0553 12.8463 13.9785L12.8473 13.9776C13.0275 13.8414 13.1198 13.6536 13.1198 13.3975C13.1197 13.2495 13.0753 13.1445 12.9957 13.0684L12.9938 13.0674C12.9052 12.9788 12.7813 12.9035 12.6168 12.8457L12.612 12.8438C12.5653 12.8256 12.5162 12.8107 12.4664 12.794V14.1494ZM11.7252 10.2334C11.5452 10.2694 11.3978 10.3343 11.2809 10.4248C11.1045 10.5652 11.0143 10.7594 11.0143 11.0225C11.0144 11.1946 11.0594 11.319 11.1383 11.4092C11.2275 11.506 11.3504 11.5892 11.5123 11.6553C11.5801 11.6809 11.6522 11.704 11.7252 11.7276V10.2334ZM4.44203 6.24611C3.93027 6.91838 3.51287 7.65298 3.19789 8.4297L5.63344 9.27052C5.83864 8.79185 6.09655 8.3355 6.4059 7.91212L4.44203 6.24611ZM17.5465 7.84962C17.861 8.26995 18.124 8.72359 18.3346 9.20021L20.7623 8.33205C20.4389 7.5591 20.0123 6.82992 19.4928 6.1631L17.5465 7.84962ZM9.70863 2.78029C8.04719 3.19317 6.51364 4.05154 5.28285 5.28224C5.21689 5.3482 5.1533 5.41672 5.08949 5.48439L7.05336 7.14943C7.06927 7.13321 7.08513 7.11668 7.10121 7.1006C7.96619 6.23566 9.03691 5.62446 10.1979 5.31154L9.70863 2.78029ZM13.7272 5.29103C14.9141 5.59666 16.0096 6.21375 16.8922 7.09377L18.8375 5.40724C18.7976 5.36584 18.7591 5.32298 18.7184 5.28224C17.4619 4.02576 15.8887 3.15939 14.1871 2.75685L13.7272 5.29103ZM12.0006 2.50002C11.5601 2.50002 11.1225 2.53278 10.6911 2.59279L11.1793 5.12209C11.4506 5.0897 11.7247 5.0713 12.0006 5.0713C12.2498 5.07131 12.4974 5.08587 12.7428 5.11232L13.2038 2.57912C12.8067 2.52841 12.4052 2.50004 12.0006 2.50002Z"
      fill="currentColor"
    />
  ),
  "play-sportsbook": (
    <path
      d="M7.12291 2.70229C9.00203 1.71388 11.1414 1.31893 13.2557 1.57631L13.2547 1.57729C14.8732 1.77134 16.4246 2.33939 17.785 3.23744C19.1452 4.13543 20.2773 5.33833 21.0917 6.75014C21.9076 8.16151 22.3836 9.74391 22.4813 11.3712C22.5789 12.9982 22.2951 14.6256 21.6542 16.1242C20.8197 18.084 19.4089 19.7401 17.6131 20.8732L17.2489 21.0929C12.2269 23.9898 5.80582 22.2715 2.90807 17.2501C0.00859478 12.229 1.72929 5.80827 6.74986 2.90834L7.12291 2.70229ZM14.9921 14.2003C14.4872 14.4412 13.9898 14.7101 13.5067 15.004C10.9743 16.5451 8.94004 18.687 8.15904 20.6857C10.7288 21.8192 13.7646 21.802 16.4178 20.4064C16.4155 20.3917 16.4135 20.3764 16.411 20.3605C16.3818 20.1764 16.3382 19.9085 16.2792 19.5763C16.1608 18.9107 15.9816 17.9867 15.7411 16.9562C15.5356 16.0761 15.2838 15.1284 14.9921 14.2003ZM12.3104 8.9767C11.911 9.26998 11.4986 9.55098 11.0741 9.81166C8.44275 11.4273 5.29066 12.4319 2.50182 11.9962C2.49964 13.612 2.90815 15.2503 3.77428 16.7501C4.64101 18.2521 5.85783 19.4248 7.26061 20.2306C8.17442 17.9808 10.3872 15.7311 12.9862 14.1496C13.5288 13.8194 14.094 13.5161 14.6727 13.2453C14.3471 12.3313 13.9804 11.4686 13.5663 10.7511C13.2249 10.1597 12.792 9.56184 12.3104 8.9767ZM21.4452 13.0089C19.7288 12.7152 17.7914 13.0478 15.9139 13.798C16.2323 14.7985 16.5004 15.8106 16.7147 16.7287C16.9602 17.7804 17.1429 18.7219 17.2635 19.4005C17.2934 19.5685 17.3165 19.7209 17.3387 19.8546C18.8389 18.8377 20.0214 17.41 20.7352 15.7335V15.7326C21.1075 14.8625 21.3451 13.9441 21.4452 13.0089ZM16.7381 3.76674C16.0828 5.3817 14.7575 6.99549 13.1005 8.36342C13.6057 8.9792 14.0652 9.61478 14.4325 10.2511C14.8715 11.0117 15.2581 11.9085 15.5956 12.8478C17.5461 12.0764 19.606 11.7072 21.4989 12.0031C21.499 11.8128 21.4947 11.6223 21.4833 11.4318C21.3949 9.95972 20.9644 8.52787 20.2264 7.25112L20.2255 7.25014C19.4888 5.97293 18.4647 4.88481 17.2342 4.07241C17.0719 3.96524 16.9062 3.86346 16.7381 3.76674ZM6.93541 3.96596C4.39333 5.56651 2.8567 8.19314 2.55553 10.9914C5.04229 11.4168 7.99397 10.5298 10.5506 8.9601C10.9314 8.72628 11.2998 8.47717 11.6551 8.21889C10.9389 7.42929 10.1628 6.68206 9.43736 6.03139C8.70393 5.37359 8.03208 4.82278 7.54381 4.43666C7.2998 4.24371 7.102 4.09139 6.96568 3.98842C6.95529 3.98057 6.9451 3.97322 6.93541 3.96596ZM13.1346 2.56948C11.3333 2.35019 9.51236 2.65435 7.88658 3.43764C7.97053 3.50292 8.06417 3.5736 8.16393 3.65248C8.66447 4.04831 9.35305 4.61254 10.1053 5.28725C10.8567 5.96111 11.6823 6.75348 12.4501 7.60561C14.0495 6.28841 15.2747 4.76211 15.8407 3.31166C14.9833 2.93281 14.0719 2.68172 13.1356 2.56948H13.1346Z"
      fill="currentColor"
    />
  ),
  // =============================================================================
  // GRAPHICAL / TRADING TOOL ICONS (from Figma design system)
  // =============================================================================
  "zoom-in": (
    <>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M21 21l-4.35-4.35M11 8v6m-3-3h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M12 2v4m0 12v4M2 12h4m12 0h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  trendline: (
    <path
      d="M3 20L10 10l4 6 7-13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  "fib-retracement": (
    <path
      d="M3 4h18M3 8.5h18M3 12h18M3 16.5h18M3 20h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
  reward: (
    <>
      <path
        d="M6 9H4V4h4m10 5h2V4h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M4 9h16v2a6 6 0 01-6 6h-4a6 6 0 01-6-6V9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 17v3h6v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  "xabcd-pattern": (
    <path
      d="M3 6l5 12 4-8 4 8 5-12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  "long-position": (
    <path
      d="M12 20V4m0 0l-6 6m6-6l6 6M4 20h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  brush: (
    <path
      d="M18.37 2.63a2.12 2.12 0 013 3L14 13l-4 1 1-4 7.37-7.37zM5 17a3 3 0 00-3 3c1 0 2.5-.5 3-2 .5 1.5 2 2 3 2a3 3 0 00-3-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  text: (
    <path
      d="M6 4h12M12 4v16m-4 0h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  magnet: (
    <path
      d="M6 3v7a6 6 0 1012 0V3M6 3h4v7a2 2 0 104 0V3h4M6 8h4m4 0h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  measure: (
    <path
      d="M3 21L21 3M3 21h6v-2M3 21v-6h2m16-12h-6v2M21 3v6h-2M9 15l2-2m2-2l2-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  secure: (
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  fast: (
    <path
      d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // =============================================================================
  // WALLET PROVIDER ICONS
  // =============================================================================
  metamask: (
    <>
      <path
        d="M21.2 5.4L13.3 11.3l1.5-3.5 6.4-2.4z"
        fill="#E2761B"
        stroke="#E2761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.8 5.4l7.8 6 1.4-3.6-9.2-2.4z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3 16.5l-2.1 3.2 4.5 1.2 1.3-4.4-3.7 0z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 16.5l1.3 4.4 4.5-1.2-2.1-3.2H2z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10.5l-1.8 2.7 6.3.3-.2-6.8-4.3 3.8z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 10.5l-4.4-3.9-.1 6.9 6.3-.3-1.8-2.7z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.8 19.7l3.8-1.9-3.3-2.6-.5 4.5z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 17.8l3.8 1.9-.5-4.5-3.3 2.6z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2 19.7l-3.8-1.9.3 2.5-.1 1 3.6-1.6z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.8 19.7l3.6 1.6-.1-1 .3-2.5-3.8 1.9z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 14.7l-3.2-.9 2.3-1.1.9 2z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 14.7l.9-2 2.3 1.1-3.2.9z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.8 19.7l.5-3.2-2.6.1 2.1 3.1z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.7 16.5l.5 3.2 2.1-3.1-2.6-.1z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3 13.2l-6.3.3.6 3.2.9-2 2.3 1.1 2.5-2.6z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 15.8l2.3-1.1.9 2 .6-3.2-6.4-.3 2.6 2.6z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.7 13.2l2.7 5.3-.1-2.7-2.6-2.6z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.7 15.8l-.1 2.7 2.7-5.3-2.6 2.6z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.5l-.6 3.2.7 3.6.2-4.8-.3-2z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.5l-.3 2 .2 4.8.7-3.6-.6-3.2z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  coinbase: (
    <>
      <circle cx="12" cy="12" r="10" fill="#0052FF" />
      <path
        d="M12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 8.5a3 3 0 110-6 3 3 0 010 6z"
        fill="white"
      />
    </>
  ),
  phantom: (
    <>
      <defs>
        <linearGradient id="phantomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#534BB1" />
          <stop offset="100%" stopColor="#551BF9" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#phantomGrad)"
      />
      <circle cx="8.5" cy="11" r="1.5" fill="white" />
      <circle cx="15.5" cy="11" r="1.5" fill="white" />
      <path
        d="M7 14.5c0 0 2 3 5 3s5-3 5-3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  walletconnect: (
    <>
      <circle cx="12" cy="12" r="10" fill="#3B99FC" />
      <path
        d="M7.5 10c2.5-2.5 6.5-2.5 9 0l.3.3c.1.1.1.3 0 .4l-1 1c-.1.1-.2.1-.2 0l-.4-.4c-1.7-1.7-4.6-1.7-6.3 0l-.4.4c-.1.1-.2.1-.3 0l-1-1c-.1-.1-.1-.3 0-.4l.3-.3z"
        fill="white"
      />
      <path
        d="M18 12.5l1 1c.1.1.1.3 0 .4l-4.5 4.4c-.2.2-.5.2-.7 0l-3.2-3.1c0-.1-.1-.1-.2 0l-3.2 3.1c-.2.2-.5.2-.7 0L2 13.9c-.1-.1-.1-.3 0-.4l1-1c.1-.1.3-.1.4 0l3.2 3.1c.1 0 .2 0 .2 0l3.2-3.1c.2-.2.5-.2.7 0l3.2 3.1c.1.1.2.1.2 0l3.2-3.1c.1-.1.3-.1.4 0z"
        fill="white"
      />
    </>
  ),
  rainbow: (
    <>
      <defs>
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="25%" stopColor="#FFE66D" />
          <stop offset="50%" stopColor="#4ECDC4" />
          <stop offset="75%" stopColor="#45B7D1" />
          <stop offset="100%" stopColor="#9B59B6" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#rainbowGrad)" />
      <path
        d="M6 15a6 6 0 0112 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 15a4 4 0 018 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 15a2 2 0 014 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  // =============================================================================
  // SOCIAL ICONS (from Figma Design System)
  // =============================================================================
  discord: (
    <path
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      fill="currentColor"
    />
  ),
  instagram: (
    <path
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      fill="currentColor"
    />
  ),
  x: (
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="currentColor"
    />
  ),
  twitter: (
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="currentColor"
    />
  ),
  telegram: (
    <path
      d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      fill="currentColor"
    />
  ),
  // =============================================================================
  // BRAND ICONS
  // =============================================================================
  google: (
    <>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </>
  ),
  apple: (
    <path
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      fill="currentColor"
    />
  ),
  // =============================================================================
  // TIER ICONS (Fee Tiers: Free, Bronze, Silver, Gold, Platinum, Diamond)
  // =============================================================================
  "tier-free": (
    <>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#878787"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fill="#878787"
        fontSize="6"
        fontWeight="bold"
      >
        FREE
      </text>
    </>
  ),
  "tier-bronze": (
    <>
      <circle {...TIER_ENCLOSURE} fill="#E7AA8A" stroke="#A56B4D" />
      <g transform="translate(7.2139 6.9939) scale(0.5)">
        <path d={TIER_STAR_FILLED_D} fill="#A56B4D" />
      </g>
    </>
  ),
  "tier-silver": (
    <>
      <circle {...TIER_ENCLOSURE} fill="#E2E2E2" stroke="#9C9C9C" />
      <g transform="translate(7.2139 6.9939) scale(0.5)">
        <path
          d="M9.14115 0.748463C9.33404 0.417458 9.81155 0.417459 10.0044 0.748463L12.4751 4.98967C12.6871 5.35343 13.0422 5.61149 13.4537 5.70061L18.2505 6.73967C18.625 6.8208 18.7724 7.27522 18.5171 7.56096L15.2476 11.2211C14.967 11.5351 14.8312 11.9525 14.8736 12.3715L15.3677 17.2543C15.4063 17.6356 15.0192 17.9167 14.6685 17.7621L10.1773 15.7836C9.79202 15.6139 9.35356 15.6139 8.9683 15.7836L4.47709 17.7621C4.12642 17.9167 3.73927 17.6356 3.77787 17.2543L4.27201 12.3715C4.31443 11.9525 4.17856 11.5351 3.89799 11.2211L0.628455 7.56096C0.373134 7.27521 0.520554 6.82079 0.895057 6.73967L5.69193 5.70061C6.1034 5.61149 6.45849 5.35343 6.67045 4.98967L9.14115 0.748463Z"
          fill="#9C9C9C"
          stroke="#9C9C9C"
        />
      </g>
    </>
  ),
  "tier-gold": (
    <>
      <circle {...TIER_ENCLOSURE} fill="#FFD258" stroke="#C18D00" />
      <g transform="translate(7.2139 6.9939) scale(0.5)">
        <path d={TIER_STAR_FILLED_D} fill="#C18D00" />
      </g>
    </>
  ),
  "tier-platinum": (
    <>
      <circle {...TIER_ENCLOSURE} fill="#C7D4DC" stroke="#75838B" />
      {/* Platinum's glyph is an EIGHT-point starburst, not the five-point star
          the other metal tiers use, and its frame box differs (18.01x20.49 at
          inset 3.43%/9.06% of the same 22px icon slot) — hence its own
          transform. Report 23da23f7. */}
      <g transform="translate(7.4966 6.8773) scale(0.5)">
        <path
          d="M8.18527 0.430285C8.58298 -0.143429 9.43125 -0.143428 9.82895 0.430286L12.2032 3.85523C12.3735 4.10087 12.6447 4.25746 12.9426 4.28211L17.0958 4.62577C17.7915 4.68334 18.2156 5.41797 17.9176 6.04925L16.1386 9.81786C16.011 10.0881 16.011 10.4013 16.1386 10.6716L17.9176 14.4402C18.2156 15.0715 17.7915 15.8061 17.0958 15.8637L12.9426 16.2074C12.6447 16.232 12.3735 16.3886 12.2032 16.6342L9.82895 20.0592C9.43125 20.6329 8.58298 20.6329 8.18527 20.0592L5.81104 16.6342C5.64076 16.3886 5.36954 16.232 5.07167 16.2074L0.918469 15.8637C0.222764 15.8061 -0.20137 15.0715 0.0966277 14.4402L1.8756 10.6716C2.00319 10.4013 2.00319 10.0881 1.8756 9.81786L0.0966273 6.04925C-0.20137 5.41796 0.222766 4.68334 0.918471 4.62577L5.07167 4.28211C5.36954 4.25746 5.64076 4.10087 5.81105 3.85523L8.18527 0.430285Z"
          fill="#75838B"
        />
      </g>
    </>
  ),
  "tier-diamond": (
    <>
      <circle {...TIER_ENCLOSURE} fill="#BDEDFF" stroke="#3AAFDD" />
      {/* Brilliant-cut gem: a trapezoid crown band ABOVE the pavilion point.
          Shipping only the pavilion is what made this read as a bare triangle
          (report 8924f60b, "appears incomplete and looks like a triangle"). */}
      <g transform="translate(7.075 8) scale(0.5)">
        <path
          d="M10.6092 17.8175C10.2098 18.2896 9.48188 18.2896 9.08243 17.8175L0.238537 7.36567C-0.311394 6.71575 0.150561 5.71973 1.00192 5.71973H18.6897C19.5411 5.71973 20.003 6.71575 19.4531 7.36567L10.6092 17.8175ZM19.0456 2.96446C19.6868 3.59101 19.2432 4.67969 18.3467 4.67969H1.43967C0.543188 4.67969 0.0995895 3.59101 0.74078 2.96446L3.4831 0.284773C3.66993 0.102211 3.92077 0 4.18199 0H15.6044C15.8656 0 16.1164 0.102211 16.3033 0.284773L19.0456 2.96446Z"
          fill="#3AAFDD"
        />
      </g>
    </>
  ),
  /**
   * Legend tier badge — bug 15fabce2 "Legends badge does not match Figma UI",
   * re-cut from the real export for report fd496624 ("the sword is completely
   * different from Figma").
   *
   * Unlike every other tier the Legend glyph is drawn edge-to-edge in its own
   * 32px box and CLIPPED by a circle — the blade runs off the bottom of the
   * frame (the path reaches y=53 in source space) and the disc is what cuts it
   * off. Approximating it with a blade+crossguard+pommel inside the disc, as
   * this previously did, produces a different silhouette entirely.
   *
   * "Legend = purple" still survives elsewhere and those are NOT authority:
   * tierData.ts:42, welcome-card.tsx:23 and WelcomeSuccessModal.tsx:60 all carry
   * purple legend gradients. Figma is the tiebreaker (Casey 2026-07-16, "just
   * match figma"); those sites are flagged, not silently changed, because they are
   * different surfaces and may have their own frames.
   */
  "tier-legend": (
    <>
      <defs>
        <clipPath id="skaiTierLegendClip">
          {/* The export masks with r=16 of a 32px box → r=8 here, i.e. just
              inside the 8.625 enclosure, leaving the disc's rim visible. */}
          <circle cx="12" cy="12" r="8" />
        </clipPath>
      </defs>
      <circle {...TIER_ENCLOSURE} fill="#F8E1D8" stroke="#FF7E50" />
      <g clipPath="url(#skaiTierLegendClip)">
        <g transform="translate(4 4) scale(0.5)">
          <path
            d="M15.2785 19.0892C15.6986 19.0299 16.125 19.0299 16.5451 19.0892C18.8622 19.4163 20.5494 21.4537 20.4391 23.7911L19.06 53H12.7637L11.3845 23.7911C11.2742 21.4537 12.9615 19.4163 15.2785 19.0892Z"
            fill="#FF7E50"
          />
          <path
            d="M15.9118 2C17.4766 2 18.7452 3.26853 18.7452 4.83333C18.7452 5.97573 18.0687 6.95954 17.0948 7.4078L17.433 14.7113C19.9443 15.0419 22.1656 16.0718 23.7834 17.5452L22.8451 19.1703C20.7956 18.2381 18.3316 17.694 15.6806 17.694C13.2105 17.694 10.9025 18.166 8.94101 18.9846L7.93262 17.2372C9.61779 15.8425 11.8725 14.9007 14.3925 14.659L14.7282 7.4078C13.7546 6.95943 13.0785 5.97553 13.0785 4.83333C13.0785 3.26853 14.347 2 15.9118 2Z"
            fill="#FF7E50"
          />
        </g>
      </g>
    </>
  ),
};

/**
 * SKAI Icon - Uses Figma design system icon set
 *
 * @example
 * // Default size (sm = 16px)
 * <SkaiIcon name="close" />
 *
 * // Large icon
 * <SkaiIcon name="hot" size="lg" />
 *
 * // Custom color
 * <SkaiIcon name="check-enclosed" color="#2DEDAD" />
 *
 * // With className for additional styling
 * <SkaiIcon name="loading" className="animate-spin text-primary" />
 */
const SkaiIcon = React.forwardRef<SVGSVGElement, SkaiIconProps>(
  ({ name, size = "sm", color, className, ...props }, ref) => {
    const pixelSize = sizeMap[size];

    return (
      <svg
        ref={ref}
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        style={{ color }}
        aria-hidden="true"
        {...props}
      >
        {iconPaths[name]}
      </svg>
    );
  },
);
SkaiIcon.displayName = "SkaiIcon";

export { SkaiIcon };
