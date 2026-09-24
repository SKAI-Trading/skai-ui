// Prints a stored frame spec (figma/SCHEMA.md, "Node") as text: an indented tree, one node per line, or one line
// per text node. Pure: every file this needs comes in through makeTokens() and the loadRef() callback.

const HEX = /^#[0-9a-f]{3,8}$/i;
const OPACITY = /^\d*\.?\d+$/;
const TYPO_KEYS = ["ff", "fs", "fw", "lh", "ls", "tc", "td"];
const EFFECT_KIND = {
  DROP_SHADOW: "drop-shadow",
  INNER_SHADOW: "inner-shadow",
  LAYER_BLUR: "layer-blur",
  BACKGROUND_BLUR: "bg-blur",
};

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isRef = (node) => isObj(node) && node.ref != null && node.t == null;
const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

export function num(v) {
  if (typeof v !== "number") return String(v);
  return String(Number.isInteger(v) ? v : Math.round(v * 100) / 100);
}

// A token file may carry { v, syncedAt, <payload> } or be the bare map; accept both.
function payload(file, key) {
  if (!isObj(file)) return null;
  return isObj(file[key]) ? file[key] : file;
}

// paintStyles is tokens/paint-styles.json: a colour style is also a name a fill can cite.
export function makeTokens({ variables = null, textStyles = null, effectStyles = null, paintStyles = null } = {}) {
  const vars = payload(variables, "variables");
  const text = payload(textStyles, "styles");
  const effects = payload(effectStyles, "styles");
  const paintsByName = payload(paintStyles, "styles");

  // variables.json keys a name that is not unique across collections as "<collection>/<name>",
  // while a spec may cite the bare name. Index the bare form so both resolve.
  const byBareName = new Map();
  for (const [key, def] of Object.entries(vars ?? {})) {
    if (!isObj(def) || typeof def.collection !== "string") continue;
    const prefix = `${def.collection}/`;
    if (!key.startsWith(prefix)) continue;
    const bare = key.slice(prefix.length);
    byBareName.set(bare, [...(byBareName.get(bare) ?? []), def]);
  }

  function variable(name) {
    if (!vars) return {};
    if (isObj(vars[name])) return { def: vars[name] };
    const hits = byBareName.get(name) ?? [];
    if (hits.length === 1) return { def: hits[0] };
    if (hits.length > 1) return { ambiguous: hits.length };
    return {};
  }

  function scalar(v, depth) {
    if (isObj(v) && typeof v.alias === "string") {
      const hit = depth < 8 ? variable(v.alias) : {};
      return hit.def ? `→ ${v.alias} ${valueOf(hit.def, depth + 1)}` : `→ ${v.alias} ?`;
    }
    if (typeof v === "number") return num(v);
    if (typeof v === "string" || typeof v === "boolean") return String(v);
    return JSON.stringify(v);
  }

  function valueOf(def, depth = 0) {
    const modes = Object.entries(isObj(def.modes) ? def.modes : {});
    if (!modes.length) return "?";
    const shown = modes.map(([mode, v]) => [mode, scalar(v, depth)]);
    if (new Set(shown.map(([, s]) => s)).size === 1) return shown[0][1];
    return shown.map(([mode, s]) => `${mode} ${s}`).join(" | ");
  }

  return {
    hasVariables: !!vars,
    hasTextStyles: !!text,
    hasEffectStyles: !!effects,
    variable,
    valueOf,
    textStyle: (name) => (text && isObj(text[name]) ? text[name] : null),
    effectStyle: (name) => (effects && isObj(effects[name]) ? effects[name] : null),
    paintStyle: (name) => (paintsByName && isObj(paintsByName[name]) ? paintsByName[name] : null),
  };
}

