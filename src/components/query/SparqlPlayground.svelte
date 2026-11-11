<script lang="ts">
  /**
   * SPARQL in the reader's browser. The engine (Comunica) and the dataset are
   * only downloaded when this page is opened, and queries run in a worker.
   */
  import { onMount } from 'svelte';
  import type { SparqlExample } from '../../lib/sparql/examples.ts';
  import type { Term, WorkerRequest, WorkerResponse } from '../../lib/sparql/worker.ts';

  interface Props {
    examples: SparqlExample[];
    /** Address of the N-Quads file to query. */
    dataUrl: string;
    /** Site base path without a trailing slash. */
    base: string;
    prefixes: Record<string, string>;
  }

  let { examples, dataUrl, base, prefixes }: Props = $props();

  type Result =
    | { kind: 'bindings'; variables: string[]; rows: (Term | null)[][]; ms: number }
    | { kind: 'boolean'; value: boolean; ms: number };

  let query = $state(examples[0].query);
  let current = $state<string | null>(examples[0].id);
  let status = $state<'loading' | 'ready' | 'running' | 'failed'>('loading');
  let statements = $state(0);
  let result = $state.raw<Result | null>(null);
  let error = $state('');

  let worker: Worker | undefined;
  let nextId = 0;
  const waiting = new Map<number, (response: WorkerResponse) => void>();
  const note = $derived(examples.find((e) => e.id === current)?.note ?? '');

  type Outgoing = { type: 'load'; url: string } | { type: 'query'; query: string };

  function send(message: Outgoing): Promise<WorkerResponse> {
    return new Promise((resolve) => {
      const id = ++nextId;
      waiting.set(id, resolve);
      worker!.postMessage({ ...message, id } as WorkerRequest);
    });
  }

  onMount(() => {
    worker = new Worker(new URL('../../lib/sparql/worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      waiting.get(event.data.id)?.(event.data);
      waiting.delete(event.data.id);
    };
    worker.onerror = (event) => {
      status = 'failed';
      error = event.message || 'The query engine could not be started.';
    };

    const wanted = new URLSearchParams(window.location.search).get('example');
    const example = examples.find((e) => e.id === wanted);
    if (example) {
      query = example.query;
      current = example.id;
    }

    send({ type: 'load', url: new URL(dataUrl, window.location.href).href }).then((response) => {
      if (response.ok && response.kind === 'loaded') {
        statements = response.statements;
        status = 'ready';
        run();
      } else if (!response.ok) {
        status = 'failed';
        error = response.error;
      }
    });

    return () => worker?.terminate();
  });

  async function run() {
    if (status !== 'ready') return;
    status = 'running';
    error = '';
    const response = await send({ type: 'query', query });
    status = 'ready';
    if (!response.ok) {
      result = null;
      error = response.error;
    } else if (response.kind === 'bindings' || response.kind === 'boolean') {
      result = response;
    }
  }

  function load(example: SparqlExample) {
    query = example.query;
    current = example.id;
    run();
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      run();
    }
  }

  /** Shortens an IRI to prefix:local where a known prefix applies. */
  function compact(iri: string): string {
    for (const [prefix, namespace] of Object.entries(prefixes)) {
      if (iri.startsWith(namespace) && iri.length > namespace.length) return `${prefix}:${iri.slice(namespace.length)}`;
    }
    return iri;
  }

  /** Records and vocabulary terms link back into the site. */
  function href(iri: string): string | null {
    if (iri.startsWith(prefixes.id)) return `${base}/id/${iri.slice(prefixes.id.length)}/`;
    if (iri.startsWith(prefixes.bu)) return `${base}/vocab/#${iri.slice(prefixes.bu.length)}`;
    if (/^https?:/.test(iri)) return iri;
    return null;
  }
</script>

<div class="playground">
  <div class="examples">
    <span class="label" id="examples-label">Examples</span>
    <ul aria-labelledby="examples-label">
      {#each examples as example (example.id)}
        <li>
          <button type="button" class="chip" aria-pressed={current === example.id} onclick={() => load(example)}>{example.title}</button>
        </li>
      {/each}
    </ul>
  </div>

  {#if note}<p class="note">{note}</p>{/if}

  <label class="label" for="sparql">Query</label>
  <textarea
    id="sparql"
    spellcheck="false"
    autocapitalize="off"
    autocomplete="off"
    rows="16"
    bind:value={query}
    oninput={() => (current = null)}
    {onkeydown}
  ></textarea>

  <div class="bar">
    <button type="button" class="button button--primary" disabled={status !== 'ready'} onclick={run}>
      {status === 'running' ? 'Running…' : 'Run query'}
    </button>
    <span class="quiet small" role="status">
      {#if status === 'loading'}
        Loading the query engine and the dataset…
      {:else if status === 'failed'}
        The query engine could not start.
      {:else}
        Querying {statements.toLocaleString('en-US')} published statements, in your browser.
      {/if}
    </span>
  </div>

  <section class="results" aria-live="polite" aria-label="Results">
    {#if error}
      <div class="panel error">
        <strong>The query did not run.</strong>
        <pre>{error}</pre>
      </div>
    {:else if result?.kind === 'boolean'}
      <p class="verdict">{result.value ? 'Yes.' : 'No.'}</p>
      <p class="quiet small">Answered in {Math.max(1, Math.round(result.ms))} ms.</p>
    {:else if result?.kind === 'bindings'}
      <p class="quiet small">
        {result.rows.length}
        {result.rows.length === 1 ? 'result' : 'results'} in {Math.max(1, Math.round(result.ms))} ms.
        {#if result.rows.length === 0 && current === 'crying'}
          This is consistent with all previous runs.
        {/if}
      </p>
      {#if result.rows.length}
        <div class="ledger-wrap">
          <table class="ledger">
            <thead>
              <tr>
                {#each result.variables as variable (variable)}
                  <th scope="col">{variable}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each result.rows as row, i (i)}
                <tr>
                  {#each row as term, j (j)}
                    <td>
                      {#if !term}
                        <span class="quiet">&ndash;</span>
                      {:else if term.type === 'iri'}
                        {@const link = href(term.value)}
                        {#if link}<a class="mono" href={link}>{compact(term.value)}</a>{:else}<span class="mono">{compact(term.value)}</span>{/if}
                      {:else if term.type === 'blank'}
                        <span class="mono quiet">_:{term.value}</span>
                      {:else}
                        {term.value}
                      {/if}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {/if}
  </section>
</div>

<style>
  .playground {
    max-width: 62rem;
  }
  .label {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  .examples ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0;
    margin: 0 0 0.9rem;
  }
  .chip {
    cursor: pointer;
  }
  .chip::before {
    display: none;
  }
  .chip[aria-pressed='true'] {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }
  .note {
    max-width: var(--measure);
    color: var(--ink-soft);
    font-size: 0.97rem;
  }
  textarea {
    display: block;
    width: 100%;
    font-family: var(--font-mono);
    font-size: 0.84rem;
    line-height: 1.55;
    padding: 0.8rem 0.9rem;
    border: 1px solid var(--ink-soft);
    border-radius: var(--radius);
    background: var(--card);
    resize: vertical;
    tab-size: 2;
    white-space: pre;
    overflow-x: auto;
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    margin: 0.75rem 0 1.25rem;
  }
  .verdict {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 750;
    margin: 0;
  }
  .error pre {
    margin: 0.5rem 0 0;
    white-space: pre-wrap;
    border: 0;
    padding: 0;
    color: var(--withdrawn);
  }
  .results td {
    overflow-wrap: break-word;
  }
  .results td .mono {
    white-space: nowrap;
  }
</style>
