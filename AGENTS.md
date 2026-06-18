# Agent Instructions

## Scope

These instructions apply to this repository.

## Product Context

Energy OS is an open source operating layer for low-headcount upstream energy operations. The first wedge is production operations for oil and gas assets: wells, daily production, deferments, interventions, opportunities, economics, and decision journaling.

Before substantive product or implementation work, read:

- `README.md`
- `docs/thesis.md`
- `docs/roadmap.md`
- `docs/product-blueprint.md`
- `docs/domain-model.md`
- `docs/build-in-public.md`

## Public Repo Rules

- Default to public, non-confidential documentation and synthetic data.
- Never commit real well, production, customer, operator, pricing, credential, or asset data.
- Refer to secrets by environment variable name only.
- Do not add autonomous equipment-control claims unless a safety review and explicit product decision exist.
- Keep the initial scope narrow: upstream production decision support.

## Continuity

After substantive work, update `docs/agent-handoff.md` when it changes roadmap status, implementation status, QA status, or blockers.
