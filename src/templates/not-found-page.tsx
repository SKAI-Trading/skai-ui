/**
 * NotFoundPageTemplate - 404 Error Page
 *
 * Pure presentational component for 404 error pages.
 * All callbacks must be passed via props - NO routing logic here.
 *
 * Features:
 * - Animated 404 display
 * - Error message
 * - Go Home and Go Back buttons
 * - Support contact message
 *
 * @module templates/not-found-page
 */

import { cn } from "../lib/utils";
import { Button } from "../components/core/button";
import { Home, ArrowLeft, HelpCircle } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface NotFoundPageTemplateProps {
  /** Current pathname that wasn't found */
  pathname?: string;
  /** Callback for Go Home button */
  onGoHome: () => void;
  /** Callback for Go Back button */
  onGoBack: () => void;
  /** Callback for Support link (optional) */
  onSupportClick?: () => void;
  /** Custom error code (default: 404) */
  errorCode?: string | number;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** Support text */
  supportText?: string;
  /** Optional class name */
  className?: string;
  /** Whether to show the support message */
  showSupport?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NotFoundPageTemplate({
  pathname,
  onGoHome,
  onGoBack,
  onSupportClick,
  errorCode = "404",
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  supportText = "Need help? Contact our support team",
  className,
  showSupport = true,
}: NotFoundPageTemplateProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center",
        "bg-gradient-to-br from-background via-background to-primary/5 p-4",
        className
      )}
    >
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Error Code Animation */}
        <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-8xl font-bold text-transparent">
            {errorCode}
          </div>

          <h1 className="text-3xl font-bold">{title}</h1>

          <p className="text-muted-foreground">{message}</p>

          {pathname && (
            <p className="font-mono text-sm text-muted-foreground/70">
              Path: {pathname}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-3 delay-200 duration-700 animate-in fade-in slide-in-from-bottom-4 sm:flex-row">
          <Button size="lg" variant="default" onClick={onGoHome}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>

          <Button size="lg" variant="outline" onClick={onGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Support Message */}
        {showSupport && (
          <div className="pt-8 text-sm text-muted-foreground delay-300 duration-700 animate-in fade-in">
            {onSupportClick ? (
              <button
                onClick={onSupportClick}
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                <HelpCircle className="h-4 w-4" />
                {supportText}
              </button>
            ) : (
              <p>{supportText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotFoundPageTemplate;
