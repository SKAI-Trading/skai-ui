import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

// =============================================================================
// NAV GROUP TYPES
// =============================================================================

export interface NavGroupItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether the item is active/selected */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Badge content (count, "new", etc.) */
  badge?: React.ReactNode;
  /** Nested items (for sub-groups) */
  items?: NavGroupItem[];
}

export interface NavGroupProps {
  /** Group label */
  label: string;
  /** Icon for the group */
  icon?: React.ReactNode;
  /** Navigation items */
  items: NavGroupItem[];
  /** Whether the group is collapsible */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Visual variant */
  variant?: "default" | "ghost" | "bordered";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom className */
  className?: string;
  /** Custom className for items */
  itemClassName?: string;
}

// =============================================================================
// NAV GROUP ITEM COMPONENT
// =============================================================================

interface NavGroupItemComponentProps {
  item: NavGroupItem;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "bordered";
  depth?: number;
  className?: string;
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

const iconSizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const NavGroupItemComponent: React.FC<NavGroupItemComponentProps> = ({
  item,
  size = "md",
  variant = "default",
  depth = 0,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.items && item.items.length > 0;

  const baseClasses = cn(
    "flex items-center gap-2 rounded-md transition-colors w-full",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    sizeClasses[size],
    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    !item.disabled && "cursor-pointer",
    item.active && "bg-accent text-accent-foreground font-medium",
    !item.active &&
      "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
    depth > 0 && `ml-${depth * 4}`,
    className,
  );

  const content = (
    <>
      {item.icon && (
        <span className={cn("shrink-0", iconSizeClasses[size])}>
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="ml-auto shrink-0 text-xs font-medium text-muted-foreground">
          {item.badge}
        </span>
      )}
      {hasChildren && (
        <ChevronRight
          className={cn(
            "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
      )}
    </>
  );

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button type="button" className={baseClasses}>
            {content}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1 space-y-1">
            {item.items!.map((subItem) => (
              <NavGroupItemComponent
                key={subItem.id}
                item={subItem}
                size={size}
                variant={variant}
                depth={depth + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (item.href) {
    return (
      <a href={item.href} className={baseClasses} onClick={item.onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={baseClasses} onClick={item.onClick}>
      {content}
    </button>
  );
};

// =============================================================================
// NAV GROUP COMPONENT
// =============================================================================

/**
 * NavGroup - Collapsible navigation group with nested items
 *
 * Features:
 * - Collapsible/expandable groups
 * - Nested item support (unlimited depth)
 * - Icon and badge support
 * - Active state highlighting
 * - Keyboard accessible
 *
 * @example Basic usage
 * ```tsx
 * <NavGroup
 *   label="Trading"
 *   icon={<TrendingUp />}
 *   items={[
 *     { id: "1", label: "Spot", href: "/trade/spot", active: true },
 *     { id: "2", label: "Perps", href: "/trade/perp" },
 *     { id: "3", label: "Options", href: "/trade/options", badge: "Soon" },
 *   ]}
 * />
 * ```
 *
 * @example With nested items
 * ```tsx
 * <NavGroup
 *   label="Settings"
 *   collapsible
 *   defaultCollapsed
 *   items={[
 *     {
 *       id: "account",
 *       label: "Account",
 *       icon: <User />,
 *       items: [
 *         { id: "profile", label: "Profile", href: "/settings/profile" },
 *         { id: "security", label: "Security", href: "/settings/security" },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
const NavGroup = React.forwardRef<HTMLDivElement, NavGroupProps>(
  (
    {
      label,
      icon,
      items,
      collapsible = true,
      defaultCollapsed = false,
      collapsed,
      onCollapsedChange,
      variant = "default",
      size = "md",
      className,
      itemClassName,
    },
    ref,
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const isControlled = collapsed !== undefined;
    const currentCollapsed = isControlled ? collapsed : isCollapsed;

    const handleCollapsedChange = (value: boolean) => {
      if (!isControlled) {
        setIsCollapsed(value);
      }
      onCollapsedChange?.(value);
    };

    const headerClasses = cn(
      "flex items-center gap-2 rounded-md transition-colors w-full",
      sizeClasses[size],
      collapsible && "cursor-pointer hover:bg-accent/30",
      "text-foreground font-medium",
    );

    const header = (
      <>
        {icon && (
          <span className={cn("shrink-0", iconSizeClasses[size])}>{icon}</span>
        )}
        <span className="flex-1 truncate">{label}</span>
        {collapsible && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              currentCollapsed && "-rotate-90",
            )}
          />
        )}
      </>
    );

    const itemList = (
      <div className="mt-1 space-y-0.5">
        {items.map((item) => (
          <NavGroupItemComponent
            key={item.id}
            item={item}
            size={size}
            variant={variant}
            className={itemClassName}
          />
        ))}
      </div>
    );

    if (collapsible) {
      return (
        <Collapsible
          ref={ref}
          open={!currentCollapsed}
          onOpenChange={(open) => handleCollapsedChange(!open)}
          className={cn("space-y-1", className)}
        >
          <CollapsibleTrigger asChild>
            <button type="button" className={headerClasses}>
              {header}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>{itemList}</CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-1", className)}>
        <div className={headerClasses}>{header}</div>
        {itemList}
      </div>
    );
  },
);
NavGroup.displayName = "NavGroup";

export { NavGroup, NavGroupItemComponent };
export type { NavGroupItemComponentProps };
