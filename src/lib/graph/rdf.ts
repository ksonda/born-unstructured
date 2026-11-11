/**
 * RDF serialisations derived from the JSON-LD document. Build-time only.
 */
import jsonld from 'jsonld';
import { Parser, Writer } from 'n3';

/** Canonical-ish N-Quads: one statement per line, sorted so diffs between builds are meaningful. */
export async function toNQuads(document: object): Promise<string> {
  const nquads = (await jsonld.toRDF(document, { format: 'application/n-quads' })) as unknown as string;
  return nquads.split('\n').filter(Boolean).sort().join('\n') + '\n';
}

export function toTurtle(nquads: string, prefixes: Record<string, string>): Promise<string> {
  const quads = new Parser({ format: 'N-Quads' }).parse(nquads);
  const writer = new Writer({ prefixes });
  writer.addQuads(quads);
  return new Promise((resolve, reject) => {
    writer.end((error, result) => (error ? reject(error) : resolve(result ?? '')));
  });
}
