import * as React from "react";
import { RefreshCw, SearchX, WifiOff, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { SkaiButton } from "../core/button";
import { SkaiLogo } from "../branding/skai-logo";

// =============================================================================
// ERROR SCREEN
// =============================================================================
// The one full-page error screen for every surface. Figma draws no full-page
// error, so it is assembled from parts that are drawn (Casey, 2026-11-18,
// rulings 57 and 58):
//
// - the cold-boot screen: the green-coal base #001615 with the loader's green
//   glow, and the short Skai logo pinned top-left (PageLoadingFallback);
// - the "Bridge screen - error" card (13006:248871, 13008:29130): #122524 at
//   radius 24 and padding 16, under the error leg's 0/10/80 black shadow;
// - the "Swap - error" plate (7804:77701): a radius-16 plate tinted with App/Red
//   300 at 16%, a 16 glyph 6 from a bold Manrope heading, the sentence beneath
//   both in Mulish;
// - SkaiButton, the Figma CTA set, at the Bridge CTA's 64 height.
//
// The copy is a title, one line and at most two buttons. Anything longer, such
// as the error's own message, goes in `detail`, which is a hover tooltip only.
//
// This renders above every provider (the app's outermost boundary sits outside
// the router, react-query and i18n), so it reads no context, uses plain
// anchors and window.location, and imports nothing that loads on demand.
// =============================================================================

export type ErrorScreenVariant = "crash" | "not-found" | "wallet" | "offline" | "reload";

export interface ErrorScreenAction {
  label: string;
  /** Runs on click. With `href` as well, the anchor's navigation is replaced by this. */
  onClick?: () => void;
  /** Renders the action as a plain anchor. */
  href?: string;
}

export interface ErrorScreenProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ErrorScreenVariant;
  /** Replaces the variant's title. */
  title?: string;
  /** Replaces the variant's one line. */
  description?: string;
  /** A longer reason, such as the error message. Shown in a hover tooltip only. */
  detail?: string;
  /** Replaces the variant's primary action; `null` draws none. */
  primaryAction?: ErrorScreenAction | null;
  /** Replaces the variant's second action; `null` draws none. */
  secondaryAction?: ErrorScreenAction | null;
  /**
   * "page" covers the viewport, with the logo top-left, for a screen that
   * replaces the whole app. "inline" fills the slot it is mounted in, for a
   * route inside a shell whose header stays up.
   */
  layout?: "page" | "inline";
  /** Moves focus to the primary action when the screen mounts. On by default. */
  autoFocus?: boolean;
}

interface VariantCopy {
  title: string;
  description: string;
}

/**
 * Each variant's words. Exported so the two copies that cannot import this
 * file (the app's pre-React bootstrap screen and its service-worker offline
 * page) can be held to the same text by a test.
 */
export const errorScreenCopy: Record<ErrorScreenVariant, VariantCopy> = {
  crash: {
    title: "Something went wrong",
    description: "This screen hit an error. Reload to try again.",
  },
  "not-found": {
    title: "Page not found",
    description: "This link is broken or the page has moved.",
  },
  wallet: {
    title: "Wallet unavailable",
    description: "The wallet connection did not start. Try again in a moment.",
  },
  offline: {
    title: "You're offline",
    description: "Check your connection, then try again.",
  },
  reload: {
    title: "New version available",
    description: "The app was updated while this tab was open. Reload to continue.",
  },
};

const variantGlyph: Record<ErrorScreenVariant, LucideIcon> = {
  crash: XCircle,
  "not-found": SearchX,
  wallet: XCircle,
  offline: WifiOff,
  reload: RefreshCw,
};

function reloadPage() {
  try {
    window.location.reload();
  } catch {
    /* nothing left to do from here */
  }
}

function goBack() {
  try {
    window.history.back();
  } catch {
    /* nothing left to do from here */
  }
}

const reload: ErrorScreenAction = { label: "Reload", onClick: reloadPage };
const tryAgain: ErrorScreenAction = { label: "Try again", onClick: reloadPage };
const goHome: ErrorScreenAction = { label: "Go home", href: "/" };

