/**
 * Turns the compiled graph into the small picture a reader actually looks at.
 *
 * The data is richer than the drawing. By default a claim with a subject and
 * an object is ONE dashed edge ("Dad thinks walking helps"), carrying the
 * claim's ID so a click can open the full record. "Provenance" mode draws the
 * claim as its own node with who proposed it and who currently thinks what.
 */
import type { CompiledGraph } from './compile.ts';
import type { EntityType } from './schema.ts';
import { stance, type ClaimStatus } from './stances.ts';
import { claimStatus, latestPositions } from './views.ts';

export interface ViewNode {
  id: string;
  label: string;
  kind: 'entity' | 'claim' | 'observation';
  /** Entity type, or claim status, or "observation". Drives colour and shape. */
  variant: EntityType | ClaimStatus | 'observation';
  /** Steps from the focus. 0 is the focus itself. */
  ring: number;
  /** Connections that exist but are not drawn yet. */
  hidden: number;
  /** Site path of a photo to draw inside the node. */
  image?: string;
}

export interface ViewEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  kind: 'relation' | 'claim' | 'about' | 'evidence' | 'position' | 'refines';
  /** The record a click on this edge should open, if any. */
  record: string | null;
  status: ClaimStatus | null;
}

export interface GraphView {
  nodes: ViewNode[];
  edges: ViewEdge[];
  /** The node to draw in the middle. */
  centre?: string;
}

export interface ViewOptions {
  focus: string;
  /** Nodes whose every connection should be drawn. */
  expanded?: string[];
  hiddenTypes?: EntityType[];
  showClaims?: boolean;
  showObservations?: boolean;
  provenance?: boolean;
  /** How many of the focus's connections to draw before the reader asks for more. */
  limit?: number;
}

interface Full {
  nodes: Map<string, Omit<ViewNode, 'ring' | 'hidden'> & { seq: number }>;
  edges: ViewEdge[];
}

const shorten = (text: string, max = 46) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** Everything that could be drawn under the current display options. */
function fullView(graph: CompiledGraph, options: ViewOptions): Full {
  const hiddenTypes = new Set(options.hiddenTypes ?? []);
  const showClaims = options.showClaims ?? true;
  const nodes: Full['nodes'] = new Map();
  const edges: ViewEdge[] = [];
  const predicateLabel = (id: string) => graph.predicates.find((p) => p.id === id)?.label ?? id;

  for (const e of graph.entities) {
    if (hiddenTypes.has(e.type)) continue;
    nodes.set(e.id, { id: e.id, label: e.label, kind: 'entity', variant: e.type, seq: e.mentionedIn[e.mentionedIn.length - 1], ...(e.image ? { image: e.image } : {}) });
  }
  for (const e of graph.entities) {
    for (const r of e.relations) {
      if (!nodes.has(e.id) || !nodes.has(r.object)) continue;
      edges.push({
        id: `rel:${e.id}:${r.predicate}:${r.object}`,
        source: e.id,
        target: r.object,
        label: predicateLabel(r.predicate),
        kind: 'relation',
        record: null,
        status: null,
      });
    }
  }

  const claimNodes = new Set<string>();
  if (showClaims) {
    for (const c of graph.claims) {
      const status = claimStatus(graph, c.id);
      const asEdge = !options.provenance && c.subject && c.object;
      if (asEdge) {
        if (!nodes.has(c.subject!) || !nodes.has(c.object!)) continue;
        edges.push({ id: `claim:${c.id}`, source: c.subject!, target: c.object!, label: shorten(c.short), kind: 'claim', record: c.id, status });
        continue;
      }
      const about = c.about.filter((id) => nodes.has(id));
      if (about.length === 0) continue;
      claimNodes.add(c.id);
      nodes.set(c.id, { id: c.id, label: shorten(c.short), kind: 'claim', variant: status, seq: c.seq });
      for (const id of about) {
        const role = id === c.subject ? 'subject' : id === c.object ? predicateLabel(c.predicate!) : '';
        const outward = id === c.object;
        edges.push({
          id: `about:${c.id}:${id}`,
          source: outward ? c.id : id,
          target: outward ? id : c.id,
          label: role,
          kind: 'about',
          record: c.id,
          status,
        });
      }
      if (options.provenance) {
        for (const position of latestPositions(graph, c.id)) {
          if (!nodes.has(position.by)) continue;
          edges.push({
            id: `position:${c.id}:${position.by}`,
            source: position.by,
            target: c.id,
            label: stance(position.stance).label.toLowerCase(),
            kind: 'position',
            record: c.id,
            status,
          });
        }
      }
    }
    for (const c of graph.claims) {
      if (c.refines && claimNodes.has(c.id) && claimNodes.has(c.refines)) {
        edges.push({ id: `refines:${c.id}`, source: c.id, target: c.refines, label: 'refines', kind: 'refines', record: c.id, status: null });
      }
    }
  }

  if (options.showObservations) {
    for (const o of graph.observations) {
      const about = o.about.filter((id) => nodes.has(id));
      if (about.length === 0) continue;
      nodes.set(o.id, { id: o.id, label: shorten(o.text, 38), kind: 'observation', variant: 'observation', seq: o.seq });
      for (const id of about) {
        edges.push({ id: `obs:${o.id}:${id}`, source: o.id, target: id, label: '', kind: 'about', record: o.id, status: null });
      }
      const cited = new Set(graph.assessments.filter((a) => a.evidence.includes(o.id)).map((a) => a.claim));
      for (const claimId of cited) {
        if (claimNodes.has(claimId)) {
          edges.push({ id: `evidence:${o.id}:${claimId}`, source: o.id, target: claimId, label: 'cited for', kind: 'evidence', record: o.id, status: null });
        }
      }
    }
  }

  return { nodes, edges };
}

