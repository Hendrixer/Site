import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The homepage is driven by content.json at the repo root.
// These collections hold the pages written in Markdown.

const post = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string().optional(),
  // Drafts show while running `npm run dev` and are left out of the live site.
  draft: z.boolean().default(false),
});

// Research write-ups: add a Markdown file here, then link to
// /research/<filename>/ from a research item in content.json.
const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: post.extend({ summary: z.string() }),
});

// Ideas: each Markdown file becomes /ideas/<filename>/ and is listed in the
// Ideas section of the homepage, newest first. Use .mdx to place a figure
// component in the text. Files starting with _ are ignored, which is how
// _template.md stays off the site.
const ideas = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/ideas' }),
  schema: post,
});

export const collections = { research, ideas };
