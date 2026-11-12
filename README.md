# Born Unstructured

A newborn-parenting blog that is also a real RDF knowledge graph. Every post is a Markdown file. Its frontmatter adds a few observations, claims and changes of mind to one shared graph, and the build turns that graph into the post pages, a page for every recurring thing and theory, an interactive explorer, a SPARQL playground, and downloadable JSON-LD, Turtle and N-Quads.

Live at **https://ksonda.github.io/born-unstructured/**.

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
| `npm run new -- "Title"` | Scaffolds a new post as a draft, dated today, with the next free record IDs filled in. |

## How the pieces connect

```
src/content/posts/*.md  ─┐
src/content/entities/*   ├─►  compileGraph()  ─►  one validated graph object
src/content/vocab/*     ─┘         │
                                   ├─►  pages: posts, things, claims, beliefs
                                   ├─►  /data/site-graph.json  ─►  explorer, Ask page
                                   └─►  /data/graph.jsonld ─► .nq ─► .ttl  ─►  SPARQL page
```

Everything downstream is generated. `src/lib/graph/compile.ts` is the one place where content becomes a graph. It is a pure function with no file system or Astro in it, so the site build, the tests, the browser and the command-line scripts all run the same code.

## Writing a post

```bash
npm run new -- "The Title of the Post"
```

That creates `src/content/posts/the-title-of-the-post.md` as a draft. The file name is the post's slug and identifier. Posts are ordered by date; two posts from the same day go in file-name order, and a numeric prefix such as `00-` sets that order without becoming part of the slug. A post is prose plus up to three kinds of record in the frontmatter:

```yaml
---
title: "Not All Sloths Are Muppies"
published: 2026-11-11
summary: "One or two sentences for the post list and the RSS feed."

observations:                 # something that happened, as one person reports it
  - id: observation-04
    text: "The 3D-printed sloth is called Messy New. Not New Muppy, and not Printed Muppy."
    observedBy: dad
    about: [messy-new, the-authority]

claims:                       # an interpretation. Recording it does not assert it.
  - id: claim-messy-lineage
    label: "\"Messy\" has become a lineage, not a description of a nose"
    short: "named for the Messy line"   # a few words for the graph edge
    subject: messy-new        # optional triple form; leave all three out if it does not fit
    predicate: namedAfter
    object: messy-muppy
    attributedTo: dad

assessments:                  # one person's position on one claim, as of this post
  - id: assessment-02
    claim: claim-messy-lineage
    by: dad
    stance: tentative
    evidence: [observation-04]
    note: "A working theory."
---
```

**Changing your mind is a new assessment. Never edit an old one.** A later post adds `stance: withdraws` for the same claim and person, and the claim's page, the person's current position, the "Things we believed" list, the explorer and the RDF all follow from that one record. If the proposition itself changes, add a new claim with `refines:` pointing at the old one.

Posts are ordered by `published` date (same-day posts by file name). There are no post numbers to maintain.

Stances: `tentative`, `endorses`, `strongly-endorses`, `qualifies`, `questions`, `disputes`, `undecided`, `withdraws`. A claim whose only positions are `undecided` shows as an open question.

### In the prose

| Write | What it does |
| --- | --- |
| `[the muppy](thing:muppy)` | Links to the thing's permanent page and counts as a mention. |
| `[The nose determines the role.](claim:claim-nose-role)` | Links to the claim's history. |
| `[It's an incident.](obs:observation-02)` | Marks the passage an observation comes from, so evidence can link back to the exact sentence. |
| `[the README](post:readme)` | Links to another published post by its slug. The build fails if there is no such post. |
| `[Things We Believed](page:beliefs)` | Links to a section of the site: `posts`, `things`, `beliefs`, `explore`, `ask`, `query`, `data` or `vocab`. |
| `Some sentence.[^1]` and `[^1]: **Title.** The longer version.` | A footnote. They are gathered at the end with links back. Indent continuation paragraphs and code blocks by four spaces. |
| `::graph::` on a line of its own | Puts the post's graph at that point in the prose instead of at the foot of the page. |
| `![What it shows](/images/posts/photo.jpg)` | A photo from `public/images/`. Two on one line sit side by side. An italic line right after is its caption. Width and height are added at build time. |
| `<!-- a note to yourself -->` | Stays in the Markdown and out of the published page. |

`draft: true` keeps a post, and everything it introduces, out of every page, index and export.

### Things and predicates

Each recurring thing is one file in `src/content/entities/`. The file name is its identifier.

```yaml
label: bedtime
type: routine         # person, object, role, routine, concept or place
description: >
  Goes smoothly when at least one Messy Muppy and at least one Flat Muppy are in the bed.
aliases:
  - lights out            # in use from the thing's first appearance
  - label: the handover   # in use from the first post on or after this date
    since: 2027-02-01
relations:            # plain household facts, asserted without attribution
  - predicate: requires
    object: messy-muppy
image: things/bedtime.jpg   # optional photo, a path under public/images/
```

A thing with an `image` shows the photo on its page, in the explorer's details panel, inside its node in every graph, and as `schema:image` in the RDF.

Keep identifiers stable when names change: add an alias, never rename the file. A thing is published only once a post mentions it, and `public: false` keeps one out entirely (see `grandma.yaml`). The aliases in the example above are made up to show the syntax.

