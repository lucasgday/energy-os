# Roadmap

This roadmap is intentionally narrow at the start. Energy OS begins as an upstream production operating layer, then expands only after proving value in real workflows.

## Status Legend

- `[done]` Shipped in the public repo or public demo.
- `[partial]` Started, but not complete enough to call done.
- `[next]` Recommended near-term work.
- `[planned]` Not started yet.
- `[later]` Deliberately deferred until earlier phases prove value.

Last updated: 2026-07-06.

Current stage: Phase 1, Hybrid MVP. Phase 0 is closed.

Near-term sequence:

1. Finish Argentina Capitulo IV mapping by adding the Well-side mapping and web import preset.
2. Add `PriceScenario` v0 and connect it to opportunity economics.
3. Extend import preview toward a usable local import workflow.
4. Add persisted decision journal only after import preview is useful.

Parallel validation track:

- Collect practitioner feedback on the daily production workflow, domain terms, and synthetic-data realism. This should inform issues and roadmap changes without blocking Phase 1 development.

## North Star

Reduce the time between "something changed in a well" and "the team made a traceable economic decision."

Example outcome metrics:

- Daily production review in under 30 minutes.
- Fewer uncategorized deferments.
- More opportunities ranked by economic impact.
- Less manual spreadsheet reconciliation.
- Clearer audit trail from anomaly to decision to result.

## Phase 0: Foundation

Stage: closed.

- `[done]` Publish thesis, roadmap, product blueprint, build-in-public rules, and domain model.
- `[done]` Define the v0 entities: field, well, completion, production event, deferment, intervention, opportunity, cost, price scenario, decision.
  Current state: first-pass domain model exists, and schemas exist for wells, production events, deferments, and opportunities. Price scenario, decision, intervention, completion, and cost schema work continues as Phase 1/2 schema evolution, not a Phase 0 blocker.
- `[done]` Create synthetic field data that can be safely shared.
- `[done]` Keep the scope limited to decision support.
- `[done]` Move practitioner validation into Phase 1 as a non-blocking parallel track.

Exit criteria:

- `[done]` Public documentation explains the product without overclaiming.
- `[done]` Synthetic data can represent a mature field well enough for public development.
  Current state: synthetic field v0 exists; realism review continues in the Phase 1 validation track.
- `[done]` Guardrails are documented: decision support only, synthetic or approved public data only, and no autonomous physical-control claims.

## Phase 1: Hybrid MVP

Stage: current.

- `[partial]` Import CSV or Excel files for wells, production, downtime, and costs.
  Current state: `@energy-os/data-import` parses CSV and validates domain records. The web app has a client-side CSV import preview for wells, production events, and deferments. Excel, cost imports, and applying imported rows to the active review are not started.
- `[partial]` Show field and well dashboards.
  Current state: public Next.js shell shows field summary, well surveillance, deferments, opportunities, selected opportunity detail, data sources, and in-page navigation.
- `[partial]` Record deferments and interventions.
  Current state: deferments are loaded and displayed from synthetic data. Create/edit flows and interventions are not implemented.
- `[partial]` Calculate simple decline and production variance.
  Current state: daily production deltas and uptime summary exist. Decline logic is not implemented.
- `[done]` Rank opportunities with estimated uplift, cost, and payout.
  Current state: `@energy-os/economics` ranks synthetic opportunities with deterministic economics.
- `[partial]` Maintain a decision journal.
  Current state: read-only synthetic journal exists. Persistence, approvals, and measured outcomes are not implemented.
- `[done]` Keep domain logic outside the web app so the local MVP can evolve into a hosted SaaS product.
- `[next]` Validate the daily production workflow with production engineers and operators as a non-blocking product validation track.
  Scope: review domain terms, synthetic-data realism, daily meeting flow, and workflow gaps. Convert findings into issues or roadmap changes without stopping importer, dashboard, or economics development.

Exit criteria:

- `[done]` A user can load synthetic data and run a daily production review locally.
- `[done]` The app can produce a basic list of ranked opportunities.
- `[partial]` Every recommendation links back to input data and assumptions.
  Current state: selected opportunities show evidence labels and explicit economics assumptions; richer source traceability is still needed.
- `[done]` The app runs without external services but has clear storage boundaries for future hosted deployments.

Next Phase 1 tasks:

- `[done]` Add CSV import preview to the web shell.
  Current state: client-side only, no persistence, public-safe warning, wells / production events / deferments, validation using existing packages, row-level valid/error preview.
- `[partial]` Map Argentina Capitulo IV data to `Well` and `ProductionEvent` schemas.
  Current state: monthly production mapping notes exist, `ProductionEvent` supports monthly periods and explicit volume units, and `@energy-os/data-import` maps synthetic Capitulo IV-shaped rows into unit-labeled production events while preserving source rows. Remaining scope: Well-side mapping, web import preset, official header verification, and no bulk raw-data commit until reuse terms are reviewed.
- `[next]` Add `PriceScenario` v0.
  Scope: public benchmark assumptions first; private realized prices and contract formulas remain out of the public repo.
