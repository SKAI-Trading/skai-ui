import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import { 
  Typography, H1, H2, H3, H4, P, Small, Price, Code, 
  Blockquote, List, ListItem 
} from "../components/typography";

const meta: Meta = {
  title: "🎨 Design System/Typography",
  parameters: {
    docs: {
      description: {
        component: `
# SKAI Typography System

**Perfect alignment with Figma design system and live app implementation.**

## 🎯 Typography Philosophy

The SKAI typography system uses a carefully curated set of fonts to create hierarchy, personality, and optimal readability:

- **Cormorant Garamond**: Headlines and display text (elegant serif)
- **Manrope**: Sub-headlines and UI text (modern sans-serif)
- **Mulish**: Body text, numbers, and labels (readable sans-serif)
- **JetBrains Mono**: Code and technical data (monospace)

## 📱 Responsive Design

All typography scales responsively across three breakpoints:
- **Desktop**: 1024px+ (full sizes)
- **Tablet**: 768px - 1023px (medium sizes)
- **Mobile**: < 768px (optimized sizes, minimum 12px for WCAG compliance)

## ✅ Usage Status: CORE SYSTEM

This typography system is the **foundation** of the entire SKAI design system. All components use these classes.

### Semantic Usage Guidelines

- **Headlines**: Page titles, hero sections, major announcements
- **Super-headlines**: Section introductions, impact statements  
- **Sub-headlines**: Card titles, form sections, navigation
- **Numbers**: Prices, statistics, financial data (with tabular-nums)
- **Paragraphs**: Body content, descriptions, help text
- **Labels**: Form labels, badges, metadata

### Implementation

All typography classes follow the \`skai-*\` naming convention and are defined in \`typography.css\`.
        `,
      },
    },
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

// =============================================================================
// COMPREHENSIVE TYPOGRAPHY SHOWCASE
// =============================================================================

export const AllTypographyVariants: Story = {
  render: () => (
    <div className="space-y-16 max-w-6xl mx-auto">
      
      {/* Headlines Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Headlines (Cormorant Garamond)</h2>
          <p className="skai-para-2 text-muted-foreground">
            Elegant serif typography for major display headings and hero text
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">headline-2</Badge>
              <code className="text-xs text-muted-foreground">82px (all breakpoints)</code>
            </div>
            <Typography variant="headline-2" className="text-foreground">
              Trading Revolution
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">headline-2-italic</Badge>
              <code className="text-xs text-muted-foreground">82px italic</code>
            </div>
            <Typography variant="headline-2-italic" className="text-foreground">
              Trading Revolution
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">headline-3</Badge>
              <code className="text-xs text-muted-foreground">54px → 40px → 30px</code>
            </div>
            <Typography variant="headline-3" className="text-foreground">
              Welcome to SKAI
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">headline-4</Badge>
              <code className="text-xs text-muted-foreground">34px (all breakpoints)</code>
            </div>
            <Typography variant="headline-4" className="text-foreground">
              Portfolio Overview
            </Typography>
          </div>
        </div>
      </section>

      {/* Super Headlines Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Super Headlines (Manrope)</h2>
          <p className="skai-para-2 text-muted-foreground">
            Bold sans-serif for impactful statements and section introductions
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">super-3</Badge>
              <code className="text-xs text-muted-foreground">42px → 32px → 24px</code>
            </div>
            <Typography variant="super-3" className="text-foreground">
              Trade Smarter
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">super-4</Badge>
              <code className="text-xs text-muted-foreground">32px → 24px → 20px</code>
            </div>
            <Typography variant="super-4" className="text-foreground">
              Advanced Analytics
            </Typography>
          </div>
        </div>
      </section>

      {/* Sub Headlines Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Sub Headlines (Manrope)</h2>
          <p className="skai-para-2 text-muted-foreground">
            Modern sans-serif for section headers and UI headings
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">sub-1</Badge>
              <code className="text-xs text-muted-foreground">24px → 18px → 16px</code>
            </div>
            <Typography variant="sub-1" className="text-foreground">
              Section Header
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">sub-2</Badge>
              <code className="text-xs text-muted-foreground">18px → 14px → 12px</code>
            </div>
            <Typography variant="sub-2" className="text-foreground">
              Card Title
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">sub-2-semibold</Badge>
              <code className="text-xs text-muted-foreground">18px semibold</code>
            </div>
            <Typography variant="sub-2-semibold" className="text-foreground">
              Important Card Title
            </Typography>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Numbers (Mulish - Tabular)</h2>
          <p className="skai-para-2 text-muted-foreground">
            Tabular numerics for consistent alignment of financial data and statistics
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">number-1</Badge>
              <code className="text-xs text-muted-foreground">42px → 32px → 24px</code>
            </div>
            <Typography variant="number-1" className="text-foreground">
              $1,234,567.89
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">number-2</Badge>
              <code className="text-xs text-muted-foreground">32px → 24px → 20px</code>
            </div>
            <Typography variant="number-2" className="text-foreground">
              $12,345.67
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">number-3</Badge>
              <code className="text-xs text-muted-foreground">22px → 16px → 14px</code>
            </div>
            <Typography variant="number-3" className="text-foreground">
              $123.45
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">number-4</Badge>
              <code className="text-xs text-muted-foreground">14px → 12px → 10px</code>
            </div>
            <Typography variant="number-4" className="text-foreground">
              $12.34
            </Typography>
          </div>
        </div>
      </section>

      {/* Paragraphs Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Paragraphs (Manrope)</h2>
          <p className="skai-para-2 text-muted-foreground">
            Readable sans-serif for body content and descriptions
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">para-1</Badge>
              <code className="text-xs text-muted-foreground">16px → 14px → 12px</code>
            </div>
            <Typography variant="para-1" className="text-foreground max-w-2xl">
              This is the primary paragraph style for body text. It provides excellent readability 
              and maintains optimal line spacing across all devices for comfortable reading experiences.
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">para-1-semibold</Badge>
              <code className="text-xs text-muted-foreground">16px semibold</code>
            </div>
            <Typography variant="para-1-semibold" className="text-foreground max-w-2xl">
              This is emphasized body text that needs attention without being a heading. 
              Perfect for highlighting important information within paragraphs.
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">para-2</Badge>
              <code className="text-xs text-muted-foreground">14px → 12px (min for WCAG)</code>
            </div>
            <Typography variant="para-2" className="text-foreground max-w-2xl">
              Smaller paragraph text for secondary information, captions, help text, 
              and detailed descriptions. Maintains readability while using less space.
            </Typography>
          </div>
        </div>
      </section>

      {/* Labels Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Labels (Mulish)</h2>
          <p className="skai-para-2 text-muted-foreground">
            UI labels, form fields, and metadata text
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">label-1</Badge>
              <code className="text-xs text-muted-foreground">16px (all breakpoints)</code>
            </div>
            <Typography variant="label-1" className="text-foreground">
              Form Label
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">label-2</Badge>
              <code className="text-xs text-muted-foreground">11px → 8px (uppercase)</code>
            </div>
            <Typography variant="label-2" className="text-foreground">
              BADGE LABEL
            </Typography>
          </div>
        </div>
      </section>

      {/* Semantic Aliases Section */}
      <section className="space-y-8">
        <div className="border-b border-border pb-4">
          <h2 className="skai-super-4 text-primary mb-2">Semantic Aliases</h2>
          <p className="skai-para-2 text-muted-foreground">
            Semantic typography variants for common use cases
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">page-title</Badge>
              <code className="text-xs text-muted-foreground">= headline-3 (responsive)</code>
            </div>
            <Typography variant="page-title" className="text-foreground">
              Page Title
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">section-title</Badge>
              <code className="text-xs text-muted-foreground">= super-4 (responsive)</code>
            </div>
            <Typography variant="section-title" className="text-foreground">
              Section Title
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">card-title</Badge>
              <code className="text-xs text-muted-foreground">= sub-2-semibold</code>
            </div>
            <Typography variant="card-title" className="text-foreground">
              Card Title
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">body</Badge>
              <code className="text-xs text-muted-foreground">= para-1 (default)</code>
            </div>
            <Typography variant="body" className="text-foreground">
              Default body text for most content
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">small</Badge>
              <code className="text-xs text-muted-foreground">= para-2</code>
            </div>
            <Typography variant="small" className="text-foreground">
              Small text for captions and secondary content
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">price</Badge>
              <code className="text-xs text-muted-foreground">= number-2 (tabular)</code>
            </div>
            <Typography variant="price" className="text-green-500">
              $1,234.56
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">caption</Badge>
              <code className="text-xs text-muted-foreground">= label-2</code>
            </div>
            <Typography variant="caption" className="text-muted-foreground">
              Caption text and metadata
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">code</Badge>
              <code className="text-xs text-muted-foreground">JetBrains Mono 14px</code>
            </div>
            <Typography variant="code" className="text-foreground bg-muted px-2 py-1 rounded">
              const balance = 1234.56;
            </Typography>
          </div>
        </div>
      </section>
    </div>
  ),
};

// =============================================================================
// RESPONSIVE BEHAVIOR DEMO
// =============================================================================

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <Typography variant="section-title" className="text-primary">
          Responsive Typography Demo
        </Typography>
        <Typography variant="body" className="text-muted-foreground max-w-2xl mx-auto">
          Resize your viewport to see how typography scales across breakpoints: 
          Desktop (1024px+), Tablet (768-1023px), and Mobile (&lt;768px)
        </Typography>
      </div>
      
      <div className="space-y-8 border border-border rounded-lg p-8">
        <div className="space-y-4">
          <Typography variant="headline-3" className="text-foreground">
            Welcome to SKAI Trading
          </Typography>
          <Typography variant="super-3" className="text-primary">
            Trade Smarter with AI
          </Typography>
          <Typography variant="number-1" className="text-green-500">
            $1,234,567.89
          </Typography>
          <Typography variant="body" className="text-foreground max-w-2xl">
            Experience seamless trading with our AI-powered platform. This paragraph 
            demonstrates how body text scales responsively to maintain optimal readability 
            across all device sizes.
          </Typography>
        </div>
        
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="skai-card-title">Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <Typography variant="label-1" className="text-muted-foreground">
                Total Balance
              </Typography>
              <Typography variant="number-3" className="text-foreground">
                $12,345.67
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <Typography variant="label-1" className="text-muted-foreground">
                24h Change
              </Typography>
              <Typography variant="number-4" className="text-green-500">
                +$123.45
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <Typography variant="sub-2-semibold" className="text-foreground mb-3">
          Breakpoint Reference
        </Typography>
        <div className="space-y-2 text-sm">
          <div className="skai-para-2">
            <strong>Desktop (1024px+)</strong>: Full typography scale with maximum sizes
          </div>
          <div className="skai-para-2">
            <strong>Tablet (768-1023px)</strong>: Medium sizes optimized for touch interfaces
          </div>
          <div className="skai-para-2">
            <strong>Mobile (&lt;768px)</strong>: Compact sizes with minimum 12px for accessibility (WCAG)
          </div>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// TRADING INTERFACE DEMO
// =============================================================================

export const TradingInterface: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <Typography variant="section-title" className="text-primary">
          Trading Interface Typography
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          Real-world example showing typography in a trading context
        </Typography>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Display Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="skai-card-title">ETH/USDC</span>
              <Badge className="skai-label-2 bg-green-500/20 text-green-400">
                LONG
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Typography variant="price" className="text-foreground">
                $3,245.80
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="number-4" className="text-green-500">
                  +$82.15
                </Typography>
                <Typography variant="caption" className="text-green-500">
                  +2.6%
                </Typography>
              </div>
            </div>
            
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <Typography variant="label-1" className="text-muted-foreground">
                  24h Volume
                </Typography>
                <Typography variant="number-4" className="text-foreground">
                  $18.2B
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="label-1" className="text-muted-foreground">
                  Market Cap
                </Typography>
                <Typography variant="number-4" className="text-foreground">
                  $390.5B
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="label-1" className="text-muted-foreground">
                  Position Size
                </Typography>
                <Typography variant="number-4" className="text-foreground">
                  1.5 ETH
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="skai-card-title">Place Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Typography variant="label-1" className="text-foreground">
                Order Type
              </Typography>
              <div className="flex gap-2">
                <Badge className="skai-label-2 bg-primary/20 text-primary">
                  MARKET
                </Badge>
                <Badge variant="outline" className="skai-label-2">
                  LIMIT
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Typography variant="label-1" className="text-foreground">
                Amount (ETH)
              </Typography>
              <Typography variant="number-3" className="text-foreground p-3 bg-muted rounded border">
                0.5000
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="label-1" className="text-foreground">
                Estimated Cost
              </Typography>
              <Typography variant="number-2" className="text-foreground">
                $1,622.90
              </Typography>
            </div>
            
            <div className="pt-4 space-y-2">
              <button className="w-full bg-green-500 text-white py-3 rounded font-semibold">
                <Typography variant="sub-2-semibold">
                  Buy ETH
                </Typography>
              </button>
              <Typography variant="caption" className="text-muted-foreground text-center block">
                Available balance: $5,432.10 USDC
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <Typography variant="sub-2-semibold" className="text-foreground mb-3">
          Typography Usage in Trading UIs
        </Typography>
        <div className="space-y-2">
          <div className="skai-para-2">
            <strong>Prices</strong>: Always use number variants with tabular-nums for alignment
          </div>
          <div className="skai-para-2">
            <strong>Labels</strong>: Use label-1 for form fields, label-2 for badges/metadata
          </div>
          <div className="skai-para-2">
            <strong>Card Titles</strong>: Use card-title semantic variant (sub-2-semibold)
          </div>
          <div className="skai-para-2">
            <strong>Actions</strong>: Button text uses sub-2-semibold for prominence
          </div>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// COMPONENT USAGE EXAMPLES
// =============================================================================

export const ComponentExamples: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <Typography variant="section-title" className="text-primary">
          Typography Components
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          Using the Typography component and semantic variants
        </Typography>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="skai-card-title">Typography Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Typography variant="sub-2" className="text-muted-foreground">
                Basic usage with variant prop:
              </Typography>
              <div className="bg-muted p-4 rounded">
                <code className="text-sm">
                  {`<Typography variant="headline-3">
  Welcome to SKAI
</Typography>`}
                </code>
              </div>
              <Typography variant="headline-4" className="text-foreground">
                Welcome to SKAI
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="sub-2" className="text-muted-foreground">
                Semantic components:
              </Typography>
              <div className="bg-muted p-4 rounded">
                <code className="text-sm">
                  {`<H1>Page Title</H1>
<P>Paragraph content</P>
<Price>$1,234.56</Price>`}
                </code>
              </div>
              <div className="space-y-2">
                <H1>Page Title</H1>
                <P>Paragraph content with proper spacing</P>
                <Price>$1,234.56</Price>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="skai-card-title">Rich Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <H3>Features Overview</H3>
            <P>
              SKAI offers a comprehensive trading platform with advanced features:
            </P>
            <List>
              <ListItem>AI-powered trading signals</ListItem>
              <ListItem>Real-time market analysis</ListItem>
              <ListItem>Portfolio management tools</ListItem>
              <ListItem>Social trading features</ListItem>
            </List>
            
            <Blockquote>
              "The future of trading is here, powered by artificial intelligence 
              and designed for the next generation of traders."
            </Blockquote>
            
            <P>
              Learn more about our <Code>API</Code> integration or start trading today.
            </P>
            
            <Small>
              Risk disclaimer: Trading involves substantial risk of loss.
            </Small>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};