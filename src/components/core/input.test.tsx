import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../core/input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles text input", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input).toHaveValue("Hello");
  });

  it("renders with different types", () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "text");

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "password");

    rerender(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");

    rerender(<Input type="number" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "number");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId("input")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveClass("custom-class");
  });

  it("handles onChange event", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "test" },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles onFocus event", () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} data-testid="input" />);
    fireEvent.focus(screen.getByTestId("input"));
    expect(handleFocus).toHaveBeenCalled();
  });

  it("handles onBlur event", () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} data-testid="input" />);
    fireEvent.blur(screen.getByTestId("input"));
    expect(handleBlur).toHaveBeenCalled();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("renders with defaultValue", () => {
    render(<Input defaultValue="default text" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveValue("default text");
  });

  it("renders with value (controlled)", () => {
    const handleChange = vi.fn();
    render(
      <Input value="controlled" onChange={handleChange} data-testid="input" />,
    );
    expect(screen.getByTestId("input")).toHaveValue("controlled");
  });

  it("renders with required attribute", () => {
    render(<Input required data-testid="input" />);
    expect(screen.getByTestId("input")).toBeRequired();
  });

  it("renders with readOnly attribute", () => {
    render(<Input readOnly data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("readonly");
  });

  it("renders with name attribute", () => {
    render(<Input name="test-input" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("name", "test-input");
  });

  it("renders with min/max for number type", () => {
    render(<Input type="number" min={0} max={100} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  it("renders with step for number type", () => {
    render(<Input type="number" step={0.01} data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("step", "0.01");
  });
});
