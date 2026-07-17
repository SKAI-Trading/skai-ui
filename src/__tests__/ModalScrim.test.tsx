import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ModalScrim } from "../components/overlays/ModalScrim";

/**
 * Guards for the two behaviours 32 wallet overlays were missing, plus the one
 * that makes the naive fix dangerous.
 *
 * The middle test is the point of the component. Adding `onClick={onClose}` to a
 * backdrop WITHOUT the target guard closes the modal whenever you touch anything
 * inside it — an amount field, a token row — which on a send/swap screen is far
 * worse than the dismissal bug being fixed. Mutation-check: delete the
 * `e.target === e.currentTarget` line in ModalScrim and that test must go red.
 */
afterEach(cleanup);

function Fixture({ onClose, dismissible }: { onClose: () => void; dismissible?: boolean }) {
  return (
    <ModalScrim onClose={onClose} label="Test dialog" testId="scrim" dismissible={dismissible}>
      <div data-testid="panel">
        <input data-testid="field" defaultValue="0.5" />
        <button data-testid="row">A token row</button>
      </div>
    </ModalScrim>
  );
}

describe("ModalScrim", () => {
  it("closes when the backdrop itself is clicked", () => {
    const onClose = vi.fn();
    render(<Fixture onClose={onClose} />);
    fireEvent.click(screen.getByTestId("scrim"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT close when a click lands inside the panel", () => {
    // THE GUARD THAT MATTERS. A click on an input bubbles to the backdrop; a
    // bare onClick={onClose} would fire here and dismiss a half-filled send
    // form. Nothing inside the panel may dismiss.
    const onClose = vi.fn();
    render(<Fixture onClose={onClose} />);
    fireEvent.click(screen.getByTestId("panel"));
    fireEvent.click(screen.getByTestId("field"));
    fireEvent.click(screen.getByTestId("row"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on Escape", () => {
    // Missing from every wallet overlay before this component existed.
    const onClose = vi.fn();
    render(<Fixture onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("honours dismissible={false} for both backdrop and Escape", () => {
    const onClose = vi.fn();
    render(<Fixture onClose={onClose} dismissible={false} />);
    fireEvent.click(screen.getByTestId("scrim"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("unbinds Escape on unmount so a closed modal cannot swallow the key", () => {
    const onClose = vi.fn();
    const { unmount } = render(<Fixture onClose={onClose} />);
    unmount();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("carries the dialog semantics the hand-rolled overlays each re-declared", () => {
    render(<Fixture onClose={vi.fn()} />);
    const scrim = screen.getByTestId("scrim");
    expect(scrim).toHaveAttribute("role", "dialog");
    expect(scrim).toHaveAttribute("aria-modal", "true");
    expect(scrim).toHaveAttribute("aria-label", "Test dialog");
  });
});
