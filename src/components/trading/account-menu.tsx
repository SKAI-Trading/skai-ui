import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "../data-display/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../overlays/dropdown-menu";
import { ChevronDown, Copy, LogOut, Check } from "lucide-react";

// =============================================================================
// ACCOUNT MENU TYPES
// =============================================================================

export interface AccountMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Link href */
  href?: string;
  /** Whether the item is destructive (logout, delete, etc.) */
  destructive?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Badge content */
  badge?: React.ReactNode;
  /** Keyboard shortcut hint */
  shortcut?: string;
}

export interface AccountMenuGroup {
  /** Group label (optional) */
  label?: string;
  /** Items in this group */
  items: AccountMenuItem[];
}

const accountMenuTriggerVariants = cva(
  "flex items-center gap-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-accent/50",
        outlined: "border border-border hover:bg-accent/50",
        filled: "bg-accent hover:bg-accent/80",
        glass:
          "bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80",
      },
      size: {
        sm: "p-1 pr-2 text-xs",
        md: "p-1.5 pr-3 text-sm",
        lg: "p-2 pr-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface AccountMenuProps extends VariantProps<
  typeof accountMenuTriggerVariants
> {
  /** User display name */
  name?: string;
  /** User avatar URL */
  avatarUrl?: string;
  /** User wallet address */
  walletAddress?: string;
  /** Menu groups */
  groups?: AccountMenuGroup[];
  /** Flat menu items (alternative to groups) */
  items?: AccountMenuItem[];
  /** Logout handler */
  onLogout?: () => void;
  /** Show logout button */
  showLogout?: boolean;
  /** Logout label */
  logoutLabel?: string;
  /** Copy wallet address handler */
  onCopyAddress?: () => void;
  /** Whether menu is open (controlled) */
  open?: boolean;
  /** Open change handler (controlled) */
  onOpenChange?: (open: boolean) => void;
  /** Custom trigger content */
  trigger?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom content className */
  contentClassName?: string;
  /** Menu alignment */
  align?: "start" | "center" | "end";
  /** Menu side offset */
  sideOffset?: number;
  /** Show dropdown chevron */
  showChevron?: boolean;
  /** Avatar fallback (initials, icon, etc.) */
  avatarFallback?: React.ReactNode;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatWalletAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// =============================================================================
// ACCOUNT MENU COMPONENT
// =============================================================================

/**
 * AccountMenu - User account dropdown menu
 *
 * Features:
 * - Avatar with fallback initials
 * - Wallet address with copy button
 * - Grouped menu items
 * - Logout action
 * - Keyboard accessible
 * - Controlled/uncontrolled modes
 *
 * @example Basic usage
 * ```tsx
 * <AccountMenu
 *   name="John Doe"
 *   avatarUrl="/avatar.jpg"
 *   walletAddress="0x1234...5678"
 *   items={[
 *     { id: "profile", label: "Profile", icon: <User />, href: "/profile" },
 *     { id: "settings", label: "Settings", icon: <Settings />, href: "/settings" },
 *   ]}
 *   onLogout={() => disconnect()}
 * />
 * ```
 *
 * @example With grouped items
 * ```tsx
 * <AccountMenu
 *   name="Trader"
 *   walletAddress="0xabcd...ef01"
 *   groups={[
 *     {
 *       label: "Account",
 *       items: [
 *         { id: "profile", label: "Profile", icon: <User /> },
 *         { id: "security", label: "Security", icon: <Shield /> },
 *       ],
 *     },
 *     {
 *       label: "Preferences",
 *       items: [
 *         { id: "theme", label: "Theme", icon: <Palette /> },
 *         { id: "notifications", label: "Notifications", icon: <Bell /> },
 *       ],
 *     },
 *   ]}
 *   showLogout
 * />
 * ```
 */
const AccountMenu = React.forwardRef<HTMLButtonElement, AccountMenuProps>(
  (
    {
      name,
      avatarUrl,
      walletAddress,
      groups,
      items,
      onLogout,
      showLogout = true,
      logoutLabel = "Disconnect",
      onCopyAddress,
      open,
      onOpenChange,
      trigger,
      variant,
      size,
      className,
      contentClassName,
      align = "end",
      sideOffset = 8,
      showChevron = true,
      avatarFallback,
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyAddress = async () => {
      if (walletAddress) {
        await navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopyAddress?.();
      }
    };

    const avatarSizes = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-10 w-10",
    };

    const defaultTrigger = (
      <button
        ref={ref}
        className={cn(accountMenuTriggerVariants({ variant, size }), className)}
      >
        <Avatar className={avatarSizes[size || "md"]}>
          <AvatarImage src={avatarUrl} alt={name || "User"} />
          <AvatarFallback className="text-xs">
            {avatarFallback || (name ? getInitials(name) : "?")}
          </AvatarFallback>
        </Avatar>
        {(name || walletAddress) && (
          <div className="flex flex-col items-start leading-tight">
            {name && <span className="font-medium">{name}</span>}
            {walletAddress && !name && (
              <span className="text-muted-foreground font-mono">
                {formatWalletAddress(walletAddress)}
              </span>
            )}
          </div>
        )}
        {showChevron && (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    );

    const renderMenuItem = (item: AccountMenuItem) => {
      const content = (
        <>
          {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="ml-auto text-xs text-muted-foreground">
              {item.badge}
            </span>
          )}
          {item.shortcut && (
            <span className="ml-auto text-xs text-muted-foreground">
              {item.shortcut}
            </span>
          )}
        </>
      );

      if (item.href) {
        return (
          <DropdownMenuItem key={item.id} asChild disabled={item.disabled}>
            <a href={item.href} className="flex items-center gap-2">
              {content}
            </a>
          </DropdownMenuItem>
        );
      }

      return (
        <DropdownMenuItem
          key={item.id}
          onClick={item.onClick}
          disabled={item.disabled}
          className={cn(
            "flex items-center gap-2",
            item.destructive && "text-destructive focus:text-destructive",
          )}
        >
          {content}
        </DropdownMenuItem>
      );
    };

    return (
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          {trigger || defaultTrigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          sideOffset={sideOffset}
          className={cn("w-56", contentClassName)}
        >
          {/* Wallet address header */}
          {walletAddress && (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Wallet</span>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="font-mono text-sm mt-1">
                  {formatWalletAddress(walletAddress)}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Grouped items */}
          {groups?.map((group, groupIndex) => (
            <React.Fragment key={group.label || groupIndex}>
              {groupIndex > 0 && <DropdownMenuSeparator />}
              <DropdownMenuGroup>
                {group.label && (
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                )}
                {group.items.map(renderMenuItem)}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}

          {/* Flat items */}
          {items && items.length > 0 && (
            <DropdownMenuGroup>{items.map(renderMenuItem)}</DropdownMenuGroup>
          )}

          {/* Logout */}
          {showLogout && onLogout && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {logoutLabel}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
AccountMenu.displayName = "AccountMenu";

export {
  AccountMenu,
  accountMenuTriggerVariants,
  formatWalletAddress,
  getInitials,
};
