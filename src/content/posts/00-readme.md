---
title: "README"
published: 2026-11-11
summary: "What this blog is, who's writing it, how every post doubles as data in a real knowledge graph, and who built what."

# The file name starts with 00- so that this sorts ahead of anything else published the same day.
# The post's slug and identifier are still "readme".
mentions: [dad, mom]
---

Every data engineer eventually meets a source with no schema, no documentation, and no service-level agreement. It emits output at 3 a.m., changes formats without warning, and has strong opinions about which cup is the correct cup.

Ours is almost four. A second one is due any day now, and I've been told there is no staging environment.

In data work, "unstructured" is what we call everything that doesn't arrive in neat rows and columns: text, photos, audio, the contents of a diaper bag.[^1] Most of the world is unstructured, and so is most of a family. Children are born unstructured, and then everyone spends about eighteen years arguing about the schema.

Hence the name, Born Unstructured.

## What this is

This is a blog about parenthood, life and work, told through knowledge graphs.[^2] Each post takes something that happened in our house and pairs it with an idea from linked data, such as naming, categories, sameness, provenance, or the slow heartbreak of schema change.

It started as a joke, and then parenting kept raising the questions I get paid to think about. When is a thing the same thing? Who gets to name it? What are its most important attributes? How does it relate to other things, like the place it currently is and the place that it should go? What do you do when two sources disagree, and one of them is screaming?

This is not an advice blog, so please do not model your household on my ontology. It is partly an explainer. I try to keep things humorous at a high level but I also provide footnotes on technology, philosophy, history, and whatever to go as deep as I want, and supposedly also for people who are curious about how I think.

Mostly, it's a place to think out loud about how the job and the family keep leaking into each other, in both directions.

## My perspective

I wear four hats, usually at the same time, usually at 12:30 a.m.

- **Urban planner.** I was trained to look at the systems people live inside, and to expect every plan to be overruled by the reality. A household is a small city with an endless stakeholder engagement process.
- **Hydrologist.** Everything flows downhill and collects at the lowest point. This is true of water, of poop, of laundry, and of goldfish crackers.
- **Semantic tech enthusiast.** My day job involves giving rivers permanent identifiers, so that different agencies can agree they're talking about the same creek.[^3] I find this deeply satisfying, and I have accepted what that says about me.
- **Tired parent and husband.** This is the main role. The others are side projects.

## How it works

Every post is published twice: once as a post you can read, and once as data in a real knowledge graph you can query.

The graph is built in RDF, the W3C standard for describing things as small three-part statements: subject, predicate, object.[^4] "Messy Muppy, is a, muppy." "Flat Muppy, has condition, flat." Each person, object and idea in the house gets a stable identifier, and each post adds statements or revises old ones. The vocabulary that says what kinds of things exist and how they relate is an ontology,[^5] which here is a fancy word for "house rules, written down."

Statements also carry provenance: who said it, in which post, and how sure we were.[^6] Parenting beliefs have a short half-life, so this gets used. When we change our minds, the old claim stays on the record and moves to a page called [Things We Believed](page:beliefs), where it can be studied by future historians, and by us at 2 a.m.

On the site you can [wander the graph visually](page:explore), [download it in standard formats](page:data), or [ask it questions directly in SPARQL](page:query), the query language for this kind of data.[^7]

There is one rule. The kids get identifiers and no personal details, so the graph knows what my child calls a stuffed sloth and has no idea where anyone goes to preschool.

## Advisory

The stories, the ideas, the bad jokes, the identifiers, the ontology are mine, in all of their...qualities.

Everything about the user experience like the layout, the colors, the graph explorer, the build pipeline, and the web hosting arrangements is done by AI assistants.[^8] I describe what I want and point at things.

## Why not Substack

The normal move would be to put this on Substack or Medium. Those platforms are good at posts, and they have nowhere to put a knowledge graph. I couldn't publish the triples alongside each post, or put an interactive graph next to the prose, or let you run a SPARQL query against my household.

So the workflow is a little more involved. I write a post in Markdown and add what happened, and what I think it means, to the graph. Then I hand it to Claude or ChatGPT, which wire the new nodes into the site, embed the graph views and exploration tools around the prose, and push the result to GitHub. The site rebuilds and publishes itself from there. It's more steps than clicking Publish, but the extra ones are somebody else's.

## What to expect

Posts go up when the sleep budget allows. There is no release schedule, and barely a bedtime schedule.

