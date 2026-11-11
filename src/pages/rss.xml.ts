import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { withBase } from '../lib/paths.ts';
import { getSiteGraph } from '../lib/site-graph.ts';
import { SITE } from '../site.config.ts';

export async function GET(context: APIContext) {
  const graph = await getSiteGraph();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(withBase('/'), context.site!).href,
    items: [...graph.posts].reverse().map((post) => ({
      title: `Episode ${post.episode}: ${post.title}`,
      description: post.summary,
      pubDate: new Date(`${post.published}T12:00:00Z`),
      link: withBase(`/episodes/${post.slug}/`),
    })),
  });
}
