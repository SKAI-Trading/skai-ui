import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../feedback/alert-dialog";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  description: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  variant?: "default" | "destructive";
  /** Loading state for confirm button */
  loading?: boolean;
  /** Callback when confirmed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Icon to show in header */
  icon?: React.ReactNode;
  /** Disable cancel button */
  disableCancel?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
  icon,
  disableCancel = false,
}) => {
  const handleConfirm = async () => {
    // onConfirm may be an async action that rejects (RPC error, signing
    // refusal, etc.). The previous version awaited the promise without a
    // catch, so a rejection unwound past Radix's event handler and surfaced
    // as an "unhandled promise rejection" Sentry event with no useful frame.
    // Leave the dialog open on failure so the user can retry; the consumer
    // is responsible for showing the error inside the dialog (e.g. via the
    // `error` prop pattern used elsewhere in skai-ui).
    try {
      await onConfirm();
      if (!loading) {
        onOpenChange(false);
      }
    } catch (err) {
      // Keep the dialog open on failure so the user can retry; the consumer is
      // responsible for showing the error inside the dialog. Do NOT swallow
      // silently (no-silent-failures policy) — log so the failure is at least
      // visible in the console / any global error-capture wired by the host.
      console.error("ConfirmDialog onConfirm failed:", err);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && (
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  "p-3 rounded-full",
                  variant === "destructive"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary",
                )}
              >
                {icon}
              </div>
            </div>
          )}
          <AlertDialogTitle className={icon ? "text-center" : ""}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={icon ? "text-center" : ""}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!disableCancel && (
            <AlertDialogCancel onClick={handleCancel} disabled={loading}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            aria-busy={loading || undefined}
            className={cn(
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            )}
          >
            {loading && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";

export { ConfirmDialog };
