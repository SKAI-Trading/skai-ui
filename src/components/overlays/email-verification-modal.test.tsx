/**
 * The Temporary landing verification boards at 768: 2598:2383 (empty) and
 * 2598:3863 (with input), modals 2598:3052 and 2598:4532, read 2026-09-27.
 * The August 375 and 1440 boards (11229:188039, 11229:188072, 10734:78604)
 * set the same terms at their own sizes.
 *
 * jsdom lays nothing out, so this pins the classes that carry each term.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailVerificationModal } from "./email-verification-modal";

function renderModal() {
  return render(
    <EmailVerificationModal
      isOpen
      onClose={vi.fn()}
      onBack={vi.fn()}
      email="david@skai.trade"
      onVerify={vi.fn()}
      onResendCode={vi.fn()}
    />,
  );
}

const classesOf = (el: Element | null): string[] => {
  expect(el).not.toBeNull();
  return (el as HTMLElement).className.split(/\s+/);
};

const cellOf = (index: number) => screen.getByLabelText(`Digit ${index}`).parentElement;

describe("email verification modal, Temporary landing boards", () => {
  it("rounds the box 20 / 26 / 32", () => {
    renderModal();
    const box = classesOf(screen.getByRole("heading", { name: "Email verification" }).parentElement);
    expect(box).toEqual(expect.arrayContaining(["rounded-[20px]", "md:rounded-[26px]", "lg:rounded-[32px]"]));
    expect(box).not.toContain("md:rounded-[28px]");
    // 448 at 1440 is the theme's max-w-md (28rem).
    expect(box).toEqual(expect.arrayContaining(["max-w-[358px]", "md:max-w-[468px]", "lg:max-w-md", "bg-green-coal-200"]));
  });

  it("sets the address Bold in the line's Gray 100, not white", () => {
    renderModal();
    const address = screen.getByText("david@skai.trade");
    expect(address.tagName).toBe("SPAN");
    expect(classesOf(address)).toContain("font-bold");
    expect(classesOf(address)).not.toContain("text-white");
    expect(classesOf(address.parentElement)).toContain("text-[#E0E0E0]");
  });

  it("draws only the count in Sky Blue Mulish, and ' seconds' on the Gray 100 line", () => {
    renderModal();
    const line = screen.getByText(/Resend code in/);
    expect(line.textContent?.replace(/\s+/g, " ").trim()).toBe("Resend code in 30 seconds");
    expect(classesOf(line)).toEqual(
      expect.arrayContaining(["font-manrope", "text-para-2-mobile", "text-[#E0E0E0]", "md:text-para-2-tablet", "lg:text-para-2"]),
    );
    const count = line.querySelector("span");
    expect(count?.textContent).toBe("30");
    expect(classesOf(count)).toEqual(
      expect.arrayContaining([
        "font-mulish",
        "text-sky-blue",
        "text-label-2-mobile",
        "md:text-[12px]",
        "md:leading-[16px]",
        "lg:text-number-4",
      ]),
    );
    expect(classesOf(count)).not.toContain("font-medium");
    expect(line.querySelectorAll("span")).toHaveLength(1);
  });

  it("keeps a filled cell on Green Coal 100 and strokes only the focused one App/Green 300", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText("Digit 1"), "1");
    await user.type(screen.getByLabelText("Digit 2"), "5");

    const filled = classesOf(cellOf(1));
    expect(filled).toContain("border-green-coal-100");
    expect(filled).toContain("focus-within:border-skai-green");
    expect(filled.join(" ")).not.toMatch(/2DEDAD/i);

    for (let i = 1; i <= 6; i += 1) {
      const cell = classesOf(cellOf(i));
      expect(cell).toContain("border-green-coal-100");
      expect(cell).toContain("focus-within:border-skai-green");
      expect(cell).toEqual(expect.arrayContaining(["bg-green-coal", "rounded-xl", "lg:rounded-2xl"]));
    }
    expect(document.body.innerHTML).not.toMatch(/2DEDAD/i);
  });

  it("keeps the red stroke on every cell when the code is refused", () => {
    // The page hands the error in after the modal is open; an error present
    // at open is cleared by the open reset.
    const props = {
      isOpen: true,
      onClose: vi.fn(),
      onBack: vi.fn(),
      email: "david@skai.trade",
      onVerify: vi.fn(),
    };
    const { rerender } = render(<EmailVerificationModal {...props} />);
    rerender(<EmailVerificationModal {...props} error="Invalid code" />);
    expect(screen.getByText("Invalid code")).toBeInTheDocument();
    for (let i = 1; i <= 6; i += 1) {
      const cell = classesOf(cellOf(i));
      expect(cell).toContain("border-[#FF4444]");
      expect(cell).not.toContain("border-green-coal-100");
    }
  });

  it("shows an Ash 0 in an empty cell as the placeholder, never as a digit", async () => {
    const user = userEvent.setup();
    const onVerify = vi.fn();
    render(
      <EmailVerificationModal isOpen onClose={vi.fn()} onBack={vi.fn()} email="david@skai.trade" onVerify={onVerify} />,
    );
    for (let i = 1; i <= 6; i += 1) {
      const input = screen.getByLabelText(`Digit ${i}`) as HTMLInputElement;
      expect(input).toHaveAttribute("placeholder", "0");
      expect(input.value).toBe("");
      expect(classesOf(input)).toContain("placeholder:text-ash");
    }
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    await user.type(screen.getByLabelText("Digit 1"), "7");
    expect((screen.getByLabelText("Digit 1") as HTMLInputElement).value).toBe("7");
    expect(onVerify).not.toHaveBeenCalled();
  });

  it("sets Back on the Bold cut at 375 and Regular from 768", () => {
    renderModal();
    const label = screen.getByText("Back");
    expect(classesOf(label)).toEqual(
      expect.arrayContaining([
        "text-para-1-mobile",
        "font-bold",
        "md:text-para-2-tablet",
        "md:font-normal",
        "lg:text-para-2",
        "text-[#E0E0E0]",
      ]),
    );
    expect(classesOf(label)).not.toContain("font-normal");
  });
});
