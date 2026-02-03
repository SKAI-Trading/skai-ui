/**
 * HelpCenterPageTemplate - Help Documentation and Support Page
 *
 * Pure presentational component for help center UI.
 * All data must be passed via props - NO data fetching or routing logic here.
 *
 * Features:
 * - Category grid with icons
 * - Search functionality
 * - Article list by category
 * - Article detail view
 * - Contact support CTA
 * - Loading states
 * - Breadcrumb navigation
 *
 * @module templates/help-center-page
 */

import * as React from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/core/card";
import { Button } from "../components/core/button";
import { Input } from "../components/core/input";
import { Badge } from "../components/core/badge";
import { Skeleton } from "../components/feedback/skeleton";
import { Separator } from "../components/layout/separator";
import { ScrollArea } from "../components/layout/scroll-area";

// ============================================================================
// ICON COMPONENTS (inline SVGs for independence)
// ============================================================================

const Icons = {
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  BookOpen: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  HelpCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  MessageSquarePlus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="12" y1="7" x2="12" y2="13" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Eye: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

// ============================================================================
// TYPES
// ============================================================================

export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  excerpt?: string;
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type HelpCenterView = "categories" | "category" | "article" | "search";

export interface HelpCenterPageTemplateProps {
  /** Current view type */
  view: HelpCenterView;
  /** Available categories */
  categories: HelpCategory[];
  /** Articles to display */
  articles: HelpArticle[];
  /** Current article (for article view) */
  currentArticle?: HelpArticle | null;
  /** Current category id */
  currentCategoryId?: string | null;
  /** Search query */
  searchQuery: string;
  /** Whether data is loading */
  isLoading: boolean;
  /** Search change handler */
  onSearchChange: (query: string) => void;
  /** Category click handler */
  onCategoryClick: (categoryId: string) => void;
  /** Article click handler */
  onArticleClick: (slug: string) => void;
  /** Back navigation handler */
  onBack: () => void;
  /** Contact support handler */
  onContactSupport: () => void;
  /** Render article content (parsed markdown) */
  renderArticleContent?: (content: string) => React.ReactNode;
  /** Optional class name */
  className?: string;
}

// ============================================================================
// SKELETON
// ============================================================================

export function HelpCenterPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto mb-8" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT CONTENT RENDERER
// ============================================================================

function DefaultContentRenderer({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split("\n");

  return (
    <div className="prose prose-sm max-w-none">
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="text-2xl font-bold mb-4">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-semibold mb-3 mt-6">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-medium mb-2 mt-4">
              {line.slice(4)}
            </h3>
          );
        }
        // List items
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={i} className="ml-4 text-muted-foreground">
              {line.slice(2)}
            </li>
          );
        }
        // Numbered items
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={i} className="ml-4 text-muted-foreground list-decimal">
              {line.replace(/^\d+\.\s/, "")}
            </li>
          );
        }
        // Empty lines
        if (!line.trim()) {
          return <div key={i} className="h-2" />;
        }
        // Regular paragraphs
        return (
          <p key={i} className="text-muted-foreground mb-2">
            {line}
          </p>
        );
      })}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Categories grid view
 */
