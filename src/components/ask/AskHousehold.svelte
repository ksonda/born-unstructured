<script lang="ts">
  /**
   * "Ask the household": the questions readers want answered, as buttons.
   * Every answer is computed from the same compiled graph as the rest of the
   * site (src/lib/graph/queries.ts), as of whichever date is chosen.
   */
  import { onMount } from 'svelte';
  import type { CompiledGraph } from '../../lib/graph/compile.ts';
  import { beliefs, disagreements, manyNames, saga, whyIsHeCrying, withdrawalsBy } from '../../lib/graph/queries.ts';
  import { pathFor } from '../../lib/graph/routes.ts';
  import { stance, STATUS_LABELS, type ClaimStatus } from '../../lib/graph/stances.ts';
  import { shortDate } from '../../lib/format.ts';
  import { cutoff, dateOf, entityLabel, parseThrough, throughParam } from '../../lib/graph/views.ts';

  interface Props {
    graph: CompiledGraph;
    /** Site base path without a trailing slash. */
    base: string;
    /** People whose retractions get a question each. */
    household: string[];
    /** Sets of entities whose whole recorded history is worth reading in one go. */
    sagas: { id: string; title: string; entities: string[] }[];
  }

  let { graph: full, base, household, sagas }: Props = $props();

  let through = $state<number | null>(null);
  let question = $state(`withdrawn-${household[0]}`);

  const seq = $derived(Math.min(through ?? full.latestSeq, full.latestSeq));
  const graph = $derived(cutoff(full, seq));
  const asOf = $derived(dateOf(full, seq));
  const href = (id: string) => base + (pathFor(full, id) ?? '/');
  const name = (id: string) => entityLabel(full, id);

  const questions = $derived([
    ...household.map((person) => ({ id: `withdrawn-${person}`, label: `Things ${name(person)} subsequently withdrew` })),
    ...sagas.map((s) => ({ id: `saga-${s.id}`, label: s.title })),
    { id: 'disagree', label: 'Where the parents disagree' },
    { id: 'beliefs', label: `What we believed as of ${asOf}` },
    { id: 'names', label: 'Things with suspiciously many names' },
    { id: 'crying', label: 'Why is the baby crying?' },
  ]);

  const person = $derived(question.startsWith('withdrawn-') ? question.slice('withdrawn-'.length) : null);
  const sagaConfig = $derived(sagas.find((s) => question === `saga-${s.id}`) ?? null);
  const statuses: ClaimStatus[] = ['held', 'disputed', 'withdrawn', 'unassessed'];

  function sync() {
    const params = new URLSearchParams();
    params.set('q', question);
    if (through !== null && through < full.latestSeq) params.set('through', throughParam(full, through));
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get('q');
    if (wanted && questions.some((q) => q.id === wanted)) question = wanted;
    through = parseThrough(full, params.get('through'));
    if (through !== null && through >= full.latestSeq) through = null;
  });

  function ask(id: string) {
    question = id;
    sync();
  }

  function setThrough(value: number) {
    through = value >= full.latestSeq ? null : value;
    sync();
  }
</script>

