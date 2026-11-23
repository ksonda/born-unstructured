import { describe, expect, it } from 'vitest';
import { compileGraph } from '../src/lib/graph/compile.ts';
import { toJsonLd, vocabulary } from '../src/lib/graph/jsonld.ts';
import { toNQuads } from '../src/lib/graph/rdf.ts';
import { copyKindSchema, entitySchema, predicateSchema } from '../src/lib/graph/schema.ts';
import { fixture, options } from './fixtures.ts';

const withMappedPredicate = () => {
  const input = fixture();
  input.predicates = input.predicates.map((p) =>
    p.id === 'settlesWith' ? predicateSchema.parse({ ...p, subPropertyOf: ['prov:wasInfluencedBy', 'schema:isBasedOn'] }) : p,
  );
  return compileGraph(input, options).graph;
};

describe('mapping site predicates to standard vocabularies', () => {
  it('defaults to no mappings', () => {
    expect(predicateSchema.parse({ id: 'parentOf', label: 'is a parent of' }).subPropertyOf).toEqual([]);
  });

  it('accepts prefixed names from the vocabularies the site already uses', () => {
    const parsed = predicateSchema.parse({ id: 'quotesFrom', label: 'quotes from', subPropertyOf: ['prov:wasQuotedFrom', 'owl:sameAs'] });
    expect(parsed.subPropertyOf).toEqual(['prov:wasQuotedFrom', 'owl:sameAs']);
  });

  it('rejects full IRIs and unknown prefixes', () => {
    expect(() => predicateSchema.parse({ id: 'x', label: 'x', subPropertyOf: ['http://www.w3.org/ns/prov#wasDerivedFrom'] })).toThrow();
    expect(() => predicateSchema.parse({ id: 'x', label: 'x', subPropertyOf: ['frbroo:R2'] })).toThrow();
  });

  it('lists the mappings in the vocabulary, and nothing for unmapped predicates', () => {
    const terms = vocabulary(withMappedPredicate());
    expect(terms.find((t) => t.term === 'settlesWith')?.extra).toEqual({ subPropertyOf: ['prov:wasInfluencedBy', 'schema:isBasedOn'] });
    expect(terms.find((t) => t.term === 'parentOf')?.extra).toEqual({ subPropertyOf: [] });
  });

  it('publishes them as rdfs:subPropertyOf triples', async () => {
    const nquads = await toNQuads(toJsonLd(withMappedPredicate()));
    const sub = '<http://www.w3.org/2000/01/rdf-schema#subPropertyOf>';
    const settles = '<https://example.test/vocab#settlesWith>';
    expect(nquads).toContain(`${settles} ${sub} <http://www.w3.org/ns/prov#wasInfluencedBy> .`);
    expect(nquads).toContain(`${settles} ${sub} <https://schema.org/isBasedOn> .`);
    expect(nquads).not.toContain(`<https://example.test/vocab#parentOf> ${sub}`);
  });
});

const withCopies = (copyKinds: object[]) => {
  const input = fixture();
  input.predicates.push(
    predicateSchema.parse({ id: 'adaptationOf', label: 'is an adaptation of', subPropertyOf: ['prov:wasDerivedFrom'] }),
    predicateSchema.parse({ id: 'quotesFrom', label: 'quotes from', subPropertyOf: ['prov:wasQuotedFrom'] }),
  );
  input.entities.push(
    { id: 'lullaby', data: entitySchema.parse({ label: 'the lullaby', type: 'concept' }) },
    {
      id: 'remix',
      data: entitySchema.parse({
        label: 'the remix',
        type: 'concept',
        language: 'fr',
        sameAs: ['https://en.wikipedia.org/wiki/Remix'],
        types: ['schema:MusicComposition'],
        relations: [
          { predicate: 'adaptationOf', object: 'lullaby', by: ['mom'], date: '1969' },
          { predicate: 'quotesFrom', object: 'lullaby' },
        ],
      }),
    },
  );
  input.posts[0].body += ' [The lullaby](thing:lullaby) and [the remix](thing:remix).';
  input.copyKinds = copyKinds.map((k) => copyKindSchema.parse(k));
  return input;
};

const ADAPTING = { id: 'Adapting', label: 'adapting', copy: 'adaptation', keeps: 'Enough to recognize it', changes: 'Whatever the new context calls for', predicates: ['adaptationOf'] };
const QUOTING = { id: 'Quoting', label: 'quoting', copy: 'quotation', keeps: 'A few lines', changes: 'Everything else', predicates: ['quotesFrom'], qualifiedAs: 'quotation' };

