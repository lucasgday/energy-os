# Contributor Paths

Energy OS needs contributors who understand upstream operations, data pipelines, product workflows, and trustworthy software. Pick the path closest to your background and start with a small issue.

## Petroleum Engineers and Operators

Best first contributions:

- Review `docs/domain-model.md` for petroleum terminology and missing fields.
- Review deferment categories, production variance logic, and intervention/opportunity assumptions.
- Suggest synthetic examples for mature-field operating problems.
- Validate whether the daily production review screen matches how production meetings actually work.

Useful outputs:

- A GitHub issue with proposed domain corrections and acceptance criteria.
- Synthetic examples that do not represent a real asset.
- Notes on units, lift types, downtime causes, or decision workflow gaps.

Do not share real well names, production exports, operating procedures, or confidential asset context.

## Data Engineers

Best first contributions:

- Map Argentina Capitulo IV columns to `Well` and `ProductionEvent`.
- Add mapping notes for EIA, RRC, or BSEE public datasets.
- Improve CSV import tests while preserving original source values.
- Add unit conversion notes for oil, gas, water, uptime, and dates.

Useful outputs:

- Mapping tables from public source columns to Energy OS fields.
- Importer tests using tiny synthetic or license-reviewed public samples.
- Notes on source licenses, attribution, units, and coverage gaps.

Do not commit large raw public dumps until license, size, and sensitivity have been reviewed.

## Frontend Engineers

Best first contributions:

- Improve the read-only production review workflow in `apps/web`.
- Tighten mobile and tablet layout for the dashboard.
- Add empty, loading, and validation-error states for importer workflows.
- Improve accessibility and keyboard navigation for review controls.

Useful outputs:

- Focused PRs against one screen or component area.
- Screenshots or short notes showing desktop and mobile verification.
- Tests for data transformation logic where UI depends on derived values.

Keep the UI operational and decision-focused. Avoid marketing-page patterns inside the app.

## AI and Agent Builders

Best first contributions:

- Design permission scopes for future agent tools such as `read_email`, `draft_reply`, `extract_contract_terms`, or `prepare_payment_batch`.
- Propose audit log records for agent-generated drafts and recommendations.
- Write synthetic contract, invoice, email, or purchase-order examples for future tests.
- Identify approval gates for outbound email, bid submission, contract changes, purchase orders, payments, and sales commitments.

Useful outputs:

- Design notes in docs.
- Synthetic fixtures only.
- Threat-model or auditability notes before implementation.

Do not connect agents to real email, contracts, treasury, accounting, purchasing, payment, or sales workflows in the public repo.

## Product and Docs Contributors

Best first contributions:

- Improve README setup and workflow explanations.
- Turn roadmap items into clear issues with acceptance criteria.
- Clarify public data rules and examples.
- Document field-review workflows in a way engineers and operators can critique.

Useful outputs:

- Issue specs with context, expected output, acceptance criteria, and public-data constraints.
- Decision notes that make tradeoffs explicit.
- Small docs PRs that reduce onboarding friction.

## Good First Contribution Shape

A good first contribution is:

- Small enough to review in one sitting.
- Reproducible with synthetic or approved public data.
- Linked to the first wedge: upstream production decision support.
- Clear about verification: command output, test case, screenshot, or reviewed document.
- Safe for a public repository.

If in doubt, open an issue first and describe the proposed contribution without private data.
