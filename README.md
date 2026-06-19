# Energy OS

Open source operating layer for low-headcount upstream energy operations.

Energy OS starts with a narrow wedge: production operations for oil and gas assets. The goal is to help teams turn well data, downtime, interventions, costs, and operating context into faster, more traceable decisions.

This project is being built in public from day zero. The long-term vision is an open operating system for energy assets. The near-term product is much smaller and more practical: a production operations workspace for mature fields, independent operators, and engineering teams that still depend on spreadsheets, manual reports, and disconnected systems.

## Current Demo

The current working slice is a local Next.js production review shell backed by synthetic field data. It validates public-safe fixtures, ranks upstream opportunities with deterministic economics, and renders a daily production review workflow.

Run it locally:

```bash
git clone https://github.com/lucasgday/energy-os.git
cd energy-os
corepack enable
pnpm install
pnpm --filter @energy-os/web dev
```

Then open:

```txt
http://localhost:3000
```

Useful checks:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Recommended runtime: Node.js 20 or 22 with pnpm 10.

## What This Is

- A public blueprint for an open upstream production operating layer.
- A domain model for wells, production, deferments, interventions, opportunities, economics, and decision journaling.
- A synthetic-data-first project that can be tested without exposing real field data.
- A working local demo for daily production surveillance, opportunity ranking, and decision review.
- A foundation for SaaS, self-hosted deployments, and enterprise integrations.

## What This Is Not

- Not a SCADA replacement.
- Not autonomous control of physical equipment.
- Not a replacement for OSDU, Energistics, PI, SAP, Maximo, or existing control systems.
- Not a place to publish real production data, customer data, credentials, or confidential asset information.
- Not a place to publish tenders, bids, contracts, invoices, bank details, commercial negotiations, realized prices, or customer terms.
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
.github/
  ISSUE_TEMPLATE/
apps/
  web/
docs/
  contributor-paths.md
  deployment.md
  thesis.md
  roadmap.md
  product-blueprint.md
  domain-model.md
  technical-direction.md
  public-data-sources.md
  build-in-public.md
datasets/
  synthetic-field-v0/
packages/
  domain/
  data-import/
  economics/
schemas/
  wells.schema.json
  production-events.schema.json
  deferments.schema.json
  opportunities.schema.json
```

## How To Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md), then pick the path that fits your background in [docs/contributor-paths.md](docs/contributor-paths.md).

The most useful contributor profiles right now:

- **Petroleum engineers:** review the domain model, deferment categories, opportunity logic, and daily production workflow.
- **Data engineers:** map public datasets such as Argentina Capitulo IV, EIA, RRC, and BSEE into Energy OS schemas.
- **Frontend engineers:** improve the production review workflow, responsive layout, and decision review ergonomics.
- **AI/agents builders:** help design permissioned, auditable agent workflows before any private email, contract, purchasing, payment, or sales integrations.
- **Docs/product contributors:** make workflows, issue specs, and synthetic examples clearer.

Good first contributions should be small, public-data-safe, and easy to verify locally. Look for `good first issue`, `help wanted`, and area labels in the GitHub issue tracker.

## Deployment

The public demo should stay synthetic-data-only. Preview deployment notes are in [docs/deployment.md](docs/deployment.md).

## Build In Public

When useful, we publish decisions, roadmap changes, domain assumptions, and synthetic datasets openly. Real operator feedback may be summarized only when it can be made non-confidential and non-identifying.

The default rule is:

> Open by default. Private only when data, safety, security, or commercial trust requires it.

See [docs/build-in-public.md](docs/build-in-public.md).

## License

Energy OS is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
