import type { APIRoute } from 'astro';
import { prefixes, toJsonLd } from '../../lib/graph/jsonld.ts';
import { toNQuads, toTurtle } from '../../lib/graph/rdf.ts';
import { getSiteGraph } from '../../lib/site-graph.ts';

/** The same dataset as Turtle, for reading. */
export const GET: APIRoute = async () => {
  const graph = await getSiteGraph();
  const turtle = await toTurtle(await toNQuads(toJsonLd(graph)), prefixes(graph));
  return new Response(turtle, { headers: { 'Content-Type': 'text/turtle; charset=utf-8' } });
};
