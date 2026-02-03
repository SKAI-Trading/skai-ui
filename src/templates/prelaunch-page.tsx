/**
 * Pre-Launch Page Template
 * 
 * Waitlist signup page with:
 * - Email collection
 * - Social media links
 * - Feature previews
 * - Launch countdown
 * - Referral tracking
 * 
 * @example
 * ```tsx
 * <PreLaunchPageTemplate
 *   launchDate="2026-03-01"
 *   features={featureList}
 *   onJoinWaitlist={handleJoin}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../components/core/badge";
import { Button } from "../components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/core/card";
import { Input } from "../components/core/input";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface FeaturePreview {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

export interface PreLaunchCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PreLaunchPageTemplateProps {
  /** Launch date (ISO string) */
  launchDate?: string;
  /** Countdown time (pre-calculated) */
  countdown?: PreLaunchCountdown | null;
  /** Feature previews */
  features: FeaturePreview[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Email input value */
  email?: string;
  /** Waitlist position (after signup) */
  waitlistPosition?: number | null;
  /** Total waitlist count */
  waitlistCount?: number;
  /** Referral code */
  referralCode?: string;
  /** Referral count */
  referralCount?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Success state (after signup) */
  isSuccess?: boolean;
  /** Error message */
  error?: string | null;
  /** Hero title */
  heroTitle?: string;
  /** Hero subtitle */
  heroSubtitle?: string;
  /** Email change handler */
  onEmailChange?: (email: string) => void;
  /** Join waitlist handler */
  onJoinWaitlist?: () => void;
  /** Social link click handler */
  onSocialClick?: (link: SocialLink) => void;
  /** Copy referral link handler */
  onCopyReferral?: () => void;
  /** Render wallet connect button */
  renderConnectButton?: () => React.ReactNode;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// Sub-components
// =============================================================================

interface CountdownDisplayProps {
  countdown: PreLaunchCountdown | null | undefined;
}

function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  if (!countdown) {
    return (
      <div className="text-center py-4">
        <Badge variant="default" className="text-lg px-4 py-2">
          🚀 Launching Soon
        </Badge>
      </div>
    );
  }

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="flex justify-center gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold">{String(unit.value).padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

interface WaitlistFormProps {
  email?: string;
  isLoading?: boolean;
  error?: string | null;
  onEmailChange?: (email: string) => void;
  onSubmit?: () => void;
  renderConnectButton?: () => React.ReactNode;
}

function WaitlistForm({ 
  email = "", 
  isLoading, 
  error, 
  onEmailChange, 
  onSubmit,
  renderConnectButton,
}: WaitlistFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Join the Waitlist</CardTitle>
        <CardDescription>
          Be the first to know when we launch
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderConnectButton ? (
            renderConnectButton()
          ) : (
            <>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => onEmailChange?.(e.target.value)}
                disabled={isLoading}
              />
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !email}
              >
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

interface SuccessViewProps {
  position?: number | null;
  waitlistCount?: number;
  referralCode?: string;
  referralCount?: number;
  onCopyReferral?: () => void;
}

function SuccessView({ 
  position, 
  waitlistCount, 
  referralCode, 
  referralCount = 0,
  onCopyReferral,
}: SuccessViewProps) {
  return (
    <Card className="max-w-md mx-auto text-center">
      <CardContent className="pt-8 pb-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2">You're on the list!</h2>
        
        {position && (
          <p className="text-lg mb-4">
            You are <span className="font-bold text-primary">#{position}</span> on the waitlist
            {waitlistCount && <span className="text-muted-foreground"> of {waitlistCount.toLocaleString()}</span>}
          </p>
        )}

        {referralCode && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Share your referral link to move up the list
            </p>
            <div className="flex gap-2">
              <Input 
                value={`https://skai.trade?ref=${referralCode}`} 
                readOnly 
                className="text-center"
              />
              <Button onClick={onCopyReferral} variant="outline">
                Copy
              </Button>
            </div>
            {referralCount > 0 && (
              <Badge variant="secondary">
                {referralCount} referral{referralCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FeatureGridProps {
  features: FeaturePreview[];
}

function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              {feature.badge && (
                <Badge variant="secondary">{feature.badge}</Badge>
              )}
            </div>
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface SocialLinksProps {
  links: SocialLink[];
  onSocialClick?: (link: SocialLink) => void;
}

function SocialLinks({ links, onSocialClick }: SocialLinksProps) {
  return (
    <div className="flex justify-center gap-4">
      {links.map((link) => (
        <Button
          key={link.id}
          variant="outline"
          size="icon"
          onClick={() => onSocialClick?.(link)}
        >
          {link.icon}
        </Button>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function PreLaunchPageTemplate({
  launchDate: _launchDate,
  countdown,
  features,
  socialLinks = [],
  email,
  waitlistPosition,
  waitlistCount,
  referralCode,
  referralCount,
  isLoading = false,
  isSuccess = false,
  error,
  heroTitle = "Something Amazing is Coming",
  heroSubtitle = "We're building the future of crypto trading. Be the first to experience it.",
  onEmailChange,
  onJoinWaitlist,
  onSocialClick,
  onCopyReferral,
  renderConnectButton,
  headerContent,
  footerContent,
  className,
}: PreLaunchPageTemplateProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {/* Hero Section */}
      <div className="relative py-20 px-4 text-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10" />
        
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground">
            {heroSubtitle}
          </p>

          {/* Countdown */}
          <CountdownDisplay countdown={countdown} />

          {headerContent}

          {/* Waitlist Form or Success */}
          {isSuccess ? (
            <SuccessView
              position={waitlistPosition}
              waitlistCount={waitlistCount}
              referralCode={referralCode}
              referralCount={referralCount}
              onCopyReferral={onCopyReferral}
            />
          ) : (
            <WaitlistForm
              email={email}
              isLoading={isLoading}
              error={error}
              onEmailChange={onEmailChange}
              onSubmit={onJoinWaitlist}
              renderConnectButton={renderConnectButton}
            />
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-4">Follow us for updates</p>
              <SocialLinks links={socialLinks} onSocialClick={onSocialClick} />
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What We're Building</h2>
              <p className="text-muted-foreground">
                A sneak peek at what's coming
              </p>
            </div>
            <FeatureGrid features={features} />
          </div>
        </section>
      )}

      {footerContent}

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SKAI Trading. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PreLaunchPageTemplate;