function adjacency(full: Full): Map<string, Set<string>> {
  const adjacent = new Map<string, Set<string>>();
  for (const id of full.nodes.keys()) adjacent.set(id, new Set());
  for (const edge of full.edges) {
    adjacent.get(edge.source)?.add(edge.target);
    adjacent.get(edge.target)?.add(edge.source);
  }
  return adjacent;
}

/**
 * Neighbours of a node, treating claim and observation nodes as connectors:
 * reaching one also reaches the entities on its far side.
 */
function reach(full: Full, adjacent: Map<string, Set<string>>, id: string): string[] {
  const reached = new Set<string>();
  for (const neighbour of adjacent.get(id) ?? []) {
    reached.add(neighbour);
    if (full.nodes.get(neighbour)!.kind !== 'entity') {
      for (const far of adjacent.get(neighbour) ?? []) if (far !== id) reached.add(far);
    }
  }
  return [...reached];
}

/** The picture around one focus entity. */
export function neighbourhood(graph: CompiledGraph, options: ViewOptions): GraphView {
  const full = fullView(graph, options);
  if (!full.nodes.has(options.focus)) return { nodes: [], edges: [] };
  const adjacent = adjacency(full);
  const expanded = new Set(options.expanded ?? []);
  const limit = options.limit ?? 14;

  const visible = new Set<string>([options.focus]);
  const focusReach = reach(full, adjacent, options.focus);
  if (expanded.has(options.focus) || focusReach.length <= limit) {
    focusReach.forEach((id) => visible.add(id));
  } else {
    // Most recently active connections first; the rest wait behind "Expand connections".
    const direct = [...(adjacent.get(options.focus) ?? [])].sort(
      (a, b) => full.nodes.get(b)!.seq - full.nodes.get(a)!.seq || a.localeCompare(b),
    );
    for (const id of direct) {
      if (visible.size > limit) break;
      visible.add(id);
      if (full.nodes.get(id)!.kind !== 'entity') {
        for (const far of adjacent.get(id) ?? []) visible.add(far);
      }
    }
  }
  for (const id of expanded) {
    if (!full.nodes.has(id) || !visible.has(id)) continue;
    reach(full, adjacent, id).forEach((n) => visible.add(n));
  }

  const edges = full.edges.filter((e) => visible.has(e.source) && visible.has(e.target));

  // Rings: breadth-first distance from the focus across what is drawn.
  const ring = new Map<string, number>([[options.focus, 0]]);
  const queue = [options.focus];
  while (queue.length) {
    const current = queue.shift()!;
    for (const next of adjacent.get(current) ?? []) {
      if (visible.has(next) && !ring.has(next)) {
        ring.set(next, ring.get(current)! + 1);
        queue.push(next);
      }
    }
  }

  const nodes: ViewNode[] = [...visible]
    .sort((a, b) => a.localeCompare(b))
    .map((id) => {
      const { seq: _seq, ...node } = full.nodes.get(id)!;
      return {
        ...node,
        ring: ring.get(id) ?? 2,
        hidden: reach(full, adjacent, id).filter((n) => !visible.has(n)).length,
      };
    });

  return { nodes, edges, centre: options.focus };
}

/** The handful of things one post is about, with the claims it touched. */
export function postView(graph: CompiledGraph, postId: string): GraphView {
  const post = graph.posts.find((p) => p.id === postId);
  if (!post) return { nodes: [], edges: [] };
  const touched = new Set([
    ...graph.claims.filter((c) => c.post === postId).map((c) => c.id),
    ...graph.assessments.filter((a) => a.post === postId).map((a) => a.claim),
  ]);
  const full = fullView(graph, { focus: '' });
  const mentioned = new Set(post.mentions);
  const keep = new Set<string>();
  for (const [id, node] of full.nodes) {
    if (node.kind === 'entity' ? mentioned.has(id) : touched.has(id)) keep.add(id);
  }
  const edges = full.edges.filter((e) => {
    if (!keep.has(e.source) || !keep.has(e.target)) return false;
    return e.kind === 'relation' || (e.record !== null && touched.has(e.record));
  });
  const degree = new Map<string, number>();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }
  const ids = [...keep].filter((id) => degree.has(id)).sort((a, b) => a.localeCompare(b));
  if (ids.length === 0) return { nodes: [], edges: [] };

  // Arrange around whichever thing the post has most to say about.
  const centre = ids.reduce((best, id) => (degree.get(id)! > degree.get(best)! ? id : best), ids[0]);
  const ring = new Map<string, number>([[centre, 0]]);
  const queue = [centre];
  while (queue.length) {
    const current = queue.shift()!;
    for (const e of edges) {
      const next = e.source === current ? e.target : e.target === current ? e.source : null;
      if (next && !ring.has(next)) {
        ring.set(next, ring.get(current)! + 1);
        queue.push(next);
      }
    }
  }
  const nodes: ViewNode[] = ids.map((id) => {
    const { seq: _seq, ...node } = full.nodes.get(id)!;
    return { ...node, ring: ring.get(id) ?? 1, hidden: 0 };
  });
  return { nodes, edges, centre };
}
