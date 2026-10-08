/**
 * Every @skai/ui text field is at least 16px below md and draws the frames'
 * 14px from md up when its caller names no size (Casey 2026-10-08 Q29).
 *
 * iOS Safari zooms the page into a focused field whose text is under 16px
 * (bug 95b2113a, the Plinko bet input), and zoom is never locked, so the size
 * has to be on the field. A caller's own size still holds from md up (#105);
 * a caller that sets its own `max-md:` size is choosing the zoom and keeps it.
 *
 * jsdom applies no stylesheet, so each case compiles the class lists on the
 * field and its ancestors through this package's preset, the way the app,
 * launch and the wallet build them, and resolves the field's font-size at a
 * width: rules whose media applies, the later one winning, and inheritance
 * from the parent when no rule sets it. A selector or media query it does not
 * model throws instead of guessing.
 */
import * as React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import { Input, SkaiInput } from "../components/core/input";
import { Textarea } from "../components/core/textarea";
import { PasswordInput } from "../components/forms/password-input";
import { NumberInput } from "../components/forms/number-input";
import { CurrencyInput } from "../components/forms/currency-input";
import { SearchInput } from "../components/forms/search-input";
import { DatePicker } from "../components/forms/date-picker";
import { TagInput } from "../components/forms/tag-input";
import { Command, CommandInput } from "../components/overlays/command";
import { AuthModal } from "../components/overlays/auth-modal";
import { XShareModal } from "../components/overlays/x-share-modal";
import { AmountInput } from "../components/trading/amount-input";

afterEach(cleanup);

/** 375 and 767 are below md, 768 is md itself, 1440 a desktop. */
const WIDTHS = [375, 767, 768, 1440] as const;

type SizeRule = { selectors: string[]; px: number; important: boolean; media?: string };

function lengthPx(value: string): number {
  const m = /^(\d*\.?\d+)(px|rem)$/.exec(value.trim());
  if (!m) throw new Error(`font-size "${value}" is not modelled`);
  return Number(m[1]) * (m[2] === "rem" ? 16 : 1);
}

function mediaApplies(params: string | undefined, width: number): boolean {
  if (params === undefined) return true;
  const m = /^(not all and )?\(min-width:\s*(\d+)px\)$/.exec(params.trim());
  if (!m) throw new Error(`@media ${params} is not modelled`);
  const atLeast = width >= Number(m[2]);
  return m[1] ? !atLeast : atLeast;
}