// loadRef(id) returns { tree, path } for a split-out child spec, or null when it is not stored.
export function createRenderer({ tokens = makeTokens(), loadRef = (_id) => null } = {}) {
  const stats = { nodes: 0, text: 0, hidden: 0, raw: 0, unresolved: 0, refs: 0, refsMissing: [], cut: 0 };

  const raw = (s) => {
    stats.raw++;
    return `${s} (raw)`;
  };

  // `def` is true while printing a style's own definition: its literals are the style, not a skipped token.
  function token(name, def = false) {
    let base = name;
    const at = name.lastIndexOf("@");
    if (at > 0 && OPACITY.test(name.slice(at + 1))) base = name.slice(0, at);
    if (HEX.test(base)) return def ? name : raw(name);
    const hit = tokens.variable(base);
    if (hit.def) return `${name} (${tokens.valueOf(hit.def)})`;
    if (hit.ambiguous) return `${name} (in ${hit.ambiguous} collections)`;
    const style = tokens.paintStyle(base);
    if (style) return `${name} (${paints(style.paints, true)})`;
    if (!tokens.hasVariables) return name;
    if (!def) stats.unresolved++;
    return `${name} (?)`;
  }

  function value(v, def = false) {
    if (v == null) return "?";
    if (typeof v === "number") return v === 0 || def ? num(v) : raw(num(v));
    if (typeof v === "string") return v === "auto" ? v : token(v, def);
    if (isObj(v) && typeof v.alias === "string") return token(v.alias, def);
    return JSON.stringify(v);
  }

  // A number that is never tokenised in practice (stroke weight, blur radius): plain, unless it is a token name.
  const plain = (v) => (typeof v === "string" ? token(v) : num(v));

  // Numbers only: print them together and mark the group once. Anything else: value by value.
  function list(vals) {
    if (vals.every((v) => typeof v === "number")) {
      const s = vals.map(num).join(" ");
      return vals.some((v) => v !== 0) ? raw(s) : s;
    }
    return vals.map((v) => value(v)).join(" ");
  }

  function padding(p) {
    if (!Array.isArray(p)) return value(p);
    const [t, r, b, l] = p;
    if (t === r && t === b && t === l) return list([t]);
    if (t === b && r === l) return list([t, r]);
    return list([t, r, b, l]);
  }

  function radius(r) {
    if (!Array.isArray(r)) return value(r);
    return r.every((x) => x === r[0]) ? list([r[0]]) : list(r);
  }

  function layout(l) {
    const out = [];
    if (l.m) {
      out.push(l.m);
      if (l.g != null && l.g !== 0) out.push(`gap ${value(l.g)}`);
      if (l.p != null) {
        const pad = padding(l.p);
        if (pad !== "0") out.push(`pad ${pad}`);
      }
      if (l.ai && l.ai !== "MIN") out.push(`ai ${l.ai}`);
      if (l.jc && l.jc !== "MIN") out.push(`jc ${l.jc}`);
      if (l.wrap) out.push("wrap");
    }
    if (l.sx && l.sx !== "FIXED") out.push(`w ${l.sx}`);
    if (l.sy && l.sy !== "FIXED") out.push(`h ${l.sy}`);
    if (l.abs) out.push("abs");
    return out.join(" ");
  }

  function paint(p, def = false) {
    if (typeof p === "string") return value(p, def);
    if (!isObj(p)) return JSON.stringify(p);
    if (p.grad) {
      const stops = asList(p.stops).map((s) => (Array.isArray(s) ? `${num(s[0])} ${paint(s[1], def)}` : JSON.stringify(s)));
      const angle = p.angle != null ? ` ${num(p.angle)}°` : "";
      return `${String(p.grad).toLowerCase()} gradient${angle} [${stops.join(", ")}]`;
    }
    if (p.img) return `image ${p.img}${p.scale ? ` ${p.scale}` : ""}`;
    if (p.video) return `video ${p.video}`;
    return JSON.stringify(p);
  }

  const paints = (list, def = false) => asList(list).map((p) => paint(p, def)).join(", ");

  function effect(e, def = false) {
    if (!isObj(e)) return JSON.stringify(e);
    const out = [EFFECT_KIND[e.t] ?? String(e.t)];
    if (Array.isArray(e.o)) out.push(`${num(e.o[0])},${num(e.o[1])}`);
    else if (isObj(e.o)) out.push(`${num(e.o.x)},${num(e.o.y)}`);
    if (e.r != null) out.push(`blur ${plain(e.r)}`);
    if (e.sp) out.push(`spread ${plain(e.sp)}`);
    if (e.c != null) out.push(paint(e.c, def));
    return out.join(" ");
  }

  function effects(fx) {
    if (typeof fx !== "string") return asList(fx).map((e) => effect(e)).join("; ");
    if (!tokens.hasEffectStyles) return fx;
    const style = tokens.effectStyle(fx);
    if (!style) {
      stats.unresolved++;
      return `${fx} (?)`;
    }
    return `${fx} (${asList(style.effects).map((e) => effect(e, true)).join("; ")})`;
  }

  // fs, lh and ls are numbers unless bound, so a string there is a variable name. ff and fw are strings either
  // way ("Manrope", "Bold"), so they count as a variable only when variables.json holds that name.
  const isVar = (v) => tokens.hasVariables && !!tokens.variable(v).def;
  const metric = (v, def) => (typeof v === "number" ? num(v) : v === "auto" ? "auto" : token(String(v), def));
  const word = (v, def) => (typeof v === "string" && !def && isVar(v) ? token(v) : num(v));

  function letterSpacing(ls) {
    if (isObj(ls)) return `${num(ls.value)}${ls.unit === "PERCENT" ? "%" : "px"}`;
    return typeof ls === "number" ? num(ls) : String(ls);
  }

  const zeroLs = (ls) => ls === 0 || (isObj(ls) && ls.value === 0);

  function show(k, v, def) {
    if (k === "ls") return letterSpacing(v);
    if (k === "tc" || k === "td") return String(v);
    return k === "ff" || k === "fw" ? word(v, def) : metric(v, def);
  }

  function typo(t, def) {
    const out = [];
    if (t.ff != null) out.push(show("ff", t.ff, def));
    if (t.fs != null) out.push(t.lh != null ? `${metric(t.fs, def)}/${metric(t.lh, def)}` : metric(t.fs, def));
    else if (t.lh != null) out.push(`lh ${metric(t.lh, def)}`);
    if (t.fw != null) out.push(`w${show("fw", t.fw, def)}`);
    if (t.ls != null && !zeroLs(t.ls)) out.push(`ls ${letterSpacing(t.ls)}`);
    if (t.tc && t.tc !== "ORIGINAL") out.push(t.tc);
    if (t.td && t.td !== "NONE") out.push(t.td);
    return out.join(" ");
  }

  // True when any typographic value is written as a literal rather than a variable name.
  function hasLiteral(t) {
    for (const k of ["ff", "fs", "fw", "lh", "ls"]) {
      const v = t[k];
      if (v == null || v === "auto") continue;
      if (typeof v !== "string") return true;
      if ((k === "ff" || k === "fw") && !isVar(v)) return true;
    }
    return false;
  }

  function textStyle(name) {
    if (!tokens.hasTextStyles) return name;
    const style = tokens.textStyle(name);
    if (!style) {
      stats.unresolved++;
      return `${name} (?)`;
    }
    return `${name} (${typo(style, true)})`;
  }

  function typeParts(t) {
    const own = {};
    for (const k of TYPO_KEYS) if (t[k] != null) own[k] = t[k];
    if (!Object.keys(own).length) return t.st ? [textStyle(t.st)] : [];
    if (!t.st) {
      const s = typo(own, false);
      return [hasLiteral(own) ? raw(s) : s];
    }
    // Overrides on top of a style are labelled, since "+ 16" alone does not say which property moved.
    const s = `+ ${Object.entries(own).map(([k, v]) => `${k} ${show(k, v, false)}`).join(" ")}`;
    return [textStyle(t.st), hasLiteral(own) ? raw(s) : s];
  }

  function textPart(tx) {
    const out = [JSON.stringify(tx.c ?? "")];
    if (Array.isArray(tx.seg) && tx.seg.length) out.push(`mixed ×${tx.seg.length}`);
    out.push(...typeParts(tx));
    if (tx.ta && tx.ta !== "LEFT") out.push(`align ${tx.ta}`);
    return out.join(" ");
  }

  function segLine(seg) {
    const head = [JSON.stringify(seg.c ?? ""), ...typeParts(seg)].join(" ");
    return seg.f != null ? `${head} · fill ${paints(seg.f)}` : head;
  }

  function instance(ci) {
    const name = ci.set ?? ci.n ?? "?";
    const props = isObj(ci.props)
      ? Object.entries(ci.props).map(([k, v]) => `${k.replace(/#.*$/, "")}=${isObj(v) && "value" in v ? v.value : v}`)
      : [];
    if (props.length) return `inst ${name} {${props.join(", ")}}`;
    return ci.set && ci.n ? `inst ${name} (${ci.n})` : `inst ${name}`;
  }

  function nodeLine(n) {
    const b = Array.isArray(n.b) ? `${num(n.b[0])} ${num(n.b[1])} ${num(n.b[2])}×${num(n.b[3])}` : "?";
    const parts = [`${n.t ?? "?"} ${JSON.stringify(n.n ?? "")} ${n.id ?? "?"} [${b}]`];
    if (n.vis === false) parts.push("hidden");
    if (n.op != null && n.op !== 1) parts.push(`op ${num(n.op)}`);
    if (isObj(n.tx)) parts.push(textPart(n.tx));
    if (isObj(n.ci)) parts.push(instance(n.ci));
    if (isObj(n.l)) {
      const l = layout(n.l);
      if (l) parts.push(l);
    }
    if (n.r != null && n.r !== 0) parts.push(`r ${radius(n.r)}`);
    if (asList(n.f).length) parts.push(`fill ${paints(n.f)}`);
    if (asList(n.s).length) {
      const weight = n.sw != null ? ` ${Array.isArray(n.sw) ? n.sw.map(plain).join(" ") : plain(n.sw)}` : "";
      parts.push(`stroke ${paints(n.s)}${weight}${n.sa ? ` ${n.sa}` : ""}`);
    }
    if (n.fx != null && asList(n.fx).length) parts.push(`fx ${effects(n.fx)}`);
    if (n.clip) parts.push("clip");
    return parts.join(" · ");
  }

  // Walks the tree, inlining {ref} children from their own spec files. visit(node, level, parents, note)
  // gets every real node; missing(ref, level) every ref that is not stored.
  function walk(root, depth, visit, missing) {
    const seen = new Set();
    const step = (node, level, parents) => {
      let note = "";
      if (isRef(node)) {
        const id = String(node.ref);
        const got = seen.has(id) ? null : loadRef(id);
        if (!got || !isObj(got.tree)) {
          missing(id, level, seen.has(id));
          return;
        }
        seen.add(id);
        node = got.tree;
        note = ` · ref ${got.path}`;
      }
      if (!isObj(node)) return;
      const kids = asList(node.c);
      const cut = kids.length > 0 && level >= depth;
      visit(node, level, parents, note, cut ? kids.length : 0);
      if (cut) return;
      for (const kid of kids) step(kid, level + 1, [...parents, node]);
    };
    step(root, 0, []);
  }

  function count(node, cut, note) {
    stats.nodes++;
    if (note) stats.refs++;
    if (isObj(node.tx)) stats.text++;
    if (node.vis === false) stats.hidden++;
    if (cut) stats.cut += cut;
  }

  function tree(root, { depth = Infinity } = {}) {
    const lines = [];
    walk(
      root,
      depth,
      (node, level, _parents, note, cut) => {
        count(node, cut, note);
        const pad = "  ".repeat(level);
        lines.push(`${pad}${nodeLine(node)}${note}${cut ? ` · +${cut} children` : ""}`);
        if (isObj(node.tx) && Array.isArray(node.tx.seg)) {
          for (const seg of node.tx.seg) lines.push(`${pad}  ~ ${segLine(seg)}`);
        }
      },
      (id, level, cycle) => {
        stats.refsMissing.push(id);
        const why = cycle ? "repeats an ancestor (cycle)" : "not stored: this subtree is missing from the spec";
        lines.push(`${"  ".repeat(level)}REF ${id} ${why}`);
      },
    );
    return lines;
  }

  function flat(root, { depth = Infinity } = {}) {
    const lines = [];
    walk(
      root,
      depth,
      (node, _level, parents, note, cut) => {
        count(node, cut, note);
        if (!isObj(node.tx)) return;
        const parts = [JSON.stringify(node.tx.c ?? ""), ...typeParts(node.tx)];
        const line = [parts.join(" ")];
        if (asList(node.f).length) line.push(`fill ${paints(node.f)}`);
        line.push(node.id ?? "?");
        const trail = parents.slice(1).map((p) => p.n ?? "?");
        if (trail.length) line.push(trail.join(" > "));
        if (node.vis === false || parents.some((p) => p.vis === false)) line.push("hidden");
        lines.push(line.join(" · "));
      },
      (id) => {
        stats.refsMissing.push(id);
        lines.push(`REF ${id} not stored: its text is missing from this list`);
      },
    );
    return lines;
  }

  function find(root, id) {
    let hit = null;
    walk(
      root,
      Infinity,
      (node) => {
        if (!hit && node.id === id) hit = node;
      },
      () => {},
    );
    return hit;
  }

  return { tree, flat, find, stats };
}
