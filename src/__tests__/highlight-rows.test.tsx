/**
 * Report 6fb5fa86: "the hover box highlight colour is not consistent, some do
 * green and some do blue". The Button variants and the app's own boxes moved
 * to the Sky Blue hover; three skai-ui rows still lit the app's `accent`, which
 * is Alien Green (#17F9B4 dark, a deep green in light):
 *
 * - CommandItem, the row cmdk highlights under the pointer or the arrow keys
 *   (the app's Cmd+K palette, offer's and launch's search);
 * - the ContextMenu rows (the right-click menus in messages and chats);
 * - the outline Toggle (the replay's Pair and Format pickers).
 *
 * A menu row follows the dropdown frames, as DropdownMenu does: the action row
 * under the pointer or the keyboard is Green Coal 100 (`bg-border`), the fill
 * Social's "dropdown - right click" (3sSzw1KewMtUbeLAv7uW0r 10216:182394)
 * draws on its pointer row; a value row that is not chosen washes Sky Blue/10
 * and the current value is filled (Casey 2026-10-06 Q10). The palette has no
 * frame and is an action list, so its row is an action row. An outline Toggle
 * is the outline Button's shape and takes its wash. Green stays where it means
 * chosen: a pressed Toggle keeps its fill, under the pointer too.
 *
 * Read off the compiled CSS against the rendered rows, so a class has to reach
 * the element and win the cascade to count.
 */
import * as React from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/overlays/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../components/overlays/context-menu";
import { Toggle } from "../components/forms/toggle";
import { ToggleGroup, ToggleGroupItem } from "../components/forms/toggle-group";

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.releasePointerCapture = vi.fn();
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(cleanup);

const FILL = "hsl(var(--border))";
const WASH = "rgb(86 199 243 / 0.1)";
const INK = "hsl(var(--popover-foreground))";

const BACKSLASH = String.fromCharCode(92);

interface Rule {
  prop: "background-color" | "color";
  utility: string;
  qualifier: string;
  specificity: number;
  order: number;
  value: string;
}