/** Every class on `el` and its ancestors, compiled through the preset; the font-size rules in source order. */
async function sizeRules(el: Element): Promise<SizeRule[]> {
  const classes: string[] = [];
  for (let e: Element | null = el; e; e = e.parentElement) classes.push(e.getAttribute("class") ?? "");
  const config = {
    presets: [skaiPreset],
    content: [{ raw: classes.join(" "), extension: "html" }],
    corePlugins: { preflight: false },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  const rules: SizeRule[] = [];
  postcss.parse(css).walkDecls("font-size", (decl) => {
    const rule = decl.parent as postcss.Rule;
    const outer = rule.parent as postcss.AtRule | postcss.Root;
    let media: string | undefined;
    if (outer.type === "atrule") {
      if (outer.name !== "media" || outer.parent?.type !== "root") throw new Error(`@${outer.name} ${outer.params} is not modelled`);
      media = outer.params;
    }
    // A pseudo-element rule (placeholder:, file:) sizes a part, not the field's text.
    const selectors = rule.selectors.filter((s) => !s.includes("::"));
    for (const s of selectors) {
      if (!/^\.(?:\\.|[\w-])+$/.test(s)) throw new Error(`selector "${s}" is not modelled`);
    }
    rules.push({ selectors, px: lengthPx(decl.value), important: decl.important, media });
  });
  return rules;
}

/** Every rule here is one class, so an important one wins, then the later one. */
function fontSizeAt(el: Element | null, rules: SizeRule[], width: number): number {
  if (!el) return 16;
  let best: SizeRule | undefined;
  for (const rule of rules) {
    if (!mediaApplies(rule.media, width) || !rule.selectors.some((s) => el.matches(s))) continue;
    if (!best || rule.important || !best.important) best = rule;
  }
  return best ? best.px : fontSizeAt(el.parentElement, rules, width);
}

async function sizes(el: Element): Promise<number[]> {
  const rules = await sizeRules(el);
  return WIDTHS.map((w) => fontSizeAt(el, rules, w));
}

const field = () => screen.getByTestId("field");

describe("the @skai/ui text fields on a phone and from md up (Q29)", () => {
  it.each([
    ["Input", () => <Input data-testid="field" />],
    ["Input with a colour and a height but no size", () => <Input data-testid="field" className="h-11 text-white" />],
    ["Textarea", () => <Textarea data-testid="field" />],
    ["PasswordInput", () => <PasswordInput data-testid="field" />],
    ["NumberInput", () => <NumberInput data-testid="field" value={1} onChange={() => {}} />],
    ["CurrencyInput", () => <CurrencyInput data-testid="field" />],
    ["SearchInput", () => <SearchInput data-testid="field" />],
    ["SearchInput sm", () => <SearchInput data-testid="field" size="sm" />],
    ["CommandInput", () => (
      <Command>
        <CommandInput data-testid="field" placeholder="Search" />
      </Command>
    )],
    ["TagInput", () => <TagInput data-testid="field" />],
    ["SkaiInput medium", () => <SkaiInput data-testid="field" skaiSize="medium" />],
    ["SkaiInput small", () => <SkaiInput data-testid="field" skaiSize="small" />],
  ])("draws the %s at 16 below md and 14 from md up", async (_name, make) => {
    render(make());
    expect(await sizes(field())).toEqual([16, 16, 14, 14]);
  });

  it("draws the DatePicker's typed field at 16 below md and 14 from md up", async () => {
    render(<DatePicker allowInput placeholder="Pick a date" />);
    expect(await sizes(screen.getByPlaceholderText("Pick a date"))).toEqual([16, 16, 14, 14]);
  });

  it("lifts a caller's size under 16 to 16 below md and keeps it from md up", async () => {
    const { unmount } = render(<Input data-testid="field" className="text-xs" />);
    expect(await sizes(field())).toEqual([16, 16, 12, 12]);
    unmount();
    // A preset size: Paragraph 2 mobile is 12.
    render(<Textarea data-testid="field" className="text-para-2-mobile" />);
    expect(await sizes(field())).toEqual([16, 16, 12, 12]);
  });

  it("lifts the DatePicker sm field from 12", async () => {
    render(<DatePicker allowInput size="sm" placeholder="Pick a date" />);
    expect(await sizes(screen.getByPlaceholderText("Pick a date"))).toEqual([16, 16, 12, 12]);
  });

  it("leaves a caller's size of 16 or more alone at every width", async () => {
    const { unmount } = render(<Input data-testid="field" className="text-[22px]" />);
    expect(await sizes(field())).toEqual([22, 22, 22, 22]);
    unmount();
    const second = render(<SearchInput data-testid="field" size="lg" />);
    expect(await sizes(field())).toEqual([18, 18, 18, 18]);
    second.unmount();
    render(<SkaiInput data-testid="field" skaiSize="large" />);
    expect(await sizes(field())).toEqual([16, 16, 16, 16]);
  });

  it("lifts an important caller size under 16 too", async () => {
    render(<Input data-testid="field" className="!text-number-4-mobile md:!text-number-4-tablet lg:!text-number-4" />);
    expect(await sizes(field())).toEqual([16, 16, 14, 14]);
  });

  it("keeps 16 below md under a caller's size that starts at md", async () => {
    render(<Input data-testid="field" className="md:text-lg" />);
    expect(await sizes(field())).toEqual([16, 16, 18, 18]);
  });

  it("keeps a caller's own phone size, which is a choice of the zoom", async () => {
    // The Dice bet inputs set 14 with 12 below md themselves.
    render(<Input data-testid="field" className="text-[14px] max-md:text-[12px]" />);
    expect(await sizes(field())).toEqual([12, 12, 14, 14]);
  });

  it("draws the sign-in email and referral fields at 16 below md, 14 at md and Paragraph 1's 16 from lg", async () => {
    // AuthModal's fields are raw inputs in Paragraph 1 (14 / 14 / 16); the
    // app's sign-in flow mounts it.
    render(
      <AuthModal
        mode="signup"
        isOpen
        onClose={() => undefined}
        onEmailSubmit={() => undefined}
        referralCode=""
        onReferralCodeChange={() => undefined}
      />,
    );
    expect(await sizes(screen.getByPlaceholderText("example@provider.com"))).toEqual([16, 16, 14, 16]);
    fireEvent.click(screen.getByRole("button", { name: /referral code/i }));
    expect(await sizes(screen.getByPlaceholderText("Enter referral code"))).toEqual([16, 16, 14, 16]);
  });

  it("draws the X share post editor at 16 below md and its 13 from md up", async () => {
    // skai.trade's dashboard mounts it.
    render(
      <XShareModal
        isOpen
        onClose={() => undefined}
        images={[{ label: "Card", src: "card.png" }]}
        referralLink="https://skai.trade/r/abc"
        shareText="gm"
      />,
    );
    expect(await sizes(screen.getByPlaceholderText("Write your post..."))).toEqual([16, 16, 13, 13]);
  });

  it("draws the chart card's follow-up field at 16 below md and its 14 from md up", async () => {
    // The field shows only after an analysis comes back, so its class list is
    // read off the source and drawn on a bare input.
    const src = readFileSync(resolve(__dirname, "../components/landing/chart-ai-card.tsx"), "utf8").replace(/\r\n/g, "\n");
    const m = /placeholder="Ask a follow-up question\.\.\."[\s\S]*?className="([^"]+)"/.exec(src);
    expect(m, "the follow-up field's class list").not.toBeNull();
    render(<input data-testid="field" className={(m as RegExpExecArray)[1]} />);
    expect(await sizes(field())).toEqual([16, 16, 14, 14]);
  });

  it("keeps AmountInput at the 18 / 14 it has always drawn, with no frame to follow", async () => {
    render(<AmountInput data-testid="field" value="" onChange={() => {}} />);
    expect(await sizes(field())).toEqual([18, 18, 14, 14]);
  });

  it("would read a 14px field as 14 on a phone, so the cases above are not the resolver's default", async () => {
    // A control on the instrument: a raw input with the old `text-sm` and
    // nothing else must come back 14 everywhere, an important size must beat
    // a later plain one, and a field with no size class must take its parent's.
    const { unmount } = render(<input data-testid="field" className="text-sm" />);
    expect(await sizes(field())).toEqual([14, 14, 14, 14]);
    unmount();
    const second = render(<input data-testid="field" className="!text-xs max-md:text-base" />);
    expect(await sizes(field())).toEqual([12, 12, 12, 12]);
    second.unmount();
    render(
      <div className="text-xs">
        <input data-testid="field" />
      </div>,
    );
    expect(await sizes(field())).toEqual([12, 12, 12, 12]);
  });
});
