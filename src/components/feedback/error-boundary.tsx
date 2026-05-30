import * as React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../core/button";

/**
 * Cross-runtime "is development" check. The skai-ui bundle does not have
 * `process.env.NODE_ENV` statically replaced (see tsup.config.ts), and some
 * consumers may run where `process` is undefined. Falling back via try/catch
 * keeps the boundary itself from throwing inside `render()`.
 */
function isDevelopmentEnv(): boolean {
  try {
    // Access `process` via globalThis so this lib needs no @types/node in its
    // dts build (it ships to browsers; the runtime guard handles undefined).
    const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
      .process;
    if (proc?.env?.NODE_ENV === "development") {
      return true;
    }
  } catch {
    /* sandboxed environments may throw on process access */
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- import.meta typing varies
    const meta: any = (import.meta as any) ?? {};
    if (meta?.env?.DEV === true) return true;
  } catch {
    /* CJS or unavailable */
  }
  return false;
}

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
      <div aria-hidden="true" className="rounded-full bg-destructive/10 p-3">
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
        type="button"
        onClick={resetErrorBoundary}
        className="gap-2"
      >
        <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
        Try again
      </Button>
      {isDevelopmentEnv() && (
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

DefaultErrorFallback.displayName = "DefaultErrorFallback";

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
