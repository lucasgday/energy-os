# Energy OS

Open source operating layer for low-headcount upstream energy operations.

Energy OS starts with a narrow wedge: production operations for oil and gas assets. The goal is to help teams turn well data, downtime, interventions, costs, and operating context into faster, more traceable decisions.

This project is being built in public from day zero. The long-term vision is an open operating system for energy assets. The near-term product is much smaller and more practical: a production operations workspace for mature fields, independent operators, and engineering teams that still depend on spreadsheets, manual reports, and disconnected systems.

## What This Is

- A public blueprint for an open upstream production operating layer.
- A domain model for wells, production, deferments, interventions, opportunities, and economics.
- A synthetic-data-first project that can be tested without exposing real field data.
- A future app for daily production surveillance, opportunity ranking, and decision journaling.
- A foundation for SaaS, self-hosted deployments, and enterprise integrations.

## What This Is Not

- Not a SCADA replacement.
- Not autonomous control of physical equipment.
- Not a replacement for OSDU, Energistics, PI, SAP, Maximo, or existing control systems.
- Not a place to publish real production data, customer data, credentials, or confidential asset information.
- Not a promise that AI can run energy operations without engineering judgment.

## Current Scope

The first product scope is **Upstream Production OS**:

1. Import production, downtime, cost, and well metadata.
2. Normalize assets into a simple operating model.
3. Detect production anomalies and deferments.
4. Rank operational opportunities.
5. Attach basic economics to decisions.
6. Keep an auditable decision journal.
7. Produce daily and weekly operating reports.

## Repository Map

```txt
docs/
  thesis.md
  roadmap.md
  product-blueprint.md
  domain-model.md
  technical-direction.md
  build-in-public.md
datasets/
  synthetic-field-v0/
schemas/
  wells.schema.json
  production-events.schema.json
  deferments.schema.json
  opportunities.schema.json
```

## Build In Public

We will publish decisions, roadmap changes, domain assumptions, and synthetic datasets openly. Real operator feedback may be summarized only when it can be made non-confidential and non-identifying.

The default rule is:

> Open by default. Private only when data, safety, security, or commercial trust requires it.

See [docs/build-in-public.md](docs/build-in-public.md).

## License

Energy OS is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
