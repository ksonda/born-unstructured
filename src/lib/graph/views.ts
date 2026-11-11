/**
 * Read-only views over a compiled graph: time travel, current positions,
 * timelines and lookups. Pure functions, shared by the build and the browser.
 */
import type { Assessment, Claim, CompiledGraph, Entity, Observation, Post } from './compile.ts';
import { shortDate } from '../format.ts';
import { stance, type ClaimStatus } from './stances.ts';

/** The graph as it stood once the post at position `through` had been published. */
export function cutoff(graph: CompiledGraph, through: number): CompiledGraph {
  if (through >= graph.latestSeq) return graph;
  const entities = graph.entities
    .filter((e) => e.mentionedIn[0] <= through)
    .map((e) => ({
      ...e,
      aliases: e.aliases.filter((a) => a.since <= through),
      mentionedIn: e.mentionedIn.filter((n) => n <= through),
    }));
  const present = new Set(entities.map((e) => e.id));
  for (const entity of entities) {
    entity.relations = entity.relations.filter((r) => present.has(r.object));
  }
  const posts = graph.posts.filter((p) => p.seq <= through);
  return {
    ...graph,
    latestSeq: posts.length ? posts[posts.length - 1].seq : 0,
    entities,
    posts,
    observations: graph.observations.filter((o) => o.seq <= through),
    claims: graph.claims.filter((c) => c.seq <= through),
    assessments: graph.assessments.filter((a) => a.seq <= through),
  };
}

export type GraphRecord =
  | { kind: 'entity'; record: Entity }
  | { kind: 'post'; record: Post }
  | { kind: 'observation'; record: Observation }
  | { kind: 'claim'; record: Claim }
  | { kind: 'assessment'; record: Assessment };

export function indexById(graph: CompiledGraph): Map<string, GraphRecord> {
  const index = new Map<string, GraphRecord>();
  for (const record of graph.entities) index.set(record.id, { kind: 'entity', record });
  for (const record of graph.posts) index.set(record.id, { kind: 'post', record });
  for (const record of graph.observations) index.set(record.id, { kind: 'observation', record });
  for (const record of graph.claims) index.set(record.id, { kind: 'claim', record });
  for (const record of graph.assessments) index.set(record.id, { kind: 'assessment', record });
  return index;
}

export function entityLabel(graph: CompiledGraph, id: string): string {
  return graph.entities.find((e) => e.id === id)?.label ?? id;
}

export function postFor(graph: CompiledGraph, postId: string): Post | undefined {
  return graph.posts.find((p) => p.id === postId);
}

/** Every assessment of a claim, oldest first. */
export function claimHistory(graph: CompiledGraph, claimId: string): Assessment[] {
  return graph.assessments.filter((a) => a.claim === claimId).sort((a, b) => a.sequence - b.sequence);
}

/** Each person's most recent assessment of a claim. Nobody's view overwrites anybody else's. */
export function latestPositions(graph: CompiledGraph, claimId: string): Assessment[] {
  const latest = new Map<string, Assessment>();
  for (const assessment of claimHistory(graph, claimId)) latest.set(assessment.by, assessment);
  return [...latest.values()];
}

export function claimStatus(graph: CompiledGraph, claimId: string): ClaimStatus {
  const history = claimHistory(graph, claimId);
  if (history.length === 0) return 'unassessed';
  const polarities = latestPositions(graph, claimId).map((a) => stance(a.stance).polarity);
  const supported = polarities.includes('support');
  const doubted = polarities.includes('doubt');
  if (supported && doubted) return 'disputed';
  if (supported) return 'held';
  const everSupported = history.some((a) => stance(a.stance).polarity === 'support');
  if (everSupported) return 'withdrawn';
  // Nobody has ever backed it. If nobody is doubting it either, it is simply an open question.
  return doubted ? 'disputed' : 'unassessed';
}

/** Observations cited by any assessment of the claim, oldest first. */
export function evidenceFor(graph: CompiledGraph, claimId: string): Observation[] {
  const cited = new Set(claimHistory(graph, claimId).flatMap((a) => a.evidence));
  return graph.observations.filter((o) => cited.has(o.id));
}

