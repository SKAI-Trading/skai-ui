/**
 * Panel and row states as the dropdown frames draw them: the Governance and
 * Utilities boards (3sSzw1KewMtUbeLAv7uW0r, e.g. 11303:134267, 11314:138124)
 * and Trade 2's dropdown-add (13006:252891), which names the variables.
 *
 * - Panel: Green Coal 200, a 1px Green Coal 100 edge, radius 12, padding 8,
 *   8 between rows, and the "Input hint (dark)" shadow.
 * - Row: radius 4, padding 6 / 8, 8 between an icon and its text, Paragraph 2
 *   type (see menu-row-type.ts).
 * - One row is filled, Green Coal 100: the focused row in an action menu, the
 *   current value in a value menu. No frame draws a check or a radio dot.
 * - In a value menu (RadioItem, CheckboxItem) a hovered or focused row that is
 *   not the current value takes a Sky Blue/10 wash instead, so only the current
 *   value reads as chosen (Casey 2026-10-06 Q10). Item keeps the frames'
 *   Green Coal 100 pointer row: an action menu has no current value.
 *
 * The colours are semantic tokens, so the Light theme and the other apps keep
 * their own surfaces. In the app's dark theme `bg-popover` is #122524 and
 * `border` is #123F3C. The fill is `bg-border` rather than `bg-muted`: the
 * frames bind the row fill and the panel edge to the same variable, and
 * skai-launch and skai-command set `--muted` to their popover colour, where a
 * muted fill would hide keyboard focus.
 *
 * The Green Coal fill replaced the Sky Blue wash bb0b07f put on every focused
 * row. Report feeca90f asked for menus to match Figma, and the frames fill
 * green coal; the wash is back only on value rows that are not chosen, under
 * Q10. `bg-accent` must not come back: the app's `--accent` is Alien Green.
 */
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { menuRowType, menuRowTypeFor } from "./menu-row-type";

/** Content and SubContent. `flex-col gap-2` is the frames' 8 between rows. */
const panelClass =
  "z-50 flex min-w-[8rem] flex-col gap-2 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-inputHint data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

/**
 * Every row. `shrink-0` keeps a row whole when the panel is height-capped and
 * scrolls. `[&>svg]:mr-0` stops an icon's own `mr-2` adding to the gap.
 */
const rowClass =
  "relative flex shrink-0 cursor-default select-none items-center gap-2 rounded px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-border focus:text-popover-foreground [&>svg]:mr-0 [&>svg]:shrink-0";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioGroup
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
DropdownMenuRadioGroup.displayName =
  DropdownMenuPrimitive.RadioGroup.displayName;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      rowClass,
      "data-[state=open]:bg-border",
      menuRowType(className),
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(panelClass, className)}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, collisionPadding = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(panelClass, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      rowClass,
      menuRowTypeFor(className, props.asChild, props.children),
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

/**
 * Keeps its check: no frame draws a multi-select, and the mark is its meaning.
 * Focus takes the value rows' wash, not the action rows' fill (Q10).
 */
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(rowClass, "focus:bg-sky-blue/10 pl-8", menuRowType(className), className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" aria-hidden="true" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

/**
 * The current value is filled, not dotted, and a hovered or focused row that is
 * not it takes the Sky Blue/10 wash (Q10); the checked fill is emitted after
 * the wash, so the current value stays filled while focused. The empty first
 * span stays because callers hid the old dot with `[&>span:first-child]:hidden`;
 * without it that selector would hide their own first span instead.
 */
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      rowClass,
      "focus:bg-sky-blue/10 data-[state=checked]:bg-border",
      menuRowType(className),
      className,
    )}
    {...props}
  >
    <span className="hidden" aria-hidden="true" />
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "shrink-0 px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

/** Inside the padding, spaced by the panel's own 8 above and below. */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("h-px shrink-0 bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
