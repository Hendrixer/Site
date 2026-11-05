# mossscott.com

Personal site built with Astro and served by a Cloudflare Worker, which also runs the email inbox.

## Commands

```bash
npm run dev      # local site at http://localhost:4321
npm run build    # static build into ./dist
npm run deploy   # build, then deploy the Worker to mossscott.com
```

## Content

Every section stays hidden until it has at least one entry, so the homepage only shows what's real.

| What | Where |
| --- | --- |
| Name, intro, Now line, links, Work with me copy | `src/data/site.ts` |
| AI research posts | one Markdown file per post in `src/content/research/` (set `url` to link out instead) |
| Apps (cards with icons) | `src/content/apps.json`, icons in `public/icons/` |
| Open source | `src/content/oss.json` (set `repo` to read star counts from GitHub at build time) |
| Videos | `src/content/videos.json` (set `youtubeId` to use the real thumbnail) |
| Portrait | `public/portrait.jpg` (square), replaces the initials |

The field definitions are in `src/content.config.ts`. A CMS can replace any of these files with an Astro content loader without changing the page.

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
