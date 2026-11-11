<script lang="ts">
  /** Everything on file about the selected thing, claim or observation. */
  import type { CompiledGraph } from '../../lib/graph/compile.ts';
  import { pathFor } from '../../lib/graph/routes.ts';
  import { stance, STATUS_LABELS } from '../../lib/graph/stances.ts';
  import {
    citationsOf,
    claimStatus,
    claimsInvolving,
    dateOf,
    entityLabel,
    evidenceFor,
    indexById,
    latestPositions,
    observationsAbout,
    postFor,
  } from '../../lib/graph/views.ts';

  interface Props {
    graph: CompiledGraph;
    id: string;
    focus: string;
    /** Connections of this record that are not drawn yet. */
    hidden: number;
    base: string;
    onfocus: (id: string) => void;
    onexpand: (id: string) => void;
    onselect: (id: string) => void;
  }

  let { graph, id, focus, hidden, base, onfocus, onexpand, onselect }: Props = $props();

  const found = $derived(indexById(graph).get(id));
  const href = (recordId: string) => base + (pathFor(graph, recordId) ?? '/');
  const typeLabel: Record<string, string> = { person: 'Person', object: 'Object', role: 'Role', routine: 'Routine', concept: 'Concept', place: 'Place' };
</script>

{#if found?.kind === 'entity'}
  {@const entity = found.record}
  {@const claims = claimsInvolving(graph, entity.id)}
  {@const observations = observationsAbout(graph, entity.id)}
  <p class="kind"><span class="dot" data-type={entity.type}>{typeLabel[entity.type]}</span></p>
  <h2>{entity.label}</h2>
  {#if entity.aliases.length}
    <p class="aliases">Also known as {entity.aliases.map((a) => a.label).join(', ')}</p>
  {/if}
  {#if entity.description}<p>{entity.description}</p>{/if}
  <div class="button-row">
    {#if entity.id !== focus}
      <button class="button button--primary" type="button" onclick={() => onfocus(entity.id)}>Focus here</button>
    {/if}
    {#if hidden > 0}
      <button class="button" type="button" onclick={() => onexpand(entity.id)}>Expand connections (+{hidden})</button>
    {/if}
    <a class="button" href={href(entity.id)}>Open its page</a>
  </div>

  {#if claims.length}
    <h3>Claims about it</h3>
    <ul class="records">
      {#each claims as claim (claim.id)}
        {@const status = claimStatus(graph, claim.id)}
        <li>
          <button type="button" class="link" onclick={() => onselect(claim.id)}>{claim.label}</button>
          <span class="stamp stamp--flat" data-status={status}>{STATUS_LABELS[status]}</span>
        </li>
      {/each}
    </ul>
  {/if}

  {#if observations.length}
    <h3>Observations</h3>
    <ul class="records">
      {#each observations as observation (observation.id)}
        <li>
          {observation.text}
          <span class="meta">
            {entityLabel(graph, observation.observedBy)}, {dateOf(graph, observation.seq)}.
            <a href={href(observation.id)}>Read the passage</a>
          </span>
        </li>
      {/each}
    </ul>
  {/if}
{:else if found?.kind === 'claim'}
  {@const claim = found.record}
  {@const status = claimStatus(graph, claim.id)}
  {@const post = postFor(graph, claim.post)}
  {@const evidence = evidenceFor(graph, claim.id)}
  <p class="kind">Claim</p>
  <h2 class:struck={status === 'withdrawn'}>{claim.label}</h2>
  <p><span class="stamp" data-status={status}>{STATUS_LABELS[status]}</span></p>
  <p class="meta">
    Proposed by {entityLabel(graph, claim.attributedTo)} in
    <a href={href(claim.post)}>{post ? post.title : 'a post'}</a>, {dateOf(graph, claim.seq)}
  </p>
  {#if claim.description}<p>{claim.description}</p>{/if}

  <h3>Where things stand</h3>
  <ul class="records">
    {#each latestPositions(graph, claim.id) as position (position.id)}
      {@const s = stance(position.stance)}
      <li>
        {entityLabel(graph, position.by)}: <span class="stance" data-polarity={s.polarity}>{s.label.toLowerCase()}</span>
        <span class="meta">
          {dateOf(graph, position.seq)}.{position.note ? ` “${position.note}”` : ''}
        </span>
      </li>
    {/each}
  </ul>

  {#if evidence.length}
    <h3>Evidence cited</h3>
    <ul class="records">
      {#each evidence as observation (observation.id)}
        <li>
          {observation.text}
          <span class="meta">
            {entityLabel(graph, observation.observedBy)}, {dateOf(graph, observation.seq)}.
            <a href={href(observation.id)}>Read the passage</a>
          </span>
        </li>
      {/each}
    </ul>
  {/if}

  <div class="button-row">
    <a class="button button--primary" href={href(claim.id)}>Open the full record</a>
  </div>
{:else if found?.kind === 'observation'}
  {@const observation = found.record}
  {@const citations = citationsOf(graph, observation.id)}
  <p class="kind">Observation</p>
  <h2 class="quote">{observation.text}</h2>
  <p class="meta">Observed by {entityLabel(graph, observation.observedBy)} on {dateOf(graph, observation.seq)}</p>
  <ul class="chips">
    {#each observation.about as about (about)}
      <li><button type="button" class="chip" onclick={() => onselect(about)}>{entityLabel(graph, about)}</button></li>
    {/each}
  </ul>
  {#if citations.length}
    <h3>Cited by</h3>
    <ul class="records">
      {#each citations as citation (citation.id)}
        {@const claim = graph.claims.find((c) => c.id === citation.claim)}
        <li>
          {entityLabel(graph, citation.by)}, who {stance(citation.stance).verb}
          <button type="button" class="link" onclick={() => onselect(citation.claim)}>{claim?.label}</button>
        </li>
      {/each}
    </ul>
  {/if}
  <div class="button-row">
    <a class="button button--primary" href={href(observation.id)}>Read the passage</a>
  </div>
{:else}
  <p class="quiet">Select something in the graph to see what is on file about it.</p>
{/if}

<style>
  .kind {
    color: var(--ink-soft);
    font-size: 0.88rem;
    margin: 0 0 0.2rem;
  }
  h2 {
    margin: 0 0 0.5rem;
    font-size: 1.45rem;
  }
  h2.struck {
    text-decoration: line-through;
    text-decoration-color: var(--withdrawn);
    text-decoration-thickness: 3px;
  }
  h2.quote {
    font-size: 1.15rem;
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: -0.005em;
  }
  h3 {
    font-size: 0.95rem;
    margin: 1.25rem 0 0.4rem;
    color: var(--ink-soft);
    font-family: var(--font-body);
    font-weight: 600;
    letter-spacing: 0;
  }
  p {
    margin: 0 0 0.7rem;
    font-size: 0.97rem;
  }
  .aliases {
    color: var(--ink-soft);
    font-size: 0.92rem;
  }
  .records {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.95rem;
  }
  .records li {
    padding: 0.5rem 0;
    border-top: 1px solid var(--rule-soft);
  }
  .meta {
    display: block;
    color: var(--ink-soft);
    font-size: 0.88rem;
  }
  p.meta {
    margin-bottom: 0.7rem;
  }
  .link {
    background: none;
    border: 0;
    padding: 0;
    color: var(--blue);
    text-decoration: underline;
    text-underline-offset: 0.18em;
    cursor: pointer;
    text-align: left;
    font-weight: 600;
  }
  .stamp {
    font-size: 0.72rem;
  }
  button.chip {
    cursor: pointer;
  }
</style>
