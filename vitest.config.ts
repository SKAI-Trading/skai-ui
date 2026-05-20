import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // Visual regression tests have their own config (vitest.visual.config.ts +
    // `npm run test:visual`). Excluding them from the default runner avoids
    // missing-snapshot drift bleeding into the default `npm test` signal.
    exclude: [
      "node_modules/**",
      "dist/**",
      "src/**/*.visual.test.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/components/**/*.tsx"],
      exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
    },
  },
});
