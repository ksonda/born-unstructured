<script lang="ts">
  /** Finds things by name or alias, and claims by their wording. */
  import type { CompiledGraph } from '../../lib/graph/compile.ts';

  interface Props {
    graph: CompiledGraph;
    onpick: (id: string) => void;
  }

  interface Hit {
    id: string;
    label: string;
    /** The alias that matched, when the match was not on the main label. */
    via: string;
    type: string;
  }

  let { graph, onpick }: Props = $props();
  let query = $state('');
  let active = $state(0);
  let open = $state(false);

  const normalise = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, '');

  const catalogue = $derived([
    ...graph.entities.flatMap((e) => [
      { id: e.id, label: e.label, via: '', type: e.type, key: normalise(e.label) },
      ...e.aliases.map((a) => ({ id: e.id, label: e.label, via: a.label, type: e.type, key: normalise(a.label) })),
    ]),
    ...graph.claims.map((c) => ({ id: c.id, label: c.label, via: '', type: 'claim', key: normalise(c.label) })),
  ]);

  const hits = $derived.by((): Hit[] => {
    const q = normalise(query).trim();
    if (!q) return [];
    const seen = new Set<string>();
    return catalogue
      .filter((entry) => entry.key.includes(q))
      .sort((a, b) => Number(b.key.startsWith(q)) - Number(a.key.startsWith(q)) || a.label.localeCompare(b.label))
      .filter((entry) => !seen.has(entry.id) && seen.add(entry.id))
      .slice(0, 8);
  });

  function pick(hit: Hit) {
    onpick(hit.id);
    query = '';
    open = false;
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      active = Math.min(active + 1, hits.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      active = Math.max(active - 1, 0);
    } else if (event.key === 'Enter' && hits[active]) {
      event.preventDefault();
      pick(hits[active]);
    } else if (event.key === 'Escape') {
      open = false;
    }
  }
</script>

<div class="search">
  <label for="entity-search">Find a thing or a claim</label>
  <input
    id="entity-search"
    type="search"
    autocomplete="off"
    placeholder="Try &ldquo;Old Blue&rdquo; or &ldquo;dishwasher&rdquo;"
    role="combobox"
    aria-expanded={open && hits.length > 0}
    aria-controls="entity-search-results"
    aria-autocomplete="list"
    aria-activedescendant={open && hits[active] ? `hit-${hits[active].id}` : undefined}
    bind:value={query}
    oninput={() => {
      open = true;
      active = 0;
    }}
    onfocus={() => (open = true)}
    onblur={() => setTimeout(() => (open = false), 150)}
    {onkeydown}
  />
  {#if open && query.trim()}
    <ul id="entity-search-results" role="listbox">
      {#each hits as hit, i (hit.id)}
        <li id={`hit-${hit.id}`} role="option" aria-selected={i === active} class:active={i === active}>
          <button type="button" tabindex="-1" onmousedown={(event) => event.preventDefault()} onclick={() => pick(hit)}>
            <span class="dot" data-type={hit.type}>{hit.label}</span>
            {#if hit.via}<span class="via">also called {hit.via}</span>{/if}
            {#if hit.type === 'claim'}<span class="via">claim</span>{/if}
          </button>
        </li>
      {:else}
        <li class="none">Nothing on record under that name.</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search {
    position: relative;
  }
  label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  input {
    width: 100%;
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--ink-soft);
    border-radius: var(--radius);
    background: var(--card);
  }
  ul {
    position: absolute;
    z-index: 20;
    left: 0;
    right: 0;
    top: calc(100% + 4px);
    margin: 0;
    padding: 0.25rem;
    list-style: none;
    background: var(--card);
    border: 1px solid var(--ink-soft);
    border-radius: var(--radius);
    box-shadow: 4px 4px 0 var(--rule-soft);
  }
  li button {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0 0.6rem;
    width: 100%;
    text-align: left;
    padding: 0.4rem 0.5rem;
    border: 0;
    border-radius: 3px;
    background: none;
    cursor: pointer;
  }
  li.active button,
  li button:hover {
    background: var(--blue-wash);
  }
  .via {
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .none {
    padding: 0.4rem 0.5rem;
    color: var(--ink-soft);
    font-size: 0.92rem;
  }
</style>
