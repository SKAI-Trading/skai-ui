/**
 * SKAI Platform Constants
 *
 * Centralized URLs, social links, and brand constants for the entire SKAI platform.
 * Import from '@skai/ui' in consuming apps to ensure consistency.
 *
 * Usage:
 *   import { urls, brand } from '@skai/ui';
 *   <a href={urls.social.discord}>Discord</a>
 */

export const urls = {
  social: {
    discord: "https://discord.gg/skaitrade",
    twitter: "https://x.com/SkaiTrade",
    telegram: "https://t.me/skaitrade",
    twitterIntent: "https://twitter.com/intent/tweet",
  },
  app: {
    main: "https://app.skai.trade",
    landing: "https://skai.trade",
    docs: "https://docs.skai.trade",
    staging: "https://staging.skai.trade",
  },
  legal: {
    terms: "/terms",
    privacy: "/privacy",
  },
} as const;

export const brand = {
  name: "SKAI",
  domain: "skai.trade",
  copyright: `\u00A9 ${new Date().getFullYear()} SKAI.trade. All rights reserved.`,
  copyrightShort: `\u00A9 ${new Date().getFullYear()}`,
  twitterHandle: "@SkaiTrade",
} as const;
