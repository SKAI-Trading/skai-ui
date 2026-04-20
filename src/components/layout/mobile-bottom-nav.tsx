/**
 * MobileBottomNav - Mobile bottom navigation bar
 *
 * Presentational component - receives items and active state via props.
 * The consuming app provides its own navigation link rendering.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MobileBottomNavItem {
  /** Navigation target */
  href: string;
  /** Icon element */
  icon: React.ReactNode;
  /** Navigation label */
  label: string;
  /** Optional badge text */
  badge?: string;
  /** Quest target identifier */
  questTarget?: string;
}

export interface MobileBottomNavRenderLinkArgs {
  key: string;
  href: string;
  className: string;
  children: React.ReactNode;
  questTarget?: string;
  "aria-current"?: "page" | undefined;
  "aria-label"?: string;
}

export interface MobileBottomNavProps {
  /** Navigation items */
  items: MobileBottomNavItem[];
  /** Current active path */
  currentPath: string;
  /** Whether the nav is visible */
  visible?: boolean;
  /** Render function for navigation links */
  renderLink: (props: MobileBottomNavRenderLinkArgs) => React.ReactNode;
  /** Additional className */
  className?: string;
  /** Accessible label for the nav landmark (default: "Primary"). */
  ariaLabel?: string;
}

function isActive(currentPath: string, itemHref: string): boolean {
  return (
    currentPath === itemHref ||
    (itemHref !== "/" && currentPath.startsWith(itemHref))
  );
}

/**
 * MobileBottomNav - Fixed bottom navigation for mobile
 */
export function MobileBottomNav({
  items,
  currentPath,
  visible = true,
  renderLink,
  className,
  ariaLabel = "Primary",
}: MobileBottomNavProps) {
  if (!visible) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "border-t border-border/30 backdrop-blur-xl bg-background/95",
        className,
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className={cn("grid h-16", `grid-cols-${items.length}`)}>
        {items.map((item) => {
          const active = isActive(currentPath, item.href);

          const args: MobileBottomNavRenderLinkArgs = {
            key: item.href,
            href: item.href,
            questTarget: item.questTarget,
            "aria-current": active ? "page" : undefined,
            "aria-label": item.label,
            className: cn(
              "flex flex-col items-center justify-center gap-1 relative transition-all duration-200 motion-reduce:transition-none",
              "min-h-[44px] min-w-[44px]",
              "active:scale-95",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            ),
            children: (
              <>
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className={cn(
                      "transition-transform duration-200 motion-reduce:transition-none",
                      active && "scale-110",
                    )}
                  >
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span
                      aria-label={`${item.badge} notifications`}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-all duration-200 motion-reduce:transition-none",
                    active ? "scale-105" : "scale-100",
                  )}
                >
                  {item.label}
                </span>
              </>
            ),
          };

          return renderLink(args);
        })}
      </div>
    </nav>
  );
}
