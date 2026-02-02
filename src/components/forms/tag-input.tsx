import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "../core/badge";

export interface TagInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  /** Current tags array */
  value?: string[];
  /** Callback when tags change */
  onValueChange?: (tags: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Minimum tag length */
  minLength?: number;
  /** Maximum tag length */
  maxLength?: number;
  /** Allow duplicate tags */
  allowDuplicates?: boolean;
  /** Keys that trigger tag creation (default: Enter, comma) */
  triggerKeys?: string[];
  /** Custom tag validation function */
  validateTag?: (tag: string) => boolean;
  /** Render custom tag badge */
  renderTag?: (tag: string, onRemove: () => void) => React.ReactNode;
  /** Badge variant for tags */
  tagVariant?: "default" | "secondary" | "destructive" | "outline";
  /** Custom className for the container */
  className?: string;
  /** Custom className for tags */
  tagClassName?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * TagInput - Multi-value input with tag badges
 *
 * Features:
 * - Add tags by pressing Enter or comma
 * - Remove tags with backspace or click X
 * - Duplicate prevention (configurable)
 * - Max tags limit
 * - Custom validation
 * - Accessible keyboard navigation
 *
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onValueChange={setTags}
 *   placeholder="Add tags..."
 *   maxTags={5}
 * />
 * ```
 */
const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value = [],
      onValueChange,
      placeholder = "Add tag...",
      maxTags,
      minLength = 1,
      maxLength = 50,
      allowDuplicates = false,
      triggerKeys = ["Enter", ","],
      validateTag,
      renderTag,
      tagVariant = "secondary",
      className,
      tagClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    const addTag = (tag: string) => {
      const trimmed = tag.trim();

      // Validation checks
      if (trimmed.length < minLength) return;
      if (trimmed.length > maxLength) return;
      if (!allowDuplicates && value.includes(trimmed)) return;
      if (maxTags && value.length >= maxTags) return;
      if (validateTag && !validateTag(trimmed)) return;

      onValueChange?.([...value, trimmed]);
      setInputValue("");
    };

    const removeTag = (index: number) => {
      if (disabled) return;
      const newTags = value.filter((_, i) => i !== index);
      onValueChange?.(newTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (triggerKeys.includes(e.key)) {
        e.preventDefault();
        if (inputValue.trim()) {
          addTag(inputValue);
        }
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeTag(value.length - 1);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // If comma is a trigger key, split and add tags
      if (triggerKeys.includes(",") && newValue.includes(",")) {
        const parts = newValue.split(",");
        parts.slice(0, -1).forEach((part) => {
          if (part.trim()) addTag(part);
        });
        setInputValue(parts[parts.length - 1]);
      } else {
        setInputValue(newValue);
      }
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    const isMaxReached = maxTags ? value.length >= maxTags : false;

    return (
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        onClick={handleContainerClick}
        role="group"
        aria-label="Tag input"
      >
        {value.map((tag, index) =>
          renderTag ? (
            <React.Fragment key={`${tag}-${index}`}>
              {renderTag(tag, () => removeTag(index))}
            </React.Fragment>
          ) : (
            <Badge
              key={`${tag}-${index}`}
              variant={tagVariant}
              className={cn("gap-1 pr-1", tagClassName)}
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                  className="ml-1 rounded-full outline-none ring-offset-background hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ),
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? "" : placeholder}
          disabled={disabled || isMaxReached}
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
            "min-w-[120px]",
            disabled && "cursor-not-allowed",
          )}
          aria-label="Add new tag"
          {...props}
        />
      </div>
    );
  },
);

TagInput.displayName = "TagInput";

export { TagInput };
