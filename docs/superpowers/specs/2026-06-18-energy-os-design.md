# Energy OS Initial Public Roadmap Design

Date: 2026-06-18

## Goal

Initialize Energy OS as a public, open source, build-in-public project with a clear product wedge: upstream production decision support for oil and gas operations.

## Product Positioning

Energy OS is an open source operating layer for low-headcount upstream energy operations. The first version is not a universal energy platform. It focuses on production operations: wells, production events, deferments, interventions, opportunities, economics, and decision journaling.

## Users

The first users are production engineers, operations managers, field superintendents, production analysts, and independent operator leaders.

## Scope

The initial repository should contain durable documentation and schemas, not a full application. It should make the product understandable, credible, and safe to publish.

Included:

- README and license.
- Product thesis.
- Roadmap.
- Product blueprint.
- Domain model.
- Build-in-public rules.
- Initial JSON schemas.
- Synthetic dataset placeholder and rules.
- Agent handoff document.

Excluded:

- Real field data.
- Customer or operator data.
- Secrets or infrastructure credentials.
- SCADA replacement claims.
- Autonomous equipment-control functionality.

## Architecture Direction

The first architecture should separate:

- Domain schemas for portable data contracts.
- Synthetic datasets for safe examples.
- Documentation for product, roadmap, and contribution context.
- Future apps and packages for implementation.

The initial docs should leave room for a future app structure:

```txt
apps/
  web/
packages/
  economics/
  production-model/
```

Those folders should not be created until there is an implementation plan and chosen stack.

## Data Integrity

The project must preserve original imported values where practical. Normalized fields may be added later, but importers and schemas should avoid silently destroying source context.

The public repo must not contain real production data, well lists, asset maps, credentials, or customer information.

## Verification

The initial work is considered ready when:

- Public docs are internally consistent.
- The project scope is narrow and explicit.
- Non-goals are documented.
- Schemas are valid JSON.
- No placeholders, secrets, or real data are present.
