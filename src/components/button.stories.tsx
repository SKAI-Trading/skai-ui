import type { Meta, StoryObj } from "@storybook/react";
import { Button, SkaiButton } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Mail, Loader2, ChevronRight, Plus, Download, CheckCircle, ArrowRight, Star, Zap } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "⚡ Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Button Component

A versatile button system with perfect typography integration.

## ✅ Usage Status: LIVE IN APP - TYPOGRAPHY UPDATED

This component is **actively used** in the main SKAI application and has been **updated** to use the design system typography classes perfectly.

### Typography Integration
- **Standard Button**: Uses \`skai-para-1-semibold\` for consistent body text styling
- **SKAI Button**: Uses responsive \`skai-sub-2\` and \`skai-sub-2-semibold\` variants
- **All sizes scale responsively**: Typography automatically adapts to mobile/tablet/desktop

### Current Usage in App
- **Trading interface**: Buy/Sell buttons, order actions
- **Navigation**: Menu items, tab switching  
- **Forms**: Submit actions, confirmations
- **Modals**: Close buttons, action buttons

## Button Variants

### Standard Button (Shadcn Compatible)
Traditional button with design system typography integration.

### SkaiButton (Figma Perfect)
Brand-specific button that perfectly matches Figma designs with SKAI colors and typography.

## Import Usage
\`\`\`typescript
import { Button, SkaiButton } from "@skai/ui";
\`\`\`

## Main App Locations
- \`src/components/copytrading/TraderCard.tsx\`
- \`src/components/trade/perp-v2/PerpChart.tsx\`
- Multiple form and navigation components

This is a **production-ready** component with proven reliability and perfect design system integration.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "The visual style of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    asChild: {
      control: "boolean",
      description: "Use Radix Slot to render as child element",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// =============================================================================
// STANDARD BUTTON VARIANTS
// =============================================================================

export const Default: Story = {
  args: {
    children: "Get Started",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Learn More",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive", 
    children: "Delete Account",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Cancel",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Close",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "View Details",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <CheckCircle className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="secondary">
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <Button size="sm">
          <Plus className="mr-1 h-3 w-3" />
          Add Item
        </Button>
        <Button size="lg">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    </div>
  ),
};

// =============================================================================
// SKAI BRANDED BUTTON VARIANTS
// =============================================================================

export const SkaiButtonShowcase: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      
      {/* Typography Integration Demo */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-green-500">✅ UPDATED</Badge>
            <h3 className="skai-sub-1">Perfect Typography Integration</h3>
          </div>
          <p className="skai-para-2 text-muted-foreground">
            All SKAI buttons now use design system typography classes that scale responsively across breakpoints.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h4 className="skai-sub-2-semibold">Typography Classes Used:</h4>
              <div className="space-y-2 skai-para-2">
                <div>• <strong>Large/Massive</strong>: skai-sub-2-semibold (18px → 14px → 12px)</div>
                <div>• <strong>Medium/Small</strong>: skai-sub-2 (18px → 14px → 12px)</div>
                <div>• <strong>Link/Tertiary</strong>: skai-sub-2 (18px → 14px → 12px)</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="skai-sub-2-semibold">Responsive Behavior:</h4>
              <div className="space-y-2 skai-para-2">
                <div>• <strong>Desktop</strong>: Full 18px typography</div>
                <div>• <strong>Tablet</strong>: Scales to 14px</div>
                <div>• <strong>Mobile</strong>: Scales to 12px</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Button Types */}
      <div className="space-y-6">
        <h3 className="skai-section-title">SKAI Button Types</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="skai-card-title">Primary</h4>
              <SkaiButton skaiType="primary">Start Trading</SkaiButton>
              <p className="skai-para-2 text-muted-foreground">
                Sky Blue background (#56C0F6), teal hover
              </p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="skai-card-title">Secondary</h4>
              <SkaiButton skaiType="secondary">Learn More</SkaiButton>
              <p className="skai-para-2 text-muted-foreground">
                Outlined style with sky blue border
              </p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="skai-card-title">Tertiary</h4>
              <SkaiButton skaiType="tertiary">Cancel</SkaiButton>
              <p className="skai-para-2 text-muted-foreground">
                Text-only with teal hover state
              </p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="skai-card-title">Link</h4>
              <SkaiButton skaiType="link">View Details</SkaiButton>
              <p className="skai-para-2 text-muted-foreground">
                Underlined link style
              </p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="skai-card-title">Destructive</h4>
              <SkaiButton skaiType="destructive">Delete</SkaiButton>
              <p className="skai-para-2 text-muted-foreground">
                Red theme for dangerous actions
              </p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="skai-card-title">Success</h4>
              <SkaiButton skaiType="success">Complete</SkaiButton>
              <p className="skai-para-2 text-muted-foreground">
                Green theme for positive actions
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Button Sizes */}
      <div className="space-y-6">
        <h3 className="skai-section-title">SKAI Button Sizes</h3>
        
        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">massive</Badge>
                <code className="text-xs">72px height - Hero CTAs</code>
              </div>
              <SkaiButton skaiSize="massive">
                <Zap className="mr-2" />
                Start Your Journey
              </SkaiButton>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">large</Badge>
                <code className="text-xs">64px height - Primary actions</code>
              </div>
              <SkaiButton skaiSize="large">
                <Star className="mr-2" />
                Get Premium
              </SkaiButton>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">medium (default)</Badge>
                <code className="text-xs">50px height - Standard UI</code>
              </div>
              <SkaiButton skaiSize="medium">
                <Plus className="mr-2" />
                Add Position
              </SkaiButton>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">small</Badge>
                <code className="text-xs">46px height - Compact spaces</code>
              </div>
              <SkaiButton skaiSize="small">
                Edit
              </SkaiButton>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">mini</Badge>
                <code className="text-xs">32px height - Tables/lists</code>
              </div>
              <SkaiButton skaiSize="mini">
                <CheckCircle className="mr-1" />
                Done
              </SkaiButton>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Trading Interface Example */}
      <div className="space-y-6">
        <h3 className="skai-section-title">Trading Interface Example</h3>
        
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="skai-card-title">Long ETH Position</h4>
              <div className="space-y-3">
                <div className="skai-para-2 text-muted-foreground">
                  Amount: <span className="skai-number-4 text-foreground">1.5 ETH</span>
                </div>
                <div className="skai-para-2 text-muted-foreground">
                  Value: <span className="skai-price text-foreground">$4,875.30</span>
                </div>
                <div className="flex gap-2">
                  <SkaiButton skaiType="success" skaiSize="small">
                    <Plus className="mr-1" />
                    Add More
                  </SkaiButton>
                  <SkaiButton skaiType="destructive" skaiSize="small">
                    Close Position
                  </SkaiButton>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="skai-card-title">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <SkaiButton skaiType="secondary" skaiSize="mini">
                  Market
                </SkaiButton>
                <SkaiButton skaiType="secondary" skaiSize="mini">
                  Limit
                </SkaiButton>
                <SkaiButton skaiType="tertiary" skaiSize="mini">
                  Stop Loss
                </SkaiButton>
                <SkaiButton skaiType="link" skaiSize="mini">
                  Advanced
                </SkaiButton>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const ResponsiveTypographyDemo: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="skai-section-title">Responsive Typography Demo</h3>
        <p className="skai-para-2 text-muted-foreground">
          Resize your viewport to see button typography scale: Desktop (18px) → Tablet (14px) → Mobile (12px)
        </p>
      </div>
      
      <div className="space-y-6 border border-border rounded-lg p-6">
        <SkaiButton skaiSize="massive">
          Massive Button Typography
        </SkaiButton>
        
        <SkaiButton skaiSize="large">
          Large Button Typography  
        </SkaiButton>
        
        <SkaiButton skaiSize="medium">
          Medium Button Typography
        </SkaiButton>
        
        <SkaiButton skaiSize="small">
          Small Button Typography
        </SkaiButton>
        
        <SkaiButton skaiSize="mini">
          Mini Button Typography
        </SkaiButton>
      </div>
      
      <Card className="p-4 bg-muted/50">
        <h4 className="skai-sub-2-semibold mb-2">Typography Classes Used</h4>
        <div className="space-y-1 skai-para-2">
          <div><strong>Massive/Large</strong>: skai-sub-2-semibold (semibold weight)</div>
          <div><strong>Medium/Small/Mini</strong>: skai-sub-2 (normal weight)</div>
          <div><strong>All sizes</strong>: Responsive scaling via CSS classes</div>
        </div>
      </Card>
    </div>
  ),
};