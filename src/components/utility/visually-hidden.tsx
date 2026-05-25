import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Render the child element instead of a wrapping <span>. */
  asChild?: boolean;
}

/**
 * VisuallyHidden — content that's available to assistive tech but visually
 * hidden. Use for descriptive labels on icon-only buttons, section landmarks,
 * skip-link text, etc. Matches the WAI-ARIA Authoring Practices "sr-only"
 * recipe (positioned off-screen, 1px clipped) so it remains readable by
 * screen readers and copy/paste-able.
 *
 * @example
 * <button>
 *   <TrashIcon aria-hidden="true" />
 *   <VisuallyHidden>Delete row</VisuallyHidden>
 * </button>
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ asChild = false, style, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        // Inline style so this works even when consumers haven't loaded the
        // Tailwind preset (e.g. embedded in plain-HTML pages or Storybook
        // controls). Matches Radix/Reach VisuallyHidden semantics.
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          wordWrap: "normal",
          border: 0,
          ...style,
        }}
        {...props}
      />
    );
  },
);
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
