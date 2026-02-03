/**
 * Header Components
 * 
 * Complete header system for SKAI applications.
 * All header customization happens here - branding, colors, layout.
 */

// Theme & Configuration
export {
  headerColors,
  headerLayout,
  defaultBrandConfig,
  getHeaderCssVars,
  headerClasses,
  type HeaderBrandConfig,
  type HeaderNavItemConfig,
  type HeaderNavGroupConfig,
} from "./theme";

// Logo
export { HeaderLogo, type HeaderLogoProps } from "./header-logo";

// Status Pills
export {
  HeaderStatusPill,
  HeaderBalanceDisplay,
  AnimatedNumber,
  type HeaderStatusPillProps,
  type HeaderBalanceDisplayProps,
  type AnimatedNumberProps,
} from "./header-status-pill";

// Navigation
export {
  HeaderNavigation,
  HeaderNavLink,
  HeaderNavDropdown,
  type HeaderNavigationProps,
  type HeaderNavLinkProps,
  type HeaderNavDropdownProps,
} from "./header-navigation";

// Mobile Menu
export {
  HeaderMobileMenu,
  MobileMenuSection,
  MobileMenuItem,
  type HeaderMobileMenuProps,
  type MobileMenuSectionProps,
  type MobileMenuItemProps,
} from "./header-mobile-menu";
