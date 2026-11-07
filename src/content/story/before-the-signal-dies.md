---
title: Before the Signal Dies
summary: A disaster-communications planning tool that rates all 1,699 Western Australian localities by how likely they are to lose mobile coverage in a disaster, simulates outages, and places portable cell units where they reconnect the most people. 2nd place at the IBM Z Datathon 2026.
date: 2026-11-07
status: prototype
event: IBM Z Datathon 2026
eventDate: "17 October 2026, Federation University, Berwick"
award: 2nd place
team:
  - Adithyan Kunnummal
  - Meer Daiyan Ahmed
  - Sanal Mehra
  - Sanika Rahman
role: "Built the prototype app; my teammates collected and prepared the data"
duration: 24-hour team hackathon
platform: IBM LinuxONE Community Cloud (z17, Telum II)
tags:
  - machine learning
  - geospatial
  - disaster resilience
  - IBM LinuxONE
stack:
  - Python 3.12
  - pandas, NumPy, Shapely, pyproj
  - XGBoost 3.4.1
  - IBM Snap ML 1.17.2 + zDNN
  - Leaflet
  - Docker
links:
  - label: Video pitch
    url: https://youtu.be/piIo76e4jmU
  - label: Code on GitHub
    url: https://github.com/Adithyan-Kunnummal/IBM-Before-The-Signal-Dies
---

> Outage reports come from towns that still have signal.

When bushfires, storms or cyclones take out mobile towers, communities lose the ability to call for help, receive warnings and coordinate evacuations. The hardest hit are often remote communities served by a single site with no backup. And planners usually find out which communities went silent only *after* the outage.

At the IBM Z Datathon 2026, a 24-hour hackathon held on 17 October 2026 at Federation University, Berwick, Meer Daiyan Ahmed, Sanal Mehra, Sanika Rahman and I built *Before the Signal Dies*: a planning tool that shows, in advance, which Western Australian communities are most likely to lose mobile coverage in a disaster, how many people would be cut off, and where a few portable cell units would do the most good. It placed 2nd. It was also my first hackathon.

My teammates collected and prepared the data; I built the prototype app that turns it into something a planner can use.

## The Problem

There's no simple, statewide view of who is exposed before a disaster hits. So we set out to build one, for Western Australia and the Optus network (the outage register we had access to is Optus's).

The first decision that shaped everything was what *not* to promise. Our output is a **Low, Medium or High relative susceptibility** rating for each locality: a ranking, not a probability or a forecast. Outage duration, rainfall, local daily wind and live hazard feeds were out of scope.

The unit of analysis is the ABS 2021 Suburbs and Localities set: 1,699 spatial localities in WA.

## The Data

Everything comes from open data:

- **Optus mobile sites** from the ACCC's Mobile Coverages and Sites data (snapshot 31 January 2025): 943 unique site IDs.
- **Localities and 2021 population** from the ABS Census GeoPackages.
- **Hazards:** bushfire-prone areas (WA OBRM-026), fire history (DBCA-060), floodplain mapping (DWER-020) and tropical cyclone tracks from the Bureau of Meteorology.
- **Significant outages** from Optus's [national outage register](https://www.optus.com.au/living-network/service-status/national-outage-register), downloaded 17 October 2026.

Cleaning the outage register took more care than anything else. 287 raw records became 39 WA mobile reports, then 37 WA-only reports. We matched reported towns to ABS localities by **exact normalised name only**: no fuzzy guessing and no unverified aliases. That gave 139 exact matches and 4 unmatched names, and we held 4,526 town entries from multi-state reports for review, because those reports don't say which town is in which state. Timestamps were converted from their AEST/AEDT labels to WA time.

The result: **114 WA localities with a reported outage, 1,585 unknown, and zero confirmed negatives.** That last number matters a lot.

For infrastructure, we computed each locality's distance to the nearest Optus site and the number of sites within 5 km and 10 km (geodesic, from each locality's interior representative point), plus site count and density. One catch: site IDs aren't necessarily unique physical towers, and 19 IDs have multiple source positions, which we preserved.

## The Insight That Shaped the Design

Here's the problem we didn't expect. Outage reports come mostly from busy, well-connected towns, where people notice and report. The remote communities most at risk barely appear in the record.

If we had trained a model on past reports and called its output "risk", we would have built a tool that overlooks exactly the people who most need help. So we split the job in two:

1. A **transparent susceptibility index** sets the planning bands.
2. A **machine learning model** trained on the outage register is shown alongside it, as a second, learned view.

