export const greenCoalColors = {
  300: "#001615",
  100: "#123F3C", // fixture: line 3
  200: "#122524",
} as const;

// IGNORED: "#FF0000" lives in a comment and must not be read
export const accentColors = {
  appGreen300: "#2DEDAD" /* IGNORED */,
  indigo: "#6366F1",
};

export const skaiBorderRadius = {
  sm: "4px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "24px",
} as const;

export const skaiSpacing = {
  "0.5": "2px",
  "4": "16px",
} as const;

export const skaiFontSizes = {
  "para-2": [
    "0.875rem",
    { lineHeight: "1.125rem", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
};

export const skaiShadows = {
  inputHint: "0px 4px 12px rgba(0, 0, 0, 0.24)",
};
