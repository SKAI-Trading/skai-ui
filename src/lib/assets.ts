/**
 * SKAI Asset System
 *
 * Centralized asset management for images, icons, and media.
 * Designers can swap assets here without modifying component code.
 *
 * Usage:
 *   import { assets } from '@skai/ui';
 *   <img src={assets.logo.full} alt="SKAI" />
 *
 * Note: For icons, prefer using Lucide icons via `lucide-react`.
 * Custom SVG icons are reserved for brand-specific graphics.
 *
 * @see docs/ASSET_AUDIT.md for asset status and usage
 */

/**
 * Asset URLs - Update these to change images across the entire app
 * Only includes assets that actually exist in public/assets/
 */
export const assets = {
  /**
   * Brand logos and marks
   * Location: public/assets/logo/
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
  },

  /**
   * Token/crypto icons
   * Location: public/assets/tokens/
   * Note: Most tokens use dynamic URLs from Trust Wallet or CoinGecko
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
   * Location: public/assets/chains/
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
   * Location: public/assets/wallets/
   */
  wallets: {
    metamask: "/assets/wallets/metamask.svg",
    walletconnect: "/assets/wallets/walletconnect.svg",
    coinbase: "/assets/wallets/coinbase.svg",
    rainbow: "/assets/wallets/rainbow.svg",
  },

  /**
   * Illustrations and graphics
   * Location: public/assets/illustrations/
   */
  illustrations: {
    hero: "/assets/illustrations/hero.svg",
    trading: "/assets/illustrations/trading.svg",
    empty: "/assets/illustrations/empty.svg",
    error: "/assets/illustrations/error.svg",
    success: "/assets/illustrations/success.svg",
  },

  /**
   * Background images and patterns
   * Location: public/assets/backgrounds/
   */
  backgrounds: {
    gradient: "/assets/backgrounds/gradient-1.svg",
    pattern: "/assets/backgrounds/pattern-1.svg",
  },

  /**
   * Game thumbnails and assets
   * Location: public/assets/games/
   */
  games: {
    blackjack: "/assets/games/blackjack.png",
    chicken: "/assets/games/chicken.png",
    coinFlip: "/assets/games/coin-flip.png",
    comingSoon: "/assets/games/coming-soon.png",
    cosmicSlots: "/assets/games/cosmic-slots.png",
    crash: "/assets/games/crash.png",
    fortuneWheel: "/assets/games/fortune-wheel.png",
    gems: "/assets/games/gems.png",
    hilo: "/assets/games/hilo.png",
    megaSlots: "/assets/games/mega-slots.png",
    mines: "/assets/games/mines.png",
    plinko: "/assets/games/plinko.png",
    poker: "/assets/games/poker.png",
    roulette: "/assets/games/roulette.png",
    safariSlots: "/assets/games/safari-slots.png",
    scratchers: "/assets/games/scratchers.png",
    skaiCross: "/assets/games/skai-cross.svg",
    skaiQuest: "/assets/games/skai-quest.png",
    slots: "/assets/games/slots.png",
    towers: "/assets/games/towers.png",
  },

  /**
   * UI container assets (3D and pixel styles)
   * Location: public/assets/ui/
   */
  ui: {
    "3d": {
      container: "/assets/ui/3d_style/container_3d.png",
      clickable: "/assets/ui/3d_style/container_3d_clickable.png",
      progressFill: "/assets/ui/3d_style/container_3d_progress_fill.png",
      slot: "/assets/ui/3d_style/container_3d_slot.png",
    },
    pixel: {
      container: "/assets/ui/pixel_style/container_pixel.png",
      clickable: "/assets/ui/pixel_style/container_pixel_clickable.png",
      progressFill: "/assets/ui/pixel_style/container_pixel_progress_fill.png",
      slot: "/assets/ui/pixel_style/container_pixel_slot.png",
    },
  },

  /**
   * PWA app icons
   * Location: public/assets/pwa/
   */
  pwa: {
    icon72: "/assets/pwa/icon-72x72.png",
    icon96: "/assets/pwa/icon-96x96.png",
    icon128: "/assets/pwa/icon-128x128.png",
    icon144: "/assets/pwa/icon-144x144.png",
    icon152: "/assets/pwa/icon-152x152.png",
    icon192: "/assets/pwa/icon-192x192.png",
    icon384: "/assets/pwa/icon-384x384.png",
    icon512: "/assets/pwa/icon-512x512.png",
    maskable192: "/assets/pwa/icon-maskable-192x192.png",
    maskable512: "/assets/pwa/icon-maskable-512x512.png",
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
