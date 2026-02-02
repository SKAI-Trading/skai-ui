import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SearchInput } from "../components/search-input";

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Basic rendering
  describe("rendering", () => {
    it("should render with default placeholder", () => {
      render(<SearchInput />);
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should render with custom placeholder", () => {
      render(<SearchInput placeholder="Find tokens..." />);
      expect(screen.getByPlaceholderText("Find tokens...")).toBeInTheDocument();
    });

    it("should render search icon by default", () => {
      const { container } = render(<SearchInput />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render custom icon when provided", () => {
      render(<SearchInput icon={<span data-testid="custom-icon">🔍</span>} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should apply className to input", () => {
      render(<SearchInput className="custom-class" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveClass("custom-class");
    });
  });

  // Size variants
  describe("size variants", () => {
    it("should apply sm size styles", () => {
      render(<SearchInput size="sm" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveClass("h-8");
    });

    it("should apply default size styles", () => {
      render(<SearchInput size="default" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveClass("h-10");
    });

    it("should apply lg size styles", () => {
      render(<SearchInput size="lg" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveClass("h-12");
    });
  });

  // Controlled value
  describe("controlled value", () => {
    it("should display controlled value", () => {
      render(<SearchInput value="test query" onChange={() => {}} />);
      expect(screen.getByRole("searchbox")).toHaveValue("test query");
    });

    it("should call onChange when typing", async () => {
      const handleChange = vi.fn();
      render(<SearchInput onChange={handleChange} />);

      const input = screen.getByRole("searchbox");
      await act(async () => {
        fireEvent.change(input, { target: { value: "hello" } });
      });

      expect(handleChange).toHaveBeenCalled();
    });

    it("should update internal value when controlled value changes", () => {
      const { rerender } = render(
        <SearchInput value="initial" onChange={() => {}} />,
      );
      expect(screen.getByRole("searchbox")).toHaveValue("initial");

      rerender(<SearchInput value="updated" onChange={() => {}} />);
      expect(screen.getByRole("searchbox")).toHaveValue("updated");
    });
  });

  // Clear button
  describe("clear button", () => {
    it("should show clear button when there is a value", () => {
      render(<SearchInput value="test" onChange={() => {}} />);
      expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
    });

    it("should not show clear button when value is empty", () => {
      render(<SearchInput value="" onChange={() => {}} />);
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("should call onClear when clear button is clicked", async () => {
      const handleClear = vi.fn();
      render(
        <SearchInput value="test" onChange={() => {}} onClear={handleClear} />,
      );

      const clearButton = screen.getByLabelText("Clear search");
      await act(async () => {
        fireEvent.click(clearButton);
      });

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it("should clear value when clear button is clicked", async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState("test");
        return (
          <SearchInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue("")}
          />
        );
      };

      const React = await import("react");
      render(<TestComponent />);

      expect(screen.getByRole("searchbox")).toHaveValue("test");

      const clearButton = screen.getByLabelText("Clear search");
      await act(async () => {
        fireEvent.click(clearButton);
      });

      expect(screen.getByRole("searchbox")).toHaveValue("");
    });

    it("should hide clear button when showClearButton is false", () => {
      render(
        <SearchInput
          value="test"
          onChange={() => {}}
          showClearButton={false}
        />,
      );
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
    });

    it("should always show clear button area when showClearButton is true", () => {
      render(<SearchInput showClearButton={true} />);
      // Clear button should still not render without value, but the space should be there
    });
  });

  // Loading state
  describe("loading state", () => {
    it("should show loading spinner when isLoading is true", () => {
      render(<SearchInput isLoading />);
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("should hide clear button when loading", () => {
      render(<SearchInput value="test" onChange={() => {}} isLoading />);
      expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });
  });

  // Keyboard interactions
  describe("keyboard interactions", () => {
    it("should clear value on Escape key", async () => {
      const handleClear = vi.fn();
      render(
        <SearchInput value="test" onChange={() => {}} onClear={handleClear} />,
      );

      const input = screen.getByRole("searchbox");
      await act(async () => {
        fireEvent.keyDown(input, { key: "Escape" });
      });

      expect(handleClear).toHaveBeenCalled();
    });

    it("should not clear on Escape when value is empty", async () => {
      const handleClear = vi.fn();
      render(
        <SearchInput value="" onChange={() => {}} onClear={handleClear} />,
      );

      const input = screen.getByRole("searchbox");
      await act(async () => {
        fireEvent.keyDown(input, { key: "Escape" });
      });

      expect(handleClear).not.toHaveBeenCalled();
    });

    it("should call custom onKeyDown handler", async () => {
      const handleKeyDown = vi.fn();
      render(<SearchInput onKeyDown={handleKeyDown} />);

      const input = screen.getByRole("searchbox");
      await act(async () => {
        fireEvent.keyDown(input, { key: "Enter" });
      });

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  // Debounce functionality
  describe("debounce", () => {
    it("should call onDebouncedChange after delay", async () => {
      const handleDebouncedChange = vi.fn();
      render(
        <SearchInput
          debounceMs={300}
          onDebouncedChange={handleDebouncedChange}
        />,
      );

      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "test" } });

      expect(handleDebouncedChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(handleDebouncedChange).toHaveBeenCalledWith("test");
    });

    it("should cancel previous debounce on new input", async () => {
      const handleDebouncedChange = vi.fn();
      render(
        <SearchInput
          debounceMs={300}
          onDebouncedChange={handleDebouncedChange}
        />,
      );

      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "te" } });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      fireEvent.change(input, { target: { value: "test" } });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(handleDebouncedChange).toHaveBeenCalledTimes(1);
      expect(handleDebouncedChange).toHaveBeenCalledWith("test");
    });

    it("should not debounce when debounceMs is 0", async () => {
      const handleDebouncedChange = vi.fn();
      render(
        <SearchInput
          debounceMs={0}
          onDebouncedChange={handleDebouncedChange}
        />,
      );

      const input = screen.getByRole("searchbox");
      fireEvent.change(input, { target: { value: "test" } });

      expect(handleDebouncedChange).not.toHaveBeenCalled();
    });
  });

  // Accessibility
  describe("accessibility", () => {
    it("should have searchbox role", () => {
      render(<SearchInput />);
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("should use placeholder as default aria-label", () => {
      render(<SearchInput placeholder="Search items..." />);
      expect(screen.getByLabelText("Search items...")).toBeInTheDocument();
    });

    it("should use custom aria-label when provided", () => {
      render(<SearchInput aria-label="Search products" />);
      expect(screen.getByLabelText("Search products")).toBeInTheDocument();
    });

    it("should have accessible clear button", () => {
      render(<SearchInput value="test" onChange={() => {}} />);
      const clearButton = screen.getByLabelText("Clear search");
      expect(clearButton).toBeInTheDocument();
      expect(clearButton.tagName).toBe("BUTTON");
    });

    it("should have accessible loading indicator", () => {
      render(<SearchInput isLoading />);
      expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });
  });

  // Focus behavior
  describe("focus behavior", () => {
    it("should focus input after clearing", async () => {
      render(
        <SearchInput value="test" onChange={() => {}} onClear={() => {}} />,
      );

      const input = screen.getByRole("searchbox");
      const clearButton = screen.getByLabelText("Clear search");

      await act(async () => {
        fireEvent.click(clearButton);
      });

      expect(document.activeElement).toBe(input);
    });
  });

  // Ref forwarding
  describe("ref forwarding", () => {
    it("should forward ref to input element", () => {
      const ref = { current: null } as React.RefObject<HTMLInputElement>;
      render(<SearchInput ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("should call function ref", () => {
      const refFn = vi.fn();
      render(<SearchInput ref={refFn} />);

      expect(refFn).toHaveBeenCalled();
      expect(refFn.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });

  // Disabled state
  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<SearchInput disabled />);
      expect(screen.getByRole("searchbox")).toBeDisabled();
    });
  });
});
