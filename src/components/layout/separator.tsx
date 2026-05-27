import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../../lib/utils";

type SeparatorTone = "default" | "bright" | "dark";

const toneClass: Record<SeparatorTone, string> = {
  default: "bg-border",
  // Bright: deep teal accent (Figma canonical brand divider)
  bright: "bg-[#123F3C]",
  // Dark: faded green-coal divider (40% alpha on near-black)
  dark: "bg-[#001615]/40",
};

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /**
   * Divider tone. Defaults to `"default"` (theme `bg-border`).
   * - `"bright"` — deep teal accent (#123F3C)
   * - `"dark"`  — faded green-coal (#001615 @ 40%)
   */
  tone?: SeparatorTone;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      tone = "default",
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        toneClass[tone],
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
export type { SeparatorProps, SeparatorTone };
