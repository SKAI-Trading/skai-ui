/**
 * OnlineIndicator Component
 *
 * Displays online/offline status with a colored dot.
 *
 * @example
 * ```tsx
 * import { OnlineIndicator } from '@skai/ui';
 *
 * <OnlineIndicator isOnline={true} />
 * <OnlineIndicator isOnline={false} size="lg" />
 * <OnlineIndicator isOnline={true} absolute /> // Positioned in corner
 * ```
 */

import * as React from "react";
import { cn } from "../../lib/utils";

interface OnlineIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Whether the user/item is online */
  isOnline: boolean;
  /** Size of the indicator dot */
  size?: "sm" | "md" | "lg";
  /** Position absolutely in corner of parent */
  absolute?: boolean;
  /** Hide when offline instead of showing gray dot */
  hideWhenOffline?: boolean;
}

const OnlineIndicator = React.forwardRef<HTMLSpanElement, OnlineIndicatorProps>(
  (
    {
      isOnline,
      size = "md",
      className,
      absolute = false,
      hideWhenOffline = false,
      ...rest
    },
    ref,
  ) => {
    if (!isOnline && hideWhenOffline) return null;

    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    };

    const statusLabel = isOnline ? "Online" : "Offline";

    return (
      <span
        ref={ref}
        role="status"
        aria-label={rest["aria-label"] ?? statusLabel}
        title={rest.title ?? statusLabel}
        {...rest}
        className={cn(
          "rounded-full ring-2 ring-background flex-shrink-0",
          isOnline ? "bg-green-500" : "bg-gray-400",
          sizeClasses[size],
          absolute && "absolute bottom-0 right-0",
          className,
        )}
      >
        <span className="sr-only">{statusLabel}</span>
      </span>
    );
  },
);
OnlineIndicator.displayName = "OnlineIndicator";

export { OnlineIndicator };
export type { OnlineIndicatorProps };
