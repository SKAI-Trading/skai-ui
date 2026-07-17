/**
 * MobileBottomNav - Mobile bottom navigation bar
 *
 * Presentational component - receives items and active state via props.
 * The consuming app provides its own navigation link rendering.
 *
 * Figma ships TWO distinct components here, and the tab layout differs between
 * them — this bar renders both:
 *   - below md: "Bottom-navigation-mobile" (6419:46381, 375x54) — icon ABOVE label
 *   - md..lg:   "Bottom-navigation-tablet" (6704:26136 / 6415:44306, 768x53) —
 *               icon BESIDE label
 * Common to both: a 52px bar, translucent green-coal fill with a 10px blur and a
 * 1px green-coal-100 top border, holding equal-width tabs with a 16px icon and a
 * 14px Mulish label. This was built from the tablet frame alone and shipped the
 * horizontal tabs to phones (report efbaaa08). The consuming app hides the bar
 * entirely at lg+, where the left rail takes over.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MobileBottomNavItem {
  /** Navigation target. For an action item (no route) pass a sentinel like
   *  "#more" and supply {@link onClick}; the consumer's renderLink decides
   *  whether to render a link or a button. */
  href: string;
  /** Icon element */
  icon: React.ReactNode;
  /** Navigation label */
  label: string;
  /** Optional badge text */
  badge?: string;
  /** Quest target identifier */
  questTarget?: string;
  /** When set, the item is an ACTION (e.g. "More" opening a drawer), not a
   *  route — renderLink should render a button that fires this instead of
   *  navigating. */
  onClick?: () => void;
}

export interface MobileBottomNavRenderLinkArgs {
  key: string;
  href: string;
  className: string;
  children: React.ReactNode;
  questTarget?: string;
  /** Present for action items — render a button firing this instead of a link. */
  onClick?: () => void;
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
  // Action items (sentinel hrefs like "#more") are never "current".
  if (itemHref.startsWith("#")) return false;
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
        // Figma 6704:26136: translucent green-coal-300 @ 60% + 10px backdrop
        // blur, 1px green-coal-100 top border. 52px tall, equal tabs.
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "flex h-[52px] items-center justify-between gap-1 px-[19px] py-2",
        "border-t border-[#123f3c] bg-[rgba(0,22,21,0.6)] backdrop-blur-[10px]",
        className,
      )}
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        height: "calc(52px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {items.map((item) => {
        const active = isActive(currentPath, item.href);

        const args: MobileBottomNavRenderLinkArgs = {
          key: item.href,
          href: item.href,
          questTarget: item.questTarget,
          onClick: item.onClick,
          "aria-current": active ? "page" : undefined,
          "aria-label": item.label,
          className: cn(
            // Figma "list": flex-1, centred. Icon stacks ABOVE the label on
            // phones (Bottom-navigation-mobile) and sits BESIDE it from md up
            // (Bottom-navigation-tablet). Fits the 52px bar either way: py-2
            // leaves a 36px box, and icon(16) + gap-0.5(2) + label leading-4(16)
            // = 34px stacked.
            "flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 h-full rounded-lg md:flex-row md:gap-1.5",
            "transition-colors duration-200 motion-reduce:transition-none active:scale-95",
            active ? "text-primary" : "text-white/90 hover:text-white",
          ),
          children: (
            <>
              <div className="relative shrink-0">
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex size-4 items-center justify-center transition-transform duration-200 motion-reduce:transition-none",
                    active && "scale-110",
                  )}
                >
                  {item.icon}
                </div>
                {item.badge && (
                  <span
                    aria-label={`${item.badge} notifications`}
                    className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {/* Mulish 14px, -4% tracking — Figma "Md/Label 1 300". Slightly
                  smaller on the narrowest phones so 5 tabs never overflow. */}
              <span className="truncate font-medium leading-4 tracking-[-0.04em] text-[13px] sm:text-[14px]">
                {item.label}
              </span>
            </>
          ),
        };

        return renderLink(args);
      })}
    </nav>
  );
}
