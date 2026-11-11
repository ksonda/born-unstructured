<script lang="ts">
  /**
   * The same connections as the picture, as plain HTML. This is the version
   * that works with a keyboard, a screen reader or a very small screen.
   */
  import type { GraphView } from '../../lib/graph/neighborhood.ts';
  import { STATUS_LABELS } from '../../lib/graph/stances.ts';

  interface Props {
    picture: GraphView;
    selected: string | null;
    onselect: (id: string) => void;
  }

  let { picture, selected, onselect }: Props = $props();

  const labels = $derived(new Map(picture.nodes.map((n) => [n.id, n.label])));
  const facts = $derived(picture.edges.filter((e) => e.kind === 'relation'));
  const theories = $derived(picture.edges.filter((e) => e.kind === 'claim'));
  const claimNodes = $derived(picture.nodes.filter((n) => n.kind === 'claim'));
  const observationNodes = $derived(picture.nodes.filter((n) => n.kind === 'observation'));
  const things = $derived(picture.nodes.filter((n) => n.kind === 'entity'));
  const touching = (id: string) =>
    picture.edges
      .filter((e) => e.kind === 'about' && (e.source === id || e.target === id))
      .map((e) => (e.source === id ? e.target : e.source))
      .map((other) => labels.get(other))
      .join(', ');
</script>

<div class="list">
  {#if theories.length || claimNodes.length}
    <h3>Theories</h3>
    <ul>
      {#each theories as edge (edge.id)}
        <li class:selected={edge.record === selected}>
          <button type="button" onclick={() => onselect(edge.record!)}>
            <span class="statement">{labels.get(edge.source)} <em>{edge.label}</em> {labels.get(edge.target)}</span>
            {#if edge.status}<span class="stamp stamp--flat" data-status={edge.status}>{STATUS_LABELS[edge.status]}</span>{/if}
          </button>
        </li>
      {/each}
      {#each claimNodes as node (node.id)}
        <li class:selected={node.id === selected}>
          <button type="button" onclick={() => onselect(node.id)}>
            <span class="statement"><em>{node.label}</em> <span class="quiet">concerning {touching(node.id)}</span></span>
            {#if node.variant in STATUS_LABELS}
              <span class="stamp stamp--flat" data-status={node.variant}>{STATUS_LABELS[node.variant as keyof typeof STATUS_LABELS]}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  {#if facts.length}
    <h3>Household facts</h3>
    <ul>
      {#each facts as edge (edge.id)}
        <li>
          <span class="statement plain">
            <button type="button" class="inline" onclick={() => onselect(edge.source)}>{labels.get(edge.source)}</button>
            {edge.label}
            <button type="button" class="inline" onclick={() => onselect(edge.target)}>{labels.get(edge.target)}</button>
          </span>
        </li>
      {/each}
    </ul>
  {/if}

  {#if observationNodes.length}
    <h3>Observations</h3>
    <ul>
      {#each observationNodes as node (node.id)}
        <li class:selected={node.id === selected}>
          <button type="button" onclick={() => onselect(node.id)}><span class="statement">{node.label}</span></button>
        </li>
      {/each}
    </ul>
  {/if}

  <h3>Things in view</h3>
  <ul class="chips">
    {#each things as node (node.id)}
      <li>
        <button type="button" class="chip" data-type={node.variant} aria-pressed={node.id === selected} onclick={() => onselect(node.id)}>
          {node.label}{node.hidden ? ` (+${node.hidden})` : ''}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  h3 {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--ink-soft);
    letter-spacing: 0;
    margin: 1.25rem 0 0.4rem;
  }
  h3:first-child {
    margin-top: 0;
  }
  ul:not(.chips) {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--rule);
    border-radius: var(--radius);
    background: var(--card);
  }
  ul:not(.chips) li + li {
    border-top: 1px solid var(--rule-soft);
  }
  li > button,
  .plain {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem 1rem;
    width: 100%;
    padding: 0.6rem 0.8rem;
    text-align: left;
    background: none;
    border: 0;
    font-size: 0.97rem;
  }
  li > button {
    cursor: pointer;
  }
  li > button:hover,
  li.selected > button {
    background: var(--blue-wash);
  }
  .plain {
    justify-content: flex-start;
    gap: 0.35rem;
  }
  .inline {
    background: none;
    border: 0;
    padding: 0;
    color: var(--blue);
    text-decoration: underline;
    text-underline-offset: 0.18em;
    cursor: pointer;
    font-weight: 600;
  }
  em {
    color: var(--ink-soft);
  }
  .stamp {
    font-size: 0.72rem;
  }
  button.chip {
    cursor: pointer;
  }
  button.chip[aria-pressed='true'] {
    border-color: var(--blue);
    box-shadow: 0 0 0 1px var(--blue);
  }
</style>