describe('kinds of copy as PROV activities', () => {
  const PROV = 'http://www.w3.org/ns/prov#';
  const BU = 'https://example.test/vocab#';
  const RDF_TYPE = '<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>';

  it('defaults to a plain derivation and rejects lowercase ids', () => {
    expect(copyKindSchema.parse({ ...ADAPTING }).qualifiedAs).toBe('derivation');
    expect(() => copyKindSchema.parse({ ...ADAPTING, id: 'adapting' })).toThrow();
  });

  it('refuses a kind of copy whose predicate is not declared', () => {
    const input = withCopies([{ ...ADAPTING, predicates: ['remixOf'] }]);
    expect(() => compileGraph(input, options)).toThrow(/remixOf/);
  });

  it('publishes each kind as a subclass of prov:Activity with its definition', async () => {
    const nquads = await toNQuads(toJsonLd(compileGraph(withCopies([ADAPTING]), options).graph));
    expect(nquads).toContain(`<${BU}Adapting> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <${PROV}Activity> .`);
    expect(nquads).toContain(`<${BU}Adapting> <${BU}keeps> "Enough to recognize it" .`);
    expect(nquads).toContain(`<${BU}adaptationOf> <${BU}activityType> <${BU}Adapting> .`);
  });

  it('spells each asserted copy out in PROV, with the activity that made it', async () => {
    const nquads = await toNQuads(toJsonLd(compileGraph(withCopies([ADAPTING, QUOTING]), options).graph));
    const remix = '<https://example.test/id/remix>';
    const lullaby = '<https://example.test/id/lullaby>';
    expect(nquads).toContain(`${remix} <${PROV}wasDerivedFrom> ${lullaby} .`);
    expect(nquads).toContain(`${remix} <${PROV}wasQuotedFrom> ${lullaby} .`);
    const activity = '<https://example.test/id/remix#adapting-lullaby>';
    const derivation = '<https://example.test/id/remix#adapting-lullaby-derivation>';
    expect(nquads).toContain(`${remix} <${PROV}qualifiedDerivation> ${derivation} .`);
    expect(nquads).toContain(`${derivation} <${PROV}entity> ${lullaby} .`);
    expect(nquads).toContain(`${derivation} <${PROV}hadActivity> ${activity} .`);
    expect(nquads).toContain(`${activity} ${RDF_TYPE} <${BU}Adapting> .`);
    expect(nquads).toContain(`${remix} <${PROV}qualifiedQuotation> <https://example.test/id/remix#quoting-lullaby-quotation> .`);
    expect(nquads).not.toContain('_:');
  });

  it('leaves relations without a kind of copy alone', async () => {
    const input = withCopies([]);
    const remix = input.entities.find((e) => e.id === 'remix')!;
    remix.data = entitySchema.parse({ ...remix.data, relations: remix.data.relations.map(({ predicate, object }) => ({ predicate, object })) });
    const nquads = await toNQuads(toJsonLd(compileGraph(input, options).graph));
    expect(nquads).not.toContain(`${PROV}qualifiedDerivation`);
  });
});

describe('who, when and where for copies', () => {
  const PROV = 'http://www.w3.org/ns/prov#';
  const remix = '<https://example.test/id/remix>';

  it('names who made the copy and when', async () => {
    const nquads = await toNQuads(toJsonLd(compileGraph(withCopies([ADAPTING, QUOTING]), options).graph));
    const activity = '<https://example.test/id/remix#adapting-lullaby>';
    expect(nquads).toContain(`${activity} <${PROV}wasAssociatedWith> <https://example.test/id/mom> .`);
    expect(nquads).toContain(`${activity} <http://purl.org/dc/terms/date> "1969"^^<http://www.w3.org/2001/XMLSchema#gYear> .`);
  });

  it('publishes reference pages, language and extra classes', async () => {
    const nquads = await toNQuads(toJsonLd(compileGraph(withCopies([ADAPTING]), options).graph));
    expect(nquads).toContain(`${remix} <https://schema.org/sameAs> <https://en.wikipedia.org/wiki/Remix> .`);
    expect(nquads).toContain(`${remix} <http://purl.org/dc/terms/language> "fr" .`);
    expect(nquads).toContain(`${remix} <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://schema.org/MusicComposition> .`);
  });

  it('refuses who and when on links that do not make a copy', () => {
    const input = withCopies([ADAPTING]);
    const dad = input.entities.find((e) => e.id === 'dad')!;
    dad.data = entitySchema.parse({ ...dad.data, relations: [{ predicate: 'parentOf', object: 'baby', date: '2026' }] });
    expect(() => compileGraph(input, options)).toThrow(/only go on links that make a copy/);
  });

  it('refuses an agent that is not in the registry', () => {
    const input = withCopies([ADAPTING]);
    const remixEntity = input.entities.find((e) => e.id === 'remix')!;
    remixEntity.data = entitySchema.parse({ ...remixEntity.data, relations: [{ predicate: 'adaptationOf', object: 'lullaby', by: ['nobody'] }] });
    expect(() => compileGraph(input, options)).toThrow(/by "nobody"/);
  });

  it('rejects malformed dates, languages and reference links', () => {
    expect(() => entitySchema.parse({ label: 'x', type: 'concept', relations: [{ predicate: 'p', object: 'y', date: 'May 1969' }] })).toThrow();
    expect(() => entitySchema.parse({ label: 'x', type: 'concept', language: 'French' })).toThrow();
    expect(() => entitySchema.parse({ label: 'x', type: 'concept', sameAs: ['http://example.com'] })).toThrow();
  });
});
