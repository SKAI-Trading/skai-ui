import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Design System/Typography",
  parameters: {
    docs: {
      description: {
        component: `
# SKAI Typography System

The SKAI design system uses a carefully curated set of fonts to create hierarchy and personality:

- **Cormorant Garamond**: Headlines and display text (elegant serif)
- **Manrope**: Sub-headlines and UI text (modern sans-serif)
- **Mulish**: Body text, numbers, and labels (readable sans-serif)
- **JetBrains Mono**: Code and technical data (monospace)

All typography classes are responsive and follow the Figma design system specifications.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// =============================================================================
// TYPOGRAPHY SHOWCASE
// =============================================================================

export const AllTypographyVariants: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      {/* Headlines (Cormorant Garamond) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Headlines (Cormorant Garamond)
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">headline-2 (82px → responsive)</span>
            <div className="skai-headline-2 text-white">Trading Revolution</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">headline-2-italic</span>
            <div className="skai-headline-2-italic text-white">Trading Revolution</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">headline-3 (54px → 40px → 30px)</span>
            <div className="skai-headline-3 text-white">Welcome to SKAI</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">headline-3-italic</span>
            <div className="skai-headline-3-italic text-white">Welcome to SKAI</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">headline-4 (34px)</span>
            <div className="skai-headline-4 text-white">Portfolio Overview</div>
          </div>
        </div>
      </section>

      {/* Super Headlines (Manrope) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-green-600">
          Super Headlines (Manrope)
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">super-3 (42px → 32px → 24px)</span>
            <div className="skai-super-3 text-white">Trade Smarter</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">super-4 (32px → 24px → 20px)</span>
            <div className="skai-super-4 text-white">Advanced Analytics</div>
          </div>
        </div>
      </section>

      {/* Sub Headlines (Manrope) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-purple-600">
          Sub Headlines (Manrope)
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">sub-1 (24px → 18px → 16px)</span>
            <div className="skai-sub-1 text-white">Section Header</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">sub-2 (18px → 14px → 12px)</span>
            <div className="skai-sub-2 text-white">Card Title</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">sub-2-semibold</span>
            <div className="skai-sub-2-semibold text-white">Important Card Title</div>
          </div>
        </div>
      </section>

      {/* Numbers (Mulish) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-yellow-600">
          Numbers (Mulish - Tabular)
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">number-1 (42px → 32px → 24px)</span>
            <div className="skai-number-1 text-white">$1,234,567.89</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">number-2 (32px → 24px → 20px)</span>
            <div className="skai-number-2 text-white">$12,345.67</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">number-3 (22px → 16px → 14px)</span>
            <div className="skai-number-3 text-white">$123.45</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">number-4 (14px → 12px → 10px)</span>
            <div className="skai-number-4 text-white">$12.34</div>
          </div>
        </div>
      </section>

      {/* Paragraphs (Manrope) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-cyan-600">
          Paragraphs (Manrope)
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">para-1 (16px → 14px → 12px)</span>
            <div className="skai-para-1 text-white">
              This is the primary paragraph style for body text. It's readable and maintains
              good line spacing for optimal readability across all devices.
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">para-1-semibold</span>
            <div className="skai-para-1-semibold text-white">
              This is important body text that needs emphasis without being a heading.
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">para-2 (14px → 12px → 12px min)</span>
            <div className="skai-para-2 text-white">
              Smaller paragraph text for secondary information, captions, or detailed descriptions.
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">para-2-semibold</span>
            <div className="skai-para-2-semibold text-white">
              Important secondary text that needs to stand out.
            </div>
          </div>
        </div>
      </section>

      {/* Labels (Mulish) */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-red-600">
          Labels (Mulish)
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">label-1 (16px all breakpoints)</span>
            <div className="skai-label-1 text-white">Form Label</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">label-2 (11px → 8px, uppercase)</span>
            <div className="skai-label-2 text-white">BADGE LABEL</div>
          </div>
        </div>
      </section>

      {/* Semantic Typography */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">
          Semantic Aliases
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">page-title</span>
            <div className="skai-page-title text-white">Page Title</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">section-title</span>
            <div className="skai-section-title text-white">Section Title</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">card-title</span>
            <div className="skai-card-title text-white">Card Title</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">body</span>
            <div className="skai-body text-white">Default body text</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">small</span>
            <div className="skai-small text-white">Small text for captions</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">price</span>
            <div className="skai-price text-white">$1,234.56</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">caption</span>
            <div className="skai-caption text-white">Caption text</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">code</span>
            <div className="skai-code text-white font-mono bg-gray-800 px-2 py-1 rounded">
              const balance = 1234.56;
            </div>
          </div>
        </div>
      </section>

      {/* Font Family Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-pink-600">
          Font Family Classes
        </h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-500">font-heading / font-display</span>
            <div className="font-heading text-white text-2xl">Cormorant Garamond</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">font-subheading / font-sans</span>
            <div className="font-subheading text-white text-xl">Manrope Sans-Serif</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">font-body</span>
            <div className="font-body text-white text-lg">Mulish Readable</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">font-mono</span>
            <div className="font-mono text-white text-base bg-gray-800 px-2 py-1 rounded">
              JetBrains Mono 12345
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

// Individual Examples
export const Headlines: Story = {
  render: () => (
    <div className="space-y-6 p-8">
      <div className="skai-headline-2 text-white">Revolution</div>
      <div className="skai-headline-3 text-white">Innovation</div>
      <div className="skai-headline-4 text-white">Excellence</div>
    </div>
  ),
};

export const TradingNumbers: Story = {
  render: () => (
    <div className="space-y-4 p-8 bg-gray-900">
      <div className="skai-number-1 text-green-400">+$12,345.67</div>
      <div className="skai-number-2 text-red-400">-$1,234.56</div>
      <div className="skai-number-3 text-white">$123.45</div>
      <div className="skai-number-4 text-gray-400">0.0123</div>
    </div>
  ),
};

export const UILabels: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <div>
        <div className="skai-label-1 text-gray-400 mb-1">Token Balance</div>
        <div className="skai-number-3 text-white">1,234.56 SKAI</div>
      </div>
      <div>
        <div className="skai-label-2 text-gray-500 mb-1">NETWORK STATUS</div>
        <div className="skai-para-2 text-green-400">Connected</div>
      </div>
    </div>
  ),
};

export const ResponsiveDemo: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-bold mb-4">Responsive Typography</h3>
        <p className="text-sm text-gray-500 mb-4">
          Resize your viewport to see typography scale responsively:
        </p>
        <div className="space-y-4">
          <div className="skai-headline-3 text-white">Welcome to SKAI</div>
          <div className="skai-super-3 text-blue-400">Trade Smarter</div>
          <div className="skai-number-1 text-green-400">$1,234,567.89</div>
          <div className="skai-para-1 text-gray-300">
            This paragraph demonstrates responsive text sizing across different screen sizes.
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded">
        <h4 className="skai-card-title text-white mb-2">Breakpoint Behavior</h4>
        <div className="skai-small text-gray-400 space-y-1">
          <div>• <strong>Desktop (1024px+)</strong>: Full sizes</div>
          <div>• <strong>Tablet (768-1023px)</strong>: Medium sizes</div>  
          <div>• <strong>Mobile (&lt;768px)</strong>: Smallest sizes</div>
        </div>
      </div>
    </div>
  ),
};