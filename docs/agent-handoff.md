# Agent Handoff

## Current Status

Energy OS is initialized as an open source, build-in-public repository at `https://github.com/lucasgday/energy-os`. The first product wedge is upstream production decision support for oil and gas assets.

## Hecho

- Created initial public project framing.
- Defined roadmap phases from foundation to digital energy operator.
- Defined product blueprint and first-pass domain model.
- Added public build-in-public rules.
- Added initial JSON schemas for wells, production events, deferments, and opportunities.
- Published the initial repository to GitHub.
- Chose a hybrid prototype direction: local-first execution with SaaS-ready architecture.
- Added the Hybrid MVP Foundation implementation plan.
- Removed fixed public cadence and timeline commitments from public docs.
- Created the initial public GitHub backlog:
  - `#1` Synthetic field dataset v0.
  - `#2` pnpm TypeScript workspace.
  - `#3` domain validation package.
  - `#4` opportunity economics package.
  - `#5` CSV import helpers.
  - `#6` Next.js production review shell.
  - `#7` issue templates and labels.
- Added synthetic field dataset v0 for `#1`.
- Added pnpm TypeScript workspace baseline for `#2`.
- Added public data source documentation for Argentina and U.S. official datasets.
- Created `#8` to map Argentina Capítulo IV data to Energy OS schemas.
- Added `@energy-os/economics` for deterministic upstream opportunity economics (`#4`).
- Added `@energy-os/domain` with schema-backed validators for wells, production events, deferments, and opportunities (`#3`).
- Added `@energy-os/data-import` for CSV parsing, explicit numeric conversion, and upstream domain-validated imports (`#5`).
- Added `apps/web`, a Next.js production review shell that loads the synthetic field dataset, validates imports, ranks opportunities with deterministic economics, and shows a read-only daily review workflow (`#6`).
- Added public GitHub issue templates and type/area/priority labels with explicit public-data reminders (`#7`).
- Expanded the roadmap and product blueprint to include future digital-operator modules: agent-assisted email/document workflows, contracts, procurement, treasury, accounting, sales, confidential commercial workspaces, and approval/audit controls.
- Added commodity price source guidance: public benchmark scenarios can use EIA WTI, EIA Brent, EIA Henry Hub, and World Bank commodity data; realized prices, contract formulas, hedges, and customer terms remain private workspace inputs.
- Added a web footer link from the production review shell to the public GitHub repository.

## Pendientes

- Map Argentina Capítulo IV data to the Energy OS schema (`#8`).
- Extend the web shell beyond read-only review: import flow, persisted decision journal, and richer variance/deferment logic.
- Define a `PriceScenario` schema and connect it to opportunity economics once the importer/domain packages are ready.
- Define the confidential workspace, permission, approval, and audit model before adding real email, contract, purchasing, payment, or sales workflows.

## Notes

- `@energy-os/data-import` now depends on `@energy-os/domain` and returns `{ source, value }` records so downstream UI/import flows can preserve raw public CSV rows while working with validated Energy OS entities.
- `apps/web` reads only `datasets/synthetic-field-v0` and does not require auth, cloud services, or real operator data.
- Public price sources are only benchmark assumptions for demos and sensitivity analysis. Argentina/local realized prices should be modeled as confidential operator inputs unless an official reusable source is confirmed.

## To QA

- Validate the daily production meeting workflow with production engineers or operators.
- Manually review the GitHub issue forms in the public repo after push.
- Review domain terms for petroleum engineering correctness.
- Check the production review footer on desktop and mobile after the next web deployment.
- Confirm that Apache 2.0 is the desired initial license.

## Bloqueos/Decisiones

Nada por ahora.
