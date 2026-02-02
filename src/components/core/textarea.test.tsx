import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Textarea } from "../core/textarea";

describe("Textarea", () => {
  it("renders correctly", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles text input", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    fireEvent.change(textarea, { target: { value: "Hello World" } });
    expect(textarea).toHaveValue("Hello World");
  });

  it("handles multiline text", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    const multilineText = "Line 1\nLine 2\nLine 3";
    fireEvent.change(textarea, { target: { value: multilineText } });
    expect(textarea).toHaveValue(multilineText);
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Textarea disabled data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveClass("custom-class");
  });

  it("handles onChange event", () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} data-testid="textarea" />);
    fireEvent.change(screen.getByTestId("textarea"), {
      target: { value: "test" },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles onFocus event", () => {
    const handleFocus = vi.fn();
    render(<Textarea onFocus={handleFocus} data-testid="textarea" />);
    fireEvent.focus(screen.getByTestId("textarea"));
    expect(handleFocus).toHaveBeenCalled();
  });

  it("handles onBlur event", () => {
    const handleBlur = vi.fn();
    render(<Textarea onBlur={handleBlur} data-testid="textarea" />);
    fireEvent.blur(screen.getByTestId("textarea"));
    expect(handleBlur).toHaveBeenCalled();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("renders with defaultValue", () => {
    render(<Textarea defaultValue="default text" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveValue("default text");
  });

  it("renders with value (controlled)", () => {
    const handleChange = vi.fn();
    render(
      <Textarea
        value="controlled"
        onChange={handleChange}
        data-testid="textarea"
      />,
    );
    expect(screen.getByTestId("textarea")).toHaveValue("controlled");
  });

  it("renders with required attribute", () => {
    render(<Textarea required data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeRequired();
  });

  it("renders with readOnly attribute", () => {
    render(<Textarea readOnly data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("readonly");
  });

  it("renders with rows attribute", () => {
    render(<Textarea rows={5} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("rows", "5");
  });

  it("renders with maxLength attribute", () => {
    render(<Textarea maxLength={100} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("maxlength", "100");
  });

  it("has correct base styles", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveClass("flex");
    expect(textarea).toHaveClass("min-h-[80px]");
    expect(textarea).toHaveClass("w-full");
    expect(textarea).toHaveClass("rounded-md");
    expect(textarea).toHaveClass("border");
  });
});
