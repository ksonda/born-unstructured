/**
 * The site's one compiled graph, loaded through Astro's content collections.
 * Every page and every data endpoint starts here.
 */
import { getCollection } from 'astro:content';
import { compileGraph, type CompiledGraph } from './graph/compile.ts';

let cached: Promise<CompiledGraph> | undefined;

async function load(): Promise<CompiledGraph> {
  const [posts, entities, predicates] = await Promise.all([
    getCollection('posts'),
    getCollection('entities'),
    getCollection('predicates'),
  ]);
  const { graph, warnings } = compileGraph(
    {
      posts: posts.map((post) => ({ id: post.id, data: post.data, body: post.body })),
      entities: entities.map((entity) => ({ id: entity.id, data: entity.data })),
      predicates: predicates.map((predicate) => predicate.data),
    },
    { siteUrl: import.meta.env.SITE ?? 'http://localhost:4321' },
  );
  for (const warning of warnings) console.warn(`[graph] ${warning}`);
  return graph;
}

export function getSiteGraph(): Promise<CompiledGraph> {
  // In dev, recompile on every request so content edits show up immediately.
  if (import.meta.env.DEV) return load();
  cached ??= load();
  return cached;
}
