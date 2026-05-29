import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordInput } from "../components/forms/password-input";

// W59 — controlled-value strength regression. Previous version tracked only a
// local `value` state set inside `handleChange`, so when consumers passed a
// `value` prop (controlled), the strength meter never reflected the actual
// value. This test pins the new behaviour.
describe("PasswordInput — strength reflects controlled value", () => {
  it("shows strength immediately for a strong controlled value", () => {
    render(
      <PasswordInput
        showStrength
        value="MyStr0ng!Pass#2024"
        onChange={() => {}}
      />,
    );
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it("shows weak strength for a short controlled value", () => {
    render(
      <PasswordInput showStrength value="abc" onChange={() => {}} />,
    );
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });

  it("respects defaultValue on first paint", () => {
    render(<PasswordInput showStrength defaultValue="MyStr0ng!Pass#2024" />);
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it("hides strength meter when controlled value is empty", () => {
    render(<PasswordInput showStrength value="" onChange={() => {}} />);
    expect(screen.queryByText(/password strength/i)).not.toBeInTheDocument();
  });

  it("reflects controlled value updates", () => {
    const { rerender } = render(
      <PasswordInput showStrength value="abc" onChange={() => {}} />,
    );
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
    rerender(
      <PasswordInput
        showStrength
        value="MyStr0ng!Pass#2024"
        onChange={() => {}}
      />,
    );
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});
