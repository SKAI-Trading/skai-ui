/**
 * canonical.mjs — the one canonical form and hash of a frame spec.
 *
 * Both functions are also pasted, as source text, into every script sync
 * generates for Figma (pack.mjs does it with Function.prototype.toString), so
 * a hash taken inside Figma and a hash of the stored file come from the same
 * code. That is why each one is self-contained: nothing from module scope, no
 * BigInt, no TextEncoder (the plugin sandbox is not guaranteed to have them),
 * and no multi-line strings (pack.mjs strips indentation and comment lines).
 */

/**
 * JSON with object keys sorted, no whitespace, and every `syncedAt` key left
 * out at any depth. Strings escape only `"`, `\` and control characters, so
 * the output does not depend on an engine's JSON.stringify. Non-finite numbers
 * and undefined array slots become null; undefined object values are dropped.
 */
export function canonicalJson(value) {
  const SAFE = /["\\\u0000-\u001f]/;
  const str = (s) => {
    if (!SAFE.test(s)) return '"' + s + '"';
    let o = '"';
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c === 34) o += '\\"';
      else if (c === 92) o += '\\\\';
      else if (c < 32) o += '\\u' + ('000' + c.toString(16)).slice(-4);
      else o += s[i];
    }
    return o + '"';
  };
  const w = (x) => {
    if (x === null || x === undefined) return 'null';
    const t = typeof x;
    if (t === 'number') return isFinite(x) ? String(x === 0 ? 0 : x) : 'null';
    if (t === 'boolean') return x ? 'true' : 'false';
    if (t === 'string') return str(x);
    if (Array.isArray(x)) {
      const a = [];
      for (let i = 0; i < x.length; i++) a.push(x[i] === undefined ? 'null' : w(x[i]));
      return '[' + a.join(',') + ']';
    }
    const keys = Object.keys(x).filter((k) => k !== 'syncedAt' && x[k] !== undefined).sort();
    const a = [];
    for (const k of keys) a.push(str(k) + ':' + w(x[k]));
    return '{' + a.join(',') + '}';
  };
  return w(value);
}

/**
 * FNV-1a 64-bit over the UTF-8 bytes of a string, as 16 lowercase hex digits.
 * The 64-bit state is four 16-bit limbs; the prime is 2^40 + 0x1b3, so a
 * multiply is limb * 0x1b3 plus the limb two places down shifted by 8 bits.
 * Every intermediate stays below 2^32, which keeps `>>>` and `&` exact.
 */
export function fnv1a64(s) {
  let h0 = 0x2325;
  let h1 = 0x8422;
  let h2 = 0x9ce4;
  let h3 = 0xcbf2;
  const step = (b) => {
    h0 ^= b;
    const t0 = h0 * 0x1b3;
    const t1 = h1 * 0x1b3 + (t0 >>> 16);
    const t2 = h2 * 0x1b3 + h0 * 0x100 + (t1 >>> 16);
    const t3 = h3 * 0x1b3 + h1 * 0x100 + (t2 >>> 16);
    h0 = t0 & 0xffff;
    h1 = t1 & 0xffff;
    h2 = t2 & 0xffff;
    h3 = t3 & 0xffff;
  };
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length) {
      const d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d < 0xe000) {
        c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00);
        i++;
      }
    }
    if (c < 0x80) step(c);
    else if (c < 0x800) {
      step(0xc0 | (c >> 6));
      step(0x80 | (c & 63));
    } else if (c < 0x10000) {
      step(0xe0 | (c >> 12));
      step(0x80 | ((c >> 6) & 63));
      step(0x80 | (c & 63));
    } else {
      step(0xf0 | (c >> 18));
      step(0x80 | ((c >> 12) & 63));
      step(0x80 | ((c >> 6) & 63));
      step(0x80 | (c & 63));
    }
  }
  const hx = (v) => ('000' + v.toString(16)).slice(-4);
  return hx(h3) + hx(h2) + hx(h1) + hx(h0);
}

/** The hash a spec's `hash` field must hold: FNV-1a 64 of the canonical tree. */
export const treeHash = (tree) => fnv1a64(canonicalJson(tree));
