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
- Added `@energy-os/data-import` for CSV parsing and explicit numeric conversion (`#5`).

## Pendientes

- Add domain validation package (`#3`).
- Build the first import and dashboard prototype.
- Add public issue templates and labels.
- Map Argentina Capítulo IV data to the Energy OS schema (`#8`).

## Notes

- `@energy-os/data-import` intentionally does not depend on `@energy-os/domain` yet because `#3` is still open. Wire schema/domain validation into import helpers after `#3` lands.

## To QA

- Validate the daily production meeting workflow with production engineers or operators.
- Review domain terms for petroleum engineering correctness.
- Confirm that Apache 2.0 is the desired initial license.

## Bloqueos/Decisiones

Nada por ahora.
