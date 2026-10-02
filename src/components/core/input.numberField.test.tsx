/**
 * A number field refuses what cannot be part of a plain decimal (report
 * 664eb181: the spot ticket's Amount box held the letter "e"), and reads a
 * comma rather than letting the browser drop it: Chromium and WebKit turn a
 * typed "1,5" into 15 and a pasted "1.234,56" into 1.23456.
 *
 * `fireEvent.*` returns false when a handler called `preventDefault`, which is
 * what stops the browser from putting the text in the box. jsdom has no
 * `insertText` command, so the tests stand one in and read what the field
 * asked it to type.
 */
import { createRef, useState, type KeyboardEvent } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Input, SkaiInput } from "./input";
import {
  numberFieldRefusesKey,
  numberFieldRefusesText,
  numberFieldTakesNegative,
  numberFieldProps,
  numberFromPastedText,
  useNumberFieldGuard,
} from "./number-field-guard";

const typed = (el: HTMLElement, key: string, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(el, { key, ...init });

const pasted = (el: HTMLElement, text: string) =>
  fireEvent.paste(el, { clipboardData: { getData: () => text } });

const dropped = (el: HTMLElement, text: string) =>
  fireEvent.drop(el, { dataTransfer: { getData: () => text } });

/** An input method's insertion, which comes with no usable keydown. */
const composed = (el: HTMLElement, data: string) => {
  const event = new InputEvent("beforeinput", {
    data,
    inputType: "insertText",
    bubbles: true,
    cancelable: true,
  });
  return el.dispatchEvent(event);
};

/** What the field typed through `document.execCommand("insertText")`. */
let inserted: string[];
const realExecCommand = document.execCommand;
beforeEach(() => {
  inserted = [];
  document.execCommand = vi.fn((command: string, _ui?: boolean, value?: string) => {
    if (command === "insertText") inserted.push(value ?? "");
    return command === "insertText";
  }) as typeof document.execCommand;
});
afterEach(() => {
  document.execCommand = realExecCommand;
});

describe("Input type=number: keys", () => {
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

  it("takes digits and the decimal point", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    for (const key of ["0", "5", "9", "."]) {
      expect(typed(box, key), key).toBe(true);
    }
  });

  it("lets editing keys and shortcuts through", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    for (const key of ["Backspace", "Delete", "ArrowLeft", "ArrowUp", "Tab", "Enter", "Home", "Unidentified"]) {
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
});

describe("Input type=number: the comma (en-US 1.5 and de-DE 1,5 must mean the same)", () => {
  it("enters a typed comma as the decimal point", () => {
    render(<Input type="number" min="0" data-testid="amount" defaultValue="1" />);
    const box = screen.getByTestId("amount");
    expect(typed(box, ",")).toBe(false);
    expect(inserted).toEqual(["."]);
  });

  it("refuses a comma once the field has a decimal point", () => {
    render(<Input type="number" min="0" data-testid="amount" defaultValue="1.5" />);
    expect(typed(screen.getByTestId("amount"), ",")).toBe(false);
    expect(inserted).toEqual([]);
  });

  it("leaves the comma to an engine that cannot type the point for it", () => {
    document.execCommand = undefined as unknown as typeof document.execCommand;
    render(<Input type="number" min="0" data-testid="amount" defaultValue="1" />);
    expect(typed(screen.getByTestId("amount"), ",")).toBe(true);
  });

  it("refuses a comma typed straight after a point, which the value cannot show", () => {
    // A box showing "1." reads "1" (Chromium) or "" (a de-DE WebKit).
    render(<Input type="number" min="0" data-testid="amount" defaultValue="1" />);
    const box = screen.getByTestId("amount");
    expect(typed(box, ".")).toBe(true);
    expect(typed(box, ",")).toBe(false);
    expect(inserted).toEqual([]);
    // A digit after the point ends it; the value then shows the point itself.
    expect(typed(box, "5")).toBe(true);
  });

  it("does the same for a comma an input method inserts with no keydown", async () => {
    render(<Input type="number" min="0" data-testid="amount" defaultValue="2" />);
    const box = screen.getByTestId("amount");
    expect(composed(box, ",")).toBe(false);
    await act(async () => {
      await Promise.resolve();
    });
    expect(inserted).toEqual(["."]);
  });
});

describe("Input type=number: input methods", () => {
  it("refuses an inserted letter, exponent or sign, and keeps digits", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    expect(composed(box, "e")).toBe(false);
    expect(composed(box, "1e5")).toBe(false);
    expect(composed(box, "-")).toBe(false);
    expect(composed(box, "7")).toBe(true);
    expect(composed(box, "0.25")).toBe(true);
  });

  it("leaves a text field's input method alone", () => {
    render(<Input type="text" data-testid="name" />);
    expect(composed(screen.getByTestId("name"), "e")).toBe(true);
  });
});

describe("Input type=number: paste", () => {
  const pasteInto = (text: string, min: string | undefined = "0") => {
    inserted = [];
    const { unmount } = render(<Input type="number" min={min} data-testid="amount" />);
    const handledByBrowser = pasted(screen.getByTestId("amount"), text);
    unmount();
    return { handledByBrowser, inserted: [...inserted] };
  };

  it("types the number a pasted figure states", () => {
    expect(pasteInto("$100")).toEqual({ handledByBrowser: false, inserted: ["100"] });
    expect(pasteInto("0.5 BTC")).toEqual({ handledByBrowser: false, inserted: ["0.5"] });
    expect(pasteInto("1,234.56")).toEqual({ handledByBrowser: false, inserted: ["1234.56"] });
    expect(pasteInto("1.234,56")).toEqual({ handledByBrowser: false, inserted: ["1234.56"] });
    expect(pasteInto("1,5")).toEqual({ handledByBrowser: false, inserted: ["1.5"] });
    expect(pasteInto("-2", "-10")).toEqual({ handledByBrowser: false, inserted: ["-2"] });
  });

  it("refuses what reads more than one way, with no change to the field", () => {
    for (const text of ["1,234", "1e-7", "-2", "12abc34", "1,2,3", "two"]) {
      expect(pasteInto(text), text).toEqual({ handledByBrowser: false, inserted: [] });
    }
  });

  it("sets the value itself where the browser has no insertText", () => {
    document.execCommand = vi.fn(() => false) as typeof document.execCommand;
    const seen: string[] = [];
    function Field() {
      const [value, setValue] = useState("");
      return (
        <Input
          type="number"
          min="0"
          data-testid="amount"
          value={value}
          onChange={(e) => {
            seen.push(e.target.value);
            setValue(e.target.value);
          }}
        />
      );
    }
    render(<Field />);
    pasted(screen.getByTestId("amount"), "$1,250.5");
    expect(seen).toEqual(["1250.5"]);
    expect(screen.getByTestId("amount")).toHaveValue(1250.5);
  });

  it("refuses a drop that is not a plain figure", () => {
    render(<Input type="number" min="0" data-testid="amount" />);
    const box = screen.getByTestId("amount");
    expect(dropped(box, "2E3")).toBe(false);
    expect(dropped(box, "1,5")).toBe(false);
    expect(dropped(box, "42")).toBe(true);
  });
});

describe("Input type=number: the caller's handlers and refs", () => {
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

  it("fills an object ref and a function ref", () => {
    const objectRef = createRef<HTMLInputElement>();
    const fnRef = vi.fn();
    render(
      <>
        <Input type="number" data-testid="a" ref={objectRef} />
        <SkaiInput type="number" data-testid="b" ref={fnRef} />
      </>,
    );
    expect(objectRef.current).toBe(screen.getByTestId("a"));
    expect(fnRef).toHaveBeenCalledWith(screen.getByTestId("b"));
  });

  it("leaves every other type alone", () => {
    render(<Input type="text" data-testid="name" />);
    const box = screen.getByTestId("name");
    expect(typed(box, "e")).toBe(true);
    expect(typed(box, ",")).toBe(true);
    expect(pasted(box, "1e5")).toBe(true);
    expect(inserted).toEqual([]);
  });
});

describe("SkaiInput type=number", () => {
  it("refuses the exponent letter, keeps digits and reads a comma", () => {
    render(<SkaiInput type="number" min="0" label="Amount" />);
    const box = screen.getByLabelText("Amount");
    expect(typed(box, "e")).toBe(false);
    expect(typed(box, "4")).toBe(true);
    expect(pasted(box, "4e2")).toBe(false);
    expect(typed(box, ",")).toBe(false);
    expect(inserted).toEqual(["."]);
  });
});

describe("useNumberFieldGuard on a raw input", () => {
  it("gives a plain <input> the same guard", () => {
    function Raw() {
      const guard = useNumberFieldGuard({ min: 0 });
      return <input type="number" min={0} data-testid="raw" {...guard} />;
    }
    render(<Raw />);
    const box = screen.getByTestId("raw");
    expect(typed(box, "e")).toBe(false);
    expect(typed(box, "3")).toBe(true);
    expect(composed(box, "e")).toBe(false);
    expect(pasted(box, "\u20ac 2,50")).toBe(false);
    expect(inserted).toEqual(["2.50"]);
  });
});

describe("numberFieldProps on raw inputs in a list", () => {
  it("guards each row, keeps the caller's ref and handlers, and attaches one listener per field", () => {
    const refs: Array<HTMLInputElement | null> = [];
    const onKeyDown = vi.fn();
    const added = vi.spyOn(HTMLInputElement.prototype, "addEventListener");
    function Rows({ n }: { n: number }) {
      return (
        <>
          {Array.from({ length: n }, (_, i) => (
            <input
              key={i}
              type="number"
              min={0}
              data-testid={`stake-${i}`}
              {...numberFieldProps({ min: 0, onKeyDown, ref: (el) => { refs[i] = el; } })}
            />
          ))}
        </>
      );
    }
    const { rerender } = render(<Rows n={2} />);
    rerender(<Rows n={2} />);
    const beforeinputs = added.mock.calls.filter(([type]) => type === "beforeinput").length;
    added.mockRestore();
    expect(beforeinputs).toBe(2);
    expect(refs[1]).toBe(screen.getByTestId("stake-1"));
    for (const id of ["stake-0", "stake-1"]) {
      const box = screen.getByTestId(id);
      expect(typed(box, "e")).toBe(false);
      expect(typed(box, "-")).toBe(false);
      expect(composed(box, "E")).toBe(false);
      expect(typed(box, "9")).toBe(true);
    }
    expect(onKeyDown).toHaveBeenCalledTimes(6);
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
    expect(numberFieldRefusesKey(",", true)).toBe(true);
    expect(numberFieldRefusesKey("-", true)).toBe(false);
    expect(numberFieldRefusesKey("-", false)).toBe(true);
    expect(numberFieldRefusesKey("Backspace", false)).toBe(false);
    expect(numberFieldRefusesText("-1.5", true)).toBe(false);
    expect(numberFieldRefusesText("-1.5", false)).toBe(true);
    expect(numberFieldRefusesText("1,5", true)).toBe(true);
    expect(numberFieldRefusesText("1e-7", true)).toBe(true);
  });

  it("reads pasted figures written the en-US way", () => {
    const read = (t: string) => numberFromPastedText(t, false);
    expect(read("100")).toBe("100");
    expect(read("$100")).toBe("100");
    expect(read("$1,234.56")).toBe("1234.56");
    expect(read("1,234,567")).toBe("1234567");
    expect(read("0.5 BTC")).toBe("0.5");
    expect(read(".5")).toBe(".5");
    expect(read("USD 12.75")).toBe("12.75");
    expect(read("1,234")).toBeNull();
    expect(read("1,23.4")).toBeNull();
  });

  it("reads pasted figures written the de-DE way", () => {
    const read = (t: string) => numberFromPastedText(t, false);
    expect(read("1,5")).toBe("1.5");
    expect(read("0,500")).toBe("0.500");
    expect(read("1.234,56")).toBe("1234.56");
    expect(read("1.234.567,8")).toBe("1234567.8");
    expect(read("1.234.567")).toBe("1234567");
    expect(read("2,50 \u20ac")).toBe("2.50");
    expect(read("1 234,5")).toBe("1234.5");
    expect(read("1.234,56,7")).toBeNull();
  });

  it("refuses an exponent, a stray letter, a sign the field cannot hold, or no figure", () => {
    expect(numberFromPastedText("1e5", true)).toBeNull();
    expect(numberFromPastedText("2 E 3", true)).toBeNull();
    expect(numberFromPastedText("12abc34", true)).toBeNull();
    expect(numberFromPastedText("-3", false)).toBeNull();
    expect(numberFromPastedText("\u22123.5", true)).toBe("-3.5");
    expect(numberFromPastedText("+4", false)).toBe("4");
    expect(numberFromPastedText("$", true)).toBeNull();
    expect(numberFromPastedText("", true)).toBeNull();
  });
});
