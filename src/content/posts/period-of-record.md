---
title: "Period of Record"
published: 2026-11-26
summary: "We log every feed, diaper and nap, waiting for a schedule to show up. Water people have a better vocabulary for this than parents do. Intermittency comes in kinds, and a start date and an end date describe none of them."
draft: false  # the PR is the review gate; merging publishes

# DRAFT NOTES FOR KYLE (stay in the Markdown, never published):
# - Every <!-- KYLE: ... --> comment in the prose marks a household fact I guessed at or left
#   generic. Swap in the real version, or delete the sentence.
# - The night in the "Period of record" section and footnote 6 is made up and labeled as such.
#   If you'd rather use a real night from the app, change the times in the table, the Turtle and
#   the prose together. The numbers are checked against each other in the PR description.
# - The baby has no pronouns anywhere in this post, on purpose.

mentions: [muppy]

observations:
  - id: observation-26
    text: "We log the baby's feeds, diapers and sleep in an app, waiting for a schedule to show up in the data."
    observedBy: dad
    about: [baby-log, baby]

claims:
  - id: claim-intermittency-axes
    label: "Intermittency isn't one number: reliability, predictability and quality vary separately"
    short: "three axes, not one number"
    about: [intermittent-supply, baby-log, sleeping-through-the-night]
    attributedTo: dad
  - id: claim-newborn-unreliable
    label: "For now, the baby's sleep is unreliable intermittency"
    short: "unreliable, for now"
    about: [baby, intermittent-supply]
    attributedTo: dad
  - id: claim-por-wrong-summary
    label: "A start date and an end date are the wrong summary of an intermittent record"
    short: "the wrong summary"
    about: [temporal-coverage, sleeping-through-the-night, baby-log]
    attributedTo: dad

assessments:
  - id: assessment-14
    claim: claim-intermittency-axes
    by: dad
    stance: endorses
    evidence: [observation-26]
    note: "Borrowed from the water supply literature, and the baby log fits it."
  - id: assessment-15
    claim: claim-newborn-unreliable
    by: dad
    stance: tentative
    evidence: [observation-26]
    note: "Filed in the hope of withdrawing it."
  - id: assessment-16
    claim: claim-por-wrong-summary
    by: dad
    stance: endorses
    evidence: [observation-26]
    note: "True of the baby log and of most water quality sites I've looked at."
---

