/**
 * Legal Page Template
 *
 * Matches Figma designs for Privacy Policy and Terms of Service pages.
 * Figma nodes: 2311:7088 (Privacy Desktop), 2311:7680 (Terms Desktop),
 *              2311:5968 (Privacy Tablet), 2311:8793 (Terms Tablet),
 *              2311:8199 (Privacy Mobile), 2311:6560 (Terms Mobile)
 *
 * Features:
 * - Full-page dark layout with Green Coal background
 * - Green glow orb (Ellipse 24) + BarTickerBackground
 * - Header with title + Skai logo
 * - Numbered sections with subsections
 * - Footer with nav links + social icons
 * - Responsive: Desktop (1440+), Tablet (768-1439), Mobile (<768)
 *
 * @example
 * ```tsx
 * <LegalPageTemplate
 *   title="Privacy Policy"
 *   lastUpdated="February 6, 2025"
 *   sections={privacySections}
 *   LinkComponent={Link}
 * />
 * ```
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { BarTickerBackground } from "../components/backgrounds/bar-ticker-background";
import { SkaiLogo } from "../components/branding/skai-logo";

// =============================================================================
// Types
// =============================================================================

export interface LegalSection {
  /** Unique section identifier for anchoring */
  id: string;
  /** Display number: "1", "2", etc. */
  number: string;
  /** Section title */
  title: string;
  /** Section body content (JSX) */
  content: React.ReactNode;
  /** Optional subsections */
  subsections?: LegalSubsection[];
}

export interface LegalSubsection {
  /** Unique subsection identifier */
  id: string;
  /** Display number: "1.1", "1.2", etc. */
  number: string;
  /** Subsection title */
  title: string;
  /** Subsection body content (JSX) */
  content: React.ReactNode;
}

export interface LegalFooterLink {
  /** Link display text */
  label: string;
  /** Link URL or route */
  href: string;
}

export interface LegalPageTemplateProps {
  /** Page title: "Privacy Policy" or "Terms of Service" */
  title: string;
  /** Last updated date string: "February 6, 2025" */
  lastUpdated: string;
  /** Document sections */
  sections: LegalSection[];
  /** Optional notice badge at top (e.g. "Important notice" pill for Terms) */
  noticeBadge?: React.ReactNode;
  /** Optional callout box below header (e.g. risk warning for Terms) */
  headerCallout?: React.ReactNode;
  /** Footer navigation links */
  footerLinks?: LegalFooterLink[];
  /** Discord URL */
  discordUrl?: string;
  /** Telegram URL */
  telegramUrl?: string;
  /** Twitter/X URL */
  twitterUrl?: string;
  /** Instagram URL */
  instagramUrl?: string;
  /** LinkedIn URL */
  linkedinUrl?: string;
  /** YouTube URL */
  youtubeUrl?: string;
  /** Custom logo element for header (defaults to SkaiLogo) */
  headerLogo?: React.ReactNode;
  /** Custom link component for internal routing (React Router Link) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinkComponent?: React.ComponentType<any>;
  /** Show back navigation button */
  showBackButton?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Social Icon Components (matching landing-header.tsx)
// =============================================================================

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
  </svg>
);

const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const TwitterXIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// =============================================================================
// Green Glow Orb (Ellipse 24)
// =============================================================================

/**
 * Self-contained green glow orb matching Figma Ellipse 24.
 * Uses CSS media queries via style tag for responsive sizing.
 */
