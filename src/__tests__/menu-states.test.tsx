/**
 * The open-menu states of DropdownMenu and Select against the dropdown frames
 * on 3sSzw1KewMtUbeLAv7uW0r "Governance and Utilities" (all 103 read live
 * 2026-10-05 with use_figma; e.g. 11303:134267 Rewards period, 11314:138124 the
 * vote row menu, 11304:134283 Governance scope) and Trade 2's dropdown-add
 * (mhF3BkzlTaGiLzJ7kvpmVc 13006:252891), which names the bound variables.
 *
 * Panel: radius 12, padding 8, 8 between children, Green Coal 200 fill, 1px
 * Green Coal 100 edge, "Input hint (dark)". Row: radius 4, padding 6 / 8, 8
 * from an icon to its text, Paragraph 2 (12/14, 12/16, 14/18). One filled row,
 * Green Coal 100. No check or dot column; the text starts 8 from the row edge.
 *
 * Which row is filled (Casey 2026-10-06 Q10): in an action menu (Item,
 * SubTrigger) the row under the pointer or the keyboard, as the frames draw
 * it; in a value menu (SelectItem, RadioItem, CheckboxItem) only the current
 * value, and a hovered or focused row that is not it takes a Sky Blue/10 wash,
 * so one row reads as chosen.
 *
 * Everything is read off the rendered DOM, so a class has to reach the element
 * to count.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor, within, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../components/overlays/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "../components/forms/select";
import { menuRowType, menuRowTypeFor } from "../components/overlays/menu-row-type";
import { skaiFontSizes, skaiBorderRadius, skaiShadows } from "../lib/design-tokens";

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

/** Exact class members; a substring test is answered by a prefixed twin. */
function members(el: Element | null): string[] {
  if (!el) throw new Error("element not rendered");
  return (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
}

type Tuple = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];
const px = (rem: string) => parseFloat(rem) * 16;
function typeAt(cls: string[], prefix: "" | "md:" | "lg:") {
  const hit = cls.find((c) => c.startsWith(`${prefix}text-para-`) && !c.slice(prefix.length).includes(":"));
  if (!hit) return null;
  const t = (skaiFontSizes as unknown as Record<string, Tuple>)[hit.slice(prefix.length + 5)];
  return { size: px(t[0]), leading: px(t[1].lineHeight), tracking: t[1].letterSpacing, weight: t[1].fontWeight };
}

/** The frames' type: 375 Sm 12/14, 768 Md 12/16, 1440 Lg 14/18, all -4%, Regular. */
function expectFramesRowType(cls: string[]) {
  expect(typeAt(cls, "")).toEqual({ size: 12, leading: 14, tracking: "-0.04em", weight: "400" });
  expect(typeAt(cls, "md:")).toEqual({ size: 12, leading: 16, tracking: "-0.04em", weight: "400" });
  expect(typeAt(cls, "lg:")).toEqual({ size: 14, leading: 18, tracking: "-0.04em", weight: "400" });
  expect(cls).not.toContain("text-sm");
}

function expectFramesPanel(cls: string[]) {
  expect(cls).toContain("rounded-xl");
  expect(skaiBorderRadius.xl).toBe("12px");
  expect(cls).toEqual(expect.arrayContaining(["border", "border-border", "bg-popover"]));
  expect(cls).toContain("shadow-inputHint");
  expect(skaiShadows.inputHint).toBe("0px 4px 12px rgba(0, 0, 0, 0.24)");
  for (const old of ["rounded-md", "shadow-md", "shadow-lg"]) expect(cls).not.toContain(old);
}

/** The one focus fill a row may carry: the frames' Green Coal 100, or Q10's wash. */
const FOCUS_FILL = { action: "focus:bg-border", value: "focus:bg-sky-blue/10" } as const;

