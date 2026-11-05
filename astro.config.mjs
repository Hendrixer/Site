// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mossscott.com',
  build: { format: 'directory' },
  // App preview images are pulled from each app's own site at build time.
  image: { remotePatterns: [{ protocol: 'https' }] },
});