const defaultActions: Record<
  ErrorScreenVariant,
  { primary: ErrorScreenAction; secondary: ErrorScreenAction | null }
> = {
  crash: { primary: reload, secondary: goHome },
  "not-found": { primary: goHome, secondary: { label: "Go back", onClick: goBack } },
  wallet: { primary: tryAgain, secondary: null },
  offline: { primary: tryAgain, secondary: null },
  reload: { primary: reload, secondary: null },
};

/**
 * The Swap error plate (7804:77701), shared by ErrorScreen and ErrorNotice so a
 * section's error and a page's error are drawn from one set of classes.
 */
const PLATE_CLASS = "rounded-[16px] bg-[#ff574a]/[0.16]";
const GLYPH_CLASS = "size-4 shrink-0 text-[#ff574a]";
const HEADING_CLASS = "font-['Manrope'] text-[16px] font-bold leading-[22px] text-white";
const LINE_CLASS = "font-['Mulish'] text-[14px] leading-[18px] text-[#E0E0E0]";

/** The loader's glow (SkaiLoader), held still: an error screen does not pulse. */
const GLOW_BACKGROUND =
  "radial-gradient(closest-side, rgba(23,249,180,0.18), rgba(23,249,180,0.06) 45%, transparent 70%)";

const ActionButton = React.forwardRef<
  HTMLButtonElement,
  { action: ErrorScreenAction; kind: "primary" | "secondary" }
>(({ action, kind }, ref) => {
  const className = "w-full sm:flex-1";
  const skaiType = kind === "primary" ? "primary" : "secondary";
  if (action.href) {
    const onClick = action.onClick
      ? (event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          action.onClick?.();
        }
      : undefined;
    return (
      <SkaiButton
        asChild
        skaiType={skaiType}
        skaiSize="large"
        className={className}
        ref={ref}
      >
        <a href={action.href} onClick={onClick}>
          {action.label}
        </a>
      </SkaiButton>
    );
  }
  return (
    <SkaiButton
      type="button"
      skaiType={skaiType}
      skaiSize="large"
      className={className}
      onClick={action.onClick}
      ref={ref}
    >
      {action.label}
    </SkaiButton>
  );
});
ActionButton.displayName = "ErrorScreenAction";

const ErrorScreen = React.forwardRef<HTMLDivElement, ErrorScreenProps>(
  (
    {
      variant = "crash",
      title,
      description,
      detail,
      primaryAction,
      secondaryAction,
      layout = "page",
      autoFocus = true,
      className,
      ...props
    },
    ref,
  ) => {
    const ids = React.useId();
    const titleId = `${ids}-title`;
    const lineId = `${ids}-line`;
    const primaryRef = React.useRef<HTMLButtonElement>(null);

    const copy = errorScreenCopy[variant] ?? errorScreenCopy.crash;
    const defaults = defaultActions[variant] ?? defaultActions.crash;
    const primary = primaryAction === undefined ? defaults.primary : primaryAction;
    const secondary = secondaryAction === undefined ? defaults.secondary : secondaryAction;
    const Glyph = variantGlyph[variant] ?? XCircle;
    const Heading = layout === "page" ? "h1" : "h2";

    React.useEffect(() => {
      if (!autoFocus) return;
      try {
        primaryRef.current?.focus({ preventScroll: true });
      } catch {
        /* focus is a courtesy, never a reason to fail */
      }
    }, [autoFocus]);

    const card = (
      <div
        className="relative z-10 m-auto flex w-full max-w-[506px] flex-col gap-6 rounded-[24px] bg-[#122524] p-4 shadow-[0px_10px_80px_0px_rgba(0,0,0,0.25)]"
        data-error-card=""
      >
        <div
          className={cn(PLATE_CLASS, "py-3 pl-4 pr-5")}
          title={detail || undefined}
          data-error-plate=""
        >
          <div className="flex items-center gap-1.5">
            <Glyph className={GLYPH_CLASS} aria-hidden="true" />
            <Heading id={titleId} className={HEADING_CLASS}>
              {title ?? copy.title}
            </Heading>
          </div>
          <p id={lineId} className={cn(LINE_CLASS, "mt-1")}>
            {description ?? copy.description}
          </p>
        </div>

        {(primary || secondary) && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {primary && <ActionButton action={primary} kind="primary" ref={primaryRef} />}
            {secondary && <ActionButton action={secondary} kind="secondary" />}
          </div>
        )}
      </div>
    );

    if (layout === "inline") {
      return (
        <div
          ref={ref}
          role="alert"
          aria-labelledby={titleId}
          aria-describedby={lineId}
          data-variant={variant}
          className={cn("flex min-h-[60vh] w-full px-4 py-8", className)}
          {...props}
        >
          {card}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="alert"
        aria-labelledby={titleId}
        aria-describedby={lineId}
        data-variant={variant}
        className={cn("fixed inset-0 z-50 overflow-hidden bg-[#001615] text-white", className)}
        {...props}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[70%] h-[180vw] max-h-[1800px] w-[180vw] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: GLOW_BACKGROUND }}
        />
        <div className="absolute inset-0 flex flex-col overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pl-[calc(1rem+env(safe-area-inset-left,0px))] pr-[calc(1rem+env(safe-area-inset-right,0px))] pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">
          <div
            aria-hidden="true"
            className="absolute left-[calc(1.25rem+env(safe-area-inset-left,0px))] top-[calc(1rem+env(safe-area-inset-top,0px))] z-10"
            data-error-logo=""
          >
            <SkaiLogo size="compact" variant="white" wordmark="short" />
          </div>
          {card}
        </div>
      </div>
    );
  },
);
ErrorScreen.displayName = "ErrorScreen";

