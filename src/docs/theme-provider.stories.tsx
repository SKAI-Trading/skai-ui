import type { Meta, StoryObj } from "@storybook/react";
import {
  ThemeProvider,
  useTheme,
  ThemeToggle,
} from "../components/utility/theme-provider";
import { Button } from "../components/core/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/core/card";
import { Sun, Moon, Monitor } from "lucide-react";

const meta: Meta<typeof ThemeProvider> = {
  title: "Utility/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Theme provider component that handles dark/light/system theme switching with persistence. Wrap your app with this provider to enable theming.",
      },
    },
  },
  argTypes: {
    defaultTheme: {
      control: "radio",
      options: ["dark", "light", "system"],
    },
    enableSystem: {
      control: "boolean",
    },
    disableTransitionOnChange: {
      control: "boolean",
    },
    attribute: {
      control: "radio",
      options: ["class", "data-theme"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

const ThemeDemo = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Current theme: <span className="font-mono">{theme}</span>
            {theme === "system" && ` (resolved: ${resolvedTheme})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              System
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Theme preference is persisted to localStorage.</p>
            <p>System theme follows your OS preference.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded border bg-background p-4">
              <p className="font-medium">Background</p>
              <p className="text-sm text-muted-foreground">bg-background</p>
            </div>
            <div className="rounded bg-primary p-4 text-primary-foreground">
              <p className="font-medium">Primary</p>
              <p className="text-sm opacity-80">bg-primary</p>
            </div>
            <div className="rounded bg-secondary p-4 text-secondary-foreground">
              <p className="font-medium">Secondary</p>
              <p className="text-sm opacity-80">bg-secondary</p>
            </div>
            <div className="rounded bg-muted p-4 text-muted-foreground">
              <p className="font-medium">Muted</p>
              <p className="text-sm">bg-muted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system">
      <ThemeDemo />
    </ThemeProvider>
  ),
};

export const DarkDefault: Story = {
  name: "Dark Mode Default",
  render: () => (
    <ThemeProvider defaultTheme="dark">
      <ThemeDemo />
    </ThemeProvider>
  ),
};

export const LightDefault: Story = {
  name: "Light Mode Default",
  render: () => (
    <ThemeProvider defaultTheme="light">
      <ThemeDemo />
    </ThemeProvider>
  ),
};

export const WithThemeToggle: Story = {
  name: "With ThemeToggle Component",
  render: () => (
    <ThemeProvider defaultTheme="system">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Settings</h3>
          <ThemeToggle />
        </div>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              The ThemeToggle component provides a dropdown menu for theme selection. It
              automatically integrates with the ThemeProvider context.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  ),
};

export const ForcedTheme: Story = {
  name: "Forced Theme (Dark)",
  render: () => (
    <ThemeProvider forcedTheme="dark">
      <div className="space-y-4 bg-background p-4 text-foreground">
        <Card>
          <CardHeader>
            <CardTitle>Forced Dark Theme</CardTitle>
            <CardDescription>
              User preference is ignored. Theme is always dark.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use forcedTheme prop when you need to lock a specific section or page to a
              particular theme, regardless of user preference.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  ),
};

export const NoSystemTheme: Story = {
  name: "System Theme Disabled",
  render: () => (
    <ThemeProvider defaultTheme="dark" enableSystem={false}>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>System Theme Disabled</CardTitle>
            <CardDescription>Only light and dark themes are available.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set enableSystem=false to remove the "system" theme option. Useful when
              you want users to explicitly choose light or dark.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  ),
};

export const CustomStorageKey: Story = {
  name: "Custom Storage Key",
  render: () => (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Custom Storage Key</CardTitle>
            <CardDescription>
              Theme preference stored under "my-app-theme"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use a custom storageKey to avoid conflicts with other apps using
              ThemeProvider on the same domain.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  ),
};

export const TradingAppExample: Story = {
  name: "Trading App Example",
  render: () => (
    <ThemeProvider defaultTheme="dark">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">SKAI Trading</h1>
            <p className="text-sm text-muted-foreground">Your DeFi Hub</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,345.67</p>
              <p className="text-sm text-green-500">+$234.56 (1.9%)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$5,678.90</p>
              <p className="text-sm text-muted-foreground">12 trades</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              SKAI Trading defaults to dark mode for optimal trading experience. Users
              can switch to light mode using the theme toggle.
            </p>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  ),
};
