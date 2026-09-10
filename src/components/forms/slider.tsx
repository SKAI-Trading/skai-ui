import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, defaultValue, value, ...props }, ref) => {
  // Render one Thumb per value so range / multi-handle sliders work out of
  // the box. Previously only one Thumb was emitted, so passing
  // `defaultValue={[10, 50]}` rendered just the first handle.
  const values = (value ?? defaultValue ?? [0]) as number[];
  const thumbCount = Math.max(1, values.length);

  return (
    <SliderPrimitive.Root
      ref={ref}
      defaultValue={defaultValue}
      value={value}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      {/* The track is `bg-muted`, not shadcn's stock `bg-secondary`: the dark
          theme sets --secondary and --primary to the same triple, so a
          secondary track was drawn in the fill colour end to end and every
          slider read as maxed out wherever the thumb sat. --secondary cannot
          move — it also paints the Badge and Button secondary variants — so
          the track takes an inert token instead. Call sites that have a
          measured track colour keep overriding this; an arbitrary variant
          outranks the base class. */}
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
