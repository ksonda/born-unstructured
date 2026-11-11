/**
 * Where each record lives on the site. Paths are root-relative; add the base
 * path with withBase() from src/lib/paths.ts when rendering a link.
 */
import type { CompiledGraph } from './compile.ts';
import { indexById } from './views.ts';

export function pathFor(graph: CompiledGraph, id: string): string | null {
  const found = indexById(graph).get(id);
  if (!found) return null;
  switch (found.kind) {
    case 'entity':
      return `/things/${id}/`;
    case 'claim':
      return `/claims/${id}/`;
    case 'post':
      return `/episodes/${found.record.slug}/`;
    case 'observation': {
      const post = graph.posts.find((p) => p.id === found.record.post)!;
      return found.record.hasPassage ? `/episodes/${post.slug}/#${id}` : `/episodes/${post.slug}/#record`;
    }
    case 'assessment':
      return `/claims/${found.record.claim}/#${id}`;
  }
}

/** Every identifier mapped to its page, for /id/ redirects and for linking query results. */
export function routeTable(graph: CompiledGraph): Record<string, string> {
  const table: Record<string, string> = {};
  for (const id of indexById(graph).keys()) table[id] = pathFor(graph, id)!;
  return table;
}

/** A link into the explorer that lands on the record with its surroundings in view. */
export function explorerPath(graph: CompiledGraph, id: string, through?: number): string | null {
  const found = indexById(graph).get(id);
  if (!found) return null;
  const params = new URLSearchParams();
  if (found.kind === 'entity') {
    params.set('focus', id);
  } else if (found.kind === 'claim') {
    params.set('focus', found.record.subject ?? found.record.about[0]);
    params.set('select', id);
  } else if (found.kind === 'observation') {
    params.set('focus', found.record.about[0]);
    params.set('select', id);
    params.set('show', 'observations');
  } else {
    return null;
  }
  if (through !== undefined) params.set('through', String(through));
  return `/explore/?${params.toString()}`;
}
