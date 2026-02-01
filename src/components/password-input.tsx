import * as React from "react";
import { cn } from "../lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "./button";

/**
 * Props for the PasswordInput component
 */
export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Error message to display */
  error?: string;
  /** ID for the error message element (for aria-describedby) */
  errorId?: string;
  /** Show strength indicator */
  showStrength?: boolean;
  /** Custom strength calculator */
  strengthCalculator?: (password: string) => PasswordStrength;
}

export type PasswordStrength = "weak" | "fair" | "good" | "strong";

/**
 * Default password strength calculator
 */
function calculateStrength(password: string): PasswordStrength {
  if (!password) return "weak";

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score <= 4) return "fair";
  if (score <= 6) return "good";
  return "strong";
}

const strengthColors: Record<PasswordStrength, string> = {
  weak: "bg-destructive",
  fair: "bg-orange-500",
  good: "bg-yellow-500",
  strong: "bg-green-500",
};

const strengthWidths: Record<PasswordStrength, string> = {
  weak: "w-1/4",
  fair: "w-2/4",
  good: "w-3/4",
  strong: "w-full",
};

const strengthLabels: Record<PasswordStrength, string> = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

/**
 * PasswordInput - Input field with visibility toggle and optional strength indicator
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   showStrength
 *   error={error}
 * />
 * ```
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      error,
      errorId,
      showStrength = false,
      strengthCalculator = calculateStrength,
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [value, setValue] = React.useState("");

    const inputId = id || React.useId();
    const generatedErrorId = React.useId();
    const effectiveErrorId = errorId || generatedErrorId;
    const strengthId = React.useId();

    const strength = strengthCalculator(value);
    const hasError = !!error;

    // Build aria-describedby
    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (hasError) describedByParts.push(effectiveErrorId);
    if (showStrength && value) describedByParts.push(strengthId);
    const finalDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              hasError && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            aria-invalid={hasError}
            aria-describedby={finalDescribedBy}
            onChange={handleChange}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={effectiveErrorId}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Strength indicator */}
        {showStrength && value && (
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  strengthColors[strength],
                  strengthWidths[strength],
                )}
              />
            </div>
            <p
              id={strengthId}
              className="text-xs text-muted-foreground"
              aria-live="polite"
            >
              Password strength: {strengthLabels[strength]}
            </p>
          </div>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput, calculateStrength };
