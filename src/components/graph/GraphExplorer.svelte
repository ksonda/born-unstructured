<script lang="ts">
  /**
   * The explorer. This component owns all of the state and keeps it in the
   * URL, so any view can be shared and the Back button does what a reader
   * expects. The children only draw.
   *
   *   /explore/?focus=muppy&through=1&select=claim-messy-new-muppy
   *
   * focus    the entity at the centre
   * through  show the record as it stood after this episode (omitted = latest)
   * select   the record shown in the details panel
   * expand   nodes whose every connection is drawn
   * hide     entity types (and "claims") to leave out
   * show     "observations" and/or "provenance"
   * view     graph, list, timeline or details
   */
  import { onMount } from 'svelte';
  import type { CompiledGraph } from '../../lib/graph/compile.ts';
  import { neighbourhood } from '../../lib/graph/neighborhood.ts';
  import { ENTITY_TYPES, type EntityType } from '../../lib/graph/schema.ts';
  import { cutoff, indexById } from '../../lib/graph/views.ts';
  import ConnectionList from './ConnectionList.svelte';
  import EntitySearch from './EntitySearch.svelte';
  import GraphCanvas from './GraphCanvas.svelte';
  import RecordDetails from './RecordDetails.svelte';
  import RecordTimeline from './RecordTimeline.svelte';

  type View = 'graph' | 'list' | 'timeline' | 'details';

  interface Props {
    /** Address of the compiled graph JSON. */
    dataUrl: string;
    /** Site base path without a trailing slash. */
    base: string;
    defaultFocus: string;
  }

  let { dataUrl, base, defaultFocus }: Props = $props();

  let full = $state.raw<CompiledGraph | null>(null);
  let failed = $state('');

  let focus = $state(defaultFocus);
  let selected = $state<string | null>(null);
  let through = $state<number | null>(null);
  let expanded = $state<string[]>([]);
  let hiddenTypes = $state<EntityType[]>([]);
  let showClaims = $state(true);
  let showObservations = $state(false);
  let provenance = $state(false);
  let view = $state<View>('graph');

  let canvas = $state<ReturnType<typeof GraphCanvas>>();
  /** The filter list starts collapsed on small screens, where the graph should come first. */
  let filtersOpen = $state(true);

  const typeNames: Record<EntityType, string> = { person: 'People', object: 'Objects', role: 'Roles', routine: 'Routines', concept: 'Concepts', place: 'Places' };

  const episode = $derived(full ? Math.min(through ?? full.latestEpisode, full.latestEpisode) : 0);
  const graph = $derived(full ? cutoff(full, episode) : null);
  const index = $derived(graph ? indexById(graph) : new Map());
  const picture = $derived(
    graph ? neighbourhood(graph, { focus, expanded, hiddenTypes, showClaims, showObservations, provenance }) : { nodes: [], edges: [] },
  );
  const focusEntity = $derived(graph?.entities.find((e) => e.id === focus));
  /** The focus exists in the full record but had not appeared by the chosen episode. */
  const notYet = $derived(!focusEntity ? full?.entities.find((e) => e.id === focus) : undefined);
  const shown = $derived(selected && index.has(selected) ? selected : focus);
  const hiddenOf = (id: string) => picture.nodes.find((n) => n.id === id)?.hidden ?? 0;

  // ------------------------------------------------------------ URL ----

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const list = (key: string) => (params.get(key) ?? '').split(',').filter(Boolean);
    focus = params.get('focus') || defaultFocus;
    selected = params.get('select');
    through = params.has('through') ? Math.max(1, Number(params.get('through')) || 1) : null;
    expanded = list('expand');
    hiddenTypes = list('hide').filter((t): t is EntityType => (ENTITY_TYPES as readonly string[]).includes(t));
    showClaims = !list('hide').includes('claims');
    showObservations = list('show').includes('observations');
    provenance = list('show').includes('provenance');
    const requested = params.get('view');
    view = requested === 'list' || requested === 'timeline' || requested === 'details' ? requested : 'graph';
  }

  function writeUrl(push = false) {
    const params = new URLSearchParams();
    params.set('focus', focus);
    if (through !== null && full && through < full.latestEpisode) params.set('through', String(through));
    if (selected && selected !== focus) params.set('select', selected);
    if (expanded.length) params.set('expand', expanded.join(','));
    const hide = [...hiddenTypes, ...(showClaims ? [] : ['claims'])];
    if (hide.length) params.set('hide', hide.join(','));
    const show = [...(showObservations ? ['observations'] : []), ...(provenance ? ['provenance'] : [])];
    if (show.length) params.set('show', show.join(','));
    if (view !== 'graph') params.set('view', view);
    const url = `${window.location.pathname}?${params.toString().replaceAll('%2C', ',')}`;
    if (push) window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }

  /** A link may point the focus at a claim or an observation. Centre on something it concerns instead. */
  function normaliseFocus() {
    if (!full) return;
    const found = indexById(full).get(focus);
    if (found?.kind === 'claim') {
      selected ??= focus;
      focus = found.record.subject ?? found.record.about[0];
    } else if (found?.kind === 'observation') {
      selected ??= focus;
      showObservations = true;
      focus = found.record.about[0];
    } else if (!found) {
      focus = defaultFocus;
    }
  }

  onMount(() => {
    readUrl();
    filtersOpen = window.matchMedia('(min-width: 46rem)').matches;
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
      })
      .then((data: CompiledGraph) => {
        full = data;
        normaliseFocus();
        writeUrl();
      })
      .catch((error) => (failed = String(error.message ?? error)));

    const onpop = () => {
      readUrl();
      normaliseFocus();
    };
    window.addEventListener('popstate', onpop);
    return () => window.removeEventListener('popstate', onpop);
  });

  // -------------------------------------------------------- actions ----

  /** Selecting only changes what the details panel shows. The picture stays put. */
  function select(id: string) {
    selected = id;
    writeUrl();
  }

  /** Focusing rebuilds the picture around a new centre, and is a step the Back button can undo. */
  function focusOn(id: string) {
    const found = index.get(id) ?? (full ? indexById(full).get(id) : undefined);
    if (!found) return;
    if (found.kind === 'entity') {
      focus = id;
      selected = null;
    } else if (found.kind === 'claim') {
      focus = found.record.subject ?? found.record.about[0];
      selected = id;
    } else if (found.kind === 'observation') {
      focus = found.record.about[0];
      selected = id;
      showObservations = true;
    }
    expanded = [];
    if (view === 'details') view = 'graph';
    writeUrl(true);
  }

  function expand(id: string) {
    if (!expanded.includes(id)) expanded = [...expanded, id];
    writeUrl();
  }

  function setThrough(value: number) {
    if (!full) return;
    const clamped = Math.max(1, Math.min(full.latestEpisode, value));
    through = clamped === full.latestEpisode ? null : clamped;
    writeUrl();
  }

  function toggleType(type: EntityType) {
    hiddenTypes = hiddenTypes.includes(type) ? hiddenTypes.filter((t) => t !== type) : [...hiddenTypes, type];
    writeUrl();
  }

  function setView(next: View) {
    view = next;
    writeUrl();
  }