## The Susceptibility Index

The index weighs two things equally:

| Hazard exposure (weight 0.5) | Network sparsity (weight 0.5) |
|---|---|
| Bushfire-prone area % | Distance to nearest Optus site (further is worse) |
| Mapped floodplain % | Optus sites within 5 km (fewer is worse) |
| Recorded bushfires per year | Optus sites within 10 km (fewer is worse) |
| Nearby cyclone tracks | |

Each feature is scaled 0 to 1 (percentages divided by 100; counts and distances log-scaled against the WA maximum). Each half is averaged, then **converted to a WA-wide percentile before weighting**. We added that step after noticing that the nominal 50/50 weighting wasn't truly equal, because the two halves spread differently.

The bands are relative ranks: the top 20% are High (339 localities), the next 30% Medium (510) and the remaining 50% Low (850). The weights were set by us, not tuned to outage data, so we tested how much they matter: shifting to 40/60 changes 186 localities' band (11%), and 60/40 changes 168 (10%). 1,347 localities keep their band either way.

Every locality also gets a plain-English explanation of its main factors, built only from measured facts.

As a check (not an accuracy measure), we asked how well the index ranks the 114 reported localities above unreported ones. The overall AUC is 0.418: worse than random. But split by population it's 0.298 in the least populated third and 0.627 in the most populated. Reports concentrate in populated, well-served places, the opposite of what the index prioritises. That result supports the core insight rather than undermining it.

## The Model

The XGBoost model is framed as **positive–unlabelled learning**: 114 positives, 1,585 unlabelled, no confirmed negatives. The usual assumption in that setup, that reported outages are a random sample of real ones, is probably violated by reporting bias, and we say so.

It uses 11 features: population, density, area, Optus site count and density, nearest-site distance, sites within 5 km and 10 km, recorded bushfire count and rate, and nearby cyclone tracks. Hazard history for the model ends *before* the outage window (12 December 2020 to 12 December 2025), and outage causes, durations, service counts and report IDs are never inputs, to avoid leakage.

**Evaluation was the hard part.** Random row splits would leak, because reports share incidents: one storm accounts for 90 of the 114 positives. So we grouped reports into 19 independent incidents, linked by shared localities, and ran two tests: a storm hold-out (90 localities) and leave-one-incident-out over the remaining 18 incidents (24 localities). The comparison set was 20% of unlabelled localities, chosen by 1° grid cell and never trained on, over 5 seeds. We report the mean percentile of held-out reported localities and the share landing in the top 20% (random is 20%), not accuracy, because the comparison set may contain unreported outages.

| Approach | Storm hold-out | Leave-one-incident-out | All 114 |
|---|---|---|---|
| **XGBoost (final)** | 0.765 / 61.6% | 0.770 / 60.8% | **0.766 / 61.4%** |
| XGBoost (original) | 0.725 / 58.0% | 0.742 / 54.2% | 0.729 / 57.2% |
| Logistic regression | 0.743 / 66.4% | 0.801 / 66.7% | 0.755 / 66.5% |
| Population only | 0.671 / 39.3% | 0.625 / 30.0% | 0.661 / 37.4% |
| Transparent index | 0.397 / 2.9% | 0.570 / 16.7% | 0.433 / 5.8% |

The final model captures 61.4% of held-out reported localities in its top 20%, 3.07 times random.

The biggest drivers (mean |SHAP|) are site density and distance to the nearest site, and the distance effect is strongly negative: *nearer* sites mean *more* reports. The model learns where outages get **reported**, which is populated places close to Optus sites. That's useful context, but it's a different question from susceptibility, and it's exactly why the index, not the model, sets the planning bands.

## The Prototype App

This was my part of the project. The prototype is a web app built on Python's standard-library HTTP server (no framework) with a Leaflet map. A planner can:

- See all 1,699 localities, coloured by susceptibility band or model band.
- Run a disaster: pick one of four presets or draw a custom area. Sites inside it fail (a deterministic share, so results repeat).
- See which localities lose coverage. A locality counts as covered if a working site is within an assumed radius (10 km by default) of its representative point, because the ACCC data has no per-site footprints.
- Watch bands rise live. Localities that lose nearby sites have their network score recomputed with the index's own scaling. Hazard is unchanged, so bands can only go up.
- Place temporary units. They're placed greedily, one at a time, wherever each restores the most residents.
- Open any locality for its facts, explanation, live model scores from three engines and top feature contributions.

