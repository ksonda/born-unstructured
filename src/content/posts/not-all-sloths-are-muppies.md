---
title: "Not All Sloths Are Muppies"
published: 2026-11-11
summary: "A legacy schema inventory of the household's sloths, taken before the newborn arrives. Two of the four turn out to be jobs."

# The individual loveys and most of the prints are never named in the prose, so they are listed here.
mentions: [lovey-01, lovey-02, lovey-03, lovey-04, lovey-05, messy-new-01, messy-new-02, messy-new-03, messy-new-04, messy-new-05, messy-new-06, messy-new-07]

observations:
  - id: observation-01
    text: "To any adult the loveys look the same. To the almost-four-year-old they very much do not."
    observedBy: dad
    about: [the-authority, messy-muppy, flat-muppy]
  - id: observation-02
    text: "A bed full of Messy Muppies and no Flat Muppy is not a bedtime. It's an incident."
    observedBy: dad
    about: [bedtime, messy-muppy, flat-muppy]
  - id: observation-03
    text: "Big Muppy is a stuffed animal, not a blankie. It is a muppy because it is a sloth, and a cute and prominent one."
    observedBy: dad
    about: [big-muppy, muppy, sloth]
  - id: observation-04
    text: "The 3D-printed sloths are called Messy New. Not New Muppy, and not Printed Muppy."
    observedBy: dad
    about: [messy-new, the-authority]

  - id: observation-05
    text: "Seven 3D-printed sloths share the name Messy New. Each one goes by its color: pink Messy New, teal Messy New, olive Messy New."
    observedBy: dad
    about: [messy-new, the-authority]
claims:
  - id: claim-nose-role
    label: "The nose determines the role"
    short: "the nose decides the role"
    description: >
      Any lovey with a messed-up nose is qualified to be Messy Muppy tonight, and any with a
      flattened one can be Flat Muppy. Within a role they are interchangeable. Across roles they are not.
    about: [messy-muppy, flat-muppy, the-authority]
    attributedTo: dad
  - id: claim-messy-lineage
    label: "\"Messy\" has become a lineage, not a description of a nose"
    short: "named for the Messy line"
    subject: messy-new
    predicate: namedAfter
    object: messy-muppy
    attributedTo: dad
  - id: claim-messy-new-muppy
    label: "Messy New is a kind of muppy"
    short: "a kind of muppy?"
    subject: messy-new
    predicate: kindOf
    object: muppy
    about: [the-authority]
    attributedTo: dad
  - id: claim-newborn-muppy
    label: "The newborn gets a muppy"
    short: "gets a muppy?"
    about: [baby, muppy, the-authority]
    attributedTo: dad

assessments:
  - id: assessment-01
    claim: claim-nose-role
    by: dad
    stance: endorses
    evidence: [observation-01, observation-02]
    note: "Took an embarrassingly long time to understand."
  - id: assessment-02
    claim: claim-messy-lineage
    by: dad
    stance: tentative
    evidence: [observation-04]
    note: "A working theory."
  - id: assessment-03
    claim: claim-messy-new-muppy
    by: dad
    stance: undecided
    evidence: [observation-03, observation-05]
    note: "They're sloths, so they clear the one firm rule. Cute enough and prominent enough is the authority's call."
  - id: assessment-04
    claim: claim-newborn-muppy
    by: dad
    stance: undecided
    note: "I don't know. That's what the graph is for."
---

## Before the new user arrives

We are about to have a newborn. Everyone tells you to prepare the older sibling, and we are. [Our almost-four-year-old](thing:the-authority) has questions. Most of them are about logistics.

But I've come to think the real onboarding problem runs the other way. [The newborn](thing:baby) is joining a household with an existing information system, and that system has a governance model, a controlled vocabulary, and exactly one naming authority. The naming authority is not yet four.

I work on data infrastructure. Meanwhile, at home, a preschooler has built a naming system for stuffed sloths that is frankly more coherent than some federal datasets I've had to join.

