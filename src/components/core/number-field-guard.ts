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
 * `<input type="number">` takes the same guard by spreading
 * `numberFieldProps(...)` (inside a list) or `useNumberFieldGuard(...)`.
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

/** What the guard keeps for one field between events. */
interface FieldState {
  negative: boolean;
  /** The last key typed into the field was a decimal point (see commaRefused). */
  pointPending: boolean;
}

const fieldStates = new WeakMap<HTMLInputElement, FieldState>();

/**
 * The input-method half of the guard, a native listener: Android keyboards
 * report keys as `Unidentified`, and an input method inserts with no keydown
 * at all, so only `beforeinput` sees what they type.
 */
function onFieldBeforeInput(event: Event): void {
  const el = event.currentTarget as HTMLInputElement;
  const state = fieldStates.get(el);
  const e = event as InputEvent;
  if (!state || el.type !== "number" || !e.cancelable || !e.inputType?.startsWith("insert")) return;
  const data = e.data ?? e.dataTransfer?.getData("text") ?? "";
  if (data === "") return;
  if (data === ",") {
    if (commaRefused(el, state.pointPending)) {
      e.preventDefault();
    } else if (canInsertAtCaret()) {
      e.preventDefault();
      // Entered just after the event: an engine may refuse to edit inside it.
      queueMicrotask(() => {
        if (insertAtCaret(".")) state.pointPending = true;
      });
    }
    return;
  }
  if (numberFieldRefusesText(data, state.negative)) {
    e.preventDefault();
    return;
  }
  state.pointPending = data.endsWith(".");
}

/** The field's state, attaching the listener the first time the field is seen. */
function guardField(el: HTMLInputElement, negative: boolean): FieldState {
  let state = fieldStates.get(el);
  if (!state) {
    state = { negative, pointPending: false };
    fieldStates.set(el, state);
    el.addEventListener("beforeinput", onFieldBeforeInput);
  }
  state.negative = negative;
  return state;
}

/**
 * The handlers and ref a raw number field spreads onto its `<input>`. Not a
 * hook, so it works inside a list:
 *
 *   <input type="number" min={0} {...numberFieldProps({ min: 0 })} … />
 *
 * Key, paste and drop run after the caller's own handlers (pass them in), and a
 * caller that already called `preventDefault` has decided. Shortcuts held with
 * Ctrl, Cmd or Alt pass. The ref attaches the `beforeinput` listener once per
 * element and fills the caller's ref too.
 */
export function numberFieldProps({
  min,
  enabled = true,
  ref,
  onKeyDown,
  onPaste,
  onDrop,
}: NumberFieldGuardOptions = {}): NumberFieldGuard {
  const negative = numberFieldTakesNegative(min);
  const fieldRef = (el: HTMLInputElement | null) => {
    if (el && enabled) guardField(el, negative);
    assignRef(ref, el);
  };
  if (!enabled) return { ref: fieldRef, onKeyDown, onPaste, onDrop };
  return {
    ref: fieldRef,
    onKeyDown: (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const state = guardField(e.currentTarget, negative);
      if (e.key === ",") {
        // Refused, or entered as the point. An engine that cannot type for us
        // is left to handle the comma itself rather than lose it.
        if (commaRefused(e.currentTarget, state.pointPending)) {
          e.preventDefault();
        } else if (insertAtCaret(".")) {
          e.preventDefault();
          state.pointPending = true;
        }
        return;
      }
      if (numberFieldRefusesKey(e.key, negative)) {
        e.preventDefault();
        return;
      }
      // Any other key that types or moves the caret ends a pending point.
      state.pointPending = e.key === ".";
    },
    onPaste: (e) => {
      onPaste?.(e);
      if (e.defaultPrevented) return;
      // The field takes over every paste: the browser would drop a comma or a
      // currency sign without saying so.
      e.preventDefault();
      const number = numberFromPastedText(e.clipboardData?.getData("text") ?? "", negative);
      if (number === null) return;
      guardField(e.currentTarget, negative).pointPending = false;
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

/**
 * `numberFieldProps` with a ref that keeps its identity across renders, for a
 * component that owns one field (Input and SkaiInput use it):
 *
 *   const guard = useNumberFieldGuard({ min: 0 });
 *   <input type="number" min={0} {...guard} … />
 */
export function useNumberFieldGuard(options: NumberFieldGuardOptions = {}): NumberFieldGuard {
  const { enabled = true, min, ref: forwarded } = options;
  const props = numberFieldProps(options);
  const negative = numberFieldTakesNegative(min);
  const live = React.useRef({ enabled, negative });
  live.current = { enabled, negative };
  const element = React.useRef<HTMLInputElement | null>(null);
  // A field that becomes a number field, or whose minimum moves, after it
  // mounted is guarded on the new terms before the next event.
  React.useLayoutEffect(() => {
    if (element.current && enabled) guardField(element.current, negative);
  });
  const ref = React.useCallback(
    (el: HTMLInputElement | null) => {
      element.current = el;
      if (el && live.current.enabled) guardField(el, live.current.negative);
      assignRef(forwarded, el);
    },
    [forwarded],
  );
  return { ...props, ref };
}