- `[planned]` Formalize carry-over schemas for `Completion`, `Intervention`, `Cost`, and `Decision`.
  Scope: convert first-pass domain-model entities into JSON schemas after the import preview and decision journal clarify required fields. Keep source values and audit assumptions explicit.
- `[planned]` Add persisted decision journal.
  Scope: only after import preview clarifies the first useful local workflow.

## Phase 2: Pilot-Ready Workspace

Stage: after the hybrid MVP.

- `[planned]` Add authentication and operator workspaces.
- `[planned]` Support recurring data loads.
- `[planned]` Add anomaly detection for production drops, downtime, and outliers.
- `[planned]` Add opportunity lifecycle states: proposed, reviewed, approved, rejected, executed, measured.
- `[planned]` Generate daily and weekly operating reports.
- `[planned]` Export data for Excel, PDF, and BI tools.
- `[planned]` Add audit logs and role-aware access.

Exit criteria:

- `[planned]` A small operator can test the workflow with anonymized or approved data.
- `[planned]` The workspace supports a recurring production meeting.
- `[planned]` The system can show what changed, what was decided, and what happened after execution.

## Phase 3: Intelligence Layer

Stage: after a pilot-ready workspace shows repeated use.

- `[planned]` Add artificial lift diagnostics.
- `[planned]` Classify production losses and downtime patterns.
- `[planned]` Rank workovers and interventions across wells.
- `[planned]` Forecast scenarios using price, cost, and uplift assumptions.
- `[partial]` Add market price scenarios from public benchmark sources and private realized price inputs.
  Current state: public price sources are documented; `PriceScenario` schema and implementation are not done.
- `[planned]` Generate a morning production briefing with evidence links.
- `[planned]` Keep recommendations explainable and reviewable.

Exit criteria:

- `[planned]` Recommendations are useful enough to review in operating meetings.
- `[planned]` Engineers can inspect assumptions before acting.
- `[planned]` Model output is treated as decision support, not autonomous control.

## Phase 4: Enterprise Interoperability

Stage: after initial pilot usage proves integration demand.

- `[planned]` Map relevant entities to OSDU and Energistics concepts where appropriate.
- `[planned]` Add connectors for historian exports, SCADA exports, PI or AVEVA workflows, SAP, Maximo, and common data lakes.
- `[planned]` Publish a stable API.
- `[planned]` Support SaaS and self-hosted deployment.
- `[planned]` Add backup, environment, permission, and audit controls.

Exit criteria:

- `[planned]` Existing operators can adopt Energy OS without replacing core systems.
- `[planned]` Enterprise integrations are additive, not required for the open source workflow.

## Phase 5: Digital Energy Operator

Stage: after demonstrated operational impact.

- `[later]` Build a remote operations center workflow.
- `[later]` Partner with independent operators or asset owners.
- `[later]` Use Energy OS to operate mature assets with lower overhead.
- `[later]` Evaluate asset-light operating models, joint ventures, or software-enabled services.
- `[partial]` Add agent-assisted business operations: email intake, document processing, purchasing, contracts, treasury, accounting, and sales workflows.
  Current state: future modules and safety rules are documented only. Product implementation is not started.
- `[partial]` Add commercial controls for tenders, bids, contract negotiation, approvals, counterparties, obligations, and renewal dates.
  Current state: requirements are documented only.
- `[partial]` Add confidential workspaces for deal rooms, contracts, bids, pricing, and negotiations with strict access control and audit trails.
  Current state: requirements are documented only.
- `[later]` Raise capital only with evidence of operational and economic improvement.

Exit criteria:

- `[later]` There is proof that the system improves field operations.
- `[later]` The software can support a real operating model, not just reporting.
- `[later]` Agents can draft, classify, reconcile, and route business work, but material spend, contract, payment, sale, and negotiation actions remain permissioned and auditable.

## Cross-Cutting: Confidential Commercial OS

Stage: only after the production workflow and permission model are credible.

- `[partial]` Treat emails, contracts, tenders, bids, invoices, payments, price formulas, and negotiations as confidential by default.
  Current state: public policy is documented; private workspace implementation is not started.
- `[planned]` Store source documents separately from public examples and synthetic fixtures.
- `[planned]` Require role-based access, document-level permissions, redaction, retention rules, and full audit logs.
- `[planned]` Use agents for extraction, summarization, comparison, reconciliation, reminder generation, and draft preparation before autonomous execution.
- `[planned]` Require explicit approval policies for outbound emails, bids, contract changes, purchase orders, payments, customer quotes, and revenue-affecting decisions.
- `[done]` Keep negotiation strategy, counterparty terms, commercial pricing, and legal review out of the public repo.

Exit criteria:

- `[planned]` A user can trace who saw a document, what an agent changed or proposed, which sources it used, and who approved the final action.
- `[planned]` Confidential workflows can be tested with synthetic contracts, synthetic invoices, and sanitized email examples.

## Explicit Non-Goals For Now

- `[done]` No autonomous control of equipment.
- `[done]` No SCADA replacement.
- `[done]` No broad multi-energy platform before upstream production works.
- `[done]` No real field data in the public repo.
- `[done]` No black-box AI recommendations without inspectable assumptions.
- `[done]` No autonomous contract negotiation, purchasing, payments, or customer sales without explicit approval rules and auditability.
