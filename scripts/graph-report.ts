/**
 * npm run graph
 *
 * Validates the content and prints what the graph currently says, without
 * building the site. Useful before committing an installment.
 */
import { fileURLToPath } from 'node:url';
import { compileGraph, GraphValidationError } from '../src/lib/graph/compile.ts';
import { loadContent } from '../src/lib/graph/load-fs.ts';
import { beliefs } from '../src/lib/graph/queries.ts';
import { stance, STATUS_LABELS } from '../src/lib/graph/stances.ts';
import { entityLabel } from '../src/lib/graph/views.ts';

const contentDir = fileURLToPath(new URL('../src/content', import.meta.url));

try {
  const { graph, warnings } = compileGraph(loadContent(contentDir), {
    siteUrl: process.env.SITE_URL ?? 'https://ksonda.github.io/born-unstructured',
  });

  console.log(
    `${graph.posts.length} episodes, ${graph.entities.length} things, ${graph.observations.length} observations, ` +
      `${graph.claims.length} claims, ${graph.assessments.length} assessments\n`,
  );

  for (const belief of beliefs(graph)) {
    console.log(`${STATUS_LABELS[belief.status].padEnd(16)} ${belief.claim.label}  (${belief.claim.id})`);
    for (const position of belief.positions) {
      console.log(`${' '.repeat(17)}${entityLabel(graph, position.by)}: ${stance(position.stance).label}, episode ${position.episode}`);
    }
  }

  if (warnings.length) {
    console.log(`\n${warnings.length} warning${warnings.length === 1 ? '' : 's'}:`);
    for (const warning of warnings) console.log(`  - ${warning}`);
  }
} catch (error) {
  if (error instanceof GraphValidationError) {
    console.error(error.message);
    process.exit(1);
  }
  throw error;
}
