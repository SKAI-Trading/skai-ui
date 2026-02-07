import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { assets, assetUrls, placeholders, getAsset } from "../lib/assets";

/**
 * # Asset System Documentation
 *
 * Centralized asset management for images, icons, and media.
 * Swap assets in one place without modifying component code.
 *
 * - `assets` - static asset paths organized by category
 * - `assetUrls` - dynamic URL generators for tokens, NFTs, ENS, etc.
 * - `placeholders` - SVG data-URI placeholders for empty/loading states
 * - `getAsset()` - dot-path accessor with placeholder fallback
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* noop */
        }
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

/** Flatten nested asset object into [dotPath, url] pairs */
function flattenAssets(
  obj: unknown,
  prefix = "",
): Array<[string, string]> {
  const result: Array<[string, string]> = [];
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(
      obj as Record<string, unknown>,
    )) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        result.push([path, value]);
      } else {
        result.push(...flattenAssets(value, path));
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Asset preview card with image, path, and copy */
const AssetCard = ({ path, url }: { path: string; url: string }) => {
  const [imgError, setImgError] = useState(false);
  const isSvg = url.endsWith(".svg");
  const isPng = url.endsWith(".png");

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden group hover:border-primary/50 transition-colors">
      {/* Preview */}
      <div className="h-24 bg-muted/30 flex items-center justify-center p-3">
        {imgError ? (
          <div className="text-xs text-muted-foreground text-center">
            <div className="text-lg mb-1">--</div>
            <span>Not loaded</span>
          </div>
        ) : (
          <img
            src={url}
            alt={path}
            className="max-h-full max-w-full object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      {/* Info */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs text-primary font-mono truncate">
            {path}
          </code>
          <CopyButton text={url} />
        </div>
        <div className="text-xs text-muted-foreground font-mono truncate mt-0.5">
          {url}
        </div>
        {(isSvg || isPng) && (
          <span className="inline-block mt-1 text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase">
            {isSvg ? "SVG" : "PNG"}
          </span>
        )}
      </div>
    </div>
  );
};

/** Category section that groups assets */
const AssetCategory = ({
  name,
  items,
}: {
  name: string;
  items: Array<[string, string]>;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 mb-3 w-full text-left"
      >
        <h2 className="text-xl font-semibold text-foreground capitalize">
          {name}
        </h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
          {items.length} assets
        </span>
        <span className="text-sm text-muted-foreground ml-auto">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>
      {expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map(([path, url]) => (
            <AssetCard key={path} path={path} url={url} />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Documentation/Asset System",
  parameters: { layout: "fullscreen" },
  tags: ["stable"],
};
export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AssetCatalog: Story = {
  name: "Asset Catalog",
  render: () => {
    // Group assets by top-level category
    const categories = Object.entries(assets) as [string, unknown][];

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Asset System
          </h1>
          <p className="text-lg text-muted-foreground mb-1">
            All static assets organized by category. Images render from{" "}
            <code className="text-primary">public/assets/</code> at runtime.
          </p>
          <code className="text-sm text-primary font-mono block mb-8">
            {"import { assets, getAsset } from '@skai/ui';"}
          </code>

          {/* Stats */}
          <div className="flex gap-6 mb-8 flex-wrap">
            <div className="bg-card border border-border rounded-lg px-5 py-3">
              <div className="text-2xl font-bold text-foreground font-mono">
                {categories.length}
              </div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div className="bg-card border border-border rounded-lg px-5 py-3">
              <div className="text-2xl font-bold text-foreground font-mono">
                {flattenAssets(assets).length}
              </div>
              <div className="text-xs text-muted-foreground">Total Assets</div>
            </div>
          </div>

          {/* Categories */}
          {categories.map(([name, data]) => {
            const items = flattenAssets(data, name);
            return (
              <AssetCategory key={name} name={name} items={items} />
            );
          })}
        </div>
      </div>
    );
  },
};

export const DynamicUrls: Story = {
  name: "Dynamic URL Generators",
  render: () => {
    const DynamicUrlPlayground = () => {
      const [tokenAddr, setTokenAddr] = useState(
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      );
      const [chainId, setChainId] = useState(1);
      const [coingeckoId, setCoinGeckoId] = useState("1");
      const [ensName, setEnsName] = useState("vitalik.eth");
      const [avatarAddr, setAvatarAddr] = useState(
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      );

      const generators = [
        {
          name: "tokenIcon",
          description:
            "Trust Wallet token icon by contract address and chain ID",
          importPath: "assetUrls.tokenIcon(address, chainId)",
          result: assetUrls.tokenIcon(tokenAddr, chainId),
          controls: (
            <div className="space-y-2">
              <div>
                <label htmlFor="token-contract-addr" className="text-xs text-muted-foreground block mb-0.5">
                  Contract address
                </label>
                <input
                  id="token-contract-addr"
                  value={tokenAddr}
                  onChange={(e) => setTokenAddr(e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="token-chain-id" className="text-xs text-muted-foreground block mb-0.5">
                  Chain ID
                </label>
                <select
                  id="token-chain-id"
                  value={chainId}
                  onChange={(e) => setChainId(Number(e.target.value))}
                  className="bg-muted border border-border rounded-md px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={1}>1 - Ethereum</option>
                  <option value={8453}>8453 - Base</option>
                  <option value={137}>137 - Polygon</option>
                  <option value={42161}>42161 - Arbitrum</option>
                </select>
              </div>
            </div>
          ),
        },
        {
          name: "coingeckoIcon",
          description: "CoinGecko coin image by numeric coin ID",
          importPath: "assetUrls.coingeckoIcon(coinId)",
          result: assetUrls.coingeckoIcon(coingeckoId),
          controls: (
            <div>
              <label htmlFor="coingecko-id" className="text-xs text-muted-foreground block mb-0.5">
                CoinGecko coin ID
              </label>
              <input
                id="coingecko-id"
                value={coingeckoId}
                onChange={(e) => setCoinGeckoId(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ),
        },
        {
          name: "ensAvatar",
          description: "ENS avatar image from ENS metadata service",
          importPath: "assetUrls.ensAvatar(name)",
          result: assetUrls.ensAvatar(ensName),
          controls: (
            <div>
              <label htmlFor="ens-name" className="text-xs text-muted-foreground block mb-0.5">
                ENS name
              </label>
              <input
                id="ens-name"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ),
        },
        {
          name: "gradientAvatar",
          description: "Deterministic gradient avatar from any address/string",
          importPath: "assetUrls.gradientAvatar(address)",
          result: assetUrls.gradientAvatar(avatarAddr),
          controls: (
            <div>
              <label htmlFor="gradient-addr" className="text-xs text-muted-foreground block mb-0.5">
                Address
              </label>
              <input
                id="gradient-addr"
                value={avatarAddr}
                onChange={(e) => setAvatarAddr(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ),
        },
      ];

      return (
        <div className="p-8 bg-background min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Dynamic URL Generators
            </h1>
            <p className="text-lg text-muted-foreground mb-1">
              Functions that build image URLs on-the-fly for tokens, NFTs, and
              avatars.
            </p>
            <code className="text-sm text-primary font-mono block mb-8">
              {"import { assetUrls } from '@skai/ui';"}
            </code>

            <div className="space-y-4">
              {generators.map((gen) => (
                <div
                  key={gen.name}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <div className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {gen.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {gen.description}
                        </p>
                        <code className="text-xs text-primary font-mono mt-1 block">
                          {gen.importPath}
                        </code>
                      </div>
                      <div className="w-16 h-16 bg-muted/30 rounded-lg flex items-center justify-center shrink-0 border border-border">
                        <img
                          src={gen.result}
                          alt={gen.name}
                          className="max-h-12 max-w-12 rounded object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-3">{gen.controls}</div>

                    <div className="mt-3 bg-muted/50 border border-border rounded-md px-3 py-2 flex items-center justify-between gap-2">
                      <code className="text-xs text-muted-foreground font-mono truncate flex-1">
                        {gen.result}
                      </code>
                      <CopyButton text={gen.result} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* IPFS generator note */}
            <div className="mt-4 bg-card border border-border rounded-lg px-5 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                ipfsImage
              </h3>
              <p className="text-sm text-muted-foreground">
                Converts an IPFS CID to a gateway URL.
              </p>
              <code className="text-xs text-primary font-mono mt-1 block">
                assetUrls.ipfsImage(cid)
              </code>
              <div className="mt-2 bg-muted/50 border border-border rounded-md px-3 py-2">
                <code className="text-xs text-muted-foreground font-mono">
                  {assetUrls.ipfsImage("QmExample...")}
                </code>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return <DynamicUrlPlayground />;
  },
};

export const Placeholders: Story = {
  name: "Placeholders",
  render: () => {
    const tokenExamples = ["ETH", "BTC", "SKAI", "USDC", "SOL"];

    return (
      <div className="p-8 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Placeholders
          </h1>
          <p className="text-lg text-muted-foreground mb-1">
            SVG data-URI placeholder images for development, loading, and empty
            states.
          </p>
          <code className="text-sm text-primary font-mono block mb-8">
            {"import { placeholders } from '@skai/ui';"}
          </code>

          {/* Static placeholders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              Static Placeholders
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(
                [
                  ["default", placeholders.default, "Generic placeholder"],
                  ["avatar", placeholders.avatar, "User avatar placeholder"],
                  ["chart", placeholders.chart, "Chart/graph placeholder"],
                ] as const
              ).map(([name, src, desc]) => (
                <div
                  key={name}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <div className="h-32 bg-muted/30 flex items-center justify-center p-4">
                    <img
                      src={src}
                      alt={name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="px-4 py-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <code className="text-sm text-primary font-mono">
                          placeholders.{name}
                        </code>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {desc}
                        </p>
                      </div>
                      <CopyButton text={src} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token placeholder function */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              Token Placeholder (Dynamic)
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              <code className="text-primary">placeholders.token(symbol)</code>{" "}
              generates a circle with the token's initials.
            </p>
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-6 flex-wrap">
                {tokenExamples.map((sym) => (
                  <div key={sym} className="flex flex-col items-center gap-2">
                    <img
                      src={placeholders.token(sym)}
                      alt={sym}
                      className="w-10 h-10"
                    />
                    <code className="text-xs text-muted-foreground font-mono">
                      {sym}
                    </code>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-muted/50 border border-border rounded-md px-3 py-2">
                <code className="text-xs text-muted-foreground font-mono">
                  {'placeholders.token("ETH") => data:image/svg+xml,...'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const GetAssetDemo: Story = {
  name: "getAsset() Demo",
  render: () => {
    const GetAssetPlayground = () => {
      const [path, setPath] = useState("logo.full");
      const result = getAsset(path);
      const isFallback = result === placeholders.default;

      const presets = [
        "logo.full",
        "logo.mark",
        "logo.white",
        "tokens.eth",
        "tokens.btc",
        "tokens.skai",
        "chains.ethereum",
        "chains.base",
        "wallets.metamask",
        "wallets.coinbase",
        "illustrations.hero",
        "games.crash",
        "games.plinko",
        "games.roulette",
        "ui.3d.container",
        "pwa.icon192",
      ];

      return (
        <div className="p-8 bg-background min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              getAsset()
            </h1>
            <p className="text-lg text-muted-foreground mb-1">
              Dot-path accessor for assets. Returns the asset URL or falls back
              to <code className="text-primary">placeholders.default</code> if
              not found.
            </p>
            <code className="text-sm text-primary font-mono block mb-8">
              {
                'getAsset("logo.full") => "/assets/logo/skai-logo-full.svg"'
              }
            </code>

            {/* Playground */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Playground
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="getasset-path" className="text-sm font-medium text-foreground block mb-1">
                    Asset path
                  </label>
                  <input
                    id="getasset-path"
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="e.g. logo.full"
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4">
                  {/* Preview */}
                  <div className="w-32 h-32 bg-muted/30 border border-border rounded-lg flex items-center justify-center p-3 shrink-0">
                    <img
                      src={result}
                      alt={path}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Result */}
                  <div className="flex-1">
                    <div className="bg-muted/50 border border-border rounded-md px-4 py-3 h-full flex flex-col justify-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Resolved URL
                      </div>
                      <code
                        className={`text-sm font-mono break-all ${
                          isFallback ? "text-destructive" : "text-foreground"
                        }`}
                      >
                        {result.length > 80
                          ? result.slice(0, 80) + "..."
                          : result}
                      </code>
                      {isFallback && (
                        <div className="text-xs text-destructive mt-1">
                          Path not found -- returned placeholder fallback
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Presets grid */}
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              Quick Access Paths
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {presets.map((p) => {
                const url = getAsset(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPath(p)}
                    className="bg-card border border-border rounded-lg p-3 hover:border-primary/50 transition-colors text-left"
                  >
                    <div className="h-12 flex items-center justify-center mb-2">
                      <img
                        src={url}
                        alt={p}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <code className="text-xs text-primary font-mono block truncate">
                      {p}
                    </code>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click any card to load it into the playground above.
            </p>
          </div>
        </div>
      );
    };

    return <GetAssetPlayground />;
  },
};
