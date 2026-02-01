import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import {
  InboxIcon,
  SearchIcon,
  FileIcon,
  AlertCircleIcon,
  WifiOffIcon,
  type LucideIcon,
} from "lucide-react";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center p-8",
  {
    variants: {
      size: {
        sm: "gap-2 py-6",
        md: "gap-3 py-8",
        lg: "gap-4 py-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Preset icons for common empty states
const presetIcons: Record<string, LucideIcon> = {
  default: InboxIcon,
  search: SearchIcon,
  file: FileIcon,
  error: AlertCircleIcon,
  offline: WifiOffIcon,
};

export interface EmptyStateProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /** Icon to display */
  icon?: LucideIcon | keyof typeof presetIcons;
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Action button/element */
  action?: React.ReactNode;
  /** Hide the icon */
  hideIcon?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon = "default",
      title,
      description,
      action,
      hideIcon = false,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const Icon =
      typeof icon === "string"
        ? presetIcons[icon] || presetIcons.default
        : icon;
    const iconSize = size === "sm" ? 32 : size === "lg" ? 56 : 48;

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size }), className)}
        {...props}
      >
        {!hideIcon && (
          <div className="rounded-full bg-muted p-4">
            <Icon
              className="text-muted-foreground"
              size={iconSize}
              strokeWidth={1.5}
            />
          </div>
        )}
        <div className="space-y-1">
          <h3
            className={cn(
              "font-semibold text-foreground",
              size === "sm" && "text-sm",
              size === "lg" && "text-lg",
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                "text-muted-foreground max-w-sm",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";

// Preset empty states for common use cases
export const NoResults = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, "icon" | "title"> & { title?: string }
>(({ title = "No results found", ...props }, ref) => (
  <EmptyState ref={ref} icon="search" title={title} {...props} />
));
NoResults.displayName = "NoResults";

export const NoData = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, "icon" | "title"> & { title?: string }
>(({ title = "No data available", ...props }, ref) => (
  <EmptyState ref={ref} icon="default" title={title} {...props} />
));
NoData.displayName = "NoData";

export const OfflineState = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, "icon" | "title" | "description"> & {
    title?: string;
    description?: string;
  }
>(
  (
    {
      title = "You're offline",
      description = "Check your internet connection and try again",
      ...props
    },
    ref,
  ) => (
    <EmptyState
      ref={ref}
      icon="offline"
      title={title}
      description={description}
      {...props}
    />
  ),
);
OfflineState.displayName = "OfflineState";

export { EmptyState, emptyStateVariants };
