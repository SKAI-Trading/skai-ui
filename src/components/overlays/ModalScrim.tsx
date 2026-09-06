import * as React from "react";
import { cn } from "../../lib/utils";

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
 * The guard has TWO halves, and the first one alone is not enough.
 *
 * `e.target === e.currentTarget` closes only when the click landed on the
 * backdrop ITSELF, never on anything inside it. That handles a click that
 * starts and ends in the panel. It does NOT handle a DRAG: a click fires on the
 * nearest common ancestor of press and release, so pressing inside the panel
 * and releasing over the backdrop produces a click whose target is the
 * backdrop, and the target test waves it through. Selecting text in a field and
 * overshooting the edge is enough to trigger it, which on SendModal or
 * WalletBackup discards a pasted address or a backup confirmation.
 *
 * So a pointerdown latch records where the press began and suppresses the
 * click if it began inside. Both halves are needed; neither is redundant.
 * Both live here rather than in a comment telling 32 authors to remember
 * `stopPropagation`.
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
  /**
   * Classes for the BACKDROP, merged over the defaults with tailwind-merge — so a
   * caller can OVERRIDE, not just add: pass `items-end sm:items-center` for a
   * mobile bottom-sheet and it replaces the default `items-center`; pass
   * `bg-black/90` and it replaces `bg-black/80`. This is what lets the varied
   * hand-rolled scrims (some bottom-sheet, some /90) migrate without changing how
   * they look. Panel styling belongs on the child, not here.
   */
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

  /**
   * Whether the press that is about to become a click began inside the panel.
   *
   * A `click` fires on the nearest common ancestor of where the press started
   * and where it ended, so releasing over the backdrop after pressing INSIDE
   * the panel delivers a click whose target IS the backdrop — indistinguishable
   * from a deliberate outside click by target alone. That is what happens when
   * someone sweeps a selection out of a text field and overshoots, and the
   * modal closes, taking a half-typed bug report or a pasted address with it.
   *
   * The check below is deliberately one-sided: it only ever SUPPRESSES a
   * dismissal that the target test already allowed. A click arriving with no
   * preceding pointerdown — a synthetic one, or `fireEvent.click` in a test —
   * leaves this false and still dismisses, so no existing caller loses a path
   * it had. Radix expresses the same rule as `pointerDownOutside`.
   */
  const pressStartedInside = React.useRef(false);

  const onBackdropPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      pressStartedInside.current = e.target !== e.currentTarget;
    },
    [],
  );

  const onBackdropClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Consume the latch whatever the outcome, so one drag-off cannot suppress
      // the NEXT click too.
      const startedInside = pressStartedInside.current;
      pressStartedInside.current = false;
      if (startedInside) return;
      // Only a click on the backdrop itself dismisses. A click that started and
      // ended inside the panel has e.target === that inner node, so it is
      // ignored — no stopPropagation needed anywhere in the children.
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
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
        className,
      )}
      onPointerDown={dismissible ? onBackdropPointerDown : undefined}
      onClick={dismissible ? onBackdropClick : undefined}
    >
      {children}
    </div>
  );
}

export default ModalScrim;
