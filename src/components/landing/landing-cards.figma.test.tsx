/**
 * The dashboard's welcome, badge and referral cards and its footer, against the Skai-Web-App
 * (3sSzw1KewMtUbeLAv7uW0r) "Pre-launch dashboard Live" boards read 2026-10-16: 2424:7715 at 375,
 * 2424:4081 at 768 and 2422:2943 at 1440, with the coachmark from 2481:14785 (768) and the
 * footer from 2005:26526 (375), 2424:4081 (768) and 2422:2943 (1440).
 *
 * jsdom paints nothing, so each pin resolves the element's classes through the package's own
 * Tailwind preset at the board width (src/test/tailwindAt.ts) and compares the numbers the board
 * draws: padding, gap, corner, type size, leading and weight.
 */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BadgeCard } from "./badge-card";
import { ReferralCard } from "./referral-card";
import { WelcomeCard } from "./welcome-card";
import { LandingFooter } from "./landing-footer";
import { paintedAt, placedAt, themeColors } from "../../test/tailwindAt";

const classesOf = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/);
const WIDTHS = [375, 768, 1440] as const;
type W = (typeof WIDTHS)[number];
const type = (el: Element, w: W) => {
  const p = paintedAt(el, w);
  return [p.fontSize, p.lineHeight, p.fontWeight];
};
const pad = (el: Element, w: W) => {
  const p = paintedAt(el, w);
  return [p.pt ?? 0, p.pr ?? 0, p.pb ?? 0, p.pl ?? 0];
};

describe("the card surface", () => {
  it("is Green Coal 200 with a Green Coal 100 line drawn inside, and the boards' shadow, on all three cards", () => {
    expect((themeColors["green-coal"] as Record<string, string>)["200"]).toBe("#122524");
    expect((themeColors["green-coal"] as Record<string, string>)["100"]).toBe("#123F3C");
    render(<BadgeCard badgeName="Pioneer badge" badgeSubtitle="Congrats, you're early to Skai." badgePoints={500} data-testid="badge" />);
    render(<ReferralCard referralLink="skai.trade/ref/a" referralPoints={100} shareTweetPoints={0} data-testid="referral" />);
    render(<WelcomeCard username="a" data-testid="welcome" />);
    for (const id of ["badge", "referral", "welcome"]) {
      const c = classesOf(screen.getByTestId(id));
      // The boards' stroke is INSIDE, so it is an inset ring, which adds nothing to the box.
      expect(c, id).toEqual(expect.arrayContaining(["bg-green-coal-200", "ring-1", "ring-inset", "ring-green-coal-100", "shadow-[0_10px_80px_rgba(0,0,0,0.3)]"]));
      expect(c.filter((k) => /^border/.test(k)), id).toEqual([]);
    }
  });
});

