/**
 * <RefreshButton> — the one refresh control.
 *
 * Refresh buttons across the app had drifted into four behaviours: some spun
 * on a timer whether or not anything was re-read, some spun for as long as the
 * read took, some never moved, and one drew its arrow as a text glyph that
 * `animate-spin` cannot turn (a transform does not apply to an inline span).
 * None said whether the read worked. This one does a single thing:
 *
 *   - it spins while the read is in flight, and only then;
 *   - it is disabled for that time, so a second press cannot start a second read;
 *   - when the read settles it shows a tick, or a warning when it failed, and
 *     says the same to screen readers;
 *   - its tooltip carries the time of the last good read.
 *
 * What counts as a failed read is decided by `refreshFailed` below, so a
 * caller can hand over a react-query `refetch` or a `Promise.allSettled` of
 * several without unwrapping them first.
 *
 * The outlined look is the Figma CTA/button, Type=Secondary, Size=Large with
 * no label (10252:84144): a 32 square, 1.5 Sky Blue stroke inside, radius 8,
 * the 16px Rerun icon. Screens that draw it at 36 pass their own size.
 */
import * as React from "react";
import { FigmaCheckIcon, FigmaRegenerateIcon, FigmaWarningIcon } from "../../figma-icons";
import { cn } from "../../lib/utils";

export type RefreshStatus = "idle" | "refreshing" | "succeeded" | "failed";

/**
 * Whether a settled refresh reported a failure without throwing.
 *
 * Rejections are failures by themselves. Beyond that this reads the shapes
 * the app's refreshes actually return: `false`, a react-query result with
 * `isError`, a `PromiseSettledResult`, and arrays of any of them.
 */
export function refreshFailed(value: unknown): boolean {
  if (value === false) return true;
  if (Array.isArray(value)) return value.some(refreshFailed);
  if (value && typeof value === "object") {
    const v = value as { status?: unknown; value?: unknown; isError?: unknown };
    if (v.status === "rejected") return true;
    if (v.status === "fulfilled" && "value" in v) return refreshFailed(v.value);
    if (v.isError === true) return true;
  }
  return false;
}

export interface UseRefreshActionOptions {
  /** How long the tick stays after a good read. */
  succeededMs?: number;
  /** How long the warning stays after a failed one. */
  failedMs?: number;
  onFailed?: (error: unknown) => void;
}

export interface RefreshAction {
  status: RefreshStatus;
  refreshing: boolean;
  /** Starts the read; while one is running it returns that one instead. */
  refresh: () => Promise<boolean>;
  lastSucceededAt: Date | null;
  /** True from a failed read until the next good one. */
  lastFailed: boolean;
}

/** The state behind <RefreshButton>, for a control that draws itself. */
export function useRefreshAction(
  onRefresh: () => unknown,
  { succeededMs = 1500, failedMs = 4000, onFailed }: UseRefreshActionOptions = {},
): RefreshAction {
  const [status, setStatus] = React.useState<RefreshStatus>("idle");
  const [lastSucceededAt, setLastSucceededAt] = React.useState<Date | null>(null);
  const [lastFailed, setLastFailed] = React.useState(false);
  const running = React.useRef<Promise<boolean> | null>(null);
  const settleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = React.useRef(true);
  const latest = React.useRef({ onRefresh, onFailed, succeededMs, failedMs });
  latest.current = { onRefresh, onFailed, succeededMs, failedMs };

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, []);

  const refresh = React.useCallback((): Promise<boolean> => {
    if (running.current) return running.current;
    if (settleTimer.current) clearTimeout(settleTimer.current);
    setStatus("refreshing");

    const run = (async () => {
      let ok: boolean;
      let error: unknown;
      try {
        const value = await latest.current.onRefresh();
        ok = !refreshFailed(value);
        if (!ok) error = value;
      } catch (err) {
        ok = false;
        error = err;
      }
      running.current = null;
      if (!ok) latest.current.onFailed?.(error);
      if (!mounted.current) return ok;
      setStatus(ok ? "succeeded" : "failed");
      setLastFailed(!ok);
      if (ok) setLastSucceededAt(new Date());
      settleTimer.current = setTimeout(
        () => {
          if (mounted.current) setStatus("idle");
        },
        ok ? latest.current.succeededMs : latest.current.failedMs,
      );
      return ok;
    })();
    running.current = run;
    return run;
  }, []);

  return { status, refreshing: status === "refreshing", refresh, lastSucceededAt, lastFailed };
}

