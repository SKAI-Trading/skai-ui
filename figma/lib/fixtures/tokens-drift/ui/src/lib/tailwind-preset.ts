import { skaiBorderRadius, skaiSpacing } from "./design-tokens";

export const skaiPreset = {
  theme: {
    extend: {
      borderRadius: {
        ...skaiBorderRadius,
        lg: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: skaiSpacing,
    },
  },
};
