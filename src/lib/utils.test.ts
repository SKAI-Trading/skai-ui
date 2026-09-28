/**
 * cn() has to know the preset's own type steps, shadows and gradients.
 *
 * Stock tailwind-merge filed every preset font size (`text-para-2`,
 * `text-number-4-mobile`, ...) as a text COLOUR, so a colour class after one
 * dropped the size and a size after a colour dropped the colour. The preset's
 * shadows were read as shadow colours and its gradients as bg colours, with
 * the same result. Wave 73 (P038, P118) and wave 71 (the fortune wheel) hit
 * it, and 60-odd call sites write raw literals to get around it.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import skaiPreset from "./tailwind-preset";
import { cn } from "./utils";

const extend = skaiPreset.theme?.extend ?? {};
const keysOf = (scale: unknown) =>
  Object.keys((scale ?? {}) as Record<string, unknown>).filter((k) => k !== "DEFAULT");

const fontSizes = keysOf(extend.fontSize);
const shadows = keysOf(extend.boxShadow);
const gradients = keysOf(extend.backgroundImage);

describe("cn: preset font sizes are sizes, not colours", () => {
  it("keeps a named size when a colour follows it", () => {
    expect(cn("text-number-4-mobile", "text-white")).toBe("text-number-4-mobile text-white");
  });

  it("keeps a colour when a named size follows it", () => {
    expect(cn("text-white", "text-number-4-mobile")).toBe("text-white text-number-4-mobile");
  });

  it("keeps the whole responsive ramp next to its colour (the wave 71 P049 case)", () => {
    expect(cn("font-mulish text-number-2-mobile md:text-number-2-tablet text-ash")).toBe(
      "font-mulish text-number-2-mobile md:text-number-2-tablet text-ash",
    );
  });

  it("keeps the portfolio table header's size, leading and colour together", () => {
    expect(cn("text-label-2-mobile leading-3 text-ash")).toBe("text-label-2-mobile leading-3 text-ash");
  });

  it("still merges two sizes to the last one", () => {
    expect(cn("text-sm", "text-para-2")).toBe("text-para-2");
    expect(cn("text-para-2", "text-number-4")).toBe("text-number-4");
    expect(cn("text-para-2", "text-sm")).toBe("text-sm");
    expect(cn("text-[14px]", "text-para-2")).toBe("text-para-2");
    expect(cn("text-para-2", "text-[length:14px]")).toBe("text-[length:14px]");
  });

  it("still merges two colours to the last one, around a size", () => {
    expect(cn("text-white", "text-ash")).toBe("text-ash");
    expect(cn("text-para-2 text-white", "text-ash")).toBe("text-para-2 text-ash");
    expect(cn("text-para-2", "text-[#fff]")).toBe("text-para-2 text-[#fff]");
  });

  it("tells a size from a colour that shares its first word", () => {
    expect(cn("text-card-title", "text-card-foreground")).toBe("text-card-title text-card-foreground");
    expect(cn("text-card-foreground", "text-card")).toBe("text-card");
  });

  it("keeps each breakpoint's size separate", () => {
    expect(cn("text-para-2", "md:text-para-2-tablet")).toBe("text-para-2 md:text-para-2-tablet");
    expect(cn("md:text-para-2-tablet", "md:text-number-4")).toBe("md:text-number-4");
    expect(cn("md:text-para-2-tablet", "text-white")).toBe("md:text-para-2-tablet text-white");
  });

  it("applies tailwind-merge's usual size-over-leading rule, as it does for text-sm", () => {
    expect(cn("leading-5", "text-sm")).toBe("text-sm");
    expect(cn("leading-5", "text-para-2")).toBe("text-para-2");
    expect(cn("text-para-2", "leading-5")).toBe("text-para-2 leading-5");
  });

  it("knows every font size in the preset, in both orders", () => {
    expect(fontSizes.length).toBeGreaterThan(40);
    expect(fontSizes).toEqual(expect.arrayContaining(["number-4-mobile", "para-2-tablet", "label-2"]));
    for (const key of fontSizes) {
      expect(cn(`text-${key}`, "text-white"), key).toBe(`text-${key} text-white`);
      expect(cn("text-white", `text-${key}`), key).toBe(`text-white text-${key}`);
      expect(cn("text-sm", `text-${key}`), key).toBe(`text-${key}`);
    }
  });
});

describe("cn: preset shadows are shadows, not shadow colours", () => {
  it("lets a named shadow replace a stock one and survive a shadow colour", () => {
    expect(shadows).toEqual(expect.arrayContaining(["card", "modal"]));
    for (const key of shadows) {
      expect(cn("shadow-md", `shadow-${key}`), key).toBe(`shadow-${key}`);
      expect(cn(`shadow-${key}`, "shadow-none"), key).toBe("shadow-none");
      expect(cn(`shadow-${key}`, "shadow-black/20"), key).toBe(`shadow-${key} shadow-black/20`);
    }
  });
});

describe("cn: preset gradients are background images, not bg colours", () => {
  it("keeps a gradient next to a fill and lets bg-none replace it", () => {
    expect(gradients).toEqual(expect.arrayContaining(["skai-gradient", "gradient-primary"]));
    for (const key of gradients) {
      expect(cn(`bg-${key}`, "bg-transparent"), key).toBe(`bg-${key} bg-transparent`);
      expect(cn("bg-black", `bg-${key}`), key).toBe(`bg-black bg-${key}`);
      expect(cn("bg-none", `bg-${key}`), key).toBe(`bg-${key}`);
      expect(cn(`bg-${key}`, "bg-none"), key).toBe("bg-none");
    }
  });
});

describe("cn: stock behaviour outside the preset's keys is unchanged", () => {
  it("merges the default scales as before", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-base")).toBe("text-base");
    expect(cn("rounded-md", "rounded-lg")).toBe("rounded-lg");
    expect(cn("bg-black", "bg-white")).toBe("bg-white");
    expect(cn("p-2", false, undefined, { "p-4": true })).toBe("p-4");
  });
});

describe("cn reads its keys from the preset module", () => {
  afterEach(() => {
    vi.doUnmock("./tailwind-preset");
    vi.resetModules();
  });

  it("picks up a size the preset gains, with no second list to edit", async () => {
    vi.resetModules();
    vi.doMock("./tailwind-preset", () => ({
      default: {
        theme: {
          extend: {
            fontSize: { "lg-body-1": ["1rem", { lineHeight: "1.5rem" }] },
            boxShadow: { lift: "0 1px 2px black" },
            backgroundImage: { "sky-wash": "linear-gradient(red, blue)" },
          },
        },
      },
    }));
    const fresh = await import("./utils");
    expect(fresh.cn("text-lg-body-1", "text-white")).toBe("text-lg-body-1 text-white");
    expect(fresh.cn("shadow-md", "shadow-lift")).toBe("shadow-lift");
    expect(fresh.cn("bg-sky-wash", "bg-transparent")).toBe("bg-sky-wash bg-transparent");
  });
});