// =============================================================================
// ERROR NOTICE
// =============================================================================
// The same plate for an error that keeps its place inside a page: one section
// of a screen failing while the rest stays up. It fills its slot, takes one
// action, and in its compact form is a single row for tight layouts (an order
// book, a ticker).
// =============================================================================

export interface ErrorNoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Picks the glyph: offline draws the no-signal mark, reload the arrows. */
  variant?: ErrorScreenVariant;
  title: string;
  description?: string;
  /** A longer reason, such as the error message. Shown in a hover tooltip only. */
  detail?: string;
  /** One action, such as Retry. */
  action?: ErrorScreenAction;
  /** Accessible name for the action when its label alone is ambiguous. */
  actionLabel?: string;
  /** A single row: glyph, title and the action. */
  compact?: boolean;
}

const ErrorNotice = React.forwardRef<HTMLDivElement, ErrorNoticeProps>(
  (
    { variant = "crash", title, description, detail, action, actionLabel, compact = false, className, ...props },
    ref,
  ) => {
    const Glyph = variantGlyph[variant] ?? XCircle;

    if (compact) {
      return (
        <div
          ref={ref}
          role="alert"
          title={detail || undefined}
          className={cn(PLATE_CLASS, "flex items-center justify-center gap-1.5 px-3 py-2", className)}
          {...props}
        >
          <Glyph className={GLYPH_CLASS} aria-hidden="true" />
          <span className={cn(HEADING_CLASS, "truncate text-[14px] leading-[18px]")}>{title}</span>
          {action && (
            <SkaiButton
              type="button"
              skaiType="tertiary"
              skaiSize="pill"
              className="h-6 shrink-0 px-2 text-[12px] leading-4"
              onClick={action.onClick}
              aria-label={actionLabel}
            >
              {action.label}
            </SkaiButton>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(PLATE_CLASS, "flex h-full flex-col justify-center gap-3 py-3 pl-4 pr-5", className)}
        {...props}
      >
        <div title={detail || undefined}>
          <div className="flex items-center gap-1.5">
            <Glyph className={GLYPH_CLASS} aria-hidden="true" />
            <p className={HEADING_CLASS}>{title}</p>
          </div>
          {description && <p className={cn(LINE_CLASS, "mt-1")}>{description}</p>}
        </div>
        {action && (
          <div>
            <SkaiButton
              type="button"
              skaiType="secondary"
              skaiSize="pill"
              onClick={action.onClick}
              aria-label={actionLabel}
            >
              {action.label}
            </SkaiButton>
          </div>
        )}
      </div>
    );
  },
);
ErrorNotice.displayName = "ErrorNotice";

export { ErrorScreen, ErrorNotice };
