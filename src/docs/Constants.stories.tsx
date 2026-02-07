import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { urls, brand } from "../lib/constants";

/**
 * # Platform Constants Documentation
 *
 * Centralized URLs, social links, and brand constants for the entire SKAI
 * platform. Import from `@skai/ui` to ensure consistency across apps.
 *
 * - `urls` - social, app, and legal URLs
 * - `brand` - name, domain, copyright, and handle
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

// ---------------------------------------------------------------------------
// Row component
// ---------------------------------------------------------------------------

const ConstantRow = ({
  label,
  value,
  importPath,
  isLink = false,
}: {
  label: string;
  value: string;
  importPath: string;
  isLink?: boolean;
}) => (
  <div className="flex items-center gap-4 py-3 px-5 group hover:bg-muted/20 transition-colors">
    <div className="flex flex-col min-w-[160px] shrink-0">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <code className="text-xs text-muted-foreground font-mono">
        {importPath}
      </code>
    </div>
    <div className="flex-1 min-w-0">
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline font-mono truncate block"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-foreground font-mono truncate block">
          {value}
        </span>
      )}
    </div>
    <CopyButton text={value} />
  </div>
);

// ---------------------------------------------------------------------------
// Section component
// ---------------------------------------------------------------------------

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-1 text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <div className="bg-card rounded-lg border border-border divide-y divide-border overflow-hidden">
      {children}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Documentation/Platform Constants",
  parameters: { layout: "fullscreen" },
  tags: ["stable"],
};
export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllConstants: Story = {
  name: "All Constants",
  render: () => (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Platform Constants
        </h1>
        <p className="text-lg text-muted-foreground mb-1">
          Centralized URLs and brand values. Click "Copy" to grab any value.
        </p>
        <code className="text-sm text-primary font-mono block mb-8">
          {"import { urls, brand } from '@skai/ui';"}
        </code>

        {/* urls.social */}
        <Section
          title="Social Links"
          description="Community and social media URLs. Open in new tab to verify."
        >
          {Object.entries(urls.social).map(([key, value]) => (
            <ConstantRow
              key={key}
              label={key}
              value={value}
              importPath={`urls.social.${key}`}
              isLink
            />
          ))}
        </Section>

        {/* urls.app */}
        <Section
          title="App URLs"
          description="Platform environment URLs for main app, landing, docs, and staging."
        >
          {Object.entries(urls.app).map(([key, value]) => (
            <ConstantRow
              key={key}
              label={key}
              value={value}
              importPath={`urls.app.${key}`}
              isLink
            />
          ))}
        </Section>

        {/* urls.legal */}
        <Section
          title="Legal URLs"
          description="Relative paths for legal pages (terms, privacy)."
        >
          {Object.entries(urls.legal).map(([key, value]) => (
            <ConstantRow
              key={key}
              label={key}
              value={value}
              importPath={`urls.legal.${key}`}
            />
          ))}
        </Section>

        {/* brand */}
        <Section
          title="Brand"
          description="Core brand identity values used across the platform."
        >
          {Object.entries(brand).map(([key, value]) => (
            <ConstantRow
              key={key}
              label={key}
              value={value}
              importPath={`brand.${key}`}
            />
          ))}
        </Section>

        {/* Usage cheat-sheet */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3 text-foreground">
            Usage Examples
          </h2>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {[
              {
                description: "Social link in JSX",
                code: '<a href={urls.social.discord}>Join Discord</a>',
              },
              {
                description: "App URL for navigation",
                code: 'window.location.href = urls.app.main;',
              },
              {
                description: "Footer copyright",
                code: '<span>{brand.copyright}</span>',
              },
              {
                description: "Twitter sharing",
                code: '`${urls.social.twitterIntent}?text=...&via=${brand.twitterHandle.slice(1)}`',
              },
            ].map((ex, i) => (
              <div
                key={i}
                className="px-5 py-3 border-b border-border last:border-b-0 hover:bg-muted/20"
              >
                <div className="text-sm font-medium text-foreground mb-1">
                  {ex.description}
                </div>
                <code className="text-xs text-muted-foreground font-mono">
                  {ex.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
