/**
 * Every @skai/ui text field is at least 16px below md and draws the frames'
 * 14px from md up when its caller names no size (Casey 2026-10-08 Q29).
 *
 * iOS Safari zooms the page into a focused field whose text is under 16px
 * (bug 95b2113a, the Plinko bet input), and zoom is never locked, so the size
 * has to be on the field. A caller's own size still holds from md up (#105);
 * a caller that sets its own `max-md:` size is choosing the zoom and keeps it.
 *
 * jsdom applies no stylesheet, so the cases resolve the field's font-size
 * against a stylesheet compiled the way a consumer's build compiles it: this
 * package's preset over skai-ui's own source (tests left out, as the app
 * leaves them out) and the consumer's file that names the caller's classes,
 * which is this one. Tailwind emits a class only when a scanned file spells it
 * out, so a class a field puts together at runtime is missing here exactly as
 * it is missing from the app's, launch's or skai.trade's CSS. Rules whose
 * media applies win, the later one first, and a field with no rule takes its
 * parent's size. A selector or media query it does not model throws instead
 * of guessing.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import skaiPreset from "../lib/tailwind-preset";
import { FIELD_TEXT_SIZE, Input, SkaiInput } from "../components/core/input";
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

/**
 * `media` holds every @media around the rule, outermost first; all must apply.
 * `around` names any other at-rule around it, which the resolver does not model.
 */
type SizeRule = {
  prop: "font-size" | "line-height";
  value: string;
  selectors: string[];
  important: boolean;
  media: string[];
  around?: string;
};

function lengthPx(value: string): number {
  const m = /^(\d*\.?\d+)(px|rem)$/.exec(value.trim());
  if (!m) throw new Error(`font-size "${value}" is not modelled`);
  return Number(m[1]) * (m[2] === "rem" ? 16 : 1);
}

function mediaApplies(media: string[], width: number): boolean {
  return media.every((params) => {
    const m = /^(not all and )?\(min-width:\s*(\d+)px\)$/.exec(params.trim());
    if (!m) throw new Error(`@media ${params} is not modelled`);
    const atLeast = width >= Number(m[2]);
    return m[1] ? !atLeast : atLeast;
  });
}

/** skai-ui's source as a consumer scans it: every .ts / .tsx under src, tests left out. */
function sourceFiles(dir = resolve(__dirname, "..")): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") out.push(...sourceFiles(path));
    } else if (/\.tsx?$/.test(entry.name) && !/\.(test|spec)\.tsx?$/.test(entry.name)) {
      out.push(path);
    }
  }
  return out;
}

/** This file: the consumer's own source, which is where the callers' classes are written. */
const THIS_FILE = readFileSync(resolve(__dirname, "fieldPhoneSize.test.tsx"), "utf8");

/** The classes FIELD_TEXT_SIZE spells out, one by one. */
const FIELD_CLASSES = [...new Set(Object.values(FIELD_TEXT_SIZE ?? {}).flatMap((c) => c.split(" ")))];

