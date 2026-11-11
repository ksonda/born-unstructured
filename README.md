# Born Unstructured

A newborn-parenting blog that is also a real RDF knowledge graph. Every episode is a Markdown file. Its frontmatter adds a few observations, claims and changes of mind to one shared graph, and the build turns that graph into the article pages, a page for every recurring thing and theory, an interactive explorer, a SPARQL playground, and downloadable JSON-LD, Turtle and N-Quads.

It is a static site: Astro for the pages, Svelte for the interactive parts, Cytoscape.js for the graph, Comunica for SPARQL in the browser. There is no server and no database.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

Requires Node 22.23.4 or newer (the minimum for Astro 7).

| Command | What it does |
| --- | --- |
| `npm run dev` | Local site with live reload. Content edits recompile the graph on each request. |
| `npm run build` | Builds the whole site into `dist/`. Fails with a list of problems if the graph is inconsistent. |
| `npm run preview` | Serves `dist/` locally. |
| `npm test` | Unit tests for the compiler and views, plus checks on the real content and its RDF. |
| `npm run check` | Type-checks the Astro, Svelte and TypeScript files. |
| `npm run graph` | Validates the content and prints what the graph currently says, without building. |
| `npm run new -- "Title"` | Scaffolds the next episode as a draft, with the next free record IDs filled in. |
| `npm run samples:remove` | Deletes the made-up sample episodes and everything that only existed for them. |

## What is in here now

- **Episode 1, "Not All Sloths Are Muppies"**, is the real one. It models the muppy registry: `sloth` and `muppy` as concepts, `Messy Muppy` and `Flat Muppy` as roles, the individual loveys as objects that currently fill a role, and two open questions for the naming authority.
- **Episodes 2 to 5 are made-up samples** (`sample: true` in their frontmatter). They exist to show a theory being proposed, questioned, narrowed and withdrawn across several installments, which one real episode cannot show yet. They carry a banner on the site and a note in the footer.

Two things in episode 1 need your eye:

1. **The lovey headcount.** `lovey-01` to `lovey-04` (two per role) come from the illustrative Turtle in the episode's last note. Edit or delete the files in `src/content/entities/` to match the house.
2. **The screenshot.** The draft had a `<screenshot>` placeholder after the on-call paragraph. It is an HTML comment in the Markdown now, which the site does not publish.

When the real episodes can stand alone:

```bash
npm run samples:remove -- --dry-run   # see what would go
npm run samples:remove
```

## How the pieces connect

```
src/content/posts/*.md  ─┐
src/content/entities/*   ├─►  compileGraph()  ─►  one validated graph object
src/content/vocab/*     ─┘         │
                                   ├─►  pages: episodes, things, claims, beliefs
                                   ├─►  /data/site-graph.json  ─►  explorer, Ask page
                                   └─►  /data/graph.jsonld ─► .nq ─► .ttl  ─►  SPARQL page
```

Everything downstream is generated. `src/lib/graph/compile.ts` is the one place where content becomes a graph. It is a pure function with no file system or Astro in it, so the site build, the tests, the browser and the command-line scripts all run the same code.

## Writing an episode

```bash
npm run new -- "The Title of the Episode"
```

That creates `src/content/posts/00N-the-title-of-the-episode.md` as a draft. An episode is prose plus up to three kinds of record in the frontmatter:

```yaml
---
title: "We Have Discovered a Reliable Method, Once"
episode: 2
published: 2026-12-11
summary: "One or two sentences for the episode list and the RSS feed."

observations:                 # something that happened, as one person reports it
  - id: observation-05
    text: "He fell asleep on lap four of the kitchen walking circuit."
    observedBy: dad
    about: [baby, walking, kitchen]

claims:                       # an interpretation. Recording it does not assert it.
  - id: claim-walking
    label: "Walking helps him settle"
    short: "walking helps"    # a few words for the graph edge
    subject: baby             # optional triple form; leave all three out if it does not fit
    predicate: settlesWith
    object: walking
    attributedTo: dad

assessments:                  # one person's position on one claim, as of this episode
  - id: assessment-05
    claim: claim-walking
    by: dad
    stance: tentative
    evidence: [observation-05]
    note: "Tested once."
---
```

**Changing your mind is a new assessment. Never edit an old one.** A later episode adds `stance: withdraws` for the same claim and person, and the claim's page, the person's current position, the "Things we believed" list, the explorer and the RDF all follow from that one record. If the proposition itself changes, add a new claim with `refines: claim-walking`.

Stances: `tentative`, `endorses`, `strongly-endorses`, `qualifies`, `questions`, `disputes`, `undecided`, `withdraws`. A claim whose only positions are `undecided` shows as an open question.

### In the prose

| Write | What it does |
| --- | --- |
| `[the blue pacifier](thing:blue-pacifier)` | Links to the thing's permanent page and counts as a mention. |
| `[walking helps](claim:claim-walking)` | Links to the claim's history. |
| `[He fell asleep on lap four.](obs:observation-05)` | Marks the passage an observation comes from, so evidence can link back to the exact sentence. |
| `Some sentence.[^1]` and `[^1]: **Title.** The longer version.` | A footnote. They are gathered at the end with links back. Indent continuation paragraphs and code blocks by four spaces. |
| `::graph::` on a line of its own | Puts the episode's graph at that point in the prose instead of at the foot of the page. |
| `<!-- a note to yourself -->` | Stays in the Markdown and out of the published page. |

`draft: true` keeps an episode, and everything it introduces, out of every page, index and export.

### Things and predicates

Each recurring thing is one file in `src/content/entities/`. The file name is its identifier.

