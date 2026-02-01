import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export interface StepperStep {
  /** Unique identifier for the step */
  id: string;
  /** Step title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether step is optional */
  optional?: boolean;
}

export interface StepperProps {
  /** Array of steps */
  steps: StepperStep[];
  /** Current active step index (0-based) */
  currentStep: number;
  /** Callback when step is clicked */
  onStepClick?: (stepIndex: number) => void;
  /** Orientation of the stepper */
  orientation?: "horizontal" | "vertical";
  /** Allow clicking on completed steps */
  clickable?: boolean;
  /** Show step numbers */
  showNumbers?: boolean;
  /** Custom className */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Stepper - Multi-step progress indicator
 *
 * Features:
 * - Horizontal and vertical layouts
 * - Clickable completed steps for navigation
 * - Step status indicators (completed, current, upcoming)
 * - Optional step descriptions
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: "1", title: "Account" },
 *     { id: "2", title: "Profile" },
 *     { id: "3", title: "Review" },
 *   ]}
 *   currentStep={1}
 *   onStepClick={(step) => setStep(step)}
 * />
 * ```
 */
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      onStepClick,
      orientation = "horizontal",
      clickable = true,
      showNumbers = true,
      className,
      size = "md",
    },
    ref,
  ) => {
    const getStepStatus = (index: number) => {
      if (index < currentStep) return "completed";
      if (index === currentStep) return "current";
      return "upcoming";
    };

    const isClickable = (index: number) => {
      return clickable && index < currentStep && onStepClick;
    };

    const sizeClasses = {
      sm: {
        indicator: "h-6 w-6 text-xs",
        title: "text-xs",
        description: "text-[10px]",
        connector: orientation === "horizontal" ? "h-0.5" : "w-0.5",
      },
      md: {
        indicator: "h-8 w-8 text-sm",
        title: "text-sm",
        description: "text-xs",
        connector: orientation === "horizontal" ? "h-0.5" : "w-0.5",
      },
      lg: {
        indicator: "h-10 w-10 text-base",
        title: "text-base",
        description: "text-sm",
        connector: orientation === "horizontal" ? "h-1" : "w-1",
      },
    };

    const sizes = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row items-start" : "flex-col",
          className,
        )}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const canClick = isClickable(index);
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={cn(
                "flex",
                orientation === "horizontal"
                  ? "flex-1 flex-col items-center"
                  : "flex-row items-start gap-3",
              )}
              role="listitem"
              aria-current={status === "current" ? "step" : undefined}
            >
              {/* Step indicator and connector row */}
              <div
                className={cn(
                  "flex items-center",
                  orientation === "horizontal" ? "w-full" : "flex-col",
                )}
              >
                {/* Connector before (vertical only) */}
                {orientation === "vertical" && index > 0 && (
                  <div
                    className={cn(
                      "flex-1 min-h-4",
                      sizes.connector,
                      status === "upcoming" ? "bg-muted" : "bg-primary",
                    )}
                  />
                )}

                {/* Step indicator */}
                <button
                  type="button"
                  onClick={() => canClick && onStepClick?.(index)}
                  disabled={!canClick}
                  className={cn(
                    "flex items-center justify-center rounded-full font-medium transition-colors",
                    sizes.indicator,
                    status === "completed" &&
                      "bg-primary text-primary-foreground",
                    status === "current" &&
                      "border-2 border-primary bg-background text-primary",
                    status === "upcoming" &&
                      "border-2 border-muted bg-background text-muted-foreground",
                    canClick && "cursor-pointer hover:bg-primary/90",
                    !canClick && "cursor-default",
                  )}
                  aria-label={`Step ${index + 1}: ${step.title}${
                    status === "completed" ? " (completed)" : ""
                  }${status === "current" ? " (current)" : ""}`}
                >
                  {status === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : showNumbers ? (
                    index + 1
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </button>

                {/* Connector after (horizontal) */}
                {orientation === "horizontal" && !isLast && (
                  <div
                    className={cn(
                      "flex-1 mx-2",
                      sizes.connector,
                      index < currentStep ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div
                className={cn(
                  orientation === "horizontal"
                    ? "mt-2 text-center"
                    : "flex-1 pb-8",
                )}
              >
                <div
                  className={cn(
                    "font-medium",
                    sizes.title,
                    status === "completed" && "text-foreground",
                    status === "current" && "text-primary",
                    status === "upcoming" && "text-muted-foreground",
                  )}
                >
                  {step.title}
                  {step.optional && (
                    <span className="ml-1 text-muted-foreground">
                      (optional)
                    </span>
                  )}
                </div>
                {step.description && (
                  <div
                    className={cn(
                      "mt-0.5 text-muted-foreground",
                      sizes.description,
                    )}
                  >
                    {step.description}
                  </div>
                )}
              </div>

              {/* Vertical connector after content */}
              {orientation === "vertical" && !isLast && (
                <div
                  className={cn(
                    "absolute left-4 top-10 bottom-0",
                    sizes.connector,
                    index < currentStep ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

/**
 * StepperContent - Wrapper for step content panels
 */
interface StepperContentProps {
  /** Current step index */
  currentStep: number;
  /** Step index this content belongs to */
  step: number;
  /** Content to display */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
}

const StepperContent: React.FC<StepperContentProps> = ({
  currentStep,
  step,
  children,
  className,
}) => {
  if (currentStep !== step) return null;

  return (
    <div
      className={cn("animate-in fade-in-50 slide-in-from-right-10", className)}
      role="tabpanel"
      aria-label={`Step ${step + 1} content`}
    >
      {children}
    </div>
  );
};

StepperContent.displayName = "StepperContent";

export { Stepper, StepperContent };