describe("BadgeCard", () => {
  const card = () => {
    render(<BadgeCard badgeName="Pioneer badge" badgeSubtitle="Congrats, you're early to Skai." badgePoints={500} data-testid="badge" />);
    return screen.getByTestId("badge");
  };
  const BOARD = {
    375: { pad: [8, 16, 8, 12], radius: 20, rowGap: 12, name: [18, 22, 400], sub: [12, 14, 400], points: [14, 16, 400], pill: [10, 14, 400], pillPad: [2, 8, 2, 8], rewardGap: 4 },
    768: { pad: [16, 16, 16, 16], radius: 18, rowGap: 16, name: [18, 22, 400], sub: [12, 16, 400], points: [16, 20, 400], pill: [10, 14, 400], pillPad: [2, 8, 2, 8], rewardGap: 10 },
    1440: { pad: [32, 32, 32, 16], radius: 24, rowGap: 8, name: [24, 28, 400], sub: [14, 18, 400], points: [22, 26, 400], pill: [11, 14, 400], pillPad: [2, 12, 2, 12], rewardGap: 10 },
  } as const;

  it.each(WIDTHS)("at %i draws the board's card, row and type", (w) => {
    const b = BOARD[w];
    const root = card();
    expect(pad(root, w)).toEqual(b.pad);
    expect(paintedAt(root, w).radius).toBe(b.radius);
    expect(paintedAt(screen.getByTestId("badge-card-row"), w).gap).toBe(b.rowGap);
    expect(type(screen.getByRole("heading", { name: "Pioneer badge" }), w)).toEqual(b.name);
    expect(type(screen.getByText("Congrats, you're early to Skai."), w)).toEqual(b.sub);
    const reward = screen.getByTestId("badge-card-reward");
    const [points, pill] = Array.from(reward.children);
    expect(type(points, w)).toEqual(b.points);
    expect(type(pill, w)).toEqual(b.pill);
    expect(pad(pill, w)).toEqual(b.pillPad);
    expect(paintedAt(reward, w).gap).toBe(b.rewardGap);
  });

  it("sets the points and the pill in Mulish, in Alien Green 300", () => {
    card();
    const [points, pill] = Array.from(screen.getByTestId("badge-card-reward").children);
    expect(classesOf(points)).toEqual(expect.arrayContaining(["font-numbers", "text-alien-green-bright"]));
    expect(classesOf(pill)).toEqual(expect.arrayContaining(["font-numbers", "bg-alien-green-bright", "text-green-coal-300"]));
    expect(themeColors["alien-green-bright"]).toBe("#17F9B4");
  });

  it("at 768 opens the coachmark above the help icon, the arrow under it pointing down 16 from the right", () => {
    card();
    fireEvent.click(screen.getByRole("button", { name: "What is Skai?" }));
    const tip = screen.getByRole("tooltip");
    expect(classesOf(tip)).toEqual(
      expect.arrayContaining(["md:bottom-[calc(100%+2px)]", "md:top-auto", "md:-right-[26px]", "md:left-auto", "md:translate-x-0", "md:flex-col-reverse", "md:items-end"]),
    );
    // 1440 keeps the bubble to the right of the icon.
    expect(classesOf(tip)).toEqual(expect.arrayContaining(["lg:left-[calc(100%+4px)]", "lg:top-1/2", "lg:bottom-auto", "lg:right-auto", "lg:flex-row"]));
    const connector = tip.querySelector('[data-probe="badge-coachmark-connector"]')!;
    expect(classesOf(connector)).toEqual(expect.arrayContaining(["md:mr-4", "lg:mr-0"]));
    expect(classesOf(connector.firstElementChild!)).toEqual(expect.arrayContaining(["rotate-180", "md:rotate-0", "lg:rotate-90"]));
    const bubble = tip.querySelector('[data-probe="badge-coachmark-bubble"]')!;
    expect(pad(bubble, 375)).toEqual([12, 12, 12, 12]);
    expect(pad(bubble, 768)).toEqual([16, 16, 16, 16]);
    expect(pad(bubble, 1440)).toEqual([16, 16, 16, 16]);
    expect(paintedAt(bubble, 768).radius).toBe(8);
    const body = bubble.querySelector("p")!;
    expect(type(body, 375)).toEqual([12, 14, 400]);
    expect(type(body, 768)).toEqual([12, 16, 400]);
    expect(type(body, 1440)).toEqual([14, 18, 400]);
  });
});

