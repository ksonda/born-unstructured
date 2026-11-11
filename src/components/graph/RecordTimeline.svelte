<script lang="ts">
  /** The chronological view: an entity's biography, or a claim's history of positions. */
  import type { CompiledGraph } from '../../lib/graph/compile.ts';
  import { pathFor } from '../../lib/graph/routes.ts';
  import { stance } from '../../lib/graph/stances.ts';
  import { claimHistory, dateOf, entityLabel, entityTimeline, indexById, postFor } from '../../lib/graph/views.ts';

  interface Props {
    graph: CompiledGraph;
    id: string;
    base: string;
    onselect: (id: string) => void;
  }

  let { graph, id, base, onselect }: Props = $props();

  const found = $derived(indexById(graph).get(id));
  const href = (recordId: string) => base + (pathFor(graph, recordId) ?? '/');

  interface Row {
    key: string;
    seq: number;
    kind: string;
    text: string;
    polarity?: string;
    /** A record to select in the explorer. */
    select?: string;
    /** A page to open. */
    link?: string;
  }

  const rows = $derived.by((): Row[] => {
    if (found?.kind === 'entity') {
      return entityTimeline(graph, id).map((event, i): Row => {
        const key = `${event.kind}-${i}`;
        switch (event.kind) {
          case 'appearance':
            return { key, seq: event.seq, kind: event.first ? 'First appearance' : 'Appears', text: event.post.title, link: href(event.post.id) };
          case 'alias':
            return { key, seq: event.seq, kind: 'New name', text: `Starts being called ${event.label}` };
          case 'observation':
            return {
              key,
              seq: event.seq,
              kind: `Observed by ${entityLabel(graph, event.observation.observedBy)}`,
              text: event.observation.text,
              select: event.observation.id,
            };
          case 'claim':
            return {
              key,
              seq: event.seq,
              kind: `Claim proposed by ${entityLabel(graph, event.claim.attributedTo)}`,
              text: event.claim.label,
              select: event.claim.id,
            };
          case 'assessment':
            return {
              key,
              seq: event.seq,
              kind: `${entityLabel(graph, event.assessment.by)} ${stance(event.assessment.stance).verb}`,
              polarity: stance(event.assessment.stance).polarity,
              text: event.claim.label,
              select: event.claim.id,
            };
        }
      });
    }
    if (found?.kind === 'claim') {
      return claimHistory(graph, id).map((a) => ({
        key: a.id,
        seq: a.seq,
        kind: `${entityLabel(graph, a.by)}: ${stance(a.stance).label.toLowerCase()}`,
        polarity: stance(a.stance).polarity,
        text: a.note || 'No note recorded.',
        link: href(a.id),
      }));
    }
    if (found?.kind === 'observation') {
      const post = postFor(graph, found.record.post);
      return [{ key: id, seq: found.record.seq, kind: 'Observed', text: post?.title ?? '', link: href(id) }];
    }
    return [];
  });

  const title = $derived(
    found?.kind === 'entity' ? `Biography of ${found.record.label}` : found?.kind === 'claim' ? `Positions on “${found.record.label}”` : 'Timeline',
  );
</script>

<h2>{title}</h2>
{#if rows.length}
  <ol>
    {#each rows as row, i (row.key)}
      <li>
        <span class="when">{i === 0 || rows[i - 1].seq !== row.seq ? dateOf(graph, row.seq) : ''}</span>
        <span class="body">
          <span class="kind" class:stance={row.polarity} data-polarity={row.polarity}>{row.kind}</span>
          {#if row.select}
            <button type="button" onclick={() => onselect(row.select!)}>{row.text}</button>
          {:else if row.link}
            <a href={row.link}>{row.text}</a>
          {:else}
            <span>{row.text}</span>
          {/if}
        </span>
      </li>
    {/each}
  </ol>
{:else}
  <p class="quiet">Nothing has happened to it yet.</p>
{/if}

<style>
  h2 {
    font-size: 1.15rem;
    margin: 0 0 0.75rem;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-top: 1px solid var(--rule-soft);
    font-size: 0.97rem;
  }
  .when {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
  }
  .body {
    display: grid;
    gap: 0.05rem;
  }
  .kind {
    font-size: 0.86rem;
    color: var(--ink-soft);
  }
  .kind.stance[data-polarity='support'] {
    color: var(--held);
  }
  .kind.stance[data-polarity='doubt'] {
    color: var(--disputed);
  }
  .kind.stance[data-polarity='open'] {
    color: var(--unassessed);
  }
  .kind.stance[data-polarity='retract'] {
    color: var(--withdrawn);
  }
  button {
    background: none;
    border: 0;
    padding: 0;
    color: var(--blue);
    text-decoration: underline;
    text-underline-offset: 0.18em;
    cursor: pointer;
    text-align: left;
  }
</style>