We keep a log. Every feed, every diaper and every nap goes into [an app](thing:baby-log), with a start time, an end time and, overnight, the occasional typo. (Context, such as it is, in the [README](post:readme).) [We log the baby's feeds, diapers and sleep, waiting for a schedule to show up in the data.](obs:observation-26) <!-- KYLE: name the app, or keep it generic? Confirm it's feeds, diapers and sleep. -->

Everyone who asks about [the baby](thing:baby) asks the same question, which is whether the baby is [sleeping through the night](thing:sleeping-through-the-night). The honest answer is a table, and the question wants a boolean.

My day job is water data, and one corner of the water world has thought much harder about this kind of question than parenting has. It's the part that studies places where water comes out of the tap only some of the time.

It is, of course, a data modeling problem.

## Water, some of the time

In a lot of the world, piped water isn't continuous. It arrives for a few hours a day, or a few days a week, and households organize their lives around it.[^1] This is called [intermittent supply](thing:intermittent-supply), and it affects somewhere around a billion people.

The first thing the literature teaches is that "intermittent" isn't one thing. One widely cited review sorts it into three kinds:[^2]

- **Predictable.** Water comes on a schedule, say every morning from 7 to 11, or Mondays, Wednesdays and Saturdays. With a big enough tank, this can feel a lot like continuous supply.
- **Irregular.** You can count on roughly a set amount of water over a few days, but not on when it arrives. A tank still helps, but somebody has to watch it.
- **Unreliable.** Water came for two hours last week, and "no one knows when it will come again."

Two neighborhoods can get the same number of hours of water per week and live completely different lives, because what differs is whether anyone can plan. A study of almost 3,000 households in nine countries found that more frequent interruptions went with more stress, and that predictability took a good chunk of the edge off.[^3] Same outages, known in advance, hurt less.

Then there's a third axis, which is what comes out when the water does come. Intermittent pipes lose pressure when they drain, and dirty water can get in. A neighborhood can have water on schedule and still not be able to drink it.

So I count three separate axes, not one number.

- **Reliability.** Does it show up when it's supposed to?
- **Predictability.** Can you know in advance when that will be?
- **Quality.** When it shows up, is it any good?

The review folds the first two together, which is fair for water. [I'm pulling them apart because reliability, predictability and quality vary separately, and the baby is a good example.](claim:claim-intermittency-axes)

## The baby as a utility

Treat the baby's sleep as the supply. (The baby is the utility. The parents are the households at the end of the line.)

**Reliability** is a strange axis for a newborn, because nothing was ever promised. There's no service-level agreement. The baby signed nothing.

**Predictability** is the one the log is supposed to fix. Some nights the first stretch is long, and some nights it isn't. The log knows when each nap started and ended. What it can't do yet is tell us when the next one will start. [For now, the baby's sleep is unreliable intermittency.](claim:claim-newborn-unreliable) That's a claim I'm putting on the record specifically so I can withdraw it in a later post.

**Quality** is the one nobody asks about. A twenty-minute contact nap on a parent's chest and two hours in the crib both count as "slept" in the log, the way brown water and clean water both count as "supply hours."

Seen that way, "getting on a schedule" doesn't mean more sleep. It means moving from unreliable to irregular to predictable, which is the whole agenda of every utility in the review. And the stress finding carries over. A three-hour stretch you can count on is worth more to the people downstream than a four-hour one you can't.

[The older kid](thing:the-authority), for comparison, runs on predictable intermittency, with [bedtime](thing:bedtime) as a scheduled outage with documented dependencies (see [the muppies](post:not-all-sloths-are-muppies)). <!-- KYLE: OK to call the older kid's bedtime predictable? Cut if not. -->

Households with intermittent water also cope in recognizable ways. They store water, keep a backup source, and shift the laundry to whenever the taps are on. Parents do versions of all three. They sleep when the baby sleeps (time-shifting), and they take turns at night (a backup supply, of sorts). <!-- KYLE: swap in our real coping strategies: night shifts? a freezer stash? Delete what isn't true. -->

Storage is where the analogy fails. With a big enough tank, predictable water supply can feel almost continuous. Sleep, unfortunately, doesn't store.

## Period of record

Now for the part that's about work.

Every water quality monitoring site comes with a [period of record](thing:temporal-coverage), the dates of its first and last samples. A site listed as "1972–2024" sounds like 53 years of data. It might really be monthly sampling through 1985, quarterly through 1994, nothing at all for thirteen years, then monthly again from 2008. That's about two-thirds of what 53 years of monthly sampling would give you, with the biggest hole right in the middle of anything you'd want to call a trend.

Some of the systems are better than the summary. The Water Quality Portal, for one, can return a site's record year by year, not just its endpoints.[^4] But the metadata standards make the one-interval version the easy one to publish.[^5] It's one field, and it's almost always filled in.

Here's the same summary applied to a made-up night that's roughly the shape of a newborn's.

| | What happened |
| --- | --- |
| First sleep starts | 7:40 pm |
| Last sleep ends | 7:00 am |
| Period of record | 7:40 pm to 7:00 am (11 h 20 min) |
| Pieces | 6 |
| Total asleep | 8 h 45 min |
| Longest stretch | 2 h 15 min |
| Share of the period actually asleep | 77% |

"Slept from 7:40 to 7" is a perfectly valid period of record for that night. It would also get you a funny look from the parents. The footnotes have the same night as RDF, with the queries that pull those numbers back out.[^6]

[A start date and an end date are the wrong summary of an intermittent record.](claim:claim-por-wrong-summary) For a water quality site, the better summary is the intervals where there's data, how often it was sampled within each one, and where the holes are. For the baby, it's the same thing at the scale of one night.

## A gap in the record isn't a gap in the river

There's a catch, and it's the part I find most useful.

A gap in a time series can mean two different things. In a **supply gap**, the thing itself stopped: no water in the pipe, or a baby who's awake. In an **observation gap**, nobody looked. In intermittent water supply, the gaps are the phenomenon. In water quality monitoring, a gap is almost always the observation kind. The river kept flowing and nobody took a sample.

The baby log has both, and it doesn't distinguish them. An awake stretch in the log is real. A missing overnight feed is much more likely to be a parent who fell asleep before logging it than a baby who skipped a meal. Read naively, the log says the baby slept through a feed. What actually happened is that the observer network went down.

A good record says which kind of gap it has. In practice, that means recording the observing as well as the observations: when someone was logging, when a sensor was deployed, when the sampling program was funded. Then "no data" can mean "nothing happened" or "nobody was watching," and the metadata says which.

## Status

- **Supply:** unreliable intermittency. Target: predictable. ETA unknown.
- **Storage:** none. Sleep doesn't store.
- **Monitoring:** continuous, by observers whose own coverage is intermittent.
- **Known issue:** relatives keep requesting a single number.

[^1]: **Intermittent water supply.** The usual definition is piped water that's available for less than 24 hours a day. Estimates of how many people it affects depend on the data and the definition. A 2017 study by Bivins and colleagues in *Environmental Science & Technology* put it at about 925 million people with intermittent piped supply, and estimated the diarrheal disease that drinking that water causes each year ([doi:10.1021/acs.est.7b01014](https://doi.org/10.1021/acs.est.7b01014)). The [Wikipedia article](https://en.wikipedia.org/wiki/Intermittent_water_supply) gives a higher figure, about 1.3 billion. On why quality suffers, Emily Kumpel and Kara Nelson studied the mechanisms behind contamination in an intermittent system in Hubli-Dharwad, India, where deliveries were short and far apart ("Mechanisms Affecting Water Quality in an Intermittent Piped Water Supply," *Environmental Science & Technology*, 2014, [PubMed 24459990](https://pubmed.ncbi.nlm.nih.gov/24459990/)).

[^2]: **Three kinds of intermittency.** Galaitsi, Russell, Bishara, Durant, Bogle and Huber-Lee, ["Intermittent Domestic Water Supply: A Critical Review and Analysis of Causal-Consequential Pathways"](https://doi.org/10.3390/w8070274), *Water* 8(7), 2016. It reviews 129 papers and maps 47 conditions that cause intermittency or result from it, many of which feed back into each other. The three categories (predictable, irregular and unreliable) come with an example neighborhood for each, and the observation that enough storage, well managed, can make the first two look like continuous supply. Under unreliable intermittency, storage is usually small and the dry spells long, so it helps much less.

[^3]: **Predictability as a mitigation.** Thomson, Pearson, Kumpel, Guzmán, Workman, Fuente, Wutich and Stoler, ["Water Supply Interruptions Are Associated with More Frequent Stressful Behaviors and Emotions but Mitigated by Predictability: A Multisite Study"](https://pubmed.ncbi.nlm.nih.gov/38598435/), *Environmental Science & Technology* 58(16), 2024. They used survey data from 2,873 households at 10 sites in 9 middle-income countries. Among households with interruptions, predictability reduced the associations with emotional distress and with stressful coping behavior by roughly a quarter to a half. Their recommendation is that utilities that can't supply water continuously should at least schedule the interruptions and tell people about them, and that global monitoring should start counting predictability.

[^4]: **Period of record, by year.** The [Water Quality Portal](https://www.waterqualitydata.us/) combines discrete water quality data from USGS, EPA and hundreds of state, tribal and local agencies. Its summary service has a `periodOfRecord` data profile that returns, for each site, year-by-year information on what data are available, not just the endpoints. USGS's R package wraps it as [`readWQPsummary()`](https://water.code-pages.usgs.gov/dataRetrieval/reference/readWQPsummary.html). A yearly histogram is a big improvement on two dates, though it still can't tell monthly sampling from twelve samples taken in one week in June.

[^5]: **Temporal coverage in the metadata standards.** <!-- KYLE: I couldn't load the schema.org or DCAT pages to re-check these details while drafting. Worth a quick look before publishing. --> In [schema.org](https://schema.org/temporalCoverage), the vocabulary behind most linked-data markup for datasets (water data included), a dataset's time span is `temporalCoverage`, written as an ISO 8601 interval such as `1972/2024`. An open-ended one is written with `..`, as in `2026-11/..`, which is the correct way to describe a newborn's sleep record and also the least informative. W3C's [DCAT](https://www.w3.org/TR/vocab-dcat-3/) does better. A dataset's `dct:temporal` is a period of time with a `dcat:startDate` and `dcat:endDate`, and a separate `dcat:temporalResolution` gives the spacing between data points as a duration (`P1M` is a month). Neither makes you say where the holes are. One way to say it anyway is to split the record into parts, each with its own interval and spacing.

    ```turtle
    @prefix ex:   <https://example.org/wq/> .
    @prefix dcat: <http://www.w3.org/ns/dcat#> .
    @prefix dct:  <http://purl.org/dc/terms/> .
    @prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .

    # How it's usually published: one interval.
    ex:nitrate-naive a dcat:Dataset ;
        dct:temporal [ dcat:startDate "1972-01-01"^^xsd:date ;
                       dcat:endDate   "2024-12-31"^^xsd:date ] .

    # Gap-aware: the same record as three parts.
    ex:nitrate a dcat:Dataset ;
        dct:hasPart ex:nitrate-monthly-1, ex:nitrate-quarterly, ex:nitrate-monthly-2 .

    ex:nitrate-monthly-1 a dcat:Dataset ;
        dct:temporal [ dcat:startDate "1972-01-01"^^xsd:date ;
                       dcat:endDate   "1985-12-31"^^xsd:date ] ;
        dcat:temporalResolution "P1M"^^xsd:duration .

    ex:nitrate-quarterly a dcat:Dataset ;
        dct:temporal [ dcat:startDate "1986-01-01"^^xsd:date ;
                       dcat:endDate   "1994-12-31"^^xsd:date ] ;
        dcat:temporalResolution "P3M"^^xsd:duration .

    ex:nitrate-monthly-2 a dcat:Dataset ;
        dct:temporal [ dcat:startDate "2008-01-01"^^xsd:date ;
                       dcat:endDate   "2024-12-31"^^xsd:date ] ;
        dcat:temporalResolution "P1M"^^xsd:duration .
    ```

    With the parts in place, finding the holes is a query. This one returns every gap of more than five years between consecutive parts, which for the record above is 1994 to 2008.

    ```sparql
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dct:  <http://purl.org/dc/terms/>

    SELECT ?dataset ?lastBefore ?firstAfter WHERE {
      ?dataset dct:hasPart ?a, ?b .
      ?a dct:temporal/dcat:endDate ?endA .
      ?b dct:temporal/dcat:startDate ?startB .
      BIND (YEAR(?endA) AS ?lastBefore)
      BIND (YEAR(?startB) AS ?firstAfter)
      FILTER (?firstAfter - ?lastBefore > 5)
      FILTER NOT EXISTS {
        ?dataset dct:hasPart ?c .
        ?c dct:temporal/dcat:startDate ?startC .
        FILTER (YEAR(?startC) > ?lastBefore && YEAR(?startC) < ?firstAfter)
      }
    }
    ```

[^6]: **The night as data.** Each sleep is an activity with a start and an end, using PROV's `startedAtTime` and `endedAtTime`, the same vocabulary [the last post](post:mon-ami-prov-o) used for copies of songs. The night is made up. The times are illustrative, not ours.

    ```turtle
    @prefix ex:   <https://example.org/household/> .
    @prefix prov: <http://www.w3.org/ns/prov#> .
    @prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .

    ex:sleep-1 a ex:Sleep ;
        prov:startedAtTime "2026-11-20T19:40:00-05:00"^^xsd:dateTime ;
        prov:endedAtTime   "2026-11-20T21:10:00-05:00"^^xsd:dateTime .
    ex:sleep-2 a ex:Sleep ;
        prov:startedAtTime "2026-11-20T21:45:00-05:00"^^xsd:dateTime ;
        prov:endedAtTime   "2026-11-20T23:55:00-05:00"^^xsd:dateTime .
    ex:sleep-3 a ex:Sleep ;
        prov:startedAtTime "2026-11-21T00:30:00-05:00"^^xsd:dateTime ;
        prov:endedAtTime   "2026-11-21T02:05:00-05:00"^^xsd:dateTime .
    ex:sleep-4 a ex:Sleep ;
        prov:startedAtTime "2026-11-21T02:40:00-05:00"^^xsd:dateTime ;
        prov:endedAtTime   "2026-11-21T03:20:00-05:00"^^xsd:dateTime .
    ex:sleep-5 a ex:Sleep ;
        prov:startedAtTime "2026-11-21T03:35:00-05:00"^^xsd:dateTime ;
        prov:endedAtTime   "2026-11-21T05:50:00-05:00"^^xsd:dateTime .
    ex:sleep-6 a ex:Sleep ;
        prov:startedAtTime "2026-11-21T06:25:00-05:00"^^xsd:dateTime ;
        prov:endedAtTime   "2026-11-21T07:00:00-05:00"^^xsd:dateTime .
    ```

    The period of record is just the earliest start and the latest end.

    ```sparql
    PREFIX ex:   <https://example.org/household/>
    PREFIX prov: <http://www.w3.org/ns/prov#>

    SELECT (MIN(?start) AS ?first) (MAX(?end) AS ?last) (COUNT(?s) AS ?pieces) WHERE {
      ?s a ex:Sleep ; prov:startedAtTime ?start ; prov:endedAtTime ?end .
    }
    ```

    The awake stretches take a little more work. For each waking, find the next sleep, meaning one with no other sleep starting in between.

    ```sparql
    PREFIX ex:   <https://example.org/household/>
    PREFIX prov: <http://www.w3.org/ns/prov#>

    SELECT ?wokeAt ?sleptAgainAt (?sleptAgainAt - ?wokeAt AS ?awake) WHERE {
      ?a a ex:Sleep ; prov:endedAtTime ?wokeAt .
      ?b a ex:Sleep ; prov:startedAtTime ?sleptAgainAt .
      FILTER (?sleptAgainAt > ?wokeAt)
      FILTER NOT EXISTS {
        ?c a ex:Sleep ; prov:startedAtTime ?between .
        FILTER (?between > ?wokeAt && ?between < ?sleptAgainAt)
      }
    }
    ORDER BY ?wokeAt
    ```

    That returns five stretches, four of 35 minutes and one of 15. Subtracting one timestamp from another isn't something SPARQL 1.1 promises, but Comunica, the engine behind this site's [query page](page:query), does it anyway and hands back a duration. It won't add durations up, though, so the 8 h 45 min total in the table was done by hand, the same way parents do it at 3 am.
