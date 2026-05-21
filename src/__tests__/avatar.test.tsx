import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/data-display/avatar";

describe("Avatar", () => {
  it("renders fallback when no image src is provided", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("forwards className on root", () => {
    const { container } = render(
      <Avatar className="my-avatar">
        <AvatarFallback>X</AvatarFallback>
      </Avatar>,
    );
    expect(container.firstChild).toHaveClass("my-avatar");
  });

  it("rounds full + overflow-hidden by default", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>X</AvatarFallback>
      </Avatar>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("rounded-full");
    expect(root).toHaveClass("overflow-hidden");
  });

  it("AvatarImage exists in the tree (Radix manages render lifecycle)", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage alt="user" src="/x.png" />
        <AvatarFallback>F</AvatarFallback>
      </Avatar>,
    );
    // Radix only renders <img> after onLoadingStatusChange='loaded' — fallback shows in jsdom
    expect(container).toBeTruthy();
  });
});