So before the baby shows up and starts generating new data, I want to document the system as it stands. Call it a legacy schema inventory. This blog tracks the household as a knowledge graph, an actual one published as RDF,[^1] not a metaphor. How that works is in the [README](post:readme). It's called *Born Unstructured* because that's how everyone arrives. First, the sloths.

## Meet the muppies

The central entity in our household is [the muppy](thing:muppy). If you don't have a small child: a lovey is the specific soft object a kid needs in order to sleep.[^2] The word "specific" is doing a lot of work there. Keep an eye on it. A muppy is our household's version, and the admission rules are simple: any [sloth](thing:sloth) cute enough and prominent enough to be let into the system.

Here is the current registry, as dictated by the naming authority:

| Name | What it is | How you tell it apart |
| --- | --- | --- |
| ![](/images/things/messy-muppy.jpg) [Messy Muppy](thing:messy-muppy) | A role, not a single lovey. Four identical-looking blankie-style sloths are qualified to fill it | The nose is, in the household's technical vocabulary, "all messed up" |
| ![](/images/things/flat-muppy.jpg) [Flat Muppy](thing:flat-muppy) | Another role, filled from the same kind of lovey. One is qualified at the moment | The nose has been chewed flat |
| [Big Muppy](thing:big-muppy) | A similar sloth, but an actual stuffed animal rather than a blankie | It has volume |
| ![](/images/things/messy-new.jpg) [Messy New](thing:messy-new) | Seven 3D-printed sloths from the same model, each named for its color | The color. Status: complicated |

Yes, the first two rows are jobs, not stuffed animals. Bedtime requires at least one Messy Muppy and at least one Flat Muppy, and there are five loveys in the house qualified for one shift or the other: four for Messy, and, at the moment, one for Flat. [To any adult they look the same. To the almost-four-year-old they very much do not.](obs:observation-01)

![Two identical sloth loveys lying side by side](/images/posts/two-loveys.jpg)

*Two of the loveys, side by side. To any adult, the same lovey twice.*

So what looks like a list of four stuffed animals is actually a working demonstration of about five distinct problems in information science, and the person who built it can't read yet.

## Sloth, muppy, Messy Muppy

There are at least three different kinds of thing in that table, and the kid keeps them straight without effort.

**"Sloth" is a concept.** It's the animal kind. Sloths exist whether or not anyone in this house owns one.

**"Muppy" is a household category.** Being a muppy is not the same as being a sloth. A sloth becomes a muppy by being admitted to the system, and only one person does the admitting. The entry requirements are short. Be a sloth. Be cute enough and prominent enough. Blankie or stuffed animal doesn't come into it. Not all sloths are muppies. All muppies are sloths.

**"Messy Muppy" is a role.** Not a species, not a brand, and, it turns out, not any particular object. It's a slot that has to be filled at [bedtime](thing:bedtime), or car ride time, and several loveys are qualified to fill it.

To be clear, the kid can tell every one of these loveys apart. They are not, to the kid, the same lovey.[^3] But for the job, any qualified one will do. It works like an on-call rotation: everyone on the team is a distinct person, and the pager doesn't care which of them picks up. It just needs somebody. Each bedtime, each car ride, the shift gets filled fresh.

![Four sloth loveys piled together on a blanket](/images/posts/loveys.jpg)

*The rotation, off duty.*

And then there are two more things. One is the physical lovey actually on duty tonight. The other is the *name* "Messy Muppy", a string of letters that is none of the above. Philosophers have been drawing distinctions like this for about a hundred and thirty years.[^3] Data people mostly learn them the hard way.

In water data, the version of this problem is that a river, the name of the river, and the line in a GIS file that someone digitized decades ago are three different things. Plenty of systems treat them as one. Then the river gets renamed, or the line gets redrawn, and everything downstream (sorry) breaks.