describe("ReferralCard", () => {
  const card = () => {
    render(
      <ReferralCard referralLink="skai.trade/ref/artofofiare" referralPoints={100} shareTweetPoints={50} data-testid="referral" />,
    );
    return screen.getByTestId("referral");
  };
  const BOARD = {
    375: { pad: 8, gap: 16, radius: 20, inset: [8, 8, 0, 8], contentGap: 4, title: [18, 22, 400], sub: [12, 14, 400], label: [12, 16, 400], link: [14, 16, 700], linkBox: 44, linkRadius: 12, copy: [14, 16, 700], share: 40, sharePad: [12, 12, 12, 12], shareType: [14, 16, 700], discord: 44, discordPad: [14, 24, 14, 24], discordType: [14, 16, 700], buttonRadius: 12 },
    768: { pad: 16, gap: 22, radius: 18, inset: [0, 0, 0, 0], contentGap: 4, title: [18, 22, 400], sub: [12, 16, 400], label: [12, 16, 400], link: [14, 18, 400], linkBox: 50, linkRadius: 12, copy: [12, 16, 400], share: 40, sharePad: [12, 12, 12, 12], shareType: [12, 16, 400], discord: 54, discordPad: [18, 24, 18, 24], discordType: [14, 18, 400], buttonRadius: 12 },
    1440: { pad: 24, gap: 24, radius: 32, inset: [0, 0, 0, 0], contentGap: 8, title: [24, 28, 400], sub: [14, 18, 400], label: [14, 18, 400], link: [16, 22, 400], linkBox: 54, linkRadius: 16, copy: [16, 22, 400], share: 50, sharePad: [16, 22, 16, 22], shareType: [14, 18, 400], discord: 64, discordPad: [20, 40, 20, 40], discordType: [16, 22, 400], buttonRadius: 16 },
  } as const;
  // A box's height on the board: its padding plus its tallest line (the Discord icon is 16, 16, 24).
  const tall = (el: Element, w: W, line: number) => {
    const p = paintedAt(el, w);
    return (p.pt ?? 0) + Math.max(line, p.lineHeight ?? 0) + (p.pb ?? 0);
  };

  it.each(WIDTHS)("at %i draws the board's groups, type and box heights", (w) => {
    const b = BOARD[w];
    const root = card();
    expect(pad(root, w)).toEqual([b.pad, b.pad, b.pad, b.pad]);
    expect(paintedAt(root, w).gap).toBe(b.gap);
    expect(paintedAt(root, w).radius).toBe(b.radius);
    expect(pad(screen.getByTestId("referral-card-content"), w)).toEqual(b.inset);
    // The title sits 4 / 4 / 8 above its line (the content frame's gap).
    expect(paintedAt(screen.getByTestId("referral-card-content"), w).gap).toBe(b.contentGap);
    expect(type(screen.getByRole("heading"), w)).toEqual(b.title);
    expect(type(screen.getByText(/for each friend who makes their first deposit or trade/), w)).toEqual(b.sub);
    expect(type(screen.getByText("Referral link"), w)).toEqual(b.label);

    const linkBox = screen.getByTestId("referral-card-link");
    const linkText = screen.getByText("skai.trade/ref/artofofiare");
    expect(type(linkText, w)).toEqual(b.link);
    expect(tall(linkBox, w, paintedAt(linkText, w).lineHeight!)).toBe(b.linkBox);
    expect(paintedAt(linkBox, w).radius).toBe(b.linkRadius);
    expect(classesOf(linkBox)).toEqual(expect.arrayContaining(["ring-1", "ring-inset", "ring-green-coal-100", "bg-green-coal-300"]));
    expect(type(screen.getByRole("button", { name: /COPY/ }), w)).toEqual(b.copy);

    const share = screen.getByRole("button", { name: /Share With Friends/ });
    expect(tall(share, w, 16)).toBe(b.share);
    expect(pad(share, w)).toEqual(b.sharePad);
    expect(type(share, w)).toEqual(b.shareType);
    expect(paintedAt(share, w).radius).toBe(b.buttonRadius);
    const discord = screen.getByRole("button", { name: /Join Skai Community/ });
    const icon = w === 1440 ? 24 : 16;
    expect(tall(discord, w, icon)).toBe(b.discord);
    expect(pad(discord, w)).toEqual(b.discordPad);
    expect(type(discord, w)).toEqual(b.discordType);
    expect(paintedAt(discord, w).radius).toBe(b.buttonRadius);
  });

  it("draws the link box on the Green Coal line and the share box on Sky Blue, 1.5 at 1440, both inside", () => {
    card();
    const share = screen.getByRole("button", { name: /Share With Friends/ });
    expect(classesOf(share)).toEqual(expect.arrayContaining(["ring-1", "ring-inset", "ring-sky-blue", "lg:ring-[1.5px]", "bg-green-coal-300"]));
    for (const box of [share, screen.getByTestId("referral-card-link")]) {
      expect(classesOf(box).filter((k) => /^(lg:|md:)?border/.test(k))).toEqual([]);
    }
  });

  it("sets the points in the subtitle in Alien Green 300, with the copy rule unchanged", () => {
    card();
    const points = screen.getByText("100 SKAI points");
    expect(classesOf(points)).toEqual(expect.arrayContaining(["text-alien-green-bright", "lg:font-numbers"]));
    expect(points.parentElement!.textContent).toBe("Earn 100 SKAI points for each friend who makes their first deposit or trade.");
  });

  // Every dashboard board writes "SKAI points" and "Claim +50 SKAI points" (2422:3982, 2422:3996,
  // 2424:5138, 2424:9073).
  it("writes the share claim as the boards do, the amount signed", () => {
    card();
    const amount = screen.getByText("+50 SKAI points");
    expect(classesOf(amount)).toContain("text-alien-green-bright");
    expect(amount.parentElement!.textContent).toBe("Claim +50 SKAI points");
  });
});