export interface RefreshButtonMessages {
  refreshing: string;
  succeeded: string;
  failed: string;
  /** Tooltip once a read has landed, e.g. "Updated 3:04 PM". */
  updatedAt: (time: string) => string;
}

const DEFAULT_MESSAGES: RefreshButtonMessages = {
  refreshing: "Refreshing…",
  succeeded: "Up to date",
  failed: "Couldn't refresh. What you see is from the last read that worked.",
  updatedAt: (time) => `Updated ${time}`,
};

export interface RefreshButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children" | "title"> {
  /** The read. A rejection, or a value `refreshFailed` reads as failed, is a failure. */
  onRefresh: () => unknown;
  /** `outline` is the boxed CTA; `ghost` is the bare glyph used inline beside text. */
  variant?: "outline" | "ghost";
  /** Accessible name, and the tooltip before anything has been read. */
  label?: string;
  /** A visible label beside the icon (the phone boards draw one). */
  children?: React.ReactNode;
  /** When the data on screen was read, if the caller knows better than the last press. */
  updatedAt?: Date | number | null;
  messages?: Partial<RefreshButtonMessages>;
  iconClassName?: string;
  succeededMs?: number;
  failedMs?: number;
  onRefreshFailed?: (error: unknown) => void;
}

const VARIANTS = {
  outline:
    "size-8 gap-2 rounded-lg border-[1.5px] border-[#56C7F3] bg-[#052D2D] text-foreground hover:bg-[#56C7F3]/10",
  ghost: "text-[#56C7F3] hover:opacity-85",
} as const;

export const RefreshButton = React.forwardRef<HTMLButtonElement, RefreshButtonProps>(
  (
    {
      onRefresh,
      variant = "outline",
      label = "Refresh",
      children,
      updatedAt,
      messages,
      iconClassName,
      succeededMs,
      failedMs,
      onRefreshFailed,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const text = { ...DEFAULT_MESSAGES, ...messages };
    const { status, refreshing, refresh, lastSucceededAt, lastFailed } = useRefreshAction(onRefresh, {
      succeededMs,
      failedMs,
      onFailed: onRefreshFailed,
    });

    const readAt = updatedAt != null ? new Date(updatedAt) : lastSucceededAt;
    const title = refreshing
      ? text.refreshing
      : lastFailed
        ? text.failed
        : readAt && !Number.isNaN(readAt.getTime())
          ? text.updatedAt(readAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))
          : label;
    const announcement =
      status === "refreshing"
        ? text.refreshing
        : status === "succeeded"
          ? text.succeeded
          : status === "failed"
            ? text.failed
            : "";

    const Icon =
      status === "succeeded" ? FigmaCheckIcon : status === "failed" ? FigmaWarningIcon : FigmaRegenerateIcon;

    return (
      <>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          title={title}
          aria-busy={refreshing || undefined}
          data-status={status}
          disabled={disabled || refreshing}
          onClick={() => void refresh()}
          className={cn(
            "inline-flex shrink-0 items-center justify-center transition-[background-color,opacity,transform] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56C7F3] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            VARIANTS[variant],
            refreshing ? "cursor-progress" : "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        >
          <Icon
            aria-hidden="true"
            data-icon={status}
            className={cn(
              "size-4 shrink-0",
              iconClassName,
              refreshing && "animate-spin motion-reduce:animate-none",
              status === "succeeded" && "text-alien-green-bright",
              status === "failed" && "text-skai-red",
            )}
          />
          {children}
        </button>
        {/* Beside the button, not in it: a button's children are
            presentational, so a live region inside one is not reliably read. */}
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </>
    );
  },
);

RefreshButton.displayName = "RefreshButton";
