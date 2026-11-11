<script lang="ts">
  /**
   * The small picture at the foot of an episode: the things it mentions and
   * the claims it touched. Tapping anything shows where it leads.
   */
  import type { GraphView } from '../../lib/graph/neighborhood.ts';
  import GraphCanvas from './GraphCanvas.svelte';

  interface Link {
    label: string;
    page: string;
    explore: string;
  }

  interface Props {
    view: GraphView;
    links: Record<string, Link>;
  }

  let { view, links }: Props = $props();
  let selected = $state<string | null>(null);
  const current = $derived(selected ? links[selected] : null);
</script>

<figure class="episode-graph">
  <div class="frame">
    <GraphCanvas {view} focus={view.centre ?? null} {selected} interactive={false} label="The things in this episode and how they connect" onselect={(id) => (selected = id)} />
  </div>
  <figcaption aria-live="polite">
    {#if current}
      <strong>{current.label}</strong>
      <span class="actions">
        <a href={current.page}>Open its page</a>
        <a href={current.explore}>Explore from here</a>
      </span>
    {:else}
      <span class="quiet">Select anything in the picture to see where it leads.</span>
    {/if}
  </figcaption>
</figure>

<style>
  .episode-graph {
    margin: 1rem 0;
  }
  .frame {
    height: min(30rem, 78vw);
    min-height: 20rem;
  }
  figcaption {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
    align-items: baseline;
    padding: 0.7rem 0.1rem 0;
    min-height: 2.6rem;
  }
  .actions {
    display: inline-flex;
    gap: 1.1rem;
  }
</style>
