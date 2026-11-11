/**
 * Generates /_redirects, which Cloudflare Pages (and Netlify) read to answer
 * identifier lookups with "303 See Other": the correct response when an IRI
 * names a thing and the page merely describes it.
 */
import type { APIRoute } from 'astro';
import { routeTable } from '../lib/graph/routes.ts';
import { withBase } from '../lib/paths.ts';
import { getSiteGraph } from '../lib/site-graph.ts';

export function getStaticPaths() {
  return [{ params: { file: '_redirects' } }];
}

export const GET: APIRoute = async () => {
  const graph = await getSiteGraph();
  const lines = Object.entries(routeTable(graph)).map(([id, path]) => `${withBase(`/id/${id}`)} ${withBase(path)} 303`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
