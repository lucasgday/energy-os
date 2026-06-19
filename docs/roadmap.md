# Roadmap

This roadmap is intentionally narrow at the start. Energy OS begins as an upstream production operating layer, then expands only after proving value in real workflows.

## North Star

Reduce the time between "something changed in a well" and "the team made a traceable economic decision."

Example outcome metrics:

- Daily production review in under 30 minutes.
- Fewer uncategorized deferments.
- More opportunities ranked by economic impact.
- Less manual spreadsheet reconciliation.
- Clearer audit trail from anomaly to decision to result.

## Phase 0: Foundation

Stage: first.

- Publish thesis, roadmap, product blueprint, build-in-public rules, and domain model.
- Define the v0 entities: field, well, completion, production event, deferment, intervention, opportunity, cost, price scenario, decision.
- Create synthetic field data that can be safely shared.
- Validate the daily production workflow with production engineers and operators.
- Keep the scope limited to decision support.

Exit criteria:

- Public documentation explains the product without overclaiming.
- Synthetic data can represent a mature field with realistic operating issues.
- Practitioner feedback confirms or challenges the workflow.

## Phase 1: Hybrid MVP

Stage: after foundation.

- Import CSV or Excel files for wells, production, downtime, and costs.
- Show field and well dashboards.
- Record deferments and interventions.
- Calculate simple decline and production variance.
- Rank opportunities with estimated uplift, cost, and payout.
- Maintain a decision journal.
- Keep domain logic outside the web app so the local MVP can evolve into a hosted SaaS product.

Exit criteria:

- A user can load synthetic data and run a daily production review locally.
- The app can produce a basic list of ranked opportunities.
- Every recommendation links back to input data and assumptions.
- The app runs without external services but has clear storage boundaries for future hosted deployments.

## Phase 2: Pilot-Ready Workspace

Stage: after the hybrid MVP.

- Add authentication and operator workspaces.
- Support recurring data loads.
- Add anomaly detection for production drops, downtime, and outliers.
- Add opportunity lifecycle states: proposed, reviewed, approved, rejected, executed, measured.
- Generate daily and weekly operating reports.
- Export data for Excel, PDF, and BI tools.
- Add audit logs and role-aware access.

Exit criteria:

- A small operator can test the workflow with anonymized or approved data.
- The workspace supports a recurring production meeting.
- The system can show what changed, what was decided, and what happened after execution.

## Phase 3: Intelligence Layer

Stage: after a pilot-ready workspace shows repeated use.

- Add artificial lift diagnostics.
- Classify production losses and downtime patterns.
- Rank workovers and interventions across wells.
- Forecast scenarios using price, cost, and uplift assumptions.
- Generate a morning production briefing with evidence links.
- Keep recommendations explainable and reviewable.

Exit criteria:

- Recommendations are useful enough to review in operating meetings.
- Engineers can inspect assumptions before acting.
- Model output is treated as decision support, not autonomous control.

## Phase 4: Enterprise Interoperability

Stage: after initial pilot usage proves integration demand.

- Map relevant entities to OSDU and Energistics concepts where appropriate.
- Add connectors for historian exports, SCADA exports, PI or AVEVA workflows, SAP, Maximo, and common data lakes.
- Publish a stable API.
- Support SaaS and self-hosted deployment.
- Add backup, environment, permission, and audit controls.

Exit criteria:

- Existing operators can adopt Energy OS without replacing core systems.
- Enterprise integrations are additive, not required for the open source workflow.

## Phase 5: Digital Energy Operator

Stage: after demonstrated operational impact.

- Build a remote operations center workflow.
- Partner with independent operators or asset owners.
- Use Energy OS to operate mature assets with lower overhead.
- Evaluate asset-light operating models, joint ventures, or software-enabled services.
- Raise capital only with evidence of operational and economic improvement.

Exit criteria:

- There is proof that the system improves field operations.
- The software can support a real operating model, not just reporting.

## Explicit Non-Goals For Now

- No autonomous control of equipment.
- No SCADA replacement.
- No broad multi-energy platform before upstream production works.
- No real field data in the public repo.
- No black-box AI recommendations without inspectable assumptions.
