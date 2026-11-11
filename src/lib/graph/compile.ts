/**
 * The graph compiler.
 *
 * Takes the posts and the entity registry exactly as authored and returns one
 * validated, normalised, JSON-serialisable graph. Everything else on the site
 * (pages, explorer data, JSON-LD, RDF) is derived from this object.
 *
 * This module is pure: no file system, no Astro. That keeps it testable and
 * lets the same code run in the build, in the browser and on the command line.
 */
import type { EntityData, EntityType, PostData, PredicateData, StanceId } from './schema.ts';

// ---------------------------------------------------------------- input ----

export interface RawPost {
  /** File name without extension, e.g. "001-a-reliable-method-once". */
  id: string;
  data: PostData;
  /** Markdown source. Scanned for thing:, claim: and obs: links. */
  body?: string;
}

export interface RawEntity {
  id: string;
  data: EntityData;
}

export interface CompileInput {
  posts: RawPost[];
  entities: RawEntity[];
  predicates: PredicateData[];
}

export interface CompileOptions {
  /** Public address of the site, no trailing slash. Identifiers are minted beneath it. */
  siteUrl: string;
}

// --------------------------------------------------------------- output ----

export interface Alias {
  label: string;
  since: number;
}

export interface Entity {
  id: string;
  label: string;
  type: EntityType;
  description: string;
  aliases: Alias[];
  relations: { predicate: string; object: string }[];
  /** Episode numbers of every installment that mentions it, ascending. */
  mentionedIn: number[];
}

export interface Post {
  /** Graph identifier: "episode-01". */
  id: string;
  /** URL segment: "a-reliable-method-once". */
  slug: string;
  title: string;
  episode: number;
  /** ISO date, YYYY-MM-DD. */
  published: string;
  summary: string;
  /** True for made-up placeholder episodes. */
  sample: boolean;
  mentions: string[];
}

export interface Observation {
  id: string;
  text: string;
  observedBy: string;
  about: string[];
  episode: number;
  post: string;
  /** True when the prose marks the exact passage with an obs: link. */
  hasPassage: boolean;
}

export interface Claim {
  id: string;
  label: string;
  short: string;
  description: string;
  subject: string | null;
  predicate: string | null;
  object: string | null;
  /** Every entity the claim concerns, subject and object included. */
  about: string[];
  attributedTo: string;
  refines: string | null;
  episode: number;
  post: string;
}

export interface Assessment {
  id: string;
  claim: string;
  by: string;
  stance: StanceId;
  note: string;
  evidence: string[];
  episode: number;
  post: string;
  /** Position in publication order across the whole series, starting at 1. */
  sequence: number;
}

export interface Predicate {
  id: string;
  label: string;
  description: string;
}

export interface CompiledGraph {
  site: { url: string; idBase: string; vocabBase: string };
  latestEpisode: number;
  entities: Entity[];
  posts: Post[];
  observations: Observation[];
  claims: Claim[];
  assessments: Assessment[];
  predicates: Predicate[];
}

export interface CompileResult {
  graph: CompiledGraph;
  /** Things worth a look that do not stop the build. */
  warnings: string[];
}

export class GraphValidationError extends Error {
  problems: string[];
  constructor(problems: string[]) {
    super(
      `The knowledge graph has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n` +
        problems.map((p) => `  - ${p}`).join('\n'),
    );
    this.name = 'GraphValidationError';
    this.problems = problems;
  }
}

// -------------------------------------------------------------- helpers ----

const PROSE_LINK = /\]\(\s*(thing|claim|obs):([^)\s]+)\s*\)/g;

export interface ProseLinks {
  things: string[];
  claims: string[];
  observations: string[];
}

/** Finds [text](thing:id), [text](claim:id) and [text](obs:id) links in Markdown. */
export function extractProseLinks(body: string): ProseLinks {
  const found: ProseLinks = { things: [], claims: [], observations: [] };
  for (const match of body.matchAll(PROSE_LINK)) {
    const [, scheme, target] = match;
    if (scheme === 'thing') found.things.push(target);
    else if (scheme === 'claim') found.claims.push(target);
    else found.observations.push(target);
  }
  return found;
}

export function episodeId(episode: number): string {
  return `episode-${String(episode).padStart(2, '0')}`;
}

