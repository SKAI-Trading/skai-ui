import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import skaiPreset from "./tailwind-preset";

// Stock tailwind-merge only knows Tailwind's default scales. Any `text-*` it
// doesn't recognise it treats as a text colour, so `text-para-2 text-white`
// used to lose the size, and `text-white text-para-2` lost the colour. The same
// happened to the preset's shadows (read as shadow colours) and gradients (read
// as bg colours). The keys come from the preset object Tailwind builds from, so
// a token added there is known here without a second list to keep in sync.
const themeExtend = skaiPreset.theme?.extend ?? {};

function themeKeys(scale: unknown): string[] {
  if (!scale || typeof scale !== "object") return [];
  // DEFAULT is the bare class (`shadow`), which tailwind-merge already knows.
  return Object.keys(scale).filter((key) => key !== "DEFAULT");
}

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: themeKeys(themeExtend.fontSize) }],
      shadow: [{ shadow: themeKeys(themeExtend.boxShadow) }],
      "bg-image": [{ bg: themeKeys(themeExtend.backgroundImage) }],
    },
  },
});

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
