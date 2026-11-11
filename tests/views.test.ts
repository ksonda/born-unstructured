import { describe, expect, it } from 'vitest';
import { compileGraph } from '../src/lib/graph/compile.ts';
import { neighbourhood } from '../src/lib/graph/neighborhood.ts';
import { beliefs, disagreements, manyNames, whyIsHeCrying, withdrawalsBy } from '../src/lib/graph/queries.ts';
import { explorerPath, pathFor, routeTable } from '../src/lib/graph/routes.ts';
import { claimStatus, cutoff, entityTimeline, evidenceFor, latestPositions } from '../src/lib/graph/views.ts';
import { fixture, options } from './fixtures.ts';

const { graph } = compileGraph(fixture(), options);

describe('positions and status', () => {
  it('keeps one latest position per person', () => {
    const positions = latestPositions(graph, 'claim-walking');
    expect(positions.map((p) => [p.by, p.stance])).toEqual([
      ['dad', 'withdraws'],
      ['mom', 'questions'],
    ]);
  });

  it('calls a claim previously held once nobody supports it any more', () => {
    expect(claimStatus(graph, 'claim-walking')).toBe('withdrawn');
  });

  it('answers as of an earlier episode without rewriting history', () => {
    const then = cutoff(graph, 1);
    expect(claimStatus(then, 'claim-walking')).toBe('held');
    expect(latestPositions(then, 'claim-walking').map((p) => p.stance)).toEqual(['strongly-endorses']);
    expect(then.entities.map((e) => e.id)).not.toContain('mom');
    expect(then.entities.find((e) => e.id === 'walking')!.aliases.map((a) => a.label)).toEqual(['laps']);
    // The full graph is untouched.
    expect(graph.assessments).toHaveLength(3);
  });

  it('treats support plus doubt as a dispute', () => {
    const input = fixture();
    input.posts[1].data.assessments.pop();
    const disputed = compileGraph(input, options).graph;
    expect(claimStatus(disputed, 'claim-walking')).toBe('disputed');
    expect(disagreements(disputed).map((b) => b.claim.id)).toEqual(['claim-walking']);
  });

  it('keeps a claim open while the only positions on it are undecided', () => {
    const input = fixture();
    input.posts[0].data.assessments[0].stance = 'undecided';
    input.posts[1].data.assessments = [];
    const open = compileGraph(input, options).graph;
    expect(claimStatus(open, 'claim-walking')).toBe('unassessed');
    expect(disagreements(open)).toEqual([]);
  });

  it('calls a claim previously held when its only supporter becomes undecided', () => {
    const input = fixture();
    input.posts[1].data.assessments = [{ id: 'a-2', claim: 'claim-walking', by: 'dad', stance: 'undecided', evidence: [] }];
    expect(claimStatus(compileGraph(input, options).graph, 'claim-walking')).toBe('withdrawn');
  });

  it('collects the evidence cited for a claim', () => {
    expect(evidenceFor(graph, 'claim-walking').map((o) => o.id)).toEqual(['obs-1']);
  });
});

describe('household questions', () => {
  it('lists what a person endorsed and later withdrew', () => {
    const [row] = withdrawalsBy(graph, 'dad');
    expect(row.endorsed.stance).toBe('strongly-endorses');
    expect(row.withdrawn.episode).toBe(2);
    expect(withdrawalsBy(graph, 'mom')).toEqual([]);
    expect(withdrawalsBy(cutoff(graph, 1), 'dad')).toEqual([]);
  });

  it('ranks things by how many names they have', () => {
    expect(manyNames(graph).map((e) => e.id)).toEqual(['walking']);
    expect(manyNames(graph, 'object')).toEqual([]);
  });

  it('groups every claim with its status', () => {
    expect(beliefs(graph).map((b) => [b.claim.id, b.status])).toEqual([['claim-walking', 'withdrawn']]);
  });

  it('still cannot say why he is crying', () => {
    expect(whyIsHeCrying(graph).results).toHaveLength(0);
  });
});

describe('timelines and routes', () => {
  it('builds an entity biography in publication order', () => {
    const kinds = entityTimeline(graph, 'walking').map((e) => `${e.episode}:${e.kind}`);
    expect(kinds).toEqual(['1:appearance', '1:observation', '1:claim', '1:assessment', '2:appearance', '2:alias', '2:assessment', '2:assessment']);
  });

  it('gives every record a page', () => {
    expect(pathFor(graph, 'walking')).toBe('/things/walking/');
    expect(pathFor(graph, 'claim-walking')).toBe('/claims/claim-walking/');
    expect(pathFor(graph, 'episode-02')).toBe('/episodes/second/');
    expect(pathFor(graph, 'obs-1')).toBe('/episodes/first/#obs-1');
    expect(pathFor(graph, 'a-3')).toBe('/claims/claim-walking/#a-3');
    expect(Object.keys(routeTable(graph))).toHaveLength(4 + 2 + 1 + 1 + 3);
  });

  it('opens the explorer on a claim with its subject in the middle', () => {
    expect(explorerPath(graph, 'claim-walking')).toBe('/explore/?focus=baby&select=claim-walking');
  });
});

describe('neighbourhood', () => {
  it('draws a subject-predicate-object claim as one edge carrying the claim ID', () => {
    const view = neighbourhood(graph, { focus: 'baby' });
    expect(view.nodes.map((n) => n.id)).toEqual(['baby', 'dad', 'walking']);
    const claim = view.edges.find((e) => e.kind === 'claim')!;
    expect(claim).toMatchObject({ source: 'baby', target: 'walking', record: 'claim-walking', status: 'withdrawn' });
    expect(view.edges.find((e) => e.kind === 'relation')).toMatchObject({ source: 'dad', target: 'baby', label: 'is a parent of' });
  });

  it('turns the claim into a node with positions in provenance mode', () => {
    const view = neighbourhood(graph, { focus: 'baby', provenance: true });
    expect(view.nodes.find((n) => n.id === 'claim-walking')).toMatchObject({ kind: 'claim', variant: 'withdrawn' });
    expect(view.edges.filter((e) => e.kind === 'position').map((e) => `${e.source}:${e.label}`).sort()).toEqual(['dad:withdraws', 'mom:requests a larger sample']);
  });

  it('reports connections it has not drawn, and draws them on request', () => {
    const view = neighbourhood(graph, { focus: 'walking', hiddenTypes: [] });
    expect(view.nodes.find((n) => n.id === 'baby')!.hidden).toBe(1);
    const expanded = neighbourhood(graph, { focus: 'walking', expanded: ['baby'] });
    expect(expanded.nodes.map((n) => n.id)).toContain('dad');
  });

  it('respects type filters', () => {
    const view = neighbourhood(graph, { focus: 'baby', hiddenTypes: ['routine'] });
    expect(view.nodes.map((n) => n.id)).toEqual(['baby', 'dad']);
    expect(view.edges.every((e) => e.kind !== 'claim')).toBe(true);
  });
});
