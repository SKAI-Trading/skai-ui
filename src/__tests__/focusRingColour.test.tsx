/**
 * One focus colour (report a345fc34: a focused box outlined blue in one place
 * and green in another).
 *
 * Input, the OTP field and the tag input ring in `ring-ring`. Pressable rang
 * in `ring-primary`, which is Alien Green in the main app (its `--primary`
 * stays green while `--ring` is Sky Blue), so every Pressable there drew a
 * green keyboard ring beside the blue one on its fields. SkaiButton's
 * secondary type rang Sky Blue while primary and tertiary rang #2DEDAD.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkaiButton } from "../components/core/button";
import { Pressable } from "../components/utility/pressable";

const focusRings = (el: HTMLElement) =>
  el.className.split(/\s+/).filter((c) => /^focus(-visible|-within)?:(ring|border|outline)-(?!\d|offset|inset|none)/.test(c));

describe("focus rings share the ring token's colour (a345fc34)", () => {
  it("rings a focused Pressable in the ring token, as Input does", () => {
    render(<Pressable>Go</Pressable>);
    expect(focusRings(screen.getByRole("button", { name: "Go" }))).toEqual(["focus-visible:ring-ring"]);
  });

  it("rings every SkaiButton type in Sky Blue, never Alien Green", () => {
    for (const skaiType of ["primary", "secondary", "tertiary"] as const) {
      const { unmount } = render(<SkaiButton skaiType={skaiType}>{skaiType}</SkaiButton>);
      const rings = focusRings(screen.getByRole("button", { name: skaiType }));
      expect(rings, skaiType).toEqual(["focus-visible:ring-[#56C7F3]"]);
      unmount();
    }
  });
});
