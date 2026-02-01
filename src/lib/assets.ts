/**
 * SKAI Asset System
 *
 * Centralized asset management for images, icons, and media.
 * Designers can swap assets here without modifying component code.
 *
 * Usage:
 *   import { assets } from '@skai/ui';
 *   <img src={assets.logo.full} alt="SKAI" />
 */

/**
 * Asset URLs - Update these to change images across the entire app
 */
export const assets = {
  /**
   * Brand logos and marks
   */
  logo: {
    /** Full logo with text */
    full: "/assets/logo/skai-logo-full.svg",
    /** Logo mark only (no text) */
    mark: "/assets/logo/skai-logo-mark.svg",
    /** White version for dark backgrounds */
    white: "/assets/logo/skai-logo-white.svg",
    /** Dark version for light backgrounds */
    dark: "/assets/logo/skai-logo-dark.svg",
    /** Animated logo for loading states */
    animated: "/assets/logo/skai-logo-animated.svg",
  },

  /**
   * Common icons (for when Lucide icons aren't suitable)
   */
  icons: {
    wallet: "/assets/icons/wallet.svg",
    swap: "/assets/icons/swap.svg",
    chart: "/assets/icons/chart.svg",
    settings: "/assets/icons/settings.svg",
    ai: "/assets/icons/ai.svg",
    game: "/assets/icons/game.svg",
  },

  /**
   * Token/crypto icons
   * Note: Most tokens use dynamic URLs, these are fallbacks
   */
  tokens: {
    eth: "/assets/tokens/eth.svg",
    usdc: "/assets/tokens/usdc.svg",
    usdt: "/assets/tokens/usdt.svg",
    btc: "/assets/tokens/btc.svg",
    skai: "/assets/tokens/skai.svg",
    unknown: "/assets/tokens/unknown.svg",
  },

  /**
   * Chain/network icons
   */
  chains: {
    ethereum: "/assets/chains/ethereum.svg",
    base: "/assets/chains/base.svg",
    polygon: "/assets/chains/polygon.svg",
    arbitrum: "/assets/chains/arbitrum.svg",
    optimism: "/assets/chains/optimism.svg",
  },

  /**
   * Wallet provider icons
   */
  wallets: {
    metamask: "/assets/wallets/metamask.svg",
    walletconnect: "/assets/wallets/walletconnect.svg",
    coinbase: "/assets/wallets/coinbase.svg",
    rainbow: "/assets/wallets/rainbow.svg",
  },

  /**
   * Illustrations and graphics
   */
  illustrations: {
    hero: "/assets/illustrations/hero.svg",
    trading: "/assets/illustrations/trading.svg",
    portfolio: "/assets/illustrations/portfolio.svg",
    games: "/assets/illustrations/games.svg",
    ai: "/assets/illustrations/ai.svg",
    empty: "/assets/illustrations/empty.svg",
    error: "/assets/illustrations/error.svg",
    success: "/assets/illustrations/success.svg",
    onboarding: {
      step1: "/assets/illustrations/onboarding-1.svg",
      step2: "/assets/illustrations/onboarding-2.svg",
      step3: "/assets/illustrations/onboarding-3.svg",
    },
  },

  /**
   * Background images and patterns
   */
  backgrounds: {
    gradient: "/assets/backgrounds/gradient.svg",
    pattern: "/assets/backgrounds/pattern.svg",
    mesh: "/assets/backgrounds/mesh.svg",
    glow: "/assets/backgrounds/glow.svg",
  },

  /**
   * Social media icons
   */
  social: {
    twitter: "/assets/social/twitter.svg",
    discord: "/assets/social/discord.svg",
    telegram: "/assets/social/telegram.svg",
    github: "/assets/social/github.svg",
  },

  /**
   * Achievement/badge icons
   */
  badges: {
    rookie: "/assets/badges/rookie.svg",
    trader: "/assets/badges/trader.svg",
    pro: "/assets/badges/pro.svg",
    whale: "/assets/badges/whale.svg",
    diamond: "/assets/badges/diamond.svg",
  },
} as const;

/**
 * External asset URL generators
 * Use these for dynamic token images, NFTs, etc.
 */
export const assetUrls = {
  /**
   * Get token icon from Trust Wallet assets
   */
  tokenIcon: (address: string, chainId: number = 1): string => {
    const chainName =
      {
        1: "ethereum",
        8453: "base",
        137: "polygon",
        42161: "arbitrum",
      }[chainId] || "ethereum";

    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${address}/logo.png`;
  },

  /**
   * Get token icon from CoinGecko
   */
  coingeckoIcon: (coinId: string): string => {
    return `https://assets.coingecko.com/coins/images/${coinId}/small/logo.png`;
  },

  /**
   * Get NFT image from IPFS
   */
  ipfsImage: (cid: string): string => {
    return `https://ipfs.io/ipfs/${cid}`;
  },

  /**
   * Get avatar from ENS
   */
  ensAvatar: (name: string): string => {
    return `https://metadata.ens.domains/mainnet/avatar/${name}`;
  },

  /**
   * Generate gradient avatar from address
   */
  gradientAvatar: (address: string): string => {
    return `https://avatar.vercel.sh/${address}?size=200`;
  },
};

/**
 * Placeholder images for development/empty states
 */
export const placeholders = {
  /** Generic placeholder */
  default:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%231B2236'%3E%3Crect width='200' height='200'/%3E%3C/svg%3E",

  /** Token placeholder with initials */
  token: (symbol: string): string => {
    const initials = symbol.slice(0, 2).toUpperCase();
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%231B2236'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='sans-serif' font-size='14'%3E${initials}%3C/text%3E%3C/svg%3E`;
  },

  /** Avatar placeholder */
  avatar:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%231B2236'/%3E%3Ccircle cx='20' cy='15' r='7' fill='%238B92A8'/%3E%3Cellipse cx='20' cy='35' rx='14' ry='10' fill='%238B92A8'/%3E%3C/svg%3E",

  /** Chart placeholder */
  chart:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' fill='%231B2236'%3E%3Crect width='400' height='200' rx='8'/%3E%3Cpolyline points='20,150 80,100 140,120 200,60 260,80 320,40 380,70' stroke='%2356C0F6' stroke-width='2' fill='none'/%3E%3C/svg%3E",
};

/**
 * Type definitions for assets
 */
export type Assets = typeof assets;
export type AssetCategory = keyof Assets;

/**
 * Get asset by path
 * Usage: getAsset("logo.full") => "/assets/logo/skai-logo-full.svg"
 */
export function getAsset(path: string): string {
  const keys = path.split(".");
  let current: unknown = assets;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return placeholders.default;
    }
  }

  return typeof current === "string" ? current : placeholders.default;
}

export default assets;
