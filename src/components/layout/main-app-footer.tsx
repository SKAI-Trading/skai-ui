import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiIcon, type SkaiIconName } from "../branding/skai-icon";

// =============================================================================
// MAIN APP FOOTER
// =============================================================================
// Figma Design: 1106-1129 (Logo/footer-example)
// The branded footer bar for app.skai.trade
// Background: #001615, Border: #123F3C, Font: Manrope 12px
// =============================================================================

export interface MainAppFooterNavItem {
  label: string;
  href?: string;
  icon?: SkaiIconName;
}

export interface MainAppFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Social links (left section) */
  socialLinks?: {
    discord?: string;
    telegram?: string;
    x?: string;
  };
  /** Navigation items with icons (center-left section) */
  navItems?: MainAppFooterNavItem[];
  /** Connection status (center pill) */
  connectionStatus?: {
    connected: boolean;
    label?: string;
  };
  /** Footer page links (right section) */
  footerLinks?: Array<{ label: string; href?: string }>;
  /** Custom link component for routing */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinkComponent?: React.ComponentType<any>;
}

const MainAppFooter = React.forwardRef<HTMLElement, MainAppFooterProps>(
  (
    {
      socialLinks = {
        discord: "https://discord.gg/skaitrade",
        telegram: "https://t.me/skaitrade",
        x: "https://x.com/SkaiTrade",
      },
      navItems = [
        { label: "AI", icon: "lightning" as SkaiIconName },
        { label: "Chat", icon: "message" as SkaiIconName },
        { label: "Mini games", icon: "hot" as SkaiIconName },
        { label: "Wallet", icon: "wallet" as SkaiIconName },
      ],
      connectionStatus = { connected: true, label: "Connection is stable" },
      footerLinks = [
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
      LinkComponent,
      className,
      ...props
    },
    ref,
  ) => {
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
      <footer
        ref={ref}
        className={cn(
          "flex items-center justify-between px-4 py-1.5",
          "bg-[#001615] border-t border-[#123F3C]",
          className,
        )}
        {...props}
      >
        <div className="flex flex-1 items-center justify-between min-w-0">
          {/* Left: Social Icons */}
          <div className="flex items-center gap-8 shrink-0">
            {socialLinks.discord && (
              <a
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#56C7F3] transition-colors"
                aria-label="Discord"
              >
                <SkaiIcon name="discord" size="sm" />
              </a>
            )}
            {socialLinks.telegram && (
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#56C7F3] transition-colors"
                aria-label="Telegram"
              >
                <SkaiIcon name="message" size="sm" />
              </a>
            )}
            {socialLinks.x && (
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#56C7F3] transition-colors"
                aria-label="X (Twitter)"
              >
                <SkaiIcon name="x" size="sm" />
              </a>
            )}
          </div>

          {/* Center-Left: Nav Items with Icons */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href || "#"}
                className="flex items-center gap-1.5 text-white hover:text-[#56C7F3] transition-colors"
              >
                {item.icon && <SkaiIcon name={item.icon} size="sm" />}
                <span className="font-manrope text-[12px] leading-[16px] tracking-[-0.48px]">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Center: Connection Status Pill */}
          {connectionStatus && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full",
                connectionStatus.connected
                  ? "bg-[#17F9B4]"
                  : "bg-[#FF574A]",
              )}
            >
              <span
                className={cn(
                  "w-[3.75px] h-[3.75px] rounded-full",
                  connectionStatus.connected
                    ? "bg-[#001615]"
                    : "bg-white",
                )}
              />
              <span
                className={cn(
                  "font-mulish text-[11px] leading-[14px] tracking-[-0.44px]",
                  connectionStatus.connected
                    ? "text-[#001615]"
                    : "text-white",
                )}
              >
                {connectionStatus.label || (connectionStatus.connected ? "Connection is stable" : "Disconnected")}
              </span>
            </div>
          )}

          {/* Right: Page Links */}
          <div className="flex items-center gap-6 shrink-0">
            {footerLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href || "#"}
                className="font-manrope text-[12px] leading-[16px] tracking-[-0.48px] text-white hover:text-[#56C7F3] transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </footer>
    );
  },
);
MainAppFooter.displayName = "MainAppFooter";

export { MainAppFooter };
