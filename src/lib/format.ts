// Star counts come from GitHub at build time when a repo is set.
// Any failure (rate limit, offline, renamed repo) falls back to the number in oss.json.
export async function getStars(repo: string | undefined, fallback: number): Promise<number> {
  if (!repo) return fallback;
  try {
    const token = import.meta.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'mossscott.com build',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? fallback;
  } catch {
    return fallback;
  }
}

export function compact(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`;
}

export function monthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function longDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
