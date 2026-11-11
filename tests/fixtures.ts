import type { CompileInput } from '../src/lib/graph/compile.ts';
import { entitySchema, postSchema, predicateSchema } from '../src/lib/graph/schema.ts';

/** A two-post household small enough to reason about in a test. */
export function fixture(): CompileInput {
  const entity = (id: string, data: object) => ({ id, data: entitySchema.parse(data) });
  return {
    predicates: [predicateSchema.parse({ id: 'settlesWith', label: 'settles with' }), predicateSchema.parse({ id: 'parentOf', label: 'is a parent of' })],
    entities: [
      entity('baby', { label: 'the Baby', type: 'person' }),
      entity('dad', { label: 'Dad', type: 'person', relations: [{ predicate: 'parentOf', object: 'baby' }] }),
      entity('mom', { label: 'Mom', type: 'person' }),
      entity('walking', { label: 'walking', type: 'routine', aliases: ['laps', { label: 'the circuit', since: '2026-01-05' }] }),
      entity('secret', { label: 'Secret', type: 'object', public: false }),
    ],
    posts: [
      {
        id: '001-first',
        body: '[The Baby](thing:baby) slept. [He fell asleep](obs:obs-1). So [walking works](claim:claim-walking).',
        data: postSchema.parse({
          title: 'First',
          published: '2026-01-01',
          summary: 'One.',
          observations: [{ id: 'obs-1', text: 'He fell asleep.', observedBy: 'dad', about: ['baby', 'walking'] }],
          claims: [{ id: 'claim-walking', label: 'Walking works', subject: 'baby', predicate: 'settlesWith', object: 'walking', attributedTo: 'dad' }],
          assessments: [{ id: 'a-1', claim: 'claim-walking', by: 'dad', stance: 'strongly-endorses', evidence: ['obs-1'] }],
        }),
      },
      {
        id: '002-second',
        body: 'It stopped working.',
        data: postSchema.parse({
          title: 'Second',
          published: '2026-01-08',
          summary: 'Two.',
          assessments: [
            { id: 'a-2', claim: 'claim-walking', by: 'mom', stance: 'questions' },
            { id: 'a-3', claim: 'claim-walking', by: 'dad', stance: 'withdraws', note: 'Rejected.' },
          ],
        }),
      },
    ],
  };
}

export const options = { siteUrl: 'https://example.test/' };
