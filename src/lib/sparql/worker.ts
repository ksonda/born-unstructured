/**
 * Runs SPARQL in a Web Worker so a slow query never freezes the page.
 * The dataset is the published N-Quads file, held in an in-memory store and
 * queried with Comunica. There is no server.
 */
import { QueryEngine } from '@comunica/query-sparql-rdfjs-lite';
import { Parser, Store } from 'n3';

export interface Term {
  type: 'iri' | 'literal' | 'blank';
  value: string;
  datatype?: string;
}

export type WorkerRequest = { id: number; type: 'load'; url: string } | { id: number; type: 'query'; query: string };

export type WorkerResponse =
  | { id: number; ok: true; kind: 'loaded'; statements: number }
  | { id: number; ok: true; kind: 'bindings'; variables: string[]; rows: (Term | null)[][]; ms: number }
  | { id: number; ok: true; kind: 'boolean'; value: boolean; ms: number }
  | { id: number; ok: false; error: string };

const engine = new QueryEngine();
let store: Store | undefined;

function toTerm(term: { termType: string; value: string; datatype?: { value: string } } | undefined): Term | null {
  if (!term) return null;
  if (term.termType === 'NamedNode') return { type: 'iri', value: term.value };
  if (term.termType === 'BlankNode') return { type: 'blank', value: term.value };
  return { type: 'literal', value: term.value, datatype: term.datatype?.value };
}

async function run(request: WorkerRequest): Promise<WorkerResponse> {
  if (request.type === 'load') {
    const response = await fetch(request.url);
    if (!response.ok) throw new Error(`Could not load the dataset (${response.status})`);
    store = new Store(new Parser({ format: 'N-Quads' }).parse(await response.text()));
    return { id: request.id, ok: true, kind: 'loaded', statements: store.size };
  }

  if (!store) throw new Error('The dataset has not finished loading.');
  const started = performance.now();
  const result = await engine.query(request.query, { sources: [store] });

  if (result.resultType === 'boolean') {
    const value = await result.execute();
    return { id: request.id, ok: true, kind: 'boolean', value, ms: performance.now() - started };
  }

  if (result.resultType === 'bindings') {
    const metadata = await result.metadata();
    const variables = metadata.variables.map((entry: any) => (entry.variable ?? entry).value as string);
    const bindings = await (await result.execute()).toArray();
    const rows = bindings.map((binding) => variables.map((name) => toTerm(binding.get(name) as any)));
    return { id: request.id, ok: true, kind: 'bindings', variables, rows, ms: performance.now() - started };
  }

  if (result.resultType === 'quads') {
    const quads = await (await result.execute()).toArray();
    const rows = quads.map((quad) => [toTerm(quad.subject as any), toTerm(quad.predicate as any), toTerm(quad.object as any)]);
    return { id: request.id, ok: true, kind: 'bindings', variables: ['subject', 'predicate', 'object'], rows, ms: performance.now() - started };
  }

  throw new Error('Only SELECT, ASK, CONSTRUCT and DESCRIBE queries are supported here.');
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  try {
    self.postMessage(await run(event.data));
  } catch (error) {
    self.postMessage({ id: event.data.id, ok: false, error: error instanceof Error ? error.message : String(error) } satisfies WorkerResponse);
  }
};
