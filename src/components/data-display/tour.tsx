"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";

interface TourStep {
  /** Target element selector (CSS selector) */
  target: string;
  /** Title of the step */
  title: string;
  /** Description/content of the step */
  description: React.ReactNode;
  /** Placement of the tooltip */
  placement?: "top" | "bottom" | "left" | "right";
  /** Custom action buttons */
  actions?: React.ReactNode;
}

interface TourProps {
  /** Array of tour steps */
  steps: TourStep[];
  /** Whether the tour is open */
  open?: boolean;
  /** Callback when tour is closed */
  onClose?: () => void;
  /** Callback when tour is completed */
  onComplete?: () => void;
  /** Current step index (controlled) */
  currentStep?: number;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  /** Show step indicators */
  showIndicators?: boolean;
  /** Show skip button */
  showSkip?: boolean;
  /** Custom class for the spotlight overlay */
  overlayClassName?: string;
  /** Custom class for the tooltip */
  tooltipClassName?: string;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Tour = React.forwardRef<HTMLDivElement, TourProps>(
  (
    {
      steps,
      open = false,
      onClose,
      onComplete,
      currentStep: controlledStep,
      onStepChange,
      showIndicators = true,
      showSkip = true,
      overlayClassName,
      tooltipClassName,
    },
    ref,
  ) => {
    const [internalStep, setInternalStep] = React.useState(0);
    const [spotlightRect, setSpotlightRect] =
      React.useState<SpotlightRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = React.useState({
      top: 0,
      left: 0,
    });

    const currentStep = controlledStep ?? internalStep;
    const step = steps[currentStep];

    const updatePositions = React.useCallback(() => {
      if (!step?.target || !open) return;

      const element = document.querySelector(step.target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const padding = 8;

      setSpotlightRect({
        top: rect.top - padding + window.scrollY,
        left: rect.left - padding + window.scrollX,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Calculate tooltip position based on placement
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const gap = 16;

      let top = 0;
      let left = 0;

      switch (step.placement || "bottom") {
        case "top":
          top = rect.top + window.scrollY - tooltipHeight - gap;
          left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2;
          break;
        case "bottom":
          top = rect.bottom + window.scrollY + gap;
          left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2;
          break;
        case "left":
          top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
          left = rect.left + window.scrollX - tooltipWidth - gap;
          break;
        case "right":
          top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + window.scrollX + gap;
          break;
      }

      // Keep tooltip in viewport
      left = Math.max(
        16,
        Math.min(left, window.innerWidth - tooltipWidth - 16),
      );
      top = Math.max(16, top);

      setTooltipPosition({ top, left });
    }, [step, open]);

    React.useEffect(() => {
      updatePositions();
      window.addEventListener("resize", updatePositions);
      window.addEventListener("scroll", updatePositions);

      return () => {
        window.removeEventListener("resize", updatePositions);
        window.removeEventListener("scroll", updatePositions);
      };
    }, [updatePositions]);

    const goToStep = (index: number) => {
      if (onStepChange) {
        onStepChange(index);
      } else {
        setInternalStep(index);
      }
    };

    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      } else {
        onComplete?.();
        onClose?.();
      }
    };

    const handlePrev = () => {
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      }
    };

    const handleSkip = () => {
      onClose?.();
    };

    if (!open || !step) return null;

    return (
      <div ref={ref} className="fixed inset-0 z-[9999]">
        {/* Overlay with spotlight cutout */}
        <svg
          className={cn("absolute inset-0 w-full h-full", overlayClassName)}
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {spotlightRect && (
                <rect
                  x={spotlightRect.left}
                  y={spotlightRect.top}
                  width={spotlightRect.width}
                  height={spotlightRect.height}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#tour-spotlight-mask)"
            style={{ pointerEvents: "auto" }}
            onClick={handleSkip}
          />
        </svg>

        {/* Spotlight ring */}
        {spotlightRect && (
          <div
            className="absolute border-2 border-primary rounded-lg pointer-events-none animate-pulse"
            style={{
              top: spotlightRect.top,
              left: spotlightRect.left,
              width: spotlightRect.width,
              height: spotlightRect.height,
            }}
          />
        )}

        {/* Tooltip */}
        <div
          className={cn(
            "absolute w-80 bg-popover text-popover-foreground rounded-lg shadow-xl border p-4",
            tooltipClassName,
          )}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="space-y-2 pr-6">
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <div className="text-sm text-muted-foreground">
              {step.description}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            {/* Step indicators */}
            {showIndicators && (
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      index === currentStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                    )}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-2 ml-auto">
              {showSkip && currentStep < steps.length - 1 && (
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrev}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Tour.displayName = "Tour";

// Hook for managing tour state
function useTour(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen);
  const [currentStep, setCurrentStep] = React.useState(0);

  const start = () => {
    setCurrentStep(0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const goTo = (step: number) => {
    setCurrentStep(step);
  };

  return {
    open,
    currentStep,
    start,
    close,
    goTo,
    setOpen,
    setCurrentStep,
  };
}

export { Tour, useTour };
export type { TourStep, TourProps };
