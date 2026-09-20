import * as React from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";
import { urls } from "../../lib/constants";
import { SkaiIcon } from "../branding/skai-icon";

export interface LandingFooterProps extends React.HTMLAttributes<HTMLElement> {}

const footer = content.landing.footer;

/**
 * The same Terms / Privacy and social pair the landing header draws, moved to
 * the foot of the dashboard. The 768 board (2005:16658) puts the legal nav
 * 117x16 at 30,978 and the socials 117x16 at 621,978 in a 1024-tall frame, so
 * the inset is 30 all round there, and both rows sit on a 32 gap: Terms 33 at
 * x=0 then Privacy at x=65, and the three 16px icons at x=5, 53 and 101. No
 * dashboard board exists at 375 or 1440, so those widths take the insets the
 * header's own boards measure for this pair, 24 and 32, and the same gaps the
 * header draws (24 for the legal pair below 768, 32 for the icons throughout).
 */
const LandingFooter = React.forwardRef<HTMLElement, LandingFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "relative z-[100] w-full flex justify-between items-center p-6 md:p-[30px] lg:p-8 mt-auto",
        className,
      )}
      {...props}
    >
      {/* Left: Terms and Privacy */}
      <div className="flex gap-6 md:gap-8 items-center">
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

      {/* Right: the three socials the board draws, in its order: Discord, X,
          Instagram. Report 752e313b had trimmed eight icons to four (X, Discord,
          Telegram, Instagram) for conversion; Casey's ruling of 2026-09-19 puts
          the socials per board, and 2005:16658 draws icon16/discord, twitter and
          instagram with no Telegram, the same three the onboarding headers
          draw. The Telegram link still ships on /terms, /privacy and in the app,
          so no channel is lost; `urls.social.*` keeps every entry. None are
          hidden on mobile. */}
      <div className="flex gap-8 items-center">
        <a href={urls.social.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="discord" size="sm" />
        </a>
        <a href={urls.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-4 h-4 flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-70">
          <SkaiIcon name="x" size="sm" />
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
