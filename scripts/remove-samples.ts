/**
 * npm run samples:remove
 *
 * Deletes the made-up placeholder episodes (posts with `sample: true`) and
 * everything that only existed for them:
 *
 *   - entity files that no remaining episode mentions
 *   - aliases that start in an episode that no longer exists
 *   - relations that point at a deleted entity
 *
 * Real episodes and the things they mention are never touched. Run it once,
 * when the real episodes are ready to stand on their own. Git has the rest.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isMap, isScalar, isSeq, parseDocument } from 'yaml';
import { compileGraph } from '../src/lib/graph/compile.ts';
import { loadContent } from '../src/lib/graph/load-fs.ts';

const contentDir = fileURLToPath(new URL('../src/content', import.meta.url));
const dryRun = process.argv.includes('--dry-run');
const act = dryRun ? 'Would' : 'Did';

const content = loadContent(contentDir);
const samples = content.posts.filter((post) => post.data.sample);
if (samples.length === 0) {
  console.log('No sample episodes left. Nothing to do.');
  process.exit(0);
}

const kept = content.posts.filter((post) => !post.data.sample && !post.data.draft);
const numbers = kept.map((post) => post.data.episode).sort((a, b) => a - b);
if (numbers.some((n, i) => n !== i + 1)) {
  console.error(
    `Without the samples, the published episodes would be numbered ${numbers.join(', ') || '(none)'}.\n` +
      'Episodes have to run 1, 2, 3 with no gaps. Renumber the real ones first, then run this again.',
  );
  process.exit(1);
}
const latest = numbers.length;

// Which entities do the real episodes still need? Ask the compiler, with every
// relation stripped so that nothing fails for pointing at a soon-to-be-deleted thing.
const { graph } = compileGraph(
  {
    posts: kept,
    entities: content.entities.map((e) => ({ id: e.id, data: { ...e.data, relations: [], aliases: [] } })),
    predicates: content.predicates,
  },
  { siteUrl: 'https://example.invalid' },
);
const needed = new Set(graph.entities.map((e) => e.id));
// Private entities and ones mentioned only by a real draft are not ours to judge.
const draftText = content.posts
  .filter((post) => post.data.draft && !post.data.sample)
  .map((post) => `${JSON.stringify(post.data)} ${post.body ?? ''}`)
  .join('\n');
const removable = content.entities.filter(
  (e) => e.data.public && !needed.has(e.id) && !new RegExp(`\\b${e.id}\\b`).test(draftText),
);
const gone = new Set(removable.map((e) => e.id));

for (const post of samples) {
  console.log(`${act} delete posts/${post.id}.md`);
  if (!dryRun) rmSync(`${contentDir}/posts/${post.id}.md`);
}
for (const entity of removable) {
  console.log(`${act} delete entities/${entity.id}.yaml`);
  if (!dryRun) rmSync(`${contentDir}/entities/${entity.id}.yaml`);
}

for (const entity of content.entities) {
  if (gone.has(entity.id)) continue;
  const file = `${contentDir}/entities/${entity.id}.yaml`;
  const doc = parseDocument(readFileSync(file, 'utf8'));
  const notes: string[] = [];

  const aliases = doc.get('aliases');
  if (isSeq(aliases)) {
    aliases.items = aliases.items.filter((item) => {
      if (!isMap(item)) return true;
      const since = item.get('since');
      if (typeof since !== 'number' || since <= latest) return true;
      notes.push(`alias "${item.get('label')}" (episode ${since})`);
      return false;
    });
    if (aliases.items.length === 0) doc.delete('aliases');
  }

  const relations = doc.get('relations');
  if (isSeq(relations)) {
    relations.items = relations.items.filter((item) => {
      if (!isMap(item)) return true;
      const object = item.get('object', true);
      const target = isScalar(object) ? String(object.value) : '';
      if (!gone.has(target)) return true;
      notes.push(`relation ${item.get('predicate')} ${target}`);
      return false;
    });
    if (relations.items.length === 0) doc.delete('relations');
  }

  if (notes.length) {
    console.log(`${act} trim entities/${entity.id}.yaml: ${notes.join(', ')}`);
    if (!dryRun) writeFileSync(file, doc.toString({ lineWidth: 100 }));
  }
}

console.log(
  `\n${samples.length} sample episode${samples.length === 1 ? '' : 's'} and ${removable.length} thing${removable.length === 1 ? '' : 's'} ${dryRun ? 'would be removed' : 'removed'}.` +
    (dryRun ? '\nNothing was changed. Run without --dry-run to do it.' : '\nNow run "npm test" and "npm run build". Leftover sagas in src/site.config.ts hide themselves.'),
);
