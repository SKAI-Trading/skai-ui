import * as React from "react";
import { cn } from "../../lib/utils";
import { SkaiLogo } from "../branding/skai-logo";
import { SkaiIcon } from "../branding/skai-icon";

// =============================================================================
// MAIN APP HEADER
// =============================================================================
// Figma Design: 1106-1042 (Logo/header-example)
// The branded header for app.skai.trade
// Background: #001615, Border: #123F3C, Font: Manrope 16px
// =============================================================================

export interface MainAppHeaderNavItem {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  active?: boolean;
}

export interface MainAppHeaderStat {
  icon: React.ReactNode;
  value: string;
}

export interface MainAppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items shown after the logo */
  navItems?: MainAppHeaderNavItem[];
  /** Search bar placeholder text */
  searchPlaceholder?: string;
  /** Callback when search is submitted */
  onSearch?: (query: string) => void;
  /** Stats pills shown on the right (e.g. points, followers, balance) */
  stats?: MainAppHeaderStat[];
  /** Whether a wallet is connected */
  walletConnected?: boolean;
  /** Label for the wallet button */
  walletLabel?: string;
  /** Callback for wallet connect/disconnect */
  onConnectWallet?: () => void;
  /** User avatar URL (shown when logged in) */
  userAvatar?: string;
  /** Username (shown when logged in) */
  userName?: string;
  /** Callback for profile button click */
  onProfileClick?: () => void;
  /** Custom link component for routing (e.g. React Router Link) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinkComponent?: React.ComponentType<any>;
}

const MainAppHeader = React.forwardRef<HTMLElement, MainAppHeaderProps>(
  (
    {
      navItems = [
        { label: "AI" },
        { label: "Trade", hasDropdown: true },
        { label: "Predict" },
        { label: "Play" },
        { label: "Social" },
        { label: "More", hasDropdown: true },
      ],
      searchPlaceholder = "Search anything...",
      onSearch,
      stats = [],
      walletConnected = false,
      walletLabel = "Connect wallet",
      onConnectWallet,
      userAvatar,
      userName,
      onProfileClick,
      LinkComponent,
      className,
      ...props
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = React.useState("");

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

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(searchValue);
      }
    };

    return (
      <header
        ref={ref}
        className={cn(
          "flex items-center justify-between px-5 py-3",
          "bg-[#001615] border-b border-[#123F3C]",
          "font-manrope text-[16px] leading-[22px] tracking-[-0.64px]",
          className,
        )}
        {...props}
      >
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6 shrink-0">
          <SkaiLogo size="small" variant="white" />

          <nav className="hidden lg:flex items-center gap-[35px]">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href || "#"}
                className={cn(
                  "flex items-center gap-2.5 py-3 text-white transition-colors hover:text-[#56C7F3]",
                  item.active && "text-[#56C7F3]",
                )}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <SkaiIcon name="chevron-down" size="sm" className="opacity-70" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-2 w-[236px] rounded-lg border border-[#123F3C] bg-[#001615]">
          <SkaiIcon name="search" size="sm" className="text-[#95A09F] shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="bg-transparent text-[14px] leading-[18px] tracking-[-0.56px] text-white placeholder:text-[#95A09F]/75 outline-none w-full font-manrope"
          />
        </div>

        {/* Right: Stats + Wallet + Profile */}
        <div className="flex items-center gap-4">
          {/* Stats pills */}
          {stats.length > 0 && (
            <div className="hidden lg:flex items-center gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#123F3C]"
                >
                  <span className="shrink-0">{stat.icon}</span>
                  <span className="font-mulish text-[16px] leading-[16px] tracking-[-0.64px] text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Connect Wallet / Wallet Button */}
          <button
            onClick={onConnectWallet}
            className={cn(
              "flex items-center gap-2.5 px-10 py-5 rounded-2xl transition-colors",
              walletConnected
                ? "bg-[#001615] border-[1.5px] border-[#56C7F3] text-white"
                : "bg-[#56C7F3] text-[#001615]",
            )}
          >
            <span className="text-[16px] leading-[22px] tracking-[-0.64px] font-manrope">
              {walletLabel}
            </span>
            {!walletConnected && (
              <SkaiIcon name="chevron-down" size="sm" className="-rotate-90" />
            )}
          </button>

          {/* User Profile */}
          {userName && (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-[1.5px] border-[#56C7F3] bg-[#001615]"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#123F3C] flex items-center justify-center">
                  <SkaiIcon name="user" size="xs" className="text-white" />
                </div>
              )}
              <span className="text-white text-[16px] leading-[22px] tracking-[-0.64px] font-manrope">
                {userName}
              </span>
              <SkaiIcon name="chevron-down" size="sm" className="text-white" />
            </button>
          )}
        </div>
      </header>
    );
  },
);
MainAppHeader.displayName = "MainAppHeader";

export { MainAppHeader };
