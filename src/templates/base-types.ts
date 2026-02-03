/**
 * Base Types for Page Templates
 *
 * These types define the contract between page logic (SKAI-Trading)
 * and page presentation (skai-ui templates).
 *
 * RULE: Templates receive data + callbacks, never fetch data themselves.
 */

import type { TierLevel } from "../components/trading/tier-badge";

// =============================================================================
// COMMON TYPES
// =============================================================================

/** User identity displayed across the app */
export interface UserIdentity {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  walletAddress: string;
  tier?: TierLevel;
  isVerified?: boolean;
}

/** Social links for a profile */
export interface SocialLinks {
  twitter?: string;
  discord?: string;
  discordUserId?: string;
  telegram?: string;
  website?: string;
}

/** Token data for display */
export interface TokenDisplay {
  id: string;
  symbol: string;
  name: string;
  avatarUrl?: string;
  contractAddress?: string;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  holderCount?: number;
  currentSupply?: number;
  totalSupply?: number;
}

/** Stats that can be shown/hidden based on privacy settings */
export interface ProfileStats {
  totalVolume: number;
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  averageTradeSize: number;
  bestTradePnl: number;
  worstTradePnl: number;
}

/** Badge data */
export interface BadgeDisplay {
  id: string;
  name: string;
  icon: string;
  color?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

/** Trading group display */
export interface TradingGroupDisplay {
  id: string;
  name: string;
  avatarUrl?: string;
  memberCount: number;
  myRole?: string;
}

/** Stream status */
export interface StreamStatus {
  isLive: boolean;
  streamId?: string;
  viewerCount?: number;
  title?: string;
}

// =============================================================================
// PRIVACY SETTINGS
// =============================================================================

export interface PrivacySettings {
  showWalletAddress?: boolean;
  showWalletBalance?: boolean;
  showTrades?: boolean;
  showHoldings?: boolean;
  showPnl?: boolean;
  allowCopyTrading?: boolean;
}

// =============================================================================
// COMMON CALLBACKS
// =============================================================================

/** Navigation callbacks */
export interface NavigationCallbacks {
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

/** Clipboard callbacks */
export interface ClipboardCallbacks {
  onCopy: (text: string) => Promise<boolean>;
}

/** Modal control callbacks */
export interface ModalCallbacks {
  onOpenModal: (modalId: string, data?: unknown) => void;
  onCloseModal: (modalId: string) => void;
}

// =============================================================================
// PAGE TEMPLATE BASE
// =============================================================================

export interface PageTemplateBaseProps {
  /** Loading state */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
  /** Custom class names */
  className?: string;
}
