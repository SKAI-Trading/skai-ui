import * as React from "react";

/**
 * ModalScrim — the dimmed backdrop + centred panel that every hand-rolled modal
 * in this codebase re-implements, with the two behaviours they keep forgetting.
 *
 * WHY THIS EXISTS. An audit of the wallet (2026-07-17) found 42 scrim overlays
 * and only 10 that closed when you clicked outside — 32 forced you to hunt for
 * the X (bug 232862b0). There are ZERO Radix Dialogs in that surface, so nothing
 * inherited outside-click dismissal for free and each author had to remember it
 * by hand. Most didn't. Escape-to-close was missing from all of them.
 *
 * ★ THE TRAP THIS CLOSES. The obvious fix — add `onClick={onClose}` to 32
 * backdrops — is WORSE than the bug: a click on the panel BUBBLES to the
 * backdrop, so tapping an input, a token row or an amount field would dismiss
 * the modal. On send / swap / backup screens that is fund-loss-adjacent, not a
 * nuisance.
 *
 * The guard is `e.target === e.currentTarget`: close only when the click landed
 * on the backdrop ITSELF, never on anything inside it. That is one line, needs
 * no wrapper element, and cannot be half-applied — which is exactly why it is in
 * here and not in a comment telling 32 authors to remember `stopPropagation`.
 *
 * Deliberately NOT Radix: these overlays render arbitrary existing markup and a
 * Radix migration would rewrite 32 components. This is the smallest change that
 * makes them correct.
 *
 * @example
 * <ModalScrim onClose={onClose} label="Token details" testId="token-detail-modal">
 *   <div className="w-full max-w-lg glass-card rounded-2xl p-6">…</div>
 * </ModalScrim>
 */
export interface ModalScrimProps {
  /** Dismiss. Fires on backdrop click and on Escape. */
  onClose: () => void;
  /** Accessible name for the dialog (`aria-label`). */
  label: string;
  children: React.ReactNode;
  /** Extra classes for the BACKDROP (z-index, padding). Panel styling belongs on the child. */
  className?: string;
  /** `data-testid` for the backdrop. */
  testId?: string;
  /**
   * Opt out of dismissal for a modal that must not close by accident — a
   * destructive confirm, or a step that would lose entered data. Use rarely and
   * say why at the call site; the default is dismissible because that is what
   * users expect and what the design draws.
   */
  dismissible?: boolean;
}

export function ModalScrim({
  onClose,
  label,
  children,
  className = "",
  testId,
  dismissible = true,
}: ModalScrimProps) {
  // Escape closes. Bound on the document, not the backdrop: focus is normally
  // inside the panel (or on <body> right after mount), and a keydown there never
  // reaches a handler attached to the backdrop element.
  React.useEffect(() => {
    if (!dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dismissible, onClose]);

  const onBackdropClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only a click on the backdrop itself dismisses. A click that STARTED
      // inside the panel and bubbled up has e.target === that inner node, so it
      // is ignored — no stopPropagation needed anywhere in the children.
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <div
      data-testid={testId}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${className}`}
      onClick={dismissible ? onBackdropClick : undefined}
    >
      {children}
    </div>
  );
}

export default ModalScrim;
