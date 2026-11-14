// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mossscott.com',
  build: { format: 'directory' },

  // App preview images are pulled from each app's own site at build time.
  image: { remotePatterns: [{ protocol: 'https' }] },

  // .mdx files are Markdown that can also place a component, such as a figure.
  integrations: [mdx()],

  // Code blocks carry colors for both themes; global.css picks one.
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
