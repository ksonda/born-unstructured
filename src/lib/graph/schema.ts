/**
 * Authoring schemas: what a human writes in YAML.
 *
 * These are used by Astro's content collections (src/content.config.ts) and by
 * the plain-Node loader (load-fs.ts), so the site build, the tests and the
 * command-line report all validate content the same way.
 */
import { z } from 'astro/zod';

export const ENTITY_TYPES = ['person', 'object', 'role', 'routine', 'concept', 'place'] as const;
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
      /** Episode in which the name was first used. Defaults to the entity's first appearance. */
      since: z.number().int().positive().optional(),
    })
    .strict(),
]);

/** One file per recurring thing in src/content/entities/. The file name is the ID. */
export const entitySchema = z
  .object({
    label: z.string(),
    type: z.enum(ENTITY_TYPES),
    description: z.string().default(''),
    aliases: z.array(alias).default([]),
    /** Plain household facts, asserted without attribution: "the dishwasher is in the kitchen". */
    relations: z.array(z.object({ predicate: z.string(), object: id }).strict()).default([]),
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
  })
  .strict();
export type PredicateData = z.infer<typeof predicateSchema>;

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

/** Frontmatter of a Markdown installment in src/content/posts/. */
export const postSchema = z
  .object({
    title: z.string(),
    episode: z.number().int().positive(),
    published: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
    /** Marks a made-up placeholder episode. It gets a banner on the site and is easy to find and delete. */
    sample: z.boolean().default(false),
    /** Extra entities to index. Anything linked in the prose or used in a record is added automatically. */
    mentions: z.array(id).default([]),
    observations: z.array(observation).default([]),
    claims: z.array(claim).default([]),
    assessments: z.array(assessment).default([]),
  })
  .strict();
export type PostData = z.infer<typeof postSchema>;
