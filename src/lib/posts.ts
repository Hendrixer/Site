import { getCollection } from 'astro:content';

// Drafts are visible in `npm run dev` so you can preview them, and are
// left out of builds, so they never reach the live site.
const published = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;

export async function getIdeas() {
  const ideas = await getCollection('ideas', published);
  return ideas.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getResearch() {
  return getCollection('research', published);
}
