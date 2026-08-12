// Join open Figma bug counts onto catalog sections, via the route column that
// status.<section>.tsv already carries. Produces figma-catalog/hotspots.tsv:
// the catalog read as a worklist instead of an inventory.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve against the script, not the cwd — the rest of the pipeline is run
// from inside figma-catalog/, and a repo-root-relative path made this the one
// step that only worked from somewhere else.
const DIR = path.dirname(fileURLToPath(import.meta.url));

// route|count, open Figma-linked bugs, harvested 2026-08-11 from bug_reports
// where status in ('new','needs_info') and figma_link is not null.
const RAW = `/|147
/launchpad|56
/predict/all|56
/trench|44
/sports|37
/portfolio|28
/play|25
/play/scratchers|23
/play/casino|22
/spot|21
/trade/perps|21
/play/coinflip|20
/play/blackjack|11
/?tab=insightx|11
/play/mines|10
/launchpad/create|8
/play?panel=rtp|7
/swap|6
/crypto/TOADUS|6
/crypto/%24NIG|5
/crypto/BabyT|4
/predict|4
/predict/rewards|3
/play?filter=resume|3
/crypto/Regulardude|3
/crypto/MK|3
/play/plinko|3
/?tab=whale|2
/crypto/FOMOBULL|2
/crypto/SAMECAT|2
/play/dice|2
/?tab=market&view=signals|1
/crypto/BabyAsteroid|1
/swap?tab=bridge|1
/swap?tab=limit|1
/account|1
/trade/perps?side=long|1
/trade/perps?side=short|1
/?tab=backtest|1`;

// A reported url carries query strings and dynamic segments; a catalog route is
// a pattern. Normalise both to a comparable path.
const norm = (r) => r.split(/[?#]/)[0].replace(/\/+$/, "") || "/";

const bugs = new Map();
for (const line of RAW.split("\n")) {
  const [route, n] = line.split("|");
  const k = norm(route);
  bugs.set(k, (bugs.get(k) || 0) + Number(n));
}

// section -> set of routes it claims, from status.<section>.tsv column 4
const sectionRoutes = new Map();
for (const f of fs.readdirSync(DIR)) {
  const m = /^status\.(.+)\.tsv$/.exec(f);
  if (!m) continue;
  const section = m[1];
  const set = new Set();
  for (const line of fs.readFileSync(path.join(DIR, f), "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.startsWith("#")) continue;
    const col = line.split("\t");
    const route = (col[3] || "").trim();
    if (!route || !route.startsWith("/")) continue;
    // a cell can list several routes
    for (const r of route.split(/[,\s]+/)) if (r.startsWith("/")) set.add(norm(r));
  }
  if (set.size) sectionRoutes.set(section, set);
}

const reg = JSON.parse(fs.readFileSync(path.join(DIR, "registry.json"), "utf8"));
const bySection = reg.stats.bySection;

// A catalog route is a PATTERN (/crypto/:symbol, /predict/market/:id), a reported
// url is concrete (/crypto/TOADUS). Compare segment by segment so a :param eats
// exactly one segment — a literal prefix test silently drops every dynamic route,
// which is how 26 /crypto/* bugs first came back unmatched.
const segs = (r) => (r === "/" ? [] : r.replace(/^\//, "").split("/"));
const matchLen = (pattern, route) => {
  // "/" is NOT a prefix of everything. It has zero segments, so a naive
  // prefix test makes it a catch-all that quietly absorbs every unclaimed
  // route — which is exactly what happened: /launchpad and /sports got
  // attributed to `trade` and the coverage gap vanished behind a 603/603
  // "match". A root claim matches the root and nothing else.
  if (pattern === "/") return route === "/" ? 0 : -1;
  const p = segs(pattern), r = segs(route);
  if (p.length > r.length) return -1;              // pattern deeper than the url
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) continue;             // :param matches any one segment
    if (p[i] !== r[i]) return -1;
  }
  return p.length;                                  // specificity = segments matched
};

const claimed = new Map();
const ties = [];
const unmatched = [];
for (const [route, n] of bugs) {
  let bestLen = -1, winners = [];
  for (const [section, routes] of sectionRoutes) {
    for (const sr of routes) {
      const len = matchLen(sr, route);
      if (len < 0) continue;
      if (len > bestLen) { bestLen = len; winners = [section]; }
      else if (len === bestLen && !winners.includes(section)) winners.push(section);
    }
  }
  if (!winners.length) { unmatched.push(`${route} (${n})`); continue; }
  // Four sections claim "/". Crediting those bugs to whichever has the most
  // frames would put 162 reports against `trade` and make it look like the
  // dominant hotspot on evidence that does not support it. Hold them out.
  if (route === "/" && winners.length > 1) continue;
  // Equal specificity: attribute to the section that actually owns the surface —
  // the one with the most frames — and record the tie rather than hiding it.
  // Without this a 24-frame cover-art section outbids the 345-frame Play section
  // for /play purely on map iteration order.
  const ranked = winners.sort((a, b) => (bySection[b]?.frames || 0) - (bySection[a]?.frames || 0));
  const winner = ranked[0];
  if (winners.length > 1) {
    ties.push(`${route} (${n}) -> ${winner}  [also claimed by: ${ranked.slice(1).join(", ")}]`);
  }
  claimed.set(winner, (claimed.get(winner) || 0) + n);
}
// Ambiguity at the ROOT is a data problem, not a tie to be broken. Several
// sections list "/" as their route, so 147 bugs cannot be honestly assigned to
// any of them by counting frames. Surface it instead of picking.
const rootClaimants = [...sectionRoutes].filter(([, r]) => r.has("/")).map(([s]) => s);

const rows = [...claimed.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([s, n]) => {
    const st = bySection[s] || {};
    return [n, s, st.frames ?? 0, [...(sectionRoutes.get(s) || [])].sort().join(" ")].join("\t");
  });

const totalBugs = [...bugs.values()].reduce((a, b) => a + b, 0);
const matched = [...claimed.values()].reduce((a, b) => a + b, 0);

const header = `#\tOpen Figma bugs per catalog section, joined on the route column of
#\tstatus.<section>.tsv. Bug data: ${totalBugs} open reports (status new/needs_info,
#\tfigma_link set), harvested 2026-08-11.
#
#\tMatched ${matched}/${totalBugs}. A bug route is matched to the MOST SPECIFIC section
#\troute that prefixes it, so /play/scratchers lands on scratchers, not /play.
#
#\tUNMATCHED — NO catalog section claims these routes, so these bugs land on a
#\tsurface the catalog cannot describe. Each one is a coverage gap:
${unmatched.map((u) => "#\t  " + u).join("\n")}
#
#\tTIES — several sections claim the same route at equal specificity; attributed
#\tto the section with the most frames:
${(ties.length ? ties : ["(none)"]).map((u) => "#\t  " + u).join("\n")}
#
#\tROOT AMBIGUITY — ${rootClaimants.length} sections list "/" as their route
#\t(${rootClaimants.join(", ")}), so the ${bugs.get("/") || 0} bugs reported on "/" cannot be
#\thonestly attributed to one of them. Fix the route column, do not break the tie.
#
open_bugs\tsection\tframes\troutes`;

fs.writeFileSync(path.join(DIR, "hotspots.tsv"), header + "\n" + rows.join("\n") + "\n");
console.log(header.split("\n").slice(0, 6).join("\n"));
console.log("---");
console.log(rows.join("\n"));
console.log("---\nunmatched:", unmatched.join(", ") || "none");