function GreenGlowOrb() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .legal-green-orb {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          background-color: #17F9B4;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          width: 700px;
          height: 700px;
          bottom: -550px;
          opacity: 0.12;
          filter: blur(100px);
        }
        @media (min-width: 768px) {
          .legal-green-orb {
            width: 1148px;
            height: 1148px;
            bottom: -944px;
            opacity: 0.19;
            filter: blur(180px);
          }
        }
        @media (min-width: 1024px) {
          .legal-green-orb {
            width: 1800px;
            height: 1800px;
            bottom: -1554px;
            opacity: 0.19;
            filter: blur(272px);
          }
        }
      `}} />
      <div className="legal-green-orb" aria-hidden="true" />
    </>
  );
}

// =============================================================================
// Section Components
// =============================================================================

function LegalSectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-8">
      {/* Section heading: number + title */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mulish text-[14px] md:text-[16px] text-[#E0E0E0] w-8 shrink-0">
          {section.number}
        </span>
        <h2 className="font-manrope text-[12px] md:text-[14px] text-[#E0E0E0]">
          {section.title}
        </h2>
      </div>

      {/* Section content */}
      <div className="pl-11 font-manrope text-[10px] md:text-[12px] leading-[14px] md:leading-[16px] text-[#E0E0E0] tracking-[-0.48px]">
        {section.content}
      </div>

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-6 space-y-6">
          {section.subsections.map((sub) => (
            <LegalSubsectionBlock key={sub.id} subsection={sub} />
          ))}
        </div>
      )}
    </section>
  );
}

function LegalSubsectionBlock({ subsection }: { subsection: LegalSubsection }) {
  return (
    <div id={subsection.id} className="scroll-mt-8">
      {/* Sub-section heading: number + title */}
      <div className="flex items-baseline gap-3 mb-2 pl-11">
        <span className="font-mulish text-[10px] md:text-[12px] text-[#E0E0E0] w-8 shrink-0">
          {subsection.number}
        </span>
        <h3 className="font-manrope font-bold text-[10px] md:text-[12px] text-[#E0E0E0]">
          {subsection.title}
        </h3>
      </div>

      {/* Sub-section content */}
      <div className="pl-[5.75rem] font-manrope text-[10px] md:text-[12px] leading-[14px] md:leading-[16px] text-[#E0E0E0] tracking-[-0.48px]">
        {subsection.content}
      </div>
    </div>
  );
}

// =============================================================================
// Default Footer Links
// =============================================================================

const DEFAULT_FOOTER_LINKS: LegalFooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "https://docs.skai.trade" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

// =============================================================================
// Main Component
// =============================================================================

export function LegalPageTemplate({
  title,
  lastUpdated,
  sections,
  noticeBadge,
  headerCallout,
  footerLinks = DEFAULT_FOOTER_LINKS,
  discordUrl,
  telegramUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
  headerLogo,
  LinkComponent,
  showBackButton = true,
  className,
}: LegalPageTemplateProps) {
  // Fallback link component (plain <a> if no router Link provided)
  const NavLink =
    LinkComponent ||
    (({
      to,
      className,
      children,
    }: {
      to: string;
      className?: string;
      children: React.ReactNode;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ));

  return (
    <div className={cn("relative min-h-screen bg-[#001615] overflow-hidden", className)}>
      {/* Background Elements */}
      <GreenGlowOrb />
      <BarTickerBackground />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ================================================================
            HEADER - Back button, Title left, Logo right
            ================================================================ */}
        <header className="px-6 md:px-16 pt-10 md:pt-16">
          <div className="max-w-[896px] mx-auto w-full">
            {/* Back navigation */}
            {showBackButton && (
              <div className="mb-4">
                <NavLink
                  to="/"
                  className="inline-flex items-center gap-1.5 font-manrope text-[12px] md:text-[14px] text-[#95A09F] hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </NavLink>
              </div>
            )}
            <div className="flex items-start justify-between">
              <div>
                {/* Page title - Manrope Light */}
                <h1 className="font-manrope font-light text-[24px] md:text-[32px] tracking-[-1.28px] text-[#FFFFEE]">
                  {title}
                </h1>

                {/* Last Updated */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mulish text-[10px] md:text-[12px] text-[#95A09F]">
                    Last Updated
                  </span>
                  <span className="font-mulish text-[10px] md:text-[12px] text-[#56C7F3]">
                    {lastUpdated}
                  </span>
                </div>
              </div>

              {/* Logo */}
              <div className="shrink-0">
                {headerLogo || <SkaiLogo size="medium" variant="white" />}
              </div>
            </div>
          </div>
        </header>

        {/* Optional Notice Badge (e.g. "Important notice" pill) */}
        {noticeBadge && (
          <div className="px-6 md:px-16 mt-4">
            <div className="max-w-[896px] mx-auto w-full">
              {noticeBadge}
            </div>
          </div>
        )}

        {/* Optional Header Callout (e.g. risk warning) */}
        {headerCallout && (
          <div className="px-6 md:px-16 mt-6">
            <div className="max-w-[896px] mx-auto w-full">
              {headerCallout}
            </div>
          </div>
        )}

        {/* ================================================================
            CONTENT - Numbered sections with backdrop for readability
            ================================================================ */}
        <main className="flex-1 w-full max-w-[896px] mx-auto px-6 md:px-16 lg:px-0 py-8 md:py-12">
          <div className="space-y-10 relative rounded-xl bg-[#001615]/70 backdrop-blur-sm p-6 md:p-8">
            {sections.map((section) => (
              <LegalSectionBlock key={section.id} section={section} />
            ))}
          </div>
        </main>

        {/* ================================================================
            FOOTER - Pixel-perfect match to Figma nodes:
            Desktop 2311:6560 | Tablet 2311:7680 | Mobile 2311:8793
            - No divider line, no copyright
            - Desktop: pb-[24px] px-[32px], Manrope 14px, gap-[32px]
            - Tablet: pb-[30px] px-[30px], Manrope 12px, gap-[32px]
            - Mobile: pb-[25px] px-[24px], column centered, gap-[24px]/[32px]
            ================================================================ */}
        <footer className="relative w-full mt-auto">
          {/* Solid background to prevent bar ticker from bleeding through */}
          <div className="absolute inset-0 bg-[#001615]" />

          {/* Mobile: column centered | Tablet+: row space-between */}
          <div className={cn(
            "relative w-full flex",
            // Mobile: column, centered, full-width with padding
            "flex-col items-center gap-[24px] px-[24px] pb-[25px] pt-[16px]",
            // Tablet: row, space-between
            "md:flex-row md:items-center md:justify-between md:gap-0 md:px-[30px] md:pb-[30px] md:pt-[12px]",
            // Desktop: wider padding
            "lg:px-[32px] lg:pb-[24px] lg:pt-[12px]"
          )}>
            {/* Navigation links */}
            <nav className={cn(
              "flex items-center font-manrope text-[#E0E0E0]",
              // Mobile: 12px, gap-[24px]
              "text-[12px] leading-[16px] tracking-[-0.48px] gap-[24px]",
              // Desktop: 14px, gap-[32px]
              "md:gap-[32px]",
              "lg:text-[14px] lg:leading-[18px] lg:tracking-[-0.56px]"
            )}>
              {footerLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Social icons — 16px, gap-[32px] at all breakpoints */}
            <div className="flex items-center gap-[32px]">
              {discordUrl && (
                <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="text-[#E0E0E0] hover:text-white transition-colors" aria-label="Discord">
                  <DiscordIcon className="h-[16px] w-[16px]" />
                </a>
              )}
              {telegramUrl && (
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="text-[#E0E0E0] hover:text-white transition-colors" aria-label="Telegram">
                  <TelegramIcon className="h-[16px] w-[16px]" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-[#E0E0E0] hover:text-white transition-colors" aria-label="X (Twitter)">
                  <TwitterXIcon className="h-[16px] w-[16px]" />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#E0E0E0] hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="h-[16px] w-[16px]" />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#E0E0E0] hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedInIcon className="h-[16px] w-[16px]" />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-[#E0E0E0] hover:text-white transition-colors" aria-label="YouTube">
                  <YouTubeIcon className="h-[16px] w-[16px]" />
                </a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LegalPageTemplate;
