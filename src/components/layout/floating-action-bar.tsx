/**
 * FloatingActionBar - Mobile floating action bar with overlapping center button
 *
 * Presentational component - receives items and route handling via props.
 * The consuming app provides its own Link component and route logic.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface FloatingActionItem {
  /** Icon element */
  icon: React.ReactNode;
  /** Button label */
  label: string;
  /** Navigation target */
  href: string;
}

export interface FloatingActionBarProps {
  /** Left action item */
  leftItem: FloatingActionItem;
  /** Right action item */
  rightItem: FloatingActionItem;
  /** Center action item (overlapping circle button) */
  centerItem: FloatingActionItem;
  /** Whether the bar is visible */
  visible?: boolean;
  /** Render function for navigation links */
  renderLink: (props: {
    href: string;
    className: string;
    children: React.ReactNode;
  }) => React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * FloatingActionBar - Stake.com-inspired mobile action bar
 */
export function FloatingActionBar({
  leftItem,
  rightItem,
  centerItem,
  visible = true,
  renderLink,
  className,
}: FloatingActionBarProps) {
  if (!visible) return null;

  return (
    <div className={cn("md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40", className)}>
      <div className="relative flex items-center">
        {/* Left Button */}
        {renderLink({
          href: leftItem.href,
          className: cn(
            "flex items-center gap-2 px-5 py-3 rounded-l-full",
            "bg-background/95 backdrop-blur-xl border border-border/30 border-r-0",
            "text-muted-foreground hover:text-foreground transition-colors",
            "shadow-lg shadow-black/20",
          ),
          children: (
            <>
              {leftItem.icon}
              <span className="font-medium text-sm">{leftItem.label}</span>
            </>
          ),
        })}

        {/* Center Button - Overlapping */}
        {renderLink({
          href: centerItem.href,
          className: cn(
            "absolute left-1/2 -translate-x-1/2 z-10",
            "w-12 h-12 rounded-full",
            "bg-primary flex items-center justify-center",
            "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
            "hover:scale-105 active:scale-95 transition-all duration-200",
            "border-4 border-background",
          ),
          children: centerItem.icon,
        })}

        {/* Right Button */}
        {renderLink({
          href: rightItem.href,
          className: cn(
            "flex items-center gap-2 px-5 py-3 rounded-r-full",
            "bg-background/95 backdrop-blur-xl border border-border/30 border-l-0",
            "text-muted-foreground hover:text-foreground transition-colors",
            "shadow-lg shadow-black/20",
            "pl-8",
          ),
          children: (
            <>
              {rightItem.icon}
              <span className="font-medium text-sm">{rightItem.label}</span>
            </>
          ),
        })}
      </div>
    </div>
  );
}
