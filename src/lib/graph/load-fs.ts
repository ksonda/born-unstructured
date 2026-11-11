/**
 * Loads the content straight from disk, without Astro. Used by the tests and
 * the command-line scripts. The site build loads the same files through
 * content collections (src/lib/site-graph.ts) and validates them with the same
 * schemas, so both routes produce the same compiler input.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import type { CompileInput } from './compile.ts';
import { entitySchema, postSchema, predicateSchema } from './schema.ts';

export function loadContent(contentDir: string): CompileInput {
  const postsDir = join(contentDir, 'posts');
  const posts = readdirSync(postsDir)
    .filter((file) => extname(file) === '.md')
    .sort()
    .map((file) => {
      const parsed = matter(readFileSync(join(postsDir, file), 'utf8'));
      return { id: basename(file, '.md'), data: postSchema.parse(parsed.data), body: parsed.content };
    });

  const entitiesDir = join(contentDir, 'entities');
  const entities = readdirSync(entitiesDir)
    .filter((file) => extname(file) === '.yaml')
    .sort()
    .map((file) => ({
      id: basename(file, '.yaml'),
      data: entitySchema.parse(parseYaml(readFileSync(join(entitiesDir, file), 'utf8'))),
    }));

  const predicates = (parseYaml(readFileSync(join(contentDir, 'vocab', 'predicates.yaml'), 'utf8')) as unknown[]).map(
    (entry) => predicateSchema.parse(entry),
  );

  return { posts, entities, predicates };
}
