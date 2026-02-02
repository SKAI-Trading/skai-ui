/**
 * Vitest Visual Regression Testing Configuration
 *
 * This configures visual regression testing for SKAI UI components.
 * Uses @vitest/snapshot for visual comparisons.
 *
 * Run: npm run test:visual
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'visual',
    include: ['src/**/*.visual.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/visual-setup.ts'],
    // Snapshot configuration
    snapshotFormat: {
      printBasicPrototype: false,
    },
    // Visual test specific settings
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@skai/ui': resolve(__dirname, './src'),
    },
  },
});
