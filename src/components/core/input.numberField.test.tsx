/**
 * A number field refuses what cannot be part of a plain decimal (report
 * 664eb181: the spot ticket's Amount box held the letter "e").
 *
 * `fireEvent.*` returns false when a handler called `preventDefault`, which is
 * what stops the browser from putting the character in the box.
 */
import type { KeyboardEvent } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  Input,
  SkaiInput,
  numberFieldRefusesKey,
  numberFieldRefusesText,
  numberFieldTakesNegative,
} from "./input";

const typed = (el: HTMLElement, key: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(el, { key, ...init });

const pasted = (el: HTMLElement, text: string) =>
  fireEvent.paste(el, { clipboardData: { getData: () => text } });

const dropped = (el: HTMLElement, text: string) =>
  fireEvent.drop(el, { dataTransfer: { getData: () => text } });

describe("Input type=number", () => {
  it("refuses the exponent letters and a plus sign", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    for (const key of ["e", "E", "+"]) {
      expect(typed(box, key), key).toBe(false);
    }
  });

  it("refuses any other letter, which Firefox would otherwise keep", () => {
    render(<Input type="number" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    for (const key of ["a", "x", "Z", " ", "$"]) {
      expect(typed(box, key), key).toBe(false);
    }
  });

  it("takes digits, the decimal point and the comma", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    for (const key of ["0", "5", "9", ".", ","]) {
      expect(typed(box, key), key).toBe(true);
    }
  });

  it("lets editing keys and shortcuts through", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    for (const key of ["Backspace", "Delete", "ArrowLeft", "ArrowUp", "Tab", "Enter", "Home"]) {
      expect(typed(box, key), key).toBe(true);
    }
    expect(typed(box, "a", { ctrlKey: true })).toBe(true);
    expect(typed(box, "c", { metaKey: true })).toBe(true);
    expect(typed(box, "v", { ctrlKey: true })).toBe(true);
  });

  it("takes a minus sign only where the field can go below zero", () => {
    const { rerender } = render(<Input type="number" min="0" data-testid="amount" />);
    expect(typed(screen.getByTestId("amount"), "-")).toBe(false);

    rerender(<Input type="number" min={2} data-testid="amount" />);
    expect(typed(screen.getByTestId("amount"), "-")).toBe(false);

    rerender(<Input type="number" min="-100" data-testid="amount" />);
    expect(typed(screen.getByTestId("amount"), "-")).toBe(true);

    rerender(<Input type="number" data-testid="amount" />);
    expect(typed(screen.getByTestId("amount"), "-")).toBe(true);
  });

  it("refuses a paste or a drop that carries an exponent or a letter", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    expect(pasted(box, "1e5")).toBe(false);
    expect(pasted(box, "12abc")).toBe(false);
    expect(pasted(box, "-3")).toBe(false);
    expect(dropped(box, "2E3")).toBe(false);

    expect(pasted(box, "0.0125")).toBe(true);
    expect(pasted(box, " 1,250.5 ")).toBe(true);
    expect(dropped(box, "42")).toBe(true);
  });

  it("still runs the caller's handlers, and a caller's own refusal stands", () => {
    const onKeyDown = vi.fn();
    const onPaste = vi.fn();
    render(
      <Input type="number" min="0" data-testid="amount" onKeyDown={onKeyDown} onPaste={onPaste} />,
    );
    const box = screen.getByTestId("amount");
    typed(box, "7");
    typed(box, "e");
    pasted(box, "1e5");
    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(onPaste).toHaveBeenCalledTimes(1);

    const refuseAll = (e: KeyboardEvent) => e.preventDefault();
    render(<Input type="number" data-testid="strict" onKeyDown={refuseAll} />);
    expect(typed(screen.getByTestId("strict"), "7")).toBe(false);
  });

  it("leaves every other type alone", () => {
    render(<Input type="text" data-testid="name" />);
    const box = screen.getByTestId("name");
    expect(typed(box, "e")).toBe(true);
    expect(pasted(box, "1e5")).toBe(true);
  });
});

describe("SkaiInput type=number", () => {
  it("refuses the exponent letter and keeps digits", () => {
    render(<SkaiInput type="number" min="0" label="Amount" />);
    const box = screen.getByLabelText("Amount");
    expect(typed(box, "e")).toBe(false);
    expect(typed(box, "4")).toBe(true);
    expect(pasted(box, "4e2")).toBe(false);
  });
});

describe("number field rules", () => {
  it("reads the minimum the way the browser does", () => {
    expect(numberFieldTakesNegative(undefined)).toBe(true);
    expect(numberFieldTakesNegative("")).toBe(true);
    expect(numberFieldTakesNegative("-1")).toBe(true);
    expect(numberFieldTakesNegative("abc")).toBe(true);
    expect(numberFieldTakesNegative(0)).toBe(false);
    expect(numberFieldTakesNegative("0.5")).toBe(false);
  });

  it("names exactly the keys and text a field refuses", () => {
    expect(numberFieldRefusesKey("e", true)).toBe(true);
    expect(numberFieldRefusesKey("-", true)).toBe(false);
    expect(numberFieldRefusesKey("-", false)).toBe(true);
    expect(numberFieldRefusesKey("Backspace", false)).toBe(false);
    expect(numberFieldRefusesText("-1.5", true)).toBe(false);
    expect(numberFieldRefusesText("-1.5", false)).toBe(true);
    expect(numberFieldRefusesText("1e-7", true)).toBe(true);
  });
});
