import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/scripts/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest }), tsconfigPaths()],
  build: {
    chunkSizeWarningLimit: 3200,
  },
});
