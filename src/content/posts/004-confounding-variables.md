---
title: "Confounding Variables"
episode: 4
sample: true
published: 2026-12-25
summary: "Walking fails at 2 a.m. and works at 8 p.m. The difference is an appliance. Two theories are filed about it within the hour."

observations:
  - id: observation-11
    text: "Eleven laps at 2 a.m. had no effect on anyone except Dad."
    observedBy: dad
    about: [baby, walking, dad]
  - id: observation-12
    text: "He settled on lap three at 8 p.m. The dishwasher was running."
    observedBy: dad
    about: [baby, walking, dishwasher]
  - id: observation-13
    text: "He fell asleep in the bouncer beside the dishwasher. Nobody was walking anywhere."
    observedBy: mom
    about: [baby, bouncer, dishwasher]
  - id: observation-14
    text: "The blue pacifier was found in the pocket of Dad's hoodie, where it had been throughout the search."
    observedBy: mom
    about: [blue-pacifier, dad]
  - id: observation-15
    text: "He cried from 5 p.m. to 8 p.m. on a day whose inputs were not noticeably different from the day before."
    observedBy: mom
    about: [baby, witching-hour]

claims:
  - id: claim-walking-dishwasher
    label: "Walking works, but only while the dishwasher is running"
    short: "walking needs the dishwasher"
    subject: walking
    predicate: requires
    object: dishwasher
    about: [baby]
    attributedTo: dad
    refines: claim-walking
  - id: claim-dishwasher
    label: "It is the dishwasher, not the walking"
    short: "it's the dishwasher"
    subject: baby
    predicate: settlesWith
    object: dishwasher
    attributedTo: mom
  - id: claim-witching-hour
    label: "The witching hour is caused by something we did"
    short: "the witching hour is our fault"
    description: >
      The evening crying is a response to some input earlier in the day, and that input can be
      found and removed. The leading suspect is Dad's afternoon coffee.
    about: [baby, witching-hour, dad]
    attributedTo: dad

assessments:
  - id: assessment-16
    claim: claim-walking
    by: dad
    stance: qualifies
    evidence: [observation-11, observation-12]
    note: "Adds a condition, a time window and a footnote."
  - id: assessment-17
    claim: claim-walking-dishwasher
    by: dad
    stance: endorses
    evidence: [observation-12]
  - id: assessment-18
    claim: claim-walking-dishwasher
    by: mom
    stance: disputes
    evidence: [observation-13]
    note: "The walking is a passenger."
  - id: assessment-19
    claim: claim-dishwasher
    by: mom
    stance: endorses
    evidence: [observation-13]
  - id: assessment-20
    claim: claim-witching-hour
    by: dad
    stance: tentative
    note: "Suspects the afternoon coffee. His, not the baby's."
  - id: assessment-21
    claim: claim-witching-hour
    by: mom
    stance: disputes
    evidence: [observation-15]
    note: "Babies have done this since before coffee."
---

I regret to report a complication. It is the kind of complication that arrives at 2 a.m.

## The failure

On Monday night walking did not work. I want to be precise: [eleven laps at 2 a.m. had no effect on anyone except me](obs:observation-11). [The Baby](thing:baby) cried at the fridge, the table and the post, in that order, eleven times.

Then on Wednesday, at 8 p.m., [he settled on lap three](obs:observation-12). The difference, as far as I can reconstruct it, is that on Wednesday [the dishwasher](thing:dishwasher) was running.

So the original claim needs qualifying, and I have qualified it. [Walking helps him settle](claim:claim-walking), with a condition, a time window and a footnote. The condition is now a claim in its own right: [walking works, but only while the dishwasher is running](claim:claim-walking-dishwasher).

## The rival theory

[Mom](thing:mom) read the above and filed a competing claim within the hour. Her position is that [it is the dishwasher, not the walking](claim:claim-dishwasher), and that the walking is a passenger.

Her evidence is, annoyingly, an observation. On Thursday afternoon [he fell asleep in the bouncer beside the dishwasher while nobody walked anywhere](obs:observation-13). I have pointed out that [the bouncer](thing:bouncer) is a confounding variable. She has pointed out that so am I.

We now hold two claims about the same appliance and agree on neither.

## Recovered property

[The blue pacifier](thing:blue-pacifier) went missing again on Tuesday and a search was conducted. [It was found in the pocket of my hoodie, where it had been the whole time](obs:observation-14). I had been wearing the hoodie during the search. Mom has started calling it Old Blue, which I think is meant to make me feel worse, and does.

## Between five and eight

There is a period each evening we have started calling [the witching hour](thing:witching-hour), although it is three hours. On Friday [he cried from 5 p.m. to 8 p.m. on a day whose inputs were not noticeably different from the day before](obs:observation-15).

I think [it is caused by something we did](claim:claim-witching-hour). I suspect the afternoon coffee, mine rather than his. Mom disputes this on the grounds that babies have done this since before coffee. I am holding the position tentatively and the coffee firmly.
