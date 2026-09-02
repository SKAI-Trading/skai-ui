import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // No closed-state exit animation: Radix keeps document.body
      // pointer-events:none + the overlay mounted until the exit animation ends
      // (~200ms), swallowing the first click after close ("laggy / click twice
      // to close", bug c4c83e9a). Dropping the closed classes unmounts on close
      // synchronously and releases the lock immediately. Entry animation stays.
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * Classes for the scrim behind the dialog.
   *
   * `DialogContent` mounts its own `DialogOverlay`, so before this existed the
   * scrim was unreachable from a caller: `bg-black/80` was final no matter what
   * the frame drew. That is not a hypothetical — three surfaces documented the
   * dead end in a source comment, and two of them PAID for it:
   * `src/components/home-redesign/whales/AddWalletSheet.tsx` abandoned the
   * shared primitive and hand-rolled Radix Dialog because its frame shows no
   * dimming at all, and `src/components/trench-redesign/discover/rightMenuChrome.tsx`
   * says outright "it cannot be reached from here".
   *
   * Merged through `cn`, so anything passed here beats the default: `bg-black/40`
   * for a lighter scrim, `bg-transparent backdrop-blur-none` for none at all.
   * Omitting it keeps the existing `bg-black/80 backdrop-blur-sm`, so every one
   * of the ~219 files using `DialogContent` is unchanged.
   */
  overlayClassName?: string;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, overlayClassName, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overlayClassName} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Closed-state exit animations dropped so Radix unmounts on close
        // synchronously and releases the body pointer-events lock (bug c4c83e9a).
        //
        // Every utility here appears at exactly one breakpoint. Restating one at
        // `sm:` looks like a no-op and is not: tailwind-merge scopes conflicts by
        // variant, so a caller's unprefixed `rounded-[16px]` cancels the base
        // `rounded-lg` while an `sm:rounded-lg` beside it survives the merge and
        // wins by cascade from 640px up. A duplicate makes the property
        // uncancellable from outside. `sm:p-6` is a genuine step off `p-4`, not a
        // restatement, and stays. Enforced by dialog-variant-duplication.test.tsx.
        "fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg max-h-[calc(100dvh-2rem)] overflow-y-auto data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] motion-reduce:animate-none rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export type { DialogContentProps };

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
