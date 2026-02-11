import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { content, interpolate, getContent } from "../lib/content";

/**
 * # Content System Documentation
 *
 * The SKAI Content System centralizes all text/copy in one place so designers
 * and marketers can modify text without touching component code.
 *
 * - `content` - nested object with all platform text organized by section
 * - `interpolate()` - replaces {{variable}} placeholders in template strings
 * - `getContent()` - dot-path accessor for content values
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count leaf string values in an object tree */
function countKeys(obj: unknown): number {
  if (typeof obj === "string") return 1;
  if (Array.isArray(obj)) return obj.reduce((n, v) => n + countKeys(v), 0);
  if (obj && typeof obj === "object") {
    return Object.values(obj).reduce(
      (n: number, v) => n + countKeys(v),
      0,
    );
  }
  return 0;
}

/** Copy helper */
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* noop in storybook */
  }
}

/** Human-readable descriptions for each top-level content section */
const SECTION_DESCRIPTIONS: Record<string, string> = {
  global: "Brand info, nav labels, actions, and error messages used across the entire app",
  landing: "Landing page hero, features, waitlist, footer, and form copy",
  errors: "Error page content (500, maintenance, etc.)",
  legal: "Terms of service and privacy policy text",
  footer: "Global footer links and copyright",
  landingForm: "Landing-specific form labels and validation messages",
  trading: "Spot trading, swap, and order-related content",
  portfolio: "Portfolio overview, positions, and history labels",
  play: "Gaming section (HiLo, Coin Flip, Slots, Poker, etc.)",
  ai: "AI agent sidebar, signals, and subscription content",
  settings: "Settings page section labels and form fields",
  wallet: "Wallet connection, balance, and transaction messages",
  app: "Main app shell (hero, features, modules, stats, init)",
  perp: "Perpetual trading DEX (positions, leverage, funding, orders)",
  predict: "Prediction markets (categories, bets, odds, resolution)",
  account: "Account page tabs and loading states",
  leaderboard: "Rankings, tiers, points breakdown",
  earn: "Earn page (faucet, lottery, referral tabs)",
  notFound: "404 page content",
  social: "Social features (discover, messages, trading groups, profiles)",
  governance: "DAO governance (proposals, voting, delegation)",
  streaming: "Live streaming (browse, chat, controls, donations)",
  copyTrading: "Copy trading (leaderboard, trader cards, settings)",
  support: "Support tickets, help center, priorities",
  emptyStates: "Generic empty/loading state messages",
  toasts: "Common toast/notification messages",
  placeholders: "Common input field placeholders",
  aiPage: "AI page hero, quick suggestions, module cards, tools section",
  mobileMenu: "Mobile sidebar/menu labels",
  referral: "Referral program (tiers, commissions, share actions)",
  bridge: "Cross-chain bridge form labels",
  lending: "Lending page (supply, borrow, positions)",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className={`shrink-0 px-2 py-0.5 text-xs rounded transition-colors ${
        copied
          ? "bg-green-600 text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

/** Recursively render a content tree */
const ContentTree = ({
  data,
  path = "",
  depth = 0,
}: {
  data: unknown;
  path?: string;
  depth?: number;
}) => {
  const [open, setOpen] = useState(depth < 1);

  if (typeof data === "string") {
    return (
      <div className="flex items-start gap-3 py-1.5 pl-4 group">
        <code className="text-xs text-primary/70 shrink-0 font-mono pt-0.5 min-w-[120px]">
          {path.split(".").pop()}
        </code>
        <span className="text-sm text-foreground flex-1 break-words">
          {data}
        </span>
        <CopyButton text={data} />
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="pl-4 border-l border-border/40">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs text-muted-foreground w-4">
            {open ? "-" : "+"}
          </span>
          <span>{path.split(".").pop()}</span>
          <span className="text-xs text-muted-foreground font-normal">
            [{data.length} items]
          </span>
        </button>
        {open && (
          <div className="ml-2 space-y-1">
            {data.map((item, i) => (
              <ContentTree
                key={i}
                data={item}
                path={`${path}[${i}]`}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (data && typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    const keyCount = countKeys(data);

    return (
      <div className={depth > 0 ? "pl-4 border-l border-border/40" : ""}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 py-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors w-full text-left"
        >
          <span className="text-xs text-muted-foreground w-4">
            {open ? "-" : "+"}
          </span>
          <span>{path.split(".").pop() || "root"}</span>
          <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-normal">
            {keyCount} values
          </span>
        </button>
        {open && (
          <div className="space-y-0.5">
            {entries.map(([key, value]) => (
              <ContentTree
                key={key}
                data={value}
                path={path ? `${path}.${key}` : key}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

// ---------------------------------------------------------------------------
// Section cards for the overview
// ---------------------------------------------------------------------------

const SectionCard = ({
  name,
  data,
}: {
  name: string;
  data: unknown;
}) => {
  const keyCount = countKeys(data);
  const [expanded, setExpanded] = useState(false);
  const description = SECTION_DESCRIPTIONS[name] || "";

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-foreground capitalize">
              {name}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
              {keyCount} strings
            </span>
          </div>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
        <span className="text-muted-foreground text-sm shrink-0 ml-4">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-border px-4 py-3 bg-muted/10 max-h-[500px] overflow-y-auto">
          <ContentTree data={data} path={name} depth={1} />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Documentation/Content System",
  parameters: { layout: "fullscreen" },
  tags: ["stable"],
};
export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Overview: Story = {
  name: "Content Overview",
  render: () => {
    const OverviewPage = () => {
      const sections = Object.entries(content) as [string, unknown][];
      const [filter, setFilter] = useState("");
      const filtered = filter
        ? sections.filter(([name]) =>
            name.toLowerCase().includes(filter.toLowerCase()),
          )
        : sections;

      return (
        <div className="p-8 bg-background min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Content System
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Centralized text/copy for the entire SKAI platform. Modify content
              here without touching component code.
            </p>
            <code className="text-sm text-primary font-mono block mb-8">
              {"import { content, interpolate, getContent } from '@skai/ui';"}
            </code>

            {/* Stats bar */}
            <div className="flex gap-6 mb-6 flex-wrap">
              <div className="bg-card border border-border rounded-lg px-5 py-3">
                <div className="text-2xl font-bold text-foreground font-mono">
                  {sections.length}
                </div>
                <div className="text-xs text-muted-foreground">Top Sections</div>
              </div>
              <div className="bg-card border border-border rounded-lg px-5 py-3">
                <div className="text-2xl font-bold text-foreground font-mono">
                  {countKeys(content)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Strings
                </div>
              </div>
            </div>

            {/* Filter input */}
            <div className="mb-6">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter sections..."
                className="w-full max-w-sm bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {filter && (
                <span className="text-xs text-muted-foreground ml-3">
                  Showing {filtered.length} of {sections.length} sections
                </span>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {filtered.map(([name, data]) => (
                <SectionCard key={name} name={name} data={data} />
              ))}
            </div>
          </div>
        </div>
      );
    };

    return <OverviewPage />;
  },
};

export const InterpolateDemo: Story = {
  name: "interpolate() Demo",
  render: () => {
    const InterpolatePlayground = () => {
      const [template, setTemplate] = useState(
        "Hello {{name}}, your balance is {{balance}} ETH",
      );
      const [varsRaw, setVarsRaw] = useState(
        JSON.stringify({ name: "Casey", balance: "12.5" }, null, 2),
      );
      const [error, setError] = useState("");

      let result = "";
      try {
        const vars = JSON.parse(varsRaw);
        result = interpolate(template, vars);
        if (error) setError("");
      } catch {
        result = "(invalid JSON)";
      }

      const examples: Array<{
        label: string;
        template: string;
        vars: Record<string, string>;
      }> = [
        {
          label: "Username confirmation",
          template: content.landing.waitlist.completion.titleWithUsername,
          vars: { username: "casey" },
        },
        {
          label: "Token approval button",
          template: content.trading.swap.buttonApprove,
          vars: { token: "USDC" },
        },
        {
          label: "Wallet error",
          template:
            content.landing.waitlist.externalWallet.errors.walletAlreadyLinked,
          vars: { username: "pioneer42" },
        },
        {
          label: "Dashboard welcome",
          template: content.landing.waitlist.dashboard.welcome,
          vars: { username: "casey" },
        },
        {
          label: "Referral share text",
          template: content.landing.waitlist.dashboard.referral.shareText,
          vars: { username: "casey" },
        },
        {
          label: "Perp order action",
          template: content.perp.actions.placeOrder,
          vars: { side: "Long", type: "Market" },
        },
        {
          label: "Prediction results count",
          template: content.predict.resultsCount,
          vars: { count: "42" },
        },
        {
          label: "Earn faucet next claim",
          template: content.earn.faucet.nextClaim,
          vars: { time: "4h 23m" },
        },
        {
          label: "Streaming viewer count",
          template: content.streaming.viewers,
          vars: { count: "1,247" },
        },
        {
          label: "Footer copyright year",
          template: content.footer.copyright,
          vars: { year: "2026" },
        },
      ];

      return (
        <div className="p-8 bg-background min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              interpolate()
            </h1>
            <p className="text-lg text-muted-foreground mb-1">
              Replaces <code className="text-primary">{`{{variable}}`}</code>{" "}
              placeholders in template strings with provided values.
            </p>
            <code className="text-sm text-primary font-mono block mb-8">
              {
                'interpolate("Hello {{name}}", { name: "World" }) => "Hello World"'
              }
            </code>

            {/* Interactive playground */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Playground
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="interpolate-template" className="text-sm font-medium text-foreground block mb-1">
                    Template string
                  </label>
                  <input
                    id="interpolate-template"
                    type="text"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="interpolate-vars" className="text-sm font-medium text-foreground block mb-1">
                    Variables (JSON)
                  </label>
                  <textarea
                    id="interpolate-vars"
                    value={varsRaw}
                    onChange={(e) => setVarsRaw(e.target.value)}
                    rows={4}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                  {error && (
                    <p className="text-xs text-destructive mt-1">{error}</p>
                  )}
                </div>

                <div className="bg-muted/50 border border-border rounded-md px-4 py-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Result
                  </div>
                  <div className="text-base text-foreground font-medium">
                    {result}
                  </div>
                </div>
              </div>
            </div>

            {/* Real examples from content */}
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Real Examples from Content
            </h2>
            <div className="space-y-3">
              {examples.map((ex, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => {
                    setTemplate(ex.template);
                    setVarsRaw(JSON.stringify(ex.vars, null, 2));
                  }}
                >
                  <div className="text-sm font-medium text-foreground mb-1">
                    {ex.label}
                  </div>
                  <code className="text-xs text-muted-foreground font-mono block mb-1">
                    {ex.template}
                  </code>
                  <div className="text-sm text-primary">
                    {interpolate(ex.template, ex.vars)}
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Click any example above to load it into the playground.
              </p>
            </div>
          </div>
        </div>
      );
    };

    return <InterpolatePlayground />;
  },
};

export const GetContentDemo: Story = {
  name: "getContent() Demo",
  render: () => {
    const GetContentPlayground = () => {
      const [path, setPath] = useState("app.hero.titleLine1");
      const result = getContent(path);

      const presets = [
        // Global
        "global.brand.name",
        "global.brand.tagline",
        "global.actions.connect",
        "global.errors.generic",
        // App
        "app.hero.titleLine1",
        "app.hero.subtitle",
        // Landing
        "landing.hero.title",
        "landing.hero.cta",
        "landing.footer.copyright",
        // Trading
        "trading.swap.title",
        "trading.swap.button",
        // Portfolio
        "portfolio.overview.title",
        // Play
        "play.hilo.title",
        // AI
        "ai.title",
        // Perp
        "perp.badge",
        "perp.side.long",
        "perp.labels.leverage",
        "perp.actions.openLong",
        // Predict
        "predict.title",
        "predict.categories.all",
        // Leaderboard
        "leaderboard.title",
        "leaderboard.tiers.diamond",
        // Earn
        "earn.title",
        "earn.faucet.title",
        // Social
        "social.discover.title",
        "social.messages.title",
        // Account
        "account.tabs.profile",
        // Governance
        "governance.title",
        // Streaming
        "streaming.title",
        // Copy Trading
        "copyTrading.title",
        // Support
        "support.title",
        // Referral
        "referral.title",
        // Settings
        "settings.title",
        // Wallet
        "wallet.connect.title",
        // Empty States
        "emptyStates.noResults",
      ];

      return (
        <div className="p-8 bg-background min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              getContent()
            </h1>
            <p className="text-lg text-muted-foreground mb-1">
              Retrieves a content string by dot-path. Returns the path itself if
              the value is not found or is not a string.
            </p>
            <code className="text-sm text-primary font-mono block mb-8">
              {
                'getContent("landing.hero.title") => "The Future of Trading"'
              }
            </code>

            {/* Interactive playground */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Playground
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="getcontent-path" className="text-sm font-medium text-foreground block mb-1">
                    Content path
                  </label>
                  <input
                    id="getcontent-path"
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="e.g. landing.hero.title"
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="bg-muted/50 border border-border rounded-md px-4 py-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Result
                  </div>
                  <div
                    className={`text-base font-medium ${
                      result === path
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {result}
                  </div>
                  {result === path && (
                    <div className="text-xs text-destructive mt-1">
                      Path not found or value is not a string -- returned path
                      as fallback
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Presets */}
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Quick Access Paths
            </h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border">
              {presets.map((p) => {
                const val = getContent(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPath(p)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left group"
                  >
                    <code className="text-xs text-primary font-mono">
                      {p}
                    </code>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[50%] text-right">
                      {val}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click any path to load it into the playground above.
            </p>
          </div>
        </div>
      );
    };

    return <GetContentPlayground />;
  },
};

export const CoverageMap: Story = {
  name: "Coverage Map",
  render: () => {
    const sections = Object.entries(content) as [string, unknown][];
    const totalStrings = countKeys(content);

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Content Coverage Map
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            All {sections.length} content sections with {totalStrings} total
            strings. Each card shows a top-level section, its description, and
            string count.
          </p>

          {/* Grid of section cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {sections.map(([name, data]) => {
              const count = countKeys(data);
              return (
                <div
                  key={name}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-foreground capitalize">
                      {name}
                    </span>
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {SECTION_DESCRIPTIONS[name] || "No description available"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Usage guide */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              How to Use
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  1. Direct access (recommended)
                </h3>
                <code className="text-xs text-primary font-mono bg-muted px-2 py-1 rounded block">
                  {`import { content } from "@skai/ui";\nconst title = content.perp.badge; // "SKAI PERP DEX"`}
                </code>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  2. With interpolation
                </h3>
                <code className="text-xs text-primary font-mono bg-muted px-2 py-1 rounded block">
                  {`import { content, interpolate } from "@skai/ui";\ninterpolate(content.perp.actions.placeOrder, { side: "Long", type: "Market" });`}
                </code>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  3. Dynamic path access
                </h3>
                <code className="text-xs text-primary font-mono bg-muted px-2 py-1 rounded block">
                  {`import { getContent } from "@skai/ui";\nconst label = getContent("predict.categories.crypto"); // "Crypto"`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
