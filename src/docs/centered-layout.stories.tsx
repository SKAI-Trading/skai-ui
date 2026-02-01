import type { Meta, StoryObj } from "@storybook/react";
import { CenteredLayout, AuthCard } from "../components/centered-layout";
import { ArrowLeft, Github, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof CenteredLayout> = {
  title: "Layout/CenteredLayout",
  component: CenteredLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Centered layout for authentication pages, onboarding flows, and focused content.

## Features
- Vertically and horizontally centered content
- Multiple background variants (gradient, pattern)
- Optional decorative background elements
- Fixed header and footer slots
- AuthCard component for consistent auth UI

## Usage
\`\`\`tsx
import { CenteredLayout, AuthCard } from "@skai/ui";

<CenteredLayout variant="gradient" showDecorations>
  <AuthCard
    logo={<Logo />}
    title="Sign In"
    subtitle="Welcome back"
    footer={<Link>Create account</Link>}
  >
    <LoginForm />
  </AuthCard>
</CenteredLayout>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CenteredLayout>;

// =============================================================================
// MOCK COMPONENTS
// =============================================================================

const SkaiLogo = () => (
  <div className="w-16 h-16 rounded-2xl bg-skai-green flex items-center justify-center">
    <span className="text-2xl font-bold text-white">S</span>
  </div>
);

const MockLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Email</label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full pl-4 pr-10 py-2.5 bg-muted border border-border rounded-lg text-sm"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        <a href="#" className="text-skai-green hover:underline">
          Forgot password?
        </a>
      </div>
      <button className="w-full py-2.5 bg-skai-green text-white rounded-lg font-medium hover:bg-skai-green/90 transition-colors">
        Sign In
      </button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>
      <button className="w-full py-2.5 bg-muted border border-border rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
        <Github className="h-4 w-4" />
        GitHub
      </button>
    </div>
  );
};

const MockRegisterForm = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">First name</label>
        <input
          type="text"
          placeholder="John"
          className="w-full mt-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Last name</label>
        <input
          type="text"
          placeholder="Doe"
          className="w-full mt-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm"
        />
      </div>
    </div>
    <div>
      <label className="text-sm font-medium">Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        className="w-full mt-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm"
      />
    </div>
    <div>
      <label className="text-sm font-medium">Password</label>
      <input
        type="password"
        placeholder="Create a strong password"
        className="w-full mt-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm"
      />
    </div>
    <label className="flex items-start gap-2 text-sm">
      <input type="checkbox" className="mt-1 rounded" />
      <span className="text-muted-foreground">
        I agree to the{" "}
        <a href="#" className="text-skai-green hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-skai-green hover:underline">
          Privacy Policy
        </a>
      </span>
    </label>
    <button className="w-full py-2.5 bg-skai-green text-white rounded-lg font-medium">
      Create Account
    </button>
  </div>
);

const MockHeader = () => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-skai-green flex items-center justify-center text-white font-bold">
        S
      </div>
      <span className="font-semibold">SKAI</span>
    </div>
    <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
      <ArrowLeft className="h-4 w-4" />
      Back to home
    </button>
  </div>
);

const MockFooter = () => (
  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
    <a href="#" className="hover:text-foreground">
      Terms
    </a>
    <span>•</span>
    <a href="#" className="hover:text-foreground">
      Privacy
    </a>
    <span>•</span>
    <a href="#" className="hover:text-foreground">
      Support
    </a>
  </div>
);

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    children: (
      <AuthCard
        logo={<SkaiLogo />}
        title="Welcome back"
        subtitle="Sign in to your account to continue"
        footer={
          <span>
            Don't have an account?{" "}
            <a href="#" className="text-skai-green hover:underline">
              Sign up
            </a>
          </span>
        }
      >
        <MockLoginForm />
      </AuthCard>
    ),
  },
};

export const WithGradient: Story = {
  args: {
    variant: "gradient",
    header: <MockHeader />,
    footer: <MockFooter />,
    children: (
      <AuthCard
        logo={<SkaiLogo />}
        title="Welcome back"
        subtitle="Sign in to your account"
        variant="glass"
      >
        <MockLoginForm />
      </AuthCard>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Gradient background with glass card variant.",
      },
    },
  },
};

export const WithPattern: Story = {
  args: {
    variant: "pattern",
    showDecorations: true,
    header: <MockHeader />,
    children: (
      <AuthCard
        logo={<SkaiLogo />}
        title="Create your account"
        subtitle="Start trading in minutes"
        footer={
          <span>
            Already have an account?{" "}
            <a href="#" className="text-skai-green hover:underline">
              Sign in
            </a>
          </span>
        }
      >
        <MockRegisterForm />
      </AuthCard>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Pattern background with decorative blur elements.",
      },
    },
  },
};

export const WithDecorations: Story = {
  args: {
    variant: "muted",
    showDecorations: true,
    children: (
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email to receive a reset link"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm"
            />
          </div>
          <button className="w-full py-2.5 bg-skai-green text-white rounded-lg font-medium">
            Send Reset Link
          </button>
        </div>
      </AuthCard>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Muted background with decorative blur elements.",
      },
    },
  },
};

export const LargerContent: Story = {
  args: {
    size: "md",
    variant: "gradient",
    children: (
      <AuthCard
        logo={<SkaiLogo />}
        title="Create your account"
        variant="bordered"
      >
        <MockRegisterForm />
      </AuthCard>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Medium size content area for larger forms.",
      },
    },
  },
};

// =============================================================================
// AUTH CARD VARIANTS
// =============================================================================

export const CardVariants: Story = {
  render: () => (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        <AuthCard
          title="Default"
          subtitle="No border or shadow"
          variant="default"
        >
          <p className="text-sm text-muted-foreground">Default card style</p>
        </AuthCard>
        <AuthCard title="Bordered" subtitle="With border" variant="bordered">
          <p className="text-sm text-muted-foreground">
            Standard bordered card
          </p>
        </AuthCard>
        <AuthCard title="Elevated" subtitle="With shadow" variant="elevated">
          <p className="text-sm text-muted-foreground">Elevated with shadow</p>
        </AuthCard>
        <AuthCard title="Glass" subtitle="Translucent" variant="glass">
          <p className="text-sm text-muted-foreground">Glass morphism effect</p>
        </AuthCard>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "AuthCard supports default, bordered, elevated, and glass variants.",
      },
    },
  },
};

export const SimpleMessage: Story = {
  args: {
    variant: "gradient",
    showDecorations: true,
    children: (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-skai-green/20 flex items-center justify-center">
          <Mail className="h-8 w-8 text-skai-green" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Check your email
        </h1>
        <p className="mt-2 text-muted-foreground max-w-sm">
          We've sent a verification link to <strong>you@example.com</strong>.
          Click the link to verify your account.
        </p>
        <button className="mt-6 px-6 py-2.5 bg-skai-green text-white rounded-lg font-medium">
          Open Email App
        </button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Simple centered message without AuthCard wrapper.",
      },
    },
  },
};
