import * as React from "react";
import { cn } from "../../lib/utils";
import { content } from "../../lib/content";
import { urls } from "../../lib/constants";
import { SkaiIcon } from "../branding/skai-icon";

export interface LandingFooterProps extends React.HTMLAttributes<HTMLElement> {}

const footer = content.landing.footer;

/**
 * The same Terms / Privacy and social pair the landing header draws, moved to
 * the foot of the dashboard. Both rows sit on a 32 gap, the legal pair on 24
 * below 768, and the three 16px icons at x=5, 53 and 101 of a 117 nav. Per
 * width the dashboard boards draw:
 *   375 (2005:26526)  inset 24, Terms and Privacy in Manrope Bold 14/16
 *   768 (2005:16658, 2424:4081)  inset 30 all round, Paragraph 2 at 12/16:
 *        the legal nav 117x16 at 30,978, Terms 33 at x=0, Privacy at x=65
 *   1440 (2422:2943)  32 at the sides and 24 under the navs (y=858, 18 tall,
 *        in a 900 frame), Paragraph 2 at 14/18
 * The pair is Gray 100, written as its hex: skai.trade's Tailwind theme keeps a
 * legacy `skai.gray-100` (Ash, #95A09F) that takes the `skai-gray-100` name there.
 */
const LandingFooter = React.forwardRef<HTMLElement, LandingFooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "relative z-[100] w-full flex justify-between items-center p-6 md:p-[30px] lg:px-8 lg:pt-8 lg:pb-6 mt-auto",
        className,
      )}
      {...props}
    >
      {/* Left: Terms and Privacy */}
      <div className="flex gap-6 md:gap-8 items-center">
        <a
          href={urls.legal.terms}
          className="text-[#E0E0E0] no-underline font-manrope text-para-1-mobile font-bold md:font-normal md:text-para-2-tablet lg:text-para-2 transition-colors duration-200 hover:text-white"
        >
          {footer.links.terms}
        </a>
        <a
          href={urls.legal.privacy}
          className="text-[#E0E0E0] no-underline font-manrope text-para-1-mobile font-bold md:font-normal md:text-para-2-tablet lg:text-para-2 transition-colors duration-200 hover:text-white"
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
