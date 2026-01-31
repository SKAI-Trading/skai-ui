# Contributing to @skai/ui

Thank you for your interest in contributing to the SKAI UI component library! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding New Components](#adding-new-components)
- [Writing Stories](#writing-stories)
- [Writing Tests](#writing-tests)
- [Design Tokens](#design-tokens)
- [Figma Integration](#figma-integration)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setup

```bash
# Navigate to the UI package
cd modules/skai-ui

# Install dependencies
npm install

# Start Storybook for development
npm run storybook
```

Storybook will open at `http://localhost:6006`

### Key Commands

| Command                   | Description                       |
| ------------------------- | --------------------------------- |
| `npm run storybook`       | Start Storybook dev server        |
| `npm run build:storybook` | Build static Storybook site       |
| `npm run build`           | Build the library (CJS, ESM, DTS) |
| `npm run test`            | Run component tests               |
| `npm run test:coverage`   | Run tests with coverage report    |
| `npm run lint`            | Run ESLint                        |
| `npm run typecheck`       | Run TypeScript type checking      |

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/component-name
```

### 2. Develop with Storybook

Always develop components in Storybook first:

```bash
npm run storybook
```

### 3. Add Tests

Every component needs tests. See [Writing Tests](#writing-tests).

### 4. Build and Verify

```bash
npm run build
npm run test
npm run typecheck
```

### 5. Submit PR

Create a pull request with:

- Description of changes
- Screenshots/videos if visual changes
- Link to Storybook preview

---

## Adding New Components

### File Structure

```
src/components/
├── component-name.tsx        # Component implementation
├── component-name.test.tsx   # Unit tests
└── component-name.stories.tsx # Storybook stories
```

### Component Template

```tsx
// component-name.tsx
import * as React from "react";
import { cn } from "../lib/utils";

export interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brief description of the prop */
  variant?: "default" | "outline" | "ghost";
  /** Another prop description */
  size?: "sm" | "md" | "lg";
}

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          // Variant styles
          {
            default: "bg-primary text-primary-foreground",
            outline: "border border-input bg-transparent",
            ghost: "hover:bg-accent hover:text-accent-foreground",
          }[variant],
          // Size styles
          {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4",
            lg: "h-12 px-6 text-lg",
          }[size],
          className,
        )}
        {...props}
      />
    );
  },
);
ComponentName.displayName = "ComponentName";

export { ComponentName };
```

### Export from Index

Add your component to `src/components/index.ts`:

```tsx
export * from "./component-name";
```

---

## Writing Stories

### Story Template

```tsx
// component-name.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-name";

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Brief description of what this component does.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    children: "Default component",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline variant",
  },
};

// Trading-specific examples (REQUIRED)
export const TradingExample: Story = {
  name: "Trading Use Case",
  render: () => (
    <div className="p-4 bg-card rounded-lg">
      <ComponentName variant="default">Trade Example</ComponentName>
    </div>
  ),
};
```

### Story Requirements

Every component story MUST include:

1. **Default story** - Basic component with minimal props
2. **All variants** - One story per variant option
3. **All sizes** - One story per size option
4. **Trading example** - At least one SKAI Trading-specific use case
5. **Interactive states** - Hover, focus, disabled if applicable

### Trading-Specific Stories

All components should have at least one story demonstrating SKAI Trading use cases:

```tsx
// Good examples:
export const TokenSwapInput: Story = {
  name: "Token Swap Amount",
  render: () => (
    <div className="max-w-sm">
      <label className="text-sm text-muted-foreground">You pay</label>
      <Input type="text" placeholder="0.0" className="text-2xl font-mono" />
      <p className="text-sm text-muted-foreground">≈ $0.00</p>
    </div>
  ),
};

export const WalletAddress: Story = {
  name: "Wallet Address Display",
  render: () => (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>0x</AvatarFallback>
      </Avatar>
      <span className="font-mono">0x1234...5678</span>
    </div>
  ),
};
```

---

## Writing Tests

### Test Template

```tsx
// component-name.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentName } from "./component-name";

