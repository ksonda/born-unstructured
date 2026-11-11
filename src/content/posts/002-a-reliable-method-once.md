---
title: "We Have Discovered a Reliable Method, Once"
episode: 2
sample: true
published: 2026-12-11
summary: "A baby falls asleep on lap four of the kitchen. One parent draws a conclusion. The other asks about the sample."

observations:
  - id: observation-05
    text: "He fell asleep on lap four of the kitchen walking circuit."
    observedBy: dad
    about: [baby, walking, kitchen]
  - id: observation-06
    text: "He spat out the green pacifier twice, then took the blue one immediately."
    observedBy: mom
    about: [baby, green-pacifier, blue-pacifier]
  - id: observation-07
    text: "The Schedule is laminated."
    observedBy: mom
    about: [the-schedule, dad]

claims:
  - id: claim-walking
    label: "Walking helps him settle"
    short: "walking helps"
    subject: baby
    predicate: settlesWith
    object: walking
    attributedTo: dad
  - id: claim-blue-only
    label: "He will only accept the blue pacifier"
    short: "only the blue one"
    subject: baby
    predicate: acceptsOnly
    object: blue-pacifier
    attributedTo: mom
  - id: claim-schedule
    label: "He will be following the Schedule by week six"
    short: "on Schedule by week six"
    subject: baby
    predicate: willFollow
    object: the-schedule
    attributedTo: dad

assessments:
  - id: assessment-05
    claim: claim-walking
    by: dad
    stance: tentative
    evidence: [observation-05]
    note: "Tested once."
  - id: assessment-06
    claim: claim-blue-only
    by: mom
    stance: endorses
    evidence: [observation-06]
  - id: assessment-07
    claim: claim-blue-only
    by: dad
    stance: questions
    note: "They are the same pacifier in two colors."
  - id: assessment-08
    claim: claim-schedule
    by: dad
    stance: strongly-endorses
    evidence: [observation-07]
    note: "It is clear, it is reasonable, and it is laminated."
  - id: assessment-09
    claim: claim-schedule
    by: mom
    stance: questions
    note: "Asks who the Schedule was circulated to before it was approved."
---

The first thing to say is that we have a method. I want that on the record before anything else happens to it.

## The discovery

At 9:40 on Tuesday night, [the Baby](thing:baby) had been crying for long enough that [Mom](thing:mom) and I had stopped offering each other theories and started offering each other the baby. On my turn I walked him around [the kitchen](thing:kitchen), because it was the only room with the lights already on. The route goes fridge, table, the bit of counter where the mail lives, fridge.

[He fell asleep on lap four](obs:observation-05).

I have since walked [the same circuit](thing:walking) in my head several times and can find nothing wrong with it. My working position is that [walking helps him settle](claim:claim-walking). I hold it tentatively, which is the correct way to hold a position you have tested once.

## A dispute about color

We own two pacifiers. They came in the same packet and are the same pacifier, one in blue and one in green. Mom's view is that [he will only accept the blue one](claim:claim-blue-only). Her evidence is that [he spat out the green pacifier twice and then took the blue one immediately](obs:observation-06).

I asked whether he might simply have been ready for a pacifier by the third offer. The question was noted. For now [the blue pacifier](thing:blue-pacifier) lives on the arm of the sofa and [the green one](thing:green-pacifier) lives wherever it likes.

## The Schedule

Before he was born I wrote [the Schedule](thing:the-schedule): feeds, naps and one adult shower per day, in a table, by the hour. [It is laminated](obs:observation-07). I am confident that [he will be following it by week six](claim:claim-schedule), on the grounds that it is clear, it is reasonable, and it is on the fridge at his eventual eye level.

Mom has asked who the Schedule was circulated to before it was approved. I take the point. It will be raised with him when he is awake, which according to the Schedule is 7 a.m.
