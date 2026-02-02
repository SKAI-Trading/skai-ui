import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  LoaderIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Spinner } from "../feedback/spinner";

const transactionStatusVariants = cva(
  "inline-flex items-center gap-2 rounded-lg border px-3 py-2",
  {
    variants: {
      status: {
        pending:
          "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
        confirmed:
          "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
        failed:
          "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
        cancelled:
          "bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400",
      },
      size: {
        sm: "text-xs py-1 px-2",
        md: "text-sm py-2 px-3",
        lg: "text-base py-3 px-4",
      },
    },
    defaultVariants: {
      status: "pending",
      size: "md",
    },
  },
);

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "failed"
  | "cancelled";

const statusConfig: Record<
  TransactionStatus,
  { icon: React.ElementType; label: string }
> = {
  pending: { icon: LoaderIcon, label: "Pending" },
  confirmed: { icon: CheckCircleIcon, label: "Confirmed" },
  failed: { icon: XCircleIcon, label: "Failed" },
  cancelled: { icon: ClockIcon, label: "Cancelled" },
};

export interface TransactionStatusBadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof transactionStatusVariants> {
  /** Transaction status */
  status: TransactionStatus;
  /** Custom label */
  label?: string;
  /** Transaction hash */
  txHash?: string;
  /** Block explorer URL */
  explorerUrl?: string;
  /** Show icon */
  showIcon?: boolean;
}

const TransactionStatusBadge = React.forwardRef<
  HTMLDivElement,
  TransactionStatusBadgeProps
>(
  (
    {
      status,
      label,
      txHash,
      explorerUrl,
      showIcon = true,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    const displayLabel = label || config.label;

    const content = (
      <>
        {showIcon &&
          (status === "pending" ? (
            <Spinner size="xs" variant="muted" />
          ) : (
            <Icon className="h-4 w-4" />
          ))}
        <span>{displayLabel}</span>
        {txHash && explorerUrl && (
          <ExternalLinkIcon className="h-3 w-3 opacity-60" />
        )}
      </>
    );

    const baseClassName = cn(
      transactionStatusVariants({ status, size }),
      className,
    );

    if (txHash && explorerUrl) {
      return (
        <a
          href={`${explorerUrl}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            baseClassName,
            "cursor-pointer hover:opacity-80 transition-opacity",
          )}
          role="status"
          aria-live="polite"
          aria-label={`Transaction ${displayLabel}. Click to view on explorer.`}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClassName}
        role="status"
        aria-live="polite"
        aria-label={`Transaction ${displayLabel}`}
        {...props}
      >
        {content}
      </div>
    );
  },
);
TransactionStatusBadge.displayName = "TransactionStatusBadge";

// Transaction progress indicator
export interface TransactionProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current step (1-indexed) */
  currentStep: number;
  /** Step labels */
  steps: string[];
  /** Failed step (if any) */
  failedStep?: number;
}

const TransactionProgress = React.forwardRef<
  HTMLDivElement,
  TransactionProgressProps
>(({ currentStep, steps, failedStep, className, ...props }, ref) => {
  const currentStepName = steps[currentStep - 1] || "";
  const statusMessage = failedStep
    ? `Transaction failed at step ${failedStep}: ${steps[failedStep - 1]}`
    : currentStep > steps.length
      ? "Transaction complete"
      : `Step ${currentStep} of ${steps.length}: ${currentStepName}`;

  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label={statusMessage}
      {...props}
    >
      {/* Screen reader announcement */}
      <span className="sr-only" aria-live="polite">
        {statusMessage}
      </span>
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isFailed = stepNum === failedStep;
          const isPending = stepNum > currentStep;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete && "bg-green-500 border-green-500 text-white",
                  isCurrent && !isFailed && "border-primary bg-primary/10",
                  isFailed && "bg-red-500 border-red-500 text-white",
                  isPending && "border-muted bg-muted/50",
                )}
              >
                {isComplete && <CheckCircleIcon className="h-4 w-4" />}
                {isFailed && <XCircleIcon className="h-4 w-4" />}
                {isCurrent && !isFailed && <Spinner size="xs" />}
                {isPending && (
                  <span className="text-xs text-muted-foreground">
                    {stepNum}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs text-center max-w-[80px]",
                  (isCurrent || isComplete) && !isFailed
                    ? "text-foreground"
                    : "text-muted-foreground",
                  isFailed && "text-red-500",
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress line */}
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
            failedStep ? "bg-red-500" : "bg-green-500",
          )}
          style={{
            width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
});
TransactionProgress.displayName = "TransactionProgress";

export {
  TransactionStatusBadge,
  TransactionProgress,
  transactionStatusVariants,
};