</script>

{#if failed}
  <p class="panel">The graph data could not be loaded ({failed}). Reload the page to try again.</p>
{:else if !full || !graph}
  <p class="quiet">Loading the graph…</p>
{:else}
  <div class="explorer" data-view={view}>
    <aside class="controls" aria-label="Search and filters">
      <EntitySearch graph={full} onpick={focusOn} />

      <div class="control">
        <label for="through">Show the record as of</label>
        <div class="stepper">
          <button type="button" class="button" aria-label="Earlier episode" disabled={episode <= 1} onclick={() => setThrough(episode - 1)}>&minus;</button>
          <select id="through" value={episode} onchange={(event) => setThrough(Number(event.currentTarget.value))}>
            {#each full.posts as post (post.id)}
              <option value={post.episode}>Episode {post.episode}{post.episode === full.latestEpisode ? ' (latest)' : ''}</option>
            {/each}
          </select>
          <button
            type="button"
            class="button"
            aria-label="Later episode"
            disabled={episode >= full.latestEpisode}
            onclick={() => setThrough(episode + 1)}>+</button
          >
        </div>
      </div>

      <details class="control filters" bind:open={filtersOpen}>
        <summary>Show</summary>
        <fieldset>
          <legend class="visually-hidden">Kinds of thing</legend>
          {#each ENTITY_TYPES as type (type)}
            <label class="check">
              <input type="checkbox" checked={!hiddenTypes.includes(type)} onchange={() => toggleType(type)} />
              <span class="dot" data-type={type}>{typeNames[type]}</span>
            </label>
          {/each}
          <label class="check">
            <input
              type="checkbox"
              checked={showClaims}
              onchange={() => {
                showClaims = !showClaims;
                writeUrl();
              }}
            />
            <span>Claims</span>
          </label>
          <label class="check">
            <input
              type="checkbox"
              checked={showObservations}
              onchange={() => {
                showObservations = !showObservations;
                writeUrl();
              }}
            />
            <span>Observations</span>
          </label>
          <label class="check provenance">
            <input
              type="checkbox"
              checked={provenance}
              onchange={() => {
                provenance = !provenance;
                writeUrl();
              }}
            />
            <span>Provenance: who proposed each claim and who thinks what</span>
          </label>
        </fieldset>
      </details>

      <div class="control legend" aria-label="Legend">
        <span><i class="line solid"></i> Household fact</span>
        <span><i class="line dashed held"></i> Theory, currently held</span>
        <span><i class="line dashed disputed"></i> Theory, disputed</span>
        <span><i class="line dashed withdrawn"></i> Theory, withdrawn</span>
        <span><i class="line dashed unassessed"></i> Open question</span>
      </div>
    </aside>

    <section class="stage" aria-label="Connections">
      <div class="stage__head">
        <div role="tablist" aria-label="View" class="tabs">
          {#each [['graph', 'Graph'], ['list', 'List'], ['timeline', 'Timeline'], ['details', 'Details']] as [id, name] (id)}
            <button type="button" role="tab" class="tab tab--{id}" aria-selected={view === id} onclick={() => setView(id as View)}>{name}</button>
          {/each}
        </div>
        {#if focusEntity && hiddenOf(focus) > 0}
          <button type="button" class="button" onclick={() => expand(focus)}>Expand connections (+{hiddenOf(focus)})</button>
        {/if}
      </div>

      {#if notYet}
        <div class="panel">
          <p>
            <strong>{notYet.label}</strong> does not appear until episode {notYet.mentionedIn[0]}, so there is nothing to show as of episode {episode}.
          </p>
          <button type="button" class="button button--primary" onclick={() => setThrough(notYet.mentionedIn[0])}>
            Jump to episode {notYet.mentionedIn[0]}
          </button>
        </div>
      {:else if picture.nodes.length === 0}
        <div class="panel">
          <p>Nothing to draw with these filters. Turn a kind of thing back on to see {focusEntity?.label ?? 'it'} again.</p>
        </div>
      {/if}

      <div class="pane pane--graph" hidden={picture.nodes.length === 0}>
        <div class="frame">
          <GraphCanvas bind:this={canvas} view={picture} {focus} selected={shown} label={`Connections around ${focusEntity?.label ?? focus}`} onselect={select} />
          <button type="button" class="button recentre" onclick={() => canvas?.resetView()}>Reset view</button>
        </div>
        <p class="selection">
          <strong>{picture.nodes.find((n) => n.id === shown)?.label ?? picture.edges.find((e) => e.record === shown)?.label ?? ''}</strong>
          <button type="button" class="button" onclick={() => setView('details')}>Details</button>
          {#if index.get(shown)?.kind === 'entity' && shown !== focus}
            <button type="button" class="button button--primary" onclick={() => focusOn(shown)}>Focus here</button>
          {/if}
        </p>
      </div>

      <div class="pane pane--list" hidden={picture.nodes.length === 0}>
        <ConnectionList {picture} selected={shown} onselect={select} />
      </div>

      <div class="pane pane--timeline panel">
        <RecordTimeline {graph} id={shown} {base} onselect={select} />
      </div>
    </section>

    <aside class="details panel" aria-label="Details" aria-live="polite">
      <RecordDetails {graph} id={shown} {focus} hidden={hiddenOf(shown)} {base} onfocus={focusOn} onexpand={expand} onselect={select} />
    </aside>
  </div>
{/if}

<style>
  .explorer {
    display: grid;
    grid-template-columns: 15.5rem minmax(0, 1fr) 20rem;
    gap: 1.25rem;
    align-items: start;
  }
  .controls {
    display: grid;
    gap: 1.1rem;
  }
  .control label,
  summary {
    font-weight: 600;
    font-size: 0.9rem;
  }
  .control > label {
    display: block;
    margin-bottom: 0.3rem;
  }
  .stepper {
    display: flex;
    gap: 0.3rem;
  }
  .stepper select {
    flex: 1;
    min-width: 0;
    padding: 0.4rem 0.5rem;
    border: 1px solid var(--ink-soft);
    border-radius: var(--radius);
    background: var(--card);
  }
  .stepper .button {
    padding: 0.4rem 0.75rem;
  }
  fieldset {
    border: 0;
    margin: 0.4rem 0 0;
    padding: 0;
    display: grid;
    gap: 0.3rem;
  }
  summary {
    cursor: pointer;
  }
  .check {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-weight: 400;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .check input {
    margin-top: 0.3em;
    accent-color: var(--blue);
  }
  .check.provenance {
    margin-top: 0.4rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--rule);
  }
  .legend {
    display: grid;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .legend span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .line {
    width: 2rem;
    border-top: 2px solid var(--ink-soft);
    flex: none;
  }
  .line.dashed {
    border-top-style: dashed;
    border-top-width: 3px;
  }
  .line.held {
    border-color: var(--held);
  }
  .line.disputed {
    border-color: var(--disputed);
  }
  .line.withdrawn {
    border-color: var(--withdrawn);
  }
  .line.unassessed {
    border-color: var(--unassessed);
  }

  .stage {
    min-width: 0;
  }
  .stage__head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
  }
  .tabs {
    display: inline-flex;
    border: 1px solid var(--ink);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .tab {
    border: 0;
    background: var(--card);
    padding: 0.4rem 0.9rem;
    font-weight: 600;
    font-size: 0.92rem;
    cursor: pointer;
  }
  .tab + .tab {
    border-left: 1px solid var(--ink);
  }
  .tab[aria-selected='true'] {
    background: var(--ink);
    color: var(--paper);
  }
  .tab--details {
    display: none;
  }

  .pane {
    display: none;
  }
  .pane[hidden] {
    display: none !important;
  }
  [data-view='graph'] .pane--graph,
  [data-view='details'] .pane--graph,
  [data-view='list'] .pane--list,
  [data-view='timeline'] .pane--timeline {
    display: block;
  }
  .frame {
    position: relative;
    height: clamp(24rem, 68vh, 44rem);
  }
  .recentre {
    position: absolute;
    right: 0.6rem;
    bottom: 0.6rem;
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
  .selection {
    display: none;
  }
  .details {
    position: sticky;
    top: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }

  @media (max-width: 68rem) {
    .explorer {
      grid-template-columns: 14rem minmax(0, 1fr);
    }
    .details {
      grid-column: 1 / -1;
      position: static;
      max-height: none;
    }
  }

  @media (max-width: 46rem) {
    .explorer {
      grid-template-columns: minmax(0, 1fr);
    }
    .legend {
      display: none;
    }
    .tab--details {
      display: block;
    }
    .tab {
      padding: 0.45rem 0.7rem;
    }
    .frame {
      height: clamp(20rem, 58vh, 30rem);
    }
    [data-view='details'] .pane--graph {
      display: none;
    }
    .details {
      display: none;
    }
    [data-view='details'] .details {
      display: block;
    }
    .selection {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin: 0.6rem 0 0;
    }
    .selection strong {
      flex: 1 1 100%;
    }
  }
</style>
