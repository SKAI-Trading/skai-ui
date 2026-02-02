import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

const notificationVariants = cva(
  "relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        success:
          "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
        warning:
          "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
        error: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
        info: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const variantIcons: Record<string, LucideIcon> = {
  default: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: AlertCircleIcon,
  info: InfoIcon,
};

export interface NotificationProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  /** Notification title */
  title: string;
  /** Notification message */
  message?: string;
  /** Custom icon */
  icon?: LucideIcon;
  /** Hide the icon */
  hideIcon?: boolean;
  /** Show dismiss button */
  dismissible?: boolean;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Action button */
  action?: React.ReactNode;
  /** Auto-dismiss timeout in ms */
  duration?: number;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      title,
      message,
      variant = "default",
      icon,
      hideIcon = false,
      dismissible = true,
      onDismiss,
      action,
      duration,
      className,
      ...props
    },
    ref,
  ) => {
    const Icon = icon || variantIcons[variant || "default"];

    // Auto-dismiss
    React.useEffect(() => {
      if (duration && onDismiss) {
        const timer = setTimeout(onDismiss, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(notificationVariants({ variant }), className)}
        {...props}
      >
        {!hideIcon && <Icon className="h-5 w-5 shrink-0 mt-0.5" />}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold leading-none">{title}</p>
          {message && <p className="text-sm opacity-90">{message}</p>}
          {action && <div className="mt-2">{action}</div>}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
Notification.displayName = "Notification";

// Notification stack container
export interface NotificationStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position of the stack */
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  /** Max notifications to show */
  maxVisible?: number;
}

const NotificationStack = React.forwardRef<
  HTMLDivElement,
  NotificationStackProps
>(
  (
    { position = "top-right", maxVisible = 5, className, children, ...props },
    ref,
  ) => {
    const positionClasses = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    };

    const childArray = React.Children.toArray(children).slice(0, maxVisible);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col gap-2 w-full max-w-sm",
          positionClasses[position],
          className,
        )}
        {...props}
      >
        {childArray}
      </div>
    );
  },
);
NotificationStack.displayName = "NotificationStack";

export { Notification, NotificationStack, notificationVariants };
