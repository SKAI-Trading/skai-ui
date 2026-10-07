/**
 * A board's menus and dialogs stay dark in a light app.
 *
 * Radix renders every one of these into <body>, outside the board that opened
 * them, so the board's `coal-dark` class cannot reach them through the DOM.
 * Under a CoalDarkScope each content primitive puts the class on its own root
 * instead. Outside a scope nothing is added, so every other menu in the app
 * renders exactly the classes it did before.
 */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import {
  COAL_DARK_CLASS,
  COAL_PROPERTIES,
  CoalDarkScope,
  coalColor,
  useResolvedTheme,
} from "../components/utility/coal-dark";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "../components/feedback/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/feedback/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/forms/select";
import { Drawer, DrawerContent } from "../components/layout/drawer";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../components/overlays/context-menu";
import { Dialog, DialogContent, DialogTitle } from "../components/overlays/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../components/overlays/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/overlays/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "../components/overlays/popover";
import { Sheet, SheetContent, SheetTitle } from "../components/overlays/sheet";

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
});

// Each case renders one open primitive with a marked content root.
const CASES: Array<[string, () => React.ReactElement]> = [
  ["DialogContent", () => (
    <Dialog open>
      <DialogContent data-probe="">
        <DialogTitle>t</DialogTitle>
      </DialogContent>
    </Dialog>
  )],
  ["SheetContent", () => (
    <Sheet open>
      <SheetContent data-probe="">
        <SheetTitle>t</SheetTitle>
      </SheetContent>
    </Sheet>
  )],
  ["AlertDialogContent", () => (
    <AlertDialog open>
      <AlertDialogContent data-probe="">
        <AlertDialogTitle>t</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>
  )],
  ["DrawerContent", () => (
    <Drawer open>
      <DrawerContent data-probe="" aria-describedby={undefined}>
        <DialogTitle>t</DialogTitle>
      </DrawerContent>
    </Drawer>
  )],
  ["PopoverContent", () => (
    <Popover open>
      <PopoverTrigger>open</PopoverTrigger>
      <PopoverContent data-probe="">body</PopoverContent>
    </Popover>
  )],
  ["DropdownMenuContent", () => (
    <DropdownMenu open>
      <DropdownMenuTrigger>open</DropdownMenuTrigger>
      <DropdownMenuContent data-probe="">
        <DropdownMenuItem>row</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )],
  ["DropdownMenuSubContent", () => (
    <DropdownMenu open>
      <DropdownMenuTrigger>open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub open>
          <DropdownMenuSubTrigger>more</DropdownMenuSubTrigger>
          <DropdownMenuSubContent data-probe="">
            <DropdownMenuItem>inner</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )],
  ["SelectContent", () => (
    <Select open value="a">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent data-probe="">
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>
  )],
  ["TooltipContent", () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>tip</TooltipTrigger>
        <TooltipContent data-probe="">hint</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )],
  ["HoverCardContent", () => (
    <HoverCard open>
      <HoverCardTrigger>card</HoverCardTrigger>
      <HoverCardContent data-probe="">body</HoverCardContent>
    </HoverCard>
  )],
];

const probe = () => {
  const el = document.querySelector("[data-probe]");
  if (!el) throw new Error("content did not render");
  return el;
};

describe("portal content keeps a board's dark scope", () => {
  it.each(CASES)("%s takes coal-dark inside a CoalDarkScope", (_name, ui) => {
    render(<CoalDarkScope>{ui()}</CoalDarkScope>);
    expect(probe().classList.contains(COAL_DARK_CLASS)).toBe(true);
  });

  it.each(CASES)("%s adds nothing outside one", (_name, ui) => {
    render(ui());
    expect(probe().classList.contains(COAL_DARK_CLASS)).toBe(false);
  });

  it("reaches the context menu and its submenu", () => {
    const menu = (probeSub: boolean) => (
      <ContextMenu>
        <ContextMenuTrigger>area</ContextMenuTrigger>
        <ContextMenuContent data-probe={probeSub ? undefined : ""}>
          <ContextMenuItem>row</ContextMenuItem>
          <ContextMenuSub open>
            <ContextMenuSubTrigger>more</ContextMenuSubTrigger>
            <ContextMenuSubContent data-probe={probeSub ? "" : undefined}>
              <ContextMenuItem>inner</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    );
    for (const sub of [false, true]) {
      for (const scoped of [true, false]) {
        render(scoped ? <CoalDarkScope>{menu(sub)}</CoalDarkScope> : menu(sub));
        fireEvent.contextMenu(screen.getByText("area"));
        expect(probe().classList.contains(COAL_DARK_CLASS), `sub=${sub} scoped=${scoped}`).toBe(scoped);
        cleanup();
      }
    }
  });
});

describe("coalColor", () => {
  it("reads the role and falls back to the hex's own channels", () => {
    expect(coalColor("base", "#001615")).toBe("rgb(var(--coal-base, 0 22 21))");
    expect(coalColor("line", "#123F3C", 0.5)).toBe("rgb(var(--coal-line, 18 63 60) / 0.5)");
    expect(coalColor("ink-muted", "#95a09f")).toBe("rgb(var(--coal-ink-muted, 149 160 159))");
  });

  it("refuses a colour it cannot convert, rather than painting nothing", () => {
    expect(() => coalColor("base", "#fff")).toThrow(/#rrggbb/);
    expect(() => coalColor("base", "rgb(0,22,21)")).toThrow(/#rrggbb/);
  });
});

describe("useResolvedTheme", () => {
  function Probe() {
    return <span data-testid="theme">{useResolvedTheme()}</span>;
  }

  it("follows the class on <html> as it changes", async () => {
    render(<Probe />);
    expect(screen.getByTestId("theme").textContent).toBe("dark");
    await act(async () => {
      document.documentElement.classList.add("light");
      await Promise.resolve();
    });
    expect(screen.getByTestId("theme").textContent).toBe("light");
    await act(async () => {
      document.documentElement.classList.replace("light", "dark");
      await Promise.resolve();
    });
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("is dark inside a CoalDarkScope whatever the page is", () => {
    document.documentElement.classList.add("light");
    render(
      <>
        <Probe />
        <CoalDarkScope>
          <span data-testid="board">
            <ProbeInline />
          </span>
        </CoalDarkScope>
      </>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("board").textContent).toBe("dark");
  });

  function ProbeInline() {
    return <>{useResolvedTheme()}</>;
  }
});

describe("COAL_PROPERTIES names every property the preset reads", () => {
  it("matches the --coal-* names in the compiled utilities, both ways", async () => {
    const raw = "bg-green-coal-300 bg-green-coal-200 bg-green-coal-100 border-green-coal-100 text-white text-ash bg-white/10 text-sky-blue text-alien-green text-skai-red text-sun-yellow";
    const result = await postcss([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tailwindcss({ presets: [skaiPreset], content: [{ raw, extension: "html" }], corePlugins: { preflight: false } } as any),
    ]).process("@tailwind utilities;", { from: undefined });
    const read = new Set([...result.css.matchAll(/var\((--coal-[a-z-]+),/g)].map((m) => m[1]));
    expect([...read].sort()).toEqual([...COAL_PROPERTIES].sort());
  });
});
