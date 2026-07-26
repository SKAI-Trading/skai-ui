import { createRequire } from "module";
import { defineConfig } from "tsup";

const require_ = createRequire(import.meta.url);

/**
 * tsup's dts pipeline hardcodes `baseUrl: compilerOptions.baseUrl || "."`
 * (tsup/dist/rollup.js), so the dts build always sees a `baseUrl` no matter what
 * tsconfig.json says. TS 6 deprecated `baseUrl` and fails the dts build with
 * TS5101 unless `ignoreDeprecations: "6.0"` is set — but TS 5 rejects that exact
 * value with TS5103. Which TypeScript is loaded depends on where tsup is
 * installed: hoisted to a consuming repo's root (TS 6.0.x there) or inside this
 * package on a standalone clone (the pinned ^5.3.3). So the flag has to follow
 * the resolved compiler instead of being hardcoded either way.
 */
function dtsCompilerOptions(): Record<string, unknown> | undefined {
  let version: string | undefined;
  for (const from of [require_.resolve("tsup"), import.meta.url]) {
    try {
      version = createRequire(from)("typescript/package.json").version;
      break;
    } catch {
      // try the next resolution root
    }
  }
  const major = Number.parseInt(version?.split(".")[0] ?? "", 10);
  return Number.isFinite(major) && major >= 6
    ? { ignoreDeprecations: "6.0" }
    : undefined;
}

const dtsCompilerOpts = dtsCompilerOptions();

export default defineConfig({
  entry: ["src/index.ts", "src/icons.ts", "src/motion.ts"],
  format: ["cjs", "esm"],
  dts: dtsCompilerOpts ? { compilerOptions: dtsCompilerOpts } : true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Silent mode - we show our own build banner
  silent: true,
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
    "framer-motion",
    "sonner",
    "recharts",
  ],
  treeshake: true,
  // Disable minification to avoid variable initialization order issues
  // that conflict with MetaMask's SES lockdown script
  minify: false,
});
