---
title: "Mon ami PROV-O"
published: 2026-11-23
summary: "A US birth certificate gets transcribed into a French one, not translated. The songs in our house get translated, adapted, covered, folk-processed and quoted. Eight ways to be a copy of something, and why a graph needs a different link for each."
draft: false

# Referenced only in relations, or in passing in the prose, so listed here.
mentions:
  [roud-129, roud-4959, scenes-de-la-vie-de-boheme, luigi-illica, giuseppe-giacosa, au-clair-grandpa,
   first-sounds-playback, birth-record-format-2021]

observations:
  - id: observation-12
    text: "Grandpa's first lullaby for the older kid was Au clair de la lune."
    observedBy: dad
    about: [grandpa, au-clair-de-la-lune, the-authority]
  - id: observation-13
    text: "Read all the way through, Au clair de la lune turns out to be about something other than a pen."
    observedBy: dad
    about: [au-clair-de-la-lune]
  - id: observation-14
    text: "A US birth certificate becomes a French one by transcription: the facts are copied into the French registry's format, in French, under a new number. Translation is a separate step, by a sworn translator, and only some procedures require it first."
    observedBy: dad
    about: [us-birth-certificate, french-birth-record, baby]
  - id: observation-15
    text: "We sing Frère Jacques sometimes. When the in-laws sing that tune, they sing Brother John."
    observedBy: dad
    about: [frere-jacques, brother-john, the-in-laws]
  - id: observation-18
    text: "All three tree songs get sung at our house: The Rattlin' Bog, The Green Grass Grew All Around and L'arbre est dans ses feuilles."
    observedBy: dad
    about: [rattlin-bog, green-grass-grew-all-around, larbre-est-dans-ses-feuilles]
  - id: observation-19
    text: "The number and order of the things in the tree vary between the songs."
    observedBy: dad
    about: [rattlin-bog, green-grass-grew-all-around, roud-129]
  - id: observation-20
    text: "L'arbre est dans ses feuilles nests the same way, in French: the branch is in the tree, the knot is in the branch, the hole is in the knot."
    observedBy: dad
    about: [larbre-est-dans-ses-feuilles, roud-129]
  - id: observation-21
    text: "500 Miles is on the car's playlist, in the version from Inside Llewyn Davis."
    observedBy: dad
    about: [five-hundred-miles, five-hundred-miles-llewyn-davis]
  - id: observation-23
    text: "Set side by side, Les Champs-Élysées keeps Waterloo Road's scenes in the same order and changes the story: a night out with strangers becomes a romance."
    observedBy: dad
    about: [les-champs-elysees, waterloo-road]
  - id: observation-24
    text: "Dassin's English version of Les Champs-Élysées keeps Waterloo Road's plot and most of its words, renames the street, and swaps the cellar and the guitar for a café and an accordion."
    observedBy: dad
    about: [champs-elysees-english, waterloo-road, les-champs-elysees]

claims:
  - id: claim-eight-copies
    label: "\"The same song\" covers at least eight different relationships, and a graph needs a different link for each"
    short: "eight ways to be a copy"
    about: [au-clair-de-la-lune, french-birth-record, brother-john, les-champs-elysees, roud-129, i-was-young-when-i-left-home]
    attributedTo: dad
  - id: claim-birth-records-same
    label: "The French birth record and the US birth certificate are the same thing"
    short: "the same thing?"
    subject: french-birth-record
    predicate: sameAs
    object: us-birth-certificate
    attributedTo: dad
  - id: claim-brother-john-faithful
    label: "Brother John is a faithful translation of Frère Jacques"
    short: "a faithful translation?"
    about: [brother-john, frere-jacques]
    attributedTo: dad
  - id: claim-champs-translation
    label: "Les Champs-Élysées is a translation of Waterloo Road"
    short: "a translation?"
    subject: les-champs-elysees
    predicate: translationOf
    object: waterloo-road
    attributedTo: dad
  - id: claim-english-version-translation
    label: "Dassin's English version of Les Champs-Élysées is a translation of Les Champs-Élysées"
    short: "a translation?"
    subject: champs-elysees-english
    predicate: translationOf
    object: les-champs-elysees
    attributedTo: dad
  - id: claim-boheme-au-clair
    label: "La Bohème's candle scene is an adaptation of Au clair de la lune"
    short: "an adaptation?"
    subject: la-boheme
    predicate: adaptationOf
    object: au-clair-de-la-lune
    attributedTo: dad
  - id: claim-roud-129-coirault
    label: "Roud 129 has a close match in Coirault's catalogue of French songs"
    short: "a match in Coirault?"
    about: [roud-129, coirault-repertoire, larbre-est-dans-ses-feuilles]
    attributedTo: dad
  - id: claim-arbre-roud-129
    label: "L'arbre est dans ses feuilles belongs to the Roud 129 family"
    short: "in the family?"
    subject: larbre-est-dans-ses-feuilles
    predicate: isA
    object: roud-129
    attributedTo: dad

