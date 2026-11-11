import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { entitySchema, postSchema, predicateSchema } from './lib/graph/schema.ts';

/** Posts. The frontmatter carries each post's additions to the graph. */
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: postSchema,
});

/** The shared registry of recurring people, objects, routines, concepts and places. One file each. */
const entities = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/entities' }),
  schema: entitySchema,
});

/** Predicates that claims and relations are allowed to use. */
const predicates = defineCollection({
  loader: file('./src/content/vocab/predicates.yaml'),
  schema: predicateSchema,
});

export const collections = { posts, entities, predicates };
