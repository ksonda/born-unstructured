/**
 * Authoring schemas: what a human writes in YAML.
 *
 * These are used by Astro's content collections (src/content.config.ts) and by
 * the plain-Node loader (load-fs.ts), so the site build, the tests and the
 * command-line report all validate content the same way.
 */
import { z } from 'astro/zod';

export const ENTITY_TYPES = ['person', 'agent', 'object', 'role', 'routine', 'concept', 'place'] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const STANCE_IDS = [
  'tentative',
  'endorses',
  'strongly-endorses',
  'qualifies',
  'questions',
  'disputes',
  'undecided',
  'withdraws',
] as const;
export type StanceId = (typeof STANCE_IDS)[number];

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'IDs are lowercase letters, digits and hyphens');

const alias = z.union([
  z.string(),
  z
    .object({
      label: z.string(),
      /** Date the name came into use. It shows from the first post published on or after it. Defaults to the entity's first appearance. */
      since: z.coerce.date().optional(),
    })
    .strict(),
]);

/** A prefixed name from one of the standard vocabularies the site publishes with. */
const standardTerm = z
  .string()
  .regex(/^(prov|schema|owl|skos|dcterms|rdfs):[A-Za-z][A-Za-z0-9]*$/, 'Use a prefixed name from prov, schema, owl, skos, dcterms or rdfs');

/** Year, year and month, or full date: 1969, 1969-05, 1860-04-09. */
const partialDate = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Dates are YYYY, YYYY-MM or YYYY-MM-DD');

const relation = z
  .object({
    predicate: z.string(),
    object: id,
    /**
     * For a link that makes a copy (see vocab/copies.yaml): who did the copying.
     * Published as prov:wasAssociatedWith on the activity.
     */
    by: z.array(id).default([]),
    /** For a link that makes a copy: when. Published as dcterms:date on the activity. */
    date: partialDate.optional(),
  })
  .strict();

/** One file per recurring thing in src/content/entities/. The file name is the ID. */
export const entitySchema = z
  .object({
    label: z.string(),
    type: z.enum(ENTITY_TYPES),
    description: z.string().default(''),
    aliases: z.array(alias).default([]),
    /** Plain household facts, asserted without attribution: "the dishwasher is in the kitchen". */
    relations: z.array(relation).default([]),
    /** Reference pages elsewhere that identify the thing (Wikipedia, the VWML). Published as schema:sameAs. */
    sameAs: z.array(z.string().url().startsWith('https://')).default([]),
    /** Language of a song, text or record, as a BCP 47 tag: fr, en, it. Published as dcterms:language. */
    language: z.string().regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, 'Use a BCP 47 language tag, like fr or en').optional(),
    /** Extra RDF classes from standard vocabularies, such as skos:ConceptScheme. */
    types: z.array(standardTerm).default([]),
    /** A photo, as a path under public/images/: "things/messy-muppy.jpg". */
    image: z
      .string()
      .regex(/^[\w./-]+\.(jpe?g|png|webp)$/, 'image must be a path under public/images/, like things/messy-muppy.jpg')
      .optional(),
    /** Set to false to keep an entity out of every page, index and export. */
    public: z.boolean().default(true),
  })
  .strict();
export type EntityData = z.infer<typeof entitySchema>;

/** Entries in src/content/vocab/predicates.yaml. */
export const predicateSchema = z
  .object({
    id: z.string().regex(/^[a-z][A-Za-z0-9]*$/, 'Predicate IDs are camelCase'),
    /** Reads naturally between a subject and an object: "settles with". */
    label: z.string(),
    description: z.string().default(''),
    /**
     * Standard terms this predicate is a narrower version of, as prefixed names
     * (prov:wasDerivedFrom, schema:isBasedOn). Published as rdfs:subPropertyOf.
     */
    subPropertyOf: z.array(standardTerm).default([]),
  })
  .strict();
export type PredicateData = z.infer<typeof predicateSchema>;

/**
 * How a kind of copy is spelled in PROV's long ("qualified") form.
 * derivation: prov:qualifiedDerivation · primarySource: prov:qualifiedPrimarySource ·
 * quotation: prov:qualifiedQuotation · none: not published as a derivation.
 */
export const COPY_QUALIFIERS = ['derivation', 'primarySource', 'quotation', 'none'] as const;
export type CopyQualifier = (typeof COPY_QUALIFIERS)[number];

/** Entries in src/content/vocab/copies.yaml: the kinds of copy, each published as a kind of prov:Activity. */
export const copyKindSchema = z
  .object({
    /** The activity's class name, PascalCase: Adapting. */
    id: z.string().regex(/^[A-Z][A-Za-z0-9]*$/, 'Copy kind IDs are PascalCase activity names, like Adapting'),
    /** The activity, lowercase: "adapting". */
    label: z.string(),
    /** What the activity produces: "adaptation". */
    copy: z.string(),
    /** What survives from the source. */
    keeps: z.string(),
    /** What changes. */
    changes: z.string(),
    /** The site predicates that assert this kind of copy between two things, if any. */
    predicates: z.array(z.string().regex(/^[a-z][A-Za-z0-9]*$/)).default([]),
    qualifiedAs: z.enum(COPY_QUALIFIERS).default('derivation'),
    /** How it sits in PROV when there is no predicate for it. */
    note: z.string().optional(),
  })
  .strict();
export type CopyKindData = z.infer<typeof copyKindSchema>;

const observation = z
  .object({
    id,
    text: z.string(),
    observedBy: id,
    about: z.array(id).min(1),
  })
  .strict();

const claim = z
  .object({
    id,
    label: z.string(),
    /** A few words for the graph edge. Defaults to the label. */
    short: z.string().optional(),
    description: z.string().optional(),
    /** Optional subject-predicate-object form. Leave all three out for theories that do not fit. */
    subject: id.optional(),
    predicate: z.string().optional(),
    object: id.optional(),
    /** Entities the claim concerns. Subject and object are added automatically. */
    about: z.array(id).default([]),
    attributedTo: id,
    /** An earlier claim this one narrows or replaces. */
    refines: id.optional(),
  })
  .strict();

const assessment = z
  .object({
    id,
    claim: id,
    by: id,
    stance: z.enum(STANCE_IDS),
    note: z.string().optional(),
    evidence: z.array(id).default([]),
  })
  .strict();

/** Frontmatter of a Markdown post in src/content/posts/. */
export const postSchema = z
  .object({
    title: z.string(),
    published: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
    /** Extra entities to index. Anything linked in the prose or used in a record is added automatically. */
    mentions: z.array(id).default([]),
    observations: z.array(observation).default([]),
    claims: z.array(claim).default([]),
    assessments: z.array(assessment).default([]),
  })
  .strict();
export type PostData = z.infer<typeof postSchema>;
