import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Status indicator variants using CVA
 */
const statusIndicatorVariants = cva(
  "inline-flex items-center justify-center rounded-full shrink-0",
  {
    variants: {
      status: {
        online: "bg-green-500",
        offline: "bg-gray-400",
        away: "bg-yellow-500",
        busy: "bg-red-500",
        connecting: "bg-blue-500",
        error: "bg-destructive",
      },
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-4 w-4",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      },
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        status: "online",
        glow: true,
        className: "shadow-[0_0_8px_rgba(34,197,94,0.6)]",
      },
      {
        status: "busy",
        glow: true,
        className: "shadow-[0_0_8px_rgba(239,68,68,0.6)]",
      },
      {
        status: "away",
        glow: true,
        className: "shadow-[0_0_8px_rgba(234,179,8,0.6)]",
      },
      {
        status: "connecting",
        glow: true,
        className: "shadow-[0_0_8px_rgba(59,130,246,0.6)]",
      },
    ],
    defaultVariants: {
      status: "offline",
      size: "md",
      pulse: false,
      glow: false,
    },
  },
);

/**
 * Props for StatusIndicator component
 */
export interface StatusIndicatorProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusIndicatorVariants> {
  /** Optional label for screen readers */
  label?: string;
  /** Show label text visually */
  showLabel?: boolean;
  /** Custom status text (overrides default) */
  statusText?: string;
}

/**
 * Default status labels for screen readers
 */
const defaultStatusLabels: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  away: "Away",
  busy: "Do not disturb",
  connecting: "Connecting",
  error: "Connection error",
};

/**
 * StatusIndicator - Visual indicator for online/offline/busy status
 *
 * @example
 * ```tsx
 * // Simple usage
 * <StatusIndicator status="online" />
 *
 * // With label
 * <StatusIndicator status="online" showLabel label="User is online" />
 *
 * // With animation
 * <StatusIndicator status="connecting" pulse glow />
 *
 * // Different sizes
 * <StatusIndicator status="busy" size="lg" />
 * ```
 */
const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (
    {
      className,
      status,
      size,
      pulse,
      glow,
      label,
      showLabel = false,
      statusText,
      ...props
    },
    ref,
  ) => {
    const statusKey = status || "offline";
    const ariaLabel =
      label || statusText || defaultStatusLabels[statusKey] || "Unknown status";

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2",
          showLabel && "text-sm",
          className,
        )}
        {...props}
      >
        <span
          className={statusIndicatorVariants({ status, size, pulse, glow })}
          role="status"
          aria-label={ariaLabel}
        />
        {showLabel && (
          <span className="text-muted-foreground">
            {statusText || defaultStatusLabels[statusKey]}
          </span>
        )}
      </span>
    );
  },
);

StatusIndicator.displayName = "StatusIndicator";

// StatusWithLabel - Convenience wrapper with visible label
const StatusWithLabel = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  (props, ref) => <StatusIndicator ref={ref} showLabel {...props} />
);
StatusWithLabel.displayName = "StatusWithLabel";

// ConnectionStatus - Network connection indicator
export interface ConnectionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Connection status */
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  /** Network name */
  network: string;
}

const connectionStatusMap: Record<ConnectionStatusProps['status'], StatusIndicatorProps['status']> = {
  connected: 'online',
  connecting: 'connecting',
  disconnected: 'offline',
  error: 'error',
};

const ConnectionStatus = React.forwardRef<HTMLDivElement, ConnectionStatusProps>(
  ({ status, network, className, ...props }, ref) => {
    const indicatorStatus = connectionStatusMap[status];
    const isConnecting = status === 'connecting';
    
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 p-2 rounded-lg bg-card border", className)}
        {...props}
      >
        <StatusIndicator
          status={indicatorStatus}
          pulse={isConnecting}
          glow={status === 'connected'}
          size="md"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium capitalize">{status}</span>
          <span className="text-xs text-muted-foreground">{network}</span>
        </div>
      </div>
    );
  }
);
ConnectionStatus.displayName = "ConnectionStatus";

export { StatusIndicator, StatusWithLabel, ConnectionStatus, statusIndicatorVariants };
