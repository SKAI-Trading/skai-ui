import * as React from "react";
import { cn } from "../../lib/utils";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Aspect ratio expressed as width / height (e.g. 16/9 = 1.777). Default 1
   * (square).
   */
  ratio?: number;
}

/**
 * AspectRatio — locks a container to a width/height ratio using the modern
 * `aspect-ratio` CSS property. Children are absolutely positioned and stretched
 * to fill (works well for `<img>`, `<video>`, iframes, charts).
 *
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src={src} alt="" className="h-full w-full object-cover" />
 * </AspectRatio>
 */
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        {...rest}
        className={cn("relative w-full", className)}
        style={{ aspectRatio: `${ratio}`, ...style }}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  },
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
