# mossscott.com

Personal site built with Astro and served by a Cloudflare Worker, which also runs the email inbox.

## Commands

```bash
npm run dev      # local site at http://localhost:4321
npm run build    # static build into ./dist
npm run deploy   # build, then deploy the Worker to mossscott.com (pushes to main do this automatically)
```

## Content

Everything on the homepage comes from [`content.json`](content.json).

- `profile` holds your name, tagline, intro, call to action, email and social links. `intro` is a list of paragraphs: the first is set larger, the rest are quieter. Paragraphs can contain HTML links. `cta` is the button under the intro that opens an email (label, address, subject). Leave a link empty to hide it.
- `brands` defines inline logos. Write `{netflix}` or `{yc}` in the intro and it renders as a small square logo followed by the name. Add a brand by putting a square image in `public/logos/` and an entry here.
- `sections` is the page, top to bottom. Reorder the array to reorder the page, and reorder a section's `items` to reorder what's inside it. Nothing is sorted automatically.
- A section with an empty `items` list isn't shown. Set `"hidden": true` to hide one that has items.
- `title` is the heading text. `link` adds a small link next to the heading (for example, your GitHub profile).

Item fields for each section type (`?` means optional):

```jsonc
// "research": rows with a date
{ "title": "Do agents need memory?", "url": "https://...", "date?": "2026-03" }

// "work": shown even with no items. Takes "lead" (the large pitch line), "body",
// "email" and "cta". Items are an optional list of offerings:
{ "title": "Safety and evaluation", "tag?": "AI safety research", "description": "..." }

// "courses": rows with square course art. Put images in public/courses/
{ "title": "AI Agents Fundamentals, v2", "url": "https://master.dev/courses/ai-agents-v2/",
  "image?": "/courses/ai-agents-v2.webp", "description?": "...", "duration?": "7h 10m", "date?": "2026-01-20" }

// "apps": cards led by a preview image. The build reads the og:image from the app's
// own site (url), resizes it and serves it from this domain. Set "image" to override it.
// Put icons in public/icons/. A lone app (or the first of an odd number) spans full width.
{ "name": "Direction", "description": "A Mac app for directors", "url": "https://givedirection.ai",
  "icon?": "/icons/direction.png", "image?": "/apps/direction.jpg",
  "tint?": "#1A1A1D", "platform?": "macOS", "year?": 2026 }

// "oss": rows with stars. With "repo" set, stars come from GitHub at build time.
// "snippet" shows a code preview when hovering the row.
{ "name": "agent-kit", "description": "...", "url": "https://github.com/...",
  "repo?": "owner/name", "stars?": 4212, "snippet?": "npm i agent-kit" }

// "videos": cards. With "youtubeId" set, the real thumbnail is used.
{ "title": "...", "url": "https://youtube.com/watch?v=...", "youtubeId?": "...",
  "date?": "2026-02-10", "duration?": "18:42", "views?": "148k" }
```

The build checks `content.json` and stops with a clear message if a field is missing or misspelled. The rules live in [`src/lib/content.ts`](src/lib/content.ts).

To host a research write-up on the site, add a Markdown file to `src/content/research/` (with `title`, `date` and `summary` at the top), then add a research item pointing at `/research/<filename>/`.

Put a square photo at `public/portrait.jpg` and it replaces the initials.

## Deploys

Pushing to `main` on GitHub rebuilds and deploys the site through Cloudflare Workers Builds. To deploy by hand, run `npm run deploy`.

## Email inbox

Email Routing sends `work@mossscott.com` and `hello@mossscott.com` to the `email()` handler in `worker/index.ts`. Each message is parsed and stored in the `emails` table of the `mossscott-inbox` D1 database with `status = 'new'`.

An agent can work through new mail like this:

```bash
npx wrangler d1 execute mossscott-inbox --remote --command \
  "SELECT id, received_at, mailbox, from_address, from_name, subject, text_body FROM emails WHERE status = 'new' ORDER BY received_at"

npx wrangler d1 execute mossscott-inbox --remote --command \
  "UPDATE emails SET status = 'done', agent_notes = 'Replied with availability', updated_at = datetime('now') WHERE id = 1"
```

To also get a copy in a personal inbox, verify the address (`npx wrangler email routing addresses create you@example.com`) and set a `FORWARD_TO` variable on the Worker.

Schema changes go in `migrations/` and are applied with `npx wrangler d1 migrations apply mossscott-inbox --remote`.

## Design prototypes

`concepts/` holds the earlier design explorations. They aren't part of the build.