/** Every background and text colour rule Tailwind emits, through this preset, for the classes on the page. */
async function compiledRules(): Promise<Rule[]> {
  const config = {
    presets: [skaiPreset],
    // The class attributes themselves: outerHTML would escape the `&` in an
    // arbitrary variant.
    content: [{ raw: [...document.querySelectorAll("[class]")].map((el) => el.getAttribute("class")).join(" "), extension: "txt" }],
    corePlugins: { preflight: false },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  const out: Rule[] = [];
  postcss.parse(css).walkRules((rule) => {
    if (rule.parent?.type !== "root") return;
    rule.walkDecls(/^(background-color|color)$/, (decl) => {
      for (const selector of rule.selectors) {
        if (!selector.startsWith(".")) continue;
        let utility = "";
        let i = 1;
        for (; i < selector.length; i++) {
          const ch = selector[i];
          if (ch === BACKSLASH) utility += selector[++i];
          else if (ch === ":" || ch === "[" || ch === " " || ch === ">" || ch === ".") break;
          else utility += ch;
        }
        const qualifier = selector.slice(i);
        // A rule about some other element (group-*, peer-*, a child) is not this row's.
        if (/[\s>+~]|::/.test(qualifier)) continue;
        const specificity = 1 + (qualifier.match(/:|\[/g)?.length ?? 0);
        out.push({ prop: decl.prop as Rule["prop"], utility, qualifier, specificity, order: out.length, value: decl.value });
      }
    });
  });
  return out;
}

/**
 * The value the cascade gives `el` for `prop`: of the rules whose class is on
 * the element and whose state holds (`:focus` is the focused element, `:hover`
 * is what the caller says, an attribute is read off the element, any other
 * pseudo-class is taken as not holding), the most specific, then the last.
 */
function cascade(el: Element, rules: Rule[], prop: Rule["prop"], hovered = false): string | undefined {
  const holds = (q: string) => {
    let rest = q;
    for (const pseudo of q.match(/:[\w-]+/g) ?? []) {
      if (pseudo === ":hover" && !hovered) return false;
      if (pseudo === ":focus" && document.activeElement !== el) return false;
      if (pseudo !== ":hover" && pseudo !== ":focus") return false;
      rest = rest.replace(pseudo, "");
    }
    return rest === "" || el.matches(`*${rest}`);
  };
  const hits = rules
    .filter((r) => r.prop === prop && el.classList.contains(r.utility) && holds(r.qualifier))
    .sort((a, b) => a.specificity - b.specificity || a.order - b.order);
  return hits[hits.length - 1]?.value;
}

const greenAccent = (el: Element) =>
  (el.getAttribute("class") ?? "").split(/\s+/).filter((c) => /(^|:)(bg|text)-accent(-foreground)?$/.test(c));

describe("CommandItem: the row cmdk highlights", () => {
  function renderPalette() {
    render(
      <Command data-testid="palette">
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandGroup heading="Pages">
            <CommandItem>Home</CommandItem>
            <CommandItem>Trade</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    return { home: screen.getByRole("option", { name: "Home" }), trade: screen.getByRole("option", { name: "Trade" }) };
  }

  it("fills the highlighted row Green Coal 100 under the popover ink, not the Alien Green accent", async () => {
    const { home, trade } = renderPalette();
    expect(home).toHaveAttribute("data-selected", "true");
    const rules = await compiledRules();
    expect(cascade(home, rules, "background-color")).toBe(FILL);
    expect(cascade(home, rules, "color")).toBe(INK);
    expect(cascade(trade, rules, "background-color")).toBeUndefined();
    expect(greenAccent(home)).toEqual([]);
  });

  it("the fill follows the arrow keys, so the row Enter will run is the one that shows", async () => {
    const { home, trade } = renderPalette();
    fireEvent.keyDown(screen.getByTestId("palette"), { key: "ArrowDown" });
    expect(trade).toHaveAttribute("data-selected", "true");
    const rules = await compiledRules();
    expect(cascade(trade, rules, "background-color")).toBe(FILL);
    expect(cascade(home, rules, "background-color")).toBeUndefined();
  });

  it("a caller's own highlight still wins the merge", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem className="data-[selected=true]:bg-card">Own</CommandItem>
        </CommandList>
      </Command>,
    );
    const cls = (screen.getByRole("option").getAttribute("class") ?? "").split(/\s+/);
    expect(cls).toContain("data-[selected=true]:bg-card");
    expect(cls).not.toContain("data-[selected=true]:bg-border");
  });
});

describe("ContextMenu rows: the right-click menu frame", () => {
  function openMenu(children: React.ReactNode) {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid="area">Message</ContextMenuTrigger>
        <ContextMenuContent>{children}</ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"));
  }

  it("an action row fills Green Coal 100 under the pointer or the keyboard, and only that row", async () => {
    openMenu(
      <>
        <ContextMenuItem>Open in a new tab</ContextMenuItem>
        <ContextMenuItem>Mark as unread</ContextMenuItem>
      </>,
    );
    const open = screen.getByRole("menuitem", { name: "Open in a new tab" });
    const unread = screen.getByRole("menuitem", { name: "Mark as unread" });
    act(() => open.focus());
    expect(document.activeElement).toBe(open);
    const rules = await compiledRules();
    expect(cascade(open, rules, "background-color")).toBe(FILL);
    expect(cascade(open, rules, "color")).toBe(INK);
    expect(cascade(unread, rules, "background-color")).toBeUndefined();
    for (const row of [open, unread]) expect(greenAccent(row)).toEqual([]);
  });

  it("a red row keeps its own ink when focused", async () => {
    openMenu(<ContextMenuItem className="text-destructive focus:text-destructive">Delete conversation</ContextMenuItem>);
    const row = screen.getByRole("menuitem");
    act(() => row.focus());
    const rules = await compiledRules();
    expect(cascade(row, rules, "color")).toBe("hsl(var(--destructive))");
    expect(cascade(row, rules, "background-color")).toBe(FILL);
  });

  it("a submenu's trigger fills while it is focused or its submenu is open", async () => {
    openMenu(
      <ContextMenuSub open>
        <ContextMenuSubTrigger>React</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem>Like</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>,
    );
    const trigger = screen.getByRole("menuitem", { name: "React" });
    expect(trigger).toHaveAttribute("data-state", "open");
    const rules = await compiledRules();
    expect(cascade(trigger, rules, "background-color")).toBe(FILL);
    act(() => trigger.focus());
    expect(cascade(trigger, rules, "background-color")).toBe(FILL);
    expect(greenAccent(trigger)).toEqual([]);
  });

  it("a value row washes Sky Blue/10 when it is not the current value, and the current value stays filled (Q10)", async () => {
    openMenu(
      <ContextMenuRadioGroup value="newest">
        <ContextMenuRadioItem value="oldest">Oldest first</ContextMenuRadioItem>
        <ContextMenuRadioItem value="newest">Newest first</ContextMenuRadioItem>
      </ContextMenuRadioGroup>,
    );
    const other = screen.getByRole("menuitemradio", { name: "Oldest first" });
    const current = screen.getByRole("menuitemradio", { name: "Newest first" });
    act(() => other.focus());
    const rules = await compiledRules();
    expect(cascade(other, rules, "background-color")).toBe(WASH);
    expect(cascade(other, rules, "color")).toBe(INK);
    expect(cascade(current, rules, "background-color")).toBe(FILL);
    act(() => current.focus());
    expect(cascade(current, rules, "background-color")).toBe(FILL);
    expect(cascade(other, rules, "background-color")).toBeUndefined();
  });

  it("a checkbox row washes Sky Blue/10 when focused, and its check marks it", async () => {
    openMenu(<ContextMenuCheckboxItem checked>Show previews</ContextMenuCheckboxItem>);
    const row = screen.getByRole("menuitemcheckbox");
    act(() => row.focus());
    const rules = await compiledRules();
    expect(cascade(row, rules, "background-color")).toBe(WASH);
    expect(cascade(row, rules, "color")).toBe(INK);
    expect(row.querySelector("svg")).not.toBeNull();
  });
});

describe("Toggle: the outline variant", () => {
  it("washes Sky Blue/10 under the pointer and keeps its label, as the outline Button does", async () => {
    render(<Toggle variant="outline" aria-label="BTC">BTC</Toggle>);
    const btn = screen.getByRole("button");
    const rules = await compiledRules();
    expect(cascade(btn, rules, "background-color", true)).toBe(WASH);
    expect(cascade(btn, rules, "color", true)).toBe("hsl(var(--foreground))");
    expect(cascade(btn, rules, "background-color", false)).toBe("transparent");
  });

  it("a pressed toggle keeps its green under the pointer: it means chosen", async () => {
    render(<Toggle variant="outline" aria-label="BTC" pressed>BTC</Toggle>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("data-state", "on");
    const rules = await compiledRules();
    expect(cascade(btn, rules, "background-color", false)).toBe("hsl(var(--accent))");
    expect(cascade(btn, rules, "background-color", true)).toBe("hsl(var(--accent))");
    expect(cascade(btn, rules, "color", true)).toBe("hsl(var(--accent-foreground))");
  });

  it("a ToggleGroup's outline items do the same", async () => {
    render(
      <ToggleGroup type="single" variant="outline" value="square">
        <ToggleGroupItem value="square">Square</ToggleGroupItem>
        <ToggleGroupItem value="story">Story</ToggleGroupItem>
      </ToggleGroup>,
    );
    const chosen = screen.getByRole("radio", { name: "Square" });
    const other = screen.getByRole("radio", { name: "Story" });
    const rules = await compiledRules();
    expect(cascade(other, rules, "background-color", true)).toBe(WASH);
    expect(cascade(chosen, rules, "background-color", true)).toBe("hsl(var(--accent))");
  });

  it("the default variant keeps its muted hover", async () => {
    render(<Toggle aria-label="B">B</Toggle>);
    const rules = await compiledRules();
    expect(cascade(screen.getByRole("button"), rules, "background-color", true)).toBe("hsl(var(--muted))");
  });
});
