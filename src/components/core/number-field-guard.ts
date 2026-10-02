import * as React from "react";

/**
 * What a `type="number"` field will take from the keyboard, a paste, a drop or
 * an input method.
 *
 * Browsers let a number field hold `e`, `E`, `+` and `-` because they spell an
 * exponent ("1e5"), and Firefox lets it hold any letter at all. A controlled
 * `value` cannot keep them out: while the box reads "e" its value is the empty
 * string, so no change event fires and the letter stays on screen (report
 * 664eb181, an "e" in the spot ticket's Amount box).
 *
 * The comma is worse than a letter. Chromium and WebKit drop a typed comma
 * without a word, so "1,5" typed by someone whose decimal mark is a comma
 * reads 15, ten times what they meant, and a pasted "1.234,56" reads 1.23456.
 * So a typed comma is entered as the decimal point, and pasted text is read as
 * a number first and inserted only when it reads one way.
 *
 * `Input` and `SkaiInput` apply this to every `type="number"` field. A raw
 * `<input type="number">` takes the same guard through `useNumberFieldGuard`.
 */

type InputMin = React.InputHTMLAttributes<HTMLInputElement>["min"];

/** A field whose `min` is zero or more has no use for a minus sign. */
export function numberFieldTakesNegative(min: InputMin): boolean {
  if (min === undefined || min === null || min === "") return true;
  const floor = Number(min);
  return !(Number.isFinite(floor) && floor >= 0);
}

/**
 * True when a keystroke must not reach a number field as typed. Keys that do
 * not type a character (Backspace, the arrows, Tab, Enter) pass. The comma is
 * refused as typed because the field is given a decimal point in its place.
 */
export function numberFieldRefusesKey(key: string, negative: boolean): boolean {
  if (key.length !== 1) return false;
  if (/[0-9.]/.test(key)) return false;
  return !(key === "-" && negative);
}

/** True when text inserted in one go (an input method, a drop) is not a plain decimal. */
export function numberFieldRefusesText(text: string, negative: boolean): boolean {
  return (negative ? /[^0-9.-]/ : /[^0-9.]/).test(text);
}

