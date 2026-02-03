/**
 * HeaderMobileMenu - Full mobile navigation sheet
 * 
 * Features:
 * - Sheet overlay from right
 * - Grouped navigation sections
 * - Account section when connected
 * - Preferences (language, theme)
 * - Community links
 * - Admin panel access
 */

import * as React from "react";
import { cn } from "../../../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../../overlays/sheet";
import { Button } from "../../core/button";
import { Badge } from "../../core/badge";
import { headerColors, type HeaderNavItemConfig, type HeaderNavGroupConfig } from "./theme";

// =============================================================================
// MOBILE MENU SECTION
// =============================================================================

export interface MobileMenuSectionProps {
  /** Section title */
  title: string;
  /** Children content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

const MobileMenuSection: React.FC<MobileMenuSectionProps> = ({
  title,
  children,
  className,
}) => (
  <div className={cn("px-2 mt-4", className)}>
    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
      {title}
    </div>
    {children}
  </div>
);

// =============================================================================
// MOBILE MENU ITEM
// =============================================================================

export interface MobileMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Route path */
  to: string;
  /** Label text */
  label: string;
  /** Icon (emoji or component) */
  icon?: React.ReactNode;
  /** Badge content */
  badge?: React.ReactNode;
  /** Badge variant */
  badgeVariant?: "default" | "secondary" | "destructive";
  /** Whether item is active */
  active?: boolean;
  /** Click handler */
  onSelect?: () => void;
  /** Custom link component */
  LinkComponent?: React.ComponentType<{
    to: string;
    onClick?: () => void;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
  }>;
  /** Custom background highlight */
  highlight?: "default" | "warning" | "destructive";
}

const highlightClasses = {
  default: "",
  warning: "bg-yellow-500/10 hover:bg-yellow-500/20",
  destructive: "bg-destructive/10",
};

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  to,
  label,
  icon,
  badge,
  badgeVariant = "default",
  active,
  onSelect,
  LinkComponent,
  highlight = "default",
  className,
}) => {
  const baseClasses = cn(
    "flex items-center gap-3 text-sm font-medium transition-colors min-h-[48px] px-3 mx-1 rounded-xl",
    active ? "text-primary bg-primary/10" : "hover:bg-accent/50",
    highlightClasses[highlight],
    className
  );

  const content = (
    <>
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge 
          variant={badgeVariant} 
          className="text-[10px] px-2 py-0.5"
        >
          {badge}
        </Badge>
      )}
    </>
  );

  if (LinkComponent) {
    return (
      <LinkComponent
        to={to}
        onClick={onSelect}
        className={({ isActive }: { isActive: boolean }) => cn(
          "flex items-center gap-3 text-sm font-medium transition-colors min-h-[48px] px-3 mx-1 rounded-xl",
          isActive ? "text-primary bg-primary/10" : "hover:bg-accent/50",
          highlightClasses[highlight],
          className
        )}
      >
        {content}
      </LinkComponent>
    );
  }

  return (
    <a href={to} onClick={onSelect} className={baseClasses}>
      {content}
    </a>
  );
};

// =============================================================================
// MOBILE MENU
// =============================================================================

export interface HeaderMobileMenuProps {
  /** Whether menu is open */
  open: boolean;
  /** Open state change handler */
  onOpenChange: (open: boolean) => void;
  /** Logo component */
  logo?: React.ReactNode;
  /** Search component */
  search?: React.ReactNode;
  /** Primary nav items */
  primaryItems?: HeaderNavItemConfig[];
  /** Navigation groups */
  navGroups?: HeaderNavGroupConfig[];
  /** Account section (wallet, profile, etc.) */
  accountSection?: React.ReactNode;
  /** Preferences section */
  preferencesSection?: React.ReactNode;
  /** Community links section */
  communitySection?: React.ReactNode;
  /** Custom link component */
  LinkComponent?: React.ComponentType<{
    to: string;
    onClick?: () => void;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
  }>;
  /** Whether user is admin */
  isAdmin?: boolean;
  /** Trigger button (hamburger icon) */
  trigger?: React.ReactNode;
}

/**
 * HeaderMobileMenu - Complete mobile navigation sheet
 * 
 * @example
 * ```tsx
 * <HeaderMobileMenu
 *   open={mobileMenuOpen}
 *   onOpenChange={setMobileMenuOpen}
 *   logo={<HeaderLogo />}
 *   search={<GlobalSearch />}
 *   primaryItems={[{ to: "/ai", label: "AI", icon: "🤖" }]}
 *   navGroups={[{ id: "social", label: "Social", items: [...] }]}
 *   accountSection={<AccountSection />}
 *   preferencesSection={<PreferencesSection />}
 *   LinkComponent={NavLink}
 *   isAdmin={isAdmin}
 * />
 * ```
 */
const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  open,
  onOpenChange,
  logo,
  search,
  primaryItems = [],
  navGroups = [],
  accountSection,
  preferencesSection,
  communitySection,
  LinkComponent,
  isAdmin = false,
  trigger,
}) => {
  const handleClose = () => onOpenChange(false);

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]">
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </Button>
  );

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          {trigger || defaultTrigger}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[85vw] max-w-[320px] p-0 flex flex-col h-full"
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: headerColors.border }}
          >
            {logo}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <nav className="flex flex-col py-2">
              {/* Search */}
              {search && (
                <div className="px-4 py-3">
                  {search}
                </div>
              )}

              {/* Primary Navigation */}
              {primaryItems.length > 0 && (
                <MobileMenuSection title="Navigate">
                  {primaryItems.map(({ to, label, icon }) => (
                    <MobileMenuItem
                      key={to}
                      to={to}
                      label={label}
                      icon={icon}
                      onSelect={handleClose}
                      LinkComponent={LinkComponent}
                    />
                  ))}
                </MobileMenuSection>
              )}

              {/* Nav Groups */}
              {navGroups
                .filter(group => !group.adminOnly || isAdmin)
                .map(group => (
                  <MobileMenuSection key={group.id} title={group.label}>
                    {group.items.map(({ to, label, icon, badge }) => (
                      <MobileMenuItem
                        key={to}
                        to={to}
                        label={label}
                        icon={icon}
                        badge={badge}
                        badgeVariant="secondary"
                        onSelect={handleClose}
                        LinkComponent={LinkComponent}
                      />
                    ))}
                  </MobileMenuSection>
                ))
              }

              {/* Account Section */}
              {accountSection && (
                <MobileMenuSection title="Account">
                  {accountSection}
                </MobileMenuSection>
              )}

              {/* Admin Link */}
              {isAdmin && (
                <div className="px-2 mt-4">
                  <MobileMenuItem
                    to="/admin"
                    label="Admin Panel"
                    icon={
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    }
                    onSelect={handleClose}
                    LinkComponent={LinkComponent}
                    className="bg-primary/5 border border-primary/20 hover:bg-primary/10"
                  />
                </div>
              )}

              {/* Preferences */}
              {preferencesSection && (
                <MobileMenuSection title="Preferences">
                  {preferencesSection}
                </MobileMenuSection>
              )}

              {/* Community */}
              {communitySection && (
                <MobileMenuSection title="Community" className="pb-8">
                  {communitySection}
                </MobileMenuSection>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

HeaderMobileMenu.displayName = "HeaderMobileMenu";

export { HeaderMobileMenu, MobileMenuSection, MobileMenuItem };
