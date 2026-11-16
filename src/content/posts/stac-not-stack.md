---
title: "STAC, Not Stack"
published: 2026-11-15
summary: "The dresser fell apart with the first kid. With the second, we stopped folding on purpose: a catalog of labeled bins, two hampers, and no transform step."
draft: false

# The individual steps of the garment lifecycle are drawn in the figure, not linked in the prose.
mentions: [clean-in-bin, worn, wash-and-dry, sort-by-label]

observations:
  - id: observation-06
    text: "When the first kid arrived, the dresser system fell apart. Both parents were overwhelmed and nobody had time to fold."
    observedBy: dad
    about: [dresser-system, entropic-laundry, the-authority]
  - id: observation-07
    text: "The second kid forced a redesign."
    observedBy: dad
    about: [entropic-laundry, bin-system, baby]
  - id: observation-08
    text: "The bin system covers both kids and Mom so far."
    observedBy: dad
    about: [bin-system, the-authority, baby, mom]
  - id: observation-09
    text: "With labeled bins, anyone who can read can put laundry away correctly. Including Dad."
    observedBy: dad
    about: [bin-system, sort-by-label, dad]
  - id: observation-10
    text: "On a busy day, folding was the step that didn't happen, and the load stayed on the bed. With bins, dryer to storage is one trip."
    observedBy: dad
    about: [dresser-system, entropic-laundry, bin-system, sort-by-label]
  - id: observation-11
    text: "Muppies go through the wash now and then, but they don't need sorting. A clean muppy goes straight back to its job, not to a bin."
    observedBy: dad
    about: [muppy, bin-system, messy-muppy, flat-muppy, bedtime]

claims:
  - id: claim-bins-sustainable
    label: "Bins are more sustainable than dressers"
    short: "more sustainable than"
    subject: bin-system
    predicate: moreSustainableThan
    object: dresser-system
    attributedTo: dad

assessments:
  - id: assessment-05
    claim: claim-bins-sustainable
    by: dad
    stance: endorses
    evidence: [observation-06, observation-07, observation-08, observation-09, observation-10]
    note: "The dresser system collapsed under one kid. The bins were built for two."
---

Before kids, our laundry ran on [a dresser](thing:dresser-system). Everything got folded, everything had a drawer, and the system worked fine for two adults with free evenings. (Context, such as it is, in the [README](post:readme).)

Then [the first kid](thing:the-authority) arrived and [the dresser system fell apart. We were both overwhelmed, nobody had time to fold](obs:observation-06), and laundry management became [purely entropic](thing:entropic-laundry). A clean load came out of the dryer, got dumped on the bed, and sat there in a warm, unindexed heap. Somebody needed pajamas at 6:45 pm, the heap got excavated, and half of it became the next load by sheer contact. That system ran, in the sense that a river runs, for about four years.