A knowledge graph makes you be explicit. The concept, the category, the object, and the name each get their own node, and the relationships between them are stated rather than assumed.[^4] Big Muppy is a nice test case. It's a stuffed animal, not a blankie, and it looks nothing like a Messy Muppy. It doesn't have to. [Big Muppy is a muppy because it is a sloth, and a cute and prominent one.](obs:observation-03) The test was never "is it like the original?" It was "is it a sloth, and did it make the cut?"[^5]

## Flat Muppy and the identity problem

Here's the part that took me an embarrassingly long time to understand. There is no single Messy Muppy. There are five loveys in this house, all the same model, that look identical to every adult who has examined them. Four of them are Messy Muppies. One, currently, is a Flat Muppy. Bedtime goes smoothly when at least one of each is in the bed.

To the kid this is not complicated. [The nose determines the role.](claim:claim-nose-role) Any lovey with a messed-up nose is qualified to be Messy Muppy tonight, and any with a flattened one can be Flat Muppy. Within a role they're interchangeable. Across roles they absolutely are not. [A bed full of Messy Muppies and no Flat Muppy is not a bedtime. It's an incident.](obs:observation-02)

![A Messy Muppy, held up to the camera](/images/posts/messy-muppy.jpg) ![A Flat Muppy, held up to the camera](/images/posts/flat-muppy.jpg)

*Left, a Messy Muppy: the nose is all messed up. Right, a Flat Muppy: the nose has been chewed flat. For the first one you may have to take the kid's word for it.*

Most databases would get this wrong in one of two directions. One is to merge all the identical-looking loveys into one record, because the product description matches. The other is to treat every lovey as unique and lose the fact that they're interchangeable for the one purpose that matters. A knowledge graph won't make either assumption on its own; you have to say what's the same and what's different.[^6]

The kid is running a three-layer model: the category (muppy), the role (Messy or Flat), and the individual lovey. Each layer needs its own identity, and the individual loveys need identifiers that don't depend on which role they happen to be in this week.[^7]

This is a familiar pattern in environmental monitoring. A stream gage monitoring site keeps the same identifier for decades, while the physical sensor on the bridge gets swapped out when it fails. Nobody asks for data from the sensor. They ask for data from the site. Messy Muppy is the site. Whichever lovey is on duty tonight is the sensor.[^8]

It also quietly fixes the complaint I was going to make about descriptive names. "Messy" and "Flat" look like the kind of names that break when the thing they describe changes. But they don't name loveys. They name roles, and the nose is the qualifying criterion. If a Messy Muppy's nose gets chewed flat, nothing in the system becomes inaccurate. That lovey just changes jobs. This is more elegant than some schemas I've reviewed professionally.

## Messy New, or how a name becomes a type

Then there's [Messy New](thing:messy-new), and this is where the system gets genuinely sophisticated. Messy New is not one sloth. [It's seven, printed from the same model, and each one goes by its color: pink Messy New, teal Messy New, olive Messy New.](obs:observation-05)

![Seven 3D-printed sloths in a row: rose gold, teal, black, olive, red, maroon and pink](/images/posts/messy-new-lineup.jpg)

*The Messy New line, complete as of this writing.*

That's a composite name. One part says what kind of thing it is, and the other tells the members apart. Plenty of real data is keyed this way, a site plus a parameter, a product plus a size, and it works right up until someone prints a second pink one.[^11]

Look at the name. [It isn't "New Muppy" or "Printed Muppy." It's *Messy* New.](obs:observation-04) My working theory is that ["Messy" has stopped being a description of a nose and become something more like a lineage](claim:claim-messy-lineage). The Messy Muppies came first. Messy New is the new branch of the Messy line. The adjective has been promoted to a type.

Languages do this all the time. A brand name becomes the word for the whole category, and the company loses its trademark.[^9] Software does it too, any time a project's first version becomes the template everything after it is measured against. Our household did it in under four years with no committee.