function expectFramesRow(cls: string[], kind: keyof typeof FOCUS_FILL) {
  expect(cls).toContain("rounded");
  expect(cls).toEqual(expect.arrayContaining(["px-2", "py-1.5", "shrink-0"]));
  expect(cls).not.toContain("rounded-sm");
  expect(cls).not.toContain("pl-8");
  // Exactly one focus fill, and never a literal Sky Blue or the app's Alien Green accent.
  expect(cls.filter((c) => /^focus:bg-/.test(c))).toEqual([FOCUS_FILL[kind]]);
  expect(cls.join(" ")).not.toMatch(/56C7F3|bg-accent/);
}

const BACKSLASH = String.fromCharCode(92);

interface BackgroundRule {
  utility: string;
  qualifier: string;
  specificity: number;
  order: number;
  value: string;
}

/** Every background-color rule Tailwind emits, through this preset, for the classes on the page. */
async function backgroundRules(): Promise<BackgroundRule[]> {
  const config = {
    presets: [skaiPreset],
    // The class attributes themselves: outerHTML would escape the `&` in an
    // arbitrary variant.
    content: [{ raw: [...document.querySelectorAll("[class]")].map((el) => el.getAttribute("class")).join(" "), extension: "txt" }],
    corePlugins: { preflight: false },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  const out: BackgroundRule[] = [];
  postcss.parse(css).walkRules((rule) => {
    if (rule.parent?.type !== "root") return;
    rule.walkDecls("background-color", (decl) => {
      for (const selector of rule.selectors) {
        if (!selector.startsWith(".")) continue;
        // Read the escaped class name up to its first unescaped `:` or `[`.
        let utility = "";
        let i = 1;
        for (; i < selector.length; i++) {
          const ch = selector[i];
          if (ch === BACKSLASH) utility += selector[++i];
          else if (ch === ":" || ch === "[" || ch === " " || ch === ">" || ch === ".") break;
          else utility += ch;
        }
        const qualifier = selector.slice(i);
        if (/[\s>+~]|::/.test(qualifier)) continue;
        const specificity = 1 + (qualifier.match(/:|\[/g)?.length ?? 0);
        out.push({ utility, qualifier, specificity, order: out.length, value: decl.value });
      }
    });
  });
  return out;
}

/**
 * The background the cascade gives `row` now: of the rules whose class is on
 * the row and whose state holds (`:focus` is the document's focused element,
 * an attribute is read off the row), the most specific, then the last.
 */
function backgroundOf(row: Element, rules: BackgroundRule[]): string | undefined {
  const holds = (q: string) =>
    q === "" ||
    (q === ":focus" ? document.activeElement === row : !q.includes(":") && row.matches(`*${q}`));
  const hits = rules
    .filter((r) => row.classList.contains(r.utility) && holds(r.qualifier))
    .sort((a, b) => a.specificity - b.specificity || a.order - b.order);
  return hits[hits.length - 1]?.value;
}

/** The two values Q10 asks for, as this preset compiles them. */
const WASH = "rgb(86 199 243 / 0.1)";
const FILL = "hsl(var(--border))";

function openDropdown(children: React.ReactNode, contentClass?: string) {
  render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent data-testid="panel" className={contentClass}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  return screen.getByTestId("panel");
}

describe("DropdownMenu panel", () => {
  it("is the frames' panel: radius 12, edge, shadow, 8 inset and 8 between rows", () => {
    const cls = members(openDropdown(<DropdownMenuItem>Share</DropdownMenuItem>));
    expectFramesPanel(cls);
    expect(cls).toEqual(expect.arrayContaining(["flex", "flex-col", "gap-2", "p-2"]));
    expect(cls).not.toContain("p-1");
  });

  it("a submenu opens on the same panel", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger data-testid="sub-trigger">More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent data-testid="sub-panel">
              <DropdownMenuItem>Inner</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const panel = members(screen.getByTestId("sub-panel"));
    expectFramesPanel(panel);
    expect(panel).toEqual(expect.arrayContaining(["flex", "flex-col", "gap-2", "p-2"]));
    const trigger = members(screen.getByTestId("sub-trigger"));
    expectFramesRow(trigger, "action");
    expectFramesRowType(trigger);
    expect(trigger).toContain("data-[state=open]:bg-border");
  });

  it("a caller's own panel classes still win the merge", () => {
    const cls = members(
      openDropdown(<DropdownMenuItem>Share</DropdownMenuItem>, "p-0 rounded-[8px] border-green-coal-100"),
    );
    expect(cls).toEqual(expect.arrayContaining(["p-0", "rounded-[8px]", "border-green-coal-100"]));
    for (const lost of ["p-2", "rounded-xl", "border-border"]) expect(cls).not.toContain(lost);
  });
});

describe("DropdownMenu rows", () => {
  it("an action row: radius 4, 6 / 8 padding, 8 from icon to text, the frames' type", () => {
    openDropdown(
      <DropdownMenuItem data-testid="row">
        <svg data-testid="icon" className="mr-2 h-4 w-4" />
        Share ticket
      </DropdownMenuItem>,
    );
    const cls = members(screen.getByTestId("row"));
    expectFramesRow(cls, "action");
    expectFramesRowType(cls);
    // The gap is the 8; an icon's own mr-2 is cancelled so it is not 16.
    expect(cls).toEqual(expect.arrayContaining(["gap-2", "[&>svg]:mr-0", "[&>svg]:shrink-0"]));
    expect(members(screen.getByTestId("icon"))).toContain("mr-2");
  });

  it("a row that names its own size keeps it at every width", () => {
    openDropdown(
      <>
        <DropdownMenuItem data-testid="sm" className="text-sm">A</DropdownMenuItem>
        <DropdownMenuItem data-testid="px" className="text-[12px] leading-[14px]">B</DropdownMenuItem>
        <DropdownMenuItem data-testid="colour" className="text-white">C</DropdownMenuItem>
      </>,
    );
    for (const id of ["sm", "px"]) {
      const cls = members(screen.getByTestId(id));
      expect(cls.filter((c) => /^(md:|lg:)?text-para-/.test(c))).toEqual([]);
    }
    expect(members(screen.getByTestId("sm"))).toContain("text-sm");
    // A colour is not a size: the ramp stays beside it.
    const colour = members(screen.getByTestId("colour"));
    expect(colour).toContain("text-white");
    expectFramesRowType(colour);
  });

  it("an asChild row whose child names its own size keeps it at every width", () => {
    // Radix's Slot joins the row's and the child's classes as strings, without
    // tailwind-merge, so the ramp's md: / lg: steps would beat the child's size.
    openDropdown(
      <>
        <DropdownMenuItem asChild>
          <a href="#wallet" data-testid="sized" className="text-sm leading-[18px]">
            Open wallet
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#explorer" data-testid="bare">
            View on Skaiscan
          </a>
        </DropdownMenuItem>
      </>,
    );
    const sized = members(screen.getByTestId("sized"));
    expect(sized).toEqual(expect.arrayContaining(["text-sm", "leading-[18px]"]));
    expect(sized.filter((c) => /^(md:|lg:)?text-para-/.test(c))).toEqual([]);
    // A child with no size of its own still takes the frames' type.
    expectFramesRowType(members(screen.getByTestId("bare")));
  });

  it("disabled stays as it was: dimmed and inert", () => {
    openDropdown(<DropdownMenuItem data-testid="off" disabled>Follow</DropdownMenuItem>);
    const row = screen.getByTestId("off");
    expect(row).toHaveAttribute("data-disabled");
    expect(members(row)).toEqual(
      expect.arrayContaining(["data-[disabled]:pointer-events-none", "data-[disabled]:opacity-50"]),
    );
  });

  it("the separator sits inside the padding, spaced by the panel's own 8", () => {
    openDropdown(
      <>
        <DropdownMenuItem>View on Skaiscan</DropdownMenuItem>
        <DropdownMenuSeparator data-testid="rule" />
        <DropdownMenuItem>Follow</DropdownMenuItem>
      </>,
    );
    const cls = members(screen.getByTestId("rule"));
    expect(cls).toEqual(expect.arrayContaining(["h-px", "shrink-0", "bg-border"]));
    expect(cls.filter((c) => /^-?m[xytb]?-/.test(c))).toEqual([]);
  });

  it("a value menu fills the current value and draws no dot", () => {
    openDropdown(
      <DropdownMenuRadioGroup value="30d" data-testid="group">
        <DropdownMenuRadioItem value="all">All time</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="30d">1 month</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    expect(members(screen.getByTestId("group"))).toEqual(
      expect.arrayContaining(["flex", "flex-col", "gap-2"]),
    );
    const rows = screen.getAllByRole("menuitemradio");
    const current = rows.find((r) => r.textContent === "1 month")!;
    expect(current).toHaveAttribute("data-state", "checked");
    for (const r of rows) {
      const cls = members(r);
      expectFramesRow(cls, "value");
      expectFramesRowType(cls);
      expect(cls).toContain("data-[state=checked]:bg-border");
      expect(r.querySelector("svg")).toBeNull();
    }
  });

  it("a value menu washes the focused row that is not the current value, so one row reads as chosen (Q10)", async () => {
    openDropdown(
      <DropdownMenuRadioGroup value="30d">
        <DropdownMenuRadioItem value="all">All time</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="30d">1 month</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    const other = screen.getByRole("menuitemradio", { name: "All time" });
    const current = screen.getByRole("menuitemradio", { name: "1 month" });
    act(() => other.focus());
    expect(document.activeElement).toBe(other);
    const rules = await backgroundRules();
    expect(backgroundOf(other, rules)).toBe(WASH);
    expect(backgroundOf(current, rules)).toBe(FILL);
    // And the current value stays filled while it has focus itself.
    act(() => current.focus());
    expect(backgroundOf(current, rules)).toBe(FILL);
    expect(backgroundOf(other, rules)).toBeUndefined();
  });

  it("an action menu still fills the focused row the frames' Green Coal 100", async () => {
    openDropdown(
      <>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuItem>Follow</DropdownMenuItem>
      </>,
    );
    const share = screen.getByRole("menuitem", { name: "Share" });
    act(() => share.focus());
    const rules = await backgroundRules();
    expect(backgroundOf(share, rules)).toBe(FILL);
    expect(backgroundOf(screen.getByRole("menuitem", { name: "Follow" }), rules)).toBeUndefined();
  });

  it("keeps an empty first span so a caller's [&>span:first-child]:hidden still misses the label", () => {
    openDropdown(
      <DropdownMenuRadioGroup value="a">
        <DropdownMenuRadioItem value="a" className="[&>span:first-child]:hidden">
          <span>Perps</span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    const row = screen.getByRole("menuitemradio");
    const first = row.firstElementChild!;
    expect(first.tagName).toBe("SPAN");
    expect(first.textContent).toBe("");
    expect(members(first)).toContain("hidden");
    expect(within(row).getByText("Perps")).not.toBe(first);
  });

  it("a group spaces its rows like the panel", () => {
    openDropdown(
      <DropdownMenuGroup data-testid="group">
        <DropdownMenuItem>A</DropdownMenuItem>
        <DropdownMenuItem>B</DropdownMenuItem>
      </DropdownMenuGroup>,
    );
    expect(members(screen.getByTestId("group"))).toEqual(
      expect.arrayContaining(["flex", "flex-col", "gap-2"]),
    );
  });

  it("a checkbox row keeps its check (no frame draws a multi-select)", () => {
    openDropdown(
      <DropdownMenuCheckboxItem checked data-testid="box">
        Show hidden
      </DropdownMenuCheckboxItem>,
    );
    const box = screen.getByTestId("box");
    expect(box.querySelector("svg")).not.toBeNull();
    const cls = members(box);
    expect(cls).toContain("pl-8");
    // A value row: focus takes the wash, and the check, not a fill, marks it (Q10).
    expect(cls.filter((c) => /^focus:bg-/.test(c))).toEqual([FOCUS_FILL.value]);
    expectFramesRowType(cls);
  });
});

function openSelect(contentClass?: string, value = "voted") {
  render(
    <Select defaultValue={value} open>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent data-testid="panel" className={contentClass}>
        <SelectItem value="all">All gauges</SelectItem>
        <SelectItem value="voted">Voted</SelectItem>
        <SelectItem value="off" disabled>
          Epoch #0
        </SelectItem>
      </SelectContent>
    </Select>,
  );
  const panel = screen.getByTestId("panel");
  return { panel, viewport: panel.querySelector("[data-radix-select-viewport]") };
}

/** Padding utilities that land on the element itself (no arbitrary-selector variant). */
const ownPadding = (cls: string[]) =>
  cls.filter((c) => !c.includes("&") && /^(?:[\w-]+:)*!?p[xytrblse]?-/.test(c));

describe("Select panel", () => {
  it("is the frames' panel: 8 of inset on the Viewport, inside the trigger-width minimum, and 8 between rows", () => {
    const { panel, viewport } = openSelect();
    const cls = members(panel);
    expectFramesPanel(cls);
    // Padding on Content would sit outside the Viewport's min-w and widen the
    // panel to the trigger plus 10; inside it the panel stays trigger plus 2.
    expect(ownPadding(cls)).toEqual([]);
    const vp = members(viewport);
    expect(vp).toEqual(
      expect.arrayContaining(["flex", "flex-col", "gap-2", "p-2", "min-w-[var(--radix-select-trigger-width)]"]),
    );
    expect(ownPadding(vp)).toEqual(["p-2"]);
  });

  it("a caller that pads Content keeps today's 4 on the Viewport, so its inset does not move", () => {
    for (const pad of ["p-1", "md:px-2", "!pt-0"]) {
      const { panel, viewport } = openSelect(`${pad} rounded-xl border-green-coal-100 bg-green-coal-200`);
      expect(ownPadding(members(panel))).toEqual([pad]);
      expect(ownPadding(members(viewport))).toEqual(["p-1"]);
      cleanup();
    }
  });

  it("a caller that pads the Viewport by selector gets nothing added on Content (MemberList, TradingGroups)", () => {
    const selector = "[&_[data-radix-select-viewport]]:p-2";
    const { panel, viewport } = openSelect(`w-[200px] ${selector} bg-[#122524]`);
    const cls = members(panel);
    expect(cls).toContain(selector);
    // Only the selector's 8 reaches the rows: no Content padding beside it.
    expect(ownPadding(cls)).toEqual([]);
    expect(ownPadding(members(viewport))).toEqual(["p-2"]);
  });
});

describe("Select rows", () => {
  it("rows have no check column: radius 4, 6 / 8 padding, the frames' type", async () => {
    openSelect();
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);
    for (const o of options) {
      const cls = members(o);
      expectFramesRow(cls, "value");
      expectFramesRowType(cls);
      expect(o.querySelector("svg")).toBeNull();
    }
  });

  it("the current value is filled, not checked", async () => {
    openSelect();
    const current = await screen.findByRole("option", { name: "Voted" });
    expect(current).toHaveAttribute("data-state", "checked");
    expect(current).toHaveAttribute("aria-selected", "true");
    expect(members(current)).toContain("data-[state=checked]:bg-border");
    expect(current.querySelector("svg")).toBeNull();
  });

  it("hovering a row that is not the current value washes it, and only the current value stays filled (Q10)", async () => {
    openSelect();
    const current = await screen.findByRole("option", { name: "Voted" });
    const other = screen.getByRole("option", { name: "All gauges" });
    // Radix moves focus to the row under the pointer, as the keyboard does.
    await userEvent.setup().hover(other);
    expect(document.activeElement).toBe(other);
    const rules = await backgroundRules();
    expect(backgroundOf(other, rules)).toBe(WASH);
    expect(backgroundOf(current, rules)).toBe(FILL);
    expect(WASH).not.toBe(FILL);
    // The current value keeps its fill while it has focus itself.
    act(() => current.focus());
    expect(backgroundOf(current, rules)).toBe(FILL);
    expect(backgroundOf(other, rules)).toBeUndefined();
  });

  it("keeps an empty first span ahead of the label", async () => {
    openSelect();
    const o = await screen.findByRole("option", { name: "All gauges" });
    const first = o.firstElementChild!;
    expect(first.tagName).toBe("SPAN");
    expect(first.textContent).toBe("");
    expect(members(first)).toContain("hidden");
    expect(first.nextElementSibling?.textContent).toBe("All gauges");
  });

  it("disabled stays as it was", async () => {
    openSelect();
    const off = await screen.findByRole("option", { name: "Epoch #0" });
    expect(off).toHaveAttribute("data-disabled");
    expect(members(off)).toContain("data-[disabled]:opacity-50");
  });

  it("a row with its own size keeps it", async () => {
    render(
      <Select defaultValue="a" open>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a" className="text-xs">
            Small
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    const o = await screen.findByRole("option");
    const cls = members(o);
    expect(cls).toContain("text-xs");
    expect(cls.filter((c) => /^(md:|lg:)?text-para-/.test(c))).toEqual([]);
  });

  it("sections: a group spaces like the panel, its label lines up with the rows, the rule has no margin", async () => {
    render(
      <Select defaultValue="a" open>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-testid="group">
            <SelectLabel data-testid="label">Fruits</SelectLabel>
            <SelectItem value="a">Apple</SelectItem>
          </SelectGroup>
          <SelectSeparator data-testid="rule" />
          <SelectItem value="b">Bread</SelectItem>
        </SelectContent>
      </Select>,
    );
    await screen.findAllByRole("option");
    expect(members(screen.getByTestId("group"))).toEqual(
      expect.arrayContaining(["flex", "flex-col", "gap-2"]),
    );
    const label = members(screen.getByTestId("label"));
    expect(label).toContain("px-2");
    expect(label).not.toContain("pl-8");
    const rule = members(screen.getByTestId("rule"));
    expect(rule).toEqual(expect.arrayContaining(["h-px", "shrink-0", "bg-border"]));
    expect(rule.filter((c) => /^-?m[xytb]?-/.test(c))).toEqual([]);
  });

  it("opening by the trigger still selects (no behaviour moved)", async () => {
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Apple</SelectItem>
        </SelectContent>
      </Select>,
    );
    fireEvent.click(screen.getByRole("combobox"));
    await waitFor(() => expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).toHaveBeenCalledWith("a");
  });
});

describe("menuRowType", () => {
  it("gives the ramp to a row with no size of its own, and to one with only a colour", () => {
    for (const c of [undefined, "", "text-white", "text-muted-foreground font-medium"]) {
      expect(menuRowType(c)).toBe("text-para-2-mobile md:text-para-2-tablet lg:text-para-2");
    }
  });

  it("leaves a row that names a size alone", () => {
    for (const c of ["text-sm", "text-xs", "text-[12px]", "text-para-2", "font-manrope text-sm text-white"]) {
      expect(menuRowType(c)).toBeUndefined();
    }
  });

  it("reads an asChild child's size too, and only when the row is asChild", () => {
    const RAMP = "text-para-2-mobile md:text-para-2-tablet lg:text-para-2";
    expect(menuRowTypeFor(undefined, true, <a className="text-sm">x</a>)).toBeUndefined();
    expect(menuRowTypeFor("text-white", true, <a className="text-[12px]">x</a>)).toBeUndefined();
    expect(menuRowTypeFor(undefined, true, <a className="text-white">x</a>)).toBe(RAMP);
    expect(menuRowTypeFor(undefined, true, <a>x</a>)).toBe(RAMP);
    // The row's own size still counts when the child brings only a colour.
    expect(menuRowTypeFor("text-xs", true, <a className="text-white">x</a>)).toBeUndefined();
    // Not asChild: the child's classes stay on the child, so the row keeps the ramp.
    expect(menuRowTypeFor(undefined, false, <a className="text-sm">x</a>)).toBe(RAMP);
    expect(menuRowTypeFor("text-xs", false, "x")).toBeUndefined();
  });
});