[The second kid](thing:baby) [forced a redesign.](obs:observation-07) This time we stopped folding on purpose, as a matter of policy. The replacement is borrowed, loosely, from our older kid's Montessori school,[^1] with a generous helping of good-enough engineering (more on that later). Montessori classrooms are built so that a three-year-old can take something off an open shelf and put it back where it lives, without an adult. ([Here's a representative one](https://raintreemontessori.org/current/nine-qualities-of-an-authentic-montessori-school/#iLightbox[gallery11651]/0).) Every item has a place, and the place is obvious. If a preschooler can run that system before snack time, two tired adults can probably run a version of it at 11 pm.

Ours comes down to fewer clothes, [a labeled place for every kind of thing](thing:bin-system), and no step that requires a skill I don't have. [It covers both kids and mom so far.](obs:observation-08) The thesis, stated plainly for the knowledge graph's benefit, is that [bins are more sustainable than dressers](claim:claim-bins-sustainable).

It is, of course, a data modeling problem. That's the only kind of problem this blog knows how to have.

## Less inventory, more turnover

The first move is owning fewer clothes and cycling them faster, so each piece gets worn, washed, put back in its bin and worn again within days. A big wardrobe is a big buffer, and big buffers hide problems. With 30 shirts, the laundry can go unprocessed for three weeks before anyone notices. With eight, the system tells you on Thursday.

The second move is retiring the dresser, or at least the contract it implies. A drawer of folded clothes is a stack, an ordered sequence in a format only its author can write. Every garment gets transformed (folded) before it's stored, and its position in the stack carries meaning. Pull one shirt from the middle and the whole stack is corrupted.

We replaced it with open bins, each with a label, plus hangers for whatever wrinkles or refuses to sit in a bin. Clean clothes go in the bin their label says, as they are. Nobody folds anything.

Satellite imagery (and other "spatiotemporal data", largely in the earth sciences) already has a standard built on this idea, called STAC (the SpatioTemporal Asset Catalog).[^2] A STAC catalog doesn't repackage the data. It leaves each file where it is, in whatever format it's in, and records what it is, which collection it belongs to, and where to find it. The bins are a STAC catalog for laundry. Each bin is a collection, each garment is an item, and the only metadata that matters is membership. There's still a schema, just no transform step.

A bin's contents are a pile, but a pile of a known type, and that was most of what anyone needed from folding in the first place.

## Choosing the bins

The interesting part is the labels. A bin works only if anyone holding a clean garment can tell where it goes in about two seconds, without asking. That's the whole spec, and it's harder than it sounds, because some categories are crisp and some are vibes.[^3]

The crisp ones are defined by what the thing *is*. You can tell by looking at it.

- **Socks.** No one has ever wondered whether something is a sock.
- **Underwear.** Same.
- **Pajamas**

The hard ones depend on use, occasion, or somebody's opinion, so sorting the item needs information the item doesn't carry.

- **long-sleeve shirt vs. sweaters.** Is a sweatshirt a shirt or a sweater? It depends on who you ask, which is the problem.
- **Pants vs. leggings.** Leggings worn as pants are pants. Leggings under a dress are something else.
- **"Nice clothes."** The person who bought them knows which ones they are. Nobody else does.

Librarians and ontologists have a whole discipline for this.[^4] The cheapest test I know is to hand the same ten garments to two adults separately and see whether they bin them the same way.[^5] Where their disagreement cannot be resolved on a second pass, fix the label, not the adults.

Categories also have to be mutually exclusive, or every item has two homes and therefore none.

The two kids are very different users. [The newborn](thing:baby) is a stakeholder, not yet a contributor. [The preschooler](thing:the-authority)'s bins have the strictest acceptance test in the house. In the Montessori spirit, she should eventually be able to put her own clothes away, so the labels have to work for a reader who is almost four.

Then there are [the muppies](thing:muppy) from [the last post](post:not-all-sloths-are-muppies). [They go through the wash now and then, but they don't need sorting, exactly. A clean muppy goes straight back to its job.](obs:observation-11) The one hard constraint comes from [bedtime](thing:bedtime), which needs at least one [Messy Muppy](thing:messy-muppy) and at least one [Flat Muppy](thing:flat-muppy). With only two Flat Muppies qualified, they can't both be in the same load.

Here's what's actually in production. [Mom](thing:mom)'s bins sort by garment type, with one bin each for underwear, bras, socks, shorts/capris, tank tops, T-shirts, long-sleeve shirts, pants and sweaters. "Shorts/capris" is a compound label that avoids a boundary dispute by declining to draw the boundary. The preschooler's drawers follow the same pattern at a smaller scale (short-sleeve shirts, long-sleeve shirts, long pants, shorts, tank tops, socks, underwear, hats and mittens), plus two drawers of pajamas. Each of her labels has her name on the first line. That works as a namespace prefix, so her socks drawer and the baby's "socks etc." drawer are different collections that happen to share a local name.

![Mom's closet: a SWEATERS tub on a shelf with the overflowing reuse basket on top, the gray mesh dirty hamper beside it](/images/posts/bins-mom-closet.jpg) ![Mom's bins: UNDERWEAR, BRAS, SOCKS and SHORTS/CAPRIS baskets on top; TANK TOPS, T SHIRTS, LONG SLEEVE SHIRTS and PANTS tubs below](/images/posts/bins-mom-shelves.jpg)

*Mom's catalog. The reuse hamper is the basket on top of the shelf, and it is winning.*

The newborn's system is the interesting one. Clothes are partitioned by size, into 0–3, 3–6 and 6–9 months. A baby size is really a date range, so this is a time axis, the temporal half of SpatioTemporal. Everything else is sorted by job, into bibs, burp cloths, washcloths, sheets, swaddles, and swaddle blankets, which are not the same bin as swaddles. Don't worry about it. Outerwear and hats get a drawer, and there's a basket labeled Miscellaneous, the catch-all every taxonomy needs.

![The kids' system: baskets for miscellaneous, sheets, swaddle blankets, burp cloths and swaddles over rows of labeled drawers, including 0M-3M, 3M-6M and 6M-9M](/images/posts/bins-kids.jpg)

*The kids' catalog. Swaddles and swaddle blankets are separate collections. Names on the labels blurred.*

## Two hampers

Our household, and perhaps others, has a third laundry state, worn but not dirty. Jeans worn for an afternoon. A sweater worn over something else for an hour. These used to pile up on The Chair, which was never meant for storage and has no label, so the pile just kept growing.

We gave that state its own hamper. [The dirty hamper](thing:dirty-hamper) goes to the wash. [The reuse hamper](thing:reuse-hamper) goes back on a body. That's the whole change, and it fixes a lot. Clean bins stay clean because nothing half-worn goes back in them, nothing wearable gets washed out of guilt, and the chair gets to be a chair again. In my wife's closet, the dirty hamper is a gray mesh pop-up and the reuse hamper is a plain laundry basket on top of the shelf.

In data terms, the chair was an unmodeled state,[^6] a real condition things kept ending up in, with no name, no rules and no exit. Naming it was most of the fix. "Dirty," incidentally, is already a term of art in computing, and means roughly the same thing.[^7]

![A garment lifecycle: clean in its bin, worn, then either the reuse hamper (and back to worn) or the dirty hamper, wash and dry, sort by label with no folding, and back to the bin](/images/posts/garment-lifecycle.jpg)

*The one step that used to need a skill, putting clean clothes away, is now a lookup.*

## The part where I'm the problem

I have historically been a big failure point for laundry in this household. Partly I'm bad at it. My folds don't match the house style, my stacks lean, and things I put away turn up later in the wrong drawer. Partly I didn't make it a priority. I never put in the time to develop the muscle memory that would allow me to quickly and effectively fold clothes.

From [her](thing:mom) side, I suspect that looked less like incompetence and more like a choice. In any case, when the first kid came, there was no slack left for anyone to absorb that, and the drawers lost.

Folding is tacit knowledge.[^8] The person who's good at it can't fully write down how, so it can't be handed off, so it stays with whoever has it. That's a single point of failure, and in a house with a newborn the single point of failure is already the most overbooked person in the house.

The other problem is structural. A lot of good household management comes down to tasks you can finish in one go, and laundry is full of built-in interruptions. You wait on the washer, then the dryer, and even then the clean load has to be sorted and folded before it reaches storage. [On a busy day, folding was the step that didn't happen. The load stayed on the bed, and that's how we ended up with the entropic system.](obs:observation-10) With bins, the stretch from the dryer to storage is one trip. You carry the load over and [sort it straight in](thing:sort-by-label).

My folding never improved. The system changed instead, and the bins swap a skill for a label. [If I can read, I can put laundry away correctly](obs:observation-09), and nobody has to check my work, because there's almost nothing to get wrong. It's either the right bin or the wrong bin, and the label says which. I no longer have an excuse, which is the point.

## Well documented, technically sound, and nobody can implement it

There's an uncomfortable parallel with my day job. Through the Internet of Water,[^9] we spend a lot of time recommending how water agencies should share data, with open standards, persistent identifiers, linked-data markup, well-specified APIs and exchange protocols. They're open in the sense that anyone may use them, and they're well documented and technically sound, but none of that makes them easy. An agency whose one data person also runs the billing system can read every word of a spec and still not have the hours or the skills to implement it. Open on paper isn't the same as open in practice.

At work, I'm the one prescribing the folding. At home, I'm the agency that can't implement it.

Fields that depend on lots of people contributing tend to land on the same compromise. When collaboration isn't optional, the design target moves from "correct" to "easy to do correctly." Tim Berners-Lee's five-star scheme for open data gives the first star for putting data on the web in any format at all, and saves linked data for star five.[^10] Software people call the general idea "worse is better," meaning a simpler design that people actually adopt beats a perfect one they don't.[^11] Nobody sets out to pick the worse design, but in a shared system the one that gets implemented is often the simpler one.

The bins are a one-star, or maybe two-star laundry standard. There is a cost to implementing this, and a certain political scientist would want me to name it.[^12] Folding carried knowledge the bins don't, like which shirt goes with which pants, what's getting too small and what's secretly a favorite. The labels flatten all of that. So far it's a trade we'd make again, because the alternative was one person carrying all of it.

## Deployment status

- **In production:** both kids' clothes and [mom](thing:mom)'s clothes.
- **Legacy system:** [mine](thing:dad). Migration is planned. Stakeholders are skeptical, with cause.
- **Known issue:** the taxonomy will change as edge cases arrive. Children are an inexhaustible supply of edge cases.
- **Known issue:** the reuse hamper is overflowing. Worn-but-not-dirty turns out to be the most popular state in the closet.
- **Known issue:** "nice clothes" that need to be hung don't really fit the system. We both work from home, and I can hang things better than I can fold them, so it's fine for now.

Next time, maybe something with fewer bins in it.

[^1]: **Montessori, loosely.** Maria Montessori's method, developed in early-1900s Italy and set out in English in [*The Montessori Method*](https://www.gutenberg.org/ebooks/39863) (1912, free on Project Gutenberg), leans hard on the "prepared environment," meaning child-sized furniture and a small set of materials on open shelves, each with a fixed place, so children can find things and put them back without an adult. For a representative classroom, see Raintree Montessori's ["Nine Qualities of an Authentic Montessori School"](https://raintreemontessori.org/current/nine-qualities-of-an-authentic-montessori-school/), which describes materials laid out by subject on long, low shelves, and "a place for everything and everything is in its place." We borrowed "fixed place" and "without an adult" and pointed them at tired adults. No certification is implied.

[^2]: **STAC, and the missing transform step.** [STAC](https://stacspec.org/en/about/stac-spec/) (SpatioTemporal Asset Catalog) is an open specification for describing geospatial data, built on JSON. Its pieces nest. An *Item* is one unit of data plus its metadata, written as a GeoJSON feature with a time, a footprint, and links to its *assets*, the actual files. A *Collection* groups the Items that make up one dataset and adds its extent, license and providers. A *Catalog* links Items and child Catalogs so the whole thing can be browsed or crawled, organized however you like. A STAC API adds search by place and time.

    The design choice that matters here is that an Item points at its data instead of containing it. The imagery stays where it already lives, in whatever format it's in, and the catalog only says what it is and where to find it. Compare the classic data pipeline, ETL (extract, transform, load), where everything is reshaped into the destination's format before it's stored. Folding is the T. The bins keep the E and the L and skip the transform. The garment goes in as it is, and its membership in a labeled collection is the whole index.

    There's a second difference. A folded stack is an ordered sequence, where position carries meaning. A bin is an unordered set, where only membership does. That's why pulling one shirt out wrecks a stack and does nothing to a bin. Loosely mapped, the wardrobe is the Catalog, each bin is a Collection, each garment is an Item, and the garment itself is the asset, unfolded and unbothered.

[^3]: **Fuzzy categories.** The psychologist Eleanor Rosch showed that people don't sort things by checklists of required features ([Rosch 1975](https://doi.org/10.1037/0096-3445.104.3.192), *Journal of Experimental Psychology: General*). They compare against a best example, a prototype. A robin is a very birdy bird; a penguin is a bird, but less so. Fuzzy-edged categories are completely normal for people and a pain for any system that needs each item in exactly one place. "Top" has a clear prototype (a T-shirt). Its edges (a sweatshirt worn as a jacket?) are where the arguments happen. Clothing was, fittingly, one of the categories she tested.

[^4]: **Controlled vocabularies and SKOS.** A controlled vocabulary is an agreed list of terms, each with one meaning, so different people tag things the same way. Library subject headings are the classic example. On the web, the W3C standard for publishing one is [SKOS](https://www.w3.org/TR/skos-reference/) (Simple Knowledge Organization System), in which each term is a concept with its own URI, a preferred label, optional alternate labels, a definition, and links to broader or narrower terms. A catch-all concept for "everything else" is common and respectable. A bin vocabulary in SKOS might look like this.

    ```turtle
    @prefix h:    <https://example.org/household/> .
    @prefix skos: <http://www.w3.org/2004/02/skos/core#> .

    h:laundry-bins a skos:ConceptScheme ;
        skos:prefLabel "Laundry bins"@en .

    h:bin-socks a skos:Concept ;
        skos:inScheme h:laundry-bins ;
        skos:prefLabel "Socks"@en ;
        skos:definition "Goes on a foot. No further questions."@en .

    h:bin-misc a skos:Concept ;
        skos:inScheme h:laundry-bins ;
        skos:prefLabel "Everything else"@en ;
        skos:scopeNote "Whatever accumulates here is a candidate for its own bin."@en .
    ```

[^5]: **Inter-annotator agreement.** When researchers have people label data (is this review angry? is this pixel a road?), they check whether two labelers independently give the same answer. The standard score, Cohen's kappa ([Cohen 1960](https://doi.org/10.1177/001316446002000104), *Educational and Psychological Measurement*), measures agreement beyond what chance alone would produce. Low agreement usually means the category definitions are bad, not the labelers. Same with bins.

[^6]: **Unmodeled states.** Software that tracks things through a lifecycle (an order goes from placed to paid to shipped to delivered) usually uses a [state machine](https://en.wikipedia.org/wiki/Finite-state_machine), which is a fixed list of states and the allowed moves between them. Bugs collect wherever reality has a state the model lacks. You find them by looking for where things go to sit indefinitely. In a house, look for a chair.

[^7]: **Dirty, technically.** Computers keep working copies of data in fast memory (a cache) and write changes back to slower storage later. A cached copy that's been changed but not yet written back is flagged "dirty" (the [dirty bit](https://en.wikipedia.org/wiki/Dirty_bit)), and it has to be written back before its space can be reused. A worn shirt is modified state that must be written back through the washing machine before it returns to the bin. The reuse hamper is a deliberate decision to skip write-back for low-stakes changes, which in a computer is a bug and in a closet is a sweater.

[^8]: **Tacit knowledge.** The chemist-turned-philosopher Michael Polanyi argued in [*The Tacit Dimension*](https://search.worldcat.org/title/262429494) (1966) that "we can know more than we can tell." Skills like riding a bike or recognizing a face resist being written down. Organizations struggle with this constantly, because knowledge that can't be written down can't be handed off, and it leaves when the person does. The fitted sheet is the canonical household example.

[^9]: **The Internet of Water.** The [Internet of Water Coalition](https://internetofwater.org/) works to modernize how public water data in the U.S. is shared and integrated; I lead the program at the Center for Geospatial Solutions. Its core system, [Geoconnex](https://internetofwater.org/geoconnex/), connects scattered water datasets through shared identifiers for rivers, wells, gages and other water features. The standards behind it are good ones. The hard part has never been the standards.

[^10]: **Five-star open data.** Berners-Lee's [five-star scheme](https://5stardata.info/en/) is cumulative. One star means it's on the web in any format under an open license. Two means machine-readable, three a non-proprietary format, four URIs naming things, and five links to other people's data. The genius is that star one is achievable by almost anyone today, and every later star is a reason to come back.

[^11]: **Worse is better.** Richard P. Gabriel's essay ["The Rise of Worse is Better"](https://dreamsongs.com/RiseOfWorseIsBetter.html) contrasted "the right thing" (correct, consistent, complete) with a style that puts simplicity of implementation first, and argued the simpler style spreads faster and survives better. Unix and C were his examples. He later argued both sides of his own thesis, which is the most honest thing a person with a thesis can do.

[^12]: **Legibility.** In [*Seeing Like a State*](https://en.wikipedia.org/wiki/Seeing_Like_a_State) (1998), the political scientist James C. Scott describes how states make societies "legible" (standard surnames, property surveys, standard units) so they can be counted and managed, and how that simplification can wreck the practical local knowledge he calls *mētis*. A labeled bin system is a small act of state-building inside a closet, and the folder's mētis (this goes with that; this is getting small) is what it costs. Scott would be right, and the bins are staying anyway.
