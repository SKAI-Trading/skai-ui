/**
 * plugin-builder.js — the code that runs INSIDE Figma (use_figma) and turns a
 * node into a SCHEMA.md frame spec, plus the two drivers sync's scripts call.
 *
 * Nothing here is called directly by sync at run time: pack.mjs pastes the
 * source of each function into a generated script (Function.prototype.toString)
 * next to canonicalJson and fnv1a64 from canonical.mjs. So every function must
 * stand alone: no imports, no module-level names, no multi-line strings, and
 * no line that is only a comment unless dropping it is harmless (pack.mjs
 * strips those, and leading whitespace, to keep the script small).
 *
 * The self-test runs the generated script in Node against a mocked `figma`,
 * which is what proves a hash computed in Figma equals the stored spec's.
 *
 * Read-only by construction: the builder only reads node properties and calls
 * getNodeByIdAsync, getVariableByIdAsync, getStyleByIdAsync,
 * getMainComponentAsync, getStyledTextSegments and page.loadAsync.
 */

/**
 * specBuilder(figma, lib, opt) -> { record(node), hashOf(tree) }
 *
 * record() returns { node, page, name, w, h, hash, parts }, where parts[0] is
 * the frame's own tree and any further parts are subtrees cut out by the 60 KB
 * split, each replaced in its parent by { ref, h }. The frame hash is the hash
 * of parts[0].tree, and a ref carries its part's hash, so a change anywhere in
 * a split frame still changes the frame hash.
 */
