# Contributing to Energy OS

Energy OS is open source and synthetic-data-first. Contributions should make upstream production decision support more useful without exposing real operator data or overclaiming autonomy.

## Before You Start

Read these first:

- `README.md`
- `docs/thesis.md`
- `docs/roadmap.md`
- `docs/product-blueprint.md`
- `docs/build-in-public.md`
- `docs/contributor-paths.md`

## Local Setup

```bash
git clone https://github.com/lucasgday/energy-os.git
cd energy-os
corepack enable
pnpm install
```

Run the web demo:

```bash
pnpm --filter @energy-os/web dev
```

Open:

```txt
http://localhost:3000
```

Run checks before opening a pull request:

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Public Data Rules

Do not include:

- Real well lists, asset maps, or production exports unless explicitly approved for public release.
- Customer, operator, vendor, employee, or counterparty data.
- Credentials, tokens, API keys, connection strings, or secrets.
- Tenders, bids, contracts, invoices, purchase orders, bank details, treasury records, accounting records, customer terms, negotiation strategy, or realized commercial prices.
- Safety-sensitive procedures that could affect field operations.

Use instead:

- `datasets/synthetic-field-v0`
- Small synthetic examples
- Official public source links and mapping notes
- License-reviewed public samples only when reuse terms are clear

If a contribution depends on private data, convert the case into a synthetic example before opening an issue or pull request.

## Useful Contribution Types

- Domain model corrections for upstream production workflows.
- Public data mapping notes and importer tests.
- Deterministic economics and opportunity-ranking improvements.
- Production review UI improvements using synthetic data.
- Documentation that helps contributors understand scope, safety, and setup.
- Permission, audit, and approval design for future confidential agent workflows.

## Pull Request Expectations

Keep pull requests focused. A good PR usually does one thing:

- Adds or updates a schema.
- Adds an importer or mapping note.
- Improves one screen or workflow.
- Adds tests for one package.
- Clarifies one product or technical decision.

Every PR should include:

- What changed.
- Why it matters to upstream production decision support.
- How it was verified.
- Confirmation that no private or confidential data was added.

## Quality Bar

- Preserve source values during imports where practical.
- Keep domain and economics logic outside the web app.
- Prefer deterministic, inspectable logic before AI recommendations.
- Keep the first wedge narrow: upstream production decision support.
- Do not add autonomous equipment-control claims.
- Do not add autonomous contract, purchase, payment, sales, or negotiation workflows without explicit approval and audit design.

## Questions and Proposals

Open an issue when a change needs domain discussion, public data licensing review, or product scope clarification. Include acceptance criteria and use synthetic or public examples only.
