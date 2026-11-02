import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, collisionPadding = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * The point Figma's `tool-tip` component draws between its bubble and the
 * trigger: its `connector` (1243:960 in main 7746:117670, read 2026-10-30 on
 * the instance 9135:86683 of 9102:300724). A vector 35.006 along the bubble's
 * edge and 16 out from it, in the bubble's Green Coal 100 #123F3C, with a
 * rounded point that stops at 14.58 of the 16. Drawn base up, point down, the
 * way Radix draws the arrow of a bubble above its trigger; Radix turns it for
 * the other sides.
 *
 * Place it inside a TooltipContent, and mind two things there:
 * - Radix adds the arrow's 16 to `sideOffset`, so `sideOffset={0}` already
 *   leaves the point's room between the bubble and the trigger.
 * - TooltipContent clips to its box, and while its enter animation transforms
 *   it that clip reaches the point too. Give that TooltipContent
 *   `overflow-visible`.
 *
 * The fill is a class, Green Coal 100 unless the caller's bubble is another
 * colour.
 */
const TOOLTIP_ARROW_PATH =
  "M14.8039 13.5329C16.332 14.9298 18.6735 14.9298 20.2016 13.5329L35.0056 0L0 0L14.8039 13.5329Z";

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>, "asChild" | "children">
>(({ className, width = 35, height = 16, ...props }, ref) => (
  <TooltipPrimitive.Arrow ref={ref} width={width} height={height} asChild {...props}>
    <svg
      viewBox="0 0 35.0056 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("fill-green-coal-100", className)}
    >
      <path d={TOOLTIP_ARROW_PATH} />
    </svg>
  </TooltipPrimitive.Arrow>
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow };
