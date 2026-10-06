/**
 * A highlighted dropdown row keeps readable ink in the light theme
 * (report 773f8a9d, "many drop down sections ... become invisible/difficult to
 * see when light mode is activated").
 *
 * Every item primitive used to force `focus:text-white` over a 10% Sky Blue
 * wash. The menu itself is `bg-popover`, which is white in the light theme, so
 * the row under the pointer or the keyboard turned white-on-white.
 *
 * The dropdown frames' rows (wave 76 lane Y5) fill a focused row with
 * `bg-border` and write on it in `text-popover-foreground`, two semantic
 * tokens that move together: white ink on Green Coal 100 in the dark theme,
 * the dark ink on the pale border grey in the light one. That holds on every
 * surface a caller gives the menu, a card or Green Coal included, because the
 * fill under the row comes from the same theme as its ink. So no white focus
 * ink may reach a row in the light theme. The rule is read off the compiled
 * CSS against the rendered rows, the way the browser applies it.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../components/overlays/dropdown-menu";

const ROWS = ["Item", "Checkbox", "Radio", "Sub"];

function renderMenu(contentClassName?: string) {
  render(
    <DropdownMenu open>
      <DropdownMenuTrigger>open</DropdownMenuTrigger>
      <DropdownMenuContent className={contentClassName}>
        <DropdownMenuItem>Item</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Checkbox</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="r">
          <DropdownMenuRadioItem value="r">Radio</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Sub</DropdownMenuSubTrigger>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
}

const rowOf = (name: string) => {
  const row = screen.getByText(name).closest("[role^=menuitem]");
  if (!row) throw new Error(`no row ${name}`);
  return row;
};

interface ColourRule {
  selector: string;
  value: string;
}

/** Every `color` rule Tailwind emits for the markup on the page, through this preset. */
async function colourRules(): Promise<ColourRule[]> {
  const config = {
    presets: [skaiPreset],
    // The class attributes themselves: outerHTML would escape the `&` in an
    // arbitrary variant and hide the very rule this file is about.
    content: [{ raw: [...document.querySelectorAll("[class]")].map((el) => el.getAttribute("class")).join(" "), extension: "txt" }],
    corePlugins: { preflight: false },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  const out: ColourRule[] = [];
  postcss.parse(css).walkRules((rule) => {
    rule.walkDecls("color", (decl) => {
      for (const selector of rule.selectors) out.push({ selector, value: decl.value });
    });
  });
  return out;
}

const BACKSLASH = String.fromCharCode(92);

/**
 * Whether a compiled `:focus` rule reaches `row`. jsdom's selector engine does
 * not read Tailwind's escaped arbitrary-variant class names, so the rule is
 * taken apart: its last compound is the utility (unescaped and looked up on the
 * row), and what comes before it is the context the row must sit inside.
 */
function reaches(row: Element, selector: string): boolean {
  if (!selector.endsWith(":focus")) return false;
  const bare = selector.slice(0, -":focus".length);
  const cut = bare.lastIndexOf(" ");
  const utility = (cut < 0 ? bare : bare.slice(cut + 1)).slice(1).split(BACKSLASH).join("");
  if (!row.classList.contains(utility)) return false;
  return cut < 0 || row.matches(`${bare.slice(0, cut)} *`);
}

/** The colours the browser would consider for `row` while it has focus, in the light theme. */
function focusInks(row: Element, rules: ColourRule[]): string[] {
  document.documentElement.classList.add("light");
  try {
    return rules.filter((r) => reaches(row, r.selector)).map((r) => r.value);
  } finally {
    document.documentElement.classList.remove("light");
  }
}

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
});

describe("dropdown rows under focus in the light theme (773f8a9d)", () => {
  /** A focused row's ink is the popover's, on the border fill, and never white. */
  function expectThemedFocus(name: string, rules: ColourRule[]) {
    const row = rowOf(name);
    const inks = focusInks(row, rules);
    expect(inks.some((v) => v.includes("--popover-foreground")), name).toBe(true);
    expect(inks.filter((v) => /255 255 255|#fff\b|white/i.test(v)), name).toEqual([]);
    expect((row.getAttribute("class") ?? "").split(/\s+/), name).toContain("focus:bg-border");
  }

  it("a menu on the popover surface gives a focused row the popover ink on the border fill", async () => {
    renderMenu();
    const rules = await colourRules();
    for (const name of ROWS) expectThemedFocus(name, rules);
  });

  it("a menu on a card surface does the same", async () => {
    renderMenu("bg-card");
    const rules = await colourRules();
    for (const name of ROWS) expectThemedFocus(name, rules);
  });

  it("a menu that paints itself Green Coal does the same, so no row goes white on the pale fill", async () => {
    renderMenu("border-green-coal-100 bg-green-coal-200 text-white");
    const menu = screen.getByRole("menu");
    expect(menu.className).toContain("bg-green-coal-200");
    expect(menu.className).not.toContain("bg-popover");
    const rules = await colourRules();
    for (const name of ROWS) expectThemedFocus(name, rules);
  });
});
