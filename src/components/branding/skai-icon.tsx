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
  // Brand icons
  | "google"
  | "apple"
  // Tier icons
  | "tier-free"
  | "tier-bronze"
  | "tier-silver"
  | "tier-gold"
  | "tier-platinum"
  | "tier-diamond";

export type SkaiIconSize = "xs" | "sm" | "md" | "lg";

export interface SkaiIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon name from the SKAI design system */
  name: SkaiIconName;
  /** Size preset from Figma: xs (10px), sm (16px), md (24px), lg (48px) */
  size?: SkaiIconSize;
  /** Custom color (defaults to currentColor) */
  color?: string;
}

const sizeMap: Record<SkaiIconSize, number> = {
  xs: 10,
  sm: 16,
  md: 24,
  lg: 48,
};

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
      d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 00-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 00-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </>
  ),
  x: (
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
      fill="currentColor"
    />
  ),
  twitter: (
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
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
        y="16"
        textAnchor="middle"
        fill="#878787"
        fontSize="10"
        fontWeight="bold"
      >
        F
      </text>
    </>
  ),
  "tier-bronze": (
    <>
      <circle cx="12" cy="12" r="9" fill="#CD7F32" />
      <path
        d="M12 6l2 4h4l-3.5 3 1.5 5-4-3-4 3 1.5-5L6 10h4l2-4z"
        fill="#8B4513"
      />
    </>
  ),
  "tier-silver": (
    <>
      <circle cx="12" cy="12" r="9" fill="#C0C0C0" />
      <path
        d="M12 6l2 4h4l-3.5 3 1.5 5-4-3-4 3 1.5-5L6 10h4l2-4z"
        fill="#808080"
      />
    </>
  ),
  "tier-gold": (
    <>
      <circle cx="12" cy="12" r="9" fill="#FFD700" />
      <path
        d="M12 6l2 4h4l-3.5 3 1.5 5-4-3-4 3 1.5-5L6 10h4l2-4z"
        fill="#B8860B"
      />
    </>
  ),
  "tier-platinum": (
    <>
      <defs>
        <linearGradient id="platinumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5E4E2" />
          <stop offset="50%" stopColor="#A9A9A9" />
          <stop offset="100%" stopColor="#E5E4E2" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#platinumGrad)" />
      <path
        d="M12 5l2.5 5h5l-4 3.5 1.5 5.5-5-3.5-5 3.5 1.5-5.5-4-3.5h5l2.5-5z"
        fill="#696969"
        stroke="#505050"
        strokeWidth="0.5"
      />
    </>
  ),
  "tier-diamond": (
    <>
      <defs>
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B9F2FF" />
          <stop offset="50%" stopColor="#4DD0E1" />
          <stop offset="100%" stopColor="#00BCD4" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#diamondGrad)" />
      <path d="M12 4l4 4-4 12-4-12 4-4z" fill="white" fillOpacity="0.9" />
      <path d="M8 8h8l-4 12-4-12z" fill="#00ACC1" />
      <path d="M12 4l4 4H8l4-4z" fill="#4DD0E1" />
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
 * <SkaiIcon name="check-enclosed" color="#17F9B4" />
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
