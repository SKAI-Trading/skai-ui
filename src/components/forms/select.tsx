/**
 * The open panel follows the same dropdown frames as DropdownMenu (see the note
 * at the top of overlays/dropdown-menu.tsx): radius 12, a Green Coal 100 edge,
 * the "Input hint (dark)" shadow, 8 of inset and 8 between rows, Paragraph 2
 * rows at radius 4, and the current value filled instead of checked.
 *
 * The 8 of inset sits on the Viewport, not on Content. The Viewport carries the
 * popper's `min-w` of the trigger width, so padding inside it keeps the panel
 * the trigger's width plus its edge; padding on Content would widen every
 * panel by 8. It also leaves callers that pad the Viewport through
 * `[&_[data-radix-select-viewport]]:p-2` (MemberList, TradingGroups) at their
 * own 8 instead of adding to it.
 *
 * A caller that pads Content itself (`p-1` on TradingVault and every Play
 * Select) keeps today's arrangement: its padding plus the Viewport's 4. Its
 * inset therefore does not move; only an unpadded Select moves from 4 to 8.
 *
 * Radix focuses the selected item when the panel opens, so the highlight lands
 * on the current value first and then follows the pointer.
 */
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { menuRowType } from "../overlays/menu-row-type";

const Select = SelectPrimitive.Root;

const SelectGroup = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Group
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
SelectGroup.displayName = SelectPrimitive.Group.displayName;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

/**
 * True when a class list pads the element it lands on (`p-1`, `md:px-2`,
 * `!pt-0`). A class behind an arbitrary selector (`[&_[data-radix-select-viewport]]:p-2`)
 * pads a descendant, not Content, so it does not count.
 */
function padsItself(className?: string): boolean {
  return (className ?? "").split(/\s+/).some((c) => {
    const at = c.lastIndexOf(":");
    if (at >= 0 && c.slice(0, at).includes("&")) return false;
    return /^!?p[xytrblse]?-/.test(c.slice(at + 1));
  });
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-inputHint data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "flex flex-col gap-2",
          padsItself(className) ? "p-1" : "p-2",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("shrink-0 px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full shrink-0 cursor-default select-none items-center rounded px-2 py-1.5 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-border focus:text-popover-foreground data-[state=checked]:bg-border",
      menuRowType(className),
      className,
    )}
    {...props}
  >
    {/* Empty on purpose. Callers hid the old check with
        `[&>span:first-child]:hidden`; without this span that selector would
        hide the label. */}
    <span className="hidden" aria-hidden="true" />
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("h-px shrink-0 bg-border", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
