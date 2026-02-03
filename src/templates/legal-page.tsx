/**
 * Legal Page Template
 * 
 * Shared template for legal documents:
 * - Privacy Policy
 * - Terms of Service
 * - Cookie Policy
 * - Other legal documents
 * 
 * @example
 * ```tsx
 * <LegalPageTemplate
 *   title="Privacy Policy"
 *   lastUpdated="2026-01-15"
 *   sections={privacySections}
 *   tableOfContents={true}
 * />
 * ```
 */

import * as React from "react";
import { Button } from "../components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/core/card";
import { cn } from "../lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSubsection[];
}

export interface LegalSubsection {
  id: string;
  title: string;
  content: string | React.ReactNode;
}

export interface LegalPageTemplateProps {
  /** Document title */
  title: string;
  /** Document subtitle/type */
  subtitle?: string;
  /** Last updated date */
  lastUpdated: string;
  /** Effective date (if different from last updated) */
  effectiveDate?: string;
  /** Legal sections */
  sections: LegalSection[];
  /** Show table of contents */
  showTableOfContents?: boolean;
  /** Company/organization name */
  companyName?: string;
  /** Contact email */
  contactEmail?: string;
  /** Document version */
  version?: string;
  /** Back button handler */
  onBack?: () => void;
  /** Print handler */
  onPrint?: () => void;
  /** Download handler */
  onDownload?: () => void;
  /** Section click handler (for table of contents) */
  onSectionClick?: (sectionId: string) => void;
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

interface TableOfContentsProps {
  sections: LegalSection[];
  onSectionClick?: (sectionId: string) => void;
}

function TableOfContents({ sections, onSectionClick }: TableOfContentsProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav className="space-y-1">
          {sections.map((section, index) => (
            <div key={section.id}>
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full py-1"
                onClick={() => onSectionClick?.(section.id)}
              >
                {index + 1}. {section.title}
              </button>
              {section.subsections && section.subsections.length > 0 && (
                <div className="pl-4 space-y-0.5">
                  {section.subsections.map((sub, subIndex) => (
                    <button
                      key={sub.id}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors text-left w-full py-0.5"
                      onClick={() => onSectionClick?.(sub.id)}
                    >
                      {index + 1}.{subIndex + 1}. {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}

interface LegalSectionContentProps {
  section: LegalSection;
  index: number;
}

function LegalSectionContent({ section, index }: LegalSectionContentProps) {
  return (
    <section id={section.id} className="scroll-mt-8">
      <h2 className="text-xl font-bold mb-4">
        {index + 1}. {section.title}
      </h2>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {typeof section.content === "string" ? (
          <p className="text-muted-foreground whitespace-pre-wrap">{section.content}</p>
        ) : (
          section.content
        )}
      </div>
      
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-6 space-y-6 pl-4 border-l-2 border-muted">
          {section.subsections.map((subsection, subIndex) => (
            <div key={subsection.id} id={subsection.id} className="scroll-mt-8">
              <h3 className="text-lg font-semibold mb-2">
                {index + 1}.{subIndex + 1}. {subsection.title}
              </h3>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {typeof subsection.content === "string" ? (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {subsection.content}
                  </p>
                ) : (
                  subsection.content
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function LegalPageTemplate({
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  sections,
  showTableOfContents = true,
  companyName = "SKAI Trading",
  contactEmail,
  version,
  onBack,
  onPrint,
  onDownload,
  onSectionClick,
  headerContent,
  footerContent,
  className,
}: LegalPageTemplateProps) {
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    } else {
      // Default scroll behavior
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={cn("min-h-screen", className)}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  ← Back
                </Button>
              )}
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint}>
                  Print
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className={cn(
          "grid gap-8",
          showTableOfContents ? "lg:grid-cols-[1fr_250px]" : ""
        )}>
          {/* Document Content */}
          <div className="space-y-8">
            {/* Meta Info */}
            <Card>
              <CardContent className="py-6">
                <div className="grid gap-4 sm:grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(lastUpdated).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {effectiveDate && (
                    <div>
                      <p className="text-muted-foreground">Effective Date</p>
                      <p className="font-medium">
                        {new Date(effectiveDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {version && (
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">{version}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {headerContent}

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <LegalSectionContent
                  key={section.id}
                  section={section}
                  index={index}
                />
              ))}
            </div>

            {/* Contact Info */}
            {contactEmail && (
              <Card>
                <CardContent className="py-6">
                  <h3 className="font-semibold mb-2">Questions?</h3>
                  <p className="text-sm text-muted-foreground">
                    If you have any questions about this {title.toLowerCase()}, 
                    please contact us at{" "}
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </p>
                </CardContent>
              </Card>
            )}

            {footerContent}

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground pt-8 border-t">
              <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          {showTableOfContents && (
            <div className="hidden lg:block">
              <TableOfContents 
                sections={sections} 
                onSectionClick={handleSectionClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LegalPageTemplate;
