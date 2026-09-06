/**
 * ModalScrim — a drag that ends on the backdrop must not dismiss.
 *
 * A `click` fires on the nearest common ancestor of press and release, so
 * sweeping a selection out of a field inside the panel and letting go over the
 * backdrop delivers a click whose target IS the backdrop. Before the
 * pointerdown latch, that was indistinguishable from a deliberate outside click
 * and threw away whatever the panel held — a half-written bug report, a pasted
 * address in SendModal, a seed phrase confirmation in WalletBackup.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ModalScrim } from "./ModalScrim";

function setup(onClose: () => void, dismissible = true) {
  render(
    <ModalScrim onClose={onClose} label="Test modal" testId="scrim" dismissible={dismissible}>
      <div data-testid="panel">
        <input data-testid="field" defaultValue="half-typed" />
      </div>
    </ModalScrim>,
  );
  return {
    scrim: screen.getByTestId("scrim"),
    panel: screen.getByTestId("panel"),
    field: screen.getByTestId("field"),
  };
}

describe("ModalScrim dismissal", () => {
  it("closes on a press and release both on the backdrop", () => {
    const onClose = vi.fn();
    const { scrim } = setup(onClose);
    fireEvent.pointerDown(scrim);
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * The regression. The press lands on the field; the release lands on the
   * backdrop, so the browser targets the click at their common ancestor — the
   * backdrop. Only the latch can tell this apart from the case above.
   */
  it("does NOT close when the press started inside the panel", () => {
    const onClose = vi.fn();
    const { scrim, field } = setup(onClose);
    fireEvent.pointerDown(field);
    fireEvent.click(scrim);
    expect(onClose).not.toHaveBeenCalled();
  });

  /**
   * The latch must be consumed even when it suppressed a dismissal, or one
   * drag-off would silently eat the user's next genuine outside click too.
   */
  it("still closes on the next real backdrop click after a drag-off", () => {
    const onClose = vi.fn();
    const { scrim, field } = setup(onClose);
    fireEvent.pointerDown(field);
    fireEvent.click(scrim);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(scrim);
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 55 files consume this component and seven of their tests click the backdrop
   * with no preceding pointerdown. The latch defaults to "not inside", so those
   * keep working — the fix only ever removes a dismissal, never adds a
   * requirement.
   */
  it("closes on a bare click with no preceding pointerdown", () => {
    const onClose = vi.fn();
    const { scrim } = setup(onClose);
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores a click that both started and ended inside the panel", () => {
    const onClose = vi.fn();
    const { field } = setup(onClose);
    fireEvent.pointerDown(field);
    fireEvent.click(field);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not dismiss at all when dismissible is false", () => {
    const onClose = vi.fn();
    const { scrim } = setup(onClose, false);
    fireEvent.pointerDown(scrim);
    fireEvent.click(scrim);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("still closes on Escape", () => {
    const onClose = vi.fn();
    setup(onClose);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
