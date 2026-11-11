/**
 * Checks the real content in src/content, and the RDF that comes out of it.
 * If this file fails after you add an episode, the message says what to fix.
 */
import { fileURLToPath } from 'node:url';
import { Parser, Store, DataFactory } from 'n3';
import { describe, expect, it } from 'vitest';
import { compileGraph } from '../src/lib/graph/compile.ts';
import { prefixes, toJsonLd } from '../src/lib/graph/jsonld.ts';
import { loadContent } from '../src/lib/graph/load-fs.ts';
import { toNQuads, toTurtle } from '../src/lib/graph/rdf.ts';
import { routeTable } from '../src/lib/graph/routes.ts';

const { namedNode } = DataFactory;
const contentDir = fileURLToPath(new URL('../src/content', import.meta.url));
const { graph, warnings } = compileGraph(loadContent(contentDir), { siteUrl: 'https://example.test' });
const ns = prefixes(graph);

describe('the published content', () => {
  it('compiles with no problems and no warnings', () => {
    expect(warnings).toEqual([]);
    expect(graph.posts.length).toBeGreaterThan(0);
  });

  it('numbers episodes consecutively from 1', () => {
    expect(graph.posts.map((p) => p.episode)).toEqual(graph.posts.map((_, i) => i + 1));
  });

  it('routes every identifier to a page', () => {
    for (const [id, path] of Object.entries(routeTable(graph))) {
      expect(path, id).toMatch(/^\/(things|claims|episodes)\//);
    }
  });
});

describe('the RDF export', async () => {
  const nquads = await toNQuads(toJsonLd(graph));
  const store = new Store(new Parser({ format: 'N-Quads' }).parse(nquads));

  it('describes every record', () => {
    const typed = (term: string) => store.getSubjects(namedNode(`${ns.rdf}type`), namedNode(`${ns.bu}${term}`), null).length;
    expect(typed('Observation')).toBe(graph.observations.length);
    expect(typed('Claim')).toBe(graph.claims.length);
    expect(typed('Assessment')).toBe(graph.assessments.length);
    expect(typed('Episode')).toBe(graph.posts.length);
  });

  it('never asserts a claimed triple as a fact', () => {
    for (const claim of graph.claims) {
      if (!claim.subject || !claim.predicate || !claim.object) continue;
      const asserted = store.getQuads(namedNode(ns.id + claim.subject), namedNode(ns.bu + claim.predicate), namedNode(ns.id + claim.object), null);
      expect(asserted, claim.id).toHaveLength(0);
    }
  });

  it('does assert household facts from the entity registry', () => {
    const relations = graph.entities.flatMap((e) => e.relations.map((r) => [e.id, r.predicate, r.object]));
    expect(relations.length).toBeGreaterThan(0);
    for (const [subject, predicate, object] of relations) {
      expect(store.getQuads(namedNode(ns.id + subject), namedNode(ns.bu + predicate), namedNode(ns.id + object), null)).toHaveLength(1);
    }
  });

  it('uses only identifiers under the site address for its own records', () => {
    const subjects = store.getSubjects(null, null, null).filter((s) => s.termType === 'NamedNode').map((s) => s.value);
    expect(subjects.every((iri) => iri.startsWith('https://example.test/'))).toBe(true);
    expect(store.getSubjects(null, null, null).some((s) => s.termType === 'BlankNode')).toBe(false);
  });

  it('is deterministic and serialises to Turtle', async () => {
    expect(await toNQuads(toJsonLd(graph))).toBe(nquads);
    const turtle = await toTurtle(nquads, ns);
    expect(new Parser().parse(turtle)).toHaveLength(store.size);
  });
});
