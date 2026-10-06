/**
 * A highlighted dropdown row keeps readable ink in the light theme
 * (report 773f8a9d, "many drop down sections ... become invisible/difficult to
 * see when light mode is activated").
 *
 * Every item primitive forces `focus:text-white` over a 10% Sky Blue wash. The
 * menu itself is `bg-popover`, which is white in the light theme, so the row
 * under the pointer or the keyboard turned white-on-white. The dark theme keeps
 * its white ink; the light theme takes the popover's own foreground.
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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

const tokens = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);

describe("dropdown rows under focus in the light theme (773f8a9d)", () => {
  it.each(["Item", "Checkbox", "Radio", "Sub"])("%s keeps white focus ink in dark and takes the popover ink in light", (name) => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
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
    const row = screen.getByText(name).closest("[role^=menuitem]");
    expect(row).not.toBeNull();
    const cls = tokens(row!);
    expect(cls).toContain("focus:text-white");
    expect(cls).toContain("[.light_&]:focus:text-popover-foreground");
  });
});