function CategoriesView({
  categories,
  searchQuery,
  onSearchChange,
  onCategoryClick,
  onContactSupport,
}: {
  categories: HelpCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick: (categoryId: string) => void;
  onContactSupport: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Find answers, guides, and get support
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card
              key={cat.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onCategoryClick(cat.id)}
            >
              <CardHeader className="pb-2">
                <Icon className={cn("w-8 h-8 mb-2", cat.color)} />
                <CardTitle className="text-lg">{cat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{cat.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Support */}
      <Separator className="my-8" />

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
        <p className="text-muted-foreground mb-6">
          Can't find what you're looking for? Contact our support team.
        </p>
        <Button size="lg" onClick={onContactSupport}>
          <Icons.MessageSquarePlus className="w-5 h-5 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
}

/**
 * Category articles list view
 */
function CategoryView({
  category,
  articles,
  isLoading,
  onBack,
  onArticleClick,
}: {
  category?: HelpCategory;
  articles: HelpArticle[];
  isLoading: boolean;
  onBack: () => void;
  onArticleClick: (slug: string) => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <Icons.ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </button>

      {/* Category header */}
      {category && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <category.icon className={cn("w-8 h-8", category.color)} />
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      )}

      {/* Articles list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icons.BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No articles in this category yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onArticleClick(article.slug)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    {article.viewsCount !== undefined && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icons.Eye className="w-3 h-3" />
                          {article.viewsCount} views
                        </span>
                      </div>
                    )}
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Article detail view
 */
function ArticleView({
  article,
  category,
  isLoading,
  onBack,
  renderContent,
}: {
  article?: HelpArticle | null;
  category?: HelpCategory;
  isLoading: boolean;
  onBack: () => void;
  renderContent?: (content: string) => React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <Card>
          <CardContent className="py-12 text-center">
            <Icons.HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground">
              The article you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <Icons.ArrowLeft className="w-4 h-4" />
        Back to {category?.name || "Help"}
      </button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <Badge variant="outline" className={cn("font-normal", category.color)}>
                {category.name}
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          {(article.updatedAt || article.viewsCount !== undefined) && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.updatedAt && (
                <span className="flex items-center gap-1">
                  <Icons.Clock className="w-3 h-3" />
                  Updated {new Date(article.updatedAt).toLocaleDateString()}
                </span>
              )}
              {article.viewsCount !== undefined && (
                <span className="flex items-center gap-1">
                  <Icons.Eye className="w-3 h-3" />
                  {article.viewsCount} views
                </span>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[calc(100vh-300px)]">
            {renderContent ? (
              renderContent(article.content)
            ) : (
              <DefaultContentRenderer content={article.content} />
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Search results view
 */
function SearchResultsView({
  searchQuery,
  articles,
  isLoading,
  onSearchChange,
  onArticleClick,
  onBack,
}: {
  searchQuery: string;
  articles: HelpArticle[];
  isLoading: boolean;
  onSearchChange: (query: string) => void;
  onArticleClick: (slug: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <Icons.ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </button>

      {/* Search */}
      <div className="relative mb-8">
        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-lg"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Search Results for "{searchQuery}"
      </h2>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icons.Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onArticleClick(article.slug)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {article.category}
                    </Badge>
                    <h3 className="font-semibold mb-1">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HelpCenterPageTemplate({
  view,
  categories,
  articles,
  currentArticle,
  currentCategoryId,
  searchQuery,
  isLoading,
  onSearchChange,
  onCategoryClick,
  onArticleClick,
  onBack,
  onContactSupport,
  renderArticleContent,
  className,
}: HelpCenterPageTemplateProps) {
  const currentCategory = currentCategoryId
    ? categories.find((c) => c.id === currentCategoryId)
    : undefined;

  // Loading skeleton
  if (isLoading && view === "categories") {
    return <HelpCenterPageSkeleton />;
  }

  return (
    <div className={cn(className)}>
      {view === "categories" && (
        <CategoriesView
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onCategoryClick={onCategoryClick}
          onContactSupport={onContactSupport}
        />
      )}

      {view === "category" && (
        <CategoryView
          category={currentCategory}
          articles={articles}
          isLoading={isLoading}
          onBack={onBack}
          onArticleClick={onArticleClick}
        />
      )}

      {view === "article" && (
        <ArticleView
          article={currentArticle}
          category={currentCategory}
          isLoading={isLoading}
          onBack={onBack}
          renderContent={renderArticleContent}
        />
      )}

      {view === "search" && (
        <SearchResultsView
          searchQuery={searchQuery}
          articles={articles}
          isLoading={isLoading}
          onSearchChange={onSearchChange}
          onArticleClick={onArticleClick}
          onBack={onBack}
        />
      )}
    </div>
  );
}

export default HelpCenterPageTemplate;