assessments:
  - id: assessment-13
    claim: claim-roud-129-coirault
    by: dad
    stance: questions
    note: "If L'arbre est dans ses feuilles is in Coirault, its number is the match. Nobody has published the crosswalk, and I haven't looked it up yet."
  - id: assessment-06
    claim: claim-eight-copies
    by: dad
    stance: endorses
    evidence: [observation-13, observation-14, observation-15, observation-19, observation-23]
    note: "The thesis of the post. Every example in it needed a different link."
  - id: assessment-07
    claim: claim-birth-records-same
    by: dad
    stance: disputes
    evidence: [observation-14]
    note: "Two documents, two registries, two numbers. One baby."
  - id: assessment-08
    claim: claim-brother-john-faithful
    by: dad
    stance: disputes
    evidence: [observation-15]
    note: "Same words, near enough, and a different plot. In French, Jacques is the one who's supposed to ring the bells."
  - id: assessment-09
    claim: claim-champs-translation
    by: dad
    stance: qualifies
    evidence: [observation-23]
    note: "Same scenes in the same order, a different story. The record files it as an adaptation, which is the safer link."
  - id: assessment-12
    claim: claim-english-version-translation
    by: dad
    stance: disputes
    evidence: [observation-24]
    note: "It's Waterloo Road with the street renamed and an accordion added. The label says otherwise."
  - id: assessment-10
    claim: claim-boheme-au-clair
    by: dad
    stance: questions
    note: "A dead candle, a knock on a neighbor's door, a search in the dark, moonlight. Suggestive. Not evidence."
  - id: assessment-11
    claim: claim-arbre-roud-129
    by: dad
    stance: qualifies
    evidence: [observation-19, observation-20]
    note: "In the family by any test you could run on the lyrics. Not by Roud's rules, which only cover songs in English."
---

<!-- Draft. Things to check before publishing are in comments like this one. -->

I just (as of November 2026) welcomed my youngest child into the world. As such, this post is about provenance and descent.

Provenance is where a thing has been, descent is what it came from, and both are ways of answering "whose is this?" In intellectual property, the answer decides who gets paid. In knowledge management, it decides what you can trust. At bedtime it's the eventual answer to the repetitive and relentless toddler question: "why?". Trace almost anything back far enough and it's related to almost everything else.

The first lullaby [my dad](thing:grandpa) [sang to](obs:observation-12) [our older kid](thing:the-authority) was "[Au clair de la lune](https://www.youtube.com/watch?v=H4i19hx8OB0)," an 18th century song of unknown authorship. The first verse goes like this.

> Au clair de la lune, mon ami Pierrot,\
> Prête-moi ta plume pour écrire un mot.\
> Ma chandelle est morte, je n'ai plus de feu.\
> Ouvre-moi ta porte pour l'amour de Dieu.

By the light of the moon, someone asks his friend Pierrot to lend him a pen so he can write a note. His candle has gone out and he has no fire. Open the door, for the love of God.

In the following verses, Pierrot says he's in bed, and suggests to ask the neighbor because someone in her kitchen is striking a light. Then a man called Lubin knocks on a brunette's door, "for the God of Love." In the last verse, in the dark, they look for the pen and they look for the fire, and the narrator doesn't know what they found, but he knows the door closed behind them. [I guess the lullaby turns out to be about something other than a pen.](obs:observation-13) This is on brand for French children's material.

I hypothesize that it's also "[Light My Candle](https://www.youtube.com/watch?v=GnYoYcLGn9w)," from [*Rent*](thing:rent), which [Jonathan Larson](thing:jonathan-larson) took nearly beat for beat from [the first act](https://www.youtube.com/watch?v=ni6tQcnAD0Q) of [Puccini](thing:giacomo-puccini)'s [*La Bohème*](thing:la-boheme), set in a Paris garret in 1837.[^1] Nobody has shown that Puccini got the scene from an older French nursery song, so I just record [my own claim for future validation that the opera/Broadway musical candle scene is an adaptation of "Au clair de la lune."](claim:claim-boheme-au-clair)