[Whether Messy New is a kind of muppy](claim:claim-messy-new-muppy) is, as of this writing, not something I'm confident about. They're sloths, so they clear the one firm rule. They're in the Messy line. They came out of a printer, seven at a time. Whether that adds up to cute enough and prominent enough is not my call. I'm treating it as an open question and leaving it to the authority.

![An olive 3D-printed sloth in the palm of a hand](/images/posts/olive-messy-new.jpg)

*Olive Messy New, for scale. Cute? Prominent? Not my call.*

Which brings us to the newborn. In a few weeks a new person arrives who will, at some point, need a lovey. The questions write themselves:

- [Does the newborn get a muppy](claim:claim-newborn-muppy), or does the category stay closed?
- If a new muppy is admitted, who names it? The authority, or whoever is holding the baby when the subject comes up?
- Babies chew things. Chewing is, historically, how names happen around here. What does that do to the registry?
- What happens the first time the baby grabs whichever lovey is on Messy duty?

I don't know. That's what the graph is for.

## The graph so far

Here's the registry as a graph. Solid lines are things the authority has confirmed. Dashed lines are open questions.

::graph::

Every node in that picture gets a stable identifier in the published graph, and every name is just a label hung on it.[^10] When a nose changes, a lovey moves between roles and nothing else has to. The bedtime rule, at least one Messy and at least one Flat, can be written down as a constraint and checked. When the newborn arrives, they get a node too. What they get attached to is above my pay grade.

This is version 1 of the muppy registry. I expect breaking changes.

Next up: Montessori laundry. A place for everything, everything in its place, and nothing folded.

## Notes

For readers who want the longer version. Each note links back to where it came from.

[^1]: **Knowledge graphs and RDF.** A knowledge graph stores information as a web of small statements, each with three parts: a subject, a predicate, and an object. "Messy Muppy, is a, muppy." "Flat Muppy, has nose condition, chewed flat." RDF (the Resource Description Framework) is the W3C standard for writing those statements down so that systems built by different people can read them.

    The important trick is that subjects and predicates are named with web addresses rather than plain words. "Muppy" in my graph and "muppy" in yours can then be declared the same thing, or kept apart, on purpose rather than by accident. That's why RDF shows up in libraries, the life sciences, and government data: places where many institutions describe overlapping things and nobody controls the whole vocabulary. The [W3C RDF Primer](https://www.w3.org/TR/rdf11-primer/) is the readable starting point.

[^2]: **Transitional objects.** The pediatrician and psychoanalyst D. W. Winnicott coined "transitional object" in 1953 for the blanket or soft toy a young child attaches to. His argument, roughly, was that the object sits between the child's inner world and the outside one, and helps with the work of tolerating separation.

    Whatever you make of the psychoanalytic framing, the usual parental report is that the attachment is to *that* object, and an identical backup gets rejected as an impostor. Our household runs a variation. The attachment is to the role: any qualified lovey will do, but only a qualified one, and the qualifications are invisible to adults. Either way it's a strong position on identity, and children arrive at it without reading any philosophy.

[^3]: **Names are not things.** Gottlob Frege's 1892 paper "On Sense and Reference" used the Morning Star and the Evening Star: two names, two ways of presenting something, one planet. Ogden and Richards' *The Meaning of Meaning* (1923) drew it as a triangle of symbol (the word), thought (the concept), and referent (the thing), with no direct line between the word and the thing.

    A related distinction: philosophers separate numerical identity (being one and the same thing) from qualitative identity (being exactly alike). Two loveys of the same model are qualitatively identical, at least to adults, and numerically distinct. The kid tracks numerical identity without effort, then sets it aside when filling a role. That's roughly what a good data model does too: keep the individuals distinct, and state separately what they're interchangeable for.

    In data modeling the practical version is: give each thing its own identity, and attach names to it as properties. RDF has a property for this, rdfs:label. The SKOS vocabulary adds prefLabel (the main name), altLabel (other names), and hiddenLabel (misspellings you still want search to find). A muppy can carry all three without any confusion about which muppy it is.

