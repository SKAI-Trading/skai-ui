/**
 * HeaderNavigation - Desktop navigation with dropdown support
 * 
 * Features:
 * - Individual nav items
 * - Dropdown groups with hover support
 * - Active state indicators
 * - Badge support
 * - Admin-only items
 */

import * as React from "react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../overlays/dropdown-menu";
import { Badge } from "../../core/badge";
import { SkaiIcon, type SkaiIconName } from "../../branding/skai-icon";
import type { HeaderNavItemConfig, HeaderNavGroupConfig } from "./theme";

// =============================================================================
// NAV LINK ITEM
// =============================================================================

export interface HeaderNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Whether the item is active */
  active?: boolean;
  /** Custom link component (for React Router) */
  LinkComponent?: React.ComponentType<{
    to: string;
    end?: boolean;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
    "data-quest-target"?: string;
  }>;
  /** Route path */
  to: string;
  /** Only match exact path (for NavLink `end` prop) */
  end?: boolean;
  /** Quest target ID for tutorials */
  questTarget?: string;
}

/*
 * LIGHT-MODE INK ON THE TRIGGERS (report 481f3137)
 * ------------------------------------------------
 * Every nav TRIGGER below carries `text-white [.light_&]:text-green-coal-300`.
 * The triggers sit on the app shell's header bar, which is themed, so a pinned
 * `text-white` painted white-on-white the moment a user switched to light —
 * the labels simply vanished.
 *
 * Why `[.light_&]:` and not `dark:`: the app writes `.light` OR `.dark` on
 * <html> from an EFFECT (src/hooks/ui/useTheme.ts), so on the first paint
 * neither class is present. Keeping the dark value unprefixed makes dark the
 * default and light the explicit override, which is the safe direction — the
 * alternative flashes light chrome on a dark app. Same variant the app already
 * uses in QuestsSection.tsx.
 *
 * The dropdown PANELS are deliberately NOT touched: Figma draws them
 * #122524 with white rows in both themes, so they stay a dark panel that
 * happens to open from a light bar.
 */

/**
 * HeaderNavLink - Individual navigation link
 */
const HeaderNavLink = React.forwardRef<HTMLAnchorElement, HeaderNavLinkProps>(
  ({ className, active, LinkComponent, to, end, questTarget, children, ...props }, ref) => {
    const baseClasses = cn(
      "px-3 py-1.5 text-sm font-medium transition-colors flex items-center whitespace-nowrap",
      "hover:text-primary",
      active
        ? "text-primary"
        : "text-white [.light_&]:text-green-coal-300",
      className
    );

    if (LinkComponent) {
      return (
        <LinkComponent
          to={to}
          end={end}
          className={({ isActive }: { isActive: boolean }) => cn(
            "px-3 py-1.5 text-sm font-medium transition-colors flex items-center whitespace-nowrap",
            "hover:text-primary",
            isActive
              ? "text-primary"
              : "text-white [.light_&]:text-green-coal-300",
            className
          )}
          data-quest-target={questTarget}
        >
          {children}
        </LinkComponent>
      );
    }

    return (
      <a 
        ref={ref} 
        href={to} 
        className={baseClasses}
        data-quest-target={questTarget}
        {...props}
      >
        {children}
      </a>
    );
  }
);

HeaderNavLink.displayName = "HeaderNavLink";

// =============================================================================
// NAV DROPDOWN
// =============================================================================

export interface HeaderNavDropdownProps {
  /** Dropdown label */
  label: string;
  /** Nav items in dropdown */
  items: HeaderNavItemConfig[];
  /** Navigation handler (for programmatic navigation) */
  onNavigate?: (to: string) => void;
  /** Show "Soon" badges */
  showBadges?: boolean;
}

/**
 * HeaderNavDropdown - Dropdown menu for nav groups
 */
