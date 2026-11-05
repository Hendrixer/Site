import { getImage } from 'astro:assets';

// Reads a page's og:image (or twitter:image) at build time.
// Returns undefined on any failure so the card can fall back to its icon tile.
export async function findOgImage(pageUrl: string): Promise<string | undefined> {
  if (!/^https?:\/\//.test(pageUrl)) return undefined;
  try {
    const res = await fetch(pageUrl, {
      headers: { accept: 'text/html', 'user-agent': 'Mozilla/5.0 (compatible; mossscott.com build)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const meta = (key: string) => {
      const attr = `(?:property|name)=["']${key}["']`;
      const content = `content=["']([^"']+)["']`;
      return (
        html.match(new RegExp(`<meta[^>]*${attr}[^>]*${content}`, 'i'))?.[1] ??
        html.match(new RegExp(`<meta[^>]*${content}[^>]*${attr}`, 'i'))?.[1]
      );
    };
    const found = meta('og:image') ?? meta('twitter:image');
    return found ? new URL(found, res.url).toString() : undefined;
  } catch {
    return undefined;
  }
}

// Turns a preview image (a local /path or a remote URL) into an optimized
// WebP served from this site. Remote images that can't be processed are
// used as-is rather than failing the build.
export async function previewFor(image: string | undefined, pageUrl: string) {
  const src = image ?? (await findOgImage(pageUrl));
  if (!src) return undefined;
  if (src.startsWith('/')) return { src, srcset: undefined };
  try {
    const img = await getImage({ src, inferSize: true, widths: [640, 1200], format: 'webp', quality: 80 });
    return { src: img.src, srcset: img.srcSet.attribute || undefined };
  } catch {
    return { src, srcset: undefined };
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