describe("WelcomeCard", () => {
  const BOARD = {
    375: { pad: 8, radius: 20, inset: [8, 8, 0, 8], title: [20, 24, 300], sub: [12, 14, 400] },
    768: { pad: 24, radius: 18, inset: [0, 0, 0, 0], title: [24, 28, 300], sub: [12, 16, 400] },
    1440: { pad: 32, radius: 24, inset: [0, 0, 0, 0], title: [32, 36, 300], sub: [14, 18, 400] },
  } as const;

  it.each(WIDTHS)("at %i draws the board's card, title and line", (w) => {
    const b = BOARD[w];
    render(<WelcomeCard username="artofofiare" data-testid="welcome" />);
    const root = screen.getByTestId("welcome");
    expect(pad(root, w)).toEqual([b.pad, b.pad, b.pad, b.pad]);
    expect(paintedAt(root, w).radius).toBe(b.radius);
    expect(pad(screen.getByTestId("welcome-card-content"), w)).toEqual(b.inset);
    const title = screen.getByRole("heading");
    expect(type(title, w)).toEqual(b.title);
    expect(classesOf(screen.getByText("artofofiare"))).toContain("text-sky-blue");
    expect(type(screen.getByText("Check email for launch updates."), w)).toEqual(b.sub);
  });

  it("keeps the tabs outside the text inset, full width as the board's button", () => {
    render(<WelcomeCard username="artofofiare" />);
    const content = screen.getByTestId("welcome-card-content");
    expect(content.contains(screen.getByRole("button", { name: "AI" }))).toBe(false);
  });
});

// The card's Button/large and its Group 2 backdrop, read live 2026-11-13 off 2005:7840 (1440
// pre-launch), 2422:3301 (1440 Live), 2424:4443 (768 Live), 2424:8385 (375 Live) and 2005:25782
// (375 pre-launch). Casey 2026-11-13 (round 58 #1): "Launch app" shows disabled with its Coming
// soon tag; "Skai agent" takes the viewer to the agent chat, with no tag.
describe("WelcomeCard's Button/large", () => {
  const BOARD = {
    375: { pad: [14, 14, 14, 14], radius: 12, label: [14, 16, 700], row: 18, above: 16, tag: [10, 14, 400], tagPad: [2, 8, 2, 8], gap: 8 },
    768: { pad: [18, 18, 18, 18], radius: 12, label: [14, 18, 400], row: 18, above: 24, tag: [10, 14, 400], tagPad: [2, 8, 2, 8], gap: 8 },
    1440: { pad: [20, 40, 20, 40], radius: 16, label: [16, 22, 400], row: 22, above: 24, tag: [11, 14, 400], tagPad: [2, 12, 2, 12], gap: 8 },
  } as const;
  const HEIGHT = { 375: 46, 768: 54, 1440: 62 } as const;

  it.each(WIDTHS)("at %i draws the pre-launch button the board draws: its box, label, tag and gap", (w) => {
    const b = BOARD[w];
    render(<WelcomeCard username="artofofiare" launchStage="pre-launch" />);
    const button = screen.getByTestId("welcome-card-action");
    const row = screen.getByTestId("welcome-card-action-row");
    expect(pad(button, w)).toEqual(b.pad);
    expect(paintedAt(button, w).radius).toBe(b.radius);
    expect(type(button, w)).toEqual(b.label);
    expect(placedAt(row, w).h).toBe(b.row);
    expect(b.pad[0] + placedAt(row, w).h! + b.pad[2]).toBe(HEIGHT[w]);
    expect(placedAt(button, w).mt).toBe(b.above);
    expect(paintedAt(row, w).gap).toBe(b.gap);
    const tag = screen.getByText("Coming soon");
    expect(type(tag, w)).toEqual(b.tag);
    expect(pad(tag, w)).toEqual(b.tagPad);
    expect(paintedAt(tag, w).radius).toBe(8);
  });

  it("pre-launch reads Launch app, disabled, Green Coal 100 on Green Coal 300, the tag Sky Blue on Green Coal 200", () => {
    render(<WelcomeCard username="artofofiare" launchStage="pre-launch" onSkaiAgent={() => {}} />);
    const button = screen.getByRole("button", { name: /Launch app/ });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Launch appComing soon");
    expect(classesOf(button)).toEqual(expect.arrayContaining(["bg-green-coal-300", "text-green-coal-100", "w-full"]));
    expect(classesOf(screen.getByText("Coming soon"))).toEqual(expect.arrayContaining(["bg-green-coal-200", "text-sky-blue", "font-numbers", "font-normal"]));
    expect(screen.queryByText("Skai agent")).toBeNull();
  });

  it("Live reads Skai agent with no tag, enabled on Sky Blue, and hands the press to onSkaiAgent", () => {
    const onSkaiAgent = vi.fn();
    render(<WelcomeCard username="artofofiare" launchStage="live" onSkaiAgent={onSkaiAgent} />);
    const button = screen.getByRole("button", { name: "Skai agent" });
    expect(button).toBeEnabled();
    expect(screen.queryByText("Coming soon")).toBeNull();
    expect(screen.queryByText("Launch app")).toBeNull();
    expect(classesOf(button)).toEqual(expect.arrayContaining(["bg-sky-blue", "text-green-coal-300"]));
    fireEvent.click(button);
    expect(onSkaiAgent).toHaveBeenCalledTimes(1);
  });

  it("draws no button without a stage, or Live without somewhere to go", () => {
    const { unmount } = render(<WelcomeCard username="a" />);
    expect(screen.queryByTestId("welcome-card-action")).toBeNull();
    unmount();
    render(<WelcomeCard username="a" launchStage="live" />);
    expect(screen.queryByTestId("welcome-card-action")).toBeNull();
  });

  it("sits after the tabs, the card's last row", () => {
    render(<WelcomeCard username="a" launchStage="pre-launch" />);
    const button = screen.getByTestId("welcome-card-action");
    expect(button.previousElementSibling!.contains(screen.getByRole("button", { name: "AI" }))).toBe(true);
    expect(button.nextElementSibling).toBeNull();
  });
});

