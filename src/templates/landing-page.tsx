/**
 * LandingPageTemplate - Waitlist / Entry Landing Page
 *
 * Pure presentational component for the landing page.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - Animated background gradients
 * - SKAI branding
 * - Email input for waitlist
 * - CTA button
 * - Loading states
 *
 * @module templates/landing-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";

// ============================================================================
// TYPES
// ============================================================================

export interface LandingPageTemplateProps {
  /** Email input value */
  email: string;
  /** Email change handler */
  onEmailChange: (email: string) => void;
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Whether the form is submitting */
  isLoading: boolean;
  /** Placeholder text for email input */
  placeholder?: string;
  /** Button text */
  buttonText?: string;
  /** Loading button text */
  loadingText?: string;
  /** Title text */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LandingPageTemplate({
  email,
  onEmailChange,
  onSubmit,
  isLoading,
  placeholder = "Insert Email...",
  buttonText = "Enter",
  loadingText = "Entering...",
  title = "SKAI",
  subtitle,
  className,
}: LandingPageTemplateProps) {
  const [inputPlaceholder, setInputPlaceholder] = React.useState(placeholder);

  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4",
        className
      )}
    >
      {/* Animated background gradients */}
      <div
        className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary/10 via-background to-primary/10"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-secondary/20 blur-3xl"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl"
        style={{ animationDuration: "7s" }}
      />

      <div className="relative z-10 w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-8xl font-bold text-transparent duration-700 animate-in fade-in slide-in-from-bottom-4">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-3xl font-bold text-foreground delay-150 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-4xl">
              {subtitle}
            </p>
          ) : (
            <p className="text-3xl font-bold text-foreground delay-150 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-4xl">
              We're building som
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                ETH
              </span>
              ing
            </p>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 delay-500 duration-700 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="group relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-secondary to-primary opacity-25 blur transition duration-300 group-hover:opacity-50" />
            <Input
              type="email"
              placeholder={inputPlaceholder}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onEmailChange(e.target.value)
              }
              onFocus={() => setInputPlaceholder("")}
              onBlur={() => !email && setInputPlaceholder(placeholder)}
              className="relative h-14 border-white/20 bg-background/80 text-center text-lg backdrop-blur"
              required
              disabled={isLoading}
            />
          </div>
          <div className="group relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#17F9B4] to-[#56C7F3] opacity-50 blur transition duration-300 group-hover:opacity-75" />
            <Button
              type="submit"
              className="relative h-14 w-full bg-gradient-to-r from-[#17F9B4] to-[#56C7F3] text-xl font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? loadingText : buttonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LandingPageTemplate;
