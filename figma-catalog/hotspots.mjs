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

// section -> set of routes it owns, from routes.tsv.
//
// This deliberately does NOT infer ownership from the `route` column of
// status.<section>.tsv. That column is per-family detail ("/ -> openModal(...)")
// and inferring section ownership from it was wrong twice over: four sections
// looked like they claimed "/" (it is the root of three different deployed
// apps), and /launchpad + /sports looked unowned despite being catalogued.
//
// Bug reports carry a url from the MAIN app, so only app=main rows can match.
const sectionRoutes = new Map();
const APP = "main";
for (const line of fs.readFileSync(path.join(DIR, "routes.tsv"), "utf8").split(/\r?\n/)) {
  if (!line.trim() || line.startsWith("#") || line.startsWith("app\t")) continue;
  const [app, section, route] = line.split("\t").map((s) => (s || "").trim());
  if (app !== APP || !route.startsWith("/")) continue;
  if (!sectionRoutes.has(section)) sectionRoutes.set(section, new Set());
  sectionRoutes.get(section).add(norm(route));
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
const rootClaimants = [...sectionRoutes].filter(([, r]) => r.has("/")).map(([s]) => s);

const rows = [...claimed.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([s, n]) => {
    const st = bySection[s] || {};
    return [n, s, st.frames ?? 0, [...(sectionRoutes.get(s) || [])].sort().join(" ")].join("\t");
  });

const totalBugs = [...bugs.values()].reduce((a, b) => a + b, 0);
const matched = [...claimed.values()].reduce((a, b) => a + b, 0);

const header = `#\tOpen Figma bugs per catalog section, joined through routes.tsv (app=main).
#\tBug data: ${totalBugs} open reports (status new/needs_info, figma_link set),
#\tharvested 2026-08-11. Regenerate with: node hotspots.mjs
#
#\tMatched ${matched}/${totalBugs}. A bug route matches the MOST SPECIFIC owning route,
#\tso /play/scratchers lands on skratch rather than play, and a :param segment
#\tmatches exactly one url segment so /crypto/TOADUS lands on /crypto/:symbol.
#
#\tA previous version inferred ownership from the route column of individual
#\tstatus.<section>.tsv rows and reported a triumphant ${totalBugs}/${totalBugs} that was
#\tFALSE: "/" has zero path segments, so a prefix test made it a catch-all that
#\tsilently swallowed /launchpad and /sports. 100% here is only meaningful
#\tbecause every route below is declared explicitly in routes.tsv.
#
#\tUNMATCHED — no section owns these routes; each is a coverage gap:
${(unmatched.length ? unmatched : ["(none)"]).map((u) => "#\t  " + u).join("\n")}
#
#\tRESIDUAL GAP not visible in this table: 14 of the 56 /launchpad bugs point at
#\tSkai-Web-App file-1 nodes (4414/4423/7909/8489/8493) that no section covers.
#\tThe route is attributed to trade-2 on the strength of the other 42, so those
#\t14 are counted but their FRAMES are still uncatalogued.
#
#\tTIES — several sections claim the same route at equal specificity; attributed
#\tto the section with the most frames:
${(ties.length ? ties : ["(none)"]).map((u) => "#\t  " + u).join("\n")}
#
#\tROOT — ${rootClaimants.length} main-app section(s) own "/" (${rootClaimants.join(", ") || "none"}),
#\tcarrying ${bugs.get("/") || 0} bugs. The skai-wallet and skai-landing roots are separate
#\tapps and are excluded by the app column in routes.tsv.
#
open_bugs\tsection\tframes\troutes`;

fs.writeFileSync(path.join(DIR, "hotspots.tsv"), header + "\n" + rows.join("\n") + "\n");
console.log(header.split("\n").slice(0, 6).join("\n"));
console.log("---");
console.log(rows.join("\n"));
console.log("---\nunmatched:", unmatched.join(", ") || "none");
