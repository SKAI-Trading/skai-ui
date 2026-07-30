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

      {/* Right: Social Media Icons — the four core channels only.
          Report 752e313b: eight icons here caused decision fatigue and lowered
          conversion. Per Casey's decision the kept set is X, Discord, Telegram
          and Instagram. TikTok, Facebook, LinkedIn and YouTube are no longer
          rendered (their `urls.social.*` entries stay in constants so other
          surfaces and future use are unaffected). Four icons fit at every
          breakpoint, so none are hidden on mobile. */}
      <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
        <a href={urls.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="x" size="sm" />
        </a>
        <a href={urls.social.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="discord" size="sm" />
        </a>
        <a href={urls.social.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="telegram" size="sm" />
        </a>
        <a href={urls.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="instagram" size="sm" />
        </a>
      </div>
    </footer>
  ),
);
LandingFooter.displayName = "LandingFooter";

export { LandingFooter };