[^4]: **Concepts versus classes.** There are two common ways to model a "kind of thing" in RDF, and they behave differently. SKOS (Simple Knowledge Organization System) treats "sloth" and "muppy" as concepts in a vocabulary, connected by broader and narrower links. This is how thesauri and library subject headings work. It's forgiving: saying muppy is narrower than sloth tells a search tool to look in both places, and not much more.

    OWL (the Web Ontology Language) treats them as classes with logical membership. Saying every muppy is a sloth lets a reasoner conclude Messy Muppy is a sloth without being told. Here that axiom is safe, because being a sloth is the one firm rule. What a reasoner can't do is the rest of the test. It can check that something is a sloth. It can't check that it is cute enough or prominent enough, because those aren't properties of the sloth. They're decisions by the authority. So the graph states the rule once and records each admission as a fact. See the [SKOS Reference](https://www.w3.org/TR/skos-reference/) and the [OWL 2 Primer](https://www.w3.org/TR/owl2-primer/).

[^5]: **Necessary, not sufficient.** Classical definitions say a thing belongs to a category if it meets a list of necessary and sufficient conditions. Eleanor Rosch's research in the 1970s showed that people mostly don't categorize that way. We judge membership by resemblance to a prototype: a robin is a more birdlike bird than a penguin, though both are birds.

    The muppy test is a hybrid. Being a sloth is necessary in the classical sense: no sloth, no muppy. It isn't sufficient. "Cute enough" and "prominent enough" are graded judgments against a standard that lives in one person's head. Plenty of real registries work the same way: an eligibility rule a machine can check, then an admission decision a person makes. The graph can hold the rule and the decisions. It can't hold the judge.

[^6]: **The open world.** Knowledge graphs built on OWL make two assumptions that surprise people coming from relational databases. The open world assumption says a fact missing from the graph is unknown, not false. The graph doesn't know whether Messy New is a muppy, and won't conclude that it isn't.

    The second is that there's no unique name assumption: two different identifiers might refer to the same thing unless someone says otherwise. To capture what the kid knows, you have to state it, with owl:differentFrom. The opposite statement, owl:sameAs, is famously overused on the web. Halpin and colleagues' 2010 paper "When owl:sameAs isn't the same" is a thorough, slightly exasperated tour of what goes wrong.

[^7]: **Identifiers that mean nothing.** Tim Berners-Lee's 1998 note [Cool URIs don't change](https://www.w3.org/Provider/Style/URI) argues that a web address should stay valid indefinitely, and that the way to achieve this is to leave anything changeable out of it: names, departments, file formats, topics.

    Geographic names illustrate why. The U.S. has a federal Board on Geographic Names to standardize them, and they still change. A system that uses the name as its key breaks when that happens. A system that uses an opaque identifier and stores the name as a label just updates the label. [Geoconnex](https://geoconnex.us) does this for U.S. water features. The household equivalent would be issuing each lovey a serial number, which I suspect would not be well received.

[^8]: **Roles and the things that fill them.** Data models that hold up over time usually separate a role from whatever currently fills it. The W3C [Organization Ontology](https://www.w3.org/TR/vocab-org/) distinguishes a Post (treasurer, say) from the person who holds it. The W3C [sensor ontology, SOSA/SSN](https://www.w3.org/TR/vocab-ssn/), distinguishes a platform from the sensors it hosts. Monitoring networks do the same thing in practice: the site identifier persists, the hardware rotates.

    The older version of the question is the ship of Theseus, preserved in Athens with its rotting planks replaced one by one: is it the same ship? Libraries answer it with FRBR (IFLA, 1998), which separates a work, an expression, a manifestation (a published edition), and an item (the copy on your shelf). Each lovey is an item. The roles sit above the items, and chewing can move an item from one role to another, which is more than Plutarch had to deal with.

[^9]: **When a name becomes a category.** Trademark lawyers call it genericide: a brand becomes so common that it turns into the ordinary word for the product, and the owner loses exclusive rights. Aspirin, escalator, and thermos all went this way in the U.S. Linguists see the same drift without the lawsuits, as proper names becoming common nouns.

    In a knowledge graph you'd model the lineage explicitly. Messy New gets a relationship back to Messy Muppy (something like "named after") rather than a name you have to parse to understand. Parsing meaning out of names is one of the oldest bad habits in data management. The kid has, to be fair, made it look elegant.

[^10]: **What the graph looks like.** Here is the registry as RDF, in the Turtle syntax, plus the bedtime rule written as a [SHACL](https://www.w3.org/TR/shacl/) shape, the W3C standard for checking that data meets constraints. The namespace is a placeholder. The individual loveys get opaque identifiers, the roles get nodes of their own, and each lovey points at the role it currently fills. A bedtime with no Flat Muppy fails validation, which matches the observed behavior of the user.

    ```turtle
    @prefix h:    <https://example.org/household/> .
    @prefix skos: <http://www.w3.org/2004/02/skos/core#> .
    @prefix owl:  <http://www.w3.org/2002/07/owl#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix sh:   <http://www.w3.org/ns/shacl#> .

    h:sloth a skos:Concept ; skos:prefLabel "sloth" .
    h:muppy a skos:Concept ; skos:prefLabel "muppy" ;
        skos:broader h:sloth .

    # Roles
    h:role-messy a h:Role ; rdfs:label "Messy Muppy" ;
        h:criterion "nose all messed up" .
    h:role-flat a h:Role ; rdfs:label "Flat Muppy" ;
        h:criterion "nose chewed flat" .

    # The loveys: same model, identical to adults
    h:lovey-01 h:kind h:muppy ; h:fills h:role-messy .
    h:lovey-02 h:kind h:muppy ; h:fills h:role-messy .
    h:lovey-03 h:kind h:muppy ; h:fills h:role-messy .
    h:lovey-04 h:kind h:muppy ; h:fills h:role-messy .
    h:lovey-05 h:kind h:muppy ; h:fills h:role-flat .
    h:lovey-01 owl:differentFrom h:lovey-02, h:lovey-03, h:lovey-04, h:lovey-05 .

    h:big-muppy rdfs:label "Big Muppy" ; h:kind h:muppy .

    # Messy New: a line of prints, each known by its color
    h:messy-new a skos:Concept ; skos:prefLabel "Messy New" ;
        skos:broader h:sloth ; h:namedAfter h:role-messy .
    h:messy-new-04 h:kind h:messy-new ; rdfs:label "olive Messy New" .
    h:messy-new-07 h:kind h:messy-new ; rdfs:label "pink Messy New" .
    # ...and five more

    # Bedtime needs at least one of each role
    h:BedtimeShape a sh:NodeShape ;
        sh:targetClass h:Bedtime ;
        sh:property [
            sh:path h:hasLovey ;
            sh:qualifiedValueShape [ sh:path h:fills ; sh:hasValue h:role-messy ] ;
            sh:qualifiedMinCount 1 ] ;
        sh:property [
            sh:path h:hasLovey ;
            sh:qualifiedValueShape [ sh:path h:fills ; sh:hasValue h:role-flat ] ;
            sh:qualifiedMinCount 1 ] .
    ```

[^11]: **Composite names.** Relational databases call this a composite key: no single column identifies a row, but two together do. It's common and it's fine, as long as the combination stays unique and nobody has to parse it back apart. In the graph each print gets an identifier that means nothing (`messy-new-07`), and "pink Messy New" is only its label. A second pink print would be `messy-new-08` with a naming problem, not a collision.
