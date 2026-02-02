import type { Meta, StoryObj } from "@storybook/react";
import {
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from "../components/utility/theme-provider";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";

const meta: Meta<typeof ThemeToggle> = {
  title: "Theme/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Theme toggle dropdown with light/dark/system options. Use with ThemeProvider.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithThemeDisplay: Story = {
  render: function Render() {
    const ThemeDisplay = () => {
      const { theme, resolvedTheme } = useTheme();
      return (
        <div className="flex flex-col items-center gap-4">
          <ThemeToggle />
          <div className="text-sm text-muted-foreground">
            Theme: <span className="font-medium text-foreground">{theme}</span>
            {theme === "system" && <> (resolved: {resolvedTheme})</>}
          </div>
        </div>
      );
    };

    return <ThemeDisplay />;
  },
};

export const InCard: Story = {
  render: function Render() {
    return (
      <Card className="w-[350px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Settings</CardTitle>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the theme toggle to switch between light, dark, and system
            themes.
          </p>
        </CardContent>
      </Card>
    );
  },
};

export const ProgrammaticControl: Story = {
  render: function Render() {
    const ThemeButtons = () => {
      const { setTheme, theme } = useTheme();
      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              System
            </Button>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Current theme: {theme}
          </p>
        </div>
      );
    };

    return <ThemeButtons />;
  },
  parameters: {
    docs: {
      description: {
        story: "Use the useTheme hook for programmatic theme control.",
      },
    },
  },
};
