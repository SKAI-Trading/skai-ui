/**
 * EmailAuthModal — the consent control is the point of these tests.
 *
 * Casey's constraint: "Do not make it a no-op tickbox — a consent control that
 * records nothing is worse than none, because it looks like evidence." The
 * recording half lives in `signupConsent.ts` and is tested there. The half
 * tested HERE is the gate: an unticked box must make every sign-in path
 * unreachable, not merely look disabled.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmailAuthModal } from "./email-auth-modal";

const noop = () => undefined;

function setup(overrides: Partial<React.ComponentProps<typeof EmailAuthModal>> = {}) {
  const props = {
    isOpen: true,
    onClose: vi.fn(),
    onEmailSubmit: vi.fn(),
    onGoogleLogin: vi.fn(),
    onAppleLogin: vi.fn(),
    consentAccepted: false,
    onConsentChange: vi.fn(),
    ...overrides,
  };
  render(<EmailAuthModal {...props} />);
  return props;
}

const typeEmail = (value: string) =>
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value } });

beforeEach(() => vi.clearAllMocks());

describe("consent gates every sign-in path", () => {
  it("blocks email submit while consent is unticked", () => {
    const props = setup({ consentAccepted: false });
    typeEmail("someone@example.com");
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
  });

  it("blocks Google while consent is unticked", () => {
    const props = setup({ consentAccepted: false });
    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    expect(props.onGoogleLogin).not.toHaveBeenCalled();
  });

  it("blocks Apple while consent is unticked", () => {
    const props = setup({ consentAccepted: false });
    fireEvent.click(screen.getByRole("button", { name: /apple/i }));
    expect(props.onAppleLogin).not.toHaveBeenCalled();
  });

  it("allows email submit once consent is ticked", () => {
    const props = setup({ consentAccepted: true });
    typeEmail("someone@example.com");
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(props.onEmailSubmit).toHaveBeenCalledWith("someone@example.com");
  });

  it("allows the socials once consent is ticked", () => {
    const props = setup({ consentAccepted: true });
    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    fireEvent.click(screen.getByRole("button", { name: /apple/i }));
    expect(props.onGoogleLogin).toHaveBeenCalledTimes(1);
    expect(props.onAppleLogin).toHaveBeenCalledTimes(1);
  });
});

describe("consent checkbox", () => {
  it("starts unchecked — never pre-attests on the user's behalf", () => {
    setup({ consentAccepted: false });
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("reports the toggle to the parent so the moment can be timestamped", () => {
    const props = setup({ consentAccepted: false });
    fireEvent.click(screen.getByRole("checkbox"));
    expect(props.onConsentChange).toHaveBeenCalledWith(true);
  });

  it("states the jurisdiction claim the user is making", () => {
    setup();
    expect(screen.getByText(/not located in a restricted jurisdiction/i)).toBeInTheDocument();
  });

  it("links Terms and Privacy so the claim is readable before it is made", () => {
    setup({ termsHref: "/terms", privacyHref: "/privacy" });
    expect(screen.getByRole("link", { name: /terms/i })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: /privacy/i })).toHaveAttribute("href", "/privacy");
  });
});

describe("in-flight and empty states", () => {
  it("blocks submit while loading even with consent given", () => {
    const props = setup({ consentAccepted: true, loading: true });
    typeEmail("someone@example.com");
    fireEvent.click(screen.getByRole("button", { name: /sending code/i }));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
  });

  it("does not submit an empty email", () => {
    const props = setup({ consentAccepted: true });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
  });

  it("leaves Continue pressable with an empty field, and says what is missing", () => {
    const props = setup({ consentAccepted: true });
    const submit = screen.getByRole("button", { name: /continue/i });
    expect(submit).not.toBeDisabled();

    fireEvent.click(submit);
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter your email address to continue.",
    );
  });

  it("names a malformed address rather than swallowing the press", () => {
    const props = setup({ consentAccepted: true });
    typeEmail("someone@");
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(props.onEmailSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "That does not look like an email address.",
    );
  });

  it("clears the message as soon as the user types again", () => {
    setup({ consentAccepted: true });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    typeEmail("someone@example.com");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders an error when one is supplied", () => {
    setup({ error: "That code isn't right." });
    expect(screen.getByRole("alert")).toHaveTextContent("That code isn't right.");
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <EmailAuthModal
        isOpen={false}
        onClose={noop}
        onEmailSubmit={noop}
        consentAccepted={false}
        onConsentChange={noop}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
