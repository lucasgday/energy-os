# Technical Direction

## Decision

The first prototype will be **hybrid**:

- Local-first for the open source community and early contributors.
- SaaS-ready in architecture so the project can become hosted software without rewriting the product.

This means the first working system should run locally with synthetic data and no external services. It should still use boundaries that make later authentication, workspaces, hosted databases, and enterprise connectors straightforward.

## Why Hybrid

Pure local-first would make the first demo easy, but it could create shortcuts that are painful to unwind when pilots need hosted access, audit logs, or collaboration.

Pure SaaS-first would add infrastructure, credentials, deployment, and auth before the product has proven the daily production workflow.

Hybrid keeps the first slice practical:

- Anyone can clone the repo and run the demo.
- Public examples can use synthetic data only.
- Domain logic is portable.
- Data access is isolated behind a clear interface.
- Hosted deployments can reuse the same app and packages later.

## Initial Stack

- **Language:** TypeScript.
- **Web app:** Next.js App Router.
- **Package manager:** pnpm workspaces.
- **Styling:** Tailwind CSS when the app is scaffolded.
- **Validation:** JSON Schema with Ajv for import validation.
- **Local data:** versioned synthetic CSV/JSON fixtures first, then SQLite when persistence is needed.
- **Future hosted data:** Postgres through a storage adapter.
- **Testing:** Vitest for domain logic and data import tests.

## Repository Shape

Planned implementation structure:

```txt
apps/
  web/
packages/
  domain/
  economics/
  data-import/
datasets/
  synthetic-field-v0/
schemas/
```

## Boundary Rules

- Domain and economics logic must live outside the web app.
- Import validation must preserve original source values where practical.
- The web app should depend on domain packages, not duplicate domain rules.
- Storage-specific code should sit behind a small interface.
- The first prototype should not require auth, cloud credentials, or real data.
- Agent tools must be permission-scoped and auditable before they can touch email, contracts, purchasing, payments, sales, or negotiations.
- Secrets, tokens, real commercial documents, and confidential price or contract terms must never be stored in public fixtures, docs, or client-side code.

## First Vertical Slice

The first vertical slice should let a user:

1. Run the app locally.
2. Load the synthetic field dataset.
3. Review production by field and well.
4. See deferments and anomalous drops.
5. See a ranked opportunity list with simple economics.
6. Open a decision journal entry that links recommendation, evidence, and assumptions.

## Explicit Deferrals

- No authentication until the local workflow is useful.
- No production database until the synthetic import flow works.
- No AI recommendations until deterministic rules and economics are explainable.
- No real operator data in the public repo.
- No agent-managed email, contracts, treasury, accounting, purchasing, or sales until there is a private workspace model, approval workflow, and audit log.
- No autonomous outbound commercial actions until approval thresholds, legal review, and counterparty-specific rules are explicit.

## Future Agent and Confidentiality Architecture

Long-term digital-operator workflows will need a separate confidential operating layer:

- **Document intake:** email, PDFs, spreadsheets, contracts, bids, invoices, purchase orders, and customer communications.
- **Private storage:** encrypted private workspaces, document-level permissions, retention policy, and source-preserving extraction.
- **Tool permissions:** agents should receive narrow tool scopes such as `read_email`, `draft_reply`, `extract_contract_terms`, `compare_vendor_quotes`, or `prepare_payment_batch`, not unrestricted access.
- **Approval gates:** require human approval for outbound email, bid submission, contract edits, purchase orders, payments, and sales commitments.
- **Audit trail:** record source documents, agent prompts/tool calls, generated drafts, reviewer decisions, timestamps, and final actions.
- **Public development mode:** use synthetic contracts, synthetic invoices, and sanitized emails for open source examples.