Before any disaster, 783 localities (82,523 residents) already have no Optus site within 10 km of their representative point. With two units and a 15 km unit range, the presets show how much a small response can recover:

| Scenario | Residents affected | Residents reconnected by 2 units |
|---|---:|---:|
| Perth Hills bushfire | 28,133 | 28,113 |
| Kimberley cyclone | 14,434 | 14,434 |
| South West storm | 4,986 | 4,517 |
| Wheatbelt grassfire | 2,715 | 2,675 |

In the Kimberley cyclone scenario, Broome goes from Low to High. The scenarios are illustrative, not reconstructions of real events.

## Running on IBM LinuxONE

We trained natively on an IBM LinuxONE Community Cloud VM (machine type 9175: z17 with Telum II, s390x, 3 CPUs, Ubuntu 24.04), and the model and scores in the repository come from that run.

The app serves one trained model through **three inference engines**: XGBoost on the CPU, IBM Snap ML on the CPU, and IBM Snap ML on the **Telum Integrated Accelerator for AI** via IBM's zDNN library. Every engine is checked against the stored training scores at start-up and agrees with XGBoost to within 1.45 × 10⁻⁷.

It runs in a hardened container: a multi-stage Ubuntu 24.04 image built natively on s390x, non-root, read-only file system, all Linux capabilities dropped, no privilege escalation, memory and process limits, and a health check. It's published only on localhost and reached through an SSH tunnel. Telum works inside the container with no extra privileges, because NNPA is a CPU instruction.

We measured the accelerator rather than assume it helps. Snap ML on the CPU is about twice as fast as XGBoost at every batch size. For our deliberately small model (150 trees of depth 2), Telum is *slower* than the cores at every size we tested: about 3.9 µs per row against 0.6 µs. It returns matching scores and moves inference off the general-purpose cores, but larger tree ensembles are where the accelerator is designed to pay off.

## What Went Wrong

**The model memorised populations.** Our first XGBoost model (depth 3, min_child_weight 3, lambda 1, 300 rounds) kept splitting at the same exact population values, 112 to 117 residents. It was memorising, not learning. Regularisation (depth 2, min_child_weight 10, lambda 5, gamma 1, 150 rounds) plus monotone constraints on population, nearest-site distance, fire history and cyclone tracks fixed it, and improved held-out results from 57.2% to 61.4% captured.

**s390x isn't a first-class Python platform.** There are no scikit-learn or SciPy wheels for it, so the container compiles them, with gfortran and OpenBLAS in the build stage and the Fortran runtime in the runtime stage. The first build took about 25 minutes.

**Telum silently wasn't being used.** Snap ML fell back to CPU-only until we installed IBM's zDNN library.

**Two libraries disagreed about a file format.** Snap ML 1.17 couldn't read XGBoost 3's JSON layout ("no objective defined"). The app now writes a temporary copy in the XGBoost 2 layout. Predictions are unchanged.

**Equal weights weren't equal.** As described above, the 50/50 split only became genuinely equal once each half was converted to a percentile.

## Limitations

- Bands are relative rankings, not outage probabilities or forecasts.
- The outage register is a selected set of reported incidents. No report is not evidence of normal service, and reporting favours populated areas.
- One storm accounts for most positives, so there are few independent incidents, and final-model scores for reported localities are in-sample.
- Site IDs are not necessarily unique physical towers, and there are no per-site coverage footprints, so "covered" uses an assumed radius from one point per locality.
- A floodplain value of 0 can mean unmapped, and fire history is incomplete statewide.
- There is no rainfall, local wind or live hazard data.
- The index weights were chosen by the team, not fitted.

## Takeaways

**An AI project starts with the problem, not the model.** The most important decision we made was noticing that the outage record is biased toward places that still have signal, and refusing to let a model trained on it decide who's at risk.

**Question your data before you trust your model.** Exact-name matching, incident-grouped evaluation and leakage controls weren't glamorous, but without them our results would have looked better and meant less.

**Be honest about what the results can and can't say.** That goes for the accelerator benchmark too. Telum was slower for our model, and saying so is more useful than pretending otherwise.

## Credits

Built by **Adithyan Kunnummal, Meer Daiyan Ahmed, Sanal Mehra and Sanika Rahman** for the IBM Z Datathon 2026, organised by the Shooting Stars Foundation and judged by IBM subject-matter experts.

Watch the [video pitch](https://youtu.be/piIo76e4jmU), or read the code on [GitHub](https://github.com/Adithyan-Kunnummal/IBM-Before-The-Signal-Dies).
