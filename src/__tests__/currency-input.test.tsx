import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  CurrencyInput,
  formatCurrency,
  parseFormattedValue,
} from "../components/forms/currency-input";

describe("CurrencyInput", () => {
  describe("formatCurrency utility", () => {
    it("should format a number with thousand separators", () => {
      expect(formatCurrency(1234567.89, 2, ",", ".")).toBe("1,234,567.89");
    });

    it("should handle different decimal places", () => {
      expect(formatCurrency(100, 0, ",", ".")).toBe("100");
      expect(formatCurrency(100, 2, ",", ".")).toBe("100.00");
      expect(formatCurrency(100.5, 3, ",", ".")).toBe("100.500");
    });

    it("should handle undefined value", () => {
      expect(formatCurrency(undefined, 2, ",", ".")).toBe("");
    });

    it("should handle NaN", () => {
      expect(formatCurrency(NaN, 2, ",", ".")).toBe("");
    });

    it("should handle different separators", () => {
      expect(formatCurrency(1234.56, 2, ".", ",")).toBe("1.234,56");
    });
  });

  describe("parseFormattedValue utility", () => {
    it("should parse a formatted string to number", () => {
      expect(parseFormattedValue("1,234,567.89", ",", ".")).toBe(1234567.89);
    });

    it("should handle different separators", () => {
      expect(parseFormattedValue("1.234.567,89", ".", ",")).toBe(1234567.89);
    });

    it("should return undefined for empty string", () => {
      expect(parseFormattedValue("", ",", ".")).toBeUndefined();
    });

    it("should return undefined for whitespace", () => {
      expect(parseFormattedValue("   ", ",", ".")).toBeUndefined();
    });

    it("should return undefined for invalid input", () => {
      expect(parseFormattedValue("abc", ",", ".")).toBeUndefined();
    });
  });

  describe("Component rendering", () => {
    it("should render with default props", () => {
      render(<CurrencyInput data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toBeInTheDocument();
    });

    it("should render with initial value", () => {
      render(<CurrencyInput value={1234.56} data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveValue("1,234.56");
    });

    it("should render currency symbol as prefix", () => {
      render(
        <CurrencyInput currency="$" currencyPosition="prefix" value={100} />,
      );
      expect(screen.getByText("$")).toBeInTheDocument();
    });

    it("should render currency symbol as suffix", () => {
      render(
        <CurrencyInput currency="€" currencyPosition="suffix" value={100} />,
      );
      expect(screen.getByText("€")).toBeInTheDocument();
    });

    it("should hide currency symbol when showCurrencySymbol is false", () => {
      render(
        <CurrencyInput currency="$" showCurrencySymbol={false} value={100} />,
      );
      expect(screen.queryByText("$")).not.toBeInTheDocument();
    });

    it("should be disabled when disabled prop is true", () => {
      render(<CurrencyInput disabled data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toBeDisabled();
    });

    it("should show placeholder when no value", () => {
      render(
        <CurrencyInput
          placeholder="Enter amount"
          data-testid="currency-input"
        />,
      );
      expect(screen.getByTestId("currency-input")).toHaveAttribute(
        "placeholder",
        "Enter amount",
      );
    });

    it("should show default placeholder based on decimals", () => {
      render(<CurrencyInput decimals={2} data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveAttribute(
        "placeholder",
        "0.00",
      );
    });

    it("should apply custom className", () => {
      render(
        <CurrencyInput className="custom-class" data-testid="currency-input" />,
      );
      expect(screen.getByTestId("currency-input")).toHaveClass("custom-class");
    });
  });

  describe("User interaction", () => {
    it("should update value on input", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "123" } });

      expect(handleValueChange).toHaveBeenCalledWith(123, "123");
    });

    it("should format value on blur", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          decimals={2}
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "1234" } });
      fireEvent.blur(input);

      expect(input).toHaveValue("1,234.00");
    });

    it("should allow clearing the input", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          value={100}
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "" } });

      expect(handleValueChange).toHaveBeenCalledWith(undefined, "");
    });

    it("should reject non-numeric input", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "abc" } });

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should reject multiple decimal separators", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "12.34" } });
      fireEvent.change(input, { target: { value: "12.34.56" } });

      // Should not update to value with multiple decimals
      expect(input).toHaveValue("12.34");
    });
  });

  describe("Validation", () => {
    it("should enforce minimum value on blur", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          min={10}
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "5" } });
      fireEvent.blur(input);

      expect(handleValueChange).toHaveBeenLastCalledWith(10, "10.00");
    });

    it("should enforce maximum value on blur", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          max={100}
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "500" } });
      fireEvent.blur(input);

      expect(handleValueChange).toHaveBeenLastCalledWith(100, "100.00");
    });

    it("should allow negative values when allowNegative is true", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          allowNegative
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "-123" } });

      expect(handleValueChange).toHaveBeenCalledWith(-123, "-123");
    });

    it("should reject negative values when allowNegative is false", async () => {
      const handleValueChange = vi.fn();
      render(
        <CurrencyInput
          allowNegative={false}
          onValueChange={handleValueChange}
          data-testid="currency-input"
        />,
      );

      const input = screen.getByTestId("currency-input");
      fireEvent.change(input, { target: { value: "-123" } });

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Formatting options", () => {
    it("should use custom thousand separator", () => {
      render(
        <CurrencyInput
          value={1234567.89}
          thousandSeparator=" "
          data-testid="currency-input"
        />,
      );
      expect(screen.getByTestId("currency-input")).toHaveValue("1 234 567.89");
    });

    it("should use custom decimal separator", () => {
      render(
        <CurrencyInput
          value={1234.56}
          thousandSeparator="."
          decimalSeparator=","
          data-testid="currency-input"
        />,
      );
      expect(screen.getByTestId("currency-input")).toHaveValue("1.234,56");
    });

    it("should handle zero decimals", () => {
      render(
        <CurrencyInput
          value={1234.56}
          decimals={0}
          data-testid="currency-input"
        />,
      );
      expect(screen.getByTestId("currency-input")).toHaveValue("1,235");
    });

    it("should handle many decimals", () => {
      render(
        <CurrencyInput
          value={1234.567891}
          decimals={4}
          data-testid="currency-input"
        />,
      );
      expect(screen.getByTestId("currency-input")).toHaveValue("1,234.5679");
    });
  });

  describe("Value prop handling", () => {
    it("should accept string value", () => {
      render(<CurrencyInput value="1234.56" data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveValue("1,234.56");
    });

    it("should accept number value", () => {
      render(<CurrencyInput value={1234.56} data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveValue("1,234.56");
    });

    it("should handle value updates from parent", () => {
      const { rerender } = render(
        <CurrencyInput value={100} data-testid="currency-input" />,
      );
      expect(screen.getByTestId("currency-input")).toHaveValue("100.00");

      rerender(<CurrencyInput value={200} data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveValue("200.00");
    });

    it("should handle undefined value", () => {
      render(<CurrencyInput value={undefined} data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    it("should have decimal inputMode for mobile keyboards", () => {
      render(<CurrencyInput data-testid="currency-input" />);
      expect(screen.getByTestId("currency-input")).toHaveAttribute(
        "inputmode",
        "decimal",
      );
    });

    it("should support aria-label", () => {
      render(
        <CurrencyInput aria-label="Price input" data-testid="currency-input" />,
      );
      expect(screen.getByLabelText("Price input")).toBeInTheDocument();
    });

    it("should support id for label association", () => {
      render(
        <>
          <label htmlFor="price">Price</label>
          <CurrencyInput id="price" data-testid="currency-input" />
        </>,
      );
      expect(screen.getByLabelText("Price")).toBeInTheDocument();
    });
  });
});