```yaml
label: the blue pacifier
type: object          # person, object, role, routine, concept or place
description: >
  One of two pacifiers from the same packet.
aliases:
  - the asset             # in use from the thing's first appearance
  - label: Old Blue       # in use from the episode given
    since: 4
relations:            # plain household facts, asserted without attribution
  - predicate: locatedIn
    object: kitchen
```

Keep identifiers stable when names change: add an alias, never rename the file. A thing is published only once an episode mentions it, and `public: false` keeps one out entirely (see `grandma.yaml`).

Predicates for claims and relations are declared once in `src/content/vocab/predicates.yaml`, with a label that reads naturally between a subject and an object.

### What the build checks

The build stops, with every problem listed, if a record refers to a thing that is not in the registry, a claim or observation that has not been published by that episode, an undeclared predicate, a private entity or a reused identifier. It warns about observations with no marked passage, claims nobody has taken a position on, and aliases that start in an episode that is not out yet. `npm test` treats those warnings as failures, so CI keeps the content clean.

## The data model

| Record | Meaning | Lives in |
| --- | --- | --- |
| Entity | A recurring person, object, role, routine, concept or place | `src/content/entities/` |
| Episode | A published installment | `src/content/posts/` |
| Observation | One person's report of a particular occurrence | episode frontmatter |
| Claim | An interpretation or proposition | episode frontmatter |
| Assessment | One person's position on a claim as of one episode | episode frontmatter |

In RDF, a claim with a subject, predicate and object is an `rdf:Statement`: the triple is described and attributed (`prov:wasAttributedTo`) but never asserted. A test confirms that no claimed triple appears as a bare fact in the export. Relations in the entity registry are the opposite: household facts, asserted as plain triples. The site's own terms (`bu:Claim`, `bu:Assessment`, `bu:stance`, the stances, your predicates) are published at `/vocab/` and included in the dataset.

"Current position" is derived: the latest assessment per person per claim. Time travel is by episode. `cutoff(graph, n)` returns the graph as it stood after episode `n`, and the explorer's `through` parameter and the Ask page use it.

## Routes

| Route | What it is |
| --- | --- |
| `/episodes/[slug]/` | An installment, what it added to the record, and its local graph |
| `/things/[id]/` | A thing's biography: names, facts, claims about it, timeline |
| `/claims/[id]/` | A claim, every position ever taken on it, and the evidence cited |
| `/beliefs/` | "Things we believed": held, disputed, previously held, open |
| `/explore/` | The graph explorer. State lives in the URL: `?focus=muppy&through=1&select=claim-messy-new-muppy` |
| `/ask/` | Standing questions answered from the graph, as of any episode |
| `/query/` | SPARQL in the browser against the published N-Quads |
| `/data/` | `graph.jsonld`, `graph.ttl`, `graph.nq` |
| `/vocab/` | The vocabulary |
| `/id/[id]` | Identifier resolution (see below) |
| `/rss.xml` | Feed |

## Stable identifiers

Every record's IRI is `{SITE_URL}/id/{id}`. On Cloudflare Pages the generated `_redirects` file answers those with a `303 See Other` to the page that describes the record. On any other host a static page at the same address does a client-side redirect.

**Set `SITE_URL` to the real address before the first public deploy and do not change it afterwards.** Every identifier in the published graph is minted under it. Until then it defaults to `https://born-unstructured.example`.

## Deploying to Cloudflare Pages

1. Push the repository to GitHub.
2. In Cloudflare, create a Pages project connected to the repository.
3. Build command `npm run build`, output directory `dist`.
4. Add the environment variable `SITE_URL` (for example `https://bornunstructured.com`), for production and preview.

Every push to `main` publishes, and every pull request gets a preview deployment. `.github/workflows/ci.yml` runs the tests and the build on each push and pull request. `public/_headers` sets the content types and CORS header for the data files.

## Project layout

```
src/content/posts/        Episodes: Markdown with graph records in the frontmatter
src/content/entities/     The registry of recurring things, one YAML file each
src/content/vocab/        Predicates
src/content.config.ts     Astro content collections, using the schemas below
src/site.config.ts        Title, description, default explorer focus, Ask page sagas
src/lib/graph/
  schema.ts               What an author is allowed to write (zod)
  compile.ts              Content in, validated graph out
  views.ts                Time travel, current positions, timelines
  queries.ts              The Ask page's questions as plain functions
  neighborhood.ts         Which nodes and edges a picture shows
  jsonld.ts, rdf.ts       JSON-LD, N-Quads, Turtle and the vocabulary
  routes.ts               Where each record lives on the site
  load-fs.ts              Loads content without Astro, for tests and scripts
src/lib/prose.ts          thing:, claim:, obs: links and the ::graph:: marker
src/lib/sparql/           Web Worker and example queries
src/components/graph/     Explorer: search, canvas, details, timeline, list
src/components/ask/       Ask the household
src/components/query/     SPARQL playground
src/pages/                Routes, including the data endpoints
scripts/                  graph report, new episode, remove samples
tests/                    Compiler, views, real content and RDF export
```

## Not built yet

- **SHACL validation.** Episode 1 says the bedtime rule "can be written down as a constraint and checked". The shape is in the episode's last note, but the build does not run it. Publishing a shapes file and validating the graph against it at build time would make that sentence literally true.
- **Standard vocabulary mappings.** `bu:kindOf` and `bu:isA` are the site's own terms. Declaring them sub-properties of `skos:broader` and `rdf:type` (or exporting those directly) is a small change in `jsonld.ts`.
- **Images.** No episode uses one yet. Astro handles them from `src/assets/` with ordinary Markdown image syntax.
- **LLM-proposed records.** The proposal suggests having a model draft the frontmatter from the prose and the registry, for you to accept or reject. `npm run new` already prints the registry and the claims on file into each new draft, which is the context such a step would need.