export function specBuilder(figma, lib, opt) {
  const canonicalJson = lib.canonicalJson;
  const fnv1a64 = lib.fnv1a64;
  const SPLIT = (opt && opt.split) || 60000;
  const MIN_CUT = (opt && opt.minCut) || 4000;
  const MAX_TEXT = 500;
  const MAX_DEPTH = 80;
  const MIXED = figma.mixed;
  const AL = { HORIZONTAL: 'H', VERTICAL: 'V', GRID: 'G' };
  const GROUPISH = { GROUP: 1, BOOLEAN_OPERATION: 1 };
  const NO_KIDS = { VECTOR: 1, BOOLEAN_OPERATION: 1, STAR: 1 };
  const HAS_KIDS = { FRAME: 1, GROUP: 1, COMPONENT: 1, COMPONENT_SET: 1, INSTANCE: 1, SECTION: 1, TRANSFORM_GROUP: 1 };
  const CORNERS = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];
  const PADS = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
  const SIDES = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];
  const TXT = ['textStyleId', 'fontName', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fills', 'fillStyleId', 'textCase', 'textDecoration'];
  const varCache = new Map();
  const styleCache = new Map();

  // use_figma throws on a property the node's type does not have, so every
  // read that a type may lack goes through g().
  const g = (n, k) => {
    try {
      return n[k];
    } catch (e) {
      return undefined;
    }
  };
  const num = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
  const rd = (v, k) => {
    const m = Math.pow(10, k === undefined ? 2 : k);
    return Math.round(num(v) * m) / m;
  };
  const half = (v) => Math.round(num(v) * 2) / 2;
  const hex2 = (v) => {
    const s = Math.round(Math.max(0, Math.min(1, num(v))) * 255).toString(16).toUpperCase();
    return s.length < 2 ? '0' + s : s;
  };
  const hex = (c) => '#' + hex2(c && c.r) + hex2(c && c.g) + hex2(c && c.b);
  const alpha = (s, o) => (typeof o === 'number' && o < 1 ? s + '@' + rd(o) : s);
  const same = (a, b) => canonicalJson(a) === canonicalJson(b);
  const hashOf = (t) => fnv1a64(canonicalJson(t));

  const varName = (alias) => {
    const a = Array.isArray(alias) ? alias[0] : alias;
    if (!a || !a.id) return Promise.resolve(undefined);
    if (!varCache.has(a.id)) {
      varCache.set(a.id, figma.variables.getVariableByIdAsync(a.id).then((v) => (v ? v.name : a.id), () => a.id));
    }
    return varCache.get(a.id);
  };
  const getStyle = (id) => {
    if (typeof id !== 'string' || !id) return Promise.resolve(null);
    if (!styleCache.has(id)) styleCache.set(id, figma.getStyleByIdAsync(id).then((s) => s || null, () => null));
    return styleCache.get(id);
  };
  const styleName = async (id) => {
    const s = await getStyle(id);
    return s ? g(s, 'name') : id;
  };
  const bound = async (n, key, value, fmt) => {
    const bv = g(n, 'boundVariables');
    const b = bv && bv[key];
    if (b) return varName(b);
    return fmt ? fmt(value) : value;
  };

  const paint = async (p) => {
    if (!p || p.visible === false) return undefined;
    const op = typeof p.opacity === 'number' ? p.opacity : 1;
    const bv = p.boundVariables || {};
    if (p.type === 'SOLID') return alpha(bv.color ? await varName(bv.color) : hex(p.color), op);
    if (typeof p.type === 'string' && p.type.indexOf('GRADIENT_') === 0) {
      const stops = [];
      for (const s of p.gradientStops || []) {
        const sb = s.boundVariables || {};
        stops.push([rd(s.position, 3), alpha(sb.color ? await varName(sb.color) : hex(s.color), s.color && s.color.a)]);
      }
      const o = { grad: p.type.slice(9), stops };
      const m = p.gradientTransform;
      if (m && m[0] && m[1]) o.angle = rd((Math.atan2(m[1][0], m[0][0]) * 180) / Math.PI, 1);
      if (op < 1) o.op = rd(op);
      return o;
    }
    if (p.type === 'IMAGE') {
      const o = { img: p.imageHash || null, scale: p.scaleMode };
      if (op < 1) o.op = rd(op);
      return o;
    }
    if (p.type === 'VIDEO') return { video: p.videoHash || null };
    return { t: p.type };
  };
  const paints = async (list, styleId) => {
    if (typeof styleId === 'string' && styleId) return [await styleName(styleId)];
    if (!Array.isArray(list)) return undefined;
    const out = [];
    for (const p of list) {
      const v = await paint(p);
      if (v !== undefined) out.push(v);
    }
    return out.length ? out : undefined;
  };

  const effects = async (n) => {
    const sid = g(n, 'effectStyleId');
    if (typeof sid === 'string' && sid) return styleName(sid);
    const list = g(n, 'effects');
    if (!Array.isArray(list)) return undefined;
    const out = [];
    for (const e of list) {
      if (!e || e.visible === false) continue;
      const bv = e.boundVariables || {};
      const val = async (k, v) => (bv[k] ? varName(bv[k]) : rd(v));
      const o = { t: e.type };
      if (e.color) o.c = bv.color ? await varName(bv.color) : alpha(hex(e.color), e.color.a);
      if (e.offset) o.o = [await val('offsetX', e.offset.x), await val('offsetY', e.offset.y)];
      if (e.radius !== undefined || bv.radius) o.r = await val('radius', e.radius);
      if (e.spread || bv.spread) o.sp = await val('spread', e.spread);
      out.push(o);
    }
    return out.length ? out : undefined;
  };

  const radius = async (n) => {
    const cr = g(n, 'cornerRadius');
    if (cr === undefined) return undefined;
    const bv = g(n, 'boundVariables') || {};
    const anyBound = CORNERS.some((k) => bv[k]);
    if (cr !== MIXED && !anyBound) return cr ? rd(cr) : undefined;
    const v = [];
    for (const k of CORNERS) v.push(bv[k] ? await varName(bv[k]) : rd(g(n, k)));
    if (v.every((x) => x === v[0])) return v[0] === 0 ? undefined : v[0];
    return v;
  };

  const layout = async (n, parentAuto) => {
    const l = {};
    const m = AL[g(n, 'layoutMode')];
    if (m) {
      l.m = m;
      if (m === 'G') {
        const a = await bound(n, 'gridRowGap', g(n, 'gridRowGap'), rd);
        const b = await bound(n, 'gridColumnGap', g(n, 'gridColumnGap'), rd);
        if (a || b) l.g = a === b ? a : [a, b];
      } else {
        const gap = await bound(n, 'itemSpacing', g(n, 'itemSpacing'), rd);
        if (gap) l.g = gap;
      }
      const p = [];
      for (const k of PADS) p.push(await bound(n, k, g(n, k), rd));
      if (p.some((x) => x)) l.p = p;
      const ai = g(n, 'counterAxisAlignItems');
      const jc = g(n, 'primaryAxisAlignItems');
      if (ai && ai !== 'MIN') l.ai = ai;
      if (jc && jc !== 'MIN') l.jc = jc;
      if (g(n, 'layoutWrap') === 'WRAP') l.wrap = true;
    }
    if (m || parentAuto) {
      const sx = g(n, 'layoutSizingHorizontal');
      const sy = g(n, 'layoutSizingVertical');
      if (sx && sx !== 'FIXED') l.sx = sx;
      if (sy && sy !== 'FIXED') l.sy = sy;
    }
    if (parentAuto && g(n, 'layoutPositioning') === 'ABSOLUTE') l.abs = true;
    return Object.keys(l).length ? l : undefined;
  };

  const cut = (s) => {
    const t = typeof s === 'string' ? s : '';
    if (t.length <= MAX_TEXT) return t;
    let e = MAX_TEXT;
    const c = t.charCodeAt(e - 1);
    if (c >= 0xd800 && c < 0xdc00) e--;
    return t.slice(0, e) + '\u2026';
  };
  const lineHeight = (v) => (!v || v.unit === 'AUTO' ? 'auto' : v.unit === 'PERCENT' ? rd(v.value) + '%' : rd(v.value));
  const spacing = (v) => (!v ? 0 : v.unit === 'PERCENT' ? rd(v.value) + '%' : rd(v.value));

  // src is a TEXT node or one of its styled segments. A style's fields are
  // read with g() too: a style id can point at a style of another kind.
  const fontProps = async (src, bv) => {
    const o = {};
    const b = bv || {};
    const tok = (k) => (b[k] ? varName(b[k]) : Promise.resolve(undefined));
    const sid = g(src, 'textStyleId');
    const st = await getStyle(sid);
    if (st) o.st = g(st, 'name');
    else if (typeof sid === 'string' && sid) o.st = sid;
    const fn = g(src, 'fontName') || {};
    const sf = (st && g(st, 'fontName')) || {};
    const fs = g(src, 'fontSize');
    const lh = g(src, 'lineHeight');
    const ls = g(src, 'letterSpacing');
    if (!st || fn.family !== sf.family || fn.style !== sf.style || b.fontFamily || b.fontWeight) {
      o.ff = (await tok('fontFamily')) || fn.family;
      o.fw = (await tok('fontWeight')) || g(src, 'fontWeight');
    }
    if (!st || fs !== g(st, 'fontSize') || b.fontSize) o.fs = (await tok('fontSize')) || rd(fs);
    if (!st || !same(lh, g(st, 'lineHeight')) || b.lineHeight) o.lh = (await tok('lineHeight')) || lineHeight(lh);
    if (!st || !same(ls, g(st, 'letterSpacing')) || b.letterSpacing) o.ls = (await tok('letterSpacing')) || spacing(ls);
    return o;
  };
  const decor = (src, o) => {
    const tc = g(src, 'textCase');
    const td = g(src, 'textDecoration');
    if (tc && tc !== 'ORIGINAL') o.tc = tc;
    if (td && td !== 'NONE') o.td = td;
    return o;
  };
  const text = async (n) => {
    const tx = { c: cut(g(n, 'characters')) };
    const mixed = TXT.some((k) => g(n, k) === MIXED);
    if (mixed) {
      const seg = [];
      for (const s of n.getStyledTextSegments(TXT.concat(['boundVariables']))) {
        const o = Object.assign({ c: cut(s.characters) }, await fontProps(s, s.boundVariables));
        const f = await paints(s.fills, s.fillStyleId);
        if (f) o.f = f;
        seg.push(decor(s, o));
      }
      tx.seg = seg;
    } else {
      Object.assign(tx, await fontProps(n, g(n, 'boundVariables')));
      decor(n, tx);
    }
    const ta = g(n, 'textAlignHorizontal');
    if (ta && ta !== 'LEFT') tx.ta = ta;
    return tx;
  };

  const instance = async (n) => {
    const ci = {};
    let mc = null;
    try {
      mc = await n.getMainComponentAsync();
    } catch (e) {
      mc = null;
    }
    if (mc) {
      ci.k = g(mc, 'key');
      ci.n = g(mc, 'name');
      const p = g(mc, 'parent');
      if (p && g(p, 'type') === 'COMPONENT_SET') ci.set = g(p, 'name');
    }
    const cp = g(n, 'componentProperties') || {};
    const props = {};
    for (const k of Object.keys(cp).sort()) props[k.replace(/#[^#]*$/, '')] = cp[k] ? cp[k].value : null;
    if (Object.keys(props).length) ci.props = props;
    return ci;
  };

  const build = async (n, parent, isRoot, overridden, depth) => {
    const t = n.type;
    const o = { id: n.id, t, n: n.name };
    const pt = parent ? g(parent, 'type') : null;
    const gx = !isRoot && GROUPISH[pt] ? num(g(parent, 'x')) : 0;
    const gy = !isRoot && GROUPISH[pt] ? num(g(parent, 'y')) : 0;
    o.b = [isRoot ? 0 : half(num(g(n, 'x')) - gx), isRoot ? 0 : half(num(g(n, 'y')) - gy), half(g(n, 'width')), half(g(n, 'height'))];
    if (g(n, 'visible') === false) o.vis = false;
    const opv = g(n, 'opacity');
    const op = await bound(n, 'opacity', typeof opv === 'number' ? opv : 1, rd);
    if (op !== 1) o.op = op;
    const l = await layout(n, !isRoot && !!parent && !!AL[g(parent, 'layoutMode')]);
    if (l) o.l = l;
    const r = await radius(n);
    if (r !== undefined) o.r = r;
    const f = await paints(g(n, 'fills'), g(n, 'fillStyleId'));
    if (f) o.f = f;
    const s = await paints(g(n, 'strokes'), g(n, 'strokeStyleId'));
    if (s) {
      o.s = s;
      const sw = g(n, 'strokeWeight');
      if (sw === MIXED) {
        const w = [];
        for (const k of SIDES) w.push(await bound(n, k, g(n, k), rd));
        o.sw = w;
      } else o.sw = await bound(n, 'strokeWeight', sw, rd);
      const sa = g(n, 'strokeAlign');
      if (sa) o.sa = sa;
    }
    const fx = await effects(n);
    if (fx) o.fx = fx;
    if (g(n, 'clipsContent') === true) o.clip = true;
    if (t === 'TEXT') o.tx = await text(n);
    // Types that have children read them directly, so an unloaded page throws
    // (and is reported) instead of passing for an empty frame.
    let kids = NO_KIDS[t] ? null : HAS_KIDS[t] ? n.children : g(n, 'children');
    if (!Array.isArray(kids)) kids = null;
    let ids = overridden;
    if (t === 'INSTANCE') {
      o.ci = await instance(n);
      const own = (g(n, 'overrides') || []).map((x) => x.id).filter((id) => id && id !== n.id);
      if (own.length) {
        ids = new Set(overridden);
        for (const id of own) ids.add(id);
      }
      const pre = (n.id.charAt(0) === 'I' ? n.id : 'I' + n.id) + ';';
      let hit = false;
      for (const id of ids) {
        if (id.indexOf(pre) === 0) {
          hit = true;
          break;
        }
      }
      if (!hit) kids = null;
    }
    if (kids && kids.length && depth < MAX_DEPTH) {
      o.c = [];
      for (const k of kids) o.c.push(await build(k, n, false, ids, depth + 1));
    }
    return o;
  };

  const size = (t) => canonicalJson(t).length;
  const split = (t, parts) => {
    if (!t.c) return t;
    let s = size(t);
    if (s <= SPLIT) return t;
    const c = t.c.slice();
    const order = c.map((k, i) => [size(k), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    for (const pair of order) {
      if (s <= SPLIT || pair[0] < MIN_CUT) break;
      const i = pair[1];
      const sub = split(c[i], parts);
      const h = hashOf(sub);
      parts.push({ node: c[i].id, hash: h, tree: sub });
      const ref = { ref: c[i].id, h };
      s += size(ref) - pair[0];
      c[i] = ref;
    }
    return Object.assign({}, t, { c });
  };

  const pageOf = (n) => {
    let p = g(n, 'parent');
    while (p && g(p, 'type') !== 'PAGE') p = g(p, 'parent');
    return p || null;
  };

  const record = async (n) => {
    const tree = await build(n, g(n, 'parent'), true, new Set(), 0);
    const cuts = [];
    const whole = canonicalJson(tree);
    const top = whole.length <= SPLIT ? tree : split(tree, cuts);
    const hash = top === tree ? fnv1a64(whole) : hashOf(top);
    const pg = pageOf(n);
    return {
      node: n.id,
      page: pg ? g(pg, 'name') : null,
      name: n.name,
      w: half(g(n, 'width')),
      h: half(g(n, 'height')),
      hash,
      parts: [{ node: n.id, hash, tree: top }].concat(cuts),
    };
  };

  return { record, hashOf, pageOf };
}

/**
 * Load the pages a job names, then each node's own page (in case the planner's
 * page list was stale). loadAsync never switches the current page.
 * Both drivers report `ms`: [milliseconds loading the job's pages, milliseconds
 * for everything after], so the deadline can be tuned from real calls.
 */
export async function loadPages(figma, pageIds, loaded) {
  for (const id of pageIds || []) {
    if (loaded.has(id)) continue;
    loaded.add(id);
    try {
      const p = await figma.getNodeByIdAsync(id);
      if (p && typeof p.loadAsync === 'function') await p.loadAsync();
    } catch (e) {
      loaded.add('!' + id);
    }
  }
}

/**
 * The hash pass: { node: hash } for every id the job names, and nothing else.
 * Stops early at the job's deadline, or before the result would pass the job's
 * budget; ids it did not reach go back in `rest`.
 */
export async function hashDriver(figma, lib, B, job) {
  const t0 = Date.now();
  const loaded = new Set();
  await loadPages(figma, job.pages, loaded);
  const t1 = Date.now();
  const out = { v: 1, kind: 'hash', file: job.file, nonce: job.nonce, frames: {}, missing: [], errors: {}, rest: [] };
  let used = 200;
  let i = 0;
  for (; i < job.ids.length; i++) {
    if (Date.now() - t0 > job.ms) break;
    const id = job.ids[i];
    used += id.length + 22;
    if (used > job.budget) break;
    try {
      const n = await figma.getNodeByIdAsync(id);
      if (!n) {
        out.missing.push(id);
        continue;
      }
      const pg = B.pageOf(n);
      if (pg) await loadPages(figma, [pg.id], loaded);
      out.frames[id] = (await B.record(n)).hash;
    } catch (e) {
      out.errors[id] = String((e && e.message) || e).slice(0, 160);
      used += out.errors[id].length + 8;
    }
  }
  out.rest = job.ids.slice(i);
  out.ms = [t1 - t0, Date.now() - t1];
  out.sum = lib.fnv1a64(lib.canonicalJson(out));
  return out;
}

/**
 * The extract pass. Each frame goes out as one segment: its record's parts
 * flattened to a pre-order node list (a `{_p, _h}` marker opens each part,
 * every node carries its depth as `_d`), so a frame too big for one result is
 * carried across calls by offset. A frame that does not fit whole goes out as
 * a slice, and ends the result, when it is first or when at least a quarter
 * of the budget is still free; otherwise it waits in `rest`.
 * job.ids is [[id, offset, expectedHash]]: a continuation whose frame hash has
 * changed since the earlier slices restarts at 0.
 */
export async function extractDriver(figma, lib, B, job) {
  const t0 = Date.now();
  const loaded = new Set();
  await loadPages(figma, job.pages, loaded);
  const t1 = Date.now();
  const len = (x) => lib.canonicalJson(x).length + 1;
  const flat = (t, d, x) => {
    const o = {};
    for (const k of Object.keys(t)) if (k !== 'c') o[k] = t[k];
    o._d = d;
    x.push(o);
    if (t.c) for (const ch of t.c) flat(ch, d + 1, x);
  };
  const out = { v: 1, kind: 'extract', file: job.file, nonce: job.nonce, segs: [], missing: [], errors: {}, rest: [] };
  let room = job.budget - 400;
  let i = 0;
  for (; i < job.ids.length; i++) {
    if (Date.now() - t0 > job.ms || room < 1200) break;
    const id = job.ids[i][0];
    let off = job.ids[i][1] || 0;
    const want = job.ids[i][2] || null;
    let rec;
    try {
      const n = await figma.getNodeByIdAsync(id);
      if (!n) {
        out.missing.push(id);
        continue;
      }
      const pg = B.pageOf(n);
      if (pg) await loadPages(figma, [pg.id], loaded);
      rec = await B.record(n);
    } catch (e) {
      out.errors[id] = String((e && e.message) || e).slice(0, 160);
      continue;
    }
    if (want && want !== rec.hash) off = 0;
    const x = [];
    for (const p of rec.parts) {
      x.push({ _p: p.node, _h: p.hash });
      flat(p.tree, 0, x);
    }
    const seg = { f: id, H: rec.hash, pg: rec.page, n: rec.name, w: rec.w, h: rec.h, T: x.length, o: off, x: [] };
    const head = len(seg);
    let body = 0;
    for (let k = off; k < x.length; k++) body += len(x[k]);
    if (head + body > room && out.segs.length && room < job.budget / 4) break;
    room -= head;
    for (let k = off; k < x.length; k++) {
      const z = len(x[k]);
      if (z > room && seg.x.length) break;
      seg.x.push(x[k]);
      room -= z;
    }
    out.segs.push(seg);
    if (off + seg.x.length < x.length) {
      i++;
      break;
    }
  }
  out.rest = job.ids.slice(i).map((e) => e[0]);
  out.ms = [t1 - t0, Date.now() - t1];
  out.sum = lib.fnv1a64(lib.canonicalJson(out));
  return out;
}
