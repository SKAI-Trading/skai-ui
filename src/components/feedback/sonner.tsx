"use client";

import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { cn } from "../../lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Sonner Toaster - Modern toast notifications with promise support
 *
 * @example
 * // Basic usage
 * sonnerToast("Event has been created")
 *
 * // With description
 * sonnerToast("Event created", { description: "Monday, January 3rd at 6:00pm" })
 *
 * // Promise toast
 * sonnerToast.promise(saveData(), {
 *   loading: 'Saving...',
 *   success: 'Data saved!',
 *   error: 'Error saving data',
 * })
 *
 * // Success/Error/Warning/Info
 * sonnerToast.success("Success!")
 * sonnerToast.error("Error!")
 * sonnerToast.warning("Warning!")
 * sonnerToast.info("Info!")
 */
const SonnerToaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive",
          success:
            "group-[.toaster]:bg-green-500 group-[.toaster]:text-white group-[.toaster]:border-green-600",
          warning:
            "group-[.toaster]:bg-yellow-500 group-[.toaster]:text-black group-[.toaster]:border-yellow-600",
          info: "group-[.toaster]:bg-blue-500 group-[.toaster]:text-white group-[.toaster]:border-blue-600",
        },
      }}
      {...props}
    />
  );
};

// Re-export toast for convenience with distinct name
export { SonnerToaster, sonnerToast };