describe("WelcomeCard's Group 2 backdrop", () => {
  // Card-relative, held to the card's left edge and foot: left, bottom = card height - top - height.
  const BOARD = {
    375: { glow: { left: -232.7, bottom: -567.7, d: 644.1, blur: 48.7 }, back: { left: -86.8, bottom: -64.8, w: 875.8, h: 159.8 }, front: { left: -447, bottom: -14, w: 875.8, h: 58 } },
    768: { glow: { left: -258.9, bottom: -759.9, d: 865.9, blur: 65.5 }, back: { left: -64.8, bottom: -83.8, w: 1177.3, h: 214.8 }, front: { left: -549, bottom: -15.4, w: 1177.3, h: 77.9 } },
    1440: { glow: { left: -210.9, bottom: -776.9, d: 865.9, blur: 65.5 }, back: { left: -124.8, bottom: -100.8, w: 1177.3, h: 214.8 }, front: { left: -609, bottom: -32.4, w: 1177.3, h: 77.9 } },
  } as const;
  // The boards' card heights and each layer's top, to check the foot-relative numbers above.
  const TOPS = {
    375: { card: 132, glow: 55.6, back: 37, front: 88 },
    768: { card: 178, glow: 72, back: 47, front: 115.5 },
    1440: { card: 212, glow: 123, back: 98, front: 166.5 },
  } as const;

  const layers = () => {
    render(<WelcomeCard username="artofofiare" />);
    const group = screen.getByTestId("welcome-card-backdrop");
    const [glow, back, front] = Array.from(group.children);
    return { group, glow, back, front };
  };

  it("is one group at 44% behind the content, out of the reader's way", () => {
    const { group, glow, back, front } = layers();
    expect(classesOf(group)).toEqual(expect.arrayContaining(["absolute", "inset-0", "pointer-events-none"]));
    expect(placedAt(group, 1440).opacity).toBe(0.44);
    expect(group).toHaveAttribute("aria-hidden", "true");
    expect(group.compareDocumentPosition(screen.getByTestId("welcome-card-content")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(classesOf(glow)).toEqual(expect.arrayContaining(["bg-alien-green-bright", "rounded-full"]));
    for (const bars of [back, front]) expect(classesOf(bars as Element)).toContain("text-sky-blue");
  });

  it.each(WIDTHS)("at %i stands Ellipse 25 and the two unions where the board does", (w) => {
    const b = BOARD[w];
    const t = TOPS[w];
    const { glow, back, front } = layers();
    expect(placedAt(glow, w)).toEqual({ left: b.glow.left, bottom: b.glow.bottom, w: b.glow.d, h: b.glow.d, opacity: 0.19, blur: b.glow.blur });
    expect(placedAt(back, w)).toEqual({ left: b.back.left, bottom: b.back.bottom, w: b.back.w, h: b.back.h, opacity: 0.08 });
    expect(placedAt(front, w)).toEqual({ left: b.front.left, bottom: b.front.bottom, w: b.front.w, h: b.front.h, opacity: 0.34 });
    expect(b.glow.bottom).toBeCloseTo(t.card - t.glow - b.glow.d, 5);
    expect(b.back.bottom).toBeCloseTo(t.card - t.back - b.back.h, 5);
    expect(b.front.bottom).toBeCloseTo(t.card - t.front - b.front.h, 5);
  });

  it("draws each union as the page's: 320 bars, the halves mirrored, the tallest the union's full height", () => {
    const { back, front } = layers();
    for (const [svg, height] of [[back, 446.2], [front, 161.9]] as const) {
      expect(svg.getAttribute("viewBox")).toBe(`0 0 2446 ${height}`);
      expect(svg.getAttribute("preserveAspectRatio")).toBe("none");
      const bars = Array.from(svg.querySelector("path")!.getAttribute("d")!.matchAll(/M([\d.]+) [\d.]+h3\.06v-([\d.]+)h-3\.06z/g)).map((m) => [Number(m[1]), Number(m[2])]);
      expect(bars).toHaveLength(320);
      expect(Math.max(...bars.map(([, h]) => h))).toBeCloseTo(height, 2);
      const left = bars.filter((_, i) => i % 2 === 0);
      const right = bars.filter((_, i) => i % 2 === 1);
      expect(left[0][0]).toBe(0);
      expect(right[0][0]).toBeCloseTo(2446 - 3.06, 2);
      for (let i = 0; i < 160; i++) {
        expect(right[i][1]).toBe(left[i][1]);
        expect(left[i][0] + right[i][0]).toBeCloseTo(2446 - 3.06, 1);
      }
    }
  });
});

describe("the Gray 100 runs", () => {
  // skai.trade's own Tailwind theme gives the `skai-gray-100` name to a legacy Ash
  // (#95A09F), so the runs the boards set in Gray 100 carry its hex, and nothing in
  // these four components uses that name. skai-landing's dashboardCards.landingTheme
  // test reads what the landing compiles.
  it("sets the six runs in #E0E0E0, never through the skai-gray-100 name", () => {
    render(<WelcomeCard username="a" />);
    render(<BadgeCard badgeName="Pioneer badge" badgeSubtitle="Congrats, you're early to Skai." badgePoints={500} />);
    fireEvent.click(screen.getByRole("button", { name: "What is Skai?" }));
    render(<ReferralCard referralLink="skai.trade/ref/a" referralPoints={100} shareTweetPoints={0} />);
    const { container } = render(<LandingFooter />);
    const runs = [
      screen.getByText("Check email for launch updates."),
      screen.getByText("Congrats, you're early to Skai."),
      screen.getByRole("tooltip").querySelector("p")!,
      screen.getByText(/for each friend who makes their first deposit or trade/),
      screen.getByRole("link", { name: "Terms" }),
      screen.getByRole("link", { name: "Privacy" }),
    ];
    for (const el of runs) expect(classesOf(el), el.textContent ?? "").toContain("text-[#E0E0E0]");
    const everyClass = Array.from(document.body.querySelectorAll("[class]")).flatMap(classesOf);
    expect(everyClass.filter((c) => c.includes("skai-gray-100"))).toEqual([]);
    expect(container.querySelector("footer")).not.toBeNull();
  });
});

describe("LandingFooter", () => {
  const BOARD = {
    375: { pad: [24, 24, 24, 24], legal: [14, 16, 700] },
    768: { pad: [30, 30, 30, 30], legal: [12, 16, 400] },
    1440: { pad: [32, 32, 24, 32], legal: [14, 18, 400] },
  } as const;

  it.each(WIDTHS)("at %i sits on the board's inset with its legal type", (w) => {
    const { container } = render(<LandingFooter />);
    expect(pad(container.querySelector("footer")!, w)).toEqual(BOARD[w].pad);
    expect(type(screen.getByRole("link", { name: "Terms" }), w)).toEqual(BOARD[w].legal);
    expect(type(screen.getByRole("link", { name: "Privacy" }), w)).toEqual(BOARD[w].legal);
  });
});
