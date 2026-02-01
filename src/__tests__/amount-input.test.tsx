import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AmountInput } from "../components/amount-input";

describe("AmountInput", () => {
  it("renders with value", () => {
    render(<AmountInput value="100" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("100");
  });

  it("calls onChange with sanitized value", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "123.456" },
    });
    expect(onChange).toHaveBeenCalledWith("123.456");
  });

  it("sanitizes non-numeric input", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "abc123.45xyz" },
    });
    expect(onChange).toHaveBeenCalledWith("123.45");
  });

  it("shows token symbol and icon", () => {
    render(<AmountInput value="100" onChange={() => {}} token="ETH" />);
    expect(screen.getByText("ETH")).toBeInTheDocument();
  });

  it("shows balance when provided", () => {
    render(
      <AmountInput
        value="100"
        onChange={() => {}}
        balance="1000"
        showBalance
        token="ETH"
      />,
    );
    expect(screen.getByText(/Balance:/)).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
  });

  it("shows label when provided", () => {
    render(<AmountInput value="" onChange={() => {}} label="Amount to swap" />);
    expect(screen.getByText("Amount to swap")).toBeInTheDocument();
  });

  it("applies error styling when error is present", () => {
    const { container } = render(
      <AmountInput value="" onChange={() => {}} error="Error" />,
    );
    // Error styling is on the container div, not the input
    const inputContainer = container.querySelector(".border-destructive");
    expect(inputContainer).toBeInTheDocument();
  });

  it("disables input when disabled prop is set", () => {
    render(<AmountInput value="" onChange={() => {}} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows USD value when provided", () => {
    render(<AmountInput value="100" onChange={() => {}} usdValue={150.5} />);
    // USD value is formatted as currency, may include thousands separator
    expect(screen.getByText(/15,050\.00/)).toBeInTheDocument();
  });

  it("limits decimal places", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} decimals={2} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "123.456789" },
    });
    expect(onChange).toHaveBeenCalledWith("123.45");
  });
});