<div class="ask">
  <div class="asof">
    <label for="ask-through">Answer as of</label>
    <select id="ask-through" value={seq} onchange={(event) => setThrough(Number(event.currentTarget.value))}>
      {#each full.posts as post (post.id)}
        <option value={post.seq}>{shortDate(post.published)}: {post.title}{post.seq === full.latestSeq ? ' (latest)' : ''}</option>
      {/each}
    </select>
  </div>

  <ul class="questions" aria-label="Questions">
    {#each questions as q (q.id)}
      <li><button type="button" class="button" aria-pressed={question === q.id} onclick={() => ask(q.id)}>{q.label}</button></li>
    {/each}
  </ul>

  <section class="answer" aria-live="polite">
    <h2>{questions.find((q) => q.id === question)?.label}</h2>

    {#if person}
      {@const rows = withdrawalsBy(graph, person)}
      {#if rows.length}
        <ul class="rows">
          {#each rows as row (row.claim.id)}
            <li>
              <a class="claim struck" href={href(row.claim.id)}>{row.claim.label}</a>
              <span class="meta">
                {stance(row.endorsed.stance).label} on {dateOf(full, row.endorsed.seq)}{row.endorsed.note ? ` (“${row.endorsed.note}”)` : ''}.
                <a href={href(row.withdrawn.id)}>Withdrawn on {dateOf(full, row.withdrawn.seq)}</a>{row.withdrawn.note ? `: “${row.withdrawn.note}”` : '.'}
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="empty">No retractions on file for {name(person)} as of {asOf}.</p>
      {/if}
    {:else if sagaConfig}
      {@const events = saga(graph, sagaConfig.entities)}
      {#if events.length}
        <ol class="rows">
          {#each events as event, i (i)}
            <li class="event">
              <span class="when">{i === 0 || events[i - 1].seq !== event.seq ? dateOf(full, event.seq) : ''}</span>
              <span>
                {#if event.kind === 'observation'}
                  {event.observation.text}
                  <span class="meta">Observed by {name(event.observation.observedBy)}. <a href={href(event.observation.id)}>Read the passage</a></span>
                {:else if event.kind === 'alias'}
                  {event.entity.label} starts being called <strong>{event.label}</strong>
                {:else if event.kind === 'claim'}
                  {name(event.claim.attributedTo)} proposes: <a href={href(event.claim.id)}>{event.claim.label}</a>
                {:else}
                  {name(event.assessment.by)}
                  <span class="stance" data-polarity={stance(event.assessment.stance).polarity}>{stance(event.assessment.stance).verb}</span>
                  <a href={href(event.assessment.id)}>{event.claim.label}</a>
                  {#if event.assessment.note}<span class="meta">&ldquo;{event.assessment.note}&rdquo;</span>{/if}
                {/if}
              </span>
            </li>
          {/each}
        </ol>
      {:else}
        <p class="empty">Nothing had happened yet as of {asOf}.</p>
      {/if}
    {:else if question === 'disagree'}
      {@const rows = disagreements(graph)}
      {#if rows.length}
        <ul class="rows">
          {#each rows as row (row.claim.id)}
            <li>
              <a class="claim" href={href(row.claim.id)}>{row.claim.label}</a>
              {#each row.positions as position (position.id)}
                <span class="meta">
                  {name(position.by)}:
                  <span class="stance" data-polarity={stance(position.stance).polarity}>{stance(position.stance).label.toLowerCase()}</span>,
                  {dateOf(full, position.seq)}{position.note ? `. “${position.note}”` : ''}
                </span>
              {/each}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="empty">As of {asOf} the parents agreed about everything.</p>
      {/if}
    {:else if question === 'beliefs'}
      {@const all = beliefs(graph)}
      {#each statuses as status (status)}
        {@const group = all.filter((b) => b.status === status)}
        {#if group.length}
          <h3><span class="stamp stamp--flat" data-status={status}>{STATUS_LABELS[status]}</span></h3>
          <ul class="rows">
            {#each group as row (row.claim.id)}
              <li>
                <a class="claim" class:struck={status === 'withdrawn'} href={href(row.claim.id)}>{row.claim.label}</a>
                <span class="meta">
                  {#each row.positions as position, i (position.id)}
                    {i > 0 ? '; ' : ''}{name(position.by)}
                    <span class="stance" data-polarity={stance(position.stance).polarity}>{stance(position.stance).label.toLowerCase()}</span>
                  {/each}
                </span>
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    {:else if question === 'names'}
      {@const rows = manyNames(graph)}
      {#if rows.length}
        <ol class="rows">
          {#each rows as entity (entity.id)}
            <li>
              <a class="claim" href={href(entity.id)}>{entity.label}</a>
              <span class="meta">
                {entity.aliases.length} other {entity.aliases.length === 1 ? 'name' : 'names'}: {entity.aliases.map((a) => a.label).join(', ')}
              </span>
            </li>
          {/each}
        </ol>
      {:else}
        <p class="empty">As of {asOf} everything still had exactly one name.</p>
      {/if}
    {:else if question === 'crying'}
      {@const outcome = whyIsHeCrying(graph)}
      <p class="verdict">0 results</p>
      <p class="measure">
        Searched {outcome.searched.observations} observations, {outcome.searched.claims} claims and {outcome.searched.assessments} assessments
        across {outcome.searched.posts} {outcome.searched.posts === 1 ? 'post' : 'posts'}. The query completed successfully.
      </p>
      <p class="measure quiet">
        This question has been asked after every post and has never returned a row. The result is reproducible.
        <a href={`${base}/query/?example=crying`}>Run it yourself in SPARQL</a>
      </p>
    {/if}
  </section>
</div>

<style>
  .asof {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.75rem;
    margin-bottom: 1.25rem;
  }
  .asof label {
    font-weight: 600;
    font-size: 0.92rem;
  }
  .asof select {
    padding: 0.4rem 0.5rem;
    border: 1px solid var(--ink-soft);
    border-radius: var(--radius);
    background: var(--card);
    max-width: 100%;
  }
  .questions {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
  }
  .questions .button[aria-pressed='true'] {
    background: var(--ink);
    color: var(--paper);
  }
  .answer {
    margin-top: 2rem;
    padding-top: 0.25rem;
    border-top: 3px double var(--rule);
    max-width: var(--measure);
  }
  .answer h2 {
    margin-top: 1.5rem;
  }
  h3 {
    margin: 1.5rem 0 0.25rem;
  }
  .rows {
    list-style: none;
    margin: 0.75rem 0 0;
    padding: 0;
  }
  .rows > li {
    padding: 0.75rem 0;
    border-top: 1px solid var(--rule);
  }
  .claim {
    font-family: var(--font-display);
    font-weight: 650;
    font-size: 1.12rem;
    line-height: 1.25;
    color: var(--ink);
    text-decoration: none;
  }
  .claim:hover {
    color: var(--blue);
  }
  .claim.struck {
    text-decoration: line-through;
    text-decoration-color: var(--withdrawn);
    text-decoration-thickness: 2px;
  }
  .meta {
    display: block;
    color: var(--ink-soft);
    font-size: 0.93rem;
    margin-top: 0.15rem;
  }
  .event {
    display: grid;
    grid-template-columns: 5.25rem 1fr;
    gap: 0.75rem;
  }
  .when {
    font-family: var(--font-display);
    font-weight: 700;
  }
  .empty {
    margin-top: 0.75rem;
    color: var(--ink-soft);
  }
  .verdict {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0.75rem 0 1rem;
  }
  @media (max-width: 34rem) {
    .event {
      grid-template-columns: 1fr;
      gap: 0.1rem;
    }
  }
</style>
