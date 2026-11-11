/**
 * npm run new -- "The Title of the Post"
 *
 * Creates a post as a draft, dated today, with the next free observation and
 * assessment IDs already filled in.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadContent } from '../src/lib/graph/load-fs.ts';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Give the post a title:  npm run new -- "The Title of the Post"');
  process.exit(1);
}

const contentDir = fileURLToPath(new URL('../src/content', import.meta.url));
const { posts, entities } = loadContent(contentDir);

const highest = (ids: string[]) => Math.max(0, ...ids.map((id) => Number(id.match(/(\d+)$/)?.[1] ?? 0)));
const pad = (n: number) => String(n).padStart(2, '0');
const observation = `observation-${pad(highest(posts.flatMap((p) => p.data.observations.map((o) => o.id))) + 1)}`;
const assessment = `assessment-${pad(highest(posts.flatMap((p) => p.data.assessments.map((a) => a.id))) + 1)}`;
const claims = posts.flatMap((p) => p.data.claims.map((c) => `#   ${c.id}: ${c.label}`));
const things = entities.filter((e) => e.data.public).map((e) => e.id);
const lastClaim = posts.flatMap((p) => p.data.claims).at(-1)?.id ?? 'claim-something';
const person = entities.find((e) => e.data.public && e.data.type === 'person')?.id ?? 'someone';
const thing = entities.find((e) => e.data.public && e.data.type !== 'person')?.id ?? 'something';

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const file = `${contentDir}/posts/${slug}.md`;
if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}

writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
published: ${new Date().toISOString().slice(0, 10)}
summary: "One or two sentences for the post list and the RSS feed."
draft: true   # delete this line to publish

# Things on file: ${things.join(', ')}
#
# Claims on file:
${claims.join('\n')}

observations:
  - id: ${observation}
    text: "What happened, in one sentence."
    observedBy: ${person}
    about: [${thing}]

# A new theory. Leave out subject, predicate and object if it does not fit in three parts.
# claims:
#   - id: claim-something
#     label: "The theory, as a sentence"
#     short: "a few words for the graph"
#     subject: ${thing}
#     predicate: requires          # declared in src/content/vocab/predicates.yaml
#     object: ${thing}
#     attributedTo: ${person}

# A position on a claim, new or old. Changing your mind is a new assessment; never edit an old one.
# Stances: tentative, endorses, strongly-endorses, qualifies, questions, disputes, undecided, withdraws
assessments:
  - id: ${assessment}
    claim: ${lastClaim}
    by: ${person}
    stance: tentative
    evidence: [${observation}]
    note: "Optional. One dry sentence."
---

Write the story here. Link recurring things as [some words](thing:${thing}) and
theories as [some words](claim:${lastClaim}).

Footnotes are [^1] in the text and "[^1]: **Title.** The longer version." at the end.
A line containing only ::graph:: puts this post's picture at that point.

Mark the sentence an observation comes from like this: [what happened](obs:${observation}).
`,
);

console.log(`Created ${file}\nIt is a draft. Run "npm run graph" to check it, and delete the draft line to publish.`);
