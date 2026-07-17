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
    instagram: "https://instagram.com/skai.trade",
    tiktok: "https://www.tiktok.com/@skai.trade",
    facebook: "https://www.facebook.com/share/1B2YE8yBua/",
    linkedin: "https://www.linkedin.com/company/skaitrade/",
    youtube: "https://www.youtube.com/@skaitrade",
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

/**
 * Build a user's referral link.
 *
 * `/ref/{code}` is the route that exists: it captures the code into localStorage
 * and forwards on. `/referral` is registered with NO param, so `/referral/alice`
 * matches nothing — and BOTH share surfaces hand-rolled that dead URL in slightly
 * different ways before this existed (the wallet's ShareCard emitted a flat
 * /wallet link; the app's SharePortfolioModal emitted /referral/{username}). One
 * builder so a third surface cannot invent a fourth wrong shape.
 *
 * The code is a USERNAME (attribution resolves it with `.eq("username", …)`), and
 * it is matched literally, so it is lowercased here rather than at each call site.
 *
 * ENCODED, not interpolated raw: `users.username` has NO database constraint and
 * no client-side charset validation, so it can contain `/`, `?` or `#`. Raw, a
 * username like `alice/../admin` or `alice?next=…` escapes its path segment and
 * produces a link that reads like a referral and resolves to something else — the
 * X intent encodes the whole URL, but the clipboard copy and the visible label do
 * not. encodeURIComponent keeps the code in one segment and is a no-op for
 * ordinary usernames (alphanumerics, `_`, `-`, `.` pass through); React Router
 * decodes `:code` on the way back in, so the round-trip to `.eq("username", …)`
 * stays exact.
 *
 * Returns null when there is no username: such a user has no attributable code,
 * and callers should fall back to a plain product link rather than emit
 * `/ref/null`.
 */
export function referralUrl(username: string | null | undefined): string | null {
  const code = username?.trim().toLowerCase();
  return code ? `${urls.app.landing}/ref/${encodeURIComponent(code)}` : null;
}

export const brand = {
  name: "SKAI",
  domain: "skai.trade",
  copyright: `\u00A9 ${new Date().getFullYear()} SKAI.trade. All rights reserved.`,
  copyrightShort: `\u00A9 ${new Date().getFullYear()}`,
  twitterHandle: "@SkaiTrade",
} as const;