/** Assessments that cite an observation. */
export function citationsOf(graph: CompiledGraph, observationId: string): Assessment[] {
  return graph.assessments.filter((a) => a.evidence.includes(observationId));
}

export function claimsInvolving(graph: CompiledGraph, entityId: string): Claim[] {
  return graph.claims.filter((c) => c.about.includes(entityId));
}

/** Claims a person has proposed or taken a position on. */
export function claimsAssessedBy(graph: CompiledGraph, personId: string): Claim[] {
  const ids = new Set(graph.assessments.filter((a) => a.by === personId).map((a) => a.claim));
  return graph.claims.filter((c) => ids.has(c.id) || c.attributedTo === personId);
}

export function observationsAbout(graph: CompiledGraph, entityId: string): Observation[] {
  return graph.observations.filter((o) => o.about.includes(entityId));
}

export function refinementsOf(graph: CompiledGraph, claimId: string): Claim[] {
  return graph.claims.filter((c) => c.refines === claimId);
}

export type TimelineEvent =
  | { kind: 'appearance'; seq: number; post: Post; first: boolean }
  | { kind: 'alias'; seq: number; label: string }
  | { kind: 'observation'; seq: number; observation: Observation }
  | { kind: 'claim'; seq: number; claim: Claim }
  | { kind: 'assessment'; seq: number; assessment: Assessment; claim: Claim };

const EVENT_ORDER: Record<TimelineEvent['kind'], number> = {
  appearance: 0,
  alias: 1,
  observation: 2,
  claim: 3,
  assessment: 4,
};

/** An entity's biography: appearances, names acquired, observations and the claims made about it. */
export function entityTimeline(graph: CompiledGraph, entityId: string): TimelineEvent[] {
  const entity = graph.entities.find((e) => e.id === entityId);
  if (!entity) return [];
  const events: TimelineEvent[] = [];
  entity.mentionedIn.forEach((seq, i) => {
    const post = graph.posts.find((p) => p.seq === seq);
    if (post) events.push({ kind: 'appearance', seq, post, first: i === 0 });
  });
  for (const alias of entity.aliases) {
    if (alias.since > entity.mentionedIn[0]) events.push({ kind: 'alias', seq: alias.since, label: alias.label });
  }
  for (const observation of observationsAbout(graph, entityId)) {
    events.push({ kind: 'observation', seq: observation.seq, observation });
  }
  const claims = claimsInvolving(graph, entityId);
  for (const claim of claims) {
    events.push({ kind: 'claim', seq: claim.seq, claim });
    for (const assessment of claimHistory(graph, claim.id)) {
      events.push({ kind: 'assessment', seq: assessment.seq, assessment, claim });
    }
  }
  return events.sort((a, b) => a.seq - b.seq || EVENT_ORDER[a.kind] - EVENT_ORDER[b.kind]);
}

/** What one post added to the record. */
export function contributionOf(graph: CompiledGraph, postId: string) {
  return {
    observations: graph.observations.filter((o) => o.post === postId),
    claims: graph.claims.filter((c) => c.post === postId),
    assessments: graph.assessments.filter((a) => a.post === postId),
  };
}

/** The publication date of the post at a position, as "Nov 11, 2026". */
export function dateOf(graph: CompiledGraph, seq: number): string {
  const post = graph.posts.find((p) => p.seq === seq);
  return post ? shortDate(post.published) : '';
}

/** The post at a position. */
export function postAt(graph: CompiledGraph, seq: number): Post | undefined {
  return graph.posts.find((p) => p.seq === seq);
}

/**
 * Reads a "through" value from a URL: a date (the record as of the last post
 * published on or before it) or, for older links, a post position.
 */
export function parseThrough(graph: CompiledGraph, value: string | null): number | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const upTo = graph.posts.filter((p) => p.published <= value);
    return upTo.length ? upTo[upTo.length - 1].seq : 1;
  }
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, graph.latestSeq) : null;
}

/** The "through" value to put in a URL for a post position: its date. */
export function throughParam(graph: CompiledGraph, seq: number): string {
  return postAt(graph, seq)?.published ?? String(seq);
}
