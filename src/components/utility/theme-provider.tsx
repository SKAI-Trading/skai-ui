"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "skai-ui-theme";

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme */
  defaultTheme?: Theme;
  /** Storage key for persistence */
  storageKey?: string;
  /** Force a specific theme (ignores user preference) */
  forcedTheme?: "dark" | "light";
  /** Enable system theme detection */
  enableSystem?: boolean;
  /** Disable transitions on theme change */
  disableTransitionOnChange?: boolean;
  /** Attribute to set on document element */
  attribute?: "class" | "data-theme";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
  forcedTheme,
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (forcedTheme) return forcedTheme;
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">(
    () => {
      if (forcedTheme) return forcedTheme;
      if (theme === "system") return getSystemTheme();
      return theme;
    },
  );

  // Handle system theme changes
  React.useEffect(() => {
    if (!enableSystem || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, enableSystem]);

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    const actualTheme = forcedTheme || resolvedTheme;

    // Disable transitions temporarily if requested
    if (disableTransitionOnChange) {
      root.style.setProperty("transition", "none");
    }

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(actualTheme);
    } else {
      root.setAttribute("data-theme", actualTheme);
    }

    // Re-enable transitions
    if (disableTransitionOnChange) {
      // Force reflow
      void root.offsetHeight;
      root.style.removeProperty("transition");
    }
  }, [resolvedTheme, forcedTheme, disableTransitionOnChange, attribute]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      if (forcedTheme) return;

      setThemeState(newTheme);
      localStorage.setItem(storageKey, newTheme);

      if (newTheme === "system") {
        setResolvedTheme(getSystemTheme());
      } else {
        setResolvedTheme(newTheme);
      }
    },
    [forcedTheme, storageKey],
  );

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Theme toggle component
import { Moon, Sun, Monitor } from "lucide-react";
import { Button, type ButtonProps } from "../core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../overlays/dropdown-menu";

export interface ThemeToggleProps extends Omit<ButtonProps, "onClick"> {
  /** Show dropdown menu or just toggle */
  mode?: "toggle" | "dropdown";
}

export function ThemeToggle({
  mode = "dropdown",
  variant = "ghost",
  size = "icon",
  ...props
}: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();

  if (mode === "toggle") {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        {...props}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} {...props}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
