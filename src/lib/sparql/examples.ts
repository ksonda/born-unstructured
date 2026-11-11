/**
 * Worked examples for the SPARQL page. Each one runs against the published
 * dataset as it is; the prefixes are filled in from the site's own address.
 */
export interface SparqlExample {
  id: string;
  title: string;
  /** What the reader should expect back. */
  note: string;
  query: string;
}

export function sparqlPrefixes(idBase: string, vocabBase: string): string {
  return [
    `PREFIX id: <${idBase}>`,
    `PREFIX bu: <${vocabBase}>`,
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
    'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>',
    'PREFIX prov: <http://www.w3.org/ns/prov#>',
    'PREFIX dcterms: <http://purl.org/dc/terms/>',
    'PREFIX schema: <https://schema.org/>',
  ].join('\n');
}

export function sparqlExamples(idBase: string, vocabBase: string): SparqlExample[] {
  const prefixes = sparqlPrefixes(idBase, vocabBase);
  const q = (body: string) => `${prefixes}\n\n${body.trim()}\n`;
  return [
    {
      id: 'positions',
      title: 'Where everyone currently stands',
      note: 'The latest assessment per person per claim: the one with no later assessment after it.',
      query: q(`
SELECT ?claim ?claimLabel ?person ?stance ?episode WHERE {
  ?a a bu:Assessment ;
     bu:assesses ?claim ;
     prov:wasAttributedTo ?person ;
     bu:stance ?stance ;
     bu:episodeNumber ?episode ;
     bu:sequence ?seq .
  ?claim rdfs:label ?claimLabel .
  FILTER NOT EXISTS {
    ?later bu:assesses ?claim ;
           prov:wasAttributedTo ?person ;
           bu:sequence ?laterSeq .
    FILTER (?laterSeq > ?seq)
  }
}
ORDER BY ?claim ?person`),
    },
    {
      id: 'roster',
      title: 'Who is qualified for which shift',
      note: 'Roles and the individual loveys currently filling them. The role keeps its identifier; the roster is what changes.',
      query: q(`
SELECT ?role ?roleLabel ?lovey WHERE {
  ?role a bu:Role ;
        rdfs:label ?roleLabel .
  OPTIONAL { ?lovey bu:fills ?role }
}
ORDER BY ?roleLabel ?lovey`),
    },
    {
      id: 'open',
      title: 'Questions nobody will commit to',
      note: 'Claims where every position on record is “has not decided”.',
      query: q(`
SELECT ?claim ?label WHERE {
  ?claim a bu:Claim ;
         rdfs:label ?label .
  ?a bu:assesses ?claim ;
     bu:stance bu:Undecided .
  FILTER NOT EXISTS {
    ?other bu:assesses ?claim ;
           bu:stance ?stance .
    FILTER (?stance != bu:Undecided)
  }
}
ORDER BY ?label`),
    },
    {
      id: 'withdrawn',
      title: 'Things Dad subsequently withdrew',
      note: 'Claims with an earlier strong endorsement and a later withdrawal by the same person.',
      query: q(`
SELECT ?claimLabel ?endorsedIn ?withdrawnIn ?note WHERE {
  ?before bu:assesses ?claim ;
          prov:wasAttributedTo id:dad ;
          bu:stance bu:StronglyEndorses ;
          bu:episodeNumber ?endorsedIn ;
          bu:sequence ?s1 .
  ?after bu:assesses ?claim ;
         prov:wasAttributedTo id:dad ;
         bu:stance bu:Withdraws ;
         bu:episodeNumber ?withdrawnIn ;
         bu:sequence ?s2 .
  ?claim rdfs:label ?claimLabel .
  OPTIONAL { ?after rdfs:comment ?note }
  FILTER (?s2 > ?s1)
}
ORDER BY ?withdrawnIn`),
    },
    {
      id: 'saga',
      title: 'The complete pacifier saga',
      note: 'Every observation about either pacifier, in the order it was published.',
      query: q(`
SELECT DISTINCT ?episode ?observer ?what WHERE {
  ?observation a bu:Observation ;
               dcterms:description ?what ;
               prov:wasAttributedTo ?observer ;
               bu:episodeNumber ?episode ;
               schema:about ?pacifier .
  FILTER (?pacifier IN (id:blue-pacifier, id:green-pacifier))
}
ORDER BY ?episode ?what`),
    },
    {
      id: 'names',
      title: 'Objects with suspiciously many names',
      note: 'Objects ranked by the number of aliases on record.',
      query: q(`
SELECT ?thing ?label (COUNT(?alias) AS ?names) (GROUP_CONCAT(?alias; separator=" / ") AS ?aliases) WHERE {
  ?thing a bu:Object ;
         rdfs:label ?label ;
         skos:altLabel ?alias .
}
GROUP BY ?thing ?label
ORDER BY DESC(?names) ?label`),
    },
    {
      id: 'unasserted',
      title: 'Is anything claimed actually asserted?',
      note: 'Checks whether any claim’s subject, predicate and object also appear as a bare triple. It should say no: claims describe statements without making them.',
      query: q(`
ASK {
  ?claim a bu:Claim ;
         rdf:subject ?s ;
         rdf:predicate ?p ;
         rdf:object ?o .
  ?s ?p ?o .
}`),
    },
    {
      id: 'crying',
      title: 'Why is he crying?',
      note: 'The permanent query. It has been run after every episode and has never returned a row.',
      query: q(`
SELECT ?cause WHERE {
  id:baby bu:criesBecause ?cause .
}`),
    },
  ];
}
