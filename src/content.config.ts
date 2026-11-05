import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// AI research posts: one Markdown file each in src/content/research.
// Set `url` to link out (a paper, a thread) instead of hosting the post here.
const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    url: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Apps show as cards. Drop the icon in public/icons and point `icon` at it.
const apps = defineCollection({
  loader: file('src/content/apps.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    platform: z.string(),
    year: z.number(),
    icon: z.string(),
    tint: z.string(),
    url: z.string(),
  }),
});

// Open source. If `repo` is set ("owner/name"), the star count is read
// from GitHub at build time and `stars` is only the fallback.
const oss = defineCollection({
  loader: file('src/content/oss.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string(),
    repo: z.string().optional(),
    stars: z.number().default(0),
    snippet: z.string().optional(),
  }),
});

// Videos. With `youtubeId` the real thumbnail is used; without it,
// a typeset placeholder thumbnail is drawn from `thumb`.
const videos = defineCollection({
  loader: file('src/content/videos.json'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    duration: z.string(),
    views: z.string(),
    url: z.string(),
    youtubeId: z.string().optional(),
    thumb: z
      .object({ text: z.string(), bg: z.string(), fg: z.string() })
      .optional(),
  }),
});

export const collections = { research, apps, oss, videos };
