import * as React from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";
import { urls } from "../../lib/constants";
import { SkaiIcon } from "../branding/skai-icon";

export interface LandingFooterProps extends React.HTMLAttributes<HTMLElement> {}

const footer = content.landing.footer;

const LandingFooter = React.forwardRef<HTMLElement, LandingFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "relative z-[100] w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 mt-auto",
        className,
      )}
      {...props}
    >
      {/* Left: Terms and Privacy */}
      <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
        <a
          href={urls.legal.terms}
          className="text-[#E0E0E0] no-underline font-manrope text-[14px] font-normal leading-[18px] tracking-[-0.56px] transition-colors duration-200 hover:text-white"
        >
          {footer.links.terms}
        </a>
        <a
          href={urls.legal.privacy}
          className="text-[#E0E0E0] no-underline font-manrope text-[14px] font-normal leading-[18px] tracking-[-0.56px] transition-colors duration-200 hover:text-white"
        >
          {footer.links.privacy}
        </a>
      </div>

      {/* Right: Social Media Icons — the TOP FIVE only.
          Report 752e313b: eight icons here caused decision fatigue and lowered
          conversion; the ticket names the five to keep — Instagram, TikTok,
          Facebook, Twitter/X, Discord. Telegram, LinkedIn and YouTube are no
          longer rendered (their `urls.social.*` entries stay in constants so
          other surfaces and future use are unaffected). */}
      <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
        <a href={urls.social.discord} target="_blank" rel="noopener noreferrer" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="discord" size="sm" />
        </a>
        <a href={urls.social.twitter} target="_blank" rel="noopener noreferrer" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="x" size="sm" />
        </a>
        <a href={urls.social.instagram} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex w-4 h-4 items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="instagram" size="sm" />
        </a>
        <a href={urls.social.tiktok} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex w-4 h-4 items-center justify-center text-white transition-opacity duration-200 hover:opacity-70" aria-label="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        </a>
        <a href={urls.social.facebook} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex w-4 h-4 items-center justify-center text-white transition-opacity duration-200 hover:opacity-70" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </div>
    </footer>
  ),
);
LandingFooter.displayName = "LandingFooter";

export { LandingFooter };
