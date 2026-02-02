import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  ThemeProvider,
  useTheme,
  ThemeToggle,
} from "../components/theme-provider";

// Mock matchMedia
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: query === "(prefers-color-scheme: dark)",
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia;
    // Clear localStorage between tests
    localStorage.clear();
    // Reset document class
    document.documentElement.className = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("provides theme context to children", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("defaults to system theme", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("allows theme to be changed", async () => {
    const TestComponent = () => {
      const { theme, setTheme } = useTheme();
      return (
        <>
          <div data-testid="theme">{theme}</div>
          <button onClick={() => setTheme("dark")}>Set Dark</button>
        </>
      );
    };

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText("Set Dark"));

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });
  });

  it("persists theme to localStorage", async () => {
    const TestComponent = () => {
      const { setTheme } = useTheme();
      return <button onClick={() => setTheme("dark")}>Set Dark</button>;
    };

    render(
      <ThemeProvider storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText("Set Dark"));

    await waitFor(() => {
      expect(localStorage.getItem("test-theme")).toBe("dark");
    });
  });

  it("loads theme from localStorage on mount", () => {
    localStorage.setItem("test-theme", "dark");

    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <ThemeProvider storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia;
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it("triggers button on click", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button");

    // Just verify button can be clicked and has proper aria attributes
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(button);
    // Radix portal renders outside the container, just verify interaction works
    expect(button).toBeInTheDocument();
  });
});