Next up is a post about identifiers: [why not all sloths are muppies](post:not-all-sloths-are-muppies), and why the household naming authority insists that two loveys identical to every adult are completely different objects. After that, Montessori laundry: a place for everything, everything in its place, and nothing folded.

Known issues at launch:

- The author is tired.
- The schema will change. Breaking changes will not be announced in advance, because nobody announces them to me either.
- A new user is about to be onboarded with no documentation and full admin rights.

Thanks for reading the README. Almost nobody does.

## Notes

[^1]: **Unstructured data.** Data people sort information into rough tiers. Structured data fits a fixed table where every row has the same columns, like a spreadsheet of stream gauge readings. Semi-structured data has labels but a flexible shape, like JSON or an email with headers. Unstructured data has no predefined model at all: free text, images, audio, video.

    Most of what organizations actually hold is unstructured. Making it useful to a machine usually means pulling out the entities and the relationships between them, which is roughly what this blog does to my family, by hand.

[^2]: **Knowledge graphs.** A knowledge graph stores information as things (nodes) and the relationships between them (edges), instead of rows in tables. "Messy Muppy" is a node; "is a kind of sloth" is an edge to another node. The payoff is flexibility: you can add a new kind of relationship without redesigning a database, and you can follow connections across topics.

    The term covers a few technologies. This blog uses the W3C's semantic web stack (note 4), not a property graph database. The tradeoffs between those camps are a long argument I'll spare you, except to say that RDF was designed for data shared across groups that don't trust each other's naming conventions, which describes my household.

[^3]: **Persistent identifiers.** A persistent identifier (PID) is a name for something that is meant to keep working for decades, even as websites, databases and organizations come and go. DOIs for scholarly papers are the familiar example.

    In water data, the same creek can have a different ID in every agency's system, so combining data about it is painful. A PID gives the creek one web address that any system can use, and that address redirects to whatever currently describes it. The trick is separating three things: the identifier (stable, boring), the label (friendly, prone to change), and the data (constantly updated). [The next post](post:not-all-sloths-are-muppies) applies this to sloths.

[^4]: **RDF and triples.** RDF (Resource Description Framework) describes everything as triples: subject, predicate, object. Each part is usually a web address (a URI), so "Messy Muppy" becomes an identifier anyone can link to instead of a string of letters.

    Because every statement has the same three-part shape, you can merge graphs from different sources by putting the triples in the same pile, with no table joins or migration scripts. RDF can be written in several syntaxes (Turtle, JSON-LD, N-Quads) that all describe the same graph, which is why the site offers [downloads](page:data) in more than one.

[^5]: **Ontologies.** An ontology is a formal vocabulary for a domain: what classes of things exist, what properties connect them, and what rules apply ("every muppy is a sloth, but not every sloth is a muppy"). Lighter versions are called vocabularies or schemas; schema.org is one most of the web uses without knowing it.

    SKOS is a simpler W3C standard for concept schemes with broader and narrower terms. The household ontology reuses existing standards where it can and invents terms only where it must. Its terms are listed on the [vocabulary page](page:vocab).

[^6]: **Provenance.** Provenance is the record of where a piece of data came from: who asserted it, when, from what evidence, by what process. The W3C standard for it is PROV-O. In science and government data, provenance is what lets you trust a number, or at least know whom to call about it.

    Here, it lets a claim like "the baby prefers being held facing out" carry its source (one parent), its date (one bad Tuesday) and its confidence (low). When a claim is revised, provenance is what keeps the old belief retrievable instead of erased.

[^7]: **SPARQL.** SPARQL (pronounced "sparkle"; the early 2000s were like that) is the query language for RDF. Instead of selecting rows from tables, you describe a pattern of triples with blanks in it, and the database fills in every match. "Find every object that is a muppy and has a damaged nose" is a short query. You can [run it in your browser](page:query) on the site, against the live graph.

[^8]: **The stack.** The site is an Astro static site with a Svelte graph explorer, built from content files and the graph at build time. Static means no server runs code when you visit: the pages are pre-built files, which keeps the site cheap, fast and low-maintenance. Low maintenance was the main design requirement.

    The graph is compiled from source files into JSON-LD, Turtle and N-Quads, and SPARQL queries run in your browser. If any of this breaks, I'll be asking an AI why. The source is on [GitHub](https://github.com/ksonda/born-unstructured).
