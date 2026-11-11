import { describe, expect, it } from 'vitest';
import { compileGraph, extractProseLinks, GraphValidationError } from '../src/lib/graph/compile.ts';
import { postSchema } from '../src/lib/graph/schema.ts';
import { hasGraphMarker, resolveGraphLinks, splitAtGraph } from '../src/lib/prose.ts';
import { fixture, options } from './fixtures.ts';

const problemsOf = (run: () => unknown): string[] => {
  try {
    run();
  } catch (error) {
    if (error instanceof GraphValidationError) return error.problems;
    throw error;
  }
  return [];
};

describe('compileGraph', () => {
  it('normalises records and attaches their source post', () => {
    const { graph, warnings } = compileGraph(fixture(), options);
    expect(warnings).toEqual([]);
    expect(graph.site.idBase).toBe('https://example.test/id/');
    expect(graph.posts.map((p) => [p.id, p.slug])).toEqual([
      ['first', 'first'],
      ['second', 'second'],
    ]);
    expect(graph.claims[0]).toMatchObject({ post: 'first', seq: 1, about: ['baby', 'walking'] });
    expect(graph.assessments.map((a) => a.sequence)).toEqual([1, 2, 3]);
    expect(graph.observations[0].hasPassage).toBe(true);
  });

  it('derives mentions from prose links and from the records themselves', () => {
    const { graph } = compileGraph(fixture(), options);
    expect(graph.posts[0].mentions.sort()).toEqual(['baby', 'dad', 'walking']);
    expect(graph.posts[1].mentions.sort()).toEqual(['baby', 'dad', 'mom', 'walking']);
    expect(graph.entities.find((e) => e.id === 'mom')!.mentionedIn).toEqual([2]);
  });

  it('dates aliases from the first appearance unless told otherwise', () => {
    const { graph } = compileGraph(fixture(), options);
    expect(graph.entities.find((e) => e.id === 'walking')!.aliases).toEqual([
      { label: 'laps', since: 1 },
      { label: 'the circuit', since: 2 },
    ]);
  });

  it('keeps private entities and drafts out of the graph entirely', () => {
    const input = fixture();
    input.posts.push({
      id: '003-draft',
      body: '',
      data: postSchema.parse({ title: 'Draft', published: '2026-01-15', summary: 'Not yet.', draft: true }),
    });
    const { graph } = compileGraph(input, options);
    expect(graph.entities.map((e) => e.id)).not.toContain('secret');
    expect(graph.latestSeq).toBe(2);
    expect(JSON.stringify(graph)).not.toContain('Secret');
  });

  it('refuses a post that refers to a private entity', () => {
    const input = fixture();
    input.posts[1].body = '[It](thing:secret) was involved.';
    expect(problemsOf(() => compileGraph(input, options))).toEqual(['posts/002-second: linked thing "secret" is a private entity']);
  });

  it('reports every broken reference at once', () => {
    const input = fixture();
    input.posts[1].data.assessments.push(
      { id: 'a-1', claim: 'claim-nope', by: 'walking', stance: 'endorses', evidence: ['obs-9'] },
    );
    const problems = problemsOf(() => compileGraph(input, options));
    expect(problems).toHaveLength(4);
    expect(problems.join('\n')).toMatch(/"a-1" is already used by an assessment/);
    expect(problems.join('\n')).toMatch(/assessor "walking" must be a person/);
    expect(problems.join('\n')).toMatch(/"claim-nope", which is not a claim published by this post or an earlier one/);
    expect(problems.join('\n')).toMatch(/"obs-9", which is not an observation published by this post or an earlier one/);
  });

  it('does not let a post assess a claim from its own future', () => {
    const input = fixture();
    const [first, second] = input.posts;
    first.data.assessments.push({ id: 'a-0', claim: 'claim-later', by: 'mom', stance: 'endorses', evidence: [] });
    second.data.claims.push({ id: 'claim-later', label: 'Later', about: ['baby'], attributedTo: 'mom' });
    expect(problemsOf(() => compileGraph(input, options))).toHaveLength(1);
  });

  it('requires undeclared predicates to be declared', () => {
    const input = fixture();
    input.posts[0].data.claims[0].predicate = 'settlesWtih';
    expect(problemsOf(() => compileGraph(input, options))[0]).toMatch(/predicate "settlesWtih" is not declared/);
  });

  it('warns about an observation with no marked passage', () => {
    const input = fixture();
    input.posts[0].body = 'No links here.';
    const { warnings } = compileGraph(input, options);
    expect(warnings.join('\n')).toMatch(/no passage in the prose is marked with \(obs:obs-1\)/);
  });
});

describe('extractProseLinks', () => {
  it('finds the three link schemes and ignores ordinary links', () => {
    const links = extractProseLinks('[a](thing:x) [b](claim:y) [c](obs:z) [d](https://example.org) [e](/things/x/)');
    expect(links).toEqual({ things: ['x'], claims: ['y'], observations: ['z'] });
  });
});

describe('names that have not happened yet', () => {
  it('leaves out an alias dated after the latest post', () => {
    const input = fixture();
    input.posts[1].data.draft = true;
    const { graph, warnings } = compileGraph(input, options);
    expect(graph.entities.find((e) => e.id === 'walking')!.aliases.map((a) => a.label)).toEqual(['laps']);
    expect(warnings.join('\n')).toMatch(/alias "the circuit" starts on 2026-01-05, after the latest post/);
  });
});

describe('ordering', () => {
  it('orders posts by date, whatever their file names', () => {
    const input = fixture();
    input.posts.reverse();
    input.posts[0].id = 'zzz-second';
    const { graph } = compileGraph(input, options);
    expect(graph.posts.map((p) => [p.title, p.seq])).toEqual([
      ['First', 1],
      ['Second', 2],
    ]);
  });
});

describe('prose markers', () => {
  it('finds the ::graph:: marker and splits the prose around it', () => {
    expect(hasGraphMarker('Before.\n\n::graph::\n\nAfter.')).toBe(true);
    expect(hasGraphMarker('Write ::graph:: on its own line.')).toBe(false);
    expect(splitAtGraph('<p>Before.</p>\n<p>::graph::</p>\n<p>After.</p>')).toEqual({ before: '<p>Before.</p>\n', after: '\n<p>After.</p>' });
    expect(splitAtGraph('<p>No picture.</p>')).toBeNull();
  });

  it('resolves graph links and drops author comments', () => {
    const html = '<p><a href="thing:baby">The Baby</a> <a href="claim:c-1">a theory</a> <a href="obs:o-1">a <em>sight</em></a><!-- note to self --></p>';
    expect(resolveGraphLinks(html, (path) => `/base${path}`)).toBe(
      '<p><a class="ref ref-thing" href="/base/things/baby/">The Baby</a> <a class="ref ref-claim" href="/base/claims/c-1/">a theory</a> <span class="passage" id="o-1">a <em>sight</em></span></p>',
    );
  });
});
