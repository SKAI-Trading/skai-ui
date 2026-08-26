import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WaitlistModal } from "./waitlist-modal";

/**
 * Figma 2005:9995 — "Skai > Onboarding > Get early access 1VH".
 *
 * The frame draws Continue at full strength next to a placeholder-only email
 * field. It used to carry `disabled={!email.trim()}`, which greyed the frame's
 * primary CTA the moment the modal opened AND made the component's own
 * "Please enter your email address." branch unreachable — an empty submit did
 * nothing at all and told the user nothing.
 */
describe("WaitlistModal — empty submit (Figma 2005:10015)", () => {
  const baseProps = {
    isOpen: true,
    onClose: () => {},
    onEmailSubmit: vi.fn(),
  };

  it("keeps Continue enabled while the email field is empty", () => {
    render(<WaitlistModal {...baseProps} onEmailSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Continue" })).not.toBeDisabled();
  });

  it("surfaces the validation message on an empty submit instead of doing nothing", () => {
    const onEmailSubmit = vi.fn();
    render(<WaitlistModal {...baseProps} onEmailSubmit={onEmailSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter your email address.",
    );
    expect(onEmailSubmit).not.toHaveBeenCalled();
  });

  it("still refuses to hand a malformed address to the caller", () => {
    const onEmailSubmit = vi.fn();
    render(<WaitlistModal {...baseProps} onEmailSubmit={onEmailSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("example@provider.com"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    // `type="email"` makes the field :invalid here, so the platform blocks the
    // submit and shows its own bubble before `validateAndSubmit` ever runs.
    // Either way nothing malformed reaches the caller — which is the contract
    // that matters. (Enter-key submits go through `handleKeyDown`, which is not
    // gated by constraint validation and does hit the component's own message.)
    expect(onEmailSubmit).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByPlaceholderText("example@provider.com"), {
      key: "Enter",
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a valid email address.",
    );
    expect(onEmailSubmit).not.toHaveBeenCalled();
  });

  it("submits a valid, trimmed address", () => {
    const onEmailSubmit = vi.fn();
    render(<WaitlistModal {...baseProps} onEmailSubmit={onEmailSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("example@provider.com"), {
      target: { value: "  someone@provider.com  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(onEmailSubmit).toHaveBeenCalledWith("someone@provider.com");
  });

  it("disables Continue only while an auth attempt is in flight", () => {
    render(<WaitlistModal {...baseProps} onEmailSubmit={vi.fn()} isLoading />);
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });
});

/**
 * Report 2e84facb — "when signing in ... the circle is green which is not the
 * same as the other loading circles ... change the rotating circle to blue to
 * match the new Skai blue".
 *
 * The expectation is not re-derived from the component: #56C7F3 is Primary/Sky
 * Blue 300 as named by the Figma frame this modal is built from, and #2DEDAD is
 * the Alien Green the rest of the modal had already left behind. Both literals
 * are written out here so a revert to the green cannot pass.
 */
describe("WaitlistModal — authenticating spinner colour (report 2e84facb)", () => {
  const SKY_BLUE_300 = "text-[#56C7F3]";
  const RETIRED_ALIEN_GREEN = "text-[#2DEDAD]";

  const loadingProps = {
    isOpen: true,
    onClose: () => {},
    onEmailSubmit: vi.fn(),
    isLoading: true,
  };

  function spinner(container: HTMLElement): SVGElement {
    const el = container.querySelector("svg.animate-spin");
    if (!el) throw new Error("no spinning svg rendered while isLoading");
    return el as SVGElement;
  }

  it("paints the authenticating spinner Sky Blue 300, not the retired green", () => {
    const { container } = render(<WaitlistModal {...loadingProps} />);

    const cls = spinner(container).getAttribute("class") ?? "";
    expect(cls, "spinner is not on the brand blue").toContain(SKY_BLUE_300);
    expect(cls, "spinner regressed to the retired alien green").not.toContain(
      RETIRED_ALIEN_GREEN,
    );
  });

  it("renders that spinner only while an auth attempt is in flight", () => {
    // Guards the selector above: if the spinner stopped rendering entirely the
    // colour assertion would throw rather than pass vacuously, and this proves
    // the idle state is the discriminating case.
    const { container } = render(
      <WaitlistModal {...loadingProps} isLoading={false} />,
    );
    expect(container.querySelector("svg.animate-spin")).toBeNull();
  });
});
