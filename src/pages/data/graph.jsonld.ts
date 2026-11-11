import type { APIRoute } from 'astro';
import { toJsonLd } from '../../lib/graph/jsonld.ts';
import { getSiteGraph } from '../../lib/site-graph.ts';

/** The public semantic dataset. */
export const GET: APIRoute = async () => {
  const graph = await getSiteGraph();
  return new Response(JSON.stringify(toJsonLd(graph), null, 2), {
    headers: { 'Content-Type': 'application/ld+json; charset=utf-8' },
  });
};
