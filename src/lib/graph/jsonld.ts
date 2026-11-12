/**
 * The public semantic dataset, as JSON-LD.
 *
 * Modelling notes:
 *  - A claim is a resource. When it has a subject, predicate and object it is
 *    also an rdf:Statement, which describes the triple without asserting it.
 *    "The baby settles with walking" never appears as a bare fact.
 *  - An assessment is one person's position on one claim, as of one post.
 *    Positions are never updated in place; a change of mind is a new record.
 *  - Relations declared in the entity registry ARE asserted as bare triples.
 *    Those are household facts ("the dishwasher is in the kitchen"), not theories.
 */
import type { CompiledGraph } from './compile.ts';
import { pathFor } from './routes.ts';
import { STANCES } from './stances.ts';

type Node = Record<string, unknown>;

export function prefixes(graph: CompiledGraph): Record<string, string> {
  return {
    id: graph.site.idBase,
    bu: graph.site.vocabBase,
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    prov: 'http://www.w3.org/ns/prov#',
    schema: 'https://schema.org/',
    dcterms: 'http://purl.org/dc/terms/',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
  };
}

const ref = (iri: string) => ({ '@id': iri, '@type': '@id' });

export function jsonLdContext(graph: CompiledGraph): Node {
  return {
    ...prefixes(graph),
    label: 'rdfs:label',
    altLabel: 'skos:altLabel',
    description: 'dcterms:description',
    comment: 'rdfs:comment',
    headline: 'schema:headline',
    datePublished: { '@id': 'schema:datePublished', '@type': 'xsd:date' },
    page: ref('schema:url'),
    image: ref('schema:image'),
    mentions: ref('schema:mentions'),
    about: ref('schema:about'),
    subject: ref('rdf:subject'),
    predicate: ref('rdf:predicate'),
    object: ref('rdf:object'),
    attributedTo: ref('prov:wasAttributedTo'),
    refines: ref('bu:refines'),
    sourcePost: ref('bu:sourcePost'),
    firstAppearedIn: ref('bu:firstAppearedIn'),
    assesses: ref('bu:assesses'),
    stance: ref('bu:stance'),
    evidence: ref('bu:evidence'),
    sequence: { '@id': 'bu:sequence', '@type': 'xsd:integer' },
    polarity: 'bu:polarity',
    subClassOf: ref('rdfs:subClassOf'),
    subPropertyOf: ref('rdfs:subPropertyOf'),
    inScheme: ref('skos:inScheme'),
  };
}

const TYPE_TERMS: Record<string, string> = {
  person: 'Person',
  object: 'Object',
  role: 'Role',
  routine: 'Routine',
  concept: 'Concept',
  place: 'Place',
};

/** Drops empty strings and empty arrays so the output stays readable. */
function tidy(node: Node): Node {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === '' || value === null || value === undefined) return false;
      return !(Array.isArray(value) && value.length === 0);
    }),
  );
}

export interface VocabTerm {
  term: string;
  kind: 'class' | 'property' | 'stance';
  label: string;
  comment: string;
  extra?: Node;
}

/** The small vocabulary this site defines for itself, also rendered at /vocab/. */
export function vocabulary(graph: CompiledGraph): VocabTerm[] {
  const classes: VocabTerm[] = [
    { term: 'Person', kind: 'class', label: 'Person', comment: 'A member of the household.', extra: { subClassOf: ['prov:Agent', 'schema:Person'] } },
    { term: 'Object', kind: 'class', label: 'Object', comment: 'A physical thing that keeps turning up.' },
    { term: 'Role', kind: 'class', label: 'Role', comment: 'A job that has to be filled. Which thing fills it can change; the role keeps its identity.' },
    { term: 'Routine', kind: 'class', label: 'Routine', comment: 'Something the household does repeatedly, in the hope that it works.' },
    { term: 'Concept', kind: 'class', label: 'Concept', comment: 'An idea the household talks about as though it were a thing.' },
    { term: 'Place', kind: 'class', label: 'Place', comment: 'A location in or near the home.' },
    { term: 'Post', kind: 'class', label: 'Post', comment: 'A published blog post.', extra: { subClassOf: 'schema:BlogPosting' } },
    { term: 'Observation', kind: 'class', label: 'Observation', comment: 'One person’s report of a particular occurrence.' },
    { term: 'Claim', kind: 'class', label: 'Claim', comment: 'An interpretation or proposition. Recording a claim does not assert it.' },
    { term: 'Assessment', kind: 'class', label: 'Assessment', comment: 'One person’s position on a claim as of one post.' },
    { term: 'Stance', kind: 'class', label: 'Stance', comment: 'A position a person can take on a claim.', extra: { subClassOf: 'skos:Concept' } },
  ];
  const properties: VocabTerm[] = [
    { term: 'sourcePost', kind: 'property', label: 'source post', comment: 'The post in which a record was published.' },
    { term: 'firstAppearedIn', kind: 'property', label: 'first appeared in', comment: 'The first post to mention an entity.' },
    { term: 'assesses', kind: 'property', label: 'assesses', comment: 'The claim an assessment takes a position on.' },
    { term: 'stance', kind: 'property', label: 'stance', comment: 'The position taken in an assessment.' },
    { term: 'evidence', kind: 'property', label: 'evidence', comment: 'An observation cited in support of an assessment.' },
    { term: 'refines', kind: 'property', label: 'refines', comment: 'An earlier claim that this claim narrows or replaces.', extra: { subPropertyOf: 'prov:wasDerivedFrom' } },
    { term: 'sequence', kind: 'property', label: 'sequence', comment: 'Position of an assessment in publication order across all posts.' },
    { term: 'polarity', kind: 'property', label: 'polarity', comment: 'Whether a stance supports, doubts, leaves open or retracts a claim.' },
  ];
  const predicates: VocabTerm[] = graph.predicates.map((p) => ({
    term: p.id,
    kind: 'property',
    label: p.label,
    comment: p.description,
  }));
  const stances: VocabTerm[] = STANCES.map((s) => ({
    term: s.term,
    kind: 'stance',
    label: s.label,
    comment: s.description,
    extra: { polarity: s.polarity, inScheme: 'bu:Stances' },
  }));
  return [...classes, ...properties, ...predicates, ...stances];
}