describe("ComponentName", () => {
  // Basic rendering
  it("renders with default props", () => {
    render(<ComponentName>Test</ComponentName>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  // Variants
  it("renders all variants correctly", () => {
    const { rerender } = render(
      <ComponentName variant="default">Test</ComponentName>,
    );
    expect(screen.getByText("Test")).toHaveClass("bg-primary");

    rerender(<ComponentName variant="outline">Test</ComponentName>);
    expect(screen.getByText("Test")).toHaveClass("border");
  });

  // Sizes
  it("renders all sizes correctly", () => {
    const { rerender } = render(<ComponentName size="sm">Test</ComponentName>);
    expect(screen.getByText("Test")).toHaveClass("h-8");

    rerender(<ComponentName size="lg">Test</ComponentName>);
    expect(screen.getByText("Test")).toHaveClass("h-12");
  });

  // Interactions
  it("handles click events", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ComponentName onClick={onClick}>Click me</ComponentName>);
    await user.click(screen.getByText("Click me"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Edge cases
  it("handles empty children", () => {
    render(<ComponentName />);
    expect(
      document.querySelector("[class*='inline-flex']"),
    ).toBeInTheDocument();
  });

  // Accessibility
  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<ComponentName tabIndex={0}>Focusable</ComponentName>);

    await user.tab();
    expect(screen.getByText("Focusable")).toHaveFocus();
  });

  // Ref forwarding
  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<ComponentName ref={ref}>Test</ComponentName>);
    expect(ref).toHaveBeenCalled();
  });

  // Custom className
  it("merges custom className", () => {
    render(<ComponentName className="custom-class">Test</ComponentName>);
    expect(screen.getByText("Test")).toHaveClass("custom-class");
  });
});
```

### Test Requirements

Every component test MUST cover:

| Category          | Tests Required                                  |
| ----------------- | ----------------------------------------------- |
| **Rendering**     | Default render, with children, without children |
| **Variants**      | Every variant option                            |
| **Sizes**         | Every size option (if applicable)               |
| **Interactions**  | Click, focus, blur, change events               |
| **States**        | Disabled, loading, error states                 |
| **Edge Cases**    | Empty props, null values, max/min values        |
| **Accessibility** | Keyboard nav, ARIA attributes                   |
| **Ref**           | Ref forwarding works                            |
| **ClassName**     | Custom classes merge correctly                  |

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- component-name.test.tsx
```

---

## Design Tokens

Design tokens are defined in `src/design-tokens.css`. Use these for consistency:

### Colors

```css
/* Brand */
--skai-brand-primary    /* Primary blue */
--skai-brand-secondary  /* Purple accent */

/* Trading */
--skai-buy              /* Green - buy actions */
--skai-sell             /* Red - sell actions */
--skai-price-up         /* Price increase */
--skai-price-down       /* Price decrease */
```

### Usage in Components

```tsx
// Using Tailwind (preferred)
<div className="text-primary bg-card">
  <span className="text-green-500">+2.34%</span>
</div>

// Using CSS variables
<div style={{ color: 'hsl(var(--skai-buy))' }}>
  Profit
</div>
```

---

## Figma Integration

### Workflow

1. **Get Figma Access** - Request access to the SKAI design system
2. **Check Specs** - Every component should match Figma specs exactly
3. **Export Assets** - Use Figma's export for icons/images
4. **Document Differences** - If implementation differs, document why

### Component Checklist

Before marking a component complete, verify against Figma:

- [ ] Colors match design tokens
- [ ] Spacing matches 4px grid
- [ ] Typography matches type scale
- [ ] Border radius is correct
- [ ] Shadows match elevation system
- [ ] All states designed (hover, focus, disabled, etc.)

---

## Code Style

### TypeScript

- Use explicit types, avoid `any`
- Export interfaces for component props
- Use `React.forwardRef` for ref forwarding
- Prefer `interface` over `type` for component props

### Tailwind CSS

- Use Tailwind classes, avoid inline styles
- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design
- Use design tokens via CSS variables

### Naming

- **Components**: PascalCase (`TokenCard`, `SwapInput`)
- **Files**: kebab-case (`token-card.tsx`, `swap-input.stories.tsx`)
- **Props**: camelCase (`isLoading`, `onValueChange`)
- **CSS classes**: kebab-case (`token-card-header`)

### Do's and Don'ts

```tsx
// ✅ DO: Use cn() for conditional classes
<div className={cn("base-class", condition && "conditional-class")} />

// ❌ DON'T: String concatenation
<div className={"base-class" + (condition ? " conditional-class" : "")} />

// ✅ DO: Destructure props with defaults
const Component = ({ variant = "default", size = "md", ...props }) => {}

// ❌ DON'T: Access props directly
const Component = (props) => { const variant = props.variant || "default" }

// ✅ DO: Use semantic HTML
<button onClick={handleClick}>Click me</button>

// ❌ DON'T: Div with onClick
<div onClick={handleClick}>Click me</div>
```

---

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Lint passes (`npm run lint`)
- [ ] Storybook builds (`npm run build:storybook`)
- [ ] Library builds (`npm run build`)

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New component
- [ ] Bug fix
- [ ] Enhancement
- [ ] Documentation

## Component Checklist

- [ ] Story file created with all variants
- [ ] Test file with >80% coverage
- [ ] Exported from index.ts
- [ ] Design tokens used
- [ ] Accessible (keyboard, ARIA)

## Screenshots

[If visual changes, add before/after screenshots]

## Storybook

[Link to deployed Storybook preview]
```

### Review Process

1. **Automated checks** - CI runs tests, build, lint
2. **Visual review** - Reviewer checks Storybook
3. **Code review** - Reviewer checks implementation
4. **Approval** - Requires 1 approval to merge

---

## Questions?

- **Slack**: #frontend-ui
- **GitHub Issues**: Tag with `ui-library`
- **Storybook**: https://docs.skai.trade/storybook/

Happy contributing! 🚀
