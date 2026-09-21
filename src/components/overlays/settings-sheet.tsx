import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../core/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  type SheetContentProps,
} from "./sheet";

export interface SettingsSheetProps {
  /** Whether the sheet is open. */
  open: boolean;
  /** Backdrop click, Escape and the corner close button all report here. */
  onOpenChange: (open: boolean) => void;
  /** Sheet title. */
  title: React.ReactNode;
  /** Optional line under the title. */
  description?: React.ReactNode;
  /** The rows of controls themselves -- what they are is app-specific, this only owns the frame around them. */
  children: React.ReactNode;
  /**
   * Called when the footer button is pressed. This does not close the sheet
   * on its own -- a caller that edits a local draft needs the chance to
   * commit it first, so closing (if wanted) is one more line in this
   * callback, the same as the callers this was extracted from already did.
   */
  onSave: () => void;
  /** Footer button text. */
  saveLabel?: string;
  /** Which edge the sheet slides in from. */
  side?: SheetContentProps["side"];
  className?: string;
}

/**
 * A side sheet for a block of settings someone edits as a draft and commits
 * with one full-width button: header, a body for the rows, a footer.
 *
 * Both the main app's launchpad (its "Adjust display settings" panel, which
 * already shares a class-name constant with its "Adjust filters" sibling so
 * the two cannot drift apart) and launch.skai.trade's own display-settings
 * panel hand-assembled this same Sheet/Header/Footer arrangement separately.
 * This is that shape, kept in one place so a third one does not get hand-
 * rolled again. What goes in the body -- the rows, their labels, which
 * fields exist -- stays with each caller; only the frame moved.
 */
export function SettingsSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  saveLabel = "Save settings",
  side = "right",
  className,
}: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn("flex flex-col gap-0", className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>

        <div className="flex-1 space-y-4 py-4">{children}</div>

        <SheetFooter>
          <Button type="button" className="w-full" onClick={onSave}>
            {saveLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