"[Au clair de la lune](thing:au-clair-de-la-lune)" has a second claim to fame. In 1860, the Parisian inventor [Édouard-Léon Scott de Martinville](thing:scott-de-martinville) recorded about ten seconds of it with a device of his own, the phonautograph, which traced sound waves onto paper blackened with lamp soot.[^2] He wanted to *see* sound. Then in 2008, audio historians scanned the paper and [played the trace back](thing:first-sounds-playback), and the result is [the oldest known recording of a human voice](thing:phonautogram-1860). You can [hear it at First Sounds](https://www.firstsounds.org/sounds/scott.php), the group that restored it.

## Eight ways to be a copy

A lullaby, an opera scene, a Broadway duet, and a soot-blackened trace on paper are all, in some loose sense, "the same thing" just as newborns are remixes of their parents.

"The same" covers a lot of different relationships though. Here is a non-exhaustive registry, from most faithful to least.[^3]

| Kind of copy | What survives | What changes |
| --- | --- | --- |
| Serialization | Everything | The syntax |
| Transliteration | Every letter, mapped one to one | The writing system |
| Transcription | The statements | The format, medium or register |
| Translation | The meaning (as far as practicable) | The language (and the meaning, as far as is unavoidable under other chosen constraints like meter or rhyme or register) |
| Adaptation | Enough of the source to recognize it: a tune, a plot, characters or scenes | Whatever the new context calls for, by the adapter's choice: the words, setting, medium, audience, even the story |
| Cover | The song | The performer |
| Variant | A family resemblance | Nearly anything, with no single author |
| Quotation | A few lines | Everything else |

Each row down keeps less of the source and adds more of someone else. Link them all with one relationship, "same as" or "version of," and you lose exactly what I'd want later, namely whether one can stand in for the other, and who is responsible for the difference.

The top row is the only one where nothing is lost. [The data page](page:data) has this blog's graph as Turtle, JSON-LD and N-Quads, three different files that read back as exactly the same graph.

Which brings us to the title. The friend you ask when you need to know where something came from isn't Pierrot, it's PROV-O, the W3C's provenance ontology and the standard way to say it in RDF. Its central link is *was derived from*: this was made out of that. But of the eight kinds of copy in the table, it only has names for a couple. It has three narrower kinds of derivation, *was quoted from*, *was revision of* and *had primary source*. A quotation was quoted from, a transcription had a primary source, and everything else, translation, adaptation and the rest, is just derived.

PROV's real answer to "what kind of copy?" is to stop sorting the links and describe the work instead. A qualified derivation can say which activity did the deriving, who was responsible for it, and how the source was used. In PROV's terms, most of the table is a list of activities: transcribing, translating, adapting, covering. Here's the phonautogram from earlier: Scott de Martinville recording "Au clair de la lune" in 1860, and [First Sounds](thing:first-sounds) playing his trace back in 2008, with ex: standing in for this blog's own identifiers:

```turtle
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix ex:   <https://example.org/> .

ex:phonautogram-1860 prov:wasDerivedFrom ex:au-clair-de-la-lune ;
    prov:qualifiedDerivation [
        a prov:Derivation ;
        prov:entity ex:au-clair-de-la-lune ;
        prov:hadActivity ex:recording-1860
    ] .

ex:recording-1860 a prov:Activity ;
    prov:wasAssociatedWith ex:scott-de-martinville ;
    prov:used ex:phonautograph .

ex:first-sounds-playback prov:wasDerivedFrom ex:phonautogram-1860 ;
    prov:wasGeneratedBy ex:playback-2008 .

ex:playback-2008 a prov:Activity ;
    prov:wasAssociatedWith ex:first-sounds .
```

That's the other thing I said I'd want later: who is responsible for the difference. Two more PROV terms fit this post. *Was influenced by*, a step weaker than derivation, is the honest weight for my *La Bohème* hunch. And *alternate of*, which isn't a derivation at all, links things that present aspects of the same thing. The spec's own example is a document serialized in different formats, which is the top row of the table. Other vocabularies, from library catalogues to search engines, slice copying up differently, and the notes map this blog's links onto them.[^4]

Below let's explore some of these concepts in our household.

## Transcribed, not translated

New kid, so: birth certificates. Our kids are French through me, and as far as the French state is concerned, an American birth certificate is a foreign document until it has been transcribed. What's a transcription? It's a type of ETL process that converts some information with a high degree of exactitude from one format into another.[^5] Spoken word to written text, DNA to RNA, music performance to sheet music, handwriting to digital text, etc.

So what does my kid's American birth certificate, with its little tables and raised seals and county registrar signature, need to be transcribed into? For that, back to "Au clair de la lune" for a second. The song is usually dated to about 1790,[^6] which makes it roughly the same age as the system in question.

Before the Revolution, a French birth was recorded by the local Catholic parish, as a baptism. Then on 20 September 1792, the Legislative Assembly of the French First Republic moved the registers from the parish to the town hall, creating the *état civil*, a secular record for every citizen, whatever their religion. In 1803 the new Civil Code spelled out what a birth record had to say and gave French birth records their house style for the next two centuries: one long sentence, every date spelled out, the same clauses in the same order. Here's [the format](thing:birth-record-format-1803).

> L'an [année en lettres], le [jour] jour du mois de [mois], à [heure] heures du [matin ou soir], par-devant nous, [nom], maire, officier de l'état civil de la commune de [commune], canton de [canton], département de [département], est comparu [prénoms et nom du père], âgé de [âge] ans, [profession], domicilié [domicile], lequel nous a présenté un enfant du sexe [masculin ou féminin], né [date] à [heure] heures du [matin ou soir], de lui déclarant, [lieu de la naissance], et de [prénoms et nom de la mère], âgée de [âge] ans, [profession], domiciliée [domicile], son épouse, et auquel il a déclaré vouloir donner les prénoms de [prénoms]; lesdites déclaration et présentation faites en présence de [premier témoin], âgé de [âge] ans, [profession], et de [second témoin], âgé de [âge] ans, [profession], tous deux domiciliés [domicile], et ont, le père et les témoins, signé avec nous le présent acte de naissance, après qu'il leur en a été fait lecture.

In English, roughly: in [year], on [day], before us, [the mayor], appeared [the father], who presented to us a child of the [sex] sex, born [when and where] to him and to [the mother], his wife, and to whom he wished to give the names [names], in the presence of [two witnesses], who all signed with us after it was read to them.

Every bracket is a field, and the sentence around the brackets never changes. It's a schema written as prose.

Transcription means a French civil registrar takes a birth record drawn up by a foreign authority and enters it in the French registers. The facts on [the US birth certificate](thing:us-birth-certificate) (who, when, where, whose) are written into [a French birth record](thing:french-birth-record), in French, in the form of that long-ass run-on sentence, under a new number in a different registry.

[Notice that it's not strictly necessary to *translate* the American certificate into French. The registrar *transcribes* it. Translation is a separate step, done by a sworn translator and producing a separate document that preserves the overall format of the original document, and only some procedures require it first.](obs:observation-14) The consulate in Washington, for example, takes documents in English as they are. It's a data entry job, not a translation job.

So the household now has two documents about one birth, an original and a transcription. Neither is a translation of the other, and they're not [the same (as in owl:sameAs) thing](claim:claim-birth-records-same). What's the same is the baby.[^7]

This is more or less the same idea behind Geoconnex, the system behind the Internet of Water, which gives a river one persistent identifier, and every agency's data about that river points to that identifier instead of claiming to be the authoritative representation of it.[^8] Lots of records, one river. Two certificates, one baby.

## When does Translation become Adaptation?

We sing "[Frère Jacques](https://www.youtube.com/watch?v=0Raj4EOBL0Q)" [sometimes](obs:observation-15). When [the in-laws](thing:the-in-laws) sing that tune, they sing "[Brother John](https://www.youtube.com/watch?v=LkfUBy50Vkk)."

"[Brother John](thing:brother-john)" is the textbook English version, but it has an interesting semantic change. In "[Frère Jacques](thing:frere-jacques)," someone asks the friar whether he's asleep and tells him to ring the bells for *matins*, the early-morning prayers. He's the bell-ringer, and he's overslept. In English, "morning bells are ringing." The bells are already going, and Brother John is merely late.[^9] The plot has changed! So is ["Brother John" a faithful translation of "Frère Jacques,"](claim:claim-brother-john-faithful) or an adaptation imbued with new meaning?

In another example, let's explore some related songs about streets. The most famous French song about [the most famous avenue in Paris](thing:avenue-des-champs-elysees) started out as "[Waterloo Road](https://www.youtube.com/watch?v=6a2ePTpPCT0)," a 1968 single about [a street in London](thing:waterloo-road-london) by British band Jason Crest. It is quite obscure (~243k Spotify listens). The next year, the lyricist [Pierre Delanoë](thing:pierre-delanoe) wrote French words for the same tune and [Joe Dassin](thing:joe-dassin) sang it to a slightly different instrumental track, and "[Les Champs-Élysées](https://www.youtube.com/watch?v=pvgjEdnTgXA)" became the globally recognized anthem of Paris (158 million Spotify listens).[^10]

[Set the two side by side and they share almost every scene, in the same order: a chance meeting on a street, a night in a basement full of guitars, birds at dawn, and a chorus promising that the street has whatever you're after. What Delanoë changed is the story. In London, she picks him up and takes him to meet her friends, and in the morning he walks home alone, humming. In Paris, he does the talking, and by dawn two strangers are in love.](obs:observation-23) Ah Paris.

So is it [a translation of "Waterloo Road"](claim:claim-champs-translation)? Of the scenes, nearly beat for beat. Of the emotional valence of the story, no. The graph files "[Les Champs-Élysées](thing:les-champs-elysees)" as an adaptation of "[Waterloo Road](thing:waterloo-road)," the weaker link. "Brother John" was trying to say the same thing as "Frère Jacques" and didn't quite manage it because preserving both meter and meaning across languages is hard. Delanoë was deliberately trying to say something different from Jason Crest. That's roughly the difference between a translation and an adaptation I suppose.

But wait! A bamboozling ensues. In 1969 Dassin made [another recording](thing:champs-elysees-english) of "Les Champs-Élysées," released as the "[version anglaise](https://www.youtube.com/watch?v=ghAbyLc71WI)." It isn't a translation of Delanoë's French. [It's more like a Paris localization of "Waterloo Road," with nearly word for word replication except that the street is renamed, and the details in one verse get a Paris costume. The cellar becomes a small café, and the scruffy English basement guitarist becomes a Frenchman playing waltzes on an accordion in the street.](obs:observation-24) So the "English version" of the French free adaptation of an English song is mostly just the original English song, with a beret. The graph files this version as an adaptation of "Waterloo Road" rather than of "Les Champs-Élysées" and records the record label's implied claim, that it's [a translation of "Les Champs-Élysées,"](claim:claim-english-version-translation) as one I dispute.

MusicBrainz, the open music database, has exactly this problem.[^11] One of its editors, entering a song with similar provenance issues, wrote in the forums that the only link on offer was "translated version of," and that it wasn't true.

## No original

Some collections of songs don't really have originals and derivatives that can be confidently identified. [All three of these tree songs get sung at our house](obs:observation-18): "[The Rattlin' Bog](https://www.youtube.com/watch?v=aLHuu3Ygvns)," "[The Green Grass Grew All Around](https://www.youtube.com/watch?v=cSpa1QUQ-Ec)" and "[L'arbre est dans ses feuilles](https://www.youtube.com/watch?v=dQTvy5aqiv8)." All three of these are accumulative songs about a tree somewhere where each verse adds a thing that is transitively in/on the previous thing (eg a limb on the tree, a branch on the limb, a nest on the branch, an egg in the nest, a bird in the egg) and then recites the whole chain back down to wherever the tree is.[^12] [The exact number and order of the items varies between the songs but they are clearly the same idea.](obs:observation-19) Nobody wrote them, and nobody's version is the original one.

Folklorists have a tool for this kind of thing. [The Roud Folk Song Index](thing:roud-index) has about 250,000 references to some 25,000 songs transcribed from oral traditions, and it groups closely related songs under one number.[^13] "The Rattlin' Bog" is [Roud 129](https://www.vwml.org/roudnumber/129), along with "The Tree on the Hill," "The Everlasting Circle," "Down in the Lowlands" and "The Green Grass Grew All Around." A Roud number doesn't identify a text, then. It identifies a family or lineage. You know, like [the Messy lineage](thing:messy-muppy) from [the Muppy post](post:not-all-sloths-are-muppies).

"[The Rattlin' Bog](thing:rattlin-bog)" is a jaunt that became a whiskey-infused standard of Celtic bands with fiddles like the Irish Rovers. "[The Green Grass Grew All Around](thing:green-grass-grew-all-around)" is the down-home Appalachian old tyme track popularized by Pete Seeger on his banjo and recorded by many children's music outfits armed with campfire guitars.

"[L'arbre est dans ses feuilles](thing:larbre-est-dans-ses-feuilles)," *maluron, maluré*, is the zesty Cajun version, best known from the Louisiana singer Zachary Richard's performances backed by New Orleans jazz bands. [It nests the same way, in French: the branch is in the tree, the knot is in the branch, the hole is in the knot, and eventually there's a nest, an egg, a bird, a heart in the bird and love in the heart.](obs:observation-20) It's sweeter than the English language ones, but no less likely to be shouted by drunkards and elementary school children.

However, here the identifier system breaks down. Roud only covers songs in English, so "L'arbre est dans ses feuilles" has no Roud number. French-language songs have catalogues of their own, [Patrice Coirault's](thing:coirault-repertoire) for France and [Conrad Laforte's](thing:laforte-catalogue) for Quebec.[^14] So does ["L'arbre est dans ses feuilles" belong to the Roud 129 family](claim:claim-arbre-roud-129)? By any test you could run on the lyrics, yes. By Roud's rules, no. That's multiple identifier systems describing one family, with [no published link between them](claim:claim-roud-129-coirault) that I know of.

## 500 miles from home: The free and open source folk process

"[500 Miles](https://www.youtube.com/watch?v=HAZJAzCshN4)" [is on the car's playlist](obs:observation-21), in particular the version from the Coen brothers' [*Inside Llewyn Davis*](thing:inside-llewyn-davis). In the movie, Jim, Jean and Troy (Justin Timberlake, Carey Mulligan and Stark Sands) sing [it](thing:five-hundred-miles-llewyn-davis) at [the Gaslight Café](thing:gaslight-cafe) in 1961, sounding a lot like a young Peter, Paul and Mary.

The parent is "[900 Miles](https://www.youtube.com/watch?v=--F8EtTJYsQ)," a traditional American song from the early 1900s or before, about a traveller far from home and too broke to go back. Nine hundred is the most common distance, but versions run from 400 to 10,000 miles, all under [Roud number 4959](https://www.vwml.org/roudnumber/4959). In 1961, [Hedy West](thing:hedy-west) rewrote it as "[500 Miles](https://www.youtube.com/watch?v=1x42dzwULzQ)," with a new tune and adding new verses to several of the old ones. That's an adaptation. Then came the covers, [Peter, Paul and Mary's](https://www.youtube.com/watch?v=fWhktSucgsU) among them, which are new performances of her song, not independent instances of [Roud 4959](https://www.vwml.org/roudnumber/4959).

The same year, a 20-year-old [Bob Dylan](thing:bob-dylan) recorded "[I Was Young When I Left Home](https://www.youtube.com/watch?v=b9QEBddYLo4)" on a home tape in Minnesota. It's his own song, built on the supposed original, "[900 Miles](thing:nine-hundred-miles)," although with two couplets lifted from West's "[500 Miles](thing:five-hundred-miles)."[^15]

In the graph, that's three links of three different kinds. [Dylan's song](thing:i-was-young-when-i-left-home) *quotes from* "500 Miles," which *is an adaptation of* "900 Miles," which *is one of* the songs under [Roud 4959](https://www.vwml.org/roudnumber/4959). Flatten all of that to "version of" and you can't tell Dylan from Peter, Paul and Mary anymore, which nobody should ever be unable to do.

Dylan's own summary, from a speech in 2015: "All these songs are connected. Don't be fooled."

## Where it all goes

This blog's graph already keeps two kinds of statement apart. *Relations* are plain facts, like the transcription, the translation, the adaptation and the quotation. *Claims* are arguable, so they go in with my name and my current position on them, and if anyone changes their mind, the record shows when. Everything this post argued about is a claim.

::graph::

## Next in the lineage

The newborn now gets ["Au clair de la lune" corrupted by my tired forgetfulness](thing:au-clair-dad). Whatever version reaches the baby will be one more node in a provenance graph. Every family has one of these. Most don't have a SPARQL endpoint.

Attribution has its practical uses. It tells a songwriter what they're owed, and it tells an analyst which numbers to trust. But follow the links far enough and almost everything is related. A revolutionary birth registry, a British flop, an Irish pub chorus, a Coen brothers movie and a grandfather singing in a dark bedroom turn out to be one big story, and the baby is the newest part of it, or at least of my particular materialized view.

## The playlist

In lineage order, official uploads where they exist.

- "Au clair de la lune," sung by Scott de Martinville into his phonautograph, 1860. [First Sounds](https://www.firstsounds.org/sounds/scott.php)
- "Au clair de la lune," Yvonne Printemps, 1931. [YouTube](https://www.youtube.com/watch?v=H4i19hx8OB0)
- *La Bohème*, Act 1: "Sì. Mi chiamano Mimì," Mirella Freni and Nicolai Gedda, conducted by Thomas Schippers. [YouTube](https://www.youtube.com/watch?v=ni6tQcnAD0Q)
- "Light My Candle," Daphne Rubin-Vega and Adam Pascal, *Rent* original Broadway cast, 1996. [YouTube](https://www.youtube.com/watch?v=GnYoYcLGn9w)
- "Frère Jacques," Monde des Titounis. [YouTube](https://www.youtube.com/watch?v=0Raj4EOBL0Q)
- "Are You Sleeping (Brother John)?" CoComelon. [YouTube](https://www.youtube.com/watch?v=LkfUBy50Vkk)
- "Waterloo Road," Jason Crest, 1968. [YouTube](https://www.youtube.com/watch?v=6a2ePTpPCT0) (a fan upload; there doesn't seem to be an official one)
- "Les Champs-Élysées," Joe Dassin, 1969. [YouTube](https://www.youtube.com/watch?v=pvgjEdnTgXA)
- "Les Champs-Élysées (version anglaise)," Joe Dassin, 1969. [YouTube](https://www.youtube.com/watch?v=ghAbyLc71WI)
- "The Rattlin' Bog," the Irish Rovers. [YouTube](https://www.youtube.com/watch?v=aLHuu3Ygvns)
- "Green Grass Grows All Around," Pete Seeger. [YouTube](https://www.youtube.com/watch?v=cSpa1QUQ-Ec)
- "L'arbre est dans ses feuilles," Zachary Richard. [YouTube](https://www.youtube.com/watch?v=dQTvy5aqiv8)
- "900 Miles," Cisco Houston. [YouTube](https://www.youtube.com/watch?v=--F8EtTJYsQ)
- "500 Miles," Hedy West. [YouTube](https://www.youtube.com/watch?v=1x42dzwULzQ)
- "500 Miles," Peter, Paul and Mary, 1962. [YouTube](https://www.youtube.com/watch?v=fWhktSucgsU)
- "Five Hundred Miles," Justin Timberlake, Carey Mulligan and Stark Sands, from *Inside Llewyn Davis*, 2013. [YouTube](https://www.youtube.com/watch?v=HAZJAzCshN4) (a fan upload of the soundtrack; this is the one in our car)
- "I Was Young When I Left Home," Bob Dylan, Minneapolis, December 22, 1961. [YouTube](https://www.youtube.com/watch?v=b9QEBddYLo4)

[^1]: **Candles, 1837 to 1996.** *La Bohème* premiered in Turin on February 1, 1896, with a libretto by Luigi Illica and Giuseppe Giacosa based on Henri Murger's *Scènes de la vie de bohème*. *Rent* opened off-Broadway 100 years to the day later, with the story moved from the Latin Quarter to New York's East Village. Larson told the *New York Times* he broke the libretto down beat by beat. In Puccini, Mimì drops her key. In Larson, she drops her stash. By this post's own scheme, *Rent* is an adaptation of *La Bohème*, which is an adaptation of Murger, and "Au clair de la lune" is a suspicious coincidence. Portland Center Stage has a good [rundown of what Larson borrowed](https://www.pcs.org/features/la-bohéme-to-rent-legacies), and so does [Opera Colorado](https://www.operacolorado.org/blog/where-opera-and-musical-theatre-collide-la-boheme-and-rent/).

[^2]: **The phonautogram.** Scott patented the phonautograph in 1857. It was meant for studying sound as an image, and he never intended for anyone to play it back. The 1860 trace was found in the archives of the French Academy of Sciences and first played in public in 2008 by the audio historians David Giovannoni and Patrick Feaster with colleagues from the group First Sounds, who scanned the paper at high resolution and, with help from Lawrence Berkeley National Laboratory, played the trace back with a "virtual stylus." It predates Edison's phonograph by 17 years. First Sounds tells the story of the [corrected lyrics](https://www.firstsounds.org/sounds/scott.php): the early playback heard "Au clair de la lune, Pierrot répondit," and the 2010 one found Scott had let the cylinder slow down, possibly to a stop, partway through. Coverage at the time is a good read: [NBC News](https://www.nbcnews.com/id/wbna23835160) and [InformationWeek](https://www.informationweek.com/software-services/oldest-voice-recording-a-french-folksong). For the device itself, see [Wikipedia on the phonautograph](https://en.wikipedia.org/wiki/Phonautograph).

[^3]: **Transcription, three ways.** The words in that table don't mean the same thing in every field, which is itself a vocabulary-alignment problem. In linguistics, *transliteration* maps one writing system onto another letter by letter, and *transcription* writes down how something sounds. In archives and civil registries, *transcription* means copying a record into another register. In music, it means writing a performance down as notation. *Serialization* is the data person's word for writing a structure (a graph, a tree, an object in memory) out as a flat sequence of characters so it can be stored or sent, and *parsing* is reading it back. The test of a serialization is the round trip: write it out, read it back, and you should have exactly what you started with.

[^4]: **None of this is new.** Library science has spent decades on it. The standard model, [FRBR](https://en.wikipedia.org/wiki/Functional_Requirements_for_Bibliographic_Records) (now folded into the IFLA Library Reference Model), separates a *work* (the song as an idea), an *expression* of it (these lyrics, this translation, this performance), a *manifestation* (the 1969 CBS single) and an *item* (the copy in your parents' basement). On that model, a translation is a new expression of the same work, and an adaptation usually counts as a new work, which is precisely where the arguments start.

    Other vocabularies carve up "copy" differently. [schema.org](https://schema.org/CreativeWork), which is what search engines read, has a few precise terms and one catch-all. [DOREMUS](https://doi.org/10.1007/978-3-030-00668-6_1), a music ontology built by France's national library, Radio France and the Philharmonie de Paris, sits on the object-oriented version of FRBR, which uses a single [*is derivative of*](https://cidoc-crm.org/sites/default/files/LRM-FRBRoo_V0.6(PR)%20-%20Rev.pdf) link with a type attached: the same design as PROV's activities, arrived at separately.

    | Kind of copy | This site | PROV-O | schema.org | DOREMUS (FRBRoo) |
    | --- | --- | --- | --- | --- |
    | Serialization | the three files on the data page | `alternateOf` | `encoding` | — |
    | Transcription | `transcriptionOf` | `hadPrimarySource` + a `bu:Transcribing` activity | `isBasedOn` | — |
    | Translation | `translationOf` | `wasDerivedFrom` + a `bu:Translating` activity | `translationOfWork` | *is derivative of*, typed as a translation |
    | Adaptation | `adaptationOf` | `wasDerivedFrom` + a `bu:Adapting` activity | `isBasedOn` | *is derivative of*, typed as an adaptation |
    | Cover (a recording) | `recordingOf` | `wasDerivedFrom` + a `bu:Covering` activity | `recordingOf` | — |
    | Variant | `isA` a Roud number | — | `exampleOfWork` (loosely) | member of a "complex work" (loosely) |
    | Quotation | `quotesFrom` | `wasQuotedFrom` + a `bu:Quoting` activity | `citation` (loosely) | — |
    | Unproven influence | a claim | `wasInfluencedBy` | — | — |
    | Same thing | `sameAs` | — (`owl:sameAs`) | `sameAs`, which means something else | — |
    | A record about something | `documents` | — (not a derivation) | `about` | — |

    schema.org's `sameAs` deserves a warning: it doesn't mean identity, only a reference page, such as a Wikipedia entry, that identifies the thing. Which is one more reason two certificates shouldn't be linked with it.

    This blog's graph now says all of this in its data. Each of the post's links is published as a narrower version of its PROV and schema.org equivalents. The eight kinds of copy, with what survives and what changes in each, are published as kinds of PROV activity, and every transcription, translation, adaptation, recording and quotation in the graph also goes out in PROV's long form, as a qualified derivation whose activity is of the right kind. The [vocabulary page](page:vocab) lists them. Each of those activities says who was responsible and when, where anyone knows, and the people are in the graph too, from Scott de Martinville to Jonathan Larson. The [query page](page:query) has an example, "What was made from what, by whom, and when," which follows those long forms and returns every copy in the graph in order, from Scott de Martinville in 1860 to me, this month, singing it from tired memory. It skips the ones that are only claimed, like *La Bohème*, because recording a claim doesn't assert it.

[^5]: **ETL, again.** Extract, transform, load: the classic data pipeline in which records are reshaped into the destination's format before they're stored. [The last post](post:stac-not-stack) was about getting rid of the T in the laundry. Here the registrar is the T, and the T is the point. The difference from serialization is that the data model changes too. The US form and the French one don't have the same fields, so the registrar is mapping one schema onto another, not just rewriting the same record in a different syntax.

[^6]: **From parish to town hall.** The 1790 date for "Au clair de la lune" is from Bertrand Dicale's France Info chronicle on the song, which the education ministry hosts on [Éduscol](https://eduscol.education.gouv.fr/chansonsquifontlhistoire/Au-clair-de-la-lune.html). The law of 20 September 1792 has a title each for births, marriages and deaths, and a last one on closing the "registers held by the curés" and handing them to the municipalities ([INED, *Population & Sociétés* no. 271, 1992](https://www.ined.fr/fr/publications/editions/population-et-societes/le-bicentenaire-du-mariage-civil/)); the [Tours municipal archives](https://recherches-archives.tours.fr/printDoc/FRAC037261_IR000000014_description) sum it up as a secular état civil for all citizens, whatever their religion. Articles [57](https://criminocorpus.org/fr/legislation/droit/versions/698/57/diff/pdf) and [42](https://criminocorpus.org/en/landmarks/le-code-civil/versions/697/42/pdf/) of the Civil Code, in their versions of 11 March 1803, set the format and schema. Article 57 has been amended many times since and is still in force. Article 42 has been repealed, and its rules now live in article 6 of décret no. 2017-890 of 6 May 2017.

[^7]: **When sameAs isn't the same.** `owl:sameAs` comes from OWL, the Web Ontology Language, and it means strict identity: two names for one thing, so every statement about one is a statement about the other. In practice, people use it for everything from "identical" to "related" to "about the same topic," and the resulting mess has its own literature. The classic paper is Halpin, Hayes and colleagues, ["When owl:sameAs Isn't the Same"](https://doi.org/10.1007/978-3-642-17746-0_20) (ISWC 2010). The cure is the one used here: give the real-world thing its own identifier, and have the records *say they're about it* rather than *be* it.

[^8]: **Geoconnex.** [Geoconnex](https://internetofwater.org/geoconnex/) maintains persistent identifiers for "reference features" (rivers, watersheds, wells, gages), and every participating dataset links to them. If two agencies publish records about the same river, they link to the same reference feature, and nobody has to decide whose record is the real river. Rivers, like babies, aren't documents.

[^9]: **Frère Jacques.** *Sonnez les matines* is an instruction: ring the bells for matins. On [Wikipedia's reading](https://en.wikipedia.org/wiki/Fr%C3%A8re_Jacques), the friar has overslept and is being woken up to do his job, and the traditional English version keeps the scansion but changes the meaning so that the bells wake *him*. English is unusual here. Most other translations keep the friar on bell duty.

[^10]: **Waterloo Road and the Champs-Élysées.** "Waterloo Road" was released in February 1968 by Jason Crest, with lyrics by Mike Deighan and music by Mike Wilsh. It didn't chart. Dassin's version came out in May 1969 with French lyrics by Pierre Delanoë and sold about 600,000 copies in France. The details, including the credits, are on [Wikipedia](https://en.wikipedia.org/wiki/Les_Champs-%C3%89lys%C3%A9es_(song)). The French single lists Delanoë along with the two original writers, which is how a songwriting credit records an adaptation. Dassin later recorded the song in English, German, Italian and Japanese; the English one is on the *Intégrale Joe Dassin* as "Les Champs-Élysées (version anglaise)." Dassin was born in New York, so the anthem of the most Parisian street in Paris is a British tune with French words, sung by an American.

[^11]: **MusicBrainz works.** [MusicBrainz](https://musicbrainz.org/doc/How_to_Use_Works) separates *works* (compositions) from *recordings* (performances of them). A translated or reworded song becomes its own work, linked to the original with a relationship that can carry a "translated" attribute. The [forum thread](https://community.metabrainz.org/t/how-to-credit-adaption-of-lyrics-by/472728) with the editor stuck between "translated version of" and "based on" is worth reading in full if you enjoy watching careful people argue about edge cases.

[^12]: **The Rattlin' Bog as a reasoning problem.** In OWL, a property can be declared [transitive](https://www.w3.org/TR/owl2-primer/#Property_Characteristics): if A is in B and B is in C, then A is in C. SPARQL can follow a chain of any length with a property path, written with a `+`, without any reasoner at all.

    ```turtle
    @prefix ex: <https://example.org/bog#> .

    ex:bird   ex:isIn ex:egg .
    ex:egg    ex:isIn ex:nest .
    ex:nest   ex:isIn ex:branch .
    ex:branch ex:isIn ex:limb .
    ex:limb   ex:isIn ex:tree .
    ex:tree   ex:isIn ex:bog .
    ex:bog    ex:isIn ex:valley .
    ```

    ```sparql
    PREFIX ex: <https://example.org/bog#>
    # Everything that is, ultimately, down in the valley-O
    SELECT ?thing WHERE { ?thing ex:isIn+ ex:valley . }
    ```

    That returns the whole chain, bird included, which is the chorus. Note that the Turtle is in no particular order, and it doesn't need to be. The song is.

[^13]: **The Roud Folk Song Index**, compiled by Steve Roud and searchable at the [Vaughan Williams Memorial Library](https://www.vwml.org/roudnumber/129), gives each number a stable web address. Roud numbers are on [Wikidata](https://www.wikidata.org/wiki/Property:P1829) as property P1829, and MusicBrainz keeps the index as a series of works, so the identifiers already show up across the linked-data web. Older catalogues work the same way at a smaller scale. The 305 Child Ballads, numbered by Francis James Child in the 1880s and 1890s, are each a family of variants too.

[^14]: **French folk song catalogues.** Patrice Coirault's *Répertoire des chansons françaises de tradition orale* was revised and published by the Bibliothèque nationale de France in three volumes (1996–2007), and identifies about 2,000 song types. Conrad Laforte's *Catalogue de la chanson folklorique française* (Presses de l'Université Laval, six volumes, 1977–1987) is its older Quebec counterpart. In 2004, the Quebec folklore journal *Rabaska* asked researchers who had used both to [compare them](https://doi.org/10.7202/039391ar). <!-- To check: look up the Coirault and Laforte numbers for "L'arbre est dans ses feuilles," if it has them. -->

[^15]: **900 Miles to 500 to Dylan.** The [Wikipedia article on "500 Miles"](https://en.wikipedia.org/wiki/500_Miles) has the distances (from the folklorist Norm Cohen), the covers (the Kingston Trio and Peter, Paul and Mary in 1962, and a country hit for Bobby Bare in 1963) and a long list of translations, including a 1965 Slovenian hit. Jochen Markhorst's [essay on "I Was Young When I Left Home"](https://bob-dylan.org.uk/archives/21531) traces which of West's lines Dylan kept and what was left by the Basement Tapes. The speech quote is from Markhorst's [second installment](https://bob-dylan.org.uk/?p=21564), which is about exactly this chain.
