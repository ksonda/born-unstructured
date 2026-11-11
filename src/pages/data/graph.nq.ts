import type { APIRoute } from 'astro';
import { toJsonLd } from '../../lib/graph/jsonld.ts';
import { toNQuads } from '../../lib/graph/rdf.ts';
import { getSiteGraph } from '../../lib/site-graph.ts';

/** The same dataset as N-Quads. This is the file the SPARQL page loads. */
export const GET: APIRoute = async () => {
  const graph = await getSiteGraph();
  return new Response(await toNQuads(toJsonLd(graph)), {
    headers: { 'Content-Type': 'application/n-quads; charset=utf-8' },
  });
};
