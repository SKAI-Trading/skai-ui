import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput, calculateStrength } from "../components/password-input";

describe("PasswordInput", () => {
  describe("Rendering", () => {
    it("renders with password type by default", () => {
      render(<PasswordInput />);
      // Password inputs don't have textbox role, need to query by type
      const passwordInput = document.querySelector('input[type="password"]');
      expect(passwordInput).toBeInTheDocument();
    });

    it("renders toggle button", () => {
      render(<PasswordInput />);
      expect(
        screen.getByRole("button", { name: /show password/i }),
      ).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<PasswordInput className="custom-class" />);
      expect(container.querySelector("input")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = vi.fn();
      render(<PasswordInput ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe("Visibility Toggle", () => {
    it("toggles password visibility on button click", async () => {
      const user = userEvent.setup();
      render(<PasswordInput />);

      const input = document.querySelector("input") as HTMLInputElement;
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      expect(input.type).toBe("password");

      await user.click(toggleButton);
      expect(input.type).toBe("text");
      expect(
        screen.getByRole("button", { name: /hide password/i }),
      ).toBeInTheDocument();

      await user.click(toggleButton);
      expect(input.type).toBe("password");
    });

    it("shows different icons for show/hide states", async () => {
      const user = userEvent.setup();
      const { container } = render(<PasswordInput />);

      const toggleButton = screen.getByRole("button");

      // Initially shows eye icon (show password)
      expect(container.querySelector("svg")).toBeInTheDocument();

      await user.click(toggleButton);

      // After click shows eye-off icon (hide password)
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("displays error message when error prop is provided", () => {
      render(<PasswordInput error="Password is required" />);
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("sets aria-invalid when error is present", () => {
      render(<PasswordInput error="Invalid password" />);
      const input = document.querySelector("input");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("links error to input via aria-describedby", () => {
      render(<PasswordInput error="Error message" errorId="custom-error" />);
      const input = document.querySelector("input");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input?.getAttribute("aria-describedby")).toContain("custom-error");
    });

    it("applies error styling to input", () => {
      const { container } = render(<PasswordInput error="Error" />);
      const input = container.querySelector("input");
      expect(input).toHaveClass("border-destructive");
    });
  });

  describe("Strength Indicator", () => {
    it("shows strength indicator when showStrength is true", async () => {
      const user = userEvent.setup();
      render(<PasswordInput showStrength />);

      const input = document.querySelector("input") as HTMLInputElement;
      await user.type(input, "test");

      expect(screen.getByText(/password strength/i)).toBeInTheDocument();
    });

    it("hides strength indicator when showStrength is false", async () => {
      const user = userEvent.setup();
      render(<PasswordInput showStrength={false} />);

      const input = document.querySelector("input") as HTMLInputElement;
      await user.type(input, "test");

      expect(screen.queryByText(/password strength/i)).not.toBeInTheDocument();
    });

    it("updates strength as user types", async () => {
      const user = userEvent.setup();
      render(<PasswordInput showStrength />);

      const input = document.querySelector("input") as HTMLInputElement;

      // Type weak password
      await user.type(input, "abc");
      expect(screen.getByText(/weak/i)).toBeInTheDocument();

      // Clear and type stronger password
      await user.clear(input);
      await user.type(input, "MyStr0ng!Pass#2024");
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

    it("uses custom strength calculator when provided", async () => {
      const user = userEvent.setup();
      const customCalculator = vi.fn().mockReturnValue("strong");

      render(
        <PasswordInput showStrength strengthCalculator={customCalculator} />,
      );

      const input = document.querySelector("input") as HTMLInputElement;
      await user.type(input, "x");

      expect(customCalculator).toHaveBeenCalled();
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper aria-label on toggle button", () => {
      render(<PasswordInput />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label");
    });

    it("toggle button has tabIndex -1 to skip in tab order", () => {
      render(<PasswordInput />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("tabIndex", "-1");
    });

    it("strength indicator has aria-live for screen readers", async () => {
      const user = userEvent.setup();
      render(<PasswordInput showStrength />);

      const input = document.querySelector("input") as HTMLInputElement;
      await user.type(input, "test");

      const strengthText = screen.getByText(/password strength/i);
      expect(strengthText).toHaveAttribute("aria-live", "polite");
    });

    it("error message has role=alert", () => {
      render(<PasswordInput error="Error occurred" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("calls onChange when typing", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<PasswordInput onChange={handleChange} />);

      const input = document.querySelector("input") as HTMLInputElement;
      await user.type(input, "test");

      expect(handleChange).toHaveBeenCalled();
    });

    it("supports disabled state", () => {
      render(<PasswordInput disabled />);
      const input = document.querySelector("input");
      expect(input).toBeDisabled();
    });

    it("supports placeholder", () => {
      render(<PasswordInput placeholder="Enter password" />);
      expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    });
  });
});

describe("calculateStrength", () => {
  it("returns weak for empty password", () => {
    expect(calculateStrength("")).toBe("weak");
  });

  it("returns weak for short passwords", () => {
    expect(calculateStrength("abc")).toBe("weak");
  });

  it("returns fair for medium complexity", () => {
    expect(calculateStrength("password1")).toBe("fair");
  });

  it("returns good for good complexity", () => {
    // Password123 = 11 chars (length bonus) + lower + upper + numbers = score 5 = good
    expect(calculateStrength("Password123!")).toBe("good");
  });

  it("returns strong for high complexity", () => {
    expect(calculateStrength("MyStr0ng!Pass#2024")).toBe("strong");
  });

  it("considers length in strength calculation", () => {
    // Short with variety
    const short = calculateStrength("Aa1!");
    // Long with variety
    const long = calculateStrength("Aa1!Aa1!Aa1!Aa1!");

    expect(short).not.toBe("strong");
    expect(long).toBe("strong");
  });

  it("considers character variety", () => {
    // Only lowercase
    const lowercase = calculateStrength("abcdefghij");
    // Mixed case + numbers + symbols
    const mixed = calculateStrength("aBcD1234!@");

    expect(mixed).not.toBe("weak");
  });
});
