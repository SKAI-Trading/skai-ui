"use client";

import * as React from "react";
import { Toaster as Sonner, toast as sonnerToastOriginal } from "sonner";
import { cn } from "../../lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Adaptive toast interface - accepts both shadcn/Radix `{title, description, variant}`
 * objects AND native sonner string/options patterns. This prevents the "Objects are not
 * valid as a React child" error when call sites use the shadcn toast API.
 */
interface ShadcnToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  [key: string]: unknown;
}

function isShadcnToastObject(arg: unknown): arg is ShadcnToastOptions {
  return (
    typeof arg === "object" &&
    arg !== null &&
    !Array.isArray(arg) &&
    ("title" in arg || "description" in arg) &&
    // Ensure it's not a native sonner ExternalToast (which uses `description` but not `title`)
    "title" in arg
  );
}

/**
 * Wrapped toast that auto-converts shadcn-style `toast({title, description, variant})`
 * to proper sonner calls while preserving native sonner API for strings.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ExternalToast options shape from sonner is structurally any
type SonnerOptions = any;

function adaptiveToast(messageOrOptions: string | ShadcnToastOptions, options?: Record<string, unknown>) {
  if (typeof messageOrOptions === "string") {
    return sonnerToastOriginal(messageOrOptions, options as SonnerOptions);
  }

  if (isShadcnToastObject(messageOrOptions)) {
    const { title, description, variant, ...rest } = messageOrOptions;
    const message = title || description || "Notification";
    const desc = title && description ? description : undefined;

    switch (variant) {
      case "destructive":
        return sonnerToastOriginal.error(message, { description: desc, ...rest });
      case "success":
        return sonnerToastOriginal.success(message, { description: desc, ...rest });
      case "warning":
        return sonnerToastOriginal.warning(message, { description: desc, ...rest });
      case "info":
        return sonnerToastOriginal.info(message, { description: desc, ...rest });
      default:
        return sonnerToastOriginal(message, { description: desc, ...rest });
    }
  }

  // Fallback: pass through to sonner directly
  return sonnerToastOriginal(
    messageOrOptions as SonnerOptions,
    options as SonnerOptions,
  );
}

// Copy all sonner methods onto the adaptive wrapper
adaptiveToast.success = sonnerToastOriginal.success;
adaptiveToast.error = sonnerToastOriginal.error;
adaptiveToast.warning = sonnerToastOriginal.warning;
adaptiveToast.info = sonnerToastOriginal.info;
adaptiveToast.loading = sonnerToastOriginal.loading;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- PromiseIExtendedResult is private in sonner
adaptiveToast.promise = sonnerToastOriginal.promise as any;
adaptiveToast.dismiss = sonnerToastOriginal.dismiss;
adaptiveToast.message = sonnerToastOriginal.message;
adaptiveToast.custom = sonnerToastOriginal.custom;

// Alias for backward compatibility
const sonnerToast = adaptiveToast;
const toast = adaptiveToast;

/**
 * Sonner Toaster - Modern toast notifications with promise support
 *
 * @example
 * // Sonner native API
 * toast("Event has been created")
 * toast.success("Success!")
 * toast.error("Error!")
 *
 * // shadcn/Radix compatible API (auto-converted)
 * toast({ title: "Success", description: "It worked!", variant: "success" })
 * toast({ title: "Error", variant: "destructive" })
 *
 * // Promise toast
 * toast.promise(saveData(), {
 *   loading: 'Saving...',
 *   success: 'Data saved!',
 *   error: 'Error saving data',
 * })
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
          description: "group-[.toast]:text-inherit",
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

// Re-export toast for convenience - `toast` is the sonner toast API (toast.success, toast.error, etc.)
// `sonnerToast` is an alias for backward compatibility
export { SonnerToaster, sonnerToast, toast };
