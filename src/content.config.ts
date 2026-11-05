import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The homepage is driven by content.json at the repo root.
// This collection is only for research write-ups hosted on the site:
// add a Markdown file here, then link to /research/<filename>/ from a
// research item in content.json.
const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { research };