const GROUP_SPACES = /[\s\u00a0\u202f']/g;

/**
 * Pasted text as the number it states, in the field's own spelling (digits, at
 * most one decimal point, a leading minus where the field takes one), or null
 * when it does not state exactly one number.
 *
 * Currency signs, units and spaces around the figure are dropped ("$100",
 * "0.5 BTC"). Grouping is read both ways: with both marks present the later
 * one is the decimal ("1,234.56", "1.234,56"); a lone comma is the decimal
 * unless it is followed by exactly three digits, where "1,234" could be either
 * and is refused; a lone point is the decimal, as the field itself reads it;
 * repeated marks are grouping and must sit every three digits. An exponent,
 * letters inside the figure, or two figures are refused rather than guessed at.
 */
export function numberFromPastedText(text: string, negative: boolean): string | null {
  let s = text.replace(/[\u2212\u2012\u2013]/g, "-").trim();
  if (/\d\s*[eE]\s*[+-]?\s*\d/.test(s)) return null;
  // Strip what stands before the sign or the first digit, and after the last digit.
  s = s.replace(/^[^\d.,+-]+/, "").replace(/[^\d]+$/, "");
  let sign = "";
  if (/^[+-]/.test(s)) {
    sign = s[0] === "-" ? "-" : "";
    s = s.slice(1).replace(/^[^\d.,]+/, "");
  }
  if (!/^[\d.,\s\u00a0\u202f']+$/.test(s) || !/\d/.test(s)) return null;
  if (sign === "-" && !negative) return null;

  const dots = (s.match(/\./g) ?? []).length;
  const commas = (s.match(/,/g) ?? []).length;
  let decimal: "." | "," | null = null;
  if (dots && commas) {
    decimal = s.lastIndexOf(".") > s.lastIndexOf(",") ? "." : ",";
    if ((decimal === "." ? dots : commas) !== 1) return null;
  } else if (commas === 1) {
    const [before, after] = s.split(",");
    if (/^[1-9]\d{0,2}$/.test(before.replace(GROUP_SPACES, "")) && /^\d{3}$/.test(after)) return null;
    decimal = ",";
  } else if (dots === 1) {
    decimal = ".";
  }

  const at = decimal === null ? -1 : s.lastIndexOf(decimal);
  const whole = at === -1 ? s : s.slice(0, at);
  const fraction = at === -1 ? null : s.slice(at + 1);
  const groups = whole.split(/[.,\s\u00a0\u202f']/);
  if (groups.length > 1) {
    if (!/^\d{1,3}$/.test(groups[0]) || groups.slice(1).some((g) => !/^\d{3}$/.test(g))) return null;
  } else if (!/^\d*$/.test(whole)) {
    return null;
  }
  if (fraction !== null && !/^\d*$/.test(fraction)) return null;
  const intPart = groups.join("");
  if (!intPart && !fraction) return null;
  return `${sign}${intPart}${fraction !== null ? `.${fraction}` : ""}`;
}

/** Whether this engine can type text at the caret for us. */
function canInsertAtCaret(): boolean {
  return typeof document !== "undefined" && typeof document.execCommand === "function";
}

/** Type `text` at the caret, the way the keyboard would, so undo and onChange both see it. */
function insertAtCaret(text: string): boolean {
  if (!canInsertAtCaret()) return false;
  try {
    return document.execCommand("insertText", false, text);
  } catch {
    return false;
  }
}

/** Replace the whole value and tell React, for an engine with no `insertText`. */
function replaceValue(el: HTMLInputElement, text: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) setter.call(el, text);
  else el.value = text;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Whether a comma typed now must be refused rather than entered as the decimal
 * point: the field already has one, or its text cannot be read at all.
 *
 * The value can only show a point that has digits after it: "1." reads "1" in
 * Chromium and in an en-US WebKit, and "" in a de-DE one. So `pointPending`
 * carries what the value cannot, that the last thing typed was a point.
 */
function commaRefused(el: HTMLInputElement, pointPending: boolean): boolean {
  if (pointPending || el.value.includes(".")) return true;
  return el.value === "" && Boolean(el.validity?.badInput);
}

type GuardedHandlers = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onKeyDown" | "onPaste" | "onDrop"
>;

export interface NumberFieldGuardOptions extends GuardedHandlers {
  /** The field's `min`; a minimum of zero or more refuses the minus sign. */
  min?: InputMin;
  /** Off for any field that is not `type="number"`. Default on. */
  enabled?: boolean;
  /** The caller's own ref, which the guard's ref callback also fills. */
  ref?: React.Ref<HTMLInputElement>;
}

export interface NumberFieldGuard extends GuardedHandlers {
  ref: React.RefCallback<HTMLInputElement>;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
}

/**
 * The handlers and ref a number field spreads onto its `<input>`:
 *
 *   const guard = useNumberFieldGuard({ min: 0 });
 *   <input type="number" min={0} {...guard} … />
 *
 * Key, paste and drop run after the caller's own handlers (pass them in), and a
 * caller that already called `preventDefault` has decided. Shortcuts held with
 * Ctrl, Cmd or Alt pass. A native `beforeinput` listener covers what arrives
 * with no usable keydown: Android keyboards report `Unidentified`, and input
 * methods insert without one.
 */
export function useNumberFieldGuard({
  min,
  enabled = true,
  ref,
  onKeyDown,
  onPaste,
  onDrop,
}: NumberFieldGuardOptions = {}): NumberFieldGuard {
  const negative = numberFieldTakesNegative(min);
  const live = React.useRef({ enabled, negative });
  live.current = { enabled, negative };

  const attached = React.useRef<HTMLInputElement | null>(null);
  /** The last key typed into the field was a decimal point (see commaRefused). */
  const pointPending = React.useRef(false);
  const onBeforeInput = React.useRef((event: Event) => {
    const { enabled: on, negative: neg } = live.current;
    const e = event as InputEvent;
    if (!on || !e.cancelable || !e.inputType?.startsWith("insert")) return;
    const el = e.target as HTMLInputElement;
    const data = e.data ?? e.dataTransfer?.getData("text") ?? "";
    if (data === "") return;
    if (data === ",") {
      if (commaRefused(el, pointPending.current)) {
        e.preventDefault();
      } else if (canInsertAtCaret()) {
        e.preventDefault();
        // Entered just after the event: an engine may refuse to edit inside it.
        queueMicrotask(() => {
          if (insertAtCaret(".")) pointPending.current = true;
        });
      }
      return;
    }
    if (numberFieldRefusesText(data, neg)) {
      e.preventDefault();
      return;
    }
    pointPending.current = data.endsWith(".");
  }).current;

  const refCallback = React.useCallback(
    (el: HTMLInputElement | null) => {
      if (attached.current && attached.current !== el) {
        attached.current.removeEventListener("beforeinput", onBeforeInput);
      }
      if (el && attached.current !== el) el.addEventListener("beforeinput", onBeforeInput);
      attached.current = el;
      assignRef(ref, el);
    },
    [ref, onBeforeInput],
  );

  if (!enabled) return { ref: refCallback, onKeyDown, onPaste, onDrop };
  return {
    ref: refCallback,
    onKeyDown: (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ",") {
        // Refused, or entered as the point. An engine that cannot type for us
        // is left to handle the comma itself rather than lose it.
        if (commaRefused(e.currentTarget, pointPending.current)) {
          e.preventDefault();
        } else if (insertAtCaret(".")) {
          e.preventDefault();
          pointPending.current = true;
        }
        return;
      }
      if (numberFieldRefusesKey(e.key, negative)) {
        e.preventDefault();
        return;
      }
      // Any other key that types or moves the caret ends a pending point.
      pointPending.current = e.key === ".";
    },
    onPaste: (e) => {
      onPaste?.(e);
      if (e.defaultPrevented) return;
      // The field takes over every paste: the browser would drop a comma or a
      // currency sign without saying so.
      e.preventDefault();
      const number = numberFromPastedText(e.clipboardData?.getData("text") ?? "", negative);
      if (number === null) return;
      pointPending.current = false;
      if (!insertAtCaret(number)) replaceValue(e.currentTarget, number);
    },
    onDrop: (e) => {
      onDrop?.(e);
      if (e.defaultPrevented) return;
      const text = (e.dataTransfer?.getData("text") ?? "").trim();
      // A drop lands where the pointer is, so only a figure that needs no
      // reading is let through as it is.
      if (numberFieldRefusesText(text, negative)) e.preventDefault();
    },
  };
}
