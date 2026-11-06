// Reads and validates content.json at the repo root.
// The page renders sections in the order they appear in `sections`,
// and items in the order they appear in each section's `items`.
// A section with no items (or "hidden": true) isn't rendered, except Work with me.
import { z } from 'astro/zod';
import raw from '../../content.json';

const link = z.strictObject({ label: z.string(), url: z.string().default('') });

const research = z.strictObject({
  type: z.literal('research'),
  title: z.string().default('AI Research'),
  hidden: z.boolean().default(false),
  items: z
    .array(
      z.strictObject({
        title: z.string(),
        url: z.string(),
        date: z.coerce.date().optional(),
        summary: z.string().optional(),
      }),
    )
    .default([]),
});

const work = z.strictObject({
  type: z.literal('work'),
  title: z.string().default('Work with me'),
  hidden: z.boolean().default(false),
  lead: z.string().default(''),
  body: z.string().default(''),
  email: z.string(),
  cta: z.string().default('Get in touch'),
  items: z
    .array(
      z.strictObject({
        title: z.string(),
        tag: z.string().optional(),
        description: z.string(),
      }),
    )
    .default([]),
});

const apps = z.strictObject({
  type: z.literal('apps'),
  title: z.string().default('Apps'),
  hidden: z.boolean().default(false),
  link: link.optional(),
  items: z
    .array(
      z.strictObject({
        name: z.string(),
        // One line shown next to the name.
        description: z.string(),
        // Longer copy under the card: what the app is, and why you made it.
        about: z.string().optional(),
        why: z.string().optional(),
        url: z.string(),
        // Preview image. Leave it out to use the og:image from the app's site.
        image: z.string().optional(),
        icon: z.string().optional(),
        tint: z.string().default('#8a8a85'),
        platform: z.string().optional(),
        year: z.union([z.number(), z.string()]).optional(),
      }),
    )
    .default([]),
});

const oss = z.strictObject({
  type: z.literal('oss'),
  title: z.string().default('Open source'),
  hidden: z.boolean().default(false),
  link: link.optional(),
  items: z
    .array(
      z.strictObject({
        name: z.string(),
        description: z.string(),
        url: z.string(),
        repo: z.string().optional(),
        stars: z.number().optional(),
        snippet: z.string().optional(),
      }),
    )
    .default([]),
});

const videos = z.strictObject({
  type: z.literal('videos'),
  title: z.string().default('Videos'),
  hidden: z.boolean().default(false),
  link: link.optional(),
  items: z
    .array(
      z.strictObject({
        title: z.string(),
        url: z.string(),
        youtubeId: z.string().optional(),
        date: z.coerce.date().optional(),
        duration: z.string().optional(),
        views: z.string().optional(),
        thumb: z.strictObject({ text: z.string(), bg: z.string(), fg: z.string() }).optional(),
      }),
    )
    .default([]),
});

const courses = z.strictObject({
  type: z.literal('courses'),
  title: z.string().default('Courses'),
  hidden: z.boolean().default(false),
  link: link.optional(),
  items: z
    .array(
      z.strictObject({
        title: z.string(),
        url: z.string(),
        image: z.string().optional(),
        description: z.string().optional(),
        duration: z.string().optional(),
        date: z.coerce.date().optional(),
      }),
    )
    .default([]),
});

const brand = z.strictObject({ name: z.string(), logo: z.string() });

const schema = z.strictObject({
  // Inline logos. Write {key} in the intro (or Work with me text), e.g. {netflix}.
  brands: z.record(z.string(), brand).default({}),
  profile: z.strictObject({
    name: z.string(),
    initials: z.string().default(''),
    tagline: z.string().default(''),
    description: z.string().default(''),
    // One paragraph as a string, or several as an array of strings.
    intro: z
      .union([z.string(), z.array(z.string())])
      .default([])
      .transform((v) => (Array.isArray(v) ? v : v ? [v] : [])),
    // Optional button under the intro that opens an email.
    cta: z.strictObject({ label: z.string(), email: z.string(), subject: z.string().default('') }).optional(),
    now: z.string().default(''),
    email: z.string(),
    portrait: z.string().default('/portrait.jpg'),
    links: z
      .object({
        youtube: z.string().default(''),
        github: z.string().default(''),
        x: z.string().default(''),
      })
      .default({ youtube: '', github: '', x: '' }),
  }),
  sections: z.array(z.discriminatedUnion('type', [research, work, courses, apps, oss, videos])),
});

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  throw new Error(`content.json is invalid:\n${z.prettifyError(parsed.error)}`);
}

export const content = parsed.data;
export const profile = content.profile;
export type Section = (typeof content.sections)[number];

// Work with me only needs its lead and email, so it shows even without items.
export const visibleSections = content.sections.filter(
  (s) => !s.hidden && (s.items.length > 0 || s.type === 'work'),
);

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Replaces {key} tokens with the brand's square logo and name.
// Text fields that go through this may also contain plain HTML links.
export function rich(text: string): string {
  return text.replace(/\{([a-z0-9-]+)\}/gi, (match, key: string) => {
    const b = content.brands[key];
    if (!b) return match;
    return `<span class="brand"><img class="logo" src="${escapeAttr(b.logo)}" alt="" width="18" height="18" />${b.name}</span>`;
  });
}