export function slugFromFile(fileId: string): string {
  return fileId.replace(/^\d+[-_]/, '');
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

// ------------------------------------------------------------- compiler ----

export function compileGraph(input: CompileInput, options: CompileOptions): CompileResult {
  const problems: string[] = [];
  const warnings: string[] = [];
  const siteUrl = options.siteUrl.replace(/\/+$/, '');

  // Selection comes first: drafts and private entities never reach an index or an export.
  const published = input.posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => a.data.episode - b.data.episode);
  const privateIds = new Set(input.entities.filter((e) => !e.data.public).map((e) => e.id));
  const publicEntities = input.entities
    .filter((e) => e.data.public)
    .sort((a, b) => a.id.localeCompare(b.id));

  const predicates = new Map(input.predicates.map((p) => [p.id, p]));
  const entityInput = new Map(publicEntities.map((e) => [e.id, e.data]));

  // One identifier space for everything, because everything shares /id/.
  const kinds = new Map<string, string>();
  const register = (id: string, kind: string, where: string) => {
    const existing = kinds.get(id);
    if (existing) problems.push(`${where}: the ID "${id}" is already used by ${existing}`);
    else kinds.set(id, kind);
  };
  for (const entity of publicEntities) register(entity.id, 'an entity', `entities/${entity.id}`);

  const requireEntity = (id: string, where: string, role: string): boolean => {
    if (entityInput.has(id)) return true;
    if (privateIds.has(id)) problems.push(`${where}: ${role} "${id}" is a private entity`);
    else problems.push(`${where}: ${role} "${id}" is not in the entity registry`);
    return false;
  };
  const requirePerson = (id: string, where: string, role: string) => {
    if (requireEntity(id, where, role) && entityInput.get(id)!.type !== 'person') {
      problems.push(`${where}: ${role} "${id}" must be a person`);
    }
  };

  const episodesSeen = new Map<number, string>();
  const posts: Post[] = [];
  const observations: Observation[] = [];
  const claims: Claim[] = [];
  const assessments: Assessment[] = [];
  const mentionedIn = new Map<string, number[]>();
  let sequence = 0;

  for (const raw of published) {
    const { data } = raw;
    const where = `posts/${raw.id}`;
    const postId = episodeId(data.episode);

    if (episodesSeen.has(data.episode)) {
      problems.push(`${where}: episode ${data.episode} is also claimed by posts/${episodesSeen.get(data.episode)}`);
      continue;
    }
    episodesSeen.set(data.episode, raw.id);
    register(postId, `episode ${data.episode}`, where);

    const links = extractProseLinks(raw.body ?? '');
    const mentions: string[] = [];
    const mention = (id: string) => {
      if (entityInput.has(id) && !mentions.includes(id)) mentions.push(id);
    };

    for (const id of data.mentions) if (requireEntity(id, where, 'mentioned entity')) mention(id);
    for (const id of links.things) if (requireEntity(id, where, 'linked thing')) mention(id);

    const ownObservations = new Set(data.observations.map((o) => o.id));
    for (const id of unique(links.observations)) {
      if (!ownObservations.has(id)) {
        problems.push(`${where}: the prose marks a passage for "${id}", which is not an observation in this post`);
      }
    }

    for (const o of data.observations) {
      const at = `${where} observation "${o.id}"`;
      register(o.id, 'an observation', at);
      requirePerson(o.observedBy, at, 'observer');
      for (const id of o.about) requireEntity(id, at, 'entity');
      const hasPassage = links.observations.includes(o.id);
      if (!hasPassage) warnings.push(`${at}: no passage in the prose is marked with (obs:${o.id})`);
      observations.push({
        id: o.id,
        text: o.text,
        observedBy: o.observedBy,
        about: unique(o.about),
        episode: data.episode,
        post: postId,
        hasPassage,
      });
      [o.observedBy, ...o.about].forEach(mention);
    }

    for (const c of data.claims) {
      const at = `${where} claim "${c.id}"`;
      register(c.id, 'a claim', at);
      requirePerson(c.attributedTo, at, 'author');

      const triple = [c.subject, c.predicate, c.object].filter((part) => part !== undefined).length;
      if (triple !== 0 && triple !== 3) {
        problems.push(`${at}: give subject, predicate and object together, or none of them`);
      }
      if (triple === 0 && c.about.length === 0) {
        problems.push(`${at}: needs either a subject, predicate and object, or an "about" list`);
      }
      if (c.subject) requireEntity(c.subject, at, 'subject');
      if (c.object) requireEntity(c.object, at, 'object');
      if (c.predicate && !predicates.has(c.predicate)) {
        problems.push(`${at}: predicate "${c.predicate}" is not declared in vocab/predicates.yaml`);
      }
      for (const id of c.about) requireEntity(id, at, 'entity');
      if (c.refines && !claims.some((earlier) => earlier.id === c.refines) && !data.claims.some((x) => x.id === c.refines)) {
        problems.push(`${at}: refines "${c.refines}", which is not a claim published by this episode`);
      }

      const about = unique([c.subject, c.object, ...c.about].filter((x): x is string => Boolean(x)));
      claims.push({
        id: c.id,
        label: c.label,
        short: c.short ?? c.label,
        description: c.description ?? '',
        subject: triple === 3 ? c.subject! : null,
        predicate: triple === 3 ? c.predicate! : null,
        object: triple === 3 ? c.object! : null,
        about,
        attributedTo: c.attributedTo,
        refines: c.refines ?? null,
        episode: data.episode,
        post: postId,
      });
      [c.attributedTo, ...about].forEach(mention);
    }

    for (const id of unique(links.claims)) {
      const claim = claims.find((c) => c.id === id);
      if (!claim) {
        problems.push(`${where}: the prose links to claim "${id}", which has not been published by this episode`);
      } else {
        claim.about.forEach(mention);
      }
    }

    for (const a of data.assessments) {
      const at = `${where} assessment "${a.id}"`;
      register(a.id, 'an assessment', at);
      requirePerson(a.by, at, 'assessor');
      const claim = claims.find((c) => c.id === a.claim);
      if (!claim) {
        problems.push(`${at}: assesses "${a.claim}", which is not a claim published by this episode`);
      }
      for (const id of a.evidence) {
        if (!observations.some((o) => o.id === id)) {
          problems.push(`${at}: cites "${id}", which is not an observation published by this episode`);
        }
      }
      sequence += 1;
      assessments.push({
        id: a.id,
        claim: a.claim,
        by: a.by,
        stance: a.stance,
        note: a.note ?? '',
        evidence: unique(a.evidence),
        episode: data.episode,
        post: postId,
        sequence,
      });
      mention(a.by);
      claim?.about.forEach(mention);
    }

    for (const id of mentions) {
      mentionedIn.set(id, [...(mentionedIn.get(id) ?? []), data.episode]);
    }

    posts.push({
      id: postId,
      slug: slugFromFile(raw.id),
      title: data.title,
      episode: data.episode,
      published: data.published.toISOString().slice(0, 10),
      summary: data.summary,
      sample: data.sample,
      mentions,
    });
  }

  const slugs = new Map<string, string>();
  for (const post of posts) {
    if (slugs.has(post.slug)) problems.push(`posts: episodes ${slugs.get(post.slug)} and ${post.id} share the slug "${post.slug}"`);
    slugs.set(post.slug, post.id);
  }

  const latestEpisode = posts.length ? posts[posts.length - 1].episode : 0;

  const entities: Entity[] = [];
  for (const { id, data } of publicEntities) {
    const where = `entities/${id}`;
    const appearances = mentionedIn.get(id) ?? [];
    if (appearances.length === 0) {
      warnings.push(`${where}: not mentioned in any published episode, so it is left out of the graph`);
      continue;
    }
    const relations = data.relations.filter((relation) => {
      const at = `${where} relation`;
      if (!predicates.has(relation.predicate)) {
        problems.push(`${at}: predicate "${relation.predicate}" is not declared in vocab/predicates.yaml`);
        return false;
      }
      return requireEntity(relation.object, at, 'object');
    });
    const aliases = data.aliases.flatMap((alias) => {
      const label = typeof alias === 'string' ? alias : alias.label;
      const since = typeof alias === 'string' ? undefined : alias.since;
      if (since !== undefined && since > latestEpisode) {
        // Like a draft post: it waits for its episode instead of leaking into the graph early.
        warnings.push(`${where}: alias "${label}" starts in episode ${since}, which is not published yet, so it is left out`);
        return [];
      }
      return [{ label, since: since ?? appearances[0] }];
    });
    entities.push({
      id,
      label: data.label,
      type: data.type,
      description: data.description.trim(),
      aliases,
      relations,
      mentionedIn: appearances,
    });
  }

  // Relations may only point at entities that made it into the graph.
  const present = new Set(entities.map((e) => e.id));
  for (const entity of entities) {
    entity.relations = entity.relations.filter((relation) => present.has(relation.object));
  }

  for (const claim of claims) {
    if (!assessments.some((a) => a.claim === claim.id)) {
      warnings.push(`claim "${claim.id}": nobody has recorded a position on it`);
    }
  }

  if (problems.length) throw new GraphValidationError(problems);

  return {
    graph: {
      site: { url: siteUrl, idBase: `${siteUrl}/id/`, vocabBase: `${siteUrl}/vocab#` },
      latestEpisode,
      entities,
      posts,
      observations,
      claims,
      assessments,
      predicates: input.predicates.map((p) => ({ id: p.id, label: p.label, description: p.description })),
    },
    warnings,
  };
}
