import type { APIRoute } from 'astro';
import { getSiteGraph } from '../../lib/site-graph.ts';

/** The compiled graph in the shape the explorer and the Ask page use. Not a public contract. */
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await getSiteGraph()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
