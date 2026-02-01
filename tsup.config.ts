import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    // Externalize all Radix packages to avoid duplicate React contexts
    /^@radix-ui\/.*/,
    // Externalize other shared dependencies
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "cmdk",
    "input-otp",
    "react-day-picker",
    "react-hook-form",
    "lucide-react",
  ],
  treeshake: true,
  // Disable minification to avoid variable initialization order issues
  // that conflict with MetaMask's SES lockdown script
  minify: false,
});