const HeaderNavDropdown: React.FC<HeaderNavDropdownProps> = ({
  label,
  items,
  onNavigate,
  showBadges = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(v) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(v);
      }}
      modal={false}
    >
      <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            className={cn(
              /*
                ⚠️ py-2 across all three nav triggers in this file, and it
                DELIBERATELY BREACHES THE 44px TAP MINIMUM. Casey's explicit
                call, 2026-08-26, made with that cost stated.

                text-base is 16/24, so py-3 made these 48px tall and drove the
                app header to 65/57/57 against Figma frames that instance it at
                56/52/48. py-2 gives 24 + 16 = 40px, which is what the frames
                draw. Every Home 2 frame failed measured parity on that band
                alone.

                This is a SHARED component: the same nav renders on every route
                of the main app via HomeShellLayout. 40px is under the 44px tap
                target enforced elsewhere in this repo. Recorded here so an
                accessibility pass reads it as a decision, not a defect, and so
                nobody restores py-3 to "fix" it.
              */
              "px-0 py-2 text-base font-normal transition-colors rounded-md flex items-center whitespace-nowrap gap-1",
              "hover:text-primary",
              open ? "text-primary" : "text-white [.light_&]:text-green-coal-300"
            )}
            style={{ letterSpacing: "-0.64px" }}
          >
            {label}
            {/* Figma nav caret — solid triangle (8×4), matches @skai/ui
                FigmaChevronDownIcon used across every redesign surface. */}
            <svg
              className={cn(
                "w-2 opacity-70 transition-transform duration-200",
                open && "rotate-180",
              )}
              viewBox="0 0 8 4"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 0L4 4L8 0H0Z" fill="currentColor" />
            </svg>
          </button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="start"
        sideOffset={2}
        className="w-[200px] bg-[#122524] border-[#123f3c] rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.24)] p-4 gap-4 flex flex-col"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {items.map(({ to, label: itemLabel, icon, badge }) => (
          <DropdownMenuItem
            key={to}
            onSelect={() => {
              setOpen(false);
              if (onNavigate) {
                onNavigate(to);
              }
            }}
            className="cursor-pointer flex items-center gap-2 w-full px-0 py-0 font-manrope text-base leading-[22px] tracking-[-0.64px] text-white hover:text-primary focus:text-primary hover:bg-transparent focus:bg-transparent"
          >
            {icon && <span>{icon}</span>}
            <span>{itemLabel}</span>
            {(badge || showBadges) && (
              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                {badge || "Soon"}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HeaderNavDropdown.displayName = "HeaderNavDropdown";

// =============================================================================
// NAV RICH DROPDOWN (Trade dropdown - Figma node 1362:1813)
// =============================================================================

export interface HeaderNavRichDropdownProps {
  /** Dropdown trigger label */
  label: string;
  /** Nav items with iconName + description */
  items: HeaderNavItemConfig[];
  /** Navigation handler */
  onNavigate?: (to: string) => void;
  /**
   * Make the TRIGGER itself a navigation target, so the label is a pathway in
   * its own right alongside the menu rows (Figma "Skai > Play - dropdown"
   * 4765:65172 — clicking "Play" lands on the Play page, hovering discloses
   * Casino / Sportsbook).
   *
   * When set, the trigger renders as a real `<a href>` (so middle-click and
   * "open in new tab" work) and Radix's click-to-toggle is suppressed:
   * hover/ArrowDown disclose the menu, click/Enter navigate. When omitted the
   * trigger stays a plain toggle `<button>` — Trade / Social / More pass
   * nothing and are unchanged.
   *
   * Routing stays with the consumer: this component has no router dependency
   * (see `LinkComponent` above), so the href is used for semantics only and the
   * actual navigation goes through `onNavigate`.
   */
  triggerTo?: string;
  /**
   * Whether the trigger's own route is active. Supplied by the consumer, which
   * owns the router — the component cannot resolve this itself.
   */
  triggerActive?: boolean;
}

/**
 * HeaderNavRichDropdown - Dropdown with icon + title + description items
 * Matches Figma Trade dropdown: bg-[#122524], w-[300px], rounded-xl
 */
const HeaderNavRichDropdown: React.FC<HeaderNavRichDropdownProps> = ({
  label,
  items,
  onNavigate,
  triggerTo,
  triggerActive,
}) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(v) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(v);
      }}
      modal={false}
    >
      <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <DropdownMenuTrigger asChild>
          {/* `triggerTo` turns the label itself into a pathway: an <a href> that
              navigates on click while hover / ArrowDown still disclose the menu
              (Figma "Skai > Play - dropdown" 4765:65172). Without it the trigger
              is the original click-to-toggle button, so Trade / Social / More
              are untouched. */}
          {triggerTo ? (
            <a
              href={triggerTo}
              ref={(n) => {
                triggerRef.current = n;
              }}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={(e) => {
                // Modified clicks (new tab / window) and non-primary buttons fall
                // through to the browser so the href behaves like a real link.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                setOpen(false);
                onNavigate?.(triggerTo);
              }}
              onKeyDown={(e) => {
                // Radix's trigger opens on Enter/Space. Here Enter must NAVIGATE,
                // so disclosure moves to ArrowDown (and Space) — that keeps both
                // menu rows reachable without a pointer.
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  onNavigate?.(triggerTo);
                } else if (e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen((v) => !v);
                }
              }}
              className={cn(
                "px-0 py-2 text-base font-normal transition-colors rounded-md flex items-center whitespace-nowrap gap-1 cursor-pointer",
                "hover:text-[#56C7F3]",
                open || triggerActive ? "text-[#56C7F3]" : "text-white [.light_&]:text-green-coal-300"
              )}
              style={{ letterSpacing: "-0.64px" }}
            >
              {label}
              <svg
                className={cn("w-2 transition-transform duration-200", open && "rotate-180")}
                viewBox="0 0 8 4"
                fill="none"
                aria-hidden="true"
              >
                <path d="M0 0L4 4L8 0H0Z" fill="currentColor" />
              </svg>
            </a>
          ) : (
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            // NOTE: when `triggerTo` is set the branch above renders an <a> instead
            // of this button — keep the two class lists in sync.
            // Figma Header-desktop 7710:92977 paints the hovered / open nav trigger
            // and its caret Sky Blue 300 #56C7F3 — the same literal the menu rows
            // below already use. This was `text-primary`, and in the main app
            // `--primary` is 160 84% 55% = #2DEDAD Alien Green (src/index.css:386),
            // so Trade / Predict / Play / Social / More lit up GREEN on hover while
            // the menu they opened lit up blue. Do NOT reach for the `sky-blue`
            // token to fix this — in this codebase that one ALSO resolves to green
            // #2DEDAD. The caret follows via its `fill="currentColor"`, matching the
            // frame where the active caret is #56C7F3 as well.
            className={cn(
              "px-0 py-2 text-base font-normal transition-colors rounded-md flex items-center whitespace-nowrap gap-1",
              "hover:text-[#56C7F3]",
              open ? "text-[#56C7F3]" : "text-white [.light_&]:text-green-coal-300"
            )}
            style={{ letterSpacing: "-0.64px" }}
          >
            {label}
            {/* Figma nav caret — solid triangle (8×4), matches @skai/ui
                FigmaChevronDownIcon used across every redesign surface.
                FULL opacity, deliberately. This carried `opacity-70`, which is
                why the caret still read off-colour after the trigger hex above
                was corrected: at 70% over the #001615 bar a white caret
                composites to #B3BAB9 and a hovered one to #3C93B1, so the nav
                never actually reached either colour the frame specifies.
                Frame 7710:92977 draws all five carets at full strength —
                sampled from the export, each is 12 core pixels of #FFFFFF
                (Predict / Play / Social / More) or #56C7F3 (Trade). */}
            <svg
              className={cn(
                "w-2 transition-transform duration-200",
                open && "rotate-180",
              )}
              viewBox="0 0 8 4"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 0L4 4L8 0H0Z" fill="currentColor" />
            </svg>
          </button>
          )}
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="start"
        sideOffset={2}
        // overflow-visible overrides the base overflow-hidden: with the enter
        // animation's transform, overflow-hidden + rounded-xl made Chrome paint
        // square top corners until a repaint (a hover) rounded them (bug
        // 7cbf1d5f). The rich-dropdown rows have transparent backgrounds, so
        // nothing needs the overflow clip — rounded-xl still rounds the panel.
        className="w-[300px] overflow-visible bg-[#122524] border-[#123f3c] rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.24)] pl-4 pr-8 py-4 gap-6 flex flex-col"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {items.map(({ to, label: itemLabel, iconName, description }) => (
          <DropdownMenuItem
            key={to}
            onSelect={() => {
              setOpen(false);
              if (onNavigate) {
                onNavigate(to);
              }
            }}
            className="group cursor-pointer flex gap-2 items-start w-full px-0 py-0 hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent"
          >
            {iconName && (
              <SkaiIcon
                name={iconName as SkaiIconName}
                className="w-6 h-6 text-[#56C7F3] shrink-0"
              />
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-manrope text-base leading-[22px] tracking-[-0.64px] text-white group-hover:text-[#56C7F3] group-focus:text-[#56C7F3] group-data-[highlighted]:text-[#56C7F3] transition-colors">
                {itemLabel}
              </span>
              {description && (
                <span className="font-manrope text-xs leading-4 tracking-[-0.48px] text-white/64 group-hover:text-white/80 group-focus:text-white/80 group-data-[highlighted]:text-white/80 transition-colors">
                  {description}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HeaderNavRichDropdown.displayName = "HeaderNavRichDropdown";

// =============================================================================
// FULL NAVIGATION BAR
// =============================================================================

export interface HeaderNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** Primary navigation items (displayed as individual links) */
  primaryItems?: HeaderNavItemConfig[];
  /** Grouped navigation (displayed as dropdowns) */
  groups?: HeaderNavGroupConfig[];
  /** Custom link component */
  LinkComponent?: React.ComponentType<{
    to: string;
    className?: string | ((props: { isActive: boolean }) => string);
    children: React.ReactNode;
    "data-quest-target"?: string;
  }>;
  /** Navigation handler */
  onNavigate?: (to: string) => void;
  /** Whether user is admin (to show admin-only groups) */
  isAdmin?: boolean;
  /** Quest targets for primary items */
  questTargets?: Record<string, string>;
}

/**
 * HeaderNavigation - Complete desktop navigation bar
 * 
 * @example
 * ```tsx
 * <HeaderNavigation
 *   primaryItems={[
 *     { to: "/ai", label: "AI" },
 *     { to: "/trade", label: "Trade" },
 *   ]}
 *   groups={[
 *     { id: "social", label: "Social", items: [...] },
 *     { id: "admin", label: "Admin", items: [...], adminOnly: true },
 *   ]}
 *   LinkComponent={NavLink}
 *   onNavigate={(to) => navigate(to)}
 *   isAdmin={isAdmin}
 * />
 * ```
 */
const HeaderNavigation = React.forwardRef<HTMLElement, HeaderNavigationProps>(
  ({ 
    className,
    primaryItems = [],
    groups = [],
    LinkComponent,
    onNavigate,
    isAdmin = false,
    questTargets = {},
    ...props 
  }, ref) => {
    return (
      <nav 
        ref={ref}
        className={cn(
          "hidden lg:flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide",
          className
        )}
        {...props}
      >
        {/* Primary nav items */}
        {primaryItems.map(({ to, label }) => (
          <HeaderNavLink
            key={to}
            to={to}
            LinkComponent={LinkComponent}
            questTarget={questTargets[to]}
          >
            {label}
          </HeaderNavLink>
        ))}

        {/* Grouped dropdowns */}
        {groups
          .filter(group => !group.adminOnly || isAdmin)
          .map(({ id, label, items }) => (
            <HeaderNavDropdown
              key={id}
              label={label}
              items={items}
              onNavigate={onNavigate}
              showBadges={id === "comingSoon"}
            />
          ))
        }
      </nav>
    );
  }
);

HeaderNavigation.displayName = "HeaderNavigation";

export { HeaderNavLink, HeaderNavDropdown, HeaderNavRichDropdown, HeaderNavigation };