async function compile(content: { raw: string; extension: string }[]): Promise<string> {
  const config = { presets: [skaiPreset], content, corePlugins: { preflight: false } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { css } = await postcss([tailwindcss(config as any)]).process("@tailwind utilities;", { from: undefined });
  return css;
}

/** The font-size and line-height rules of a stylesheet, in source order. */
function sizeRulesOf(css: string): SizeRule[] {
  const rules: SizeRule[] = [];
  postcss.parse(css).walkDecls(/^(font-size|line-height)$/, (decl) => {
    const rule = decl.parent as postcss.Rule;
    if (rule.type !== "rule") return;
    const media: string[] = [];
    let around: string | undefined;
    for (let p = rule.parent; p && p.type !== "root"; p = p.parent) {
      const at = p as postcss.AtRule;
      if (at.type === "atrule" && at.name === "media") media.unshift(at.params);
      else around = `${at.type} ${at.name ?? ""} ${at.params ?? ""}`;
    }
    // A pseudo-element rule (placeholder:, file:) sizes a part, not the field's text.
    const selectors = rule.selectors.filter((s) => !s.includes("::"));
    const prop = decl.prop as SizeRule["prop"];
    rules.push({ prop, value: decl.value.trim(), selectors, important: Boolean(decl.important), media, around });
  });
  return rules;
}

let consumerSheet: Promise<SizeRule[]> | undefined;

/**
 * The size rules a consumer's build has: the preset over skai-ui's source and
 * this file, compiled once. Never the rendered class list, which would compile
 * classes no build ever finds.
 */
function consumerRules(): Promise<SizeRule[]> {
  consumerSheet ??= compile(
    [...sourceFiles(), resolve(__dirname, "fieldPhoneSize.test.tsx")].map((f) => ({
      raw: readFileSync(f, "utf8"),
      extension: "tsx",
    })),
  ).then(sizeRulesOf);
  return consumerSheet;
}

const ONE_CLASS = /^\.(?:\\.|[\w-])+$/;

function reaches(el: Element, selector: string): boolean {
  try {
    return el.matches(selector);
  } catch (e) {
    // Engine-prefixed states (`:-moz-focusring`, `:-webkit-autofill`) jsdom cannot parse.
    if (/:-(moz|webkit|ms)-/.test(selector)) return false;
    throw e;
  }
}

/**
 * Every rule that reaches the field here is one class, so an important one
 * wins, then the later one. A rule that reaches it any other way (a
 * descendant selector, an at-rule other than @media) throws.
 */
function winner(el: Element, rules: SizeRule[], prop: SizeRule["prop"], width: number): SizeRule | undefined {
  let best: SizeRule | undefined;
  for (const rule of rules) {
    if (rule.prop !== prop) continue;
    const hits = rule.selectors.filter((s) => reaches(el, s));
    if (hits.length === 0) continue;
    const unmodelled = hits.find((s) => !ONE_CLASS.test(s));
    if (unmodelled) throw new Error(`selector "${unmodelled}" reaches the field and is not modelled`);
    if (rule.around) throw new Error(`${rule.around} around a size on the field is not modelled`);
    if (!mediaApplies(rule.media, width)) continue;
    if (!best || rule.important || !best.important) best = rule;
  }
  return best;
}

function fontSizeAt(el: Element | null, rules: SizeRule[], width: number): number {
  if (!el) return 16;
  const best = winner(el, rules, "font-size", width);
  return best ? lengthPx(best.value) : fontSizeAt(el.parentElement, rules, width);
}

/** The line height a rule on the field itself sets, as written ("normal" when none does). */
async function leadings(el: Element): Promise<string[]> {
  const rules = await consumerRules();
  return WIDTHS.map((w) => winner(el, rules, "line-height", w)?.value ?? "normal");
}

async function sizes(el: Element): Promise<number[]> {
  const rules = await consumerRules();
  return WIDTHS.map((w) => fontSizeAt(el, rules, w));
}

const field = () => screen.getByTestId("field");

// The sheet scans 370-odd files; build it once, before the first case.
beforeAll(() => consumerRules(), 120_000);

describe("the classes a field adds are in every consumer's stylesheet", () => {
  it("spells every class fieldTextSize can return in the code of its own module", async () => {
    // A build that scans field-text-size.ts and nothing else of skai-ui (the
    // standalone wallet's) has all of them, and comments are not what put
    // them there.
    const src = readFileSync(resolve(__dirname, "../components/core/field-text-size.ts"), "utf8");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    const selectorsOf = async (raw: string) => {
      const selectors = new Set<string>();
      postcss.parse(await compile([{ raw, extension: "ts" }])).walkRules((r) => {
        // The preset's keyframes are in every build, whatever it scans.
        if ((r.parent as postcss.AtRule | undefined)?.name?.endsWith("keyframes")) return;
        r.selectors.forEach((s) => selectors.add(s));
      });
      return [...selectors].sort();
    };
    const expected = FIELD_CLASSES.map((c) => "." + c.replace(/[^a-zA-Z0-9_-]/g, (m) => `\\${m}`)).sort();
    expect(FIELD_CLASSES.length).toBeGreaterThanOrEqual(6);
    expect(await selectorsOf(code)).toEqual(expected);
    // Its comments name no class either, so that build gains these and
    // nothing else.
    expect(await selectorsOf(src)).toEqual(expected);
  });

  it("does not spell the phone 16 in this file, so this file cannot be what puts it in the sheet", () => {
    for (const c of FIELD_CLASSES.filter((c) => c.startsWith("max-md:") || c.startsWith("sm:max-md:"))) {
      expect(THIS_FILE.includes(c), c).toBe(false);
    }
  });
});

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

  it("holds 16 up to 767 under a caller's sm: step, which Tailwind writes after max-md:", async () => {
    // The perps TP / SL fields: 12 on 14, 14 on 16 from sm, 14 from md.
    render(
      <Input
        data-testid="field"
        className="text-[12px] leading-[14px] sm:text-[14px] sm:leading-[16px] md:text-[14px] md:leading-[16px]"
      />,
    );
    expect(await sizes(field())).toEqual([16, 16, 14, 14]);
    // The 16 keeps the caller's own line height in each band.
    expect(await leadings(field())).toEqual(["14px", "16px", "16px", "16px"]);
  });

  it("keeps the line height a preset size carries under the phone 16", async () => {
    // The Earn referral link field: Paragraph 1 mobile, 14 on a 16 line.
    render(<Input data-testid="field" className="h-auto p-0 text-para-1-mobile md:text-para-1-tablet md:leading-[18px]" />);
    expect(await sizes(field())).toEqual([16, 16, 14, 14]);
    expect(await leadings(field())).toEqual(["1rem", "1rem", "18px", "18px"]);
  });

  it("keeps a caller's line height under the phone 16, from a leading or the size's own", async () => {
    // The feed composer's body: 14/18 to 1023, 18/24 from lg.
    render(<Textarea data-testid="field" className="text-sm/[18px] md:text-sm/[18px] lg:text-lg/[24px]" />);
    expect(await sizes(field())).toEqual([16, 16, 14, 18]);
    expect(await leadings(field())).toEqual(["18px", "18px", "18px", "24px"]);
  });

  it("keeps any line height a caller names under the phone 16, not only ones a table could list", async () => {
    render(<Textarea data-testid="field" className="text-[13px] leading-[17px]" />);
    expect(await sizes(field())).toEqual([16, 16, 13, 13]);
    expect(await leadings(field())).toEqual(["17px", "17px", "17px", "17px"]);
  });

  it("brings no line height of its own when the caller's size names none", async () => {
    // The field keeps the line height it inherits, as it did at 14.
    render(<Input data-testid="field" className="text-[12px]" />);
    expect(await sizes(field())).toEqual([16, 16, 12, 12]);
    expect(await leadings(field())).toEqual(["normal", "normal", "normal", "normal"]);
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
    // On its own 18 line at every width, so the three-row box keeps its height.
    expect(await leadings(screen.getByPlaceholderText("Write your post..."))).toEqual(["18px", "18px", "18px", "18px"]);
  });

  it("draws the chart card's follow-up field at 16 below md and its 14 from md up", async () => {
    // The field shows only after an analysis comes back, so its class list is
    // read off the source and drawn on a bare input.
    const src = readFileSync(resolve(__dirname, "../components/landing/chart-ai-card.tsx"), "utf8").replace(/\r\n/g, "\n");
    const m = /placeholder="Ask a follow-up question\.\.\."[\s\S]*?className="([^"]+)"/.exec(src);
    expect(m, "the follow-up field's class list").not.toBeNull();
    render(<input data-testid="field" className={(m as RegExpExecArray)[1]} />);
    expect(await sizes(field())).toEqual([16, 16, 14, 14]);
    expect(await leadings(field())).toEqual(["18px", "18px", "18px", "18px"]);
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
