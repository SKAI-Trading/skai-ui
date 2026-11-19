/**
 * NotFoundPageTemplate - 404 Error Page
 *
 * Pure presentational component for 404 error pages.
 * All callbacks must be passed via props - NO routing logic here.
 *
 * Draws the shared ErrorScreen's not-found variant: a title, one line, Go home
 * and Go back. The missed path, when given, is the hover tooltip.
 *
 * @module templates/not-found-page
 */

import { ErrorScreen } from "../components/feedback/error-screen";

// ============================================================================
// TYPES
// ============================================================================

export interface NotFoundPageTemplateProps {
  /** Current pathname that wasn't found. Shown in the hover tooltip. */
  pathname?: string;
  /** Callback for Go Home button */
  onGoHome: () => void;
  /** Callback for Go Back button */
  onGoBack: () => void;
  /** @deprecated The screen no longer draws a support line. */
  onSupportClick?: () => void;
  /** @deprecated The screen no longer draws an error code. */
  errorCode?: string | number;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** @deprecated The screen no longer draws a support line. */
  supportText?: string;
  /** Optional class name */
  className?: string;
  /** @deprecated The screen no longer draws a support line. */
  showSupport?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NotFoundPageTemplate({
  pathname,
  onGoHome,
  onGoBack,
  title,
  message,
  className,
}: NotFoundPageTemplateProps) {
  return (
    <ErrorScreen
      variant="not-found"
      title={title}
      description={message}
      detail={pathname}
      className={className}
      primaryAction={{ label: "Go home", onClick: onGoHome }}
      secondaryAction={{ label: "Go back", onClick: onGoBack }}
    />
  );
}

export default NotFoundPageTemplate;