function vocabNodes(graph: CompiledGraph): Node[] {
  const nodes: Node[] = vocabulary(graph).map((term) =>
    tidy({
      '@id': `bu:${term.term}`,
      '@type': term.kind === 'class' ? 'rdfs:Class' : term.kind === 'property' ? 'rdf:Property' : 'bu:Stance',
      label: term.label,
      comment: term.comment,
      ...term.extra,
    }),
  );
  nodes.push({ '@id': 'bu:Stances', '@type': 'skos:ConceptScheme', label: 'Stances' });
  return nodes;
}

function recordNodes(graph: CompiledGraph): Node[] {
  const page = (id: string) => graph.site.url + pathFor(graph, id)!;
  const postFor = (postId: string) => graph.posts.find((p) => p.id === postId)!.published;
  const nodes: Node[] = [];

  for (const e of graph.entities) {
    const node: Node = {
      '@id': `id:${e.id}`,
      '@type': `bu:${TYPE_TERMS[e.type]}`,
      label: e.label,
      altLabel: e.aliases.map((a) => a.label),
      description: e.description,
      firstAppearedIn: `id:${graph.posts.find((p) => p.seq === e.mentionedIn[0])!.id}`,
      page: page(e.id),
      ...(e.image ? { image: graph.site.url + e.image } : {}),
    };
    for (const relation of e.relations) {
      const key = `bu:${relation.predicate}`;
      const value = { '@id': `id:${relation.object}` };
      node[key] = node[key] ? [...(node[key] as Node[]), value] : [value];
    }
    nodes.push(tidy(node));
  }

  for (const p of graph.posts) {
    nodes.push(
      tidy({
        '@id': `id:${p.id}`,
        '@type': ['bu:Post', 'schema:BlogPosting'],
        label: p.title,
        headline: p.title,
        description: p.summary,
        datePublished: p.published,
        mentions: p.mentions.map((m) => `id:${m}`),
        page: page(p.id),
      }),
    );
  }

  for (const o of graph.observations) {
    nodes.push(
      tidy({
        '@id': `id:${o.id}`,
        '@type': 'bu:Observation',
        description: o.text,
        attributedTo: `id:${o.observedBy}`,
        about: o.about.map((a) => `id:${a}`),
        sourcePost: `id:${o.post}`,
        datePublished: postFor(o.post),
        page: page(o.id),
      }),
    );
  }

  for (const c of graph.claims) {
    const triple = c.subject && c.predicate && c.object;
    nodes.push(
      tidy({
        '@id': `id:${c.id}`,
        '@type': triple ? ['bu:Claim', 'rdf:Statement'] : 'bu:Claim',
        label: c.label,
        description: c.description,
        subject: triple ? `id:${c.subject}` : undefined,
        predicate: triple ? `bu:${c.predicate}` : undefined,
        object: triple ? `id:${c.object}` : undefined,
        about: c.about.map((a) => `id:${a}`),
        attributedTo: `id:${c.attributedTo}`,
        refines: c.refines ? `id:${c.refines}` : undefined,
        sourcePost: `id:${c.post}`,
        datePublished: postFor(c.post),
        page: page(c.id),
      }),
    );
  }

  for (const a of graph.assessments) {
    nodes.push(
      tidy({
        '@id': `id:${a.id}`,
        '@type': 'bu:Assessment',
        assesses: `id:${a.claim}`,
        attributedTo: `id:${a.by}`,
        stance: `bu:${STANCES.find((s) => s.id === a.stance)!.term}`,
        comment: a.note,
        evidence: a.evidence.map((e) => `id:${e}`),
        sourcePost: `id:${a.post}`,
        datePublished: postFor(a.post),
        sequence: a.sequence,
        page: page(a.id),
      }),
    );
  }

  return nodes;
}

export function toJsonLd(graph: CompiledGraph): Node {
  return {
    '@context': jsonLdContext(graph),
    '@graph': [...recordNodes(graph), ...vocabNodes(graph)],
  };
}

/** One record as a standalone JSON-LD document, for embedding in its page. */
export function nodeFor(graph: CompiledGraph, id: string): Node | null {
  const node = recordNodes(graph).find((n) => n['@id'] === `id:${id}`);
  return node ? { '@context': jsonLdContext(graph), ...node } : null;
}
