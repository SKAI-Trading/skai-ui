import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  AUTH_WALLET_IDS,
  AUTH_WALLET_ICONS,
  AUTH_WALLET_LABELS,
  RainbowWalletIcon,
} from "./auth-wallet-icons";

describe("auth wallet ids", () => {
  it("lists the four wallets the frames draw, in frame order", () => {
    expect(AUTH_WALLET_IDS).toEqual(["io.metamask", "app.phantom", "me.rainbow", "walletConnect"]);
  });

  it("has a label and an icon for every id", () => {
    for (const id of AUTH_WALLET_IDS) {
      expect(AUTH_WALLET_LABELS[id]).toBeTruthy();
      const Icon = AUTH_WALLET_ICONS[id];
      const { container } = render(<Icon />);
      expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("gives two Rainbow marks on one page distinct gradient ids", () => {
    const { container } = render(
      <>
        <RainbowWalletIcon />
        <RainbowWalletIcon />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
