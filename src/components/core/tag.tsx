import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// =============================================================================
// SKAI Tag — small inline status/category chip
// =============================================================================
// Distinct from Badge (which is a full status pill with semantic colors). Tag
// is for tier accents, brand chips, and muted category labels. Tones use
// direct hex from `tierColors` in design-tokens.ts (the repo has no CSS-var
// layer for tier colors yet — matches `badge.tsx`'s inline-hex pattern).
// =============================================================================

const tagVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border",
  {
    variants: {
      tone: {
        // Tier tones (hex sourced from `tierColors` in lib/design-tokens.ts)
        bronze:
          "bg-[#CD7F32]/10  border-[#CD7F32]/30  text-[#CD7F32]",
        silver:
          "bg-[#C0C0C0]/10  border-[#C0C0C0]/30  text-[#C0C0C0]",
        gold:
          "bg-[#FFD700]/10  border-[#FFD700]/30  text-[#FFD700]",
        diamond:
          "bg-[#B9F2FF]/10  border-[#B9F2FF]/30  text-[#B9F2FF]",
        platinum:
          "bg-[#E5E4E2]/10  border-[#E5E4E2]/30  text-[#E5E4E2]",
        legend:
          "bg-[#9333EA]/10  border-[#9333EA]/30  text-[#9333EA]",
        // Brand tones (Figma canonical hex)
        "sky-blue":
          "bg-[#56C7F3]/10  border-[#56C7F3]/30  text-[#56C7F3]",
        "alien-green":
          "bg-[#17F9B4]/10  border-[#17F9B4]/30  text-[#17F9B4]",
        // Neutral
        muted:
          "bg-white/5      border-white/15      text-white/70",
      },
      variant: {
        fill: "",
        stroke: "bg-transparent",
      },
    },
    defaultVariants: {
      tone: "muted",
      variant: "fill",
    },
  },
);

export interface TagProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, tone, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(tagVariants({ tone, variant }), className)}
        {...props}
      />
    );
  },
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