Predicates for claims and relations are declared once in `src/content/vocab/predicates.yaml`, with a label that reads naturally between a subject and an object.

### What the build checks

Photos are plain JPEGs in `public/images/` (`things/` for thing photos, `posts/` for figures). Resize them to about 1600 px on the long side for figures and 480 px square for things, and strip location data before committing; the repository is public. `npm test` fails if a post or thing points at a photo that isn't there.

The build stops, with every problem listed, if a record refers to a thing that is not in the registry, a claim or observation that has not been published by that post or an earlier one, an undeclared predicate, a private entity or a reused identifier. It warns about observations with no marked passage, claims nobody has taken a position on, and aliases dated after the latest post. `npm test` treats those warnings as failures, so CI keeps the content clean.

## The data model

| Record | Meaning | Lives in |
| --- | --- | --- |
| Entity | A recurring person, object, role, routine, concept or place | `src/content/entities/` |
| Post | A published blog post | `src/content/posts/` |
| Observation | One person's report of a particular occurrence | post frontmatter |
| Claim | An interpretation or proposition | post frontmatter |
| Assessment | One person's position on a claim as of one post | post frontmatter |

In RDF, a claim with a subject, predicate and object is an `rdf:Statement`: the triple is described and attributed (`prov:wasAttributedTo`) but never asserted. A test confirms that no claimed triple appears as a bare fact in the export. Relations in the entity registry are the opposite: household facts, asserted as plain triples. The site's own terms (`bu:Post`, `bu:Claim`, `bu:Assessment`, `bu:stance`, the stances, your predicates) are published at `/vocab/` and included in the dataset.

"Current position" is derived: the latest assessment per person per claim. Time travel is by date. Internally each post gets a position in publication order (`seq`), and `cutoff(graph, n)` returns the graph as it stood after the `n`th post. In URLs the explorer and the Ask page use a date instead, `?through=2026-11-11`, meaning the record as of the last post on or before that day. Every record also carries `schema:datePublished` in the RDF.

## Routes

| Route | What it is |
| --- | --- |
| `/posts/[slug]/` | A post, what it added to the record, and its local graph |
| `/things/[id]/` | A thing's biography: names, facts, claims about it, timeline |
| `/claims/[id]/` | A claim, every position ever taken on it, and the evidence cited |
| `/beliefs/` | "Things we believed": held, disputed, previously held, open |
| `/explore/` | The graph explorer. State lives in the URL: `?focus=muppy&through=2026-11-11&select=claim-messy-new-muppy` |
| `/ask/` | Standing questions answered from the graph, as of any date |
| `/query/` | SPARQL in the browser against the published N-Quads |
| `/data/` | `graph.jsonld`, `graph.ttl`, `graph.nq` |
| `/vocab/` | The vocabulary |
| `/id/[id]` | Identifier resolution (see below) |
| `/rss.xml` | Feed |

## Stable identifiers

Every record's IRI is `https://ksonda.github.io/born-unstructured/id/{id}`. GitHub Pages cannot send a `303 See Other`, so each of those addresses is a small static page that redirects the browser to the page describing the record. (The build also writes a `_redirects` file with real 303s, which Cloudflare Pages and Netlify would honor if the site ever moved there.)

**The address is part of every identifier in the published graph.** It is set in `astro.config.mjs`. Moving the site to another domain changes every IRI, so if that day comes, keep the old addresses redirecting. `SITE_URL` overrides the address for a local experiment:

```bash
SITE_URL=http://localhost:4321 npm run build
```

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: tests first, then the Astro build, then publication to GitHub Pages. The repository's Pages source is set to "GitHub Actions" (Settings, Pages). `.github/workflows/ci.yml` runs the tests and a build on pull requests.

The site is served from `/born-unstructured/`, so every internal link goes through `withBase()` in `src/lib/paths.ts`. Use it for any new link in a component or page. Links written in Markdown with `thing:`, `claim:`, `obs:`, `post:` and `page:` are handled for you.

To publish a post: write it, run `npm test`, commit, push.

## Project layout

```
src/content/posts/        Posts: Markdown with graph records in the frontmatter
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
src/lib/prose.ts          thing:, claim:, obs:, post:, page: links and the ::graph:: marker
src/lib/sparql/           Web Worker and example queries
src/components/graph/     Explorer: search, canvas, details, timeline, list
src/components/ask/       Ask the household
src/components/query/     SPARQL playground
src/pages/                Routes, including the data endpoints
scripts/                  graph report, new post
.github/workflows/        deploy.yml (test, build, publish), ci.yml (pull requests)
tests/                    Compiler, views, real content and RDF export
```

## Not built yet

- **SHACL validation.** The first post says the bedtime rule "can be written down as a constraint and checked". The shape is in that post's last note, but the build does not run it. Publishing a shapes file and validating the graph against it at build time would make that sentence literally true.
- **Standard vocabulary mappings.** `bu:kindOf` and `bu:isA` are the site's own terms. Declaring them sub-properties of `skos:broader` and `rdf:type` (or exporting those directly) is a small change in `jsonld.ts`.
- **LLM-proposed records.** The proposal suggests having a model draft the frontmatter from the prose and the registry, for you to accept or reject. `npm run new` already prints the registry and the claims on file into each new draft, which is the context such a step would need.
