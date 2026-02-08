/**
 * ComingSoonPageTemplate - Coming Soon placeholder page
 *
 * Pure presentational component for "coming soon" pages.
 * All callbacks must be passed via props - NO routing logic here.
 *
 * Features:
 * - Rocket icon with primary accent
 * - Title and description
 * - Optional planned features list
 * - Back button with configurable label
 *
 * @module templates/coming-soon-page
 */

import { cn } from "../lib/utils";
import { Button } from "../components/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/core/card";
import { Rocket, ArrowLeft } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface ComingSoonPageTemplateProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Optional list of planned features */
  features?: string[];
  /** Label for the back button */
  backLabel?: string;
  /** Callback for back button */
  onBack: () => void;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ComingSoonPageTemplate({
  title,
  description,
  features = [],
  backLabel = "Back to Home",
  onBack,
  className,
}: ComingSoonPageTemplateProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background flex items-center justify-center p-4",
        className,
      )}
    >
      <div className="max-w-2xl w-full space-y-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            <CardDescription className="text-lg">
              {description}
            </CardDescription>
          </CardHeader>

          {features.length > 0 && (
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Planned Features:
                </h3>
                <ul className="space-y-2 text-left max-w-md mx-auto">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary text-sm leading-5 flex-shrink-0">
                        &bull;
                      </span>
                      <span className="text-sm text-muted-foreground leading-5">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="flex justify-center">
          <Button onClick={onBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ComingSoonPageTemplate;
