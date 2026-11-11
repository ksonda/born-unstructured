/**
 * "Ask the household": the questions readers actually want answered, as plain
 * functions over the compiled graph. Pass a graph from cutoff() to ask them
 * as of an earlier post.
 */
import type { Assessment, Claim, CompiledGraph, Entity, Observation } from './compile.ts';
import { stance, type ClaimStatus } from './stances.ts';
import { claimHistory, claimStatus, latestPositions } from './views.ts';

export interface Withdrawal {
  claim: Claim;
  /** The most confident-sounding thing they said before changing their mind. */
  endorsed: Assessment;
  withdrawn: Assessment;
}

/** Claims a person once supported and whose latest position is a withdrawal. */
export function withdrawalsBy(graph: CompiledGraph, personId: string): Withdrawal[] {
  const results: Withdrawal[] = [];
  for (const claim of graph.claims) {
    const mine = claimHistory(graph, claim.id).filter((a) => a.by === personId);
    const last = mine[mine.length - 1];
    if (!last || last.stance !== 'withdraws') continue;
    const supportive = mine.filter((a) => stance(a.stance).polarity === 'support');
    if (supportive.length === 0) continue;
    const peak =
      supportive.find((a) => a.stance === 'strongly-endorses') ??
      supportive.find((a) => a.stance === 'endorses') ??
      supportive[0];
    results.push({ claim, endorsed: peak, withdrawn: last });
  }
  return results;
}

export type SagaEvent =
  | { kind: 'observation'; seq: number; observation: Observation }
  | { kind: 'claim'; seq: number; claim: Claim }
  | { kind: 'assessment'; seq: number; assessment: Assessment; claim: Claim }
  | { kind: 'alias'; seq: number; entity: Entity; label: string };

/** Everything recorded about a set of entities, in the order it was published. */
export function saga(graph: CompiledGraph, entityIds: string[]): SagaEvent[] {
  const wanted = new Set(entityIds);
  const events: SagaEvent[] = [];
  for (const entity of graph.entities) {
    if (!wanted.has(entity.id)) continue;
    for (const alias of entity.aliases) {
      if (alias.since > entity.mentionedIn[0]) events.push({ kind: 'alias', seq: alias.since, entity, label: alias.label });
    }
  }
  for (const observation of graph.observations) {
    if (observation.about.some((id) => wanted.has(id))) {
      events.push({ kind: 'observation', seq: observation.seq, observation });
    }
  }
  for (const claim of graph.claims) {
    if (!claim.about.some((id) => wanted.has(id))) continue;
    events.push({ kind: 'claim', seq: claim.seq, claim });
    for (const assessment of claimHistory(graph, claim.id)) {
      events.push({ kind: 'assessment', seq: assessment.seq, assessment, claim });
    }
  }
  const order = { alias: 0, observation: 1, claim: 2, assessment: 3 };
  return events.sort((a, b) => a.seq - b.seq || order[a.kind] - order[b.kind]);
}

export interface Belief {
  claim: Claim;
  status: ClaimStatus;
  positions: Assessment[];
}

/** Every claim with its status and each person's latest position. */
export function beliefs(graph: CompiledGraph): Belief[] {
  return graph.claims.map((claim) => ({
    claim,
    status: claimStatus(graph, claim.id),
    positions: latestPositions(graph, claim.id),
  }));
}

/** Claims on which at least one person currently supports and another currently doubts. */
export function disagreements(graph: CompiledGraph): Belief[] {
  return beliefs(graph).filter((b) => b.status === 'disputed' && b.positions.length > 1);
}

/** Entities ranked by how many other names they have picked up. */
export function manyNames(graph: CompiledGraph, type?: Entity['type']): Entity[] {
  return graph.entities
    .filter((e) => e.aliases.length > 0 && (!type || e.type === type))
    .sort((a, b) => b.aliases.length - a.aliases.length || a.label.localeCompare(b.label));
}

export interface NullResult {
  results: never[];
  searched: { observations: number; claims: number; assessments: number; posts: number };
}

/**
 * The permanent query. It has been run against every version of the graph and
 * has never returned a row. This function documents that faithfully.
 */
export function whyIsHeCrying(graph: CompiledGraph): NullResult {
  return {
    results: [],
    searched: {
      observations: graph.observations.length,
      claims: graph.claims.length,
      assessments: graph.assessments.length,
      posts: graph.posts.length,
    },
  };
}
