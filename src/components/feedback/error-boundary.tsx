import * as React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../core/button";

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode;
  /** Custom fallback UI */
  fallback?: React.ReactNode;
  /** Custom error component */
  FallbackComponent?: React.ComponentType<FallbackProps>;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Callback when reset is triggered */
  onReset?: () => void;
}

export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors in child components
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.FallbackComponent) {
        return (
          <this.props.FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
const DefaultErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        "rounded-lg border border-destructive/20 bg-destructive/5",
      )}
    >
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangleIcon className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-destructive">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={resetErrorBoundary}
        className="gap-2"
      >
        <RefreshCwIcon className="h-4 w-4" />
        Try again
      </Button>
      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 w-full max-w-md text-left">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            Error details
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

/**
 * Hook to programmatically show error boundary
 */
export function useErrorBoundary(): {
  showBoundary: (error: Error) => void;
} {
  const [, setError] = React.useState<Error | null>(null);

  const showBoundary = React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);

  return { showBoundary };
}

export { ErrorBoundary, DefaultErrorFallback };
